import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { saveLocalAnswer } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { sessionId: string } }
) {
  let body: { questionId?: string; value?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body", statusCode: 400, data: null },
      { status: 400 }
    );
  }
  if (!body.questionId || !body.value) {
    return NextResponse.json(
      { success: false, message: "questionId and value are required", statusCode: 400, data: null },
      { status: 400 }
    );
  }

  if (isLocalAssessmentMode()) {
    try {
      const data = await saveLocalAnswer(params.sessionId, body.questionId, body.value);
      return NextResponse.json({
        success: true,
        message: "Response recorded (local mode)",
        statusCode: 200,
        data,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const notFound = /not found|not assigned/i.test(message);
      return NextResponse.json(
        { success: false, message, statusCode: notFound ? 403 : 500, data: null },
        { status: notFound ? 403 : 500 }
      );
    }
  }

  const admin = getSupabaseAdmin();

  // Reject answers for questions that weren't actually assigned to this
  // session — prevents a client from scoring against arbitrary question ids.
  const { data: assigned, error: aErr } = await admin
    .from("session_questions")
    .select("question_id")
    .eq("session_id", params.sessionId)
    .eq("question_id", body.questionId)
    .maybeSingle();

  if (aErr) {
    return NextResponse.json(
      { success: false, message: aErr.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }
  if (!assigned) {
    return NextResponse.json(
      {
        success: false,
        message: "This question was not assigned to this session",
        statusCode: 403,
        data: null,
      },
      { status: 403 }
    );
  }

  const { data, error } = await admin
    .from("assessment_responses")
    .upsert(
      { session_id: params.sessionId, question_id: body.questionId, raw_value: body.value },
      { onConflict: "session_id,question_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Response recorded",
    statusCode: 200,
    data,
  });
}
