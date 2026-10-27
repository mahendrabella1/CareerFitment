import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK, QUESTION_COUNT, itemsIn } from "../../lib/stress/bank.ts";
import { DRIVERS } from "../../lib/stress/drivers.ts";
import { levelFor, quadrantFor, scoreStress } from "../../lib/stress/scoring.ts";
import { ACTIONS, SOURCE_ACTIONS, activeDrivers, actionsForArea, planActionsFor, summaryLine } from "../../lib/stress/content.ts";
import { AREAS } from "../../lib/stress/types.ts";

/** Answer indexes: 0 Never, 1 Sometimes, 2 Often. Closing: 0 Coping well, 1 Getting by, 2 Struggling. */
const all = (idx, cope = 1) => ({ ...Object.fromEntries(BANK.items.map((i) => [i.id, idx])), [BANK.closing.id]: cope });
/** The question id for a stress point, so tests don't depend on id numbering. */
const q = (source) => BANK.items.find((i) => i.source === source).id;
const score = (s, key) => s.drivers.find((d) => d.key === key).score;

test("four areas, 30-40 questions, three answers each, ids unique", () => {
  assert.deepEqual(BANK.areas.map((a) => a.id), AREAS);
  assert.ok(QUESTION_COUNT >= 30 && QUESTION_COUNT <= 40, `${QUESTION_COUNT} questions`);
  assert.deepEqual(AREAS.map((a) => itemsIn(a).length), [11, 8, 7, 7]);
  assert.deepEqual(BANK.scale.labels, ["Never", "Sometimes", "Often"]);
  assert.deepEqual(BANK.scale.values, [0, 50, 100]);
  assert.equal(BANK.closing.options.length, 3);
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

test("every question belongs to exactly one driver, in its own area", () => {
  assert.equal(new Set(DRIVERS.map((d) => d.key)).size, DRIVERS.length);
  for (const i of BANK.items) {
    const owners = DRIVERS.filter((d) => d.sources.includes(i.source));
    assert.equal(owners.length, 1, `${i.source} is in ${owners.length} drivers`);
    assert.equal(owners[0].area, i.area, `${i.source} sits in a ${owners[0].area} driver`);
  }
  const sources = new Set(BANK.items.map((i) => i.source));
  for (const d of DRIVERS) for (const s of d.sources) assert.ok(sources.has(s), `${d.key}: unknown source ${s}`);
});

test("every stress point and driver has actions, and every action is real", () => {
  for (const i of BANK.items) assert.ok(SOURCE_ACTIONS[i.source]?.length, i.source);
  const ids = new Set(ACTIONS.map((a) => a.id));
  assert.equal(ids.size, ACTIONS.length);
  for (const list of Object.values(SOURCE_ACTIONS)) for (const id of list) assert.ok(ids.has(id), id);
  for (const d of DRIVERS) assert.ok(d.actions.length && d.actions.every((id) => ids.has(id)), d.key);
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

test("never everywhere = 0, no drivers; often everywhere = 100, every driver", () => {
  const calm = scoreStress(all(0, 0), 300);
  assert.equal(calm.overall, 0);
  assert.equal(calm.level, "low");
  assert.ok(calm.drivers.every((d) => d.score === 0));
  assert.deepEqual(activeDrivers(calm), []);
  assert.ok(AREAS.every((a) => calm.contribution[a] === 0));
  assert.equal(calm.support, "none");
  assert.equal(calm.confidence.level, "high", "all 'Never' is a plausible answer, not straight-lining");
  assert.equal(summaryLine(calm), "Nothing stands out as a strong source of stress at work right now.");

  const heavy = scoreStress(all(2, 2), 300);
  assert.equal(heavy.overall, 100);
  assert.equal(heavy.level, "high");
  assert.ok(AREAS.every((a) => heavy.areas[a] === 100 && heavy.contribution[a] === 25));
  assert.equal(heavy.drivers.length, DRIVERS.length);
  assert.ok(heavy.drivers.every((d) => d.score === 100));
  assert.equal(heavy.support, "high");
  assert.equal(heavy.compass.quadrant, "both");
  assert.deepEqual(heavy.rights, { harassment: true, discrimination: true });
});

test("one severe area isn't averaged away (60% mean + 40% worst)", () => {
  const a = all(0, 0);
  for (const i of itemsIn("career")) a[i.id] = 2;
  const s = scoreStress(a, 300);
  assert.equal(s.areas.career, 100);
  assert.equal(s.overall, Math.round(0.6 * 25 + 0.4 * 100), "mean 25, worst 100 -> 55");
  assert.equal(s.level, "moderate");
  assert.deepEqual(s.contribution, { workload: 0, toxicity: 0, culture: 0, career: 100 });
  assert.deepEqual(s.drivers.slice(0, 3).map((d) => d.key), ["insecurity", "growth", "pay"]);
  assert.equal(s.compass.place, Math.round(0.6 * (100 / 3) + 0.4 * 100), "the same 60/40 blend -> 60");
  assert.equal(s.compass.quadrant, "place", "one severe workplace area isn't 'steady ground'");
});

test("drivers predict where the stress comes from: mean of their questions, strongest first", () => {
  const a = all(0, 0);
  a[q("tasks")] = 2; a[q("deadlines")] = 2; a[q("overtime")] = 1;
  a[q("layoffs")] = 2;
  const s = scoreStress(a, 300);
  assert.equal(score(s, "time-pressure"), 83, "mean of 100, 100, 50");
  assert.equal(score(s, "insecurity"), 50, "mean of 100, 0");
  assert.deepEqual(activeDrivers(s).map((d) => d.key), ["time-pressure", "insecurity"]);
  assert.equal(s.areas.workload, 23);
  assert.equal(s.areas.career, 14);
  assert.deepEqual(s.contribution, { workload: 62, toxicity: 0, culture: 0, career: 38 });
  assert.equal(summaryLine(s), "Your stress is coming mainly from time pressure (Workload) and job insecurity (Career & security).");
  const c = { ...a, [q("balance")]: 2, [q("exhaustion")]: 2 };
  assert.equal(summaryLine(scoreStress(c, 300)), "Your stress is coming mainly from time pressure and work-life boundaries (Workload), and job insecurity (Career & security).");

  const b = all(0, 0);
  b[q("control")] = 2; b[q("excluded")] = 1;
  assert.equal(score(scoreStress(b, 300), "control"), 30, "mean of 100, 50, 0, 0, 0");
});

test("area shares add up to 100", () => {
  let seed = 7;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  for (let n = 0; n < 50; n++) {
    const a = Object.fromEntries(BANK.items.map((i) => [i.id, Math.floor(rnd() * 3)]));
    const s = scoreStress({ ...a, [BANK.closing.id]: 0 }, 300);
    const sum = AREAS.reduce((t, x) => t + s.contribution[x], 0);
    if (AREAS.some((x) => s.areas[x] > 0)) assert.ok(sum >= 99 && sum <= 101, `sum ${sum}`);
  }
});

test("a single 'Sometimes' on harassment shows the options card, and the plan leads with it", () => {
  const a = all(0, 0);
  a[q("harassment")] = 1;
  const s = scoreStress(a, 300);
  assert.equal(s.rights.harassment, true);
  assert.equal(s.rights.discrimination, false);
  assert.equal(planActionsFor(s, a)[0], "rights");
});

test("the plan: support first when struggling, then 3 focus actions aimed at the strongest drivers", () => {
  const a = all(0, 2);
  a[q("tasks")] = 2; a[q("deadlines")] = 2; a[q("overtime")] = 2; a[q("layoffs")] = 2;
  const s = scoreStress(a, 300);
  assert.equal(s.support, "watch");
  const plan = planActionsFor(s, a);
  assert.deepEqual(plan, ["talk", "priorities", "safetynet", "deadline"], "one per driver first, then max 2 per area");
  assert.equal(new Set(plan).size, plan.length);
});

test("a calm profile still gets 3 healthy habits", () => {
  const a = all(0, 0);
  const plan = planActionsFor(scoreStress(a, 300), a);
  assert.equal(plan.length, 3);
  assert.ok(plan.every((id) => ACTIONS.some((x) => x.id === id)));
});

test("area suggestions follow that area's strongest driver first", () => {
  const a = all(0, 0);
  a[q("fit")] = 2;
  const s = scoreStress(a, 300);
  assert.equal(actionsForArea("culture", s, a)[0], "values");
});

test("answer-quality flags: same non-zero answer everywhere, racing through", () => {
  const s = scoreStress(all(1, 1), 40);
  assert.ok(s.confidence.flags.includes("same-answer"));
  assert.ok(s.confidence.flags.includes("too-fast"));
  assert.equal(s.confidence.level, "low");
  assert.equal(scoreStress(all(1, 1), 300).confidence.level, "low");
  const varied = all(1, 1); varied[q("tasks")] = 2;
  assert.equal(scoreStress(varied, 40).confidence.level, "medium");
});
