"use client";

import type { SimState } from "@/lib/money/simulation";
import type { MonthPlan, PillarKey } from "@/lib/money/profile";
import { scopedKey } from "@/lib/progress/userStorage";

export const SIM_KEY = "onegrasp.money.sim.v1";

export interface HistoryRow {
  month: number;
  event: string;
  choice: string;
  netWorth: number;
  health: number;
  // Added later; older saved runs may not have these.
  netWorthBefore?: number;
  plan?: MonthPlan;
  pillars?: Record<PillarKey, number>;
  concept?: string;
}

export interface Run {
  world: "pocket-money" | "first-wallet" | "first-salary";
  seed: number;
  month: number;
  state: SimState;
  history: HistoryRow[];
}

export function loadRun(): Run | null {
  try {
    const raw = window.localStorage.getItem(scopedKey(SIM_KEY));
    return raw ? (JSON.parse(raw) as Run) : null;
  } catch {
    return null;
  }
}

export function saveRun(run: Run | null) {
  try {
    if (run) window.localStorage.setItem(scopedKey(SIM_KEY), JSON.stringify(run));
    else window.localStorage.removeItem(scopedKey(SIM_KEY));
  } catch {
    // Storage blocked: the run continues for this visit only.
  }
}
