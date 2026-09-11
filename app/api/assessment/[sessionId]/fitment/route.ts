import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { getLocalFitment } from "@/lib/localMode/service";
import { computeFitment } from "@/lib/engine/fitment/computeFitment";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } }
) {
  if (isLocalAssessmentMode()) {
    try {
      const data = await getLocalFitment(params.sessionId);
      return NextResponse.json({
        success: true,
        message: "Fitment computed (local mode)",
        statusCode: 200,
        data,
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

  // Supabase path: pull computed scores, shape them like /score, run the matcher.
  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("session_scores")
    .select(
      "raw_score, normalized_score, scoring_strategy, blueprint_parameters(name), sub_traits(name)"
    )
    .eq("session_id", params.sessionId);

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  const byParam = new Map<
    string,
    {
      parameterName: string;
      scoringStrategy: string;
      subTraits: { subTraitName: string; rawScore: number; normalizedScore: number }[];
    }
  >();
  for (const row of data ?? []) {
    const name = (row as any).blueprint_parameters?.name ?? "Unknown";
    const bucket = byParam.get(name) ?? {
      parameterName: name,
      scoringStrategy: (row as any).scoring_strategy,
      subTraits: [] as {
        subTraitName: string;
        rawScore: number;
        normalizedScore: number;
      }[],
    };
    bucket.subTraits.push({
      subTraitName: (row as any).sub_traits?.name ?? "Unknown",
      rawScore: Number((row as any).raw_score ?? 0),
      normalizedScore: Number((row as any).normalized_score ?? 0),
    });
    byParam.set(name, bucket);
  }

  const result = computeFitment([...byParam.values()]);
  return NextResponse.json({
    success: true,
    message: "Fitment computed",
    statusCode: 200,
    data: result,
  });
}
