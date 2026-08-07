/**
 * Verifies the two fixes to career recommendation, against the live 9-10 bank.
 *
 * The reported symptom was a student being recommended construction, and
 * generally being shown careers that had nothing to do with their answers.
 * Two independent causes:
 *
 *   1. shareRank blended an "expected share" into every dimension's score, so a
 *      cluster the student NEVER picked still scored. Health Science is offered
 *      on barely any interest option in this bank, and that floor alone scored
 *      it 47 for someone who never chose it. Dividing by a rare dimension's own
 *      tiny expected share also multiplied it, so one stray click outranked
 *      several deliberate picks.
 *
 *   2. The career pool was too small and too lopsided to answer with: 61
 *      professions, of which Health had 3, Science 2, IT 4 and Sports 1, and 13
 *      had no affinity entries at all so were unreachable. Research Scientist
 *      sat in 18 of 191 affinity slots against a mean of 4, so it matched
 *      whatever a student scored and topped almost every profile.
 *
 * Run:  node scripts/run_verify_scoring60.mjs
 */
import bank from "@/data/assessment-questions.json";
import careerMap from "@/data/career-map-9-10.json";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import type { Category, StageKey } from "@/lib/newAssessment/data";

/* eslint-disable @typescript-eslint/no-explicit-any */
const B = bank as any;
const MAP = careerMap as any;
const STAGE: StageKey = "9-10";
const SETS = Object.fromEntries(
  ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
   "learning_styles", "motivators", "strengths", "aptitude"].map((c) => [c, "Set 1"])
) as Record<Category, string>;

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

const CI = B.career_interest[STAGE]["Set 1"] as any[];

function answers(interestPick: (q: any, i: number) => number) {
  const a: Record<string, string> = {};
  CI.forEach((q, i) => { a[`career_interest:${i}`] = String(interestPick(q, i)); });
  for (let i = 0; i < 10; i += 1) a[`aptitude:${i}`] = "0";
  for (let i = 0; i < 8; i += 1) a[`strengths:${i}`] = "0";
  for (let i = 0; i < 5; i += 1) a[`motivators:${i}`] = "0";
  for (let i = 0; i < 4; i += 1) a[`learning_styles:${i}`] = "0";
  for (let i = 0; i < 4; i += 1) a[`multiple_intelligence:${i}`] = "0";
  for (let i = 0; i < 5; i += 1) a[`emotional_intelligence:${i}`] = "0";
  for (let i = 0; i < 12; i += 1) a[`personality:${i}`] = "0";
  return a;
}

/* ------------------------------------------------------------------------ 1 */
console.log("\n[1] no cluster scores unless the student actually earned it");
const picks = answers(() => 0);
const earned: Record<string, number> = {};
CI.forEach((q, i) => {
  const w = q.clusterWeights?.[Number(picks[`career_interest:${i}`])] ?? {};
  for (const [k, v] of Object.entries(w)) earned[k] = (earned[k] ?? 0) + (v as number);
});
const r = scoreAssessment60(STAGE, SETS, picks);
const themes = r.themes ?? [];
const ghosts = themes.filter((t) => t.score > 0 && !earned[t.letter]);
check("a cluster with no earned weight scores 0 — no manufactured themes",
  ghosts.length === 0, ghosts.map((g) => `${g.title}=${g.score}`).join(", "));
check("every cluster that did earn weight is reported",
  Object.keys(earned).every((k) => themes.some((t) => t.letter === k)));

// Rarity must not be rewarded.
const byWeight = Object.entries(earned).sort((a, b) => a[1] - b[1]);
if (byWeight.length >= 2) {
  const lowest = themes.find((t) => t.letter === byWeight[0][0])?.score ?? 0;
  const highest = themes.find((t) => t.letter === byWeight[byWeight.length - 1][0])?.score ?? 0;
  check("the least-earned cluster does not outscore the most-earned",
    lowest <= highest,
    `${byWeight[0][0]}=${lowest} vs ${byWeight[byWeight.length - 1][0]}=${highest}`);
}

/* ------------------------------------------------------------------------ 2 */
console.log("\n[2] the career pool can actually answer the question");
const pc = MAP.professionCluster as Record<string, string>;
const perCluster: Record<string, number> = {};
for (const c of Object.values(pc)) perCluster[c] = (perCluster[c] ?? 0) + 1;
check("at least 100 professions in the pool", Object.keys(pc).length >= 100,
  `${Object.keys(pc).length}`);
check("every cluster offers at least 10 careers",
  Object.values(perCluster).every((n) => n >= 10),
  Object.entries(perCluster).filter(([, n]) => n < 10).map(([c, n]) => `${c}=${n}`).join(", "));

const breadth: Record<string, number> = {};
for (const table of Object.values(MAP.affinity as Record<string, Record<string, string[]>>)) {
  for (const list of Object.values(table)) for (const p of list) breadth[p] = (breadth[p] ?? 0) + 1;
}
const unreachable = Object.keys(pc).filter((p) => !breadth[p]);
check("no profession is unreachable", unreachable.length === 0,
  `${unreachable.length}: ${unreachable.slice(0, 5).join(", ")}`);
const vals = Object.values(breadth);
const mean = vals.reduce((s, n) => s + n, 0) / vals.length;
check("no profession wins on breadth alone (max under 2x the mean)",
  Math.max(...vals) < mean * 2,
  `max ${Math.max(...vals)} vs mean ${mean.toFixed(1)}`);

/* ------------------------------------------------------------------------ 3 */
console.log("\n[3] every profession the questions name is known to the map");
const named = new Set<string>();
for (const q of CI) for (const list of q.careers ?? []) for (const p of list) named.add(p);
const unknown = [...named].filter((p) => !pc[p]);
check("interest options only name professions the map recognises",
  unknown.length === 0, unknown.join(", "));

/* ------------------------------------------------------------------------ 4 */
console.log("\n[4] scoring keys line up with the map's lookup tables");
const eiDims = new Set((B.emotional_intelligence[STAGE]["Set 1"] as any[]).map((q) => q.dimension));
const eiKeys = new Set(Object.keys(MAP.affinity.ei));
check("every EI dimension the bank emits is a key in the map",
  [...eiDims].every((d) => eiKeys.has(d as string)),
  [...eiDims].filter((d) => !eiKeys.has(d as string)).join(", "));

/* ------------------------------------------------------------------------ 5 */
console.log("\n[5] a full run still produces a complete report");
check("career matches are produced", r.matches.length > 0, `${r.matches.length}`);
check("matches resolve to a named cluster, not a bare fallback",
  r.matches.every((m) => m.blurb !== "Career match"),
  r.matches.map((m) => `${m.title}=${m.blurb}`).join(", "));
check("Big Five reports all 5 traits", r.topStrengths.length === 5, `${r.topStrengths.length}`);
check("a RIASEC code is produced", (r.riasecCode ?? "").length === 3, `"${r.riasecCode}"`);
check("EI returns a score", typeof r.ei === "number", `${r.ei}`);
check("aptitude returns a score", typeof r.aptitudePct === "number", `${r.aptitudePct}`);
check("the outcome label names a trait in plain words, not a temperament",
  typeof r.outcomeLabel === "string" && !/sanguine|choleric|melancholic|phlegmatic/i.test(r.outcomeLabel),
  `${r.outcomeLabel}`);

/* -------------------------------------------------------------------------- */
console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
