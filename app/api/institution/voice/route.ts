import { NextResponse } from "next/server";
import { ApiError, fail, requireInstitution, rowsOf } from "@/lib/institution/server";
import { secondsInLast } from "@/lib/institution/analytics";
import { VOICE_LANGS, toE164, voiceScript, type VoiceLang, type VoiceTemplate } from "@/lib/institution/voice";
import type { ParentSurvey } from "@/lib/institution/features";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * /api/institution/voice - automated calls to parents (Twilio), each in the
 * language the parent chose in the survey, using the phone number they gave.
 *
 * GET   whether calling is set up, and how many parents can be reached
 * POST  { uids, template, custom?, preview? } - preview returns the script
 *       for the first student without calling anyone
 *
 * Needs TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER.
 */
const configured = () => !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
const esc = (s: string) => s.replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c] as string));

export async function GET(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const snap = await db.collection("parentSurveys").where("institutionId", "==", institution.id).get();
    const reachable = snap.docs.filter((d) => toE164(String(d.get("phone") || ""))).length;
    return NextResponse.json({ configured: configured(), reachable });
  } catch (e) {
    return fail(e);
  }
}

export async function POST(req: Request) {
  try {
    const { institution, db } = await requireInstitution(req);
    const b = (await req.json().catch(() => ({}))) as { uids?: unknown; template?: string; custom?: string; preview?: boolean };
    const template = (["assessment", "monthly", "custom"].includes(String(b.template)) ? b.template : "monthly") as VoiceTemplate;
    const custom = String(b.custom ?? "").trim().slice(0, 600);
    if (template === "custom" && !custom) throw new ApiError(400, "Write the message to be spoken.");
    const wanted = new Set((Array.isArray(b.uids) ? b.uids : []).map(String));
    const [rows, surveys] = await Promise.all([rowsOf(db, institution), db.collection("parentSurveys").where("institutionId", "==", institution.id).get()]);
    const surveyByUid = new Map(surveys.docs.map((d) => [d.id, d.data() as ParentSurvey]));
    const now = Date.now();
    const calls = rows.filter((r) => wanted.has(r.uid)).map((r) => {
      const s = surveyByUid.get(r.uid);
      const lang = (s?.language ?? "en") as VoiceLang;
      return { row: r, phone: s ? toE164(s.phone) : null, lang, script: voiceScript(template, lang, r, institution.name, Math.round(secondsInLast(r, 30, now) / 60), custom) };
    });
    if (b.preview) return NextResponse.json({ preview: calls[0]?.script ?? "", reachable: calls.filter((c) => c.phone).length, total: calls.length });
    if (!configured()) throw new ApiError(503, "Voice calls aren't set up yet: add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER to the deployment.");

    const sid = process.env.TWILIO_ACCOUNT_SID!, token = process.env.TWILIO_AUTH_TOKEN!, from = process.env.TWILIO_FROM_NUMBER!;
    let placed = 0;
    const failed: string[] = [];
    for (const c of calls.filter((x) => x.phone).slice(0, 200)) {
      const v = VOICE_LANGS.find((l) => l.key === c.lang)!;
      const twiml = `<Response><Say language="${v.ttsLang}" voice="${v.voice}">${esc(c.script)}</Say><Pause length="1"/><Say language="${v.ttsLang}" voice="${v.voice}">${esc(c.script)}</Say></Response>`;
      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Calls.json`, {
        method: "POST",
        headers: { Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ To: c.phone!, From: from, Twiml: twiml }),
      });
      const data = (await res.json().catch(() => ({}))) as { sid?: string; status?: string; message?: string };
      await db.collection("voiceCalls").add({ institutionId: institution.id, uid: c.row.uid, phone: c.phone, language: c.lang, template, status: res.ok ? data.status ?? "queued" : "failed", error: res.ok ? "" : data.message ?? String(res.status), callSid: data.sid ?? "", createdAt: Date.now() });
      if (res.ok) placed++; else failed.push(`${c.row.name}: ${data.message ?? res.status}`);
    }
    return NextResponse.json({ placed, noPhone: calls.filter((c) => !c.phone).length, failed });
  } catch (e) {
    return fail(e);
  }
}
