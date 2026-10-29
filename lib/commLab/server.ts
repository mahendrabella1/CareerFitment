/**
 * Communication Lab analysis (server only): speech-to-text, the speech and
 * writing rubrics, and a daily cap per student.
 *
 *   audio -> Groq Whisper (transcript + word timestamps)        GROQ_API_KEY
 *         -> metrics in code (WPM, fillers, pauses, clarity) -> fluency and pronunciation marks
 *         -> Groq's Llama scores content, structure, grammar, tone and writes the feedback
 *
 * Everything runs on GROQ_API_KEY. The recording is never stored: it is sent
 * for transcription and dropped; only the transcript and scores go back.
 */
import type { Firestore } from "firebase-admin/firestore";
import { ApiError } from "@/lib/institution/server";
import { jsonChat } from "@/lib/ai/llm";
import { dayKey } from "@/lib/progress/activity";
import type { Track, VoicePrompt, VoiceReport, TaskLesson, TaskReport } from "./types";
import { fluencyScore, pronunciationScore, speechMetrics, type TimedWord } from "./scoring";

/** AI checks (voice + writing) per student per day - the cost cap (spec §23 Q1). */
export const DAILY_LIMIT = 40;

export async function chargeQuota(db: Firestore, uid: string): Promise<void> {
  const ref = db.collection("commLabUsage").doc(`${uid}_${dayKey()}`);
  await db.runTransaction(async (tx) => {
    const n = Number((await tx.get(ref)).get("n") ?? 0);
    if (n >= DAILY_LIMIT) throw new ApiError(429, `That's ${DAILY_LIMIT} practice checks today - great work! More tomorrow.`);
    tx.set(ref, { uid, n: n + 1, at: Date.now() }, { merge: true });
  });
}

const audience = (t: Track) => (t.id === "t4" ? "an undergraduate student in India" : `a ${t.level} school student in India`);

// ------------------------------------------------------------------ speech-to-text

interface Transcript { text: string; words: TimedWord[]; segmentLogprobs: number[]; durationSec: number }

export async function transcribe(audio: File): Promise<Transcript> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new ApiError(503, "Voice feedback isn't switched on yet - the server needs a speech-to-text key (GROQ_API_KEY).");
  const form = new FormData();
  form.append("file", audio, audio.name || "recording.webm");
  form.append("model", "whisper-large-v3-turbo");
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");
  form.append("language", "en");
  form.append("temperature", "0");
  // Whisper tidies away "um"s unless its prompt contains some; this keeps them in.
  form.append("prompt", "Umm, let me think like, hmm... Okay, here's what I'm, like, thinking. Uh, so, you know, basically...");
  const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", { method: "POST", headers: { Authorization: `Bearer ${key}` }, body: form });
  const data = (await res.json().catch(() => ({}))) as {
    text?: string; duration?: number; error?: { message?: string };
    words?: { word: string; start: number; end: number }[];
    segments?: { avg_logprob?: number }[];
  };
  if (!res.ok) throw new ApiError(502, `Speech-to-text failed: ${data.error?.message ?? res.status}`);
  return {
    text: (data.text ?? "").trim(),
    words: (data.words ?? []).map((w) => ({ word: w.word, start: Number(w.start), end: Number(w.end) })),
    segmentLogprobs: (data.segments ?? []).map((s) => Number(s.avg_logprob)),
    durationSec: Number(data.duration ?? 0),
  };
}

// ------------------------------------------------------------------ the rubric model

const SPEECH_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["content", "structure", "grammar", "tone", "strengths", "improvements", "next_tip"],
  properties: {
    content: { type: "integer", description: "Content and relevance, 0-25" },
    structure: { type: "integer", description: "Structure (opening, body, closing), 0-20" },
    grammar: { type: "integer", description: "Grammar and vocabulary, 0-15" },
    tone: { type: "integer", description: "Confidence and tone, 0-5" },
    strengths: { type: "array", items: { type: "string" }, description: "Exactly 3 short strengths" },
    improvements: { type: "array", items: { type: "string" }, description: "Exactly 3 short, specific improvements" },
    next_tip: { type: "string", description: "One sentence: one thing to try next time" },
  },
} as const;

const WRITING_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["criteria", "strengths", "improvements", "next_tip"],
  properties: {
    criteria: {
      type: "array",
      description: "One entry per rubric criterion, in the order given",
      items: { type: "object", additionalProperties: false, required: ["name", "score"], properties: { name: { type: "string" }, score: { type: "integer", description: "0-10" } } },
    },
    strengths: { type: "array", items: { type: "string" }, description: "2 or 3 short strengths" },
    improvements: { type: "array", items: { type: "string" }, description: "2 or 3 short, specific improvements" },
    next_tip: { type: "string", description: "One sentence: one thing to try next time" },
  },
} as const;

