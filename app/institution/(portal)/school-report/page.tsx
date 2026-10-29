"use client";

/**
 * /institution/school-report - one printable summary of the institution for
 * the principal, management or a parents' meeting: participation by class,
 * career directions, goals vs results, strengths, engagement and
 * counselling needs (lib/institution/schoolReport.ts).
 */
import { useMemo } from "react";
import { usePortal } from "@/components/institution/portalStore";
import { Bars, PageHead, Progress, Section } from "@/components/institution/ui";
import { formatDuration, overview } from "@/lib/institution/analytics";
import { REASON_META, REASON_ORDER, followUps, reasonCounts } from "@/lib/institution/counselling";
import { schoolReport } from "@/lib/institution/schoolReport";

export default function SchoolReportPage() {
  const { me, students, loadedAt } = usePortal();
  const now = Date.now();
  const r = useMemo(() => (students ? schoolReport(students, now) : null), [students]); // eslint-disable-line react-hooks/exhaustive-deps
  const o = useMemo(() => (students ? overview(students, now) : null), [students]); // eslint-disable-line react-hooks/exhaustive-deps
  const needs = useMemo(() => (students ? reasonCounts(followUps(students, now)) : null), [students]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!students || !r || !o || !needs) return <div className="ip-empty">Loading your students…</div>;
  const date = new Date(loadedAt ?? now).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const withGoal = r.goals.aligned + r.goals.differs;

  return (
    <>
      <PageHead title="School report" purpose={<>A summary of {me.institution.name} for the principal, management or a parents&apos; meeting - as of {date}. Print it or save it as a PDF.</>}>
        <button className="ip-btn ghost ip-noprint" onClick={() => downloadCsv(r)}>Download CSV</button>
        <button className="ip-btn ip-noprint" onClick={() => window.print()}>Print / Save as PDF</button>
      </PageHead>

      <div className="ip-kpis">
        <div className="ip-kpi"><div className="ip-kpi-k">Students</div><div className="ip-kpi-v">{r.total}</div><div className="ip-kpi-s">{r.classes.length} classes</div></div>
        <div className="ip-kpi"><div className="ip-kpi-k">Assessment completed</div><div className="ip-kpi-v">{r.total ? Math.round((r.completed / r.total) * 100) : 0}%</div><div className="ip-kpi-s">{r.completed} students</div></div>
        <div className="ip-kpi"><div className="ip-kpi-k">Active in 30 days</div><div className="ip-kpi-v">{r.active30}</div><div className="ip-kpi-s">{o.totalHours} hours in total</div></div>
        <div className="ip-kpi"><div className="ip-kpi-k">Goal matches results</div><div className="ip-kpi-v">{withGoal ? `${Math.round((r.goals.aligned / withGoal) * 100)}%` : "-"}</div><div className="ip-kpi-s">of {withGoal} students with a clear goal</div></div>
      </div>

      {r.summary.length > 0 && (
        <Section title="In brief" style={{ marginTop: 14 }}>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4, fontSize: 13.5, lineHeight: 1.6, color: "var(--ink2)" }}>{r.summary.map((s) => <li key={s}>{s}</li>)}</ul>
        </Section>
      )}

      <Section title="Participation by class" style={{ marginTop: 14 }}>
        <div className="ip-table-wrap">
          <table className="ip-table">
            <thead><tr><th>Class</th><th className="num">Students</th><th className="num">Assessed</th><th>Completion</th><th className="num">Active (30 days)</th><th>Top best-fit fields</th></tr></thead>
            <tbody>
              {r.classes.map((c) => (
                <tr key={c.category}>
                  <td style={{ fontWeight: 600 }}>{c.label}</td>
                  <td className="num">{c.students}</td>
                  <td className="num">{c.completed}</td>
                  <td style={{ minWidth: 140 }}><Progress pct={c.pct} /></td>
                  <td className="num">{c.active30}</td>
                  <td style={{ fontSize: 12.5, color: "var(--ink2)" }}>{c.topFields.map((f) => `${f.name} (${f.n})`).join(", ") || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <div className="ip-grid2e">
        <Section title="Best-fit fields" aside="completed reports">
          <Bars rows={r.fields.map((f) => ({ label: f.name, value: f.n }))} format={(n) => `${n}`} empty="Appears once students complete the assessment." />
        </Section>
        <Section title="Career areas" aside="grouped by OneGrasp">
          <Bars rows={r.areas.map((a) => ({ label: a.label, value: a.n }))} format={(n) => `${n}`} empty="Appears once students complete the assessment." />
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Own goal vs results" intro="Whether the career a student named points to the same area as their results.">
          <Bars rows={[
            { label: "Same area", value: r.goals.aligned },
            { label: "Different area", value: r.goals.differs },
            { label: "Goal unclear", value: r.goals.unclear },
            { label: "No goal named", value: r.goals.noGoal },
          ]} format={(n) => `${n}`} />
        </Section>
        <Section title="Most common strengths" aside="from the assessment">
          <Bars rows={r.strengths.map((s) => ({ label: s.name, value: s.n }))} format={(n) => `${n}`} empty="Appears once students complete the assessment." />
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Where students spend their time" aside="all time">
          <Bars rows={o.byArea.slice(0, 8).map((a) => ({ label: a.label, value: a.minutes, note: `${a.students} students` }))} format={(m) => formatDuration(m * 60)} empty="No time recorded yet." />
        </Section>
        <Section title="Counselling needs" intro="Students can have more than one reason.">
          <Bars rows={REASON_ORDER.map((k) => ({ label: REASON_META[k].label, value: needs[k] }))} format={(n) => `${n}`} />
        </Section>
      </div>

      <p className="ip-muted" style={{ fontSize: 12, marginTop: 16 }}>Generated by OneGrasp from students&apos; own records on {date}. Best-fit fields come from each student&apos;s assessment report; career areas are OneGrasp&apos;s groupings of those fields.</p>
    </>
  );
}

function downloadCsv(r: NonNullable<ReturnType<typeof schoolReport>>) {
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const head = ["Class", "Students", "Assessed", "Completion %", "Active in 30 days", "Top best-fit fields"];
  const lines = r.classes.map((c) => [c.label, c.students, c.completed, c.pct, c.active30, c.topFields.map((f) => `${f.name} (${f.n})`).join("; ")].map(esc).join(","));
  const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `school-report-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
