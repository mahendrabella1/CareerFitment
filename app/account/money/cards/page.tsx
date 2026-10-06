"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { CONCEPT_CARDS, type ConceptCard } from "@/data/money/conceptCards";
import { ConceptCardView } from "@/components/money/ConceptCardView";
import { Dialog } from "@/components/ui/Dialog";
import { Pager, usePaged } from "@/components/ui/Pager";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#0ea05f";
const TOPICS: ConceptCard["topic"][] = ["Earning", "Spending", "Saving", "Banking", "Digital payments", "Borrowing", "Investing", "Inflation", "Protect"];
const PAGE_SIZE = 9;

const CARDS_CSS = `
.mc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:14px;scroll-margin-top:80px}
.mc-card{display:flex;flex-direction:column;gap:6px;text-align:left;font:inherit;padding:16px 18px;border-radius:14px;border:1px solid #e2e8f0;background:#fff;cursor:pointer;transition:border-color .15s,box-shadow .15s,transform .15s}
.mc-card:hover{border-color:${ACCENT};box-shadow:0 8px 20px rgba(15,23,42,.07);transform:translateY(-1px)}
.mc-topic{font-size:10.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:${ACCENT}}
.mc-title{font-size:16px;font-weight:800;color:#0f172a;line-height:1.3}
.mc-idea{font-size:13px;color:#475569;line-height:1.5;flex:1}
.mc-foot{display:flex;align-items:center;gap:8px;margin-top:6px;padding-top:10px;border-top:1px solid #f1f5f9;font-size:11.5px;color:#64748b}
.mc-lab{font-weight:700;color:#0f766e;background:#ecfdf5;border-radius:999px;padding:2px 8px}
.mc-go{margin-left:auto;font-weight:800;color:${ACCENT}}
.mc-nav{font:inherit;font-size:13px;font-weight:700;padding:8px 14px;border-radius:10px;border:1px solid #e2e8f0;background:#fff;color:#0f172a;cursor:pointer}
.mc-nav:disabled{opacity:.4;cursor:default}
`;

export default function CardsPage() {
  const [topic, setTopic] = useState<ConceptCard["topic"] | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const filtered = topic ? CONCEPT_CARDS.filter((c) => c.topic === topic) : CONCEPT_CARDS;
  const paged = usePaged(filtered, PAGE_SIZE, topic);
  const top = useRef<HTMLDivElement | null>(null);
  const close = useCallback(() => setOpenId(null), []);

  const openIndex = filtered.findIndex((c) => c.id === openId);
  const openCard = openIndex >= 0 ? filtered[openIndex] : null;
  const countOf = (t: ConceptCard["topic"]) => CONCEPT_CARDS.filter((c) => c.topic === t).length;

  return (
    <div style={{ padding: "0 0 8px" }}>
      <style dangerouslySetInnerHTML={{ __html: CARDS_CSS }} />
      <PageHeader icon="book" eyebrow="Learn" title="Concept Library"
        subtitle="Short, real ideas - 2 minutes each, with an Indian example and a quick check. Open a card to read it." />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        <button onClick={() => setTopic(null)} style={chipStyle(topic === null)}>All · {CONCEPT_CARDS.length}</button>
        {TOPICS.filter((t) => countOf(t) > 0).map((t) => (
          <button key={t} onClick={() => setTopic(t)} style={chipStyle(topic === t)}>{t} · {countOf(t)}</button>
        ))}
      </div>

      <div ref={top} className="mc-grid">
        {paged.items.map((c) => (
          <button key={c.id} type="button" className="mc-card" onClick={() => setOpenId(c.id)}>
            <span className="mc-topic">{c.topic}</span>
            <span className="mc-title">{c.title}</span>
            <span className="mc-idea">{c.oneLineIdea}</span>
            <span className="mc-foot">
              <span>Quick check inside</span>
              {c.labSlug && <span className="mc-lab">Has a Lab</span>}
              <span className="mc-go">Read →</span>
            </span>
          </button>
        ))}
      </div>
      <Pager paged={paged} accent={ACCENT} noun="cards" scrollTo={top} />

      <Dialog
        open={Boolean(openCard)}
        onClose={close}
        label={openCard?.title ?? "Concept card"}
        footer={openCard && (
          <>
            <button type="button" className="mc-nav" disabled={openIndex <= 0} onClick={() => setOpenId(filtered[openIndex - 1].id)}>← Previous</button>
            <span style={{ fontSize: 12.5, color: "#64748b", fontVariantNumeric: "tabular-nums" }}>{openIndex + 1} of {filtered.length}</span>
            <button type="button" className="mc-nav" disabled={openIndex >= filtered.length - 1} onClick={() => setOpenId(filtered[openIndex + 1].id)}>Next →</button>
          </>
        )}
      >
        {openCard && <ConceptCardView key={openCard.id} card={openCard} bare />}
      </Dialog>
    </div>
  );
}

function chipStyle(active: boolean): CSSProperties {
  return {
    padding: "6px 14px", borderRadius: 999, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
    border: `1.5px solid ${active ? ACCENT : "#e2e8f0"}`, background: active ? `${ACCENT}15` : "#fff", color: active ? ACCENT : "#475569",
  };
}
