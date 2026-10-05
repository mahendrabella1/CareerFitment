import { LegalShell } from "@/components/legal/LegalShell";
import { Navigator } from "@/components/legal/Navigator";
import { CourseLanding } from "@/components/course/CourseLanding";
import { LEGAL_COURSE } from "@/data/courses/legal";

export default function LegalHomePage() {
  return (
    <LegalShell>
      <CourseLanding
        content={LEGAL_COURSE}
        topSlot={
          <section style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 18px 14px" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 10 }}>Start with your situation</div>
            <Navigator />
          </section>
        }
      />
    </LegalShell>
  );
}
