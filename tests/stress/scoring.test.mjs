import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK, itemsFor, stepsFor } from "../../lib/stress/bank.ts";
import { cbiBand, itemValue, scoreStress, zoneFor } from "../../lib/stress/scoring.ts";
import { ACTIONS, DRIVER_META, planActionsFor } from "../../lib/stress/content.ts";

const item = (id) => BANK.items.find((i) => i.id === id);
/** Answers where every item gets the same option index. */
const all = (band, idx) => Object.fromEntries(itemsFor(band).map((i) => [i.id, idx]));
const facts = { F_SLEEP: "7-8", F_HOURS: "40-48", F_LEAVE: "11-20", F_COMMUTE: "lt30" };

test("each band gets the shared core plus only its own 4 pressure questions", () => {
  for (const [band, own, others] of [["0-5", "E", ["M", "S"]], ["5-15", "M", ["E", "S"]], ["15+", "S", ["E", "M"]]]) {
    const ids = itemsFor(band).map((i) => i.id);
    assert.equal(ids.filter((id) => new RegExp(`^${own}\\d$`).test(id)).length, 4, band);
    for (const o of others) assert.equal(ids.filter((id) => new RegExp(`^${o}\\d$`).test(id)).length, 0, `${band} has no ${o} items`);
    assert.equal(stepsFor(band).length, ids.length + BANK.facts.length);
  }
  assert.equal(new Set(BANK.items.map((i) => i.id)).size, BANK.items.length, "item ids are unique");
});

test("the standard instruments are complete: CBI personal 6 + work 7, Brief COPE 8 scales x 2", () => {
  const cbi = BANK.items.filter((i) => i.std === "CBI");
  assert.equal(cbi.filter((i) => i.sub === "personal").length, 6);
  assert.equal(cbi.filter((i) => i.sub === "work").length, 7);
  const cope = BANK.items.filter((i) => i.std === "BriefCOPE");
  const byScale = {};
  cope.forEach((i) => (byScale[i.copeScale] = (byScale[i.copeScale] ?? 0) + 1));
  assert.deepEqual(Object.values(byScale), Array(8).fill(2));
});

test("CBI scoring: 0/25/50/75/100, last work item reversed, published bands", () => {
  assert.equal(itemValue(item("CBP1"), 3), 75);
  assert.equal(itemValue(item("CBW7"), 4), 0, "\"always\" enough energy = no burnout");
  assert.equal(itemValue(item("CBW7"), 0), 100);
  assert.equal(cbiBand(49), "low");
  assert.equal(cbiBand(50), "moderate");
  assert.equal(cbiBand(75), "high");
  assert.equal(cbiBand(100), "severe");
});

test("Brief COPE items score 0-100 on its 4 points", () => {
  assert.equal(Math.round(itemValue(item("BC2"), 0)), 0);
  assert.equal(Math.round(itemValue(item("BC2"), 3)), 100);
  assert.equal(Math.round(itemValue(item("BC2"), 1)), 33);
});

test("a calm profile lands in thriving, a heavy one in burnout risk", () => {
  const calm = { ...all("0-5", 0) };
  // resources high: agree items "strongly agree" (4), recovery "always" (4), helpful coping "a lot" (3)
  for (const i of itemsFor("0-5")) {
    if (["resilience", "control", "support", "recovery"].includes(i.section)) calm[i.id] = i.reverse ? 0 : 4;
    if (i.copeScale && ["active", "planning", "reframing", "emotional", "advice"].includes(i.copeScale)) calm[i.id] = 3;
  }
  calm.CBW7 = 4; calm.W2 = 4;
  const good = scoreStress("0-5", calm, facts, 900);
  assert.equal(good.zone, "thriving");
  assert.ok(good.index < 25, `index ${good.index}`);
  assert.ok(good.balance > 50);
  assert.equal(good.burnout.band, "low");
  assert.equal(good.safety, "none");

  const heavy = { ...all("0-5", 4) };
  for (const i of itemsFor("0-5")) {
    if (["resilience", "control", "support", "recovery"].includes(i.section)) heavy[i.id] = i.reverse ? 4 : 0;
    if (i.section === "coping") heavy[i.id] = ["givingup", "selfblame", "substance"].includes(i.copeScale) ? 3 : 0;
  }
  heavy.CBW7 = 0;
  const bad = scoreStress("0-5", heavy, { F_SLEEP: "lt5", F_HOURS: "gt65", F_LEAVE: "0", F_COMMUTE: "gt120" }, 900);
  assert.equal(bad.zone, "burnout");
  assert.ok(bad.index >= 70, `index ${bad.index}`);
  assert.ok(bad.balance < -50);
  assert.equal(bad.burnout.band, "severe");
  assert.equal(bad.safety, "high", "\"always\" hopeless puts support first");
  assert.ok(bad.drivers.length >= 10 && bad.drivers.every((d) => DRIVER_META[d.source]), "every driver has words");
});

test("a CBI score in the high band always means the burnout-risk zone", () => {
  assert.equal(zoneFor(30, 80), "burnout");
  assert.equal(zoneFor(30, 60), "stretched");
  assert.equal(zoneFor(30, 10), "managing");
});

test("drivers: band questions and work-week facts count, strongest first", () => {
  const a = all("0-5", 0);
  a.E1 = 4; a.L8 = 3;
  const s = scoreStress("0-5", a, { ...facts, F_HOURS: "56-65" }, 900);
  assert.deepEqual(s.drivers.map((d) => d.source), ["confidence", "money", "longhours"]);
});

test("answer-quality flags: same answer everywhere and racing through", () => {
  const s = scoreStress("5-15", all("5-15", 2), facts, 60);
  assert.ok(s.confidence.flags.includes("same-answer"));
  assert.ok(s.confidence.flags.includes("too-fast"));
  assert.equal(s.confidence.level, "low");
});

test("the 30-day plan: support first when needed, 3 distinct real actions", () => {
  const a = all("15+", 0);
  a.W1 = 4; a.S1 = 4; a.L8 = 4;
  const s = scoreStress("15+", a, facts, 900);
  const plan = planActionsFor(s);
  assert.equal(plan[0], "talk");
  assert.equal(plan.length, 3);
  assert.equal(new Set(plan).size, 3);
  assert.ok(plan.every((id) => ACTIONS.some((x) => x.id === id)));
});
