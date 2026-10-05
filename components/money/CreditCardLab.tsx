"use client";

import { useMemo, useState } from "react";
import { Slider, inr } from "@/components/money/Slider";
import { HowCalculated, LabChart, LabNote, ShareLine, StatBox, lakh } from "@/components/money/LabChart";
import { cardPayoff } from "@/lib/money/labMath";

const duration = (months: number, cleared: boolean) => {
  if (!cleared) return "Over 50 years";
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y ? `${y} yr` : "", m ? `${m} mo` : ""].filter(Boolean).join(" ") || "0 mo";
};

export function CreditCardLab() {
  const [balance, setBalance] = useState(50000);
  const [rate, setRate] = useState(3.75); // % a month
  const [fixed, setFixed] = useState(5000);

  const { minOnly, planned } = useMemo(() => ({
    minOnly: cardPayoff({ balance, monthlyRate: rate / 100 }),
    planned: cardPayoff({ balance, monthlyRate: rate / 100, fixedPayment: fixed }),
  }), [balance, rate, fixed]);

  const months = Math.min(Math.max(minOnly.months, planned.months), 600);
  const step = months > 120 ? 12 : 1;
  // Pad the faster plan with zeros so both lines share one time axis, then sample yearly for long plans.
  const pick = (arr: number[]) => {
    const padded = arr.slice(0, months + 1);
    while (padded.length < months + 1) padded.push(0);
    return padded.filter((_, i) => i % step === 0);
  };

  const aha = minOnly.cleared
    ? `Paying only the minimum on a ${inr(balance)} card bill takes ${duration(minOnly.months, true)} and costs ${inr(minOnly.totalInterestAndGst)} in interest and GST. Paying ${inr(fixed)} a month clears it in ${duration(planned.months, planned.cleared)}.`
    : `Paying only the minimum on a ${inr(balance)} card bill would take more than 50 years to clear.`;

  return (
    <div>
      <Slider label="Card balance" value={balance} min={5000} max={300000} step={5000} onChange={setBalance} format={inr} />
      <Slider label="Interest rate (check your card)" value={rate} min={1} max={4.5} step={0.05} onChange={setRate} format={(v) => `${v.toFixed(2)}% a month (${(v * 12).toFixed(1)}% a year)`} />
      <Slider label="What you could pay instead, each month" value={fixed} min={1000} max={50000} step={500} onChange={setFixed} format={inr} />

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <StatBox label="Minimum only: time to clear" value={duration(minOnly.months, minOnly.cleared)} tone="bad" />
        <StatBox label="Minimum only: interest + GST" value={inr(minOnly.totalInterestAndGst)} tone="bad" />
        <StatBox label={`${inr(fixed)} a month: time`} value={duration(planned.months, planned.cleared)} tone="good" />
        <StatBox label={`${inr(fixed)} a month: interest + GST`} value={inr(planned.totalInterestAndGst)} tone="good" />
      </div>

      <div style={{ marginTop: 16 }}>
        <LabChart
          ariaLabel="Card balance over time: minimum due only versus a fixed payment"
          series={[
            { label: "Paying only the minimum", color: "#dc2626", values: pick(minOnly.balances) },
            { label: `Paying ${inr(fixed)} a month`, color: "#0ea05f", values: pick(planned.balances) },
          ]}
          xLabel={(i) => (step === 12 ? `Yr ${i}` : `Mo ${i}`)}
          yFormat={lakh}
        />
      </div>

      <ShareLine text={aha} />
      <LabNote>
        Many Indian cards charge about 3.75% a month (45% a year) on unpaid balances, as in Federal Bank&apos;s and Indian Bank&apos;s published terms; some charge less. Your own card&apos;s rate and minimum-due rule are in its MITC (Most Important Terms and Conditions). This lab assumes you stop using the card. In real life, once you carry a balance, new purchases are usually charged interest from the day you buy.
      </LabNote>
      <HowCalculated>
        <p style={{ margin: "0 0 6px" }}>Each month: interest = balance × monthly rate, and GST of 18% is added on that interest.</p>
        <p style={{ margin: "0 0 6px" }}>Minimum due = the highest of 5% of the bill, the month&apos;s interest plus GST, or ₹200. The 5% and ₹200 are common but assumed. The rule that the minimum must at least cover interest and taxes, so the debt never grows while you pay it, comes from RBI&apos;s Credit Card and Debit Card Directions, 2022.</p>
        <p style={{ margin: 0 }}>The lab stops counting at 50 years.</p>
      </HowCalculated>
    </div>
  );
}
