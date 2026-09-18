import { NextResponse } from "next/server";
import {
  categoryOrder,
  CATEGORY_META,
  pickSets,
  getSet,
  optionsForQuestion,
  resolvedQuestionType,
  stageForCategory,
  type Category,
  type StageKey,
} from "@/lib/newAssessment/data";
import { CLASS8_QUESTIONS } from "@/lib/newAssessment/class8Questions";
import class6Data from "@/data/class6-assessment-questions.json";
import class7Data from "@/data/class7-assessment-questions.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { category?: string; stage?: string; chosenSets?: Record<string, string> } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
  }

  // SPECIAL CASE: Career Discovery (Class 6/7/8)
  // These use dedicated JSON files with 60 questions across 8 dimensions,
  // formatted to work with the NewExam UI.
  if (body.category === "class_6" || body.category === "class_7" || body.category === "class_8") {
    let questions: any[] = [];

    if (body.category === "class_8") {
      // Class 8 uses TypeScript-defined questions
      questions = CLASS8_QUESTIONS.map((q) => ({
        section: q.dimension,
        text: q.question,
        options: q.options.map((opt) => opt.text),
        media: q.media ?? null,
        svgOptions: q.svgOptions ?? false,
      }));
    } else {
      // Class 6 and 7 use JSON files
      const classData = body.category === "class_7" ? class7Data : class6Data;
      questions = (classData as any).questions || [];
    }

    // Map dimensions to NewExam categories
    const dimensionMap: Record<string, Category> = {
      "Personality Preferences": "personality",
      "Career Interests - RIASEC": "career_interest",
      "Aptitude & Reasoning": "aptitude",
      "MI-Inspired Strength Domains": "multiple_intelligence",
      "Motivators & Values": "motivators",
      "Learning Preferences": "learning_styles",
      "Emotional & Social Awareness": "emotional_intelligence",
      "Creativity & Future Readiness": "creativity",
    };

    // Group questions by section/dimension
    const sections: any[] = [];
    const sectionMap: Record<string, any> = {};

    questions.forEach((q: any) => {
      const section = q.section as string;
      const category = dimensionMap[section] || "personality";

      if (!sectionMap[category]) {
        sectionMap[category] = {
          category,
          title: CATEGORY_META[category]?.title || section,
          blurb: CATEGORY_META[category]?.blurb || "",
          questions: [],
        };
      }

      sectionMap[category].questions.push({
        id: `${category}:${sectionMap[category].questions.length}`,
        type: q.options?.length === 2 ? "yes_no" : "mcq",
        text: q.text,
        options: q.options || null,
        styles: null,
        format: q.format ?? null,
        svgOptions: Boolean(q.svgOptions),
        media: q.media || null,
        optional: false,
      });
    });

    // Add sections in the correct order
    const order: Category[] = [
      "personality",
      "career_interest",
      "aptitude",
      "multiple_intelligence",
      "motivators",
      "learning_styles",
      "emotional_intelligence",
      "creativity",
    ];

    order.forEach((cat) => {
      if (sectionMap[cat]) {
        sections.push(sectionMap[cat]);
      }
    });

    return NextResponse.json({
      success: true,
      message: "ok",
      data: {
        stage: "6-8",
        chosenSets: { personality: "Set 1", career_interest: "Set 1", aptitude: "Set 1", multiple_intelligence: "Set 1", motivators: "Set 1", learning_styles: "Set 1", emotional_intelligence: "Set 1", creativity: "Set 1" },
        sections,
      },
    });
  }

  // Resume: if a saved stage + chosenSets is supplied, reuse them so the user
  // gets the exact same questions. Otherwise pick a fresh random set per category.
  //
  // A saved session may belong to a DIFFERENT paper. The saved session lives on
  // the user profile, not on the page, so a student who left a class 9-10 paper
  // half-finished and then opened /demo-test was resumed straight back into the
  // 9-10 paper — and the demo then scored those answers against the demo bank,
  // where "Set 1" exists too but holds different questions of a different
  // length. Silently wrong scores, no error anywhere.
  //
  // So when the caller names a category, that category decides the stage and a
  // saved session from any other stage is refused. Callers that send only a
  // stage (the original resume path) are unaffected.
  const wanted = body.category ? stageForCategory(body.category) : undefined;
  const saved = body.stage as StageKey | undefined;
  const stageMismatch = !!wanted && !!saved && saved !== wanted;
  const stage = stageMismatch ? wanted! : (saved || wanted || stageForCategory(""));
  const order = categoryOrder(stage);
  // A saved session may name sets that no longer exist (the class 9-10 bank was
  // replaced by the single 60-question set). Only honour a resume when every
  // named set still resolves to questions — otherwise draw fresh ones rather
  // than serving an empty exam.
  const resume =
    !stageMismatch &&
    !!body.chosenSets &&
    order.every((c) => body.chosenSets![c] && getSet(c, stage, body.chosenSets![c]).length > 0);
  const chosenSets = resume ? (body.chosenSets as Record<Category, string>) : pickSets(stage);

  // Class 11 and 12 now collect current stream and desired career on a
  // dedicated pre-exam screen (NewExam.tsx's "preinfo" phase) instead of as
  // in-exam questions — a cleaner, class-aware dropdown (the in-exam
  // subject_fit:0 question was hardcoded to say "Class 11" even for Class 12
  // students) with a proper domain-grouped career list instead of a flat
  // one. Skipping them here avoids asking the same two things twice in one
  // sitting; the score route seeds subject_fit.currentStream and
  // career_selector.primaryCareer from the pre-exam answers instead (see
  // its PRE_EXAM_SKIP-adjacent comment).
  const PRE_EXAM_SKIP = new Set(["subject_fit:0", "career_selector:0"]);

  // The class 11-12 bank (data/class-11-12/questions-corrected.json) uses a
  // few question-type spellings and an options-field layout the exam engine
  // doesn't know natively — see resolvedQuestionType() / optionsForQuestion()
  // in lib/newAssessment/data.ts, shared with the scoring route so both agree
  // on exactly what a given answer index or value means.
  const sections = order.map((cat) => {
    const raw = getSet(cat, stage, chosenSets[cat]);
    // Only DISPLAY fields go to the client — every answer key (correct, clusters,
    // scores, domains, mainCategory, subCategory, cluster) stays server-side.
    const questions = raw
      .map((q, i) => {
        const resolved = resolvedQuestionType(q.type as string, q.instruction);
        const options = optionsForQuestion(cat, i, q);
        // Infinity ("select all that apply") doesn't survive JSON — it
        // serializes to `null`, which the client's `q.maxSelect ?? 1` then
        // silently turns back into a cap of 1, locking every option after the
        // first. The real ceiling for "all" is just the option count.
        const maxSelect = resolved.maxSelect === Infinity ? (options?.length ?? undefined) : resolved.maxSelect;
        return {
          id: `${cat}:${i}`,
          type: resolved.type,
          text: q.text as string,
          options,
          styles: (q.styles as string[] | undefined) ?? null,
          format: (q.format as string | undefined) ?? null,
          svgOptions: Boolean(q.svgOptions),
          media: (q.media as object | null | undefined) ?? null,
          optional: resolved.isOpen,
          maxSelect,
          // Custom 1-10 slider end-labels (e.g. "Not comfortable at all" /
          // "Very comfortable") — falls back to the generic default in
          // NewExam.tsx's QuestionInput when a scale question doesn't set them.
          scaleLabel_min: (q.scaleLabel_min as string | undefined) ?? null,
          scaleLabel_max: (q.scaleLabel_max as string | undefined) ?? null,
        };
      })
      .filter((q) => !(stage === "11-12" && PRE_EXAM_SKIP.has(q.id)));
    return {
      category: cat,
      title: CATEGORY_META[cat].title,
      blurb: CATEGORY_META[cat].blurb,
      questions,
    };
  });

  return NextResponse.json({ success: true, message: "ok", data: { stage, chosenSets, sections } });
}
