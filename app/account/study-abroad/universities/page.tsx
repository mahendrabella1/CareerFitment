import { UniversityBrowser } from "@/components/studyAbroad/UniversityBrowser";

export default function UniversitiesPage() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Research</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Universities</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700 }}>
        Judge fit and value, not just rank: the programme, total cost, location, job outcomes and your chance of admission matter more for most students. Add universities to your shortlist, then classify each programme as reach, match or safe.
      </p>
      <UniversityBrowser />
    </div>
  );
}
