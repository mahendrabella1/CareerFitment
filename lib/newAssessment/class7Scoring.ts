/**
 * Class 7 Career Discovery Assessment Scoring
 * Maps 60 developmental questions to 8 career domains
 * No deterministic labeling - exploratory only
 * Identical structure to Class 6 - same assessment dimensions for continuity
 */
import questionBank from "@/data/class7-assessment-questions.json";
import { DOMAINS, DOMAIN_RIASEC, DOMAIN_MI } from "@/lib/report/knowledge";

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
    // 0-100: how consistently the student picked one side of each axis,
    // not "how good" a personality - used as the dimension's scorecard/
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

// Domain names/images/roles all come from the shared DOMAINS catalogue in
// lib/report/knowledge.ts - this used to keep its own local copy with G and
// H labelled "Entrepreneurship & Innovation" and "Agriculture &
// Environmental Science", while the domain CARD the report actually shows
// (Class7Report.tsx reads DOMAINS[d.domain] directly for the image/roles/
// skills/salary) used the real "Science, Nature & Agriculture" and "Sports,
// Hospitality & Lifestyle". A student could see a card titled
// "Entrepreneurship & Innovation" with a farming photo and agricultural
// roles underneath it. DOMAIN_RIASEC is shared for the same reason - it
// used to be a Class 7-only reverse table (RIASEC_TO_DOMAINS) built against
// those same wrong G/H meanings.

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
// (data/class7-assessment-questions.json), not duplicated here, so fixing a
// question there can't silently desync the scorer from the exam.
function scoreAptitude(responses: Class7Response): {
  aptitudeProfile: Class7ScoreOutput["aptitudeProfile"];
  domainHits: Record<string, number>;
  domainTotals: Record<string, number>;
} {
  const aptitudeQs = ((questionBank as any).questions || []).filter(
    (q: any) => q.id >= 21 && q.id <= 30
  );
  let correct = 0;
  const domainHits: Record<string, number> = {};
  // How many aptitude questions were tagged with each domain at all -
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

  // Clarity: how far each axis leans from an even split, averaged across
  // all four (ei/jp have 3 questions so max |3|, sn/tf have 2 so max |2|).
  const clarity = (Math.abs(ei) / 3 + Math.abs(sn) / 2 + Math.abs(tf) / 2 + Math.abs(jp) / 3) / 4;
  const score = Math.round(clarity * 100);
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
    score,
    axisScores: {
      ei: toAxis10(ei, 3),
      sn: toAxis10(sn, 2),
      tf: toAxis10(tf, 2),
      jp: toAxis10(jp, 3),
    },
  };
}

// Reads the option->code mapping straight off each question in the bank
// (data/class7-assessment-questions.json already tags every option with its
// intended letter/domain via `mapping`) instead of a hardcoded per-question
// table - a hardcoded table silently drifts out of sync the moment a
// question's options are reordered or re-authored. This file used to keep
// separate hardcoded tables per section, tuned against Class 6's bank
// content; Class 7's own bank uses a genuinely different vocabulary in
// several sections (see scoreEmotional/scoreCreativity below), which those
// hardcoded tables had never been updated to match. Reading the bank
// directly makes that class of bug structurally impossible.
function bankMapping(id: number): string[] | undefined {
  const q = ((questionBank as any).questions || []).find((q: any) => q.id === id);
  return q?.mapping as string[] | undefined;
}

