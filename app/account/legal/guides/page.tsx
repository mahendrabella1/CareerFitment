import Link from "next/link";
import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { LEGAL_AREAS, LEGAL_GUIDES, type AgeBand } from "@/data/legal/guides";

const AGE_LABEL: Record<AgeBand, string> = { SCHOOL: "School", COLLEGE: "College", WORKING: "Working", SENIOR: "60+" };

export default function LegalGuidesPage() {
  const known = new Set<string>(LEGAL_AREAS);
  const areas = [...LEGAL_AREAS, ...Array.from(new Set(LEGAL_GUIDES.map((g) => g.area).filter((a) => !known.has(a))))];

  return (
    <LegalShell>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
          <Link href="/account/legal" style={{ color: "#999", textDecoration: "none" }}>← Legal Resources</Link>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>All {LEGAL_GUIDES.length} guides</h1>
        <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14, lineHeight: 1.6 }}>
          Organised by life area. Each guide is drafted from real, named laws and official sources, and is flagged for a lawyer&apos;s review before it can be relied on.
        </p>

        {areas.map((area) => {
          const guides = LEGAL_GUIDES.filter((g) => g.area === area).sort((a, b) => a.number - b.number);
          if (!guides.length) return null;
          return (
            <div key={area} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>{area}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {guides.map((g) => (
                  <Link key={g.slug} href={`/account/legal/guides/${g.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                          <span style={{ color: "#94a3b8", fontWeight: 800, marginRight: 6 }}>{g.number}.</span>
                          {g.title}
                        </div>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {g.ageBands.map((b) => (
                            <span key={b} style={{ fontSize: 10.5, fontWeight: 700, color: "#475569", background: "#f1f5f9", borderRadius: 999, padding: "2px 8px" }}>{AGE_LABEL[b]}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4, lineHeight: 1.5 }}>{g.oneLine}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </LegalShell>
  );
}
