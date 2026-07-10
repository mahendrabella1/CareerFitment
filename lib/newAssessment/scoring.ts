// Scoring for the new set-based assessment. Produces an AssessmentSummary the
// existing /account dashboard already renders (career matches first, then the
// per-category profile). Career matches come from Career-Interest clusters.
import { getSet, CLUSTERS, type Category, type StageKey } from "./data";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

type Answers = Record<string, string>;

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const band = (p: number) =>
  p >= 80 ? "Very High" : p >= 65 ? "High" : p >= 50 ? "Good" : p >= 35 ? "Moderate" : "Low";

const DOMAIN_NAMES: Record<string, string> = {
  ST: "Strategic Thinking",
  RB: "Relationship Building",
  IN: "Influencing",
  EX: "Executing",
};

export function scoreAssessment(
  stage: StageKey,
  chosenSets: Record<Category, string>,
  answers: Answers
): AssessmentSummary {
  // ---------- Personality: Big Five + temperament ----------
  const pers = getSet("personality", stage, chosenSets.personality);
  const big: Record<string, number> = { Extraversion: 0, Neuroticism: 0, Openness: 0, Conscientiousness: 0, Agreeableness: 0 };
  const temp: Record<string, number> = { Sanguine: 0, Choleric: 0, Melancholic: 0, Phlegmatic: 0 };
  pers.forEach((q, i) => {
    const a = answers[`personality:${i}`];
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
  const dominantTemp = Object.entries(temp).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const topStrengths = Object.entries(big)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => ({ parameterName: "Personality", subTraitName: k, normalizedScore: 0 }));

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

  // ---------- Multiple intelligences: sliders ----------
  const mi = getSet("multiple_intelligence", stage, chosenSets.multiple_intelligence);
  const topIntelligences = mi
    .map((q, i) => {
      const v = parseInt(answers[`multiple_intelligence:${i}`] ?? "0", 10) || 0;
      return { name: String(q.cluster || `Intelligence ${i + 1}`), score: Math.round((v / 10) * 100) };
    })
    .sort((a, b) => b.score - a.score);

  // ---------- Emotional intelligence: quality scores ----------
  const eiQ = getSet("emotional_intelligence", stage, chosenSets.emotional_intelligence);
  let eiSum = 0, eiMax = 0;
  eiQ.forEach((q, i) => {
    const idx = parseInt(answers[`emotional_intelligence:${i}`] ?? "", 10);
    const scores = (Array.isArray(q.scores) ? q.scores : []).filter((x: unknown) => typeof x === "number") as number[];
    const max = scores.length ? Math.max(...scores) : 3;
    const val = !Number.isNaN(idx) && typeof q.scores?.[idx] === "number" ? q.scores[idx] : 0;
    eiSum += val;
    eiMax += max;
  });
  const eiPct = eiMax ? Math.round((eiSum / eiMax) * 100) : null;

  // ---------- Learning styles: VARK ----------
  const ls = getSet("learning_styles", stage, chosenSets.learning_styles);
  const varkTally: Record<string, number> = {};
  ls.forEach((q, i) => {
    const idx = parseInt(answers[`learning_styles:${i}`] ?? "", 10);
    const style = Array.isArray(q.styles) ? q.styles[idx] : null;
    if (style) varkTally[style] = (varkTally[style] || 0) + 1;
  });
  const learningStyles = Object.entries(varkTally)
    .map(([name, c]) => ({ name, score: Math.round((c / (ls.length || 1)) * 100) }))
    .sort((a, b) => b.score - a.score);

  // ---------- Motivators: most(+2) / least(-1) -> domains ----------
  const mo = getSet("motivators", stage, chosenSets.motivators);
  const moTally: Record<string, number> = {};
  mo.forEach((q, i) => {
    const [mostS, leastS] = (answers[`motivators:${i}`] ?? "").split(",");
    const dom = (idx: number) => (Array.isArray(q.domains) ? String(q.domains[idx] || "").trim().toUpperCase() : "");
    const most = parseInt(mostS, 10), least = parseInt(leastS, 10);
    if (!Number.isNaN(most)) { const d = dom(most); if (d) moTally[d] = (moTally[d] || 0) + 2; }
    if (!Number.isNaN(least)) { const d = dom(least); if (d) moTally[d] = (moTally[d] || 0) - 1; }
  });
  const topValues = Object.entries(moTally)
    .map(([k, v]) => ({ tag: DOMAIN_NAMES[k] || k, score: v }))
    .sort((a, b) => b.score - a.score);

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
      ? `Your interests point most strongly toward ${topCluster}, and your responses shape the strengths and style shown below.`
      : "Your profile across the six areas is shown below.",
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
    topIntelligences: topIntelligences.slice(0, 5),
    topValues: topValues.slice(0, 5),
    topAptitudes: [],
    ei: eiPct,
    learningStyles: learningStyles.slice(0, 4),
    clusters: rankedClusters
      .filter(([, s]) => s > 0)
      .map(([l, s]) => ({ cluster: CLUSTERS[l]?.cluster || l, score: Math.round((s / ciTotal) * 100) })),
    recommendations: [],
    nextStep: null,
  };
}
