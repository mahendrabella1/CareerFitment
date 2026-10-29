"use client";

/**
 * /institution/counselling - students who would benefit from a one-to-one
 * conversation, why (lib/institution/counselling.ts), and how to open it.
 * Most urgent first; filter by reason or class, message, export.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { PageHead } from "@/components/institution/ui";
import { ComposeMessage, type ComposePreset } from "@/components/institution/ComposeMessage";
import { REASON_META, REASON_ORDER, followUps, reasonCounts, type FollowUp, type FollowUpReason } from "@/lib/institution/counselling";
import { HowItWorks } from "@/components/HowItWorks";

export default function CounsellingPage() {
  const { students } = usePortal();
  const [reason, setReason] = useState<FollowUpReason | "">("");
  const [cls, setCls] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [compose, setCompose] = useState<ComposePreset | null>(null);
  const all = useMemo(() => (students ? followUps(students) : []), [students]);
  const counts = useMemo(() => reasonCounts(all), [all]);
  const classes = useMemo(() => [...new Set(all.map((f) => f.row.category).filter(Boolean))].sort(), [all]);
  const list = all.filter((f) => (!reason || f.reasons.some((r) => r.key === reason)) && (!cls || f.row.category === cls));

  if (!students) return <div className="ip-empty">Loading your students…</div>;

  return (
    <>
      <PageHead title="Counselling list" purpose="Students who would benefit from a one-to-one conversation, and why. Start at the top - family conflicts and results that need checking come first. Open a row for a way to begin the conversation.">
        <button className="ip-btn ghost" disabled={!list.length} onClick={() => exportCsv(list)}>Export CSV</button>
      </PageHead>
      <HowItWorks id="portal-counselling" steps={[
        "A student is listed when their parents asked to discuss their choice, their assessment answers look rushed, their own career goal points somewhere other than their results, they're undecided between two paths, their profile matches their chosen career weakly, or they haven't been back for three weeks.",
        "The order is by how urgent the reasons are, not by name.",
        "Open a row for the details and a suggested way to start the conversation; message the student to set a time.",
      ]} sync="Students don't see this list or the reasons. It updates as their records change." />

      <div className="ip-card">
        <div className="ip-toolbar">
          <div className="ip-tabs">
            <button className={`ip-tab${!reason ? " on" : ""}`} onClick={() => setReason("")}>All ({all.length})</button>
            {REASON_ORDER.filter((k) => counts[k]).map((k) => (
              <button key={k} className={`ip-tab${reason === k ? " on" : ""}`} onClick={() => setReason(reason === k ? "" : k)}>{REASON_META[k].label} ({counts[k]})</button>
            ))}
          </div>
          {classes.length > 1 && (
            <select className="ip-select" value={cls} onChange={(e) => setCls(e.target.value)} aria-label="Class" style={{ marginLeft: "auto" }}>
              <option value="">All classes</option>
              {classes.map((c) => <option key={c} value={c}>{categoryLabel(c)}</option>)}
            </select>
          )}
        </div>
        {list.length === 0 ? (
          <div className="ip-empty">{all.length ? "No student matches these filters." : "Nobody needs a follow-up conversation right now. Students appear here once they've completed the assessment."}</div>
        ) : (
          <div className="ip-table-wrap">
            <table className="ip-table">
              <thead><tr><th style={{ width: "26%" }}>Student</th><th>Why</th><th>Best fit / own goal</th><th /></tr></thead>
              <tbody>
                {list.map((f) => {
                  const isOpen = open === f.row.uid;
                  return (
                    <Row key={f.row.uid} f={f} isOpen={isOpen} toggle={() => setOpen(isOpen ? null : f.row.uid)}
                      message={() => setCompose({ audience: { type: "students", uids: [f.row.uid], label: f.row.name }, kind: "message", title: "Can we talk about your career plan?", body: "Hi {name}, I'd like to meet you for a short conversation about your career report and next steps. Reply with a time that suits you this week." })} />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ComposeMessage preset={compose} onClose={() => setCompose(null)} />
    </>
  );
}

function Row({ f, isOpen, toggle, message }: { f: FollowUp; isOpen: boolean; toggle: () => void; message: () => void }) {
  const a = f.row.assessment;
  return (
    <>
      <tr style={isOpen ? { background: "#fafafb" } : undefined}>
        <td className="ip-name"><Link href={`/institution/students/${f.row.uid}`}>{f.row.name}</Link><small>{f.row.category ? categoryLabel(f.row.category) : "Class not stated"}</small></td>
        <td><div className="ip-chips">{f.reasons.map((r) => <span key={r.key} className="ip-chip">{REASON_META[r.key].label}</span>)}</div></td>
        <td style={{ fontSize: 12.5, color: "var(--ink2)" }}>{a.topFit ?? "-"}{a.desiredCareer && <small style={{ display: "block", color: "var(--ink3)" }}>Wants: {a.desiredCareer}</small>}</td>
        <td className="num">
          <button className="ip-btn ghost sm" aria-expanded={isOpen} onClick={toggle}>{isOpen ? "Close" : "Details"}</button>
        </td>
      </tr>
      {isOpen && (
        <tr style={{ background: "#fafafb" }}>
          <td colSpan={4} style={{ borderTop: 0, paddingTop: 0 }}>
            <div style={{ display: "grid", gap: 10, padding: "4px 0 6px" }}>
              {f.reasons.map((r) => (
                <div key={r.key} style={{ display: "grid", gridTemplateColumns: "minmax(160px,220px) minmax(0,1fr)", gap: 12, fontSize: 13, lineHeight: 1.5 }}>
                  <b style={{ fontWeight: 600 }}>{REASON_META[r.key].label}</b>
                  <span style={{ color: "var(--ink2)" }}>{r.detail} <span style={{ color: "var(--ink3)" }}>{REASON_META[r.key].opener}</span></span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                <button className="ip-btn sm" onClick={message}>Message to set a time</button>
                <Link className="ip-btn ghost sm" href={`/institution/students/${f.row.uid}`}>Full profile</Link>
                <Link className="ip-btn ghost sm" href={`/institution/report/${f.row.uid}`} target="_blank" rel="noopener">Their report</Link>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function exportCsv(list: FollowUp[]) {
  const head = ["Name", "Class", "Email", "Phone", "Reasons", "Details", "Best fit", "Own goal"];
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = list.map((f) => [
    f.row.name, f.row.category ? categoryLabel(f.row.category) : "", f.row.email, f.row.phone,
    f.reasons.map((r) => REASON_META[r.key].label).join("; "), f.reasons.map((r) => r.detail).join(" "),
    f.row.assessment.topFit ?? "", f.row.assessment.desiredCareer ?? "",
  ].map(esc).join(","));
  const blob = new Blob([[head.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `counselling-list-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
