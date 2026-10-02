import Link from "next/link";
import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { HELP_CONTACTS, ONLINE_PORTALS } from "@/data/legal/helpContacts";

export default function LegalHelpPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
          <Link href="/account/legal" style={{ color: "#999", textDecoration: "none" }}>← Legal Resources</Link>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Emergency & help directory</h1>
        <p style={{ color: "#666", margin: "0 0 22px", fontSize: 14 }}>Real, national, government-run numbers - free to call.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
          {HELP_CONTACTS.map((c) => (
            <div key={c.slug} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{c.name}</span>
                {c.number && <a href={`tel:${c.number}`} style={{ fontSize: 16, fontWeight: 900, color: ACCENT, textDecoration: "none" }}>{c.number}</a>}
              </div>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0" }}>{c.note}{c.hours ? ` · ${c.hours}` : ""}</p>
              {c.url && <a href={c.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: ACCENT, fontWeight: 700, textDecoration: "none" }}>Visit site ↗</a>}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Online portals</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ONLINE_PORTALS.map((p) => (
            <a key={p.url} href={p.url} target="_blank" rel="noreferrer" style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 16px", textDecoration: "none" }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: ACCENT }}>{p.name} ↗</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{p.note}</div>
            </a>
          ))}
        </div>
      </div>
    </LegalShell>
  );
}
