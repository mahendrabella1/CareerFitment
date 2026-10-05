import { ResearchProfileEditor } from "@/components/research/ResearchProfileEditor";

export default function ResearchProfilePage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Show your work</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Research profile</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        A simple public page with the projects you choose to share, and a QR code for your poster. You decide what appears, and you can make it private again at any time.
      </p>
      <ResearchProfileEditor />
    </div>
  );
}
