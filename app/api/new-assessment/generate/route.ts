import { NextResponse } from "next/server";
import {
  CATEGORY_ORDER,
  CATEGORY_META,
  pickSets,
  getSet,
  stageForCategory,
} from "@/lib/newAssessment/data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { category?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* empty body ok */
  }
  const stage = stageForCategory(body.category || "");
  const chosenSets = pickSets(stage);

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
