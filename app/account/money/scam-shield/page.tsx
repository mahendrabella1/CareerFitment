import Link from "next/link";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";

export default function ScamShieldPage() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Financial Literacy</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>🛡️ Scam Shield</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 24px" }}>Decide safe or scam on realistic fake messages - 60 seconds, no real risk.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Link href="/account/money/scam-shield/swipe" style={{ textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Safe or Scam</div>
            <div style={{ fontSize: 12.5, color: "#888", marginTop: 4 }}>{SCAM_ITEMS.length} real-world messages, calls and screens</div>
          </div>
        </Link>
        <Link href="/account/money/scam-shield/family" style={{ textDecoration: "none" }}>
          <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "18px 20px" }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>Family Guard</div>
            <div style={{ fontSize: 12.5, color: "#888", marginTop: 4 }}>Help protect a grandparent from {FAMILY_GUARD_ITEMS.length} common scams</div>
          </div>
        </Link>
      </div>

      <div style={{ marginTop: 24, borderRadius: 10, padding: "12px 16px", background: "#fef3c7", color: "#92400e", fontSize: 12.5, lineHeight: 1.6 }}>
        If you've actually been scammed: call <b>1930</b> (national cyber fraud helpline) right away, then report at cybercrime.gov.in and tell your bank.
      </div>
    </div>
  );
}
