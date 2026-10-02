"use client";

import { useMemo, useState } from "react";
import { Slider, inr, LAB_ACCENT } from "@/components/money/Slider";

// Standard EMI = P*r*(1+r)^n / ((1+r)^n - 1). "No-cost EMI" still totals the
// sticker price + processing fee even at 0% interest - the Lab shows that
// explicitly rather than letting 0% interest look like genuinely free money.
export function EmiLab() {
  const [price, setPrice] = useState(60000);
  const [rate, setRate] = useState(14); // annual %
  const [months, setMonths] = useState(24);
  const [fee, setFee] = useState(1500); // processing / "no-cost EMI" fee

  const { emi, totalPaid, totalInterest } = useMemo(() => {
    const r = rate / 100 / 12;
    const emiVal = r === 0 ? price / months : (price * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = emiVal * months + fee;
    return { emi: emiVal, totalPaid: total, totalInterest: total - price - fee };
  }, [price, rate, months, fee]);

  return (
    <div>
      <Slider label="Price" value={price} min={5000} max={200000} step={1000} onChange={setPrice} format={inr} />
      <Slider label="Interest rate" value={rate} min={0} max={30} step={0.5} onChange={setRate} format={(v) => `${v}% / yr`} />
      <Slider label="Tenure" value={months} min={3} max={48} step={1} onChange={setMonths} format={(v) => `${v} months`} />
      <Slider label={'Processing / "no-cost" fee'} value={fee} min={0} max={10000} step={100} onChange={setFee} format={inr} />

      <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
        <div style={{ flex: 1, border: "1px solid #eee", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#999" }}>Sticker price</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: "#1a1a1a" }}>{inr(price)}</div>
        </div>
        <div style={{ flex: 1, border: `1px solid ${LAB_ACCENT}50`, background: `${LAB_ACCENT}10`, borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#999" }}>You'll actually pay</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: LAB_ACCENT }}>{inr(totalPaid)}</div>
        </div>
      </div>

      <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 16, color: "#333" }}>
        Monthly EMI: <b>{inr(emi)}</b>. Over {months} months that's <b>{inr(totalPaid)}</b> total -{" "}
        <b style={{ color: totalInterest + fee > 0 ? "#ef4444" : LAB_ACCENT }}>{inr(totalInterest + fee)}</b> more than the sticker price, from interest and fees.
      </p>
      {rate === 0 && fee > 0 && (
        <p style={{ fontSize: 12.5, color: "#92400e", background: "#fef3c7", borderRadius: 8, padding: "8px 12px" }}>
          Even at 0% interest, the ₹{fee.toLocaleString("en-IN")} fee means this "no-cost EMI" isn't actually free.
        </p>
      )}
    </div>
  );
}
