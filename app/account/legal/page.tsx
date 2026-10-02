import Link from "next/link";
import { LegalShell, LEGAL_ACCENT as ACCENT } from "@/components/legal/LegalShell";
import { Navigator } from "@/components/legal/Navigator";

export default function LegalHomePage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
        <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
          <Link href="/account" style={{ color: "#999", textDecoration: "none" }}>← Dashboard</Link>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>⚖️ Legal Resources & Rights</h1>
        <p style={{ color: "#666", margin: "0 0 24px", fontSize: 14 }}>
          Answer a couple of quick questions and we'll point you to the right guide, steps and helpline - in about three taps.
        </p>

        <Navigator />

        <div style={{ marginTop: 32, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/account/legal/guides" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Browse all guides →</Link>
          <Link href="/account/legal/help" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Emergency & help directory →</Link>
        </div>
      </div>
    </LegalShell>
  );
}
