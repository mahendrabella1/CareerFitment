"use client";
/** The 30-day plan on the results page: actions with week-by-week steps to
 *  tick off, copy-ready messages, and actions to add or remove. */
import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { AREA_META, HELPLINE, actionById, actionsForArea } from "@/lib/stress/content";
import { AREAS, type StressPlan, type StressResult } from "@/lib/stress/types";
import { Ring } from "./charts";

type Week = 1 | 2 | 3 | "all";
const WEEK_LABEL: Record<1 | 2 | 3, string> = { 1: "Week 1", 2: "Week 2", 3: "Weeks 3-4" };
const DAY = 86400000;
const MAX_ACTIONS = 7;

export function PlanSection({ result, plan, onChange }: { result: StressResult; plan: StressPlan; onChange: (p: StressPlan) => void }) {
  const day = Math.max(1, Math.floor((Date.now() - new Date(plan.startedAt).getTime()) / DAY) + 1);
  const current: 1 | 2 | 3 = day <= 7 ? 1 : day <= 14 ? 2 : 3;
  const [week, setWeek] = useState<Week>(current);
  const [openScript, setOpenScript] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const actions = plan.actionIds.map(actionById).filter((a): a is NonNullable<typeof a> => !!a);
  const keys = actions.flatMap((a) => a.steps.map((_, n) => `${a.id}:${n}`));
  const doneCount = keys.filter((k) => plan.done[k]).length;
  const inWeek = (w: 1 | 2 | 3) => actions.flatMap((a) => a.steps.map((st, n) => ({ st, k: `${a.id}:${n}` }))).filter((x) => x.st.week === w);

  const toggle = (k: string) => onChange({ ...plan, done: { ...plan.done, [k]: !plan.done[k] } });
  const remove = (id: string) => onChange({ ...plan, actionIds: plan.actionIds.filter((x) => x !== id) });
  const add = (id: string) => { onChange({ ...plan, actionIds: [...plan.actionIds, id] }); setAdding(false); };
  const copy = async (id: string, text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(id); window.setTimeout(() => setCopied(null), 2000); } catch { /* clipboard blocked */ }
  };

  const s = result.scores;
  const suggestions = [...AREAS].sort((a, b) => s.areas[b] - s.areas[a])
    .flatMap((a) => actionsForArea(a, s, result.answers).slice(0, 3))
    .filter((id, n, arr) => arr.indexOf(id) === n && !plan.actionIds.includes(id))
    .slice(0, 6);

  return (
    <section id="ws-plan" className="ws-sec">
      <div className="ws-sec-h">
        <div>
          <h2>Your 30-day plan</h2>
          <p className="ws-sub ws-small">Built around your strongest stress drivers. Tick steps off as you go - it saves automatically.</p>
        </div>
      </div>

      <div className="ws-card">
        <div className="ws-planhead">
          <div>
            <span className="ws-label">{day <= 30 ? `Day ${day} of 30 · ${WEEK_LABEL[current]}` : "Your 30 days are up - time to retake the check"}</span>
            <div className="ws-prog" role="progressbar" aria-valuemin={0} aria-valuemax={keys.length} aria-valuenow={doneCount} aria-label="Plan progress">
              <i style={{ width: `${keys.length ? (doneCount / keys.length) * 100 : 0}%` }} />
            </div>
            <p className="ws-muted" style={{ marginTop: 6 }}>{doneCount} of {keys.length} steps done · {actions.length} actions</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <b style={{ fontSize: 32, fontWeight: 650, letterSpacing: "-.02em" }}>{keys.length ? Math.round((doneCount / keys.length) * 100) : 0}%</b>
          </div>
        </div>
        <div className="ws-weeks ws-noprint" role="group" aria-label="Show steps for">
          {([1, 2, 3] as const).map((w) => (
            <button key={w} className="ws-week" aria-pressed={week === w} onClick={() => setWeek(w)}>
              {WEEK_LABEL[w]}<em>{inWeek(w).filter((x) => plan.done[x.k]).length}/{inWeek(w).length}</em>
            </button>
          ))}
          <button className="ws-week" aria-pressed={week === "all"} onClick={() => setWeek("all")}>All steps</button>
        </div>
      </div>

      <div className="ws-actions">
        {actions.map((a) => {
          const total = a.steps.length;
          const done = a.steps.filter((_, n) => plan.done[`${a.id}:${n}`]).length;
          const shown = a.steps.filter((st) => week === "all" || st.week === week).length;
          const isOpen = openScript === a.id;
          return (
            <article key={a.id} className="ws-card ws-action">
              <div className="ws-action-h">
                <div>
                  <span className="ws-action-tag">
                    {a.area === "support" ? <><Icon name="heart" size={14} /> Support</> : <><Icon name={AREA_META[a.area].icon} size={14} /> {AREA_META[a.area].label}</>}
                    <span className="ws-muted">· {a.time}</span>
                  </span>
                  <h3>{a.title}</h3>
                  <p className="ws-action-why">{a.why}</p>
                </div>
                <Ring done={done} total={total} />
              </div>
              <ul className="ws-steps">
                {a.steps.map((st, n) => {
                  const k = `${a.id}:${n}`;
                  const off = week !== "all" && st.week !== week;
                  return (
                    <li key={k} className={`ws-step${off ? " ws-offweek" : ""}`} data-done={!!plan.done[k]}>
                      <input id={`st-${k}`} type="checkbox" checked={!!plan.done[k]} onChange={() => toggle(k)} />
                      <label htmlFor={`st-${k}`}>{st.text}</label>
                      <small className={week === "all" ? undefined : "ws-hide-sm"}>{WEEK_LABEL[st.week]}</small>
                    </li>
                  );
                })}
                {shown === 0 && <li className="ws-step ws-noprint" style={{ gridTemplateColumns: "1fr" }}><span className="ws-muted">No steps for {week === "all" ? "now" : WEEK_LABEL[week]} in this action.</span></li>}
              </ul>
              {a.id === "talk" && (
                <p style={{ padding: "0 20px 14px" }}><a className="ws-tel" style={{ fontSize: 18 }} href={`tel:${HELPLINE.number}`}>{HELPLINE.name} {HELPLINE.number}</a> <span className="ws-muted">· free, 24x7</span></p>
              )}
              {a.script && isOpen && (
                <div className="ws-script">
                  <div className="ws-script-h">
                    <span>{a.script.label}</span>
                    <button className="ws-btn ws-btn-sm" onClick={() => void copy(a.id, a.script!.text)}>
                      {copied === a.id ? <><Icon name="check" size={14} /> Copied</> : "Copy"}
                    </button>
                  </div>
                  <pre>{a.script.text}</pre>
                </div>
              )}
              <div className="ws-action-f ws-noprint">
                {a.script && (
                  <button className="ws-btn ws-btn-sm" aria-expanded={isOpen} onClick={() => setOpenScript(isOpen ? null : a.id)}>
                    <Icon name="doc" size={14} /> {isOpen ? "Hide" : a.script.label}
                  </button>
                )}
                {a.link && <Link className="ws-btn ws-btn-sm" href={a.link.href} target="_blank" rel="noopener">{a.link.label} <Icon name="arrowRight" size={14} /></Link>}
                <button className="ws-link" style={{ marginLeft: "auto", fontSize: 13, color: "var(--muted)" }} onClick={() => remove(a.id)}>Remove</button>
              </div>
            </article>
          );
        })}
        {!actions.length && <p className="ws-card ws-small">Your plan is empty. Add an action below to get started.</p>}
      </div>

      <div className="ws-noprint" style={{ marginTop: 14 }}>
        {!adding ? (
          <button className="ws-btn" onClick={() => setAdding(true)} disabled={actions.length >= MAX_ACTIONS || !suggestions.length}>
            + Add another action
          </button>
        ) : (
          <div className="ws-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <h3 className="ws-h3">Add an action</h3>
              <button className="ws-link" onClick={() => setAdding(false)}>Close</button>
            </div>
            <div className="ws-qs" style={{ marginTop: 6 }}>
              {suggestions.map((id) => {
                const a = actionById(id)!;
                return (
                  <div key={id} className="ws-qrow">
                    <div><b>{a.title}</b><p>{a.area === "support" ? "Support" : AREA_META[a.area].label} · {a.time}</p></div>
                    <button className="ws-btn ws-btn-sm" onClick={() => add(id)}>Add</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
