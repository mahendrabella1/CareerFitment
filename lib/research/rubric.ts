/**
 * Mentor rubric (plan section 5: "Mentor rubric (used for steps 5-8, scored
 * 1-4 each)") - an abstract goes to the conference only when every item
 * scores at least 3. This is the quality gate the plan explicitly calls out
 * as protecting learners from rejections and keeping the platform's
 * reputation high.
 */

export const RUBRIC_ITEMS = [
  "Clear question",
  "Suitable method",
  "Honest results backed by data",
  "Clear writing",
  "Correct citations",
  "Good visuals",
  "Confident delivery",
] as const;

export type RubricItem = typeof RUBRIC_ITEMS[number];
export type RubricScores = Record<RubricItem, number>; // 1-4 each

export function isApproved(scores: RubricScores): boolean {
  return RUBRIC_ITEMS.every((item) => (scores[item] ?? 0) >= 3);
}
