/**
 * Graduates (UG) Scoring Engine.
 *
 * Mirrors scoring11_12.ts's technique for the 8 core psychometric
 * dimensions (mapping-tagged forced-choice tallying via tallyMapped/
 * tallyDomainAvailability) against the dedicated Graduates bank
 * (data/graduates/questions-corrected.json, stage "ug"), then replaces
 * 11-12's stream-gated layer2/3/4 (which assumes the student hasn't
 * chosen a degree yet) with three Graduates-appropriate outputs: a
 * cluster-affinity ranking across the 18 real career clusters, the
 * student's actual academic context (already known - they typed their
 * exact degree/course/year pre-exam, no stream-eligibility guessing
 * needed), and their stated aspiration. Career-role resolution (matching
 * the student's typed desired career against CAREERS_1112/Excel roles for
 * the report's roadmap) deliberately stays out of this file, the same way
 * scoring11_12.ts itself never resolves findCareer1112() - that's the
 * report layer's job (careerFitGradSheets.tsx, Phase C), consistent with
 * how selectCareer1112() lives in careerFitEngine1112.ts, not here.
 */
import questionBank from "@/data/graduates/questions-corrected.json";
import type {
  PersonalityProfile, RIASECScore, StrengthDomainScore, MotivatorProfile, LearningStyleProfile, EIProfile,
} from "@/lib/newAssessment/scoring11_12";
import { CAREER_CLUSTERS_18, clusterForDegreeCourse } from "@/lib/report/careerClustersGrad";
import { degreeInfo } from "@/lib/report/degreeTaxonomyGrad";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QB = questionBank as any;
const Q = {
  personality: (QB.personality?.ug?.["Set 1"] ?? []) as any[],
  career_interest: (QB.career_interest?.ug?.["Set 1"] ?? []) as any[],
  aptitude: (QB.aptitude?.ug?.["Set 1"] ?? []) as any[],
  strengths: (QB.strengths?.ug?.["Set 1"] ?? []) as any[],
  motivators: (QB.motivators?.ug?.["Set 1"] ?? []) as any[],
  learning_styles: (QB.learning_styles?.ug?.["Set 1"] ?? []) as any[],
  emotional_intelligence: (QB.emotional_intelligence?.ug?.["Set 1"] ?? []) as any[],
  multiple_intelligence: (QB.multiple_intelligence?.ug?.["Set 1"] ?? []) as any[],
};

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
  personality: Record<string, number>;
  career_interest: Record<string, number>;
  aptitude: Record<string, number>;
  strengths: Record<string, number>;
  motivators: Record<string, number>;
  learning_styles: Record<string, number>;
  emotional_intelligence: Record<string, number>;
  // Q0-2 are single-select (number); Q3 is "select up to TWO" (number[]).
  multiple_intelligence: Record<string, number | number[]>;
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

export interface AptitudeProfileGrad {
  numerical: { score: number; correct: number; total: number };
  verbal: { score: number; correct: number; total: number };
  logical: { score: number; correct: number; total: number };
  criticalThinking: { score: number; correct: number; total: number };
  dataInterpretation: { score: number; correct: number; total: number };
  decisionMaking: { score: number; correct: number; total: number };
  overallScore: number;
  strength: string;
  weakness: string;
}

export interface PsychometricProfileGrad {
  personality: PersonalityProfile;
  riasec: RIASECScore[];
  aptitude: AptitudeProfileGrad;
  strengthDomains: StrengthDomainScore[];
  multipleIntelligence: StrengthDomainScore[];
  motivators: MotivatorProfile;
  learningStyle: LearningStyleProfile;
  emotionalIntelligence: EIProfile;
}

export interface ClusterAffinityGrad {
  cluster: string;
  computedScore: number; // 0-100, from the student's RIASEC profile
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
  layer1: PsychometricProfileGrad;
  clusterAffinities: ClusterAffinityGrad[];
  academicContext: AcademicContextGrad;
  aspiration: AspirationGrad;
  summary: { topCluster: string; strengthsSummary: string; growthAreas: string[] };
}

// ---------------------------------------------------------------- Dimension scoring
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tallyMapped(questions: any[], responses: Record<string, number>): Record<string, number> {
  const tally: Record<string, number> = {};
  questions.forEach((q, i) => {
    const idx = responses[String(i)];
    const tag = Array.isArray(q.mapping) ? q.mapping[idx] : undefined;
    if (tag) tally[tag] = (tally[tag] || 0) + 1;
  });
  return tally;
}

