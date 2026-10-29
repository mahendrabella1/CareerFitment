import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { AMOUNT_BANDS, FOR_STUDENTS, NO_FILTERS, amountBand, amountText, deadlineOf, filterProgrammes, programmeUrl, sortProgrammes, stateName } from "../../lib/startups/funding.ts";

const data = JSON.parse(readFileSync(new URL("../../data/startups/funding.json", import.meta.url), "utf8"));
const P = (x) => ({ slug: "s", name: "N", amount_band: null, amount_max: null, deadline_word: "Open now or rolling", deadline_date: null, draftable: false, kind: "grant", stages: [], sectors: [], states: [], run_by_kind: "central", ...x });

test("the data file is complete and every student pick exists", () => {
  assert.ok(data.programmes.length >= 300);
  if (data.totals) assert.equal(data.totals.programmes, data.programmes.length);
  const slugs = new Set(data.programmes.map((p) => p.slug));
  assert.equal(slugs.size, data.programmes.length, "unique slugs");
  for (const s of FOR_STUDENTS) assert.ok(slugs.has(s), s);
  for (const p of data.programmes) assert.match(programmeUrl(p.slug), /^https:\/\/www\.capeasy\.in\/schemes\/[a-z0-9-]+\/\?utm_/);
});

test("amount bands, amount text and state names", () => {
  assert.equal(amountBand(P({ amount_max: 300000 })), "u5l");
  assert.equal(amountBand(P({ amount_max: 2500000 })), "25l-1cr");
  assert.equal(amountBand(P({ amount_max: 1e10 })), "5cr+");
  assert.equal(amountBand(P({})), null);
  assert.equal(AMOUNT_BANDS.length, 5);
  assert.equal(amountText(P({ amount_band: "USD 1" })), "See the programme", "source amounts that lost their unit");
  assert.equal(amountText(P({ amount_band: "₹1" })), "See the programme");
  assert.equal(amountText(P({ amount_band: "Up to ₹10 lakh" })), "Up to ₹10 lakh");
  assert.equal(stateName("andhra-pradesh"), "Andhra Pradesh");
  assert.equal(stateName("jammu-and-kashmir"), "Jammu & Kashmir");
  assert.equal(stateName("dadra-and-nagar-haveli-and-daman-and-diu"), "Dadra & Nagar Haveli and Daman & Diu");
});

test("deadlines: closed ones drop out, 30 days counts as soon", () => {
  const today = "2026-10-29";
  assert.equal(deadlineOf(P({ deadline_date: "2026-10-28" }), today).state, "closed");
  assert.equal(deadlineOf(P({ deadline_date: "2026-11-17" }), today).state, "soon");
  assert.equal(deadlineOf(P({ deadline_date: "2027-03-31" }), today).state, "dated");
  assert.equal(deadlineOf(P({ deadline_word: "Opens in calls" }), today).state, "calls");
  const list = [P({ slug: "a", deadline_date: "2026-10-01" }), P({ slug: "b" })];
  assert.deepEqual(filterProgrammes(list, NO_FILTERS, today).map((p) => p.slug), ["b"]);
});

test("filters and sorting", () => {
  const today = "2026-10-29";
  const list = [
    P({ slug: "a", kind: "loan", amount_max: 5e6, states: ["kerala"], stages: ["growth"] }),
    P({ slug: "b", kind: "grant", amount_max: 2e5, stages: ["idea"], draftable: true }),
    P({ slug: "nidhi-prayas", kind: "grant", amount_max: 1e6, stages: ["prototype"] }),
  ];
  const f = (x) => filterProgrammes(list, { ...NO_FILTERS, ...x }, today).map((p) => p.slug);
  assert.deepEqual(f({ students: true }), ["nidhi-prayas"]);
  assert.deepEqual(f({ early: true }), ["b", "nidhi-prayas"]);
  assert.deepEqual(f({ oneClick: true }), ["b"]);
  assert.deepEqual(f({ states: ["kerala"] }), ["a"]);
  assert.deepEqual(f({ states: ["india"] }), ["b", "nidhi-prayas"], "Across India = no state listed");
  assert.deepEqual(f({ amounts: ["u5l"] }), ["b"]);
  assert.deepEqual(f({ q: "kerala" }), ["a"]);
  assert.deepEqual(sortProgrammes(list, "amount").map((p) => p.slug), ["a", "nidhi-prayas", "b"]);
});
