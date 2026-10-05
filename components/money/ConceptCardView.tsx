"use client";

import { useState } from "react";
import Link from "next/link";
import type { ConceptCard } from "@/data/money/conceptCards";

const ACCENT = "#0ea05f";

export function ConceptCardView({ card, bare }: { card: ConceptCard; /** No frame - when shown inside a dialog. */ bare?: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div style={bare ? { padding: "24px 26px 20px" } : { border: "1px solid #eee", borderRadius: 14, padding: "18px 20px" }}>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: ACCENT }}>{card.topic}</span>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a", margin: "4px 0 10px" }}>{card.title}</h3>
      <p style={{ fontSize: 13.5, fontWeight: 600, color: "#333", margin: "0 0 10px", lineHeight: 1.5 }}>{card.oneLineIdea}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
        {card.bodyMd.split("\n").map((line, i) => (
          <p key={i} style={{ fontSize: 13, lineHeight: 1.6, color: "#555", margin: 0 }}>{line}</p>
        ))}
      </div>
      <div style={{ background: "#fafafa", borderRadius: 8, padding: "10px 14px", marginBottom: 14 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#999", textTransform: "uppercase" }}>Indian example</span>
        <p style={{ fontSize: 13, color: "#444", margin: "4px 0 0", lineHeight: 1.5 }}>{card.indianExample}</p>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", margin: "0 0 8px" }}>{card.checkQ.prompt}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {card.checkQ.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const showFeedback = picked !== null;
            const isCorrect = idx === card.checkQ.correctIndex;
            let bg = "#fff", border = "#e2e2e2", color = "#333";
            if (showFeedback && isCorrect) { bg = "#dcfce7"; border = "#22c55e"; color = "#166534"; }
            else if (showFeedback && isPicked && !isCorrect) { bg = "#fee2e2"; border = "#ef4444"; color = "#991b1b"; }
            return (
              <button key={idx} onClick={() => picked === null && setPicked(idx)}
                style={{ textAlign: "left", padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${border}`, background: bg, color, fontSize: 12.5, cursor: picked === null ? "pointer" : "default" }}>
                {opt}
              </button>
            );
          })}
        </div>
        {picked !== null && (
          <p style={{ fontSize: 12, color: "#666", marginTop: 8, lineHeight: 1.5 }}>{card.checkQ.explanation}</p>
        )}
      </div>

      {card.labSlug && (
        <Link href={`/account/money/labs/${card.labSlug}`} style={{ display: "inline-block", marginTop: 12, fontSize: 12.5, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>
          Try it in a Lab →
        </Link>
      )}
    </div>
  );
}
