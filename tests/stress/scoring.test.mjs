import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK, itemsFor, stepsFor } from "../../lib/stress/bank.ts";
import { cbiBand, itemValue, scoreStress, zoneFor } from "../../lib/stress/scoring.ts";
import { ACTIONS, DRIVER_META, planActionsFor } from "../../lib/stress/content.ts";
import { DOMAINS } from "../../lib/stress/types.ts";

const item = (id) => BANK.items.find((i) => i.id === id);
/** Answers where every item gets the same option index. */
const all = (band, idx) => Object.fromEntries(itemsFor(band).map((i) => [i.id, idx]));
const facts = { F_SLEEP: "7-8", F_HOURS: "40-48", F_LEAVE: "11-20", F_COMMUTE: "lt30" };
const RESOURCE_SECTIONS = ["resilience", "control", "support", "recovery"];

/** Low pressure everywhere, strong resources. */
function calm(band) {
  const a = all(band, 0);
  for (const i of itemsFor(band)) {
    if (RESOURCE_SECTIONS.includes(i.section)) a[i.id] = i.reverse ? 0 : 4;
    if (i.copeScale && ["active", "planning", "reframing", "emotional", "advice"].includes(i.copeScale)) a[i.id] = 3;
  }
  a.CBW7 = 4; a.W2 = 4;
  return a;
}

test("each band gets the shared core plus only its own 4 questions", () => {
  for (const band of ["0-5", "5-15", "15+"]) {
    const own = itemsFor(band).filter((i) => i.band);
    assert.equal(own.length, 4, band);
    assert.ok(own.every((i) => i.band === band));
    assert.equal(stepsFor(band).length, itemsFor(band).length + BANK.facts.length);
  }
  assert.equal(new Set(BANK.items.map((i) => i.id)).size, BANK.items.length, "item ids are unique");
});

test("the four workplace areas cover what was asked for", () => {
  const ofDomain = (d) => BANK.items.filter((i) => i.section === d && !i.band).map((i) => i.source);
  assert.deepEqual(ofDomain("workload"), ["tasks", "deadlines", "overtime", "balance", "boundaries", "outside", "flexibility", "excluded", "expectations", "communication", "roleconflict"]);
  assert.deepEqual(ofDomain("toxicity"), ["fearleader", "gaslighting", "gossip", "cliques", "credit", "discrimination", "harassment", "hostileteam"]);
  assert.deepEqual(ofDomain("culture"), ["politics", "bullying", "psychsafety", "peers", "fit", "orgchange", "relations"]);
  assert.deepEqual(ofDomain("career"), ["layoffs", "suddenloss", "promotion", "skills", "costofliving", "payeffort", "recognition", "stuck"]);
  const sources = BANK.items.map((i) => i.source).filter(Boolean);
  assert.ok(sources.every((s) => DRIVER_META[s]), "every stress source has words");
});

test("the standard instruments are complete: CBI personal 6 + work 7, Brief COPE 8 scales x 2", () => {
  const cbi = BANK.items.filter((i) => i.std === "CBI");
  assert.equal(cbi.filter((i) => i.sub === "personal").length, 6);
  assert.equal(cbi.filter((i) => i.sub === "work").length, 7);
  const byScale = {};
  BANK.items.filter((i) => i.std === "BriefCOPE").forEach((i) => (byScale[i.copeScale] = (byScale[i.copeScale] ?? 0) + 1));
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
  assert.equal(Math.round(itemValue(item("BC2"), 1)), 33, "Brief COPE's 4 points");
});

test("a calm profile lands in thriving, a heavy one in burnout risk", () => {
  const good = scoreStress("0-5", calm("0-5"), facts, 900);
  assert.equal(good.zone, "thriving");
  assert.ok(good.index < 25, `index ${good.index}`);
  assert.ok(DOMAINS.every((d) => good.domains[d] === 0));
  assert.equal(good.safety, "none");
  assert.deepEqual(good.rights, { harassment: false, discrimination: false });

  const heavy = all("0-5", 4);
  for (const i of itemsFor("0-5")) {
    if (RESOURCE_SECTIONS.includes(i.section)) heavy[i.id] = i.reverse ? 4 : 0;
    if (i.section === "coping") heavy[i.id] = ["givingup", "selfblame", "substance"].includes(i.copeScale) ? 3 : 0;
  }
  heavy.CBW7 = 0;
  const bad = scoreStress("0-5", heavy, { F_SLEEP: "lt5", F_HOURS: "gt65", F_LEAVE: "0", F_COMMUTE: "gt120" }, 1200);
  assert.equal(bad.zone, "burnout");
  assert.ok(bad.index >= 70, `index ${bad.index}`);
  assert.ok(DOMAINS.every((d) => bad.domains[d] === 100));
  assert.equal(bad.safety, "high");
  assert.deepEqual(bad.rights, { harassment: true, discrimination: true });
});

test("work pressures: one severe area isn't averaged away (60% mean + 40% worst)", () => {
  const a = calm("5-15");
  for (const i of itemsFor("5-15").filter((x) => x.section === "toxicity")) a[i.id] = 4;
  const s = scoreStress("5-15", a, facts, 900);
  assert.equal(s.domains.toxicity, 100);
  assert.equal(s.domains.workload, 0);
  assert.equal(s.pillars.load, Math.round(0.6 * 25 + 0.4 * 100), "mean 25, worst 100 -> 55");
});

test("a single 'once or twice' harassment answer shows rights at work, and the plan leads with them", () => {
  const a = calm("0-5");
  a.TX7 = 1;
  const s = scoreStress("0-5", a, facts, 900);
  assert.equal(s.rights.harassment, true);
  assert.equal(planActionsFor(s)[0], "harassment-rights");
});

test("drivers: answers and work-week facts count, strongest first, with their area", () => {
  const a = all("0-5", 0);
  a.E1b = 4; a.CR5 = 3;
  const s = scoreStress("0-5", a, { ...facts, F_HOURS: "56-65" }, 900);
  assert.deepEqual(s.drivers.map((d) => d.source), ["confidence", "costofliving", "longhours"]);
  assert.deepEqual(s.drivers.map((d) => d.domain), ["career", "career", "workload"]);
});

test("answer-quality flags: same answer everywhere and racing through", () => {
  const s = scoreStress("5-15", all("5-15", 2), facts, 60);
  assert.ok(s.confidence.flags.includes("same-answer"));
  assert.ok(s.confidence.flags.includes("too-fast"));
  assert.equal(s.confidence.level, "low");
});

test("the 30-day plan: support first when needed, 3 distinct real actions", () => {
  const a = all("15+", 0);
  a.W1 = 4; a.S1 = 4; a.CR5 = 4;
  const s = scoreStress("15+", a, facts, 900);
  const plan = planActionsFor(s);
  assert.equal(plan[0], "talk");
  assert.equal(plan.length, 3);
  assert.equal(new Set(plan).size, 3);
  assert.ok(plan.every((id) => ACTIONS.some((x) => x.id === id)));
});
