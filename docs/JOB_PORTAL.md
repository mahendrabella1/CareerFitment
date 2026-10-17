# Job portal (OneGrasp Launchpad)

Internships and entry-level jobs, imported once a day from sources that allow
OneGrasp to show them, organised by OneGrasp's 17 career clusters and matched to
the career roles students pick in their report.

| Where | What |
|---|---|
| `/jobs` | Public board - anyone can browse and search, no sign-in. |
| `/account/jobs` | The same board inside the dashboard (menu: **Jobs**), plus **On my path** and the **My jobs** tracker. |
| `components/jobs/JobBoard.tsx` | The whole UI: search, filters, list, detail panel, Trust Shield, report form, tracker. |
| `lib/jobs/*` | Sources, normalising, classification, Trust Shield, importer, Supabase store, search. |
| `app/api/jobs/*` | `GET /api/jobs` (search), `GET /api/jobs/[id]`, `POST /api/jobs/report`, `GET`/`POST /api/jobs/sync` (daily import). |
| `supabase/migrations/20261017000000_job_portal.sql` | Tables, indexes and row-level security. |
| `vercel.json` | The daily cron (02:30 UTC = 08:00 IST). |

## What makes it different from a plain job board

- **Trust Shield** - every listing is checked for the signs common in job scams
  aimed at students: fees or deposits, WhatsApp/Telegram-only contact, personal
  email addresses, "guaranteed job / no interview", daily-earnings hooks, paid
  "tasks", requests for Aadhaar/bank details/OTP, short or chat links as the
  apply link. A listing with any sign is shown as **Check first** with the
  reasons in plain words. Three or more open reports from students add a
  warning too. It never says a listing *is* a scam - it says what to check.
- **On my path** - each job title is matched to OneGrasp's roadmap roles
  (`lib/jobs/classify.ts`, from `data/graduates/career-clusters.json`). When the
  role is one the student's report points to (desired career, top career,
  matches), the job is marked **★ On your path**, and the detail panel links to
  that role's degree roadmap in the Career Library and to Career Test-Drive.
- **My jobs tracker** - saved → applied → interview → offer → closed, stored on
  the student's own Firestore document (`users/{uid}.jobs`, student-writable).
- **Honest facts only** - salary, type and fresher-friendliness are shown only
  when the listing states them; unclear values stay "Unknown". Apply always
  happens on the employer's/source's own page. Descriptions are stored and
  shown as plain text, never as HTML.

## Setup (one time)

1. **Supabase project** - create one (or use the existing one) at supabase.com.
2. **Run the migration** - Supabase dashboard → SQL Editor → paste
   `supabase/migrations/20261017000000_job_portal.sql` → Run. (Or
   `supabase db push` with the Supabase CLI.) It is safe to run twice.
