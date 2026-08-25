"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { AssessmentSummary, UserProfile } from "@/lib/auth/AuthProvider";
import { Logo } from "@/app/Logo";
import dynamic from "next/dynamic";
import { Icon } from "@/app/Icons";

const FullReport = dynamic(() => import("@/app/account/FullReport"), {
  ssr: false,
  loading: () => <div style={{ padding: 48, textAlign: "center", color: "#64748b", fontSize: 14 }}>Preparing your report…</div>,
});

export interface ExtraSection {
  id: string;
  label: string;
  icon: string;
  node: ReactNode;
  before?: string;
  inFullReport?: boolean;
  reportNode?: ReactNode;
}

const MENU_ITEMS = [
  { title: "Dashboard", icon: "clusters" },
  { title: "Career Analysis", icon: "compass" },
  { title: "India Colleges", icon: "route" },
  { title: "Abroad Colleges", icon: "compass" },
  { title: "Abroad Applications", icon: "route" },
  { title: "Exams", icon: "explain" },
  { title: "Career Library", icon: "library" },
  { title: "Career Boosters", icon: "star" },
  { title: "Research", icon: "pulse" },
  { title: "Startups", icon: "star" },
  { title: "Financial Literacy", icon: "heart" },
];

const MODULES = [
  { title: "Get Your Website", desc: "Publish your Personal Website in 15 Min", icon: "route", color: "#F59E0B" },
  { title: "Inner Circle Post", desc: "Post what's in your Mind and Achievements", icon: "clusters", color: "#2D7FF0" },
  { title: "Alumni Connections", desc: "Connect directly to your Batchmates and Alumni", icon: "star", color: "#db3433" },
  { title: "India Colleges", desc: "Access to 10000+ Indian colleges with admission insights and course information.", icon: "route", color: "#27AE60" },
  { title: "Online India Admissions", desc: "Your trusted gateway to India's top colleges – explore, compare, and secure admissions.", icon: "explain", color: "#11998E" },
  { title: "Abroad Colleges", desc: "Access to 8000+ top International universities across 22+ countries.", icon: "compass", color: "#6366F1" },
  { title: "Abroad Applications", desc: "Get done your study abroad profiling. Submit applications directly to universities.", icon: "route", color: "#2D9CDB" },
  { title: "Exams", desc: "Entrance Test information for getting admission into various degree courses.", icon: "explain", color: "#F59E0B" },
  { title: "Career Library", desc: "Get complete career information of 3000+ career options with guidance.", icon: "library", color: "#9B51E0" },
  { title: "Career Boosters", desc: "Best deals and programs from industry for your education and career path.", icon: "star", color: "#27AE60" },
  { title: "Online Courses", desc: "Unlimited access to online courses and skills for personal development.", icon: "library", color: "#2D7FF0" },
  { title: "Scholarships", desc: "Get access to scholarships available for school and college students.", icon: "star", color: "#F59E0B" },
];

