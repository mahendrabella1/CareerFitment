/**
 * The ATS check (/account/resume, "ATS check" tab): the things applicant-
 * tracking systems and recruiters screen on, in four weighted areas -
 * readability (can software read the contact details, headings and dates),
 * impact (what the bullets show), sections and length, and - with a job post
 * pasted - the match. Every finding says what to fix; `bulletIssues()` gives
 * the line-by-line notes shown under each bullet; `parsedView()` is what an
 * ATS extracts. Pure - shared by the builder, the plan and the tests.
 */
import { ACTION_VERBS, SECTION_LABEL, allBullets, customSections, dateRange, hasSection, jdKeywords, orderFor, plainText, sectionTitle, skillList, startsWithAction, type Entry, type Resume, type SectionKey, type Stage } from "./resume";
import { roleWords } from "./match";
import { SKILL_WORDS, skillsIn } from "./skills";

export type AtsArea = "parse" | "content" | "sections" | "match";
export type CheckState = "pass" | "warn" | "fail";

export const AREA_META: Record<AtsArea, { label: string; text: string; weight: number }> = {
  parse: { label: "ATS readability", text: "Can screening software read your name, contact details, headings and dates?", weight: 20 },
  content: { label: "Impact", text: "Do your bullet points show what you did and what came of it?", weight: 40 },
  sections: { label: "Sections & length", text: "Are the sections recruiters expect there, filled in, at the right length?", weight: 25 },
  match: { label: "Job match", text: "How closely does the resume match the job post you pasted?", weight: 15 },
};
export const AREAS = Object.keys(AREA_META) as AtsArea[];

export interface AtsCheck {
  id: string;
  area: AtsArea;
  label: string;
  state: CheckState;
  detail: string;
  /** How to fix it (when it isn't a pass). */
  fix?: string;
  /** The lines it's about, quoted. */
  lines?: string[];
}

export interface AtsReport {
  score: number;
  band: "Strong" | "Good" | "Needs work" | "Weak";
  /** Nothing red and at most one small note: fine to send as it is. */
  ready: boolean;
  areas: { area: AtsArea; score: number; issues: number }[];
  checks: AtsCheck[];
  /** With a job post: skills and terms it asks for, found or missing in the resume. */
  keywords: { matched: string[]; missing: string[]; skillsMatched: string[]; skillsMissing: string[] } | null;
}

export interface AtsOptions {
  /** The job post to match against. */
  jd?: string;
  /** The job's title, when known (from "Jobs for you"). */
  jobTitle?: string;
  /** Pages the rendered resume takes, when measured. */
  pages?: number;
}

/* ---------------- line-level rules ---------------- */

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean);
const FIRST_PERSON = /\b(i|me|my|mine|myself)\b/i;
const PLACEHOLDER = /\[[^\]]*\]/;
const PASSIVE = /\b(was|were|been|being|is|are)\s+(\w+ed|built|done|made|given|taken|written|led|run|chosen|seen)\b/i;
const WEAK_OPENER = /^(responsible for|worked on|worked as|worked with|helped|assisted|involved in|participated in|duties (?:included|were)|tasked with|in charge of|part of|did|was|were|handled various|various)\b/i;
export const CLICHES = ["hard-working", "hardworking", "hard working", "team player", "go-getter", "detail-oriented", "detail oriented", "self-motivated", "self motivated", "results-driven", "results driven", "think outside the box", "synergy", "dynamic", "passionate", "motivated individual", "quick learner", "fast learner", "excellent communication skills", "best of breed", "go-to person", "proven track record", "highly motivated", "dedicated professional", "perfectionist"];
/** Present-tense openers that read wrong for a role that has ended. */
const PRESENT = new Set("lead manage build develop create design organise organize handle coordinate conduct analyse analyze write teach support maintain prepare plan run oversee assist help work perform deliver drive".split(" "));
const DATE_FORMS: [RegExp, string][] = [
  [/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.? \d{4}$/i, "Mon YYYY"],
  [/^\d{4}$/, "YYYY"],
  [/^\d{1,2}\/\d{4}$/, "MM/YYYY"],
  [/^(present|current|now|ongoing|till date)$/i, "present"],
];
const ODD_SYMBOLS = /[☀-➿\u{1F300}-\u{1FAFF}★☆✓✔✗➤►▶◆■□●○♦]/u;

