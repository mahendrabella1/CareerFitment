import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

// POST /api/payment/order — creates a Razorpay order for the assessment fee.
// The KEY_SECRET is used only here (server-side); the KEY_ID is returned so the
// browser can open Checkout. Amount is fixed server-side (never trust the client).
export async function POST() {
  // Key ID is public (used by the browser checkout) so it's safe to bake in a
  // fallback; the amount defaults to ₹1 for testing. The SECRET is intentionally
  // env-only — it must NEVER be committed (GitHub would auto-revoke it).
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_live_T4fgWI2uotntDG";
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const amount = Number(process.env.RAZORPAY_AMOUNT_PAISE || 100); // paise — ₹1 test default

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { success: false, message: "Payment is not configured on this deployment." },
      { status: 500 }
    );
  }

  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount,
        currency: "INR",
        receipt: `og_${Date.now()}`,
        notes: { purpose: "assessment_fee" },
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data?.error?.description || "Could not create the order." },
        { status: 502 }
      );
    }
    return NextResponse.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Order error" },
      { status: 500 }
    );
  }
}
