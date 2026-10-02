"use client";

import { useMemo, useState } from "react";
import { Slider, inr, LAB_ACCENT } from "@/components/money/Slider";

export function GoalPlannerLab() {
  const [goal, setGoal] = useState(45000);
  const [months, setMonths] = useState(12);
  const [currentMonthly, setCurrentMonthly] = useState(2000);

  const { required, onTrack, monthsAtCurrentRate } = useMemo(() => {
    const req = goal / months;
    const track = currentMonthly >= req;
    const monthsNeeded = currentMonthly > 0 ? Math.ceil(goal / currentMonthly) : Infinity;
    return { required: req, onTrack: track, monthsAtCurrentRate: monthsNeeded };
  }, [goal, months, currentMonthly]);

  return (
    <div>
      <Slider label="Goal amount" value={goal} min={1000} max={300000} step={500} onChange={setGoal} format={inr} />
      <Slider label="Target, in months" value={months} min={1} max={60} step={1} onChange={setMonths} format={(v) => `${v} months`} />
      <Slider label="What you're saving now, per month" value={currentMonthly} min={0} max={20000} step={100} onChange={setCurrentMonthly} format={inr} />

      <div style={{ border: "1px solid #eee", borderRadius: 10, padding: "14px 18px", marginTop: 20 }}>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>To reach your goal on time, you need to save</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: LAB_ACCENT }}>{inr(required)} / month</div>
      </div>

      <div style={{
        marginTop: 14, borderRadius: 10, padding: "12px 16px",
        background: onTrack ? "#dcfce7" : "#fef3c7", color: onTrack ? "#166534" : "#92400e",
      }}>
        {onTrack
          ? `You're on track - at ${inr(currentMonthly)}/month, you'll reach ${inr(goal)} right on schedule, or earlier.`
          : currentMonthly > 0
            ? `At ${inr(currentMonthly)}/month, you'd actually reach ${inr(goal)} in about ${monthsAtCurrentRate} months - ${monthsAtCurrentRate - months} month${monthsAtCurrentRate - months === 1 ? "" : "s"} later than planned.`
            : `You're not saving toward this goal yet - start with even ${inr(required)}/month to stay on schedule.`}
      </div>
    </div>
  );
}
