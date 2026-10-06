import { NextResponse } from "next/server";
import { fail, requireInstitution, studentsOf } from "@/lib/institution/server";
import { toStudentRow } from "@/lib/institution/analytics";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * GET /api/institution/students - every student linked to the caller's
 * institution, as list rows (profile basics, assessment status and best fit,
 * time spent, course and goal progress). Overview figures are computed from
 * these rows on the page (lib/institution/analytics.ts overview()).
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const now = Date.now();
    const docs = await studentsOf(db, institution);
    const students = [...docs.entries()].map(([uid, d]) => toStudentRow(uid, d, now));
    return NextResponse.json({ students, generatedAt: now });
  } catch (e) {
    return fail(e);
  }
}
