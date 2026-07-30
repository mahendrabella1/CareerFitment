/**
 * Verification harness for the 2026 scoring changes in lib/newAssessment/scoring60.ts.
 *
 * Injects synthetic question sets straight into the imported bank objects (the
 * BANK in data.ts spreads those same object references, so a set added here is
 * visible to getSet) and asserts on the resulting summary.
 *
 * Covers:
 *   1. five options score end-to-end
 *   2. "None of these" abstains instead of deflating traits
 *   3. abstaining on most items suppresses the profile
 *   4. an empty vector that is NOT the abstain option still counts against you
 *   5. forced-choice EI produces a domain profile and a null ei percentage
 *   6. graded EI (original bank) still produces a percentage
 *   7. five learning styles normalise against a 20% baseline, four against 25%
 *
 * Run:  node scripts/run_verify_scoring60.mjs
 */
import bank from "@/data/assessment-questions.json";
import aptitudeBank from "@/data/aptitude-questions.json";
import strengthsBank from "@/data/strengths-questions.json";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import type { Category, StageKey } from "@/lib/newAssessment/data";

/* eslint-disable @typescript-eslint/no-explicit-any */
const B = bank as any;
const STAGE: StageKey = "9-10";
const SET = "VerifySet";

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) console.log(`  PASS  ${name}`);
  else { failures += 1; console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`); }
}
function near(a: number, b: number, tol = 1) { return Math.abs(a - b) <= tol; }

/* ------------------------------------------------------------------ fixtures */
/** 12 personality items, 5 options, option E (index 4) declared as abstain. */
function personalityItems() {
  const traits = ["O", "O", "C", "C", "C", "E", "E", "A", "A", "S", "S", "O"];
  return traits.map((primary, n) => ({
    type: "choice5", q: `Q${23 + n}`, trait: primary, facet: "Test",
    text: `Personality item ${n + 1}`,
    options: ["a", "b", "c", "d", "None of these."],
    // A always pays the primary trait 3; B-D pay other traits; E pays nothing.
    traitPoints: [
      { [primary]: 3 },
      { C: 2 },
      { E: 2 },
      { A: 2 },
      {},
    ],
    abstainIndex: 4,
  }));
}

/** 12 interest items, 5 options, distinct clusters per option. */
function interestItems() {
  return Array.from({ length: 12 }, (_v, n) => ({
    type: "choice5", q: `Q${n + 1}`, text: `Interest item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    riasec: [{ R: 3 }, { A: 3 }, { S: 3 }, { C: 3 }, { I: 3 }],
    clusterWeights: [{ A: 5 }, { D: 5 }, { F: 5 }, { E: 5 }, { C: 5 }],
    careers: [["Civil / Structural Engineer"], ["Animator"], ["Teacher"], ["Financial Analyst"], ["Nurse"]],
  }));
}

function strengthItems() {
  const doms = ["Analytical", "Creative", "Leadership", "Relationship",
                "Execution", "Communication", "Adaptability", "Learning"];
  return Array.from({ length: 8 }, (_v, n) => ({
    type: "choice5", q: `Q${35 + n}`, text: `Strength item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    strengthPoints: [
      { [doms[n % 8]]: 3 }, { [doms[(n + 1) % 8]]: 3 }, { [doms[(n + 2) % 8]]: 3 },
      { [doms[(n + 3) % 8]]: 3 }, { [doms[(n + 4) % 8]]: 3 },
    ],
  }));
}

function motivatorItems() {
  return Array.from({ length: 5 }, (_v, n) => ({
    type: "choice5", q: `Q${43 + n}`, text: `Motivator item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    motivatorPoints: [{ Achievement: 3 }, { Innovation: 3 }, { Impact: 3 },
                      { Leadership: 3 }, { Security: 3 }],
  }));
}

function miItems() {
  return Array.from({ length: 4 }, (_v, n) => ({
    type: "choice5", q: `Q${52 + n}`, text: `MI item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    intelPoints: [{ "Logical–Mathematical": 3 }, { Spatial: 3 }, { Linguistic: 3 },
                  { Intrapersonal: 3 }, { "Bodily–Kinesthetic": 3 }],
  }));
}

/** 5 options over 5 styles (VARK + Multimodal). */
function learningItems5() {
  return Array.from({ length: 4 }, (_v, n) => ({
    type: "vark", q: `Q${48 + n}`, text: `Learning item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    styles: ["Visual", "Aural", "Read/Write", "Kinesthetic", "Multimodal"],
  }));
}
/** The original four-style shape, to prove the baseline still derives correctly. */
function learningItems4() {
  return Array.from({ length: 4 }, (_v, n) => ({
    type: "vark", q: `Q${48 + n}`, text: `Learning item ${n + 1}`,
    options: ["a", "b", "c", "d"],
    styles: ["Visual", "Aural", "Read/Write", "Kinesthetic"],
  }));
}

