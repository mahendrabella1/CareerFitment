import { NextResponse } from "next/server";
import { emailFromToken } from "@/lib/firebaseIdentity";
import { sendAssessmentCompletionEmail } from "@/lib/studentEmail";
import { sendAssessmentCompletedNotification } from "@/lib/leadEmail";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// POST /api/assessment/completion-email — confirms to the student that their
// assessment is in, and tells them how to sign back in for the report.
//
// The REPORT itself is not sent here: that stays a deliberate admin action from
// /admin, so nobody receives a report before the team has looked at it.
//
// The recipient comes from the Firebase ID token, never from the request body.
// That single decision is what stops this being an open relay — a caller can
// only ever mail the address attached to the account they are signed in as, so
// it cannot be pointed at a stranger's inbox.
export async function POST(req: Request) {
  let body: { idToken?: string; name?: string; topCareer?: string; alignment?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body" }, { status: 400 });
  }

  if (!body.idToken) {
    return NextResponse.json({ success: false, message: "Not signed in." }, { status: 401 });
  }

  const to = await emailFromToken(body.idToken);
  if (!to) {
    // Either the token is bad or the lookup is down. Never fall back to an
    // address from the body — that is exactly the hole this route avoids.
    return NextResponse.json({ success: false, message: "Could not verify who to send to." }, { status: 401 });
  }

  // Two independent emails, sent together rather than in sequence so a slow
  // send doesn't hold the other one up:
  //   • the student's confirmation and sign-in steps;
  //   • the team's "somebody has a report waiting" notice. Without that second
  //     one nobody knows to send the report, because that stays a manual
  //     action in /admin.
  // Neither can reject — both swallow their own failures — so this cannot throw.
  const [sent, notified] = await Promise.all([
    sendAssessmentCompletionEmail({
      to,
      name: body.name ?? "",
      topCareer: body.topCareer ?? "",
    }),
    sendAssessmentCompletedNotification({
      name: body.name ?? "",
      email: to,
      topCareer: body.topCareer ?? "",
      alignment: typeof body.alignment === "number" ? body.alignment : null,
    }),
  ]);

  // `sent: false` means SMTP isn't configured on this deployment (or bounced).
  // Still a 200: the assessment succeeded, and the student is already looking at
  // the same information on screen. The caller treats this as best-effort.
  return NextResponse.json({ success: true, sent, notified });
}
