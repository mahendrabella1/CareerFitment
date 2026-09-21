/**
 * Class 11-12 Advanced Scoring Engine
 * Converts 84-question assessment into 4-layer comprehensive report
 */
import questionBank from "@/data/class-11-12/questions-corrected.json";
import { DOMAINS, roadmap as knowledgeRoadmap } from "@/lib/report/knowledge";
// The 322-career/27-domain engine (lib/report/careerfit1112.ts,
// careerFitEngine1112.ts) is the single source of truth for "what domain
// does this profile point toward" for classes 11/12 — domainAffinities
// below is now computed from it directly, instead of the older, coarser
// 8-domain catalogue in knowledge.ts (DOMAIN_RIASEC/DOMAIN_MI), which used
// to produce a second, disagreeing domain ranking on the shared dimension
// pages, the Resources page and "Other domains worth exploring" — all
// reading real results, just from a different, less precise formula than
// Career Fitment/Suitability/Selector used a few pages later.
import {
  domainAffinitiesFromProfile1112, domainsCompatibleWithStream1112, careerSuitabilityForStream1112, findCareer1112,
} from "@/lib/report/careerFitEngine1112";

const QB = questionBank as any;
const Q = {
  personality: (QB.personality?.["11-12"]?.["Set 1"] ?? []) as any[],
  career_interest: (QB.career_interest?.["11-12"]?.["Set 1"] ?? []) as any[],
  aptitude: (QB.aptitude?.["11-12"]?.["Set 1"] ?? []) as any[],
  multiple_intelligence: (QB.multiple_intelligence?.["11-12"]?.["Set 1"] ?? []) as any[],
  motivators: (QB.motivators?.["11-12"]?.["Set 1"] ?? []) as any[],
  learning_styles: (QB.learning_styles?.["11-12"]?.["Set 1"] ?? []) as any[],
  emotional_intelligence: (QB.emotional_intelligence?.["11-12"]?.["Set 1"] ?? []) as any[],
};

// Strengths has 2 sets (randomly assigned per exam by pickSets()), unlike
// every other 11-12 category which only ever has "Set 1" — resolved
// per-response by strengthsSetName instead of being a fixed module constant
// like the rest of Q above. Falls back to "Set 1" for any response scored
// before this field existed (old in-flight sessions with no set name saved).
function strengthsQuestions(setName?: string): any[] {
  return (QB.strengths?.["11-12"]?.[setName || "Set 1"] ?? QB.strengths?.["11-12"]?.["Set 1"] ?? []) as any[];
}

export interface Class11Response {
  personality: Record<string, number>;
  career_interest: Record<string, number>;
  aptitude: Record<string, number>;
  strength_domains: Record<string, number>;
  // Which named set (e.g. "Set 1"/"Set 2") the student's strength_domains
  // answers were actually drawn from — the Strengths bank is the only
  // category with more than one set right now, randomly picked per exam by
  // pickSets() in data.ts. Without this, scoring always read Set 1's
  // question/domain mapping regardless of what the student was shown,
  // silently mis-scoring (or dropping) anyone randomly given Set 2.
  strengthsSetName?: string;
  multiple_intelligence: Record<string, number>;
  motivators: Record<string, number>;
  learning_styles: Record<string, number>;
  emotional_intelligence: Record<string, number>;
  // Section 9 — Subject & Academic Fit (8 questions; indices match
  // data/class-11-12/questions-corrected.json's subject_fit set exactly).
  subject_fit: {
    currentStream: string; // Q62: canonical stream key (MPC/BiPC/PCMB/Commerce/Arts/Vocational)
    currentSubjects: string[]; // Q63
    enjoyedSubject: string; // Q64
    difficultSubject: string; // Q65
    academicConfidence: number; // Q66: 1-10
    streamSatisfaction: number; // Q67: 1-10
    streamChoiceReasons: string[]; // Q68
    explorationInterest: number; // Q69: 1-10
  };
  // Section 10 — Career / Stream / Degree Fit (8 questions).
  career_fit: {
    clarity: number; // Q70: 1-10
    consideringAreas: string[]; // Q71
    degreeCertainty: string; // Q72
    pathwayFlexibility: number; // Q73: 1-10
    topConcerns: string[]; // Q74
    decisionStage: string; // Q75
    decisionConfidence: number; // Q76: 1-10
    pathwayType: string; // Q77
  };
  // Section 11 — Career Selector (4 questions).
  career_selector: {
    primaryCareer: string; // Q78
    alternativeChoices: string[]; // Q79
    excludedCareers: string[]; // Q80
    reportPriority: string; // Q81
  };
  // Class 12 only — estimated percentage/score in the board or entrance exam
  // (JEE, NEET, CUET, etc.) they're preparing for, collected on the pre-exam
  // screen (NewExam.tsx). Undefined for Class 11, which doesn't ask it.
  estimatedPercentage?: number;
  // Raw pre-exam stream choice, before it's bucketed down to
  // subject_fit.currentStream's coarser vocabulary — carries the Commerce
  // Maths/no-Maths distinction the new Fitment/Suitability/Selector engine
  // (lib/report/careerfit1112.ts) needs but the older stream-fit code
  // doesn't. One of NewExam.tsx's STREAM_OPTIONS keys, or "" for Other.
  currentStreamDetailed?: string;
}

export interface Class11ScoreOutput {
  layer1: PsychometricProfile;
  layer2: AcademicRealityAnalysis;
  layer3: EducationPathway;
  layer4: StudentAspiration;
  summary: CareerRecommendations;
  domainAffinities: Array<{
    domain: string; // A-H, same catalogue as lib/report/knowledge.ts DOMAINS
    domainName: string;
    affinity: number; // 0-100
    reasoning: string[];
  }>;
  // Pass-through of Class11Response.currentStreamDetailed — see that field's
  // comment. Consumed by lib/report/careerFitEngine1112.ts's Suitability/
  // Selector lookups, which need the Commerce Maths/no-Maths distinction
  // layer2.currentStream's coarser bucket has already lost.
  currentStreamDetailed?: string;
}

// LAYER 1: Psychometric Profile
export interface PsychometricProfile {
  personality: PersonalityProfile;
  riasec: RIASECScore[];
  aptitude: AptitudeProfile;
  // The real 6-parameter Strengths measure (Problem Solving, Leadership,
  // Creative Thinking, Design Thinking, Influencing, Strategic Thinking) —
  // genuinely separate from multipleIntelligence below, not the same 8
  // Gardner MI domains shown twice under two different dimension names.
  strengthDomains: StrengthDomainScore[];
  multipleIntelligence: StrengthDomainScore[];
  motivators: MotivatorProfile;
  learningStyle: LearningStyleProfile;
  emotionalIntelligence: EIProfile;
}

