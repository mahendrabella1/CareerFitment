// Regression tests for the audit's phase-2 fixes (npm run test:security).
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

process.env.FIREBASE_PROJECT_ID = "demo-onegrasp";
process.env.FIREBASE_CLIENT_EMAIL = "test@demo-onegrasp.iam.gserviceaccount.com";
process.env.FIREBASE_PRIVATE_KEY = "not-a-real-key";
delete process.env.SMTP_HOST;
delete process.env.UPSTASH_REDIS_REST_URL;

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
const json = (body, headers = {}) => new Request("https://test.local/api", { method: "POST", headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.7", ...headers }, body: JSON.stringify(body) });
const code = (p) => read(p).replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("L-02: research sources keep only http(s) links; public pages clean student links", () => {
  assert.match(read("lib/research/clientProgress.ts"), /url: safeHttpUrl\(source\.url\)/);
  assert.match(read("app/account/research/projects/[id]/sources/page.tsx"), /href=\{safeHttpUrl\(s\.url\)\}/);
  assert.match(read("app/portfolio/[slug]/page.tsx"), /safeHttpUrl\(l\.href\)/);
  assert.match(read("app/portfolio/[slug]/page.tsx"), /href=\{safeHttpUrl\(x\.credentialUrl\)\}/);
  assert.match(read("app/passport/[id]/page.tsx"), /href=\{safeHttpUrl\(m\.evidenceUrl\)\}/);
  assert.match(read("components/jobs/JobBoard.tsx"), /href=\{safeHttpUrl\(t\.applyUrl\)\}/);
});

test("L-08: the Firebase client logs nothing about its config", () => {
  assert.ok(!/console\.log\("Firebase client config/.test(read("lib/firebase/client.ts")));
});

test("L-01: legacy routes and caller() don't send internal details to the browser", () => {
  for (const p of ["app/api/assessment/generate/route.ts", "app/api/assessment/[sessionId]/answers/route.ts", "app/api/assessment/[sessionId]/complete/route.ts", "app/api/assessment/[sessionId]/fitment/route.ts", "app/api/assessment/[sessionId]/score/route.ts", "app/api/assessment/[sessionId]/programmes/route.ts", "app/api/report/[sessionId]/route.ts", "app/api/leads/route.ts", "app/api/admin/seed/route.ts"]) {
    const src = code(p);
    assert.ok(!/message:\s*\w+\.message\b/.test(src), `${p}: message: x.message`);
    assert.ok(!/\$\{\w+\.message\}/.test(src), `${p}: interpolated .message`);
    assert.ok(!/error:\s*\w+ instanceof Error \? \w+\.message/.test(src), `${p}: error.message`);
  }
  const server = code("lib/institution/server.ts");
  assert.ok(!/new ApiError\(503, `Server setup problem/.test(server), "project names stay in the log");
  assert.ok(!/new ApiError\(503, "This deployment has no Firebase admin credentials/.test(server));
});

test("Q-02: one token check - send-report uses verifySignIn; the web API key comes from the environment", () => {
  const sr = read("app/api/admin/send-report/route.ts");
  assert.match(sr, /verifySignIn\(idToken\)/);
  assert.ok(!sr.includes("accounts:lookup"), "no second copy of the lookup");
  assert.match(read("lib/firebaseIdentity.ts"), /process\.env\.NEXT_PUBLIC_FIREBASE_API_KEY \|\|/);
});

test("Q-03: one mail transporter for the whole app", async () => {
  const { execSync } = await import("node:child_process");
  const hits = execSync('git grep --untracked -l "createTransport" -- app lib components', { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  assert.deepEqual(hits, ["lib/mail.ts"]);
  const { cleanSmtpHost, getMailer } = await import("../../lib/mail.ts");
  assert.equal(cleanSmtpHost("https://smtp.hostinger.com:465/x"), "smtp.hostinger.com");
  assert.equal(getMailer(), null, "no SMTP settings, no mailer");
});

test("M-04: the lead route needs a sign-in and uses the account's own email", async () => {
  const { POST } = await import("../../app/api/crm-lead/route.ts");
  let r = await POST(json({ name: "Spam", email: "victim@example.com" }));
  assert.equal(r.status, 401);
  r = await POST(json({ name: "Asha", email: "victim@example.com", phone: "9999999999" }, { Authorization: "Bearer good-token" }));
  assert.equal(r.status, 200);
  const src = code("app/api/crm-lead/route.ts");
  assert.match(src, /email: who\.email/);
  assert.ok(!/email: body\.email/.test(src));
  assert.match(read("app/register/page.tsx"), /Authorization: `Bearer \$\{leadToken\}`/);
});

test("M-04: public endpoints are rate-limited, and say so with a 429", async () => {
  const { setLimiter, rateLimited } = await import("../../lib/security/rateLimit.ts");
  const counts = new Map();
  setLimiter(async (key, max) => { const n = (counts.get(key) ?? 0) + 1; counts.set(key, n); return n <= max; });
  try {
    const req = () => new Request("https://test.local", { headers: { "x-forwarded-for": "198.51.100.1, 10.0.0.1" } });
    assert.equal(await rateLimited(req(), "t", 2, 60), null);
    assert.equal(await rateLimited(req(), "t", 2, 60), null);
    const blocked = await rateLimited(req(), "t", 2, 60);
    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.get("retry-after"), "60");
    assert.ok([...counts.keys()].every((k) => k.includes("198.51.100.1")), "keyed by the client's own IP");
    // The real lead route, through the fake limiter: a 4th lead from one account in a day is refused.
    const { POST } = await import("../../app/api/crm-lead/route.ts");
    const statuses = [];
    for (let i = 0; i < 4; i++) statuses.push((await POST(json({ name: "Asha" }, { Authorization: "Bearer good-token" }))).status);
    assert.deepEqual(statuses, [200, 200, 200, 429]);
  } finally {
    setLimiter();
  }
  for (const p of ["app/api/leads/route.ts", "app/api/payment/coupon/route.ts", "app/api/institutional/check/route.ts", "app/api/new-assessment/score/route.ts", "app/api/money/grade-scam/route.ts", "app/api/startups/grade/route.ts"]) {
    assert.match(read(p), /await rateLimited\(req, "/, p);
  }
});

test("M-04: without Upstash the limiter allows everything (and never throws)", async () => {
  const { limit } = await import("../../lib/security/rateLimit.ts");
  const warn = console.warn; console.warn = () => {};
  try { assert.equal(await limit("x", 0, 60), true); } finally { console.warn = warn; }
});

test("M-06: sign-up asks Firebase to send a verification email, best-effort", () => {
  const src = read("lib/auth/AuthProvider.tsx");
  assert.match(src, /void sendEmailVerification\(cred\.user\)\.catch\(\(\) => \{\}\)/);
});

test("Q-06: error, global-error and not-found pages exist and never print the error", () => {
  for (const p of ["app/error.tsx", "app/global-error.tsx", "app/not-found.tsx"]) assert.ok(existsSync(p), p);
  for (const p of ["app/error.tsx", "app/global-error.tsx"]) {
    const src = read(p);
    assert.match(src, /reset\(\)/);
    assert.ok(!/\{error\.(message|stack)\}/.test(src), `${p} shows the error`);
  }
  assert.match(read("app/global-error.tsx"), /<html/);
});

test("2.9/L-04: one lockfile (pnpm, as Vercel uses), patched nodemailer, no placeholder settings", () => {
  assert.ok(!existsSync("package-lock.json"));
  assert.ok(existsSync("pnpm-lock.yaml"));
  const pkg = JSON.parse(read("package.json"));
  const major = (v) => Number(String(v).replace(/^[^\d]*/, "").split(".")[0]);
  const [maj, min] = String(pkg.dependencies.nodemailer).replace(/^[^\d]*/, "").split(".").map(Number);
  assert.ok(maj > 10 || (maj === 10 && min >= 1), "nodemailer >= 10.1.4 fixes the advisories");
  assert.equal(major(pkg.dependencies.next), 14, "framework majors are a separate step");
  assert.equal(major(pkg.dependencies.firebase), 12, "firebase not downgraded");
  assert.ok(!read("pnpm-workspace.yaml").includes("set this to"));
  assert.match(read(".github/workflows/ci.yml"), /pnpm install --frozen-lockfile/);
});

test("P-06: deciles from the histogram match sorting every score", async () => {
  const { summaryFromRows, applyRow, decilesFromHistogram, emptySummary } = await import("../../lib/stress/benchmarkSummary.ts");
  const areas = ["workload", "toxic"];
  const rows = Array.from({ length: 137 }, (_, i) => ({ overall: (i * 37) % 101, areas: { workload: (i * 13) % 101, toxic: (i * 7) % 50 } }));
  const sorted = (xs) => { const s = [...xs].sort((a, b) => a - b); return Array.from({ length: 11 }, (_, i) => s[Math.min(s.length - 1, Math.round((i / 10) * (s.length - 1)))]); };
  const sum = summaryFromRows(4, "0-5", areas, rows);
  assert.equal(sum.n, 137);
  assert.deepEqual(decilesFromHistogram(sum.overall), sorted(rows.map((r) => r.overall)));
  assert.deepEqual(decilesFromHistogram(sum.areas.toxic), sorted(rows.map((r) => r.areas.toxic)));
  // A retake moves the person's old scores out and the new ones in.
  const moved = applyRow(applyRow(sum, rows[0], -1), { overall: 99, areas: { workload: 1, toxic: 2 } }, 1);
  assert.equal(moved.n, 137);
  assert.deepEqual(decilesFromHistogram(moved.overall), sorted([...rows.slice(1).map((r) => r.overall), 99]));
  assert.equal(applyRow(emptySummary(4, "0-5", areas), rows[0], -1).n, 0, "never negative");
  assert.ok(!/\.collection\(COLLECTION\)\.where\("band", "==", band\)[\s\S]{0,80}\n\s*const body = rows\.length/.test(read("app/api/stress/benchmarks/route.ts")), "GET no longer scans every time");
});

test("P-03: the institutions list is cached for a minute", () => {
  const src = read("lib/institution/server.ts");
  assert.match(src, /INSTITUTIONS_TTL_MS = 60_000/);
  assert.match(src, /return \(await allInstitutions\(db\)\)\.find/);
  assert.match(read("app/api/admin/institutions/route.ts"), /clearInstitutionsCache\(\)/);
});

test("Q-14: no comment claims the app has no server-side auth", async () => {
  const { execSync } = await import("node:child_process");
  let out = "";
  try { out = execSync('git grep -n "this app has none anywhere" -- app lib components', { encoding: "utf8" }); } catch { out = ""; }
  assert.equal(out.trim(), "");
});
