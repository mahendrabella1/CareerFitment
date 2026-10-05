import { cycleDate, liveStatus, type ScholarshipDef } from "@/data/scholarships/scholarships";

const fmt = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/** A small chip showing whether a scholarship is open, closed, coming up or state-run, with its closing date. */
export function StatusChip({ scholarship, now = new Date() }: { scholarship: ScholarshipDef; now?: Date }) {
  const st = liveStatus(scholarship, now);
  const closes = cycleDate(scholarship.cycle?.closesAt, true);
  const tentative = scholarship.cycle?.tentative;
  let label = "";
  let bg = "#f1f5f9";
  let fg = "#475569";
  if (st === "open" || st === "renewal-only") {
    const days = closes ? Math.ceil((closes.getTime() - now.getTime()) / 86_400_000) : null;
    label = `${st === "renewal-only" ? "Renewals open" : "Open"}${closes ? ` · closes ${fmt(closes)}` : ""}${tentative ? " (reported)" : ""}`;
    bg = days !== null && days <= 7 ? "#fef3c7" : "#dcfce7";
    fg = days !== null && days <= 7 ? "#92400e" : "#166534";
  } else if (st === "closed") {
    label = "Closed for this cycle";
    bg = "#f1f5f9";
    fg = "#64748b";
  } else if (st === "upcoming") {
    label = "Next call expected";
    bg = "#e0e7ff";
    fg = "#3730a3";
  } else if (st === "varies") {
    label = "Dates vary by state";
    bg = "#f1f5f9";
    fg = "#475569";
  } else {
    return null;
  }
  return <span style={{ fontSize: 11, fontWeight: 800, color: fg, background: bg, borderRadius: 999, padding: "3px 9px", flex: "none", whiteSpace: "nowrap" }}>{label}</span>;
}
