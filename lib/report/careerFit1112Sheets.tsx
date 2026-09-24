"use client";

/**
 * The Class 11-12 Career Fitment / Career Suitability / Career Selector
 * pages - replaces FullReport.tsx's shared 15-domain "Best-fit Domains"
 * section for classes 11/12 (see hideCareerFitSections there) and the older,
 * simpler "snapshot-stream-fit" / "career-suitability" / "career-selector-
 * match" sheets this file used to share space with in class11ExtraSheets.tsx
 * (removed from there - this is a straight replacement, not an addition, to
 * avoid showing two disagreeing rankings in one report).
 *
 * Four pages, each a full page rather than a cramped column - the original
 * 3-column-on-one-page layout (matching the mapping kit's own mockup) didn't
 * have room for real per-role detail, and a bare list of role names isn't
 * useful on its own: a student needs to know what degree gets them there,
 * not just the job title.
 *
 *  1. Career Fitment - top 5 domains ranked purely against the student's
 *     measured profile (ignores stream entirely), 5 roles per domain, each
 *     with its match score, typical degree and entrance exam. Domain-level
 *     salary (India/Abroad) shown once per domain.
 *  2. Career Suitability - the same ranking, kept to only what the
 *     student's actual stream can reach (Native Fit). Same per-role detail.
 *  3. Career Selector - the specific career the student named: current
 *     stream, fit type, where it ranks in their own Fitment list, its
 *     typical degree/exam, and the full step-by-step roadmap.
 *  4. Class 12 only - estimated exam score shown as context (never a
 *     filter - the mapping kit's own Report_Sections_Logic is explicit that
 *     "the score itself is ignored for matching"), plus a WIDENED
 *     suitability list (Native Fit + Bridge) with the same rich per-role
 *     detail, so a stream like PCB shows real breadth, not just the one
 *     obvious path. Matches the kit's own guidance: "this is just Career
 *     Suitability with a wider candidate pool - no new engine needed."
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
  skillTagsFor1112,
  type DomainGroup1112, type RankedCareer1112,
} from "@/lib/report/careerFitEngine1112";
import { DOMAINS_1112, STANDARD_CLUSTERS, CLUSTER_EXPLORE_LINKS, CLUSTER_COMPANIES, CLUSTER_FUNDED_PROGRAMS, CAREERS_1112, STREAM_KEY_1112, roadmapFor, type RoadmapEntry, type Career1112, type StreamKey1112, type StandardCluster, type FundedProgram } from "@/lib/report/careerfit1112";
import { CLUSTER_ROADMAPS, type ClusterRoadmapPhase } from "@/lib/report/clusterRoadmaps1112";
import { degreesForStream, ELIGIBILITY_SYMBOL, ELIGIBILITY_LABEL, type DegreeEligibilityRow } from "@/lib/report/degreeStreamMatrix";
import { topDimensionsForStudent, type ScoredDimension } from "@/lib/report/dimensionCareerGuide";
import { percentileBandFor } from "@/lib/report/jeePercentileGuide";

// Same fallback pattern as lib/studentEmail.ts's SITE_URL - this report can
// be viewed as a downloaded/emailed PDF, not just in-app, so links into the
// dashboard (e.g. the internships listing) need an absolute URL, not a
// relative path that would 404 outside the app shell.
const SITE_URL_1112 = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");

// A distinct icon + a stable colour per STANDARD CLUSTER (the 16 National
// Career Clusters - see careerfit1112.ts's StandardCluster) so these pages
// read as illustrated cards rather than plain bordered text. 16 distinct
// hues rather than cycling the report's 5-colour RANK_COLOURS - cycling
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

// The OLD 27-domain colour/icon lookup - kept only for the "every degree
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
// report uses for its header - reused here so a domain/cluster block reads
// as one system with DomainCard, not a second visual language.
function DomainChip({ domain, size = 30, kind = "cluster" }: { domain: string; size?: number; kind?: "cluster" | "domain" }) {
  const color = kind === "cluster" ? clusterColor(domain) : domainColor(domain);
  const icon = kind === "cluster" ? clusterIcon(domain) : "match";
  return (
    <span style={{ width: size, height: size, borderRadius: "50%", background: `${color}18`, display: "grid", placeItems: "center", flex: "none" }}>
      <Icon name={icon} size={size * 0.5} style={{ color }} />
    </span>
  );
}

// `center` is used on Career Selector's sub-sections specifically - that
// page reads as one continuous explainer rather than a table-dense report
// page, so its sub-headings match the big centred PageHead above them
// instead of the left-aligned style the denser Fitment/Suitability/JEE
// pages use (kept as-is there - centering every heading on those genuinely
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

// A big, centred heading - reuses the SAME .domhead/.domhead-eye/
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
// (like a real <table>'s <thead>) rather than 3 separately-boxed panels -
// column dividers (border-left on the body columns) connect the header cells
// straight down into the body, so this reads as one table. The body columns
// still size independently (grid + align-items:start, no rowSpan/shared
// row-height) - a rowSpan=5 Selector cell next to two 5-row lists of very
// different lengths is what left a large dead gap before.
// A tinted colour band per lens (blue/green/orange) with an icon circle,
// instead of one shared dark bar split into 3 text-only cells - each of the
// three lenses (Fitment/Suitability/Selector) now reads as its own
// distinctly-coloured card, matching how the rest of this report already
// colour-codes a lens (Pill tones, chart bars) rather than using colour only
// as a thin accent line.
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
// A compact, chevron-terminated row - rank badge, domain name + fit % on one
// line, roles listed underneath as plain sub-text - so all 5 rows read at a
// glance without needing to open a card. The full per-role percentage/degree/
// exam breakdown still lives on the Fitment/Suitability detail pages that
// follow; this is the "at a glance" summary, not a duplicate of that detail.
// Plain white rows throughout (no zebra striping) - the tinted number badge
// and the divider line already separate one row from the next.
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
// A small, hand-drawn mountain-and-flag scene (plain inline SVG, no external
// asset) for the bottom of the Selector column - its job is purely to fill
// the real empty space left below the shorter Selector content once that
// column is stretched to match Fitment/Suitability's height, the same way
// the reference layout uses it, not to be a literal illustration of anything.
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
// A numbered path down the left side - a circle per phase joined by a
// connecting line, journey-map style ("I AM HERE, I CAN STUDY, ...") -
// rendering the STANDARD, pre-authored per-cluster roadmap (CLUSTER_ROADMAPS,
// clusterRoadmaps1112.ts), not a roadmap dynamically built around the
// student's specific desired career or stream. Every real degree/
// qualification name in it is generic to the cluster, so it reads the same
// for every student who lands on that cluster - the "here's the realistic
// path for this domain" answer, not a comparison to any one career.
function ClusterRoadmapPath({ phases, color }: { phases: ClusterRoadmapPhase[]; color: string }) {
  return (
    <div style={{ marginTop: 20 }}>
      {phases.map((p, i) => (
        <div key={p.code} style={{ display: "flex", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 14.5, display: "grid", placeItems: "center", flex: "none", boxShadow: `0 0 0 4px ${color}22` }}>{i + 1}</span>
            {i < phases.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${color}70, ${color}20)`, minHeight: 30, marginTop: 6 }} />}
          </div>
          <div style={{ minWidth: 0, flex: 1, paddingBottom: i < phases.length - 1 ? 28 : 4 }}>
            {/* The phase name is the "where am I" anchor for this whole
                block - a tinted pill makes it the loudest thing on the
                card instead of reading the same weight as its own section
                headings below it. */}
            <span style={{ display: "inline-block", fontSize: 13.5, fontWeight: 800, color, background: `${color}14`, padding: "4px 12px", borderRadius: 999 }}>{p.name}</span>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".03em", textTransform: "uppercase", color: "var(--muted)", marginTop: 7 }}>{p.stage}</div>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 11 }}>
              {p.sections.map((s) => (
                <div key={s.heading}>
                  <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>{s.heading}</div>
                  <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
                    {s.items.map((it) => <li key={it} style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{it}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const VERDICT_TONE: Record<string, { c: string; bg: string }> = {
  "Top Choice": { c: "#1f7a55", bg: "#eaf6f0" },
  "Medium Choice": { c: "#a3620b", bg: "#fdf3dd" },
  "Low Choice": { c: "#b3261e", bg: "#fdecec" },
};
function verdictColor(v: string): string { return VERDICT_TONE[v]?.c ?? "var(--ink-2)"; }

// "Developing"/"Emerging" instead of a blunt "Low"/"Very Low" - same
// reasoning as bandOf() in FullReport.tsx: a below-average score should
// read as a stage, not a verdict on the student.
function LevelLabel(v: number): string {
  if (v >= 75) return "Very High";
  if (v >= 65) return "High";
  if (v >= 50) return "Average";
  if (v >= 35) return "Developing";
  return "Emerging";
}


// One axis's mini-bar (used for both Psy. Analysis and Skill & Abilities) -
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
// Skill and Abilities | Comment - two SEPARATE axes (not one blended score)
// so a role that scores well on ability but poorly on genuine interest
// reads honestly as "Medium Choice", not a misleading "Top Choice".
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
// "Logical-Mathematical", "Numerical Reasoning") - psychometric TRAIT
// labels, not things a student can actually go learn, and since ~44% of all
// 332 careers share Logical-Mathematical as their #1 code, an analytically-
// leaning student saw nearly the same 3-5 tags repeat across STEM, Finance,
// IT and Law alike, which read as broken, not just generic.
//
// CLUSTER_ROADMAPS' own "Skills I acquire" (phase 2) was tried next, but
// that text is written for ONE specific path through the cluster, not the
// cluster as a whole - STEM's phase 2 names "CAD and one analysis/
// simulation tool" because it's written from an engineering-student's
// route through STEM, but that's meaningless for the same cluster's
// Physics, Biotechnology or Statistics careers. This table instead uses a
// dedicated list per cluster, chosen to genuinely span its full breadth -
// broad, transferable skills every career in that cluster draws on, not a
// tool or technique specific to one sub-field within it.
const CLUSTER_CORE_SKILLS: Record<StandardCluster, string[]> = {
  "Agriculture, Food & Natural Resources": ["Biology & life-science fundamentals", "Field & lab observation", "Data-driven decision-making", "Sustainability & resource management", "Applied problem-solving", "Patience with long growth cycles"],
  "Architecture & Construction": ["Spatial & visual thinking", "Technical drawing & design software", "Project & site management", "Structural & materials understanding", "Regulatory & safety codes", "Client communication", "Budgeting & cost estimation"],
  "Arts, A/V Technology & Communications": ["Creativity & original thinking", "Visual, audio or written storytelling", "Relevant creative software & tools", "Building a strong portfolio", "Audience & platform awareness", "Collaboration under deadline", "Adaptability across formats"],
  "Business Management & Administration": ["Strategic & commercial thinking", "Leadership & ownership", "Communication & negotiation", "Analytical decision-making", "Financial literacy", "Project & team coordination", "Resilience & initiative"],
  "Education & Training": ["Communication & patience", "Empathy & active listening", "Subject-matter mastery", "Lesson planning & assessment design", "Classroom/audience management", "Continuous learning", "Ethics & confidentiality"],
  "Finance": ["Numerical & analytical thinking", "Attention to detail", "Regulatory & compliance knowledge", "Ethics & integrity", "Client communication", "Risk assessment", "Spreadsheet & financial-tool fluency"],
  "Government & Public Administration": ["Analytical & argumentative reasoning", "Reading comprehension & drafting", "Ethics & integrity", "Public communication", "Judgement under pressure", "Policy & regulatory awareness"],
  "Health Science": ["Biology & chemistry fundamentals", "Empathy & patient communication", "Precision & attention to detail", "Resilience under pressure", "Ethics & confidentiality", "Teamwork in clinical settings", "Continuous, lifelong learning"],
  "Hospitality & Tourism": ["People & service mindset", "Coordination & planning", "Composure under pressure", "Attention to detail", "Cultural awareness", "Multitasking", "On-the-spot problem-solving"],
  "Human Services": ["Empathy & active listening", "Communication & counselling skills", "Ethics & confidentiality", "Patience & emotional resilience", "Cultural sensitivity", "Case organisation & follow-through"],
  "Information Technology": ["Programming & logical thinking", "Data structures & problem-solving", "Debugging & systems thinking", "One area of deep specialisation", "Continuous self-learning", "Collaboration (version control, code review)"],
  "Law, Public Safety, Corrections & Security": ["Analytical & argumentative reasoning", "Reading comprehension & drafting", "Ethics & integrity", "Communication & advocacy", "Judgement under pressure", "Attention to procedure & detail"],
  "Manufacturing": ["Technical & mechanical aptitude", "Process & quality-control thinking", "Safety & standards discipline", "Problem-solving under constraints", "Attention to detail", "Teamwork on a production floor"],
  "Marketing": ["Communication & storytelling", "Creative and analytical thinking", "Understanding consumer behaviour", "Data analysis & metrics literacy", "Digital tools & platforms fluency", "Adaptability to trends"],
  "STEM": ["Mathematical & logical reasoning", "Curiosity & structured problem-solving", "Lab or computational methods", "Technical writing & presentation", "Attention to precision", "Patience with long, complex problems"],
  "Transportation, Distribution & Logistics": ["Discipline & fitness for the role", "Technical precision", "Decision-making under pressure", "Safety-first mindset", "Coordination & planning", "Composure in high-stakes situations"],
};
function clusterCoreSkills(cluster: string): string[] {
  return CLUSTER_CORE_SKILLS[cluster as StandardCluster] ?? [];
}

// A one-line, plainly-true description of what the cluster actually
// involves - shown under the domain name in the consolidated table so a
// student can tell what "STEM" or "Human Services" means without already
// knowing the cluster taxonomy. Generic-but-accurate by design (it has to
// hold for every career inside the cluster, not just one path through it),
// same authorship standard as CLUSTER_CORE_SKILLS above.
// STEM is the one StandardCluster name that's a bare acronym rather than
// plain English - every other cluster (Health Science, Marketing, ...) is
// already self-explanatory. Spelled out once wherever the cluster name is a
// page/section HEADING (clusterHeading below); left bare in dense, repeated
// contexts (the bar chart, the consolidated overview table) where the full
// form already appears nearby on that cluster's own detail page and a long
// parenthetical would just overflow a tight row.
const CLUSTER_FULL_NAME: Partial<Record<StandardCluster, string>> = {
  "STEM": "Science, Technology, Engineering & Mathematics",
};
const clusterHeading = (cluster: string): string => {
  const full = CLUSTER_FULL_NAME[cluster as StandardCluster];
  return full ? `${cluster} (${full})` : cluster;
};

const CLUSTER_TAGLINE: Record<StandardCluster, string> = {
  "STEM": "Explore science, research and engineering to solve real-world problems.",
  "Information Technology": "Build software, work with data and create digital solutions.",
  "Health Science": "Care for people's health, from clinical practice to allied health roles.",
  "Finance": "Manage money, investments and risk for people and businesses.",
  "Business Management & Administration": "Lead teams, run operations and grow organisations.",
  "Law, Public Safety, Corrections & Security": "Uphold justice, safety and public order.",
  "Human Services": "Support people's wellbeing through counselling, care and community work.",
  "Arts, A/V Technology & Communications": "Create visual, audio and written work that informs or entertains.",
  "Architecture & Construction": "Design and build the structures people live and work in.",
  "Government & Public Administration": "Serve the public through policy, administration and civil service.",
  "Hospitality & Tourism": "Deliver experiences across travel, hotels, food and events.",
  "Agriculture, Food & Natural Resources": "Work with land, food systems and natural resources sustainably.",
  "Education & Training": "Teach, mentor and design learning for others.",
  "Marketing": "Understand audiences and communicate what makes a product or idea worth choosing.",
  "Manufacturing": "Design, produce and maintain the physical goods people use.",
  "Transportation, Distribution & Logistics": "Move people and goods safely and efficiently.",
};

// Every STANDARD_CLUSTERS.salaryIndia string already follows the same
// Every STANDARD_CLUSTERS.salaryIndia string has exactly 3 "·"-separated
// bands in entry/mid/senior ORDER, but not every band ends in the literal
// word "entry"/"mid"/"senior" - several end in a parenthetical role
// description instead (e.g. Health Science's "...(doctors post-PG)",
// Finance's "...(CFO / fund management)"). An earlier version tried to
// detect the label from a keyword match against the tail of the string,
// which silently swallowed whatever came after "senior"/"mid" when the real
// text had more words following it, and printed the WHOLE unparsed string
// twice (once as a label, once as a fallback value) whenever no keyword
// matched at all. This version never guesses which band a string belongs
// to - position alone decides that - and only ever strips a bare, trailing
// occurrence of the label word (safe because it only fires when that exact
// word is the very last thing in the string), so no real content is ever
// dropped or duplicated.
function stripTrailingLabel(text: string): string {
  return text
    .replace(/\s*senior\s*\/\s*lead\s*$/i, "")
    .replace(/\s*\bsenior\b\s*$/i, "")
    .replace(/\s*\blead\b\s*$/i, "")
    .replace(/\s*\bmid\b\s*$/i, "")
    .replace(/\s*\bentry\b\s*$/i, "")
    .trim();
}
function salaryBands(india: string | undefined): { headline: string; mid: string; senior: string } {
  if (!india) return { headline: "-", mid: "", senior: "" };
  const [entry, mid, senior] = india.split(/\s*·\s*/).map((s) => s.trim());
  return { headline: stripTrailingLabel(entry ?? india), mid: mid ? stripTrailingLabel(mid) : "", senior: senior ? stripTrailingLabel(senior) : "" };
}

// The compact "at a glance" table version of a domain-group list - S.No ·
// Domain · Roles · Skills · Salaries · Explore, one row per cluster, as
// requested for the top of the Fitment/Suitability pages. The detailed
// per-role Psy.Analysis/Skill/Comment breakdown (DomainBlock/RolesTable)
// still follows underneath for anyone digging into a specific role, so
// this is a lead-in summary, not a replacement for that existing detail.
function SecLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>{children}</div>;
}
// A stacked list of cards, one per domain, instead of a wide <table> - a
// 7-column table (domain/roles/skills/salary/companies/explore) forced
// horizontal scrolling on anything narrower than ~900px, and one long list
// (skills, companies) in a single cell stretched the WHOLE row's height,
// misaligning every other column next to it. A card's sections (domcard-
// grid, see FullReport.tsx) just reflow to fit whatever width is available,
// so nothing ever needs a horizontal scrollbar, and a long section only
// grows its own card.
function ClusterSummaryTable({ groups, showCompanies }: { groups: DomainGroup1112[]; showCompanies?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {groups.map((g, i) => {
        const sal = CLUSTER_SALARY.get(g.domain);
        const bands = salaryBands(sal?.india);
        const links = CLUSTER_EXPLORE_LINKS[g.domain as keyof typeof CLUSTER_EXPLORE_LINKS] ?? [];
        const companies = CLUSTER_COMPANIES[g.domain as keyof typeof CLUSTER_COMPANIES];
        const color = clusterColor(g.domain);
        return (
          <div key={g.domain} style={{ border: "1px solid var(--line)", borderLeft: `4px solid ${color}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: `${color}0a`, borderBottom: "1px solid var(--line)" }}>
              <span style={{ width: 26, height: 26, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 12.5, display: "grid", placeItems: "center", flex: "none" }}>{i + 1}</span>
              <DomainChip domain={g.domain} size={36} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>{clusterHeading(g.domain)}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{CLUSTER_TAGLINE[g.domain as StandardCluster] ?? ""}</div>
              </div>
              <div style={{ textAlign: "right", flex: "none" }}>
                <div style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: "-.01em" }}>{g.topScore.toFixed(0)}%</div>
                <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>Fit</div>
              </div>
            </div>

            <div className="domcard-grid">
              <div className="domcard-sec">
                {/* Just the role names - the fit % is already the whole
                    point of the domain's own rank on the overview page and
                    the per-role table further down this same page; showing
                    it a third time here, on every row, was pure repetition. */}
                <SecLabel>Key roles</SecLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
                  {g.careers.slice(0, 4).map((c) => (
                    <span key={c.career.name} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{c.career.name}</span>
                  ))}
                </div>
              </div>
              <div className="domcard-sec">
                <SecLabel>Skills to acquire</SecLabel>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                  {clusterCoreSkills(g.domain).length ? clusterCoreSkills(g.domain).map((s) => (
                    <span key={s} style={{ fontSize: 10.5, background: "var(--line-2, #f2f2f4)", color: "var(--ink-2)", fontWeight: 600, borderRadius: 6, padding: "3px 8px", lineHeight: 1.35 }}>{s}</span>
                  )) : <span style={{ fontSize: 11, color: "var(--muted)" }}>-</span>}
                </div>
              </div>
              <div className="domcard-sec">
                <SecLabel>Salary (India)</SecLabel>
                <div style={{ fontSize: 14.5, fontWeight: 800, color: "var(--ink)", marginTop: 8 }}>{bands.headline}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 5 }}>
                  {[{ label: "Mid", value: bands.mid }, { label: "Senior", value: bands.senior }].filter((b) => b.value).map((b) => (
                    <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".04em", color, background: `${color}14`, borderRadius: 4, padding: "2px 5px", flex: "none" }}>{b.label.toUpperCase()}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)" }}>{b.value}</span>
                    </div>
                  ))}
                </div>
                {links.length > 0 && (
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noreferrer" style={{ fontSize: 11.5, fontWeight: 700, color, textDecoration: "none" }}>{l.label} →</a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {showCompanies && (
              <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line-2, var(--line))" }}>
                {/* One wrapping row, capped to 3+2 - the full list (up to 13
                    names) as one comma-joined sentence is what made this read
                    as one long, unstructured wall of text. Govt/PSU names get
                    the cluster-coloured tint so they stand out from regulars. */}
                <SecLabel>Top companies that hire</SecLabel>
                {companies ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                    {companies.regular.slice(0, 3).map((c) => (
                      <span key={c} style={{ fontSize: 10.5, fontWeight: 700, color: "var(--ink-2)", background: "var(--line-2, #f2f2f4)", borderRadius: 999, padding: "3px 10px" }}>{c}</span>
                    ))}
                    {companies.govt.slice(0, 2).map((c) => (
                      <span key={c} style={{ fontSize: 10.5, fontWeight: 700, color, background: `${color}12`, borderRadius: 999, padding: "3px 10px" }}>{c}</span>
                    ))}
                  </div>
                ) : <span style={{ fontSize: 11, color: "var(--muted)" }}>Not researched yet</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// The "10 real funded programmes" table (CLUSTER_FUNDED_PROGRAMS) - one
// sub-block per cluster the student is ranked into, each with its own small
// table (program / overview / eligibility / stipend / on completion),
// matching FREE_STIPEND_ROUTE's existing shape/tone exactly. A cluster with
// no researched programmes yet is skipped silently rather than shown as an
// empty table - an empty table reads as "there's nothing here," which isn't
// true, it just isn't researched yet (see CLUSTER_FUNDED_PROGRAMS's own comment).
// Government-vs-industry is presentational only - a keyword check over
// fields that already exist (name/verify/url), not a new researched fact.
// Every program still names its own real conducting body regardless of
// which pill it gets; this just colour-codes the distinction at a glance.
function fundingBadge(p: FundedProgram): { label: string; tone: string; bg: string; icon: string } {
  const text = `${p.name} ${p.verify} ${p.url}`.toLowerCase();
  const isGovt = /\.gov\.in|\.nic\.in|government|ministry|upsc|ssc\.gov|isro|drdo|public sector|psu\b/.test(text);
  return isGovt
    ? { label: "Government-Backed", tone: "#2a5aa0", bg: "#eaf1fb", icon: "bank" }
    : { label: "Industry-Led", tone: "#a3620b", bg: "#fdf1de", icon: "bank" };
}
// Program names in this data follow "SHORT NAME - full sponsor/description"
// (e.g. "NDA - National Defence Academy") - split at that dash for a bold
// short headline plus a subtitle, instead of one long run-on title.
function splitProgramName(name: string): { headline: string; sub: string | null } {
  const idx = name.indexOf(" - ");
  return idx === -1 ? { headline: name, sub: null } : { headline: name.slice(0, idx), sub: name.slice(idx + 3) };
}
function urlHost(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return url; }
}
// Every FundedProgram.eligibility string follows "Stream: ... Percentage:
// ... Exam: ..." (plus sometimes trailing age/notification caveats after
// Exam) - the card only needs Stream + Percentage, so this drops
// everything from "Exam:" onward and strips parenthetical asides, turning
// a 3-sentence paragraph into one short line.
function shortEligibility(text: string): string {
  const cut = text.split(/\.\s*Exam:/)[0];
  const stripped = cut.replace(/\s*\([^)]*\)/g, "").replace(/\s{2,}/g, " ").trim();
  return stripped.endsWith(".") ? stripped : `${stripped}.`;
}

// Real logos, sourced from Wikimedia Commons and verified (fetched, 200 OK)
// before use - same standard as every other fact in this file. Only the
// sponsors below have a confirmed, working file; every other programme
// keeps the plain colour-badge fallback rather than guessing a logo that
// might be wrong or might not exist. Matched against the program's own
// `name` text, first match wins - ordered narrowest-sponsor-first so e.g.
// "TCS iON" doesn't accidentally match a broader term first.
const WIKIMEDIA_FILE = (name: string) => `https://commons.wikimedia.org/wiki/Special:FilePath/${name}`;
const SPONSOR_LOGOS: { test: RegExp; url: string }[] = [
  { test: /\bTCS\b/i, url: WIKIMEDIA_FILE("TATA_Consultancy_Services_Logo_blue.svg") },
  { test: /\bUPSC\b/i, url: WIKIMEDIA_FILE("Union_Public_Service_Commission_Logo.png") },
  { test: /\bSSC\b/i, url: WIKIMEDIA_FILE("Staff_Selection_Commission_Logo.jpg") },
  { test: /\bNDA\b|National Defence Academy/i, url: WIKIMEDIA_FILE("National_Defence_Academy_NDA.png") },
  { test: /\bICAI\b/i, url: WIKIMEDIA_FILE("New_CA_India_Logo.png") },
  { test: /\bNID\b/i, url: WIKIMEDIA_FILE("National_Institute_of_Design_logo.svg") },
  { test: /\bICAR\b/i, url: WIKIMEDIA_FILE("Logo_of_the_Indian_Council_of_Agricultural_Research.svg") },
  { test: /\bNATS\b|National Apprenticeship Training Scheme/i, url: WIKIMEDIA_FILE("Ministry_of_Education_India.svg") },
  { test: /\bISRO\b|IIST\b/i, url: WIKIMEDIA_FILE("Indian_Space_Research_Organisation_Logo.svg") },
  { test: /Army|Navy|Air Force|Agniveer|AFMC|Armed Forces|Naval Academy/i, url: WIKIMEDIA_FILE("Armed_forces_logo.svg") },
];
function sponsorLogo(name: string): string | null {
  return SPONSOR_LOGOS.find((s) => s.test.test(name))?.url ?? null;
}

function FundedProgramCard({ p, color }: { p: FundedProgram; color: string }) {
  const badge = fundingBadge(p);
  const { headline, sub } = splitProgramName(p.name);
  const logo = sponsorLogo(p.name);
  // Fixed per-stat colours (not the cluster colour) - the three things being
  // compared (who qualifies / how much / what you get) are the same three
  // categories on every card, so giving each its own consistent colour reads
  // faster across a grid of many cards than one colour repeated three times.
  const stats = [
    { label: "Eligibility", value: shortEligibility(p.eligibility), icon: "user", color: "#2a5aa0" },
    { label: "Stipend", value: p.stipend, icon: "card", color: "#1f7a55" },
    { label: "On completion", value: p.outcome, icon: "score", color: "#a3620b" },
  ];
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 16, padding: "24px 26px", background: "#fff" }}>
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={`${headline} logo`} style={{ width: 96, height: 96, objectFit: "contain", borderRadius: 12, background: "#fff", border: "1px solid var(--line)", padding: 12, flex: "none" }} />
        ) : (
          <span style={{ width: 96, height: 96, borderRadius: 12, background: `${color}14`, display: "grid", placeItems: "center", flex: "none", fontWeight: 900, fontSize: 32, color }}>{headline.charAt(0)}</span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "var(--ink)", lineHeight: 1.25 }}>{headline}</div>
              {sub && <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink-2)", marginTop: 3 }}>{sub}</div>}
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 800, padding: "6px 14px", borderRadius: 999, color: badge.tone, background: badge.bg, whiteSpace: "nowrap", flex: "none" }}>
              <Icon name={badge.icon} size={13} />
              {badge.label}
            </span>
          </div>
          {/* One consistent colour for the whole description - summary and
              structure used to switch tone mid-sentence, which read as a
              rendering glitch rather than a deliberate distinction. */}
          <p style={{ margin: "10px 0 0", fontSize: 14.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{p.summary} {p.structure}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--line-2, var(--line))" }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ padding: "0 20px", borderLeft: i > 0 ? "1px solid var(--line-2, var(--line))" : "none", minWidth: 0 }}>
            {/* The LABEL is the highlighted thing here - bold and in the
                stat's own colour - not the value text below it, which is
                just information to read, not something to shout. The value
                is capped at 2 real lines (not squeezed to 1 - that hid the
                actual text behind an ellipsis almost immediately); the full
                text is also on the title tooltip as a fallback. */}
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
              <span style={{ width: 30, height: 30, borderRadius: "50%", background: `${s.color}16`, display: "grid", placeItems: "center", flex: "none" }}>
                <Icon name={s.icon} size={15} style={{ color: s.color }} />
              </span>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: s.color }}>{s.label}</span>
            </div>
            <div title={s.value} style={{ fontSize: 13, fontWeight: 400, color: "var(--ink-2)", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--line-2, var(--line))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <a href={p.url} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 700, color: "#fff", background: color, padding: "10px 18px", borderRadius: 10, textDecoration: "none" }}>
            View official source ↗
          </a>
          <span style={{ fontSize: 13, color: color, fontWeight: 600 }}>{urlHost(p.url)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "var(--muted)" }}>
          <Icon name="info" size={14} />
          Details may change - refer to the official source for the latest information.
        </div>
      </div>
    </div>
  );
}

function FundedProgramsSection({ groups }: { groups: DomainGroup1112[] }) {
  const withPrograms = groups
    .map((g) => ({ g, programs: CLUSTER_FUNDED_PROGRAMS[g.domain as keyof typeof CLUSTER_FUNDED_PROGRAMS] }))
    .filter((x): x is { g: DomainGroup1112; programs: NonNullable<typeof x.programs> } => Boolean(x.programs && x.programs.length));
  if (!withPrograms.length) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {withPrograms.map(({ g, programs }) => {
        const color = clusterColor(g.domain);
        return (
          <div key={g.domain} style={{ border: "1px solid var(--line)", borderRadius: 20, padding: 24, background: "#f8f9fc" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: "1px solid var(--line)" }}>
              <span style={{ width: 64, height: 64, borderRadius: "50%", background: `${color}16`, display: "grid", placeItems: "center", flex: "none" }}>
                <Icon name="briefcase" size={26} style={{ color }} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--ink)", letterSpacing: ".08em", textTransform: "uppercase" }}>{clusterHeading(g.domain)}</div>
                <div style={{ fontSize: 15, color: "var(--ink-2)", marginTop: 4 }}>{CLUSTER_TAGLINE[g.domain as StandardCluster] ?? ""}</div>
              </div>
              {/* Two distinct pills - "this is real" and "this pays/waives
                  something" are two separate claims, not one combined label. */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#1f7a55", background: "#eaf6f0", padding: "8px 16px", borderRadius: 999 }}>
                  <Icon name="check" size={14} />
                  Verified
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2a5aa0", background: "#eaf1fb", padding: "8px 16px", borderRadius: 999 }}>
                  Funded
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {programs.map((p) => <FundedProgramCard key={p.name} p={p} color={color} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// A domain card matching class 9-10's DomainCard shell (`.dom` - the coloured
// top border, radius and shadow every illustrated card in this report uses)
// so Career Fitment/Suitability read as the SAME report format, not a
// separately designed page - just without the hero image/tagline/"how to
// join"/skills text DomainCard has, since DOMAINS_1112 has no authored copy
// for those and fabricating it would repeat the mistake cut earlier for
// college cutoffs. Roles are a literal table (see RolesTable) per the
// tabular format requested, instead of DomainCard's stacked row list.
function DomainBlock({ g, rank, badge }: { g: DomainGroup1112; rank: number; badge?: React.ReactNode }) {
  const sal = CLUSTER_SALARY.get(g.domain);
  const color = clusterColor(g.domain);
  const rcVars = { ["--rc" as string]: color, ["--rc-tint" as string]: color + "12", ["--rc-line" as string]: color + "38" } as React.CSSProperties;
  // The domain's own rank is 70% interest / 30% skill (see groupByCluster1112
  // in careerFitEngine1112.ts) - a domain earns a high rank mainly by strong,
  // consistent INTEREST across it. Each role's own verdict below is stricter,
  // requiring interest AND skill to both clear a bar. That's not a
  // contradiction: a #1-ranked domain can legitimately show "Medium Choice"
  // on every role when interest is what's driving the rank and skill hasn't
  // caught up yet (expected before actually studying the field) - but
  // without saying so, it just reads as the domain rank being wrong. This
  // note only shows when that gap is real (interest meaningfully ahead of
  // skill across the shown roles), not on every domain.
  const avgInterest = g.careers.reduce((s, c) => s + c.interest, 0) / (g.careers.length || 1);
  const avgSkill = g.careers.reduce((s, c) => s + c.skill, 0) / (g.careers.length || 1);
  const interestLed = avgInterest - avgSkill > 20;
  return (
    <div className="dom" style={{ ...rcVars, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 18px", background: "var(--rc-tint)", borderBottom: "1px solid var(--rc-line)" }}>
        <span style={{ width: 34, height: 34, borderRadius: 10, background: color, color: "#fff", display: "grid", placeItems: "center", flex: "none", fontWeight: 800, fontSize: 14 }}>{rank}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="nm">Career Cluster {rank}: {clusterHeading(g.domain)}</div>
        </div>
        <div style={{ flex: "none" }}>{badge}</div>
      </div>
      {interestLed && (
        <div style={{ padding: "10px 18px", background: "var(--rc-tint)", borderBottom: "1px solid var(--rc-line)", fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
          <b style={{ color: "var(--ink)" }}>Why this domain ranks here despite "Medium Choice" roles:</b> your interest in {g.domain} is strong and consistent - that's what earns it this rank. Skill reflects where you are today, not a ceiling - it's expected to still be developing before you've actually studied the field, and builds once you do.
        </div>
      )}
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

// One category's card in the "every degree open to you" section - a header
// (category name + salary, taken from the category's own salaryDomain) plus
// one line per degree with its real eligibility mark for THIS student's
// stream (🟢 fully eligible, 🟡 conditional, 🟢🟡/🟡🔴 the workbook's own
// borderline marks - see degreeStreamMatrix.ts for why those aren't
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
          Salary - India: {sal.india} &nbsp;|&nbsp; Abroad: {sal.abroad}
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
              <span style={{ color: "var(--muted)", fontSize: 11 }}>- {ELIGIBILITY_LABEL[mark]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// One card in the "based on your specific strengths" section - a single
// named dimension (e.g. "Coding Interest", not a whole domain) picked
// because the student's own measured profile scored highest on it, with
// the workbook's real question/courses/jobs/skills/salary/government-jobs
// for that exact dimension. See dimensionCareerGuide.ts for how the score
// is derived and why a few dimensions (Risk Orientation, Work Environment,
// Motivators) never appear here - no measured field in this app proxies them.
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

// The 6-category legend the "Comment" column reads against - static,
// explanatory, doesn't depend on student data, matching the reference
// report's own "Scenarios" block.
const SCENARIOS: { label: string; tone: string; text: string }[] = [
  { label: "Top Choice", tone: VERDICT_TONE["Top Choice"].c, text: "Both your interest and your skills are strong here - a genuine best fit." },
  { label: "Medium Choice", tone: VERDICT_TONE["Medium Choice"].c, text: "Worth considering - but either your interest or your skills need more building here, not both." },
  { label: "Low Choice", tone: VERDICT_TONE["Low Choice"].c, text: "Both your measured interest and skills are low here - not a strong match right now." },
];
function ScenariosLegend() {
  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "14px 16px" }}>
      <div className="subhd" style={{ marginBottom: 10 }}>Scenarios - how to read the Comment column</div>
      <ol style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
        {SCENARIOS.map((s) => (
          <li key={s.label} style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
            <b style={{ color: s.tone }}>{s.label}</b> - {s.text}
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
    "That's exactly what this ranking is for - every cluster below is ordered by how well it fits your own measured interests and abilities, not by popularity.",
  "Admissions & Competition: Cracking tough entrance exams and getting into a good college.":
    "The Career Selector page ahead names the specific entrance exam for your chosen career, with a full roadmap to it.",
  "Career Outcomes: Getting a stable job, good salary, and career growth.":
    "Each cluster below shows its real entry/mid/senior salary range in India and abroad, under \"Typical earnings.\"",
  "Financial Cost: Affordability, high fees, or student expenses.":
    "See the Funded Programmes table on the Career Suitability page ahead - genuinely funded or stipend-linked routes, not just any paid course.",
  "Family & Location: Parents' expectations or having to relocate.":
    "Worth sharing your top clusters below with your family directly - a concrete, ranked list from your own answers is easier to discuss than a vague direction.",
  "Confusion / Lack of Info: Feeling overwhelmed, limited, or unaware of the options.":
    "That's what the ranking below is for - it narrows 332 careers down to the ones your own profile actually points toward.",
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
            <b style={{ color: "var(--ink)" }}>{c.split(":")[0]}</b> - {CONCERN_POINTERS[c]}
          </div>
        ))}
      </div>
    </div>
  );
}

// Horizontal bar chart of every cluster's own fit score (topScore, the same
// distinct-RIASEC-deduped interest average groupByCluster1112 already
// computes) - hand-rolled SVG, since this repo has no charting library.
// Only clusters the student scored above 0 on are
// drawn (a cluster with literally zero matching interest signal isn't a
// bar worth showing, not a bug) - sorted strongest first, one colour per
// cluster from CLUSTER_COLOURS so no two bars are ever confusably identical.
function ClusterBarChart({ groups }: { groups: DomainGroup1112[] }) {
  const rows = groups.filter((g) => g.topScore > 0);
  if (!rows.length) return null;
  // padL has to fit the longest label ("Law, Public Safety, Corrections &
  // Security", "Transportation, Distribution & Logistics") at 11.5px bold -
  // anything narrower clips those labels off the SVG's left edge instead of
  // just cramping them. Labels are left-aligned from a fixed x=16, growing
  // rightward like normal text, rather than anchored to the bars' left edge.
  // rowH is tall enough that 16 rows fill the page's real available height
  // (the sheet is a fixed A4 page - a short chart just leaves the rest of
  // the page blank) instead of only using the top third of it.
  const W = 760, rowH = 45, padL = 350, padR = 56, padT = 6, padB = 6;
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
            <text x={16} y={y + rowH / 2 + 4} textAnchor="start" fontSize={13} fontWeight={700} fill="var(--ink)">{r.domain}</text>
            <rect x={padL} y={y + 8} width={W - padL - padR} height={rowH - 16} rx={5} fill={color} opacity={0.14} />
            <rect x={padL} y={y + 8} width={barW(r.topScore)} height={rowH - 16} rx={5} fill={color} />
            <text x={padL + barW(r.topScore) + 8} y={y + rowH / 2 + 4} fontSize={13} fontWeight={800} fill="var(--ink)">{r.topScore.toFixed(0)}%</text>
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
  // RIASEC-driven - see RankingContext1112's own header comment in
  // careerFitEngine1112.ts for why.
  const rankingCtx = {
    desiredCareerText: desiredCareer,
    enjoyedSubject: output.layer2.enjoyedSubject,
    difficultSubject: output.layer2.difficultSubject,
    currentSubjects: output.layer2.currentSubjects,
    consideringAreas: output.layer4.consideringAreas,
    alternativeCareerTexts: output.layer4.alternativeOptions,
    excludedCareerTexts: output.layer4.excludedCareers,
    pathwayType: output.layer4.pathwayType,
  };

  const fitmentRanked = rankFitment1112(l1, rankingCtx);
  const fitmentGroups = groupByCluster1112(fitmentRanked, 5, 5);
  // Every one of the 16 clusters' scores, for the cluster-fit bar chart -
  // domainLimit=16 (not 5) so nothing is cut, rolesPerGroup=1 since the
  // chart only needs each cluster's topScore, not its role list.
  const allClusterScores = groupByCluster1112(fitmentRanked, 16, 1);
  // Roles Fitment already showed, per cluster - Suitability skips these so
  // the two pages don't print the identical role list for a shared cluster;
  // it shows the NEXT tier of roles instead (still real, still ranked).
  const fitmentShownIds = new Set(fitmentGroups.flatMap((g) => g.careers.map((c) => c.career.id)));

  // Widen Suitability to include Bridge-fit careers (not just Native Fit)
  // when the student's own reasons for their current stream suggest it
  // wasn't a fully self-driven choice - family/mentor steer, peer influence
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

  // This roadmap is the STANDARD, pre-authored path for Career Suitability's
  // #1 domain (CLUSTER_ROADMAPS, clusterRoadmaps1112.ts) - generic to that
  // domain, not built around the student's specific desired career or
  // stream. The short "you are here → destination" banner above already
  // covers the desired career directly (on track / bridge / hard gate + the
  // exam to take); this section answers a different, always-the-same-source
  // question - "what does a realistic path in your best-fit domain actually
  // look like" - so it never name-drops the desired career or the stream.
  const roadmapDomain = suitabilityGroups[0]?.domain ?? null;
  const realisticRoadmap = roadmapDomain ? CLUSTER_ROADMAPS[roadmapDomain as StandardCluster] : null;

  const sheets: ReportSheet[] = [
    {
      id: "career-clusters-bar-1112",
      kicker: "Your career cluster fit",
      node: (
        <>
          <PageHead eyebrow="Across the standard career clusters" title="Your Career Cluster Fit"
            sub="How strongly your measured interests, aptitude and strengths line up with each of the Career Clusters - the same industry-standard groupings used across career guidance, not a scheme unique to this report." />
          <div style={{ marginTop: 24, border: "1px solid var(--line)", borderRadius: 13, padding: "28px 24px" }}>
            <ClusterBarChart groups={allClusterScores} />
          </div>
        </>
      ),
    },
    {
      id: "career-overview-table-1112",
      kicker: "Overview",
      node: (
        <>
          <PageHead eyebrow="Fitment · Suitability · Selector, side by side" title="Your Career Path at a Glance"
            sub="Compare what fits you, what fits your stream, and explore your ideal career - all in one view." />
          <div className="full-bleed" style={{ marginTop: 22, border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.05), 0 10px 26px rgba(0,0,0,.05)" }}>
            {/* Each lens gets its own tinted colour band + icon circle
                (blue/green/orange) instead of one shared dark bar - reads as
                3 distinct cards sharing one table frame. */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <OverviewHeadCell icon="score" title="Career Fitment" subtitle="What fits you" desc="Domains that align with your interests and strengths." color="#2f6bff" />
              <OverviewHeadCell icon="cap" title="Career Suitability" subtitle="What fits your stream" desc="Domains that match your academic background." color="#12996b" borderLeft />
              <OverviewHeadCell icon="match" title="Career Selector" subtitle="Your desired career" desc="Your most suitable career based on your profile." color="#e08a1e" borderLeft />
            </div>
            {/* Body: 3 columns stretched to equal height (grid default) - the
                Selector column is flex-column with its illustration pinned to
                the bottom via marginTop:auto, so its shorter content doesn't
                leave a bare gap under it; it fills down to match
                Fitment/Suitability's real height instead. */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ minWidth: 0 }}>
                {fitmentGroups.length ? fitmentGroups.map((f, i) => (
                  <OverviewRow key={f.domain} rank={i + 1} name={f.domain} pct={f.topScore} color="#2f6bff"
                    roles={f.careers.slice(0, 3).map((c) => c.career.name)} />
                )) : <OverviewEmpty text="No matches yet." />}
              </div>

              <div style={{ minWidth: 0, borderLeft: "1px solid var(--line)" }}>
                {suitabilityGroups.length ? suitabilityGroups.map((s, i) => (
                  <OverviewRow key={s.domain} rank={i + 1} name={s.domain} pct={s.topScore} color="#12996b"
                    roles={s.careers.slice(0, 3).map((c) => c.career.name)} />
                )) : <OverviewEmpty text="Nothing native to your stream in this rank yet." />}
              </div>

              <div style={{ minWidth: 0, borderLeft: "1px solid var(--line)", background: "#fef9f2", display: "flex", flexDirection: "column" }}>
                {desiredCareer && selector?.career ? (
                  <div style={{ minWidth: 0, padding: "14px 14px 0", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ minWidth: 0, border: "1px solid #e08a1e38", background: "#fff", borderRadius: 12, padding: "16px 14px" }}>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: "var(--ink)" }}>{streamKey || "Your stream"}</div>
                        <div style={{ fontSize: 17, color: "#e08a1e", margin: "4px 0" }}>↓</div>
                        <div style={{ fontSize: 17, fontWeight: 900, color: "var(--ink)", letterSpacing: "-.01em", wordBreak: "break-word" }}>{selector.career.name}</div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
                        <Pill label={selector.roadmap!.fitType} tone={toneForFitType(selector.roadmap!.fitType)} />
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-2)", textAlign: "center", lineHeight: 1.5, marginTop: 6 }}>{selector.roadmap!.actionSummary}</div>
                      <div style={{ minWidth: 0, fontSize: 11, color: "var(--ink-2)", textAlign: "left", marginTop: 12, padding: "10px 12px", background: "#e08a1e0a", border: "1px solid #e08a1e30", borderRadius: 8, display: "flex", alignItems: "flex-start", gap: 8 }}>
                        <Icon name="cap" size={16} style={{ color: "#e08a1e", flex: "none", marginTop: 1 }} />
                        <span style={{ minWidth: 0 }}><b style={{ color: "var(--ink)" }}>Entrance exam:</b> {selector.career.typicalEntranceExam}</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 10, fontStyle: "italic", textAlign: "center" }}>The realistic path and simple next steps are on the Career Selector page ahead.</div>
                    </div>
                    <SummitIllustration />
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
            sub="Your top 5 domains, ranked purely by your assessment. Ignores your stream entirely - this is what your interests, aptitude and strength domains point toward, with no filter for what's currently reachable. Career Suitability, next, applies the real-world stream filter." />
          <div style={{ marginTop: 20 }}>
            <ConcernPointers concerns={output.layer4.topConcerns ?? []} />
            {/* The consolidated table is the whole story here - Career
                Suitability, next, is where each of these domains gets the
                full per-role breakdown, since that's the realistic, stream-
                filtered list worth reading in that much depth. */}
            {fitmentGroups.length ? <ClusterSummaryTable groups={fitmentGroups} /> : <p>No matches yet.</p>}
          </div>
          <p className="disclaimer" style={{ marginTop: 16 }}>
            You're free to explore any career, in any domain - this is a starting point, not a fixed path.
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
            sub={`Your top domains that ${streamKey || "your current stream"} actually reaches. Same ranking as Career Fitment, kept to only the careers you're already fully eligible for from your current stream (Native Fit) - no bridge step needed for any role shown here. Roles already listed under a domain in Career Fitment aren't repeated here - these are the next-best real options in the same domain.`} />
          <div style={{ marginTop: 20 }}>
            {suitabilityGroups.length ? <ClusterSummaryTable groups={suitabilityGroups} showCompanies /> : (
              <p style={{ fontSize: 13, color: "var(--ink-2)" }}>Nothing in your top fitment domains is a Native Fit for your current stream yet - see the roadmap page next for bridge options toward what you actually want.</p>
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
              <SecHead eyebrow="Real, verified funding - not JEE-score-gated" title="Funded programmes in your top domains"
                sub="Genuinely funded or stipend-linked routes into these fields - government training, sponsorship or apprenticeship programmes, not ordinary paid courses. Every fact here comes from an official source, verified before publishing, not a guess." />
              <div style={{ marginTop: 16 }}>
                <FundedProgramsSection groups={suitabilityGroups} />
                {!suitabilityGroups.some((g) => CLUSTER_FUNDED_PROGRAMS[g.domain as keyof typeof CLUSTER_FUNDED_PROGRAMS]?.length) && (
                  <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>We haven't researched verified funded programmes for your specific top domains yet - this section is filled in cluster by cluster as it's confirmed against official sources, not guessed to fill space.</p>
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
              ? `${desiredCareer} - your starting point, and the full journey to get there. The roadmap ahead is built for the long run, not just the next exam.`
              : "You didn't name a career - the roadmap ahead is still built for the long run, not just the next exam."} />
          {desiredCareer ? (
            selector?.career ? (
              <div style={{ marginTop: 20 }}>
                {/* The big, unmissable starting-point banner the whole page
                    hangs off - everything below answers "how do I get from
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

                {roadmapDomain && realisticRoadmap && (
                  <div style={BREAK}>
                    <SecHead center eyebrow={`${clusterHeading(roadmapDomain)} · your best-fit domain`} title="Your realistic path"
                      sub={`The standard path into a ${clusterHeading(roadmapDomain)} career - where you are now, through to senior/leadership roles. This is the same realistic route for anyone in this domain, not built around one specific job title.`} />
                    <div style={{ marginTop: 16 }}>
                      <ClusterRoadmapPath phases={realisticRoadmap.phases} color={clusterColor(roadmapDomain)} />
                    </div>
                  </div>
                )}

                <div style={BREAK}>
                  <SecHead center eyebrow="Where to go next" title="Explore internships"
                    sub="Live internship listings on your own OneGrasp dashboard." />
                  <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                    <a href={`${SITE_URL_1112}/account/internships-new`} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: clusterColor(selector.career.cluster), padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>Browse live internships on your dashboard ↗</a>
                  </div>
                </div>

                <div style={BREAK}>
                  <SecHead center eyebrow="What this role draws on" title="Skills and abilities that matter here" />
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {skillTagsFor1112(selector.career).map((s) => (
                      <span key={s} style={{ fontSize: 12, fontWeight: 700, color: clusterColor(selector!.career!.cluster), background: `${clusterColor(selector!.career!.cluster)}14`, border: `1px solid ${clusterColor(selector!.career!.cluster)}38`, padding: "6px 13px", borderRadius: 999 }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink-2)" }}>&ldquo;{desiredCareer}&rdquo; isn&apos;t in our {totalCareers}-career reference list yet - talk to your counsellor about the specific path, using Career Fitment and Career Suitability above as your general direction.</p>
            )
          ) : (
            <p style={{ marginTop: 20, fontSize: 13, color: "var(--ink-2)" }}>You didn&apos;t name a specific career, so there&apos;s nothing to check here yet - Career Fitment and Career Suitability still stand on their own.</p>
          )}
        </>
      ),
    },
  ];

  if (isClass12) {
    const resolvedStreamKey: StreamKey1112 = STREAM_KEY_1112[streamKey] ?? "Vocational/Other";
    const degreesByCategory = degreesForStream(resolvedStreamKey, { includeConditional: true });
    // Commented out per feedback, not deleted - re-enable by uncommenting
    // this line and the matching JSX block below.
    // const topDimensions = topDimensionsForStudent(resolvedStreamKey, l1, 3);
    const jeeBand = percentileBandFor(output.layer4.estimatedPercentage);

    sheets.push({
      id: "career-jee-wider-1112",
      kicker: "Your exam score & wider options",
      node: (
        <>
          <PageHead eyebrow="By degree programme" title={`Every undergraduate programme ${streamKey || "your stream"} can apply to`}
            sub="Not ranked by fit - this is the raw landscape: every real degree programme across every field, with the honest admission reality for your specific stream (some colleges are stricter than others, which is what the 🟢🟡/🟡🔴 marks capture)." />
          <div style={{ marginTop: 16, columnCount: degreesByCategory.size ? 2 : 1, columnGap: 24, columnRule: "1px solid var(--line)" }}>
            {degreesByCategory.size ? Array.from(degreesByCategory.entries()).map(([category, rows]) => (
              <div key={category} style={{ breakInside: "avoid" }}>
                <DegreeCategoryBlock category={category} rows={rows} streamKey={resolvedStreamKey} />
              </div>
            )) : <p style={{ fontSize: 13, color: "var(--ink-2)" }}>We don't have a specific degree-eligibility mapping for your stream yet.</p>}
          </div>

          {/* Commented out per feedback, not deleted - re-enable by
              uncommenting this block and the topDimensions line above.
          <div style={BREAK}>
            <SecHead eyebrow="By your specific strengths" title="What your top individual strengths point toward"
              sub="Different from both lists above - not a domain or a degree, but the 3 specific named strengths (e.g. Coding Interest, not just 'Computer & IT') your own profile scored highest on, each with the exact courses, roles, skills and government pathways for that strength." />
            <div style={{ marginTop: 16 }}>
              {topDimensions.length ? topDimensions.map((d, i) => <DimensionBlock key={d.dimension} d={d} rank={i + 1} />) : (
                <p style={{ fontSize: 13, color: "var(--ink-2)" }}>We don&apos;t have a specific strengths breakdown for your stream yet.</p>
              )}
            </div>
          </div>
          */}

          {(resolvedStreamKey === "MPC" || resolvedStreamKey === "PCMB") && jeeBand && (
            <div style={BREAK}>
              <SecHead eyebrow="If you're appearing for JEE Main" title={`What your ${jeeBand.label} band has recently opened up`}
                sub="Based on real 2026 JEE Main percentile-to-institution trends, not a promise - cutoffs genuinely shift every year by category, home-state quota and counselling round. Always confirm current eligibility on the official JoSAA/CSAB portal before deciding." />
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