const firstWord = (line: string) => line.toLowerCase().replace(/^[^a-z]+/, "").split(/[\s,]/)[0] ?? "";
const ongoing = (e: Entry) => /^(present|current|now|ongoing|till date)$/i.test(e.end.trim()) || !e.end.trim();
export function clichesIn(text: string): string[] {
  const t = ` ${text.toLowerCase().replace(/[^a-z\s-]/g, " ").replace(/\s+/g, " ")} `;
  return CLICHES.filter((c) => t.includes(` ${c} `));
}

/** What a recruiter would flag on one bullet line (empty = it's fine). */
export function bulletIssues(line: string, opts: { ongoing?: boolean; wantNumber?: boolean } = {}): string[] {
  const t = line.trim();
  if (!t) return [];
  const out: string[] = [];
  const w = words(t).length;
  if (WEAK_OPENER.test(t)) out.push(`Weak opening ("${t.split(/\s+/).slice(0, 2).join(" ")}...") - lead with what you did: Built, Organised, Analysed, Led.`);
  else if (!startsWithAction(t)) out.push("Start with an action verb (Built, Led, Improved, Organised...).");
  if (!opts.ongoing && PRESENT.has(firstWord(t))) out.push(`This role has ended - use the past tense ("${firstWord(t)}" → past form).`);
  if (opts.wantNumber && !/\d/.test(t)) out.push("Add a number if one is true - how many, how much, how often or %.");
  if (w > 30) out.push(`${w} words - split it or cut to under 30.`);
  else if (w < 6) out.push("Too short to show impact - say what came of it.");
  if (FIRST_PERSON.test(t)) out.push('Drop "I"/"my" - "Led a team", not "I led a team".');
  if (PASSIVE.test(t)) out.push("Passive voice - say who did it.");
  if (PLACEHOLDER.test(t)) out.push("Fill in the [bracket] with your real figure, or delete it.");
  const cl = clichesIn(t);
  if (cl.length) out.push(`"${cl[0]}" is a cliché - show it with an example instead.`);
  return out;
}

/* ---------------- the report ---------------- */

