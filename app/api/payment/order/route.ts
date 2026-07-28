import { NextResponse } from "next/server";
import { razorpayKeyId, razorpayKeySecret, razorpayAmountPaise } from "@/lib/razorpay";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

// POST /api/payment/order — creates a Razorpay order for the assessment fee.
// The KEY_SECRET is used only here (server-side); the KEY_ID is returned so the
// browser can open Checkout. Amount is fixed server-side (never trust the client).
export async function POST() {
  const keyId = razorpayKeyId();
  const keySecret = razorpayKeySecret();
  const amount = razorpayAmountPaise();

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
      // 401 means the Key ID and Key Secret aren't from the same pair (or one
      // was rotated). Name the Key ID in play — otherwise Razorpay's bare
      // "Authentication failed" gives no clue which half of the pair is stale.
      if (res.status === 401) {
        console.error(`[payment] Razorpay rejected key ${keyId} — Key ID/Secret pair mismatch or rotated.`);
        return NextResponse.json(
          {
            success: false,
            message: "Payment is misconfigured on this deployment. Please contact support@onegrasp.com.",
            keyId,
            reason: "razorpay_auth_failed",
          },
          { status: 502 }
        );
      }
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
