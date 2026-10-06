"use client";

/** /institution - the whole institution at a glance, with one-click reminders. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { usePortal } from "@/components/institution/portalStore";
import { Bars, DailyChart, Kpi, Section, StatusPill } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { STATUS_META, daysSinceActive, formatAgo, formatDuration, overview, studentStatus, type StudentStatus } from "@/lib/institution/analytics";

export default function OverviewPage() {
  const { me, students, studentsError } = usePortal();
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const [metric, setMetric] = useState<"students" | "minutes">("students");
  const now = Date.now();
  const o = useMemo(() => (students ? overview(students, now) : null), [students]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!students) return <div className="ip-empty">Loading your students…</div>;
  if (!o) return null;
  const pct = (n: number) => (o.total ? Math.round((n / o.total) * 100) : 0);
  const remind = (key: string) => {
    const s = o.segments.find((x) => x.key === key);
    if (s) setCompose({ audience: { type: "students", uids: s.uids, label: `${s.label} (${s.uids.length})` }, ...s.message });
  };

  const attention = students
    .filter((s) => !s.archived && studentStatus(s, now) !== "on_track")
    .map((s) => ({ s, st: studentStatus(s, now), since: daysSinceActive(s, now) }))
    .sort((a, b) => order(a.st) - order(b.st) || (b.since ?? 999) - (a.since ?? 999))
    .slice(0, 8);

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Overview</h1>
          <p className="ip-sub">{o.total} student{o.total === 1 ? "" : "s"} at {me.institution.name}</p>
        </div>
        <button className="ip-btn" onClick={() => setCompose({ audience: { type: "all" } })}><Icon name="bell" size={16} stroke={2} /> Message students</button>
      </div>
      {studentsError && <div className="ip-alert bad">{studentsError}</div>}

      {o.insights.length > 0 && (
        <Section title="What needs your attention" icon="sparkle" style={{ marginBottom: 12 }}>
          {o.insights.map((i, n) => (
            <div key={n} className={`ip-insight ${i.tone}`}>
              <Icon name={i.tone === "good" ? "check" : i.tone === "warn" ? "flag" : "info"} size={16} stroke={2} />
              <span>{i.text}</span>
              {i.segment && <button className="ip-btn sm" onClick={() => remind(i.segment!)}>Send reminder</button>}
            </div>
          ))}
        </Section>
      )}

      <div className="ip-kpis">
        <Kpi icon="users" label="Students" value={o.total} sub={o.byClass.slice(0, 3).map((c) => `${c.label}: ${c.students}`).join(" · ") || "None linked yet"} />
        <Kpi icon="check" label="Assessment completed" value={`${pct(o.completed)}%`} sub={`${o.completed} done · ${o.inProgress} in progress · ${o.notStarted} not started`} />
        <Kpi icon="pulse" label="Active this week" value={o.active7} sub={`${pct(o.active7)}% of students · ${o.active30} in the last 30 days`} />
        <Kpi icon="clock" label="Time this week" value={formatDuration(o.minutes7 * 60)} sub={o.active7 ? `${formatDuration(o.avgMinutes7 * 60)} per active student · ${o.totalHours} h in total` : "No activity recorded this week"} />
      </div>

      <div className="ip-grid2">
        <Section title="Daily activity" icon="pulse" aside={
          <span className="ip-tabs" style={{ display: "inline-flex" }}>
            <button className={`ip-tab${metric === "students" ? " on" : ""}`} onClick={() => setMetric("students")}>Students</button>
            <button className={`ip-tab${metric === "minutes" ? " on" : ""}`} onClick={() => setMetric("minutes")}>Minutes</button>
          </span>
        }>
          <DailyChart data={o.daily.map((d) => ({ day: d.day, value: metric === "students" ? d.activeStudents : d.minutes }))} unit={metric === "students" ? "active students" : "minutes"} />
          <p className="ip-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>Last 30 days. Time counts only while a student is actively using the app.</p>
        </Section>
        <Section title="Where students stand" icon="target">
          <div className="ip-bars">
            {(Object.keys(STATUS_META) as StudentStatus[]).map((k) => (
              <Link key={k} href={`/institution/students?status=${k}`} className="ip-bar-row" style={{ textDecoration: "none", gridTemplateColumns: "150px minmax(0,1fr) auto" }}>
                <span><StatusPill status={k} /></span>
                <div className="ip-bar"><div style={{ width: `${Math.max(2, pct(o.status[k]))}%`, background: `var(--${STATUS_META[k].tone === "muted" ? "faint" : STATUS_META[k].tone})` }} /></div>
                <span className="ip-bar-n">{o.status[k]}</span>
              </Link>
            ))}
          </div>
          <p className="ip-muted" style={{ fontSize: 12, margin: "12px 0 0" }}>On track: active in the last 7 days. Needs a nudge: 7-13 days. Inactive: 14+ days or never.</p>
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Time by area" icon="clock" aside="all time">
          <Bars rows={o.byArea.slice(0, 8).map((a) => ({ label: a.label, value: a.minutes, note: `${a.students} students` }))} format={(m) => formatDuration(m * 60)} empty="No time recorded yet - it appears as students use the app." />
        </Section>
        <Section title="Best-fit careers" icon="compass" aside="from completed reports">
          <Bars rows={o.topFits.map((f) => ({ label: f.name, value: f.students }))} format={(n) => `${n} student${n === 1 ? "" : "s"}`} empty="Appears once students complete the assessment." />
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Classes" icon="school">
          <Bars rows={o.byClass.map((c) => ({ label: c.label, value: c.students, note: `${c.completed} assessed` }))} empty="No students yet." />
        </Section>
        <Section title="Courses" icon="book" aside="students who started · average progress">
          <Bars rows={o.courses.map((c) => ({ label: c.label, value: c.started, note: c.started ? `${c.avgPct}% avg · ${c.completed} finished` : "not started" }))} format={(n) => `${n}`} />
        </Section>
      </div>

      <Section title="Students who need attention" icon="flag" aside={<Link href="/institution/students" style={{ color: "var(--brand)", fontWeight: 700, textDecoration: "none" }}>All students →</Link>} style={{ marginTop: 12 }}>
        {attention.length === 0 ? (
          <div className="ip-muted">Everyone is on track.</div>
        ) : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th>Student</th><th>Status</th><th>Assessment</th><th>Last active</th><th /></tr></thead>
              <tbody>
                {attention.map(({ s, st }) => (
                  <tr key={s.uid}>
                    <td className="ip-name"><Link href={`/institution/students/${s.uid}`}>{s.name}</Link><small>{s.email}</small></td>
                    <td><StatusPill status={st} /></td>
                    <td>{s.assessment.status === "completed" ? "Completed" : s.assessment.status === "in_progress" ? "Unfinished" : "Not started"}</td>
                    <td>{formatAgo(s.activity.lastActiveAt, now)}</td>
                    <td className="num"><Link href={`/institution/students/${s.uid}`} className="ip-btn ghost sm" style={{ textDecoration: "none" }}>Open</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>

      <ComposeMessage preset={compose} onClose={() => setCompose(null)} />
    </>
  );
}

function order(s: StudentStatus): number {
  return { not_started: 0, inactive: 1, needs_nudge: 2, on_track: 3 }[s];
}
