"use client";

/**
 * NewExam — the set-based career assessment, section by section.
 *
 * Layout (calm, light, full-screen): left = the 8 category sections with live
 * progress; centre = every question of the current section on one scrolling
 * page; right = a question navigator + overall progress donut. Complete a
 * section, then Continue. No explanations are ever shown.
 *
 * Robust media system — questions may carry a `media` block: reasoning visuals
 * (SVG grid / sequence / figure), data tables, reading passages, audio (spoken
 * via the browser), images, video, or pie/bar charts. Inputs cover Yes/No,
 * choose-one (text or SVG options), 1–10 slider, most/least, and open response.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";

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
  id: string;
  type: string;
  text: string;
  options: string[] | null;
  styles: string[] | null;
  format: string | null;
  svgOptions: boolean;
  media: Media;
  optional?: boolean;
};
type Section = { category: string; title: string; blurb: string; questions: Q[] };
type GenData = { stage: string; chosenSets: Record<string, string>; sections: Section[] };

const CAT_ICON: Record<string, string> = {
  personality: "🧭",
  career_interest: "🎯",
  multiple_intelligence: "🧠",
  emotional_intelligence: "💬",
  learning_styles: "📚",
  motivators: "⚡",
  strengths: "🧩",
  aptitude: "📐",
};

export default function NewExam({ category, name, onExit }: { category: string; name?: string; onExit: () => void }) {
  const router = useRouter();
  const { saveAssessment } = useAuth();
  const [phase, setPhase] = useState<"loading" | "error" | "intro" | "exam" | "thanks">("loading");
  const [data, setData] = useState<GenData | null>(null);
  const [sec, setSec] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");
  const mainRef = useRef<HTMLElement | null>(null);

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
  const totalQ = useMemo(
    () => data?.sections.reduce((n, s) => n + s.questions.filter((x) => !x.optional).length, 0) ?? 0,
    [data]
  );

  const isAnswered = (q: Q) => {
    const v = answers[q.id];
    if (v == null || v === "") return false;
    if (q.type === "mostleast") { const [m, l] = v.split(","); return m !== "" && m != null && l !== "" && l != null; }
    return true;
  };
  const answeredCount = useMemo(() => {
    if (!data) return 0;
    let n = 0;
    for (const s of data.sections) for (const q of s.questions) if (!q.optional && isAnswered(q)) n++;
    return n;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, data]);

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const sectionAnswered = (s: Section) => s.questions.filter((q) => !q.optional && isAnswered(q)).length;
  const sectionDone = section ? section.questions.every((q) => q.optional || isAnswered(q)) : false;

  const scrollTop = () => { mainRef.current?.scrollTo({ top: 0, behavior: "smooth" }); window.scrollTo(0, 0); };

  function goSection(i: number) {
    if (!data) return;
    if (i < 0 || i >= data.sections.length) return;
    if (i > maxReached) return; // can't skip ahead past the furthest reached
    setSec(i); scrollTop();
  }
  function nextSection() {
    if (!data || !sectionDone) return;
    if (sec < data.sections.length - 1) {
      const n = sec + 1;
      setSec(n); setMaxReached((m) => Math.max(m, n)); scrollTop();
    }
  }

  async function startExam() {
    try { await document.documentElement.requestFullscreen?.(); } catch { /* best effort */ }
    setPhase("exam");
  }

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
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* ignore */ }
      setPhase("thanks");
      setTimeout(() => router.push("/account"), 4200);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  function exitExam() {
    try { if (document.fullscreenElement) void document.exitFullscreen(); } catch { /* ignore */ }
    onExit();
  }

  /* ---------------------------- screens ---------------------------- */
  if (phase === "loading")
    return <Center><div className="og-spin" /><div style={S.big}>Preparing your assessment…</div><div style={S.sub}>Selecting your question sets</div></Center>;

  if (phase === "error")
    return <Center><div style={{ fontSize: 40 }}>⚠️</div><div style={S.big}>Couldn’t start the assessment</div><div style={S.sub}>{err}</div><button style={S.primary} onClick={exitExam}>Back</button></Center>;

  if (phase === "thanks")
    return (
      <div style={S.thanks}>
        <style>{CSS}</style>
        <div className="og-pop" style={{ textAlign: "center" }}>
          <div style={S.check}>✓</div>
          <div style={S.thanksT}>Thank you{name ? `, ${name}` : ""}!</div>
          <div style={S.sub}>Building your report…</div>
        </div>
      </div>
    );

  if (phase === "intro" && data)
    return (
      <div style={S.introWrap}>
        <style>{CSS}</style>
        <div style={S.introCard}>
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Before you begin</h2>
          <p style={S.introSub}>{data.sections.length} sections · {totalQ} questions · about 25–30 minutes</p>
          <ul style={S.introList}>
            <li style={S.introItem}>🗂️ <span>You’ll go one <b>section at a time</b>. Answer every question in a section, then continue.</span></li>
            <li style={S.introItem}>🎧 <span>Some questions include <b>visuals, data or audio</b> — use the <b>▶ Play</b> button to listen where shown.</span></li>
            <li style={S.introItem}>💡 <span>For interest and personality there are <b>no wrong answers</b>. Strengths &amp; Aptitude do have correct answers — take your time.</span></li>
            <li style={S.introItem}>⛶ <span>The test opens in <b>full screen</b> for focus. You can exit any time.</span></li>
          </ul>
          <label style={S.agree}><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> I’m ready to begin.</label>
          <button style={{ ...S.primary, width: "100%", ...(agree ? {} : S.disabled) }} disabled={!agree} onClick={() => void startExam()}>Start assessment →</button>
        </div>
      </div>
    );

  if (phase === "exam" && data && section) {
    const pct = Math.round((answeredCount / (totalQ || 1)) * 100);
    return (
      <div style={S.page}>
        <style>{CSS}</style>
        {/* top bar */}
        <header style={S.head}>
          <div style={S.headLeft}><Logo height={26} /><span style={S.headTitle}>Career Assessment</span></div>
          <div style={S.headMid}>
            <span style={S.headStat}><b>Section</b> {sec + 1} / {data.sections.length}</span>
            <span style={S.headStat}><b>Answered</b> {answeredCount} / {totalQ}</span>
          </div>
          <button style={S.exit} onClick={exitExam}>Exit</button>
        </header>
        <div style={S.progOuter}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>

        <div style={S.grid} className="og-exam-grid">
          {/* left: sections */}
          <aside style={S.side} className="og-exam-side">
            <div style={S.sideLabel}>Sections</div>
            {data.sections.map((s, i) => {
              const done = s.questions.filter((q) => !q.optional).every(isAnswered);
              const cur = i === sec;
              const locked = i > maxReached;
              const a = sectionAnswered(s), t = s.questions.filter((q) => !q.optional).length;
              return (
                <button key={s.category} onClick={() => goSection(i)} disabled={locked}
                  style={{ ...S.secItem, ...(cur ? S.secItemOn : {}), ...(locked ? S.secLocked : {}) }}>
                  <span style={S.secIcon}>{CAT_ICON[s.category] || "•"}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={S.secName}>{s.title}</span>
                    <span style={S.secCount}>{done ? "Complete" : `${a} / ${t}`}</span>
                  </span>
                  {done && <span style={S.secDone}>✓</span>}
                </button>
              );
            })}
          </aside>

          {/* centre: questions */}
          <main ref={mainRef} style={S.main}>
            <div style={S.secHead}>
              <div style={S.secStep}>Section {sec + 1} of {data.sections.length} · {CAT_ICON[section.category]}</div>
              <h1 style={S.secTitle}>{section.title}</h1>
              <p style={S.secBlurb}>{section.blurb}</p>
            </div>

            {section.questions.map((q, qi) => (
              <div key={q.id} id={`q-${q.id}`} style={{ ...S.qCard, ...(review[q.id] ? S.qCardReview : {}) }}>
                <div style={S.qTop}>
                  <span style={S.qNo}>{qi + 1}</span>
                  <span style={S.qText}>{q.text}{q.optional && <em style={S.optTag}> (optional)</em>}</span>
                  <button
                    style={{ ...S.reviewBtn, ...(review[q.id] ? S.reviewOn : {}) }}
                    onClick={() => setReview((r) => ({ ...r, [q.id]: !r[q.id] }))}
                    title="Mark for review"
                  >⚑</button>
                </div>
                {q.media && <MediaBlock media={q.media} />}
                <QuestionInput q={q} value={answers[q.id] ?? ""} onChange={(v) => set(q.id, v)} />
              </div>
            ))}

            <div style={S.footer}>
              <button style={{ ...S.ghost, ...(sec === 0 ? S.disabled : {}) }} disabled={sec === 0} onClick={() => goSection(sec - 1)}>← Previous</button>
              {sec < data.sections.length - 1 ? (
                <button style={{ ...S.primary, ...(sectionDone ? {} : S.disabled) }} disabled={!sectionDone} onClick={nextSection}>Continue →</button>
              ) : (
                <button style={{ ...S.submit, ...(sectionDone && !submitting ? {} : S.disabled) }} disabled={!sectionDone || submitting} onClick={() => void finish()}>{submitting ? "Scoring…" : "Finish & see my report"}</button>
              )}
            </div>
            {!sectionDone && <div style={S.hint}>Answer every question in this section to continue.</div>}
            {err && <div style={S.err}>{err}</div>}
          </main>

          {/* right: navigator + donut */}
          <aside style={S.nav} className="og-exam-nav">
            <div style={S.sideLabel}>This section</div>
            <div style={S.navGrid}>
              {section.questions.map((q, qi) => {
                const ans = isAnswered(q);
                const rev = review[q.id];
                return (
                  <a key={q.id} href={`#q-${q.id}`}
                    style={{ ...S.navCell, ...(ans ? S.navAns : {}), ...(rev ? S.navRev : {}) }}>{qi + 1}</a>
                );
              })}
            </div>
            <div style={S.legend}>
              <span><i style={{ ...S.dot, background: GREEN }} /> Answered</span>
              <span><i style={{ ...S.dot, background: AMBER }} /> Review</span>
              <span><i style={{ ...S.dot, background: "#d7dbe3" }} /> Pending</span>
            </div>
            <Donut pct={pct} />
            <div style={S.donutLabel}>{answeredCount} of {totalQ} answered</div>
          </aside>
        </div>
      </div>
    );
  }

  return null;
}

