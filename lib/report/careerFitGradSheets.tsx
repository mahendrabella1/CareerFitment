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
 * The Selector page's roadmap is tiered by how much real, specific data
 * exists for the student's typed desiredCareer - it must match what they
 * actually SELECTED, not just their measured-profile Suitability cluster
 * (see CLAUDE.md's Graduates row: "we need to give roadmap for their
 * desired career... not for suitability"):
 *   Tier 1 - when desiredCareer resolves (via findCareer1112, read-only
 *     reuse of Class 11-12's data per CLAUDE.md) to one of the 360
 *     individually-researched CAREERS_1112 entries, DetailedCareerRoadmapViewGrad
 *     renders that REAL per-career content, remapped into this file's
 *     7-section shape (school/ugPathways/topColleges skipped - those are
 *     about CHOOSING a UG degree, moot for an already-enrolled student).
 *   Tier 2 - otherwise, the cluster-wide FlagshipRoadmapViewGrad/
 *     ClusterRoadmapView renders as before, but with the exact typed role
 *     pinned at the top of "careers you can be hired as" (PinnedRoleCallout) -
 *     honestly labelled as the student's path through shared, field-wide
 *     infrastructure, never silently presented as role-exclusive content we
 *     don't actually have.
 * No per-role primary research exists for Tier 2's ~3,086 roles (Graduates'
 * only per-role facts anywhere are "belongs to cluster X" and "reachable
 * from degree+course Y") - Tier 2 is the honest answer for that scale, not
 * a corner cut.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import { RANK_COLOURS } from "@/app/account/FullReport";
import { Icon } from "@/app/Icons";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { rankSuitabilityGrad } from "@/lib/newAssessment/scoringGrad";
import type { RIASECScore } from "@/lib/newAssessment/scoring11_12";
import { CAREER_CLUSTERS_18, CLUSTER_KEY_ROLES, CLUSTER_ROLES, clusterForDegreeCourse, clusterForRole, rolesForDegreeCourse } from "@/lib/report/careerClustersGrad";
import { clusterRoadmapGradFor, type GradClusterRoadmap, type GradYearFocus } from "@/lib/report/clusterRoadmapsGrad";
import { flagshipRoadmapForGrad, type FlagshipDomainRoadmapGrad } from "@/lib/report/flagshipRoadmapsGrad";
import { findCareer1112 } from "@/lib/report/careerFitEngine1112";
import { CAREERS_1112 } from "@/lib/report/careerfit1112";
import { detailedRoadmapFor, type DetailedCareerRoadmap } from "@/lib/report/careerRoadmapDetailed1112";
import { careerHorizonForCluster, HORIZON_PHASE_META, SKILL_LAYER_META, CAREER_HORIZON_GUIDANCE_NOTE, type ClusterCareerHorizon, type HorizonSkillLayers } from "@/lib/report/careerHorizonsGrad";
import { computeSkillGap, type GapStatus, type MeasuredGapRow, type UnmeasuredGapRow } from "@/lib/report/skillGapGrad";
import type { SkillEvidenceGrad } from "@/lib/newAssessment/skillEvidenceGrad";
import { RoleRoadmapSwitch, type RoleRoadmap, type RoleRoadmapBlock } from "@/lib/report/roleRoadmapGrad";

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

// One-line description per cluster - same tone/format as careerFit1112Sheets.tsx's
// own CLUSTER_TAGLINE (editorial, not a researched fact, so authored directly
// rather than searched - same standard that file already holds itself to).
const CLUSTER_TAGLINE_GRAD: Record<string, string> = {
  "Engineering, Technology & Computing": "Design, build and scale the technology and systems that power modern life.",
  "Science, Mathematics & Research": "Investigate, experiment and discover - from lab research to data-driven science.",
  "Healthcare & Medicine": "Care for people's health, from clinical practice to allied health and diagnostics.",
  "Psychology, Humanities & Social Sciences": "Understand people, society and the mind through research, counselling and social work.",
  "Sports, Fitness & Human Performance": "Train, coach and optimise the human body for performance and wellbeing.",
  "Agriculture, Food & Life Sciences": "Work with crops, livestock, food systems and biological sciences sustainably.",
  "Environment, Energy & Sustainability": "Protect ecosystems and build a cleaner, more sustainable energy future.",
  "Architecture, Construction & Built Environment": "Design and build the spaces and structures people live and work in.",
  "Business, Finance & Entrepreneurship": "Manage money, run organisations and build new ventures.",
  "Law, Legal & Compliance": "Uphold justice, interpret regulation and advise on legal and compliance matters.",
  "Government, Public Administration & Policy": "Serve the public through policy, administration and civil service.",
  "Education & Learning": "Teach, mentor and design learning experiences for others.",
  "Media, Communication, Arts & Design": "Create visual, written and digital work that informs, persuades or entertains.",
  "Manufacturing & Industrial Production": "Design, produce and maintain the physical goods and machinery people rely on.",
  "Supply Chain, Procurement & Logistics": "Move goods, manage inventory and keep global supply chains running.",
  "Travel, Tourism, Hospitality & Transport": "Deliver experiences across travel, hotels, food service and transport.",
  "Defence, Security & Emergency Services": "Protect people and nations through defence, policing and emergency response.",
  "Personal Care, Beauty & Wellness": "Help people look and feel their best through beauty, grooming and wellness services.",
};

// Transferable skills per cluster - same editorial standard as
// careerFit1112Sheets.tsx's CLUSTER_CORE_SKILLS (broad, cluster-wide
// skills every role in it draws on, not a tool specific to one sub-field).
const CLUSTER_CORE_SKILLS_GRAD: Record<string, string[]> = {
  "Engineering, Technology & Computing": ["Problem-solving & systems thinking", "Programming/technical fundamentals", "Data structures & algorithms", "Debugging & troubleshooting", "Tool & framework fluency", "Collaboration on technical teams"],
  "Science, Mathematics & Research": ["Analytical & quantitative reasoning", "Experimental design", "Data analysis & statistics", "Scientific writing", "Lab/technical methodology", "Critical evaluation of evidence"],
  "Healthcare & Medicine": ["Clinical/technical competence", "Patient communication & empathy", "Attention to detail under pressure", "Ethical judgement", "Teamwork in clinical settings", "Continuous learning (protocols evolve)"],
  "Psychology, Humanities & Social Sciences": ["Active listening & empathy", "Research & qualitative analysis", "Written & verbal communication", "Cultural sensitivity", "Ethical reasoning", "Case documentation"],
  "Sports, Fitness & Human Performance": ["Exercise & movement science", "Coaching & motivation", "Injury-prevention awareness", "Performance measurement", "Nutrition fundamentals", "Client/athlete communication"],
  "Agriculture, Food & Life Sciences": ["Biological & agronomic knowledge", "Field & lab observation", "Data-driven decision-making", "Sustainability practices", "Applied problem-solving", "Patience with long growth cycles"],
  "Environment, Energy & Sustainability": ["Environmental data analysis", "Regulatory & policy awareness", "Systems & lifecycle thinking", "Fieldwork & monitoring", "Technical reporting", "Stakeholder communication"],
  "Architecture, Construction & Built Environment": ["Spatial & visual thinking", "Technical drawing/CAD software", "Project & site management", "Structural & materials understanding", "Regulatory & safety codes", "Client communication"],
  "Business, Finance & Entrepreneurship": ["Numerical & analytical thinking", "Financial literacy", "Strategic & commercial thinking", "Leadership & ownership", "Communication & negotiation", "Spreadsheet/financial-tool fluency"],
  "Law, Legal & Compliance": ["Legal research & reasoning", "Drafting & written precision", "Argumentation & advocacy", "Regulatory/compliance knowledge", "Attention to detail", "Ethical judgement"],
  "Government, Public Administration & Policy": ["Policy analysis", "Public communication", "Administrative & procedural knowledge", "Stakeholder coordination", "Ethical & regulatory awareness", "Written reporting"],
  "Education & Learning": ["Instructional design", "Communication & explanation", "Patience & adaptability", "Assessment & feedback", "Classroom/session management", "Continuous subject learning"],
  "Media, Communication, Arts & Design": ["Creative & visual thinking", "Storytelling & writing", "Design/editing tool fluency", "Audience awareness", "Project & deadline management", "Portfolio building"],
  "Manufacturing & Industrial Production": ["Process & quality control", "Technical/mechanical aptitude", "Safety & compliance awareness", "Production planning", "Problem-solving on the line", "Tool & equipment fluency"],
  "Supply Chain, Procurement & Logistics": ["Planning & forecasting", "Vendor/negotiation skills", "Data & inventory analysis", "Process optimisation", "Cross-functional coordination", "ERP/logistics-tool fluency"],
  "Travel, Tourism, Hospitality & Transport": ["Customer service & communication", "Cultural awareness", "Operational coordination", "Problem-solving under pressure", "Attention to detail", "Multitasking in fast-paced settings"],
  "Defence, Security & Emergency Services": ["Discipline & physical fitness", "Situational awareness", "Teamwork under pressure", "Risk assessment", "Protocol & procedure adherence", "Leadership in high-stakes settings"],
  "Personal Care, Beauty & Wellness": ["Technical/hands-on skill", "Client communication & consultation", "Attention to trends & technique", "Hygiene & safety standards", "Patience & attentiveness", "Building repeat clientele"],
};

// Entry/mid/senior salary bands, India - checked against live sources this
// session (Sept 2026), same "verify against a current source" standard as
// careerfit1112.ts's own CLUSTER_SALARY. Ranges reflect real spread across
// sub-roles within a cluster (e.g. IT-services vs product-company entry
// pay), not a single false-precise number.
const CLUSTER_SALARY_GRAD: Record<string, string> = {
  "Engineering, Technology & Computing": "₹3.5–7 LPA entry (IT services) to ₹6–15 LPA (product/startups) · ₹12–25 LPA mid · ₹25 LPA+ senior/specialist",
  "Science, Mathematics & Research": "₹4–8 LPA entry · ₹10–20 LPA mid · ₹25–60 LPA+ (PhD/research-lab senior roles)",
  "Healthcare & Medicine": "₹7–9.6 LPA entry (govt, post-internship) to ₹8–15 LPA (private, Tier-1 cities) · rises sharply with specialisation",
  "Psychology, Humanities & Social Sciences": "₹1.2–3 LPA entry (social work/counselling) · ₹4–8 LPA mid (HR/L&D-adjacent roles pay more)",
  "Sports, Fitness & Human Performance": "₹1.8–3.4 LPA entry · grows with clientele, certifications and brand tier",
  "Agriculture, Food & Life Sciences": "₹2.5–5 LPA entry · ₹6–12 LPA mid (agribusiness/agritech)",
  "Environment, Energy & Sustainability": "₹3.6–5 LPA entry (environmental engineering) · ₹8–15 LPA mid (renewable energy/consulting)",
  "Architecture, Construction & Built Environment": "₹3–5 LPA entry · ₹4–12 LPA mid (established firms) · rises with a strong project portfolio",
  "Business, Finance & Entrepreneurship": "₹3.5–8 LPA entry · ₹12–30 LPA mid · ₹45 LPA+ (CFO/fund management)",
  "Law, Legal & Compliance": "₹3–6 LPA entry (most firms) · ₹15–30 LPA+ at top-tier law firms · rises sharply with reputation and litigation/deal experience",
  "Government, Public Administration & Policy": "₹56,100/month basic pay (Level 10) at entry via UPSC/state services - roughly ₹1–1.5 lakh/month gross with allowances",
  "Education & Learning": "₹2.5–4.5 LPA entry (school/govt) · ₹6–12 LPA mid (EdTech, senior faculty)",
  "Media, Communication, Arts & Design": "₹2.5–4.5 LPA entry (design) to ₹3.5–4 LPA (content/writing) · ₹8–15 LPA mid (agency/high-growth sectors)",
  "Manufacturing & Industrial Production": "₹3–6 LPA entry · ₹8–15 LPA mid (production/process leadership)",
  "Supply Chain, Procurement & Logistics": "₹2–5 LPA entry (₹5–9 LPA with MBA-SCM/engineering background) · ₹8–22 LPA mid (FMCG/product companies)",
  "Travel, Tourism, Hospitality & Transport": "₹2.4–4.2 LPA entry · ₹8–10 LPA for top-brand campus recruits · rises with hotel/airline tier",
  "Defence, Security & Emergency Services": "Roughly ₹12–15 LPA equivalent in-hand at entry officer rank (basic pay + MSP + allowances) - non-officer ranks start lower; pay scales are fixed by rank, not negotiated",
  "Personal Care, Beauty & Wellness": "₹1.5–3.5 LPA entry · ₹5–6 LPA+ senior (established stylists/therapists with a client base)",
};

// "Who actually hires here" per cluster - regular/private employers and
// government bodies, checked against live sources this session where a
// specific search was run; several regular-sector names are the same
// real, already-verified companies careerfit1112.ts's own CLUSTER_COMPANIES
// lists for the equivalent 11-12 cluster (Delhivery/Blue Dart, L&T/Tata
// Motors, Taj/ITC Hotels, etc.) - real companies don't change because the
// class group does.
const CLUSTER_COMPANIES_GRAD: Record<string, { regular: string[]; govt: string[] }> = {
  "Engineering, Technology & Computing": { regular: ["TCS", "Infosys", "Wipro", "L&T", "Tata Motors", "Razorpay"], govt: ["ISRO", "DRDO", "BHEL", "C-DAC"] },
  "Science, Mathematics & Research": { regular: ["Tech company R&D labs (Google, Microsoft, Amazon India)", "Pharma/biotech research divisions"], govt: ["CSIR institutes", "ISRO", "DRDO", "BARC"] },
  "Healthcare & Medicine": { regular: ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Manipal Hospitals"], govt: ["AIIMS", "State government medical colleges/hospitals", "ESIC hospitals"] },
  "Psychology, Humanities & Social Sciences": { regular: ["YourDOST", "iCall (TISS)", "Practo Mental Health", "NGOs and social-sector organisations"], govt: ["NIMHANS", "District Mental Health Programme"] },
  "Sports, Fitness & Human Performance": { regular: ["Cult.fit", "Gold's Gym", "Anytime Fitness", "Sports academies"], govt: ["Sports Authority of India (SAI)"] },
  "Agriculture, Food & Life Sciences": { regular: ["ITC Agri Business Division", "Godrej Agrovet", "DeHaat", "Ninjacart", "Bayer", "Syngenta"], govt: ["ICAR institutes", "State agricultural universities"] },
  "Environment, Energy & Sustainability": { regular: ["Tata Power Solar", "ReNew Power", "Environmental consultancies"], govt: ["Ministry of Environment, Forest & Climate Change", "State Pollution Control Boards"] },
  "Architecture, Construction & Built Environment": { regular: ["Larsen & Toubro (L&T)", "GMR Airports", "Morphogenesis", "Hafeez Contractor", "CP Kukreja Architects"], govt: ["NBCC (India)", "Central Public Works Department (CPWD)"] },
  "Business, Finance & Entrepreneurship": { regular: ["Kotak Mahindra", "HDFC Bank", "ICICI Bank", "McKinsey & Company", "Deloitte", "PwC"], govt: ["State Bank of India (SBI)", "Reserve Bank of India (RBI)"] },
  "Law, Legal & Compliance": { regular: ["Cyril Amarchand Mangaldas", "Khaitan & Co", "AZB & Partners", "Trilegal"], govt: ["State judicial services", "PSU legal departments"] },
  "Government, Public Administration & Policy": { regular: ["Policy think tanks (NITI Aayog-adjacent)", "Consulting firms' government-advisory arms"], govt: ["IAS/IPS/IFS/IRS (via UPSC Civil Services)", "State Civil Services"] },
  "Education & Learning": { regular: ["PhysicsWallah", "upGrad", "Unacademy", "Vedantu"], govt: ["Kendriya Vidyalaya Sangathan", "Navodaya Vidyalaya Samiti"] },
  "Media, Communication, Arts & Design": { regular: ["Ogilvy India", "Dentsu India", "McCann Erickson India", "GroupM Media India"], govt: ["Doordarshan", "All India Radio"] },
  "Manufacturing & Industrial Production": { regular: ["Larsen & Toubro (L&T)", "Tata Motors", "Bajaj Auto", "Mahindra & Mahindra"], govt: ["BHEL", "Hindustan Aeronautics Limited (HAL)", "Bharat Electronics Limited (BEL)"] },
  "Supply Chain, Procurement & Logistics": { regular: ["Delhivery", "Blue Dart Express", "DHL", "FMCG majors (HUL, ITC, Nestlé)"], govt: ["Indian Railways", "Airports Authority of India"] },
  "Travel, Tourism, Hospitality & Transport": { regular: ["Indian Hotels Company / Taj (IHCL)", "ITC Hotels", "Marriott", "The Oberoi Group", "Air India"], govt: ["India Tourism Development Corporation (ITDC)", "State tourism boards"] },
  "Defence, Security & Emergency Services": { regular: [], govt: ["Indian Army", "Indian Navy", "Indian Air Force", "CRPF/BSF/CISF"] },
  "Personal Care, Beauty & Wellness": { regular: ["Lakmé Salon", "Naturals", "VLCC", "Enrich Salon"], govt: [] },
};

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
// Very High / High / Medium / Low instead of a bare percentage - a number
// like "73%" invites false precision nobody's actually entitled to from a
// self-report + RIASEC-style assessment; the qualitative band is what's
// genuinely defensible, and reads faster on a cluster-level card anyway.
// Same 4 tiers/thresholds as careerFit1112Sheets.tsx's own fitLabel() (kept
// as two separate copies, not a shared import, since these are two
// independent class-group files per the project's scope map) - replaces
// this file's old 3-tier scoreComment()/"Top Choice" wording.
function fitLabel(score: number): { label: string; color: string } {
  if (score >= 75) return { label: "Very High", color: "#1f7a55" };
  if (score >= 55) return { label: "High", color: "#2f6bff" };
  if (score >= 35) return { label: "Medium", color: "#a3620b" };
  return { label: "Low", color: "#b3261e" };
}

// Shows the same % as the Fitment/Suitability cards, so the overview never
// disagrees with the pages it summarises.
function OverviewRow({ rank, name, pct, color, roles, note }: { rank: number; name: string; pct: number; color: string; roles: string[]; note?: string }) {
  return (
    <div style={{ minWidth: 0, padding: "13px 16px", borderBottom: "1px solid var(--line-2, var(--line))", background: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color, background: `${color}1c`, width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{name}</span>
          <span style={{ fontSize: 15, fontWeight: 900, color, letterSpacing: "-.01em", flex: "none" }}>{Math.round(pct)}%</span>
        </div>
        {note && <div style={{ fontSize: 10.5, fontWeight: 700, color, marginTop: 2 }}>{note}</div>}
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
  "Feeling overwhelmed by the number of possible paths.": "Your top-ranked cluster below is where to start - you don't need to evaluate all 17 at once.",
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
// Salary strings above follow "entry · mid · senior" (or similar), joined
// by " · " - same split/strip approach as careerFit1112Sheets.tsx's own
// salaryBands(), kept as an independent copy since these are two separate
// class-group files.
function stripTrailingLabel(s: string): string {
  return s.replace(/\s*\bentry\b\s*$/i, "").trim();
}
function salaryBandsGrad(india: string | undefined): { headline: string; rest: string[] } {
  if (!india) return { headline: "-", rest: [] };
  const [entry, ...rest] = india.split(/\s*·\s*/).map((s) => s.trim());
  return { headline: stripTrailingLabel(entry ?? india), rest };
}

function SecLabelGrad({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>{children}</div>;
}

// Analog of ClusterSummaryTable's per-domain card in careerFit1112Sheets.tsx
// - same colored-left-border/numbered-badge/score header, same 3-column
// domcard-grid (Key roles / Skills to acquire / Salary+exam links) reusing
// FullReport.tsx's shared .frx .domcard-grid CSS both files render inside,
// plus a description line and PG entrance-exam links pulled from the same
// real clusterRoadmapsGrad.ts data gradExtraSheets.tsx already uses -
// closing the design gap against 11-12's card, not just visually matching it.
/** Same SVG bar chart as Class 11-12's ClusterBarChart (careerFit1112Sheets.tsx):
 *  one bold coloured bar per cluster on a tinted track, with the % at its end. */
function ClusterBarChartGrad({ rows }: { rows: { cluster: string; score: number }[] }) {
  const shown = rows.filter((r) => r.score > 0);
  if (!shown.length) return null;
  const W = 760, rowH = 45, padL = 350, padR = 56, padT = 6, padB = 6;
  const H = padT + padB + shown.length * rowH;
  const maxScore = Math.max(100, ...shown.map((r) => r.score));
  const barW = (v: number) => ((W - padL - padR) * v) / maxScore;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Career cluster fit, percentage by cluster" style={{ width: "100%", height: "auto", display: "block" }}>
      {shown.map((r, i) => {
        const y = padT + i * rowH;
        const color = clusterColor(r.cluster);
        return (
          <g key={r.cluster}>
            <text x={16} y={y + rowH / 2 + 4} textAnchor="start" fontSize={13} fontWeight={700} fill="var(--ink)">{r.cluster}</text>
            <rect x={padL} y={y + 8} width={W - padL - padR} height={rowH - 16} rx={5} fill={color} opacity={0.14} />
            <rect x={padL} y={y + 8} width={barW(r.score)} height={rowH - 16} rx={5} fill={color} />
            <text x={padL + barW(r.score) + 8} y={y + rowH / 2 + 4} fontSize={13} fontWeight={800} fill="var(--ink)">{Math.round(r.score)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

const RESEARCHED_CAREERS = new Set(CAREERS_1112.map((c) => c.name));

/** The roles to name on a cluster card: well-known, researched careers first
 *  (they also have a full roadmap), then the rest, each group ordered by how
 *  well the role matches the student's interest code - instead of the first
 *  few roles alphabetically. */
export function featuredRoles(cluster: string, riasec: RIASECScore[], n: number, exclude?: Set<string>): string[] {
  // The cluster's representative roles first (closest to the student's
  // interests first), then researched roles, then the rest.
  const key = (CLUSTER_KEY_ROLES[cluster] ?? []).filter((r) => !exclude?.has(r));
  const keySet = new Set(key);
  const roles = (CLUSTER_ROLES[cluster] ?? []).filter((r) => !exclude?.has(r) && !keySet.has(r));
  const researched = roles.filter((r) => RESEARCHED_CAREERS.has(r));
  const rest = roles.filter((r) => !RESEARCHED_CAREERS.has(r));
  return [...rankRolesByRiasec(key, riasec), ...rankRolesByRiasec(researched, riasec), ...rankRolesByRiasec(rest, riasec)].slice(0, n);
}

function ClusterCard({ cluster, score, rank, riasec }: { cluster: string; score: number; rank: number; riasec: RIASECScore[] }) {
  const color = clusterColor(cluster);
  const roles = featuredRoles(cluster, riasec, 4);
  const roadmap = clusterRoadmapGradFor(cluster);
  const emergingCount = roadmap?.emergingAreas.length ?? 0;
  const tier = fitLabel(score);
  const bands = salaryBandsGrad(CLUSTER_SALARY_GRAD[cluster]);
  const exams = roadmap?.pgInIndia.entranceExams ?? [];
  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `4px solid ${color}`, borderRadius: 14, overflow: "hidden", marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: `${color}0a`, borderBottom: "1px solid var(--line)" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 12.5, display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>{cluster}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{CLUSTER_TAGLINE_GRAD[cluster] ?? ""}</div>
          {emergingCount > 0 && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 3 }}>🔥 {emergingCount} new, fast-growing course{emergingCount > 1 ? "s" : ""} in this area</div>}
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: "-.01em" }}>{Math.round(score)}%</div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>Fit</div>
        </div>
      </div>
      <div className="domcard-grid">
        <div className="domcard-sec">
          <SecLabelGrad>Key roles</SecLabelGrad>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
            {roles.map((r) => <span key={r} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{r}</span>)}
          </div>
        </div>
        <div className="domcard-sec">
          <SecLabelGrad>Skills to acquire</SecLabelGrad>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {(CLUSTER_CORE_SKILLS_GRAD[cluster] ?? []).map((s) => (
              <span key={s} style={{ fontSize: 10.5, background: "var(--line-2, #f2f2f4)", color: "var(--ink-2)", fontWeight: 600, borderRadius: 6, padding: "3px 8px", lineHeight: 1.35 }}>{s}</span>
            ))}
          </div>
        </div>
        <div className="domcard-sec">
          <SecLabelGrad>Salary (India)</SecLabelGrad>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)", marginTop: 8, lineHeight: 1.4 }}>{bands.headline}</div>
          {bands.rest.map((r, i) => <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", marginTop: 4 }}>{r}</div>)}
          {exams.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <SecLabelGrad>PG entrance exams</SecLabelGrad>
              {exams.slice(0, 2).map((e, i) => <span key={i} style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{e}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Keyword -> RIASEC heuristic for ranking which of a cluster's ~3,300 roles
// to surface for a given student. The source Excel has zero psychometric
// columns (confirmed when this cluster data was first built - no per-role
// RIASEC/Strengths/MI signature exists the way each of Class 11-12's 360
// careers has), so a real per-role signature would mean tagging every role
// individually - a large one-time authoring pass, not done here. This is
// the fast, lower-fidelity alternative: match common words in the role
// TITLE itself against each RIASEC code's typical vocabulary, and rank by
// the student's own percentile in whichever code(s) matched. A role that
// matches nothing still shows (never silently dropped) - it just sorts
// after every role that did match, in its original data order.
const ROLE_RIASEC_KEYWORDS: Record<string, string[]> = {
  R: ["engineer", "technician", "mechanic", "electrician", "operator", "pilot", "driver", "fitter", "machinist", "fabrication", "welding", "maintenance", "installation", "surveyor", "field officer", "plant", "equipment", "construction", "mason", "farmer", "forester"],
  I: ["scientist", "researcher", "research", "analyst", "analytics", "statistician", "data scientist", "lab technologist", "laboratory", "diagnostic", "epidemiolog", "biostatistic", "investigator", "r&d"],
  A: ["designer", "design", "artist", "writer", "editor", "creative", "content", "architect", "photographer", "animator", "illustrator", "musician", "composer", "stylist", "choreographer", "curator", "filmmaker"],
  S: ["teacher", "trainer", "counsellor", "counselor", "therapist", "nurse", "social worker", "coach", "educator", "instructor", "caregiver", "psychologist", "human resources", "hr executive", "community", "welfare officer", "mentor"],
  E: ["manager", "executive", "director", "entrepreneur", "founder", "sales", "marketing", "business development", "consultant", "strategist", "lead", "head of", "relationship manager", "brand", "growth"],
  C: ["accountant", "auditor", "clerk", "administrator", "compliance", "coordinator", "records officer", "bookkeeper", "actuary", "underwriter", "data entry", "finance officer", "payroll", "registrar", "quality control"],
};
function matchedRiasecCodes(roleTitle: string): string[] {
  const lower = roleTitle.toLowerCase();
  return Object.keys(ROLE_RIASEC_KEYWORDS).filter((code) => ROLE_RIASEC_KEYWORDS[code].some((kw) => lower.includes(kw)));
}
/** Ranks `roles` by proximity to the student's own RIASEC profile - the
 *  best (highest-percentile) matched code wins when a title matches more
 *  than one, so a dual-fit role like "Design Engineer" isn't penalised for
 *  matching two codes instead of one. Stable sort: unmatched/tied roles
 *  keep their original relative order rather than being shuffled. */
function rankRolesByRiasec(roles: string[], riasec: RIASECScore[]): string[] {
  const pct = Object.fromEntries(riasec.map((r) => [r.code, r.percentile]));
  const affinity = (role: string) => {
    const codes = matchedRiasecCodes(role);
    return codes.length ? Math.max(...codes.map((c) => pct[c] ?? 0)) : -1;
  };
  return roles
    .map((role, i) => ({ role, i, a: affinity(role) }))
    .sort((x, y) => y.a - x.a || x.i - y.i)
    .map((x) => x.role);
}

// Suitability-page version of ClusterCard, with the same real additions
// (description, salary, exam links) plus two things specific to
// Suitability: "top companies that hire" (CLUSTER_COMPANIES_GRAD, same
// pattern as 11-12's showCompanies) and an explanation of why this cluster
// ranks here - honest about the one real limitation versus 11-12: this
// score is cluster-level (RIASEC+Strengths+MI blended), not the per-role
// Psy.Analysis/Skill breakdown 11-12 can show because it has an individual
// signature for each of its 360 careers - Graduates doesn't have that yet
// (see scoringGrad.ts's CLUSTER_SIGNATURE comment). The roles below ARE now
// personalised on a second axis within that constraint: ranked by a
// keyword-matched RIASEC proximity to the student's own profile (see
// rankRolesByRiasec above) on top of whether a role comes from the
// student's own actual degree+course.
function SuitabilityDomainBlock({ cluster, score, rank, degree, course, riasec }: { cluster: string; score: number; rank: number; degree: string; course: string; riasec: RIASECScore[] }) {
  const color = clusterColor(cluster);
  const isOwnCluster = !!degree && !!course && clusterForDegreeCourse(degree, course) === cluster;
  // Still scoped to the student's exact degree+course (the stream match) -
  // only the ORDER within that fixed set is RIASEC-ranked, never which
  // roles are eligible to appear.
  const ownRoles = isOwnCluster ? rankRolesByRiasec(rolesForDegreeCourse(degree, course), riasec) : [];
  const ownRolesSet = new Set(ownRoles);
  const generalRoles = featuredRoles(cluster, riasec, 8, ownRolesSet);
  const tier = fitLabel(score);
  const roadmap = clusterRoadmapGradFor(cluster);
  const emergingCount = roadmap?.emergingAreas.length ?? 0;
  const bands = salaryBandsGrad(CLUSTER_SALARY_GRAD[cluster]);
  const exams = roadmap?.pgInIndia.entranceExams ?? [];
  const companies = CLUSTER_COMPANIES_GRAD[cluster];

  return (
    <div style={{ border: "1px solid var(--line)", borderLeft: `4px solid ${color}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", background: `${color}0a`, borderBottom: "1px solid var(--line)" }}>
        <span style={{ width: 26, height: 26, borderRadius: "50%", background: color, color: "#fff", fontWeight: 800, fontSize: 12.5, display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: 800, color: "var(--ink)", fontSize: 14.5 }}>{cluster}</div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{CLUSTER_TAGLINE_GRAD[cluster] ?? ""}</div>
          {isOwnCluster && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 3 }}>Matches your actual degree &amp; course</div>}
          {!isOwnCluster && emergingCount > 0 && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 3 }}>🔥 {emergingCount} new, fast-growing course{emergingCount > 1 ? "s" : ""}</div>}
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div style={{ fontSize: 19, fontWeight: 900, color, letterSpacing: "-.01em" }}>{Math.round(score)}%</div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>Fit</div>
        </div>
      </div>

      {/* Same layout as Class 11-12's Suitability card: header, then the
          3-column grid - no extra explanatory paragraph. */}

      <div className="domcard-grid">
        <div className="domcard-sec">
          {ownRoles.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <SecLabelGrad>Roles your {course || "course"} leads to</SecLabelGrad>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
                {ownRoles.slice(0, 5).map((r) => <span key={r} style={{ fontSize: 12.5, fontWeight: 700, color }}>{r}</span>)}
              </div>
            </div>
          )}
          <SecLabelGrad>{ownRoles.length > 0 ? "Other roles in this cluster" : "Key roles"}</SecLabelGrad>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginTop: 8 }}>
            {generalRoles.slice(0, 4).map((r) => <span key={r} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{r}</span>)}
          </div>
        </div>
        <div className="domcard-sec">
          <SecLabelGrad>Skills to acquire</SecLabelGrad>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
            {(CLUSTER_CORE_SKILLS_GRAD[cluster] ?? []).map((s) => (
              <span key={s} style={{ fontSize: 10.5, background: "var(--line-2, #f2f2f4)", color: "var(--ink-2)", fontWeight: 600, borderRadius: 6, padding: "3px 8px", lineHeight: 1.35 }}>{s}</span>
            ))}
          </div>
        </div>
        <div className="domcard-sec">
          <SecLabelGrad>Salary (India)</SecLabelGrad>
          <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)", marginTop: 8, lineHeight: 1.4 }}>{bands.headline}</div>
          {bands.rest.map((r, i) => <div key={i} style={{ fontSize: 11, fontWeight: 700, color: "var(--ink-2)", marginTop: 4 }}>{r}</div>)}
          {exams.length > 0 && (
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4 }}>
              <SecLabelGrad>PG entrance exams</SecLabelGrad>
              {exams.slice(0, 2).map((e, i) => <span key={i} style={{ fontSize: 11, fontWeight: 700, color, marginTop: 4 }}>{e}</span>)}
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: "12px 18px", borderTop: "1px solid var(--line-2, var(--line))" }}>
        <SecLabelGrad>Top companies that hire</SecLabelGrad>
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
    </div>
  );
}

// The 7-step numbered, colour-per-step container - same visual structure
// (numbered badge, icon, pastel gradient header card, eyebrow chip) as
// careerFit1112Sheets.tsx's RoadmapSectionFrame/ROADMAP_SECTION_META, kept
// as an independent local copy rather than a shared import (11-12 and UG
// are separate class-group files per the project's scope map). Content
// stays exactly the 7 real sections GradClusterRoadmap already has - only
// the visual design changes here, not what's shown.
const GRAD_ROADMAP_SECTION_META: { icon: string; label: string; eyebrow: string; accent: string; pastel: string }[] = [
  { icon: "route", label: "Each year of your degree", eyebrow: "01 · What each year should build", accent: "#c46a52", pastel: "#fff1ed" },
  { icon: "briefcase", label: "Real-world experience", eyebrow: "02 · Internships", accent: "#477d9b", pastel: "#edf7fb" },
  { icon: "check", label: "Skills & certificates", eyebrow: "03 · Certifications in demand", accent: "#a47737", pastel: "#fff8ea" },
  { icon: "match", label: "Jobs you can get", eyebrow: "04 · Careers you can be hired as", accent: "#4c8b65", pastel: "#eef9f0" },
  { icon: "star", label: "Master's in India", eyebrow: "05 · PG to consider - in India", accent: "#6a72b8", pastel: "#f0f2ff" },
  { icon: "compass", label: "Studying abroad", eyebrow: "06 · Study abroad", accent: "#4f78a6", pastel: "#eef5ff" },
  { icon: "score", label: "Long-term growth", eyebrow: "07 · Going forward - career advancement", accent: "#c05f59", pastel: "#fff0ef" },
];
function GradRoadmapSectionFrame({ index, title, sub, children }: { index: number; title: string; sub?: string; children: React.ReactNode }) {
  const meta = GRAD_ROADMAP_SECTION_META[index - 1];
  return (
    <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${meta.accent}35` }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderRadius: 13, background: `linear-gradient(110deg, ${meta.pastel}, #fff)`, border: `1px solid ${meta.accent}35`, boxShadow: `0 3px 10px ${meta.accent}12` }}>
        <div style={{ position: "relative", flex: "none" }}>
          <span style={{ width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center", background: meta.accent, color: "#fff", boxShadow: `0 5px 11px ${meta.accent}35` }}>
            <Icon name={meta.icon} size={19} />
          </span>
          <span style={{ position: "absolute", right: -7, bottom: -7, width: 22, height: 22, borderRadius: "50%", display: "grid", placeItems: "center", background: "#fff", border: `2px solid ${meta.accent}`, color: meta.accent, fontSize: 9, fontWeight: 900 }}>{String(index).padStart(2, "0")}</span>
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", color: meta.accent }}>{meta.label}</div>
          <h2 style={{ margin: "3px 0 0", fontSize: 18.5, lineHeight: 1.2, letterSpacing: "-.02em", color: "var(--ink)" }}>{title}</h2>
          {sub ? <p style={{ margin: "6px 0 0", fontSize: 12, lineHeight: 1.5, color: "var(--ink-2)" }}>{sub}</p> : null}
        </div>
      </div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

// Every section's own accent, by 1-based index - the single source of truth
// both the header (GradRoadmapSectionFrame, above) and every content
// element within that section pull from, so a section's icon/badge and the
// cards/chips underneath it are always the SAME colour, never a header in
// one hue with mismatched content below it.
function sectionAccent(index: number): string {
  return GRAD_ROADMAP_SECTION_META[index - 1]?.accent ?? "#4c8b65";
}

// A compact "map" of the 7-step journey shown once, before section 1 - the
// same "see the whole route before you start reading it" job 11-12's own
// illustrated roadmap image does, built from the same icons/colours/labels
// GradRoadmapSectionFrame already uses per section rather than a separate
// static asset.
function RoadmapJourneyStrip() {
  return (
    <div style={{ marginTop: 4, marginBottom: 22, padding: "18px 16px", borderRadius: 18, background: "linear-gradient(135deg, #fafbfd, #fff)", border: "1px solid #e4e8ee", boxShadow: "0 8px 22px rgba(36,52,74,.06)" }}>
      <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 14, textAlign: "center" }}>Your roadmap, at a glance</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: 8 }}>
        {GRAD_ROADMAP_SECTION_META.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "8px 4px", borderRadius: 12, background: `${m.accent}08` }}>
            <div style={{ position: "relative" }}>
              <span style={{ width: 36, height: 36, borderRadius: 11, display: "grid", placeItems: "center", background: m.accent, color: "#fff", boxShadow: `0 4px 10px ${m.accent}40` }}>
                <Icon name={m.icon} size={16} />
              </span>
              <span style={{ position: "absolute", right: -5, bottom: -5, width: 16, height: 16, borderRadius: "50%", display: "grid", placeItems: "center", background: "#fff", border: `1.5px solid ${m.accent}`, color: m.accent, fontSize: 7.5, fontWeight: 900 }}>{i + 1}</span>
            </div>
            <div style={{ fontSize: 9.5, fontWeight: 800, textAlign: "center", color: "var(--ink)", lineHeight: 1.25 }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// A plain string list rendered as small numbered cards (alternating tint)
// instead of a bare bullet list - same treatment as careerFit1112Sheets.tsx's
// own DetailList, for checklist-style content (e.g. "before choosing a PG
// route") that otherwise reads as a wall of bullet text.
// Lines in the researched roadmaps mix sub-headings ("Project ideas",
// "Relevant universities", "Typical pathway:") with the items under them.
// Numbering every line made headings read as items ("01 Project ideas,
// 02 Customer churn..."), so headings are shown as headings and items get
// plain bullets.
const ROADMAP_HEADINGS = new Set([
  "common requirements", "project ideas", "tools / technologies", "tools", "technical skills", "technical",
  "relevant pg programs", "relevant pg", "relevant universities", "universities", "relevant indian institutions",
  "government / research", "government / public", "private", "typical pathway", "useful certifications",
  "useful certifications / training", "useful training", "roles", "job titles", "specializations", "specialisations",
  "ideal areas", "research route", "countries", "top countries", "pathways after ug", "common", "alternative", "specialized",
]);
function isRoadmapHeading(line: string): boolean {
  const s = line.trim().replace(/:$/, "").toLowerCase();
  return ROADMAP_HEADINGS.has(s) || (/:$/.test(line.trim()) && s.split(/\s+/).length <= 4);
}
function RoadmapLine({ text }: { text: string }) {
  // "Government / Research: ISRO, DRDO..." -> bold the short label before the colon.
  const m = text.match(/^([^:]{2,40}):\s+(.+)$/);
  if (m && m[1].split(/\s+/).length <= 5) return <><b style={{ color: "var(--ink)" }}>{m[1]}:</b> {m[2]}</>;
  return <>{text}</>;
}
/** Chips grouped under their own headings ("Technical skills", "Tools",
 *  "Industries: a • b • c"), with long sentences shown as a note instead of
 *  being squeezed into a chip - so one long run-on list reads as sections. */
function ChipGroups({ items, color }: { items: string[]; color: string }) {
  const groups: { title: string | null; chips: string[]; notes: string[] }[] = [{ title: null, chips: [], notes: [] }];
  const current = () => groups[groups.length - 1];
  for (const raw of items) {
    const line = raw.trim();
    if (!line) continue;
    const labelled = line.match(/^([^:]{2,40}):\s+(.+)$/);
    if (isRoadmapHeading(line) || /^\d+ relevant /i.test(line)) {
      groups.push({ title: line.replace(/:$/, ""), chips: [], notes: [] });
    } else if (labelled && labelled[1].split(/\s+/).length <= 5 && labelled[2].includes("•")) {
      groups.push({ title: labelled[1], chips: labelled[2].split(/\s*•\s*/).map((s) => s.replace(/\.$/, "")).filter(Boolean), notes: [] });
      groups.push({ title: null, chips: [], notes: [] });
    } else if (line.includes("•")) {
      // "Machine Learning • Deep Learning • NLP ..." - a list, not a sentence.
      current().chips.push(...line.split(/\s*•\s*/).map((s) => s.replace(/\.$/, "")).filter(Boolean));
    } else if (line.split(/\s+/).length > 12) {
      current().notes.push(line);
    } else {
      current().chips.push(line);
    }
  }
  const chip: React.CSSProperties = {
    display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)",
    background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 8, padding: "5px 10px", margin: "0 6px 6px 0",
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {groups.filter((g) => g.chips.length || g.notes.length).map((g, i) => (
        <div key={i}>
          {g.title && <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{g.title}</div>}
          {g.chips.length > 0 && <div>{g.chips.map((c, j) => <span key={j} style={chip}>{c}</span>)}</div>}
          {g.notes.map((n, j) => <p key={j} style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, margin: "4px 0 0" }}>{n}</p>)}
        </div>
      ))}
    </div>
  );
}

function GradDetailList({ lines, color, defaultTitle }: { lines: string[]; color: string; defaultTitle?: string }) {
  const groups: { title: string | null; items: string[] }[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (isRoadmapHeading(line)) groups.push({ title: line.replace(/:$/, ""), items: [] });
    else {
      if (!groups.length) groups.push({ title: defaultTitle ?? null, items: [] });
      groups[groups.length - 1].items.push(line);
    }
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {groups.filter((g) => g.items.length || g.title).map((g, gi) => (
        <div key={gi}>
          {g.title && <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".04em" }}>{g.title}</div>}
          {g.items.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 5 }}>
              {g.items.map((l, i) => (
                <li key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}><RoadmapLine text={l} /></li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

// A dot-and-connecting-line ladder for progression content (e.g. "going
// forward - career advancement") - the same visual language as
// careerFit1112Sheets.tsx's VerticalStepChain, for a real A→B→C→D climb
// rather than a bare bullet list burying the sense of forward motion.
function GradStepChain({ steps, color }: { steps: string[]; color: string }) {
  return (
    <div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: color, flex: "none", marginTop: 4 }} />
            {i < steps.length - 1 && <div style={{ width: 2, flex: 1, background: `linear-gradient(${color}60, ${color}18)`, minHeight: 18 }} />}
          </div>
          <div style={{ fontSize: 12.5, fontWeight: i === steps.length - 1 ? 800 : 600, color: i === steps.length - 1 ? color : "var(--ink)", paddingBottom: i < steps.length - 1 ? 10 : 0 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

/** The per-year skill grid shared by ClusterRoadmapView (cluster-level
 *  GradYearFocus, often with technicalSkills/nonTechnicalSkills) and
 *  DetailedCareerRoadmapViewGrad (Tier 1's real per-career
 *  DetailedCareerRoadmap.ugDevelopment.years, which only ever has
 *  year/focus - the optional skill arrays simply don't render for it). */
function GradYearFocusGrid({ years, color }: { years: { year: string; focus: string; technicalSkills?: string[]; nonTechnicalSkills?: string[] }[]; color: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {years.map((y) => (
        <div key={y.year} style={{ padding: "10px 12px", border: `1px solid ${color}25`, borderRadius: 10, background: `${color}06` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 4 }}>{y.year}</div>
          <div style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: y.technicalSkills ? 8 : 0 }}>{y.focus}</div>
          {y.technicalSkills && y.technicalSkills.length > 0 && (
            <div style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 3 }}>Technical</div>
              <ul style={{ margin: 0, paddingLeft: 14 }}>{y.technicalSkills.map((s) => <li key={s} style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>{s}</li>)}</ul>
            </div>
          )}
          {y.nonTechnicalSkills && y.nonTechnicalSkills.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 3 }}>Non-technical</div>
              <ul style={{ margin: 0, paddingLeft: 14 }}>{y.nonTechnicalSkills.map((s) => <li key={s} style={{ fontSize: 11, color: "var(--ink-2)", lineHeight: 1.5 }}>{s}</li>)}</ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Pins the student's exact typed desiredCareer at the top of a Tier-2
 *  (cluster-fallback) roadmap's "careers you can be hired as" section, and
 *  says plainly that the rest of the roadmap covers the whole field - the
 *  honest answer for the ~3,086 roles with no per-role research (see this
 *  file's header comment, Tier 2). */
function PinnedRoleCallout({ role, color }: { role: string; color: string }) {
  return (
    <div style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${color}45`, background: `${color}0a` }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: ".07em", textTransform: "uppercase", color, padding: "3px 8px", borderRadius: 999, background: `${color}18`, border: `1px solid ${color}40` }}>Your selected career</span>
        <span style={{ fontSize: 14.5, fontWeight: 900, color: "var(--ink)" }}>{role}</span>
      </div>
      <p style={{ fontSize: 11.5, color: "var(--ink-2)", margin: "8px 0 0" }}>The steps on this page cover the whole field this career belongs to.</p>
    </div>
  );
}

function ClusterRoadmapView({ r, strengthDomains, selectedRole }: { r: GradClusterRoadmap; strengthDomains: GraduateScoreOutput["layer1"]["strengthDomains"]; selectedRole?: string }) {
  const chip = (color: string): React.CSSProperties => ({
    display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)",
    background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 8, padding: "5px 10px", margin: "0 6px 6px 0",
  });
  return (
    <div>
      <RoadmapJourneyStrip />

      <GradRoadmapSectionFrame index={1} title="What to build each year">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 10 }}><b>Technical:</b> {r.yearlySkillBuilding.technical}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 10 }}><b>Non-technical:</b> {r.yearlySkillBuilding.nonTechnical}</p>
        <GradYearFocusGrid years={r.yearlySkillBuilding.years} color={sectionAccent(1)} />
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={2} title="Internships">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 6 }}><b>Government:</b> {r.internships.government}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}><b>Private:</b> {r.internships.private}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={3} title="Certifications in demand">
        {Array.isArray(r.certifications) ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {r.certifications.map((c) => (
              <span key={c.name} style={{ ...chip(sectionAccent(3)), display: "inline-flex", alignItems: "center", gap: 6 }}>
                {c.name}
                <b style={{
                  fontSize: 9.5, fontWeight: 800, padding: "2px 6px", borderRadius: 999, letterSpacing: ".02em",
                  color: c.cost === "Free" ? "#166534" : c.cost === "Paid" ? "#92400e" : "#1e40af",
                  background: c.cost === "Free" ? "#dcfce7" : c.cost === "Paid" ? "#fef3c7" : "#dbeafe",
                }}>{c.cost}</b>
              </span>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.certifications}</p>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={4} title="Jobs you can be hired for">
        {selectedRole && <PinnedRoleCallout role={selectedRole} color={sectionAccent(4)} />}
        <div>{r.jobRoles.filter((role) => role !== selectedRole).map((role) => <span key={role} style={chip(sectionAccent(4))}>{role}</span>)}</div>
        {r.emergingAreas.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(4), marginBottom: 6 }}>Emerging areas to watch</div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 10 }}>Specific courses flagged as emerging (2023-26) in current course data, with the real roles they lead to.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {r.emergingAreas.map((e) => (
                <div key={e.course} style={{ padding: "10px 12px", border: `1px solid ${sectionAccent(4)}25`, borderRadius: 10, background: `${sectionAccent(4)}06` }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: sectionAccent(4), marginBottom: 4 }}>{e.course}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)" }}>{e.roles.join(" · ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={5} title="Master's (PG) options in India">
        {r.pgInIndia.note ? (
          <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.pgInIndia.note}</p>
        ) : (
          <>
            <div style={{ marginBottom: 8 }}>{r.pgInIndia.programmes.map((p) => <span key={p} style={chip(sectionAccent(5))}>{p}</span>)}</div>
            {r.pgInIndia.entranceExams.length > 0 && (
              <p style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 10 }}><b>Entrance routes:</b> {r.pgInIndia.entranceExams.join(" · ")}</p>
            )}
            {r.pgInIndia.topInstitutions && r.pgInIndia.topInstitutions.length > 0 && (
              <p style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 10 }}><b>Institution types:</b> {r.pgInIndia.topInstitutions.join(" · ")}</p>
            )}
            {r.pgInIndia.scholarships && r.pgInIndia.scholarships.length > 0 && (
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(5), marginBottom: 6 }}>Scholarships to look into</div>
                <ul style={{ margin: 0, paddingLeft: 16 }}>{r.pgInIndia.scholarships.map((s) => <li key={s} style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{s}</li>)}</ul>
              </div>
            )}
          </>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={6} title="Study abroad">
        {Array.isArray(r.studyAbroad) ? (
          r.studyAbroad.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {r.studyAbroad.map((d) => (
                <div key={d.country} style={{ padding: "10px 12px", border: `1px solid ${sectionAccent(6)}25`, borderRadius: 10, background: `${sectionAccent(6)}06` }}>
                  <div style={{ fontSize: 12.5, fontWeight: 800, color: sectionAccent(6), marginBottom: 4 }}>{d.country}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginBottom: 6 }}>{d.universityType}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}><b>Scholarship:</b> {d.scholarship}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.studyAbroadNote ?? "No common study-abroad route for this cluster."}</p>
          )
        ) : (
          <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.studyAbroad}</p>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={7} title="How your career can grow">
        {r.careerAdvancement.note && <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 8 }}>{r.careerAdvancement.note}</p>}
        {r.careerAdvancement.phdProgrammes.length > 0 && (
          <div style={{ marginBottom: 8 }}>{r.careerAdvancement.phdProgrammes.map((p) => <span key={p} style={chip(sectionAccent(7))}>{p}</span>)}</div>
        )}
        {r.careerAdvancement.phdRoles.length > 0 && (
          <p style={{ fontSize: 12, color: "var(--ink-2)" }}><b>Roles this can lead to:</b> {r.careerAdvancement.phdRoles.slice(0, 8).join(" · ")}</p>
        )}
      </GradRoadmapSectionFrame>
    </div>
  );
}

// The genuinely deep, independently-researched treatment for a cluster
// that has one (see flagshipRoadmapsGrad.ts, 17 of 18 clusters) - shown
// INSTEAD of ClusterRoadmapView's generic synthesized content when
// available. Reuses the exact same 7-step numbered/coloured container
// (GradRoadmapSectionFrame/GRAD_ROADMAP_SECTION_META) - the difference is
// depth of content within each step (real internship targets, named
// certifications, a PG decision checklist, country-by-country abroad
// guidance), not a different visual design.
function FlagshipRoadmapViewGrad({ r, selectedRole }: { r: FlagshipDomainRoadmapGrad; selectedRole?: string }) {
  const chip = (color: string): React.CSSProperties => ({
    display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)",
    background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 8, padding: "5px 10px", margin: "0 6px 6px 0",
  });
  const note: React.CSSProperties = { fontSize: 11.5, color: "var(--muted)", fontStyle: "italic", marginTop: 10, lineHeight: 1.5 };
  const intro = "#5a6b8c";
  return (
    <div>
      <RoadmapJourneyStrip />

      {r.careerFamilies.length > 0 && (
        <div style={{ marginBottom: 22, padding: "14px 16px", border: `1px solid ${intro}28`, borderRadius: 14, background: `linear-gradient(110deg, ${intro}0a, #fff)` }}>
          <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".07em", textTransform: "uppercase", color: intro, marginBottom: 8 }}>This cluster&apos;s career families</div>
          <div>{r.careerFamilies.map((f) => <span key={f} style={chip(intro)}>{f}</span>)}</div>
          <p style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 10, lineHeight: 1.5 }}>{r.howToUseNote}</p>
        </div>
      )}

      <GradRoadmapSectionFrame index={1} title="What to build each year">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {r.yearPlan.map((y) => (
            <div key={y.stage} style={{ padding: "10px 12px", border: `1px solid ${sectionAccent(1)}25`, borderRadius: 10, background: `${sectionAccent(1)}06` }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: sectionAccent(1), marginBottom: 5 }}>{y.stage}</div>
              <p style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 4 }}><b>Technical:</b> {y.technical}</p>
              <p style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 4 }}><b>Non-technical:</b> {y.nonTechnical}</p>
              <p style={{ fontSize: 12, color: "var(--ink-2)" }}><b>Evidence to build:</b> {y.evidence}</p>
            </div>
          ))}
        </div>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={2} title="Internships & real-world exposure">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {r.internshipTracks.map((t) => (
            <div key={t.track} style={{ padding: "10px 12px", border: `1px solid ${sectionAccent(2)}25`, borderRadius: 10, background: `${sectionAccent(2)}06` }}>
              <div style={{ fontSize: 11.5, fontWeight: 800, color: sectionAccent(2), marginBottom: 5 }}>{t.track}</div>
              <p style={{ fontSize: 12, color: "var(--ink-2)", marginBottom: 4 }}>{t.targets}</p>
              <p style={{ fontSize: 11.5, color: "var(--muted)" }}><b>Before applying:</b> {t.prepare}</p>
            </div>
          ))}
        </div>
        <p style={note}>{r.internshipQualityNote}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={3} title="Certifications in demand">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {r.certifications.map((c) => (
            <div key={c.name} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "8px 12px", border: `1px solid ${sectionAccent(3)}25`, borderRadius: 9, background: `${sectionAccent(3)}06` }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink)" }}>{c.name}</span>
              <span style={{ fontSize: 11.5, color: "var(--ink-2)", flex: "none" }}>{c.bestFor}</span>
            </div>
          ))}
        </div>
        <p style={note}>{r.certificationNote}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={4} title="Jobs you can be hired for">
        {selectedRole && <PinnedRoleCallout role={selectedRole} color={sectionAccent(4)} />}
        <div>{r.careersHiredAs.filter((role) => role !== selectedRole).map((role) => <span key={role} style={chip(sectionAccent(4))}>{role}</span>)}</div>
        <p style={note}>{r.jobSearchNote}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={5} title="Master's (PG) options in India">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 12 }}>{r.pgIndia}</p>
        <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(5), marginBottom: 8 }}>Before choosing a PG route</div>
        <GradDetailList lines={r.pgIndiaChecklist} color={sectionAccent(5)} />
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={6} title="Study abroad - country-wise">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {r.abroadCountries.map((a) => (
            <div key={a.country + a.detail} style={{ padding: "10px 12px", border: `1px solid ${sectionAccent(6)}25`, borderRadius: 10, background: `${sectionAccent(6)}06` }}>
              {a.country && <div style={{ fontSize: 11.5, fontWeight: 800, color: sectionAccent(6), marginBottom: 4 }}>{a.country}</div>}
              <div style={{ fontSize: 12, color: "var(--ink-2)" }}>{a.detail}</div>
            </div>
          ))}
        </div>
        <p style={note}>{r.abroadApplicationNote}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={7} title="How your career can grow (including PhD)">
        <GradStepChain steps={r.careerAdvancement} color={sectionAccent(7)} />
        <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(7), margin: "16px 0 8px" }}>Career evidence to keep from UG</div>
        <div>{r.careerEvidence.map((e) => <span key={e} style={chip(sectionAccent(7))}>{e}</span>)}</div>
        <p style={note}>{r.domainCaution}</p>
      </GradRoadmapSectionFrame>
    </div>
  );
}

/** Tier 1 - the real, individually-researched roadmap for one of Class
 *  11-12's 360 CAREERS_1112 entries (read-only reuse per CLAUDE.md), shown
 *  when the student's typed desiredCareer resolves to one via findCareer1112.
 *  Remaps DetailedCareerRoadmap's 16 fields into this file's 7-section
 *  shape - `school`/`ugPathways`/`topColleges` are deliberately NOT used
 *  here (they're about choosing a UG stream/degree, moot for a student
 *  already enrolled in one); everything else genuinely describes "from UG
 *  onward" and is reused as-is, zero new content authored. `skills` mixes
 *  technical skills, tools and certifications as one real researched list
 *  with no clean separate "certifications" field (verified: a header-word
 *  heuristic split misclassifies real skill names at similar frequency to
 *  actual section headers) - shown in full as one combined block rather
 *  than faking a split the source data doesn't reliably support. */
function DetailedCareerRoadmapViewGrad({ r, careerName, color }: { r: DetailedCareerRoadmap; careerName: string; color: string; strengthDomains?: GraduateScoreOutput["layer1"]["strengthDomains"] }) {
  return (
    <div>
      <RoadmapJourneyStrip />

      <div style={{ marginBottom: 22, padding: "14px 16px", border: `1px solid ${color}28`, borderRadius: 14, background: `linear-gradient(110deg, ${color}0a, #fff)` }}>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".07em", textTransform: "uppercase", color, marginBottom: 8 }}>Built specifically for {careerName}</div>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: 0, lineHeight: 1.6 }}>{r.tagline ?? `Real, individually-researched content for ${careerName} - not a generic cluster roadmap.`}</p>
        {r.keyDistinction && <p style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 10, lineHeight: 1.6 }}><b>Worth knowing:</b> {r.keyDistinction}</p>}
      </div>

      <GradRoadmapSectionFrame index={1} title="What to build each year">
        <GradYearFocusGrid years={r.ugDevelopment.years} color={sectionAccent(1)} />
        {r.ugDevelopment.notes.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <GradDetailList lines={r.ugDevelopment.notes} color={sectionAccent(1)} defaultTitle="Project ideas" />
          </div>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={2} title="Internships">
        <GradDetailList lines={r.internships} color={sectionAccent(2)} />
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={3} title="Skills, tools & certifications" sub="What employers look for in this career.">
        <ChipGroups items={r.skills} color={sectionAccent(3)} />
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={4} title="Jobs you can be hired for">
        <ChipGroups items={r.jobOptions} color={sectionAccent(4)} />
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={5} title="Master's (PG) options in India">
        {r.afterUgPathways.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(5), marginBottom: 6 }}>Pathways after UG</div>
            <GradDetailList lines={r.afterUgPathways} color={sectionAccent(5)} />
          </div>
        )}
        {r.pgSpecialization.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(5), marginBottom: 6 }}>Master&apos;s programmes &amp; where to study</div>
            <ChipGroups items={r.pgSpecialization} color={sectionAccent(5)} />
          </div>
        )}
        {r.scholarships.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(5), marginBottom: 6 }}>Scholarships & sponsorships</div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>{r.scholarships.map((s, i) => <li key={i} style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.6 }}>{s}</li>)}</ul>
          </div>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={6} title="Study abroad">
        {r.abroadEducation.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(6), marginBottom: 6 }}>Education</div>
            <GradDetailList lines={r.abroadEducation} color={sectionAccent(6)} />
          </div>
        )}
        {r.abroadJobs.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(6), marginBottom: 6 }}>Jobs abroad</div>
            <GradDetailList lines={r.abroadJobs} color={sectionAccent(6)} />
          </div>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={7} title="How your career can grow">
        <GradStepChain steps={r.careerProgression} color={sectionAccent(7)} />
        {r.completeRoadmap.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: sectionAccent(7), marginBottom: 8 }}>The complete roadmap, start to finish</div>
            <GradStepChain steps={r.completeRoadmap} color={sectionAccent(7)} />
          </div>
        )}
        {r.disclaimer && <p style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic", marginTop: 14 }}>{r.disclaimer}</p>}
      </GradRoadmapSectionFrame>
    </div>
  );
}

