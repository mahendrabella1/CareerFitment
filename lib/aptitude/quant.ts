/**
 * Quantitative aptitude and data interpretation - generated questions. Each
 * generator picks numbers that give a clean answer, computes it, and writes
 * the solution from the same numbers. Wrong options are the usual mistakes
 * (left-to-right instead of BODMAS, adding percentages, using the wrong base).
 */
import { choices, frac, fracEq, gcd, int, lcm, nCr, factorial, num, numChoices, pick, plural, ratio, ratioEq, rupees, shuffle, signed, times, type Draft, type Level, type Rng } from "./core";

// ------------------------------------------------------------------ simplification

export function arith(r: Rng, level: Level): Draft {
  if (level === 1) {
    const a = int(r, 2, 30), b = int(r, 2, 9), c = int(r, 2, 9), d = int(r, 1, 20);
    const ans = a + b * c - d;
    return { stem: `Simplify: ${a} + ${b} × ${c} − ${d}`, ...numChoices(r, ans, [(a + b) * c - d, a + b * c + d, a + b * (c - d)]),
      solution: [`Multiply first (BODMAS): ${b} × ${c} = ${b * c}.`, `Then left to right: ${a} + ${b * c} − ${d} = ${ans}.`] };
  }
  if (level === 2) {
    const a = int(r, 4, 14), b = int(r, 4, 14), d = int(r, 2, 9);
    const q = int(r, 2, Math.max(2, Math.floor((a * b - 1) / d)));
    const c = a * b - d * q;
    return { stem: `Simplify: (${a} × ${b} − ${c}) ÷ ${d}`, ...numChoices(r, q, [q + 1, q - 1, a * b - c, q + d]),
      solution: [`Brackets first: ${a} × ${b} = ${a * b}, and ${a * b} − ${c} = ${a * b - c}.`, `Then divide: ${a * b - c} ÷ ${d} = ${q}.`] };
  }
  const P = [10, 20, 25, 40, 50, 75] as const;
  const p = pick(r, P), q = pick(r, P), A = int(r, 2, 16) * 100, B = int(r, 2, 16) * 100;
  const ans = (p * A) / 100 + (q * B) / 100;
  return { stem: `What is ${p}% of ${num(A)} + ${q}% of ${num(B)}?`, ...numChoices(r, ans, [((p + q) * (A + B)) / 100, (p * B) / 100 + (q * A) / 100, ans + 100]),
    solution: [`${p}% of ${num(A)} = ${p}/100 × ${num(A)} = ${num((p * A) / 100)}.`, `${q}% of ${num(B)} = ${num((q * B) / 100)}.`, `Total = ${num(ans)}.`] };
}

// ------------------------------------------------------------------ number system

export function numbers(r: Rng, level: Level): Draft {
  if (level === 1) {
    const g = int(r, 2, 9), a = g * int(r, 2, 7), b = g * int(r, 2, 7);
    if (a === b) return numbers(r, level);
    const hcf = gcd(a, b), l = lcm(a, b);
    if (r() < 0.5) return { stem: `What is the HCF of ${a} and ${b}?`, ...numChoices(r, hcf, [l, hcf * 2, Math.min(a, b), Math.abs(a - b)]),
      solution: [`Factors: ${a} = ${hcf} × ${a / hcf}, ${b} = ${hcf} × ${b / hcf}.`, `${a / hcf} and ${b / hcf} share no common factor, so the HCF is ${hcf}.`] };
    return { stem: `What is the LCM of ${a} and ${b}?`, ...numChoices(r, l, [a * b, hcf, l * 2, l + hcf]),
      solution: [`HCF of ${a} and ${b} = ${hcf}.`, `LCM = (${a} × ${b}) ÷ HCF = ${a * b} ÷ ${hcf} = ${l}.`] };
  }
  if (level === 2) {
    const xs = shuffle(r, [4, 5, 6, 8, 9, 10, 12, 15]).slice(0, 3).sort((x, y) => x - y);
    const L = xs.reduce(lcm), rem = int(r, 1, xs[0] - 1);
    return { stem: `What is the smallest number which, when divided by ${xs.join(", ")}, leaves a remainder of ${rem} each time?`, ...numChoices(r, L + rem, [L, L - rem, 2 * L + rem, xs[0] * xs[1] * xs[2] + rem]),
      solution: [`A number that leaves the same remainder ${rem} is (a common multiple) + ${rem}.`, `LCM of ${xs.join(", ")} = ${L}.`, `Smallest such number = ${L} + ${rem} = ${L + rem}.`] };
  }
  // Divisibility by 11: exactly one of four numbers passes.
  const yes = 11 * int(r, 1000, 9090);
  const no: number[] = [];
  while (no.length < 3) { const n = int(r, 10000, 99999); if (n % 11 && !no.includes(n)) no.push(n); }
  const alt = (n: number) => String(n).split("").reverse().reduce((s, d, i) => s + (i % 2 ? -1 : 1) * Number(d), 0);
  const { options, answer } = choices(r, String(yes), no.map(String));
  return { stem: "Which of these numbers is divisible by 11?", options, answer,
    solution: ["Rule: a number is divisible by 11 when the alternating sum of its digits (from the right: + − + − ...) is 0 or a multiple of 11.",
      `${yes}: alternating sum = ${alt(yes)} → divisible.`, ...no.map((n) => `${n}: alternating sum = ${alt(n)} → not divisible.`)] };
}

// ------------------------------------------------------------------ fractions

