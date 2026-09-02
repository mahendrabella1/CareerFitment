"use client";

/**
 * Class 11-12 Advanced Career Report — 4-Layer Structure
 *
 * Layer 1: Psychometric Profile (What the assessment reveals)
 * Layer 2: Academic Reality (What your stream allows)
 * Layer 3: Education Pathway (How to reach your goal)
 * Layer 4: Student Aspiration (What you actually want)
 *
 * Maintains the same visual design as FullReport with additional sections
 */

import { ReactNode } from "react";
import type { Class11ScoreOutput } from "@/lib/newAssessment/scoring11_12";
import { Icon } from "@/app/Icons";
import { C, SkillBar } from "@/app/account/viz";

const P = "https://onegrasp.com/wp-content/uploads/2026/07/";

interface Layer1Props {
  data: Class11ScoreOutput["layer1"];
}

interface Layer2Props {
  data: Class11ScoreOutput["layer2"];
}

interface Layer3Props {
  data: Class11ScoreOutput["layer3"];
}

interface Layer4Props {
  data: Class11ScoreOutput["layer4"];
}

/**
 * LAYER 1: Psychometric Profile
 * Displays: Personality, RIASEC, Aptitude, Strengths, Motivators, Learning Style, EI, Creativity
 */
export function Layer1PsychometricProfile({ data }: Layer1Props) {
  return (
    <div className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 1</div>
        <h1>Your Psychometric Profile</h1>
        <p className="subhead">What the assessment reveals about you</p>
      </div>

      <div className="content">
        {/* Personality Section */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "personality.png"} alt="Personality" />
            </div>
            <h3>Personality & Work Style</h3>
          </div>
          <div className="grid-2">
            <div className="trait-card">
              <h4>Problem Solving</h4>
              <p className="trait-value">{data.personality.problemSolvingStyle}</p>
            </div>
            <div className="trait-card">
              <h4>Learning Preference</h4>
              <p className="trait-value">{data.personality.learningPreference}</p>
            </div>
            <div className="trait-card">
              <h4>Decision Making</h4>
              <p className="trait-value">{data.personality.decisionMakingStyle}</p>
            </div>
            <div className="trait-card">
              <h4>Planning Style</h4>
              <p className="trait-value">{data.personality.planningStyle}</p>
            </div>
            <div className="trait-card">
              <h4>Energy Source</h4>
              <p className="trait-value">{data.personality.energySource}</p>
            </div>
            <div className="trait-card">
              <h4>Response to Challenges</h4>
              <p className="trait-value">{data.personality.responseToFailure}</p>
            </div>
          </div>
          <p className="trait-summary">{data.personality.summary}</p>
        </section>

        {/* RIASEC Profile */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "career-interest.png"} alt="Career Interest" />
            </div>
            <h3>Career Interest Profile (RIASEC)</h3>
          </div>
          <p className="explanation">
            Your career interests across six dimensions. Higher scores indicate stronger interest and natural fit.
          </p>
          <div className="riasec-bars">
            {data.riasec.map((item, idx) => (
              <div key={item.code} className="riasec-bar">
                <div className="bar-label">
                  <span className="code">{item.code}</span>
                  <span className="name">{item.name}</span>
                </div>
                <div className="bar-container">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.percentile}%` }}
                  />
                </div>
                <span className="bar-value">{item.percentile}%</span>
              </div>
            ))}
          </div>
          <div className="riasec-interpretation">
            <h4>Your Top Interest: {data.riasec[0]?.name}</h4>
            <p>
              This is your primary career interest area. Combined with your other strong areas,
              it opens doors to a variety of fulfilling careers.
            </p>
          </div>
        </section>

        {/* Aptitude Profile */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "aptitude.png"} alt="Aptitude" />
            </div>
            <h3>Aptitude & Reasoning Abilities</h3>
          </div>
          <div className="grid-3">
            <div className="aptitude-card">
              <h4>Verbal Reasoning</h4>
              <div className="score-circle">
                <span className="score">{data.aptitude.verbal.score}</span>
              </div>
              <p className="interpretation">{data.aptitude.verbal.interpretation}</p>
            </div>
            <div className="aptitude-card">
              <h4>Numerical Reasoning</h4>
              <div className="score-circle">
                <span className="score">{data.aptitude.numerical.score}</span>
              </div>
              <p className="interpretation">{data.aptitude.numerical.interpretation}</p>
            </div>
            <div className="aptitude-card">
              <h4>Logical Reasoning</h4>
              <div className="score-circle">
                <span className="score">{data.aptitude.logical.score}</span>
              </div>
              <p className="interpretation">{data.aptitude.logical.interpretation}</p>
            </div>
          </div>
          <div className="strength-weakness">
            <div className="strength">
              <h4>Strongest Area</h4>
              <p>{data.aptitude.strength}</p>
            </div>
            <div className="area-to-improve">
              <h4>Area to Develop</h4>
              <p>{data.aptitude.weakness}</p>
            </div>
          </div>
        </section>

        {/* Strength Domains */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "strenghts.png"} alt="Strengths" />
            </div>
            <h3>Natural Strength Domains</h3>
          </div>
          <p className="explanation">
            These are areas where you naturally feel capable, interested, and comfortable. They reflect your multiple intelligences.
          </p>
          <div className="strength-domains">
            {data.strengthDomains.map((domain) => (
              <div key={domain.domain} className="strength-item">
                <div className="strength-header">
                  <h4>{domain.domain}</h4>
                  <span className="strength-score">{domain.score}/5</span>
                </div>
                <p className="examples">{domain.examples.join(" • ")}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motivators */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "Motivators.png"} alt="Motivators" />
            </div>
            <h3>Core Motivators & Values</h3>
          </div>
          <div className="grid-3">
            <div className="motivator-card">
              <h4>Stability vs Innovation</h4>
              <p className="motivator-value">{data.motivators.stabilityVsInnovation}</p>
            </div>
            <div className="motivator-card">
              <h4>Mastery vs Impact</h4>
              <p className="motivator-value">{data.motivators.masteryVsImpact}</p>
            </div>
            <div className="motivator-card">
              <h4>Independence vs Collaboration</h4>
              <p className="motivator-value">{data.motivators.independenceVsCollaboration}</p>
            </div>
          </div>
          <p className="motivator-summary">{data.motivators.summary}</p>
        </section>

        {/* Learning Style & EI */}
        <section className="dimension-block">
          <div className="grid-2">
            <div>
              <h3>Your Learning Style</h3>
              <div className="learning-style">
                <div className="primary">
                  <span className="label">Primary:</span>
                  <span className="value">{data.learningStyle.primaryStyle}</span>
                </div>
                <div className="secondary">
                  <span className="label">Secondary:</span>
                  <span className="value">{data.learningStyle.secondaryStyle}</span>
                </div>
                <div className="exam-tech">
                  <span className="label">Best for Exams:</span>
                  <span className="value">{data.learningStyle.examPreparationTechnique}</span>
                </div>
                <div className="recommendations">
                  <h4>Recommended Techniques:</h4>
                  <ul>
                    {data.learningStyle.recommendations.map((rec) => (
                      <li key={rec}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3>Emotional Intelligence</h3>
              <div className="ei-profile">
                <div className="ei-metric">
                  <span className="label">Self-Awareness:</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${data.emotionalIntelligence.selfAwareness * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ei-metric">
                  <span className="label">Social Awareness:</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${data.emotionalIntelligence.socialAwareness * 100}%` }}
                    />
                  </div>
                </div>
                <div className="ei-trait">
                  <span className="label">Emotional Regulation:</span>
                  <span className="value">{data.emotionalIntelligence.emotionalRegulation}</span>
                </div>
                <div className="ei-trait">
                  <span className="label">Conflict Resolution:</span>
                  <span className="value">{data.emotionalIntelligence.conflictResolution}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Creativity */}
        <section className="dimension-block">
          <div className="dimension-header">
            <div className="dimension-icon">
              <img src={P + "creativity.png"} alt="Creativity" />
            </div>
            <h3>Creativity & Innovation Ability</h3>
          </div>
          <div className="creativity-profile">
            <div className="creativity-score">
              <h4>{data.creativity.problemSolving}</h4>
              <p className="creativity-level">Score: {data.creativity.score.toFixed(1)}/5</p>
            </div>
            <div className="creativity-details">
              <div>
                <h4>Problem-Solving Approach</h4>
                <p>{data.creativity.problemSolving}</p>
              </div>
              <div>
                <h4>Innovation Method</h4>
                <p>{data.creativity.innovationApproach}</p>
              </div>
              <div>
                <h4>Recommendations</h4>
                <ul>
                  {data.creativity.recommendations.map((rec) => (
                    <li key={rec}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * LAYER 2: Academic Reality
 * Displays: Current stream fit, subject strengths/challenges, available pathways
 */
export function Layer2AcademicReality({ data }: Layer2Props) {
  const suitabilityColor =
    data.streamSuitability === "Well-matched" ? "#12996b" :
    data.streamSuitability === "Partially-matched" ? "#e08a1e" :
    "#d73c3c";

  return (
    <div className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 2</div>
        <h1>Academic Reality Check</h1>
        <p className="subhead">Where you are now, and what's realistically possible from here</p>
      </div>

      <div className="content">
        <section className="dimension-block">
          <h2>Your Current Stream: {data.currentStream}</h2>
          <div className="stream-suitability">
            <div className="suitability-badge" style={{ borderColor: suitabilityColor }}>
              <div className="badge-color" style={{ backgroundColor: suitabilityColor }} />
              <span className="badge-text">{data.streamSuitability}</span>
            </div>
            <p className="suitability-desc">
              Your chosen stream aligns {data.streamSuitability === "Well-matched" ? "strongly" : "partially"}
              with your psychometric profile and RIASEC interests.
            </p>
          </div>
        </section>

        <section className="dimension-block">
          <div className="grid-2">
            <div>
              <h3>Subject Strengths</h3>
              <div className="subject-list">
                {data.subjectStrengths.map((subject) => (
                  <div key={subject} className="subject-tag strength">
                    {subject}
                  </div>
                ))}
              </div>
              <p className="tip">Focus on these subjects—they're your foundation for success.</p>
            </div>
            <div>
              <h3>Subject Challenges</h3>
              <div className="subject-list">
                {data.subjectChallenges.map((subject) => (
                  <div key={subject} className="subject-tag challenge">
                    {subject}
                  </div>
                ))}
              </div>
              <p className="tip">Extra support here will pay off in competitive exams.</p>
            </div>
          </div>
        </section>

        <section className="dimension-block">
          <h3>Career Pathways Available from {data.currentStream}</h3>
          <div className="career-pathways">
            {data.careerPathwaysAvailable.map((pathway) => (
              <div key={pathway} className="pathway-card">
                <h4>{pathway}</h4>
              </div>
            ))}
          </div>
        </section>

        {data.streamChangeAdvice && (
          <section className="dimension-block warning">
            <h3>Stream Consideration</h3>
            <p>{data.streamChangeAdvice}</p>
          </section>
        )}

        <section className="dimension-block">
          <h3>Next Steps for Now</h3>
          <ol className="action-list">
            {data.nextSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}

/**
 * LAYER 3: Education & Career Pathway
 * Displays: Recommended degrees, entrance exams, roadmap, universities
 */
export function Layer3EducationPathway({ data }: Layer3Props) {
  return (
    <div className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 3</div>
        <h1>Your Education & Career Pathway</h1>
        <p className="subhead">How to reach your goals from here</p>
      </div>

      <div className="content">
        <section className="dimension-block">
          <h2>Recommended Degree Programs</h2>
          <div className="degree-grid">
            {data.recommendedDegrees.map((degree) => (
              <div key={degree.name} className="degree-card">
                <div className="compatibility-badge">
                  <span className="badge-value">{degree.compatibility}%</span>
                  <span className="badge-label">fit</span>
                </div>
                <h3>{degree.name}</h3>
                <div className="degree-details">
                  <div>
                    <h4>Required Subjects</h4>
                    <ul>
                      {degree.requiredSubjects.map((subj) => (
                        <li key={subj}>{subj}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Career Outcomes</h4>
                    <ul>
                      {degree.careerOutcomes.map((career) => (
                        <li key={career}>{career}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Top Colleges</h4>
                    <ul>
                      {degree.topColleges.slice(0, 3).map((college) => (
                        <li key={college}>{college}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {degree.entranceExam && (
                  <div className="entrance-exam">
                    <strong>Entrance Exam:</strong> {degree.entranceExam}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h3>Entrance Exams You'll Need</h3>
          <div className="exam-list">
            {data.entranceExamsRequired.map((exam) => (
              <div key={exam} className="exam-card">
                <h4>{exam}</h4>
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h3>Your Timeline to 2026 & Beyond</h3>
          <div className="roadmap">
            {data.timelineUpto22.map((phase, idx) => (
              <div key={idx} className="roadmap-phase">
                <div className="phase-marker">{idx + 1}</div>
                <div className="phase-content">
                  <h4>{phase.period}</h4>
                  <p className="phase-focus"><strong>Focus:</strong> {phase.focus}</p>
                  <div className="phase-actions">
                    <h5>Actions:</h5>
                    <ul>
                      {phase.actions.map((action) => (
                        <li key={action}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="phase-outcomes">
                    <h5>Expected Outcomes:</h5>
                    <ul>
                      {phase.outcomes.map((outcome) => (
                        <li key={outcome}>{outcome}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h3>Universities to Consider</h3>
          <div className="university-grid">
            {data.universities.map((uni) => (
              <div key={uni.name} className="university-card">
                <h4>{uni.name}</h4>
                <p className="location">{uni.location}</p>
                <div className="programs">
                  <h5>Aligned Programs:</h5>
                  <ul>
                    {uni.programsAligned.map((prog) => (
                      <li key={prog}>{prog}</li>
                    ))}
                  </ul>
                </div>
                <div className="entrance">
                  <p><strong>Entrance:</strong> {uni.entranceRequired}</p>
                  <p><strong>Est. Cutoff:</strong> {uni.cutoffEstimate}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h3>Skill Development Plan</h3>
          <div className="skills-table">
            <div className="table-header">
              <div className="col">Skill</div>
              <div className="col">Current Level</div>
              <div className="col">Target</div>
              <div className="col">How</div>
              <div className="col">Timeline</div>
            </div>
            {data.skillsDevelopmentPlan.map((skill) => (
              <div key={skill.skill} className="table-row">
                <div className="col">{skill.skill}</div>
                <div className="col">{skill.currentLevel}</div>
                <div className="col">{skill.targetLevel}</div>
                <div className="col">{skill.developmentMethod}</div>
                <div className="col">{skill.timeRequired}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * LAYER 4: Student Aspiration
 * Displays: What student wants, alignment with layers 1-3, advice
 */
export function Layer4StudentAspiration({ data }: Layer4Props) {
  const avgAlignment = (
    data.alignment.psychometricAlignment +
    data.alignment.streamAlignment +
    data.alignment.aptitudeAlignment
  ) / 3;

  const alignmentColor = avgAlignment >= 80 ? "#12996b" : avgAlignment >= 60 ? "#e08a1e" : "#d73c3c";

  return (
    <div className="sheet">
      <div className="sheet-header">
        <div className="kicker">LAYER 4</div>
        <h1>Your Career Aspiration</h1>
        <p className="subhead">What you actually want, and how realistic it is</p>
      </div>

      <div className="content">
        <section className="dimension-block">
          <div className="aspiration-header">
            <h2>{data.primaryCareerGoal}</h2>
            <div className="clarity-badge">
              <span className="clarity-value">{data.clarityScore}/10</span>
              <span className="clarity-label">Career Clarity</span>
            </div>
          </div>
          <p className="clarity-interpretation">
            {data.clarityScore >= 8 ? "You have strong clarity about your path." :
             data.clarityScore >= 6 ? "You have moderate clarity; exploring further would help." :
             "You're still exploring—keep learning about different options."}
          </p>
        </section>

        <section className="dimension-block">
          <h3>Alternative Career Interests</h3>
          <div className="alternative-careers">
            {data.alternativeOptions.map((career) => (
              <div key={career} className="alt-career">
                {career}
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h3>Motivation Factors</h3>
          <div className="grid-3">
            {data.motivationFactors.map((factor) => (
              <div key={factor} className="motivation-box">
                <p>{factor}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="dimension-block">
          <h2>How Aligned Is This Career With Your Profile?</h2>
          <div className="alignment-analysis">
            <div className="alignment-card">
              <h4>Psychometric Alignment</h4>
              <div className="alignment-bar">
                <div
                  className="alignment-fill"
                  style={{ width: `${data.alignment.psychometricAlignment}%`, backgroundColor: "#2f6bff" }}
                />
              </div>
              <span className="alignment-percent">{data.alignment.psychometricAlignment}%</span>
            </div>
            <div className="alignment-card">
              <h4>Stream Alignment</h4>
              <div className="alignment-bar">
                <div
                  className="alignment-fill"
                  style={{ width: `${data.alignment.streamAlignment}%`, backgroundColor: "#e08a1e" }}
                />
              </div>
              <span className="alignment-percent">{data.alignment.streamAlignment}%</span>
            </div>
            <div className="alignment-card">
              <h4>Aptitude Alignment</h4>
              <div className="alignment-bar">
                <div
                  className="alignment-fill"
                  style={{ width: `${data.alignment.aptitudeAlignment}%`, backgroundColor: "#12996b" }}
                />
              </div>
              <span className="alignment-percent">{data.alignment.aptitudeAlignment}%</span>
            </div>
            <div className="alignment-card overall">
              <h4>Overall Fitment</h4>
              <div className="alignment-bar">
                <div
                  className="alignment-fill"
                  style={{ width: `${avgAlignment}%`, backgroundColor: alignmentColor }}
                />
              </div>
              <span className="alignment-percent">{Math.round(avgAlignment)}%</span>
            </div>
          </div>
        </section>

        <section className="dimension-block">
          <h2>Our Advice</h2>
          <div className="advice-box">
            <p>{data.advice}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Styles for the 4-layer report
 */
export const Class11ReportStyles = `
.sheet {
  page-break-before: always;
  padding: 80px 60px;
  margin-bottom: 40px;
  background: white;
}

.sheet-header {
  margin-bottom: 60px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 40px;
}

.kicker {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 15px;
}

.sheet h1 {
  font-size: 42px;
  font-weight: 700;
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.sheet .subhead {
  font-size: 18px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.content {
  max-width: 900px;
}

.dimension-block {
  margin-bottom: 60px;
}

.dimension-block h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.dimension-block h3 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.dimension-block h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.dimension-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.dimension-icon {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f8f8;
}

.dimension-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Grid Layouts */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

/* Trait Cards */
.trait-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #2f6bff;
}

.trait-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 8px 0 0 0;
}

.trait-summary {
  margin-top: 20px;
  padding: 16px;
  background: #f0f4ff;
  border-radius: 8px;
  color: #333;
  line-height: 1.6;
}

/* RIASEC Bars */
.riasec-bars {
  margin-bottom: 30px;
}

.riasec-bar {
  display: grid;
  grid-template-columns: 100px 1fr 60px;
  gap: 12px;
  align-items: center;
  margin-bottom: 16px;
}

.bar-label {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code {
  font-weight: 700;
  font-size: 18px;
  color: #2f6bff;
}

.name {
  font-size: 14px;
  color: #666;
}

.bar-container {
  height: 8px;
  background: #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #0052ff);
  border-radius: 4px;
}

.bar-value {
  text-align: right;
  font-weight: 600;
  color: #1a1a1a;
}

.riasec-interpretation {
  background: #f0f4ff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 24px;
}

/* Aptitude Cards */
.aptitude-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.score-circle {
  width: 100px;
  height: 100px;
  margin: 12px auto;
  background: linear-gradient(135deg, #2f6bff, #0052ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score {
  font-size: 36px;
  font-weight: 700;
  color: white;
}

.interpretation {
  margin-top: 12px;
  color: #666;
  font-size: 14px;
}

/* Strength/Weakness */
.strength-weakness {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 24px;
}

.strength,
.area-to-improve {
  padding: 20px;
  border-radius: 8px;
}

.strength {
  background: #e8f5e9;
  border-left: 4px solid #12996b;
}

.area-to-improve {
  background: #fff3e0;
  border-left: 4px solid #e08a1e;
}

/* Stream Suitability */
.stream-suitability {
  margin-bottom: 20px;
}

.suitability-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid;
  border-radius: 8px;
  margin-bottom: 12px;
}

.badge-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.badge-text {
  font-weight: 600;
  font-size: 14px;
}

/* Subject Tags */
.subject-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.subject-tag {
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.subject-tag.strength {
  background: #e8f5e9;
  color: #12996b;
  border: 1px solid #12996b;
}

.subject-tag.challenge {
  background: #fff3e0;
  color: #e08a1e;
  border: 1px solid #e08a1e;
}

/* Career Pathways */
.career-pathways {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.pathway-card {
  padding: 16px;
  background: #f8f8f8;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

/* Degree Cards */
.degree-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.degree-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  position: relative;
}

.compatibility-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #2f6bff;
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
}

.badge-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

.badge-label {
  display: block;
  font-size: 10px;
  opacity: 0.9;
}

.degree-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.degree-details h4 {
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 600;
}

.degree-details ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.degree-details li {
  padding: 4px 0;
  color: #555;
}

.entrance-exam {
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  font-size: 13px;
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

.phase-content {
  flex: 1;
  padding-bottom: 20px;
}

.phase-focus {
  margin: 8px 0;
  color: #666;
}

.phase-actions,
.phase-outcomes {
  margin-top: 12px;
}

.phase-actions h5,
.phase-outcomes h5 {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.phase-actions ul,
.phase-outcomes ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.phase-actions li,
.phase-outcomes li {
  padding: 4px 0 4px 16px;
  color: #555;
  position: relative;
}

.phase-actions li::before,
.phase-outcomes li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #2f6bff;
}

/* Aspiration Section */
.aspiration-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 16px;
}

.clarity-badge {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  min-width: 100px;
}

.clarity-value {
  display: block;
  font-size: 28px;
  font-weight: 700;
  color: #2f6bff;
}

.clarity-label {
  display: block;
  font-size: 11px;
  color: #999;
  text-transform: uppercase;
  margin-top: 4px;
}

.alternative-careers {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.alt-career {
  padding: 12px 16px;
  background: #f0f4ff;
  border: 1px solid #2f6bff;
  border-radius: 8px;
  font-size: 14px;
  color: #2f6bff;
  font-weight: 500;
}

/* Alignment Analysis */
.alignment-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.alignment-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}

.alignment-card h4 {
  margin-bottom: 12px;
}

.alignment-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.alignment-fill {
  height: 100%;
  border-radius: 4px;
}

.alignment-percent {
  display: block;
  font-weight: 600;
  font-size: 14px;
  text-align: right;
}

.alignment-card.overall {
  grid-column: 1 / -1;
  max-width: 300px;
}

/* Advice Box */
.advice-box {
  background: #f0f4ff;
  padding: 24px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
  line-height: 1.6;
  color: #333;
}

/* Universities */
.university-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.university-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.university-card h4 {
  margin-bottom: 4px;
}

.location {
  color: #999;
  font-size: 13px;
  margin-bottom: 12px;
}

.programs,
.entrance {
  margin-bottom: 12px;
}

.programs h5,
.entrance h5 {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.programs ul,
.entrance ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
}

.programs li,
.entrance li {
  padding: 2px 0;
  color: #555;
}

.entrance p {
  font-size: 13px;
  margin: 4px 0;
}

/* Skills Table */
.skills-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 150px 120px 120px 200px 100px;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  align-items: center;
}

.table-header {
  background: #f8f8f8;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  color: #999;
}

.col {
  font-size: 13px;
  color: #555;
}

/* Action Lists */
.action-list {
  list-style: decimal;
  padding-left: 20px;
  margin: 0;
}

.action-list li {
  margin-bottom: 10px;
  color: #555;
  line-height: 1.6;
}

/* Learning Style Profile */
.learning-style {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}

.primary,
.secondary,
.exam-tech {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
}

.primary:last-of-type,
.secondary:last-of-type,
.exam-tech:last-of-type {
  border-bottom: none;
}

.label {
  color: #999;
  font-size: 13px;
  font-weight: 500;
}

.value {
  font-weight: 600;
  color: #1a1a1a;
}

/* EI Profile */
.ei-profile {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
}

.ei-metric {
  margin-bottom: 16px;
}

.ei-metric .label {
  display: block;
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
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
  margin-top: 8px;
}

/* Creativity Profile */
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

.creativity-score h4 {
  margin-bottom: 12px;
}

.creativity-level {
  color: #2f6bff;
  font-weight: 700;
  font-size: 18px;
}

.creativity-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.creativity-details > div {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
}

.creativity-details h4 {
  font-size: 13px;
  text-transform: uppercase;
  color: #999;
  margin-bottom: 8px;
}

/* Motivation Boxes */
.motivation-box {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.motivation-box p {
  margin: 0;
  color: #555;
  font-size: 14px;
}

/* Exam Cards */
.exam-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.exam-card {
  background: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #2f6bff;
}

.exam-card h4 {
  margin: 0;
}

/* Strength Domains */
.strength-domains {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

.strength-score {
  background: #2f6bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.examples {
  font-size: 12px;
  color: #666;
  margin: 0;
}

/* Explanation Text */
.explanation {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.tip {
  margin-top: 8px;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 4px;
  font-size: 13px;
  color: #2f6bff;
  font-style: italic;
}

/* Motivator Cards */
.motivator-card {
  background: #f8f8f8;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2f6bff;
}

.motivator-value {
  font-weight: 600;
  color: #1a1a1a;
  margin: 8px 0 0 0;
}

.motivator-summary {
  background: #f0f4ff;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
  color: #333;
  line-height: 1.6;
}

/* Warning Section */
.dimension-block.warning {
  background: #fff3f0;
  border-left: 4px solid #d73c3c;
  padding: 20px;
  border-radius: 8px;
}

/* Responsive */
@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }

  .degree-grid, .university-grid, .career-pathways {
    grid-template-columns: 1fr;
  }

  .aspiration-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .table-header, .table-row {
    grid-template-columns: 1fr;
  }

  .riasec-bar {
    grid-template-columns: 80px 1fr 50px;
  }
}
`;
