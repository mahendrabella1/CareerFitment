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
  p >= 80 ? "High" : p >= 65 ? "High" : p >= 50 ? "Good" : p >= 35 ? "Moderate" : "Low";

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

// Student-facing wording for the same five traits. The formal names above stay
// in the data — the career library matches on them — so this map is only ever
// used for text a student reads. Kept in step with TRAITS in
// lib/report/knowledge.ts, which is where the full explanations live.
const PLAIN_TRAIT: Record<string, string> = {
  Openness: "curiosity & new ideas",
  Conscientiousness: "planning & follow-through",
  Extraversion: "energy around people",
  Agreeableness: "warmth with people",
  "Emotional Stability": "staying calm under pressure",
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
): { raw: Vec; max: Vec; avg: Vec; picks: number[] } {
  const raw: Vec = {}, max: Vec = {}, avg: Vec = {}, picks: number[] = [];
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
    const chosen = Number.isNaN(idx) ? null : vecs[idx];
    if (chosen) for (const [k, n] of Object.entries(chosen)) raw[k] = (raw[k] ?? 0) + n;
  });
  return { raw, max, avg, picks };
}

/**
 * Absolute normalisation: what fraction of the points this dimension could
 * possibly have awarded did the student actually take. Right for Big Five,
 * where every trait is scorable on most questions.
 */
const pct = (raw: Vec, max: Vec, k: string) =>
  max[k] ? clamp(Math.round(((raw[k] ?? 0) / max[k]) * 100)) : 0;

/**
 * Turn "how many times the expected share did you score" into a 0-100 number.
 *
 * THIS EXISTS TO STOP THE REPORT PRINTING 100. The previous mapping was
 * `share / (2 x expected)` hard-clamped at 100, which meant any dimension
 * picked at twice its expected rate printed a perfect score — and on a
 * forced-choice bank with 8 options, picking one thing 25% of the time does
 * that. Whole sections of the report came out saturated at 100, which tells a
 * student nothing: if Numerical, Verbal, Logical, Abstract, Spatial, Attention
 * to Detail and Mechanical are all "100", the profile has no shape to read.
 *
 * r/(r+1) is a standard saturating curve and never actually reaches 1:
 *   r = 0   ->  0   never chosen, and that still has to read as zero
 *   r = 1   -> 50   exactly the expected share: the typical result
 *   r = 2   -> 67
 *   r = 3   -> 75
 *   r = 5   -> 83
 *   r = 9   -> 90
 * A 100 is now unreachable by construction rather than by tuning, and the gaps
 * between dimensions survive instead of being flattened against a ceiling.
 *
 * These are NOT percentiles and must never be labelled as such — there is no
 * norm sample behind them. They are descriptive scores within this student's
 * own profile: "pronounced for you", not "higher than N% of students". See
 * SCORE_BANDS for the wording the report is allowed to use.
 */
const curve = (ratio: number) => clamp(Math.round((ratio / (ratio + 1)) * 100));

/**
 * Descriptive bands for a 0-100 dimension score. Deliberately worded as
 * RELATIVE PREFERENCE/STRENGTH WITHIN THIS PROFILE, because that is all the
 * data supports today: no norm population has been collected, so nothing here
 * may claim a percentile or a comparison against other students. Swap this for
 * true percentile bands only once a norm sample exists.
 */
export const SCORE_BANDS: { min: number; label: string }[] = [
  { min: 80, label: "Exceptional relative strength" },
  { min: 70, label: "Strong" },
  { min: 60, label: "Above average for you" },
  { min: 40, label: "Typical range" },
  { min: 25, label: "Developing" },
  { min: 0, label: "Lower relative preference" },
];

export const bandLabel = (score: number) =>
  (SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1]).label;

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
  const even = 1 / Math.max(1, keys.length);
  if (total <= 0) return keys.map((k) => ({ key: k, name: label(k), score: 0 }));
  return keys
    .map((k) => {
      const expected = avgTotal ? (t.avg[k] ?? 0) / avgTotal : 0;
      const actual = (t.raw[k] ?? 0) / total;
      if (expected <= 0) return { key: k, name: label(k), score: 0 };
      // The share is judged against an EVEN split, floored by the dimension's
      // own expected share. Two properties matter, and the previous version had
      // neither:
      //
      //  - A dimension the student never picked must score 0. Blending the
      //    expected share into the result ("actual * ev + expected * (1 - ev)")
      //    gave every unpicked dimension a floor. Health Science is offered on
      //    barely any interest option in this bank, and that floor alone scored
      //    it 47 for a student who never once chose it — a career
      //    recommendation manufactured out of nothing.
      //
      //  - Rarity must not be rewarded. Dividing by a rare dimension's own tiny
      //    expected share multiplied it, so a single stray click on a
      //    rarely-offered cluster outranked several deliberate picks of a
      //    common one.
      //
      // Flooring the denominator at the even split fixes both. The cost is that
      // a rarely-offered dimension can no longer reach 100 — which is honest,
      // since the bank never gave the student enough chances to show it.
      const denom = Math.max(expected, even);
      // `stretch` now sets where the midpoint of the curve sits rather than
      // where it clips: scoring `stretch`x your expected share reads ~67, not
      // 100. See `curve` for why nothing may print a perfect score.
      return { key: k, name: label(k), score: curve(actual / denom / stretch) };
    })
    .sort((a, b) => b.score - a.score);
}

