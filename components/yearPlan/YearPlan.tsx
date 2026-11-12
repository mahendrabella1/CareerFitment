"use client";

/**
 * /account/year-plan - the student's 40-week plan (lib/yearPlan/plan.ts):
 * this week's tasks, anything to catch up on, next week, and all 40 weeks by
 * phase. Every task lists its steps (lessons, lab lessons, pages to open) and
 * ticks itself from what the student actually does - nothing to mark by hand.
 * Steps open in a new tab, like the dashboard, and the plan re-reads the
 * profile when its tab is shown again.
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { FeatureHero } from "@/components/feature/FeatureHero";
import { FEATURES } from "@/lib/features/catalog";
import { PHASES, PLAN_WEEKS, phaseOf, type PlanStatus, type PlanTask, type PlanWeek, type TaskKind, type TaskState } from "@/lib/yearPlan/plan";
import { useYearPlan } from "./useYearPlan";

const NEW_TAB = { target: "_blank", rel: "noopener" } as const;
const KIND: Record<TaskKind, string> = { learn: "Learn", practise: "Practise", explore: "Explore", build: "Build" };
const day = (ms: number) => new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const range = (w: PlanWeek) => `${day(w.start)} – ${day(w.start + 6 * 86400000)}`;
const mins = (m: number) => (m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ""}`.trim() : `${m} min`);

export function YearPlan() {
  const meta = FEATURES["year-plan"];
  const { profile, refreshProfile } = useAuth();
  const { status, source, track, failed } = useYearPlan();

  // Steps open in new tabs: re-read the profile when this tab is shown again (at most every 15 s).
  const last = useRef(0);
  useEffect(() => {
    const onShow = () => {
      if (document.visibilityState !== "visible" || Date.now() - last.current < 15000) return;
      last.current = Date.now();
      void refreshProfile();
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [refreshProfile]);

  const shell = (body: React.ReactNode) => (
    <CoursePlayerShell accent={meta.accent} banner={{ title: meta.title, icon: "calendar", backHref: "/account", backLabel: "Dashboard" }}>
      <style dangerouslySetInnerHTML={{ __html: YP_CSS }} />
      <div className="fp yp" style={{ ["--accent" as string]: meta.accent }}>{body}</div>
    </CoursePlayerShell>
  );

  if (profile && !track) return shell(<div className="fp-card yp-empty">The Year Plan is for students. Your workplace tools are on <Link href="/account/stress">your dashboard</Link>.</div>);
  if (failed) return shell(<div className="fp-card yp-empty">Your plan couldn&apos;t load just now - please refresh the page.</div>);
  if (!status || !source) return shell(<div className="fp-card yp-empty">Loading your plan…</div>);
  return shell(<PlanBody status={status} label={source.label} />);
}

function PlanBody({ status: s, label }: { status: PlanStatus; label: string }) {
  const meta = FEATURES["year-plan"];
  const current = s.ended ? null : s.weeks[s.week - 1];
  const next = s.ended ? null : s.weeks[s.week] ?? null;
  const nextTask = s.catchUp[0]?.task ?? current?.tasks.find((t) => !s.task.get(t.id)?.complete);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <FeatureHero
        meta={meta}
        primary={nextTask ? { label: `Next: ${nextTask.title.length > 34 ? `${nextTask.title.slice(0, 33)}…` : nextTask.title}`, href: firstOpen(nextTask, s.task.get(nextTask.id)) } : undefined}
        secondary={{ label: "Back to dashboard", href: "/account" }}
        stats={[
          { value: s.ended ? "Done" : `Week ${s.week} of ${PLAN_WEEKS}`, label: s.ended ? "all 40 weeks are behind you" : `${phaseOf(s.week).title} · ${label}` },
          { value: `${s.onTrack}%`, label: s.due ? "of the tasks due so far done" : "on track - nothing due yet" },
          { value: s.ended ? `${s.all.done}` : `${s.thisWeek.done}/${s.thisWeek.total}`, label: s.ended ? "tasks finished" : "done this week" },
          { value: `${s.all.done}/${s.all.total}`, label: "tasks in the whole plan" },
        ]}
      />

      {current && (
        <section className="fp-sec">
          <div className="fp-sec-h"><div>
            <h2>This week · Week {current.n}</h2>
            <p>{range(current)} · {current.phase}.{current.light ? " Exam month - just one task this week." : ` About ${mins(current.tasks.reduce((m, t) => m + t.minutes, 0))} in all; do them in any order.`}</p>
          </div></div>
          <div className="yp-tasks">{current.tasks.map((t) => <TaskCard key={t.id} t={t} st={s.task.get(t.id)} />)}</div>
        </section>
      )}

      {s.catchUp.length > 0 && (
        <section className="fp-sec">
          <div className="fp-sec-h"><div>
            <h2>Catch up</h2>
            <p>{s.catchUp.length} {s.catchUp.length === 1 ? "task" : "tasks"} from earlier weeks. They still count - do them when you have a little time.</p>
          </div></div>
          <div className="yp-tasks">{s.catchUp.slice(0, 6).map(({ week, task }) => <TaskCard key={task.id} t={task} st={s.task.get(task.id)} week={week} />)}</div>
          {s.catchUp.length > 6 && <p className="yp-more">…and {s.catchUp.length - 6} more in the weeks below.</p>}
        </section>
      )}

      {next && (
        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>Next week</h2><p>{range(next)}{next.light ? " · exam month, one task" : ""}. Start early if you like - it counts the moment you do it.</p></div></div>
          <ul className="yp-next">{next.tasks.map((t) => <li key={t.id}><span className="yp-kind">{KIND[t.kind]}</span>{t.title}<small>{mins(t.minutes)}</small></li>)}</ul>
        </section>
      )}

      <section className="fp-sec">
        <div className="fp-sec-h"><div>
          <h2>All 40 weeks</h2>
          <p>Four stages for {label}. Tasks tick themselves when you finish a lesson or open a page - nothing to mark by hand.</p>
        </div></div>
        {PHASES.map((p, pi) => {
          const weeks = s.weeks.filter((w) => phaseOf(w.n) === p);
          if (!weeks.length) return null;
          return (
            <div key={p.title} className="fp-card yp-phase">
              <div className="yp-phase-h"><b>{pi + 1}. {p.title}</b><span>Weeks {weeks[0].n}–{weeks[weeks.length - 1].n} · {p.note}</span></div>
              {weeks.map((w) => {
                const done = w.tasks.filter((t) => s.task.get(t.id)?.complete).length;
                const isNow = w.n === s.week;
                const isOpen = open === w.n;
                const state = done === w.tasks.length && w.tasks.length ? "done" : w.n < s.week ? "behind" : isNow ? "now" : "later";
                return (
                  <div key={w.n} className={`yp-week is-${state}`}>
                    <button className="yp-week-h" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : w.n)}>
                      <span className="yp-wn">Week {w.n}</span>
                      <span className="yp-wd">{range(w)}{isNow ? " · this week" : ""}{w.light ? " · exam month" : ""}</span>
                      <span className="yp-dots" aria-hidden="true">{w.tasks.map((t) => <i key={t.id} className={s.task.get(t.id)?.complete ? "on" : ""} />)}</span>
                      <span className="yp-wc">{state === "done" ? <><Icon name="check" size={13} stroke={2.4} /> Done</> : `${done}/${w.tasks.length}`}</span>
                    </button>
                    {isOpen && <div className="yp-tasks yp-in">{w.tasks.map((t) => <TaskCard key={t.id} t={t} st={s.task.get(t.id)} compact />)}</div>}
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </>
  );
}

/** The first step not done yet (or the task's start when all are done). */
function firstOpen(t: PlanTask, st: TaskState | undefined): string {
  if (!st || st.complete) return t.href;
  const i = st.flags.findIndex((f) => !f);
  return t.items[i]?.href ?? t.href;
}

