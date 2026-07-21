"use client";

/**
 * /account — the signed-in user's dashboard. When the assessment is complete it
 * renders the premium <Dashboard/> (overview, radar, matches, dimensions, plan,
 * resources) with the in-depth <FullReport/> one click away. Otherwise it prompts
 * the user to take the assessment.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth } from "@/lib/auth/AuthProvider";
import Dashboard from "@/app/account/Dashboard";
import { StudentHero } from "@/app/account/illustrations";
import { C } from "@/app/account/viz";

const PAGE_CSS = `
:root{color-scheme:light}
@media print{
  .og-noprint{display:none !important}
  body{background:#fff !important}
}`;

export default function AccountPage() {
  const router = useRouter();
  const { loading, user, profile, logout, ready } = useAuth();

  useEffect(() => {
    if (!loading && ready && !user) router.replace("/signin");
  }, [loading, ready, user, router]);

  if (!ready) {
    return (
      <Centered>
        <p style={S.muted}>Accounts aren’t configured on this deployment yet.</p>
        <Link href="/" style={S.link}>← Back home</Link>
      </Centered>
    );
  }
  if (loading) return <Centered><p style={S.muted}>Loading…</p></Centered>;
  if (!user) return <Centered><p style={S.muted}>Redirecting to sign in…</p></Centered>;

  const a = profile?.latestAssessment;
  const signOut = () => { void logout().then(() => router.push("/signin")); };

  // Completed assessment → the full app-shell dashboard (owns its own chrome).
  if (a) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
        <Dashboard a={a} profile={profile} email={user.email} onSignOut={signOut} />
      </>
    );
  }

  // Empty state.
  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <header style={S.header} className="og-noprint">
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={38} /></Link>
        <button style={S.logout} onClick={signOut}>Sign out</button>
      </header>
      <div style={S.emptyWrap}>
        <section style={S.emptyCard}>
          <div style={{ maxWidth: 260, height: 200, margin: "0 auto 8px" }}><StudentHero /></div>
          <h3 style={S.emptyTitle}>You haven’t taken the assessment yet</h3>
          <p style={S.emptyText}>Complete the career assessment to unlock your personalised dashboard and report.</p>
          <Link href="/?begin=1" style={S.primary}>Take the assessment</Link>
        </section>
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}>{children}</div></div>;
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${C.line}` },
  logout: { padding: "9px 16px", background: "#fff", color: C.redStrong, border: `1px solid ${C.redLine}`, borderRadius: 10, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },

  emptyWrap: { maxWidth: 560, margin: "0 auto", padding: "40px 24px" },
  emptyCard: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: "44px 26px", textAlign: "center", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  emptyIcon: { width: 64, height: 64, borderRadius: 16, background: C.redTint, color: C.red, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" },
  emptyTitle: { fontSize: 19, fontWeight: 800, margin: "0 0 8px" },
  emptyText: { fontSize: 14, color: C.ink3, margin: "0 0 22px", lineHeight: 1.6 },
  primary: { display: "inline-block", padding: "13px 30px", background: C.red, color: "#fff", borderRadius: 11, fontSize: 15, fontWeight: 700, textDecoration: "none" },

  muted: { color: C.ink3, fontSize: 15, marginBottom: 12 },
  link: { color: C.red, fontWeight: 700, textDecoration: "none" },
};
