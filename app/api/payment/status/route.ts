import { NextResponse } from "next/server";
import { razorpayKeyId } from "@/lib/razorpay";
import { isPaymentActive, FORCE_PAYMENT_OFF } from "@/lib/paymentSettings";
import { autoCoupon, toPublicCoupon } from "@/lib/coupons";
import { OFFER, discountPctBetween } from "@/lib/offer";

export const dynamic = "force-dynamic";

// GET /api/payment/status — tells the client whether a fee should be charged.
//
// Two independent things have to be true for the gate to appear:
//   • an admin has payment switched ON in /admin (settings/payment), and
//   • the server actually has the Razorpay secret (RAZORPAY_KEY_SECRET).
// If either is false the gate is skipped and the student goes straight to the
// exam — that's the admin's "payment disabled" mode, and it doubles as the
// zero-configuration path this app has always had.
//
// keyId is echoed back so a broken deployment can be diagnosed from the browser
// ("which key is production actually using?"). It is public by definition — the
// same value is handed to Razorpay Checkout on every payment.
export async function GET() {
  const { active, settings, configured } = await isPaymentActive();
  const auto = autoCoupon();
  const listPaise = Math.max(OFFER.listPaise, settings.amountPaise);
  return NextResponse.json({
    /** The only field the gate needs: charge this student or not. */
    active,
    /** Razorpay credentials present server-side. */
    configured,
    /** Admin switch on its own, for the console to display. */
    enabled: settings.enabled,
    amountPaise: settings.amountPaise,
    /** "env" = Firestore unavailable, so the admin toggle isn't in effect. */
    settingsSource: settings.source,
    /** Code-level kill switch is on — the admin toggle is overridden. */
    forcedOff: FORCE_PAYMENT_OFF,
    keyId: razorpayKeyId(),

    // ── The running campaign, so the gate renders the whole price line from a
    // single request: struck-through list price, the discount it works out to,
    // and the code it should apply for the student without being asked.
    offer: {
      active: OFFER.active,
      name: OFFER.name,
      short: OFFER.short,
      endsOnLabel: OFFER.endsOnLabel,
      endsAtISO: OFFER.endsAtISO,
      listPaise,
      discountPct: discountPctBetween(listPaise, settings.amountPaise),
      autoCoupon: auto ? toPublicCoupon(auto) : null,
    },
  });
}
