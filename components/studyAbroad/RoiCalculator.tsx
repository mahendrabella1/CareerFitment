"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { roiScenarios } from "@/lib/studyAbroad/roi";
import { fetchRoiInput, saveRoiInput } from "@/lib/studyAbroad/clientProfile";

const ACCENT = "#7c3aed";

function NumberField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 5, display: "block" }}>{label}</label>
      <input
        type="number" min={0} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#1e293b" }}
      />
    </div>
  );
}

export function RoiCalculator() {
  const { user } = useAuth();
  const [totalCost, setTotalCost] = useState("4000000");
  const [scholarship, setScholarship] = useState("0");
  const [ownFunds, setOwnFunds] = useState("1000000");
  const [loanRate, setLoanRate] = useState("10.5");
  const [salaryLow, setSalaryLow] = useState("60000");
  const [salaryMedian, setSalaryMedian] = useState("90000");
  const [salaryHigh, setSalaryHigh] = useState("140000");
  const [living, setLiving] = useState("35000");

  useEffect(() => {
    if (!user?.uid) return;
    fetchRoiInput(user.uid).then((saved) => {
      if (!saved) return;
      if (saved.totalCostInr) setTotalCost(String(saved.totalCostInr));
      if (saved.scholarshipInr) setScholarship(String(saved.scholarshipInr));
      if (saved.ownFundsInr) setOwnFunds(String(saved.ownFundsInr));
      if (saved.loanRatePct) setLoanRate(String(saved.loanRatePct));
      if (saved.salaryInrMonthly?.low) setSalaryLow(String(saved.salaryInrMonthly.low));
      if (saved.salaryInrMonthly?.median) setSalaryMedian(String(saved.salaryInrMonthly.median));
      if (saved.salaryInrMonthly?.high) setSalaryHigh(String(saved.salaryInrMonthly.high));
      if (saved.livingInrMonthly) setLiving(String(saved.livingInrMonthly));
    });
  }, [user?.uid]);

  const input = {
    totalCostInr: Number(totalCost) || 0, scholarshipInr: Number(scholarship) || 0, ownFundsInr: Number(ownFunds) || 0,
    loanRatePct: Number(loanRate) || 0,
    salaryInrMonthly: { low: Number(salaryLow) || 0, median: Number(salaryMedian) || 0, high: Number(salaryHigh) || 0 },
    livingInrMonthly: Number(living) || 0,
  };
  const result = roiScenarios(input);

  function save() {
    if (user?.uid) saveRoiInput(user.uid, input);
  }

  const Scenario = ({ label, s }: { label: string; s: { monthlySaving: number; paybackYears: number | null } }) => (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "#334155", marginTop: 4 }}>Take-home saving: ₹{s.monthlySaving.toLocaleString("en-IN")}/month</div>
      {s.paybackYears === null ? (
        <div style={{ fontSize: 14, fontWeight: 800, color: "#b91c1c", marginTop: 6 }}>Does not pay back at this salary</div>
      ) : (
        <div style={{ fontSize: 18, fontWeight: 900, color: s.paybackYears > 7 ? "#b91c1c" : ACCENT, marginTop: 6 }}>{s.paybackYears} years to pay back{s.paybackYears > 7 ? " — longer than usual" : ""}</div>
      )}
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <NumberField label="Total cost (₹, whole course)" value={totalCost} onChange={setTotalCost} />
        <NumberField label="Scholarship (₹)" value={scholarship} onChange={setScholarship} />
        <NumberField label="Your own funds (₹)" value={ownFunds} onChange={setOwnFunds} />
        <NumberField label="Loan interest rate (% a year)" value={loanRate} onChange={setLoanRate} />
        <NumberField label="Low-case salary (₹/month, post-tax)" value={salaryLow} onChange={setSalaryLow} />
        <NumberField label="Median salary (₹/month, post-tax)" value={salaryMedian} onChange={setSalaryMedian} />
        <NumberField label="High-case salary (₹/month, post-tax)" value={salaryHigh} onChange={setSalaryHigh} />
        <NumberField label="Living costs (₹/month)" value={living} onChange={setLiving} />
      </div>

      <div style={{ fontSize: 13, color: "#334155", marginBottom: 10 }}>Loan needed: <b>₹{result.loan.toLocaleString("en-IN")}</b></div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
        <Scenario label="Low case" s={result.low} />
        <Scenario label="Median case" s={result.median} />
        <Scenario label="High case" s={result.high} />
      </div>

      {user?.uid && (
        <button onClick={save} style={{ marginTop: 16, fontSize: 12.5, fontWeight: 700, padding: "9px 16px", borderRadius: 9, border: `1px solid ${ACCENT}`, background: "#fff", color: ACCENT, cursor: "pointer" }}>
          Save these numbers
        </button>
      )}
      <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 12 }}>Payback assumes every rupee of monthly saving goes to the loan - a real budget will have other claims on it. This is a planning estimate, not a loan offer.</p>
    </div>
  );
}
