import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { listLocalJourneys } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

export async function GET() {
  if (isLocalAssessmentMode()) {
    try {
      const journeys = await listLocalJourneys();
      const data = journeys.map((j) => ({
        code: j.code,
        name: j.name,
        age_group: j.age_group,
        total_questions: j.total_questions,
      }));
      return NextResponse.json({
        success: true,
        message: "Journeys retrieved (local mode)",
        statusCode: 200,
        data,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      return NextResponse.json(
        { success: false, message, statusCode: 500, data: null },
        { status: 500 }
      );
    }
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("journeys")
    .select("code, name, age_group, total_questions")
    .eq("is_active", true)
    .order("age_group");

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message, statusCode: 500, data: null },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Journeys retrieved",
    statusCode: 200,
    data,
  });
}
