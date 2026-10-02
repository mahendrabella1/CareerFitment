import Link from "next/link";
import { CountryComparison } from "@/components/studyAbroad/CountryComparison";

export default function CountriesComparePage() {
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad" style={{ color: "#999", textDecoration: "none" }}>← Study Abroad</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Compare countries</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>Pick up to 4 destinations to compare side by side.</p>
      <CountryComparison />
    </div>
  );
}
