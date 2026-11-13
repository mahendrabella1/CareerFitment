// Public forms (school partnership, privacy requests) and the admin requests screen. npm run test:enquiries
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.FIREBASE_PROJECT_ID = "demo-onegrasp";
process.env.FIREBASE_CLIENT_EMAIL = "test@demo-onegrasp.iam.gserviceaccount.com";
process.env.FIREBASE_PRIVATE_KEY = "not-a-real-key";

const { cleanEnquiry, FIELDS, TRAP } = await import("../../lib/enquiries/forms.ts");
const post = (kind, body) => new Request(`https://test.local/api/enquiries/${kind}`, { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}` }, body: JSON.stringify(body) });
const quiet = async (fn) => { const e = console.error; console.error = () => {}; try { return await fn(); } finally { console.error = e; } };
const school = { school: "Sunrise High School", city: "Hyderabad, Telangana", contactName: "R. Rao", role: "Counsellor", email: "counsellor@sunrise.example", phone: "+91 98765 43210", students: "500-1,000", classes: "Class 9-10", message: "We'd like a demo." };

test("the same checks run in the browser and on the server", () => {
  assert.equal(cleanEnquiry("school", school).ok, true);
  assert.match(cleanEnquiry("school", { ...school, school: "" }).error, /School or college name/);
  assert.match(cleanEnquiry("school", { ...school, email: "not-an-email" }).error, /valid email/);
  assert.match(cleanEnquiry("school", { ...school, phone: "call me" }).error, /valid phone/);
  assert.match(cleanEnquiry("school", { ...school, role: "Hacker" }).error, /choose an option/);
  const long = cleanEnquiry("school", { ...school, message: "x".repeat(5000) });
  assert.equal(long.data.message.length, FIELDS.school.find((f) => f.name === "message").max, "capped");
  assert.equal(cleanEnquiry("privacy", { request: "Delete my account and data", name: "Asha K", email: "asha@example.com", relation: "The account holder" }).ok, true);
  assert.equal(cleanEnquiry("privacy", { request: "Delete everyone's data", name: "x", email: "a@b.co", relation: "The account holder" }).ok, false);
});

test("the public route: unknown kinds 404, bad input 400, bots are thanked and ignored", async () => {
  const { POST } = await import("../../app/api/enquiries/[kind]/route.ts");
  const params = (kind) => ({ params: Promise.resolve({ kind }) });
  assert.equal((await POST(post("nope", school), params("nope"))).status, 404);
  assert.equal((await POST(post("school", { ...school, email: "x" }), params("school"))).status, 400);
  const bot = await POST(post("school", { ...school, [TRAP]: "http://spam.example" }), params("school"));
  assert.equal(bot.status, 200);
  assert.equal((await bot.json()).id, "SC-THANKS", "nothing saved");
  // A real one reaches the database (which fails here, with fake credentials) and gets a plain message.
  const real = await quiet(() => POST(post("school", school), params("school")));
  assert.equal(real.status, 500);
  assert.match((await real.json()).error, /support@onegrasp\.com/);
  assert.match(readFileSync("app/api/enquiries/[kind]/route.ts", "utf8"), /rateLimited\(req, `enquiry-\$\{kind\}`, 5, 3600\)/);
});

test("the admin requests screen is for admins only, and the collections are server-only", async () => {
  const { GET, PATCH } = await import("../../app/api/admin/requests/route.ts");
  const r = await quiet(() => GET(new Request("https://test.local/api/admin/requests?kind=school")));
  assert.ok([401, 403, 503].includes(r.status), String(r.status));
  const p = await quiet(() => PATCH(new Request("https://test.local/api/admin/requests", { method: "PATCH", body: JSON.stringify({ kind: "school", id: "SC-AAAAAA", status: "done" }) })));
  assert.ok([401, 403, 503].includes(p.status), String(p.status));
  const rules = readFileSync("firestore.rules", "utf8");
  for (const c of ["schoolEnquiries", "privacyRequests"]) assert.ok(!rules.includes(c), `${c} has no client rule - the catch-all denies it`);
  assert.match(rules, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/);
});

test("the home page and the For schools page carry the partnership form", () => {
  const home = readFileSync("app/Landing.tsx", "utf8");
  assert.match(home, /id="partner"/);
  assert.match(home, /<EnquiryForm kind="school"/);
  assert.match(home, /<SocialLinks/);
  assert.match(readFileSync("app/features/[slug]/page.tsx", "utf8"), /<EnquiryForm kind="school"/);
  assert.match(readFileSync("app/privacy/request/page.tsx", "utf8"), /<EnquiryForm kind="privacy"/);
});
