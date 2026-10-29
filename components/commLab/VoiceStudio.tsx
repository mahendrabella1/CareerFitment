"use client";
/**
 * Voice Studio (spec §6): prompt and tips, an optional model answer (read by
 * the browser), the microphone check, 3-2-1, recording with a live timer and
 * waveform (pause / stop, auto-stop at the limit), preview, re-record or
 * submit, then the feedback report and the attempt history.
 *
 * The recording stays in this browser until it is sent; the server turns it
 * into text, scores it and drops it (lib/commLab/server.ts). Under-18s need a
 * parent's or guardian's OK once before their first recording.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/app/Icons";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { LessonRef } from "@/lib/commLab/content";
import { durationOk, levelLabel } from "@/lib/commLab/scoring";
import type { VoiceAttempt, VoicePrompt, VoiceReport, VoiceScores } from "@/lib/commLab/types";
import { useCommLab } from "./CommLabProvider";

type Phase = "idle" | "consent" | "blocked" | "countdown" | "recording" | "preview" | "sending" | "report" | "error";

const MIME = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/aac"];
const pickMime = () => (typeof MediaRecorder === "undefined" ? "" : MIME.find((m) => MediaRecorder.isTypeSupported?.(m)) ?? "");
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export function VoiceStudio({ prompt, lessonRef, heading }: { prompt: VoicePrompt; lessonRef: LessonRef | null; heading?: ReactNode }) {
  const lab = useCommLab();
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [blockedWhy, setBlockedWhy] = useState("");
  const [report, setReport] = useState<VoiceReport | null>(null);
  const [agree, setAgree] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const rec = useRef<{ recorder?: MediaRecorder; stream?: MediaStream; ctx?: AudioContext; raf?: number; tick?: number; started?: number; pausedAt?: number; pausedFor: number; levels: number[] }>({ pausedFor: 0, levels: [] });
  const canvas = useRef<HTMLCanvasElement>(null);
  const history: VoiceAttempt[] = lab.state.voice[prompt.id] ?? [];
  const needsConsent = lab.minor && !lab.state.consent;

  const cleanup = () => {
    const r = rec.current;
    if (r.raf) cancelAnimationFrame(r.raf);
    if (r.tick) window.clearInterval(r.tick);
    r.stream?.getTracks().forEach((t) => t.stop());
    r.ctx?.close().catch(() => undefined);
    rec.current = { pausedFor: 0, levels: [] };
  };
  useEffect(() => () => { cleanup(); if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); }, []);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const begin = async () => {
    setError(""); setReport(null);
    if (needsConsent) { setPhase("consent"); return; }
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setBlockedWhy("unsupported"); setPhase("blocked"); return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, channelCount: 1 } });
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setBlockedWhy(name === "NotFoundError" ? "nomic" : name === "NotReadableError" ? "busy" : "denied");
      setPhase("blocked");
      return;
    }
    rec.current.stream = stream;
    setPhase("countdown");
    for (let n = 3; n >= 1; n--) { setCount(n); await new Promise((r) => setTimeout(r, 800)); }
    startRecording(stream);
  };

  const startRecording = (stream: MediaStream) => {
    const mime = pickMime();
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    recorder.onstop = () => {
      const b = new Blob(chunks, { type: recorder.mimeType || mime || "audio/webm" });
      setBlob(b);
      setUrl(URL.createObjectURL(b));
      cleanup();
      setPhase("preview");
    };
    const r = rec.current;
    r.recorder = recorder;
    r.started = Date.now();
    r.pausedFor = 0;
    r.levels = [];
    recorder.start(250);
    setElapsed(0); setPaused(false); setPhase("recording");
    r.tick = window.setInterval(() => {
      const now = rec.current.pausedAt ?? Date.now();
      const sec = (now - (rec.current.started ?? now) - rec.current.pausedFor) / 1000;
      setElapsed(sec);
      if (sec >= prompt.maxSec && recorder.state !== "inactive") recorder.stop();
    }, 200);
    // Live waveform: a rolling bar per frame of the input level.
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      r.ctx = ctx;
      const buf = new Uint8Array(analyser.fftSize);
      const draw = () => {
        const c = canvas.current;
        if (c && !rec.current.pausedAt) {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (const v of buf) sum += ((v - 128) / 128) ** 2;
          rec.current.levels.push(Math.min(1, Math.sqrt(sum / buf.length) * 4));
          if (rec.current.levels.length > 90) rec.current.levels.shift();
          const g = c.getContext("2d");
          if (g) {
            const w = c.width, h = c.height, bw = w / 90;
            g.clearRect(0, 0, w, h);
            g.fillStyle = getComputedStyle(c).color;
            rec.current.levels.forEach((lv, i) => { const bh = Math.max(2, lv * h); g.fillRect(i * bw + 1, (h - bh) / 2, bw - 2, bh); });
          }
        }
        rec.current.raf = requestAnimationFrame(draw);
      };
      draw();
    } catch { /* no waveform - recording still works */ }
  };

  const pause = () => {
    const r = rec.current;
    if (!r.recorder || r.recorder.state === "inactive") return;
    if (paused) { r.recorder.resume(); r.pausedFor += Date.now() - (r.pausedAt ?? Date.now()); r.pausedAt = undefined; setPaused(false); }
    else { r.recorder.pause(); r.pausedAt = Date.now(); setPaused(true); }
  };
  const stop = () => { const r = rec.current.recorder; if (r && r.state !== "inactive") r.stop(); };

  const redo = () => { setBlob(null); setUrl(""); setReport(null); void begin(); };

  const submit = async () => {
    if (!blob) return;
    setPhase("sending"); setError("");
    try {
      const token = await getFirebaseAuth()?.currentUser?.getIdToken();
      if (!token) throw new Error("Sign in to get feedback on your recording.");
      const form = new FormData();
      form.append("audio", blob, `recording.${blob.type.includes("mp4") || blob.type.includes("aac") ? "m4a" : "webm"}`);
      form.append("promptId", prompt.id);
      const res = await fetch("/api/comm-lab/voice", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const data = (await res.json().catch(() => ({}))) as { report?: VoiceReport; error?: string };
      if (!res.ok || !data.report) throw new Error(data.error || "Couldn't analyse that recording - please try again.");
      lab.recordVoice(data.report, lessonRef);
      setReport(data.report);
      setPhase("report");
    } catch (e) {
      // The recording is kept, so "Try again" re-sends the same one.
      setError(e instanceof Error ? e.message : "Couldn't send the recording - check your connection and try again.");
      setPhase("error");
    }
  };

  const playModel = () => {
    if (!prompt.modelAnswer || typeof speechSynthesis === "undefined") return;
    if (speaking) { speechSynthesis.cancel(); setSpeaking(false); return; }
    const u = new SpeechSynthesisUtterance(prompt.modelAnswer);
    const voice = speechSynthesis.getVoices().find((v) => v.lang === "en-IN") ?? speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
    if (voice) u.voice = voice;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    setSpeaking(true);
    speechSynthesis.speak(u);
  };

  const previous = report ? history.filter((h) => !h.unscored).slice(0, -1).slice(-1)[0] : history.filter((h) => !h.unscored).slice(-1)[0];

  return (
    <div className="vs">
      <style dangerouslySetInnerHTML={{ __html: VS_CSS }} />
      <div className="vs-prompt">
        {heading}
        <p className="vs-text">{prompt.text}</p>
        {prompt.passage && <blockquote className="vs-passage">{prompt.passage}</blockquote>}
        <div className="vs-meta">
          <span><Icon name="clock" size={14} stroke={2} /> Aim for {prompt.targetSec} seconds (up to {fmt(prompt.maxSec)})</span>
          {prompt.modelAnswer && (
            <button type="button" className="fp-link" style={{ fontSize: 13 }} onClick={playModel}>
              <Icon name={speaking ? "close" : "audio"} size={14} stroke={2} /> {speaking ? "Stop the model answer" : "Hear a model answer"}
            </button>
          )}
        </div>
        <ul className="vs-tips">{prompt.tips.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>

      <div className="vs-stage" aria-live="polite">
        {phase === "idle" && (
          <div className="vs-center">
            <button type="button" className="vs-rec" onClick={() => void begin()} aria-label="Start recording"><span /></button>
            <b>Tap to record</b>
            <small>{history.length ? `You've tried this ${history.length} ${history.length === 1 ? "time" : "times"}. Have another go!` : "Find a quiet place. You'll get a 3-second countdown."}</small>
            {!lab.signedIn && <small className="vs-warn">Sign in to get feedback - you can still record and listen back.</small>}
          </div>
        )}

        {phase === "consent" && (
          <div className="vs-consent">
            <b>Before your first recording - ask a parent or guardian to read this with you</b>
            <ul>
              <li>When you submit, your recording is sent to our speech-to-text and feedback services to be turned into text and scored.</li>
              <li>OneGrasp does not keep the recording. Only the text and your scores are saved, in your account.</li>
              <li>Recordings are never shared publicly or used by OneGrasp to train AI.</li>
            </ul>
            <label className="vs-check"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} /> My parent or guardian has read this and agrees.</label>
            <div className="vs-row">
              <button type="button" className="fp-btn fp-btn-pri" disabled={!agree} onClick={() => { lab.setConsent(); setPhase("idle"); }}>Continue</button>
              <button type="button" className="fp-btn" onClick={() => setPhase("idle")}>Not now</button>
            </div>
          </div>
        )}

        {phase === "blocked" && (
          <div className="vs-consent">
            <b>{blockedWhy === "unsupported" ? "This browser can't record audio" : blockedWhy === "nomic" ? "No microphone found" : blockedWhy === "busy" ? "The microphone is busy" : "Microphone access is blocked"}</b>
            {blockedWhy === "unsupported" ? <p>Open this page in Chrome, Edge, Safari (iPhone or Mac) or Firefox.</p>
              : blockedWhy === "nomic" ? <p>Plug in headphones with a microphone, or use your phone.</p>
              : blockedWhy === "busy" ? <p>Close other apps or tabs using the microphone (video calls, recorders), then try again.</p>
              : (
                <ul>
                  <li><b>Chrome / Edge:</b> tap the icon to the left of the web address → Site settings → Microphone → Allow.</li>
                  <li><b>iPhone (Safari):</b> tap &quot;aA&quot; in the address bar → Website Settings → Microphone → Allow.</li>
                  <li><b>Android:</b> Settings → Apps → your browser → Permissions → Microphone → Allow.</li>
                </ul>
              )}
            <div className="vs-row"><button type="button" className="fp-btn fp-btn-pri" onClick={() => void begin()}>Try again</button></div>
          </div>
        )}

        {phase === "countdown" && <div className="vs-center"><span className="vs-count" aria-label={`Starting in ${count}`}>{count}</span><small>Breathe in… smile…</small></div>}

        {phase === "recording" && (
          <div className="vs-center">
            <span className={`vs-live${paused ? " is-paused" : ""}`}>{paused ? "Paused" : "Recording"} · {fmt(elapsed)} / {fmt(prompt.maxSec)}</span>
            <canvas ref={canvas} width={540} height={70} className="vs-wave" aria-hidden="true" />
            <div className="vs-bar"><i style={{ width: `${Math.min(100, (elapsed / prompt.maxSec) * 100)}%` }} /><em style={{ left: `${(prompt.targetSec / prompt.maxSec) * 100}%` }} title="Target length" /></div>
            <div className="vs-row">
              <button type="button" className="fp-btn" onClick={pause}>{paused && <Icon name="play" size={15} stroke={2} />} {paused ? "Resume" : "Pause"}</button>
              <button type="button" className="fp-btn fp-btn-pri" onClick={stop}><span className="vs-stop" /> Stop</button>
            </div>
          </div>
        )}

        {(phase === "preview" || phase === "sending" || phase === "error") && (
          <div className="vs-center">
            <b>Listen back{elapsed < prompt.minSec ? " - it's a little short" : ""}</b>
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            {url && <audio controls src={url} className="vs-audio" />}
            <small>{fmt(elapsed)} recorded · aim for about {prompt.targetSec} s{elapsed < prompt.minSec ? ` (at least ${prompt.minSec} s)` : ""}</small>
            {phase === "error" && <p className="vs-err" role="alert">{error}</p>}
            <div className="vs-row">
              <button type="button" className="fp-btn" onClick={redo} disabled={phase === "sending"}>Re-record</button>
              <button type="button" className="fp-btn fp-btn-pri" onClick={() => void submit()} disabled={phase === "sending" || elapsed < 3 || !lab.signedIn}>
                {phase === "sending" ? "Listening to your answer…" : phase === "error" ? "Try again" : "Submit for feedback"}
              </button>
            </div>
            {phase === "sending" && <small>This takes about 10-20 seconds.</small>}
            {!lab.signedIn && <small className="vs-warn">Sign in to get feedback on your recording.</small>}
          </div>
        )}

        {phase === "report" && report && (
          <>
            <VoiceReportView report={report} previous={previous} audioUrl={url} targetSec={prompt.targetSec} />
            <div className="vs-row" style={{ justifyContent: "center", marginTop: 16 }}>
              <button type="button" className="fp-btn" onClick={redo}>Try again</button>
            </div>
          </>
        )}
      </div>

      {history.length > 0 && phase !== "report" && (
        <details className="vs-hist">
          <summary>Your attempts ({history.length})</summary>
          <ol>{[...history].reverse().map((h) => (
            <li key={h.at}><span>{new Date(h.at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span><b>{h.unscored ? "Not scored" : `${h.total}/100`}</b><small>{h.unscored ? "" : `${h.metrics.wpm} wpm · ${h.metrics.fillersPerMin} fillers/min`}</small></li>
          ))}</ol>
        </details>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ the report

const RUBRIC: { key: keyof VoiceScores; label: string; max: number }[] = [
  { key: "content", label: "Content and relevance", max: 25 },
  { key: "structure", label: "Structure", max: 20 },
  { key: "fluency", label: "Fluency (pace, fillers, pauses)", max: 20 },
  { key: "pronunciation", label: "Pronunciation and clarity", max: 15 },
  { key: "grammar", label: "Grammar and vocabulary", max: 15 },
  { key: "tone", label: "Confidence and tone", max: 5 },
];

const FILLER_RE = /(\b(?:um+|umm+|hmm+|uh+|erm|ah+|basically)\b|,\s*like\s*,|\byou know\b)/gi;

function Transcript({ text }: { text: string }) {
  const parts = text.split(FILLER_RE);
  return <p className="vs-transcript">{parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</p>;
}

export function VoiceReportView({ report, previous, audioUrl, targetSec }: { report: VoiceReport; previous?: VoiceAttempt; audioUrl?: string; targetSec: number }) {
  const m = report.metrics;
  if (report.unscored) {
    return <div className="vs-report"><p className="vs-err" role="alert">{report.unscored}</p>{report.transcript && <Transcript text={report.transcript} />}</div>;
  }
  const pace = m.wpm < 110 ? "A little slow" : m.wpm > 150 ? "A little fast" : "In the healthy range";
  const delta = previous && !previous.unscored ? report.total - previous.total : null;
  const stars = Math.round(report.total / 20);
  return (
    <div className="vs-report">
      <div className="vs-score">
        <div>
          <span className="vs-score-n">{report.total}<small>/100</small></span>
          <span className="vs-stars" aria-label={`${stars} of 5 stars`}>{"★★★★★".slice(0, stars)}<i>{"★★★★★".slice(stars)}</i></span>
        </div>
        <div>
          <b>{levelLabel(report.total)}</b>
          {delta !== null && <small>{delta === 0 ? "Same as last time" : `${delta > 0 ? "+" : ""}${delta} since last time (${previous!.total})`}</small>}
        </div>
      </div>

      <div className="vs-metrics">
        <div><span>Pace</span><b>{m.wpm} <small>wpm</small></b><small>{pace} · 110-150</small></div>
        <div><span>Filler words</span><b>{m.fillersPerMin} <small>/min</small></b><small>{m.fillerCount ? Object.entries(m.fillerWords).map(([k, n]) => `"${k}" ×${n}`).join(", ") : "None heard"} · aim under 3</small></div>
        <div><span>Long pauses</span><b>{m.longPauses}</b><small>Gaps over 1.5 s - a few, on purpose, are good</small></div>
        <div><span>Length</span><b>{Math.round(m.durationSec)} <small>s</small></b><small>{durationOk(m.durationSec, targetSec) ? "On target" : m.durationSec < targetSec ? "A bit short" : "A bit long"} · aim {targetSec} s ±20%</small></div>
        <div><span>Clarity</span><b>{m.clarity}<small>%</small></b><small>How surely the speech-to-text understood you (approximate)</small></div>
      </div>

      <div className="vs-rubric">
        {RUBRIC.map((r) => (
          <div key={r.key}><span>{r.label}</span><i><b style={{ width: `${(report.scores[r.key] / r.max) * 100}%` }} /></i><em>{report.scores[r.key]}/{r.max}</em></div>
        ))}
      </div>

      <div className="vs-fb">
        <div><b>What went well</b><ul>{report.feedback.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>
        <div><b>What to work on</b><ul>{report.feedback.improvements.map((s) => <li key={s}>{s}</li>)}</ul></div>
      </div>
      <p className="vs-tip"><Icon name="bulb" size={16} stroke={2} /> <span><b>Try this next:</b> {report.feedback.nextTip}</span></p>

      <details className="vs-hist" open>
        <summary>What we heard {report.metrics.fillerCount ? "(fillers highlighted)" : ""}</summary>
        {audioUrl && <audio controls src={audioUrl} className="vs-audio" />}
        <Transcript text={report.transcript} />
      </details>
    </div>
  );
}

export const VS_CSS = `
.vs{display:grid;gap:14px}
.vs-prompt{background:#fff;border:1px solid var(--line);border-radius:8px;padding:18px 20px}
.vs-text{font-size:17px;line-height:1.5;color:var(--ink);margin:0;font-weight:500}
.vs-passage{margin:12px 0 0;padding:12px 14px;border-left:3px solid var(--accent);background:var(--soft);border-radius:4px;font-size:16px;line-height:1.65;color:var(--ink)}
.vs-meta{display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;margin-top:12px;font-size:13px;color:var(--ink2)}
.vs-meta>span{display:inline-flex;align-items:center;gap:6px}
.vs-tips{margin:10px 0 0;padding-left:18px;font-size:13.5px;color:var(--ink2);line-height:1.6}
.vs-stage{background:#fff;border:1px solid var(--line);border-radius:8px;padding:22px 20px;min-height:220px;display:flex;flex-direction:column;justify-content:center}
.vs-center{display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center}
.vs-center small{font-size:13px;color:var(--mute)}
.vs-warn{color:#9a3412!important}
.vs-rec{width:76px;height:76px;border-radius:50%;border:4px solid color-mix(in srgb,var(--accent) 25%,#fff);background:#fff;display:grid;place-items:center;cursor:pointer;transition:transform .15s}
.vs-rec:hover{transform:scale(1.05)}
.vs-rec span{width:44px;height:44px;border-radius:50%;background:#dc2626}
.vs-count{font-family:Poppins,Inter,sans-serif;font-size:64px;font-weight:700;color:var(--accent);line-height:1}
.vs-live{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:14px;color:#dc2626;font-variant-numeric:tabular-nums}
.vs-live::before{content:"";width:10px;height:10px;border-radius:50%;background:currentColor;animation:vsblink 1s infinite}
.vs-live.is-paused{color:var(--mute)}
.vs-live.is-paused::before{animation:none}
@keyframes vsblink{50%{opacity:.25}}
.vs-wave{width:100%;max-width:540px;height:70px;color:var(--accent)}
.vs-bar{position:relative;width:100%;max-width:540px;height:6px;border-radius:3px;background:#ece9e3}
.vs-bar i{position:absolute;inset:0 auto 0 0;background:var(--accent);border-radius:3px}
.vs-bar em{position:absolute;top:-4px;width:2px;height:14px;background:var(--ink)}
.vs-row{display:flex;flex-wrap:wrap;gap:8px}
.vs-stop{width:10px;height:10px;background:#fff;border-radius:2px;display:inline-block}
.vs-audio{width:100%;max-width:420px}
.vs-err{color:#b42318;font-size:14px;margin:0}
.vs-consent{display:grid;gap:10px;font-size:14px;line-height:1.55;color:var(--ink2)}
.vs-consent b{color:var(--ink);font-size:15px}
.vs-consent ul{margin:0;padding-left:18px}
.vs-consent p{margin:0}
.vs-check{display:flex;gap:8px;align-items:flex-start;font-weight:600;color:var(--ink)}
.vs-check input{margin-top:4px;accent-color:var(--accent)}
.vs-hist{background:#fff;border:1px solid var(--line);border-radius:8px;padding:12px 16px}
.vs-hist summary{cursor:pointer;font-weight:600;font-size:14px}
.vs-hist ol{list-style:none;margin:10px 0 0;padding:0;display:grid;gap:6px}
.vs-hist li{display:grid;grid-template-columns:70px 70px minmax(0,1fr);gap:10px;font-size:13px;color:var(--ink2)}
.vs-report{display:grid;gap:16px}
.vs-score{display:flex;flex-wrap:wrap;gap:12px 22px;align-items:center}
.vs-score>div{display:flex;flex-direction:column}
.vs-score-n{font-family:Poppins,Inter,sans-serif;font-size:44px;font-weight:700;line-height:1;color:var(--ink)}
.vs-score-n small{font-size:16px;color:var(--mute);font-weight:600}
.vs-stars{color:#d97706;font-size:18px;letter-spacing:2px}
.vs-stars i{font-style:normal;color:#e2ded6}
.vs-score b{font-size:18px}
.vs-score small{font-size:13px;color:var(--mute)}
.vs-metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.vs-metrics>div{border:1px solid var(--line);border-radius:8px;padding:10px 12px;display:flex;flex-direction:column;gap:2px}
.vs-metrics span{font-size:12px;font-weight:600;color:var(--mute);text-transform:uppercase;letter-spacing:.05em}
.vs-metrics b{font-family:Poppins,Inter,sans-serif;font-size:22px;color:var(--ink)}
.vs-metrics b small{font-size:12px;color:var(--mute)}
.vs-metrics>div>small{font-size:12px;color:var(--ink2);line-height:1.4}
.vs-rubric{display:grid;gap:7px}
.vs-rubric>div{display:grid;grid-template-columns:minmax(0,230px) minmax(0,1fr) 46px;gap:10px;align-items:center;font-size:13.5px;color:var(--ink2)}
.vs-rubric i{display:block;height:8px;border-radius:4px;background:#ece9e3;overflow:hidden}
.vs-rubric i b{display:block;height:100%;background:var(--accent);border-radius:4px}
.vs-rubric em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.vs-fb{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.vs-fb>div{border:1px solid var(--line);border-radius:8px;padding:12px 14px}
.vs-fb b{font-size:14px}
.vs-fb ul{margin:6px 0 0;padding-left:18px;font-size:14px;line-height:1.6;color:var(--ink2)}
.vs-tip{display:flex;gap:8px;align-items:flex-start;margin:0;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 7%,#fff);font-size:14px;line-height:1.5;color:var(--ink2)}
.vs-tip svg{flex:none;color:var(--accent);margin-top:2px}
.vs-transcript{font-size:14.5px;line-height:1.7;color:var(--ink);margin:10px 0 0}
.vs-transcript mark{background:#fde68a;border-radius:3px;padding:0 2px}
@media (max-width:640px){.vs-fb{grid-template-columns:1fr}.vs-rubric>div{grid-template-columns:minmax(0,1fr) 46px}.vs-rubric i{grid-column:1/-1;grid-row:2}}
`;
