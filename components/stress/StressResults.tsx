"use client";
/**
 * The results web page for the Stress & Resilience Check - the "report" is
 * this page: an answer above the fold (gauge, zone, one sentence, plan), then
 * four tabs. Everything shown is computed in lib/stress/scoring.ts; the words
 * come from lib/stress/content.ts.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { ACTIONS, BAND_META, DRIVER_META, HELPLINE, PILLAR_META, ZONE_META, actionById, pillarTone } from "@/lib/stress/content";
import { BANK } from "@/lib/stress/bank";
import { percentileFrom, type Benchmarks } from "@/lib/stress/client";
import { PILLARS, PRESSURE_PILLARS, type CopeScale, type PillarKey, type StressPlan, type StressResult } from "@/lib/stress/types";
import { BurnoutMeter, Gauge, Seesaw, TrendChart } from "./charts";
import { PRESSURE, RESOURCE, STRESS_CSS } from "./styles";

type Tab = "overview" | "drivers" | "plan" | "progress";
const TABS: { id: Tab; label: string; short: string }[] = [
  { id: "overview", label: "Overview", short: "Overview" }, { id: "drivers", label: "What's driving it", short: "Causes" },
  { id: "plan", label: "Your plan", short: "Plan" }, { id: "progress", label: "Progress", short: "Progress" },
];
const COPE_LABEL: Record<CopeScale, string> = {
  active: "Taking action", planning: "Planning", reframing: "Seeing it differently", emotional: "Emotional support", advice: "Asking for advice",
  givingup: "Giving up", selfblame: "Blaming yourself", substance: "Alcohol or drugs",
};
const MOODS = ["Much worse", "A bit worse", "About the same", "A bit better", "Much better"];

const weekKey = (d = new Date()) => {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return `${t.getUTCFullYear()}-W${String(Math.ceil(((+t - +y0) / 86400000 + 1) / 7)).padStart(2, "0")}`;
};
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** One plain sentence about the balance and the top causes. */
function summaryLine(r: StressResult): string {
  const s = r.scores;
  const causes = s.drivers.slice(0, 2).map((d) => DRIVER_META[d.source]?.label.toLowerCase()).filter(Boolean);
  const because = causes.length ? ` - mainly ${causes.join(" and ")}` : "";
  if (s.balance <= -15) return `Your pressure (${s.pressure}) is higher than your resources (${s.resources}) right now${because}.`;
  if (s.balance >= 15) return `Your resources (${s.resources}) outweigh your pressure (${s.pressure})${causes.length ? `. The main things to watch: ${causes.join(" and ")}` : ""}.`;
  return `Your pressure (${s.pressure}) and resources (${s.resources}) are roughly balanced${because}.`;
}

