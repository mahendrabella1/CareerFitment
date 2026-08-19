# Class 11-12 demo assessment (`/demo-test`)

A separate, free assessment for classes 11 and 12, built from the client's 2026
workbooks. It shares the exam engine and the scorer with the paid paper but
nothing else: its own question bank, its own stream-to-career mapping, its own
report, and no payment gate.

**The paid flow at `/` is untouched.** Nothing maps a paying category to the
demo stage — see the isolation check at the bottom of this page.

---

## The student's journey

1. **Class** — 11 or 12.
2. **Stream** — one of 35 subject combinations across four families
   (Science, Commerce, Humanities/Arts, Vocational).
3. **Desired career** — filtered by that stream. All three eligibility states
   are shown; the closed ones are visible but disabled, so a student can see
   what their subject choice ruled out rather than just being offered a shorter
   list.

Steps 2 and 3 are native `<select>` dropdowns grouped with `<optgroup>` — by
stream family, and by career domain. The career list is rebuilt from the API
every time the stream changes, so it only ever contains what that exact
combination reaches:

| Career | MPC | BiPC | CEC | HEC |
|---|---|---|---|---|
| Doctor (MBBS) | closed | **open** | closed | closed |
| Mechanical Engineer | **open** | conditional | closed | closed |
| Nurse | conditional | **open** | closed | closed |
| Chartered Accountant | **open** | **open** | **open** | **open** |
| Software Engineer | **open** | **open** | **open** | conditional |
4. **Details** — name, email, phone, password. Creates a Firebase account.
   No payment.
5. **Exam** — 60 questions across 8 dimensions, no time pressure.
6. **Report** — the wanted-vs-found comparison, then the roadmap(s).

---

## Data, and where it comes from

Everything is generated from the two workbooks in the repository root. Re-run
the builders when the client sends a new sheet; nothing is hand-edited.

**Build memory.** `npm run build` runs Next with a 4GB heap
(`node --max-old-space-size=4096`). The app statically imports ~4.3MB of
question-bank JSON, and the default Node heap dies during static generation
with a Windows access violation / OOM. The flag lives in the `build` script in
`package.json` so local and Vercel builds behave identically. The earlier fix
for this - removing 1.43MB of denormalised duplication from the demo data -
is described under defect 5; this is what remains after that.

```
python scripts/build_demo_11_12.py      # question bank      -> data/demo-11-12/questions.json
python scripts/build_demo_aptitude.py   # aptitude bank      -> data/demo-11-12/aptitude.json
python scripts/build_demo_streams.py    # streams + degrees  -> data/demo-11-12/streams.json
python scripts/build_demo_careers.py    # careers + roadmaps -> data/demo-11-12/careers.json
python scripts/verify_demo_aptitude.py  # re-derives every aptitude answer
python scripts/verify_demo_overlay.py   # re-derives every authored interest mapping
python scripts/export_demo_figures.py   # salary/exam/college sheet for expert review
node scripts/verify_demo_eligibility.mjs  # re-derives every stream/career verdict
python scripts/verify_demo_figures.py   # audits salary bands for consistency
```

### The paper: 60 questions

| Section | Per paper | Bank | Sets | Source |
|---|---|---|---|---|
| Career interests | 12 | 48 | 4 | workbook (24) + authored (24, see gap 3) |
| Personality | 10 | 30 | 3 | workbook |
| Strengths | 7 | 30 | 5 | workbook |
| Motivators | 5 | 30 | 6 | workbook |
| Multiple intelligences | 5 | 30 | 6 | workbook |
| Learning styles | 3 | 30 | 10 | workbook |
| Emotional intelligence | 3 | 25 | 9 | workbook |
| **Aptitude** | **15** | **45** | **3** | **authored — see gap 2** |

A student draws one set per section at random, so two students rarely sit the
same paper while every paper still covers every dimension in the same
proportions.

### Things the workbook did not supply

Three gaps were found while converting it. All three are now closed, and each
is handled in a file kept separate from the transcription so a reviewer can
always tell the client's data from ours.

