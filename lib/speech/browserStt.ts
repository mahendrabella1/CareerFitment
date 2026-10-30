"use client";
/**
 * The browser's own speech recognition (Chrome, Edge, Safari), run alongside
 * a recording. Its transcript travels with the audio as a fallback: when the
 * server's speech-to-text (Groq Whisper) is unavailable, feedback is built
 * from this instead, so voice practice keeps working. Returns null where the
 * browser has no speech recognition (e.g. Firefox).
 */

interface Recog {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string; confidence: number } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start: () => void; stop: () => void; abort: () => void;
}

export interface BrowserTranscript { text: string; confidence: number }

export function browserSttSupported(): boolean {
  return typeof window !== "undefined" && !!((window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
}

export function startBrowserStt(lang = "en-IN"): { stop: () => Promise<BrowserTranscript> } | null {
  if (!browserSttSupported()) return null;
  const Ctor = ((window as unknown as { SpeechRecognition?: new () => Recog }).SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition: new () => Recog }).webkitSpeechRecognition);
  const parts: { text: string; confidence: number }[] = [];
  let active = true;
  let done: (() => void) | null = null;
  let r: Recog;
  const begin = () => {
    try {
      r = new Ctor();
      r.lang = lang; r.continuous = true; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal && res[0]?.transcript?.trim()) parts.push({ text: res[0].transcript.trim(), confidence: Number(res[0].confidence) || 0 });
        }
      };
      // Chrome ends recognition after a silence or a minute; carry on while the recording does.
      r.onend = () => { if (active) begin(); else done?.(); };
      r.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") active = false; };
      r.start();
    } catch { active = false; done?.(); }
  };
  begin();
  return {
    stop: () => new Promise<BrowserTranscript>((resolve) => {
      const finish = () => {
        const conf = parts.filter((p) => p.confidence > 0);
        resolve({ text: parts.map((p) => p.text).join(" ").replace(/\s+/g, " ").trim(), confidence: conf.length ? conf.reduce((s, p) => s + p.confidence, 0) / conf.length : 0 });
      };
      if (!active) { finish(); return; }
      active = false;
      done = finish;
      try { r.stop(); } catch { finish(); return; }
      setTimeout(finish, 1500); // a last result can arrive after stop(); don't wait forever
    }),
  };
}
