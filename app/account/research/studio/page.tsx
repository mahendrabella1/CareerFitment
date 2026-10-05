import Link from "next/link";
import { STUDIO_UNITS } from "@/data/research/studioUnits";

const ACCENT = "#7c3aed";

export default function StudioListPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <Link href="/account/research" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Research & Conferences</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>📚 Research Studio</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 20px" }}>8 short units - no quiz. The real assessment is your own abstract, poster and talk, checked by a mentor.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {STUDIO_UNITS.map((u) => (
          <Link key={u.slug} href={`/account/research/studio/${u.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, background: "#fff", height: "100%", boxSizing: "border-box" }}>
              <span style={{ width: 28, height: 28, borderRadius: "50%", background: `${ACCENT}15`, color: ACCENT, fontWeight: 800, fontSize: 13, display: "grid", placeItems: "center", flex: "none" }}>{u.unit}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14.5, color: "#1a1a1a" }}>{u.title}</div>
                <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>Supports: {u.stepTitle}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
