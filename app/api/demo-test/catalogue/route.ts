/**
 * /api/demo-test/catalogue — stream families, and the careers a chosen stream
 * combination can reach.
 *
 * GET                      -> the four stream families and their combinations
 * GET ?combination=<name>  -> careers for that combination, grouped by domain
 *
 * Read-only reference data with no personal information in it, so no auth. The
 * roadmap bodies are deliberately NOT returned here: the picker only needs
 * titles and verdicts, and the full catalogue is far larger than the dropdown.
 */
import { NextResponse } from "next/server";
import {
  streamFamilies,
  groupedForCombination,
  isKnownCombination,
} from "@/lib/demo11/catalogue";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const combination = new URL(req.url).searchParams.get("combination");

  if (!combination) {
    return NextResponse.json({
      success: true,
      data: { families: streamFamilies() },
    });
  }

  if (!isKnownCombination(combination)) {
    return NextResponse.json(
      { success: false, message: "Unknown stream combination", data: null },
      { status: 400 }
    );
  }

  const groups = groupedForCombination(combination);
  return NextResponse.json({
    success: true,
    data: {
      combination,
      groups,
      counts: {
        open: groups.reduce((n, g) => n + g.careers.filter((c) => c.verdict === "green").length, 0),
        conditional: groups.reduce((n, g) => n + g.careers.filter((c) => c.verdict === "yellow").length, 0),
        closed: groups.reduce((n, g) => n + g.careers.filter((c) => c.verdict === "red").length, 0),
      },
    },
  });
}
