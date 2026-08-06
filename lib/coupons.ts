// Coupon codes and the pricing maths that turns one into a payable amount.
//
// SERVER-ONLY — this pulls in lib/paymentSettings, which reaches Firestore
// through the Admin SDK. Client components take their offer copy from
// lib/offer.ts and their prices from /api/payment/*.
//
// Why it matters that this is resolved SERVER-SIDE: the browser sends a code,
// never a price. Every route that touches money (order / coupon / redeem) calls
// `priceWithCoupon` with the admin's own fee as the base, so a student who edits
// the request can at best name a code that doesn't exist — they can't invent a
// discount, and they can't turn a ₹99 order into a ₹1 one.
//
// TO ADD OR CHANGE A CODE: edit COUPONS below and redeploy. Codes are matched
// case-insensitively and trimmed, so "ogfree", " OGFREE " and "OgFree" all work
// — students paste these from WhatsApp and posters, and a stray space must not
// read as "invalid code".

import { OFFER } from "@/lib/offer";
import { MIN_AMOUNT_PAISE } from "@/lib/paymentSettings";

export interface Coupon {
  /** Canonical, upper-case form of the code. */
  code: string;
  /** 100 = the fee is fully waived and no Razorpay order is created. */
  percentOff: number;
  /** Shown to the student on the payment screen once applied. */
  label: string;
  /**
   * Applied on its own when the payment screen opens. The sale coupon simply
   * *is* the advertised price, so it resolves to the admin's fee rather than
   * doing its own arithmetic — that keeps the screen, the Razorpay order and
   * /admin from ever disagreeing by a rupee.
   */
  auto: boolean;
  /** One-line explanation under the applied-code chip. */
  note: string;
}

const COUPONS: readonly Coupon[] = [
  {
    code: OFFER.autoCouponCode,
    percentOff: OFFER.discountPct,
    label: `${OFFER.name} — ${OFFER.discountPct}% off`,
    auto: true,
    note: "Applied automatically — no code needed",
  },
  {
    code: OFFER.freeCouponCode,
    percentOff: 100,
    label: "Free access — 100% off",
    auto: false,
    note: "Your assessment fee is fully waived",
  },
];

/** Look up a code the student typed. Null when it isn't one of ours. */
export function findCoupon(raw: unknown): Coupon | null {
  const code = String(raw ?? "").trim().toUpperCase();
  if (!code) return null;
  return COUPONS.find((c) => c.code === code) ?? null;
}

/** The code applied for every student the moment the payment screen opens. */
export function autoCoupon(): Coupon | null {
  return COUPONS.find((c) => c.auto) ?? null;
}

/** A coupon as it is safe to hand to the browser. */
export interface PublicCoupon {
  code: string;
  label: string;
  note: string;
  percentOff: number;
  auto: boolean;
}
export function toPublicCoupon(c: Coupon): PublicCoupon {
  return { code: c.code, label: c.label, note: c.note, percentOff: c.percentOff, auto: c.auto };
}

/** Everything the payment screen needs to render one price line. */
export interface PricedFee {
  /** Struck-through "was" price — the campaign list price. */
  listPaise: number;
  /** The admin's configured fee, before any hand-typed coupon. */
  basePaise: number;
  /** What the student actually pays. 0 means no Razorpay order at all. */
  payablePaise: number;
  /** listPaise − payablePaise, i.e. the saving we advertise. */
  savingPaise: number;
  /** Saving as a whole percent off the list price. */
  discountPct: number;
  /** The coupon in force, or null when the student typed nothing. */
  coupon: PublicCoupon | null;
  /** True when the fee is fully waived — use /api/payment/redeem, not /order. */
  free: boolean;
  /** True when a non-empty code was supplied and it isn't one of ours. */
  invalidCode: boolean;
}

/**
 * Resolve the payable amount. `basePaise` MUST come from getPaymentSettings()
 * — never from the request body.
 *
 * The rules, in order:
 *   • no code, or the sale code   → the admin's fee (the advertised price);
 *   • any other code              → that percent off the admin's fee;
 *   • anything under ₹1           → free, because Razorpay cannot charge it.
 */
export function priceWithCoupon(basePaise: number, rawCode?: unknown): PricedFee {
  const typed = String(rawCode ?? "").trim();
  const coupon = typed ? findCoupon(typed) : null;
  const invalidCode = typed !== "" && coupon === null;

  let payablePaise = basePaise;
  if (coupon && !coupon.auto) {
    payablePaise = Math.max(0, Math.round(basePaise * (1 - coupon.percentOff / 100)));
  }
  // Razorpay's floor is ₹1. A coupon that lands between free and ₹1 would
  // produce an order Razorpay refuses, which reaches the student as a failed
  // payment — waive the remainder instead.
  if (payablePaise > 0 && payablePaise < MIN_AMOUNT_PAISE) payablePaise = 0;

  const listPaise = Math.max(OFFER.listPaise, basePaise);
  return {
    listPaise,
    basePaise,
    payablePaise,
    savingPaise: Math.max(0, listPaise - payablePaise),
    discountPct: listPaise > 0 ? Math.max(0, Math.min(100, Math.round((1 - payablePaise / listPaise) * 100))) : 0,
    coupon: coupon ? toPublicCoupon(coupon) : null,
    free: payablePaise === 0,
    invalidCode,
  };
}
