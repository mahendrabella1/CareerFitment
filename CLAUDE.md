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
| Role-specific roadmaps | `scripts/build-ug-role-roadmaps.py` turns the Word files (`1-150.docx`, ...) into `public/roadmaps/ug/<slug>.json` + `index.json` (fetched on demand by `lib/report/roleRoadmapGrad.tsx`, never bundled) and the review sheet `data/graduates/ROLE_ROADMAPS_REPORT.md`. Every run rewrites all outputs, so pass ALL batches each time. When the student's chosen career has one, it replaces the Career Selector's tiered roadmap; a role with several versions gets the one written for the student's course. Each version carries a degree level (`ug`/`pg`/`doctoral`, from its stated degree); only versions at the student's own level are offered (the "Degree - career paths" batch is all doctoral, so it is stored but never shown to undergraduates). Hand-reviewed name matches go in `ROLE_ALIASES` in the script. |
| Report sheets | `lib/report/careerFitGradSheets.tsx` |
| Pillar pages text + artwork | `lib/report/pillarNarrativeGrad.ts` (feeds `customDimensions`), images in `public/report/ug/*.webp` |
| Report adapter | `lib/report/adaptGraduate.ts` |
| Category order | `ORDER_UG` in `lib/newAssessment/data.ts` - the 8 pillar sections only (= the source document's 100 questions). The bank's older `degree_fit`/`career_cluster_fit` sets are kept in the JSON but no longer asked; the scorer treats them as unanswered. |

Graduates' Career Selector reuses Class 11-12's `CAREERS_1112`/`career-roadmaps-detailed.json` (via `findCareer1112()`/`detailedRoadmapFor()`, read-only) when a student's typed desired career resolves to one of those 308 researched careers - deliberately NOT a separate data file, to avoid re-authoring what already exists. This is the one place Graduates code imports FROM `careerfit1112.ts`/`careerRoadmapDetailed1112.ts` - read-only, never the reverse.

As of this build, the `graduate` registration category is still gated `enabled: false` in `app/register/page.tsx`'s `MILESTONES` - flip only after a real manual walkthrough (register a test account, take the assessment, view the report), since no browser-based UI verification has been done yet.

## Shared across ALL groups - highest risk, edit with care

| File | Used by | Why it's risky |
|---|---|---|
| `lib/newAssessment/data.ts` | All | Holds every `CATEGORY_ORDER`/`ORDER_*` constant, `CATEGORY_META`, and the generic question-bank loader - a change meant for one stage's order/labels can silently reorder or relabel another stage's assessment. |
| `data/assessment-questions.json` | 9-10, grad, early, prof (NOT 6-8, NOT 11-12, NOT Graduates/ug, which all have their own dedicated files) | One bank shared by 4 stages under different top-level stage keys (`"9-10"`, `"grad"`, `"early"`, `"prof"`) - editing the wrong stage key, or a bank's shared tag vocabulary, can affect stages you didn't intend to touch. |
| `lib/report/knowledge.ts` | All (via `domainFit()`) | The 15-domain (A-O) catalogue used by every class's "best-fit domain" cards, plus `categoryDeepDive()` text shared across dimensions common to multiple groups. Class 9-10 also feeds its 8-cluster letters (A-H) through this same A-O-keyed logic - see the flagged mislabeling note in `app/account/FullReport.tsx` around `themes`/`riasecScores`. |
| `app/account/FullReport.tsx`, `Dashboard.tsx`, `DashboardMobile.tsx`, `app/admin/report/[uid]/page.tsx` | All | Common report/dashboard shells that branch per class - a shared helper changed for one class's display can affect the others' rendering. |
| `app/api/new-assessment/score/route.ts`, `app/api/new-assessment/generate/route.ts` | All | The two API routes that dispatch to whichever class's scorer/question-set based on the submitted stage - a shared parsing helper touched for one stage can break another's answer parsing. |
| `app/NewExam.tsx` | All | The single exam-taking UI component every stage renders through, including the pre-exam "preinfo" screen (stream+career for 11-12, degree+course+year+career for Graduates) - a shared helper or the `phase` state machine touched for one stage's pre-exam flow can break another's. |
| `lib/report/prepareStudentReport.ts` | All | The per-class `latestAssessment` -> FullReport adaptation used by every screen showing someone else's report (`/admin/report/[uid]`, the institution portal's report). `Dashboard.tsx` still has its own copy of the same branching - keep the two in step. |
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
- **"How this works" panels** (`components/HowItWorks.tsx`) sit at the top of every portal page, the admin Institution Logins and Messages pages, and the student/parent pages above. `/institution/guide` explains every feature and the sync paths. When a feature changes, update its panel.

## Known pre-existing quirks (not yet fixed, flagged here so they aren't mistaken for new bugs)

- Class 6 and 7 never score RIASEC's "Conventional" type - every question's options map only to R/I/A/S/E (verified: no `"Conventional"` string anywhere in `class6Scoring.ts`/`class7Scoring.ts`).
- Class 8's aptitude scoring tallies an internal "verbal" bucket that is never surfaced in the output (`class8Scoring.ts`).
- Class 9-10 runs two different letter-keyed taxonomies through overlapping A-H/A-O letters (8 career clusters vs. the 15-domain catalogue) - `FullReport.tsx` already has a code comment and a `riasecScores` fallback working around the resulting mislabeling risk; be aware of it before changing anything that reads `themes` for a 9-10 profile.

Per explicit instruction: Classes 6-8 are not to be changed as part of any Class 11-12 accuracy/scoring work - their current behavior is considered correct and intentional, not a bug to be brought "in line" with 11-12.
