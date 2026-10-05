import { LegalShell } from "@/components/legal/LegalShell";
import { LegalToolkit } from "@/components/legal/LegalToolkit";

export default function LegalToolkitPage() {
  return (
    <LegalShell>
      <div style={{ maxWidth: 820 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".08em" }}>Get organised</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 14px" }}>Evidence, timeline and deadlines</h1>
        <LegalToolkit />
      </div>
    </LegalShell>
  );
}
