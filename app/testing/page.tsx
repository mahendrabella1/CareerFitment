"use client";

/**
 * /testing — Personality Assessment (local-only, no auth/db)
 * Flow: enter name + pick length (10/15/20) -> the SYSTEM silently draws a
 * random set (never shown) -> exam-style one-question-at-a-time interface ->
 * single-page professional Personality Evaluation Report.
 */

import { useMemo, useState } from "react";
import bank from "@/data/personality-sets.json";
import {
  evaluate,
  bigFiveDescriptor,
  TEMPERAMENTS,
  type Format,
  type Question,
  type AnswerMap,
  type PersonalityReport,
  type BigFiveTrait,
} from "@/lib/engine/personalityScoring";

const BANK = bank as Record<Format, Record<string, Question[]>>;
const FORMATS: Format[] = ["10", "15", "20"];
const SET_NAMES = Array.from({ length: 10 }, (_, i) => `Set ${i + 1}`);

type Stage = "start" | "exam" | "report";

const SCALE_LABELS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];
const BIG_FIVE_ORDER: BigFiveTrait[] = [
  "Extraversion",
  "Neuroticism",
  "Openness",
  "Conscientiousness",
  "Agreeableness",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick a set for this user WITHOUT repeating until all 10 have been used.
 * Each device keeps its own shuffled queue in localStorage, so repeat attempts
 * cycle through every set before any repeats, and different devices start from
 * different shuffles. Falls back to plain random if storage is unavailable.
 */
function nextSet(format: Format): string {
  const key = `pa_setqueue_${format}`;
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      let queue: string[] = JSON.parse(localStorage.getItem(key) || "null");
      if (!Array.isArray(queue) || queue.length === 0) {
        queue = shuffle(SET_NAMES);
      }
      const pick = queue.shift() as string;
      localStorage.setItem(key, JSON.stringify(queue));
      return pick;
    }
  } catch {
    /* ignore storage errors and fall through */
  }
  return SET_NAMES[Math.floor(Math.random() * SET_NAMES.length)];
}

export default function TestingPage() {
  const [stage, setStage] = useState<Stage>("start");
  const [name, setName] = useState("");
  const [format, setFormat] = useState<Format>("20");
  const [activeSet, setActiveSet] = useState<string>("Set 1"); // internal only, never shown
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [current, setCurrent] = useState(0);
  const [report, setReport] = useState<PersonalityReport | null>(null);

  const questions: Question[] = useMemo(
    () => BANK[format]?.[activeSet] ?? [],
    [format, activeSet]
  );

  function begin(f: Format) {
    setFormat(f);
    setActiveSet(nextSet(f));
    setAnswers({});
    setCurrent(0);
    setReport(null);
    setStage("exam");
  }

  function answer(qNum: string, value: string) {
    setAnswers((prev) => ({ ...prev, [qNum]: value }));
  }

  function submit() {
    setReport(evaluate(format, activeSet, questions, answers));
    setStage("report");
  }

  return (
    <div style={S.page}>
      {stage === "start" && (
        <StartScreen name={name} onName={setName} onBegin={begin} />
      )}
      {stage === "exam" && (
        <ExamScreen
          candidate={name.trim() || "Candidate"}
          questions={questions}
          answers={answers}
          current={current}
          setCurrent={setCurrent}
          onAnswer={answer}
          onSubmit={submit}
          onQuit={() => setStage("start")}
        />
      )}
      {stage === "report" && report && (
        <ReportScreen
          candidate={name.trim() || "Candidate"}
          report={report}
          onRetake={() => begin(format)}
          onHome={() => setStage("start")}
        />
      )}
    </div>
  );
}

