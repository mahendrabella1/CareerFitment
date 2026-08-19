// Server-only data layer for the new (set-based) assessment.
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import clustersData from "@/data/career-clusters.json";
// Class 11-12 DEMO bank, built from the client's 2026 workbook by
// scripts/build_demo_11_12.py and scripts/build_demo_aptitude.py. It is merged
// in under its own stage key so /demo-test can serve it through the same exam
// engine and scorer as the live paper, while being unreachable from the paid
// flow: nothing maps a paying category to "11-12-demo".
import demoBank from "@/data/demo-11-12/questions.json";
import demoAptitude from "@/data/demo-11-12/aptitude.json";

export type Category =
  | "personality"
  | "career_interest"
  | "multiple_intelligence"
  | "emotional_intelligence"
  | "learning_styles"
  | "motivators"
  | "strengths"
  | "aptitude";


export type StageKey = "6-8" | "9-10" | "11-12" | "11-12-demo" | "grad" | "early" | "prof";

/** The stage /demo-test runs on. Kept as a constant so nothing hard-codes it. */
export const DEMO_STAGE: StageKey = "11-12-demo";

// Order shown in the exam. Cognitive sections (Aptitude, Strengths) come last so
// students warm up on self-report first.
export const CATEGORY_ORDER: Category[] = [
  "personality",
  "career_interest",
  "multiple_intelligence",
  "emotional_intelligence",
  "learning_styles",
  "motivators",
  "strengths",
  "aptitude",
];

// Classes 9-10 run the 60-question workbook, whose own Q.No column fixes the
// section order (Interests 1-12 · Aptitude 13-22 · Personality 23-34 ·
// Strengths 35-42 · Motivators 43-47 · Learning 48-51 · MI 52-55 · EI 56-60).
// Keeping the on-screen numbering identical to the workbook makes the bank
// reviewable against the source sheet.
const ORDER_9_10: Category[] = [
  "career_interest",
  "aptitude",
  "personality",
  "strengths",
  "motivators",
  "learning_styles",
  "multiple_intelligence",
  "emotional_intelligence",
];

// The demo paper opens on interests (the section students find easiest to
// answer honestly) and closes on aptitude, which is the only timed-feeling,
// right-or-wrong block. Warming up first and reasoning last is the same shape
// the 9-10 workbook uses.
const ORDER_11_12_DEMO: Category[] = [
  "career_interest",
  "personality",
  "strengths",
  "motivators",
  "multiple_intelligence",
  "learning_styles",
  "emotional_intelligence",
  "aptitude",
];

export function categoryOrder(stage: StageKey): Category[] {
  if (stage === "9-10") return ORDER_9_10;
  if (stage === DEMO_STAGE) return ORDER_11_12_DEMO;
  return CATEGORY_ORDER;
}

export const CATEGORY_META: Record<Category, { title: string; blurb: string }> = {
  personality: { title: "Personality", blurb: "For each situation, pick the option that feels most like you." },
  career_interest: { title: "Career Interests", blurb: "Pick the one option that most appeals to you in each situation." },
  multiple_intelligence: { title: "Multiple Intelligences", blurb: "Pick the activity or role you would naturally enjoy most." },
  emotional_intelligence: { title: "Emotional Intelligence", blurb: "Choose the response closest to what you'd genuinely do." },
  learning_styles: { title: "Learning Style", blurb: "Pick the option that best matches how you naturally learn." },
  motivators: { title: "Motivators", blurb: "For each situation, choose the option that feels MOST like you." },
  strengths: { title: "Strengths", blurb: "Situations that reveal how you naturally work. There are no wrong answers." },
  aptitude: { title: "Aptitude", blurb: "Reasoning across words, numbers, logic and shapes. Pick the single best answer." },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawQ = Record<string, any>;
type Bank = Record<string, Record<string, Record<string, RawQ[]>>>;
const BANK: Bank = mergeDemo({
  ...(bank as unknown as Bank),
  aptitude: aptitudeBank as unknown as Bank[string],
  strengths: strengthsBank as unknown as Bank[string],
});

/**
 * Adds the "11-12-demo" stage to each category without touching any existing
 * stage. Merging per category rather than replacing matters: the demo workbook
 * supplies seven self-report categories and its own aptitude, and a spread at
 * the category level would wipe out the live stages sitting beside them.
 */
function mergeDemo(base: Bank): Bank {
  const demo = demoBank as unknown as Bank;
  const out: Bank = { ...base };
  for (const [cat, stages] of Object.entries(demo)) {
    out[cat] = { ...(out[cat] ?? {}), ...stages };
  }
  out.aptitude = {
    ...(out.aptitude ?? {}),
    ...(demoAptitude as unknown as Bank[string]),
  };
  return out;
}
export const CLUSTERS = clustersData as Record<string, { cluster: string; careers: string[] }>;

/** Register category value -> question-bank life-stage tab. */
export function stageForCategory(cat: string): StageKey {
  switch (cat) {
    // Only /demo-test ever sets this category, and it is the only way to reach
    // the demo bank. The paid classes below are unaffected.
    case "class_11_12_demo": return DEMO_STAGE;
    case "class_6_8":
    case "class_6":
    case "class_7_8": return "6-8";
    case "class_9_10":
    case "class_9":
    case "class_10": return "9-10";
    case "class_11_12":
    case "class_11":
    case "class_12": return "11-12";
    case "graduate": return "grad";
    case "early_professional": return "early";
    case "experienced_professional": return "prof";
    default: return "grad";
  }
}

/** Pick a random set (1 of 10) for every category, for the given stage. */
export function pickSets(stage: StageKey): Record<Category, string> {
  const out = {} as Record<Category, string>;
  for (const c of categoryOrder(stage)) {
    const names = Object.keys(BANK[c]?.[stage] ?? {});
    out[c] = names.length ? names[Math.floor(Math.random() * names.length)] : "Set 1";
  }
  return out;
}

export function getSet(cat: Category, stage: StageKey, setName: string): RawQ[] {
  return BANK[cat]?.[stage]?.[setName] ?? [];
}
