/**
 * Logical reasoning - generated questions (series, letters, coding,
 * directions, ranking, clocks, calendars, analogies and odd one out).
 * Calendar questions use real dates, worked out with the calendar itself.
 */
import { choices, frac, int, num, numChoices, ord, pick, shuffle, signed, smallestFactor, type Draft, type Level, type Rng } from "./core";

const AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const L = (i: number) => AZ[((i % 26) + 26) % 26];
const pos = (c: string) => AZ.indexOf(c) + 1;

// ------------------------------------------------------------------ number series

export function series(r: Rng, level: Level): Draft {
  type S = { terms: number[]; next: number; rule: string; wrong: number[] };
  const make = (): S => {
    if (level === 1) {
      const k = int(r, 0, 2);
      if (k === 0) { const s = int(r, 2, 30), d = int(r, 2, 12); const t = Array.from({ length: 6 }, (_, i) => s + i * d); return { terms: t.slice(0, 5), next: t[5], rule: `Add ${d} each time.`, wrong: [t[5] + d, t[5] - 1, t[4] + d - 1] }; }
      if (k === 1) { const s = int(r, 1, 5), q = pick(r, [2, 3]); const t = Array.from({ length: 6 }, (_, i) => s * q ** i); return { terms: t.slice(0, 5), next: t[5], rule: `Multiply by ${q} each time.`, wrong: [t[4] + (t[4] - t[3]), t[5] + q, t[5] - s] }; }
      const s = int(r, 1, 8); const t = Array.from({ length: 6 }, (_, i) => (s + i) ** 2); return { terms: t.slice(0, 5), next: t[5], rule: `Squares: ${s}², ${s + 1}², ${s + 2}², ... so next is ${s + 5}².`, wrong: [t[5] + 1, t[4] + (t[4] - t[3]), (s + 5) * 2] };
    }
    if (level === 2) {
      const k = int(r, 0, 2);
      if (k === 0) { const a = int(r, 2, 9), b = int(r, 2, 9), s = int(r, 1, 20); const t = [s]; for (let i = 1; i < 6; i++) t.push(t[i - 1] + (i % 2 ? a : b)); if (a === b) return make(); return { terms: t.slice(0, 5), next: t[5], rule: `Add ${a} and ${b} by turns.`, wrong: [t[4] + b, t[4] + a + b, t[5] + 1] }; }
      if (k === 1) { const d = int(r, 1, 5), c = int(r, 1, 4), s = int(r, 1, 20); const t = [s]; for (let i = 1; i < 6; i++) t.push(t[i - 1] + d + (i - 1) * c); return { terms: t.slice(0, 5), next: t[5], rule: `The differences go up by ${c}: +${d}, +${d + c}, +${d + 2 * c}, ...`, wrong: [t[4] + (t[4] - t[3]), t[5] + c, t[5] - 1] }; }
      const s = int(r, 1, 5), plus = pick(r, [1, -1, 2]); const t = Array.from({ length: 6 }, (_, i) => (s + i) ** 3 + plus); return { terms: t.slice(0, 5), next: t[5], rule: `Cubes ${plus > 0 ? "plus" : "minus"} ${Math.abs(plus)}: n³ ${plus > 0 ? "+" : "−"} ${Math.abs(plus)}, starting at n = ${s}.`, wrong: [(s + 5) ** 3, t[5] + 2, t[4] + (t[4] - t[3])] };
    }
    const k = int(r, 0, 2);
    if (k === 0) { const m = pick(r, [2, 3]), a = pick(r, [1, -1, 2]), s = int(r, 1, 6); const t = [s]; for (let i = 1; i < 6; i++) t.push(t[i - 1] * m + a); return { terms: t.slice(0, 5), next: t[5], rule: `Multiply by ${m}, then ${a > 0 ? "add" : "subtract"} ${Math.abs(a)}.`, wrong: [t[4] * m, t[5] + 2 * a || t[5] + 2, t[4] * m - a] }; }
    if (k === 1) { const a = pick(r, [2, 3]), b = int(r, 2, 6), s = int(r, 1, 8); const t = [s]; for (let i = 1; i < 6; i++) t.push(i % 2 ? t[i - 1] * a : t[i - 1] + b); return { terms: t.slice(0, 5), next: t[5], rule: `Multiply by ${a} and add ${b} by turns.`, wrong: [t[4] + b, t[4] * a + b, t[5] + a] }; }
    const s1 = int(r, 1, 5), s2 = int(r, 2, 7); const t = [s1, s2]; for (let i = 2; i < 6; i++) t.push(t[i - 1] + t[i - 2]); return { terms: t.slice(0, 5), next: t[5], rule: "Each number is the sum of the two before it.", wrong: [t[4] + (t[4] - t[3]), t[5] + 1, t[4] * 2] };
  };
  const s = make();
  return { stem: `What comes next? ${s.terms.join(", ")}, ?`, ...numChoices(r, s.next, s.wrong),
    solution: [`Rule: ${s.rule}`, `So the next number is ${s.next}.`] };
}

