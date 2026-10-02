"use client";

import Link from "next/link";
import { CompoundingLab } from "@/components/money/CompoundingLab";
import { EmiLab } from "@/components/money/EmiLab";
import { GoalPlannerLab } from "@/components/money/GoalPlannerLab";

const TITLES: Record<string, string> = { compounding: "Compounding Playground", emi: "EMI Truth Teller", "goal-planner": "Goal Planner" };

export default function LabPage({ params }: { params: { labSlug: string } }) {
  const slug = params.labSlug;

  if (!TITLES[slug]) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
        <Link href="/account/money/labs" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Money Labs</Link>
        <p style={{ marginTop: 20, color: "#888" }}>That Lab doesn't exist.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "32px 20px" }}>
      <Link href="/account/money/labs" style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← Money Labs</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>{TITLES[slug]}</h1>
      {slug === "compounding" && <CompoundingLab />}
      {slug === "emi" && <EmiLab />}
      {slug === "goal-planner" && <GoalPlannerLab />}
    </div>
  );
}
