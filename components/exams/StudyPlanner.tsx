"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { ExamDef } from "@/data/exams/exams";
import type { ExamSyllabus } from "@/data/exams/syllabus";
import { buildIcsCalendar, downloadFile } from "@/lib/calendar/ics";

const ACCENT = "#2563eb";
const DAY = 86_400_000;

type Status = "not_started" | "learning" | "revised" | "confident";
const STATUS_META: Record<Status, { label: string; short: string; color: string; weight: number }> = {
  not_started: { label: "Not started", short: "Not started", color: "#94a3b8", weight: 0 },
  learning: { label: "Learning", short: "Learning", color: "#f59e0b", weight: 0.35 },
  revised: { label: "Revised", short: "Revised", color: "#3b82f6", weight: 0.75 },
  confident: { label: "Confident", short: "Confident", color: "#16a34a", weight: 1 },
};
const STATUSES: Status[] = ["not_started", "learning", "revised", "confident"];

interface Saved {
  statuses: Record<string, Status>;
  custom: string[];
  examDate: string;
  hoursPerWeek: number;
  revisionWeeks: number | null;
}

const keyFor = (slug: string) => `onegrasp.exams.plan.v1.${slug}`;

function load(slug: string): Saved | null {
  try {
    const raw = window.localStorage.getItem(keyFor(slug));
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}

function persist(slug: string, s: Saved) {
  try {
    window.localStorage.setItem(keyFor(slug), JSON.stringify(s));
  } catch {
    // Storage blocked: the plan works for this visit only.
  }
}

const isoToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const parseIso = (iso: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : null;
};
const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** The first future exam date in the exam's events, as a default for the planner. */
function defaultExamDate(exam: ExamDef): string {
  const today = isoToday();
  const next = exam.events.filter((e) => e.kind === "exam" && e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  return next?.date ?? "";
}

export function StudyPlanner({ exam, syllabus }: { exam: ExamDef; syllabus?: ExamSyllabus }) {
  const [saved, setSaved] = useState<Saved>({ statuses: {}, custom: [], examDate: "", hoursPerWeek: 12, revisionWeeks: null });
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const s = load(exam.slug);
    setSaved(s ?? { statuses: {}, custom: [], examDate: defaultExamDate(exam), hoursPerWeek: 12, revisionWeeks: null });
    setReady(true);
  }, [exam]);

  const update = (patch: Partial<Saved>) => {
    setSaved((cur) => {
      const next = { ...cur, ...patch };
      persist(exam.slug, next);
      return next;
    });
  };

  const sections = useMemo(() => {
    const base = (syllabus?.sections ?? []).map((s) => ({ name: s.name, units: s.units.map((u) => ({ key: `${s.name}::${u}`, name: u })) }));
    if (saved.custom.length) base.push({ name: "My own topics", units: saved.custom.map((u) => ({ key: `custom::${u}`, name: u })) });
    return base;
  }, [syllabus, saved.custom]);

  const allUnits = sections.flatMap((s) => s.units);
  const statusOf = (key: string): Status => saved.statuses[key] ?? "not_started";
  const progress = allUnits.length ? allUnits.reduce((sum, u) => sum + STATUS_META[statusOf(u.key)].weight, 0) / allUnits.length : 0;
  const counts = STATUSES.map((s) => ({ s, n: allUnits.filter((u) => statusOf(u.key) === s).length }));

  // ---- Backward plan, recomputed from today's date and the current statuses.
  const examDate = parseIso(saved.examDate);
  const today = parseIso(isoToday())!;
  const weeksLeft = examDate ? Math.max(0, Math.ceil((examDate.getTime() - today.getTime()) / (7 * DAY))) : 0;
  const revisionWeeks = saved.revisionWeeks ?? Math.min(4, Math.max(1, Math.floor(weeksLeft / 4)));
  const learningWeeks = Math.max(0, weeksLeft - revisionWeeks);
  // Finish what you started first, then new units, in syllabus order.
  const toLearn = [...allUnits.filter((u) => statusOf(u.key) === "learning"), ...allUnits.filter((u) => statusOf(u.key) === "not_started")];
  const perWeek = learningWeeks > 0 ? Math.ceil(toLearn.length / learningWeeks) : toLearn.length;
  const hoursPerUnit = toLearn.length ? (saved.hoursPerWeek * learningWeeks) / toLearn.length : null;
  const weeks: { start: Date; end: Date; units: string[]; phase: "learn" | "revise" }[] = [];
  if (examDate && weeksLeft > 0) {
    for (let i = 0; i < weeksLeft; i++) {
      const start = new Date(today.getTime() + i * 7 * DAY);
      const end = new Date(Math.min(start.getTime() + 6 * DAY, examDate.getTime()));
      const phase: "learn" | "revise" = i < learningWeeks ? "learn" : "revise";
      const units = phase === "learn" ? toLearn.slice(i * perWeek, (i + 1) * perWeek).map((u) => u.name) : [];
      weeks.push({ start, end, units, phase });
    }
  }
  const mockAdvice = weeksLeft > 16 ? "One sectional or topic test a week" : weeksLeft > 4 ? "One full mock a week, with a full review" : "Two full mocks a week, with a full review";

  const addCalendar = () => {
    if (!examDate) return;
    downloadFile(`${exam.slug}-exam-date.ics`, buildIcsCalendar([{ title: `${exam.name} exam`, description: `Check your admit card, reporting time and documents. Official site: ${exam.officialUrl}`, date: examDate, url: exam.officialUrl, remindDaysBefore: [30, 7, 3, 1] }], exam.name));
  };

  if (!ready) return <p style={{ fontSize: 14, color: "#64748b" }}>Loading your plan…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <label style={label}>
            Exam date
            <input type="date" value={saved.examDate} onChange={(e) => update({ examDate: e.target.value })} style={input} />
          </label>
          <label style={label}>
            Study hours a week
            <input type="number" min={1} max={80} value={saved.hoursPerWeek} onChange={(e) => update({ hoursPerWeek: Math.max(1, Math.min(80, Number(e.target.value) || 1)) })} style={input} />
          </label>
          <label style={label}>
            Revision weeks at the end
            <input type="number" min={0} max={26} value={saved.revisionWeeks ?? revisionWeeks} onChange={(e) => update({ revisionWeeks: Math.max(0, Math.min(26, Number(e.target.value) || 0)) })} style={input} />
          </label>
        </div>
        {!saved.examDate && <p style={{ ...pText, marginTop: 10, color: "#b45309" }}>No confirmed exam date yet for this cycle. Enter the date you are aiming for; you can change it when the official date is out.</p>}
        {examDate && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginTop: 12 }}>
            <span style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 800 }}>{weeksLeft} week{weeksLeft === 1 ? "" : "s"} to go</span>
            <button onClick={addCalendar} style={secondaryBtn}>Add the exam date to my calendar</button>
          </div>
        )}
      </section>

      <section style={panel}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
          <h2 style={h2}>Syllabus progress</h2>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{Math.round(progress * 100)}%</span>
        </div>
        <div style={{ height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 6 }}>
          <div style={{ width: `${progress * 100}%`, height: "100%", background: ACCENT }} />
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 8 }}>
          {counts.map(({ s, n }) => (
            <span key={s} style={{ fontSize: 12.5, color: "#475569" }}>
              <span style={{ color: STATUS_META[s].color, fontWeight: 900 }}>●</span> {STATUS_META[s].label}: <b>{n}</b>
            </span>
          ))}
        </div>
        {syllabus && (
          <p style={{ ...pText, marginTop: 10 }}>
            {syllabus.note}{" "}
            <a href={syllabus.source.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>{syllabus.official ? "Official syllabus" : "Source"}: {syllabus.source.label} ↗</a>
          </p>
        )}
        {!syllabus && <p style={{ ...pText, marginTop: 10 }}>Add the units from the official syllabus on <a href={exam.officialUrl} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>{exam.officialUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗</a> as your own topics below.</p>}
      </section>

      {sections.map((sec) => (
        <section key={sec.name} style={panel}>
          <h2 style={h2}>{sec.name}</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sec.units.map((u) => {
              const st = statusOf(u.key);
              return (
                <div key={u.key} style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                  <span style={{ fontSize: 13.5, color: "#0f172a", flex: "1 1 220px", minWidth: 0 }}>{u.name}</span>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }} role="group" aria-label={`Status of ${u.name}`}>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => update({ statuses: { ...saved.statuses, [u.key]: s } })}
                        aria-pressed={st === s}
                        style={{
                          fontSize: 11.5,
                          fontWeight: 800,
                          padding: "4px 8px",
                          borderRadius: 999,
                          cursor: "pointer",
                          border: `1px solid ${st === s ? STATUS_META[s].color : "#e2e8f0"}`,
                          background: st === s ? STATUS_META[s].color : "#fff",
                          color: st === s ? "#fff" : "#475569",
                        }}
                      >
                        {STATUS_META[s].short}
                      </button>
                    ))}
                    {u.key.startsWith("custom::") && (
                      <button onClick={() => update({ custom: saved.custom.filter((c) => `custom::${c}` !== u.key) })} style={{ fontSize: 11.5, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section style={panel}>
        <h2 style={h2}>Add your own topic</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="e.g. a unit from your subject paper's syllabus" style={{ ...input, flex: 1, minWidth: 200 }} />
          <button
            onClick={() => {
              const v = draft.trim();
              if (!v || saved.custom.includes(v)) return;
              update({ custom: [...saved.custom, v] });
              setDraft("");
            }}
            style={primaryBtn}
          >
            Add
          </button>
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Your week-by-week plan</h2>
        {!examDate ? (
          <p style={pText}>Enter an exam date above to build the plan.</p>
        ) : weeksLeft === 0 ? (
          <p style={pText}>The exam date has arrived or passed. Update the date for your next attempt.</p>
        ) : allUnits.length === 0 ? (
          <p style={pText}>Add your topics above to build the plan.</p>
        ) : (
          <>
            <p style={pText}>
              {toLearn.length} unit{toLearn.length === 1 ? "" : "s"} left to learn over {learningWeeks} week{learningWeeks === 1 ? "" : "s"}: about <b>{perWeek} a week</b>
              {hoursPerUnit !== null && <>, roughly <b>{hoursPerUnit.toFixed(1)} hours per unit</b> at {saved.hoursPerWeek} hours a week</>}. The last {revisionWeeks} week{revisionWeeks === 1 ? "" : "s"} are for revision and mocks. Mock tests now: <b>{mockAdvice}</b>.
            </p>
            {hoursPerUnit !== null && hoursPerUnit < 3 && toLearn.length > 0 && (
              <p style={{ ...pText, color: "#b45309", fontWeight: 700 }}>This is tight. Add study hours, cut revision weeks slightly, or speak to a teacher about which units matter most.</p>
            )}
            {learningWeeks === 0 && toLearn.length > 0 && (
              <p style={{ ...pText, color: "#b45309", fontWeight: 700 }}>No learning weeks are left before revision. Focus on the units you are closest to finishing, and practise past papers.</p>
            )}
            <p style={{ ...pText, fontSize: 12.5 }}>The plan updates itself: mark units as you go, and if you fall behind, the weekly target rises.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
              {weeks.map((w, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                  <span style={{ flex: "none", width: 112, fontSize: 12.5, fontWeight: 800, color: w.phase === "revise" ? "#7c3aed" : "#0f172a", fontVariantNumeric: "tabular-nums" }}>
                    Week {i + 1} · {fmt(w.start)}–{fmt(w.end)}
                  </span>
                  <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5, minWidth: 0 }}>
                    {w.phase === "revise" ? "Revision, past papers and full mocks" : w.units.length ? w.units.join("; ") : "Catch-up and practice questions"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        Your plan is saved on this device only. <Link href="/account/exams/mocks" style={{ color: ACCENT, fontWeight: 800 }}>Take a practice mock →</Link>
      </p>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
const primaryBtn: CSSProperties = { fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 9, padding: "9px 14px", cursor: "pointer" };
const secondaryBtn: CSSProperties = { fontSize: 12.5, fontWeight: 800, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 9, padding: "7px 12px", cursor: "pointer" };
