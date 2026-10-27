"use client";
/**
 * The results dashboard for the Workplace Stress Check. It never shows the
 * answers back: it shows what they point to - the overall score, each area's
 * share of the stress, and the predicted stress drivers (lib/stress/drivers.ts)
 * - then the 30-day plan and progress. Everything is computed in
 * lib/stress/scoring.ts; the words come from lib/stress/content.ts.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import {
  AREA_COLOR, AREA_META, BAND_META, HELPLINE, LEVEL_META, LEVELS, QUADRANT_META, STAGE_NOTES,
  actionById, actionsForArea, activeDrivers, planActionsFor, summaryLine,
} from "@/lib/stress/content";
import { BANK, areaOf } from "@/lib/stress/bank";
import { DRIVERS, driverByKey } from "@/lib/stress/drivers";
import { levelFor } from "@/lib/stress/scoring";
import { percentileFrom, type Benchmarks } from "@/lib/stress/client";
import { AREAS, type AreaKey, type StressPlan, type StressResult } from "@/lib/stress/types";
import { AreaTrack, Bar, Compass, ShareDonut } from "./charts";
import { PlanSection } from "./PlanSection";
import { ProgressSection } from "./ProgressSection";
import { STRESS_CSS } from "./styles";

const SECTIONS = [
  { id: "ws-overview", label: "Overview", icon: "home" },
  { id: "ws-drivers", label: "Stress drivers", icon: "target" },
  { id: "ws-areas", label: "The four areas", icon: "layers" },
  { id: "ws-plan", label: "30-day plan", icon: "calendar" },
  { id: "ws-progress", label: "Progress", icon: "pulse" },
];
/** Links off the dashboard open in a new tab, so this tab stays on the results. */
const NEW_TAB ={ target: "_blank", rel: "noopener" } as const;
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const median = (d?: number[]) => (d && d.length === 11 ? d[5] : null);
/** The question topics a driver is measured from (topics, never the answers). */
const coversOf = (key: string) => {
  const def = driverByKey(key);
  return def ? BANK.items.filter((i) => def.sources.includes(i.source)).map((i) => i.label) : [];
};

