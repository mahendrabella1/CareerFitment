/**
 * Small shareable "rights cards" (plan section 6, "Other tools"). Every line
 * is a shortened version of a point in the linked guide (data/legal/guides.ts),
 * so the cards inherit that guide's sources and review status.
 */

export interface RightsCard {
  id: string;
  title: string;
  color: string;
  lines: string[];
  help: string;
  guideSlug: string;
}

export const RIGHTS_CARDS: RightsCard[] = [
  {
    id: "police",
    title: "If police stop or arrest you",
    color: "#1e3a8a",
    lines: [
      "Ask what you are being questioned or arrested for.",
      "You can tell a family member or friend where you are.",
      "You can speak to a lawyer. Free legal aid is available.",
      "After arrest, you must be taken to a magistrate within 24 hours.",
    ],
    help: "Legal aid 15100 · Emergency 112",
    guideSlug: "police-rights",
  },
  {
    id: "consumer",
    title: "Your rights as a consumer",
    color: "#0f766e",
    lines: [
      "A defective product can be repaired, replaced or refunded.",
      "A 'no exchange' sign does not remove your rights for defects.",
      "Ask the seller in writing first, then call 1915.",
      "No fee for claims up to ₹5 lakh. File within 2 years.",
    ],
    help: "National Consumer Helpline 1915",
    guideSlug: "faulty-product",
  },
  {
    id: "bank-fraud",
    title: "If money leaves your account",
    color: "#b91c1c",
    lines: [
      "Block the card or UPI and call 1930 straight away.",
      "Tell your bank in writing within 3 working days (5 calendar days from 1 Jan 2027).",
      "The bank must credit the amount back within 10 working days of your report while it investigates.",
      "No reply in 30 days? Go to the RBI Ombudsman free at cms.rbi.org.in.",
    ],
    help: "Cyber fraud 1930 · RBI 14448",
    guideSlug: "bank-problems",
  },
  {
    id: "loan-agents",
    title: "If loan agents harass you",
    color: "#7c2d12",
    lines: [
      "Recovery calls are allowed only between 8 am and 7 pm.",
      "No threats, abuse or shaming you to your contacts.",
      "Never pay anyone under threat.",
      "Report illegal loan apps on sachet.rbi.org.in, and threats to the police.",
    ],
    help: "Cyber fraud 1930 · Emergency 112",
    guideSlug: "loan-recovery",
  },
  {
    id: "ragging",
    title: "Ragging is banned",
    color: "#6d28d9",
    lines: [
      "Ragging in any form is banned in every college in India.",
      "Complain to the Anti-Ragging Committee or Squad.",
      "Punishments include suspension, expulsion and fines up to ₹25,000.",
      "It is never the junior's fault.",
    ],
    help: "Anti-Ragging Helpline 1800-180-5522",
    guideSlug: "ragging",
  },
  {
    id: "pay",
    title: "Your pay at work",
    color: "#166534",
    lines: [
      "You must get a written appointment letter.",
      "Monthly wages are due by the 7th of the next month.",
      "Overtime is paid at twice the normal rate.",
      "Final dues are due within 2 working days of leaving.",
    ],
    help: "Free legal aid 15100",
    guideSlug: "first-job",
  },
  {
    id: "posh",
    title: "Sexual harassment at work",
    color: "#9d174d",
    lines: [
      "Workplaces with 10 or more employees must have an Internal Committee.",
      "Complain in writing within 3 months of the incident.",
      "The inquiry must finish within 90 days and stay confidential.",
      "You can also file online on SHe-Box: shebox.wcd.gov.in.",
    ],
    help: "Women helpline 181 · NCW 14490",
    guideSlug: "workplace-harassment",
  },
  {
    id: "safe-touch",
    title: "Safe and unsafe touch",
    color: "#0369a1",
    lines: [
      "Your body belongs to you.",
      "If a touch feels wrong, it is never your fault.",
      "Safe adults don't ask children to keep secrets from their parents.",
      "Tell a trusted adult, or call 1098 yourself.",
    ],
    help: "Child Helpline 1098 · Emergency 112",
    guideSlug: "safe-unsafe-touch",
  },
  {
    id: "seniors",
    title: "Senior citizens' rights",
    color: "#854d0e",
    lines: [
      "Children and heirs must provide maintenance.",
      "A Tribunal can order up to ₹10,000 a month.",
      "Property given on condition of care can be reclaimed if the care stops.",
      "Don't sign papers you don't understand.",
    ],
    help: "Elderline 14567",
    guideSlug: "senior-citizens",
  },
  {
    id: "rti",
    title: "RTI in four steps",
    color: "#334155",
    lines: [
      "Fee: ₹10 for central offices (free for BPL).",
      "Reply within 30 days, or 48 hours for life or liberty.",
      "First appeal within 30 days; second appeal within 90 days.",
      "File central RTIs at rtionline.gov.in.",
    ],
    help: "rtionline.gov.in",
    guideSlug: "rti",
  },
];
