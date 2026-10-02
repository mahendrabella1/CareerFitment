"use client";

import { useState } from "react";
import Link from "next/link";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";

const ACCENT = "#7c3aed";
const ROWS: { key: "tuitionPerYearApprox" | "postStudyWork" | "workWhileStudying" | "settlementPathway" | "testsNeeded"; label: string }[] = [
  { key: "tuitionPerYearApprox", label: "Tuition / year" },
  { key: "workWhileStudying", label: "Work while studying" },
  { key: "postStudyWork", label: "Post-study work" },
  { key: "settlementPathway", label: "Settlement pathway" },
  { key: "testsNeeded", label: "Tests needed" },
];

export function CountryComparison() {
  const [selected, setSelected] = useState<string[]>(["US", "CA", "UK"]);

  function toggle(code: string) {
    setSelected((s) => (s.includes(code) ? s.filter((c) => c !== code) : s.length < 4 ? [...s, code] : s));
  }

  const countries = STUDY_ABROAD_COUNTRIES.filter((c) => selected.includes(c.code));

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
        {STUDY_ABROAD_COUNTRIES.map((c) => (
          <button
            key={c.code} onClick={() => toggle(c.code)}
            style={{
              fontSize: 12.5, fontWeight: 700, padding: "7px 13px", borderRadius: 999, cursor: "pointer",
              border: `1px solid ${ACCENT}`, background: selected.includes(c.code) ? ACCENT : "#fff", color: selected.includes(c.code) ? "#fff" : ACCENT,
            }}
          >
            {c.flag} {c.name}
          </button>
        ))}
      </div>

      {countries.length === 0 ? (
        <p style={{ fontSize: 13, color: "#64748b" }}>Pick up to 4 countries to compare.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, color: "#64748b", borderBottom: "2px solid #e2e8f0" }}></th>
                {countries.map((c) => (
                  <th key={c.code} style={{ textAlign: "left", padding: "8px 10px", fontSize: 12.5, fontWeight: 800, color: "#0f172a", borderBottom: "2px solid #e2e8f0" }}>
                    <Link href={`/account/study-abroad/countries/${c.code}`} style={{ color: "#0f172a", textDecoration: "none" }}>{c.flag} {c.name}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.key}>
                  <td style={{ padding: "9px 10px", fontSize: 11.5, fontWeight: 700, color: "#64748b", borderBottom: "1px solid #f1f5f9" }}>{row.label}</td>
                  {countries.map((c) => (
                    <td key={c.code} style={{ padding: "9px 10px", fontSize: 12, color: "#334155", borderBottom: "1px solid #f1f5f9" }}>{c[row.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
