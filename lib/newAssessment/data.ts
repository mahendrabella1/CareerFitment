// Server-only data layer for the new (set-based) assessment.
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import clustersData from "@/data/career-clusters.json";
import class1112Bank from "@/data/class-11-12/questions-corrected.json";

export type Category =
  | "personality"
  | "career_interest"
  | "multiple_intelligence"
  | "emotional_intelligence"
  | "learning_styles"
  | "motivators"
  | "strengths"
  | "aptitude"
  | "subject_fit"
  | "career_fit"
  | "career_selector"
  | "creativity";


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

// Class 11-12 order matches the source spec's own numbered sections
// (1 Personality ... 8 Emotional Intelligence = the CORE, then 9 Subject
// Fit, 10 Career/Stream/Degree Fit, 11 Career Selector). "multiple_intelligence"
// now has its own real, dedicated question set in data/class-11-12/
// questions-corrected.json (the 8 Gardner MI domains) — genuinely separate
// from "strengths" (the 6 real workplace-competency domains: Problem
// Solving, Leadership, Creative Thinking, Design Thinking, Influencing,
// Strategic Thinking). They used to share the exact same MI-tagged question
// bank, which made the Strengths dimension's own page just re-display the
// Multiple Intelligence page's data under a different name. No "creativity"
// here — that 9th scored dimension was removed for 11-12 entirely (back to
// the same fixed 8 dimensions as class 9-10); its question bank entry is
// simply never pulled from once it's out of this order.
const ORDER_11_12: Category[] = [
  "personality",
  "career_interest",
  "aptitude",
  "strengths",
  "multiple_intelligence",
  "motivators",
  "learning_styles",
  "emotional_intelligence",
  "subject_fit",
  "career_fit",
  "career_selector",
];

export function categoryOrder(stage: StageKey): Category[] {
  if (stage === "9-10") return ORDER_9_10;
  if (stage === "11-12") return ORDER_11_12;
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
  creativity: { title: "Creativity & Innovation", blurb: "Explore how you approach creative thinking and innovation." },
  subject_fit: { title: "Subject & Academic Fit", blurb: "Tell us about your current stream, subjects, and how confident you feel." },
  career_fit: { title: "Career & Stream Fit", blurb: "Understand how your current education aligns with available careers." },
  career_selector: { title: "Your Career Aspiration", blurb: "What career are you thinking about? Share your thoughts." },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawQ = Record<string, any>;
type Bank = Record<string, Record<string, Record<string, RawQ[]>>>;
const BANK: Bank = mergeClass1112({
  ...(bank as unknown as Bank),
  aptitude: aptitudeBank as unknown as Bank[string],
  strengths: strengthsBank as unknown as Bank[string],
});

/**
 * Adds the "11-12" stage with actual Class 11-12 questions from the user's Excel.
 * The class1112Bank contains 81 questions across 11 categories.
 */
function mergeClass1112(base: Bank): Bank {
  const class1112 = class1112Bank as unknown as Bank;
  const out: Bank = { ...base };
  for (const [cat, stages] of Object.entries(class1112)) {
    out[cat] = { ...(out[cat] ?? {}), ...stages };
  }
  return out;
}
export const CLUSTERS = clustersData as Record<string, { cluster: string; careers: string[] }>;

/** Register category value -> question-bank life-stage tab. */
export function stageForCategory(cat: string): StageKey {
  switch (cat) {
    case "class_6":
    case "class_7":
    case "class_8": return "6-8";
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

// A handful of class 11-12 questions feed a downstream lookup that needs the
// individual item text (e.g. "Mathematics", "Engineering") rather than the
// grouped label an exam UI would normally show ("Science: Physics, ..."), so
// those two prefer `detailed_options` over `simplified_options`. Every other
// grouped question in that bank shows the shorter, friendlier simplified list.
const PREFER_DETAILED_OPTIONS = new Set(["subject_fit:1", "career_fit:1"]);

/**
 * Resolves the option list an exam question actually shows, for a raw
 * question object straight out of the bank. The class 11-12 bank has no
 * plain `options` field for grouped/text questions — only `detailed_options`
 * (fine-grained, used where the exact item text is needed downstream) and
 * `simplified_options` (fewer, grouped — the default for display). Shared by
 * the question-generation route and the scoring route so both agree on
 * exactly which option a given answer index refers to.
 */
export function optionsForQuestion(cat: Category, index: number, raw: RawQ): string[] | null {
  if (Array.isArray(raw.options)) return raw.options as string[];
  const key = `${cat}:${index}`;
  if (PREFER_DETAILED_OPTIONS.has(key) && Array.isArray(raw.detailed_options)) return raw.detailed_options as string[];
  if (Array.isArray(raw.simplified_options)) return raw.simplified_options as string[];
  if (Array.isArray(raw.detailed_options)) return raw.detailed_options as string[];
  return null;
}

const OPEN_RAW_TYPES = new Set(["open", "text_input", "text_input_multiple"]);
const NUMBER_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

/** How many options a "multiple_with_grouping" question allows, read from its
 *  free-text `instruction` ("Select ONE", "Select all that apply", "Select up
 *  to THREE", "Choose TWO") since the bank never encodes it structurally. */
export function parseMaxSelect(instruction: unknown): number | undefined {
  if (typeof instruction !== "string") return undefined;
  if (/all that apply/i.test(instruction)) return Infinity;
  const word = instruction.match(/\b(one|two|three|four|five|six)\b/i);
  if (word) return NUMBER_WORDS[word[1].toLowerCase()];
  const digit = instruction.match(/\b(\d+)\b/);
  if (digit) return parseInt(digit[1], 10);
  return undefined;
}

/**
 * The effective client-facing type and answer shape for a raw bank question,
 * resolving the class 11-12 bank's non-standard type spellings the same way
 * for both the exam UI and the scorer, so a given answer is always decoded
 * exactly the way it was collected:
 *  - "text_input" / "text_input_multiple" -> "open" (free text)
 *  - "multiple_with_grouping" whose instruction says "ONE" -> "mcq" (a single
 *    index), everything else keeps "multiple_with_grouping" (a JSON array of
 *    indices) with `maxSelect` carrying the real cap.
 */
export function resolvedQuestionType(rawType: string, instruction: unknown): { type: string; maxSelect?: number; isOpen: boolean; isMulti: boolean } {
  const maxSelect = parseMaxSelect(instruction);
  if (rawType === "multiple_with_grouping" && maxSelect === 1) {
    return { type: "mcq", maxSelect: undefined, isOpen: false, isMulti: false };
  }
  if (OPEN_RAW_TYPES.has(rawType)) {
    return { type: "open", maxSelect: undefined, isOpen: true, isMulti: false };
  }
  if (rawType === "multiple" || rawType === "multiple_with_grouping") {
    return { type: rawType, maxSelect, isOpen: false, isMulti: true };
  }
  return { type: rawType, maxSelect: undefined, isOpen: false, isMulti: false };
}
