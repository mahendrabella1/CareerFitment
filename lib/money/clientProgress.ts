"use client";

import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { SwipeGradeResult } from "@/lib/money/scoring";

const SCAM_ROUNDS = "moneyScamRounds";

export type ScamMode = "swipe" | "family" | "spot-fake" | "the-call" | "too-good";

export async function recordScamRound(uid: string, mode: ScamMode, result: Pick<SwipeGradeResult, "correct" | "total" | "accuracyPercent">): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, SCAM_ROUNDS), {
    uid, mode, correct: result.correct, total: result.total, accuracyPercent: result.accuracyPercent, createdAt: serverTimestamp(),
  });
}

/** All-time Scam Shield accuracy for the home page stat - the simple
 *  "overall % correct across every round played" version; Phase 2's full
 *  Money Health Score folds this into the Protect pillar alongside
 *  simulation signals that don't exist yet in Phase 1. */
export async function fetchScamAccuracy(uid: string): Promise<{ correct: number; total: number; accuracyPercent: number; roundsPlayed: number }> {
  const db = getDb();
  if (!db) return { correct: 0, total: 0, accuracyPercent: 0, roundsPlayed: 0 };
  const snap = await getDocs(query(collection(db, SCAM_ROUNDS), where("uid", "==", uid)));
  let correct = 0, total = 0;
  snap.forEach((d) => {
    const data = d.data() as { correct: number; total: number };
    correct += data.correct; total += data.total;
  });
  return { correct, total, accuracyPercent: total ? Math.round((correct / total) * 100) : 0, roundsPlayed: snap.size };
}
