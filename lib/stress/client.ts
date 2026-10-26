"use client";
/**
 * Saving and loading the Workplace Stress Check from the browser: results and
 * the 30-day plan live on the person's own users/{uid}.stress (student-
 * writable, like gps); the anonymous career-stage comparison goes through
 * /api/stress/benchmarks.
 */
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth } from "@/lib/firebase/client";
import { scoreStress } from "./scoring";
import { planActionsFor } from "./content";
import { BANK } from "./bank";
import type { AreaKey, Band, StressPlan, StressResult, StressStore } from "./types";

const MAX_RESULTS = 12;

/** Results from before the four-area check (v1/v2) have a different shape and
 *  can't be shown on this page - they're left out, and dropped on the next save. */
const isCurrent = (r: StressResult | undefined): r is StressResult =>
  !!r && typeof r.scores?.overall === "number" && !!r.scores?.areas;

export async function loadStress(uid: string): Promise<StressStore & { hadOlder: boolean }> {
  const db = getDb();
  if (!db) return { results: [], hadOlder: false };
  const snap = await getDoc(doc(db, "users", uid));
  const s = snap.exists() ? (snap.data().stress as StressStore | undefined) : undefined;
  const all = Array.isArray(s?.results) ? s!.results : [];
  const results = all.filter(isCurrent);
  const plan = s?.plan && results.some((r) => r.id === s.plan!.resultId) && Array.isArray(s.plan.pulses) ? s.plan : undefined;
  return { results, plan, hadOlder: all.length > results.length };
}

export function buildResult(band: Band, answers: Record<string, number>, durationSec: number): StressResult {
  return {
    id: `st_${Date.now().toString(36)}`,
    version: BANK.version,
    takenAt: new Date().toISOString(),
    band,
    durationSec,
    answers,
    scores: scoreStress(answers, durationSec),
  };
}

/** Adds a result (newest last), starts a fresh 30-day plan for it, and
 *  records the anonymous comparison scores. */
export async function saveResult(uid: string, result: StressResult): Promise<StressStore> {
  const db = getDb();
  if (!db) throw new Error("Accounts aren't configured on this deployment.");
  const prev = await loadStress(uid);
  const results = [...prev.results, result].slice(-MAX_RESULTS);
  const plan: StressPlan = {
    resultId: result.id,
    startedAt: result.takenAt,
    actionIds: planActionsFor(result.scores, result.answers),
    done: {},
    pulses: [],
  };
  await updateDoc(doc(db, "users", uid), { stress: { results, plan } });
  void submitBenchmark(result);
  return { results, plan };
}

export async function savePlan(uid: string, plan: StressPlan): Promise<void> {
  const db = getDb();
  if (!db) return;
  await updateDoc(doc(db, "users", uid), { "stress.plan": plan });
}

async function submitBenchmark(result: StressResult) {
  try {
    const token = await getFirebaseAuth()?.currentUser?.getIdToken();
    if (!token) return;
    await fetch("/api/stress/benchmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ band: result.band, overall: result.scores.overall, areas: result.scores.areas }),
    });
  } catch { /* the comparison is a nicety */ }
}

export interface Benchmarks { ready: boolean; n: number; needed?: number; overall?: number[]; areas?: Record<AreaKey, number[]> }

export async function loadBenchmarks(band: Band): Promise<Benchmarks> {
  try {
    const r = await fetch(`/api/stress/benchmarks?band=${encodeURIComponent(band)}`);
    return r.ok ? ((await r.json()) as Benchmarks) : { ready: false, n: 0 };
  } catch {
    return { ready: false, n: 0 };
  }
}

/** Where a value sits among others at the same stage, 0-100 (from the deciles). */
export function percentileFrom(deciles: number[] | undefined, value: number): number | null {
  if (!deciles || deciles.length !== 11) return null;
  if (value <= deciles[0]) return 0;
  for (let i = 1; i < 11; i++) {
    if (value <= deciles[i]) {
      const lo = deciles[i - 1], hi = deciles[i];
      return Math.round((i - 1) * 10 + (hi === lo ? 5 : ((value - lo) / (hi - lo)) * 10));
    }
  }
  return 100;
}
