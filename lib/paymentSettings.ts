// Admin-controlled payment settings, resolved SERVER-SIDE.
//
// The admin console (/admin) writes a single Firestore document —
// `settings/payment` — holding whether the assessment fee is charged at all and
// what it costs. Every server route that touches money reads it from here, so
// the toggle and the price can never disagree between the gate the student
// sees, the order that gets created, and the amount reported to the CRM.
//
// Why server-side: the browser must not be able to choose its own price or
// declare payment "off". Firestore rules let only an admin WRITE the doc, and
// these reads go through the Admin SDK (rules bypassed) so the values are
// trusted by the time an order is created.
//
// When Firestore isn't configured on a deployment, this falls back to the env
// vars in lib/razorpay.ts and reports source: "env" — the admin UI surfaces
// that so nobody is left wondering why the toggle appears to do nothing.

import { isFirestoreConfigured, getFirestore } from "@/lib/firebase/admin";
import { razorpayAmountPaise, razorpayKeySecret } from "@/lib/razorpay";

export const PAYMENT_SETTINGS_PATH = { collection: "settings", doc: "payment" } as const;

/** Razorpay's minimum charge is ₹1; the ceiling is a sanity guard on typos. */
export const MIN_AMOUNT_PAISE = 100;
export const MAX_AMOUNT_PAISE = 10_000_000; // ₹1,00,000

export interface PaymentSettings {
  /** Admin switch: false = the fee is waived and students go straight to the exam. */
  enabled: boolean;
  /** Fee in paise (9900 = ₹99). */
  amountPaise: number;
  /** Where the values came from — "env" means the admin toggle isn't in effect. */
  source: "firestore" | "env";
}

/** Clamp an arbitrary value to a valid paise amount, or null if unusable. */
export function normaliseAmountPaise(value: unknown): number | null {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return null;
  if (n < MIN_AMOUNT_PAISE || n > MAX_AMOUNT_PAISE) return null;
  return n;
}

/**
 * Current payment settings. Never throws — a Firestore outage falls back to
 * env defaults rather than taking the assessment down.
 */
export async function getPaymentSettings(): Promise<PaymentSettings> {
  const fallback: PaymentSettings = {
    // With no admin doc yet, behaviour matches what this app did before the
    // toggle existed: the fee is on wherever Razorpay is actually configured.
    enabled: true,
    amountPaise: razorpayAmountPaise(),
    source: "env",
  };

  if (!isFirestoreConfigured()) return fallback;

  try {
    const db = await getFirestore();
    const snap = await db
      .collection(PAYMENT_SETTINGS_PATH.collection)
      .doc(PAYMENT_SETTINGS_PATH.doc)
      .get();
    // No doc yet (nobody has opened the admin control): the env defaults apply,
    // but the toggle IS wired up — the doc appears on the first save. Reporting
    // "firestore" here keeps the console from warning about a problem that
    // doesn't exist.
    if (!snap.exists) return { ...fallback, source: "firestore" };

    const data = snap.data() as { enabled?: unknown; amountPaise?: unknown } | undefined;
    return {
      // Only an explicit `false` disables it — a missing field keeps the fee on.
      enabled: data?.enabled !== false,
      amountPaise: normaliseAmountPaise(data?.amountPaise) ?? fallback.amountPaise,
      source: "firestore",
    };
  } catch (e) {
    console.error("[payment] could not read settings/payment:", e instanceof Error ? e.message : e);
    return fallback;
  }
}

/**
 * The one question every caller actually asks: should this student be charged?
 * True only when an admin has left the fee on AND Razorpay is configured with a
 * key secret — either being absent means the exam opens for free.
 */
export async function isPaymentActive(): Promise<{ active: boolean; settings: PaymentSettings; configured: boolean }> {
  const settings = await getPaymentSettings();
  const configured = Boolean(razorpayKeySecret());
  return { active: settings.enabled && configured, settings, configured };
}
