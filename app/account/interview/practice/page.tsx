"use client";
/**
 * /account/interview/practice - a mock interview: one question at a time,
 * answer out loud (camera optional, for self-view and playback - the video
 * never leaves the device) or in writing, then feedback from
 * /api/interview/feedback: content scores, delivery (pace, fillers, pauses)
 * and a stronger version of the student's own answer.
 */
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { scopedKey } from "@/lib/progress/userStorage";
import { CATEGORIES, QUESTIONS, type CatKey, type InterviewQ } from "@/lib/interview/questions";
import { JobReadyShell, authedPost } from "@/components/jobready/JobReadyShell";
import { addReview, loadRoleQuestions, saveRoleQuestions, type RoleQuestion } from "@/components/jobready/useResume";
import { startBrowserStt, type BrowserTranscript } from "@/lib/speech/browserStt";
import { useAuth } from "@/lib/auth/AuthProvider";
import { stageOf } from "@/lib/resume/resume";

const MAX_SEC = 180;
const AUDIO_MIME = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg"];
const VIDEO_MIME = ["video/webm;codecs=vp8,opus", "video/webm", "video/mp4"];
const pick = (list: string[]) => (typeof MediaRecorder === "undefined" ? "" : list.find((m) => MediaRecorder.isTypeSupported?.(m)) ?? "");
const ext = (mime: string) => (mime.includes("mp4") ? "mp4" : mime.includes("ogg") ? "ogg" : "webm");

interface Report {
  transcript: string;
  delivery: { durationSec: number; wpm: number; fillers: number; fillersPerMin: number; longPauses: number } | null;
  scores?: { relevance: number; structure: number; specifics: number; impression: number };
  total?: number;
  strengths?: string[];
  improvements?: string[];
  improved?: string;
  unscored?: string;
}

export default function PracticePage() {
  return <JobReadyShell><Suspense fallback={null}><Practice /></Suspense></JobReadyShell>;
}

