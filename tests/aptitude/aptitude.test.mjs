import { test } from "node:test";
import assert from "node:assert/strict";
import { TOPICS, APT_TRACKS, topicById, topicSet, mockSet, dailySet, aptTrackFor } from "../../lib/aptitude/topics.ts";
import { BANKS } from "../../lib/aptitude/bank.ts";
import { rngFrom, ord, num } from "../../lib/aptitude/core.ts";

const SEEDS = 250;
const right = (q) => q.options[q.answer];

test("every generated topic, every level: four distinct options, one right answer, a worked solution", () => {
  for (const t of TOPICS.filter((x) => x.gen)) {
    for (const level of [1, 2, 3]) {
      for (let s = 0; s < SEEDS; s++) {
        const r = rngFrom(`${t.id}:${level}:${s}`);
        const d = t.gen(r, level);
        const where = `${t.id} L${level} seed ${s}: ${d.stem}`;
        assert.equal(d.options.length, 4, where);
        assert.equal(new Set(d.options).size, 4, `${where} - duplicate options ${JSON.stringify(d.options)}`);
        assert.ok(d.answer >= 0 && d.answer < 4, where);
        assert.ok(d.stem.length > 10 && d.solution.length > 0 && d.solution.every((x) => x && !x.includes("undefined") && !x.includes("NaN")), where);
        assert.ok(!d.stem.includes("undefined") && !d.stem.includes("NaN") && d.options.every((o) => o && !o.includes("NaN") && !o.includes("undefined") && !o.includes("Infinity")), where);
      }
    }
  }
});

// Independent checks: re-derive the answer from the question text with a different method.
const gen = (id, level, s) => topicById(id).gen(rngFrom(`chk:${id}:${level}:${s}`), level);

test("simplification follows BODMAS", () => {
  for (let s = 0; s < SEEDS; s++) {
    const d = gen("q-arith", 1, s);
    const [, a, b, c, e] = d.stem.match(/(\d+) \+ (\d+) × (\d+) − (\d+)/).map(Number);
    assert.equal(right(d), num(a + b * c - e), d.stem);
  }
});

test("clock angles match the hands' actual positions", () => {
  for (const level of [1, 2]) for (let s = 0; s < SEEDS; s++) {
    const d = gen("r-clock", level, s);
    const [, h, m] = d.stem.match(/at (\d+):(\d+)/).map(Number);
    const hour = (30 * h + 0.5 * m) % 360, minute = 6 * m;
    let diff = Math.abs(hour - minute); if (diff > 180) diff = 360 - diff;
    assert.equal(right(d), `${num(diff)}°`, d.stem);
  }
});

test("calendar answers match Zeller's congruence", () => {
  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const zeller = (y, m, d) => { if (m < 3) { m += 12; y -= 1; } const K = y % 100, J = Math.floor(y / 100); const h = (d + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7; return DAYS[(h + 6) % 7]; };
  assert.equal(zeller(1947, 8, 15), "Friday");
  for (const level of [2, 3]) for (let s = 0; s < SEEDS; s++) {
    const d = gen("r-calendar", level, s);
    const [, day, mon, year] = d.stem.match(/is (\d+) (\w+) (\d{4})\?|be\) (\d+) (\w+) (\d{4})\?/).filter(Boolean);
    assert.equal(right(d), zeller(Number(year), MONTHS.indexOf(mon) + 1, Number(day)), d.stem);
    if (level === 2) { const [, y1, wd] = d.stem.match(/1 January (\d{4}) was a (\w+)/); assert.equal(wd, zeller(Number(y1), 1, 1), d.stem); }
  }
  for (let s = 0; s < SEEDS; s++) {
    const d = gen("r-calendar", 1, s);
    const [, today, n] = d.stem.match(/Today is (\w+)\. .* after (\d+) days/);
    assert.equal(right(d), DAYS[(DAYS.indexOf(today) + Number(n)) % 7], d.stem);
  }
});

test("coding: the same shift applied to both words", () => {
  for (let s = 0; s < SEEDS; s++) {
    const d = gen("r-coding", 1, s);
    const [, w1, c1, w2] = d.stem.match(/If (\w+) is written as (\w+) .* how is (\w+) written/);
    const k = (c1.charCodeAt(0) - w1.charCodeAt(0) + 26) % 26;
    assert.equal(right(d), [...w2].map((ch) => String.fromCharCode(65 + ((ch.charCodeAt(0) - 65 + k) % 26))).join(""), d.stem);
  }
});

