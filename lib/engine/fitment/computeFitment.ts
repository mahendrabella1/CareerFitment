import {
  DEFAULT_MATCH_WEIGHTS,
  FAMILY_WEIGHT_MULTIPLIERS,
  bandForFitment,
} from "./fitmentModel";
import { getCareerLibrary } from "./careerLibrary";
import { extractUserProfile, ScoredParameter } from "./profile";
import {
  academicFeasibility,
  aptitudeThresholdSat,
  bigFiveSim,
  eiSim,
  miSim,
  riasecCosine,
  valuesSim,
} from "./similarity";
import {
  Career,
  CareerMatch,
  CategoryContribution,
  FitmentResult,
  MatchCategory,
  UserProfile,
  ValidityReport,
} from "./types";

export interface ComputeFitmentOptions {
  topN?: number;
  rawAnswers?: string[]; // raw response values, for straight-lining detection
}

/**
 * The matcher (blueprint §8). Turns a scored session into a ranked, explainable
 * set of career matches. Interest + Aptitude drive it; Personality/Values/MI/EI
 * refine; Academic gates feasibility; Learning Style stays out of the maths.
 */
export function computeFitment(
  params: ScoredParameter[],
  options: ComputeFitmentOptions = {}
): FitmentResult {
  const topN = options.topN ?? 12;
  const profile = extractUserProfile(params);
  const careers = getCareerLibrary();

  const matches: CareerMatch[] = careers
    .map((career) => scoreCareer(profile, career))
    .filter((m): m is CareerMatch => m !== null)
    .sort((a, b) => b.fitmentPct - a.fitmentPct);

  // Career clusters (report §16 equivalent): best fit achieved within each
  // cluster, ranked. Uses the full ranked list, not just the top N.
  const clusterBest = new Map<string, number>();
  for (const m of matches) {
    clusterBest.set(m.cluster, Math.max(clusterBest.get(m.cluster) ?? 0, m.fitmentPct));
  }
  const clusters = [...clusterBest.entries()]
    .map(([cluster, score]) => ({ cluster, score: Math.round(score) }))
    .sort((a, b) => b.score - a.score);

  const validity = assessValidity(profile, options.rawAnswers);

  return {
    profile: {
      riasecCode: profile.riasecCode,
      riasec: profile.riasec,
      topAptitudes: topEntries(profile.aptitude).map(([skill, score]) => ({
        skill,
        score: Math.round(score),
      })),
      topValues: profile.values.slice(0, 3).map((v) => ({ tag: v.tag, score: v.score })),
      topIntelligences: topEntries(profile.mi).map(([name, score]) => ({
        name,
        score: Math.round(score),
      })),
      ei: profile.ei,
      learningStyles: profile.learningStyles,
    },
    matches: matches.slice(0, topN),
    clusters,
    validity,
  };
}

function scoreCareer(profile: UserProfile, career: Career): CareerMatch | null {
  // Per-category similarity (0-1) — only where the user has data AND the career
  // encodes an ideal for it.
  const sims: Partial<Record<MatchCategory, number>> = {};

  if (profile.riasec) {
    sims.interest = riasecCosine(profile.riasec, career.riasec);
  }
  if (Object.keys(profile.aptitude).length) {
    const s = aptitudeThresholdSat(profile.aptitude, career.aptitude);
    if (s !== null) sims.aptitude = s;
  }
  if (Object.keys(profile.bigFive).length) {
    const s = bigFiveSim(profile.bigFive, career.bigFive);
    if (s !== null) sims.personality = s;
  }
  if (profile.values.length) {
    const s = valuesSim(profile.values, career.values);
    if (s !== null) sims.values = s;
  }
  if (Object.keys(profile.mi).length) {
    const s = miSim(profile.mi, miVectorFrom(career));
    if (s !== null) sims.mi = s;
  }
  if (profile.ei !== null) {
    const s = eiSim(profile.ei, career.eiMin);
    if (s !== null) sims.ei = s;
  }
  if (profile.academic.length) {
    const s = academicFeasibility(profile.academic, career.entrySubjects);
    if (s !== null) sims.academic = s;
  }

  const active = Object.keys(sims) as MatchCategory[];
  if (active.length === 0) return null;

  // Family-tuned match weights over the active categories, renormalised to 1.
  const familyMult = FAMILY_WEIGHT_MULTIPLIERS[career.family] ?? {};
  const rawWeights: Record<string, number> = {};
  let weightSum = 0;
  for (const cat of active) {
    const w = DEFAULT_MATCH_WEIGHTS[cat] * (familyMult[cat] ?? 1);
    rawWeights[cat] = w;
    weightSum += w;
  }

  let fitment = 0;
  const contributions: CategoryContribution[] = [];
  for (const cat of active) {
    const weight = rawWeights[cat] / weightSum;
    const similarity = sims[cat]!;
    const contributionPct = similarity * weight * 100;
    fitment += contributionPct;
    contributions.push({
      category: cat,
      similarity: round2(similarity),
      weight: round2(weight),
      contributionPct: Math.round(contributionPct),
    });
  }
  contributions.sort((a, b) => b.contributionPct - a.contributionPct);

  const fitmentPct = Math.round(fitment);
  return {
    careerId: career.id,
    title: career.title,
    family: career.family,
    cluster: career.cluster,
    roles: career.roles,
    blurb: career.blurb,
    fitmentPct,
    band: bandForFitment(fitmentPct),
    contributions,
    gaps: buildGaps(profile, career, sims),
  };
}

