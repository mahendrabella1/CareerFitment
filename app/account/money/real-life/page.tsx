import { RealLifeSim } from "@/components/money/RealLifeSim";

export default function RealLifePage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea05f", textTransform: "uppercase", letterSpacing: ".08em" }}>Money Life · Real Life world</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 10px" }}>Fast-forward ten years</h1>
      <RealLifeSim />
    </div>
  );
}
