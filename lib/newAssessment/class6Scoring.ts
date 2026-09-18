/**
 * Class 6 Career Discovery Assessment Scoring
 * Maps 60 developmental questions to 8 career domains
 * No deterministic labeling - exploratory only
 */
import questionBank from "@/data/class6-assessment-questions.json";
import { DOMAINS, DOMAIN_RIASEC, DOMAIN_MI } from "@/lib/report/knowledge";

export interface Class6Response {
  studentName: string;
  responses: Record<number, number>; // question ID -> option index
}

export interface Class6ScoreOutput {
  studentName: string;
  personalityProfile: {
    ei: string; // E or I
    sn: string; // S or N
    tf: string; // T or F
    jp: string; // J or P
    type: string; // e.g., INTJ
    // 0-100: how consistently the student picked one side of each axis,
    // not "how good" a personality — used as the dimension's scorecard/
    // radar score, since the four letters alone aren't a number.
    score: number;
    // 0-10 per axis, midpoint 5: >=5 leans toward the first letter shown
    // for that axis (E/S/T/J), below 5 leans toward the second (I/N/F/P).
    // Powers the compass visual, which needs a position per axis, not
    // just which letter won.
    axisScores: { ei: number; sn: number; tf: number; jp: number };
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
  aptitudeProfile: {
    correct: number;
    total: number;
    score: number; // 0-100
    level: "Emerging" | "Developing" | "Strong" | "Advanced";
  };
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

// Domain names/images/roles all come from the shared DOMAINS catalogue in
// lib/report/knowledge.ts — this used to keep its own local copy with G and
// H labelled "Entrepreneurship & Innovation" and "Agriculture &
// Environmental Science", while the domain CARD the report actually shows
// (Class6Report.tsx reads DOMAINS[d.domain] directly for the image/roles/
// skills/salary) used the real "Science, Nature & Agriculture" and "Sports,
// Hospitality & Lifestyle". A student could see a card titled
// "Entrepreneurship & Innovation" with a farming photo and agricultural
// roles underneath it. DOMAIN_RIASEC is shared for the same reason — it
// used to be a Class 6-only reverse table (RIASEC_TO_DOMAINS) built against
// those same wrong G/H meanings.

export function scoreClass6Assessment(responses: Class6Response): Class6ScoreOutput {
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

  // Score Aptitude & Reasoning (Q21-30)
  const { aptitudeProfile, domainHits: aptitudeDomainHits, domainTotals: aptitudeDomainTotals } = scoreAptitude(responses);

  // Calculate domain affinities
  const domainAffinities = calculateDomainAffinities({
    personality: personalityProfile,
    riasec: riasecScores,
    strengths: strengthDomains,
    motivators,
    learning: learningStyle,
    emotional: emotionalAwareness,
    creativity,
    aptitudeDomainHits,
    aptitudeDomainTotals
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
    aptitudeProfile,
    domainAffinities,
    recommendedExploration,
    summary
  };
}

// Q21-30. The correct answer and domain tags live on the question bank itself
// (data/class6-assessment-questions.json), not duplicated here, so fixing a
// question there can't silently desync the scorer from the exam.
function scoreAptitude(responses: Class6Response): {
  aptitudeProfile: Class6ScoreOutput["aptitudeProfile"];
  domainHits: Record<string, number>;
  domainTotals: Record<string, number>;
} {
  const aptitudeQs = ((questionBank as any).questions || []).filter(
    (q: any) => q.id >= 21 && q.id <= 30
  );
  let correct = 0;
  const domainHits: Record<string, number> = {};
  // How many aptitude questions were tagged with each domain at all —
  // without this, calculateDomainAffinities could only see hits (a raw
  // count of correct answers), which rewarded a domain just because OTHER
  // domains happened to get fewer correct answers, not because this
  // domain's own questions were actually answered well.
  const domainTotals: Record<string, number> = {};
  for (const q of aptitudeQs) {
    for (const d of q.domainAffinity || []) {
      domainTotals[d] = (domainTotals[d] || 0) + 1;
    }
    if (responses.responses[q.id] === q.correct) {
      correct++;
      for (const d of q.domainAffinity || []) {
        domainHits[d] = (domainHits[d] || 0) + 1;
      }
    }
  }
  const total = aptitudeQs.length || 10;
  const score = Math.round((correct / total) * 100);
  const level = score < 40 ? "Emerging" : score < 65 ? "Developing" : score < 85 ? "Strong" : "Advanced";
  return { aptitudeProfile: { correct, total, score, level }, domainHits, domainTotals };
}

function scorePersonality(responses: Class6Response): Class6ScoreOutput["personalityProfile"] {
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

  // Clarity: how far each axis leans from an even split, averaged across
  // all four (ei/jp have 3 questions so max |3|, sn/tf have 2 so max |2|).
  const clarity = (Math.abs(ei) / 3 + Math.abs(sn) / 2 + Math.abs(tf) / 2 + Math.abs(jp) / 3) / 4;
  const score = Math.round(clarity * 100);
  // sn/tf have only 2 questions deciding them, ei/jp only 3 — so answering
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
    score,
    axisScores: {
      ei: toAxis10(ei, 3),
      sn: toAxis10(sn, 2),
      tf: toAxis10(tf, 2),
      jp: toAxis10(jp, 3),
    },
  };
}

function scoreRIASEC(responses: Class6Response): Class6ScoreOutput["riasecScores"] {
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

// Q31-38's 5 options each lean toward a different MI domain, but not
// always the SAME one in the same position — Q32/Q36 use Musical/
// Naturalistic in their last two slots where every other question uses
// Bodily-Kinesthetic/Interpersonal (see data/class6-assessment-questions.json
// Q32: "Music and rhythm"/"Nature and living things" vs Q31's "Making or
// doing things with my hands"/"Talking and working with people") — a single
// flat mapping silently mis-scored those two, and Q37/Q38 were never scored
// at all. Intrapersonal never appears as a distinct option across Q31-38 —
// a real limit of this bank's 5-option format, not something to fabricate
// a slot for.
const STRENGTHS_MAPPING: Record<number, string[]> = {
  31: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
  32: ["Linguistic", "Logical-Mathematical", "Spatial", "Musical", "Naturalistic"],
  33: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
  34: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
  35: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
  36: ["Linguistic", "Logical-Mathematical", "Spatial", "Musical", "Naturalistic"],
  37: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
  38: ["Linguistic", "Logical-Mathematical", "Spatial", "Bodily-Kinesthetic", "Interpersonal"],
};

function scoreStrengths(responses: Class6Response): Class6ScoreOutput["strengthDomains"] {
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};
  MI_DOMAINS.forEach(d => scores[d] = 0);

  for (let q = 31; q <= 38; q++) {
    const optionIndex = responses.responses[q];
    const mapping = STRENGTHS_MAPPING[q];
    mapping.forEach((domain) => { of[domain] = (of[domain] || 0) + 1; });
    if (optionIndex >= 0 && optionIndex < mapping.length) {
      const domain = mapping[optionIndex];
      scores[domain] = (scores[domain] || 0) + 1;
    }
  }

  // Percentage of the times a domain was actually OFFERED, not a flat /8 —
  // Musical/Naturalistic only appear in 2 of the 8 questions, so a flat /8
  // would cap them at 25% even from a perfect run.
  return Object.entries(scores)
    .map(([name, score]) => ({
      name,
      score: of[name] ? Math.round((score / of[name]) * 100) : 0,
    }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Class6Response): Class6ScoreOutput["motivators"] {
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

function scoreLearningStyle(responses: Class6Response): Class6ScoreOutput["learningStyle"] {
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

function scoreEmotional(responses: Class6Response): Class6ScoreOutput["emotionalAwareness"] {
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

function scoreCreativity(responses: Class6Response): Class6ScoreOutput["creativity"] {
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

// Which of the 5 motivator tags (see scoreMotivators) reinforce each
// domain — kept local to Class 6 since its 5-tag vocabulary (Achievement/
// Curiosity/Helping/Freedom/Leadership) is its own, not shared with Class
// 11-12's 11-tag one. Every domain gets exactly 2, matching this file's own
// DOMAIN_RIASEC/DOMAIN_MI coverage-evenness principle (lib/report/
// knowledge.ts) — a domain with only one signal is far noisier under real
// (imperfectly consistent) answers than one averaging two.
const DOMAIN_MOTIVATOR: Record<string, string[]> = {
  A: ["Achievement", "Leadership"], B: ["Achievement", "Freedom"],
  C: ["Achievement", "Freedom"], D: ["Curiosity", "Achievement"],
  E: ["Helping", "Curiosity"], F: ["Curiosity", "Helping"],
  G: ["Curiosity", "Achievement"], H: ["Freedom", "Curiosity"],
  I: ["Freedom", "Curiosity"], J: ["Helping", "Leadership"],
  K: ["Helping", "Curiosity"], L: ["Freedom", "Leadership"],
  M: ["Leadership", "Achievement"], N: ["Curiosity", "Helping"],
  O: ["Achievement", "Freedom"],
};

// A weighted mean over whichever evidence exists for a domain — same
// "average only what was actually measured" approach, and the same
// interest/aptitude/strengths/values weight split, as domainFit() in
// lib/report/knowledge.ts (Class 9-10) and calculateDomainAffinities() in
// scoring11_12.ts (Class 11-12), so every class's report scores domains the
// same way instead of three different ad-hoc formulas quietly disagreeing.
// This replaces a flat point-additive scheme whose 5 factors didn't sum to
// a consistent total and could push a domain's raw score past 100 before
// the final clamp — an number that read as confidence the underlying data
// never actually supported.
function calculateDomainAffinities(data: any): Class6ScoreOutput["domainAffinities"] {
  const riasecByLetter: Record<string, number> = {};
  data.riasec.forEach((r: any) => { riasecByLetter[r.letter] = r.score; });
  const strengthByDomain: Record<string, number> = {};
  data.strengths.forEach((s: any) => { strengthByDomain[s.name] = s.score; });
  const motivatorByName: Record<string, number> = {};
  data.motivators.forEach((m: any) => { motivatorByName[m.name] = m.score; });
  const hits = data.aptitudeDomainHits as Record<string, number>;
  const totals = data.aptitudeDomainTotals as Record<string, number>;

  const result = Object.keys(DOMAINS).map((domain) => {
    const reasoning: string[] = [];
    let num = 0, den = 0;

    const riasecCodes = DOMAIN_RIASEC[domain] || [];
    const riasecScores = riasecCodes.map((c) => riasecByLetter[c]).filter((v): v is number => v != null);
    if (riasecScores.length) {
      const avg = riasecScores.reduce((s, v) => s + v, 0) / riasecScores.length;
      num += 0.42 * avg; den += 0.42;
      reasoning.push(`Career interest: ${riasecCodes.join(", ")}`);
    }

    const aptTotal = totals[domain] || 0;
    if (aptTotal > 0) {
      const aptScore = ((hits[domain] || 0) / aptTotal) * 100;
      num += 0.26 * aptScore; den += 0.26;
      reasoning.push(`Aptitude: reasoning questions in this area`);
    }

    const miDomains = DOMAIN_MI[domain] || [];
    const miScores = miDomains.map((m) => strengthByDomain[m]).filter((v): v is number => v != null);
    if (miScores.length) {
      const avg = miScores.reduce((s, v) => s + v, 0) / miScores.length;
      num += 0.22 * avg; den += 0.22;
      reasoning.push(`Strengths: ${miDomains.join(", ")}`);
    }

    const motivatorTags = DOMAIN_MOTIVATOR[domain] || [];
    const motivatorScores = motivatorTags.map((m) => motivatorByName[m]).filter((v): v is number => v != null);
    if (motivatorScores.length) {
      const avg = motivatorScores.reduce((s, v) => s + v, 0) / motivatorScores.length;
      num += 0.10 * avg; den += 0.10;
      reasoning.push(`Motivators: ${motivatorTags.join(", ")}`);
    }

    return {
      domain,
      domainName: DOMAINS[domain]?.name ?? domain,
      affinity: den > 0 ? Math.round(num / den) : 0,
      reasoning,
    };
  });

  return result.sort((a, b) => b.affinity - a.affinity);
}

function generateRecommendations(affinities: Class6ScoreOutput["domainAffinities"]): string[] {
  return affinities
    .slice(0, 5)
    .map(a => `Explore ${a.domainName} through projects and clubs`)
    .filter(Boolean);
}

function generateSummary(data: {
  name: string;
  personality: Class6ScoreOutput["personalityProfile"];
  topRiasec: { name: string };
  topDomain: { domainName: string };
}): string {
  return `${data.name}, you're a ${data.personality.type} learner who shows strong interest in ${data.topRiasec.name.split("(")[0].trim()}. This aligns with exploring ${data.topDomain.domainName}. Keep exploring different interests—your real path will become clearer over time!`;
}
