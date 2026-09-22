/**
 * Class 6/7/8 "Career Discovery" question banks each carry their own global
 * question id (1-60) directly on every question - the single source of
 * truth class6Scoring.ts / class7Scoring.ts / class8Scoring.ts read from
 * (e.g. "aptitude questions are id 21-30", "responses.responses[1]" for
 * Q1). The exam UI only ever answers per-category ids ("aptitude:0" ..
 * "aptitude:9" - see app/api/new-assessment/generate/route.ts's
 * dimensionMap + grouping-by-first-appearance), so scoring an answer means
 * mapping "aptitude:3" back to whatever real global id that question
 * actually has (24, say - not 3, and not "the 24th key some object happened
 * to enumerate").
 *
 * The scoring route used to just count answers in whatever order
 * Object.entries() enumerated them (relying entirely on the client having
 * inserted them in exact display order) into a 0-indexed record - silently
 * wrong for a student who went back and re-answered a question out of
 * sequence, and off by one even in the best case, since class6/7/8Scoring.ts
 * all index 1-60. That off-by-one was invisible for classes 6/7 (a missing
 * last answer just reads as "question 60 unattempted", which those two
 * scorers tolerate) but surfaced as a hard "Question 60 not answered" error
 * for Class 8, whose validateResponsesObject checks all 60 explicitly.
 *
 * This mirrors generate/route.ts's own grouping logic so both routes agree
 * on exactly the same question order without a second copy of that logic
 * drifting out of sync - the same class of bug this whole file exists to
 * fix.
 */
import { CLASS8_QUESTIONS } from "@/lib/newAssessment/class8Questions";
import class6Data from "@/data/class6-assessment-questions.json";
import class7Data from "@/data/class7-assessment-questions.json";

export type Class678Category = "class_6" | "class_7" | "class_8";

const DIMENSION_MAP: Record<string, string> = {
  "Personality Preferences": "personality",
  "Career Interests - RIASEC": "career_interest",
  "Aptitude & Reasoning": "aptitude",
  "MI-Inspired Strength Domains": "multiple_intelligence",
  "Motivators & Values": "motivators",
  "Learning Preferences": "learning_styles",
  "Emotional & Social Awareness": "emotional_intelligence",
  "Creativity & Future Readiness": "creativity",
};

/** "category:localIndex" (as the exam UI keys its answers) -> real global
 *  question id (1-60, as class6/7/8Scoring.ts expect). */
export function class678IdMap(category: Class678Category): Record<string, number> {
  let questions: { section: string; id: number }[];
  if (category === "class_8") {
    questions = CLASS8_QUESTIONS.map((q) => ({ section: q.dimension, id: q.id }));
  } else {
    const raw = category === "class_7" ? class7Data : class6Data;
    questions = ((raw as any).questions || []).map((q: any) => ({ section: q.section as string, id: q.id as number }));
  }

  const localIndexByCat: Record<string, number> = {};
  const map: Record<string, number> = {};
  for (const q of questions) {
    const cat = DIMENSION_MAP[q.section] || "personality";
    const idx = localIndexByCat[cat] ?? 0;
    map[`${cat}:${idx}`] = q.id;
    localIndexByCat[cat] = idx + 1;
  }
  return map;
}

/** Converts the exam UI's { "aptitude:3": "2", ... } answer map into the
 *  { 24: 2, ... } global-id -> option-index shape class6/7/8Scoring.ts need. */
export function convertClass678Answers(category: Class678Category, answers: Record<string, string>): Record<number, number> {
  const idMap = class678IdMap(category);
  const responses: Record<number, number> = {};
  for (const [key, value] of Object.entries(answers)) {
    const realId = idMap[key];
    const optionIndex = parseInt(value, 10);
    if (realId != null && !Number.isNaN(optionIndex)) {
      responses[realId] = optionIndex;
    }
  }
  return responses;
}
