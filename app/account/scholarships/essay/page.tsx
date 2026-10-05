import { EssayHelper } from "@/components/scholarships/EssayHelper";

export default function ScholarshipEssayPage() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: ".08em" }}>Application studio</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Essay and statement helper</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        Most scholarships ask the same few questions. Prepare strong answers once, in your own words, then adapt them for each application.
      </p>
      <EssayHelper />
    </div>
  );
}
