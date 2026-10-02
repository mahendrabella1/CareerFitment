/**
 * Adapts a Graduates (UG) score output (scoringGrad.ts's own shape) into
 * the AssessmentSummary shape FullReport.tsx already renders generically -
 * same pattern as adaptClass11.ts for Class 11-12, reusing the same shared
 * report cards for the 8 core dimensions instead of a separately designed
 * report. The Career Selector/cluster-affinity/academic-context pages are
 * NOT covered here - those come from careerFitGradSheets.tsx's own
 * extraSheets, the same way careerFit1112Sheets.tsx supplies 11-12's.
 */
import type { AssessmentSummary, ReportTheme } from "@/lib/auth/AuthProvider";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { rankSuitabilityGrad } from "@/lib/newAssessment/scoringGrad";

/** Basic structural guard - this is the first version of this shape, so
 *  there's no legacy format to reject yet, but a check still protects
 *  against a malformed/partial record reaching the adapter and crashing
 *  on a missing field deep in a `.map()`. */
export function isCurrentGraduateShape(output: unknown): output is GraduateScoreOutput {
  const l1 = (output as any)?.layer1;
  return Boolean(l1?.personality) && Boolean(l1?.riasec) && Boolean(l1?.aptitude)
    && Boolean(l1?.strengthDomains) && Boolean(l1?.multipleIntelligence)
    && Boolean(l1?.motivators?.ranked) && Boolean(l1?.learningStyle?.ranked)
    && Boolean(l1?.emotionalIntelligence?.ranked)
    && Array.isArray((output as any)?.clusterAffinities);
}

/** The same 8-dimension headline scores as `radar` below, factored out so
 *  gradExtraSheets.tsx's "strengths to leverage / growth areas" comparison
 *  (the highest- vs lowest-scoring of the 8) uses the exact same numbers
 *  the report itself already shows, rather than a second computation that
 *  could quietly drift from it. */
export function dimensionScoresGrad(output: GraduateScoreOutput): { label: string; score: number }[] {
  const l1 = output.layer1;
  const riasecRanked = l1.riasec.slice().sort((a, b) => b.percentile - a.percentile);
  const intelligenceTop = l1.multipleIntelligence.slice().sort((a, b) => b.score - a.score)[0];
  const strengthTop = l1.strengthDomains.slice().sort((a, b) => b.score - a.score)[0];
  const ei = l1.emotionalIntelligence;
  const eiPct = Math.round(((ei.selfAwareness + ei.selfManagement + ei.socialAwareness + ei.relationshipManagement) / 4) * 100);
  // scoringGrad.ts's strengthDomains/multipleIntelligence scores are
  // already 0-100 (unlike scoring11_12.ts's own versions, which are a 0-5
  // scale per that file's own comment) - no /5*100 conversion needed here.
  const strengthsScore = Math.round((strengthTop?.score ?? 0) * 0.6 + l1.aptitude.overallScore * 0.4);
  return [
    { label: "Personality", score: l1.personality.score },
    { label: "Career Interest", score: Math.round(riasecRanked[0]?.percentile ?? 0) },
    { label: "Multiple Intelligence", score: intelligenceTop ? Math.round(intelligenceTop.score) : 0 },
    { label: "Emotional Intelligence", score: eiPct },
    { label: "Learning Preferences", score: l1.learningStyle.score },
    { label: "Motivators", score: l1.motivators.score },
    { label: "Strengths", score: strengthsScore },
    { label: "Aptitude", score: Math.round(l1.aptitude.overallScore) },
  ];
}