function scoreRIASEC(responses: Class7Response): Class7ScoreOutput["riasecScores"] {
  const scores: Record<string, number> = {
    R: 0, I: 0, A: 0, S: 0, E: 0, C: 0
  };

  // Questions 11-20: RIASEC scoring
  for (let q = 11; q <= 20; q++) {
    const mapping = bankMapping(q);
    const optionIndex = responses.responses[q];
    const letter = mapping?.[optionIndex];
    if (letter && letter in scores) scores[letter]++;
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
  const of: Record<string, number> = {};

  for (let q = 31; q <= 38; q++) {
    const mapping = bankMapping(q);
    if (!mapping) continue;
    const optionIndex = responses.responses[q];
    mapping.forEach((domain) => { of[domain] = (of[domain] || 0) + 1; });
    const domain = mapping[optionIndex];
    if (domain) scores[domain] = (scores[domain] || 0) + 1;
  }

  // Percentage of the times a domain was actually OFFERED, not a flat /8 -
  // several MI domains only appear in a couple of the 8 questions, so a flat
  // /8 would cap them well under 100% even from a perfect run.
  return Object.entries(scores)
    .map(([name, score]) => ({
      name,
      score: of[name] ? Math.round((score / of[name]) * 100) : 0,
    }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);
}

function scoreMotivators(responses: Class7Response): Class7ScoreOutput["motivators"] {
  // Class 7's own bank uses Achievement/Curiosity/Helping/Independence/
  // Recognition - not Class 6's Freedom/Leadership. The previous hardcoded
  // array here was a copy of Class 6's, so a Class 7 student who picked
  // "Independence" saw it reported back to them as "Freedom".
  const scores: Record<string, number> = {
    "Achievement": 0,
    "Curiosity": 0,
    "Helping": 0,
    "Independence": 0,
    "Recognition": 0
  };

  // Questions 39-45: Motivators
  for (let q = 39; q <= 45; q++) {
    const mapping = bankMapping(q);
    const optionIndex = responses.responses[q];
    const name = mapping?.[optionIndex];
    if (name) scores[name] = (scores[name] ?? 0) + 1;
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
    "Reading/Writing": 0,
    "Auditory": 0,
    "Kinesthetic": 0
  };

  // Questions 46-50: Learning Preferences
  for (let q = 46; q <= 50; q++) {
    const optionIndex = responses.responses[q];
    const mapping = ["Visual", "Reading/Writing", "Auditory", "Kinesthetic"];
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
  // Class 7's own bank uses a richer, different vocabulary per question
  // (Regulation, Avoidance, Self-Expression, Cooperation, Growth-Orientation
  // and more - see data/class7-assessment-questions.json Q51-55) than Class
  // 6's fixed Self-Awareness/Empathy/Social-Management/Relationship-Building
  // set. The previous hardcoded per-position table here was a copy of
  // Class 6's and had no notion of Class 7's real categories at all, so
  // most answers were silently mis-bucketed into the wrong Class-6-style
  // label. Reading straight from the bank fixes that, and lets whichever
  // dimensions the bank actually offers appear in the output.
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Questions 51-55: Emotional & Social Awareness
  for (let q = 51; q <= 55; q++) {
    const mapping = bankMapping(q);
    if (!mapping) continue;
    const optionIndex = responses.responses[q];
    mapping.forEach((dim) => { of[dim] = (of[dim] || 0) + 1; });
    const dim = mapping[optionIndex];
    if (dim) scores[dim] = (scores[dim] || 0) + 1;
  }

  // Percentage of the times a dimension was actually OFFERED, not a flat
  // /5 - several dimensions only appear on one of the 5 questions.
  return Object.entries(scores)
    .map(([dimension, score]) => ({
      dimension,
      score: of[dimension] ? Math.round((score / of[dimension]) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);
}

function scoreCreativity(responses: Class7Response): Class7ScoreOutput["creativity"] {
  // Same fix as scoreEmotional above - Class 7's bank uses its own 13-way
  // vocabulary (Divergent, Integrative, Early-Adopter, Planner, Adaptive...)
  // for Q56-60, not Class 6's fixed 4-indicator set. The previous hardcoded
  // table here was Class 6's, and shared essentially no vocabulary with
  // what Class 7 students actually answered.
  const scores: Record<string, number> = {};
  const of: Record<string, number> = {};

  // Questions 56-60: Creativity & Future Readiness
  for (let q = 56; q <= 60; q++) {
    const mapping = bankMapping(q);
    if (!mapping) continue;
    const optionIndex = responses.responses[q];
    mapping.forEach((ind) => { of[ind] = (of[ind] || 0) + 1; });
    const indicator = mapping[optionIndex];
    if (indicator) scores[indicator] = (scores[indicator] || 0) + 1;
  }

  return Object.entries(scores)
    .map(([indicator, score]) => ({
      indicator,
      score: of[indicator] ? Math.round((score / of[indicator]) * 100) : 0,
    }))
    .sort((a, b) => b.score - a.score);
}

// Which of the 5 motivator tags (see scoreMotivators) reinforce each
// domain - kept local to Class 7 since its 5-tag vocabulary (Achievement/
// Curiosity/Helping/Independence/Recognition) isn't shared with Class 11-12's
// 11-tag one. Every domain gets exactly 2, matching this file's own
// DOMAIN_RIASEC/DOMAIN_MI coverage-evenness principle (lib/report/
// knowledge.ts) - a domain with only one signal is far noisier under real
// (imperfectly consistent) answers than one averaging two.
const DOMAIN_MOTIVATOR: Record<string, string[]> = {
  A: ["Achievement", "Recognition"], B: ["Achievement", "Independence"],
  C: ["Achievement", "Independence"], D: ["Curiosity", "Achievement"],
  E: ["Helping", "Curiosity"], F: ["Curiosity", "Helping"],
  G: ["Curiosity", "Achievement"], H: ["Independence", "Curiosity"],
  I: ["Independence", "Curiosity"], J: ["Helping", "Recognition"],
  K: ["Helping", "Curiosity"], L: ["Independence", "Recognition"],
  M: ["Recognition", "Achievement"], N: ["Curiosity", "Helping"],
  O: ["Achievement", "Independence"],
};

// A weighted mean over whichever evidence exists for a domain - same
// "average only what was actually measured" approach, and the same
// interest/aptitude/strengths/values weight split, as domainFit() in
// lib/report/knowledge.ts (Class 9-10) and the equivalent function in
// scoring11_12.ts / class6Scoring.ts, so every class's report scores
// domains the same way instead of several ad-hoc formulas quietly
// disagreeing. Replaces a flat point-additive scheme whose 5 factors didn't
// sum to a consistent total and could push a domain's raw score past 100
// before the final clamp - a number that read as confidence the underlying
// data never actually supported.
function calculateDomainAffinities(data: any): Class7ScoreOutput["domainAffinities"] {
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
  return `${data.name}, you're a ${data.personality.type} learner who shows strong interest in ${data.topRiasec.name.split("(")[0].trim()}. This aligns with exploring ${data.topDomain.domainName}. Keep exploring different interests-your real path will become clearer over time!`;
}
