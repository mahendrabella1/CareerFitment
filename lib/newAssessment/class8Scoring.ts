/**
 * Class 8 Career Discovery Assessment Scoring
 * Maps 60 questions across 8 dimensions with professional mapping
 *
 * Structure:
 * - Q1-Q10: Personality Preferences (MBTI-style: E/I, S/N, T/F, J/P)
 * - Q11-Q20: Career Interests RIASEC (6 codes: R, I, A, S, E, C)
 * - Q21-Q30: Aptitude & Reasoning (10 skill types with correct/incorrect)
 * - Q31-Q38: MI Strength Domains (8 intelligences)
 * - Q39-Q45: Motivators & Values (7 motivator types)
 * - Q46-Q50: Learning Preferences (4 styles)
 * - Q51-Q55: Emotional & Social Awareness (4 EI components)
 * - Q56-Q60: Creativity & Future Readiness (4 indicators)
 */
import { DOMAINS, DOMAIN_RIASEC, DOMAIN_MI } from "@/lib/report/knowledge";
import { CLASS8_QUESTIONS } from "@/lib/newAssessment/class8Questions";

// Reads an option's own `mapping` tag straight off the question bank
// (lib/newAssessment/class8Questions.ts, regenerated from class8sheet.xlsx)
// instead of a hardcoded per-question table. This file used to hand-author
// a {questionId: {optionIndex: category}} table per section, and several of
// those tables were written against an earlier version of the bank: once
// the bank was regenerated, Strengths/Motivators/Learning/Emotional/
// Creativity all drifted out of sync with it in different ways (see the
// commit that introduced this helper for the specifics). Reading the
// option's own tag directly makes that drift structurally impossible.
function bankOptionMapping(id: number, optionIndex: number): string | undefined {
  const q = CLASS8_QUESTIONS.find((q) => q.id === id);
  return q?.options[optionIndex]?.mapping;
}

export interface Class8Response {
  studentName: string;
  responses: Record<number, number>; // question ID -> option index (0-4)
}

export interface Class8ScoreOutput {
  studentName: string;
  personalityProfile: PersonalityProfile;
  riasecScores: RIASECScore[];
  aptitudeProfile: AptitudeProfile;
  strengthDomains: StrengthDomain[];
  motivators: MotivatorScore[];
  learningStyle: LearningStyleProfile;
  emotionalAwareness: EIComponent[];
  creativity: CreativityIndicator[];
  domainAffinities: DomainAffinity[];
  summary: AssessmentSummary;
}

// ============================================================================
// PERSONALITY PREFERENCES (PP)
// ============================================================================

export interface PersonalityProfile {
  ei: string; // E or I
  sn: string; // S or N
  tf: string; // T or F
  jp: string; // J or P
  type: string; // e.g., INTJ
  // 0-100: how consistently the student picked one side of each axis, not
  // "how good" a personality - used as the dimension's scorecard/radar
  // score, since the four letters alone aren't a number.
  score: number;
  // 0-10 per axis, midpoint 5: >=5 leans toward the first letter shown
  // for that axis (E/S/T/J), below 5 leans toward the second (I/N/F/P).
  // Powers the compass visual, which needs a position per axis, not just
  // which letter won.
  axisScores: { ei: number; sn: number; tf: number; jp: number };
}

// ============================================================================
// RIASEC CAREER INTERESTS
// ============================================================================

export interface RIASECScore {
  code: string; // R, I, A, S, E, or C
  name: string;
  score: number; // 0-100 percentage
  percentile: number;
  description: string;
}

const RIASEC_INFO: Record<string, any> = {
  R: {
    name: "Realistic",
    description: "Hands-on, practical, technical, building things",
    careers: "Engineer, technician, mechanic, trades, construction",
  },
  I: {
    name: "Investigative",
    description: "Research, analysis, problem-solving, discovery",
    careers: "Scientist, researcher, programmer, analyst, data scientist",
  },
  A: {
    name: "Artistic",
    description: "Creative, design, self-expression, aesthetics",
    careers: "Designer, artist, writer, musician, content creator",
  },
  S: {
    name: "Social",
    description: "Helping, teaching, counseling, people-oriented",
    careers: "Teacher, counselor, nurse, social worker, coach",
  },
  E: {
    name: "Enterprising",
    description: "Leadership, sales, entrepreneurship, competitive",
    careers: "Manager, entrepreneur, salesman, business leader",
  },
  C: {
    name: "Conventional",
    description: "Organization, systems, data, order",
    careers: "Accountant, administrator, data manager, planner",
  },
};

// ============================================================================
// APTITUDE & REASONING
// ============================================================================

