import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, rowsOf } from "@/lib/institution/server";
import { studentAreas } from "@/lib/institution/features";
import type { InstitutionMessage, Opportunity, OpportunityType } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TYPES: OpportunityType[] = ["olympiad", "hackathon", "competition", "workshop", "internship", "scholarship", "event"];
const OUTCOMES = ["participated", "shortlisted", "won", "selected", "not selected", ""];

/**
 * /api/institution/opportunities - opportunities sent ONLY to the students
 * they suit (chosen classes and/or career areas, matched against each
 * student's best fits and goal), with "I applied" and outcomes tracked.
 *
 * GET    the institution's opportunities, newest first
 * POST   { title, type, description, url, deadline, classes, areas, preview? }
 *        preview: true only returns who would receive it
 * PATCH  { id, uid, outcome }
 */
export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const snap = await db.collection("opportunities").where("institutionId", "==", institution.id).get();
    const opportunities = snap.docs.map((d) => ({ ...(d.data() as Opportunity), id: d.id })).sort((a, b) => b.createdAt - a.createdAt);
    return NextResponse.json({ opportunities });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, account, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const classes = (Array.isArray(b.classes) ? b.classes : []).map(String);
    const areas = (Array.isArray(b.areas) ? b.areas : []).map(String);
    const rows = (await rowsOf(db, institution)).filter((s) => !s.archived);
    const matches = rows.filter((s) => {
      if (classes.length && !classes.includes(s.category)) return false;
      if (!areas.length) return true;
      const { fit, goal } = studentAreas(s);
      return [...fit, ...goal].some((a) => areas.includes(a));
    });
    if (b.preview) return NextResponse.json({ count: matches.length, sample: matches.slice(0, 8).map((s) => s.name) });

    const title = String(b.title ?? "").trim().slice(0, 120);
    const url = String(b.url ?? "").trim().slice(0, 500);
    if (!title) throw new ApiError(400, "Add a title.");
    if (url && !/^https?:\/\/\S+$/i.test(url)) throw new ApiError(400, "The link must start with http:// or https://");
    if (!matches.length) throw new ApiError(400, "No students match these classes and areas.");
    const type = TYPES.includes(b.type as OpportunityType) ? (b.type as OpportunityType) : "event";
    const deadline = /^\d{4}-\d{2}-\d{2}$/.test(String(b.deadline)) ? String(b.deadline) : "";
    const description = String(b.description ?? "").trim().slice(0, 1500);

    const oppRef = db.collection("opportunities").doc();
    const msgRef = db.collection("institutionMessages").doc();
    const now = Date.now();
    const recipients = matches.map((s) => s.uid);
    const why = areas.length ? " It was sent to you because it suits the career areas in your report." : "";
    const message: InstitutionMessage = {
      id: msgRef.id, institutionId: institution.id, institutionName: institution.name,
      kind: "recommendation", title: `Opportunity: ${title}`,
      body: `Hi {name}, ${description || `here is an opportunity that suits you: ${title}.`}${why}${deadline ? `\n\nLast date: ${new Date(deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}.` : ""}\n\nIf you apply, tap "I applied" so your school can support you.`,
      ...(url ? { externalUrl: url } : {}), opportunityId: oppRef.id,
      audience: { type: "students", label: `Opportunity · ${recipients.length} matched students` },
      recipients, readBy: {}, sentBy: account.uid, sentByName: account.displayName || institution.name, createdAt: now,
    };
    const opp: Opportunity = {
      id: oppRef.id, institutionId: institution.id, title, type, description, url, deadline, classes, areas,
      recipients, applied: {}, outcomes: {}, messageId: msgRef.id, createdAt: now, createdBy: account.displayName || institution.name,
    };
    const batch = db.batch();
    batch.set(oppRef, opp);
    batch.set(msgRef, message);
    await batch.commit();
    return NextResponse.json({ opportunity: opp });
  } catch (e) {
    return fail(e);
  }
}

export async function PATCH(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { id?: string; uid?: string; outcome?: string };
    const ref = db.collection("opportunities").doc(String(b.id || ""));
    const snap = await ref.get();
    const opp = snap.data() as Opportunity | undefined;
    if (!opp || opp.institutionId !== institution.id || !opp.recipients.includes(String(b.uid))) throw new ApiError(404, "Not found.");
    const outcome = OUTCOMES.includes(String(b.outcome)) ? String(b.outcome) : "";
    await ref.update({ [`outcomes.${b.uid}`]: outcome });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
