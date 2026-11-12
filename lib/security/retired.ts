/**
 * Server-only: the answer for an endpoint that has been switched off
 * (security audit M-07). The old pre-registration exam flow behind
 * /api/assessment/{generate,[sessionId]/answers|complete|score|fitment|programmes}
 * can't be started from any page any more - everyone goes through /register,
 * the payment gate and NewExam - but the routes still accepted anonymous
 * writes. They now return 410 Gone; the old code is in git history.
 */
import { NextResponse } from "next/server";

export function retired(): NextResponse {
  return NextResponse.json(
    { success: false, statusCode: 410, data: null, message: "This assessment link is no longer in use. Please sign in and start the assessment from your dashboard." },
    { status: 410 },
  );
}
