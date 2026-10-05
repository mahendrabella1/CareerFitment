"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import type { LegalScenario } from "@/data/legal/scenarios";
import { legalGuideBySlug } from "@/data/legal/guides";

const ACCENT = "#6366f1";
const LETTERS = ["A", "B", "C", "D"];

/**
 * Projector view for teachers (plan section 7, "Schools mode"): show one
 * scenario large, count the class's votes by hand, then reveal the answer.
 * Nothing is saved - the vote counts live only in this tab.
 */
export function ClassroomScenario({ scenario, nextId }: { scenario: LegalScenario; nextId: string }) {
  const [votes, setVotes] = useState<number[]>(() => scenario.choices.map(() => 0));
  const [revealed, setRevealed] = useState(false);
  const total = votes.reduce((a, b) => a + b, 0);
  const guide = scenario.guideSlug ? legalGuideBySlug(scenario.guideSlug) : undefined;

  const bump = (i: number, delta: number) => setVotes((v) => v.map((n, j) => (j === i ? Math.max(0, n + delta) : n)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Link href="/account/legal/learn" style={{ fontSize: 14, fontWeight: 700, color: "#64748b", textDecoration: "none" }}>← Back to scenario cards</Link>
        <span style={{ fontSize: 13, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".06em" }}>Class discussion · {scenario.age}</span>
      </div>

      <h1 style={{ fontSize: "clamp(24px, 3.4vw, 40px)", fontWeight: 900, color: "#0f172a", lineHeight: 1.25, margin: 0 }}>{scenario.situation}</h1>
      <p style={{ fontSize: 17, color: "#475569", margin: 0 }}>What would you do? Vote by raising hands, then tap + to count each option.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {scenario.choices.map((c, i) => {
          const share = total ? Math.round((votes[i] / total) * 100) : 0;
          const style: CSSProperties = revealed
            ? c.best
              ? { ...option, borderColor: "#16a34a", background: "#f0fdf4" }
              : { ...option, opacity: 0.75 }
            : option;
          return (
            <div key={i} style={style}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{ flex: "none", width: 40, height: 40, borderRadius: 10, background: revealed && c.best ? "#16a34a" : ACCENT, color: "#fff", display: "grid", placeItems: "center", fontSize: 20, fontWeight: 900 }}>{LETTERS[i]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "clamp(17px, 2vw, 22px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.4 }}>{c.text}</div>
                  {revealed && <div style={{ fontSize: 16, color: "#334155", marginTop: 6, lineHeight: 1.5 }}>{c.best ? "Safest choice. " : ""}{c.why}</div>}
                  <div style={{ marginTop: 10, height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ width: `${share}%`, height: "100%", background: revealed && c.best ? "#16a34a" : ACCENT, transition: "width .2s" }} />
                  </div>
                </div>
                <div style={{ flex: "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <button onClick={() => bump(i, -1)} aria-label={`Remove a vote for ${LETTERS[i]}`} style={voteBtn}>−</button>
                  <span style={{ minWidth: 34, textAlign: "center", fontSize: 22, fontWeight: 900, color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{votes[i]}</span>
                  <button onClick={() => bump(i, 1)} aria-label={`Add a vote for ${LETTERS[i]}`} style={voteBtn}>+</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {!revealed ? (
          <button onClick={() => setRevealed(true)} style={primary}>Reveal the answer</button>
        ) : (
          <Link href={`/account/legal/learn/class/${nextId}`} style={{ ...primary, textDecoration: "none" }}>Next card →</Link>
        )}
        <button onClick={() => { setVotes(scenario.choices.map(() => 0)); setRevealed(false); }} style={secondary}>Reset votes</button>
      </div>

      {revealed && (
        <div style={{ background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 14, padding: "16px 18px", fontSize: 18, color: "#1e1b4b", lineHeight: 1.55 }}>
          <b>What to do:</b> {scenario.bestResponse}
          {guide && <div style={{ marginTop: 8, fontSize: 15 }}>Full guide: {guide.number}. {guide.title}</div>}
        </div>
      )}
    </div>
  );
}

const option: CSSProperties = { border: "2px solid #e2e8f0", borderRadius: 16, padding: "16px 18px", background: "#fff" };
const voteBtn: CSSProperties = { width: 38, height: 38, borderRadius: 10, border: "1px solid #cbd5e1", background: "#fff", fontSize: 20, fontWeight: 900, color: "#0f172a", cursor: "pointer" };
const primary: CSSProperties = { fontSize: 17, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 12, padding: "13px 20px", cursor: "pointer" };
const secondary: CSSProperties = { fontSize: 15, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, padding: "12px 18px", cursor: "pointer" };
