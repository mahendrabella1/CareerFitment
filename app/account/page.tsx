"use client";

/**
 * /account — user dashboard + career report. Shows the signed-in user's
 * details and, if they've completed the assessment, a full report built from
 * the saved summary (matches, strengths, interests/RIASEC, how-you-think,
 * clusters, recommendations). Otherwise prompts them to take the assessment.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth, type AssessmentSummary } from "@/lib/auth/AuthProvider";
import { categoryLabel } from "@/lib/auth/formOptions";
import { Icon, CATEGORY_ABBR } from "@/app/Icons";
import FullReport from "@/app/account/FullReport";

const PAGE_CSS = `
@media (max-width: 640px){
  .og-report-hero{grid-template-columns:1fr !important}
  .og-report-art{display:none !important}
}
@media print{
  .og-noprint{display:none !important}
  body{background:#fff !important}
}
`;

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
      <style>{PAGE_CSS}</style>
      <header style={S.header} className="og-noprint">
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={40} /></Link>
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

        {a ? <FullReport a={a} name={(profile?.name || "").trim().split(/\s+/)[0]} /> : (
          <section style={S.emptyCard}>
            <div style={{ ...S.emptyIcon, color: BLUE, display: "flex", justifyContent: "center" }}><Icon name="answer" size={40} stroke={1.4} /></div>
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
      <section style={S.hero} className="og-report-hero">
        <div style={S.heroLeft}>
          <div style={S.heroKicker}>Career Report · {a.journeyName}</div>
          <div style={S.heroTitle}>{a.outcomeLabel || a.topCareer || "Your results"}</div>
          <div style={S.heroDate}>Completed {new Date(a.completedAt).toLocaleDateString()}</div>
          {a.summary && <p style={S.heroSummary}>{a.summary}</p>}
          <div style={S.heroMeta}>
            {a.riasecCode && <span style={S.pillDark}>Interest code · {a.riasecCode}</span>}
            {a.topCareer && <span style={S.pillDark}>Best fit · {a.topCareer}</span>}
          </div>
          <button style={S.heroDownload} className="og-noprint" onClick={() => window.print()}>
            <Icon name="explain" size={16} /> Download / print report
          </button>
        </div>
        <div style={S.heroArt} className="og-report-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://onegrasp.com/wp-content/uploads/2026/07/ChatGPT-Image-Jul-10-2026-05_34_15-PM.png" alt="" style={S.heroImg} />
          {a.overallFitmentPct != null && (
            <div style={S.fitBubble}>
              <div style={S.fitPct}>{a.overallFitmentPct}%</div>
              <div style={S.fitLabel}>top fit</div>
            </div>
          )}
        </div>
      </section>

      {/* 8-category profile radar */}
      {a.radar && a.radar.length > 0 && <ProfileRadar a={a} />}

      {/* Career matches */}
      {a.matches?.length > 0 && (
        <Card icon="match" accent="#4f6b9e" title="Top career matches" sub="Careers that best align with your profile.">
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
        <Card icon="strengths" accent="#2f9e6f" title="Your top strengths">
          <div style={S.chips}>
            {a.topStrengths.map((s, i) => (
              <span key={i} style={S.chip}>{s.subTraitName}<span style={S.chipSub}> · {s.parameterName}</span></span>
            ))}
          </div>
        </Card>
      )}

      {/* Interests / RIASEC */}
      {a.themes && a.themes.length > 0 && (
        <Card icon="career_interest" accent="#7c6bd6" title="Your interests" sub="How your interests map across the eight career clusters.">
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
        <Card icon="multiple_intelligence" accent="#d98324" title="How you think & work">
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
        <Card icon="clusters" accent="#c0564f" title="Career clusters">
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
        <Card icon="explain" title="Recommendations & next steps">
          {a.recommendations && a.recommendations.length > 0 && (
            <ul style={S.recList}>
              {a.recommendations.map((r, i) => <li key={i} style={S.recItem}>{r}</li>)}
            </ul>
          )}
          {a.nextStep && <div style={S.nextStep}>{a.nextStep}</div>}
        </Card>
      )}

      <div style={S.actions} className="og-noprint">
        <Link href="/?begin=1" style={S.secondary}>Retake assessment</Link>
      </div>
    </>
  );
}

