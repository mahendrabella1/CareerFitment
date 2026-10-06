import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, rowsOf } from "@/lib/institution/server";
import { decisionBriefText } from "@/lib/institution/features";
import { categoryLabel } from "@/lib/auth/formOptions";
import type { InstitutionMessage } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/institution/decisions - { classes?: string[], uids?: string[] }
 * Sends each chosen student THEIR OWN decision brief (lib/institution/
 * features.ts decisionBriefText: the decision ahead, their best fits and
 * goal, upcoming exam dates for their areas, questions to settle with
 * parents and the counsellor) as an inbox message.
 */
export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { classes?: unknown; uids?: unknown };
    const classes = new Set((Array.isArray(b.classes) ? b.classes : []).map(String));
    const uids = new Set((Array.isArray(b.uids) ? b.uids : []).map(String));
    const now = Date.now();
    const targets = (await rowsOf(db, institution)).filter((s) => !s.archived && (uids.size ? uids.has(s.uid) : classes.has(s.category)));
    if (!targets.length) throw new ApiError(400, "No students match.");
    const label = uids.size ? `${targets.length} selected` : [...classes].map(categoryLabel).join(", ");
    for (let i = 0; i < targets.length; i += 400) {
      const batch = db.batch();
      for (const s of targets.slice(i, i + 400)) {
        const brief = decisionBriefText(s, now);
        const ref = db.collection("institutionMessages").doc();
        const m: InstitutionMessage = {
          id: ref.id, institutionId: institution.id, institutionName: institution.name,
          kind: "recommendation", title: brief.title, body: brief.body, link: "/account",
          audience: { type: "students", label: `Decision brief · ${label}` },
          recipients: [s.uid], readBy: {}, sentBy: account.uid, sentByName: account.displayName || institution.name, createdAt: now,
        };
        batch.set(ref, m);
      }
      await batch.commit();
    }
    return NextResponse.json({ sent: targets.length });
  } catch (e) {
    return fail(e);
  }
}
