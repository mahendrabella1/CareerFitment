import { SopHelper } from "@/components/studyAbroad/SopHelper";

export default function AbroadSopPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Apply</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>SOP and LOR helper</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        A strong statement of purpose is specific: your goal, your evidence, and why this exact programme. Draft it here and get feedback on structure and clarity.
      </p>
      <SopHelper />
    </div>
  );
}
