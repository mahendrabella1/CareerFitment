/**
 * Money Personality, Financial Age and level, from a learner's simulated months.
 *
 * Financial Age uses benchmarks we set ourselves (a starting age per world,
 * moved by the Health Score). It is a fun estimate, not a measured norm, and
 * the UI says so. It should be recalibrated from real learner data later.
 */

export type PillarKey = "spend" | "save" | "borrow" | "grow" | "protect";

export const PILLARS: { key: PillarKey; label: string; weight: number; color: string }[] = [
  { key: "spend", label: "Spend wisely", weight: 20, color: "#f59e0b" },
  { key: "save", label: "Save", weight: 25, color: "#0ea05f" },
  { key: "borrow", label: "Borrow smart", weight: 20, color: "#2563eb" },
  { key: "grow", label: "Grow", weight: 15, color: "#7c3aed" },
  { key: "protect", label: "Protect", weight: 20, color: "#dc2626" },
];

export interface MonthPlan {
  income: number;
  needs: number;
  wants: number;
  save: number;
  grow: number;
  risky: boolean; // borrowed for a want or fell for a scam that month
}

export interface Personality {
  id: "squirrel" | "peacock" | "owl" | "tiger" | "dolphin";
  name: string;
  pattern: string;
  strength: string;
  watchOut: string;
}

export const PERSONALITIES: Record<Personality["id"], Personality> = {
  squirrel: { id: "squirrel", name: "The Squirrel", pattern: "Saver", strength: "You save a lot and spend carefully.", watchOut: "You may miss out on growth by never putting money to work." },
  peacock: { id: "peacock", name: "The Peacock", pattern: "Spender", strength: "You enjoy life and you're generous.", watchOut: "There's little cushion when a shock arrives." },
  owl: { id: "owl", name: "The Owl", pattern: "Planner", strength: "You plan steadily and stick to your goals.", watchOut: "Don't over-plan and freeze on decisions." },
  tiger: { id: "tiger", name: "The Tiger", pattern: "Risk-taker", strength: "You go for big returns.", watchOut: "You're more exposed to losses and scams." },
  dolphin: { id: "dolphin", name: "The Dolphin", pattern: "Balanced", strength: "You spend, save and grow in balance.", watchOut: "Keep it up as your income grows." },
};

export const PERSONALITY_MIN_MONTHS = 3;

export function personalityFor(months: MonthPlan[]): Personality | null {
  if (months.length < PERSONALITY_MIN_MONTHS) return null;
  const share = (k: "wants" | "save" | "grow") => months.reduce((s, m) => s + m[k] / Math.max(1, m.income), 0) / months.length;
  const wants = share("wants");
  const save = share("save");
  const grow = share("grow");
  const risky = months.filter((m) => m.risky).length;
  const saveShares = months.map((m) => m.save / Math.max(1, m.income));
  const spread = Math.max(...saveShares) - Math.min(...saveShares);

  if (risky >= 2 || grow >= 0.25) return PERSONALITIES.tiger;
  if (wants >= 0.35) return PERSONALITIES.peacock;
  if (save >= 0.2 && grow < 0.05) return PERSONALITIES.squirrel;
  if (save >= 0.1 && grow >= 0.05 && wants <= 0.3) return spread <= 0.03 ? PERSONALITIES.owl : PERSONALITIES.dolphin;
  if (save + grow >= 0.15) return PERSONALITIES.owl;
  return wants > save + grow ? PERSONALITIES.peacock : PERSONALITIES.squirrel;
}

const BASE_AGE: Record<string, number> = { "pocket-money": 12, "first-wallet": 16, "first-salary": 24, "real-life": 35 };

/** Financial Age: the world's base age, moved one year for every 5 Health Score points above or below 50. */
export function financialAge(world: string, health: number): number {
  return Math.max(6, (BASE_AGE[world] ?? 20) + Math.round((health - 50) / 5));
}

export type Level = "Money Rookie" | "Money Smart" | "Money Pro" | "Money Master";

/** Level from the Health Score sustained over the last 3 months (the lowest of the three). */
export function levelFor(healthHistory: number[]): Level | null {
  if (healthHistory.length < 3) return null;
  const sustained = Math.min(...healthHistory.slice(-3));
  if (sustained >= 80) return "Money Master";
  if (sustained >= 60) return "Money Pro";
  if (sustained >= 40) return "Money Smart";
  return "Money Rookie";
}
