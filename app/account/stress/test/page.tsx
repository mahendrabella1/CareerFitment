"use client";
/** /account/stress/test?band=0-5 - taking the Stress & Resilience Check. */
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isBand } from "@/lib/stress/bank";
import { buildResult, saveResult } from "@/lib/stress/client";
import { StressTest, clearStressDraft } from "@/components/stress/StressTest";

export default function StressTestPage() {
  return <Suspense fallback={null}><TestInner /></Suspense>;
}

function TestInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, profile, loading } = useAuth();
  const q = params.get("band");
  const band = isBand(q) ? q : isBand(profile?.experienceBand) ? profile!.experienceBand! : "0-5";

  if (loading) return null;
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, system-ui, sans-serif", color: "#465467" }}>
        <p>Please <Link href="/signin" style={{ color: "#0f766e", fontWeight: 700 }}>sign in</Link> to take the check.</p>
      </div>
    );
  }

  const onFinish = async (answers: Record<string, number>, facts: Record<string, string>, durationSec: number) => {
    const result = buildResult(band, answers, facts, durationSec);
    await saveResult(user.uid, result);
    clearStressDraft();
    router.replace("/account/stress");
  };
  return <StressTest band={band} onFinish={onFinish} exitHref="/account/stress" />;
}
