import type { Effects, SimState } from "@/lib/money/simulation";

export type WorldId = "pocket-money" | "first-wallet" | "first-salary";

export interface WorldDef {
  id: WorldId;
  title: string;
  ages: string;
  summary: string;
  start: SimState;
  saveTargetMonths: number;
}

export const WORLDS: WorldDef[] = [
  {
    id: "pocket-money",
    title: "Pocket Money Town",
    ages: "Class 6 to 8",
    summary: "₹500 a month of pocket money. Needs and wants, a piggy bank, and small events from school life.",
    start: { cash: 100, savings: 0, invested: 0, debt: 0, debtRateMonthly: 0.03, creditScore: 300, monthlyIncome: 500, fixedNeeds: 250, missedPayments: 0, scamsAvoided: 0, scamsFallen: 0 },
    saveTargetMonths: 0.75,
  },
  {
    id: "first-wallet",
    title: "First Wallet",
    ages: "Class 9 to 12",
    summary: "₹1,500 a month plus occasional gift money. A first bank account, UPI payments and peer pressure.",
    start: { cash: 300, savings: 0, invested: 0, debt: 0, debtRateMonthly: 0.03, creditScore: 300, monthlyIncome: 1500, fixedNeeds: 800, missedPayments: 0, scamsAvoided: 0, scamsFallen: 0 },
    saveTargetMonths: 1.5,
  },
  {
    id: "first-salary",
    title: "First Salary",
    ages: "College and early career",
    summary: "₹35,000 a month from a first job in a new city, simplified to in-hand pay. Rent, bills, credit offers and a first SIP.",
    start: { cash: 5000, savings: 0, invested: 0, debt: 0, debtRateMonthly: 0.03, creditScore: 650, monthlyIncome: 35000, fixedNeeds: 22500, missedPayments: 0, scamsAvoided: 0, scamsFallen: 0 },
    saveTargetMonths: 6,
  },
];

export interface SimChoice {
  id: string;
  label: string;
  why: string;
  effects: (amount: number) => Effects;
}

export interface SimEventDef {
  id: string;
  kind: "shock" | "temptation" | "opportunity" | "danger" | "life";
  title: string;
  body: string;
  amount: Partial<Record<WorldId, number>>;
  weight: number;
  conditions?: { emergencyFundBelow?: number; debtAbove?: number };
  concept: { label: string; topic: string };
  choices: SimChoice[];
}

