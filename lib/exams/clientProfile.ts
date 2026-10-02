"use client";

/**
 * Firestore read/write for the Entrance Exams education profile - same flat
 * top-level collection pattern as lib/startups/clientProgress.ts (no
 * server-side auth check anywhere in this app; access control is Firestore
 * security rules, not a verified ID token). Deliberately NOT a duplicate of
 * anything already on UserProfile (lib/auth/AuthProvider.tsx) - that has no
 * DOB/stream/marks fields at all, confirmed before building this.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { Profile } from "@/lib/exams/eligibility";

const EXAM_PROFILE = "examProfile";

export type ExamProfile = Profile & { interests?: string[]; updatedAt?: unknown };

export async function fetchExamProfile(uid: string): Promise<ExamProfile | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, EXAM_PROFILE, uid));
  return snap.exists() ? (snap.data() as ExamProfile) : null;
}

export async function saveExamProfile(uid: string, patch: Partial<ExamProfile>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, EXAM_PROFILE, uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}
