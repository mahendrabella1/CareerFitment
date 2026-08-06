/**
 * Cluster-balance audit.
 *
 * The coverage audit asks whether the recommendation AGREES with the student's
 * own top cluster. This one asks a different and, for a real cohort, more
 * damaging question: are the eight clusters reachable in equal measure, or does
 * the engine funnel most students into the same three or four regardless of how
 * they answer?
 *
 * Two distributions are measured, because the student sees both:
 *
 *   themes[0]      the top career cluster from the interest section â€” drives the
 *                  "Top career" column, the academic path and the roadmap.
 *   domainFit()[0] the leading domain CARD in the report, which blends interest
 *                  with abilities, intelligences and values.
 *
 * A flat 12.5% per cluster is not the target â€” real interests are not uniform â€”
 * but a cluster that a random cohort reaches under ~4% of the time is one no
 * student is being pointed at, and a cluster above ~25% is absorbing students
 * who belong elsewhere.
 *
 * Run:  node scripts/run_verify_scoring60.mjs audit_cluster_balance
 */
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import { domainFit } from "@/lib/report/knowledge";
import type { Category, StageKey } from "@/lib/newAssessment/data";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

/* eslint-disable @typescript-eslint/no-explicit-any */
const B = bank as any;
const STAGE: StageKey = "9-10";
const CATS: Category[] = [
  "personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
  "learning_styles", "motivators", "strengths", "aptitude",
];
const SETS = Object.fromEntries(CATS.map((c) => [c, "Set 1"])) as Record<Category, string>;

const setOf = (cat: Category) =>
  cat === "aptitude" ? (aptitudeBank as any)[STAGE]["Set 1"]
  : cat === "strengths" ? (strengthsBank as any)[STAGE]["Set 1"]
  : B[cat][STAGE]["Set 1"];

const SECTIONS: [Category, number][] = CATS.map((c) => [c, (setOf(c) as any[]).length]);
const optionCount = (cat: Category, i: number): number => (setOf(cat)[i]?.options ?? []).length || 4;

const NAME: Record<string, string> = {
  A: "Core Engineering & Infrastructure", B: "Information Technology", C: "Health Science",
  D: "Arts, Media & Design", E: "Business & Marketing", F: "Human & Public Services",
  G: "Science, Nature & Agriculture", H: "Sports, Hospitality & Lifestyle",
};
const KEYS = Object.keys(NAME);

let seed = 987654321;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

function pattern(pick: (cat: Category, i: number, n: number) => number) {
  const a: Record<string, string> = {};
  for (const [cat, count] of SECTIONS) {
    for (let i = 0; i < count; i += 1) a[`${cat}:${i}`] = String(pick(cat, i, optionCount(cat, i)));
  }
  return a;
}

const N = 800;
const themeTop: Record<string, number> = {};
const domainTop: Record<string, number> = {};
const domainTop3: Record<string, number> = {};
for (const k of KEYS) { themeTop[k] = 0; domainTop[k] = 0; domainTop3[k] = 0; }

const byName: Record<string, string> = {};
for (const [k, v] of Object.entries(NAME)) byName[v] = k;

for (let t = 0; t < N; t += 1) {
  const res = scoreAssessment60(STAGE, SETS, pattern((_c, _i, n) => Math.floor(rnd() * n)));
  const th = (res.themes ?? [])[0]?.letter;
  if (th && themeTop[th] != null) themeTop[th] += 1;

  const fits = domainFit(res as unknown as AssessmentSummary);
  const d0 = byName[fits[0]?.name ?? ""];
  if (d0) domainTop[d0] += 1;
  for (const f of fits.slice(0, 3)) { const k = byName[f.name]; if (k) domainTop3[k] += 1; }
}

const bar = (pct: number) => "#".repeat(Math.round(pct / 2));
const line = (k: string, n: number, total: number) => {
  const p = (n / total) * 100;
  const flag = p < 4 ? "  <- near-unreachable" : p > 25 ? "  <- absorbing" : "";
  return `   ${k} ${NAME[k].padEnd(32)} ${p.toFixed(1).padStart(5)}%  ${bar(p).padEnd(26)}${flag}`;
};