export function fractions(r: Rng, level: Level): Draft {
  if (level === 1) {
    const b = pick(r, [2, 3, 4, 5, 6, 8]), d = pick(r, [3, 4, 5, 6, 8, 10, 12]);
    const a = int(r, 1, b - 1), c = int(r, 1, d - 1);
    const p = a * d + c * b, q = b * d;
    return { stem: `What is ${a}/${b} + ${c}/${d}? (in lowest terms)`, ...choices(r, frac(p, q), [frac(a + c, b + d), frac(a * c, b * d), frac(p + 1, q), frac(a + c, Math.max(b, d))], [frac(p, q + 1), frac(p - 1, q)]),
      solution: [`Common denominator: ${b} × ${d} = ${q}.`, `${a}/${b} = ${a * d}/${q} and ${c}/${d} = ${c * b}/${q}.`, `Sum = ${fracEq(p, q)}.`] };
  }
  if (level === 2) {
    const fr: [number, number][] = [];
    while (fr.length < 4) {
      const q = int(r, 3, 13), p = int(r, 1, q - 1);
      if (gcd(p, q) === 1 && !fr.some(([x, y]) => x * q === p * y)) fr.push([p, q]);
    }
    const best = fr.reduce((m, f) => (f[0] / f[1] > m[0] / m[1] ? f : m));
    const { options, answer } = choices(r, `${best[0]}/${best[1]}`, fr.filter((f) => f !== best).map(([p, q]) => `${p}/${q}`));
    return { stem: "Which fraction is the largest?", options, answer,
      solution: ["Turn each into a decimal (or cross-multiply in pairs):", ...fr.map(([p, q]) => `${p}/${q} ≈ ${(p / q).toFixed(3)}`), `Largest: ${best[0]}/${best[1]}.`] };
  }
  const b = pick(r, [2, 3, 4, 5]), d = pick(r, [3, 4, 5, 6]);
  const a = int(r, 1, b - 1), c = int(r, 1, d - 1);
  const N = b * d * int(r, 2, 12);
  const ans = (a * c * N) / (b * d);
  return { stem: `What is ${a}/${b} of ${c}/${d} of ${num(N)}?`, ...numChoices(r, ans, [(a * N) / b, (c * N) / d, ((a + c) * N) / (b + d)]),
    solution: [`"Of" means multiply: ${a}/${b} × ${c}/${d} × ${num(N)}.`, `${c}/${d} of ${num(N)} = ${num((c * N) / d)}; ${a}/${b} of that = ${num(ans)}.`] };
}

// ------------------------------------------------------------------ percentages

export function percent(r: Rng, level: Level): Draft {
  if (level === 1) {
    const p = pick(r, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]), N = int(r, 2, 40) * 20;
    const ans = (p * N) / 100;
    return { stem: `What is ${p}% of ${num(N)}?`, ...numChoices(r, ans, [N / p, ans * 10, N - ans]),
      solution: [`${p}% = ${p}/100.`, `${p}/100 × ${num(N)} = ${num(ans)}.`] };
  }
  if (level === 2) {
    const p = pick(r, [10, 20, 25, 30, 40, 50]), q = pick(r, [10, 20, 25, 30, 40, 50]);
    const net = p - q - (p * q) / 100;
    const say = (n: number) => (n === 0 ? "No change" : `${num(Math.abs(n))}% ${n > 0 ? "increase" : "decrease"}`);
    return { stem: `A price is increased by ${p}% and then the new price is decreased by ${q}%. What is the overall change?`,
      ...choices(r, say(net), [say(p - q), say(p - q + (p * q) / 100), say(-(p * q) / 100), say(p + q)], [say(net + 1), say(net - 2)]),
      solution: [`Start with 100. After +${p}%: ${100 + p}.`, `After −${q}%: ${100 + p} × ${(100 - q) / 100} = ${num(100 + net)}.`, `Change = ${signed(net)} on 100 → ${say(net).toLowerCase()}.`, `Shortcut: a + b + ab/100 with a = ${p}, b = −${q}.`] };
  }
  const [x, y] = pick(r, [["Asha's salary", "Ravi's"], ["The price of rice", "the price of wheat"], ["Town A's population", "Town B's"], ["This year's rainfall", "last year's"]] as const);
  const yName = y.replace(/^the /, "");
  const f = (n: number) => `${num(n)}%`;
  if (r() < 0.5) {
    const p = pick(r, [10, 20, 25, 40, 50, 60, 100]);
    const ans = (100 * p) / (100 + p);
    return { stem: `${x} is ${p}% more than ${y}. By what percent is ${yName} less than ${x.charAt(0).toLowerCase()}${x.slice(1)}?`,
      ...choices(r, f(ans), [f(p), f((100 * p) / Math.max(1, 100 - p)), f(p / 2)], [f(ans + 2), f(ans - 2)]),
      solution: [`Take ${yName} as 100, so the first is ${100 + p}.`, `The difference, ${p}, is now measured on the larger base of ${100 + p}.`, `${p}/${100 + p} × 100 = ${num(ans)}%.`] };
  }
  const p = pick(r, [10, 20, 25, 40, 50, 60, 75]);
  const ans = (100 * p) / (100 - p);
  return { stem: `${x} is ${p}% less than ${y}. By what percent is ${yName} more than ${x.charAt(0).toLowerCase()}${x.slice(1)}?`,
    ...choices(r, f(ans), [f(p), f((100 * p) / (100 + p)), f(p * 2)], [f(ans + 2), f(ans - 2)]),
    solution: [`Take ${yName} as 100, so the first is ${100 - p}.`, `The difference, ${p}, is now measured on the smaller base of ${100 - p}.`, `${p}/${100 - p} × 100 = ${num(ans)}%.`] };
}

// ------------------------------------------------------------------ ratio and proportion

