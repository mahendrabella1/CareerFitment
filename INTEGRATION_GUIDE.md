# Class 11-12 Assessment Integration Guide

## Quick Start

### Files Created
1. ✅ `data/class-11-12/questions.json` - 81 questions, 11 sections
2. ✅ `lib/newAssessment/scoring11_12.ts` - Scoring engine with 4-layer output
3. ✅ `app/account/Class11Report.tsx` - Report UI components
4. 📄 `CLASS_11_IMPLEMENTATION.md` - Full documentation

---

## Step 1: Update Assessment Data Registry

**File:** `lib/newAssessment/data.ts`

Add Class 11-12 to the stage mapping:

```typescript
// At the top, add new import
import class1112Bank from "@/data/class-11-12/questions.json";

// Update BANK object to include class 11-12 questions
const BANK: Bank = mergeDemo({
  ...(bank as unknown as Bank),
  aptitude: aptitudeBank as unknown as Bank[string],
  strengths: strengthsBank as unknown as Bank[string],
  // ADD THIS:
  ...(Object.entries(class1112Bank).reduce((acc, [cat, stages]) => {
    acc[cat] = { ...acc[cat], ...stages };
    return acc;
  }, {} as Bank))
});

// Update stageForCategory() function - add these cases:
case "class_11_12":
case "class_11":
case "class_twelve": return "11-12";

// Add category order for class 11-12
const ORDER_11_12: Category[] = [
  "personality",
  "career_interest",
  "strength_domains",
  "motivators",
  "learning_styles",
  "emotional_intelligence",
  "creativity",
  "aptitude",
  "subject_fit",
  "career_fit",
  "career_selector"
];

// Update categoryOrder() function
export function categoryOrder(stage: StageKey): Category[] {
  if (stage === "9-10") return ORDER_9_10;
  if (stage === DEMO_STAGE) return ORDER_11_12_DEMO;
  if (stage === "11-12") return ORDER_11_12;  // ADD THIS
  return CATEGORY_ORDER;
}
```

---

## Step 2: Update Assessment Response Handling

**File:** `lib/auth/AuthProvider.tsx`

Update the AssessmentSummary interface to include class 11-12:

```typescript
export interface AssessmentSummary {
  id: string;
  studentId: string;
  stage: "6-8" | "9-10" | "11-12" | "grad" | "early" | "prof"; // Update this
  completedAt: Date;
  
  // Responses in raw format
  responses: Record<string, Record<string, any>>;
  
  // Scoring output - can be either format
  scoring?: ScoreOutput | Class11ScoreOutput;
  
  // ... rest of interface
}
```

---

## Step 3: Create Exam Submission Handler

**File:** `app/api/assessment/submit/route.ts` (or similar)

```typescript
import { scoreClass11Assessment, type Class11Response } from "@/lib/newAssessment/scoring11_12";
import { scoreAssessment } from "@/lib/newAssessment/scoring";

export async function POST(req: Request) {
  const { studentId, stage, responses } = await req.json();

  let scoringOutput;

  if (stage === "11-12") {
    // Convert responses to Class11Response format
    const class11Responses: Class11Response = {
      personality: responses.personality || {},
      career_interest: responses.career_interest || {},
      aptitude: responses.aptitude || {},
      strength_domains: responses.strength_domains || {},
      motivators: responses.motivators || {},
      learning_styles: responses.learning_styles || {},
      emotional_intelligence: responses.emotional_intelligence || {},
      creativity: responses.creativity || {},
      subject_fit: {
        currentStream: responses.subject_fit?.currentStream || "",
        currentSubjects: responses.subject_fit?.currentSubjects || [],
        confidence: responses.subject_fit?.confidence || {}
      },
      career_fit: {
        clarity: responses.career_fit?.clarity || 5,
        consideringAreas: responses.career_fit?.consideringAreas || []
      },
      career_selector: {
        primaryCareer: responses.career_selector?.primaryCareer || "",
        alternativeChoices: responses.career_selector?.alternativeChoices || []
      }
    };

    // Score using Class 11-12 engine
    scoringOutput = scoreClass11Assessment(class11Responses);
  } else {
    // Use existing scoring for other stages
    scoringOutput = scoreAssessment(responses, stage);
  }

  // Save to database
  const assessment = await prisma.assessment.create({
    data: {
      studentId,
      stage,
      responses,
      scoring: scoringOutput,
      completedAt: new Date()
    }
  });

  return Response.json({ success: true, assessmentId: assessment.id });
}
```

