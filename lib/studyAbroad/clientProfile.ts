"use client";

/**
 * Firestore read/write for saved ROI calculator inputs - same flat
 * top-level collection pattern as lib/exams/clientProfile.ts. Lets a
 * student come back and re-run the same numbers without retyping them.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { RoiInput } from "@/lib/studyAbroad/roi";

const ROI_INPUTS = "studyAbroadRoiInputs";

export type StoredRoiInput = Partial<RoiInput> & { countryCode?: string; courseSlug?: string; updatedAt?: unknown };

export async function fetchRoiInput(uid: string): Promise<StoredRoiInput | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, ROI_INPUTS, uid));
  return snap.exists() ? (snap.data() as StoredRoiInput) : null;
}

export async function saveRoiInput(uid: string, patch: StoredRoiInput): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, ROI_INPUTS, uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}