export function ratioQ(r: Rng, level: Level): Draft {
  if (level === 1) {
    let a = int(r, 1, 7), b = int(r, 2, 9);
    if (a === b) b += 1;
    const g = gcd(a, b); a /= g; b /= g;
    const k = int(r, 3, 60) * 10, N = (a + b) * k;
    const big = Math.max(a, b) * k;
    return { stem: `${rupees(N)} is divided between two friends in the ratio ${a} : ${b}. What is the larger share?`,
      ...numChoices(r, big, [Math.min(a, b) * k, N / 2, Math.round(N / Math.max(a, b))], rupees),
      solution: [`Total parts = ${a} + ${b} = ${a + b}.`, `One part = ${rupees(N)} ÷ ${a + b} = ${rupees(k)}.`, `Larger share = ${Math.max(a, b)} × ${rupees(k)} = ${rupees(big)}.`] };
  }
  if (level === 2) {
    const a = int(r, 1, 7), b = int(r, 2, 9), c = int(r, 1, 7), d = int(r, 2, 9);
    // Given ratios read naturally only in lowest terms (not "2 : 2" or "4 : 6").
    if (a * c === b * d || gcd(a, b) !== 1 || gcd(c, d) !== 1) return ratioQ(r, level);
    const right = ratio(a * c, b * d);
    return { stem: `A : B = ${a} : ${b} and B : C = ${c} : ${d}. What is A : C?`,
      ...choices(r, right, [ratio(a, d), ratio(a * d, b * c), ratio(b * d, a * c), ratio(a + c, b + d), ratio(c, b)], [ratio(a * c + 1, b * d), ratio(a * c, b * d + 1), ratio(a * c + 2, b * d)]),
      solution: [`Make B the same in both: A : B = ${a * c} : ${b * c} and B : C = ${b * c} : ${b * d}.`, `So A : C = ${a * c} : ${b * d} = ${right}.`, `Shortcut: A : C = (a × c) : (b × d).`] };
  }
  for (;;) {
    const a = int(r, 1, 5), b = int(r, a + 1, 9);
    if (gcd(a, b) !== 1) continue;
    const x = int(r, 2, 12), k = int(r, 2, 20);
    const after = ratio(a * x + k, b * x + k);
    return { stem: `Two numbers are in the ratio ${a} : ${b}. If ${k} is added to each, the ratio becomes ${after}. What is the smaller number?`,
      ...numChoices(r, a * x, [b * x, a * x + k, a * (x + 1)]),
      solution: [`Let the numbers be ${times(a, "x")} and ${times(b, "x")}.`, `(${times(a, "x")} + ${k}) : (${times(b, "x")} + ${k}) = ${after} → solving gives x = ${x}.`, `Smaller number = ${a * x}. Check: ${a * x} + ${k} = ${a * x + k} and ${b * x} + ${k} = ${b * x + k}, and ${ratioEq(a * x + k, b * x + k)}.`] };
  }
}

// ------------------------------------------------------------------ averages

export function average(r: Rng, level: Level): Draft {
  if (level === 1) {
    const n = 5, avg = int(r, 12, 80);
    const xs = Array.from({ length: n - 1 }, () => avg + int(r, -10, 10));
    xs.push(avg * n - xs.reduce((s, v) => s + v, 0));
    if (xs.some((v) => v <= 0)) return average(r, level);
    return { stem: `Find the average of ${xs.join(", ")}.`, ...numChoices(r, avg, [avg + 1, avg - 1, xs.reduce((s, v) => s + v, 0) / (n - 1)]),
      solution: [`Sum = ${xs.join(" + ")} = ${avg * n}.`, `Average = ${avg * n} ÷ ${n} = ${avg}.`] };
  }
  if (level === 2) {
    for (;;) {
      const n = int(r, 5, 12), A = int(r, 20, 60), B = A + int(r, -4, 4);
      const X = n * A - (n - 1) * B;
      if (X <= 0 || B === A) continue;
      return { stem: `The average of ${n} numbers is ${A}. When one number is removed, the average of the rest becomes ${B}. What number was removed?`,
        ...numChoices(r, X, [A - B, n * (A - B), A + (A - B)]),
        solution: [`Total of ${n} numbers = ${n} × ${A} = ${n * A}.`, `Total of the other ${n - 1} = ${n - 1} × ${B} = ${(n - 1) * B}.`, `Removed number = ${n * A} − ${(n - 1) * B} = ${X}.`] };
    }
  }
  const n = int(r, 20, 40), A = int(r, 12, 16), d = 1;
  const T = A + (n + 1) * d;
  return { stem: `The average age of ${n} students is ${A} years. When the teacher's age is included, the average rises by ${d} year. How old is the teacher?`,
    ...numChoices(r, T, [A + d, A + n * d, (n + 1) * (A + d)]),
    solution: [`Students' total = ${n} × ${A} = ${n * A}.`, `With the teacher: ${n + 1} × ${A + d} = ${(n + 1) * (A + d)}.`, `Teacher = ${(n + 1) * (A + d)} − ${n * A} = ${T} years. Shortcut: ${A} + ${n + 1} × ${d}.`] };
}

// ------------------------------------------------------------------ profit, loss and discount