function shuffle<T>(a: T[]): T[] { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

function Practice() {
  const params = useSearchParams();
  const [set, setSet] = useState<InterviewQ[] | null>(null);
  const [i, setI] = useState(0);
  const [results, setResults] = useState<Record<string, number>>({});
  const [role, setRole] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    const id = params.get("q");
    const one = QUESTIONS.find((x) => x.id === id);
    if (one) setSet([one]);
    // ?role= from "Jobs for you" ("Practise for it"); otherwise the last role used here.
    const fromJob = params.get("role");
    try { setRole(fromJob || localStorage.getItem(scopedKey("onegrasp.interview.role")) || ""); } catch { setRole(fromJob || ""); }
  }, [params]);

  const start = (cat: CatKey | "mixed") => {
    const pool = cat === "mixed" ? QUESTIONS.filter((x) => x.cat !== "admission") : QUESTIONS.filter((x) => x.cat === cat);
    setSet(cat === "mixed" ? [QUESTIONS[0], ...shuffle(pool.slice(1)).slice(0, 4)] : shuffle(pool).slice(0, 5));
    setI(0); setResults({});
  };
  const saveRole = (v: string) => { setRole(v); try { localStorage.setItem(scopedKey("onegrasp.interview.role"), v); } catch { /* storage blocked */ } };
  // Questions written for this role by the AI (kept, so a second round doesn't regenerate them).
  const roleRound = async () => {
    const target = role.trim();
    setErr("");
    const kept = loadRoleQuestions();
    let qs = kept && kept.target.toLowerCase() === target.toLowerCase() ? kept.questions : null;
    if (!qs) {
      setBusy(true);
      try {
        qs = (await authedPost<{ questions: RoleQuestion[] }>("/api/resume/ai", { action: "questions", target, stage: stageOf(profile?.category) })).questions;
        saveRoleQuestions({ target, questions: qs });
      } catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); return; } finally { setBusy(false); }
    }
    if (!qs.length) { setErr("No questions came back - try a clearer role name."); return; }
    setSet(shuffle(qs).slice(0, 5).map((x, n) => ({ id: `custom-${n}`, cat: "situational", q: x.q, why: "Whether you have the knowledge and judgement this role needs.", how: x.how, answer: "", avoid: "" })));
    setI(0); setResults({});
  };

  if (!set) {
    return (
      <>
        <div className="mi-head"><h1>Mock interview</h1><p>Five questions, one at a time. Answer out loud as if the interviewer were in front of you - then see feedback on what you said and how you said it.</p></div>
        <div className="mi-card" style={{ marginTop: 16 }}>
          <label className="mi-label" htmlFor="mi-role">What are you preparing for? <small>(optional - makes the feedback specific)</small></label>
          <input id="mi-role" className="mi-in" value={role} onChange={(e) => saveRole(e.target.value)} placeholder="e.g. Data analyst internship, B.Tech admission, scholarship interview" />
          <h2 style={{ margin: "18px 0 8px", fontSize: 15, fontWeight: 600 }}>Choose a round</h2>
          <div className="mi-rounds">
            <button className="mi-round is-role" disabled={busy || role.trim().length < 3} onClick={() => void roleRound()}><b>{busy ? "Writing your questions…" : "Questions for my role"}</b><small>{role.trim().length >= 3 ? `5 role-specific questions for ${role.trim()}, written by AI` : "Type the role above first"}</small></button>
            <button className="mi-round" onClick={() => start("mixed")}><b>Quick round</b><small>&quot;Tell me about yourself&quot; plus 4 mixed questions</small></button>
            {CATEGORIES.map((c) => <button key={c.key} className="mi-round" onClick={() => start(c.key)}><b>{c.label}</b><small>5 questions · {c.text}</small></button>)}
          </div>
          {err && <p className="mi-err">{err}</p>}
        </div>
        <Privacy />
        <style dangerouslySetInnerHTML={{ __html: MI_CSS }} />
      </>
    );
  }

  const q = set[i];
  const finished = i >= set.length;
  if (finished) {
    const scores = Object.values(results);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    return (
      <>
        <div className="mi-card" style={{ marginTop: 16, textAlign: "center" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 22 }}>Round complete</h1>
          <p className="fp-muted" style={{ fontSize: 14 }}>{avg != null ? <>Your average across {scores.length} reviewed answer{scores.length === 1 ? "" : "s"}: <b style={{ color: "var(--ink)" }}>{avg}/100</b>.</> : "You practised every question - that's what builds confidence."}</p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 12 }}>
            <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => setSet(null)}>Another round</button>
            <Link href="/account/interview" className="fp-btn fp-btn-sm">Review the questions</Link>
          </div>
        </div>
        <style dangerouslySetInnerHTML={{ __html: MI_CSS }} />
      </>
    );
  }

  return (
    <>
      <div className="mi-top">
        <span>Question {i + 1} of {set.length}</span>
        <button className="fp-link" style={{ fontSize: 13 }} onClick={() => setSet(null)}>End round</button>
      </div>
      <Answer key={`${q.id}-${i}`} q={q} role={role} last={i === set.length - 1} onNext={(score) => { if (score != null) setResults((r) => ({ ...r, [q.id]: score })); setI(i + 1); }} />
      <Privacy />
      <style dangerouslySetInnerHTML={{ __html: MI_CSS }} />
    </>
  );
}

function Privacy() {
  return <p className="fp-muted" style={{ marginTop: 14, fontSize: 12.5 }}><Icon name="shield" size={13} stroke={2} /> Your camera video stays on this device - it&apos;s only for you to watch back. For feedback, the sound of your answer is sent for speech-to-text and isn&apos;t stored.</p>;
}

