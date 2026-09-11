# OneGrasp Assessment Engine - Complete Inventory Report
**Generated:** 2026-09-04

---

## PART 1: QUESTION BANK STATUS

### ✅ Currently Active Question Banks

#### Class 9-10 Assessment
- **Location:** `data/assessment-questions.json` + `data/aptitude-questions.json` + `data/strengths-questions.json`
- **Sets Count:** 1 set per category (Only "Set 1")
- **Categories:** 6 core psychometric
  - personality
  - career_interest
  - emotional_intelligence
  - learning_styles
  - motivators
  - multiple_intelligence
- **Aptitude:** Handled separately in `aptitude-questions.json`
- **Strengths:** Handled separately in `strengths-questions.json`
- **Total Questions:** 60 questions (60-question workbook per spec)

#### Class 11-12 Assessment (NEW)
- **Location:** `data/class-11-12/questions-corrected.json`
- **Sets Count:** 1 set per category (for live assessment)
- **Categories:** 11 (8 psychometric + 3 contextual)
  1. personality (7 questions)
  2. career_interest (12 questions)
  3. multiple_intelligence (inherited from 9-10)
  4. emotional_intelligence (4 questions)
  5. learning_styles (3 questions)
  6. motivators (6 questions)
  7. strengths (12 questions)
  8. aptitude (12 questions)
  9. creativity (5 questions) ⭐ NEW
  10. subject_fit (8 questions) ⭐ NEW
  11. career_fit (8 questions) ⭐ NEW
  12. career_selector (4 questions) ⭐ NEW
- **Total Questions:** 81 questions ✅

#### Demo Assessment (Class 11-12 Demo)
- **Location:** `data/demo-11-12/` directory
  - `questions.json` - Demo questions
  - `aptitude.json` - Demo aptitude questions
  - `careers.json` - Career library for demo
  - `streams.json` - Education streams for demo
- **Purpose:** Free demo test for class_11_12_demo stage
- **Usage:** `/demo-test` page

#### Other Stages Data
- **Location:** `data/assessment-questions.json`
- **Stages:** 6-8, grad (graduate), early (early professional), prof (experienced professional)
- **Sets Count:** 10 sets each (not used in live for classes)
- **Status:** Legacy data - can be removed if not needed for future stages

---

## PART 2: UNNECESSARY FILES TO REMOVE

### Question Bank Files to Remove

1. **`data/class-11-12/questions.json`** ❌ REMOVE
   - Old version with 74 questions
   - Has been replaced by `questions-corrected.json` with 81 questions
   - Status: Superseded

2. **`data/class-11-12/questions.old.json`** ❌ REMOVE
   - Legacy backup file
   - Not referenced anywhere in code
   - Status: Ancient legacy

3. **`data/personality-sets.json`** ❌ REMOVE
   - Appears unused in data.ts
   - Not imported in any active code path
   - Status: Orphaned

4. **`data/local-authored-questions.json`** ❌ REMOVE
   - Local test data
   - Not imported in production code
   - Status: Development artifact

5. **`data/local-leads.json`** ❌ REMOVE
   - Local test data for CRM
   - Not imported in active code
   - Status: Development artifact

6. **`data/local-sessions.json`** ❌ REMOVE
   - Local test data
   - Not imported in active code
   - Status: Development artifact

7. **`data/assessment-questions.json` - Partial** ⚠️ REVIEW
   - Keep only: 9-10 stage (1 set per category)
   - Remove: 6-8, grad, early, prof stages (unless needed for future rollout)
   - **Recommendation:** Keep for now, but mark as legacy stages

---

## PART 3: ACTIVE REPORT FILES (Production)

### Currently Live Reports

#### 1. **FullReport.tsx** ✅ PRIMARY
- **Location:** `app/account/FullReport.tsx`
- **Purpose:** Main assessment report for Class 9-10
- **Usage:** Displayed in `/account` dashboard when assessment is completed
- **Key Features:**
  - 8-category overview
  - Career matches and fitment
  - Personality profile (Big Five traits)
  - Aptitude breakdown
  - Learning styles
  - Multiple intelligences
  - Strengths analysis
  - Motivators profile
  - Emotional intelligence
  - **Fixed:** Retroactivity issue (MBTI only shows for Class 9-10 with actual data)

