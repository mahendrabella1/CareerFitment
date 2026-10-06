import Link from "next/link";
import { SCAM_ITEMS, FAMILY_GUARD_ITEMS } from "@/data/money/scamItems";
import { CALL_SCRIPTS, OFFER_ITEMS, SPOT_PAIRS } from "@/data/money/scamModes";
import { ScamOfTheWeekCard } from "@/components/money/ScamModes";
import { PageHeader } from "@/components/course/fx";

const MODES = [
  { slug: "swipe", title: "Safe or Scam", desc: `${SCAM_ITEMS.length} real-world messages, calls and screens`, who: "All ages" },
  { slug: "family", title: "Family Guard", desc: `Help protect a grandparent from ${FAMILY_GUARD_ITEMS.length} common scams`, who: "All ages" },
  { slug: "spot-the-fake", title: "Spot the Fake", desc: `${SPOT_PAIRS.length} pairs of near-identical screens. Tap the fake one`, who: "Class 9 and up" },
  { slug: "the-call", title: "The Call", desc: `${CALL_SCRIPTS.length} scam calls. Choose what you'd say`, who: "Class 9 and up" },
  { slug: "too-good-to-be-true", title: "Too Good to Be True", desc: `Rate ${OFFER_ITEMS.length} investment offers from 1 (safe) to 5 (scam)`, who: "College and working" },
  { slug: "scam-of-the-week", title: "Scam of the Week", desc: "Real, dated warnings from official sources", who: "Everyone" },
];

export default function ScamShieldPage() {
  return (
    <div style={{ padding: "0 0 8px" }}>
      <PageHeader icon="shield" eyebrow="Scam Shield" title="Spot the scam before it spots you"
        subtitle="Short games on realistic fake messages, screens and calls. No real money, and never type a real OTP or PIN." />

      <ScamOfTheWeekCard compact />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 16 }}>
        {MODES.map((m) => (
          <Link key={m.slug} href={`/account/money/scam-shield/${m.slug}`} className="fx-lift" style={{ textDecoration: "none", borderRadius: 14 }}>
            <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 20px", background: "#fff", height: "100%", boxSizing: "border-box" }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{m.title}</div>
              <div style={{ fontSize: 12.5, color: "#888", marginTop: 4 }}>{m.desc}</div>
              <div style={{ fontSize: 11.5, color: "#0ea05f", fontWeight: 700, marginTop: 4 }}>{m.who}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 24, borderRadius: 10, padding: "12px 16px", background: "#fef3c7", color: "#92400e", fontSize: 12.5, lineHeight: 1.6 }}>
        If you&apos;ve actually been scammed: call <b>1930</b> (national cyber fraud helpline) right away, then report at cybercrime.gov.in and tell your bank.
      </div>
    </div>
  );
}
