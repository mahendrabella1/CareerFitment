/**
 * Scoring for the Stress & Resilience Check. Pure functions - unit-tested in
 * tests/stress/scoring.test.mjs.
 *
 * Every answer becomes 0-100 (5-point scales: 0/25/50/75/100; the Brief COPE's
 * 4 points: 0/33/67/100), reversed where the bank says so, and each pillar is
 * the mean of its answers.
 *  - Burnout = the Copenhagen Burnout Inventory's own scoring: personal and
 *    work-related scale = mean of their items (the last work item reversed);
 *    published bands: under 50 low, 50-74 moderate, 75-99 high, 100 severe.
 *  - Coping = the Brief COPE's own scales (each the mean of its two items).
 *    Carver gives no overall coping score, so the "coping balance" pillar is
 *    OneGrasp's: 50 + (helpful - risky) / 2.
 *  - Work pressures ("load") = four areas - workload, behaviour at work,
 *    culture & relationships, career & job security - each the mean of its
 *    answers; load = 60% their mean + 40% the highest one, so one severe area
 *    (e.g. harassment) isn't averaged away.
 *  - Stress Index (OneGrasp's) = 70% pressure (40% load, 25% signals, 35%
 *    burnout) + 30% missing resources (100 - mean of the five resource
 *    pillars). Zones: under 25 thriving, 25-39 managing, 40-54 stretched,
 *    55-69 strained, 70+ burnout risk - and a burnout score in the CBI's
 *    "high" band (75+) always means the burnout-risk zone.
 */
import { BANK, itemsFor, scaleOf } from "./bank";
import { DOMAINS, HELPFUL_COPING, PILLARS, RISKY_COPING, type Band, type BankItem, type CopeScale, type DomainKey, type Driver, type PillarKey, type Safety, type StressScores, type Zone } from "./types";

export const PRESSURE_WEIGHTS = { load: 0.4, signals: 0.25, burnout: 0.35 } as const;
export const LOAD_WEIGHTS = { mean: 0.6, max: 0.4 } as const;
export const INDEX_WEIGHTS = { pressure: 0.7, missingResources: 0.3 } as const;
export const ZONE_FROM: [Zone, number][] = [["burnout", 70], ["strained", 55], ["stretched", 40], ["managing", 25], ["thriving", 0]];
const ZONE_ORDER: Zone[] = ["thriving", "managing", "stretched", "strained", "burnout"];

const SLEEP_SCORE: Record<string, number> = { lt5: 0, "5-6": 25, "6-7": 60, "7-8": 100, gt8: 90 };

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const round = (x: number) => Math.round(x);
const clamp = (x: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, x));

/** One answer (option index) as 0-100, reversed when the item says so. */
export function itemValue(item: BankItem, answerIndex: number): number {
  const values = BANK.scales[scaleOf(item)].values;
  const v = values[Math.min(Math.max(answerIndex, 0), values.length - 1)];
  return item.reverse ? 100 - v : v;
}

export function zoneFor(index: number, burnout: number): Zone {
  let zone = ZONE_FROM.find(([, from]) => index >= from)![0];
  const atLeast = (z: Zone) => { if (ZONE_ORDER.indexOf(zone) < ZONE_ORDER.indexOf(z)) zone = z; };
  if (burnout >= 75) atLeast("burnout");
  else if (burnout >= 50) atLeast("stretched");
  return zone;
}

export const cbiBand = (score: number): StressScores["burnout"]["band"] =>
  score >= 100 ? "severe" : score >= 75 ? "high" : score >= 50 ? "moderate" : "low";

/** Facts about the work week that point to a cause on their own. */
function factDrivers(facts: Record<string, string>): Driver[] {
  const out: Driver[] = [];
  const w = "workload" as const;
  const hours = facts.F_HOURS, sleep = facts.F_SLEEP, leave = facts.F_LEAVE, commute = facts.F_COMMUTE;
  if (hours === "gt65") out.push({ source: "longhours", value: 100, domain: w });
  else if (hours === "56-65") out.push({ source: "longhours", value: 75, domain: w });
  if (sleep === "lt5") out.push({ source: "sleep", value: 100 });
  else if (sleep === "5-6") out.push({ source: "sleep", value: 75 });
  if (leave === "0") out.push({ source: "noleave", value: 70, domain: w });
  if (commute === "gt120") out.push({ source: "commute", value: 90, domain: w });
  else if (commute === "60-120") out.push({ source: "commute", value: 60, domain: w });
  return out;
}

