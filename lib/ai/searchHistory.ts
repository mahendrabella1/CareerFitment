/** The AI assistant's conversation as the model may see it (app/api/ai/search, security audit H-02). */
import type { AIMessage } from "./groqService";

const MAX_MESSAGE = 2000;
const MAX_HISTORY = 10;

/** The conversation as the model may see it: user and assistant turns only, trimmed. */
export function cleanHistory(raw: unknown, question: string): AIMessage[] {
  const list = (Array.isArray(raw) ? raw : [])
    .filter((m): m is { role: string; content: unknown } => !!m && typeof m === "object" && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({ role: m.role as AIMessage["role"], content: String(m.content ?? "").slice(0, MAX_MESSAGE) }))
    .filter((m) => m.content.trim());
  // The browser sends the history with the new question already on the end; don't send it twice.
  const last = list[list.length - 1];
  if (last?.role === "user" && last.content.trim() === question.trim()) list.pop();
  return [...list.slice(-MAX_HISTORY), { role: "user", content: question }];
}

