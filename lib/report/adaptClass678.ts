/**
 * Adapts Class 6, 7 and 8 score outputs (class6Scoring.ts / class7Scoring.ts
 * / class8Scoring.ts's own shapes) into the AssessmentSummary shape
 * FullReport.tsx already renders for class 9-10 - so classes 6-8 get the
 * exact same report code, CSS and images instead of three separately
 * designed bespoke reports (Class6Report.tsx / Class7Report.tsx /
 * Class8Report.tsx) that inevitably drift from it and from each other. Same
 * approach as adaptClass11.ts for Class 11-12.
 *
 * Class 6 and Class 7 share an identical output shape (same field names,
 * same 60-question structure) so one internal adapter serves both. Class 8
 * uses different field names for several dimensions (see class8Scoring.ts)
 * and is adapted separately.
 */
import type { AssessmentSummary, ReportTheme } from "@/lib/auth/AuthProvider";
import type { Class6ScoreOutput } from "@/lib/newAssessment/class6Scoring";
import type { Class7ScoreOutput } from "@/lib/newAssessment/class7Scoring";
import type { Class8ScoreOutput } from "@/lib/newAssessment/class8Scoring";
import { DOMAINS } from "@/lib/report/knowledge";

/**
 * True only for output produced by the CURRENT (15-domain) scoring engines.
 * A report saved before the domain-catalogue rebuild has a `domainAffinities`
 * array of only 8 entries scored against the OLD, differently-meaning A-H
 * letters - not just a smaller list, but affinities computed against domain
 * definitions that no longer exist. Rendering it through this adapter would
 * show a student career recommendations that don't match any current domain
 * name, so it's treated as "no report yet" instead, matching the class 11-12
 * staleness guard in adaptClass11.ts.
 */
function isCurrentDomainShape(output: unknown): boolean {
  const o = output as any;
  return Array.isArray(o?.domainAffinities) && o.domainAffinities.length >= 15 && Boolean(o?.personalityProfile?.axisScores);
}

export function isCurrentClass6Shape(output: unknown): output is Class6ScoreOutput {
  return isCurrentDomainShape(output);
}
export function isCurrentClass7Shape(output: unknown): output is Class7ScoreOutput {
  return isCurrentDomainShape(output);
}
export function isCurrentClass8Shape(output: unknown): output is Class8ScoreOutput {
  return isCurrentDomainShape(output);
}

// Short narrative blurbs for class 6/7/8's 4-indicator creativity vocabulary
// (Problem-Solving / Adaptability / Innovation / Future-Orientation) - same
// role as CREATIVITY_BLURBS in scoring11_12.ts, for the parts of the report
// that want a sentence rather than a bare label + score.
const CREATIVITY_BLURBS_C678: Record<string, string> = {
  "Problem-Solving": "Works through a problem methodically until a solution is found.",
  "Adaptability": "Adjusts quickly when a plan or situation changes.",
  "Innovation": "Prefers coming up with a new idea over repeating a known one.",
  "Future-Orientation": "Thinks ahead about where things are heading before acting.",
};

function creativityDetailFrom(creativity: { indicator: string; score: number }[]) {
  const blurb = (tag: string) => CREATIVITY_BLURBS_C678[tag] ?? `Leans toward ${tag.toLowerCase().replace(/-/g, " ")} thinking.`;
  return {
    problemSolving: creativity[0] ? blurb(creativity[0].indicator) : "Approaches problems in a balanced, varied way.",
    innovationApproach: creativity[1] ? blurb(creativity[1].indicator) : "Experimental and iterative.",
    recommendations: [
      "Try one deliberately different approach to a routine task this week.",
      "Join a maker, robotics, art or innovation club to practise hands-on problem-solving.",
      "Keep a short idea journal - jot down one 'what if' question a day.",
    ],
  };
}

