/**
 * The school report (/institution/school-report): one summary of the whole
 * institution for the principal, management or a parents' meeting - built
 * from the same student rows as the rest of the portal (pure, testable).
 */
import type { StudentRow } from "@/lib/institution/types";
import { daysActiveInLast, rolloutByClass, type ClassRollout } from "@/lib/institution/analytics";
import { AREA_BY_KEY, areasFor, studentAreas } from "@/lib/institution/features";

export interface SchoolReport {
  total: number;
  completed: number;
  active30: number;
  classes: (ClassRollout & { active30: number; topFields: { name: string; n: number }[] })[];
  fields: { name: string; n: number }[];
  areas: { label: string; n: number }[];
  strengths: { name: string; n: number }[];
  goals: { aligned: number; differs: number; noGoal: number; unclear: number };
  summary: string[];
}

const top = (m: Map<string, number>, k: number) => [...m.entries()].map(([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name)).slice(0, k);
const inc = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export function schoolReport(rowsIn: StudentRow[], now: number = Date.now()): SchoolReport {
  const rows = rowsIn.filter((r) => !r.archived);
  const done = rows.filter((r) => r.assessment.status === "completed");
  const fields = new Map<string, number>(), areas = new Map<string, number>(), strengths = new Map<string, number>();
  const goals = { aligned: 0, differs: 0, noGoal: 0, unclear: 0 };
  for (const r of done) {
    if (r.assessment.topFit) inc(fields, r.assessment.topFit);
    for (const s of new Set(r.assessment.strengths)) inc(strengths, s);
    const { fit, goal } = studentAreas(r);
    // The area of the best fit only - the second and third fits would tilt
    // the count towards whichever area comes first in CAREER_AREAS.
    const main = areasFor(r.assessment.topFit)[0];
    if (main) inc(areas, AREA_BY_KEY[main]?.label ?? main);
    if (!r.assessment.desiredCareer) goals.noGoal++;
    else if (!fit.length || !goal.length) goals.unclear++;
    else if (goal.some((g) => fit.includes(g))) goals.aligned++;
    else goals.differs++;
  }
  const classes = rolloutByClass(rows).map((c) => {
    const inClass = rows.filter((r) => (r.category || "unknown") === c.category);
    const f = new Map<string, number>();
    for (const r of inClass) if (r.assessment.status === "completed" && r.assessment.topFit) inc(f, r.assessment.topFit);
    return { ...c, active30: inClass.filter((r) => daysActiveInLast(r, 30, now) > 0).length, topFields: top(f, 3) };
  });
  const active30 = rows.filter((r) => daysActiveInLast(r, 30, now) > 0).length;
  const fieldList = top(fields, 10);

  const summary: string[] = [];
  if (rows.length) {
    summary.push(`${done.length} of ${rows.length} students (${pct(done.length, rows.length)}%) have completed the career assessment.`);
    const behind = classes.filter((c) => c.students >= 5 && c.pct < 60).map((c) => c.label);
    if (behind.length) summary.push(`${behind.join(", ")} ${behind.length === 1 ? "is" : "are"} below 60% completion.`);
    if (fieldList.length >= 3) summary.push(`The most common best-fit fields are ${fieldList[0].name}, ${fieldList[1].name} and ${fieldList[2].name}.`);
    const withGoal = goals.aligned + goals.differs;
    if (withGoal >= 5) summary.push(`For ${pct(goals.differs, withGoal)}% of students with a stated goal, the goal points somewhere other than their results - a topic for counselling.`);
    summary.push(`${active30} students (${pct(active30, rows.length)}%) used OneGrasp in the last 30 days.`);
  }
  return {
    total: rows.length, completed: done.length, active30, classes,
    fields: fieldList,
    areas: top(areas, 8).map((a) => ({ label: a.name, n: a.n })),
    strengths: top(strengths, 8),
    goals, summary,
  };
}
