"use client";

/**
 * The Class 11-12 Career Fitment / Career Suitability / Career Selector
 * pages — replaces FullReport.tsx's shared 15-domain "Best-fit Domains"
 * section for classes 11/12 (see hideCareerFitSections there) and the older,
 * simpler "snapshot-stream-fit" / "career-suitability" / "career-selector-
 * match" sheets this file used to share space with in class11ExtraSheets.tsx
 * (removed from there — this is a straight replacement, not an addition, to
 * avoid showing two disagreeing rankings in one report).
 *
 * Four pages, each a full page rather than a cramped column — the original
 * 3-column-on-one-page layout (matching the mapping kit's own mockup) didn't
 * have room for real per-role detail, and a bare list of role names isn't
 * useful on its own: a student needs to know what degree gets them there,
 * not just the job title.
 *
 *  1. Career Fitment — top 5 domains ranked purely against the student's
 *     measured profile (ignores stream entirely), 5 roles per domain, each
 *     with its match score, typical degree and entrance exam. Domain-level
 *     salary (India/Abroad) shown once per domain.
 *  2. Career Suitability — the same ranking, kept to only what the
 *     student's actual stream can reach (Native Fit). Same per-role detail.
 *  3. Career Selector — the specific career the student named: current
 *     stream, fit type, where it ranks in their own Fitment list, its
 *     typical degree/exam, close alternatives in the same domain, and the
 *     full step-by-step roadmap.
 *  4. Class 12 only — estimated exam score shown as context (never a
 *     filter — the mapping kit's own Report_Sections_Logic is explicit that
 *     "the score itself is ignored for matching"), plus a WIDENED
 *     suitability list (Native Fit + Bridge) with the same rich per-role
 *     detail, so a stream like PCB shows real breadth, not just the one
 *     obvious path. Matches the kit's own guidance: "this is just Career
 *     Suitability with a wider candidate pool — no new engine needed."
 *
 * Ranking logic lives in lib/report/careerFitEngine1112.ts; the domain/
 * career/roadmap/degree/salary data itself in lib/report/careerfit1112.ts.
 * Visual language reuses class11ExtraSheets.tsx's own primitives so this
 * reads as the same report, not a bolted-on second design.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import type { Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";
import { Icon } from "@/app/Icons";
import { Ring, SkillBar, C } from "@/app/account/viz";
import { RANK_COLOURS } from "@/app/account/FullReport";
import {
  rankFitment1112, rankSuitability1112, groupByDomain1112, groupByCluster1112, selectCareer1112,
  skillTagsFor1112, buildCareer20YearRoadmap,
  type DomainGroup1112, type RankedCareer1112, type RoadmapPhase1112,
} from "@/lib/report/careerFitEngine1112";
import { DOMAINS_1112, STANDARD_CLUSTERS, CLUSTER_EXPLORE_LINKS, CLUSTER_COMPANIES, CLUSTER_FUNDED_PROGRAMS, CAREERS_1112, STREAM_KEY_1112, roadmapFor, type RoadmapEntry, type Career1112, type StreamKey1112, type StandardCluster } from "@/lib/report/careerfit1112";
import { CLUSTER_ROADMAPS } from "@/lib/report/clusterRoadmaps1112";
import { degreesForStream, ELIGIBILITY_SYMBOL, ELIGIBILITY_LABEL, type DegreeEligibilityRow } from "@/lib/report/degreeStreamMatrix";
import { topDimensionsForStudent, type ScoredDimension } from "@/lib/report/dimensionCareerGuide";
import { percentileBandFor } from "@/lib/report/jeePercentileGuide";

// Same fallback pattern as lib/studentEmail.ts's SITE_URL — this report can
// be viewed as a downloaded/emailed PDF, not just in-app, so links into the
// dashboard (e.g. the internships listing) need an absolute URL, not a
// relative path that would 404 outside the app shell.
const SITE_URL_1112 = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");

// A distinct icon + a stable colour per STANDARD CLUSTER (the 16 National
// Career Clusters — see careerfit1112.ts's StandardCluster) so these pages
// read as illustrated cards rather than plain bordered text. 16 distinct
// hues rather than cycling the report's 5-colour RANK_COLOURS — cycling
// would give 3+ clusters the identical colour on the bar chart, which reads
// as a bug there in a way it doesn't on a single top-5 list.
const CLUSTER_COLOURS: Record<string, string> = {
  "STEM": "#12996b", "Information Technology": "#2f6bff", "Health Science": "#e0475c",
  "Finance": "#e08a1e", "Business Management & Administration": "#8b5cf6",
  "Law, Public Safety, Corrections & Security": "#64748b", "Human Services": "#0d9488",
  "Arts, A/V Technology & Communications": "#c026d3", "Architecture & Construction": "#a16207",
  "Government & Public Administration": "#334155", "Hospitality & Tourism": "#db2777",
  "Agriculture, Food & Natural Resources": "#4d7c0f", "Education & Training": "#0891b2",
  "Marketing": "#ea580c", "Manufacturing": "#475569", "Transportation, Distribution & Logistics": "#1d4ed8",
};
const CLUSTER_ICON: Record<string, string> = {
  "STEM": "combine", "Information Technology": "cpu", "Health Science": "heart",
  "Finance": "lock", "Business Management & Administration": "briefcase",
  "Law, Public Safety, Corrections & Security": "shield", "Human Services": "personality",
  "Arts, A/V Technology & Communications": "star", "Architecture & Construction": "expand",
  "Government & Public Administration": "flag", "Hospitality & Tourism": "compass",
  "Agriculture, Food & Natural Resources": "check", "Education & Training": "school",
  "Marketing": "signpost", "Manufacturing": "combine", "Transportation, Distribution & Logistics": "route",
};
function clusterColor(cluster: string): string {
  return CLUSTER_COLOURS[cluster] ?? RANK_COLOURS[0];
}
function clusterIcon(cluster: string): string {
  return CLUSTER_ICON[cluster] ?? "match";
}

// The OLD 27-domain colour/icon lookup — kept only for the "every degree
// open to you" section below (DegreeCategoryBlock), which is still keyed on
// DOMAINS_1112 via degreeStreamMatrix.ts's own `salaryDomain` field and
// wasn't part of this cluster redesign. Everything else in this file uses
// the cluster-keyed helpers above.
const DOMAIN_ORDER = new Map(DOMAINS_1112.map((d, i) => [d.name, i]));
function domainColor(domain: string): string {
  const i = DOMAIN_ORDER.get(domain) ?? 0;
  return RANK_COLOURS[i % RANK_COLOURS.length];
}

// The same colour chip + icon treatment every illustrated card in this
// report uses for its header — reused here so a domain/cluster block reads
// as one system with DomainCard, not a second visual language.
function DomainChip({ domain, size = 30, kind = "cluster" }: { domain: string; size?: number; kind?: "cluster" | "domain" }) {
  const color = kind === "cluster" ? clusterColor(domain) : domainColor(domain);
  const icon = kind === "cluster" ? clusterIcon(domain) : "match";
  return (
    <span style={{ width: size, height: size, borderRadius: size * 0.32, background: `${color}18`, display: "grid", placeItems: "center", flex: "none" }}>
      <Icon name={icon} size={size * 0.52} style={{ color }} />
    </span>
  );
}

// `center` is used on Career Selector's sub-sections specifically — that
// page reads as one continuous explainer rather than a table-dense report
// page, so its sub-headings match the big centred PageHead above them
// instead of the left-aligned style the denser Fitment/Suitability/JEE
// pages use (kept as-is there — centering every heading on those genuinely
// table-heavy pages wouldn't read better, just different).
function SecHead({ eyebrow, title, sub, center }: { eyebrow: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className="sechd" style={center ? { textAlign: "center" } : undefined}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub ? <p className="sub" style={center ? { marginLeft: "auto", marginRight: "auto" } : undefined}>{sub}</p> : null}
    </div>
  );
}

// A big, centred heading — reuses the SAME .domhead/.domhead-eye/
// .domhead-title/.domhead-sub classes FullReport.tsx's own "Your top 5
// domains" page already uses, so this matches the rest of the report's
// established large-title style instead of introducing a second one.
function PageHead({ eyebrow, title, sub }: { icon?: string; eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="domhead">
      <span className="domhead-eye">{eyebrow}</span>
      <h2 className="domhead-title">{title}</h2>
      {sub ? <p className="domhead-sub">{sub}</p> : null}
    </div>
  );
}

const BREAK = { marginTop: 34, paddingTop: 28, borderTop: "1px solid var(--line)" } as const;

const TONE = {
  good: { tone: "#1f7a55", bg: "#eaf6f0", border: "#cdeadb" },
  mid: { tone: "#8a5b00", bg: "#fdf3dd", border: "#f3dfab" },
  bad: { tone: "#b3261e", bg: "#fdecec", border: "#f6c9c9" },
};

function toneForFitType(fitType: string): { tone: string; bg: string; border: string } {
  if (fitType === "Native Fit") return TONE.good;
  if (fitType.startsWith("Bridge")) return TONE.mid;
  return TONE.bad;
}

function Pill({ label, tone }: { label: string; tone: { tone: string; bg: string; border: string } }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999,
      color: tone.tone, background: tone.bg, border: `1px solid ${tone.border}`, whiteSpace: "nowrap",
    }}>{label}</span>
  );
}

const DOMAIN_SALARY = new Map<string, { india: string; abroad: string }>(DOMAINS_1112.map((d) => [d.name, { india: d.salaryIndia, abroad: d.salaryAbroad }]));
const CLUSTER_SALARY = new Map<string, { india: string; abroad: string }>(STANDARD_CLUSTERS.map((d) => [d.name, { india: d.salaryIndia, abroad: d.salaryAbroad }]));

const th: React.CSSProperties = { textAlign: "left", padding: "9px 10px", fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#fff", background: "#2c3e50" };
const td: React.CSSProperties = { padding: "10px 10px", fontSize: 12, color: "var(--ink-2)", borderBottom: "1px solid var(--line-2, var(--line))", verticalAlign: "middle" };

// The overview page's 3 lenses share ONE outer border and ONE header bar
// (like a real <table>'s <thead>) rather than 3 separately-boxed panels —
// column dividers (border-left on the body columns) connect the header cells
// straight down into the body, so this reads as one table. The body columns
// still size independently (grid + align-items:start, no rowSpan/shared
// row-height) — a rowSpan=5 Selector cell next to two 5-row lists of very
// different lengths is what left a large dead gap before.
function OverviewHeadCell({ title, subtitle, color, borderLeft }: { title: string; subtitle: string; color: string; borderLeft?: boolean }) {
  return (
    <div style={{ padding: "11px 14px", borderLeft: borderLeft ? "1px solid rgba(255,255,255,.14)" : "none", borderBottom: `3px solid ${color}` }}>
      <div style={{ fontSize: 13.5, fontWeight: 800, color: "#fff" }}>{title}</div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color, marginTop: 2 }}>{subtitle}</div>
    </div>
  );
}
function OverviewRow({ rank, name, pct, color, roles }: { rank: number; name: string; pct: number; color: string; roles: string }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--line-2, var(--line))", borderLeft: `3px solid ${color}`, background: rank % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
      <span style={{ fontSize: 10.5, fontWeight: 800, color: "var(--muted)", flex: "none", width: 14 }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink)" }}>{name}</span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color }}>{pct.toFixed(0)}%</span>
        </div>
        <div style={{ fontSize: 10.5, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.5 }}>{roles}</div>
      </div>
    </div>
  );
}
function OverviewEmpty({ text }: { text: string }) {
  return <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", padding: "20px 14px", margin: 0 }}>{text}</p>;
}
// A vertical down-arrow timeline for the Selector panel's brief roadmap
// preview — each step is its own flush, bordered row (matching the table
// language above) joined by an actual "↓" connector so this still reads as
// one continuous journey, not just a divided list.
/** `full` shows every point per phase (the Career Selector page's own
 *  "simple steps" section) instead of just the headline point (the Overview
 *  table's compact preview column). */
