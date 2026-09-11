/**
 * Personality Testing Engine (self-contained, local-only)
 * ------------------------------------------------------------------
 * Implements the evaluation business logic for the OneGrasp personality
 * question bank. The bank ships in three formats (10 / 15 / 20 questions),
 * each with 10 distinct sets (Set 1..Set 10).
 *
 * The scoring is DATA-DRIVEN off the question bank's category columns
 * ("Main Category" + "Sub-Category / Axis") rather than hard-coded question
 * indices. For the 20-question format this reproduces the specified index
 * rules EXACTLY, and it generalizes cleanly to the 10 / 15 formats:
 *
 *   Gate A (Validity)  -> questions whose Main Category is "JEPI Validity Scale"
 *                         (rendered as a 1..5 scale).
 *   Gate B (Big Five)  -> questions whose Main Category is "Big Five (<Trait>)".
 *   Gate C (Four Temp.)-> questions whose Main Category is "Four Temperaments",
 *                         scored by the leading temperament token of the
 *                         Sub-Category. (10-question format has no dedicated
 *                         temperament section, so every question's sub-category
 *                         temperament is used instead.)
 *   Gate D (Archetype) -> dominant temperament -> archetype label.
 *
 * ---- MOCKUP DATA SHAPE (matches the master Excel columns) --------------
 * Each question object mirrors the spreadsheet columns:
 *   { setName, questionNumber, index, question, options,
 *     inputType, mainCategory, subCategory }
 * A small inline mockup of Set 1 & Set 2 lives at the bottom of this file
 * (MOCKUP_SETS) so the module works out-of-the-box; the live app loads the
 * full bank from data/personality-sets.json (all 30 sets).
 */

export type InputType = "binary" | "scale";

export interface Question {
  setName: string;
  questionNumber: string; // "Q1"
  index: number; // 1..N
  question: string;
  options: string; // "Yes / No" | "1, 2, 3, 4, 5"
  inputType: InputType;
  mainCategory: string; // e.g. "Big Five (Extraversion)"
  subCategory: string; // e.g. "Sanguine / High Social Energy"
}

export type Format = "10" | "15" | "20";

/** answers keyed by questionNumber. Binary => "Yes"|"No"; scale => "1".."5" */
export type AnswerMap = Record<string, string>;

export type Temperament =
  | "Sanguine"
  | "Choleric"
  | "Melancholic"
  | "Phlegmatic";

export type BigFiveTrait =
  | "Extraversion"
  | "Neuroticism"
  | "Openness"
  | "Conscientiousness"
  | "Agreeableness";

export interface ValidityResult {
  isValid: boolean;
  scaleSum: number;
  scaleMax: number;
  threshold: number;
  itemCount: number;
  message: string;
}

export interface DominantResult {
  dominant: string; // e.g. "Phlegmatic" or "Choleric-Phlegmatic" (ties)
  isTie: boolean;
}

/** score = points earned; max = number of items that could contribute. */
export type ScoreMax = { score: number; max: number };

export interface PersonalityReport {
  format: Format;
  setName: string;
  validity: ValidityResult;
  bigFive: Record<BigFiveTrait, ScoreMax>;
  temperaments: Record<Temperament, ScoreMax>;
  dominantTemperament: DominantResult;
  answered: number;
  total: number;
}

const TEMPERAMENTS: Temperament[] = [
  "Sanguine",
  "Choleric",
  "Melancholic",
  "Phlegmatic",
];

/** Result-adaptive descriptors for the five axes (high vs low expression). */
const BIG_FIVE_DESC: Record<BigFiveTrait, { high: string; low: string }> = {
  Extraversion: {
    high: "High social energy, expressive, active",
    low: "Reserved, prefers calm and solitude",
  },
  Neuroticism: {
    high: "High stress reactivity, emotionally sensitive",
    low: "Low stress reactivity, highly stable under pressure",
  },
  Openness: {
    high: "High interest in novelty, variety, and change",
    low: "Prefers familiarity and predictable routine",
  },
  Conscientiousness: {
    high: "Highly organized, values schedules and rules",
    low: "Flexible and spontaneous, less structured",
  },
  Agreeableness: {
    high: "Empathetic, helpful, prefers cooperative dynamics",
    low: "Direct, competitive, independently minded",
  },
};

/** Pick the high/low descriptor for a trait given its score/max ratio. */
export function bigFiveDescriptor(trait: BigFiveTrait, s: ScoreMax): string {
  if (s.max === 0) return "Not measured in this format";
  const ratio = s.score / s.max;
  return ratio >= 0.5 ? BIG_FIVE_DESC[trait].high : BIG_FIVE_DESC[trait].low;
}

