import Link from "next/link";
import { LABS } from "@/data/money/labs";

export default function LabsPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <Link href="/account/money" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Financial Literacy</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>🧮 Money Labs</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 24px" }}>Move the sliders, watch the numbers change. Every rate is labelled as an assumption, and each lab shows how it is calculated.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
        {LABS.map((l) => (
          <Link key={l.slug} href={`/account/money/labs/${l.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14, background: "#fff", height: "100%", boxSizing: "border-box" }}>
              <span style={{ fontSize: 26 }}>{l.icon}</span>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{l.title}</div>
                <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{l.desc}</div>
                <div style={{ fontSize: 11.5, color: "#0ea05f", fontWeight: 700, marginTop: 4 }}>{l.worlds}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
