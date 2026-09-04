"use client";

/**
 * Career Roadmap Report — Personalized timeline from Class 9 to career
 *
 * Purpose: "How do I build my future in this career?"
 *
 * Phases:
 * 1. Class 9-10 (Current)
 * 2. Class 11-12 (Specialization)
 * 3. Entrance Exam Prep
 * 4. Undergraduate (4 years)
 * 5. Specialization (1-2 years)
 * 6. Internships & Projects
 * 7. First Job (0-2 years)
 * 8. Growth & Advancement
 */

import { useRef } from "react";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { archetype, domainFit } from "@/lib/report/knowledge";
import { C } from "@/app/account/viz";
import { getTopCareersPerDomain, DOMAIN_LABELS, DOMAIN_COLORS, DOMAIN_EMOJIS } from "@/lib/data/topCareersPerDomain";
import ReportCoverPage from "@/app/components/ReportCoverPage";

interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  age: string;
  color: string;
  objectives: string[];
  actions: string[];
  skills: string[];
  opportunities?: string[];
}

const CSS = `
.crr { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f9f9fa; }
.crr-sheet { background: white; page-break-after: always; page-break-inside: avoid; }

.crr-header { padding: 48px 40px; border-bottom: 1px solid #ececef; }
.crr-logo { font-size: 18px; font-weight: 700; color: #db3433; margin-bottom: 24px; }
.crr-title { font-size: 32px; font-weight: 700; line-height: 1.2; margin: 0 0 12px; color: #0f0f13; }
.crr-subtitle { font-size: 14px; color: #63636f; margin: 0; }

.crr-cover { padding: 48px 40px; text-align: center; }
.crr-cover-badge { display: inline-block; padding: 6px 12px; background: #fef0f0; color: #db3433; font-size: 12px; font-weight: 600; border-radius: 4px; margin-bottom: 24px; }
.crr-cover-title { font-size: 40px; font-weight: 800; margin: 0 0 16px; color: #0f0f13; }
.crr-cover-lede { font-size: 16px; color: #63636f; margin: 0 0 32px; max-width: 600px; margin-left: auto; margin-right: auto; line-height: 1.6; }

.crr-content { padding: 40px; max-width: 1000px; }

.crr-section { margin-bottom: 40px; page-break-inside: avoid; }
.crr-section-title { font-size: 22px; font-weight: 700; margin: 0 0 16px; color: #0f0f13; padding-bottom: 12px; border-bottom: 2px solid #db3433; }
.crr-section-subtitle { font-size: 14px; color: #63636f; margin: 0 0 20px; }

.crr-timeline { position: relative; }
.crr-timeline::before { content: ""; position: absolute; left: 60px; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, #db3433, #4CAF50); }

.crr-phase { margin-bottom: 32px; position: relative; padding-left: 140px; }
.crr-phase-marker { position: absolute; left: 20px; top: 0; width: 80px; height: 80px; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 18px; }
.crr-phase-number { font-size: 24px; margin-bottom: 4px; }
.crr-phase-marker-label { font-size: 10px; text-align: center; line-height: 1.2; }

.crr-phase-content { padding: 20px; border: 1px solid #ececef; border-radius: 8px; background: #f9f9fa; }
.crr-phase-title { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: #0f0f13; }
.crr-phase-duration { font-size: 12px; color: #9a9aa6; font-weight: 600; margin: 0 0 12px; }
.crr-phase-duration::before { content: "⏱ "; }

.crr-phase-box { margin-bottom: 12px; }
.crr-phase-box-title { font-size: 13px; font-weight: 600; color: #0f0f13; margin: 0 0 6px; }
.crr-phase-box-items { font-size: 12px; color: #63636f; line-height: 1.6; margin: 0; }
.crr-phase-box-items li { margin-bottom: 4px; }

.crr-roadmap-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin: 24px 0; }
.crr-milestone { padding: 16px; border: 1px solid #ececef; border-radius: 6px; background: white; }
.crr-milestone-title { font-size: 13px; font-weight: 600; color: #0f0f13; margin: 0 0 8px; }
.crr-milestone-items { font-size: 12px; color: #63636f; margin: 0; padding: 0; list-style: none; }
.crr-milestone-items li { margin-bottom: 4px; padding-left: 16px; position: relative; }
.crr-milestone-items li::before { content: "→"; position: absolute; left: 0; color: #db3433; }

.crr-footer { padding: 40px; background: #f9f9fa; border-top: 1px solid #ececef; }
.crr-footer-text { font-size: 13px; color: #63636f; margin: 0 0 12px; line-height: 1.6; }

.crr-page-num { font-size: 12px; color: #9a9aa6; text-align: center; margin-top: 24px; }

/* Top Careers Section */
.crr-careers-section { margin: 40px 0; page-break-inside: avoid; }
.crr-careers-title { font-size: 20px; font-weight: 700; color: #0f0f13; margin: 0 0 24px; padding-bottom: 12px; border-bottom: 2px solid #db3433; }
.crr-domain-careers { margin-bottom: 32px; }
.crr-domain-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.crr-domain-emoji { font-size: 24px; }
.crr-domain-name { font-size: 16px; font-weight: 600; color: #0f0f13; margin: 0; }
.crr-careers-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.crr-career-card { padding: 12px; border: 1px solid #ececef; border-radius: 6px; background: #fafbfc; }
.crr-career-name { font-size: 13px; font-weight: 600; color: #0f0f13; margin: 0 0 4px; }
.crr-career-skills { font-size: 11px; color: #63636f; margin: 0; }
`;

