"use client";

import Link from "next/link";
import { MOCK_TESTS } from "@/data/exams/mocks";
import { EXAMS } from "@/data/exams/exams";
import { useMockAttempts } from "@/components/exams/MockTestRunner";

const ACCENT = "#2563eb";

export function MockIndex() {
  const attempts = useMockAttempts();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
      {MOCK_TESTS.map((m) => {
        const exam = EXAMS.find((e) => e.slug === m.examSlug);
        const mine = attempts.filter((a) => a.mockId === m.id);
        const best = mine.length ? Math.max(...mine.map((a) => a.score)) : null;
        const max = m.questions.length * m.marking.correct;
        return (
          <article key={m.id} className="fx-lift" style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px", background: "#fff", display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".05em" }}>{exam?.name ?? m.examSlug}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", lineHeight: 1.35 }}>{m.title}</div>
            <div style={{ fontSize: 12.5, color: "#64748b" }}>{m.questions.length} questions · {m.minutes} min · +{m.marking.correct} / {m.marking.wrong}</div>
            <div style={{ fontSize: 12.5, color: "#334155", fontWeight: 700 }}>{best === null ? "Not taken yet" : `Best ${best} / ${max} · ${mine.length} attempt${mine.length === 1 ? "" : "s"}`}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 6, flexWrap: "wrap" }}>
              <Link href={`/account/exams/mocks/${m.id}`} style={{ fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, borderRadius: 9, padding: "8px 13px", textDecoration: "none" }}>{best === null ? "Start" : "Retake"}</Link>
              <Link href={`/account/exams/${m.examSlug}/plan`} style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none", padding: "8px 4px" }}>Study plan →</Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
