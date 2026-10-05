"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const ACCENT = "#7c3aed";
const KEY = "onegrasp.abroad.sop.v1";

const PARTS = [
  { heading: "Your goal", ask: "Open with what you want to do after this degree, specifically. One or two sentences, not a life story." },
  { heading: "Academic background", ask: "The subjects, projects or results that prepared you. Name a project and what you built or found." },
  { heading: "Work and projects", ask: "Internships, jobs, research or open-source work. What did you do, and what changed because of it?" },
  { heading: "Why this course", ask: "Name modules, labs or a research group on this programme, and connect them to your goal." },
  { heading: "Why this university and country", ask: "Specific reasons: faculty, industry links, location, post-study work rules. Avoid praise anyone could write." },
  { heading: "Career plan", ask: "Where you will be in 3 to 5 years, and how this degree gets you there. Be realistic and specific." },
];

const GENERIC = ["since childhood", "since my childhood", "i have always been fascinated", "esteemed university", "prestigious university", "cutting-edge", "world-class", "passion for", "dream of", "in this fast-paced world", "in today's world", "i am a hardworking"];

interface Saved {
  text: string;
  university: string;
  limit: number;
}

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { text: "", university: "", limit: 1000, ...(JSON.parse(raw) as Partial<Saved>) } : { text: "", university: "", limit: 1000 };
  } catch {
    return { text: "", university: "", limit: 1000 };
  }
}

export function SopHelper() {
  const [saved, setSaved] = useState<Saved>({ text: "", university: "", limit: 1000 });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(load());
    setReady(true);
  }, []);

  const update = (patch: Partial<Saved>) => {
    setSaved((s) => {
      const next = { ...s, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Storage blocked: the draft lasts for this visit only.
      }
      return next;
    });
  };

  const words = saved.text.trim() ? saved.text.trim().split(/\s+/).length : 0;
  const notes = useMemo(() => {
    const out: { ok: boolean; text: string }[] = [];
    const t = saved.text.trim();
    if (!t) return out;
    const lower = t.toLowerCase();
    if (words > saved.limit) out.push({ ok: false, text: `Over the limit by ${words - saved.limit} words.` });
    else if (words < saved.limit * 0.6) out.push({ ok: false, text: `${words} of ${saved.limit} words. Most strong statements use most of the allowed length with specifics.` });
    else out.push({ ok: true, text: `${words} of ${saved.limit} words.` });
    const found = GENERIC.filter((g) => lower.includes(g));
    if (found.length) out.push({ ok: false, text: `Generic phrases: "${found.join('", "')}". Replace each with a specific fact about you.` });
    if (saved.university.trim() && !lower.includes(saved.university.trim().toLowerCase())) out.push({ ok: false, text: `You haven't named ${saved.university.trim()} yet. Admissions readers look for why this programme, specifically.` });
    if (!/\d/.test(t)) out.push({ ok: false, text: "No numbers yet. Results, team sizes, users, or dates make claims believable." });
    const paragraphs = t.split(/\n\s*\n/).filter((x) => x.trim());
    if (paragraphs.length < 4 && words > 300) out.push({ ok: false, text: "Use one paragraph per part above, so readers can follow your story." });
    if (!found.length && /\d/.test(t)) out.push({ ok: true, text: "Specific and concrete. Good." });
    return out;
  }, [saved.text, saved.university, saved.limit, words]);

  if (!ready) return <p style={{ fontSize: 14, color: "#64748b" }}>Loading your draft…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#4c1d95", lineHeight: 1.6 }}>
        You write the statement; this helper gives structure and feedback. Universities check for copied and AI-generated statements, and a statement that isn&apos;t yours can cost you the admission. Your draft is saved on this device only.
      </div>

      <section style={panel}>
        <h2 style={h2}>A structure that works</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          {PARTS.map((p) => <li key={p.heading} style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}><b>{p.heading}.</b> {p.ask}</li>)}
        </ol>
      </section>

      <section style={panel}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 10 }}>
          <label style={label}>University this draft is for<input value={saved.university} onChange={(e) => update({ university: e.target.value })} placeholder="e.g. University of Edinburgh" style={input} /></label>
          <label style={label}>Word limit (check the programme page)<input type="number" min={100} max={3000} value={saved.limit} onChange={(e) => update({ limit: Math.max(100, Number(e.target.value) || 1000) })} style={input} /></label>
        </div>
        <textarea value={saved.text} onChange={(e) => update({ text: e.target.value })} rows={16} placeholder="Write your statement here, one paragraph per part." style={{ ...input, lineHeight: 1.7, fontSize: 14.5, resize: "vertical", fontFamily: "inherit" }} />
        <div style={{ fontSize: 12.5, fontWeight: 800, color: words > saved.limit ? "#b91c1c" : "#64748b", marginTop: 6, fontVariantNumeric: "tabular-nums" }}>{words} / {saved.limit} words</div>
      </section>

      {notes.length > 0 && (
        <section style={panel}>
          <h2 style={h2}>Feedback</h2>
          {notes.map((n) => (
            <div key={n.text} style={{ fontSize: 13.5, lineHeight: 1.55, color: n.ok ? "#166534" : "#92400e", background: n.ok ? "#f0fdf4" : "#fffbeb", borderRadius: 8, padding: "8px 10px", marginBottom: 6 }}>{n.ok ? "✓ " : "• "}{n.text}</div>
          ))}
        </section>
      )}

      <section style={panel}>
        <h2 style={h2}>Letters of recommendation</h2>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
          <li>Ask people who know your work well: a professor who taught or supervised you, or a manager who saw your results. A famous name who barely knows you helps less.</li>
          <li>Ask at least a month before the deadline. Give each recommender your CV, the programme list with deadlines, and two or three things you did with them that they can describe.</li>
          <li>Never write your own letter for a recommender to sign. Universities treat it as misrepresentation.</li>
          <li>Send a polite reminder a week before each deadline, and thank them when it is done.</li>
        </ul>
      </section>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
