"use client";

/**
 * /admin/messages - OneGrasp's message centre, the admin end of every
 * conversation:
 *   - Support inbox: institutions' questions from their portal ("OneGrasp
 *     support"); answers appear there with a badge
 *   - Student replies: students answering a message OneGrasp sent them
 *   - Message students: straight to students' dashboard inboxes, "from
 *     OneGrasp" - everyone, chosen institutions and/or classes
 *   - Notice to schools: a notice on institution portals
 *   - History: what was sent, opened and clicked
 *
 * Everything goes through /api/admin/messages. Auth is handled by the parent
 * app/admin/layout.tsx.
 */
import { useEffect, useMemo, useState } from "react";
import { C } from "@/app/account/viz";
import { Icon } from "@/app/Icons";
import { apiFetch } from "@/lib/institution/client";
import { HowItWorks } from "@/components/HowItWorks";
import { CATEGORY_OPTIONS, categoryLabel } from "@/lib/auth/formOptions";
import type { MessageKind, MessageReply, PortalNotice, SupportThread } from "@/lib/institution/types";

interface Sent { id: string; kind: MessageKind; title: string; body: string; link?: string; audience: { label: string }; createdAt: number; recipientCount: number; readCount: number; clickCount: number; emailed?: number }
interface Data { sent: Sent[]; notices: PortalNotice[]; threads: SupportThread[]; replies: MessageReply[]; institutions: { id: string; name: string }[] }
type Tab = "support" | "replies" | "students" | "notice" | "history";

const CLASSES = CATEGORY_OPTIONS.filter((c) => c.value !== "class_11_12");
const fmt = (t: number) => new Date(t).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