export default function Dashboard({
  a, profile, email, onSignOut, extraSections = []
}: {
  a: AssessmentSummary;
  profile?: UserProfile | null;
  email?: string | null;
  onSignOut?: () => void;
  extraSections?: any[]
}) {
  const [view, setView] = useState<"dashboard" | "report">("dashboard");

  const name = (profile?.name || "").trim();
  const firstName = name.split(/\s+/)[0] || "there";
  const initial = (name || email || "?").trim().charAt(0).toUpperCase();

  if (view === "report") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff" }}>
        <div style={{ borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => { setView("dashboard"); window.scrollTo(0, 0); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#6b7280", fontWeight: 500, fontSize: "14px" }}>
            <Icon name="chevronLeft" size={16} /> Back to dashboard
          </button>
          <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px", color: "#6b7280", fontSize: "14px" }}>
            <Icon name="bell" size={14} /> A PDF copy has been emailed to you
          </span>
        </div>
        <FullReport a={a} name={name} extraSheets={[]} />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {/* SIDEBAR */}
      <div style={{ width: 256, borderRight: "1px solid #e5e7eb", background: "#fff", padding: "24px", position: "fixed", height: "100vh", overflowY: "auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
            <Logo height={30} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "8px", background: "#f3f4f6" }}>
            <div style={{ width: 40, height: 40, borderRadius: "9999px", background: "#db3433", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: "bold", fontSize: "14px" }}>{initial}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "600", fontSize: "14px", color: "#000" }}>{firstName}</div>
              <div style={{ fontSize: "12px", color: "#6b7280" }}>Profile</div>
            </div>
          </div>
        </div>

        <nav style={{ marginBottom: "32px" }}>
          {MENU_ITEMS.map((item) => (
            <button key={item.title} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "transparent", color: "#374151", cursor: "pointer", fontSize: "14px", fontWeight: "500", marginBottom: "4px", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <Icon name={item.icon} size={20} style={{ color: "#9ca3af" }} />
              <span>{item.title}</span>
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "16px" }}>
          <button onClick={onSignOut} style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderRadius: "8px", border: "none", background: "transparent", color: "#374151", cursor: "pointer", fontSize: "14px", fontWeight: "500", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f3f4f6"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            <Icon name="power" size={20} style={{ color: "#9ca3af" }} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, marginLeft: 256 }}>
        {/* HEADER */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#000", margin: 0 }}>Welcome back, {firstName}</h1>
              <p style={{ fontSize: "16px", color: "#6b7280", marginTop: "8px", margin: 0 }}>Explore your career path and discover opportunities</p>
            </div>
            <div style={{ width: 48, height: 48, borderRadius: "9999px", background: "#db3433" }}></div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div style={{ padding: "32px", maxWidth: "100%" }}>
          {/* MODULES GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", marginBottom: "32px" }}>
            {MODULES.map((module) => (
              <div key={module.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "12px", background: `${module.color}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={module.icon} size={28} style={{ color: module.color }} />
                  </div>
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#000", margin: 0, marginBottom: "8px" }}>{module.title}</h3>
                <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.5", flex: 1, margin: 0 }}>{module.desc}</p>
                <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "600", color: module.color }}>
                  Start Now
                  <Icon name="chevronRight" size={16} />
                </div>
              </div>
            ))}
          </div>

          {/* COUNSELLING SECTION */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Icon name="star" size={24} style={{ color: "#db3433" }} />
              </div>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", color: "#000", margin: 0, marginBottom: "8px" }}>Have a question about your future?</h3>
              <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", margin: 0, marginBottom: "24px" }}>Talk to a OneGrasp counsellor — we'll help you read your report, pick subjects, and plan your next steps.</p>
              <a href="https://wa.me/918977760443" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#db3433", color: "#fff", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "600", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#b82a2b"} onMouseLeave={(e) => e.currentTarget.style.background = "#db3433"}>
                <Icon name="star" size={16} /> Ask a counsellor
              </a>
            </div>

            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px" }}>
              <a href="https://wa.me/918977760443" target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb", textDecoration: "none", marginBottom: "12px", transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <Icon name="clusters" size={20} style={{ color: "#22c55e", flexShrink: 0 }} />
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#000" }}>WhatsApp</div>
              </a>
              <a href="tel:8977760443" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb", textDecoration: "none", marginBottom: "12px", transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <Icon name="clusters" size={20} style={{ color: "#3b82f6", flexShrink: 0 }} />
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#000" }}>8977760443</div>
              </a>
              <a href="mailto:support@onegrasp.com" style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "8px", border: "1px solid #e5e7eb", textDecoration: "none", transition: "background 0.2s", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}>
                <Icon name="clusters" size={20} style={{ color: "#db3433", flexShrink: 0 }} />
                <div style={{ fontSize: "14px", fontWeight: "600", color: "#000" }}>Email support</div>
              </a>
            </div>
          </div>

          {/* VIEW FULL REPORT BUTTON */}
          <div style={{ textAlign: "center", marginTop: "48px", paddingBottom: "32px" }}>
            <button onClick={() => setView("report")} style={{ background: "#db3433", color: "#fff", border: "none", padding: "12px 32px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#b82a2b"} onMouseLeave={(e) => e.currentTarget.style.background = "#db3433"}>
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