/** One real, numbered skill-gap reading - never shown unless it's backed by
 *  an actual scored instrument (see realSkillGaugesForLayer). `source` is
 *  always rendered alongside the number so nobody mistakes this for a
 *  literal skill test. */
interface HorizonSkillGauge { label: string; level1to5: number; source: string }

/** Converts a 0-100 (or 0-1, via `max`) measured score to a 1-5 display
 *  level - never fabricated, only ever called on a value that came from a
 *  real scored instrument (strength domain, MI domain, EI sub-score, or the
 *  student's own computed cluster-suitability score). */
function toFive(value: number, max: number): number {
  return Math.max(1, Math.min(5, Math.round((value / max) * 5)));
}

/** Where each measured skill level comes from, in plain words - shown
 *  instead of the stored internal source names ("Communication scenarios",
 *  "Strategic & Futuristic"), so older saved reports read the same way. */
const SKILL_SOURCE_PLAIN: Record<string, string> = {
  leadership: "your answers about taking the lead",
  strategic: "your answers about planning ahead",
  analytical: "your reasoning-question results",
  communication: "your answers about explaining ideas",
  relationships: "your answers about teamwork",
  emotional: "your answers about feedback and disagreements",
  creativity: "your answers about new ideas",
  execution: "your answers about finishing work",
  learning: "your answers about learning new things",
  ownership: "your answers about setbacks",
  digital: "your answers about digital tools",
  ai: "your answers about using AI",
  data: "your answers about data",
};

