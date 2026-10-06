"use client";

/** /passport/[id] - a student's public Career Passport (opened from its QR code). */
import { useEffect, useState } from "react";
import { Logo } from "@/app/Logo";
import { KIND_LABEL } from "@/lib/institution/passport";

interface Passport {
  name: string; className: string; institution: string; fits: string[];
  milestones: { title: string; kind: string; date: string; evidenceUrl: string; verifiedBy: string; verifiedAt: number | null }[];
}

const CSS = `
.pv{min-height:100vh;background:#f6f7fb;color:#141417;font-family:Inter,system-ui,"Segoe UI",sans-serif;padding:24px 16px 48px}
.pv *{box-sizing:border-box}
.pv-card{max-width:720px;margin:0 auto;background:#fff;border:1px solid #ececef;border-radius:18px;overflow:hidden}
.pv-head{padding:22px 24px;background:linear-gradient(120deg,#fdecec,#fff 70%);border-bottom:1px solid #ececef}
.pv-head h1{font-size:26px;margin:12px 0 2px;letter-spacing:-.015em}
.pv-sub{color:#63636f;font-size:14px}
.pv-body{padding:18px 24px 24px}
.pv-chip{display:inline-block;background:#f4f4f6;border-radius:999px;padding:4px 11px;font-size:12.5px;font-weight:700;color:#3d3d45;margin:0 6px 6px 0}
.pv-m{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;padding:14px 0;border-top:1px solid #f0f0f3}
.pv-tick{width:30px;height:30px;border-radius:50%;background:#eaf6f0;color:#1f7a55;display:grid;place-items:center;font-weight:900}
.pv-m b{display:block}
.pv-m small{color:#63636f;font-size:12.5px}
`;

export default function PassportView({ params }: { params: { id: string } }) {
  const [p, setP] = useState<Passport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`/api/passport/${params.id}`).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "Not found."); setP(d); })
      .catch((e) => setError(e instanceof Error ? e.message : "Not found."));
  }, [params.id]);

  return (
    <div className="pv">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="pv-card">
        <div className="pv-head">
          <Logo height={30} />
          {p ? (
            <>
              <h1>{p.name}</h1>
              <div className="pv-sub">{[p.className, p.institution].filter(Boolean).join(" · ")}</div>
            </>
          ) : <h1>{error ? "Passport not found" : "Loading…"}</h1>}
        </div>
        {p && (
          <div className="pv-body">
            <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "#9a9aa6", marginBottom: 6 }}>Career Passport</div>
            {p.fits.length > 0 && <div style={{ marginBottom: 8 }}><span className="pv-sub">Best-fit areas: </span>{p.fits.map((f) => <span key={f} className="pv-chip">{f}</span>)}</div>}
            {p.milestones.length === 0 ? <p className="pv-sub">No verified milestones yet.</p> : p.milestones.map((m, i) => (
              <div className="pv-m" key={i}>
                <span className="pv-tick" aria-label="Verified">✓</span>
                <div>
                  <b>{m.title}</b>
                  <small>{KIND_LABEL[m.kind] ?? m.kind} · {new Date(m.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })} · verified by {m.verifiedBy || "the institution"}{m.evidenceUrl && <> · <a href={m.evidenceUrl} target="_blank" rel="noreferrer">see proof ↗</a></>}</small>
                </div>
              </div>
            ))}
            <p className="pv-sub" style={{ fontSize: 12, marginTop: 16 }}>Each milestone above was checked and verified by the student&apos;s institution on OneGrasp.</p>
          </div>
        )}
      </div>
    </div>
  );
}
