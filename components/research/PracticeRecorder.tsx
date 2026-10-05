"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const ACCENT = "#7c3aed";

type Mode = "pitch" | "talk";
const MODES: Record<Mode, { label: string; seconds: number; tips: string[] }> = {
  pitch: {
    label: "Poster pitch (3 minutes)",
    seconds: 180,
    tips: ["Say your question in the first 30 seconds", "One sentence on how you collected data", "Your main result, with one number", "What it means, and what you would do next"],
  },
  talk: {
    label: "Conference talk (10 minutes)",
    seconds: 600,
    tips: ["Title, then why the topic matters", "Your question and your method", "Results across two or three slides", "What it means, the limitations, then thank you and questions"],
  },
};

const CHECKS = [
  "Stated the question in the first 30 seconds",
  "Explained the method simply",
  "Gave results with numbers",
  "Mentioned at least one limitation",
  "Ended with what it means and what comes next",
  "Spoke clearly, not too fast",
  "Finished within the time",
];

interface Take {
  id: string;
  url: string;
  seconds: number;
  mode: Mode;
  hasVideo: boolean;
  checks: string[];
  notes: string;
}

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

function pickMime(video: boolean): string | undefined {
  const options = video ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"] : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return undefined;
  return options.find((m) => MediaRecorder.isTypeSupported(m));
}

/**
 * Records practice talks in the browser with MediaRecorder (plan section 10).
 * Recordings stay in this tab: nothing is uploaded, and they disappear when
 * the tab closes unless the learner downloads them. That keeps a minor's
 * recording private by default (plan section 11).
 */
