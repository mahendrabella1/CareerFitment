"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { LEGAL_GUIDES } from "@/data/legal/guides";
import { LEGAL_DEADLINES, addPeriod, buildIcs } from "@/data/legal/deadlines";
import { LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";

/**
 * Evidence checklist, timeline maker and deadline reminders (plan section 6,
 * "Other tools"). Privacy rule from plan section 11: checklists and timelines
 * stay in the browser for the session (sessionStorage) and disappear when it
 * closes, unless the learner downloads them. Nothing is sent to a server.
 */

const EVIDENCE_KEY = "onegrasp.legal.evidence.session";
const TIMELINE_KEY = "onegrasp.legal.timeline.session";

interface EvidenceState {
  guideSlug: string;
  checked: string[];
  custom: string[];
}

interface TimelineEntry {
  id: string;
  date: string;
  time: string;
  what: string;
  who: string;
}

function readSession<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeSession(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the tool still works for this page view.
  }
}

function downloadText(filename: string, text: string, type = "text/plain") {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function LegalToolkit() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#312e81", lineHeight: 1.6 }}>
        Everything you type here stays in this browser tab and is cleared when you close it. Download or copy it if you want to keep it. On a shared device, use a private window.
      </div>
      {/* Checklist on the left, the two date tools beside it on wide screens. */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 18, alignItems: "start" }}>
        <EvidenceBuilder />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
          <TimelineMaker />
          <DeadlineReminders />
        </div>
      </div>
    </div>
  );
}

