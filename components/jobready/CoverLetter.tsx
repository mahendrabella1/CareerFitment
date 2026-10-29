"use client";
/** A cover letter for one job, written by the AI from the resume and the post - editable, copy or download. */
import { useState } from "react";
import { plainText, type Resume, type Stage } from "@/lib/resume/resume";
import { authedPost } from "./JobReadyShell";

export function CoverLetter({ r, stage, title, company, jd }: { r: Resume; stage: Stage; title: string; company: string; jd: string }) {
  const [role, setRole] = useState(title || r.target);
  const [org, setOrg] = useState(company);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const write = async () => {
    setBusy(true); setErr("");
    try { setText((await authedPost<{ letter: string }>("/api/resume/ai", { action: "cover", resume: plainText(r, stage), title: role, company: org, jd })).letter); }
    catch (e) { setErr(e instanceof Error ? e.message : "That didn't work."); } finally { setBusy(false); }
  };
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1600); } catch { /* blocked */ } };
  const download = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    a.download = `Cover letter - ${org || "company"}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  return (
    <div className="cl">
      {!title && (
        <div className="cl-2">
          <input className="rb-in" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Role" aria-label="Role" />
          <input className="rb-in" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Company" aria-label="Company" />
        </div>
      )}
      {!text ? (
        <button className="fp-btn fp-btn-sm" disabled={busy || jd.trim().length < 80 || !org.trim()} onClick={() => void write()}>{busy ? "Writing your letter…" : "Write a cover letter for this job"}</button>
      ) : (
        <>
          <textarea className="rb-in" rows={12} value={text} onChange={(e) => setText(e.target.value)} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => void copy()}>{copied ? "Copied" : "Copy"}</button>
            <button className="fp-btn fp-btn-sm" onClick={download}>Download .txt</button>
            <button className="fp-btn fp-btn-sm" disabled={busy} onClick={() => void write()}>{busy ? "Rewriting…" : "Write again"}</button>
          </div>
          <small className="cl-note">Read it through and fill in anything in [brackets] - every claim must be true.</small>
        </>
      )}
      {err && <p className="rb-err">{err}</p>}
      <style dangerouslySetInnerHTML={{ __html: `.cl{display:grid;gap:8px;margin-top:10px}.cl-2{display:grid;grid-template-columns:1fr 1fr;gap:8px}.cl-note{font-size:12px;color:var(--mute)}` }} />
    </div>
  );
}
