"use client";

/**
 * NewExam — the set-based career assessment, one question at a time in a
 * professional exam console: dark top bar with live counters, left CATEGORY
 * rail (the 8 sections with progress), centre question card, right QUESTION
 * NAVIGATOR + progress donut. Full-screen. No explanations shown.
 *
 * Robust media system — a question may carry a `media` block: reasoning visuals
 * (SVG grid / sequence / figure), data tables, reading passages, audio (spoken
 * via the browser), images, video, or pie/bar charts. Inputs cover Yes/No,
 * choose-one (text or SVG options), 1–10 slider, most/least, and open response.
 */

import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth, type ExamSession } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase/client";

// Short chip labels so all 8 categories fit the bar without horizontal scroll.
const SHORT_CAT: Record<string, string> = {
  personality: "Personality", career_interest: "Interests", multiple_intelligence: "Intelligences",
  emotional_intelligence: "Emotional", learning_styles: "Learning", motivators: "Motivators",
  strengths: "Strengths", aptitude: "Aptitude",
};

const TOTAL_SEC = 90 * 60; // 90-minute exam
const fmtTime = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.max(0, s % 60);
  const p = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${p(m)}:${p(sec)}` : `${p(m)}:${p(sec)}`;
};
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import ExamComplete from "@/app/ExamComplete";

type Media =
  | { type: "grid"; cells: string[]; cols?: number }
  | { type: "sequence"; items: string[] }
  | { type: "figure"; svg: string }
  | { type: "html"; html: string }
  | { type: "passage"; text: string }
  | { type: "tts"; text: string }
  | { type: "image"; src: string; alt?: string }
  | { type: "audio"; src: string }
  | { type: "video"; src: string }
  | { type: "chart"; chartType: "pie" | "bar"; data: { label: string; value: number }[] }
  | null;

type Q = {
  id: string; type: string; text: string;
  options: string[] | null; styles: string[] | null;
  format: string | null; svgOptions: boolean; media: Media; optional?: boolean;
};
type Section = { category: string; title: string; blurb: string; questions: Q[] };
type GenData = { stage: string; chosenSets: Record<string, string>; sections: Section[] };
type Flat = Q & { si: number; cat: string; catTitle: string; catBlurb: string };

/** Guard: a bad question can never white-screen the whole app. */
class ExamErrorBoundary extends Component<{ onExit: () => void; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(err: unknown) { console.error("Assessment render error:", err); }
  render() {
    if (this.state.hasError)
      return (
        <div style={S.center}>
          <div style={{ color: "#c0564f" }}><Icon name="info" size={40} /></div>
          <div style={S.big}>Something went wrong displaying this screen</div>
          <div style={S.subT}>Your progress may be affected. Please reload to continue.</div>
          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button style={S.primary} onClick={() => window.location.reload()}>Reload</button>
            <button style={{ ...S.ghost }} onClick={this.props.onExit}>Exit to dashboard</button>
          </div>
        </div>
      );
    return this.props.children;
  }
}

/**
 * Per-tab marker that this browser tab has just submitted an assessment.
 * sessionStorage, not localStorage: it should die with the tab, and it must not
 * follow the student to another tab where they legitimately want to retake.
 */
const JUST_FINISHED = "og:exam:justFinished";

/**
 * Optional scoring override.
 *
 * The paid paper posts to /api/new-assessment/score and saves whatever comes
 * back. The class 11-12 demo needs a different endpoint, because its report
 * also carries the desired-vs-measured comparison and two roadmaps, which the
 * plain summary has no room for.
 *
 * Rather than fork the exam engine — 1,000 lines of question rendering,
 * navigation, autosave and resume that must not diverge — the difference is
 * expressed as this one optional prop. Omit it and the behaviour is exactly
 * what it always was.
 */
export interface ScoringOverride {
  url: string;
  /** Merged into the POST body alongside stage, chosenSets and answers. */
  extraBody?: Record<string, unknown>;
  /** Pulls the AssessmentSummary out of a response shaped for this endpoint. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickSummary: (data: any) => any;
  /** Receives the whole response so the caller can render its own report. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onResult?: (data: any) => void;
  /**
   * Where to store the scored summary. Defaults to saveAssessment, which
   * writes the field /account renders - so a paper that is NOT the paid one
   * must supply its own, or it overwrites a real report with a demo.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  persist?: "assessment" | "demo";
  /**
   * Pulls the caller's own report data out of the response, to be stored
   * alongside the summary. Without this the demo's comparison and roadmaps
   * exist only in memory and vanish the moment the student navigates away.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pickExtras?: (data: any) => any;
}

type ExamProps = {
  category: string;
  name?: string;
  onExit: () => void;
  scoring?: ScoringOverride;
};

export default function NewExam(props: ExamProps) {
  return <ExamErrorBoundary onExit={props.onExit}><NewExamInner {...props} /></ExamErrorBoundary>;
}

function NewExamInner({ category, name, onExit, scoring }: ExamProps) {
  const router = useRouter();
  const { saveAssessment, saveDemoAssessment, saveExamSession, clearExamSession, profile, user } = useAuth();
  const [phase, setPhase] = useState<"loading" | "error" | "intro" | "resume" | "exam" | "thanks" | "already">("loading");
  const [data, setData] = useState<GenData | null>(null);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const [remainingSec, setRemainingSec] = useState(TOTAL_SEC);
  const [saved, setSaved] = useState(false);
  const inited = useRef(false);

  // First load: resume a saved in-progress exam (same questions + remaining time)
  // if one exists, otherwise generate a fresh random set.
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    // Guard against re-entering the exam right after finishing it. Submitting
    // clears the saved session, so the "resume" branch below can't fire and the
    // student would be dropped straight into a NEW randomly generated exam
    // without being asked — which is exactly what pressing the browser's Back
    // button from the completion screen used to do.
    //
    // Deliberately a question rather than a hard block: retaking is a real
    // feature, and only the student can say which they meant.
    let finished = false;
    try { finished = sessionStorage.getItem(JUST_FINISHED) === "1"; } catch { /* private mode */ }
    const es0 = profile?.examSession;
    const canResume0 = !!(es0 && es0.status === "in_progress" && es0.chosenSets && Object.keys(es0.chosenSets).length);
    if (finished && !canResume0) { setPhase("already"); return; }

    const es = profile?.examSession;
    const resume = !!(es && es.status === "in_progress" && es.chosenSets && Object.keys(es.chosenSets).length);
    // `category` goes with the resume fields, not instead of them: the server
    // uses it to refuse a saved session that belongs to a different paper.
    // Without it, opening the demo with a half-finished paid exam saved on the
    // profile resumed the paid exam inside the demo.
    const body = resume
      ? { category, stage: es!.stage, chosenSets: es!.chosenSets }
      : { category };
    fetch("/api/new-assessment/generate", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.success && j.data?.sections?.length) {
          setData(j.data);
          if (resume && es) {
            setAnswers(es.answers || {});
            setReview(es.review || {});
            setCur(es.cur || 0);
            setRemainingSec(es.remainingSec ?? TOTAL_SEC);
            setPhase("resume");
          } else {
            setRemainingSec(TOTAL_SEC);
            setPhase("intro");
          }
        } else { setErr(j.message || "Could not load the assessment."); setPhase("error"); }
      })
      .catch((e) => { setErr(String(e?.message || e)); setPhase("error"); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Flatten every section into one ordered list (global question flow).
  const flat: Flat[] = useMemo(() => {
    if (!data) return [];
    const out: Flat[] = [];
    data.sections.forEach((s, si) => s.questions.forEach((q) => out.push({ ...q, si, cat: s.category, catTitle: s.title, catBlurb: s.blurb })));
    return out;
  }, [data]);

  const total = flat.length;
  const q = flat[cur];
  const requiredTotal = useMemo(() => flat.filter((x) => !x.optional).length, [flat]);

  const isAnswered = (qq: { id: string; type: string; optional?: boolean }) => {
    const v = answers[qq.id];
    return v != null && v !== "";
  };
  const answeredCount = useMemo(() => flat.filter((x) => !x.optional && isAnswered(x)).length, [answers, flat]); // eslint-disable-line react-hooks/exhaustive-deps
  const markedCount = Object.values(review).filter(Boolean).length;
  const allDone = answeredCount >= requiredTotal;

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  // Selecting an option records it and nothing else — advancing is the student's
  // decision, via Next. Auto-advancing on tap pulled the page away mid-thought,
  // made changing your mind require navigating back, and quietly rewarded
  // answering fast on an instrument where the whole point is to consider five
  // options that all sound reasonable.
  function answer(qq: { id: string; type: string }, v: string) {
    set(qq.id, v);
  }
  const go = (i: number) => { if (i >= 0 && i < total) { setCur(i); window.scrollTo(0, 0); } };
  const jumpToSection = (si: number) => { const idx = flat.findIndex((f) => f.si === si); if (idx >= 0) go(idx); };
  const readAloud = (text: string) => {
    try { const s = window.speechSynthesis; s.cancel(); const u = new SpeechSynthesisUtterance(text); u.rate = 0.95; s.speak(u); } catch { /* ignore */ }
  };

  // ---- persistence (resume) + 90-min timer ----
  const stateRef = useRef({ data, answers, review, cur, remainingSec });
  stateRef.current = { data, answers, review, cur, remainingSec };
  function buildSession(): ExamSession | null {
    const st = stateRef.current;
    if (!st.data) return null;
    return { stage: st.data.stage, chosenSets: st.data.chosenSets, answers: st.answers, review: st.review, cur: st.cur, remainingSec: st.remainingSec, status: "in_progress", savedAt: new Date().toISOString() };
  }
  function saveNow() { const s = buildSession(); if (s) void saveExamSession(s).catch(() => {}); }

  useEffect(() => { // tick the clock while live
    if (phase !== "exam") return;
    const id = window.setInterval(() => setRemainingSec((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [phase]);
  useEffect(() => { // auto-save every 20s
    if (phase !== "exam") return;
    const id = window.setInterval(() => saveNow(), 20000);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  useEffect(() => { // save when moving between questions
    if (phase === "exam") saveNow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);
  const finishedRef = useRef(false);
  useEffect(() => { // time up -> auto-submit
    if (phase === "exam" && remainingSec <= 0 && !finishedRef.current) { finishedRef.current = true; void finish(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingSec, phase]);

  async function startExam() {
    try { await document.documentElement.requestFullscreen?.(); } catch { /* best effort */ }
    setPhase("exam");
    saveNow(); // persist immediately so a resume works even if they close right away
  }
  async function resumeExam() {
    try { await document.documentElement.requestFullscreen?.(); } catch { /* best effort */ }
    setPhase("exam");
  }
  async function restartExam() {
    try { await clearExamSession(); } catch { /* ignore */ }
    setPhase("loading");
    try {
      const r = await fetch("/api/new-assessment/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category }) });
      const j = await r.json();
      if (j.success && j.data?.sections?.length) {
        setData(j.data); setAnswers({}); setReview({}); setCur(0); setRemainingSec(TOTAL_SEC); setPhase("intro");
      } else { setErr(j.message || "Could not load."); setPhase("error"); }
    } catch (e) { setErr(String((e as Error)?.message || e)); setPhase("error"); }
  }
  function saveAndExit() {
    saveNow();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }
  function exitExam() {
    if (phase === "exam") saveNow();
    try { if (document.fullscreenElement) void document.exitFullscreen(); } catch { /* ignore */ }
    onExit();
  }
  async function finish() {
    if (!data) return;
    setSubmitting(true);
    try {
      const res = await fetch(scoring?.url ?? "/api/new-assessment/score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: data.stage, chosenSets: data.chosenSets, answers,
          ...(scoring?.extraBody ?? {}),
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message || "Scoring failed");
      const summary = scoring ? scoring.pickSummary(j.data) : j.data;
      const extras = scoring?.pickExtras ? scoring.pickExtras(j.data) : undefined;
      try {
        if (scoring?.persist === "demo") await saveDemoAssessment(summary, extras);
        else await saveAssessment(summary);
      } catch { /* still continue */ }
      // Hand the full response back before the completion screen renders, so a
      // caller supplying its own report has it ready rather than re-fetching.
      try { scoring?.onResult?.(j.data); } catch { /* caller's problem, not the exam's */ }
      try { await clearExamSession(); } catch { /* ignore */ }
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* ignore */ }

      // One request, two emails: the student's thank-you with the steps to sign
      // back in, and the team's notice at support@ that a report is waiting to
      // be sent by hand from /admin. This is the ONLY place the student gets
      // those steps — the completion screen sends them straight to the
      // dashboard instead — so it matters that it fires on every submit.
      //
      // Still fire-and-forget: the assessment is already saved by this point,
      // and a mail outage must never turn a completed exam into an error screen.
      void (async () => {
        try {
          const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
          if (!idToken) return;
          await fetch("/api/assessment/completion-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              idToken,
              name,
              topCareer: summary?.topCareer ?? "",
              alignment: summary?.overallFitmentPct ?? null,
            }),
          });
        } catch { /* best-effort */ }
      })();

      // Mark the exam finished for THIS TAB. Submitting clears the saved
      // session, so anything that lands back on the exam URL — the browser
      // Back button most of all — would otherwise find no session to resume and
      // silently generate a brand-new exam. See the guard on mount.
      try { sessionStorage.setItem(JUST_FINISHED, "1"); } catch { /* private mode */ }

      // No auto-redirect. The dashboard is one click away on the completion
      // screen, but the student decides when to take it — a timed jump would
      // yank the "submitted successfully" confirmation away before they have
      // read it.
      setPhase("thanks");
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); setSubmitting(false); }
  }

  /* ---------------------------- screens ---------------------------- */
  if (phase === "loading")
    return <Center><div className="og-spin" /><div style={S.big}>Preparing your assessment…</div><div style={S.subT}>Selecting your question sets</div></Center>;

  if (phase === "error")
    return <Center><div style={{ color: "#c0564f" }}><Icon name="info" size={40} /></div><div style={S.big}>Couldn’t start the assessment</div><div style={S.subT}>{err}</div><button style={S.primary} onClick={exitExam}>Back</button></Center>;

  // Reached by navigating back onto the exam after submitting it. Ask instead
  // of silently starting a new one — the student almost always wants their
  // report, and a fresh 60-question exam is an expensive thing to open by
  // accident.
  if (phase === "already")
    return (
      <Center>
        <div style={{ color: "#16a34a" }}><Icon name="check" size={40} stroke={2.6} /></div>
        <div style={S.big}>You’ve already submitted this assessment</div>
        <div style={S.subT}>Your report is saved on your dashboard. Starting again means answering every question afresh.</div>
        <button style={S.primary} onClick={exitExam}>Go to my dashboard</button>
        <button
          style={S.ghost}
          onClick={() => {
            try { sessionStorage.removeItem(JUST_FINISHED); } catch { /* private mode */ }
            void restartExam();
          }}
        >
          Start a new assessment
        </button>
      </Center>
    );

  if (phase === "thanks") {
    const email = profile?.email || user?.email || "";
    return (
      <ExamComplete
        name={name}
        fullName={profile?.name || name}
        email={email}
        onGoToDashboard={() => router.push("/account")}
      />
    );
  }

  if (phase === "resume" && data)
    return (
      <div style={S.introWrap}><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 14 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Welcome back{name ? `, ${name}` : ""} 👋</h2>
          <p style={S.introSub}>You have an assessment in progress — pick up right where you left off.</p>
          <div style={S.resumeStats}>
            <div style={S.resumeStat}><div style={S.resumeStatN}>{answeredCount}/{requiredTotal}</div><div style={S.resumeStatL}>answered</div></div>
            <div style={S.resumeStat}><div style={{ ...S.resumeStatN, color: remainingSec < 300 ? "#dc2626" : BLUE }}>{fmtTime(remainingSec)}</div><div style={S.resumeStatL}>time left</div></div>
          </div>
          <button style={{ ...S.primary, width: "100%" }} onClick={() => void resumeExam()}>Resume assessment →</button>
          <button style={S.resumeRestart} onClick={() => void restartExam()}>Start over from the beginning</button>
        </div>
      </div>
    );

  if (phase === "intro" && data)
    return (
      <div style={S.introWrap}><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Before you begin</h2>
          <p style={S.introSub}>{data.sections.length} sections · {requiredTotal} questions · up to <b>90 minutes</b></p>
          <ul style={S.introList}>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clock" size={18} /></span><span>You have <b>90 minutes</b>. The timer runs at the top — it auto-submits when it reaches zero.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clusters" size={18} /></span><span>Tap an answer and it <b>moves to the next question</b> automatically. Use the category bar or navigator to jump around.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="check" size={18} /></span><span><b>Save progress</b> any time — if you close and sign back in, you’ll resume from here with the same questions and time.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="expand" size={18} /></span><span>The test opens in <b>full screen</b> for focus. You can exit any time.</span></li>
          </ul>
          {/* Set expectations before the first answer, not only at the end:
              the result reflects what the student tells us, so answering
              honestly matters more than answering impressively. */}
          <p style={S.disclaimer}>
            Your results come from <b>your own answers</b>, read through established
            frameworks — RIASEC interests, the Big Five, multiple intelligences and
            emotional intelligence. There are no right or wrong answers, and nothing
            here is a limit on what you can become. Answer honestly rather than
            impressively; a picture of who you actually are is far more useful to you
            than a flattering one.
          </p>
          <label style={S.agree}><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I’m ready to begin.</label>
          <button style={{ ...S.primary, width: "100%", ...(agree ? {} : S.disabled) }} disabled={!agree} onClick={() => void startExam()}>Start assessment →</button>
        </div>
      </div>
    );

  if (phase === "exam" && data && q) {
    const pct = Math.round((answeredCount / (requiredTotal || 1)) * 100);
    const notAnswered = requiredTotal - answeredCount;
    return (
      <div style={S.page}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        {/* top bar */}
        <header style={S.top} className="og-exam-top">
          <div style={S.topLeft}>
            <span style={S.logoBox}><Logo height={28} /></span>
            <div className="og-exam-topmeta"><div style={S.topTitle}>Career Assessment</div><div style={S.topSub}>{requiredTotal} Questions</div></div>
          </div>
          <div style={S.statsPanel} className="og-exam-stats">
            <Stat icon="clock" label="TIME LEFT" value={fmtTime(remainingSec)} color={remainingSec < 300 ? "#dc2626" : undefined} />
            <div style={S.topDiv} />
            <Stat icon="help" label="QUESTION" value={`${cur + 1} / ${total}`} />
            <div style={S.topDiv} />
            <Stat icon="check" label="ANSWERED" value={`${answeredCount}`} color="#16a34a" />
            <div style={S.topDiv} />
            <Stat icon="flag" label="MARKED" value={`${markedCount}`} />
          </div>
          <div style={S.topRight} className="og-exam-topright">
            <button style={{ ...S.saveBtn, ...(saved ? S.saveBtnOk : {}) }} onClick={saveAndExit}><Icon name="save" size={16} /> <span className="og-exam-btn-label">{saved ? "Saved ✓" : "Save Progress"}</span></button>
            <button style={S.exitBtn} onClick={exitExam}><Icon name="power" size={15} /> <span className="og-exam-btn-label">Exit</span></button>
          </div>
        </header>

        {/* horizontal categories bar */}
        <nav style={S.catBar} className="og-exam-catbar">
          {data.sections.map((s, si) => {
            const qs = s.questions.filter((x) => !x.optional);
            const a = qs.filter(isAnswered).length;
            const done = a === qs.length;
            const activeSec = q.si === si;
            return (
              <button key={s.category} title={s.title} onClick={() => jumpToSection(si)} style={{ ...S.catChip, ...(activeSec ? S.catChipOn : {}) }}>
                <span style={{ display: "flex", flexShrink: 0, color: activeSec ? BLUE : done ? GREEN : "#9aa3b2" }}><Icon name={s.category} size={15} /></span>
                <span style={S.catChipName}>{SHORT_CAT[s.category] || s.title}</span>
                <span style={{ ...S.catChipBadge, ...(done ? S.catChipBadgeDone : activeSec ? S.catChipBadgeOn : {}) }}>{done ? "✓" : `${a}/${qs.length}`}</span>
              </button>
            );
          })}
        </nav>

        <div style={S.grid} className="og-exam-grid">
          {/* centre: current question */}
          <main style={S.main}>
            <div style={S.mainInner}>
              <div style={S.progOuter}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>

              <div style={S.qBlock}>
                <span style={S.qNum}>{cur + 1}</span>
                <div style={S.qCard}>
                  <div style={S.qHead}>
                    <div style={S.qText}>{q.text}{q.optional && <em style={S.optTag}> (optional)</em>}</div>
                    <div style={S.qHeadBtns}>
                      <button style={S.speakBtn} title="Read aloud" onClick={() => readAloud(q.text)}><Icon name="audio" size={16} /></button>
                      <button style={{ ...S.reviewIcon, ...(review[q.id] ? S.reviewIconOn : {}) }} title="Mark for review" onClick={() => setReview((r) => ({ ...r, [q.id]: !r[q.id] }))}><Icon name="bookmark" size={16} /></button>
                    </div>
                  </div>
                  {q.media && <MediaBlock media={q.media} />}
                  <QuestionInput q={q} value={answers[q.id] ?? ""} onChange={(v) => answer(q, v)} />
                </div>
              </div>

              <div style={S.actions}>
                <button style={{ ...S.ghost, ...(cur === 0 ? S.disabled : {}) }} disabled={cur === 0} onClick={() => go(cur - 1)}><Icon name="chevronLeft" size={16} /> Previous</button>
                <div style={{ flex: 1 }} />
                {/* Next is always available, on every question type. Selecting
                    an answer still auto-advances, but a student who wants to
                    skip, or who just prefers driving it themselves, needs a
                    button — "Previous" alone on screen reads as a dead end. */}
                {cur === total - 1 ? (
                  <button style={{ ...S.finish, ...(allDone && !submitting ? {} : S.disabled) }} disabled={!allDone || submitting} onClick={() => void finish()}>{submitting ? "Scoring…" : "Finish & see report"}</button>
                ) : (
                  <button style={S.next} onClick={() => go(cur + 1)}>Next <Icon name="chevronRight" size={16} /></button>
                )}
              </div>
              {cur < total - 1 && !(q.type === "slider" || q.type === "scale" || q.type === "open" || q.type === "multiple" || q.type === "multiple_with_grouping") && <div style={S.tapHint}>Tap an answer to continue, or use Next to come back to it later</div>}
              {!allDone && cur === total - 1 && <div style={S.hint}>Answer all {requiredTotal} questions to finish ({notAnswered} left).</div>}
              {err && <div style={S.err}>{err}</div>}
            </div>
          </main>

          {/* right: navigator */}
          <aside style={S.nav} className="og-exam-nav">
            <div style={S.navTitle}>Question Navigator</div>
            <div style={S.legend}>
              <span style={S.legItem}><i style={{ ...S.dot, background: GREEN }} /> Answered</span>
              <span style={S.legItem}><i style={{ ...S.dot, background: BLUE }} /> Current</span>
              <span style={S.legItem}><i style={{ ...S.dot, background: AMBER }} /> Review</span>
              <span style={S.legItem}><i style={{ ...S.dot, background: "#cbd2dd" }} /> Pending</span>
            </div>
            <div style={S.navScroll} className="og-nav-scroll">
              <div style={S.navGrid}>
                {flat.map((f, i) => {
                  const ans = isAnswered(f), rev = review[f.id], isCur = i === cur;
                  const st = isCur ? S.navCur : rev ? S.navRev : ans ? S.navAns : S.navPend;
                  return <button key={f.id} onMouseDown={(e) => e.preventDefault()} onClick={() => go(i)} style={{ ...S.navCell, ...st }}>{i + 1}</button>;
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ icon, label, value, color }: { icon: string; label: string; value: string; color?: string }) {
  return (
    <div style={S.stat}>
      <span style={{ ...S.statIc, ...(color ? { color } : {}) }}><Icon name={icon} size={17} /></span>
      <div><div style={S.statLabel}>{label}</div><div style={{ ...S.statVal, ...(color ? { color } : {}) }}>{value}</div></div>
    </div>
  );
}

/* Strip the embedded outer frame that every authored SVG option carries
   (`<rect ... stroke="#D9D9D9" .../>`). Without this each tile draws its own
   inner box on top of our state-driven tile border, so busier options read as
   if they were selected/outlined. We keep the white fill, drop the stroke. */
function cleanSvg(svg: string): string {
  return svg.replace(/(<rect\b[^>]*?)\sstroke="#D9D9D9"([^>]*?>)/gi, "$1 stroke=\"none\"$2");
}

/* --------------------------- media rendering --------------------------- */
function MediaBlock({ media }: { media: Media }) {
  if (!media) return null;
  if (media.type === "grid") {
    const cols = media.cols ?? 3;
    return (
      <div style={{ ...S.mGrid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(media.cells ?? []).map((c, i) => typeof c === "string" && c.startsWith("<svg")
          ? <div key={i} className="og-mcell" style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />
          : <div key={i} style={{ ...S.mCell, ...S.mQ }}>?</div>)}
      </div>
    );
  }
  if (media.type === "sequence")
    return <div style={S.mSeq}>{(media.items ?? []).filter((c) => typeof c === "string").map((c, i) => <div key={i} className="og-mcell" style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />)}<div style={{ ...S.mCell, ...S.mQ }}>?</div></div>;
  if (media.type === "figure") return <div className="og-mfig" style={S.mFigure} dangerouslySetInnerHTML={{ __html: media.svg || "" }} />;
  if (media.type === "html") return <div style={S.mHtml} dangerouslySetInnerHTML={{ __html: media.html || "" }} />;
  if (media.type === "passage") return <blockquote style={S.mPassage}>{media.text}</blockquote>;
  if (media.type === "tts") return <AudioQuestion text={media.text} />;
  // eslint-disable-next-line @next/next/no-img-element
  if (media.type === "image") return <img src={media.src} alt={media.alt || ""} style={S.mImage} />;
  if (media.type === "audio") return <audio controls src={media.src} style={{ width: "100%", marginBottom: 14 }} />;
  if (media.type === "video") return <video controls src={media.src} style={S.mVideo} />;
  if (media.type === "chart") return <ChartBlock chartType={media.chartType} data={media.data} />;
  return null;
}

function AudioQuestion({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [showText, setShowText] = useState(false);
  const play = () => {
    try {
      const synth = window.speechSynthesis; synth.cancel();
      const u = new SpeechSynthesisUtterance(text); u.rate = 0.95; u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
      setSpeaking(true); synth.speak(u);
    } catch { setSpeaking(false); }
  };
  const stop = () => { try { window.speechSynthesis.cancel(); } catch { /* ignore */ } setSpeaking(false); };
  return (
    <div style={S.audioCard}>
      <div style={S.audioRow}>
        <button style={S.audioBtn} onClick={speaking ? stop : play}>{speaking ? "■ Stop" : "▶ Play audio"}</button>
        <span style={S.audioNote}>Listen carefully — you can replay it.</span>
      </div>
      <button style={S.transToggle} onClick={() => setShowText((s) => !s)}>{showText ? "Hide transcript" : "Show transcript"}</button>
      {showText && <div style={S.transText}>{text}</div>}
    </div>
  );
}

function ChartBlock({ chartType, data }: { chartType: "pie" | "bar"; data: { label: string; value: number }[] }) {
  const COLORS = ["#2f5bd6", "#2f9e6f", "#c9a24b", "#a4708a", "#7a8aa8", "#8a9e6f"];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  if (chartType === "pie") {
    let acc = 0; const R = 70, C = 90;
    return (
      <div style={S.chartWrap}>
        <svg viewBox="0 0 180 180" width="180" height="180">
          {data.map((d, i) => {
            const a0 = (acc / total) * 2 * Math.PI; acc += d.value; const a1 = (acc / total) * 2 * Math.PI;
            const x0 = C + R * Math.sin(a0), y0 = C - R * Math.cos(a0), x1 = C + R * Math.sin(a1), y1 = C - R * Math.cos(a1);
            const large = a1 - a0 > Math.PI ? 1 : 0;
            return <path key={i} d={`M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`} fill={COLORS[i % COLORS.length]} />;
          })}
        </svg>
        <div style={S.chartLegend}>{data.map((d, i) => <span key={i} style={S.chartLeg}><i style={{ ...S.dot, background: COLORS[i % COLORS.length] }} />{d.label} ({Math.round((d.value / total) * 100)}%)</span>)}</div>
      </div>
    );
  }
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={S.barWrap}>
      {data.map((d, i) => (
        <div key={i} style={S.barRow}>
          <span style={S.barLabel}>{d.label}</span>
          <div style={S.barTrack}><div style={{ ...S.barFill, width: `${(d.value / max) * 100}%`, background: COLORS[i % COLORS.length] }} /></div>
          <span style={S.barVal}>{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function Donut({ pct }: { pct: number }) {
  const r = 40, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 110 110" style={S.donut}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="#eceef2" strokeWidth="11" />
      <circle cx="55" cy="55" r={r} fill="none" stroke={BLUE} strokeWidth="11" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 55 55)" style={{ transition: "stroke-dashoffset .4s" }} />
      <text x="55" y="55" textAnchor="middle" fontSize="19" fontWeight="800" fill="#1f2937">{pct}%</text>
      <text x="55" y="70" textAnchor="middle" fontSize="9" fill="#94a3b8">complete</text>
    </svg>
  );
}

/* ------------------------- per-type question input ---------------------- */
function QuestionInput({ q, value, onChange }: { q: Q; value: string; onChange: (v: string) => void }) {
  if (q.type === "slider" || q.type === "scale") {
    const v = value === "" ? 0 : parseInt(value, 10);
    const minLabel = (q as any).scaleLabel_min || "Not like me";
    const maxLabel = (q as any).scaleLabel_max || "Exactly like me";
    return (
      <div>
        <div style={S.sliderTop}><span style={S.sliderEnd}>1 · {minLabel}</span><span style={S.sliderVal}>{v ? v : "—"}</span><span style={S.sliderEnd}>{maxLabel} · 10</span></div>
        <input type="range" min={1} max={10} step={1} value={v || 1} onChange={(e) => onChange(e.target.value)} style={S.slider} className="og-range" />
        <div style={S.sliderTicks}>{Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
      </div>
    );
  }

  if (q.type === "open")
    return <textarea style={S.open} rows={3} placeholder="Type your response (optional)…" value={value} onChange={(e) => onChange(e.target.value)} />;

  // Aptitude visual options (SVG) — same radio control as the text rows, so
  // every answerable option in the exam looks and behaves identically.
  if (q.svgOptions) {
    const opts = q.options ?? [];
    return (
      <div style={S.svgChoices}>
        {opts.map((o, i) => {
          const sel = value === String(i);
          return (
            <button key={i} className="og-svgc" style={{ ...S.svgChoice, ...(sel ? S.svgChoiceOn : {}) }} onMouseDown={(e) => e.preventDefault()} onClick={() => onChange(String(i))}>
              <Radio on={sel} />
              <span className="og-svgh" style={S.svgHolder} dangerouslySetInnerHTML={{ __html: cleanSvg(o || "") }} />
            </button>
          );
        })}
      </div>
    );
  }

  if (q.type === "multiple" || q.type === "multiple_with_grouping") {
    const opts = q.options ?? [];
    const limits: Record<string, number> = { "Q63": Infinity, "Q64": 1, "Q65": 1, "Q68": 2, "Q71": 3, "Q74": 2 };
    const maxSelections = limits[q.id] ?? 1;
    const currentSelections = value ? JSON.parse(value) : [];
    const canSelect = currentSelections.length < maxSelections;
    return (
      <div style={S.optList}>
        {opts.map((o, i) => {
          const isSelected = currentSelections.includes(String(i));
          const label = o?.replace(/^\d+\)\s*/, "") ?? "";
          return (
            <button key={i} className="og-opt" style={{ ...S.optRow, ...(isSelected ? S.optRowOn : {}), opacity: !isSelected && !canSelect ? 0.5 : 1, pointerEvents: !isSelected && !canSelect ? "none" : "auto" }} onMouseDown={(e) => e.preventDefault()} onClick={() => {
              if (isSelected) {
                const newSelections = currentSelections.filter((x: string) => x !== String(i));
                onChange(JSON.stringify(newSelections));
              } else if (canSelect) {
                const newSelections = [...currentSelections, String(i)];
                onChange(JSON.stringify(newSelections));
              } else {
                alert(`Maximum ${maxSelections} selection${maxSelections > 1 ? "s" : ""} allowed`);
              }
            }}>
              <Checkbox on={isSelected} />
              <span style={{ ...S.optLabel, ...(isSelected ? S.optLabelOn : {}) }}>{label}</span>
            </button>
          );
        })}
        {maxSelections !== Infinity && <div style={{ padding: "8px 16px", fontSize: 12, color: "#666" }}>{currentSelections.length} of {maxSelections} selected</div>}
      </div>
    );
  }

  // Radio rows for every text single-select (Yes/No, choose-one, most-like).
  const isYesNo = q.type === "yesno";
  const opts = isYesNo ? ["Yes", "No"] : (q.options ?? []);
  return (
    <div style={S.optList}>
      {opts.map((o, i) => {
        const val = isYesNo ? o : String(i);
        const sel = value === val;
        const raw = o ?? "";
        // Strips an imported "A) " / "(A) " label. The closing bracket is
        // REQUIRED: without it the pattern also ate the first letter of any
        // option that simply starts with A-D ("Attend ..." -> "ttend ...").
        const label = q.type === "vark" && q.styles?.[i] ? raw.replace(/^\(?[A-D][).]\s*/, "") : isYesNo ? raw : raw.replace(/^\d+\)\s*/, "");
        return (
          <button key={i} className="og-opt" style={{ ...S.optRow, ...(sel ? S.optRowOn : {}) }} onMouseDown={(e) => e.preventDefault()} onClick={() => onChange(val)}>
            <Radio on={sel} />
            <span style={{ ...S.optLabel, ...(sel ? S.optLabelOn : {}) }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** The one radio control used by every option in the exam — text rows and
 *  SVG tiles alike. Clearly visible when unselected, filled blue when chosen. */
function Radio({ on }: { on: boolean }) {
  // The class is what lets CSS pin the ring colour to the SELECTED state alone
  // (see .og-radio in CSS). Without a hook, hover/focus styling on the parent
  // button could darken one unselected ring and read as a hint.
  return (
    <span className={`og-radio${on ? " on" : ""}`} style={{ ...S.radio, ...(on ? S.radioOn : {}) }}>
      {on && <span style={S.radioDot} />}
    </span>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span style={{ width: 18, height: 18, border: `2px solid ${on ? "#2563eb" : "#e6e9f0"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: on ? "#2563eb" : "white", transition: "all 0.2s" }}>
      {on && <span style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>✓</span>}
    </span>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div style={S.center}><style dangerouslySetInnerHTML={{ __html: CSS }} />{children}</div>;
}

