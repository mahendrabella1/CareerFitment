import Link from "next/link";
import { MbbsNmcChecklist } from "@/components/studyAbroad/MbbsNmcChecklist";

export default function StudyAbroadSafetyPage() {
  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/study-abroad" style={{ color: "#999", textDecoration: "none" }}>← Study Abroad</Link>
      </div>
      <MbbsNmcChecklist />
    </div>
  );
}