export interface PersonalityProfile {
  ei: string; // E or I
  sn: string; // S or N
  tf: string; // T or F
  jp: string; // J or P
  type: string; // e.g., INTJ
  summary: string;
  // 0-100: how consistently the student picked one side of each axis, not
  // "how good" a personality — used as the dimension's scorecard/radar
  // score, since the four letters alone aren't a number.
  score: number;
  // 0-10 per axis, midpoint 5: >=5 leans toward the first letter shown
  // for that axis (E/S/T/J), below 5 leans toward the second (I/N/F/P).
  // Powers the compass visual, which needs a position per axis, not just
  // which letter won.
  axisScores: { ei: number; sn: number; tf: number; jp: number };
  // Q7's own 1-10 self-rating ("comfortable making an important decision
  // without simply following what friends/family expect") — kept separate
  // from the MBTI tally since it isn't a fourth-letter vote, it's a direct
  // measure of decision independence the report can name explicitly (the
  // source spec calls this "a very important Class 11 diagnostic").
  decisionAutonomy: number;
}

export interface RIASECScore {
  code: string;
  name: string;
  score: number;
  percentile: number;
}

// The report template's own 6-row aptitude table: Numerical/3, Logical/3,
// Verbal/2, Abstract-Pattern/2, Spatial/2, Data Interpretation/2 = 14Q.
export interface AptitudeProfile {
  numerical: { score: number; correct: number; total: number; interpretation: string };
  logical: { score: number; correct: number; total: number; interpretation: string };
  verbal: { score: number; correct: number; total: number; interpretation: string };
  abstractPattern: { score: number; correct: number; total: number; interpretation: string };
  spatial: { score: number; correct: number; total: number; interpretation: string };
  dataInterpretation: { score: number; correct: number; total: number; interpretation: string };
  overallScore: number;
  strength: string;
  weakness: string;
}

export interface StrengthDomainScore {
  domain: string;
  score: number;
  examples: string[];
}

// The 8-question motivator set (Q51-58 in the source spec) tags each of its
// 5 options with one of 11 possible values (Achievement, Learning, Social
// Impact, Recognition, Autonomy, Mastery, Financial Security, Creativity,
// Collaboration, Security, Leadership) rather than 4 fixed dyads, so the
// profile is a ranked list of whichever tags the student actually picked.
export interface MotivatorProfile {
  ranked: { tag: string; score: number }[]; // 0-100 each, all tags that appeared at least once
  summary: string;
  // 0-100: how concentrated the top motivator is (its share of all 8 picks)
  // — the dimension's scorecard/radar score.
  score: number;
}

export interface LearningStyleProfile {
  primaryStyle: string;
  secondaryStyle: string;
  examPreparationTechnique: string;
  recommendations: string[];
  // 0-100: how dominant the primary style was among all the style-tagged
  // answers — the dimension's scorecard/radar score.
  score: number;
  // All 4 VARK-style dimensions (Visual/Read-Write/Social/Practice) with
  // their real tallied share of the style-tagged answers, strongest first —
  // primaryStyle/secondaryStyle above are just ranked[0]/ranked[1]'s names,
  // kept for the existing prose that names them directly. The report's own
  // breakdown bars (adaptClass11.ts's `learningStyles`) need all 4, not a
  // truncated top-2 with a guessed number for the second.
  ranked: { style: string; score: number }[];
}

// The 4-question EI set is a forced choice across the 4 standard Goleman EQ
// quadrants — every question offers exactly one option per quadrant, so each
// of the 4 fields below is a real, independently-tallied 0-1 score (how
// often that quadrant was picked out of 4 questions), not a proxy or a
// fallback to the overall score. `ranked` carries the same 4 as a sorted list.
export interface EIProfile {
  ranked: { tag: string; score: number }[];
  selfAwareness: number;
  selfManagement: number;
  socialAwareness: number;
  relationshipManagement: number;
  emotionalRegulation: string;
  conflictResolution: string;
  summary: string;
}

// LAYER 2: Academic Reality
export interface AcademicRealityAnalysis {
  currentStream: string;
  streamSuitability: "Well-matched" | "Partially-matched" | "Misaligned";
  subjectStrengths: string[];
  subjectChallenges: string[];
  /** Raw Subject Fit Q64/Q65 answers (single subject each), kept alongside the derived subjectStrengths/Challenges lists above so callers needing the exact answer — e.g. careerFit1112Sheets.tsx's RankingContext1112 — don't have to guess it back out of subjectStrengths[0]. */
  enjoyedSubject: string;
  difficultSubject: string;
  /** Raw Subject Fit Q63 answer (multi-select) — same reasoning as enjoyedSubject/difficultSubject above, feeds RankingContext1112.currentSubjects. */
  currentSubjects: string[];
  /** Subject Fit Q68 (up to 2 of: my own choice, family/mentor
   *  recommendation, peer influence, earning potential, uncertainty) — a
   *  signal for whether the CURRENT stream reflects genuine self-driven
   *  interest. When it doesn't (family/peer/uncertainty, without "my own
   *  choice"), Career Suitability widens to include Bridge-fit careers too,
   *  not just Native Fit, since the student's real interest may sit outside
   *  their current stream. */
  streamChoiceReasons: string[];
  careerPathwaysAvailable: string[];
  // "Career Suitability" — every domain (with its real roles) realistically
  // open to this STREAM, independent of whether it matches this specific
  // student's measured profile. Answers "what's actually out there for
  // someone in MPC/BiPC/etc", as distinct from "Career Fitment" (the
  // Best-fit Domains page), which answers "what fits ME".
  careerSuitability: { domain: string; domainName: string; roles: string[] }[];
  requiredAdjustments?: string[];
  streamChangeAdvice?: string;
  nextSteps: string[];
}

// LAYER 3: Education & Career Pathway
export interface EducationPathway {
  recommendedDegrees: DegreeOption[];
  entranceExamsRequired: string[];
  subjectsToFocus: string[];
  skillsDevelopmentPlan: SkillGap[];
  timelineUpto22: RoadmapPhase[];
  universities: UniversityOption[];
}

export interface DegreeOption {
  name: string;
  compatibility: number; // 0-100
  requiredSubjects: string[];
  careerOutcomes: string[];
  topColleges: string[];
  entranceExam?: string;
}

export interface SkillGap {
  skill: string;
  currentLevel: "Beginner" | "Intermediate" | "Advanced";
  targetLevel: string;
  developmentMethod: string;
  timeRequired: string;
}

export interface RoadmapPhase {
  period: string; // e.g., "Class 11-12"
  focus: string;
  actions: string[];
  outcomes: string[];
}

export interface UniversityOption {
  name: string;
  location: string;
  programsAligned: string[];
  entranceRequired: string;
  cutoffEstimate: string;
}

// "Career Selector" vs "Career Fitment" — does the career the student
// actually picked (career_selector.primaryCareer, a controlled choice from
// CAREERS_1112 — see NewExam.tsx's preinfo dropdown) land in the same domain
// as the domain their measured profile points toward (domainAffinities[0])?
// `roadmapDomain` is whichever one the 20-year roadmap should actually be
// built around: the student's own pick when it differs from fitment (their
// choice, not an override), falling back to the fitment domain only when
// they didn't name a real one.
export interface CareerMatch {
  matched: boolean;
  selectedDomain: string | null;
  selectedDomainName: string | null;
  fitmentDomain: string | null;
  fitmentDomainName: string | null;
  roadmapDomain: string | null;
  roadmapDomainName: string | null;
}

