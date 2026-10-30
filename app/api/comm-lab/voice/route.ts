import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { findPrompt } from "@/lib/commLab/content";
import { analyseSpeech, browserTranscriptFrom, chargeQuota } from "@/lib/commLab/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Under Vercel's 4.5 MB request limit; the studio records at 64 kb/s, so even a 5.5-minute mock interview is about 2.6 MB. */
const MAX_BYTES = 4 * 1024 * 1024;

/**
 * POST /api/comm-lab/voice (multipart: audio, promptId) - the signed-in
 * student's recording -> transcript, metrics, rubric scores and feedback
 * (lib/commLab/server.ts). The prompt comes from the content by id, never
 * from the browser. The audio is not stored.
 */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const form = await req.formData().catch(() => null);
    const audio = form?.get("audio");
    const found = findPrompt(String(form?.get("promptId") ?? ""));
    if (!found) throw new ApiError(400, "Unknown practice prompt.");
    if (!(audio instanceof File) || !audio.size) throw new ApiError(400, "No recording was received - please record again.");
    if (audio.size > MAX_BYTES) throw new ApiError(413, "That recording is too large to send - please record a shorter take.");
    if (audio.type && !/^audio\/|^video\/(webm|mp4)/.test(audio.type)) throw new ApiError(415, "That file isn't an audio recording.");
    await chargeQuota(await getFirestore(), uid);
    return NextResponse.json({ report: await analyseSpeech(found.prompt, found.track, audio, browserTranscriptFrom(form)) });
  } catch (e) {
    return fail(e);
  }
}
