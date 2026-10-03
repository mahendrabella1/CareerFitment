"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { QuizPlayer, ResultsCard } from "@/components/startups/QuizPlayer";
import { recordModuleTestAttempt, fetchLastModuleTestAttempt } from "@/lib/startups/clientProgress";
import type { ClientQuizQuestion, GradeResult } from "@/lib/startups/scoring";

const COOLDOWN_MS = 60 * 60 * 1000;

export function ModuleTestClient({ trackSlug, moduleSlug, moduleTitle, passMark, quiz, nextModuleSlug }: {
  trackSlug: string; moduleSlug: string; moduleTitle: string; passMark: number; quiz: ClientQuizQuestion[]; nextModuleSlug: string | null;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [result, setResult] = useState<GradeResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    fetchLastModuleTestAttempt(user.uid, moduleSlug).then((last) => {
      if (last && !last.passed) {
        const until = last.createdAtMs + COOLDOWN_MS;
        if (until > Date.now()) setCooldownUntil(until);
      }
    });
  }, [user?.uid, moduleSlug]);

  const onSubmit = async (answers: { questionId: string; selectedOptionIds: string[] }[], timeTakenSec: number) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/startups/grade", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackSlug, moduleSlug, kind: "MODULE_TEST", answers }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      const graded: GradeResult = data.result;
      setResult(graded);
      if (!graded.passed) setCooldownUntil(Date.now() + COOLDOWN_MS);
      if (user?.uid) await recordModuleTestAttempt(user.uid, trackSlug, moduleSlug, graded, timeTakenSec);
    } finally {
      setSubmitting(false);
    }
  };

  const onCooldown = !!cooldownUntil && cooldownUntil > Date.now();

  return (
    <div style={{ maxWidth: 720 }}>
      <Link href={`/account/startups/${trackSlug}/${moduleSlug}`} style={{ fontSize: 13, color: "#999", textDecoration: "none" }}>← {moduleTitle}</Link>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "10px 0 20px" }}>{moduleTitle} - Module Test</h1>

      {!result && onCooldown && (
        <div style={{ textAlign: "center", padding: "32px 16px", border: "1px solid #eee", borderRadius: 12 }}>
          <p style={{ fontSize: 14, color: "#555", margin: 0 }}>You didn't pass last time. To stop guess-and-retry, the test reopens</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", marginTop: 6 }}>{formatCooldown(cooldownUntil!)}</p>
          <p style={{ fontSize: 12.5, color: "#999", marginTop: 10 }}>Review the lessons in this module while you wait.</p>
        </div>
      )}

      {!result && !onCooldown && <QuizPlayer questions={quiz} onSubmit={onSubmit} submitting={submitting} />}

      {result && (
        <>
          <ResultsCard
            result={result}
            onRetry={() => { setResult(null); router.refresh(); }}
            onContinue={() => nextModuleSlug ? router.push(`/account/startups/${trackSlug}/${nextModuleSlug}`) : router.push("/account/startups")}
            continueLabel={nextModuleSlug ? "Continue to next module" : "Back to Startups home"}
          />
          {!result.passed && <p style={{ textAlign: "center", fontSize: 12, color: "#999", marginTop: 10 }}>Come back in an hour to retry.</p>}
        </>
      )}
    </div>
  );
}

function formatCooldown(untilMs: number): string {
  const mins = Math.max(1, Math.ceil((untilMs - Date.now()) / 60000));
  return mins >= 60 ? "in about 1 hour" : `in about ${mins} minute${mins === 1 ? "" : "s"}`;
}
