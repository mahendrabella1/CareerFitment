import { LikertAverageStrategy } from "./likertAverageStrategy";
import { ScoredResponse, ScoringStrategy, SubTraitScore } from "./types";

/**
 * RIASEC (Holland Code) scoring: same 0-100 normalization per sub-trait as
 * the default strategy (RIASEC questions are yes/no), but the meaningful
 * output is the ranked 3-letter code (e.g. "SEA"), not the raw averages.
 * Sub-trait names are expected to start with the Holland letter, e.g.
 * "R-Realistic", "I-Investigative" — matching how the seed data labels them.
 */
export class RiasecTopCodeStrategy implements ScoringStrategy {
  readonly id = "riasec_top_code";
  private base = new LikertAverageStrategy();

  score(responses: ScoredResponse[]): SubTraitScore[] {
    const scores = this.base.score(responses);
    return scores.sort((a, b) => b.normalizedScore - a.normalizedScore);
  }

  /** Convenience: derive the 3-letter Holland Code from the ranked scores. */
  topCode(scores: SubTraitScore[]): string {
    return scores
      .slice(0, 3)
      .map((s) => s.subTraitName.trim().charAt(0).toUpperCase())
      .join("");
  }
}
