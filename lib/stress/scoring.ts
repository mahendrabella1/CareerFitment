/**
 * Scoring for the Workplace Stress Check. Pure functions (unit-tested in
 * tests/stress/scoring.test.mjs).
 *
 * Every answer is 0-100 (Never 0, Rarely 25, Sometimes 50, Often 75, Almost
 * always 100). Each area is the mean of its answers. The overall Workplace
 * Stress Score is 60% the mean of the four areas + 40% the worst area, so one
 * severe area isn't averaged away by three calm ones.
 */
import { BANK, itemsIn } from "./bank";
import { AREAS, type AreaKey, type Hotspot, type Level, type Quadrant, type StressScores, type Support } from "./types";

export const LEVEL_CUTS = { mild: 25, moderate: 45, high: 65 } as const;
/** An answer of "Often" or more makes a question a top stress point. */
export const HOTSPOT_MIN = 75;
/** Where the "work or workplace" compass splits each axis. */
export const COMPASS_CUT = 45;
/** Under ~2.4 s a question, answers are probably not being read. */
const MIN_SEC_PER_Q = 2.4;

export const valueOf = (answerIndex: number | undefined): number | null =>
  answerIndex === undefined ? null : BANK.scale.values[answerIndex] ?? null;

export function levelFor(v: number): Level {
  if (v >= LEVEL_CUTS.high) return "high";
  if (v >= LEVEL_CUTS.moderate) return "moderate";
  if (v >= LEVEL_CUTS.mild) return "mild";
  return "low";
}

export function quadrantFor(work: number, place: number): Quadrant {
  const w = work >= COMPASS_CUT, p = place >= COMPASS_CUT;
  return w && p ? "both" : w ? "load" : p ? "place" : "steady";
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
/** 60% the mean + 40% the worst - used for the overall score and the "workplace" axis. */
const blend = (xs: number[]) => Math.round(0.6 * mean(xs) + 0.4 * Math.max(...xs));

export function scoreStress(answers: Record<string, number>, durationSec: number): StressScores {
  const areas = {} as Record<AreaKey, number>;
  for (const a of AREAS) {
    const vals = itemsIn(a).map((i) => valueOf(answers[i.id])).filter((v): v is number => v !== null);
    areas[a] = Math.round(mean(vals));
  }
  const overall = blend(AREAS.map((a) => areas[a]));

  const order = new Map(BANK.items.map((i, n) => [i.id, n]));
  const hotspots: Hotspot[] = BANK.items
    .map((i) => ({ id: i.id, value: valueOf(answers[i.id]) ?? 0, area: areas[i.area] }))
    .filter((h) => h.value >= HOTSPOT_MIN)
    .sort((x, y) => y.value - x.value || y.area - x.area || order.get(x.id)! - order.get(y.id)!)
    .map(({ id, value }) => ({ id, value }));

  const rightsHit = (kind: "harassment" | "discrimination") =>
    BANK.items.some((i) => i.rights === kind && (valueOf(answers[i.id]) ?? 0) >= 25);

  const copingIdx = answers[BANK.closing.id];
  const coping = BANK.closing.values[copingIdx] ?? 0;
  const support: Support = copingIdx === 4 ? "high" : copingIdx === 3 ? "watch" : "none";

  const work = areas.workload;
  const place = blend([areas.toxicity, areas.culture, areas.career]);

  const flags: string[] = [];
  const picked = BANK.items.map((i) => answers[i.id]).filter((v) => v !== undefined);
  if (picked.length === BANK.items.length && new Set(picked).size === 1 && picked[0] > 0) flags.push("same-answer");
  if (durationSec > 0 && durationSec < (BANK.items.length + 1) * MIN_SEC_PER_Q) flags.push("too-fast");
  const confidence = { level: flags.includes("same-answer") ? "low" : flags.length ? "medium" : "high", flags } as StressScores["confidence"];

  return {
    overall,
    level: levelFor(overall),
    areas,
    hotspots,
    rights: { harassment: rightsHit("harassment"), discrimination: rightsHit("discrimination") },
    coping,
    support,
    compass: { work, place, quadrant: quadrantFor(work, place) },
    confidence,
  };
}