export function StressResults({ result, history, plan, benchmarks, firstName, onPlanChange, retakeHref }: {
  result: StressResult;
  history: StressResult[];
  plan?: StressPlan;
  benchmarks: Benchmarks | null;
  firstName?: string;
  onPlanChange: (p: StressPlan) => void;
  retakeHref: string;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const s = result.scores;
  const zone = ZONE_META[s.zone];
  const band = BAND_META[result.band];
  const nextRetake = new Date(new Date(result.takenAt).getTime() + 30 * 86400000);

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
          <div className="st-bar-r">
            <button className="st-btn" onClick={() => window.print()}><Icon name="save" size={15} /> Save as PDF</button>
            <Link className="st-btn st-btn-pri" href={retakeHref}>Retake</Link>
          </div>
        </div>
      </header>

      <main className="st-wrap" style={{ paddingTop: 24, paddingBottom: 48 }}>
        {s.safety !== "none" && <CareBanner strong={s.safety === "high"} />}

        {/* ---------- above the fold ---------- */}
        <section className="st-card st-hero" style={{ marginTop: s.safety !== "none" ? 16 : 0, background: `linear-gradient(135deg, #fff 55%, ${zone.tint})` }}>
          <Gauge value={s.index} zone={s.zone} />
          <div>
            <span className="st-zone" style={{ background: zone.tint, color: zone.color, border: `1px solid ${zone.color}33` }}>
              <i style={{ width: 8, height: 8, borderRadius: 99, background: zone.color }} /> {zone.label}
            </span>
            <h1 style={{ marginTop: 12 }}>{firstName ? `${firstName}, ${zone.headline.charAt(0).toLowerCase()}${zone.headline.slice(1)}` : zone.headline}</h1>
            <p className="st-sub" style={{ fontSize: 15.5 }}>{summaryLine(result)}</p>
            <div className="st-hero-actions" style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
              <button className="st-btn st-btn-pri" onClick={() => setTab("plan")}>See your 30-day plan <Icon name="arrowRight" size={15} /></button>
              <span className="st-chip"><Icon name="cap" size={14} /> {band.title} · {band.label}</span>
            </div>
            <p className="st-note" style={{ marginTop: 12 }}>Taken {fmtDate(result.takenAt)} · {BANK.items.filter((i) => !i.band || i.band === result.band).length} questions</p>
          </div>
        </section>

        {s.confidence.level === "low" && (
          <p className="st-note" style={{ marginTop: 12, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "10px 14px", color: "#854d0e" }}>
            Some answers looked rushed or very alike, so these results may be less accurate. When you have 15 quiet minutes, retaking the check will give a truer picture.
          </p>
        )}

        <div className="st-tabs" role="tablist" aria-label="Result sections">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} className="st-tab" onClick={() => setTab(t.id)}><span className="st-tab-long">{t.label}</span><span className="st-tab-short">{t.short}</span></button>
          ))}
        </div>

        {/* All four stay in the page (inactive ones hidden) so "Save as PDF" prints the whole result. */}
        <div className="st-panel" hidden={tab !== "overview"}><Overview result={result} benchmarks={benchmarks} /></div>
        <div className="st-panel" hidden={tab !== "drivers"}><Drivers result={result} /></div>
        <div className="st-panel" hidden={tab !== "plan"}><PlanTab result={result} plan={plan} onChange={onPlanChange} nextRetake={nextRetake} /></div>
        <div className="st-panel" hidden={tab !== "progress"}><ProgressTab history={history} retakeHref={retakeHref} nextRetake={nextRetake} /></div>

        <div className="st-stack" style={{ marginTop: 24 }}>
          {s.safety === "none" && <CareBanner strong={false} />}
          <Method />
          <p className="st-note" style={{ textAlign: "center" }}>
            Your answers and results are private to your account. This is a wellbeing check, not a medical diagnosis.
          </p>
        </div>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------- tabs

