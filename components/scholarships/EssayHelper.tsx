"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { scopedKey } from "@/lib/progress/userStorage";

const ACCENT = "#166534";
const KEY = "onegrasp.scholarships.essays.v1";

interface Prompt {
  id: string;
  title: string;
  intro: string;
  parts: { heading: string; ask: string }[];
}

const PROMPTS: Prompt[] = [
  {
    id: "need",
    title: "Why do you need this scholarship?",
    intro: "Selectors want to understand your real situation and what the money will change. Be specific and honest; never exaggerate hardship.",
    parts: [
      { heading: "Your situation", ask: "In one or two sentences, what is your family's financial situation? Use facts: who earns, roughly how much, and what has changed." },
      { heading: "What the money pays for", ask: "Name the costs: fees, hostel, books, a laptop, travel. Amounts make this believable." },
      { heading: "What you have done so far", ask: "Show effort despite the constraint: marks, part-time work, coaching yourself, helping siblings." },
      { heading: "The difference it makes", ask: "What changes if you get it? Staying in college, focusing on studies, a specific goal you can now reach." },
    ],
  },
  {
    id: "goals",
    title: "Your goals",
    intro: "A clear goal with a believable path is stronger than a big vague dream.",
    parts: [
      { heading: "The goal", ask: "State it in one sentence, with a role and a time frame. For example, the kind of work you want to do in five years." },
      { heading: "Why it matters to you", ask: "Describe one specific moment or experience that led you here." },
      { heading: "Steps already taken", ask: "Courses, projects, competitions, internships or reading you have done towards it." },
      { heading: "The next step", ask: "How this course and this scholarship move you to the next stage, and how you might give back later." },
    ],
  },
  {
    id: "challenge",
    title: "A challenge you overcame",
    intro: "This shows character. Focus on what you did, not only on what happened to you.",
    parts: [
      { heading: "The situation", ask: "Briefly, what was the challenge and when did it happen?" },
      { heading: "What you did", ask: "Your actions, in the first person. What did you decide, try or change?" },
      { heading: "The result", ask: "What happened in the end? Use evidence where you can: marks, an outcome, feedback." },
      { heading: "What you learned", ask: "What do you do differently now because of it?" },
    ],
  },
];

const GENERIC_PHRASES = [
  "since my childhood",
  "since childhood",
  "hardworking student",
  "hard-working student",
  "i am very passionate",
  "it has always been my dream",
  "my dream is",
  "make my parents proud",
  "serve the nation",
  "in today's world",
  "in this modern world",
  "last but not least",
  "very very",
  "i want to become a successful",
];

const CHECKS = ["Specific: names real facts, numbers or examples", "Honest: nothing exaggerated or borrowed", "Shows impact: what changed because of you", "Within the word limit", "In my own words (no copied or AI-written text)"];

