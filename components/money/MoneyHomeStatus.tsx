"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRun, type Run } from "@/lib/money/simStore";
import { financialAge, levelFor, personalityFor, type PillarKey } from "@/lib/money/profile";
import { HealthRing } from "@/components/money/HealthRing";

/** Home-page summary of the Money Life run saved on this device. */
export function MoneyHomeStatus() {
  const [run, setRun] = useState<Run | null | undefined>(undefined);
  useEffect(() => setRun(loadRun()), []);
  if (run === undefined) return null;

  const last = run?.history[run.history.length - 1];
  return (
    <section style={{ background: "#fff", border: "1px solid #dcfce7", borderRadius: 16, padding: "16px 18px", marginBottom: 14 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea05f", textTransform: "uppercase", letterSpacing: ".06em" }}>Your Money Health</div>
      {last?.pillars && run ? (
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
          <HealthRing total={last.health} pillars={last.pillars as Record<PillarKey, number>} size={120} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13.5, color: "#334155", minWidth: 0, flex: "1 1 200px" }}>
            <div><b>Financial Age:</b> {financialAge(run.world, last.health)}</div>
            <div><b>Level:</b> {levelFor(run.history.map((h) => h.health)) ?? "unlocks after 3 months"}</div>
            <div><b>Personality:</b> {personalityFor(run.history.flatMap((h) => (h.plan ? [h.plan] : [])))?.name ?? "unlocks after 3 months"}</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 4 }}>
              <Link href="/account/money/play" style={{ color: "#0ea05f", fontWeight: 800 }}>{run.month > 12 ? "See your year" : `Continue: month ${run.month}`} →</Link>
              <Link href="/account/money/journey" style={{ color: "#0ea05f", fontWeight: 800 }}>Money Journey →</Link>
            </div>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0", lineHeight: 1.6 }}>
          Your Money Health Score, Financial Age and Money Personality come from how you play, not from marks.{" "}
          <Link href="/account/money/play" style={{ color: "#0ea05f", fontWeight: 800 }}>Play your first month →</Link>
        </p>
      )}
    </section>
  );
}
