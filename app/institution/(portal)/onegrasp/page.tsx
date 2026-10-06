"use client";

/**
 * /institution/onegrasp - the institution's line to OneGrasp: notices
 * OneGrasp posted to this portal, and support conversations (ask a
 * question, report a problem, request a feature). OneGrasp answers from the
 * admin Messages page; answers show here with a badge in the menu.
 */
import { useEffect, useState } from "react";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { HowItWorks } from "@/components/HowItWorks";
import { formatAgo } from "@/lib/institution/analytics";
import type { SupportThread } from "@/lib/institution/types";

interface Notice { id: string; title: string; body: string; createdAt: number; createdBy: string; read: boolean }

export default function OneGraspPage() {
  const { me, refreshUnread } = usePortal();
  const { data, error, reload } = useApi<{ notices: Notice[]; threads: SupportThread[] }>("/api/institution/support");
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // Seeing the notices marks them read.
  useEffect(() => {
    const ids = (data?.notices ?? []).filter((n) => !n.read).map((n) => n.id);
    if (ids.length) void send("/api/institution/support", "POST", { seenNotices: ids }).then(() => refreshUnread()).catch(() => undefined);
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(t: SupportThread) {
    setOpen(open === t.id ? null : t.id); setDraft(""); setMsg("");
    if (t.unreadForSchool) void send("/api/institution/support", "POST", { seenThread: t.id }).then(() => { void reload(); void refreshUnread(); }).catch(() => undefined);
  }
  async function start(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg("");
    try { await send("/api/institution/support", "POST", { subject, text }); setSubject(""); setText(""); setMsg("Sent to OneGrasp - you'll see the answer here, with a badge on 'Ask OneGrasp' in the menu."); await reload(); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Could not send."); }
    finally { setBusy(false); }
  }
  async function add(t: SupportThread) {
    if (!draft.trim()) return;
    setBusy(true); setMsg("");
    try { await send("/api/institution/support", "POST", { threadId: t.id, text: draft }); setDraft(""); await reload(); }
    catch (err) { setMsg(err instanceof Error ? err.message : "Could not send."); }
    finally { setBusy(false); }
  }

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Ask OneGrasp</h1>
          <p className="ip-sub">News and notices from OneGrasp, and your direct line to the OneGrasp team - ask a question, report a problem or request a feature.</p>
        </div>
      </div>
      <HowItWorks id="portal-onegrasp" steps={[
        "Notices from OneGrasp (new features, exam-season reminders, maintenance) appear at the top - new ones are marked.",
        "To ask something, write a subject and your message under 'Contact OneGrasp' and press Send.",
        "OneGrasp answers from its admin dashboard. The answer shows in the conversation, and 'Ask OneGrasp' in the menu gets a red badge.",
        "Add to a conversation any time - it reopens automatically if it was closed.",
      ]} sync={`Only ${me.institution.name}'s logins and the OneGrasp team see these conversations.`} />
      {error && <div className="ip-alert bad">{error}</div>}
      {msg && <div className="ip-alert good">{msg}</div>}

      <Section title="Notices from OneGrasp" icon="bell" aside={data ? `${data.notices.length}` : ""} style={{ marginBottom: 12 }}>
        {!data ? <div className="ip-muted">Loading…</div> : data.notices.length === 0 ? <div className="ip-muted">No notices yet.</div> : data.notices.map((n) => (
          <div key={n.id} className="ip-rec">
            <span className="ip-rec-dot" style={{ background: n.read ? "var(--line)" : "var(--brand)" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800 }}>{n.title} {!n.read && <span className="ip-pill bad plain" style={{ marginLeft: 6 }}>New</span>}</div>
              <div style={{ whiteSpace: "pre-line", lineHeight: 1.6, marginTop: 4 }}>{n.body}</div>
              <div className="ip-muted" style={{ fontSize: 12, marginTop: 4 }}>{formatAgo(n.createdAt)}</div>
            </div>
          </div>
        ))}
      </Section>

      <div className="ip-grid2" style={{ marginTop: 0 }}>
        <Section title="Your conversations" icon="answer" aside={data ? `${data.threads.length}` : ""}>
          {!data ? <div className="ip-muted">Loading…</div> : data.threads.length === 0 ? <div className="ip-muted">No conversations yet - start one on the right.</div> : data.threads.map((t) => (
            <div key={t.id} style={{ borderTop: "1px solid var(--line)" }}>
              <button onClick={() => toggle(t)} style={{ all: "unset", cursor: "pointer", display: "flex", gap: 10, alignItems: "center", width: "100%", padding: "11px 0" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800 }}>{t.subject}</div>
                  <div className="ip-muted" style={{ fontSize: 12 }}>{t.messages.length} message{t.messages.length === 1 ? "" : "s"} · {formatAgo(t.updatedAt)}</div>
                </div>
                <span className={`ip-pill ${t.status === "open" ? "warn" : "muted"}`}>{t.status === "open" ? "Open" : "Closed"}</span>
                {t.unreadForSchool && <span className="ip-badge">New</span>}
              </button>
              {open === t.id && (
                <div style={{ paddingBottom: 14 }}>
                  <div style={{ display: "grid", gap: 8 }}>
                    {t.messages.map((m, i) => (
                      <div key={i} style={{ justifySelf: m.from === "school" ? "end" : "start", maxWidth: "85%", background: m.from === "school" ? "var(--accentTint)" : "var(--line2)", borderRadius: 12, padding: "9px 12px", lineHeight: 1.5, whiteSpace: "pre-line" }}>
                        {m.text}
                        <div className="ip-muted" style={{ fontSize: 11 }}>{m.from === "onegrasp" ? `OneGrasp · ${m.name}` : m.name} · {formatAgo(m.at)}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <textarea className="ip-input" rows={2} maxLength={2000} placeholder="Add a message…" value={draft} onChange={(e) => setDraft(e.target.value)} />
                    <button className="ip-btn" disabled={busy || !draft.trim()} onClick={() => void add(t)}>Send</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </Section>
        <Section title="Contact OneGrasp" icon="help">
          <form onSubmit={start}>
            <label className="ip-label" htmlFor="og-subj">Subject</label>
            <input id="og-subj" className="ip-input" required maxLength={120} placeholder="e.g. Add our Class 9 section, Report not opening" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <label className="ip-label" htmlFor="og-text" style={{ marginTop: 10 }}>Message</label>
            <textarea id="og-text" className="ip-input" required rows={5} maxLength={2000} placeholder="Tell us what you need - include a student's name if it's about one student." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="ip-btn" style={{ marginTop: 12, width: "100%" }} disabled={busy}>{busy ? "Sending…" : "Send to OneGrasp"}</button>
          </form>
        </Section>
      </div>
    </>
  );
}