export function profit(r: Rng, level: Level): Draft {
  if (level === 1) {
    const cp = int(r, 2, 40) * 50, p = pick(r, [5, 10, 12, 15, 20, 25, 30, 40]);
    const loss = r() < 0.3;
    const sp = cp * (1 + (loss ? -p : p) / 100);
    const word = loss ? "loss" : "profit";
    const f = (n: number) => `${num(n)}% ${word}`;
    return { stem: `An article bought for ${rupees(cp)} is sold for ${rupees(sp)}. Find the ${word} percent.`,
      ...choices(r, f(p), [f((Math.abs(sp - cp) / sp) * 100), f(p + 5), f(p * 2)], [f(p - 2), f(p + 2)]),
      solution: [`${word[0].toUpperCase()}${word.slice(1)} = ${rupees(Math.abs(sp - cp))}.`, `${word[0].toUpperCase()}${word.slice(1)} % = ${num(Math.abs(sp - cp))} ÷ ${num(cp)} × 100 = ${p}% (always on the cost price).`] };
  }
  if (level === 2) {
    for (;;) {
      const mp = int(r, 4, 40) * 100, d = pick(r, [10, 15, 20, 25]);
      const sp = (mp * (100 - d)) / 100, g = pick(r, [10, 12.5, 20, 25, 50]);
      const cp = (sp * 100) / (100 + g);
      if (!Number.isInteger(cp)) continue;
      const f = (n: number) => `${num(n)}%`;
      return { stem: `A shop marks a bag at ${rupees(mp)} and gives a ${d}% discount. The bag cost the shop ${rupees(cp)}. What is the profit percent?`,
        ...choices(r, f(g), [f(((mp - cp) / cp) * 100), f(((sp - cp) / sp) * 100), f(g + d)], [f(g + 5), f(g - 5)]),
        solution: [`Selling price = ${rupees(mp)} × ${(100 - d) / 100} = ${rupees(sp)}.`, `Profit = ${rupees(sp)} − ${rupees(cp)} = ${rupees(sp - cp)}.`, `Profit % = ${num(sp - cp)} ÷ ${num(cp)} × 100 = ${num(g)}%.`] };
    }
  }
  const cp = int(r, 4, 50) * 100, l = pick(r, [5, 10, 15, 20, 25]), g = pick(r, [5, 10, 15, 20, 25]);
  const s = (cp * (100 - l)) / 100, ans = (cp * (100 + g)) / 100;
  return { stem: `By selling a watch for ${rupees(s)}, a man loses ${l}%. At what price should he sell it to gain ${g}%?`,
    ...numChoices(r, ans, [(s * (100 + g)) / 100, s + (cp * (l + g)) / 200, cp], rupees),
    solution: [`Selling at ${100 - l}% of cost = ${rupees(s)}, so cost = ${rupees(s)} × 100/${100 - l} = ${rupees(cp)}.`, `For a ${g}% gain: ${rupees(cp)} × ${100 + g}/100 = ${rupees(ans)}.`] };
}

// ------------------------------------------------------------------ simple and compound interest

export function interest(r: Rng, level: Level): Draft {
  if (level === 1) {
    const P = int(r, 2, 50) * 1000, R = int(r, 4, 12), T = int(r, 2, 5);
    const si = (P * R * T) / 100;
    return { stem: `Find the simple interest on ${rupees(P)} at ${R}% a year for ${T} years.`,
      ...numChoices(r, si, [(P * R) / 100, P + si, (P * R * T) / 1000], rupees),
      solution: [`SI = P × R × T ÷ 100.`, `= ${num(P)} × ${R} × ${T} ÷ 100 = ${rupees(si)}.`] };
  }
  if (level === 2) {
    const R = pick(r, [5, 10, 20]);
    const P = (R === 5 ? 2000 : 1000) * int(r, 1, 20);
    const amt = P * (1 + R / 100) ** 2, ci = Math.round(amt - P);
    return { stem: `Find the compound interest on ${rupees(P)} for 2 years at ${R}% a year, compounded yearly.`,
      ...numChoices(r, ci, [(P * R * 2) / 100, Math.round(amt), ci + (P * R) / 100], rupees),
      solution: [`Amount = P(1 + R/100)² = ${num(P)} × ${(1 + R / 100).toFixed(2)}² = ${rupees(Math.round(amt))}.`, `CI = ${rupees(Math.round(amt))} − ${rupees(P)} = ${rupees(ci)}.`, `(Simple interest would be ${rupees((P * R * 2) / 100)} - compound earns interest on interest too.)`] };
  }
  const R = pick(r, [5, 10, 20]), P = int(r, 1, 30) * (R === 5 ? 4000 : 1000);
  const D = (P * R * R) / 10000;
  return { stem: `The difference between compound and simple interest on a sum for 2 years at ${R}% a year is ${rupees(D)}. Find the sum.`,
    ...numChoices(r, P, [D * 100 / R, (D * 10000) / (R * 2), P * 2], rupees),
    solution: [`For 2 years: CI − SI = P × (R/100)².`, `${num(D)} = P × (${R}/100)² = P × ${(R * R) / 10000}.`, `P = ${num(D)} ÷ ${(R * R) / 10000} = ${rupees(P)}.`] };
}

// ------------------------------------------------------------------ time and work

/** Pairs of whole days whose together-time is also whole. */
const WORK_PAIRS: [number, number, number][] = (() => {
  const out: [number, number, number][] = [];
  for (let a = 3; a <= 60; a++) for (let b = a + 1; b <= 90; b++) if ((a * b) % (a + b) === 0) out.push([a, b, (a * b) / (a + b)]);
  return out;
})();

export function timeWork(r: Rng, level: Level): Draft {
  if (level === 1) {
    const [a, b, t] = pick(r, WORK_PAIRS);
    return { stem: `A can finish a job in ${a} days and B in ${b} days. Working together, how many days will they take?`,
      ...numChoices(r, t, [(a + b) / 2, b - a, Math.round((a + b) / 3)]),
      solution: [`In one day A does 1/${a} and B does 1/${b}.`, `Together: 1/${a} + 1/${b} = ${frac(a + b, a * b)} of the job a day.`, `Days = ${a * b}/${a + b} = ${t}.`] };
  }
  if (level === 2) {
    const [a, b, t] = pick(r, WORK_PAIRS);
    return { stem: `A and B together can do a piece of work in ${t} days. A alone can do it in ${a} days. How long would B take alone?`,
      ...numChoices(r, b, [a - t, a + t, 2 * t]),
      solution: [`B's work in a day = 1/${t} − 1/${a} = ${frac(a - t, a * t)}.`, `So B alone takes ${b} days.`] };
  }
  for (;;) {
    const [a, b] = pick(r, WORK_PAIRS);
    const W = lcm(a, b), ra = W / a, rb = W / b, k = int(r, 1, 6);
    const left = W - k * (ra + rb);
    if (left <= 0 || left % rb) continue;
    const more = left / rb;
    return { stem: `A can do a job in ${a} days and B in ${b} days. They work together for ${plural(k, "day")}, then A leaves. In how many more days will B finish the job?`,
      ...numChoices(r, more, [b - k, more + k, Math.round(left / ra)]),
      solution: [`Take the job as ${W} units (LCM of ${a} and ${b}). A does ${ra} units a day, B does ${rb}.`, `In ${plural(k, "day")} together: ${k} × ${ra + rb} = ${k * (ra + rb)} units.`, `Left: ${left} units; B alone takes ${left} ÷ ${rb} = ${more} more days.`] };
  }
}

