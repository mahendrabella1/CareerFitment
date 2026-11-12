"use client";

/**
 * The dashboard's Year Plan line, under "your report is ready": this week's
 * progress, anything to catch up on and the next task, with the whole plan's
 * progress as a thin bar. Renders nothing until the plan has loaded (and
 * never for Working Professionals).
 */
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { PLAN_WEEKS, summaryOf } from "@/lib/yearPlan/plan";
import { useYearPlan } from "./useYearPlan";

export function YearPlanStrip() {
  const { status } = useYearPlan();
  if (!status) return null;
  const s = summaryOf(status);
  const pct = s.total ? Math.round((s.done / s.total) * 100) : 0;
  return (
    <div className="db-report db-yp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={{ minWidth: 0 }}>
        <span className="db-kicker">Your Year Plan · {status.ended ? "all 40 weeks done" : `week ${status.week} of ${PLAN_WEEKS}`}</span>
        <b>
          {status.ended
            ? `You finished ${s.done} of ${s.total} tasks.`
            : `${s.thisWeekDone} of ${s.thisWeekTotal} done this week${status.catchUp.length ? ` · ${status.catchUp.length} to catch up` : ""}`}
        </b>
        <small>{s.next ? `Next: ${s.next}` : "This week's tasks are all done - well done."}</small>
        <span className="db-yp-bar" role="img" aria-label={`${pct}% of the whole plan done`}><i style={{ width: `${pct}%` }} /></span>
      </div>
      <div className="db-report-a">
        <Link href="/account/year-plan" target="_blank" rel="noopener" className="db-btn">Open my Year Plan <Icon name="arrowRight" size={16} stroke={2} /></Link>
      </div>
    </div>
  );
}

const CSS = `
.db-yp{margin-top:12px}
.db-yp-bar{display:block;height:4px;border-radius:4px;background:#ece9e6;margin-top:10px;max-width:420px;overflow:hidden}
.db-yp-bar i{display:block;height:100%;background:#4338ca;border-radius:4px}
`;
