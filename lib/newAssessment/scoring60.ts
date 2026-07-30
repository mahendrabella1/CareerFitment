/**
 * Scoring for the 60-question bank ("60 set questions.xlsx", classes 9-10).
 *
 * Follows the workbook's "Logic you can use for reference" tab:
 *
 *   Responses -> question-level scoring -> dimension traits -> normalisation
 *   -> career vector matching -> confidence score -> top recommendations
 *
 * The rule that matters most there: questions never recommend careers
 * directly. Every option first feeds trait vectors; the traits then match
 * against each profession's affinity profile. Learning style is deliberately
 * EXCLUDED from career matching (the tab: "This dimension should NEVER change
 * career recommendations") and only drives study advice.
 */
import { getSet, CLUSTERS, type Category, type StageKey } from "./data";
import careerMap from "@/data/career-map-9-10.json";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

type Answers = Record<string, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawQ = Record<string, any>;
type Vec = Record<string, number>;

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const band = (p: number) =>
  p >= 80 ? "Very High" : p >= 65 ? "High" : p >= 50 ? "Good" : p >= 35 ? "Moderate" : "Low";

const MAP = careerMap as {
  dimensionWeights: Record<string, number>;
  miWeights: Record<string, number>;
  affinity: Record<string, Record<string, string[]>>;
  professionCluster: Record<string, string>;
};

const BIG_FIVE: Record<string, string> = {
  O: "Openness", C: "Conscientiousness", E: "Extraversion",
  A: "Agreeableness", S: "Emotional Stability",
};
const RIASEC: Record<string, string> = {
  R: "Realistic", I: "Investigative", A: "Artistic",
  S: "Social", E: "Enterprising", C: "Conventional",
};
const DIFFICULTY: Record<string, number> = { easy: 1, medium: 2, hard: 3 };

/** True when this stage's bank is the 60-question workbook build. */
export function isV2Bank(stage: StageKey, chosenSets: Record<Category, string>): boolean {
  const pers = getSet("personality", stage, chosenSets.personality);
  return pers.some((q) => Array.isArray(q.traitPoints));
}

/**
 * Accumulate a per-option point vector. `max` tracks the best a respondent
 * could have scored on that dimension, so raw/max is a true 0-100 — this is
 * the "Dimension Normalization" step of the workbook flow.
 */
function tally(
  qs: RawQ[], key: string, field: string, answers: Answers
): { raw: Vec; max: Vec; maxScored: Vec; avg: Vec; picks: number[]; abstained: number } {
  const raw: Vec = {}, max: Vec = {}, maxScored: Vec = {}, avg: Vec = {}, picks: number[] = [];
  let abstained = 0;
  qs.forEach((q, i) => {
    const vecs = q[field] as Vec[] | undefined;
    if (!Array.isArray(vecs)) { picks.push(-1); return; }
    // `max`: the best this question could award each dimension.
    // `avg`: what it awards on average — i.e. the baseline a respondent who
    //        picked at random would accumulate. That is the fair comparison
    //        for ipsative scoring; `max` over-counts, because it takes every
    //        dimension's best option independently when only one can be picked.
    const best: Vec = {};
    for (const v of vecs) {
      for (const [k, n] of Object.entries(v || {})) {
        best[k] = Math.max(best[k] ?? 0, n);
        avg[k] = (avg[k] ?? 0) + n / vecs.length;
      }
    }
    for (const [k, n] of Object.entries(best)) max[k] = (max[k] ?? 0) + n;

    const idx = parseInt(answers[`${key}:${i}`] ?? "", 10);
    picks.push(Number.isNaN(idx) ? -1 : idx);

    // An ABSTENTION is different from a low-scoring answer. "Prefer to avoid
    // speaking unless necessary" carries an empty vector but is still evidence
    // (of low Extraversion), so it belongs in the denominator and correctly
    // drags the trait down. "None of these" is not evidence of anything — the
    // question declares that option via `abstainIndex`, and it is dropped from
    // the denominator instead, so the traits are judged only on the items the
    // student actually engaged with.
    const abstainIndex = typeof q.abstainIndex === "number" ? q.abstainIndex : -1;
    const isAbstention = idx === abstainIndex;
    if (isAbstention) abstained += 1;
    else for (const [k, n] of Object.entries(best)) maxScored[k] = (maxScored[k] ?? 0) + n;

    const chosen = Number.isNaN(idx) ? null : vecs[idx];
    if (chosen) for (const [k, n] of Object.entries(chosen)) raw[k] = (raw[k] ?? 0) + n;
  });
  return { raw, max, maxScored, avg, picks, abstained };
}

