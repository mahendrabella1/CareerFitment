export type Jars = { needs: number; wants: number; save: number; grow: number };

export interface SimState {
  cash: number;
  savings: number;
  invested: number;
  debt: number;
  debtRateMonthly: number;
  creditScore: number;
  monthlyIncome: number;
  fixedNeeds: number;
  missedPayments: number;
  scamsAvoided: number;
  scamsFallen: number;
}

export type Effects = Partial<Record<keyof SimState, number>>;

// Illustrative growth assumptions shown to the learner as "assumed" rates, never as product returns.
export const GROW_RATE = 0.008; // about 10% a year, assumed
export const SAVE_RATE = 0.003; // about 3.5% a year, assumed

export function advanceMonth(s: SimState, plan: Jars, effects: Effects, marketMove: number): SimState {
  const n: SimState = { ...s };

  n.cash += s.monthlyIncome;
  const needsShort = Math.max(0, s.fixedNeeds - plan.needs);
  n.cash -= plan.needs + plan.wants + plan.save + plan.grow;
  n.savings += plan.save;
  n.invested += plan.grow;

  if (needsShort > 0) {
    n.debt += needsShort;
    n.missedPayments += 1;
  }

  for (const [key, value] of Object.entries(effects) as [keyof SimState, number][]) {
    n[key] += value;
  }

  if (n.cash < 0) {
    const fromSavings = Math.min(n.savings, -n.cash);
    n.savings -= fromSavings;
    n.cash += fromSavings;
  }
  if (n.cash < 0) {
    n.debt += -n.cash;
    n.cash = 0;
  }

  n.debt = Math.round(n.debt * (1 + s.debtRateMonthly));
  n.savings = Math.round(n.savings * (1 + SAVE_RATE));
  n.invested = Math.max(0, Math.round(n.invested * (1 + GROW_RATE + marketMove)));

  const delta = needsShort > 0 ? -25 : n.debt === 0 ? 6 : 2;
  n.creditScore = Math.min(900, Math.max(300, s.creditScore + delta));
  return n;
}

export function mulberry32(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DeckEvent {
  id: string;
  weight: number;
  conditions?: { emergencyFundBelow?: number; debtAbove?: number };
}

export function pickEvent<T extends DeckEvent>(deck: T[], s: SimState, rand: () => number): T {
  const weighted = deck.map((e) => {
    let w = e.weight;
    if (e.conditions?.emergencyFundBelow !== undefined && s.savings < e.conditions.emergencyFundBelow) w *= 2;
    if (e.conditions?.debtAbove !== undefined && s.debt > e.conditions.debtAbove) w *= 2;
    return { e, w };
  });
  const total = weighted.reduce((sum, x) => sum + x.w, 0);
  let r = rand() * total;
  for (const x of weighted) {
    r -= x.w;
    if (r <= 0) return x.e;
  }
  return weighted[weighted.length - 1].e;
}

const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));

export interface HealthInput {
  wantsShare: number;
  scamAccuracy: number;
  trackerStreak: number;
  saveTargetMonths: number;
}

export function healthScore(s: SimState, opts: HealthInput) {
  const monthlyNeeds = Math.max(1, s.fixedNeeds);
  const pillars = {
    spend: clamp(100 - Math.max(0, opts.wantsShare - 0.3) * 250 + Math.min(opts.trackerStreak, 30)),
    save: clamp((s.savings / (monthlyNeeds * opts.saveTargetMonths)) * 100),
    borrow: clamp(100 - (s.debt / Math.max(1, s.monthlyIncome)) * 50 - s.missedPayments * 10),
    grow: clamp((s.invested / Math.max(1, s.monthlyIncome * 12)) * 100),
    protect: clamp(opts.scamAccuracy * 100 - s.scamsFallen * 15),
  };
  const total = clamp(
    pillars.spend * 0.2 + pillars.save * 0.25 + pillars.borrow * 0.2 + pillars.grow * 0.15 + pillars.protect * 0.2
  );
  return { total, pillars };
}

export function netWorth(s: SimState) {
  return s.cash + s.savings + s.invested - s.debt;
}
