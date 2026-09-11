/**
 * API Route: POST /api/ai/search
 *
 * Secure backend endpoint for AI education search
 * - Validates API key on backend (never exposed to frontend)
 * - Tracks prompt usage
 * - Validates questions
 * - Returns personalized responses
 */

import { NextRequest, NextResponse } from "next/server";
import {
  askEducationQuestion,
  validateQuestion,
  getRemainingPrompts,
  type StudentContext,
  type AIMessage,
} from "@/lib/ai/groqService";

/**
 * POST /api/ai/search
 *
 * Body:
 * {
 *   "question": string,
 *   "studentId": string,
 *   "context": StudentContext,
 *   "messages": AIMessage[]  // conversation history
 * }
 *
 * Response:
 * {
 *   "success": boolean,
 *   "message": string,
 *   "remainingPrompts": number,
 *   "error": string (if failed)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY not configured");
      return NextResponse.json(
        {
          success: false,
          error: "AI service not available. Please contact support.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { question, studentId, context, messages } = body;

    // Validate input
    if (!question || !studentId || !context) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: question, studentId, context",
        },
        { status: 400 }
      );
    }

    // Validate question is in scope
    const validation = validateQuestion(question);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.reason || "Invalid question",
        },
        { status: 400 }
      );
    }

    // TODO: In production, fetch actual usage from database
    // For now, assume student has prompts remaining
    const estimatedRemaining = 7; // Would come from database

    if (estimatedRemaining <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "You've used all your questions for this month. Check back next month!",
          remainingPrompts: 0,
        },
        { status: 429 }
      );
    }

    // Build message history for Groq
    const conversationMessages: AIMessage[] = messages || [];
    conversationMessages.push({
      role: "user",
      content: question,
    });

    // Call Groq API
    const response = await askEducationQuestion(conversationMessages, context as StudentContext);

    // TODO: In production, save to database:
    // - conversation log
    // - update usedPrompts count
    // - track timestamp

    return NextResponse.json(
      {
        success: true,
        message: response.message,
        remainingPrompts: estimatedRemaining - 1,
        tokensUsed: response.tokensUsed,
        model: response.model,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("AI search error:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: `Failed to get response: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/search?type=questions&studentId=...
 *
 * Get default suggested questions for the student
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const studentId = searchParams.get("studentId");

    if (type === "questions" && studentId) {
      // TODO: Fetch student context from database
      // For now, return generic questions

      const defaultQuestions = [
        "Which careers match my profile?",
        "What subjects should I focus on?",
        "What should I do after Class 10?",
        "Which colleges should I target?",
        "What entrance exams should I take?",
        "How should I prepare for my future?",
      ];

      return NextResponse.json(
        {
          success: true,
          questions: defaultQuestions,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("AI questions error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to get questions",
      },
      { status: 500 }
    );
  }
}
