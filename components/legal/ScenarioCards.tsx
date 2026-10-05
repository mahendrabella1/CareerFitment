"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { LEGAL_SCENARIOS, type LegalScenario, type ScenarioAge } from "@/data/legal/scenarios";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { LEGAL_GUIDES } from "@/data/legal/guides";

const ACCENT = "#6366f1";
const KEY = "onegrasp.legal.scenarios.v1";
const AGES: ("All" | ScenarioAge)[] = ["All", "Class 6 to 8", "Class 9 to 12", "College", "Working", "60 and over"];

/** Rights badges (plan section 7): finish every card in a life area to earn its badge. */
const BADGES: { area: string; name: string }[] = [
  { area: "School and childhood", name: "School Safe" },
  { area: "Online and digital life", name: "Cyber Safe" },
  { area: "Money, shopping and housing", name: "Consumer Smart" },
  { area: "Work", name: "Work Ready" },
  { area: "Family, home and personal safety", name: "Family Aware" },
  { area: "Police, courts and government", name: "Rights Aware" },
];

function scenarioArea(s: LegalScenario): string | undefined {
  return LEGAL_GUIDES.find((g) => g.slug === s.guideSlug)?.area;
}

function loadDone(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveDone(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage blocked: progress lasts for this visit only.
  }
}

export function ScenarioCards() {
  const [filter, setFilter] = useState<"All" | ScenarioAge>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    setDone(loadDone());
  }, []);

  const visible = LEGAL_SCENARIOS.filter((s) => filter === "All" || s.age === filter || s.age === "Everyone");
  const active = LEGAL_SCENARIOS.find((s) => s.id === openId) ?? null;

  const choose = (scenario: LegalScenario, index: number) => {
    if (answers[scenario.id] !== undefined) return;
    setAnswers({ ...answers, [scenario.id]: index });
    if (!done.includes(scenario.id)) {
      const next = [...done, scenario.id];
      setDone(next);
      saveDone(next);
    }
  };

  const completedInView = visible.filter((s) => done.includes(s.id)).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: 0 }}>
        Each card describes a real situation. Choose what you would do. You will see which choice is safest, why, and where to get help. Practise these now, so you are not learning them in a crisis.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {AGES.map((a) => (
          <button key={a} onClick={() => setFilter(a)} style={chip(filter === a)}>{a}</button>
        ))}
      </div>

      <div style={{ fontSize: 13, color: "#64748b" }}>
        {completedInView} of {visible.length} scenarios completed in this view. Only which cards you finished is kept on this device, never your choices.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {BADGES.map((b) => {
          const inArea = LEGAL_SCENARIOS.filter((s) => scenarioArea(s) === b.area);
          if (inArea.length === 0) return null;
          const finished = inArea.filter((s) => done.includes(s.id)).length;
          const earned = finished === inArea.length;
          return (
            <span
              key={b.name}
              title={earned ? "Badge earned" : `${finished} of ${inArea.length} cards done`}
              style={{
                fontSize: 12,
                fontWeight: 800,
                borderRadius: 999,
                padding: "6px 11px",
                color: earned ? "#14532d" : "#64748b",
                background: earned ? "#dcfce7" : "#f8fafc",
                border: `1px solid ${earned ? "#86efac" : "#e2e8f0"}`,
              }}
            >
              {earned ? "🏅 " : ""}{b.name} · {finished}/{inArea.length}
            </span>
          );
        })}
      </div>

      {!active && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {visible.map((s) => (
            <button key={s.id} onClick={() => setOpenId(s.id)} style={card(done.includes(s.id))}>
              <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>{s.age}</div>
              <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", lineHeight: 1.45, marginTop: 6, textAlign: "left" }}>{s.situation}</div>
              <div style={{ fontSize: 12, color: done.includes(s.id) ? "#166534" : "#64748b", marginTop: 10, fontWeight: 700, textAlign: "left" }}>
                {done.includes(s.id) ? "Completed ✓" : "Open scenario →"}
              </div>
            </button>
          ))}
        </div>
      )}

      {active && (
        <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px 20px 18px" }}>
          <button onClick={() => setOpenId(null)} style={backButton}>← All scenarios</button>
          <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em", marginTop: 10 }}>{active.age}</div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "6px 0 14px", lineHeight: 1.4 }}>{active.situation}</h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {active.choices.map((c, i) => {
              const picked = answers[active.id] === i;
              const answered = answers[active.id] !== undefined;
              const style = !answered ? choiceBase : picked && c.best ? choiceBest : picked && !c.best ? choiceWrong : c.best && answered ? choiceBest : choiceBase;
              return (
                <button key={i} onClick={() => choose(active, i)} disabled={answered} style={style}>
                  {c.text}
                </button>
              );
            })}
          </div>

          {answers[active.id] !== undefined && (
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                const picked = active.choices[answers[active.id]];
                return (
                  <div style={{ fontSize: 14, lineHeight: 1.6, color: picked.best ? "#166534" : "#991b1b", fontWeight: 700 }}>
                    {picked.best ? "That is the safest choice." : "That is not the safest choice."} <span style={{ fontWeight: 500, color: "#334155" }}>{picked.why}</span>
                  </div>
                );
              })()}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#1e293b", lineHeight: 1.6 }}>
                <b>What to do:</b> {active.bestResponse}
              </div>
              <HelpLinks helpSlugs={active.helpSlugs} />
              {active.guideSlug && LEGAL_GUIDES.some((g) => g.slug === active.guideSlug) && (
                <Link href={`/account/legal/guides/${active.guideSlug}`} style={{ fontSize: 13.5, fontWeight: 800, color: ACCENT }}>Read the full guide →</Link>
              )}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <button onClick={() => setOpenId(nextId(active.id, visible))} style={nextButton}>Next scenario →</button>
                <Link href={`/account/legal/learn/class/${active.id}`} style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Use in class (projector view)</Link>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function nextId(current: string, list: LegalScenario[]) {
  const i = list.findIndex((s) => s.id === current);
  return list[(i + 1) % list.length].id;
}