function buildGaps(
  profile: UserProfile,
  career: Career,
  sims: Partial<Record<MatchCategory, number>>
): string[] {
  const gaps: string[] = [];

  // Aptitude shortfalls — the blueprint's headline gap example.
  if (career.aptitude) {
    for (const [skill, req] of Object.entries(career.aptitude)) {
      const have = profile.aptitude[skill as keyof typeof profile.aptitude];
      if (have !== undefined && req - have >= 15) {
        gaps.push(
          `${skill} aptitude ${Math.round(have)} vs ~${req} typical — worth strengthening.`
        );
      }
    }
  }

  // EI shortfall for people-facing roles.
  if (career.eiMin && profile.ei !== null && career.eiMin - profile.ei >= 15) {
    gaps.push(
      `This is a people-facing path; Emotional Intelligence ${profile.ei} vs ~${career.eiMin} helpful — build interpersonal skills.`
    );
  }

  // Interest mismatch note.
  if (sims.interest !== undefined && sims.interest < 0.55) {
    gaps.push(
      "Interest alignment is moderate — validate with real exposure before committing."
    );
  }

  return gaps.slice(0, 3);
}

function assessValidity(
  profile: UserProfile,
  rawAnswers?: string[]
): ValidityReport {
  const notes: string[] = [];

  // Straight-lining: same option chosen for a large share of Likert answers.
  let straightLining = false;
  if (rawAnswers && rawAnswers.length >= 20) {
    const counts = new Map<string, number>();
    for (const a of rawAnswers) counts.set(a, (counts.get(a) ?? 0) + 1);
    const maxShare = Math.max(...counts.values()) / rawAnswers.length;
    if (maxShare >= 0.85) {
      straightLining = true;
      notes.push(
        "Responses look flat-lined (one option dominates) — results may be unreliable."
      );
    }
  }

  const reliableCategoryCount = Object.values(profile.reliability).filter(
    (n) => (n ?? 0) >= 1
  ).length;
  const lowCompleteness = reliableCategoryCount < 3;
  if (lowCompleteness) {
    notes.push(
      "Few categories produced reliable scores — treat matches as directional."
    );
  }

  let confidence: ValidityReport["confidence"] = "high";
  if (straightLining || reliableCategoryCount < 3) confidence = "low";
  else if (reliableCategoryCount < 5) confidence = "medium";

  if (confidence === "high") {
    notes.push("Response pattern looks consistent and complete.");
  }

  return {
    straightLining,
    lowCompleteness,
    reliableCategoryCount,
    confidence,
    notes,
  };
}

// A career's MI list → a vector at a uniform "strong" level, so distance
// similarity rewards users strong in those same intelligences.
function miVectorFrom(career: Career) {
  if (!career.mi || career.mi.length === 0) return undefined;
  const v: Record<string, number> = {};
  for (const m of career.mi) v[m] = 80;
  return v as import("./types").MiVector;
}

function topEntries(vec: Record<string, number>): [string, number][] {
  return Object.entries(vec).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}
