/**
 * Groq AI Education Search Service
 * Phase 3: AI-powered education and career guidance
 *
 * CRITICAL: Groq API key NEVER in frontend
 * This service runs on backend only
 * Frontend calls /api/ai/search endpoint
 */

// NOTE: In production, get from environment variable
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

/**
 * Student context for personalization
 * Passed from frontend → backend → Groq
 */
export interface StudentContext {
  name: string;
  class: number;
  stream?: string;

  // From assessment
  dimensions?: Record<string, number>;
  topCareers?: string[];
  topCareerCluster?: string;
  archetype?: string;

  // Interests
  savedCareers?: string[];
  savedColleges?: string[];
  interests?: string[];

  // Assessment results
  overallFitment?: number;
}

/**
 * AI message with tracking
 */
export interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * AI response with metadata
 */
export interface AIResponse {
  message: string;
  tokensUsed: number;
  model: string;
  timestamp: Date;
  sourcedInformation: string[]; // Facts that reference external sources
}

/**
 * Default suggested questions for the student
 * Personalized based on their profile
 */
export function getDefaultQuestions(context: StudentContext): string[] {
  const questions: string[] = [];

  // Based on class
  if (context.class === 9 || context.class === 10) {
    questions.push("Which careers match my profile?");
    questions.push("What subjects should I focus on?");
    questions.push("What should I do after Class 10?");
  }

  if (context.class === 11 || context.class === 12) {
    questions.push("Which colleges should I target?");
    questions.push("What entrance exams should I take?");
    questions.push("How should I prepare for competitive exams?");
  }

  // Based on career interests
  if (context.topCareerCluster) {
    questions.push(`What skills do I need for ${context.topCareerCluster}?`);
    questions.push(`What courses suit ${context.topCareerCluster} careers?`);
  }

  // General
  questions.push("What are my strongest career areas?");
  questions.push("What courses and training should I pursue?");
  questions.push("How do I build my career roadmap?");

  return questions.slice(0, 6); // Return max 6
}

/**
 * System prompt for Groq AI
 * Sets boundaries and context
 */
function getSystemPrompt(context: StudentContext): string {
  return `You are OneGrasp, an education and career intelligence assistant.

ROLE:
- Answer questions about education, careers, colleges, exams, internships, and career planning
- ONLY answer questions related to these topics
- Decline politely for other topics

STUDENT CONTEXT:
${context.name ? `- Name: ${context.name}` : ""}
- Class: ${context.class}
${context.stream ? `- Stream: ${context.stream}` : ""}
${context.archetype ? `- Career Profile: ${context.archetype}` : ""}
${context.topCareerCluster ? `- Top Interest: ${context.topCareerCluster}` : ""}
${context.topCareers && context.topCareers.length > 0 ? `- Recommended Careers: ${context.topCareers.join(", ")}` : ""}

INSTRUCTIONS:
1. Be helpful, encouraging, and age-appropriate (this is a Class ${context.class} student)
2. Give concrete, actionable advice
3. When giving facts about colleges, exams, careers, mention sources when possible
4. Distinguish between facts and opinions
5. Avoid making definitive predictions ("you will definitely succeed in X")
6. Encourage exploration and learning
7. For urgent matters (legal, safety), provide relevant contact resources

OUT OF SCOPE - DECLINE POLITELY:
- General knowledge questions
- Technical tutoring (math, science subjects)
- Personal advice beyond career guidance
- Medical or legal advice (except educational awareness)
- Investment or financial trading advice
- Social media or entertainment topics

TONE:
- Friendly, encouraging, supportive
- Age-appropriate (talking to a teenager)
- Professional but not stuffy
- Use examples and real-world context when helpful

END EACH RESPONSE with a small prompt suggestion if relevant.`;
}

/**
 * Call Groq API for education question
 * BACKEND ONLY - Never expose API key to frontend
 */
