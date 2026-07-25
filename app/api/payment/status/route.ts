import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET /api/payment/status — tells the client whether real payment is set up
// (i.e. the server has the Razorpay secret). When it isn't, the payment gate is
// skipped so the app stays fully usable with zero configuration. Add
// RAZORPAY_KEY_SECRET in your host's env to turn the fee on.
export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.RAZORPAY_KEY_SECRET) });
}
