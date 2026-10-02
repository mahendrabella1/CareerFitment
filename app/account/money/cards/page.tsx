"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { CONCEPT_CARDS, type ConceptCard } from "@/data/money/conceptCards";
import { ConceptCardView } from "@/components/money/ConceptCardView";

const ACCENT = "#0ea05f";
const TOPICS: ConceptCard["topic"][] = ["Earning", "Spending", "Saving", "Banking", "Digital payments", "Borrowing", "Investing", "Inflation", "Protect"];

export default function CardsPage() {
  const [topic, setTopic] = useState<ConceptCard["topic"] | null>(null);
  const filtered = topic ? CONCEPT_CARDS.filter((c) => c.topic === topic) : CONCEPT_CARDS;

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Financial Literacy</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>🗂️ Concept Library</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 20px" }}>Short, real ideas - 2 minutes each, with an Indian example and a quick check.</p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 22 }}>
        <button onClick={() => setTopic(null)} style={chipStyle(topic === null)}>All</button>
        {TOPICS.map((t) => (
          <button key={t} onClick={() => setTopic(t)} style={chipStyle(topic === t)}>{t}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((c) => <ConceptCardView key={c.id} card={c} />)}
      </div>
    </div>
  );
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
    border: `1.5px solid ${active ? ACCENT : "#e2e2e2"}`, background: active ? `${ACCENT}15` : "#fff", color: active ? ACCENT : "#555",
  };
}