// ------------------------------------------------------------------ letter series and positions

export function letters(r: Rng, level: Level): Draft {
  if (level === 1) {
    const k = int(r, 1, 4), s = int(r, 0, 25 - 5 * k);
    const seq = Array.from({ length: 6 }, (_, i) => L(s + i * k));
    return { stem: `What comes next? ${seq.slice(0, 5).join(", ")}, ?`, ...choices(r, seq[5], [L(s + 5 * k + 1), L(s + 5 * k - 1), L(s + 6 * k)], [L(s + 5 * k + 2), L(s + 5 * k - 2), L(s + 5 * k + 3)]),
      solution: [`Each letter moves ${k} place${k > 1 ? "s" : ""} forward in the alphabet (${seq.slice(0, 5).map((c) => `${c}=${pos(c)}`).join(", ")}).`, `${pos(seq[4])} + ${k} = ${pos(seq[5])} → ${seq[5]}.`] };
  }
  if (level === 2) {
    const a = int(r, 1, 3), b = int(r, 1, 3), s = int(r, 0, 25 - 5 * a), e = int(r, 5 * b, 25);
    const pair = (i: number) => `${L(s + i * a)}${L(e - i * b)}`;
    const ans = pair(5);
    return { stem: `What comes next? ${[0, 1, 2, 3, 4].map(pair).join(", ")}, ?`, ...choices(r, ans, [`${L(s + 5 * a)}${L(e - 5 * b + 1)}`, `${L(s + 5 * a + 1)}${L(e - 5 * b)}`, `${L(e - 5 * b)}${L(s + 5 * a)}`], [`${L(s + 6 * a)}${L(e - 6 * b)}`]),
      solution: [`First letters move forward by ${a}: ${[0, 1, 2, 3, 4, 5].map((i) => L(s + i * a)).join(" ")}.`, `Second letters move back by ${b}: ${[0, 1, 2, 3, 4, 5].map((i) => L(e - i * b)).join(" ")}.`, `Next pair: ${ans}.`] };
  }
  const n = int(r, 5, 20), m = int(r, 2, 9), fromRight = r() < 0.5;
  const base = fromRight ? 27 - n : n;
  const idx = base + m;
  if (idx > 26) return letters(r, level);
  const ans = AZ[idx - 1];
  return { stem: `Which letter is ${m} places to the right of the ${ord(n)} letter from the ${fromRight ? "right" : "left"} end of the English alphabet?`,
    ...choices(r, ans, [L(base - m - 1), L(idx - 2), L(idx), L((fromRight ? n : 27 - n) + m - 1)], [L(idx + 1), L(idx - 3), L(idx + 2), L(idx - 4)]),
    solution: [fromRight ? `The ${ord(n)} letter from the right is the ${ord(27 - n)} from the left: ${AZ[base - 1]}.` : `The ${ord(n)} letter from the left is ${AZ[base - 1]}.`, `${m} places to its right: ${base} + ${m} = ${idx} → ${ans}.`] };
}

// ------------------------------------------------------------------ coding and decoding

const WORDS = ["CAT", "DOG", "SUN", "PEN", "BOOK", "TREE", "FISH", "MILK", "GOLD", "STAR", "RAIN", "BIRD", "LAMP", "DESK", "CAKE", "SHIP", "KITE", "ROSE", "BELL", "NEST"];

