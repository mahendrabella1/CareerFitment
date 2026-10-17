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
          <section id="situation" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "18px 18px 14px", scrollMarginTop: 110 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 10 }}>Start with your situation</div>
            <Navigator />
          </section>
        }
      />
    </LegalShell>
  );
}
