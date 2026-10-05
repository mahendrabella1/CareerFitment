/**
 * Time limits used by the deadline reminder tool. Each one is taken from a
 * guide in data/legal/guides.ts (same sources, same review schedule). The
 * tool adds the period to a date the learner enters; it never stores either.
 */

export interface LegalDeadline {
  id: string;
  label: string;
  /** What the learner should enter as the start date. */
  startLabel: string;
  amount: number;
  unit: "days" | "months" | "years";
  guideSlug: string;
  note: string;
}

export const LEGAL_DEADLINES: LegalDeadline[] = [
  {
    id: "consumer-complaint",
    label: "File a consumer commission complaint",
    startLabel: "Date the problem started (the cause of action)",
    amount: 2,
    unit: "years",
    guideSlug: "faulty-product",
    note: "Most consumer complaints must be filed within 2 years. File well before the last date.",
  },
  {
    id: "rbi-ombudsman-no-reply",
    label: "Go to the RBI Ombudsman (bank did not reply)",
    startLabel: "Date you complained to the bank",
    amount: 120,
    unit: "days",
    guideSlug: "bank-problems",
    note: "The bank has 30 days to reply. You then have 90 days to file at cms.rbi.org.in (RB-IOS 2026). If the bank wrote to you later than 30 days, count 90 days from its last reply instead.",
  },
  {
    id: "rbi-ombudsman-after-reply",
    label: "Go to the RBI Ombudsman (after a late or final bank reply)",
    startLabel: "Date of the bank's last reply, if it came more than 30 days after your complaint",
    amount: 90,
    unit: "days",
    guideSlug: "bank-problems",
    note: "Under RB-IOS 2026 you must file within 90 days of the later of the 30-day reply deadline and the bank's last communication.",
  },
  {
    id: "rti-reply",
    label: "RTI reply due",
    startLabel: "Date the RTI application was received",
    amount: 30,
    unit: "days",
    guideSlug: "rti",
    note: "If information concerns someone's life or liberty, the reply is due within 48 hours.",
  },
  {
    id: "rti-first-appeal",
    label: "File an RTI first appeal",
    startLabel: "Date the reply was due, or the date you got an unsatisfactory reply",
    amount: 30,
    unit: "days",
    guideSlug: "rti",
    note: "The first appeal goes to the officer senior to the Public Information Officer.",
  },
  {
    id: "rti-second-appeal",
    label: "File an RTI second appeal",
    startLabel: "Date of the first appeal decision (or the date it was due)",
    amount: 90,
    unit: "days",
    guideSlug: "rti",
    note: "The second appeal goes to the Central or State Information Commission.",
  },
  {
    id: "posh-complaint",
    label: "Complain to the Internal Committee (sexual harassment at work)",
    startLabel: "Date of the incident (or the last incident in a series)",
    amount: 3,
    unit: "months",
    guideSlug: "workplace-harassment",
    note: "The committee can allow up to 3 more months if something stopped you filing in time, but do not rely on that.",
  },
  {
    id: "gac-appeal",
    label: "Appeal to the Grievance Appellate Committee",
    startLabel: "Date of the platform grievance officer's decision",
    amount: 30,
    unit: "days",
    guideSlug: "data-privacy",
    note: "File at gac.gov.in.",
  },
  {
    id: "wage-claim",
    label: "File a claim for unpaid wages",
    startLabel: "Date the wages became due",
    amount: 3,
    unit: "years",
    guideSlug: "unpaid-salary",
    note: "Claims under the Code on Wages can be filed within 3 years. Act much sooner while records are fresh.",
  },
];

/** Adds the deadline's period to an ISO date (yyyy-mm-dd) in local calendar terms. */
export function addPeriod(isoDate: string, amount: number, unit: LegalDeadline["unit"]): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) return null;
  if (unit === "days") d.setDate(d.getDate() + amount);
  if (unit === "months") {
    const day = d.getDate();
    d.setDate(1);
    d.setMonth(d.getMonth() + amount);
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
  }
  if (unit === "years") {
    const day = d.getDate();
    const month = d.getMonth();
    d.setDate(1);
    d.setFullYear(d.getFullYear() + amount);
    d.setMonth(month);
    const lastDay = new Date(d.getFullYear(), month + 1, 0).getDate();
    d.setDate(Math.min(day, lastDay));
  }
  return d;
}

export { buildIcs } from "@/lib/calendar/ics";
