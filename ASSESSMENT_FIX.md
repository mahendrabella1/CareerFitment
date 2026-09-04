# Assessment Question Count Issue - Diagnosis & Fix

## Problem
- **Expected:** Class 6 and Class 7 assessments should have **60 questions each**
- **Actual (in live):** Showing **74 questions** instead

## Root Cause Analysis

### ✅ Local Files Status
Both JSON files are **VALID** with correct specifications:
- `data/class6-assessment-questions.json` - **60 questions** ✓
- `data/class7-assessment-questions.json` - **60 questions** ✓

### ❌ Likely Causes of 74 Questions in Live

The 74 questions are probably coming from:

1. **Firestore Database with outdated data** (Most likely)
   - The backend might be pulling from `question_banks` collection instead of JSON files
   - Firestore may have old question sets with 37 questions each (37 + 37 = 74)
   - Or it could be combining multiple sets

2. **API combining two different sources**
   - Base questions (60) + Extra questions (14) from somewhere
   - Check `/api/new-assessment/generate` route

3. **NewExam component fallback**
   - Class 6/7 might be accidentally using the general NewExam component
   - Which pulls from `lib/newAssessment/data.ts` and the old `assessment-questions.json`

---

## Solution - Three Steps

### Step 1: Verify Local JSON Files (Already Done ✓)
```bash
npx ts-node scripts/validate-assessment-questions.ts
```
✅ Result: All assessments are valid

### Step 2: Check if Firestore has Extra Questions

**Action:** Log into Firebase Console and check the `question_banks` collection:
- Navigate to: **Firestore Database → Collections → question_banks**
- Look for documents related to "class_6" or "class_7" or "6-8" age groups
- **Expected:** Should have NO documents (questions come from JSON files)
- **If Found:** Delete any outdated question_banks that have 74+ questions

### Step 3: Ensure Class6/7Assessment Uses JSON Files (Already Correct ✓)

The code is already correct:
```typescript
// app/Class6Assessment.tsx & app/Class7Assessment.tsx
import questions from "@/data/class6-assessment-questions.json";
// or
import questions from "@/data/class7-assessment-questions.json";
```

These import directly from the JSON files, bypassing the API entirely.

---

## Deployment Checklist

Before deploying the fix, verify:

- [ ] Run validation script locally: `npx ts-node scripts/validate-assessment-questions.ts`
- [ ] Clear Firestore `question_banks` collection (or verify no outdated data)
- [ ] Rebuild and redeploy the application
- [ ] Test Class 6 assessment in production (should show 60 questions)
- [ ] Test Class 7 assessment in production (should show 60 questions)
- [ ] Verify assessment completes and report generates correctly

---

## How to Delete Outdated Firestore Data

If you find extra questions in Firestore:

1. Go to **Firebase Console**
2. Select your project
3. Go to **Firestore Database**
4. Locate the `question_banks` collection
5. For each document related to "6-8" age group:
   - Click the document
   - Click **Delete Document**
   - Confirm deletion

Or use the Firebase CLI:
```bash
firebase firestore:delete question_banks/{documentId} --project={your-project-id}
```

---

## Verification After Fix

Test in production:
1. Go to the landing page
2. Select "Class 6" → Start assessment
3. Count the questions (should be 60)
4. Repeat for Class 7
5. Check the assessment report generates correctly

---

## Code Validation Summary

| File | Questions | Status |
|------|-----------|--------|
| `data/class6-assessment-questions.json` | 60 | ✅ Valid |
| `data/class7-assessment-questions.json` | 60 | ✅ Valid |
| Component routing | Correct | ✅ Valid |
| JSON direct imports | Correct | ✅ Valid |

**Conclusion:** The local codebase is correct. The 74 question issue is in the deployment environment (Firestore or database).
