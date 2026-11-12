// Deadline-alert email for a scholarship that matched the signed-in student,
// mirroring app/api/exams/send-alert/route.ts (security audit H-01): signed-in
// callers only, sent to their own verified address, the scholarship looked up
// by slug in our own data, the message one line of plain text.
import { NextResponse } from "next/server";
import { sendScholarshipDeadlineEmail } from "@/lib/scholarships/alertEmail";
import { scholarshipBySlug } from "@/data/scholarships/scholarships";
import { bearerIdentity } from "@/lib/security/requestAuth";
import { plainText, safeHttpUrl } from "@/lib/security/sanitize";

export async function POST(req: Request) {
  const who = await bearerIdentity(req);
  if (!who?.email) return NextResponse.json({ success: false, error: "sign_in" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { scholarshipSlug?: unknown; message?: unknown } | null;
  const scholarship = scholarshipBySlug(String(body?.scholarshipSlug ?? ""));
  const message = plainText(body?.message, 200);
  if (!scholarship || !message) return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  const sent = await sendScholarshipDeadlineEmail({ to: who.email, name: null, scholarshipName: scholarship.name, message, officialUrl: safeHttpUrl(scholarship.officialUrl) });
  return NextResponse.json({ success: sent });
}
