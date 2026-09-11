# Class 6 & 7 Assessment - Question Count Fix (60 Questions)

## Changes Made

### 1. ✅ Validation Script Added
- **File:** `scripts/validate-assessment-questions.ts`
- **Purpose:** Validates that both Class 6 and 7 assessments have exactly 60 questions
- **Status:** Both assessments are VALID ✓

### 2. ✅ Safety Guards Added
- **Files Updated:**
  - `app/Class6Assessment.tsx`
  - `app/Class7Assessment.tsx`

- **What Changed:**
  - Added check to ensure exactly 60 questions are loaded
  - Automatically truncates any extra questions (prevents 74-question issue)
  - Console warning if incorrect count is detected

- **Code Change:**
  ```typescript
  const allQuestions = useMemo(() => {
    const loadedQuestions = (questions as any).questions || [];

    // Safety check: Class 6/7 assessment should have exactly 60 questions
    if (loadedQuestions.length !== 60) {
      console.warn(`⚠️ Class 6/7 Assessment loaded ${loadedQuestions.length} questions, expected 60`);
    }

    // Only use the first 60 questions to prevent loading extra questions
    const validQuestions = loadedQuestions.slice(0, 60);

    return validQuestions.map((q: any, idx: number) => ({
      ...q,
      originalIndex: idx,
    }));
  }, []);
  ```

---

## Current Status

| Component | Questions | Status |
|-----------|-----------|--------|
| `data/class6-assessment-questions.json` | 60 | ✅ Correct |
| `data/class7-assessment-questions.json` | 60 | ✅ Correct |
| `Class6Assessment.tsx` | Protected | ✅ Added safety guard |
| `Class7Assessment.tsx` | Protected | ✅ Added safety guard |

---

## Deployment Steps

### Step 1: Validate Locally
```bash
# Run validation to confirm 60 questions
npx ts-node scripts/validate-assessment-questions.ts
```

**Expected Output:**
```
✅ Class 6 Assessment: VALID
   ✓ 60 questions found
   ✓ All dimensions present
   ✓ No duplicates
   ✓ All question IDs (1-60) present

✅ Class 7 Assessment: VALID
   ✓ 60 questions found
   ✓ All dimensions present
   ✓ No duplicates
   ✓ All question IDs (1-60) present
```

### Step 2: Check Production Data (Important!)

If you're still seeing **74 questions** in live:

1. **Check Firestore Database** (most likely source)
   - Go to: Firebase Console → Firestore Database → Collections
   - Look for `question_banks` collection
   - Delete any documents with extra questions for "6-8" age group

2. **Clear Browser Cache**
   - Users should hard-refresh (Ctrl+Shift+R) to clear old cached data

3. **Redeploy Application**
   - The safety guards will now cap at 60 questions automatically

### Step 3: Test in Production

After deployment, test both assessments:

```
✅ Test Class 6:
  1. Open assessment
  2. Count questions in console: should be 60
  3. Check browser console for any warnings

✅ Test Class 7:
  1. Open assessment  
  2. Count questions in console: should be 60
  3. Check browser console for any warnings
```

---

## Troubleshooting

### If You Still See 74 Questions:

1. **Check Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for warning: `⚠️ Class X Assessment loaded 74 questions, expected 60`

2. **Check Firestore:**
   ```bash
   # List question_banks collection
   firebase firestore:get question_banks --project={your-project-id}
   ```

3. **Clear Cache:**
   - Delete browser cache for the domain
   - Ask users to do Ctrl+Shift+R hard refresh

4. **Check JSON Files:**
   ```bash
   # Verify questions in JSON files
   node -e "const f=require('./data/class6-assessment-questions.json'); console.log('Class 6 questions:', f.questions.length);"
   node -e "const f=require('./data/class7-assessment-questions.json'); console.log('Class 7 questions:', f.questions.length);"
   ```

---

## What Each Dimension Contains (60 Questions Total)

### Class 6 Assessment Structure (Matches Blueprint)

```
1. Personality Preferences        (Qs 1-10)      - 10 questions
2. Career Interests (RIASEC)      (Qs 11-20)     - 10 questions  
3. Aptitude & Reasoning           (Qs 21-30)     - 10 questions
4. MI-Inspired Strengths          (Qs 31-38)     - 8 questions
5. Motivators & Values            (Qs 39-45)     - 7 questions
6. Learning Preferences           (Qs 46-50)     - 5 questions
7. Emotional & Social Awareness   (Qs 51-55)     - 5 questions
8. Creativity & Future Readiness  (Qs 56-60)     - 5 questions
                                           TOTAL: 60 questions
```

### Class 7 Assessment Structure (Matches Blueprint)

```
Same structure as Class 6 (see above)
                                           TOTAL: 60 questions
```

---

## Files Modified

```
✅ app/Class6Assessment.tsx       - Added safety guard
✅ app/Class7Assessment.tsx       - Added safety guard
✅ scripts/validate-assessment-questions.ts  - New validation script
✅ ASSESSMENT_FIX.md              - Diagnosis guide
✅ CLASS_6_7_ASSESSMENT_FIX.md    - This file
✅ data/class6-assessment-questions.json    - No changes needed
✅ data/class7-assessment-questions.json    - No changes needed
```

---

## Summary

**Problem:** Live environment showing 74 questions instead of 60  
**Root Cause:** Likely Firestore database or cached data  
**Solution:**
1. ✅ Local JSON files are correct (60 questions each)
2. ✅ Safety guards added to cap at 60 questions
3. ✅ Validation script to monitor question count
4. 👉 Check/clean Firestore data before redeployment

**Next Steps:**
- Deploy the code changes
- Clean up Firestore if needed  
- Test in production with both Class 6 and 7
- Monitor browser console for warnings
