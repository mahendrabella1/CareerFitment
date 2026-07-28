import { NextResponse } from "next/server";
import { razorpayKeyId, razorpayKeySecret, razorpayAmountPaise } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

// GET /api/payment/status — tells the client whether real payment is set up
// (i.e. the server has the Razorpay secret). When it isn't, the payment gate is
// skipped so the app stays fully usable with zero configuration. Add
// RAZORPAY_KEY_SECRET in your host's env to turn the fee on.
//
// keyId is echoed back so a broken deployment can be diagnosed from the browser
// ("which key is production actually using?"). It is public by definition — the
// same value is handed to Razorpay Checkout on every payment.
export async function GET() {
  return NextResponse.json({
    configured: Boolean(razorpayKeySecret()),
    keyId: razorpayKeyId(),
    amountPaise: razorpayAmountPaise(),
  });
}