export function coding(r: Rng, level: Level): Draft {
  const [w1, w2] = shuffle(r, WORDS);
  const shift = (w: string, k: number) => [...w].map((c) => L(pos(c) - 1 + k)).join("");
  if (level === 1) {
    const k = pick(r, [1, 2, 3, -1, -2]);
    const c1 = shift(w1, k), ans = shift(w2, k);
    return { stem: `If ${w1} is written as ${c1} in a code, how is ${w2} written in that code?`,
      ...choices(r, ans, [shift(w2, -k), shift(w2, k + Math.sign(k)), [...ans].reverse().join("")], [shift(w2, k + 2 * Math.sign(k)), shift(w2, -2 * k)]),
      solution: [`Each letter of ${w1} moves ${Math.abs(k)} place${Math.abs(k) > 1 ? "s" : ""} ${k > 0 ? "forward" : "back"}: ${[...w1].map((c, i) => `${c}→${c1[i]}`).join(", ")}.`, `Do the same to ${w2}: ${[...w2].map((c, i) => `${c}→${ans[i]}`).join(", ")} = ${ans}.`] };
  }
  if (level === 2) {
    const opp = (w: string) => [...w].map((c) => L(26 - pos(c))).join("");
    if (r() < 0.5) {
      const c1 = opp(w1), ans = opp(w2);
      return { stem: `In a code, ${w1} is written as ${c1}. How is ${w2} written?`,
        ...choices(r, ans, [shift(w2, 1), [...ans].reverse().join(""), shift(ans, 1)], [shift(w2, -1)]),
        solution: [`Each letter is replaced by its "opposite" letter (A↔Z, B↔Y, C↔X ...): position p becomes 27 − p.`, `${[...w2].map((c, i) => `${c}(${pos(c)})→${ans[i]}(${27 - pos(c)})`).join(", ")} = ${ans}.`] };
    }
    const rev = (w: string) => [...w].reverse().join("");
    const c1 = shift(rev(w1), 1), ans = shift(rev(w2), 1);
    return { stem: `In a code, ${w1} is written as ${c1}. How is ${w2} written?`,
      ...choices(r, ans, [shift(w2, 1), rev(w2), shift(rev(w2), -1)], [shift(rev(w2), 2)]),
      solution: [`The word is written backwards (${w1} → ${rev(w1)}), then each letter moves 1 place forward (${rev(w1)} → ${c1}).`, `${w2} → ${rev(w2)} → ${ans}.`] };
  }
  const sum = (w: string) => [...w].reduce((s, c) => s + pos(c), 0);
  return { stem: `If ${w1} = ${sum(w1)} in a code, what is ${w2}?`, ...numChoices(r, sum(w2), [sum(w2) + w2.length, sum(w2) - 1, sum(w1) + w2.length]),
    solution: [`Each letter is its place in the alphabet, added up: ${[...w1].map((c) => `${c}=${pos(c)}`).join(" + ")} = ${sum(w1)}.`, `${w2}: ${[...w2].map((c) => pos(c)).join(" + ")} = ${sum(w2)}.`] };
}

// ------------------------------------------------------------------ directions

const DIRS8 = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];
const TRIPLES: [number, number, number][] = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [20, 21, 29]];

/** Where (dx east, dy north) lies from the start. */
function where(dx: number, dy: number): string {
  const ns = dy > 0 ? "North" : dy < 0 ? "South" : "";
  const ew = dx > 0 ? "East" : dx < 0 ? "West" : "";
  return ns && ew ? `${ns}-${ew}` : ns || ew;
}

