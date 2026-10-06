"use client";

/**
 * "Messages from your school" - what the student's institution sent from the
 * institution portal (messages, reminders, alerts, recommendations). Renders
 * nothing when there are none, so students without an institution see no
 * change. A message is marked read when the student opens it or follows its
 * button; the institution sees who has opened what.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/institution/client";
import type { MessageKind, StudentInboxMessage } from "@/lib/institution/types";

const KIND: Record<MessageKind, { label: string; color: string; bg: string }> = {
  alert: { label: "Alert", color: "#c62828", bg: "#fdecec" },
  reminder: { label: "Reminder", color: "#9a6700", bg: "#fdf3e2" },
  recommendation: { label: "Recommended", color: "#1f7a55", bg: "#eaf6f0" },
  message: { label: "Message", color: "#3d4fb8", bg: "#eef0fc" },
};

const CSS = `
.si{background:#fff;border:1px solid #ececef;border-radius:16px;padding:16px 18px;margin-bottom:16px;font-family:inherit}
.si-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.si-h b{font-size:15px;color:#141417}
.si-n{background:#E23B41;color:#fff;border-radius:999px;font-size:11px;font-weight:800;padding:2px 8px}
.si-h button{margin-left:auto;background:none;border:none;color:#63636f;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer}
.si-m{border-top:1px solid #f0f0f3;padding:11px 0}
.si-m:first-of-type{border-top:none;padding-top:2px}
.si-row{display:flex;align-items:flex-start;gap:10px;width:100%;background:none;border:none;padding:0;text-align:left;font:inherit;cursor:pointer;color:inherit}
.si-dot{width:8px;height:8px;border-radius:50%;background:#E23B41;margin-top:7px;flex:none}
.si-dot.read{background:transparent}
.si-k{font-size:10.5px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;border-radius:6px;padding:2px 7px;flex:none;margin-top:1px}
.si-t{font-weight:700;font-size:14px;color:#141417;line-height:1.35}
.si-meta{font-size:11.5px;color:#9a9aa6;margin-top:2px}
.si-body{margin:8px 0 0 18px;font-size:13.5px;color:#3d3d45;line-height:1.6;white-space:pre-line}
.si-go{display:inline-block;margin:10px 0 0 18px;background:#E23B41;color:#fff;font-family:inherit;font-weight:700;font-size:13px;border-radius:9px;padding:8px 14px;text-decoration:none}
.si-go + .si-go{margin-left:8px}
.si-more{background:none;border:none;color:#E23B41;font:inherit;font-weight:700;font-size:13px;cursor:pointer;padding:6px 0 0}
`;

function when(t: number): string {
  const d = Math.floor((Date.now() - t) / 86400000);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export function SchoolInbox() {
  const [msgs, setMsgs] = useState<StudentInboxMessage[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [all, setAll] = useState(false);

  useEffect(() => {
    apiFetch<{ messages: StudentInboxMessage[] }>("/api/student/messages")
      .then((r) => {
        setMsgs(r.messages);
        const firstUnread = r.messages.find((m) => !m.read);
        if (firstUnread) setOpen(firstUnread.id);
      })
      .catch(() => setMsgs([])); // no institution messages, or the server can't serve them: show nothing
  }, []);

  function markRead(ids: string[]) {
    const unread = ids.filter((id) => msgs?.some((m) => m.id === id && !m.read));
    if (!unread.length) return;
    setMsgs((ms) => (ms ?? []).map((m) => (unread.includes(m.id) ? { ...m, read: true } : m)));
    apiFetch("/api/student/messages", { method: "POST", body: JSON.stringify({ ids: unread }) }).catch(() => undefined);
  }

  // Following a message's button tells the school it was acted on.
  function clicked(id: string) {
    markRead([id]);
    apiFetch("/api/student/messages", { method: "POST", body: JSON.stringify({ clicked: id }) }).catch(() => undefined);
  }
  function applied(id: string) {
    setMsgs((ms) => (ms ?? []).map((m) => (m.id === id ? { ...m, applied: true } : m)));
    apiFetch("/api/student/messages", { method: "POST", body: JSON.stringify({ applied: id }) }).catch(() => undefined);
  }

  // The message open on arrival counts as read once it has been on screen a moment.
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => markRead([open]), 2500);
    return () => clearTimeout(t);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!msgs || msgs.length === 0) return null;
  const unread = msgs.filter((m) => !m.read).length;
  // Alerts first among the unread, then newest.
  const ordered = [...msgs].sort((a, b) => Number(a.read) - Number(b.read) || Number(b.kind === "alert") - Number(a.kind === "alert") || b.createdAt - a.createdAt);
  const shown = all ? ordered : ordered.slice(0, 3);

  return (
    <section className="si" aria-label="Messages from your school">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="si-h">
        <b>Messages from {msgs[0].from}</b>
        {unread > 0 && <span className="si-n">{unread} new</span>}
        {unread > 0 && <button onClick={() => markRead(msgs.map((m) => m.id))}>Mark all read</button>}
      </div>
      {shown.map((m) => {
        const k = KIND[m.kind];
        const isOpen = open === m.id;
        return (
          <div className="si-m" key={m.id}>
            <button className="si-row" aria-expanded={isOpen} onClick={() => { setOpen(isOpen ? null : m.id); markRead([m.id]); }}>
              <span className={`si-dot${m.read ? " read" : ""}`} aria-label={m.read ? undefined : "Unread"} />
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="si-t">{m.title}</span>
                <div className="si-meta">{when(m.createdAt)}</div>
              </span>
              <span className="si-k" style={{ color: k.color, background: k.bg }}>{k.label}</span>
            </button>
            {isOpen && (
              <>
                <div className="si-body">{m.body}</div>
                {m.externalUrl
                  ? <a className="si-go" href={m.externalUrl} target="_blank" rel="noreferrer" onClick={() => clicked(m.id)}>Open ↗</a>
                  : m.link && <Link className="si-go" href={m.link} onClick={() => clicked(m.id)}>Open →</Link>}
                {m.opportunityId && (
                  m.applied
                    ? <span className="si-go" style={{ background: "#eaf6f0", color: "#1f7a55" }}>Applied ✓</span>
                    : <button type="button" className="si-go" style={{ border: "none", cursor: "pointer", background: "#141417" }} onClick={() => applied(m.id)}>I applied</button>
                )}
              </>
            )}
          </div>
        );
      })}
      {msgs.length > 3 && <button className="si-more" onClick={() => setAll((v) => !v)}>{all ? "Show fewer" : `Show all ${msgs.length} messages`}</button>}
    </section>
  );
}
