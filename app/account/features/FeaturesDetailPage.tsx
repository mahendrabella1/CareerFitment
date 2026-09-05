"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { colors, spacing, typography, radius, shadows } from "@/app/account/designTokens";
import StudyAbroad from "./StudyAbroad";
import { Icon } from "@/app/Icons";
import {
  getInternships, getWorkshops, getScholarships
} from "@/lib/data/internshipsData";
import {
  getFinancialTopics, getTopicsByCategory
} from "@/lib/data/financialLiteracyData";
import {
  getLegalResources, getResourcesByCategory
} from "@/lib/data/legalResourcesData";
import { getResearchOpportunities } from "@/lib/data/researchData";
import { getAllStartups, getUnicorns } from "@/lib/data/startupsData";

// Unified Feature Design System
const FEATURE_CONFIG = {
  careers: {
    title: "Career Opportunities",
    subtitle: "Explore 900+ careers with detailed information on roles, salaries, education, and growth paths.",
    accentColor: "#8B5CF6", // Purple
    borderColor: "#DDD6FE",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_49_20-AM.png",
  },
  research: {
    title: "Research Opportunities",
    subtitle: "Explore 50+ cutting-edge research programs, competitions, and conferences.",
    accentColor: "#14B8A6", // Teal
    borderColor: "#CCFBF1",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_40_43-AM.png",
  },
  internships: {
    title: "Internships & Opportunities",
    subtitle: "Discover 300+ internships, 100+ workshops, and 200+ scholarships available nationwide.",
    accentColor: "#3B82F6", // Blue
    borderColor: "#DBEAFE",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-11_02_22-AM.png",
  },
  resources: {
    title: "Scholarships & Awards",
    subtitle: "Access 200+ scholarship awards from government, NGOs, and private organizations.",
    accentColor: "#10B981", // Green
    borderColor: "#D1FAE5",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_59_10-AM.png",
  },
  "study-abroad": {
    title: "Study Abroad",
    subtitle: "Discover top universities across 20+ countries with scholarship opportunities.",
    accentColor: "#F97316", // Orange
    borderColor: "#FFEDD5",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_46_05-AM.png",
  },
  financial: {
    title: "Financial Literacy",
    subtitle: "Master 30+ topics on money management, investing, taxes, and financial planning.",
    accentColor: "#F59E0B", // Gold
    borderColor: "#FEF3C7",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_41_34-AM.png",
  },
  legal: {
    title: "Legal Resources & Rights",
    subtitle: "Know your legal rights, safety protocols, and protection measures. 20+ comprehensive guides.",
    accentColor: "#64748B", // Dark slate
    borderColor: "#E2E8F0",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_42_40-AM.png",
  },
  startups: {
    title: "Startup Ecosystem",
    subtitle: "Connect with 100+ innovative startups and learn entrepreneurship from founders.",
    accentColor: "#EF4444", // Red
    borderColor: "#FEE2E2",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_39_45-AM.png",
  },
  exams: {
    title: "Entrance Exams & Eligibility",
    subtitle: "Comprehensive guide to major entrance exams, preparation resources, and eligibility criteria.",
    accentColor: "#1E3A8A", // Navy
    borderColor: "#DBEAFE",
    image: "https://onegrasp.com/wp-content/uploads/2026/08/ChatGPT-Image-Aug-27-2026-10_54_06-AM.png",
  },
};

