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
  integrated_indicators: (QB.integrated_indicators?.ug?.["Set 1"] ?? []) as any[],
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
  multiple_intelligence: Record<string, number>;
  integrated_indicators: Record<string, number>;
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

// Verbal Reasoning is deliberately absent: the FuturePath 100-question bank's
// D8 (Cognitive & Analytical Ability, Q89-96) doesn't include a pure
// vocabulary/verbal item - it's numerical, logical/deductive, conditional,
// constraint-ordering, evidence-interpretation, data-comparison and
// trade-off items only (see the RATIONALE line per question in the source
// spec). Showing a permanently-empty "Verbal: 0%" card would look like a
// measured weakness rather than an unmeasured dimension, so the field is
// dropped rather than kept always-zero.
export interface AptitudeProfileGrad {
  numerical: { score: number; correct: number; total: number };
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
  // D9 in the source spec: supplementary behavioural evidence (Adaptability,
  // Learning Agility, Execution & Ownership, Integrated Work Style), one
  // question each - not weighted into cluster-affinity scoring (see
  // computeClusterAffinities's comment), surfaced for the report narrative.
  integratedIndicators: StrengthDomainScore[];
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

// For the FuturePath bank's "weighted single target" question design (D4
// EI, D6 MI, D7 Strengths, D9 Integrated Indicators): unlike tallyMapped's
// dimensions, each question here feeds exactly ONE named construct (given by
// `q.target`), with its own options ranked from strongest-evidence to
// weakest via `q.weights` (index-aligned with `q.options`, read straight
// from the bank - see data/graduates/questions-corrected.json) rather than
// every option naming a different construct. `got` accumulates the weight
// the student actually earned per construct; `of` accumulates the maximum
// any respondent could have earned per construct (sum of each question's
// own top weight) - so score = got/of stays a true 0-100 even though not
// every question shares the same weight scale.
function tallyWeightedTarget(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  questions: any[],
  responses: Record<string, number>
): { got: Record<string, number>; of: Record<string, number> } {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  questions.forEach((q, i) => {
    const target = q.target as string | undefined;
    const weights = q.weights as number[] | undefined;
    if (!target || !Array.isArray(weights)) return;
    of[target] = (of[target] || 0) + Math.max(...weights);
    const idx = responses[String(i)];
    const earned = typeof idx === "number" ? weights[idx] : undefined;
    if (typeof earned === "number") got[target] = (got[target] || 0) + earned;
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

const INTEGRATED_EXAMPLES: Record<string, string[]> = {
  "Adaptability": ["Redirecting after a plan changes", "Preserving useful work under a new objective", "Staying productive amid uncertainty"],
  "Learning Agility": ["Picking up unfamiliar tools quickly", "Learning from documentation/examples under time pressure", "Testing new skills on real tasks"],
  "Execution & Ownership": ["Surfacing risk early", "Taking the next controllable action", "Following through without being chased"],
  "Integrated Work Style": ["Clarifying ambiguous responsibilities", "Identifying assumptions before starting", "Taking a workable first step"],
};

function scoreStrengthAreas(responses: Record<string, number>): StrengthDomainScore[] {
  const { got, of } = tallyWeightedTarget(Q.strengths, responses);
  return Object.keys(STRENGTH_AREA_EXAMPLES)
    .map((domain) => ({
      domain, score: of[domain] ? Math.round((((got[domain] || 0) / of[domain]) * 100)) : 0,
      examples: STRENGTH_AREA_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMultipleIntelligence(responses: Record<string, number>): StrengthDomainScore[] {
  const { got, of } = tallyWeightedTarget(Q.multiple_intelligence, responses);
  return Object.keys(MI_EXAMPLES)
    .map((domain) => ({
      domain, score: of[domain] ? Math.round((((got[domain] || 0) / of[domain]) * 100)) : 0,
      examples: MI_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreIntegratedIndicators(responses: Record<string, number>): StrengthDomainScore[] {
  const { got, of } = tallyWeightedTarget(Q.integrated_indicators, responses);
  return Object.keys(INTEGRATED_EXAMPLES)
    .map((domain) => ({
      domain, score: of[domain] ? Math.round((((got[domain] || 0) / of[domain]) * 100)) : 0,
      examples: INTEGRATED_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Record<string, number>): MotivatorProfile {
  const tally = tallyMapped(Q.motivators, responses);
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
  const { got, of } = tallyWeightedTarget(Q.emotional_intelligence, responses);
  const pct = (tag: string) => (of[tag] ? Math.round(((got[tag] || 0) / of[tag]) * 100) : 0);
  const ranked = EI_QUADRANT_TAGS
    .map((tag) => ({ tag, score: pct(tag) }))
    .sort((a, b) => b.score - a.score);
  const frac = (tag: string) => pct(tag) / 100;
  const selfAwareness = frac("Self-Awareness");
  const selfManagement = frac("Self-Management");
  const socialAwareness = frac("Social Awareness");
  const relationshipManagement = frac("Relationship Management");
  return {
    ranked, selfAwareness, selfManagement, socialAwareness, relationshipManagement,
    emotionalRegulation: selfManagement >= 0.6 ? "You tend to steady yourself quickly under pressure." : "Strong feelings can take a while to settle for you - that's normal, not a weakness.",
    conflictResolution: relationshipManagement >= 0.6 ? "You actively work to resolve tension with others." : "You tend to process conflict internally before addressing it.",
    summary: ranked[0] && ranked[0].score > 0 ? `${ranked[0].tag} is your strongest tendency under pressure or feedback.` : "Your responses are fairly balanced across all four areas.",
  };
}

// ---------------------------------------------------------------- Cluster affinity
// The FuturePath 100-question spec's own "17 Career-Domain Compatibility
// Matrix" (source doc section 5), transcribed directly - RIASEC/Strengths/
// Motivators/MI evidence per cluster, not a re-derived or re-guessed
// signature. Short forms in the source table are expanded to this codebase's
// full canonical tag spelling (e.g. "Analytical" -> "Intellectual &
// Analytical", "Logical" -> "Logical-Mathematical") so they match the exact
// strings scoreStrengthAreas/scoreMultipleIntelligence/scoreMotivators
// produce; the Motivator column's vocabulary (Learning, Achievement, Social
// Impact, Financial Security, Leadership, Creativity) already matches this
// bank's own D3 tags exactly, no translation needed there.
//
// Only 17 of the 18 real clusters are covered - the source spec's own matrix
// stops at 17 and never mentions "Personal Care, Beauty & Wellness" (the
// same gap already flagged for the UG roadmap content earlier this project -
// this domain simply isn't in the source document). That one cluster keeps
// its previous hand-tagged signature (RIASEC-only, no strengths/motivators/
// MI evidence) rather than fabricating FuturePath-style evidence for a
// cluster the spec doesn't cover.
//
// This is still a CLUSTER-level signature, not a per-role one - 11-12's
// system computes fit per individual career and only aggregates up to
// cluster level after. Building an equivalent per-role signature for
// Graduates would mean tagging ~3,300 Excel roles individually, which isn't
// done here - flagged as a real fidelity gap versus 11-12, not hidden.
const CLUSTER_SIGNATURE: Record<string, { riasec: string[]; strengths: string[]; motivators: string[]; mi: string[] }> = {
  "Engineering, Technology & Computing": { riasec: ["I", "R", "C"], strengths: ["Intellectual & Analytical", "Creative & Innovative", "Strategic & Futuristic"], motivators: ["Learning", "Achievement"], mi: ["Logical-Mathematical", "Spatial"] },
  "Science, Mathematics & Research": { riasec: ["I"], strengths: ["Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Learning", "Achievement"], mi: ["Logical-Mathematical", "Intrapersonal"] },
  "Healthcare & Medicine": { riasec: ["I", "S"], strengths: ["Intellectual & Analytical", "Relationship & Adaptability", "Execution & Achievement"], motivators: ["Social Impact", "Learning"], mi: ["Interpersonal", "Intrapersonal", "Naturalistic"] },
  "Psychology, Humanities & Social Sciences": { riasec: ["S", "I", "A"], strengths: ["Relationship & Adaptability", "Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Social Impact", "Learning"], mi: ["Interpersonal", "Linguistic", "Intrapersonal"] },
  "Sports, Fitness & Human Performance": { riasec: ["R", "S", "E"], strengths: ["Execution & Achievement", "Relationship & Adaptability", "Influence & Leadership"], motivators: ["Achievement", "Social Impact", "Learning"], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
  "Agriculture, Food & Life Sciences": { riasec: ["R", "I"], strengths: ["Intellectual & Analytical", "Execution & Achievement", "Strategic & Futuristic"], motivators: ["Social Impact", "Learning", "Financial Security"], mi: ["Naturalistic", "Logical-Mathematical", "Bodily-Kinesthetic"] },
  "Environment, Energy & Sustainability": { riasec: ["I", "R", "S"], strengths: ["Strategic & Futuristic", "Intellectual & Analytical", "Relationship & Adaptability"], motivators: ["Social Impact", "Learning"], mi: ["Naturalistic", "Logical-Mathematical"] },
  "Architecture, Construction & Built Environment": { riasec: ["R", "A", "I"], strengths: ["Creative & Innovative", "Execution & Achievement"], motivators: ["Creativity", "Achievement"], mi: ["Spatial", "Logical-Mathematical", "Bodily-Kinesthetic"] },
  "Business, Finance & Entrepreneurship": { riasec: ["E", "C", "I"], strengths: ["Influence & Leadership", "Intellectual & Analytical", "Strategic & Futuristic", "Execution & Achievement"], motivators: ["Achievement", "Leadership", "Financial Security", "Creativity"], mi: ["Logical-Mathematical", "Linguistic", "Interpersonal"] },
  "Law, Legal & Compliance": { riasec: ["I", "E", "C"], strengths: ["Intellectual & Analytical", "Strategic & Futuristic", "Influence & Leadership"], motivators: ["Achievement", "Financial Security", "Social Impact"], mi: ["Linguistic", "Logical-Mathematical", "Interpersonal"] },
  "Government, Public Administration & Policy": { riasec: ["S", "E", "C", "I"], strengths: ["Strategic & Futuristic", "Relationship & Adaptability", "Execution & Achievement"], motivators: ["Social Impact", "Leadership"], mi: ["Linguistic", "Interpersonal", "Logical-Mathematical"] },
  "Education & Learning": { riasec: ["S", "A", "I"], strengths: ["Relationship & Adaptability"], motivators: ["Social Impact", "Learning", "Achievement"], mi: ["Linguistic", "Interpersonal", "Intrapersonal"] },
  "Media, Communication, Arts & Design": { riasec: ["A", "E", "S"], strengths: ["Creative & Innovative", "Influence & Leadership", "Relationship & Adaptability"], motivators: ["Creativity", "Achievement", "Leadership"], mi: ["Linguistic", "Spatial", "Interpersonal"] },
  "Manufacturing & Industrial Production": { riasec: ["R", "I", "C"], strengths: ["Execution & Achievement", "Intellectual & Analytical", "Strategic & Futuristic"], motivators: ["Achievement", "Financial Security", "Learning"], mi: ["Logical-Mathematical", "Bodily-Kinesthetic", "Spatial"] },
  "Supply Chain, Procurement & Logistics": { riasec: ["C", "R", "E"], strengths: ["Execution & Achievement", "Intellectual & Analytical", "Relationship & Adaptability"], motivators: ["Achievement", "Financial Security", "Leadership"], mi: ["Logical-Mathematical", "Interpersonal"] },
  "Travel, Tourism, Hospitality & Transport": { riasec: ["S", "E", "R"], strengths: ["Relationship & Adaptability", "Influence & Leadership"], motivators: ["Social Impact", "Achievement", "Financial Security"], mi: ["Interpersonal", "Bodily-Kinesthetic", "Linguistic"] },
  "Defence, Security & Emergency Services": { riasec: ["R", "I", "S"], strengths: ["Execution & Achievement", "Strategic & Futuristic", "Relationship & Adaptability"], motivators: ["Achievement", "Social Impact", "Leadership"], mi: ["Bodily-Kinesthetic", "Logical-Mathematical", "Interpersonal"] },
  // Not covered by the FuturePath spec's matrix - kept from the prior
  // hand-tagged signature rather than fabricated.
  "Personal Care, Beauty & Wellness": { riasec: ["S", "A"], strengths: ["Creative & Innovative", "Relationship & Adaptability"], motivators: [], mi: ["Bodily-Kinesthetic", "Interpersonal"] },
};

// Weighted blend per the FuturePath spec's section 6 "Recommended Career-Fit
// Formula" table - of its 9 weighted components, only RIASEC (25%),
// Strengths (15%), Motivators (15%) and MI (10%) have a per-cluster target
// in the spec's own compatibility matrix (section 5); MBTI/EI/Learning/
// Cognitive/Integrated (the remaining 35%) are listed there as evidence
// weights but the spec provides no per-cluster MBTI-type, EI-quadrant,
// learning-style, cognitive or integrated-indicator target to score them
// against - inventing one would be exactly the kind of fabricated signal
// this project avoids. Those five stay as real, computed, reported
// dimensions (surfaced in the narrative/report, same as the spec's own
// "apply contextual modifiers" framing places degree/specialisation/
// experience/goals outside the mechanical formula too) rather than being
// silently folded into ranking math the source data can't actually support.
// The four that DO drive ranking keep their relative weights from the spec
// (25:15:15:10) and are coverage-normalised so they still sum to 1 even
// though the spec's own weights for them only total 0.65 of the full 1.0.
const CLUSTER_WEIGHTS = { riasec: 0.25, strengths: 0.15, motivators: 0.15, mi: 0.10 };
const CLUSTER_WEIGHT_TOTAL = Object.values(CLUSTER_WEIGHTS).reduce((s, w) => s + w, 0);

function computeClusterAffinities(
  riasec: RIASECScore[],
  strengthDomains: StrengthDomainScore[],
  motivators: MotivatorProfile,
  multipleIntelligence: StrengthDomainScore[],
  selfReported: string[]
): ClusterAffinityGrad[] {
  const riasecPct = Object.fromEntries(riasec.map((r) => [r.code, r.percentile]));
  const strengthPct = Object.fromEntries(strengthDomains.map((s) => [s.domain, s.score]));
  const motivatorPct = Object.fromEntries(motivators.ranked.map((m) => [m.tag, m.score]));
  const miPct = Object.fromEntries(multipleIntelligence.map((m) => [m.domain, m.score]));
  const avg = (vals: number[]) => (vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0);
  const selfReportedSet = new Set(selfReported);

  return CAREER_CLUSTERS_18
    .map((cluster) => {
      const sig = CLUSTER_SIGNATURE[cluster];
      const riasecScore = sig ? avg(sig.riasec.map((c) => riasecPct[c] || 0)) : 0;
      const strengthScore = sig ? avg(sig.strengths.map((s) => strengthPct[s] || 0)) : 0;
      const motivatorScore = sig && sig.motivators.length ? avg(sig.motivators.map((m) => motivatorPct[m] || 0)) : null;
      const miScore = sig ? avg(sig.mi.map((m) => miPct[m] || 0)) : 0;
      // Coverage-normalised weighted mean, same "average only what was
      // actually measured/available" pattern used across this project's
      // other scoring engines - "Personal Care, Beauty & Wellness" has no
      // motivator evidence at all (see CLUSTER_SIGNATURE above), so its
      // score is a mean over the 3 dimensions it does have, not artificially
      // diluted by a missing 4th.
      const parts: [number, number][] = [[riasecScore, CLUSTER_WEIGHTS.riasec], [strengthScore, CLUSTER_WEIGHTS.strengths], [miScore, CLUSTER_WEIGHTS.mi]];
      if (motivatorScore !== null) parts.push([motivatorScore, CLUSTER_WEIGHTS.motivators]);
      const denom = parts.reduce((s, [, w]) => s + w, 0) || CLUSTER_WEIGHT_TOTAL;
      const computedScore = sig ? Math.round(parts.reduce((s, [v, w]) => s + v * w, 0) / denom) : 0;
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
  const integratedIndicators = scoreIntegratedIndicators(responses.integrated_indicators);

  const layer1: PsychometricProfileGrad = {
    personality, riasec, aptitude, strengthDomains, multipleIntelligence, motivators, learningStyle, emotionalIntelligence, integratedIndicators,
  };

  const clusterAffinities = computeClusterAffinities(riasec, strengthDomains, motivators, multipleIntelligence, responses.career_cluster_fit.topClusters);
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