function adaptClass67ToSummary(
  output: Class6ScoreOutput | Class7ScoreOutput,
  base: AssessmentSummary,
  journeyCode: "6" | "7",
  journeyName: "Class 6" | "Class 7"
): AssessmentSummary {
  // Title uses the SHARED DOMAINS catalogue's name, not this engine's own
  // domainName - the two always agree post-rebuild since both are sourced
  // from lib/report/knowledge.ts, but DOMAINS is the one the domain cards
  // themselves render from, so it's the source of truth here too.
  const themes: ReportTheme[] = output.domainAffinities.map((d) => ({
    letter: d.domain,
    title: DOMAINS[d.domain]?.name ?? d.domainName,
    score: d.affinity,
    meaning: d.reasoning[0] ?? "",
  }));

  const riasecRanked = output.riasecScores; // already sorted desc by scoreRIASEC()
  const riasecScores = output.riasecScores.map((r) => ({ letter: r.letter, name: r.name, score: r.score }));
  const riasecCode = riasecRanked.slice(0, 3).map((r) => r.letter).join("");

  const intelligenceRanked = output.strengthDomains.map((d) => ({ name: d.name, score: d.score }));

  const topValues = output.motivators.map((m) => ({ tag: m.name, score: m.score }));

  // Class 6/7's aptitude section only produces one overall score (no named
  // sub-skills like class 8 or 11-12) - a single generic entry still feeds
  // the report's "sharpest in..." text and aptitudePct honestly, it just
  // won't match any of AFFINITY's specific keyword lists in domainFit()
  // (lib/report/knowledge.ts), which is correct: this bank never measured a
  // sub-skill breakdown to draw a real match from.
  const topAptitudes = [{ skill: "Reasoning & Problem-Solving", score: output.aptitudeProfile.score }];

  const lsEntries = Object.entries(output.learningStyle.scores).sort((a, b) => b[1] - a[1]);
  const learningStyles = lsEntries.slice(0, 2).map(([name, score]) => ({ name, score }));

  const eiPct = Math.round(output.emotionalAwareness.reduce((s, e) => s + e.score, 0) / output.emotionalAwareness.length);
  const eiBreakdown = output.emotionalAwareness.map((e) => ({ name: e.dimension, score: e.score }));

  // Same "Strengths" blend as adaptClass11.ts: leading intelligence + raw
  // aptitude, a real number distinct from the Multiple Intelligence card's
  // own score rather than a duplicate of it.
  const strengthsScore = Math.round((intelligenceRanked[0]?.score ?? 0) * 0.6 + output.aptitudeProfile.score * 0.4);

  const creativityAvg = Math.round(output.creativity.reduce((s, c) => s + c.score, 0) / output.creativity.length);

  const radar = [
    { key: "personality", label: "Personality", score: output.personalityProfile.score },
    { key: "career_interest", label: "Career Interest", score: riasecRanked[0]?.score ?? 0 },
    { key: "multiple_intelligence", label: "Multiple Intelligence", score: intelligenceRanked[0]?.score ?? 0 },
    { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiPct },
    { key: "learning_styles", label: "Learning Preferences", score: lsEntries[0]?.[1] ?? 0 },
    { key: "motivators", label: "Motivators", score: topValues[0]?.score ?? 0 },
    { key: "strengths", label: "Strengths", score: strengthsScore },
    { key: "aptitude", label: "Aptitude", score: output.aptitudeProfile.score },
    { key: "creativity", label: "Creativity & Innovation", score: creativityAvg },
  ];

  const topDomain = output.domainAffinities[0];

  return {
    ...base,
    journeyCode,
    journeyName,
    overallFitmentPct: topDomain?.affinity ?? null,
    topCareer: (topDomain ? DOMAINS[topDomain.domain]?.name : null) ?? topDomain?.domainName ?? null,
    // Classes 6-8 never collect a desired/primary career (no career_selector
    // section in their question bank), unlike class 11-12.
    desiredCareer: null,
    desiredCareerFitPct: null,
    summary: output.summary || null,
    matches: [],
    // No Big-Five sub-traits measured (MBTI-style personality only) - left
    // empty so FullReport falls back cleanly rather than fabricating them.
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
    strengthsBreakdown: intelligenceRanked,
    aptitudePct: output.aptitudeProfile.score,
    mbtiEI: output.personalityProfile.axisScores.ei,
    mbtiSN: output.personalityProfile.axisScores.sn,
    mbtiTF: output.personalityProfile.axisScores.tf,
    mbtiJP: output.personalityProfile.axisScores.jp,
    radar,
    creativityDetail: creativityDetailFrom(output.creativity),
  };
}

export function adaptClass6ToSummary(output: Class6ScoreOutput, base: AssessmentSummary): AssessmentSummary {
  return adaptClass67ToSummary(output, base, "6", "Class 6");
}

