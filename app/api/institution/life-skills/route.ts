import { NextResponse } from "next/server";
import { fail, requireInstitution, rowsOf } from "@/lib/institution/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/institution/life-skills - how the institution's students do in
 * the Scam Shield games (accuracy per game, from moneyScamRounds), alongside
 * their legal-scenario practice and money-course progress (on their rows).
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const rows = rowsOf(db, institution);
    const students = await rows;
    const uids = students.filter((s) => !s.archived).map((s) => s.uid);
    const scam: Record<string, Record<string, { correct: number; total: number; rounds: number }>> = {};
    for (let i = 0; i < uids.length; i += 30) {
      const snap = await db.collection("moneyScamRounds").where("uid", "in", uids.slice(i, i + 30)).get();
      snap.forEach((d) => {
        const r = d.data() as { uid: string; mode: string; correct: number; total: number };
        const m = ((scam[r.uid] ??= {})[r.mode] ??= { correct: 0, total: 0, rounds: 0 });
        m.correct += Number(r.correct) || 0;
        m.total += Number(r.total) || 0;
        m.rounds++;
      });
    }
    return NextResponse.json({ students, scam });
  } catch (e) {
    return fail(e);
  }
}
