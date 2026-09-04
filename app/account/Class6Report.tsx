"use client";

/**
 * Class 6 Career Discovery Report
 * Developmental, exploratory format for young learners
 * No deterministic labeling - encourages exploration and growth
 */

import { format } from "date-fns";
import type { Class6ScoreOutput } from "@/lib/newAssessment/class6Scoring";

export function Class6Report({
  studentName,
  studentEmail,
  output,
}: {
  studentName: string;
  studentEmail: string;
  output: Class6ScoreOutput;
}) {
  const completedDate = new Date();

  return (
    <div className="class6-report">
      <style>{Class6CSS}</style>

      {/* ===== COVER PAGE ===== */}
      <section className="c6-sheet c6-cover">
        <div className="c6-cover-content">
          <img src="/onegrasp-logo-tight.png" alt="OneGrasp" className="c6-logo" />
          <h1 className="c6-title">Career Discovery Journey</h1>
          <p className="c6-subtitle">Class 6 Exploration Assessment</p>
          <div className="c6-cover-divider"></div>

          <div className="c6-student-info">
            <div className="c6-info-row">
              <span className="c6-label">Student Name:</span>
              <span className="c6-value">{studentName}</span>
            </div>
            <div className="c6-info-row">
              <span className="c6-label">Date:</span>
              <span className="c6-value">{format(completedDate, "dd MMM yyyy")}</span>
            </div>
          </div>

          <p className="c6-message">
            Welcome to your career discovery journey! This report shows what you enjoy, how you learn best,
            and career areas you might want to explore. Remember—you're still discovering your interests!
          </p>
        </div>
      </section>

      {/* ===== PERSONALITY PROFILE ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">Your Personality Style</h2>
          <div className="c6-personality-box">
            <div className="c6-type-display">{output.personalityProfile.type}</div>
            <p className="c6-description">
              This four-letter code shows how you prefer to interact with the world.
            </p>
            <div className="c6-preferences">
              <div className="c6-pref-item">
                <span className="c6-pref-label">Social Energy:</span>
                <span className="c6-pref-value">
                  {output.personalityProfile.ei === "E"
                    ? "Energized by people (Extroverted)"
                    : "Energized by quiet time (Introverted)"}
                </span>
              </div>
              <div className="c6-pref-item">
                <span className="c6-pref-label">Information:</span>
                <span className="c6-pref-value">
                  {output.personalityProfile.sn === "S"
                    ? "Focus on facts and details (Sensing)"
                    : "Focus on ideas and possibilities (Intuition)"}
                </span>
              </div>
              <div className="c6-pref-item">
                <span className="c6-pref-label">Decision-Making:</span>
                <span className="c6-pref-value">
                  {output.personalityProfile.tf === "T"
                    ? "Logic and fairness (Thinking)"
                    : "Values and feelings (Feeling)"}
                </span>
              </div>
              <div className="c6-pref-item">
                <span className="c6-pref-label">Planning:</span>
                <span className="c6-pref-value">
                  {output.personalityProfile.jp === "J"
                    ? "Likes planning (Judging)"
                    : "Flexible and spontaneous (Perceiving)"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CAREER INTERESTS (RIASEC) ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">Your Career Interests</h2>
          <p className="c6-description">
            Here's what kinds of activities excite you most. These are your top interests:
          </p>
          <div className="c6-interest-grid">
            {output.riasecScores.slice(0, 3).map((r, idx) => (
              <div key={r.letter} className="c6-interest-card">
                <div className="c6-interest-rank">#{idx + 1}</div>
                <div className="c6-interest-letter">{r.letter}</div>
                <div className="c6-interest-name">{r.name.split("(")[0].trim()}</div>
                <div className="c6-interest-bar">
                  <div className="c6-interest-fill" style={{ width: `${r.score}%` }}></div>
                </div>
                <div className="c6-interest-score">{r.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STRENGTHS ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">Your Top Strengths</h2>
          <p className="c6-description">
            Different people are smart in different ways. Here are your strongest areas:
          </p>
          <div className="c6-strengths-list">
            {output.strengthDomains.slice(0, 3).map((s) => (
              <div key={s.name} className="c6-strength-item">
                <div className="c6-strength-name">{s.name}</div>
                <div className="c6-strength-bar">
                  <div className="c6-strength-fill" style={{ width: `${s.score}%` }}></div>
                </div>
                <div className="c6-strength-score">{s.score}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOTIVATORS ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">What Motivates You?</h2>
          <p className="c6-description">
            These are the things that make you want to tackle challenges:
          </p>
          <div className="c6-motivators-list">
            {output.motivators.slice(0, 3).map((m) => (
              <div key={m.name} className="c6-motivator-item">
                <span className="c6-motivator-icon">🎯</span>
                <div className="c6-motivator-content">
                  <div className="c6-motivator-name">{m.name}</div>
                  <div className="c6-motivator-bar">
                    <div className="c6-motivator-fill" style={{ width: `${m.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LEARNING STYLE ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">How You Learn Best</h2>
          <p className="c6-description">
            Your preferred learning style: <strong>{output.learningStyle.primary}</strong>
          </p>
          <div className="c6-learning-tips">
            {output.learningStyle.primary === "Visual" && (
              <ul>
                <li>Use diagrams, pictures, and videos to understand new concepts</li>
                <li>Take notes with colors and drawings</li>
                <li>Watch demonstrations before trying something yourself</li>
              </ul>
            )}
            {output.learningStyle.primary === "Auditory" && (
              <ul>
                <li>Listen to explanations and discussions</li>
                <li>Talk through problems with friends</li>
                <li>Record lessons and listen to them again</li>
              </ul>
            )}
            {output.learningStyle.primary === "Reading" && (
              <ul>
                <li>Read books and articles about topics you're interested in</li>
                <li>Write down what you learn</li>
                <li>Create study guides and summaries</li>
              </ul>
            )}
            {output.learningStyle.primary === "Kinesthetic" && (
              <ul>
                <li>Learn by doing—hands-on projects and experiments</li>
                <li>Move around while studying</li>
                <li>Try things out rather than just reading about them</li>
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ===== RECOMMENDED CAREERS TO EXPLORE ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">Career Areas to Explore</h2>
          <p className="c6-description">
            Based on your interests and strengths, here are fields you might enjoy exploring:
          </p>
          <div className="c6-domains-grid">
            {output.domainAffinities.slice(0, 4).map((d) => (
              <div key={d.domain} className="c6-domain-card">
                <div className="c6-domain-rank">#{d.domain}</div>
                <h3 className="c6-domain-title">{d.domainName}</h3>
                <div className="c6-domain-affinity">Explore Score: {d.affinity}%</div>
                <div className="c6-domain-bar">
                  <div className="c6-domain-fill" style={{ width: `${d.affinity}%` }}></div>
                </div>
                {d.reasoning.length > 0 && (
                  <p className="c6-domain-why">Why: {d.reasoning[0]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== YOUR SUMMARY ===== */}
      <section className="c6-sheet">
        <div className="c6-content">
          <h2 className="c6-section-title">Your Summary</h2>
          <div className="c6-summary-box">
            <p>{output.summary}</p>
          </div>

          <h3 className="c6-subsection-title">Next Steps for Exploration:</h3>
          <div className="c6-next-steps">
            <div className="c6-step">
              <span className="c6-step-number">1</span>
              <div>
                <strong>Try new activities:</strong> Join clubs and activities in school that match your
                interests
              </div>
            </div>
            <div className="c6-step">
              <span className="c6-step-number">2</span>
              <div>
                <strong>Ask questions:</strong> Talk to teachers, parents, and older students about
                careers that interest you
              </div>
            </div>
            <div className="c6-step">
              <span className="c6-step-number">3</span>
              <div>
                <strong>Keep learning:</strong> Develop your strengths and try new things
              </div>
            </div>
            <div className="c6-step">
              <span className="c6-step-number">4</span>
              <div>
                <strong>Reassess later:</strong> Your interests may change—that's completely normal!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <section className="c6-sheet c6-footer">
        <div className="c6-content">
          <p className="c6-footer-text">
            This report is a starting point for exploration, not a final answer. Your interests and strengths
            will grow and change as you learn more about yourself and the world.
          </p>
          <p className="c6-footer-text">Keep exploring! 🚀</p>
        </div>
      </section>
    </div>
  );
}

