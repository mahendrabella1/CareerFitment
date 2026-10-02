import Link from "next/link";
import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { LEGAL_GUIDES } from "@/data/legal/guides";

export default function LegalGuidesPage() {
  const byArea = new Map<string, typeof LEGAL_GUIDES>();
  for (const g of LEGAL_GUIDES) {
    if (!byArea.has(g.area)) byArea.set(g.area, []);
    byArea.get(g.area)!.push(g);
  }

  return (
    <LegalShell>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
          <Link href="/account/legal" style={{ color: "#999", textDecoration: "none" }}>← Legal Resources</Link>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>All guides</h1>
        <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>More guides are being added over time - these are the first {LEGAL_GUIDES.length}, each drafted from real, named laws and flagged for a lawyer's review.</p>

        {[...byArea.entries()].map(([area, guides]) => (
          <div key={area} style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 8 }}>{area}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {guides.map((g) => (
                <Link key={g.slug} href={`/account/legal/guides/${g.slug}`} style={{ textDecoration: "none" }}>
                  <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{g.title}</div>
                    <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 3 }}>{g.oneLine}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LegalShell>
  );
}
