"use client";

/**
 * A "How this works" panel: what a page is for and the steps to use it, plus
 * who else sees the result. Collapsed after the first visit (remembered per
 * page in this browser), always one tap away.
 */
import { useEffect, useState } from "react";

export function HowItWorks({ id, title = "How this works", intro, steps, sync, accent = "#4c5fd5" }: {
  /** A stable key per page, to remember whether it was opened before. */
  id: string;
  title?: string;
  intro?: string;
  steps: string[];
  /** Who else sees what happens here (school, parents, OneGrasp). */
  sync?: string;
  accent?: string;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    try {
      const k = `og.help.${id}`;
      if (!localStorage.getItem(k)) { setOpen(true); localStorage.setItem(k, "1"); }
    } catch { /* storage blocked: stays closed */ }
  }, [id]);
  return (
    <div style={{ border: `1px solid ${accent}33`, background: `${accent}0a`, borderRadius: 14, padding: open ? "12px 16px 14px" : "8px 14px", marginBottom: 14 }}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open}
        style={{ all: "unset", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "100%", fontWeight: 800, fontSize: 13.5, color: accent }}>
        <span aria-hidden style={{ display: "grid", placeItems: "center", width: 20, height: 20, borderRadius: 999, background: accent, color: "#fff", fontSize: 12 }}>?</span>
        {title}
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700 }}>{open ? "Hide" : "Show"}</span>
      </button>
      {open && (
        <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, color: "#3d3d45" }}>
          {intro && <p style={{ margin: "0 0 6px" }}>{intro}</p>}
          <ol style={{ margin: 0, paddingLeft: 20 }}>{steps.map((s) => <li key={s} style={{ marginBottom: 3 }}>{s}</li>)}</ol>
          {sync && <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "#63636f" }}><b>Who sees it:</b> {sync}</p>}
        </div>
      )}
    </div>
  );
}
