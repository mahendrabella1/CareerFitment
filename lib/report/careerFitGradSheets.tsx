/**
 * Graduates (UG) Career Fitment report sheets - the analog of
 * careerFit1112Sheets.tsx, matching its page structure and visual density
 * (bar chart -> 3-column overview -> Fitment -> Suitability -> Selector)
 * rather than a thinner, differently-shaped report. The one deliberate
 * content difference (per instruction) is the roadmap shape: 11-12's
 * 14-section per-career deep dive becomes this file's 7-section roadmap
 * (yearly skill-building, govt/private internships, certifications, job
 * roles, PG in India, study abroad, career advancement/PhD) - everything
 * else mirrors 11-12's Fitment/Suitability/Selector concept as closely as
 * the underlying data supports.
 *
 * Two things 11-12's cards show that this file deliberately leaves out
 * rather than fabricating: per-cluster salary bands and "top companies
 * that hire" - both are hand-verified data in careerfit1112.ts
 * (CLUSTER_SALARY/CLUSTER_COMPANIES) with no Graduates equivalent sourced
 * yet. Everything else here (job roles, PG programmes, entrance exams,
 * emerging-course tags) is real data from the two verified Excel sources.
 *
 * Specific-role resolution on the Selector page has two tiers, never
 * fabricating depth we don't have:
 *  - A match against CAREERS_1112 (many of the Career Selector's answers
 *    overlap it, e.g. "Software Engineer") reuses the existing 308-career
 *    11-12 research via detailedRoadmapFor() - real, individually
 *    researched content, just re-rendered in a lighter shape.
 *  - A match against the Excel's own ~3300 job roles with no CAREERS_1112
 *    overlap gets a plain "role snapshot" (title + which cluster/degree
 *    path it sits under) pulled live from Excel fields - no invented
 *    narrative.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import { RANK_COLOURS } from "@/app/account/FullReport";
import { Icon } from "@/app/Icons";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { CAREER_CLUSTERS_18, CLUSTER_ROLES, MASTER_ROWS_GRAD, clusterForDegreeCourse, rolesForDegreeCourse } from "@/lib/report/careerClustersGrad";
import { clusterRoadmapGradFor, type GradClusterRoadmap } from "@/lib/report/clusterRoadmapsGrad";
import { findCareer1112 } from "@/lib/report/careerFitEngine1112";
import { detailedRoadmapFor } from "@/lib/report/careerRoadmapDetailed1112";

const SITE_URL_GRAD = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");

function SecHead({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className="sechd" style={center ? { textAlign: "center" } : undefined}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="sub" style={center ? { marginLeft: "auto", marginRight: "auto" } : undefined}>{sub}</p> : null}
    </div>
  );
}
function PageHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="domhead">
      <span className="domhead-eye">{eyebrow}</span>
      <h2 className="domhead-title">{title}</h2>
      {sub ? <p className="domhead-sub">{sub}</p> : null}
    </div>
  );
}
const BREAK = { marginTop: 34, paddingTop: 28, borderTop: "1px solid var(--line)" } as const;

const CLUSTER_INDEX = new Map(CAREER_CLUSTERS_18.map((c, i) => [c, i]));
function clusterColor(cluster: string): string {
  const i = CLUSTER_INDEX.get(cluster) ?? 0;
  return RANK_COLOURS[i % RANK_COLOURS.length];
}

/** Resolve a Career Selector answer against CAREERS_1112 first (splitting
 *  on "/" in case of a legacy bundle answer), then the Excel's own role
 *  list, returning which tier matched. */
function resolveDesiredCareer(desiredCareer: string): {
  tier: "researched" | "listed" | "none";
  career1112Name?: string;
  excelRow?: { degree: string; course: string; cluster: string };
} {
  if (!desiredCareer) return { tier: "none" };
  const parts = desiredCareer.split("/").map((p) => p.trim()).filter(Boolean);
  for (const part of [desiredCareer, ...parts]) {
    const match = findCareer1112(part);
    if (match) return { tier: "researched", career1112Name: match.name };
  }
  const needle = desiredCareer.toLowerCase();
  for (const row of MASTER_ROWS_GRAD) {
    const hit = row.roles.find((r) => r.toLowerCase() === needle || parts.some((p) => r.toLowerCase() === p.toLowerCase()));
    if (hit) return { tier: "listed", excelRow: { degree: row.degree, course: row.course, cluster: row.cluster } };
  }
  return { tier: "none" };
}

