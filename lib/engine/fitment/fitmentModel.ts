import { MatchCategory } from "./types";

// §5 of the blueprint — the FITMENT (match) weights, distinct from the
// test-composition weights stored on blueprint_parameters. These answer
// "how much does each category drive the career match?" and must sum to 1.
// Learning Style is deliberately 0% — it is advisory, not a matcher.
//
// Kept as plain data (not in code paths) so it can later move to a
// `fitment_model` table and be tuned per age-group/family without a redeploy.
export const DEFAULT_MATCH_WEIGHTS: Record<MatchCategory, number> = {
  interest: 0.3,
  aptitude: 0.25,
  personality: 0.15,
  values: 0.12,
  mi: 0.08,
  ei: 0.06,
  academic: 0.04,
};

// Per-family nudges (blueprint §5: "people-facing families may boost EI;
// technical families may boost Aptitude"). Applied as multipliers, then the
// active weights are renormalised — so these express relative emphasis, not
// absolute values.
export const FAMILY_WEIGHT_MULTIPLIERS: Record<
  string,
  Partial<Record<MatchCategory, number>>
> = {
  STEM: { aptitude: 1.3, ei: 0.6 },
  Health: { ei: 1.4, academic: 1.3 },
  Social: { ei: 1.5, interest: 1.1 },
  Business: { personality: 1.2, values: 1.2 },
  Creative: { interest: 1.2, mi: 1.4 },
  Media: { interest: 1.2, ei: 1.1 },
  Hospitality: { ei: 1.4, personality: 1.1 },
  "Skilled-Trades": { aptitude: 1.2, academic: 1.1 },
};

export function bandForFitment(pct: number): CareerBand {
  if (pct >= 80) return "Very High";
  if (pct >= 65) return "High";
  if (pct >= 50) return "Good";
  if (pct >= 35) return "Moderate";
  return "Low";
}

export type CareerBand = "Very High" | "High" | "Good" | "Moderate" | "Low";
