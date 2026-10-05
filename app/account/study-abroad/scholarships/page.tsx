import { AbroadScholarshipFinder } from "@/components/studyAbroad/AbroadScholarshipFinder";

export default function AbroadScholarshipsPage() {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Money</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Scholarship finder</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700 }}>
        The major study-abroad scholarships for Indian students, matched to where you want to go, your level and your work experience. Each one shows this cycle&apos;s status and the one requirement people most often miss.
      </p>
      <AbroadScholarshipFinder />
    </div>
  );
}