const Class6CSS = `
  .class6-report {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1f2937;
    background: #f9fafb;
  }

  .c6-sheet {
    background: white;
    page-break-after: always;
    page-break-inside: avoid;
    padding: 40px;
    min-height: 297mm;
    display: flex;
    flex-direction: column;
  }

  .c6-cover {
    background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
    color: white;
    justify-content: space-between;
  }

  .c6-cover-content {
    text-align: center;
  }

  .c6-logo {
    height: 60px;
    width: auto;
    margin-bottom: 30px;
    filter: brightness(0) invert(1);
  }

  .c6-title {
    font-size: 48px;
    font-weight: 700;
    margin: 20px 0;
    line-height: 1.2;
  }

  .c6-subtitle {
    font-size: 20px;
    opacity: 0.95;
    margin-bottom: 20px;
  }

  .c6-cover-divider {
    width: 80px;
    height: 3px;
    background: white;
    margin: 20px auto;
  }

  .c6-student-info {
    margin: 40px 0;
    background: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 8px;
  }

  .c6-info-row {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 10px 0;
    font-size: 16px;
  }

  .c6-label {
    font-weight: 600;
  }

  .c6-message {
    font-size: 14px;
    line-height: 1.6;
    opacity: 0.9;
    max-width: 600px;
    margin: 30px auto 0;
  }

  .c6-content {
    flex: 1;
  }

  .c6-section-title {
    font-size: 28px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 20px;
    border-bottom: 3px solid #3b82f6;
    padding-bottom: 10px;
  }

  .c6-subsection-title {
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #1f2937;
  }

  .c6-description {
    font-size: 15px;
    color: #4b5563;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .c6-personality-box {
    background: #f3f4f6;
    padding: 25px;
    border-radius: 12px;
    border-left: 4px solid #3b82f6;
  }

  .c6-type-display {
    font-size: 36px;
    font-weight: 700;
    color: #3b82f6;
    margin-bottom: 15px;
    letter-spacing: 2px;
  }

  .c6-preferences {
    margin-top: 20px;
  }

  .c6-pref-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
  }

  .c6-pref-label {
    font-weight: 600;
    color: #1f2937;
  }

  .c6-pref-value {
    color: #4b5563;
    text-align: right;
    max-width: 60%;
  }

  .c6-interest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .c6-interest-card {
    background: linear-gradient(135deg, #3b82f6 0%, #1e3a8a 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
  }

  .c6-interest-rank {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 10px;
  }

  .c6-interest-letter {
    font-size: 36px;
    font-weight: 700;
    margin: 10px 0;
  }

  .c6-interest-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .c6-interest-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .c6-interest-fill {
    height: 100%;
    background: white;
  }

  .c6-interest-score {
    font-size: 14px;
    font-weight: 700;
  }

  .c6-strengths-list,
  .c6-motivators-list {
    margin-top: 20px;
  }

  .c6-strength-item,
  .c6-motivator-item {
    margin-bottom: 20px;
  }

  .c6-strength-name,
  .c6-motivator-name {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 8px;
    font-size: 15px;
  }

  .c6-strength-bar,
  .c6-motivator-bar {
    height: 8px;
    background: #e5e7eb;
    border-radius: 4px;
    overflow: hidden;
  }

  .c6-strength-fill,
  .c6-motivator-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #10b981);
  }

  .c6-strength-score,
  .c6-motivator-score {
    font-size: 13px;
    color: #6b7280;
    margin-top: 5px;
    font-weight: 600;
  }

  .c6-motivator-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .c6-motivator-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .c6-motivator-content {
    flex: 1;
  }

  .c6-learning-tips {
    background: #f0fdf4;
    border-left: 4px solid #10b981;
    padding: 20px;
    border-radius: 8px;
    margin-top: 15px;
  }

  .c6-learning-tips ul {
    margin: 0;
    padding-left: 20px;
  }

  .c6-learning-tips li {
    margin: 10px 0;
    color: #1f2937;
    font-size: 14px;
  }

  .c6-domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .c6-domain-card {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    position: relative;
  }

  .c6-domain-rank {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #3b82f6;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 14px;
  }

  .c6-domain-title {
    font-size: 16px;
    font-weight: 700;
    color: #1f2937;
    margin: 0 0 10px 0;
    padding-right: 40px;
  }

  .c6-domain-affinity {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 10px;
  }

  .c6-domain-bar {
    height: 6px;
    background: #e5e7eb;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .c6-domain-fill {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #10b981);
  }

  .c6-domain-why {
    font-size: 12px;
    color: #4b5563;
    margin: 0;
    font-style: italic;
  }

  .c6-summary-box {
    background: #f0f9ff;
    border: 2px solid #bfdbfe;
    border-radius: 12px;
    padding: 25px;
    font-size: 16px;
    line-height: 1.8;
    color: #1f2937;
  }

  .c6-next-steps {
    margin-top: 20px;
  }

  .c6-step {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .c6-step-number {
    background: #3b82f6;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
  }

  .c6-step div {
    color: #1f2937;
    font-size: 15px;
    line-height: 1.6;
  }

  .c6-footer {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    text-align: center;
  }

  .c6-footer-text {
    font-size: 14px;
    color: #4b5563;
    margin: 15px 0;
    line-height: 1.6;
  }

  @media print {
    .class6-report {
      background: white;
    }
    .c6-sheet {
      margin: 0;
      border: none;
      box-shadow: none;
    }
  }
`;