// ------------------------------------------------------------------ speed, distance and time

export function speed(r: Rng, level: Level): Draft {
  if (level === 1) {
    const v = int(r, 1, 8) * 18;
    if (r() < 0.5) return { stem: `Convert ${v} km/h into metres per second.`, ...numChoices(r, (v * 5) / 18, [(v * 18) / 5, v / 3.6 + 5, v / 10]),
      solution: [`1 km/h = 1000 m ÷ 3600 s = 5/18 m/s.`, `${v} × 5/18 = ${num((v * 5) / 18)} m/s.`] };
    const t = int(r, 2, 6), d = v * t;
    return { stem: `A car travels ${d} km in ${t} hours. What is its speed?`, ...numChoices(r, v, [d * t, v + 10, Math.round(d / (t + 1))], (n) => `${num(n)} km/h`),
      solution: [`Speed = distance ÷ time = ${d} ÷ ${t} = ${v} km/h.`] };
  }
  if (level === 2) {
    for (;;) {
      const v = int(r, 2, 8) * 18, ms = (v * 5) / 18, t = int(r, 8, 40), total = ms * t;
      const L = int(r, 5, Math.floor(total / 10)) * 10, P = total - L;
      if (P <= 0 || L <= 50) continue;
      return { stem: `A train ${L} m long, running at ${v} km/h, crosses a platform ${P} m long. How many seconds does it take?`,
        ...numChoices(r, t, [L / ms, P / ms, (L + P) / v].map((x) => Math.round(x)), (n) => `${num(n)} s`),
        solution: [`Speed = ${v} × 5/18 = ${ms} m/s.`, `To cross a platform the train covers its own length plus the platform: ${L} + ${P} = ${L + P} m.`, `Time = ${L + P} ÷ ${ms} = ${t} s.`] };
    }
  }
  const pairs: [number, number][] = [];
  for (let x = 10; x <= 90; x += 2) for (let y = x + 2; y <= 120; y += 2) if ((2 * x * y) % (x + y) === 0) pairs.push([x, y]);
  const [x, y] = pick(r, pairs);
  const avg = (2 * x * y) / (x + y);
  return { stem: `${y <= 30 ? "A cyclist" : y <= 80 ? "A car" : "A train"} goes to a town at ${x} km/h and returns along the same route at ${y} km/h. What is the average speed for the whole trip?`,
    ...numChoices(r, avg, [(x + y) / 2, Math.round(Math.sqrt(x * y)), y - x], (n) => `${num(n)} km/h`),
    solution: [`For equal distances, average speed = 2xy ÷ (x + y) - not the simple average.`, `= 2 × ${x} × ${y} ÷ (${x} + ${y}) = ${2 * x * y} ÷ ${x + y} = ${num(avg)} km/h.`] };
}

// ------------------------------------------------------------------ ages

export function ages(r: Rng, level: Level): Draft {
  if (level === 1) {
    const b = int(r, 8, 30), x = int(r, 2, 15), S = 2 * b + x;
    return { stem: `Ravi is ${x} years older than his sister. The sum of their ages is ${S}. How old is Ravi?`,
      ...numChoices(r, b + x, [b, S / 2, S - x]),
      solution: [`Let the sister be s; Ravi = s + ${x}.`, `s + s + ${x} = ${S} → 2s = ${S - x} → s = ${b}.`, `Ravi = ${b} + ${x} = ${b + x}.`] };
  }
  if (level === 2) {
    for (;;) {
      const a = int(r, 1, 5), b = int(r, a + 1, 9);
      if (gcd(a, b) !== 1) continue;
      const x = int(r, 2, 8), n = int(r, 2, 12);
      const after = ratio(a * x + n, b * x + n);
      return { stem: `The ages of Meena and her aunt are in the ratio ${a} : ${b}. After ${n} years the ratio will be ${after}. What is Meena's present age?`,
        ...numChoices(r, a * x, [b * x, a * x + n, a * (x + 1)]),
        solution: [`Let the ages be ${times(a, "x")} and ${times(b, "x")}.`, `(${times(a, "x")} + ${n}) : (${times(b, "x")} + ${n}) = ${after} → x = ${x}.`, `Meena is ${a * x}. Check: in ${n} years the ages are ${a * x + n} and ${b * x + n}, and ${ratioEq(a * x + n, b * x + n)}.`] };
    }
  }
  for (;;) {
    const m = int(r, 3, 6), p = int(r, 2, m - 1), n = int(r, 2, 15);
    const s = (n * (p - 1)) / (m - p);
    if (!Number.isInteger(s) || s < 3 || s > 20) continue;
    return { stem: `A father is ${m} times as old as his son. After ${n} years he will be ${p} times as old as the son. How old is the son now?`,
      ...numChoices(r, s, [s + n, m * s, n]),
      solution: [`Son = s, father = ${m}s.`, `In ${n} years: ${m}s + ${n} = ${p}(s + ${n}).`, `${m}s − ${p}s = ${p * n} − ${n} → ${times(m - p, "s")} = ${n * (p - 1)}${m - p === 1 ? "" : ` → s = ${s}`}.`] };
  }
}

