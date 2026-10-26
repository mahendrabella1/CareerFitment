"use client";
/** Start screen of the Stress & Resilience Check: what it is, the career
 *  stage, privacy consent. */
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { BAND_META, PILLAR_META } from "@/lib/stress/content";
import { itemsFor } from "@/lib/stress/bank";
import { BANDS, PILLARS, PRESSURE_PILLARS, type Band } from "@/lib/stress/types";
import { PRESSURE, RESOURCE, STRESS_CSS } from "./styles";

export function StressIntro({ initialBand, onStart, resuming }: { initialBand: Band; onStart: (b: Band) => void; resuming?: boolean }) {
  const [band, setBand] = useState<Band>(initialBand);
  const [consent, setConsent] = useState(false);
  const minutes = Math.round((itemsFor(band).length * 11) / 60);

  return (
    <div className="st">
      <style dangerouslySetInnerHTML={{ __html: STRESS_CSS }} />
      <header className="st-bar">
        <div className="st-wrap st-bar-in">
          <Link href="/account" className="st-brand" aria-label="OneGrasp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
            <span>Stress &amp; Resilience</span>
          </Link>
        </div>
      </header>

      <main className="st-wrap" style={{ paddingTop: 28, paddingBottom: 48 }}>
        <section className="st-card" style={{ background: "linear-gradient(135deg,#fff 50%,var(--pri-t))", padding: "clamp(22px,4vw,36px)" }}>
          <span className="st-eyebrow">For working professionals</span>
          <h1 style={{ fontSize: "clamp(28px,4.6vw,42px)", fontWeight: 700, lineHeight: 1.12, marginTop: 8, maxWidth: 680 }}>
            Stress &amp; Resilience Check
          </h1>
          <p className="st-sub" style={{ fontSize: 16.5, maxWidth: 620 }}>
            Find out how much pressure you&apos;re under, what&apos;s really causing it, how it&apos;s affecting you - and get a 30-day plan built from your answers.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            <span className="st-chip"><Icon name="clock" size={14} /> About {minutes} minutes</span>
            <span className="st-chip"><Icon name="radar" size={14} /> 8 areas measured</span>
            <span className="st-chip"><Icon name="check" size={14} /> Includes standard burnout &amp; coping scales</span>
            <span className="st-chip"><Icon name="lock" size={14} /> Private to you</span>
          </div>
        </section>

        <div className="st-grid2" style={{ marginTop: 16 }}>
          <section className="st-card">
            <span className="st-eyebrow">What we measure</span>
            <h2 className="st-h2">Your pressures and your resources</h2>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {PILLARS.map((k) => {
                const pressure = PRESSURE_PILLARS.includes(k);
                return (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span className="st-pillar-ic" style={{ background: pressure ? "var(--press-t)" : "var(--res-t)", color: pressure ? PRESSURE : RESOURCE }}><Icon name={PILLAR_META[k].icon} size={16} /></span>
                    <span style={{ minWidth: 0 }}><b style={{ fontSize: 14 }}>{PILLAR_META[k].label}</b><span style={{ display: "block", fontSize: 12.5, color: "var(--muted)" }}>{PILLAR_META[k].short}</span></span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="st-card">
            <span className="st-eyebrow">What you get</span>
            <h2 className="st-h2">A results page you can come back to</h2>
            <ul style={{ margin: "12px 0 0", paddingLeft: 0, listStyle: "none", display: "grid", gap: 10 }}>
              {[
                ["pulse", "Your Stress Index and zone, in plain words"],
                ["scale", "Pressure vs resources - which side to work on"],
                ["target", "The top causes of your stress"],
                ["route", "A 30-day plan with weekly check-ins"],
                ["users", "How you compare with people at your career stage"],
                ["clock", "Progress over time when you retake it"],
              ].map(([ic, t]) => (
                <li key={t} style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 14 }}>
                  <span style={{ color: "var(--pri)" }}><Icon name={ic} size={18} /></span>{t}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="st-card" style={{ marginTop: 16 }}>
          <span className="st-eyebrow">Your career stage</span>
          <h2 className="st-h2">How long have you been working?</h2>
          <p className="st-sub">Some questions and all comparisons are specific to your stage.</p>
          <div className="st-grid4 st-bands" style={{ gridTemplateColumns: "repeat(3,minmax(0,1fr))", marginTop: 14 }} role="radiogroup" aria-label="Years of work experience">
            {BANDS.map((b) => (
              <button key={b} role="radio" aria-checked={band === b} className="st-opt" style={{ flexDirection: "column", alignItems: "flex-start", gap: 4 }} onClick={() => setBand(b)}>
                <b style={{ fontSize: 17 }}>{BAND_META[b].label}</b>
                <span style={{ fontSize: 13, color: "var(--muted)", fontWeight: 500 }}>{BAND_META[b].title}</span>
              </button>
            ))}
          </div>

          <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 18, fontSize: 14, lineHeight: 1.55, cursor: "pointer" }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 20, height: 20, accentColor: "var(--pri)", marginTop: 2, flex: "none" }} />
            <span>I understand this is a wellbeing check, not a medical diagnosis. My answers are stored privately on my account; only anonymous scores are used for career-stage comparisons, and nothing is shared with any employer.</span>
          </label>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 18 }}>
            <button className="st-btn st-btn-pri st-btn-lg" disabled={!consent} onClick={() => onStart(band)}>{resuming ? "Continue where you left off" : "Start the check"} <Icon name="arrowRight" size={16} /></button>
            <span className="st-note">{itemsFor(band).length} questions + 4 quick facts about your work week · you can stop and continue later</span>
          </div>
        </section>
      </main>
    </div>
  );
}
