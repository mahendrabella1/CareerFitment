import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { jsonChat, strList } from "@/lib/ai/llm";
import { chargeDaily } from "@/lib/ai/quota";
import { jdKeywords } from "@/lib/resume/resume";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RULES = `Rules: use only facts the student gave - never invent employers, numbers, awards or tools. Where a number would make a line stronger but none was given, put a placeholder in square brackets, like [N students] or [X%], for the student to fill in or delete. No "I", "me" or "my". Plain ASCII punctuation, no emojis.`;

/**
 * POST /api/resume/ai { action, ... } - AI help in the resume builder:
 *   bullets { title, org, bullets[], target } -> { bullets[] }   rewrite with action verbs
 *   summary { facts, target, stage }           -> { summary }     2-3 sentence summary
 *   tailor  { resume (plain text), jd }        -> { keywords[], suggestions[] }
 * DeepSeek first, Groq when it's unavailable (lib/ai/llm.ts); 30 a day per student.
 */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const s = (v: unknown, max: number) => String(v ?? "").slice(0, max).trim();
    const action = s(b.action, 20);
    if (!["bullets", "summary", "tailor"].includes(action)) throw new ApiError(400, "Unknown request.");
    await chargeDaily(await getFirestore(), uid, "resume", 30, "That's 30 AI suggestions today - more tomorrow. Your resume is saved.");
    const target = s(b.target, 120);

    if (action === "bullets") {
      const bullets = strList(b.bullets, 8).map((x) => x.slice(0, 400));
      if (!bullets.length) throw new ApiError(400, "Write a line or two first - the AI improves what you wrote.");
      const { json } = await jsonChat({
        system: "You are a resume coach for students and early-career professionals in India.",
        prompt: `Rewrite these resume bullet points for "${s(b.title, 120)}" at "${s(b.org, 120)}"${target ? `, for someone applying for: ${target}` : ""}.
Make each one start with a strong past-tense action verb (present tense if the entry ends in "Present"), show the result or impact, and stay under 25 words. Keep the same number of bullets, in the same order.
${RULES}
Bullets:
${bullets.map((x, i) => `${i + 1}. ${x}`).join("\n")}`,
        schema: { type: "object", properties: { bullets: { type: "array", items: { type: "string" } } }, required: ["bullets"] },
        maxTokens: 900,
      });
      const out = strList(json.bullets, bullets.length);
      return NextResponse.json({ bullets: out.length ? out : bullets });
    }

    if (action === "summary") {
      const facts = s(b.facts, 4000);
      if (facts.length < 40) throw new ApiError(400, "Fill in your education, skills and a project or activity first - the summary is built from them.");
      const { json } = await jsonChat({
        system: "You are a resume coach for students and early-career professionals in India.",
        prompt: `Write a resume summary of 2-3 sentences (40-70 words) for a ${s(b.stage, 20) === "professional" ? "working professional" : s(b.stage, 20) === "school" ? "school student" : "college student"}${target ? ` aiming for: ${target}` : ""}.
Say who they are, their strongest skills and what they've done, and what they're looking for. ${RULES}
Facts from their resume:
${facts}`,
        schema: { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] },
        maxTokens: 400,
      });
      return NextResponse.json({ summary: s(json.summary, 900) });
    }

    const resume = s(b.resume, 8000), jd = s(b.jd, 6000);
    if (jd.length < 80) throw new ApiError(400, "Paste the full job description first.");
    const { json } = await jsonChat({
      system: "You are a resume coach who tailors resumes to job posts honestly.",
      prompt: `Compare this resume with the job description. List the important skills or terms from the job post that the resume is missing (at most 10), then give up to 5 specific suggestions to tailor the resume - which section to change and how. Only suggest adding something if the resume suggests the student really has it; otherwise say what they could learn or build. ${RULES}
Terms the job post repeats: ${jdKeywords(jd).join(", ")}
JOB DESCRIPTION:
${jd}
RESUME:
${resume}`,
      schema: { type: "object", properties: { missing: { type: "array", items: { type: "string" } }, suggestions: { type: "array", items: { type: "string" } } }, required: ["missing", "suggestions"] },
      maxTokens: 1000,
    });
    return NextResponse.json({ missing: strList(json.missing, 10), suggestions: strList(json.suggestions, 5) });
  } catch (e) {
    return fail(e);
  }
}
