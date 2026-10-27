"use client";

/**
 * NewExam - the set-based career assessment, one question at a time in a
 * professional exam console: dark top bar with live counters, left CATEGORY
 * rail (the 8 sections with progress), centre question card, right QUESTION
 * NAVIGATOR + progress donut. Full-screen. No explanations shown.
 *
 * Robust media system - a question may carry a `media` block: reasoning visuals
 * (SVG grid / sequence / figure), data tables, reading passages, audio (spoken
 * via the browser), images, video, or pie/bar charts. Inputs cover Yes/No,
 * choose-one (text or SVG options), 1–10 slider, most/least, and open response.
 */

import { Component, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { assessmentQuality } from "@/lib/assessmentQuality";
import { useRouter } from "next/navigation";
import { useAuth, type ExamSession } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { DOMAINS_1112, careersByDomain, CAREERS_1112 } from "@/lib/report/careerfit1112";
import { UG_DOMAINS, coursesForDegree, degreeInfo } from "@/lib/report/degreeTaxonomyGrad";
import { CAREER_CLUSTERS_18, CLUSTER_ROLES } from "@/lib/report/careerClustersGrad";
import { S, CSS, Stat, Radio, BLUE, BLUE_SOFT, INK, GREEN, AMBER } from "@/app/examTheme";

// Same canonical stream keys/order as STREAM_KEY_BY_INDEX in
// app/api/new-assessment/score/route.ts and STREAM_DOMAIN_FIT in
// scoring11_12.ts. "Other" maps to STREAM_KEY_BY_INDEX's "" downstream - kept
// as a non-empty sentinel here so it stays distinguishable from "nothing
// selected yet" in the <select>'s own value.
const STREAM_OTHER = "OTHER";
// Commerce is split by Maths because it changes stream-fit outcomes for the
// whole Maths-gated career group (Data Science, Finance, Actuarial,
// Statistics...) in lib/report/careerfit1112.ts's Career_Roadmap_Matrix -
// see STREAM_KEY_1112 there. score/route.ts still buckets both into the
// single coarse "Commerce" value the older subject_fit.currentStream field
// expects, while the exact choice is preserved separately for the new
// Fitment/Suitability/Selector matching.
const STREAM_OPTIONS: { key: string; label: string }[] = [
  { key: "MPC", label: "Science (Maths focus): MPC / PCM / Non-Medical" },
  { key: "BiPC", label: "Science (Biology focus): BiPC / PCB / Medical" },
  { key: "PCMB", label: "Science (Both): PCMB" },
  { key: "CommerceMaths", label: "Commerce with Maths: MEC" },
  { key: "CommerceNoMaths", label: "Commerce without Maths: CEC" },
  { key: "Arts", label: "Humanities / Arts" },
  { key: "Vocational", label: "Vocational / Diploma" },
  { key: STREAM_OTHER, label: "Other" },
];

// Graduates (UG) pre-exam picker options. The desired-career field is
// deliberately wide and degree/stream-independent - every unique job role
// across all 17 UG career clusters (~3,300 roles from the Excel source),
// grouped by cluster, plus a final "Other researched careers" group for any
// CAREERS_1112 name (the 360-career researched set already used by Class
// 11-12) not already covered by those cluster role lists. Rendered via
// SearchableSelect (below), not a free-text + native <datalist> field -
// <datalist> is unreliable at this scale across browsers (confirmed: a real
// entry like "Software Engineer" silently failed to surface while typing).
// SearchableSelect avoids that failure mode entirely by rendering its own
// filtered list from local state instead of leaning on each browser's own
// datalist/autocomplete implementation.
const CAREER_GROUPS_GRAD: { group: string; options: string[] }[] = (() => {
  const covered = new Set<string>();
  const groups = CAREER_CLUSTERS_18.map((cluster) => {
    const roles = (CLUSTER_ROLES[cluster] ?? []).slice().sort((a, b) => a.localeCompare(b));
    roles.forEach((r) => covered.add(r));
    return { group: cluster, options: roles };
  });
  const extra = CAREERS_1112.map((c) => c.name).filter((n) => !covered.has(n)).sort((a, b) => a.localeCompare(b));
  if (extra.length) groups.push({ group: "Other researched careers", options: extra });
  return groups;
})();

const GRAD_YEAR_OPTIONS: { key: string; label: string }[] = [
  { key: "1", label: "1st Year" },
  { key: "2", label: "2nd Year" },
  { key: "3", label: "3rd Year" },
  { key: "4", label: "4th Year / Final Year" },
  { key: "other", label: "Integrated / Other" },
];

// The report shows this back as a single reference number (a Ring on the
// Class 12 exam page) but never uses it to filter or rank anything - the
// mapping kit's own logic is explicit that "the score itself is ignored for
// matching". A precise number was overkill for something purely contextual,
// so this collects a band instead and stores its midpoint.
const PERCENTAGE_BANDS: { label: string; value: number }[] = [
  { label: "Below 50%", value: 45 },
  { label: "50% – 60%", value: 55 },
  { label: "60% – 70%", value: 65 },
  { label: "70% – 80%", value: 75 },
  { label: "80% – 90%", value: 85 },
  { label: "Above 90%", value: 95 },
];

const preS = {
  label: { display: "block", fontSize: 13.5, fontWeight: 700, color: "#1e293b", margin: "18px 0 7px" },
  select: { width: "100%", padding: "12px 14px", fontSize: 14.5, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", color: "#1e293b" },
  input: { width: "100%", padding: "12px 14px", fontSize: 14.5, border: "1px solid #cbd5e1", borderRadius: 10, background: "#fff", color: "#1e293b" },
};

// A searchable career picker - both the 11-12 and UG career lists have grown
// to 300+ options across many groups, too many to scan as a plain <select>.
// This is deliberately NOT a free-text input + native <datalist> (see
// CAREER_GROUPS_GRAD's own comment above: that was tried and abandoned -
// <datalist> silently failed to surface real entries like "Software
// Engineer" while typing, unreliably, across browsers). This instead
// renders its own filtered dropdown from local state - a controlled input
// plus a manually-rendered, clickable list - so there's no dependence on
// each browser's own autocomplete/datalist implementation at all.
function SearchableSelect({ groups, value, onChange, placeholder }: {
  groups: { group: string; options: string[] }[];
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? groups
        .map((g) => ({ group: g.group, options: g.options.filter((o) => o.toLowerCase().includes(q)) }))
        .filter((g) => g.options.length > 0)
    : groups;
  const totalMatches = filtered.reduce((n, g) => n + g.options.length, 0);

  function pick(option: string) {
    onChange(option);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <input
        style={preS.input}
        type="text"
        value={open ? query : value}
        placeholder={placeholder}
        onFocus={() => setQuery("")}
        onClick={() => setOpen(true)}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") { setOpen(false); setQuery(""); }
          else if (e.key === "Enter" && filtered[0]?.options.length) { e.preventDefault(); pick(filtered[0].options[0]); }
        }}
      />
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 20,
          maxHeight: 280, overflowY: "auto", background: "#fff", border: "1px solid #cbd5e1",
          borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,.14)",
        }}>
          {totalMatches === 0 ? (
            <div style={{ padding: "12px 14px", fontSize: 13.5, color: "#64748b" }}>No matches - try a different search term.</div>
          ) : (
            filtered.map((g) => (
              <div key={g.group}>
                <div style={{ padding: "7px 14px", fontSize: 11, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#94a3b8", background: "#f8fafc", position: "sticky", top: 0 }}>{g.group}</div>
                {g.options.map((o) => (
                  <div
                    key={o}
                    onMouseDown={(e) => { e.preventDefault(); pick(o); }}
                    style={{ padding: "9px 14px", fontSize: 14, color: "#1e293b", cursor: "pointer", background: o === value ? "#eff6ff" : "#fff" }}
                  >
                    {o}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Short chip labels so all categories fit the bar without horizontal scroll.
const SHORT_CAT: Record<string, string> = {
  personality: "Personality", career_interest: "Interests", multiple_intelligence: "Intelligences",
  emotional_intelligence: "Emotional", learning_styles: "Learning", motivators: "Motivators",
  strengths: "Strengths", aptitude: "Aptitude", creativity: "Creativity",
  subject_fit: "Subjects", career_fit: "Career Fit", career_selector: "Careers",
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
  /** How many options a "multiple_with_grouping" question allows - Infinity
   *  for "select all that apply", otherwise the count the question's own
   *  instruction asked for. Undefined defaults to a single selection. */
  maxSelect?: number;
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
 * Rather than fork the exam engine - 1,000 lines of question rendering,
 * navigation, autosave and resume that must not diverge - the difference is
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
  const [phase, setPhase] = useState<"loading" | "error" | "preinfo" | "intro" | "resume" | "exam" | "thanks" | "already">("loading");
  const [data, setData] = useState<GenData | null>(null);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  // Class 11/12 pre-exam screen - current stream + desired career (+ Class
  // 12's estimated percentage) collected before the timed exam starts. See
  // the "preinfo" phase render below and PRE_EXAM_SKIP in the generate route.
  const [preStream, setPreStream] = useState("");
  const [preCareer, setPreCareer] = useState("");
  const [prePercentage, setPrePercentage] = useState("");
  // Graduates (UG) pre-exam screen - degree/course cascading picker + year
  // + desired career, in place of 11-12's stream picker. See the "preinfo"
  // phase render below (stage === "ug" branch) and PRE_EXAM_SKIP in the
  // generate route. No separate "field" step - every UG_DOMAINS entry maps
  // to a disjoint set of degrees (verified: no degree sits under two
  // domains), so degree alone already determines the field via degreeInfo().
  const [preDegree, setPreDegree] = useState("");
  const [preCourse, setPreCourse] = useState("");
  const [preYear, setPreYear] = useState("");
  const [preGradCareer, setPreGradCareer] = useState("");
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
    // without being asked - which is exactly what pressing the browser's Back
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
            setPhase(j.data.stage === "11-12" || j.data.stage === "ug" ? "preinfo" : "intro");
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

  // Seconds spent on each question - only to judge, at submit, whether the
  // paper was rushed (lib/assessmentQuality.ts). Never affects scoring.
  const qTimes = useRef<Record<string, number>>({});
  const qOpen = useRef<{ id: string | null; at: number }>({ id: null, at: 0 });
  const tickQuestionTime = useCallback(() => {
    const open = qOpen.current;
    if (open.id) qTimes.current[open.id] = (qTimes.current[open.id] ?? 0) + (Date.now() - open.at) / 1000;
    qOpen.current = { id: phase === "exam" ? flat[cur]?.id ?? null : null, at: Date.now() };
  }, [phase, flat, cur]);
  useEffect(() => { tickQuestionTime(); }, [tickQuestionTime]);
  const requiredTotal = useMemo(() => flat.filter((x) => !x.optional).length, [flat]);

  const isAnswered = (qq: { id: string; type: string; optional?: boolean }) => {
    const v = answers[qq.id];
    return v != null && v !== "";
  };
  const answeredCount = useMemo(() => flat.filter((x) => !x.optional && isAnswered(x)).length, [answers, flat]); // eslint-disable-line react-hooks/exhaustive-deps
  const markedCount = Object.values(review).filter(Boolean).length;
  const allDone = answeredCount >= requiredTotal;

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  // Selecting an option records it and nothing else - advancing is the student's
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
  useEffect(() => { // auto-save every 60s
    // Widened from 20s: this timer-based save is a redundant safety net on
    // top of the per-question-navigation save right below (which already
    // fires on the far more common "lost progress" case - moving on from a
    // question). On Firestore's free Spark tier, the 20s interval alone
    // could add ~270 writes per student over a full 90-minute exam; at 60s
    // that's ~90, a real difference at 20+ concurrent students on a plan
    // with a hard daily write cap and no warning before it's hit.
    if (phase !== "exam") return;
    const id = window.setInterval(() => saveNow(), 60000);
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

  // Class 11/12 pre-exam screen -> intro. Recorded into the same `answers`
  // object as everything else (under synthetic "preinfo:*" keys) so it rides
  // along through the normal save/resume/submit path with no other plumbing
  // - see applyPreExamAnswers() in app/api/new-assessment/score/route.ts.
  function continueFromPreInfo() {
    if (data?.stage === "ug") {
      setAnswers((a) => ({
        ...a,
        "preinfo:domain": degreeInfo(preDegree)?.domain ?? "",
        "preinfo:degree": preDegree,
        "preinfo:course": preCourse,
        "preinfo:year": preYear,
        "preinfo:career": preGradCareer.trim(),
      }));
      setPhase("intro");
      return;
    }
    const stream = preStream === STREAM_OTHER ? "" : preStream;
    setAnswers((a) => ({
      ...a,
      "preinfo:stream": stream,
      "preinfo:career": preCareer,
      ...(category === "class_12" ? { "preinfo:percentage": prePercentage } : {}),
    }));
    setPhase("intro");
  }

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
        setData(j.data); setAnswers({}); setReview({}); setCur(0); setRemainingSec(TOTAL_SEC);
        setPreStream(""); setPreCareer(""); setPrePercentage("");
        setPreDegree(""); setPreCourse(""); setPreYear(""); setPreGradCareer("");
        setPhase(j.data.stage === "11-12" || j.data.stage === "ug" ? "preinfo" : "intro");
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
          stage: data.stage, chosenSets: data.chosenSets, answers, category,
          ...(scoring?.extraBody ?? {}),
        }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message || "Scoring failed");
      tickQuestionTime();
      const quality = assessmentQuality({
        orderedIds: flat.map((x) => x.id), answers, secondsPerQuestion: qTimes.current, durationSec: TOTAL_SEC - remainingSec,
      });
      // Saved with the result so the student's institution can see how far to trust it.
      const summary = { ...(scoring ? scoring.pickSummary(j.data) : j.data), quality };
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
      // those steps - the completion screen sends them straight to the
      // dashboard instead - so it matters that it fires on every submit.
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
      // session, so anything that lands back on the exam URL - the browser
      // Back button most of all - would otherwise find no session to resume and
      // silently generate a brand-new exam. See the guard on mount.
      try { sessionStorage.setItem(JUST_FINISHED, "1"); } catch { /* private mode */ }

      // No auto-redirect. The dashboard is one click away on the completion
      // screen, but the student decides when to take it - a timed jump would
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
  // of silently starting a new one - the student almost always wants their
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
          <p style={S.introSub}>You have an assessment in progress - pick up right where you left off.</p>
          <div style={S.resumeStats}>
            <div style={S.resumeStat}><div style={S.resumeStatN}>{answeredCount}/{requiredTotal}</div><div style={S.resumeStatL}>answered</div></div>
            <div style={S.resumeStat}><div style={{ ...S.resumeStatN, color: remainingSec < 300 ? "#dc2626" : BLUE }}>{fmtTime(remainingSec)}</div><div style={S.resumeStatL}>time left</div></div>
          </div>
          <button style={{ ...S.primary, width: "100%" }} onClick={() => void resumeExam()}>Resume assessment →</button>
          <button style={S.resumeRestart} onClick={() => void restartExam()}>Start over from the beginning</button>
        </div>
      </div>
    );

  if (phase === "preinfo" && data && data.stage === "ug") {
    const availableCourses = preDegree ? coursesForDegree(preDegree) : [];
    const canContinue = preDegree !== "" && preCourse !== "" && preYear !== "" && preGradCareer.trim() !== "";
    return (
      <div style={S.introWrap}><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>A couple of quick questions</h2>
          <p style={S.introSub}>Before the timed assessment starts, tell us about what you're studying right now.</p>

          <label style={preS.label}>What is your degree?</label>
          <select style={preS.select} value={preDegree} onChange={(e) => { setPreDegree(e.target.value); setPreCourse(""); }}>
            <option value="" disabled>Select your degree…</option>
            {UG_DOMAINS.map((d) => (
              <optgroup key={d.name} label={d.name}>
                {d.degrees.map((deg) => <option key={deg} value={deg}>{deg}</option>)}
              </optgroup>
            ))}
          </select>

          <label style={preS.label}>What is your course / specialization?</label>
          <select style={preS.select} value={preCourse} disabled={!preDegree} onChange={(e) => setPreCourse(e.target.value)}>
            <option value="" disabled>{preDegree ? "Select your course…" : "Select a degree first…"}</option>
            {availableCourses.map((c) => <option key={c.course} value={c.course}>{c.course}</option>)}
          </select>

          <label style={preS.label}>What year are you in?</label>
          <select style={preS.select} value={preYear} onChange={(e) => setPreYear(e.target.value)}>
            <option value="" disabled>Select your year…</option>
            {GRAD_YEAR_OPTIONS.map((y) => <option key={y.key} value={y.key}>{y.label}</option>)}
          </select>

          <label style={preS.label}>Which one specific career role would you most like to explore right now?</label>
          <SearchableSelect groups={CAREER_GROUPS_GRAD} value={preGradCareer} onChange={setPreGradCareer} placeholder="Search for a career…" />

          <button
            style={{ ...S.primary, width: "100%", marginTop: 22, ...(canContinue ? {} : S.disabled) }}
            disabled={!canContinue}
            onClick={continueFromPreInfo}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "preinfo" && data) {
    const isClass12 = category === "class_12";
    const classWord = category === "class_11" ? "Class 11" : category === "class_12" ? "Class 12" : "your class";
    const pctNum = parseFloat(prePercentage);
    const pctValid = !isClass12 || (prePercentage.trim() !== "" && !Number.isNaN(pctNum) && pctNum >= 0 && pctNum <= 100);
    const canContinue = preStream !== "" && preCareer !== "" && pctValid;
    // Sourced from lib/report/careerfit1112.ts (the 25-domain/63-career
    // Class 11-12 fitment model, not the shared 15-domain catalogue) so a
    // selection here always resolves exactly in the Career Selector match -
    // see findCareer1112() in lib/report/careerFitEngine1112.ts.
    const careersByDomainMap = careersByDomain();
    const careerGroups1112 = DOMAINS_1112.map((d) => ({
      group: d.name,
      options: (careersByDomainMap.get(d.name) ?? []).map((c) => c.name),
    }));
    return (
      <div style={S.introWrap}><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>A couple of quick questions</h2>
          <p style={S.introSub}>Before the timed assessment starts, tell us a bit about {classWord === "your class" ? "yourself" : `your ${classWord} year`}.</p>

          <label style={preS.label}>What is your current stream?</label>
          <select style={preS.select} value={preStream} onChange={(e) => setPreStream(e.target.value)}>
            <option value="" disabled>Select your stream…</option>
            {STREAM_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>

          <label style={preS.label}>What is your desired career - the one you're aiming for?</label>
          <SearchableSelect groups={careerGroups1112} value={preCareer} onChange={setPreCareer} placeholder="Search for a career…" />

          {isClass12 && (
            <>
              <label style={preS.label}>Estimated percentage / expected score in your board or entrance exam (JEE, NEET, CUET, etc.)</label>
              <select
                style={preS.select}
                value={prePercentage}
                onChange={(e) => setPrePercentage(e.target.value)}
              >
                <option value="" disabled>Select a range…</option>
                {PERCENTAGE_BANDS.map((b) => <option key={b.label} value={String(b.value)}>{b.label}</option>)}
              </select>
            </>
          )}

          <button
            style={{ ...S.primary, width: "100%", marginTop: 22, ...(canContinue ? {} : S.disabled) }}
            disabled={!canContinue}
            onClick={continueFromPreInfo}
          >
            Continue →
          </button>
        </div>
      </div>
    );
  }

  if (phase === "intro" && data)
    return (
      <div style={S.introWrap}><style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Before you begin</h2>
          <p style={S.introSub}>Up to <b>90 minutes</b></p>
          <ul style={S.introList}>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clock" size={18} /></span><span>You have <b>90 minutes</b>. The timer runs at the top - it auto-submits when it reaches zero.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clusters" size={18} /></span><span>Tap an answer and it <b>moves to the next question</b> automatically. Use the category bar or navigator to jump around.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="check" size={18} /></span><span><b>Save progress</b> any time - if you close and sign back in, you’ll resume from here with the same questions and time.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="expand" size={18} /></span><span>The test opens in <b>full screen</b> for focus. You can exit any time.</span></li>
          </ul>
          {/* Set expectations before the first answer, not only at the end:
              the result reflects what the student tells us, so answering
              honestly matters more than answering impressively. */}
          <p style={S.disclaimer}>
            Your results come from <b>your own answers</b>, read through established
            psychometric frameworks. There are no right or wrong answers, and nothing
            here is a limit on what you can become. Answer honestly rather than
            impressively; a picture of who you actually are is far more useful to you
            than a flattering one.
          </p>
          <label style={S.agree}><input type="checkbox" style={{ width: 18, height: 18, accentColor: BLUE, flexShrink: 0 }} checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I’m ready to begin.</label>
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
                    button - "Previous" alone on screen reads as a dead end. */}
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
        <span style={S.audioNote}>Listen carefully - you can replay it.</span>
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

/**
 * Many options across this bank are written "Label: rest of the option" or
 * "Label — rest of the option" (e.g. "Building: Coding, assembling, or
 * fixing something.") - bolds just the short leading label so it reads as
 * a heading within the row, not the whole sentence. Anchored to the START
 * of the string and capped at 40 chars before the separator, so a colon or
 * dash that shows up naturally deep in an ordinary sentence is never
 * mistaken for a label.
 */
function OptionLabelText({ text }: { text: string }) {
  const m = text.match(/^([^.:—]{1,40}?)\s*(:|—)\s*(.*)$/s);
  if (!m) return <>{text}</>;
  const [, lead, sep, rest] = m;
  return (
    <>
      <b>{lead}{sep}</b>{rest ? " " + rest : ""}
    </>
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
        <div style={S.sliderTop}><span style={S.sliderEnd}>1 · {minLabel}</span><span style={S.sliderVal}>{v ? v : "-"}</span><span style={S.sliderEnd}>{maxLabel} · 10</span></div>
        <input type="range" min={1} max={10} step={1} value={v || 1} onChange={(e) => onChange(e.target.value)} style={S.slider} className="og-range" />
        <div style={S.sliderTicks}>{Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
      </div>
    );
  }

  if (q.type === "open")
    return <textarea style={S.open} rows={3} placeholder="Type your response (optional)…" value={value} onChange={(e) => onChange(e.target.value)} />;

  // Aptitude visual options (SVG) - same radio control as the text rows, so
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
    const maxSelections = q.maxSelect ?? 1;
    const currentSelections = value ? JSON.parse(value) : [];
    const canSelect = currentSelections.length < maxSelections;
    // Career Selector's two "up to THREE" questions (career_selector:1/2)
    // each pick from the same 210-career master list, and career_fit:0
    // ("Which areas are you currently considering?" - shifted from index 1
    // to 0 after the clarity question ahead of it was removed) picks up to
    // 3 from 24 fields — a one-per-row checkbox list (and, before that,
    // wrapped chips) rendered all of them inline, making the PAGE itself
    // very long/heavy. A collapsed search-dropdown fixes that: closed by
    // default (just your up-to-3 picks as removable tags), and the full
    // list only appears inside its own small panel when you click in —
    // that panel scrolls internally, the page doesn't have to. Scoped to
    // just these three question ids on purpose — every other multi-select
    // in the app (short option counts, longer descriptive option text)
    // stays the original checkbox-row layout, which reads better for those.
    const useDropdown = q.id === "career_selector:1" || q.id === "career_selector:2" || q.id === "career_fit:0";
    if (useDropdown) {
      return <CareerMultiPicker opts={opts} value={value} maxSelections={maxSelections} onChange={onChange} />;
    }
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
              <span style={{ ...S.optLabel, ...(isSelected ? S.optLabelOn : {}) }}><OptionLabelText text={label} /></span>
            </button>
          );
        })}
        {maxSelections !== Infinity && <div style={{ padding: "8px 16px", fontSize: 12, color: "#666" }}>{currentSelections.length} of {maxSelections} selected</div>}
      </div>
    );
  }

  // subject_fit:2/3 ("Which subject do you enjoy the most?" / "...find most
  // difficult?") as a custom dropdown instead of a 15-row radio list — a
  // NATIVE <select> was tried first, but its open panel is positioned
  // entirely by the browser (opens upward when there isn't enough room
  // below, which this app can't override). A custom panel we position
  // ourselves always opens downward instead.
  if (q.id === "subject_fit:2" || q.id === "subject_fit:3") {
    return <SubjectSinglePicker opts={q.options ?? []} value={value} onChange={onChange} />;
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
            <span style={{ ...S.optLabel, ...(sel ? S.optLabelOn : {}) }}><OptionLabelText text={label} /></span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * A single-select dropdown for subject_fit:2/3 - closed by default showing
 * just the current pick (or a placeholder), opening a panel positioned
 * below the trigger ourselves (unlike a native <select>, which the browser
 * can flip upward when it decides there isn't enough room below).
 */
function SubjectSinglePicker({ opts, value, onChange }: { opts: string[]; value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const selectedIndex = value !== "" && value != null ? parseInt(value, 10) : null;

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <button
        type="button"
        style={{ ...S.pickerBox, ...(open ? S.pickerBoxOpen : {}), width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}
        onClick={() => setOpen((o) => !o)}
      >
        <span style={{ flex: 1, color: selectedIndex != null ? INK : "#9aa1ad", fontSize: 14.5 }}>
          {selectedIndex != null ? opts[selectedIndex] : "Select a subject…"}
        </span>
        <Icon name="chevronRight" size={16} style={{ flexShrink: 0, color: "#9aa1ad", transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .15s" }} />
      </button>
      {open && (
        <div style={S.pickerPanel}>
          {opts.map((o, i) => (
            <button
              key={i}
              type="button"
              style={{ ...S.pickerRow, ...(i === selectedIndex ? { background: BLUE_SOFT, color: INK, fontWeight: 600 } : {}) }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onChange(String(i)); setOpen(false); }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A collapsed search-dropdown for picking up to `maxSelections` options out
 * of a very long list (career_selector's 210-career master list) without
 * ever rendering all of them inline in the page. Closed state shows only
 * the current picks as removable tags plus a search box; opening it drops a
 * small panel with its own internal scroll (never the page) listing
 * whatever matches the typed search, empty search showing everything.
 */
function CareerMultiPicker({ opts, value, maxSelections, onChange }: { opts: string[]; value: string; maxSelections: number; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);
  const currentSelections: string[] = value ? JSON.parse(value) : [];
  const canSelect = currentSelections.length < maxSelections;

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function select(i: number) {
    if (!canSelect) return;
    onChange(JSON.stringify([...currentSelections, String(i)]));
    setSearch("");
    if (currentSelections.length + 1 >= maxSelections) setOpen(false);
  }
  function remove(i: number) {
    onChange(JSON.stringify(currentSelections.filter((x) => x !== String(i))));
  }

  const needle = search.trim().toLowerCase();
  const filtered = opts
    .map((o, i) => ({ o, i }))
    .filter(({ o, i }) => !currentSelections.includes(String(i)) && (!needle || o.toLowerCase().includes(needle)));

  return (
    <div ref={boxRef} style={{ position: "relative" }}>
      <div style={{ ...S.pickerBox, ...(open ? S.pickerBoxOpen : {}) }} onClick={() => canSelect && setOpen(true)}>
        {currentSelections.map((idxStr) => {
          const i = parseInt(idxStr, 10);
          return (
            <span key={i} style={S.pickerTag}>
              {opts[i]}
              <button type="button" style={S.pickerTagX} onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); remove(i); }}>×</button>
            </span>
          );
        })}
        {canSelect && (
          <input
            style={S.pickerInput}
            placeholder={currentSelections.length === 0 ? "Click to browse all options, or type to search…" : "Add another…"}
            value={search}
            onFocus={() => setOpen(true)}
            onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          />
        )}
        {canSelect && <Icon name="chevronRight" size={16} style={{ flexShrink: 0, color: "#9aa1ad", transform: open ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .15s" }} />}
      </div>
      <div style={{ padding: "8px 2px 0", fontSize: 12, color: "#666" }}>
        {currentSelections.length} of {maxSelections} selected
        {canSelect && !open && <span> — click the box above to see every option</span>}
      </div>
      {open && canSelect && (
        <div style={S.pickerPanel}>
          {filtered.length === 0 ? (
            <div style={S.pickerEmpty}>No matches</div>
          ) : (
            filtered.map(({ o, i }) => (
              <button key={i} type="button" style={S.pickerRow} onMouseDown={(e) => e.preventDefault()} onClick={() => select(i)}>
                {o}
              </button>
            ))
          )}
        </div>
      )}
    </div>
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