/* ------------------------------ Start ----------------------------------- */
function StartScreen({
  name,
  onName,
  onBegin,
}: {
  name: string;
  onName: (v: string) => void;
  onBegin: (f: Format) => void;
}) {
  return (
    <div style={S.centerWrap}>
      <div style={S.startCard}>
        <div style={S.brandRow}>
          <div style={S.brandDot} />
          <span style={S.brandText}>OneGrasp Assessments</span>
        </div>
        <h1 style={S.startTitle}>Personality &amp; Temperament Test</h1>
        <p style={S.startSub}>
          A short, research-based questionnaire that maps your Big Five dimensions and
          Four Temperaments. The system selects your question set automatically.
        </p>

        <label style={S.fieldLabel}>Your name</label>
        <input
          style={S.input}
          placeholder="Enter your name"
          value={name}
          onChange={(e) => onName(e.target.value)}
        />

        <label style={{ ...S.fieldLabel, marginTop: 18 }}>Choose test length</label>
        <div style={S.lengthGrid}>
          {FORMATS.map((f) => {
            const mins = f === "10" ? "3–4" : f === "15" ? "5–6" : "7–8";
            return (
              <button key={f} style={S.lengthCard} onClick={() => onBegin(f)}>
                <div style={S.lengthNum}>{f}</div>
                <div style={S.lengthLabel}>Questions</div>
                <div style={S.lengthMeta}>~{mins} min</div>
              </button>
            );
          })}
        </div>
        <p style={S.finePrint}>No login required · your answers stay on this device.</p>
      </div>
    </div>
  );
}

