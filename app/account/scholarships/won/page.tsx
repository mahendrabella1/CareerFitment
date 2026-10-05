import { MoneyWonTracker } from "@/components/scholarships/MoneyWonTracker";

export default function ScholarshipsWonPage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: ".08em" }}>After you win</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Money won and renewals</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        Winning is only the start. Students lose scholarship money when a payment fails or a renewal is missed. Record each award here, check that the money arrives, and keep an eye on renewal rules.
      </p>
      <MoneyWonTracker />
    </div>
  );
}