// LAYER 4: Student Aspiration
export interface StudentAspiration {
  primaryCareerGoal: string;
  clarityScore: number; // 1-10
  alternativeOptions: string[];
  /** Career Fit Q71 (up to 3 field names, e.g. "AI / Data Science") — kept alongside primaryCareerGoal so callers building RankingContext1112 (careerFit1112Sheets.tsx) don't need the raw Class11Response. */
  consideringAreas: string[];
  /** Career Selector Q80 (up to 3 career names) — "useful for elimination" per the question's own copy; RankingContext1112 removes these from ranking entirely. */
  excludedCareers: string[];
  /** Career Fit Q74 (up to 2 of: course suitability, admissions/competition,
   *  career outcomes, financial cost, family/location, confusion) — a direct
   *  signal for which existing report section to point the student at (e.g.
   *  financial cost -> the Funded Programs table), not a ranking input. */
  topConcerns: string[];
  /** Career Fit Q77 — the kind of pathway they want (research, corporate,
   *  entrepreneurship, public service, or a handful of non-field-specific
   *  answers like "flexible degree"/"don't know yet"). RankingContext1112
   *  nudges ranking toward the field-specific answers only. */
  pathwayType: string;
  motivationFactors: string[];
  careerMatch: CareerMatch;
  alignment: {
    psychometricAlignment: number; // %
    streamAlignment: number; // %
    aptitudeAlignment: number; // %
    overallFitment: number; // %
  };
  advice: string;
  // Class 12 only — pass-through of Class11Response.estimatedPercentage.
  estimatedPercentage?: number;
}

// Final Summary
// Career-by-career recommendations live on the domain page (real,
// per-student data) — this section only covers what that page doesn't:
// alternative domains, risks worth naming, and real strengths/growth areas.
export interface CareerRecommendations {
  alternativePaths: string[];
  riskFactors: string[];
  strengthToLeverage: string[];
  growthAreas: string[];
}

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Main scoring function - converts raw responses into 4-layer output
 */
export function scoreClass11Assessment(responses: Class11Response): Class11ScoreOutput {
  const layer1 = generatePsychometricProfile(responses);
  const domainAffinities = calculateDomainAffinities(layer1, responses);
  const careerMatch = resolveCareerMatch(responses, domainAffinities);
  const layer2 = generateAcademicRealityAnalysis(responses, layer1, domainAffinities);
  const layer3 = generateEducationPathway(responses, layer1, layer2, domainAffinities, careerMatch);
  const layer4 = generateStudentAspiration(responses, layer1, layer2, domainAffinities, careerMatch);
  const summary = generateCareerRecommendations(layer1, layer2, domainAffinities);

  return {
    layer1,
    layer2,
    layer3,
    layer4,
    summary,
    domainAffinities,
    currentStreamDetailed: responses.currentStreamDetailed,
  };
}

/**
 * LAYER 1: Psychometric Profile
 * Scores all 8 dimensions from the questionnaire
 */
function generatePsychometricProfile(responses: Class11Response): PsychometricProfile {
  return {
    personality: scorePersonality(responses.personality),
    riasec: scoreRIASEC(responses.career_interest),
    aptitude: scoreAptitude(responses.aptitude),
    strengthDomains: scoreStrengthAreas(responses.strength_domains, responses.strengthsSetName),
    multipleIntelligence: scoreMultipleIntelligence(responses.multiple_intelligence),
    motivators: scoreMotivators(responses.motivators),
    learningStyle: scoreLearningStyle(responses.learning_styles),
    emotionalIntelligence: scoreEI(responses.emotional_intelligence),
  };
}

// Narrower than `keyof AptitudeProfile`: that union also includes
// overallScore/strength/weakness, which aren't {score,...} objects —
// indexing profile.aptitude[f] with the wider type below made TypeScript
// widen the result to include their (non-object) types too. Still used by
// subjectAptitudeScore()/SUBJECT_APTITUDE below.
type AptitudeScoreField = "numerical" | "logical" | "verbal" | "abstractPattern" | "spatial" | "dataInterpretation";

/**
 * All 27 DOMAINS_1112 domains, ranked by Career Fitment's own weighted-
 * overlap score — see domainAffinitiesFromProfile1112() for why this
 * replaced a separate, coarser 8-domain formula. Passes the student's own
 * Subject Fit/Career Selector answers through as ranking context (see
 * RankingContext1112) so this list — which every downstream layer and page
 * reads from — agrees with what the student actually told the system, not
 * just their RIASEC pattern.
 */
function calculateDomainAffinities(profile: PsychometricProfile, responses: Class11Response): Class11ScoreOutput["domainAffinities"] {
  return domainAffinitiesFromProfile1112(profile, {
    desiredCareerText: responses.career_selector.primaryCareer,
    enjoyedSubject: responses.subject_fit.enjoyedSubject,
    difficultSubject: responses.subject_fit.difficultSubject,
    consideringAreas: responses.career_fit.consideringAreas,
    alternativeCareerTexts: responses.career_selector.alternativeChoices,
    excludedCareerTexts: responses.career_selector.excludedCareers,
    currentSubjects: responses.subject_fit.currentSubjects,
    pathwayType: responses.career_fit.pathwayType,
  });
}

/** Career Selector vs Career Fitment: does the career the student actually
 *  chose land in the same domain their measured profile points toward?
 *  Uses findCareer1112() — the exact CAREERS_1112 lookup Career Selector
 *  itself resolves the student's named career against — instead of the old
 *  domainOfRole()'s role-list search against the smaller 8-domain
 *  catalogue, which silently returned null (and so `matched: false`) for
 *  almost every modern career name once the dropdown started drawing from
 *  CAREERS_1112's 339 roles instead of that catalogue's much shorter lists. */
function resolveCareerMatch(responses: Class11Response, domainAffinities: Class11ScoreOutput["domainAffinities"]): CareerMatch {
  const primaryCareer = responses.career_selector.primaryCareer;
  const fitment = domainAffinities[0];
  const selectedCareer = primaryCareer ? findCareer1112(primaryCareer) : null;
  const selectedDomain = selectedCareer?.domain ?? null;
  const matched = !!selectedDomain && selectedDomain === fitment?.domain;
  // The roadmap follows the student's own choice when they named one —
  // respecting their actual aspiration rather than silently overriding it
  // with the algorithm's suggestion — and only falls back to the fitment
  // domain when they didn't pick a real career at all.
  const roadmapDomain = selectedDomain ?? fitment?.domain ?? null;
  return {
    matched,
    selectedDomain,
    selectedDomainName: selectedDomain,
    fitmentDomain: fitment?.domain ?? null,
    fitmentDomainName: fitment?.domainName ?? null,
    roadmapDomain,
    roadmapDomainName: roadmapDomain,
  };
}

