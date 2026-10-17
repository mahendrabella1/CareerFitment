"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { CourseContent, LessonContent } from "@/lib/course/types";
import type { CourseNavItem } from "@/lib/course/featureCourses";
import { useAuth } from "@/lib/auth/AuthProvider";
import { readCourseDone, saveCourseDone } from "@/lib/progress/progressStore";
import { Icon } from "@/app/Icons";
import { HeaderNote, PageHeader } from "@/components/course/fx";
import { useFeatureCourse } from "@/components/course/FeatureCourseLayout";

// A module shows this many lessons before "Show all" - the exam directory
// and the scholarship listing are 29 and 40 lessons long.
const LESSONS_SHOWN = 8;
// "What's inside" lists this many items per part before "+ N more".
const ITEMS_SHOWN = 3;

const LANDING_CSS = `
.cl{display:flex;flex-direction:column;gap:28px}
.cl>.fx-ph{margin-bottom:0}
.cl-sh{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 12px;margin:0 0 14px}
.cl-sh h2{font-size:18px;font-weight:700;color:#111827;margin:0}
.cl-sh span{font-size:13px;color:#6b7280}
.cl-grid{display:grid;grid-template-columns:repeat(var(--cols,4),minmax(0,1fr));gap:14px}
.cl-g{display:flex;flex-direction:column;gap:10px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;min-width:0}
.cl-g-h{display:flex;align-items:center;gap:10px}
.cl-g-ic{flex:none;width:36px;height:36px;border-radius:9px;display:grid;place-items:center;color:var(--cl);background:color-mix(in srgb,var(--cl) 10%,#fff)}
.cl-g-t{font-size:15px;font-weight:600;color:#111827;line-height:1.3}
.cl-g-n{font-size:12px;color:#6b7280}
.cl-g-b{font-size:13px;color:#4b5563;line-height:1.5;margin:0}
.cl-g-l{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;flex:1}
.cl-g-l a{display:block;font-size:13px;color:#374151;text-decoration:none;padding:4px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cl-g-l a:hover{color:var(--cl)}
.cl-g-l .more{font-size:12.5px;color:#9ca3af;padding:4px 0}
.cl-g-cta{display:flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:var(--cl);text-decoration:none;padding-top:10px;border-top:1px solid #f0f1f3}
.cl-g-cta:hover{text-decoration:underline}
.cl-slot{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:12px;align-items:stretch}
.cl-slot>*{margin:0!important;min-width:0}
.cl-content{background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.cl-chead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px 18px;border-bottom:1px solid #e5e7eb}
.cl-chead h2{font-size:17px;font-weight:700;color:#111827;margin:0}
.cl-chead .cl-meta{font-size:13px;color:#6b7280}
.cl-chead .cl-right{margin-left:auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.cl-prog{display:flex;align-items:center;gap:8px;font-size:12.5px;color:#4b5563;font-variant-numeric:tabular-nums}
.cl-bar{width:90px;height:6px;border-radius:999px;background:#e5e7eb;overflow:hidden}
.cl-bar>div{height:100%;background:var(--cl);transition:width .3s ease}
.cl-toggle{font:inherit;font-size:13px;font-weight:600;color:#4b5563;background:none;border:none;cursor:pointer;padding:4px 0}
.cl-toggle:hover{color:#111827}
.cl-mod{border-bottom:1px solid #e5e7eb}
.cl-mod:last-child{border-bottom:none}
.cl-mhead{width:100%;display:grid;grid-template-columns:32px minmax(0,1fr) auto 16px;gap:14px;align-items:center;padding:14px 18px;background:#fff;border:none;cursor:pointer;font:inherit;text-align:left}
.cl-mhead:hover{background:#fafafa}
.cl-num{width:32px;height:32px;border-radius:8px;background:#f3f4f6;color:#374151;display:grid;place-items:center;font-weight:700;font-size:13.5px}
.cl-mod.is-done .cl-num{background:#dcfce7;color:#15803d}
.cl-mtitle{display:block;font-size:15px;font-weight:600;color:#111827;line-height:1.3}
.cl-msum{display:block;font-size:13px;color:#6b7280;line-height:1.5;margin-top:2px}
.cl-mmeta{text-align:right;font-size:12px;color:#6b7280;white-space:nowrap;font-variant-numeric:tabular-nums}
.cl-mmeta b{display:block;font-size:12.5px;font-weight:600;color:#374151}
.cl-chev{width:16px;height:16px;color:#9ca3af;transition:transform .15s}
.cl-mod.is-open .cl-chev{transform:rotate(90deg)}
.cl-lessons{display:flex;flex-direction:column;gap:8px;padding:2px 18px 18px 64px}
.cl-more{align-self:flex-start;font:inherit;font-size:13px;font-weight:600;color:#374151;background:#fff;border:1px solid #d1d5db;border-radius:8px;padding:7px 13px;cursor:pointer}
.cl-more:hover{background:#f9fafb}
@media (max-width:1180px){.cl-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:860px){
  .cl-mhead{grid-template-columns:30px minmax(0,1fr) 16px;padding:14px}
  .cl-mmeta{display:none}
  .cl-num{width:30px;height:30px}
  .cl-lessons{padding:2px 12px 16px}
  .cl-chead .cl-right{margin-left:0;width:100%}
}
@media (max-width:620px){.cl-grid{grid-template-columns:minmax(0,1fr)}}
`;

