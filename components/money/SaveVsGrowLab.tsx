"use client";

import { useMemo, useState } from "react";
import { Slider, inr } from "@/components/money/Slider";
import { HowCalculated, LabChart, LabNote, ShareLine, lakh } from "@/components/money/LabChart";
import { growthPath } from "@/lib/money/labMath";

const SAVINGS = 0.025;
const DEPOSIT = 0.065;
const EQUITY = 0.1;
const INFLATION = 0.04;

type Mode = "monthly" | "lump";
type Scenario = "steady" | "late-crash";

export function SaveVsGrowLab() {
  const [mode, setMode] = useState<Mode>("monthly");
  const [amount, setAmount] = useState(2000);
  const [years, setYears] = useState(10);
  const [scenario, setScenario] = useState<Scenario>("steady");
  const [real, setReal] = useState(false);

  const rows = useMemo(() => {
    const lump = mode === "lump" ? amount : 0;
    const monthly = mode === "monthly" ? amount : 0;
    const equityYears = Array.from({ length: years }, (_, i) => (scenario === "late-crash" && i === years - 1 ? -0.25 : EQUITY));
    const deflate = (vals: number[]) => (real ? vals.map((v, i) => v / Math.pow(1 + INFLATION, i)) : vals);
    return [
      { label: "Savings account (2.5%)", risk: "Very low risk. Deposits insured up to ₹5 lakh per bank by DICGC.", color: "#64748b", values: deflate(growthPath(lump, monthly, Array(years).fill(SAVINGS))) },
      { label: mode === "lump" ? "Fixed deposit (6.5%)" : "Recurring deposit (6.5%)", risk: "Low risk. Rate fixed when you open it. Same DICGC cover. Breaking it early can cost a penalty.", color: "#2563eb", values: deflate(growthPath(lump, monthly, Array(years).fill(DEPOSIT))) },
      { label: mode === "lump" ? "Equity mutual fund, lump sum (10% assumed)" : "Equity mutual fund SIP (10% assumed)", risk: "High risk. Not insured, not guaranteed. Can fall sharply and stay down for years.", color: "#0ea05f", values: deflate(growthPath(lump, monthly, equityYears)) },
    ];
  }, [mode, amount, years, scenario, real]);

  const putIn = (mode === "lump" ? amount : amount * 12 * years);
  const last = rows.map((r) => r.values[r.values.length - 1]);
  const aha = scenario === "late-crash"
    ? `If the market falls 25% in the final year, the higher-return option can end up close to the safe ones. Higher return comes with higher risk.`
    : `${inr(putIn)} put in over ${years} years could become ${inr(last[0])} in a savings account, ${inr(last[1])} in a deposit, or ${inr(last[2])} in an equity fund at an assumed 10%, with far more risk.`;

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {(["monthly", "lump"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} style={{ fontSize: 13, fontWeight: 800, padding: "8px 12px", borderRadius: 9, cursor: "pointer", border: `1px solid ${mode === m ? "#0ea05f" : "#cbd5e1"}`, background: mode === m ? "#f0fdf4" : "#fff", color: mode === m ? "#166534" : "#334155" }}>
            {m === "monthly" ? "Every month" : "One-time amount"}
          </button>
        ))}
      </div>
      <Slider label={mode === "monthly" ? "Every month" : "One-time amount"} value={amount} min={mode === "monthly" ? 500 : 10000} max={mode === "monthly" ? 25000 : 500000} step={mode === "monthly" ? 500 : 10000} onChange={setAmount} format={inr} />
      <Slider label="For how many years" value={years} min={1} max={30} step={1} onChange={setYears} format={(v) => `${v} yrs`} />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 13, color: "#334155", marginBottom: 12 }}>
        <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={scenario === "late-crash"} onChange={(e) => setScenario(e.target.checked ? "late-crash" : "steady")} style={{ accentColor: "#0ea05f" }} />
          Show a market fall of 25% in the last year
        </label>
        <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
          <input type="checkbox" checked={real} onChange={(e) => setReal(e.target.checked)} style={{ accentColor: "#0ea05f" }} />
          Show in today&apos;s money (after 4% inflation)
        </label>
      </div>

      <LabChart ariaLabel="Growth of the same money in four places" series={rows.map((r) => ({ label: r.label, color: r.color, values: r.values }))} xLabel={(i) => `Yr ${i}`} yFormat={lakh} />

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 14 }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ border: "1px solid #e2e8f0", borderLeft: `4px solid ${r.color}`, borderRadius: 10, padding: "9px 12px", display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0, flex: "1 1 240px" }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>{r.label}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.risk}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#0f172a" }}>{inr(last[i])}</div>
          </div>
        ))}
      </div>

      <ShareLine text={aha} />
      <LabNote>Rates here are assumptions for illustration, not quotes from any bank or fund. Real returns vary and equity returns can be negative. Interest on deposits is taxable, which this lab leaves out. This is education, not investment advice.</LabNote>
      <HowCalculated>
        <p style={{ margin: "0 0 6px" }}>Each month the deposit is added, then the balance grows by the monthly equivalent of the yearly rate: (1 + yearly rate)^(1/12) − 1.</p>
        <p style={{ margin: "0 0 6px" }}>Today&apos;s money divides each year&apos;s value by 1.04 for every year that has passed.</p>
        <p style={{ margin: 0 }}>Deposit insurance: <a href="https://www.dicgc.org.in/" target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>DICGC</a> covers up to ₹5 lakh per depositor per bank, including interest. Mutual funds are not covered.</p>
      </HowCalculated>
    </div>
  );
}
