"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import ReportsHub from "@/app/account/ReportsHub";
import Link from "next/link";
import { colors, spacing, typography } from "@/app/account/designTokens";

export default function ReportsPage() {
  const router = useRouter();
  const { loading, user, profile, ready } = useAuth();

  useEffect(() => {
    if (!loading && ready && !user) {
      router.replace("/signin");
    }
  }, [loading, ready, user, router]);

  if (!ready) {
    return (
      <div style={{ padding: spacing[8], textAlign: "center" }}>
        <p style={{ color: colors.ink[40] }}>Accounts aren't configured on this deployment yet.</p>
        <Link href="/" style={{ color: colors.accent[40], textDecoration: "none", fontWeight: 600 }}>
          ← Back home
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: spacing[8], textAlign: "center" }}>
        <p style={{ color: colors.ink[40] }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: spacing[8], textAlign: "center" }}>
        <p style={{ color: colors.ink[40] }}>Redirecting to sign in…</p>
      </div>
    );
  }

  const a = profile?.latestAssessment;

  if (!a) {
    return (
      <div style={{ padding: spacing[8], textAlign: "center" }}>
        <p style={{ color: colors.ink[40], marginBottom: spacing[2] }}>
          Please complete your assessment first.
        </p>
        <Link href="/?begin=1" style={{ color: colors.accent[40], textDecoration: "none", fontWeight: 600 }}>
          Take Assessment →
        </Link>
      </div>
    );
  }

  return (
    <ReportsHub
      a={a}
      profile={profile}
      email={user.email}
      studentId={user.uid}
    />
  );
}