// ---------------------------------------------------------------- Overview table pieces
// Mirrors OverviewHeadCell/OverviewRow/OverviewEmpty/SummitIllustration in
// careerFit1112Sheets.tsx - these take plain primitives (icon name, color,
// rank, score, role-name strings), nothing Career1112-specific, so the
// same visual language carries over directly.
function OverviewHeadCell({ icon, title, subtitle, desc, color, borderLeft }: { icon: string; title: string; subtitle: string; desc: string; color: string; borderLeft?: boolean }) {
  return (
    <div style={{ minWidth: 0, padding: "16px 16px 16px", background: `${color}0f`, borderLeft: borderLeft ? "1px solid rgba(0,0,0,.05)" : "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: `${color}22`, display: "grid", placeItems: "center", flex: "none" }}>
          <Icon name={icon} size={19} style={{ color }} />
        </span>
        <div>
          <div style={{ fontSize: 16.5, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.01em" }}>{title}</div>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color, marginTop: 1 }}>{subtitle}</div>
        </div>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--ink-2)", margin: "10px 0 0", lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}
function OverviewRow({ rank, name, pct, color, roles }: { rank: number; name: string; pct: number; color: string; roles: string[] }) {
  return (
    <div style={{ minWidth: 0, padding: "13px 16px", borderBottom: "1px solid var(--line-2, var(--line))", background: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color, background: `${color}1c`, width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{name}</span>
          <span style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: "-.02em", flex: "none" }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          {roles.map((r) => <span key={r} style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.45 }}>{r}</span>)}
        </div>
      </div>
      <Icon name="chevronRight" size={15} style={{ color: "var(--muted)", flex: "none" }} />
    </div>
  );
}
function OverviewEmpty({ text }: { text: string }) {
  return <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", padding: "20px 14px", margin: 0 }}>{text}</p>;
}
function SummitIllustration() {
  return (
    <div style={{ minWidth: 0, marginTop: "auto", display: "flex", alignItems: "center", gap: 10, padding: "16px 14px 16px" }}>
      <svg width="80" height="60" viewBox="0 0 130 95" style={{ flex: "none" }} aria-hidden="true">
        <path d="M0 95 L30 32 L54 58 L80 18 L108 55 L130 95 Z" fill="#dbe4ee" />
        <path d="M12 95 L50 45 L75 95 Z" fill="#b9c8dc" />
        <path d="M18 92 Q30 74 40 66 T50 46" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85" />
        <line x1="50" y1="46" x2="50" y2="28" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 28 L65 34 L50 40 Z" fill="#d0332c" />
      </svg>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink)", lineHeight: 1.4 }}>Right direction<br />for a brighter tomorrow.</div>
        <div style={{ width: 54, height: 3, background: "#d0332c", borderRadius: 2, marginTop: 5 }} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Concern pointers
// Analog of CONCERN_POINTERS/ConcernPointers in careerFit1112Sheets.tsx,
// keyed to career_cluster_fit:3's own 6 options (data/graduates/
// questions-corrected.json) rather than 11-12's career_fit text.
const GRAD_CONCERN_POINTERS: Record<string, string> = {
  "Choosing a field that does not suit me.": "Your Career Suitability ranking below is built from your measured profile, not a guess - use it as a real check against the field you're leaning toward.",
  "Finding stability, income and growth.": "Every cluster below links to real job roles currently listed in the data, plus how to advance further (PG routes, certifications) - concrete next steps, not just a fit score.",
  "Meeting admission, licensing or certification requirements.": "The Career Selector page ahead lists the exact eligibility, duration and entrance routes for your specific degree.",
  "Affording further education or a career transition.": "Every cluster's roadmap covers government internships and PG entrance routes alongside private options, not just paid ones.",
  "Managing family expectations or relocation.": "The PG-in-India and Study Abroad sections give you real options on both fronts, so you can make the case for whichever direction fits your situation.",
  "Feeling overwhelmed by the number of possible paths.": "Your top-ranked cluster below is where to start - you don't need to evaluate all 18 at once.",
};
function ConcernPointers({ concerns }: { concerns: string[] }) {
  const known = concerns.filter((c) => GRAD_CONCERN_POINTERS[c]);
  if (!known.length) return null;
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, background: "var(--bg, #fafafa)" }}>
      <div className="subhd" style={{ marginBottom: 10 }}>You told us this worries you most</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {known.map((c) => (
          <div key={c} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <b style={{ color: "var(--ink)" }}>{c.replace(/\.$/, "")}</b> - {GRAD_CONCERN_POINTERS[c]}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- Cluster card
// Analog of ClusterSummaryTable's per-domain card in careerFit1112Sheets.tsx
// - same colored-left-border/numbered-badge/score layout, minus the salary
// and "top companies" columns 11-12 has real verified data for and
// Graduates doesn't yet (not fabricated here).
function ClusterCard({ cluster, score, rank }: { cluster: string; score: number; rank: number }) {
  const color = clusterColor(cluster);
  const roles = (CLUSTER_ROLES[cluster] ?? []).slice(0, 6);
  const emergingCount = clusterRoadmapGradFor(cluster)?.emergingAreas.length ?? 0;
  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `4px solid ${color}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: `${color}0a`, borderBottom: "1px solid var(--line)" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 12.5, display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>{cluster}</div>
          {emergingCount > 0 && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 1 }}>🔥 {emergingCount} emerging course{emergingCount > 1 ? "s" : ""} in this cluster</div>}
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: "-.01em" }}>{score.toFixed(0)}%</div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>Fit</div>
        </div>
      </div>
      <div style={{ padding: "14px 18px" }}>
        <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>Key roles</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {roles.map((r) => (
            <span key={r} style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", background: `${color}0c`, border: `1px solid ${color}25`, borderRadius: 8, padding: "5px 10px" }}>{r}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClusterRoadmapView({ r, color }: { r: GradClusterRoadmap; color: string }) {
  const Sec = ({ title, children, skip }: { title: string; children: React.ReactNode; skip?: boolean }) => {
    if (skip) return null;
    return (
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, color, marginBottom: 8 }}>{title}</div>
        {children}
      </div>
    );
  };
  const chip: React.CSSProperties = {
    display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)",
    background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 8, padding: "5px 10px", margin: "0 6px 6px 0",
  };
  return (
    <div>
      <Sec title="What to build each year">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 10 }}><b>Technical:</b> {r.yearlySkillBuilding.technical}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 10 }}><b>Non-technical:</b> {r.yearlySkillBuilding.nonTechnical}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {r.yearlySkillBuilding.years.map((y) => (
            <div key={y.year} style={{ padding: "10px 12px", border: `1px solid ${color}25`, borderRadius: 10, background: `${color}06` }}>
              <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>{y.year}</div>
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>{y.focus}</div>
            </div>
          ))}
        </div>
      </Sec>
      <Sec title="Internships">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 6 }}><b>Government:</b> {r.internships.government}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}><b>Private:</b> {r.internships.private}</p>
      </Sec>
      <Sec title="Certifications in demand"><p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.certifications}</p></Sec>
      <Sec title="Careers you can be hired as">
        <div>{r.jobRoles.map((role) => <span key={role} style={chip}>{role}</span>)}</div>
      </Sec>
      <Sec title="Emerging areas to watch" skip={r.emergingAreas.length === 0}>
        <p style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 10 }}>Specific courses flagged as emerging (2023-26) in current course data, with the real roles they lead to.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {r.emergingAreas.map((e) => (
            <div key={e.course} style={{ padding: "10px 12px", border: `1px solid ${color}25`, borderRadius: 10, background: `${color}06` }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color, marginBottom: 4 }}>{e.course}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-2)" }}>{e.roles.join(" · ")}</div>
            </div>
          ))}
        </div>
      </Sec>
      <Sec title="PG to consider - in India">
        {r.pgInIndia.note ? (
          <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.pgInIndia.note}</p>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>{r.pgInIndia.programmes.map((p) => <span key={p} style={chip}>{p}</span>)}</div>
            {r.pgInIndia.entranceExams.length > 0 && (
              <p style={{ fontSize: 12, color: "var(--ink-2)" }}><b>Entrance routes:</b> {r.pgInIndia.entranceExams.join(" · ")}</p>
            )}
          </>
        )}
      </Sec>
      <Sec title="Study abroad"><p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.studyAbroad}</p></Sec>
      <Sec title="Going forward - career advancement" skip={!!r.careerAdvancement.note && r.careerAdvancement.phdProgrammes.length === 0}>
        {r.careerAdvancement.note && <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 8 }}>{r.careerAdvancement.note}</p>}
        {r.careerAdvancement.phdProgrammes.length > 0 && (
          <div style={{ marginBottom: 8 }}>{r.careerAdvancement.phdProgrammes.map((p) => <span key={p} style={chip}>{p}</span>)}</div>
        )}
        {r.careerAdvancement.phdRoles.length > 0 && (
          <p style={{ fontSize: 12, color: "var(--ink-2)" }}><b>Roles this can lead to:</b> {r.careerAdvancement.phdRoles.slice(0, 8).join(" · ")}</p>
        )}
      </Sec>
    </div>
  );
}

export function buildCareerFitGradSheets(output: GraduateScoreOutput): ReportSheet[] {
  const { clusterAffinities, academicContext, aspiration } = output;

  // Fitment: pure measured-profile ranking (computedScore only), ignoring
  // both self-report and current degree entirely - "what fits you" with no
  // filter for what's currently reachable, same framing as 11-12's Fitment.
  const fitmentRanked = [...clusterAffinities].sort((a, b) => b.computedScore - a.computedScore);

  // Suitability: the SAME clusters, boosted toward what's actually
  // reachable from the student's real degree+course (the closest Graduates
  // equivalent to 11-12's "stream-filtered, Native Fit only" Suitability) -
  // on top of the existing self-report bonus already in blendedScore.
  const degreeCluster = clusterForDegreeCourse(academicContext.degree, academicContext.course);
  const suitabilityRanked = [...clusterAffinities]
    .map((c) => ({ ...c, suitabilityScore: Math.min(100, c.blendedScore + (c.cluster === degreeCluster ? 20 : 0)) }))
    .sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const topCluster = suitabilityRanked[0]?.cluster ?? "";
  const genericRoadmap = clusterRoadmapGradFor(topCluster);
  const resolved = resolveDesiredCareer(aspiration.desiredCareer);
  const detailedRoadmap = resolved.tier === "researched" ? detailedRoadmapFor(resolved.career1112Name) : null;
  const degreeRoles = rolesForDegreeCourse(academicContext.degree, academicContext.course);

  const roleChipsFor = (cluster: string) => (CLUSTER_ROLES[cluster] ?? []).slice(0, 3);

  const sheets: ReportSheet[] = [
    {
      id: "career-clusters-bar-grad",
      kicker: "Your career cluster fit",
      node: (
        <>
          <PageHead eyebrow="Across the standard career clusters" title="Your Career Cluster Fit"
            sub="How strongly your measured interests, aptitude and strengths line up with each of the 18 career clusters - the same industry-standard groupings used across career guidance, not a scheme unique to this report." />
          <div style={{ marginTop: 24, border: "1px solid var(--line)", borderRadius: 13, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
            {fitmentRanked.filter((c) => c.computedScore > 0).map((c) => (
              <div key={c.cluster} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 200, fontSize: 12, fontWeight: 700, color: "var(--ink)", flex: "none" }}>{c.cluster}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ height: 10, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                    <div style={{ width: `${c.computedScore}%`, height: "100%", background: clusterColor(c.cluster) }} />
                  </div>
                </div>
                <div style={{ width: 40, textAlign: "right", fontSize: 12, fontWeight: 800, color: clusterColor(c.cluster), flex: "none" }}>{c.computedScore.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "career-overview-table-grad",
      kicker: "Overview",
      node: (
        <>
          <PageHead eyebrow="Fitment · Suitability · Selector, side by side" title="Your Career Path at a Glance"
            sub="Compare what fits you, what fits your actual degree, and explore your ideal career - all in one view." />
          <div className="full-bleed" style={{ marginTop: 22, border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.05), 0 10px 26px rgba(0,0,0,.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <OverviewHeadCell icon="score" title="Career Fitment" subtitle="What fits you" desc="Clusters that align with your interests and strengths." color="#2f6bff" />
              <OverviewHeadCell icon="cap" title="Career Suitability" subtitle="What fits your degree" desc="Clusters that match your actual degree and course." color="#12996b" borderLeft />
              <OverviewHeadCell icon="match" title="Career Selector" subtitle="Your desired career" desc="Your most suitable career based on your profile." color="#e08a1e" borderLeft />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ minWidth: 0 }}>
                {fitmentRanked.slice(0, 5).some((c) => c.computedScore > 0) ? fitmentRanked.slice(0, 5).map((c, i) => (
                  <OverviewRow key={c.cluster} rank={i + 1} name={c.cluster} pct={c.computedScore} color="#2f6bff" roles={roleChipsFor(c.cluster)} />
                )) : <OverviewEmpty text="No matches yet." />}
              </div>
              <div style={{ minWidth: 0, borderLeft: "1px solid var(--line)" }}>
                {suitabilityRanked.slice(0, 5).map((c, i) => (
                  <OverviewRow key={c.cluster} rank={i + 1} name={c.cluster} pct={c.suitabilityScore} color="#12996b" roles={roleChipsFor(c.cluster)} />
                ))}
              </div>
              <div style={{ minWidth: 0, borderLeft: "1px solid var(--line)", background: "#fef9f2", display: "flex", flexDirection: "column" }}>
                {aspiration.desiredCareer ? (
                  <div style={{ minWidth: 0, padding: "14px 14px 0", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ minWidth: 0, border: "1px solid #e08a1e38", background: "#fff", borderRadius: 12, padding: "16px 14px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{academicContext.degree || "Your degree"}</div>
                        <div style={{ fontSize: 17, color: "#e08a1e", margin: "4px 0" }}>↓</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.01em", wordBreak: "break-word" }}>{aspiration.desiredCareer}</div>
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 10, fontStyle: "italic", textAlign: "center" }}>The realistic path and simple next steps are on the Career Selector page ahead.</div>
                    </div>
                    <SummitIllustration />
                  </div>
                ) : (
                  <OverviewEmpty text="You didn't name a specific career on the pre-exam screen." />
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "career-fitment-grad",
      kicker: "Career fitment",
      node: (
        <>
          <PageHead eyebrow="What fits YOU" title="Career Fitment"
            sub="Your top 5 clusters, ranked purely by your assessment - ignores your degree entirely. This is what your interests, aptitude and strengths point toward, with no filter for what's currently reachable. Career Suitability, next, applies the real-world degree filter." />
          <div style={{ marginTop: 20 }}>
            <ConcernPointers concerns={aspiration.concerns} />
            {fitmentRanked.slice(0, 5).map((c, i) => <ClusterCard key={c.cluster} cluster={c.cluster} score={c.computedScore} rank={i + 1} />)}
          </div>
          <p className="disclaimer" style={{ marginTop: 16 }}>
            You're free to explore any career, in any cluster - this is a starting point, not a fixed path.
          </p>
        </>
      ),
    },
    {
      id: "career-suitability-grad",
      kicker: "Career suitability",
      node: (
        <>
          <PageHead eyebrow="What's realistic for your degree" title="Career Suitability"
            sub={`Your top clusters once ${academicContext.degree || "your current degree"} is factored in - same ranking as Career Fitment, boosted toward what your actual degree and course realistically reach.`} />
          {degreeRoles.length > 0 && (
            <div style={{ marginTop: 20, marginBottom: 20, border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", background: "var(--bg, #fafafa)" }}>
              <div className="subhd" style={{ marginBottom: 8 }}>Roles {academicContext.course || "your course"} can lead to right now</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {degreeRoles.slice(0, 12).map((r) => (
                  <span key={r} style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", background: "#fff", border: "1px solid var(--line)", borderRadius: 8, padding: "5px 10px" }}>{r}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ marginTop: 20 }}>
            {suitabilityRanked.slice(0, 5).map((c, i) => <ClusterCard key={c.cluster} cluster={c.cluster} score={c.suitabilityScore} rank={i + 1} />)}
          </div>
        </>
      ),
    },
    {
      id: "career-selector-grad",
      kicker: "Career selector",
      node: (
        <>
          <PageHead eyebrow="Your favourite career path" title="Career Selector"
            sub={aspiration.desiredCareer
              ? `${aspiration.desiredCareer} - your starting point, and the full journey to get there.`
              : "You didn't name a career - the roadmap ahead is built from your own Career Suitability results instead."} />

          {aspiration.desiredCareer && (
            <div style={{ marginTop: 20 }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 18, flexWrap: "wrap",
                padding: "22px 24px", borderRadius: 16, marginBottom: 20,
                background: `linear-gradient(135deg, ${clusterColor(topCluster)}14, ${clusterColor(topCluster)}05)`,
                border: `1px solid ${clusterColor(topCluster)}38`,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>You are here</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)", marginTop: 4 }}>{academicContext.degree || "Your degree"}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{academicContext.course}</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: clusterColor(topCluster) }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>Your destination</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: clusterColor(topCluster), marginTop: 4 }}>{aspiration.desiredCareer}</div>
                </div>
              </div>

              {detailedRoadmap && resolved.career1112Name && (
                <div style={{ marginBottom: 20 }}>
                  <SecHead center eyebrow="In-depth roadmap" title={resolved.career1112Name}
                    sub="Real, individually researched detail for this specific role." />
                  <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
                    {detailedRoadmap.jobOptions.length > 0 && (
                      <div><b style={{ fontSize: 12, color: "var(--ink)" }}>Job options:</b> <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{detailedRoadmap.jobOptions.slice(0, 8).join(", ")}</span></div>
                    )}
                    {detailedRoadmap.internships.length > 0 && (
                      <div><b style={{ fontSize: 12, color: "var(--ink)" }}>Internships:</b> <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{detailedRoadmap.internships.slice(0, 6).join(" · ")}</span></div>
                    )}
                    {detailedRoadmap.skills.length > 0 && (
                      <div><b style={{ fontSize: 12, color: "var(--ink)" }}>Skills & certifications:</b> <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{detailedRoadmap.skills.slice(0, 8).join(", ")}</span></div>
                    )}
                    {detailedRoadmap.pgSpecialization.length > 0 && (
                      <div><b style={{ fontSize: 12, color: "var(--ink)" }}>PG & specialization:</b> <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{detailedRoadmap.pgSpecialization.slice(0, 6).join(", ")}</span></div>
                    )}
                    {(detailedRoadmap.abroadEducation.length > 0 || detailedRoadmap.abroadJobs.length > 0) && (
                      <div><b style={{ fontSize: 12, color: "var(--ink)" }}>Abroad:</b> <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{[...detailedRoadmap.abroadEducation, ...detailedRoadmap.abroadJobs].slice(0, 6).join(", ")}</span></div>
                    )}
                  </div>
                </div>
              )}
              {resolved.tier === "listed" && resolved.excelRow && (
                <div style={{ marginBottom: 20, fontSize: 12.5, color: "var(--ink-2)" }}>
                  This role appears under <b style={{ color: "var(--ink)" }}>{resolved.excelRow.degree}</b> ({resolved.excelRow.course}) in the {resolved.excelRow.cluster} cluster - we don't have in-depth researched detail for this specific role yet, so the cluster-wide roadmap below is your best guide.
                </div>
              )}

              <div style={BREAK}>
                <SecHead center eyebrow="Where to go next" title="Explore internships"
                  sub="Live internship listings on your own OneGrasp dashboard." />
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  <a href={`${SITE_URL_GRAD}/account/internships-new`} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: clusterColor(topCluster), padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>Browse live internships on your dashboard ↗</a>
                </div>
              </div>
            </div>
          )}

          {/* Generic, cluster-wide roadmap for the student's top-ranked
              Career Suitability cluster - always shown regardless of
              whether their desired career resolved to researched data,
              same domain-generic-always-shown pattern as 11-12's Career
              Selector page. */}
          {genericRoadmap && (
            <div style={{ ...BREAK, marginTop: 20 }}>
              <SecHead center eyebrow={`${topCluster} · your best-fit cluster`} title="Your realistic path"
                sub="The standard path into this cluster - the same realistic route for anyone in this field, not built around one specific job title." />
              <div style={{ marginTop: 16 }}>
                <ClusterRoadmapView r={genericRoadmap} color={clusterColor(topCluster)} />
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  return sheets;
}