// Generalized over tallyDomainAvailability (scoring11_12.ts): a question's
// answer may be a single index (forced-choice) or an array of indices
// (multi-select, e.g. multiple_intelligence:3's "select up to TWO") - both
// count every mapped domain toward `of`, and only the actually-picked
// index/indices toward `got`.
function tallyDomainAvailability(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[],
  responses: Record<string, number | number[]>
): { got: Record<string, number>; of: Record<string, number> } {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  questions.forEach((q, i) => {
    const idx = responses[String(i)];
    if (!Array.isArray(q.mapping)) return;
    const picked = Array.isArray(idx) ? new Set(idx) : new Set(typeof idx === "number" ? [idx] : []);
    q.mapping.forEach((domain: string, optIdx: number) => {
      of[domain] = (of[domain] || 0) + 1;
      if (picked.has(optIdx)) got[domain] = (got[domain] || 0) + 1;
    });
  });
  return { got, of };
}

function scorePersonality(responses: Record<string, number>): PersonalityProfile {
  const tally = tallyMapped(Q.personality, responses);
  const decisionAutonomy = responses["6"] ?? 5;
  const ei = (tally.E || 0) - (tally.I || 0);
  const sn = (tally.S || 0) - (tally.N || 0);
  const tf = (tally.T || 0) - (tally.F || 0);
  const jp = (tally.J || 0) - (tally.P || 0);
  const traits = {
    ei: ei >= 0 ? "E" : "I", sn: sn >= 0 ? "S" : "N", tf: tf >= 0 ? "T" : "F", jp: jp >= 0 ? "J" : "P",
    type: (ei >= 0 ? "E" : "I") + (sn >= 0 ? "S" : "N") + (tf >= 0 ? "T" : "F") + (jp >= 0 ? "J" : "P"),
  };
  const maxOf = (a: string, b: string) => Math.max(1, (tally[a] || 0) + (tally[b] || 0));
  const clarity = (
    Math.abs(ei) / maxOf("E", "I") + Math.abs(sn) / maxOf("S", "N") +
    Math.abs(tf) / maxOf("T", "F") + Math.abs(jp) / maxOf("J", "P")
  ) / 4;
  const toAxis10 = (tallyVal: number, maxMag: number) => {
    const winCount = (maxMag + tallyVal) / 2;
    const prior = 1;
    const share = (winCount + prior / 2) / (maxMag + prior);
    const winnerScore = 5 + share * 5;
    return tallyVal >= 0 ? Math.round(winnerScore * 10) / 10 : Math.round((10 - winnerScore) * 10) / 10;
  };
  return {
    ...traits,
    summary: `You lean ${traits.type} - a mix of ${traits.ei === "E" ? "outward" : "inward"}-focused energy, ${traits.sn === "S" ? "practical, concrete" : "big-picture, conceptual"} thinking, ${traits.tf === "T" ? "logical" : "values-based"} decisions and a ${traits.jp === "J" ? "structured" : "flexible"} approach to plans.`,
    score: Math.round(clarity * 100),
    axisScores: {
      ei: toAxis10(ei, maxOf("E", "I")), sn: toAxis10(sn, maxOf("S", "N")),
      tf: toAxis10(tf, maxOf("T", "F")), jp: toAxis10(jp, maxOf("J", "P")),
    },
    decisionAutonomy,
  };
}

