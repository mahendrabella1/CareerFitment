/**
 * Server-only: the fee check behind the paid assessment (security audit C-03).
 * The browser's PaymentGate decides what to show; this decides what the
 * server will score. When payment is on (lib/paymentSettings.ts
 * isPaymentActive), the caller must be signed in and users/{uid}.paid must be
 * true - a field only the payment routes can write.
 *
 * Returns null to carry on, or the response to send. A failure to READ the
 * profile (a Firestore outage) lets the request through and is logged: losing
 * a student's finished exam is worse than one unchecked submission.
 * The free class 11-12 demo posts to its own endpoint and never comes here.
 */
import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { isPaymentActive } from "@/lib/paymentSettings";
import { bearerIdentity } from "@/lib/security/requestAuth";

export async function requirePaidCaller(req: Request): Promise<NextResponse | null> {
  const { active } = await isPaymentActive();
  if (!active) return null;
  const who = await bearerIdentity(req);
  if (!who) {
    return NextResponse.json({ success: false, reason: "sign_in", message: "Please sign in again to submit - your answers are saved.", data: null }, { status: 401 });
  }
  if (!isFirestoreConfigured()) {
    console.error("[payment gate] no Firebase admin credentials - can't check payment; letting the submission through");
    return null;
  }
  try {
    const snap = await (await getFirestore()).collection("users").doc(who.uid).get();
    if (snap.get("paid") === true) return null;
  } catch (e) {
    console.error("[payment gate] couldn't read the profile; letting the submission through:", e instanceof Error ? e.message : e);
    return null;
  }
  return NextResponse.json({ success: false, reason: "payment_required", message: "Please complete the payment to get your results - your answers are saved.", data: null }, { status: 402 });
}
