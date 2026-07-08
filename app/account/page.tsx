"use client";

/**
 * /account — user dashboard. Shows the signed-in user's details and, if they've
 * completed the assessment, their report (from the saved summary). Otherwise
 * prompts them to take the assessment.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { categoryLabel } from "@/lib/auth/formOptions";

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
  const initial = (profile?.name || user.email || "?").trim().charAt(0).toUpperCase();

  const details: { label: string; value: string }[] = [
    { label: "Full name", value: profile?.name || user.displayName || "—" },
    { label: "Email", value: profile?.email || user.email || "—" },
    { label: "Phone", value: profile?.phone || "—" },
    { label: "School / College / Company", value: profile?.institution || "—" },
    { label: "Desired career", value: profile?.desiredCareer || "—" },
    { label: "Category", value: profile?.category ? categoryLabel(profile.category) : "—" },
    { label: "Current status", value: profile?.clarity || "—" },
  ];

  return (
    <div style={S.page}>
      <header style={S.header}>
        <Link href="/" className="og-logo" style={S.logo}>
          One<span>Grasp</span>
        </Link>
        <button style={S.logout} onClick={() => { void logout().then(() => router.push("/signin")); }}>
          Sign out
        </button>
      </header>

      <div style={S.body}>
        <div style={S.welcome}>
          <div style={S.avatar}>{initial}</div>
          <div>
            <div style={S.name}>{profile?.name || user.displayName || "Your dashboard"}</div>
            <div style={S.email}>{user.email}</div>
          </div>
        </div>

        {/* Details */}
        <section style={S.card}>
          <div style={S.cardTitle}>Your details</div>
          <div style={S.table}>
            {details.map((d) => (
              <div key={d.label} style={S.tr}>
                <span style={S.tk}>{d.label}</span>
                <span style={S.tv}>{d.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Report or prompt */}
        {a ? (
          <>
            <section style={S.card}>
              <div style={S.reportHead}>
                <div>
                  <div style={S.cardTitle}>Your career report</div>
                  <div style={S.reportMeta}>
                    {a.journeyName} · completed {new Date(a.completedAt).toLocaleDateString()}
                  </div>
                </div>
                {a.overallFitmentPct != null && (
                  <div style={S.fitBubble}>
                    <div style={S.fitPct}>{a.overallFitmentPct}%</div>
                    <div style={S.fitLabel}>top fit</div>
                  </div>
                )}
              </div>
              {a.summary && <p style={S.summary}>{a.summary}</p>}
              {a.topCareer && (
                <div style={S.topCareer}>Best-fit direction: <b>{a.topCareer}</b></div>
              )}
              {a.desiredCareer && (
                <div style={S.desired}>
                  🎯 Your desired career: <b>{a.desiredCareer}</b>
                  {a.desiredCareerFitPct != null
                    ? ` — assessed fit ${a.desiredCareerFitPct}%`
                    : " — not among your top matches this time"}
                </div>
              )}
            </section>

            {a.matches?.length > 0 && (
              <section style={S.card}>
                <div style={S.cardTitle}>Top career matches</div>
                {a.matches.slice(0, 5).map((m, i) => (
                  <div key={i} style={S.match}>
                    <div style={S.matchTop}>
                      <span style={S.matchTitle}>{m.title}</span>
                      <span style={S.matchPct}>{m.fitmentPct}% · {m.band}</span>
                    </div>
                    <div style={S.barTrack}>
                      <div style={{ ...S.barFill, width: `${Math.max(4, Math.min(100, m.fitmentPct))}%` }} />
                    </div>
                    {m.blurb && <div style={S.matchBlurb}>{m.blurb}</div>}
                  </div>
                ))}
              </section>
            )}

            {a.topStrengths?.length > 0 && (
              <section style={S.card}>
                <div style={S.cardTitle}>Your top strengths</div>
                <div style={S.chips}>
                  {a.topStrengths.slice(0, 8).map((s, i) => (
                    <span key={i} style={S.chip}>
                      {s.subTraitName}
                      <span style={S.chipSub}> · {s.parameterName}</span>
                    </span>
                  ))}
                </div>
              </section>
            )}

            <div style={S.actions}>
              <Link href="/?begin=1" style={S.secondary}>Retake assessment</Link>
            </div>
          </>
        ) : (
          <section style={S.emptyCard}>
            <div style={S.emptyIcon}>📝</div>
            <h3 style={S.emptyTitle}>You haven’t taken the assessment yet</h3>
            <p style={S.emptyText}>
              Complete the career assessment to unlock your personalised report here.
            </p>
            <Link href="/?begin=1" style={S.primary}>Take the assessment</Link>
          </section>
        )}
      </div>
    </div>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div style={{ ...S.page, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}>{children}</div></div>;
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  logo: { textDecoration: "none", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  logout: { padding: "8px 16px", background: "#fff", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  body: { maxWidth: 640, margin: "0 auto", padding: "22px 24px 48px" },
  welcome: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 },
  name: { fontSize: 20, fontWeight: 800 },
  email: { fontSize: 13.5, color: "#64748b", marginTop: 2 },
  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  cardTitle: { fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 12 },
  table: { display: "flex", flexDirection: "column" },
  tr: { display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderBottom: "1px solid #f1f5f9" },
  tk: { fontSize: 13.5, color: "#64748b", fontWeight: 600 },
  tv: { fontSize: 14.5, color: "#0f172a", fontWeight: 600, textAlign: "right" },
  reportHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  reportMeta: { fontSize: 12.5, color: "#94a3b8", marginTop: -6, marginBottom: 4 },
  fitBubble: { textAlign: "center", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 12, padding: "8px 14px" },
  fitPct: { fontSize: 22, fontWeight: 800, color: BLUE },
  fitLabel: { fontSize: 10.5, color: "#6366f1", textTransform: "uppercase", letterSpacing: .5 },
  summary: { fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "6px 0 0" },
  topCareer: { marginTop: 12, padding: "10px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 14, color: "#166534" },
  desired: { marginTop: 10, padding: "10px 14px", background: "#eef2ff", border: "1px solid #c7d2fe", borderRadius: 10, fontSize: 14, color: "#312e81" },
  match: { padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  matchTop: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 7 },
  matchTitle: { fontSize: 14.5, fontWeight: 700, color: "#1e293b" },
  matchPct: { fontSize: 13, fontWeight: 700, color: BLUE, whiteSpace: "nowrap" },
  barTrack: { height: 8, background: "#eef2f6", borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", background: BLUE, borderRadius: 999 },
  matchBlurb: { fontSize: 12.5, color: "#64748b", marginTop: 6, lineHeight: 1.5 },
  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { background: "#eef2ff", color: "#312e81", borderRadius: 999, padding: "6px 13px", fontSize: 13, fontWeight: 700 },
  chipSub: { color: "#818cf8", fontWeight: 500 },
  actions: { display: "flex", justifyContent: "center", marginTop: 4 },
  primary: { display: "inline-block", padding: "13px 30px", background: BLUE, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  secondary: { display: "inline-block", padding: "11px 26px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" },
  emptyCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "40px 24px", textAlign: "center", boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  emptyIcon: { fontSize: 42, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 800, margin: "0 0 8px" },
  emptyText: { fontSize: 14, color: "#64748b", margin: "0 0 22px", lineHeight: 1.6 },
  muted: { color: "#64748b", fontSize: 15, marginBottom: 12 },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
};
