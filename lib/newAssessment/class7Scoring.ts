/**
 * Class 7 Career Discovery Assessment Scoring
 * Maps 60 developmental questions to 8 career domains
 * No deterministic labeling - exploratory only
 * Identical structure to Class 6 - same assessment dimensions for continuity
 */

export interface Class7Response {
  studentName: string;
  responses: Record<number, number>; // question ID -> option index
}

export interface Class7ScoreOutput {
  studentName: string;
  personalityProfile: {
    ei: string; // E or I
    sn: string; // S or N
    tf: string; // T or F
    jp: string; // J or P
    type: string; // e.g., INTJ
  };
  riasecScores: Array<{
    letter: string;
    name: string;
    score: number;
  }>;
  strengthDomains: Array<{
    name: string;
    score: number;
  }>;
  motivators: Array<{
    name: string;
    score: number;
  }>;
  learningStyle: {
    primary: string;
    scores: Record<string, number>;
  };
  emotionalAwareness: Array<{
    dimension: string;
    score: number;
  }>;
  creativity: Array<{
    indicator: string;
    score: number;
  }>;
  domainAffinities: Array<{
    domain: string;
    domainName: string;
    affinity: number; // 0-100
    reasoning: string[];
  }>;
  recommendedExploration: string[];
  summary: string;
}

const RIASEC_NAMES = {
  R: "Realistic (Building, Making, Fixing)",
  I: "Investigative (Discovering, Problem-Solving)",
  A: "Artistic (Creating, Expressing)",
  S: "Social (Helping, Teaching, Leading People)",
  E: "Enterprising (Organizing, Planning, Leading)",
  C: "Conventional (Organizing Data, Systems)"
};

const MI_DOMAINS = [
  "Linguistic (Words, Languages)",
  "Logical-Mathematical (Numbers, Patterns)",
  "Spatial (Visual, Shapes, Imagination)",
  "Bodily-Kinesthetic (Movement, Hands-On)",
  "Musical (Sound, Rhythm, Music)",
  "Interpersonal (People, Communication)",
  "Intrapersonal (Self-Understanding)",
  "Naturalistic (Nature, Living Things)"
];

const DOMAIN_LABELS: Record<string, string> = {
  A: "Core Engineering & Infrastructure",
  B: "Information Technology",
  C: "Health Science",
  D: "Arts, Media & Design",
  E: "Business & Marketing",
  F: "Law, Social Services & Public Policy",
  G: "Entrepreneurship & Innovation",
  H: "Agriculture & Environmental Science"
};

// Map RIASEC codes to domains (simplified)
const RIASEC_TO_DOMAINS: Record<string, string[]> = {
  R: ["A", "H"],
  I: ["B", "C", "H"],
  A: ["D", "G"],
  S: ["C", "E", "F"],
  E: ["E", "G"],
  C: ["B", "E", "F"]
};

export function scoreClass7Assessment(responses: Class7Response): Class7ScoreOutput {
  // Score Personality (MBTI-style)
  const personalityProfile = scorePersonality(responses);

  // Score RIASEC
  const riasecScores = scoreRIASEC(responses);

  // Score MI Strengths
  const strengthDomains = scoreStrengths(responses);

  // Score Motivators
  const motivators = scoreMotivators(responses);

  // Score Learning Style
  const learningStyle = scoreLearningStyle(responses);

  // Score Emotional & Social Awareness
  const emotionalAwareness = scoreEmotional(responses);

  // Score Creativity & Future Readiness
  const creativity = scoreCreativity(responses);

  // Calculate domain affinities
  const domainAffinities = calculateDomainAffinities({
    personality: personalityProfile,
    riasec: riasecScores,
    strengths: strengthDomains,
    motivators,
    learning: learningStyle,
    emotional: emotionalAwareness,
    creativity
  });

  // Generate recommendations
  const recommendedExploration = generateRecommendations(domainAffinities);

  // Create summary
  const summary = generateSummary({
    name: responses.studentName,
    personality: personalityProfile,
    topRiasec: riasecScores[0],
    topDomain: domainAffinities[0]
  });

  return {
    studentName: responses.studentName,
    personalityProfile,
    riasecScores,
    strengthDomains,
    motivators,
    learningStyle,
    emotionalAwareness,
    creativity,
    domainAffinities,
    recommendedExploration,
    summary
  };
}

function scorePersonality(responses: Class7Response): Class7ScoreOutput["personalityProfile"] {
  let ei = 0, sn = 0, tf = 0, jp = 0;

  // Count E/I responses
  for (const q of [1, 2, 9]) ei += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [1, 2, 9]) ei -= responses.responses[q] >= 2 ? 1 : 0;

  // Count S/N responses
  for (const q of [3, 4]) sn += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [3, 4]) sn -= responses.responses[q] >= 2 ? 1 : 0;

  // Count T/F responses
  for (const q of [5, 6]) tf += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [5, 6]) tf -= responses.responses[q] >= 2 ? 1 : 0;

  // Count J/P responses
  for (const q of [7, 8, 10]) jp += responses.responses[q] <= 1 ? 1 : 0;
  for (const q of [7, 8, 10]) jp -= responses.responses[q] >= 2 ? 1 : 0;

  const type =
    (ei >= 0 ? "E" : "I") +
    (sn >= 0 ? "S" : "N") +
    (tf >= 0 ? "T" : "F") +
    (jp >= 0 ? "J" : "P");

  return {
    ei: ei >= 0 ? "E" : "I",
    sn: sn >= 0 ? "S" : "N",
    tf: tf >= 0 ? "T" : "F",
    jp: jp >= 0 ? "J" : "P",
    type
  };
}

