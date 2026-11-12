# Security audit - remediation tracker

Branch `security/audit-remediation` (from `origin/main` at `bb0c7d8`). Not pushed, not merged.

The audit's own files (reports, `remediation.patch`, `files/`, `PRODUCTION_DEPLOYMENT_CHECKLIST.md`) were not in the repository, so every fix was rebuilt by hand from the descriptions in `FIX_ALL_ISSUES.md`. Each security fix has a regression test in `tests/security/`; the rules have emulator specs in `tests/rules/`.

## Verification (2026-11-12)

| Check | Result |
|---|---|
| `npm run typecheck` | clean |
| `npm test` (every suite, incl. 32 security tests) | 138 / 138 pass |
| `npm run build` | OK; `/account` first-load JS 747 kB (unchanged) |
| Built site run locally (`next start`) | all security headers sent, CSP report-only, no `X-Powered-By`; a retired endpoint answers 410 |
| `pnpm install --frozen-lockfile` (pnpm 10, as Vercel) | passes |
| `pnpm audit --prod` | 64 → 34 (5/30/26/3 → 3 low / 13 moderate / 15 high / 3 critical). What's left is `next@14` and packages it pins, plus the `@grpc/grpc-js` 1.9 that `@firebase/firestore` pins - see 3.10 |
| Secret scan of the tracked tree | only public browser identifiers: the Firebase web API key (`lib/firebase/client.ts`, `lib/firebaseIdentity.ts`) and the Razorpay key id (`lib/razorpay.ts`). Both were already on `main`; no secret was added |
| `npm run test:rules` (Firestore/Storage emulator) | **not run** - needs Java, which isn't installed on this machine |

## Status

| Item | Status | Commit | What changed |
|---|---|---|---|
| C-01 | Done | 0204924 | Admin login has no built-in password, bypass or account creation |
| C-02 | Done | 0204924 | `ADMIN_TOKEN` has no fallback, must be 24+ characters, constant-time compare |
| H-01 | Done | 0204924 | Deadline-alert emails need a sign-in, go only to the caller's own email, exam/scholarship looked up by slug |
| H-02 | Done | 0204924 | AI assistant needs a sign-in, 20 a day, history limited to user/assistant turns |
| H-03 | Done | 0204924, 927c0bd | A coupons outage never enables a free code; the built-in 100%-off code is gone. Free codes live only in `/admin/coupons` |
| H-04 | Done | 0204924 | One Razorpay payment unlocks one account (`payments/{id}` claimed in a transaction) |
| H-05 | Done | 0204924 | A new profile can't start paid, carry another uid or set admin-only fields |
| H-07 | Done | 0204924 | `storage.rules`: owner-only vaults, PDF/image/Word under 10 MB, no overwrites, default deny; `firebase.json` |
| M-01 | Done | 0204924, 5898751 | HSTS, nosniff, frame, referrer and permissions headers; CSP **report-only** (3.9) |
| L-03 | Done | 0204924 | Message links must stay on the site |
| L-07 | Done | 0204924 | Type-check skips test files; `npm test` runs every suite; CI workflow |
| L-01 | Done | cbd2bc0 | Generic error messages; details go to the server log |
| L-02 | Done | cbd2bc0 | Student-entered links render only as http(s) |
| L-04 | Done | cbd2bc0, 3ab1930 | pnpm is the one package manager (Vercel's); lockfile refreshed |
| L-08 | Done | cbd2bc0 | No Firebase config log in the browser |
| M-04 | Done | cbd2bc0 | `/api/crm-lead` needs a sign-in, 3 a day; per-IP limits on 6 public endpoints (**off until Upstash is configured**) |
| M-06 | Done | cbd2bc0 | Sign-up sends a verification email (never blocks sign-up) |
| Q-02, Q-03, Q-06, Q-14 | Done | cbd2bc0 | One token check, one pooled mailer, error pages, stale comment |
| P-03, P-06 | Done | cbd2bc0 | Institutions list cached 60 s; stress benchmarks read one summary per band |
| 2.9 deps | Done | cbd2bc0, 3ab1930 | nodemailer 10.5.0, firebase-admin 14.5.1, patched busboy / fast-xml-parser / grpc-js under it |
| 3.1 C-03 | Done | 8782b49 | Only the server writes payment fields (rules + routes); the paid exam is scored only for paid accounts while payment is on; a failed payment script no longer unlocks the exam |
| 3.2 H-03 | Done | 927c0bd | See H-03 |
| 3.3 M-03 | Done | 1466b24 | Admin access (rules, admin API, send-report) needs a verified email; `/admin` offers the verification link |
| 3.4 M-05 | **Skipped** | - | Moving progress / `latestAssessment` writes to the server touches `NewExam.tsx` (every class group), the demo test, the quality score and older saves - a separate, planned change, not a minimal fix. Certificates are already server-issued |
| 3.5 M-02 / P-02 | **Skipped** | - | Matching students to schools by an `institutionId` instead of the name needs a product decision and a production backfill only the owner can run |
| 3.6 P-01 | **Skipped** | - | Admin user-list pagination is an admin-screen rewrite (performance, not a hole) |
| 3.7 P-04 | No change needed | - | The redeem route already enforces `maxStudents` inside a transaction; only contention under heavy load remains |
| 3.8 M-07 | Done | cd63b5c | The six unreachable legacy `/api/assessment/*` endpoints answer 410. `/api/leads`, completion-email and `/api/report/[sessionId]` are kept |
| 3.9 CSP | Done (report-only) | 5898751 | Built from what the code loads (the plan's draft wasn't available). Not enforced |
| 3.10 H-06 | **Not started** | - | Next.js major upgrade - separate branch `chore/next-upgrade` after this one is merged. No 14.x fix exists (14.2.35 is the last); the fixes need ≥ 15.5.28. The critical image-optimizer RCEs probably don't reach this site (no `next/image` is used, and on Vercel `/_next/image` is served by Vercel), but the upgrade is the fix - do it soon |

## Only the owner can do these

1. **Admin account:** change the `support@onegrasp.com` password, sign out all sessions (Firebase console → Authentication), turn on MFA for the Google/Firebase owner accounts.
2. **Verify the admin email before or right after deploying** - otherwise the admin is locked out of `/admin` (it shows a "Send verification email" button).
3. **Rules:** compare `storage.rules` with the live Storage rules, then `firebase deploy --only firestore:rules,storage`. Until the rules are deployed, H-05 and H-07 are not live at all, and C-03 and M-03 are only half done: a student's browser can still write `paid: true` to their own profile.
4. **Env vars (Vercel):** `ADMIN_TOKEN` (24+ random characters) only if `GET /api/leads` is used; `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` to turn the rate limits on.
5. **Google Cloud / Firebase:** restrict the web API key to the site's domains and the APIs it uses; turn on App Check; turn on Firestore backups (PITR); set budget alerts / spending caps (Firebase, Groq, DeepSeek).
6. **GitHub:** branch protection on `main` (PR + passing CI).
7. **DPDP Act items** from the audit report (privacy notice, consent and deletion requests).
8. **CSP:** watch the browser console on the main pages for a week, add any missing source in `next.config.js`, then rename the header to `Content-Security-Policy`.
9. **Rules tests:** install Java and run `npm run test:rules`.
10. Review this branch, merge it, then ask for the push and for 3.10.
