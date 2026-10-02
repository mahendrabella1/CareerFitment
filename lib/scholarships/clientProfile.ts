"use client";

/**
 * Firestore read/write for the Scholarships profile - same flat top-level
 * collection pattern as lib/exams/clientProfile.ts.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { ScholarshipProfile } from "@/lib/scholarships/eligibility";

const SCHOLARSHIP_PROFILE = "scholarshipProfile";

export type StoredScholarshipProfile = ScholarshipProfile & { updatedAt?: unknown };

export async function fetchScholarshipProfile(uid: string): Promise<StoredScholarshipProfile | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, SCHOLARSHIP_PROFILE, uid));
  return snap.exists() ? (snap.data() as StoredScholarshipProfile) : null;
}

export async function saveScholarshipProfile(uid: string, patch: Partial<StoredScholarshipProfile>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, SCHOLARSHIP_PROFILE, uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}
