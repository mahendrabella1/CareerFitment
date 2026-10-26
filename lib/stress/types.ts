/**
 * Working Professionals - Workplace Stress Check (its own class group; see
 * CLAUDE.md). Types shared by the question bank, the scorer and the results
 * page. Nothing here is used by the student assessments.
 */

export type Band = "0-5" | "5-15" | "15+";
export const BANDS: Band[] = ["0-5", "5-15", "15+"];

/** The four workplace stress areas the check measures. */
export type AreaKey = "workload" | "toxicity" | "culture" | "career";
export const AREAS: AreaKey[] = ["workload", "toxicity", "culture", "career"];

export interface BankItem {
  id: string;
  area: AreaKey;
  /** What the question is about - drives the "top stress points" and the plan. */
  source: string;
  /** Short name of the stress point, shown on the results page. */
  label: string;
  text: string;
  /** Any experience of this shows "your options" on the results page. */
  rights?: "harassment" | "discrimination";
}

export interface BankArea { id: AreaKey; title: string; short: string; intro: string }
export interface Bank {
  version: string;
  about: string;
  recall: string;
  scale: { labels: string[]; values: number[] };
  areas: BankArea[];
  items: BankItem[];
  closing: { id: string; text: string; options: string[]; values: number[] };
}

/** Low < 25 <= Mild < 45 <= Moderate < 65 <= High. */
export type Level = "low" | "mild" | "moderate" | "high";
export type Support = "none" | "watch" | "high";
/** "Is it the work or the workplace?" - where the two axes put you. */
export type Quadrant = "steady" | "load" | "place" | "both";

export interface Hotspot { id: string; value: number }

export interface StressScores {
  /** Workplace Stress Score, 0-100 (higher = more stress). */
  overall: number;
  level: Level;
  /** Each area 0-100: the mean of its answers. */
  areas: Record<AreaKey, number>;
  /** Questions answered "Often" or "Almost always", strongest first. */
  hotspots: Hotspot[];
  /** Harassment or unfair treatment reported at least "Rarely". */
  rights: { harassment: boolean; discrimination: boolean };
  /** The closing "how are you coping" answer, 0-100 (higher = struggling more). */
  coping: number;
  support: Support;
  /** x = the work itself (Workload), y = the workplace (the other three: 60% mean + 40% worst). */
  compass: { work: number; place: number; quadrant: Quadrant };
  confidence: { level: "high" | "medium" | "low"; flags: string[] };
}

export interface StressResult {
  id: string;
  version: string;
  takenAt: string;
  band: Band;
  durationSec: number;
  /** Answer index per question id (0 = first option), including the closing question. */
  answers: Record<string, number>;
  scores: StressScores;
}

/** A weekly check-in: how heavy each area felt this week, 0-100. */
export interface Pulse { week: string; at: string; values: Record<AreaKey, number> }

export interface StressPlan {
  resultId: string;
  startedAt: string;
  /** The actions in the plan, in order. */
  actionIds: string[];
  /** Ticked steps, keyed "actionId:stepIndex". */
  done: Record<string, boolean>;
  pulses: Pulse[];
}

/** users/{uid}.stress - written by the person's own browser (student-writable, like gps). */
export interface StressStore {
  results: StressResult[];
  plan?: StressPlan;
}