export function direction(r: Rng, level: Level): Draft {
  if (level === 3) {
    let facing = int(r, 0, 3) * 2;
    const start = facing;
    const steps = Array.from({ length: 3 }, () => ({ deg: pick(r, [45, 90, 135, 180]), cw: r() < 0.5 }));
    for (const s of steps) facing = (facing + (s.cw ? 1 : -1) * (s.deg / 45) + 8) % 8;
    const ans = DIRS8[facing];
    const describe = steps.map((s) => `${s.deg}° ${s.cw ? "clockwise" : "anticlockwise"}`);
    return { stem: `A girl is facing ${DIRS8[start]}. She turns ${describe[0]}, then ${describe[1]}, then ${describe[2]}. Which direction is she facing now?`,
      ...choices(r, ans, [DIRS8[(facing + 4) % 8], DIRS8[(facing + 2) % 8], DIRS8[(facing + 6) % 8]], [DIRS8[(facing + 1) % 8]]),
      solution: [`Count in 45° steps (clockwise +, anticlockwise −): ${steps.map((s) => `${s.cw ? "+" : "−"}${s.deg / 45}`).join(" ")} = ${signed(steps.reduce((t, s) => t + (s.cw ? 1 : -1) * (s.deg / 45), 0))} steps.`, `From ${DIRS8[start]} that lands on ${ans}.`] };
  }
  const [a, b, c] = pick(r, TRIPLES);
  const k = pick(r, [1, 1, 2]);
  const dx = (r() < 0.5 ? 1 : -1) * a * k, dy = (r() < 0.5 ? 1 : -1) * b * k, dist = c * k;
  const ans = `${dist} m, ${where(dx, dy)}`;
  const wrong = [`${Math.abs(dx) + Math.abs(dy)} m, ${where(dx, dy)}`, `${dist} m, ${where(-dx, dy)}`, `${dist} m, ${where(dx, -dy)}`];
  const leg = (d: number, axis: "x" | "y") => (axis === "y" ? (d > 0 ? "North" : "South") : d > 0 ? "East" : "West");
  const turn = (from: string, to: string) => {
    const i = DIRS8.indexOf(from), j = DIRS8.indexOf(to);
    return (j - i + 8) % 8 === 2 ? "right" : "left";
  };
  if (level === 1) {
    return { stem: `Sam walks ${Math.abs(dy)} m ${leg(dy, "y")}, then turns ${turn(leg(dy, "y"), leg(dx, "x"))} and walks ${Math.abs(dx)} m. How far is he from his starting point, and in which direction?`,
      ...choices(r, ans, wrong, [`${dist + 1} m, ${where(dx, dy)}`]),
      solution: [`He ends ${Math.abs(dy)} m ${leg(dy, "y")} and ${Math.abs(dx)} m ${leg(dx, "x")} of the start.`, `Distance = √(${Math.abs(dy)}² + ${Math.abs(dx)}²) = √${dx * dx + dy * dy} = ${dist} m (Pythagoras).`, `Direction from the start: ${where(dx, dy)}.`] };
  }
  // Three legs: north/south, east/west, then back along the first axis.
  const back = int(r, 2, 12) * k;
  const first = dy + Math.sign(dy) * back;
  const d1 = leg(first, "y"), d2 = leg(dx, "x"), d3 = leg(-first, "y");
  return { stem: `Priya walks ${Math.abs(first)} m ${d1}, turns ${turn(d1, d2)} and walks ${Math.abs(dx)} m, then turns ${turn(d2, d3)} and walks ${back} m. How far is she from the start, and in which direction?`,
    ...choices(r, ans, wrong, [`${Math.abs(first) + Math.abs(dx) + back} m, ${where(dx, dy)}`]),
    solution: [`North-south: ${Math.abs(first)} m ${d1}, then ${back} m back → ${Math.abs(dy)} m ${leg(dy, "y")} of the start.`, `East-west: ${Math.abs(dx)} m ${d2}.`, `Distance = √(${Math.abs(dy)}² + ${Math.abs(dx)}²) = ${dist} m, towards the ${where(dx, dy)}.`] };
}

// ------------------------------------------------------------------ order and ranking

export function ranking(r: Rng, level: Level): Draft {
  if (level === 1) {
    const p = int(r, 3, 25), q = int(r, 3, 25);
    return { stem: `In a row of children, Asha is ${ord(p)} from the left and ${ord(q)} from the right. How many children are in the row?`, ...numChoices(r, p + q - 1, [p + q, p + q + 1, Math.abs(p - q)]),
      solution: [`Children = left position + right position − 1 (Asha is counted twice).`, `${p} + ${q} − 1 = ${p + q - 1}.`] };
  }
  if (level === 2) {
    const n = int(r, 20, 60), k = int(r, 2, n - 1);
    return { stem: `In a class of ${n} students, Kabir ranks ${ord(k)} from the top. What is his rank from the bottom?`, ...numChoices(r, n - k + 1, [n - k, n - k + 2, k]),
      solution: [`Rank from the bottom = total − rank from top + 1.`, `${n} − ${k} + 1 = ${n - k + 1}.`] };
  }
  for (;;) {
    const n = int(r, 30, 60), a = int(r, 4, Math.floor(n / 2)), b = int(r, 4, Math.floor(n / 2));
    const bLeft = n - b + 1, between = bLeft - a - 1;
    if (between < 1) continue;
    return { stem: `In a row of ${n} people, A is ${ord(a)} from the left and B is ${ord(b)} from the right. How many people are between A and B?`,
      ...numChoices(r, between, [n - a - b + 1, between + 1, n - a - b - 2]),
      solution: [`B from the left = ${n} − ${b} + 1 = ${ord(bLeft)}.`, `People between = ${bLeft} − ${a} − 1 = ${between}.`] };
  }
}

