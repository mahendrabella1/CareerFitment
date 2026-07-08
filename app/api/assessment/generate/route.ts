import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/client";
import { generateSession } from "@/lib/engine/selectionEngine";
import { isLocalAssessmentMode } from "@/lib/assessmentMode";
import { generateLocalSession } from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { journeyCode?: string; userId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body", statusCode: 400, data: null },
      { status: 400 }
    );
  }

  if (!body.journeyCode) {
    return NextResponse.json(
      { success: false, message: "journeyCode is required", statusCode: 400, data: null },
      { status: 400 }
    );
  }

  try {
    const session = isLocalAssessmentMode()
      ? await generateLocalSession(body.journeyCode, body.userId ?? null)
      : await generateSession(getSupabaseAdmin(), body.journeyCode, body.userId ?? null);

    const gaps = session.parameters.filter((p) => p.status !== "live");
    const message =
      gaps.length > 0
        ? `Session generated with ${gaps.length} parameter(s) incomplete: ${gaps
            .map((g) => g.name)
            .join(", ")}`
        : "Session generated";

    return NextResponse.json({
      success: true,
      message,
      statusCode: 200,
      data: session,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error generating session";
    return NextResponse.json(
      { success: false, message, statusCode: 500, data: null },
      { status: 500 }
    );
  }
}