function Overview({ result, benchmarks }: { result: StressResult; benchmarks: Benchmarks | null }) {
  const s = result.scores;
  const band = BAND_META[result.band];
  const pct = benchmarks?.ready ? percentileFrom(benchmarks.index, s.index) : null;
  return (
    <div className="st-stack">
      <section className="st-card">
        <span className="st-eyebrow">Your stress balance</span>
        <h2 className="st-h2">{s.balance <= -15 ? "Pressure is outweighing your resources" : s.balance >= 15 ? "Your resources outweigh your pressure" : "Pressure and resources are in balance"}</h2>
        <p className="st-sub">Stress builds when what's asked of you (pressure) is greater than what helps you cope and recover (resources). The answer is either to lighten the load or to build up the resources - your plan does both.</p>
        <div style={{ marginTop: 14 }}><Seesaw pressure={s.pressure} resources={s.resources} /></div>
        <div className="st-legend" style={{ justifyContent: "center" }}>
          <span><i style={{ background: PRESSURE }} />Pressure = load, stress signals, burnout</span>
          <span><i style={{ background: RESOURCE }} />Resources = coping, resilience, recovery, calm, support</span>
        </div>
      </section>

      <section>
        <span className="st-eyebrow">Your 8 areas</span>
        <h2 className="st-h2" style={{ marginBottom: 12 }}>Where you stand</h2>
        <div className="st-grid4">
          {PILLARS.map((k) => <PillarCard key={k} k={k} score={s.pillars[k]} />)}
        </div>
      </section>

      <section className="st-card">
        <span className="st-eyebrow">At your career stage · {band.label}</span>
        <h2 className="st-h2">{band.title}</h2>
        <p className="st-sub">{band.blurb}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {band.typical.map((t) => <span key={t} className="st-chip" style={{ background: "#f2f4f7", color: "#465467" }}>{t}</span>)}
        </div>
        <div style={{ marginTop: 18, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          {benchmarks?.ready && pct !== null ? (
            <>
              <p style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 650 }}>
                Your Stress Index is higher than about <b style={{ color: PRESSURE }}>{pct}%</b> of {benchmarks.n.toLocaleString("en-IN")} people at {band.label}.
              </p>
              {PILLARS.map((k) => {
                const p = percentileFrom(benchmarks.pillars?.[k], s.pillars[k]);
                if (p === null) return null;
                return (
                  <div key={k} className="st-compare">
                    <span>{PILLAR_META[k].label}</span>
                    <span className="st-compare-track"><span className="st-compare-dot" style={{ left: `${p}%`, background: PRESSURE_PILLARS.includes(k) ? PRESSURE : RESOURCE }} /></span>
                    <span className="st-note">Higher than {p}%</span>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="st-note" style={{ margin: 0 }}>
              <Icon name="users" size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
              How you compare with other professionals at {band.label} appears here once {benchmarks?.needed ?? 30} people at your stage have taken the check{benchmarks?.n ? ` (${benchmarks.n} so far)` : ""}. Comparisons use anonymous scores only.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function PillarCard({ k, score }: { k: PillarKey; score: number }) {
  const meta = PILLAR_META[k];
  const pressure = PRESSURE_PILLARS.includes(k);
  const color = pressure ? PRESSURE : RESOURCE;
  const tone = pillarTone(k, score);
  const good = tone === "good";
  return (
    <div className="st-pillar">
      <div className="st-pillar-h">
        <span className="st-pillar-ic" style={{ background: pressure ? "var(--press-t)" : "var(--res-t)", color }}><Icon name={meta.icon} size={17} /></span>
        <div style={{ minWidth: 0 }}>
          <div className="st-pillar-kind" style={{ color }}>{pressure ? "Pressure" : "Resource"}</div>
          <div className="st-pillar-name">{meta.label}</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <span className="st-pillar-score">{score}</span>
        <span className={`st-tone ${tone}`}>{tone === "good" ? "Good" : tone === "okay" ? "Okay" : "Watch"}</span>
      </div>
      <div className="st-bar-track"><div className="st-bar-fill" style={{ width: `${score}%`, background: color }} /></div>
      <p>{tone === "okay" ? meta.mid : pressure ? (good ? meta.low : meta.high) : (good ? meta.high : meta.low)}</p>
    </div>
  );
}

function Drivers({ result }: { result: StressResult }) {
  const s = result.scores;
  const level = (v: number) => (v >= 75 ? 4 : v >= 50 ? 3 : v >= 25 ? 2 : v > 0 ? 1 : 0);
  const quad: { k: keyof typeof s.signals; label: string; hint: string }[] = [
    { k: "body", label: "Body", hint: "Sleep, aches, tension" }, { k: "mind", label: "Mind", hint: "Focus, overthinking" },
    { k: "emotions", label: "Emotions", hint: "Irritability, worry" }, { k: "behaviour", label: "Behaviour", hint: "Withdrawing, escape habits" },
  ];
  const helpful: CopeScale[] = ["active", "planning", "reframing", "emotional", "advice"];
  const risky: CopeScale[] = ["givingup", "selfblame", "substance"];
  return (
    <div className="st-stack">
      <section className="st-card">
        <span className="st-eyebrow">Root causes</span>
        <h2 className="st-h2">What&apos;s driving your stress</h2>
        <p className="st-sub">The pressures you rated &quot;sometimes&quot; or more, plus your work week. Strongest first.</p>
        <div style={{ marginTop: 10 }}>
          {s.drivers.length ? s.drivers.slice(0, 7).map((d) => (
            <div key={d.source} className="st-driver">
              <span className="st-driver-ic"><Icon name={DRIVER_META[d.source]?.icon ?? "pulse"} size={17} /></span>
              <span><b>{DRIVER_META[d.source]?.label ?? d.source}</b><small>{d.value >= 100 ? "All the time" : d.value >= 75 ? "Often" : "Sometimes"}</small></span>
              <span className="st-bar-track"><span className="st-bar-fill" style={{ display: "block", width: `${d.value}%`, background: PRESSURE }} /></span>
              <b style={{ textAlign: "right", color: PRESSURE }}>{d.value}</b>
            </div>
          )) : <p className="st-note">No single pressure stands out - your load is spread thin, or light.</p>}
        </div>
      </section>

      <div className="st-grid2">
        <section className="st-card">
          <span className="st-eyebrow">Stress signals</span>
          <h2 className="st-h2">How stress shows in you</h2>
          <div className="st-quad" style={{ marginTop: 14 }}>
            {quad.map((q) => {
              const v = s.signals[q.k], l = level(v);
              return (
                <div key={q.k} className="st-quad-cell" style={l >= 3 ? { borderColor: "#fed7aa", background: "#fff8f2" } : undefined}>
                  <b>{q.label}</b><span>{q.hint}</span>
                  <div className="st-dots" aria-label={`${q.label}: ${v} out of 100`}>{[1, 2, 3, 4].map((i) => <i key={i} style={i <= l ? { background: PRESSURE } : undefined} />)}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="st-card">
          <span className="st-eyebrow">Copenhagen Burnout Inventory</span>
          <h2 className="st-h2">Your burnout check</h2>
          <p className="st-sub">Scored with the inventory&apos;s own method: 50+ is moderate, 75+ is high.</p>
          <div className="st-stack" style={{ marginTop: 16, gap: 14 }}>
            <BurnoutMeter label="Personal burnout (overall exhaustion)" value={s.burnout.personal} />
            <BurnoutMeter label="Work-related burnout" value={s.burnout.work} />
          </div>
          <p className="st-note" style={{ marginTop: 6 }}>Overall: <b style={{ textTransform: "capitalize" }}>{s.burnout.band}</b></p>
        </section>
      </div>

      <div className="st-grid2">
        <section className="st-card">
          <span className="st-eyebrow">Brief COPE</span>
          <h2 className="st-h2">How you cope</h2>
          <p className="st-sub">How much you&apos;ve used each way of coping. Longer bars = used more.</p>
          {([["Helps you", helpful, RESOURCE], ["Works against you", risky, "#e11d48"]] as const).map(([title, list, color]) => (
            <div key={title} style={{ marginTop: 14 }}>
              <div className="st-pillar-kind" style={{ color, marginBottom: 6 }}>{title}</div>
              {list.map((k) => (
                <div key={k} className="st-cope">
                  <span>{COPE_LABEL[k]}</span>
                  <span className="st-bar-track"><span className="st-bar-fill" style={{ display: "block", width: `${s.coping.scales[k]}%`, background: color }} /></span>
                  <b style={{ textAlign: "right", color }}>{s.coping.scales[k]}</b>
                </div>
              ))}
            </div>
          ))}
        </section>

        <section className="st-card">
          <span className="st-eyebrow">Support system</span>
          <h2 className="st-h2">Who you can lean on</h2>
          <div className="st-stack" style={{ gap: 14, marginTop: 16 }}>
            {[{ label: "At work - manager, team, speaking up", v: s.support.work }, { label: "Outside work - family, friends, mentors", v: s.support.personal }].map((x) => (
              <div key={x.label}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}><b>{x.label}</b><b style={{ color: RESOURCE }}>{x.v}</b></div>
                <div className="st-bar-track" style={{ height: 10 }}><div className="st-bar-fill" style={{ width: `${x.v}%`, background: RESOURCE }} /></div>
              </div>
            ))}
            <p className="st-note" style={{ margin: 0 }}>{s.support.work < 50 && s.support.personal >= 50 ? "You have people outside work, but less support at work - the workload talk in your plan can help." : s.support.personal < 50 ? "You may be carrying this alone. Even one person to talk to makes a measurable difference." : "You have support around you - use it, especially in heavy weeks."}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

function PlanTab({ result, plan, onChange, nextRetake }: { result: StressResult; plan?: StressPlan; onChange: (p: StressPlan) => void; nextRetake: Date }) {
  const current: StressPlan = plan && plan.resultId === result.id ? plan : { resultId: result.id, actionIds: [], done: {}, checkins: [] };
  const ids = current.actionIds.length ? current.actionIds : ["shutdown", "move", "support-circle"];
  const actions = ids.map((id) => actionById(id)).filter((a): a is (typeof ACTIONS)[number] => Boolean(a));
  const totalSteps = actions.reduce((n, a) => n + a.steps.length, 0);
  const doneSteps = actions.reduce((n, a) => n + a.steps.filter((_, i) => current.done[`${a.id}:${i}`]).length, 0);
  const week = weekKey();
  const thisWeek = current.checkins.find((c) => c.week === week);

  const toggle = (key: string) => onChange({ ...current, actionIds: ids, done: { ...current.done, [key]: !current.done[key] } });
  const checkIn = (mood: number) => onChange({ ...current, actionIds: ids, checkins: [...current.checkins.filter((c) => c.week !== week), { week, mood, at: new Date().toISOString() }] });

  return (
    <div className="st-stack">
      <section className="st-card" style={{ background: "linear-gradient(135deg,#fff 60%,var(--pri-t))" }}>
        <span className="st-eyebrow">Your 30-day reset plan</span>
        <h2 className="st-h2">Three changes, chosen from your results</h2>
        <p className="st-sub">Start with the first. Tick steps as you go - progress saves to your account.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14 }}>
          <div className="st-bar-track" style={{ flex: 1, height: 10 }}><div className="st-bar-fill" style={{ width: `${totalSteps ? (doneSteps / totalSteps) * 100 : 0}%`, background: "var(--pri)" }} /></div>
          <b style={{ fontSize: 13.5 }}>{doneSteps}/{totalSteps} steps</b>
        </div>
      </section>

      {actions.map((a, n) => (
        <article key={a.id} className="st-action">
          <div className="st-action-h">
            <span className="st-action-n">{n + 1}</span>
            <div style={{ minWidth: 0 }}>
              <h3>{a.title}</h3>
              <p>{a.why}</p>
            </div>
          </div>
          {a.steps.map((step, i) => {
            const key = `${a.id}:${i}`;
            return (
              <label key={key} className={`st-step${current.done[key] ? " is-done" : ""}`}>
                <input type="checkbox" checked={Boolean(current.done[key])} onChange={() => toggle(key)} />
                <span>{step}</span>
              </label>
            );
          })}
          {a.link && <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line)" }}><Link className="st-link" href={a.link.href}>{a.link.label} →</Link></div>}
        </article>
      ))}

      <section className="st-card">
        <span className="st-eyebrow">Weekly check-in · 1 minute</span>
        <h2 className="st-h2">How are you feeling this week, compared with last?</h2>
        <div className="st-mood" role="group" aria-label="This week's check-in">
          {MOODS.map((m, i) => <button key={m} aria-pressed={thisWeek?.mood === i + 1} onClick={() => checkIn(i + 1)}>{m}</button>)}
        </div>
        <p className="st-note" style={{ marginTop: 12 }}>
          {current.checkins.length ? `${current.checkins.length} check-in${current.checkins.length === 1 ? "" : "s"} so far. ` : ""}
          Retake the full check on or after <b>{fmtDate(nextRetake.toISOString())}</b> to see how much has changed.
        </p>
      </section>
    </div>
  );
}

function ProgressTab({ history, retakeHref, nextRetake }: { history: StressResult[]; retakeHref: string; nextRetake: Date }) {
  const points = history.map((r) => ({ at: r.takenAt, index: r.scores.index }));
  const prev = history.length >= 2 ? history[history.length - 2] : null;
  const last = history[history.length - 1];
  return (
    <div className="st-stack">
      <section className="st-card">
        <span className="st-eyebrow">Progress</span>
        <h2 className="st-h2">{prev ? (last.scores.index < prev.scores.index ? `Down ${prev.scores.index - last.scores.index} points since ${fmtDate(prev.takenAt)}` : last.scores.index > prev.scores.index ? `Up ${last.scores.index - prev.scores.index} points since ${fmtDate(prev.takenAt)}` : "Same as last time") : "Your starting point"}</h2>
        <p className="st-sub">{prev ? "Lower is better. Each retake adds a point to the chart." : `This is your baseline. Retake on or after ${fmtDate(nextRetake.toISOString())} to see your progress.`}</p>
        <div style={{ marginTop: 14 }}><TrendChart points={points} /></div>
        {!prev && <div style={{ marginTop: 10 }}><Link className="st-btn" href={retakeHref}>Retake now</Link></div>}
      </section>
      {prev && (
        <section className="st-card">
          <h2 className="st-h2" style={{ fontSize: 18 }}>Change in each area since last time</h2>
          <div style={{ marginTop: 10 }}>
            {PILLARS.map((k) => {
              const d = last.scores.pillars[k] - prev.scores.pillars[k];
              const better = PRESSURE_PILLARS.includes(k) ? d < 0 : d > 0;
              return (
                <div key={k} className="st-compare" style={{ gridTemplateColumns: "minmax(0,1fr) 90px" }}>
                  <span>{PILLAR_META[k].label}</span>
                  <b style={{ textAlign: "right", color: d === 0 ? "var(--muted)" : better ? "#15803d" : "#c2410c" }}>{d === 0 ? "No change" : `${d > 0 ? "+" : ""}${d} ${better ? "↑ better" : "↓ worse"}`}</b>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- shared

function CareBanner({ strong }: { strong: boolean }) {
  return (
    <div className={`st-care${strong ? " is-strong" : ""}`} role={strong ? "alert" : undefined}>
      <Icon name="heart" size={22} style={{ flex: "none", marginTop: 2 }} />
      <div>
        <b>{strong ? "You don't have to carry this alone." : "Need to talk to someone?"}</b>
        <div style={{ marginTop: 4 }}>
          {strong ? "Some of your answers suggest things feel very heavy right now. Please talk to someone you trust today, or call " : "Free, confidential support is available any time: call "}
          <a href={`tel:${HELPLINE.number}`} style={{ color: "inherit", fontWeight: 800 }}>{HELPLINE.name} {HELPLINE.number}</a> (or {HELPLINE.alt}). {HELPLINE.note}
          {strong ? " If you are in immediate danger, call 112." : ""}
        </div>
      </div>
    </div>
  );
}

function Method() {
  return (
    <details className="st-card st-accordion">
      <summary>How we measured this <span className="st-caret"><Icon name="chevronRight" size={18} /></span></summary>
      <ul style={{ paddingLeft: 18, marginTop: 12 }}>
        <li><b>Burnout</b> uses the Copenhagen Burnout Inventory (personal and work-related scales), asked word for word and scored with its own method - each answer 0 to 100, a scale&apos;s score is the average; 50+ moderate, 75+ high.</li>
        <li><b>Coping</b> uses eight scales of the Brief COPE, asked word for word. Its author gives no overall coping score, so the &quot;coping balance&quot; area is ours: helpful strategies minus risky ones.</li>
        <li><b>Pressure, stress signals, resilience, recovery, staying calm and support</b> are OneGrasp&apos;s own questions in the same standard format: a 4-week recall and 5-point answer scales scored 0-100.</li>
        <li><b>Stress Index</b> (OneGrasp): 70% pressure (40% load, 25% signals, 35% burnout) plus 30% missing resources. A burnout score in the inventory&apos;s high band always puts you in the burnout-risk zone.</li>
        <li>Career-stage comparisons use anonymous scores from people in the same experience band, shown only once at least 30 have taken the check.</li>
      </ul>
      <p className="st-note" style={{ marginBottom: 0 }}>{BANK.citations.join(" ")}</p>
    </details>
  );
}