export interface AptitudeProfile {
  numericReasoning: {
    score: number; // 0-100
    level: "Basic" | "Developing" | "Strong" | "Advanced";
    interpretation: string;
  };
  logicalDeduction: {
    score: number;
    level: "Basic" | "Developing" | "Strong" | "Advanced";
    interpretation: string;
  };
  patternRecognition: {
    score: number;
    level: "Basic" | "Developing" | "Strong" | "Advanced";
    interpretation: string;
  };
  spatialReasoning: {
    score: number;
    level: "Basic" | "Developing" | "Strong" | "Advanced";
    interpretation: string;
  };
  overallScore: number; // Average of all aptitudes
  strengths: string[];
  developmentAreas: string[];
}

// Mapping of Q21-Q30 to aptitude categories
const APTITUDE_MAPPING: Record<number, string> = {
  21: "pattern", // Numeric pattern
  22: "logic", // Verbal logic
  23: "numeric", // Numeric reasoning
  24: "verbal", // Verbal classification
  25: "pattern", // Coding pattern
  26: "pattern", // Sequence pattern
  27: "logic", // Probability logic
  28: "logic", // Logical deduction
  29: "spatial", // Visual pattern
  30: "numeric", // Combinatorics
};

// Correct answers for Q21-Q30 (option indices: 0=A, 1=B, 2=C, 3=D)
const APTITUDE_CORRECT_ANSWERS: Record<number, number> = {
  21: 2, // "48"
  22: 1, // "Some roses may..."
  23: 2, // "150 km"
  24: 1, // "Carrot"
  25: 0, // "QFO"
  26: 2, // "17"
  27: 1, // "0.4"
  28: 1, // "Some A may be C"
  29: 3, // mirror-image figure (option D)
  30: 1, // "6"
};

// ============================================================================
// MULTIPLE INTELLIGENCE STRENGTH DOMAINS
// ============================================================================

export interface StrengthDomain {
  domain: string;
  code: string; // Lin, Log, Spa, Bod, Mus, Int, Intra, Nat
  score: number; // 0-100
  level: "Developing" | "Proficient" | "Strong" | "Advanced";
  careers: string[];
}

const MI_DOMAINS: Record<string, any> = {
  Linguistic: {
    code: "Lin",
    description: "Words, language, communication, writing",
    careers: ["Writer", "Lawyer", "Teacher", "Journalist", "Speaker"],
  },
  "Logical-Mathematical": {
    code: "Log",
    description: "Logic, math, patterns, analysis",
    careers: ["Engineer", "Scientist", "Programmer", "Analyst", "Mathematician"],
  },
  Spatial: {
    code: "Spa",
    description: "Visualization, design, maps, diagrams",
    careers: ["Architect", "Designer", "Artist", "Planner", "Surgeon"],
  },
  "Bodily-Kinesthetic": {
    code: "Bod",
    description: "Movement, sports, hands-on crafts",
    careers: ["Athlete", "Dancer", "Surgeon", "Craftsman", "Physical Therapist"],
  },
  Musical: {
    code: "Mus",
    description: "Rhythms, melodies, sound, music",
    careers: ["Musician", "Composer", "Sound Engineer", "DJ", "Music Teacher"],
  },
  Interpersonal: {
    code: "Int",
    description: "People skills, communication, empathy",
    careers: ["Counselor", "Manager", "Teacher", "Coach", "Social Worker"],
  },
  Intrapersonal: {
    code: "Intra",
    description: "Self-awareness, reflection, independence",
    careers: ["Researcher", "Philosopher", "Therapist", "Writer", "Consultant"],
  },
  Naturalistic: {
    code: "Nat",
    description: "Nature, living things, environment",
    careers: ["Biologist", "Veterinarian", "Farmer", "Gardener", "Conservationist"],
  },
};

// The bank tags MI options with a short form ("Logical-Math") that doesn't
// match the canonical DOMAIN_MI vocabulary this scorer's domain-affinity
// step keys on ("Logical-Mathematical") - normalise on the way in so a real
// answer still links to the right domain.
const MI_LABEL_ALIAS: Record<string, string> = {
  "Logical-Math": "Logical-Mathematical",
};

// ============================================================================
// MOTIVATORS & VALUES
// ============================================================================

export interface MotivatorScore {
  motivator: string;
  score: number; // 0-100
  level: "Low" | "Moderate" | "High" | "Very High";
  description: string;
}

