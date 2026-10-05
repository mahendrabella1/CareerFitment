"use client";

/** Per-device Scam Shield tally, used by the Money Health Score's Protect pillar. */
const SCAM_KEY = "onegrasp.money.scam.v1";

export interface LocalScamTally {
  correct: number;
  total: number;
  rounds: { mode: string; correct: number; total: number; at: string }[];
}

export function loadScamTally(): LocalScamTally {
  try {
    const raw = window.localStorage.getItem(SCAM_KEY);
    if (raw) return JSON.parse(raw) as LocalScamTally;
  } catch {
    // Storage blocked: start from zero.
  }
  return { correct: 0, total: 0, rounds: [] };
}

export function addScamRound(mode: string, correct: number, total: number) {
  const t = loadScamTally();
  const next: LocalScamTally = {
    correct: t.correct + correct,
    total: t.total + total,
    rounds: [...t.rounds, { mode, correct, total, at: new Date().toISOString() }].slice(-50),
  };
  try {
    window.localStorage.setItem(SCAM_KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the tally isn't kept.
  }
  return next;
}
