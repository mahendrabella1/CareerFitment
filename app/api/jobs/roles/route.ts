/**
 * GET /api/jobs/roles?career=...&career=... - the job role names (role_match
 * values) the given careers correspond to, for "On my path". No database:
 * the same title matcher the importer uses (lib/jobs/classify.ts).
 */
import { NextResponse } from "next/server";
import { pathRoleNames } from "@/lib/jobs/classify";

export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const careers = new URL(req.url).searchParams.getAll("career")
    .map((c) => c.replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 100))
    .filter(Boolean)
    .slice(0, 20);
  return NextResponse.json({ roles: pathRoleNames(careers) }, { headers: { "Cache-Control": "public, s-maxage=86400" } });
}
