"use client";

/**
 * Wraps every page in this section with the SOS bar (always visible, per
 * the spec's own "never waits behind other screens" rule) and the quick
 * exit button. One shared shell instead of repeating both on every page.
 */
import { HELP_CONTACTS } from "@/data/legal/helpContacts";

const ACCENT = "#6366f1";

function QuickExit() {
  return (
    <button
      onClick={() => window.location.replace("https://www.google.com")}
      style={{
        position: "fixed", right: 16, top: 16, zIndex: 50, borderRadius: 999, border: "none",
        background: "#dc2626", color: "#fff", fontSize: 12.5, fontWeight: 800, padding: "9px 16px", cursor: "pointer",
        boxShadow: "0 4px 12px rgba(220,38,38,.35)",
      }}
    >
      Quick exit
    </button>
  );
}

function SosBar() {
  const emergency = HELP_CONTACTS.find((c) => c.slug === "emergency");
  const child = HELP_CONTACTS.find((c) => c.slug === "child");
  const women = HELP_CONTACTS.find((c) => c.slug === "women");
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 40, background: "#1e1b4b", color: "#fff", padding: "8px 16px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", fontSize: 12.5 }}>
      <span style={{ fontWeight: 900, letterSpacing: ".04em" }}>IN DANGER NOW?</span>
      <a href={`tel:${emergency?.number}`} style={{ color: "#fff", fontWeight: 800, textDecoration: "none" }}>Call {emergency?.number} - Any emergency</a>
      <a href={`tel:${child?.number}`} style={{ color: "#c7d2fe", textDecoration: "none" }}>{child?.number} - Child helpline</a>
      <a href={`tel:${women?.number}`} style={{ color: "#c7d2fe", textDecoration: "none" }}>{women?.number} - Women's helpline</a>
    </div>
  );
}

export function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh" }}>
      <SosBar />
      <QuickExit />
      {children}
    </div>
  );
}

export { ACCENT as LEGAL_ACCENT };
