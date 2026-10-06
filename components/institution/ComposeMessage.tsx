"use client";

/**
 * Write a message, reminder, alert or recommendation to students. Opened
 * with an audience already chosen (everyone, some classes, a segment such as
 * "haven't taken the assessment", picked rows, or one student) and often a
 * suggested text the sender can edit. The server resolves the recipients
 * from the institution's own students, so nothing can reach anyone else.
 */
import { useEffect, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { apiFetch } from "@/lib/institution/client";
import { categoryLabel } from "@/lib/auth/formOptions";
import type { MessageKind } from "@/lib/institution/types";
import { usePortal } from "@/components/institution/portalStore";

export interface ComposePreset {
  audience: { type: "all" } | { type: "classes"; classes: string[] } | { type: "students"; uids: string[]; label: string };
  kind?: MessageKind;
  title?: string;
  body?: string;
  link?: string;
}

const KINDS: { key: MessageKind; label: string; hint: string }[] = [
  { key: "message", label: "Message", hint: "General information" },
  { key: "reminder", label: "Reminder", hint: "Something they should do" },
  { key: "alert", label: "Alert", hint: "Urgent - shown first, in red" },
  { key: "recommendation", label: "Recommendation", hint: "A suggested next step" },
];

export const LINKS: { href: string; label: string }[] = [
  { href: "", label: "No link" },
  { href: "/account", label: "Dashboard & report" },
  { href: "/?begin=1", label: "Career assessment" },
  { href: "/account/career-library", label: "Career library" },
  { href: "/account/exams", label: "Entrance exams" },
  { href: "/account/scholarships", label: "Scholarships" },
  { href: "/account/study-abroad", label: "Study abroad" },
  { href: "/account/internships-new", label: "Internships" },
  { href: "/account/money", label: "Money skills" },
  { href: "/account/legal", label: "Legal rights" },
  { href: "/account/research", label: "Research" },
  { href: "/account/startups", label: "Startups" },
];

export function ComposeMessage({ preset, onClose, onSent }: { preset: ComposePreset | null; onClose: () => void; onSent?: (n: number) => void }) {
  const { students } = usePortal();
  const [kind, setKind] = useState<MessageKind>("message");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [email, setEmail] = useState(false);
  const [mode, setMode] = useState<"all" | "classes" | "students">("all");
  const [classes, setClasses] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<null | { recipients: number; emailed: number; emailRequested: boolean }>(null);

  useEffect(() => {
    if (!preset) return;
    setKind(preset.kind ?? "message");
    setTitle(preset.title ?? "");
    setBody(preset.body ?? "");
    setLink(preset.link ?? "");
    setEmail(false);
    setMode(preset.audience.type);
    setClasses(preset.audience.type === "classes" ? preset.audience.classes : []);
    setError("");
    setDone(null);
  }, [preset]);

  const classOptions = useMemo(() => {
    const m = new Map<string, number>();
    for (const s of students ?? []) if (!s.archived && s.category) m.set(s.category, (m.get(s.category) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [students]);

  const active = (students ?? []).filter((s) => !s.archived);
  const count = !preset ? 0
    : mode === "students" && preset.audience.type === "students" ? preset.audience.uids.length
    : mode === "classes" ? active.filter((s) => classes.includes(s.category)).length
    : active.length;
  const fixedStudents = preset?.audience.type === "students";

  async function send() {
    if (!preset) return;
    setError("");
    setBusy(true);
    try {
      const audience = fixedStudents && preset.audience.type === "students"
        ? { type: "students", uids: preset.audience.uids, label: preset.audience.label }
        : mode === "classes" ? { type: "classes", classes } : { type: "all" };
      const res = await apiFetch<{ recipients: number; emailed: number; emailRequested: boolean }>("/api/institution/messages", {
        method: "POST",
        body: JSON.stringify({ kind, title, body, link: link || undefined, audience, email }),
      });
      setDone(res);
      onSent?.(res.recipients);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!preset} onClose={onClose} label="Send a message" width={640}
      footer={done ? <><span className="ip-muted">Students see it in &quot;Messages from your school&quot; on their dashboard.</span><button className="ip-btn" onClick={onClose}>Done</button></> : (
        <>
          <span className="ip-muted">{count} student{count === 1 ? "" : "s"} will receive this.</span>
          <button className="ip-btn" disabled={busy || !title.trim() || !body.trim() || count === 0} onClick={() => void send()}>{busy ? "Sending…" : "Send"}</button>
        </>
      )}>
      <div style={{ padding: "20px 22px 18px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: 19 }}>Send to students</h2>
        {done ? (
          <div className="ip-alert good" style={{ marginTop: 14 }}>
            Sent to {done.recipients} student{done.recipients === 1 ? "" : "s"}.
            {done.emailRequested && (done.emailed ? ` ${done.emailed} also emailed.` : " Email isn't configured on this deployment, so it went to their in-app inbox only.")}
          </div>
        ) : (
          <>
            <p className="ip-muted" style={{ margin: "0 0 14px" }}>It appears in their in-app inbox; tick &quot;Also email&quot; to send it to their email address too.</p>
            {error && <div className="ip-alert bad">{error}</div>}

            <label className="ip-label">To</label>
            {fixedStudents && preset?.audience.type === "students" ? (
              <div className="ip-pill muted plain" style={{ marginBottom: 14 }}>{preset.audience.label}</div>
            ) : (
              <div style={{ marginBottom: 14 }}>
                <div className="ip-tabs">
                  <button type="button" className={`ip-tab${mode === "all" ? " on" : ""}`} onClick={() => setMode("all")}>All students ({active.length})</button>
                  <button type="button" className={`ip-tab${mode === "classes" ? " on" : ""}`} onClick={() => setMode("classes")}>Choose classes</button>
                </div>
                {mode === "classes" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                    {classOptions.map(([c, n]) => (
                      <label key={c} className="ip-tab" style={{ display: "inline-flex", alignItems: "center", gap: 6, ...(classes.includes(c) ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}) }}>
                        <input type="checkbox" checked={classes.includes(c)} onChange={(e) => setClasses((cs) => e.target.checked ? [...cs, c] : cs.filter((x) => x !== c))} />
                        {categoryLabel(c)} ({n})
                      </label>
                    ))}
                    {classOptions.length === 0 && <span className="ip-muted">No students yet.</span>}
                  </div>
                )}
              </div>
            )}

            <label className="ip-label">Type</label>
            <div className="ip-tabs" style={{ marginBottom: 14 }}>
              {KINDS.map((k) => (
                <button type="button" key={k.key} title={k.hint} className={`ip-tab${kind === k.key ? " on" : ""}`} onClick={() => setKind(k.key)}>{k.label}</button>
              ))}
            </div>

            <label className="ip-label" htmlFor="cm-title">Title</label>
            <input id="cm-title" className="ip-input" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Career assessment this week" />
            <label className="ip-label" htmlFor="cm-body" style={{ marginTop: 12 }}>Message</label>
            <textarea id="cm-body" className="ip-input" rows={6} maxLength={2000} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write to your students…" style={{ resize: "vertical" }} />
            <div className="ip-muted" style={{ fontSize: 12, marginTop: 4 }}>Type <code>{"{name}"}</code> to greet each student by their first name.</div>

            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 12, alignItems: "end", marginTop: 12 }}>
              <div>
                <label className="ip-label" htmlFor="cm-link">Button takes them to</label>
                <select id="cm-link" className="ip-select" style={{ width: "100%" }} value={link} onChange={(e) => setLink(e.target.value)}>
                  {(link && !LINKS.some((l) => l.href === link) ? [{ href: link, label: `Suggested page (${link})` }, ...LINKS] : LINKS).map((l) => <option key={l.href} value={l.href}>{l.label}</option>)}
                </select>
              </div>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 600, color: "var(--ink2)", paddingBottom: 9 }}>
                <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} /> Also email
              </label>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
}
