"use client";

/**
 * Firestore read/write for Startups progress - client-side, via the Firebase
 * client SDK, mirroring AuthProvider.tsx's own setDoc/getDoc pattern (this
 * app has no server-side Firestore auth check anywhere - identity + access
 * control come from the client's own signed-in session plus Firestore
 * security rules, not from a Route Handler verifying an ID token). Flat
 * top-level collections keyed by uid, matching lib/firebase/leads.ts's
 * convention, rather than nesting under users/{uid} - keeps the main user
 * doc small and lets each attempt/progress row be queried independently.
 */
import { collection, doc, getDoc, getDocs, limit, orderBy, query, setDoc, where, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { GradeResult } from "@/lib/startups/scoring";
import type { ProgressMap } from "@/lib/startups/unlock";

const LESSON_PROGRESS = "startupsLessonProgress";
const MODULE_TEST_PROGRESS = "startupsModuleTestProgress";
const QUIZ_ATTEMPTS = "startupsQuizAttempts";
const TASK_SUBMISSIONS = "startupsTaskSubmissions";
const PROFILE = "startupsProfile";

export interface StartupsProfile {
  defaultTrack: string;
  chosenTrack: string;
  ideaTitle?: string;
  updatedAt?: unknown;
}

export async function fetchProgress(uid: string): Promise<ProgressMap> {
  const db = getDb();
  if (!db) return { lessonBestPercent: {}, moduleTestBestPercent: {} };
  const [lessonSnap, testSnap] = await Promise.all([
    getDocs(query(collection(db, LESSON_PROGRESS), where("uid", "==", uid))),
    getDocs(query(collection(db, MODULE_TEST_PROGRESS), where("uid", "==", uid))),
  ]);
  const lessonBestPercent: Record<string, number> = {};
  lessonSnap.forEach((d) => {
    const data = d.data() as { moduleSlug: string; lessonSlug: string; bestPercent: number };
    lessonBestPercent[`${data.moduleSlug}/${data.lessonSlug}`] = data.bestPercent;
  });
  const moduleTestBestPercent: Record<string, number> = {};
  testSnap.forEach((d) => {
    const data = d.data() as { moduleSlug: string; bestPercent: number };
    moduleTestBestPercent[data.moduleSlug] = data.bestPercent;
  });
  return { lessonBestPercent, moduleTestBestPercent };
}

/** Records a lesson-quiz attempt and bumps lessonProgress's best score - the
 *  attempt log (full history) and the progress row (best-only) are separate
 *  so "what's my current status" never needs to scan every past attempt. */
export async function recordLessonAttempt(
  uid: string, trackSlug: string, moduleSlug: string, lessonSlug: string, result: GradeResult, timeTakenSec: number, passMarkPercent: number
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, QUIZ_ATTEMPTS), {
    uid, trackSlug, moduleSlug, lessonSlug, kind: "LESSON",
    score: result.score, maxScore: result.maxScore, percent: result.percent, passed: result.passed,
    timeTakenSec, skillScores: result.skillScores, createdAt: serverTimestamp(),
  });
  const progressId = `${uid}_${moduleSlug}_${lessonSlug}`;
  const prior = await getDoc(doc(db, LESSON_PROGRESS, progressId));
  const existing = prior.exists() ? ((prior.data() as { bestPercent: number }).bestPercent ?? 0) : 0;
  const bestPercent = Math.max(existing, result.percent);
  await setDoc(doc(db, LESSON_PROGRESS, progressId), {
    uid, moduleSlug, lessonSlug, bestPercent,
    status: bestPercent >= passMarkPercent ? "COMPLETED" : "IN_PROGRESS",
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function recordModuleTestAttempt(
  uid: string, trackSlug: string, moduleSlug: string, result: GradeResult, timeTakenSec: number
): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, QUIZ_ATTEMPTS), {
    uid, trackSlug, moduleSlug, kind: "MODULE_TEST",
    score: result.score, maxScore: result.maxScore, percent: result.percent, passed: result.passed,
    timeTakenSec, skillScores: result.skillScores, createdAt: serverTimestamp(),
  });
  const existing = (await fetchProgress(uid)).moduleTestBestPercent[moduleSlug] ?? 0;
  const progressId = `${uid}_${moduleSlug}`;
  await setDoc(doc(db, MODULE_TEST_PROGRESS, progressId), {
    uid, moduleSlug, bestPercent: Math.max(existing, result.percent), updatedAt: serverTimestamp(),
  }, { merge: true });
}

export async function submitTask(uid: string, moduleSlug: string, lessonSlug: string | null, kind: "task" | "mission" | "portfolio", content: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await addDoc(collection(db, TASK_SUBMISSIONS), { uid, moduleSlug, lessonSlug, kind, content, createdAt: serverTimestamp() });
}

export async function saveProfile(uid: string, patch: Partial<StartupsProfile>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, PROFILE, uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true });
}

export interface TaskSubmissionRow {
  id: string; moduleSlug: string; lessonSlug: string | null; kind: "task" | "mission" | "portfolio"; content: string; createdAt: unknown;
}
export async function fetchTaskSubmissions(uid: string): Promise<TaskSubmissionRow[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, TASK_SUBMISSIONS), where("uid", "==", uid)));
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TaskSubmissionRow, "id">) }));
}

/** Most recent MODULE_TEST attempt for this module - powers the 1-hour
 *  retry cooldown after a failed attempt (PDF section 7's "Rules"). Needs a
 *  composite Firestore index (uid + moduleSlug + kind, ordered by
 *  createdAt); if that index isn't deployed yet this throws, which the
 *  caller treats as "no cooldown info available" rather than blocking retry
 *  on an infra issue unrelated to the learner's own attempt history. */
export async function fetchLastModuleTestAttempt(uid: string, moduleSlug: string): Promise<{ createdAtMs: number; passed: boolean } | null> {
  const db = getDb();
  if (!db) return null;
  try {
    const snap = await getDocs(query(
      collection(db, QUIZ_ATTEMPTS),
      where("uid", "==", uid), where("moduleSlug", "==", moduleSlug), where("kind", "==", "MODULE_TEST"),
      orderBy("createdAt", "desc"), limit(1)
    ));
    if (snap.empty) return null;
    const data = snap.docs[0].data() as { createdAt: Timestamp | null; passed: boolean };
    if (!data.createdAt) return null;
    return { createdAtMs: data.createdAt.toMillis(), passed: data.passed };
  } catch {
    return null;
  }
}

export async function fetchSkillScoresHistory(uid: string): Promise<{ skillScores: Record<string, number> }[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(query(collection(db, QUIZ_ATTEMPTS), where("uid", "==", uid)));
  return snap.docs.map((d) => d.data() as { skillScores: Record<string, number> });
}