function Answer({ q, role, last, onNext }: { q: InterviewQ; role: string; last: boolean; onNext: (score: number | null) => void }) {
  const [camera, setCamera] = useState(false);
  const [phase, setPhase] = useState<"ready" | "recording" | "recorded" | "typing" | "sending" | "result">("ready");
  const [sec, setSec] = useState(0);
  const [err, setErr] = useState("");
  const [typed, setTyped] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [playback, setPlayback] = useState<{ url: string; video: boolean } | null>(null);
  const [showModel, setShowModel] = useState(false);
  const live = useRef<HTMLVideoElement>(null);
  const r = useRef<{ stream?: MediaStream; audio?: MediaRecorder; video?: MediaRecorder; audioChunks: Blob[]; videoChunks: Blob[]; tick?: number; audioBlob?: Blob; stt?: { stop: () => Promise<BrowserTranscript> }; heard?: Promise<BrowserTranscript> }>({ audioChunks: [], videoChunks: [] });
  const supported = typeof window !== "undefined" && typeof MediaRecorder !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  const stopStream = () => { r.current.stream?.getTracks().forEach((t) => t.stop()); r.current.stream = undefined; };
  useEffect(() => () => { stopStream(); window.clearInterval(r.current.tick); if (playback) URL.revokeObjectURL(playback.url); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Camera preview while ready/recording.
  useEffect(() => {
    let off = false;
    if (camera && (phase === "ready" || phase === "recording")) {
      if (!r.current.stream) {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: true }).then((s) => {
          if (off) { s.getTracks().forEach((t) => t.stop()); return; }
          r.current.stream = s;
          if (live.current) { live.current.srcObject = s; void live.current.play().catch(() => undefined); }
        }).catch(() => { setErr("The camera isn't available - you can still answer with sound only."); setCamera(false); });
      } else if (live.current && live.current.srcObject !== r.current.stream) { live.current.srcObject = r.current.stream; }
    }
    if (!camera && r.current.stream && phase === "ready") stopStream();
    return () => { off = true; };
  }, [camera, phase]);

  const speak = () => { try { const u = new SpeechSynthesisUtterance(q.q); u.lang = "en-IN"; u.rate = 0.95; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch { /* not supported */ } };

  const record = async () => {
    setErr("");
    try {
      const stream = r.current.stream ?? await navigator.mediaDevices.getUserMedia(camera ? { video: { width: 640, height: 480 }, audio: true } : { audio: true });
      r.current.stream = stream;
      const am = pick(AUDIO_MIME);
      const audio = new MediaRecorder(new MediaStream(stream.getAudioTracks()), am ? { mimeType: am } : undefined);
      r.current.audioChunks = []; r.current.videoChunks = [];
      audio.ondataavailable = (e) => { if (e.data.size) r.current.audioChunks.push(e.data); };
      audio.onstop = () => {
        r.current.audioBlob = new Blob(r.current.audioChunks, { type: audio.mimeType || am || "audio/webm" });
        if (!r.current.video) setPlayback({ url: URL.createObjectURL(r.current.audioBlob), video: false });
      };
      r.current.audio = audio;
      r.current.video = undefined;
      if (camera && stream.getVideoTracks().length) {
        const vm = pick(VIDEO_MIME);
        const video = new MediaRecorder(stream, vm ? { mimeType: vm } : undefined);
        video.ondataavailable = (e) => { if (e.data.size) r.current.videoChunks.push(e.data); };
        video.onstop = () => setPlayback({ url: URL.createObjectURL(new Blob(r.current.videoChunks, { type: video.mimeType || vm || "video/webm" })), video: true });
        r.current.video = video;
        video.start(1000);
      }
      audio.start(1000);
      r.current.heard = undefined;
      r.current.stt = startBrowserStt() ?? undefined;
      setSec(0); setPhase("recording");
      const t0 = Date.now();
      r.current.tick = window.setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); setSec(s); if (s >= MAX_SEC) stop(); }, 250);
    } catch {
      setErr("Allow the microphone in your browser to answer out loud - or type your answer instead.");
    }
  };

  const stop = () => {
    window.clearInterval(r.current.tick);
    // What the browser heard - a fallback transcript if the server's speech-to-text is down.
    if (r.current.stt) { r.current.heard = r.current.stt.stop(); r.current.stt = undefined; }
    r.current.audio?.state === "recording" && r.current.audio.stop();
    r.current.video?.state === "recording" && r.current.video.stop();
    window.setTimeout(stopStream, 300);
    setPhase("recorded");
  };

  const send = async (mode: "audio" | "text") => {
    setErr(""); setPhase("sending");
    try {
      const body = new FormData();
      body.append("questionId", q.id);
      if (role) body.append("role", role);
      if (q.id.startsWith("custom")) { body.append("question", q.q); body.append("how", q.how); }
      if (mode === "audio" && r.current.audioBlob) {
        body.append("audio", r.current.audioBlob, `answer.${ext(r.current.audioBlob.type)}`);
        const heard = await r.current.heard?.catch(() => undefined);
        if (heard?.text) { body.append("browserText", heard.text); body.append("browserConfidence", String(heard.confidence)); }
        body.append("durationSec", String(sec));
      } else body.append("text", typed);
      const d = await authedPost<Report>("/api/interview/feedback", body);
      if (d.total != null) addReview({ id: q.id, q: q.q, total: d.total, at: Date.now() });
      setReport(d); setPhase("result");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "That didn't work - please try again.");
      setPhase(mode === "audio" ? "recorded" : "typing");
    }
  };

  const again = () => { if (playback) URL.revokeObjectURL(playback.url); setPlayback(null); setReport(null); setTyped(""); setPhase("ready"); };
  const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="mi-card">
      <div className="mi-q">
        <span className="fp-kicker" style={{ border: 0, padding: 0 }}>{q.id.startsWith("custom") ? `For your role${role ? `: ${role}` : ""}` : CATEGORIES.find((c) => c.key === q.cat)?.label}</span>
        <h1>{q.q}</h1>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="fp-link" style={{ fontSize: 13 }} onClick={speak}><Icon name="audio" size={13} stroke={2} /> Read it aloud</button>
          <button className="fp-link" style={{ fontSize: 13 }} onClick={() => setShowModel(!showModel)}>{showModel ? "Hide the hint" : "Show a hint"}</button>
        </div>
        {showModel && <p className="mi-hint"><b>How to answer:</b> {q.how}</p>}
      </div>

      {(phase === "ready" || phase === "recording") && (
        <div className="mi-rec">
          {camera && <video ref={live} className="mi-video" muted playsInline autoPlay />}
          <div className="mi-rec-row">
            {phase === "ready" ? (
              <>
                <button className="fp-btn fp-btn-pri" disabled={!supported} onClick={() => void record()}><Icon name="audio" size={15} stroke={2} /> Start answering</button>
                <label className="mi-cam"><input type="checkbox" checked={camera} onChange={(e) => setCamera(e.target.checked)} /> Camera on (for self-view)</label>
                <button className="fp-link" style={{ fontSize: 13, marginLeft: "auto" }} onClick={() => setPhase("typing")}>Type instead</button>
              </>
            ) : (
              <>
                <span className="mi-dot" aria-hidden="true" /> <b style={{ fontVariantNumeric: "tabular-nums" }}>{mmss(sec)}</b><span className="fp-muted"> / {mmss(MAX_SEC)} · aim for 1-2 minutes</span>
                <button className="fp-btn fp-btn-pri" style={{ marginLeft: "auto" }} onClick={stop}>Stop</button>
              </>
            )}
          </div>
          {!supported && <p className="fp-muted" style={{ marginTop: 8 }}>This browser can&apos;t record - type your answer instead.</p>}
        </div>
      )}

      {(phase === "recorded" || (phase === "sending" && playback)) && (
        <div className="mi-rec">
          {playback && (playback.video ? <video className="mi-video" src={playback.url} controls playsInline /> : <audio src={playback.url} controls style={{ width: "100%" }} />)}
          <div className="mi-rec-row">
            <button className="fp-btn fp-btn-pri" disabled={phase === "sending"} onClick={() => void send("audio")}>{phase === "sending" ? "Listening to your answer…" : "Get feedback"}</button>
            <button className="fp-btn" disabled={phase === "sending"} onClick={again}>Record again</button>
          </div>
        </div>
      )}

      {(phase === "typing" || (phase === "sending" && !playback)) && (
        <div className="mi-rec">
          <textarea className="mi-in" rows={7} value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Write your answer the way you'd say it." />
          <div className="mi-rec-row">
            <button className="fp-btn fp-btn-pri" disabled={phase === "sending" || typed.trim().split(/\s+/).length < 12} onClick={() => void send("text")}>{phase === "sending" ? "Reading your answer…" : "Get feedback"}</button>
            <button className="fp-btn" onClick={again}>Answer out loud instead</button>
          </div>
        </div>
      )}

      {err && <p className="mi-err">{err}</p>}

      {phase === "result" && report && <Feedback report={report} q={q} />}

      {(phase === "result" || phase === "ready") && (
        <div className="mi-next">
          {phase === "result" && <button className="fp-btn" onClick={again}>Try this one again</button>}
          <button className="fp-btn fp-btn-pri" onClick={() => onNext(report?.total ?? null)}>{phase === "result" ? (last ? "Finish the round" : "Next question") : last ? "Skip and finish" : "Skip"}</button>
        </div>
      )}
    </div>
  );
}

