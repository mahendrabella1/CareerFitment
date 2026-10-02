/**
 * ROI calculator core - EMI and payback-time math, adapted near-verbatim
 * from the spec's own section 12 code (generic financial math, not
 * content). The core tool this section is built around: check the money
 * before applying, not after an offer letter arrives.
 */

export function emi(principal: number, annualRatePct: number, months: number): number {
  const r = annualRatePct / 100 / 12;
  if (months <= 0) return 0;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/** Months until monthly savings repay the loan - Infinity when the salary
 *  never pays it back (shown as "Does not pay back at this salary" in the
 *  UI, never as a silent zero). */
export function paybackMonths(loan: number, ratePct: number, monthlySaving: number): number {
  if (loan <= 0) return 0;
  if (monthlySaving <= 0) return Infinity;
  const r = ratePct / 100 / 12;
  if (r === 0) return Math.ceil(loan / monthlySaving);
  if (monthlySaving <= loan * r) return Infinity; // saving doesn't even cover interest
  return Math.ceil(-Math.log(1 - (loan * r) / monthlySaving) / Math.log(1 + r));
}

export interface RoiInput {
  totalCostInr: number;
  scholarshipInr: number;
  ownFundsInr: number;
  loanRatePct: number;
  salaryInrMonthly: { low: number; median: number; high: number }; // post-tax, converted to INR
  livingInrMonthly: number;
}

export interface RoiScenario {
  monthlySaving: number;
  paybackYears: number | null; // null = does not pay back at this salary
}

export interface RoiResult {
  loan: number;
  low: RoiScenario;
  median: RoiScenario;
  high: RoiScenario;
}

export function roiScenarios(input: RoiInput): RoiResult {
  const loan = Math.max(0, input.totalCostInr - input.scholarshipInr - input.ownFundsInr);
  const scenario = (salary: number): RoiScenario => {
    const saving = salary - input.livingInrMonthly;
    const months = paybackMonths(loan, input.loanRatePct, saving);
    return { monthlySaving: saving, paybackYears: months === Infinity ? null : +(months / 12).toFixed(1) };
  };
  return {
    loan,
    low: scenario(input.salaryInrMonthly.low),
    median: scenario(input.salaryInrMonthly.median),
    high: scenario(input.salaryInrMonthly.high),
  };
}
