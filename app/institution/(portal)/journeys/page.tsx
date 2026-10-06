"use client";

/**
 * /institution/journeys - OneGrasp's three signature features across the
 * institution: Career GPS (weekly missions, points, streaks), Career
 * Test-Drives (which careers students tried and how much they enjoyed the
 * day) and the Family Decision Room (each student's choice and whether the
 * parents agreed).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Kpi, Section } from "@/components/institution/ui";
import { HowItWorks } from "@/components/HowItWorks";
import { enjoymentLabel } from "@/lib/testDrive";
import { formatAgo } from "@/lib/institution/analytics";

export default function JourneysPage() {
  const { students } = usePortal();
  const [cls, setCls] = useState("all");
  const rows = useMemo(() => (students ?? []).filter((s) => !s.archived && (cls === "all" || s.category === cls)), [students, cls]);
  const classes = useMemo(() => [...new Set((students ?? []).map((s) => s.category).filter(Boolean))].sort(), [students]);

  const gpsRows = rows.filter((s) => s.gps).sort((a, b) => (b.gps!.points - a.gps!.points) || (b.gps!.streak - a.gps!.streak));
  const fullWeek = gpsRows.filter((s) => s.gps!.weekTotal > 0 && s.gps!.weekDone >= s.gps!.weekTotal).length;
  const drives = rows.flatMap((s) => s.testDrives.map((t) => ({ ...t, uid: s.uid, name: s.name })));
  const byCareer = useMemo(() => {
    const m = new Map<string, { n: number; sum: number }>();
    for (const d of drives) { const k = d.career; const c = m.get(k) ?? { n: 0, sum: 0 }; m.set(k, { n: c.n + 1, sum: c.sum + d.enjoyment }); }
    return [...m.entries()].map(([career, c]) => ({ career, n: c.n, avg: Math.round((c.sum / c.n) * 10) / 10 })).sort((a, b) => b.n - a.n || b.avg - a.avg);
  }, [drives]);
  const decisions = rows.filter((s) => s.decision).sort((a, b) => (b.decision!.savedAt - a.decision!.savedAt));
  const discuss = decisions.filter((s) => s.decision!.parentAnswer === "discuss").length;

  if (!students) return <div className="ip-empty">Loading…</div>;
  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Career journeys</h1>
          <p className="ip-sub">OneGrasp&apos;s signature tools, school-wide: who is keeping up their weekly Career GPS, which careers students have test-driven and enjoyed, and the decisions families are making together.</p>
        </div>
        <select className="ip-select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class">
          <option value="all">All classes</option>
          {classes.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
        </select>
      </div>
      <HowItWorks id="portal-journeys" steps={[
        "Career GPS: each student gets three small missions a week in their dashboard. Points and a weekly streak show who is keeping up - nudge the ones at 0 from Messages.",
        "Career Test-Drive: students live a day in a career (five real moments) and rate how much they'd enjoy it. A low score on their goal career is worth a conversation.",
        "Family Decision Room: students compare two paths side by side with facts, choose one, and their parents answer 'We agree' or 'Let's discuss'. 'Let's discuss' is your cue to invite the family to a counselling session.",
        "Click any student to open their full profile.",
      ]} sync="Students see their own GPS, test-drives and decision sheet; parents see the decision sheet and this week's GPS on their family page." />

      <div className="ip-kpis">
        <Kpi icon="compass" label="Using Career GPS" value={`${gpsRows.length}/${rows.length}`} sub={`${fullWeek} finished all 3 missions this week`} />
        <Kpi icon="play" label="Test-drives taken" value={drives.length} sub={`${new Set(drives.map((d) => d.uid)).size} students · ${byCareer.length} careers`} />
        <Kpi icon="signpost" label="Decision sheets" value={decisions.length} sub={(() => { const n = decisions.filter((s) => s.decision!.parentAnswer === "agree").length; return `${n} famil${n === 1 ? "y" : "ies"} agreed`; })()} />
        <Kpi icon="heart" label="Families to talk to" value={discuss} sub="Parents asked to discuss" />
      </div>

      <div className="ip-grid2e">
        <Section title="Career GPS leaderboard" icon="compass" aside="points · week streak · this week">
          {gpsRows.length === 0 ? <div className="ip-muted">No student has opened Career GPS yet. Send a message pointing to <b>/account/gps</b> to get them started.</div> : (
            <div className="ip-table-wrap"><table className="ip-table">
              <thead><tr><th>#</th><th>Student</th><th className="num">Points</th><th className="num">Streak</th><th className="num">This week</th></tr></thead>
              <tbody>{gpsRows.slice(0, 25).map((s, i) => (
                <tr key={s.uid}>
                  <td>{i + 1}</td>
                  <td className="ip-name"><Link href={`/institution/students/${s.uid}`}>{s.name}</Link><small>{categoryLabel(s.category)}</small></td>
                  <td className="num">{s.gps!.points}</td>
                  <td className="num">{s.gps!.streak}🔥</td>
                  <td className="num">{s.gps!.weekDone}/{s.gps!.weekTotal}</td>
                </tr>
              ))}</tbody>
            </table></div>
          )}
        </Section>
        <Section title="Careers test-driven" icon="play" aside="students · average enjoyment">
          {byCareer.length === 0 ? <div className="ip-muted">No test-drives yet. Students start one from <b>/account/test-drive</b>.</div> : byCareer.slice(0, 15).map((c) => (
            <div key={c.career} className="ip-bar-row" style={{ marginBottom: 8 }}>
              <span title={c.career}>{c.career}</span>
              <div className="ip-bar"><div style={{ width: `${(c.avg / 5) * 100}%`, background: c.avg >= 3.4 ? "var(--good)" : c.avg >= 2.6 ? "var(--warn)" : "var(--bad)" }} /></div>
              <span className="ip-bar-n">{c.n} · {c.avg}/5</span>
            </div>
          ))}
        </Section>
      </div>

      <Section title="Family decisions" icon="signpost" aside={`${decisions.length}`} style={{ marginTop: 12 }}>
        {decisions.length === 0 ? <div className="ip-muted">No decision sheets yet. Students in Classes 9-12 get a Career GPS mission to compare two paths in the Decision Room.</div> : (
          <div className="ip-table-wrap"><table className="ip-table">
            <thead><tr><th>Student</th><th>Comparing</th><th>Chose</th><th>Parents</th><th>Saved</th></tr></thead>
            <tbody>{decisions.map((s) => {
              const d = s.decision!;
              return (
                <tr key={s.uid}>
                  <td className="ip-name"><Link href={`/institution/students/${s.uid}`}>{s.name}</Link><small>{categoryLabel(s.category)}</small></td>
                  <td>{d.pathA} <span className="ip-muted">vs</span> {d.pathB}</td>
                  <td>{d.chosen === "undecided" ? <span className="ip-pill muted">Still deciding</span> : <b>{d.chosen === "A" ? d.pathA : d.pathB}</b>}</td>
                  <td>{d.parentAnswer === "agree" ? <span className="ip-pill good">Agree</span> : d.parentAnswer === "discuss" ? <span className="ip-pill warn">Want to discuss</span> : <span className="ip-pill muted">No answer yet</span>}</td>
                  <td className="ip-muted">{formatAgo(d.savedAt)}</td>
                </tr>
              );
            })}</tbody>
          </table></div>
        )}
      </Section>

      {drives.length > 0 && (
        <Section title="Recent test-drives" icon="play" style={{ marginTop: 12 }}>
          <div className="ip-table-wrap"><table className="ip-table">
            <thead><tr><th>Student</th><th>Career</th><th>Enjoyment</th><th>When</th></tr></thead>
            <tbody>{[...drives].sort((a, b) => b.completedAt - a.completedAt).slice(0, 30).map((d, i) => (
              <tr key={`${d.uid}-${i}`}>
                <td className="ip-name"><Link href={`/institution/students/${d.uid}`}>{d.name}</Link></td>
                <td>{d.career}</td>
                <td><span className={`ip-pill ${d.enjoyment >= 3.4 ? "good" : d.enjoyment >= 2.6 ? "warn" : "bad"}`}>{enjoymentLabel(d.enjoyment)} · {d.enjoyment}/5</span></td>
                <td className="ip-muted">{formatAgo(d.completedAt)}</td>
              </tr>
            ))}</tbody>
          </table></div>
        </Section>
      )}
    </>
  );
}
