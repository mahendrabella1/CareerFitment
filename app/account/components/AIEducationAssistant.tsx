/**
 * AI Education Assistant Component
 * Frontend component for asking education and career questions
 *
 * Features:
 * - Default suggested questions
 * - 7-prompt monthly limit
 * - Conversation history
 * - Professional UI
 */

"use client";

import { useState, useRef, useEffect } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import { Card, SectionHeader } from "@/app/account/components";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface StudentContext {
  name?: string;
  class: number;
  stream?: string;
  topCareers?: string[];
  topCareerCluster?: string;
  archetype?: string;
  dimensions?: Record<string, number>;
}

interface AssistantProps {
  studentId: string;
  context: StudentContext;
  onClose?: () => void;
}

export function AIEducationAssistant({ studentId, context, onClose }: AssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState(7);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load default questions on mount
  useEffect(() => {
    loadDefaultQuestions();
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function loadDefaultQuestions() {
    try {
      const response = await fetch(`/api/ai/search?type=questions&studentId=${studentId}`);
      const data = await response.json();
      if (data.success) {
        setSuggestedQuestions(data.questions);
      }
    } catch (err) {
      console.error("Failed to load questions:", err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || remainingPrompts <= 0) return;

    const userMessage: AIMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          studentId,
          context,
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to get response");
        return;
      }

      const assistantMessage: AIMessage = {
        role: "assistant",
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setRemainingPrompts(data.remainingPrompts);
    } catch (err) {
      setError("Network error. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSuggestedQuestion(question: string) {
    setInput(question);
  }

  const isLimitReached = remainingPrompts <= 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: colors.ink[100],
        borderRadius: radius.lg,
        border: `1px solid ${colors.ink[80]}`,
        boxShadow: shadows.md,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: spacing[4],
          borderBottom: `1px solid ${colors.ink[80]}`,
          backgroundColor: colors.ink[95],
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: typography.scale.h3.fontSize,
              fontWeight: 600,
              color: colors.ink[10],
            }}
          >
            🤖 AI Education Assistant
          </h3>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: typography.scale.sm.fontSize,
              color: colors.ink[40],
            }}
          >
            Ask about careers, colleges, exams, and planning
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
              padding: spacing[2],
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Usage indicator */}
      <div
        style={{
          padding: `${spacing[3]} ${spacing[4]}`,
          backgroundColor: colors.ink[95],
          borderBottom: `1px solid ${colors.ink[80]}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: typography.scale.sm.fontSize,
        }}
      >
        <span style={{ color: colors.ink[40] }}>
          Questions remaining this month:
          <span
            style={{
              fontWeight: 600,
              color: isLimitReached ? colors.error : colors.accent[40],
              marginLeft: spacing[1],
            }}
          >
            {remainingPrompts}
          </span>
        </span>
        {isLimitReached && (
          <span style={{ color: colors.error, fontSize: "11px", fontWeight: 600 }}>
            ⚠️ Limit reached
          </span>
        )}
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: spacing[4],
          display: "flex",
          flexDirection: "column",
          gap: spacing[3],
        }}
      >
        {messages.length === 0 && suggestedQuestions.length > 0 && (
          <div>
            <p
              style={{
                margin: 0,
                fontSize: typography.scale.sm.fontSize,
                color: colors.ink[40],
                marginBottom: spacing[2],
              }}
            >
              Try asking one of these questions:
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing[2],
              }}
            >
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestedQuestion(q)}
                  style={{
                    padding: spacing[3],
                    backgroundColor: colors.ink[95],
                    border: `1px solid ${colors.ink[80]}`,
                    borderRadius: radius.md,
                    textAlign: "left",
                    cursor: "pointer",
                    fontSize: typography.scale.sm.fontSize,
                    color: colors.ink[10],
                    transition: `background-color 180ms ease-out`,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.ink[90])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = colors.ink[95])
                  }
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: spacing[3],
                borderRadius: radius.md,
                backgroundColor:
                  msg.role === "user" ? colors.accent[40] : colors.ink[90],
                color: msg.role === "user" ? colors.ink[100] : colors.ink[10],
                fontSize: typography.scale.sm.fontSize,
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div
            style={{
              display: "flex",
              gap: spacing[1],
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: colors.accent[40],
                animation: "pulse 1.5s infinite",
              }}
            />
            <span
              style={{
                fontSize: typography.scale.sm.fontSize,
                color: colors.ink[40],
              }}
            >
              AI is thinking...
            </span>
          </div>
        )}

        {error && (
          <div
            style={{
              padding: spacing[3],
              backgroundColor: `${colors.error}15`,
              color: colors.error,
              borderRadius: radius.md,
              fontSize: typography.scale.sm.fontSize,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: spacing[4],
          borderTop: `1px solid ${colors.ink[80]}`,
          backgroundColor: colors.ink[100],
          display: "flex",
          gap: spacing[2],
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={isLimitReached || loading}
          style={{
            flex: 1,
            padding: `${spacing[2]} ${spacing[3]}`,
            border: `1px solid ${colors.ink[80]}`,
            borderRadius: radius.md,
            fontSize: typography.scale.sm.fontSize,
            fontFamily: "inherit",
            color: colors.ink[10],
            backgroundColor: colors.ink[95],
            opacity: isLimitReached ? 0.5 : 1,
            cursor: isLimitReached ? "not-allowed" : "text",
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLimitReached || loading}
          style={{
            padding: `${spacing[2]} ${spacing[4]}`,
            backgroundColor: isLimitReached ? colors.ink[50] : colors.accent[40],
            color: colors.ink[100],
            border: "none",
            borderRadius: radius.md,
            fontWeight: 600,
            fontSize: typography.scale.sm.fontSize,
            cursor: isLimitReached ? "not-allowed" : "pointer",
            opacity: !input.trim() || isLimitReached || loading ? 0.5 : 1,
            transition: `background-color 180ms ease-out`,
          }}
          onMouseEnter={(e) => {
            if (!isLimitReached && input.trim()) {
              e.currentTarget.style.backgroundColor = colors.accent[30];
            }
          }}
          onMouseLeave={(e) => {
            if (!isLimitReached && input.trim()) {
              e.currentTarget.style.backgroundColor = colors.accent[40];
            }
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
