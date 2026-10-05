/**
 * Pure maths behind the Money Labs. Every rate passed in is an assumption the
 * UI labels as such; the only fixed rules here are published ones (tax slabs,
 * PF rate and wage ceiling, professional tax slabs, RBI loan-to-value limits,
 * GST on card interest), each noted where it is used.
 */

// ---------- Credit card minimum-due trap ----------

export const CARD_GST = 0.18; // GST on interest and fees

export interface CardPlanResult {
  months: number;
  cleared: boolean;
  totalInterestAndGst: number;
  totalPaid: number;
  balances: number[]; // balance at the start of each month, then after the last payment
}

/**
 * Pays a card balance down with no new spending.
 * Minimum due = the higher of `minPct` of the bill and the month's interest + GST
 * (RBI's 2022 card directions forbid negative amortisation), with a rupee floor.
 * `fixedPayment` > 0 pays that amount (or more, if the minimum is higher).
 */
export function cardPayoff(opts: { balance: number; monthlyRate: number; minPct?: number; floor?: number; fixedPayment?: number; maxMonths?: number }): CardPlanResult {
  const { monthlyRate, minPct = 0.05, floor = 200, fixedPayment = 0, maxMonths = 600 } = opts;
  let balance = opts.balance;
  const balances = [balance];
  let charges = 0;
  let paid = 0;
  let months = 0;
  while (balance > 0.5 && months < maxMonths) {
    const interest = balance * monthlyRate;
    const gst = interest * CARD_GST;
    const bill = balance + interest + gst;
    const minimum = Math.max(bill * minPct, interest + gst, floor);
    const payment = Math.min(bill, Math.max(minimum, fixedPayment));
    charges += interest + gst;
    paid += payment;
    balance = bill - payment;
    months += 1;
    balances.push(balance);
  }
  return { months, cleared: balance <= 0.5, totalInterestAndGst: charges, totalPaid: paid, balances };
}

// ---------- Save vs Grow ----------

/** Value of a lump sum plus monthly deposits after each year, monthly compounding. `yearlyReturns[i]` is the return in year i+1. */
export function growthPath(lump: number, monthly: number, yearlyReturns: number[]): number[] {
  let value = lump;
  const out = [value];
  for (const yr of yearlyReturns) {
    const r = Math.pow(1 + yr, 1 / 12) - 1;
    for (let m = 0; m < 12; m++) value = (value + monthly) * (1 + r);
    out.push(value);
  }
  return out;
}

// ---------- Salary slip decoder ----------

/** New tax regime slabs for tax year 2026-27 (unchanged from Budget 2025). */
export const NEW_REGIME_SLABS: { upTo: number; rate: number }[] = [
  { upTo: 400000, rate: 0 },
  { upTo: 800000, rate: 0.05 },
  { upTo: 1200000, rate: 0.1 },
  { upTo: 1600000, rate: 0.15 },
  { upTo: 2000000, rate: 0.2 },
  { upTo: 2400000, rate: 0.25 },
  { upTo: Infinity, rate: 0.3 },
];
export const STANDARD_DEDUCTION = 75000;
export const REBATE_LIMIT = 1200000; // full rebate up to this taxable income
export const CESS = 0.04;
export const PF_RATE = 0.12;
export const PF_WAGE_CEILING_MONTHLY = 25000; // from 17 September 2026 (was 15,000)
export const GRATUITY_RATE = 15 / 26 / 12; // about 4.81% of basic

/** Income tax (new regime) on taxable income below ₹50 lakh, with the rebate, marginal relief and 4% cess. */
export function newRegimeTax(taxable: number): number {
  if (taxable <= 0) return 0;
  let tax = 0;
  let lower = 0;
  for (const s of NEW_REGIME_SLABS) {
    if (taxable > lower) tax += (Math.min(taxable, s.upTo) - lower) * s.rate;
    lower = s.upTo;
    if (taxable <= s.upTo) break;
  }
  if (taxable <= REBATE_LIMIT) tax = 0;
  else tax = Math.min(tax, taxable - REBATE_LIMIT); // marginal relief just above the limit
  return Math.round(tax * (1 + CESS));
}

export type PtState = "none" | "karnataka" | "maharashtra" | "telangana" | "west-bengal" | "other";

export const PT_STATES: { id: PtState; label: string }[] = [
  { id: "none", label: "No professional tax (e.g. Delhi, Uttar Pradesh, Haryana, Rajasthan)" },
  { id: "karnataka", label: "Karnataka" },
  { id: "maharashtra", label: "Maharashtra" },
  { id: "telangana", label: "Telangana" },
  { id: "west-bengal", label: "West Bengal" },
  { id: "other", label: "Another state (uses ₹200 a month, the common top slab)" },
];

