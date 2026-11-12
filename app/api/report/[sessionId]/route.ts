import { NextResponse } from "next/server";
import { GENERIC_ERROR } from "@/lib/security/serverError";
import {
  getLocalScore,
  getLocalFitment,
  findLeadBySession,
} from "@/lib/localMode/service";

export const dynamic = "force-dynamic";

// Consolidated report payload for the student report viewer / dashboard:
// score breakdown + career fitment + the captured student details (if any).
// Sessions live in the local store regardless of Firestore (per the chosen
// Questions+Leads cloud scope), so the score/fitment helpers apply either way.
export async function GET(
  _req: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const [score, fitment, lead] = await Promise.all([
      getLocalScore(params.sessionId),
      getLocalFitment(params.sessionId),
      findLeadBySession(params.sessionId),
    ]);

    const student = lead
      ? {
          name: lead.name,
          email: lead.email,
          city: lead.city,
          age: lead.age,
          dreamCareer: lead.dreamCareer,
          stage: lead.stage,
        }
      : null;

    return NextResponse.json({
      success: true,
      message: "Report retrieved",
      statusCode: 200,
      data: { student, score, fitment },
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[report]", detail);
    const notFound = /not found/i.test(detail);
    const message = notFound ? "This report wasn't found." : GENERIC_ERROR;
    return NextResponse.json(
      { success: false, message, statusCode: notFound ? 404 : 500, data: null },
      { status: notFound ? 404 : 500 }
    );
  }
}
