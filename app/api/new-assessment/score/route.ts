import { NextResponse } from "next/server";
import { scoreAssessment } from "@/lib/newAssessment/scoring";
import { scoreClass6Assessment, type Class6Response } from "@/lib/newAssessment/class6Scoring";
import { scoreClass7Assessment, type Class7Response } from "@/lib/newAssessment/class7Scoring";
import { scoreClass8Assessment, type Class8Response } from "@/lib/newAssessment/class8Scoring";
import { scoreClass11Assessment, type Class11Response } from "@/lib/newAssessment/scoring11_12";
import { convertClass678Answers } from "@/lib/newAssessment/class678Ids";
import { getSet, optionsForQuestion, resolvedQuestionType, type Category, type StageKey } from "@/lib/newAssessment/data";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    stage?: StageKey;
    category?: string;
    chosenSets?: Record<Category, string>;
    answers?: Record<string, string>;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body", data: null }, { status: 400 });
  }
  if (!body.stage || !body.chosenSets || !body.answers) {
    return NextResponse.json({ success: false, message: "Missing stage/chosenSets/answers", data: null }, { status: 400 });
  }
  try {
    // Class 6/7/8/11-12 each have their own dedicated question bank and their
    // own scoring function that understands that bank's exact field format
    // (see class6Scoring.ts / class7Scoring.ts / class8Scoring.ts /
    // scoring11_12.ts). The generic scoreAssessment() engine reads a
    // DIFFERENT, never-shown-to-the-student "6-8"/"11-12" bank keyed by the
    // same stage name - calling it here used to score real answers against
    // the wrong questions and silently attach meaningless topStrengths/radar/
    // matches data that no report for these classes ever displays. Build a
    // minimal, honest summary instead and let the class-specific output do
    // the real work.
    let summary: AssessmentSummary;

    if (body.category === "class_6") {
      const responses: Class6Response = {
        studentName: "",
        responses: convertClass678Answers("class_6", body.answers),
      };
      const classOutput = scoreClass6Assessment(responses);
      summary = baseSummary("6", "Class 6");
      (summary as any).class6Output = classOutput;
    } else if (body.category === "class_7") {
      const responses: Class7Response = {
        studentName: "",
        responses: convertClass678Answers("class_7", body.answers),
      };
      const classOutput = scoreClass7Assessment(responses);
      summary = baseSummary("7", "Class 7");
      (summary as any).class7Output = classOutput;
    } else if (body.category === "class_8") {
      const responses: Class8Response = {
        studentName: "",
        responses: convertClass678Answers("class_8", body.answers),
      };
      const classOutput = scoreClass8Assessment(responses);
      summary = baseSummary("8", "Class 8");
      (summary as any).class8Output = classOutput;
    } else if (body.category === "class_11" || body.category === "class_12" || body.category === "class_11_12") {
      // Class 11 and 12 are now separate registration categories but share
      // the exact same 81-question bank and scoring engine - only the
      // reported journey label differs. "class_11_12" is kept working for
      // accounts registered before the split.
      const responses: Class11Response = convertAnswersToClass11Format(body.answers, body.chosenSets);
      applyPreExamAnswers(responses, body.answers, body.category);
      const classOutput = scoreClass11Assessment(responses);
      const [journeyCode, journeyName] =
        body.category === "class_11" ? ["11", "Class 11"] :
        body.category === "class_12" ? ["12", "Class 12"] :
        ["11-12", "Class 11-12"];
      summary = baseSummary(journeyCode, journeyName);
      (summary as any).class11Output = classOutput;
    } else {
      // For other stages (9-10, graduates, etc), use standard scoring
      summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
    }

    return NextResponse.json({ success: true, message: "scored", data: summary });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Scoring failed", data: null },
      { status: 500 }
    );
  }
}

// Minimal, valid AssessmentSummary shell for classes scored entirely by
// their own dedicated function - the real content lives in class6Output /
// class7Output / class8Output / class11Output, which every report for these
// classes reads directly.
function baseSummary(journeyCode: string, journeyName: string): AssessmentSummary {
  return {
    journeyCode,
    journeyName,
    completedAt: new Date().toISOString(),
    feedbackRating: null,
    overallFitmentPct: null,
    topCareer: null,
    desiredCareer: null,
    desiredCareerFitPct: null,
    summary: null,
    matches: [],
    topStrengths: [],
  };
}

// The 7 raw options shown for subject_fit:0 ("What is your current Class 11
// stream?" - Science-Maths, Science-Biology, Science-Both, Commerce,
// Humanities/Arts, Vocational/Diploma, Other), positionally mapped to the
// canonical stream keys scoring11_12.ts's STREAM_DOMAIN_FIT /
// getAvailablePathways switch on. Tied to that question's exact option
// order in data/class-11-12/questions-corrected.json.
const STREAM_KEY_BY_INDEX = ["MPC", "BiPC", "PCMB", "Commerce", "Arts", "Vocational", ""];

