"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";

const ACCENT = "#2563eb";
const KEY = "onegrasp.exams.wellbeing.v1";

const DROP_YEAR = [
  "How far was my score from the cut-off I need?",
  "How many attempts and years of eligibility do I have left?",
  "Can my family afford another year, including coaching and living costs?",
  "Was I unwell or unprepared for a specific, fixable reason?",
  "How did the last year affect my health and mood?",
  "Have I also secured a backup admission?",
];

const COACHING = [
  "I asked for a free demo class",
  "I asked for real past results with student names I can verify",
  "I read the refund policy in writing before paying",
  "I have compared the coaching with free resources first",
  "I am wary of '100% selection' or 'guaranteed rank' claims",
];

interface Saved {
  dropYear: number[];
  coaching: number[];
}

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as Partial<Saved>) : {};
    return { dropYear: Array.isArray(v.dropYear) ? v.dropYear : [], coaching: Array.isArray(v.coaching) ? v.coaching : [] };
  } catch {
    return { dropYear: [], coaching: [] };
  }
}

function save(s: Saved) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage blocked: the checklists last for this visit only.
  }
}

export function WellbeingPage() {
  const [saved, setSaved] = useState<Saved>({ dropYear: [], coaching: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(load());
    setReady(true);
  }, []);

  const toggle = (key: keyof Saved, index: number) => {
    const current = saved[key];
    const next = { ...saved, [key]: current.includes(index) ? current.filter((i) => i !== index) : [...current, index] };
    setSaved(next);
    save(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <section style={panel}>
        <h2 style={h2}>One exam does not decide a life</h2>
        <p style={p}>
          Entrance exams cause serious stress for many students and families. A single result is one data point, not a verdict on your future. This section shows more than one path, and it makes support easy to find.
        </p>
      </section>

      <section style={panel}>
        <h2 style={h2}>Backup paths</h2>
        <p style={p}>
          When you add a target exam, the dashboard suggests two or three related alternatives with different eligibility or difficulty. For example, a JEE target also leads to state CETs, BITSAT, CUET-UG for B.Sc programmes and private university exams.
        </p>
        <p style={p}>
          Someone can become an engineer, a doctor, a lawyer or a designer through several routes, including later entry. Plan a backup before you need one.
        </p>
        <Link href="/account/exams/roadmap" style={link}>See the stage roadmap →</Link>
      </section>

      <section style={panel}>
        <h2 style={h2}>Drop-year decision checklist</h2>
        <p style={p}>Tick each question you have honestly answered. The checklist is for you to think through with a parent or counsellor. It does not give a yes or no answer.</p>
        {ready && DROP_YEAR.map((q, i) => (
          <label key={q} style={checkRow}>
            <input type="checkbox" checked={saved.dropYear.includes(i)} onChange={() => toggle("dropYear", i)} style={box} />
            <span>{q}</span>
          </label>
        ))}
      </section>

      <section style={panel}>
        <h2 style={h2}>Judging coaching before you pay</h2>
        <p style={p}>Check these before paying a large fee. Many students succeed through self-study with official resources and mock tests, so compare the free route first.</p>
        {ready && COACHING.map((q, i) => (
          <label key={q} style={checkRow}>
            <input type="checkbox" checked={saved.coaching.includes(i)} onChange={() => toggle("coaching", i)} style={box} />
            <span>{q}</span>
          </label>
        ))}
      </section>

      <section style={panel}>
        <h2 style={h2}>Support for exam stress</h2>
        <ul style={list}>
          <li>Keep a regular sleep routine, especially in the final weeks.</li>
          <li>Take short study breaks, and move around between sessions.</li>
          <li>Plan the exam-day logistics early: documents, reporting time and what not to bring.</li>
          <li>Avoid comparison and leaderboards on result day. Read the official result first, then decide your next step.</li>
        </ul>
        <div style={{ marginTop: 12, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: "12px 14px", fontSize: 14, color: "#1e3a8a", lineHeight: 1.6 }}>
          <b>Tele-MANAS: 14416</b> is free mental health support. It is useful alongside any problem that causes distress.
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Tips for parents</h2>
        <ul style={list}>
          <li>Focus on effort, not on rank or comparison with other children.</li>
          <li>Keep communication open, and ask how the preparation feels, not only how it is going.</li>
          <li>Know the signs that a child needs help: withdrawal, sleep or appetite changes, and talk of hopelessness. Contact Tele-MANAS on 14416 if you are worried.</li>
        </ul>
      </section>

      <section style={panel}>
        <h2 style={h2}>Check real seat numbers</h2>
        <p style={p}>
          Use official sources for seat numbers and applicants per seat, where they are published, so you can choose on facts rather than hope. Every exam page links to its official website.
        </p>
      </section>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 20px" };
const h2: CSSProperties = { fontSize: 17, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const p: CSSProperties = { fontSize: 14, color: "#475569", lineHeight: 1.7, margin: "0 0 10px" };
const link: CSSProperties = { fontSize: 13.5, fontWeight: 800, color: ACCENT, textDecoration: "none" };
const list: CSSProperties = { margin: 0, paddingLeft: 18, fontSize: 14, color: "#334155", lineHeight: 1.8 };
const checkRow: CSSProperties = { display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "#1e293b", lineHeight: 1.6, padding: "6px 0", cursor: "pointer" };
const box: CSSProperties = { marginTop: 4, width: 16, height: 16, flex: "none", accentColor: ACCENT };
