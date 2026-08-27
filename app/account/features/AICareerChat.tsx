"use client";

import { useState, useEffect, useRef } from "react";
import { colors, spacing, radius, shadows } from "@/app/account/designTokens";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const PROMPT_LIMIT = 7;

const PREFILLED_PROMPTS = [
  "What careers align with my interests in technology and innovation?",
  "How can I prepare for a career in healthcare?",
  "What are the top skills needed for business careers?",
  "Tell me about opportunities in engineering fields",
  "How do I get started with research and academic opportunities?",
  "What financial literacy topics should I focus on?",
  "Guide me through study abroad options",
];

const BLOCKED_KEYWORDS = [
  "war", "politics", "violence", "weapons", "conflict", "terrorist",
  "iran", "america", "country politics", "government secrets"
];

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AICareerChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load prompt count from localStorage
  useEffect(() => {
    const key = `prompts_used_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      setPromptsUsed(parseInt(stored));
    }
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isContentBlocked = (text: string): boolean => {
    const lowerText = text.toLowerCase();
    return BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const isEducationRelated = (text: string): boolean => {
    const educationKeywords = [
      "career", "education", "study", "degree", "course", "university",
      "college", "skill", "job", "profession", "learn", "training",
      "certification", "internship", "research", "scholarship",
      "abroad", "exam", "financial", "salary", "industry"
    ];
    const lowerText = text.toLowerCase();
    return educationKeywords.some(keyword => lowerText.includes(keyword));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Check prompt limit
    if (promptsUsed >= PROMPT_LIMIT) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "assistant",
        content: `You've reached your daily limit of ${PROMPT_LIMIT} questions. Come back tomorrow to ask more!`,
        timestamp: new Date()
      }]);
      return;
    }

    // Check if content is blocked
    if (isContentBlocked(input)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "assistant",
        content: "I can only help with education and career-related questions. Please ask about careers, studies, or learning opportunities.",
        timestamp: new Date()
      }]);
      setInput("");
      return;
    }

    // Check if education related
    if (!isEducationRelated(input)) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: "user",
        content: input,
        timestamp: new Date()
      }, {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "I'm specifically designed to help with career and education questions. Please ask about careers, courses, skills, universities, or learning opportunities!",
        timestamp: new Date()
      }]);
      setInput("");
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GEMINI_API_KEY}`
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [{
              role: "system",
              content: "You are an expert career and education advisor. Answer questions about careers, education, and learning opportunities. Keep answers concise and practical. Only answer education and career-related questions."
            }, {
              role: "user",
              content: input
            }],
            max_tokens: 500,
            temperature: 0.7
          })
        }
      );

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: data.choices?.[0]?.message?.content || "Unable to generate response.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Update prompt count
      const newCount = promptsUsed + 1;
      setPromptsUsed(newCount);
      localStorage.setItem(`prompts_used_${userId}`, newCount.toString());
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Sorry, I couldn't process that request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const remainingPrompts = PROMPT_LIMIT - promptsUsed;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🤖 Career & Education Assistant</h2>
          <p style={styles.subtitle}>Ask anything about careers, education, and learning opportunities</p>
        </div>
        <div style={styles.remaining}>
          <span style={styles.remainingLabel}>Questions Remaining:</span>
          <span style={styles.remainingCount}>{remainingPrompts}/{PROMPT_LIMIT}</span>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messagesContainer}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyTitle}>Hi there! 👋</p>
            <p style={styles.emptyText}>Ask me anything about careers, education, or learning paths</p>
            <div style={styles.suggestionsGrid}>
              {PREFILLED_PROMPTS.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  style={styles.suggestionButton}
                >
                  <span style={styles.suggestionIcon}>✨</span>
                  <span style={styles.suggestionText}>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} style={{
            ...styles.messageWrapper,
            justifyContent: msg.type === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              ...styles.message,
              background: msg.type === "user" ? colors.accent[40] : colors.ink[90],
              color: msg.type === "user" ? "#fff" : colors.ink[10]
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about careers, education, or learning..."
            disabled={loading || remainingPrompts === 0}
            style={styles.input}
          />
          <button
            onClick={handleSendMessage}
            disabled={loading || !input.trim() || remainingPrompts === 0}
            style={styles.sendButton}
          >
            {loading ? "..." : "→"}
          </button>
        </div>
        {remainingPrompts === 0 && (
          <p style={styles.limitMessage}>You've used all your daily questions. Come back tomorrow!</p>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "600px",
    background: "#fff",
    borderRadius: radius.lg,
    boxShadow: shadows.lg,
    overflow: "hidden",
  },
  header: {
    padding: spacing[5],
    borderBottom: `1px solid ${colors.ink[80]}`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.ink[10],
    margin: 0,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 13,
    color: colors.ink[20],
    margin: 0,
  },
  remaining: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  remainingLabel: {
    fontSize: 11,
    color: colors.ink[20],
    marginBottom: spacing[1],
  },
  remainingCount: {
    fontSize: 24,
    fontWeight: 800,
    color: colors.accent[40],
  },
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: spacing[5],
    display: "flex",
    flexDirection: "column",
    gap: spacing[4],
  },
  messageWrapper: {
    display: "flex",
    marginBottom: spacing[2],
  },
  message: {
    padding: `${spacing[3]} ${spacing[4]}`,
    borderRadius: radius.md,
    maxWidth: "70%",
    wordWrap: "break-word",
    fontSize: 14,
    lineHeight: 1.5,
  },
  emptyState: {
    textAlign: "center",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.ink[10],
    margin: 0,
    marginBottom: spacing[2],
  },
  emptyText: {
    fontSize: 14,
    color: colors.ink[20],
    margin: 0,
    marginBottom: spacing[5],
  },
  suggestionsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: spacing[3],
  },
  suggestionButton: {
    background: colors.ink[95],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    padding: spacing[3],
    cursor: "pointer",
    display: "flex",
    alignItems: "flex-start",
    gap: spacing[3],
    transition: "all 0.2s",
    textAlign: "left",
  },
  suggestionIcon: {
    fontSize: 16,
    flexShrink: 0,
  },
  suggestionText: {
    fontSize: 13,
    color: colors.ink[80],
    fontWeight: 500,
  },
  inputArea: {
    padding: spacing[4],
    borderTop: `1px solid ${colors.ink[80]}`,
    background: colors.ink[95],
  },
  inputWrapper: {
    display: "flex",
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  input: {
    flex: 1,
    padding: `${spacing[2]} ${spacing[3]}`,
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    outline: "none",
    fontFamily: "inherit",
  },
  sendButton: {
    padding: `${spacing[2]} ${spacing[3]}`,
    background: colors.accent[40],
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 700,
  },
  limitMessage: {
    fontSize: 12,
    color: "#dc2626",
    margin: 0,
    textAlign: "center",
  },
};
