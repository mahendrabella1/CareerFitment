"use client";

/**
 * Wraps every page in this section with the SOS bar (always visible, per
 * the spec's own "never waits behind other screens" rule) and the quick
 * exit button. One shared shell instead of repeating both on every page.
 */
import { HELP_CONTACTS } from "@/data/legal/helpContacts";

const ACCENT = "#6366f1";

// The SOS bar sticks just under the feature shell's top bar (--bar). Quick
// exit rides at its right end on wide screens, and sits bottom-right on
// phones and tablets, where it stays within thumb reach.
const CSS = `
.lg-sos{position:sticky;top:var(--bar,0px);z-index:30;background:#1e1b4b;color:#fff;padding:8px 10px 8px 16px;border-radius:10px;display:flex;align-items:center;gap:8px 16px;flex-wrap:wrap;font-size:12.5px}
.lg-quickexit{margin-left:auto;border-radius:999px;border:none;background:#dc2626;color:#fff;font:inherit;font-size:12.5px;font-weight:700;padding:7px 14px;cursor:pointer}
.lg-quickexit:hover{background:#b91c1c}
@media (max-width:1023px){.lg-quickexit{position:fixed;right:16px;bottom:16px;z-index:50;padding:10px 18px;box-shadow:0 4px 12px rgba(220,38,38,.35)}}
`;

function SosBar() {
  const emergency = HELP_CONTACTS.find((c) => c.slug === "emergency");
  const child = HELP_CONTACTS.find((c) => c.slug === "child");
  const women = HELP_CONTACTS.find((c) => c.slug === "women");
  return (
    <div className="lg-sos">
      <span style={{ fontWeight: 800, letterSpacing: ".04em" }}>IN DANGER NOW?</span>
      <a href={`tel:${emergency?.number}`} style={{ color: "#fff", fontWeight: 700, textDecoration: "none" }}>Call {emergency?.number} - Any emergency</a>
      <a href={`tel:${child?.number}`} style={{ color: "#c7d2fe", textDecoration: "none" }}>{child?.number} - Child helpline</a>
      <a href={`tel:${women?.number}`} style={{ color: "#c7d2fe", textDecoration: "none" }}>{women?.number} - Women's helpline</a>
      <button className="lg-quickexit" onClick={() => window.location.replace("https://www.google.com")}>Quick exit</button>
    </div>
  );
}

export function LegalShell({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SosBar />
      <div style={{ paddingTop: 20 }}>{children}</div>
    </div>
  );
}

export { ACCENT as LEGAL_ACCENT };