const YES = (v?: string) => (v || "").trim().toLowerCase() === "yes";
const NO = (v?: string) => (v || "").trim().toLowerCase() === "no";

/** Leading temperament token of a sub-category string (handles a data typo). */
function temperamentOf(subCategory: string): Temperament | null {
  const s = (subCategory || "").toLowerCase();
  if (s.startsWith("sanguine")) return "Sanguine";
  if (s.startsWith("choleric")) return "Choleric";
  if (s.startsWith("melancholic")) return "Melancholic";
  if (s.startsWith("phlegmatic") || s.startsWith("phmetatic")) return "Phlegmatic";
  // fallback: search anywhere
  if (s.includes("sanguine")) return "Sanguine";
  if (s.includes("choleric")) return "Choleric";
  if (s.includes("melancholic")) return "Melancholic";
  if (s.includes("phlegmatic") || s.includes("phmetatic")) return "Phlegmatic";
  return null;
}

/** ---------------- Gate A: Validity (social-desirability / lie scale) ---- */
function computeValidity(questions: Question[], answers: AnswerMap): ValidityResult {
  const lieItems = questions.filter(
    (q) => q.inputType === "scale" || /jepi|validity|lie/i.test(q.mainCategory)
  );
  const itemCount = lieItems.length;
  const scaleMax = itemCount * 5;
  let scaleSum = 0;
  for (const q of lieItems) {
    const v = parseInt(answers[q.questionNumber] ?? "0", 10);
    if (!Number.isNaN(v)) scaleSum += v;
  }

  if (itemCount === 0) {
    // 10-question format has no validity scale -> cannot flag bias.
    return {
      isValid: true,
      scaleSum: 0,
      scaleMax: 0,
      threshold: 0,
      itemCount: 0,
      message: "No validity scale in this format — bias check not applicable.",
    };
  }

  // Spec: 20-question set => sum >= 14 is invalid (4 items, max 20 => 70%).
  // Generalized to other formats at the same 70% ceiling.
  const threshold = Math.ceil(0.7 * scaleMax);
  const isValid = scaleSum < threshold;
  return {
    isValid,
    scaleSum,
    scaleMax,
    threshold,
    itemCount,
    message: isValid
      ? "Responses appear candid."
      : "Notice: High probability of social desirability bias (character over-compliance).",
  };
}

/** ---------------- Gate B: Big Five tally (score + max) ----------------- */
function computeBigFive(
  questions: Question[],
  answers: AnswerMap
): Record<BigFiveTrait, ScoreMax> {
  const r: Record<BigFiveTrait, ScoreMax> = {
    Extraversion: { score: 0, max: 0 },
    Neuroticism: { score: 0, max: 0 },
    Openness: { score: 0, max: 0 },
    Conscientiousness: { score: 0, max: 0 },
    Agreeableness: { score: 0, max: 0 },
  };

  for (const q of questions) {
    const main = q.mainCategory.toLowerCase();
    const ans = answers[q.questionNumber];
    if (/validity|jepi|lie/.test(main) || q.inputType === "scale") continue;

    const isIntroversion = main.includes("introversion");
    const isStability =
      main.includes("emotional stability") || main.includes("low neuroticism");

    // Extraversion (reverse-scored for Introversion items)
    if (main.includes("extraversion") && !isIntroversion) {
      r.Extraversion.max += 1;
      if (YES(ans)) r.Extraversion.score += 1;
    } else if (isIntroversion) {
      r.Extraversion.max += 1;
      if (NO(ans)) r.Extraversion.score += 1;
    }

    // Neuroticism (reverse-scored for Emotional Stability items)
    if (main.includes("neuroticism") && !isStability) {
      r.Neuroticism.max += 1;
      if (YES(ans)) r.Neuroticism.score += 1;
    } else if (isStability) {
      r.Neuroticism.max += 1;
      if (NO(ans)) r.Neuroticism.score += 1;
    }

    if (main.includes("openness")) {
      r.Openness.max += 1;
      if (YES(ans)) r.Openness.score += 1;
    }
    if (main.includes("conscientiousness")) {
      r.Conscientiousness.max += 1;
      if (YES(ans)) r.Conscientiousness.score += 1;
    }
    // Agreeableness: dedicated Big Five item, or the 10-set's blended axes.
    // "Low Agreeableness" items are reverse-scored (Yes = less agreeable).
    if (main.includes("agreeableness")) {
      const isLowAgree = main.includes("low agreeableness");
      r.Agreeableness.max += 1;
      if (isLowAgree ? NO(ans) : YES(ans)) r.Agreeableness.score += 1;
    }
  }

  return r;
}