1. **Interests Q13-Q24 have no scoring columns.** The workbook maps only
   Q1-Q12. Interests carry 40% of the career-match weight, so leaving twelve
   questions unscored was not an option. They are mapped in
   `scripts/demo_11_12_overlay.py`.

   `scripts/verify_demo_overlay.py` re-derives every mapping from the option
   wording by an independent keyword method and fails the build on any mapping
   the text gives no support for, any RIASEC letter incoherent with its
   cluster, and any question whose five options do not span five distinct
   clusters. It also writes `docs/demo-11-12-authored-interests.md`, a table
   the client can sign off without reading Python.

   It caught one real error on its first run: Q24 option C ("We made someone's
   life better") was mapped to Health Science when it carries no health signal
   at all — corrected to Human & Public Services, matching how the identical
   option in Q20 was already mapped. Eight ambiguous ties remain and are
   printed on every run for a human to adjudicate.

2. **No aptitude tab at all.** All 45 aptitude questions are authored, covering
   Verbal, Numerical, Logical, Abstract, Spatial and Data Interpretation, and
   weighted towards multi-step items. `verify_demo_aptitude.py` re-derives
   every numerical and data answer arithmetically rather than trusting the
   stored index; its first run caught seven real defects.

3. **The interest bank was measurably biased.** Every one of the client's 24
   interest questions carries exactly one Arts (D), one Business (E) and one
   Science (G) option. Sport/Hospitality (H) appeared in none of them.

   That is not a rounding error. Simulating a student who picks the same
   cluster *every time it is offered* — the strongest signal they can send —
   gives that cluster's ceiling:

   | | before | after |
   |---|---|---|
   | D / E / G | 71 | 67 |
   | A B C F | 57–67 | 67–71 |
   | **H** | **50** | **67** |
   | **spread** | **18.7 pts** | **4.0 pts** |

   A student maximally drawn to hospitality could not outscore one mildly drawn
   to business, and Chef, Hotel Manager, Event Manager, Travel Consultant,
   Sports Coach and Sports Scientist were unreachable however anyone answered.

   `scripts/demo_11_12_extra_interests.py` supplies 24 authored questions, each
   offering exactly the five starved clusters (A, B, C, F, H) and deliberately
   offering *none* of D, E or G — adding more of those would widen the gap.
   `build_demo_11_12.py` then builds every paper from **6 client + 6 authored**
   questions, which is what actually flattens it: interleaving alone still
   weighted papers towards whichever pool dominated.

   Result: every cluster gets 6–12 offers per paper instead of 3–12.
   The authored half is clearly marked; if the client supplies their own
   H-bearing questions, remove ours in equal measure.

   Fixing this also exposed a set-construction bug: sets were dealt with
   `n // per_set`, silently discarding every question past the last whole set.

### Streams and careers

`11-12th Streams list.xlsx` maps ~118 degrees to eligibility per stream with
traffic-light markers. Three cases are distinguished, and conflating them is
how MBBS ends up looking open to a commerce student:

| Case | Reading |
|---|---|
| No eligibility matrix at all (media, hospitality) | genuinely open to every stream |
| Matrix has a column for this stream | whatever the workbook says |
| Matrix has columns but none for this stream *family* | closed, flagged `unlisted` — the domain tab enumerated the streams it accepts and this was not among them |

**The workbook omits the AP/TS intermediate streams.** Its science entries use
Andhra/Telangana naming (MPC, BiPC, MBiPC) but commerce and humanities switch to
CBSE-style descriptions, so CEC, HEC and MEC are missing entirely — between them
most non-science intermediate students in those states. They are added by
`scripts/demo_11_12_extra_streams.py`, each mapped to an existing eligibility
group so no degree matrix changes:

| Stream | Family | Behaves as | Open careers |
|---|---|---|---|
| CEC (Commerce, Economics, Civics) | Commerce | commerce, no maths | 118 |
| MEC (Mathematics, Economics, Commerce) | Commerce | commerce, with maths | 124 |
| HEC (History, Economics, Civics) | Humanities / Arts | humanities, no maths | 107 |

MEC matters most: without it those students would have picked "Commerce without
Mathematics" and silently lost every maths-gated degree — actuarial science,
statistics, economics honours. Delete the file if the client adds these to their
own sheet.

177 careers link to those degrees. A career is offered to a student when at
least one of its degrees is open to them, carrying the best verdict among them.
Each career's roadmap is its **family** roadmap (JEE is JEE for every
engineering career) overlaid with whatever that career states for itself, so
every career has a complete roadmap and none is a stub.

The catalogue was extended from 121 to 177 in
`scripts/demo_11_12_careers_extra.py`, concentrated on the domains that were
thinnest against student demand — Software & Data went from 6 careers to 15,
Law 4 to 8, Public Service 4 to 9, Hospitality 5 to 12. Those are also the
domains a CEC or HEC student is most likely to end up in, which is why the
expansion and the new streams were done together.

| Cluster | Careers | | Cluster | Careers |
|---|---|---|---|---|
| A Core Engineering | 17 | | E Business & Marketing | 32 |
| B Information Technology | 15 | | F Human & Public Services | 29 |
| C Health Science | 18 | | G Science, Nature & Agriculture | 26 |
| D Arts, Media & Design | 27 | | H Sports, Hospitality & Lifestyle | 13 |

