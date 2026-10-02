"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Slider, inr, LAB_ACCENT } from "@/components/money/Slider";

// FV = P * ((1+r)^n - 1) / r * (1+r), the standard end-of-period annuity
// formula - matches the Money Life PDF's own compounding Lab formula.
export function CompoundingLab() {
  const [monthly, setMonthly] = useState(1000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(10); // assumed % a year

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    let value = 0;
    const rows: { year: number; invested: number; total: number }[] = [];
    for (let m = 1; m <= years * 12; m++) {
      value = (value + monthly) * (1 + r);
      if (m % 12 === 0) rows.push({ year: m / 12, invested: monthly * m, total: Math.round(value) });
    }
    return rows;
  }, [monthly, years, rate]);

  const last = data[data.length - 1];

  return (
    <div>
      <Slider label="Every month" value={monthly} min={100} max={20000} step={100} onChange={setMonthly} format={inr} />
      <Slider label="For years" value={years} min={1} max={40} step={1} onChange={setYears} format={(v) => `${v} yrs`} />
      <Slider label="Assumed return" value={rate} min={2} max={14} step={0.5} onChange={setRate} format={(v) => `${v}%`} />

      <div style={{ height: 220, marginTop: 20 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <XAxis dataKey="year" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v: number) => inr(v)} />
            <Area dataKey="total" name="Total value" stroke={LAB_ACCENT} fill={LAB_ACCENT} fillOpacity={0.2} />
            <Area dataKey="invested" name="You put in" stroke="#888" fill="#888" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {last && (
        <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 16, color: "#333" }}>
          You put in <b>{inr(last.invested)}</b>. It could grow to <b>{inr(last.total)}</b> at an assumed {rate}% a year.{" "}
          <b style={{ color: LAB_ACCENT }}>{inr(last.total - last.invested)}</b> of that is growth, not money you put in.
        </p>
      )}
      <p style={{ fontSize: 11.5, color: "#999", marginTop: 8 }}>Illustration only. Real returns vary and can be negative. This is not investment advice.</p>
    </div>
  );
}