function HelpLinks({ helpSlugs }: { helpSlugs: string[] }) {
  const contacts = helpSlugs.map((slug) => HELP_CONTACTS.find((c) => c.slug === slug)).filter((c): c is (typeof HELP_CONTACTS)[number] => Boolean(c));
  if (contacts.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {contacts.map((c) => (
        <span key={c.slug} style={{ fontSize: 13, fontWeight: 800, color: "#1e1b4b", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10, padding: "7px 11px" }}>
          {c.name}: {c.number ?? (c.url ? <a href={c.url} target="_blank" rel="noreferrer" style={{ color: "#1e1b4b" }}>website ↗</a> : null)}
        </span>
      ))}
    </div>
  );
}

const chip = (active: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: active ? "#fff" : "#334155",
  background: active ? ACCENT : "#fff",
  border: `1px solid ${active ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 13px",
  cursor: "pointer",
});

const card = (completed: boolean): CSSProperties => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  textAlign: "left",
  background: "#fff",
  border: `1px solid ${completed ? "#86efac" : "#e2e8f0"}`,
  borderRadius: 14,
  padding: "16px 16px 14px",
  cursor: "pointer",
});

const backButton: CSSProperties = { fontSize: 13, fontWeight: 700, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 };

const choiceBase: CSSProperties = {
  textAlign: "left",
  fontSize: 14,
  fontWeight: 700,
  color: "#0f172a",
  background: "#fff",
  border: "1px solid #cbd5e1",
  borderRadius: 12,
  padding: "12px 14px",
  cursor: "pointer",
  lineHeight: 1.5,
};
const choiceBest: CSSProperties = { ...choiceBase, border: "2px solid #16a34a", background: "#f0fdf4" };
const choiceWrong: CSSProperties = { ...choiceBase, border: "2px solid #dc2626", background: "#fef2f2" };

const nextButton: CSSProperties = { fontSize: 13.5, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "9px 14px", cursor: "pointer" };