type FieldKind = "stream" | "text" | "index" | "multi";
type FieldSpec = { field: string; kind: FieldKind };

// Index -> target field for each Section 9/10/11 question, matching
// data/class-11-12/questions-corrected.json's exact question order.
// "index" kind stores the raw parsed number as-is - correct both for a
// literal option index and for a 1-10 slider's value (the slider's `value`
// string IS the number itself, so no special "scale" kind is needed).
const SUBJECT_FIT_FIELDS: Record<number, FieldSpec> = {
  0: { field: "currentStream", kind: "stream" },
  1: { field: "currentSubjects", kind: "multi" },
  2: { field: "enjoyedSubject", kind: "text" },
  3: { field: "difficultSubject", kind: "text" },
  4: { field: "academicConfidence", kind: "index" },
  5: { field: "streamSatisfaction", kind: "index" },
  6: { field: "streamChoiceReasons", kind: "multi" },
  7: { field: "explorationInterest", kind: "index" },
};
// index 0 was "clarity" (How clear are you about what you want to study
// after Class 12?) - that question was removed from the bank, so `clarity`
// on career_fit's context now permanently stays at emptyContext()'s default
// (5) instead of a real answer. Everything below is re-indexed down by one
// to match the bank's new question order; scoring11_12.ts's clarityScore /
// generateCareerAdvice() still read career_fit.clarity, they just always
// get the default now.
const CAREER_FIT_FIELDS: Record<number, FieldSpec> = {
  0: { field: "consideringAreas", kind: "multi" },
  1: { field: "degreeCertainty", kind: "text" },
  2: { field: "pathwayFlexibility", kind: "index" },
  3: { field: "topConcerns", kind: "multi" },
  4: { field: "decisionStage", kind: "text" },
  5: { field: "decisionConfidence", kind: "index" },
  6: { field: "pathwayType", kind: "text" },
};
const CAREER_SELECTOR_FIELDS: Record<number, FieldSpec> = {
  0: { field: "primaryCareer", kind: "text" },
  1: { field: "alternativeChoices", kind: "multi" },
  2: { field: "excludedCareers", kind: "multi" },
  3: { field: "reportPriority", kind: "text" },
};

const emptyContext = () => ({
  subject_fit: {
    currentStream: "", currentSubjects: [] as string[], enjoyedSubject: "", difficultSubject: "",
    academicConfidence: 5, streamSatisfaction: 5, streamChoiceReasons: [] as string[], explorationInterest: 5,
  },
  career_fit: {
    clarity: 5, consideringAreas: [] as string[], degreeCertainty: "", pathwayFlexibility: 5,
    topConcerns: [] as string[], decisionStage: "", decisionConfidence: 5, pathwayType: "",
  },
  career_selector: {
    primaryCareer: "", alternativeChoices: [] as string[], excludedCareers: [] as string[], reportPriority: "",
  },
});

