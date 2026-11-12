/**
 * Year Plan - a 40-week path through everything on the dashboard, different
 * for each class group (t1 Class 6-8, t2 9-10, t3 11-12, t4 graduates; the
 * same bands as the Communication Lab's trackIdFor()).
 *
 * This file is pure (no data imports), so the student's page, the dashboard
 * strip and the institution portal's server route all share it:
 *   - schedule(): a track's ordered tasks (lib/yearPlan/source.ts, built on
 *     the server from the real course/lab/tool content) -> 40 dated weeks;
 *   - factsFrom() + planStatus(): which tasks are done, from what the student
 *     actually did (the same records My Progress reads) - nothing is ticked
 *     by hand.
 *
 * Week 1 starts on the student's own date: the day they signed up, or the
 * day the Year Plan launched for anyone who joined before it (so nobody
 * starts with weeks of "overdue" tasks). Exam months get a light week (one
 * task): February, March and September for school classes; November and May
 * for graduates.
 */
import { tasksDone, type FeatureTaskSpec } from "@/lib/progress/featureTasks";

export type PlanTrackId = "t1" | "t2" | "t3" | "t4";
export const PLAN_WEEKS = 40;
export const NORMAL_CAP = 3;
const DAY = 86400000;
/** Students who signed up before this start their plan on it (13 Nov 2026, IST midnight). */
export const PLAN_LAUNCH = Date.UTC(2026, 10, 12, 18, 30);
/** 0-based months with a lighter week: school exams, and semester exams for graduates. */
export const LIGHT_MONTHS: Record<PlanTrackId, number[]> = { t1: [2, 8], t2: [1, 2, 8], t3: [1, 2, 8], t4: [4, 10] };
/** At most this many tasks in a normal week. */
export const MAX_TASKS = 5;

/** How an item is checked - each against data the app already records. */
export type PlanCheck =
  | { k: "lesson"; c: string; l: string }        // progress.courses[c].done has lesson l
  | { k: "page"; a: string; p: string }           // progress.visited[a] has page p (or a page under it)
  | { k: "tool"; f: string; t: string }           // a My Progress tool task (lib/progress/featureTasks.ts)
  | { k: "comm"; l: string }                      // Communication Lab lesson completed
  | { k: "apt"; t: string }                       // Aptitude Lab topic practised (a set of 10)
  | { k: "mock"; n: number }                      // n Aptitude mock tests taken
  | { k: "assessment" }                           // the career assessment completed
  | { k: "cert"; c: string };                     // the course certificate claimed

export interface PlanItem { label: string; href: string; check: PlanCheck }
export type TaskKind = "learn" | "practise" | "explore" | "build";
export interface PlanTask {
  id: string;
  kind: TaskKind;
  title: string;
  why: string;
  /** Where the task starts. */
  href: string;
  minutes: number;
  items: PlanItem[];
}
/** One stream of tasks in order, and the part of the year it is spread over (0-1). */
export interface PlanStream { key: string; from: number; to: number; tasks: PlanTask[] }
export interface PlanSource { track: PlanTrackId; label: string; tools: FeatureTaskSpec[]; streams: PlanStream[] }

export interface PlanWeek { n: number; start: number; light: boolean; phase: string; tasks: PlanTask[] }

export const PHASES: { until: number; title: string; note: string }[] = [
  { until: 0.2, title: "Get to know yourself", note: "Your assessment, your report and the first lessons." },
  { until: 0.5, title: "Explore", note: "Careers, courses and tools - see what's out there." },
  { until: 0.8, title: "Build your skills", note: "Practise, finish courses, start your portfolio." },
  { until: 1.01, title: "Decide and show your work", note: "Choices, applications, certificates and your passport." },
];
export const phaseOf = (week: number) => PHASES.find((p) => (week - 0.5) / PLAN_WEEKS < p.until)!;

/** Firestore Timestamp / millis / ISO / {seconds} -> millis. */
export function toMs(v: unknown): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") { const t = Date.parse(v); return Number.isNaN(t) ? null : t; }
  const o = v as { toMillis?: () => number; seconds?: number; _seconds?: number };
  if (typeof o.toMillis === "function") return o.toMillis();
  const s = o.seconds ?? o._seconds;
  return typeof s === "number" ? s * 1000 : null;
}

/** Week 1's first day: the sign-up day, or the launch day for earlier accounts
 *  (and for the odd account with no sign-up date, so its week 1 doesn't move). */
