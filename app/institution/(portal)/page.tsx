"use client";

/**
 * /institution - the home page: how far each class is with the assessment
 * (remind a class in one click), this week's to-do list, where students are
 * heading, engagement, and who a counsellor should see first.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { usePortal } from "@/components/institution/portalStore";
import { Bars, DailyChart, Kpi, PageHead, Progress, Section } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { overview, rolloutByClass } from "@/lib/institution/analytics";
import { REASON_META, followUps } from "@/lib/institution/counselling";
import { HowItWorks } from "@/components/HowItWorks";

const FINISH = {
  kind: "reminder" as const,
  title: "Complete your career assessment",
  body: "Hi {name}, please complete your career assessment this week. It takes about 45 minutes - if you've already started, your answers are saved. It unlocks your report, your best-fit careers and your roadmap.",
  link: "/?begin=1",
};

export default function OverviewPage() {
  const { me, students, studentsError, unread } = usePortal();
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const [metric, setMetric] = useState<"students" | "minutes">("students");
  const now = Date.now();
  const o = useMemo(() => (students ? overview(students, now) : null), [students]); // eslint-disable-line react-hooks/exhaustive-deps
  const classes = useMemo(() => (students ? rolloutByClass(students) : []), [students]);
  const follow = useMemo(() => (students ? followUps(students, now) : []), [students]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!students || !o) return <div className="ip-empty">Loading your students…</div>;
  const pct = (n: number) => (o.total ? Math.round((n / o.total) * 100) : 0);
  const seg = (key: string) => o.segments.find((x) => x.key === key)!;
  const remind = (key: string) => { const s = seg(key); setCompose({ audience: { type: "students", uids: s.uids, label: `${s.label} (${s.uids.length})` }, ...s.message }); };
  const remindClass = (label: string, uids: string[]) => setCompose({ audience: { type: "students", uids, label: `${label}: assessment pending (${uids.length})` }, ...FINISH });

  const todo: { n: number; title: string; text: string; action: React.ReactNode }[] = [
    { n: seg("not_started").uids.length, title: "Haven't started the assessment", text: "Their report, best-fit careers and roadmap are waiting on it.", action: <button className="ip-btn ghost sm" onClick={() => remind("not_started")}>Remind</button> },
    { n: seg("in_progress").uids.length, title: "Started but didn't finish", text: "Their answers are saved - they can carry on where they stopped.", action: <button className="ip-btn ghost sm" onClick={() => remind("in_progress")}>Remind</button> },
    { n: follow.length, title: "On the counselling list", text: "A conflict, a result to check or a goal that doesn't match - worth a conversation.", action: <Link className="ip-btn ghost sm" href="/institution/counselling">Open list</Link> },
    { n: seg("inactive_7").uids.length, title: "Not active for a week or more", text: "Assessed, but haven't been back to act on their plan.", action: <button className="ip-btn ghost sm" onClick={() => remind("inactive_7")}>Nudge</button> },
    { n: unread.replies, title: "Student replies to read", text: "Answers to your messages.", action: <Link className="ip-btn ghost sm" href="/institution/replies">Read</Link> },
    { n: unread.milestones, title: "Career Passport entries to verify", text: "Certificates and achievements students added.", action: <Link className="ip-btn ghost sm" href="/institution/passport">Verify</Link> },
  ];
  const pending = classes.reduce((s, c) => s + c.pending.length, 0);

  return (
    <>
      <PageHead title="Overview" purpose={<>{o.total} student{o.total === 1 ? "" : "s"} at {me.institution.name}. Get every class through the assessment, work through this week&apos;s to-do list, and see where your students are heading.</>}>
        <Link className="ip-btn ghost" href="/institution/school-report">School report</Link>
        <button className="ip-btn" onClick={() => setCompose({ audience: { type: "all" } })}>Message students</button>
      </PageHead>
      <HowItWorks id="portal-overview-v2" steps={["The figures at the top cover your whole institution.", "'Assessment by class' shows how far each class has got - remind the students still pending in a class with one click.", "'This week's to-do' lists what needs doing, with one button each.", "'Who to see first' comes from the counselling list: students whose family wants to talk, whose result needs checking, or whose goal differs from their results.", "Press Refresh in the top bar for the latest numbers."]} sync={"Only your institution's logins see these numbers (and the OneGrasp team, when you ask them for help)."} />
      {studentsError && <div className="ip-alert bad">{studentsError}</div>}

      <div className="ip-kpis">
        <Kpi label="Students" value={o.total} sub={classes.length ? `${classes.length} class${classes.length === 1 ? "" : "es"}` : "None linked yet"} />
        <Kpi label="Assessment completed" value={`${pct(o.completed)}%`} sub={`${o.completed} of ${o.total} · ${o.inProgress} unfinished · ${o.notStarted} not started`} />
        <Kpi label="Active in the last 7 days" value={o.active7} sub={`${pct(o.active7)}% of students · ${o.active30} in 30 days`} />
        <Kpi label="To follow up" value={follow.length} action={follow.length > 0} sub={follow.length ? "on the counselling list" : "nobody right now"} />
      </div>

      <div className="ip-grid2">
        <Section title="Assessment by class" aside={pending ? `${pending} still pending` : "all done"} intro="Plan counselling sessions once a class has finished. Remind the students still pending in a class with one click.">
          {classes.length === 0 ? <div className="ip-muted">No students linked yet.</div> : (
            <div className="ip-table-wrap">
              <table className="ip-table">
                <thead><tr><th>Class</th><th className="num">Students</th><th className="num">Done</th><th className="num">Unfinished</th><th className="num">Not started</th><th>Progress</th><th /></tr></thead>
                <tbody>
                  {classes.map((c) => (
                    <tr key={c.category}>
                      <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}><Link href={`/institution/students?class=${encodeURIComponent(c.category)}`} style={{ textDecoration: "none" }}>{c.label}</Link></td>
                      <td className="num">{c.students}</td>
                      <td className="num">{c.completed}</td>
                      <td className="num">{c.inProgress || <span style={{ color: "var(--faint)" }}>0</span>}</td>
                      <td className="num">{c.notStarted || <span style={{ color: "var(--faint)" }}>0</span>}</td>
                      <td style={{ minWidth: 140 }}><Progress pct={c.pct} /></td>
                      <td className="num">{c.pending.length > 0 && <button className="ip-btn ghost sm" onClick={() => remindClass(c.label, c.pending)}>Remind {c.pending.length}</button>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        <Section title="This week's to-do">
          <div className="ip-todo">
            {todo.map((t) => (
              <div key={t.title} className="ip-todo-r">
                <span className={`ip-todo-n${t.n ? "" : " is-zero"}`}>{t.n}</span>
                <span><b>{t.title}</b><small>{t.text}</small></span>
                {t.n > 0 ? t.action : <span className="ip-muted" style={{ fontSize: 12 }}>Nothing to do</span>}
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="ip-grid2e">
        <Section title="Where students are heading" aside={<Link className="ip-link" href="/institution/school-report">Full school report</Link>} intro="The best-fit field in each completed report.">
          <Bars rows={o.topFits.map((f) => ({ label: f.name, value: f.students }))} format={(n) => `${n} student${n === 1 ? "" : "s"}`} empty="Appears once students complete the assessment." />
        </Section>
        <Section title="Engagement" aside={
          <span className="ip-tabs" style={{ display: "inline-flex" }}>
            <button className={`ip-tab${metric === "students" ? " on" : ""}`} onClick={() => setMetric("students")}>Students</button>
            <button className={`ip-tab${metric === "minutes" ? " on" : ""}`} onClick={() => setMetric("minutes")}>Minutes</button>
          </span>
        }>
          <DailyChart data={o.daily.map((d) => ({ day: d.day, value: metric === "students" ? d.activeStudents : d.minutes }))} unit={metric === "students" ? "active students" : "minutes"} />
          <p className="ip-muted" style={{ fontSize: 12, margin: "6px 0 0" }}>Last 30 days. Time counts only while a student is actively using the app.</p>
        </Section>
      </div>

      <Section title="Who to see first" aside={<Link className="ip-link" href="/institution/counselling">Counselling list ({follow.length})</Link>} style={{ marginTop: 14 }}>
        {follow.length === 0 ? <div className="ip-muted">Nobody needs a follow-up conversation right now.</div> : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th>Student</th><th>Why</th><th /></tr></thead>
              <tbody>
                {follow.slice(0, 6).map((f) => (
                  <tr key={f.row.uid}>
                    <td className="ip-name" style={{ width: "28%" }}><Link href={`/institution/students/${f.row.uid}`}>{f.row.name}</Link><small>{f.row.category ? classes.find((c) => c.category === f.row.category)?.label : ""}</small></td>
                    <td><div className="ip-chips">{f.reasons.map((r) => <span key={r.key} className="ip-chip" title={r.detail}>{REASON_META[r.key].label}</span>)}</div></td>
                    <td className="num"><Link href={`/institution/students/${f.row.uid}`} className="ip-btn ghost sm">Open</Link></td>
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
