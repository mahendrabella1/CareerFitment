/**
 * The screen behind app/error.tsx, app/global-error.tsx and app/not-found.tsx -
 * the same warm off-white, ink and small corners as the sign-in page. It never
 * shows the error's message or stack (code-quality audit Q-06); a reference
 * (Next's error digest) is enough for support to find it in the server log.
 */
import type { ReactNode } from "react";

const INK = "#16181d";

export function ErrorScreen({ title, text, reference, children }: { title: string; text: string; reference?: string; children?: ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", background: "#fbfaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK }}>
      <div role="alert" style={{ width: "100%", maxWidth: 440, background: "#fff", border: "1px solid #e8e5df", borderRadius: 10, padding: "30px 28px", boxShadow: "0 18px 50px rgba(22,24,29,.08)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "#db3433", marginBottom: 10 }}>OneGrasp</div>
        <h1 style={{ fontFamily: "Poppins, Inter, sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: "-.015em", margin: "0 0 8px" }}>{title}</h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#4a4f59", margin: "0 0 20px" }}>{text}</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{children}</div>
        {reference && <p style={{ fontSize: 12, color: "#8a8f99", margin: "18px 0 0" }}>If it keeps happening, write to support@onegrasp.com and quote: {reference}</p>}
      </div>
    </main>
  );
}

export const primaryButton = { display: "inline-flex", alignItems: "center", height: 42, padding: "0 18px", borderRadius: 6, border: "none", background: INK, color: "#fff", fontSize: 14.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" } as const;
export const secondaryButton = { ...primaryButton, background: "#fff", color: INK, border: "1px solid #d9d5cd" } as const;