/* --------------------------- media rendering --------------------------- */
function MediaBlock({ media }: { media: Media }) {
  if (!media) return null;
  if (media.type === "grid") {
    const cols = media.cols ?? 3;
    return (
      <div style={{ ...S.mGrid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {media.cells.map((c, i) =>
          c.startsWith("<svg")
            ? <div key={i} style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />
            : <div key={i} style={{ ...S.mCell, ...S.mQ }}>?</div>
        )}
      </div>
    );
  }
  if (media.type === "sequence")
    return (
      <div style={S.mSeq}>
        {media.items.map((c, i) => <div key={i} style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />)}
        <div style={{ ...S.mCell, ...S.mQ }}>?</div>
      </div>
    );
  if (media.type === "figure")
    return <div style={S.mFigure} dangerouslySetInnerHTML={{ __html: media.svg }} />;
  if (media.type === "html")
    return <div style={S.mHtml} dangerouslySetInnerHTML={{ __html: media.html }} />;
  if (media.type === "passage")
    return <blockquote style={S.mPassage}>{media.text}</blockquote>;
  if (media.type === "tts")
    return <AudioQuestion text={media.text} />;
  if (media.type === "image")
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={media.src} alt={media.alt || ""} style={S.mImage} />;
  if (media.type === "audio")
    return <audio controls src={media.src} style={{ width: "100%", marginBottom: 14 }} />;
  if (media.type === "video")
    return <video controls src={media.src} style={S.mVideo} />;
  if (media.type === "chart")
    return <ChartBlock chartType={media.chartType} data={media.data} />;
  return null;
}

/** Listening question — speaks the text via the browser (no audio file needed). */
function AudioQuestion({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [showText, setShowText] = useState(false);
  const play = () => {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95; u.onend = () => setSpeaking(false); u.onerror = () => setSpeaking(false);
      setSpeaking(true); synth.speak(u);
    } catch { setSpeaking(false); }
  };
  const stop = () => { try { window.speechSynthesis.cancel(); } catch { /* ignore */ } setSpeaking(false); };
  return (
    <div style={S.audioCard}>
      <div style={S.audioRow}>
        <button style={S.audioBtn} onClick={speaking ? stop : play}>{speaking ? "⏹ Stop" : "▶ Play audio"}</button>
        <span style={S.audioNote}>🎧 Listen carefully — you can replay it.</span>
      </div>
      <button style={S.transToggle} onClick={() => setShowText((s) => !s)}>{showText ? "Hide transcript" : "Show transcript"}</button>
      {showText && <div style={S.transText}>{text}</div>}
    </div>
  );
}

function ChartBlock({ chartType, data }: { chartType: "pie" | "bar"; data: { label: string; value: number }[] }) {
  const COLORS = ["#4f6b9e", "#6f9e7f", "#c9a24b", "#a4708a", "#7a8aa8", "#8a9e6f"];
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  if (chartType === "pie") {
    let acc = 0;
    const R = 70, C = 90;
    return (
      <div style={S.chartWrap}>
        <svg viewBox="0 0 180 180" width="180" height="180">
          {data.map((d, i) => {
            const a0 = (acc / total) * 2 * Math.PI; acc += d.value;
            const a1 = (acc / total) * 2 * Math.PI;
            const x0 = C + R * Math.sin(a0), y0 = C - R * Math.cos(a0);
            const x1 = C + R * Math.sin(a1), y1 = C - R * Math.cos(a1);
            const large = a1 - a0 > Math.PI ? 1 : 0;
            return <path key={i} d={`M${C},${C} L${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} Z`} fill={COLORS[i % COLORS.length]} />;
          })}
        </svg>
        <div style={S.chartLegend}>
          {data.map((d, i) => <span key={i} style={S.chartLeg}><i style={{ ...S.dot, background: COLORS[i % COLORS.length] }} />{d.label} ({Math.round((d.value / total) * 100)}%)</span>)}
        </div>
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
  const r = 42, c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 110 110" style={S.donut}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="#eceef2" strokeWidth="11" />
      <circle cx="55" cy="55" r={r} fill="none" stroke={PRIMARY} strokeWidth="11" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 55 55)" style={{ transition: "stroke-dashoffset .4s" }} />
      <text x="55" y="61" textAnchor="middle" fontSize="22" fontWeight="800" fill="#1f2937">{pct}%</text>
    </svg>
  );
}

/* ------------------------- per-type question input ---------------------- */
function QuestionInput({ q, value, onChange }: { q: Q; value: string; onChange: (v: string) => void }) {
  if (q.type === "yesno")
    return (
      <div style={S.optRow}>
        {["Yes", "No"].map((o) => (
          <button key={o} style={{ ...S.pill, ...(value === o ? S.pillOn : {}) }} onClick={() => onChange(o)}>{o}</button>
        ))}
      </div>
    );

  if (q.type === "slider") {
    const v = value === "" ? 0 : parseInt(value, 10);
    return (
      <div>
        <div style={S.sliderTop}><span style={S.sliderEnd}>1 · Not like me</span><span style={S.sliderVal}>{v ? v : "—"}</span><span style={S.sliderEnd}>Exactly like me · 10</span></div>
        <input type="range" min={1} max={10} step={1} value={v || 1} onChange={(e) => onChange(e.target.value)} style={S.slider} className="og-range" />
        <div style={S.sliderTicks}>{Array.from({ length: 10 }, (_, i) => <span key={i}>{i + 1}</span>)}</div>
      </div>
    );
  }

  if (q.type === "mostleast") {
    const [most, least] = value.split(",");
    const setPart = (which: 0 | 1, idx: number) => {
      const cur = value.split(","); cur[0] = cur[0] ?? ""; cur[1] = cur[1] ?? "";
      cur[which] = cur[which] === String(idx) ? "" : String(idx); // toggle off if re-clicked
      if (cur[0] !== "" && cur[0] === cur[1]) cur[which === 0 ? 1 : 0] = "";
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

  if (q.type === "open")
    return <textarea style={S.open} rows={3} placeholder="Type your response (optional)…" value={value} onChange={(e) => onChange(e.target.value)} />;

  // choose-one: mcq / choice5 / choice4 / vark — text or SVG options
  const opts = q.options ?? [];
  if (q.svgOptions)
    return (
      <div style={S.svgChoices}>
        {opts.map((o, i) => {
          const sel = value === String(i);
          return (
            <button key={i} style={{ ...S.svgChoice, ...(sel ? S.svgChoiceOn : {}) }} onClick={() => onChange(String(i))}>
              <span style={{ ...S.ab, ...(sel ? S.abOn : {}) }}>{String.fromCharCode(65 + i)}</span>
              <span style={S.svgHolder} dangerouslySetInnerHTML={{ __html: o }} />
            </button>
          );
        })}
      </div>
    );

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

/* ------------------------------- styling ------------------------------- */
const PRIMARY = "#4f6b9e", PRIMARY_SOFT = "#eef2f8", INK = "#1f2937", MUTED = "#6b7280";
const GREEN = "#2f9e6f", AMBER = "#d99a2b", LINE = "#e5e7eb", BG = "#f6f7f9";
const S: Record<string, React.CSSProperties> = {
  center: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  big: { fontSize: 19, fontWeight: 800, color: INK },
  sub: { fontSize: 14, color: MUTED },

  page: { position: "fixed", inset: 0, zIndex: 1000, background: BG, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK, display: "flex", flexDirection: "column" },
  head: { flexShrink: 0, background: "#fff", borderBottom: `1px solid ${LINE}`, padding: "11px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  headLeft: { display: "flex", alignItems: "center", gap: 12 },
  headTitle: { fontSize: 14.5, fontWeight: 700, color: INK, borderLeft: `1px solid ${LINE}`, paddingLeft: 12 },
  headMid: { display: "flex", gap: 18 },
  headStat: { fontSize: 13, color: MUTED },
  exit: { background: "#fff", border: `1px solid ${LINE}`, color: MUTED, fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "7px 15px", borderRadius: 9 },
  progOuter: { flexShrink: 0, height: 3, background: "#eceef2" },
  progFill: { height: "100%", background: PRIMARY, transition: "width .3s" },

  grid: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "246px minmax(0,1fr) 232px", gap: 0 },
  side: { borderRight: `1px solid ${LINE}`, background: "#fff", padding: "16px 12px", overflowY: "auto" },
  sideLabel: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .7, color: "#9aa1ad", margin: "0 6px 10px" },
  secItem: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 10px", border: "1px solid transparent", borderRadius: 11, background: "transparent", cursor: "pointer", textAlign: "left", marginBottom: 3 },
  secItemOn: { background: PRIMARY_SOFT, border: `1px solid #d7e0ef` },
  secLocked: { opacity: .45, cursor: "not-allowed" },
  secIcon: { fontSize: 17, flexShrink: 0, width: 22, textAlign: "center" },
  secName: { display: "block", fontSize: 13.5, fontWeight: 700, color: INK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  secCount: { display: "block", fontSize: 11.5, color: MUTED, marginTop: 1 },
  secDone: { color: GREEN, fontWeight: 800, flexShrink: 0 },

  main: { minWidth: 0, overflowY: "auto", padding: "26px 34px 60px" },
  secHead: { maxWidth: 760, margin: "0 auto 18px" },
  secStep: { fontSize: 12, fontWeight: 800, textTransform: "uppercase", letterSpacing: .6, color: PRIMARY },
  secTitle: { fontSize: 27, fontWeight: 800, margin: "6px 0 6px", color: INK },
  secBlurb: { fontSize: 15, color: MUTED, margin: 0, lineHeight: 1.5 },
  qCard: { maxWidth: 760, margin: "0 auto 14px", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 15, padding: "18px 20px", boxShadow: "0 1px 2px rgba(20,20,40,.03)" },
  qCardReview: { borderColor: "#f0d59a", boxShadow: "0 0 0 2px #fbf3e2" },
  qTop: { display: "flex", gap: 11, marginBottom: 13, alignItems: "flex-start" },
  qNo: { flexShrink: 0, width: 25, height: 25, borderRadius: 7, background: PRIMARY_SOFT, color: PRIMARY, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 12.5 },
  qText: { flex: 1, fontSize: 15.5, fontWeight: 600, lineHeight: 1.45, color: INK },
  optTag: { color: "#9aa1ad", fontWeight: 500, fontStyle: "italic" },
  reviewBtn: { flexShrink: 0, background: "none", border: `1px solid ${LINE}`, borderRadius: 8, width: 28, height: 28, cursor: "pointer", color: "#c2c7d0", fontSize: 13 },
  reviewOn: { background: "#fbf3e2", borderColor: "#f0d59a", color: AMBER },

  // media
  mGrid: { display: "grid", gap: 8, maxWidth: 380, margin: "0 0 14px", background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mSeq: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 14, background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mCell: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, display: "grid", placeItems: "center", minHeight: 84, overflow: "hidden" },
  mQ: { fontSize: 30, fontWeight: 800, color: "#c2c7d0" },
  mFigure: { display: "flex", justifyContent: "center", marginBottom: 14, background: "#fafbfc", padding: 12, borderRadius: 12, border: `1px solid ${LINE}` },
  mHtml: { marginBottom: 14, overflowX: "auto", fontSize: 14 },
  mPassage: { margin: "0 0 14px", padding: "12px 16px", borderLeft: `3px solid ${PRIMARY}`, background: PRIMARY_SOFT, borderRadius: "0 10px 10px 0", fontSize: 14.5, lineHeight: 1.6, color: "#334155" },
  mImage: { maxWidth: "100%", borderRadius: 12, marginBottom: 14, border: `1px solid ${LINE}` },
  mVideo: { width: "100%", maxWidth: 480, borderRadius: 12, marginBottom: 14 },

  audioCard: { marginBottom: 14, background: PRIMARY_SOFT, border: `1px solid #d7e0ef`, borderRadius: 12, padding: 14 },
  audioRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  audioBtn: { background: PRIMARY, color: "#fff", border: "none", borderRadius: 9, padding: "9px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  audioNote: { fontSize: 13, color: "#4b6086" },
  transToggle: { background: "none", border: "none", color: PRIMARY, fontSize: 12.5, fontWeight: 700, cursor: "pointer", marginTop: 8, padding: 0 },
  transText: { marginTop: 8, fontSize: 14, lineHeight: 1.6, color: "#475569", background: "#fff", padding: 12, borderRadius: 9, border: `1px solid ${LINE}` },

  chartWrap: { display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap", marginBottom: 14, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  chartLegend: { display: "flex", flexDirection: "column", gap: 6 },
  chartLeg: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#475569" },
  barWrap: { display: "flex", flexDirection: "column", gap: 9, marginBottom: 14, background: "#fafbfc", padding: 14, borderRadius: 12, border: `1px solid ${LINE}` },
  barRow: { display: "flex", alignItems: "center", gap: 10, fontSize: 13 },
  barLabel: { width: 90, flexShrink: 0, color: "#475569" },
  barTrack: { flex: 1, height: 16, background: "#eceef2", borderRadius: 8, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 8 },
  barVal: { width: 32, textAlign: "right", fontWeight: 700, color: INK },

  // inputs
  optRow: { display: "flex", gap: 10 },
  pill: { flex: 1, padding: "12px", border: `1.5px solid ${LINE}`, borderRadius: 11, background: "#fff", fontWeight: 700, cursor: "pointer", color: "#475569" },
  pillOn: { borderColor: PRIMARY, background: PRIMARY_SOFT, color: PRIMARY },

  choices: { display: "flex", flexDirection: "column", gap: 8 },
  choice: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "12px 14px", border: `1.5px solid ${LINE}`, borderRadius: 12, background: "#fff", cursor: "pointer", fontSize: 14.5, color: "#334155" },
  choiceOn: { borderColor: PRIMARY, background: PRIMARY_SOFT },
  ab: { flexShrink: 0, width: 27, height: 27, borderRadius: "50%", border: `1.5px solid #cdced8`, display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12, color: MUTED },
  abOn: { background: PRIMARY, borderColor: PRIMARY, color: "#fff" },
  ck: { color: PRIMARY, fontWeight: 800 },

  svgChoices: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 },
  svgChoice: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px", border: `1.5px solid ${LINE}`, borderRadius: 12, background: "#fff", cursor: "pointer" },
  svgChoiceOn: { borderColor: PRIMARY, background: PRIMARY_SOFT },
  svgHolder: { display: "grid", placeItems: "center" },

  sliderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sliderEnd: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sliderVal: { fontSize: 22, fontWeight: 800, color: PRIMARY, minWidth: 30, textAlign: "center" },
  slider: { width: "100%" },
  sliderTicks: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#b6bcc7", padding: "4px 2px 0" },

  mlWrap: { display: "flex", flexDirection: "column", gap: 8 },
  mlRow: { display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px" },
  mlText: { flex: 1, fontSize: 14, color: "#334155" },
  mlBtns: { display: "flex", gap: 6, flexShrink: 0 },
  mlBtn: { padding: "6px 13px", borderRadius: 8, border: `1px solid ${LINE}`, background: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", color: MUTED },
  mlMost: { background: "#e6f4ee", borderColor: GREEN, color: "#1c7a52" },
  mlLeast: { background: "#fbeaea", borderColor: "#c0564f", color: "#a83e38" },

  open: { width: "100%", padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${LINE}`, fontSize: 14.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" },

  footer: { maxWidth: 760, margin: "22px auto 0", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" },
  ghost: { padding: "12px 22px", background: "#fff", color: "#475569", border: `1px solid #cbd5e1`, borderRadius: 11, fontSize: 14.5, fontWeight: 700, cursor: "pointer" },
  primary: { padding: "13px 26px", background: PRIMARY, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  submit: { padding: "13px 26px", background: GREEN, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  disabled: { opacity: .45, cursor: "not-allowed" },
  hint: { maxWidth: 760, margin: "10px auto 0", fontSize: 12.5, color: "#9aa1ad", textAlign: "right" },
  err: { maxWidth: 760, margin: "14px auto 0", background: "#fbeaea", border: "1px solid #e5b3ae", color: "#a83e38", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, fontWeight: 600 },

  // right navigator
  nav: { borderLeft: `1px solid ${LINE}`, background: "#fff", padding: "16px 14px", overflowY: "auto" },
  navGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 12 },
  navCell: { aspectRatio: "1", display: "grid", placeItems: "center", borderRadius: 8, background: "#f0f2f5", color: "#64748b", fontSize: 12.5, fontWeight: 700, textDecoration: "none", border: "1px solid transparent" },
  navAns: { background: "#e6f4ee", color: "#1c7a52", borderColor: "#bfe3d1" },
  navRev: { background: "#fbf3e2", color: AMBER, borderColor: "#f0d59a" },
  legend: { display: "flex", flexDirection: "column", gap: 5, fontSize: 11.5, color: MUTED, marginBottom: 16 },
  dot: { width: 9, height: 9, borderRadius: "50%", display: "inline-block", marginRight: 6 },
  donut: { width: 110, height: 110, display: "block", margin: "0 auto" },
  donutLabel: { textAlign: "center", fontSize: 12, color: MUTED, marginTop: 4 },

  introWrap: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, overflow: "auto", fontFamily: "Inter, system-ui, Segoe UI, sans-serif" },
  introCard: { width: "100%", maxWidth: 560, background: "#fff", borderRadius: 18, padding: "32px 34px", boxShadow: "0 16px 50px rgba(30,41,59,.12)", border: `1px solid ${LINE}` },
  introTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 4px", color: INK },
  introSub: { fontSize: 13.5, color: MUTED, margin: "0 0 20px" },
  introList: { listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: 12 },
  introItem: { display: "flex", gap: 10, fontSize: 14.5, lineHeight: 1.5, color: "#475569" },
  agree: { display: "flex", alignItems: "center", gap: 9, fontSize: 14, margin: "0 0 18px", cursor: "pointer" },

  thanks: { position: "fixed", inset: 0, zIndex: 1200, background: "linear-gradient(160deg,#eef2f8,#f6f7f9)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  check: { width: 92, height: 92, borderRadius: "50%", margin: "0 auto 18px", background: "linear-gradient(135deg,#2f9e6f,#37b07d)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, fontWeight: 800, boxShadow: "0 14px 34px rgba(47,158,111,.35)" },
  thanksT: { fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
};

const CSS = `
@keyframes ogSpin{to{transform:rotate(360deg)}}
.og-spin{width:44px;height:44px;border:4px solid #d7e0ef;border-top-color:${PRIMARY};border-radius:50%;animation:ogSpin .8s linear infinite}
@keyframes ogPop{0%{opacity:0;transform:scale(.6)}60%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
.og-pop{animation:ogPop .55s cubic-bezier(.2,.9,.3,1.2) both}
.og-range{accent-color:${PRIMARY};height:6px;width:100%}
.datatable{border-collapse:collapse;width:100%;font-size:13.5px}
.datatable th,.datatable td{border:1px solid ${LINE};padding:6px 10px;text-align:center}
.datatable th{background:${PRIMARY_SOFT};font-weight:700}
.og-setup{margin:0 0 8px;font-weight:600}
@media (max-width: 1024px){
  .og-exam-grid{grid-template-columns:1fr !important}
  .og-exam-side,.og-exam-nav{display:none !important}
  .og-exam-grid main{padding:20px 16px 60px !important}
}
`;