// ------------------------------------------------------------------ mensuration

export function mensuration(r: Rng, level: Level): Draft {
  if (level === 1) {
    const l = int(r, 5, 30), w = int(r, 3, l - 1);
    if (r() < 0.5) return { stem: `A rectangular garden is ${l} m long and ${w} m wide. What is its area?`, ...numChoices(r, l * w, [2 * (l + w), l + w, l * w + l], (n) => `${num(n)} m²`),
      solution: [`Area = length × width = ${l} × ${w} = ${l * w} m².`] };
    return { stem: `A rectangular field is ${l} m long and ${w} m wide. How much fencing is needed to go around it once?`, ...numChoices(r, 2 * (l + w), [l * w, l + w, 4 * l], (n) => `${num(n)} m`),
      solution: [`Perimeter = 2 × (length + width) = 2 × (${l} + ${w}) = ${2 * (l + w)} m.`] };
  }
  if (level === 2) {
    const rad = 7 * int(r, 1, 6);
    if (r() < 0.5) return { stem: `Find the area of a circle of radius ${rad} cm. (Take π = 22/7)`, ...numChoices(r, (22 / 7) * rad * rad, [(44 / 7) * rad, (22 / 7) * rad, (22 / 7) * rad * rad * 2], (n) => `${num(n)} cm²`),
      solution: [`Area = πr² = 22/7 × ${rad} × ${rad} = ${num((22 / 7) * rad * rad)} cm².`] };
    return { stem: `Find the circumference of a circle of radius ${rad} cm. (Take π = 22/7)`, ...numChoices(r, (44 / 7) * rad, [(22 / 7) * rad * rad, (22 / 7) * rad, (44 / 7) * rad * 2], (n) => `${num(n)} cm`),
      solution: [`Circumference = 2πr = 2 × 22/7 × ${rad} = ${num((44 / 7) * rad)} cm.`] };
  }
  if (r() < 0.5) {
    const rad = 7 * int(r, 1, 3), h = int(r, 2, 20);
    const v = (22 / 7) * rad * rad * h;
    return { stem: `A cylindrical tank has radius ${rad} m and height ${h} m. What is its volume? (Take π = 22/7)`, ...numChoices(r, v, [(44 / 7) * rad * h, (22 / 7) * rad * h, v / 3], (n) => `${num(n)} m³`),
      solution: [`Volume = πr²h = 22/7 × ${rad}² × ${h} = ${num(v)} m³.`] };
  }
  const l = int(r, 3, 15), b = int(r, 2, 12), h = int(r, 2, 10);
  const sa = 2 * (l * b + b * h + h * l);
  return { stem: `A closed box is ${l} cm long, ${b} cm wide and ${h} cm high. What is its total surface area?`, ...numChoices(r, sa, [l * b * h, l * b + b * h + h * l, 2 * (l + b) * h], (n) => `${num(n)} cm²`),
    solution: [`Total surface area = 2(lb + bh + hl).`, `= 2(${l * b} + ${b * h} + ${h * l}) = ${sa} cm².`] };
}

// ------------------------------------------------------------------ mixtures and alligation

export function mixture(r: Rng, level: Level): Draft {
  if (level === 1) {
    for (;;) {
      const a = int(r, 20, 60), b = a + int(r, 10, 50), m = int(r, a + 1, b - 1);
      const right = ratio(b - m, m - a);
      return { stem: `In what ratio must rice at ${rupees(a)}/kg be mixed with rice at ${rupees(b)}/kg to get a mixture worth ${rupees(m)}/kg?`,
        ...choices(r, right, [ratio(m - a, b - m), ratio(a, b), ratio(b - a, m)], [ratio(b - m + 1, m - a), ratio(b - m, m - a + 1)]),
        solution: [`Alligation: (dearer − mean) : (mean − cheaper) gives cheaper : dearer.`, `(${b} − ${m}) : (${m} − ${a}) = ${ratioEq(b - m, m - a)}.`] };
    }
  }
  if (level === 2) {
    for (;;) {
      const a = int(r, 2, 7), b = int(r, 1, a - 1), k = int(r, 2, 10);
      const milk = a * k, water = b * k;
      const c = a, d = b + int(r, 1, 3);
      const addW = (milk * d) / c - water;
      if (!Number.isInteger(addW) || addW <= 0 || gcd(a, b) !== 1) continue;
      return { stem: `${milk + water} litres of a mixture has milk and water in the ratio ${a} : ${b}. How much water must be added to make the ratio ${ratio(c, d)}?`,
        ...numChoices(r, addW, [water, (d - b) * 2, addW + water], (n) => `${num(n)} litres`),
        solution: [`Milk = ${a}/${a + b} × ${milk + water} = ${milk} L; water = ${water} L.`, `Milk stays ${milk} L. For ${ratio(c, d)}, water must be ${milk} × ${d}/${c} = ${(milk * d) / c} L.`, `Add ${(milk * d) / c} − ${water} = ${addW} litres.`] };
    }
  }
  const V = pick(r, [20, 40, 50, 80, 100]), x = pick(r, [2, 4, 5, 10].filter((n) => n < V / 2));
  const left = V * (1 - x / V) ** 2;
  return { stem: `A can holds ${V} litres of milk. ${x} litres are taken out and replaced with water. This is done once more. How much milk is in the can now?`,
    ...numChoices(r, left, [V - 2 * x, V - x, V * (1 - x / V)], (n) => `${num(n)} litres`),
    solution: [`Each time, milk is multiplied by (1 − ${x}/${V}) = ${num(1 - x / V)}.`, `After two times: ${V} × ${num(1 - x / V)}² = ${num(left)} litres.`] };
}