/** Professional tax for a year, from the monthly gross salary. Capped at ₹2,500 a year by the Constitution (Article 276). */
export function professionalTaxYear(state: PtState, monthlyGross: number, woman: boolean): number {
  const top = 2500; // ₹200 a month with ₹300 in one month
  switch (state) {
    case "none":
      return 0;
    case "karnataka":
      return monthlyGross > 25000 ? top : 0;
    case "maharashtra":
      if (woman) return monthlyGross > 25000 ? top : 0;
      if (monthlyGross > 10000) return top;
      return monthlyGross > 7500 ? 175 * 12 : 0;
    case "telangana":
      if (monthlyGross > 20000) return 200 * 12;
      return monthlyGross > 15000 ? 150 * 12 : 0;
    case "west-bengal":
      if (monthlyGross > 40000) return 200 * 12;
      if (monthlyGross > 25000) return 150 * 12;
      if (monthlyGross > 15000) return 130 * 12;
      return monthlyGross > 10000 ? 110 * 12 : 0;
    default:
      return 200 * 12;
  }
}

export interface SalaryInput {
  ctc: number; // annual, fixed pay only
  basicShare: number; // basic as a share of gross salary
  pfOnFullBasic: boolean; // false = PF on basic up to the wage ceiling
  gratuityInCtc: boolean;
  state: PtState;
  woman: boolean;
}

export interface SalaryBreakdown {
  ctc: number;
  employerPf: number;
  gratuity: number;
  gross: number;
  basic: number;
  employeePf: number;
  professionalTax: number;
  incomeTax: number;
  taxable: number;
  inHandYear: number;
  inHandMonth: number;
}

export function salaryBreakdown(i: SalaryInput): SalaryBreakdown {
  const gratRate = i.gratuityInCtc ? GRATUITY_RATE : 0;
  const capYear = PF_WAGE_CEILING_MONTHLY * 12;
  // CTC = gross + employer PF + gratuity, and basic = basicShare x gross.
  let basic = i.ctc / (1 / i.basicShare + PF_RATE + gratRate);
  if (!i.pfOnFullBasic && basic > capYear) basic = (i.ctc - PF_RATE * capYear) / (1 / i.basicShare + gratRate);
  const pfWage = i.pfOnFullBasic ? basic : Math.min(basic, capYear);
  const employerPf = PF_RATE * pfWage;
  const gratuity = gratRate * basic;
  const gross = basic / i.basicShare;
  const employeePf = PF_RATE * pfWage;
  const professionalTax = professionalTaxYear(i.state, gross / 12, i.woman);
  // New regime: only the standard deduction applies to salary (no PF, HRA or professional tax deduction).
  const taxable = Math.max(0, gross - STANDARD_DEDUCTION);
  const incomeTax = newRegimeTax(taxable);
  const inHandYear = gross - employeePf - professionalTax - incomeTax;
  return { ctc: i.ctc, employerPf, gratuity, gross, basic, employeePf, professionalTax, incomeTax, taxable, inHandYear, inHandMonth: inHandYear / 12 };
}

// ---------- Rent vs Buy ----------

/** Largest home loan RBI's loan-to-value limits allow for a home of this price. */
export function maxHomeLoan(price: number): number {
  const options = [Math.min(0.9 * price, 3000000), Math.min(0.8 * price, 7500000)];
  if (0.75 * price > 7500000) options.push(0.75 * price);
  return Math.max(...options);
}

export function monthlyEmi(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export interface RentBuyInput {
  price: number;
  downPayment: number;
  loanRate: number;
  tenureYears: number;
  rentMonthly: number;
  horizonYears: number;
  priceGrowth: number;
  rentGrowth: number;
  investReturn: number;
  upfrontCostPct: number; // stamp duty, registration and similar
  upkeepPct: number; // maintenance and property tax, per year, of the home's value
}

export interface RentBuyResult {
  emi: number;
  loan: number;
  buy: number[]; // net worth at the end of each year (index 0 = start)
  rent: number[];
}

/** Both households spend the same cash each month; whoever spends less that month invests the difference. */
export function rentVsBuy(i: RentBuyInput): RentBuyResult {
  const loan = Math.max(0, i.price - i.downPayment);
  const emi = monthlyEmi(loan, i.loanRate, i.tenureYears);
  const r = Math.pow(1 + i.investReturn, 1 / 12) - 1;
  let homeValue = i.price;
  let outstanding = loan;
  let buyerPot = 0;
  let renterPot = i.downPayment + i.price * i.upfrontCostPct;
  let rent = i.rentMonthly;
  const buy = [homeValue - outstanding];
  const rentNw = [renterPot];
  for (let m = 1; m <= i.horizonYears * 12; m++) {
    let buyerOut = (homeValue * i.upkeepPct) / 12;
    if (outstanding > 0.5) {
      const interest = (outstanding * i.loanRate) / 12;
      const pay = Math.min(emi, outstanding + interest);
      outstanding = outstanding + interest - pay;
      buyerOut += pay;
    }
    const gap = buyerOut - rent;
    buyerPot *= 1 + r;
    renterPot *= 1 + r;
    if (gap > 0) renterPot += gap;
    else buyerPot += -gap;
    homeValue *= Math.pow(1 + i.priceGrowth, 1 / 12);
    if (m % 12 === 0) {
      rent *= 1 + i.rentGrowth;
      buy.push(homeValue - Math.max(0, outstanding) + buyerPot);
      rentNw.push(renterPot);
    }
  }
  return { emi, loan, buy, rent: rentNw };
}
