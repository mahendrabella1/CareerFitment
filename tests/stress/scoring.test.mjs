import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK, QUESTION_COUNT, itemsIn } from "../../lib/stress/bank.ts";
import { levelFor, quadrantFor, scoreStress } from "../../lib/stress/scoring.ts";
import { ACTIONS, SOURCE_ACTIONS, actionsForArea, planActionsFor, summaryLine } from "../../lib/stress/content.ts";
import { AREAS } from "../../lib/stress/types.ts";

/** Every area question gets the same option index; the closing question gets `cope`. */
const all = (idx, cope = 1) => ({ ...Object.fromEntries(BANK.items.map((i) => [i.id, idx])), [BANK.closing.id]: cope });
const byId = (id) => BANK.items.find((i) => i.id === id);

test("four areas, 30-40 questions, ids unique", () => {
  assert.deepEqual(BANK.areas.map((a) => a.id), AREAS);
  assert.ok(QUESTION_COUNT >= 30 && QUESTION_COUNT <= 40, `${QUESTION_COUNT} questions`);
  assert.deepEqual(AREAS.map((a) => itemsIn(a).length), [11, 8, 7, 7]);
  const ids = [...BANK.items.map((i) => i.id), BANK.closing.id];
  assert.equal(new Set(ids).size, ids.length);
});

test("the areas cover what was asked for", () => {
  const src = (a) => itemsIn(a).map((i) => i.source);
  assert.deepEqual(src("workload"), ["tasks", "deadlines", "overtime", "balance", "outside", "control", "excluded", "expectations", "communication", "roleconflict", "exhaustion"]);
  assert.deepEqual(src("toxicity"), ["fearleader", "gaslighting", "gossip", "cliques", "credit", "discrimination", "harassment", "hostileteam"]);
  assert.deepEqual(src("culture"), ["politics", "bullying", "psychsafety", "peers", "fit", "orgchange", "relations"]);
  assert.deepEqual(src("career"), ["layoffs", "suddenloss", "promotion", "skills", "costofliving", "payeffort", "recognition"]);
});

test("every stress point has actions, and every action is real", () => {
  for (const i of BANK.items) assert.ok(SOURCE_ACTIONS[i.source]?.length, i.source);
  const ids = new Set(ACTIONS.map((a) => a.id));
  assert.equal(ids.size, ACTIONS.length);
  for (const list of Object.values(SOURCE_ACTIONS)) for (const id of list) assert.ok(ids.has(id), id);
  for (const a of ACTIONS) assert.ok(a.steps.length >= 3 && a.steps.every((s) => [1, 2, 3].includes(s.week)), a.id);
});

test("levels and quadrants", () => {
  assert.equal(levelFor(24), "low");
  assert.equal(levelFor(25), "mild");
  assert.equal(levelFor(45), "moderate");
  assert.equal(levelFor(65), "high");
  assert.equal(quadrantFor(10, 10), "steady");
  assert.equal(quadrantFor(60, 10), "load");
  assert.equal(quadrantFor(10, 60), "place");
  assert.equal(quadrantFor(45, 45), "both");
});

test("never everywhere = 0 and low; almost always = 100 and high", () => {
  const calm = scoreStress(all(0, 0), 300);
  assert.equal(calm.overall, 0);
  assert.equal(calm.level, "low");
  assert.deepEqual(calm.hotspots, []);
  assert.equal(calm.support, "none");
  assert.equal(calm.confidence.level, "high", "all 'Never' is a plausible answer, not straight-lining");
  assert.equal(summaryLine(calm), "Nothing stands out as a strong source of stress at work right now.");

  const heavy = scoreStress(all(4, 4), 300);
  assert.equal(heavy.overall, 100);
  assert.equal(heavy.level, "high");
  assert.ok(AREAS.every((a) => heavy.areas[a] === 100));
  assert.equal(heavy.support, "high");
  assert.equal(heavy.compass.quadrant, "both");
  assert.deepEqual(heavy.rights, { harassment: true, discrimination: true });
});

test("one severe area isn't averaged away (60% mean + 40% worst)", () => {
  const a = all(0, 0);
  for (const i of itemsIn("career")) a[i.id] = 4;
  const s = scoreStress(a, 300);
  assert.equal(s.areas.career, 100);
  assert.equal(s.overall, Math.round(0.6 * 25 + 0.4 * 100), "mean 25, worst 100 -> 55");
  assert.equal(s.level, "moderate");
  assert.equal(s.compass.place, Math.round(0.6 * (100 / 3) + 0.4 * 100), "the same 60/40 blend -> 60");
  assert.equal(s.compass.quadrant, "place", "one severe workplace area isn't 'steady ground'");
});

test("hot spots: Often or more, strongest first, ties to the more stressed area", () => {
  const a = all(0, 0);
  a.WK1 = 3; a.CS1 = 4; a.CS5 = 3; a.CS6 = 3;
  const s = scoreStress(a, 300);
  assert.deepEqual(s.hotspots.map((h) => h.id), ["CS1", "CS5", "CS6", "WK1"]);
  assert.equal(summaryLine(s), "Most of it comes from Career & job security - especially fear of layoffs and salary below cost of living.", "Workload (7) is low, so it isn't named");
});

test("a single 'Rarely' harassment answer shows the options card, and the plan leads with it", () => {
  const a = all(0, 0);
  a[byId("TB7").id] = 1;
  const s = scoreStress(a, 300);
  assert.equal(s.rights.harassment, true);
  assert.equal(s.rights.discrimination, false);
  assert.equal(planActionsFor(s, a)[0], "rights");
});

test("the plan: support first when struggling, then 3 focus actions aimed at the top stress points", () => {
  const a = all(0, 3);
  a.WK1 = 4; a.WK2 = 4; a.WK3 = 4; a.CS1 = 3;
  const s = scoreStress(a, 300);
  assert.equal(s.support, "watch");
  const plan = planActionsFor(s, a);
  assert.deepEqual(plan, ["talk", "priorities", "deadline", "safetynet"], "max 2 per area, so layoffs gets its action");
  assert.equal(new Set(plan).size, plan.length);
});

test("a calm profile still gets 3 healthy habits", () => {
  const a = all(0, 0);
  const plan = planActionsFor(scoreStress(a, 300), a);
  assert.equal(plan.length, 3);
  assert.ok(plan.every((id) => ACTIONS.some((x) => x.id === id)));
});

test("area suggestions follow that area's answers first", () => {
  const a = all(0, 0);
  a.CU5 = 4;
  const s = scoreStress(a, 300);
  assert.equal(actionsForArea("culture", s, a)[0], "values");
});

test("answer-quality flags: same non-zero answer everywhere, racing through", () => {
  const s = scoreStress(all(2, 2), 40);
  assert.ok(s.confidence.flags.includes("same-answer"));
  assert.ok(s.confidence.flags.includes("too-fast"));
  assert.equal(s.confidence.level, "low");
  assert.equal(scoreStress(all(2, 2), 300).confidence.level, "low");
  const varied = all(1, 1); varied.WK1 = 3;
  assert.equal(scoreStress(varied, 40).confidence.level, "medium");
});