export function adaptClass7ToSummary(output: Class7ScoreOutput, base: AssessmentSummary): AssessmentSummary {
  return adaptClass67ToSummary(output, base, "7", "Class 7");
}

export function adaptClass8ToSummary(output: Class8ScoreOutput, base: AssessmentSummary): AssessmentSummary {
  const themes: ReportTheme[] = output.domainAffinities.map((d) => ({
    letter: d.domainCode,
    title: DOMAINS[d.domainCode]?.name ?? d.domain,
    score: d.affinity,
    meaning: d.reasoning[0] ?? "",
  }));

  const riasecRanked = output.riasecScores; // already sorted desc
  const riasecScores = output.riasecScores.map((r) => ({ letter: r.code, name: r.name, score: r.score }));
  const riasecCode = riasecRanked.slice(0, 3).map((r) => r.code).join("");

  const intelligenceRanked = output.strengthDomains.map((d) => ({ name: d.domain, score: d.score }));

  const topValues = output.motivators.map((m) => ({ tag: m.motivator, score: m.score }));

  // Class 8 uniquely has 4 named aptitude sub-scores. Labelled to match
  // AFFINITY's exact keyword vocabulary in lib/report/knowledge.ts
  // ("numerical"/"logical"/"spatial") so domainFit() can actually match them
  // - "Pattern Recognition" has no equivalent keyword there and simply
  // won't match any domain, which is honest since no domain names it as a
  // distinguishing signal.
  const ap = output.aptitudeProfile;
  const topAptitudes = [
    { skill: "Numerical", score: ap.numericReasoning.score },
    { skill: "Logical", score: ap.logicalDeduction.score },
    { skill: "Spatial", score: ap.spatialReasoning.score },
    { skill: "Pattern Recognition", score: ap.patternRecognition.score },
  ].sort((a, b) => b.score - a.score);

  const lsEntries = Object.entries(output.learningStyle.styleScores).sort((a, b) => b[1] - a[1]);
  const learningStyles = lsEntries.slice(0, 2).map(([name, score]) => ({ name, score }));

  const eiPct = Math.round(output.emotionalAwareness.reduce((s, e) => s + e.score, 0) / output.emotionalAwareness.length);
  const eiBreakdown = output.emotionalAwareness.map((e) => ({ name: e.component, score: e.score }));

  const strengthsScore = Math.round((intelligenceRanked[0]?.score ?? 0) * 0.6 + ap.overallScore * 0.4);

  const creativityAvg = Math.round(output.creativity.reduce((s, c) => s + c.score, 0) / output.creativity.length);

  const radar = [
    { key: "personality", label: "Personality", score: output.personalityProfile.score },
    { key: "career_interest", label: "Career Interest", score: riasecRanked[0]?.score ?? 0 },
    { key: "multiple_intelligence", label: "Multiple Intelligence", score: intelligenceRanked[0]?.score ?? 0 },
    { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiPct },
    { key: "learning_styles", label: "Learning Preferences", score: lsEntries[0]?.[1] ?? 0 },
    { key: "motivators", label: "Motivators", score: topValues[0]?.score ?? 0 },
    { key: "strengths", label: "Strengths", score: strengthsScore },
    { key: "aptitude", label: "Aptitude", score: Math.round(ap.overallScore) },
    { key: "creativity", label: "Creativity & Innovation", score: creativityAvg },
  ];

  const topDomain = output.domainAffinities[0];

  return {
    ...base,
    journeyCode: "8",
    journeyName: "Class 8",
    overallFitmentPct: topDomain?.affinity ?? null,
    topCareer: (topDomain ? DOMAINS[topDomain.domainCode]?.name : null) ?? topDomain?.domain ?? null,
    desiredCareer: null,
    desiredCareerFitPct: null,
    // class8Scoring.ts's own generateSummary() already produces a real,
    // specific paragraph - reuse it directly instead of writing a new one.
    summary: output.summary?.profileDescription || null,
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
    strengthsBreakdown: intelligenceRanked,
    aptitudePct: Math.round(ap.overallScore),
    mbtiEI: output.personalityProfile.axisScores.ei,
    mbtiSN: output.personalityProfile.axisScores.sn,
    mbtiTF: output.personalityProfile.axisScores.tf,
    mbtiJP: output.personalityProfile.axisScores.jp,
    radar,
    creativityDetail: creativityDetailFrom(output.creativity),
  };
}
