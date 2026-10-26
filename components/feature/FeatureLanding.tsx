"use client";
/**
 * The home page of a lesson-based feature section (Money, Legal, Exams,
 * Scholarships, Study Abroad, Research). The hero, search and tour are the
 * same everywhere; the body below takes the shape that suits the section
 * (lib/features/catalog.ts -> layout):
 *
 *   path       Money        - a level path of modules, then a shelf of games and labs
 *   course     Research     - a course page: what you'll learn, the curriculum, a sticky progress card
 *   helpdesk   Legal        - "what happened?" first, helplines, a guide index, tools
 *   catalogue  Exams, Scholarships - a searchable directory, tools, then the guides
 *   board      Study Abroad - the decision as columns, left to right
 *
 * Lessons open in LessonDrawer; ticking them off is saved as before
 * (progress.courses.<key>), so My Progress and the institution portal see it.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import type { CourseContent } from "@/lib/course/types";
import type { CourseNavGroup, CourseNavItem, FeatureCourse } from "@/lib/course/featureCourses";
import { FEATURES, type FeatureMeta } from "@/lib/features/catalog";
import { HELP_CONTACTS } from "@/data/legal/helpContacts";
import { useFeatureCourse } from "@/components/course/FeatureCourseLayout";
import { FeatureHero } from "./FeatureHero";
import type { SearchItem } from "./FeatureSearch";
import { LessonDrawer, useCourseProgress, type CourseProgressApi } from "./LessonDrawer";

interface Part extends CourseNavGroup { href?: string }

/** The parts of a section with their own way in; index pages ("All labs") become the part's link. */
function partsOf(course: FeatureCourse | null): Part[] {
  if (!course) return [];
  return course.groups.map((g) => {
    const live = g.items.filter((i) => !i.planned && i.href !== course.home);
    const isIndex = (i: CourseNavItem) => live.some((o) => o !== i && o.href.startsWith(`${i.href}/`));
    const items = live.filter((i) => !isIndex(i));
    return { ...g, items, href: g.href ?? live.find(isIndex)?.href ?? items[0]?.href };
  }).filter((g) => g.items.length > 0);
}

interface BodyProps {
  meta: FeatureMeta;
  content: CourseContent;
  parts: Part[];
  progress: CourseProgressApi;
  open: (lessonId: string) => void;
  topSlot?: ReactNode;
}