// ------------------------------------------------------------------ clocks

export function clock(r: Rng, level: Level): Draft {
  if (level === 3) {
    const h = int(r, 1, 10);
    const total = 60 * h, whole = Math.floor(total / 11), rem = total % 11;
    const fmt = (w: number, p: number) => (p ? `${w} ${frac(p, 11)} minutes past ${h}` : `${w} minutes past ${h}`);
    const ans = fmt(whole, rem);
    return { stem: `At what time between ${h} and ${h + 1} o'clock are the hands of a clock together (overlapping)?`,
      ...choices(r, ans, [`${5 * h} minutes past ${h}`, fmt(whole + 1, rem), fmt(whole, (rem + 5) % 11 || 1)], [`${5 * h + 1} minutes past ${h}`]),
      solution: [`At ${h}:00 the minute hand is ${5 * h} minute-spaces behind the hour hand, and it gains 55 spaces every 60 minutes.`, `Time to catch up = ${5 * h} × 60/55 = ${60 * h}/11 minutes = ${ans.replace(` past ${h}`, "")}.`] };
  }
  const h = int(r, 1, 11);
  const m = level === 1 ? pick(r, [0, 30]) : 2 * int(r, 1, 29);
  const raw = Math.abs(30 * h - 5.5 * m), ang = Math.min(raw, 360 - raw);
  return { stem: `What is the angle between the hour and minute hands of a clock at ${h}:${String(m).padStart(2, "0")}?`,
    ...numChoices(r, ang, [Math.abs(30 * h - 6 * m) % 360, 360 - ang, ang + 5], (n) => `${num(n)}°`),
    solution: [`Angle = |30 × hours − 5.5 × minutes| = |30 × ${h} − 5.5 × ${m}| = ${num(raw)}°.`, raw > 180 ? `More than 180°, so take 360° − ${num(raw)}° = ${num(ang)}°.` : `So the angle is ${num(ang)}°.`] };
}

// ------------------------------------------------------------------ calendars (real dates)

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const dayOf = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d)).getUTCDay();
const dayCount = (y: number) => ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 366 : 365);

export function calendar(r: Rng, level: Level): Draft {
  const others = (d: number) => [DAYS[(d + 1) % 7], DAYS[(d + 6) % 7], DAYS[(d + 2) % 7], DAYS[(d + 5) % 7]];
  if (level === 1) {
    const t = int(r, 0, 6), n = int(r, 10, 200), ans = (t + n) % 7;
    return { stem: `Today is ${DAYS[t]}. What day of the week will it be after ${n} days?`, ...choices(r, DAYS[ans], others(ans)),
      solution: [`Every 7 days the weekday repeats, so only the remainder matters: ${n} ÷ 7 leaves ${n % 7}.`, `${DAYS[t]} + ${n % 7} day${n % 7 === 1 ? "" : "s"} = ${DAYS[ans]}.`] };
  }
  if (level === 2) {
    const y = int(r, 2020, 2030), m = int(r, 1, 11), d = int(r, 1, 28);
    const jan1 = dayOf(y, 0, 1), target = dayOf(y, m, d);
    const gap = Math.round((Date.UTC(y, m, d) - Date.UTC(y, 0, 1)) / 86400000);
    return { stem: `1 January ${y} was a ${DAYS[jan1]}. What day of the week is ${d} ${MONTHS[m]} ${y}?`, ...choices(r, DAYS[target], others(target)),
      solution: [`Days from 1 January to ${d} ${MONTHS[m]}: ${gap}${dayCount(y) === 366 && m > 1 ? ` (${y} is a leap year, so February has 29 days)` : ""}.`, `${gap} ÷ 7 leaves ${gap % 7}, so move ${gap % 7} day${gap % 7 === 1 ? "" : "s"} on from ${DAYS[jan1]}: ${DAYS[target]}.`] };
  }
  const y = int(r, 1950, 2035), m = int(r, 0, 11), d = int(r, 1, 28), target = dayOf(y, m, d);
  const ref = dayOf(2000, 0, 1), gap = Math.round((Date.UTC(y, m, d) - Date.UTC(2000, 0, 1)) / 86400000);
  return { stem: `What day of the week was (or will be) ${d} ${MONTHS[m]} ${y}?`, ...choices(r, DAYS[target], others(target)),
    solution: [`Start from a date you know: 1 January 2000 was a ${DAYS[ref]}.`,
      `From there to ${d} ${MONTHS[m]} ${y} is ${Math.abs(gap).toLocaleString("en-IN")} days ${gap >= 0 ? "later" : "earlier"} (ordinary years have 365 days = 1 odd day, leap years 366 = 2 odd days).`,
      gap >= 0 ? `${Math.abs(gap)} ÷ 7 leaves ${Math.abs(gap) % 7}; ${DAYS[ref]} + ${Math.abs(gap) % 7} = ${DAYS[target]}.` : `${Math.abs(gap)} ÷ 7 leaves ${Math.abs(gap) % 7}; going back ${Math.abs(gap) % 7} from ${DAYS[ref]} gives ${DAYS[target]}.`] };
}