export default function FeaturesDetailPage({ featureId, onClose }: { featureId: string; onClose: () => void }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("internships");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  useEffect(() => {
    if (featureId === "careers") {
      router.push("/account/career-library");
    }
  }, [featureId, router]);

  const renderFeature = () => {
    switch (featureId) {
      case "careers":
        return <div style={{ padding: "48px", textAlign: "center", color: "#64748b" }}>Redirecting to Career Library...</div>;

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
      <button type="button" onClick={onClose} style={styles.closeBtn}>
        ← Back to Dashboard
      </button>
      {renderFeature()}
    </div>
  );
}

// Entrance Exams Page
function EntranceExamsPage() {
  const config = FEATURE_CONFIG.exams;
  const exams = [
    {
      name: "JEE Main",
      field: "Engineering",
      difficulty: "High",
      examDates: "Jan, Apr, Jul, Oct",
      regDeadline: "3 weeks before exam",
      duration: "3 hours",
      questions: "90 MCQs",
      syllabus: "Physics, Chemistry, Mathematics",
      prepTime: "12-18 months",
      topColleges: ["NIT Trichy", "NIT Warangal", "BITS Pilani", "Delhi Tech"],
      website: "jeemain.nta.ac.in",
      resources: ["NCERT Books", "Previous Year Papers", "Online Coaching: Unacademy, Physics Wallah"]
    },
    {
      name: "JEE Advanced",
      field: "Engineering",
      difficulty: "Very High",
      examDates: "June",
      regDeadline: "May",
      duration: "3 hours (2 papers)",
      questions: "162 MCQs + Numeric",
      syllabus: "Advanced Physics, Chemistry, Mathematics",
      prepTime: "18-24 months",
      topColleges: ["IIT Bombay", "IIT Delhi", "IIT Kanpur", "IIT Madras"],
      website: "jeeadv.ac.in",
      resources: ["Advanced Level Books", "JEE Advanced Papers", "Coaching: Resonance, Aakash"]
    },
    {
      name: "NEET",
      field: "Medical",
      difficulty: "High",
      examDates: "May",
      regDeadline: "March",
      duration: "3 hours",
      questions: "180 MCQs",
      syllabus: "Biology, Chemistry, Physics (11-12 NCERT)",
      prepTime: "12-18 months",
      topColleges: ["AIIMS", "CMC Vellore", "JIPMER", "MAMC Delhi"],
      website: "neet.nta.ac.in",
      resources: ["NCERT Biology", "Coaching: Allen, Aakash", "Online: Vedantu, Byju's"]
    },
    {
      name: "CAT (MBA Entrance)",
      field: "MBA",
      difficulty: "High",
      examDates: "November",
      regDeadline: "September",
      duration: "2 hours",
      questions: "66 questions",
      syllabus: "Quant, VARC, DILR",
      prepTime: "6-12 months",
      topColleges: ["IIM ABC", "XLRI Jamshedpur", "ISB Hyderabad", "NMIMS"],
      website: "iimcat.ac.in",
      resources: ["Official CAT Guide", "Coaching: TIME, Career Launcher", "Mock Tests"]
    },
    {
      name: "GATE (Engineering Post-Grad)",
      field: "Engineering Masters",
      difficulty: "High",
      examDates: "February",
      regDeadline: "December",
      duration: "3 hours",
      questions: "65 questions",
      syllabus: "BE/BTech Core + Advanced topics",
      prepTime: "4-6 months",
      topColleges: ["IIT Bombay", "IIT Kharagpur", "IIT Madras", "IISc Bangalore"],
      website: "gate.iitkgp.ac.in",
      resources: ["NPTEL Videos", "Made Easy/Ace Academy", "Previous Papers"]
    },
    {
      name: "UPSC Civil Services",
      field: "Government Services",
      difficulty: "Very High",
      examDates: "June (Prelims)",
      regDeadline: "February",
      duration: "Multiple stages",
      questions: "200 (Prelims)",
      syllabus: "General Studies, Optional Subject",
      prepTime: "12-24 months",
      topColleges: ["LBSNAA Mussoorie", "Delhi University", "Lucknow University"],
      website: "upsc.gov.in",
      resources: ["Lucent's History", "Coaching: Vision IAS, Byju's", "Newspaper Reading"]
    },
    {
      name: "BITSAT",
      field: "Engineering/Science",
      difficulty: "High",
      examDates: "May-Jun",
      regDeadline: "March",
      duration: "3 hours",
      questions: "130 MCQs",
      syllabus: "JEE Main Level",
      prepTime: "10-15 months",
      topColleges: ["BITS Pilani", "BITS Hyderabad", "BITS Dubai"],
      website: "bitsadmission.com",
      resources: ["NCERT Books", "JEE prep materials", "Official BITSAT Guide"]
    },
    {
      name: "CLAT (Law Entrance)",
      field: "Law",
      difficulty: "High",
      examDates: "December",
      regDeadline: "October",
      duration: "2 hours",
      questions: "120 MCQs",
      syllabus: "Legal Reasoning, Quantitative, English",
      prepTime: "6-9 months",
      topColleges: ["Delhi University Law", "Gujarat National Law", "NALSAR Hyderabad"],
      website: "consortiumofnlus.ac.in",
      resources: ["Legal Awareness Books", "Coaching: Legalstudy.in", "Mock Papers"]
    },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: spacing[5] }}>
        {exams.map((exam, idx) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm, transition: "all 0.3s" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, marginBottom: spacing[2], color: colors.ink[10] }}>{exam.name}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3], flexWrap: "wrap" }}>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>{exam.field}</span>
              <span style={{ ...styles.badge, background: exam.difficulty === "Very High" ? "#DC2626" : "#FBBF24", color: "#000" }}>{exam.difficulty}</span>
            </div>

            <div style={{ fontSize: 13, color: colors.ink[30], lineHeight: 1.7, marginBottom: spacing[3] }}>
              <p style={{ margin: "4px 0" }}>📅 <strong>Exam:</strong> {exam.examDates}</p>
              <p style={{ margin: "4px 0" }}>⏱️ <strong>Duration:</strong> {exam.duration}</p>
              <p style={{ margin: "4px 0" }}>📝 <strong>Format:</strong> {exam.questions}</p>
              <p style={{ margin: "4px 0" }}>📚 <strong>Prep:</strong> {exam.prepTime}</p>
              <p style={{ margin: "4px 0" }}>🎓 <strong>Colleges:</strong> {exam.topColleges.slice(0, 2).join(", ")}</p>
            </div>

            <div style={{ borderTop: `1px solid ${config.borderColor}`, paddingTop: spacing[3], marginBottom: spacing[3] }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: config.accentColor, margin: "0 0 6px 0" }}>📖 Resources:</p>
              <p style={{ fontSize: 12, color: colors.ink[30], margin: 0, lineHeight: 1.6 }}>{exam.resources.slice(0, 2).join(" • ")}</p>
            </div>

            <a href={`https://${exam.website}`} target="_blank" rel="noopener" style={{ fontSize: 13, color: config.accentColor, textDecoration: "none", fontWeight: 700, display: "inline-block" }}>
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
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const config = FEATURE_CONFIG.internships;
  const internships = getInternships();
  const workshops = getWorkshops();
  const scholarships = getScholarships();

  const data = activeTab === "internships" ? internships : activeTab === "workshops" ? workshops : scholarships;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const paginatedData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap" }}>
          {["internships", "workshops", "scholarships"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              style={{
                ...styles.tabBtn,
                ...(activeTab === tab ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}),
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({(tab === "internships" ? getInternships() : tab === "workshops" ? getWorkshops() : getScholarships()).length})
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: colors.ink[30], fontWeight: 600 }}>
          Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, data.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, data.length)} of {data.length}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: spacing[5] }}>
        {paginatedData.map((item: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2], color: colors.ink[10] }}>{item.title || item.name}</h3>
            <p style={{ fontSize: 14, color: colors.ink[30], lineHeight: 1.6, margin: 0, marginBottom: spacing[3] }}>
              {item.description || item.provider || item.organizationName}
            </p>
            <div style={{ display: "flex", gap: spacing[2], flexWrap: "wrap", marginBottom: spacing[3] }}>
              {item.organization && <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>{item.organization}</span>}
              {item.provider && <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>{item.provider}</span>}
              {item.domain && <span style={{ ...styles.badge }}>{item.domain}</span>}
              {item.paid !== undefined && <span style={{ ...styles.badge, backgroundColor: item.paid ? "#10B981" : "#6B7280", color: "#fff" }}>{item.paid ? "💰 Paid" : "Free"}</span>}
            </div>
            {item.stipend && <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>💵 ₹{item.stipend.amount}/month</p>}
            {item.awardAmount && <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>🏆 ₹{item.awardAmount.min}-₹{item.awardAmount.max}</p>}
            {item.salary && <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>💼 ₹{item.salary.min}-₹{item.salary.max}/month</p>}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: spacing[3], marginTop: spacing[8], flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ ...styles.tabBtn, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink[30], minWidth: '120px', textAlign: 'center' }}>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ ...styles.tabBtn, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