/** Career Horizon's skill-gap engine, Option 2 (per explicit instruction):
 *  real 1-5 gauges ONLY for named skills backed by an actual measured score.
 *  Since the 8-pillar UG bank, Communication, Digital literacy, AI readiness
 *  and Data literacy come from the student's stored skill evidence (Pillars 5
 *  and 6). A layer with nothing measured still shows the explicit
 *  "not assessed" note instead of a number. */
function realSkillGaugesForLayer(
  layerKey: keyof HorizonSkillLayers,
  strengthDomains: GraduateScoreOutput["layer1"]["strengthDomains"],
  mi: GraduateScoreOutput["layer1"]["multipleIntelligence"],
  ei: GraduateScoreOutput["layer1"]["emotionalIntelligence"],
  domainFitScore: number | null,
  evidence?: SkillEvidenceGrad
): HorizonSkillGauge[] {
  const fromEvidence = (key: keyof SkillEvidenceGrad, label: string): HorizonSkillGauge[] => {
    const e = evidence?.[key];
    return e ? [{ label, level1to5: e.level, source: SKILL_SOURCE_PLAIN[key] ?? e.basis }] : [];
  };
  const findDomain = (list: GraduateScoreOutput["layer1"]["strengthDomains"], name: string) => list.find((d) => d.domain === name);
  switch (layerKey) {
    case "foundationalHuman": {
      const out: HorizonSkillGauge[] = [];
      const linguistic = findDomain(mi, "Linguistic");
      if (linguistic) out.push({ label: "Communication", level1to5: toFive(linguistic.score, 100), source: "your answers about explaining ideas" });
      else out.push(...fromEvidence("communication", "Communication"));
      const analytical = findDomain(strengthDomains, "Intellectual & Analytical");
      if (analytical) out.push({ label: "Critical Thinking", level1to5: toFive(analytical.score, 100), source: "your answers about analysing problems" });
      if (ei) {
        const avg = (ei.selfAwareness + ei.selfManagement + ei.socialAwareness + ei.relationshipManagement) / 4;
        out.push({ label: "Emotional Intelligence", level1to5: toFive(avg, 1), source: "your answers about feedback and disagreements" });
      }
      return out;
    }
    case "strategic": {
      const out: HorizonSkillGauge[] = [];
      const leadership = findDomain(strengthDomains, "Influence & Leadership");
      if (leadership) out.push({ label: "Leadership", level1to5: toFive(leadership.score, 100), source: "your answers about leading others" });
      const strategic = findDomain(strengthDomains, "Strategic & Futuristic");
      if (strategic) out.push({ label: "Strategic Thinking", level1to5: toFive(strategic.score, 100), source: "your answers about planning ahead" });
      return out;
    }
    case "domain":
      return domainFitScore == null ? [] : [{ label: "Domain Fit", level1to5: toFive(domainFitScore, 100), source: "how well this field matches your answers" }];
    case "digital":
      return [...fromEvidence("digital", "Digital Literacy"), ...fromEvidence("data", "Data Literacy")];
    case "ai":
      return fromEvidence("ai", "AI Readiness");
    default:
      return [];
  }
}

