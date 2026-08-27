"use client";

import { useState, useRef, useEffect } from "react";
import { colors, spacing, radius, shadows } from "@/app/account/designTokens";

const PROMPT_LIMIT = 7;

const PREFILLED_PROMPTS = [
  "What careers align with my interests?",
  "How to prepare for healthcare careers?",
  "What skills do I need for business?",
  "Tell me about engineering fields",
  "Research & academic opportunities?",
  "Financial literacy topics to focus on?",
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
}

export default function SmallChat({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptsUsed, setPromptsUsed] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const key = `prompts_used_${userId}`;
    const stored = localStorage.getItem(key);
    if (stored) setPromptsUsed(parseInt(stored));
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isContentBlocked = (text: string) => {
    const lowerText = text.toLowerCase();
    return BLOCKED_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const isEducationRelated = (text: string) => {
    const keywords = ["career", "education", "study", "degree", "course", "university", "college", "skill", "job"];
    return keywords.some(k => text.toLowerCase().includes(k));
  };

  const handleSend = async () => {
    if (!input.trim() || promptsUsed >= PROMPT_LIMIT || loading) return;

    if (isContentBlocked(input)) {
      setMessages(p => [...p, { id: Date.now().toString(), type: "assistant", content: "I can only help with education and career questions." }]);
      setInput("");
      return;
    }

    if (!isEducationRelated(input)) {
      setMessages(p => [...p, { id: Date.now().toString(), type: "assistant", content: "Please ask about careers or education." }]);
      setInput("");
      return;
    }

    const userMsg: Message = { id: Date.now().toString(), type: "user", content: input };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "You are a career advisor. Answer briefly (2-3 sentences)." },
            { role: "user", content: input }
          ],
        }),
      });

      const data = await res.json();
      const aiMsg: Message = { id: (Date.now() + 1).toString(), type: "assistant", content: data.choices?.[0]?.message?.content || "Sorry, I couldn't respond." };
      setMessages(p => [...p, aiMsg]);

      const newCount = promptsUsed + 1;
      setPromptsUsed(newCount);
      localStorage.setItem(`prompts_used_${userId}`, String(newCount));
    } catch (err) {
      console.error(err);
      setMessages(p => [...p, { id: (Date.now() + 1).toString(), type: "assistant", content: "Error connecting to AI." }]);
    } finally {
      setLoading(false);
    }
  };

  const remaining = PROMPT_LIMIT - promptsUsed;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: spacing[6],
          right: spacing[6],
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: colors.accent[40],
          color: "#fff",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          boxShadow: shadows.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
        title="Career AI Assistant"
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      position: "fixed",
      bottom: spacing[6],
      right: spacing[6],
      width: 350,
      height: 500,
      background: "#fff",
      borderRadius: radius.lg,
      boxShadow: shadows.lg,
      display: "flex",
      flexDirection: "column",
      zIndex: 999,
      border: `1px solid ${colors.ink[80]}`,
    }}>
      {/* Header */}
      <div style={{
        padding: spacing[4],
        borderBottom: `1px solid ${colors.ink[80]}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.ink[10] }}>Career Assistant</div>
          <div style={{ fontSize: 11, color: colors.ink[30] }}>{remaining} questions left today</div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            color: colors.ink[30],
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: spacing[3],
        display: "flex",
        flexDirection: "column",
        gap: spacing[2],
      }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: colors.ink[30], fontSize: 12, padding: spacing[3] }}>
            <div style={{ fontWeight: 700, marginBottom: spacing[2] }}>Ask about careers & education</div>
            <div style={{ fontSize: 11 }}>Get career guidance, explore fields, learn about opportunities</div>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} style={{
            display: "flex",
            justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
          }}>
            <div style={{
              maxWidth: "80%",
              padding: spacing[2],
              borderRadius: radius.md,
              background: msg.type === "user" ? colors.accent[40] : colors.ink[90],
              color: msg.type === "user" ? "#fff" : colors.ink[10],
              fontSize: 12,
              lineHeight: 1.4,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: spacing[3],
        borderTop: `1px solid ${colors.ink[80]}`,
        display: "flex",
        gap: spacing[2],
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask anything..."
          disabled={loading || remaining === 0}
          style={{
            flex: 1,
            padding: spacing[2],
            border: `1px solid ${colors.ink[80]}`,
            borderRadius: radius.sm,
            fontSize: 12,
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim() || remaining === 0}
          style={{
            padding: `${spacing[2]} ${spacing[3]}`,
            background: colors.accent[40],
            color: "#fff",
            border: "none",
            borderRadius: radius.sm,
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
