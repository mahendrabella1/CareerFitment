import { HabitsTracker } from "@/components/money/HabitsTracker";

export default function MoneyHabitsPage() {
  return (
    <div style={{ maxWidth: 820 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea05f", textTransform: "uppercase", letterSpacing: ".08em" }}>Real money habits</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 10px" }}>Track what you really spend</h1>
      <HabitsTracker />
    </div>
  );
}
