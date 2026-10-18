import { test } from "node:test";
import assert from "node:assert/strict";
import { fixMojibake, getSources, himalayas, jobicy, remoteOk, salaryText } from "../../lib/jobs/sources.ts";
import { normalizeJob } from "../../lib/jobs/normalize.ts";

const NOW = new Date("2026-10-18T10:00:00Z");
/** A fake fetchJson answering by URL, recording what was asked for. */
const ctxFor = (answer) => { const urls = []; return { urls, ctx: { now: NOW, fetchJson: async (u) => { urls.push(u); return answer(u); } } }; };
const allValid = (source, jobs) => jobs.map((raw) => { const n = normalizeJob(raw, source, NOW); assert.equal(n.ok, true, `${raw.title}: ${n.reason}`); return n.job; });

test("Himalayas: India search, paged, apply through applicationLink", async () => {
  const job = (i, extra = {}) => ({
    title: `Junior Data Analyst ${i}`, companyName: "Acme", companyLogo: "https://cdn-images.himalayas.app/x", employmentType: "Full Time",
    seniority: ["Entry-level"], locationRestrictions: ["India"], description: "<p>SQL and Excel</p>", pubDate: 1792331533,
    minSalary: 600000, maxSalary: 900000, currency: "INR", salaryPeriod: "annual", parentCategories: ["Data Analyst"],
    applicationLink: `https://himalayas.app/companies/acme/jobs/junior-data-analyst-${i}`, guid: `https://himalayas.app/companies/acme/jobs/junior-data-analyst-${i}`, ...extra,
  });
  const { urls, ctx } = ctxFor((u) => ({ jobs: u.endsWith("page=1") ? Array.from({ length: 20 }, (_, i) => job(i)) : [job(99, { locationRestrictions: [] })] }));
  const src = himalayas({ JOB_HIMALAYAS_PAGES: "5" });
  const { jobs, complete } = await src.fetch(ctx);
  assert.equal(complete, false);
  assert.equal(urls.length, 2, "stops at a short page");
  assert.ok(urls.every((u) => u.startsWith("https://himalayas.app/jobs/api/search?country=India&page=")));
  assert.equal(jobs.length, 21);
  const rows = allValid(src, jobs);
  assert.equal(rows[0].external_id, "companies/acme/jobs/junior-data-analyst-0");
  assert.equal(rows[0].location, "India");
  assert.equal(rows[20].location, "Worldwide");
  assert.equal(rows[0].salary_text, "INR 600,000–900,000 a year (as listed)");
  assert.equal(rows[0].is_fresher, true);
  assert.equal(rows[0].employment_type, "Full-time");
  assert.equal(rows[0].attribution, "via Himalayas");
});

test("Jobicy: three queries, de-duplicated, Apply stays on jobicy.com", async () => {
  const job = (id, extra = {}) => ({ id, url: `https://jobicy.com/jobs/${id}-content-writer`, jobTitle: "Content Writer", companyName: "Wordsmith", companyLogo: null,
    jobIndustry: ["Content & Editorial"], jobType: ["Contract"], jobGeo: "Anywhere", jobLevel: "Entry-Level, Junior", jobDescription: "<p>Write</p>", pubDate: "2026-10-18T08:58:23+00:00", ...extra });
  const { urls, ctx } = ctxFor((u) => ({ jobs: u.includes("geo=apac") ? [job(2, { jobGeo: "APAC" }), job(1)] : [job(1), job(3, { salaryMin: 80000, salaryMax: 100000, salaryCurrency: "CAD", salaryPeriod: "yearly" })] }));
  const src = jobicy();
  const { jobs } = await src.fetch(ctx);
  assert.equal(urls.length, 3);
  assert.equal(jobs.length, 3, "a job in two queries is kept once");
  const rows = allValid(src, jobs);
  assert.ok(rows.every((r) => r.apply_url.startsWith("https://jobicy.com/jobs/")));
  assert.equal(rows.find((r) => r.external_id === "3").salary_text, "CAD 80,000–100,000 a year (as listed)");
  assert.equal(rows[0].is_fresher, true);
  assert.equal(rows[0].employment_type, "Contract");
});

test("Remote OK: skips the legal notice, links back to remoteok.com, fixes garbled text", async () => {
  const { ctx } = ctxFor(() => [
    { legal: "API Terms of Service: Please link back..." },
    { id: "1137542", position: "Graduate Transport Planner", company: "Curtins", location: "Ciudad de MÃ©xico, Mexico", description: "<p>Plan</p>", tags: ["medical", "hr"],
      url: "https://remoteOK.com/remote-jobs/remote-graduate-transport-planner-curtins-1137542", date: "2026-10-17T08:00:50+00:00", salary_min: 0, salary_max: 0 },
  ]);
  const src = remoteOk();
  const { jobs } = await src.fetch(ctx);
  assert.equal(jobs.length, 1);
  const [row] = allValid(src, jobs);
  assert.equal(row.apply_url, "https://remoteok.com/remote-jobs/remote-graduate-transport-planner-curtins-1137542");
  assert.equal(row.location, "Ciudad de México, Mexico");
  assert.equal(row.salary_text, null, "a 0 salary is not shown");
  assert.notEqual(row.category, "Healthcare & Medicine", "Remote OK's noisy tags don't pick the field");
});

test("helpers", () => {
  assert.equal(salaryText(50, 75, "USD", "hourly"), "USD 50–75 an hour (as listed)");
  assert.equal(salaryText(null, null, "USD", "annual"), null);
  assert.equal(fixMojibake("Ciudad de MÃ©xico"), "Ciudad de México");
  assert.equal(fixMojibake("Zürich – remote"), "Zürich – remote", "proper text is left alone");
});

test("the four permitted public sources run by default; the rest wait for permission", () => {
  const on = getSources({}).filter((s) => s.enabled).map((s) => s.id);
  assert.deepEqual(on, ["remotive", "himalayas", "jobicy", "remoteok"]);
  assert.equal(getSources({ JOB_SOURCES_OFF: "jobicy" }).find((s) => s.id === "jobicy").enabled, false);
});
