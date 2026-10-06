import { NextResponse } from "next/server";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { ApiError, fail } from "@/lib/institution/server";
import { CAREER_AREAS, PARENT_PRIORITIES, type ParentSurvey } from "@/lib/institution/features";
import { liveStreak, weekOf, type GpsState } from "@/lib/gps";
import type { FamilyDecision } from "@/lib/decisionRoom";

export const dynamic = "force-dynamic";

/**
 * /api/parent/[token] - the parent window behind a link the school shared:
 * the survey, the child's Family Decision Room sheet (agree / let's discuss)
 * and this week's Career GPS progress. No account: the unguessable token is
 * the key, and it only reaches one student. Never returns contact details.
 */
async function resolve(token: string) {
  if (!isFirestoreConfigured()) throw new ApiError(503, "This service isn't available right now.");
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(token)) throw new ApiError(404, "This link isn't valid.");
  const db = await getFirestore();
  const link = await db.collection("parentLinks").doc(token).get();
  if (!link.exists) throw new ApiError(404, "This link isn't valid. Ask the school for a new one.");
  const uid = String(link.get("uid"));
  const institutionId = String(link.get("institutionId"));
  const [user, inst, survey] = await Promise.all([
    db.collection("users").doc(uid).get(),
    db.collection("institutions").doc(institutionId).get(),
    db.collection("parentSurveys").doc(uid).get(),
  ]);
  return { db, uid, institutionId, user, child: String(user.get("name") || "your child").split(" ")[0], school: String(inst.get("name") || "the school"), survey: survey.exists ? (survey.data() as ParentSurvey) : null };
}

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const r = await resolve(params.token);
    // The parent window: the child's decision sheet and this week's Career GPS.
    const a = r.user.get("latestAssessment") as { customFields?: { name: string; fit: number }[]; matches?: { title: string; fitmentPct: number }[]; desiredCareer?: string } | undefined;
    const fits = a?.customFields?.length ? a.customFields.map((f) => ({ name: f.name, pct: Math.round(f.fit) })) : (a?.matches ?? []).map((m) => ({ name: m.title, pct: Math.round(m.fitmentPct) }));
    const drives = Object.values((r.user.get("testDrives") ?? {}) as Record<string, { career: string; enjoyment: number }>).map((d) => ({ career: d.career, enjoyment: d.enjoyment }));
    const gps = r.user.get("gps") as GpsState | undefined;
    const wk = weekOf();
    const lastWk = weekOf(new Date(wk.start - 86400000)).key;
    const thisWeek = gps?.weeks?.[wk.key];
    return NextResponse.json({
      child: r.child, school: r.school,
      areas: CAREER_AREAS.map((x) => ({ key: x.key, label: x.label })), priorities: PARENT_PRIORITIES,
      submitted: !!r.survey,
      survey: r.survey ? { areas: r.survey.areas, priorities: r.survey.priorities } : null,
      decision: (r.user.get("decision") as FamilyDecision | undefined) ?? null,
      childData: { fits: fits.slice(0, 5), goal: a?.desiredCareer || String(r.user.get("desiredCareer") || "") || null, testDrives: drives },
      gps: { done: thisWeek?.done.length ?? 0, total: thisWeek?.missions.length ?? 3, points: gps?.points ?? 0, streak: liveStreak(gps, wk.key, lastWk) },
    });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const r = await resolve(params.token);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    if (b.decisionResponse === "agree" || b.decisionResponse === "discuss") {
      if (!r.user.get("decision")) throw new ApiError(400, "There is no decision sheet to respond to yet.");
      await r.db.collection("users").doc(r.uid).update({ "decision.parentResponse": { answer: b.decisionResponse, comment: String(b.comment ?? "").trim().slice(0, 500), at: Date.now() } });
      return NextResponse.json({ ok: true });
    }
    const keys = new Set(CAREER_AREAS.map((a) => a.key));
    const areas = (Array.isArray(b.areas) ? b.areas : []).map(String).filter((a) => a === "open" || keys.has(a)).slice(0, 4);
    if (!areas.length) throw new ApiError(400, "Choose at least one option.");
    const phone = String(b.phone ?? "").replace(/[^\d+]/g, "").slice(0, 16);
    const survey: ParentSurvey = {
      uid: r.uid, institutionId: r.institutionId,
      parentName: String(b.parentName ?? "").trim().slice(0, 80),
      relation: String(b.relation ?? "").trim().slice(0, 30),
      phone,
      language: ["en", "hi", "te"].includes(String(b.language)) ? (b.language as ParentSurvey["language"]) : "en",
      areas: areas.includes("open") ? ["open"] : areas,
      firmness: ["open", "prefer", "insist"].includes(String(b.firmness)) ? (b.firmness as ParentSurvey["firmness"]) : "prefer",
      priorities: (Array.isArray(b.priorities) ? b.priorities : []).map(String).filter((p) => PARENT_PRIORITIES.includes(p)).slice(0, 3),
      note: String(b.note ?? "").trim().slice(0, 500),
      submittedAt: Date.now(),
    };
    await r.db.collection("parentSurveys").doc(r.uid).set(survey);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