export const SIM_EVENTS: SimEventDef[] = [
  {
    id: "phone-screen-breaks",
    kind: "shock",
    title: "Your phone screen breaks",
    body: "The screen cracks when your phone drops. A repair quote arrives.",
    amount: { "pocket-money": 600, "first-wallet": 1500, "first-salary": 3000 },
    weight: 10,
    conditions: { emergencyFundBelow: 3000 },
    concept: { label: "Emergency fund", topic: "Saving" },
    choices: [
      { id: "pay-now", label: "Pay for the repair now", why: "The money leaves your cash straight away. Affordable only if the cash was set aside.", effects: (a) => ({ cash: -a }) },
      { id: "repair-on-emi", label: "Repair it on an EMI", why: "The cost moves into debt. Interest and fees add to what you finally pay.", effects: (a) => ({ debt: a }) },
      { id: "wait", label: "Use it cracked for now", why: "No money spent this month. The risk is a bigger repair later if the damage spreads.", effects: () => ({}) },
    ],
  },
  {
    id: "medical-bill",
    kind: "shock",
    title: "A family medical bill",
    body: "A family member needs a doctor's visit and tests. The hospital asks for payment.",
    amount: { "first-wallet": 1200, "first-salary": 4000 },
    weight: 6,
    conditions: { emergencyFundBelow: 4000 },
    concept: { label: "Emergency fund", topic: "Saving" },
    choices: [
      { id: "pay-cash", label: "Pay from cash this month", why: "Quick and simple. If cash runs out, savings cover the gap first, then debt.", effects: (a) => ({ cash: -a }) },
      { id: "borrow", label: "Borrow from a personal loan", why: "The loan pays the hospital, so your cash stays intact. You now owe the bill plus interest and fees.", effects: (a) => ({ debt: Math.round(a * 1.15) }) },
    ],
  },
  {
    id: "bike-repair",
    kind: "shock",
    title: "Your bike needs a repair",
    body: "The bike won't start in the morning. The mechanic says the clutch needs replacing.",
    amount: { "first-wallet": 800, "first-salary": 2000 },
    weight: 7,
    conditions: { emergencyFundBelow: 2500 },
    concept: { label: "Emergency fund", topic: "Saving" },
    choices: [
      { id: "pay", label: "Pay the mechanic now", why: "The bike is fixed the same day, and the cost comes from this month's money.", effects: (a) => ({ cash: -a }) },
      { id: "delay", label: "Take the bus for a month", why: "Costs less now, but bus fares and lost time add up over weeks.", effects: () => ({}) },
    ],
  },
  {
    id: "diwali-bonus",
    kind: "opportunity",
    title: "A festival bonus arrives",
    body: "A relative sends money for the festival. Nothing is required from you.",
    amount: { "pocket-money": 300, "first-wallet": 1000 },
    weight: 6,
    concept: { label: "Saving", topic: "Saving" },
    choices: [
      { id: "cash", label: "Keep it as cash", why: "Easy to spend, and it stays idle. Inflation slowly reduces what it can buy.", effects: (a) => ({ cash: a }) },
      { id: "savings", label: "Move it to savings", why: "Still easy to reach, and it now counts toward your emergency fund.", effects: (a) => ({ savings: a }) },
    ],
  },
  {
    id: "gig-work",
    kind: "opportunity",
    title: "A short paid gig",
    body: "A local business needs help for two weekends and offers pay for the work.",
    amount: { "first-wallet": 400, "first-salary": 5000 },
    weight: 5,
    concept: { label: "Gig and freelance income", topic: "Earning" },
    choices: [
      { id: "take", label: "Take the gig", why: "Extra income this month. Check whether it is paid on time and in writing.", effects: (a) => ({ cash: a }) },
      { id: "decline", label: "Decline and keep the weekend", why: "No extra money. Your free time is worth something too.", effects: () => ({}) },
    ],
  },
  {
    id: "sneakers-sale",
    kind: "temptation",
    title: "Sneakers on sale",
    body: "A shop sends a notification. The pair you wanted is half price, for today only.",
    amount: { "pocket-money": 400, "first-wallet": 1000, "first-salary": 3000 },
    weight: 9,
    concept: { label: "The 24-hour rule", topic: "Spending" },
    choices: [
      { id: "buy", label: "Buy them today", why: "A want, paid from cash. Fine if your needs and savings are already covered.", effects: (a) => ({ cash: -a }) },
      { id: "wait", label: "Wait 24 hours and decide", why: "Most urges fade. A sale that is still good tomorrow is a more honest purchase.", effects: () => ({}) },
    ],
  },
  {
    id: "friend-cafe",
    kind: "life",
    title: "Friends are going to a cafe",
    body: "Your group is heading to a cafe after school. Everyone is paying for their own drink.",
    amount: { "pocket-money": 150, "first-wallet": 300 },
    weight: 6,
    concept: { label: "Needs vs wants", topic: "Spending" },
    choices: [
      { id: "go", label: "Go and pay for your own", why: "Social time has real value. It is a want, so it should fit inside the wants jar.", effects: (a) => ({ cash: -a }) },
      { id: "stay", label: "Stay in and save it", why: "Saves money. The trade-off is time with friends, which also counts.", effects: () => ({}) },
    ],
  },
  {
    id: "kyc-sms",
    kind: "danger",
    title: "A 'KYC update' text message",
    body: "A message says your account will be blocked today unless you update your KYC through a link.",
    amount: { "pocket-money": 300, "first-wallet": 1000, "first-salary": 5000 },
    weight: 8,
    concept: { label: "Protection and scams", topic: "Protect" },
    choices: [
      { id: "click", label: "Click the link and update", why: "This is how phishing works. Banks do not send KYC links by SMS, and the link takes your details.", effects: (a) => ({ cash: -a, scamsFallen: 1 }) },
      { id: "official", label: "Call the bank on its official number", why: "The safe check. Use the number printed on your card or on the bank's official website.", effects: () => ({ scamsAvoided: 1 }) },
    ],
  },
  {
    id: "otp-stranger",
    kind: "danger",
    title: "A caller asks for your OTP",
    body: "A caller says they are from your bank and needs the OTP to stop a block on your account.",
    amount: { "pocket-money": 500, "first-wallet": 1000, "first-salary": 5000 },
    weight: 8,
    concept: { label: "UPI PIN vs OTP", topic: "Digital payments" },
    choices: [
      { id: "share", label: "Share the OTP to stop the block", why: "Banks never ask for an OTP. Sharing it lets the caller move money out.", effects: (a) => ({ cash: -a, scamsFallen: 1 }) },
      { id: "hang-up", label: "Hang up and call the bank yourself", why: "Correct. Real banks do not ask for OTPs over the phone.", effects: () => ({ scamsAvoided: 1 }) },
    ],
  },
  {
    id: "investment-group",
    kind: "danger",
    title: "An 'investment doubling' group",
    body: "A WhatsApp group promises that a small deposit doubles in 30 days, guaranteed, and asks you to join today.",
    amount: { "first-wallet": 1000, "first-salary": 10000 },
    weight: 6,
    concept: { label: "Risk and return", topic: "Investing" },
    choices: [
      { id: "invest", label: "Join and invest", why: "Guaranteed high returns with pressure to act fast are classic warning signs. The money is usually lost.", effects: (a) => ({ cash: -a, scamsFallen: 1 }) },
      { id: "decline", label: "Decline and leave the group", why: "Correct. Real investments carry risk and do not promise doubling in a month.", effects: () => ({ scamsAvoided: 1 }) },
    ],
  },
  {
    id: "loan-app-offer",
    kind: "temptation",
    title: "An instant loan offer",
    body: "A loan app offers money in minutes, with no paperwork, for a trip you have been wanting.",
    amount: { "first-salary": 10000 },
    weight: 6,
    conditions: { debtAbove: 0 },
    concept: { label: "What interest really costs", topic: "Borrowing" },
    choices: [
      { id: "take", label: "Take the instant loan", why: "The loan pays for the trip, then you repay more than you borrowed because of the fee and interest. Check the total repayment first.", effects: (a) => ({ debt: Math.round(a * 1.25) }) },
      { id: "decline", label: "Decline the offer", why: "No new debt. The trip can wait until it is affordable from cash.", effects: () => ({}) },
    ],
  },
  {
    id: "no-cost-emi",
    kind: "temptation",
    title: "'No-cost EMI' on a new phone",
    body: "A shop offers a new phone on no-cost EMI for 12 months, with no visible interest.",
    amount: { "first-salary": 24000 },
    weight: 7,
    concept: { label: "What an EMI really costs", topic: "Borrowing" },
    choices: [
      { id: "emi", label: "Take the no-cost EMI", why: "The cost is built into the price. The total you pay is higher than the cash price.", effects: (a) => ({ debt: Math.round(a * 1.12) }) },
      { id: "cash", label: "Buy a cheaper phone in cash", why: "A smaller purchase, paid for from cash, with no debt.", effects: (a) => ({ cash: -Math.round(a * 0.4) }) },
    ],
  },
  {
    id: "price-rise",
    kind: "life",
    title: "Prices go up",
    body: "Your rent, groceries and bus fares all rise next month. Your needs now cost more every month.",
    amount: { "pocket-money": 30, "first-wallet": 80, "first-salary": 1500 },
    weight: 5,
    concept: { label: "Inflation", topic: "Inflation" },
    choices: [
      { id: "absorb", label: "Absorb it in your needs", why: "Your monthly needs rise for good. Plan your budget around the higher figure.", effects: (a) => ({ fixedNeeds: a }) },
    ],
  },
];

export function eventsForWorld(world: WorldId): (SimEventDef & { resolvedAmount: number })[] {
  return SIM_EVENTS.filter((e) => e.amount[world] !== undefined).map((e) => ({ ...e, resolvedAmount: e.amount[world] as number }));
}
