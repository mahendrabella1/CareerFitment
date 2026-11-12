import { NextResponse } from "next/server";
import { fail, requireInstitution, studentsOf } from "@/lib/institution/server";
import { buildPlanSource } from "@/lib/yearPlan/source";
import { factsFrom, planStatus, summaryOf, type PlanSource, type PlanTrackId, type YearPlanRow } from "@/lib/yearPlan/plan";
import { trackIdFor } from "@/lib/commLab/scoring";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/** Only what the Year Plan needs - lesson ids, pages opened, lab progress - never answers or the report. */
const FIELDS = [
  "name", "category", "createdAt", "archived", "institution",
  "progress.courses", "progress.visited", "latestAssessment.completedAt",
  "commLab.lessons", "aptitudeLab.topics", "aptitudeLab.mocks", "certificates",
];

const sources = new Map<PlanTrackId, PlanSource>();
const sourceFor = (t: PlanTrackId) => { let s = sources.get(t); if (!s) { s = buildPlanSource(t); sources.set(t, s); } return s; };

/**
 * GET /api/institution/year-plan - where each of the institution's students
 * is in their Year Plan (lib/yearPlan/plan.ts): week, tasks due so far and
 * done, this week, the whole plan. Computed here from the same records the
 * student's own page uses, so the school and the student always agree.
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const now = Date.now();
    const docs = await studentsOf(db, institution, FIELDS);
    const rows: YearPlanRow[] = [];
    for (const [uid, d] of docs) {
      const category = typeof d.category === "string" ? d.category : "";
      if (category === "experienced_professional") continue;
      const status = planStatus(sourceFor(trackIdFor(category)), factsFrom(d), d.createdAt, now);
      rows.push({ uid, name: typeof d.name === "string" && d.name ? d.name : "(no name)", category, archived: !!d.archived, catchUp: status.catchUp.length, ...summaryOf(status) });
    }
    return NextResponse.json({ rows, generatedAt: now });
  } catch (e) {
    return fail(e);
  }
}
