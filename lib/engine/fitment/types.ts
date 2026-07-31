// Canonical dimensions the matcher works in. Every user profile and every
// career in the library is expressed in these — see profile.ts (extraction
// from scored sessions) and careerLibrary.ts (ideal profiles).

export type RiasecLetter = "R" | "I" | "A" | "S" | "E" | "C";
export type RiasecVector = Record<RiasecLetter, number>; // 0-100 each

export type AptitudeSkill =
  | "Numerical"
  | "Verbal"
  | "Abstract"
  | "Spatial"
  | "Clerical"
  | "Mechanical";
export type AptitudeVector = Partial<Record<AptitudeSkill, number>>; // 0-100

export type BigFiveTrait = "O" | "C" | "E" | "A" | "N";
export type BigFiveVector = Partial<Record<BigFiveTrait, number>>; // 0-100

// Canonical work-value tags. User values are the top few by score; a career
// lists the values it rewards. Similarity = overlap.
export type ValueTag =
  | "achievement"
  | "autonomy"
  | "helping"
  | "recognition"
  | "security"
  | "creativity"
  | "intellectual"
  | "affiliation"
  | "power"
  | "commerce"
  | "aesthetics"
  | "variety"
  | "lifestyle";

export type MultipleIntelligence =
  | "linguistic"
  | "logical-mathematical"
  | "spatial"
  | "bodily-kinesthetic"
  | "musical"
  | "interpersonal"
  | "intrapersonal"
  | "naturalist";
export type MiVector = Partial<Record<MultipleIntelligence, number>>; // 0-100

export type MatchCategory =
  | "interest"
  | "aptitude"
  | "personality"
  | "values"
  | "mi"
  | "ei"
  | "academic";

// The user's profile, extracted from a scored session. Any field can be
// `null`/empty when the session had no reliable sub-scores for it — the
// matcher renormalises weights over whatever is actually available.
export interface UserProfile {
  riasec: RiasecVector | null;
  riasecCode: string | null; // e.g. "AIR"
  aptitude: AptitudeVector;
  bigFive: BigFiveVector;
  values: { tag: ValueTag; score: number }[]; // sorted desc
  mi: MiVector;
  ei: number | null; // 0-100 composite
  academic: { name: string; score: number }[];
  learningStyles: { name: string; score: number }[]; // advisory only
  // How many reliable sub-scores backed each category — feeds confidence.
  reliability: Partial<Record<MatchCategory, number>>;
}

export type CareerFamily =
  | "STEM"
  | "Creative"
  | "Business"
  | "Health"
  | "Social"
  | "Hospitality"
  | "Media"
  | "Skilled-Trades";

// A career encoded as an ideal profile — the data the blueprint (§7) says we
// must add. Only `riasec` + `family` are required; the richer the record, the
// more categories contribute to its match.
export interface Career {
  id: string;
  title: string;
  family: CareerFamily;
  cluster: string; // report-facing group, e.g. "Hospitality and Tourism"
  roles: string[]; // example job titles
  riasec: RiasecVector;
  aptitude?: AptitudeVector; // required thresholds (0-100)
  bigFive?: BigFiveVector; // ideal 0-100
  values?: ValueTag[]; // values this career rewards
  mi?: MultipleIntelligence[]; // corroborating intelligences
  eiMin?: number; // 0-100 minimum useful EI (people-facing → higher)
  entrySubjects?: string[]; // feasibility flag against Academic Strengths
  blurb: string;
}

export interface CategoryContribution {
  category: MatchCategory;
  similarity: number; // 0-1
  weight: number; // renormalised match weight actually applied
  contributionPct: number; // similarity * weight * 100, the points it added
}

export interface CareerMatch {
  careerId: string;
  title: string;
  family: CareerFamily;
  cluster: string;
  roles: string[];
  blurb: string;
  fitmentPct: number; // 0-100
  band: "Very High" | "High" | "Good" | "Moderate" | "Low";
  contributions: CategoryContribution[];
  gaps: string[]; // e.g. "Numerical aptitude 45 vs ~70 typical → build foundations"
}

export interface ValidityReport {
  straightLining: boolean;
  lowCompleteness: boolean;
  reliableCategoryCount: number;
  confidence: "high" | "medium" | "low";
  notes: string[];
}

export interface FitmentResult {
  profile: {
    riasecCode: string | null;
    riasec: RiasecVector | null;
    topAptitudes: { skill: string; score: number }[];
    topValues: { tag: string; score: number }[];
    topIntelligences: { name: string; score: number }[];
    ei: number | null;
    learningStyles: { name: string; score: number }[];
  };
  matches: CareerMatch[]; // ranked, top N
  clusters: { cluster: string; score: number }[]; // ranked career clusters
  validity: ValidityReport;
}
