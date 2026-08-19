import { NextResponse } from "next/server";
import {
  categoryOrder,
  CATEGORY_META,
  pickSets,
  getSet,
  stageForCategory,
  type Category,
  type StageKey,
} from "@/lib/newAssessment/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { category?: string; stage?: string; chosenSets?: Record<string, string> } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
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

  const sections = order.map((cat) => {
    const raw = getSet(cat, stage, chosenSets[cat]);
    // Only DISPLAY fields go to the client — every answer key (correct, clusters,
    // scores, domains, mainCategory, subCategory, cluster) stays server-side.
    const questions = raw.map((q, i) => ({
      id: `${cat}:${i}`,
      type: q.type as string,
      text: q.text as string,
      options: (q.options as string[] | undefined) ?? null,
      styles: (q.styles as string[] | undefined) ?? null,
      format: (q.format as string | undefined) ?? null,
      svgOptions: Boolean(q.svgOptions),
      media: (q.media as object | null | undefined) ?? null,
      optional: q.type === "open",
    }));
    return {
      category: cat,
      title: CATEGORY_META[cat].title,
      blurb: CATEGORY_META[cat].blurb,
      questions,
    };
  });

  return NextResponse.json({ success: true, message: "ok", data: { stage, chosenSets, sections } });
}
