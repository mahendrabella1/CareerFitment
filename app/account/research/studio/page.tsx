import Link from "next/link";
import { STUDIO_UNITS } from "@/data/research/studioUnits";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#7c3aed";

export default function StudioListPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="book" eyebrow="Research Studio" title="Eight short units"
        subtitle="No quiz - the real assessment is your own abstract, poster and talk, checked by a mentor." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 10 }}>
        {STUDIO_UNITS.map((u) => (
          <Link key={u.slug} href={`/account/research/studio/${u.slug}`} className="fx-lift" style={{ textDecoration: "none", borderRadius: 12 }}>
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
