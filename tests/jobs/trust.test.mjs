import { test } from "node:test";
import assert from "node:assert/strict";
import { assessTrust } from "../../lib/jobs/trust.ts";

const base = { kind: "aggregator", title: "Marketing Intern", company: "Acme", description: "Help our marketing team plan campaigns.", applyUrl: "https://acme.example.com/jobs/1", salary: null };

test("a clean aggregator listing is standard, an employer's own board is verified", () => {
  assert.deepEqual(assessTrust(base), { level: "standard", flags: [] });
  assert.equal(assessTrust({ ...base, kind: "employer" }).level, "verified");
});

test("warning signs mark a listing caution, with a reason for each", () => {
  const cases = [
    "Pay a refundable registration fee of Rs 2,000 to confirm your seat.",
    "Contact HR on WhatsApp for details.",
    "Send your CV to acme.hr.jobs@gmail.com",
    "Guaranteed job after training, no interview!",
    "Earn up to ₹3,000 per day from home.",
    "Like videos and earn - simple task based income.",
    "Share your Aadhaar and bank details to get the offer letter.",
  ];
  for (const description of cases) {
    const r = assessTrust({ ...base, description });
    assert.equal(r.level, "caution", description);
    assert.ok(r.flags.length >= 1, description);
  }
});

test("short links and chat links as the apply link are flagged", () => {
  for (const applyUrl of ["https://bit.ly/abc", "https://wa.me/919999999999", "https://forms.gle/xyz"]) {
    assert.equal(assessTrust({ ...base, applyUrl }).level, "caution", applyUrl);
  }
});

test("ordinary job wording is not flagged", () => {
  for (const description of [
    "We value applications from freshers. Training will be provided.",
    "You will review products in our QA lab and write test reports.",
    "Experience with Telegraf and InfluxDB is a plus.",
    "Email careers@acme.example.com with questions.",
  ]) {
    assert.equal(assessTrust({ ...base, description }).level, "standard", description);
  }
});
