import { NextResponse } from "next/server";
import { scoreAssessment } from "@/lib/newAssessment/scoring";
import { scoreClass6Assessment, type Class6Response } from "@/lib/newAssessment/class6Scoring";
import { scoreClass7Assessment, type Class7Response } from "@/lib/newAssessment/class7Scoring";
import { scoreClass8Assessment, type Class8Response } from "@/lib/newAssessment/class8Scoring";
import { scoreClass11Assessment, type Class11Response } from "@/lib/newAssessment/scoring11_12";
import type { Category, StageKey } from "@/lib/newAssessment/data";
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
    // For Class 6/7/8 and 11-12, convert NewExam answers format to class-specific response format
    // and call class-specific scoring functions
    let summary: AssessmentSummary;

    if (body.category === "class_6") {
      const responses: Class6Response = {
        studentName: "",
        responses: convertAnswersToResponseFormat(body.answers),
      };
      const classOutput = scoreClass6Assessment(responses);
      summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
      summary.journeyCode = "6";
      summary.journeyName = "Class 6";
      (summary as any).class6Output = classOutput;
    } else if (body.category === "class_7") {
      const responses: Class7Response = {
        studentName: "",
        responses: convertAnswersToResponseFormat(body.answers),
      };
      const classOutput = scoreClass7Assessment(responses);
      summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
      summary.journeyCode = "7";
      summary.journeyName = "Class 7";
      (summary as any).class7Output = classOutput;
    } else if (body.category === "class_8") {
      const responses: Class8Response = {
        studentName: "",
        responses: convertAnswersToResponseFormat(body.answers),
      };
      const classOutput = scoreClass8Assessment(responses);
      summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
      summary.journeyCode = "8";
      summary.journeyName = "Class 8";
      (summary as any).class8Output = classOutput;
    } else if (body.category === "class_11_12") {
      // Class 11-12 uses a different response structure organized by dimension
      const responses: Class11Response = convertAnswersToClass11Format(body.answers);
      const classOutput = scoreClass11Assessment(responses);
      summary = scoreAssessment(body.stage, body.chosenSets, body.answers);
      summary.journeyCode = "11-12";
      summary.journeyName = "Class 11-12";
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

// Convert NewExam answer format (e.g., "personality:0", "career_interest:1")
// to class-specific response format (question index -> option index)
function convertAnswersToResponseFormat(answers: Record<string, string>): Record<number, number> {
  const responses: Record<number, number> = {};
  let questionIndex = 0;

  // Iterate through answers in order to build sequential question indices
  Object.entries(answers).forEach(([key, value]) => {
    const optionIndex = parseInt(value, 10);
    if (!Number.isNaN(optionIndex)) {
      responses[questionIndex++] = optionIndex;
    }
  });

  return responses;
}

// Convert NewExam answer format for Class 11-12
// Class11Response is structured by dimension, not sequential questions
function convertAnswersToClass11Format(answers: Record<string, string>): Class11Response {
  const dimensions: Record<string, Record<string, any>> = {
    personality: {},
    career_interest: {},
    aptitude: {},
    strength_domains: {},
    motivators: {},
    learning_styles: {},
    emotional_intelligence: {},
    creativity: {},
  };

  // Map NewExam answer keys to dimension-specific responses
  Object.entries(answers).forEach(([key, value]) => {
    const [category, indexStr] = key.split(":");
    const optionIndex = parseInt(value, 10);

    if (!Number.isNaN(optionIndex)) {
      if (category === "personality") {
        dimensions.personality[indexStr] = optionIndex;
      } else if (category === "career_interest") {
        dimensions.career_interest[indexStr] = optionIndex;
      } else if (category === "aptitude") {
        dimensions.aptitude[indexStr] = optionIndex;
      } else if (category === "strengths") {
        dimensions.strength_domains[indexStr] = optionIndex;
      } else if (category === "motivators") {
        dimensions.motivators[indexStr] = optionIndex > 0;
      } else if (category === "learning_styles") {
        dimensions.learning_styles[indexStr] = optionIndex;
      } else if (category === "emotional_intelligence") {
        dimensions.emotional_intelligence[indexStr] = optionIndex;
      } else if (category === "creativity") {
        dimensions.creativity[indexStr] = optionIndex;
      } else if (category === "subject_fit") {
        // Subject fit is stored separately
        if (!dimensions.subject_fit) {
          (dimensions as any).subject_fit = {
            currentStream: "",
            currentSubjects: [],
            confidence: {},
          };
        }
        (dimensions as any).subject_fit.confidence[indexStr] = optionIndex;
      } else if (category === "career_fit") {
        // Career fit is stored separately
        if (!dimensions.career_fit) {
          (dimensions as any).career_fit = {
            clarity: 5,
            consideringAreas: [],
          };
        }
        if (indexStr === "0") {
          (dimensions as any).career_fit.clarity = optionIndex;
        }
      } else if (category === "career_selector") {
        // Career selector is stored separately
        if (!dimensions.career_selector) {
          (dimensions as any).career_selector = {
            primaryCareer: "",
            alternativeChoices: [],
          };
        }
      }
    }
  });

  return {
    personality: dimensions.personality,
    career_interest: dimensions.career_interest,
    aptitude: dimensions.aptitude,
    strength_domains: dimensions.strength_domains,
    motivators: dimensions.motivators,
    learning_styles: dimensions.learning_styles,
    emotional_intelligence: dimensions.emotional_intelligence,
    creativity: dimensions.creativity,
    subject_fit: (dimensions as any).subject_fit || {
      currentStream: "",
      currentSubjects: [],
      confidence: {},
    },
    career_fit: (dimensions as any).career_fit || {
      clarity: 5,
      consideringAreas: [],
    },
    career_selector: (dimensions as any).career_selector || {
      primaryCareer: "",
      alternativeChoices: [],
    },
  };
}
