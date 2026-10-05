"use client";

import { useMemo, useState } from "react";
import { Slider, inr } from "@/components/money/Slider";
import { HowCalculated, LabNote, ShareLine, StatBox } from "@/components/money/LabChart";
import { PT_STATES, PF_WAGE_CEILING_MONTHLY, STANDARD_DEDUCTION, salaryBreakdown, type PtState } from "@/lib/money/labMath";

export function SalarySlipLab() {
  const [ctc, setCtc] = useState(600000);
  const [basicPct, setBasicPct] = useState(50);
  const [pfFull, setPfFull] = useState(false);
  const [gratuity, setGratuity] = useState(true);
  const [state, setState] = useState<PtState>("karnataka");
  const [woman, setWoman] = useState(false);

  const b = useMemo(() => salaryBreakdown({ ctc, basicShare: basicPct / 100, pfOnFullBasic: pfFull, gratuityInCtc: gratuity, state, woman }), [ctc, basicPct, pfFull, gratuity, state, woman]);

  const lines = [
    { label: "Employer's PF contribution", value: b.employerPf, note: "Goes to your PF account, not your bank" },
    { label: "Gratuity", value: b.gratuity, note: "Paid only when you leave after the qualifying service" },
    { label: "Your PF contribution", value: b.employeePf, note: "Saved for you in PF, cut from your pay" },
    { label: "Professional tax", value: b.professionalTax, note: "State tax, at most ₹2,500 a year" },
    { label: "Income tax (TDS)", value: b.incomeTax, note: "New tax regime, tax year 2026-27" },
  ];

  return (
    <div>
      <Slider label="CTC (fixed pay, per year)" value={ctc} min={300000} max={5000000} step={50000} onChange={setCtc} format={inr} />
      <Slider label="Basic pay as a share of gross salary" value={basicPct} min={40} max={70} step={5} onChange={setBasicPct} format={(v) => `${v}%`} />

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: 14 }}>
        <label style={{ fontSize: 13, color: "#555" }}>Where you work
          <select value={state} onChange={(e) => setState(e.target.value as PtState)} style={{ width: "100%", marginTop: 6, padding: "8px 10px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 13.5 }}>
            {PT_STATES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#334155" }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={pfFull} onChange={(e) => setPfFull(e.target.checked)} style={{ accentColor: "#0ea05f" }} /> PF on full basic (not capped)</label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={gratuity} onChange={(e) => setGratuity(e.target.checked)} style={{ accentColor: "#0ea05f" }} /> Gratuity is part of my CTC</label>
          {state === "maharashtra" && <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" checked={woman} onChange={(e) => setWoman(e.target.checked)} style={{ accentColor: "#0ea05f" }} /> I am a woman (exempt up to ₹25,000 a month)</label>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatBox label="CTC per month" value={inr(ctc / 12)} />
        <StatBox label="In-hand per month" value={inr(b.inHandMonth)} tone="good" />
        <StatBox label="In-hand as % of CTC" value={`${Math.round((b.inHandYear / ctc) * 100)}%`} />
      </div>

      <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
        <div style={row}><span style={{ fontWeight: 800 }}>CTC</span><span style={{ fontWeight: 800 }}>{inr(ctc)} / yr</span></div>
        {lines.map((l) => (
          <div key={l.label} style={row}>
            <span style={{ minWidth: 0 }}>− {l.label}<br /><span style={{ fontSize: 11.5, color: "#64748b" }}>{l.note}</span></span>
            <span style={{ color: l.value > 0 ? "#b91c1c" : "#64748b", whiteSpace: "nowrap" }}>{inr(l.value)}</span>
          </div>
        ))}
        <div style={{ ...row, background: "#f0fdf4", borderBottom: "none" }}><span style={{ fontWeight: 900, color: "#14532d" }}>Reaches your bank</span><span style={{ fontWeight: 900, color: "#14532d" }}>{inr(b.inHandYear)} / yr · {inr(b.inHandMonth)} / mo</span></div>
      </div>

      <ShareLine text={`A CTC of ${inr(ctc)} can mean about ${inr(b.inHandMonth)} a month in your bank account: CTC is not what reaches your bank.`} />
      <LabNote>Simplified. Real slips can also include HRA, special allowances, meal cards, insurance, PF admin charges and variable pay. If your CTC includes variable or performance pay, take it out before using this lab, because it is paid only if earned. Under the new tax regime, PF, HRA and professional tax do not reduce your taxable income. If you choose the old regime, your tax will differ.</LabNote>
      <HowCalculated>
        <p style={{ margin: "0 0 6px" }}>CTC = gross salary + employer PF + gratuity. Basic is set as a share of gross (the Labour Codes in force from 21 November 2025 require basic and DA to be at least 50% of pay for PF and gratuity).</p>
        <p style={{ margin: "0 0 6px" }}>PF: 12% of basic from you and 12% from the employer. Capped mode uses the EPF wage ceiling of ₹{PF_WAGE_CEILING_MONTHLY.toLocaleString("en-IN")} a month, raised from ₹15,000 with effect from 17 September 2026, so at most ₹3,000 a month each. Gratuity: 15/26 of a month&apos;s basic per year, about 4.81% of basic.</p>
        <p style={{ margin: "0 0 6px" }}>Income tax: gross − ₹{STANDARD_DEDUCTION.toLocaleString("en-IN")} standard deduction, then slabs of 0% to ₹4 lakh, 5% to ₹8 lakh, 10% to ₹12 lakh, 15% to ₹16 lakh, 20% to ₹20 lakh, 25% to ₹24 lakh and 30% above. No tax is due up to ₹12 lakh of taxable income because of the rebate, with marginal relief just above it. 4% cess is added.</p>
        <p style={{ margin: 0 }}>
          Sources: <a href="https://www.pib.gov.in/PressReleaseDetail.aspx?PRID=2310811" target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>PIB, EPFO wage ceiling raised to ₹25,000</a> · <a href="https://www.incometax.gov.in/" target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>Income Tax Department</a> · state professional tax departments.
        </p>
      </HowCalculated>
    </div>
  );
}

const row = { display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 13.5, color: "#1e293b" } as const;
