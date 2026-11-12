/**
 * API Route: /api/ai/search - the AI education assistant
 * (app/account/components/AIEducationAssistant.tsx).
 *
 * Security audit H-02: it used to answer anyone, for any "studentId", with no
 * limit and with a caller-supplied conversation (including system messages)
 * sent straight to the model. Now:
 *   - the caller must be signed in (Firebase ID token); the uid comes from the token;
 *   - 20 questions per student per day (lib/ai/quota.ts chargeDaily, server-only aiUsage);
 *   - only user/assistant messages are forwarded - the last 10, each cut to
 *     2,000 characters - and the question to 1,000;
 *   - errors reaching the browser are generic; details go to the server log.
 */
import { NextRequest, NextResponse } from "next/server";
import { askEducationQuestion, validateQuestion, type StudentContext } from "@/lib/ai/groqService";
import { cleanHistory } from "@/lib/ai/searchHistory";
import { envKey } from "@/lib/ai/keys";
import { chargeDaily } from "@/lib/ai/quota";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller } from "@/lib/institution/server";

export const dynamic = "force-dynamic";

const DAILY_LIMIT = 20;
const MAX_QUESTION = 1000;

const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status });

export async function POST(request: NextRequest) {
  try {
    const { uid } = await caller(request);
    if (!envKey("GROQ_API_KEY")) return fail(503, "The AI assistant isn't available right now.");

    const body = (await request.json().catch(() => null)) as { question?: unknown; context?: unknown; messages?: unknown } | null;
    const question = String(body?.question ?? "").trim().slice(0, MAX_QUESTION);
    const context = body?.context && typeof body.context === "object" ? (body.context as StudentContext) : null;
    if (!question || !context || JSON.stringify(context).length > 4000) return fail(400, "Please type a question.");

    const validation = validateQuestion(question);
    if (!validation.valid) return fail(400, validation.reason || "Please ask a question about studies or careers.");

    const used = await chargeDaily(await getFirestore(), uid, "search", DAILY_LIMIT, `That's ${DAILY_LIMIT} questions today - ask again tomorrow.`);
    const response = await askEducationQuestion(cleanHistory(body?.messages, question), context);
    return NextResponse.json({ success: true, message: response.message, remainingPrompts: Math.max(0, DAILY_LIMIT - used) });
  } catch (error) {
    if (error instanceof ApiError) return fail(error.status, error.message);
    console.error("[ai/search]", error instanceof Error ? error.message : error);
    return fail(500, "The AI assistant couldn't answer just now - please try again.");
  }
}

/** GET /api/ai/search?type=questions - suggested starter questions (static, no student data). */
export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("type") !== "questions") return fail(400, "Invalid request");
  return NextResponse.json({
    success: true,
    questions: [
      "Which careers match my profile?",
      "What subjects should I focus on?",
      "What should I do after Class 10?",
      "Which colleges should I target?",
      "What entrance exams should I take?",
      "How should I prepare for my future?",
    ],
  });
}
