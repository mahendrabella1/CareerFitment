"use client";
/** Start screen of the Workplace Stress Check: the four areas, what you get,
 *  career stage and consent. */
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { AREA_META, BAND_META } from "@/lib/stress/content";
import { BANK, QUESTION_COUNT } from "@/lib/stress/bank";
import { BANDS, type Band } from "@/lib/stress/types";
import { AreaTrack } from "./charts";
import { STRESS_CSS } from "./styles";

const SAMPLE: [string, number][] = [["Workload", 68], ["Toxic behaviour", 22], ["Culture & safety", 41], ["Career & security", 57]];

export function StressIntro({ initialBand, onStart, onSignOut, rebuilt }: {
  initialBand: Band;
  onStart: (b: Band) => void;
  onSignOut?: () => void;
  /** The person has a result from the earlier, longer check. */
  rebuilt?: boolean;
}) {
  const [band, setBand] = useState<Band>(initialBand);
  const [consent, setConsent] = useState(false);

  return (
    <div className="ws">
      <style dangerouslySetInnerHTML={{ __html: STRESS_CSS }} />
      <header className="ws-bar">
        <div className="ws-wrap ws-bar-in">
          <Link href="/account/stress" className="ws-brand" aria-label="OneGrasp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
            <span>Workplace Stress Check</span>
          </Link>
          <div className="ws-bar-r">
            <Link href="/jobs" className="ws-btn ws-btn-sm">Jobs</Link>
            {onSignOut && <button className="ws-btn ws-btn-sm" onClick={onSignOut}>Sign out</button>}
          </div>
        </div>
      </header>

      <main className="ws-wrap" style={{ paddingTop: 32, paddingBottom: 56 }}>
        {rebuilt && (
          <p className="ws-card ws-small" style={{ padding: "12px 16px", marginBottom: 16 }}>
            We&apos;ve rebuilt the check: {QUESTION_COUNT} questions on the four things that cause the most stress at work. Your earlier result used a different format, so please take the new check.
          </p>
        )}

        <section className="ws-hero ws-card">
          <div>
            <span className="ws-label">For working professionals</span>
            <h1 style={{ fontSize: "clamp(30px,4.4vw,42px)", lineHeight: 1.12, marginTop: 8, letterSpacing: "-.025em" }}>Workplace Stress Check</h1>
            <p className="ws-sub" style={{ fontSize: 16.5, marginTop: 12, maxWidth: 520 }}>
              Find out where your stress at work really comes from - and get a practical 30-day plan, with the exact words to use, to bring it down.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
              <span className="ws-chip"><Icon name="exam" size={14} /> {QUESTION_COUNT} questions</span>
              <span className="ws-chip"><Icon name="clock" size={14} /> About 5 minutes</span>
              <span className="ws-chip"><Icon name="lock" size={14} /> Private to you</span>
            </div>
          </div>
          <div aria-hidden="true">
            <span className="ws-label">What your results look like</span>
            <div className="ws-areas" style={{ marginTop: 10 }}>
              {SAMPLE.map(([label, v]) => (
                <div key={label} className="ws-arow" style={{ cursor: "default" }}>
                  <span className="ws-arow-name">{label}</span>
                  <AreaTrack value={v} />
                  <span className="ws-arow-val">{v}</span>
                </div>
              ))}
            </div>
            <p className="ws-muted" style={{ marginTop: 8 }}>Sample - plus your top stress points, a 30-day plan and weekly check-ins.</p>
          </div>
        </section>

        <section className="ws-sec" style={{ marginTop: 32 }}>
          <div className="ws-sec-h"><h2>The four areas we measure</h2></div>
          <div className="ws-helps" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", marginTop: 0 }}>
            {BANK.areas.map((a) => (
              <div key={a.id} className="ws-help">
                <Icon name={AREA_META[a.id].icon} size={20} />
                <h4 style={{ marginTop: 4 }}>{a.title}</h4>
                <p>{a.short}</p>
                <span className="ws-muted">{BANK.items.filter((i) => i.area === a.id).length} questions</span>
              </div>
            ))}
          </div>
        </section>

        <section className="ws-card ws-sec" style={{ marginTop: 24 }}>
          <h2 className="ws-h2">How long have you been working?</h2>
          <p className="ws-sub">Your results include notes for your career stage, and comparisons with people at the same stage.</p>
          <div role="radiogroup" aria-label="Years of work experience" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 8, marginTop: 14 }}>
            {BANDS.map((b) => (
              <button key={b} role="radio" aria-checked={band === b} className="ws-opt" onClick={() => setBand(b)}>
                <span className="ws-opt-dot" aria-hidden="true" />
                <span><b style={{ fontWeight: 650 }}>{BAND_META[b].label}</b><span className="ws-muted" style={{ display: "block" }}>{BAND_META[b].title}</span></span>
              </button>
            ))}
          </div>

          <label style={{ display: "flex", gap: 12, alignItems: "flex-start", marginTop: 20, fontSize: 14, lineHeight: 1.55, cursor: "pointer", color: "var(--ink2)" }}>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#0b0b0b", marginTop: 2, flex: "none" }} />
            <span>I understand this is a wellbeing check, not a medical diagnosis. My answers stay private on my account; only anonymous scores are used for career-stage comparisons, and nothing is shared with any employer.</span>
          </label>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginTop: 18 }}>
            <button className="ws-btn ws-btn-pri ws-btn-lg" disabled={!consent} onClick={() => onStart(band)}>Start the check <Icon name="arrowRight" size={16} /></button>
            <span className="ws-muted">You can stop and continue later.</span>
          </div>
        </section>
      </main>
    </div>
  );
}
