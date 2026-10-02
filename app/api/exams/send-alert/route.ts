// Stateless deadline-alert email, mirroring app/api/startups/grade/route.ts's
// own shape - no server-side auth check (this app has none anywhere), no
// Firestore access here at all. The client already knows which alert is due
// (lib/exams/alertLogic.ts, run against data it already read) and records
// the "sent" dedup entry itself after this call succeeds
// (lib/exams/clientFollow.ts's recordAlertSent) - this route only sends.
import { NextResponse } from "next/server";
import { sendExamDeadlineEmail } from "@/lib/exams/alertEmail";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    to?: string; name?: string | null; examName?: string; message?: string; officialUrl?: string;
  } | null;
  if (!body?.to || !body.examName || !body.message) {
    return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  }
  const sent = await sendExamDeadlineEmail({
    to: body.to, name: body.name ?? null, examName: body.examName, message: body.message, officialUrl: body.officialUrl ?? "",
  });
  return NextResponse.json({ success: sent });
}
