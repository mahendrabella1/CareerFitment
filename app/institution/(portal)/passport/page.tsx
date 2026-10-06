"use client";

/** /institution/passport - verify the milestones students add to their Career Passport. */
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Kpi, Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { KIND_LABEL, type Milestone, type MilestoneStatus } from "@/lib/institution/passport";
import { formatAgo } from "@/lib/institution/analytics";
import { HowItWorks } from "@/components/HowItWorks";

export default function PassportPage() {
  const { students } = usePortal();
  const { data, error, reload } = useApi<{ milestones: Milestone[] }>("/api/institution/milestones");
  const [tab, setTab] = useState<MilestoneStatus>("pending");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const byUid = useMemo(() => new Map((students ?? []).map((s) => [s.uid, s])), [students]);

  if (error) return <div className="ip-alert bad">{error}</div>;
  if (!data) return <div className="ip-empty">Loading…</div>;
  const list = data.milestones.filter((m) => m.status === tab);
  const count = (s: MilestoneStatus) => data.milestones.filter((m) => m.status === s).length;
  const act = async (m: Milestone, action: "verify" | "reject") => {
    setBusy(m.id);
    try { await send("/api/institution/milestones", "POST", { id: m.id, action, note: notes[m.id] ?? "" }); await reload(); }
    finally { setBusy(null); }
  };

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Career Passport</h1>
          <p className="ip-sub">Students add what they&apos;ve done - projects, certificates, internships, competitions - with proof. You verify it, and it appears on their shareable, QR-checkable Career Passport with your institution&apos;s name.</p>
        </div>
      </div>
      <HowItWorks id="portal-passport" steps={["Students add achievements (projects, certificates, competitions, internships) with a link to the proof.", "New ones wait here, and the red badge on 'Career Passport' in the menu counts them.", "Check the proof, then verify or decline it - add a short note the student will see.", "Verified milestones appear on the student's public passport, which colleges and employers can check by QR code."]} sync={"The student sees your decision and note straight away; the public passport shows only verified milestones, never contact details."} />
      <div className="ip-kpis">
        <Kpi icon="clock" label="Waiting for you" value={count("pending")} sub="milestones to review" />
        <Kpi icon="award" label="Verified" value={count("verified")} sub="shown on students' passports" />
        <Kpi icon="users" label="Students with a milestone" value={new Set(data.milestones.map((m) => m.uid)).size} sub={`of ${(students ?? []).filter((s) => !s.archived).length} students`} />
        <Kpi icon="xcircle" label="Not accepted" value={count("rejected")} sub="returned with a note" />
      </div>

      <Section title="Milestones" icon="award" style={{ marginTop: 12 }} aside={
        <span className="ip-tabs" style={{ display: "inline-flex" }}>
          {(["pending", "verified", "rejected"] as MilestoneStatus[]).map((s) => <button key={s} className={`ip-tab${tab === s ? " on" : ""}`} onClick={() => setTab(s)}>{s === "pending" ? "To review" : s === "verified" ? "Verified" : "Not accepted"} ({count(s)})</button>)}
        </span>
      }>
        {list.length === 0 ? <div className="ip-muted">{tab === "pending" ? "Nothing to review. Students add milestones from Career Passport on their dashboard." : "None yet."}</div> : list.map((m) => {
          const s = byUid.get(m.uid);
          return (
            <div className="ip-rec" key={m.id}>
              <span className="ip-pill muted plain" style={{ minWidth: 110, justifyContent: "center" }}>{KIND_LABEL[m.kind] ?? m.kind}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800 }}>{m.title}</div>
                <div className="ip-muted">
                  {s ? <Link href={`/institution/students/${s.uid}`}>{s.name}</Link> : "Student"}{s?.category ? ` · ${categoryLabel(s.category)}` : ""} · {new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · added {formatAgo(m.createdAt).toLowerCase()}
                </div>
                {m.note && <div style={{ marginTop: 4, fontSize: 13 }}>{m.note}</div>}
                {m.evidenceUrl ? <a href={m.evidenceUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, fontWeight: 700, color: "var(--accent)" }}>Open the proof ↗</a> : <div className="ip-muted" style={{ fontSize: 12.5 }}>No proof link - check with the student.</div>}
                {m.status !== "pending" && <div className="ip-muted" style={{ fontSize: 12 }}>{m.status === "verified" ? "Verified" : "Not accepted"} by {m.reviewedBy}{m.reviewNote ? ` - "${m.reviewNote}"` : ""}</div>}
                {m.status === "pending" && <input className="ip-input" style={{ marginTop: 8, maxWidth: 420, padding: "7px 10px" }} placeholder="Note to the student (optional)" value={notes[m.id] ?? ""} onChange={(e) => setNotes({ ...notes, [m.id]: e.target.value })} />}
              </div>
              {m.status === "pending" && (
                <div style={{ display: "flex", gap: 6, flexDirection: "column" }}>
                  <button className="ip-btn sm" disabled={busy === m.id} onClick={() => void act(m, "verify")}>Verify</button>
                  <button className="ip-btn ghost sm" disabled={busy === m.id} onClick={() => void act(m, "reject")}>Not accepted</button>
                </div>
              )}
            </div>
          );
        })}
      </Section>
    </>
  );
}
