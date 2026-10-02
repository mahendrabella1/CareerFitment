import { NextResponse } from "next/server";
import { getLesson, getModule } from "@/data/startups/content";
import { gradeQuiz, type SubmittedAnswer } from "@/lib/startups/scoring";

// Stateless grading, mirroring new-assessment/score/route.ts's own shape -
// no server-side auth check (this app has none anywhere; identity + access
// control live in Firestore security rules once the client persists the
// graded result - see lib/startups/clientProgress.ts). Re-reads the real
// question bank from data/startups/content.ts every time, so a client can
// never submit a forged "correct" answer that was never actually checked
// server-side.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as {
    trackSlug?: string; moduleSlug?: string; lessonSlug?: string;
    kind?: "LESSON" | "MODULE_TEST"; answers?: SubmittedAnswer[];
  } | null;
  if (!body?.trackSlug || !body?.moduleSlug || !body?.kind || !Array.isArray(body.answers)) {
    return NextResponse.json({ success: false, error: "bad_request" }, { status: 400 });
  }

  if (body.kind === "LESSON") {
    if (!body.lessonSlug) return NextResponse.json({ success: false, error: "missing_lessonSlug" }, { status: 400 });
    const lesson = getLesson(body.trackSlug, body.moduleSlug, body.lessonSlug);
    if (!lesson) return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
    const result = gradeQuiz(lesson.quiz, body.answers, lesson.passMark);
    return NextResponse.json({ success: true, result });
  }

  // MODULE_TEST: the test page draws a random subset of the module's bank
  // server-side per visit and shows only that subset, so grading only ever
  // scores the specific questions actually submitted - a valid subset of
  // the real bank, never the full bank regardless of what's submitted.
  const module = getModule(body.trackSlug, body.moduleSlug);
  if (!module) return NextResponse.json({ success: false, error: "not_found" }, { status: 404 });
  const submittedIds = new Set(body.answers.map((a) => a.questionId));
  const questions = module.moduleTestBank.filter((q) => submittedIds.has(q.id));
  if (questions.length === 0) return NextResponse.json({ success: false, error: "no_matching_questions" }, { status: 400 });
  const result = gradeQuiz(questions, body.answers, module.passMark);
  return NextResponse.json({ success: true, result });
}