/* ---------------------- 8-category profile radar ----------------------- */
const scoreBand = (p: number) =>
  p >= 80 ? "a standout area" : p >= 65 ? "a clear strength" : p >= 50 ? "a solid, dependable area" : p >= 35 ? "an emerging area" : "an area to develop";

/** Human, specific per-category explanation built from the saved summary. */
function explainCategory(key: string, a: AssessmentSummary): string {
  const r = a.radar?.find((x) => x.key === key);
  const p = r?.score ?? 0;
  const band = scoreBand(p);
  switch (key) {
    case "personality": {
      const trait = a.topStrengths?.[0]?.subTraitName;
      return `Your responses point to a ${a.outcomeLabel || "balanced temperament"}${trait ? `, with ${trait} standing out most` : ""}. This shapes how you engage with people, handle pressure and recharge — ${band}.`;
    }
    case "career_interest": {
      const top = a.themes?.[0];
      return top
        ? `Your interests lean strongly toward ${top.title} (${top.meaning}). Interest is the single biggest driver of long-term satisfaction, so this is where to look first.`
        : `Your interests are spread fairly evenly — worth exploring a few fields hands-on to see what pulls you in.`;
    }
    case "multiple_intelligence": {
      const top = a.topIntelligences?.[0]?.name;
      return `Across Gardner's eight intelligences, ${top || "your top area"} is most pronounced. This is how you most naturally take in and work with the world — ${band}.`;
    }
    case "emotional_intelligence":
      return `Your emotional intelligence reads at ${a.ei ?? p}% — how well you read situations, manage your own reactions and respond to others. This is ${band} and a strong predictor of teamwork and leadership.`;
    case "learning_styles": {
      const top = a.learningStyles?.[0]?.name;
      return `You learn best through a ${top || "mixed"} approach. Matching study and work methods to this style makes new material noticeably easier to absorb.`;
    }
    case "motivators": {
      const top = a.topValues?.[0]?.tag;
      return `What drives you most is ${top || "a balance of factors"}. Roles and environments that feed this motivator will keep you engaged; ones that starve it tend to burn people out.`;
    }
    case "strengths": {
      const top = a.strengthsBreakdown?.slice().sort((x, y) => y.score - x.score)[0]?.name;
      return `On the quick reasoning and self-report tasks you scored ${p}% overall${top ? `, strongest in ${top}` : ""} — ${band}. Combine a few sittings for a steadier read.`;
    }
    case "aptitude": {
      const top = a.topAptitudes?.[0]?.skill;
      return `Your aptitude across words, numbers, logic and shapes came out at ${a.aptitudePct ?? p}%${top ? `, sharpest in ${top}` : ""} — ${band}. Aptitude shows how quickly you can pick up the skills a field demands.`;
    }
    default:
      return `This area scored ${p}% — ${band}.`;
  }
}

