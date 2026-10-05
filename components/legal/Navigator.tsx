"use client";

import { useState } from "react";
import Link from "next/link";
import { tree } from "@/lib/legal/navigator";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { legalGuideBySlug } from "@/data/legal/guides";
import { LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";

/** Walks lib/legal/navigator.ts's tree entirely in local state - no
 *  Firestore, no network call, matching the spec's "answers never leave
 *  the device" rule. */
export function Navigator() {
  const [path, setPath] = useState<string[]>(["start"]);
  const nodeId = path[path.length - 1];
  const node = tree[nodeId];

  const go = (next: string) => setPath((p) => [...p, next]);
  const back = () => setPath((p) => (p.length > 1 ? p.slice(0, -1) : p));
  const restart = () => setPath(["start"]);

  const navButtons = (
    <div style={{ marginTop: 14, display: "flex", gap: 14, justifyContent: "center" }}>
      {path.length > 1 && (
        <button onClick={back} style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Back</button>
      )}
      <button onClick={restart} style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Start over</button>
    </div>
  );

  if (!node) {
    return (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "#334155", margin: 0 }}>Something went wrong with this question.</p>
        {navButtons}
      </div>
    );
  }

  if (node.kind === "sos") {
    const emergency = HELP_CONTACTS.find((c) => c.slug === "emergency");
    return (
      <div style={{ border: "2px solid #dc2626", borderRadius: 14, padding: "22px 20px", background: "#fef2f2", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", color: "#dc2626" }}>Call for help now</div>
        <a href={`tel:${emergency?.number}`} style={{ display: "inline-block", marginTop: 12, fontSize: 32, fontWeight: 900, color: "#dc2626", textDecoration: "none" }}>Call {emergency?.number}</a>
        <p style={{ fontSize: 13, color: "#7f1d1d", marginTop: 10 }}>{emergency?.note}</p>
        <p style={{ fontSize: 12.5, color: "#7f1d1d", marginTop: 6 }}>Children can also call 1098. Women can also call 181.</p>
        {navButtons}
      </div>
    );
  }

  if (node.kind === "guide") {
    const guide = legalGuideBySlug(node.slug);
    return (
      <div style={{ border: `1px solid ${ACCENT}35`, borderRadius: 14, padding: "20px 22px", background: `${ACCENT}08` }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em" }}>Your guide</div>
        {guide && (
          <>
            <div style={{ marginTop: 8, fontSize: 17, fontWeight: 800, color: "#0f172a" }}>{guide.title}</div>
            <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "6px 0 0" }}>{guide.oneLine}</p>
            <div style={{ marginTop: 10, fontSize: 13, color: "#334155" }}>
              <b>Do this first:</b> {guide.firstSteps[0]}
            </div>
          </>
        )}
        <Link href={`/account/legal/guides/${node.slug}`} style={{ display: "inline-block", marginTop: 14, fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, padding: "10px 16px", borderRadius: 10, textDecoration: "none" }}>
          Open the full guide →
        </Link>
        {navButtons}
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "22px 20px" }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>{node.text}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {node.options.map((o) => (
          <button
            key={o.label}
            onClick={() => go(o.next)}
            style={{ textAlign: "left", padding: "12px 16px", borderRadius: 10, border: `1px solid ${ACCENT}40`, background: "#fff", fontSize: 14, fontWeight: 600, color: "#1e293b", cursor: "pointer" }}
          >
            {o.label}
          </button>
        ))}
      </div>
      {path.length > 1 && navButtons}
    </div>
  );
}