/** ---------------- Gate C: Four Temperaments tally (score + max) -------- */
function computeTemperaments(
  questions: Question[],
  answers: AnswerMap
): Record<Temperament, ScoreMax> {
  const r: Record<Temperament, ScoreMax> = {
    Sanguine: { score: 0, max: 0 },
    Choleric: { score: 0, max: 0 },
    Melancholic: { score: 0, max: 0 },
    Phlegmatic: { score: 0, max: 0 },
  };

  // Spec: temperament tally uses the "Four Temperaments" section only.
  let pool = questions.filter((q) =>
    q.mainCategory.toLowerCase().includes("four temperament")
  );
  // 10-question format has no dedicated section: use every binary question.
  if (pool.length === 0) {
    pool = questions.filter((q) => q.inputType === "binary");
  }

  for (const q of pool) {
    const t = temperamentOf(q.subCategory);
    if (!t) continue;
    r[t].max += 1;
    if (YES(answers[q.questionNumber])) r[t].score += 1;
  }

  return r;
}

/** ---------------- Gate D: Dominant temperament ------------------------ */
function computeDominant(
  temperaments: Record<Temperament, ScoreMax>
): DominantResult {
  // Different temperaments have different numbers of questions, so raw points
  // would structurally favour whichever has the most items. Rank by ENDORSEMENT
  // RATIO (score / max) first — a fair, per-person measure — and break ties by
  // raw score, then alphabetically. (For a fully-endorsed set this still yields
  // the same result as raw, e.g. Phlegmatic 3/3 beats Sanguine 1/1.)
  const ratio = (t: Temperament) =>
    temperaments[t].max > 0 ? temperaments[t].score / temperaments[t].max : 0;

  const maxRatio = Math.max(...TEMPERAMENTS.map(ratio));
  let leaders = TEMPERAMENTS.filter((t) => ratio(t) === maxRatio);

  if (leaders.length > 1) {
    const maxRaw = Math.max(...leaders.map((t) => temperaments[t].score));
    leaders = leaders.filter((t) => temperaments[t].score === maxRaw);
  }

  return {
    dominant: [...leaders].sort().join("-"),
    isTie: leaders.length > 1,
  };
}

/** ---------------- Public: evaluate a completed test ------------------- */
export function evaluate(
  format: Format,
  setName: string,
  questions: Question[],
  answers: AnswerMap
): PersonalityReport {
  const validity = computeValidity(questions, answers);
  const bigFive = computeBigFive(questions, answers);
  const temperaments = computeTemperaments(questions, answers);
  const dominantTemperament = computeDominant(temperaments);
  const answered = questions.filter(
    (q) => (answers[q.questionNumber] ?? "") !== ""
  ).length;

  return {
    format,
    setName,
    validity,
    bigFive,
    temperaments,
    dominantTemperament,
    answered,
    total: questions.length,
  };
}

export { TEMPERAMENTS };

/* ============================================================================
 * MOCKUP JSON (matches master Excel columns) — Set 1 & Set 2 of the 20-format.
 * The live UI loads the full bank from data/personality-sets.json; this inline
 * sample keeps the engine usable stand-alone / in tests.
 * ==========================================================================*/
