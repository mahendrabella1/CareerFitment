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
 * The Selector page's roadmap is deliberately just the cluster-wide,
 * 7-section GradClusterRoadmap (ClusterRoadmapView) for the student's top
 * Suitability cluster - no separate per-role deep dive layered on top of
 * it, even when the student's typed desired career happens to match one
 * of Class 11-12's 308 individually-researched CAREERS_1112 entries. The
 * cluster-wide roadmap is considered sufficient on its own.
 */
import type { ReportSheet } from "@/app/account/FullReport";
import { RANK_COLOURS } from "@/app/account/FullReport";
import { Icon } from "@/app/Icons";
import type { GraduateScoreOutput } from "@/lib/newAssessment/scoringGrad";
import { rankSuitabilityGrad } from "@/lib/newAssessment/scoringGrad";
import { CAREER_CLUSTERS_18, CLUSTER_ROLES, MASTER_ROWS_GRAD, clusterForDegreeCourse, rolesForDegreeCourse } from "@/lib/report/careerClustersGrad";
import { clusterRoadmapGradFor, type GradClusterRoadmap } from "@/lib/report/clusterRoadmapsGrad";

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

function OverviewRow({ rank, name, pct, color, roles }: { rank: number; name: string; pct: number; color: string; roles: string[] }) {
  const tier = fitLabel(pct);
  return (
    <div style={{ minWidth: 0, padding: "13px 16px", borderBottom: "1px solid var(--line-2, var(--line))", background: "#fff", display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color, background: `${color}1c`, width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", flex: "none" }}>{rank}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--ink)" }}>{name}</span>
          <span style={{ fontSize: 15, fontWeight: 900, color: tier.color, letterSpacing: "-.01em", flex: "none" }}>{tier.label}</span>
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
function ClusterCard({ cluster, score, rank }: { cluster: string; score: number; rank: number }) {
  const color = clusterColor(cluster);
  const roles = (CLUSTER_ROLES[cluster] ?? []).slice(0, 4);
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
          {emergingCount > 0 && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 3 }}>🔥 {emergingCount} emerging course{emergingCount > 1 ? "s" : ""} in this cluster</div>}
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div style={{ fontSize: 15.5, fontWeight: 900, color: tier.color, letterSpacing: "-.01em" }}>{tier.label}</div>
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

// Suitability-page version of ClusterCard, with the same real additions
// (description, salary, exam links) plus two things specific to
// Suitability: "top companies that hire" (CLUSTER_COMPANIES_GRAD, same
// pattern as 11-12's showCompanies) and an explanation of why this cluster
// ranks here - honest about the one real limitation versus 11-12: this
// score is cluster-level (RIASEC+Strengths+MI blended), not the per-role
// Psy.Analysis/Skill breakdown 11-12 can show because it has an individual
// signature for each of its 360 careers - Graduates doesn't have that yet
// (see scoringGrad.ts's CLUSTER_SIGNATURE comment), so this differentiates
// roles on an axis it DOES have real data for instead: whether the role
// comes from the student's own actual degree+course versus a general role
// in the cluster.
function SuitabilityDomainBlock({ cluster, score, rank, degree, course }: { cluster: string; score: number; rank: number; degree: string; course: string }) {
  const color = clusterColor(cluster);
  const isOwnCluster = !!degree && !!course && clusterForDegreeCourse(degree, course) === cluster;
  const ownRoles = isOwnCluster ? rolesForDegreeCourse(degree, course) : [];
  const ownRolesSet = new Set(ownRoles);
  const generalRoles = (CLUSTER_ROLES[cluster] ?? []).filter((r) => !ownRolesSet.has(r)).slice(0, 8);
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
          {!isOwnCluster && emergingCount > 0 && <div style={{ fontSize: 10.5, color, fontWeight: 700, marginTop: 3 }}>🔥 {emergingCount} emerging course{emergingCount > 1 ? "s" : ""}</div>}
        </div>
        <div style={{ textAlign: "right", flex: "none" }}>
          <div style={{ fontSize: 15.5, fontWeight: 900, color: tier.color, letterSpacing: "-.01em" }}>{tier.label}</div>
          <div style={{ fontSize: 8.5, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--muted)" }}>Cluster fit</div>
        </div>
      </div>

      <div style={{ padding: "12px 18px 0" }}>
        <p style={{ margin: 0, fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55 }}>
          <b style={{ color: "var(--ink)" }}>Why this cluster ranks here: </b>
          your measured RIASEC interest, strengths and multiple-intelligence profile line up with what {cluster.toLowerCase()} actually draws on{isOwnCluster ? ", and it's also the field your own degree and course lead into directly." : "."} This is a cluster-wide fit, not a per-role score - Graduates doesn't yet have an individual signature for each of the ~3,300 real roles in the data the way the 360 Class 11-12 careers each do, so the roles below are differentiated by whether they come from your own degree+course instead.
        </p>
      </div>

      <div className="domcard-grid" style={{ marginTop: 8 }}>
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
  { icon: "route", label: "Grow year by year", eyebrow: "01 · What each year should build", accent: "#c46a52", pastel: "#fff1ed" },
  { icon: "briefcase", label: "Get real-world exposure", eyebrow: "02 · Internships", accent: "#477d9b", pastel: "#edf7fb" },
  { icon: "check", label: "Stack useful proof", eyebrow: "03 · Certifications in demand", accent: "#a47737", pastel: "#fff8ea" },
  { icon: "match", label: "Picture the role", eyebrow: "04 · Careers you can be hired as", accent: "#4c8b65", pastel: "#eef9f0" },
  { icon: "star", label: "Go deeper", eyebrow: "05 · PG to consider - in India", accent: "#6a72b8", pastel: "#f0f2ff" },
  { icon: "compass", label: "Think globally", eyebrow: "06 · Study abroad", accent: "#4f78a6", pastel: "#eef5ff" },
  { icon: "score", label: "Your next chapter", eyebrow: "07 · Going forward - career advancement", accent: "#c05f59", pastel: "#fff0ef" },
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
        <span style={{ flex: "none", alignSelf: "flex-start", maxWidth: 220, padding: "8px 11px", borderRadius: 9, background: `${meta.accent}18`, border: `1.5px solid ${meta.accent}55`, color: meta.accent, boxShadow: `0 3px 8px ${meta.accent}18`, fontSize: 10.5, lineHeight: 1.25, fontWeight: 950, letterSpacing: ".07em", textTransform: "uppercase", textAlign: "right" }}>{meta.eyebrow}</span>
      </div>
      <div style={{ marginTop: 10 }}>{children}</div>
    </div>
  );
}

function ClusterRoadmapView({ r, color }: { r: GradClusterRoadmap; color: string }) {
  const chip: React.CSSProperties = {
    display: "inline-block", fontSize: 11.5, fontWeight: 600, color: "var(--ink-2)",
    background: `${color}0c`, border: `1px solid ${color}30`, borderRadius: 8, padding: "5px 10px", margin: "0 6px 6px 0",
  };
  return (
    <div>
      <GradRoadmapSectionFrame index={1} title="What to build each year">
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
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={2} title="Internships">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 6 }}><b>Government:</b> {r.internships.government}</p>
        <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}><b>Private:</b> {r.internships.private}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={3} title="Certifications in demand">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.certifications}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={4} title="Careers you can be hired as">
        <div>{r.jobRoles.map((role) => <span key={role} style={chip}>{role}</span>)}</div>
        {r.emergingAreas.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6 }}>Emerging areas to watch</div>
            <p style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 10 }}>Specific courses flagged as emerging (2023-26) in current course data, with the real roles they lead to.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {r.emergingAreas.map((e) => (
                <div key={e.course} style={{ padding: "10px 12px", border: `1px solid ${color}25`, borderRadius: 10, background: `${color}06` }}>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color, marginBottom: 4 }}>{e.course}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-2)" }}>{e.roles.join(" · ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={5} title="PG to consider - in India">
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
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={6} title="Study abroad">
        <p style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{r.studyAbroad}</p>
      </GradRoadmapSectionFrame>

      <GradRoadmapSectionFrame index={7} title="Going forward - career advancement">
        {r.careerAdvancement.note && <p style={{ fontSize: 12.5, color: "var(--ink-2)", marginBottom: 8 }}>{r.careerAdvancement.note}</p>}
        {r.careerAdvancement.phdProgrammes.length > 0 && (
          <div style={{ marginBottom: 8 }}>{r.careerAdvancement.phdProgrammes.map((p) => <span key={p} style={chip}>{p}</span>)}</div>
        )}
        {r.careerAdvancement.phdRoles.length > 0 && (
          <p style={{ fontSize: 12, color: "var(--ink-2)" }}><b>Roles this can lead to:</b> {r.careerAdvancement.phdRoles.slice(0, 8).join(" · ")}</p>
        )}
      </GradRoadmapSectionFrame>
    </div>
  );
}

