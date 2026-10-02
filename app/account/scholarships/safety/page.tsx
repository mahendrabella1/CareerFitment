import Link from "next/link";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";

const ACCENT = "#166534";

const SCAMS = [
  "Calls or messages saying \"You've won a scholarship; pay a processing fee or tax to release it.\"",
  "Fake NSP or government look-alike websites and apps asking for Aadhaar, bank details, OTPs or UPI PINs.",
  "Agents offering to \"guarantee\" a scholarship or fill forms for a fee, sometimes with false documents.",
  "WhatsApp forwards with fake scholarship schemes and links.",
  "Requests to share your bank account or ATM card \"to deposit the scholarship.\"",
];

export default function ScholarshipSafetyPage() {
  const cyberFraud = HELP_CONTACTS.find((c) => c.slug === "cyber-fraud");
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 60px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account/scholarships" style={{ color: "#999", textDecoration: "none" }}>← Scholarships</Link>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "0 0 10px" }}>Scholarship scams and safety</h1>
      <div style={{ border: "2px solid #dc2626", background: "#fef2f2", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: "#991b1b", margin: 0 }}>Genuine scholarships never ask you to pay to receive money.</p>
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Common scams to watch for</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        {SCAMS.map((s, i) => (
          <div key={i} style={{ fontSize: 13, color: "#334155", padding: "9px 12px", border: "1px solid #fee2e2", borderRadius: 9 }}>{s}</div>
        ))}
      </div>

      <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>If you think you've been scammed</div>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
        <p style={{ fontSize: 13, color: "#334155", margin: "0 0 8px" }}>Report it immediately - speed matters for recovering any money sent.</p>
        <a href={`tel:${cyberFraud?.number}`} style={{ fontSize: 16, fontWeight: 900, color: ACCENT, textDecoration: "none" }}>Call {cyberFraud?.number}</a>
        <p style={{ fontSize: 12, color: "#64748b", margin: "6px 0 0" }}>{cyberFraud?.note} Full guide: <Link href="/account/legal/guides/online-fraud" style={{ color: ACCENT, fontWeight: 700 }}>Online fraud and scams</Link>.</p>
      </div>

      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 18 }}>Only scholarships verified by our content team are listed on this platform, each with its real official website shown.</p>
    </div>
  );
}
