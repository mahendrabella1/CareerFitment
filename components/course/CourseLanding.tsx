"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { CourseContent, LessonContent } from "@/lib/course/types";
import { useAuth } from "@/lib/auth/AuthProvider";
import { readCourseDone, saveCourseDone } from "@/lib/progress/progressStore";

// A module shows this many lessons before "Show all" - the exam directory
// and the scholarship listing are 29 and 40 lessons long.
const LESSONS_SHOWN = 8;

const LANDING_CSS = `
.cl{display:flex;flex-direction:column;gap:18px}
.cl-hero{border-radius:18px;padding:26px;background:linear-gradient(135deg,color-mix(in srgb,var(--cl) 12%,#fff),#fff 70%);border:1px solid color-mix(in srgb,var(--cl) 20%,#fff);display:grid;grid-template-columns:minmax(0,1.55fr) minmax(250px,1fr);gap:24px;align-items:start}
.cl-kicker{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--cl)}
.cl-title{font-size:30px;font-weight:900;color:#0f172a;margin:8px 0 8px;line-height:1.18;text-wrap:balance}
.cl-sub{font-size:15px;color:#475569;margin:0;line-height:1.6;max-width:640px}
.cl-chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
.cl-chip{font-size:12px;font-weight:700;color:#334155;background:#ffffffcc;border:1px solid #e2e8f0;padding:5px 11px;border-radius:999px}
.cl-outcomes{grid-column:1/-1;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:10px 22px;padding-top:18px;border-top:1px solid color-mix(in srgb,var(--cl) 15%,#fff)}
.cl-out{display:flex;gap:9px;font-size:13.5px;color:#1e293b;line-height:1.5}
.cl-out span:first-child{color:var(--cl);font-weight:900}
.cl-prog{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;box-shadow:0 6px 18px rgba(15,23,42,.05)}
.cl-prog-k{font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase;letter-spacing:.06em}
.cl-prog-n{font-size:26px;font-weight:900;color:#0f172a;margin-top:4px;font-variant-numeric:tabular-nums}
.cl-prog-n small{font-size:13px;font-weight:700;color:#64748b;margin-left:4px}
.cl-bar{height:8px;border-radius:999px;background:#e2e8f0;overflow:hidden}
.cl-bar>div{height:100%;background:var(--cl);transition:width .3s ease}
.cl-next{margin-top:14px;padding-top:12px;border-top:1px dashed #e2e8f0}
.cl-next-t{font-size:13.5px;font-weight:700;color:#0f172a;line-height:1.4;margin:4px 0 10px}
.cl-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;font:inherit;font-size:13.5px;font-weight:800;color:#fff;background:var(--cl);border:none;border-radius:10px;padding:10px 16px;cursor:pointer}
.cl-btn:hover{filter:brightness(.95)}
.cl-content{background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden}
.cl-chead{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:16px 18px;border-bottom:1px solid #e2e8f0}
.cl-chead h2{font-size:17px;font-weight:800;color:#0f172a;margin:0}
.cl-chead span{font-size:12.5px;color:#64748b}
.cl-chead button{margin-left:auto;font:inherit;font-size:12.5px;font-weight:700;color:var(--cl);background:none;border:none;cursor:pointer;padding:4px 0}
.cl-mod{border-bottom:1px solid #e2e8f0}
.cl-mod:last-child{border-bottom:none}
.cl-mhead{width:100%;display:grid;grid-template-columns:34px minmax(0,1fr) auto 16px;gap:14px;align-items:center;padding:14px 18px;background:#fff;border:none;cursor:pointer;font:inherit;text-align:left}
.cl-mhead:hover{background:#fafbfd}
.cl-mod.is-open .cl-mhead{background:color-mix(in srgb,var(--cl) 5%,#fff)}
.cl-num{width:34px;height:34px;border-radius:10px;background:color-mix(in srgb,var(--cl) 14%,#fff);color:var(--cl);display:grid;place-items:center;font-weight:900;font-size:14px}
.cl-mod.is-done .cl-num{background:var(--cl);color:#fff}
.cl-mtitle{display:block;font-size:15.5px;font-weight:800;color:#0f172a;line-height:1.3}
.cl-msum{display:block;font-size:13px;color:#64748b;line-height:1.5;margin-top:2px}
.cl-mmeta{text-align:right;font-size:12px;color:#64748b;white-space:nowrap;font-variant-numeric:tabular-nums}
.cl-mmeta b{display:block;font-size:12.5px;color:#334155}
.cl-chev{width:16px;height:16px;color:#94a3b8;transition:transform .15s}
.cl-mod.is-open .cl-chev{transform:rotate(90deg)}
.cl-lessons{display:flex;flex-direction:column;gap:8px;padding:4px 18px 18px 66px}
.cl-more{align-self:flex-start;font:inherit;font-size:13px;font-weight:800;color:var(--cl);background:color-mix(in srgb,var(--cl) 8%,#fff);border:1px solid color-mix(in srgb,var(--cl) 25%,#fff);border-radius:10px;padding:8px 14px;cursor:pointer}
@media (max-width:860px){
  .cl-hero{grid-template-columns:minmax(0,1fr);padding:20px}
  .cl-title{font-size:25px}
  .cl-mhead{grid-template-columns:30px minmax(0,1fr) 16px;padding:14px}
  .cl-mmeta{display:none}
  .cl-num{width:30px;height:30px}
  .cl-lessons{padding:4px 12px 16px}
}
`;

