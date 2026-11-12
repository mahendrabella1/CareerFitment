import { NextResponse } from "next/server";
import crypto from "crypto";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";
import { razorpayKeySecret } from "@/lib/razorpay";
import { getPaymentSettings } from "@/lib/paymentSettings";
import { priceWithCoupon } from "@/lib/coupons";
import { identityFromToken } from "@/lib/firebaseIdentity";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { ORDER_ID_RE, PAYMENT_ID_RE, claimPayment } from "@/lib/payments/claim";

// POST /api/payment/verify - verifies the Razorpay signature server-side (the
// security-critical step; never trust the client), then - when this deployment
// has Firebase admin credentials and the caller is signed in - ties the payment
// to that one account (lib/payments/claim.ts, security audit H-04): a payment
// already used by another account is refused with 409. This route is the only
// place a card/UPI payment marks an account paid - the payment fields are
// server-only in firestore.rules (audit C-03). If recording fails the client
// gets an error and retries; the payment itself is safe either way (Razorpay
// holds it, and the signature can be checked again). Email is best-effort.
export async function POST(req: Request) {
  // Same trimmed value the order route authenticated with - the signature is an
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
  if (!ORDER_ID_RE.test(String(razorpay_order_id)) || !PAYMENT_ID_RE.test(String(razorpay_payment_id)) || !/^[a-f0-9]{64}$/i.test(String(razorpay_signature))) {
    return NextResponse.json({ success: false, message: "Invalid payment details" }, { status: 400 });
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
  // priced with - for REPORTING only; the money itself was fixed when Razorpay
  // accepted the order, and the signature above is what proves it was paid.
  const who = await identityFromToken(idToken);
  const email = who.email || String(profile?.email || "");
  const settings = await getPaymentSettings();
  const priced = await priceWithCoupon(settings.amountPaise, coupon);
  const amount = priced.payablePaise;

  // One payment, one account - and only the server marks it paid.
  if (!who.uid) return NextResponse.json({ success: false, reason: "sign_in", message: "Please sign in again - your payment is safe and will be applied." }, { status: 401 });
  if (!isFirestoreConfigured()) {
    console.error("[payment/verify] no Firebase admin credentials - can't record the payment");
    return NextResponse.json({ success: false, reason: "retry", message: `Your payment went through but we couldn't record it yet. Please try again, or write to support@onegrasp.com with payment ID ${razorpay_payment_id}.` }, { status: 503 });
  }
  try {
    const result = await claimPayment(await getFirestore(), {
      uid: who.uid, paymentId: razorpay_payment_id, orderId: razorpay_order_id, amountPaise: amount, couponCode: priced.coupon?.code ?? null,
    });
    if (result === "claimed_by_other") {
      return NextResponse.json({ success: false, message: "This payment has already been used by another account. Please contact support@onegrasp.com." }, { status: 409 });
    }
    if (result === "already_yours") return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
  } catch (e) {
    console.error("[payment/verify] could not record the payment:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, reason: "retry", message: `Your payment went through but we couldn't record it yet. Please try again, or write to support@onegrasp.com with payment ID ${razorpay_payment_id}.` }, { status: 500 });
  }
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
