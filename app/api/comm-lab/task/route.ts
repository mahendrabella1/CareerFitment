import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { findLesson } from "@/lib/commLab/content";
import { chargeQuota, reviewWriting } from "@/lib/commLab/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** POST /api/comm-lab/task { lessonId, text } - AI rubric review of a writing task (spec §8, "auto" review). */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = (await req.json().catch(() => ({}))) as { lessonId?: string; text?: string };
    const ref = findLesson(String(body.lessonId ?? ""));
    if (!ref || ref.lesson.type !== "task") throw new ApiError(400, "Unknown task.");
    const text = String(body.text ?? "").trim().slice(0, 6000);
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < Math.min(10, ref.lesson.minWords)) throw new ApiError(400, "Write a little more before asking for feedback.");
    await chargeQuota(await getFirestore(), uid);
    return NextResponse.json({ report: await reviewWriting(ref.lesson, ref.track, text) });
  } catch (e) {
    return fail(e);
  }
}
