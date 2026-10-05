/**
 * Graduates (UG) Scoring Engine - the 8-pillar version.
 *
 * Scores the "OneGrasp Undergraduate Career Discovery & Goal-Fit Assessment"
 * (100 questions, 8 pillars; data/graduates/questions-corrected.json, stage
 * "ug"). Each question names its pillar (the bank category), its
 * sub-dimension (`sub`) and how it is scored:
 *   - "objective": aptitude items with one correct option (Pillar 3).
 *   - "weighted":  situational-judgement and readiness items; each option
 *                  carries a 0-3 weight for how strongly it shows the skill.
 *   - "nominal":   preferences with no better or worse answer; each option
 *                  names a `style`, reported as the sub-dimension's result.
 *
 * Options also carry evidence `tags` (mbti:, riasec:, mot:, str:) and some
 * weighted items name an EI quadrant (`ei`). These feed the derived profiles
 * the rest of the report already uses: MBTI type, RIASEC code, motivators,
 * strength areas and the four EI quadrants. Tags are not spread evenly across
 * the bank (e.g. Extraversion is offered more often than Introversion), so
 * every tag is scored as "times chosen / times offered", never as a raw count.
 *
 * Multiple Intelligence and Learning Style are not measured by this bank and
 * are deliberately not produced (no invented scores). Career-cluster matching
 * therefore uses RIASEC, strengths and motivators only.
 *
 * Career-role resolution stays in the report layer (careerFitGradSheets.tsx).
 */
import questionBank from "@/data/graduates/questions-corrected.json";
import type {
  PersonalityProfile, RIASECScore, StrengthDomainScore, MotivatorProfile, EIProfile,
} from "@/lib/newAssessment/scoring11_12";
import { CAREER_CLUSTERS_18, clusterForDegreeCourse } from "@/lib/report/careerClustersGrad";
import { degreeInfo } from "@/lib/report/degreeTaxonomyGrad";
import { deriveSkillEvidence, type SkillEvidenceGrad } from "@/lib/newAssessment/skillEvidenceGrad";
import { CLUSTER_SIGNATURE } from "@/lib/report/clusterSignatureGrad";

// ---------------------------------------------------------------- Pillars

export const UG_PILLARS = [
  { key: "ug_personality_behaviour", label: "Personality & Behaviour", short: "Personality" },
  { key: "ug_interests_motivation", label: "Interests & Motivation", short: "Interests" },
  { key: "ug_cognitive_capability", label: "Cognitive Capability", short: "Cognitive" },
  { key: "ug_academic_domain_fit", label: "Academic & Domain Fit", short: "Academic" },
  { key: "ug_human_professional_skills", label: "Human & Professional Skills", short: "Human Skills" },
  { key: "ug_digital_future_skills", label: "Digital & Future Skills", short: "Digital" },
  { key: "ug_career_readiness", label: "Career & Employability Readiness", short: "Readiness" },
  { key: "ug_future_adaptability", label: "Future Career Adaptability & Fit", short: "Adaptability" },
] as const;
export type UgPillarKey = (typeof UG_PILLARS)[number]["key"];

