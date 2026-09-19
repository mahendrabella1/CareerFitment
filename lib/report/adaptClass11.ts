/**
 * Adapts a Class 11-12 score output (scoring11_12.ts's own 4-layer shape)
 * into the AssessmentSummary shape FullReport.tsx already renders for class
 * 9-10 — so Class 11-12 gets the exact same report code, CSS and images
 * instead of a separately designed report that inevitably drifts from it.
 *
 * Where the two assessments measure genuinely different things (Class 11-12
 * has no independent Big-Five personality read, and 9-10 has no notion of a
 * "current stream" or "primary career goal"), the mapping favours whichever
 * FullReport.tsx already has a real fallback for, documented inline.
 */
import type { AssessmentSummary, ReportTheme } from "@/lib/auth/AuthProvider";
import type { Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";
import { DOMAINS } from "@/lib/report/knowledge";

/**
 * True only for output produced by the CURRENT scoring11_12.ts — a student
 * who completed the assessment before the question-bank/scoring rewrite has
 * a `class11Output` shaped like the old engine (motivators as 4 named dyad
 * fields, aptitude as 5 differently-named sub-scores, no `ranked` arrays).
 * That old data isn't just missing a few fields — it was scored by the
 * fake/hardcoded logic this whole rework replaced, so partially rendering
 * it would show stale, no-longer-true numbers rather than just gaps.
 * Dashboard.tsx checks this before calling the adapter at all, and asks the
 * student to retake the assessment instead of guessing at a broken shape.
 */
export function isCurrentClass11Shape(output: unknown): output is Class11ScoreOutput {
  const l1 = (output as any)?.layer1;
  return Boolean(l1?.motivators?.ranked) && Boolean(l1?.aptitude?.numerical) && Boolean(l1?.emotionalIntelligence?.ranked)
    // learningStyle.ranked was added after this shape check already existed
    // (see adaptClass11ToSummary's learningStyles below) — a report scored
    // before that change has the old primaryStyle/secondaryStyle-only shape
    // and would otherwise pass every check here, reach the adapter anyway,
    // and crash on `l1.learningStyle.ranked.map(...)`.
    && Boolean(l1?.learningStyle?.ranked);
}

export function adaptClass11ToSummary(output: Class11ScoreOutput, base: AssessmentSummary): AssessmentSummary {
  const l1 = output.layer1;

  // Best-fit domains. FullReport.tsx's own domainFit() recomputes the actual
  // displayed fit% from interest + aptitude/MI/value keyword matches (see
  // lib/report/knowledge.ts) rather than trusting this number directly — so
  // this is deliberately the domain's raw affinity/interest signal, not a
  // final score, exactly as class 9-10's own `themes` field is.
  //
  // Title uses the SHARED DOMAINS catalogue's name, not scoring11_12.ts's
  // own DOMAIN_NAMES_11_12 — the two disagree for F/G/H (e.g. F is "Law,
  // Social Services & Public Policy" in one and "Human & Public Services" in
  // the other). Domain *cards* already render DOMAINS[letter] directly, so
  // using the other label here would make the career-interest page and the
  // domain cards name the same lettered domain two different things.
  const themes: ReportTheme[] = output.domainAffinities.map((d) => ({
    letter: d.domain,
    title: DOMAINS[d.domain]?.name ?? d.domainName,
    score: d.affinity,
    meaning: d.reasoning[0] ?? "",
  }));

  const riasecRanked = l1.riasec.slice().sort((a, b) => b.percentile - a.percentile);
  const riasecScores = l1.riasec.map((r) => ({ letter: r.code, name: r.name, score: r.percentile }));
  const riasecCode = riasecRanked.slice(0, 3).map((r) => r.code).join("");

  // "Strength Domains & Multiple Intelligences" is one combined dimension in
  // the 11-12 bank — fed into both the multiple_intelligence AND strengths
  // slots (9-10 measures those as two separate things; 11-12 doesn't), each
  // page framing the same ranked list differently (intelligences vs. default
  // working style) rather than inventing a second, unmeasured concept.
  const intelligenceRanked = l1.strengthDomains
    .slice()
    .sort((a, b) => b.score - a.score)
    .map((d) => ({ name: d.domain, score: Math.round((d.score / 5) * 100) }));

  const topValues = l1.motivators.ranked.map((m) => ({ tag: m.tag, score: m.score }));

  const ap = l1.aptitude;
  const topAptitudes = [
    { skill: "Numerical", score: ap.numerical.score },
    { skill: "Logical", score: ap.logical.score },
    { skill: "Verbal", score: ap.verbal.score },
    { skill: "Abstract/Pattern", score: ap.abstractPattern.score },
    { skill: "Spatial", score: ap.spatial.score },
    { skill: "Data Interpretation", score: ap.dataInterpretation.score },
  ].sort((a, b) => b.score - a.score);

  // All 4 VARK-style dimensions with their real tallied scores — used to
  // only pass primary+secondary with a guessed "-20" number for the second,
  // silently dropping the other two the student actually has real data for.
  const learningStyles = l1.learningStyle.ranked.map((r) => ({ name: r.style, score: r.score }));

  const eiPct = Math.round(((l1.emotionalIntelligence.selfAwareness + l1.emotionalIntelligence.socialAwareness) / 2) * 100);
  const eiBreakdown = [
    { name: "Self-Awareness", score: Math.round(l1.emotionalIntelligence.selfAwareness * 100) },
    { name: "Social Awareness", score: Math.round(l1.emotionalIntelligence.socialAwareness * 100) },
  ];

  // "Strengths" and "Multiple Intelligence" share the same underlying
  // strengthDomains data (see comment above), but showing the identical
  // number on both dimension cards would read as a copy-paste bug rather
  // than an honest reuse. This blends it with aptitude — "how you naturally
  // work" as a mix of raw reasoning ability and your leading intelligence —
  // a real, different, still-fully-explainable number, not a fabricated one.
  const strengthsScore = Math.round((intelligenceRanked[0]?.score ?? 0) * 0.6 + ap.overallScore * 0.4);

  const radar = [
    { key: "personality", label: "Personality", score: l1.personality.score },
    { key: "career_interest", label: "Career Interest", score: Math.round(riasecRanked[0]?.percentile ?? 0) },
    { key: "multiple_intelligence", label: "Multiple Intelligence", score: intelligenceRanked[0]?.score ?? 0 },
    { key: "emotional_intelligence", label: "Emotional Intelligence", score: eiPct },
    { key: "learning_styles", label: "Learning Preferences", score: l1.learningStyle.score },
    { key: "motivators", label: "Motivators", score: l1.motivators.score },
    { key: "strengths", label: "Strengths", score: strengthsScore },
    { key: "aptitude", label: "Aptitude", score: Math.round(ap.overallScore) },
    // A ninth dimension 9-10 doesn't have — FullReport.tsx only renders it
    // when this key is present, so class 9-10's own report is untouched.
    { key: "creativity", label: "Creativity & Innovation", score: Math.min(100, Math.round((l1.creativity.score / 5) * 100)) },
  ];

  return {
    ...base,
    // journeyCode/journeyName come from `base` as-is — score/route.ts's
    // baseSummary() already sets the right one ("11", "12" or the legacy
    // combined "11-12"), so this adapter doesn't need to know which class
    // the student is actually in.
    overallFitmentPct: output.layer4.alignment.overallFitment,
    topCareer: (output.domainAffinities[0] ? DOMAINS[output.domainAffinities[0].domain]?.name : null) ?? output.domainAffinities[0]?.domainName ?? null,
    desiredCareer: output.layer4.primaryCareerGoal || null,
    desiredCareerFitPct: output.layer4.alignment.psychometricAlignment ?? null,
    summary: l1.personality.summary || null,
    matches: [],
    // Big-Five sub-trait scores don't exist for an MBTI-scored personality —
    // left empty so FullReport falls back cleanly rather than fabricating
    // Big-Five numbers from data that was never collected.
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
    // Real per-axis MBTI scores — this is what makes FullReport.tsx render
    // the actual compass + type instead of the generic "not measured" text.
    mbtiEI: l1.personality.axisScores.ei,
    mbtiSN: l1.personality.axisScores.sn,
    mbtiTF: l1.personality.axisScores.tf,
    mbtiJP: l1.personality.axisScores.jp,
    radar,
    creativityDetail: {
      problemSolving: l1.creativity.problemSolving,
      innovationApproach: l1.creativity.innovationApproach,
      recommendations: l1.creativity.recommendations,
    },
  };
}
