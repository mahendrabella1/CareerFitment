"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { loadRun, type Run } from "@/lib/money/simStore";
import { financialAge, levelFor, personalityFor, type PillarKey } from "@/lib/money/profile";
import { WORLDS } from "@/data/money/simEvents";
import { HealthRing } from "@/components/money/HealthRing";
import { LabChart, lakh } from "@/components/money/LabChart";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

/** Year-end report from the saved Money Life run on this device. */
export function MoneyJourney() {
  const [run, setRun] = useState<Run | null | undefined>(undefined);
  useEffect(() => setRun(loadRun()), []);

  if (run === undefined) return <p style={{ color: "#64748b", fontSize: 14 }}>Loading…</p>;
  if (!run || run.history.length === 0) {
    return (
      <p style={{ fontSize: 14, color: "#475569" }}>
        No months played yet on this device. <Link href="/account/money/play" style={{ color: "#0ea05f", fontWeight: 800 }}>Start Money Life</Link> and your journey appears here.
      </p>
    );
  }

  const world = WORLDS.find((w) => w.id === run.world)!;
  const h = run.history;
  const last = h[h.length - 1];
  const deltas = h.filter((r) => r.netWorthBefore !== undefined).map((r) => ({ r, d: r.netWorth - (r.netWorthBefore as number) }));
  const best = deltas.length ? deltas.reduce((a, b) => (b.d > a.d ? b : a)) : null;
  const worst = deltas.length ? deltas.reduce((a, b) => (b.d < a.d ? b : a)) : null;
  const personality = personalityFor(h.flatMap((r) => (r.plan ? [r.plan] : [])));
  const level = levelFor(h.map((r) => r.health));
  const age = financialAge(run.world, last.health);
  const concepts = Array.from(new Set(h.flatMap((r) => (r.concept ? [r.concept] : []))));
  const complete = h.length >= 12;

  const download = () => {
    const c = document.createElement("canvas");
    c.width = 1080;
    c.height = 1080;
    const g = c.getContext("2d");
    if (!g) return;
    g.fillStyle = "#f0fdf4";
    g.fillRect(0, 0, 1080, 1080);
    g.fillStyle = "#0ea05f";
    g.font = "bold 40px system-ui, sans-serif";
    g.fillText("My Money Journey", 70, 120);
    g.fillStyle = "#0f172a";
    g.font = "28px system-ui, sans-serif";
    g.fillText(`${world.title} · ${h.length} month${h.length === 1 ? "" : "s"} played`, 70, 170);
    const lines = [
      `Net worth now: ${inr(last.netWorth)}`,
      `Money Health Score: ${last.health} / 100`,
      `Financial Age: ${age}`,
      `Personality: ${personality ? personality.name : "not unlocked yet"}`,
      `Level: ${level ?? "not unlocked yet"}`,
      best ? `Best month: ${best.r.choice}` : "",
    ].filter(Boolean);
    g.font = "bold 34px system-ui, sans-serif";
    lines.forEach((l, i) => g.fillText(l.length > 52 ? l.slice(0, 51) + "…" : l, 70, 270 + i * 70));
    // Net worth sparkline
    const vals = h.map((r) => r.netWorth);
    const min = Math.min(0, ...vals);
    const max = Math.max(1, ...vals);
    g.strokeStyle = "#0ea05f";
    g.lineWidth = 6;
    g.beginPath();
    vals.forEach((v, i) => {
      const x = 70 + (vals.length === 1 ? 0 : (i / (vals.length - 1)) * 940);
      const y = 960 - ((v - min) / (max - min)) * 220;
      if (i === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    });
    g.stroke();
    g.fillStyle = "#64748b";
    g.font = "22px system-ui, sans-serif";
    g.fillText("Virtual money in the OneGrasp Money Life game. Not real money or advice.", 70, 1030);
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = "money-journey.png";
    a.click();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <div style={{ fontSize: 11, fontWeight: 800, color: "#0ea05f", textTransform: "uppercase", letterSpacing: ".06em" }}>{world.title} · {complete ? "Year complete" : `${h.length} of 12 months`}</div>
        <h2 style={h2}>Net worth over the year</h2>
        <LabChart ariaLabel="Net worth each month" series={[{ label: "Net worth at month end", color: "#0ea05f", values: h.map((r) => r.netWorth) }]} xLabel={(i) => `Mo ${h[i]?.month ?? i + 1}`} yFormat={lakh} />
        {!complete && <p style={pText}>Your full year-end report fills in as you play all 12 months.</p>}
      </section>

      <section style={{ ...panel, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        {last.pillars && <HealthRing total={last.health} pillars={last.pillars as Record<PillarKey, number>} />}
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14, color: "#334155", minWidth: 0, flex: "1 1 220px" }}>
          <div><b>Financial Age:</b> {age} <span style={{ color: "#94a3b8", fontSize: 12 }}>(a fun estimate, not a measurement)</span></div>
          <div><b>Level:</b> {level ?? "unlocks after 3 months"}</div>
          {personality ? (
            <div><b>{personality.name}</b> ({personality.pattern}). {personality.strength} <span style={{ color: "#b45309" }}>Watch out: {personality.watchOut}</span></div>
          ) : <div><b>Personality:</b> unlocks after 3 months</div>}
        </div>
      </section>

      {best && worst && (
        <section style={panel}>
          <h2 style={h2}>Best and worst decisions</h2>
          <p style={pText}>Best: month {best.r.month}, <b>{best.r.choice}</b> ({best.r.event}). Net worth {best.d >= 0 ? "+" : "−"}{inr(Math.abs(best.d))}.</p>
          <p style={pText}>Hardest: month {worst.r.month}, <b>{worst.r.choice}</b> ({worst.r.event}). Net worth {worst.d >= 0 ? "+" : "−"}{inr(Math.abs(worst.d))}.</p>
          <p style={{ ...pText, fontSize: 12.5, color: "#64748b" }}>Net worth change includes that month&apos;s income and your jar plan, not only the event.</p>
        </section>
      )}

      {concepts.length > 0 && (
        <section style={panel}>
          <h2 style={h2}>Concept cards unlocked by living them</h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {concepts.map((c) => <span key={c} style={{ fontSize: 12.5, fontWeight: 700, color: "#14532d", background: "#dcfce7", borderRadius: 999, padding: "4px 10px" }}>{c}</span>)}
          </div>
          <Link href="/account/money/cards" style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: "#0ea05f", fontWeight: 800 }}>Read them in the Concept Library →</Link>
        </section>
      )}

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={download} style={primary}>Download as image</button>
        <Link href="/account/money/play" style={{ ...secondary, textDecoration: "none" }}>Back to the game</Link>
      </div>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "4px 0 10px" };
const pText: CSSProperties = { fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const primary: CSSProperties = { fontSize: 14, fontWeight: 800, color: "#fff", background: "#0ea05f", border: "none", borderRadius: 10, padding: "11px 18px", cursor: "pointer" };
const secondary: CSSProperties = { fontSize: 14, fontWeight: 700, color: "#334155", background: "#fff", border: "1px solid #cbd5e1", borderRadius: 10, padding: "10px 16px" };