// Financial Literacy Detail Page
function FinancialLiteracyDetailPage() {
  const config = FEATURE_CONFIG.financial;
  const topics = getFinancialTopics();
  const categories = [...new Set(topics.map((t: any) => t.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getTopicsByCategory(selectedCategory as any) : topics;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button type="button" onClick={() => setSelectedCategory(null)} style={{ ...styles.tabBtn, ...(selectedCategory === null ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}>
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat as any)}
            style={{ ...styles.tabBtn, ...(selectedCategory === cat ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}
          >
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: spacing[5] }}>
        {filtered.slice(0, 20).map((topic: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2], color: colors.ink[10] }}>{topic.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3] }}>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#000" }}>📚 {topic.difficulty}</span>
              <span style={{ ...styles.badge, background: config.borderColor, color: colors.ink[80] }}>⏱️ {topic.duration}</span>
            </div>
            <p style={{ fontSize: 14, color: colors.ink[30], lineHeight: 1.6, margin: 0, marginBottom: spacing[3] }}>{topic.description}</p>
            <div style={{ fontSize: 12, color: colors.ink[30], lineHeight: 1.5 }}>
              <strong>🎓 Learn:</strong> {topic.keyLearnings?.slice(0, 2).join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Legal Resources Detail Page
function LegalResourcesDetailPage() {
  const config = FEATURE_CONFIG.legal;
  const resources = getLegalResources();
  const categories = [...new Set(resources.map((r: any) => r.category))];
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const filtered = selectedCategory ? getResourcesByCategory(selectedCategory as any) : resources;

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6], flexWrap: "wrap" }}>
        <button type="button" onClick={() => setSelectedCategory(null)} style={{ ...styles.tabBtn, ...(selectedCategory === null ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}>
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat as any)}
            style={{ ...styles.tabBtn, ...(selectedCategory === cat ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}
          >
            {(cat as string).replace(/_/g, " ").toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: spacing[5] }}>
        {filtered.slice(0, 20).map((resource: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2], color: colors.ink[10] }}>{resource.title}</h3>
            <p style={{ fontSize: 14, color: colors.ink[30], lineHeight: 1.6, margin: 0, marginBottom: spacing[3] }}>{resource.description}</p>
            {resource.keyPoints && (
              <div style={{ marginBottom: spacing[3] }}>
                <strong style={{ fontSize: 12, color: config.accentColor }}>⚖️ Key Points:</strong>
                <ul style={{ fontSize: 12, color: colors.ink[30], margin: `${spacing[1]} 0 0 ${spacing[3]}`, paddingLeft: spacing[3] }}>
                  {resource.keyPoints.slice(0, 2).map((point: string, i: number) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            {resource.helplineNumber && <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>🆘 {resource.helplineNumber}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Research Detail Page
function ResearchDetailPage() {
  const config = FEATURE_CONFIG.research;
  const opportunities = getResearchOpportunities();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: spacing[5] }}>
        {opportunities.slice(0, 20).map((opp: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[2], color: colors.ink[10] }}>{opp.title}</h3>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3], flexWrap: "wrap" }}>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>📌 {opp.type}</span>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>📍 {opp.level}</span>
              <span style={{ ...styles.badge, background: config.borderColor, color: colors.ink[80] }}>🔬 {opp.field}</span>
            </div>
            <p style={{ fontSize: 14, color: colors.ink[30], lineHeight: 1.6, margin: 0, marginBottom: spacing[3] }}>{opp.description}</p>
            {opp.prizes && <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>🏆 {opp.prizes}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

// Startups Detail Page
function StartupsDetailPage() {
  const config = FEATURE_CONFIG.startups;
  const [showUnicorns, setShowUnicorns] = useState(false);
  const startups = showUnicorns ? getUnicorns() : getAllStartups();

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[6] }}>
        <button type="button" onClick={() => setShowUnicorns(false)} style={{ ...styles.tabBtn, ...(showUnicorns === false ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}>
          All Startups
        </button>
        <button type="button" onClick={() => setShowUnicorns(true)} style={{ ...styles.tabBtn, ...(showUnicorns === true ? { ...styles.tabBtnActive, background: config.accentColor, borderColor: config.accentColor } : {}) }}>
          🦄 Unicorns Only
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: spacing[5] }}>
        {startups.slice(0, 20).map((startup: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[1], color: colors.ink[10] }}>{startup.name}</h3>
            <p style={{ fontSize: 13, color: colors.ink[20], margin: 0, marginBottom: spacing[3] }}>📅 Founded {startup.foundedYear} • 📍 {startup.location}</p>
            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3], flexWrap: "wrap" }}>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>{startup.industry}</span>
              <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>{startup.stage}</span>
              {startup.isUnicorn && <span style={{ ...styles.badge, background: "#FCD34D", color: "#000", fontWeight: 800 }}>🦄 Unicorn</span>}
            </div>
            <p style={{ fontSize: 14, color: colors.ink[30], lineHeight: 1.6, margin: 0, marginBottom: spacing[3] }}>{startup.description}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: config.accentColor, margin: 0 }}>💰 Funding: ${startup.fundingRaised?.amount / 1000000 || 0}M</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Scholarships Detail Page
