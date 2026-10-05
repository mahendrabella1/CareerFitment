"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { buildPlan, attendeePlan, type Level, type PlanStep } from "@/lib/research/plan";
import { createProject } from "@/lib/research/clientProgress";

const ACCENT = "#7c3aed";
const LEVELS: { value: Level | "ATTENDEE"; label: string; desc: string }[] = [
  { value: "ATTENDEE", label: "Attendee", desc: "Watch talks, ask a question, write a reflection (1 week)" },
  { value: "POSTER", label: "Poster presenter", desc: "A one-page visual poster (6-10 weeks)" },
  { value: "ORAL", label: "Oral presenter", desc: "A 7-12 minute talk with slides (8-12 weeks)" },
  { value: "PAPER", label: "Full paper author", desc: "A 4-8 page paper for proceedings (12-20 weeks)" },
];

export default function NewProjectPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conferenceTitle, setConferenceTitle] = useState("");
  const [conferenceOrganiser, setConferenceOrganiser] = useState("");
  const [conferenceUrl, setConferenceUrl] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [abstractDeadline, setAbstractDeadline] = useState("");
  const [level, setLevel] = useState<Level | "ATTENDEE">("POSTER");
  const [question, setQuestion] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PlanStep[] | null>(null);
  const [creating, setCreating] = useState(false);

  const computePlan = () => {
    setError(null);
    if (!startsAt) { setError("Pick the conference date first."); return; }
    const today = new Date();
    const event = new Date(startsAt);
    if (level === "ATTENDEE") { setPreview(attendeePlan(event)); return; }
    if (!abstractDeadline) { setError("Pick the abstract deadline for this level."); return; }
    const result = buildPlan(level, today, new Date(abstractDeadline), event);
    if (!result.ok) { setError(result.reason); setPreview(null); return; }
    setPreview(result.steps);
  };

  const start = async () => {
    if (!user?.uid || !preview) return;
    setCreating(true);
    try {
      const id = await createProject(user.uid, {
        conferenceTitle, conferenceOrganiser, conferenceUrl,
        startsAt: new Date(startsAt).getTime(),
        abstractDeadline: level === "ATTENDEE" ? new Date(startsAt).getTime() : new Date(abstractDeadline).getTime(),
        level, question, status: "active",
        steps: preview.map((s) => ({ order: s.order, title: s.title, dueAt: s.dueAt.getTime(), status: "TODO" as const })),
      });
      router.push(`/account/research/projects/${id}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <Link href="/account/research" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Research & Conferences</Link>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>Start a research project</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", columnGap: 16 }}>
      <Field label="Conference name">
        <input value={conferenceTitle} onChange={(e) => setConferenceTitle(e.target.value)} placeholder="e.g. IRIS National Fair 2027" style={inputStyle} />
      </Field>
      <Field label="Organiser">
        <input value={conferenceOrganiser} onChange={(e) => setConferenceOrganiser(e.target.value)} placeholder="e.g. IRIS" style={inputStyle} />
      </Field>
      <Field label="Official link (optional)">
        <input value={conferenceUrl} onChange={(e) => setConferenceUrl(e.target.value)} placeholder="https://…" style={inputStyle} />
      </Field>
      <Field label="Conference / presentation date">
        <input type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} style={inputStyle} />
      </Field>
      </div>

      <Field label="Participation level">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
          {LEVELS.map((l) => (
            <button key={l.value} onClick={() => setLevel(l.value)}
              style={{ textAlign: "left", padding: "10px 14px", borderRadius: 9, cursor: "pointer", border: `1.5px solid ${level === l.value ? ACCENT : "#e2e2e2"}`, background: level === l.value ? `${ACCENT}10` : "#fff" }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1a1a1a" }}>{l.label}</div>
              <div style={{ fontSize: 11.5, color: "#888" }}>{l.desc}</div>
            </button>
          ))}
        </div>
      </Field>

      {level !== "ATTENDEE" && (
        <Field label="Abstract submission deadline">
          <input type="date" value={abstractDeadline} onChange={(e) => setAbstractDeadline(e.target.value)} style={inputStyle} />
        </Field>
      )}

      <Field label="Your research question (can refine later)">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="What are you trying to find out?" style={inputStyle} />
      </Field>

      <button onClick={computePlan} style={{ width: "100%", padding: "11px 0", borderRadius: 10, border: `1.5px solid ${ACCENT}`, background: "#fff", color: ACCENT, fontWeight: 700, cursor: "pointer", marginTop: 6 }}>
        See my step plan
      </button>

      {error && <p style={{ color: "#b91c1c", fontSize: 13, marginTop: 10 }}>{error}</p>}

      {preview && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>Your plan</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
            {preview.map((s) => (
              <div key={s.order} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 0", borderBottom: "1px solid #f3f3f5" }}>
                <span>{s.order}. {s.title}</span>
                <span style={{ color: "#888" }}>{s.dueAt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
            ))}
          </div>
          <button onClick={start} disabled={creating || !conferenceTitle.trim()}
            style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, cursor: "pointer", opacity: creating || !conferenceTitle.trim() ? 0.5 : 1 }}>
            {creating ? "Starting…" : "Start this project"}
          </button>
        </div>
      )}
    </div>
  );
}

const inputStyle: CSSProperties = { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13.5, fontFamily: "inherit" };
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}