function GaugeRow({ gauge, color }: { gauge: HorizonSkillGauge; color: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", alignItems: "center", gap: "1px 10px", marginTop: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)" }}>{gauge.label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} style={{ width: 14, height: 7, borderRadius: 3, background: n <= gauge.level1to5 ? color : `${color}20` }} />
        ))}
        <b style={{ fontSize: 11, color: "var(--ink)", marginLeft: 6, fontVariantNumeric: "tabular-nums" }}>{gauge.level1to5}/5</b>
      </span>
      <span style={{ gridColumn: "1 / -1", fontSize: 10.5, color: "var(--muted)" }}>From {gauge.source}</span>
    </div>
  );
}

// ---------------------------------------------------------------- Role roadmaps
// The role-specific roadmaps from the Word files (lib/report/roleRoadmapGrad.tsx
// loads them). Standard sections reuse the 7-step look above - same icons,
// colours and numbering - and any extra section a roadmap has (projects,
// specialisation lanes, a final skill stack...) gets a plain titled card.
const ROLE_KIND_STEP: Record<string, number> = { build: 1, internships: 2, certifications: 3, careers: 4, pg_india: 5, abroad: 6, growth: 7 };

function RoleLink({ text, url, color }: { text: string; url?: string; color: string }) {
  const lines = text.split("\n");
  const body = lines.map((l, i) => <span key={i}>{i > 0 && <br />}{l}</span>);
  return url
    ? <a href={url} target="_blank" rel="noreferrer" style={{ color, fontWeight: 700, textDecoration: "none" }}>{body} ↗</a>
    : <>{body}</>;
}