const rank = (raw: Vec, max: Vec, label: (k: string) => string = (k) => k) =>
  Object.keys(max)
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
  const bigFive = rank(big.raw, big.max, (k) => BIG_FIVE[k] ?? k);
  // The four temperaments were derived from these same five numbers and are no
  // longer reported, so they are no longer computed — see the note on TRAITS in
  // lib/report/knowledge.ts.
  // Forced choice makes it impossible to score high on all five traits at once,
  // so the mean is structurally ~40 for everyone and would read as a weakness
  // beside the other spokes. The spoke is the strongest trait: how pronounced
  // the personality profile is.
  const personalityScore = bigFive[0]?.score ?? 0;

  /* ---------------- 3. Aptitude -> ability, difficulty-weighted ---------- */
  // Workbook: "Instead of correct 1 / incorrect 0 ... Easy 1, Medium 2, Hard 3".
  const apt = getSet("aptitude", stage, chosenSets.aptitude);
  const aptDom: Record<string, { got: number; of: number; items: number }> = {};
  let aptGot = 0, aptOf = 0;
  apt.forEach((q, i) => {
    const w = DIFFICULTY[String(q.difficulty || "medium")] ?? 2;
    const d = String(q.domain || "Reasoning");
    const idx = parseInt(answers[`aptitude:${i}`] ?? "", 10);
    const ok = !Number.isNaN(idx) && idx === q.correct;
    aptDom[d] = aptDom[d] || { got: 0, of: 0, items: 0 };
    aptDom[d].of += w; aptDom[d].items += 1; aptOf += w;
    if (ok) { aptDom[d].got += w; aptGot += w; }
  });
  const aptitudePct = aptOf ? Math.round((aptGot / aptOf) * 100) : null;

  // Per-domain aptitude used to be a raw got/of percentage. On the 9-10 bank
  // that is 10 questions across SEVEN domains — Verbal, Abstract, Spatial,
  // Attention to Detail and Mechanical get exactly ONE question each. A raw
  // percentage over one item can only ever print 0 or 100, which is how a
  // report ends up claiming a student is 100 at all seven abilities. That is a
  // coin flip rendered as a precise score.
  //
  // Each domain is now shrunk toward the student's own overall aptitude rate in
  // proportion to how little evidence stands behind it (a standard
  // small-sample/empirical-Bayes correction). One item barely moves the
  // estimate off the student's overall rate; several items move it a long way.
  // The result is a profile with a readable SHAPE — 91/84/88/76/68 rather than
  // 100/100/100/100/100 — and 100 becomes unreachable on a short bank, which is
  // the honest outcome.
  //
  // This does not manufacture precision the items don't have: a one-item domain
  // still deserves an "estimated from 1 question" caveat in the report, and
  // `items` is carried here so that caveat can be shown. Lengthening the 9-10
  // aptitude set is the real fix; this stops the report overclaiming until then.
  const overallRate = aptOf ? aptGot / aptOf : 0.5;
  const PRIOR_ITEMS = 3; // pseudo-items of prior; ~= "worth 3 questions of doubt"
  const topAptitudes = Object.entries(aptDom)
    .map(([skill, { got, of, items }]) => {
      const perItem = of / Math.max(1, items); // this domain's average item weight
      const prior = PRIOR_ITEMS * perItem;
      return { skill, score: clamp(Math.round(((got + prior * overallRate) / (of + prior)) * 100)) };
    })
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
  // Initialize with all 4 VARK styles to ensure they all appear in output, even if not selected
  const vark: Vec = {
    "Visual": 0,
    "Auditory": 0,
    "Reading/Writing": 0,
    "Kinesthetic": 0,
  };
  ls.forEach((q, i) => {
    const idx = parseInt(answers[`learning_styles:${i}`] ?? "", 10);
    const style = !Number.isNaN(idx) && Array.isArray(q.styles) ? q.styles[idx] : null;
    if (style) vark[style] = (vark[style] ?? 0) + 1;
  });
  // Four items, four styles: an even split is 25% each. This is a PREFERENCE
  // strength, not an ability — "how clear is the pull toward this material",
  // never "you learn best this way". Two of four items landing on one style
  // used to print 100; the curve makes that read ~67, which is all four items
  // can honestly support.
  const lsTotal = ls.length || 1;
  const evenShare = 1 / 4;
  const learningStyles = Object.entries(vark)
    .map(([name, n]) => ({ name, score: curve((n / lsTotal / evenShare) / 2) }))
    .sort((a, b) => b.score - a.score);

  /* ---------------- 7. Multiple intelligences -> 8 talents --------------- */
  const mi = getSet("multiple_intelligence", stage, chosenSets.multiple_intelligence);
  const iTal = tally(mi, "multiple_intelligence", "intelPoints", answers);
  const miRanked = shareRank(iTal);
  const miScores: Vec = Object.fromEntries(miRanked.map((x) => [x.key, x.score]));

  /* ---------------- 8. Emotional intelligence -> 5 dimensions ------------ */
  const eiQ = getSet("emotional_intelligence", stage, chosenSets.emotional_intelligence);
  // Accumulate per dimension. This used to ASSIGN — `eiDim[d] = ...` inside the
  // loop — so a dimension asked about more than once kept only its last
  // question and threw the rest away, and a single item scored at its best
  // option printed a flat 100. Every EI dimension bar in the report was
  // effectively one question wide, and those numbers also fed career matching
  // through DIM_SCORES below.
  const eiTal: Record<string, { got: number; of: number }> = {};
  let eiSum = 0, eiMax = 0;
  eiQ.forEach((q, i) => {
    const scores: number[] = Array.isArray(q.scores) ? q.scores : [];
    const best = scores.length ? Math.max(...scores) : 3;
    const idx = parseInt(answers[`emotional_intelligence:${i}`] ?? "", 10);
    const got = !Number.isNaN(idx) && typeof scores[idx] === "number" ? scores[idx] : 0;
    eiSum += got; eiMax += best;
    const d = String(q.dimension || "Emotional Intelligence");
    eiTal[d] = eiTal[d] || { got: 0, of: 0 };
    eiTal[d].got += got; eiTal[d].of += best;
  });
  // Same small-sample correction as aptitude: a one-item EI dimension is shrunk
  // toward the student's overall EI rate rather than printing 0 or 100.
  const eiRate = eiMax ? eiSum / eiMax : 0.5;
  const eiDim: Vec = Object.fromEntries(
    Object.entries(eiTal).map(([d, { got, of }]) => {
      const prior = of; // one item's worth of doubt, scaled to this dimension
      return [d, clamp(Math.round(((got + prior * eiRate) / (of + prior)) * 100))];
    })
  );
  const eiPct = eiMax ? Math.round((eiSum / eiMax) * 100) : null;

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
  // How strongly the student scored each career cluster, so a profession can
  // inherit interest support from the cluster it belongs to.
  const clusterScore: Vec = Object.fromEntries(clusterRanked.map((c) => [c.letter, c.score]));

  const scored = [...professions].map((p) => {
    let num = 0, den = 0;
    // Interest affinity comes from two places, and the second one matters:
    //
    //   votes   the profession was named by an option the student actually
    //           chose. Precise, but only 69 of the 113 professions are named by
    //           any option at all.
    //   cluster how strongly the student scored the cluster this profession
    //           sits in.
    //
    // Using votes alone left 44 professions with NO interest signal whatever —
    // the heaviest dimension simply absent — so they were matched on
    // personality and aptitude, which are cluster-blind. That is why the top
    // recommendation agreed with the student's own strongest interest only 43%
    // of the time, and why raising the interest weight alone plateaued: the
    // extra weight had nothing to attach to for a third of the catalogue.
    const votes = interestVotes[p] ? interestVotes[p] / maxVotes : 0;
    const viaCluster = (clusterScore[MAP.professionCluster[p]] ?? 0) / 100;
    const aff = Math.max(votes, viaCluster);
    if (aff > 0) {
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
    // PROFILE ALIGNMENT — how much of this student's weighted profile actually
    // supports this career. Not a probability of success, and not a percentage
    // of anything: `raw` is already the weighted mean of the dimensions that
    // mention this profession, scaled by how much of the profile weighs in.
    //
    // What this replaced was a rank-spread dressed up as a measurement:
    //
    //   const t = maxRaw > minRaw ? (raw - minRaw) / (maxRaw - minRaw) : 1;
    //   fitmentPct = clamp(round(58 + t * 34 + (raw / maxRaw) * 4), 40, 96)
    //
    // The top match is by definition `raw === maxRaw`, so `t` was always 1 and
    // the headline number was always exactly 96 — for every student, every
    // time, no matter what they answered. The bottom of the visible six was
    // pinned to 58 the same way. Those numbers described the ORDER of the list,
    // never the strength of the match, and a student comparing "96%" against a
    // friend's "96%" was comparing two constants.
    //
    // Reporting `raw` directly means a genuinely strong profile match reads
    // higher than a weak one, two students get different numbers, and the same
    // student's careers spread according to real differences in support.
    const fitmentPct = clamp(Math.round(raw * 100), 0, 99);
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
    // Plain-language, because this label is shown to the student (report header,
    // report email). The temperament names it used to carry are no longer
    // reported — see the note on TRAITS in lib/report/knowledge.ts.
    outcomeLabel: bigFive[0] ? `Strongest trait: ${PLAIN_TRAIT[bigFive[0].name] ?? bigFive[0].name}` : null,
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
      { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiPct ?? 0 },
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