export function scoreStress(band: Band, answers: Record<string, number>, facts: Record<string, string>, durationSec: number): StressScores {
  const items = itemsFor(band);
  const val = (i: BankItem) => itemValue(i, answers[i.id] ?? 0);
  const ofSection = (s: string) => items.filter((i) => i.section === s);
  const meanOf = (xs: BankItem[]) => mean(xs.map(val));
  const subMean = (s: string, sub: string) => meanOf(ofSection(s).filter((i) => i.sub === sub));

  // Burnout - CBI
  const personal = subMean("burnout", "personal");
  const work = subMean("burnout", "work");
  const burnout = (personal + work) / 2;

  // Coping - Brief COPE scales
  const scales = {} as Record<CopeScale, number>;
  for (const s of [...HELPFUL_COPING, ...RISKY_COPING]) scales[s] = meanOf(ofSection("coping").filter((i) => i.copeScale === s));
  const helpful = mean(HELPFUL_COPING.map((s) => scales[s]));
  const risky = mean(RISKY_COPING.map((s) => scales[s]));

  // Recovery includes sleep as one more element
  const sleep = facts.F_SLEEP in SLEEP_SCORE ? SLEEP_SCORE[facts.F_SLEEP] : null;
  const recoveryParts = ofSection("recovery").map(val);
  if (sleep !== null) recoveryParts.push(sleep);

  // The four workplace stressor areas.
  const domains = Object.fromEntries(DOMAINS.map((d) => [d, meanOf(ofSection(d))])) as Record<DomainKey, number>;
  const domainValues = DOMAINS.map((d) => domains[d]);
  const load = LOAD_WEIGHTS.mean * mean(domainValues) + LOAD_WEIGHTS.max * Math.max(...domainValues);

  const pillars: Record<PillarKey, number> = {
    load,
    signals: meanOf(ofSection("signals")),
    burnout,
    coping: clamp(50 + (helpful - risky) / 2),
    resilience: meanOf(ofSection("resilience")),
    recovery: mean(recoveryParts),
    control: meanOf(ofSection("control")),
    support: meanOf(ofSection("support")),
  };

  const pressure = PRESSURE_WEIGHTS.load * pillars.load + PRESSURE_WEIGHTS.signals * pillars.signals + PRESSURE_WEIGHTS.burnout * pillars.burnout;
  const resources = mean(["coping", "resilience", "recovery", "control", "support"].map((k) => pillars[k as PillarKey]));
  const index = round(clamp(INDEX_WEIGHTS.pressure * pressure + INDEX_WEIGHTS.missingResources * (100 - resources)));

  // What's driving it: pressure answers at the middle of the scale or more,
  // plus the work-week facts; strongest per source.
  const pressureItems = items.filter((i) => (DOMAINS as string[]).includes(i.section));
  const bySource = new Map<string, Driver>();
  const keepMax = (d: Driver) => { const prev = bySource.get(d.source); if (!prev || d.value > prev.value) bySource.set(d.source, d); };
  for (const i of pressureItems) {
    const v = val(i);
    if (v >= 50 && i.source) keepMax({ source: i.source, value: v, domain: i.section as DomainKey });
  }
  factDrivers(facts).forEach(keepMax);
  const order = [...pressureItems.map((i) => i.source!), "longhours", "sleep", "noleave", "commute"];
  // Ties go to the cause from the more strained area, then question order.
  const areaOf = (d: Driver) => (d.domain ? domains[d.domain] : 0);
  const drivers = [...bySource.values()].sort((a, b) => b.value - a.value || areaOf(b) - areaOf(a) || order.indexOf(a.source) - order.indexOf(b.source));
  const reported = (kind: "harassment" | "discrimination") => items.some((i) => i.rights === kind && val(i) >= 25);

  // Safety: the hopelessness check-in, and CBI's "I can't take it anymore".
  const w1 = items.find((i) => i.safety);
  const hopeless = w1 ? val(w1) : 0;
  const cantTake = answers.CBP4 !== undefined ? itemValue(items.find((i) => i.id === "CBP4")!, answers.CBP4) : 0;
  const safety: Safety = hopeless >= 75 ? "high" : hopeless >= 50 || cantTake >= 75 ? "watch" : "none";

  // How far to trust the answers.
  const flags: string[] = [];
  const raw = items.map((i) => answers[i.id]).filter((x) => x !== undefined);
  const counts = new Map<number, number>();
  raw.forEach((x) => counts.set(x, (counts.get(x) ?? 0) + 1));
  if (raw.length && Math.max(...counts.values()) / raw.length > 0.85) flags.push("same-answer");
  const agree = (id: string) => (answers[id] ?? 0) >= 3; // "agree" or "strongly agree"
  if ((agree("R1") && agree("R2")) || (agree("R3") && agree("R4"))) flags.push("contradictions");
  if (durationSec > 0 && durationSec < items.length * 3) flags.push("too-fast");
  const level = flags.length >= 2 ? "low" : flags.length === 1 ? "medium" : "high";

  const r = (x: number) => round(x);
  return {
    index,
    zone: zoneFor(index, burnout),
    pressure: r(pressure),
    resources: r(resources),
    balance: r(resources - pressure),
    pillars: Object.fromEntries(PILLARS.map((k) => [k, r(pillars[k])])) as Record<PillarKey, number>,
    domains: Object.fromEntries(DOMAINS.map((d) => [d, r(domains[d])])) as Record<DomainKey, number>,
    rights: { harassment: reported("harassment"), discrimination: reported("discrimination") },
    signals: { body: r(subMean("signals", "body")), mind: r(subMean("signals", "mind")), emotions: r(subMean("signals", "emotions")), behaviour: r(subMean("signals", "behaviour")) },
    burnout: { personal: r(personal), work: r(work), band: cbiBand(burnout) },
    coping: { scales: Object.fromEntries(Object.entries(scales).map(([k, v]) => [k, r(v)])) as Record<CopeScale, number>, helpful: r(helpful), risky: r(risky) },
    recovery: { sleep },
    support: { work: r(subMean("support", "work")), personal: r(subMean("support", "personal")) },
    drivers,
    safety,
    confidence: { level, flags },
  };
}
