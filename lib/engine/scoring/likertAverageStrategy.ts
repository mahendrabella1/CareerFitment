import { ScoredResponse, ScoringStrategy, SubTraitScore } from "./types";

/**
 * Generic default: normalizes every response to a 0-100 scale and averages
 * per sub-trait.
 *   - Likert 1-5  -> (value-1)/4 * 100   (1->0, 3->50, 5->100)
 *   - Yes/No      -> Y=100, N=0
 *   - MCQ         -> correct=100, incorrect=0
 *
 * This is the fallback strategy for any instrument that doesn't have a
 * dedicated one yet. Real psychometric tools (RIASEC top-3 codes, Big Five
 * T-scores, Hogan HDS risk bands) need their own ScoringStrategy - this one
 * intentionally does NOT try to fake domain-specific scoring logic it
 * doesn't have normed data for.
 */
export class LikertAverageStrategy implements ScoringStrategy {
  readonly id = "likert_average";

  score(responses: ScoredResponse[]): SubTraitScore[] {
    const bySubTrait = new Map<string, { name: string; values: number[] }>();

    for (const r of responses) {
      const normalized = this.normalize(r);
      if (normalized === null) continue;
      const bucket = bySubTrait.get(r.subTraitId) ?? { name: r.subTraitName, values: [] };
      bucket.values.push(normalized);
      bySubTrait.set(r.subTraitId, bucket);
    }

    const out: SubTraitScore[] = [];
    for (const [subTraitId, { name, values }] of bySubTrait) {
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      out.push({
        subTraitId,
        subTraitName: name,
        rawScore: values.reduce((a, b) => a + b, 0),
        normalizedScore: Math.round(avg),
        n: values.length,
      });
    }
    return out;
  }

  private normalize(r: ScoredResponse): number | null {
    if (r.questionType === "yes_no") {
      if (r.rawValue === "Y") return this.maybeReverse(100, r.reverseScored);
      if (r.rawValue === "N") return this.maybeReverse(0, r.reverseScored);
      return null;
    }
    if (r.questionType === "likert5") {
      const v = parseInt(r.rawValue, 10);
      if (Number.isNaN(v) || v < 1 || v > 5) return null;
      return this.maybeReverse(((v - 1) / 4) * 100, r.reverseScored);
    }
    if (r.questionType === "mcq") {
      if (!r.correctAnswer) return null;
      return r.rawValue === r.correctAnswer ? 100 : 0;
    }
    return null;
  }

  private maybeReverse(normalized: number, reverseScored: boolean): number {
    return reverseScored ? 100 - normalized : normalized;
  }
}
