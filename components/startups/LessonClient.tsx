"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { YouTubeEmbed } from "@/components/startups/YouTubeEmbed";
import { QuizPlayer, ResultsCard } from "@/components/startups/QuizPlayer";
import { recordLessonAttempt, submitTask } from "@/lib/startups/clientProgress";
import type { ClientQuizQuestion, GradeResult } from "@/lib/startups/scoring";

const ACCENT = "#f97316";

interface SafeLesson {
  slug: string; title: string; durationMin: number; youtubeId: string | null; videoStartSec: number;
  hook: string; contentMd: string; exampleMd: string | null; taskPrompt: string; passMark: number;
}

export function LessonClient({ trackSlug, moduleSlug, moduleTitle, lesson, quiz, nextLessonSlug }: {
  trackSlug: string; moduleSlug: string; moduleTitle: string; lesson: SafeLesson; quiz: ClientQuizQuestion[]; nextLessonSlug: string | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [phase, setPhase] = useState<"read" | "quiz" | "results">("read");
  const [result, setResult] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [taskText, setTaskText] = useState("");
  const [taskSaved, setTaskSaved] = useState(false);

  const saveTask = async () => {
    if (!user?.uid || !taskText.trim()) return;
    await submitTask(user.uid, moduleSlug, lesson.slug, "task", taskText.trim());
    setTaskSaved(true);
  };

  const onSubmitQuiz = async (answers: { questionId: string; selectedOptionIds: string[] }[], timeTakenSec: number) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/startups/grade", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug, moduleSlug, lessonSlug: lesson.slug, kind: "LESSON", answers }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const graded: GradeResult = data.result;
      setResult(graded);
      setPhase("results");
      if (user?.uid) await recordLessonAttempt(user.uid, trackSlug, moduleSlug, lesson.slug, graded, timeTakenSec, lesson.passMark);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 20px" }}>
      <Link href={`/account/startups/${trackSlug}/${moduleSlug}`} style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← {moduleTitle}</Link>

      {phase === "read" && (
        <>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 4px" }}>{lesson.title}</h1>
          <p style={{ fontSize: 12.5, color: "#999", margin: "0 0 20px" }}>{lesson.durationMin} minutes</p>

          <p style={{ fontSize: 15, lineHeight: 1.6, color: "#333", fontStyle: "italic", borderLeft: `3px solid ${ACCENT}`, paddingLeft: 14, marginBottom: 22 }}>{lesson.hook}</p>

          {lesson.youtubeId && (
            <div style={{ marginBottom: 22 }}>
              <YouTubeEmbed videoId={lesson.youtubeId} title={lesson.title} startSec={lesson.videoStartSec} />
            </div>
          )}

          <div style={{ marginBottom: 22 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px" }}>Key ideas</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {lesson.contentMd.split("\n").filter(Boolean).map((line, i) => (
                <p key={i} style={{ fontSize: 14, lineHeight: 1.6, color: "#444", margin: 0, display: "flex", gap: 8 }}>
                  <span style={{ color: ACCENT, flex: "none" }}>•</span><span>{line}</span>
                </p>
              ))}
            </div>
          </div>

          {lesson.exampleMd && (
            <div style={{ marginBottom: 22, background: "#fafafa", borderRadius: 10, padding: "12px 16px" }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "#888", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: ".04em" }}>Example</h3>
              <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "#444", margin: 0 }}>{lesson.exampleMd}</p>
            </div>
          )}

          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 8px" }}>Do it</h3>
            <p style={{ fontSize: 13.5, color: "#666", margin: "0 0 10px" }}>{lesson.taskPrompt}</p>
            <textarea value={taskText} onChange={(e) => { setTaskText(e.target.value); setTaskSaved(false); }} rows={4}
              placeholder="Write your answer here - it's saved to your Startup Portfolio"
              style={{ width: "100%", borderRadius: 8, border: "1px solid #ddd", padding: 10, fontSize: 13.5, fontFamily: "inherit", resize: "vertical" }} />
            <button onClick={saveTask} disabled={!taskText.trim()}
              style={{ marginTop: 8, padding: "8px 16px", borderRadius: 8, border: "none", background: "#eee", color: "#333", fontWeight: 600, fontSize: 13, cursor: taskText.trim() ? "pointer" : "default", opacity: taskText.trim() ? 1 : 0.5 }}>
              Save to Portfolio
            </button>
            {taskSaved && <span style={{ marginLeft: 10, fontSize: 12.5, color: "#166534" }}>Saved ✓</span>}
          </div>

          <button onClick={() => setPhase("quiz")}
            style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
            Take the quiz ({quiz.length} questions, pass at {lesson.passMark}%)
          </button>
        </>
      )}

      {phase === "quiz" && (
        <div style={{ marginTop: 24 }}>
          <QuizPlayer questions={quiz} onSubmit={onSubmitQuiz} submitting={submitting} />
        </div>
      )}

      {phase === "results" && result && (
        <div style={{ marginTop: 24 }}>
          <ResultsCard
            result={result}
            onRetry={() => setPhase("quiz")}
            onContinue={() => nextLessonSlug ? router.push(`/account/startups/${trackSlug}/${moduleSlug}/${nextLessonSlug}`) : router.push(`/account/startups/${trackSlug}/${moduleSlug}`)}
            continueLabel={nextLessonSlug ? "Continue to next lesson" : "Back to module"}
          />
        </div>
      )}
    </div>
  );
}
