// Scoring for the new set-based assessment. Produces an AssessmentSummary the
// /account dashboard renders: career matches first, then the per-category
// profile, plus an 8-category radar. Career matches come from Career-Interest
// clusters; the other categories become the profile + radar spokes.
import { getSet, CLUSTERS, type Category, type StageKey } from "./data";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

type Answers = Record<string, string>;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const band = (p: number) =>
  p >= 80 ? "Very High" : p >= 65 ? "High" : p >= 50 ? "Good" : p >= 35 ? "Moderate" : "Low";

const DOMAIN_NAMES: Record<string, string> = {
  ST: "Strategic Thinking",
  RB: "Relationship Building",
  IN: "Influencing",
  EX: "Executing",
};
const STRENGTH_SELF: Record<string, string> = {
  LD: "Leadership",
  CM: "Communication",
  ES: "Emotional & Social",
};

export function scoreAssessment(
  stage: StageKey,
  chosenSets: Record<Category, string>,
  answers: Answers
): AssessmentSummary {
  // ---------- Personality: Big Five + temperament ----------
  const pers = getSet("personality", stage, chosenSets.personality);
  let topStrengths: AssessmentSummary["topStrengths"];
  let personalityScore: number;
  let dominantTemp: string | null;
  const usesPoints = pers.some((q) => Array.isArray(q.points) && q.trait);
  if (usesPoints) {
    // New 9-10 format: 4 situational options, each worth points toward a Big-Five trait.
    const raw: Record<string, number> = {}, mx: Record<string, number> = {};
    pers.forEach((q, i) => {
      const trait = String(q.trait || ""); if (!trait || !Array.isArray(q.points)) return;
      raw[trait] = raw[trait] || 0; mx[trait] = mx[trait] || 0;
      mx[trait] += Math.max(...(q.points as number[]));
      const idx = parseInt(answers[`personality:${i}`] ?? "", 10);
      if (!Number.isNaN(idx) && typeof q.points[idx] === "number") raw[trait] += q.points[idx];
    });
    const ts = (t: string) => (mx[t] ? clamp(Math.round((raw[t] / mx[t]) * 100)) : 50);
    const TRAITS = ["Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Emotional Stability"];
    topStrengths = TRAITS.filter((t) => mx[t]).map((t) => ({ parameterName: "Personality", subTraitName: t, normalizedScore: ts(t) }))
      .sort((a, b) => b.normalizedScore - a.normalizedScore);
    const E = ts("Extraversion"), A = ts("Agreeableness"), C = ts("Conscientiousness"), O = ts("Openness"), S = ts("Emotional Stability");
    const tScore: Record<string, number> = {
      Sanguine: E * 0.6 + A * 0.25 + O * 0.15,
      Choleric: E * 0.5 + C * 0.3 + (100 - A) * 0.2,
      Melancholic: (100 - E) * 0.4 + C * 0.35 + O * 0.25,
      Phlegmatic: (100 - E) * 0.35 + A * 0.4 + S * 0.25,
    };
    dominantTemp = Object.entries(tScore).sort((a, b) => b[1] - a[1])[0][0];
    personalityScore = Math.round(TRAITS.reduce((s, t) => s + ts(t), 0) / TRAITS.length);
  } else {
    // Legacy Yes/No format.
    const big: Record<string, number> = { Extraversion: 0, Neuroticism: 0, Openness: 0, Conscientiousness: 0, Agreeableness: 0 };
    const temp: Record<string, number> = { Sanguine: 0, Choleric: 0, Melancholic: 0, Phlegmatic: 0 };
    let persAnswered = 0;
    pers.forEach((q, i) => {
      const a = answers[`personality:${i}`];
      if (a === "Yes" || a === "No") persAnswered += 1;
      const yes = a === "Yes";
      const m = String(q.mainCategory || "").toLowerCase();
      const intro = m.includes("introversion");
      if (m.includes("extraversion") && !intro) big.Extraversion += yes ? 1 : 0;
      else if (intro) big.Extraversion += a === "No" ? 1 : 0;
      if (m.includes("neuroticism")) big.Neuroticism += yes ? 1 : 0;
      if (m.includes("openness")) big.Openness += yes ? 1 : 0;
      if (m.includes("conscientiousness")) big.Conscientiousness += yes ? 1 : 0;
      if (m.includes("agreeableness") && !m.includes("low agreeableness")) big.Agreeableness += yes ? 1 : 0;
      if (yes) {
        const s = String(q.subCategory || "").toLowerCase();
        for (const t of ["sanguine", "choleric", "melancholic", "phlegmatic"]) if (s.startsWith(t)) temp[cap(t)] += 1;
      }
    });
    const tempRanked = Object.entries(temp).sort((a, b) => b[1] - a[1]);
    dominantTemp = tempRanked[0]?.[1] ? tempRanked[0][0] : null;
    topStrengths = Object.entries(big).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
      .map(([k]) => ({ parameterName: "Personality", subTraitName: k, normalizedScore: 0 }));
    personalityScore = persAnswered ? clamp(Math.round((tempRanked[0][1] / persAnswered) * 100 + 20)) : 50;
  }

  // ---------- Career interest: cluster tally -> careers ----------
  const ci = getSet("career_interest", stage, chosenSets.career_interest);
  const clusterTally: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0 };
  ci.forEach((q, i) => {
    const idx = parseInt(answers[`career_interest:${i}`] ?? "", 10);
    const letter = Array.isArray(q.clusters) ? String(q.clusters[idx] || "").trim().toUpperCase() : "";
    if (letter && clusterTally[letter] !== undefined) clusterTally[letter] += 1;
  });
  const rankedClusters = Object.entries(clusterTally).sort((a, b) => b[1] - a[1]);
  const ciTotal = ci.length || 15;
  const matches: AssessmentSummary["matches"] = [];
  for (const [letter, score] of rankedClusters) {
    const info = CLUSTERS[letter];
    if (!info || score === 0) break;
    const pct = Math.round((score / ciTotal) * 100);
    for (const career of info.careers.slice(0, 2)) {
      matches.push({ title: career, fitmentPct: pct, band: band(pct), blurb: info.cluster, roles: [info.cluster] });
    }
    if (matches.length >= 6) break;
  }
  matches.sort((a, b) => b.fitmentPct - a.fitmentPct);
  const careerInterestScore = rankedClusters[0]?.[1] ? Math.round((rankedClusters[0][1] / ciTotal) * 100) : 0;

  // ---------- Multiple intelligences: exact Gardner routing matrix ----------
  // 5 sliders (1–10) → 8 intelligences. f() maps a slider to 0–100 ("like me"),
  // inv() is the inverse controller. Weights follow the algorithm sheet
  // (1.0 direct maps; ~0.75/0.25 splits with modifiers). See MI algorithm tab.
  const mi = getSet("multiple_intelligence", stage, chosenSets.multiple_intelligence);
  const usesStatements = mi.some((qq) => qq.intelligence);
  let topIntelligences: { name: string; score: number }[];
  if (usesStatements) {
    // New 9-10 format: agree/disagree statements grouped by intelligence.
    const agg: Record<string, { s: number; n: number }> = {};
    mi.forEach((qq, i) => {
      const name = String(qq.intelligence || ""); if (!name) return;
      const opts = Array.isArray(qq.options) ? qq.options.length : 5;
      const idx = parseInt(answers[`multiple_intelligence:${i}`] ?? "", 10);
      const val = Number.isNaN(idx) ? 50 : (idx / Math.max(1, opts - 1)) * 100;
      agg[name] = agg[name] || { s: 0, n: 0 };
      agg[name].s += val; agg[name].n += 1;
    });
    topIntelligences = Object.entries(agg)
      .map(([name, { s, n }]) => ({ name, score: clamp(Math.round(s / n)) }))
      .sort((a, b) => b.score - a.score);
  } else {
    const qf = (i: number) => { const v = parseInt(answers[`multiple_intelligence:${i}`] ?? "", 10); return Number.isNaN(v) ? 1 : Math.min(10, Math.max(1, v)); };
    const f = (i: number) => ((qf(i) - 1) / 9) * 100;
    const inv = (i: number) => 100 - f(i);
    const Q1 = 0, Q2 = 1, Q3 = 2, Q4 = 3, Q5 = 4;
    topIntelligences = [
      { name: "Linguistic (Words & Language)", score: f(Q1) },
      { name: "Logical–Mathematical", score: 0.75 * f(Q2) + 0.25 * inv(Q1) },
      { name: "Visual–Spatial", score: 0.75 * f(Q2) + 0.25 * f(Q3) },
      { name: "Bodily–Kinesthetic", score: f(Q3) },
      { name: "Musical", score: 0.75 * f(Q5) + 0.25 * f(Q3) },
      { name: "Interpersonal (People)", score: 0.75 * f(Q4) + 0.25 * f(Q1) },
      { name: "Intrapersonal (Self)", score: 0.75 * f(Q4) + 0.25 * inv(Q1) },
      { name: "Naturalistic (Nature)", score: 0.75 * f(Q5) + 0.25 * f(Q2) },
    ].map((g) => ({ name: g.name, score: clamp(Math.round(g.score)) })).sort((a, b) => b.score - a.score);
  }
  const miScore = mi.length ? (topIntelligences[0]?.score ?? 0) : 0;

  // ---------- Emotional intelligence: quality scores ----------
  const eiQ = getSet("emotional_intelligence", stage, chosenSets.emotional_intelligence);
  let eiSum = 0, eiMax = 0;
  eiQ.forEach((qq, i) => {
    const idx = parseInt(answers[`emotional_intelligence:${i}`] ?? "", 10);
    const scores = (Array.isArray(qq.scores) ? qq.scores : []).filter((x: unknown) => typeof x === "number") as number[];
    const max = scores.length ? Math.max(...scores) : 3;
    const val = !Number.isNaN(idx) && typeof qq.scores?.[idx] === "number" ? qq.scores[idx] : 0;
    eiSum += val;
    eiMax += max;
  });
  const eiPct = eiMax ? Math.round((eiSum / eiMax) * 100) : null;

  // ---------- Learning styles: VARK ----------
  const ls = getSet("learning_styles", stage, chosenSets.learning_styles);
  const varkTally: Record<string, number> = {};
  ls.forEach((qq, i) => {
    const idx = parseInt(answers[`learning_styles:${i}`] ?? "", 10);
    const style = Array.isArray(qq.styles) ? qq.styles[idx] : null;
    if (style) varkTally[style] = (varkTally[style] || 0) + 1;
  });
  const lsTotal = ls.length || 1;
  const learningStyles = Object.entries(varkTally)
    .map(([name, c]) => ({ name, score: Math.round((c / lsTotal) * 100) }))
    .sort((a, b) => b.score - a.score);
  const learningScore = learningStyles[0]?.score ?? 0;

  // ---------- Motivators: most(+2) / least(-1) -> domains ----------
  const mo = getSet("motivators", stage, chosenSets.motivators);
  const moTally: Record<string, number> = {};
  let moSingle = 0;
  mo.forEach((qq, i) => {
    const ans = answers[`motivators:${i}`] ?? "";
    const dom = (idx: number) => (Array.isArray(qq.domains) ? String(qq.domains[idx] || "").trim().toUpperCase() : "");
    if (ans.includes(",")) {
      const [mostS, leastS] = ans.split(",");
      const most = parseInt(mostS, 10), least = parseInt(leastS, 10);
      if (!Number.isNaN(most)) { const d = dom(most); if (d) moTally[d] = (moTally[d] || 0) + 2; }
      if (!Number.isNaN(least)) { const d = dom(least); if (d) moTally[d] = (moTally[d] || 0) - 1; }
    } else {
      // New 9-10 format: single "most like me" pick.
      const idx = parseInt(ans, 10);
      if (!Number.isNaN(idx)) { const d = dom(idx); if (d) { moTally[d] = (moTally[d] || 0) + 1; moSingle += 1; } }
    }
  });
  const topValues = Object.entries(moTally)
    .map(([k, v]) => ({ tag: DOMAIN_NAMES[k] || k, score: v }))
    .sort((a, b) => b.score - a.score);
  const moTop = topValues[0]?.score ?? 0;
  const motivatorScore = moSingle
    ? clamp(Math.round(((moTop / moSingle) - 0.15) / 0.85 * 100))
    : clamp(Math.round(((moTop + mo.length) / (3 * (mo.length || 1))) * 100));

  // ---------- Strengths: cognitive (scored) + self-report ipsative ----------
  const str = getSet("strengths", stage, chosenSets.strengths);
  let strCorrect = 0, strScored = 0;
  const strSelf: Record<string, number> = {};
  const cognitive: { name: string; score: number }[] = [];
  str.forEach((qq, i) => {
    const key = `strengths:${i}`;
    if (qq.type === "mcq") {
      strScored += 1;
      const idx = parseInt(answers[key] ?? "", 10);
      const ok = !Number.isNaN(idx) && idx === qq.correct;
      if (ok) strCorrect += 1;
      cognitive.push({ name: String(qq.domain || "Reasoning"), score: ok ? 100 : 0 });
    } else if (qq.type === "mostleast") {
      const [mostS, leastS] = (answers[key] ?? "").split(",");
      const dom = (n: number) => (Array.isArray(qq.domains) ? String(qq.domains[n] || "").trim().toUpperCase() : "");
      const most = parseInt(mostS, 10), least = parseInt(leastS, 10);
      if (!Number.isNaN(most)) { const d = dom(most); if (d && d !== "NONE") strSelf[d] = (strSelf[d] || 0) + 2; }
      if (!Number.isNaN(least)) { const d = dom(least); if (d && d !== "NONE") strSelf[d] = (strSelf[d] || 0) - 1; }
    }
  });
  const aptitudeCognitivePct = strScored ? Math.round((strCorrect / strScored) * 100) : null;
  const strengthsBreakdown = [
    ...cognitive,
    ...Object.entries(strSelf).map(([k, v]) => ({ name: STRENGTH_SELF[k] || k, score: clamp(Math.round(((v + 3) / 9) * 100)) })),
  ];
  const strengthsScore = aptitudeCognitivePct ?? 0;

  // ---------- Aptitude: scored reasoning across domains ----------
  const apt = getSet("aptitude", stage, chosenSets.aptitude);
  let aptCorrect = 0, aptTotal = 0;
  const aptDomain: Record<string, { c: number; n: number }> = {};
  apt.forEach((qq, i) => {
    aptTotal += 1;
    const idx = parseInt(answers[`aptitude:${i}`] ?? "", 10);
    const ok = !Number.isNaN(idx) && idx === qq.correct;
    if (ok) aptCorrect += 1;
    const d = String(qq.domain || "Reasoning");
    aptDomain[d] = aptDomain[d] || { c: 0, n: 0 };
    aptDomain[d].n += 1;
    if (ok) aptDomain[d].c += 1;
  });
  const aptitudePct = aptTotal ? Math.round((aptCorrect / aptTotal) * 100) : null;
  const topAptitudes = Object.entries(aptDomain)
    .map(([skill, { c, n }]) => ({ skill, score: Math.round((c / n) * 100) }))
    .sort((a, b) => b.score - a.score);

  // ---------- 8-category radar (single overview chart) ----------
  const radar = [
    { key: "personality", label: "Personality", score: personalityScore },
    { key: "career_interest", label: "Career Interest", score: careerInterestScore },
    { key: "multiple_intelligence", label: "Multiple Intelligence", score: miScore },
    { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiPct ?? 0 },
    { key: "learning_styles", label: "Learning Style", score: learningScore },
    { key: "motivators", label: "Motivators", score: motivatorScore },
    { key: "strengths", label: "Strengths", score: strengthsScore },
    { key: "aptitude", label: "Aptitude", score: aptitudePct ?? 0 },
  ];

  const topCluster = rankedClusters[0] && rankedClusters[0][1] > 0 ? CLUSTERS[rankedClusters[0][0]]?.cluster : null;

  return {
    journeyCode: stage,
    journeyName: "Career Assessment",
    completedAt: new Date().toISOString(),
    feedbackRating: null,
    overallFitmentPct: matches[0]?.fitmentPct ?? null,
    topCareer: matches[0]?.title ?? null,
    desiredCareer: null,
    desiredCareerFitPct: null,
    summary: topCluster
      ? `Your interests point most strongly toward ${topCluster}. Combined with your aptitude, strengths and working style, the profile below maps how you think, learn and decide.`
      : "Your profile across the eight areas is shown below.",
    outcomeLabel: dominantTemp ? `${dominantTemp} temperament` : null,
    confidence: "medium",
    matches: matches.slice(0, 6),
    topStrengths: topStrengths.slice(0, 8),
    riasecCode: rankedClusters.slice(0, 3).filter(([, s]) => s > 0).map(([l]) => l).join(""),
    themes: rankedClusters
      .filter(([, s]) => s > 0)
      .slice(0, 6)
      .map(([l, s]) => ({
        letter: l,
        title: CLUSTERS[l]?.cluster || l,
        score: Math.round((s / ciTotal) * 100),
        meaning: (CLUSTERS[l]?.careers || []).slice(0, 3).join(", "),
      })),
    topIntelligences: topIntelligences.slice(0, 8),
    topValues: topValues.slice(0, 5),
    topAptitudes: topAptitudes.slice(0, 6),
    ei: eiPct,
    learningStyles: learningStyles.slice(0, 4),
    clusters: rankedClusters
      .filter(([, s]) => s > 0)
      .map(([l, s]) => ({ cluster: CLUSTERS[l]?.cluster || l, score: Math.round((s / ciTotal) * 100) })),
    recommendations: [],
    nextStep: null,
    radar,
    strengthsBreakdown,
    aptitudePct,
  };
}
