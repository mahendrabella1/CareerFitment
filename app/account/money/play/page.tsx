import { MoneyLifeSim } from "@/components/money/MoneyLifeSim";

export default function MoneyPlayPage() {
  return (
    <div style={{ maxWidth: 1040 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea05f", textTransform: "uppercase", letterSpacing: ".08em" }}>Money Life simulation</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 10px" }}>Live a year with your money</h1>
      <MoneyLifeSim />
    </div>
  );
}