export function adaptGraduateToSummary(output: GraduateScoreOutput, base: AssessmentSummary): AssessmentSummary {
  const l1 = output.layer1;

  // Cluster affinities double as `themes` (FullReport's generic "best-fit
  // domain" cards) - same approach 11-12 uses with its own DOMAINS_1112
  // names as the `letter` field, not the shared A-O catalogue. These cards
  // are hidden for Graduates anyway (hideCareerFitSections=true, same as
  // 11-12), replaced by careerFitGradSheets.tsx's own cluster-ranking page,
  // so this only needs to be structurally valid, not a real letter code.
  const themes: ReportTheme[] = output.clusterAffinities.map((c) => ({
    letter: c.cluster,
    title: c.cluster,
    score: c.blendedScore,
    meaning: c.selfReported ? "You named this as one of your own top interests too." : "",
  }));

  const riasecRanked = l1.riasec.slice().sort((a, b) => b.percentile - a.percentile);
  const riasecScores = l1.riasec.map((r) => ({ letter: r.code, name: r.name, score: r.percentile }));
  const riasecCode = riasecRanked.slice(0, 3).map((r) => r.code).join("");

  // Already 0-100 from scoringGrad.ts - see the dimensionScoresGrad comment
  // above for why this doesn't take 11-12's /5*100 conversion.
  const intelligenceRanked = l1.multipleIntelligence
    .slice().sort((a, b) => b.score - a.score)
    .map((d) => ({ name: d.domain, score: Math.round(d.score) }));
  const strengthAreasRanked = l1.strengthDomains
    .slice().sort((a, b) => b.score - a.score)
    .map((d) => ({ name: d.domain, score: Math.round(d.score) }));

  const topValues = l1.motivators.ranked.map((m) => ({ tag: m.tag, score: m.score }));

  const ap = l1.aptitude;
  const topAptitudes = [
    { skill: "Numerical", score: ap.numerical.score },
    { skill: "Logical", score: ap.logical.score },
    { skill: "Critical Thinking", score: ap.criticalThinking.score },
    { skill: "Blood Relations", score: ap.bloodRelations.score },
    { skill: "Coding-Decoding", score: ap.codingDecoding.score },
    { skill: "Direction Sense", score: ap.directionSense.score },
    { skill: "Number Series", score: ap.numberSeries.score },
  ].sort((a, b) => b.score - a.score);

  const learningStyles = l1.learningStyle.ranked.map((r) => ({ name: r.style, score: r.score }));

  const ei = l1.emotionalIntelligence;
  const eiPct = Math.round(((ei.selfAwareness + ei.selfManagement + ei.socialAwareness + ei.relationshipManagement) / 4) * 100);
  const eiBreakdown = [
    { name: "Self-Awareness", score: Math.round(ei.selfAwareness * 100) },
    { name: "Self-Management", score: Math.round(ei.selfManagement * 100) },
    { name: "Social Awareness", score: Math.round(ei.socialAwareness * 100) },
    { name: "Relationship Management", score: Math.round(ei.relationshipManagement * 100) },
  ];

  const RADAR_KEYS = ["personality", "career_interest", "multiple_intelligence", "emotional_intelligence", "learning_styles", "motivators", "strengths", "aptitude"];
  const radar = dimensionScoresGrad(output).map((d, i) => ({ key: RADAR_KEYS[i], label: d.label, score: d.score }));

  // topCareer/overallFitmentPct are rendered as a single name+percentage
  // pair in several places (admin table, dashboard chip, report PDF) - both
  // MUST describe the same cluster, so this goes through the same anchored
  // ranking output.summary.topCluster already uses (rankSuitabilityGrad),
  // never the raw, un-anchored clusterAffinities[0].
  const suitabilityTop = rankSuitabilityGrad(output.clusterAffinities, output.academicContext.degree, output.academicContext.course)[0];

  return {
    ...base,
    overallFitmentPct: suitabilityTop?.suitabilityScore ?? null,
    topCareer: output.summary.topCluster || null,
    desiredCareer: output.aspiration.desiredCareer || null,
    desiredCareerFitPct: null,
    summary: l1.personality.summary || null,
    matches: [],
    topStrengths: [],
    riasecCode,
    riasecScores,
    themes,
    topIntelligences: intelligenceRanked,
    topValues,
    topAptitudes,
    ei: eiPct,
    eiBreakdown,
    learningStyles,
    strengthsBreakdown: strengthAreasRanked,
    aptitudePct: Math.round(ap.overallScore),
    mbtiEI: l1.personality.axisScores.ei,
    mbtiSN: l1.personality.axisScores.sn,
    mbtiTF: l1.personality.axisScores.tf,
    mbtiJP: l1.personality.axisScores.jp,
    radar,
  };
}