function RoleBlocks({ blocks, color }: { blocks: RoleRoadmapBlock[]; color: string }) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    // A run of "heading + one short line" pairs reads as a label/value list.
    if (b.type === "h") {
      const pairs: { k: string; v: RoleRoadmapBlock }[] = [];
      let j = i;
      while (blocks[j]?.type === "h" && blocks[j + 1]?.type === "p" && (blocks[j + 1] as { text: string }).text.length <= 160 && blocks[j + 2]?.type !== "p") {
        pairs.push({ k: (blocks[j] as { text: string }).text, v: blocks[j + 1] });
        j += 2;
      }
      if (pairs.length >= 2) {
        out.push(
          <div key={i} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 34%) 1fr", gap: "0", border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", margin: "8px 0" }}>
            {pairs.map((pr, n) => (
              <div key={n} style={{ display: "contents" }}>
                <div style={{ padding: "8px 12px", fontSize: 12, fontWeight: 800, color, background: `${color}0a`, borderTop: n ? "1px solid var(--line)" : "none" }}>{pr.k}</div>
                <div style={{ padding: "8px 12px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5, borderTop: n ? "1px solid var(--line)" : "none" }}>
                  <RoleLink text={(pr.v as { text: string }).text} url={(pr.v as { url?: string }).url} color={color} />
                </div>
              </div>
            ))}
          </div>
        );
        i = j - 1;
        continue;
      }
      out.push(<div key={i} style={{ fontSize: 12.5, fontWeight: 900, color: "var(--ink)", margin: "14px 0 6px" }}>{b.text}</div>);
    } else if (b.type === "p") {
      out.push(<p key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, margin: "6px 0" }}><RoleLink text={b.text} url={b.url} color={color} /></p>);
    } else if (b.type === "note") {
      out.push(
        <div key={i} style={{ margin: "8px 0", padding: "9px 12px", borderLeft: `3px solid ${color}`, background: `${color}0a`, borderRadius: "0 10px 10px 0", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--ink)" }}>{b.label}:</b> {b.text}
        </div>
      );
    } else if (b.type === "flow") {
      // A progression reads left to right with arrows; a skill stack with "+".
      out.push(
        <div key={i} style={{ margin: "8px 0" }}>
          {b.label && <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)", marginBottom: 6 }}>{b.label}</div>}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px 0" }}>
            {b.items.map((it, n) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center" }}>
                {n > 0 && <span aria-hidden style={{ color, fontWeight: 900, fontSize: 13, padding: "0 6px" }}>{b.sep ?? "→"}</span>}
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.35, color: "var(--ink-2)", background: `${color}0c`, border: `1px solid ${color}33`, borderRadius: 999, padding: "4px 10px" }}>{it}</span>
              </span>
            ))}
          </div>
        </div>
      );
    } else if (b.type === "list") {
      // Short items (role titles, topics) sit in two columns.
      const twoCol = b.items.length > 10 || (b.items.length >= 6 && b.items.every((it) => it.text.length <= 40));
      out.push(
        <ul key={i} style={{ margin: "6px 0", paddingLeft: 18, columns: twoCol ? 2 : 1, columnGap: 24 }}>
          {b.items.map((it, n) => (
            <li key={n} style={{ fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.6, breakInside: "avoid" }}><RoleLink text={it.text} url={it.url} color={color} /></li>
          ))}
        </ul>
      );
    } else if (b.type === "table") {
      out.push(
        <div key={i} style={{ overflowX: "auto", margin: "8px 0", border: "1px solid var(--line)", borderRadius: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            {b.header.some(Boolean) && (
              <thead>
                <tr>{b.header.map((h, n) => <th key={n} style={{ textAlign: "left", padding: "8px 10px", fontSize: 10.5, fontWeight: 900, letterSpacing: ".04em", textTransform: "uppercase", color, background: `${color}0f`, borderBottom: `1px solid ${color}30`, whiteSpace: "nowrap" }}>{h}</th>)}</tr>
              </thead>
            )}
            <tbody>
              {b.rows.map((row, r) => (
                <tr key={r} style={{ background: r % 2 ? "var(--line-2, #fafafb)" : "#fff" }}>
                  {row.map((c, n) => (
                    <td key={n} style={{ padding: "8px 10px", verticalAlign: "top", color: n === 0 ? "var(--ink)" : "var(--ink-2)", fontWeight: n === 0 ? 700 : 400, lineHeight: 1.5, borderTop: "1px solid var(--line)", minWidth: 110 }}>
                      <RoleLink text={c.text} url={c.url} color={color} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
  return <>{out}</>;
}

function RoleRoadmapView({ rm, color }: { rm: RoleRoadmap; color: string }) {
  const writtenFor = [rm.facts["Current degree"], rm.facts["Course"]].filter(Boolean).join(" · ");
  const standard = new Set(rm.sections.map((s) => ROLE_KIND_STEP[s.kind]).filter(Boolean));
  return (
    <div>
      {rm.summary && <p style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6, margin: "0 0 12px", textAlign: "center" }}>{rm.summary}</p>}
      {(writtenFor || rm.facts["Starts"]) && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 12 }}>
          {writtenFor && <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 999, padding: "4px 11px" }}>Written for: {writtenFor}</span>}
          {rm.facts["Starts"] && <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink-2)", background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 999, padding: "4px 11px" }}>Starts: {rm.facts["Starts"]}</span>}
        </div>
      )}
      {writtenFor && (
        <p style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "center", margin: "0 0 14px" }}>If your degree or course is different, keep the same goals and adapt the year-by-year plan to your own subjects.</p>
      )}
      {rm.about.map((a, i) => (
        <div key={i} style={{ margin: "0 0 10px", padding: "9px 12px", borderLeft: `3px solid ${color}`, background: `${color}0a`, borderRadius: "0 10px 10px 0", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--ink)" }}>{a.label}:</b> {a.text}
        </div>
      ))}
      {rm.intro && rm.intro.length > 0 && <div style={{ margin: "0 0 12px" }}><RoleBlocks blocks={rm.intro} color={color} /></div>}
      {standard.size >= 4 && <RoadmapJourneyStrip />}
      {rm.horizons.length > 0 && (
        <div style={{ margin: "4px 0 18px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
          {rm.horizons.map((h, i) => (
            <div key={i} style={{ border: `1px solid ${color}30`, borderTop: `3px solid ${color}`, borderRadius: 12, padding: "10px 12px", background: "#fff" }}>
              <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", color }}>{h.period}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: "var(--ink)", margin: "3px 0 4px" }}>{h.question}</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.5 }}>{h.output}</div>
            </div>
          ))}
        </div>
      )}
      {rm.sections.map((s, i) => {
        const step = ROLE_KIND_STEP[s.kind];
        const accent = step ? sectionAccent(step) : color;
        const body = <RoleBlocks blocks={s.blocks} color={accent} />;
        return step ? (
          <GradRoadmapSectionFrame key={i} index={step} title={s.heading}>{body}</GradRoadmapSectionFrame>
        ) : (
          <div key={i} style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${color}30` }}>
            <div style={{ padding: "10px 12px", borderRadius: 13, background: `linear-gradient(110deg, ${color}10, #fff)`, border: `1px solid ${color}30` }}>
              <h2 style={{ margin: 0, fontSize: 17, lineHeight: 1.25, letterSpacing: "-.02em", color: "var(--ink)" }}>{s.heading}</h2>
            </div>
            <div style={{ marginTop: 10 }}>{body}</div>
          </div>
        );
      })}
      <p className="disclaimer" style={{ marginTop: 18 }}>Fees, dates, eligibility and links change every year - confirm them on each official website before you apply or pay.</p>
    </div>
  );
}

/** A short signpost at the end of the 7-section roadmap pointing into the
 *  Career Horizon sheet that follows it - without this, the Horizon section
 *  (this product's real differentiator - a 20-year outlook, not just a
 *  near-term plan) reads as an unflagged extra page rather than a
 *  deliberate next chapter. Plain visual signpost, not a clickable anchor
 *  link - this report also renders to PDF, where in-page scroll links don't
 *  apply, and the Horizon sheet already follows immediately next either way. */
function CareerHorizonTeaser({ color }: { color: string }) {
  return (
    <div style={{ marginTop: 20, padding: "14px 18px", borderRadius: 14, display: "flex", alignItems: "center", gap: 14, background: `linear-gradient(110deg, ${color}12, #fff)`, border: `1px solid ${color}35` }}>
      <span style={{ width: 36, height: 36, borderRadius: 11, display: "grid", placeItems: "center", background: color, color: "#fff", flex: "none" }}>
        <Icon name="compass" size={17} />
      </span>
      <div>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".06em", textTransform: "uppercase", color }}>Coming up next</div>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", margin: "3px 0 0", lineHeight: 1.5 }}>
          That's the near-term plan. Next: your <b style={{ color: "var(--ink)" }}>2026-2046 Career Horizon</b> - how this field tends to evolve across a full career, and which skills matter at each stage.
        </p>
      </div>
    </div>
  );
}

// Icons for the five skill areas of every horizon stage.
const SKILL_LAYER_ICON: Record<keyof HorizonSkillLayers, string> = {
  foundationalHuman: "heart",
  digital: "cpu",
  ai: "bulb",
  domain: "briefcase",
  strategic: "flag",
};

/** Each skill line is written "core point - why it matters"; shown as a bold
 *  point with its explanation underneath, never cut short. */
function splitHorizonSkill(text: string): { core: string; why: string } {
  const clean = text.trim();
  if (!clean) return { core: "", why: "" };
  const at = clean.indexOf(" - ");
  if (at < 0) return { core: clean, why: "" };
  const core = clean.slice(0, at).replace(/[.;:,]\s*$/, "");
  const rest = clean.slice(at + 3).trim();
  const why = rest ? rest.charAt(0).toUpperCase() + rest.slice(1) : "";
  return { core: `${core}.`, why: why && !/[.!?"”]$/.test(why) ? `${why}.` : why };
}

const HORIZON_CSS = `
.hz-steps{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-top:18px}
.hz-step{display:flex;flex-direction:column;gap:2px;padding:10px 12px;border-radius:12px;border:1px solid var(--hz-line);background:#fff;position:relative}
.hz-step-n{position:absolute;top:10px;right:12px;width:20px;height:20px;border-radius:999px;background:var(--hz);color:#fff;font-size:11px;font-weight:900;display:grid;place-items:center}
.hz-step-y{font-size:10px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--hz)}
.hz-step b{font-size:13px;color:var(--ink);line-height:1.3;padding-right:24px}
.hz-card{border:1px solid var(--hz-line);border-radius:16px;overflow:hidden;background:#fff;break-inside:avoid}
.hz-head{display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:linear-gradient(110deg,var(--hz-tint),#fff)}
.hz-ic{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:var(--hz);color:#fff;flex:none}
.hz-when{font-size:10px;font-weight:900;letter-spacing:.07em;text-transform:uppercase;color:var(--hz)}
.hz-q{font-size:15px;font-weight:800;color:var(--ink);margin-top:3px}
.hz-outlook{font-size:12.5px;color:var(--ink-2);margin:4px 0 0;line-height:1.55}
.hz-sub{padding:12px 16px 0;font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}
.hz-skills{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:10px 16px 16px}
.hz-skill{border:1px solid var(--line,#e5e7eb);border-left:3px solid var(--hz);border-radius:10px;padding:10px 12px;background:#fff}
.hz-skill:last-child:nth-child(odd){grid-column:1/-1}
.hz-k{display:flex;align-items:center;gap:6px;font-size:10px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--hz)}
.hz-core{font-size:13px;font-weight:800;color:var(--ink);line-height:1.4;margin-top:6px}
.hz-why{font-size:12px;color:var(--ink-2);line-height:1.5;margin-top:3px}
@media (max-width:640px){.hz-steps{grid-template-columns:repeat(2,minmax(0,1fr))}.hz-skills{grid-template-columns:minmax(0,1fr)}.hz-skill:last-child:nth-child(odd){grid-column:auto}}
`;

/** The "2026-2046 Career Horizon" - additional, appended after the 7-section
 *  roadmap, never replacing it (see this file's header comment and
 *  careerHorizonsGrad.ts's own header). Authored at cluster grain. The
 *  skill-gap engine's "what you already have" block is shown ONCE (not
 *  per-horizon - the student's current level doesn't change across time
 *  periods, only what each stage asks of it does) using only real,
 *  honestly-sourced 1-5 gauges (realSkillGaugesForLayer) - Digital/AI
 *  Skills get an explicit "not assessed" note rather than a fabricated
 *  number, since nothing in this test measures them. */
function CareerHorizonSectionGrad({ horizon, cluster, roleContext, strengthDomains, multipleIntelligence, emotionalIntelligence, domainFitScore, skillEvidence }: {
  horizon: ClusterCareerHorizon;
  cluster: string;
  roleContext?: string;
  strengthDomains: GraduateScoreOutput["layer1"]["strengthDomains"];
  multipleIntelligence: GraduateScoreOutput["layer1"]["multipleIntelligence"];
  emotionalIntelligence: GraduateScoreOutput["layer1"]["emotionalIntelligence"];
  domainFitScore: number | null;
  skillEvidence?: SkillEvidenceGrad;
}) {
  const color = clusterColor(cluster);
  return (
    <>
      <PageHead eyebrow="A longer view" title="Your 2026-2046 Career Horizon"
        sub={`How careers in ${cluster.toLowerCase()} usually change over the next 20 years, and which skills matter at each stage.`} />

      <div style={{ marginTop: 20, padding: "14px 16px", borderRadius: 14, border: `1px solid ${color}30`, background: `${color}06` }}>
        <div style={{ fontSize: 10, fontWeight: 900, letterSpacing: ".07em", textTransform: "uppercase", color, marginBottom: 10 }}>Your current level, from this test (1-5)</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {SKILL_LAYER_META.map((layer) => {
            const gauges = realSkillGaugesForLayer(layer.key, strengthDomains, multipleIntelligence, emotionalIntelligence, domainFitScore, skillEvidence);
            return (
              <div key={layer.key}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "var(--ink)", marginBottom: 4 }}>{layer.label}</div>
                {gauges.length > 0 ? (
                  gauges.map((g) => <GaugeRow key={g.label} gauge={g} color={color} />)
                ) : (
                  <p style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", margin: 0 }}>Not measured by this test.</p>
                )}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 12, marginBottom: 0 }}>Each level comes from your answers in this test.</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: HORIZON_CSS }} />
      {/* The four stages at a glance, then each stage in full. */}
      <div className="hz-steps" style={{ ["--hz" as string]: color, ["--hz-line" as string]: `${color}30` } as React.CSSProperties}>
        {horizon.phases.map((phase, i) => (
          <div key={phase.id} className="hz-step">
            <span className="hz-step-n">{i + 1}</span>
            <span className="hz-step-y">{phase.label}</span>
            <b>{phase.theme}</b>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 18 }}>
        {horizon.phases.map((phase, i) => {
          const meta = HORIZON_PHASE_META[i];
          return (
            <div key={phase.id} className="hz-card" style={{ ["--hz" as string]: color, ["--hz-line" as string]: `${color}30`, ["--hz-tint" as string]: `${color}14` } as React.CSSProperties}>
              <div className="hz-head">
                <span className="hz-ic"><Icon name={meta?.icon ?? "route"} size={17} /></span>
                <div style={{ minWidth: 0 }}>
                  <div className="hz-when">Stage {i + 1} · {phase.label} · {phase.theme}</div>
                  <div className="hz-q">{phase.assessmentQuestion}</div>
                  <p className="hz-outlook">{phase.outlook}</p>
                </div>
              </div>
              <div className="hz-sub">Skills that matter in this stage</div>
              <div className="hz-skills">
                {SKILL_LAYER_META.map((layer) => {
                  const { core, why } = splitHorizonSkill(phase.skills[layer.key] ?? "");
                  if (!core) return null;
                  return (
                    <div key={layer.key} className="hz-skill">
                      <div className="hz-k"><Icon name={SKILL_LAYER_ICON[layer.key]} size={13} />{layer.label}</div>
                      <div className="hz-core">{core}</div>
                      {why && <div className="hz-why">{why}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="disclaimer" style={{ marginTop: 18 }}>{CAREER_HORIZON_GUIDANCE_NOTE}</p>
    </>
  );
}

const PERSONAL_CARE_CLUSTER = "Personal Care, Beauty & Wellness";
const GAP_STATUS_STYLE: Record<GapStatus, { label: string; color: string; bg: string }> = {
  strength: { label: "Ready", color: "#0d7a55", bg: "#e4f5ec" },
  build: { label: "Almost there", color: "#9a5b00", bg: "#fdf0d2" },
  develop: { label: "Needs work", color: "#b42318", bg: "#fde7e5" },
};

function SkillGapNotice({ text }: { text: string }) {
  return (
    <p style={{ marginTop: 20, padding: "16px 18px", borderRadius: 13, border: "1px solid var(--line)", fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{text}</p>
  );
}

function LevelBars({ level, color }: { level: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "0 0 auto" }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n} style={{ width: 16, height: 7, borderRadius: 3, background: n <= level ? color : `${color}20` }} />
        ))}
      </div>
      <span style={{ fontSize: 11, fontWeight: 800, color: "var(--ink)" }}>{level}/5</span>
    </div>
  );
}

function SkillGapSectionGrad({ evidence, cluster, color }: { evidence: SkillEvidenceGrad | undefined; cluster: string; color: string }) {
  if (cluster === PERSONAL_CARE_CLUSTER) {
    return <SkillGapNotice text="The skill gap is not available for this cluster yet. It covers the 17 clusters in the career-fit matrix." />;
  }
  const result = computeSkillGap(evidence, cluster);
  if (!result) {
    return <SkillGapNotice text="Your report was created before skill evidence was recorded. Retake the assessment to see your skill gap for this cluster." />;
  }
  const measured = result.rows.filter((r): r is MeasuredGapRow => r.kind === "measured");
  const unmeasured = result.rows.filter((r): r is UnmeasuredGapRow => r.kind === "unmeasured");
  const tiles: { label: string; value: number; status: GapStatus | "notAssessed" }[] = [
    { label: "Ready", value: result.counts.strength, status: "strength" },
    { label: "Almost there", value: result.counts.build, status: "build" },
    { label: "Needs work", value: result.counts.develop, status: "develop" },
    { label: "Not assessed", value: result.counts.notAssessed, status: "notAssessed" },
  ];
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
        {tiles.map((t) => {
          const s = t.status === "notAssessed" ? { color: "var(--muted)", bg: "var(--line)" } : GAP_STATUS_STYLE[t.status];
          return (
            <div key={t.label} style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "12px 14px", minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: s.color }}>{t.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: "var(--ink)", marginTop: 2 }}>{t.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 20, border: "1px solid var(--line)", borderRadius: 13, overflow: "hidden" }}>
        <div style={{ padding: "10px 16px", fontSize: 10.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)", background: "var(--paper, #f8f7f3)" }}>
          Measured skills
        </div>
        {measured.map((r) => {
          const s = GAP_STATUS_STYLE[r.status];
          return (
            <div key={r.key} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--line)" }}>
              <div style={{ flex: "1 1 180px", minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>{r.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, lineHeight: 1.45 }}>Based on {SKILL_SOURCE_PLAIN[r.key] ?? r.basis}</div>
              </div>
              <LevelBars level={r.level} color={color} />
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", flex: "0 0 auto" }}>
                Usually needed: {r.target}
              </div>
              <span style={{ fontSize: 11, fontWeight: 800, color: s.color, background: s.bg, padding: "3px 10px", borderRadius: 999, flex: "0 0 auto" }}>{s.label}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 16, border: "1px dashed var(--line)", borderRadius: 13, padding: "14px 16px" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--ink)" }}>Not measured by this test</div>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 10px", lineHeight: 1.5 }}>The test can't measure these, so no level is shown. Build them through the projects and courses in your roadmap.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {unmeasured.map((r) => (
            <span key={r.label} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 999, border: "1px solid var(--line)", color: "var(--muted)" }}>{r.label} · Not assessed</span>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 14, lineHeight: 1.6 }}>
        Your levels come from this test (1 to 5). "Usually needed" is our estimate for jobs in this area, not an official standard.
      </p>
    </div>
  );
}

export function buildCareerFitGradSheets(output: GraduateScoreOutput): ReportSheet[] {
  const { clusterAffinities, academicContext, aspiration } = output;

  // Fitment: pure measured-profile ranking (computedScore only), ignoring
  // both self-report and current degree entirely - "what fits you" with no
  // filter for what's currently reachable, same framing as 11-12's Fitment.
  const fitmentRanked = [...clusterAffinities].sort((a, b) => b.computedScore - a.computedScore);

  // Suitability: anchored to the student's real degree+course - see
  // rankSuitabilityGrad's own doc comment (scoringGrad.ts) for why a hard
  // anchor replaced the old soft score boost, and why this must be the ONE
  // shared implementation rather than re-derived per report page.
  const suitabilityRanked = rankSuitabilityGrad(clusterAffinities, academicContext.degree, academicContext.course);

  const topCluster = suitabilityRanked[0]?.cluster ?? "";

  // Career Selector's roadmap must match what the student actually SELECTED
  // (aspiration.desiredCareer), not just their measured-profile Suitability
  // cluster - those can genuinely disagree (a student whose degree/profile
  // points to Engineering but who typed "Doctor" should see a Healthcare
  // roadmap, not an Engineering one). clusterForRole resolves the typed
  // career's real cluster via CLUSTER_ROLES; suitabilityRanked's own cluster
  // order breaks ties for the ~8% of roles that exist in more than one
  // cluster. Falls back to topCluster when no career was typed, or when the
  // typed value came from the Selector's "Other researched careers" bucket
  // (Class 11-12 names not resolvable against this taxonomy - see
  // clusterForRole's own doc comment).
  const selectorCluster = (aspiration.desiredCareer && clusterForRole(aspiration.desiredCareer, suitabilityRanked.map((c) => c.cluster))) || topCluster;

  // Tier 1 - real, individually-researched per-career content (read-only
  // reuse of Class 11-12's 360-career CAREER_ROADMAPS_DETAILED, per
  // CLAUDE.md). Checked FIRST - when it resolves, it wins outright over
  // both the flagship and generic cluster roadmaps below (see this file's
  // header comment).
  const matchedCareer1112 = findCareer1112(aspiration.desiredCareer);
  const detailedRoadmap = matchedCareer1112 ? detailedRoadmapFor(matchedCareer1112.name) : null;

  // Tier 2 - the genuinely deep, independently-researched CLUSTER roadmap
  // (see flagshipRoadmapsGrad.ts, 17 of 18 clusters) when Tier 1 didn't
  // resolve - takes priority over the generic synthesized genericRoadmap
  // below when present. Only "Personal Care, Beauty & Wellness" (not
  // covered by the source document) falls back to the generic content.
  // Anchored to selectorCluster (what the student picked), not topCluster.
  const flagshipRoadmap = flagshipRoadmapForGrad(selectorCluster);
  const genericRoadmap = clusterRoadmapGradFor(selectorCluster);

  // Tier 2's one genuinely role-specific fact (see PinnedRoleCallout) -
  // only computed when Tier 1 didn't already give a full per-career
  // roadmap, so the pinned-role callout never appears redundantly above a
  // roadmap that's already built around that exact role.
  const tier2Role = !detailedRoadmap && aspiration.desiredCareer ? aspiration.desiredCareer : undefined;

  const careerHorizon = careerHorizonForCluster(selectorCluster);

  const roleChipsFor = (cluster: string) => featuredRoles(cluster, output.layer1.riasec, 3);
  const degreeCluster = clusterForDegreeCourse(academicContext.degree, academicContext.course);

  const sheets: ReportSheet[] = [
    {
      id: "career-clusters-bar-grad",
      kicker: "Your career cluster fit",
      node: (
        <>
          <PageHead eyebrow="Across the standard career clusters" title="Your Career Cluster Fit"
            sub="Jobs are grouped into 17 broad career areas (called clusters). This shows how closely your answers match each one - a higher % means a closer match." />
          <div style={{ marginTop: 24, border: "1px solid var(--line)", borderRadius: 13, padding: "28px 24px" }}>
            <ClusterBarChartGrad rows={fitmentRanked.map((c) => ({ cluster: c.cluster, score: c.computedScore }))} />
          </div>
        </>
      ),
    },
    {
      id: "career-overview-table-grad",
      kicker: "Overview",
      node: (
        <>
          <PageHead eyebrow="Three views of your options" title="Your Career Path at a Glance"
            sub="Left: career areas that match your answers. Middle: areas that match your degree. Right: the career you chose. Each is explained on the next pages." />
          <div className="full-bleed" style={{ marginTop: 22, border: "1px solid var(--line)", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,.05), 0 10px 26px rgba(0,0,0,.05)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <OverviewHeadCell icon="score" title="Career Fitment" subtitle="What fits you" desc="Clusters that align with your interests and strengths." color="#2f6bff" />
              <OverviewHeadCell icon="cap" title="Career Suitability" subtitle="What fits your degree" desc="Clusters that match your actual degree and course." color="#12996b" borderLeft />
              <OverviewHeadCell icon="match" title="Career Selector" subtitle="Your desired career" desc="The career you chose before the test, and the path to it." color="#e08a1e" borderLeft />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div style={{ minWidth: 0 }}>
                {fitmentRanked.slice(0, 5).some((c) => c.computedScore > 0) ? fitmentRanked.slice(0, 5).map((c, i) => (
                  <OverviewRow key={c.cluster} rank={i + 1} name={c.cluster} pct={c.computedScore} color="#2f6bff" roles={roleChipsFor(c.cluster)} />
                )) : <OverviewEmpty text="No matches yet." />}
              </div>
              <div style={{ minWidth: 0, borderLeft: "1px solid var(--line)" }}>
                {suitabilityRanked.slice(0, 5).map((c, i) => {
                  const isDegreeField = c.cluster === degreeCluster;
                  const ownRoles = isDegreeField ? rankRolesByRiasec(rolesForDegreeCourse(academicContext.degree, academicContext.course), output.layer1.riasec).slice(0, 3) : [];
                  return (
                    <OverviewRow key={c.cluster} rank={i + 1} name={c.cluster} pct={c.suitabilityScore} color="#12996b"
                      note={isDegreeField ? "Your degree's field - listed first" : undefined}
                      roles={ownRoles.length ? ownRoles : roleChipsFor(c.cluster)} />
                  );
                })}
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
            sub="The 5 career areas that match your answers best, whatever your degree. The next page looks at what fits your degree." />
          <div style={{ marginTop: 20 }}>
            <ConcernPointers concerns={aspiration.concerns} />
            <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "0 0 12px" }}>
              <b>LPA</b> = lakh rupees per year (₹4 LPA ≈ ₹33,000 a month). <b>PG entrance exams</b> are the tests used for admission to master&apos;s programmes in that area.
            </p>
            {fitmentRanked.slice(0, 5).map((c, i) => <ClusterCard key={c.cluster} cluster={c.cluster} score={c.computedScore} rank={i + 1} riasec={output.layer1.riasec} />)}
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
            sub="The career area your degree belongs to comes first - even if its % is lower - because it's the most direct route from what you study. The others follow in order of how well they match your answers." />
          {/* No standalone "roles your course leads to" callout here - when
              degreeCluster resolves, it's always rank #1 below (see
              suitabilityRanked), and SuitabilityDomainBlock already shows
              those exact roles attributed to that card. A callout up here
              would only ever be reachable when degreeCluster is null, which
              also means degreeRoles is empty (same MASTER_ROWS_GRAD lookup),
              so there'd never be anything to show it anyway. */}
          <div style={{ marginTop: 20 }}>
            {suitabilityRanked.slice(0, 5).map((c, i) => (
              <SuitabilityDomainBlock key={c.cluster} cluster={c.cluster} score={c.suitabilityScore} rank={i + 1} degree={academicContext.degree} course={academicContext.course} riasec={output.layer1.riasec} />
            ))}
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
                background: `linear-gradient(135deg, ${clusterColor(selectorCluster)}14, ${clusterColor(selectorCluster)}05)`,
                border: `1px solid ${clusterColor(selectorCluster)}38`,
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>You are here</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "var(--ink)", marginTop: 4 }}>{academicContext.degree || "Your degree"}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)", marginTop: 2 }}>{academicContext.course}</div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: clusterColor(selectorCluster) }}>→</div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--muted)" }}>Your destination</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: clusterColor(selectorCluster), marginTop: 4 }}>{aspiration.desiredCareer}</div>
                </div>
              </div>

              <div style={BREAK}>
                <SecHead center eyebrow="Where to go next" title="Explore internships"
                  sub="Live internship listings on your own OneGrasp dashboard." />
                <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                  <a href={`${SITE_URL_GRAD}/account/internships-new`} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: clusterColor(selectorCluster), padding: "9px 16px", borderRadius: 10, textDecoration: "none" }}>Browse live internships on your dashboard ↗</a>
                </div>
              </div>
            </div>
          )}

          {/* Tiered: Tier 1 (detailedRoadmap) is real, individually-
              researched content for this EXACT career when it resolves
              against Class 11-12's 360-career set - wins outright. Tier 2
              (flagship/generic) is the cluster-wide roadmap for whatever
              cluster the typed career resolves to (selectorCluster), with
              the exact role pinned at the top via tier2Role
              rather than silently presented as cluster-generic. Falls back
              to the Suitability cluster with no pin at all only when no
              career was typed. See this file's header comment for the full
              rationale. */}
          {/* A role-specific roadmap from the Word files wins when the
              student's chosen career has one (picked for their course);
              otherwise the tiers below, as before. */}
          <RoleRoadmapSwitch
            role={aspiration.desiredCareer || undefined}
            degree={academicContext.degree}
            course={academicContext.course}
            found={(rm) => (
              <div style={{ ...BREAK, marginTop: 20 }}>
                <SecHead center eyebrow={`${rm.role} · career roadmap`} title="Your realistic path"
                  sub={`A roadmap written for ${rm.role}: what to build each year, internships, certifications, jobs, master's options and how the career grows.`} />
                <div style={{ marginTop: 16 }}>
                  <RoleRoadmapView rm={rm} color={clusterColor(selectorCluster)} />
                </div>
                {careerHorizon && <CareerHorizonTeaser color={clusterColor(selectorCluster)} />}
              </div>
            )}
            fallback={(detailedRoadmap || flagshipRoadmap || genericRoadmap) ? (
            <div style={{ ...BREAK, marginTop: 20 }}>
              <SecHead center
                eyebrow={detailedRoadmap ? `${matchedCareer1112!.name} · researched career roadmap` : `${selectorCluster} · ${tier2Role ? "matching your selected career" : "your best-fit cluster"}`}
                title="Your realistic path"
                sub={detailedRoadmap
                  ? `A roadmap built specifically for ${matchedCareer1112!.name} - researched content for this exact career, from UG onward.`
                  : tier2Role
                  ? `Your path toward ${tier2Role} - the shared internships, certifications, PG options and abroad routes everyone in ${selectorCluster} draws on, pointed at the exact role you typed.`
                  : "The standard path into this cluster - the same realistic route for anyone in this field, not built around one specific job title."} />
              <div style={{ marginTop: 16 }}>
                {detailedRoadmap ? (
                  <DetailedCareerRoadmapViewGrad r={detailedRoadmap} careerName={matchedCareer1112!.name} color={clusterColor(selectorCluster)} strengthDomains={output.layer1.strengthDomains} />
                ) : flagshipRoadmap ? (
                  <FlagshipRoadmapViewGrad r={flagshipRoadmap} selectedRole={tier2Role} />
                ) : (
                  <ClusterRoadmapView r={genericRoadmap!} strengthDomains={output.layer1.strengthDomains} selectedRole={tier2Role} />
                )}
              </div>
              {careerHorizon && <CareerHorizonTeaser color={clusterColor(selectorCluster)} />}
            </div>
            ) : null}
          />
        </>
      ),
    },
    {
      id: "skill-gap-grad",
      kicker: "Skill gap",
      node: (
        <>
          <PageHead eyebrow={`${selectorCluster} · measured from your answers`} title="Your Skill Gap"
            sub="Your level for each skill (1 = just starting, 5 = very strong), compared with the level jobs in this area usually need. Skills this test can't measure are listed at the end." />
          <SkillGapSectionGrad evidence={output.skillEvidence} cluster={selectorCluster} color={clusterColor(selectorCluster)} />
        </>
      ),
    },
    ...(careerHorizon
      ? [{
          id: "career-horizon-grad",
          kicker: "Career horizon",
          node: (
            <CareerHorizonSectionGrad
              horizon={careerHorizon}
              cluster={selectorCluster}
              roleContext={aspiration.desiredCareer || undefined}
              strengthDomains={output.layer1.strengthDomains}
              multipleIntelligence={output.layer1.multipleIntelligence}
              emotionalIntelligence={output.layer1.emotionalIntelligence}
              domainFitScore={suitabilityRanked.find((c) => c.cluster === selectorCluster)?.suitabilityScore ?? null}
              skillEvidence={output.skillEvidence}
            />
          ),
        }]
      : []),
  ];

  return sheets;
}