// The bank's real Q39-Q45 vocabulary (Achievement/Service/Autonomy/
// Security/Growth - see class8Questions.ts) - not the 7-name list this file
// used to hardcode (Achievement/Curiosity/Helping/Freedom/Leadership/
// Stability/Innovation), which shared only "Achievement" with what the
// bank actually asks.
const MOTIVATOR_TYPES = [
  "Achievement",
  "Service",
  "Autonomy",
  "Security",
  "Growth",
];

// ============================================================================
// LEARNING STYLE
// ============================================================================

export interface LearningStyleProfile {
  primaryStyle: string; // Visual, Auditory, Reading/Writing, Kinesthetic
  secondaryStyle?: string;
  styleScores: Record<string, number>;
  recommendations: string[];
}

const LEARNING_STYLES = {
  Visual: "Prefers diagrams, images, colors, mind maps",
  Auditory: "Prefers listening, discussions, verbal explanation",
  "Reading/Writing": "Prefers reading, notes, written materials",
  Kinesthetic: "Prefers hands-on, practice, movement, experience",
};

// The bank tags Learning Preferences options "Auditory-Social"/"Read-Write"
// (see class8Questions.ts) rather than this file's "Auditory"/"Reading/
// Writing" - normalise on the way in so the output uses the same 4 style
// names as every other class's report.
const LEARNING_LABEL_ALIAS: Record<string, string> = {
  "Auditory-Social": "Auditory",
  "Read-Write": "Reading/Writing",
};

// ============================================================================
// EMOTIONAL & SOCIAL AWARENESS (EI)
// ============================================================================

export interface EIComponent {
  component: string; // whichever dimension names the bank's Q51-55 use
  score: number; // 0-100
  level: "Developing" | "Proficient" | "Strong" | "Advanced";
  description: string;
}

// ============================================================================
// CREATIVITY & FUTURE READINESS
// ============================================================================

export interface CreativityIndicator {
  indicator: string; // whichever indicator names the bank's Q56-60 use
  score: number; // 0-100
  level: "Emerging" | "Developing" | "Strong" | "Advanced";
  description: string;
}

// ============================================================================
// DOMAIN AFFINITY CALCULATION
// ============================================================================

export interface DomainAffinity {
  domain: string;
  domainCode: string;
  affinity: number; // 0-100
  reasoning: string[];
}

// Domain names/images/roles come from the shared DOMAINS catalogue in
// lib/report/knowledge.ts (imported above), not a local copy - this used to
// keep its own CAREER_DOMAINS table labelling G "Entrepreneurship &
// Innovation" and H "Agriculture & Environmental Science", while the domain
// card the report actually renders (FullReport.tsx, via lib/report/
// adaptClass678.ts) reads DOMAINS[d.domainCode] directly for the image/
// roles/skills/salary, where G/H are really "Science, Nature & Agriculture"
// and "Sports, Hospitality & Lifestyle" - a student could see a card titled
// "Entrepreneurship & Innovation" with a farming photo and agricultural
// roles underneath it. DOMAIN_RIASEC is shared for the same reason: this
// file's own RIASEC_TO_DOMAINS was built against those same wrong G/H
// meanings (e.g. routing Enterprising interest to "G" on the assumption G
// meant entrepreneurship).

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

