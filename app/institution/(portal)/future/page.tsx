"use client";

/** /institution/future - how much the careers students are heading for are expected to change by 2035, and the skills to teach now. */
import { useMemo, useState } from "react";
import { Icon } from "@/app/Icons";
import { usePortal } from "@/components/institution/portalStore";
import { Kpi, Section } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { AREA_BY_KEY, futureOutlook, studentAreas } from "@/lib/institution/features";

const CHANGE = {
  high: { label: "High change", tone: "bad", text: "Much of today's routine work in these areas is expected to be done with or by AI - students need to learn to work alongside it." },
  medium: { label: "Medium change", tone: "warn", text: "The core work stays, but tools and expectations shift - steady upskilling matters." },
  low: { label: "Lower change", tone: "good", text: "Human, hands-on or regulated work - change comes mostly through new digital tools." },
} as const;

export default function FuturePage() {
  const { students } = usePortal();
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const rows = useMemo(() => (students ?? []).filter((s) => !s.archived), [students]);
  const o = useMemo(() => futureOutlook(rows), [rows]);
  if (!students) return <div className="ip-empty">Loading…</div>;
  const known = o.students - o.byChange.unknown;
  const pct = (n: number) => (known ? Math.round((n / known) * 100) : 0);
  const inArea = (key: string) => rows.filter((r) => { const a = studentAreas(r); return (a.goal[0] ?? a.fit[0]) === key; }).map((r) => r.uid);

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Future skills</h1>
          <p className="ip-sub">How much the careers your students are heading for are expected to change by 2035 - and which skills to build now so they stay ahead.</p>
        </div>
      </div>
      <div className="ip-kpis">
        <Kpi icon="flag" label="Heading for high-change careers" value={`${pct(o.byChange.high)}%`} sub={`${o.byChange.high} students`} />
        <Kpi icon="pulse" label="Medium change" value={`${pct(o.byChange.medium)}%`} sub={`${o.byChange.medium} students`} />
        <Kpi icon="shield" label="Lower change" value={`${pct(o.byChange.low)}%`} sub={`${o.byChange.low} students`} />
        <Kpi icon="info" label="No direction yet" value={o.byChange.unknown} sub="no goal or completed assessment" />
      </div>

      <Section title="Career areas and the skills to teach now" icon="sparkle" aside="by each student's goal, or their best fit" style={{ marginTop: 12 }}>
        {o.areas.length === 0 ? <div className="ip-muted">Appears once students complete the assessment or set a goal.</div> : o.areas.map((a) => (
          <div className="ip-rec" key={a.key}>
            <span className={`ip-pill ${CHANGE[a.change].tone}`} style={{ minWidth: 118, justifyContent: "center" }}>{CHANGE[a.change].label}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 800 }}>{a.label} <span className="ip-muted">· {a.students} student{a.students === 1 ? "" : "s"}</span></div>
              <div className="ip-muted">{CHANGE[a.change].text}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                {a.futureSkills.map((s) => <span key={s} className="ip-pill muted plain">{s}</span>)}
              </div>
            </div>
            <button className="ip-btn ghost sm" onClick={() => setCompose({
              audience: { type: "students", uids: inArea(a.key), label: `Heading for ${a.label} (${a.students})` },
              kind: "recommendation", title: `Future skills for ${a.label}`, link: "/account/career-library",
              body: `Hi {name}, careers in ${a.label} are changing fast. Start building these skills now: ${AREA_BY_KEY[a.key].futureSkills.join(", ")}. Pick one and spend 30 minutes on it this week.`,
            })}>Send to these students</button>
          </div>
        ))}
      </Section>
      <p className="ip-muted" style={{ fontSize: 12, marginTop: 10 }}>
        <Icon name="info" size={13} /> Change levels are OneGrasp&apos;s planning estimates, informed by published research on AI and jobs (e.g. ILO 2023, WEF Future of Jobs) - a guide for planning sessions, not a forecast for any student.
      </p>
      <ComposeMessage preset={compose} onClose={() => setCompose(null)} />
    </>
  );
}
