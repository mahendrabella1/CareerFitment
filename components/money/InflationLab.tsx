"use client";

import { useMemo, useState } from "react";
import { Slider, inr } from "@/components/money/Slider";
import { HowCalculated, LabChart, LabNote, ShareLine, StatBox } from "@/components/money/LabChart";
import {
  CPI_SOURCE, FIRST_YEAR, INFLATION_ITEMS, LAST_ACTUAL_YEAR, LAST_YEAR, PETROL_DELHI, PETROL_SOURCE, TARGET_SOURCE, THIS_YEAR,
  priceIn, rupeesEquivalent,
} from "@/data/money/inflation";

const money = (v: number) => (v >= 1000 ? inr(v) : `₹${v.toFixed(v < 100 ? 2 : 0)}`);

export function InflationLab() {
  const [year, setYear] = useState(2000);
  const [itemId, setItemId] = useState("samosa");
  const item = INFLATION_ITEMS.find((i) => i.id === itemId)!;
  const years = useMemo(() => Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => FIRST_YEAR + i), []);

  const priceThen = priceIn(item, year);
  const priceNow = priceIn(item, THIS_YEAR);
  const hundredNow = rupeesEquivalent(100, year, THIS_YEAR);
  const isFuture = year > THIS_YEAR;
  const petrolDots = itemId === "petrol"
    ? { label: "Actual Delhi petrol price on 1 April (PPAC)", color: "#dc2626", points: Object.entries(PETROL_DELHI).map(([y, p]) => ({ x: Number(y) - FIRST_YEAR, y: p })) }
    : undefined;

  const aha = isFuture
    ? `If prices rise 4% a year, ${item.label.toLowerCase()} that costs ${money(priceNow)} in ${THIS_YEAR} could cost about ${money(priceThen)} in ${year}. ₹100 kept idle until then would buy only about ₹${Math.round(100 / (rupeesEquivalent(100, THIS_YEAR, year) / 100))} worth of today's things.`
    : `₹100 in ${year} bought what about ${inr(hundredNow)} buys in ${THIS_YEAR}. Money kept idle since ${year} has lost about ${Math.round((1 - 100 / hundredNow) * 100)}% of its buying power.`;

  return (
    <div>
      <label style={{ display: "block", marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: "#555", display: "block", marginBottom: 6 }}>Item</span>
        <select value={itemId} onChange={(e) => setItemId(e.target.value)} style={{ width: "100%", padding: "9px 10px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 14 }}>
          {INFLATION_ITEMS.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
      </label>
      <Slider label="Travel to the year" value={year} min={FIRST_YEAR} max={LAST_YEAR} step={1} onChange={setYear} format={(v) => String(v)} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatBox label={`${item.label} in ${year}`} value={money(priceThen)} />
        <StatBox label={`In ${THIS_YEAR}`} value={money(priceNow)} />
        <StatBox label={`₹100 from ${year} in ${THIS_YEAR} money`} value={inr(hundredNow)} tone={hundredNow > 100 ? "bad" : "good"} />
      </div>

      <div style={{ marginTop: 16 }}>
        <LabChart
          ariaLabel={`Price of ${item.label} from ${FIRST_YEAR} to ${LAST_YEAR}`}
          series={[
            { label: `Moved with the actual price index (to ${LAST_ACTUAL_YEAR})`, color: "#0ea05f", values: years.filter((y) => y <= LAST_ACTUAL_YEAR).map((y) => priceIn(item, y)) },
            { label: "Assumed 4% a year from 2026", color: "#0ea05f", dashed: true, start: LAST_ACTUAL_YEAR - FIRST_YEAR, values: years.filter((y) => y >= LAST_ACTUAL_YEAR).map((y) => priceIn(item, y)) },
          ]}
          dots={petrolDots}
          markerIndex={year - FIRST_YEAR}
          xLabel={(i) => String(FIRST_YEAR + i)}
          yFormat={(v) => (v >= 1000 ? `₹${Math.round(v / 1000)}k` : `₹${Math.round(v)}`)}
        />
      </div>

      <ShareLine text={aha} />
      <LabNote>{item.anchorNote} Prices for other years move with the all-items consumer price index, so a single item can rise faster or slower than this line, as the petrol dots show (petrol fell in 2015 when crude oil prices fell).</LabNote>

      <HowCalculated>
        <p style={{ margin: "0 0 6px" }}>Price in a year = price in the starting year × (index in that year ÷ index in the starting year).</p>
        <p style={{ margin: "0 0 6px" }}>
          Index values for 1990 to {LAST_ACTUAL_YEAR} are actual: <a href={CPI_SOURCE.url} target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>{CPI_SOURCE.label}</a>.
          From 2026 the lab assumes 4% a year, the RBI&apos;s target (<a href={TARGET_SOURCE.url} target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>{TARGET_SOURCE.label}</a>). Real inflation will be different.
        </p>
        <p style={{ margin: 0 }}>Petrol dots: <a href={PETROL_SOURCE.url} target="_blank" rel="noreferrer" style={{ color: "#0ea05f" }}>{PETROL_SOURCE.label}</a>, 2002 to 2017.</p>
      </HowCalculated>
    </div>
  );
}
