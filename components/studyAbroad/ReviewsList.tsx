"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Pager, usePaged } from "@/components/ui/Pager";
import { REVIEW_AREAS, fetchPublishedReviews, type PublishedReview } from "@/lib/studyAbroad/clientReviews";

const ACCENT = "#7c3aed";

export function ReviewsList() {
  const [reviews, setReviews] = useState<PublishedReview[] | null | undefined>(undefined);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchPublishedReviews().then(setReviews);
  }, []);

  const shown = (reviews ?? []).filter((r) => !filter || `${r.universityName} ${r.programme}`.toLowerCase().includes(filter.toLowerCase()));
  const paged = usePaged(shown, 6, filter);
  const top = useRef<HTMLDivElement | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={{ ...panel, background: "#faf5ff", borderColor: "#ddd6fe" }}>
        <h2 style={h2}>How reviews work here</h2>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
          <li>Every review comes from a verified student or graduate. Proof documents are checked by staff and then deleted.</li>
          <li>Good and bad experiences are published alike. Personal attacks, personal data and hate speech are removed; factual complaints stay.</li>
          <li>Universities can post one public reply but cannot edit or remove a review. No university or agent can pay to promote or hide reviews.</li>
          <li>We never pay for positive reviews.</li>
        </ul>
        <Link href="/account/study-abroad/reviews/new" style={{ display: "inline-block", marginTop: 10, fontSize: 13.5, fontWeight: 800, color: "#fff", background: ACCENT, borderRadius: 10, padding: "9px 14px", textDecoration: "none" }}>Write a verified review</Link>
      </section>

      {reviews === undefined && <p style={pText}>Loading reviews…</p>}
      {reviews === null && <p style={pText}>Reviews could not be loaded right now. Please try again later.</p>}
      {reviews && reviews.length === 0 && (
        <section style={panel}>
          <h2 style={h2}>No verified reviews yet</h2>
          <p style={pText}>We only show reviews we have verified, so this list starts empty. If you study or studied abroad, your honest review helps the next student decide.</p>
        </section>
      )}
      {reviews && reviews.length > 0 && (
        <>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Filter by university or programme" style={{ padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, maxWidth: 420, background: "#fff", color: "#0f172a" }} />
          <div ref={top} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 14, scrollMarginTop: 80 }}>
          {paged.items.map((r) => {
            const avg = REVIEW_AREAS.reduce((s, a) => s + (r.ratings[a.key] ?? 0), 0) / REVIEW_AREAS.length;
            return (
              <article key={r.id} style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{r.universityName} · {r.programme}</div>
                    <div style={{ fontSize: 12.5, color: "#64748b" }}>{r.displayName} · {r.badge}{r.yearStarted ? ` · started ${r.yearStarted}` : ""}</div>
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 900, color: ACCENT }}>{avg.toFixed(1)} / 5</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  {REVIEW_AREAS.map((a) => (
                    <div key={a.key} style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55 }}>
                      <b>{a.label}: {r.ratings[a.key] ?? "–"}/5.</b> {r.answers[a.key]}
                    </div>
                  ))}
                  {r.advice && <div style={{ fontSize: 13.5, color: "#0f172a", fontStyle: "italic" }}>&quot;{r.advice}&quot;</div>}
                </div>
              </article>
            );
          })}
          </div>
          <Pager paged={paged} accent={ACCENT} noun="reviews" scrollTo={top} />
        </>
      )}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