// ------------------------------------------------------------------ analogies and odd one out

const isSquare = (n: number) => Number.isInteger(Math.sqrt(n));

export function oddOne(r: Rng, level: Level): Draft {
  if (level === 1) {
    const kind = int(r, 0, 2);
    let group: number[], odd: number, rule: string;
    if (kind === 0) { group = shuffle(r, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]).slice(0, 3); odd = pick(r, [9, 15, 21, 25, 27, 33, 35, 39]); rule = `${group.join(", ")} are prime numbers; ${odd} is not (${odd} = ${smallestFactor(odd)} × ${odd / smallestFactor(odd)}).`; }
    else if (kind === 1) { group = shuffle(r, [4, 9, 16, 25, 36, 49, 64, 81, 100]).slice(0, 3); odd = pick(r, [8, 12, 18, 24, 27, 32, 45, 50, 60, 72].filter((n) => !isSquare(n))); rule = `${group.join(", ")} are perfect squares; ${odd} is not.`; }
    else { const m = pick(r, [6, 7, 8, 9]); group = shuffle(r, Array.from({ length: 10 }, (_, i) => m * (i + 2))).slice(0, 3); odd = m * int(r, 3, 9) + int(r, 1, m - 1); rule = `${group.join(", ")} are multiples of ${m}; ${odd} is not.`; }
    const { options, answer } = choices(r, String(odd), group.map(String));
    return { stem: "Which number is the odd one out?", options, answer, solution: [rule] };
  }
  if (level === 2) {
    const rules = [
      { f: (n: number) => n * n, t: "the square" }, { f: (n: number) => n ** 3, t: "the cube" },
      { f: (n: number) => 2 * n + 1, t: "double plus 1" }, { f: (n: number) => n * n + 1, t: "the square plus 1" }, { f: (n: number) => n * (n + 1), t: "n × (n + 1)" },
    ];
    // a starts at 3: at 2, "double plus 1" and "square plus 1" both give 5.
    const rule = pick(r, rules), a = int(r, 3, 6), b = int(r, 2, 9);
    if (a === b) return oddOne(r, level);
    const ans = rule.f(b);
    return { stem: `${a} : ${rule.f(a)} :: ${b} : ?`, ...numChoices(r, ans, [ans + 1, b * b === ans ? b ** 3 : b * b, rule.f(a) + (b - a)]),
      solution: [`${rule.f(a)} is ${rule.t} of ${a}.`, `So the answer is ${rule.t} of ${b}: ${ans}.`] };
  }
  // Letter groups: three follow a skip pattern, one breaks it.
  const k = int(r, 1, 3);
  const grp = (s: number, kk = k) => `${L(s)}${L(s + kk)}${L(s + 2 * kk)}`;
  const starts = shuffle(r, Array.from({ length: 26 - 2 * k - 1 }, (_, i) => i)).slice(0, 4);
  const good = starts.slice(0, 3).map((s) => grp(s));
  const s = starts[3], odd = `${L(s)}${L(s + k)}${L(s + 2 * k + 1)}`;
  if (s + 2 * k + 1 > 25) return oddOne(r, level);
  const { options, answer } = choices(r, odd, good);
  return { stem: "Which letter group is the odd one out?", options, answer,
    solution: [`In ${good.join(", ")} the letters move forward by ${k} each time.`, `${odd} breaks it: ${L(s + k)} → ${L(s + 2 * k + 1)} jumps ${k + 1}.`] };
}

