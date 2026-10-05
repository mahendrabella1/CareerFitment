import Link from "next/link";
import { RoiCalculator } from "@/components/studyAbroad/RoiCalculator";

export default function RoiPage() {
  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad" style={{ color: "#999", textDecoration: "none" }}>← Study Abroad</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>ROI calculator</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>Check the real numbers before you apply, not after an offer letter arrives.</p>
      <RoiCalculator />
    </div>
  );
}
