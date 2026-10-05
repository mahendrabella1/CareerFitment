"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { SCHOLARSHIPS } from "@/data/scholarships/scholarships";
import { StatusChip } from "@/components/scholarships/StatusChip";

const ACCENT = "#7c3aed";

type Dest = "any" | "US" | "UK" | "DE" | "EU";
type Level = "master" | "phd";

/**
 * Matching attributes for the study-abroad scholarships. The scholarship
 * facts themselves live in data/scholarships/scholarships.ts (checked
 * 2026-10-03); this only records where and for what level each one applies.
 */
const META: Record<string, { dest: Dest[]; levels: Level[]; minWorkYears: number; gate: string }> = {
  chevening: { dest: ["UK"], levels: ["master"], minWorkYears: 2, gate: "At least 2,800 hours (about two years) of work experience, three course choices, and returning home for two years." },
  "commonwealth-scholarship": { dest: ["UK"], levels: ["master"], minWorkYears: 0, gate: "Nomination by India's Ministry of Education as well as the CSC application; for people who could not otherwise afford UK study." },
  "daad-scholarships": { dest: ["DE"], levels: ["master", "phd"], minWorkYears: 0, gate: "Programme-specific: development-related master's (EPOS) usually need about two years of work experience; doctoral grants need a research plan." },
  "erasmus-mundus": { dest: ["EU"], levels: ["master"], minWorkYears: 0, gate: "Apply to each joint master's directly; most deadlines fall between October and February." },
  "fulbright-nehru-masters": { dest: ["US"], levels: ["master"], minWorkYears: 3, gate: "Three years of full-time paid work experience and a bachelor's with at least 55%." },
  "jn-tata-endowment": { dest: ["any"], levels: ["master", "phd"], minWorkYears: 0, gate: "A loan scholarship, repaid after the course; needs an admission offer and an interview." },
  "kc-mahindra-pg-abroad": { dest: ["any"], levels: ["master", "phd"], minWorkYears: 0, gate: "First-class degree and enrolment in a PG programme abroad; an interest-free loan scholarship." },
  "inlaks-scholarship": { dest: ["any"], levels: ["master", "phd"], minWorkYears: 0, gate: "Age 30 or under, a high first-class degree, an offer from an eligible top university; not for engineering, computer science, business, medicine or public health." },
};

const DEST_LABEL: Record<Dest, string> = { any: "Any country", US: "USA", UK: "UK", DE: "Germany", EU: "Europe (several countries)" };

export function AbroadScholarshipFinder() {
  const [dest, setDest] = useState<Dest | "all">("all");
  const [level, setLevel] = useState<Level>("master");
  const [work, setWork] = useState(0);

  const list = SCHOLARSHIPS.filter((s) => s.type === "abroad" && META[s.slug]);
  const matches = list.filter((s) => {
    const m = META[s.slug];
    const destOk = dest === "all" || m.dest.includes(dest) || m.dest.includes("any") || (dest === "DE" && m.dest.includes("EU"));
    return destOk && m.levels.includes(level) && work >= m.minWorkYears;
  });
  const almost = list.filter((s) => !matches.includes(s) && META[s.slug].levels.includes(level) && (dest === "all" || META[s.slug].dest.includes(dest as Dest) || META[s.slug].dest.includes("any")) && work < META[s.slug].minWorkYears);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <label style={label}>Where do you want to study?
            <select value={dest} onChange={(e) => setDest(e.target.value as Dest | "all")} style={input}>
              <option value="all">Not decided</option>
              <option value="US">USA</option>
              <option value="UK">UK</option>
              <option value="DE">Germany</option>
              <option value="EU">Elsewhere in Europe</option>
            </select>
          </label>
          <label style={label}>Level
            <select value={level} onChange={(e) => setLevel(e.target.value as Level)} style={input}>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </label>
          <label style={label}>Full-time work experience (years)
            <input type="number" min={0} max={40} step={0.5} value={work} onChange={(e) => setWork(Math.max(0, Number(e.target.value) || 0))} style={input} />
          </label>
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>{matches.length} scholarship{matches.length === 1 ? "" : "s"} you can aim for</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {matches.map((s) => (
            <article key={s.slug} style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                <Link href={`/account/scholarships/${s.slug}`} style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", textDecoration: "none", flex: "1 1 240px", minWidth: 0 }}>{s.name}</Link>
                <StatusChip scholarship={s} />
              </div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>{META[s.slug].dest.map((d) => DEST_LABEL[d]).join(", ")} · {s.amountText}</div>
              <div style={{ fontSize: 13, color: "#334155", marginTop: 4, lineHeight: 1.55 }}><b>Gate to check:</b> {META[s.slug].gate}</div>
              <div style={{ fontSize: 12.5, color: "#475569", marginTop: 4 }}>{s.deadlineNote}</div>
              <a href={s.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 800, color: ACCENT }}>Official site ↗</a>
            </article>
          ))}
          {matches.length === 0 && <p style={pText}>No match with these filters. Try "Not decided" or check the scholarships that need more work experience below.</p>}
        </div>
      </section>

      {almost.length > 0 && (
        <section style={panel}>
          <h2 style={h2}>Need more work experience first</h2>
          {almost.map((s) => (
            <p key={s.slug} style={pText}><b>{s.name}</b>: needs about {META[s.slug].minWorkYears} years. {META[s.slug].gate}</p>
          ))}
        </section>
      )}

      <section style={panel}>
        <h2 style={h2}>Don&apos;t miss university scholarships</h2>
        <p style={pText}>
          Most international students who get funding get it from the university itself: partial tuition waivers and merit awards, some of them automatic with the offer. Check the international scholarships page of every university on your shortlist, and note each deadline in your <Link href="/account/study-abroad/applications" style={{ color: ACCENT, fontWeight: 800 }}>application tracker</Link>.
        </p>
      </section>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
