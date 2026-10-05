"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import type { CourseContent, LessonContent } from "@/lib/course/types";

const storageKey = (key: string) => `onegrasp.course.${key}.v1`;

function readDone(key: string): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey(key));
    const value: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function writeDone(key: string, ids: string[]) {
  try {
    window.localStorage.setItem(storageKey(key), JSON.stringify(ids));
  } catch {
    // Storage can be blocked (private window, cleared site data); progress then lasts for this visit only.
  }
}

function ProgressBar({ value, accent, height = 8 }: { value: number; accent: string; height?: number }) {
  return (
    <div style={{ height, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", background: accent, transition: "width .3s ease" }} />
    </div>
  );
}

export function CourseLanding({ content, topSlot }: { content: CourseContent; topSlot?: ReactNode }) {
  const [done, setDone] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    setDone(readDone(content.key));
  }, [content.key]);

  const accent = content.accent;
  const lessons = useMemo(
    () => content.modules.flatMap((m) => m.lessons.map((lesson) => ({ lesson, moduleId: m.id }))),
    [content]
  );
  const doneSet = new Set(done);
  const total = lessons.length;
  const completed = lessons.filter((x) => doneSet.has(x.lesson.id)).length;
  const percent = total ? Math.round((completed / total) * 100) : 0;
  const totalMinutes = lessons.reduce((sum, x) => sum + x.lesson.minutes, 0);
  const nextLesson = lessons.find((x) => !doneSet.has(x.lesson.id))?.lesson ?? null;

  const toggleDone = (id: string) => {
    const next = doneSet.has(id) ? done.filter((x) => x !== id) : [...done, id];
    setDone(next);
    writeDone(content.key, next);
  };

  const openLesson = (id: string) => {
    setOpen(id);
    if (typeof document !== "undefined") {
      document.getElementById(`lesson-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <section style={{ borderRadius: 18, padding: "26px 26px 22px", background: `linear-gradient(135deg, ${accent}1f, #ffffff 70%)`, border: `1px solid ${accent}33` }}>
        <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", color: accent }}>{content.kicker}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", margin: "8px 0 6px", lineHeight: 1.2, textWrap: "balance" }}>{content.title}</h1>
        <p style={{ fontSize: 15, color: "#475569", margin: 0, lineHeight: 1.6, maxWidth: 620 }}>{content.subtitle}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
          {[`${content.modules.length} modules`, `${total} lessons`, `${totalMinutes} min total`].map((chip) => (
            <span key={chip} style={{ fontSize: 12, fontWeight: 700, color: "#334155", background: "#ffffffcc", border: "1px solid #e2e8f0", padding: "5px 11px", borderRadius: 999 }}>{chip}</span>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 8, marginTop: 18 }}>
          {content.outcomes.map((o) => (
            <div key={o} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "#1e293b", lineHeight: 1.5 }}>
              <span style={{ color: accent, fontWeight: 900 }}>✓</span>
              <span>{o}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20, background: "#ffffffd9", border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" }}>Your progress</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", marginTop: 2 }}>{completed} of {total} lessons complete</div>
            </div>
            {nextLesson && (
              <button
                onClick={() => openLesson(nextLesson.id)}
                style={{ fontSize: 13, fontWeight: 800, color: "#fff", background: accent, border: "none", borderRadius: 10, padding: "9px 16px", cursor: "pointer" }}
              >
                {completed === 0 ? "Start course" : "Continue"}: {nextLesson.title}
              </button>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            <ProgressBar value={percent} accent={accent} />
          </div>
        </div>
      </section>

      {topSlot}

      {content.modules.map((m, mi) => {
        const moduleLessons = m.lessons;
        const moduleDone = moduleLessons.filter((l) => doneSet.has(l.id)).length;
        const modulePct = moduleLessons.length ? Math.round((moduleDone / moduleLessons.length) * 100) : 0;
        return (
          <section key={m.id} id={`module-${m.id}`} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "18px 18px 14px" }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ flex: "none", width: 38, height: 38, borderRadius: 11, background: accent, color: "#fff", display: "grid", placeItems: "center", fontWeight: 900, fontSize: 15 }}>{mi + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>{m.title}</h2>
                <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0", lineHeight: 1.55 }}>{m.summary}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <div style={{ flex: 1 }}><ProgressBar value={modulePct} accent={accent} height={6} /></div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", minWidth: 80, textAlign: "right" }}>{moduleDone}/{moduleLessons.length} done</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              {moduleLessons.map((lesson) => (
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
            </div>
          </section>
        );
      })}
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
    <div id={`lesson-${lesson.id}`} style={{ border: `1px solid ${isOpen ? accent : "#e2e8f0"}`, borderRadius: 12, background: isOpen ? `${accent}08` : "#fff", overflow: "hidden" }}>
      <button
        onClick={onOpen}
        aria-expanded={isOpen}
        style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <span style={{ flex: "none", width: 24, height: 24, borderRadius: 999, display: "grid", placeItems: "center", fontSize: 12, fontWeight: 900, background: isDone ? accent : "#f1f5f9", color: isDone ? "#fff" : accent, border: isDone ? "none" : `1.5px solid ${accent}55` }}>
          {isDone ? "✓" : "▶"}
        </span>
        <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{lesson.title}</span>
        <span style={{ fontSize: 12, color: "#64748b", flex: "none" }}>{lesson.minutes} min</span>
      </button>

      {isOpen && (
        <div style={{ padding: "2px 16px 18px 50px", display: "flex", flexDirection: "column", gap: 12 }}>
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