function Chevron() {
  return (
    <svg className="cl-chev" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CourseLanding({ content, topSlot }: { content: CourseContent; topSlot?: ReactNode }) {
  const feature = useFeatureCourse();
  const { profile } = useAuth();
  const accountProgress = profile?.progress?.courses?.[content.key];
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  // Only the module you are up to starts open; the rest are one tap away.
  const [openModules, setOpenModules] = useState<Set<string>>(() => new Set(content.modules[0] ? [content.modules[0].id] : []));
  const [showAll, setShowAll] = useState<Set<string>>(() => new Set());

  // Progress is the signed-in student's own (lib/progress/progressStore.ts).
  useEffect(() => {
    const saved = readCourseDone(content.key, accountProgress);
    setDone(saved);
    const savedSet = new Set(saved);
    const upTo = content.modules.find((m) => m.lessons.some((l) => !savedSet.has(l.id)));
    if (upTo) setOpenModules(new Set([upTo.id]));
  }, [content, accountProgress]);

  const accent = content.accent;
  const lessons = useMemo(
    () => content.modules.flatMap((m) => m.lessons.map((lesson, index) => ({ lesson, moduleId: m.id, index }))),
    [content]
  );
  const doneSet = new Set(done);
  const total = lessons.length;
  const completed = lessons.filter((x) => doneSet.has(x.lesson.id)).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const totalMinutes = lessons.reduce((sum, x) => sum + x.lesson.minutes, 0);
  const next = lessons.find((x) => !doneSet.has(x.lesson.id)) ?? null;
  const allOpen = openModules.size === content.modules.length;

  const toggleDone = (id: string) => {
    const nextDone = doneSet.has(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(nextDone);
    saveCourseDone(content.key, nextDone, total);
  };

  const toggleModule = (id: string) => setOpenModules((s) => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });

  const openLesson = (entry: { lesson: LessonContent; moduleId: string; index: number }) => {
    setOpenModules((s) => new Set(s).add(entry.moduleId));
    if (entry.index >= LESSONS_SHOWN) setShowAll((s) => new Set(s).add(entry.moduleId));
    setOpen(entry.lesson.id);
    requestAnimationFrame(() => {
      document.getElementById(`lesson-${entry.lesson.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  // "What's inside": every part of the section with its own way in. Index
  // pages ("All labs") are the part's button rather than a line in its list.
  const parts = (feature?.groups ?? []).map((g) => {
    const live = g.items.filter((i) => !i.planned && i.href !== feature?.home);
    const isIndex = (i: CourseNavItem) => live.some((o) => o !== i && o.href.startsWith(`${i.href}/`));
    const items = live.filter((i) => !isIndex(i));
    return { ...g, items, href: g.href ?? live[0]?.href };
  }).filter((g) => g.items.length > 0 && g.href);
  const cols = parts.length <= 4 ? parts.length : parts.length % 3 === 0 ? 3 : 4;

  return (
    <div className="cl" style={{ ["--cl" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />

      <PageHeader
        icon={feature?.icon}
        eyebrow={content.kicker}
        title={content.title}
        subtitle={content.subtitle}
        actions={feature ? (
          <>
            <Link href={feature.start.href} className="fx-btn fx-btn-primary">{feature.start.label}<Icon name="arrowRight" size={15} stroke={2} /></Link>
            {feature.secondary && <Link href={feature.secondary.href} className="fx-btn">{feature.secondary.label}</Link>}
          </>
        ) : next ? (
          <button className="fx-btn fx-btn-primary" onClick={() => openLesson(next)}>{completed === 0 ? "Start the course" : "Continue"}</button>
        ) : null}
        aside={content.outcomes.length > 0 ? (
          <HeaderNote title="What you'll learn">
            <ul>{content.outcomes.slice(0, 4).map((o) => <li key={o}>{o}</li>)}</ul>
          </HeaderNote>
        ) : undefined}
      />

      {topSlot && <div className="cl-slot">{topSlot}</div>}

      {parts.length > 0 && (
        <section aria-labelledby="cl-inside">
          <div className="cl-sh">
            <h2 id="cl-inside">What&apos;s inside</h2>
            <span>Pick any part - each one opens straight into the tool.</span>
          </div>
          <div className="cl-grid" style={{ ["--cols" as string]: cols }}>
            {parts.map((g) => {
              const shown = g.items.slice(0, ITEMS_SHOWN);
              const rest = g.items.length - shown.length;
              return (
                <div key={g.title} className="cl-g">
                  <div className="cl-g-h">
                    <span className="cl-g-ic" aria-hidden="true"><Icon name={g.icon ?? "layers"} size={18} stroke={1.9} /></span>
                    <div style={{ minWidth: 0 }}>
                      <div className="cl-g-t">{g.title}</div>
                      <div className="cl-g-n">{g.items.length} {g.items.length === 1 ? "item" : "items"}</div>
                    </div>
                  </div>
                  {g.blurb && <p className="cl-g-b">{g.blurb}</p>}
                  <ul className="cl-g-l">
                    {shown.map((i) => <li key={i.href}><Link href={i.href} title={i.label}>{i.label}</Link></li>)}
                    {rest > 0 && <li className="more">+ {rest} more</li>}
                  </ul>
                  <Link href={g.href!} className="cl-g-cta">{g.cta ?? `Open ${g.title}`}<Icon name="arrowRight" size={14} stroke={2} /></Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="cl-content" aria-label="Lessons">
        <div className="cl-chead">
          <h2>Lessons</h2>
          <span className="cl-meta">{content.modules.length} modules · {total} lessons · {totalMinutes} min</span>
          <div className="cl-right">
            <span className="cl-prog"><span className="cl-bar"><div style={{ width: `${percent}%` }} /></span>{completed}/{total} done</span>
            {next ? (
              <button className="fx-btn" onClick={() => openLesson(next)}>{completed === 0 ? "Start lesson 1" : "Continue reading"}</button>
            ) : (
              <span style={{ fontSize: 13, fontWeight: 600, color: "#15803d" }}>All lessons complete</span>
            )}
            <button className="cl-toggle" onClick={() => setOpenModules(allOpen ? new Set() : new Set(content.modules.map((m) => m.id)))}>
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
        </div>

        {content.modules.map((m, mi) => {
          const moduleDone = m.lessons.filter((l) => doneSet.has(l.id)).length;
          const minutes = m.lessons.reduce((s, l) => s + l.minutes, 0);
          const isOpen = openModules.has(m.id);
          const visible = showAll.has(m.id) ? m.lessons : m.lessons.slice(0, LESSONS_SHOWN);
          const hidden = m.lessons.length - visible.length;
          const complete = m.lessons.length > 0 && moduleDone === m.lessons.length;
          return (
            <div key={m.id} id={`module-${m.id}`} className={`cl-mod${isOpen ? " is-open" : ""}${complete ? " is-done" : ""}`}>
              <button type="button" className="cl-mhead" aria-expanded={isOpen} onClick={() => toggleModule(m.id)}>
                <span className="cl-num">{complete ? "✓" : mi + 1}</span>
                <span>
                  <span className="cl-mtitle">{m.title}</span>
                  <span className="cl-msum">{m.summary}</span>
                </span>
                <span className="cl-mmeta"><b>{moduleDone}/{m.lessons.length} done</b>{m.lessons.length} {m.lessons.length === 1 ? "lesson" : "lessons"} · {minutes} min</span>
                <Chevron />
              </button>
              {isOpen && (
                <div className="cl-lessons">
                  {visible.map((lesson) => (
                    <LessonRow
                      key={lesson.id}
                      lesson={lesson}
                      accent={accent}
                      isOpen={open === lesson.id}
                      isDone={doneSet.has(lesson.id)}
                      onOpen={() => setOpen(open === lesson.id ? null : lesson.id)}
                      onToggleDone={() => toggleDone(lesson.id)}
                    />
                  ))}
                  {hidden > 0 && (
                    <button type="button" className="cl-more" onClick={() => setShowAll((s) => new Set(s).add(m.id))}>
                      Show all {m.lessons.length} lessons
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function LessonRow({
  lesson,
  accent,
  isOpen,
  isDone,
  onOpen,
  onToggleDone,
}: {
  lesson: LessonContent;
  accent: string;
  isOpen: boolean;
  isDone: boolean;
  onOpen: () => void;
  onToggleDone: () => void;
}) {
  return (
    <div id={`lesson-${lesson.id}`} style={{ border: `1px solid ${isOpen ? "#d1d5db" : "#e5e7eb"}`, borderRadius: 10, background: "#fff", overflow: "hidden", scrollMarginTop: 72 }}>
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}
      >
        <span style={{ flex: "none", width: 22, height: 22, borderRadius: 999, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700, background: isDone ? "#16a34a" : "#fff", color: isDone ? "#fff" : "#6b7280", border: isDone ? "none" : "1.5px solid #d1d5db" }}>
          {isDone ? "✓" : "▶"}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600, color: "#111827" }}>{lesson.title}</span>
        <span style={{ fontSize: 12, color: "#6b7280", flex: "none" }}>{lesson.minutes} min</span>
      </button>

      {isOpen && (
        <div style={{ padding: "2px 16px 18px 48px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0, lineHeight: 1.5 }}>{lesson.summary}</p>

          {lesson.videoId && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`}
              title={lesson.title}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", maxWidth: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 10 }}
            />
          )}

          {lesson.body.map((p, i) => (
            <p key={i} style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.7, margin: 0 }}>{p}</p>
          ))}

          {lesson.points && lesson.points.length > 0 && (
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 6 }}>Key points</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
                {lesson.points.map((pt) => (
                  <li key={pt} style={{ fontSize: 13.5, color: "#1f2937", lineHeight: 1.55 }}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {lesson.tool && (
              <Link href={lesson.tool.href} className="fx-btn fx-btn-primary" style={{ ["--accent" as string]: accent }}>
                {lesson.tool.label} →
              </Link>
            )}
            {lesson.source && (
              <a href={lesson.source.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "#4b5563", textDecoration: "underline" }}>
                Source: {lesson.source.label}
              </a>
            )}
            <button onClick={onToggleDone} className="fx-btn" style={{ marginLeft: "auto", color: isDone ? "#15803d" : undefined }}>
              {isDone ? "Completed ✓ (undo)" : "Mark as complete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
