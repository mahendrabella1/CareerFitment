/**
 * The counselling list: which students would benefit from a one-to-one
 * conversation with a counsellor or class teacher, and why - built only from
 * what the portal already knows about each student (pure, testable).
 */
import type { StudentRow } from "@/lib/institution/types";
import { daysSinceActive } from "@/lib/institution/analytics";
import { studentAreas } from "@/lib/institution/features";

export type FollowUpReason = "family" | "result" | "mismatch" | "undecided" | "weak_match" | "drifted";

export const REASON_META: Record<FollowUpReason, { label: string; weight: number; opener: string }> = {
  family: { label: "Family wants to talk", weight: 3, opener: "Invite the student and a parent together. Start with what each of them hopes for, then look at the report side by side." },
  result: { label: "Result needs checking", weight: 3, opener: "Ask how the assessment went - were they rushed or distracted? If the answers weren't considered, suggest a calm retake before acting on the report." },
  mismatch: { label: "Goal differs from results", weight: 2, opener: "Ask what draws them to their chosen career, then show where their results point. Look for a path that keeps what they love about the goal." },
  undecided: { label: "Undecided between two paths", weight: 1, opener: "Go through the two paths they're comparing - entrance exams, costs, what a working day looks like - and agree one small step to test each." },
  weak_match: { label: "Weak match with chosen career", weight: 1, opener: "Look at which parts of their profile don't fit the career they named, and whether a nearby role suits them better." },
  drifted: { label: "Hasn't been back since the assessment", weight: 1, opener: "Check they've seen their report and understood it. Agree one action from their plan for this week." },
};

export const REASON_ORDER = Object.keys(REASON_META) as FollowUpReason[];

export interface FollowUp {
  row: StudentRow;
  reasons: { key: FollowUpReason; detail: string }[];
  /** Higher = see sooner. */
  score: number;
}

const DRIFT_DAYS = 21;
const WEAK_MATCH = 50;

/** Every student with at least one reason, most urgent first. */
export function followUps(rows: StudentRow[], now: number = Date.now()): FollowUp[] {
  const out: FollowUp[] = [];
  for (const r of rows) {
    if (r.archived || r.assessment.status !== "completed") continue;
    const reasons: FollowUp["reasons"] = [];
    const a = r.assessment;

    if (r.decision?.parentAnswer === "discuss") {
      const path = r.decision.chosen === "A" ? r.decision.pathA : r.decision.chosen === "B" ? r.decision.pathB : `${r.decision.pathA} or ${r.decision.pathB}`;
      reasons.push({ key: "family", detail: `Parents asked to discuss the choice: ${path}.` });
    }
    if (a.quality && a.quality.trust !== "high") {
      reasons.push({ key: "result", detail: `${a.quality.trust === "low" ? "Low" : "Medium"} trust: ${a.quality.reasons.slice(0, 2).join("; ") || "answers look rushed or patterned"}.` });
    }
    const { fit, goal } = studentAreas(r);
    const mismatch = !!(a.desiredCareer && a.topFit && fit.length && goal.length && !goal.some((g) => fit.includes(g)));
    if (mismatch) reasons.push({ key: "mismatch", detail: `Wants ${a.desiredCareer}; results point to ${a.topFit}.` });
    if (r.decision && r.decision.chosen === "undecided") reasons.push({ key: "undecided", detail: `Comparing ${r.decision.pathA} and ${r.decision.pathB}.` });
    if (!mismatch && a.desiredCareer && a.fitPct != null && a.fitPct < WEAK_MATCH) reasons.push({ key: "weak_match", detail: `Profile matches ${a.desiredCareer} at ${a.fitPct}%.` });
    const since = daysSinceActive(r, now);
    if (since == null || since >= DRIFT_DAYS) reasons.push({ key: "drifted", detail: since == null ? "No activity recorded after the assessment." : `Last active ${since} days ago.` });

    if (reasons.length) out.push({ row: r, reasons, score: reasons.reduce((s, x) => s + REASON_META[x.key].weight, 0) });
  }
  return out.sort((x, y) => y.score - x.score || x.row.name.localeCompare(y.row.name));
}

/** How many students have each reason. */
export function reasonCounts(list: FollowUp[]): Record<FollowUpReason, number> {
  const c = Object.fromEntries(REASON_ORDER.map((k) => [k, 0])) as Record<FollowUpReason, number>;
  for (const f of list) for (const r of f.reasons) c[r.key]++;
  return c;
}