export async function askEducationQuestion(
  messages: AIMessage[],
  context: StudentContext
): Promise<AIResponse> {
  if (!GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not configured. Set environment variable.");
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768", // or latest available model
        messages: [
          {
            role: "system",
            content: getSystemPrompt(context),
          },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Groq API error:", error);
      throw new Error(`Groq API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await response.json();

    const assistantMessage = data.choices[0]?.message?.content || "";
    const tokensUsed = data.usage?.total_tokens || 0;

    return {
      message: assistantMessage,
      tokensUsed,
      model: data.model,
      timestamp: new Date(),
      sourcedInformation: extractSourcedFacts(assistantMessage),
    };
  } catch (error) {
    console.error("Error calling Groq API:", error);
    throw error;
  }
}

/**
 * Extract facts that mention sources or citations
 * Helps validate what the AI mentioned
 */
function extractSourcedFacts(message: string): string[] {
  const facts: string[] = [];

  // Look for patterns like:
  // - "According to..."
  // - "...says that..."
  // - "Source: ..."
  // - Parenthetical citations

  const sourcePatterns = [
    /According to (.+?)[,.]/gi,
    /\(([^)]*?(government|official|source|website)[^)]*?)\)/gi,
    /Source:\s*([^\n]+)/gi,
  ];

  sourcePatterns.forEach((pattern) => {
    const matches = message.matchAll(pattern);
    for (const match of matches) {
      if (match[1]) {
        facts.push(match[1].trim());
      }
    }
  });

  return facts;
}

/**
 * Usage tracking for the 7-prompt limit
 */
export interface UsageRecord {
  studentId: string;
  usedPrompts: number;
  maxPrompts: number;
  resetDate: Date;
  messages: AIMessage[];
}

/**
 * Check if student has prompts remaining
 */
export function hasPromptsRemaining(usage: UsageRecord): boolean {
  // Reset usage if past reset date
  if (new Date() > usage.resetDate) {
    return true; // Would reset
  }

  return usage.usedPrompts < usage.maxPrompts;
}

/**
 * Get remaining prompt count
 */
export function getRemainingPrompts(usage: UsageRecord): number {
  if (new Date() > usage.resetDate) {
    return usage.maxPrompts;
  }

  return usage.maxPrompts - usage.usedPrompts;
}

/**
 * Format usage message for UI
 */
export function formatUsageMessage(usage: UsageRecord): string {
  const remaining = getRemainingPrompts(usage);

  if (remaining === 0) {
    return "You've used all 7 questions for this month. Check back next month!";
  }

  if (remaining === 1) {
    return `1 question remaining this month`;
  }

  return `${remaining} questions remaining this month`;
}

/**
 * Safety checks before sending to Groq
 */
export function validateQuestion(question: string): { valid: boolean; reason?: string } {
  const question_lower = question.toLowerCase();

  // Check for out-of-scope topics
  const outOfScope = [
    "math help",
    "homework",
    "solve this equation",
    "translate",
    "tell me a joke",
    "dating",
    "relationship",
    "investment tips",
    "stock",
    "bitcoin",
    "crypto",
  ];

  for (const topic of outOfScope) {
    if (question_lower.includes(topic)) {
      return {
        valid: false,
        reason: `I can only help with education and career questions. Please ask about colleges, careers, exams, or career planning.`,
      };
    }
  }

  // Check minimum length
  if (question.trim().length < 5) {
    return {
      valid: false,
      reason: "Please ask a more specific question.",
    };
  }

  // Check maximum length
  if (question.length > 500) {
    return {
      valid: false,
      reason: "Please shorten your question a bit.",
    };
  }

  return { valid: true };
}

/**
 * Create initial empty usage record for new student
 */
export function createUsageRecord(studentId: string): UsageRecord {
  const now = new Date();
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    studentId,
    usedPrompts: 0,
    maxPrompts: 7,
    resetDate,
    messages: [],
  };
}

/**
 * Log a conversation message
 */
export function logMessage(usage: UsageRecord, message: AIMessage): UsageRecord {
  return {
    ...usage,
    messages: [...usage.messages, message],
    usedPrompts: message.role === "user" ? usage.usedPrompts + 1 : usage.usedPrompts,
  };
}