const EI_DOMAINS = ["Self-Awareness", "Self-Regulation", "Self-Motivation",
                    "Empathy", "Relationship Management"];
/** 2026 shape: options name domains, no graded scores. */
function eiForcedChoiceItems() {
  return Array.from({ length: 5 }, (_v, n) => ({
    type: "choice5", q: `Q${56 + n}`, text: `EI item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"],
    optionDomains: EI_DOMAINS,
  }));
}
/** Original shape: one dimension per item, graded options. */
function eiGradedItems() {
  return Array.from({ length: 5 }, (_v, n) => ({
    type: "choice4", q: `Q${56 + n}`, dimension: EI_DOMAINS[n],
    text: `EI item ${n + 1}`,
    options: ["a", "b", "c", "d"],
    scores: [3, 2, 2, 0],
  }));
}

function aptitudeItems() {
  return Array.from({ length: 10 }, (_v, n) => ({
    type: "mcq", q: `Q${13 + n}`, format: "text", domain: "Numerical",
    difficulty: "easy", text: `Aptitude item ${n + 1}`,
    options: ["a", "b", "c", "d", "e"], correct: 2, svgOptions: false, media: null,
  }));
}

/** Install a full 60-question set, with the two variable sections swappable. */
function install(opts: { ei: "forced" | "graded"; learning: 4 | 5 }) {
  B.personality[STAGE][SET] = personalityItems();
  B.career_interest[STAGE][SET] = interestItems();
  B.motivators[STAGE][SET] = motivatorItems();
  B.multiple_intelligence[STAGE][SET] = miItems();
  B.learning_styles[STAGE][SET] = opts.learning === 5 ? learningItems5() : learningItems4();
  B.emotional_intelligence[STAGE][SET] =
    opts.ei === "forced" ? eiForcedChoiceItems() : eiGradedItems();
  (aptitudeBank as any)[STAGE][SET] = aptitudeItems();
  (strengthsBank as any)[STAGE][SET] = strengthItems();
}

const SETS = Object.fromEntries(
  ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
   "learning_styles", "motivators", "strengths", "aptitude"].map((c) => [c, SET])
) as Record<Category, string>;

/** Answer every item in a section with the same option index. */
function answerAll(section: string, count: number, idx: number, into: Record<string, string>) {
  for (let i = 0; i < count; i += 1) into[`${section}:${i}`] = String(idx);
  return into;
}

function baseAnswers(learningPick = 0, eiPicks?: number[]) {
  const a: Record<string, string> = {};
  answerAll("career_interest", 12, 0, a);
  answerAll("aptitude", 10, 2, a);
  answerAll("strengths", 8, 0, a);
  answerAll("motivators", 5, 0, a);
  answerAll("learning_styles", 4, learningPick, a);
  answerAll("multiple_intelligence", 4, 0, a);
  (eiPicks ?? [0, 0, 0, 0, 0]).forEach((p, i) => { a[`emotional_intelligence:${i}`] = String(p); });
  return a;
}

/* ------------------------------------------------------------------- 1 & 2 */
console.log("\n[1] five options score end-to-end, and abstention is not a zero");
install({ ei: "forced", learning: 5 });

// Student picks option A on every personality item -> primary traits maxed.
let ans = baseAnswers();
answerAll("personality", 12, 0, ans);
const allA = scoreAssessment60(STAGE, SETS, ans);
const oScore = allA.topStrengths.find((s) => s.subTraitName === "Openness")?.normalizedScore ?? -1;
check("picking the primary-trait option on all 12 items scores Openness 100", oScore === 100,
  `got ${oScore}`);
check("five-option interests produce a RIASEC code", (allA.riasecCode ?? "").length === 3,
  `got "${allA.riasecCode}"`);
check("five-option strengths produce all 8 domains",
  (allA.strengthsBreakdown ?? []).length === 8, `got ${(allA.strengthsBreakdown ?? []).length}`);
check("five-option motivators include Security",
  (allA.topValues ?? []).some((v) => v.tag === "Security"));
check("five-option aptitude scores 100 when every correct index is picked",
  allA.aptitudePct === 100, `got ${allA.aptitudePct}`);

// Same student, but abstains (option E) on the 4 Openness/Conscientiousness-tail
// items. Openness must be judged on the items they DID answer, not diluted.
ans = baseAnswers();
answerAll("personality", 12, 0, ans);
ans["personality:11"] = "4"; // abstain on the last Openness item
const withAbstain = scoreAssessment60(STAGE, SETS, ans);
const oAbstain = withAbstain.topStrengths.find((s) => s.subTraitName === "Openness")?.normalizedScore ?? -1;
check("abstaining on one Openness item leaves Openness at 100 (not deflated)",
  oAbstain === 100, `got ${oAbstain}`);

/* ----------------------------------------------------------------------- 3 */
console.log("\n[3] abstaining on most items suppresses the profile");
ans = baseAnswers();
answerAll("personality", 12, 4, ans); // "None of these" on all 12
const allAbstain = scoreAssessment60(STAGE, SETS, ans);
check("no Big Five rows are published", allAbstain.topStrengths.length === 0,
  `got ${allAbstain.topStrengths.length} rows`);
check("no temperament is claimed", allAbstain.outcomeLabel == null,
  `got "${allAbstain.outcomeLabel}"`);
const persSpoke = (allAbstain.radar ?? []).find((r) => r.key === "personality")?.score;
check("personality radar spoke is 0, not a manufactured mid-range", persSpoke === 0,
  `got ${persSpoke}`);

/* ----------------------------------------------------------------------- 4 */
console.log("\n[4] a zero-scoring option that is NOT the abstain option still counts");
ans = baseAnswers();
answerAll("personality", 12, 0, ans);
// Item 0 is an Openness item; option D pays Agreeableness, so Openness gets
// nothing from it but the item stays in the denominator.
ans["personality:0"] = "3";
const lowOpt = scoreAssessment60(STAGE, SETS, ans);
const oLow = lowOpt.topStrengths.find((s) => s.subTraitName === "Openness")?.normalizedScore ?? -1;
check("choosing another trait's option lowers Openness below 100", oLow < 100 && oLow > 0,
  `got ${oLow}`);

/* ----------------------------------------------------------------------- 5 */
console.log("\n[5] forced-choice EI -> domain profile, no EQ percentage");
install({ ei: "forced", learning: 5 });
// Always reaches for Self-Awareness (option A) -> 100% share of 5 picks.
ans = baseAnswers(0, [0, 0, 0, 0, 0]);
answerAll("personality", 12, 0, ans);
const eiAllA = scoreAssessment60(STAGE, SETS, ans);
check("ei percentage is null (no level is claimed)", eiAllA.ei === null, `got ${eiAllA.ei}`);
const bd = eiAllA.eiBreakdown ?? [];
check("all 5 EQ domains are reported", bd.length === 5, `got ${bd.length}`);
const sa = bd.find((d) => d.name === "Self-Awareness")?.score ?? -1;
const emp = bd.find((d) => d.name === "Empathy")?.score ?? -1;
// 5/5 picks = 100% share; baseline 20%, stretched against 40% -> clamped 100.
check("the always-chosen domain reads 100", sa === 100, `got ${sa}`);
check("a never-chosen domain reads 0", emp === 0, `got ${emp}`);
const eiSpoke = (eiAllA.radar ?? []).find((r) => r.key === "emotional_intelligence")?.score ?? -1;
check("EI radar spoke falls back to profile definition, not 0", eiSpoke === 100, `got ${eiSpoke}`);

// An even spread across the 5 domains should read as no strong tendency.
ans = baseAnswers(0, [0, 1, 2, 3, 4]);
answerAll("personality", 12, 0, ans);
const eiSpread = scoreAssessment60(STAGE, SETS, ans);
const spreadScores = (eiSpread.eiBreakdown ?? []).map((d) => d.score);
check("an even spread gives every domain the same mid score",
  new Set(spreadScores).size === 1 && near(spreadScores[0], 50, 1),
  `got ${JSON.stringify(spreadScores)}`);

/* ----------------------------------------------------------------------- 6 */
console.log("\n[6] graded EI (original bank) still yields a percentage");
install({ ei: "graded", learning: 4 });
ans = baseAnswers(0, [0, 0, 0, 0, 0]); // best option on every item
answerAll("personality", 12, 0, ans);
const eiGraded = scoreAssessment60(STAGE, SETS, ans);
check("ei percentage is 100 when the best option is picked throughout",
  eiGraded.ei === 100, `got ${eiGraded.ei}`);
ans = baseAnswers(0, [3, 3, 3, 3, 3]); // worst option (scores 0)
answerAll("personality", 12, 0, ans);
check("ei percentage is 0 when the worst option is picked throughout",
  scoreAssessment60(STAGE, SETS, ans).ei === 0);

/* ----------------------------------------------------------------------- 7 */
console.log("\n[7] learning-style baseline derives from the styles offered");
install({ ei: "forced", learning: 4 });
ans = baseAnswers(0);
answerAll("personality", 12, 0, ans);
const ls4 = scoreAssessment60(STAGE, SETS, ans).learningStyles ?? [];
// 4 items all Visual = 100% share; baseline 25%, stretched against 50% -> 100.
check("4 styles: an all-Visual respondent reads 100", ls4[0]?.score === 100,
  `got ${JSON.stringify(ls4)}`);

install({ ei: "forced", learning: 5 });
ans = baseAnswers(4); // pick Multimodal every time
answerAll("personality", 12, 0, ans);
const ls5 = scoreAssessment60(STAGE, SETS, ans).learningStyles ?? [];
check("5 styles: Multimodal is offered and scores", ls5[0]?.name === "Multimodal",
  `got ${JSON.stringify(ls5)}`);
check("5 styles: an all-Multimodal respondent reads 100", ls5[0]?.score === 100,
  `got ${ls5[0]?.score}`);

/* ----------------------------------------------------------------------- 8 */
// Regression guard: the live 9-10 bank has no abstainIndex and no optionDomains,
// so every changed code path must behave exactly as it did before.
console.log("\n[8] the live 9-10 bank (4 options, graded EI) is unaffected");
const LIVE = Object.fromEntries(
  ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence",
   "learning_styles", "motivators", "strengths", "aptitude"].map((c) => [c, "Set 1"])
) as Record<Category, string>;
const liveAns: Record<string, string> = {};
answerAll("career_interest", 12, 0, liveAns);
answerAll("aptitude", 10, 0, liveAns);
answerAll("strengths", 8, 0, liveAns);
answerAll("motivators", 5, 0, liveAns);
answerAll("learning_styles", 4, 0, liveAns);
answerAll("multiple_intelligence", 4, 0, liveAns);
answerAll("emotional_intelligence", 5, 0, liveAns);
answerAll("personality", 12, 0, liveAns);
const live = scoreAssessment60(STAGE, LIVE, liveAns);
check("Big Five still reports all 5 traits", live.topStrengths.length === 5,
  `got ${live.topStrengths.length}`);
check("a temperament is still named", typeof live.outcomeLabel === "string",
  `got ${live.outcomeLabel}`);
check("graded EI still returns a number", typeof live.ei === "number", `got ${live.ei}`);
check("EI radar spoke equals the graded percentage",
  (live.radar ?? []).find((r) => r.key === "emotional_intelligence")?.score === live.ei);
check("all-Visual on the 4-style bank still reads 100",
  (live.learningStyles ?? [])[0]?.score === 100,
  `got ${JSON.stringify(live.learningStyles)}`);
check("career matches are still produced", live.matches.length > 0);
// The low-Extraversion option on live Q28 carries an empty vector but is NOT an
// abstention, so it must still pull Extraversion down rather than drop out.
const liveAns2 = { ...liveAns, "personality:5": "3" }; // Q28 option D
const live2 = scoreAssessment60(STAGE, LIVE, liveAns2);
const e1 = live.topStrengths.find((s) => s.subTraitName === "Extraversion")?.normalizedScore ?? 0;
const e2 = live2.topStrengths.find((s) => s.subTraitName === "Extraversion")?.normalizedScore ?? 0;
check("live Q28's empty-vector option still lowers Extraversion", e2 < e1, `${e1} -> ${e2}`);

/* -------------------------------------------------------------------------- */
console.log(failures === 0
  ? "\nAll checks passed.\n"
  : `\n${failures} check(s) FAILED.\n`);
process.exit(failures === 0 ? 0 : 1);
