// Regression tests for the audit's phase-3 fixes (npm run test:security).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

process.env.FIREBASE_PROJECT_ID = "demo-onegrasp";
process.env.FIREBASE_CLIENT_EMAIL = "test@demo-onegrasp.iam.gserviceaccount.com";
process.env.FIREBASE_PRIVATE_KEY = "not-a-real-key";
process.env.RAZORPAY_KEY_SECRET = "test_secret_value"; // payment is "on"
delete process.env.SMTP_HOST;

const realFetch = globalThis.fetch;
before(() => {
  globalThis.fetch = async (url, init = {}) => {
    if (String(url).includes("accounts:lookup")) {
      const { idToken } = JSON.parse(init.body || "{}");
      return new Response(JSON.stringify(idToken === "good-token" ? { users: [{ email: "student@example.com", localId: "uid-student", emailVerified: true }] } : { error: {} }), { status: idToken === "good-token" ? 200 : 400 });
    }
    return new Response("{}", { status: 200 });
  };
});
after(() => { globalThis.fetch = realFetch; });

const read = (p) => readFileSync(p, "utf8");
const code = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const json = (body, headers = {}) => new Request("https://test.local/api", { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const quiet = async (fn) => { const e = console.error, w = console.warn; console.error = () => {}; console.warn = () => {}; try { return await fn(); } finally { console.error = e; console.warn = w; } };

test("C-03: only the server can mark an account paid", () => {
  const rules = read("firestore.rules");
  const fields = rules.slice(rules.indexOf("function adminOnlyUserFields()"), rules.indexOf("match /users/{uid}"));
  for (const f of ["paid", "paymentStatus", "paidAt", "paymentId", "amountPaid", "couponCode", "paymentVerifiedBy"]) assert.ok(fields.includes(`'${f}'`), f);
  assert.ok(!rules.includes("TODO once the payment routes"), "the TODO is gone");
  const gate = code("app/PaymentGate.tsx");
  assert.ok(!/setDoc|markPaid/.test(gate), "the browser no longer writes paid");
  assert.ok(!/demoMode|DEMO-/.test(gate), "a blocked payment window no longer unlocks the exam");
  assert.match(gate, /await paidOnServer\(\)/);
});

test("C-03: the free-code route needs a sign-in and records the waiver itself", async () => {
  const { POST } = await import("../../app/api/payment/redeem/route.ts");
  const { OFFER } = await import("../../lib/offer.ts");
  const r = await quiet(() => POST(json({ code: OFFER.freeCouponCode || "ANYCODE" })));
  // Either the code is no longer free (H-03) or, if it is, a sign-in is required - never a silent unlock.
  assert.ok([400, 401].includes(r.status), String(r.status));
  const src = code("app/api/payment/redeem/route.ts");
  assert.match(src, /if \(!uid\) return NextResponse\.json\(\{ success: false, reason: "sign_in"/);
  assert.match(src, /paymentVerifiedBy: "server"/);
});

test("C-03: the paid paper is scored only for signed-in, paid accounts while payment is on", async () => {
  const { POST } = await import("../../app/api/new-assessment/score/route.ts");
  const body = { stage: "9-10", category: "class_9_10", chosenSets: {}, answers: {} };
  let r = await quiet(() => POST(json(body)));
  assert.equal(r.status, 401, "no sign-in");
  assert.match((await r.json()).message, /answers are saved/);
  // Signed in: the profile can't be read here (fake credentials), so it's let through rather than losing an exam.
  r = await quiet(() => POST(json(body, { Authorization: "Bearer good-token" })));
  assert.notEqual(r.status, 401);
  assert.notEqual(r.status, 402);
  assert.match(code("lib/payments/gate.ts"), /snap\.get\("paid"\) === true/);
  assert.match(code("lib/payments/gate.ts"), /status: 402/);
  assert.match(read("app/NewExam.tsx"), /Authorization: `Bearer \$\{idToken\}`/);
});