#### 2. **DemoReport.tsx** ✅ ACTIVE
- **Location:** `app/demo-test/DemoReport.tsx`
- **Purpose:** Report for Class 11-12 demo assessment
- **Usage:** Rendered after `/demo-test` completion
- **Key Features:**
  - Psychometric profile
  - Desired vs measured comparison
  - Career alignment roadmap
  - Stream selection comparison

#### 3. **ReportViewOnly.tsx** ✅ UTILITY
- **Location:** `app/ReportViewOnly.tsx`
- **Purpose:** Read-only report viewer for shared/public reports
- **Usage:** PDF view of completed assessments
- **Key Features:**
  - No editing capabilities
  - Print-optimized
  - Public sharing support

#### 4. **ReportsHub.tsx** ✅ NAV
- **Location:** `app/account/ReportsHub.tsx`
- **Purpose:** Navigation hub to all student reports
- **Usage:** `/account/reports` page
- **Key Features:**
  - List all assessments
  - Filter and sort
  - Quick actions (view, download, share)

---

## PART 4: LEGACY/EXPERIMENTAL REPORT FILES

### Class 11-12 Specific Reports (In Development)

#### 1. **Class11Report.tsx** ⚠️ EXPERIMENTAL
- **Location:** `app/account/Class11Report.tsx`
- **Status:** Experimental/planned implementation
- **Purpose:** Dedicated Class 11-12 report
- **Usage:** Not yet wired into main Dashboard flow
- **Note:** TODO in Dashboard.tsx mentions using "Class1112FullReportNew when available"

#### 2. **Class11ReportComprehensive.tsx** ⚠️ EXPERIMENTAL
- **Location:** `app/account/Class11ReportComprehensive.tsx`
- **Status:** Experimental
- **Purpose:** Extended 4-layer report for 11-12
- **Usage:** Not actively used
- **Note:** Duplicates functionality with Class11Report.tsx

#### 3. **Class11ReportCover.tsx** ⚠️ EXPERIMENTAL
- **Location:** `app/account/Class11ReportCover.tsx`
- **Status:** Experimental
- **Purpose:** Cover page for Class 11-12 report
- **Usage:** Not integrated into main flow
- **Note:** Related to comprehensive report work

#### 4. **Class1112FullReportNew.tsx** ⚠️ PLACEHOLDER
- **Location:** `app/report/Class1112FullReportNew.tsx`
- **Status:** Not implemented (exists as placeholder)
- **Purpose:** Intended for new 4-layer Class 11-12 report
- **Usage:** Referenced in TODO comments but not actually used
- **Note:** This is where the 4-layer report should be built

#### 5. **ReportCoverPage.tsx** ⚠️ COMPONENT
- **Location:** `app/components/ReportCoverPage.tsx`
- **Status:** Reusable component
- **Purpose:** Generic cover page component
- **Usage:** Used by some experimental reports

---

## PART 5: LIBRARY/UTILITY REPORT FILES

### Supporting Report Infrastructure

#### 1. **generateClass1112Report.ts** ⚠️ PLANNED
- **Location:** `lib/report/generateClass1112Report.ts`
- **Status:** Skeleton implementation
- **Purpose:** Should generate 4-layer Class 11-12 reports
- **Current State:** Needs full implementation to use scoring11_12.ts data

#### 2. **reportIntegration.ts** ⚠️ UTILITY
- **Location:** `lib/report/reportIntegration.ts`
- **Status:** Integration helper
- **Purpose:** Bridges assessment data to report components
- **Usage:** Limited use in current flow

#### 3. **reportPdf.tsx** ⚠️ UTILITY
- **Location:** `lib/report/reportPdf.tsx`
- **Status:** PDF generation helper
- **Purpose:** Convert reports to PDF for download/email
- **Usage:** Used for PDF generation

