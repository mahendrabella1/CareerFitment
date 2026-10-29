import { NextResponse } from "next/server";
import { getFirestore } from "@/lib/firebase/admin";
import { ApiError, caller, fail } from "@/lib/institution/server";
import { jsonChat, strList } from "@/lib/ai/llm";
import { chargeDaily } from "@/lib/ai/quota";
import { jdKeywords } from "@/lib/resume/resume";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RULES = `Rules: use only facts the student gave - never invent employers, numbers, awards, tools or experiences. Where a number or detail would make a line stronger but none was given, put a placeholder in square brackets, like [N students] or [X%], for the student to fill in or delete. Plain ASCII punctuation, no emojis.`;
const NO_I = `No "I", "me" or "my".`;
const COACH = "You are a careers coach for students and early-career professionals in India.";
const ACTIONS = ["bullets", "draft", "summary", "tailor", "role", "cover", "linkedin", "questions"] as const;
type Action = (typeof ACTIONS)[number];

const who = (stage: string) => (stage === "professional" ? "working professional" : stage === "school" ? "school student" : "college student");
const arr = (props: Record<string, unknown>, required: string[]) => ({ type: "object", properties: props, required });
const list = { type: "array", items: { type: "string" } };

/**
 * POST /api/resume/ai { action, ... } - AI help along the job journey
 * (DeepSeek first, Groq when it's unavailable - lib/ai/llm.ts; 40 a day):
 *   bullets   { title, org, bullets[], target }  -> { bullets[] }          rewrite with action verbs
 *   draft     { title, org, notes, target }      -> { bullets[] }          bullets from a plain description
 *   summary   { facts, target, stage }           -> { summary }
 *   tailor    { resume, jd }                     -> { missing[], suggestions[] }
 *   role      { target, stage, skills[] }        -> { skills[], focus[], projects[] }   the role kit
 *   cover     { resume, title, company, jd }     -> { letter }
 *   linkedin  { resume, target }                 -> { headline, about }
 *   questions { target, stage, jd? }             -> { questions: { q, how }[] }
 */
