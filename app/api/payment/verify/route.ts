import { NextResponse } from "next/server";
import crypto from "crypto";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";
import { razorpayKeySecret } from "@/lib/razorpay";
import { getPaymentSettings } from "@/lib/paymentSettings";
import { priceWithCoupon } from "@/lib/coupons";
import { emailFromToken } from "@/lib/firebaseIdentity";

// POST /api/payment/verify — verifies the Razorpay signature server-side (the
// security-critical step; never trust the client). The signed-in client records
// "paid" in Firestore itself (allowed by the user's own security rule), so this
// route needs no admin credentials. Email is best-effort.
export async function POST(req: Request) {
  // Same trimmed value the order route authenticated with — the signature is an
  // HMAC keyed on it, so any drift here would reject every genuine payment.
  const keySecret = razorpayKeySecret();
  if (!keySecret) {
    return NextResponse.json({ success: false, message: "Payment is not configured." }, { status: 500 });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    idToken?: string;
    profile?: Record<string, unknown>;
    coupon?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, idToken, profile, coupon } = body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ success: false, message: "Missing payment details" }, { status: 400 });
  }

  // Verify signature = HMAC_SHA256(order_id|payment_id, secret).
  const expected = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");
  const sig = String(razorpay_signature);
  const valid = expected.length === sig.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  if (!valid) {
    return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
  }

  // Best-effort CRM + email (never blocks the flow). Uses details the client
  // passed. The amount is re-derived from the same coupon rules the order was
  // priced with — for REPORTING only; the money itself was fixed when Razorpay
  // accepted the order, and the signature above is what proves it was paid.
  const email = (await emailFromToken(idToken)) || String(profile?.email || "");
  const settings = await getPaymentSettings();
  const priced = priceWithCoupon(settings.amountPaise, coupon);
  const amount = priced.payablePaise;
  const p = profile || {};
  const name = String(p.name || "");
  void Promise.all([
    pushLeadToCRM({
      name,
      email,
      phone: String(p.phone || ""),
      status: "paid",
      amountRupees: amount / 100,
      message: priced.coupon ? `Coupon ${priced.coupon.code} applied.` : null,
    }),
    sendLeadNotificationEmail(
      {
        name, email: email || String(p.email || ""), phone: String(p.phone || ""),
        institution: String(p.institution || ""), category: String(p.category || ""), desiredCareer: String(p.desiredCareer || ""),
      },
      "paid",
      { paymentId: razorpay_payment_id, amountRupees: amount / 100 }
    ),
  ]);

  return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
}