function ProfileRadar({ a }: { a: AssessmentSummary }) {
  const data = a.radar ?? [];
  const [sel, setSel] = useState(0);
  const n = data.length;
  const cx = 150, cy = 150, R = 110;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / n;
  const pt = (i: number, rad: number) => ({ x: cx + rad * Math.cos(angle(i)), y: cy + rad * Math.sin(angle(i)) });
  const rings = [0.25, 0.5, 0.75, 1];
  const ringPath = (frac: number) => data.map((_, i) => { const p = pt(i, R * frac); return `${p.x},${p.y}`; }).join(" ");
  const dataPath = data.map((d, i) => { const p = pt(i, R * (d.score / 100)); return `${p.x},${p.y}`; }).join(" ");
  const selPt = pt(sel, R * ((data[sel]?.score ?? 0) / 100));

  return (
    <section style={S.card}>
      <div style={S.cardTitleRow}>
        <span style={S.cardTitleIc}><Icon name="radar" size={18} /></span>
        <span style={S.cardTitle}>Your profile at a glance</span>
      </div>
      <p style={S.cardSub}>All eight areas on one map. Tap any area to see what it means for you.</p>
      <div style={S.radarWrap}>
        <svg viewBox="0 0 300 300" style={S.radarSvg}>
          {rings.map((f) => <polygon key={f} points={ringPath(f)} fill="none" stroke="#e7eaf0" strokeWidth="1" />)}
          {data.map((_, i) => { const p = pt(i, R); return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#e7eaf0" strokeWidth="1" />; })}
          <polygon points={dataPath} fill="rgba(79,107,158,.18)" stroke={BLUE} strokeWidth="2" strokeLinejoin="round" />
          {data.map((d, i) => { const p = pt(i, R * (d.score / 100)); return <circle key={i} cx={p.x} cy={p.y} r={i === sel ? 6 : 3.5} fill={i === sel ? "#d98324" : BLUE} onClick={() => setSel(i)} style={{ cursor: "pointer" }} />; })}
          {i_labels(data, pt, R, sel, setSel)}
          <circle cx={selPt.x} cy={selPt.y} r="9" fill="none" stroke="#d98324" strokeWidth="2" />
        </svg>
      </div>
      {/* selectable category chips */}
      <div style={S.radarChips}>
        {data.map((d, i) => (
          <button key={d.key} onClick={() => setSel(i)} style={{ ...S.radarChip, ...(i === sel ? S.radarChipOn : {}) }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon name={d.key} size={15} /> {d.label}</span>
            <b style={{ color: i === sel ? "#fff" : BLUE }}>{d.score}</b>
          </button>
        ))}
      </div>
      {/* explanation for the selected category */}
      <div style={S.radarExplain}>
        <div style={S.radarExplainHead}>
          <span style={{ ...S.radarExplainIcon, color: BLUE }}><Icon name={data[sel]?.key ?? "match"} size={22} /></span>
          <span style={S.radarExplainTitle}>{data[sel]?.label}</span>
          <span style={S.radarExplainScore}>{data[sel]?.score}<span style={S.radarExplainScoreSm}>/100</span></span>
        </div>
        <p style={S.radarExplainText}>{explainCategory(data[sel]?.key ?? "", a)}</p>
      </div>
    </section>
  );
}

/** Axis labels around the radar (kept small; abbreviated). */
function i_labels(
  data: { key: string; label: string; score: number }[],
  pt: (i: number, rad: number) => { x: number; y: number },
  R: number,
  sel: number,
  setSel: (i: number) => void
) {
  return data.map((d, i) => {
    const p = pt(i, R + 16);
    const anchor = Math.abs(p.x - 150) < 20 ? "middle" : p.x > 150 ? "start" : "end";
    return (
      <text key={d.key} x={p.x} y={p.y + 3} fontSize="10" fontWeight={i === sel ? 800 : 700}
        fill={i === sel ? "#d98324" : "#94a3b8"} textAnchor={anchor as "middle" | "start" | "end"}
        onClick={() => setSel(i)} style={{ cursor: "pointer" }}>
        {CATEGORY_ABBR[d.key] ?? ""}
      </text>
    );
  });
}

/* --------------------------- small helpers ----------------------------- */
const clamp = (n: number) => Math.max(3, Math.min(100, Math.round(n)));
const hasList = (x?: unknown[]) => Array.isArray(x) && x.length > 0;

function Card({ title, sub, icon, accent, children }: { title: string; sub?: string; icon?: string; accent?: string; children: React.ReactNode }) {
  return (
    <section style={S.card}>
      <div style={S.cardTitleRow}>
        <span style={{ ...S.cardAccent, background: accent || BLUE }} />
        {icon && <span style={{ ...S.cardTitleIc, color: accent || BLUE }}><Icon name={icon} size={18} /></span>}
        <span style={S.cardTitle}>{title}</span>
      </div>
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

const BLUE = "#4f6b9e";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f6f7f9", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  logo: { textDecoration: "none", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  logout: { padding: "8px 16px", background: "#fff", color: "#b91c1c", border: "1px solid #fca5a5", borderRadius: 9, fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  body: { maxWidth: 680, margin: "0 auto", padding: "22px 24px 48px" },
  welcome: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  avatar: { width: 48, height: 48, borderRadius: "50%", background: BLUE, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800 },
  name: { fontSize: 20, fontWeight: 800 },
  email: { fontSize: 13.5, color: "#64748b", marginTop: 2 },

  card: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 16, boxShadow: "0 2px 10px rgba(30,41,59,.04)" },
  cardTitle: { fontSize: 15.5, fontWeight: 800, color: "#0f172a" },
  cardTitleRow: { display: "flex", alignItems: "center", gap: 9, marginBottom: 8 },
  cardAccent: { width: 4, height: 20, borderRadius: 3, flexShrink: 0 },
  cardTitleIc: { color: BLUE, display: "inline-flex", alignItems: "center" },
  cardSub: { fontSize: 13, color: "#94a3b8", margin: "0 0 14px" },
  table: { display: "flex", flexDirection: "column" },
  tr: { display: "flex", justifyContent: "space-between", gap: 16, padding: "11px 0", borderBottom: "1px solid #f1f5f9" },
  tk: { fontSize: 13.5, color: "#64748b", fontWeight: 600 },
  tv: { fontSize: 14.5, color: "#0f172a", fontWeight: 600, textAlign: "right" },

  hero: { background: `linear-gradient(135deg, #3a4f74, #5a76a6)`, color: "#fff", borderRadius: 18, padding: "26px 30px", marginBottom: 16, display: "grid", gridTemplateColumns: "1.25fr .75fr", gap: 22, alignItems: "center", overflow: "hidden" },
  heroLeft: { minWidth: 0 },
  heroArt: { position: "relative", display: "flex", justifyContent: "center" },
  heroImg: { width: "100%", maxWidth: 260, borderRadius: 14, display: "block", boxShadow: "0 16px 40px rgba(0,0,0,.24)" },
  heroKicker: { fontSize: 12, textTransform: "uppercase", letterSpacing: 1, opacity: .85, fontWeight: 700 },
  heroTitle: { fontSize: 25, fontWeight: 800, margin: "6px 0 2px", lineHeight: 1.2 },
  heroDate: { fontSize: 12.5, opacity: .8 },
  fitBubble: { position: "absolute", right: -6, bottom: -6, textAlign: "center", background: "rgba(255,255,255,.95)", color: "#3a4f74", borderRadius: 14, padding: "9px 15px", boxShadow: "0 10px 24px rgba(0,0,0,.2)" },
  fitPct: { fontSize: 24, fontWeight: 800 },
  fitLabel: { fontSize: 10, textTransform: "uppercase", letterSpacing: .5, opacity: .7, fontWeight: 700 },
  heroSummary: { fontSize: 14, lineHeight: 1.6, opacity: .95, margin: "14px 0 0" },
  heroMeta: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 },
  pillDark: { background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.3)", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 700 },
  heroDownload: { display: "inline-flex", alignItems: "center", gap: 7, marginTop: 18, background: "#fff", color: "#3a4f74", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" },

  radarWrap: { display: "flex", justifyContent: "center", margin: "4px 0 10px" },
  radarSvg: { width: "100%", maxWidth: 340, height: "auto" },
  radarChips: { display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 },
  radarChip: { display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 999, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12.5, fontWeight: 600, color: "#475569", cursor: "pointer" },
  radarChipOn: { background: BLUE, borderColor: BLUE, color: "#fff" },
  radarExplain: { background: "#f6f8fb", border: "1px solid #e7eaf0", borderRadius: 12, padding: "16px 18px" },
  radarExplainHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 8 },
  radarExplainIcon: { fontSize: 20 },
  radarExplainTitle: { fontSize: 15.5, fontWeight: 800, color: "#0f172a", flex: 1 },
  radarExplainScore: { fontSize: 22, fontWeight: 800, color: BLUE },
  radarExplainScoreSm: { fontSize: 12, color: "#94a3b8", fontWeight: 600 },
  radarExplainText: { fontSize: 14, lineHeight: 1.65, color: "#475569", margin: 0 },

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
  chip: { background: "#f5f5f5", color: "#3f3f46", borderRadius: 999, padding: "6px 13px", fontSize: 13, fontWeight: 700 },
  chipSub: { color: "#9ca3af", fontWeight: 500 },

  theme: { display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 0", borderTop: "1px solid #f1f5f9" },
  themeBadge: { width: 34, height: 34, borderRadius: 9, background: "#f5f5f5", color: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, flexShrink: 0 },
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
