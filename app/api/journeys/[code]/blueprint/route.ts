import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { getLocalBlueprint } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { code: string } }
) {
  if (isLocalAssessmentMode()) {
    try {
      const data = await getLocalBlueprint(params.code);
      return NextResponse.json({
        success: true,
        message: "Blueprint retrieved (local mode)",
        statusCode: 200,
        data,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json(
        { success: false, message, statusCode: 404, data: null },
        { status: 404 }
      );
    }
  }

  const admin = getSupabaseAdmin();

  const { data: journey, error: jErr } = await admin
    .from("journeys")
    .select("*")
    .eq("code", params.code)
    .single();

  if (jErr || !journey) {
    return NextResponse.json(
      { success: false, message: `Journey not found: ${params.code}`, statusCode: 404, data: null },
      { status: 404 }
    );
  }

  const { data: bp, error: bErr } = await admin
    .from("blueprint_parameters")
    .select("id, name, weight_pct, question_count, sort_order")
    .eq("journey_id", journey.id)
    .order("sort_order");

  if (bErr) {
    return NextResponse.json(
      { success: false, message: bErr.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  const parameters = [];
  for (const p of bp ?? []) {
    const { count } = await admin
      .from("sub_traits")
      .select("id", { count: "exact", head: true })
      .eq("parameter_id", p.id);

    let poolSize = 0;
    if ((count ?? 0) > 0) {
      const { data: traits } = await admin
        .from("sub_traits")
        .select("id")
        .eq("parameter_id", p.id);
      for (const t of traits ?? []) {
        const { count: qCount } = await admin
          .from("questions")
          .select("id", { count: "exact", head: true })
          .eq("sub_trait_id", t.id)
          .eq("is_active", true);
        poolSize += qCount ?? 0;
      }
    }

    const status = poolSize === 0 ? "no_pool" : poolSize < p.question_count * 2 ? "thin" : "ready";

    parameters.push({
      name: p.name,
      weightPct: p.weight_pct,
      questionCount: p.question_count,
      subTraitCount: count ?? 0,
      poolSize,
      status,
    });
  }

  return NextResponse.json({
    success: true,
    message: "Blueprint retrieved",
    statusCode: 200,
    data: {
      journey: { code: journey.code, name: journey.name, ageGroup: journey.age_group },
      totalQuestions: journey.total_questions,
      parameters,
    },
  });
}
