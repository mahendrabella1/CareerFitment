import { NextResponse } from "next/server";
import {
  CATEGORY_ORDER,
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
  const stage = (body.stage as StageKey) || stageForCategory(body.category || "");
  const resume = body.chosenSets && CATEGORY_ORDER.every((c) => body.chosenSets![c]);
  const chosenSets = resume ? (body.chosenSets as Record<Category, string>) : pickSets(stage);

  const sections = CATEGORY_ORDER.map((cat) => {
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
