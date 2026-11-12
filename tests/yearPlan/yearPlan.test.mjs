// Year Plan (lib/yearPlan): coverage, links, week rules and status. npm run test:yearplan
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const { buildPlanSource, PLAN_TRACKS } = await import("../../lib/yearPlan/source.ts");
const P = await import("../../lib/yearPlan/plan.ts");
const { FEATURE_TASK_SPECS } = await import("../../lib/progress/buildFeatureTasks.ts");
const { TRACKS: COMM } = await import("../../lib/commLab/content.ts");
const { APT_TRACKS } = await import("../../lib/aptitude/tracks.ts");
const { BUILDER_TRACK } = await import("../../data/startups/content.ts");
const COURSES = {
  money: (await import("../../data/courses/money.ts")).MONEY_COURSE,
  legal: (await import("../../data/courses/legal.ts")).LEGAL_COURSE,
  exams: (await import("../../data/courses/exams.ts")).EXAMS_COURSE,
  scholarships: (await import("../../data/courses/scholarships.ts")).SCHOLARSHIPS_COURSE,
  "study-abroad": (await import("../../data/courses/studyAbroad.ts")).STUDY_ABROAD_COURSE,
  research: (await import("../../data/courses/research.ts")).RESEARCH_COURSE,
};

const START = P.PLAN_LAUNCH; // 13 Nov 2026
const checksOf = (src) => P.orderedTasks(src).flatMap((t) => t.items.map((i) => i.check));
const key = (c) => JSON.stringify(c);

test("every class's plan covers every lesson, lab lesson, topic, tool and Startups lesson - each once", () => {
  for (const { id } of PLAN_TRACKS) {
    const src = buildPlanSource(id);
    const tasks = P.orderedTasks(src);
    assert.equal(new Set(tasks.map((t) => t.id)).size, tasks.length, `${id}: task ids unique`);
    const have = new Map();
    for (const c of checksOf(src)) have.set(key(c), (have.get(key(c)) ?? 0) + 1);
    const need = [
      ...Object.entries(COURSES).flatMap(([c, course]) => course.modules.flatMap((m) => m.lessons.map((l) => ({ k: "lesson", c, l: l.id })))),
      ...COMM.find((t) => t.id === id).modules.flatMap((m) => m.lessons.map((l) => ({ k: "comm", l: l.id }))),
      ...APT_TRACKS[Number(id.slice(1)) - 1].topics.map((x) => ({ k: "apt", t: x.id })),
      ...FEATURE_TASK_SPECS.flatMap((s) => s.tasks.map((t) => ({ k: "tool", f: s.key, t: t.id }))),
      ...BUILDER_TRACK.modules.flatMap((m) => m.lessons.map((l) => ({ k: "page", a: "startups", p: `/account/startups/${BUILDER_TRACK.slug}/${m.slug}/${l.slug}` }))),
      { k: "assessment" },
    ];
    for (const c of need) assert.equal(have.get(key(c)), 1, `${id}: ${key(c)} exactly once`);
  }
});

test("40 weeks; week 1 starts with the assessment; exam-month weeks are light; no week is a pile", () => {
  for (const { id } of PLAN_TRACKS) {
    const src = buildPlanSource(id);
    const total = P.orderedTasks(src).length;
    for (const start of [START, Date.UTC(2027, 5, 1), Date.UTC(2027, 0, 20)]) {
      const weeks = P.schedule(src, start);
      assert.equal(weeks.length, P.PLAN_WEEKS);
      assert.equal(weeks.reduce((n, w) => n + w.tasks.length, 0), total, `${id}: every task placed`);
      assert.equal(weeks[0].light, false);
      assert.ok(weeks[0].tasks.some((t) => t.id === "x:assessment"), `${id}: week 1 has the assessment`);
      assert.equal(weeks[P.PLAN_WEEKS - 1].tasks.at(-1).id, "x:certificates", `${id}: ends with the certificates`);
      for (const w of weeks.slice(0, -1)) {
        const m = w.tasks.reduce((s, t) => s + t.minutes, 0);
        if (w.light) assert.ok(w.tasks.length <= 1, `${id} w${w.n}: light week has one task`);
        else assert.ok(w.tasks.length <= P.MAX_TASKS && m <= 170, `${id} w${w.n}: ${w.tasks.length} tasks, ${m} min`);
        const month = new Date(w.start + 3 * 86400000 + 5.5 * 3600000).getUTCMonth();
        if (w.n > 1) assert.equal(w.light, P.LIGHT_MONTHS[id].includes(month), `${id} w${w.n} light flag`);
      }
    }
  }
});

test("every link in every plan opens a page that exists", () => {
  const pages = [];
  const walk = (dir, segs) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (!statSync(p).isDirectory()) { if (name === "page.tsx") pages.push(segs); continue; }
      if (name.startsWith("(")) walk(p, segs); // route group
      else if (!name.startsWith("_") && name !== "api") walk(p, [...segs, name]);
    }
  };
  walk("app", []);
  const exists = (href) => {
    const parts = href.split(/[?#]/)[0].split("/").filter(Boolean);
    return pages.some((segs) => segs.length === parts.length && segs.every((s, i) => s === parts[i] || /^\[[^.]+\]$/.test(s)));
  };
  for (const { id } of PLAN_TRACKS) {
    for (const t of P.orderedTasks(buildPlanSource(id))) {
      assert.ok(exists(t.href), `${id}: ${t.title} -> ${t.href}`);
      for (const i of t.items) assert.ok(exists(i.href), `${id}: ${t.title} / ${i.label} -> ${i.href}`);
    }
  }
});

