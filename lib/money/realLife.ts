/**
 * Money Life "Real Life" world: 10 fast-forward years, one decision per year.
 * Pure and deterministic, so every learner faces the same years and outcomes
 * depend only on choices. All rates and prices are game assumptions shown in
 * the UI; nothing here names or recommends a product.
 */

export const RL_ASSUMPTIONS = {
  incomeGrowth: 0.06,
  costGrowth: 0.05,
  investReturn: 0.1,
  savingsReturn: 0.035,
  endowmentReturn: 0.05,
  homeGrowth: 0.05,
  homeUpkeep: 0.005,
  homeLoanRate: 0.085,
  carLoanRate: 0.09,
  personalLoanRate: 0.14,
  carDepreciation: 0.15,
  homePrice: 7000000,
  upfrontCostPct: 0.07,
};

export interface Loan {
  value: number; // asset value
  loan: number;
  emiMonthly: number;
  rate: number;
}

export interface RLState {
  year: number; // years completed
  income: number; // household take-home, per year
  living: number; // living costs excluding housing, per year
  rent: number; // per year, while renting
  renting: boolean;
  emergency: number;
  invested: number;
  eduFund: number;
  endowmentValue: number;
  home: Loan | null;
  car: Loan | null;
  otherDebt: number;
  term: boolean;
  termPremium: number;
  endowmentPremium: number;
  parentsCover: boolean;
  parentsPremium: number;
  eduAnnual: number;
  eduStartsYear: number | null;
  extraInvestShare: number;
  incomeGap: number; // share of this year's income lost
  raiseNextYear: number;
  oneOffCost: number; // paid this year from cash flow
  oneOffBorrow: number; // added to other debt this year
  bonus: number;
  marketThisYear: number | null;
  marketNextYear: number | null;
  sellAfterYear: boolean;
}

export interface YearLog {
  year: number;
  decision: string;
  choice: string;
  tradeOff: string;
  netWorth: number;
  surplus: number;
}

export const RL_START: RLState = {
  year: 0, income: 1500000, living: 600000, rent: 300000, renting: true,
  emergency: 300000, invested: 1000000, eduFund: 0, endowmentValue: 0,
  home: null, car: null, otherDebt: 0,
  term: false, termPremium: 0, endowmentPremium: 0, parentsCover: false, parentsPremium: 0,
  eduAnnual: 0, eduStartsYear: null, extraInvestShare: 0,
  incomeGap: 0, raiseNextYear: 0, oneOffCost: 0, oneOffBorrow: 0, bonus: 0,
  marketThisYear: null, marketNextYear: null, sellAfterYear: false,
};