/** One rubric call (lib/ai/llm.ts: DeepSeek when its key works, else Groq's Llama), JSON mode.
 *  Scores are clamped to their ranges afterwards, so a stray value can't break a report. */
async function rubricJson(prompt: string, schema: Record<string, unknown>): Promise<Record<string, unknown>> {
  return (await jsonChat({ system: "You score student practice fairly and kindly.", prompt, schema })).json;
}

const int = (v: unknown, max: number) => Math.min(max, Math.max(0, Math.round(Number(v) || 0)));
const three = (v: unknown, fallback: string) => {
  const list = (Array.isArray(v) ? v : []).map((x) => String(x).trim()).filter(Boolean).slice(0, 3);
  return list.length ? list : [fallback];
};

// ------------------------------------------------------------------ speech

export async function analyseSpeech(prompt: VoicePrompt, track: Track, audio: File): Promise<VoiceReport> {
  const stt = await transcribe(audio);
  const metrics = speechMetrics({ transcript: stt.text, words: stt.words, durationSec: stt.durationSec, segmentLogprobs: stt.segmentLogprobs });
  const wordCount = stt.words.length || stt.text.split(/\s+/).filter(Boolean).length;
  const empty = { content: 0, structure: 0, fluency: 0, pronunciation: 0, grammar: 0, tone: 0 };
  if (wordCount < 5 || metrics.durationSec < 4) {
    return {
      promptId: prompt.id, transcript: stt.text, metrics, scores: empty, total: 0,
      feedback: { strengths: [], improvements: [], nextTip: "Hold the phone or laptop closer and speak a little louder." },
      unscored: "We couldn't hear enough to score this one. Find a quiet spot, check the microphone, and try again.",
    };
  }
  const fluency = fluencyScore(metrics);
  const pronunciation = pronunciationScore(metrics.clarity);
  const llm = await rubricJson(
    `You are a friendly communication coach for ${audience(track)}.
Prompt given to the student: "${prompt.text}"${prompt.passage ? `\nPassage they were asked to read aloud: "${prompt.passage}"` : ""}
Target duration: ${prompt.minSec}-${prompt.maxSec} seconds (aim: ${prompt.targetSec} s). They spoke for ${metrics.durationSec} s.
Transcript (from speech-to-text, so small errors may be the transcriber's): "${stt.text}"
Measured: ${metrics.wpm} words per minute (healthy 110-150), ${metrics.fillerCount} filler words (${metrics.fillersPerMin} per minute; healthy under 3), ${metrics.longPauses} pauses over 1.5 s.

Score with this rubric: content and relevance (0-25), structure - opening, body, closing (0-20), grammar and vocabulary (0-15), confidence and tone (0-5; judge from the words and the measured fluency).
Also give exactly 3 strengths, exactly 3 improvements and one next tip (one sentence).
Use encouraging, age-appropriate language. Do not mention the rubric numbers in the feedback text. Speak to the student as "you".`,
    SPEECH_SCHEMA,
  );
  const scores = { content: int(llm.content, 25), structure: int(llm.structure, 20), fluency, pronunciation, grammar: int(llm.grammar, 15), tone: int(llm.tone, 5) };
  return {
    promptId: prompt.id,
    transcript: stt.text,
    metrics,
    scores,
    total: Object.values(scores).reduce((a, b) => a + b, 0),
    feedback: {
      strengths: three(llm.strengths, "You finished your answer - that's the hardest part."),
      improvements: three(llm.improvements, "Try once more, a little slower."),
      nextTip: String(llm.next_tip ?? "").trim() || "Record it again tomorrow and compare.",
    },
  };
}

// ------------------------------------------------------------------ writing

export async function reviewWriting(task: TaskLesson, track: Track, text: string): Promise<TaskReport> {
  const llm = await rubricJson(
    `You are a friendly writing coach for ${audience(track)}.
The task: "${task.instructions}"
Rubric criteria (score each 0-10, in this order):
${task.rubric.map((r, i) => `${i + 1}. ${r}`).join("\n")}

The student's writing:
"""
${text}
"""

Score each criterion, then give 2-3 strengths, 2-3 specific improvements (quote a phrase from their writing where it helps) and one next tip (one sentence).
Use encouraging, age-appropriate language. Speak to the student as "you". Do not rewrite their work for them.`,
    WRITING_SCHEMA,
  );
  const given = Array.isArray(llm.criteria) ? (llm.criteria as { name?: unknown; score?: unknown }[]) : [];
  const criteria = task.rubric.map((name, i) => ({ name, score: int(given[i]?.score, 10) }));
  return {
    score: Math.round((criteria.reduce((n, c) => n + c.score, 0) / (criteria.length * 10)) * 100),
    criteria,
    strengths: three(llm.strengths, "You completed the task."),
    improvements: three(llm.improvements, "Read it aloud once and fix anything that sounds unclear."),
    nextTip: String(llm.next_tip ?? "").trim() || "Revise it once and submit again.",
  };
}