/**
 * Absolute normalisation: what fraction of the points this dimension could
 * possibly have awarded did the student actually take. Right for Big Five,
 * where every trait is scorable on most questions.
 */
const pct = (raw: Vec, max: Vec, k: string) =>
  max[k] ? clamp(Math.round(((raw[k] ?? 0) / max[k]) * 100)) : 0;

/**
 * Ipsative normalisation for the forced-choice dimensions (RIASEC, clusters,
 * strengths, motivators, intelligences). The workbook's logic tab scores these
 * as a SHARE of the points awarded ("Total = 128 … Investigative = 31/128"),
 * not against a theoretical maximum — with one pick per question, a dimension
 * that only appears twice would otherwise hit 100% off a single answer.
 *
 * The baseline each share is judged against is the RANDOM-RESPONDER share
 * (`avg[k] / Σavg`), not an equal 1/n. The eight career clusters, for example,
 * are not offered equally often, so holding a rarely-offered cluster to the
 * same 12.5% bar as a common one would make a neutral profile look focused.
 * Scoring `stretch`× your expected share reads as 100.
 *
 * Dimensions the bank barely measures are then shrunk toward the baseline in
 * proportion to how much evidence there is for them — two mentions cannot
 * produce the same confident 100 as twelve.
 */
function shareRank(
  t: { raw: Vec; avg: Vec }, label: (k: string) => string = (k) => k, stretch = 2
) {
  const keys = Object.keys(t.avg);
  const total = keys.reduce((s, k) => s + (t.raw[k] ?? 0), 0);
  const avgTotal = keys.reduce((s, k) => s + (t.avg[k] ?? 0), 0);
  const meanAvg = avgTotal / Math.max(1, keys.length);
  // Nothing answered in this section — report nothing rather than letting the
  // shrink term below manufacture a mid-range profile out of no responses.
  if (total <= 0) return keys.map((k) => ({ key: k, name: label(k), score: 0 }));
  return keys
    .map((k) => {
      const expected = avgTotal ? (t.avg[k] ?? 0) / avgTotal : 0;
      const actual = total ? (t.raw[k] ?? 0) / total : 0;
      if (expected <= 0) return { key: k, name: label(k), score: 0 };
      // evidence: 1 when the bank measures this dimension at least as much as
      // the average one, less when it barely appears
      const ev = Math.min(1, (t.avg[k] ?? 0) / (meanAvg || 1));
      const shrunk = actual * ev + expected * (1 - ev);
      return { key: k, name: label(k), score: clamp(Math.round((shrunk / (stretch * expected)) * 100)) };
    })
    .sort((a, b) => b.score - a.score);
}

/** `keys` lets the caller list every dimension the section can measure while
 *  dividing by a smaller denominator (see the abstention handling in `tally`). */
const rank = (
  raw: Vec, max: Vec, label: (k: string) => string = (k) => k, keys?: string[]
) =>
  (keys ?? Object.keys(max))
    .map((k) => ({ name: label(k), key: k, score: pct(raw, max, k) }))
    .sort((a, b) => b.score - a.score);

