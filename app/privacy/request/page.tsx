import { LegalPage } from "@/components/seo/LegalPage";
import { EnquiryForm } from "@/components/enquiries/EnquiryForm";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata({
  title: "See, correct or delete your data",
  description: "Ask OneGrasp for a copy of your data, to correct it, or to delete your account and data - for yourself or, as a parent or guardian, for your child.",
  path: "/privacy/request",
});

/** /privacy/request - the privacy request form (lib/enquiries, kind "privacy"). */
export default function PrivacyRequestPage() {
  return (
    <LegalPage title="See, correct or delete your data" path="/privacy/request" body={[
      { p: "Use this form to ask for a copy of your data, to correct it, to withdraw consent, or to delete your OneGrasp account and data. Parents and guardians can ask on behalf of their child." },
      { p: "We'll reply to the email address on the account to confirm the request is genuine before we act - so use the email you signed up with. You can also write to **support@onegrasp.com**. See our [Privacy Policy](/privacy) for what we hold and why." },
    ]}>
      <div style={{ border: "1px solid var(--line)", borderRadius: 14, padding: 22, background: "#fff", marginTop: 22 }}>
        <EnquiryForm kind="privacy" submitLabel="Send my request" doneTitle="Request received." doneText="We'll email you at the address you gave to confirm it's you, then act on it." />
      </div>
    </LegalPage>
  );
}
