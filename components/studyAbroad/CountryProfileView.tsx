import type { CountryProfile } from "@/data/studyAbroad/countries";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

const FACT_ROWS: { key: keyof CountryProfile; label: string }[] = [
  { key: "tuitionPerYearApprox", label: "Typical tuition / year (approx.)" },
  { key: "livingFundsNote", label: "Proof of living funds" },
  { key: "workWhileStudying", label: "Work while studying" },
  { key: "postStudyWork", label: "Post-study work" },
  { key: "mainIntakes", label: "Main intakes" },
  { key: "testsNeeded", label: "Tests usually needed" },
  { key: "settlementPathway", label: "Settlement pathway" },
  { key: "dependants", label: "Dependants" },
  { key: "costOfLivingNote", label: "Cost of living" },
  { key: "safetyNote", label: "Safety & community" },
];

export function CountryProfileView({ country }: { country: CountryProfile }) {
  return (
    <div>
      <PageHeader back={{ href: "/account/study-abroad/countries", label: "Compare countries" }} icon="globe" eyebrow="Country profile" title={country.name} />

      {country.whatChanged.length > 0 && (
        <div style={{ border: `2px solid ${ACCENT}`, background: `${ACCENT}0a`, borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: ".05em", textTransform: "uppercase", color: ACCENT, marginBottom: 8 }}>What changed in the last 12 months</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {country.whatChanged.map((c, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>{new Date(c.date + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{c.title}</div>
                <p style={{ fontSize: 12.5, color: "#334155", margin: "2px 0 0", lineHeight: 1.5 }}>{c.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {FACT_ROWS.map((row) => (
          <div key={row.key} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: "11px 13px" }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>{row.label}</div>
            <div style={{ fontSize: 12.5, color: "#1e293b", marginTop: 3, lineHeight: 1.5 }}>{country[row.key] as string}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", marginBottom: 6 }}>Official links</div>
        {country.officialLinks.map((l) => (
          <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ display: "block", fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none", marginBottom: 4 }}>{l.label} ↗</a>
        ))}
      </div>

      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 16, fontStyle: "italic" }}>Figures are typical ranges, not quotes - confirm exact numbers with the university and official immigration site before deciding.</p>
    </div>
  );
}