// ------------------------------------------------------------------ probability

export function probability(r: Rng, level: Level): Draft {
  if (level === 1) {
    if (r() < 0.25) {
      const ev = pick(r, [{ t: "two heads", n: 1 }, { t: "exactly one head", n: 2 }, { t: "at least one head", n: 3 }, { t: "no heads", n: 1 }, { t: "at least one tail", n: 3 }]);
      return { stem: `Two coins are tossed. What is the probability of getting ${ev.t}?`, ...choices(r, frac(ev.n, 4), [frac(ev.n, 2), frac(4 - ev.n, 4), frac(ev.n, 3), frac(1, 3)], [frac(1, 2), frac(1, 4), frac(3, 4)]),
        solution: [`Outcomes: HH, HT, TH, TT - that's 4.`, `Favourable: ${ev.n}.`, `Probability = ${fracEq(ev.n, 4)}.`] };
    }
    const faces = [1, 2, 3, 4, 5, 6];
    const k = int(r, 1, 5);
    const ev = pick(r, [
      { t: "an even number", ok: (f: number) => f % 2 === 0 }, { t: "an odd number", ok: (f: number) => f % 2 === 1 },
      { t: "a prime number", ok: (f: number) => [2, 3, 5].includes(f) }, { t: "a multiple of 3", ok: (f: number) => f % 3 === 0 },
      { t: "a factor of 6", ok: (f: number) => 6 % f === 0 }, { t: "a perfect square", ok: (f: number) => f === 1 || f === 4 },
      { t: `a number greater than ${k}`, ok: (f: number) => f > k }, { t: `a number less than ${k + 1}`, ok: (f: number) => f < k + 1 },
      { t: `a number of at least ${k + 1}`, ok: (f: number) => f >= k + 1 },
    ]);
    const fav = faces.filter(ev.ok), n = fav.length;
    return { stem: `A fair die is thrown once. What is the probability of getting ${ev.t}?`, ...choices(r, frac(n, 6), [frac(n, 12), frac(6 - n, 6), frac(1, n + 1), frac(n, 5)], [frac(n + 1, 6), frac(1, 6), frac(n - 1 || 5, 6)]),
      solution: [`Possible outcomes: 1-6, that's 6.`, `Favourable: ${fav.join(", ")} - that's ${n}.`, `Probability = ${fracEq(n, 6)}.`] };
  }
  if (level === 2) {
    const all = Array.from({ length: 36 }, (_, i) => [Math.floor(i / 6) + 1, (i % 6) + 1] as const);
    const k = int(r, 3, 11), lo = int(r, 8, 11), hi = int(r, 4, 6);
    const ev = pick(r, [
      { t: `the total is ${k}`, ok: ([a, b]: readonly [number, number]) => a + b === k },
      { t: `the total is ${k}`, ok: ([a, b]: readonly [number, number]) => a + b === k },
      { t: "both dice show the same number", ok: ([a, b]: readonly [number, number]) => a === b },
      { t: `the total is at least ${lo}`, ok: ([a, b]: readonly [number, number]) => a + b >= lo },
      { t: `the total is less than ${hi}`, ok: ([a, b]: readonly [number, number]) => a + b < hi },
      { t: "the product is even", ok: ([a, b]: readonly [number, number]) => (a * b) % 2 === 0 },
      { t: "both numbers are even", ok: ([a, b]: readonly [number, number]) => a % 2 === 0 && b % 2 === 0 },
    ]);
    const fav = all.filter(ev.ok), ways = fav.length;
    const list = ways <= 8 ? fav.map(([a, b]) => `(${a},${b})`).join(", ") : `${ways} pairs`;
    return { stem: `Two dice are thrown together. What is the probability that ${ev.t}?`,
      ...choices(r, frac(ways, 36), [frac(ways, 12), frac(ways + 1, 36), frac(36 - ways, 36), frac(ways, 18)], [frac(1, 6), frac(1, 2), frac(ways - 1 || 2, 36), frac(1, 11)]),
      solution: [`Two dice give 6 × 6 = 36 equally likely outcomes - (2,5) and (5,2) are different.`, `Favourable: ${list}.`, `Probability = ${fracEq(ways, 36)}.`] };
  }
  if (r() < 0.5) {
    const card = pick(r, [
      { t: "a king", n: 4 }, { t: "a red card", n: 26 }, { t: "a face card (jack, queen or king)", n: 12 }, { t: "a heart or a king", n: 16 }, { t: "a red king", n: 2 }, { t: "not an ace", n: 48 },
    ]);
    return { stem: `One card is drawn from a well-shuffled pack of 52. What is the probability that it is ${card.t}?`,
      ...choices(r, frac(card.n, 52), [frac(card.n, 13), frac(52 - card.n, 52), frac(card.n + 1, 52), frac(1, 4)], [frac(card.n, 26), frac(1, 2)]),
      solution: [`A pack has 52 cards (4 suits of 13; hearts and diamonds are red; each suit has a jack, queen and king).`, `Favourable cards: ${card.n}.`, `Probability = ${fracEq(card.n, 52)}.`] };
  }
  const red = int(r, 3, 7), blue = int(r, 2, 6), tot = red + blue;
  const p = frac(nCr(red, 2), nCr(tot, 2));
  return { stem: `A bag has ${red} red and ${blue} blue balls. Two balls are drawn at random (without putting back). What is the probability that both are red?`,
    ...choices(r, p, [frac(red * red, tot * tot), frac(red, tot), frac(2 * red, tot), frac(nCr(blue, 2), nCr(tot, 2))], [frac(red - 1, tot), frac(1, 2)]),
    solution: [`Ways to choose any 2 of ${tot}: ${tot}C2 = ${nCr(tot, 2)}.`, `Ways to choose 2 red of ${red}: ${red}C2 = ${nCr(red, 2)}.`, `Probability = ${fracEq(nCr(red, 2), nCr(tot, 2))}.`] };
}