export function planStart(createdAt: unknown, now: number = Date.now()): number {
  const c = toMs(createdAt) ?? PLAN_LAUNCH;
  return Math.min(now, Math.max(c, PLAN_LAUNCH));
}

/** The week `now` falls in (1-based; 0 before the start, > 40 after the end). */
export function weekNumber(start: number, now: number = Date.now()): number {
  return now < start ? 0 : Math.floor((now - start) / (7 * DAY)) + 1;
}

/** Every stream's tasks placed on the year (each spread evenly over its window), in order. */
export function orderedTasks(src: PlanSource): PlanTask[] {
  const placed: { p: number; s: number; i: number; task: PlanTask }[] = [];
  src.streams.forEach((st, s) => st.tasks.forEach((task, i) => {
    placed.push({ p: st.from + (st.to - st.from) * ((i + 0.5) / st.tasks.length), s, i, task });
  }));
  return placed.sort((a, b) => a.p - b.p || a.s - b.s || a.i - b.i).map((x) => x.task);
}

/** The 40 dated weeks. A light week gets one task; every other week gets
 *  about the same amount of time - the minutes still to do shared over the
 *  normal weeks still to come, recomputed each week - so no week is a pile. */
export function schedule(src: PlanSource, start: number): PlanWeek[] {
  const tasks = orderedTasks(src);
  const light = new Set(LIGHT_MONTHS[src.track]);
  const weeks: PlanWeek[] = Array.from({ length: PLAN_WEEKS }, (_, i) => {
    const s = start + i * 7 * DAY;
    // The week counts as an exam week when most of it is in an exam month (its Thursday, IST).
    const mid = new Date(s + 3 * DAY + 5.5 * 3600000);
    return { n: i + 1, start: s, light: light.has(mid.getUTCMonth()), phase: phaseOf(i + 1).title, tasks: [] };
  });
  // Week 1 is never light - it's where everything begins.
  weeks[0].light = false;
  const avg = tasks.reduce((s, t) => s + t.minutes, 0) / Math.max(1, tasks.length);
  let k = 0;
  for (const w of weeks) {
    if (k >= tasks.length) break;
    if (w.light) { w.tasks = [tasks[k++]]; continue; }
    const normalLeft = weeks.filter((x) => x.n >= w.n && !x.light).length;
    const lightLeft = weeks.filter((x) => x.n > w.n && x.light).length;
    const minutesLeft = tasks.slice(k).reduce((s, t) => s + t.minutes, 0) - lightLeft * avg;
    const target = minutesLeft / normalLeft;
    let m = 0;
    const take: PlanTask[] = [];
    while (k < tasks.length && take.length < MAX_TASKS) {
      const t = tasks[k];
      // Take the next task while it brings the week closer to its share.
      if (take.length && m + t.minutes / 2 > target) break;
      take.push(t);
      m += t.minutes;
      k++;
    }
    w.tasks = take;
  }
  // Anything left over joins the last week (only if a class had far more content than fits).
  if (k < tasks.length) weeks[PLAN_WEEKS - 1].tasks.push(...tasks.slice(k));
  return weeks;
}

// ------------------------------------------------------------------ status

