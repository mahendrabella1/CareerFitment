"use client";
/**
 * /account/ai - AI & Certifications home, for every class: the hero, the
 * first certificate everyone should get (YUVA AI for All), the four-level
 * ladder with the courses that suit the learner's class, AI tools allowed at
 * their age, and the five rules for using AI.
 */
import { useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { recordVisit } from "@/lib/progress/progressStore";
import { COURSES, LEVELS, RULES, TOOLS, coursesFor, toolsFor } from "@/lib/ai/catalog";
import { FeatureHero } from "@/components/feature/FeatureHero";
import type { SearchItem } from "@/components/feature/FeatureSearch";
import { AiShell, CourseRow, useLearner } from "@/components/ai/AiParts";

export default function AiHome() {
  return <AiShell><Home /></AiShell>;
}

function Home() {
  const meta = FEATURES.ai;
  const learner = useLearner();
  const courses = useMemo(() => coursesFor(learner.group), [learner.group]);
  const tools = useMemo(() => toolsFor(learner.band), [learner.band]);
  // The six shown here: the ones made for the learner's own age first.
  const picks = useMemo(() => [...tools].sort((a, b) => Number(b.band === learner.band) - Number(a.band === learner.band)).slice(0, 6), [tools, learner.band]);
  const first = COURSES.find((c) => c.slug === "yuva-ai-for-all")!;

  const open = (url: string, path: string) => { recordVisit("ai", path); window.open(url, "_blank", "noopener"); };
  const search = useMemo<SearchItem[]>(() => [
    ...courses.map((c) => ({ label: c.name, kind: "Free course", hint: c.provider, keywords: c.why, onSelect: () => open(c.url, `/account/ai/courses/${c.slug}`) })),
    ...tools.map((t) => ({ label: t.name, kind: "AI tool", hint: t.what, href: `/account/ai/tools#${t.slug}` })),
    { label: "Use AI safely", kind: "Guide", hint: "Five rules, schoolwork, deepfakes and scams", href: "/account/ai/safety" },
  ], [courses, tools]);

  return (
    <>
      <FeatureHero
        meta={meta}
        search={search}
        placeholder={`Search ${courses.length} free courses and ${tools.length} AI tools`}
        popular={[
          { label: "YUVA AI for All", onClick: () => open(first.url, `/account/ai/courses/${first.slug}`) },
          { label: "Kaggle Learn", href: "/account/ai/courses#kaggle-python" },
          { label: learner.band === "kids" ? "Teachable Machine" : "Gemini Notebook", href: `/account/ai/tools#${learner.band === "kids" ? "teachable-machine" : "gemini-notebook"}` },
        ]}
        primary={{ label: "Browse free courses", href: "/account/ai/courses" }}
        secondary={{ label: "AI tools for you", href: "/account/ai/tools" }}
        stats={[
          { value: courses.length, label: learner.group ? `free certificate courses for ${learner.label}` : "free certificate courses" },
          { value: tools.length, label: learner.band === "adult" ? "AI tools, rated" : "AI tools allowed at your age" },
          { value: "₹0", label: "for every course and certificate" },
          { value: 4, label: "levels, from Aware to Builder" },
        ]}
      />

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Your first AI certificate</h2><p>Start here, whatever your class - it&apos;s the Government of India&apos;s own course.</p></div></div>
        <div className="ai-list"><CourseRow c={first} /></div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h">
          <div><h2>Your path, level by level</h2><p>{learner.group ? `Courses that suit ${learner.label}. ` : ""}Everyone starts with AI Aware; climb as far as you want.</p></div>
          <Link href="/account/ai/courses" className="fp-link">All free courses <Icon name="arrowRight" size={15} stroke={2} /></Link>
        </div>
        <div className="ai-ladder">
          {LEVELS.map((l) => {
            const list = courses.filter((c) => c.level === l.level);
            return (
              <div key={l.level} className={`ai-step${list.length ? "" : " is-later"}`}>
                <span className="ai-step-n">Level {l.level}</span>
                <h3>{l.name}</h3>
                <p>{l.text}</p>
                {list.length ? (
                  <ul>
                    {list.slice(0, 3).map((c) => (
                      <li key={c.slug}><Link href={`/account/ai/courses#${c.slug}`}>{c.name}<small>{c.provider.replace(/\s*\(.*\)$/, "")}</small></Link></li>
                    ))}
                    {list.length > 3 && <li><Link href={`/account/ai/courses?level=${l.level}`} className="ai-more">+{list.length - 3} more</Link></li>}
                  </ul>
                ) : <small className="ai-later">For older learners - it opens up as you move up a class.</small>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h">
          <div><h2>AI tools {learner.band === "adult" ? "worth knowing" : "allowed at your age"}</h2><p>Each one has a rating card: age, privacy, what&apos;s free, and tips to use it well.</p></div>
          <Link href="/account/ai/tools" className="fp-link">All {tools.length} tools <Icon name="arrowRight" size={15} stroke={2} /></Link>
        </div>
        <div className="ai-mini">
          {picks.map((t) => (
            <Link key={t.slug} href={`/account/ai/tools#${t.slug}`} className="ai-mini-t">
              <b>{t.name}</b><small>{t.what}</small>
            </Link>
          ))}
        </div>
        {tools.length < TOOLS.length && <p className="fp-muted" style={{ marginTop: 10 }}>{TOOLS.length - tools.length} more tools are for older learners.</p>}
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h">
          <div><h2>Five rules for using AI</h2><p>They come with every course and tool here.</p></div>
          <Link href="/account/ai/safety" className="fp-link">Use AI safely <Icon name="arrowRight" size={15} stroke={2} /></Link>
        </div>
        <div className="ai-rules">
          {RULES.map((r, i) => <div key={r.title} className="ai-rule"><i>{i + 1}</i><b>{r.title}</b><p>{learner.band === "kids" ? r.kids : r.text}</p></div>)}
        </div>
      </section>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />
    </>
  );
}

const HOME_CSS = `
.ai-ladder{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.ai-step{display:flex;flex-direction:column;padding:16px;background:#fff;border:1px solid var(--line);border-top:3px solid var(--accent);border-radius:8px}
.ai-step.is-later{border-top-color:var(--line2);background:#fcfbf9}
.ai-step-n{font-size:11.5px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--accent)}
.ai-step.is-later .ai-step-n{color:var(--mute)}
.ai-step h3{font-size:17px;font-weight:600;margin:4px 0 6px}
.ai-step p{margin:0 0 12px;font-size:13.5px;line-height:1.5;color:var(--ink2)}
.ai-step ul{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.ai-step li a{display:block;padding:8px 10px;border:1px solid var(--line);border-radius:6px;text-decoration:none;color:var(--ink);font-size:13.5px;font-weight:600;line-height:1.35}
.ai-step li a:hover{border-color:var(--accent)}
.ai-step li small{display:block;font-weight:400;font-size:12px;color:var(--mute)}
.ai-step li a.ai-more{border-style:dashed;color:var(--ink2);font-weight:600}
.ai-later{margin-top:auto;font-size:12.5px;color:var(--mute)}
.ai-mini{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:10px}
.ai-mini-t{display:block;padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--ink)}
.ai-mini-t:hover{border-color:var(--accent)}
.ai-mini-t b{display:block;font-size:15px;font-weight:600}
.ai-mini-t small{display:block;margin-top:3px;font-size:13px;line-height:1.45;color:var(--ink2)}
@media (max-width:1000px){.ai-ladder{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:560px){.ai-ladder{grid-template-columns:minmax(0,1fr)}}
`;