---

## The report

**It is the same report a class 9-10 student gets** - the full dashboard, the
eight dimensions, best-fit fields, how you think, the plan, the career toolkit,
and the in-depth `FullReport` one click away. The demo does not render a
cut-down version of its own: it renders `app/account/Dashboard.tsx` with the
student's summary, so it cannot silently fall behind when the real report
improves.

Two sections are added on top, through Dashboard's `extraSections` prop.

**Shown everywhere a report is.** Dashboard and Full report are two different
views, and the demo's sections belong in both — plus every other surface a
report reaches:

| Surface | Carries the 11-12 sections |
|---|---|
| `/demo-test` right after the paper | yes |
| `/account` dashboard | yes |
| `/account` → **Full report** | yes, as its own report sheets |
| `/admin` (before emailing) | yes — reviewers must see what they send |
| **Emailed PDF** | yes — the copy the student keeps |

**Shown in all three places.** The report appears immediately after the paper
at `/demo-test`, any time afterwards at `/account`, and inside the in-depth
**Full report** reached from the sidebar. All three render the same
`demoExtraSections()` from `app/demo-test/reportSections.tsx`, so they cannot
diverge.

In the full report each section becomes its own report *sheet* (via
`inFullReport` and a `reportNode` variant that drops the dashboard card
chrome), so it reads as part of the document rather than a widget that wandered
in. A student who opened the full report previously got the standard class 9-10
report with no sign of the career they chose - the very thing the demo exists
to tell them. The comparison and the resolved roadmaps are saved onto the profile as
`demoReport` when the paper is scored - previously they lived only in memory,
so a student who clicked through to their dashboard, or came back the next day,
found the standard report with no sign of the career they chose or the one they
were matched to.

The saved payload carries the **resolved roadmaps**, not career ids (~8KB
against a 1MB Firestore limit). A report opened a year later should not depend
on the catalogue still holding what it held the day the student sat the paper.

A class 9-10 student is unaffected: `/account` passes an empty list unless a
`demoReport` exists.

### 1. Wanted vs found  (rendered first, above the dimensions)

The career the student named *before* the paper, set against what the paper
measured. It sits first because it is the question they actually came with; the
charts below are the evidence for the answer, not a substitute for it.

| Verdict | Condition |
|---|---|
| `strong` | desired cluster is top-3 **and** either the top match names the career, or the cluster is rank 1 |
| `partial` | same cluster, or named in the top three matches, or the cluster is top-3 |
| `divergent` | none of the above |

The top-3 cluster floor on `strong` matters: without it, a student who scored
**0% on their desired cluster and ranked it 7th of 8** was told their
assessment agreed with them, because the career happened to appear low in the
match list on the strength of other dimensions.

When they disagree, the report says so plainly, quantifies the gap, and then
**hands the decision back**. It never instructs the student to switch - a
60-question paper cannot support overruling what someone came in wanting, and
the copy says as much.

### 2. Roadmaps

The desired career's roadmap always. When the verdict is not `strong`, the
measured career's roadmap as well, in a tab beside it. Each carries entrance
exams and when to sit them, the stage-by-stage path, what to start this year,
skills, representative colleges, salary bands, and a `realityCheck` - the
honest downside, because a roadmap that only sells is not guidance.

---|---|
| `strong` | desired cluster is top-3 **and** either the top match names the career, or the cluster is rank 1 |
| `partial` | same cluster, or named in the top three matches, or the cluster is top-3 |
| `divergent` | none of the above |

The top-3 cluster floor on `strong` matters: without it, a student who scored
**0% on their desired cluster and ranked it 7th of 8** was told their
assessment agreed with them, because the career happened to appear low in the
match list on the strength of other dimensions.

When they disagree, the report says so plainly, quantifies the gap, and then
**hands the decision back**. It never instructs the student to switch — a
60-question paper cannot support overruling what someone came in wanting, and
the copy says as much.

### 2. Roadmaps

The desired career's roadmap always. When the verdict is not `strong`, the
measured career's roadmap as well, in a tab beside it. Each roadmap carries
entrance exams and when to sit them, the stage-by-stage path, what to start
this year, skills, representative colleges, salary bands, and a
`realityCheck` — the honest downside, because a roadmap that only sells is not
guidance.

---

## Defects found by review after the first pass

Five, all in code written here, all now fixed and regression-tested:

1. **A paid exam resumed inside the demo.** The saved exam session lives on the
   user profile, and `NewExam` resumed any in-progress session without checking
   which paper it belonged to. A student who left a class 9-10 paper unfinished
   and then opened `/demo-test` was resumed straight back into the 9-10 paper —
   and the demo then scored those answers against the demo bank, where "Set 1"
   also exists but holds different questions. Silently wrong scores, no error.
   The generate route now refuses a saved session whose stage does not match the
   requested category.

