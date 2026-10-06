"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import type { MockQuestion, MockTest } from "@/data/exams/mocks";

const ACCENT = "#2563eb";
const KEY = "onegrasp.exams.mocks.v1";

type Phase = "intro" | "running" | "done";
type Status = "correct" | "wrong" | "skipped";
export type ErrorTag = "concept" | "silly" | "misread" | "time";
const TAGS: Record<ErrorTag, string> = { concept: "Concept gap", silly: "Silly mistake", misread: "Misread the question", time: "Time pressure" };

export interface MockAttempt {
  id: string;
  mockId: string;
  examSlug: string;
  at: string; // ISO timestamp
  score: number;
  max: number;
  correct: number;
  wrong: number;
  skipped: number;
  negLost: number;
  secondsUsed: number;
  topicStats: Record<string, { attempted: number; correct: number; total: number }>;
  timePerQuestion: Record<string, number>;
  answers: Record<string, string>;
  tags: Record<string, ErrorTag>;
}

export function loadAttempts(): MockAttempt[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(v) ? (v as MockAttempt[]) : [];
  } catch {
    return [];
  }
}

function saveAttempts(list: MockAttempt[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(-60)));
  } catch {
    // Storage blocked: this attempt's analysis still shows, but is not kept.
  }
}

function isAnswered(v: string | undefined) {
  return v !== undefined && v.trim() !== "";
}

function gradeOne(q: MockQuestion, given: string | undefined): Status {
  if (!isAnswered(given)) return "skipped";
  if (q.type === "mcq") return Number(given) === q.answer ? "correct" : "wrong";
  const n = Number(String(given).trim());
  return Number.isFinite(n) && Math.abs(n - q.answer) < 1e-9 ? "correct" : "wrong";
}

