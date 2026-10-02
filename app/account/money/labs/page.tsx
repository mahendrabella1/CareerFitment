import Link from "next/link";

const LABS = [
  { slug: "compounding", icon: "📈", title: "Compounding Playground", desc: "See how starting early can out-grow starting big" },
  { slug: "emi", icon: "💳", title: "EMI Truth Teller", desc: "What a \"no-cost EMI\" actually costs, total" },
  { slug: "goal-planner", icon: "🎯", title: "Goal Planner", desc: "Turn any goal into a monthly saving number" },
];

export default function LabsPage() {
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Financial Literacy</Link>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 6px" }}>🧮 Money Labs</h1>
      <p style={{ color: "#888", fontSize: 13.5, margin: "0 0 24px" }}>Move the sliders, watch the numbers change - these ideas are easier to see than to read.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {LABS.map((l) => (
          <Link key={l.slug} href={`/account/money/labs/${l.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>{l.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1a1a" }}>{l.title}</div>
                <div style={{ fontSize: 12.5, color: "#888", marginTop: 2 }}>{l.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
