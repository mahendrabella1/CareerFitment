import { test } from "node:test";
import assert from "node:assert/strict";
import { dedupeBatch, htmlToText, inferEmploymentType, normalizeJob, parseDate, safeHttpsUrl } from "../../lib/jobs/normalize.ts";

const NOW = new Date("2026-10-17T06:00:00Z");
const SOURCE = { id: "test", kind: "aggregator", attribution: "via Test", allowedApplyHosts: ["jobs.example.com"], keepDescription: true };
const raw = (over = {}) => ({
  externalId: "123",
  title: "Junior Data Analyst",
  company: "Acme Analytics",
  location: "Bengaluru, India",
  employmentType: "full_time",
  descriptionHtml: "<p>Work with <b>SQL</b> &amp; dashboards.</p><ul><li>Excel</li><li>Python</li></ul><script>alert(1)</script>",
  applyUrl: "https://jobs.example.com/apply/123?utm_source=feed&ref=x&role=1",
  postedAt: "2026-10-15T10:00:00Z",
  ...over,
});

test("a valid listing becomes a clean row", () => {
  const n = normalizeJob(raw(), SOURCE, NOW);
  assert.equal(n.ok, true);
  const j = n.job;
  assert.equal(j.source, "test");
  assert.equal(j.external_id, "123");
  assert.equal(j.employment_type, "Full-time");
  assert.equal(j.experience_hint, "entry");
  assert.equal(j.apply_url, "https://jobs.example.com/apply/123?role=1", "tracking parameters are removed");
  assert.equal(j.posted_at, "2026-10-15T10:00:00.000Z");
  assert.equal(j.attribution, "via Test");
  assert.ok(!/<|alert/.test(j.description), "description is plain text with scripts removed");
  assert.match(j.description, /SQL & dashboards/);
  assert.match(j.description, /• Excel/);
  assert.equal(j.trust_level, "standard");
});

test("missing required fields are rejected", () => {
  assert.equal(normalizeJob(raw({ title: "" }), SOURCE, NOW).ok, false);
  assert.equal(normalizeJob(raw({ company: "  " }), SOURCE, NOW).ok, false);
  assert.equal(normalizeJob(raw({ externalId: "" }), SOURCE, NOW).ok, false);
  assert.equal(normalizeJob(raw({ externalId: "a b<c>" }), SOURCE, NOW).ok, false);
});

test("unsafe or off-source apply links are rejected", () => {
  for (const url of [
    "http://jobs.example.com/apply/1",
    "javascript:alert(1)",
    "https://user:pw@jobs.example.com/a",
    "https://127.0.0.1/apply",
    "https://localhost/apply",
    "https://evil.example.org/apply",
    "not a url",
    "",
  ]) {
    assert.equal(normalizeJob(raw({ applyUrl: url }), SOURCE, NOW).ok, false, url);
  }
  assert.equal(safeHttpsUrl("https://careers.jobs.example.com/x", ["jobs.example.com"]), "https://careers.jobs.example.com/x", "subdomains of an allowed host pass");
  assert.equal(safeHttpsUrl("https://notjobs.example.com.evil.io/x", ["jobs.example.com"]), null);
});

test("no description is stored when the source's terms don't allow it", () => {
  const n = normalizeJob(raw(), { ...SOURCE, keepDescription: false }, NOW);
  assert.equal(n.ok, true);
  assert.equal(n.job.description, null);
});

test("an unclear job type stays Unknown instead of being guessed", () => {
  assert.equal(inferEmploymentType("", "Data Analyst"), "Unknown");
  assert.equal(inferEmploymentType("internship"), "Internship");
  assert.equal(inferEmploymentType("part_time"), "Part-time");
});

test("dates in the future or unparseable are dropped", () => {
  assert.equal(parseDate("2027-01-01", NOW), null);
  assert.equal(parseDate("yesterday-ish", NOW), null);
  assert.equal(parseDate(1760600000, NOW), new Date(1760600000 * 1000).toISOString(), "unix seconds");
});

test("long descriptions are cut at a word boundary", () => {
  const t = htmlToText(`<p>${"word ".repeat(3000)}</p>`, 100);
  assert.ok(t.length <= 101);
  assert.ok(t.endsWith("…"));
});

test("dedupe keeps one row per source + id", () => {
  const a = normalizeJob(raw(), SOURCE, NOW).job;
  const b = { ...a, title: "Junior Data Analyst (updated)" };
  const c = { ...a, external_id: "124" };
  const out = dedupeBatch([a, b, c]);
  assert.equal(out.length, 2);
  assert.equal(out.find((r) => r.external_id === "123").title, "Junior Data Analyst (updated)");
});
