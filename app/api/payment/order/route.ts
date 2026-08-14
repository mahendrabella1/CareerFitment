import { NextResponse } from "next/server";
import { razorpayKeyId, razorpayKeySecret } from "@/lib/razorpay";
import { getPaymentSettings } from "@/lib/paymentSettings";
import { priceWithCoupon } from "@/lib/coupons";

export const dynamic = "force-dynamic";
export const maxDuration = 20;

// POST /api/payment/order — creates a Razorpay order for the assessment fee.
// The KEY_SECRET is used only here (server-side); the KEY_ID is returned so the
// browser can open Checkout. Both the on/off switch and the amount come from
// the admin settings server-side — never from the client, which would otherwise
// be free to name its own price.
//
// The body may carry { coupon }. Only the CODE crosses the wire: the discount
// it is worth is recomputed here from the admin's fee, so editing the request
// can at most name a code that doesn't exist.
export async function POST(req: Request) {
  const keyId = razorpayKeyId();
  const keySecret = razorpayKeySecret();
  const settings = await getPaymentSettings();

  // Older clients (and any stale tab) POST with no body at all.
  let body: { coupon?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* no body — no coupon */
  }
  const priced = priceWithCoupon(settings.amountPaise, body.coupon);
  const amount = priced.payablePaise;

  // An admin turned the fee off. The gate should already have skipped straight
  // to the exam; refuse here too so a stale tab can't still take money.
  if (!settings.enabled) {
    return NextResponse.json(
      { success: false, message: "Payment is currently disabled.", reason: "payment_disabled" },
      { status: 409 }
    );
  }

  // A full waiver has no order to create — Razorpay cannot charge ₹0. The gate
  // sends these to /api/payment/redeem instead; say so rather than handing back
  // an amount Razorpay would reject.
  if (priced.free) {
    return NextResponse.json(
      {
        success: false,
        reason: "free_coupon",
        message: "This coupon waives the fee — no payment is needed.",
        coupon: priced.coupon,
      },
      { status: 409 }
    );
  }

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
        // The coupon rides along in the notes so a ₹49 order can be traced back
        // to the campaign that priced it, straight from the Razorpay dashboard.
        notes: {
          purpose: "assessment_fee",
          coupon: priced.coupon?.code || "none",
          listPaise: String(priced.listPaise),
        },
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
      coupon: priced.coupon,
      listPaise: priced.listPaise,
      savingPaise: priced.savingPaise,
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Order error" },
      { status: 500 }
    );
  }
}
