/**
 * Institution analytics - pure functions over students' own records, shared
 * by the server routes and the portal screens (and testable without either).
 *
 * Everything here works from what a student's account already holds: their
 * profile, `latestAssessment`, `progress` (lessons and goals) and `activity`
 * (active time by area and day). Nothing is estimated: a student with no
 * recorded time shows 0, not a guess.
 */
import { categoryLabel } from "@/lib/auth/formOptions";
import { AREA_LABEL, dayKey, lastDays } from "@/lib/progress/activity";
import type { MessageKind, StudentRow } from "@/lib/institution/types";

const DAY = 24 * 60 * 60 * 1000;

/** The feature courses whose lessons a student can mark complete. */
export const COURSES: { key: string; label: string; href: string }[] = [
  { key: "exams", label: "Entrance exams", href: "/account/exams" },
  { key: "scholarships", label: "Scholarships", href: "/account/scholarships" },
  { key: "study-abroad", label: "Study abroad", href: "/account/study-abroad" },
  { key: "money", label: "Money skills", href: "/account/money" },
  { key: "legal", label: "Legal rights", href: "/account/legal" },
  { key: "research", label: "Research", href: "/account/research" },
];

// ---------------------------------------------------------------- rows

function ms(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return v;
  if (typeof v === "string") { const t = Date.parse(v); return Number.isNaN(t) ? null : t; }
  const o = v as { toMillis?: () => number; seconds?: number; _seconds?: number };
  if (typeof o.toMillis === "function") return o.toMillis();
  const s = o.seconds ?? o._seconds;
  return typeof s === "number" ? s * 1000 : null;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : 0);

/** A student's Firestore document -> the row an institution sees. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toStudentRow(uid: string, d: any, now: number = Date.now()): StudentRow {
  const a = d?.latestAssessment;
  const fits: string[] = (a?.customFields?.length ? a.customFields.map((f: { name: string }) => f.name) : (a?.matches ?? []).map((m: { title: string }) => m.title))
    .filter(Boolean).slice(0, 3);
  const inProgress = !a && d?.examSession?.status === "in_progress";
  const keepFrom = dayKey(new Date(now - 60 * DAY));
  const byDay: Record<string, number> = {};
  for (const [k, v] of Object.entries((d?.activity?.byDay ?? {}) as Record<string, number>)) if (k >= keepFrom) byDay[k] = num(v);
  const courses: StudentRow["courses"] = {};
  for (const [k, c] of Object.entries((d?.progress?.courses ?? {}) as Record<string, { done?: string[]; total?: number }>)) {
    courses[k] = { done: Array.isArray(c?.done) ? c.done.length : 0, total: num(c?.total) };
  }
  const g = d?.progress?.goals;
  const goalsDone = g?.done ? Object.values(g.done as Record<string, boolean>).filter(Boolean).length : 0;
  return {
    uid,
    name: str(d?.name) || "(no name)",
    email: str(d?.email),
    phone: str(d?.phone),
    category: str(d?.category),
    city: str(d?.city),
    createdAt: ms(d?.createdAt),
    archived: !!d?.archived,
    assessment: {
      status: a ? "completed" : inProgress ? "in_progress" : "not_started",
      completedAt: ms(a?.completedAt),
      topFit: fits[0] ?? (str(a?.topCareer) || null),
      topFits: fits,
      fitPct: typeof a?.overallFitmentPct === "number" ? Math.round(a.overallFitmentPct) : null,
      desiredCareer: str(a?.desiredCareer) || str(d?.desiredCareer) || null,
      strengths: [
        ...((a?.topStrengths ?? []) as { parameterName?: string; subTraitName?: string }[]).map((s) => s.subTraitName || s.parameterName || ""),
        ...((a?.topIntelligences ?? []) as { name?: string }[]).map((s) => s.name || ""),
        ...((a?.strengthsBreakdown ?? []) as { name?: string }[]).slice(0, 3).map((s) => s.name || ""),
      ].filter(Boolean).slice(0, 8),
      quality: a?.quality ?? null,
    },
    activity: {
      totalSec: num(d?.activity?.totalSec),
      byFeature: (d?.activity?.byFeature ?? {}) as Record<string, number>,
      byDay,
      lastActiveAt: ms(d?.activity?.lastActiveAt),
      lastFeature: str(d?.activity?.lastFeature) || null,
    },
    courses,
    goals: g ? { done: Math.min(goalsDone, num(g.total) || goalsDone), total: num(g.total) } : null,
    legal: d?.progress?.legal ? { done: num(d.progress.legal.done), safest: num(d.progress.legal.safest), byArea: d.progress.legal.byArea ?? {} } : null,
  };
}

// ---------------------------------------------------------------- per student

export function secondsInLast(row: StudentRow, days: number, now: number = Date.now()): number {
  return lastDays(days, new Date(now)).reduce((s, k) => s + (row.activity.byDay[k] ?? 0), 0);
}

export function daysActiveInLast(row: StudentRow, days: number, now: number = Date.now()): number {
  return lastDays(days, new Date(now)).filter((k) => (row.activity.byDay[k] ?? 0) > 0).length;
}

/** Days since the student was last active (null = no activity recorded). */
export function daysSinceActive(row: StudentRow, now: number = Date.now()): number | null {
  return row.activity.lastActiveAt ? Math.floor((now - row.activity.lastActiveAt) / DAY) : null;
}

