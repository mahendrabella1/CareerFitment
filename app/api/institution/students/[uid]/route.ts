import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, studentOf } from "@/lib/institution/server";
import { toStudentRow } from "@/lib/institution/analytics";
import type { InstitutionMessage } from "@/lib/institution/types";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * GET /api/institution/students/[uid] - one student of the caller's
 * institution: their list row, the profile fields their report needs
 * (including `latestAssessment`, so the portal can show the full report), the
 * institution's messages to them with read status, and Startups course
 * progress. Never returns in-progress exam answers or payment details.
 */
export async function GET(req: Request, { params }: { params: { uid: string } }) {
  try {
    const { institution, db } = await requireInstitution(req);
    const data = await studentOf(db, institution, params.uid);
    if (!data) throw new ApiError(404, "No student with this ID belongs to your institution.");
    const now = Date.now();

    const [msgSnap, lessonSnap, testSnap, surveySnap, milestoneSnap, obsSnap, mentorA, mentorB] = await Promise.all([
      db.collection("institutionMessages").where("recipients", "array-contains", params.uid).get(),
      db.collection("startupsLessonProgress").where("uid", "==", params.uid).get().catch(() => null),
      db.collection("startupsModuleTestProgress").where("uid", "==", params.uid).get().catch(() => null),
      db.collection("parentSurveys").doc(params.uid).get(),
      db.collection("milestones").where("uid", "==", params.uid).get(),
      db.collection("observations").doc(`${institution.id}_${params.uid}`).get(),
      db.collection("mentorPairs").where("mentorUid", "==", params.uid).get(),
      db.collection("mentorPairs").where("menteeUid", "==", params.uid).get(),
    ]);
    const messages = msgSnap.docs
      .map((d) => ({ ...(d.data() as InstitutionMessage), id: d.id }))
      .filter((m) => m.institutionId === institution.id)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50)
      .map((m) => ({ id: m.id, kind: m.kind, title: m.title, createdAt: m.createdAt, sentByName: m.sentByName, readAt: m.readBy?.[params.uid] ?? null }));

    const startups = {
      lessonsCompleted: lessonSnap ? lessonSnap.docs.filter((d) => d.get("status") === "COMPLETED").length : 0,
      lessonsStarted: lessonSnap ? lessonSnap.size : 0,
      moduleTests: testSnap ? testSnap.docs.map((d) => ({ module: String(d.get("moduleSlug") || ""), bestPercent: Number(d.get("bestPercent") || 0) })) : [],
    };

    const profile = {
      uid: params.uid,
      name: data.name ?? "", email: data.email ?? "", phone: data.phone ?? "",
      institution: data.institution ?? "", category: data.category ?? "", city: data.city ?? "", age: data.age ?? "",
      desiredCareer: data.desiredCareer ?? "", clarity: data.clarity ?? "",
      latestAssessment: data.latestAssessment ?? null,
    };

    const survey = surveySnap.exists && surveySnap.get("institutionId") === institution.id ? surveySnap.data() : null;
    const milestones = milestoneSnap.docs.map((d) => ({ ...d.data(), id: d.id })).sort((a, b) => Number((b as { createdAt?: number }).createdAt) - Number((a as { createdAt?: number }).createdAt));
    const observation = obsSnap.exists ? obsSnap.data() : null;
    const mentors = [...mentorA.docs, ...mentorB.docs].filter((d) => d.get("institutionId") === institution.id).map((d) => ({ ...d.data(), id: d.id }));

    return NextResponse.json({ student: toStudentRow(params.uid, data, now), profile, messages, startups, survey, milestones, observation, mentors });
  } catch (e) {
    return fail(e);
  }
}