3. **Environment variables** - in Vercel → Project → Settings → Environment
   Variables, and in `.env.local` for local development:

   | Variable | Needed | Notes |
   |---|---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | yes | Project URL. Public. |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Anon key. Public; can only read active jobs (row-level security). |
   | `SUPABASE_SERVICE_ROLE_KEY` | yes | **Server only.** Never prefix with `NEXT_PUBLIC_`. Used by the importer and the report route. |
   | `CRON_SECRET` | yes | **Server only.** At least 16 random characters (`openssl rand -hex 32`). Vercel sends it to the cron automatically. |
   | `JOB_REPORT_SALT` | recommended | Salt for hashing reporters' IPs (rate limiting). Falls back to `CRON_SECRET`. |
   | `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `ADZUNA_PERMISSION_CONFIRMED_ON` | optional | India listings - see Sources. The last one is the date (YYYY-MM-DD) Adzuna confirmed commercial use. |
   | `ARBEITNOW_PERMISSION_CONFIRMED_ON` | optional | Date Arbeitnow gave written permission. |
   | `JOB_GREENHOUSE_BOARDS`, `JOB_LEVER_BOARDS` | optional | Employers' own boards, with their permission - see Sources. |
   | `JOB_SOURCES_OFF` | optional | Comma list of source ids to switch off, e.g. `remotive`. |

4. **Deploy**, then run the first import by hand (otherwise the board stays
   empty until the next 08:00 IST run):

   ```bash
   curl -X POST https://<your-domain>/api/jobs/sync -H "Authorization: Bearer $CRON_SECRET"
   ```

   The answer lists each source: `fetched`, `saved`, `expired`, `status`, `note`.
   Without the Supabase variables every jobs route answers 503 and the board
   shows "The job portal is being set up".

## Sources and permissions (reviewed 2026-10-17)

No source is scraped. Each one is an API whose terms allow showing its jobs,
and stays off until that is confirmed. Where each permission was reviewed is
recorded in `lib/jobs/sources.ts` and in the `job_sources` table.

| Source | State | Conditions we follow |
|---|---|---|
| **Remotive** (worldwide remote jobs) | **On** | Free public API ([terms](https://github.com/remotive-com/remote-jobs-api)). Link back to the Remotive job page and credit Remotive ("via Remotive" on every card). Jobs arrive with a 24 h delay. At most 4 fetches a day (we do 1). No resubmission to Google Jobs/LinkedIn - so the pages carry **no JobPosting structured data**. No sign-up gating - so `/jobs` is browsable without an account. |
| **Adzuna** (India) | Off | [Terms](https://developer.adzuna.com/docs/terms_of_service) allow publishing listings with "Jobs by Adzuna", but commercial use needs Adzuna's agreement. To turn on: register at developer.adzuna.com, email Adzuna to confirm OneGrasp's use, then set the three `ADZUNA_*` variables. Only salaries the employer stated are shown (Adzuna's predicted salaries are not). |
| **Arbeitnow** (Europe) | Off | [Terms](https://arbeitnow.com/en/terms) ask for a link back but restrict commercial public display. Turn on only with their written permission (`ARBEITNOW_PERMISSION_CONFIRMED_ON`). |
| **Employer boards** (Greenhouse, Lever) | Off until configured | An employer's own careers feed, added only with that employer's permission: `JOB_GREENHOUSE_BOARDS='[{"token":"acme","company":"Acme","permissionUrl":"https://...","reviewedOn":"2026-10-20"}]'` (Lever: `"site"` instead of `"token"`). These listings show as **Verified source**. |

Not used, on purpose: LinkedIn, Indeed, Naukri, Glassdoor and any other site
without an API that permits this - scraping them breaks their terms.

## How the daily update works

`/api/jobs/sync` → `runImport()` (`lib/jobs/importer.ts`), one source at a time,
each isolated so one failing source never stops the others:

1. **Fetch** with a time limit (fixed hosts only - no user input ever reaches a URL).
2. **Normalise and validate** (`lib/jobs/normalize.ts`): required fields, an
   HTTPS apply link on the source's allowed hosts (no IPs, no credentials,
   tracking parameters removed), plain-text description, type/workplace only
   when stated, cluster + role match, Trust Shield.
3. **Dedupe** within the batch, then **upsert** in batches of 200 on
   `(source, external_id)` - the same job is never stored twice; each run
   refreshes `last_seen_at`.
4. **Expire** - only after that source's run fully succeeded:
   - a *complete snapshot* (the source returned all its live jobs) closes the
     jobs it no longer lists - unless the run returned under half of what was
     live, which looks like a hiccup, so then only the fallback applies;
   - otherwise jobs not seen for `staleDays` (14-21) are closed.

   A failed, partial or empty run closes nothing. Rows are never deleted
   (`is_active = false` + `inactive_reason`).
5. **Log** - `job_sources.last_*` and a `job_sync_runs` row per run.

Check the last runs in the Supabase SQL editor:

```sql
select started_at, status, trigger, results from job_sync_runs order by started_at desc limit 5;
select id, last_status, last_message, last_success_at from job_sources;
```

### If Vercel Cron isn't available

Vercel's Hobby plan allows one cron a day, which is all this needs. Elsewhere,
any scheduler that can send the POST above works - for example a GitHub Actions
workflow (save as `.github/workflows/jobs-sync.yml`, add `CRON_SECRET` and
`SITE_URL` as repository secrets):

```yaml
name: Daily job import
on:
  schedule: [{ cron: "30 2 * * *" }]
  workflow_dispatch: {}
jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS -X POST "$SITE_URL/api/jobs/sync" -H "Authorization: Bearer $CRON_SECRET"
        env:
          SITE_URL: ${{ secrets.SITE_URL }}
          CRON_SECRET: ${{ secrets.CRON_SECRET }}
```

## Reports from students

"Report this listing" → `POST /api/jobs/report` (reason + optional note; a
hidden honeypot field drops bots). Limits per visitor, by a salted hash of the
IP (the IP itself is not stored): 5 reports an hour, one per listing a day.
`jobs.reported_count` = open reports; at 3+ the listing shows a warning.

Review in the SQL editor:

```sql
select r.created_at, r.reason, r.details, j.title, j.company, j.apply_url
from job_reports r join jobs j on j.id = r.job_id where r.status = 'open' order by r.created_at desc;

-- after checking: close a bad listing, or dismiss the reports
update jobs set is_active = false, inactive_reason = 'Removed after review' where id = '<job id>';
update job_reports set status = 'dismissed' where job_id = '<job id>';
update jobs set reported_count = 0 where id = '<job id>';
```

## Adding a source

1. Confirm in writing (terms page or email) that OneGrasp may show the
   source's jobs publicly, and note any conditions (attribution, delays,
   limits, no resubmission).
2. Add an adapter in `lib/jobs/sources.ts` returning `RawJob`s, with
   `termsUrl`, `reviewedOn`, `permissionNote`, `attribution`,
   `allowedApplyHosts`, `completeSnapshot`, `staleDays`, `keepDescription`
   (false when the terms don't allow showing descriptions), and `enabled`
   tied to a configuration value until the permission is recorded.
3. Add it to `getSources()`, add a test in `tests/jobs/`, run
   `npm run test:jobs`.

## Tests

```bash
npm run test:jobs
```

`tests/jobs/*.test.mjs` (node's built-in test runner; `tests/jobs/ts-hooks.mjs`
lets it import the TypeScript directly): normalising and URL safety, dedupe,
Trust Shield, classification (including that `lib/jobs/clusters.ts` still
matches the cluster file), and the importer with an in-memory store - partial
failures, no expiry after a failed or empty run, the snapshot guard, the
stale-days fallback.

## Next ideas (not built yet)

Fit cards per job from the student's 8 dimensions, a readiness gap ("2 skills
to build for this role"), jobs posted by OneGrasp or a school (`kind:
onegrasp` / `school` → Verified), the school's placement funnel in the
institution portal, GPS missions from saved jobs, and a parent shortlist.
