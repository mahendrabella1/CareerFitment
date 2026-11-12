// Retired (security audit M-07): part of the old pre-registration exam flow,
// which no page starts any more (app/assessment-experience.tsx sends everyone
// through /register, the payment gate and NewExam). It used to accept
// anonymous writes; it now answers 410 Gone. The old code is in git history.
import { retired } from "@/lib/security/retired";

export const dynamic = "force-dynamic";

export async function GET() {
  return retired();
}
