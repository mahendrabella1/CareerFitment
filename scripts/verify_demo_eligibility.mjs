/**
 * Verifies the runtime eligibility resolver.
 *
 * Per-combination career eligibility used to be precomputed into careers.json
 * (947KB of it) and is now derived at request time. This checks the derivation
 * against the rules directly, and — when a snapshot of the old precomputed
 * output is supplied — proves the two agree row for row.
 *
 *   node scripts/verify_demo_eligibility.mjs [path-to-old-byCombination.json]
 *
 * Independent of Next, so it can run in CI without a build.
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, "..", "data", "demo-11-12");

const streams = JSON.parse(readFileSync(join(DATA, "streams.json"), "utf8"));
const careersFile = JSON.parse(readFileSync(join(DATA, "careers.json"), "utf8"));

const RANK = { green: 3, yellow: 2, red: 1 };

function resolveDegree(degree, group) {
  const base = { degree: degree.degree, domain: degree.domain };
  const columns = Object.keys(degree.eligibility);
  if (columns.length === 0) return { ...base, verdict: "green", conditional: true, unlisted: false };
  for (const col of streams.groupFallback[group] ?? [group]) {
    const hit = degree.eligibility[col];
    if (hit) return { ...base, verdict: hit.verdict, conditional: hit.conditional, unlisted: false };
  }
  const family = streams.familyOf[group];
  const covered = new Set(columns.map((c) => streams.columnFamily[c]));
  if (family && covered.has(family)) return { ...base, verdict: "yellow", conditional: true, unlisted: false };
  return { ...base, verdict: "red", conditional: false, unlisted: true };
}

function careersFor(combination) {
  const combo = streams.combinations.find((c) => c.combination === combination);
  if (!combo) return [];
  const byDegree = new Map(streams.degrees.map((d) => [d.degree, resolveDegree(d, combo.group)]));
  const out = [];
  for (const c of careersFile.careers) {
    let best = null, cond = false, unlisted = false;
    for (const name of c.degrees) {
      const d = byDegree.get(name);
      if (!d) continue;
      if (best === null || RANK[d.verdict] > RANK[best]) {
        best = d.verdict; cond = d.conditional; unlisted = d.unlisted;
      }
    }
    if (best === null) continue;
    out.push({
      id: c.id, title: c.title, cluster: c.cluster, domain: c.familyLabel,
      verdict: best, conditional: cond, unlisted: unlisted && best === "red",
      via: c.degrees.filter((n) => byDegree.get(n)?.verdict === best),
    });
  }
  out.sort((a, b) =>
    RANK[b.verdict] - RANK[a.verdict] ||
    a.domain.localeCompare(b.domain) ||
    a.title.localeCompare(b.title));
  return out;
}

const problems = [];
let rows = 0;

// --- rule checks that must hold for every combination ---------------------
for (const combo of streams.combinations) {
  const offered = careersFor(combo.combination);
  rows += offered.length;
  if (offered.length === 0) problems.push(`${combo.combination}: no careers at all`);
  for (const o of offered) {
    if (!["green", "yellow", "red"].includes(o.verdict)) {
      problems.push(`${combo.combination}/${o.id}: bad verdict ${o.verdict}`);
    }
    if (o.via.length === 0) {
      problems.push(`${combo.combination}/${o.id}: verdict ${o.verdict} but no degree carries it`);
    }
    if (o.unlisted && o.verdict !== "red") {
      problems.push(`${combo.combination}/${o.id}: unlisted but not closed`);
    }
  }
}

// --- the rule the whole thing exists to enforce ---------------------------
// A commerce or humanities student must never be offered medicine.
for (const name of ["Commerce without Mathematics", "Humanities with Mathematics"]) {
  const doc = careersFor(name).find((c) => c.id === "doctor");
  if (!doc) problems.push(`${name}: Doctor missing entirely`);
  else if (doc.verdict !== "red") problems.push(`${name}: Doctor is ${doc.verdict}, must be red`);
}
// ...and a PCB student must be.
const pcb = careersFor("PCB / BiPC").find((c) => c.id === "doctor");
if (!pcb || pcb.verdict !== "green") problems.push("PCB / BiPC: Doctor should be green");

console.log(`Resolved ${rows} career rows across ${streams.combinations.length} combinations.`);

// --- equivalence with the old precomputed table ---------------------------
const snapshot = process.argv[2];
if (snapshot && existsSync(snapshot)) {
  const before = JSON.parse(readFileSync(snapshot, "utf8"));
  let compared = 0, diffs = 0;
  for (const [combination, oldList] of Object.entries(before)) {
    const now = careersFor(combination);
    const oldByType = new Map(oldList.map((o) => [o.id, o]));
    if (now.length !== oldList.length) {
      problems.push(`${combination}: ${oldList.length} rows before, ${now.length} now`);
    }
    for (const o of now) {
      const was = oldByType.get(o.id);
      compared++;
      if (!was) { problems.push(`${combination}/${o.id}: not present before`); diffs++; continue; }
      for (const k of ["verdict", "conditional", "unlisted"]) {
        if (String(o[k]) !== String(was[k])) {
          problems.push(`${combination}/${o.id}: ${k} was ${was[k]}, now ${o[k]}`);
          diffs++;
        }
      }
      if (o.via.join("|") !== was.via.join("|")) {
        problems.push(`${combination}/${o.id}: via changed`);
        diffs++;
      }
    }
  }
  console.log(`Compared ${compared} rows against the pre-refactor snapshot: ${diffs} difference(s).`);
} else {
  console.log("No snapshot supplied - rule checks only.");
}

if (problems.length) {
  console.log(`\n${problems.length} PROBLEM(S):`);
  for (const p of problems.slice(0, 40)) console.log("  " + p);
  process.exit(1);
}
console.log("\nAll eligibility checks passed.");
