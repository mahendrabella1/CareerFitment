/**
 * The stress drivers - the specific causes the check predicts, each a group
 * of related questions inside one of the four areas. A driver's intensity is
 * the mean of its questions (0-100), so the results say *where the stress is
 * coming from* ("job insecurity", "time pressure") instead of echoing the
 * answers back. Every question belongs to exactly one driver
 * (tests/stress/scoring.test.mjs checks this).
 */
import type { AreaKey } from "./types";

export interface DriverDef {
  key: string;
  area: AreaKey;
  label: string;
  /** The question sources (stress-bank.json `source`) it is measured from. */
  sources: string[];
  /** What a high reading means, in one plain sentence. */
  means: string;
  /** Plan actions that address it, best first (lib/stress/content.ts ACTIONS). */
  actions: string[];
}

export const DRIVERS: DriverDef[] = [
  // Workload
  { key: "time-pressure", area: "workload", label: "Time pressure", sources: ["tasks", "deadlines", "overtime"],
    means: "More tasks and tighter deadlines than your working hours allow.", actions: ["priorities", "deadline"] },
  { key: "boundaries", area: "workload", label: "Work-life boundaries", sources: ["balance", "outside", "exhaustion"],
    means: "Work spills into personal time and leaves you drained.", actions: ["boundary", "recovery"] },
  { key: "control", area: "workload", label: "Control and clarity", sources: ["control", "excluded", "expectations", "communication", "roleconflict"],
    means: "Little say over your work, and unclear or conflicting expectations.", actions: ["clarity", "flex"] },
  // Toxic behaviour
  { key: "hostile-leadership", area: "toxicity", label: "Hostile leadership", sources: ["fearleader", "hostileteam"],
    means: "A manager or team that works through fear, blame or put-downs.", actions: ["escalate", "record"] },
  { key: "manipulation", area: "toxicity", label: "Undermining and gaslighting", sources: ["gaslighting", "credit"],
    means: "Your work or memory of events is undermined or taken from you.", actions: ["record", "visible"] },
  { key: "exclusion", area: "toxicity", label: "Gossip and exclusion", sources: ["gossip", "cliques"],
    means: "Rumours and in-groups that leave people out.", actions: ["gossip", "allies"] },
  { key: "harassment", area: "toxicity", label: "Harassment and unfair treatment", sources: ["harassment", "discrimination"],
    means: "Harassment or treatment that is unfair, unethical or discriminatory.", actions: ["rights", "record"] },
  // Culture & psychological safety
  { key: "safety", area: "culture", label: "Psychological safety", sources: ["psychsafety", "bullying"],
    means: "It doesn't feel safe to speak up, disagree or make a mistake.", actions: ["speakup", "record"] },
  { key: "support", area: "culture", label: "Support and relationships", sources: ["peers", "relations"],
    means: "Too little backing from colleagues, and strained relationships.", actions: ["allies"] },
  { key: "politics", area: "culture", label: "Office politics", sources: ["politics"],
    means: "Who gets ahead depends on politics more than on the work.", actions: ["allies", "speakup"] },
  { key: "fit-change", area: "culture", label: "Fit and change", sources: ["fit", "orgchange"],
    means: "Your values don't match the organisation, or constant change unsettles you.", actions: ["values", "change"] },
  // Career & job security
  { key: "insecurity", area: "career", label: "Job insecurity", sources: ["layoffs", "suddenloss"],
    means: "Worry about layoffs, downsizing or losing your job without warning.", actions: ["safetynet", "skills"] },
  { key: "growth", area: "career", label: "Growth and skills", sources: ["promotion", "skills"],
    means: "No visible path to promotion and no chance to learn.", actions: ["growth", "skills"] },
  { key: "pay", area: "career", label: "Pay and recognition", sources: ["costofliving", "payeffort", "recognition"],
    means: "Pay that doesn't cover your costs or match your effort, and effort that goes unnoticed.", actions: ["pay", "wins"] },
];

export const driverByKey = (key: string) => DRIVERS.find((d) => d.key === key);
