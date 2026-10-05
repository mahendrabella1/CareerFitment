"use client";

import { useEffect, useMemo, useState } from "react";
import { Slider, inr } from "@/components/money/Slider";
import { HowCalculated, LabChart, LabNote, ShareLine, StatBox, lakh } from "@/components/money/LabChart";
import { maxHomeLoan, rentVsBuy } from "@/lib/money/labMath";

export function RentVsBuyLab() {
  const [price, setPrice] = useState(8000000);
  const [downPct, setDownPct] = useState(20);
  const [rent, setRent] = useState(25000);
  const [loanRate, setLoanRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [horizon, setHorizon] = useState(15);
  const [priceGrowth, setPriceGrowth] = useState(5);
  const [investReturn, setInvestReturn] = useState(10);

  const minDownPct = Math.ceil(((price - maxHomeLoan(price)) / price) * 100);
  useEffect(() => {
    if (downPct < minDownPct) setDownPct(minDownPct);
  }, [minDownPct, downPct]);
  const down = (price * Math.max(downPct, minDownPct)) / 100;

  const r = useMemo(() => rentVsBuy({
    price, downPayment: down, loanRate: loanRate / 100, tenureYears: tenure, rentMonthly: rent, horizonYears: horizon,
    priceGrowth: priceGrowth / 100, rentGrowth: 0.05, investReturn: investReturn / 100, upfrontCostPct: 0.07, upkeepPct: 0.005,
  }), [price, down, loanRate, tenure, rent, horizon, priceGrowth, investReturn]);

  const buyEnd = r.buy[horizon];
  const rentEnd = r.rent[horizon];
  const leader = buyEnd >= rentEnd ? "buying" : "renting";
  const crossover = r.buy.findIndex((b, i) => i > 0 && (b >= r.rent[i]) !== (r.buy[0] >= r.rent[0]));

  return (
    <div>
      <Slider label="Home price" value={price} min={2000000} max={30000000} step={500000} onChange={setPrice} format={lakh} />
      <Slider label={`Down payment (at least ${minDownPct}% under RBI loan limits)`} value={Math.max(downPct, minDownPct)} min={minDownPct} max={60} step={1} onChange={setDownPct} format={(v) => `${v}% · ${lakh((price * v) / 100)}`} />
      <Slider label="Rent for a similar home, per month" value={rent} min={5000} max={150000} step={1000} onChange={setRent} format={inr} />
      <Slider label="Home loan rate (assumed)" value={loanRate} min={6} max={12} step={0.25} onChange={setLoanRate} format={(v) => `${v}% a year`} />
      <Slider label="Loan tenure" value={tenure} min={5} max={30} step={1} onChange={setTenure} format={(v) => `${v} yrs`} />
      <Slider label="Compare over" value={horizon} min={3} max={30} step={1} onChange={setHorizon} format={(v) => `${v} yrs`} />
      <Slider label="Home price growth (assumed)" value={priceGrowth} min={0} max={10} step={0.5} onChange={setPriceGrowth} format={(v) => `${v}% a year`} />
      <Slider label="Return on money the renter invests (assumed)" value={investReturn} min={3} max={14} step={0.5} onChange={setInvestReturn} format={(v) => `${v}% a year`} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatBox label="Home loan EMI" value={inr(r.emi)} />
        <StatBox label={`Buyer's net worth, year ${horizon}`} value={lakh(buyEnd)} tone={leader === "buying" ? "good" : undefined} />
        <StatBox label={`Renter's net worth, year ${horizon}`} value={lakh(rentEnd)} tone={leader === "renting" ? "good" : undefined} />
      </div>

      <div style={{ marginTop: 16 }}>
        <LabChart ariaLabel="Net worth over time when buying versus renting" series={[
          { label: "Buy: home value − loan + any invested savings", color: "#2563eb", values: r.buy.slice(0, horizon + 1) },
          { label: "Rent: down payment and monthly savings invested", color: "#0ea05f", values: r.rent.slice(0, horizon + 1) },
        ]} xLabel={(i) => `Yr ${i}`} yFormat={lakh} />
      </div>

      <ShareLine text={`With these numbers, ${leader} leaves you about ${lakh(Math.abs(buyEnd - rentEnd))} ahead after ${horizon} years${crossover > 0 ? `, and the lead changes hands in year ${crossover}` : ""}. The right answer depends on the numbers, not on what relatives say.`} />
      <LabNote>Every rate here is an assumption, and none of them is a forecast. A home is also about stability, family needs and freedom to move, which no chart captures. The lab leaves out tax effects and the cost of selling.</LabNote>
      <HowCalculated>
        <p style={{ margin: "0 0 6px" }}>Both households spend the same cash each month. The buyer pays the EMI plus upkeep (assumed 0.5% of the home&apos;s value a year). The renter pays rent, which rises 5% a year (assumed). Whoever spends less that month invests the difference at the assumed return.</p>
        <p style={{ margin: "0 0 6px" }}>At the start, the renter invests what the buyer spent up front: the down payment plus 7% for stamp duty and registration (assumed; rates vary by state).</p>
        <p style={{ margin: 0 }}>Minimum down payment follows RBI&apos;s loan-to-value limits for housing loans: up to 90% of the price for loans up to ₹30 lakh, 80% up to ₹75 lakh, and 75% above that.</p>
      </HowCalculated>
    </div>
  );
}
