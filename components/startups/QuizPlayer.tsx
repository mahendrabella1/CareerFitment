"use client";

import { useRef, useState } from "react";
import type { ClientQuizQuestion } from "@/lib/startups/scoring";
import type { GradeResult } from "@/lib/startups/scoring";

const ACCENT = "#f97316";

export function QuizPlayer({ questions, onSubmit, submitting }: {
  questions: ClientQuizQuestion[];
  onSubmit: (answers: { questionId: string; selectedOptionIds: string[] }[], timeTakenSec: number) => void;
  submitting: boolean;
}) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const startedAt = useRef(Date.now());
  const q = questions[i];
  const multi = q.type === "MULTI";
  const picked = answers[q.id] ?? [];

  const toggle = (optId: string) => setAnswers((a) => ({
    ...a,
    [q.id]: multi ? (picked.includes(optId) ? picked.filter((x) => x !== optId) : [...picked, optId]) : [optId],
  }));

  const submit = () => onSubmit(
    questions.map((x) => ({ questionId: x.id, selectedOptionIds: answers[x.id] ?? [] })),
    Math.round((Date.now() - startedAt.current) / 1000)
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ height: 6, borderRadius: 999, background: "#eee", overflow: "hidden", marginBottom: 20 }}>
        <div style={{ height: "100%", borderRadius: 999, background: ACCENT, width: `${((i + 1) / questions.length) * 100}%`, transition: "width .2s" }} />
      </div>
      <p style={{ fontSize: 12, color: "#888", margin: "0 0 6px" }}>Question {i + 1} of {questions.length}{multi ? " · select all that apply" : ""}</p>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#1a1a1a" }}>{q.prompt}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {q.options.map((o) => {
          const active = picked.includes(o.id);
          return (
            <button key={o.id} onClick={() => toggle(o.id)}
              style={{
                textAlign: "left", padding: "12px 16px", borderRadius: 10, cursor: "pointer",
                border: `1.5px solid ${active ? ACCENT : "#e2e2e2"}`,
                background: active ? `${ACCENT}12` : "#fff", color: "#1a1a1a", fontSize: 14, fontWeight: active ? 600 : 400,
              }}>
              {o.text}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button disabled={i === 0} onClick={() => setI(i - 1)}
          style={{ padding: "10px 18px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.4 : 1 }}>
          Back
        </button>
        {i < questions.length - 1 ? (
          <button disabled={!picked.length} onClick={() => setI(i + 1)}
            style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, cursor: picked.length ? "pointer" : "default", opacity: picked.length ? 1 : 0.4 }}>
            Next
          </button>
        ) : (
          <button disabled={!picked.length || submitting} onClick={submit}
            style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, cursor: !picked.length || submitting ? "default" : "pointer", opacity: !picked.length || submitting ? 0.5 : 1 }}>
            {submitting ? "Checking…" : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}

export function ResultsCard({ result, onRetry, onContinue, continueLabel }: {
  result: GradeResult;
  onRetry: () => void;
  onContinue?: () => void;
  continueLabel?: string;
}) {
  const wrongFirst = [...result.graded].sort((a, b) => Number(a.correct) - Number(b.correct));
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ textAlign: "center", border: "1px solid #eee", borderRadius: 16, padding: "28px 20px", marginBottom: 24 }}>
        <div style={{ fontSize: 44, fontWeight: 800, color: "#1a1a1a" }}>{result.percent}%</div>
        <div style={{ color: "#888", marginTop: 4 }}>{result.score}/{result.maxScore} correct</div>
        <span style={{
          display: "inline-block", marginTop: 12, padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 700,
          background: result.passed ? "#dcfce7" : "#fef3c7", color: result.passed ? "#166534" : "#92400e",
        }}>
          {result.passed ? "Passed" : "Not quite - review and try again"}
        </span>
      </div>

      {Object.keys(result.skillScores).length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Skill breakdown</h3>
          {Object.entries(result.skillScores).map(([skill, score]) => (
            <div key={skill} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 6 }}>
              <span style={{ width: 110, textTransform: "capitalize", color: "#555" }}>{skill.replace("-", " ")}</span>
              <div style={{ flex: 1, height: 6, background: "#eee", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${score}%`, height: "100%", background: ACCENT }} />
              </div>
              <span style={{ width: 32, textAlign: "right", color: "#888" }}>{score}%</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 10px" }}>Review</h3>
        {wrongFirst.map((g) => (
          <div key={g.questionId} style={{ borderLeft: `4px solid ${g.correct ? "#22c55e" : "#ef4444"}`, padding: "10px 14px", marginBottom: 10, background: "#fafafa", borderRadius: 6 }}>
            <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.5 }}>{g.explanation}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {result.passed && onContinue ? (
          <button onClick={onContinue} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            {continueLabel ?? "Continue"}
          </button>
        ) : (
          <button onClick={onRetry} style={{ padding: "10px 18px", borderRadius: 8, border: "none", background: ACCENT, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
