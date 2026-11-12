/** A daily cap per student on AI calls, counted in a server-only collection
 *  (`aiUsage/{bucket}_{uid}_{day}`), so one account can't run up the bill. */
import type { Firestore } from "firebase-admin/firestore";
import { ApiError } from "@/lib/institution/server";
import { dayKey } from "@/lib/progress/activity";

/** Counts one use for today and returns how many have been used (this one included). Throws 429 once `limit` is reached. */
export async function chargeDaily(db: Firestore, uid: string, bucket: string, limit: number, full: string): Promise<number> {
  const ref = db.collection("aiUsage").doc(`${bucket}_${uid}_${dayKey()}`);
  return db.runTransaction(async (tx) => {
    const n = Number((await tx.get(ref)).get("n") ?? 0);
    if (n >= limit) throw new ApiError(429, full);
    tx.set(ref, { uid, bucket, n: n + 1, at: Date.now() }, { merge: true });
    return n + 1;
  });
}
