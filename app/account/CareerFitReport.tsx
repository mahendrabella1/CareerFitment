"use client";

/**
 * Career Fit Report — Focused, shorter career recommendations
 *
 * Purpose: "What careers are most suitable for me?"
 *
 * Sections:
 * - Cover/Title
 * - Best Career Clusters
 * - Recommended Careers (top 10)
 * - Why You Fit
 * - Important Skills
 * - Suggested Subjects
 * - Educational Pathways
 * - Next Steps
 */

import { useRef, type ReactNode } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { Icon } from "@/app/Icons";
import { C, Ring, dimColor } from "@/app/account/viz";
import { archetype, domainFit } from "@/lib/report/knowledge";
import { CSSProperties } from "react";

type Meta = { label: string; icon: string; color: string };
const CLUSTERS: Record<string, Meta> = {
  tech: { label: "Technology", icon: "laptop", color: "#2196F3" },
  business: { label: "Business", icon: "briefcase", color: "#FF9800" },
  healthcare: { label: "Healthcare", icon: "medical", color: "#4CAF50" },
  creative: { label: "Creative", icon: "palette", color: "#E91E63" },
  education: { label: "Education", icon: "book", color: "#673AB7" },
  science: { label: "Science", icon: "flask", color: "#009688" },
  social: { label: "Social", icon: "people", color: "#F44336" },
  engineering: { label: "Engineering", icon: "blueprint", color: "#795548" },
};

const CSS = `
.cfr { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9f9fa; }
.cfr-sheet { background: white; page-break-after: always; page-break-inside: avoid; }

.cfr-header { padding: 48px 40px; border-bottom: 1px solid #ececef; }
.cfr-logo { font-size: 18px; font-weight: 700; color: #db3433; margin-bottom: 24px; }
.cfr-title { font-size: 32px; font-weight: 700; line-height: 1.2; margin: 0 0 12px; color: #0f0f13; }
.cfr-subtitle { font-size: 14px; color: #63636f; margin: 0; }

.cfr-cover { padding: 48px 40px; text-align: center; }
.cfr-cover-badge { display: inline-block; padding: 6px 12px; background: #fef0f0; color: #db3433; font-size: 12px; font-weight: 600; border-radius: 4px; margin-bottom: 24px; }
.cfr-cover-title { font-size: 40px; font-weight: 800; margin: 0 0 16px; color: #0f0f13; }
.cfr-cover-lede { font-size: 16px; color: #63636f; margin: 0 0 32px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; }

.cfr-content { padding: 40px; max-width: 900px; }

.cfr-section { margin-bottom: 40px; page-break-inside: avoid; }
.cfr-section-title { font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #0f0f13; padding-bottom: 12px; border-bottom: 2px solid #db3433; }
.cfr-section-subtitle { font-size: 14px; color: #63636f; margin: 0 0 20px; }

.cfr-cluster-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.cfr-cluster-card { padding: 20px; border: 1px solid #ececef; border-radius: 8px; text-align: center; background: #f9f9fa; }
.cfr-cluster-card-icon { font-size: 32px; margin-bottom: 8px; }
.cfr-cluster-card-name { font-size: 16px; font-weight: 600; color: #0f0f13; margin: 0; }
.cfr-cluster-card-fit { font-size: 12px; color: #63636f; margin: 4px 0 0; }

.cfr-career-list { display: flex; flex-direction: column; gap: 12px; }
.cfr-career-item { padding: 16px; border: 1px solid #ececef; border-radius: 6px; display: flex; gap: 12px; align-items: flex-start; }
.cfr-career-rank { font-size: 18px; font-weight: 700; color: #db3433; min-width: 30px; text-align: center; }
.cfr-career-content { flex: 1; }
.cfr-career-name { font-size: 16px; font-weight: 600; color: #0f0f13; margin: 0 0 4px; }
.cfr-career-fit { font-size: 12px; color: #63636f; margin: 0; }

.cfr-skills-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.cfr-skill-badge { padding: 8px 12px; background: #f3f3f5; border-radius: 4px; font-size: 13px; color: #0f0f13; }

.cfr-subjects-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; }
.cfr-subject-card { padding: 12px 16px; background: #fef0f0; border: 1px solid #f5d5d5; border-radius: 6px; font-size: 13px; color: #0f0f13; font-weight: 600; }

.cfr-pathway { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #ececef; }
.cfr-pathway-title { font-size: 14px; font-weight: 600; color: #0f0f13; margin: 0 0 8px; }
.cfr-pathway-steps { font-size: 13px; color: #63636f; line-height: 1.6; margin: 0; }

.cfr-footer { padding: 40px; background: #f9f9fa; border-top: 1px solid #ececef; text-align: center; }
.cfr-footer-text { font-size: 13px; color: #63636f; margin: 0; }

.cfr-page-num { font-size: 12px; color: #9a9aa6; text-align: center; margin-top: 24px; page-break-inside: avoid; }
`;

