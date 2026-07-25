import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

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
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
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

  // Best-effort email (never blocks the flow). Uses details the client passed.
  const email = (await emailFromToken(idToken)) || String(profile?.email || "");
  const amount = Number(process.env.RAZORPAY_AMOUNT_PAISE || 100);
  sendPaidEmail(email, profile || {}, razorpay_payment_id, amount).catch(() => {});

  return NextResponse.json({ success: true, paymentId: razorpay_payment_id });
}

async function sendPaidEmail(
  email: string,
  profile: Record<string, unknown>,
  paymentId: string,
  amount: number
) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return; // optional — skip if not set
  const host = String(SMTP_HOST).replace(/^[a-z]+:\/\//i, "").replace(/[:/].*$/, "").trim();
  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } });
  const s = (v: unknown) => (v == null || v === "" ? "—" : String(v));
  const rows: [string, string][] = [
    ["Name", s(profile.name)],
    ["Email", s(email || profile.email)],
    ["Phone", s(profile.phone)],
    ["School / College / Company", s(profile.institution)],
    ["Category", s(profile.category)],
    ["Desired career", s(profile.desiredCareer)],
    ["Payment ID", s(paymentId)],
    ["Amount", `₹${(amount / 100).toFixed(2)}`],
  ];
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#111">
    <h2 style="margin:0 0 6px">Assessment fee paid ✓</h2>
    <p style="color:#555;margin:0 0 14px">A student has paid and started the assessment.</p>
    <table style="border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:5px 16px 5px 0;color:#64748b">${k}</td><td style="font-weight:600">${v}</td></tr>`)
      .join("")}</table></div>`;
  await transporter.sendMail({
    from: `OneGrasp <${SMTP_USER}>`,
    to: SMTP_USER,
    replyTo: email || undefined,
    subject: `Assessment fee paid — ${s(profile.name) || email}`,
    html,
  });
}
