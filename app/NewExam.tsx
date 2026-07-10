"use client";

/**
 * NewExam — the set-based assessment. Fetches a random set per category for the
 * user's life-stage, then runs SECTION BY SECTION: all questions of a section
 * on one scrolling page, "Continue" to the next. Per-type inputs (Yes/No,
 * choose-one, 1–10 slider, most/least). On finish it scores server-side, saves
 * the report to the user's profile, shows a thank-you, and goes to /account.
 */

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";

type Q = { id: string; type: string; text: string; options: string[] | null; styles: string[] | null };
type Section = { category: string; title: string; blurb: string; questions: Q[] };
type GenData = { stage: string; chosenSets: Record<string, string>; sections: Section[] };

export default function NewExam({ category, name, onExit }: { category: string; name?: string; onExit: () => void }) {
  const router = useRouter();
  const { saveAssessment } = useAuth();
  const [phase, setPhase] = useState<"loading" | "error" | "intro" | "exam" | "thanks">("loading");
  const [data, setData] = useState<GenData | null>(null);
  const [sec, setSec] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/new-assessment/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data?.sections?.length) { setData(j.data); setPhase("intro"); }
        else { setErr(j.message || "Could not load the assessment."); setPhase("error"); }
      })
      .catch((e) => { setErr(String(e?.message || e)); setPhase("error"); });
  }, [category]);

  const section = data?.sections[sec];
  const totalQ = useMemo(() => data?.sections.reduce((n, s) => n + s.questions.length, 0) ?? 0, [data]);
  const answeredCount = Object.keys(answers).filter((k) => answers[k] !== "").length;

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const answered = (q: Q) => {
    const v = answers[q.id];
    if (v == null || v === "") return false;
    if (q.type === "mostleast") { const [m, l] = v.split(","); return m !== "" && m != null && l !== "" && l != null; }
    return true;
  };
  const sectionDone = section ? section.questions.every(answered) : false;

  async function finish() {
    if (!data) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/new-assessment/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: data.stage, chosenSets: data.chosenSets, answers }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message || "Scoring failed");
      try { await saveAssessment(j.data); } catch { /* still continue */ }
      setPhase("thanks");
      setTimeout(() => router.push("/account"), 4500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  /* ------- screens ------- */
  if (phase === "loading")
    return <Center><div className="og-spin" /><div style={S.big}>Preparing your assessment…</div><div style={S.sub}>Selecting your question sets</div></Center>;

  if (phase === "error")
    return <Center><div style={{ fontSize: 40 }}>⚠️</div><div style={S.big}>Couldn’t start the assessment</div><div style={S.sub}>{err}</div><button style={S.primary} onClick={onExit}>Back</button></Center>;

  if (phase === "thanks")
    return (
      <div style={S.thanks}>
        <style>{CSS}</style>
        <div className="og-pop" style={{ textAlign: "center" }}>
          <div style={S.check}>✓</div>
          <div style={S.thanksT}>Thank you{name ? `, ${name}` : ""}! 🎉</div>
          <div style={S.sub}>Building your report…</div>
        </div>
      </div>
    );

  if (phase === "intro" && data)
    return (
      <div style={S.introWrap}>
        <style>{CSS}</style>
        <div style={S.introCard}>
          <div style={{ marginBottom: 14 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Before you begin</h2>
          <p style={S.introSub}>{data.sections.length} sections · {totalQ} questions · about 20 minutes</p>
          <ul style={S.introList}>
            <li style={S.introItem}>📚 <span>You’ll go through one <b>section at a time</b> — answer every question in a section, then continue.</span></li>
            <li style={S.introItem}>💡 <span>Answer honestly — there are <b>no wrong answers</b>. Go with your first instinct.</span></li>
            <li style={S.introItem}>🎚️ <span>Some sections use <b>choices</b>, one uses a <b>1–10 slider</b>, and one asks for <b>most &amp; least</b>.</span></li>
          </ul>
          <label style={S.agree}><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I’m ready to begin.</label>
          <button style={{ ...S.primary, width: "100%", ...(agree ? {} : S.disabled) }} disabled={!agree} onClick={() => setPhase("exam")}>Start assessment →</button>
        </div>
      </div>
    );

  if (phase === "exam" && data && section)
    return (
      <div style={S.page}>
        <style>{CSS}</style>
        <header style={S.head}>
          <Logo height={26} />
          <div style={S.headMid}>Section {sec + 1} of {data.sections.length}</div>
          <button style={S.exit} onClick={onExit}>Exit</button>
        </header>
        <div style={S.prog}><div style={{ ...S.progFill, width: `${(answeredCount / (totalQ || 1)) * 100}%` }} /></div>

        <main style={S.main}>
          <div style={S.secHead}>
            <div style={S.secStep}>Section {sec + 1} · {section.category.replace(/_/g, " ")}</div>
            <h1 style={S.secTitle}>{section.title}</h1>
            <p style={S.secBlurb}>{section.blurb}</p>
          </div>

          {section.questions.map((q, qi) => (
            <div key={q.id} style={S.qCard}>
              <div style={S.qHead}><span style={S.qNo}>{qi + 1}</span><span style={S.qText}>{q.text}</span></div>
              <QuestionInput q={q} value={answers[q.id] ?? ""} onChange={(v) => set(q.id, v)} />
            </div>
          ))}

          <div style={S.footer}>
            <button style={{ ...S.ghost, ...(sec === 0 ? S.disabled : {}) }} disabled={sec === 0} onClick={() => { setSec((s) => s - 1); window.scrollTo(0, 0); }}>← Previous section</button>
            {sec < data.sections.length - 1 ? (
              <button style={{ ...S.primary, ...(sectionDone ? {} : S.disabled) }} disabled={!sectionDone} onClick={() => { setSec((s) => s + 1); window.scrollTo(0, 0); }}>Continue →</button>
            ) : (
              <button style={{ ...S.submit, ...(sectionDone && !submitting ? {} : S.disabled) }} disabled={!sectionDone || submitting} onClick={() => void finish()}>{submitting ? "Scoring…" : "Finish & see my report"}</button>
            )}
          </div>
          {err && <div style={S.err}>{err}</div>}
        </main>
      </div>
    );

  return null;
}

/* ------------------------- per-type question input ---------------------- */
function QuestionInput({ q, value, onChange }: { q: Q; value: string; onChange: (v: string) => void }) {
  if (q.type === "yesno") {
    return (
      <div style={S.optRow}>
        {["Yes", "No"].map((o) => (
          <button key={o} style={{ ...S.pill, ...(value === o ? S.pillOn : {}) }} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    );
  }
  if (q.type === "slider") {
    const v = value === "" ? 0 : parseInt(value, 10);
    return (
      <div>
        <div style={S.sliderTop}><span style={S.sliderEnd}>1 · Not like me</span><span style={S.sliderVal}>{v ? v : "—"}</span><span style={S.sliderEnd}>Exactly like me · 10</span></div>
        <input type="range" min={1} max={10} step={1} value={v || 1} onChange={(e) => onChange(e.target.value)} style={S.slider} className="og-range" />
      </div>
    );
  }
  if (q.type === "mostleast") {
    const [most, least] = value.split(",");
    const setPart = (which: 0 | 1, idx: number) => {
      const cur = value.split(","); cur[0] = cur[0] ?? ""; cur[1] = cur[1] ?? "";
      cur[which] = String(idx);
      // most and least can't be the same option
      if (cur[0] === cur[1]) cur[which === 0 ? 1 : 0] = "";
      onChange(`${cur[0] ?? ""},${cur[1] ?? ""}`);
    };
    return (
      <div style={S.mlWrap}>
        {(q.options ?? []).map((o, i) => (
          <div key={i} style={S.mlRow}>
            <span style={S.mlText}>{o}</span>
            <div style={S.mlBtns}>
              <button style={{ ...S.mlBtn, ...(most === String(i) ? S.mlMost : {}) }} onClick={() => setPart(0, i)}>Most</button>
              <button style={{ ...S.mlBtn, ...(least === String(i) ? S.mlLeast : {}) }} onClick={() => setPart(1, i)}>Least</button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  // choice5 / choice4 / vark
  const opts = q.options ?? [];
  return (
    <div style={S.choices}>
      {opts.map((o, i) => {
        const sel = value === String(i);
        const letter = String.fromCharCode(65 + i);
        const label = q.type === "vark" && q.styles?.[i] ? o.replace(/^\(?[A-D]\)?\s*/, "") : o.replace(/^\d+\)\s*/, "");
        return (
          <button key={i} style={{ ...S.choice, ...(sel ? S.choiceOn : {}) }} onClick={() => onChange(String(i))}>
            <span style={{ ...S.ab, ...(sel ? S.abOn : {}) }}>{letter}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {sel && <span style={S.ck}>✓</span>}
          </button>
        );
      })}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div style={S.center}><style>{CSS}</style>{children}</div>;
}

const RED = "#e0242e", INK = "#3f3f46";
const S: Record<string, React.CSSProperties> = {
  center: { position: "fixed", inset: 0, zIndex: 1000, background: "#eef1f6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  big: { fontSize: 19, fontWeight: 800, color: "#1e293b" },
  sub: { fontSize: 14, color: "#64748b" },

  page: { minHeight: "100vh", background: "#f4f5f8", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1f2430" },
  head: { position: "sticky", top: 0, zIndex: 10, background: "#fff", borderBottom: "1px solid #e6e9ef", padding: "12px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  headMid: { fontSize: 14, fontWeight: 700, color: "#64748b" },
  exit: { background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  prog: { position: "sticky", top: 51, zIndex: 9, height: 4, background: "#e6e9ef" },
  progFill: { height: "100%", background: RED, transition: "width .3s" },
  main: { maxWidth: 720, margin: "0 auto", padding: "26px 20px 60px" },
  secHead: { marginBottom: 20 },
  secStep: { fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: .6, color: RED },
  secTitle: { fontSize: 28, fontWeight: 800, margin: "6px 0 6px" },
  secBlurb: { fontSize: 15, color: "#64748b", margin: 0 },
  qCard: { background: "#fff", border: "1px solid #e6e9ef", borderRadius: 16, padding: "20px 22px", marginBottom: 14, boxShadow: "0 1px 3px rgba(20,20,40,.04)" },
  qHead: { display: "flex", gap: 12, marginBottom: 14 },
  qNo: { flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: "#f1f2f6", color: INK, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 13 },
  qText: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },

  optRow: { display: "flex", gap: 10 },
  pill: { flex: 1, padding: "12px", border: "1.5px solid #d7dbe6", borderRadius: 11, background: "#fff", fontWeight: 700, cursor: "pointer", color: "#475569" },
  pillOn: { borderColor: RED, background: "#fdf2f3", color: RED },

  choices: { display: "flex", flexDirection: "column", gap: 9 },
  choice: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 14px", border: "1.5px solid #e2e6ee", borderRadius: 12, background: "#fff", cursor: "pointer", fontSize: 14.5, color: "#334155" },
  choiceOn: { borderColor: RED, background: "#fdf2f3" },
  ab: { flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #cdced8", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, color: "#64748b" },
  abOn: { background: RED, borderColor: RED, color: "#fff" },
  ck: { color: RED, fontWeight: 800 },

  sliderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sliderEnd: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sliderVal: { fontSize: 22, fontWeight: 800, color: RED, minWidth: 30, textAlign: "center" },
  slider: { width: "100%" },

  mlWrap: { display: "flex", flexDirection: "column", gap: 9 },
  mlRow: { display: "flex", alignItems: "center", gap: 12, border: "1px solid #e6e9ef", borderRadius: 12, padding: "10px 14px" },
  mlText: { flex: 1, fontSize: 14, color: "#334155" },
  mlBtns: { display: "flex", gap: 6, flexShrink: 0 },
  mlBtn: { padding: "6px 12px", borderRadius: 8, border: "1px solid #d7dbe6", background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", color: "#64748b" },
  mlMost: { background: "#dcfce7", borderColor: "#16a34a", color: "#15803d" },
  mlLeast: { background: "#fee2e2", borderColor: "#dc2626", color: "#b91c1c" },

  footer: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 24, flexWrap: "wrap" },
  ghost: { padding: "12px 22px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 11, fontSize: 14.5, fontWeight: 700, cursor: "pointer" },
  primary: { padding: "13px 26px", background: INK, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  submit: { padding: "13px 26px", background: RED, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  disabled: { opacity: .45, cursor: "not-allowed" },
  err: { marginTop: 14, background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 600 },

  introWrap: { position: "fixed", inset: 0, zIndex: 1000, background: "#eef1f6", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "auto", fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
  introCard: { width: "100%", maxWidth: 540, background: "#fff", borderRadius: 18, padding: "32px 34px", boxShadow: "0 16px 50px rgba(30,41,59,.14)" },
  introTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 4px" },
  introSub: { fontSize: 13.5, color: "#64748b", margin: "0 0 20px" },
  introList: { listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 12 },
  introItem: { display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.5, color: "#475569" },
  agree: { display: "flex", alignItems: "center", gap: 9, fontSize: 14, margin: "0 0 18px", cursor: "pointer" },

  thanks: { position: "fixed", inset: 0, zIndex: 1200, background: "linear-gradient(160deg,#fdf2f3,#eef1fb)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  check: { width: 92, height: 92, borderRadius: "50%", margin: "0 auto 18px", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, boxShadow: "0 14px 34px rgba(22,163,74,.4)" },
  thanksT: { fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
};

const CSS = `
@keyframes ogSpin{to{transform:rotate(360deg)}}
.og-spin{width:44px;height:44px;border:4px solid #f4c9cc;border-top-color:#e0242e;border-radius:50%;animation:ogSpin .8s linear infinite}
@keyframes ogPop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
.og-pop{animation:ogPop .55s cubic-bezier(.2,.9,.3,1.2) both}
.og-range{accent-color:#e0242e;height:6px}
`;
