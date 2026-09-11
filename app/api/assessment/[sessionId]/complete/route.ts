import { NextResponse } from "next/server";
import { getScoringStrategy } from "@/lib/engine/scoring/registry";
import { ScoredResponse } from "@/lib/engine/scoring/types";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { completeLocalSession } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

export async function POST(
  _req: Request,
  { params }: { params: { sessionId: string } }
) {
  if (isLocalAssessmentMode()) {
    try {
      const result = await completeLocalSession(params.sessionId);
      return NextResponse.json({
        success: true,
        message: `Session completed, ${result.scoresComputed} sub-trait scores computed (local mode)`,
        statusCode: 200,
        data: result,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const notFound = /not found/i.test(message);
      return NextResponse.json(
        { success: false, message, statusCode: notFound ? 404 : 500, data: null },
        { status: notFound ? 404 : 500 }
      );
    }
  }

  const admin = getSupabaseAdmin();
  const sessionId = params.sessionId;

  const { data: sessionQuestions, error: sqErr } = await admin
    .from("session_questions")
    .select("question_id, parameter_id, sub_trait_id, blueprint_parameters(name), sub_traits(name), questions(question_type, correct_answer, reverse_scored)")
    .eq("session_id", sessionId);
  if (sqErr) {
    return NextResponse.json(
      { success: false, message: sqErr.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  const { data: responses, error: rErr } = await admin
    .from("assessment_responses")
    .select("question_id, raw_value")
    .eq("session_id", sessionId);
  if (rErr) {
    return NextResponse.json(
      { success: false, message: rErr.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  const responseByQ = new Map(responses?.map((r) => [r.question_id, r.raw_value]) ?? []);

  // Group by parameter so each parameter's own scoring strategy runs on
  // only its own responses.
  const byParameter = new Map<
    string,
    { parameterName: string; responses: ScoredResponse[] }
  >();

  for (const sq of sessionQuestions ?? []) {
    const rawValue = responseByQ.get(sq.question_id);
    if (!rawValue) continue; // unanswered - excluded from scoring, not zero-filled

    const paramName = (sq as any).blueprint_parameters?.name ?? "Unknown";
    const subTraitName = (sq as any).sub_traits?.name ?? "Unknown";
    const q = (sq as any).questions;

    const bucket = byParameter.get(sq.parameter_id) ?? {
      parameterName: paramName,
      responses: [] as ScoredResponse[],
    };
    bucket.responses.push({
      questionId: sq.question_id,
      subTraitId: sq.sub_trait_id,
      subTraitName,
      rawValue,
      questionType: q?.question_type ?? "likert5",
      correctAnswer: q?.correct_answer ?? null,
      reverseScored: q?.reverse_scored ?? false,
    });
    byParameter.set(sq.parameter_id, bucket);
  }

  const scoreRows: {
    session_id: string;
    parameter_id: string;
    sub_trait_id: string;
    raw_score: number;
    normalized_score: number;
    scoring_strategy: string;
  }[] = [];

  for (const [parameterId, { parameterName, responses: paramResponses }] of byParameter) {
    const strategy = getScoringStrategy(parameterName);
    const scores = strategy.score(paramResponses);
    for (const s of scores) {
      scoreRows.push({
        session_id: sessionId,
        parameter_id: parameterId,
        sub_trait_id: s.subTraitId,
        raw_score: s.rawScore,
        normalized_score: s.normalizedScore,
        scoring_strategy: strategy.id,
      });
    }
  }

  if (scoreRows.length > 0) {
    const { error: insErr } = await admin.from("session_scores").insert(scoreRows);
    if (insErr) {
      return NextResponse.json(
        { success: false, message: insErr.message, statusCode: 500, data: null },
        { status: 500 }
      );
    }
  }

  const { error: updErr } = await admin
    .from("assessment_sessions")
    .update({ status: "completed", completed_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (updErr) {
    return NextResponse.json(
      { success: false, message: updErr.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `Session completed, ${scoreRows.length} sub-trait scores computed`,
    statusCode: 200,
    data: { sessionId, scoresComputed: scoreRows.length },
  });
}