export function PracticeRecorder() {
  const [mode, setMode] = useState<Mode>("pitch");
  const [useCamera, setUseCamera] = useState(true);
  const [under18, setUnder18] = useState(false);
  const [consent, setConsent] = useState(false);
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [takes, setTakes] = useState<Take[]>([]);
  const [error, setError] = useState("");

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const takesRef = useRef<Take[]>([]);
  takesRef.current = takes;

  const target = MODES[mode].seconds;
  // Checked after load so the server render and the first client render match.
  const [supported, setSupported] = useState(true);
  useEffect(() => {
    setSupported(!!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined");
  }, []);

  const stopTracks = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (previewRef.current) previewRef.current.srcObject = null;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      stopTracks();
      takesRef.current.forEach((t) => URL.revokeObjectURL(t.url));
    };
  }, []);

  const start = async () => {
    setError("");
    if (under18 && !consent) {
      setError("A parent or teacher must know about and agree to the recording first.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: useCamera ? { width: 640, height: 360 } : false });
      streamRef.current = stream;
      if (previewRef.current && useCamera) {
        previewRef.current.srcObject = stream;
        previewRef.current.muted = true;
        await previewRef.current.play().catch(() => undefined);
      }
      const mime = pickMime(useCamera);
      const rec = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || (useCamera ? "video/webm" : "audio/webm") });
        const take: Take = { id: `${Date.now()}`, url: URL.createObjectURL(blob), seconds: elapsedRef.current, mode, hasVideo: useCamera, checks: [], notes: "" };
        setTakes((t) => [take, ...t]);
        stopTracks();
      };
      recorderRef.current = rec;
      rec.start(1000);
      elapsedRef.current = 0;
      setElapsed(0);
      setRecording(true);
      timerRef.current = window.setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }, 1000);
    } catch (err) {
      stopTracks();
      const name = err instanceof Error ? err.name : "";
      setError(
        name === "NotAllowedError"
          ? "Camera or microphone access was blocked. Allow it in your browser's site settings, or switch off the camera to record audio only."
          : name === "NotFoundError"
            ? "No camera or microphone was found. Try audio only, or connect a microphone."
            : "Recording could not start in this browser.",
      );
    }
  };

  const stop = () => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setRecording(false);
  };

  const updateTake = (id: string, patch: Partial<Take>) => setTakes((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const removeTake = (id: string) => {
    setTakes((ts) => {
      const t = ts.find((x) => x.id === id);
      if (t) URL.revokeObjectURL(t.url);
      return ts.filter((x) => x.id !== id);
    });
  };

  const pct = Math.min(100, (elapsed / target) * 100);
  const over = elapsed > target;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 12, padding: "12px 14px", fontSize: 13.5, color: "#4c1d95", lineHeight: 1.6 }}>
        Recordings stay private in this browser tab. Nothing is uploaded, and they disappear when you close the tab unless you download them.
      </div>

      {!supported && <p style={{ fontSize: 14, color: "#b91c1c", fontWeight: 700 }}>This browser can&apos;t record. Try a recent version of Chrome, Edge or Firefox on a laptop.</p>}

      <section style={panel}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(Object.keys(MODES) as Mode[]).map((m) => (
            <button key={m} disabled={recording} onClick={() => setMode(m)} style={chip(mode === m)}>{MODES[m].label}</button>
          ))}
        </div>
        <ul style={{ margin: "12px 0 0", paddingLeft: 18, fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
          {MODES[mode].tips.map((t) => <li key={t}>{t}</li>)}
        </ul>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
          <label style={checkRow}><input type="checkbox" checked={useCamera} disabled={recording} onChange={(e) => setUseCamera(e.target.checked)} style={{ accentColor: ACCENT }} /> Use my camera (untick for audio only)</label>
          <label style={checkRow}><input type="checkbox" checked={under18} disabled={recording} onChange={(e) => setUnder18(e.target.checked)} style={{ accentColor: ACCENT }} /> I am under 18</label>
        </div>
        {under18 && (
          <label style={{ ...checkRow, marginTop: 8 }}>
            <input type="checkbox" checked={consent} disabled={recording} onChange={(e) => setConsent(e.target.checked)} style={{ accentColor: ACCENT }} />
            A parent, teacher or mentor knows I am recording and has agreed. I won&apos;t share the recording publicly.
          </label>
        )}
      </section>

      <section style={panel}>
        {useCamera && <video ref={previewRef} playsInline muted style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "#0f172a", aspectRatio: "16 / 9", display: recording ? "block" : "none" }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginTop: recording && useCamera ? 12 : 0 }}>
          {!recording ? (
            <button onClick={start} disabled={!supported} style={primaryBtn}>● Start recording</button>
          ) : (
            <button onClick={stop} style={{ ...primaryBtn, background: "#dc2626" }}>■ Stop</button>
          )}
          <span aria-live="polite" style={{ fontSize: 22, fontWeight: 900, fontVariantNumeric: "tabular-nums", color: over ? "#b91c1c" : "#0f172a" }}>{mmss(elapsed)} / {mmss(target)}</span>
          {over && <span style={{ fontSize: 13, fontWeight: 800, color: "#b91c1c" }}>Over time: wrap up now</span>}
        </div>
        <div style={{ height: 10, background: "#e2e8f0", borderRadius: 999, overflow: "hidden", marginTop: 10 }}>
          <div style={{ width: `${pct}%`, height: "100%", background: over ? "#dc2626" : pct > 85 ? "#f59e0b" : ACCENT, transition: "width .3s" }} />
        </div>
        {error && <p style={{ fontSize: 13.5, color: "#b91c1c", fontWeight: 700, margin: "10px 0 0" }}>{error}</p>}
      </section>

      {takes.map((t, i) => (
        <section key={t.id} style={panel}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
            <h2 style={h2}>Take {takes.length - i} · {MODES[t.mode].label}</h2>
            <span style={{ fontSize: 13, fontWeight: 800, color: t.seconds > MODES[t.mode].seconds ? "#b91c1c" : "#166534" }}>
              {mmss(t.seconds)} {t.seconds > MODES[t.mode].seconds ? `(${t.seconds - MODES[t.mode].seconds}s over)` : "(within time)"}
            </span>
          </div>
          {t.hasVideo ? (
            <video src={t.url} controls playsInline style={{ width: "100%", maxWidth: 480, borderRadius: 12, background: "#0f172a" }} />
          ) : (
            <audio src={t.url} controls style={{ width: "100%", maxWidth: 480 }} />
          )}
          <div style={{ fontSize: 12.5, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em", margin: "12px 0 6px" }}>Watch it back and tick what you did well</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 4 }}>
            {CHECKS.map((c) => (
              <label key={c} style={checkRow}>
                <input type="checkbox" checked={t.checks.includes(c)} onChange={() => updateTake(t.id, { checks: t.checks.includes(c) ? t.checks.filter((x) => x !== c) : [...t.checks, c] })} style={{ accentColor: ACCENT }} />
                {c}
              </label>
            ))}
          </div>
          <textarea value={t.notes} onChange={(e) => updateTake(t.id, { notes: e.target.value })} rows={2} placeholder="What will you change in the next take?" style={{ width: "100%", boxSizing: "border-box", marginTop: 8, padding: "8px 10px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, fontFamily: "inherit", resize: "vertical", color: "#0f172a", background: "#fff" }} />
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
            <a href={t.url} download={`practice-${t.mode}-take-${takes.length - i}.${t.hasVideo ? "webm" : "webm"}`} style={{ fontSize: 13, fontWeight: 800, color: ACCENT }}>Download</a>
            <button onClick={() => removeTake(t.id)} style={{ fontSize: 12.5, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Delete</button>
            <span style={{ fontSize: 12.5, color: "#64748b" }}>{t.checks.length}/{CHECKS.length} checks</span>
          </div>
        </section>
      ))}

      {takes.length === 0 && <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>Record two practice takes before your presentation, and compare them. Most people improve a lot between the first and second.</p>}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 15.5, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const checkRow: CSSProperties = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#1e293b", lineHeight: 1.5 };
const primaryBtn: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "10px 16px", cursor: "pointer" };
const chip = (on: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: on ? "#fff" : "#334155",
  background: on ? ACCENT : "#fff",
  border: `1px solid ${on ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 13px",
  cursor: "pointer",
});
