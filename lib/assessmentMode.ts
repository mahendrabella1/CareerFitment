/**
 * Whether the assessment's journeys, blueprints, sessions and leads use the
 * app's built-in data ("local" mode) rather than Supabase tables.
 *
 * Local unless ASSESSMENT_DATA_MODE=supabase is set (and the Supabase keys are
 * present). It used to switch to Supabase whenever the keys were present, but
 * the same keys now belong to the job portal's Supabase project, which has no
 * assessment tables - adding them for the jobs made /api/journeys fail with
 * "Could not find the table 'public.journeys'".
 */
export function isLocalAssessmentMode(): boolean {
  if (process.env.ASSESSMENT_DATA_MODE !== "supabase") return true;
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;
}