export function emi(principal: number, annualRate: number, years: number) {
  const r = annualRate / 12;
  const n = years * 12;
  return principal <= 0 ? 0 : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Pays a loan for 12 months; returns the amount paid. */
function payYear(l: Loan): number {
  let paid = 0;
  for (let m = 0; m < 12 && l.loan > 0.5; m++) {
    const interest = (l.loan * l.rate) / 12;
    const pay = Math.min(l.emiMonthly, l.loan + interest);
    l.loan = l.loan + interest - pay;
    paid += pay;
  }
  if (l.loan < 0.5) l.loan = 0;
  return paid;
}

export function netWorthRL(s: RLState) {
  return s.emergency + s.invested + s.eduFund + s.endowmentValue
    + (s.home ? s.home.value - s.home.loan : 0) + (s.car ? s.car.value - s.car.loan : 0) - s.otherDebt;
}

const fmtL = (v: number) => `₹${(v / 100000).toFixed(v >= 1e6 ? 0 : 1)} lakh`;

/** Takes money for an up-front payment: emergency fund first (keeping 3 months of living costs), then investments. */
function spendFromSavings(s: RLState, amount: number) {
  const keep = s.living / 4;
  const fromEmergency = Math.min(Math.max(0, s.emergency - keep), amount);
  s.emergency -= fromEmergency;
  let left = amount - fromEmergency;
  const fromInvested = Math.min(s.invested, left);
  s.invested -= fromInvested;
  left -= fromInvested;
  if (left > 0) {
    const last = Math.min(s.emergency, left);
    s.emergency -= last;
    left -= last;
  }
  s.otherDebt += left;
}

export function availableForDownPayment(s: RLState) {
  return Math.max(0, s.emergency - s.living / 4) + s.invested;
}

export interface RLOption {
  id: string;
  label: string;
  tradeOff: string;
  disabled?: string;
  apply: (s: RLState) => void;
}

export interface RLDecision {
  year: number;
  title: string;
  body: (s: RLState) => string;
  concept: string;
  options: (s: RLState) => RLOption[];
}

const homeDown = RL_ASSUMPTIONS.homePrice * 0.2;
const homeUpfront = homeDown + RL_ASSUMPTIONS.homePrice * RL_ASSUMPTIONS.upfrontCostPct;

function buyHome(years: number): RLOption["apply"] {
  return (s) => {
    spendFromSavings(s, homeUpfront);
    const loan = RL_ASSUMPTIONS.homePrice - homeDown;
    s.home = { value: RL_ASSUMPTIONS.homePrice, loan, emiMonthly: emi(loan, RL_ASSUMPTIONS.homeLoanRate, years), rate: RL_ASSUMPTIONS.homeLoanRate };
    s.renting = false;
  };
}

const HOSPITAL_BILL = 500000;
const COVERED_SHARE_PAID = 50000; // co-pay and items the policy doesn't cover (assumed)

export const RL_DECISIONS: RLDecision[] = [
  {
    year: 1,
    title: "Protect your family",
    concept: "Term vs endowment plans",
    body: () => "You're 32, with a partner and a young child who depend on your income. An agent and a friend both suggest life insurance, but different kinds.",
    options: () => [
      { id: "term", label: "Term insurance: ₹1 crore cover for about ₹15,000 a year", tradeOff: "A large cover for a small premium. Nothing comes back if you outlive the policy, and that's the point: it is pure protection.", apply: (s) => { s.term = true; s.termPremium = 15000; } },
      { id: "endowment", label: "Endowment plan: ₹10 lakh cover for ₹1,00,000 a year", tradeOff: "You get money back at maturity, but the cover is one-tenth of the term plan's for over six times the premium, and the game assumes a modest 5% return. Leaving early usually loses money.", apply: (s) => { s.endowmentPremium = 100000; } },
      { id: "none", label: "No life cover for now", tradeOff: "No premiums, so more to invest. If something happened to you, your family would have only your savings.", apply: () => undefined },
    ],
  },
  {
    year: 2,
    title: "Your parents' health",
    concept: "Health insurance",
    body: () => "Your parents are in their 60s and have no health insurance. A family floater for them would cost about ₹40,000 a year in this game, and premiums usually rise with age.",
    options: () => [
      { id: "cover", label: "Buy health cover for your parents", tradeOff: "A cost every year, whether or not anyone falls ill, but a large hospital bill won't empty your savings.", apply: (s) => { s.parentsCover = true; s.parentsPremium = 40000; } },
      { id: "skip", label: "Skip it and keep the money", tradeOff: "No premium. Any hospital bill comes from your savings or a loan.", apply: () => undefined },
    ],
  },
  {
    year: 3,
    title: "Rent or buy a home",
    concept: "Rent vs buy",
    body: (s) => `A ₹70 lakh flat is for sale near work. Buying needs about ${fmtL(homeUpfront)} up front (20% down payment plus 7% stamp duty and registration). You have ${fmtL(availableForDownPayment(s))} you could use. Your rent is ${fmtL(s.rent)} a year.`,
    options: (s) => {
      const short = availableForDownPayment(s) < homeUpfront ? `You need ${fmtL(homeUpfront)} up front but have ${fmtL(availableForDownPayment(s))}.` : undefined;
      return [
        { id: "rent", label: "Keep renting and keep investing", tradeOff: "Freedom to move and money stays invested, but rent rises every year and you don't build a home of your own.", apply: () => undefined },
        { id: "buy-20", label: "Buy with a 20-year home loan", tradeOff: `Lower EMI (about ₹${Math.round(emi(RL_ASSUMPTIONS.homePrice - homeDown, RL_ASSUMPTIONS.homeLoanRate, 20)).toLocaleString("en-IN")} a month) but more interest paid in total. Your savings go into the down payment.`, disabled: short, apply: buyHome(20) },
        { id: "buy-15", label: "Buy with a 15-year home loan", tradeOff: `Higher EMI (about ₹${Math.round(emi(RL_ASSUMPTIONS.homePrice - homeDown, RL_ASSUMPTIONS.homeLoanRate, 15)).toLocaleString("en-IN")} a month) and a tighter budget, but the loan ends 5 years sooner with far less interest.`, disabled: short, apply: buyHome(15) },
      ];
    },
  },
  {
    year: 4,
    title: "Your child's education fund",
    concept: "Compounding",
    body: () => "Your child will start college in about 14 years. Fees will be far higher by then.",
    options: () => [
      { id: "now", label: "Start ₹10,000 a month now", tradeOff: "Starting early means time does more of the work. It's money you can't spend today.", apply: (s) => { s.eduAnnual = 120000; } },
      { id: "later", label: "Start ₹20,000 a month in year 7", tradeOff: "More spending money now, but you'll need to save twice as much later to catch up, and get less growth.", apply: (s) => { s.eduStartsYear = 7; } },
      { id: "skip", label: "Don't plan; pay from savings when it comes", tradeOff: "Most flexible today. The bill will arrive anyway and may need a loan.", apply: () => undefined },
    ],
  },
  {
    year: 5,
    title: "The market falls",
    concept: "Risk and return",
    body: (s) => `Share markets fall 25% this year. Your investments of ${fmtL(s.invested)} will drop with them. Friends are selling.`,
    options: () => [
      { id: "stay", label: "Stay invested", tradeOff: "You take the fall on paper and stay in for the recovery (the game assumes a 30% rebound next year). Real recoveries can take longer.", apply: (s) => { s.marketThisYear = -0.25; s.marketNextYear = 0.3; } },
      { id: "sell", label: "Sell everything after the fall and keep it as cash", tradeOff: "No more worry this year, but the loss becomes permanent and you miss the rebound.", apply: (s) => { s.marketThisYear = -0.25; s.marketNextYear = RL_ASSUMPTIONS.investReturn; s.sellAfterYear = true; } },
    ],
  },
  {
    year: 6,
    title: "A parent is in hospital",
    concept: "Emergency fund",
    body: (s) => s.parentsCover
      ? `Your father needs surgery: a ₹5 lakh bill. The health cover you bought in year 2 pays most of it; you pay about ₹${COVERED_SHARE_PAID.toLocaleString("en-IN")}.`
      : "Your father needs surgery: a ₹5 lakh bill, and there's no health insurance.",
    options: (s) => {
      const cost = s.parentsCover ? COVERED_SHARE_PAID : HOSPITAL_BILL;
      return [
        { id: "savings", label: `Pay ₹${cost.toLocaleString("en-IN")} from savings`, tradeOff: s.parentsCover ? "A small hit, thanks to the cover." : "Your emergency fund and investments take the hit, but you owe nothing.", apply: (st) => { st.oneOffCost += cost; } },
        { id: "loan", label: `Take a personal loan for ₹${cost.toLocaleString("en-IN")} at 14%`, tradeOff: "Savings stay invested, but the loan costs 14% a year until it's cleared, more than the investments are assumed to earn.", apply: (st) => { st.oneOffBorrow += cost; } },
      ];
    },
  },
  {
    year: 7,
    title: "A new job offer",
    concept: "Earning",
    body: () => "A company offers you 25% more pay, but there's a three-month gap between leaving and joining.",
    options: () => [
      { id: "switch", label: "Take the new job", tradeOff: "Three months without salary this year, then 25% higher pay for good. A cushion makes this possible.", apply: (s) => { s.incomeGap = 0.25; s.raiseNextYear = 0.25; } },
      { id: "stay", label: "Stay where you are", tradeOff: "Steady pay with the usual raise. No gap, no jump.", apply: () => undefined },
    ],
  },
  {
    year: 8,
    title: "A car for the family",
    concept: "What interest really costs",
    body: () => "Your family wants a car. A new one costs ₹10 lakh; a good used one costs ₹4 lakh.",
    options: () => [
      { id: "new-loan", label: "New car: ₹2 lakh down, ₹8 lakh 5-year loan at 9%", tradeOff: "The car you want now, but EMIs for five years and a car loses value every year (assumed 15%).", apply: (s) => { spendFromSavings(s, 200000); s.car = { value: 1000000, loan: 800000, emiMonthly: emi(800000, RL_ASSUMPTIONS.carLoanRate, 5), rate: RL_ASSUMPTIONS.carLoanRate }; } },
      { id: "used-cash", label: "Used car for ₹4 lakh in cash", tradeOff: "No loan, a smaller hit to savings, an older car.", apply: (s) => { spendFromSavings(s, 400000); s.car = { value: 400000, loan: 0, emiMonthly: 0, rate: 0 }; } },
      { id: "skip", label: "No car for now", tradeOff: "No cost, but less convenience for the family.", apply: () => undefined },
    ],
  },
  {
    year: 9,
    title: "A ₹5 lakh bonus",
    concept: "Pay yourself first",
    body: () => "Your company pays a one-time ₹5 lakh bonus after tax.",
    options: (s) => [
      ...(s.home && s.home.loan > 0 ? [{ id: "prepay", label: "Prepay part of the home loan", tradeOff: "A guaranteed saving at the loan's 8.5% interest rate, and the loan ends sooner. The money is locked into the house.", apply: (st: RLState) => { if (st.home) st.home.loan = Math.max(0, st.home.loan - 500000); } }] : []),
      ...(s.otherDebt > 0 ? [{ id: "clear-debt", label: "Pay off the personal loan", tradeOff: "Clears 14% debt, the most expensive money you owe.", apply: (st: RLState) => { st.bonus += 500000; } }] : []),
      { id: "invest", label: "Invest it", tradeOff: "More growth at the assumed 10%, with market ups and downs.", apply: (st) => { st.invested += 500000; } },
      { id: "holiday", label: "Take the family on a long holiday", tradeOff: "Memories have real value. Your net worth doesn't change.", apply: () => undefined },
    ],
  },
  {
    year: 10,
    title: "Retirement is closer than it looks",
    concept: "Compounding",
    body: () => "You're 41. Retirement at 60 is 19 years away.",
    options: () => [
      { id: "raise", label: "Invest an extra 10% of income every year from now", tradeOff: "Less to spend now, much more by 60 if growth averages the assumed rate.", apply: (s) => { s.extraInvestShare = 0.1; } },
      { id: "keep", label: "Keep the current plan", tradeOff: "Today's lifestyle stays the same. Retirement savings grow more slowly.", apply: () => undefined },
    ],
  },
];

/** Applies a decision and runs one year of money. Returns the new state and the year's surplus. */
export function runYear(prev: RLState, option: RLOption): { state: RLState; surplus: number } {
  const s: RLState = JSON.parse(JSON.stringify(prev));
  option.apply(s);
  const year = s.year + 1;
  if (s.eduStartsYear !== null && year >= s.eduStartsYear && s.eduAnnual === 0) s.eduAnnual = 240000;

  const rate = s.marketThisYear ?? RL_ASSUMPTIONS.investReturn;
  const homePaid = s.home ? payYear(s.home) : 0;
  const carPaid = s.car ? payYear(s.car) : 0;
  const extraInvest = s.income * s.extraInvestShare;
  const inflow = s.income * (1 - s.incomeGap) + s.bonus;
  const outflow = s.living + (s.renting ? s.rent : 0) + homePaid + (s.home ? s.home.value * RL_ASSUMPTIONS.homeUpkeep : 0) + carPaid
    + (s.term ? s.termPremium : 0) + s.endowmentPremium + (s.parentsCover ? s.parentsPremium : 0) + s.eduAnnual + extraInvest + s.oneOffCost;
  let surplus = inflow - outflow;
  const reportSurplus = surplus;

  s.eduFund += s.eduAnnual;
  s.invested += extraInvest;
  s.endowmentValue += s.endowmentPremium;

  if (surplus >= 0) {
    const toDebt = Math.min(s.otherDebt, surplus);
    s.otherDebt -= toDebt;
    surplus -= toDebt;
    const target = (s.living + (s.renting ? s.rent : 0) + (s.home ? s.home.emiMonthly * 12 : 0)) / 2; // six months
    const toEmergency = Math.min(Math.max(0, target - s.emergency), surplus);
    s.emergency += toEmergency;
    s.invested += surplus - toEmergency;
  } else {
    let gap = -surplus;
    const fromEmergency = Math.min(s.emergency, gap);
    s.emergency -= fromEmergency;
    gap -= fromEmergency;
    const fromInvested = Math.min(s.invested, gap);
    s.invested -= fromInvested;
    gap -= fromInvested;
    s.otherDebt += gap;
  }
  // A loan taken this year is repaid from next year's surplus, so it carries a year of interest.
  s.otherDebt += s.oneOffBorrow;

  s.invested = Math.max(0, s.invested * (1 + rate));
  s.eduFund *= 1 + rate;
  s.emergency *= 1 + RL_ASSUMPTIONS.savingsReturn;
  s.endowmentValue *= 1 + RL_ASSUMPTIONS.endowmentReturn;
  s.otherDebt *= 1 + RL_ASSUMPTIONS.personalLoanRate;
  if (s.home) s.home.value *= 1 + RL_ASSUMPTIONS.homeGrowth;
  if (s.car) s.car.value *= 1 - RL_ASSUMPTIONS.carDepreciation;
  if (s.sellAfterYear) {
    s.emergency += s.invested;
    s.invested = 0;
  }

  s.income *= 1 + RL_ASSUMPTIONS.incomeGrowth + s.raiseNextYear;
  s.living *= 1 + RL_ASSUMPTIONS.costGrowth;
  s.rent *= 1 + RL_ASSUMPTIONS.costGrowth;
  s.year = year;
  s.marketThisYear = s.marketNextYear;
  s.marketNextYear = null;
  s.sellAfterYear = false;
  s.incomeGap = 0;
  s.raiseNextYear = 0;
  s.oneOffCost = 0;
  s.oneOffBorrow = 0;
  s.bonus = 0;
  return { state: s, surplus: reportSurplus };
}
