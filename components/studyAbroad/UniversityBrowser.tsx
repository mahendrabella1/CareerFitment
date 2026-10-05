"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { UNIVERSITIES, RANKING_PUBLISHERS, type UniversityDef } from "@/data/studyAbroad/universities";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { loadPlan, newItem, savePlan } from "@/lib/studyAbroad/shortlist";

const ACCENT = "#7c3aed";

export function SaveToShortlistButton({ uni }: { uni: UniversityDef }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(loadPlan().items.some((i) => i.universitySlug === uni.slug));
  }, [uni.slug]);
  return (
    <button
      onClick={() => {
        const plan = loadPlan();
        if (!plan.items.some((i) => i.universitySlug === uni.slug)) {
          plan.items.push(newItem({ universitySlug: uni.slug, universityName: uni.name, countryCode: uni.countryCode }));
          savePlan(plan);
        }
        setSaved(true);
      }}
      style={{ fontSize: 12.5, fontWeight: 800, color: saved ? "#fff" : ACCENT, background: saved ? ACCENT : "#fff", border: `1px solid ${ACCENT}`, borderRadius: 9, padding: "7px 12px", cursor: "pointer" }}
    >
      {saved ? "On my shortlist ✓" : "Add to my shortlist"}
    </button>
  );
}

export function UniversityBrowser() {
  const [country, setCountry] = useState<string>("all");
  const list = UNIVERSITIES.filter((u) => country === "all" || u.countryCode === country);
  const countries = Array.from(new Set(UNIVERSITIES.map((u) => u.countryCode)));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => setCountry("all")} style={chip(country === "all")}>All ({UNIVERSITIES.length})</button>
        {countries.map((c) => {
          const meta = STUDY_ABROAD_COUNTRIES.find((x) => x.code === c);
          return (
            <button key={c} onClick={() => setCountry(c)} style={chip(country === c)}>
              {meta?.flag} {meta?.name ?? c} ({UNIVERSITIES.filter((u) => u.countryCode === c).length})
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {list.map((u) => {
          const meta = STUDY_ABROAD_COUNTRIES.find((x) => x.code === u.countryCode);
          return (
            <article key={u.slug} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", background: "#fff", display: "flex", flexDirection: "column", gap: 6 }}>
              <Link href={`/account/study-abroad/universities/${u.slug}`} style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", textDecoration: "none", lineHeight: 1.35 }}>{u.name}</Link>
              <div style={{ fontSize: 12.5, color: "#64748b" }}>{meta?.flag} {u.city} · {u.type === "public" ? "Public" : "Private"}</div>
              {u.tuitionNote && <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.5 }}>{u.tuitionNote.split(". ")[0]}.</div>}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: "auto", paddingTop: 6 }}>
                <SaveToShortlistButton uni={u} />
                <Link href={`/account/study-abroad/universities/${u.slug}`} style={{ fontSize: 12.5, fontWeight: 700, color: ACCENT, textDecoration: "none", padding: "7px 4px" }}>Details →</Link>
              </div>
            </article>
          );
        })}
      </div>

      <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
        These are examples to start your research, not recommendations, and no university pays to appear here. Rankings change every year; check the current edition and its year on{" "}
        {RANKING_PUBLISHERS.map((r, i) => (
          <span key={r.url}>
            {i > 0 && " and "}
            <a href={r.url} target="_blank" rel="noreferrer" style={{ color: ACCENT, fontWeight: 700 }}>{r.label} ↗</a>
          </span>
        ))}
        , and never choose on one ranking alone.
      </p>
    </div>
  );
}

const chip = (on: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: on ? "#fff" : "#334155",
  background: on ? ACCENT : "#fff",
  border: `1px solid ${on ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 12px",
  cursor: "pointer",
});
