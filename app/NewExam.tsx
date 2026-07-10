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

import { Component, useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";

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

export default function NewExam(props: { category: string; name?: string; onExit: () => void }) {
  return <ExamErrorBoundary onExit={props.onExit}><NewExamInner {...props} /></ExamErrorBoundary>;
}

function NewExamInner({ category, name, onExit }: { category: string; name?: string; onExit: () => void }) {
  const router = useRouter();
  const { saveAssessment } = useAuth();
  const [phase, setPhase] = useState<"loading" | "error" | "intro" | "exam" | "thanks">("loading");
  const [data, setData] = useState<GenData | null>(null);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [review, setReview] = useState<Record<string, boolean>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetch("/api/new-assessment/generate", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category }),
    })
      .then((r) => r.json())
      .then((j) => { if (j.success && j.data?.sections?.length) { setData(j.data); setPhase("intro"); } else { setErr(j.message || "Could not load the assessment."); setPhase("error"); } })
      .catch((e) => { setErr(String(e?.message || e)); setPhase("error"); });
  }, [category]);

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
    if (v == null || v === "") return false;
    if (qq.type === "mostleast") { const [m, l] = v.split(","); return m !== "" && m != null && l !== "" && l != null; }
    return true;
  };
  const answeredCount = useMemo(() => flat.filter((x) => !x.optional && isAnswered(x)).length, [answers, flat]); // eslint-disable-line react-hooks/exhaustive-deps
  const markedCount = Object.values(review).filter(Boolean).length;
  const allDone = answeredCount >= requiredTotal;

  const set = (id: string, v: string) => setAnswers((a) => ({ ...a, [id]: v }));
  const go = (i: number) => { if (i >= 0 && i < total) { setCur(i); window.scrollTo(0, 0); } };
  const jumpToSection = (si: number) => { const idx = flat.findIndex((f) => f.si === si); if (idx >= 0) go(idx); };

  async function startExam() {
    try { await document.documentElement.requestFullscreen?.(); } catch { /* best effort */ }
    setPhase("exam");
  }
  function exitExam() {
    try { if (document.fullscreenElement) void document.exitFullscreen(); } catch { /* ignore */ }
    onExit();
  }
  async function finish() {
    if (!data) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/new-assessment/score", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: data.stage, chosenSets: data.chosenSets, answers }),
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message || "Scoring failed");
      try { await saveAssessment(j.data); } catch { /* still continue */ }
      try { if (document.fullscreenElement) await document.exitFullscreen(); } catch { /* ignore */ }
      setPhase("thanks");
      setTimeout(() => router.push("/account"), 4200);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong"); setSubmitting(false); }
  }

  /* ---------------------------- screens ---------------------------- */
  if (phase === "loading")
    return <Center><div className="og-spin" /><div style={S.big}>Preparing your assessment…</div><div style={S.subT}>Selecting your question sets</div></Center>;

  if (phase === "error")
    return <Center><div style={{ color: "#c0564f" }}><Icon name="info" size={40} /></div><div style={S.big}>Couldn’t start the assessment</div><div style={S.subT}>{err}</div><button style={S.primary} onClick={exitExam}>Back</button></Center>;

  if (phase === "thanks")
    return (
      <div style={S.thanks}><style>{CSS}</style>
        <div className="og-pop" style={{ textAlign: "center" }}>
          <div style={S.check}><Icon name="check" size={46} stroke={2.4} /></div>
          <div style={S.thanksT}>Thank you{name ? `, ${name}` : ""}!</div>
          <div style={S.subT}>Building your report…</div>
        </div>
      </div>
    );

  if (phase === "intro" && data)
    return (
      <div style={S.introWrap}><style>{CSS}</style>
        <div style={S.introCard}>
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Before you begin</h2>
          <p style={S.introSub}>{data.sections.length} sections · {requiredTotal} questions · about 25–30 minutes</p>
          <ul style={S.introList}>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clusters" size={18} /></span><span>Questions are grouped into <b>8 categories</b>. Use the left rail or the navigator to move around freely.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="audio" size={18} /></span><span>Some questions include <b>visuals, data or audio</b> — use the <b>Play</b> button to listen where shown.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="info" size={18} /></span><span>Interest &amp; personality have <b>no wrong answers</b>. Strengths &amp; Aptitude do — take your time.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="expand" size={18} /></span><span>The test opens in <b>full screen</b> for focus. You can exit any time.</span></li>
          </ul>
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
        <style>{CSS}</style>
        {/* top bar */}
        <header style={S.top}>
          <div style={S.topLeft}>
            <span style={S.topLogo}><Logo height={24} mono /></span>
            <div><div style={S.topTitle}>Career Assessment</div><div style={S.topSub}>{requiredTotal} questions</div></div>
          </div>
          <div style={S.topMid}>
            <Stat icon="help" label="QUESTION" value={`${cur + 1} / ${total}`} />
            <div style={S.topDiv} />
            <Stat icon="check" label="ANSWERED" value={`${answeredCount}`} />
            <div style={S.topDiv} />
            <Stat icon="flag" label="MARKED" value={`${markedCount}`} />
          </div>
          <button style={S.endBtn} onClick={exitExam}><Icon name="power" size={15} /> Exit</button>
        </header>

        <div style={S.grid} className="og-exam-grid">
          {/* left: categories */}
          <aside style={S.side} className="og-exam-side">
            <div style={S.sideLabel}>Categories</div>
            {data.sections.map((s, si) => {
              const qs = s.questions.filter((x) => !x.optional);
              const a = qs.filter(isAnswered).length;
              const done = a === qs.length;
              const activeSec = q.si === si;
              return (
                <button key={s.category} onClick={() => jumpToSection(si)} style={{ ...S.secItem, ...(activeSec ? S.secItemOn : {}) }}>
                  <span style={{ ...S.secIcon, color: activeSec ? BLUE : "#94a3b8" }}><Icon name={s.category} size={19} /></span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={S.secName}>{s.title}</span>
                  </span>
                  <span style={{ ...S.secBadge, ...(done ? S.secBadgeDone : {}), ...(activeSec && !done ? S.secBadgeOn : {}) }}>{a}/{qs.length}</span>
                </button>
              );
            })}
            <div style={S.nowBox}>
              <span style={S.nowLabel}><Icon name="info" size={13} /> Currently answering</span>
              <span style={S.nowVal}>{q.catTitle}</span>
            </div>
          </aside>

          {/* centre: current question */}
          <main style={S.main}>
            <div style={S.mainInner}>
              <div style={S.qTopRow}>
                <span style={S.qPill}>Question {cur + 1} of {total}</span>
                <button style={{ ...S.reviewBtn, ...(review[q.id] ? S.reviewOn : {}) }} onClick={() => setReview((r) => ({ ...r, [q.id]: !r[q.id] }))}>
                  <Icon name="flag" size={14} /> {review[q.id] ? "Marked for review" : "Mark for review"}
                </button>
              </div>
              <div style={S.progOuter}><div style={{ ...S.progFill, width: `${pct}%` }} /></div>

              <div style={S.catCard}>
                <div style={{ flex: 1 }}>
                  <div style={S.catKicker}>Current category</div>
                  <div style={S.catTitle}>{q.catTitle}</div>
                  <div style={S.catBlurb}>{q.catBlurb}</div>
                </div>
                <span style={S.catIcon}><Icon name={q.cat} size={30} stroke={1.5} /></span>
              </div>

              <div style={S.qCard}>
                <div style={S.qText}>{q.text}{q.optional && <em style={S.optTag}> (optional)</em>}</div>
                {q.media && <MediaBlock media={q.media} />}
                <QuestionInput q={q} value={answers[q.id] ?? ""} onChange={(v) => set(q.id, v)} />
              </div>

              <div style={S.actions}>
                <button style={{ ...S.ghost, ...(cur === 0 ? S.disabled : {}) }} disabled={cur === 0} onClick={() => go(cur - 1)}><Icon name="chevronLeft" size={16} /> Previous</button>
                <button style={S.clearBtn} onClick={() => setAnswers((a) => { const n = { ...a }; delete n[q.id]; return n; })}><Icon name="xcircle" size={15} /> Clear response</button>
                {cur < total - 1 ? (
                  <button style={S.next} onClick={() => go(cur + 1)}>Next question <Icon name="chevronRight" size={16} /></button>
                ) : (
                  <button style={{ ...S.finish, ...(allDone && !submitting ? {} : S.disabled) }} disabled={!allDone || submitting} onClick={() => void finish()}>{submitting ? "Scoring…" : "Finish & see report"}</button>
                )}
              </div>
              {!allDone && cur === total - 1 && <div style={S.hint}>Answer all {requiredTotal} questions to finish ({notAnswered} left).</div>}
              {err && <div style={S.err}>{err}</div>}
            </div>
          </main>

          {/* right: navigator */}
          <aside style={S.nav} className="og-exam-nav">
            <div style={S.sideLabel}>Question navigator</div>
            <div style={S.legend}>
              <span><i style={{ ...S.dot, background: GREEN }} /> Answered</span>
              <span><i style={{ ...S.dot, background: BLUE }} /> Current</span>
              <span><i style={{ ...S.dot, background: AMBER }} /> Review</span>
              <span><i style={{ ...S.dot, background: "#d7dbe3" }} /> Pending</span>
            </div>
            <div style={S.navGrid}>
              {flat.map((f, i) => {
                const ans = isAnswered(f), rev = review[f.id], isCur = i === cur;
                const st = isCur ? S.navCur : rev ? S.navRev : ans ? S.navAns : {};
                return <button key={f.id} onClick={() => go(i)} style={{ ...S.navCell, ...st }}>{i + 1}</button>;
              })}
            </div>
            <div style={S.overview}>Progress overview</div>
            <div style={S.donutRow}>
              <Donut pct={pct} />
              <div style={S.breakdown}>
                <span><i style={{ ...S.dot, background: GREEN }} /> Answered <b>{answeredCount}</b></span>
                <span><i style={{ ...S.dot, background: AMBER }} /> Review <b>{markedCount}</b></span>
                <span><i style={{ ...S.dot, background: "#d7dbe3" }} /> Pending <b>{notAnswered}</b></span>
                <span style={S.brTotal}>Total <b>{total}</b></span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return null;
}

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={S.stat}>
      <span style={S.statIc}><Icon name={icon} size={16} /></span>
      <div><div style={S.statLabel}>{label}</div><div style={S.statVal}>{value}</div></div>
    </div>
  );
}