export default function AdminMessagesPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [tab, setTab] = useState<Tab>("support");

  async function load() {
    try { setData(await apiFetch<Data>("/api/admin/messages")); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load messages."); }
  }
  useEffect(() => { void load(); }, []);
  async function post(body: Record<string, unknown>, okMsg?: string): Promise<boolean> {
    setError("");
    try {
      const r = await apiFetch<{ recipients?: number; emailed?: number }>("/api/admin/messages", { method: "POST", body: JSON.stringify(body) });
      await load();
      if (okMsg) flash(r.recipients != null ? `${okMsg} - ${r.recipients} student${r.recipients === 1 ? "" : "s"}${r.emailed ? `, ${r.emailed} emailed` : ""}.` : okMsg);
      return true;
    } catch (e) { setError(e instanceof Error ? e.message : "That didn't work."); return false; }
  }
  function flash(m: string) { setOk(m); setTimeout(() => setOk((x) => (x === m ? "" : x)), 4000); }

  const unreadSupport = data?.threads.filter((t) => t.unreadForAdmin).length ?? 0;
  const unreadReplies = data?.replies.filter((r) => r.from === "student" && !r.seenBySchool).length ?? 0;
  const TABS: [Tab, string, number][] = [["support", "Support inbox", unreadSupport], ["replies", "Student replies", unreadReplies], ["students", "Message students", 0], ["notice", "Notice to schools", 0], ["history", "History", 0]];

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 6px" }}>Messages</h1>
      <p style={{ fontSize: 14, color: C.ink3, margin: "0 0 16px", lineHeight: 1.55 }}>
        OneGrasp&apos;s side of every conversation: answer schools&apos; support questions and students&apos; replies, message students directly, and post notices on school portals.
      </p>
      <HowItWorks id="admin-messages" accent="#E23B41" steps={[
        "Support inbox: questions schools send from 'Ask OneGrasp' in their portal. Open one, answer, and optionally close it - the school sees your answer with a badge.",
        "Student replies: students who answered a message OneGrasp sent them. Your answer appears under that message in their dashboard as 'New reply'.",
        "Message students: pick institutions and/or classes (none = every student), write the message - {name} becomes each student's first name - and send. It lands in their dashboard inbox labelled OneGrasp.",
        "Notice to schools: posts a notice on the chosen institutions' portals (none = all). History shows what was sent and how many opened it.",
      ]} sync="Schools see notices and your answers on their portal; students see your messages and answers on their dashboard. To see a school's portal as they do, use 'Open portal' on Institution Logins." />

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {TABS.map(([k, label, n]) => (
          <button key={k} onClick={() => setTab(k)} style={{ ...S.tab, ...(tab === k ? S.tabOn : {}) }}>
            {label}{n > 0 && <span style={S.badge}>{n}</span>}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <button style={S.ghostSm} onClick={() => void load()}>Refresh</button>
      </div>

      {error && <div style={S.error}><Icon name="xcircle" size={16} /> {error}</div>}
      {ok && <div style={S.ok}><Icon name="check" size={16} /> {ok}</div>}
      {!data ? <div style={S.empty}>{error ? "" : "Loading…"}</div> : (
        <>
          {tab === "support" && <SupportInbox threads={data.threads} post={post} />}
          {tab === "replies" && <StudentReplies replies={data.replies} post={post} />}
          {tab === "students" && <SendToStudents institutions={data.institutions} post={post} />}
          {tab === "notice" && <SendNotice institutions={data.institutions} post={post} />}
          {tab === "history" && <History data={data} />}
        </>
      )}
    </div>
  );
}

type Post = (body: Record<string, unknown>, okMsg?: string) => Promise<boolean>;

function SupportInbox({ threads, post }: { threads: SupportThread[]; post: Post }) {
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  if (!threads.length) return <div style={S.empty}>No support conversations yet. Schools start one from &ldquo;Ask OneGrasp&rdquo; in their portal.</div>;
  const reply = async (t: SupportThread, close: boolean) => {
    setBusy(true);
    if (await post({ kind: "support-reply", threadId: t.id, text: draft, close }, close ? (draft.trim() ? "Answered and closed" : "Closed") : "Answer sent")) setDraft("");
    setBusy(false);
  };
  return (
    <section style={{ ...S.card, padding: 0 }}>
      {threads.map((t) => (
        <div key={t.id} style={{ borderTop: `1px solid ${C.line}` }}>
          <button style={S.row} onClick={() => { setOpen(open === t.id ? null : t.id); setDraft(""); if (t.unreadForAdmin) void post({ kind: "seen", threadId: t.id }); }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: C.ink }}>{t.subject}</div>
              <div style={{ fontSize: 12.5, color: C.ink3 }}>{t.institutionName} · {t.messages.length} message{t.messages.length === 1 ? "" : "s"} · {fmt(t.updatedAt)}</div>
            </div>
            <span style={{ ...S.pill, ...(t.status === "open" ? { background: "#fdf3e2", color: "#9a6700" } : { background: C.line2, color: C.muted }) }}>{t.status === "open" ? "Open" : "Closed"}</span>
            {t.unreadForAdmin && <span style={S.badge}>New</span>}
          </button>
          {open === t.id && (
            <div style={{ padding: "0 18px 16px" }}>
              <Bubbles items={t.messages.map((m) => ({ mine: m.from === "onegrasp", text: m.text, meta: `${m.from === "onegrasp" ? "OneGrasp" : `${m.name} (${t.institutionName})`} · ${fmt(m.at)}` }))} />
              <textarea style={{ ...S.input, minHeight: 70, marginTop: 12, fontFamily: "inherit" }} maxLength={2000} placeholder={`Answer ${t.institutionName}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                <button style={S.btn} disabled={busy || !draft.trim()} onClick={() => void reply(t, false)}>Send answer</button>
                <button style={S.ghostSm} disabled={busy} onClick={() => void reply(t, true)}>{draft.trim() ? "Send and close" : "Close conversation"}</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function StudentReplies({ replies, post }: { replies: MessageReply[]; post: Post }) {
  const [open, setOpen] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const threads = useMemo(() => {
    const m = new Map<string, MessageReply[]>();
    for (const r of [...replies].sort((a, b) => a.createdAt - b.createdAt)) { const k = `${r.messageId}|${r.studentUid}`; m.set(k, [...(m.get(k) ?? []), r]); }
    return [...m.entries()].map(([k, rs]) => ({ k, rs, unread: rs.filter((r) => r.from === "student" && !r.seenBySchool).map((r) => r.id), last: rs[rs.length - 1] }))
      .sort((a, b) => (b.unread.length ? 1 : 0) - (a.unread.length ? 1 : 0) || b.last.createdAt - a.last.createdAt);
  }, [replies]);
  if (!threads.length) return <div style={S.empty}>No student replies yet. Students can reply to any message OneGrasp sends them.</div>;
  return (
    <section style={{ ...S.card, padding: 0 }}>
      {threads.map(({ k, rs, unread, last }) => (
        <div key={k} style={{ borderTop: `1px solid ${C.line}` }}>
          <button style={S.row} onClick={() => { setOpen(open === k ? null : k); setDraft(""); if (unread.length) void post({ kind: "seen", replyIds: unread }); }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: C.ink }}>{rs[0].studentName} <span style={{ fontWeight: 600, color: C.ink3 }}>on &ldquo;{rs[0].messageTitle}&rdquo;</span></div>
              <div style={{ fontSize: 12.5, color: C.ink3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{last.from === "school" ? "OneGrasp: " : ""}{last.text}</div>
            </div>
            <span style={{ fontSize: 12, color: C.muted, whiteSpace: "nowrap" }}>{fmt(last.createdAt)}</span>
            {unread.length > 0 && <span style={S.badge}>{unread.length}</span>}
          </button>
          {open === k && (
            <div style={{ padding: "0 18px 16px" }}>
              <Bubbles items={rs.map((r) => ({ mine: r.from === "school", text: r.text, meta: `${r.from === "school" ? "OneGrasp" : r.studentName} · ${fmt(r.createdAt)}` }))} />
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <textarea style={{ ...S.input, minHeight: 44, fontFamily: "inherit" }} maxLength={1000} placeholder={`Answer ${rs[0].studentName}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
                <button style={S.btn} disabled={busy || !draft.trim()} onClick={async () => { setBusy(true); if (await post({ kind: "student-reply", messageId: rs[0].messageId, studentUid: rs[0].studentUid, text: draft }, "Answer sent")) setDraft(""); setBusy(false); }}>Send</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

function Bubbles({ items }: { items: { mine: boolean; text: string; meta: string }[] }) {
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {items.map((m, i) => (
        <div key={i} style={{ justifySelf: m.mine ? "end" : "start", maxWidth: "82%", background: m.mine ? C.redTint : C.line2, color: C.ink, borderRadius: 12, padding: "9px 12px", fontSize: 13.5, lineHeight: 1.5, whiteSpace: "pre-line" }}>
          {m.text}
          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{m.meta}</div>
        </div>
      ))}
    </div>
  );
}

function Chips({ options, picked, onToggle }: { options: { id: string; label: string }[]; picked: string[]; onToggle: (id: string) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {options.map((o) => {
        const on = picked.includes(o.id);
        return <button key={o.id} type="button" onClick={() => onToggle(o.id)} style={{ ...S.chip, ...(on ? { background: C.redTint, border: `1px solid ${C.red}`, color: C.redStrong } : {}) }}>{on ? "✓ " : ""}{o.label}</button>;
      })}
    </div>
  );
}

const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

function SendToStudents({ institutions, post }: { institutions: Data["institutions"]; post: Post }) {
  const [f, setF] = useState({ msgKind: "message" as MessageKind, title: "", body: "", link: "", email: false });
  const [insts, setInsts] = useState<string[]>([]);
  const [classes, setClasses] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const audience = [insts.length ? institutions.filter((i) => insts.includes(i.id)).map((i) => i.name).join(", ") : "every student on OneGrasp", classes.length ? `in ${classes.map(categoryLabel).join(", ")}` : ""].filter(Boolean).join(" ");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (await post({ kind: "students", ...f, institutionIds: insts, classes }, "Sent")) setF({ ...f, title: "", body: "", link: "" });
    setBusy(false);
  }
  return (
    <form style={S.card} onSubmit={submit}>
      <label style={S.label}>Institutions <span style={{ fontWeight: 600, color: C.muted }}>(none picked = all students, including those not linked to a school)</span></label>
      {institutions.length ? <Chips options={institutions.map((i) => ({ id: i.id, label: i.name }))} picked={insts} onToggle={(id) => setInsts((p) => toggle(p, id))} /> : <div style={S.hint}>No institutions yet.</div>}
      <label style={{ ...S.label, marginTop: 14 }}>Classes <span style={{ fontWeight: 600, color: C.muted }}>(none picked = every class)</span></label>
      <Chips options={CLASSES.map((c) => ({ id: c.value, label: c.label }))} picked={classes} onToggle={(id) => setClasses((p) => toggle(p, id))} />
      <div style={{ ...S.grid2, marginTop: 14 }} className="og-inst-grid">
        <div>
          <label style={S.label}>Type</label>
          <select style={S.input} value={f.msgKind} onChange={(e) => setF({ ...f, msgKind: e.target.value as MessageKind })}>
            <option value="message">Message</option><option value="reminder">Reminder</option><option value="alert">Alert</option><option value="recommendation">Recommendation</option>
          </select>
        </div>
        <div>
          <label style={S.label}>Button link in the app (optional)</label>
          <input style={S.input} placeholder="/account/gps" value={f.link} onChange={(e) => setF({ ...f, link: e.target.value })} />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={S.label}>Title</label>
          <input style={S.input} required maxLength={120} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. New: test-drive a career before you choose it" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={S.label}>Message</label>
          <textarea style={{ ...S.input, minHeight: 110, fontFamily: "inherit" }} required maxLength={2000} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} placeholder="Hi {name}, …" />
          <div style={S.hint}>{"{name}"} is replaced with each student&apos;s first name.</div>
        </div>
      </div>
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12, fontSize: 13.5, color: C.ink2 }}>
        <input type="checkbox" checked={f.email} onChange={(e) => setF({ ...f, email: e.target.checked })} /> Also email it (up to 500 students)
      </label>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
        <button style={S.btn} disabled={busy}>{busy ? "Sending…" : "Send to students"}</button>
        <span style={{ fontSize: 12.5, color: C.ink3 }}>Goes to {audience}.</span>
      </div>
    </form>
  );
}

function SendNotice({ institutions, post }: { institutions: Data["institutions"]; post: Post }) {
  const [f, setF] = useState({ title: "", body: "" });
  const [insts, setInsts] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (await post({ kind: "notice", ...f, institutionIds: insts }, "Notice posted")) setF({ title: "", body: "" });
    setBusy(false);
  }
  return (
    <form style={S.card} onSubmit={submit}>
      <label style={S.label}>Institutions <span style={{ fontWeight: 600, color: C.muted }}>(none picked = every institution, including future ones)</span></label>
      {institutions.length ? <Chips options={institutions.map((i) => ({ id: i.id, label: i.name }))} picked={insts} onToggle={(id) => setInsts((p) => toggle(p, id))} /> : <div style={S.hint}>No institutions yet.</div>}
      <label style={{ ...S.label, marginTop: 14 }}>Title</label>
      <input style={S.input} required maxLength={120} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. New in your portal: Career journeys" />
      <label style={{ ...S.label, marginTop: 12 }}>Notice</label>
      <textarea style={{ ...S.input, minHeight: 110, fontFamily: "inherit" }} required maxLength={2000} value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
      <button style={{ ...S.btn, marginTop: 14 }} disabled={busy}>{busy ? "Posting…" : `Post to ${insts.length ? `${insts.length} institution${insts.length === 1 ? "" : "s"}` : "all institutions"}`}</button>
    </form>
  );
}

function History({ data }: { data: Data }) {
  const name = new Map(data.institutions.map((i) => [i.id, i.name]));
  return (
    <>
      <section style={{ ...S.card, padding: 0, overflowX: "auto" }}>
        <div style={{ padding: "14px 18px", fontWeight: 800, color: C.ink }}>Sent to students ({data.sent.length})</div>
        {data.sent.length === 0 ? <div style={{ padding: "0 18px 16px", color: C.muted, fontSize: 13.5 }}>Nothing sent yet.</div> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ background: C.line2 }}>{["Title", "To", "Sent", "Opened", "Clicked"].map((h) => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>{data.sent.map((m) => (
              <tr key={m.id} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={S.td}><b>{m.title}</b><div style={{ fontSize: 11.5, color: C.muted, textTransform: "capitalize" }}>{m.kind}{m.emailed ? ` · ${m.emailed} emailed` : ""}</div></td>
                <td style={S.td}>{m.audience.label}<div style={{ fontSize: 11.5, color: C.muted }}>{m.recipientCount} students</div></td>
                <td style={{ ...S.td, whiteSpace: "nowrap" }}>{fmt(m.createdAt)}</td>
                <td style={S.td}>{m.readCount}/{m.recipientCount}</td>
                <td style={S.td}>{m.link ? m.clickCount : "-"}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </section>
      <section style={S.card}>
        <div style={{ fontWeight: 800, color: C.ink, marginBottom: 8 }}>Notices to schools ({data.notices.length})</div>
        {data.notices.length === 0 ? <div style={{ color: C.muted, fontSize: 13.5 }}>No notices yet.</div> : data.notices.map((n) => {
          const targets = n.institutionIds.includes("all") ? data.institutions.map((i) => i.id) : n.institutionIds;
          const read = targets.filter((id) => n.readBy?.[id]).length;
          return (
            <div key={n.id} style={{ borderTop: `1px solid ${C.line}`, padding: "10px 0" }}>
              <b style={{ color: C.ink }}>{n.title}</b>
              <div style={{ fontSize: 12.5, color: C.ink3 }}>{n.institutionIds.includes("all") ? "All institutions" : n.institutionIds.map((id) => name.get(id) ?? id).join(", ")} · {fmt(n.createdAt)} · read by {read}/{targets.length}</div>
            </div>
          );
        })}
      </section>
    </>
  );
}

const S: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 18 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: C.ink3, marginBottom: 6 },
  hint: { fontSize: 12, color: C.muted, marginTop: 5 },
  input: { width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 12px", fontSize: 14, color: C.ink, background: "#fff" },
  btn: { background: C.red, color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  ghostSm: { background: "#fff", border: `1px solid ${C.line}`, color: C.ink2, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  tab: { display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${C.line}`, color: C.ink2, borderRadius: 999, padding: "7px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  tabOn: { background: C.ink, color: "#fff", borderColor: C.ink },
  badge: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 999, background: C.red, color: "#fff", fontSize: 11, fontWeight: 800 },
  row: { all: "unset", boxSizing: "border-box", cursor: "pointer", display: "flex", gap: 12, alignItems: "center", width: "100%", padding: "13px 18px" },
  chip: { background: "#fff", border: `1px dashed ${C.faint}`, borderRadius: 999, padding: "5px 11px", fontSize: 12.5, color: C.ink2, cursor: "pointer", fontWeight: 600 },
  pill: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  th: { textAlign: "left", padding: "9px 14px", fontSize: 11, fontWeight: 800, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em" },
  td: { padding: "10px 14px", color: C.ink2, verticalAlign: "top" },
  error: { display: "flex", alignItems: "center", gap: 8, background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, fontWeight: 600 },
  ok: { display: "flex", alignItems: "center", gap: 8, background: C.goodTint, border: "1px solid #bbf7d0", color: C.good, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, fontWeight: 600 },
  empty: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 28, textAlign: "center", color: C.muted, fontSize: 14 },
};
