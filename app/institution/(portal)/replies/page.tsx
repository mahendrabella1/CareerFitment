"use client";

/**
 * /institution/replies - students' replies to the institution's messages,
 * one conversation per student per message. Opening a conversation marks the
 * student's replies read; an answer appears under the message in that
 * student's dashboard inbox.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePortal } from "@/components/institution/portalStore";
import { send, useApi } from "@/components/institution/useApi";
import { HowItWorks } from "@/components/HowItWorks";
import { formatAgo } from "@/lib/institution/analytics";
import type { MessageReply } from "@/lib/institution/types";

interface Thread { messageId: string; messageTitle: string; studentUid: string; studentName: string; replies: MessageReply[]; unread: number; lastAt: number }

export default function RepliesPage() {
  const { refreshUnread } = usePortal();
  const { data, error, reload } = useApi<{ threads: Thread[] }>("/api/institution/replies");
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const key = (t: Thread) => `${t.messageId}|${t.studentUid}`;

  // Opening a conversation marks the student's replies in it as read.
  useEffect(() => {
    const t = data?.threads.find((x) => key(x) === open);
    if (!t || !t.unread) return;
    const ids = t.replies.filter((r) => r.from === "student" && !r.seenBySchool).map((r) => r.id);
    void send("/api/institution/replies", "POST", { seen: ids }).then(() => { void reload(); void refreshUnread(); }).catch(() => undefined);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  async function answer(t: Thread) {
    if (!draft.trim()) return;
    setBusy(true); setMsg("");
    try {
      await send("/api/institution/replies", "POST", { messageId: t.messageId, studentUid: t.studentUid, text: draft });
      setDraft(""); setMsg(`Sent - ${t.studentName} sees it under the message in their dashboard.`);
      await reload();
    } catch (e) { setMsg(e instanceof Error ? e.message : "Could not send."); }
    finally { setBusy(false); }
  }

  const threads = (data?.threads ?? []).filter((t) => filter === "all" || t.unread > 0);
  const unreadTotal = (data?.threads ?? []).reduce((s, t) => s + t.unread, 0);
  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Student replies</h1>
          <p className="ip-sub">When a student replies to one of your messages, the conversation lands here. Answer them directly - they see it in their dashboard inbox.</p>
        </div>
        <div className="ip-tabs">
          <button className={`ip-tab${filter === "all" ? " on" : ""}`} onClick={() => setFilter("all")}>All ({data?.threads.length ?? 0})</button>
          <button className={`ip-tab${filter === "unread" ? " on" : ""}`} onClick={() => setFilter("unread")}>Unread ({unreadTotal})</button>
        </div>
      </div>
      <HowItWorks id="portal-replies" steps={[
        "Send a message from Messages - every student who receives it can reply from their dashboard.",
        "Conversations with new replies show a red count here and on 'Student replies' in the menu (it updates every minute).",
        "Open a conversation to read it - that marks it read - then type your answer and press Send.",
        "The student sees your answer under the original message, marked 'New reply'.",
      ]} sync="Only the student in the conversation sees your answer. OneGrasp admins can see conversations when they open your portal for support." />
      {error && <div className="ip-alert bad">{error}</div>}
      {msg && <div className="ip-alert good">{msg}</div>}
      <div className="ip-card">
        {!data ? <div className="ip-empty">Loading…</div> : threads.length === 0 ? (
          <div className="ip-empty">{filter === "unread" ? "No unread replies - you're all caught up." : <>No replies yet. Students can reply to any message you send from <Link href="/institution/messages">Messages</Link>.</>}</div>
        ) : threads.map((t) => {
          const isOpen = open === key(t);
          const last = t.replies[t.replies.length - 1];
          return (
            <div key={key(t)} style={{ borderTop: "1px solid var(--line)" }}>
              <button onClick={() => { setOpen(isOpen ? null : key(t)); setDraft(""); setMsg(""); }} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 12, alignItems: "center", width: "100%", padding: "13px 16px", boxSizing: "border-box" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800 }}>{t.studentName} <span className="ip-muted" style={{ fontWeight: 600 }}>on &ldquo;{t.messageTitle}&rdquo;</span></div>
                  <div className="ip-muted" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{last.from === "school" ? "You: " : ""}{last.text}</div>
                </div>
                <span className="ip-muted" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{formatAgo(t.lastAt)}</span>
                {t.unread > 0 && <span className="ip-badge">{t.unread}</span>}
              </button>
              {isOpen && (
                <div style={{ padding: "0 16px 16px" }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    {t.replies.map((r) => (
                      <div key={r.id} style={{ justifySelf: r.from === "school" ? "end" : "start", maxWidth: "80%", background: r.from === "school" ? "var(--accentTint)" : "var(--line2)", borderRadius: 12, padding: "9px 12px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                        {r.text}
                        <div className="ip-muted" style={{ fontSize: 11 }}>{r.from === "school" ? r.authorName : t.studentName} · {formatAgo(r.createdAt)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <textarea className="ip-input" rows={2} maxLength={1000} placeholder={`Answer ${t.studentName}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
                    <button className="ip-btn" disabled={busy || !draft.trim()} onClick={() => void answer(t)}>{busy ? "Sending…" : "Send"}</button>
                  </div>
                  <Link className="ip-muted" style={{ display: "inline-block", marginTop: 8, fontSize: 12.5 }} href={`/institution/students/${t.studentUid}`}>Open {t.studentName}&apos;s profile →</Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
