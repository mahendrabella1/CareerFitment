"use client";
/**
 * /account/stress - home of the Working Professionals' Workplace Stress
 * Check: the start screen before the first check, the results page after.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import { isBand } from "@/lib/stress/bank";
import { loadBenchmarks, loadStress, savePlan, type Benchmarks } from "@/lib/stress/client";
import type { Band, StressPlan, StressStore } from "@/lib/stress/types";
import { StressIntro } from "@/components/stress/StressIntro";
import { StressResults } from "@/components/stress/StressResults";

export default function StressHomePage() {
  const router = useRouter();
  const { user, profile, loading, ready, logout } = useAuth();
  const [store, setStore] = useState<(StressStore & { hadOlder: boolean }) | null>(null);
  const [error, setError] = useState("");
  const [benchmarks, setBenchmarks] = useState<Benchmarks | null>(null);

  useEffect(() => {
    if (!user) return;
    loadStress(user.uid).then(setStore).catch(() => setError("Couldn't load your results. Please refresh."));
    // Retakes and links open in other tabs; re-read when the person comes back here.
    let last = Date.now();
    const onShow = () => {
      if (document.visibilityState !== "visible" || Date.now() - last < 15000) return;
      last = Date.now();
      loadStress(user.uid).then(setStore).catch(() => undefined);
    };
    document.addEventListener("visibilitychange", onShow);
    return () => document.removeEventListener("visibilitychange", onShow);
  }, [user]);

  const latest = store?.results[store.results.length - 1];
  const band: Band = latest?.band ?? (isBand(profile?.experienceBand) ? profile!.experienceBand! : "0-5");

  useEffect(() => {
    if (latest) loadBenchmarks(latest.band).then(setBenchmarks);
  }, [latest]);

  if (!ready) return <Center>Accounts aren&apos;t configured on this deployment yet.</Center>;
  if (loading) return <Center>Loading…</Center>;
  if (!user) return <Center>Please <Link href="/signin" style={{ color: "#256abf", fontWeight: 600 }}>sign in</Link> to take the Workplace Stress Check.</Center>;
  if (error) return <Center>{error}</Center>;
  if (!store) return <Center>Loading your results…</Center>;

  const signOut = () => { void logout().then(() => router.replace("/")); };
  const start = (b: Band) => router.push(`/account/stress/test?band=${encodeURIComponent(b)}`);
  if (!latest) return <StressIntro initialBand={band} onStart={start} onSignOut={signOut} rebuilt={store.hadOlder} />;

  const onPlanChange = (p: StressPlan) => {
    setStore((s) => (s ? { ...s, plan: p } : s));
    void savePlan(user.uid, p).catch(() => undefined);
  };
  return (
    <StressResults
      result={latest}
      history={store.results}
      plan={store.plan}
      benchmarks={benchmarks}
      firstName={(profile?.name || "").trim().split(/\s+/)[0] || undefined}
      onPlanChange={onPlanChange}
      retakeHref={`/account/stress/test?band=${encodeURIComponent(band)}`}
      onSignOut={signOut}
    />
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, fontFamily: "Inter, system-ui, sans-serif", color: "#52514e", fontSize: 15, background: "#f7f7f5" }}><div>{children}</div></div>;
}
