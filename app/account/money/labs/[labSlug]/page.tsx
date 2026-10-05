"use client";

import Link from "next/link";
import { CompoundingLab } from "@/components/money/CompoundingLab";
import { EmiLab } from "@/components/money/EmiLab";
import { GoalPlannerLab } from "@/components/money/GoalPlannerLab";
import { InflationLab } from "@/components/money/InflationLab";
import { CreditCardLab } from "@/components/money/CreditCardLab";
import { SaveVsGrowLab } from "@/components/money/SaveVsGrowLab";
import { SalarySlipLab } from "@/components/money/SalarySlipLab";
import { RentVsBuyLab } from "@/components/money/RentVsBuyLab";
import { labBySlug } from "@/data/money/labs";

export default function LabPage({ params }: { params: { labSlug: string } }) {
  const slug = params.labSlug;
  const lab = labBySlug(slug);

  if (!lab) {
    return (
      <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
        <Link href="/account/money/labs" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Money Labs</Link>
        <p style={{ marginTop: 20, color: "#888" }}>That Lab doesn&apos;t exist.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <Link href="/account/money/labs" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Money Labs</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 4px" }}>{lab.icon} {lab.title}</h1>
      <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px" }}>{lab.desc}</p>
      {slug === "compounding" && <CompoundingLab />}
      {slug === "inflation" && <InflationLab />}
      {slug === "emi" && <EmiLab />}
      {slug === "credit-card" && <CreditCardLab />}
      {slug === "save-vs-grow" && <SaveVsGrowLab />}
      {slug === "salary-slip" && <SalarySlipLab />}
      {slug === "goal-planner" && <GoalPlannerLab />}
      {slug === "rent-vs-buy" && <RentVsBuyLab />}
    </div>
  );
}
