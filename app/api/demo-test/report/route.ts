/**
 * /api/demo-test/report — scores a completed demo paper and builds the report.
 *
 * Everything the live exam produces, plus the two things the demo adds:
 *
 *   alignment  how the career the student named BEFORE the paper compares with
 *              what the paper actually found, explained either way
 *   roadmaps   the detailed route for the desired career, and — when the two
 *              disagree — for the measured one as well, so the student can see
 *              both rather than being told which to take
 *
 * Scoring itself is the same scoreAssessment60 the paid paper uses; the demo
 * bank is just another stage. That is deliberate, so the demo cannot drift away
 * from the engine the real report is built on.
 */
import { NextResponse } from "next/server";
import { scoreAssessment60 } from "@/lib/newAssessment/scoring60";
import { DEMO_STAGE, categoryOrder, getSet, type Category } from "@/lib/newAssessment/data";
import { getCareer, alternativesFor, isKnownCombination, figures } from "@/lib/demo11/catalogue";
import { computeAlignment, measuredCareerFor } from "@/lib/demo11/alignment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    chosenSets?: Record<Category, string>;
    answers?: Record<string, string>;
    combination?: string;
    desiredCareerId?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: "Invalid body", data: null }, { status: 400 });
  }

  const { chosenSets, answers, combination, desiredCareerId } = body;
  if (!chosenSets || !answers) {
    return NextResponse.json(
      { success: false, message: "Missing chosenSets or answers", data: null },
      { status: 400 }
    );
  }
  if (!combination || !isKnownCombination(combination)) {
    return NextResponse.json(
      { success: false, message: "Missing or unknown stream combination", data: null },
      { status: 400 }
    );
  }
  if (!desiredCareerId || !getCareer(desiredCareerId)) {
    return NextResponse.json(
      { success: false, message: "Missing or unknown desired career", data: null },
      { status: 400 }
    );
  }

  // `chosenSets` arrives from the browser, so it has to be checked against the
  // demo bank rather than trusted. Both banks name their sets "Set 1", so a
  // body carrying another paper's set names resolved to REAL demo questions of
  // a different length, and answers keyed to the other paper were scored
  // against them - producing a plausible-looking report built on nothing.
  const order = categoryOrder(DEMO_STAGE);
  const badSets = order.filter(
    (c) => !chosenSets[c] || getSet(c, DEMO_STAGE, chosenSets[c]).length === 0
  );
  if (badSets.length) {
    return NextResponse.json(
      {
        success: false,
        message: `Those question sets are not part of the demo paper (${badSets.join(", ")}).`,
        data: null,
      },
      { status: 400 }
    );
  }
  // Every answer key must name a question that exists in the sets above. A
  // mismatch here means the answers came from a different paper.
  const strayAnswers = Object.keys(answers).filter((key) => {
    const [cat, idx] = key.split(":");
    if (!order.includes(cat as Category)) return true;
    const n = getSet(cat as Category, DEMO_STAGE, chosenSets[cat as Category]).length;
    const i = Number(idx);
    return !Number.isInteger(i) || i < 0 || i >= n;
  });
  if (strayAnswers.length) {
    return NextResponse.json(
      {
        success: false,
        message: `Answers do not match the demo paper (${strayAnswers.length} unexpected).`,
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    // The stage is fixed server-side rather than taken from the request, so a
    // crafted body cannot make the demo score against the paid bank.
    const summary = scoreAssessment60(DEMO_STAGE, chosenSets, answers);

    const desired = getCareer(desiredCareerId)!;
    const alignment = computeAlignment(summary, desiredCareerId, combination);
    const measured = measuredCareerFor(summary, combination);

    // Show the measured career's roadmap only when it is genuinely a different
    // career. Printing the same roadmap twice under two headings would read as
    // padding and undercut the comparison.
    const showMeasured =
      !!measured && measured.id !== desired.id && alignment?.verdict !== "strong";

    return NextResponse.json({
      success: true,
      message: "scored",
      data: {
        summary: {
          ...summary,
          // Carried into the saved profile so the dashboard and the emailed
          // report can show the comparison without re-scoring.
          desiredCareer: desired.title,
          desiredCareerFitPct: alignment?.desiredClusterScore ?? null,
        },
        alignment,
        desiredCareer: { ...desired, alternatives: alternativesFor(desired.id, combination) },
        measuredCareer: showMeasured
          ? { ...measured, alternatives: alternativesFor(measured.id, combination) }
          : null,
        combination,
        // Provenance for the salary, college and exam figures, rendered as a
        // caveat beside each rather than buried in a footer.
        figures: figures(),
      },
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : "Scoring failed", data: null },
      { status: 500 }
    );
  }
}
