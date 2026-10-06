import { MoneyWonTracker } from "@/components/scholarships/MoneyWonTracker";
import { PageHeader } from "@/components/course/fx";

export default function ScholarshipsWonPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader icon="award" eyebrow="After you win" title="Money won and renewals"
        subtitle="Winning is only the start. Students lose scholarship money when a payment fails or a renewal is missed. Record each award here, check that the money arrives, and keep an eye on renewal rules." />
      <MoneyWonTracker />
    </div>
  );
}
