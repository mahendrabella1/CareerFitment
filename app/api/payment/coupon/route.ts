import { NextResponse } from "next/server";
import { getPaymentSettings } from "@/lib/paymentSettings";
import { priceWithCoupon, autoCoupon, toPublicCoupon } from "@/lib/coupons";
import { OFFER } from "@/lib/offer";

export const dynamic = "force-dynamic";

// POST /api/payment/coupon — price a coupon code without charging anything.
//
// The payment screen calls this twice: once on open (with the sale code, which
// it applies for the student automatically) and again whenever they type a code
// by hand. It is deliberately the ONLY way the browser learns a price for a
// code — the arithmetic lives server-side so the amount shown on screen is the
// same amount /api/payment/order will create the order for.
//
// An unknown code is not an error: it comes back 200 with valid:false, so the
// screen can say "that code isn't valid" without the student seeing a failure.
export async function POST(req: Request) {
  let body: { code?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    /* no body — price the fee with no coupon at all */
  }

  const settings = await getPaymentSettings();
  if (!settings.enabled) {
    return NextResponse.json(
      { success: false, reason: "payment_disabled", message: "Payment is currently disabled." },
      { status: 409 }
    );
  }

  const priced = priceWithCoupon(settings.amountPaise, body.code);
  const auto = autoCoupon();

  return NextResponse.json({
    success: true,
    ...priced,
    /** Convenience alias — `coupon` is null both for "no code" and "bad code". */
    valid: priced.coupon !== null,
    /** The code the screen should apply on its own, so the client never hardcodes it. */
    autoCoupon: auto ? toPublicCoupon(auto) : null,
    offer: { name: OFFER.name, short: OFFER.short, endsOnLabel: OFFER.endsOnLabel, active: OFFER.active },
  });
}
