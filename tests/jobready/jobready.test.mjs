import { test } from "node:test";
import assert from "node:assert/strict";
import { SECTION_ORDER, atsCheck, emptyResume, jdKeywords, normalise, plainText, stageOf } from "../../lib/resume/resume.ts";
import { CATEGORIES, QUESTIONS } from "../../lib/interview/questions.ts";

const good = () => {
  const r = emptyResume({ name: "Asha Rao", email: "asha@example.com", phone: "+91 98765 43210", city: "Pune", institution: "XYZ College" });
  r.summary = "Final-year B.Com student with hands-on GST filing and reconciliation experience from a CA-firm internship. Skilled in Excel, Power BI and clear client communication, looking for a financial analyst internship.";
  r.education[0] = { ...r.education[0], title: "B.Com", start: "Jun 2023", end: "May 2026", score: "CGPA 8.4/10", bullets: [] };
  r.experience = [{ id: "x", title: "Audit Intern", org: "Rao & Co.", place: "Pune", start: "May 2025", end: "Jul 2025", bullets: ["Reconciled GST returns for 15 clients with zero errors", "Built an Excel tracker that cut monthly reporting from 2 days to 2 hours", "Prepared 30 invoices a week"] }];
  r.skills = [{ label: "Technical", items: "Excel, Power BI, Tally, GST" }, { label: "Soft skills", items: "Communication, Teamwork" }];
  return r;
};

test("stage and section order", () => {
  assert.equal(stageOf("class_12"), "school");
  assert.equal(stageOf("graduate"), "college");
  assert.equal(stageOf("experienced_professional"), "professional");
  assert.equal(SECTION_ORDER.professional[1], "experience");
  assert.equal(SECTION_ORDER.school[1], "education");
});

test("a strong resume passes the ATS check", () => {
  const a = atsCheck(good(), "college");
  const bad = a.checks.filter((c) => c.state !== "pass").map((c) => c.id);
  assert.deepEqual(bad, [], `unexpected: ${bad.join(", ")}`);
  assert.equal(a.score, 100);
});

test("the ATS check catches the common problems", () => {
  const r = good();
  r.contact.email = "not-an-email";
  r.summary = "I am hard working.";
  r.experience[0].bullets = ["Responsible for [N] client files", "My job was data entry"];
  r.experience[0].start = "2025";
  const by = Object.fromEntries(atsCheck(r, "college").checks.map((c) => [c.id, c.state]));
  assert.equal(by.contact, "fail");
  assert.equal(by.summary, "warn");
  assert.equal(by.verbs, "warn");
  assert.equal(by.person, "warn");
  assert.equal(by.placeholders, "fail");
  assert.equal(by.dates, "warn", "Mon YYYY mixed with YYYY");
});

test("job-description keywords and match", () => {
  const jd = "We are hiring a Financial Analyst intern. You will build Power BI dashboards, work in Excel and SQL, and support GST compliance. Power BI and SQL experience required. Strong Excel skills.";
  const k = jdKeywords(jd);
  assert.ok(k.includes("power bi"), k.join(", "));
  assert.ok(k.includes("sql") && k.includes("excel"));
  assert.ok(!k.includes("the") && !k.includes("experience"));
  const a = atsCheck(good(), "college", jd);
  assert.ok(a.keywords.matched.includes("excel"));
  assert.ok(a.keywords.missing.includes("sql"));
  assert.ok(a.checks.some((c) => c.id === "keywords"));
});

test("plain text keeps reading order and skips empty sections", () => {
  const t = plainText(good(), "college");
  assert.ok(t.startsWith("ASHA RAO\nPune | +91 98765 43210 | asha@example.com"));
  assert.ok(t.indexOf("EDUCATION") < t.indexOf("INTERNSHIPS & EXPERIENCE"));
  assert.ok(!t.includes("PROJECTS"), "no projects added");
  assert.match(t, /- Reconciled GST returns/);
});

test("normalise fills gaps in an old saved resume", () => {
  const base = emptyResume({ name: "A" });
  const r = normalise({ contact: { email: "a@b.co" }, experience: [{ title: "Intern" }] }, base);
  assert.equal(r.contact.name, "A");
  assert.equal(r.contact.email, "a@b.co");
  assert.deepEqual(r.experience[0].bullets, []);
  assert.ok(r.experience[0].id);
});

test("the interview bank: 100 questions, 10 per area, complete", () => {
  assert.equal(QUESTIONS.length, 100);
  for (const c of CATEGORIES) assert.equal(QUESTIONS.filter((q) => q.cat === c.key).length, 10, c.key);
  assert.equal(new Set(QUESTIONS.map((q) => q.id)).size, 100);
  assert.equal(new Set(QUESTIONS.map((q) => q.q)).size, 100);
  for (const q of QUESTIONS) for (const f of ["q", "why", "how", "answer", "avoid"]) assert.ok(q[f].trim().length > 10, `${q.id}.${f}`);
});
