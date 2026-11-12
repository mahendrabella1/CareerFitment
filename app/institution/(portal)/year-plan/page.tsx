"use client";

/**
 * /institution/year-plan - where every student is in their 40-week Year Plan
 * (lib/yearPlan/plan.ts, via /api/institution/year-plan): the week they're
 * in, how much of what's due is done, this week, the whole plan - by class
 * and by student. Behind = under 60% of the tasks due so far, with at least
 * three due. Message those students, or export the list.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { apiFetch } from "@/lib/institution/client";
import { PageHead } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { HowItWorks } from "@/components/HowItWorks";
import { PLAN_WEEKS, type YearPlanRow } from "@/lib/yearPlan/plan";

const isBehind = (r: YearPlanRow) => r.due >= 3 && r.onTrack < 60;
const pill = (r: YearPlanRow) => (r.due < 3 ? "plain" : r.onTrack >= 80 ? "good" : r.onTrack >= 60 ? "warn" : "bad");
const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);

export default function YearPlanPortalPage() {
  const [rows, setRows] = useState<YearPlanRow[] | null>(null);
  const [error, setError] = useState("");
  const [cls, setCls] = useState("");
  const [tab, setTab] = useState<"all" | "behind" | "track">("all");
  const [compose, setCompose] = useState<ComposePreset | null>(null);

  useEffect(() => {
    apiFetch<{ rows: YearPlanRow[] }>("/api/institution/year-plan")
      .then((d) => setRows(d.rows.filter((r) => !r.archived)))
      .catch((e) => setError(e instanceof Error ? e.message : "Couldn't load the Year Plan."));
  }, []);

  const classes = useMemo(() => [...new Set((rows ?? []).map((r) => r.category).filter(Boolean))].sort(), [rows]);
  const inClass = (rows ?? []).filter((r) => !cls || r.category === cls);
  const list = inClass
    .filter((r) => tab === "all" || (tab === "behind" ? isBehind(r) : !isBehind(r)))
    .sort((a, b) => Number(isBehind(b)) - Number(isBehind(a)) || a.onTrack - b.onTrack || a.name.localeCompare(b.name));
  const behind = inClass.filter(isBehind);
  const byClass = classes.map((c) => {
    const rs = (rows ?? []).filter((r) => r.category === c);
    return { c, n: rs.length, week: avg(rs.map((r) => Math.min(r.week, PLAN_WEEKS))), onTrack: avg(rs.map((r) => r.onTrack)), behind: rs.filter(isBehind).length, plan: avg(rs.map((r) => (r.total ? (r.done / r.total) * 100 : 0))) };
  });

  if (error) return <div className="ip-empty">{error}</div>;
  if (!rows) return <div className="ip-empty">Loading the Year Plan…</div>;

  return (
    <>
      <PageHead title="Year Plan" purpose="Where each student is in their 40-week plan - a few tasks a week through every lesson, lab and tool for their class. See who's on track, who's falling behind, and nudge them.">
        <button className="ip-btn ghost" disabled={!behind.length} onClick={() => setCompose({ audience: { type: "students", uids: behind.map((r) => r.uid), label: `${behind.length} students behind on their Year Plan` }, kind: "message", title: "Your Year Plan - let's catch up", body: "Hi {name}, you have a few Year Plan tasks from earlier weeks waiting. Open 'Year Plan' on your dashboard - most take 10-30 minutes. Start with the first one under 'Catch up' this week." })}>Message students behind ({behind.length})</button>
        <button className="ip-btn ghost" disabled={!list.length} onClick={() => exportCsv(list)}>Export CSV</button>
      </PageHead>
      <HowItWorks id="portal-year-plan" steps={[
        "Every student has a 40-week Year Plan made for their class group (6-8, 9-10, 11-12, college): a few tasks a week covering every course lesson, the Communication and Aptitude Labs, every tool and the career tools, in a sensible order. Exam months get a lighter week.",
        "Week 1 is the day the student joined (or 13 November 2026 for students who joined before the plan began), so each student moves at their own dates.",
        "Tasks tick themselves from what the student actually does - a lesson finished, a lab lesson completed, a page opened. 'On track' is the share of the tasks due so far that are done.",
        "Behind means under 60% of the tasks due so far, with at least three due. Message them, or open their profile.",
      ]} sync="Students see the same plan and the same ticks on their dashboard's Year Plan page." />

      <div className="ip-kpis" style={{ marginTop: 14 }}>
        <div className="ip-kpi"><span className="ip-kpi-k">Students on a plan</span><span className="ip-kpi-v">{inClass.length}</span><span className="ip-kpi-s">{cls ? categoryLabel(cls) : "all classes"}</span></div>
        <div className="ip-kpi"><span className="ip-kpi-k">On track (average)</span><span className="ip-kpi-v">{avg(inClass.map((r) => r.onTrack))}%</span><span className="ip-kpi-s">of the tasks due so far done</span></div>
        <div className={`ip-kpi${behind.length ? " is-act" : ""}`}><span className="ip-kpi-k">Behind</span><span className="ip-kpi-v">{behind.length}</span><span className="ip-kpi-s">under 60% of what&apos;s due</span></div>
        <div className="ip-kpi"><span className="ip-kpi-k">This week done</span><span className="ip-kpi-v">{inClass.filter((r) => r.thisWeekTotal && r.thisWeekDone === r.thisWeekTotal).length}</span><span className="ip-kpi-s">finished all of this week&apos;s tasks</span></div>
      </div>

      {byClass.length > 0 && (
        <div className="ip-card" style={{ marginTop: 14 }}>
          <div className="ip-sec"><div className="ip-sec-h"><b>By class</b></div>
            <div className="ip-table-wrap">
              <table className="ip-table">
                <thead><tr><th>Class</th><th className="num">Students</th><th className="num">Average week</th><th className="num">On track</th><th className="num">Behind</th><th className="num">Whole plan done</th></tr></thead>
                <tbody>
                  {byClass.map((b) => (
                    <tr key={b.c} style={{ cursor: "pointer" }} onClick={() => setCls(cls === b.c ? "" : b.c)}>
                      <td>{categoryLabel(b.c)}{cls === b.c ? " (showing)" : ""}</td><td className="num">{b.n}</td><td className="num">{b.week} of {PLAN_WEEKS}</td>
                      <td className="num">{b.onTrack}%</td><td className="num">{b.behind}</td><td className="num">{b.plan}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="ip-card" style={{ marginTop: 14 }}>
        <div className="ip-toolbar">
          <div className="ip-tabs">
            <button className={`ip-tab${tab === "all" ? " on" : ""}`} onClick={() => setTab("all")}>All ({inClass.length})</button>
            <button className={`ip-tab${tab === "behind" ? " on" : ""}`} onClick={() => setTab("behind")}>Behind ({behind.length})</button>
            <button className={`ip-tab${tab === "track" ? " on" : ""}`} onClick={() => setTab("track")}>On track ({inClass.length - behind.length})</button>
          </div>
          {classes.length > 1 && (
            <select className="ip-select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class" style={{ marginLeft: "auto" }}>
              <option value="">All classes</option>
              {classes.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
            </select>
          )}
        </div>
        {list.length === 0 ? (
          <div className="ip-empty">{rows.length ? "No student matches these filters." : "No students yet. They appear here once they sign up with your institution's name."}</div>
        ) : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th style={{ width: "24%" }}>Student</th><th className="num">Week</th><th className="num">This week</th><th>Due so far</th><th className="num">Whole plan</th><th>Next task</th></tr></thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.uid}>
                    <td className="ip-name"><Link href={`/institution/students/${r.uid}`}>{r.name}</Link><small>{r.category ? categoryLabel(r.category) : "Class not stated"}</small></td>
                    <td className="num">{r.week > PLAN_WEEKS ? "Finished" : `${r.week} of ${PLAN_WEEKS}`}</td>
                    <td className="num">{r.thisWeekTotal ? `${r.thisWeekDone}/${r.thisWeekTotal}` : "-"}</td>
                    <td><span className={`ip-pill ${pill(r)}`}>{r.due ? `${r.dueDone} of ${r.due} · ${r.onTrack}%` : "Nothing due yet"}</span></td>
                    <td className="num">{r.total ? Math.round((r.done / r.total) * 100) : 0}%</td>
                    <td style={{ fontSize: 12.5, color: "var(--ink2)" }}>{r.next ?? "All done for now"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ComposeMessage preset={compose} onClose={() => setCompose(null)} />
    </>
  );
}

function exportCsv(list: YearPlanRow[]) {
  const head = ["Name", "Class", "Week", "This week done", "This week tasks", "Due so far", "Done of due", "On track %", "Plan done", "Plan tasks", "To catch up", "Next task"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = list.map((r) => [
    r.name, r.category ? categoryLabel(r.category) : "", Math.min(r.week, PLAN_WEEKS), r.thisWeekDone, r.thisWeekTotal, r.due, r.dueDone, r.onTrack, r.done, r.total, r.catchUp, r.next ?? "",
  ].map(esc).join(","));
  const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `year-plan-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
