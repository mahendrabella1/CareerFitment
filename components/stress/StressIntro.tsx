"use client";
/** Start screen of the Workplace Stress Check - the exam's own "Before you
 *  begin" card (app/examTheme.tsx), with the career-stage choice and consent. */
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { S, CSS, Radio, BLUE } from "@/app/examTheme";
import { BAND_META } from "@/lib/stress/content";
import { BANK, QUESTION_COUNT } from "@/lib/stress/bank";
import { BANDS, type Band } from "@/lib/stress/types";

export function StressIntro({ initialBand, onStart, onSignOut, rebuilt }: {
  initialBand: Band;
  onStart: (b: Band) => void;
  onSignOut?: () => void;
  /** The person has a result from an earlier version of the check. */
  rebuilt?: boolean;
}) {
  const [band, setBand] = useState<Band>(initialBand);
  const [agree, setAgree] = useState(false);

  return (
    <div style={S.introWrap}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div style={S.introCard} className="og-exam-introcard">
          <div style={{ marginBottom: 16 }}><Logo height={30} /></div>
          <h2 style={S.introTitle}>Workplace Stress Check</h2>
          <p style={S.introSub}>{QUESTION_COUNT} questions · about 5 minutes</p>
          {rebuilt && (
            <p style={{ ...S.disclaimer, marginTop: -6 }}>
              We&apos;ve updated the check to three answers per question. Your earlier result was scored differently, so please take it again.
            </p>
          )}
          <ul style={S.introList}>
            <li style={S.introItem}><span style={S.introIc}><Icon name="clusters" size={18} /></span><span><b>{BANK.items.length} questions in 4 areas</b> - Workload, Toxic behaviour, Culture &amp; psychological safety, and Career &amp; job security - plus one on how you&apos;re coping.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="check" size={18} /></span><span>Each has <b>three answers: Never, Sometimes or Often</b>, about the last 3 months. Tap one and it moves to the next question.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="save" size={18} /></span><span>Your answers <b>save as you go</b> - you can stop and finish later.</span></li>
            <li style={S.introItem}><span style={S.introIc}><Icon name="lock" size={18} /></span><span><b>Private to you.</b> Nothing is shared with any employer.</span></li>
          </ul>

          <div style={{ fontSize: 14, fontWeight: 800, color: "#1e293b", margin: "0 0 4px" }}>How long have you been working?</div>
          <div style={{ ...S.optList, marginTop: 6, marginBottom: 16 }} role="radiogroup" aria-label="Years of work experience">
            {BANDS.map((b) => {
              const sel = band === b;
              return (
                <button key={b} role="radio" aria-checked={sel} className="og-opt" style={{ ...S.optRow, ...(sel ? S.optRowOn : {}) }} onClick={() => setBand(b)}>
                  <Radio on={sel} />
                  <span style={{ ...S.optLabel, ...(sel ? S.optLabelOn : {}) }}><b>{BAND_META[b].label}</b> · {BAND_META[b].title}</span>
                </button>
              );
            })}
          </div>

          <p style={S.disclaimer}>
            This is a wellbeing check, not a medical diagnosis. Your results show <b>where your stress at work is coming from</b> and give you a 30-day plan.
            Only anonymous scores are used to compare you with people at your career stage.
          </p>
          <label style={S.agree}>
            <input type="checkbox" style={{ width: 18, height: 18, accentColor: BLUE, flexShrink: 0 }} checked={agree} onChange={(e) => setAgree(e.target.checked)} />
            I understand, and I&apos;m ready to begin.
          </label>
          <button style={{ ...S.primary, width: "100%", ...(agree ? {} : S.disabled) }} disabled={!agree} onClick={() => onStart(band)}>Start the check →</button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 14, fontSize: 13.5 }}>
          <Link href="/jobs" style={{ color: "#64748b", fontWeight: 600, textDecoration: "none" }}>Jobs board</Link>
          {onSignOut && <button onClick={onSignOut} style={{ background: "none", border: 0, color: "#64748b", fontWeight: 600, fontSize: 13.5, cursor: "pointer", padding: 0 }}>Sign out</button>}
        </div>
      </div>
    </div>
  );
}
