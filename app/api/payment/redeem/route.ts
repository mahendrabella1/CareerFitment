import { NextResponse } from "next/server";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";
import { getPaymentSettings } from "@/lib/paymentSettings";
import { priceWithCoupon } from "@/lib/coupons";
import { identityFromToken } from "@/lib/firebaseIdentity";
import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// POST /api/payment/redeem — unlock the exam with a 100%-off coupon.
//
// This is the free twin of /api/payment/verify: there is no Razorpay order and
// so no signature to check, and the gate opens on this route's word alone. The
// code is therefore re-priced here from the admin's own fee — a request naming
// any code that isn't a full waiver is refused, so this can never become a
// "pay ₹0" bypass of the real fee.
//
// It matches the security model already in place: the signed-in client writes
// its own `paid` flag (its Firestore rule allows only its own document), which
// is why no admin credentials are required for the unlock itself. When admin
// credentials DO exist we additionally log the redemption, so the team can see
// who used a free code without trusting the browser to report it.
export async function POST(req: Request) {
  let body: {
    code?: unknown;
    idToken?: string;
    profile?: Record<string, unknown>;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const settings = await getPaymentSettings();
  if (!settings.enabled) {
    // Nobody is being charged anyway — the gate has already let them through.
    return NextResponse.json(
      { success: false, reason: "payment_disabled", message: "Payment is currently disabled." },
      { status: 409 }
    );
  }

  const priced = priceWithCoupon(settings.amountPaise, body.code);
  if (!priced.coupon) {
    return NextResponse.json(
      { success: false, reason: "invalid_coupon", message: "That coupon code isn't valid." },
      { status: 400 }
    );
  }
  if (!priced.free) {
    // A part-discount code has to go through Razorpay like any other payment.
    return NextResponse.json(
      {
        success: false,
        reason: "not_free",
        message: "This coupon reduces the fee but doesn't waive it — please complete the payment.",
        payablePaise: priced.payablePaise,
      },
      { status: 400 }
    );
  }

  const { email: tokenEmail, uid } = await identityFromToken(body.idToken);
  const p = body.profile || {};
  const email = tokenEmail || String(p.email || "");
  const name = String(p.name || "");
  const code = priced.coupon.code;

  // Audit trail — best-effort, and only where admin credentials exist.
  if (isFirestoreConfigured()) {
    try {
      const db = await getFirestore();
      await db.collection("couponRedemptions").add({
        code,
        uid: uid || null,
        email: email || null,
        name: name || null,
        phone: String(p.phone || "") || null,
        waivedPaise: settings.amountPaise,
        redeemedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error("[payment] could not log coupon redemption:", e instanceof Error ? e.message : e);
    }
  }

  // Same CRM + notification side-effects a real payment fires, marked as a
  // waiver so a ₹0 lead is never mistaken for a ₹99 one in the CRM.
  void Promise.all([
    pushLeadToCRM({
      name,
      email,
      phone: String(p.phone || ""),
      status: "paid",
      amountRupees: 0,
      message: `Fee waived with coupon ${code}.`,
    }),
    sendLeadNotificationEmail(
      {
        name,
        email: email || String(p.email || ""),
        phone: String(p.phone || ""),
        institution: String(p.institution || ""),
        category: String(p.category || ""),
        desiredCareer: String(p.desiredCareer || ""),
      },
      "paid",
      { paymentId: `COUPON-${code}`, amountRupees: 0 }
    ),
  ]);

  return NextResponse.json({ success: true, free: true, coupon: priced.coupon, method: "coupon" });
}
