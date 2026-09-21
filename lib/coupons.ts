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
// discount, and they can't turn a ₹49 order into a ₹1 one.
//
// TO ADD OR CHANGE A CODE: use the admin console at /admin/coupons — it writes
// to the `coupons` Firestore collection this file reads (via the Admin SDK, so
// student browsers never see this read happen). Codes are matched
// case-insensitively and trimmed, so "ogfree", " OGFREE " and "OgFree" all work
// — students paste these from WhatsApp and posters, and a stray space must not
// read as "invalid code".

import { OFFER } from "@/lib/offer";
import { MIN_AMOUNT_PAISE } from "@/lib/paymentSettings";
import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";

export interface Coupon {
  /** Canonical, upper-case form of the code. */
  code: string;
  /** 100 = the fee is fully waived and no Razorpay order is created. */
  percentOff: number;
  /** Shown to the student on the payment screen once applied. */
  label: string;
  /**
   * Applied on its own when the payment screen opens. Only the first coupon
   * with this set to true is used (see autoCoupon below) — /admin/coupons
   * only lets one be marked this way at a time, so the screen, the Razorpay
   * order and /admin never disagree about which discount is "the" sale price.
   */
  auto: boolean;
  /** One-line explanation under the applied-code chip. */
  note: string;
}

// Used only when the `coupons` collection is empty or unreachable (a fresh
// deployment before an admin has opened /admin/coupons, or a Firestore
// outage) — the same two codes this app has always shipped with, so payment
// never silently breaks. Once an admin adds a real coupon in /admin/coupons,
// this fallback is never consulted again.
const FALLBACK_COUPONS: readonly Coupon[] = [
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

export const COUPONS_COLLECTION = "coupons";

/**
 * Every coupon an admin has configured. Never throws — a Firestore outage or
 * an empty collection falls back to FALLBACK_COUPONS rather than taking
 * payment down or silently accepting every code as free.
 */
export async function getCoupons(): Promise<Coupon[]> {
  if (!isFirestoreConfigured()) return [...FALLBACK_COUPONS];
  try {
    const db = await getFirestore();
    const snap = await db.collection(COUPONS_COLLECTION).get();
    if (snap.empty) return [...FALLBACK_COUPONS];
    return snap.docs.map((d) => {
      const data = d.data() as Partial<Coupon>;
      const percentOff = Math.max(0, Math.min(100, Math.round(Number(data.percentOff) || 0)));
      return {
        code: String(data.code || "").trim().toUpperCase(),
        percentOff,
        label: data.label || (percentOff >= 100 ? "Free access — 100% off" : `${percentOff}% off`),
        auto: Boolean(data.auto),
        note: data.note || (data.auto ? "Applied automatically — no code needed" : "Discount applied"),
      };
    }).filter((c) => c.code);
  } catch (e) {
    console.error("[coupons] could not read the coupons collection:", e instanceof Error ? e.message : e);
    return [...FALLBACK_COUPONS];
  }
}

/** Look up a code the student typed. Null when it isn't one of ours. */
export async function findCoupon(raw: unknown): Promise<Coupon | null> {
  const code = String(raw ?? "").trim().toUpperCase();
  if (!code) return null;
  const coupons = await getCoupons();
  return coupons.find((c) => c.code === code) ?? null;
}

/** The code applied for every student the moment the payment screen opens. */
export async function autoCoupon(): Promise<Coupon | null> {
  const coupons = await getCoupons();
  return coupons.find((c) => c.auto) ?? null;
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
export async function priceWithCoupon(basePaise: number, rawCode?: unknown): Promise<PricedFee> {
  const typed = String(rawCode ?? "").trim();
  const coupon = typed ? await findCoupon(typed) : null;
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
