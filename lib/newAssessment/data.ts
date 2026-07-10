// Server-only data layer for the new (set-based) assessment.
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import clustersData from "@/data/career-clusters.json";

export type Category =
  | "personality"
  | "career_interest"
  | "multiple_intelligence"
  | "emotional_intelligence"
  | "learning_styles"
  | "motivators"
  | "strengths"
  | "aptitude";


export type StageKey = "6-8" | "9-10" | "11-12" | "grad" | "early" | "prof";

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

export const CATEGORY_META: Record<Category, { title: string; blurb: string }> = {
  personality: { title: "Personality", blurb: "How you engage, decide, and recharge. Answer Yes or No — go with your instinct." },
  career_interest: { title: "Career Interests", blurb: "Pick the one option that most appeals to you in each situation." },
  multiple_intelligence: { title: "Multiple Intelligences", blurb: "Slide from 1 (not like me) to 10 (exactly like me)." },
  emotional_intelligence: { title: "Emotional Intelligence", blurb: "Choose the response closest to what you'd genuinely do." },
  learning_styles: { title: "Learning Style", blurb: "Pick the option that best matches how you naturally learn." },
  motivators: { title: "Motivators", blurb: "For each situation, choose the option that feels MOST like you." },
  strengths: { title: "Strengths", blurb: "A mix of quick puzzles and self-report. There ARE right answers here — take your time." },
  aptitude: { title: "Aptitude", blurb: "Reasoning across words, numbers, logic and shapes. Pick the single best answer." },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawQ = Record<string, any>;
type Bank = Record<string, Record<string, Record<string, RawQ[]>>>;
const BANK: Bank = {
  ...(bank as unknown as Bank),
  aptitude: aptitudeBank as unknown as Bank[string],
  strengths: strengthsBank as unknown as Bank[string],
};
export const CLUSTERS = clustersData as Record<string, { cluster: string; careers: string[] }>;

/** Register category value -> question-bank life-stage tab. */
export function stageForCategory(cat: string): StageKey {
  switch (cat) {
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
  for (const c of CATEGORY_ORDER) {
    const names = Object.keys(BANK[c]?.[stage] ?? {});
    out[c] = names.length ? names[Math.floor(Math.random() * names.length)] : "Set 1";
  }
  return out;
}

export function getSet(cat: Category, stage: StageKey, setName: string): RawQ[] {
  return BANK[cat]?.[stage]?.[setName] ?? [];
}
