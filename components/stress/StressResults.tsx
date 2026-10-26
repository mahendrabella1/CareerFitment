"use client";
/**
 * The results web page for the Workplace Stress Check - the "report" is this
 * page: the score and the four areas above the fold, then "work or
 * workplace?", the top stress points, a closer look at each area, the 30-day
 * plan and progress. Everything shown is computed in lib/stress/scoring.ts;
 * the words come from lib/stress/content.ts.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import {
  AREA_META, BAND_META, HELPLINE, LEVEL_META, LEVELS, QUADRANT_META, STAGE_NOTES,
  actionById, actionsForArea, planActionsFor, rankedPoints, summaryLine,
} from "@/lib/stress/content";
import { BANK, areaOf, itemById, itemsIn } from "@/lib/stress/bank";
import { HOTSPOT_MIN, levelFor, valueOf } from "@/lib/stress/scoring";
import { percentileFrom, type Benchmarks } from "@/lib/stress/client";
import { AREAS, type AreaKey, type StressPlan, type StressResult } from "@/lib/stress/types";
import { AnswerSeg, AreaTrack, Compass, ScaleStrip } from "./charts";
import { PlanSection } from "./PlanSection";
import { ProgressSection } from "./ProgressSection";
import { STRESS_CSS } from "./styles";

const SECTIONS = [
  { id: "ws-overview", label: "Overview" },
  { id: "ws-areas", label: "Areas" },
  { id: "ws-plan", label: "30-day plan" },
  { id: "ws-progress", label: "Progress" },
];
export const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const median = (d?: number[]) => (d && d.length === 11 ? d[5] : null);

function LevelPill({ value }: { value: number }) {
  const l = LEVEL_META[levelFor(value)];
  return <span className="ws-pill"><i style={{ background: l.color }} />{l.label}</span>;
}

export function StressResults({ result, history, plan, benchmarks, firstName, onPlanChange, retakeHref, onSignOut }: {
  result: StressResult;
  history: StressResult[];
  plan?: StressPlan;
  benchmarks: Benchmarks | null;
  firstName?: string;
  onPlanChange: (p: StressPlan) => void;
  retakeHref: string;
  onSignOut?: () => void;
}) {
  const s = result.scores;
  const band = BAND_META[result.band];
  const level = LEVEL_META[s.level];
  const [area, setArea] = useState<AreaKey>(() => [...AREAS].sort((a, b) => s.areas[b] - s.areas[a])[0]);
  const [tip, setTip] = useState<AreaKey | null>(null);
  const [active, setActive] = useState(SECTIONS[0].id);
  const ready = !!benchmarks?.ready;
  const stageAvg = ready ? median(benchmarks!.overall) : null;
  const pct = ready ? percentileFrom(benchmarks!.overall, s.overall) : null;

  const thePlan = useMemo<StressPlan>(() => plan ?? {
    resultId: result.id, startedAt: result.takenAt, actionIds: planActionsFor(s, result.answers), done: {}, pulses: [],
  }, [plan, result, s]);

  useEffect(() => {
    const els = SECTIONS.map((x) => document.getElementById(x.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: "-130px 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openArea = (a: AreaKey) => { setArea(a); go("ws-areas"); };
  const addAction = (id: string) => {
    if (!thePlan.actionIds.includes(id)) onPlanChange({ ...thePlan, actionIds: [...thePlan.actionIds, id] });
  };

  const hot = s.hotspots.slice(0, 6);
  const watch = hot.length ? [] : rankedPoints(s, result.answers).slice(0, 4);
  const q = QUADRANT_META[s.compass.quadrant];

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
            <button className="ws-btn ws-btn-sm ws-hide-sm" onClick={() => window.print()}><Icon name="save" size={15} /> Save as PDF</button>
            <Link className="ws-btn ws-btn-sm" href={retakeHref}>Retake</Link>
            {onSignOut && <button className="ws-btn ws-btn-sm" onClick={onSignOut}>Sign out</button>}
          </div>
        </div>
      </header>
      <nav className="ws-nav" aria-label="Sections">
        <div className="ws-wrap ws-nav-in">
          {SECTIONS.map((x) => <button key={x.id} aria-current={active === x.id} onClick={() => go(x.id)}>{x.label}</button>)}
        </div>
      </nav>

      <main className="ws-wrap" style={{ paddingTop: 20 }}>
        <div id="ws-overview" className="ws-sec" style={{ marginTop: 0 }}>
          {s.support === "high" && <SupportCallout strong />}

          <section className="ws-card ws-hero" style={{ marginTop: s.support === "high" ? 16 : 0 }}>
            <div>
              <span className="ws-muted">{band.label} · {band.title} · {fmtDate(result.takenAt)}</span>
              <h1 style={{ marginTop: 6 }}>{firstName ? `${firstName}, your` : "Your"} workplace stress is {level.label.toLowerCase()}.</h1>
              <div className="ws-score">
                <b>{s.overall}</b><span className="ws-of">/ 100</span>
                <span style={{ marginLeft: 8, alignSelf: "center" }}><LevelPill value={s.overall} /></span>
              </div>
              <p className="ws-sub" style={{ marginTop: 12 }}>{summaryLine(s)}</p>
              <ScaleStrip value={s.overall} avg={stageAvg} />
              <p className="ws-muted">
                {pct !== null
                  ? <>Higher than {pct}% of people at your stage ({band.label}). The white marker is their average, {stageAvg}.</>
                  : <>Comparison with your career stage unlocks once {benchmarks?.needed ?? 30} people at {band.label} have taken the check{benchmarks?.n ? ` (${benchmarks.n} so far)` : ""}.</>}
              </p>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <h2 className="ws-h3">Your four areas</h2>
                <span className="ws-muted">Tap one to see why</span>
              </div>
              <div className="ws-areas">
                {AREAS.map((a) => {
                  const v = s.areas[a];
                  const avg = ready ? median(benchmarks!.areas?.[a]) : null;
                  const often = itemsIn(a).filter((i) => (valueOf(result.answers[i.id]) ?? 0) >= HOTSPOT_MIN).length;
                  return (
                    <button
                      key={a} className="ws-arow" aria-pressed={area === a}
                      onClick={() => openArea(a)}
                      onMouseEnter={() => setTip(a)} onMouseLeave={() => setTip(null)} onFocus={() => setTip(a)} onBlur={() => setTip(null)}
                      aria-label={`${areaOf(a).title}: ${v} out of 100, ${LEVEL_META[levelFor(v)].label}. ${often} of ${itemsIn(a).length} happen often or more.`}
                    >
                      <span className="ws-arow-name"><Icon name={AREA_META[a].icon} size={17} /><span>{AREA_META[a].label}<small>{LEVEL_META[levelFor(v)].label}</small></span></span>
                      <AreaTrack value={v} avg={avg} />
                      <span className="ws-arow-val">{v}</span>
                      {tip === a && (
                        <span className="ws-tip" role="tooltip">
                          <b>{areaOf(a).title}</b> · {v}/100 · {LEVEL_META[levelFor(v)].label}<br />
                          {often} of {itemsIn(a).length} happen often or more{avg != null ? ` · stage average ${avg}` : ""}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 14 }}>
                {LEVELS.map((l) => <span key={l} className="ws-muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: LEVEL_META[l].color, display: "inline-block" }} />{LEVEL_META[l].label} {LEVEL_META[l].range}</span>)}
                {ready && <span className="ws-muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><i className="ws-avgkey" />Average at {band.label}</span>}
              </div>
            </div>
          </section>

          {s.confidence.level !== "high" && (
            <p className="ws-card ws-small" style={{ marginTop: 12, padding: "12px 16px" }}>
              {s.confidence.flags.includes("same-answer") ? "You gave the same answer to every question, " : "You answered very quickly, "}
              so these results may be less accurate. When you have 5 quiet minutes, a retake will give a truer picture.
            </p>
          )}
          {s.support === "watch" && <div style={{ marginTop: 16 }}><SupportCallout /></div>}
          {(s.rights.harassment || s.rights.discrimination) && <div style={{ marginTop: 16 }}><RightsCallout harassment={s.rights.harassment} discrimination={s.rights.discrimination} onPlan={() => go("ws-plan")} /></div>}

          <div className="ws-grid2" style={{ marginTop: 16 }}>
            <section className="ws-card">
              <h2 className="ws-h2">Is it the work, or the workplace?</h2>
              <p className="ws-sub ws-small">Workload is how the work is set up; the other three areas together are the place - its people, culture and prospects. Which is heavier changes what will help.</p>
              <div className="ws-compass">
                <Compass work={s.compass.work} place={s.compass.place} quadrant={s.compass.quadrant} />
                <div>
                  <h3 className="ws-h3">{q.title}</h3>
                  <p className="ws-small" style={{ marginTop: 6 }}>{q.text}</p>
                  <p className="ws-note"><b>Focus:</b> {q.focus}</p>
                </div>
              </div>
            </section>

            <section className="ws-card">
              <h2 className="ws-h2">{hot.length ? "Your top stress points" : "Worth keeping an eye on"}</h2>
              <p className="ws-sub ws-small">{hot.length ? "What you said happens often or almost always - strongest first." : watch.length ? "Nothing happens often, but these come up sometimes." : "Nothing you answered comes up regularly. That's a good place to be."}</p>
              <div className="ws-hot">
                {(hot.length ? hot.map((h) => itemById(h.id)!) : watch.map((w) => w.item)).map((item, n) => (
                  <button key={item.id} onClick={() => openArea(item.area)} aria-label={`${item.label}, ${AREA_META[item.area].label}: ${BANK.scale.labels[result.answers[item.id]]}`}>
                    <span className="ws-hot-n">{n + 1}</span>
                    <span><b>{item.label}</b><span className="ws-muted">{AREA_META[item.area].label}</span></span>
                    <AnswerSeg index={result.answers[item.id]} />
                  </button>
                ))}
              </div>
              {s.hotspots.length > hot.length && <p className="ws-muted" style={{ marginTop: 8 }}>+ {s.hotspots.length - hot.length} more in the areas below.</p>}
            </section>
          </div>
        </div>

        <section id="ws-areas" className="ws-sec">
          <div className="ws-sec-h">
            <div><h2>Look closer at each area</h2><p className="ws-sub ws-small">Every answer you gave, and what helps.</p></div>
          </div>
          <div className="ws-tabs" role="tablist" aria-label="Areas">
            {AREAS.map((a) => (
              <button key={a} role="tab" aria-selected={area === a} className="ws-tab" onClick={() => setArea(a)}>
                <Icon name={AREA_META[a].icon} size={16} /> <span className="ws-hide-sm">{AREA_META[a].label}</span><span className="ws-show-sm">{AREA_META[a].label.split(" ")[0]}</span> <b>{s.areas[a]}</b>
              </button>
            ))}
          </div>
          {AREAS.map((a) => <AreaDetail key={a} area={a} result={result} hidden={area !== a} benchmarks={benchmarks} plan={thePlan} onAdd={addAction} />)}
        </section>

        <PlanSection result={result} plan={thePlan} onChange={onPlanChange} />
        <ProgressSection result={result} history={history} plan={thePlan} onChange={onPlanChange} retakeHref={retakeHref} />

        <section className="ws-sec">
          <details className="ws-details">
            <summary>How this check works</summary>
            <ul>
              <li>{BANK.items.length} questions in four areas, plus one question on how you&apos;re coping. Each asks how often something happened in the last 3 months: Never (0), Rarely (25), Sometimes (50), Often (75), Almost always (100).</li>
              <li>Each area score is the average of its answers. The overall Workplace Stress Score is 60% the average of the four areas plus 40% the highest area, so one severe area isn&apos;t hidden by three calm ones.</li>
              <li>Levels: Low 0-24, Mild 25-44, Moderate 45-64, High 65-100. &quot;Work or workplace&quot; compares Workload with the other three areas combined the same way (60% average + 40% highest), each split at 45.</li>
              <li>The questions are OneGrasp&apos;s own, written to cover the six areas of the UK HSE Management Standards (demands, control, support, relationships, role, change) plus toxic behaviour and career security.</li>
              <li>This is a wellbeing check, not a medical or psychological diagnosis. Your answers are stored privately on your account; only anonymous scores count towards career-stage comparisons, and nothing is shared with any employer.</li>
            </ul>
          </details>
        </section>

        <footer className="ws-foot">
          <span>Feeling overwhelmed? <b>{HELPLINE.name} {HELPLINE.number}</b> - free, confidential, 24x7.</span>
          <span>Retake every 30 days to see what&apos;s changed.</span>
        </footer>
      </main>
    </div>
  );
}

function AreaDetail({ area, result, hidden, benchmarks, plan, onAdd }: {
  area: AreaKey; result: StressResult; hidden: boolean; benchmarks: Benchmarks | null; plan: StressPlan; onAdd: (id: string) => void;
}) {
  const s = result.scores;
  const v = s.areas[area];
  const meta = AREA_META[area];
  const items = itemsIn(area)
    .map((i, n) => ({ i, n, idx: result.answers[i.id] ?? 0 }))
    .sort((a, b) => b.idx - a.idx || a.n - b.n);
  const avg = benchmarks?.ready ? median(benchmarks.areas?.[area]) : null;
  const helps = actionsForArea(area, s, result.answers).slice(0, 3);
  return (
    <div hidden={hidden} className="ws-detail-wrap">
      <div className="ws-card ws-detail">
        <div>
          <span className="ws-label" style={{ display: "flex", alignItems: "center", gap: 8 }}><Icon name={meta.icon} size={17} /> {areaOf(area).title}</span>
          <div className="ws-score" style={{ marginTop: 12 }}>
            <b style={{ fontSize: 48 }}>{v}</b><span className="ws-of">/ 100</span>
            <span style={{ marginLeft: 8, alignSelf: "center" }}><LevelPill value={v} /></span>
          </div>
          <h3 className="ws-h3" style={{ marginTop: 14 }}>{meta.question}</h3>
          <p className="ws-small" style={{ marginTop: 4 }}>{meta.text[levelFor(v)]}</p>
          {avg != null && <p className="ws-muted" style={{ marginTop: 8 }}>People at your stage average {avg}.</p>}
          <p className="ws-note"><b>At {BAND_META[result.band].label}:</b> {STAGE_NOTES[result.band][area]}</p>
        </div>
        <div>
          <span className="ws-label">Your answers · last 3 months</span>
          <div className="ws-qs" style={{ marginTop: 8 }}>
            {items.map(({ i, idx }) => (
              <div key={i.id} className="ws-qrow">
                <div><b>{i.label}</b><p>{i.text}</p></div>
                <AnswerSeg index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <h3 className="ws-h3" style={{ marginTop: 22 }}>What helps with {meta.label.toLowerCase()}</h3>
      <div className="ws-helps">
        {helps.map((id) => {
          const a = actionById(id)!;
          const inPlan = plan.actionIds.includes(id);
          return (
            <div key={id} className="ws-help">
              <h4>{a.title}</h4>
              <p>{a.why}</p>
              <span className="ws-muted"><Icon name="clock" size={13} /> {a.time}</span>
              <button className="ws-btn ws-btn-sm ws-noprint" style={{ marginTop: 6, alignSelf: "flex-start" }} disabled={inPlan} onClick={() => onAdd(id)}>
                {inPlan ? <><Icon name="check" size={14} /> In your plan</> : <>Add to my plan</>}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SupportCallout({ strong }: { strong?: boolean }) {
  return (
    <section className="ws-card ws-callout" data-tone={strong ? "crit" : undefined} role={strong ? "alert" : undefined}>
      <span className="ws-callout-ic"><Icon name="phone" size={18} /></span>
      <div>
        <h2 className="ws-h3">{strong ? "You said you're really struggling. Please talk to someone today." : "You said you're struggling right now. You don't have to carry it alone."}</h2>
        <p className="ws-small" style={{ marginTop: 4 }}>{HELPLINE.note}</p>
        <div style={{ display: "flex", gap: 16, alignItems: "baseline", flexWrap: "wrap", marginTop: 8 }}>
          <a className="ws-tel" href={`tel:${HELPLINE.number}`}>{HELPLINE.name} {HELPLINE.number}</a>
          <span className="ws-muted">or {HELPLINE.alt}</span>
        </div>
        {strong && <p className="ws-small" style={{ marginTop: 8 }}>If you feel you might harm yourself or are in danger right now, call <a href="tel:112"><b>112</b></a>.</p>}
      </div>
    </section>
  );
}

function RightsCallout({ harassment, discrimination, onPlan }: { harassment: boolean; discrimination: boolean; onPlan: () => void }) {
  const what = harassment && discrimination ? "harassment and unfair treatment" : harassment ? "harassment" : "unfair or unethical treatment";
  return (
    <section className="ws-card ws-callout">
      <span className="ws-callout-ic"><Icon name="scale" size={18} /></span>
      <div>
        <h2 className="ws-h3">You mentioned {what}. You have options.</h2>
        <ul>
          {harassment && <li>Every organisation with 10 or more employees must have an <b>Internal Committee</b> under the POSH Act, 2013. A complaint should be made within <b>3 months</b> (extendable by 3 more).</li>}
          {harassment && <li>Women can also complain on the government&apos;s <b>SHe-Box</b> portal, shebox.wcd.gov.in.</li>}
          {discrimination && <li>For unfair treatment, raise it in writing through HR&apos;s grievance process or an ethics helpline.</li>}
          <li>Keep a private, dated record of what happened - it makes any complaint far stronger.</li>
        </ul>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }} className="ws-noprint">
          <Link className="ws-btn ws-btn-sm" href="/account/legal">Law &amp; Rights</Link>
          <button className="ws-btn ws-btn-sm" onClick={onPlan}>See the steps in your plan</button>
        </div>
      </div>
    </section>
  );
}
