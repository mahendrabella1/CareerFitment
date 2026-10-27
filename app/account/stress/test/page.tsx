"use client";
/** /account/stress/test?band=0-5 - taking the Workplace Stress Check. */
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
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "Inter, system-ui, sans-serif", color: "#52514e" }}>
        <p>Please <Link href="/signin" style={{ color: "#256abf", fontWeight: 600 }}>sign in</Link> to take the check.</p>
      </div>
    );
  }

  const onFinish = async (answers: Record<string, number>, durationSec: number) => {
    const result = buildResult(band, answers, durationSec);
    await saveResult(user.uid, result);
    clearStressDraft();
    router.replace("/account/stress");
  };
  return <StressTest band={band} onFinish={onFinish} onExit={() => router.push("/account/stress")} />;
}
