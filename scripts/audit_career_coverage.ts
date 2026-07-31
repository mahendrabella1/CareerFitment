/**
 * Career-pool coverage audit.
 *
 * Sweeps a large set of answer patterns through the real scorer and asks three
 * questions that can actually be measured without follow-up data on students:
 *
 *   REACHABILITY  Can each career in the pool ever be recommended at all? A
 *                 career no answer pattern reaches is dead weight — it inflates
 *                 the catalogue without ever helping a student.
 *
 *   AGREEMENT     Does the top career sit in the cluster the student's own
 *                 answers scored highest? If the profile says Health and the
 *                 recommendation says Engineer, something upstream is wrong.
 *
 *   DISCRIMINATION Do different answer patterns produce different careers, or
 *                 does the engine converge on the same handful regardless?
 *
 * Run:  node scripts/run_verify_scoring60.mjs audit_career_coverage
 */
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
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

const SECTIONS: [Category, number][] = [
  ["career_interest", (B.career_interest[STAGE]["Set 1"] as any[]).length],
  ["aptitude", (aptitudeBank as any)[STAGE]["Set 1"].length],
  ["personality", (B.personality[STAGE]["Set 1"] as any[]).length],
  ["strengths", (strengthsBank as any)[STAGE]["Set 1"].length],
  ["motivators", (B.motivators[STAGE]["Set 1"] as any[]).length],
  ["learning_styles", (B.learning_styles[STAGE]["Set 1"] as any[]).length],
  ["multiple_intelligence", (B.multiple_intelligence[STAGE]["Set 1"] as any[]).length],
  ["emotional_intelligence", (B.emotional_intelligence[STAGE]["Set 1"] as any[]).length],
];

const optionCount = (cat: Category, i: number): number => {
  const set = cat === "aptitude" ? (aptitudeBank as any)[STAGE]["Set 1"]
            : cat === "strengths" ? (strengthsBank as any)[STAGE]["Set 1"]
            : B[cat][STAGE]["Set 1"];
  return (set[i]?.options ?? []).length || 4;
};

/** Deterministic pseudo-random so the sweep is reproducible. */
let seed = 12345;
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

function pattern(pick: (cat: Category, i: number, n: number) => number) {
  const a: Record<string, string> = {};
  for (const [cat, count] of SECTIONS) {
    for (let i = 0; i < count; i += 1) {
      a[`${cat}:${i}`] = String(pick(cat, i, optionCount(cat, i)));
    }
  }
  return a;
}

const CI = B.career_interest[STAGE]["Set 1"] as any[];
const CLUSTER_NAME: Record<string, string> = {
  A: "Engineering & Construction", B: "Information Technology", C: "Health Science",
  D: "Arts, Media & Design", E: "Business & Marketing", F: "Human & Public Services",
  G: "Science, Nature & Agriculture", H: "Sports, Hospitality & Lifestyle",
};

/** Answer every interest item with the option that leads `letter`, if offered. */
const interestFor = (letter: string) => (cat: Category, i: number, n: number) => {
  if (cat !== "career_interest") return 0;
  const w = CI[i].clusterWeights as any[];
  const idx = w.findIndex((x) => {
    const ks = Object.keys(x);
    return ks.reduce((b, k) => (x[k] > x[b] ? k : b), ks[0]) === letter;
  });
  return idx >= 0 ? idx : i % n;
};

const seen = new Map<string, number>();
const rows: { label: string; topCluster: string; top: string; topClusterOfCareer: string }[] = [];
const pc = MAP.professionCluster as Record<string, string>;

function run(label: string, pick: (c: Category, i: number, n: number) => number) {
  const r = scoreAssessment60(STAGE, SETS, pattern(pick));
  for (const m of r.matches) seen.set(m.title, (seen.get(m.title) ?? 0) + 1);
  const topCluster = (r.themes ?? [])[0]?.letter ?? "-";
  const top = r.matches[0]?.title ?? "-";
  rows.push({ label, topCluster, top, topClusterOfCareer: pc[top] ?? "?" });
}

// 1. Pure profiles: consistent on interests, every other section swept.
for (const letter of Object.keys(CLUSTER_NAME)) {
  for (let variant = 0; variant < 8; variant += 1) {
    run(`${letter}/v${variant}`, (cat, i, n) =>
      cat === "career_interest" ? interestFor(letter)(cat, i, n) : (i + variant) % n);
  }
}
// 2. Random profiles, to catch careers only reachable by mixed answers.
for (let t = 0; t < 400; t += 1) {
  run(`rand${t}`, (_c, _i, n) => Math.floor(rnd() * n));
}

console.log("=".repeat(78));
console.log(`CAREER POOL COVERAGE — ${rows.length} simulated students`);
console.log("=".repeat(78));

const all = Object.keys(pc);
const never = all.filter((p) => !seen.has(p)).sort();
console.log(`\npool size                    ${all.length}`);
console.log(`ever recommended             ${all.length - never.length}`);
console.log(`NEVER recommended            ${never.length}`);
if (never.length) {
  const byCluster: Record<string, string[]> = {};
  for (const p of never) (byCluster[pc[p]] ??= []).push(p);
  for (const c of Object.keys(byCluster).sort()) {
    console.log(`   ${c} ${CLUSTER_NAME[c]}`);
    console.log(`      ${byCluster[c].join(", ")}`);
  }
}

const agree = rows.filter((r) => r.topCluster === r.topClusterOfCareer).length;
console.log(`\ntop career sits in the student's own top cluster: ` +
  `${agree}/${rows.length} = ${((agree / rows.length) * 100).toFixed(1)}%`);

