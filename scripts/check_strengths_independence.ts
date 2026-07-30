/**
 * Acceptance test for the Strengths rebuild.
 *
 * The original defect: every Strengths item varied by SUBJECT (tech / health /
 * agri / law) while the action stayed constant, so the section re-measured
 * career interest and its result was a near-duplicate of the RIASEC Interests
 * scale. Fixing the wording only matters if the two scales now move
 * independently, so this measures that directly.
 *
 * Method: build students who are consistent on Interests but vary on Strengths,
 * and vice versa. If the scales are independent, changing one must move that
 * scale and leave the other broadly alone.
 *
 * Run:  node scripts/run_verify_scoring60.mjs check_strengths_independence
 */
import bank from "@/data/assessment-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import type { Category, StageKey } from "@/lib/newAssessment/data";

/* eslint-disable @typescript-eslint/no-explicit-any */
const B = bank as any;
const SB = strengthsBank as any;
const STAGE: StageKey = "9-10";
const SETS = Object.fromEntries(
  ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
   "learning_styles", "motivators", "strengths", "aptitude"].map((c) => [c, "Set 1"])
) as Record<Category, string>;

const CI = B.career_interest[STAGE]["Set 1"] as any[];
const ST = SB[STAGE]["Set 1"] as any[];

let failures = 0;
const check = (name: string, ok: boolean, detail = "") => {
  console.log(`  ${ok ? "PASS" : "FAIL"}  ${name}${detail && !ok ? ` — ${detail}` : ""}`);
  if (!ok) failures += 1;
};

function base(): Record<string, string> {
  const a: Record<string, string> = {};
  for (let i = 0; i < 10; i += 1) a[`aptitude:${i}`] = "2";
  for (let i = 0; i < 5; i += 1) a[`motivators:${i}`] = "0";
  for (let i = 0; i < 4; i += 1) a[`learning_styles:${i}`] = "0";
  for (let i = 0; i < 4; i += 1) a[`multiple_intelligence:${i}`] = "0";
  for (let i = 0; i < 5; i += 1) a[`emotional_intelligence:${i}`] = "0";
  for (let i = 0; i < 12; i += 1) a[`personality:${i}`] = "0";
  return a;
}

/** Answer every interest item with the option leading `cluster`. */
function interests(cluster: string) {
  return CI.map((q) => {
    const i = q.clusterWeights.findIndex((w: any) => {
      const ks = Object.keys(w);
      return ks.reduce((b, k) => (w[k] > w[b] ? k : b), ks[0]) === cluster;
    });
    return i >= 0 ? i : 0;
  });
}
/** Answer every strengths item with the option whose domain is `domain`. */
function strengths(domain: string) {
  return ST.map((q) => {
    const i = (q.domainPerOption ?? []).indexOf(domain);
    return i >= 0 ? i : 0;
  });
}

function run(cluster: string, domain: string) {
  const a = base();
  interests(cluster).forEach((p, i) => { a[`career_interest:${i}`] = String(p); });
  strengths(domain).forEach((p, i) => { a[`strengths:${i}`] = String(p); });
  const r = scoreAssessment60(STAGE, SETS, a);
  return {
    theme: (r.themes ?? [])[0]?.title ?? "—",
    strength: (r.strengthsBreakdown ?? [])[0]?.name ?? "—",
    careers: r.matches.slice(0, 3).map((m) => m.title),
  };
}

console.log("=".repeat(78));
console.log("STRENGTHS / INTERESTS INDEPENDENCE");
console.log("=".repeat(78));

console.log("\nSame interest (Health), four different working styles:");
const held: string[] = [];
for (const d of ["Execution", "Creative", "Relationship", "Analytical"]) {
  const r = run("C", d);
  held.push(r.strength);
  console.log(`   strengths=${d.padEnd(13)} -> top theme ${r.theme.padEnd(22)} top strength ${r.strength.padEnd(14)} ${r.careers.join(", ")}`);
}
check("changing working style changes the strengths result",
  new Set(held).size >= 3, `got ${JSON.stringify(held)}`);

console.log("\nSame working style (Execution), four different interests:");
const themes: string[] = [];
const strengthsHeld: string[] = [];
for (const c of ["C", "D", "E", "F"]) {
  const r = run(c, "Execution");
  themes.push(r.theme);
  strengthsHeld.push(r.strength);
  console.log(`   interests=${c.padEnd(15)} -> top theme ${r.theme.padEnd(22)} top strength ${r.strength.padEnd(14)} ${r.careers.join(", ")}`);
}
check("changing interest changes the interest result",
  new Set(themes).size >= 3, `got ${JSON.stringify(themes)}`);
check("holding working style constant keeps the strengths result stable",
  new Set(strengthsHeld).size === 1, `got ${JSON.stringify(strengthsHeld)}`);

// The original defect in one line: if Strengths merely re-measured Interests,
// the strengths result would track the interest answers.
console.log("\nThe original defect check:");
check("strengths does NOT track interests — the two scales are independent",
  new Set(strengthsHeld).size === 1 && new Set(held).size >= 3,
  `strengths varied with interest: ${JSON.stringify(strengthsHeld)}`);

/* ---------------------------------------------------------------- coverage */
console.log("\nEvery working style is reachable:");
const reachable = new Set<string>();
ST.forEach((q) => (q.domainPerOption ?? []).forEach((d: string) => reachable.add(d)));
check("all 8 strength domains appear as an option's primary",
  reachable.size === 8, `${[...reachable].sort().join(", ")}`);
const groups = new Set<string>();
ST.forEach((q) => (q.reportGroups ?? []).forEach((g: string) => groups.add(g)));
check("all 4 report groups are present", groups.size === 4, [...groups].join(", "));
check("no option names a field of work",
  !ST.some((q) => q.options.some((o: string) =>
    /\b(tech|health|law|agri|media|finance|engineering)\b/i.test(o))));

console.log(failures === 0 ? "\nAll checks passed.\n" : `\n${failures} check(s) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
