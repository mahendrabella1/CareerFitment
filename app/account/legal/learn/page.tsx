import { LegalShell } from "@/components/legal/LegalShell";
import { ScenarioCards } from "@/components/legal/ScenarioCards";

export default function LegalLearnPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 820 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".08em" }}>Learn before you need it</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 10px" }}>What would you do?</h1>
        <ScenarioCards />
      </div>
    </LegalShell>
  );
}
