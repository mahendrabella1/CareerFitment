export type LabSlug = "compounding" | "inflation" | "emi" | "credit-card" | "save-vs-grow" | "salary-slip" | "goal-planner" | "rent-vs-buy";

export interface LabDef {
  slug: LabSlug;
  icon: string;
  /** Icon name from app/Icons.tsx for the lab's tile. */
  glyph: string;
  title: string;
  desc: string;
  worlds: string;
  /** "What you'll learn" beside the title. */
  learn: string[];
  /** "How to use it" - the three moves that show the point of the lab. */
  steps: string[];
}

export const LABS: LabDef[] = [
  {
    slug: "compounding", icon: "📈", glyph: "explain", title: "Compounding Playground", desc: "See how starting early can out-grow starting big", worlds: "All ages",
    learn: ["Why starting early can beat starting with more", "How much of the final amount is growth, not your own money"],
    steps: ["Set an amount you could really save every month.", "Change the years: try 10, then 20, then 30.", "Lower the assumed return to see a cautious case."],
  },
  {
    slug: "inflation", icon: "⏳", glyph: "clock", title: "Inflation Time Machine", desc: "Travel from 1990 to 2045 and watch what ₹100 buys", worlds: "Class 9 and up",
    learn: ["What ₹100 bought in different years", "Why money left idle loses value over time"],
    steps: ["Pick an everyday item.", "Move the slider to travel to a year.", "Compare its price then with today."],
  },
  {
    slug: "emi", icon: "💳", glyph: "calendar", title: "EMI Truth Teller", desc: "What a \"no-cost EMI\" actually costs, total", worlds: "Class 9 and up",
    learn: ["The real total you pay on an EMI purchase", "Why a \"no-cost EMI\" can still cost you"],
    steps: ["Set the price of something you want.", "Set the interest rate and the number of months.", "Add the processing fee and compare the total with the price."],
  },
  {
    slug: "credit-card", icon: "🪤", glyph: "card", title: "Credit Card Minimum-Due Trap", desc: "How long paying only the minimum really takes", worlds: "College and working",
    learn: ["How long paying only the minimum due takes", "How much interest and GST that adds up to"],
    steps: ["Set a card balance.", "Check the monthly interest rate on your card's statement.", "Set what you could pay each month and compare the two plans."],
  },
  {
    slug: "save-vs-grow", icon: "🌱", glyph: "score", title: "Save vs Grow", desc: "Savings account, deposit or fund, side by side with the risk", worlds: "Class 9 and up",
    learn: ["How a savings account, a deposit and a fund grow side by side", "What the risk looks like when markets fall"],
    steps: ["Choose a monthly or a one-time amount.", "Set the amount and the number of years.", "Switch on the market fall and inflation options to see the risk."],
  },
  {
    slug: "salary-slip", icon: "🧾", glyph: "doc", title: "Salary Slip Decoder", desc: "From CTC to the money that reaches your bank", worlds: "College and working",
    learn: ["Why your CTC is not what reaches your bank", "What PF, gratuity, professional tax and income tax take out"],
    steps: ["Enter the CTC from an offer letter.", "Pick the state where you will work.", "Read the breakdown from CTC down to in-hand pay."],
  },
  {
    slug: "goal-planner", icon: "🎯", glyph: "target", title: "Goal Planner", desc: "Turn any goal into a monthly saving number", worlds: "All ages",
    learn: ["How to turn any goal into a monthly number", "Whether what you save now will get you there"],
    steps: ["Set your goal amount.", "Choose how many months you have.", "Enter what you already save each month."],
  },
  {
    slug: "rent-vs-buy", icon: "🏠", glyph: "home", title: "Rent vs Buy", desc: "Net worth over time on both paths", worlds: "Working professionals",
    learn: ["How renting and buying compare in net worth over the years", "Which assumptions change the answer"],
    steps: ["Set the home price and the down payment.", "Set the rent for a similar home.", "Move the growth and return assumptions to test the result."],
  },
];

export const labBySlug = (slug: string) => LABS.find((l) => l.slug === slug);