function OverviewRoadmapPreview({ phases, color, full }: { phases: RoadmapPhase1112[]; color: string; full?: boolean }) {
  return (
    <div style={{ marginTop: 10 }}>
      {phases.map((p, i) => (
        <div key={p.period}>
          <div style={{ padding: "9px 14px", borderTop: "1px solid var(--line-2, var(--line))", background: i % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
            <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color }}>{p.period}</div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--ink)", marginTop: 2 }}>{p.title}</div>
            {full ? (
              <ul style={{ margin: "5px 0 0", paddingLeft: 16, display: "flex", flexDirection: "column", gap: 4 }}>
                {p.points.map((pt) => <li key={pt} style={{ fontSize: 10.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{pt}</li>)}
              </ul>
            ) : (
              <div style={{ fontSize: 10.5, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.45 }}>{p.points[0]}</div>
            )}
          </div>
          {i < phases.length - 1 && (
            <div style={{ textAlign: "center", fontSize: 13, fontWeight: 800, color, lineHeight: 1, padding: "2px 0" }}>↓</div>
          )}
        </div>
      ))}
    </div>
  );
}

const VERDICT_TONE: Record<string, { c: string; bg: string }> = {
  "Top Choice": { c: "#1f7a55", bg: "#eaf6f0" },
  "Good Choice": { c: "#1f7a55", bg: "#eaf6f0" },
  "Worth Considering": { c: "#2a5aa0", bg: "#eaf1fb" },
  "Needs Preparation": { c: "#a3620b", bg: "#fdf3dd" },
  "Worth Exploring": { c: "#2a5aa0", bg: "#eaf1fb" },
  "Not Recommended": { c: "#b3261e", bg: "#fdecec" },
};
function verdictColor(v: string): string { return VERDICT_TONE[v]?.c ?? "var(--ink-2)"; }

// "Developing"/"Emerging" instead of a blunt "Low"/"Very Low" — same
// reasoning as bandOf() in FullReport.tsx: a below-average score should
// read as a stage, not a verdict on the student.
function LevelLabel(v: number): string {
  if (v >= 75) return "Very High";
  if (v >= 65) return "High";
  if (v >= 50) return "Average";
  if (v >= 35) return "Developing";
  return "Emerging";
}


// One axis's mini-bar (used for both Psy. Analysis and Skill & Abilities) —
// a level word + numeric score above a coloured SkillBar, exactly the shape
// the reference "Career Paths" table uses for each of its two score columns.
function AxisCell({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ minWidth: 110 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", marginBottom: 4 }}>{LevelLabel(value)}:{value}</div>
      <SkillBar value={value} color={color} height={7} />
    </div>
  );
}

// The roles inside a domain, as a literal table matching the reference
// "Career Paths" cluster format exactly: Career Path | Psy. Analysis |
// Skill and Abilities | Comment — two SEPARATE axes (not one blended score)
// so a role that scores well on ability but poorly on genuine interest
// reads honestly as "Worth Considering"/"Needs Preparation", not a misleading "Top Choice".
// See scoreCareerAxes1112()/verdictFor1112() in careerFitEngine1112.ts.
function RolesTable({ careers }: { careers: RankedCareer1112[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...th, width: 34 }}>#</th>
            <th style={th}>Career Path</th>
            <th style={{ ...th, width: 130 }}>Psy. Analysis</th>
            <th style={{ ...th, width: 130 }}>Skill and Abilities</th>
            <th style={{ ...th, width: 90 }}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {careers.map((r, i) => (
            <tr key={r.career.id} style={{ background: i % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
              <td style={{ ...td, color: "var(--muted)", fontWeight: 700 }}>{i + 1}</td>
              <td style={td}>
                <div style={{ fontWeight: 800, color: "var(--ink)" }}>{r.career.name}</div>
                <div style={{ fontSize: 11, color: "var(--ink-2)", marginTop: 3, lineHeight: 1.4, maxWidth: 320 }}>{r.career.description}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 3 }}>{r.career.typicalDegree}</div>
              </td>
              <td style={td}><AxisCell value={r.interest} color={verdictColor(r.verdict)} /></td>
              <td style={td}><AxisCell value={r.skill} color="#2f6bff" /></td>
              <td style={{ ...td, fontWeight: 800, color: verdictColor(r.verdict) }}>{r.verdict}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// The old approach pulled these from MI1/MI2/keyAptitude (e.g.
// "Logical-Mathematical", "Numerical Reasoning") — psychometric TRAIT
// labels, not things a student can actually go learn, and since ~44% of all
// 332 careers share Logical-Mathematical as their #1 code, an analytically-
// leaning student saw nearly the same 3-5 tags repeat across STEM, Finance,
// IT and Law alike, which read as broken, not just generic. CLUSTER_ROADMAPS'
// own "Skills I acquire" section (phase 2, "I CAN STUDY") is genuinely
// concrete and cluster-specific real content already written for every
// cluster — Python/Git/DSA for IT vs financial modelling/Excel for Finance —
// so this reuses that instead of re-deriving something weaker.
function clusterCoreSkills(cluster: string): string[] {
  const phase2 = CLUSTER_ROADMAPS[cluster as StandardCluster]?.phases.find((p) => p.code === "02");
  const skills = phase2?.sections.find((s) => s.heading === "Skills I acquire")?.items;
  return skills?.length ? skills.slice(0, 5) : [];
}

// The compact "at a glance" table version of a domain-group list — S.No ·
// Domain · Roles · Skills · Salaries · Explore, one row per cluster, as
// requested for the top of the Fitment/Suitability pages. The detailed
// per-role Psy.Analysis/Skill/Comment breakdown (DomainBlock/RolesTable)
// still follows underneath for anyone digging into a specific role, so
// this is a lead-in summary, not a replacement for that existing detail.
function ClusterSummaryTable({ groups, showCompanies }: { groups: DomainGroup1112[]; showCompanies?: boolean }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 10 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...th, width: 36 }}>S.No</th>
            <th style={th}>Domain</th>
            <th style={th}>Roles (fit %)</th>
            <th style={th}>Skills to acquire</th>
            <th style={th}>Salaries (India)</th>
            {showCompanies && <th style={th}>Companies that hire</th>}
            <th style={{ ...th, width: 150 }}>Explore</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((g, i) => {
            const sal = CLUSTER_SALARY.get(g.domain);
            const links = CLUSTER_EXPLORE_LINKS[g.domain as keyof typeof CLUSTER_EXPLORE_LINKS] ?? [];
            const companies = CLUSTER_COMPANIES[g.domain as keyof typeof CLUSTER_COMPANIES];
            return (
              <tr key={g.domain} style={{ background: i % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
                <td style={{ ...td, fontWeight: 800, color: "var(--muted)", textAlign: "center" }}>{i + 1}</td>
                <td style={{ ...td, borderLeft: `3px solid ${clusterColor(g.domain)}`, fontWeight: 800, color: "var(--ink)" }}>{g.domain}</td>
                <td style={{ ...td, fontSize: 11 }}>{g.careers.slice(0, 4).map((c) => `${c.career.name} (${c.interest}%)`).join(", ")}</td>
                <td style={{ ...td, fontSize: 11 }}>{clusterCoreSkills(g.domain).join(", ") || "—"}</td>
                <td style={{ ...td, fontSize: 11 }}>{sal?.india ?? "—"}</td>
                {showCompanies && (
                  <td style={{ ...td, fontSize: 10.5 }}>
                    {companies ? (
                      <>
                        <div><b style={{ color: "var(--ink)" }}>Regular:</b> {companies.regular.join(", ")}</div>
                        <div style={{ marginTop: 3 }}><b style={{ color: "var(--ink)" }}>Govt:</b> {companies.govt.join(", ")}</div>
                      </>
                    ) : <span style={{ color: "var(--muted)" }}>Not researched yet</span>}
                  </td>
                )}
                <td style={td}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, fontWeight: 700, color: clusterColor(g.domain), textDecoration: "none" }}>{l.label} ↗</a>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// The "10 real funded programmes" table (CLUSTER_FUNDED_PROGRAMS) — one
// sub-block per cluster the student is ranked into, each with its own small
// table (program / overview / eligibility / stipend / on completion),
// matching FREE_STIPEND_ROUTE's existing shape/tone exactly. A cluster with
// no researched programmes yet is skipped silently rather than shown as an
// empty table — an empty table reads as "there's nothing here," which isn't
// true, it just isn't researched yet (see CLUSTER_FUNDED_PROGRAMS's own comment).
function FundedProgramsSection({ groups }: { groups: DomainGroup1112[] }) {
  const withPrograms = groups
    .map((g) => ({ g, programs: CLUSTER_FUNDED_PROGRAMS[g.domain as keyof typeof CLUSTER_FUNDED_PROGRAMS] }))
    .filter((x): x is { g: DomainGroup1112; programs: NonNullable<typeof x.programs> } => Boolean(x.programs && x.programs.length));
  if (!withPrograms.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {withPrograms.map(({ g, programs }) => (
        <div key={g.domain}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)", marginBottom: 8, borderLeft: `3px solid ${clusterColor(g.domain)}`, paddingLeft: 10 }}>{g.domain}</div>
          <div style={{ overflowX: "auto", border: "1px solid var(--line)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={th}>Programme</th>
                  <th style={th}>Overview</th>
                  <th style={th}>Eligibility</th>
                  <th style={th}>Stipend</th>
                  <th style={th}>On completion</th>
                </tr>
              </thead>
              <tbody>
                {programs.map((p, i) => (
                  <tr key={p.name} style={{ background: i % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
                    <td style={{ ...td, fontWeight: 800, color: "var(--ink)", fontSize: 11.5 }}>{p.name}</td>
                    <td style={{ ...td, fontSize: 11 }}>{p.summary} <span style={{ color: "var(--muted)" }}>{p.structure}</span></td>
                    <td style={{ ...td, fontSize: 11 }}>{p.eligibility}</td>
                    <td style={{ ...td, fontSize: 11 }}>{p.stipend}</td>
                    <td style={{ ...td, fontSize: 11 }}>{p.outcome}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
            {programs
              .filter((p, i, arr) => arr.findIndex((o) => o.verify === p.verify) === i)
              .map((p, i, arr) => (
                <span key={p.name} style={{ fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: "var(--red)", fontStyle: "normal", fontWeight: 700, textDecoration: "none" }}>{p.verify}</a>
                  {i < arr.length - 1 ? " · " : ""}
                </span>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// A domain card matching class 9-10's DomainCard shell (`.dom` — the coloured
// top border, radius and shadow every illustrated card in this report uses)
// so Career Fitment/Suitability read as the SAME report format, not a
// separately designed page — just without the hero image/tagline/"how to
// join"/skills text DomainCard has, since DOMAINS_1112 has no authored copy
// for those and fabricating it would repeat the mistake cut earlier for
// college cutoffs. Roles are a literal table (see RolesTable) per the
// tabular format requested, instead of DomainCard's stacked row list.
function DomainBlock({ g, rank, badge }: { g: DomainGroup1112; rank: number; badge?: React.ReactNode }) {
  const sal = CLUSTER_SALARY.get(g.domain);
  const color = clusterColor(g.domain);
  const rcVars = { ["--rc" as string]: color, ["--rc-tint" as string]: color + "12", ["--rc-line" as string]: color + "38" } as React.CSSProperties;
  return (
    <div className="dom" style={{ ...rcVars, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", background: "var(--rc-tint)", borderBottom: "1px solid var(--rc-line)" }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: color, color: "#fff", display: "grid", placeItems: "center", flex: "none", fontWeight: 800, fontSize: 14 }}>{rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="nm">Career Cluster {rank}: {g.domain}</div>
        </div>
        <div style={{ flex: "none" }}>{badge}</div>
      </div>
      <div className="dom-bd">
        <div className="dcell" style={{ gridColumn: "1 / -1" }}>
          <RolesTable careers={g.careers} />
        </div>
        {sal && (
          <div className="dcell" style={{ gridColumn: "1 / -1" }}>
            <div className="h">Typical earnings</div>
            <div className="sal"><div className="s"><div className="r">India</div><div className="a">{sal.india}</div></div><div className="s"><div className="r">Abroad</div><div className="a">{sal.abroad}</div></div></div>
          </div>
        )}
      </div>
    </div>
  );
}

// One category's card in the "every degree open to you" section — a header
// (category name + salary, taken from the category's own salaryDomain) plus
// one line per degree with its real eligibility mark for THIS student's
// stream (🟢 fully eligible, 🟡 conditional, 🟢🟡/🟡🔴 the workbook's own
// borderline marks — see degreeStreamMatrix.ts for why those aren't
// collapsed to a single colour).
function DegreeCategoryBlock({ category, rows, streamKey }: { category: string; rows: DegreeEligibilityRow[]; streamKey: StreamKey1112 }) {
  const salaryDomain = rows[0]?.salaryDomain ?? "";
  const sal = DOMAIN_SALARY.get(salaryDomain);
  const color = domainColor(salaryDomain);
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 13, padding: "16px 18px", marginBottom: 14, borderLeft: `3px solid ${color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: sal ? 8 : 4 }}>
        <DomainChip domain={salaryDomain} size={26} kind="domain" />
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{category}</div>
      </div>
      {sal && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>
          Salary — India: {sal.india} &nbsp;|&nbsp; Abroad: {sal.abroad}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {rows.map((r) => {
          const mark = r.eligibility[streamKey];
          if (!mark) return null;
          return (
            <div key={r.degree} style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "5px 0", borderTop: "1px solid var(--line)", fontSize: 12 }}>
              <span style={{ flex: "none" }}>{ELIGIBILITY_SYMBOL[mark]}</span>
              <span style={{ fontWeight: 700, color: "var(--ink)" }}>{r.degree}</span>
              <span style={{ color: "var(--muted)", fontSize: 11 }}>— {ELIGIBILITY_LABEL[mark]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// One card in the "based on your specific strengths" section — a single
// named dimension (e.g. "Coding Interest", not a whole domain) picked
// because the student's own measured profile scored highest on it, with
// the workbook's real question/courses/jobs/skills/salary/government-jobs
// for that exact dimension. See dimensionCareerGuide.ts for how the score
// is derived and why a few dimensions (Risk Orientation, Work Environment,
// Motivators) never appear here — no measured field in this app proxies them.
function DimensionBlock({ d, rank }: { d: ScoredDimension; rank: number }) {
  const color = RANK_COLOURS[(rank - 1) % RANK_COLOURS.length];
  const row = (label: string, value: string) => (
    <div style={{ padding: "9px 0", borderTop: `1px solid ${color}26` }}>
      <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color }}>{label}</span>
      <div style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55, marginTop: 3 }}>{value}</div>
    </div>
  );
  return (
    <div style={{ border: `1px solid ${color}45`, borderTop: `4px solid ${color}`, borderRadius: 14, overflow: "hidden", marginBottom: 16, boxShadow: `0 2px 10px ${color}14` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "14px 18px", background: `${color}12` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 32, height: 32, borderRadius: 10, background: color, display: "grid", placeItems: "center", flex: "none", fontSize: 13, fontWeight: 800, color: "#fff", boxShadow: `0 3px 8px ${color}55` }}>{rank}</span>
          <span style={{ fontSize: 15.5, fontWeight: 800, color: "var(--ink)" }}>{d.dimension}</span>
        </div>
        <Ring value={d.score} size={44} stroke={5} color={color}>
          <div style={{ fontSize: 11.5, fontWeight: 800, color }}>{d.score}<small style={{ fontSize: 7 }}>%</small></div>
        </Ring>
      </div>
      <div style={{ padding: "14px 18px 16px" }}>
        <SkillBar value={d.score} color={color} height={6} />
        <p style={{ margin: "12px 0 4px", fontSize: 12.5, fontStyle: "italic", color: "var(--ink-2)", background: `${color}0a`, border: `1px dashed ${color}45`, borderRadius: 9, padding: "8px 11px" }}>{d.question}</p>
        {row("Courses to explore", d.courses)}
        {row("Job roles", d.jobs)}
        {row("Skills to build", d.skills)}
        {row("Indicative salary range (India)", d.salary)}
        {row("Government jobs / career pathways", d.govtJobs)}
      </div>
    </div>
  );
}

// The 6-category legend the "Comment" column reads against — static,
// explanatory, doesn't depend on student data, matching the reference
// report's own "Scenarios" block.
const SCENARIOS: { label: string; tone: string; text: string }[] = [
  { label: "Top Choice", tone: VERDICT_TONE["Top Choice"].c, text: "You have the highest degree of interest and skills to pursue this career path. You will excel in the fields mapped to this career path." },
  { label: "Good Choice", tone: VERDICT_TONE["Good Choice"].c, text: "This career path will be a good match for you as your interest and skills & abilities are correctly aligned." },
  { label: "Worth Considering", tone: VERDICT_TONE["Worth Considering"].c, text: "You have adequate interest level and skills & abilities to pursue this career path. However, this can be pursued if you are not pursuing your top choice or good choice." },
  { label: "Needs Preparation", tone: VERDICT_TONE["Needs Preparation"].c, text: "Your interest here is strong, but building up the skills and abilities this career needs will improve your chances of success in it." },
  { label: "Worth Exploring", tone: VERDICT_TONE["Worth Exploring"].c, text: "Your skills and abilities are strong here even though measured interest is lower — worth a closer look before ruling it out." },
  { label: "Not Recommended", tone: VERDICT_TONE["Not Recommended"].c, text: "You currently have low interest and low skills & abilities for this career path, so it isn't a strong match right now." },
];
function ScenariosLegend() {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
      <div className="subhd" style={{ marginBottom: 10 }}>Scenarios — how to read the Comment column</div>
      <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {SCENARIOS.map((s) => (
          <li key={s.label} style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <b style={{ color: s.tone }}>{s.label}</b> — {s.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

// Career Fit Q74's exact option text (up to 2 picked) -> where in THIS
// report that concern is actually addressed, so "what worries you most"
// points somewhere real instead of being collected and never read back.
const CONCERN_POINTERS: Record<string, string> = {
  "Course Suitability: Picking the wrong course or struggling with academic difficulty.":
    "That's exactly what this ranking is for — every cluster below is ordered by how well it fits your own measured interests and abilities, not by popularity.",
  "Admissions & Competition: Cracking tough entrance exams and getting into a good college.":
    "The Career Selector page ahead names the specific entrance exam for your chosen career, with a full roadmap to it.",
  "Career Outcomes: Getting a stable job, good salary, and career growth.":
    "Each cluster below shows its real entry/mid/senior salary range in India and abroad, under \"Typical earnings.\"",
  "Financial Cost: Affordability, high fees, or student expenses.":
    "See the Funded Programmes table on the Career Suitability page ahead — genuinely funded or stipend-linked routes, not just any paid course.",
  "Family & Location: Parents' expectations or having to relocate.":
    "Worth sharing your top clusters below with your family directly — a concrete, ranked list from your own answers is easier to discuss than a vague direction.",
  "Confusion / Lack of Info: Feeling overwhelmed, limited, or unaware of the options.":
    "That's what the ranking below is for — it narrows 332 careers down to the ones your own profile actually points toward.",
};
function ConcernPointers({ concerns }: { concerns: string[] }) {
  const known = concerns.filter((c) => CONCERN_POINTERS[c]);
  if (!known.length) return null;
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px", marginBottom: 16, background: "var(--bg, #fafafa)" }}>
      <div className="subhd" style={{ marginBottom: 10 }}>You told us this worries you most</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {known.map((c) => (
          <div key={c} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <b style={{ color: "var(--ink)" }}>{c.split(":")[0]}</b> — {CONCERN_POINTERS[c]}
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal bar chart of every cluster's own fit score (topScore, the same
// distinct-RIASEC-deduped interest average groupByCluster1112 already
// computes) — hand-rolled SVG, since this repo has no charting library.
// Only clusters the student scored above 0 on are
// drawn (a cluster with literally zero matching interest signal isn't a
// bar worth showing, not a bug) — sorted strongest first, one colour per
// cluster from CLUSTER_COLOURS so no two bars are ever confusably identical.
function ClusterBarChart({ groups }: { groups: DomainGroup1112[] }) {
  const rows = groups.filter((g) => g.topScore > 0);
  if (!rows.length) return null;
  // padL has to fit the longest label ("Law, Public Safety, Corrections &
  // Security", "Transportation, Distribution & Logistics") at 11.5px bold —
  // anything narrower clips those labels off the SVG's left edge instead of
  // just cramping them, since text-anchor="end" grows leftward from padL-12.
  const W = 760, rowH = 30, padL = 350, padR = 56, padT = 6, padB = 6;
  const H = padT + padB + rows.length * rowH;
  const maxScore = Math.max(100, ...rows.map((r) => r.topScore));
  const barW = (v: number) => ((W - padL - padR) * v) / maxScore;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Career cluster fit, percentage by cluster" style={{ width: "100%", height: "auto", display: "block" }}>
      {rows.map((r, i) => {
        const y = padT + i * rowH;
        const color = clusterColor(r.domain);
        return (
          <g key={r.domain}>
            <text x={padL - 12} y={y + rowH / 2 + 4} textAnchor="end" fontSize={11.5} fontWeight={700} fill="var(--ink)">{r.domain}</text>
            <rect x={padL} y={y + 5} width={W - padL - padR} height={rowH - 10} rx={4} fill={color} opacity={0.14} />
            <rect x={padL} y={y + 5} width={barW(r.topScore)} height={rowH - 10} rx={4} fill={color} />
            <text x={padL + barW(r.topScore) + 8} y={y + rowH / 2 + 4} fontSize={11.5} fontWeight={800} fill="var(--ink)">{r.topScore.toFixed(0)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

export function buildCareerFit1112Sheets(output: Class11ScoreOutput, category: "class_11" | "class_12" | "class_11_12"): ReportSheet[] {
  const l1 = output.layer1;
  const streamKey = output.currentStreamDetailed || output.layer2.currentStream || "";
  const desiredCareer = output.layer4.primaryCareerGoal;
  const isClass12 = category === "class_12" && output.layer4.estimatedPercentage != null;
  const totalCareers = CAREERS_1112.length;

  // Nudges cluster ranking toward what the student actually told the system
  // (Career Selector's desired/alternative/excluded careers, Career Fit's
  // considered field areas and pathway-type preference, Subject Fit's
  // enjoyed/hardest subject) instead of leaving Fitment/Suitability purely
  // RIASEC-driven — see RankingContext1112's own header comment in
  // careerFitEngine1112.ts for why.
  const rankingCtx = {
    desiredCareerText: desiredCareer,
    enjoyedSubject: output.layer2.enjoyedSubject,
    difficultSubject: output.layer2.difficultSubject,
    consideringAreas: output.layer4.consideringAreas,
    alternativeCareerTexts: output.layer4.alternativeOptions,
    excludedCareerTexts: output.layer4.excludedCareers,
    pathwayType: output.layer4.pathwayType,
  };

  const fitmentRanked = rankFitment1112(l1, rankingCtx);
  const fitmentGroups = groupByCluster1112(fitmentRanked, 5, 5);
  // Every one of the 16 clusters' scores, for the cluster-fit bar chart —
  // domainLimit=16 (not 5) so nothing is cut, rolesPerGroup=1 since the
  // chart only needs each cluster's topScore, not its role list.
  const allClusterScores = groupByCluster1112(fitmentRanked, 16, 1);
  // Roles Fitment already showed, per cluster — Suitability skips these so
  // the two pages don't print the identical role list for a shared cluster;
  // it shows the NEXT tier of roles instead (still real, still ranked).
  const fitmentShownIds = new Set(fitmentGroups.flatMap((g) => g.careers.map((c) => c.career.id)));

  // Widen Suitability to include Bridge-fit careers (not just Native Fit)
  // when the student's own reasons for their current stream suggest it
  // wasn't a fully self-driven choice — family/mentor steer, peer influence
  // or outright uncertainty, without also picking "my own choice". A student
  // in that position may have real interest sitting just outside their
  // current stream, which a Native-Fit-only page would never surface.
  const NON_SELF_DRIVEN_REASONS = ["Family & Mentors: Recommendation or guidance from parents, teachers, or counselors.", "Peer Influence: My friends or classmates were taking it.", "Uncertainty: I didn't know what else to pick."];
  const streamReasons = output.layer2.streamChoiceReasons ?? [];
  const chosenFreely = streamReasons.some((r) => r.startsWith("My Choice / Default"));
  const widenToBridge = !chosenFreely && streamReasons.some((r) => NON_SELF_DRIVEN_REASONS.includes(r));

  const suitabilityRanked = rankSuitability1112(l1, streamKey, { ...rankingCtx, includeBridge: widenToBridge });
  const suitabilityGroups = groupByCluster1112(suitabilityRanked, 5, 5, fitmentShownIds);

  const selector = desiredCareer ? selectCareer1112(desiredCareer, l1, streamKey) : null;

  // "Possibilities" for the Selector page — close alternatives in the same
  // cluster as the chosen career, so "I want X but here's what's realistic"
  // has real, ranked neighbours rather than just a single yes/no verdict.
  const alternatives: Career1112[] = selector?.career
    ? CAREERS_1112.filter((c) => c.cluster === selector.career!.cluster && c.id !== selector.career!.id).slice(0, 4)
    : [];

  // A brief, generic roadmap preview for the overview table's Selector
  // column — reuses buildCareer20YearRoadmap (already built from the
  // career's own real fields, no new content).
  const selectorPreviewRoadmap = selector?.career ? buildCareer20YearRoadmap(selector.career, streamKey) : null;

  // The Selector page's own detailed roadmap used to be built from the
  // student's DESIRED career's cluster — which can be a Hard Gate, not
  // reachable from their stream at all, making a 15-year "how you'll get
  // there" roadmap actively misleading. It's built from Career Suitability's
  // #1 domain instead: the top career that's genuinely, realistically
  // reachable right now, not the aspirational pick shown in the banner above.
  const topSuitabilityCareer = suitabilityGroups[0]?.careers[0] ?? null;
  const realisticRoadmap = topSuitabilityCareer ? buildCareer20YearRoadmap(topSuitabilityCareer.career, streamKey) : null;

  const sheets: ReportSheet[] = [
    {
      id: "career-clusters-bar-1112",
      kicker: "Your career cluster fit",
      node: (
        <>
          <PageHead eyebrow="Across the standard career clusters" title="Your Career Cluster Fit"
            sub="How strongly your measured interests, aptitude and strengths line up with each of the Career Clusters — the same industry-standard groupings used across career guidance, not a scheme unique to this report." />
          <div style={{ marginTop: 24, border: "1px solid var(--line)", borderRadius: 13, padding: "20px 20px 12px" }}>
            <ClusterBarChart groups={allClusterScores} />
          </div> 
          <p className="disclaimer" style={{ marginTop: 12 }}>
            A 0% bar means no measured signal pointed that way yet, not that the field is closed to you — interests develop with exposure.
          </p>
        </>
      ),
    },
    {
      id: "career-overview-table-1112",
      kicker: "Overview",
      node: (
        <>
          <PageHead eyebrow="Fitment · Suitability · Selector, side by side" title="Your Career Path at a Glance" />
          <div style={{ marginTop: 22, border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
            {/* One shared header bar (real <table>-style: dark band, 3
                cells) instead of 3 separately-coloured header blocks — the
                per-column accent now shows as a bottom border on its own
                header cell, not a competing background colour. */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#2c3e50" }}>
              <OverviewHeadCell title="Career Fitment" subtitle="What fits YOU" color="#2f6bff" />
              <OverviewHeadCell title="Career Suitability" subtitle="What fits YOUR STREAM" color="#12996b" borderLeft />
              <OverviewHeadCell title="Career Selector" subtitle="Your desired career" color="#e08a1e" borderLeft />
            </div>
            {/* Body: still 3 independently-sized columns (align-items:start)
                so Selector's shorter content never gets stretched or leaves
                a dead gap — but now sharing one outer border and real
                column-divider lines, so it reads as one table, not 3 boxes. */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "start" }}>
              <div>
                {fitmentGroups.length ? fitmentGroups.map((f, i) => (
                  <OverviewRow key={f.domain} rank={i + 1} name={f.domain} pct={f.topScore} color="#2f6bff"
                    roles={f.careers.slice(0, 3).map((c) => c.career.name).join(", ")} />
                )) : <OverviewEmpty text="No matches yet." />}
              </div>

              <div style={{ borderLeft: "1px solid var(--line)" }}>
                {suitabilityGroups.length ? suitabilityGroups.map((s, i) => (
                  <OverviewRow key={s.domain} rank={i + 1} name={s.domain} pct={s.topScore} color="#12996b"
                    roles={s.careers.slice(0, 3).map((c) => c.career.name).join(", ")} />
                )) : <OverviewEmpty text="Nothing native to your stream in this rank yet." />}
              </div>

              <div style={{ borderLeft: "1px solid var(--line)" }}>
                {desiredCareer && selector?.career ? (
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ textAlign: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{streamKey || "Your stream"}</div>
                      <div style={{ fontSize: 15, color: "#e08a1e", margin: "2px 0" }}>↓</div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--ink)" }}>{selector.career.name}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
                      <Pill label={selector.roadmap!.fitType} tone={toneForFitType(selector.roadmap!.fitType)} />
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-2)", textAlign: "center", lineHeight: 1.5 }}>{selector.roadmap!.actionSummary}</div>
                    <div style={{ fontSize: 11, color: "var(--ink-2)", textAlign: "center", marginTop: 8, padding: "6px 10px", background: "#e08a1e0a", border: "1px solid #e08a1e30", borderRadius: 8 }}>
                      <b style={{ color: "var(--ink)" }}>Entrance exam:</b> {selector.career.typicalEntranceExam}
                    </div>
                    {selectorPreviewRoadmap && <OverviewRoadmapPreview phases={selectorPreviewRoadmap} color="#e08a1e" />}
                    <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 12, fontStyle: "italic", textAlign: "center" }}>Full in-depth roadmap on the Career Selector page ahead.</div>
                  </div>
                ) : (
                  <OverviewEmpty text={desiredCareer ? `"${desiredCareer}" isn't in our reference list yet.` : "You didn't name a specific career on the pre-exam screen."} />
                )}
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "career-fitment-1112",
      kicker: "Career fitment",
      node: (
        <>
          <PageHead eyebrow="What fits YOU" title="Career Fitment"
            sub="Your top 5 domains, ranked purely by your assessment. Ignores your stream entirely — this is what your interests, aptitude and strength domains point toward, with no filter for what's currently reachable. Career Suitability, next, applies the real-world stream filter." />
          <div style={{ marginTop: 20 }}>
            <ConcernPointers concerns={output.layer4.topConcerns ?? []} />
            {/* The consolidated table is the whole story here — Career
                Suitability, next, is where each of these domains gets the
                full per-role breakdown, since that's the realistic, stream-
                filtered list worth reading in that much depth. */}
            {fitmentGroups.length ? <ClusterSummaryTable groups={fitmentGroups} /> : <p>No matches yet.</p>}
          </div>
          <p className="disclaimer" style={{ marginTop: 16 }}>
            You're free to explore any career, in any domain — this is a starting point, not a fixed path.
          </p>
        </>
      ),
    },
    {
      id: "career-suitability-1112",
      kicker: "Career suitability",
      node: (
        <>
          <PageHead eyebrow="What's realistic for your stream" title="Career Suitability"
            sub={`Your top domains that ${streamKey || "your current stream"} actually reaches. Same ranking as Career Fitment, kept to only the careers you're already fully eligible for from your current stream (Native Fit) — no bridge step needed for any role shown here. Roles already listed under a domain in Career Fitment aren't repeated here — these are the next-best real options in the same domain.`} />
          <div style={{ marginTop: 20 }}>
            {suitabilityGroups.length ? <ClusterSummaryTable groups={suitabilityGroups} showCompanies /> : (
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>Nothing in your top fitment domains is a Native Fit for your current stream yet — see the roadmap page next for bridge options toward what you actually want.</p>
            )}
          </div>
          {suitabilityGroups.length > 0 && <div style={{ marginTop: 24, marginBottom: 16 }}><ScenariosLegend /></div>}
          <div style={{ marginTop: suitabilityGroups.length > 0 ? 0 : 24 }}>
            {suitabilityGroups.length ? suitabilityGroups.map((g, i) => (
              <DomainBlock key={g.domain} g={g} rank={i + 1} badge={<Pill label="Native fit" tone={TONE.good} />} />
            )) : null}
          </div>
          {suitabilityGroups.length > 0 && (
            <div style={BREAK}>
              <SecHead eyebrow="Real, verified funding — not JEE-score-gated" title="Funded programmes in your top domains"
                sub="Genuinely funded or stipend-linked routes into these fields — government training, sponsorship or apprenticeship programmes, not ordinary paid courses. Every fact here comes from an official source, verified before publishing, not a guess." />
              <div style={{ marginTop: 16 }}>
                <FundedProgramsSection groups={suitabilityGroups} />
                {!suitabilityGroups.some((g) => CLUSTER_FUNDED_PROGRAMS[g.domain as keyof typeof CLUSTER_FUNDED_PROGRAMS]?.length) && (
                  <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>We haven't researched verified funded programmes for your specific top domains yet — this section is filled in cluster by cluster as it's confirmed against official sources, not guessed to fill space.</p>
                )}
              </div>
            </div>
          )}
        </>
      ),
    },
    {
      id: "career-selector-1112",
      kicker: "Career selector",
      node: (
        <>
          <PageHead eyebrow="Your favourite career path" title="Career Selector"
            sub={desiredCareer
              ? `${desiredCareer} — your starting point, and the full journey to get there. The roadmap ahead is built for the long run, not just the next exam.`
              : "You didn't name a career — the roadmap ahead is still built for the long run, not just the next exam."} />
          {desiredCareer ? (
            selector?.career ? (
              <div style={{ marginTop: 20 }}>
                {/* The big, unmissable starting-point banner the whole page
                    hangs off — everything below answers "how do I get from
                    here to there", so "here" and "there" need to be obvious
                    at a glance, not buried in a small muted line. */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 18, flexWrap: "wrap",
                  padding: "22px 24px", borderRadius: 16, marginBottom: 20,
                  background: `linear-gradient(135deg, ${clusterColor(selector.career.cluster)}14, ${clusterColor(selector.career.cluster)}05)`,
                  border: `1px solid ${clusterColor(selector.career.cluster)}38`,
                }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>You are here</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: "var(--ink)", marginTop: 4 }}>{streamKey || "Your stream"}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>Class 12</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 800, color: clusterColor(selector.career.cluster) }}>→</div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>Your destination</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: clusterColor(selector.career.cluster), marginTop: 4 }}>{selector.career.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{selector.career.cluster}</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 8 }}>
                  <Pill label={selector.roadmap!.fitType} tone={toneForFitType(selector.roadmap!.fitType)} />
                  <span style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 600 }}>{selector.roadmap!.actionSummary}</span>
                </div>
                <div style={{ textAlign: "center", fontSize: 12.5, color: "var(--ink-2)", marginBottom: 20 }}>
                  <b style={{ color: "var(--ink)" }}>Entrance exam for {selector.career.name}:</b> {selector.career.typicalEntranceExam}
                </div>

                {topSuitabilityCareer && realisticRoadmap && (
                  <div style={BREAK}>
                    <SecHead center eyebrow={`${suitabilityGroups[0].domain} · what's realistic right now`} title="Your realistic path"
                      sub={`${selector.career.name} is your goal — but ${topSuitabilityCareer.career.name} is the closest real option ${streamKey || "your stream"} already qualifies you for. Simple, concrete steps, not a long aspirational journey.`} />
                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                        <Pill label={topSuitabilityCareer.roadmap.fitType} tone={toneForFitType(topSuitabilityCareer.roadmap.fitType)} />
                      </div>
                      <OverviewRoadmapPreview phases={realisticRoadmap} color={clusterColor(topSuitabilityCareer.career.cluster)} full />
                    </div>
                  </div>
                )}

                <div style={BREAK}>
                  <SecHead center eyebrow="Where to go next" title="Explore exams, certifications & internships"
                    sub="Real, official places to start — the exact exam/registration portals for this field, and live internship listings on your own OneGrasp dashboard." />
                  <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                    {(CLUSTER_EXPLORE_LINKS[selector.career.cluster] ?? []).map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: clusterColor(selector!.career!.cluster), background: `${clusterColor(selector!.career!.cluster)}12`, border: `1px solid ${clusterColor(selector!.career!.cluster)}45`, padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>{l.label} ↗</a>
                    ))}
                    <a href={`${SITE_URL_1112}/account/internships-new`} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: clusterColor(selector.career.cluster), padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>Browse live internships on your dashboard ↗</a>
                  </div>
                </div>

                <div style={BREAK}>
                  <SecHead center eyebrow="What this role draws on" title="Skills and abilities that matter here" />
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {skillTagsFor1112(selector.career).map((s) => (
                      <span key={s} style={{ fontSize: 12, fontWeight: 700, color: clusterColor(selector!.career!.cluster), background: `${clusterColor(selector!.career!.cluster)}14`, border: `1px solid ${clusterColor(selector!.career!.cluster)}38`, padding: "6px 13px", borderRadius: 999 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {alternatives.length > 0 && (
                  <div style={BREAK}>
                    <SecHead center eyebrow="If this specific role doesn't work out" title={`Close alternatives in ${selector.career.cluster}`} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
                      {alternatives.map((c) => (
                        <div key={c.id} style={{ fontSize: 12, color: "var(--ink-2)", padding: "6px 0", borderTop: "1px solid var(--line)" }}>
                          <b style={{ color: "var(--ink)" }}>{c.name}</b> — {c.typicalDegree}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink-2)" }}>&ldquo;{desiredCareer}&rdquo; isn&apos;t in our {totalCareers}-career reference list yet — talk to your counsellor about the specific path, using Career Fitment and Career Suitability above as your general direction.</p>
            )
          ) : (
            <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink-2)" }}>You didn&apos;t name a specific career, so there&apos;s nothing to check here yet — Career Fitment and Career Suitability still stand on their own.</p>
          )}
        </>
      ),
    },
  ];

  if (isClass12) {
    const resolvedStreamKey: StreamKey1112 = STREAM_KEY_1112[streamKey] ?? "Vocational/Other";
    const degreesByCategory = degreesForStream(resolvedStreamKey, { includeConditional: true });
    const topDimensions = topDimensionsForStudent(resolvedStreamKey, l1, 3);
    const jeeBand = percentileBandFor(output.layer4.estimatedPercentage);

    sheets.push({
      id: "career-jee-wider-1112",
      kicker: "Your exam score & wider options",
      node: (
        <>
          <PageHead eyebrow="By degree programme" title={`Every undergraduate programme ${streamKey || "your stream"} can apply to`}
            sub="Not ranked by fit — this is the raw landscape: every real degree programme across every field, with the honest admission reality for your specific stream (some colleges are stricter than others, which is what the 🟢🟡/🟡🔴 marks capture)." />
          <div style={{ marginTop: 16, columnCount: degreesByCategory.size ? 2 : 1, columnGap: 24, columnRule: "1px solid var(--line)" }}>
            {degreesByCategory.size ? Array.from(degreesByCategory.entries()).map(([category, rows]) => (
              <div key={category} style={{ breakInside: "avoid" }}>
                <DegreeCategoryBlock category={category} rows={rows} streamKey={resolvedStreamKey} />
              </div>
            )) : <p style={{ fontSize: 13, color: "var(--ink-2)" }}>We don't have a specific degree-eligibility mapping for your stream yet.</p>}
          </div>

          <div style={BREAK}>
            <SecHead eyebrow="By your specific strengths" title="What your top individual strengths point toward"
              sub="Different from both lists above — not a domain or a degree, but the 3 specific named strengths (e.g. Coding Interest, not just 'Computer & IT') your own profile scored highest on, each with the exact courses, roles, skills and government pathways for that strength." />
            <div style={{ marginTop: 16 }}>
              {topDimensions.length ? topDimensions.map((d, i) => <DimensionBlock key={d.dimension} d={d} rank={i + 1} />) : (
                <p style={{ fontSize: 13, color: "var(--ink-2)" }}>We don&apos;t have a specific strengths breakdown for your stream yet.</p>
              )}
            </div>
          </div>

          {(resolvedStreamKey === "MPC" || resolvedStreamKey === "PCMB") && jeeBand && (
            <div style={BREAK}>
              <SecHead eyebrow="If you're appearing for JEE Main" title={`What your ${jeeBand.label} band has recently opened up`}
                sub="Based on real 2026 JEE Main percentile-to-institution trends, not a promise — cutoffs genuinely shift every year by category, home-state quota and counselling round. Always confirm current eligibility on the official JoSAA/CSAB portal before deciding." />
              <div style={{ marginTop: 14, border: "1px solid var(--line)", borderRadius: 12, padding: "16px 18px" }}>
                <p style={{ margin: "0 0 10px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{jeeBand.realistic}</p>
                <div className="subhd">What this band has recently reached</div>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  {jeeBand.examples.map((e) => <li key={e} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 4 }}>{e}</li>)}
                </ul>
                {jeeBand.alternativeRoutes && jeeBand.alternativeRoutes.length > 0 && (
                  <>
                    <div className="subhd" style={{ marginTop: 14 }}>Worth attempting in parallel</div>
                    <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                      {jeeBand.alternativeRoutes.map((r) => <li key={r} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, marginBottom: 4 }}>{r}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </>
      ),
    });
  }

  return sheets;
}
