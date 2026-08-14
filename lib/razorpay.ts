// Razorpay credential resolution, shared by the /api/payment routes so the
// order, verify and status routes can never disagree about which key pair is
// in play (a mismatch surfaces to the user as "The api key provided is
// invalid" / "Authentication failed", with no hint as to which half is wrong).
//
// RAZORPAY_KEY_ID is checked before the NEXT_PUBLIC_ one because Next inlines
// NEXT_PUBLIC_* at BUILD time — even inside server code. Editing the public var
// in the host dashboard does nothing until a fresh, uncached build, so key
// rotation appears to silently fail. The server-only name is read at runtime.
//
// Both values are trimmed: a trailing newline picked up when pasting into a
// host's env UI is invisible in the dashboard but breaks Basic auth.

const BAKED_IN_KEY_ID = "rzp_live_T4fgWI2uotntDG";

/** Public Razorpay Key ID — safe to send to the browser. */
export function razorpayKeyId(): string {
  return (
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    BAKED_IN_KEY_ID
  ).trim();
}

/** Server-only Key Secret. Empty string when payment isn't configured. */
export function razorpayKeySecret(): string {
  return (process.env.RAZORPAY_KEY_SECRET || "").trim();
}

/** Assessment fee in paise, fixed server-side (4900 = ₹49). */
export function razorpayAmountPaise(): number {
  const n = Number(process.env.RAZORPAY_AMOUNT_PAISE || 4900);
  return Number.isFinite(n) && n > 0 ? n : 4900;
}
