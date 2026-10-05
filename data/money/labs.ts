export type LabSlug = "compounding" | "inflation" | "emi" | "credit-card" | "save-vs-grow" | "salary-slip" | "goal-planner" | "rent-vs-buy";

export interface LabDef {
  slug: LabSlug;
  icon: string;
  title: string;
  desc: string;
  worlds: string;
}

export const LABS: LabDef[] = [
  { slug: "compounding", icon: "📈", title: "Compounding Playground", desc: "See how starting early can out-grow starting big", worlds: "All ages" },
  { slug: "inflation", icon: "⏳", title: "Inflation Time Machine", desc: "Travel from 1990 to 2045 and watch what ₹100 buys", worlds: "Class 9 and up" },
  { slug: "emi", icon: "💳", title: "EMI Truth Teller", desc: "What a \"no-cost EMI\" actually costs, total", worlds: "Class 9 and up" },
  { slug: "credit-card", icon: "🪤", title: "Credit Card Minimum-Due Trap", desc: "How long paying only the minimum really takes", worlds: "College and working" },
  { slug: "save-vs-grow", icon: "🌱", title: "Save vs Grow", desc: "Savings account, deposit or fund, side by side with the risk", worlds: "Class 9 and up" },
  { slug: "salary-slip", icon: "🧾", title: "Salary Slip Decoder", desc: "From CTC to the money that reaches your bank", worlds: "College and working" },
  { slug: "goal-planner", icon: "🎯", title: "Goal Planner", desc: "Turn any goal into a monthly saving number", worlds: "All ages" },
  { slug: "rent-vs-buy", icon: "🏠", title: "Rent vs Buy", desc: "Net worth over time on both paths", worlds: "Working professionals" },
];

export const labBySlug = (slug: string) => LABS.find((l) => l.slug === slug);