// ------------------------------------------------------------------ permutations and combinations

const WORDS = ["APPLE", "LETTER", "BANANA", "SCHOOL", "COLLEGE", "PEPPER", "BALLOON", "COFFEE", "INDIA", "ORANGE", "MANGO", "TABLE", "GARDEN", "PENCIL"];

export function pnc(r: Rng, level: Level): Draft {
  if (level === 1) {
    if (r() < 0.5) {
      const n = int(r, 4, 6);
      return { stem: `In how many ways can ${n} students stand in a line?`, ...numChoices(r, factorial(n), [n * n, factorial(n - 1), n * (n - 1)]),
        solution: [`First place: ${n} choices, then ${n - 1}, and so on.`, `${n}! = ${Array.from({ length: n }, (_, i) => n - i).join(" × ")} = ${factorial(n)}.`] };
    }
    const n = int(r, 6, 12), k = int(r, 2, 3);
    return { stem: `In how many ways can a team of ${k} be chosen from ${n} players?`, ...numChoices(r, nCr(n, k), [n * k, nCr(n, k) * factorial(k), nCr(n, k - 1)]),
      solution: [`Order doesn't matter, so use combinations: ${n}C${k}.`, `= ${n}! ÷ (${k}! × ${n - k}!) = ${nCr(n, k)}.`] };
  }
  if (level === 2) {
    const w = pick(r, WORDS);
    const counts = [...w].reduce<Record<string, number>>((m, c) => ({ ...m, [c]: (m[c] ?? 0) + 1 }), {});
    const reps = Object.entries(counts).filter(([, c]) => c > 1);
    const ans = factorial(w.length) / reps.reduce((p, [, c]) => p * factorial(c), 1);
    return { stem: `How many different arrangements can be made with all the letters of the word ${w}?`,
      ...numChoices(r, ans, [factorial(w.length), ans * 2, factorial(w.length - 1)]),
      solution: [`${w} has ${w.length} letters${reps.length ? `, with ${reps.map(([c, k]) => `${c} repeated ${k} times`).join(" and ")}` : ", all different"}.`,
        `Arrangements = ${w.length}!${reps.length ? ` ÷ (${reps.map(([, k]) => `${k}!`).join(" × ")})` : ""} = ${ans}.`] };
  }
  const M = int(r, 5, 8), W = int(r, 4, 7), a = int(r, 2, 3), b = int(r, 2, 3);
  const ans = nCr(M, a) * nCr(W, b);
  return { stem: `A committee of ${a} men and ${b} women is to be formed from ${M} men and ${W} women. In how many ways can this be done?`,
    ...numChoices(r, ans, [nCr(M + W, a + b), nCr(M, a) + nCr(W, b), ans * 2]),
    solution: [`Choose the men: ${M}C${a} = ${nCr(M, a)}. Choose the women: ${W}C${b} = ${nCr(W, b)}.`, `Both choices together: ${nCr(M, a)} × ${nCr(W, b)} = ${ans}.`] };
}

// ------------------------------------------------------------------ data interpretation (a table)

const PRODUCTS = ["Laptops", "Phones", "Tablets", "Printers", "Speakers"];
const YEARS = ["2021", "2022", "2023", "2024", "2025"];

export function diTable(r: Rng, level: Level): Draft {
  const items = shuffle(r, PRODUCTS).slice(0, 3);
  const rows = YEARS.map((y) => [y, ...items.map(() => int(r, 8, 60) * 5)]);
  const table = { caption: "Units sold by a shop (in hundreds)", head: ["Year", ...items], rows };
  const col = int(r, 0, 2), cell = (yi: number, c = col) => rows[yi][c + 1] as number;
  if (level === 1) {
    const yi = int(r, 0, 4);
    const total = items.reduce((s, _, c) => s + cell(yi, c), 0);
    return { table, stem: `What were the total units sold (in hundreds) in ${YEARS[yi]}?`, ...numChoices(r, total, [total + 5, total - 10, cell(yi, 0) + cell(yi, 1)]),
      solution: [`${YEARS[yi]}: ${items.map((it, c) => `${it} ${cell(yi, c)}`).join(" + ")} = ${total}.`] };
  }
  if (level === 2) {
    const sum = rows.reduce((s, _, yi) => s + cell(yi), 0);
    const avg = sum / 5;
    return { table, stem: `What is the average yearly sale of ${items[col]} (in hundreds) over the five years?`, ...numChoices(r, avg, [sum / 4, avg + 5, Math.max(...rows.map((_, yi) => cell(yi)))]),
      solution: [`Sum = ${rows.map((_, yi) => cell(yi)).join(" + ")} = ${sum}.`, `Average = ${sum} ÷ 5 = ${num(avg)}.`] };
  }
  const y0 = int(r, 0, 3), a = cell(y0);
  if (cell(y0 + 1) === a) rows[y0 + 1][col + 1] = a + 25;
  const b = cell(y0 + 1);
  const ch = ((b - a) / a) * 100;
  const f = (n: number) => `${num(Math.abs(n))}% ${n >= 0 ? "increase" : "decrease"}`;
  return { table, stem: `What was the percentage change in ${items[col]} sales from ${YEARS[y0]} to ${YEARS[y0 + 1]}?`,
    ...choices(r, f(ch), [f(((b - a) / b) * 100), f(b - a), f(-ch)], [f(ch + 5), f(ch - 5)]),
    solution: [`Change = ${b} − ${a} = ${signed(b - a)}.`, `Divide by the earlier year: ${signed(b - a)} ÷ ${a} × 100 = ${signed(ch)}%.`, `That is ${ch >= 0 ? "an increase" : "a decrease"} of ${num(Math.abs(ch))}%.`] };
}