---

## Step 4: Update Exam Page

**File:** `app/(app)/exam/page.tsx` or wherever exams are rendered

```typescript
import { Layer1PsychometricProfile, Layer2AcademicReality, Layer3EducationPathway, Layer4StudentAspiration, Class11ReportStyles } from "@/app/account/Class11Report";

export default function ExamPage() {
  const [responses, setResponses] = useState<Class11Response | null>(null);
  const [scoringOutput, setScoringOutput] = useState<Class11ScoreOutput | null>(null);
  
  const handleSubmit = async () => {
    // Submit and get scoring output
    const output = await submitAssessment(responses);
    setScoringOutput(output);
  };

  if (scoringOutput) {
    return (
      <div>
        <style>{Class11ReportStyles}</style>
        
        <Layer1PsychometricProfile data={scoringOutput.layer1} />
        <Layer2AcademicReality data={scoringOutput.layer2} />
        <Layer3EducationPathway data={scoringOutput.layer3} />
        <Layer4StudentAspiration data={scoringOutput.layer4} />
      </div>
    );
  }

  // Render exam form here
  return <ExamForm onSubmit={handleSubmit} />;
}
```

---

## Step 5: Update Full Report with Cover Page

**File:** `app/account/FullReport.tsx`

Add the cover page and 4 layers as sheets:

```typescript
import { Layer1PsychometricProfile, Layer2AcademicReality, Layer3EducationPathway, Layer4StudentAspiration, Class11ReportStyles } from "@/app/account/Class11Report";
import { Class11ReportCover, Class11ReportCoverStyles } from "@/app/account/Class11ReportCover";
import { type Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";

export default function FullReport({ a, name, extraSheets = [] }: ...) {
  // Check if this is a class 11-12 assessment
  const isClass1112 = a.stage === "11-12";
  
  if (isClass1112 && a.scoring) {
    const class11Output = a.scoring as Class11ScoreOutput;
    
    // Create cover sheet
    const coverSheet: ReportSheet = {
      id: "cover",
      kicker: "Report Cover",
      node: (
        <>
          <style>{Class11ReportCoverStyles}</style>
          <Class11ReportCover
            studentName={name || "Student"}
            studentEmail={a.email || ""}
            studentClass={a.class === "11" ? "11" : "12"}
            school={a.school}
            stream={a.stream}
            completedDate={a.completedAt}
            reportGeneratedDate={new Date()}
          />
        </>
      )
    };
    
    const class11Sheets: ReportSheet[] = [
      coverSheet,
      {
        id: "layer1",
        kicker: "Layer 1 — Psychometric Profile",
        node: (
          <>
            <style>{Class11ReportStyles}</style>
            <Layer1PsychometricProfile data={class11Output.layer1} />
          </>
        )
      },
      {
        id: "layer2",
        kicker: "Layer 2 — Academic Reality",
        node: <Layer2AcademicReality data={class11Output.layer2} />
      },
      {
        id: "layer3",
        kicker: "Layer 3 — Education Pathway",
        node: <Layer3EducationPathway data={class11Output.layer3} />
      },
      {
        id: "layer4",
        kicker: "Layer 4 — Student Aspiration",
        node: <Layer4StudentAspiration data={class11Output.layer4} />
      }
    ];
    
    // Merge with any existing sheets
    extraSheets = [...extraSheets, ...class11Sheets];
  }

  return <FullReportComponent a={a} name={name} extraSheets={extraSheets} />;
}
```

---

## Step 6: Test the Integration

### Unit Test for Scoring

Create `lib/newAssessment/__tests__/scoring11_12.test.ts`:

