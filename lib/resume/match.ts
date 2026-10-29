/**
 * Jobs that fit a resume: scores live job-portal listings against the
 * student's target role and skills (pure - the route reads the listings,
 * the tests feed fixed ones). The score is a guide for where to apply first,
 * not a prediction: role words in the title count most, then how many of
 * the student's skills the post mentions, then whether it suits their stage.
 */
import type { Stage } from "./resume";
import { skillsIn } from "./skills";

export interface MatchInput {
  target: string;
  skills: string[];
  stage: Stage;
}

export interface JobLike {
  id: string;
  title: string;
  company: string;
  description?: string | null;
  employment_type?: string | null;
  experience_hint?: string | null;
  is_fresher?: boolean;
  role_match?: string | null;
}

export interface JobFit {
  score: number;
  /** The student's skills the post mentions. */
  have: string[];
  /** Terms the post repeats that the resume doesn't show. */
  gaps: string[];
}

const ROLE_STOP = new Set("and or of the a an in for to with junior senior intern internship trainee associate assistant executive fresher graduate entry level remote hybrid part full time job role".split(" "));

export const norm = (s: string) => ` ${s.toLowerCase().replace(/\.(?![a-z0-9])/g, " ").replace(/[^a-z0-9+#.]+/g, " ").replace(/\s+/g, " ").trim()} `;
export const roleWords = (s: string) => norm(s).trim().split(" ").filter((w) => w.length > 1 && !ROLE_STOP.has(w));
const has = (text: string, term: string) => { const t = norm(term).trim(); return !!t && text.includes(` ${t} `); };

export function fitJob(job: JobLike, input: MatchInput): JobFit {
  const title = norm(job.title);
  const text = norm(`${job.title} ${job.role_match ?? ""} ${job.description ?? ""}`);
  const want = roleWords(input.target);
  const titleHits = want.filter((w) => title.includes(` ${w} `) || title.includes(` ${w}s `)).length;
  const roleScore = want.length ? titleHits / want.length : 0;

  const skills = [...new Set(input.skills.map((s) => s.trim()).filter(Boolean))];
  const have = skills.filter((s) => has(text, s));
  const skillScore = skills.length ? Math.min(1, have.length / Math.min(skills.length, 6)) : 0;

  const junior = job.is_fresher || job.employment_type === "Internship" || job.experience_hint === "internship" || job.experience_hint === "entry" || /\b(intern|internship|trainee|fresher|graduate|new grad|entry level|junior)\b/i.test(job.title);
  const senior = job.experience_hint === "senior" || SENIOR.test(job.title);
  const stageScore = input.stage === "professional" ? (senior ? 1 : 0.7) : junior ? 1 : senior ? 0 : 0.5;

  // Gaps: real skills the post asks for that the resume doesn't list.
  const mine = norm(`${input.target} ${skills.join(" ")}`);
  const gaps = skillsIn(`${job.title} ${job.description ?? ""}`).filter((k) => !mine.includes(norm(k))).slice(0, 5);
  let score = 0.5 * roleScore + 0.35 * skillScore + 0.15 * stageScore;
  // A senior post is rarely a realistic first application for a student.
  if (senior && input.stage !== "professional") score *= 0.55;
  return { score: Math.round(score * 100), have, gaps };
}

const SENIOR = /\b(senior|sr\.?|lead|principal|staff|head of|director|vp|vice president|chief)\b/i;

/** Websearch query for the job portal's full-text index: the role, or the top skills. */
export function searchTerms(input: MatchInput): { role: string | null; skills: string | null } {
  const role = roleWords(input.target).slice(0, 4);
  const q = (t: string) => (/\s/.test(t) ? `"${t.replace(/"/g, "")}"` : t.replace(/"/g, ""));
  const skills = input.skills.map((s) => s.trim().toLowerCase()).filter((s) => s.length > 1 && s.length < 30).slice(0, 8);
  return { role: role.length ? role.map(q).join(" or ") : null, skills: skills.length ? skills.map(q).join(" or ") : null };
}