2. **The demo overwrote a paid report.** `saveAssessment` writes
   `latestAssessment`, the field `/account` renders, so a paying student who
   opened the demo link had their real report replaced by a free one. Demo
   results now land in `demoAssessment`, and only fill `latestAssessment` when
   nothing is there yet — so someone who registered *through* the demo still
   finds a report on their dashboard.

3. **The report route trusted `chosenSets` from the browser.** Both banks name
   their sets "Set 1", so a body carrying another paper's set names resolved to
   real demo questions of a different length and produced a plausible-looking
   report built on nothing. Sets and answer keys are now validated against the
   demo bank.

4. **114 career names had no cluster.** Example careers inside interest options
   are a scoring input — `scoring60` turns them into interest votes — and most
   natural job titles are absent from the engine's `professionCluster` table.
   A name it does not know can win a student's top match while belonging to no
   cluster, which is where a report printing "Designer (Human & Public
   Services)" came from. This affected the client's own transcribed names too
   ("Healthcare Professional", "Smart-City Engineer"). All are now mapped onto
   the engine's vocabulary by `scripts/demo_11_12_professions.py`, and
   `verify_demo_overlay.py` fails the build if any unknown name reappears.
   Verified: 180 matches inspected, 0 without a real cluster.

5. **The build ran out of memory.** `careers.json` and `streams.json` carried
   1.43MB of denormalised duplication — per-combination career and degree rows
   repeating names already present elsewhere — and the Next build worker started
   dying with a Windows access violation on the default heap. That duplication
   was also a second copy of the same truth. Eligibility is now resolved at
   request time by `lib/demo11/eligibility.ts`; the two data files went from
   1.77MB to 435KB and the build passes on the default heap again.

   `node scripts/verify_demo_eligibility.mjs` re-derives all 3,872
   combination-career rows and checks the rules; run against a snapshot of the
   old precomputed table it reported **0 differences**, so the refactor changed
   no behaviour.

---

## Isolation from the paid flow

The demo bank lives under its own stage key, `11-12-demo`, reachable only
through the category `class_11_12_demo`, which only `/demo-test` ever sets.
`/api/demo-test/report` pins the stage server-side, so a crafted request body
cannot make the demo score against the paid bank, and it rejects question sets
or answers that do not belong to the demo paper. A saved exam session from
another paper is refused rather than resumed (see defect 1), and demo results
are stored apart from paid ones (defect 2).

Verified at runtime — every paid and unknown category resolves elsewhere:

```
class_6_8 -> 6-8      class_9_10 -> 9-10     class_11_12 -> 11-12
graduate  -> grad     (empty)    -> grad     nonsense    -> grad
class_11_12_demo -> 11-12-demo   (60 questions)
```

Answer keys (`correct`, `why`, `clusterWeights`, `traitPoints`, `scores`) are
stripped by the generate route and never reach the browser.

---

## Known limitations

- **Salary, fee and cut-off figures are authored, not sourced.** They are
  accurate to general knowledge of Indian admissions but are not pulled from a
  live feed of exam dates, fee schedules or salary surveys.

  The report says so **beside each block** — under the salary bands, the college
  list and the exam timings — because a student reads "Rs 6-25 LPA" as fact
  unless told otherwise. Provenance (`asOf`, `basis`, `confidence`) travels with
  the data from `FIGURES` in `scripts/demo_11_12_families.py` to the page.

  `scripts/verify_demo_figures.py` audits what is checkable without a source:
  bands that run backwards, progressions that go down, ranges too wide to mean
  anything, copy-pasted stages, malformed text. It found one real defect —
  Quantitative Analyst's mid band read `Rs 45-1.2 Cr`, which parses as *45 crore
  to 1.2 crore* because the unit attaches to the pair.

  It cannot tell you whether the numbers are RIGHT. That needs a domain expert
  working from `docs/demo-11-12-figures-for-review.md` (121 salary bands, 65
  exam entries, 29 college lists). After corrections, bump `FIGURES["asOf"]` and
  re-run `build_demo_careers.py`.

- **Vocational streams are thinly covered by the client's sheet.** Several
  domain tabs have no Vocational column, so those degrees read as closed with
  `unlisted: true`. Law is the clearest example — worth confirming with the
  client.

- **Ambiguous interest mappings have been adjudicated**, not left open. Seven
  options genuinely straddle two clusters; each decision and its reasoning is
  recorded in `ADJUDICATED` in `scripts/verify_demo_overlay.py`. Any *new*
  disagreement still fails to that list rather than passing silently.