test("directions: walking the route lands where the answer says", () => {
  const V = { North: [0, 1], South: [0, -1], East: [1, 0], West: [-1, 0] };
  for (const level of [1, 2]) for (let s = 0; s < SEEDS; s++) {
    const d = gen("r-direction", level, s);
    let x = 0, y = 0, facing = null;
    const turnTo = (f, side) => { const order = ["North", "East", "South", "West"]; return order[(order.indexOf(f) + (side === "right" ? 1 : 3)) % 4]; };
    for (const m of d.stem.matchAll(/(?:turns (left|right) and )?walks (\d+) m(?: (North|South|East|West))?/g)) {
      facing = m[3] ?? turnTo(facing, m[1]);
      x += V[facing][0] * Number(m[2]); y += V[facing][1] * Number(m[2]);
    }
    const dist = Math.round(Math.hypot(x, y));
    const dir = [y > 0 ? "North" : y < 0 ? "South" : "", x > 0 ? "East" : x < 0 ? "West" : ""].filter(Boolean).join("-");
    assert.equal(right(d), `${dist} m, ${dir}`, d.stem);
  }
});

test("ranking, percentages and simple interest re-derived", () => {
  for (let s = 0; s < SEEDS; s++) {
    let d = gen("r-ranking", 1, s);
    const [p, q] = [...d.stem.matchAll(/(\d+)(?:st|nd|rd|th)/g)].map((m) => Number(m[1]));
    assert.equal(right(d), String(p + q - 1), d.stem);
    d = gen("q-percent", 1, s);
    const [, pc, N] = d.stem.replace(/,/g, "").match(/(\d+)% of (\d+)/).map(Number);
    assert.equal(right(d), num((pc * N) / 100), d.stem);
    d = gen("q-interest", 1, s);
    const [, P, R, T] = d.stem.replace(/,/g, "").match(/₹(\d+) at (\d+)% a year for (\d+) years/).map(Number);
    assert.equal(right(d), `₹${num((P * R * T) / 100)}`, d.stem);
  }
});

test("written bank: distinct options, the answer not among the wrong ones, error spotting in order", () => {
  for (const [bank, items] of Object.entries(BANKS)) {
    assert.ok(items.length >= 9, bank);
    const stems = new Set();
    for (const it of items) {
      const key = it.stem + (it.passage ?? "");
      assert.ok(!stems.has(key), `${bank}: duplicate ${it.stem}`); stems.add(key);
      assert.equal(new Set([it.a, ...it.w]).size, 4, `${bank}: ${it.stem}`);
      assert.ok(it.why.length > 10 && [1, 2, 3].includes(it.level), `${bank}: ${it.stem}`);
    }
  }
  const spot = topicSet("v-grammar", 3, "x", 20).filter((q) => q.options.includes("No error"));
  assert.ok(spot.length > 0);
  for (const q of spot) assert.deepEqual(q.options.map((o) => o.slice(0, 3)), ["(A)", "(B)", "(C)", "No "]);
});

test("tracks: real topics, sensible levels, a full mock and a daily ten", () => {
  assert.deepEqual(APT_TRACKS.map((t) => t.id), ["a1", "a2", "a3", "a4"]);
  for (const t of APT_TRACKS) {
    for (const x of t.topics) { assert.ok(topicById(x.id), `${t.id}: ${x.id}`); assert.ok(x.min >= 1 && x.max <= 3 && x.min <= x.max, `${t.id}: ${x.id}`); }
    assert.equal(new Set(t.topics.map((x) => x.id)).size, t.topics.length, t.id);
    const want = t.mock.sections.reduce((n, s) => n + s.count, 0);
    for (const key of ["1", "2", "3"]) {
      const m = mockSet(t, key);
      assert.equal(m.length, want, `${t.id} mock ${key}`);
      assert.equal(new Set(m.map((q) => q.stem + (q.passage ?? "") + [...q.options].sort().join("|") + JSON.stringify(q.table?.rows ?? ""))).size, m.length, `${t.id} mock ${key}: repeated question`);
      assert.deepEqual(mockSet(t, key).map((q) => q.stem), m.map((q) => q.stem), "same mock every time");
      for (const s of t.mock.sections) assert.equal(m.filter((q) => q.section === s.section).length, s.count, `${t.id} ${s.section}`);
    }
    const daily = dailySet(t, (x) => x.min, "d20261107");
    assert.equal(daily.length, 10, t.id);
    assert.deepEqual(dailySet(t, (x) => x.min, "d20261107").map((q) => q.stem), daily.map((q) => q.stem), "same daily set all day");
  }
  assert.equal(aptTrackFor("class_7").id, "a1");
  assert.equal(aptTrackFor("class_9_10").id, "a2");
  assert.equal(aptTrackFor("class_12").id, "a3");
  assert.equal(aptTrackFor("graduate").id, "a4");
  assert.equal(aptTrackFor(undefined).id, "a4");
});