const distinctTops = new Set(rows.map((r) => r.top));
console.log(`distinct careers appearing as the #1 match      : ${distinctTops.size}`);

const topCounts = [...seen.entries()].sort((a, b) => b[1] - a[1]);
console.log(`\nmost-recommended (appearances in any top-6):`);
for (const [p, n] of topCounts.slice(0, 10)) {
  console.log(`   ${p.padEnd(28)} ${n}  (${((n / rows.length) * 100).toFixed(0)}% of students)`);
}

console.log(`\nby cluster, how many of its careers are ever reachable:`);
for (const c of Object.keys(CLUSTER_NAME)) {
  const inC = all.filter((p) => pc[p] === c);
  const hit = inC.filter((p) => seen.has(p)).length;
  console.log(`   ${c} ${CLUSTER_NAME[c].padEnd(32)} ${hit}/${inC.length}`);
}

/* -------------------------------------------------------------------------- *
 * How much does the interest dimension need to weigh for the recommendation to
 * agree with the student's own strongest interest?
 *
 * scoring60 reads the same imported career-map object, so mutating
 * dimensionWeights here changes what the scorer uses — which makes this a real
 * sweep rather than a guess.
 * -------------------------------------------------------------------------- */
console.log(`\n${"=".repeat(78)}`);
console.log("HOW HEAVILY SHOULD INTERESTS COUNT?");
console.log("=".repeat(78));
console.log("interest weight   agreement   distinct #1 careers");

const original = { ...(MAP.dimensionWeights as Record<string, number>) };
const others = Object.keys(original).filter((k) => k !== "career_interest");
const otherTotal = others.reduce((s, k) => s + original[k], 0);

for (const w of [0.2, 0.3, 0.4, 0.5, 0.6, 0.7]) {
  // Hold the other dimensions' relative proportions, scale them to fill 1 - w.
  MAP.dimensionWeights.career_interest = w;
  for (const k of others) MAP.dimensionWeights[k] = (original[k] / otherTotal) * (1 - w);

  let ok = 0;
  const tops = new Set<string>();
  const trials: (() => Record<string, string>)[] = [];
  for (const letter of Object.keys(CLUSTER_NAME)) {
    for (let v = 0; v < 8; v += 1) {
      trials.push(() => pattern((cat, i, n) =>
        cat === "career_interest" ? interestFor(letter)(cat, i, n) : (i + v) % n));
    }
  }
  seed = 12345;
  for (let t = 0; t < 400; t += 1) trials.push(() => pattern((_c, _i, n) => Math.floor(rnd() * n)));

  for (const make of trials) {
    const res = scoreAssessment60(STAGE, SETS, make());
    const tc = (res.themes ?? [])[0]?.letter ?? "-";
    const t0 = res.matches[0]?.title ?? "-";
    tops.add(t0);
    if (pc[t0] === tc) ok += 1;
  }
  const pctAgree = (ok / trials.length) * 100;
  const flag = w === 0.2 ? "  <- current" : "";
  console.log(`      ${w.toFixed(2)}          ${pctAgree.toFixed(1)}%        ${String(tops.size).padStart(3)}${flag}`);
}
Object.assign(MAP.dimensionWeights, original);
console.log("\n(agreement = the #1 career sits in the cluster the student's own answers ranked first)");

/* -------------------------------------------------------------------------- *
 * What is still holding agreement down?
 *
 * Ranking multiplies fit by a coverage term, 0.35 + 0.65 * (coverage/max), so a
 * profession only a few dimensions know about is handicapped no matter how well
 * it fits. That is deliberate — it stops a career one dimension happens to
 * mention from beating one the whole profile supports — but it also lets a
 * broadly-known career from the wrong cluster outrank a well-fitting one from
 * the right cluster. This measures the trade-off instead of guessing at it.
 * -------------------------------------------------------------------------- */
console.log(`\n${"=".repeat(78)}`);
console.log("WHAT AGREEMENT COSTS IN DIVERSITY");
console.log("=".repeat(78));
console.log("A ceiling is expected here: perfect agreement would mean the other seven");
console.log("dimensions never change which career wins, i.e. a 12-question interest quiz.");
console.log("\nAgreement by how close the student's top two clusters are:");

seed = 12345;
const buckets: Record<string, { n: number; ok: number }> = {
  "decisive (gap > 30)": { n: 0, ok: 0 },
  "clear (gap 10-30)": { n: 0, ok: 0 },
  "tied (gap < 10)": { n: 0, ok: 0 },
};
for (let t = 0; t < 600; t += 1) {
  const res = scoreAssessment60(STAGE, SETS, pattern((_c, _i, n) => Math.floor(rnd() * n)));
  const th = res.themes ?? [];
  if (th.length < 2) continue;
  const gap = th[0].score - th[1].score;
  const key = gap > 30 ? "decisive (gap > 30)" : gap >= 10 ? "clear (gap 10-30)" : "tied (gap < 10)";
  buckets[key].n += 1;
  if (pc[res.matches[0]?.title ?? ""] === th[0].letter) buckets[key].ok += 1;
}
for (const [k, v] of Object.entries(buckets)) {
  if (!v.n) continue;
  console.log(`   ${k.padEnd(22)} ${String(v.n).padStart(3)} students   ` +
    `${((v.ok / v.n) * 100).toFixed(1)}% agreement`);
}
console.log("\nWhen a student's interests are decisive the engine follows them. The");
console.log("disagreements are concentrated where their own answers were ambivalent —");
console.log("which is the case where a single 'best career' is the wrong thing to promise.");
