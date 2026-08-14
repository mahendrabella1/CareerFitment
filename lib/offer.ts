// The live promotional offer — ONE source of truth for every price the site
// shows and every discount the server will honour.
//
// Safe to import from client components: nothing here is a secret, and the
// numbers the student is *charged* still come from the server
// (lib/paymentSettings.ts → settings/payment), never from this file. What lives
// here is the campaign wrapper around that price: the struck-through list
// price, the campaign name, and the two coupon codes.
//
// TO END THE SALE: set `active: false` below and redeploy. The banner and the
// sale badging disappear; the fee itself is unchanged (it is whatever the admin
// has set in /admin). Nothing expires by itself — `endsAtISO` is display text
// and the countdown only, so the site can never quietly change its own pricing
// on a date nobody is watching.

export const OFFER = {
  /** Master switch for all sale UI (banner, strike-through, discount badges). */
  active: true,

  /** Campaign name, shown in the banner and on the payment screen. */
  name: "August 15 Freedom Sale",
  short: "Freedom Sale",

  /** Undiscounted list price in paise (99900 = ₹999). DISPLAY ONLY. */
  listPaise: 99900,

  /**
   * The advertised sale price in paise (4900 = ₹49), used as the FALLBACK for
   * marketing copy on pages that have no reason to call the API. The amount a
   * student is actually charged is always the admin's fee from
   * /api/payment/status — keep this in step with /admin so the banner and the
   * checkout never quote different numbers.
   */
  salePaise: 4900,

  /** Headline discount, rounded for display (₹999 → ₹49 is 95.1%). */
  discountPct: 95,

  /** Last moment of the sale, IST. Used for the "ends in" countdown copy. */
  endsAtISO: "2026-08-15T23:59:59+05:30",
  /** Human form of the above, for places where a countdown would be noise. */
  endsOnLabel: "15 August",

  /** Applied for the student the moment the payment screen opens. */
  autoCouponCode: "OG15",
  /** Typed in by hand; takes the fee to zero. */
  freeCouponCode: "OGFREE",
} as const;

/** Whether sale styling (banner, strike-through, % badges) should be shown. */
export function offerIsLive(): boolean {
  return OFFER.active;
}

/** "₹49" / "₹49.50" — paise in, display string out. No stray ".00". */
export function formatPaise(paise: number): string {
  const rupees = Math.max(0, paise) / 100;
  return `₹${rupees % 1 === 0 ? rupees.toLocaleString("en-IN") : rupees.toFixed(2)}`;
}

/** Discount as a whole percent, e.g. list 99900 + payable 4900 → 95. */
export function discountPctBetween(listPaise: number, payablePaise: number): number {
  if (listPaise <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((1 - payablePaise / listPaise) * 100)));
}

/** Milliseconds until the sale's stated end — negative once it has passed. */
export function msUntilOfferEnds(now: number = Date.now()): number {
  return new Date(OFFER.endsAtISO).getTime() - now;
}
