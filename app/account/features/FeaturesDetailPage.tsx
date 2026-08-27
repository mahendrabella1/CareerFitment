"use client";

import { useState } from "react";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import CareerLibraryPro from "./CareerLibraryPro";
import StudyAbroad from "./StudyAbroad";
import { Icon } from "@/app/Icons";
import {
  getInternships, getWorkshops, getScholarships,
  getCompanies, getBootcamps
} from "@/lib/data/internshipsData";
import {
  getFinancialTopics, getTopicsByCategory
} from "@/lib/data/financialLiteracyData";
import {
  getLegalResources, getResourcesByCategory
} from "@/lib/data/legalResourcesData";
import { getResearchOpportunities } from "@/lib/data/researchData";
import { getAllStartups, getUnicorns } from "@/lib/data/startupsData";

export default function FeaturesDetailPage({ featureId, onClose }: { featureId: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("all");

  const renderFeature = () => {
    switch (featureId) {
      case "careers":
        return <CareerLibraryPro />;

      case "study-abroad":
        return <StudyAbroad />;

      case "exams":
        return <EntranceExamsPage />;

      case "internships":
        return <InternshipsDetailPage activeTab={activeTab} setActiveTab={setActiveTab} />;

      case "financial":
        return <FinancialLiteracyDetailPage />;

      case "legal":
        return <LegalResourcesDetailPage />;

      case "research":
        return <ResearchDetailPage />;

      case "startups":
        return <StartupsDetailPage />;

      case "resources":
        return <ScholarshipsDetailPage />;

      default:
        return <div>Feature not found</div>;
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={onClose} style={styles.closeBtn}>
        ← Back to Dashboard
      </button>
      {renderFeature()}
    </div>
  );
}

// Entrance Exams Page
function EntranceExamsPage() {
  const exams = [
    { name: "JEE Main", field: "Engineering", difficulty: "High", date: "Jan-Apr", website: "jeemain.nta.ac.in" },
    { name: "JEE Advanced", field: "Engineering", difficulty: "Very High", date: "May", website: "jeeadv.ac.in" },
    { name: "NEET", field: "Medical", difficulty: "High", date: "May", website: "neet.nta.ac.in" },
    { name: "CAT", field: "MBA", difficulty: "High", date: "Nov-Dec", website: "iimcat.ac.in" },
    { name: "GATE", field: "Engineering", difficulty: "High", date: "Feb", website: "gate.iitkgp.ac.in" },
    { name: "UPSC Civil Services", field: "Government Services", difficulty: "Very High", date: "May-Jun", website: "upsc.gov.in" },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Entrance Exams & Eligibility</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Comprehensive guide to major entrance exams, preparation resources, and eligibility criteria.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {exams.map((exam, idx) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{exam.name}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3], flexWrap: "wrap" }}>
              <span style={{ ...styles.badge, background: colors.accent[40], color: "#fff" }}>{exam.field}</span>
              <span style={{ ...styles.badge, background: exam.difficulty === "Very High" ? colors.error : colors.warning }}>{exam.difficulty}</span>
            </div>
            <p style={{ fontSize: 13, color: colors.ink[60], margin: 0, marginBottom: spacing[2] }}>Exam Date: <strong>{exam.date}</strong></p>
            <a href={`https://${exam.website}`} target="_blank" rel="noopener" style={{ fontSize: 13, color: colors.accent[40], textDecoration: "none", fontWeight: 700 }}>
              Official Website →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// Internships Detail Page
function InternshipsDetailPage({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  const internships = getInternships();
  const workshops = getWorkshops();
  const scholarships = getScholarships();
  const companies = getCompanies();
  const bootcamps = getBootcamps();

  const data = activeTab === "internships" ? internships : activeTab === "workshops" ? workshops : activeTab === "scholarships" ? scholarships : activeTab === "companies" ? companies : bootcamps;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Internships & Opportunities</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Discover 300+ internships, 100+ workshops, 200+ scholarships, and top companies hiring.
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        {["internships", "workshops", "scholarships", "companies", "bootcamps"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tabBtn,
              ...(activeTab === tab ? styles.tabBtnActive : {}),
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {data.slice(0, 20).map((item: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{item.title || item.name}</h3>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[3] }}>
              {item.description || item.provider || item.organizationName}
            </p>
            <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap", marginBottom: spacing[2] }}>
              {item.organization && <span style={{ ...styles.badge }}>{item.organization}</span>}
              {item.provider && <span style={{ ...styles.badge }}>{item.provider}</span>}
              {item.domain && <span style={{ ...styles.badge }}>{item.domain}</span>}
              {item.paid !== undefined && <span style={{ ...styles.badge, background: colors.success, color: "#fff" }}>{item.paid ? "Paid" : "Free"}</span>}
            </div>
            {item.stipend && <p style={{ fontSize: 13, fontWeight: 700, color: colors.accent[40], margin: 0 }}>₹{item.stipend.amount}/month</p>}
            {item.awardAmount && <p style={{ fontSize: 13, fontWeight: 700, color: colors.success, margin: 0 }}>₹{item.awardAmount.min}-₹{item.awardAmount.max}</p>}
            {item.salary && <p style={{ fontSize: 13, fontWeight: 700, color: colors.info, margin: 0 }}>₹{item.salary.min}-₹{item.salary.max}/month</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Financial Literacy Detail Page
function FinancialLiteracyDetailPage() {
  const topics = getFinancialTopics();
  const categories = [...new Set(topics.map((t: any) => t.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getTopicsByCategory(selectedCategory as any) : topics;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Financial Literacy</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Master 30+ topics on money management, investing, taxes, and financial planning.
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCategory(null)} style={{ ...styles.tabBtn, ...(selectedCategory === null ? styles.tabBtnActive : {}) }}>
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            style={{ ...styles.tabBtn, ...(selectedCategory === cat ? styles.tabBtnActive : {}) }}
          >
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {filtered.slice(0, 20).map((topic: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{topic.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={{ ...styles.badge }}>{topic.difficulty}</span>
              <span style={{ ...styles.badge }}>{topic.duration}</span>
            </div>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{topic.description}</p>
            <div style={{ fontSize: 12, color: colors.ink[70] }}>
              <strong>Learn:</strong> {topic.keyLearnings?.slice(0, 2).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Legal Resources Detail Page
function LegalResourcesDetailPage() {
  const resources = getLegalResources();
  const categories = [...new Set(resources.map((r: any) => r.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getResourcesByCategory(selectedCategory as any) : resources;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Legal Resources & Rights</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Know your legal rights, safety protocols, and protection measures. 20+ comprehensive guides.
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button onClick={() => setSelectedCategory(null)} style={{ ...styles.tabBtn, ...(selectedCategory === null ? styles.tabBtnActive : {}) }}>
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            style={{ ...styles.tabBtn, ...(selectedCategory === cat ? styles.tabBtnActive : {}) }}
          >
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {filtered.slice(0, 20).map((resource: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{resource.title}</h3>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{resource.description}</p>
            {resource.keyPoints && (
              <div style={{ marginBottom: spacing[2] }}>
                <strong style={{ fontSize: 12, color: colors.ink[80] }}>Key Points:</strong>
                <ul style={{ fontSize: 12, color: colors.ink[70], margin: `${spacing[1]} 0 0 ${spacing[3]}` }}>
                  {resource.keyPoints.slice(0, 2).map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {resource.helplineNumber && <p style={{ fontSize: 12, fontWeight: 700, color: colors.accent[40], margin: 0 }}>🆘 {resource.helplineNumber}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Research Detail Page
function ResearchDetailPage() {
  const opportunities = getResearchOpportunities();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Research Opportunities</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Explore 50+ cutting-edge research programs, competitions, and conferences.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {opportunities.slice(0, 20).map((opp: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{opp.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={{ ...styles.badge }}>{opp.type}</span>
              <span style={{ ...styles.badge }}>{opp.level}</span>
              <span style={{ ...styles.badge }}>{opp.field}</span>
            </div>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{opp.description}</p>
            {opp.prizes && <p style={{ fontSize: 12, fontWeight: 700, color: colors.success, margin: 0 }}>🏆 {opp.prizes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Startups Detail Page
function StartupsDetailPage() {
  const [showUnicorns, setShowUnicorns] = useState(false);
  const startups = showUnicorns ? getUnicorns() : getAllStartups();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Startup Ecosystem</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Connect with 100+ innovative startups and learn entrepreneurship from founders.
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6] }}>
        <button onClick={() => setShowUnicorns(false)} style={{ ...styles.tabBtn, ...(showUnicorns === false ? styles.tabBtnActive : {}) }}>
          All Startups
        </button>
        <button onClick={() => setShowUnicorns(true)} style={{ ...styles.tabBtn, ...(showUnicorns === true ? styles.tabBtnActive : {}) }}>
          Unicorns Only
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {startups.slice(0, 20).map((startup: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[1] }}>{startup.name}</h3>
            <p style={{ fontSize: 12, color: colors.ink[60], margin: 0, marginBottom: spacing[2] }}>Founded {startup.foundedYear} • {startup.location}</p>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={{ ...styles.badge }}>{startup.industry}</span>
              <span style={{ ...styles.badge }}>{startup.stage}</span>
              {startup.isUnicorn && <span style={{ ...styles.badge, background: colors.warning, color: "#000" }}>🦄 Unicorn</span>}
            </div>
            <p style={{ fontSize: 13, color: colors.ink[70], lineHeight: 1.5, margin: 0, marginBottom: spacing[2] }}>{startup.description}</p>
            <p style={{ fontSize: 12, fontWeight: 700, color: colors.accent[40], margin: 0 }}>Funding: ${startup.fundingRaised?.amount / 1000000 || 0}M</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scholarships Detail Page
function ScholarshipsDetailPage() {
  const scholarships = getScholarships();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: spacing[8] }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[4] }}>Scholarships & Awards</h1>
      <p style={{ fontSize: 16, color: colors.ink[60], marginBottom: spacing[6] }}>
        Access 200+ scholarship awards from government, NGOs, and private organizations.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: spacing[4] }}>
        {scholarships.slice(0, 20).map((scholarship: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `1px solid ${colors.ink[80]}`, borderRadius: radius.lg, padding: spacing[4], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2] }}>{scholarship.name}</h3>
            <p style={{ fontSize: 13, color: colors.ink[60], lineHeight: 1.5, margin: 0, marginBottom: spacing[3] }}>{scholarship.provider}</p>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              {scholarship.category && <span style={{ ...styles.badge }}>{scholarship.category}</span>}
              {scholarship.level && <span style={{ ...styles.badge }}>{scholarship.level}</span>}
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: colors.success, margin: 0 }}>
              ₹{scholarship.awardAmount?.min || 0}-₹{scholarship.awardAmount?.max || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: typography.family.sans,
    backgroundColor: colors.ink[95],
    minHeight: "100vh",
    padding: spacing[6],
  },

  closeBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    background: colors.ink[95],
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    color: colors.ink[70],
    marginBottom: spacing[6],
  },

  tabBtn: {
    padding: `${spacing[2]} ${spacing[4]}`,
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    background: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.2s",
    color: colors.ink[80],
  },

  tabBtnActive: {
    background: colors.accent[40],
    color: "#fff",
    borderColor: colors.accent[40],
  },

  badge: {
    display: "inline-block" as const,
    padding: `${spacing[1]} ${spacing[3]}`,
    fontSize: 11,
    fontWeight: 700,
    borderRadius: radius.sm,
    backgroundColor: colors.ink[90],
    color: colors.ink[80],
  },
};
