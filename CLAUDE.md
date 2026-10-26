# CareerFitment - Class-Group Scope Map

This project runs four **independent** assessment/report engines, one per class group. They share almost no code, but a few files ARE genuinely shared - those are the highest-risk files to touch, because a change made "for" one group silently reaches all of them.

**Standing rule: before editing any file below, identify which group(s) it belongs to and say so before making the change.** If a request's own scope would touch more than one group, or touches a Shared file, flag that explicitly before editing - don't discover it after the fact. After finishing, verify with `git status`/`git diff` that only files in the intended group(s) actually changed.

## Class 6-8

| Area | File(s) |
|---|---|
| Scoring | `lib/newAssessment/class6Scoring.ts`, `class7Scoring.ts`, `class8Scoring.ts` |
| Questions | `data/class6-assessment-questions.json`, `data/class7-assessment-questions.json`, `lib/newAssessment/class8Questions.ts` |
| Report adapter | `lib/report/adaptClass678.ts` |
| Report pages | `app/account/Class6Report.tsx`, `Class7Report.tsx` (Class 8 report reads via `adaptClass678.ts` too - confirm the exact file before editing) |

Class 6 and 7 are structurally identical (same question counts/order/mapping tables). Class 8 differs in several specifics (aptitude sub-skills, motivator tag count, MI domain coverage) - don't assume a Class-6 fix automatically applies to Class 8 or vice versa.

## Class 9-10

| Area | File(s) |
|---|---|
| Scoring | `lib/newAssessment/scoring60.ts` |
| Questions | `data/assessment-questions.json` (stage key `"9-10"`), `data/aptitude-questions.json` (stage key `"9-10"`), `data/strengths-questions.json` (stage key `"9-10"`) |
| Career taxonomy | `data/career-clusters.json` (8 clusters), `data/career-map-9-10.json` (~113 professions) |
| Category order | `ORDER_9_10` in `lib/newAssessment/data.ts` |

## Class 11-12

| Area | File(s) |
|---|---|
| Scoring | `lib/newAssessment/scoring11_12.ts` |
| Questions | `data/class-11-12/questions-corrected.json` |
| Career-fit engine | `lib/report/careerFitEngine1112.ts`, `lib/report/careerfit1112.ts` |
| Report sheets | `lib/report/careerFit1112Sheets.tsx`, `lib/report/class11ExtraSheets.tsx` |
| Report adapter | `lib/report/adaptClass11.ts` |
| Detailed career roadmaps | `lib/report/careerRoadmapDetailed1112.ts` (~3 MB, from `data/class-11-12/career-roadmaps-detailed.json`) loads **on demand**, not in the dashboard bundle. Any page that builds 11-12 or Graduates report sheets must first wait with `useDetailedRoadmapsReady()` (`lib/report/useDetailedRoadmaps.ts`) - as `app/account/page.tsx`, `app/admin/report/[uid]` and `app/institution/report/[uid]` do - or `detailedRoadmapFor()` returns null and the report silently falls back to the cluster roadmap. |
| Report pages | `app/account/FullReport.tsx`, `PersonalityMBTI.tsx` |
| Category order | `ORDER_11_12` in `lib/newAssessment/data.ts` |

## Graduates (UG)

