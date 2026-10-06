"use client";

/**
 * Course lessons and dashboard goals a student has completed.
 *
 * Saved to the student's own `users/{uid}` document (so it follows them to
 * any device, and their institution can see it) and mirrored in per-student
 * browser storage (so it shows instantly and survives a failed write). When
 * the two disagree the newer one wins - the account copy is read once at
 * sign-in, so on this device the local copy is usually the fresher.
 */
import { doc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { scopedKey, storageScope } from "@/lib/progress/userStorage";
import type { CourseProgress, GoalProgress, LegalPractice } from "@/lib/progress/types";

interface Stamped<T> { value: T; updatedAt: number }

function readLocal<T>(key: string, legacy: (raw: unknown) => T | null): Stamped<T> | null {
  try {
    const raw = window.localStorage.getItem(scopedKey(key));
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "updatedAt" in parsed && "value" in parsed) return parsed as Stamped<T>;
    const value = legacy(parsed); // saved before progress was synced: no timestamp
    return value == null ? null : { value, updatedAt: 0 };
  } catch {
    return null;
  }
}

function writeLocal<T>(key: string, value: T, updatedAt: number): void {
  try {
    window.localStorage.setItem(scopedKey(key), JSON.stringify({ value, updatedAt }));
  } catch {
    // Storage blocked: the account copy still has it.
  }
}

/** Replaces one field of the student's progress (a field path such as
 *  "progress.courses.legal"), so an entry never keeps stale ticks from a
 *  merge. Only an existing student document is updated - a signed-in admin
 *  has none, and gets none created. */
function writeAccount(path: string, value: unknown): void {
  const uid = storageScope();
  const db = getDb();
  if (!uid || !db) return;
  updateDoc(doc(db, "users", uid), { [path]: value }).catch(() => {
    // Offline or blocked: the local copy keeps it, and the next save retries.
  });
}

// ---------------------------------------------------------------- courses

const courseKey = (key: string) => `onegrasp.course.${key}.v1`;

const asIds = (raw: unknown): string[] | null =>
  Array.isArray(raw) ? raw.filter((v): v is string => typeof v === "string") : null;

/** Lesson ids completed in a feature course. */
export function readCourseDone(key: string, account?: CourseProgress): string[] {
  const local = readLocal(courseKey(key), asIds);
  if (account && (!local || account.updatedAt > local.updatedAt)) return account.done ?? [];
  return local?.value ?? [];
}

export function saveCourseDone(key: string, done: string[], total: number): void {
  const updatedAt = Date.now();
  writeLocal(courseKey(key), done, updatedAt);
  writeAccount(`progress.courses.${key}`, { done, total, updatedAt } satisfies CourseProgress);
}

// ---------------------------------------------------------------- legal scenarios

/** Adds one finished scenario to the student's counts (never which choice). */
export function recordLegalScenario(area: string, safest: boolean, current?: LegalPractice): LegalPractice {
  const base: LegalPractice = current ?? { done: 0, safest: 0, byArea: {}, updatedAt: 0 };
  const a = base.byArea[area] ?? { done: 0, safest: 0 };
  const next: LegalPractice = {
    done: base.done + 1,
    safest: base.safest + (safest ? 1 : 0),
    byArea: { ...base.byArea, [area]: { done: a.done + 1, safest: a.safest + (safest ? 1 : 0) } },
    updatedAt: Date.now(),
  };
  writeAccount("progress.legal", next);
  return next;
}

// ---------------------------------------------------------------- goals

const goalsKey = (key: string) => `og-goals-${key}`;

const asDoneMap = (raw: unknown): Record<string, boolean> | null =>
  raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, boolean>) : null;

/** The dashboard's 30/90-day checklist ticks for one assessment result. */
export function readGoals(key: string, account?: GoalProgress): Record<string, boolean> {
  const local = readLocal(goalsKey(key), asDoneMap);
  if (account && account.key === key && (!local || account.updatedAt > local.updatedAt)) return account.done ?? {};
  return local?.value ?? {};
}

export function saveGoals(key: string, done: Record<string, boolean>, total: number): void {
  const updatedAt = Date.now();
  writeLocal(goalsKey(key), done, updatedAt);
  writeAccount("progress.goals", { key, done, total, updatedAt } satisfies GoalProgress);
}
