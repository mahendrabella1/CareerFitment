import Link from "next/link";
import { MbbsNmcChecklist } from "@/components/studyAbroad/MbbsNmcChecklist";

export default function StudyAbroadSafetyPage() {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad" style={{ color: "#999", textDecoration: "none" }}>← Study Abroad</Link>
      </div>
      <MbbsNmcChecklist />
    </div>
  );
}
