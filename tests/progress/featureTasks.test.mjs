import { test } from "node:test";
import assert from "node:assert/strict";
import { FEATURE_TASK_SPECS } from "../../lib/progress/buildFeatureTasks.ts";
import { taskFor, tasksDone } from "../../lib/progress/featureTasks.ts";
import { ACTIVITY_AREAS, areaForPath } from "../../lib/progress/activity.ts";

const spec = (key) => FEATURE_TASK_SPECS.find((s) => s.key === key);
const labelFor = (key, path) => taskFor(spec(key), path)?.label ?? null;

test("every feature has tasks, unique ids, and a real activity area", () => {
  const areas = new Set(ACTIVITY_AREAS.map((a) => a.key));
  for (const s of FEATURE_TASK_SPECS) {
    assert.ok(s.tasks.length > 0, s.key);
    assert.equal(new Set(s.tasks.map((t) => t.id)).size, s.tasks.length, `${s.key}: duplicate task ids`);
    assert.ok(areas.has(s.area), `${s.key}: unknown area ${s.area}`);
    // Every task's own page is recorded under this feature's area.
    for (const t of s.tasks) assert.equal(areaForPath(t.href), s.area, `${s.key}: ${t.href} is tracked as ${areaForPath(t.href)}`);
  }
  for (const k of ["money", "legal", "exams", "scholarships", "study-abroad", "research"]) assert.ok(spec(k).lessons > 0, k);
});

test("the home page is not a task; tool pages and catalogue entries are", () => {
  assert.equal(labelFor("scholarships", "/account/scholarships"), null);
  assert.equal(labelFor("scholarships", "/account/scholarships/"), null);
  assert.equal(labelFor("scholarships", "/account/scholarships/calendar"), "Deadline calendar");
  assert.equal(labelFor("scholarships", "/account/scholarships/dashboard"), "Money you can apply for");
  assert.equal(labelFor("scholarships", "/account/scholarships/inspire-she"), "All scholarships");
  assert.equal(labelFor("exams", "/account/exams/planner"), "Study planner and syllabus tracker");
  assert.equal(labelFor("exams", "/account/exams/jee-main"), "Exam directory");
  assert.equal(labelFor("legal", "/account/legal/guides"), "Guides");
  assert.equal(labelFor("legal", "/account/legal/tools/rti-application"), "RTI application");
  assert.equal(labelFor("money", "/account/money/labs/emi"), "EMI Truth Teller");
  assert.equal(labelFor("money", "/account/money/labs"), "All labs");
});

test("a specific page wins over a catalogue in the same folder", () => {
  assert.equal(labelFor("study-abroad", "/account/study-abroad/countries"), "Compare countries");
  assert.equal(labelFor("study-abroad", "/account/study-abroad/countries/de"), "Countries");
  assert.equal(labelFor("careers", "/account/career-library"), "Browse the career library");
  assert.equal(labelFor("careers", "/account/career-library/roadmaps/data-analyst"), "Degree roadmaps");
  assert.equal(labelFor("careers", "/account/career-library/Data%20Scientist"), "Read about a career");
});

test("tasksDone counts each task once and how many catalogue entries were opened", () => {
  const s = spec("scholarships");
  const { done, explored } = tasksDone(s, [
    "/account/scholarships", "/account/scholarships/calendar", "/account/scholarships/calendar/",
    "/account/scholarships/inspire-she", "/account/scholarships/central-sector-scheme",
  ]);
  assert.equal(done.size, 2, "calendar + the catalogue");
  assert.equal(explored["scholarships:All scholarships"], 2);
  assert.equal(tasksDone(s, []).done.size, 0);
});
