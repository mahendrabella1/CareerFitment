// Deadline-alert email for an exam the signed-in student follows. The client
// works out which alert is due (lib/exams/alertLogic.ts) and records the "sent"
// entry itself afterwards (lib/exams/clientFollow.ts recordAlertSent); this
// route only sends.
//
// Security audit H-01: it used to send whatever the body said to whatever
// address the body named - an open mail relay with OneGrasp's name on it. Now:
// the caller must be signed in, the email goes only to their own verified
// address, the exam (its name and link) comes from our own data by slug, and
// the message is one line of plain text.
import { NextResponse } from "next/server";
import { sendExamDeadlineEmail } from "@/lib/exams/alertEmail";
import { examBySlug } from "@/data/exams/exams";
import { bearerIdentity } from "@/lib/security/requestAuth";
import { plainText, safeHttpUrl } from "@/lib/security/sanitize";

export async function POST(req: Request) {
  const who = await bearerIdentity(req);
  if (!who?.email) return NextResponse.json({ success: false, error: "sign_in" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { examSlug?: unknown; message?: unknown } | null;
  const exam = examBySlug(String(body?.examSlug ?? ""));
  const message = plainText(body?.message, 200);
  if (!exam || !message) return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  const sent = await sendExamDeadlineEmail({ to: who.email, name: null, examName: exam.name, message, officialUrl: safeHttpUrl(exam.officialUrl) });
  return NextResponse.json({ success: sent });
}