/** Every real (degree, course, roles) row MASTER_ROWS_GRAD ties to this
 *  cluster, grouped by degree - the source of truth for both "every
 *  degree this domain leads through" and the Degree -> Course -> Roles
 *  table, so the two can never disagree. Mirrors careerFit1112Sheets.tsx's
 *  own degreeRoleRowsFor (11-12 scope, not shared - two independent class
 *  groups per the project's scope map), extended with the course level
 *  UG's own source data actually has (11-12's CAREERS_1112 only tags one
 *  typicalDegree per career, no separate course granularity). */
function degreeCourseRowsFor(cluster: string): { degree: string; courses: { course: string; roles: string[] }[] }[] {
  const byDegree = new Map<string, { course: string; roles: string[] }[]>();
  for (const r of MASTER_ROWS_GRAD) {
    if (r.level !== "UG" || r.cluster !== cluster) continue;
    const list = byDegree.get(r.degree);
    const row = { course: r.course, roles: r.roles };
    if (list) list.push(row); else byDegree.set(r.degree, [row]);
  }
  return [...byDegree.entries()]
    .map(([degree, courses]) => ({ degree, courses: courses.sort((a, b) => a.course.localeCompare(b.course)) }))
    .sort((a, b) => b.courses.length - a.courses.length || a.degree.localeCompare(b.degree));
}