function scoreRIASEC(responses: Class7Response): Class7ScoreOutput["riasecScores"] {
  const scores: Record<string, number> = {
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  };

  // Questions 11-20: RIASEC scoring
  for (let q = 11; q <= 20; q++) {
    const optionIndex = responses.responses[q];
    const mapping = ["R", "I", "A", "S", "E"];
    if (optionIndex < mapping.length) {
      scores[mapping[optionIndex]]++;
    }
  }

  return Object.entries(scores)
    .map(([letter, score]) => ({
      letter,
      name: RIASEC_NAMES[letter as keyof typeof RIASEC_NAMES],
      score: Math.round((score / 10) * 100)
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreStrengths(responses: Class7Response): Class7ScoreOutput["strengthDomains"] {
  const scores: Record<string, number> = {};
  MI_DOMAINS.forEach(d => scores[d] = 0);

  // Questions 31-38: MI Strengths
  for (let q = 31; q <= 38; q++) {
    const optionIndex = responses.responses[q];
    const mappings: Record<number, string[]> = {
      0: ["Linguistic", "Linguistic", "Linguistic", "Writing"],
      1: ["Logical-Mathematical", "Logical-Mathematical", "Logical-Mathematical", "Finding patterns"],
      2: ["Spatial", "Spatial", "Drawing a picture", "Visualising how things fit"],
      3: ["Bodily-Kinesthetic", "Music", "Demonstrate it", "Moving, acting or performing"],
      4: ["Interpersonal", "Naturalistic", "Discuss it with someone", "Understanding how another person feels"]
    };
    // Simplified: count as equal for now
    if (q <= 36) {
      const mapping = [
        "Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"
      ];
      if (optionIndex < mapping.length) {
        scores[mapping[optionIndex]] = (scores[mapping[optionIndex]] || 0) + 1;
      }
    }
  }

  return Object.entries(scores)
    .map(([name, score]) => ({
      name,
      score: Math.round((score / 8) * 100)
    }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Class7Response): Class7ScoreOutput["motivators"] {
  const scores: Record<string, number> = {
    "Achievement": 0,
    "Curiosity": 0,
    "Helping": 0,
    "Freedom": 0,
    "Leadership": 0
  };

  // Questions 39-45: Motivators
  for (let q = 39; q <= 45; q++) {
    const optionIndex = responses.responses[q];
    const mapping = ["Achievement", "Curiosity", "Helping", "Freedom", "Leadership"];
    if (optionIndex < mapping.length) {
      scores[mapping[optionIndex]]++;
    }
  }

  return Object.entries(scores)
    .map(([name, score]) => ({
      name,
      score: Math.round((score / 7) * 100)
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreLearningStyle(responses: Class7Response): Class7ScoreOutput["learningStyle"] {
  const scores: Record<string, number> = {
    "Visual": 0,
    "Reading": 0,
    "Auditory": 0,
    "Kinesthetic": 0
  };

  // Questions 46-50: Learning Preferences
  for (let q = 46; q <= 50; q++) {
    const optionIndex = responses.responses[q];
    const mapping = ["Visual", "Reading", "Auditory", "Kinesthetic"];
    if (optionIndex < mapping.length) {
      scores[mapping[optionIndex]]++;
    }
  }

  const primary = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  return {
    primary,
    scores: Object.fromEntries(
      Object.entries(scores).map(([key, val]) => [key, Math.round((val / 5) * 100)])
    )
  };
}

function scoreEmotional(responses: Class7Response): Class7ScoreOutput["emotionalAwareness"] {
  const dimensions = ["Self-Awareness", "Empathy", "Social-Management", "Relationship-Building"];
  const scores: Record<string, number> = {};
  dimensions.forEach(d => scores[d] = 0);

  // Questions 51-55: Emotional & Social Awareness
  for (let q = 51; q <= 55; q++) {
    const optionIndex = responses.responses[q];
    const mappings: Record<number, string[]> = {
      0: ["Self-Awareness", "Empathy", "Social-Management", "Self-Awareness", "Relationship-Building"],
      1: ["Relationship-Building", "Self-Awareness", "Empathy", "Self-Awareness", "Relationship-Building"],
      2: ["Self-Awareness", "Empathy", "Social-Management", "Social-Management", "Empathy"],
      3: ["Social-Management", "Social-Management", "Self-Awareness", "Self-Awareness", "Social-Management"]
    };
    if (optionIndex in mappings) {
      const dim = mappings[optionIndex][q - 51];
      scores[dim]++;
    }
  }

  return Object.entries(scores)
    .map(([dimension, score]) => ({
      dimension,
      score: Math.round((score / 5) * 100)
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreCreativity(responses: Class7Response): Class7ScoreOutput["creativity"] {
  const indicators = ["Problem-Solving", "Adaptability", "Innovation", "Future-Orientation"];
  const scores: Record<string, number> = {};
  indicators.forEach(i => scores[i] = 0);

  // Questions 56-60: Creativity & Future Readiness
  for (let q = 56; q <= 60; q++) {
    const optionIndex = responses.responses[q];
    const mappings: Record<number, string[]> = {
      0: ["Adaptability", "Adaptability", "Adaptability", "Future-Orientation", "Future-Orientation"],
      1: ["Problem-Solving", "Adaptability", "Adaptability", "Future-Orientation", "Innovation"],
      2: ["Innovation", "Problem-Solving", "Innovation", "Innovation", "Future-Orientation"],
      3: ["Problem-Solving", "Problem-Solving", "Problem-Solving", "Future-Orientation", "Adaptability"]
    };
    if (optionIndex in mappings) {
      const indicator = mappings[optionIndex][q - 56];
      scores[indicator]++;
    }
  }

  return Object.entries(scores)
    .map(([indicator, score]) => ({
      indicator,
      score: Math.round((score / 5) * 100)
    }))
    .sort((a, b) => b.score - a.score);
}

function calculateDomainAffinities(data: any): Class7ScoreOutput["domainAffinities"] {
  const affinities: Record<string, number> = {
    A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0, H: 0
  };
  const reasoning: Record<string, string[]> = {
    A: [], B: [], C: [], D: [], E: [], F: [], G: [], H: []
  };

  // Factor 1: RIASEC (35%)
  data.riasec.forEach((r: any, idx: number) => {
    const domainList = RIASEC_TO_DOMAINS[r.letter] || [];
    const weight = (35 * (5 - idx)) / 15; // Higher ranks get more weight
    domainList.forEach((d: string) => {
      affinities[d] += (r.score / 100) * weight;
      reasoning[d].push(`RIASEC: ${r.letter} (${r.name.split("(")[0].trim()})`);
    });
  });

  // Factor 2: Aptitude (20%)
  // For Class 6, we use strengths as proxy for aptitude potential
  data.strengths.forEach((s: any, idx: number) => {
    const weight = (20 * (4 - idx)) / 10;
    if (s.name.includes("Logical")) {
      affinities.B += (s.score / 100) * weight;
      affinities.A += (s.score / 100) * weight * 0.5;
      reasoning.B.push(`Strength: Logical-Mathematical`);
    }
    if (s.name.includes("Spatial")) {
      affinities.D += (s.score / 100) * weight;
      affinities.A += (s.score / 100) * weight * 0.3;
      reasoning.D.push(`Strength: Spatial`);
    }
  });

  // Factor 3: Motivators (15%)
  data.motivators.forEach((m: any, idx: number) => {
    const weight = (15 * (3 - idx)) / 6;
    if (m.name === "Helping") {
      affinities.C += (m.score / 100) * weight;
      affinities.F += (m.score / 100) * weight * 0.5;
      reasoning.C.push(`Motivator: Helping others`);
    }
    if (m.name === "Curiosity") {
      affinities.B += (m.score / 100) * weight;
      affinities.H += (m.score / 100) * weight * 0.5;
      reasoning.B.push(`Motivator: Discovery & exploration`);
    }
    if (m.name === "Leadership" || m.name === "Achievement") {
      affinities.E += (m.score / 100) * weight;
      affinities.G += (m.score / 100) * weight * 0.5;
      reasoning.E.push(`Motivator: ${m.name}`);
    }
  });

  // Factor 4: Personality & Emotional (10%)
  // Extraverts lean toward people-facing domains
  if (data.personality.ei === "E") {
    affinities.E += 5;
    affinities.C += 3;
    reasoning.E.push(`Personality: Extraverted`);
  } else {
    affinities.B += 5;
    reasoning.B.push(`Personality: Introverted`);
  }

  // Normalize and return top 5
  const result = Object.entries(affinities)
    .map(([domain, score]) => ({
      domain,
      domainName: DOMAIN_LABELS[domain],
      affinity: Math.round(Math.min(100, score)),
      reasoning: [...new Set(reasoning[domain])].slice(0, 3)
    }))
    .sort((a, b) => b.affinity - a.affinity);

  return result;
}

function generateRecommendations(affinities: Class7ScoreOutput["domainAffinities"]): string[] {
  return affinities
    .slice(0, 5)
    .map(a => `Explore ${a.domainName} through projects and clubs`)
    .filter(Boolean);
}

function generateSummary(data: {
  name: string;
  personality: Class7ScoreOutput["personalityProfile"];
  topRiasec: { name: string };
  topDomain: { domainName: string };
}): string {
  return `${data.name}, you're a ${data.personality.type} learner who shows strong interest in ${data.topRiasec.name.split("(")[0].trim()}. This aligns with exploring ${data.topDomain.domainName}. Keep exploring different interests—your real path will become clearer over time!`;
}
