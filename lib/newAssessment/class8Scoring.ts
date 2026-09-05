/**
 * Class 8 Career Discovery Assessment Scoring
 * Maps 60 questions across 8 dimensions with professional mapping
 *
 * Structure:
 * - Q1-Q10: Personality Preferences (4 types: D, S, A, C)
 * - Q11-Q20: Career Interests RIASEC (6 codes: R, I, A, S, E, C)
 * - Q21-Q30: Aptitude & Reasoning (10 skill types with correct/incorrect)
 * - Q31-Q38: MI Strength Domains (8 intelligences)
 * - Q39-Q45: Motivators & Values (7 motivator types)
 * - Q46-Q50: Learning Preferences (4 styles)
 * - Q51-Q55: Emotional & Social Awareness (4 EI components)
 * - Q56-Q60: Creativity & Future Readiness (4 indicators)
 */

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
  dominantType: string; // e.g., "Creative Analyzer"
  primaryCode: string; // e.g., "CA" (Creative + Analytical)
  secondaryCode?: string;
  typeScores: {
    decisive: number; // 0-100
    supportive: number;
    analytical: number;
    creative: number;
  };
  description: string;
  workStyle: string;
}

const PERSONALITY_TYPES = {
  D: { name: "Decisive", color: "#e63946", trait: "Action-oriented" },
  S: { name: "Supportive", color: "#06a77d", trait: "People-focused" },
  A: { name: "Analytical", color: "#2f6bff", trait: "Detail-focused" },
  C: { name: "Creative", color: "#f77f00", trait: "Innovative" },
};

const PERSONALITY_DESCRIPTIONS: Record<string, string> = {
  DD: "Natural leader, quick decision-maker, results-oriented",
  DS: "People leader who balances action with empathy",
  DA: "Strategic organizer, decisive but thorough",
  DC: "Dynamic innovator, action-driven visionary",
  SS: "Supportive team player, harmony-focused",
  SA: "Analytical helper, careful and people-oriented",
  SC: "Creative supporter, bringing new ideas to people",
  AA: "Meticulous analyst, precise and detailed",
  AC: "Careful innovator, thoughtful about change",
  CC: "Visionary dreamer, imaginative and open",
};

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
  29: 0, // "Hexagon"
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

// Q31-Q38 mapping to MI domains (5 options each: A-E)
const MI_OPTION_MAPPING: Record<number, Record<number, string>> = {
  31: { 0: "Linguistic", 1: "Logical-Mathematical", 2: "Spatial", 3: "Bodily-Kinesthetic", 4: "Musical" },
  32: { 0: "Linguistic", 1: "Logical-Mathematical", 2: "Spatial", 3: "Interpersonal", 4: "Intrapersonal" },
  33: { 0: "Linguistic", 1: "Logical-Mathematical", 2: "Spatial", 3: "Musical", 4: "Naturalistic" },
  34: { 0: "Linguistic", 1: "Bodily-Kinesthetic", 2: "Logical-Mathematical", 3: "Musical", 4: "Intrapersonal" },
  35: { 0: "Interpersonal", 1: "Linguistic", 2: "Intrapersonal", 3: "Logical-Mathematical", 4: "Spatial" },
  36: { 0: "Logical-Mathematical", 1: "Spatial", 2: "Bodily-Kinesthetic", 3: "Interpersonal", 4: "Musical" },
  37: { 0: "Linguistic", 1: "Musical", 2: "Logical-Mathematical", 3: "Spatial", 4: "Bodily-Kinesthetic" },
  38: { 0: "Intrapersonal", 1: "Interpersonal", 2: "Naturalistic", 3: "Musical", 4: "Logical-Mathematical" },
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

const MOTIVATOR_TYPES = [
  "Achievement",
  "Curiosity",
  "Helping",
  "Freedom",
  "Leadership",
  "Stability",
  "Innovation",
];

// Q39-Q45 mapping to motivators (flexible, may be 4-5 options)
const MOTIVATOR_MAPPING: Record<number, string> = {
  39: "Achievement",
  40: "Curiosity",
  41: "Helping",
  42: "Freedom",
  43: "Leadership",
  44: "Stability",
  45: "Innovation",
};

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
  Reading: "Prefers reading, notes, written materials",
  Kinesthetic: "Prefers hands-on, practice, movement, experience",
};

// Q46-Q50 to learning styles (4 options each)
const LEARNING_STYLE_MAPPING: Record<number, Record<number, string>> = {
  46: { 0: "Visual", 1: "Reading", 2: "Auditory", 3: "Kinesthetic" },
  47: { 0: "Kinesthetic", 1: "Auditory", 2: "Visual", 3: "Reading" },
  48: { 0: "Auditory", 1: "Visual", 2: "Kinesthetic", 3: "Reading" },
  49: { 0: "Reading", 1: "Kinesthetic", 2: "Auditory", 3: "Visual" },
  50: { 0: "Visual", 1: "Auditory", 2: "Reading", 3: "Kinesthetic" },
};

