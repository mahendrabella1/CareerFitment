/**
 * Adapts a Graduates (UG) score output (scoringGrad.ts) into the
 * AssessmentSummary shape the report and dashboards render. The UG report's
 * dimensions are the 8 pillars of the UG assessment, passed as
 * `customDimensions` (see AssessmentSummary) so the shared report renders
 * pillar pages instead of the fixed 8 categories. The Career Selector /
 * cluster pages come from careerFitGradSheets.tsx's own extraSheets.
 */
import type { AssessmentSummary, ReportTheme } from "@/lib/auth/AuthProvider";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { rankSuitabilityGrad } from "@/lib/newAssessment/scoringGrad";
import { pillarDimensionsGrad } from "@/lib/report/pillarNarrativeGrad";

/** True only for the 8-pillar output. Records from the earlier UG question
 *  bank (no `version`) can't be re-scored, because raw answers were never
 *  stored, so they show the "retake" state instead of a broken report. */
export function isCurrentGraduateShape(output: unknown): output is GraduateScoreOutput {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const o = output as any;
  return o?.version === 2
    && Array.isArray(o?.layer1?.pillars) && o.layer1.pillars.length === 8
    && Boolean(o?.layer1?.personality) && Array.isArray(o?.layer1?.riasec)
    && Array.isArray(o?.layer1?.aptitude?.subdomains)
    && Array.isArray(o?.clusterAffinities);
}

/** The 8 pillar headline scores, in pillar order. gradExtraSheets.tsx's
 *  "strengths to leverage / growth areas" comparison uses these same numbers. */
export function dimensionScoresGrad(output: GraduateScoreOutput): { label: string; score: number }[] {
  return output.layer1.pillars.map((p) => ({ label: p.label, score: p.score }));
}

export function adaptGraduateToSummary(output: GraduateScoreOutput, base: AssessmentSummary): AssessmentSummary {
  const l1 = output.layer1;

  // Cluster affinities double as `themes`; those generic cards are hidden for
  // Graduates (hideCareerFitSections), so this only needs to be valid.
  const themes: ReportTheme[] = output.clusterAffinities.map((c) => ({
    letter: c.cluster,
    title: c.cluster,
    score: c.blendedScore,
    meaning: c.selfReported ? "You named this as one of your own top interests too." : "",
  }));

  const riasecRanked = l1.riasec.slice().sort((a, b) => b.percentile - a.percentile);
  const riasecScores = l1.riasec.map((r) => ({ letter: r.code, name: r.name, score: r.percentile }));
  const riasecCode = riasecRanked.slice(0, 3).map((r) => r.code).join("");

  const ei = l1.emotionalIntelligence;
  const eiPct = Math.round(((ei.selfAwareness + ei.selfManagement + ei.socialAwareness + ei.relationshipManagement) / 4) * 100);
  const eiBreakdown = [
    { name: "Self-Awareness", score: Math.round(ei.selfAwareness * 100) },
    { name: "Self-Management", score: Math.round(ei.selfManagement * 100) },
    { name: "Social Awareness", score: Math.round(ei.socialAwareness * 100) },
    { name: "Relationship Management", score: Math.round(ei.relationshipManagement * 100) },
  ];

  const customDimensions = pillarDimensionsGrad(l1);
  const radar = customDimensions.map((d) => ({ key: d.key, label: d.label, score: d.score }));

  // topCareer/overallFitmentPct must describe the same cluster, so both come
  // from the anchored suitability ranking (never raw clusterAffinities[0]).
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
    topIntelligences: [],
    topValues: l1.motivators.ranked.map((m) => ({ tag: m.tag, score: m.score })),
    topAptitudes: l1.aptitude.subdomains.filter((s) => s.total).map((s) => ({ skill: s.name, score: s.score })).sort((a, b) => b.score - a.score),
    ei: eiPct,
    eiBreakdown,
    learningStyles: [],
    strengthsBreakdown: l1.strengthDomains.map((d) => ({ name: d.domain, score: Math.round(d.score) })),
    aptitudePct: Math.round(l1.aptitude.overallScore),
    mbtiEI: l1.personality.axisScores.ei,
    mbtiSN: l1.personality.axisScores.sn,
    mbtiTF: l1.personality.axisScores.tf,
    mbtiJP: l1.personality.axisScores.jp,
    radar,
    customDimensions,
  };
}