export function FeatureLanding({ content, topSlot, afterBar }: { content: CourseContent; topSlot?: ReactNode; afterBar?: boolean }) {
  const course = useFeatureCourse();
  const meta = FEATURES[content.key];
  const progress = useCourseProgress(content);
  const [lesson, setLesson] = useState<string | null>(null);
  const parts = useMemo(() => partsOf(course), [course]);

  // ?lesson=<id> opens that lesson (My Progress links straight to the next one).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("lesson");
    if (id && content.modules.some((m) => m.lessons.some((l) => l.id === id))) setLesson(id);
  }, [content]);

  const search = useMemo<SearchItem[]>(() => [
    ...parts.flatMap((g) => g.items.map((i) => ({ label: i.label, kind: g.title, hint: i.meta, href: i.href }))),
    ...progress.lessons.map((x) => ({ label: x.lesson.title, kind: "Lesson", hint: x.module.title, keywords: x.lesson.summary, onSelect: () => setLesson(x.lesson.id) })),
  ], [parts, progress.lessons]);

  const tools = parts.reduce((n, g) => n + g.items.length, 0);
  const Body = { path: PathBody, course: CourseBody, helpdesk: HelpdeskBody, catalogue: CatalogueBody, board: BoardBody }[meta.layout as "path"] ?? CourseBody;

  return (
    <div className="fp" style={{ ["--accent" as string]: meta.accent }}>
      <div style={afterBar ? { marginTop: 42 } : undefined}>
        <FeatureHero
          meta={meta}
          search={search}
          placeholder={`Search ${progress.total} lessons and ${tools} tools`}
          popular={parts.slice(0, 4).map((g) => ({ label: g.items[0].label, href: g.items[0].href }))}
          primary={course ? { label: course.start.label, href: course.start.href } : progress.next ? { label: "Start the first lesson", onClick: () => setLesson(progress.next!.lesson.id) } : undefined}
          secondary={course?.secondary}
          stats={[
            { value: progress.total, label: "short lessons" },
            { value: `${progress.minutes} min`, label: "to read them all" },
            { value: tools, label: "tools, games and pages" },
            { value: `${progress.percent}%`, label: progress.completed ? `done - ${progress.completed} of ${progress.total} lessons` : "done - start any lesson" },
          ]}
        />
      </div>
      <Body meta={meta} content={content} parts={parts} progress={progress} open={setLesson} topSlot={topSlot} />
      {lesson && <LessonDrawer lessonId={lesson} progress={progress} onGo={setLesson} onClose={() => setLesson(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ shared pieces */

function SectionHead({ title, note, right }: { title: string; note?: string; right?: ReactNode }) {
  return (
    <div className="fp-sec-h">
      <div><h2>{title}</h2>{note && <p>{note}</p>}</div>
      {right}
    </div>
  );
}

function Chevron() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

/** Modules and lessons, like a course's "Course content" list. */
export function Curriculum({ content, progress, open, startOpen = 1 }: { content: CourseContent; progress: CourseProgressApi; open: (id: string) => void; startOpen?: number }) {
  const upTo = content.modules.findIndex((m) => progress.moduleDone(m) < m.lessons.length);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(content.modules.slice(Math.max(0, upTo), Math.max(0, upTo) + startOpen).map((m) => m.id)));
  const all = expanded.size === content.modules.length;
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <span className="fp-muted">{content.modules.length} modules · {progress.total} lessons · {progress.minutes} min total</span>
        <button className="fp-link" style={{ fontSize: 13 }} onClick={() => setExpanded(all ? new Set() : new Set(content.modules.map((m) => m.id)))}>{all ? "Collapse all" : "Expand all"}</button>
      </div>
      <div className="fp-curr">
        {content.modules.map((m, mi) => {
          const isOpen = expanded.has(m.id);
          const done = progress.moduleDone(m);
          const mins = m.lessons.reduce((s, l) => s + l.minutes, 0);
          return (
            <div key={m.id} className="fp-mod">
              <button className="fp-mod-h" aria-expanded={isOpen} onClick={() => setExpanded((s) => { const n = new Set(s); if (n.has(m.id)) n.delete(m.id); else n.add(m.id); return n; })}>
                <Chevron />
                <span style={{ minWidth: 0 }}><b>{mi + 1}. {m.title}</b><small>{m.summary}</small></span>
                <small style={{ whiteSpace: "nowrap" }}>{done}/{m.lessons.length} · {mins} min</small>
              </button>
              {isOpen && m.lessons.map((l) => {
                const isDone = progress.doneSet.has(l.id);
                return (
                  <button key={l.id} className="fp-les" onClick={() => open(l.id)}>
                    <span className={`fp-tick${isDone ? " is-done" : ""}`} aria-label={isDone ? "Done" : "Not done"}>{isDone ? "✓" : ""}</span>
                    <span>{l.title}</span>
                    <small>{l.minutes} min</small>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}

function ToolGrid({ items }: { items: (CourseNavItem & { group?: string; icon?: string })[] }) {
  return (
    <div className="fp-tools">
      {items.map((i) => (
        <Link key={i.href} href={i.href} className="fp-tool">
          <span className="fp-ic"><Icon name={i.icon ?? "arrowRight"} size={19} stroke={1.8} /></span>
          <span style={{ minWidth: 0 }}><b>{i.label}</b>{(i.meta || i.group) && <small>{i.meta ?? i.group}</small>}</span>
        </Link>
      ))}
    </div>
  );
}

function ProgressCard({ progress, open }: { progress: CourseProgressApi; open: (id: string) => void }) {
  return (
    <div className="fp-card" style={{ padding: 20 }}>
      <span className="fp-kicker">Your progress</span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "6px 0 10px" }}>
        <b className="fp-display" style={{ fontSize: 34, fontWeight: 700 }}>{progress.percent}%</b>
        <span className="fp-muted">{progress.completed} of {progress.total} lessons</span>
      </div>
      <div className="fp-bar"><i style={{ width: `${progress.percent}%` }} /></div>
      {progress.next ? (
        <button className="fp-btn fp-btn-pri" style={{ width: "100%", marginTop: 16 }} onClick={() => open(progress.next!.lesson.id)}>
          {progress.completed ? "Continue" : "Start"}: {progress.next.lesson.title.length > 26 ? `${progress.next.lesson.title.slice(0, 25)}…` : progress.next.lesson.title}
        </button>
      ) : <p style={{ margin: "14px 0 0", fontSize: 14, fontWeight: 600, color: "var(--ok)" }}>Every lesson done.</p>}
      <Link href="/account/progress" className="fp-link" style={{ fontSize: 13, marginTop: 12 }}>See all my progress <Icon name="arrowRight" size={14} stroke={2} /></Link>
    </div>
  );
}

/* ------------------------------------------------------------------ path (Money) */

function PathBody({ content, parts, progress, open, topSlot }: BodyProps) {
  const statusOf = (i: number) => {
    const m = content.modules[i];
    const d = progress.moduleDone(m);
    return d === m.lessons.length ? "done" : d > 0 ? "now" : "todo";
  };
  const nowIndex = Math.max(0, content.modules.findIndex((m) => progress.moduleDone(m) < m.lessons.length));
  const [sel, setSel] = useState(nowIndex);
  const m = content.modules[sel];
  const games = parts.filter((g) => g.title !== "Learn");
  const learn = parts.find((g) => g.title === "Learn");

  return (
    <>
      <section className="fp-sec">
        <SectionHead
          title="Your level path"
          note={progress.next ? `Level ${nowIndex + 1} of ${content.modules.length} - ${progress.total - progress.completed} lessons to go` : "Every level complete."}
          right={learn && <Link href={learn.href!} className="fp-link">{learn.items[0].label} <Icon name="arrowRight" size={15} stroke={2} /></Link>}
        />
        <div className="fp-card" style={{ padding: "34px 20px 18px" }}>
          <div className="fp-path" style={{ ["--n" as string]: content.modules.length }}>
            {content.modules.map((mod, i) => {
              const st = statusOf(i);
              const isNow = i === nowIndex && progress.next;
              return (
                <button key={mod.id} className={`fp-stop is-${isNow ? "now" : st}`} aria-pressed={sel === i} onClick={() => setSel(i)}>
                  <span className="fp-node">{st === "done" ? <Icon name="check" size={24} stroke={2.6} /> : i + 1}</span>
                  <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                    <b>{mod.title}</b>
                    <small>{progress.moduleDone(mod)}/{mod.lessons.length} lessons</small>
                  </span>
                  {isNow && <span className="fp-here">You are here</span>}
                </button>
              );
            })}
          </div>
          <div style={{ borderTop: "1px solid var(--line)", marginTop: 18, paddingTop: 16, display: "grid", gap: 4 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginBottom: 6 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600 }}>Level {sel + 1}: {m.title}</h3>
              <span className="fp-muted">{m.summary}</span>
            </div>
            {m.lessons.map((l) => {
              const isDone = progress.doneSet.has(l.id);
              return (
                <button key={l.id} className="fp-les" style={{ paddingLeft: 0, borderTop: "1px solid #f0ede8" }} onClick={() => open(l.id)}>
                  <span className={`fp-tick${isDone ? " is-done" : ""}`}>{isDone ? "✓" : ""}</span>
                  <span>{l.title}</span>
                  <small>{l.minutes} min</small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {games.length > 0 && (
        <section className="fp-sec">
          <SectionHead title="Play and practise" note="Virtual money only - try anything, nothing is real." />
          <div className="fp-shelf">
            {games.map((g) => (
              <div key={g.title} className="fp-card fp-shelf-c">
                <span className="fp-ic"><Icon name={g.icon ?? "play"} size={20} stroke={1.8} /></span>
                <h3>{g.title}</h3>
                {g.blurb && <span className="fp-muted" style={{ lineHeight: 1.5 }}>{g.blurb}</span>}
                <ul>
                  {g.items.slice(0, 5).map((i) => <li key={i.href}><Link href={i.href}>{i.label}{i.meta && <small>{i.meta}</small>}</Link></li>)}
                </ul>
                <Link href={g.href!} className="fp-btn fp-btn-sm" style={{ alignSelf: "flex-start" }}>{g.cta ?? `Open ${g.title}`}{g.items.length > 5 ? ` (${g.items.length})` : ""}</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {topSlot && (
        <section className="fp-sec">
          <SectionHead title="Your scores" />
          <div className="cl-slot" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,380px),1fr))", gap: 12 }}>{topSlot}</div>
        </section>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ course (Research) */

function CourseBody({ content, parts, progress, open, topSlot }: BodyProps) {
  const steps = parts.find((g) => g.items.length >= 6);
  const rest = parts.filter((g) => g !== steps);
  return (
    <div className="fp-two fp-sec">
      <div style={{ minWidth: 0 }}>
        {content.outcomes.length > 0 && (
          <div className="fp-card" style={{ marginBottom: 28 }}>
            <div style={{ padding: "16px 20px 0" }}><h2 style={{ fontSize: 19, fontWeight: 600, margin: 0 }}>What you&apos;ll learn</h2></div>
            <ul className="fp-learn">{content.outcomes.map((o) => <li key={o}><Icon name="check" size={16} stroke={2.4} /><span>{o}</span></li>)}</ul>
          </div>
        )}
        {steps && (
          <section style={{ marginBottom: 32 }}>
            <SectionHead title={steps.title} note={steps.blurb} right={<Link href={steps.href!} className="fp-link">{steps.cta ?? "Open"} <Icon name="arrowRight" size={15} stroke={2} /></Link>} />
            <div className="fp-dir">
              {steps.items.map((i, n) => (
                <Link key={i.href} href={i.href} className="fp-row is-num">
                  <i>{String(n + 1).padStart(2, "0")}</i>
                  <b>{i.label.replace(/^\d+\.\s*/, "")}</b>
                  <Icon name="arrowRight" size={16} stroke={2} />
                </Link>
              ))}
            </div>
          </section>
        )}
        <SectionHead title="Course content" />
        <Curriculum content={content} progress={progress} open={open} />
        {rest.length > 0 && (
          <section className="fp-sec">
            <SectionHead title="Tools in this course" />
            <ToolGrid items={rest.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, icon: g.icon })))} />
          </section>
        )}
      </div>
      <aside className="fp-side">
        <ProgressCard progress={progress} open={open} />
        <div className="fp-card" style={{ padding: 20 }}>
          <span className="fp-kicker">This course includes</span>
          <ul className="fp-includes" style={{ marginTop: 12 }}>
            <li><Icon name="book" size={17} /> {progress.total} short lessons, {progress.minutes} min</li>
            <li><Icon name="layers" size={17} /> {content.modules.length} modules</li>
            {parts.length > 0 && <li><Icon name="target" size={17} /> {parts.reduce((n, g) => n + g.items.length, 0)} practice tools</li>}
            <li><Icon name="save" size={17} /> Progress saved to your account</li>
          </ul>
        </div>
        {topSlot}
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ helpdesk (Legal) */

const SOS = ["emergency", "cyber-fraud", "women", "child", "legal-aid"];

function HelpdeskBody({ content, parts, progress, open, topSlot }: BodyProps) {
  const guides = [...parts].sort((a, b) => b.items.length - a.items.length)[0];
  const tools = parts.filter((g) => g !== guides && g.title !== "Start here");
  const [filter, setFilter] = useState("");
  const shownGuides = guides?.items.filter((i) => i.label.toLowerCase().includes(filter.toLowerCase())) ?? [];
  return (
    <>
      {topSlot && (
        <section className="fp-sec">
          <SectionHead title="Start with what happened" note="Two quick questions - then the right guide, steps and helpline." />
          <div id="situation" className="fp-card" style={{ padding: "18px 18px 14px", scrollMarginTop: 110 }}>{topSlot}</div>
        </section>
      )}
      <section className="fp-sec">
        <SectionHead title="Helplines" note="Free, government-run, tap to call." right={<Link href="/account/legal/help" className="fp-link">All helplines <Icon name="arrowRight" size={15} stroke={2} /></Link>} />
        <div className="fp-sos">
          {SOS.map((slug) => HELP_CONTACTS.find((c) => c.slug === slug)).filter(Boolean).map((c) => (
            <a key={c!.slug} href={`tel:${c!.number}`}><b>{c!.number}</b><span>{c!.name.replace(/\s*\(.*\)$/, "")}</span></a>
          ))}
        </div>
      </section>
      {guides && (
        <section className="fp-sec">
          <SectionHead title={guides.title} note={guides.blurb} />
          <div className="fp-dir">
            <div className="fp-dir-h"><input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder={`Filter ${guides.items.length} guides`} aria-label="Filter guides" /></div>
            <div className="fp-index">
              {shownGuides.map((i) => {
                const m = i.label.match(/^(\d+)\.\s*(.*)$/);
                return <Link key={i.href} href={i.href}><i>{m ? m[1] : "·"}</i><span>{m ? m[2] : i.label}</span></Link>;
              })}
              {shownGuides.length === 0 && <p className="fp-muted" style={{ padding: "8px 0" }}>No guide matches that.</p>}
            </div>
          </div>
        </section>
      )}
      {tools.length > 0 && (
        <section className="fp-sec">
          <SectionHead title="Act on it" note="Letters, an evidence log, rights cards and practice scenarios." />
          <ToolGrid items={tools.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, icon: g.icon })))} />
        </section>
      )}
      <section className="fp-sec">
        <SectionHead title="Learn the basics" note="Short lessons on your rights - tick them off as you go." />
        <Curriculum content={content} progress={progress} open={open} />
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ catalogue (Exams, Scholarships) */

const SHOW = 12;

function CatalogueBody({ content, parts, progress, open, topSlot }: BodyProps) {
  const dir = [...parts].sort((a, b) => b.items.length - a.items.length)[0];
  const tools = parts.filter((g) => g !== dir);
  const [q, setQ] = useState("");
  const [facet, setFacet] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const facets = useMemo(() => {
    const counts = new Map<string, number>();
    for (const i of dir?.items ?? []) if (i.meta) counts.set(i.meta, (counts.get(i.meta) ?? 0) + 1);
    return [...counts.entries()].filter(([, n]) => n > 1).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);
  }, [dir]);
  const rows = (dir?.items ?? []).filter((i) => (!facet || i.meta === facet) && `${i.label} ${i.meta ?? ""}`.toLowerCase().includes(q.toLowerCase()));
  const shown = all || q || facet ? rows : rows.slice(0, SHOW);

  return (
    <>
      {dir && (
        <section className="fp-sec">
          <SectionHead title={dir.title} note={dir.blurb} right={<Link href={dir.href!} className="fp-btn fp-btn-sm">{dir.cta ?? "Open"} <Icon name="arrowRight" size={14} stroke={2} /></Link>} />
          <div className="fp-dir">
            <div className="fp-dir-h">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Filter ${dir.items.length} ${dir.title.replace(/^all\s+/i, "").toLowerCase()}`} aria-label={`Filter ${dir.title}`} />
              {facets.length > 0 && (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button className="fp-chip" aria-pressed={!facet} onClick={() => setFacet(null)}>All</button>
                  {facets.map((f) => <button key={f} className="fp-chip" aria-pressed={facet === f} onClick={() => setFacet(facet === f ? null : f)}>{f}</button>)}
                </div>
              )}
            </div>
            {shown.map((i) => (
              <Link key={i.href} href={i.href} className="fp-row"><b>{i.label}</b><span>{i.meta ?? ""}</span><Icon name="arrowRight" size={16} stroke={2} /></Link>
            ))}
            {rows.length === 0 && <p className="fp-muted" style={{ padding: 16, margin: 0 }}>Nothing matches. Try fewer letters.</p>}
            {!all && !q && !facet && rows.length > SHOW && <button className="fp-more" onClick={() => setAll(true)}>Show all {rows.length}</button>}
          </div>
        </section>
      )}
      {(tools.length > 0 || topSlot) && (
        <section className="fp-sec">
          <SectionHead title="Plan and track" />
          {topSlot && <div style={{ display: "grid", gap: 12, marginBottom: 12 }}>{topSlot}</div>}
          <ToolGrid items={tools.flatMap((g) => g.items.map((i) => ({ ...i, group: g.title, icon: g.icon })))} />
        </section>
      )}
      <section className="fp-sec">
        <SectionHead title="How it works" note="Short guides - read one in a few minutes." />
        <Curriculum content={content} progress={progress} open={open} startOpen={0} />
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ board (Study Abroad) */

function BoardBody({ content, parts, progress, open, topSlot }: BodyProps) {
  return (
    <>
      <section className="fp-sec">
        <SectionHead title="Your decision, step by step" note="Work left to right. Each column opens straight into its tools." />
        <div className="fp-board">
          {parts.map((g, n) => (
            <div key={g.title} className="fp-col">
              <div className="fp-col-h">
                <small>Step {n + 1}</small>
                <h3>{g.title}</h3>
                {g.blurb && <p>{g.blurb}</p>}
              </div>
              <div className="fp-col-l">
                {g.items.map((i) => <Link key={i.href} href={i.href}>{i.label}{i.meta && <small>{i.meta}</small>}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </section>
      {topSlot && <section className="fp-sec">{topSlot}</section>}
      <section className="fp-sec">
        <SectionHead title="Before you decide" note="Short lessons on the money, the visa and the risks." />
        <Curriculum content={content} progress={progress} open={open} />
      </section>
    </>
  );
}
