/**
 * Match ranking - value x urgency x effort, adapted from the spec's own
 * section 5 formula (lib/scholarships/rank.ts in the source doc). "Chance"
 * (competitiveness) is omitted - the spec itself marks it "where known,"
 * and this build has no real applicant/award-count data to compute it
 * honestly, so it's left out rather than guessed.
 */

export interface ScholarshipMatch {
  slug: string;
  amountPerYearInr: number | null;
  years: number | null;
  closesAt: Date | null;
  hasEssay: boolean;
}

export interface RankedMatch extends ScholarshipMatch {
  daysToClose: number | null;
  score: number;
}

export function rankMatches(matches: ScholarshipMatch[], today: Date = new Date()): RankedMatch[] {
  const DAY = 86_400_000;
  return matches
    .map((m) => {
      const value = (m.amountPerYearInr ?? 0) * (m.years ?? 1);
      const days = m.closesAt ? Math.max(0, Math.round((m.closesAt.getTime() - today.getTime()) / DAY)) : null;
      const urgency = days === null ? 1 : days <= 7 ? 3 : days <= 30 ? 2 : 1;
      const effort = m.hasEssay ? 0.8 : 1;
      const score = Math.log10(value + 10) * urgency * effort;
      return { ...m, daysToClose: days, score };
    })
    .sort((a, b) => b.score - a.score);
}

/** Total yearly value of every ELIGIBLE match - the "money you can apply
 *  for" headline counter. */
export function totalApplyForValue(eligible: ScholarshipMatch[]): number {
  return eligible.reduce((sum, m) => sum + (m.amountPerYearInr ?? 0) * (m.years ?? 1), 0);
}