test("every page the plan checks is one the app records", () => {
  const tracker = readFileSync("components/ActivityTracker.tsx", "utf8");
  const areas = new Set([...tracker.slice(tracker.indexOf("VISIT_AREAS"), tracker.indexOf("]);", tracker.indexOf("VISIT_AREAS"))).matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
  const { areaForPath } = await_areas;
  for (const { id } of PLAN_TRACKS) {
    for (const c of checksOf(buildPlanSource(id)).filter((c) => c.k === "page")) {
      if (c.a === "dashboard") continue; // recorded by the dashboard when the report opens (below)
      assert.ok(areas.has(c.a), `${c.a} is recorded`);
      assert.equal(areaForPath(c.p), c.a, `${c.p} belongs to ${c.a}`);
    }
  }
  assert.match(readFileSync("app/account/Dashboard.tsx", "utf8"), /recordVisit\("dashboard", "\/account\/report"\)/);
});
const await_areas = await import("../../lib/progress/activity.ts");

test("status: tasks tick from the student's own records; start date; on track and catch-up", () => {
  assert.equal(P.planStart(Date.UTC(2025, 0, 1), START + 1e9), START, "earlier accounts start at launch");
  const later = START + 30 * 86400000;
  assert.equal(P.planStart({ seconds: later / 1000 }, later + 1e9), later, "a new account starts the day it joins");
  const src = buildPlanSource("t2");
  const weeks = P.schedule(src, START);
  const now = START + 3 * 7 * 86400000 + 3600000; // early in week 4
  const empty = P.planStatus(src, P.factsFrom({}), null, now);
  assert.equal(empty.week, 4);
  assert.equal(empty.due, weeks.slice(0, 3).reduce((n, w) => n + w.tasks.length, 0));
  assert.equal(empty.dueDone, 0);
  assert.equal(empty.onTrack, 0);
  assert.equal(empty.catchUp[0].week, 1);
  // A student who did everything in weeks 1-3, in the shapes the app stores.
  const profile = { latestAssessment: { completedAt: 1 }, progress: { courses: {}, visited: {} }, commLab: { lessons: {} }, aptitudeLab: { topics: {}, mocks: [] }, certificates: {} };
  for (const w of weeks.slice(0, 3)) for (const t of w.tasks) for (const { check: c } of t.items) {
    if (c.k === "lesson") (profile.progress.courses[c.c] ??= { done: [] }).done.push(c.l);
    if (c.k === "page") (profile.progress.visited[c.a] ??= []).push(c.p);
    if (c.k === "tool") { const t2 = FEATURE_TASK_SPECS.find((s) => s.key === c.f); const tt = t2.tasks.find((x) => x.id === c.t); (profile.progress.visited[t2.area] ??= []).push(tt.kind === "any" ? `${tt.href}/some-entry` : tt.href); }
    if (c.k === "comm") profile.commLab.lessons[c.l] = { s: "completed" };
    if (c.k === "apt") profile.aptitudeLab.topics[c.t] = { n: P.APT_SET };
    if (c.k === "mock") profile.aptitudeLab.mocks = Array(c.n).fill({});
    if (c.k === "cert") profile.certificates[c.c] = { id: "x", issuedAt: 1 };
  }
  const full = P.planStatus(src, P.factsFrom(profile), null, now);
  assert.equal(full.dueDone, full.due);
  assert.equal(full.onTrack, 100);
  assert.equal(full.catchUp.length, 0);
  const s = P.summaryOf(full);
  assert.equal(s.week, 4);
  assert.equal(s.next, weeks[3].tasks.find((t) => !full.task.get(t.id).complete)?.title ?? null);
  // A lesson half-way through a module shows as partly done.
  const mod = weeks.flatMap((w) => w.tasks).find((t) => t.id.startsWith("course:") && t.items.length > 1);
  const part = P.planStatus(src, P.factsFrom({ progress: { courses: { [mod.items[0].check.c]: { done: [mod.items[0].check.l] } } } }), null, now);
  assert.deepEqual([part.task.get(mod.id).done, part.task.get(mod.id).complete], [1, false]);
  assert.equal(part.task.get(mod.id).flags[0], true);
});

test("the plan is served statically and the portal reads only what it needs", () => {
  assert.match(readFileSync("app/api/year-plan/[track]/route.ts", "utf8"), /dynamic = "force-static"/);
  const portal = readFileSync("app/api/institution/year-plan/route.ts", "utf8");
  assert.match(portal, /requireInstitution\(req\)/);
  assert.ok(!/latestAssessment"|"answers|examSession/.test(portal), "no answers or full report");
  assert.ok(existsSync("app/institution/(portal)/year-plan/page.tsx"));
});