/* ------------------------------- styling ------------------------------- */
const NAVY = "#17233f", BLUE = "#2563eb", BLUE_SOFT = "#eef4ff", INK = "#1e293b", MUTED = "#64748b", ACCENT = "#2563eb";
const GREEN = "#16a34a", GREEN_SOFT = "#e7f6ec", AMBER = "#f59e0b", AMBER_SOFT = "#fef3c7", LINE = "#e6e9f0", BG = "#f5f7fb";
const S: Record<string, React.CSSProperties> = {
  center: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  big: { fontSize: 19, fontWeight: 800, color: INK },
  subT: { fontSize: 14, color: MUTED },

  page: { position: "fixed", inset: 0, zIndex: 1000, background: BG, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK, display: "flex", flexDirection: "column" },
  // top bar (white)
  top: { flexShrink: 0, background: "#fff", borderBottom: `1px solid ${LINE}`, padding: "10px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  topLeft: { display: "flex", alignItems: "center", gap: 12 },
  logoBox: { border: `1px solid ${LINE}`, borderRadius: 10, padding: "5px 8px", display: "grid", placeItems: "center", background: "#fff" },
  topTitle: { fontSize: 17, fontWeight: 800, color: INK },
  topSub: { fontSize: 12.5, color: MUTED },
  statsPanel: { display: "flex", alignItems: "center", gap: 16, background: "#f8fafc", border: `1px solid ${LINE}`, borderRadius: 12, padding: "8px 20px" },
  topDiv: { width: 1, height: 26, background: "#e6e9f0" },
  stat: { display: "flex", alignItems: "center", gap: 9 },
  statIc: { color: "#94a3b8", display: "grid", placeItems: "center" },
  statLabel: { fontSize: 9.5, letterSpacing: .6, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" },
  statVal: { fontSize: 15, fontWeight: 800, lineHeight: 1.1, color: INK },
  topRight: { display: "flex", gap: 10, flexShrink: 0 },
  saveBtn: { display: "flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${LINE}`, color: "#475569", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: "9px 16px", borderRadius: 9, whiteSpace: "nowrap" },
  saveBtnOk: { background: GREEN_SOFT, borderColor: "#bbe6cc", color: "#15803d" },
  exitBtn: { display: "flex", alignItems: "center", gap: 7, background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 13.5, fontWeight: 700, cursor: "pointer", padding: "9px 16px", borderRadius: 9 },

  // horizontal categories bar — content-sized chips on the light page
  catBar: { flexShrink: 0, display: "flex", gap: 8, padding: "12px 22px", background: BG, overflowX: "auto" },
  catChip: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0, padding: "8px 15px", border: `1px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer" },
  catChipOn: { background: BLUE_SOFT, borderColor: "#bcd0fb" },
  catChipName: { fontSize: 13, fontWeight: 700, color: INK, whiteSpace: "nowrap" },
  catChipBadge: { flexShrink: 0, fontSize: 11, fontWeight: 800, color: "#94a3b8", background: "#f1f3f7", borderRadius: 6, padding: "1px 7px" },
  catChipBadgeOn: { background: "#dbe6ff", color: BLUE },
  catChipBadgeDone: { background: GREEN_SOFT, color: "#15803d" },

  grid: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "minmax(0,1fr) 300px", background: BG },
  side: { borderRight: `1px solid ${LINE}`, background: "#fff", padding: "16px 12px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 3 },
  sideLabel: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, color: "#9aa1ad", margin: "0 6px 10px" },
  secItem: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 10px", border: "1px solid transparent", borderLeft: "3px solid transparent", borderRadius: 10, background: "transparent", cursor: "pointer", textAlign: "left" },
  secItemOn: { background: BLUE_SOFT, borderColor: "#d7e0f7", borderLeftColor: BLUE },
  secIcon: { flexShrink: 0, width: 22, display: "grid", placeItems: "center" },
  secName: { display: "block", fontSize: 13.5, fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  secBadge: { flexShrink: 0, fontSize: 11.5, fontWeight: 800, color: "#94a3b8", background: "#f1f3f7", borderRadius: 7, padding: "2px 7px" },
  secBadgeOn: { background: "#dce4fb", color: BLUE },
  secBadgeDone: { background: "#dcfce7", color: "#15803d" },
  nowBox: { marginTop: 12, background: "#f6f8fc", border: `1px solid ${LINE}`, borderRadius: 11, padding: "11px 12px", display: "flex", flexDirection: "column", gap: 3 },
  nowLabel: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#94a3b8" },
  nowVal: { fontSize: 13.5, fontWeight: 800, color: BLUE },

  main: { minWidth: 0, overflowY: "auto", padding: "22px 34px 50px" },
  mainInner: { maxWidth: 760, margin: 0 },
  autoHint: { fontSize: 12.5, color: "#9aa1ad", fontWeight: 600 },
  qTopRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  qPill: { background: BLUE, color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "6px 14px", borderRadius: 999 },
  reviewBtn: { display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${LINE}`, color: MUTED, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: 9 },
  reviewOn: { background: "#fef3c7", borderColor: "#f4d06a", color: "#b45309" },
  progOuter: { height: 5, background: "#e3e7ee", borderRadius: 999, overflow: "hidden", marginBottom: 16 },
  progFill: { height: "100%", background: BLUE, borderRadius: 999, transition: "width .3s" },

  catCard: { display: "flex", gap: 14, alignItems: "center", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "15px 18px", marginBottom: 14 },
  catKicker: { fontSize: 10.5, fontWeight: 800, textTransform: "uppercase", letterSpacing: .6, color: BLUE },
  catTitle: { fontSize: 17, fontWeight: 800, margin: "3px 0 2px", color: INK },
  catBlurb: { fontSize: 13, color: MUTED, lineHeight: 1.5 },
  catIcon: { flexShrink: 0, width: 52, height: 52, borderRadius: 13, background: BLUE_SOFT, color: BLUE, display: "grid", placeItems: "center" },
  qBlock: { position: "relative" },
  qNum: { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 42, background: BLUE, color: "#fff", fontSize: 16, fontWeight: 800, padding: "6px 15px", borderRadius: 8, marginBottom: 10, marginLeft: 2 },
  qCard: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "24px 28px 14px", boxShadow: "0 2px 12px rgba(20,20,40,.05)" },
  qHead: { display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 4 },
  qText: { flex: 1, fontSize: 19, fontWeight: 700, lineHeight: 1.5, color: INK },
  qHeadBtns: { display: "flex", gap: 8, flexShrink: 0 },
  speakBtn: { width: 36, height: 36, borderRadius: "50%", background: NAVY, color: "#fff", border: "none", display: "grid", placeItems: "center", cursor: "pointer" },
  reviewIcon: { width: 36, height: 36, borderRadius: "50%", background: "#f1f5f9", color: "#9aa3b2", border: `1px solid ${LINE}`, display: "grid", placeItems: "center", cursor: "pointer" },
  reviewIconOn: { background: AMBER_SOFT, color: "#d97706", borderColor: "#fadf9a" },
  optList: { display: "flex", flexDirection: "column", borderTop: "1px solid #eef0f4", marginTop: 14 },
  optRow: { display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", padding: "13px 16px", border: "1px solid transparent", borderBottom: "1px solid #eef0f4", cursor: "pointer", outline: "none" },
  optRowOn: { border: `1px solid ${BLUE}`, borderRadius: 10, background: BLUE_SOFT },
  // One radio control for every option (text rows and SVG tiles). The ring is
  // deliberately dark enough to read against both the white card and the blue
  // selected tint — a faint hairline disappears on screen.
  radio: { flexShrink: 0, width: 20, height: 20, borderRadius: "50%", border: "2px solid #8d97a8", background: "#fff", display: "grid", placeItems: "center", boxSizing: "border-box" },
  radioOn: { borderColor: BLUE, boxShadow: `0 0 0 3px ${BLUE}1f` },
  radioDot: { width: 10, height: 10, borderRadius: "50%", background: BLUE },
  optLabel: { fontSize: 15, color: "#3a4356", lineHeight: 1.4 },
  optLabelOn: { color: INK, fontWeight: 600 },
  tapHint: { textAlign: "center", fontSize: 13, color: "#94a3b8", marginTop: 16 },
  optTag: { color: "#9aa1ad", fontWeight: 500, fontStyle: "italic" },

  mGrid: { display: "grid", gap: 6, maxWidth: 270, margin: "0 0 16px", background: "#fafbfc", padding: 8, borderRadius: 12, border: `1px solid ${LINE}` },
  mSeq: { display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap", marginBottom: 16, background: "#fafbfc", padding: 8, borderRadius: 12, border: `1px solid ${LINE}` },
  mCell: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 6, display: "grid", placeItems: "center", minHeight: 58, overflow: "hidden", padding: 2 },
  mQ: { fontSize: 22, fontWeight: 800, color: "#c2c7d0" },
  mFigure: { display: "flex", justifyContent: "center", marginBottom: 16, background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mHtml: { marginBottom: 16, overflowX: "auto", fontSize: 14 },
  mPassage: { margin: "0 0 16px", padding: "12px 16px", borderLeft: `3px solid ${BLUE}`, background: BLUE_SOFT, borderRadius: "0 10px 10px 0", fontSize: 14.5, lineHeight: 1.6, color: "#334155" },
  mImage: { maxWidth: "100%", borderRadius: 12, marginBottom: 16, border: `1px solid ${LINE}` },
  mVideo: { width: "100%", maxWidth: 480, borderRadius: 12, marginBottom: 16 },

  audioCard: { marginBottom: 16, background: BLUE_SOFT, border: "1px solid #d7e0f7", borderRadius: 12, padding: 14 },
  audioRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  audioBtn: { background: BLUE, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  audioNote: { fontSize: 13, color: "#4b6086" },
  transToggle: { background: "none", border: "none", color: BLUE, fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginTop: 8, padding: 0 },
  transText: { marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "#475569", background: "#fff", padding: 12, borderRadius: 9, border: `1px solid ${LINE}` },

  chartWrap: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 16, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  chartLegend: { display: "flex", flexDirection: "column", gap: 6 },
  chartLeg: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569" },
  barWrap: { display: "flex", flexDirection: "column", gap: 9, marginBottom: 16, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  barRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  barLabel: { width: 90, flexShrink: 0, color: "#475569" },
  barTrack: { flex: 1, height: 16, background: "#eceef2", borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8 },
  barVal: { width: 32, textAlign: "right", fontWeight: 700, color: INK },

  choices: { display: "flex", flexDirection: "column", gap: 8 },
  choice: { display: "flex", alignItems: "center", gap: 11, textAlign: "left", padding: "11px 14px", border: `1.5px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14, lineHeight: 1.4, color: "#3a4356" },
  choiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  ab: { flexShrink: 0, width: 25, height: 25, borderRadius: "50%", border: "1.5px solid #cdced8", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, color: MUTED },
  abOn: { background: BLUE, borderColor: BLUE, color: "#fff" },
  ck: { color: BLUE, display: "grid", placeItems: "center" },

  svgChoices: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(84px, 1fr))", gap: 8, maxWidth: 520 },
  svgChoice: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "8px", border: `1.5px solid ${LINE}`, borderRadius: 10, background: "#fff", cursor: "pointer", outline: "none", boxShadow: "none", WebkitTapHighlightColor: "transparent" },
  svgChoiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  svgHolder: { display: "grid", placeItems: "center", width: "100%" },

  sliderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sliderEnd: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sliderVal: { fontSize: 22, fontWeight: 800, color: BLUE, minWidth: 30, textAlign: "center" },
  slider: { width: "100%" },
  sliderTicks: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#b6bcc7", padding: "4px 2px 0" },

  mlWrap: { display: "flex", flexDirection: "column", gap: 9 },
  mlRow: { display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px" },
  mlText: { flex: 1, fontSize: 14, color: "#3a4356", lineHeight: 1.4 },
  mlBtns: { display: "flex", gap: 6, flexShrink: 0 },
  mlBtn: { padding: "6px 13px", borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", color: MUTED },
  mlMost: { background: "#dcfce7", borderColor: GREEN, color: "#15803d" },
  mlLeast: { background: "#fee2e2", borderColor: "#dc2626", color: "#b91c1c" },

  open: { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" },

  actions: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: 18, flexWrap: "wrap" },
  ghost: { display: "flex", alignItems: "center", gap: 6, padding: "12px 20px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 11, fontSize: 14, fontWeight: 700, cursor: "pointer" },
  clearBtn: { display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#94a3b8", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  next: { display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 14.5, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 20px rgba(47,91,214,.28)" },
  finish: { display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", background: GREEN, color: "#fff", border: "none", borderRadius: 11, fontSize: 14.5, fontWeight: 800, cursor: "pointer" },
  disabled: { opacity: .45, cursor: "not-allowed", boxShadow: "none" },
  hint: { fontSize: 12.5, color: "#9aa1ad", textAlign: "right", marginTop: 10 },
  err: { marginTop: 14, background: "#fbeaea", border: "1px solid #e5b3ae", color: "#a83e38", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 600 },

  nav: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "18px 16px", margin: "22px 22px 22px 6px", boxShadow: "0 2px 12px rgba(20,20,40,.04)", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 },
  navTitle: { fontSize: 15, fontWeight: 800, color: INK, marginBottom: 14, flexShrink: 0 },
  legend: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px 10px", marginBottom: 16, flexShrink: 0 },
  legItem: { display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: MUTED },
  navScroll: { overflowY: "auto", minHeight: 0, flex: 1, margin: "0 -4px", padding: "0 4px" },
  navGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, paddingBottom: 4 },
  navCell: { aspectRatio: "1", display: "grid", placeItems: "center", borderRadius: 8, fontSize: 13, fontWeight: 700, border: "1px solid transparent", cursor: "pointer", padding: 0 },
  navPend: { background: "#f1f5f9", color: "#94a3b8" },
  navAns: { background: GREEN_SOFT, color: "#15803d", borderColor: "#c9ebd5" },
  navRev: { background: AMBER_SOFT, color: "#b45309", borderColor: "#fadf9a" },
  navCur: { background: BLUE, color: "#fff", borderColor: BLUE },
  overview: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, color: "#9aa1ad", margin: "0 2px 10px" },
  donutRow: { display: "flex", gap: 12, alignItems: "center" },
  breakdown: { display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: MUTED },
  brTotal: { paddingTop: 5, borderTop: `1px solid ${LINE}`, fontWeight: 600 },
  dot: { width: 9, height: 9, borderRadius: "50%", display: "inline-block", marginRight: 6 },
  donut: { width: 96, height: 96, flexShrink: 0 },

  introWrap: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "auto", fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
  introCard: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 18, padding: "32px 34px", boxShadow: "0 16px 50px rgba(30,41,59,.12)", border: `1px solid ${LINE}` },
  introTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: INK },
  introSub: { fontSize: 13.5, color: MUTED, margin: "0 0 20px" },
  introList: { listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 12 },
  introItem: { display: "flex", gap: 11, fontSize: 14.5, lineHeight: 1.5, color: "#475569", alignItems: "flex-start" },
  introIc: { color: BLUE, flexShrink: 0, marginTop: 1 },
  disclaimer: {
    fontSize: 13, lineHeight: 1.6, color: MUTED, background: BLUE_SOFT,
    border: `1px solid ${LINE}`, borderRadius: 10, padding: "12px 14px", margin: "0 0 16px",
  },
  agree: { display: "flex", alignItems: "center", gap: 9, fontSize: 14, margin: "0 0 18px", cursor: "pointer" },
  primary: { padding: "13px 26px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  resumeStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, margin: "0 0 20px" },
  resumeStat: { background: "#f6f8fc", border: `1px solid ${LINE}`, borderRadius: 12, padding: "14px 16px", textAlign: "center" },
  resumeStatN: { fontSize: 22, fontWeight: 800, color: INK },
  resumeStatL: { fontSize: 12, color: MUTED, marginTop: 2 },
  resumeRestart: { display: "block", width: "100%", background: "none", border: "none", color: MUTED, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 12, textDecoration: "underline" },

  thanks: { position: "fixed", inset: 0, zIndex: 1200, background: "linear-gradient(160deg,#eef2fe,#eef1f6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  check: { width: 92, height: 92, borderRadius: "50%", margin: "0 auto 18px", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 34px rgba(22,163,74,.35)" },
  thanksT: { fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
};

const CSS = `
@keyframes ogSpin{to{transform:rotate(360deg)}}
.og-spin{width:44px;height:44px;border:4px solid #d7e0f7;border-top-color:${BLUE};border-radius:50%;animation:ogSpin .8s linear infinite}
@keyframes ogPop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
.og-pop{animation:ogPop .55s cubic-bezier(.2,.9,.3,1.2) both}
.og-range{accent-color:${BLUE};height:6px;width:100%}
.datatable{border-collapse:collapse;width:100%;font-size:13.5px}
.datatable th,.datatable td{border:1px solid ${LINE};padding:6px 10px;text-align:center}
.datatable th{background:${BLUE_SOFT};font-weight:700}
.og-setup{margin:0 0 8px;font-weight:600}
.og-exam-catbar::-webkit-scrollbar{height:6px}
.og-exam-catbar::-webkit-scrollbar-thumb{background:#d7dbe3;border-radius:6px}
.og-nav-scroll::-webkit-scrollbar{width:6px}
.og-nav-scroll::-webkit-scrollbar-thumb{background:#d7dbe3;border-radius:6px}
/* no black focus ring on click; keep a subtle ring for keyboard users */
.og-exam-grid button{-webkit-tap-highlight-color:transparent}
.og-exam-grid button:focus{outline:none}
.og-exam-grid button:focus-visible{outline:none;box-shadow:0 0 0 2px ${ACCENT}44}
/* Options (text rows + SVG tiles): border/highlight is FULLY state-driven —
   grey/plain when unselected, blue only when actually chosen. Never let a
   focus/keyboard/tap ring make an unselected option look boxed or selected. */
.og-exam-grid .og-svgc:focus,.og-exam-grid .og-svgc:focus-visible,
.og-exam-grid .og-opt:focus,.og-exam-grid .og-opt:focus-visible,
.og-exam-grid .og-opt:active,.og-exam-grid .og-svgc:active{outline:none !important;box-shadow:none !important}
.og-opt{transition:background .12s ease;background:transparent}
.og-opt:hover{background:#f7f9fc}
/* The radio ring answers to the SELECTED state and nothing else. Hover, focus,
   keyboard focus and the mid-tap active state must never darken one ring —
   a single dark circle among four reads to a student as the marked answer. */
.og-exam-grid .og-radio{border-color:#8d97a8 !important;box-shadow:none !important;outline:none !important}
.og-exam-grid .og-radio.on{border-color:${BLUE} !important;box-shadow:0 0 0 3px ${BLUE}1f !important}
.og-exam-grid .og-opt:hover .og-radio,.og-exam-grid .og-opt:focus .og-radio,
.og-exam-grid .og-opt:focus-visible .og-radio,.og-exam-grid .og-opt:active .og-radio,
.og-exam-grid .og-svgc:hover .og-radio,.og-exam-grid .og-svgc:focus .og-radio,
.og-exam-grid .og-svgc:focus-visible .og-radio,.og-exam-grid .og-svgc:active .og-radio{border-color:#8d97a8 !important}
.og-exam-grid .og-opt:hover .og-radio.on,.og-exam-grid .og-opt:focus .og-radio.on,
.og-exam-grid .og-opt:focus-visible .og-radio.on,.og-exam-grid .og-opt:active .og-radio.on,
.og-exam-grid .og-svgc:hover .og-radio.on,.og-exam-grid .og-svgc:focus .og-radio.on,
.og-exam-grid .og-svgc:focus-visible .og-radio.on,.og-exam-grid .og-svgc:active .og-radio.on{border-color:${BLUE} !important}
/* scale visual (SVG) matrix cells + options to fit — no giant grids / scrolling */
.og-exam-grid .og-mcell svg,.og-exam-grid .og-svgh svg{width:100% !important;height:auto !important;display:block}
.og-exam-grid .og-mfig svg{max-width:200px !important;height:auto !important;display:block}
@media (max-width: 1040px){
  .og-exam-grid{grid-template-columns:1fr !important}
  .og-exam-nav{display:none !important}
  .og-exam-grid main{padding:18px 16px 50px !important}
}
@media (max-width: 760px){
  .og-exam-catbar{overflow-x:auto}
  .og-exam-catbar button{flex:0 0 auto !important;min-width:auto !important}
  .og-exam-top{padding:8px 12px !important; gap:8px !important; flex-wrap:wrap}
  .og-exam-topmeta{display:none !important}
  .og-exam-stats{gap:8px !important; padding:6px 10px !important; order:3; width:100%; justify-content:space-between}
  /* keep TIME + QUESTION; drop ANSWERED / MARKED (and their dividers) */
  .og-exam-stats > :nth-child(n+4){display:none !important}
  .og-exam-btn-label{display:none !important}
  .og-exam-topright button{padding:9px 11px !important}
}
@media (max-width: 420px){
  .og-exam-grid main{padding:14px 12px 46px !important}
  .og-exam-introcard{padding:24px 20px !important}
}
`;