interface BankQuestion {
  docNo: number;
  sub: string;
  scoring: "objective" | "weighted" | "nominal";
  text: string;
  options: string[];
  correctIndex?: number;
  weights?: number[];
  style?: string[];
  tags?: string[][];
  ei?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QB = questionBank as any;
const BANK: Record<UgPillarKey, BankQuestion[]> = Object.fromEntries(
  UG_PILLARS.map((p) => [p.key, (QB[p.key]?.ug?.["Set 1"] ?? []) as BankQuestion[]])
) as Record<UgPillarKey, BankQuestion[]>;

// ---------------------------------------------------------------- Input shape

export interface GradDegreeFitContext {
  satisfactionSource: string;
  satisfactionScore: number; // 1-10, default 5
  reasons: string[];
}
export interface GradCareerClusterFitContext {
  topClusters: string[]; // up to 3, self-reported
  workTypePreference: string;
  confidence: number; // 1-10, default 5
  concerns: string[]; // up to 2
  decisionStage: string;
}

export interface GraduateResponse {
  /** Pillar key -> question index (as a string) -> chosen option index. */
  pillars: Partial<Record<UgPillarKey, Record<string, number>>>;
  degree_fit: GradDegreeFitContext;
  career_cluster_fit: GradCareerClusterFitContext;
  // From the pre-exam screen (NewExam.tsx "preinfo" phase, stage "ug").
  domain: string;
  degree: string;
  course: string;
  year: string;
  desiredCareer: string;
}

// ---------------------------------------------------------------- Output shape

export interface SubDimensionGrad {
  name: string;
  /** 0-100 for scored sub-dimensions; null when the sub-dimension is a pure preference. */
  score: number | null;
  /** The preference the student showed (nominal items), e.g. "Planner". */
  result: string | null;
  answered: number;
  total: number;
}

export interface PillarScoreGrad {
  key: UgPillarKey;
  label: string;
  short: string;
  /** 0-100 headline score. */
  score: number;
  /** What the headline score means for this pillar (e.g. "Profile clarity"). */
  scoreBasis: string;
  /** The specific result shown on the scorecard, e.g. "ENTJ" or "IAS". */
  result: string;
  subDimensions: SubDimensionGrad[];
}

export interface AptitudeSubdomainGrad {
  name: string;
  score: number;
  correct: number;
  total: number;
}

export interface AptitudeProfileGrad {
  subdomains: AptitudeSubdomainGrad[];
  overallScore: number;
  correct: number;
  total: number;
  strength: string;
  weakness: string;
}

export interface PsychometricProfileGrad {
  pillars: PillarScoreGrad[];
  personality: PersonalityProfile;
  riasec: RIASECScore[];
  aptitude: AptitudeProfileGrad;
  strengthDomains: StrengthDomainScore[];
  motivators: MotivatorProfile;
  emotionalIntelligence: EIProfile;
  /** Not measured by the 8-pillar bank; always empty. Kept so report pages that look items up by name simply find nothing. */
  multipleIntelligence: StrengthDomainScore[];
}

export interface ClusterAffinityGrad {
  cluster: string;
  computedScore: number; // 0-100, from RIASEC, strengths and motivators
  selfReported: boolean; // in the student's own top-3 pick (career_cluster_fit:0)
  blendedScore: number; // computedScore + a self-report bonus, used for ranking
}

export interface AcademicContextGrad {
  domain: string;
  degree: string;
  course: string;
  year: string;
  satisfactionSource: string;
  satisfactionScore: number;
  reasons: string[];
  entranceInfo: { duration: string; eligibility: string; entranceExams: string } | null;
}

export interface AspirationGrad {
  desiredCareer: string;
  workTypePreference: string;
  confidence: number;
  concerns: string[];
  decisionStage: string;
}

export interface GraduateScoreOutput {
  /** 2 = the 8-pillar assessment. Older records have no version and need a retake. */
  version: 2;
  layer1: PsychometricProfileGrad;
  clusterAffinities: ClusterAffinityGrad[];
  academicContext: AcademicContextGrad;
  aspiration: AspirationGrad;
  skillEvidence: SkillEvidenceGrad;
  summary: { topCluster: string; strengthsSummary: string; growthAreas: string[] };
}

// ---------------------------------------------------------------- Helpers

type Answers = Record<string, number>;
const pct = (got: number, of: number) => (of > 0 ? Math.round((got / of) * 100) : 0);
const chosenIndex = (answers: Answers | undefined, i: number): number | undefined => {
  const v = answers?.[String(i)];
  return typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : undefined;
};

/** Every tag's "chosen" and "offered" counts across the answered questions. */
function collectTags(responses: GraduateResponse) {
  const rates: { chosen: Record<string, number>; offered: Record<string, number> } = { chosen: {}, offered: {} };
  for (const p of UG_PILLARS) {
    const answers = responses.pillars[p.key];
    BANK[p.key].forEach((q, i) => {
      const idx = chosenIndex(answers, i);
      if (idx === undefined || !q.tags) return;
      // Count a tag as offered once per question, even if two options share it.
      const offeredHere = new Set(q.tags.flat());
      offeredHere.forEach((t) => { rates.offered[t] = (rates.offered[t] || 0) + 1; });
      (q.tags[idx] ?? []).forEach((t) => { rates.chosen[t] = (rates.chosen[t] || 0) + 1; });
    });
  }
  return rates;
}
const rateOf = (rates: ReturnType<typeof collectTags>, tag: string) =>
  rates.offered[tag] ? (rates.chosen[tag] || 0) / rates.offered[tag] : 0;

/** Most frequent style label(s) among a set of answered nominal items. */
function topStyle(labels: string[]): string | null {
  if (!labels.length) return null;
  const counts: Record<string, number> = {};
  labels.forEach((l) => { counts[l] = (counts[l] || 0) + 1; });
  const max = Math.max(...Object.values(counts));
  const tops = Object.keys(counts).filter((l) => counts[l] === max);
  return tops.length <= 2 ? tops.join(" & ") : "Balanced / no single preference";
}

// ---------------------------------------------------------------- Pillar scoring

interface SubTally { got: number; of: number; correct: number; objTotal: number; styles: string[]; answered: number; total: number }

function scorePillarSubs(key: UgPillarKey, answers: Answers | undefined): { subs: SubDimensionGrad[]; tallies: Record<string, SubTally> } {
  const order: string[] = [];
  const tallies: Record<string, SubTally> = {};
  BANK[key].forEach((q, i) => {
    if (!tallies[q.sub]) {
      tallies[q.sub] = { got: 0, of: 0, correct: 0, objTotal: 0, styles: [], answered: 0, total: 0 };
      order.push(q.sub);
    }
    const t = tallies[q.sub];
    t.total += 1;
    const idx = chosenIndex(answers, i);
    if (q.scoring === "objective") {
      t.objTotal += 1;
      if (idx !== undefined) t.answered += 1;
      if (idx !== undefined && idx === q.correctIndex) t.correct += 1;
      return;
    }
    if (idx === undefined || idx >= q.options.length) return;
    t.answered += 1;
    if (q.scoring === "weighted" && q.weights) {
      t.of += Math.max(...q.weights);
      t.got += q.weights[idx] ?? 0;
    } else if (q.scoring === "nominal" && q.style) {
      t.styles.push(q.style[idx]);
    }
  });
  const subs = order.map((name) => {
    const t = tallies[name];
    const score = t.objTotal ? pct(t.correct, t.objTotal) : t.of ? pct(t.got, t.of) : null;
    return { name, score, result: topStyle(t.styles), answered: t.answered, total: t.total };
  });
  return { subs, tallies };
}

function scorePersonality(rates: ReturnType<typeof collectTags>): PersonalityProfile {
  const axis = (a: string, b: string) => {
    const ra = rateOf(rates, `mbti:${a}`);
    const rb = rateOf(rates, `mbti:${b}`);
    const sum = ra + rb;
    // Share of the first letter, 0-1; 0.5 when neither side was chosen.
    const share = sum > 0 ? ra / sum : 0.5;
    return { winner: share >= 0.5 ? a : b, share, clarity: Math.abs(share - 0.5) * 2 };
  };
  const ei = axis("E", "I"), sn = axis("S", "N"), tf = axis("T", "F"), jp = axis("J", "P");
  const type = ei.winner + sn.winner + tf.winner + jp.winner;
  const clarity = (ei.clarity + sn.clarity + tf.clarity + jp.clarity) / 4;
  const toAxis10 = (share: number) => Math.round(share * 100) / 10;
  return {
    ei: ei.winner, sn: sn.winner, tf: tf.winner, jp: jp.winner, type,
    summary: `You lean ${type} - a mix of ${ei.winner === "E" ? "outward" : "inward"}-focused energy, ${sn.winner === "S" ? "practical, concrete" : "big-picture, conceptual"} thinking, ${tf.winner === "T" ? "logical" : "values-based"} decisions and a ${jp.winner === "J" ? "structured" : "flexible"} approach to plans.`,
    score: Math.round(clarity * 100),
    axisScores: { ei: toAxis10(ei.share), sn: toAxis10(sn.share), tf: toAxis10(tf.share), jp: toAxis10(jp.share) },
    // No question in this bank measures decision autonomy; neutral default.
    decisionAutonomy: 5,
  };
}

const RIASEC_NAMES: Record<string, string> = {
  R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional",
};
function scoreRIASEC(rates: ReturnType<typeof collectTags>): RIASECScore[] {
  const r = Object.keys(RIASEC_NAMES).map((code) => ({ code, rate: rateOf(rates, `riasec:${code}`), chosen: rates.chosen[`riasec:${code}`] || 0 }));
  const total = r.reduce((s, x) => s + x.rate, 0);
  return r
    .map((x) => ({ code: x.code, name: RIASEC_NAMES[x.code], score: x.chosen, percentile: total ? Math.round((x.rate / total) * 100) : 0 }))
    .sort((a, b) => b.percentile - a.percentile);
}

function scoreMotivators(rates: ReturnType<typeof collectTags>): MotivatorProfile {
  const tags = Object.keys(rates.offered).filter((t) => t.startsWith("mot:"));
  const withRate = tags.map((t) => ({ tag: t.slice(4), rate: rateOf(rates, t) })).filter((x) => x.rate > 0);
  const total = withRate.reduce((s, x) => s + x.rate, 0);
  const ranked = withRate
    .map((x) => ({ tag: x.tag, score: total ? Math.round((x.rate / total) * 100) : 0 }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  return {
    ranked,
    summary: top ? `${top.tag} came through most consistently across your answers.` : "Your motivators are fairly evenly spread.",
    score: top?.score ?? 0,
  };
}

const STRENGTH_AREA_EXAMPLES: Record<string, string[]> = {
  "Intellectual & Analytical": ["Root-cause analysis", "Logical troubleshooting", "Breaking down complexity"],
  "Creative & Innovative": ["Original ideas", "Unconventional angles", "Reframing problems"],
  "Strategic & Futuristic": ["Long-term planning", "Big-picture view", "Anticipating trends"],
  "Execution & Achievement": ["Turning ideas into results", "Consistent follow-through", "Getting things done"],
  "Influence & Leadership": ["Persuasion", "Taking ownership", "Motivating others"],
  "Relationship & Adaptability": ["Empathy", "Building rapport", "Adjusting to new situations"],
};
function scoreStrengthAreas(rates: ReturnType<typeof collectTags>): StrengthDomainScore[] {
  return Object.keys(STRENGTH_AREA_EXAMPLES)
    .map((domain) => ({ domain, score: Math.round(rateOf(rates, `str:${domain}`) * 100), examples: STRENGTH_AREA_EXAMPLES[domain] }))
    .sort((a, b) => b.score - a.score);
}

const EI_QUADRANTS = ["Self-Awareness", "Self-Management", "Social Awareness", "Relationship Management"] as const;
function scoreEI(responses: GraduateResponse): EIProfile {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  for (const p of UG_PILLARS) {
    const answers = responses.pillars[p.key];
    BANK[p.key].forEach((q, i) => {
      if (!q.ei || !q.weights) return;
      const idx = chosenIndex(answers, i);
      if (idx === undefined) return;
      of[q.ei] = (of[q.ei] || 0) + Math.max(...q.weights);
      got[q.ei] = (got[q.ei] || 0) + (q.weights[idx] ?? 0);
    });
  }
  const frac = (tag: string) => (of[tag] ? (got[tag] || 0) / of[tag] : 0);
  const ranked = EI_QUADRANTS.map((tag) => ({ tag, score: Math.round(frac(tag) * 100) })).sort((a, b) => b.score - a.score);
  const selfManagement = frac("Self-Management");
  const relationshipManagement = frac("Relationship Management");
  return {
    ranked,
    selfAwareness: frac("Self-Awareness"),
    selfManagement,
    socialAwareness: frac("Social Awareness"),
    relationshipManagement,
    emotionalRegulation: selfManagement >= 0.6 ? "You tend to steady yourself and adjust after setbacks." : "Setbacks can take a while to process - that's normal, and a skill you can build.",
    conflictResolution: relationshipManagement >= 0.6 ? "You actively work to understand and resolve tension with others." : "You tend to defend your position or step back before resolving tension.",
    summary: ranked[0] && ranked[0].score > 0 ? `${ranked[0].tag} is your strongest emotional-intelligence area.` : "Your responses are fairly balanced across all four areas.",
  };
}

function scoreAptitude(responses: GraduateResponse): AptitudeProfileGrad {
  const { subs, tallies } = scorePillarSubs("ug_cognitive_capability", responses.pillars.ug_cognitive_capability);
  const subdomains = subs.map((s) => ({ name: s.name, score: s.score ?? 0, correct: tallies[s.name].correct, total: tallies[s.name].objTotal }));
  const correct = subdomains.reduce((s, d) => s + d.correct, 0);
  const total = subdomains.reduce((s, d) => s + d.total, 0);
  const ranked = subdomains.slice().sort((a, b) => b.score - a.score);
  return {
    subdomains, correct, total,
    overallScore: pct(correct, total),
    strength: ranked[0]?.name ?? "",
    weakness: ranked[ranked.length - 1]?.name ?? "",
  };
}

/** Average of a pillar's scored sub-dimensions (weighted by their own max points, via the tallies). */
function weightedPillarScore(tallies: Record<string, SubTally>): number {
  const got = Object.values(tallies).reduce((s, t) => s + t.got, 0);
  const of = Object.values(tallies).reduce((s, t) => s + t.of, 0);
  return pct(got, of);
}

/** "Strongest: X" only when one area genuinely stands above the others. */
function bestScoredSub(subs: { name: string; score: number | null }[]): string {
  const scored = subs.filter((s) => s.score !== null).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (!scored.length) return "";
  const top = scored[0].score ?? 0;
  const lowest = scored[scored.length - 1].score ?? 0;
  if (top === 0 || top === lowest) return "";
  const tied = scored.filter((s) => s.score === top).map((s) => s.name);
  return tied.length === 1 ? `Strongest: ${tied[0]}` : tied.length === 2 ? `Strongest: ${tied.join(" & ")}` : "";
}

function buildPillars(responses: GraduateResponse, personality: PersonalityProfile, riasec: RIASECScore[], motivators: MotivatorProfile, aptitude: AptitudeProfileGrad, rates: ReturnType<typeof collectTags>): PillarScoreGrad[] {
  return UG_PILLARS.map((p) => {
    const { subs, tallies } = scorePillarSubs(p.key, responses.pillars[p.key]);
    let score: number;
    let scoreBasis: string;
    let result: string;
    switch (p.key) {
      case "ug_personality_behaviour":
        score = personality.score;
        scoreBasis = "Profile clarity: how consistently your answers point one way";
        result = personality.type;
        break;
      case "ug_interests_motivation": {
        const topRiasec = riasec[0] ? rateOf(rates, `riasec:${riasec[0].code}`) : 0;
        const topMot = motivators.ranked[0] ? rateOf(rates, `mot:${motivators.ranked[0].tag}`) : 0;
        score = Math.round(((topRiasec + topMot) / 2) * 100);
        scoreBasis = "Interest clarity: how consistently you chose your top interest and motivator";
        result = riasec.slice(0, 3).map((r) => r.code).join("") + (motivators.ranked[0] ? ` · ${motivators.ranked[0].tag}` : "");
        break;
      }
      case "ug_cognitive_capability":
        score = aptitude.overallScore;
        scoreBasis = `${aptitude.correct} of ${aptitude.total} reasoning questions correct`;
        result = bestScoredSub(aptitude.subdomains.filter((s) => s.total).map((s) => ({ name: s.name, score: s.score }))) || `${aptitude.correct} of ${aptitude.total} correct`;
        break;
      default:
        score = weightedPillarScore(tallies);
        scoreBasis = "Share of the strongest-practice points available in this pillar";
        result = bestScoredSub(subs) || `${score}%`;
    }
    return { key: p.key, label: p.label, short: p.short, score, scoreBasis, result, subDimensions: subs };
  });
}

// ---------------------------------------------------------------- Cluster affinity
// RIASEC (25%), Strengths (15%) and Motivators (15%) against each cluster's
// signature (lib/report/clusterSignatureGrad.ts), coverage-normalised so the
// weights sum to 1. Multiple Intelligence (10% in the original formula) is not
// measured by the 8-pillar bank and is left out rather than guessed.
const CLUSTER_WEIGHTS = { riasec: 0.25, strengths: 0.15, motivators: 0.15 };

function computeClusterAffinities(
  riasec: RIASECScore[],
  strengthDomains: StrengthDomainScore[],
  motivators: MotivatorProfile,
  selfReported: string[]
): ClusterAffinityGrad[] {
  const riasecPct = Object.fromEntries(riasec.map((r) => [r.code, r.percentile]));
  const strengthPct = Object.fromEntries(strengthDomains.map((s) => [s.domain, s.score]));
  const motivatorPct = Object.fromEntries(motivators.ranked.map((m) => [m.tag, m.score]));
  const avg = (vals: number[]) => (vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0);
  const selfReportedSet = new Set(selfReported);

  return CAREER_CLUSTERS_18
    .map((cluster) => {
      const sig = CLUSTER_SIGNATURE[cluster];
      const parts: [number, number][] = [];
      if (sig) {
        parts.push([avg(sig.riasec.map((c) => riasecPct[c] || 0)), CLUSTER_WEIGHTS.riasec]);
        if (sig.strengths.length) parts.push([avg(sig.strengths.map((s) => strengthPct[s] || 0)), CLUSTER_WEIGHTS.strengths]);
        if (sig.motivators.length) parts.push([avg(sig.motivators.map((m) => motivatorPct[m] || 0)), CLUSTER_WEIGHTS.motivators]);
      }
      const denom = parts.reduce((s, [, w]) => s + w, 0);
      const computedScore = denom ? Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / denom) : 0;
      const isSelfReported = selfReportedSet.has(cluster);
      return { cluster, computedScore, selfReported: isSelfReported, blendedScore: Math.min(100, computedScore + (isSelfReported ? 15 : 0)) };
    })
    .sort((a, b) => b.blendedScore - a.blendedScore);
}

export interface SuitableClusterGrad extends ClusterAffinityGrad {
  suitabilityScore: number;
}

/**
 * Career Suitability - anchored to what's actually reachable from the
 * student's real degree+course, not just whichever cluster the psychometric
 * profile happens to score highest on (that's Fitment/clusterAffinities
 * itself, which ignores degree entirely by design).
 *
 * The student's own degree cluster is guaranteed the #1 slot (when
 * resolvable); its score shown is still the real, unmodified blendedScore.
 * The remaining clusters are ranked below it by blendedScore. This is the
 * single source of truth for "the student's top Suitability cluster".
 */
export function rankSuitabilityGrad(clusterAffinities: ClusterAffinityGrad[], degree: string, course: string): SuitableClusterGrad[] {
  const degreeCluster = clusterForDegreeCourse(degree, course);
  const byBlendedScore = (a: ClusterAffinityGrad, b: ClusterAffinityGrad) => b.blendedScore - a.blendedScore;
  if (!degreeCluster) {
    return [...clusterAffinities].sort(byBlendedScore).map((c) => ({ ...c, suitabilityScore: c.blendedScore }));
  }
  return [
    ...clusterAffinities.filter((c) => c.cluster === degreeCluster).map((c) => ({ ...c, suitabilityScore: c.blendedScore })),
    ...clusterAffinities.filter((c) => c.cluster !== degreeCluster).sort(byBlendedScore).map((c) => ({ ...c, suitabilityScore: c.blendedScore })),
  ];
}

// ---------------------------------------------------------------- Entry point

export function scoreGraduateAssessment(responses: GraduateResponse): GraduateScoreOutput {
  const rates = collectTags(responses);
  const personality = scorePersonality(rates);
  const riasec = scoreRIASEC(rates);
  const motivators = scoreMotivators(rates);
  const strengthDomains = scoreStrengthAreas(rates);
  const emotionalIntelligence = scoreEI(responses);
  const aptitude = scoreAptitude(responses);
  const pillars = buildPillars(responses, personality, riasec, motivators, aptitude, rates);

  const layer1: PsychometricProfileGrad = {
    pillars, personality, riasec, aptitude, strengthDomains, motivators, emotionalIntelligence, multipleIntelligence: [],
  };

  const clusterAffinities = computeClusterAffinities(riasec, strengthDomains, motivators, responses.career_cluster_fit.topClusters);
  const suitabilityRanked = rankSuitabilityGrad(clusterAffinities, responses.degree, responses.course);
  const topCluster = suitabilityRanked[0]?.cluster ?? "";

  const info = degreeInfo(responses.degree);
  const academicContext: AcademicContextGrad = {
    domain: responses.domain, degree: responses.degree, course: responses.course, year: responses.year,
    satisfactionSource: responses.degree_fit.satisfactionSource,
    satisfactionScore: responses.degree_fit.satisfactionScore,
    reasons: responses.degree_fit.reasons,
    entranceInfo: info ? { duration: info.duration, eligibility: info.eligibility, entranceExams: info.entranceExams } : null,
  };

  const aspiration: AspirationGrad = {
    desiredCareer: responses.desiredCareer,
    workTypePreference: responses.career_cluster_fit.workTypePreference,
    confidence: responses.career_cluster_fit.confidence,
    concerns: responses.career_cluster_fit.concerns,
    decisionStage: responses.career_cluster_fit.decisionStage,
  };

  // Growth areas: the two lowest-scoring skill pillars (3-8). Pillars 1-2 are
  // preference profiles, where a lower "clarity" isn't a weakness.
  const growthAreas = pillars.slice(2).slice().sort((a, b) => a.score - b.score).slice(0, 2).map((p) => p.label);
  const topStrength = strengthDomains[0];

  return {
    version: 2,
    layer1,
    clusterAffinities,
    academicContext,
    aspiration,
    skillEvidence: deriveSkillEvidence(layer1),
    summary: {
      topCluster,
      strengthsSummary: topStrength && topStrength.score > 0 ? `${topStrength.domain} stood out most across your answers.` : "Your strengths are fairly evenly spread.",
      growthAreas,
    },
  };
}
