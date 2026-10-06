"use client";

/**
 * /account/passport - the student's Career Passport: what they have done
 * (projects, certificates, internships, competitions...) with proof. Their
 * institution verifies each one; verified milestones appear on the public,
 * QR-checkable passport at /passport/<id>.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import { apiFetch } from "@/lib/institution/client";
import { QrCode } from "@/components/research/QrCode";
import { HowItWorks } from "@/components/HowItWorks";
import { KIND_LABEL, MILESTONE_KINDS, type Milestone } from "@/lib/institution/passport";

const CSS = `
.pp{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.pp *{box-sizing:border-box}
.pp-top{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#fff;border-bottom:1px solid #ececef}
.pp-wrap{max-width:980px;margin:0 auto;padding:22px 16px 60px;display:grid;grid-template-columns:minmax(0,1.6fr) minmax(260px,1fr);gap:16px;align-items:start}
.pp-card{background:#fff;border:1px solid #ececef;border-radius:16px;padding:18px}
.pp h1{font-size:24px;margin:0 0 4px;letter-spacing:-.015em}
.pp h2{font-size:15px;margin:0 0 12px}
.pp-muted{color:#63636f;font-size:13px;line-height:1.55}
.pp-in{width:100%;border:1px solid #ececef;border-radius:10px;padding:9px 11px;font:inherit;font-size:14px;background:#fff}
.pp-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pp-btn{background:#E23B41;color:#fff;border:none;border-radius:10px;padding:10px 16px;font:inherit;font-weight:800;cursor:pointer}
.pp-btn.ghost{background:#fff;color:#3d3d45;border:1px solid #ececef}
.pp-btn:disabled{opacity:.5}
.pp-m{display:flex;gap:12px;padding:12px 0;border-top:1px solid #f0f0f3;align-items:flex-start}
.pp-m:first-child{border-top:none}
.pp-pill{font-size:11.5px;font-weight:800;border-radius:999px;padding:3px 9px;white-space:nowrap}
.pp-pill.pending{background:#fdf3e2;color:#9a6700}.pp-pill.verified{background:#eaf6f0;color:#1f7a55}.pp-pill.rejected{background:#fdecec;color:#c62828}
@media (max-width:820px){.pp-wrap{grid-template-columns:minmax(0,1fr)}.pp-grid{grid-template-columns:1fr}}
`;

const STATUS_LABEL = { pending: "Waiting for your school", verified: "Verified ✓", rejected: "Not accepted" } as const;

export default function MyPassportPage() {
  const { user, loading } = useAuth();
  const [data, setData] = useState<{ milestones: Milestone[]; passportId: string; institution: string | null } | null>(null);
  const [error, setError] = useState("");
  const [f, setF] = useState({ title: "", kind: "project", evidenceUrl: "", date: new Date().toISOString().slice(0, 10), note: "" });
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = () => apiFetch<typeof data>("/api/student/milestones").then(setData).catch((e) => setError(e instanceof Error ? e.message : "Could not load."));
  useEffect(() => { if (user) void load(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    try { await apiFetch("/api/student/milestones", { method: "POST", body: JSON.stringify(f) }); setF({ ...f, title: "", evidenceUrl: "", note: "" }); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not add."); }
    finally { setBusy(false); }
  }
  async function remove(id: string) {
    try { await apiFetch(`/api/student/milestones?id=${id}`, { method: "DELETE" }); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not remove."); }
  }

  const url = data?.passportId && typeof window !== "undefined" ? `${window.location.origin}/passport/${data.passportId}` : "";
  const verified = data?.milestones.filter((m) => m.status === "verified").length ?? 0;

  return (
    <div className="pp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="pp-top"><Link href="/account"><Logo height={32} /></Link><span style={{ flex: 1 }} /><Link href="/account" style={{ fontWeight: 700, color: "#3d3d45", textDecoration: "none" }}>← Dashboard</Link></header>
      {loading ? <p className="pp-muted" style={{ padding: 24 }}>Loading…</p> : !user ? <p className="pp-muted" style={{ padding: 24 }}>Please <Link href="/signin">sign in</Link> to open your Career Passport.</p> : (
        <div className="pp-wrap">
          <div style={{ display: "grid", gap: 16 }}>
            <div className="pp-card">
              <h1>Career Passport</h1>
              <p className="pp-muted">Add what you&apos;ve done, with proof. {data?.institution ? <>Your school, <b>{data.institution}</b>, verifies each one</> : <>Once your school uses OneGrasp, it can verify each one</>} - verified milestones appear on your passport, which you can share with colleges and employers.</p>
            </div>
            <HowItWorks id="passport" accent="#E23B41" steps={[
              "Add a milestone: what you did, the type, the date, and a link to the proof (project, certificate, photo, GitHub or Drive).",
              "It shows 'Waiting for your school' until your school checks the proof - then 'Verified ✓' or 'Not accepted' with their note.",
              "Verified milestones appear on your public passport. Share the link or QR code on the right with colleges, employers or scholarship forms.",
            ]} sync="Your school sees every milestone you add. Anyone with your passport link sees only verified milestones - never your phone or email." />
            <form className="pp-card" onSubmit={add}>
              <h2>Add a milestone</h2>
              <div className="pp-grid">
                <input className="pp-in" style={{ gridColumn: "1 / -1" }} required maxLength={120} placeholder="What did you do? e.g. Built a weather app, Won district science olympiad" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
                <select className="pp-in" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value })}>{MILESTONE_KINDS.map((k) => <option key={k.key} value={k.key}>{k.label}</option>)}</select>
                <input className="pp-in" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} />
                <input className="pp-in" style={{ gridColumn: "1 / -1" }} type="url" placeholder="Link to the proof (project, certificate, photo, GitHub, Drive)" value={f.evidenceUrl} onChange={(e) => setF({ ...f, evidenceUrl: e.target.value })} />
                <textarea className="pp-in" style={{ gridColumn: "1 / -1" }} rows={2} maxLength={500} placeholder="A line about what you learned (optional)" value={f.note} onChange={(e) => setF({ ...f, note: e.target.value })} />
              </div>
              {error && <p style={{ color: "#c62828", fontSize: 13 }}>{error}</p>}
              <button className="pp-btn" style={{ marginTop: 12 }} disabled={busy}>{busy ? "Adding…" : "Add milestone"}</button>
            </form>
            <div className="pp-card">
              <h2>Your milestones ({data?.milestones.length ?? 0})</h2>
              {!data ? <p className="pp-muted">Loading…</p> : data.milestones.length === 0 ? <p className="pp-muted">Nothing yet - add your first milestone above.</p> : data.milestones.map((m) => (
                <div className="pp-m" key={m.id}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800 }}>{m.title}</div>
                    <div className="pp-muted">{KIND_LABEL[m.kind]} · {new Date(m.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}{m.evidenceUrl && <> · <a href={m.evidenceUrl} target="_blank" rel="noreferrer">proof ↗</a></>}</div>
                    {m.reviewNote && <div className="pp-muted" style={{ fontStyle: "italic" }}>School: &ldquo;{m.reviewNote}&rdquo;</div>}
                  </div>
                  <span className={`pp-pill ${m.status}`}>{STATUS_LABEL[m.status]}</span>
                  {m.status !== "verified" && <button type="button" className="pp-btn ghost" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => void remove(m.id)}>Remove</button>}
                </div>
              ))}
            </div>
          </div>
          <div className="pp-card" style={{ textAlign: "center" }}>
            <h2>Share your passport</h2>
            <p className="pp-muted">{verified} verified milestone{verified === 1 ? "" : "s"} shown. Anyone with the link or QR code can see them - never your contact details.</p>
            {url && (
              <>
                <div style={{ margin: "14px 0" }}><QrCode value={url} label="QR code for your Career Passport" /></div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="pp-btn" onClick={() => navigator.clipboard.writeText(url).then(() => setCopied(true)).catch(() => undefined)}>{copied ? "Copied ✓" : "Copy link"}</button>
                  <a className="pp-btn ghost" style={{ textDecoration: "none" }} href={url} target="_blank" rel="noreferrer">View ↗</a>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
