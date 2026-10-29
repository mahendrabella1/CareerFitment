import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { int, jsonChat, strList } from "@/lib/ai/llm";
import { chargeDaily } from "@/lib/ai/quota";
import { transcribe } from "@/lib/commLab/server";
import { speechMetrics } from "@/lib/commLab/scoring";
import { QUESTIONS } from "@/lib/interview/questions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/interview/feedback (multipart: questionId, audio | text, role?)
 * - feedback on one mock-interview answer. A recording is transcribed by
 * Groq Whisper and its delivery measured in code (pace, fillers, pauses);
 * the content is judged by DeepSeek, or Groq when DeepSeek is unavailable
 * (lib/ai/llm.ts). The recording itself is never stored. 25 a day.
 */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const body = await req.formData().catch(() => null);
    if (!body) throw new ApiError(400, "The answer didn't arrive - please try again.");
    const q = QUESTIONS.find((x) => x.id === String(body.get("questionId") ?? ""));
    if (!q) throw new ApiError(400, "Unknown question.");
    const role = String(body.get("role") ?? "").slice(0, 120).trim();
    const audio = body.get("audio");
    let text = String(body.get("text") ?? "").slice(0, 4000).trim();
    if (audio && typeof audio !== "string" && audio.size > 4 * 1024 * 1024) throw new ApiError(400, "That recording is too long - keep answers under 3 minutes.");
    await chargeDaily(await getFirestore(), uid, "interview", 25, "That's 25 answers reviewed today - great practice! More tomorrow.");

    let delivery: null | { durationSec: number; wpm: number; fillers: number; fillersPerMin: number; longPauses: number } = null;
    if (audio && typeof audio !== "string" && audio.size > 0) {
      const stt = await transcribe(audio);
      const m = speechMetrics({ transcript: stt.text, words: stt.words, durationSec: stt.durationSec, segmentLogprobs: stt.segmentLogprobs });
      text = stt.text.trim();
      delivery = { durationSec: m.durationSec, wpm: m.wpm, fillers: m.fillerCount, fillersPerMin: m.fillersPerMin, longPauses: m.longPauses };
    }
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < 12) {
      return NextResponse.json({ transcript: text, delivery, unscored: delivery ? "We couldn't hear enough to review this. Find a quiet spot, check the microphone and answer for at least 30 seconds." : "Write a fuller answer - at least two or three sentences." });
    }

    const { json } = await jsonChat({
      system: "You are an experienced, encouraging interview coach for students and freshers in India.",
      prompt: `Interview question: "${q.q}"
What the interviewer is checking: ${q.why}
A strong answer: ${q.how}
${role ? `The candidate is preparing for: ${role}\n` : ""}${delivery ? `Their spoken answer (speech-to-text, so small errors may be the transcriber's), ${delivery.durationSec} s long, ${delivery.wpm} words a minute, ${delivery.fillers} filler words:` : "Their written answer:"}
"""${text}"""

Score the answer from 0 to 10 on: relevance (answers what was asked), structure (clear beginning, middle, end - STAR for "tell me about a time" questions), specifics (concrete examples, actions and results rather than claims), impression (confident, positive, professional).
Give exactly 2 strengths and exactly 3 improvements, each one sentence, speaking to the candidate as "you". Then write an improved version of their answer (60-120 words, first person) that keeps their own facts - never invent experiences, numbers or employers; where a detail would help, put a placeholder in square brackets for them to fill in.`,
      schema: {
        type: "object",
        properties: {
          relevance: { type: "integer" }, structure: { type: "integer" }, specifics: { type: "integer" }, impression: { type: "integer" },
          strengths: { type: "array", items: { type: "string" } }, improvements: { type: "array", items: { type: "string" } }, improved: { type: "string" },
        },
        required: ["relevance", "structure", "specifics", "impression", "strengths", "improvements", "improved"],
      },
      maxTokens: 1200,
    });
    const scores = { relevance: int(json.relevance, 10), structure: int(json.structure, 10), specifics: int(json.specifics, 10), impression: int(json.impression, 10) };
    return NextResponse.json({
      transcript: text, delivery, scores,
      total: Math.round(((scores.relevance + scores.structure + scores.specifics + scores.impression) / 40) * 100),
      strengths: strList(json.strengths, 2), improvements: strList(json.improvements, 3),
      improved: String(json.improved ?? "").slice(0, 1500).trim(),
    });
  } catch (e) {
    return fail(e);
  }
}