function LevelPill({ value }: { value: number }) {
  const l = LEVEL_META[levelFor(value)];
  return <span className="ws-pill"><i style={{ background: l.color }} />{l.label}</span>;
}
function AreaTag({ area }: { area: AreaKey }) {
  return <span className="ws-atag"><i style={{ background: AREA_COLOR[area] }} />{AREA_META[area].label}</span>;
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
  const byShare = [...AREAS].sort((a, b) => s.contribution[b] - s.contribution[a] || s.areas[b] - s.areas[a]);
  const [area, setArea] = useState<AreaKey>(byShare[0]);
  const [driver, setDriver] = useState<string>(s.drivers[0]?.key ?? DRIVERS[0].key);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [menu, setMenu] = useState(false);
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
    }, { rootMargin: "-90px 0px -55% 0px" });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const openArea = (a: AreaKey) => { setArea(a); go("ws-areas"); };
  const openDriver = (k: string) => { setDriver(k); go("ws-drivers"); };
  const addAction = (id: string) => {
    if (!thePlan.actionIds.includes(id)) onPlanChange({ ...thePlan, actionIds: [...thePlan.actionIds, id] });
  };

  const live = activeDrivers(s);
  const topDriver = s.drivers[0] && s.drivers[0].score > 0 ? s.drivers[0] : null;
  const topDef = topDriver ? driverByKey(topDriver.key) : undefined;
  const mainArea = s.contribution[byShare[0]] > 0 ? byShare[0] : null;
  const q = QUADRANT_META[s.compass.quadrant];

  return (
    <div className="ws ws-dash">
      <style dangerouslySetInnerHTML={{ __html: STRESS_CSS }} />

      <aside className={`ws-side${menu ? " open" : ""}`} aria-label="Results menu">
        <Link href="/account/stress" className="ws-side-brand" aria-label="OneGrasp">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/onegrasp-logo-tight.png" alt="OneGrasp" />
        </Link>
        <div className="ws-me">
          <span className="ws-ava">{(firstName || "Y").charAt(0).toUpperCase()}</span>
          <span><b>{firstName || "Your results"}</b><small>{band.label} · {band.title}</small></span>
        </div>
        <nav className="ws-side-nav">
          <div className="ws-side-lbl">Stress check</div>
          {SECTIONS.map((x) => (
            <button key={x.id} className={`ws-navi${active === x.id ? " on" : ""}`} aria-current={active === x.id} onClick={() => go(x.id)}>
              <Icon name={x.icon} size={17} /><span>{x.label}</span>
            </button>
          ))}
          <div className="ws-side-lbl">Help</div>
          <Link className="ws-navi" href="/account/legal" {...NEW_TAB}><Icon name="scale" size={17} /><span>Law &amp; Rights</span></Link>
          <Link className="ws-navi" href="/jobs" {...NEW_TAB}><Icon name="briefcase" size={17} /><span>Jobs board</span></Link>
          <a className="ws-navi" href={`tel:${HELPLINE.number}`}><Icon name="phone" size={17} /><span>{HELPLINE.name} {HELPLINE.number}</span></a>
        </nav>
        <div className="ws-side-foot">
          <Link className="ws-btn ws-btn-pri" style={{ width: "100%" }} href={retakeHref} {...NEW_TAB}>Retake the check</Link>
          {onSignOut && <button className="ws-btn" style={{ width: "100%", marginTop: 8 }} onClick={onSignOut}><Icon name="power" size={15} /> Sign out</button>}
        </div>
      </aside>
      {menu && <div className="ws-scrim" onClick={() => setMenu(false)} />}

      <div className="ws-body">
        <header className="ws-top">
          <button className="ws-burger" aria-label="Open menu" onClick={() => setMenu(true)}><Icon name="menu" size={18} /></button>
          <div className="ws-hello">
            <b>Workplace Stress Check</b>
            <small>Taken {fmtDate(result.takenAt)} · {band.label} · {band.title}</small>
          </div>
          <div className="ws-top-r">
            <button className="ws-btn ws-btn-sm ws-hide-sm" onClick={() => window.print()}><Icon name="save" size={15} /> Save as PDF</button>
            <Link className="ws-btn ws-btn-sm" href={retakeHref} {...NEW_TAB}>Retake</Link>
          </div>
        </header>

        <main className="ws-main">
          <div className="ws-mwrap">
            <div id="ws-overview" className="ws-sec" style={{ marginTop: 0 }}>
              {s.support === "high" && <div style={{ marginBottom: 16 }}><SupportCallout strong /></div>}

              <section className="ws-head">
                <span className="ws-kicker">Your results</span>
                <h1>{firstName ? `${firstName}, your` : "Your"} workplace stress is {level.label.toLowerCase()}.</h1>
                <p>{summaryLine(s)}</p>
              </section>

              <div className="ws-kpis">
                <div className="ws-kpi">
                  <span>Workplace Stress Score</span>
                  <b>{s.overall}<small>/100</small></b>
                  <div style={{ marginTop: 10 }}><AreaTrack value={s.overall} avg={stageAvg} /></div>
                  <small style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><LevelPill value={s.overall} />{pct !== null ? `Higher than ${pct}% at your stage` : null}</small>
                </div>
                <button className="ws-kpi ws-kpi-btn" onClick={() => mainArea && openArea(mainArea)} disabled={!mainArea}>
                  <span>Main source</span>
                  <b className="ws-kpi-t">{mainArea ? areaOf(mainArea).title : "Nothing stands out"}</b>
                  {mainArea && <div style={{ marginTop: 10 }}><Bar value={s.contribution[mainArea]} color={AREA_COLOR[mainArea]} /></div>}
                  <small>{mainArea ? `${s.contribution[mainArea]}% of all your stress` : "Every area is calm"}</small>
                </button>
                <button className="ws-kpi ws-kpi-btn" onClick={() => topDriver && openDriver(topDriver.key)} disabled={!topDriver}>
                  <span>Strongest driver</span>
                  <b className="ws-kpi-t">{topDef ? topDef.label : "None"}</b>
                  {topDriver && topDef && <div style={{ marginTop: 10 }}><Bar value={topDriver.score} color={AREA_COLOR[topDef.area]} /></div>}
                  <small>{topDriver && topDef ? `Intensity ${topDriver.score}/100 · ${AREA_META[topDef.area].label}` : "No driver is pushing your stress up"}</small>
                </button>
                <button className="ws-kpi ws-kpi-btn" onClick={() => go("ws-drivers")}>
                  <span>Active drivers</span>
                  <b>{live.length}<small>of {DRIVERS.length}</small></b>
                  <div className="ws-dots" aria-hidden="true">
                    {DRIVERS.map((d) => <i key={d.key} style={live.some((x) => x.key === d.key) ? { background: AREA_COLOR[d.area] } : undefined} />)}
                  </div>
                  <small>{live.length ? "Pushing your stress up (50+)" : "None at 50 or more"}</small>
                </button>
              </div>

              {s.confidence.level !== "high" && (
                <p className="ws-card ws-small" style={{ marginTop: 16, padding: "12px 16px" }}>
                  {s.confidence.flags.includes("same-answer") ? "You gave the same answer to every question, " : "You answered very quickly, "}
                  so these results may be less accurate. When you have 5 quiet minutes, a retake will give a truer picture.
                </p>
              )}
              {s.support === "watch" && <div style={{ marginTop: 16 }}><SupportCallout /></div>}
              {(s.rights.harassment || s.rights.discrimination) && <div style={{ marginTop: 16 }}><RightsCallout harassment={s.rights.harassment} discrimination={s.rights.discrimination} onPlan={() => go("ws-plan")} /></div>}

              <div className="ws-grid2 ws-eq" style={{ marginTop: 16 }}>
                <section className="ws-card">
                  <h2 className="ws-h2">Where your stress comes from</h2>
                  <p className="ws-muted" style={{ marginTop: 2 }}>Each area&apos;s share of all the stress you reported.</p>
                  <div className="ws-donut">
                    <ShareDonut parts={byShare.map((a) => ({ key: a, label: AREA_META[a].label, value: s.contribution[a], color: AREA_COLOR[a] }))} />
                    <div className="ws-legend">
                      {byShare.map((a) => (
                        <button key={a} onClick={() => openArea(a)}>
                          <i style={{ background: AREA_COLOR[a] }} />
                          <span>{AREA_META[a].label}</span>
                          <b>{s.contribution[a]}%</b>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="ws-card">
                  <h2 className="ws-h2">Stress level in each area</h2>
                  <p className="ws-muted" style={{ marginTop: 2 }}>0-100. The darker the bar, the higher the level{ready ? "; the white marker is the average at your stage" : ""}.</p>
                  <div className="ws-areas">
                    {AREAS.map((a) => {
                      const v = s.areas[a];
                      return (
                        <button key={a} className="ws-arow" onClick={() => openArea(a)} aria-label={`${areaOf(a).title}: ${v} out of 100, ${LEVEL_META[levelFor(v)].label}`}>
                          <span className="ws-arow-name"><Icon name={AREA_META[a].icon} size={17} /><span>{AREA_META[a].label}<small>{LEVEL_META[levelFor(v)].label}</small></span></span>
                          <AreaTrack value={v} avg={ready ? median(benchmarks!.areas?.[a]) : null} />
                          <span className="ws-arow-val">{v}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                    {LEVELS.map((l) => <span key={l} className="ws-muted" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 3, background: LEVEL_META[l].color, display: "inline-block" }} />{LEVEL_META[l].label} {LEVEL_META[l].range}</span>)}
                  </div>
                </section>

                <section className="ws-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <h2 className="ws-h2">Top stress drivers</h2>
                    <button className="ws-link" style={{ fontSize: 13 }} onClick={() => go("ws-drivers")}>All {DRIVERS.length} →</button>
                  </div>
                  <p className="ws-muted" style={{ marginTop: 2 }}>What your answers point to, strongest first.</p>
                  <DriverList keys={s.drivers.slice(0, 5)} onPick={openDriver} />
                </section>

                <section className="ws-card">
                  <h2 className="ws-h2">Is it the work, or the workplace?</h2>
                  <p className="ws-muted" style={{ marginTop: 2 }}>Workload across; the people, culture and prospects up.</p>
                  <div className="ws-compass">
                    <Compass work={s.compass.work} place={s.compass.place} quadrant={s.compass.quadrant} />
                    <div>
                      <h3 className="ws-h3">{q.title}</h3>
                      <p className="ws-small" style={{ marginTop: 6 }}>{q.text}</p>
                      <p className="ws-note"><b>Focus:</b> {q.focus}</p>
                    </div>
                  </div>
                </section>
              </div>
              {!ready && (
                <p className="ws-muted" style={{ marginTop: 10 }}>
                  Comparison with people at your stage ({band.label}) unlocks once {benchmarks?.needed ?? 30} have taken the check{benchmarks?.n ? ` (${benchmarks.n} so far)` : ""}.
                </p>
              )}
            </div>

            <DriversSection result={result} selected={driver} onSelect={setDriver} plan={thePlan} onAdd={addAction} />

            <section id="ws-areas" className="ws-sec">
              <div className="ws-sec-h">
                <div><h2>The four areas</h2><p className="ws-sub ws-small">How each area scores, what is driving it, and what helps.</p></div>
              </div>
              <div className="ws-tabs" role="tablist" aria-label="Areas">
                {AREAS.map((a) => (
                  <button key={a} role="tab" aria-selected={area === a} className="ws-tab" onClick={() => setArea(a)}>
                    <i className="ws-sw" style={{ background: AREA_COLOR[a] }} />
                    <span className="ws-hide-sm">{AREA_META[a].label}</span><span className="ws-show-sm">{AREA_META[a].label.split(" ")[0]}</span> <b>{s.areas[a]}</b>
                  </button>
                ))}
              </div>
              {AREAS.map((a) => <AreaDetail key={a} area={a} result={result} hidden={area !== a} benchmarks={benchmarks} plan={thePlan} onAdd={addAction} onDriver={openDriver} />)}
            </section>

            <PlanSection result={result} plan={thePlan} onChange={onPlanChange} />
            <ProgressSection result={result} history={history} plan={thePlan} onChange={onPlanChange} retakeHref={retakeHref} />

            <section className="ws-sec">
              <details className="ws-details">
                <summary>How this check works</summary>
                <ul>
                  <li>{BANK.items.length} questions in four areas, plus one on how you&apos;re coping. Each asks how often something happened in the last 3 months, with three answers: Never (0), Sometimes (50) or Often (100).</li>
                  <li>The questions are grouped into {DRIVERS.length} stress drivers - for example time pressure, job insecurity or hostile leadership. A driver&apos;s intensity is the average of its questions, so the results show where the stress comes from rather than repeating your answers. A driver at 50 or more counts as active.</li>
                  <li>Each area score is the average of its answers, and its share is that score as a part of all four. The overall Workplace Stress Score is 60% the average of the four areas plus 40% the highest area, so one severe area isn&apos;t hidden by three calm ones.</li>
                  <li>Levels: Low 0-24, Mild 25-44, Moderate 45-64, High 65-100. &quot;Work or workplace&quot; compares Workload with the other three areas combined the same way, each split at 45.</li>
                  <li>The questions are OneGrasp&apos;s own, written to cover the six areas of the UK HSE Management Standards (demands, control, support, relationships, role, change) plus toxic behaviour and career security.</li>
                  <li>This is a wellbeing check, not a medical or psychological diagnosis. Your answers are stored privately on your account; only anonymous scores count towards career-stage comparisons, and nothing is shared with any employer.</li>
                </ul>
              </details>
            </section>

            <footer className="ws-foot">
              <span>Feeling overwhelmed? <b>{HELPLINE.name} {HELPLINE.number}</b> - free, confidential, 24x7.</span>
              <span>Retake every 30 days to see what&apos;s changed.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

/** Ranked drivers as thin bars in their area's colour, numbers in ink beside them. */
function DriverList({ keys, onPick, selected, hideArea }: { keys: { key: string; score: number }[]; onPick: (k: string) => void; selected?: string; hideArea?: boolean }) {
  return (
    <div className="ws-drv">
      {keys.map((d) => {
        const def = driverByKey(d.key);
        if (!def) return null;
        return (
          <button key={d.key} onClick={() => onPick(d.key)} aria-pressed={selected === d.key}
            aria-label={`${def.label}, ${AREA_META[def.area].label}: intensity ${d.score} out of 100, ${LEVEL_META[levelFor(d.score)].label}`}>
            <span className="ws-drv-name"><b>{def.label}</b>{!hideArea && <AreaTag area={def.area} />}</span>
            <Bar value={d.score} color={AREA_COLOR[def.area]} />
            <span className="ws-drv-val">{d.score}<small>{LEVEL_META[levelFor(d.score)].label}</small></span>
          </button>
        );
      })}
    </div>
  );
}

function DriversSection({ result, selected, onSelect, plan, onAdd }: {
  result: StressResult; selected: string; onSelect: (k: string) => void; plan: StressPlan; onAdd: (id: string) => void;
}) {
  const s = result.scores;
  const def = driverByKey(selected)!;
  const score = s.drivers.find((d) => d.key === selected)?.score ?? 0;
  const covers = coversOf(selected);
  const panel = useRef<HTMLElement>(null);
  // On one column the details sit under the list - bring them into view.
  const pick = (k: string) => {
    onSelect(k);
    if (window.matchMedia("(max-width: 980px)").matches) panel.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  return (
    <section id="ws-drivers" className="ws-sec">
      <div className="ws-sec-h">
        <div>
          <h2>Your stress drivers</h2>
          <p className="ws-sub ws-small">The {BANK.items.length} questions point to {DRIVERS.length} specific causes. Pick one to see what it means and what helps.</p>
        </div>
      </div>
      <div className="ws-drvgrid">
        <section className="ws-card">
          <DriverList keys={s.drivers} onPick={pick} selected={selected} />
        </section>
        <section ref={panel} className="ws-card ws-drvpanel" aria-live="polite">
          <AreaTag area={def.area} />
          <h3 className="ws-h2" style={{ marginTop: 10 }}>{def.label}</h3>
          <div className="ws-score" style={{ marginTop: 10 }}>
            <b style={{ fontSize: 46 }}>{score}</b><span className="ws-of">/ 100</span>
            <span style={{ marginLeft: 8, alignSelf: "center" }}><LevelPill value={score} /></span>
          </div>
          <p className="ws-small" style={{ marginTop: 12 }}>
            {score >= 50 ? <><b style={{ color: "var(--ink)" }}>Active.</b> {def.means}</> : score > 0 ? <>Present, but not strong. {def.means}</> : <>Not a source of stress for you right now.</>}
          </p>
          <p className="ws-muted" style={{ marginTop: 10 }}>Measured from {covers.length} question{covers.length === 1 ? "" : "s"}: {covers.map((c) => c.toLowerCase()).join(", ")}.</p>
          <h4 className="ws-label" style={{ marginTop: 18 }}>What helps</h4>
          <div className="ws-qs">
            {def.actions.map((id) => {
              const a = actionById(id);
              if (!a) return null;
              const inPlan = plan.actionIds.includes(id);
              return (
                <div key={id} className="ws-qrow">
                  <div><b>{a.title}</b><p>{a.time}</p></div>
                  <button className="ws-btn ws-btn-sm ws-noprint" disabled={inPlan} onClick={() => onAdd(id)}>
                    {inPlan ? <><Icon name="check" size={14} /> In plan</> : "Add to plan"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}

function AreaDetail({ area, result, hidden, benchmarks, plan, onAdd, onDriver }: {
  area: AreaKey; result: StressResult; hidden: boolean; benchmarks: Benchmarks | null; plan: StressPlan; onAdd: (id: string) => void; onDriver: (k: string) => void;
}) {
  const s = result.scores;
  const v = s.areas[area];
  const meta = AREA_META[area];
  const drivers = s.drivers.filter((d) => driverByKey(d.key)?.area === area);
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
          <p className="ws-muted" style={{ marginTop: 6 }}>{s.contribution[area]}% of all your stress{avg != null ? ` · people at your stage average ${avg}` : ""}</p>
          <h3 className="ws-h3" style={{ marginTop: 14 }}>{meta.question}</h3>
          <p className="ws-small" style={{ marginTop: 4 }}>{meta.text[levelFor(v)]}</p>
          <p className="ws-note"><b>At {BAND_META[result.band].label}:</b> {STAGE_NOTES[result.band][area]}</p>
        </div>
        <div>
          <span className="ws-label">What&apos;s driving it</span>
          <DriverList keys={drivers} onPick={onDriver} hideArea />
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
          <Link className="ws-btn ws-btn-sm" href="/account/legal" {...NEW_TAB}>Law &amp; Rights</Link>
          <button className="ws-btn ws-btn-sm" onClick={onPlan}>See the steps in your plan</button>
        </div>
      </div>
    </section>
  );
}