test("practice sets: ten different questions; bank topics never repeat within a set", () => {
  for (const t of TOPICS) for (const level of [1, 2, 3]) {
    const set = topicSet(t.id, level, `set:${t.id}:${level}`, 10);
    const cap = t.bank ? Math.min(10, BANKS[t.bank].length) : 10;
    assert.equal(set.length, cap, `${t.id} L${level}`);
    assert.equal(new Set(set.map((q) => q.stem + (q.passage ?? "") + [...q.options].sort().join("|") + JSON.stringify(q.table?.rows ?? ""))).size, set.length, `${t.id} L${level}: repeated`);
  }
});

test("ordinals", () => {
  assert.deepEqual([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101, 111].map(ord), ["1st", "2nd", "3rd", "4th", "11th", "12th", "13th", "21st", "22nd", "23rd", "101st", "111th"]);
});

import { updateTopic, mastery, sectionScores, aptitudeScore, focusTopics, levelFor, EMPTY_APT } from "../../lib/aptitude/scoring.ts";

test("levels: 80%+ in a set of 8+ moves up, 40% or less moves down, within the track's range", () => {
  const range = { id: "q-percent", min: 1, max: 3 };
  const set = (right, n = 10, sec = 30) => Array.from({ length: n }, (_, i) => ({ ok: i < right, sec }));
  let s = updateTopic(undefined, set(8), range);
  assert.equal(s.level, 2); assert.equal(s.n, 10); assert.equal(s.c, 8);
  s = updateTopic(s, set(9), range); assert.equal(s.level, 3);
  s = updateTopic(s, set(10), range); assert.equal(s.level, 3, "never above the range");
  s = updateTopic(s, set(4), range); assert.equal(s.level, 2);
  assert.equal(updateTopic(undefined, set(2), range).level, 1, "never below the range");
  assert.equal(updateTopic(undefined, set(5, 5), range).level, 1, "a short set doesn't move the level");
  assert.equal(updateTopic(undefined, set(9), range, false).level, 1, "mock answers don't move it");
  assert.equal(updateTopic({ n: 100, c: 50, sec: 0, level: 1, recent: "1".repeat(30), at: 0 }, set(0, 10), range).recent, "1".repeat(20) + "0".repeat(10));
  assert.equal(updateTopic(undefined, [{ ok: true, sec: 5000 }], range).sec, 600, "a forgotten tab counts 10 minutes at most");
});

test("mastery, section scores and the Aptitude Score", () => {
  assert.equal(mastery(undefined).label, "New");
  assert.equal(mastery({ n: 25, c: 22, sec: 0, level: 1, recent: "1".repeat(26) + "0000", at: 0 }).label, "Strong");
  assert.equal(mastery({ n: 10, c: 7, sec: 0, level: 1, recent: "1111111000", at: 0 }).label, "Good");
  assert.equal(mastery({ n: 10, c: 3, sec: 0, level: 1, recent: "1110000000", at: 0 }).label, "Learning");
  const track = APT_TRACKS[3];
  const st = { ...EMPTY_APT, topics: {
    "q-percent": { n: 10, c: 8, sec: 450, level: 1, recent: "1111111100", at: 0 }, // target 45 s → speed 100
    "r-series": { n: 4, c: 4, sec: 160, level: 1, recent: "1111", at: 0 }, // under MIN_ANSWERS
  } };
  const by = Object.fromEntries(sectionScores(st, track).map((s) => [s.section, s]));
  assert.deepEqual([by.quant.accuracy, by.quant.speed, by.quant.score], [80, 100, 84]);
  assert.equal(by.reasoning.score, null, "4 answers isn't enough for a section score");
  assert.equal(by.verbal.answered, 0);
  assert.deepEqual(aptitudeScore(st, track), { score: 84, measured: ["quant"] });
  assert.equal(aptitudeScore(EMPTY_APT, track).score, null);
  const slow = { ...EMPTY_APT, topics: { "q-percent": { n: 10, c: 10, sec: 900, level: 1, recent: "1".repeat(10), at: 0 } } };
  assert.equal(sectionScores(slow, track).find((s) => s.section === "quant").speed, 50, "twice the target time = half speed");
  assert.equal(focusTopics(st, track, 2)[0].id, track.topics.find((t) => !st.topics[t.id]).id, "untried topics after weak ones (none weak here)");
  assert.equal(levelFor({ ...EMPTY_APT, topics: { "q-arith": { n: 1, c: 1, sec: 1, level: 1, recent: "1", at: 0 } } }, track.topics.find((t) => t.id === "q-arith")), 2, "kept inside the track's range");
});

test("given ratios are in lowest terms", () => {
  for (let s = 0; s < SEEDS; s++) {
    const d = topicById("q-ratio").gen(rngFrom(`lt:${s}`), 2);
    for (const [, x, y] of d.stem.matchAll(/(\d+) : (\d+)/g)) { let a = Number(x), b = Number(y); while (b) [a, b] = [b, a % b]; assert.equal(a, 1, d.stem); }
  }
});
