"use client";
/**
 * Course lessons (Money, Legal, Exams, Scholarships, Study Abroad, Research)
 * open in a side panel, like a course player: the lesson, its key points and
 * practice tool, then "Mark complete" and on to the next one. Progress is the
 * student's own (lib/progress/progressStore.ts - account + this device).
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { readCourseDone, saveCourseDone } from "@/lib/progress/progressStore";
import type { CourseContent, LessonContent, ModuleContent } from "@/lib/course/types";

export interface FlatLesson { lesson: LessonContent; module: ModuleContent; moduleIndex: number; index: number }

export function useCourseProgress(content: CourseContent) {
  const { profile } = useAuth();
  const account = profile?.progress?.courses?.[content.key];
  const [done, setDone] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  /** The last lesson was ticked off on this visit (the certificate pop-up). */
  const [justFinished, setJustFinished] = useState(false);

  useEffect(() => { setDone(readCourseDone(content.key, account)); setReady(true); }, [content.key, account]);

  const lessons = useMemo<FlatLesson[]>(
    () => content.modules.flatMap((m, mi) => m.lessons.map((lesson, i) => ({ lesson, module: m, moduleIndex: mi, index: i }))),
    [content],
  );
  const doneSet = useMemo(() => new Set(done), [done]);
  const total = lessons.length;
  const completed = lessons.filter((x) => doneSet.has(x.lesson.id)).length;

  const setDoneFor = useCallback((id: string, value: boolean) => {
    if (done.includes(id) === value) return;
    const nextDone = value ? [...done, id] : done.filter((x) => x !== id);
    setDone(nextDone);
    saveCourseDone(content.key, nextDone, lessons.length);
    if (value) { const all = new Set(nextDone); if (lessons.every((x) => all.has(x.lesson.id))) setJustFinished(true); }
  }, [done, content.key, lessons]);

  return {
    lessons,
    ready,
    justFinished,
    account,
    doneSet,
    total,
    completed,
    percent: total ? Math.round((completed / total) * 100) : 0,
    minutes: lessons.reduce((s, x) => s + x.lesson.minutes, 0),
    next: lessons.find((x) => !doneSet.has(x.lesson.id)) ?? null,
    moduleDone: (m: ModuleContent) => m.lessons.filter((l) => doneSet.has(l.id)).length,
    setDone: setDoneFor,
  };
}
export type CourseProgressApi = ReturnType<typeof useCourseProgress>;

export function LessonDrawer({ lessonId, progress, onGo, onClose }: {
  lessonId: string;
  progress: CourseProgressApi;
  onGo: (id: string) => void;
  onClose: () => void;
}) {
  const at = progress.lessons.findIndex((x) => x.lesson.id === lessonId);
  const cur = progress.lessons[at];
  const prev = at > 0 ? progress.lessons[at - 1] : null;
  const next = at >= 0 ? progress.lessons[at + 1] ?? null : null;
  const isDone = cur ? progress.doneSet.has(cur.lesson.id) : false;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prevOverflow; };
  }, [onClose]);

  if (!cur) return null;
  const { lesson, module } = cur;

  const completeAndNext = () => {
    progress.setDone(lesson.id, true);
    if (next) onGo(next.lesson.id); else onClose();
  };

  return (
    <>
      <div className="fp-drawer-bg" onClick={onClose} />
      <aside className="fp-drawer" role="dialog" aria-modal="true" aria-label={lesson.title}>
        <div className="fp-drawer-h">
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="fp-muted">{module.title} · Lesson {cur.index + 1} of {module.lessons.length} · {lesson.minutes} min</span>
            <h2>{lesson.title}</h2>
          </div>
          <button className="fp-btn fp-btn-sm" onClick={onClose} aria-label="Close lesson"><Icon name="close" size={15} stroke={2} /></button>
        </div>
        <div className="fp-drawer-b" key={lesson.id}>
          <p className="lead">{lesson.summary}</p>
          {lesson.videoId && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}`}
              title={lesson.title}
              loading="lazy"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ width: "100%", aspectRatio: "16 / 9", border: 0, borderRadius: 8, margin: "4px 0 16px" }}
            />
          )}
          {lesson.body.map((p, i) => <p key={i}>{p}</p>)}
          {lesson.points && lesson.points.length > 0 && (
            <div className="fp-points">
              <span className="fp-kicker">Remember</span>
              <ul>{lesson.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            {lesson.tool && <Link href={lesson.tool.href} className="fp-btn">{lesson.tool.label} <Icon name="arrowRight" size={15} stroke={2} /></Link>}
            {lesson.source && <a href={lesson.source.url} target="_blank" rel="noopener noreferrer" className="fp-muted" style={{ textDecoration: "underline" }}>Source: {lesson.source.label}</a>}
          </div>
        </div>
        <div className="fp-drawer-f">
          <button className="fp-btn fp-btn-sm" disabled={!prev} onClick={() => prev && onGo(prev.lesson.id)} aria-label="Previous lesson"><Icon name="arrowLeft" size={15} stroke={2} /></button>
          <span className="fp-muted" style={{ marginRight: "auto" }}>{progress.completed} of {progress.total} done</span>
          {isDone ? (
            <>
              <button className="fp-link" style={{ fontSize: 13, color: "var(--ok)" }} onClick={() => progress.setDone(lesson.id, false)}>
                <Icon name="check" size={15} stroke={2.4} /> Completed
              </button>
              {next && <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => onGo(next.lesson.id)}>Next lesson <Icon name="arrowRight" size={15} stroke={2} /></button>}
            </>
          ) : (
            <button className="fp-btn fp-btn-pri fp-btn-sm" onClick={completeAndNext}>
              <Icon name="check" size={15} stroke={2.4} /> {next ? "Mark complete & next" : "Mark complete"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
