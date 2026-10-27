"use client";
/** Progress on the results page: a 20-second weekly check-in per area, its
 *  trend, and the overall score across retakes. */
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { AREA_META } from "@/lib/stress/content";
import { AREAS, type AreaKey, type StressPlan, type StressResult } from "@/lib/stress/types";
import { Sparkline, TrendChart } from "./charts";

/** Three answers, like the check itself: stored as 0 / 50 / 100. */
const PULSE = ["Light", "Manageable", "Heavy"];
const STEP = 100 / (PULSE.length - 1);
const pulseLabel = (v: number) => PULSE[Math.min(PULSE.length - 1, Math.max(0, Math.round(v / STEP)))];
const DAY = 86400000;

const weekKey = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((+t - +y0) / DAY + 1) / 7)).padStart(2, "0")}`;
};
const short = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export function ProgressSection({ result, history, plan, onChange, retakeHref }: {
  result: StressResult; history: StressResult[]; plan: StressPlan; onChange: (p: StressPlan) => void; retakeHref: string;
}) {
  const wk = weekKey();
  const existing = plan.pulses.find((p) => p.week === wk);
  const [draft, setDraft] = useState<Partial<Record<AreaKey, number>>>(existing?.values ?? {});
  const [saved, setSaved] = useState(!!existing);
  const complete = AREAS.every((a) => draft[a] !== undefined);

  const pick = (a: AreaKey, v: number) => { setDraft((d) => ({ ...d, [a]: v })); setSaved(false); };
  const save = () => {
    const pulses = [...plan.pulses.filter((p) => p.week !== wk), { week: wk, at: new Date().toISOString(), values: draft as Record<AreaKey, number> }]
      .sort((x, y) => x.week.localeCompare(y.week))
      .slice(-26);
    onChange({ ...plan, pulses });
    setSaved(true);
  };

  const runs = [...history].sort((x, y) => x.takenAt.localeCompare(y.takenAt));
  const prev = runs.length > 1 ? runs[runs.length - 2] : null;
  const due = new Date(new Date(result.takenAt).getTime() + 30 * DAY);
  const isDue = Date.now() >= due.getTime();

  return (
    <section id="ws-progress" className="ws-sec">
      <div className="ws-sec-h">
        <div><h2>Progress</h2><p className="ws-sub ws-small">A quick weekly check-in between full checks, so you can see whether your plan is working.</p></div>
      </div>

      <div style={{ display: "grid", gap: 16 }}>
        <section className="ws-card">
          <h3 className="ws-h3">This week, how heavy did each area feel?</h3>
          <p className="ws-muted" style={{ marginTop: 2 }}>Takes 20 seconds. You can update it any time this week.</p>
          <div className="ws-pulse">
            {AREAS.map((a) => (
              <div key={a} className="ws-prow">
                <span className="ws-arow-name">
                  <Icon name={AREA_META[a].icon} size={16} /> {AREA_META[a].label}
                </span>
                <div className="ws-pbtns" role="radiogroup" aria-label={`${AREA_META[a].label} this week`}>
                  {PULSE.map((label, i) => (
                    <button key={label} role="radio" aria-checked={draft[a] === i * STEP} onClick={() => pick(a, i * STEP)}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 16 }} className="ws-noprint">
            <button className="ws-btn ws-btn-pri" disabled={!complete || saved} onClick={save}>{saved ? <><Icon name="check" size={15} /> Saved for this week</> : "Save this week"}</button>
            {!complete && <span className="ws-muted">Pick one for each area.</span>}
          </div>
        </section>

        <section className="ws-card">
          <h3 className="ws-h3">Your weekly trend</h3>
          <p className="ws-muted" style={{ marginTop: 2 }}>{plan.pulses.length ? `${plan.pulses.length} check-in${plan.pulses.length > 1 ? "s" : ""} since ${short(plan.startedAt)}` : "Your first check-in will start the trend."}</p>
          <div className="ws-sparks" style={{ marginTop: 12 }}>
            {AREAS.map((a) => {
              const vals = plan.pulses.map((p) => p.values[a]).filter((v) => typeof v === "number");
              const last = vals[vals.length - 1];
              const delta = vals.length > 1 ? last - vals[0] : null;
              return (
                <div key={a} className="ws-spark">
                  <span className="ws-label">{AREA_META[a].label}</span>
                  <b style={{ display: "block", fontSize: 16, marginTop: 4 }}>{last !== undefined ? pulseLabel(last) : "No check-in yet"}</b>
                  <div style={{ margin: "8px 0 4px" }}>{vals.length > 0 && <Sparkline values={vals} />}</div>
                  <span className="ws-muted">
                    {delta === null ? `Check score ${result.scores.areas[a]}` : delta === 0 ? "Same as week 1" : delta < 0 ? "Lighter than week 1" : "Heavier than week 1"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <section className="ws-card" style={{ marginTop: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div>
            <h3 className="ws-h3">Workplace Stress Score over time</h3>
            <p className="ws-muted" style={{ marginTop: 2 }}>
              {isDue ? "It's been 30 days - a retake now will show what has changed." : `Next full check due ${short(due.toISOString())}.`}
            </p>
          </div>
          <Link className={`ws-btn ws-btn-sm ws-noprint${isDue ? " ws-btn-pri" : ""}`} href={retakeHref}>Retake the check</Link>
        </div>
        {runs.length > 1 ? (
          <>
            <div style={{ marginTop: 12 }}><TrendChart points={runs.map((r) => ({ label: short(r.takenAt), value: r.scores.overall }))} /></div>
            {prev && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                {AREAS.map((a) => {
                  const d = result.scores.areas[a] - prev.scores.areas[a];
                  return <span key={a} className="ws-chip">{AREA_META[a].label} {prev.scores.areas[a]} → {result.scores.areas[a]} <b style={{ fontWeight: 650, color: "var(--ink)" }}>{d === 0 ? "±0" : d > 0 ? `+${d}` : `−${-d}`}</b></span>;
                })}
              </div>
            )}
          </>
        ) : (
          <p className="ws-small" style={{ marginTop: 12 }}>This is your first check: {result.scores.overall}/100. Your before-and-after chart appears here after your next one.</p>
        )}
      </section>
    </section>
  );
}
