import { test } from "node:test";
import assert from "node:assert/strict";
import { rolloutByClass } from "../../lib/institution/analytics.ts";
import { followUps, reasonCounts } from "../../lib/institution/counselling.ts";
import { schoolReport } from "../../lib/institution/schoolReport.ts";

const NOW = Date.parse("2026-10-29T12:00:00Z");
const DAY = 864e5;
const dk = (t) => { const d = new Date(t); return `d${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`; };

function S(uid, over = {}) {
  const a = over.assessment ?? {};
  return {
    uid, name: uid, email: "", phone: "", category: "class_12", city: "", createdAt: null, archived: false,
    courses: {}, goals: null, legal: null, gps: null, testDrives: [], decision: null,
    ...over,
    assessment: { status: "completed", completedAt: NOW - 5 * DAY, topFit: "Software Engineering", topFits: ["Software Engineering"], fitPct: 80, desiredCareer: "Software developer", strengths: ["Logic"], quality: null, ...a },
    activity: { totalSec: 600, byFeature: {}, byDay: { [dk(NOW - DAY)]: 600 }, lastActiveAt: NOW - DAY, lastFeature: null, ...(over.activity ?? {}) },
  };
}

test("rollout by class: counts, pending students and class order", () => {
  const rows = [
    S("a", { category: "class_12" }),
    S("b", { category: "class_12", assessment: { status: "not_started", topFit: null, topFits: [] } }),
    S("c", { category: "class_8", assessment: { status: "in_progress", topFit: null, topFits: [] } }),
    S("d", { category: "class_8", archived: true }),
  ];
  const r = rolloutByClass(rows);
  assert.deepEqual(r.map((c) => c.category), ["class_8", "class_12"], "class order, archived left out");
  assert.deepEqual(r[1], { category: "class_12", label: r[1].label, students: 2, completed: 1, inProgress: 0, notStarted: 1, pct: 50, pending: ["b"] });
  assert.equal(r[0].inProgress, 1);
});

test("counselling list: reasons and order", () => {
  const rows = [
    S("fine"),
    S("family", { decision: { pathA: "Engineering", pathB: "Design", chosen: "A", reasons: "", savedAt: NOW, parentAnswer: "discuss" } }),
    S("rushed", { assessment: { quality: { trust: "low", reasons: ["Many answers in under 3 seconds"] } } }),
    S("mismatch", { assessment: { desiredCareer: "Doctor" } }),
    S("weak", { assessment: { fitPct: 40 } }),
    S("drifted", { activity: { byDay: {}, lastActiveAt: NOW - 30 * DAY } }),
    S("pending", { assessment: { status: "not_started", topFit: null, topFits: [] } }),
  ];
  const list = followUps(rows, NOW);
  assert.deepEqual(list.map((f) => f.row.uid).slice(0, 2).sort(), ["family", "rushed"], "family and result checks first");
  assert.ok(!list.some((f) => f.row.uid === "fine" || f.row.uid === "pending"), "no reasons, or not assessed yet");
  const by = Object.fromEntries(list.map((f) => [f.row.uid, f.reasons.map((r) => r.key)]));
  assert.deepEqual(by.mismatch, ["mismatch"]);
  assert.deepEqual(by.weak, ["weak_match"]);
  assert.deepEqual(by.drifted, ["drifted"]);
  assert.match(list.find((f) => f.row.uid === "family").reasons[0].detail, /Engineering/);
  const c = reasonCounts(list);
  assert.equal(c.family, 1);
  assert.equal(c.undecided, 0);
});

test("school report: participation, fields, goals and summary", () => {
  const rows = [
    S("a"), S("b"), S("c", { assessment: { topFit: "Medicine & Healthcare", topFits: ["Medicine & Healthcare"], desiredCareer: "Lawyer" } }),
    S("d", { assessment: { status: "not_started", topFit: null, topFits: [] }, activity: { byDay: {}, lastActiveAt: null } }),
  ];
  const r = schoolReport(rows, NOW);
  assert.equal(r.total, 4);
  assert.equal(r.completed, 3);
  assert.equal(r.active30, 3);
  assert.deepEqual(r.fields[0], { name: "Software Engineering", n: 2 });
  assert.deepEqual(r.goals, { aligned: 2, differs: 1, noGoal: 0, unclear: 0 });
  assert.equal(r.areas[0].n, 2, "area of the best fit only");
  assert.match(r.summary[0], /3 of 4 students \(75%\)/);
});
