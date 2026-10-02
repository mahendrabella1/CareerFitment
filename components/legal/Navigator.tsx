"use client";

import { useState } from "react";
import Link from "next/link";
import { tree } from "@/lib/legal/navigator";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";

/** Walks lib/legal/navigator.ts's tree entirely in local state - no
 *  Firestore, no network call, matching the spec's "answers never leave
 *  the device" rule. */
export function Navigator() {
  const [nodeId, setNodeId] = useState("start");
  const node = tree[nodeId];

  if (node.kind === "sos") {
    const emergency = HELP_CONTACTS.find((c) => c.slug === "emergency");
    return (
      <div style={{ border: "2px solid #dc2626", borderRadius: 14, padding: "22px 20px", background: "#fef2f2", textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", color: "#dc2626" }}>Call for help now</div>
        <a href={`tel:${emergency?.number}`} style={{ display: "inline-block", marginTop: 12, fontSize: 32, fontWeight: 900, color: "#dc2626", textDecoration: "none" }}>Call {emergency?.number}</a>
        <p style={{ fontSize: 13, color: "#7f1d1d", marginTop: 10 }}>{emergency?.note}</p>
        <button onClick={() => setNodeId("start")} style={{ marginTop: 14, fontSize: 12, color: "#7f1d1d", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Start over</button>
      </div>
    );
  }

  if (node.kind === "guide") {
    return (
      <div style={{ border: `1px solid ${ACCENT}35`, borderRadius: 14, padding: "20px 22px", background: `${ACCENT}08`, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em" }}>Your guide</div>
        <Link href={`/account/legal/guides/${node.slug}`} style={{ display: "inline-block", marginTop: 10, fontSize: 16, fontWeight: 800, color: "#0f172a", textDecoration: "none" }}>
          Open the guide →
        </Link>
        <div style={{ marginTop: 14 }}>
          <button onClick={() => setNodeId("start")} style={{ fontSize: 12, color: "#64748b", background: "none", border: "none", textDecoration: "underline", cursor: "pointer" }}>Start over</button>
        </div>
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
            onClick={() => setNodeId(o.next)}
            style={{ textAlign: "left", padding: "12px 16px", borderRadius: 10, border: `1px solid ${ACCENT}40`, background: "#fff", fontSize: 14, fontWeight: 600, color: "#1e293b", cursor: "pointer" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
