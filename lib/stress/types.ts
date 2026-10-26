/**
 * Working Professionals - Stress & Resilience Check (its own class group; see
 * CLAUDE.md). Types shared by the question bank, the scorer and the results
 * page. Nothing here is used by the student assessments.
 */

export type Band = "0-5" | "5-15" | "15+";
export const BANDS: Band[] = ["0-5", "5-15", "15+"];

export type ScaleKey = "freq" | "degree" | "agree" | "cope";
export type SectionKey = "load" | "signals" | "burnout" | "coping" | "resilience" | "recovery" | "control" | "support" | "checkin";
export type PillarKey = "load" | "signals" | "burnout" | "coping" | "resilience" | "recovery" | "control" | "support";
export const PILLARS: PillarKey[] = ["load", "signals", "burnout", "coping", "resilience", "recovery", "control", "support"];
/** Pressure pillars: higher = more strain. Resource pillars: higher = better. */
export const PRESSURE_PILLARS: PillarKey[] = ["load", "signals", "burnout"];

export type CopeScale = "active" | "planning" | "reframing" | "emotional" | "advice" | "givingup" | "selfblame" | "substance";
export const HELPFUL_COPING: CopeScale[] = ["active", "planning", "reframing", "emotional", "advice"];
export const RISKY_COPING: CopeScale[] = ["givingup", "selfblame", "substance"];

export interface BankItem {
  id: string;
  section: SectionKey;
  text: string;
  /** Falls back to the section's scale. */
  scale?: ScaleKey;
  reverse?: boolean;
  /** Asked only in this experience band. */
  band?: Band;
  /** What a pressure item is about (workload, money...) - drives "what's driving your stress". */
  source?: string;
  sub?: string;
  /** "CBI" / "BriefCOPE" - a published instrument, asked word for word. */
  std?: "CBI" | "BriefCOPE";
  copeScale?: CopeScale;
  /** The hopelessness check-in: a high answer puts support first on the results page. */
  safety?: boolean;
}

export interface BankSection { id: SectionKey; title: string; intro: string; scale: ScaleKey }
export interface BankFact { id: string; text: string; options: { label: string; value: string }[] }
export interface Bank {
  version: string;
  about: string;
  recall: string;
  scales: Record<ScaleKey, { labels: string[]; values: number[] }>;
  sections: BankSection[];
  items: BankItem[];
  facts: BankFact[];
  citations: string[];
}

/** One screen of the test: a scored question or a fact about the work week. */
export type Step =
  | { kind: "item"; item: BankItem; section: BankSection; scale: ScaleKey }
  | { kind: "fact"; fact: BankFact; section: BankSection };

export type Zone = "thriving" | "managing" | "stretched" | "strained" | "burnout";
export type Safety = "none" | "watch" | "high";

export interface Driver { source: string; value: number }

export interface StressScores {
  /** 0-100, higher = more stress. */
  index: number;
  zone: Zone;
  /** Composite of the three pressure pillars, 0-100. */
  pressure: number;
  /** Mean of the five resource pillars, 0-100. */
  resources: number;
  /** resources - pressure: positive = resources outweigh pressure. */
  balance: number;
  pillars: Record<PillarKey, number>;
  signals: Record<"body" | "mind" | "emotions" | "behaviour", number>;
  burnout: { personal: number; work: number; band: "low" | "moderate" | "high" | "severe" };
  coping: { scales: Record<CopeScale, number>; helpful: number; risky: number };
  recovery: { sleep: number | null };
  support: { work: number; personal: number };
  drivers: Driver[];
  safety: Safety;
  confidence: { level: "high" | "medium" | "low"; flags: string[] };
}

export interface StressResult {
  id: string;
  version: string;
  takenAt: string;
  band: Band;
  durationSec: number;
  /** Answer index per item id (0 = first option). */
  answers: Record<string, number>;
  facts: Record<string, string>;
  scores: StressScores;
}

export interface StressPlan {
  resultId: string;
  actionIds: string[];
  done: Record<string, boolean>;
  checkins: { week: string; mood: number; at: string }[];
}

/** users/{uid}.stress - written by the student's own browser (student-writable, like gps). */
export interface StressStore {
  results: StressResult[];
  plan?: StressPlan;
}