const RIASEC_NAMES: Record<string, string> = {
  R: "Realistic", I: "Investigative", A: "Artistic", S: "Social", E: "Enterprising", C: "Conventional",
};
function scoreRIASEC(responses: Record<string, number>): RIASECScore[] {
  const tally = tallyMapped(Q.career_interest, responses);
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  return Object.keys(RIASEC_NAMES)
    .map((code) => ({
      code, name: RIASEC_NAMES[code], score: tally[code] || 0,
      percentile: total ? Math.round(((tally[code] || 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);
}

const APTITUDE_FIELDS: { key: keyof Omit<AptitudeProfileGrad, "overallScore" | "strength" | "weakness">; subdomain: string; label: string }[] = [
  { key: "numerical", subdomain: "Numerical Reasoning", label: "Numerical" },
  { key: "verbal", subdomain: "Verbal Reasoning", label: "Verbal" },
  { key: "logical", subdomain: "Logical Reasoning", label: "Logical" },
  { key: "criticalThinking", subdomain: "Critical Thinking", label: "Critical Thinking" },
  { key: "dataInterpretation", subdomain: "Data Interpretation", label: "Data Interpretation" },
  { key: "decisionMaking", subdomain: "Decision-Making", label: "Decision-Making" },
];
function scoreAptitude(responses: Record<string, number>): AptitudeProfileGrad {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  Q.aptitude.forEach((q, i) => {
    const sub = String(q.subdomain || "");
    if (!sub) return;
    of[sub] = (of[sub] || 0) + 1;
    if (responses[String(i)] === q.correctIndex) got[sub] = (got[sub] || 0) + 1;
  });
  const fields = Object.fromEntries(
    APTITUDE_FIELDS.map(({ key, subdomain }) => {
      const total = of[subdomain] || 0;
      const correct = got[subdomain] || 0;
      const score = total ? Math.round((correct / total) * 100) : 0;
      return [key, { score, correct, total }];
    })
  ) as Record<string, { score: number; correct: number; total: number }>;
  const totalCorrect = Object.values(got).reduce((s, v) => s + v, 0);
  const totalQs = Q.aptitude.length;
  const overallScore = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;
  const ranked = APTITUDE_FIELDS.map(({ key, label }) => ({ label, score: fields[key].score })).sort((a, b) => b.score - a.score);
  return {
    ...(fields as unknown as Omit<AptitudeProfileGrad, "overallScore" | "strength" | "weakness">),
    overallScore,
    strength: ranked[0]?.label ?? "Numerical",
    weakness: ranked[ranked.length - 1]?.label ?? "Numerical",
  };
}

const MI_EXAMPLES: Record<string, string[]> = {
  "Linguistic": ["Writing", "Communication", "Language"],
  "Logical-Mathematical": ["Problem-solving", "Analysis", "Patterns"],
  "Spatial": ["Visualization", "Design", "Navigation"],
  "Bodily-Kinesthetic": ["Physical activity", "Coordination", "Crafts"],
  "Musical": ["Rhythm", "Music", "Melody"],
  "Interpersonal": ["Teamwork", "Leadership", "Communication"],
  "Intrapersonal": ["Self-reflection", "Meditation", "Analysis"],
  "Naturalistic": ["Nature", "Observation", "Patterns"],
};
const STRENGTH_AREA_EXAMPLES: Record<string, string[]> = {
  "Intellectual & Analytical": ["Root-cause analysis", "Logical troubleshooting", "Breaking down complexity"],
  "Creative & Innovative": ["Original ideas", "Unconventional angles", "Reframing problems"],
  "Strategic & Futuristic": ["Long-term planning", "Big-picture view", "Anticipating trends"],
  "Execution & Achievement": ["Turning ideas into results", "Consistent follow-through", "Getting things done"],
  "Influence & Leadership": ["Persuasion", "Taking ownership", "Motivating others"],
  "Relationship & Adaptability": ["Empathy", "Building rapport", "Adjusting to new situations"],
};

function scoreStrengthAreas(responses: Record<string, number>): StrengthDomainScore[] {
  const { got, of } = tallyDomainAvailability(Q.strengths, responses);
  return Object.keys(STRENGTH_AREA_EXAMPLES)
    .map((domain) => ({
      domain, score: of[domain] ? Math.round(((got[domain] || 0) / of[domain]) * 5 * 10) / 10 : 0,
      examples: STRENGTH_AREA_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMultipleIntelligence(responses: Record<string, number | number[]>): StrengthDomainScore[] {
  const { got, of } = tallyDomainAvailability(Q.multiple_intelligence, responses);
  return Object.keys(MI_EXAMPLES)
    .map((domain) => ({
      domain, score: of[domain] ? Math.round(((got[domain] || 0) / of[domain]) * 5 * 10) / 10 : 0,
      examples: MI_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Record<string, number>): MotivatorProfile {
  const tally = tallyMapped(Q.motivators, responses);
  // Q4/Q5/Q8 (indices 4, 5, 8) are plain 1-10 sliders, not mapped options -
  // see build_ug_bank.py: financial security -> "Security", meaningful work
  // -> "Mastery" (the closest existing tag to "intellectually engaging"),
  // leadership-under-pressure -> "Leadership".
  const financialSecurity = responses["4"];
  if (typeof financialSecurity === "number") tally["Security"] = (tally["Security"] || 0) + financialSecurity / 10;
  const meaningfulWork = responses["5"];
  if (typeof meaningfulWork === "number") tally["Mastery"] = (tally["Mastery"] || 0) + meaningfulWork / 10;
  const leadershipUnderPressure = responses["8"];
  if (typeof leadershipUnderPressure === "number") tally["Leadership"] = (tally["Leadership"] || 0) + leadershipUnderPressure / 10;
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  const ranked = Object.entries(tally)
    .map(([tag, count]) => ({ tag, score: total ? Math.round((count / total) * 100) : 0 }))
    .sort((a, b) => b.score - a.score);
  const top = ranked[0];
  return {
    ranked,
    summary: top ? `${top.tag} came through most consistently across your answers.` : "Your motivators are fairly evenly spread.",
    score: top?.score ?? 0,
  };
}

function scoreLearningStyle(responses: Record<string, number>): LearningStyleProfile {
  const tally = tallyMapped(Q.learning_styles, responses);
  // Q2 (index 2, "prefer theory before applying it") is a slider - a low
  // score (prefers applying over theory) is a fractional vote for
  // Kinesthetic; Q4 (index 4, feedback usefulness) is left unmapped, same
  // as 11-12's own equivalent slider.
  const theoryPreference = responses["2"];
  if (typeof theoryPreference === "number") tally["Kinesthetic"] = (tally["Kinesthetic"] || 0) + (10 - theoryPreference) / 10;
  const styles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"];
  const ranked = styles.slice().sort((a, b) => (tally[b] || 0) - (tally[a] || 0));
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  const pctOf = (style: string) => (total > 0 ? Math.round(((tally[style] || 0) / total) * 100) : 25);
  return {
    primaryStyle: ranked[0],
    secondaryStyle: ranked[1],
    examPreparationTechnique: `Lean on ${ranked[0].toLowerCase()} techniques - they consistently came through as your preference.`,
    recommendations: [`Practice with ${ranked[0].toLowerCase()}-first materials`, `Use ${ranked[1].toLowerCase()} techniques as a backup`],
    score: total > 0 ? Math.round(((tally[ranked[0]] || 0) / total) * 100) : 50,
    ranked: ranked.map((style) => ({ style, score: pctOf(style) })),
  };
}

const EI_QUADRANT_TAGS = ["Self-Awareness", "Self-Management", "Social Awareness", "Relationship Management"] as const;
function scoreEI(responses: Record<string, number>): EIProfile {
  const tally = tallyMapped(Q.emotional_intelligence, responses);
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  const ranked = EI_QUADRANT_TAGS
    .map((tag) => ({ tag, score: total ? Math.round(((tally[tag] || 0) / total) * 100) : 0 }))
    .sort((a, b) => b.score - a.score);
  const frac = (tag: string) => (total ? (tally[tag] || 0) / total : 0.25);
  const selfAwareness = frac("Self-Awareness");
  const selfManagement = frac("Self-Management");
  const socialAwareness = frac("Social Awareness");
  const relationshipManagement = frac("Relationship Management");
  return {
    ranked, selfAwareness, selfManagement, socialAwareness, relationshipManagement,
    emotionalRegulation: selfManagement >= 0.3 ? "You tend to steady yourself quickly under pressure." : "Strong feelings can take a while to settle for you - that's normal, not a weakness.",
    conflictResolution: relationshipManagement >= 0.3 ? "You actively work to resolve tension with others." : "You tend to process conflict internally before addressing it.",
    summary: ranked[0] && ranked[0].score > 0 ? `${ranked[0].tag} is your strongest tendency under pressure or feedback.` : "Your responses are fairly balanced across all four areas.",
  };
}

// ---------------------------------------------------------------- Cluster affinity
// A hand-tagged, reasonable (not empirically validated - same rigor level
// as CAREERS_1112's own riasec tags) signature per cluster, used to
// translate the student's own measured profile into a cluster ranking.
//
// Deliberately blends THREE dimensions (RIASEC + Strength Domains +
// Multiple Intelligence), not RIASEC alone: RIASEC only has 6 letters
// spread across 18 clusters, so a signature built from 1-2 RIASEC letters
// alone put the same letter ("R") as the dominant signal for 7 unrelated
// clusters (Engineering, Sports, Agriculture, Environment, Architecture,
// Manufacturing, Defence) - any R-leaning student saw several of those
// simultaneously inflated, with basically arbitrary tie-breaks deciding
// which one "won" Suitability, including clusters with no real connection
// to the student's actual degree. Layering in each cluster's own
// distinguishing Strengths/MI signal (e.g. Sports leans Bodily-Kinesthetic,
// Architecture leans Spatial+Creative, Defence leans Leadership) fixes that
// even where the RIASEC letters still overlap.
//
// This is still a CLUSTER-level signature, not a per-role one - 11-12's
// system computes fit per individual career (each with its own real
// riasec/mi/aptitude tags) and only aggregates up to cluster level after.
// Building an equivalent per-role signature for Graduates would mean
// tagging ~3,300 Excel roles individually, which isn't done here (would
// need either fabricating thousands of tags or a much larger research
// pass) - flagged as a real fidelity gap versus 11-12, not hidden.
const CLUSTER_SIGNATURE: Record<string, { riasec: string[]; strengths: string[]; mi: string[] }> = {
  "Engineering, Technology & Computing": { riasec: ["R", "I"], strengths: ["Intellectual & Analytical", "Execution & Achievement"], mi: ["Logical-Mathematical", "Spatial"] },
  "Science, Mathematics & Research": { riasec: ["I"], strengths: ["Intellectual & Analytical"], mi: ["Logical-Mathematical", "Intrapersonal"] },
  "Healthcare & Medicine": { riasec: ["I", "S"], strengths: ["Relationship & Adaptability", "Intellectual & Analytical"], mi: ["Interpersonal", "Bodily-Kinesthetic"] },
  "Psychology, Humanities & Social Sciences": { riasec: ["S", "I"], strengths: ["Relationship & Adaptability"], mi: ["Interpersonal", "Intrapersonal", "Linguistic"] },
  "Sports, Fitness & Human Performance": { riasec: ["R", "S"], strengths: ["Execution & Achievement"], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
  "Agriculture, Food & Life Sciences": { riasec: ["R", "I"], strengths: ["Execution & Achievement", "Intellectual & Analytical"], mi: ["Naturalistic", "Logical-Mathematical"] },
  "Environment, Energy & Sustainability": { riasec: ["I", "R"], strengths: ["Strategic & Futuristic"], mi: ["Naturalistic", "Logical-Mathematical"] },
  "Architecture, Construction & Built Environment": { riasec: ["R", "A"], strengths: ["Creative & Innovative"], mi: ["Spatial", "Bodily-Kinesthetic"] },
  "Business, Finance & Entrepreneurship": { riasec: ["E", "C"], strengths: ["Influence & Leadership", "Strategic & Futuristic"], mi: ["Logical-Mathematical", "Interpersonal"] },
  "Law, Legal & Compliance": { riasec: ["E", "I"], strengths: ["Intellectual & Analytical", "Influence & Leadership"], mi: ["Linguistic", "Logical-Mathematical"] },
  "Government, Public Administration & Policy": { riasec: ["E", "S"], strengths: ["Influence & Leadership", "Strategic & Futuristic"], mi: ["Linguistic", "Interpersonal"] },
  "Education & Learning": { riasec: ["S", "A"], strengths: ["Relationship & Adaptability"], mi: ["Linguistic", "Interpersonal"] },
  "Media, Communication, Arts & Design": { riasec: ["A", "E"], strengths: ["Creative & Innovative"], mi: ["Linguistic", "Spatial", "Musical"] },
  "Manufacturing & Industrial Production": { riasec: ["R", "C"], strengths: ["Execution & Achievement"], mi: ["Spatial", "Bodily-Kinesthetic"] },
  "Supply Chain, Procurement & Logistics": { riasec: ["C", "E"], strengths: ["Execution & Achievement", "Strategic & Futuristic"], mi: ["Logical-Mathematical"] },
  "Travel, Tourism, Hospitality & Transport": { riasec: ["S", "E"], strengths: ["Relationship & Adaptability"], mi: ["Interpersonal", "Bodily-Kinesthetic"] },
  "Defence, Security & Emergency Services": { riasec: ["R", "S"], strengths: ["Execution & Achievement", "Influence & Leadership"], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
  "Personal Care, Beauty & Wellness": { riasec: ["S", "A"], strengths: ["Creative & Innovative", "Relationship & Adaptability"], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
};

function computeClusterAffinities(
  riasec: RIASECScore[],
  strengthDomains: StrengthDomainScore[],
  multipleIntelligence: StrengthDomainScore[],
  selfReported: string[]
): ClusterAffinityGrad[] {
  const riasecPct = Object.fromEntries(riasec.map((r) => [r.code, r.percentile]));
  // Strengths/MI are scored out of 5 (see scoreStrengthAreas/scoreMultipleIntelligence) - convert to 0-100 to match RIASEC's own percentile scale.
  const strengthPct = Object.fromEntries(strengthDomains.map((s) => [s.domain, (s.score / 5) * 100]));
  const miPct = Object.fromEntries(multipleIntelligence.map((m) => [m.domain, (m.score / 5) * 100]));
  const avg = (vals: number[]) => (vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0);
  const selfReportedSet = new Set(selfReported);

  return CAREER_CLUSTERS_18
    .map((cluster) => {
      const sig = CLUSTER_SIGNATURE[cluster];
      const riasecScore = sig ? avg(sig.riasec.map((c) => riasecPct[c] || 0)) : 0;
      const strengthScore = sig ? avg(sig.strengths.map((s) => strengthPct[s] || 0)) : 0;
      const miScore = sig ? avg(sig.mi.map((m) => miPct[m] || 0)) : 0;
      const computedScore = Math.round(riasecScore * 0.4 + strengthScore * 0.3 + miScore * 0.3);
      const isSelfReported = selfReportedSet.has(cluster);
      return {
        cluster, computedScore, selfReported: isSelfReported,
        blendedScore: Math.min(100, computedScore + (isSelfReported ? 15 : 0)),
      };
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
 * itself, which ignores degree entirely by design). The Graduates
 * equivalent of 11-12's "stream-filtered, Native Fit only" Suitability.
 *
 * The student's own degree cluster is guaranteed the #1 slot (when
 * resolvable) - a soft score boost isn't enough to guarantee that, since an
 * unrelated cluster's psychometric score can still beat it, which is
 * exactly how an engineering student could see an unrelated field ranked as
 * their top "suitability" domain. Its score shown is still the real,
 * unmodified blendedScore, never inflated. The remaining clusters are
 * ranked below it by blendedScore (interest + self-report).
 *
 * The single source of truth for "the student's top Suitability cluster" -
 * every place that needs it (the Suitability page's own ranking, the
 * Career Selector's roadmap anchor, summary.topCluster, gradExtraSheets'
 * PG-exams page) must go through this, not re-derive it independently, or
 * different parts of the same report can disagree on which cluster is
 * "top."
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
  const personality = scorePersonality(responses.personality);
  const riasec = scoreRIASEC(responses.career_interest);
  const aptitude = scoreAptitude(responses.aptitude);
  const strengthDomains = scoreStrengthAreas(responses.strengths);
  const multipleIntelligence = scoreMultipleIntelligence(responses.multiple_intelligence);
  const motivators = scoreMotivators(responses.motivators);
  const learningStyle = scoreLearningStyle(responses.learning_styles);
  const emotionalIntelligence = scoreEI(responses.emotional_intelligence);

  const layer1: PsychometricProfileGrad = {
    personality, riasec, aptitude, strengthDomains, multipleIntelligence, motivators, learningStyle, emotionalIntelligence,
  };

  const clusterAffinities = computeClusterAffinities(riasec, strengthDomains, multipleIntelligence, responses.career_cluster_fit.topClusters);
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

  const topStrength = strengthDomains[0];
  const growthAreas = [...strengthDomains].sort((a, b) => a.score - b.score).slice(0, 2).map((s) => s.domain);

  return {
    layer1,
    clusterAffinities,
    academicContext,
    aspiration,
    summary: {
      topCluster,
      strengthsSummary: topStrength ? `${topStrength.domain} stood out most across your answers.` : "Your strengths are fairly evenly spread.",
      growthAreas,
    },
  };
}