function load(): Record<string, string> {
  try {
    const raw = window.localStorage.getItem(scopedKey(KEY));
    const v = raw ? (JSON.parse(raw) as unknown) : {};
    return v && typeof v === "object" ? (v as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function save(v: Record<string, string>) {
  try {
    window.localStorage.setItem(scopedKey(KEY), JSON.stringify(v));
  } catch {
    // Storage blocked: the draft lasts for this visit only.
  }
}

function feedback(text: string, limit: number): { tone: "ok" | "warn"; text: string }[] {
  const out: { tone: "ok" | "warn"; text: string }[] = [];
  const trimmed = text.trim();
  if (!trimmed) return out;
  const words = trimmed.split(/\s+/).filter(Boolean);
  const sentences = trimmed.split(/[.!?]+\s/).filter((s) => s.trim().length > 0);
  const avg = words.length / Math.max(1, sentences.length);
  const lower = ` ${trimmed.toLowerCase()} `;

  if (words.length > limit) out.push({ tone: "warn", text: `Over the limit by ${words.length - limit} words. Cut repetition and the least specific sentence.` });
  else if (words.length < limit * 0.6) out.push({ tone: "warn", text: `Only ${words.length} of ${limit} words. Add one specific example or fact.` });
  else out.push({ tone: "ok", text: `${words.length} of ${limit} words: a good length.` });

  if (avg > 28) out.push({ tone: "warn", text: `Your sentences average ${Math.round(avg)} words. Split the longest ones so each makes one point.` });

  const found = GENERIC_PHRASES.filter((p) => lower.includes(p));
  if (found.length) out.push({ tone: "warn", text: `These phrases appear in thousands of essays: "${found.join('", "')}". Replace them with something only you could write.` });

  if (!/\d/.test(trimmed)) out.push({ tone: "warn", text: "No numbers yet. A mark, an amount, a date or a count makes the essay concrete." });
  else out.push({ tone: "ok", text: "You use specific numbers. Good." });

  if (!/\b(i|my|me)\b/i.test(trimmed)) out.push({ tone: "warn", text: "Write in the first person (I, my). Selectors want to hear your voice." });

  const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim());
  if (paragraphs.length === 1 && words.length > 120) out.push({ tone: "warn", text: "One long block. Break it into three or four short paragraphs, one per part above." });

  return out;
}

export function EssayHelper() {
  const [active, setActive] = useState(PROMPTS[0].id);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [limit, setLimit] = useState(250);
  const [ticks, setTicks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDrafts(load());
  }, []);

  const prompt = PROMPTS.find((p) => p.id === active) ?? PROMPTS[0];
  const text = drafts[active] ?? "";
  const notes = useMemo(() => feedback(text, limit), [text, limit]);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  const setText = (v: string) => {
    const next = { ...drafts, [active]: v };
    setDrafts(next);
    save(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#14532d", lineHeight: 1.6 }}>
        This helper gives structure and feedback. It never writes the essay for you: copied or AI-written essays can get an application rejected. Drafts are saved on this device only.
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {PROMPTS.map((p) => (
          <button key={p.id} onClick={() => { setActive(p.id); setTicks([]); }} style={chip(active === p.id)}>{p.title}</button>
        ))}
      </div>

      {/* The prompt and the checklist beside the draft, so writing never
          means scrolling away from what the selectors asked. */}
      <style dangerouslySetInnerHTML={{ __html: ".eh-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:16px;align-items:start}.eh-col{display:flex;flex-direction:column;gap:16px;min-width:0}@media (max-width:1180px){.eh-cols{grid-template-columns:minmax(0,1fr)}}" }} />
      <div className="eh-cols">
      <div className="eh-col">
      <section style={panel}>
        <h2 style={h2}>{prompt.title}</h2>
        <p style={pText}>{prompt.intro}</p>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          {prompt.parts.map((part) => (
            <li key={part.heading} style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>
              <b>{part.heading}.</b> {part.ask}
            </li>
          ))}
        </ol>
      </section>

      <section style={panel}>
        <h2 style={h2}>Before you submit</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {CHECKS.map((c) => (
            <label key={c} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#1e293b", lineHeight: 1.5 }}>
              <input type="checkbox" checked={ticks.includes(c)} onChange={() => setTicks((t) => (t.includes(c) ? t.filter((x) => x !== c) : [...t, c]))} style={{ marginTop: 3, accentColor: ACCENT }} />
              {c}
            </label>
          ))}
        </div>
        {ticks.length === CHECKS.length && <p style={{ fontSize: 13, color: "#166534", fontWeight: 800, margin: "10px 0 0" }}>Ready. Ask a teacher to read it once before you submit.</p>}
      </section>
      </div>

      <div className="eh-col">
      <section style={panel}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <h2 style={{ ...h2, margin: 0 }}>Your draft</h2>
          <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", display: "flex", alignItems: "center", gap: 6 }}>
            Word limit
            <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a" }}>
              {[150, 250, 300, 500, 800].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={12}
          placeholder="Write your own answer here, one paragraph for each part above."
          style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", fontSize: 14.5, lineHeight: 1.7, border: "1px solid #cbd5e1", borderRadius: 10, fontFamily: "inherit", resize: "vertical", color: "#0f172a", background: "#fff" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginTop: 6 }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: words > limit ? "#b91c1c" : "#64748b", fontVariantNumeric: "tabular-nums" }}>{words} / {limit} words</span>
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              } catch {
                setCopied(false);
              }
            }}
            disabled={!text.trim()}
            style={{ fontSize: 12.5, fontWeight: 800, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 8, padding: "6px 12px", cursor: text.trim() ? "pointer" : "not-allowed" }}
          >
            {copied ? "Copied" : "Copy draft"}
          </button>
        </div>
      </section>

      {notes.length > 0 && (
        <section style={panel}>
          <h2 style={h2}>Feedback on clarity and structure</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {notes.map((n) => (
              <div key={n.text} style={{ fontSize: 13.5, lineHeight: 1.55, color: n.tone === "ok" ? "#166534" : "#92400e", background: n.tone === "ok" ? "#f0fdf4" : "#fffbeb", borderRadius: 8, padding: "8px 10px" }}>
                {n.tone === "ok" ? "✓ " : "• "}{n.text}
              </div>
            ))}
          </div>
        </section>
      )}
      </div>
      </div>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 10px" };
const chip = (on: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: on ? "#fff" : "#334155",
  background: on ? ACCENT : "#fff",
  border: `1px solid ${on ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 13px",
  cursor: "pointer",
});