/** Lessons done across the feature courses the student has started. */
export function courseTotals(row: StudentRow): { done: number; total: number; pct: number } {
  let done = 0, total = 0;
  for (const c of Object.values(row.courses)) { done += c.done; total += c.total; }
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export type StudentStatus = "on_track" | "needs_nudge" | "inactive" | "not_started";

/** One word for where a student stands - drives the status pill. */
export function studentStatus(row: StudentRow, now: number = Date.now()): StudentStatus {
  if (row.assessment.status !== "completed") return "not_started";
  const since = daysSinceActive(row, now);
  if (since == null || since >= 14) return "inactive";
  if (since >= 7) return "needs_nudge";
  return "on_track";
}

export const STATUS_META: Record<StudentStatus, { label: string; tone: "good" | "warn" | "bad" | "muted" }> = {
  on_track: { label: "On track", tone: "good" },
  needs_nudge: { label: "Needs a nudge", tone: "warn" },
  inactive: { label: "Inactive", tone: "bad" },
  not_started: { label: "Assessment pending", tone: "muted" },
};

export function formatDuration(sec: number): string {
  if (sec < 60) return sec > 0 ? "<1 min" : "0 min";
  const m = Math.round(sec / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60), r = m % 60;
  return r ? `${h} h ${r} min` : `${h} h`;
}

export function formatAgo(t: number | null, now: number = Date.now()): string {
  if (!t) return "Never";
  const d = Math.floor((now - t) / DAY);
  if (d <= 0) {
    const h = Math.floor((now - t) / 3600000);
    return h <= 0 ? "Just now" : `${h} h ago`;
  }
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** formatAgo for the middle of a sentence: "completed yesterday",
 *  "completed 3 days ago", "completed on 5 Sept 2026". */
export function formatAgoInline(t: number | null, now: number = Date.now()): string {
  const s = formatAgo(t, now);
  return /\d{4}$/.test(s) ? `on ${s}` : s.toLowerCase();
}

// ---------------------------------------------------------------- recommendations

export interface Recommendation {
  id: string;
  priority: "high" | "medium" | "low";
  /** "student": worth sending to the student; "staff": for a teacher/counsellor to act on. */
  for: "student" | "staff";
  title: string;
  detail: string;
  /** The message to send when the recommendation is for the student. */
  message?: { kind: MessageKind; title: string; body: string; link?: string };
}

const SENIOR = new Set(["class_11", "class_12", "class_11_12"]);
const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

/** What the system suggests for one student, most important first. */
export function recommendationsFor(row: StudentRow, now: number = Date.now()): Recommendation[] {
  const out: Recommendation[] = [];
  const first = row.name.split(" ")[0] || "there";
  const since = daysSinceActive(row, now);
  const area = (k: string) => row.activity.byFeature[k] ?? 0;

  if (row.assessment.status === "not_started") {
    const days = row.createdAt ? Math.floor((now - row.createdAt) / DAY) : null;
    out.push({
      id: "take-assessment", priority: "high", for: "student",
      title: "Hasn't taken the career assessment",
      detail: days != null ? `Registered ${days === 0 ? "today" : `${days} day${days === 1 ? "" : "s"} ago`}; everything else in the app builds on the assessment result.` : "Everything else in the app builds on the assessment result.",
      message: { kind: "reminder", title: "Take your career assessment", body: `Hi ${first}, your career assessment is waiting. It takes about 45 minutes and unlocks your personal report, best-fit careers and roadmap. Find a quiet time and complete it in one sitting.`, link: "/?begin=1" },
    });
  } else if (row.assessment.status === "in_progress") {
    out.push({
      id: "finish-assessment", priority: "high", for: "student",
      title: "Started the assessment but hasn't finished",
      detail: "Their answers are saved - they can continue from where they stopped.",
      message: { kind: "reminder", title: "Finish your career assessment", body: `Hi ${first}, you have an unfinished career assessment. Your answers so far are saved - sign in and continue from where you stopped to get your report.`, link: "/?begin=1" },
    });
  }

  if (row.assessment.status === "completed") {
    if (since != null && since >= 7) {
      const where = row.activity.lastFeature ? AREA_LABEL[row.activity.lastFeature] ?? "your dashboard" : "your dashboard";
      out.push({
        id: "inactive", priority: since >= 14 ? "high" : "medium", for: "student",
        title: `Not active for ${since} days`,
        detail: `Last seen in ${where}.`,
        message: { kind: "reminder", title: "Pick up where you left off", body: `Hi ${first}, it's been ${since} days since you last visited. Your report and roadmap are ready - spend 15 minutes this week on your next step.`, link: "/account" },
      });
    } else if (since == null) {
      out.push({
        id: "explore-report", priority: "medium", for: "student",
        title: "Completed the assessment but hasn't explored since",
        detail: "No time recorded in the app since activity tracking began.",
        message: { kind: "message", title: "Your career report is ready", body: `Hi ${first}, your career report is ready on your dashboard - open it to see your best-fit careers, strengths and a year-by-year roadmap.`, link: "/account" },
      });
    }

    if (row.assessment.topFit && area("careers") < 120) {
      out.push({
        id: "explore-careers", priority: "low", for: "student",
        title: `Explore careers in ${row.assessment.topFit}`,
        detail: "Their best-fit area, but little or no time in the career library yet.",
        message: { kind: "recommendation", title: `Explore careers in ${row.assessment.topFit}`, body: `Hi ${first}, your report shows ${row.assessment.topFit} as a strong fit. Explore the roles in it in the career library and note two you'd like to learn more about.`, link: "/account/career-library" },
      });
    }

    if (row.assessment.desiredCareer && row.assessment.topFits.length && !row.assessment.topFits.some((f) => f.toLowerCase().includes(row.assessment.desiredCareer!.toLowerCase()) || row.assessment.desiredCareer!.toLowerCase().includes(f.toLowerCase()))) {
      out.push({
        id: "career-conversation", priority: "medium", for: "staff",
        title: "Their goal and their best fit differ",
        detail: `Wants to become ${row.assessment.desiredCareer}; the report's strongest fits are ${row.assessment.topFits.join(", ")}. Worth a one-to-one conversation.`,
      });
    }
  }

  for (const c of COURSES) {
    const p = row.courses[c.key];
    if (p && p.total && p.done > 0 && p.done < p.total) {
      out.push({
        id: `course-${c.key}`, priority: "low", for: "student",
        title: `${c.label}: ${p.done} of ${p.total} lessons done`,
        detail: "Started but not finished.",
        message: { kind: "recommendation", title: `Finish the ${c.label} course`, body: `Hi ${first}, you've completed ${p.done} of ${p.total} lessons in ${c.label}. Keep going - a few minutes a day will finish it.`, link: c.href },
      });
    }
  }

  if (SENIOR.has(row.category) && area("exams") === 0 && !row.courses.exams) {
    out.push({
      id: "plan-exams", priority: "medium", for: "student",
      title: "Hasn't looked at entrance exams",
      detail: "Class 11-12 is when exam dates and syllabus planning matter.",
      message: { kind: "recommendation", title: "Plan your entrance exams", body: `Hi ${first}, check the entrance exams for the careers you're considering - dates, eligibility and a study planner are in Entrance Exams.`, link: "/account/exams" },
    });
  }
  if ((SENIOR.has(row.category) || row.category === "graduate") && area("scholarships") === 0 && !row.courses.scholarships) {
    out.push({
      id: "scholarships", priority: "low", for: "student",
      title: "Hasn't checked scholarships",
      detail: "Many scholarships close months before admissions.",
      message: { kind: "recommendation", title: "Scholarships you may qualify for", body: `Hi ${first}, many scholarships close months before admissions. Check the ones you may qualify for in Scholarships and note their deadlines.`, link: "/account/scholarships" },
    });
  }
  if (row.category === "graduate" && area("internships") === 0) {
    out.push({
      id: "internships", priority: "low", for: "student",
      title: "Hasn't looked at internships",
      detail: "Internships during the degree are the strongest proof for a first job.",
      message: { kind: "recommendation", title: "Find an internship", body: `Hi ${first}, an internship during your degree is the strongest proof for your first job. Browse live internships on your dashboard.`, link: "/account/internships-new" },
    });
  }
  if (row.goals && row.goals.total && row.goals.done < Math.ceil(row.goals.total / 3)) {
    out.push({
      id: "goals", priority: "low", for: "student",
      title: `Action plan: ${row.goals.done} of ${row.goals.total} steps done`,
      detail: "The 30/90-day plan on their dashboard is mostly unticked.",
      message: { kind: "recommendation", title: "Work on your 30-day action plan", body: `Hi ${first}, your dashboard has a 30/90-day action plan. Pick one step this week and tick it off.`, link: "/account" },
    });
  }

  return out.sort((x, y) => PRIORITY_ORDER[x.priority] - PRIORITY_ORDER[y.priority]);
}

// ---------------------------------------------------------------- whole institution

/** Segment messages reach many students: "{name}" becomes each one's first name
 *  when they open it (app/api/student/messages). */
export interface Segment {
  key: string;
  label: string;
  uids: string[];
  /** The reminder to send everyone in it. */
  message: { kind: MessageKind; title: string; body: string; link?: string };
}

export interface Overview {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  active7: number;
  active30: number;
  minutes7: number;
  avgMinutes7: number;
  totalHours: number;
  daily: { day: string; activeStudents: number; minutes: number }[];
  byArea: { key: string; label: string; minutes: number; students: number }[];
  byClass: { category: string; label: string; students: number; completed: number }[];
  topFits: { name: string; students: number }[];
  courses: { key: string; label: string; started: number; completed: number; avgPct: number }[];
  status: Record<StudentStatus, number>;
  segments: Segment[];
  insights: { tone: "good" | "warn" | "info"; text: string; segment?: string }[];
}

export function overview(rowsIn: StudentRow[], now: number = Date.now()): Overview {
  const rows = rowsIn.filter((r) => !r.archived);
  const days30 = lastDays(30, new Date(now));
  const total = rows.length;
  const completed = rows.filter((r) => r.assessment.status === "completed").length;
  const inProgress = rows.filter((r) => r.assessment.status === "in_progress").length;
  const active7 = rows.filter((r) => daysActiveInLast(r, 7, now) > 0).length;
  const active30 = rows.filter((r) => daysActiveInLast(r, 30, now) > 0).length;
  const sec7 = rows.reduce((s, r) => s + secondsInLast(r, 7, now), 0);

  const daily = days30.map((day) => {
    let activeStudents = 0, sec = 0;
    for (const r of rows) { const v = r.activity.byDay[day] ?? 0; if (v > 0) { activeStudents++; sec += v; } }
    return { day, activeStudents, minutes: Math.round(sec / 60) };
  });

  const areaSec = new Map<string, { sec: number; students: number }>();
  for (const r of rows) for (const [k, v] of Object.entries(r.activity.byFeature)) {
    const e = areaSec.get(k) ?? { sec: 0, students: 0 };
    e.sec += num(v); if (num(v) > 0) e.students++;
    areaSec.set(k, e);
  }
  const byArea = [...areaSec.entries()].map(([key, e]) => ({ key, label: AREA_LABEL[key] ?? key, minutes: Math.round(e.sec / 60), students: e.students }))
    .filter((a) => a.minutes > 0).sort((a, b) => b.minutes - a.minutes);

  const classMap = new Map<string, { students: number; completed: number }>();
  for (const r of rows) {
    const e = classMap.get(r.category || "unknown") ?? { students: 0, completed: 0 };
    e.students++; if (r.assessment.status === "completed") e.completed++;
    classMap.set(r.category || "unknown", e);
  }
  const byClass = [...classMap.entries()].map(([category, e]) => ({ category, label: category === "unknown" ? "Not stated" : categoryLabel(category), ...e }))
    .sort((a, b) => b.students - a.students);

  const fitMap = new Map<string, number>();
  for (const r of rows) if (r.assessment.topFit) fitMap.set(r.assessment.topFit, (fitMap.get(r.assessment.topFit) ?? 0) + 1);
  const topFits = [...fitMap.entries()].map(([name, students]) => ({ name, students })).sort((a, b) => b.students - a.students).slice(0, 8);

  const courses = COURSES.map((c) => {
    const started = rows.filter((r) => (r.courses[c.key]?.done ?? 0) > 0);
    const done = started.filter((r) => r.courses[c.key].total && r.courses[c.key].done >= r.courses[c.key].total).length;
    const avgPct = started.length ? Math.round(started.reduce((s, r) => s + (r.courses[c.key].total ? r.courses[c.key].done / r.courses[c.key].total : 0), 0) / started.length * 100) : 0;
    return { key: c.key, label: c.label, started: started.length, completed: done, avgPct };
  });

  const status: Record<StudentStatus, number> = { on_track: 0, needs_nudge: 0, inactive: 0, not_started: 0 };
  for (const r of rows) status[studentStatus(r, now)]++;

  const pick = (f: (r: StudentRow) => boolean) => rows.filter(f).map((r) => r.uid);
  const segments: Segment[] = [
    {
      key: "not_started", label: "Haven't taken the assessment", uids: pick((r) => r.assessment.status === "not_started"),
      message: { kind: "reminder", title: "Take your career assessment", body: "Hi {name}, your career assessment is waiting. It takes about 45 minutes and unlocks your personal report, best-fit careers and roadmap. Find a quiet time and complete it in one sitting.", link: "/?begin=1" },
    },
    {
      key: "in_progress", label: "Assessment unfinished", uids: pick((r) => r.assessment.status === "in_progress"),
      message: { kind: "reminder", title: "Finish your career assessment", body: "Hi {name}, you have an unfinished career assessment. Your answers so far are saved - sign in and continue from where you stopped to get your report.", link: "/?begin=1" },
    },
    {
      key: "inactive_7", label: "Not active for 7+ days", uids: pick((r) => r.assessment.status === "completed" && (daysSinceActive(r, now) ?? 999) >= 7),
      message: { kind: "reminder", title: "Pick up where you left off", body: "Hi {name}, it's been a while since your last visit. Your report and roadmap are ready - spend 15 minutes this week on your next step.", link: "/account" },
    },
    {
      key: "completed", label: "Completed the assessment", uids: pick((r) => r.assessment.status === "completed"),
      message: { kind: "message", title: "Your next step", body: "Hi {name}, open your dashboard and pick one step from your 30-day action plan to do this week.", link: "/account" },
    },
  ];

  const insights: Overview["insights"] = [];
  const pct = (n: number) => (total ? Math.round((n / total) * 100) : 0);
  const seg = (k: string) => segments.find((s) => s.key === k)!;
  if (total === 0) {
    insights.push({ tone: "info", text: "No students are linked yet. Students appear here once they register through your school's link, or once OneGrasp assigns them to your institution." });
  } else {
    if (seg("not_started").uids.length) insights.push({ tone: "warn", text: `${seg("not_started").uids.length} student${seg("not_started").uids.length === 1 ? " hasn't" : "s haven't"} taken the assessment yet (${pct(seg("not_started").uids.length)}%). Send them a reminder.`, segment: "not_started" });
    if (seg("in_progress").uids.length) insights.push({ tone: "warn", text: `${seg("in_progress").uids.length} started the assessment but didn't finish - their answers are saved.`, segment: "in_progress" });
    if (seg("inactive_7").uids.length) insights.push({ tone: "warn", text: `${seg("inactive_7").uids.length} student${seg("inactive_7").uids.length === 1 ? " has" : "s have"} not been active for a week or more.`, segment: "inactive_7" });
    if (completed && pct(completed) >= 80) insights.push({ tone: "good", text: `${pct(completed)}% of students have completed the assessment.` });
    if (topFits[0] && topFits[0].students >= 3) insights.push({ tone: "info", text: `${topFits[0].name} is the most common best fit (${topFits[0].students} students) - a session or guest talk in this area would reach many of them.` });
    const quiet = courses.filter((c) => c.started === 0).map((c) => c.label);
    if (completed >= 5 && quiet.length) insights.push({ tone: "info", text: `No one has started ${quiet.slice(0, 2).join(" or ")} yet - worth introducing in class.` });
  }

  return {
    total, completed, inProgress, notStarted: total - completed - inProgress,
    active7, active30,
    minutes7: Math.round(sec7 / 60),
    avgMinutes7: active7 ? Math.round(sec7 / 60 / active7) : 0,
    totalHours: Math.round(rows.reduce((s, r) => s + r.activity.totalSec, 0) / 360) / 10,
    daily, byArea, byClass, topFits, courses, status, segments, insights,
  };
}