/** "Career Suitability" — every domain (with its real roles) realistically
 *  open to a given stream, regardless of this specific student's profile.
 *  Distinct from Career Fitment (calculateDomainAffinities), which is
 *  personalised; this is a stream-level reference listing — now built from
 *  CAREERS_1112's own Native-Fit test (see careerSuitabilityForStream1112),
 *  the same one Career Suitability itself uses, instead of a separate,
 *  older per-stream table that didn't know about the Commerce Maths/no-
 *  Maths split or the 27-domain catalogue. */
function getCareerSuitability(appStreamKey: string): AcademicRealityAnalysis["careerSuitability"] {
  return careerSuitabilityForStream1112(appStreamKey);
}

// All eight forced-choice sections (personality, RIASEC, strengths,
// motivators, learning, EI, creativity) now share one shape: each question
// has a plain `options` array and a parallel `mapping` array naming the tag
// each option feeds. Scoring is just "read the mapping at the picked index."
function tallyMapped(questions: any[], responses: Record<string, number>): Record<string, number> {
  const tally: Record<string, number> = {};
  questions.forEach((q, i) => {
    const idx = responses[String(i)];
    const tag = Array.isArray(q.mapping) ? q.mapping[idx] : undefined;
    if (tag) tally[tag] = (tally[tag] || 0) + 1;
  });
  return tally;
}

function scorePersonality(responses: Record<string, number>): PersonalityProfile {
  // Unlike a rigid "one question = one axis" design, each of the 6 scenario
  // questions' mapping can name any of the 8 MBTI letters directly (see
  // data/class-11-12/questions-corrected.json) — so every axis is tallied
  // from whichever questions actually touched it, not a fixed Q-range. Q7
  // (index 6) has no `mapping` — it's a plain 1-10 slider, not a 4th vote —
  // so tallyMapped already skips it (Array.isArray(q.mapping) is false).
  const tally = tallyMapped(Q.personality, responses);
  const decisionAutonomy = responses["6"] ?? 5;
  const ei = (tally.E || 0) - (tally.I || 0);
  const sn = (tally.S || 0) - (tally.N || 0);
  const tf = (tally.T || 0) - (tally.F || 0);
  const jp = (tally.J || 0) - (tally.P || 0);

  const traits = {
    ei: ei >= 0 ? "E" : "I",
    sn: sn >= 0 ? "S" : "N",
    tf: tf >= 0 ? "T" : "F",
    jp: jp >= 0 ? "J" : "P",
    type: (ei >= 0 ? "E" : "I") + (sn >= 0 ? "S" : "N") + (tf >= 0 ? "T" : "F") + (jp >= 0 ? "J" : "P"),
  };

  // Max magnitude per axis = however many questions actually feed that
  // letter-pair (E+I counts, etc.) — not a fixed constant, since the mapping
  // is no longer evenly split 2 axes / 3 questions each.
  const maxOf = (a: string, b: string) => Math.max(1, (tally[a] || 0) + (tally[b] || 0));
  const clarity = (
    Math.abs(ei) / maxOf("E", "I") + Math.abs(sn) / maxOf("S", "N") +
    Math.abs(tf) / maxOf("T", "F") + Math.abs(jp) / maxOf("J", "P")
  ) / 4;
  // Only 6 scenario questions cover all 4 axes, so a single question often
  // decides one — and that question's tally is unanimous by definition
  // (1 vote for the winning letter, 0 for the other), which fed straight
  // into the old formula as a literal 10.0/10 (100%). One vote isn't
  // certainty; shrink the vote share toward the midpoint by one vote's
  // worth of doubt before mapping to the 0-10 scale, so a single-question
  // axis reads as a strong lean (~7.5/10) rather than false 100% certainty.
  const toAxis10 = (tallyVal: number, maxMag: number) => {
    const winCount = (maxMag + tallyVal) / 2; // recovers the winning side's raw vote count from the signed net
    const prior = 1;
    const share = (winCount + prior / 2) / (maxMag + prior);
    return Math.round(share * 10 * 10) / 10;
  };

  return {
    ...traits,
    summary: generatePersonalitySummary(traits),
    score: Math.round(clarity * 100),
    axisScores: {
      ei: toAxis10(ei, maxOf("E", "I")),
      sn: toAxis10(sn, maxOf("S", "N")),
      tf: toAxis10(tf, maxOf("T", "F")),
      jp: toAxis10(jp, maxOf("J", "P")),
    },
    decisionAutonomy,
  };
}

