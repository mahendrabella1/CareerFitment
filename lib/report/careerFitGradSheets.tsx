/**
 * Graduates (UG) Career Fitment report sheets - the analog of
 * careerFit1112Sheets.tsx: cluster-affinity ranking, academic snapshot, and
 * the Career Selector page (generic cluster-wide roadmap, always shown for
 * the student's top cluster + a specific-role roadmap when their typed
 * desired career resolves to something we have real data for).
 *
 * Specific-role resolution deliberately has two tiers, never fabricating
 * depth we don't have:
 *  - A match against CAREERS_1112 (many of the Career Selector's bundles
 *    overlap it, e.g. "Software Engineer / AI Engineer") reuses the
 *    existing 308-career 11-12 research via detailedRoadmapFor() - real,
 *    individually researched content, just re-rendered in a lighter shape.
 *  - A match against the Excel's own ~3300 job roles with no CAREERS_1112
 *    overlap gets a plain "role snapshot" (title + which cluster/degree
 *    path it sits under) pulled live from Excel fields - no invented
 *    narrative.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import { RANK_COLOURS } from "@/app/account/FullReport";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { CAREER_CLUSTERS_18, MASTER_ROWS_GRAD } from "@/lib/report/careerClustersGrad";
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

/** Resolve a Career Selector answer (a bundle like "Software Engineer / AI
 *  Engineer", or free text if "Other" was picked) against CAREERS_1112
 *  first (splitting on "/" to try each half), then the Excel's own role
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
  const topCluster = clusterAffinities[0]?.cluster ?? "";
  const genericRoadmap = clusterRoadmapGradFor(topCluster);
  const resolved = resolveDesiredCareer(aspiration.desiredCareer);
  const detailedRoadmap = resolved.tier === "researched" ? detailedRoadmapFor(resolved.career1112Name) : null;

  const sheets: ReportSheet[] = [
    {
      id: "career-cluster-fit-grad",
      kicker: "Career suitability",
      node: (
        <>
          <PageHead eyebrow="Where your profile points" title="Your Best-Fit Career Clusters"
            sub="Ranked from your measured Personality/RIASEC/Strengths profile, with a boost for clusters you named yourself below." />
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
            {clusterAffinities.slice(0, 8).map((c, i) => (
              <div key={c.cluster} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 22, fontSize: 12, fontWeight: 800, color: "var(--muted)" }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>
                    {c.cluster}{c.selfReported && <span style={{ marginLeft: 8, fontSize: 10.5, fontWeight: 700, color: clusterColor(c.cluster) }}>· you named this too</span>}
                  </div>
                  <div style={{ height: 8, borderRadius: 999, background: "var(--line)", overflow: "hidden" }}>
                    <div style={{ width: `${c.blendedScore}%`, height: "100%", background: clusterColor(c.cluster) }} />
                  </div>
                </div>
                <div style={{ width: 40, textAlign: "right", fontSize: 12.5, fontWeight: 800, color: clusterColor(c.cluster) }}>{c.blendedScore}%</div>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "academic-snapshot-grad",
      kicker: "Where you are now",
      node: (
        <>
          <PageHead eyebrow="Your current academic position" title="Academic Snapshot" />
          <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            {[
              ["Field", academicContext.domain], ["Degree", academicContext.degree],
              ["Course", academicContext.course], ["Year", academicContext.year],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 12 }}>
                <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{value || "-"}</div>
              </div>
            ))}
          </div>
          {academicContext.entranceInfo && (
            <div style={{ marginTop: 16, fontSize: 12.5, color: "var(--ink-2)" }}>
              <b style={{ color: "var(--ink)" }}>Your degree:</b> {academicContext.entranceInfo.duration} · Eligibility: {academicContext.entranceInfo.eligibility} · Entrance routes: {academicContext.entranceInfo.entranceExams}
            </div>
          )}
          <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink-2)" }}>
            You said <b style={{ color: "var(--ink)" }}>{academicContext.satisfactionSource || "your coursework"}</b> gives you the most satisfaction, rating your overall satisfaction {academicContext.satisfactionScore}/10.
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