export const MOCKUP_SETS: Record<string, Question[]> = {
  "Set 1": [
    { setName: "Set 1", questionNumber: "Q1", index: 1, question: "I can easily get a fun conversation started with a new classmate.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Extraversion)", subCategory: "Sanguine / High Social Energy" },
    { setName: "Set 1", questionNumber: "Q2", index: 2, question: "I make decisions quickly without overthinking them.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Extraversion)", subCategory: "Sanguine / Impulsivity" },
    { setName: "Set 1", questionNumber: "Q3", index: 3, question: "I often lose my temper or feel annoyed at school.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Neuroticism)", subCategory: "Choleric / High Stress Reactivity" },
    { setName: "Set 1", questionNumber: "Q4", index: 4, question: "My mood changes from happy to sad very quickly for no clear reason.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Neuroticism)", subCategory: "Choleric / Melancholic (Emotional Lability)" },
    { setName: "Set 1", questionNumber: "Q5", index: 5, question: "I am perfectly well-behaved and always do my chores immediately.", options: "1, 2, 3, 4, 5", inputType: "scale", mainCategory: "JEPI Validity Scale", subCategory: "Lie Check (Over-compliance)" },
    { setName: "Set 1", questionNumber: "Q6", index: 6, question: "I like to try new things, even if they seem a little scary or risky.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Openness)", subCategory: "Sanguine / Sensation Seeking" },
    { setName: "Set 1", questionNumber: "Q7", index: 7, question: "I find myself wishing people would leave me alone after a long school day.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Introversion)", subCategory: "Phlegmatic / Melancholic (Low Social Energy)" },
    { setName: "Set 1", questionNumber: "Q8", index: 8, question: "I get very nervous or stressed when I have to take a test.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Melancholic / High Stress Reactivity" },
    { setName: "Set 1", questionNumber: "Q9", index: 9, question: "I keep my room, school desk, and notes highly organized.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Melancholic / High Structure" },
    { setName: "Set 1", questionNumber: "Q10", index: 10, question: "I have never said a mean thing or lied to my parents or teachers.", options: "1, 2, 3, 4, 5", inputType: "scale", mainCategory: "JEPI Validity Scale", subCategory: "Lie Check (Over-compliance)" },
    { setName: "Set 1", questionNumber: "Q11", index: 11, question: "I am comfortable standing up to a bully or speaking my mind in class.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Choleric / Assertiveness" },
    { setName: "Set 1", questionNumber: "Q12", index: 12, question: "I enjoy imagining wild, creative stories or daydreaming.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Sanguine / Melancholic (Creativity)" },
    { setName: "Set 1", questionNumber: "Q13", index: 13, question: "I am a very peaceful person who hates fighting or arguing with anyone.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Phlegmatic / Low Stress Reactivity" },
    { setName: "Set 1", questionNumber: "Q14", index: 14, question: "I find it very easy to sit quietly and relax without needing a distraction.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Phlegmatic / High Calm" },
    { setName: "Set 1", questionNumber: "Q15", index: 15, question: "I sometimes think about past embarrassing moments over and over again.", options: "1, 2, 3, 4, 5", inputType: "scale", mainCategory: "JEPI Validity Scale", subCategory: "Melancholic / Rumination" },
    { setName: "Set 1", questionNumber: "Q16", index: 16, question: "I follow through on my schoolwork carefully and try to double-check my answers.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Conscientiousness)", subCategory: "Melancholic / High Structure" },
    { setName: "Set 1", questionNumber: "Q17", index: 17, question: "I genuinely care about how my friends feel and try to comfort them when sad.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Agreeableness)", subCategory: "Phlegmatic / High Empathy" },
    { setName: "Set 1", questionNumber: "Q18", index: 18, question: "I naturally take the lead during a group project if no one else speaks up.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Choleric / Goal-Oriented" },
    { setName: "Set 1", questionNumber: "Q19", index: 19, question: "I prefer sticking to a predictable daily routine over dynamic, unexpected changes.", options: "Yes / No", inputType: "binary", mainCategory: "Four Temperaments", subCategory: "Phlegmatic / Routine-Oriented" },
    { setName: "Set 1", questionNumber: "Q20", index: 20, question: "I have never borrowed an item from anyone without getting their explicit permission first.", options: "1, 2, 3, 4, 5", inputType: "scale", mainCategory: "JEPI Validity Scale", subCategory: "Lie Check (Over-compliance)" },
  ],
  "Set 2": [
    { setName: "Set 2", questionNumber: "Q1", index: 1, question: "I love being the life of the party or the center of attention in a game.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Extraversion)", subCategory: "Sanguine / High Social Energy" },
    { setName: "Set 2", questionNumber: "Q2", index: 2, question: "I usually blurt things out before completely thinking through them.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Extraversion)", subCategory: "Sanguine / Impulsivity" },
    { setName: "Set 2", questionNumber: "Q3", index: 3, question: "I get easily frustrated when things don't happen as fast as I want.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Neuroticism)", subCategory: "Choleric / High Stress Reactivity" },
    { setName: "Set 2", questionNumber: "Q4", index: 4, question: "I experience sudden waves of sadness or excitement without knowing why.", options: "Yes / No", inputType: "binary", mainCategory: "Big Five (Neuroticism)", subCategory: "Choleric / Melancholic (Emotional Lability)" },
    { setName: "Set 2", questionNumber: "Q5", index: 5, question: "I always listen to adults without ever muttering a complaint under my breath.", options: "1, 2, 3, 4, 5", inputType: "scale", mainCategory: "JEPI Validity Scale", subCategory: "Lie Check (Over-compliance)" },
  ],
};