For undergraduates currently mid-degree (registration category `"graduate"`, stage key `"ug"` - deliberately its OWN stage key, not a reuse of the shared bank's pre-existing generic `"grad"` entries). Built to mirror Class 11-12's architecture: a pre-exam degree/course picker instead of a stream picker, its own dedicated question bank/scorer/adapter, bypassing the generic `scoreAssessment()` path entirely.

| Area | File(s) |
|---|---|
| Scoring | `lib/newAssessment/scoringGrad.ts` |
| Questions | `data/graduates/questions-corrected.json` (stage key `"ug"`) |
| Degree/course taxonomy | `lib/report/degreeTaxonomyGrad.ts` (from `data/graduates/degree-taxonomy.json`) - powers the pre-exam Domain→Degree→Course picker |
| Career cluster taxonomy | `lib/report/careerClustersGrad.ts` (17 clusters, from `data/graduates/career-clusters.json`; the source's 18th, Personal Care, Beauty & Wellness, was merged into the others) |
| Cluster roadmap content | `lib/report/clusterRoadmapsGrad.ts` (from `data/graduates/cluster-roadmaps.json`) - the 7-section generic roadmap per cluster (yearly skill-building, govt/private internships, certifications, job roles, PG in India, study abroad, career advancement/PhD). Job roles/PG programmes/PhD programmes/entrance exams are pulled directly from source Excel data; yearly-skill-building/internship-sector/certification/study-abroad guidance is authored synthesis, not dedicated primary research the way Class 11-12's 308 career-specific roadmaps are - flagged for review before being treated as authoritative. |
| Role-specific roadmaps | `scripts/build-ug-role-roadmaps.py` turns the Word files (`1-150.docx`, ...) into `public/roadmaps/ug/<slug>.json` + `index.json` (fetched on demand by `lib/report/roleRoadmapGrad.tsx`, never bundled) and the review sheet `data/graduates/ROLE_ROADMAPS_REPORT.md`. Every run rewrites all outputs, so pass ALL batches each time. When the student's chosen career has one, it replaces the Career Selector's tiered roadmap; a role with several versions gets the one written for the student's course. Each version carries a degree level (`ug`/`pg`/`doctoral`, from its stated degree); only versions at the student's own level are offered (the "Degree - career paths" batch is all doctoral, so it is stored but never shown to undergraduates). Hand-reviewed name matches go in `ROLE_ALIASES` in the script. The row numbers in the files ("ID 600 —", "551 — B.Tech … → Role", "558. Role", "Career Roadmap — ID 645") are the `#` column of `Roles_Flat_Classified` in `India_Career_Clusters_Database.xlsx` (2,858 UG rows) - check a new batch's parsed count against its row range there; rows a file simply doesn't contain are reported, not invented. Batches sent after the 2,250 batch (`1-100.docx`, `101-200.docx`, `301-389.docx`, `501-550.docx`, ...) are numbered by the **pending-roadmaps list** instead ("Career ID: 101" = its S.No; "Reference ID" = the sheet row); `data/graduates/pending-roadmap-rows.json` maps S.No → sheet row. The build checks any ID against the sheet (`career-clusters.json`'s UG `masterRows` flatten to exactly the sheet's rows, row N = index N) and only trusts it when that row's role is the roadmap's role - then it uses the row's exact dropdown name, and its degree/course when the file never states them. The build also writes `catalog.json` (every role, its cluster, each version's level and degree/course; regenerate alone with `--catalog-only`), which the Career Library's "Degree roadmaps" (`/account/career-library/roadmaps`, `components/careers/DegreeRoadmaps.tsx`) browses for every class; the block renderer (`RoleBlocks`) lives in `roleRoadmapGrad.tsx` and is shared by the UG report and the library. **Drafted roadmaps:** roles no Word-file batch covers get a shorter AI-assisted draft from `data/graduates/drafted-roadmaps.json` (one entry per sheet row; degree/course/role are taken from that row), expanded by `scripts/ug_drafted_roadmaps.py` at the end of every build (or alone with `--drafts-only`). Drafts are marked `drafted` in the file and index and say on screen that they await expert review; a researched roadmap for the same role replaces the draft automatically. List in `data/graduates/DRAFTED_ROADMAPS.md`. As of 2026-10-22 every one of the sheet's 2,858 UG rows (2,078 roles) has a roadmap. |
| Report sheets | `lib/report/careerFitGradSheets.tsx` |
| Pillar pages text + artwork | `lib/report/pillarNarrativeGrad.ts` (feeds `customDimensions`), images in `public/report/ug/*.webp` |
| Report adapter | `lib/report/adaptGraduate.ts` |
| Category order | `ORDER_UG` in `lib/newAssessment/data.ts` - the 8 pillar sections only (= the source document's 100 questions). The bank's older `degree_fit`/`career_cluster_fit` sets are kept in the JSON but no longer asked; the scorer treats them as unanswered. |

Graduates' Career Selector reuses Class 11-12's `CAREERS_1112`/`career-roadmaps-detailed.json` (via `findCareer1112()`/`detailedRoadmapFor()`, read-only) when a student's typed desired career resolves to one of those 308 researched careers - deliberately NOT a separate data file, to avoid re-authoring what already exists. This is the one place Graduates code imports FROM `careerfit1112.ts`/`careerRoadmapDetailed1112.ts` - read-only, never the reverse.

The `graduate` registration category is enabled (`enabled: true` in `app/register/page.tsx`'s `MILESTONES`); `experienced_professional` is still gated off.

## Working Professionals (Stress & Resilience Check)

Registration category `"experienced_professional"` (label "Working Professionals"), with an experience band asked at sign-up step 2 instead of the student career-clarity question: `"0-5"`, `"5-15"`, `"15+"` (stored as `users/{uid}.experienceBand`). Professionals never take a student assessment: sign-up sends them to `/account/stress`, `/account` redirects them there, and `app/assessment-experience.tsx` sends a professional who lands on `/?begin=1` there too. There is no payment gate on it yet.

| Area | File(s) |
|---|---|
| Question bank | `data/professionals/stress-bank.json` (97 questions per band + 4 work-week facts, ~18 min). Work pressures in **four areas**, OneGrasp's own wording: **Workload** (11 + band items; last 4 weeks), **Behaviour at work** / toxicity (8: fear-based leadership, gaslighting, gossip, cliques, credit stealing, discrimination, harassment, hostile team; last 6 months, "exposure" scale), **Culture & relationships** / psychological safety (7: politics, bullying, speaking up, peer support, fit, org change, relations; agree, right now), **Career & job security** (8: layoffs, sudden loss, promotion, skills, cost of living, pay vs effort, recognition, stuck; agree, right now). 4 band items per band sit inside these areas (ids E3/E4/E1b/E2b, M1/M3/M2b/M4b, S1/S3b/S2b/S4b). Then stress signals, the **Copenhagen Burnout Inventory** (personal 6 + work-related 7, word for word, no time frame - as published; also shown as "exhaustion" in the Workload card), **8 Brief COPE scales** (16 items, word for word, 4-week time frame as Carver allows), and OneGrasp's resilience / recovery / staying-calm / support (manager, family/friends, mentor) / check-in questions. Item ids are stored in results - never reuse one for a different question. Licences: CBI and Brief COPE are free to use with citation; PSS-10 (needs a MAPI licence), WHO-5 (non-commercial only) and the NAQ-R bullying questionnaire are deliberately NOT used. |
| Scoring | `lib/stress/scoring.ts` (tests: `npm run test:stress`) - every answer 0-100; each of the four areas = mean of its answers, and the "Work pressures" pillar = 60% their mean + 40% the worst area (so one severe area isn't averaged away); CBI scored by its own method and bands (50 moderate, 75 high); Brief COPE scales as published (no overall score - "coping balance" is OneGrasp's 50 + (helpful - risky)/2); Stress Index = 70% pressure (40% work pressures, 25% signals, 35% burnout) + 30% (100 - mean of 5 resources); a CBI score of 75+ always means the "burnout risk" zone; drivers ranked by strength, ties to the more strained area; harassment or unfair treatment reported even "once or twice" sets `rights` - the results page then shows a "your rights at work" card (POSH Act Internal Committee, SHe-Box, Law & Rights) and the plan leads with it; answer-quality flags (same answer everywhere, contradictions, too fast). |
| Words and the 30-day plan | `lib/stress/content.ts` - zones, pillar texts, stress sources, career-stage notes per band, the action library and `planActionsFor()`. Tele-MANAS 14416 is shown on every results page, first when the hopelessness check-in is high. |
| Pages | `/account/stress` (start screen or results), `/account/stress/test?band=` ; components in `components/stress/*` (results web page instead of a report: gauge, pressure-vs-resources scale, 8 pillar cards, causes, signals, CBI meters, coping, support, plan with checklists and weekly check-in, progress chart, "How we measured this"; "Save as PDF" prints all four tabs). |
| Storage | `users/{uid}.stress` = `{ results (last 12), plan }`, written by the person's own browser (`lib/stress/client.ts`; not admin-only). Draft answers in localStorage via `scopedKey()`. Career-stage comparison: `/api/stress/benchmarks` keeps one anonymous row per person in the server-only `stressBenchmarks` collection (band, index, 8 pillars) and only returns deciles once a band has 30 people. |

## Shared across ALL groups - highest risk, edit with care

| File | Used by | Why it's risky |
|---|---|---|
| `lib/newAssessment/data.ts` | All | Holds every `CATEGORY_ORDER`/`ORDER_*` constant, `CATEGORY_META`, and the generic question-bank loader - a change meant for one stage's order/labels can silently reorder or relabel another stage's assessment. |
| `data/assessment-questions.json` | 9-10, grad, early, prof (NOT 6-8, NOT 11-12, NOT Graduates/ug, which all have their own dedicated files) | One bank shared by 4 stages under different top-level stage keys (`"9-10"`, `"grad"`, `"early"`, `"prof"`) - editing the wrong stage key, or a bank's shared tag vocabulary, can affect stages you didn't intend to touch. |
| `lib/report/knowledge.ts` | All (via `domainFit()`) | The 15-domain (A-O) catalogue used by every class's "best-fit domain" cards, plus `categoryDeepDive()` text shared across dimensions common to multiple groups. Class 9-10 also feeds its 8-cluster letters (A-H) through this same A-O-keyed logic - see the flagged mislabeling note in `app/account/FullReport.tsx` around `themes`/`riasecScores`. |
| `app/account/FullReport.tsx`, `Dashboard.tsx`, `DashboardMobile.tsx`, `app/admin/report/[uid]/page.tsx` | All | Common report/dashboard shells that branch per class - a shared helper changed for one class's display can affect the others' rendering. |
| `app/api/new-assessment/score/route.ts`, `app/api/new-assessment/generate/route.ts` | All | The two API routes that dispatch to whichever class's scorer/question-set based on the submitted stage - a shared parsing helper touched for one stage can break another's answer parsing. |
| `app/NewExam.tsx` | All | The single exam-taking UI component every stage renders through, including the pre-exam "preinfo" screen (stream+career for 11-12, degree+course+year+career for Graduates) - a shared helper or the `phase` state machine touched for one stage's pre-exam flow can break another's. |
| `app/register/page.tsx`, `app/account/page.tsx`, `app/assessment-experience.tsx`, `lib/auth/formOptions.ts` | All | Sign-up, the dashboard entry and the home/assessment flow branch on category - the Working Professionals branch (band step, redirects to `/account/stress`) sits beside the student flows; a change for students must keep professionals out of the student assessment and payment gate. |
| `lib/report/exportReportHtml.ts` | All (FullReport, Class6Report, Class7Report) | The "Download report" HTML file. It must be self-contained - iPhone's Files viewer runs no JavaScript and loads nothing from the internet - so it embeds every image (resized), the page-wide CSS rules the report uses, and the Latin subset of the Google Fonts. Report layouts must therefore look right without JS (e.g. FullReport's `.rv` reveal is forced visible in the file). |
| `lib/report/prepareStudentReport.ts` | All | The per-class `latestAssessment` -> FullReport adaptation used by every screen showing someone else's report (`/admin/report/[uid]`, the institution portal's report). `Dashboard.tsx` still has its own copy of the same branching - keep the two in step. |
| `app/account/layout.tsx` | All | Deliberately has NO `dynamic = "force-dynamic"`: every `/account` page reads its data in the browser, so they are pre-built and served from the CDN (with it, each click was a server render in the US region - 1-8 s from India). A page that truly needs per-request server data should set its own `dynamic` export, not the layout. |
| `lib/auth/AuthProvider.tsx`, `app/layout.tsx`, `components/course/CoursePlayerShell.tsx` | All | AuthProvider sets the per-student browser-storage scope on sign-in (`lib/progress/userStorage.ts`); the root layout mounts the activity tracker; the course shell waits for sign-in before rendering any tool so its first read uses the right student's key. |

## Per-student progress and the institution portal (all class groups)

- **Browser storage is per student.** Every feature tool's localStorage key goes through `scopedKey()` (`lib/progress/userStorage.ts`) - never a bare fixed key, or students on a shared computer see each other's data. Data saved before this was adopted once per device by the first account to sign in.
- **Progress synced to the account:** feature-course lessons and the dashboard's 30/90-day goals (`lib/progress/progressStore.ts`) on `users/{uid}.progress`; active time by area and day (`components/ActivityTracker.tsx`, areas in `lib/progress/activity.ts`) on `users/{uid}.activity`.
- **Institution portal** (`/institution`, `app/institution/**`, `components/institution/**`, `lib/institution/**`): a school's login (created at `/admin/institutions`) sees only students whose profile `institution` equals the institution's name or an alias. All data goes through server routes (`app/api/institution/**`, `app/api/admin/institutions`, `app/api/student/messages`) that verify the Firebase ID token with the Admin SDK - they need `FIREBASE_PROJECT_ID`/`FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` (503 without). Collections `institutions`, `institutionAccounts`, `institutionMessages` are server-only. Students see messages in `components/SchoolInbox.tsx` (dashboard + the no-assessment screen). Analytics/recommendations are pure functions in `lib/institution/analytics.ts`.
- **Portal features** (pure logic in `lib/institution/features.ts`; server-only collections listed in `lib/institution/types.ts`):
  - parent alignment: public survey `/parent/[token]`;
  - Career Passport: student `/account/passport`, public `/passport/[id]`, verified by the institution;
  - life-skills radar: Scam Shield rounds plus legal-scenario counts (`progress.legal`, counts only);
  - future-skills outlook;
  - decision briefs;
  - assessment trust score: `latestAssessment.quality`, computed in `app/NewExam.tsx` at submit by `lib/assessmentQuality.ts`;
  - message funnel: opened, clicked, acted, using `activity.lastByFeature`;
  - teacher observations;
  - targeted opportunities;
  - peer mentors;
  - voice calls to parents: `lib/institution/voice.ts`, Twilio, needs `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN`/`TWILIO_FROM_NUMBER`.
- **Career areas and "change by 2035" levels** in `features.ts` are OneGrasp planning estimates, labelled as such in the UI.
- **Voice-call translations** (Hindi/Telugu) should be reviewed by a native speaker.
- **Messaging sync** (admin ↔ institution ↔ student):
  - students reply under any message (`SchoolInbox` → `POST /api/student/messages {reply}`), stored in `messageReplies` (`from: "student" | "school"`, `seenBySchool`/`seenByStudent`);
  - schools answer at `/institution/replies` and on the student page (`/api/institution/replies`);
  - OneGrasp messages students as sender id `"onegrasp"` (`ONEGRASP_SENDER`, an `institutionMessages` doc with `institutionId: "onegrasp"`) and answers their replies from `/admin/messages` (`/api/admin/messages`);
  - OneGrasp → schools: `portalNotices`; schools ↔ OneGrasp: `supportThreads` (`/institution/onegrasp`, labelled "Ask OneGrasp");
  - portal nav badges come from `/api/institution/unread`, polled every minute in `components/institution/portalStore.tsx`.
- **Admin "Open portal"** (`/admin/institutions`): opens `/institution?as=<id>`. That id goes into sessionStorage `og.viewInstitution` and is sent as the `X-View-Institution` header (`lib/institution/client.ts`). `requireInstitution` honours it only for admins (`viewAs: true`), and read-receipts are not marked while viewing.
- **Signature features** (every class; linked from the Overview in `Dashboard.tsx` via `SIGNATURE`):
  - Career Test-Drive: `/account/test-drive`, `lib/testDrive.ts`, `/api/test-drive`. Generated once per career by AI (`ANTHROPIC_API_KEY`, else `GROQ_API_KEY`; 503 without), grounded in the UG role roadmaps when one matches, cached in `testDrives/{slug}`. The result goes to `users/{uid}.testDrives`.
  - Family Decision Room: `/account/decision-room`, `lib/decisionRoom.ts`, `/api/student/decision`. The sheet is stored on `users/{uid}.decision`. Parents answer on `/parent/[token]` (`decision.parentResponse`). `AREA_FACTS` are indicative India ranges, labelled as such.
  - Career GPS: `/account/gps`, `lib/gps.ts`. The page computes missions from the student's own data and writes `users/{uid}.gps` from the browser; a week's missions stay fixed once saved.
  - `testDrives` and `decision` are in `adminOnlyUserFields()` in `firestore.rules`, so students can't forge them; `gps` is student-writable.
  - Schools see all three at `/institution/journeys` and on the student page; parents see the decision and this week's GPS on their family page.
- **Job portal** (every class; `/jobs` public, `/account/jobs` in the dashboard menu; full guide in `docs/JOB_PORTAL.md`):
  - listings live in **Supabase** (not Firestore): `supabase/migrations/20261017000000_job_portal.sql`, read with the anon key (RLS: active jobs only), written only by the server importer with `SUPABASE_SERVICE_ROLE_KEY`;
  - imported daily by Vercel Cron (`vercel.json`) → `/api/jobs/sync` (needs `CRON_SECRET`); logic in `lib/jobs/*`, UI in `components/jobs/JobBoard.tsx`;
  - sources only with recorded permission (`lib/jobs/sources.ts`): Remotive, Himalayas (jobs open to India), Jobicy and Remote OK on (public APIs that allow it, with credit + link back); Adzuna, Arbeitnow, employer boards off until confirmed - never scrape;
  - job titles are matched to the UG roadmap roles (`lib/jobs/classify.ts`, from `data/graduates/career-clusters.json` - read-only) for "On my path"; the student's tracker is `users/{uid}.jobs` (student-writable);
  - tests: `npm run test:jobs`.
- **"How this works" panels** (`components/HowItWorks.tsx`) sit at the top of every portal page, the admin Institution Logins and Messages pages, and the student/parent pages above. `/institution/guide` explains every feature and the sync paths. When a feature changes, update its panel.

## Known pre-existing quirks (not yet fixed, flagged here so they aren't mistaken for new bugs)

- Class 6 and 7 never score RIASEC's "Conventional" type - every question's options map only to R/I/A/S/E (verified: no `"Conventional"` string anywhere in `class6Scoring.ts`/`class7Scoring.ts`).
- Class 8's aptitude scoring tallies an internal "verbal" bucket that is never surfaced in the output (`class8Scoring.ts`).
- Class 9-10 runs two different letter-keyed taxonomies through overlapping A-H/A-O letters (8 career clusters vs. the 15-domain catalogue) - `FullReport.tsx` already has a code comment and a `riasecScores` fallback working around the resulting mislabeling risk; be aware of it before changing anything that reads `themes` for a 9-10 profile.

Per explicit instruction: Classes 6-8 are not to be changed as part of any Class 11-12 accuracy/scoring work - their current behavior is considered correct and intentional, not a bug to be brought "in line" with 11-12.