/** What the student has done, from their profile (users/{uid}). */
export interface PlanFacts {
  courses: Record<string, string[]>;
  visited: Record<string, string[]>;
  comm: Record<string, { s?: string }>;
  apt: Record<string, { n?: number }>;
  mocks: number;
  assessment: boolean;
  certificates: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function factsFrom(profile: any, courseDone?: (key: string) => string[]): PlanFacts {
  const courses: Record<string, string[]> = {};
  for (const [k, c] of Object.entries((profile?.progress?.courses ?? {}) as Record<string, { done?: string[] }>)) {
    courses[k] = courseDone ? courseDone(k) : Array.isArray(c?.done) ? c.done : [];
  }
  if (courseDone) for (const k of ["money", "legal", "exams", "scholarships", "study-abroad", "research"]) courses[k] ??= courseDone(k);
  return {
    courses,
    visited: (profile?.progress?.visited ?? {}) as Record<string, string[]>,
    comm: (profile?.commLab?.lessons ?? {}) as Record<string, { s?: string }>,
    apt: (profile?.aptitudeLab?.topics ?? {}) as Record<string, { n?: number }>,
    mocks: Array.isArray(profile?.aptitudeLab?.mocks) ? profile.aptitudeLab.mocks.length : 0,
    assessment: !!profile?.latestAssessment,
    certificates: Object.keys(profile?.certificates ?? {}),
  };
}

/** A set of 10 answers in a topic counts as practising it. */
export const APT_SET = 10;

export function itemChecker(src: PlanSource, f: PlanFacts): (c: PlanCheck) => boolean {
  const toolDone = new Map(src.tools.map((s) => [s.key, tasksDone(s, f.visited[s.area]).done]));
  const visitedSets = new Map<string, string[]>();
  const pagesIn = (a: string) => {
    let v = visitedSets.get(a);
    if (!v) { v = (f.visited[a] ?? []).map((p) => (p.length > 1 ? p.replace(/\/+$/, "") : p)); visitedSets.set(a, v); }
    return v;
  };
  return (c) => {
    switch (c.k) {
      case "lesson": return (f.courses[c.c] ?? []).includes(c.l);
      case "page": return pagesIn(c.a).some((p) => p === c.p || p.startsWith(`${c.p}/`));
      case "tool": return toolDone.get(c.f)?.has(c.t) ?? false;
      case "comm": return f.comm[c.l]?.s === "completed";
      case "apt": return (f.apt[c.t]?.n ?? 0) >= APT_SET;
      case "mock": return f.mocks >= c.n;
      case "assessment": return f.assessment;
      case "cert": return f.certificates.includes(c.c);
    }
  };
}

export interface TaskState { done: number; total: number; complete: boolean; /** Each item, done or not. */ flags: boolean[] }
export interface PlanStatus {
  start: number;
  week: number;              // current week (1-40; 41+ once the plan has ended)
  weeks: PlanWeek[];
  task: Map<string, TaskState>;
  /** Tasks in weeks before this one / done. */
  due: number; dueDone: number;
  /** % of the tasks due so far that are done (100 when nothing is due yet). */
  onTrack: number;
  thisWeek: { total: number; done: number };
  all: { total: number; done: number };
  /** Unfinished tasks from earlier weeks, oldest first. */
  catchUp: { week: number; task: PlanTask }[];
  ended: boolean;
}

export function planStatus(src: PlanSource, facts: PlanFacts, createdAt: unknown, now: number = Date.now()): PlanStatus {
  const start = planStart(createdAt, now);
  const weeks = schedule(src, start);
  const week = Math.max(1, weekNumber(start, now));
  const check = itemChecker(src, facts);
  const task = new Map<string, TaskState>();
  let due = 0, dueDone = 0, allDone = 0, allTotal = 0;
  const thisWeek = { total: 0, done: 0 };
  const catchUp: PlanStatus["catchUp"] = [];
  for (const w of weeks) {
    for (const t of w.tasks) {
      const flags = t.items.map((i) => check(i.check));
      const done = flags.filter(Boolean).length;
      const st = { done, total: t.items.length, complete: done === t.items.length, flags };
      task.set(t.id, st);
      allTotal++;
      if (st.complete) allDone++;
      if (w.n < week) { due++; if (st.complete) dueDone++; else catchUp.push({ week: w.n, task: t }); }
      if (w.n === week) { thisWeek.total++; if (st.complete) thisWeek.done++; }
    }
  }
  return {
    start, week, weeks, task, due, dueDone,
    onTrack: due ? Math.round((dueDone / due) * 100) : 100,
    thisWeek, all: { total: allTotal, done: allDone }, catchUp, ended: week > PLAN_WEEKS,
  };
}

/** The short summary the institution portal and the dashboard strip show. */
export interface PlanSummary { week: number; onTrack: number; due: number; dueDone: number; thisWeekDone: number; thisWeekTotal: number; done: number; total: number; next: string | null }
/** One student's line on the institution portal's Year Plan page. */
export interface YearPlanRow extends PlanSummary { uid: string; name: string; category: string; archived: boolean; catchUp: number }
export function summaryOf(s: PlanStatus): PlanSummary {
  const current = s.weeks[Math.min(s.week, PLAN_WEEKS) - 1];
  const next = s.catchUp[0]?.task ?? current?.tasks.find((t) => !s.task.get(t.id)?.complete) ?? null;
  return {
    week: s.week, onTrack: s.onTrack, due: s.due, dueDone: s.dueDone,
    thisWeekDone: s.ended ? 0 : s.thisWeek.done, thisWeekTotal: s.ended ? 0 : s.thisWeek.total,
    done: s.all.done, total: s.all.total, next: next?.title ?? null,
  };
}
