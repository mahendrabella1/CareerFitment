import { test } from "node:test";
import assert from "node:assert/strict";
import { runImport } from "../../lib/jobs/importer.ts";

const NOW = new Date("2026-10-17T06:00:00Z");
const DAY = 86_400_000;

/** An in-memory stand-in for the Supabase store. */
function memoryStore(seed = []) {
  const jobs = new Map(seed.map((j) => [`${j.source}:${j.external_id}`, { ...j }]));
  const runs = [];
  return {
    jobs,
    runs,
    async ensureSources() {},
    async activeCount(source) { return [...jobs.values()].filter((j) => j.source === source && j.is_active).length; },
    async upsertJobs(rows, seenAt) {
      for (const r of rows) jobs.set(`${r.source}:${r.external_id}`, { ...r, is_active: true, last_seen_at: seenAt });
      return rows.length;
    },
    async expireUnseen(source, before, reason) {
      let n = 0;
      for (const j of jobs.values()) {
        if (j.source === source && j.is_active && j.last_seen_at < before) { j.is_active = false; j.inactive_reason = reason; n++; }
      }
      return n;
    },
    async recordSource() {},
    async startRun() { runs.push({}); return String(runs.length); },
    async finishRun(id, status, results) { runs[Number(id) - 1] = { status, results }; },
  };
}

const rawJob = (id, over = {}) => ({ externalId: String(id), title: `Data Analyst ${id}`, company: "Acme", applyUrl: `https://jobs.example.com/${id}`, ...over });
const source = (id, fetch, over = {}) => ({
  id, name: id, kind: "aggregator", termsUrl: "https://example.com/terms", reviewedOn: "2026-10-17", permissionNote: "", attribution: `via ${id}`,
  allowedApplyHosts: ["jobs.example.com"], completeSnapshot: true, staleDays: 14, keepDescription: true, enabled: true, fetch, ...over,
});
const existing = (src, id, lastSeen) => ({ source: src, external_id: String(id), title: `Old ${id}`, is_active: true, last_seen_at: lastSeen });
const ctx = { fetchJson: async () => { throw new Error("not used"); } };
const opts = { trigger: "test", now: NOW };

test("new jobs are saved and a complete snapshot closes jobs that disappeared", async () => {
  const store = memoryStore([existing("a", 1, "2026-10-16T06:00:00.000Z"), existing("a", 2, "2026-10-16T06:00:00.000Z"), existing("a", 9, "2026-10-16T06:00:00.000Z")]);
  const { status, results } = await runImport([source("a", async () => ({ jobs: [rawJob(1), rawJob(2), rawJob(3)], complete: true }))], store, ctx, opts);
  assert.equal(status, "ok");
  assert.equal(results[0].upserted, 3);
  assert.equal(results[0].expired, 1);
  assert.equal(store.jobs.get("a:9").is_active, false);
  assert.equal(store.jobs.get("a:3").is_active, true);
});

test("one source failing doesn't stop the others, and the failed one expires nothing", async () => {
  const store = memoryStore([existing("bad", 1, new Date(NOW.getTime() - 60 * DAY).toISOString())]);
  const { status, results } = await runImport([
    source("bad", async () => { throw new Error("HTTP 500 from https://api.example.com/?app_key=SECRET123"); }),
    source("good", async () => ({ jobs: [rawJob(1)], complete: true })),
  ], store, ctx, opts);
  assert.equal(status, "partial");
  assert.equal(results[0].status, "failed");
  assert.ok(!results[0].message.includes("SECRET123"), "keys are redacted from messages");
  assert.equal(store.jobs.get("bad:1").is_active, true, "a failed run never closes jobs, however old");
  assert.equal(results[1].status, "ok");
  assert.equal(store.jobs.get("good:1").is_active, true);
});

test("an empty answer is treated as a hiccup, not as every job closing", async () => {
  const store = memoryStore([existing("a", 1, new Date(NOW.getTime() - 60 * DAY).toISOString())]);
  const { results } = await runImport([source("a", async () => ({ jobs: [], complete: true }))], store, ctx, opts);
  assert.equal(results[0].status, "partial");
  assert.equal(results[0].expired, 0);
  assert.equal(store.jobs.get("a:1").is_active, true);
});

test("a suspiciously small snapshot falls back to the stale-days rule", async () => {
  const seed = Array.from({ length: 10 }, (_, i) => existing("a", i + 1, "2026-10-16T06:00:00.000Z"));
  seed.push(existing("a", 99, new Date(NOW.getTime() - 20 * DAY).toISOString()));
  const store = memoryStore(seed);
  const { results } = await runImport([source("a", async () => ({ jobs: [rawJob(1), rawJob(2)], complete: true }))], store, ctx, opts);
  assert.equal(results[0].status, "ok");
  assert.equal(store.jobs.get("a:5").is_active, true, "recently seen jobs stay open");
  assert.equal(store.jobs.get("a:99").is_active, false, "only jobs unseen for staleDays close");
  assert.equal(results[0].expired, 1);
});

test("a partial snapshot only closes jobs unseen for staleDays", async () => {
  const store = memoryStore([existing("a", 1, "2026-10-10T06:00:00.000Z"), existing("a", 2, new Date(NOW.getTime() - 15 * DAY).toISOString())]);
  await runImport([source("a", async () => ({ jobs: [rawJob(3)], complete: false }))], store, ctx, opts);
  assert.equal(store.jobs.get("a:1").is_active, true);
  assert.equal(store.jobs.get("a:2").is_active, false);
});

test("invalid listings are skipped without failing the source, duplicates saved once", async () => {
  const store = memoryStore();
  const { results } = await runImport([source("a", async () => ({
    jobs: [rawJob(1), rawJob(1, { title: "Data Analyst 1 (edited)" }), rawJob(2, { applyUrl: "http://jobs.example.com/2" }), rawJob(3, { company: "" })],
    complete: false,
  }))], store, ctx, opts);
  assert.equal(results[0].status, "ok");
  assert.equal(results[0].fetched, 4);
  assert.equal(results[0].valid, 1);
  assert.equal(store.jobs.size, 1);
  assert.equal(store.jobs.get("a:1").title, "Data Analyst 1 (edited)");
  assert.match(results[0].message, /2 listing\(s\) rejected/);
});

test("a failed save batch marks the run partial and expires nothing", async () => {
  const store = memoryStore([existing("a", 9, "2026-10-01T06:00:00.000Z")]);
  store.upsertJobs = async () => { throw new Error("db down"); };
  const { results } = await runImport([source("a", async () => ({ jobs: [rawJob(1)], complete: true }))], store, ctx, opts);
  assert.equal(results[0].status, "partial");
  assert.equal(store.jobs.get("a:9").is_active, true);
});

test("disabled sources are skipped with their reason", async () => {
  const store = memoryStore();
  let called = false;
  const { status, results } = await runImport([source("off", async () => { called = true; return { jobs: [], complete: false }; }, { enabled: false, disabledReason: "Waiting for permission" })], store, ctx, opts);
  assert.equal(called, false);
  assert.equal(results[0].status, "skipped");
  assert.equal(results[0].message, "Waiting for permission");
  assert.equal(status, "failed", "a run where nothing ran is not reported as ok");
});
