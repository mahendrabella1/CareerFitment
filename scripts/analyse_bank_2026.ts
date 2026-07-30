/**
 * Diagnostic: run consistent personas through the live 9-10 bank and print what
 * the report would recommend. Read-only — changes nothing.
 *
 * Run:  node scripts/run_verify_scoring60.mjs analyse_bank_2026
 */
import bank from "@/data/assessment-questions.json";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import type { Category, StageKey } from "@/lib/newAssessment/data";

/* eslint-disable @typescript-eslint/no-explicit-any */
const B = bank as any;
const STAGE: StageKey = "9-10";
const SETS = Object.fromEntries(
  ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
   "learning_styles", "motivators", "strengths", "aptitude"].map((c) => [c, "Set 1"])
) as Record<Category, string>;

const CI = B.career_interest[STAGE]["Set 1"] as any[];

/** For each interest item, the option index whose cluster is `letter`. */
function pickFor(letter: string): number[] {
  return CI.map((q) => {
    const idx = q.clusterWeights.findIndex((w: any) => Object.keys(w)[0] === letter);
    return idx >= 0 ? idx : 0;
  });
}
function clusterOf(qi: number, oi: number) {
  return Object.keys(CI[qi].clusterWeights[oi])[0];
}

/** Index of the option whose dominant key is `want`, else -1. */
function optionFor(cat: string, qi: number, field: string, want: string): number {
  const q = (B[cat] ?? {})[STAGE]?.["Set 1"]?.[qi];
  if (!q || !Array.isArray(q[field])) return -1;
  return q[field].findIndex((v: any) => {
    if (typeof v === "string") return v === want;
    const keys = Object.keys(v ?? {});
    if (!keys.length) return false;
    return keys.reduce((b: string, k: string) => (v[k] > v[b] ? k : b), keys[0]) === want;
  });
}

/** A coherent student: the same disposition expressed in every section. */
type Lean = { strength: string; motivator: string; intel: string; style: string };

function run(label: string, interestPicks: number[], lean?: Lean, other = 0) {
  const a: Record<string, string> = {};
  interestPicks.forEach((p, i) => { a[`career_interest:${i}`] = String(p); });
  for (let i = 0; i < 10; i += 1) a[`aptitude:${i}`] = String(other);
  for (let i = 0; i < 8; i += 1) {
    const k = lean ? optionFor("strengths", i, "strengthPoints", lean.strength) : -1;
    a[`strengths:${i}`] = String(k >= 0 ? k : other);
  }
  for (let i = 0; i < 5; i += 1) {
    const k = lean ? optionFor("motivators", i, "motivatorPoints", lean.motivator) : -1;
    a[`motivators:${i}`] = String(k >= 0 ? k : other);
  }
  for (let i = 0; i < 4; i += 1) {
    const k = lean ? optionFor("learning_styles", i, "styles", lean.style) : -1;
    a[`learning_styles:${i}`] = String(k >= 0 ? k : other);
  }
  for (let i = 0; i < 4; i += 1) {
    const k = lean ? optionFor("multiple_intelligence", i, "intelPoints", lean.intel) : -1;
    a[`multiple_intelligence:${i}`] = String(k >= 0 ? k : other);
  }
  for (let i = 0; i < 5; i += 1) a[`emotional_intelligence:${i}`] = String(other);
  for (let i = 0; i < 12; i += 1) a[`personality:${i}`] = String(other);

  const r = scoreAssessment60(STAGE, SETS, a);
  const chosen = interestPicks.map((p, i) => clusterOf(i, p));
  const tally: Record<string, number> = {};
  for (const c of chosen) tally[c] = (tally[c] ?? 0) + 1;

  console.log(`\n── ${label}`);
  console.log(`   clusters actually chosen : ${JSON.stringify(tally)}`);
  console.log(`   themes ranked            : ${(r.themes ?? []).slice(0, 5)
    .map((t) => `${t.title} ${t.score}`).join(" | ")}`);
  console.log(`   TOP CAREERS              : ${r.matches.map((m) => `${m.title} ${m.fitmentPct}%`).join(", ")}`);
}

console.log("=".repeat(78));
console.log("PERSONA RUNS — live 9-10 bank");
console.log("=".repeat(78));

const LEAN: Record<string, Lean> = {
  health: { strength: "Relationship", motivator: "Impact", intel: "Intrapersonal", style: "Kinesthetic" },
  business: { strength: "Leadership", motivator: "Leadership", intel: "Logical–Mathematical", style: "Auditory" },
  arts: { strength: "Creative", motivator: "Innovation", intel: "Spatial", style: "Visual" },
  science: { strength: "Analytical", motivator: "Achievement", intel: "Logical–Mathematical", style: "Reading/Writing" },
  people: { strength: "Communication", motivator: "Impact", intel: "Linguistic", style: "Auditory" },
};

run("Coherent HEALTH student", pickFor("C"), LEAN.health);
run("Coherent BUSINESS student", pickFor("E"), LEAN.business);
run("Coherent ARTS/MEDIA student", pickFor("D"), LEAN.arts);
run("Coherent SCIENCE/AGRI student", pickFor("G"), LEAN.science);
run("Coherent PEOPLE/PUBLIC SERVICE student", pickFor("F"), LEAN.people);

// A health-leaning student who happens to hit the two Engineering &
// Construction options, which are the rarest cluster in the bank.
const health = pickFor("C");
const mostlyHealth = [...health];
CI.forEach((q, i) => {
  const eng = q.clusterWeights.findIndex((w: any) => Object.keys(w)[0] === "A");
  if (eng >= 0) mostlyHealth[i] = eng;
});
run("HEALTH on 10 items, but Engineering on the 2 where it is offered", mostlyHealth);

/* ---------------------------------------------------------------- coverage */
console.log(`\n${"=".repeat(78)}`);
console.log("PROFESSION POOL — how many interest options vote for each profession");
console.log("=".repeat(78));
const votes: Record<string, number> = {};
for (const q of CI) for (const list of q.careers) for (const p of list) votes[p] = (votes[p] ?? 0) + 1;
const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
console.log(`distinct professions reachable from interests: ${sorted.length}`);
console.log("most-voted :", sorted.slice(0, 10).map(([p, n]) => `${p}(${n})`).join(", "));
console.log("least-voted:", sorted.slice(-8).map(([p, n]) => `${p}(${n})`).join(", "));
