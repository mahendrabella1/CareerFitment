export interface ScoredResponse {
  questionId: string;
  subTraitId: string;
  subTraitName: string;
  rawValue: string; // '1'-'5' | 'Y'/'N' | 'A'-'D'
  questionType: "likert5" | "yes_no" | "mcq";
  correctAnswer: string | null; // mcq only
  reverseScored: boolean;
}

export interface SubTraitScore {
  subTraitId: string;
  subTraitName: string;
  rawScore: number;
  normalizedScore: number; // 0-100
  n: number;
}

export interface ScoringStrategy {
  /** Machine-readable id stored in session_scores.scoring_strategy */
  readonly id: string;
  score(responses: ScoredResponse[]): SubTraitScore[];
}