export function atsReport(r: Resume, stage: Stage, opts: AtsOptions = {}): AtsReport {
  const checks: AtsCheck[] = [];
  const add = (c: AtsCheck) => checks.push(c);
  const ok = (state: boolean, warn = false): CheckState => (state ? "pass" : warn ? "warn" : "fail");
  const c = r.contact;

  // ---- readability ----
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim());
  const phoneOk = c.phone.replace(/\D/g, "").length >= 10;
  add({ id: "name", area: "parse", label: "Name at the top", state: ok(!!c.name.trim()), detail: c.name.trim() ? `"${c.name.trim()}" is the first line, where an ATS looks for it.` : "No name yet.", fix: "Add your full name as it appears on your documents." });
  add({ id: "email", area: "parse", label: "Email", state: ok(emailOk), detail: emailOk ? "A valid email an ATS can pick up." : c.email.trim() ? "That email doesn't look complete." : "No email yet.", fix: "Use a simple, professional address - ideally firstname.lastname@..." });
  add({ id: "phone", area: "parse", label: "Phone", state: ok(phoneOk), detail: phoneOk ? "A full phone number." : "Add a 10-digit mobile number.", fix: "Write it with the country code: +91 98765 43210." });
  add({ id: "location", area: "parse", label: "Location", state: ok(!!c.city.trim(), true), detail: c.city.trim() ? `${c.city.trim()} - recruiters filter by location.` : "No city - many recruiters filter candidates by location.", fix: "Add your city (and state, if it's a small town)." });
  if (stage !== "school") {
    const li = c.linkedin.trim();
    const liOk = /linkedin\.com\/in\/[^/\s]+/i.test(li);
    add({ id: "linkedin", area: "parse", label: "LinkedIn", state: ok(liOk, true), detail: liOk ? "A LinkedIn profile link." : li ? "That doesn't look like a profile link (linkedin.com/in/your-name)." : "No LinkedIn - most recruiters check it.", fix: "Add your profile link: linkedin.com/in/your-name." });
  }
  const dated = [...r.experience, ...r.projects, ...r.education].filter((e) => e.title.trim() || e.org.trim());
  const dates = dated.flatMap((e) => [e.start, e.end]).map((d) => d.trim()).filter(Boolean);
  const forms = new Set(dates.map((d) => DATE_FORMS.find(([re]) => re.test(d))?.[1] ?? "other").filter((f) => f !== "present"));
  const undated = r.experience.filter((e) => (e.title.trim() || e.org.trim()) && !e.start.trim()).map((e) => e.title || e.org);
  add({
    id: "dates", area: "parse", label: "Dates an ATS can read", state: forms.has("other") || forms.size > 1 || undated.length ? "warn" : "pass",
    detail: forms.has("other") ? "Some dates aren't in a format an ATS reads reliably." : forms.size > 1 ? "Dates are written in more than one way." : undated.length ? `${undated.length} experience entr${undated.length === 1 ? "y has" : "ies have"} no start date.` : dates.length ? "Every date is written one way." : "No dates yet.",
    fix: 'Write every date as "Jun 2025" (or "2025"), and "Present" for now.', lines: undated.length ? undated : undefined,
  });
  const symbolLines = [r.summary, ...allBullets(r), ...r.achievements, ...r.activities].filter((t) => ODD_SYMBOLS.test(t));
  add({ id: "symbols", area: "parse", label: "Plain characters", state: ok(!symbolLines.length, true), detail: symbolLines.length ? `${symbolLines.length} line${symbolLines.length === 1 ? " has" : "s have"} emojis or symbols an ATS may garble.` : "No emojis or decorative symbols.", fix: "Remove emojis, stars and arrows - the bullet points are added for you.", lines: symbolLines.slice(0, 3) });
  add({ id: "layout", area: "parse", label: "Layout", state: "pass", detail: "One column, standard section headings, real text in the PDF - no tables, text boxes, photos or icons." });

  // ---- impact ----
  const roles = [...r.experience, ...r.projects].filter((e) => e.title.trim() || e.org.trim());
  const bulletsOf = (e: Entry) => e.bullets.map((b) => b.trim()).filter(Boolean);
  const workBullets = roles.flatMap(bulletsOf);
  const bullets = allBullets(r);
  if (!bullets.length) {
    add({ id: "bullets", area: "content", label: "Bullet points", state: "fail", detail: "No bullet points yet - they're what recruiters read most.", fix: "Add 2-4 bullets under each experience, project or class: what you did and what came of it." });
  } else {
    const weak = bullets.filter((b) => WEAK_OPENER.test(b));
    const noVerb = bullets.filter((b) => !startsWithAction(b) && !WEAK_OPENER.test(b));
    const share = 1 - (weak.length + noVerb.length) / bullets.length;
    add({ id: "verbs", area: "content", label: "Strong action verbs", state: share >= 0.8 ? "pass" : share >= 0.6 ? "warn" : "fail", detail: `${Math.round(share * 100)}% of bullets open with an action verb.`, fix: "Open every bullet with a verb that says what you did: Built, Led, Organised, Analysed, Improved.", lines: [...weak, ...noVerb].slice(0, 4) });
    if (weak.length) add({ id: "weak", area: "content", label: "No weak openings", state: "warn", detail: `${weak.length} bullet${weak.length === 1 ? " starts" : "s start"} with "responsible for", "worked on", "helped" or similar - they describe duties, not results.`, fix: 'Rewrite as an action and its result: "Responsible for social media" → "Grew the club\'s Instagram from 300 to 1,200 followers".', lines: weak.slice(0, 4) });
    const nums = workBullets.filter((b) => /\d/.test(b)).length;
    const nShare = workBullets.length ? nums / workBullets.length : 0;
    if (workBullets.length) add({ id: "numbers", area: "content", label: "Measurable results", state: nShare >= 0.4 ? "pass" : nShare >= 0.2 ? "warn" : "fail", detail: `${nums} of ${workBullets.length} experience and project bullets include a number.`, fix: 'Add true numbers: how many people, how much money or time, how often, by what %, what rank ("for 120 students", "cut 2 days to 2 hours", "top 5 of 40").', lines: workBullets.filter((b) => !/\d/.test(b)).slice(0, 3) });
    const long = bullets.filter((b) => words(b).length > 30);
    add({ id: "length-bullets", area: "content", label: "Concise bullets", state: ok(!long.length, true), detail: long.length ? `${long.length} bullet${long.length === 1 ? " is" : "s are"} over 30 words.` : "Every bullet is under 30 words.", fix: "Keep each bullet to one line or two - split long ones.", lines: long.slice(0, 3) });
    const counts = new Map<string, number>();
    for (const b of bullets) if (startsWithAction(b)) counts.set(firstWord(b), (counts.get(firstWord(b)) ?? 0) + 1);
    const repeats = [...counts.entries()].filter(([, n]) => n > 2).map(([v, n]) => `"${v[0].toUpperCase()}${v.slice(1)}" ×${n}`);
    add({ id: "variety", area: "content", label: "Varied verbs", state: ok(!repeats.length, true), detail: repeats.length ? `Repeated: ${repeats.join(", ")}.` : "No verb is used more than twice.", fix: "Swap repeats for precise verbs: Organised → Coordinated, Planned, Arranged; Made → Built, Designed, Produced." });
    const pastRoles = r.experience.filter((e) => !ongoing(e));
    const tenseLines = pastRoles.flatMap(bulletsOf).filter((b) => PRESENT.has(firstWord(b)));
    add({ id: "tense", area: "content", label: "Consistent tense", state: ok(!tenseLines.length, true), detail: tenseLines.length ? "Some bullets for roles that have ended are in the present tense." : "Past roles are written in the past tense.", fix: 'Use the past tense for finished roles ("Led", "Built") and the present for your current one.', lines: tenseLines.slice(0, 3) });
    const passive = bullets.filter((b) => PASSIVE.test(b));
    if (passive.length) add({ id: "passive", area: "content", label: "Active voice", state: "warn", detail: `${passive.length} bullet${passive.length === 1 ? " uses" : "s use"} the passive voice.`, fix: '"The report was prepared by me" → "Prepared the monthly report".', lines: passive.slice(0, 3) });
  }
  const textLines = [r.summary, ...bullets].filter(Boolean);
  const fp = textLines.filter((t) => FIRST_PERSON.test(t));
  add({ id: "person", area: "content", label: 'No "I" or "my"', state: ok(!fp.length, true), detail: fp.length ? `${fp.length} line${fp.length === 1 ? " uses" : "s use"} I/my.` : "Written without I/my, as resumes are.", fix: 'Drop the pronoun: "I led a team of 5" → "Led a team of 5".', lines: fp.slice(0, 3) });
  const cl = [...new Set(textLines.flatMap(clichesIn))];
  add({ id: "cliches", area: "content", label: "No clichés", state: ok(!cl.length, true), detail: cl.length ? `Found: ${cl.map((x) => `"${x}"`).join(", ")} - recruiters skip these.` : "No overused buzzwords.", fix: 'Show the quality instead: "hard-working" → "Balanced a part-time job with an 8.4 CGPA".' });
  const ph = textLines.filter((t) => PLACEHOLDER.test(t));
  if (ph.length) add({ id: "placeholders", area: "content", label: "Placeholders filled in", state: "fail", detail: `${ph.length} line${ph.length === 1 ? " still has" : "s still have"} a [bracket] from the AI suggestions.`, fix: "Replace each [bracket] with your real figure, or delete it.", lines: ph.slice(0, 3) });

  // ---- sections & length ----
  const sw = words(r.summary).length;
  add({ id: "summary", area: "sections", label: "Summary", state: sw >= 25 && sw <= 80 ? "pass" : "warn", detail: sw === 0 ? "No summary - it's the first thing a recruiter reads." : sw < 25 ? `Only ${sw} words.` : sw > 80 ? `${sw} words - recruiters skim.` : `${sw} words - a good length.`, fix: "2-3 lines (25-80 words): who you are, your strongest skills with proof, and the role you want." });
  const need: SectionKey[] = stage === "professional" ? ["experience", "skills", "education"] : stage === "college" ? ["education", "skills"] : ["education", "skills"];
  const missing = need.filter((k) => !hasSection(r, k));
  const proof = stage === "college" && !hasSection(r, "experience") && !hasSection(r, "projects");
  const schoolProof = stage === "school" && !hasSection(r, "achievements") && !hasSection(r, "activities") && !hasSection(r, "projects");
  add({ id: "sections", area: "sections", label: "Key sections", state: missing.length ? "fail" : proof || schoolProof ? "warn" : "pass", detail: missing.length ? `Missing: ${missing.map((k) => sectionTitle(k, stage)).join(", ")}.` : proof ? "No internship or project yet." : schoolProof ? "No achievements, activities or projects yet." : "The sections recruiters look for are there.", fix: proof ? "Add at least one project or internship - it's what shows you can do the work." : schoolProof ? "Add an achievement, an activity or a project - they show who you are beyond marks." : "Fill in the missing sections." });
  const thin = roles.filter((e) => bulletsOf(e).length < 2).map((e) => e.title || e.org);
  const heavy = roles.filter((e) => bulletsOf(e).length > 6).map((e) => e.title || e.org);
  if (roles.length) add({ id: "per-role", area: "sections", label: "Bullets per entry", state: ok(!thin.length && !heavy.length, true), detail: thin.length ? `${thin.length} entr${thin.length === 1 ? "y has" : "ies have"} fewer than 2 bullets.` : heavy.length ? `${heavy.length} entr${heavy.length === 1 ? "y has" : "ies have"} more than 6 bullets.` : "Every experience and project has 2-6 bullets.", fix: "Aim for 2-4 bullets per entry (up to 6 for your most important role).", lines: [...thin, ...heavy].slice(0, 4) });
  const edu = r.education.filter((e) => e.title.trim() || e.org.trim());
  const eduGaps = edu.filter((e) => !e.title.trim() || !e.org.trim() || !e.end.trim()).map((e) => e.title || e.org);
  add({ id: "education", area: "sections", label: "Education details", state: edu.length ? ok(!eduGaps.length, true) : "fail", detail: !edu.length ? "No education yet." : eduGaps.length ? "Some education entries are missing the degree/class, the institution or the year." : "Degree, institution and year are all there.", fix: "Give each: degree or class, institution, year of completion (expected, if still studying), and your score if it helps.", lines: eduGaps.length ? eduGaps : undefined });
  const skills = skillList(r);
  const hard = skills.filter((s) => SKILL_WORDS.includes(s.toLowerCase()) || skillsIn(s).length);
  add({ id: "skills", area: "sections", label: "Skills", state: skills.length >= 6 && hard.length >= 3 ? "pass" : skills.length >= 4 ? "warn" : "fail", detail: `${skills.length} skills, ${hard.length} of them hard skills an ATS searches for.`, fix: "List 6-12 skills by name - tools, software and subject skills first (Excel, Python, Tally, AutoCAD), then 2-3 working skills." });
  const pages = opts.pages ?? Math.max(1, Math.ceil(words(plainText(r, stage)).length / (stage === "professional" ? 600 : 520)));
  const maxPages = stage === "professional" ? 2 : 1;
  add({ id: "length", area: "sections", label: "Length", state: pages <= maxPages ? "pass" : pages === maxPages + 1 ? "warn" : "fail", detail: `${pages} page${pages === 1 ? "" : "s"}${opts.pages ? "" : " (estimated)"} - ${stage === "professional" ? "up to two" : "one"} is the norm for your stage.`, fix: pages > maxPages ? "Cut older or weaker bullets, shorten the summary, or switch to the Compact template / smaller text." : undefined });

  // ---- job match ----
  let keywords: AtsReport["keywords"] = null;
  const jd = (opts.jd ?? "").trim();
  if (jd.length >= 80) {
    const resumeText = ` ${plainText(r, stage).toLowerCase().replace(/[^a-z0-9+#./\s]/g, " ").replace(/\s+/g, " ")} `;
    const has = (k: string) => resumeText.includes(` ${k} `) || resumeText.includes(` ${k}s `);
    const jdSkills = skillsIn(jd).slice(0, 15);
    const skillsMatched = jdSkills.filter((k) => has(k) || skills.some((s) => s.toLowerCase() === k));
    const skillsMissing = jdSkills.filter((k) => !skillsMatched.includes(k));
    const phrases = jdKeywords(jd, 14).filter((k) => !jdSkills.includes(k));
    const matched = phrases.filter(has);
    keywords = { matched, missing: phrases.filter((k) => !matched.includes(k)), skillsMatched, skillsMissing };
    const sShare = jdSkills.length ? skillsMatched.length / jdSkills.length : 1;
    add({ id: "hard-skills", area: "match", label: "Hard skills from the post", state: sShare >= 0.6 ? "pass" : sShare >= 0.35 ? "warn" : "fail", detail: jdSkills.length ? `${skillsMatched.length} of the ${jdSkills.length} skills the post names appear in your resume.` : "The post doesn't name specific tools or skills.", fix: skillsMissing.length ? `Add the ones you genuinely have, using the post's exact words: ${skillsMissing.slice(0, 6).join(", ")}.` : undefined });
    const pShare = phrases.length ? matched.length / phrases.length : 1;
    add({ id: "terms", area: "match", label: "Terms the post repeats", state: pShare >= 0.5 ? "pass" : pShare >= 0.25 ? "warn" : "fail", detail: `${matched.length} of ${phrases.length} repeated terms appear.`, fix: "Mirror the post's wording in your summary and bullets where it's true for you." });
    const title = (opts.jobTitle || jd.split("\n")[0] || "").slice(0, 120);
    const tw = roleWords(title).slice(0, 4);
    if (tw.length) {
      const mine = ` ${[r.target, r.summary, ...r.experience.map((e) => e.title)].join(" ").toLowerCase()} `;
      const hits = tw.filter((w) => mine.includes(` ${w}`)).length;
      add({ id: "title", area: "match", label: "Job title", state: hits === tw.length ? "pass" : hits ? "warn" : "fail", detail: hits === tw.length ? `Your resume uses the job title ("${title.trim()}").` : `Recruiters search by title - "${title.trim()}" isn't fully in your target role or summary.`, fix: "Put the job's exact title in your target role and summary (if it fits you)." });
    }
  }

  // ---- score ----
  const pts = (s: CheckState) => (s === "pass" ? 1 : s === "warn" ? 0.5 : 0);
  const areas = AREAS.map((area) => {
    const list = checks.filter((x) => x.area === area);
    return { area, score: list.length ? Math.round((list.reduce((s, x) => s + pts(x.state), 0) / list.length) * 100) : -1, issues: list.filter((x) => x.state !== "pass").length };
  }).filter((a) => a.score >= 0);
  const wsum = areas.reduce((s, a) => s + AREA_META[a.area].weight, 0);
  const score = Math.round(areas.reduce((s, a) => s + a.score * AREA_META[a.area].weight, 0) / wsum);
  return { score, band: score >= 90 ? "Strong" : score >= 75 ? "Good" : score >= 55 ? "Needs work" : "Weak", areas, checks, keywords, ready: !checks.some((x) => x.state === "fail") && checks.filter((x) => x.state === "warn").length <= 1 && score >= 90 };
}