/* --------------------------- media rendering --------------------------- */
function MediaBlock({ media }: { media: Media }) {
  if (!media) return null;
  if (media.type === "grid") {
    const cols = media.cols ?? 3;
    return (
      <div style={{ ...S.mGrid, gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {(media.cells ?? []).map((c, i) => typeof c === "string" && c.startsWith("<svg")
          ? <div key={i} style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />
          : <div key={i} style={{ ...S.mCell, ...S.mQ }}>?</div>)}
      </div>
    );
  }
  if (media.type === "sequence")
    return <div style={S.mSeq}>{(media.items ?? []).filter((c) => typeof c === "string").map((c, i) => <div key={i} style={S.mCell} dangerouslySetInnerHTML={{ __html: c }} />)}<div style={{ ...S.mCell, ...S.mQ }}>?</div></div>;
  if (media.type === "figure") return <div style={S.mFigure} dangerouslySetInnerHTML={{ __html: media.svg || "" }} />;
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
  if (q.type === "yesno")
    return <div style={S.optRow}>{["Yes", "No"].map((o) => <button key={o} style={{ ...S.pill, ...(value === o ? S.pillOn : {}) }} onClick={() => onChange(o)}>{o}</button>)}</div>;

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
      cur[which] = cur[which] === String(idx) ? "" : String(idx);
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

  const opts = q.options ?? [];
  if (q.svgOptions)
    return (
      <div style={S.svgChoices}>
        {opts.map((o, i) => {
          const sel = value === String(i);
          return (
            <button key={i} style={{ ...S.svgChoice, ...(sel ? S.svgChoiceOn : {}) }} onClick={() => onChange(String(i))}>
              <span style={{ ...S.ab, ...(sel ? S.abOn : {}) }}>{String.fromCharCode(65 + i)}</span>
              <span style={S.svgHolder} dangerouslySetInnerHTML={{ __html: o || "" }} />
            </button>
          );
        })}
      </div>
    );

  return (
    <div style={S.choices}>
      {opts.map((o, i) => {
        const sel = value === String(i);
        const text = o ?? "";
        const label = q.type === "vark" && q.styles?.[i] ? text.replace(/^\(?[A-D]\)?\s*/, "") : text.replace(/^\d+\)\s*/, "");
        return (
          <button key={i} style={{ ...S.choice, ...(sel ? S.choiceOn : {}) }} onClick={() => onChange(String(i))}>
            <span style={{ ...S.ab, ...(sel ? S.abOn : {}) }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}>{label}</span>
            {sel && <span style={S.ck}><Icon name="check" size={16} stroke={2.4} /></span>}
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
const NAVY = "#17233f", BLUE = "#2f5bd6", BLUE_SOFT = "#eef2fe", INK = "#1f2937", MUTED = "#64748b";
const GREEN = "#16a34a", AMBER = "#f59e0b", LINE = "#e6e8ee", BG = "#eef1f6";
const S: Record<string, React.CSSProperties> = {
  center: { position: "fixed", inset: 0, zIndex: 1000, background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", textAlign: "center", padding: 24 },
  big: { fontSize: 19, fontWeight: 800, color: INK },
  subT: { fontSize: 14, color: MUTED },

  page: { position: "fixed", inset: 0, zIndex: 1000, background: BG, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK, display: "flex", flexDirection: "column" },
  // top bar
  top: { flexShrink: 0, background: NAVY, color: "#fff", padding: "10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
  topLeft: { display: "flex", alignItems: "center", gap: 11 },
  topLogo: { background: "rgba(255,255,255,.1)", borderRadius: 9, padding: "6px 8px", display: "grid", placeItems: "center" },
  topTitle: { fontSize: 15, fontWeight: 800 },
  topSub: { fontSize: 11.5, color: "#9fb0d0" },
  topMid: { display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,.07)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 12, padding: "7px 16px" },
  topDiv: { width: 1, height: 26, background: "rgba(255,255,255,.14)" },
  stat: { display: "flex", alignItems: "center", gap: 8 },
  statIc: { color: "#9fb0d0", display: "grid", placeItems: "center" },
  statLabel: { fontSize: 9.5, letterSpacing: .6, color: "#9fb0d0", fontWeight: 700 },
  statVal: { fontSize: 14.5, fontWeight: 800, lineHeight: 1.1 },
  endBtn: { display: "flex", alignItems: "center", gap: 6, background: "rgba(224,86,79,.16)", border: "1px solid rgba(224,86,79,.5)", color: "#ffb4ae", fontSize: 13, fontWeight: 700, cursor: "pointer", padding: "8px 15px", borderRadius: 9 },

  grid: { flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "252px minmax(0,1fr) 248px" },
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

  main: { minWidth: 0, overflowY: "auto", padding: "22px 26px 50px" },
  mainInner: { maxWidth: 720, margin: "0 auto" },
  qTopRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  qPill: { background: BLUE, color: "#fff", fontSize: 12.5, fontWeight: 700, padding: "6px 14px", borderRadius: 999 },
  reviewBtn: { display: "flex", alignItems: "center", gap: 6, background: "#fff", border: `1px solid ${LINE}`, color: MUTED, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "6px 12px", borderRadius: 9 },
  reviewOn: { background: "#fef3c7", borderColor: "#f4d06a", color: "#b45309" },
  progOuter: { height: 5, background: "#e3e7ee", borderRadius: 999, overflow: "hidden", marginBottom: 16 },
  progFill: { height: "100%", background: BLUE, borderRadius: 999, transition: "width .3s" },

  catCard: { display: "flex", gap: 14, alignItems: "center", background: "#fff", border: `1px solid ${LINE}`, borderRadius: 14, padding: "16px 18px", marginBottom: 14 },
  catKicker: { fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: .6, color: BLUE },
  catTitle: { fontSize: 19, fontWeight: 800, margin: "3px 0 3px", color: INK },
  catBlurb: { fontSize: 13.5, color: MUTED, lineHeight: 1.45 },
  catIcon: { flexShrink: 0, width: 58, height: 58, borderRadius: 14, background: BLUE_SOFT, color: BLUE, display: "grid", placeItems: "center" },

  qCard: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 3px rgba(20,20,40,.04)" },
  qText: { fontSize: 17, fontWeight: 700, lineHeight: 1.5, color: INK, marginBottom: 18 },
  optTag: { color: "#9aa1ad", fontWeight: 500, fontStyle: "italic" },

  mGrid: { display: "grid", gap: 8, maxWidth: 380, margin: "0 0 16px", background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mSeq: { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16, background: "#fafbfc", padding: 10, borderRadius: 12, border: `1px solid ${LINE}` },
  mCell: { background: "#fff", border: `1px solid ${LINE}`, borderRadius: 8, display: "grid", placeItems: "center", minHeight: 84, overflow: "hidden" },
  mQ: { fontSize: 30, fontWeight: 800, color: "#c2c7d0" },
  mFigure: { display: "flex", justifyContent: "center", marginBottom: 16, background: "#fafbfc", padding: 12, borderRadius: 12, border: `1px solid ${LINE}` },
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

  optRow: { display: "flex", gap: 10 },
  pill: { flex: 1, padding: "13px", border: `1.5px solid ${LINE}`, borderRadius: 11, background: "#fff", fontWeight: 700, cursor: "pointer", color: "#475569" },
  pillOn: { borderColor: BLUE, background: BLUE_SOFT, color: BLUE },

  choices: { display: "flex", flexDirection: "column", gap: 9 },
  choice: { display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "13px 15px", border: `1.5px solid ${LINE}`, borderRadius: 12, background: "#fff", cursor: "pointer", fontSize: 14.5, color: "#334155" },
  choiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  ab: { flexShrink: 0, width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #cdced8", display: "grid", placeItems: "center", fontWeight: 700, fontSize: 12.5, color: MUTED },
  abOn: { background: BLUE, borderColor: BLUE, color: "#fff" },
  ck: { color: BLUE, display: "grid", placeItems: "center" },

  svgChoices: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 },
  svgChoice: { display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "12px", border: `1.5px solid ${LINE}`, borderRadius: 12, background: "#fff", cursor: "pointer" },
  svgChoiceOn: { borderColor: BLUE, background: BLUE_SOFT },
  svgHolder: { display: "grid", placeItems: "center" },

  sliderTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sliderEnd: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  sliderVal: { fontSize: 22, fontWeight: 800, color: BLUE, minWidth: 30, textAlign: "center" },
  slider: { width: "100%" },
  sliderTicks: { display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#b6bcc7", padding: "4px 2px 0" },

  mlWrap: { display: "flex", flexDirection: "column", gap: 9 },
  mlRow: { display: "flex", alignItems: "center", gap: 12, border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px" },
  mlText: { flex: 1, fontSize: 14, color: "#334155" },
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

  nav: { borderLeft: `1px solid ${LINE}`, background: "#fff", padding: "16px 14px", overflowY: "auto" },
  legend: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, fontSize: 11.5, color: MUTED, marginBottom: 14 },
  navGrid: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6, marginBottom: 18 },
  navCell: { aspectRatio: "1", display: "grid", placeItems: "center", borderRadius: 8, background: "#f0f2f5", color: "#64748b", fontSize: 12.5, fontWeight: 700, border: "1px solid transparent", cursor: "pointer", padding: 0 },
  navAns: { background: "#dcfce7", color: "#15803d", borderColor: "#bbe6cc" },
  navRev: { background: "#fef3c7", color: "#b45309", borderColor: "#f4d06a" },
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
  agree: { display: "flex", alignItems: "center", gap: 9, fontSize: 14, margin: "0 0 18px", cursor: "pointer" },
  primary: { padding: "13px 26px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },

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
@media (max-width: 1040px){
  .og-exam-grid{grid-template-columns:1fr !important}
  .og-exam-side,.og-exam-nav{display:none !important}
  .og-exam-grid main{padding:18px 16px 50px !important}
}
`;