export default function CareerFitReport({
  a,
  name,
}: {
  a: AssessmentSummary;
  name?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  const fits = domainFit(a);
  const arch = archetype(a);
  const topThreeClusters = fits.slice(0, 3);

  // Mock career recommendations (in real implementation, fetch from Career Library)
  const recommendedCareers = [
    { rank: 1, name: "Software Developer", fit: 87, description: "Build applications and systems" },
    { rank: 2, name: "Data Scientist", fit: 82, description: "Extract insights from data" },
    { rank: 3, name: "Product Manager", fit: 78, description: "Lead product strategy" },
    { rank: 4, name: "UX Designer", fit: 75, description: "Design user experiences" },
    { rank: 5, name: "Machine Learning Engineer", fit: 81, description: "Build AI systems" },
    { rank: 6, name: "Cloud Architect", fit: 76, description: "Design cloud infrastructure" },
    { rank: 7, name: "Cybersecurity Analyst", fit: 72, description: "Protect systems and data" },
    { rank: 8, name: "Tech Lead", fit: 79, description: "Lead engineering teams" },
    { rank: 9, name: "DevOps Engineer", fit: 74, description: "Manage deployment systems" },
    { rank: 10, name: "Solutions Architect", fit: 73, description: "Design technical solutions" },
  ];

  const suggestedSubjects = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Information Technology",
    "Statistics",
    "English",
  ];

  const importantSkills = [
    "Problem Solving",
    "Coding",
    "Data Analysis",
    "Communication",
    "Team Collaboration",
    "Critical Thinking",
    "Adaptability",
    "Technical Writing",
  ];

  const first = (name || "").trim().split(/\s+/)[0] || "you";

  return (
    <div ref={root} className="cfr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* COVER */}
      <section className="cfr-sheet cfr-cover">
        <div className="cfr-cover-badge">Career Fit · Career Recommendations</div>
        <h1 className="cfr-cover-title">Careers That Fit You</h1>
        <p className="cfr-cover-lede">
          A focused guide to career fields, roles, and pathways that align with your strengths, interests, and
          potential.
        </p>
        <div style={{ marginTop: 40 }}>
          <p style={{ fontSize: 14, color: C.ink3, margin: "0 0 12px" }}>Prepared for</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: C.ink, margin: "0" }}>{name || "You"}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="cfr-sheet cfr-content">
        {/* Your Profile */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Your Profile</h2>
          <p style={{ fontSize: 14, color: C.ink3, margin: 0, lineHeight: 1.6 }}>
            You are a <b>{arch.name}</b>. {arch.tagline}
          </p>
        </div>

        {/* Best Career Clusters */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Best Career Clusters For You</h2>
          <div className="cfr-cluster-grid">
            {topThreeClusters.map((cluster, idx) => (
              <div key={cluster.name} className="cfr-cluster-card">
                <div className="cfr-cluster-card-icon">
                  {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                </div>
                <h3 className="cfr-cluster-card-name">{cluster.name}</h3>
                <p className="cfr-cluster-card-fit">{cluster.fit}% match</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: C.ink3, margin: "16px 0 0" }}>
            These three fields offer the strongest alignment with your assessment profile.
          </p>
        </div>

        {/* Top 10 Recommended Careers */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Top 10 Recommended Careers</h2>
          <p className="cfr-section-subtitle">Ranked by fit to your profile</p>
          <div className="cfr-career-list">
            {recommendedCareers.map((career) => (
              <div key={career.rank} className="cfr-career-item">
                <div className="cfr-career-rank">#{career.rank}</div>
                <div className="cfr-career-content">
                  <p className="cfr-career-name">{career.name}</p>
                  <p className="cfr-career-fit">{career.description}</p>
                  <p style={{ fontSize: 12, margin: "4px 0 0", color: "#db3433", fontWeight: 600 }}>
                    {career.fit}% fit
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Skills */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Important Skills to Develop</h2>
          <p className="cfr-section-subtitle">Start building these now</p>
          <div className="cfr-skills-grid">
            {importantSkills.map((skill) => (
              <div key={skill} className="cfr-skill-badge">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Subjects */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Suggested Subjects</h2>
          <p className="cfr-section-subtitle">Focus on these in Class 11-12</p>
          <div className="cfr-subjects-grid">
            {suggestedSubjects.map((subject) => (
              <div key={subject} className="cfr-subject-card">
                {subject}
              </div>
            ))}
          </div>
        </div>

        {/* Educational Pathways */}
        <div className="cfr-section">
          <h2 className="cfr-section-title">Educational Pathways</h2>
          <p className="cfr-section-subtitle">Different routes to reach these careers</p>

          <div className="cfr-pathway">
            <p className="cfr-pathway-title">🎓 Undergraduate Degree (4 years)</p>
            <p className="cfr-pathway-steps">
              Bachelor's in Computer Science, IT, or Engineering. Most common path. Leads to entry-level roles.
              Recommended for {first}.
            </p>
          </div>

          <div className="cfr-pathway">
            <p className="cfr-pathway-title">📚 Diploma Programs (2-3 years)</p>
            <p className="cfr-pathway-steps">
              Faster alternative. Focus on practical skills. Good for immediate employment. Can later pursue
              degree.
            </p>
          </div>

          <div className="cfr-pathway">
            <p className="cfr-pathway-title">📖 Certifications (3-6 months)</p>
            <p className="cfr-pathway-steps">
              AWS, Google Cloud, Azure certifications. Can be done alongside degree. Industry-recognized.
            </p>
          </div>

          <div className="cfr-pathway">
            <p className="cfr-pathway-title">🚀 Bootcamp Programs (3-6 months)</p>
            <p className="cfr-pathway-steps">
              Intensive coding bootcamps. Placement-focused. Alternative to traditional degree. Increasingly
              recognized.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="cfr-section" style={{ pageBreakInside: "avoid" }}>
          <h2 className="cfr-section-title">Your Next Steps</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#db3433" }}>1</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: C.ink }}>
                  Research These Careers
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.ink3 }}>
                  Learn what professionals in these roles actually do day-to-day.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#db3433" }}>2</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: C.ink }}>
                  Start Learning
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.ink3 }}>
                  Begin with online courses, YouTube tutorials, or local workshops.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#db3433" }}>3</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: C.ink }}>
                  Build Projects
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.ink3 }}>
                  Create portfolios and projects to demonstrate skills.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#db3433" }}>4</span>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: C.ink }}>
                  Explore Internships
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: C.ink3 }}>
                  Gain real-world experience in your target field.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="cfr-sheet cfr-footer">
        <p className="cfr-footer-text">
          This report is personalized based on your assessment. Keep exploring, stay curious, and build skills
          intentionally.
        </p>
        <p className="cfr-footer-text" style={{ marginTop: 16, fontSize: 12 }}>
          © 2026 OneGrasp · Career Intelligence Platform
        </p>
      </section>
    </div>
  );
}
