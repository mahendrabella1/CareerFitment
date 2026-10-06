"use client";

/** /institution/opportunities - send each opportunity only to the students it suits, then track who applied and how they did. */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { categoryLabel } from "@/lib/auth/formOptions";
import { usePortal } from "@/components/institution/portalStore";
import { Section } from "@/components/institution/ui";
import { send, useApi } from "@/components/institution/useApi";
import { CAREER_AREAS } from "@/lib/institution/features";
import type { Opportunity, OpportunityType } from "@/lib/institution/types";

const TYPES: { key: OpportunityType; label: string }[] = [
  { key: "olympiad", label: "Olympiad" }, { key: "hackathon", label: "Hackathon" }, { key: "competition", label: "Competition" },
  { key: "workshop", label: "Workshop" }, { key: "internship", label: "Internship" }, { key: "scholarship", label: "Scholarship" }, { key: "event", label: "Event / talk" },
];
const OUTCOMES = ["", "participated", "shortlisted", "selected", "won", "not selected"];

export default function OpportunitiesPage() {
  const { students } = usePortal();
  const { data, error, reload } = useApi<{ opportunities: Opportunity[] }>("/api/institution/opportunities");
  const [f, setF] = useState({ title: "", type: "olympiad" as OpportunityType, description: "", url: "", deadline: "", classes: [] as string[], areas: [] as string[] });
  const [preview, setPreview] = useState<{ count: number; sample: string[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const classes = useMemo(() => [...new Set((students ?? []).filter((s) => !s.archived).map((s) => s.category).filter(Boolean))].sort(), [students]);
  const byUid = useMemo(() => new Map((students ?? []).map((s) => [s.uid, s])), [students]);

  // Live count of who would receive it.
  useEffect(() => {
    const t = setTimeout(() => { send<{ count: number; sample: string[] }>("/api/institution/opportunities", "POST", { ...f, preview: true }).then(setPreview).catch(() => setPreview(null)); }, 350);
    return () => clearTimeout(t);
  }, [f.classes, f.areas]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (k: "classes" | "areas", v: string) => setF((p) => ({ ...p, [k]: p[k].includes(v) ? p[k].filter((x) => x !== v) : [...p[k], v] }));
  async function create() {
    setBusy(true); setMsg("");
    try { await send("/api/institution/opportunities", "POST", f); setMsg(`Sent to ${preview?.count ?? 0} matched students.`); setF({ ...f, title: "", description: "", url: "", deadline: "" }); await reload(); }
    catch (e) { setMsg(e instanceof Error ? e.message : "Could not send."); }
    finally { setBusy(false); }
  }
  async function setOutcome(o: Opportunity, uid: string, outcome: string) {
    await send("/api/institution/opportunities", "PATCH", { id: o.id, uid, outcome });
    await reload();
  }

  return (
    <>
      <div className="ip-head">
        <div>
          <h1 className="ip-h1">Opportunities</h1>
          <p className="ip-sub">Post an olympiad, hackathon, workshop or internship - it goes only to the students it suits (by class and the career areas in their report), not to everyone. Track who applied and how they did.</p>
        </div>
      </div>

      <Section title="New opportunity" icon="target">
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr) minmax(0,1fr)", gap: 10 }} className="op-grid">
          <input className="ip-input" placeholder="Title, e.g. National Science Olympiad 2027" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <select className="ip-select" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as OpportunityType })}>{TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select>
          <input className="ip-input" type="date" value={f.deadline} onChange={(e) => setF({ ...f, deadline: e.target.value })} aria-label="Last date" />
          <textarea className="ip-input" rows={2} style={{ gridColumn: "1 / -1" }} placeholder="What it is and why it's worth it (shown to students)" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} />
          <input className="ip-input" style={{ gridColumn: "1 / -1" }} placeholder="Link to apply (https://…)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="ip-label">Classes (none = all)</div>
          <div className="ip-tabs">{classes.map((c) => <button key={c} className={`ip-tab${f.classes.includes(c) ? " on" : ""}`} onClick={() => toggle("classes", c)}>{categoryLabel(c)}</button>)}</div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className="ip-label">Career areas it suits (none = any)</div>
          <div className="ip-tabs">{CAREER_AREAS.map((a) => <button key={a.key} className={`ip-tab${f.areas.includes(a.key) ? " on" : ""}`} onClick={() => toggle("areas", a.key)}>{a.label}</button>)}</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginTop: 14 }}>
          <button className="ip-btn" disabled={busy || !f.title.trim() || !preview?.count} onClick={() => void create()}>{busy ? "Sending…" : `Send to ${preview?.count ?? 0} matched students`}</button>
          {preview && preview.count > 0 && <span className="ip-muted">e.g. {preview.sample.slice(0, 4).join(", ")}{preview.count > 4 ? "…" : ""}</span>}
          {msg && <span className="ip-muted" style={{ fontWeight: 700 }}>{msg}</span>}
        </div>
        <style>{`@media (max-width:760px){.op-grid{grid-template-columns:1fr !important}}`}</style>
      </Section>

      <Section title="Sent opportunities" icon="award" style={{ marginTop: 12 }}>
        {error && <div className="ip-alert bad">{error}</div>}
        {!data ? <div className="ip-muted">Loading…</div> : data.opportunities.length === 0 ? <div className="ip-muted">None yet.</div> : data.opportunities.map((o) => {
          const applied = Object.keys(o.applied ?? {});
          const won = Object.values(o.outcomes ?? {}).filter((x) => x === "won" || x === "selected").length;
          return (
            <div key={o.id} className="ip-rec" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span className="ip-pill muted plain">{TYPES.find((t) => t.key === o.type)?.label}</span>
                <b style={{ flex: 1, minWidth: 200 }}>{o.title}</b>
                <span className="ip-muted">{o.recipients.length} sent · <b style={{ color: "var(--ink)" }}>{applied.length} applied</b>{won ? ` · ${won} selected/won` : ""}{o.deadline ? ` · closes ${new Date(o.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}` : ""}</span>
                <button className="ip-btn ghost sm" onClick={() => setOpen(open === o.id ? null : o.id)}>{open === o.id ? "Hide" : "Applicants"}</button>
              </div>
              {open === o.id && (
                applied.length === 0 ? <div className="ip-muted" style={{ marginTop: 8 }}>No one has marked &quot;I applied&quot; yet.</div> : (
                  <div className="ip-table-wrap" style={{ marginTop: 8 }}>
                    <table className="ip-table">
                      <thead><tr><th>Student</th><th>Applied</th><th>Outcome</th></tr></thead>
                      <tbody>
                        {applied.map((uid) => (
                          <tr key={uid}>
                            <td className="ip-name"><Link href={`/institution/students/${uid}`}>{byUid.get(uid)?.name ?? "Student"}</Link></td>
                            <td>{new Date(o.applied[uid]).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</td>
                            <td><select className="ip-select" value={o.outcomes?.[uid] ?? ""} onChange={(e) => void setOutcome(o, uid, e.target.value)}>{OUTCOMES.map((x) => <option key={x} value={x}>{x || "-"}</option>)}</select></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          );
        })}
      </Section>
    </>
  );
}