export function scoreAssessment60(
  stage: StageKey,
  chosenSets: Record<Category, string>,
  answers: Answers
): AssessmentSummary {
  /* ---------------- 1. Career interests -> RIASEC + clusters ------------- */
  const ci = getSet("career_interest", stage, chosenSets.career_interest);
  const riasec = tally(ci, "career_interest", "riasec", answers);
  const clusters = tally(ci, "career_interest", "clusterWeights", answers);
  const riasecRanked = shareRank(riasec, (k) => RIASEC[k] ?? k);
  const clusterRanked = shareRank(clusters)
    .map((c) => ({ letter: c.key, score: c.score }));

  // Professions each chosen interest option points at (workbook: "Primary
  // Career Matches"). This is the only dimension that names careers per option.
  const interestVotes: Vec = {};
  ci.forEach((q, i) => {
    const idx = riasec.picks[i];
    const list: string[] = idx >= 0 && Array.isArray(q.careers) ? q.careers[idx] ?? [] : [];
    for (const c of list) interestVotes[c] = (interestVotes[c] ?? 0) + 1;
  });

  /* ---------------- 2. Personality -> Big Five --------------------------- */
  const pers = getSet("personality", stage, chosenSets.personality);
  const big = tally(pers, "personality", "traitPoints", answers);
  // Traits are normalised over the items the student engaged with, not over all
  // 12 — otherwise every "None of these" would silently deflate every trait.
  // Past half the items abstained there is too little left to publish, so the
  // profile is suppressed rather than reported as a near-zero.
  const personalityIncomplete = big.abstained > pers.length / 2;
  const bigFive = personalityIncomplete
    ? []
    : rank(big.raw, big.maxScored, (k) => BIG_FIVE[k] ?? k, Object.keys(big.max));
  const t = (k: string) => (personalityIncomplete ? 0 : pct(big.raw, big.maxScored, k));
  const E = t("E"), A = t("A"), C = t("C"), O = t("O"), S = t("S");
  const tempScores: Vec = {
    Sanguine: E * 0.6 + A * 0.25 + O * 0.15,
    Choleric: E * 0.5 + C * 0.3 + (100 - A) * 0.2,
    Melancholic: (100 - E) * 0.4 + C * 0.35 + O * 0.25,
    Phlegmatic: (100 - E) * 0.35 + A * 0.4 + S * 0.25,
  };
  // With every trait at 0 the (100 - E) terms would still crown a "winner", so
  // a suppressed profile reports no temperament at all.
  const dominantTemp = personalityIncomplete
    ? null
    : Object.entries(tempScores).sort((a, b) => b[1] - a[1])[0][0];
  // Forced choice makes it impossible to score high on all five traits at once,
  // so the mean is structurally ~40 for everyone and would read as a weakness
  // beside the other spokes. The spoke is the strongest trait: how pronounced
  // the personality profile is.
  const personalityScore = bigFive[0]?.score ?? 0;

  /* ---------------- 3. Aptitude -> ability, difficulty-weighted ---------- */
  // Workbook: "Instead of correct 1 / incorrect 0 ... Easy 1, Medium 2, Hard 3".
  const apt = getSet("aptitude", stage, chosenSets.aptitude);
  const aptDom: Record<string, { got: number; of: number }> = {};
  let aptGot = 0, aptOf = 0;
  apt.forEach((q, i) => {
    const w = DIFFICULTY[String(q.difficulty || "medium")] ?? 2;
    const d = String(q.domain || "Reasoning");
    const idx = parseInt(answers[`aptitude:${i}`] ?? "", 10);
    const ok = !Number.isNaN(idx) && idx === q.correct;
    aptDom[d] = aptDom[d] || { got: 0, of: 0 };
    aptDom[d].of += w; aptOf += w;
    if (ok) { aptDom[d].got += w; aptGot += w; }
  });
  const aptitudePct = aptOf ? Math.round((aptGot / aptOf) * 100) : null;
  const topAptitudes = Object.entries(aptDom)
    .map(([skill, { got, of }]) => ({ skill, score: Math.round((got / of) * 100) }))
    .sort((a, b) => b.score - a.score);
  const aptScores: Vec = Object.fromEntries(topAptitudes.map((x) => [x.skill, x.score]));

  /* ---------------- 4. Strengths -> 8 domains ---------------------------- */
  const str = getSet("strengths", stage, chosenSets.strengths);
  const sTal = tally(str, "strengths", "strengthPoints", answers);
  const strengthsRanked = shareRank(sTal);
  const strengthScores: Vec = Object.fromEntries(strengthsRanked.map((x) => [x.key, x.score]));

  /* ---------------- 5. Motivators -> 6 drivers --------------------------- */
  const mo = getSet("motivators", stage, chosenSets.motivators);
  const mTal = tally(mo, "motivators", "motivatorPoints", answers);
  const motivRanked = shareRank(mTal);
  const motivScores: Vec = Object.fromEntries(motivRanked.map((x) => [x.key, x.score]));

  /* ---------------- 6. Learning styles -> VARK (advisory only) ----------- */
  const ls = getSet("learning_styles", stage, chosenSets.learning_styles);
  const vark: Vec = {};
  const styleSet = new Set<string>();
  ls.forEach((q, i) => {
    if (Array.isArray(q.styles)) for (const s of q.styles) styleSet.add(String(s));
    const idx = parseInt(answers[`learning_styles:${i}`] ?? "", 10);
    const style = !Number.isNaN(idx) && Array.isArray(q.styles) ? q.styles[idx] : null;
    if (style) vark[style] = (vark[style] ?? 0) + 1;
  });
  // An even split across however many styles the bank offers is the baseline —
  // 4 styles is 25% each, 5 (VARK plus Multimodal) is 20% — and a preference is
  // stretched so double your expected share reads as 100 ("how clear is the
  // pull"). Deriving it from the styles present keeps the four-style banks
  // scoring exactly as before.
  const lsTotal = ls.length || 1;
  const evenShare = styleSet.size ? 1 / styleSet.size : 0.25;
  const learningStyles = Object.entries(vark)
    .map(([name, n]) => ({ name, score: clamp(Math.round((n / lsTotal / (2 * evenShare)) * 100)) }))
    .sort((a, b) => b.score - a.score);

  /* ---------------- 7. Multiple intelligences -> 8 talents --------------- */
  const mi = getSet("multiple_intelligence", stage, chosenSets.multiple_intelligence);
  const iTal = tally(mi, "multiple_intelligence", "intelPoints", answers);
  const miRanked = shareRank(iTal);
  const miScores: Vec = Object.fromEntries(miRanked.map((x) => [x.key, x.score]));

  /* ---------------- 8. Emotional intelligence -> 5 dimensions ------------ */
  // Two question shapes are supported.
  //
  // `optionDomains` (2026 set): every option on every item is a healthy
  // response naming a DIFFERENT EQ domain — identify the error / stay calm /
  // set a goal / understand them / ask for guidance. There is no weak answer to
  // score against, so no EQ *level* can be derived. What it does measure is
  // which domain the student reaches for first, scored as forced choice. `ei`
  // stays null on purpose: with five items and one observation per domain, an
  // out-of-100 figure would move on a single changed answer.
  //
  // `scores` (original bank): one dimension per question with options graded
  // 3/2/2/1, which does support an absolute percentage.
  const eiQ = getSet("emotional_intelligence", stage, chosenSets.emotional_intelligence);
  const eiForcedChoice = eiQ.some((q) => Array.isArray(q.optionDomains));
  const eiDim: Vec = {};
  let eiPct: number | null = null;

  if (eiForcedChoice) {
    const counts: Vec = {}, offered: Vec = {};
    let picked = 0;
    eiQ.forEach((q, i) => {
      const doms: string[] = Array.isArray(q.optionDomains) ? q.optionDomains.map(String) : [];
      for (const d of new Set(doms)) offered[d] = (offered[d] ?? 0) + 1;
      const idx = parseInt(answers[`emotional_intelligence:${i}`] ?? "", 10);
      const d = Number.isNaN(idx) ? undefined : doms[idx];
      if (d) { counts[d] = (counts[d] ?? 0) + 1; picked += 1; }
    });
    // Share of picks against an even split, stretched so twice your expected
    // share reads as 100 — the same convention shareRank applies to the other
    // forced-choice dimensions.
    const domains = Object.keys(offered);
    const even = domains.length ? 1 / domains.length : 0;
    for (const d of domains) {
      const share = picked ? (counts[d] ?? 0) / picked : 0;
      eiDim[d] = even && picked ? clamp(Math.round((share / (2 * even)) * 100)) : 0;
    }
  } else {
    let eiSum = 0, eiMax = 0;
    eiQ.forEach((q, i) => {
      const scores: number[] = Array.isArray(q.scores) ? q.scores : [];
      const best = scores.length ? Math.max(...scores) : 3;
      const idx = parseInt(answers[`emotional_intelligence:${i}`] ?? "", 10);
      const got = !Number.isNaN(idx) && typeof scores[idx] === "number" ? scores[idx] : 0;
      eiSum += got; eiMax += best;
      const d = String(q.dimension || "Emotional Intelligence");
      eiDim[d] = clamp(Math.round((got / best) * 100));
    });
    eiPct = eiMax ? Math.round((eiSum / eiMax) * 100) : null;
  }
  // Forced-choice EI has no absolute level, so its radar spoke reads how sharply
  // defined the profile is — the strongest domain — exactly as the other
  // ipsative dimensions do.
  const eiSpoke = eiPct ?? Math.max(0, ...Object.values(eiDim), 0);

  /* ================= Career vector matching ============================= */
  // Every dimension contributes an affinity in 0-1 for each profession it
  // names. Learning style is excluded by design; remaining weights renormalise.
  const DIM_SCORES: Record<string, Vec> = {
    personality: Object.fromEntries(bigFive.map((x) => [x.name, x.score])),
    aptitude: aptScores,
    strengths: strengthScores,
    motivators: motivScores,
    mi: miScores,
    ei: eiDim,
  };
  const DIM_WEIGHT: Record<string, number> = {
    career_interest: MAP.dimensionWeights.career_interest,
    personality: MAP.dimensionWeights.personality,
    aptitude: MAP.dimensionWeights.aptitude,
    strengths: MAP.dimensionWeights.strengths,
    motivators: MAP.dimensionWeights.motivators,
    ei: MAP.dimensionWeights.emotional_intelligence,
    mi: MAP.dimensionWeights.multiple_intelligence,
  };
  const totalWeight = Object.values(DIM_WEIGHT).reduce((s, w) => s + w, 0);

  const professions = new Set<string>(Object.keys(MAP.professionCluster));
  Object.keys(interestVotes).forEach((p) => professions.add(p));

  const maxVotes = Math.max(1, ...Object.values(interestVotes));
  const scored = [...professions].map((p) => {
    let num = 0, den = 0;
    if (interestVotes[p]) {
      const aff = interestVotes[p] / maxVotes;
      num += DIM_WEIGHT.career_interest * aff; den += DIM_WEIGHT.career_interest;
    }
    for (const [dim, table] of Object.entries(MAP.affinity)) {
      const w = DIM_WEIGHT[dim];
      if (!w) continue;
      const subs = Object.entries(table).filter(([, list]) => list.includes(p));
      if (!subs.length) continue;
      const scores = DIM_SCORES[dim] ?? {};
      // Within multiple intelligences the workbook weights the eight talents
      // unevenly (Logical/Linguistic/Spatial/Interpersonal .15, rest .10), so
      // apply those weights when averaging this profession's sub-dimensions.
      let sNum = 0, sDen = 0;
      for (const [sub] of subs) {
        const sw = dim === "mi" ? MAP.miWeights[sub] ?? 0.1 : 1;
        sNum += ((scores[sub] ?? 0) / 100) * sw; sDen += sw;
      }
      num += w * (sDen ? sNum / sDen : 0);
      den += w;
    }
    // Fit is the weighted mean over the dimensions that actually mention this
    // profession. Coverage is how much of the profile weighs in at all — a
    // profession only one dimension knows about must not outrank one the whole
    // profile supports, so coverage is applied relative to the best-covered
    // profession rather than as a small nudge.
    return { p, fit: den ? num / den : 0, coverage: den / totalWeight };
  });

  const maxCov = Math.max(0.0001, ...scored.map((s) => s.coverage));
  const ranked = scored
    .map((s) => ({ ...s, raw: s.fit * (0.35 + 0.65 * (s.coverage / maxCov)) }))
    .sort((a, b) => b.raw - a.raw);

  const maxRaw = Math.max(0.0001, ranked[0]?.raw ?? 0);
  const minRaw = Math.min(...ranked.slice(0, 6).map((r) => r.raw));
  const matches: AssessmentSummary["matches"] = ranked.slice(0, 6).map(({ p, raw }) => {
    const letter = MAP.professionCluster[p];
    const info = letter ? CLUSTERS[letter] : undefined;
    // Spread the visible top-6 across a readable band instead of bunching at
    // the ceiling when their raw scores are close.
    const t = maxRaw > minRaw ? (raw - minRaw) / (maxRaw - minRaw) : 1;
    const fitmentPct = clamp(Math.round(58 + t * 34 + (raw / maxRaw) * 4), 40, 96);
    return {
      title: p,
      fitmentPct,
      band: band(fitmentPct),
      blurb: info?.cluster ?? "Career match",
      roles: info ? [info.cluster] : [],
    };
  });

  /* ---------------- assemble the summary the report reads --------------- */
  const themes = clusterRanked
    .filter((c) => c.score > 0)
    .map((c) => ({
      letter: c.letter,
      title: CLUSTERS[c.letter]?.cluster || c.letter,
      score: c.score,
      meaning: (CLUSTERS[c.letter]?.careers || []).slice(0, 3).join(", "),
    }));
  const careerInterestScore = clusterRanked[0]?.score ?? 0;
  const topCluster = themes[0]?.title ?? null;

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
      ? `Your interests point most strongly toward ${topCluster}. Combined with your aptitude, strengths, motivators and working style, the profile below maps how you think, learn and decide.`
      : "Your profile across the eight dimensions is shown below.",
    outcomeLabel: dominantTemp ? `${dominantTemp} temperament` : null,
    confidence: aptOf && ci.length ? "high" : "medium",
    matches,
    topStrengths: bigFive.map((x) => ({
      parameterName: "Personality", subTraitName: x.name, normalizedScore: x.score,
    })),
    riasecCode: riasecRanked.slice(0, 3).map((x) => x.key).join(""),
    themes: themes.slice(0, 8),
    topIntelligences: miRanked.map((x) => ({ name: x.name, score: x.score })),
    topValues: motivRanked.map((x) => ({ tag: x.name, score: x.score })),
    topAptitudes,
    ei: eiPct,
    learningStyles,
    clusters: themes.map((x) => ({ cluster: x.title, score: x.score })),
    recommendations: [],
    nextStep: null,
    radar: [
      { key: "personality", label: "Personality", score: personalityScore },
      { key: "career_interest", label: "Career Interest", score: careerInterestScore },
      // Ipsative dimensions have no absolute "level" — the spoke reads how
      // sharply defined the profile is, i.e. the strongest sub-dimension.
      { key: "multiple_intelligence", label: "Multiple Intelligence", score: miRanked[0]?.score ?? 0 },
      { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiSpoke },
      { key: "learning_styles", label: "Learning Style", score: learningStyles[0]?.score ?? 0 },
      { key: "motivators", label: "Motivators", score: motivRanked[0]?.score ?? 0 },
      { key: "strengths", label: "Strengths", score: strengthsRanked[0]?.score ?? 0 },
      { key: "aptitude", label: "Aptitude", score: aptitudePct ?? 0 },
    ],
    strengthsBreakdown: strengthsRanked.map((x) => ({ name: x.name, score: x.score })),
    aptitudePct,
    // Extra detail the 9-10 report renders (EI is 5 dimensions, not one number).
    eiBreakdown: Object.entries(eiDim).map(([name, score]) => ({ name, score })),
    riasecScores: riasecRanked.map((x) => ({ letter: x.key, name: x.name, score: x.score })),
  };
}
