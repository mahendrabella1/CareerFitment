import { NextResponse } from "next/server";
import crypto from "crypto";
import { pushLeadToCRM } from "@/lib/crm";
import { sendLeadNotificationEmail } from "@/lib/leadEmail";
import { razorpayKeySecret } from "@/lib/razorpay";
import { getPaymentSettings } from "@/lib/paymentSettings";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Public Firebase web API key (safe to expose) — used to resolve the caller's
// email from their ID token via the Firebase Auth REST API (no admin SDK).
const FIREBASE_API_KEY = "AIzaSyA3fUy9CkpoNf-vjrhswJQNwqy0qSr2cL0";

async function emailFromToken(idToken?: string): Promise<string> {
  if (!idToken) return "";
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) }
    );
    const data = (await res.json()) as { users?: { email?: string }[] };
    return data?.users?.[0]?.email || "";
  } catch {
    return "";
  }
}

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
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, idToken, profile } = body;
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

  // Best-effort CRM + email (never blocks the flow). Uses details the client passed.
  const email = (await emailFromToken(idToken)) || String(profile?.email || "");
  const amount = (await getPaymentSettings()).amountPaise;
  const p = profile || {};
  const name = String(p.name || "");
  void Promise.all([
    pushLeadToCRM({ name, email, phone: String(p.phone || ""), status: "paid", amountRupees: amount / 100 }),
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
