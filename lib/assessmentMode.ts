export function isLocalAssessmentMode(): boolean {
  return (
    process.env.ASSESSMENT_DATA_MODE === "local" ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
