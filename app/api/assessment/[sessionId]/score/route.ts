import { NextResponse } from "next/server";
import { deriveCareerFit } from "@/lib/engine/careerFitment";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { getLocalScore } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

interface ScoreRow {
  parameterName: string;
  subTraitName: string;
  rawScore: number;
  normalizedScore: number;
  scoringStrategy: string;
}

interface ParameterScoreGroup {
  parameterName: string;
  scoringStrategy: string;
  subTraits: {
    subTraitName: string;
    rawScore: number;
    normalizedScore: number;
  }[];
}

export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } }
) {
  if (isLocalAssessmentMode()) {
    try {
      const data = await getLocalScore(params.sessionId);
      return NextResponse.json({
        success: true,
        message: "Scores retrieved (local mode)",
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

  const admin = getSupabaseAdmin();

  const { data: session, error: sessionError } = await admin
    .from("assessment_sessions")
    .select("id, journeys(code, name, age_group)")
    .eq("id", params.sessionId)
    .single();

  if (sessionError || !session) {
    return NextResponse.json(
      { success: false, message: "Session not found", statusCode: 404, data: null },
      { status: 404 }
    );
  }

  const { data, error } = await admin
    .from("session_scores")
    .select("parameter_id, sub_trait_id, raw_score, normalized_score, scoring_strategy, blueprint_parameters(name), sub_traits(name)")
    .eq("session_id", params.sessionId);

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  const shaped: ScoreRow[] = (data ?? []).map((row: any) => ({
    parameterName: row.blueprint_parameters?.name ?? "Unknown",
    subTraitName: row.sub_traits?.name ?? "Unknown",
    rawScore: Number(row.raw_score ?? 0),
    normalizedScore: Number(row.normalized_score ?? 0),
    scoringStrategy: row.scoring_strategy,
  }));

  const parameterMap = new Map<string, ParameterScoreGroup>();

  for (const row of shaped) {
    const bucket: ParameterScoreGroup = parameterMap.get(row.parameterName) ?? {
      parameterName: row.parameterName,
      scoringStrategy: row.scoringStrategy,
      subTraits: [],
    };

    bucket.subTraits.push({
      subTraitName: row.subTraitName,
      rawScore: row.rawScore,
      normalizedScore: row.normalizedScore,
    });
    parameterMap.set(row.parameterName, bucket);
  }

  const parameters = [...parameterMap.values()].map((parameter) => ({
    ...parameter,
    subTraits: parameter.subTraits.sort(
      (a, b) => b.normalizedScore - a.normalizedScore
    ),
  }));

  const journey = (session as any).journeys;
  const fitment = deriveCareerFit(
    journey?.code ?? "",
    shaped
      .filter((row) => row.parameterName === "Career Interests")
      .map((row) => ({
        subTraitName: row.subTraitName,
        normalizedScore: row.normalizedScore,
      }))
  );

  const topStrengths = [...shaped]
    .sort((a, b) => b.normalizedScore - a.normalizedScore)
    .slice(0, 6);

  return NextResponse.json({
    success: true,
    message: "Scores retrieved",
    statusCode: 200,
    data: {
      sessionId: params.sessionId,
      journey: {
        code: journey?.code ?? "",
        name: journey?.name ?? "",
        ageGroup: journey?.age_group ?? "",
      },
      fitment,
      topStrengths,
      parameters,
      totalScores: shaped.length,
    },
  });
}
