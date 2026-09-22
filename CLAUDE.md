# CareerFitment - Class-Group Scope Map

This project runs three **independent** assessment/report engines, one per class group. They share almost no code, but a few files ARE genuinely shared - those are the highest-risk files to touch, because a change made "for" one group silently reaches all of them.

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

## Shared across ALL groups - highest risk, edit with care

| File | Used by | Why it's risky |
|---|---|---|
| `lib/newAssessment/data.ts` | All | Holds every `CATEGORY_ORDER`/`ORDER_*` constant, `CATEGORY_META`, and the generic question-bank loader - a change meant for one stage's order/labels can silently reorder or relabel another stage's assessment. |
| `data/assessment-questions.json` | 9-10, grad, early, prof (NOT 6-8, NOT 11-12, which have their own dedicated files) | One bank shared by 4 stages under different top-level stage keys (`"9-10"`, `"grad"`, `"early"`, `"prof"`) - editing the wrong stage key, or a bank's shared tag vocabulary, can affect stages you didn't intend to touch. |
| `lib/report/knowledge.ts` | All (via `domainFit()`) | The 15-domain (A-O) catalogue used by every class's "best-fit domain" cards, plus `categoryDeepDive()` text shared across dimensions common to multiple groups. Class 9-10 also feeds its 8-cluster letters (A-H) through this same A-O-keyed logic - see the flagged mislabeling note in `app/account/FullReport.tsx` around `themes`/`riasecScores`. |
| `app/account/FullReport.tsx`, `Dashboard.tsx`, `DashboardMobile.tsx` | All | Common report/dashboard shells that branch per class - a shared helper changed for one class's display can affect the others' rendering. |
| `app/api/new-assessment/score/route.ts` | All | Single API route that dispatches to whichever class's scorer based on the submitted stage - a shared parsing helper touched for one stage can break another's answer parsing. |

## Known pre-existing quirks (not yet fixed, flagged here so they aren't mistaken for new bugs)

- Class 6 and 7 never score RIASEC's "Conventional" type - every question's options map only to R/I/A/S/E (verified: no `"Conventional"` string anywhere in `class6Scoring.ts`/`class7Scoring.ts`).
- Class 8's aptitude scoring tallies an internal "verbal" bucket that is never surfaced in the output (`class8Scoring.ts`).
- Class 9-10 runs two different letter-keyed taxonomies through overlapping A-H/A-O letters (8 career clusters vs. the 15-domain catalogue) - `FullReport.tsx` already has a code comment and a `riasecScores` fallback working around the resulting mislabeling risk; be aware of it before changing anything that reads `themes` for a 9-10 profile.

Per explicit instruction: Classes 6-8 are not to be changed as part of any Class 11-12 accuracy/scoring work - their current behavior is considered correct and intentional, not a bug to be brought "in line" with 11-12.