/* ---------------- what an ATS reads ---------------- */

export interface ParsedView {
  name: string; email: string; phone: string; location: string; links: string[];
  sections: string[];
  jobs: { title: string; org: string; dates: string }[];
  education: { degree: string; school: string; dates: string; score: string }[];
  skills: string[];
  hardSkills: string[];
}

/** The fields an applicant-tracking system pulls out of this resume. */
export function parsedView(r: Resume, stage: Stage): ParsedView {
  const skills = skillList(r);
  return {
    name: r.contact.name.trim(), email: r.contact.email.trim(), phone: r.contact.phone.trim(), location: r.contact.city.trim(),
    links: [r.contact.linkedin, r.contact.link].map((x) => x.trim()).filter(Boolean),
    sections: [...orderFor(r, stage).filter((k) => hasSection(r, k)).map((k) => sectionTitle(k, stage)), ...customSections(r).map((c) => c.title)],
    jobs: r.experience.filter((e) => e.title.trim() || e.org.trim()).map((e) => ({ title: e.title.trim(), org: e.org.trim(), dates: dateRange(e) })),
    education: r.education.filter((e) => e.title.trim() || e.org.trim()).map((e) => ({ degree: e.title.trim(), school: e.org.trim(), dates: dateRange(e), score: (e.score ?? "").trim() })),
    skills,
    hardSkills: skills.filter((s) => SKILL_WORDS.includes(s.toLowerCase()) || skillsIn(s).length > 0),
  };
}

export { ACTION_VERBS, SECTION_LABEL };
