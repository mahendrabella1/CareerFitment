/**
 * Server-only: tie a verified Razorpay payment to exactly one account
 * (security audit H-04). A valid signature proves a payment happened - not who
 * may use it - so without this one payment could unlock any number of
 * accounts. In one transaction it creates payments/{paymentId} owned by the
 * caller and marks users/{uid} paid with paymentVerifiedBy: "server".
 *
 *   "claimed"          - first time: recorded and the account marked paid
 *   "already_yours"    - the same account retrying (a double tap, a reload)
 *   "claimed_by_other" - another account already used this payment
 */
import type { Firestore } from "firebase-admin/firestore";

export type ClaimResult = "claimed" | "already_yours" | "claimed_by_other";

export interface PaymentClaim {
  uid: string;
  paymentId: string;
  orderId: string;
  /** What was charged, in paise (for the record; the money itself is Razorpay's). */
  amountPaise: number;
  couponCode?: string | null;
}

export const PAYMENTS_COLLECTION = "payments";

export async function claimPayment(db: Pick<Firestore, "collection" | "runTransaction">, claim: PaymentClaim): Promise<ClaimResult> {
  const payRef = db.collection(PAYMENTS_COLLECTION).doc(claim.paymentId);
  const userRef = db.collection("users").doc(claim.uid);
  return db.runTransaction(async (tx) => {
    const existing = await tx.get(payRef);
    if (existing.exists) return existing.get("uid") === claim.uid ? "already_yours" : "claimed_by_other";
    const at = new Date().toISOString();
    tx.set(payRef, { uid: claim.uid, orderId: claim.orderId, amountPaise: claim.amountPaise, couponCode: claim.couponCode ?? null, at });
    tx.set(userRef, {
      paid: true, paymentStatus: "paid", paidAt: at, paymentId: claim.paymentId,
      amountPaid: claim.amountPaise / 100, couponCode: claim.couponCode ?? null, paymentVerifiedBy: "server",
    }, { merge: true });
    return "claimed";
  });
}

/** Razorpay id formats (order_..., pay_...) - anything else is refused before any lookup. */
export const ORDER_ID_RE = /^order_[A-Za-z0-9]{6,40}$/;
export const PAYMENT_ID_RE = /^pay_[A-Za-z0-9]{6,40}$/;