```typescript
import { scoreClass11Assessment, type Class11Response } from "../scoring11_12";

describe("Class 11-12 Scoring", () => {
  it("should score a complete assessment", () => {
    const response: Class11Response = {
      personality: {
        Q1: "A", Q2: "B", Q3: "A", Q4: "B", Q5: "A", Q6: "B"
      },
      career_interest: {
        Q8: 0, Q9: 1, Q10: 2, Q11: 3, Q12: 4
      },
      // ... other sections
      career_selector: {
        primaryCareer: "Software Engineer",
        alternativeChoices: ["AI Engineer", "Data Scientist"]
      }
    };

    const output = scoreClass11Assessment(response);

    // Verify layer 1
    expect(output.layer1).toBeDefined();
    expect(output.layer1.riasec).toHaveLength(6);
    expect(output.layer1.aptitude).toBeDefined();

    // Verify layer 2
    expect(output.layer2.currentStream).toBeTruthy();
    expect(output.layer2.streamSuitability).toMatch(/Well-matched|Partially-matched|Misaligned/);

    // Verify layer 3
    expect(output.layer3.recommendedDegrees.length).toBeGreaterThan(0);

    // Verify layer 4
    expect(output.layer4.primaryCareerGoal).toBe("Software Engineer");
    expect(output.layer4.alignment.overallFitment).toBeGreaterThan(0);
  });
});
```

### E2E Test

1. Go to exam page
2. Select Class 11-12
3. Fill all 81 questions
4. Submit
5. Verify all 4 layers render correctly
6. Verify navigation between layers works
7. Test print/PDF export (if available)

---

## Step 7: Database Schema (if needed)

If using Prisma, update schema.prisma:

```prisma
model Assessment {
  id        String   @id @default(cuid())
  studentId String
  student   User     @relation(fields: [studentId], references: [id])
  
  // Exam metadata
  stage     String   // "6-8", "9-10", "11-12", etc.
  
  // Raw responses
  responses Json
  
  // Scoring output (varies by stage)
  scoring   Json
  
  completedAt DateTime @default(now())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([studentId])
  @@index([stage])
}
```

---

## Configuration Checklist

### Environment
- [ ] Node.js 16+ installed
- [ ] TypeScript configured
- [ ] React 18+ available

### Code
- [ ] `questions.json` copied to correct path
- [ ] `scoring11_12.ts` imported in assessment handler
- [ ] `Class11Report.tsx` styles included
- [ ] `data.ts` updated with stage mapping
- [ ] Exam submission handler created/updated
- [ ] Report page updated to use new layers

### Testing
- [ ] Unit tests pass for scoring
- [ ] E2E test completes exam flow
- [ ] Report renders all 4 layers
- [ ] Print/PDF works (if implemented)

### Deployment
- [ ] All files committed to git
- [ ] Build passes without errors
- [ ] Tests pass in CI/CD
- [ ] Staging environment tested
- [ ] Production deployment scheduled

---

## Troubleshooting

### Issue: "Cannot find module 'class-11-12/questions.json'"
**Solution:** Ensure the file is at `data/class-11-12/questions.json` (not `class11` or `class_11_12`)

### Issue: "Class11Response type missing properties"
**Solution:** Check that all response sections are properly typed in scoring11_12.ts

### Issue: "Report layers not rendering"
**Solution:** 
1. Check that `Class11ReportStyles` is imported and rendered in a `<style>` tag
2. Verify scoring output is passed correctly to each layer component
3. Check browser console for React errors

### Issue: "RIASEC scores all zeros"
**Solution:** Career_interest responses need to map correctly. Update the scoring logic to process your question responses properly.

---

## Performance Optimization

For large-scale deployments:

```typescript
// Cache RIASEC calculations
const memoizedScoreRIASEC = memoize(scoreRIASEC);

// Use lazy loading for report sheets
const Layer1 = lazy(() => import("@/app/account/Class11Report").then(m => ({ default: m.Layer1PsychometricProfile })));
const Layer2 = lazy(() => import("@/app/account/Class11Report").then(m => ({ default: m.Layer2AcademicReality })));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Layer1 data={data.layer1} />
</Suspense>
```

---

## Support

For questions or issues:
1. Check CLASS_11_IMPLEMENTATION.md for full details
2. Review example response structure in IMPLEMENTATION.md
3. Run unit tests to validate scoring logic
4. Check browser console for React/TypeScript errors
5. Verify all imports are correct

---

**Status:** Ready for integration ✅
**Last Updated:** 2026-09-02
**Maintainer:** Assessment Engineering Team
