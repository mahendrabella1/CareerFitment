"use client";

/**
 * /account — user dashboard + career report. Shows the signed-in user's
 * details and, if they've completed the assessment, a full report built from
 * the saved summary (matches, strengths, interests/RIASEC, how-you-think,
 * clusters, recommendations). Otherwise prompts them to take the assessment.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, type AssessmentSummary } from "@/lib/auth/AuthProvider";
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
        <Link href="/" className="og-logo" style={S.logo}>One<span>Grasp</span></Link>
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

        {a ? <Report a={a} /> : (
          <section style={S.emptyCard}>
            <div style={S.emptyIcon}>📝</div>
            <h3 style={S.emptyTitle}>You haven’t taken the assessment yet</h3>
            <p style={S.emptyText}>Complete the career assessment to unlock your personalised report here.</p>
            <Link href="/?begin=1" style={S.primary}>Take the assessment</Link>
          </section>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- Report -------------------------------- */
function Report({ a }: { a: AssessmentSummary }) {
  return (
    <>
      {/* Hero */}
      <section style={S.hero}>
        <div style={S.heroTop}>
          <div>
            <div style={S.heroKicker}>Career Report · {a.journeyName}</div>
            <div style={S.heroTitle}>{a.outcomeLabel || a.topCareer || "Your results"}</div>
            <div style={S.heroDate}>Completed {new Date(a.completedAt).toLocaleDateString()}</div>
          </div>
          {a.overallFitmentPct != null && (
            <div style={S.fitBubble}>
              <div style={S.fitPct}>{a.overallFitmentPct}%</div>
              <div style={S.fitLabel}>top fit</div>
            </div>
          )}
        </div>
        {a.summary && <p style={S.heroSummary}>{a.summary}</p>}
        <div style={S.heroMeta}>
          {a.riasecCode && <span style={S.pillDark}>Interest code · {a.riasecCode}</span>}
          {a.confidence && <span style={S.pillDark}>Confidence · {a.confidence}</span>}
          {a.topCareer && <span style={S.pillDark}>Best fit · {a.topCareer}</span>}
        </div>
      </section>

      {/* Career matches */}
      {a.matches?.length > 0 && (
        <Card title="Top career matches" sub="Careers that best align with your profile.">
          {a.matches.map((m, i) => (
            <div key={i} style={S.match}>
              <div style={S.matchTop}>
                <span style={S.matchTitle}>{i + 1}. {m.title}</span>
                <span style={S.matchPct}>{m.fitmentPct}% · {m.band}</span>
              </div>
              <div style={S.barTrack}><div style={{ ...S.barFill, width: `${clamp(m.fitmentPct)}%` }} /></div>
              {m.roles && m.roles.length > 0 && (
                <div style={S.roles}>{m.roles.map((r) => <span key={r} style={S.roleChip}>{r}</span>)}</div>
              )}
              {m.blurb && <div style={S.matchBlurb}>{m.blurb}</div>}
            </div>
          ))}
        </Card>
      )}

      {/* Strengths */}
      {a.topStrengths?.length > 0 && (
        <Card title="Your top strengths">
          <div style={S.chips}>
            {a.topStrengths.map((s, i) => (
              <span key={i} style={S.chip}>{s.subTraitName}<span style={S.chipSub}> · {s.parameterName}</span></span>
            ))}
          </div>
        </Card>
      )}

      {/* Interests / RIASEC */}
      {a.themes && a.themes.length > 0 && (
        <Card title="Your interests" sub="How your interests map to the six RIASEC themes.">
          {a.themes.map((t) => (
            <div key={t.letter} style={S.theme}>
              <div style={S.themeBadge}>{t.letter}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={S.themeTop}>
                  <span style={S.themeTitle}>{t.title}</span>
                  <span style={S.themeScore}>{Math.round(t.score)}</span>
                </div>
                <div style={S.barTrack}><div style={{ ...S.barFill, width: `${clamp(t.score)}%` }} /></div>
                {t.meaning && <div style={S.themeMeaning}>{t.meaning}</div>}
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* How you think & work */}
      {(hasList(a.topIntelligences) || hasList(a.topValues) || hasList(a.topAptitudes) || hasList(a.learningStyles) || a.ei != null) && (
        <Card title="How you think &amp; work">
          <div style={S.grid2}>
            <MiniList title="Multiple intelligences" items={(a.topIntelligences ?? []).map((x) => ({ label: x.name, score: x.score }))} />
            <MiniList title="Aptitudes" items={(a.topAptitudes ?? []).map((x) => ({ label: x.skill, score: x.score }))} />
            <MiniList title="Values" items={(a.topValues ?? []).map((x) => ({ label: x.tag, score: x.score }))} />
            <MiniList title="Learning styles" items={(a.learningStyles ?? []).map((x) => ({ label: x.name, score: x.score }))} />
          </div>
          {a.ei != null && (
            <div style={S.eiRow}>
              <span style={S.tk}>Emotional intelligence</span>
              <div style={S.barTrackSm}><div style={{ ...S.barFill, width: `${clamp(a.ei)}%` }} /></div>
              <code style={S.scoreTag}>{Math.round(a.ei)}</code>
            </div>
          )}
        </Card>
      )}

      {/* Clusters */}
      {a.clusters && a.clusters.length > 0 && (
        <Card title="Career clusters">
          {a.clusters.map((c) => (
            <div key={c.cluster} style={S.clusterRow}>
              <span style={S.clusterName}>{c.cluster}</span>
              <div style={S.barTrack}><div style={{ ...S.barFill, width: `${clamp(c.score)}%` }} /></div>
              <code style={S.scoreTag}>{Math.round(c.score)}</code>
            </div>
          ))}
        </Card>
      )}

      {/* Recommendations */}
      {((a.recommendations && a.recommendations.length > 0) || a.nextStep) && (
        <Card title="Recommendations & next steps">
          {a.recommendations && a.recommendations.length > 0 && (
            <ul style={S.recList}>
              {a.recommendations.map((r, i) => <li key={i} style={S.recItem}>{r}</li>)}
            </ul>
          )}
          {a.nextStep && <div style={S.nextStep}>👉 {a.nextStep}</div>}
        </Card>
      )}

      <div style={S.actions}>
        <Link href="/?begin=1" style={S.secondary}>Retake assessment</Link>
      </div>
    </>
  );
}

/* --------------------------- small helpers ----------------------------- */
const clamp = (n: number) => Math.max(3, Math.min(100, Math.round(n)));
const hasList = (x?: unknown[]) => Array.isArray(x) && x.length > 0;

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={S.card}>
      <div style={S.cardTitle} dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p style={S.cardSub}>{sub}</p>}
      {children}
    </section>
  );
}

function MiniList({ title, items }: { title: string; items: { label: string; score: number }[] }) {
  if (items.length === 0) return null;
  const max = Math.max(1, ...items.map((i) => i.score));
  return (
    <div style={S.mini}>
      <div style={S.miniTitle}>{title}</div>
      {items.map((it) => (
        <div key={it.label} style={S.miniRow}>
          <span style={S.miniLabel}>{it.label}</span>
          <div style={S.barTrackSm}><div style={{ ...S.barFill, width: `${clamp((it.score / max) * 100)}%` }} /></div>
        </div>
      ))}
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
  body: { maxWidth: 680, margin: "0 auto", padding: "22px 24px 48px" },
  welcome: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 },
  name: { fontSize: 20, fontWeight: 800 },
  email: { fontSize: 13.5, color: "#64748b", marginTop: 2 },

  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  cardTitle: { fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 8 },
  cardSub: { fontSize: 13, color: "#94a3b8", margin: "0 0 14px" },
  table: { display: "flex", flexDirection: "column" },
  tr: { display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderBottom: "1px solid #f1f5f9" },
  tk: { fontSize: 13.5, color: "#64748b", fontWeight: 600 },
  tv: { fontSize: 14.5, color: "#0f172a", fontWeight: 600, textAlign: "right" },

  hero: { background: `linear-gradient(135deg, ${BLUE}, #5a6fce)`, color: "#fff", borderRadius: 16, padding: "24px 26px", marginBottom: 16 },
  heroTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 },
  heroKicker: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1, opacity: .85, fontWeight: 700 },
  heroTitle: { fontSize: 24, fontWeight: 800, margin: "6px 0 2px", lineHeight: 1.2 },
  heroDate: { fontSize: 12.5, opacity: .8 },
  fitBubble: { textAlign: "center", background: "rgba(255,255,255,.16)", border: "1px solid rgba(255,255,255,.4)", borderRadius: 12, padding: "8px 14px" },
  fitPct: { fontSize: 24, fontWeight: 800 },
  fitLabel: { fontSize: 10.5, textTransform: "uppercase", letterSpacing: .5, opacity: .85 },
  heroSummary: { fontSize: 14, lineHeight: 1.6, opacity: .95, margin: "14px 0 0" },
  heroMeta: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 },
  pillDark: { background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700 },

  match: { padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  matchTop: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 7 },
  matchTitle: { fontSize: 14.5, fontWeight: 700, color: "#1e293b" },
  matchPct: { fontSize: 13, fontWeight: 700, color: BLUE, whiteSpace: "nowrap" },
  barTrack: { height: 8, background: "#eef2f6", borderRadius: 999, overflow: "hidden" },
  barTrackSm: { flex: 1, height: 7, background: "#eef2f6", borderRadius: 999, overflow: "hidden" },
  barFill: { height: "100%", background: BLUE, borderRadius: 999 },
  roles: { display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 },
  roleChip: { background: "#f1f5f9", color: "#475569", borderRadius: 6, padding: "3px 9px", fontSize: 11.5, fontWeight: 600 },
  matchBlurb: { fontSize: 12.5, color: "#64748b", marginTop: 7, lineHeight: 1.5 },

  chips: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { background: "#eef2ff", color: "#312e81", borderRadius: 999, padding: "6px 13px", fontSize: 13, fontWeight: 700 },
  chipSub: { color: "#818cf8", fontWeight: 500 },

  theme: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  themeBadge: { width: 34, height: 34, borderRadius: 9, background: "#eef2ff", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 },
  themeTop: { display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 6 },
  themeTitle: { fontSize: 14, fontWeight: 700 },
  themeScore: { fontSize: 13, fontWeight: 700, color: BLUE },
  themeMeaning: { fontSize: 12.5, color: "#64748b", marginTop: 6, lineHeight: 1.5 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  mini: {},
  miniTitle: { fontSize: 12.5, fontWeight: 800, color: "#334155", marginBottom: 8, textTransform: "uppercase", letterSpacing: .4 },
  miniRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 7 },
  miniLabel: { width: 92, fontSize: 12.5, color: "#475569" },
  eiRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 16, paddingTop: 14, borderTop: "1px solid #f1f5f9" },
  scoreTag: { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, fontWeight: 700, color: "#0f172a", minWidth: 34, textAlign: "right" },

  clusterRow: { display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderTop: "1px solid #f1f5f9" },
  clusterName: { width: 150, fontSize: 13.5, color: "#334155", fontWeight: 600 },

  recList: { margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 7 },
  recItem: { fontSize: 13.5, color: "#475569", lineHeight: 1.5 },
  nextStep: { marginTop: 12, padding: "11px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, fontSize: 13.5, color: "#166534", fontWeight: 600 },

  actions: { display: "flex", justifyContent: "center", marginTop: 4 },
  secondary: { display: "inline-block", padding: "11px 26px", background: "#fff", color: "#475569", border: "1px solid #cbd5e1", borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: "none" },
  primary: { display: "inline-block", padding: "13px 30px", background: BLUE, color: "#fff", borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: "none" },
  emptyCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "40px 24px", textAlign: "center", boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  emptyIcon: { fontSize: 42, marginBottom: 10 },
  emptyTitle: { fontSize: 18, fontWeight: 800, margin: "0 0 8px" },
  emptyText: { fontSize: 14, color: "#64748b", margin: "0 0 22px", lineHeight: 1.6 },
  muted: { color: "#64748b", fontSize: 15, marginBottom: 12 },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
};
