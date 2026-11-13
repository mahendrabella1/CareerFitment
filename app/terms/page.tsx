import { LegalPage } from "@/components/seo/LegalPage";
import { TERMS } from "@/lib/seo/legal";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "The terms for using OneGrasp - accounts, what the guidance is and isn't, payments, fair use, content and contact.",
  path: "/terms",
});

export default function TermsPage() {
  return <LegalPage title="Terms of Use" path="/terms" body={TERMS} />;
}
