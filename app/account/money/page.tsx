"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchScamAccuracy } from "@/lib/money/clientProgress";

const ACCENT = "#0ea05f";

const TILES = [
  { href: "/account/money/scam-shield", icon: "🛡️", title: "Scam Shield", desc: "60-second games: spot the scam before it spots you" },
  { href: "/account/money/labs", icon: "🧮", title: "Money Labs", desc: "Compounding, EMIs, and your goals - made visible" },
  { href: "/account/money/cards", icon: "🗂️", title: "Concept Library", desc: "Short, real ideas on earning, saving, borrowing and more" },
];

export default function MoneyHomePage() {
  const { user } = useAuth();
  const [stat, setStat] = useState<{ accuracyPercent: number; roundsPlayed: number } | null>(null);

  useEffect(() => {
    if (!user?.uid) { setStat({ accuracyPercent: 0, roundsPlayed: 0 }); return; }
    fetchScamAccuracy(user.uid).then(setStat);
  }, [user?.uid]);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Dashboard</Link>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "8px 0 6px" }}>💰 Financial Literacy</h1>
      <p style={{ color: "#666", margin: "0 0 28px", fontSize: 14 }}>
        Money skills are habits, not facts - short, real tools instead of a syllabus.
      </p>

      {stat && stat.roundsPlayed > 0 && (
        <div style={{ border: `1px solid ${ACCENT}40`, background: `${ACCENT}0d`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a" }}>Your Scam Shield accuracy</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: ACCENT }}>{stat.accuracyPercent}%</span>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {TILES.map((t) => (
          <Link key={t.href} href={t.href} style={{ textDecoration: "none" }}>
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 28 }}>{t.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#1a1a1a" }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "#888", marginTop: 2 }}>{t.desc}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
