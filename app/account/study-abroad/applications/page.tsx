import { AbroadApplications } from "@/components/studyAbroad/AbroadApplications";

export default function AbroadApplicationsPage() {
  return (
    <div style={{ maxWidth: 940 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Apply</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Shortlist and applications</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700 }}>
        Label each programme reach, match or safe by comparing yourself with its typical admitted student, track every application from drafting to offer, then compare offers on the full cost.
      </p>
      <AbroadApplications />
    </div>
  );
}