function grade(mock: MockTest, answers: Record<string, string>, timePerQuestion: Record<string, number>, secondsUsed: number): MockAttempt {
  let score = 0;
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  let negLost = 0;
  const topicStats: MockAttempt["topicStats"] = {};
  for (const q of mock.questions) {
    const st = gradeOne(q, answers[q.id]);
    const t = (topicStats[q.topic] ||= { attempted: 0, correct: 0, total: 0 });
    t.total++;
    if (st === "correct") {
      correct++;
      t.attempted++;
      t.correct++;
      score += mock.marking.correct;
    } else if (st === "wrong") {
      wrong++;
      t.attempted++;
      const penalty = q.type === "tita" ? mock.marking.titaWrong ?? mock.marking.wrong : mock.marking.wrong;
      score += penalty;
      negLost += -penalty;
    } else skipped++;
  }
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mockId: mock.id,
    examSlug: mock.examSlug,
    at: new Date().toISOString(),
    score: Math.round(score * 100) / 100,
    max: mock.questions.length * mock.marking.correct,
    correct,
    wrong,
    skipped,
    negLost: Math.round(negLost * 100) / 100,
    secondsUsed,
    topicStats,
    timePerQuestion,
    answers,
    tags: {},
  };
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.max(0, s % 60)).padStart(2, "0")}`;

export function MockTestRunner({ mock }: { mock: MockTest }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(mock.minutes * 60);
  const [timePer, setTimePer] = useState<Record<string, number>>({});
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [attempt, setAttempt] = useState<MockAttempt | null>(null);
  const [history, setHistory] = useState<MockAttempt[]>([]);
  const indexRef = useRef(0);
  indexRef.current = index;

  useEffect(() => {
    setHistory(loadAttempts());
  }, []);

  const q = mock.questions[index];

  // Refs so the timer and finish() read the latest state without re-subscribing.
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;
  const remainingRef = useRef(remaining);
  remainingRef.current = remaining;
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const timePerRef = useRef(timePer);
  timePerRef.current = timePer;

  const finish = useCallback(() => {
    // Guarded by a ref so a double call (timer plus button) saves one attempt only.
    if (phaseRef.current !== "running") return;
    phaseRef.current = "done";
    const used = mock.minutes * 60 - remainingRef.current;
    const result = grade(mock, answersRef.current, timePerRef.current, used);
    const list = [...loadAttempts(), result];
    saveAttempts(list);
    setHistory(list);
    setAttempt(result);
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mock]);

  useEffect(() => {
    if (phase !== "running") return;
    const t = window.setInterval(() => {
      const qid = mock.questions[indexRef.current].id;
      setTimePer((cur) => ({ ...cur, [qid]: (cur[qid] ?? 0) + 1 }));
      setRemaining((r) => {
        if (r <= 1) {
          window.setTimeout(finish, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [phase, mock.questions, finish]);

  const go = (i: number) => {
    const next = Math.max(0, Math.min(mock.questions.length - 1, i));
    setIndex(next);
    setVisited((v) => new Set(v).add(mock.questions[next].id));
  };

  const start = () => {
    setAnswers({});
    setMarked(new Set());
    setVisited(new Set([mock.questions[0].id]));
    setIndex(0);
    setRemaining(mock.minutes * 60);
    setTimePer({});
    setAttempt(null);
    setConfirmSubmit(false);
    setPhase("running");
  };

  if (phase === "intro") {
    const past = history.filter((h) => h.mockId === mock.id);
    return (
      <section style={panel}>
        <h2 style={h2}>Before you start</h2>
        <p style={pText}>{mock.pattern}</p>
        <ul style={{ margin: "0 0 12px", paddingLeft: 18, fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
          <li>{mock.questions.length} questions · {mock.minutes} minutes · the test submits itself when time runs out.</li>
          <li>Use the palette to jump between questions and <b>Mark for review</b> to come back later.</li>
          <li>Answers and analysis are saved on this device only.</li>
        </ul>
        {past.length > 0 && <p style={{ ...pText, fontWeight: 700 }}>You have taken this set {past.length} time{past.length === 1 ? "" : "s"}. Best: {Math.max(...past.map((p) => p.score))} / {past[0].max}.</p>}
        <button onClick={start} style={primaryBtn}>Start the test</button>
        <p style={{ fontSize: 12, color: "#64748b", margin: "12px 0 0" }}>An original practice set written by OneGrasp. It is practice, not a prediction of your real score or rank.</p>
      </section>
    );
  }

  if (phase === "running") {
    const answeredCount = mock.questions.filter((x) => isAnswered(answers[x.id])).length;
    const passage = q.passageId ? mock.passages?.[q.passageId] : undefined;
    return (
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 14 }}>
        <div style={{ ...panel, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", position: "sticky", top: 8, zIndex: 2 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>Question {index + 1} of {mock.questions.length} · {q.section}</span>
          <span style={{ fontSize: 13, color: "#475569" }}>{answeredCount} answered</span>
          <span aria-live="polite" style={{ fontSize: 18, fontWeight: 900, fontVariantNumeric: "tabular-nums", color: remaining <= 60 ? "#b91c1c" : "#0f172a" }}>⏱ {mmss(remaining)}</span>
        </div>

        {passage && (
          <section style={{ ...panel, background: "#f8fafc" }}>
            <div style={{ fontSize: 12, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em" }}>{passage.title}</div>
            <p style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.7, margin: "6px 0 0", whiteSpace: "pre-wrap" }}>{passage.text}</p>
          </section>
        )}

        <section style={panel}>
          <p style={{ fontSize: 15, color: "#0f172a", lineHeight: 1.65, margin: "0 0 12px", whiteSpace: "pre-wrap", fontWeight: 600 }}>{q.text}</p>
          {q.type === "mcq" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="radiogroup" aria-label={`Options for question ${index + 1}`}>
              {q.options!.map((opt, i) => {
                const chosen = answers[q.id] === String(i);
                return (
                  <label key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, cursor: "pointer", border: `1.5px solid ${chosen ? ACCENT : "#e2e8f0"}`, background: chosen ? "#eff6ff" : "#fff", fontSize: 14, color: "#0f172a" }}>
                    <input type="radio" name={`q-${q.id}`} checked={chosen} onChange={() => setAnswers((a) => ({ ...a, [q.id]: String(i) }))} style={{ marginTop: 3, accentColor: ACCENT }} />
                    <span><b style={{ marginRight: 6 }}>{String.fromCharCode(65 + i)}.</b>{opt}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#475569", maxWidth: 260 }}>
              Type your answer (a number)
              <input inputMode="decimal" value={answers[q.id] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value.replace(/[^0-9.\-]/g, "") }))} style={{ padding: "10px 12px", fontSize: 16, border: "1px solid #cbd5e1", borderRadius: 9, color: "#0f172a", background: "#fff" }} />
            </label>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={() => go(index - 1)} disabled={index === 0} style={{ ...secondaryBtn, opacity: index === 0 ? 0.5 : 1 }}>← Previous</button>
            <button onClick={() => setAnswers((a) => { const n = { ...a }; delete n[q.id]; return n; })} style={secondaryBtn}>Clear response</button>
            <button
              onClick={() => {
                setMarked((m) => { const n = new Set(m); if (n.has(q.id)) n.delete(q.id); else n.add(q.id); return n; });
                if (index < mock.questions.length - 1) go(index + 1);
              }}
              style={{ ...secondaryBtn, borderColor: "#7c3aed", color: "#7c3aed" }}
            >
              {marked.has(q.id) ? "Unmark" : "Mark for review"} & next
            </button>
            {index < mock.questions.length - 1 ? (
              <button onClick={() => go(index + 1)} style={primaryBtn}>Save & next →</button>
            ) : (
              <button onClick={() => setConfirmSubmit(true)} style={primaryBtn}>Submit test</button>
            )}
          </div>
        </section>

        <section style={panel}>
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>Question palette</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {mock.questions.map((x, i) => {
              const ans = isAnswered(answers[x.id]);
              const mk = marked.has(x.id);
              const seen = visited.has(x.id);
              const bg = mk ? "#7c3aed" : ans ? "#16a34a" : seen ? "#fee2e2" : "#f1f5f9";
              const fg = mk || ans ? "#fff" : seen ? "#991b1b" : "#475569";
              return (
                <button key={x.id} onClick={() => go(i)} aria-label={`Question ${i + 1}${ans ? ", answered" : ""}${mk ? ", marked for review" : ""}`} style={{ width: 36, height: 36, borderRadius: 8, border: i === index ? "2px solid #0f172a" : "1px solid #e2e8f0", background: bg, color: fg, fontWeight: 800, fontSize: 13, cursor: "pointer", position: "relative" }}>
                  {i + 1}
                  {mk && ans && <span style={{ position: "absolute", right: 2, bottom: 1, fontSize: 9 }}>✓</span>}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10, fontSize: 11.5, color: "#475569" }}>
            <span><span style={{ color: "#16a34a" }}>■</span> Answered</span>
            <span><span style={{ color: "#7c3aed" }}>■</span> Marked for review</span>
            <span><span style={{ color: "#fca5a5" }}>■</span> Seen, not answered</span>
            <span><span style={{ color: "#cbd5e1" }}>■</span> Not visited</span>
          </div>
          <button onClick={() => setConfirmSubmit(true)} style={{ ...secondaryBtn, marginTop: 12 }}>Submit test</button>
        </section>

        {confirmSubmit && (
          <section style={{ ...panel, borderColor: "#f59e0b", background: "#fffbeb" }}>
            <p style={{ fontSize: 14, color: "#78350f", margin: "0 0 10px", fontWeight: 700 }}>
              Submit now? You have answered {answeredCount} of {mock.questions.length}{marked.size ? ` and marked ${marked.size} for review` : ""}. {mmss(remaining)} remain.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={finish} style={primaryBtn}>Yes, submit</button>
              <button onClick={() => setConfirmSubmit(false)} style={secondaryBtn}>Keep going</button>
            </div>
          </section>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------- Analysis
  if (!attempt) return null;
  return <MockAnalysis mock={mock} attempt={attempt} history={history} onHistory={setHistory} onRetake={start} />;
}

function MockAnalysis({ mock, attempt, history, onHistory, onRetake }: { mock: MockTest; attempt: MockAttempt; history: MockAttempt[]; onHistory: (h: MockAttempt[]) => void; onRetake: () => void }) {
  const [tags, setTags] = useState<Record<string, ErrorTag>>(attempt.tags);
  const examHistory = history.filter((h) => h.examSlug === mock.examSlug);
  const lastFive = examHistory.slice(-5);
  const attempted = attempt.correct + attempt.wrong;
  const accuracy = attempted ? Math.round((attempt.correct / attempted) * 100) : 0;
  const pct = Math.round((Math.max(0, attempt.score) / attempt.max) * 100);

  const times = mock.questions.map((q) => attempt.timePerQuestion[q.id] ?? 0);
  const answeredTimes = mock.questions.filter((q) => isAnswered(attempt.answers[q.id])).map((q) => attempt.timePerQuestion[q.id] ?? 0);
  const avg = answeredTimes.length ? answeredTimes.reduce((a, b) => a + b, 0) / answeredTimes.length : 0;
  const slowWrong = mock.questions.filter((q) => gradeOne(q, attempt.answers[q.id]) === "wrong" && (attempt.timePerQuestion[q.id] ?? 0) > Math.max(30, avg * 1.5));

  const topics = Object.entries(attempt.topicStats).map(([topic, s]) => ({ topic, ...s, acc: s.attempted ? s.correct / s.attempted : null }));
  const weakest = [...topics].filter((t) => t.acc !== null).sort((a, b) => (a.acc ?? 1) - (b.acc ?? 1))[0];

  const nextSteps: string[] = [];
  if (weakest && (weakest.acc ?? 1) < 1) nextSteps.push(`Revise ${weakest.topic} (${Math.round((weakest.acc ?? 0) * 100)}% accuracy in this test), then retry the questions you got wrong.`);
  else nextSteps.push("Every topic you attempted was correct. Raise the difficulty with an official past paper from the exam's website.");
  if (attempt.negLost > 0) nextSteps.push(`You lost ${attempt.negLost} mark${attempt.negLost === 1 ? "" : "s"} to negative marking. Answer only when you can rule out at least two options.`);
  else if (attempt.skipped > 0) nextSteps.push(`You skipped ${attempt.skipped} question${attempt.skipped === 1 ? "" : "s"}. Practise those topics for speed, and attempt questions where you can eliminate options.`);
  else nextSteps.push("No marks lost to negative marking. Keep the same discipline in full-length mocks.");
  if (slowWrong.length) nextSteps.push(`You spent a long time on ${slowWrong.length} question${slowWrong.length === 1 ? "" : "s"} and still got ${slowWrong.length === 1 ? "it" : "them"} wrong. Move on after about ${Math.round(Math.max(60, avg * 2))} seconds and come back if time allows.`);
  else nextSteps.push(`Your average was ${Math.round(avg)} seconds per answered question. Track it across mocks to see your speed improve.`);

  const tagCounts = examHistory.reduce<Record<ErrorTag, number>>((acc, h) => {
    for (const t of Object.values(h.id === attempt.id ? tags : h.tags)) acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, { concept: 0, silly: 0, misread: 0, time: 0 });

  const setTag = (qid: string, tag: ErrorTag) => {
    const next = { ...tags, [qid]: tag };
    setTags(next);
    const list = loadAttempts().map((h) => (h.id === attempt.id ? { ...h, tags: next } : h));
    saveAttempts(list);
    onHistory(list);
  };

  const allTopics = Array.from(new Set(lastFive.flatMap((h) => Object.keys(h.topicStats))));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <h2 style={h2}>Your result</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
          <Stat label="Score" value={`${attempt.score} / ${attempt.max}`} />
          <Stat label="Accuracy" value={`${accuracy}%`} note={`${attempt.correct} of ${attempted} attempted`} />
          <Stat label="Correct · wrong · skipped" value={`${attempt.correct} · ${attempt.wrong} · ${attempt.skipped}`} />
          <Stat label="Lost to negative marking" value={`${attempt.negLost}`} />
          <Stat label="Time used" value={mmss(attempt.secondsUsed)} note={`of ${mock.minutes}:00`} />
        </div>
        <p style={{ fontSize: 12, color: "#64748b", margin: "10px 0 0" }}>This score is from a short original practice set. It is not a prediction of your real score, percentile or rank.</p>
      </section>

      <section style={panel}>
        <h2 style={h2}>Next steps</h2>
        <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
          {nextSteps.map((s) => <li key={s} style={{ fontSize: 14, color: "#1e293b", lineHeight: 1.55 }}>{s}</li>)}
        </ol>
      </section>

      <section style={panel}>
        <h2 style={h2}>Topics in this test</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {topics.map((t) => (
            <div key={t.topic} style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ flex: "1 1 200px", minWidth: 0, fontSize: 13.5, color: "#0f172a" }}>{t.topic}</span>
              <span style={{ fontSize: 12.5, color: "#475569", fontVariantNumeric: "tabular-nums" }}>{t.correct}/{t.attempted} attempted · {t.total} asked</span>
              <span style={{ width: 90, height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: `${t.acc === null ? 0 : t.acc * 100}%`, background: t.acc === null ? "#cbd5e1" : t.acc >= 0.75 ? "#16a34a" : t.acc >= 0.5 ? "#f59e0b" : "#dc2626" }} />
              </span>
            </div>
          ))}
        </div>
      </section>

      {lastFive.length > 1 && (
        <section style={panel}>
          <h2 style={h2}>Weak-topic heatmap (your last {lastFive.length} tests for this exam)</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "separate", borderSpacing: 4, fontSize: 12.5 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", color: "#475569", fontWeight: 800, paddingRight: 8 }}>Topic</th>
                  {lastFive.map((h, i) => <th key={h.id} style={{ color: "#475569", fontWeight: 800 }}>Test {examHistory.length - lastFive.length + i + 1}</th>)}
                </tr>
              </thead>
              <tbody>
                {allTopics.map((topic) => (
                  <tr key={topic}>
                    <td style={{ color: "#0f172a", paddingRight: 8, whiteSpace: "nowrap" }}>{topic}</td>
                    {lastFive.map((h) => {
                      const s = h.topicStats[topic];
                      const acc = s && s.attempted ? s.correct / s.attempted : null;
                      const bg = acc === null ? "#f1f5f9" : acc >= 0.75 ? "#bbf7d0" : acc >= 0.5 ? "#fde68a" : "#fecaca";
                      return <td key={h.id} style={{ background: bg, borderRadius: 6, textAlign: "center", minWidth: 56, padding: "4px 6px", color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{acc === null ? "–" : `${Math.round(acc * 100)}%`}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {examHistory.length > 1 && <ProgressChart attempts={examHistory} />}

      <section style={panel}>
        <h2 style={h2}>Time per question</h2>
        <p style={pText}>Average {Math.round(avg)} seconds per answered question.</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90, overflowX: "auto", paddingBottom: 4 }}>
          {mock.questions.map((qq, i) => {
            const t = times[i];
            const st = gradeOne(qq, attempt.answers[qq.id]);
            const h = Math.max(4, Math.min(80, (t / Math.max(1, Math.max(...times))) * 80));
            return (
              <div key={qq.id} title={`Q${i + 1}: ${t}s, ${st}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, flex: "none" }}>
                <div style={{ width: 16, height: h, borderRadius: 4, background: st === "correct" ? "#16a34a" : st === "wrong" ? "#dc2626" : "#cbd5e1" }} />
                <span style={{ fontSize: 10, color: "#64748b" }}>{i + 1}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 11.5, color: "#475569", marginTop: 6 }}>
          <span><span style={{ color: "#16a34a" }}>■</span> Correct</span>
          <span><span style={{ color: "#dc2626" }}>■</span> Wrong</span>
          <span><span style={{ color: "#94a3b8" }}>■</span> Skipped</span>
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Error log</h2>
        {attempt.wrong === 0 ? (
          <p style={pText}>No wrong answers to log in this test.</p>
        ) : (
          <>
            <p style={pText}>Tag each mistake honestly. Patterns across tests show what to fix: knowledge, care, reading or speed.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {mock.questions.filter((qq) => gradeOne(qq, attempt.answers[qq.id]) === "wrong").map((qq) => (
                <div key={qq.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                  <span style={{ flex: "1 1 220px", minWidth: 0, fontSize: 13, color: "#0f172a" }}>Q{mock.questions.indexOf(qq) + 1} · {qq.topic}</span>
                  <select value={tags[qq.id] ?? ""} onChange={(e) => setTag(qq.id, e.target.value as ErrorTag)} style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", fontSize: 12.5 }}>
                    <option value="" disabled>Why was it wrong?</option>
                    {(Object.keys(TAGS) as ErrorTag[]).map((t) => <option key={t} value={t}>{TAGS[t]}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
        {Object.values(tagCounts).some((n) => n > 0) && (
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 10, fontSize: 12.5, color: "#334155" }}>
            {(Object.keys(TAGS) as ErrorTag[]).map((t) => <span key={t}>{TAGS[t]}: <b>{tagCounts[t]}</b></span>)}
            <span style={{ color: "#64748b" }}>(all your tests for this exam)</span>
          </div>
        )}
      </section>

      <section style={panel}>
        <h2 style={h2}>Review every question</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {mock.questions.map((qq, i) => {
            const st = gradeOne(qq, attempt.answers[qq.id]);
            const given = attempt.answers[qq.id];
            const givenText = !isAnswered(given) ? "Skipped" : qq.type === "mcq" ? `${String.fromCharCode(65 + Number(given))}. ${qq.options![Number(given)]}` : given;
            const correctText = qq.type === "mcq" ? `${String.fromCharCode(65 + qq.answer)}. ${qq.options![qq.answer]}` : String(qq.answer);
            return (
              <div key={qq.id} style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: st === "correct" ? "#166534" : st === "wrong" ? "#991b1b" : "#64748b" }}>
                  Q{i + 1} · {st === "correct" ? "Correct" : st === "wrong" ? "Wrong" : "Skipped"} · {qq.topic}
                </div>
                <p style={{ fontSize: 13.5, color: "#0f172a", margin: "4px 0", whiteSpace: "pre-wrap", lineHeight: 1.55 }}>{qq.text}</p>
                <div style={{ fontSize: 13, color: "#334155" }}>Your answer: <b>{givenText}</b></div>
                {st !== "correct" && <div style={{ fontSize: 13, color: "#166534" }}>Correct answer: <b>{correctText}</b></div>}
                <div style={{ fontSize: 13, color: "#475569", marginTop: 4, lineHeight: 1.55 }}>{qq.explanation}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={onRetake} style={primaryBtn}>Retake this set</button>
        <Link href="/account/exams/mocks" style={{ ...secondaryBtn, textDecoration: "none" }}>All practice tests</Link>
        <Link href={`/account/exams/${mock.examSlug}/plan`} style={{ ...secondaryBtn, textDecoration: "none" }}>Update my study plan</Link>
      </div>
    </div>
  );
}

function ProgressChart({ attempts }: { attempts: MockAttempt[] }) {
  const data = attempts.slice(-12).map((a) => Math.round((Math.max(0, a.score) / a.max) * 100));
  const W = 560;
  const H = 180;
  const pad = { l: 34, r: 12, t: 12, b: 26 };
  const x = (i: number) => pad.l + (data.length === 1 ? 0 : (i * (W - pad.l - pad.r)) / (data.length - 1));
  const y = (v: number) => pad.t + ((100 - v) * (H - pad.t - pad.b)) / 100;
  const target = 70;
  return (
    <section style={panel}>
      <h2 style={h2}>Your progress across practice tests</h2>
      <p style={pText}>Percentage scored in each test for this exam, oldest to newest. Watch the trend, not one bad day.</p>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, minWidth: 320 }} role="img" aria-label={`Scores over ${data.length} tests: ${data.join("%, ")}%`}>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={pad.l - 6} y={y(v) + 4} fontSize={10} textAnchor="end" fill="#64748b">{v}%</text>
            </g>
          ))}
          <line x1={pad.l} x2={W - pad.r} y1={y(target)} y2={y(target)} stroke="#16a34a" strokeDasharray="4 4" strokeWidth={1.5} />
          <text x={W - pad.r} y={y(target) - 4} fontSize={10} textAnchor="end" fill="#166534">Target {target}%</text>
          <polyline fill="none" stroke={ACCENT} strokeWidth={2.5} points={data.map((v, i) => `${x(i)},${y(v)}`).join(" ")} />
          {data.map((v, i) => (
            <g key={i}>
              <circle cx={x(i)} cy={y(v)} r={4} fill={ACCENT} />
              <text x={x(i)} y={H - 8} fontSize={10} textAnchor="middle" fill="#64748b">{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", background: "#f8fafc" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".04em" }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", marginTop: 2, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {note && <div style={{ fontSize: 11.5, color: "#64748b" }}>{note}</div>}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 8px" };
const primaryBtn: CSSProperties = { fontSize: 13.5, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" };
const secondaryBtn: CSSProperties = { fontSize: 13, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "9px 14px", cursor: "pointer", display: "inline-block" };

export const MOCK_ATTEMPTS_KEY = KEY;
export function useMockAttempts() {
  const [list, setList] = useState<MockAttempt[]>([]);
  useEffect(() => setList(loadAttempts()), []);
  return useMemo(() => list, [list]);
}