export function validateResponses(responses: number[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (responses.length !== 60) {
    errors.push('Assessment requires exactly 60 responses');
  }

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    if (typeof response !== 'number' || response < 0 || response > 4) {
      errors.push(`Question ${i + 1}: Invalid response (must be 0-4)`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function class8Scorer(responses: number[]): Class8ScoreOutput {
  // Validate
  const validation = validateResponses(responses);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }

  // Convert to internal format
  const responsesRecord: Record<number, number> = {};
  responses.forEach((r, i) => {
    responsesRecord[i + 1] = r;
  });

  return scoreClass8Assessment({ studentName: '', responses: responsesRecord });
}

function validateResponsesObject(responses: Class8Response): void {
  if (!responses.responses || typeof responses.responses !== "object") {
    throw new Error("Invalid responses object");
  }

  // Check all 60 questions are answered
  const answered = Object.keys(responses.responses).length;
  if (answered < 60) {
    throw new Error(`Only ${answered}/60 questions answered`);
  }

  // Validate option ranges
  for (let i = 1; i <= 60; i++) {
    const option = responses.responses[i];
    if (option === undefined || option === null) {
      throw new Error(`Question ${i} not answered`);
    }
    if (typeof option !== "number" || option < 0 || option > 4) {
      throw new Error(`Question ${i}: Invalid option index ${option}`);
    }
  }
}

export function scoreClass8Assessment(responses: Class8Response): Class8ScoreOutput {
  // Validate responses
  validateResponsesObject(responses);

  // Score all dimensions
  const personalityProfile = scorePersonality(responses);
  const riasecScores = scoreRIASEC(responses);
  const aptitudeProfile = scoreAptitude(responses);
  const strengthDomains = scoreStrengthDomains(responses);
  const motivators = scoreMotivators(responses);
  const learningStyle = scoreLearningStyle(responses);
  const emotionalAwareness = scoreEmotionalAwareness(responses);
  const creativity = scoreCreativity(responses);

  // Calculate domain affinities based on all dimensions
  const domainAffinities = calculateDomainAffinities({
    personality: personalityProfile,
    riasec: riasecScores,
    strengths: strengthDomains,
    motivators,
    aptitude: aptitudeProfile,
  });

  // Generate summary
  const summary = generateSummary({
    name: responses.studentName,
    personality: personalityProfile,
    topRiasec: riasecScores[0],
    topDomain: domainAffinities[0],
    topStrength: strengthDomains[0],
  });

  return {
    studentName: responses.studentName,
    personalityProfile,
    riasecScores,
    aptitudeProfile,
    strengthDomains,
    motivators,
    learningStyle,
    emotionalAwareness,
    creativity,
    domainAffinities,
    summary,
  };
}

// ============================================================================
// SCORING IMPLEMENTATIONS
// ============================================================================


function scorePersonality(responses: Class8Response): PersonalityProfile {
  let ei = 0, sn = 0, tf = 0, jp = 0;

  // Q1-Q3: E/I - options 0-1 = E, options 2-3 = I
  for (const q of [1, 2, 3]) ei += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [1, 2, 3]) ei -= responses.responses[q] >= 2 ? 1 : 0;

  // Q4-Q5: S/N - options 0-1 = S, options 2-3 = N
  for (const q of [4, 5]) sn += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [4, 5]) sn -= responses.responses[q] >= 2 ? 1 : 0;

  // Q6-Q7: T/F - options 0-1 = T, options 2-3 = F
  for (const q of [6, 7]) tf += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [6, 7]) tf -= responses.responses[q] >= 2 ? 1 : 0;

  // Q8-Q10: J/P - options 0-1 = J, options 2-3 = P
  for (const q of [8, 9, 10]) jp += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [8, 9, 10]) jp -= responses.responses[q] >= 2 ? 1 : 0;

  const type =
    (ei >= 0 ? "E" : "I") +
    (sn >= 0 ? "S" : "N") +
    (tf >= 0 ? "T" : "F") +
    (jp >= 0 ? "J" : "P");

  // Clarity: how far each axis leans from an even split, averaged across
  // all four (ei/jp have 3 questions so max |3|, sn/tf have 2 so max |2|).
  const clarity = (Math.abs(ei) / 3 + Math.abs(sn) / 2 + Math.abs(tf) / 2 + Math.abs(jp) / 3) / 4;
  // sn/tf have only 2 questions deciding them, ei/jp only 3 - so answering
  // both/all the same way (the common case) always hit the max magnitude,
  // and the old formula read that as a literal 10.0/10 (100%). Two
  // consistent answers isn't certainty; shrink toward the midpoint by
  // roughly one question's worth of doubt before mapping to 0-10.
  const toAxis10 = (tally: number, maxMag: number) => {
    const winCount = (maxMag + tally) / 2;
    const prior = 1;
    const share = (winCount + prior / 2) / (maxMag + prior);
    return Math.round(share * 10 * 10) / 10;
  };

  return {
    ei: ei >= 0 ? "E" : "I",
    sn: sn >= 0 ? "S" : "N",
    tf: tf >= 0 ? "T" : "F",
    jp: jp >= 0 ? "J" : "P",
    type,
    score: Math.round(clarity * 100),
    axisScores: {
      ei: toAxis10(ei, 3),
      sn: toAxis10(sn, 2),
      tf: toAxis10(tf, 2),
      jp: toAxis10(jp, 3),
    },
  };
}