function EvidenceBuilder() {
  const [state, setState] = useState<EvidenceState>({ guideSlug: LEGAL_GUIDES[0].slug, checked: [], custom: [] });
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readSession<EvidenceState | null>(EVIDENCE_KEY, null);
    if (saved && LEGAL_GUIDES.some((g) => g.slug === saved.guideSlug)) setState(saved);
  }, []);

  const update = (next: EvidenceState) => {
    setState(next);
    writeSession(EVIDENCE_KEY, next);
  };

  const guide = LEGAL_GUIDES.find((g) => g.slug === state.guideSlug) ?? LEGAL_GUIDES[0];
  const items = [...guide.evidence, ...state.custom];
  const doneCount = items.filter((i) => state.checked.includes(i)).length;

  const asText = () =>
    [`Evidence checklist: ${guide.title}`, "", ...items.map((i) => `[${state.checked.includes(i) ? "x" : " "}] ${i}`), "", "Made with OneGrasp Legal Resources. General information, not legal advice."].join("\n");

  return (
    <section style={panel} id="evidence">
      <h2 style={h2}>Evidence checklist</h2>
      <p style={pText}>Pick your situation. Tick each item once you have it safely stored. Safety comes before evidence: never take a risk to collect it.</p>
      <label style={label}>
        Situation
        <select
          value={state.guideSlug}
          onChange={(e) => update({ guideSlug: e.target.value, checked: [], custom: [] })}
          style={input}
        >
          {LEGAL_GUIDES.map((g) => (
            <option key={g.slug} value={g.slug}>{g.number}. {g.title}</option>
          ))}
        </select>
      </label>

      <div style={{ fontSize: 12.5, color: "#64748b", margin: "10px 0 6px" }}>{doneCount} of {items.length} ready</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.map((item) => (
          <label key={item} style={checkRow}>
            <input
              type="checkbox"
              checked={state.checked.includes(item)}
              onChange={() =>
                update({ ...state, checked: state.checked.includes(item) ? state.checked.filter((c) => c !== item) : [...state.checked, item] })
              }
              style={{ marginTop: 3, accentColor: ACCENT }}
            />
            <span>{item}</span>
          </label>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your own item" style={{ ...input, flex: 1, minWidth: 180 }} />
        <button
          onClick={() => {
            const v = draft.trim();
            if (!v || items.includes(v)) return;
            update({ ...state, custom: [...state.custom, v] });
            setDraft("");
          }}
          style={secondaryBtn}
        >
          Add
        </button>
      </div>

      <div style={btnRow}>
        <button onClick={async () => { setCopied(await copyText(asText())); setTimeout(() => setCopied(false), 2000); }} style={primaryBtn}>{copied ? "Copied" : "Copy checklist"}</button>
        <button onClick={() => downloadText(`evidence-checklist-${guide.slug}.txt`, asText())} style={secondaryBtn}>Download as text</button>
        <Link href={`/account/legal/guides/${guide.slug}`} style={linkStyle}>Open the guide →</Link>
      </div>
    </section>
  );
}

function TimelineMaker() {
  const [entries, setEntries] = useState<TimelineEntry[]>([]);
  const [form, setForm] = useState({ date: "", time: "", what: "", who: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = readSession<TimelineEntry[]>(TIMELINE_KEY, []);
    if (Array.isArray(saved)) setEntries(saved);
  }, []);

  const save = (next: TimelineEntry[]) => {
    setEntries(next);
    writeSession(TIMELINE_KEY, next);
  };

  const sorted = useMemo(() => [...entries].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)), [entries]);

  const fmt = (e: TimelineEntry) => {
    const d = e.date ? new Date(`${e.date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Date not known";
    return `${d}${e.time ? `, ${e.time}` : ""}: ${e.what}${e.who ? ` (present: ${e.who})` : ""}`;
  };
  const asText = () => ["Timeline of events", "", ...sorted.map((e, i) => `${i + 1}. ${fmt(e)}`), "", "Prepared by me. Facts as I remember them."].join("\n");

  return (
    <section style={panel} id="timeline">
      <h2 style={h2}>Timeline maker</h2>
      <p style={pText}>Write down what happened and when, one event at a time. A clear timeline helps you explain your story to the police, a lawyer or a committee.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 8 }}>
        <label style={label}>Date<input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} style={input} /></label>
        <label style={label}>Time (optional)<input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} style={input} /></label>
      </div>
      <label style={{ ...label, marginTop: 8 }}>What happened<textarea rows={3} value={form.what} onChange={(e) => setForm({ ...form, what: e.target.value })} style={{ ...input, resize: "vertical", fontFamily: "inherit" }} /></label>
      <label style={{ ...label, marginTop: 8 }}>Who was there (optional)<input value={form.who} onChange={(e) => setForm({ ...form, who: e.target.value })} style={input} /></label>
      <div style={btnRow}>
        <button
          onClick={() => {
            if (!form.what.trim()) return;
            save([...entries, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...form, what: form.what.trim(), who: form.who.trim() }]);
            setForm({ date: form.date, time: "", what: "", who: "" });
          }}
          style={primaryBtn}
        >
          Add to timeline
        </button>
      </div>

      {sorted.length > 0 && (
        <>
          <ol style={{ margin: "14px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            {sorted.map((e) => (
              <li key={e.id} style={{ fontSize: 13.5, color: "#1e293b", lineHeight: 1.55 }}>
                {fmt(e)}{" "}
                <button onClick={() => save(entries.filter((x) => x.id !== e.id))} style={{ fontSize: 12, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
              </li>
            ))}
          </ol>
          <div style={btnRow}>
            <button onClick={async () => { setCopied(await copyText(asText())); setTimeout(() => setCopied(false), 2000); }} style={primaryBtn}>{copied ? "Copied" : "Copy timeline"}</button>
            <button onClick={() => downloadText("timeline.txt", asText())} style={secondaryBtn}>Download as text</button>
            <button onClick={() => save([])} style={secondaryBtn}>Clear all</button>
          </div>
        </>
      )}
    </section>
  );
}

function DeadlineReminders() {
  const [deadlineId, setDeadlineId] = useState(LEGAL_DEADLINES[0].id);
  const [start, setStart] = useState("");
  const d = LEGAL_DEADLINES.find((x) => x.id === deadlineId) ?? LEGAL_DEADLINES[0];
  const due = start ? addPeriod(start, d.amount, d.unit) : null;
  const guide = LEGAL_GUIDES.find((g) => g.slug === d.guideSlug);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = due ? Math.round((due.getTime() - today.getTime()) / 86400000) : null;

  return (
    <section style={panel} id="deadlines">
      <h2 style={h2}>Deadline reminders</h2>
      <p style={pText}>Many complaints have a time limit. Pick one, enter the start date, and add the last date to your own calendar with a reminder a week before.</p>
      <label style={label}>
        Time limit
        <select value={deadlineId} onChange={(e) => setDeadlineId(e.target.value)} style={input}>
          {LEGAL_DEADLINES.map((x) => (
            <option key={x.id} value={x.id}>{x.label} ({x.amount} {x.unit})</option>
          ))}
        </select>
      </label>
      <label style={{ ...label, marginTop: 8 }}>
        {d.startLabel}
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={input} />
      </label>
      <p style={{ ...pText, marginTop: 8 }}>{d.note}</p>

      {due && (
        <div style={{ marginTop: 6, border: `1px solid ${ACCENT}35`, background: `${ACCENT}0a`, borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 13, color: "#475569" }}>Last date</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>{due.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: daysLeft !== null && daysLeft < 0 ? "#b91c1c" : daysLeft !== null && daysLeft <= 14 ? "#b45309" : "#166534", marginTop: 2 }}>
            {daysLeft === null ? "" : daysLeft < 0 ? `This date passed ${Math.abs(daysLeft)} days ago. Get legal advice (15100): late filing is sometimes allowed for a good reason.` : daysLeft === 0 ? "That is today." : `${daysLeft} days from today.`}
          </div>
          <div style={btnRow}>
            <button
              onClick={() =>
                downloadText(
                  `deadline-${d.id}.ics`,
                  buildIcs(`Last date: ${d.label}`, `${d.note}${guide ? ` Guide: ${guide.title}.` : ""} This is general information, not legal advice.`, due),
                  "text/calendar",
                )
              }
              style={primaryBtn}
            >
              Add to my calendar (.ics)
            </button>
            {guide && <Link href={`/account/legal/guides/${guide.slug}`} style={linkStyle}>Open the guide →</Link>}
          </div>
        </div>
      )}
    </section>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" };
const h2: CSSProperties = { fontSize: 17, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
const checkRow: CSSProperties = { display: "flex", gap: 9, alignItems: "flex-start", fontSize: 13.5, color: "#1e293b", lineHeight: 1.5, cursor: "pointer" };
const btnRow: CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 12 };
const primaryBtn: CSSProperties = { fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 9, padding: "9px 14px", cursor: "pointer" };
const secondaryBtn: CSSProperties = { fontSize: 13, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 9, padding: "8px 13px", cursor: "pointer" };
const linkStyle: CSSProperties = { fontSize: 13, fontWeight: 800, color: ACCENT, textDecoration: "none" };
