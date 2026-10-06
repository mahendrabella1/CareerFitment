"use client";

/** /institution/messages - write to students, and see what was sent and who opened it. */
import { useEffect, useState } from "react";
import { Icon } from "@/app/Icons";
import { apiFetch } from "@/lib/institution/client";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { formatAgo } from "@/lib/institution/analytics";
import type { InstitutionMessage, MessageKind } from "@/lib/institution/types";

type SentRow = Omit<InstitutionMessage, "recipients" | "readBy"> & { recipientCount: number; readCount: number };

const KIND_LABEL: Record<MessageKind, string> = { message: "Message", reminder: "Reminder", alert: "Alert", recommendation: "Recommendation" };
const KIND_TONE: Record<MessageKind, string> = { message: "muted", reminder: "warn", alert: "bad", recommendation: "good" };

/** Ready-made starting points - the sender edits them before sending. */
const TEMPLATES: { icon: string; label: string; preset: Omit<ComposePreset, "audience"> }[] = [
  {
    icon: "check", label: "Assessment reminder",
    preset: { kind: "reminder", title: "Complete your career assessment this week", link: "/?begin=1",
      body: "Hi {name}, please complete your career assessment this week. It takes about 45 minutes - find a quiet time and finish it in one sitting. Your report, best-fit careers and roadmap open as soon as you submit." },
  },
  {
    icon: "exam", label: "Exam deadline alert",
    preset: { kind: "alert", title: "Entrance exam registrations are open", link: "/account/exams",
      body: "Hi {name}, registrations for several entrance exams are open now. Check the exams you're aiming for, note the last dates and register in time - dates and a study planner are in Entrance Exams." },
  },
  {
    icon: "award", label: "Scholarship alert",
    preset: { kind: "alert", title: "Scholarships closing soon", link: "/account/scholarships",
      body: "Hi {name}, some scholarships you may qualify for close soon. Open Scholarships, check the ones that match you and keep your documents ready." },
  },
  {
    icon: "route", label: "Weekly nudge",
    preset: { kind: "recommendation", title: "One step this week", link: "/account",
      body: "Hi {name}, pick one step from the 30-day action plan on your dashboard and finish it this week. Small steps every week add up." },
  },
];

export default function MessagesPage() {
  const { students } = usePortal();
  const [rows, setRows] = useState<SentRow[] | null>(null);
  const [error, setError] = useState("");
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    apiFetch<{ messages: SentRow[] }>("/api/institution/messages").then((r) => setRows(r.messages)).catch((e) => setError(e instanceof Error ? e.message : "Could not load messages."));
  }, [tick]);

  const total = (students ?? []).filter((s) => !s.archived).length;
  const sentTo = rows?.reduce((s, m) => s + m.recipientCount, 0) ?? 0;
  const opened = rows?.reduce((s, m) => s + m.readCount, 0) ?? 0;

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Messages</h1>
          <p className="ip-sub">Messages appear in &quot;Messages from your school&quot; on each student&apos;s dashboard, and can also go to their email.</p>
        </div>
        <button className="ip-btn" onClick={() => setCompose({ audience: { type: "all" } })}><Icon name="bell" size={16} stroke={2} /> New message</button>
      </div>

      <Section title="Start from a template" icon="sparkle" aside={`goes to all ${total} students - you can change the audience`}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {TEMPLATES.map((t) => (
            <button key={t.label} className="ip-card" onClick={() => setCompose({ audience: { type: "all" }, ...t.preset })}
              style={{ textAlign: "left", padding: 14, cursor: "pointer", font: "inherit", display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ width: 32, height: 32, borderRadius: 9, background: "var(--accentTint)", color: "var(--accent)", display: "grid", placeItems: "center", flex: "none" }}><Icon name={t.icon} size={17} /></span>
              <span><b style={{ display: "block", fontSize: 13.5 }}>{t.label}</b><span className="ip-muted" style={{ fontSize: 12 }}>{t.preset.title}</span></span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Sent" icon="bell" aside={rows ? `${rows.length} messages · ${sentTo ? Math.round((opened / sentTo) * 100) : 0}% opened` : undefined} style={{ marginTop: 12 }}>
        {error && <div className="ip-alert bad">{error}</div>}
        {!rows ? <div className="ip-muted">Loading…</div> : rows.length === 0 ? (
          <div className="ip-muted">Nothing sent yet. Start from a template above, or send reminders from the Overview.</div>
        ) : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th>Message</th><th>Type</th><th>To</th><th>Sent</th><th className="num">Opened</th></tr></thead>
              <tbody>
                {rows.map((m) => {
                  const pct = m.recipientCount ? Math.round((m.readCount / m.recipientCount) * 100) : 0;
                  return (
                    <tr key={m.id}>
                      <td style={{ minWidth: 220 }}>
                        <b>{m.title}</b>
                        <div className="ip-muted" style={{ fontSize: 12, maxWidth: 460, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.body}</div>
                      </td>
                      <td><span className={`ip-pill ${KIND_TONE[m.kind]}`}>{KIND_LABEL[m.kind]}</span></td>
                      <td style={{ minWidth: 140 }}>{m.audience.label}<div className="ip-muted" style={{ fontSize: 12 }}>{m.recipientCount} student{m.recipientCount === 1 ? "" : "s"}{m.emailed ? ` · ${m.emailed} emailed` : ""}</div></td>
                      <td style={{ whiteSpace: "nowrap" }}>{formatAgo(m.createdAt)}<div className="ip-muted" style={{ fontSize: 12 }}>by {m.sentByName}</div></td>
                      <td className="num" style={{ minWidth: 120 }}>
                        {m.readCount}/{m.recipientCount}
                        <div className="ip-bar" style={{ marginTop: 5 }}><div style={{ width: `${Math.max(2, pct)}%`, background: "var(--good)" }} /></div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <ComposeMessage preset={compose} onClose={() => setCompose(null)} onSent={() => setTick((t) => t + 1)} />
    </>
  );
}