export default function CareerRoadmapReport({
  a,
  name,
  careerName = "Software Developer",
}: {
  a: AssessmentSummary;
  name?: string;
  careerName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const arch = archetype(a);
  const first = (name || "").trim().split(/\s+/)[0] || "you";

  // Color palette for timeline
  const colors = ["#db3433", "#e08a1e", "#2f6bff", "#12996b", "#764ba2", "#e91e63", "#673AB7", "#009688"];

  // Build personalized roadmap phases
  const phases: RoadmapPhase[] = [
    {
      phase: 1,
      title: "Foundation (Class 9-10)",
      duration: "2 Years",
      age: "Age 14-16",
      color: colors[0],
      objectives: ["Build core academic foundation", "Explore your interests", "Develop foundational skills"],
      actions: [
        "Focus on Mathematics, Science, English",
        "Take online coding courses (Python basics)",
        "Join coding clubs or STEM clubs",
        "Participate in school science projects",
        "Read about career options",
        "Shadow professionals if possible",
      ],
      skills: ["Mathematics", "Basic coding", "Problem solving", "Communication", "Teamwork"],
      opportunities: ["STEM workshops", "Online courses", "School projects", "Coding competitions"],
    },
    {
      phase: 2,
      title: "Specialization (Class 11-12)",
      duration: "2 Years",
      age: "Age 16-18",
      color: colors[1],
      objectives: ["Specialize in relevant subjects", "Build competitive skills", "Prepare for exams"],
      actions: [
        "Choose Science stream with Computer Science",
        "Complete intermediate coding projects",
        "Prepare for JEE Main and Advanced",
        "Start competitive programming",
        "Build a small portfolio project",
        "Learn web development basics",
      ],
      skills: ["Advanced coding", "Data structures", "Algorithms", "Web development basics", "Problem solving"],
      opportunities: [
        "JEE preparation",
        "Coding bootcamps",
        "Hackathons",
        "Internship programs",
        "GitHub projects",
      ],
    },
    {
      phase: 3,
      title: "Entrance Exam Preparation",
      duration: "6-12 Months",
      age: "Age 17-18",
      color: colors[2],
      objectives: ["Score well in entrance exams", "Meet college cutoffs", "Secure admission"],
      actions: [
        "Study JEE Main syllabus intensively",
        "Take practice tests regularly",
        "Join JEE coaching if needed",
        "Continue coding practice",
        "Maintain health and manage stress",
        "Research top engineering colleges",
      ],
      skills: ["Test-taking", "Time management", "Stress management", "Advanced problem solving"],
    },
    {
      phase: 4,
      title: "Undergraduate (Bachelor's)",
      duration: "4 Years",
      age: "Age 18-22",
      color: colors[3],
      objectives: ["Get solid degree foundation", "Build practical skills", "Network in industry"],
      actions: [
        "Complete B.Tech in Computer Science / IT",
        "Master data structures and algorithms",
        "Take electives in AI/ML, Web Dev, or Cloud",
        "Do 2-3 internships during summers",
        "Work on capstone projects",
        "Participate in coding competitions",
        "Build GitHub portfolio",
        "Develop soft skills (communication, leadership)",
      ],
      skills: [
        "System design",
        "Full-stack development",
        "Database design",
        "Testing",
        "Deployment",
        "Team collaboration",
      ],
      opportunities: [
        "Summer internships",
        "Coding competitions",
        "Hackathons",
        "Open source contributions",
        "Industry projects",
      ],
    },
    {
      phase: 5,
      title: "Specialization (Optional)",
      duration: "1-2 Years",
      age: "Age 22-24",
      color: colors[4],
      objectives: ["Specialize in a domain", "Deepen expertise", "Become expert-level"],
      actions: [
        "Option A: Pursue Master's in AI/ML or Cloud",
        "Option B: Join a company and specialize on-job",
        "Take advanced certifications (AWS, GCP, Azure)",
        "Contribute to research or open source",
        "Learn emerging technologies",
      ],
      skills: ["Specialized technical skills", "Research", "Innovation", "Advanced problem solving"],
    },
    {
      phase: 6,
      title: "Internships & Projects",
      duration: "3-6 Months (Ongoing)",
      age: "Age 18-24",
      color: colors[5],
      objectives: ["Gain real-world experience", "Build portfolio", "Network with professionals"],
      actions: [
        "Apply to internships at target companies",
        "Work on real projects with mentorship",
        "Build 3-4 solid portfolio projects",
        "Contribute to open source",
        "Attend tech conferences",
        "Network with professionals",
      ],
      skills: ["Real-world coding", "Collaboration", "Professional communication"],
      opportunities: ["Google, Microsoft, Amazon internships", "Startup internships", "Government projects"],
    },
    {
      phase: 7,
      title: "First Full-Time Role",
      duration: "1-3 Years",
      age: "Age 22-25",
      color: colors[6],
      objectives: ["Get first job", "Prove competency", "Build professional foundation"],
      actions: [
        "Apply to companies matching your skills",
        "Interview preparation (leetcode, system design)",
        "Negotiate salary and terms",
        "Learn company-specific technologies",
        "Build professional relationships",
        "Get regular feedback and improve",
      ],
      skills: ["Industry-standard coding", "Professional communication", "Business understanding"],
      opportunities: ["Service companies (TCS, Infosys)", "Product companies (tech startups)", "MNCs"],
    },
    {
      phase: 8,
      title: "Growth & Advancement",
      duration: "3+ Years",
      age: "Age 25+",
      color: colors[7],
      objectives: ["Advance in career", "Lead teams", "Establish expertise"],
      actions: [
        "Move to senior or lead roles",
        "Transition to management if interested",
        "Develop leadership skills",
        "Mentor junior developers",
        "Consider entrepreneurship",
        "Stay updated with new technologies",
      ],
      skills: [
        "Leadership",
        "Architecture",
        "Business strategy",
        "Mentorship",
        "Technical depth or breadth",
      ],
      opportunities: ["Tech lead roles", "Team lead", "Engineering manager", "Architect", "Founder"],
    },
  ];

  return (
    <div ref={root} className="crr">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* PROFESSIONAL COVER PAGE */}
      <ReportCoverPage
        studentName={name || "Student"}
        studentAge={15}
        studentEmail="your.email@onegrasp.com"
        reportType="Career Roadmap"
      />

      {/* CONTENT */}
      <section className="crr-sheet crr-content">
        {/* Overview */}
        <div className="crr-section">
          <h2 className="crr-section-title">Your Career Path</h2>
          <p style={{ fontSize: 14, color: C.ink3, margin: 0, lineHeight: 1.6 }}>
            This roadmap outlines the steps {first} should take to build a successful career as a {careerName}.
            It spans from your current Class 9-10 stage through career establishment, typically taking 8-10
            years. The timeline is flexible and can be adjusted based on your progress, interests, and
            opportunities.
          </p>
        </div>

        {/* Timeline */}
        <div className="crr-section">
          <h2 className="crr-section-title">Phase-by-Phase Roadmap</h2>
          <div className="crr-timeline">
            {phases.map((p) => (
              <div key={p.phase} className="crr-phase">
                <div className="crr-phase-marker" style={{ backgroundColor: p.color }}>
                  <div className="crr-phase-number">{p.phase}</div>
                  <div className="crr-phase-marker-label">{p.duration}</div>
                </div>
                <div className="crr-phase-content">
                  <h3 className="crr-phase-title">{p.title}</h3>
                  <p className="crr-phase-duration">{p.duration} · {p.age}</p>

                  <div className="crr-phase-box">
                    <div className="crr-phase-box-title">🎯 Objectives</div>
                    <ul className="crr-phase-box-items">
                      {p.objectives.map((obj) => (
                        <li key={obj}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="crr-phase-box">
                    <div className="crr-phase-box-title">✓ Actions</div>
                    <ul className="crr-phase-box-items">
                      {p.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="crr-phase-box">
                    <div className="crr-phase-box-title">💡 Skills to Build</div>
                    <ul className="crr-phase-box-items">
                      {p.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  </div>

                  {p.opportunities && (
                    <div className="crr-phase-box">
                      <div className="crr-phase-box-title">🚀 Opportunities</div>
                      <ul className="crr-phase-box-items">
                        {p.opportunities.map((opp) => (
                          <li key={opp}>{opp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="crr-section">
          <h2 className="crr-section-title">Key Milestones</h2>
          <p className="crr-section-subtitle">Important checkpoints along your journey</p>
          <div className="crr-roadmap-grid">
            <div className="crr-milestone">
              <div className="crr-milestone-title">📚 Academic</div>
              <ul className="crr-milestone-items">
                <li>Class 10 Board Exam</li>
                <li>JEE Main & Advanced</li>
                <li>College Admission</li>
                <li>Bachelor's Degree</li>
              </ul>
            </div>

            <div className="crr-milestone">
              <div className="crr-milestone-title">💻 Technical</div>
              <ul className="crr-milestone-items">
                <li>First coding project</li>
                <li>Data structures mastery</li>
                <li>Portfolio (3+ projects)</li>
                <li>System design knowledge</li>
              </ul>
            </div>

            <div className="crr-milestone">
              <div className="crr-milestone-title">🏢 Professional</div>
              <ul className="crr-milestone-items">
                <li>First internship</li>
                <li>Second internship</li>
                <li>First full-time job</li>
                <li>Promotion/Senior role</li>
              </ul>
            </div>

            <div className="crr-milestone">
              <div className="crr-milestone-title">🎓 Certifications</div>
              <ul className="crr-milestone-items">
                <li>AWS certification</li>
                <li>Cloud certifications</li>
                <li>Specialized certs</li>
                <li>Master's degree (opt)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Top 10 Careers Per Domain */}
        {(() => {
          const topCareers = getTopCareersPerDomain();
          return (
            <div className="crr-careers-section">
              <h2 className="crr-section-title">🌟 Top Career Opportunities by Field</h2>
              <p className="crr-section-subtitle">Explore top 10 careers in each domain based on current job market demand and growth</p>

              {Object.entries(topCareers).slice(0, 3).map(([domain, careers]) => (
                <div key={domain} className="crr-domain-careers">
                  <div className="crr-domain-header">
                    <span className="crr-domain-emoji">{DOMAIN_EMOJIS[domain] || '💼'}</span>
                    <h3 className="crr-domain-name">{DOMAIN_LABELS[domain] || domain}</h3>
                  </div>
                  <div className="crr-careers-grid">
                    {careers.slice(0, 10).map((career) => (
                      <div key={career.id} className="crr-career-card">
                        <div className="crr-career-name">{career.name}</div>
                        <div className="crr-career-skills">{career.skills.join(' • ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* Critical Factors */}
        <div className="crr-section">
          <h2 className="crr-section-title">Critical Success Factors</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <div style={{ padding: 16, background: "#fef0f0", borderRadius: 6 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>Consistency</p>
              <p style={{ margin: 0, fontSize: 12, color: C.ink3, lineHeight: 1.5 }}>
                Code every day. Build projects regularly. Stay committed to learning.
              </p>
            </div>

            <div style={{ padding: 16, background: "#e8f5e9", borderRadius: 6 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>Adaptability</p>
              <p style={{ margin: 0, fontSize: 12, color: C.ink3, lineHeight: 1.5 }}>
                Technology changes. Be ready to learn new languages, frameworks, and tools.
              </p>
            </div>

            <div style={{ padding: 16, background: "#e3f2fd", borderRadius: 6 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>Networking</p>
              <p style={{ margin: 0, fontSize: 12, color: C.ink3, lineHeight: 1.5 }}>
                Build relationships. Attend conferences. Help others. Opportunities come through people.
              </p>
            </div>

            <div style={{ padding: 16, background: "#f3e5f5", borderRadius: 6 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>Health & Balance</p>
              <p style={{ margin: 0, fontSize: 12, color: C.ink3, lineHeight: 1.5 }}>
                Sleep, exercise, mental health. Burnout is real. Pace yourself for a long career.
              </p>
            </div>
          </div>
        </div>

        {/* Contingency */}
        <div className="crr-section">
          <h2 className="crr-section-title">If Things Change</h2>
          <p style={{ fontSize: 13, color: C.ink3, margin: 0, lineHeight: 1.6 }}>
            This roadmap is <b>not fixed</b>. You may discover different interests, face setbacks, or find better
            opportunities. That's normal and okay. The principles remain:
          </p>
          <ul style={{ fontSize: 13, color: C.ink3, margin: "12px 0 0 20px", lineHeight: 1.8 }}>
            <li>Build fundamental skills that transfer across careers</li>
            <li>Keep learning and adapting</li>
            <li>Build real projects and real relationships</li>
            <li>Don't chase hype — focus on deep expertise</li>
            <li>Enjoy the journey, not just the destination</li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <section className="crr-sheet" style={{ padding: 40, background: "#f9f9fa", borderTop: "1px solid #ececef" }}>
        <p style={{ fontSize: 13, color: C.ink3, margin: "0 0 12px", lineHeight: 1.6 }}>
          This roadmap is personalized for {first} based on their assessment results. It's a guide, not a
          guarantee. Success depends on hard work, learning from failures, and continuous growth. Start with
          Phase 1 today.
        </p>
        <p style={{ fontSize: 12, color: "#9a9aa6", margin: "16px 0 0" }}>
          © 2026 OneGrasp · Career Intelligence Platform
        </p>
      </section>
    </div>
  );
}