function scoreRIASEC(responses: Class8Response): RIASECScore[] {
  const scores: Record<string, number> = {
    R: 0,
    I: 0,
    A: 0,
    S: 0,
    E: 0,
    C: 0,
  };

  // Q11-Q20: Each question has 5 options mapped to RIASEC codes
  const riasecMapping: Record<number, Record<number, string>> = {
    11: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    12: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    13: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    14: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    15: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    16: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    17: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    18: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    19: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
    20: { 0: "R", 1: "I", 2: "A", 3: "S", 4: "E" },
  };

  for (let q = 11; q <= 20; q++) {
    const option = responses.responses[q];
    const code = riasecMapping[q][option];
    scores[code]++;
  }

  // Normalize and sort
  return Object.entries(scores)
    .map(([code, count]) => ({
      code,
      name: RIASEC_INFO[code].name,
      score: Math.round((count / 10) * 100),
      percentile: Math.round((count / 10) * 100),
      description: RIASEC_INFO[code].description,
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreAptitude(responses: Class8Response): AptitudeProfile {
  const categories = {
    numeric: { correct: 0, total: 0 },
    logic: { correct: 0, total: 0 },
    pattern: { correct: 0, total: 0 },
    spatial: { correct: 0, total: 0 },
    verbal: { correct: 0, total: 0 },
  };

  // Score Q21-Q30
  for (let q = 21; q <= 30; q++) {
    const category = APTITUDE_MAPPING[q] || "verbal";
    const answer = responses.responses[q];
    const correctAnswer = APTITUDE_CORRECT_ANSWERS[q];

    categories[category as keyof typeof categories].total++;
    if (answer === correctAnswer) {
      categories[category as keyof typeof categories].correct++;
    }
  }

  // Calculate scores
  const numericScore = Math.round((categories.numeric.correct / categories.numeric.total) * 100);
  const logicScore = Math.round((categories.logic.correct / categories.logic.total) * 100);
  const patternScore = Math.round((categories.pattern.correct / categories.pattern.total) * 100);
  const spatialScore = Math.round((categories.spatial.correct / categories.spatial.total) * 100);
  const overallScore = Math.round((numericScore + logicScore + patternScore + spatialScore) / 4);

  // Determine levels
  const getLevel = (score: number): "Basic" | "Developing" | "Strong" | "Advanced" => {
    if (score < 40) return "Basic";
    if (score < 65) return "Developing";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  // Identify strengths and development areas
  const scores = [
    { category: "Numeric", score: numericScore },
    { category: "Logic", score: logicScore },
    { category: "Pattern", score: patternScore },
    { category: "Spatial", score: spatialScore },
  ];

  const sorted = scores.sort((a, b) => b.score - a.score);
  const strengths = sorted.slice(0, 2).map((s) => `${s.category} reasoning`);
  const developmentAreas = sorted.slice(-2).map((s) => `${s.category} reasoning`);

  return {
    numericReasoning: {
      score: numericScore,
      level: getLevel(numericScore),
      interpretation: getAptitudeInterpretation(numericScore, "numeric"),
    },
    logicalDeduction: {
      score: logicScore,
      level: getLevel(logicScore),
      interpretation: getAptitudeInterpretation(logicScore, "logic"),
    },
    patternRecognition: {
      score: patternScore,
      level: getLevel(patternScore),
      interpretation: getAptitudeInterpretation(patternScore, "pattern"),
    },
    spatialReasoning: {
      score: spatialScore,
      level: getLevel(spatialScore),
      interpretation: getAptitudeInterpretation(spatialScore, "spatial"),
    },
    overallScore,
    strengths,
    developmentAreas,
  };
}

function scoreStrengthDomains(responses: Class8Response): StrengthDomain[] {
  const domains: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Q31-Q38: Score MI domains, reading each option's own tag directly
  for (let q = 31; q <= 38; q++) {
    for (let opt = 0; opt < 5; opt++) {
      const raw = bankOptionMapping(q, opt);
      if (!raw) continue;
      const domain = MI_LABEL_ALIAS[raw] ?? raw;
      of[domain] = (of[domain] || 0) + 1;
    }
    const option = responses.responses[q];
    const rawChosen = bankOptionMapping(q, option);
    if (rawChosen) {
      const domain = MI_LABEL_ALIAS[rawChosen] ?? rawChosen;
      domains[domain] = (domains[domain] || 0) + 1;
    }
  }

  // Normalize and convert
  const getLevel = (score: number): "Developing" | "Proficient" | "Strong" | "Advanced" => {
    if (score < 40) return "Developing";
    if (score < 65) return "Proficient";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  // Percentage of the times a domain was actually OFFERED, not a flat /8 -
  // this bank's Q31-38 never offer Intrapersonal or Naturalistic at all (a
  // real limit of this bank's content, not something to fabricate a slot
  // for), and the other 6 domains appear unevenly too.
  return Object.entries(domains)
    .map(([domain, count]) => {
      const score = of[domain] ? Math.round((count / of[domain]) * 100) : 0;
      return {
        domain,
        code: MI_DOMAINS[domain]?.code ?? domain,
        score,
        level: getLevel(score),
        careers: MI_DOMAINS[domain]?.careers ?? [],
      };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Class8Response): MotivatorScore[] {
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Initialize all motivators
  MOTIVATOR_TYPES.forEach((m) => {
    scores[m] = 0;
  });

  // Q39-Q45: each question offers all 5 real motivators (Achievement/
  // Service/Autonomy/Security/Growth) as its 5 options - a self-report
  // question, not a single-motivator Likert item - so which option the
  // student picks is what determines which motivator gets credited.
  for (let q = 39; q <= 45; q++) {
    for (let opt = 0; opt < 5; opt++) {
      const name = bankOptionMapping(q, opt);
      if (name) of[name] = (of[name] || 0) + 1;
    }
    const option = responses.responses[q];
    const motivator = bankOptionMapping(q, option);
    if (motivator) scores[motivator] = (scores[motivator] || 0) + 1;
  }

  const getLevel = (score: number): "Low" | "Moderate" | "High" | "Very High" => {
    if (score < 30) return "Low";
    if (score < 60) return "Moderate";
    if (score < 80) return "High";
    return "Very High";
  };

  // Percentage of the times actually picked out of the times offered (all 7
  // questions offer all 5 motivators, so this is equivalent to a flat /7,
  // written this way to stay consistent with the other self-report sections).
  return Object.entries(scores)
    .map(([motivator, count]) => {
      const score = of[motivator] ? Math.round((count / of[motivator]) * 100) : 0;
      return {
        motivator,
        score,
        level: getLevel(score),
        description: `${motivator} is a key driver in career satisfaction`,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreLearningStyle(responses: Class8Response): LearningStyleProfile {
  const scores: Record<string, number> = {
    Visual: 0,
    Auditory: 0,
    "Reading/Writing": 0,
    Kinesthetic: 0,
  };

  // Q46-Q50: the bank consistently offers Auditory-Social/Read-Write/
  // Visual/Kinesthetic in that order on every question - read each
  // question's own tag directly rather than assuming that order.
  for (let q = 46; q <= 50; q++) {
    const option = responses.responses[q];
    const raw = bankOptionMapping(q, option);
    const style = raw ? (LEARNING_LABEL_ALIAS[raw] ?? raw) : undefined;
    if (style && style in scores) scores[style]++;
  }

  // Normalize
  const normalized = {
    Visual: Math.round((scores.Visual / 5) * 100),
    Auditory: Math.round((scores.Auditory / 5) * 100),
    "Reading/Writing": Math.round((scores["Reading/Writing"] / 5) * 100),
    Kinesthetic: Math.round((scores.Kinesthetic / 5) * 100),
  };

  // Get dominant and secondary
  const entries = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const primary = entries[0][0];
  const secondary = entries[1][0];

  return {
    primaryStyle: primary,
    secondaryStyle: secondary,
    styleScores: normalized,
    recommendations: generateLearningRecommendations(primary),
  };
}

function scoreEmotionalAwareness(responses: Class8Response): EIComponent[] {
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Q51-Q55: the bank's real vocabulary here (Empathic/Problem-Focused/
  // Self-Regulated/Expressive/Defensive/Growth-Oriented/Analytical/Secure/
  // Boundary-Aware) varies question to question - read each option's own
  // tag directly rather than assuming a fixed 4-component set.
  for (let q = 51; q <= 55; q++) {
    for (let opt = 0; opt < 4; opt++) {
      const dim = bankOptionMapping(q, opt);
      if (dim) of[dim] = (of[dim] || 0) + 1;
    }
    const option = responses.responses[q];
    const component = bankOptionMapping(q, option);
    if (component) scores[component] = (scores[component] || 0) + 1;
  }

  const getLevel = (score: number): "Developing" | "Proficient" | "Strong" | "Advanced" => {
    if (score < 40) return "Developing";
    if (score < 65) return "Proficient";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  // Percentage of the times a component was actually OFFERED, not a flat
  // /5 - several components only appear on one of the 5 questions.
  return Object.entries(scores)
    .map(([component, count]) => {
      const score = of[component] ? Math.round((count / of[component]) * 100) : 0;
      return {
        component,
        score,
        level: getLevel(score),
        description: `${component} is an important aspect of your emotional intelligence`,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreCreativity(responses: Class8Response): CreativityIndicator[] {
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Q56-Q60: the bank's real vocabulary here (Divergent/Analytical/
  // Integrative/Cautious/Structured-Creative/Experimental/Early-Adopter/
  // Applied/Late-Adopter/Planner/Adaptive/Traditional/Innovative) varies
  // question to question - read each option's own tag directly rather than
  // assuming a fixed 4-indicator set.
  for (let q = 56; q <= 60; q++) {
    for (let opt = 0; opt < 4; opt++) {
      const ind = bankOptionMapping(q, opt);
      if (ind) of[ind] = (of[ind] || 0) + 1;
    }
    const option = responses.responses[q];
    const indicator = bankOptionMapping(q, option);
    if (indicator) scores[indicator] = (scores[indicator] || 0) + 1;
  }

  const getLevel = (score: number): "Emerging" | "Developing" | "Strong" | "Advanced" => {
    if (score < 40) return "Emerging";
    if (score < 65) return "Developing";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  return Object.entries(scores)
    .map(([indicator, count]) => {
      const score = of[indicator] ? Math.round((count / of[indicator]) * 100) : 0;
      return {
        indicator,
        score,
        level: getLevel(score),
        description: `${indicator} is a key component of your creative profile`,
      };
    })
    .sort((a, b) => b.score - a.score);
}

// Which of class8's own 4 aptitude sub-scores reinforce each domain - kept
// local since these field names (numericReasoning/logicalDeduction/
// patternRecognition/spatialReasoning) are specific to this file's own
// AptitudeProfile shape, not shared with the other classes' engines. Every
// domain gets exactly 2, matching DOMAIN_RIASEC/DOMAIN_MI's own
// coverage-evenness principle in lib/report/knowledge.ts.
// Rebuilt for the 15-domain catalogue (lib/report/knowledge.ts) - every
// domain gets exactly 2 fields; with only 4 real fields to draw from across
// 15 domains, some repetition is unavoidable, but every pairing is a real
// fit, not padding.
const DOMAIN_APTITUDE_C8: Record<string, ("numericReasoning" | "logicalDeduction" | "patternRecognition" | "spatialReasoning")[]> = {
  A: ["numericReasoning", "logicalDeduction"], B: ["numericReasoning", "logicalDeduction"],
  C: ["logicalDeduction", "spatialReasoning"], D: ["logicalDeduction", "patternRecognition"],
  E: ["logicalDeduction", "patternRecognition"], F: ["numericReasoning", "patternRecognition"],
  G: ["logicalDeduction", "numericReasoning"], H: ["spatialReasoning", "patternRecognition"],
  I: ["patternRecognition", "logicalDeduction"], J: ["logicalDeduction", "patternRecognition"],
  K: ["logicalDeduction", "patternRecognition"], L: ["spatialReasoning", "patternRecognition"],
  M: ["spatialReasoning", "logicalDeduction"], N: ["numericReasoning", "logicalDeduction"],
  O: ["spatialReasoning", "patternRecognition"],
};
// Which of class8's own 5 motivator tags (MOTIVATOR_TYPES: Achievement/
// Service/Autonomy/Security/Growth - the bank's real Q39-45 vocabulary,
// see class8Questions.ts) reinforce each domain - kept local for the same
// reason as DOMAIN_APTITUDE_C8 above.
const DOMAIN_MOTIVATOR_C8: Record<string, string[]> = {
  A: ["Achievement", "Autonomy"], B: ["Achievement", "Security"],
  C: ["Achievement", "Growth"], D: ["Growth", "Autonomy"],
  E: ["Service", "Security"], F: ["Growth", "Service"],
  G: ["Growth", "Autonomy"], H: ["Autonomy", "Growth"],
  I: ["Autonomy", "Achievement"], J: ["Service", "Security"],
  K: ["Service", "Growth"], L: ["Service", "Achievement"],
  M: ["Security", "Achievement"], N: ["Service", "Growth"],
  O: ["Achievement", "Autonomy"],
};

// A weighted mean over whichever evidence exists for a domain - same
// "average only what was actually measured" approach, and the same
// interest/aptitude/strengths/values weight split, as domainFit() in
// lib/report/knowledge.ts (Class 9-10) and the equivalent function in
// scoring11_12.ts / class6Scoring.ts, so every class's report scores
// domains the same way instead of several ad-hoc formulas quietly
// disagreeing. Replaces a flat point-additive scheme that only fed 2 of the
// 4 aptitude sub-scores into 2 of the 8 domains and left the rest of
// aptitude's declared 10% weight unused for every other domain.
function calculateDomainAffinities(data: any): DomainAffinity[] {
  const riasecByCode: Record<string, number> = {};
  data.riasec.forEach((r: RIASECScore) => { riasecByCode[r.code] = r.score; });
  const strengthByDomain: Record<string, number> = {};
  data.strengths.forEach((s: StrengthDomain) => { strengthByDomain[s.domain] = s.score; });
  const motivatorByName: Record<string, number> = {};
  data.motivators.forEach((m: MotivatorScore) => { motivatorByName[m.motivator] = m.score; });
  const apt = data.aptitude as AptitudeProfile;

  const result: DomainAffinity[] = Object.keys(DOMAINS).map((domain) => {
    const reasoning: string[] = [];
    let num = 0, den = 0;

    const riasecCodes = DOMAIN_RIASEC[domain] || [];
    const riasecScores = riasecCodes.map((c) => riasecByCode[c]).filter((v): v is number => v != null);
    if (riasecScores.length) {
      const avg = riasecScores.reduce((s, v) => s + v, 0) / riasecScores.length;
      num += 0.42 * avg; den += 0.42;
      reasoning.push(`Career interest: ${riasecCodes.join(", ")}`);
    }

    const aptFields = DOMAIN_APTITUDE_C8[domain] || [];
    const aptScores = aptFields.map((f) => apt[f]?.score).filter((v): v is number => v != null);
    if (aptScores.length) {
      const avg = aptScores.reduce((s, v) => s + v, 0) / aptScores.length;
      num += 0.26 * avg; den += 0.26;
      reasoning.push(`Aptitude: ${aptFields.join(", ")}`);
    }

    const miDomains = DOMAIN_MI[domain] || [];
    const miScores = miDomains.map((m) => strengthByDomain[m]).filter((v): v is number => v != null);
    if (miScores.length) {
      const avg = miScores.reduce((s, v) => s + v, 0) / miScores.length;
      num += 0.22 * avg; den += 0.22;
      reasoning.push(`Strengths: ${miDomains.join(", ")}`);
    }

    const motivatorTags = DOMAIN_MOTIVATOR_C8[domain] || [];
    const motivatorScores = motivatorTags.map((m) => motivatorByName[m]).filter((v): v is number => v != null);
    if (motivatorScores.length) {
      const avg = motivatorScores.reduce((s, v) => s + v, 0) / motivatorScores.length;
      num += 0.10 * avg; den += 0.10;
      reasoning.push(`Motivators: ${motivatorTags.join(", ")}`);
    }

    return {
      domain: DOMAINS[domain]?.name ?? domain,
      domainCode: domain,
      affinity: den > 0 ? Math.round(num / den) : 0,
      reasoning,
    };
  });

  result.sort((a, b) => b.affinity - a.affinity);
  return result;
}

function generateSummary(data: any): AssessmentSummary {
  const topStrengths = data.strengths?.slice(0, 3).map((s: any) => s.domain) || ["Analytical thinking"];
  const topRiasec = data.topRiasec?.code || "R";
  const topRiasecName = data.topRiasec?.name || "Realistic";

  return {
    profileTitle: `${data.personality.type} - ${topRiasecName} Oriented`,
    profileDescription: `You are a ${data.personality.type} with strong interests in ${topRiasecName} activities. Your assessment shows you have excellent potential in ${topStrengths[0]?.toLowerCase() || "multiple areas"}. With your natural abilities and drive, you're well-positioned to excel in careers that combine these strengths.`,
    topStrengths: topStrengths,
    developmentAreas: [
      "Developing technical skills further",
      "Expanding your knowledge in emerging fields",
      "Building leadership capabilities"
    ],
    careerDirections: [
      `${topRiasecName}-focused careers`,
      "Entrepreneurial opportunities",
      "Leadership roles",
      "Technical specialization"
    ],
    nextSteps: [
      "Explore careers aligned with your RIASEC profile",
      "Develop skills in your strength domains",
      "Seek mentorship in fields of interest",
      "Take on projects that challenge your abilities"
    ],
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getAptitudeInterpretation(score: number, category: string): string {
  if (score >= 85) return `Advanced ${category} ability - suitable for specialized roles`;
  if (score >= 65) return `Strong ${category} skills - good foundation for analytical work`;
  if (score >= 40) return `Developing ${category} skills - continued practice will improve ability`;
  return `Building ${category} foundation - focus on skill development`;
}

function generateLearningRecommendations(style: string): string[] {
  const recommendations: Record<string, string[]> = {
    Visual: ["Use diagrams and color-coded notes", "Watch video tutorials", "Create mind maps"],
    Auditory: ["Participate in discussions", "Listen to lectures", "Explain concepts aloud"],
    "Reading/Writing": ["Read textbooks and articles", "Make written notes", "Organize information in writing"],
    Kinesthetic: ["Practice hands-on activities", "Learn by doing projects", "Take breaks to move around"],
  };
  return recommendations[style] || [];
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AssessmentSummary {
  profileTitle: string;
  profileDescription: string;
  topStrengths: string[];
  developmentAreas: string[];
  careerDirections: string[];
  nextSteps: string[];
}