/* ------------------------------ Exam ------------------------------------ */
function ExamScreen({
  candidate,
  questions,
  answers,
  current,
  setCurrent,
  onAnswer,
  onSubmit,
  onQuit,
}: {
  candidate: string;
  questions: Question[];
  answers: AnswerMap;
  current: number;
  setCurrent: (n: number) => void;
  onAnswer: (q: string, v: string) => void;
  onSubmit: () => void;
  onQuit: () => void;
}) {
  const total = questions.length;
  const q = questions[current];
  const chosen = answers[q.questionNumber] ?? "";
  const answeredCount = questions.filter((x) => (answers[x.questionNumber] ?? "") !== "").length;
  const isLast = current === total - 1;
  const pct = Math.round((answeredCount / total) * 100);

  const options: { value: string; label: string }[] =
    q.inputType === "scale"
      ? [1, 2, 3, 4, 5].map((v) => ({ value: String(v), label: `${v}  —  ${SCALE_LABELS[v - 1]}` }))
      : [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" },
        ];

  return (
    <div style={S.examWrap}>
      {/* Header bar */}
      <div style={S.examHeader}>
        <div style={S.examHeaderInner}>
          <div>
            <div style={S.examTitle}>Personality Assessment</div>
            <div style={S.examName}>Name: {candidate}</div>
          </div>
          <div style={S.examCounter}>
            <div style={S.examCounterNum}>{current + 1} / {total}</div>
            <div style={S.examCounterLabel}>Question</div>
          </div>
          <div style={S.examProgressCol}>
            <div style={S.examProgressText}>{answeredCount} answered</div>
            <div style={S.examProgressBar}>
              <div style={{ ...S.examProgressFill, width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Question body */}
      <div style={S.examBody}>
        <div style={S.qLabel}>Question {current + 1}</div>
        <div style={S.qText}>{q.question}</div>
        <div style={S.qDivider} />
        <div style={S.aLabel}>Answer {current + 1}</div>

        <div style={S.optionList}>
          {options.map((opt) => {
            const selected = chosen === opt.value;
            return (
              <button
                key={opt.value}
                style={{ ...S.optionRow, ...(selected ? S.optionRowOn : {}) }}
                onClick={() => onAnswer(q.questionNumber, opt.value)}
              >
                <span style={{ ...S.radio, ...(selected ? S.radioOn : {}) }}>
                  {selected && <span style={S.radioDot} />}
                </span>
                <span style={{ ...S.optionText, ...(selected ? S.optionTextOn : {}) }}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer nav */}
      <div style={S.examFooter}>
        <button style={S.quitBtn} onClick={onQuit}>Exit</button>
        <div style={S.footerCenter}>
          <button
            style={{ ...S.navBtn, ...S.prevBtn, ...(current === 0 ? S.navDisabled : {}) }}
            disabled={current === 0}
            onClick={() => setCurrent(current - 1)}
          >
            Previous
          </button>
          {isLast ? (
            <button
              style={{ ...S.navBtn, ...S.submitBtn, ...(chosen ? {} : S.navDisabled) }}
              disabled={!chosen}
              onClick={onSubmit}
            >
              Submit Test
            </button>
          ) : (
            <button
              style={{ ...S.navBtn, ...S.nextBtn, ...(chosen ? {} : S.navDisabled) }}
              disabled={!chosen}
              onClick={() => setCurrent(current + 1)}
            >
              Next
            </button>
          )}
        </div>
        <div style={{ width: 60 }} />
      </div>
    </div>
  );
}

/* ------------------------------ Report ---------------------------------- */
function ReportScreen({
  candidate,
  report,
  onRetake,
  onHome,
}: {
  candidate: string;
  report: PersonalityReport;
  onRetake: () => void;
  onHome: () => void;
}) {
  const { validity, bigFive, temperaments, dominantTemperament } = report;
  const maxTemp = Math.max(...TEMPERAMENTS.map((t) => temperaments[t].score));

  /** Export the report as a PDF via the browser's print-to-PDF (no deps). */
  function downloadPdf() {
    const prev = document.title;
    const safe = (candidate || "Candidate").replace(/[^\w-]+/g, "_");
    document.title = `Personality-Report-${safe}`;
    const restore = () => {
      document.title = prev;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  return (
    <div style={S.reportWrap} className="pa-report">
      {/* Print-only stylesheet: renders just the report cleanly as a PDF. */}
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      {/* Banner */}
      <div style={S.reportBanner} className="pa-banner">
        <div style={S.reportBannerInner}>
          <div>
            <div style={S.reportKicker}>Personality Evaluation Report</div>
            <div style={S.reportName}>{candidate}</div>
          </div>
          <div style={S.reportMeta}>
            {report.format}-question assessment · {report.answered}/{report.total} answered
          </div>
        </div>
      </div>

      <div style={S.reportBody}>
        {/* Module 1 — Validity */}
        <section style={S.card} className="pa-card">
          <div style={S.cardTitle}><span style={S.cardNum}>1</span> Test Validity &amp; Reliability</div>
          {validity.itemCount > 0 ? (
            <>
              <div style={S.kvGrid}>
                <div style={S.kv}>
                  <div style={S.kvLabel}>Data Status</div>
                  <div>
                    <span style={{ ...S.pill, ...(validity.isValid ? S.pillOk : S.pillBad) }}>
                      {validity.isValid ? "Valid" : "Potentially Biased"}
                    </span>
                  </div>
                </div>
                <div style={S.kv}>
                  <div style={S.kvLabel}>Raw Validity / Lie Score</div>
                  <div style={S.kvBig}>{validity.scaleSum} <span style={S.kvOf}>/ {validity.scaleMax}</span></div>
                  <div style={S.kvHint}>flag threshold ≥ {validity.threshold}</div>
                </div>
              </div>
              <div style={validity.isValid ? S.noteOk : S.noteBad}>
                {validity.isValid
                  ? "The data is clean. Responses show a low probability of social desirability bias — the answers appear honest rather than an attempt to look perfect."
                  : "High probability of social desirability bias (character over-compliance). Interpret the scores below with caution."}
              </div>
            </>
          ) : (
            <div style={S.muted}>
              No validity scale in the {report.format}-question format — bias check not applicable.
            </div>
          )}
        </section>

        {/* Module 2 — Four Temperaments */}
        <section style={S.card} className="pa-card">
          <div style={S.cardTitle}><span style={S.cardNum}>2</span> Four Temperaments Breakdown</div>
          <p style={S.cardSub}>Absolute points scored for each biological disposition.</p>
          {TEMPERAMENTS.map((t) => {
            const sm = temperaments[t];
            const highlight = sm.score === maxTemp && maxTemp > 0;
            return (
              <div key={t} style={S.barRow}>
                <span style={{ ...S.barName, fontWeight: highlight ? 800 : 600, color: highlight ? "#312e81" : "#334155" }}>{t}</span>
                <div style={S.barTrack}>
                  <div style={{ ...S.barFill, width: `${sm.max ? (sm.score / sm.max) * 100 : 0}%`, background: highlight ? "#4f46e5" : "#cbd5e1" }} />
                </div>
                <code style={S.barVal}>{sm.score} / {sm.max}</code>
              </div>
            );
          })}
          <div style={S.dominantBox}>
            Dominant Temperament: <b>{dominantTemperament.dominant}</b>
            {dominantTemperament.isTie && <span style={S.tieTag}> — joint (tie)</span>}
          </div>
        </section>

        {/* Module 3 — Big Five */}
        <section style={S.card} className="pa-card">
          <div style={S.cardTitle}><span style={S.cardNum}>3</span> Big Five Mental Dimensions</div>
          <p style={S.cardSub}>How you structure tasks, handle stress, and manage social energy.</p>
          {BIG_FIVE_ORDER.filter((t) => bigFive[t].max > 0).map((t) => {
            const sm = bigFive[t];
            return (
              <div key={t} style={S.b5Row}>
                <div style={S.b5Top}>
                  <span style={S.b5Name}>{t}</span>
                  <code style={S.barVal}>{sm.score} / {sm.max}</code>
                </div>
                <div style={S.b5Desc}>{bigFiveDescriptor(t, sm)}</div>
              </div>
            );
          })}
        </section>

        <div style={S.reportActions} className="no-print">
          <button style={S.secondaryBtn} onClick={onHome}>Home</button>
          <button style={S.secondaryBtn} onClick={onRetake}>Take Again</button>
          <button style={S.primaryBtn} onClick={downloadPdf}>⬇ Download PDF</button>
        </div>
        <p style={S.printHint} className="no-print">
          Tip: in the print dialog choose “Save as PDF”. The report fits on a single page.
        </p>
      </div>
    </div>
  );
}

/* ---- Print stylesheet: turns the report screen into a clean PDF -------- */
const PRINT_CSS = `
@media print {
  @page { size: A4; margin: 12mm; }
  html, body { background: #fff !important; }
  /* Hide everything except the report while printing */
  body * { visibility: hidden !important; }
  .pa-report, .pa-report * { visibility: visible !important; }
  .pa-report { position: absolute; inset: 0; background: #fff !important; }
  .no-print { display: none !important; }
  .pa-banner { border-radius: 0 !important; margin: -12mm -12mm 8mm !important; }
  .pa-card {
    break-inside: avoid;
    page-break-inside: avoid;
    box-shadow: none !important;
    border: 1px solid #e2e8f0 !important;
    margin-bottom: 10px !important;
  }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}
`;

/* ------------------------------- Styles --------------------------------- */
const BLUE = "#3b4a9c";
const ACCENT = "#4a90d9";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },

  // Start
  centerWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  startCard: { width: "100%", maxWidth: 520, background: "#fff", borderRadius: 16, padding: "36px 34px", boxShadow: "0 10px 40px rgba(30,41,59,.12)" },
  brandRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 18 },
  brandDot: { width: 12, height: 12, borderRadius: 4, background: BLUE },
  brandText: { fontSize: 13, fontWeight: 700, color: BLUE, letterSpacing: .3 },
  startTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 8px", color: "#0f172a" },
  startSub: { fontSize: 14, color: "#64748b", lineHeight: 1.55, margin: "0 0 24px" },
  fieldLabel: { display: "block", fontSize: 12.5, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: .4, marginBottom: 8 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 15, outline: "none", boxSizing: "border-box" },
  lengthGrid: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  lengthCard: { cursor: "pointer", border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 12, padding: "20px 10px", textAlign: "center", transition: "all .15s" },
  lengthNum: { fontSize: 34, fontWeight: 800, color: BLUE, lineHeight: 1 },
  lengthLabel: { fontSize: 12, fontWeight: 600, color: "#334155", marginTop: 4 },
  lengthMeta: { fontSize: 11, color: "#94a3b8", marginTop: 6 },
  finePrint: { fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20, marginBottom: 0 },

  // Exam
  examWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", background: "#fff" },
  examHeader: { background: BLUE, color: "#fff" },
  examHeaderInner: { maxWidth: 1000, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 },
  examTitle: { fontSize: 17, fontWeight: 700 },
  examName: { fontSize: 13, opacity: .85, marginTop: 2 },
  examCounter: { textAlign: "center" },
  examCounterNum: { fontSize: 20, fontWeight: 800 },
  examCounterLabel: { fontSize: 11, opacity: .8, textTransform: "uppercase", letterSpacing: .5 },
  examProgressCol: { minWidth: 150 },
  examProgressText: { fontSize: 12, opacity: .9, marginBottom: 6, textAlign: "right" },
  examProgressBar: { height: 6, background: "rgba(255,255,255,.25)", borderRadius: 999, overflow: "hidden" },
  examProgressFill: { height: "100%", background: "#fff", transition: "width .2s" },
  examBody: { flex: 1, maxWidth: 820, width: "100%", margin: "0 auto", padding: "40px 24px" },
  qLabel: { fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 12 },
  qText: { fontSize: 19, color: "#334155", lineHeight: 1.5, fontWeight: 500 },
  qDivider: { height: 1, background: "#e2e8f0", margin: "20px 0" },
  aLabel: { fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 16 },
  optionList: { display: "flex", flexDirection: "column", gap: 10, maxWidth: 520 },
  optionRow: { display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: "1px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", textAlign: "left", width: "100%" },
  optionRowOn: { borderColor: ACCENT, background: "#f0f7ff" },
  radio: { width: 20, height: 20, borderRadius: "50%", border: "2px solid #94a3b8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  radioOn: { borderColor: ACCENT },
  radioDot: { width: 10, height: 10, borderRadius: "50%", background: ACCENT },
  optionText: { fontSize: 16, fontWeight: 600, color: "#334155" },
  optionTextOn: { color: "#1d4ed8" },
  examFooter: { background: "#e9edf3", borderTop: "1px solid #dbe1ea", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  footerCenter: { display: "flex", gap: 12 },
  quitBtn: { width: 60, background: "none", border: "none", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" },
  navBtn: { padding: "11px 30px", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none" },
  prevBtn: { background: "#fff", color: "#475569", border: "1px solid #cbd5e1" },
  nextBtn: { background: ACCENT, color: "#fff" },
  submitBtn: { background: "#16a34a", color: "#fff" },
  navDisabled: { opacity: .45, cursor: "not-allowed" },

  // Report
  reportWrap: { minHeight: "100vh", background: "#eef1f6" },
  reportBanner: { background: `linear-gradient(135deg, ${BLUE}, #5a6fce)`, color: "#fff" },
  reportBannerInner: { maxWidth: 820, margin: "0 auto", padding: "28px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" },
  reportKicker: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1, opacity: .85, fontWeight: 700 },
  reportName: { fontSize: 26, fontWeight: 800, marginTop: 4 },
  reportMeta: { fontSize: 13, opacity: .9 },
  reportBody: { maxWidth: 820, margin: "0 auto", padding: "24px 24px 48px" },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 24px", marginBottom: 18, boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  cardTitle: { fontSize: 16, fontWeight: 800, color: "#0f172a", display: "flex", alignItems: "center", gap: 10, marginBottom: 6 },
  cardNum: { width: 26, height: 26, borderRadius: 8, background: BLUE, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800 },
  cardSub: { fontSize: 13, color: "#94a3b8", margin: "0 0 16px" },
  muted: { fontSize: 14, color: "#64748b" },
  kvGrid: { display: "flex", gap: 40, flexWrap: "wrap", marginBottom: 14 },
  kv: {},
  kvLabel: { fontSize: 12.5, color: "#64748b", fontWeight: 600, marginBottom: 6 },
  kvBig: { fontSize: 24, fontWeight: 800, color: "#0f172a" },
  kvOf: { fontSize: 16, color: "#94a3b8", fontWeight: 600 },
  kvHint: { fontSize: 11.5, color: "#94a3b8", marginTop: 2 },
  pill: { padding: "5px 14px", borderRadius: 999, fontWeight: 800, fontSize: 13 },
  pillOk: { background: "#dcfce7", color: "#15803d" },
  pillBad: { background: "#fee2e2", color: "#b91c1c" },
  noteOk: { background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", padding: "12px 16px", borderRadius: 10, fontSize: 13, lineHeight: 1.55 },
  noteBad: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "12px 16px", borderRadius: 10, fontSize: 13, lineHeight: 1.55 },
  barRow: { display: "flex", alignItems: "center", gap: 14, marginBottom: 12 },
  barName: { width: 120, fontSize: 14 },
  barTrack: { flex: 1, height: 12, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 999, transition: "width .3s" },
  barVal: { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, fontWeight: 700, color: "#0f172a", background: "#f1f5f9", padding: "3px 10px", borderRadius: 6, minWidth: 56, textAlign: "center" },
  dominantBox: { marginTop: 16, padding: "13px 18px", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10, fontSize: 15, color: "#312e81" },
  tieTag: { color: "#6366f1", fontSize: 13, fontWeight: 600 },
  b5Row: { padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  b5Top: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  b5Name: { fontSize: 15, fontWeight: 700, color: "#1e293b" },
  b5Desc: { fontSize: 13, color: "#64748b", marginTop: 5, fontStyle: "italic" },
  reportActions: { display: "flex", justifyContent: "center", gap: 14, marginTop: 8, flexWrap: "wrap" },
  printHint: { textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 12 },
  primaryBtn: { padding: "12px 32px", background: BLUE, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" },
  secondaryBtn: { padding: "12px 32px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" },
};