function Feedback({ report, q }: { report: Report; q: InterviewQ }) {
  const [showT, setShowT] = useState(false);
  const d = report.delivery;
  const pace = d ? (d.wpm < 110 ? "a little slow" : d.wpm > 160 ? "fast - slow down a little" : "a good pace") : "";
  const rows = useMemo(() => report.scores ? ([["Relevance", report.scores.relevance, "Answers what was asked"], ["Structure", report.scores.structure, "Clear start, middle and end"], ["Specifics", report.scores.specifics, "Real examples and results"], ["Impression", report.scores.impression, "Confident and positive"]] as const) : [], [report.scores]);
  if (report.unscored) return <div className="mi-fb"><p style={{ margin: 0 }}>{report.unscored}</p></div>;
  return (
    <div className="mi-fb">
      <div className="mi-fb-top">
        <div className="mi-total"><b>{report.total}</b><span>/100</span></div>
        <div className="mi-bars">
          {rows.map(([label, v, hint]) => (
            <div key={label} className="mi-bar"><span title={hint}>{label}</span><div><i style={{ width: `${v * 10}%` }} /></div><b>{v}/10</b></div>
          ))}
        </div>
      </div>
      {d && (
        <div className="mi-del">
          <div><b>{Math.floor(d.durationSec / 60)}:{String(Math.round(d.durationSec % 60)).padStart(2, "0")}</b><small>length{d.durationSec < 45 ? " - add more detail" : d.durationSec > 150 ? " - a bit long" : ""}</small></div>
          <div><b>{d.wpm}</b><small>words a minute - {pace}</small></div>
          <div><b>{d.fillers}</b><small>filler words{d.fillersPerMin > 3 ? " - pause instead of um" : ""}</small></div>
          <div><b>{d.longPauses}</b><small>long pauses</small></div>
        </div>
      )}
      <div className="mi-two">
        <div><h3>What worked</h3><ul>{report.strengths?.map((s) => <li key={s}>{s}</li>)}</ul></div>
        <div><h3>To improve</h3><ul>{report.improvements?.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
      {report.improved && (
        <div className="mi-better"><h3>A stronger version of your answer</h3><p>{report.improved}</p><small>Fill in anything in [brackets] with your own detail - or leave it out.</small></div>
      )}
      {q.answer && <details className="mi-model"><summary>Compare with the model answer</summary><p>{q.answer}</p></details>}
      {report.transcript && <button className="fp-link" style={{ fontSize: 13, marginTop: 8 }} onClick={() => setShowT(!showT)}>{showT ? "Hide" : "Show"} what we heard</button>}
      {showT && <p className="mi-transcript">{report.transcript}</p>}
    </div>
  );
}

const MI_CSS = `
.mi-head h1{margin:8px 0 0;font-size:22px;font-weight:600}
.mi-head p{margin:6px 0 0;font-size:14px;line-height:1.55;color:var(--ink2);max-width:700px}
.mi-card{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px}
.mi-label{display:block;font-size:13.5px;font-weight:600;margin-bottom:6px}
.mi-label small{font-weight:400;color:var(--mute)}
.mi-in{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:9px 11px;font:inherit;font-size:14px;color:var(--ink);line-height:1.5}
.mi-in:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 14%,transparent)}
.mi-rounds{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,230px),1fr));gap:8px}
.mi-round{all:unset;box-sizing:border-box;cursor:pointer;padding:12px 14px;border:1px solid var(--line);border-radius:7px;background:#fff}
.mi-round:hover,.mi-round:focus-visible{border-color:var(--accent)}
.mi-round.is-role{border-color:color-mix(in srgb,var(--accent) 40%,#fff);background:color-mix(in srgb,var(--accent) 4%,#fff)}
.mi-round:disabled{opacity:.55;cursor:default}
.mi-round b{display:block;font-size:14px;font-weight:600}
.mi-round small{display:block;font-size:12.5px;color:var(--mute);margin-top:2px;line-height:1.4}
.mi-top{display:flex;justify-content:space-between;align-items:center;margin:10px 0 8px;font-size:13px;color:var(--mute)}
.mi-q h1{margin:4px 0 8px;font-size:21px;font-weight:600;line-height:1.35}
.mi-hint{margin:10px 0 0;padding:10px 12px;background:#fcfcfb;border:1px solid var(--line);border-radius:6px;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.mi-rec{margin-top:16px;padding-top:16px;border-top:1px solid #f0ede8}
.mi-rec-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px}
.mi-video{display:block;width:100%;max-width:480px;aspect-ratio:4/3;background:#111;border-radius:8px;object-fit:cover;transform:scaleX(-1)}
.mi-rec video[controls]{transform:none}
.mi-cam{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:var(--ink2)}
.mi-dot{width:10px;height:10px;border-radius:50%;background:#dc2626;animation:mi-blink 1s infinite}
@keyframes mi-blink{50%{opacity:.3}}
@media (prefers-reduced-motion:reduce){.mi-dot{animation:none}}
.mi-err{margin:10px 0 0;font-size:13.5px;color:#b42318}
.mi-next{display:flex;justify-content:flex-end;gap:8px;margin-top:16px;padding-top:14px;border-top:1px solid #f0ede8}
.mi-fb{margin-top:16px;padding-top:16px;border-top:1px solid #f0ede8;display:grid;gap:14px}
.mi-fb-top{display:grid;grid-template-columns:110px minmax(0,1fr);gap:18px;align-items:center}
.mi-total{display:flex;align-items:baseline;gap:2px}
.mi-total b{font-size:44px;font-weight:700;line-height:1}
.mi-total span{font-size:14px;color:var(--mute)}
.mi-bars{display:grid;gap:7px}
.mi-bar{display:grid;grid-template-columns:90px minmax(0,1fr) 44px;gap:10px;align-items:center;font-size:13px}
.mi-bar > div{height:8px;border-radius:999px;background:#f0efed;overflow:hidden}
.mi-bar i{display:block;height:100%;background:var(--accent);border-radius:999px}
.mi-bar b{font-weight:600;text-align:right;font-variant-numeric:tabular-nums}
.mi-del{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:0;border:1px solid var(--line);border-radius:7px}
.mi-del > div{padding:10px 12px;border-left:1px solid var(--line)}
.mi-del > div:first-child{border-left:0}
.mi-del b{display:block;font-size:18px;font-weight:600}
.mi-del small{font-size:12px;color:var(--mute);line-height:1.35}
.mi-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
.mi-fb h3{margin:0 0 6px;font-size:14px;font-weight:600}
.mi-fb ul{margin:0;padding-left:18px;font-size:13.5px;line-height:1.6;color:var(--ink2)}
.mi-better{border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:6px;padding:12px 14px}
.mi-better p{margin:0 0 6px;font-size:14px;line-height:1.65;color:var(--ink)}
.mi-better small{font-size:12px;color:var(--mute)}
.mi-model summary{cursor:pointer;font-size:13.5px;font-weight:600;color:var(--ink2)}
.mi-model p{margin:8px 0 0;font-size:13.5px;line-height:1.6;color:var(--ink2)}
.mi-transcript{margin:6px 0 0;padding:10px 12px;background:#fcfcfb;border-radius:6px;font-size:13px;line-height:1.6;color:var(--ink2)}
@media (max-width:640px){.mi-fb-top{grid-template-columns:minmax(0,1fr)}.mi-del{grid-template-columns:repeat(2,minmax(0,1fr))}.mi-del > div:nth-child(3){border-left:0}.mi-del > div:nth-child(n+3){border-top:1px solid var(--line)}.mi-two{grid-template-columns:minmax(0,1fr)}}
`;
