/**
 * How much an assessment result can be trusted - computed in the browser at
 * submit (app/NewExam.tsx) from how the paper was answered, saved with the
 * result as `latestAssessment.quality`, and shown to the student's
 * institution. It never changes the scores; it only flags a report that may
 * not reflect the student (rushed, or the same answer over and over).
 */

export interface AssessmentQuality {
  durationSec: number;
  answered: number;
  total: number;
  avgSecPerQuestion: number;
  /** Share of answered questions given in under 3 seconds. */
  fastPct: number;
  /** Share of consecutive answered questions with the identical answer. */
  sameAnswerPct: number;
  /** Longest run of identical consecutive answers. */
  longestRun: number;
  trust: "high" | "medium" | "low";
  reasons: string[];
}

export function assessmentQuality(input: {
  orderedIds: string[];
  answers: Record<string, unknown>;
  secondsPerQuestion: Record<string, number>;
  durationSec: number;
}): AssessmentQuality {
  const answeredIds = input.orderedIds.filter((id) => {
    const v = input.answers[id];
    return v !== undefined && v !== null && v !== "" && !(Array.isArray(v) && v.length === 0);
  });
  const key = (v: unknown) => (typeof v === "string" ? v : JSON.stringify(v));
  let same = 0, run = 1, longestRun = answeredIds.length ? 1 : 0;
  for (let i = 1; i < answeredIds.length; i++) {
    if (key(input.answers[answeredIds[i]]) === key(input.answers[answeredIds[i - 1]])) { same++; run++; longestRun = Math.max(longestRun, run); }
    else run = 1;
  }
  const timed = answeredIds.filter((id) => input.secondsPerQuestion[id] !== undefined);
  const fast = timed.filter((id) => input.secondsPerQuestion[id] < 3).length;
  const answered = answeredIds.length;
  const q: AssessmentQuality = {
    durationSec: Math.round(input.durationSec),
    answered,
    total: input.orderedIds.length,
    avgSecPerQuestion: answered ? Math.round((input.durationSec / answered) * 10) / 10 : 0,
    fastPct: timed.length ? Math.round((fast / timed.length) * 100) : 0,
    sameAnswerPct: answered > 1 ? Math.round((same / (answered - 1)) * 100) : 0,
    longestRun,
    trust: "high",
    reasons: [],
  };
  if (q.avgSecPerQuestion > 0 && q.avgSecPerQuestion < 4) q.reasons.push(`Answered very fast - about ${q.avgSecPerQuestion} seconds a question`);
  if (q.fastPct >= 40) q.reasons.push(`${q.fastPct}% of answers were given in under 3 seconds`);
  if (q.sameAnswerPct >= 60) q.reasons.push(`${q.sameAnswerPct}% of answers repeated the previous answer`);
  if (q.longestRun >= 15) q.reasons.push(`${q.longestRun} identical answers in a row`);
  if (q.total && answered / q.total < 0.8) q.reasons.push(`Only ${answered} of ${q.total} questions answered`);
  q.trust = q.reasons.length >= 2 ? "low" : q.reasons.length === 1 ? "medium" : "high";
  return q;
}