// ============================================================================
// EMOTIONAL & SOCIAL AWARENESS (EI)
// ============================================================================

export interface EIComponent {
  component: string; // Self-awareness, Empathy, Social-management, Relationship-building
  score: number; // 0-100
  level: "Developing" | "Proficient" | "Strong" | "Advanced";
  description: string;
}

const EI_COMPONENTS = [
  "Self-Awareness",
  "Empathy",
  "Social-Management",
  "Relationship-Building",
];

// Q51-Q55 to EI components (4 options each)
const EI_MAPPING: Record<number, Record<number, string>> = {
  51: { 0: "Self-Awareness", 1: "Relationship-Building", 2: "Self-Awareness", 3: "Social-Management" },
  52: { 0: "Social-Management", 1: "Empathy", 2: "Self-Awareness", 3: "Empathy" },
  53: { 0: "Empathy", 1: "Self-Awareness", 2: "Social-Management", 3: "Social-Management" },
  54: { 0: "Self-Awareness", 1: "Empathy", 2: "Social-Management", 3: "Relationship-Building" },
  55: { 0: "Relationship-Building", 1: "Self-Awareness", 2: "Empathy", 3: "Social-Management" },
};

// ============================================================================
// CREATIVITY & FUTURE READINESS
// ============================================================================

export interface CreativityIndicator {
  indicator: string; // Problem-solving, Adaptability, Innovation, Future-orientation
  score: number; // 0-100
  level: "Emerging" | "Developing" | "Strong" | "Advanced";
  description: string;
}

const CREATIVITY_INDICATORS = [
  "Problem-Solving",
  "Adaptability",
  "Innovation",
  "Future-Orientation",
];

// Q56-Q60 to creativity indicators (4 options each)
const CREATIVITY_MAPPING: Record<number, Record<number, string>> = {
  56: { 0: "Adaptability", 1: "Problem-Solving", 2: "Innovation", 3: "Problem-Solving" },
  57: { 0: "Problem-Solving", 1: "Adaptability", 2: "Innovation", 3: "Future-Orientation" },
  58: { 0: "Innovation", 1: "Problem-Solving", 2: "Innovation", 3: "Future-Orientation" },
  59: { 0: "Adaptability", 1: "Adaptability", 2: "Adaptability", 3: "Future-Orientation" },
  60: { 0: "Problem-Solving", 1: "Adaptability", 2: "Innovation", 3: "Problem-Solving" },
};

// ============================================================================
// DOMAIN AFFINITY CALCULATION
// ============================================================================

export interface DomainAffinity {
  domain: string;
  domainCode: string;
  affinity: number; // 0-100
  reasoning: string[];
}

// Career domain mapping
const CAREER_DOMAINS: Record<string, string> = {
  A: "Core Engineering & Infrastructure",
  B: "Information Technology",
  C: "Health Science",
  D: "Arts, Media & Design",
  E: "Business & Marketing",
  F: "Law, Social Services & Public Policy",
  G: "Entrepreneurship & Innovation",
  H: "Agriculture & Environmental Science",
};