export async function POST(req: Request) {
  try {
    const { uid } = await caller(req);
    const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const s = (v: unknown, max: number) => String(v ?? "").slice(0, max).trim();
    const action = s(b.action, 20) as Action;
    if (!ACTIONS.includes(action)) throw new ApiError(400, "Unknown request.");
    const target = s(b.target, 120), stage = s(b.stage, 20);
    const resume = s(b.resume, 8000), jd = s(b.jd, 6000);

    // Check the input before spending a request from the day's allowance.
    if ((action === "bullets") && !strList(b.bullets, 8).length) throw new ApiError(400, "Write a line or two first - the AI improves what you wrote.");
    if (action === "draft" && s(b.notes, 1500).length < 20) throw new ApiError(400, "Describe what you did in a sentence or two first.");
    if (action === "summary" && s(b.facts, 4000).length < 40) throw new ApiError(400, "Fill in your education, skills and a project or activity first - the summary is built from them.");
    if ((action === "tailor" || action === "cover") && jd.length < 80) throw new ApiError(400, "Paste the full job description first.");
    if ((action === "role" || action === "questions") && target.length < 3) throw new ApiError(400, "Add your target role first.");
    if ((action === "cover" || action === "linkedin") && resume.length < 80) throw new ApiError(400, "Fill in more of your resume first.");
    await chargeDaily(await getFirestore(), uid, "career", 40, "That's 40 AI suggestions today - more tomorrow. Everything you've written is saved.");

    if (action === "bullets" || action === "draft") {
      const src = action === "bullets" ? strList(b.bullets, 8).map((x) => x.slice(0, 400)) : [s(b.notes, 1500)];
      const { json } = await jsonChat({
        system: COACH,
        prompt: `${action === "bullets" ? "Rewrite these resume bullet points" : "Turn this description into 2-4 resume bullet points"} for "${s(b.title, 120)}" at "${s(b.org, 120)}"${target ? `, for someone applying for: ${target}` : ""}.
Each bullet starts with a strong past-tense action verb, shows the result or impact, and stays under 25 words.${action === "bullets" ? " Keep the same number of bullets, in the same order." : ""} ${NO_I}
${RULES}
${action === "bullets" ? `Bullets:\n${src.map((x, i) => `${i + 1}. ${x}`).join("\n")}` : `Their description:\n${src[0]}`}`,
        schema: arr({ bullets: list }, ["bullets"]),
        maxTokens: 900,
      });
      const out = strList(json.bullets, action === "bullets" ? src.length : 4);
      return NextResponse.json({ bullets: out.length ? out : src });
    }

    if (action === "summary") {
      const { json } = await jsonChat({
        system: COACH,
        prompt: `Write a resume summary of 2-3 sentences (40-70 words) for a ${who(stage)}${target ? ` aiming for: ${target}` : ""}.
Say who they are, their strongest skills and what they've done, and what they're looking for. ${NO_I} ${RULES}
Facts from their resume:
${s(b.facts, 4000)}`,
        schema: arr({ summary: { type: "string" } }, ["summary"]),
        maxTokens: 400,
      });
      return NextResponse.json({ summary: s(json.summary, 900) });
    }

    if (action === "tailor") {
      const { json } = await jsonChat({
        system: "You are a resume coach who tailors resumes to job posts honestly.",
        prompt: `Compare this resume with the job description. List the important skills or terms from the job post that the resume is missing (at most 10), then give up to 5 specific suggestions to tailor the resume - which section to change and how. Only suggest adding something if the resume suggests the student really has it; otherwise say what they could learn or build. ${RULES}
Terms the job post repeats: ${jdKeywords(jd).join(", ")}
JOB DESCRIPTION:
${jd}
RESUME:
${resume}`,
        schema: arr({ missing: list, suggestions: list }, ["missing", "suggestions"]),
        maxTokens: 1000,
      });
      return NextResponse.json({ missing: strList(json.missing, 10), suggestions: strList(json.suggestions, 5) });
    }

    if (action === "role") {
      const have = strList(b.skills, 30).join(", ");
      const { json } = await jsonChat({
        system: COACH,
        prompt: `A ${who(stage)} in India wants to apply for: ${target}.
1. List 10-12 skills employers most often ask for in this role at an entry level (short names as they'd appear in a job post - tools, technical skills, and 2-3 working skills).
2. List 3 things recruiters look for first in a resume for this role (one sentence each).
3. Suggest 3 small, realistic projects or experiences a ${who(stage)} could do in 2-6 weeks to show they can do this job (one sentence each, specific).
Skills they already list: ${have || "none yet"}. Be accurate and practical; no invented statistics.`,
        schema: arr({ skills: list, focus: list, projects: list }, ["skills", "focus", "projects"]),
        maxTokens: 900,
      });
      return NextResponse.json({ skills: strList(json.skills, 12).map((x) => x.slice(0, 40)), focus: strList(json.focus, 3), projects: strList(json.projects, 3) });
    }

    if (action === "cover") {
      const { json } = await jsonChat({
        system: COACH,
        prompt: `Write a cover letter (180-250 words, 3-4 short paragraphs, starting "Dear Hiring Manager,") for the role "${s(b.title, 160)}" at "${s(b.company, 120)}".
Open with the role and one specific reason this company or role interests them (from the job post). Then connect 2-3 facts from the resume to what the post asks for. Close with a confident, polite call to action. First person is fine in a letter. ${RULES} Sign off with the name from the resume.
JOB DESCRIPTION:
${jd}
RESUME:
${resume}`,
        schema: arr({ letter: { type: "string" } }, ["letter"]),
        maxTokens: 900,
      });
      return NextResponse.json({ letter: s(json.letter, 3000) });
    }

    if (action === "linkedin") {
      const { json } = await jsonChat({
        system: COACH,
        prompt: `From this resume, write a LinkedIn headline (under 200 characters: target role, 2-3 key skills, and what they're open to) and an About section (120-180 words, first person, warm and professional: what they do, what they've done with evidence, what they're looking for).${target ? ` They're aiming for: ${target}.` : ""} ${RULES}
RESUME:
${resume}`,
        schema: arr({ headline: { type: "string" }, about: { type: "string" } }, ["headline", "about"]),
        maxTokens: 700,
      });
      return NextResponse.json({ headline: s(json.headline, 220), about: s(json.about, 2000) });
    }

    // questions
    const { json } = await jsonChat({
      system: "You are an experienced interviewer in India.",
      prompt: `List 8 interview questions a ${who(stage)} is likely to be asked for: ${target}${jd ? ` (job post below)` : ""}. Mix role knowledge and skills questions (5) with behavioural questions specific to this role (3). For each, give one sentence on what a good answer covers. Be realistic for an entry-level candidate.${jd ? `\nJOB POST:\n${jd}` : ""}`,
      schema: arr({ questions: { type: "array", items: { type: "object", properties: { q: { type: "string" }, how: { type: "string" } }, required: ["q", "how"] } } }, ["questions"]),
      maxTokens: 1200,
    });
    const qs = (Array.isArray(json.questions) ? json.questions : []).map((x) => ({ q: s((x as { q?: unknown }).q, 250), how: s((x as { how?: unknown }).how, 400) })).filter((x) => x.q).slice(0, 8);
    return NextResponse.json({ questions: qs });
  } catch (e) {
    return fail(e);
  }
}