// Convert NewExam answer format for Class 11-12
// Class11Response is structured by dimension, not sequential questions
function convertAnswersToClass11Format(answers: Record<string, string>, chosenSets?: Record<Category, string>): Class11Response {
  const dimensions: Record<string, Record<string, any>> = {
    personality: {},
    career_interest: {},
    aptitude: {},
    strength_domains: {},
    multiple_intelligence: {},
    motivators: {},
    learning_styles: {},
    emotional_intelligence: {},
  };
  const context = emptyContext();

  // Raw bank questions for the three contextual categories, so a given
  // answer index can be resolved back to its option text (for grouped
  // questions) or its collected type (open / multi-select / single-select).
  const stage: StageKey = "11-12";
  const rawByCategory: Partial<Record<"subject_fit" | "career_fit" | "career_selector", ReturnType<typeof getSet>>> = {};
  if (chosenSets) {
    for (const cat of ["subject_fit", "career_fit", "career_selector"] as const) {
      if (chosenSets[cat]) rawByCategory[cat] = getSet(cat, stage, chosenSets[cat]);
    }
  }
  const FIELD_MAPS = { subject_fit: SUBJECT_FIT_FIELDS, career_fit: CAREER_FIT_FIELDS, career_selector: CAREER_SELECTOR_FIELDS };

  Object.entries(answers).forEach(([key, value]) => {
    const [category, indexStr] = key.split(":");
    const index = parseInt(indexStr, 10);

    if (category === "personality" || category === "career_interest" || category === "aptitude" ||
        category === "motivators" || category === "learning_styles" || category === "emotional_intelligence" ||
        category === "strengths" || category === "multiple_intelligence") {
      const optionIndex = parseInt(value, 10);
      if (Number.isNaN(optionIndex)) return;
      const bucket = category === "strengths" ? "strength_domains" : category;
      dimensions[bucket][indexStr] = optionIndex;
      return;
    }

    if (category !== "subject_fit" && category !== "career_fit" && category !== "career_selector") return;
    const spec = FIELD_MAPS[category][index];
    if (!spec) return;

    const raw = rawByCategory[category]?.[index];
    const resolved = raw ? resolvedQuestionType(raw.type as string, raw.instruction) : undefined;
    const opts = raw ? optionsForQuestion(category, index, raw) : null;
    const target = context[category] as Record<string, any>;

    if (spec.kind === "multi") {
      if (!resolved?.isMulti) return;
      let selectedIdx: string[];
      try { selectedIdx = JSON.parse(value); } catch { return; }
      if (!Array.isArray(selectedIdx) || !opts) return;
      // subject_fit:1 shows 4 broad category options ("Sciences: Physics,
      // Chemistry, ...") instead of 15 individual subjects, but
      // SUBJECT_CLUSTER_AFFINITY in careerFitEngine1112.ts still matches
      // individual subject names one at a time — the bank's optional
      // expandsTo field (one subject array per option, parallel to options)
      // lets a picked category expand back into its real subjects here
      // rather than storing the literal grouped label text, which would
      // never match anything and silently drop this ranking signal.
      const expandsTo = Array.isArray(raw?.expandsTo) ? (raw!.expandsTo as unknown[]) : null;
      if (expandsTo) {
        const set = new Set<string>();
        selectedIdx.forEach((s) => {
          const items = expandsTo[parseInt(s, 10)];
          if (Array.isArray(items)) items.forEach((x) => typeof x === "string" && set.add(x));
        });
        target[spec.field] = [...set];
      } else {
        target[spec.field] = selectedIdx.map((s) => opts[parseInt(s, 10)]).filter((s): s is string => Boolean(s));
      }
      return;
    }

    // "stream" / "text" / "index" - all single-select answers, a plain
    // option index.
    const optionIndex = parseInt(value, 10);
    if (Number.isNaN(optionIndex)) return;
    if (spec.kind === "stream") {
      target[spec.field] = STREAM_KEY_BY_INDEX[optionIndex] ?? "";
    } else if (spec.kind === "index") {
      target[spec.field] = optionIndex;
    } else if (opts) {
      target[spec.field] = opts[optionIndex] ?? "";
    }
  });

  return {
    personality: dimensions.personality,
    career_interest: dimensions.career_interest,
    aptitude: dimensions.aptitude,
    strength_domains: dimensions.strength_domains,
    // The Strengths bank has 2 randomly-assigned sets - scoring11_12.ts needs
    // to know which one these strength_domains answers actually came from.
    strengthsSetName: chosenSets?.strengths,
    multiple_intelligence: dimensions.multiple_intelligence,
    motivators: dimensions.motivators,
    learning_styles: dimensions.learning_styles,
    emotional_intelligence: dimensions.emotional_intelligence,
    subject_fit: context.subject_fit,
    career_fit: context.career_fit,
    career_selector: context.career_selector,
  };
}

// Class 11/12's current stream and desired career are now collected on a
// pre-exam screen (NewExam.tsx's "preinfo" phase) rather than as in-exam
// questions - see the matching PRE_EXAM_SKIP comment in the generate route.
// convertAnswersToClass11Format() above leaves subject_fit.currentStream and
// career_selector.primaryCareer at their emptyContext() defaults since those
// two in-exam questions are no longer generated; this fills them in from the
// pre-exam answers instead, using the same synthetic "preinfo:*" keys
// NewExam.tsx writes into the same `answers` object as everything else.
// NewExam.tsx's STREAM_OPTIONS splits Commerce into CommerceMaths/
// CommerceNoMaths (matters for careerfit1112.ts's stream-fit matrix) - but
// subject_fit.currentStream and STREAM_DOMAIN_FIT (scoring11_12.ts) only
// know the coarser pre-split vocabulary, so both bucket down to "Commerce"
// here while responses.currentStreamDetailed keeps the exact choice.
function coarseStream(detailed: string): string {
  if (detailed === "CommerceMaths" || detailed === "CommerceNoMaths") return "Commerce";
  return detailed;
}

function applyPreExamAnswers(responses: Class11Response, answers: Record<string, string>, category: string): void {
  const stream = answers["preinfo:stream"];
  if (stream !== undefined) {
    responses.subject_fit.currentStream = coarseStream(stream);
    responses.currentStreamDetailed = stream;
  }
  const career = answers["preinfo:career"];
  if (career) responses.career_selector.primaryCareer = career;
  if (category === "class_12") {
    const pct = parseFloat(answers["preinfo:percentage"]);
    if (!Number.isNaN(pct)) responses.estimatedPercentage = Math.max(0, Math.min(100, pct));
  }
}
