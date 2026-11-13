import { LegalPage } from "@/components/seo/LegalPage";
import { PRIVACY } from "@/lib/seo/legal";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "What personal data OneGrasp collects, why, who it is shared with, and how students and parents can see, correct or delete it.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" path="/privacy" body={PRIVACY} />;
}
