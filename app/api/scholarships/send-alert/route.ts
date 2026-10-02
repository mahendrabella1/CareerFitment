// Stateless deadline-alert email, mirroring app/api/exams/send-alert/route.ts.
import { NextResponse } from "next/server";
import { sendScholarshipDeadlineEmail } from "@/lib/scholarships/alertEmail";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    to?: string; name?: string | null; scholarshipName?: string; message?: string; officialUrl?: string;
  } | null;
  if (!body?.to || !body.scholarshipName || !body.message) {
    return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  }
  const sent = await sendScholarshipDeadlineEmail({
    to: body.to, name: body.name ?? null, scholarshipName: body.scholarshipName, message: body.message, officialUrl: body.officialUrl ?? "",
  });
  return NextResponse.json({ success: sent });
}