// RIASEC to Domain mapping
const RIASEC_TO_DOMAINS: Record<string, string[]> = {
  R: ["A", "H"],
  I: ["B", "C", "H"],
  A: ["D", "G"],
  S: ["C", "E", "F"],
  E: ["E", "G"],
  C: ["B", "E", "F"],
};

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
  const scores = { D: 0, S: 0, A: 0, C: 0 };

  // Q1-Q10: Each maps to personality type
  const personalityMapping: Record<number, Record<number, string>> = {
    1: { 0: "D", 1: "S", 2: "A", 3: "C" },
    2: { 0: "D", 1: "S", 2: "A", 3: "C" },
    3: { 0: "D", 1: "S", 2: "A", 3: "C" },
    4: { 0: "D", 1: "S", 2: "A", 3: "C" },
    5: { 0: "D", 1: "S", 2: "A", 3: "C" },
    6: { 0: "D", 1: "S", 2: "A", 3: "C" },
    7: { 0: "D", 1: "S", 2: "A", 3: "C" },
    8: { 0: "D", 1: "S", 2: "A", 3: "C" },
    9: { 0: "D", 1: "S", 2: "A", 3: "C" },
    10: { 0: "D", 1: "S", 2: "A", 3: "C" },
  };

  for (let q = 1; q <= 10; q++) {
    const option = responses.responses[q];
    const code = personalityMapping[q][option];
    scores[code as keyof typeof scores]++;
  }

  // Normalize to 0-100
  const normalized = {
    decisive: Math.round((scores.D / 10) * 100),
    supportive: Math.round((scores.S / 10) * 100),
    analytical: Math.round((scores.A / 10) * 100),
    creative: Math.round((scores.C / 10) * 100),
  };

  // Determine dominant type
  const entries = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
  const primary = entries[0][0][0].toUpperCase();
  const secondary = entries[1][0][0].toUpperCase();
  const primaryCode = primary + secondary;

  const description = PERSONALITY_DESCRIPTIONS[primaryCode] || "Balanced personality type";

  return {
    dominantType: `${PERSONALITY_TYPES[primary as keyof typeof PERSONALITY_TYPES]?.name} ${PERSONALITY_TYPES[secondary as keyof typeof PERSONALITY_TYPES]?.name}`,
    primaryCode,
    secondaryCode: secondary,
    typeScores: normalized,
    description,
    workStyle: `${PERSONALITY_TYPES[primary as keyof typeof PERSONALITY_TYPES]?.trait} with ${PERSONALITY_TYPES[secondary as keyof typeof PERSONALITY_TYPES]?.trait} tendencies`,
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

  // Initialize all domains
  Object.keys(MI_DOMAINS).forEach((domain) => {
    domains[domain] = 0;
  });

  // Q31-Q38: Score MI domains
  for (let q = 31; q <= 38; q++) {
    const option = responses.responses[q];
    const domain = MI_OPTION_MAPPING[q]?.[option];
    if (domain) {
      domains[domain]++;
    }
  }

  // Normalize and convert
  const getLevel = (score: number): "Developing" | "Proficient" | "Strong" | "Advanced" => {
    if (score < 40) return "Developing";
    if (score < 65) return "Proficient";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  return Object.entries(domains)
    .map(([domain, count]) => {
      const score = Math.round((count / 8) * 100);
      return {
        domain,
        code: MI_DOMAINS[domain].code,
        score,
        level: getLevel(score),
        careers: MI_DOMAINS[domain].careers,
      };
    })
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Class8Response): MotivatorScore[] {
  const scores: Record<string, number> = {};

  // Initialize all motivators
  MOTIVATOR_TYPES.forEach((m) => {
    scores[m] = 0;
  });

  // Q39-Q45: Score motivators
  for (let q = 39; q <= 45; q++) {
    const option = responses.responses[q];
    const motivator = MOTIVATOR_MAPPING[q];

    if (motivator) {
      // Simple scoring: higher option index = stronger preference
      scores[motivator] += option + 1;
    }
  }

  // Normalize to 0-100
  const getLevel = (score: number): "Low" | "Moderate" | "High" | "Very High" => {
    if (score < 30) return "Low";
    if (score < 60) return "Moderate";
    if (score < 80) return "High";
    return "Very High";
  };

  return Object.entries(scores)
    .map(([motivator, rawScore]) => ({
      motivator,
      score: Math.min(100, Math.round((rawScore / 5) * 20)),
      level: getLevel(Math.min(100, Math.round((rawScore / 5) * 20))),
      description: `${motivator} is a key driver in career satisfaction`,
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreLearningStyle(responses: Class8Response): LearningStyleProfile {
  const scores: Record<string, number> = {
    Visual: 0,
    Auditory: 0,
    Reading: 0,
    Kinesthetic: 0,
  };

  // Q46-Q50: Score learning styles
  for (let q = 46; q <= 50; q++) {
    const option = responses.responses[q];
    const style = LEARNING_STYLE_MAPPING[q]?.[option];
    if (style) {
      scores[style]++;
    }
  }

  // Normalize
  const normalized = {
    Visual: Math.round((scores.Visual / 5) * 100),
    Auditory: Math.round((scores.Auditory / 5) * 100),
    Reading: Math.round((scores.Reading / 5) * 100),
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

  // Initialize all EI components
  EI_COMPONENTS.forEach((component) => {
    scores[component] = 0;
  });

  // Q51-Q55: Score EI components
  for (let q = 51; q <= 55; q++) {
    const option = responses.responses[q];
    const component = EI_MAPPING[q]?.[option];
    if (component) {
      scores[component]++;
    }
  }

  // Normalize
  const getLevel = (score: number): "Developing" | "Proficient" | "Strong" | "Advanced" => {
    if (score < 40) return "Developing";
    if (score < 65) return "Proficient";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  return Object.entries(scores)
    .map(([component, count]) => ({
      component,
      score: Math.round((count / 5) * 100),
      level: getLevel(Math.round((count / 5) * 100)),
      description: `${component} is an important aspect of your emotional intelligence`,
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreCreativity(responses: Class8Response): CreativityIndicator[] {
  const scores: Record<string, number> = {};

  // Initialize all creativity indicators
  CREATIVITY_INDICATORS.forEach((indicator) => {
    scores[indicator] = 0;
  });

  // Q56-Q60: Score creativity
  for (let q = 56; q <= 60; q++) {
    const option = responses.responses[q];
    const indicator = CREATIVITY_MAPPING[q]?.[option];
    if (indicator) {
      scores[indicator]++;
    }
  }

  // Normalize
  const getLevel = (score: number): "Emerging" | "Developing" | "Strong" | "Advanced" => {
    if (score < 40) return "Emerging";
    if (score < 65) return "Developing";
    if (score < 85) return "Strong";
    return "Advanced";
  };

  return Object.entries(scores)
    .map(([indicator, count]) => ({
      indicator,
      score: Math.round((count / 5) * 100),
      level: getLevel(Math.round((count / 5) * 100)),
      description: `${indicator} is a key component of your creative profile`,
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateDomainAffinities(data: any): DomainAffinity[] {
  const affinities: Record<string, number> = {};
  const reasoning: Record<string, string[]> = {};

  // Initialize all domains
  Object.keys(CAREER_DOMAINS).forEach((domain) => {
    affinities[domain] = 0;
    reasoning[domain] = [];
  });

  // Factor 1: RIASEC (40% weight) - Higher ranks get more weight
  data.riasec.forEach((r: RIASECScore, idx: number) => {
    const domainList = RIASEC_TO_DOMAINS[r.code] || [];
    const weight = (40 * (5 - idx)) / 15;
    domainList.forEach((domain: string) => {
      affinities[domain] += (r.score / 100) * weight;
      reasoning[domain].push(`RIASEC: ${r.name} (${r.score}%)`);
    });
  });

  // Factor 2: Strengths (30% weight)
  data.strengths.slice(0, 3).forEach((s: StrengthDomain, idx: number) => {
    const weight = (30 * (3 - idx)) / 6;
    // Map intelligences to domains logically
    const domainMaps: Record<string, string[]> = {
      "Logical-Mathematical": ["B"],
      Spatial: ["D", "A"],
      Linguistic: ["D", "F"],
      Interpersonal: ["C", "E", "F"],
      Intrapersonal: ["G"],
      Bodily-Kinesthetic: ["A", "H"],
      Musical: ["D"],
      Naturalistic: ["H", "C"],
    };

    const domains = domainMaps[s.domain] || [];
    domains.forEach((domain: string) => {
      affinities[domain] += (s.score / 100) * (weight / domains.length);
      reasoning[domain].push(`Strength: ${s.domain}`);
    });
  });

  // Factor 3: Motivators (20% weight)
  data.motivators.slice(0, 3).forEach((m: MotivatorScore, idx: number) => {
    const weight = (20 * (3 - idx)) / 6;
    // Leadership → E, G; Helping → C, F; Curiosity → B; Innovation → G, D
    const motivatorMaps: Record<string, string[]> = {
      Leadership: ["E", "G"],
      Helping: ["C", "F"],
      Achievement: ["E", "G"],
      Curiosity: ["B"],
      Innovation: ["G", "D"],
      Freedom: ["G"],
      Stability: ["B", "E", "F"],
    };

    const domains = motivatorMaps[m.motivator] || [];
    domains.forEach((domain: string) => {
      affinities[domain] += (m.score / 100) * (weight / domains.length);
      reasoning[domain].push(`Motivator: ${m.motivator}`);
    });
  });

  // Factor 4: Aptitude (10% weight)
  const aptWeight = 10;
  affinities.B += (data.aptitude.overallScore / 100) * (aptWeight / 2);
  affinities.A += (data.aptitude.numericReasoning.score / 100) * (aptWeight / 2);
  reasoning.B.push(`Aptitude: Strong technical skills`);
  reasoning.A.push(`Aptitude: Engineering/Math capability`);

  // Convert to array and sort
  return Object.entries(affinities)
    .map(([domain, score]) => ({
      domain: CAREER_DOMAINS[domain],
      domainCode: domain,
      affinity: Math.min(100, Math.round(score)),
      reasoning: reasoning[domain].slice(0, 3), // Top 3 reasons
    }))
    .sort((a, b) => b.affinity - a.affinity);
}

function generateSummary(data: any): AssessmentSummary {
  return {
    overallProfile: `${data.personality.dominantType} with strong ${data.topRiasec.code} interests`,
    keyStrengths: [data.topStrength?.domain || "Analytical thinking"],
    suggestedPathways: data.topRiasec.name.toLowerCase(),
    nextSteps: ["Explore recommended careers", "Develop identified strengths", "Consider internship opportunities"],
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
    Reading: ["Read textbooks and articles", "Make written notes", "Organize information in writing"],
    Kinesthetic: ["Practice hands-on activities", "Learn by doing projects", "Take breaks to move around"],
  };
  return recommendations[style] || [];
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface AssessmentSummary {
  overallProfile: string;
  keyStrengths: string[];
  suggestedPathways: string;
  nextSteps: string[];
}