function Chevron() {
  return (
    <svg className="cl-chev" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CourseLanding({ content, topSlot }: { content: CourseContent; topSlot?: ReactNode }) {
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

  return (
    <div className="cl" style={{ ["--cl" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: LANDING_CSS }} />
      <section className="cl-hero">
        <div>
          <div className="cl-kicker">{content.kicker}</div>
          <h1 className="cl-title">{content.title}</h1>
          <p className="cl-sub">{content.subtitle}</p>
          <div className="cl-chips">
            {[`${content.modules.length} modules`, `${total} lessons`, `${totalMinutes} min total`].map((chip) => (
              <span key={chip} className="cl-chip">{chip}</span>
            ))}
          </div>
        </div>

        <div className="cl-prog">
          <div className="cl-prog-k">Your progress</div>
          <div className="cl-prog-n">{percent}%<small>{completed} of {total} lessons</small></div>
          <div className="cl-bar" style={{ marginTop: 8 }}><div style={{ width: `${percent}%` }} /></div>
          {next ? (
            <div className="cl-next">
              <div className="cl-prog-k">{completed === 0 ? "Start with" : "Up next"}</div>
              <div className="cl-next-t">{next.lesson.title}</div>
              <button className="cl-btn" onClick={() => openLesson(next)}>{completed === 0 ? "Start course" : "Continue"} →</button>
            </div>
          ) : (
            <div className="cl-next" style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>Every lesson is complete.</div>
          )}
        </div>

        {content.outcomes.length > 0 && (
          <div className="cl-outcomes">
            {content.outcomes.map((o) => (
              <div key={o} className="cl-out"><span>✓</span><span>{o}</span></div>
            ))}
          </div>
        )}
      </section>

      {topSlot}

      <section className="cl-content" aria-label="Course content">
        <div className="cl-chead">
          <h2>Course content</h2>
          <span>{content.modules.length} modules · {total} lessons · {totalMinutes} min</span>
          <button onClick={() => setOpenModules(allOpen ? new Set() : new Set(content.modules.map((m) => m.id)))}>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
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
    <div id={`lesson-${lesson.id}`} style={{ border: `1px solid ${isOpen ? accent : "#e2e8f0"}`, borderRadius: 12, background: isOpen ? `${accent}08` : "#fff", overflow: "hidden", scrollMarginTop: 72 }}>
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}
      >
        <span style={{ flex: "none", width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", fontSize: 11, fontWeight: 900, background: isDone ? accent : "#f1f5f9", color: isDone ? "#fff" : accent, border: isDone ? "none" : `1.5px solid ${accent}55` }}>
          {isDone ? "✓" : "▶"}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{lesson.title}</span>
        <span style={{ fontSize: 12, color: "#64748b", flex: "none" }}>{lesson.minutes} min</span>
      </button>

      {isOpen && (
        <div style={{ padding: "2px 16px 18px 50px", display: "flex", flexDirection: "column", gap: 12, maxWidth: 820 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: accent, margin: 0, lineHeight: 1.5 }}>{lesson.summary}</p>

          {lesson.videoId && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`}
              title={lesson.title}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", maxWidth: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 12 }}
            />
          )}

          {lesson.body.map((p, i) => (
            <p key={i} style={{ fontSize: 14.5, color: "#334155", lineHeight: 1.7, margin: 0 }}>{p}</p>
          ))}

          {lesson.points && lesson.points.length > 0 && (
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>Key points</div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 5 }}>
                {lesson.points.map((pt) => (
                  <li key={pt} style={{ fontSize: 13.5, color: "#1e293b", lineHeight: 1.55 }}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {lesson.tool && (
              <Link href={lesson.tool.href} style={{ fontSize: 13, fontWeight: 800, color: accent, background: `${accent}14`, border: `1px solid ${accent}40`, borderRadius: 10, padding: "8px 14px", textDecoration: "none" }}>
                {lesson.tool.label} →
              </Link>
            )}
            {lesson.source && (
              <a href={lesson.source.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12.5, color: "#475569", textDecoration: "underline" }}>
                Source: {lesson.source.label}
              </a>
            )}
            <button
              onClick={onToggleDone}
              style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: isDone ? "#166534" : "#fff", background: isDone ? "#dcfce7" : accent, border: "none", borderRadius: 10, padding: "8px 14px", cursor: "pointer" }}
            >
              {isDone ? "Completed ✓ (undo)" : "Mark as complete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
