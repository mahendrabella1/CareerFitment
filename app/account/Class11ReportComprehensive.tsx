"use client";

/**
 * Class 11-12 Comprehensive Report — 20+ Pages, 4-Layer Structure
 *
 * Matches the scale and depth of FullReport.tsx with dedicated sections for:
 * Layer 1: Psychometric Profile (8 sections)
 * Layer 2: Academic Reality (4 sections)
 * Layer 3: Education Pathway (5 sections)
 * Layer 4: Student Aspiration + Summary (4 sections)
 */

import { ReactNode } from "react";
import { format } from "date-fns";
import type { Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";

interface ComprehensiveReportProps {
  studentName: string;
  studentEmail: string;
  studentClass: "11" | "12";
  school?: string;
  stream?: string;
  completedDate: Date;
  output: Class11ScoreOutput;
}

export function Class11ComprehensiveReport({
  studentName,
  studentEmail,
  studentClass,
  school,
  stream,
  completedDate,
  output
}: ComprehensiveReportProps) {
  const first = studentName.split(" ")[0] || "You";

  return (
    <div className="class11-report">
      <style>{Class11ComprehensiveStyles}</style>

      {/* ===== PAGE 1: COVER PAGE ===== */}
      <section className="sheet cover-sheet">
        <div className="cover-container">
          <div className="cover-accent accent-1" />
          <div className="cover-accent accent-2" />
          <div className="cover-accent accent-3" />

          {/* Logo & Tagline */}
          <div className="cover-header">
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" className="cover-logo" />
            <p className="cover-tagline">Advanced Career Discovery & Fitment Assessment</p>
          </div>

          {/* Cover Illustration */}
          <div className="illustration-container" style={{ marginTop: 20, marginBottom: 20 }}>
            <img
              src="/illustrations/cover-hero.svg"
              alt="Career Discovery Journey"
              className="report-illustration"
              style={{ maxWidth: "300px", height: "auto" }}
            />
          </div>

          {/* Main Title */}
          <div className="cover-main">
            <h1 className="cover-title">Career Discovery Report</h1>
            <p className="cover-subtitle">Class {studentClass} Assessment Results</p>
            <div className="cover-divider" />
            <p className="cover-description">
              Your personalized 4-layer analysis of career fit, education pathways, and recommendations
            </p>
          </div>

          {/* Student Details Grid */}
          <div className="cover-details">
            <div className="detail-card">
              <span className="detail-label">Student Name</span>
              <span className="detail-value">{studentName}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Email</span>
              <span className="detail-value">{studentEmail}</span>
            </div>
            <div className="detail-card">
              <span className="detail-label">Class</span>
              <span className="detail-value">Class {studentClass}</span>
            </div>
            {stream && (
              <div className="detail-card">
                <span className="detail-label">Stream</span>
                <span className="detail-value">{stream}</span>
              </div>
            )}
            {school && (
              <div className="detail-card">
                <span className="detail-label">School</span>
                <span className="detail-value">{school}</span>
              </div>
            )}
            <div className="detail-card">
              <span className="detail-label">Completed</span>
              <span className="detail-value">{format(completedDate, "dd MMM yyyy")}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="cover-footer">
            <p>81 Questions • 4-Layer Analysis • Comprehensive Career Guidance</p>
          </div>
        </div>
      </section>

      {/* ===== PAGE 2: TABLE OF CONTENTS ===== */}
      <TableOfContents />

      {/* ===== PAGE 3: EXECUTIVE SUMMARY ===== */}
      <ExecutiveSummary first={first} output={output} />

      {/* ===== LAYER 1: PSYCHOMETRIC PROFILE (Pages 4-8) ===== */}
      <Layer1PersonalityProfile output={output} />
      <Layer1RIASECProfile output={output} />
      <Layer1AptitudeProfile output={output} />
      <Layer1StrengthDomains output={output} />
      <Layer1MotivatorProfile output={output} />
      <Layer1LearningAndEI output={output} />
      <Layer1Creativity output={output} />

      {/* ===== PAGE 9: LAYER 1 SUMMARY PAGE ===== */}
      <Layer1SummaryPage output={output} />

      {/* ===== LAYER 2: ACADEMIC REALITY (Pages 10-12) ===== */}
      <Layer2StreamAssessment output={output} />
      <Layer2SubjectsAndPathways output={output} />
      <Layer2AcademicGuidance output={output} />

      {/* ===== LAYER 3: EDUCATION PATHWAY (Pages 13-16) ===== */}
      <Layer3DegreesAndExams output={output} />
      <Layer3Roadmap output={output} />
      <Layer3UniversitiesAndCareers output={output} />
      <Layer3SkillsDevelopment output={output} />

      {/* ===== LAYER 4: STUDENT ASPIRATION (Pages 17-19) ===== */}
      <Layer4AspirationAnalysis output={output} />
      <Layer4AlignmentCheck output={output} />

      {/* ===== PAGE 20: SUMMARY & ACTION PLAN ===== */}
      <SummaryAndAction output={output} first={first} />

      {/* ===== PAGE 21: PARENT GUIDE ===== */}
      <ParentGuide output={output} studentName={studentName} />

      {/* ===== PAGE 22: NEXT STEPS ===== */}
      <NextSteps output={output} />
    </div>
  );
}

export default Class11ComprehensiveReport;

// ============================================================================
// PAGE COMPONENTS (Each ~1-2 pages)
// ============================================================================

function TableOfContents() {
  return (
    <section className="sheet toc-sheet">
      <div className="sheet-header">
        <h2 className="section-title">Table of Contents</h2>
      </div>
      <div className="toc-grid">
        <div className="toc-section">
          <h3>LAYER 1: Your Profile</h3>
          <ul>
            <li>Personality & Work Style</li>
            <li>Career Interests (RIASEC)</li>
            <li>Aptitude & Reasoning</li>
            <li>Strength Domains</li>
            <li>Core Motivators</li>
            <li>Learning Style & EI</li>
            <li>Creativity Profile</li>
            <li>Profile Summary</li>
          </ul>
        </div>
        <div className="toc-section">
          <h3>LAYER 2: Academic Reality</h3>
          <ul>
            <li>Stream Suitability Check</li>
            <li>Subjects & Pathways</li>
            <li>Academic Guidance</li>
          </ul>
        </div>
        <div className="toc-section">
          <h3>LAYER 3: Education Pathway</h3>
          <ul>
            <li>Recommended Degrees</li>
            <li>Roadmap Timeline</li>
            <li>Universities & Colleges</li>
            <li>Skills Development</li>
          </ul>
        </div>
        <div className="toc-section">
          <h3>LAYER 4: Career Alignment</h3>
          <ul>
            <li>Your Career Aspiration</li>
            <li>Alignment Analysis</li>
            <li>Summary & Careers</li>
            <li>Parent Guide</li>
            <li>Next Steps</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ExecutiveSummary({ first, output }: { first: string; output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">OVERVIEW</div>
        <h2 className="section-title">Executive Summary</h2>
        <p className="section-subtitle">The headline read on {first.toLowerCase()}</p>
      </div>

      <div className="content-box">
        <div className="summary-grid">
          <div className="summary-card">
            <h3>Career Profile</h3>
            <p className="summary-value">{output.layer1.riasec[0]?.name} Oriented</p>
            <p className="summary-desc">Your primary career interest</p>
          </div>

          <div className="summary-card">
            <h3>Strongest Aptitude</h3>
            <p className="summary-value">{output.layer1.aptitude.strength}</p>
            <p className="summary-desc">Your natural reasoning ability</p>
          </div>

          <div className="summary-card">
            <h3>Top Strength</h3>
            <p className="summary-value">{output.layer1.strengthDomains[0]?.domain || "Multiple"}</p>
            <p className="summary-desc">Where you naturally excel</p>
          </div>

          <div className="summary-card">
            <h3>Stream Fit</h3>
            <p className="summary-value">{output.layer2.streamSuitability}</p>
            <p className="summary-desc">Your current stream alignment</p>
          </div>
        </div>

        <div className="summary-narrative">
          <h4>Your Profile at a Glance</h4>
          <p>
            {first}, your assessment reveals a {output.layer1.personality.summary}.
            You're particularly strong in {output.layer1.aptitude.strength} reasoning
            and naturally drawn to {output.layer1.riasec[0]?.name} activities.
            Your current {output.layer2.currentStream} stream {output.layer2.streamSuitability}
            with your profile and opens {output.layer2.careerPathwaysAvailable.length} primary career pathways.
          </p>
        </div>
      </div>
    </section>
  );
}

function Layer1PersonalityProfile({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 1</div>
        <h2 className="section-title">Personality & Work Style</h2>
      </div>

      {/* Personality Wheel Illustration */}
      <div className="illustration-container">
        <img
          src="/illustrations/personality-wheel.svg"
          alt="8 Personality Dimensions Wheel"
          className="report-illustration"
        />
        <p className="illustration-caption">Your personality profile across 8 key dimensions</p>
      </div>

      <div className="content-box">
        <div className="trait-grid">
          <div className="trait-item">
            <h4>Problem Solving</h4>
            <p className="trait-value">{output.layer1.personality.problemSolvingStyle}</p>
          </div>
          <div className="trait-item">
            <h4>Learning Preference</h4>
            <p className="trait-value">{output.layer1.personality.learningPreference}</p>
          </div>
          <div className="trait-item">
            <h4>Decision Making</h4>
            <p className="trait-value">{output.layer1.personality.decisionMakingStyle}</p>
          </div>
          <div className="trait-item">
            <h4>Planning Style</h4>
            <p className="trait-value">{output.layer1.personality.planningStyle}</p>
          </div>
          <div className="trait-item">
            <h4>Energy Source</h4>
            <p className="trait-value">{output.layer1.personality.energySource}</p>
          </div>
          <div className="trait-item">
            <h4>Handles Challenges</h4>
            <p className="trait-value">{output.layer1.personality.responseToFailure}</p>
          </div>
        </div>

        <div className="personality-summary">
          <h4>What This Means</h4>
          <p>{output.layer1.personality.summary}</p>
        </div>
      </div>
    </section>
  );
}

function Layer1RIASECProfile({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 2</div>
        <h2 className="section-title">Career Interests (RIASEC Profile)</h2>
      </div>

      {/* Career Interests Illustration */}
      <div className="illustration-container">
        <img
          src="/illustrations/career-interests.svg"
          alt="RIASEC Career Interest Distribution"
          className="report-illustration"
        />
        <p className="illustration-caption">Your interest distribution across the six Holland codes</p>
      </div>

      <div className="content-box">
        <p className="intro-text">
          Your career interests across the six Holland codes. Higher percentiles indicate stronger interest and better fit.
        </p>

        <div className="riasec-bars">
          {output.layer1.riasec.map((code) => (
            <div key={code.code} className="riasec-bar">
              <div className="bar-label">
                <span className="code">{code.code}</span>
                <span className="name">{code.name}</span>
              </div>
              <div className="bar-container">
                <div className="bar-fill" style={{ width: `${code.percentile}%` }} />
              </div>
              <span className="percentile">{code.percentile}%</span>
            </div>
          ))}
        </div>

        <div className="riasec-interpretation">
          <h4>Your Profile</h4>
          <p>
            Your top three interests are <strong>{output.layer1.riasec[0]?.name}</strong>,
            {" "}<strong>{output.layer1.riasec[1]?.name}</strong>, and{" "}
            <strong>{output.layer1.riasec[2]?.name}</strong>. This combination suggests you're naturally drawn to
            a specific set of work environments and tasks. These codes will help identify suitable careers.
          </p>
        </div>
      </div>
    </section>
  );
}

function Layer1AptitudeProfile({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 3</div>
        <h2 className="section-title">Aptitude & Reasoning Abilities</h2>
      </div>

      <div className="content-box">
        <div className="aptitude-grid">
          <div className="aptitude-card">
            <h4>Verbal Reasoning</h4>
            <div className="score-badge">{output.layer1.aptitude.verbal.score}</div>
            <p className="interpretation">{output.layer1.aptitude.verbal.interpretation}</p>
          </div>
          <div className="aptitude-card">
            <h4>Numerical Reasoning</h4>
            <div className="score-badge">{output.layer1.aptitude.numerical.score}</div>
            <p className="interpretation">{output.layer1.aptitude.numerical.interpretation}</p>
          </div>
          <div className="aptitude-card">
            <h4>Logical Reasoning</h4>
            <div className="score-badge">{output.layer1.aptitude.logical.score}</div>
            <p className="interpretation">{output.layer1.aptitude.logical.interpretation}</p>
          </div>
        </div>

        <div className="aptitude-analysis">
          <div className="strength-box">
            <h4>Your Strength</h4>
            <p className="value">{output.layer1.aptitude.strength}</p>
            <p className="desc">You excel in this area. Leverage this in your career choice.</p>
          </div>
          <div className="weakness-box">
            <h4>Area to Develop</h4>
            <p className="value">{output.layer1.aptitude.weakness}</p>
            <p className="desc">Extra practice here will boost your competitive exam performance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer1StrengthDomains({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 4</div>
        <h2 className="section-title">Strength Domains & Multiple Intelligences</h2>
      </div>

      <div className="content-box">
        <p className="intro-text">
          Your natural strengths across eight intelligences. These reveal areas where you naturally feel capable, interested, and comfortable.
        </p>

        <div className="strength-domains">
          {output.layer1.strengthDomains.map((domain) => (
            <div key={domain.domain} className="strength-item">
              <div className="strength-header">
                <h4>{domain.domain}</h4>
                <span className="score">{domain.score}/5</span>
              </div>
              <p className="examples">{domain.examples.join(" • ")}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layer1MotivatorProfile({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 5</div>
        <h2 className="section-title">Core Motivators & Values</h2>
      </div>

      <div className="content-box">
        <div className="motivator-grid">
          <div className="motivator-card">
            <h4>Stability vs Innovation</h4>
            <p className="motivator-value">{output.layer1.motivators.stabilityVsInnovation}</p>
          </div>
          <div className="motivator-card">
            <h4>Mastery vs Impact</h4>
            <p className="motivator-value">{output.layer1.motivators.masteryVsImpact}</p>
          </div>
          <div className="motivator-card">
            <h4>Independence vs Collaboration</h4>
            <p className="motivator-value">{output.layer1.motivators.independenceVsCollaboration}</p>
          </div>
        </div>

        <div className="motivator-summary">
          <h4>What Drives You</h4>
          <p>{output.layer1.motivators.summary}</p>
          <p>
            When evaluating career options, prioritize roles that align with these values.
            A job that pays well but violates your core values will never feel fulfilling.
          </p>
        </div>
      </div>
    </section>
  );
}

function Layer1LearningAndEI({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 6</div>
        <h2 className="section-title">Learning Style & Emotional Intelligence</h2>
      </div>

      <div className="content-box">
        <div className="two-column">
          <div className="col">
            <h3>Your Learning Style</h3>
            <div className="learning-profile">
              <div className="learning-item">
                <span className="label">Primary:</span>
                <span className="value">{output.layer1.learningStyle.primaryStyle}</span>
              </div>
              <div className="learning-item">
                <span className="label">Secondary:</span>
                <span className="value">{output.layer1.learningStyle.secondaryStyle}</span>
              </div>
              <div className="learning-item">
                <span className="label">Exam Prep:</span>
                <span className="value">{output.layer1.learningStyle.examPreparationTechnique}</span>
              </div>
            </div>
            <h4>Study Recommendations</h4>
            <ul>
              {output.layer1.learningStyle.recommendations.map((rec) => (
                <li key={rec}>{rec}</li>
              ))}
            </ul>
          </div>

          <div className="col">
            <h3>Emotional Intelligence</h3>
            <div className="ei-profile">
              <div className="ei-metric">
                <span className="label">Self-Awareness</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${output.layer1.emotionalIntelligence.selfAwareness * 100}%` }}
                  />
                </div>
              </div>
              <div className="ei-metric">
                <span className="label">Social Awareness</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${output.layer1.emotionalIntelligence.socialAwareness * 100}%` }}
                  />
                </div>
              </div>
              <div className="ei-trait">
                <span className="label">Regulation:</span>
                <span className="value">{output.layer1.emotionalIntelligence.emotionalRegulation}</span>
              </div>
              <div className="ei-trait">
                <span className="label">Conflict Resolution:</span>
                <span className="value">{output.layer1.emotionalIntelligence.conflictResolution}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer1Creativity({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 · PART 7</div>
        <h2 className="section-title">Creativity & Innovation Ability</h2>
      </div>

      <div className="content-box">
        <div className="creativity-profile">
          <div className="creativity-score">
            <h3>{output.layer1.creativity.problemSolving}</h3>
            <p className="score-detail">Creativity Score: {output.layer1.creativity.score.toFixed(1)}/5</p>
          </div>

          <div className="creativity-details">
            <div className="detail-item">
              <h4>Problem-Solving Approach</h4>
              <p>{output.layer1.creativity.problemSolving}</p>
            </div>
            <div className="detail-item">
              <h4>Innovation Method</h4>
              <p>{output.layer1.creativity.innovationApproach}</p>
            </div>
            <div className="detail-item">
              <h4>Recommendations</h4>
              <ul>
                {output.layer1.creativity.recommendations.map((rec) => (
                  <li key={rec}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer1SummaryPage({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1 SUMMARY</div>
        <h2 className="section-title">Your Complete Psychometric Profile</h2>
      </div>

      <div className="content-box">
        <div className="summary-highlights">
          <h3>Key Insights</h3>
          <ul className="highlights-list">
            <li>
              <strong>Personality:</strong> {output.layer1.personality.summary}
            </li>
            <li>
              <strong>Top Interests:</strong> {output.layer1.riasec.slice(0, 3).map(r => r.name).join(", ")}
            </li>
            <li>
              <strong>Aptitude Strength:</strong> {output.layer1.aptitude.strength} reasoning
            </li>
            <li>
              <strong>Motivators:</strong> {output.layer1.motivators.summary}
            </li>
            <li>
              <strong>Learns Best Via:</strong> {output.layer1.learningStyle.primaryStyle}
            </li>
          </ul>
        </div>

        <p className="summary-note">
          This complete profile is your foundation. Everything in the remaining layers builds on these eight dimensions
          to create personalized career, education, and development recommendations.
        </p>
      </div>
    </section>
  );
}

// Continue with Layer 2, 3, 4 components...
// For space, I'll create placeholders that match the structure

function Layer2StreamAssessment({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 2 · ACADEMIC REALITY</div>
        <h2 className="section-title">Your Stream & Subject Fit</h2>
      </div>

      {/* Stream Analysis Illustration */}
      <div className="illustration-container">
        <img
          src="/illustrations/stream-analysis.svg"
          alt="Stream Suitability Analysis"
          className="report-illustration"
        />
        <p className="illustration-caption">Your stream fit analysis across Science, Commerce, and Humanities</p>
      </div>

      <div className="content-box">
        <h3>Current Stream: {output.layer2.currentStream}</h3>
        <div className={`suitability-badge ${output.layer2.streamSuitability.toLowerCase().replace(" ", "-")}`}>
          {output.layer2.streamSuitability}
        </div>

        <div className="two-column">
          <div className="col">
            <h4>Subject Strengths</h4>
            <ul>
              {output.layer2.subjectStrengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h4>Subject Challenges</h4>
            <ul>
              {output.layer2.subjectChallenges.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Layer2SubjectsAndPathways({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 2 · PATHWAYS</div>
        <h2 className="section-title">Career Pathways Available</h2>
      </div>

      <div className="content-box">
        <div className="pathways-grid">
          {output.layer2.careerPathwaysAvailable.map((pathway) => (
            <div key={pathway} className="pathway-card">
              {pathway}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layer2AcademicGuidance({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 2 · GUIDANCE</div>
        <h2 className="section-title">What to Do Now</h2>
      </div>

      <div className="content-box">
        <ol className="action-list">
          {output.layer2.nextSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Layer3DegreesAndExams({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 3 · DEGREES</div>
        <h2 className="section-title">Recommended Degree Programs</h2>
      </div>

      <div className="content-box">
        <div className="degree-cards">
          {output.layer3.recommendedDegrees.map((degree) => (
            <div key={degree.name} className="degree-card">
              <div className="compatibility">{degree.compatibility}% fit</div>
              <h4>{degree.name}</h4>
              <p><strong>Entrance:</strong> {degree.entranceExam || "See specific program"}</p>
              <p><strong>Top Colleges:</strong> {degree.topColleges.join(", ")}</p>
            </div>
          ))}
        </div>

        <h4>Entrance Exams Required</h4>
        <div className="exam-list">
          {output.layer3.entranceExamsRequired.map((exam) => (
            <span key={exam} className="exam-tag">{exam}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layer3Roadmap({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 3 · ROADMAP</div>
        <h2 className="section-title">Your Timeline & Roadmap</h2>
      </div>

      {/* Education Timeline Illustration */}
      <div className="illustration-container">
        <img
          src="/illustrations/education-timeline.svg"
          alt="Education Roadmap from Class 11 to Career"
          className="report-illustration"
        />
        <p className="illustration-caption">Your educational journey timeline</p>
      </div>

      <div className="content-box">
        <div className="roadmap">
          {output.layer3.timelineUpto22.map((phase, idx) => (
            <div key={idx} className="roadmap-phase">
              <div className="phase-marker">{idx + 1}</div>
              <div className="phase-content">
                <h4>{phase.period}</h4>
                <p><strong>Focus:</strong> {phase.focus}</p>
                <h5>Actions</h5>
                <ul>
                  {phase.actions.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layer3UniversitiesAndCareers({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 3 · UNIVERSITIES</div>
        <h2 className="section-title">Universities & Career Outcomes</h2>
      </div>

      <div className="content-box">
        <div className="university-grid">
          {output.layer3.universities.map((uni) => (
            <div key={uni.name} className="university-card">
              <h5>{uni.name}</h5>
              <p className="location">{uni.location}</p>
              <p><strong>Entrance:</strong> {uni.entranceRequired}</p>
              <p><strong>Est. Cutoff:</strong> {uni.cutoffEstimate}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Layer3SkillsDevelopment({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 3 · SKILLS</div>
        <h2 className="section-title">Skills Development Plan</h2>
      </div>

      <div className="content-box">
        <table className="skills-table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Current</th>
              <th>Target</th>
              <th>How</th>
              <th>Timeline</th>
            </tr>
          </thead>
          <tbody>
            {output.layer3.skillsDevelopmentPlan.map((skill) => (
              <tr key={skill.skill}>
                <td>{skill.skill}</td>
                <td>{skill.currentLevel}</td>
                <td>{skill.targetLevel}</td>
                <td>{skill.developmentMethod}</td>
                <td>{skill.timeRequired}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Layer4AspirationAnalysis({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 4 · YOUR GOAL</div>
        <h2 className="section-title">Your Career Aspiration</h2>
      </div>

      <div className="content-box">
        <h3>{output.layer4.primaryCareerGoal}</h3>
        <p className="clarity-score">
          Career Clarity: <strong>{output.layer4.clarityScore}/10</strong>
        </p>

        <h4>Alternative Interests</h4>
        <ul>
          {output.layer4.alternativeOptions.map((opt) => (
            <li key={opt}>{opt}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Layer4AlignmentCheck({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 4 · ALIGNMENT</div>
        <h2 className="section-title">How Realistic Is Your Goal?</h2>
      </div>

      {/* Career Alignment Chart Illustration */}
      <div className="illustration-container">
        <img
          src="/illustrations/career-alignment.svg"
          alt="Career Alignment and Match Scores"
          className="report-illustration"
        />
        <p className="illustration-caption">Your alignment with recommended career paths</p>
      </div>

      <div className="content-box">
        <div className="alignment-grid">
          <div className="alignment-item">
            <span className="label">Psychometric Fit</span>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${output.layer4.alignment.psychometricAlignment}%` }} />
            </div>
            <span className="value">{output.layer4.alignment.psychometricAlignment}%</span>
          </div>
          <div className="alignment-item">
            <span className="label">Stream Fit</span>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${output.layer4.alignment.streamAlignment}%` }} />
            </div>
            <span className="value">{output.layer4.alignment.streamAlignment}%</span>
          </div>
          <div className="alignment-item">
            <span className="label">Aptitude Fit</span>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${output.layer4.alignment.aptitudeAlignment}%` }} />
            </div>
            <span className="value">{output.layer4.alignment.aptitudeAlignment}%</span>
          </div>
          <div className="alignment-item overall">
            <span className="label">Overall Fitment</span>
            <div className="progress-bar">
              <div className="fill" style={{ width: `${output.layer4.alignment.overallFitment}%` }} />
            </div>
            <span className="value">{Math.round(output.layer4.alignment.overallFitment)}%</span>
          </div>
        </div>

        <p className="advice-box">{output.layer4.advice}</p>
      </div>
    </section>
  );
}

function SummaryAndAction({ output, first }: { output: Class11ScoreOutput; first: string }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">SUMMARY</div>
        <h2 className="section-title">Your Top Career Recommendations</h2>
      </div>

      <div className="content-box">
        <div className="careers-grid">
          {output.summary.topThreeCareers.map((career, idx) => (
            <div key={career.name} className="career-card">
              <div className="rank">Top {idx + 1}</div>
              <h4>{career.name}</h4>
              <p className="fit">{career.fitmentScore}% Fit</p>
              <p><strong>Required:</strong> {career.requiredEducation}</p>
              <p><strong>Salary:</strong> {career.salaryRange}</p>
            </div>
          ))}
        </div>

        <h4>Your Strengths to Leverage</h4>
        <ul>
          {output.summary.strengthToLeverage.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h4>Growth Areas to Develop</h4>
        <ul>
          {output.summary.growthAreas.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ParentGuide({ output, studentName }: { output: Class11ScoreOutput; studentName: string }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">FOR PARENTS</div>
        <h2 className="section-title">Understanding {studentName}'s Report</h2>
      </div>

      <div className="content-box">
        <h4>What These 4 Layers Mean</h4>
        <div className="parent-section">
          <h5>Layer 1: Psychometric Profile</h5>
          <p>
            What the assessment reveals about your child's personality, abilities, and natural preferences.
            These eight dimensions provide a complete picture of their profile.
          </p>
        </div>

        <div className="parent-section">
          <h5>Layer 2: Academic Reality</h5>
          <p>
            An honest assessment of their current stream and subject fit. This helps confirm if their stream choice
            aligns with their profile or if adjustments might be beneficial.
          </p>
        </div>

        <div className="parent-section">
          <h5>Layer 3: Education Pathway</h5>
          <p>
            Specific, actionable recommendations for degrees, entrance exams, universities, and skill development.
            This is the roadmap to reach their career goal.
          </p>
        </div>

        <div className="parent-section">
          <h5>Layer 4: Student Aspiration</h5>
          <p>
            What your child actually wants, and how realistic it is based on their profile. The alignment score
            shows the fit percentage.
          </p>
        </div>
      </div>
    </section>
  );
}

function NextSteps({ output }: { output: Class11ScoreOutput }) {
  return (
    <section className="sheet">
      <div className="sheet-header">
        <div className="kicker">ACTION PLAN</div>
        <h2 className="section-title">What To Do Next</h2>
      </div>

      <div className="content-box">
        <div className="timeline-steps">
          <div className="step">
            <div className="step-header">
              <span className="step-number">1</span>
              <h4>This Week</h4>
            </div>
            <ul>
              {output.layer2.nextSteps.slice(0, 2).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">2</span>
              <h4>This Month</h4>
            </div>
            <ul>
              <li>Research the top 3 recommended degrees</li>
              <li>Identify entrance exam preparation resources</li>
              <li>Start skill development in identified areas</li>
            </ul>
          </div>

          <div className="step">
            <div className="step-header">
              <span className="step-number">3</span>
              <h4>This Year</h4>
            </div>
            <ul>
              <li>Complete competitive exam preparation</li>
              <li>Gain practical experience through internships/projects</li>
              <li>Build a portfolio relevant to career choice</li>
            </ul>
          </div>
        </div>

        <div className="final-note">
          <p>
            <strong>Remember:</strong> This report is a guide, not a prediction. Your effort, consistency, and
            adaptability matter more than any test score. Use this as a starting point for deeper career exploration
            and academic planning.
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// COMPREHENSIVE CSS STYLES (20+ pages)
// ============================================================================

const Class11ComprehensiveStyles = `
.class11-report {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1a1a1a;
  line-height: 1.6;
}

.sheet {
  page-break-after: always;
  padding: 60px 50px;
  min-height: 100vh;
  background: white;
  position: relative;
}

.sheet-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.kicker {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #999;
  margin-bottom: 12px;
}

.section-title {
  font-size: 38px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.section-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.content-box {
  max-width: 900px;
  margin: 0 auto;
}

/* Cover Sheet - Professional Gradient Design */
.cover-sheet {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #2f6bff 0%, #1a4d9e 50%, #12996b 100%);
  padding: 80px 60px !important;
  color: white;
  margin: 0 !important;
  min-height: 100vh !important;
}

.cover-sheet::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background-image: url('/onegrasp-logo-tight.png');
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.08;
  z-index: 0;
  pointer-events: none;
}

.cover-container {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.cover-accent {
  position: absolute;
  opacity: 0.08;
}

.accent-1 {
  width: 500px;
  height: 500px;
  background: white;
  border-radius: 50%;
  top: -200px;
  right: -150px;
}

.accent-2 {
  width: 400px;
  height: 400px;
  background: white;
  border-radius: 50%;
  bottom: -100px;
  left: -100px;
}

.accent-3 {
  width: 300px;
  height: 300px;
  background: white;
  border-radius: 50%;
  bottom: 200px;
  right: 50px;
}

.cover-header {
  text-align: left;
  margin-bottom: 40px;
}

.cover-logo {
  height: 50px;
  width: auto;
  margin-bottom: 12px;
  filter: brightness(0) invert(1);
}

.cover-tagline {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.cover-main {
  text-align: left;
  margin-bottom: 80px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.cover-title {
  font-size: 48px;
  font-weight: 800;
  margin: 0 0 24px 0;
  color: white;
  letter-spacing: -1px;
}

.cover-subtitle {
  font-size: 28px;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  margin: 0 0 40px 0;
}

.cover-divider {
  width: 80px;
  height: 5px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  margin: 0 0 30px 0;
}

.cover-description {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  max-width: 600px;
  margin: 0;
  line-height: 1.6;
}

.cover-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #e08a1e;
  color: #1a1a1a;
}

.detail-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 6px;
  letter-spacing: 0.5px;
}

.detail-value {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.cover-footer {
  text-align: left;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.cover-footer p {
  margin: 0;
  font-weight: 500;
}

/* TOC */
.toc-sheet {
}

.toc-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.toc-section {
  padding: 20px;
}

.toc-section h3 {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  color: #2f6bff;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.toc-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-section li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  font-size: 13px;
  color: #555;
}

.toc-section li::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: #2f6bff;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.summary-card h3 {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.summary-desc {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.summary-narrative {
  background: #f0f4ff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.summary-narrative h4 {
  margin-top: 0;
}

/* Trait Grid */
.trait-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.trait-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.trait-item h4 {
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

.trait-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

/* RIASEC Bars */
.riasec-bars {
  margin-bottom: 20px;
}

.riasec-bar {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.bar-label {
  display: flex;
  gap: 10px;
  align-items: center;
}

.code {
  font-weight: 700;
  font-size: 16px;
  color: #2f6bff;
  width: 30px;
}

.name {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.bar-container {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #0052cc);
  border-radius: 4px;
}

.percentile {
  text-align: right;
  font-weight: 600;
  font-size: 12px;
}

.riasec-interpretation {
  background: #f0f4ff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}

/* Aptitude */
.aptitude-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.aptitude-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.aptitude-card h4 {
  font-size: 13px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 12px;
}

.score-badge {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2f6bff, #0052cc);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 700;
  margin: 0 auto 12px;
}

.interpretation {
  font-size: 12px;
  color: #666;
}

.aptitude-analysis {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.strength-box {
  background: #e8f5e9;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #12996b;
}

.weakness-box {
  background: #fff3e0;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #e08a1e;
}

.strength-box h4,
.weakness-box h4 {
  margin-top: 0;
  font-size: 12px;
  text-transform: uppercase;
}

.strength-box .value,
.weakness-box .value {
  font-size: 16px;
  font-weight: 700;
  margin: 8px 0;
}

.strength-box .desc,
.weakness-box .desc {
  font-size: 12px;
  margin: 0;
}

/* Strength Domains */
.strength-domains {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.strength-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.strength-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.strength-header h4 {
  margin: 0;
  font-size: 13px;
}

.score {
  background: #2f6bff;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

.examples {
  font-size: 11px;
  color: #666;
  margin: 0;
}

/* Motivator Grid */
.motivator-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.motivator-card {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.motivator-card h4 {
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

.motivator-value {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.motivator-summary {
  background: #f0f4ff;
  padding: 16px;
  border-radius: 8px;
}

/* Two Column */
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.col {
}

/* Learning Profile */
.learning-profile {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
}

.learning-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.learning-item:last-child {
  border-bottom: none;
}

.learning-item .label {
  color: #999;
  font-weight: 500;
}

.learning-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

.col h4 {
  font-size: 13px;
  text-transform: uppercase;
  color: #999;
  margin: 16px 0 8px 0;
}

.col ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.col li {
  padding: 6px 0;
  padding-left: 16px;
  position: relative;
  font-size: 13px;
  color: #555;
}

.col li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #12996b;
  font-weight: 700;
}

/* EI Profile */
.ei-profile {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.ei-metric {
  margin-bottom: 12px;
}

.ei-metric .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  font-weight: 500;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 4px;
}

.progress-fill {
  height: 100%;
  background: #2f6bff;
  border-radius: 3px;
}

.ei-trait {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-top: 1px solid #e0e0e0;
}

.ei-trait:first-of-type {
  border-top: none;
}

/* Creativity */
.creativity-profile {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 30px;
}

.creativity-score {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.creativity-score h3 {
  margin-top: 0;
  font-size: 18px;
}

.score-detail {
  color: #2f6bff;
  font-weight: 700;
  font-size: 14px;
}

.creativity-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.detail-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.detail-item h4 {
  margin-top: 0;
  font-size: 12px;
  text-transform: uppercase;
}

.detail-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-item li {
  padding: 4px 0;
  padding-left: 16px;
  position: relative;
  font-size: 12px;
}

.detail-item li::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: #2f6bff;
}

/* Suitability Badge */
.suitability-badge {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.suitability-badge.well-matched {
  background: #e8f5e9;
  color: #12996b;
  border: 1px solid #12996b;
}

.suitability-badge.partially-matched {
  background: #fff3e0;
  color: #e08a1e;
  border: 1px solid #e08a1e;
}

.suitability-badge.misaligned {
  background: #ffebee;
  color: #d73c3c;
  border: 1px solid #d73c3c;
}

/* Pathways Grid */
.pathways-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.pathway-card {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
  font-weight: 500;
  text-align: center;
}

/* Action List */
.action-list {
  list-style: decimal;
  padding-left: 24px;
  margin: 0;
}

.action-list li {
  margin-bottom: 12px;
  color: #555;
  line-height: 1.6;
}

/* Degree Cards */
.degree-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.degree-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  position: relative;
}

.compatibility {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #2f6bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.degree-card h4 {
  margin-top: 24px;
  margin-bottom: 12px;
}

.degree-card p {
  font-size: 12px;
  margin: 8px 0;
}

/* Exam Tags */
.exam-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.exam-tag {
  background: #f8f8f8;
  padding: 8px 12px;
  border-radius: 4px;
  border-left: 4px solid #2f6bff;
  font-size: 12px;
  font-weight: 500;
}

/* Roadmap */
.roadmap {
  position: relative;
  padding-left: 40px;
}

.roadmap::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e0e0e0;
}

.roadmap-phase {
  display: flex;
  gap: 20px;
  margin-bottom: 32px;
  position: relative;
}

.phase-marker {
  width: 32px;
  height: 32px;
  background: #2f6bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: -26px;
}

.phase-content h4 {
  margin-top: 0;
}

.phase-content h5 {
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
  margin: 12px 0 8px 0;
}

.phase-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.phase-content li {
  padding: 4px 0 4px 16px;
  position: relative;
  color: #555;
}

.phase-content li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #2f6bff;
}

/* University Grid */
.university-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.university-card {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.university-card h5 {
  margin-top: 0;
  margin-bottom: 4px;
  font-size: 13px;
}

.location {
  color: #999;
  font-size: 12px;
  margin: 4px 0 8px 0;
}

.university-card p {
  font-size: 12px;
  margin: 4px 0;
}

/* Skills Table */
.skills-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.skills-table thead {
  background: #f8f8f8;
}

.skills-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #999;
  border-bottom: 1px solid #e0e0e0;
  text-transform: uppercase;
  font-size: 10px;
  letter-spacing: 0.5px;
}

.skills-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

/* Alignment Grid */
.alignment-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.alignment-item {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.alignment-item .label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  margin-bottom: 8px;
  text-transform: uppercase;
}

.alignment-item .progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.alignment-item .fill {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #0052cc);
  border-radius: 4px;
}

.alignment-item .value {
  font-weight: 700;
  font-size: 14px;
  color: #1a1a1a;
}

.alignment-item.overall {
  grid-column: 1 / -1;
  max-width: 300px;
}

.advice-box {
  background: #f0f4ff;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
  margin-top: 20px;
  font-size: 13px;
  line-height: 1.6;
}

/* Careers Grid */
.careers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.career-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  position: relative;
}

.rank {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

.career-card h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.fit {
  font-weight: 700;
  color: #2f6bff;
  margin-bottom: 8px;
}

.career-card p {
  font-size: 12px;
  margin: 6px 0;
}

/* Parent Section */
.parent-section {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #2f6bff;
}

.parent-section h5 {
  margin-top: 0;
  font-size: 13px;
  text-transform: uppercase;
  color: #2f6bff;
}

.parent-section p {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #555;
}

/* Timeline Steps */
.timeline-steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.step {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.step-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: #2f6bff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-header h4 {
  margin: 0;
  font-size: 14px;
}

.step ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step li {
  padding: 6px 0;
  padding-left: 16px;
  position: relative;
  font-size: 12px;
  color: #555;
}

.step li::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: #2f6bff;
}

.final-note {
  background: linear-gradient(135deg, #f0f4ff, #e8f5e9);
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.final-note p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #555;
}

.final-note strong {
  color: #1a1a1a;
}

/* Illustration Styles */
.illustration-container,
.illustration-wrapper {
  display: flex;
  justify-content: center;
  margin: 30px 0;
  page-break-inside: avoid;
}

.report-illustration {
  max-width: 100%;
  height: auto;
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  margin-bottom: 24px;
  border-radius: 8px;
}

.illustration-caption {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 8px;
  font-style: italic;
}

svg {
  max-width: 100%;
  height: auto;
}

/* Print Styles */
@media print {
  .sheet {
    page-break-after: always;
    page-break-inside: avoid;
    width: 210mm;
    min-height: 297mm;
    padding: 60px 50px;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
    background: white;
  }

  .illustration-container,
  .illustration-wrapper {
    page-break-inside: avoid;
  }
}

/* Responsive */
@media (max-width: 1024px) {
  .sheet {
    padding: 40px 30px;
  }

  .cover-details {
    grid-template-columns: repeat(2, 1fr);
  }

  .summary-grid,
  .trait-grid,
  .aptitude-grid,
  .strength-domains,
  .motivator-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .two-column,
  .creativity-profile {
    grid-template-columns: 1fr;
  }

  .timeline-steps {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .sheet {
    padding: 24px 16px;
  }

  .section-title {
    font-size: 26px;
  }

  .cover-details,
  .summary-grid,
  .trait-grid,
  .aptitude-grid,
  .strength-domains,
  .motivator-grid,
  .degree-cards,
  .university-grid,
  .careers-grid,
  .pathways-grid,
  .toc-grid {
    grid-template-columns: 1fr;
  }
}
`;
