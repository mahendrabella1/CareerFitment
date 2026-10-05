"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchScamAccuracy } from "@/lib/money/clientProgress";

export function ScamAccuracyCard({ accent }: { accent: string }) {
  const { user } = useAuth();
  const [stat, setStat] = useState<{ accuracyPercent: number; roundsPlayed: number } | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    fetchScamAccuracy(user.uid).then(setStat);
  }, [user?.uid]);

  if (!stat || stat.roundsPlayed === 0) {
    return (
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontSize: 13.5, color: "#475569" }}>Play one round of Scam Shield to see your accuracy here.</span>
        <Link href="/account/money/scam-shield" style={{ fontSize: 13, fontWeight: 800, color: accent, textDecoration: "none" }}>Start Scam Shield →</Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
      <div>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>Your Scam Shield accuracy</div>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 2 }}>Across {stat.roundsPlayed} {stat.roundsPlayed === 1 ? "round" : "rounds"}</div>
      </div>
      <span style={{ fontSize: 26, fontWeight: 900, color: accent }}>{stat.accuracyPercent}%</span>
    </div>
  );
}