#### 4. **report-store.ts** ⚠️ STATE
- **Location:** `lib/report-store.ts`
- **Status:** Data store/cache
- **Purpose:** Cache report data client-side
- **Usage:** Used to store report state

#### 5. **reportSections.tsx** ⚠️ COMPONENT
- **Location:** `app/demo-test/reportSections.tsx`
- **Status:** Demo-specific components
- **Purpose:** Individual report section components for demo
- **Usage:** Used only by DemoReport.tsx

---

## PART 6: LEGACY/UNUSED REPORT FILES

### Report Files That Can Be Removed

#### 1. **CareerFitReport.tsx** ❌ REMOVE
- **Location:** `app/account/CareerFitReport.tsx`
- **Status:** Orphaned/unused
- **Purpose:** Was meant for career fit analysis
- **Current Usage:** Not referenced in any active code path
- **Recommendation:** Remove

#### 2. **CareerRoadmapReport.tsx** ❌ REMOVE
- **Location:** `app/account/CareerRoadmapReport.tsx`
- **Status:** Orphaned/unused
- **Purpose:** Was meant for career roadmap visualization
- **Current Usage:** Not referenced in any active code path
- **Recommendation:** Remove

#### 3. **ReportView.tsx** ❌ REMOVE
- **Location:** `app/report/ReportView.tsx`
- **Status:** Orphaned/unused
- **Purpose:** Alternative report viewer (superseded by FullReport)
- **Current Usage:** Not referenced in routing
- **Recommendation:** Remove

---

## PART 7: RECOMMENDATION SUMMARY

### IMMEDIATE ACTIONS

#### ✅ Question Files - Remove (Safe)
```
data/class-11-12/questions.json         (Old 74-question version)
data/class-11-12/questions.old.json     (Backup)
data/personality-sets.json              (Unused)
data/local-authored-questions.json      (Dev artifact)
data/local-leads.json                   (Dev artifact)
data/local-sessions.json                (Dev artifact)
```

#### ✅ Report Files - Remove (Safe)
```
app/account/CareerFitReport.tsx         (Unused)
app/account/CareerRoadmapReport.tsx     (Unused)
app/report/ReportView.tsx               (Unused)
```

#### ⚠️ Reports - Consolidate/Finalize (Requires Decision)
```
app/account/Class11Report.tsx           (Experimental - needs finalization)
app/account/Class11ReportComprehensive.tsx (Experimental - duplicates)
app/account/Class11ReportCover.tsx      (Experimental - incomplete)
app/report/Class1112FullReportNew.tsx   (Placeholder - needs implementation)
lib/report/generateClass1112Report.ts   (Needs implementation)
```

### CURRENT PRODUCTION STACK
```
✅ Active for 9-10:
   - FullReport.tsx
   - ReportViewOnly.tsx
   - ReportsHub.tsx

✅ Active for 11-12 Demo:
   - DemoReport.tsx
   - reportSections.tsx

⚠️ Pending for 11-12 Live:
   - Need to implement 4-layer report using scoring11_12.ts data
```

---

## PART 8: NEXT STEPS

### Priority 1: Cleanup
1. Remove 6 unused data files (local & legacy)
2. Remove 3 unused report files (CareerFitReport, CareerRoadmapReport, ReportView)

### Priority 2: Implementation
1. Decide on Class 11-12 report structure:
   - Option A: Use Class11ReportComprehensive as final version
   - Option B: Build Class1112FullReportNew from scratch
   - Option C: Extend FullReport to handle both 9-10 and 11-12
2. Implement generateClass1112Report.ts to use all 81-question data
3. Wire selected Class 11-12 report into Dashboard.tsx (replace TODO)

### Priority 3: Consolidation
1. Keep only ONE Class 11-12 report implementation
2. Remove duplicate/unused Class11Report*.tsx files
3. Update generateClass1112Report.ts to fully integrate scoring11_12.ts