function scoreRIASEC(responses: Record<string, number>): RIASECScore[] {
  const tally = tallyMapped(Q.career_interest, responses);
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  const riasecNames: Record<string, string> = {
    R: "Realistic", I: "Investigative", A: "Artistic",
    S: "Social", E: "Enterprising", C: "Conventional",
  };
  return Object.keys(riasecNames)
    .map((code) => ({
      code,
      name: riasecNames[code],
      score: tally[code] || 0,
      percentile: total ? Math.round(((tally[code] || 0) / total) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);
}

const APTITUDE_FIELDS: { key: AptitudeScoreField; subdomain: string; label: string }[] = [
  { key: "numerical", subdomain: "Numerical Reasoning", label: "Numerical" },
  { key: "logical", subdomain: "Logical Reasoning", label: "Logical" },
  { key: "verbal", subdomain: "Verbal Reasoning", label: "Verbal" },
  { key: "abstractPattern", subdomain: "Abstract / Pattern Reasoning", label: "Abstract/Pattern" },
  { key: "spatial", subdomain: "Spatial Reasoning", label: "Spatial" },
  { key: "dataInterpretation", subdomain: "Data Interpretation", label: "Data Interpretation" },
];

function scoreAptitude(responses: Record<string, number>): AptitudeProfile {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  Q.aptitude.forEach((q, i) => {
    const sub = String(q.subdomain || "");
    if (!sub) return;
    of[sub] = (of[sub] || 0) + 1;
    if (responses[String(i)] === q.correctIndex) got[sub] = (got[sub] || 0) + 1;
  });

  // The bank gives Abstract/Pattern, Spatial and Data Interpretation only
  // ONE question each — a raw correct/total off a single question is either
  // a hard 0% or 100%, which isn't enough evidence to claim that confidently,
  // and a single lucky/unlucky question was swinging an entire domain's
  // affinity by ~30 points downstream (calculateDomainAffinities below).
  // Shrink each sub-score toward the student's overall aptitude rate,
  // weighted by 2 "phantom" questions of prior uncertainty — the same
  // technique lib/newAssessment/scoring60.ts already uses for class 9-10's
  // aptitude, for the identical reason. Fields with real question counts
  // (Numerical has 4, Logical has 3) are barely affected; the 1-question
  // fields move from a hard 0/100 toward something more honest.
  const totalCorrect = Object.values(got).reduce((s, v) => s + v, 0);
  const totalQuestions = Object.values(of).reduce((s, v) => s + v, 0);
  const overallRate = totalQuestions ? totalCorrect / totalQuestions : 0.5;
  const PRIOR_ITEMS = 2;

  const fields = {} as AptitudeProfile;
  const scoresForOverall: number[] = [];
  for (const f of APTITUDE_FIELDS) {
    const total = of[f.subdomain] || 0;
    const correct = got[f.subdomain] || 0;
    const shrunkRate = total ? (correct + PRIOR_ITEMS * overallRate) / (total + PRIOR_ITEMS) : overallRate;
    const score = Math.round(shrunkRate * 100);
    if (total) scoresForOverall.push(score);
    (fields as any)[f.key] = { score, correct, total, interpretation: interpretAptitudeScore(score, f.label) };
  }
  const overallScore = scoresForOverall.length ? Math.round(scoresForOverall.reduce((s, v) => s + v, 0) / scoresForOverall.length) : 0;
  const byScore = APTITUDE_FIELDS.map((f) => ({ label: f.label, score: (fields as any)[f.key].score as number }));

  return {
    ...fields,
    overallScore,
    strength: byScore.slice().sort((a, b) => b.score - a.score)[0]?.label ?? "Numerical",
    weakness: byScore.slice().sort((a, b) => a.score - b.score)[0]?.label ?? "Numerical",
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

// The real Strengths construct — standard workplace-competency domains, not
// the same 8 Gardner Multiple Intelligences shown a second time under a
// different name (that was the actual bug: every "Strengths" card was just
// re-displaying the Multiple Intelligence card's own data). Genuinely
// separate question bank (data/class-11-12/questions-corrected.json's
// "strengths" set) and a genuinely separate PsychometricProfile field
// (multipleIntelligence, scored by scoreMultipleIntelligence below) now
// back the Multiple Intelligence dimension instead.
const STRENGTH_AREA_EXAMPLES: Record<string, string[]> = {
  "Intellectual & Analytical": ["Root-cause analysis", "Logical troubleshooting", "Breaking down complexity"],
  "Creative & Innovative": ["Original ideas", "Unconventional angles", "Reframing problems"],
  "Strategic & Futuristic": ["Long-term planning", "Big-picture view", "Anticipating trends"],
  "Execution & Achievement": ["Turning ideas into results", "Consistent follow-through", "Getting things done"],
  "Influence & Leadership": ["Persuasion", "Taking ownership", "Motivating others"],
  "Relationship & Adaptability": ["Empathy", "Building rapport", "Adjusting to new situations"],
};

// Shared by scoreStrengthAreas/scoreMultipleIntelligence — each question
// offers some subset of a domain list as options, so "how often a domain was
// AVAILABLE to pick" (not a flat question count) is the right denominator
// for its percentage; a domain absent from a given question shouldn't be
// penalised for not being chosen there.
function tallyDomainAvailability(questions: any[], responses: Record<string, number>): { got: Record<string, number>; of: Record<string, number> } {
  const got: Record<string, number> = {};
  const of: Record<string, number> = {};
  questions.forEach((q, i) => {
    const idx = responses[String(i)];
    if (!Array.isArray(q.mapping)) return;
    q.mapping.forEach((domain: string, optIdx: number) => {
      of[domain] = (of[domain] || 0) + 1;
      if (optIdx === idx) got[domain] = (got[domain] || 0) + 1;
    });
  });
  return { got, of };
}

function scoreStrengthAreas(responses: Record<string, number>, setName?: string): StrengthDomainScore[] {
  const { got, of } = tallyDomainAvailability(strengthsQuestions(setName), responses);
  // /5 scale, matching how the report displays it ("score/5").
  return Object.keys(STRENGTH_AREA_EXAMPLES)
    .map((domain) => ({
      domain,
      score: of[domain] ? Math.round(((got[domain] || 0) / of[domain]) * 5 * 10) / 10 : 0,
      examples: STRENGTH_AREA_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMultipleIntelligence(responses: Record<string, number>): StrengthDomainScore[] {
  const { got, of } = tallyDomainAvailability(Q.multiple_intelligence, responses);
  return Object.keys(MI_EXAMPLES)
    .map((domain) => ({
      domain,
      score: of[domain] ? Math.round(((got[domain] || 0) / of[domain]) * 5 * 10) / 10 : 0,
      examples: MI_EXAMPLES[domain],
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Record<string, number>): MotivatorProfile {
  const tally = tallyMapped(Q.motivators, responses);
  // Q48/Q49 (indices 4-5) are plain 1-10 sliders, not mapped options — they
  // add a fractional vote (0-1) to the tag they each directly measure,
  // rather than being silently dropped by tallyMapped for having no mapping.
  const financialSecurity = responses["4"];
  if (typeof financialSecurity === "number") tally["Financial Security"] = (tally["Financial Security"] || 0) + financialSecurity / 10;
  const meaningfulWork = responses["5"];
  if (typeof meaningfulWork === "number") tally["Learning"] = (tally["Learning"] || 0) + meaningfulWork / 10;
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
  // Q52 (index 2) is a 1-10 slider on doing-over-reading — a direct,
  // fractional vote for "Kinesthetic", not an option tallyMapped can see.
  const doingPreference = responses["2"];
  if (typeof doingPreference === "number") tally["Kinesthetic"] = (tally["Kinesthetic"] || 0) + doingPreference / 10;
  // The standard 4 VARK style names, matching class 9-10's own naming
  // (scoring60.ts) exactly — this used to be ["Visual", "Read/Write",
  // "Social", "Practice"], two of which ("Social", "Practice") aren't VARK
  // categories at all, so the same report showed different learning-style
  // names depending on which class the student was in.
  const styles = ["Visual", "Auditory", "Reading/Writing", "Kinesthetic"];
  const ranked = styles.slice().sort((a, b) => (tally[b] || 0) - (tally[a] || 0));
  const total = Object.values(tally).reduce((s, v) => s + v, 0);
  const pctOf = (style: string) => (total > 0 ? Math.round(((tally[style] || 0) / total) * 100) : 25);

  return {
    primaryStyle: ranked[0],
    secondaryStyle: ranked[1],
    examPreparationTechnique: getExamTechnique(styles.indexOf(ranked[0])),
    recommendations: generateLearningRecommendations(styles.indexOf(ranked[0])),
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
    ranked,
    selfAwareness,
    selfManagement,
    socialAwareness,
    relationshipManagement,
    emotionalRegulation: interpretEIResponse(selfManagement),
    conflictResolution: interpretEIResponse(relationshipManagement),
    summary: ranked[0] && ranked[0].score > 0 ? `${ranked[0].tag} is your strongest tendency under pressure or feedback.` : "Your responses are fairly balanced across all four areas.",
  };
}

/**
 * LAYER 2: Academic Reality Analysis
 */
function generateAcademicRealityAnalysis(
  responses: Class11Response,
  profile: PsychometricProfile,
  domainAffinities: Class11ScoreOutput["domainAffinities"]
): AcademicRealityAnalysis {
  const stream = responses.subject_fit.currentStream;
  const subjects = responses.subject_fit.currentSubjects;
  // careerfit1112.ts's Native-Fit test needs the precise stream key (e.g.
  // "Commerce+Maths" vs "Commerce (CEC, no Maths)") — subject_fit.currentStream
  // only has the coarser pre-split "Commerce" bucket, so prefer
  // currentStreamDetailed where it's set (same fallback pattern used
  // throughout careerFit1112Sheets.tsx/class11ExtraSheets.tsx).
  const streamKeyDetailed = responses.currentStreamDetailed || stream;
  const suitability = assessStreamSuitability(streamKeyDetailed, domainAffinities);

  return {
    currentStream: stream,
    streamSuitability: suitability,
    subjectStrengths: identifySubjectStrengths(subjects, profile),
    subjectChallenges: identifySubjectChallenges(subjects, profile),
    enjoyedSubject: responses.subject_fit.enjoyedSubject,
    difficultSubject: responses.subject_fit.difficultSubject,
    currentSubjects: subjects,
    streamChoiceReasons: responses.subject_fit.streamChoiceReasons,
    careerPathwaysAvailable: getAvailablePathways(stream, profile),
    careerSuitability: getCareerSuitability(streamKeyDetailed),
    nextSteps: suitability === "Misaligned"
      ? ["Talk to a counsellor about your stream fit before locking in exams", "Shortlist entrance exams for your top domain instead of your current stream", "Start projects relevant to your top domain now, alongside your stream subjects"]
      : ["Focus on your strongest subjects", "Prepare for the entrance exams your top domain needs", "Start projects relevant to your interests"]
  };
}

/**
 * LAYER 3: Education & Career Pathway
 */
function generateEducationPathway(
  responses: Class11Response,
  profile: PsychometricProfile,
  analysis: AcademicRealityAnalysis,
  domainAffinities: Class11ScoreOutput["domainAffinities"],
  careerMatch: CareerMatch
): EducationPathway {
  const topDomain = domainAffinities[0];
  // The roadmap follows careerMatch.roadmapDomain — the student's own chosen
  // career when they named one, not always the fitment domain — see
  // resolveCareerMatch's comment for why.
  const roadmapDomain = careerMatch.roadmapDomain ?? topDomain?.domain;
  const roadmapDomainName = careerMatch.roadmapDomainName ?? topDomain?.domainName;
  return {
    recommendedDegrees: getRecommendedDegrees(profile),
    entranceExamsRequired: getEntranceExams(analysis.currentStream, profile),
    subjectsToFocus: analysis.subjectStrengths,
    skillsDevelopmentPlan: generateSkillGaps(roadmapDomain),
    timelineUpto22: generateRoadmap(roadmapDomainName),
    universities: getUniversityMatches(profile)
  };
}

/**
 * LAYER 4: Student Aspiration
 */
function generateStudentAspiration(
  responses: Class11Response,
  profile: PsychometricProfile,
  academic: AcademicRealityAnalysis,
  domainAffinities: Class11ScoreOutput["domainAffinities"],
  careerMatch: CareerMatch
): StudentAspiration {
  const primaryCareer = responses.career_selector.primaryCareer;
  const clarity = responses.career_fit.clarity;

  const psychometricAlignment = calculatePsychometricAlignment(primaryCareer, domainAffinities);
  const streamAlignment = calculateStreamAlignment(academic.streamSuitability);
  const aptitudeAlignment = Math.round(profile.aptitude.overallScore);

  return {
    primaryCareerGoal: primaryCareer,
    clarityScore: clarity,
    alternativeOptions: responses.career_selector.alternativeChoices,
    consideringAreas: responses.career_fit.consideringAreas,
    excludedCareers: responses.career_selector.excludedCareers,
    topConcerns: responses.career_fit.topConcerns,
    pathwayType: responses.career_fit.pathwayType,
    motivationFactors: extractMotivationFactors(profile.motivators),
    careerMatch,
    alignment: {
      psychometricAlignment,
      streamAlignment,
      aptitudeAlignment,
      overallFitment: Math.round((psychometricAlignment + streamAlignment + aptitudeAlignment) / 3),
    },
    advice: generateCareerAdvice(primaryCareer, clarity),
    estimatedPercentage: responses.estimatedPercentage,
  };
}

/**
 * FINAL SUMMARY: Career Recommendations
 */
function generateCareerRecommendations(
  layer1: PsychometricProfile,
  layer2: AcademicRealityAnalysis,
  domainAffinities: Class11ScoreOutput["domainAffinities"]
): CareerRecommendations {
  return {
    alternativePaths: generateAlternativePaths(domainAffinities),
    riskFactors: identifyRiskFactors(layer1, layer2),
    strengthToLeverage: identifyStrengths(layer1),
    growthAreas: identifyGrowthAreas(layer1)
  };
}

/** Every Layer 1 score normalised to 0-100, in one place — used to pick
 *  real strengths/growth areas instead of a fixed list. Mirrors the radar
 *  math in the report component, kept here too since the scoring layer
 *  shouldn't depend on the UI layer for a plain data computation. */
function layer1DimensionScores(profile: PsychometricProfile): { label: string; score: number }[] {
  const topRiasec = profile.riasec.slice().sort((a, b) => b.percentile - a.percentile)[0]?.percentile ?? 0;
  // Matches adaptClass11.ts's `strengthsScore` exactly (top intelligence,
  // blended with aptitude) — this used to be a flat average across all 8
  // strength domains instead, a DIFFERENT number from the one the report's
  // own "Strengths" dimension page shows for the same student (e.g. 21 here
  // vs 54 there, for the same profile), which read as a direct contradiction
  // when both numbers appeared in the same report under the same word.
  const topStrengthPct = profile.strengthDomains.length
    ? Math.round((Math.max(...profile.strengthDomains.map((d) => d.score)) / 5) * 100)
    : 0;
  const strengthDomainsScore = Math.round(topStrengthPct * 0.6 + profile.aptitude.overallScore * 0.4);
  const eiP = profile.emotionalIntelligence;
  const ei = ((eiP.selfAwareness + eiP.selfManagement + eiP.socialAwareness + eiP.relationshipManagement) / 4) * 100;
  return [
    { label: "Personality clarity", score: profile.personality.score },
    { label: "Career interest", score: Math.round(topRiasec) },
    { label: "Aptitude & reasoning", score: Math.round(profile.aptitude.overallScore) },
    { label: "Strength domains", score: strengthDomainsScore },
    { label: "Motivator clarity", score: profile.motivators.score },
    { label: "Learning style", score: profile.learningStyle.score },
    { label: "Emotional intelligence", score: Math.round(ei) },
  ];
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================


function interpretAptitudeScore(score: number, domain: string): string {
  if (score >= 85) return `Excellent ${domain} reasoning`;
  if (score >= 65) return `Good ${domain} skills`;
  if (score >= 40) return `Adequate ${domain} ability`;
  return `Developing ${domain} skills`;
}

const APTITUDE_DOMAINS = ["Verbal", "Numerical", "Logical", "Visual", "Pattern Recognition"];

function getAptitudeStrength(scores: number[]): string {
  const maxIdx = scores.indexOf(Math.max(...scores));
  return APTITUDE_DOMAINS[maxIdx];
}

function getAptitudeWeakness(scores: number[]): string {
  const minIdx = scores.indexOf(Math.min(...scores));
  return APTITUDE_DOMAINS[minIdx];
}

// Which broad domains (lib/report/knowledge.ts DOMAINS keys) each stream
// realistically opens the door to — used to check the stream the student is
// ALREADY in against the domain their actual profile points toward, rather
// than assuming every stream suits everyone. Rebuilt for the 15-domain
// catalogue — real-world eligibility is inherently uneven (Science opens
// the most domains, Commerce/Arts/Vocational fewer), so this is deliberately
// NOT balanced the way the signal-averaging tables above are.
/** Well/Partially/Misaligned — whether the top-ranked (or top-3) Career
 *  Fitment domain is actually reachable (Native Fit, no bridge) from this
 *  stream, per CAREERS_1112's own ROADMAP_MATRIX — the same authoritative
 *  table Career Suitability filters against, replacing a separate
 *  hand-maintained per-stream compatible-domains list that didn't know
 *  about the 27-domain catalogue or the Commerce Maths/no-Maths split. */
function assessStreamSuitability(appStreamKey: string, domainAffinities: Class11ScoreOutput["domainAffinities"]): "Well-matched" | "Partially-matched" | "Misaligned" {
  const compatible = domainsCompatibleWithStream1112(appStreamKey);
  const top = domainAffinities[0];
  if (!top) return "Partially-matched";
  if (compatible.has(top.domain)) return "Well-matched";
  const withinTopThree = domainAffinities.slice(0, 3).some((d) => compatible.has(d.domain));
  return withinTopThree ? "Partially-matched" : "Misaligned";
}

// Keyword match from a typed subject name to the aptitude sub-score it's
// closest to — robust to the exact subject list a student typed in, since
// there's no fixed enum of subjects to switch on.
const SUBJECT_APTITUDE: Record<string, AptitudeScoreField> = {
  mathematics: "numerical", maths: "numerical", math: "numerical", accountancy: "numerical", accounts: "numerical",
  economics: "numerical", statistics: "numerical", "business studies": "numerical", business: "numerical",
  physics: "logical", chemistry: "logical", biology: "logical", "computer science": "logical", computer: "logical",
  informatics: "logical", programming: "logical",
  english: "verbal", history: "verbal", "political science": "verbal", "political  science": "verbal",
  sociology: "verbal", psychology: "verbal", geography: "verbal", languages: "verbal", literature: "verbal",
  "fine arts": "spatial", art: "spatial", design: "spatial", "graphic design": "spatial",
};

function subjectAptitudeScore(subject: string, aptitude: AptitudeProfile): number {
  const key = SUBJECT_APTITUDE[subject.toLowerCase().trim()];
  if (!key) return 50; // no mapping for this subject — neutral, not a guess
  return aptitude[key]?.score ?? 50;
}

function identifySubjectStrengths(subjects: string[], profile: PsychometricProfile): string[] {
  return subjects
    .map((s) => ({ s, score: subjectAptitudeScore(s, profile.aptitude) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(2, subjects.length))
    .map((x) => x.s);
}

function identifySubjectChallenges(subjects: string[], profile: PsychometricProfile): string[] {
  return subjects
    .map((s) => ({ s, score: subjectAptitudeScore(s, profile.aptitude) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, Math.min(1, subjects.length))
    .map((x) => x.s);
}

function getAvailablePathways(stream: string, profile: PsychometricProfile): string[] {
  const pathways: Record<string, string[]> = {
    "MPC": ["Engineering", "Technology", "Physical Sciences"],
    "BiPC": ["Medicine", "Biotech", "Life Sciences"],
    "PCMB": ["Engineering + Medicine", "Biotech", "Environmental Science"],
    "Arts": ["Humanities", "Social Sciences", "Law", "Media"],
    "Commerce": ["Business", "Finance", "Economics", "Entrepreneurship"],
    "Vocational": ["Applied Trades", "Design", "Entrepreneurship"],
  };
  return pathways[stream] || [];
}

function getRecommendedDegrees(profile: PsychometricProfile): DegreeOption[] {
  const topRIASEC = profile.riasec[0]?.code;

  const degreeMap: Record<string, DegreeOption[]> = {
    R: [
      {
        name: "B.Tech (Mechanical Engineering)",
        compatibility: 85,
        requiredSubjects: ["Physics", "Mathematics"],
        careerOutcomes: ["Engineer", "Technician", "Consultant"],
        topColleges: ["IIT Delhi", "NIT Rourkee"]
      }
    ],
    I: [
      {
        name: "B.Sc (Physics)",
        compatibility: 90,
        requiredSubjects: ["Physics", "Mathematics", "Chemistry"],
        careerOutcomes: ["Scientist", "Researcher", "Professor"],
        topColleges: ["Delhi University", "IIT Delhi"]
      }
    ],
    A: [
      {
        name: "B.Des (Graphic Design)",
        compatibility: 88,
        requiredSubjects: ["Art", "Design"],
        careerOutcomes: ["Designer", "Animator", "Creative Director"],
        topColleges: ["NID Ahmedabad", "IIAD Delhi"]
      }
    ],
    S: [
      {
        name: "B.A (Psychology)",
        compatibility: 85,
        requiredSubjects: ["Psychology", "English"],
        careerOutcomes: ["Counselor", "Social Worker", "HR"],
        topColleges: ["Delhi University", "Miranda House"]
      }
    ],
    E: [
      {
        name: "B.Com / B.B.A",
        compatibility: 90,
        requiredSubjects: ["Mathematics", "Economics"],
        careerOutcomes: ["Entrepreneur", "Consultant", "Manager"],
        topColleges: ["Sri Ram College", "Delhi Business School"]
      }
    ],
    C: [
      {
        name: "B.Com (Accounts)",
        compatibility: 85,
        requiredSubjects: ["Accounts", "Mathematics"],
        careerOutcomes: ["Accountant", "CA", "Auditor"],
        topColleges: ["Sri Ram College", "NMIMS"]
      }
    ]
  };

  return degreeMap[topRIASEC] || [];
}

// The major state-level engineering CETs — real, separate exams from JEE,
// each the standard route into that state's own government-quota
// engineering/pharmacy seats. A student only ever sits the exam(s) for the
// state(s) they're actually targeting, but which ones exist at all varies
// enormously by state, so the full real set is listed rather than just the
// 2-3 national exams that used to be shown here.
const MPC_STATE_CETS = ["MHT-CET", "KCET", "WBJEE", "COMEDK UGET", "KEAM", "AP EAPCET", "TS EAPCET"];

function getEntranceExams(stream: string, profile: PsychometricProfile): string[] {
  const exams: Record<string, string[]> = {
    "MPC": ["JEE Main", "JEE Advanced", "BITSAT", ...MPC_STATE_CETS, "NDA", "NATA"],
    "BiPC": ["NEET", "ICAR AIEEA", "CUET"],
    "PCMB": ["JEE Main", "JEE Advanced", "BITSAT", "NEET", ...MPC_STATE_CETS, "ICAR AIEEA", "NDA", "NATA"],
    "Arts": ["CLAT", "AILET", "CUET"],
    "Commerce": ["CUET", "CA Foundation", "CMA Foundation", "CS Foundation", "IPMAT"],
    "Vocational": ["Varies by field — many diploma/vocational programs admit directly, without a national entrance exam"],
  };
  return exams[stream] || [];
}

/** Real key skills for the student's actual top domain (lib/report/knowledge.ts),
 *  not one fixed "Communication" entry for every student regardless of profile. */
function generateSkillGaps(topDomainKey: string | undefined): SkillGap[] {
  const domain = topDomainKey ? DOMAINS[topDomainKey] : undefined;
  const skills = domain?.skills?.slice(0, 4) ?? ["Communication", "Problem-solving", "Time management"];
  return skills.map((skill, i) => ({
    skill,
    currentLevel: i === 0 ? "Intermediate" : "Beginner",
    targetLevel: "Advanced",
    developmentMethod: domain?.howToJoin?.[i] ?? "Practice through real projects, structured courses and feedback",
    timeRequired: i === 0 ? "3-6 months" : "6-12 months",
  }));
}

/** Reuses the same domain-specific 20-year roadmaps the Class 9-10 report
 *  uses (lib/report/knowledge.ts) instead of two generic phases that never
 *  changed no matter what the student's profile said. */
function generateRoadmap(topDomainName: string | undefined): RoadmapPhase[] {
  const phases = knowledgeRoadmap("11-12", topDomainName ?? "");
  return phases.map((p) => ({
    period: p.period,
    focus: p.title,
    actions: p.points,
    outcomes: [],
  }));
}

function getUniversityMatches(profile: PsychometricProfile): UniversityOption[] {
  return [
    {
      name: "IIT Delhi",
      location: "Delhi",
      programsAligned: ["Computer Science", "Electronics"],
      entranceRequired: "JEE Advanced",
      cutoffEstimate: "99+ percentile"
    }
  ];
}

const STREAM_SUITABILITY_PCT: Record<AcademicRealityAnalysis["streamSuitability"], number> = {
  "Well-matched": 85, "Partially-matched": 60, "Misaligned": 35,
};

/** Does the career the student TYPED actually match a domain their answers
 *  point toward? Resolved via findCareer1112() — the exact CAREERS_1112
 *  lookup, not a name/role substring search against the older 8-domain
 *  catalogue — and its affinity score comes straight from domainAffinities,
 *  which now shares the same 27-domain keys. If it's not found at all, we
 *  can't confirm the wanted career lines up with the profile, so the score
 *  is discounted rather than assumed. */
function calculatePsychometricAlignment(career: string, domainAffinities: Class11ScoreOutput["domainAffinities"]): number {
  if (!career) return domainAffinities[0]?.affinity ?? 50;
  const match = findCareer1112(career);
  if (match) {
    const d = domainAffinities.find((x) => x.domain === match.domain);
    if (d) return d.affinity;
  }
  // No confirmed match — the stated goal isn't confirmed by the profile,
  // so discount the top domain's score rather than silently reusing it.
  return Math.round((domainAffinities[0]?.affinity ?? 50) * 0.6);
}

function calculateStreamAlignment(streamSuitability: AcademicRealityAnalysis["streamSuitability"]): number {
  return STREAM_SUITABILITY_PCT[streamSuitability];
}

/** Domains #2-4 by affinity — the top domain already has its own full page,
 *  so "alternative paths" means the next-best real matches, not a repeat. */
function generateAlternativePaths(domainAffinities: Class11ScoreOutput["domainAffinities"]): string[] {
  return domainAffinities.slice(1, 4).map((d) => d.domainName);
}

function identifyRiskFactors(profile: PsychometricProfile, analysis: AcademicRealityAnalysis): string[] {
  const risks: string[] = [];
  if (analysis.streamSuitability === "Misaligned") {
    risks.push("Your current stream doesn't clearly support the domain your profile points toward — worth a conversation with a counsellor before board exams lock in your options.");
  } else if (analysis.streamSuitability === "Partially-matched") {
    risks.push("Your stream partially supports your top domain — some extra groundwork (bridge courses, electives, self-study) may be needed to keep that path open.");
  }
  const weakest = layer1DimensionScores(profile).slice().sort((a, b) => a.score - b.score)[0];
  if (weakest && weakest.score < 40) {
    risks.push(`${weakest.label} is your least developed area right now (${weakest.score}/100) — worth deliberate practice rather than avoidance.`);
  }
  if (!risks.length) risks.push("No major misalignment found between your stream, profile and stated goal — the main risk here is complacency, not direction.");
  return risks;
}

function identifyStrengths(profile: PsychometricProfile): string[] {
  return layer1DimensionScores(profile)
    .slice().sort((a, b) => b.score - a.score).slice(0, 3)
    .map((d) => `${d.label} (${d.score}/100)`);
}

function identifyGrowthAreas(profile: PsychometricProfile): string[] {
  return layer1DimensionScores(profile)
    .slice().sort((a, b) => a.score - b.score).slice(0, 3)
    .map((d) => `${d.label} (${d.score}/100)`);
}

function generateCareerAdvice(career: string, clarity: number): string {
  if (clarity >= 8) {
    return `You have clear career direction. Focus on getting into relevant programs and gaining experience.`;
  }
  return `Explore more careers before deciding. Consider internships and project-based learning.`;
}

function extractMotivationFactors(motivators: MotivatorProfile): string[] {
  return motivators.ranked.slice(0, 3).map((m) => m.tag);
}

// Index order must match scoreLearningStyle's own `styles` array exactly
// (Visual, Auditory, Reading/Writing, Kinesthetic) — these used to be
// ordered for the old ["Visual", "Read/Write", "Social", "Practice"] array,
// so renaming that array without reordering these two would have silently
// handed a student's "Auditory" result the old "Read/Write" technique text.
function getExamTechnique(styleIdx: number): string {
  const techniques = [
    "Visual summaries",
    "Discussion-based",
    "Reading and rewriting",
    "Practice-focused"
  ];
  return techniques[styleIdx] || "Balanced approach";
}

function generateLearningRecommendations(styleIdx: number): string[] {
  const recommendations = [
    ["Use mind maps", "Watch educational videos", "Create infographics"],
    ["Form study groups", "Teach others", "Listen to lectures"],
    ["Make detailed notes", "Read textbooks", "Write summaries"],
    ["Do practice problems", "Projects", "Hands-on activities"]
  ];
  return recommendations[styleIdx] || [];
}

// `response` is a 0-1 fraction of how developed the selected option was for
// that EI dimension (see scoreEI).
function interpretEIResponse(response: number): string {
  if (response >= 0.75) return "Handles this proactively and reflectively";
  if (response >= 0.5) return "Reasonably steady, with room to grow";
  if (response >= 0.25) return "Still developing a consistent approach";
  return "Tends to avoid or delay dealing with this";
}

function generatePersonalitySummary(traits: { ei: string; sn: string; tf: string; jp: string; type: string }): string {
  const ei = traits.ei === "E" ? "draws energy from people and action" : "draws energy from quiet, focused time";
  const jp = traits.jp === "J" ? "prefers structure and planning" : "stays flexible and open-ended";
  return `You are a ${traits.type} — you ${ei}, and ${jp}.`;
}
