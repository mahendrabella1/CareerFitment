"use client";

/**
 * /admin/ai-status - is every AI key on this deployment working? Checks each
 * one live against its provider (app/api/admin/ai-status) without showing it.
 */
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/institution/client";

interface Check { name: string; env: string; state: "ok" | "bad" | "missing" | "warn"; detail: string; usedBy: string; shape?: { set: boolean; length: number; cleaned: boolean; prefixOk: boolean | null; ends: string } }

const COLOR = { ok: "#166534", bad: "#b42318", missing: "#b42318", warn: "#9a3412" };
const LABEL = { ok: "Working", bad: "Rejected", missing: "Not set", warn: "Needs attention" };

export default function AiStatusPage() {
  const [checks, setChecks] = useState<Check[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true); setErr("");
    try { setChecks((await apiFetch<{ checks: Check[] }>("/api/admin/ai-status")).checks); }
    catch (e) { setErr(e instanceof Error ? e.message : "Couldn't run the checks."); } finally { setBusy(false); }
  };
  useEffect(() => { void run(); }, []);

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>AI &amp; keys</h1>
          <p style={{ margin: "4px 0 0", color: "#63636f", fontSize: 14 }}>Each key on this deployment, checked live with its provider. Keys are never shown - only their last four characters.</p>
        </div>
        <button onClick={() => void run()} disabled={busy} style={{ border: "1px solid #e4e4e7", background: "#fff", borderRadius: 8, padding: "8px 14px", font: "inherit", fontWeight: 600, cursor: "pointer" }}>{busy ? "Checking…" : "Check again"}</button>
      </div>
      {err && <p style={{ color: "#b42318" }}>{err}</p>}
      {!checks && !err && <p style={{ color: "#63636f" }}>Checking…</p>}
      <div style={{ display: "grid", gap: 10 }}>
        {checks?.map((c) => (
          <div key={c.name} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
              <b style={{ fontSize: 15.5 }}>{c.name} <code style={{ fontSize: 12, color: "#63636f", fontWeight: 500 }}>{c.env}</code></b>
              <span style={{ fontSize: 13, fontWeight: 700, color: COLOR[c.state] }}>● {LABEL[c.state]}</span>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 14, lineHeight: 1.5 }}>{c.detail}</p>
            {c.shape?.set && (
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#63636f" }}>
                Key ends {c.shape.ends} · {c.shape.length} characters
                {c.shape.prefixOk === false && " · doesn't start the way this provider's keys do - check you pasted the right key"}
                {c.shape.cleaned && " · had spaces or quotes around it (ignored now - worth tidying in Vercel)"}
              </p>
            )}
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#63636f" }}>Used by: {c.usedBy}</p>
          </div>
        ))}
      </div>
      <p style={{ marginTop: 16, fontSize: 13, color: "#63636f", lineHeight: 1.6 }}>To change a key: Vercel → the project → Settings → Environment Variables → edit the value (no quotes or spaces) for Production → Save, then Deployments → Redeploy. A new value only takes effect after a redeploy.</p>
    </div>
  );
}