const gradTh: React.CSSProperties = { textAlign: "left", padding: "9px 10px", fontSize: 10.5, fontWeight: 800, letterSpacing: ".04em", textTransform: "uppercase", color: "#fff", background: "#2c3e50" };
const gradTd: React.CSSProperties = { padding: "10px 10px", fontSize: 12, color: "var(--ink-2)", borderBottom: "1px solid var(--line-2, var(--line))", verticalAlign: "top" };

// Every real degree in this domain (9-17 for most UG clusters), each with
// every course under it and the real roles that course leads to - the
// full breadth of the domain in one table, not the handful of job roles
// GradClusterRoadmap's own curated jobRoles list shows.
function DegreeCourseRolesTable({ cluster, color }: { cluster: string; color: string }) {
  const degrees = degreeCourseRowsFor(cluster);
  if (!degrees.length) return null;
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ ...gradTh, width: "22%" }}>Degree</th>
            <th style={{ ...gradTh, width: "22%" }}>Course / specialisation</th>
            <th style={gradTh}>Roles this leads to</th>
          </tr>
        </thead>
        <tbody>
          {degrees.map((d) =>
            d.courses.map((c, i) => (
              <tr key={`${d.degree}-${c.course}`} style={{ background: i % 2 ? "var(--line-2, #f7f7f8)" : "transparent" }}>
                {i === 0 && <td style={{ ...gradTd, fontWeight: 800, color: "var(--ink)" }} rowSpan={d.courses.length}>{d.degree}</td>}
                <td style={{ ...gradTd, fontWeight: 700, color: "var(--ink)" }}>{c.course}</td>
                <td style={gradTd}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.roles.map((role) => (
                      <span key={role} style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink)", background: `${color}0c`, border: `1px solid ${color}25`, borderRadius: 7, padding: "4px 9px" }}>{role}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
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
  const genericRoadmap = clusterRoadmapGradFor(topCluster);

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
                <div style={{ width: 64, textAlign: "right", fontSize: 12, fontWeight: 800, color: fitLabel(c.computedScore).color, flex: "none" }}>{fitLabel(c.computedScore).label}</div>
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
            sub={`Led by ${academicContext.degree || "your current degree"} - what you're actually studying comes first here, unlike Career Fitment above. The clusters below it are ranked by how strongly your measured interests, aptitude and strengths point toward them.`} />
          {/* No standalone "roles your course leads to" callout here - when
              degreeCluster resolves, it's always rank #1 below (see
              suitabilityRanked), and SuitabilityDomainBlock already shows
              those exact roles attributed to that card. A callout up here
              would only ever be reachable when degreeCluster is null, which
              also means degreeRoles is empty (same MASTER_ROWS_GRAD lookup),
              so there'd never be anything to show it anyway. */}
          <div style={{ marginTop: 20 }}>
            {suitabilityRanked.slice(0, 5).map((c, i) => (
              <SuitabilityDomainBlock key={c.cluster} cluster={c.cluster} score={c.suitabilityScore} rank={i + 1} degree={academicContext.degree} course={academicContext.course} />
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
              Career Suitability cluster - the only roadmap shown here,
              regardless of what desired career they typed. Considered
              sufficient on its own, even when the desired career matches
              one of 11-12's individually-researched CAREERS_1112 entries. */}
          {genericRoadmap && (
            <div style={{ ...BREAK, marginTop: 20 }}>
              <SecHead center eyebrow={`${topCluster} · your best-fit cluster`} title="Your realistic path"
                sub="The standard path into this cluster - the same realistic route for anyone in this field, not built around one specific job title." />
              <div style={{ marginTop: 16 }}>
                <ClusterRoadmapView r={genericRoadmap} color={clusterColor(topCluster)} />
              </div>
              <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
                <SecHead center eyebrow={`Every real degree route into ${topCluster}`} title="Degree by degree, what it leads to"
                  sub="Every UG degree and course the source data ties to this cluster, and the real roles each one actually leads to - the full breadth of this domain in one table." />
                <div style={{ marginTop: 16 }}>
                  <DegreeCourseRolesTable cluster={topCluster} color={clusterColor(topCluster)} />
                </div>
              </div>
            </div>
          )}
        </>
      ),
    },
  ];

  return sheets;
}