function ScholarshipsDetailPage() {
  const config = FEATURE_CONFIG.resources;
  const scholarships = getScholarships();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const totalPages = Math.ceil(scholarships.length / ITEMS_PER_PAGE);
  const paginatedData = scholarships.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: `${spacing[8]} ${spacing[4]}` }}>
      {config.image && (
        <div style={{ marginBottom: spacing[6], borderRadius: radius.lg, overflow: "hidden", maxHeight: "320px" }}>
          <img src={config.image} alt={config.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      )}
      <h1 style={{ fontSize: 36, fontWeight: 800, marginBottom: spacing[2], color: colors.ink[10] }}>{config.title}</h1>
      <p style={{ fontSize: 16, color: colors.ink[20], marginBottom: spacing[6] }}>
        {config.subtitle}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: spacing[6], flexWrap: "wrap", gap: spacing[3] }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink[30] }}>
          Showing <span style={{ fontWeight: 800, color: config.accentColor }}>{Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, scholarships.length)}-{Math.min(currentPage * ITEMS_PER_PAGE, scholarships.length)}</span> of <span style={{ fontWeight: 800, color: config.accentColor }}>{scholarships.length}</span> scholarships
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: spacing[5] }}>
        {paginatedData.map((scholarship: any, idx: number) => (
          <div key={idx} style={{ background: "#fff", border: `2px solid ${config.borderColor}`, borderRadius: radius.lg, padding: spacing[5], boxShadow: shadows.sm, display: "flex", flexDirection: "column" }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, marginBottom: spacing[1], color: colors.ink[10] }}>{scholarship.name}</h3>
            <p style={{ fontSize: 13, color: colors.ink[20], margin: 0, marginBottom: spacing[3] }}>🏢 {scholarship.provider}</p>

            <div style={{ display: "flex", gap: spacing[2], marginBottom: spacing[3], flexWrap: "wrap" }}>
              {scholarship.category && <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>📁 {scholarship.category}</span>}
              {scholarship.level && <span style={{ ...styles.badge, backgroundColor: config.accentColor, color: "#fff" }}>🎓 {scholarship.level}</span>}
            </div>

            {scholarship.description && (
              <p style={{ fontSize: 13, color: colors.ink[30], lineHeight: 1.5, margin: "0 0 8px 0" }}>
                {scholarship.description}
              </p>
            )}

            <div style={{ marginTop: "auto", paddingTop: spacing[3], borderTop: `1px solid ${config.borderColor}` }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: config.accentColor, margin: 0 }}>
                💵 ₹{scholarship.awardAmount?.min || scholarship.awardAmount || 0}-₹{scholarship.awardAmount?.max || scholarship.awardAmount || 0}
              </p>
              {scholarship.deadline && (
                <p style={{ fontSize: 12, color: colors.ink[30], margin: "6px 0 0 0" }}>
                  ⏱️ Deadline: {scholarship.deadline}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: spacing[3], marginTop: spacing[8], flexWrap: "wrap" }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            style={{ ...styles.tabBtn, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
          >
            ← Previous
          </button>
          <div style={{ fontSize: 14, fontWeight: 600, color: colors.ink[30], minWidth: '120px', textAlign: 'center' }}>
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            style={{ ...styles.tabBtn, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
          >
            Next →
          </button>
        </div>
      )}
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
    color: colors.ink[30],
    marginBottom: spacing[6],
    pointerEvents: "auto" as const,
    userSelect: "none" as const,
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
    pointerEvents: "auto" as const,
    userSelect: "none" as const,
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
