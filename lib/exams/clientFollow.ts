"use client";

/**
 * Firestore read/write for followed exams and sent-alert dedup - same flat
 * top-level collection pattern as lib/startups/clientProgress.ts.
 * examAlertsSent mirrors the spec's own AlertSent model (one doc per
 * user+exam+eventKind so a reminder is never sent twice), just written from
 * the client after a successful send rather than from a cron job (this app
 * has no cron infrastructure - see the plan's "cron -> visit-triggered"
 * adaptation note).
 */
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";

const FOLLOWED = "examsFollowed";
const ALERTS_SENT = "examAlertsSent";

export async function fetchFollowedSlugs(uid: string): Promise<string[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, FOLLOWED), where("uid", "==", uid)));
  return snap.docs.map((d) => (d.data() as { examSlug: string }).examSlug);
}

export async function followExam(uid: string, examSlug: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, FOLLOWED, `${uid}_${examSlug}`), { uid, examSlug, alerts: true, createdAt: serverTimestamp() }, { merge: true });
}

export async function unfollowExam(uid: string, examSlug: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, FOLLOWED, `${uid}_${examSlug}`));
}

export async function fetchAlertsSentKeys(uid: string): Promise<Set<string>> {
  const db = getDb();
  if (!db) return new Set();
  const snap = await getDocs(query(collection(db, ALERTS_SENT), where("uid", "==", uid)));
  return new Set(snap.docs.map((d) => {
    const data = d.data() as { examSlug: string; eventKind: string };
    return `${data.examSlug}:${data.eventKind}`;
  }));
}

export async function recordAlertSent(uid: string, examSlug: string, eventKind: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, ALERTS_SENT, `${uid}_${examSlug}_${eventKind}`), { uid, examSlug, eventKind, sentAt: serverTimestamp() });
}
