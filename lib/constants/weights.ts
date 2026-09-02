/**
 * UNIFIED WEIGHTING SYSTEM
 *
 * All career and domain recommendations use these weights.
 *
 * Why these weights?
 * - Interest (42%): Strongest predictor of career satisfaction. What pulls you matters most.
 * - Aptitude (26%): You need ability to succeed. But aptitude alone doesn't drive satisfaction.
 * - MI (22%): Multiple intelligences provide backup paths (logic, people, creativity, etc).
 * - Values (10%): Work environment alignment matters but ranks lower than fit.
 *
 * Career-specific matching adds nuance: personality, EI, academic vary by family.
 * Domain-level recommendations use these core 4 consistently.
 */

export const UNIFIED_WEIGHTS = {
  interest: 0.42,
  aptitude: 0.26,
  mi: 0.22,
  values: 0.10,
} as const;

/**
 * Career-specific matching weights (used for individual job recommendations).
 * These add nuance beyond the core 4 for specific career families.
 *
 * Example: A customer-facing role (retail, hospitality) boosts EI weight.
 *          A technical role (engineering, data science) boosts aptitude weight.
 */
export const CAREER_WEIGHTS = {
  // Core 4 (used for all careers)
  interest: 0.30,
  aptitude: 0.25,

  // Nuanced by family (see FAMILY_WEIGHT_MULTIPLIERS in fitmentModel.ts)
  personality: 0.15,
  values: 0.12,
  mi: 0.08,
  ei: 0.06,
  academic: 0.04,
} as const;

/**
 * RATIONALE FOR TWO SYSTEMS:
 *
 * Domain-level (42/26/22/10):
 * - Simpler, more focused on core fit
 * - Personality/EI/Academic don't differentiate broad domains well
 * - Produces scores in 0-99 range naturally (no artificial inflation)
 *
 * Career-specific (30/25/15/12/8/6/4):
 * - More nuanced, accounts for job-specific requirements
 * - Personality matters for sales/HR; less for engineering
 * - EI matters for management; less for research
 * - Applied with family-specific multipliers for fine-tuning
 *
 * Both sum to 1.0 and are mathematically consistent.
 * No student should ever see a score from one system mixed with the other.
 */
