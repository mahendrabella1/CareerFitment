"use client";

import { useState } from "react";
import Link from "next/link";
import { RESEARCH_OPPORTUNITIES, type AudienceLevel } from "@/data/research/opportunities";

const ACCENT = "#7c3aed";
const FILTERS: { value: AudienceLevel | "all"; label: string }[] = [
  { value: "all", label: "All" }, { value: "school", label: "Class 6-12" },
  { value: "undergraduate", label: "Undergraduate" }, { value: "postgraduate", label: "Postgraduate" }, { value: "professional", label: "Professional" },
];

export default function ConferenceFinderPage() {
  const [filter, setFilter] = useState<AudienceLevel | "all">("all");
  const list = filter === "all" ? RESEARCH_OPPORTUNITIES : RESEARCH_OPPORTUNITIES.filter((o) => o.audience.includes(filter as AudienceLevel));

  return (
    <div style={{ padding: "0 0 8px" }}>
      <Link href="/account/research" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Research & Conferences</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>🗓️ Conference Finder</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 10px" }}>Real, independently-known research opportunities in India and worldwide.</p>

      <div style={{ background: "#fef3c7", color: "#92400e", borderRadius: 10, padding: "10px 14px", fontSize: 12, lineHeight: 1.6, marginBottom: 20 }}>
        OneGrasp's own 500+ virtual conferences aren't listed here yet - we don't have confirmed dates, subjects or fees for them to show accurately. This list will expand once that data is available.
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${filter === f.value ? ACCENT : "#e2e2e2"}`, background: filter === f.value ? `${ACCENT}15` : "#fff", color: filter === f.value ? ACCENT : "#555" }}>
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12 }}>
        {list.map((o) => (
          <div key={o.id} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px", background: "#fff" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{o.name}</div>
              {o.verified && <span style={{ fontSize: 10, fontWeight: 800, color: "#166534", background: "#dcfce7", borderRadius: 999, padding: "3px 9px", whiteSpace: "nowrap" }}>✓ Verified</span>}
            </div>
            <div style={{ fontSize: 12, color: "#999", marginTop: 3 }}>{o.who} · {o.subject}</div>
            <p style={{ fontSize: 13, color: "#444", margin: "8px 0 0", lineHeight: 1.5 }}>{o.what}</p>
            {o.link ? (
              <a href={o.link} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, color: ACCENT, fontWeight: 600, marginTop: 10, display: "inline-block" }}>Official site ↗</a>
            ) : (
              <span style={{ fontSize: 12, color: "#aaa", marginTop: 10, display: "block" }}>Check the official organiser's current site directly.</span>
            )}
          </div>
        ))}
      </div>

      <Link href="/account/research/projects/new" style={{ display: "block", textAlign: "center", marginTop: 24, padding: "12px 0", borderRadius: 10, background: ACCENT, color: "#fff", fontWeight: 700, textDecoration: "none" }}>
        Start a project for a conference →
      </Link>
    </div>
  );
}