console.log("=".repeat(84));
console.log(`CLUSTER BALANCE â€” ${N} randomly-answering students, stage ${STAGE}`);
console.log("=".repeat(84));
console.log("\nTOP INTEREST CLUSTER (themes[0]) â€” drives top career, academic path, roadmap");
for (const k of KEYS) console.log(line(k, themeTop[k], N));

console.log("\nLEADING DOMAIN CARD (domainFit()[0]) â€” what the report shows first");
for (const k of KEYS) console.log(line(k, domainTop[k], N));

console.log("\nIN THE TOP THREE DOMAIN CARDS (domainFit()[0..2])");
for (const k of KEYS) console.log(line(k, domainTop3[k], N * 3));

/* ---------------------------------------------------------------------------
 * Where does the skew come from â€” the scorer, or the bank it reads?
 *
 * themes[] is a share-rank over the clusterWeights the student's chosen options
 * award. If the bank barely offers a cluster, no scoring change can rescue it:
 * a student cannot pick an option that was never on the page. This counts, per
 * cluster, how much weight the bank makes available at all, and on how many
 * questions that cluster is the single best answer available.
 * ------------------------------------------------------------------------- */
console.log("\n" + "=".repeat(84));
console.log("WHERE THE SKEW COMES FROM â€” cluster weight available in the interest bank");
console.log("=".repeat(84));

for (const stage of ["9-10"] as StageKey[]) {
  const sets = Object.keys(B.career_interest[stage] ?? {});
  const mass: Record<string, number> = {};
  const winnable: Record<string, number> = {};
  for (const k of KEYS) { mass[k] = 0; winnable[k] = 0; }
  let questions = 0;

  for (const setName of sets) {
    const qs = B.career_interest[stage][setName] as any[];
    for (const q of qs) {
      const ws = (q.clusterWeights ?? []) as Record<string, number>[];
      if (!ws.length) continue;
      questions += 1;
      for (const w of ws) {
        // Which cluster does this single option most reward? That is the one a
        // student actually moves when they choose it.
        let best = "", bestN = -Infinity;
        for (const [k, n] of Object.entries(w || {})) {
          mass[k] = (mass[k] ?? 0) + n;
          if (n > bestN) { bestN = n; best = k; }
        }
        if (best && winnable[best] != null) winnable[best] += 1;
      }
    }
  }

  const totalMass = Object.values(mass).reduce((s, n) => s + n, 0) || 1;
  console.log(`\nstage ${stage} Â· ${sets.length} set(s) Â· ${questions} interest questions`);
  console.log("   cluster                            share of all weight   options where it leads");
  for (const k of KEYS) {
    const share = (mass[k] / totalMass) * 100;
    console.log(
      `   ${k} ${NAME[k].padEnd(32)} ${share.toFixed(1).padStart(5)}%  ${bar(share).padEnd(20)} ${String(winnable[k]).padStart(4)}`
    );
  }
  const starved = KEYS.filter((k) => winnable[k] === 0);
  if (starved.length) console.log(`   never the best option anywhere: ${starved.join(", ")}`);
}

const dead = KEYS.filter((k) => (domainTop[k] / N) * 100 < 4);
const hog = KEYS.filter((k) => (domainTop[k] / N) * 100 > 25);
console.log("\n" + "-".repeat(84));
console.log(`clusters a random cohort almost never leads with : ${dead.length ? dead.join(", ") : "none"}`);
console.log(`clusters absorbing more than a quarter of students: ${hog.length ? hog.join(", ") : "none"}`);
const spread = Math.max(...KEYS.map((k) => domainTop[k])) - Math.min(...KEYS.map((k) => domainTop[k]));
console.log(`spread between most- and least-recommended domain : ${((spread / N) * 100).toFixed(1)} points`);
