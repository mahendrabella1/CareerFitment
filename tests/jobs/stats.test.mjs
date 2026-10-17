import { test } from "node:test";
import assert from "node:assert/strict";
import { summarizeJobs } from "../../lib/jobs/stats.ts";

const NOW = new Date("2026-10-17T06:00:00Z");
const row = (over = {}) => ({
  company: "Acme", company_logo: null, category: "Business, Finance & Entrepreneurship", location: "Remote",
  employment_type: "Full-time", workplace_type: "Remote", is_fresher: false, experience_hint: null,
  posted_at: "2026-10-15T00:00:00Z", role_match: null, last_seen_at: "2026-10-17T02:30:00Z", ...over,
});

test("counts come straight from the listings", () => {
  const s = summarizeJobs([
    row(),
    row({ company: "acme ", company_logo: "https://x.example.com/a.png", posted_at: "2026-09-01T00:00:00Z" }),
    row({ company: "Beta Labs", employment_type: "Internship", workplace_type: "On-site", location: "Bengaluru", role_match: "Data Analyst", category: "Engineering, Technology & Computing" }),
    row({ company: "Gamma", experience_hint: "entry", role_match: "Data Analyst", last_seen_at: "2026-10-17T02:31:00Z", posted_at: null }),
  ], NOW);
  assert.equal(s.total, 4);
  assert.equal(s.companies, 3, "company names are matched ignoring case and spaces");
  assert.equal(s.postedThisWeek, 2, "old and undated listings are not 'this week'");
  assert.equal(s.fresher, 2);
  assert.equal(s.remote, 3);
  assert.deepEqual(s.topCompanies[0], { name: "Acme", logo: "https://x.example.com/a.png", count: 2 });
  assert.equal(s.categories["Business, Finance & Entrepreneurship"], 3);
  assert.deepEqual(s.popularRoles, ["Data Analyst"]);
  assert.equal(s.locations[0], "Remote");
  assert.equal(s.lastUpdated, "2026-10-17T02:31:00Z");
});

test("no listings means zeros, not made-up numbers", () => {
  const s = summarizeJobs([], NOW);
  assert.equal(s.total, 0);
  assert.equal(s.companies, 0);
  assert.deepEqual(s.topCompanies, []);
  assert.equal(s.lastUpdated, null);
});