function TaskCard({ t, st, week, compact }: { t: PlanTask; st?: TaskState; week?: number; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const done = st?.done ?? 0, total = st?.total ?? t.items.length;
  const complete = !!st?.complete;
  const pct = total ? done / total : 0;
  return (
    <div className={`fp-card yp-task${complete ? " is-done" : ""}${compact ? " is-compact" : ""}`}>
      <div className="yp-task-top">
        <svg className="yp-ring" viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="15" />
          <circle cx="18" cy="18" r="15" className="yp-ring-v" strokeDasharray={`${(pct * 94.25).toFixed(1)} 94.25`} />
          {complete && <path d="M12 18.5l4 4 8-9" className="yp-ring-c" />}
        </svg>
        <div className="yp-task-b">
          <div className="yp-meta">
            <span className="yp-kind">{KIND[t.kind]}</span>
            <span>{mins(t.minutes)}</span>
            <span>{complete ? "Done" : `${done} of ${total} ${total === 1 ? "step" : "steps"}`}</span>
            {week !== undefined && <span>from week {week}</span>}
          </div>
          <b className="yp-title">{t.title}</b>
          {!compact && <p className="yp-why">{t.why}</p>}
        </div>
        <div className="yp-act">
          {!complete && <a href={firstOpen(t, st)} {...NEW_TAB} className="fp-btn fp-btn-sm fp-btn-pri">{done ? "Continue" : "Start"}</a>}
          {total > 1 && <button className="fp-btn fp-btn-sm" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? "Hide steps" : "Steps"}</button>}
          {total === 1 && complete && <a href={t.href} {...NEW_TAB} className="fp-btn fp-btn-sm">Open</a>}
        </div>
      </div>
      {open && (
        <ol className="yp-steps">
          {t.items.map((it, i) => {
            const ok = !!st?.flags[i];
            return (
              <li key={`${it.href}-${i}`} className={ok ? "is-ok" : ""}>
                <span className="yp-tick" aria-hidden="true">{ok ? <Icon name="check" size={12} stroke={2.6} /> : null}</span>
                <a href={it.href} {...NEW_TAB}>{it.label}</a>
                {ok && <span className="yp-sr">(done)</span>}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

const YP_CSS = `
.yp-empty{padding:22px;font-size:14px;color:var(--ink2,#475569)}
.yp-tasks{display:grid;gap:10px}
.yp-task{padding:14px 16px}
.yp-task-top{display:grid;grid-template-columns:36px minmax(0,1fr) auto;gap:12px;align-items:start}
.yp-ring{width:36px;height:36px;transform:rotate(-90deg)}
.yp-ring circle{fill:none;stroke:#e7e5e4;stroke-width:3.2}
.yp-ring .yp-ring-v{stroke:var(--accent);stroke-linecap:round}
.yp-task.is-done .yp-ring .yp-ring-v{stroke:#15803d}
.yp-ring-c{fill:none;stroke:#15803d;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transform:rotate(90deg);transform-origin:18px 18px}
.yp-meta{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:12px;color:var(--ink3,#78716c);margin-bottom:3px}
.yp-kind{font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.04em;font-size:11px}
.yp-title{display:block;font-size:15px;line-height:1.35;color:var(--ink,#1c1917)}
.yp-task.is-done .yp-title{color:var(--ink2,#57534e)}
.yp-task.is-done .yp-meta span:nth-child(3){color:#15803d;font-weight:600}
.yp-why{margin:4px 0 0;font-size:13px;line-height:1.5;color:var(--ink2,#57534e)}
.yp-act{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
.yp-task.is-compact{padding:10px 12px}
.yp-task.is-compact .yp-title{font-size:14px}
.yp-steps{margin:12px 0 0 48px;padding:0;display:grid;gap:6px;font-size:13.5px;list-style:none}
.yp-steps li{display:flex;align-items:center;gap:8px}
.yp-tick{flex:none;width:18px;height:18px;border-radius:50%;border:1.5px solid #d6d3d1;display:grid;place-items:center;color:#fff}
.yp-steps li.is-ok .yp-tick{background:#15803d;border-color:#15803d}
.yp-steps li.is-ok a{color:var(--ink2,#57534e)}
.yp-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.yp-steps a{color:var(--accent);text-decoration:none}
.yp-steps a:hover{text-decoration:underline}
.yp-more{font-size:13px;color:var(--ink3,#78716c);margin:8px 2px 0}
.yp-next{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.yp-next li{display:flex;align-items:baseline;gap:10px;font-size:14px;padding:10px 14px;border:1px solid var(--line,#e7e5e4);border-radius:10px;background:#fff}
.yp-next small{margin-left:auto;color:var(--ink3,#78716c);white-space:nowrap}
.yp-phase{padding:6px 0;margin-bottom:12px}
.yp-phase-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 12px;padding:10px 16px 8px}
.yp-phase-h b{font-size:15px}
.yp-phase-h span{font-size:12.5px;color:var(--ink3,#78716c)}
.yp-week{border-top:1px solid var(--line,#f0eeec)}
.yp-week-h{all:unset;box-sizing:border-box;width:100%;display:grid;grid-template-columns:72px minmax(0,1fr) auto 64px;gap:10px;align-items:center;padding:10px 16px;cursor:pointer;font-size:13.5px}
.yp-week-h:hover{background:#fafaf9}
.yp-week-h:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.yp-wn{font-weight:700}
.yp-wd{color:var(--ink2,#57534e);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.yp-wc{text-align:right;font-variant-numeric:tabular-nums;color:var(--ink2,#57534e);display:flex;align-items:center;justify-content:flex-end;gap:4px}
.yp-week.is-done .yp-wc{color:#15803d;font-weight:600}
.yp-week.is-now{background:color-mix(in srgb,var(--accent) 5%,#fff)}
.yp-week.is-now .yp-wn{color:var(--accent)}
.yp-week.is-behind .yp-wc{color:#b45309;font-weight:600}
.yp-dots{display:flex;gap:3px}
.yp-dots i{width:8px;height:8px;border-radius:50%;background:#e7e5e4}
.yp-dots i.on{background:#15803d}
.yp-in{padding:4px 16px 14px}
@media (max-width:640px){
  .yp-task-top{grid-template-columns:30px minmax(0,1fr)}
  .yp-ring{width:30px;height:30px}
  .yp-act{grid-column:1/-1;justify-content:flex-start}
  .yp-steps{margin-left:18px}
  .yp-week-h{grid-template-columns:62px minmax(0,1fr) 52px}
  .yp-dots{display:none}
}
`;
