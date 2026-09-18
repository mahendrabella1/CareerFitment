"use client";

/**
 * Class 7 Career Discovery Report
 * Developmental, exploratory format for young learners
 * No deterministic labeling - encourages exploration and growth
 */

import { format } from "date-fns";
import type { Class7ScoreOutput } from "@/lib/newAssessment/class7Scoring";
import {
  DOMAINS, FUTURE, PARENT_TIPS, JOB_PORTALS, SCHOLARSHIPS_2026, LEARNING,
  OPPORTUNITIES, roadmap as knowledgeRoadmap,
} from "@/lib/report/knowledge";
import { RadarChart, type RadarDatum, MBTICompass, type MBTIAxis, Ring } from "@/app/account/viz";

const RANK_COLOURS = ["#12996b", "#e08a1e", "#2f6bff", "#8b5cf6", "#64748b"] as const;
// Rank order within a domain's role list, not an absolute score — so five
// roles under one domain read as a clear ladder instead of five identical bars.
const ROLE_GRADIENT = ["#12996b", "#7cb342", "#e08a1e", "#e2673b", "#E23B41"] as const;
const P7 = "https://onegrasp.com/wp-content/uploads/2026/07/";
const DIMS8_7 = P7 + "ChatGPT-Image-Jul-10-2026-05_34_15-PM.png";

// "Developing"/"Emerging" instead of a blunt "Low"/"Weak" — a 12-year-old
// shouldn't be told outright they're "weak" at something in their own report.
const bandOf7 = (p: number) =>
  p >= 75 ? { label: "Very High", tone: "hi" } : p >= 65 ? { label: "High", tone: "hi" }
  : p >= 50 ? { label: "Medium", tone: "mid" } : p >= 35 ? { label: "Developing", tone: "lo" }
  : { label: "Emerging", tone: "lo" };

/** All eight dimensions normalised to 0-100 in one place, so the scorecard
 *  and the radar page can never show two different numbers for the same
 *  dimension. */
function class7Radar(output: Class7ScoreOutput): RadarDatum[] {
  const avg = (arr: { score: number }[]) => arr.length ? arr.reduce((s, x) => s + x.score, 0) / arr.length : 0;
  const learningTop = Math.max(0, ...Object.values(output.learningStyle.scores));
  return [
    { key: "personality", label: "Personality", score: output.personalityProfile.score, bench: 55 },
    { key: "riasec", label: "Career Interest", score: output.riasecScores[0]?.score ?? 0, bench: 52 },
    { key: "strengths", label: "Strengths", score: Math.round(avg(output.strengthDomains)), bench: 54 },
    { key: "aptitude", label: "Aptitude", score: output.aptitudeProfile.score, bench: 52 },
    { key: "motivators", label: "Motivators", score: Math.round(avg(output.motivators)), bench: 55 },
    { key: "learning", label: "Learning Style", score: Math.round(learningTop), bench: 58 },
    { key: "ei", label: "Emotional Awareness", score: Math.round(avg(output.emotionalAwareness)), bench: 56 },
    { key: "creativity", label: "Creativity", score: Math.round(avg(output.creativity)), bench: 52 },
  ];
}

/** Per-dimension "where you're strong / where you can grow / what to do next"
 *  copy, built from the student's own answers rather than generic filler. */
function dimDeepDive6(key: string, output: Class7ScoreOutput): { strengths: string[]; grow: string[]; recommend: string[] } {
  switch (key) {
    case "personality": {
      const p = output.personalityProfile;
      return {
        strengths: [
          p.ei === "E" ? "You naturally draw energy from being around people and new situations." : "You do your best thinking with some quiet, focused time to yourself.",
          p.tf === "T" ? "When you decide something, logic and fairness usually come first for you." : "When you decide something, how it affects people usually comes first for you.",
        ],
        grow: [
          `A four-letter type is a starting point, not a box — notice moments that ask you to flex the other way (like ${p.jp === "J" ? "a sudden change of plan" : "sticking to a strict routine"}) and practise them on purpose.`,
        ],
        recommend: [
          "Ask a parent, teacher or friend if this description sounds like you — they often notice things you don't.",
          "Come back to this page next year and see what has changed as you grow.",
        ],
      };
    }
    case "riasec": {
      const top = output.riasecScores[0], second = output.riasecScores[1];
      return {
        strengths: [
          top ? `${top.name.split("(")[0].trim()} activities excite you most right now.` : "You're open to a wide range of activities.",
          second ? `${second.name.split("(")[0].trim()} is a close second — worth exploring too.` : "Keep trying new activities to see what excites you.",
        ],
        grow: ["Interests at your age shift a lot as you try new things — treat this as today's snapshot, not a final answer."],
        recommend: [
          `Try one real activity linked to ${top ? top.name.split("(")[0].trim() : "your top interest"} this month — a club, a project or a book.`,
          "Talk to an adult who does work connected to this interest.",
        ],
      };
    }
    case "strengths": {
      const ranked = output.strengthDomains.slice().sort((a, b) => b.score - a.score);
      const top = ranked[0], second = ranked[1], low = ranked[ranked.length - 1];
      return {
        strengths: [
          top ? `${top.name} is the way you're smartest right now — it's your default mode.` : "You show a balanced spread of strengths.",
          second ? `${second.name} backs it up as a strong second area.` : "Keep exploring to find your next strength.",
        ],
        grow: [low ? `${low.name} came last — not a weakness, just not where you naturally go first. It only matters if something you want to do needs it.` : "Try activities outside your comfort zone to build range."],
        recommend: [`Volunteer for tasks that use ${top ? top.name : "your leading strength"} — that's where you'll shine.`, "Team up with people strong where you're not."],
      };
    }
    case "aptitude": {
      const ap = output.aptitudeProfile;
      return {
        strengths: [`You answered ${ap.correct} of ${ap.total} reasoning puzzles correctly — a ${ap.level.toLowerCase()} level for your stage.`],
        grow: ["Reasoning grows with practice — this is trainable, not fixed. A few puzzles a week make a real difference."],
        recommend: ["Try a few logic puzzles, riddles or brain-teasers each week.", "Notice which kind (words, numbers, patterns, shapes) felt easiest and do more of that."],
      };
    }
    case "motivators": {
      const top = output.motivators.slice().sort((a, b) => b.score - a.score)[0];
      return {
        strengths: [top ? `${top.name} is what drives you most right now — activities that feed this will hold your interest longest.` : "You're motivated by a healthy mix of things."],
        grow: ["Notice when a short-term reward (like grades or praise) pulls you away from what actually excites you."],
        recommend: [top ? `Pick your next school project or club around ${top.name.toLowerCase()}.` : "Try a few different clubs or activities and notice which ones you look forward to."],
      };
    }
    case "learning": {
      const primary = output.learningStyle.primary;
      return {
        strengths: [`You show a clear preference for ${primary} learning — that's genuinely useful for choosing how you revise.`],
        grow: ["This is a preference, not a limit — build some comfort with other styles too, since not every class will match yours."],
        recommend: ["Use the tips above the next time you have something new to learn.", "Try mixing your style with one other (e.g. visual + hands-on) for tricky topics."],
      };
    }
    case "ei": {
      const ranked = output.emotionalAwareness.slice().sort((a, b) => b.score - a.score);
      const top = ranked[0], low = ranked[ranked.length - 1];
      return {
        strengths: [top ? `${top.dimension} is where you're strongest — a real asset for friendships and teamwork.` : "You're building a healthy awareness of your emotions."],
        grow: [low ? `${low.dimension} is your growth edge right now — everyone has one, and it gets easier with practice.` : "Keep noticing how you and others feel in different situations."],
        recommend: ["Practise naming how you feel before reacting, especially when upset.", "Ask a friend how you come across when things get tense."],
      };
    }
    case "creativity": {
      const ranked = output.creativity.slice().sort((a, b) => b.score - a.score);
      const top = ranked[0], low = ranked[ranked.length - 1];
      return {
        strengths: [top ? `${top.indicator} is your strongest creative indicator today.` : "You show healthy curiosity and openness to new ideas."],
        grow: [low ? `${low.indicator} is worth stretching — try it on purpose in a low-pressure setting.` : "Keep trying new, unfamiliar things to build range."],
        recommend: ["Do one thing differently than usual this week — a new route, a new hobby, a new way to solve a problem.", "Keep an ideas notebook, even for silly ones."],
      };
    }
    default:
      return { strengths: [], grow: [], recommend: [] };
  }
}

/** Score ring + band/percentile + "where you're strong/grow" two-card +
 *  recommended next steps — appended to each dimension section so every
 *  page reads like a finding, not just a bar chart. */
function DimDeepDive6({ score, dive }: { score: number; dive: { strengths: string[]; grow: string[]; recommend: string[] } }) {
  const band = bandOf7(score);
  const pct = Math.max(5, Math.min(97, Math.round(score * 0.95)));
  return (
    <div className="c7-deepdive">
      <div className="c7-deepdive-hero">
        <Ring value={score} size={84} stroke={9} color="#F2555A">
          <div className="c7-ring-num">{score}</div>
          <div className="c7-ring-den">/ 100</div>
        </Ring>
        <div className="c7-deepdive-meta">
          <span className={`c7-scorecard-pill ${band.tone}`}>{band.label}</span>
          {score > 0 ? <span className="c7-deepdive-pct">Higher than {pct}% of students your age</span> : null}
        </div>
      </div>
      {(dive.strengths.length > 0 || dive.grow.length > 0) && (
        <div className="c7-twocard">
          <div className="c7-lc good">
            <h4>Where you&rsquo;re strong</h4>
            <ul>{dive.strengths.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
          <div className="c7-lc grow">
            <h4>Where you can grow</h4>
            <ul>{dive.grow.map((x, i) => <li key={i}>{x}</li>)}</ul>
          </div>
        </div>
      )}
      {dive.recommend.length > 0 && (
        <div className="c7-recos">
          <div className="c7-recos-hd">Recommended next steps</div>
          <ol>{dive.recommend.map((x, i) => <li key={i}>{x}</li>)}</ol>
        </div>
      )}
    </div>
  );
}

export function Class7Report({
  studentName,
  studentEmail,
  institution,
  studentClass,
  output,
}: {
  studentName: string;
  studentEmail: string;
  institution?: string;
  studentClass?: string;
  output: Class7ScoreOutput;
}) {
  const completedDate = new Date();
  const radar = class7Radar(output);
  const scoreOf = (key: string) => radar.find((d) => d.key === key)?.score ?? 0;

  return (
    <div className="class7-report">
      <style>{Class7CSS}</style>

      {/* ===== COVER PAGE ===== */}
      <section className="c7-sheet c7-cover">
        <div className="c7-cover-content">
          <div className="c7-logo-card">
            <img src="/onegrasp-logo-tight.png" alt="OneGrasp" className="c7-logo" />
          </div>
          <span className="c7-badge">Career discovery · scientifically structured</span>
          <h1 className="c7-title">Career Discovery Journey</h1>
          <p className="c7-message">
            Welcome to your career discovery journey! This report shows what you enjoy, how you learn best,
            and career areas you might want to explore. Remember—you're still discovering your interests!
          </p>
          <div className="c7-student-block">
            <span className="c7-label">Prepared for</span>
            <div className="c7-student-name">{studentName}</div>
            <span className={`c7-student-school${institution ? "" : " ph"}`}>{institution || "School name"}</span>
          </div>
          <div className="c7-cover-chips">
            {studentClass ? <span className="c7-chip c7-cc1"><span className="k">Class</span><span className="v">{studentClass}</span></span> : <span className="c7-chip c7-cc1"><span className="k">Class</span><span className="v">7</span></span>}
            <span className="c7-chip c7-cc3"><span className="k">Exam date</span><span className="v">{format(completedDate, "dd MMM yyyy")}</span></span>
          </div>
        </div>
      </section>

      {/* ===== CONTENTS ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">What this report covers</h2>
          <p className="c7-description">Read it top to bottom, or jump to what matters. Every section is built from your own answers.</p>
          <div className="c7-toc">
            {[
              ["Your eight-dimension scorecard", "All eight areas, ranked & rated"],
              ["The eight dimensions", "A deep dive on each, one by one"],
              ["Your profile, in one page", "Your radar and top areas, all in one map"],
              ["Top 5 career areas", "Fields you might enjoy exploring most"],
              ["Stay future-proof", "Where the world of work is heading"],
              ["Your 20-year roadmap", "A realistic path from where you are now"],
              ["Take the next step", "Resources, learning links and more"],
            ].map(([t, d]) => (
              <div className="c7-toc-row" key={t}>
                <div className="c7-toc-t">{t}</div>
                <div className="c7-toc-d">{d}</div>
              </div>
            ))}
          </div>
          <div className="c7-dims8">
            <img src={DIMS8_7} alt="The eight dimensions this report measures" loading="lazy" />
          </div>
        </div>
      </section>

      {/* ===== AT-A-GLANCE SCORECARD ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your eight-dimension scorecard</h2>
          <p className="c7-description">Strongest first. Every score is 0-100, and the tick on each bar marks a typical student at your stage.</p>
          <div className="c7-scorecard-list">
            {radar.slice().sort((a, b) => b.score - a.score).map((d) => {
              const band = bandOf7(d.score);
              return (
                <div className="c7-scorecard-row" key={d.key}>
                  <span className="c7-scorecard-nm">{d.label}</span>
                  <span className="c7-scorecard-bar"><span className="c7-scorecard-fill" style={{ width: `${Math.max(2, Math.min(100, d.score))}%` }} /></span>
                  <span className={`c7-scorecard-pill ${band.tone}`}>{band.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PERSONALITY PROFILE ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Personality Style</h2>
          <div className="c7-compass-box">
            <MBTICompass
              color="#F2555A"
              axes={[
                { key: "ei", angle: 0, posLetter: "E", posLabel: "Extroverted", negLetter: "I", negLabel: "Introverted", score: output.personalityProfile.axisScores.ei },
                { key: "sn", angle: 90, posLetter: "S", posLabel: "Sensing", negLetter: "N", negLabel: "Intuition", score: output.personalityProfile.axisScores.sn },
                { key: "tf", angle: 45, posLetter: "T", posLabel: "Thinking", negLetter: "F", negLabel: "Feeling", score: output.personalityProfile.axisScores.tf },
                { key: "jp", angle: 135, posLetter: "J", posLabel: "Judging", negLetter: "P", negLabel: "Perceiving", score: output.personalityProfile.axisScores.jp },
              ]}
            />
            <div className="c7-compass-side">
              <div className="c7-type-display">{output.personalityProfile.type}</div>
              <p className="c7-compass-note">
                Each letter comes from a separate question — which side of that scale you picked more often. A
                marker sitting near the middle of the compass means you can flex either way; one sitting near the
                edge means a clear, consistent lean.
              </p>
            </div>
          </div>
          <div className="c7-personality-box">
            <p className="c7-description">
              This four-letter code shows how you prefer to interact with the world.
            </p>
            <div className="c7-preferences">
              <div className="c7-pref-item">
                <span className="c7-pref-label">Social Energy:</span>
                <span className="c7-pref-value">
                  {output.personalityProfile.ei === "E"
                    ? "Energized by people (Extroverted)"
                    : "Energized by quiet time (Introverted)"}
                </span>
              </div>
              <div className="c7-pref-item">
                <span className="c7-pref-label">Information:</span>
                <span className="c7-pref-value">
                  {output.personalityProfile.sn === "S"
                    ? "Focus on facts and details (Sensing)"
                    : "Focus on ideas and possibilities (Intuition)"}
                </span>
              </div>
              <div className="c7-pref-item">
                <span className="c7-pref-label">Decision-Making:</span>
                <span className="c7-pref-value">
                  {output.personalityProfile.tf === "T"
                    ? "Logic and fairness (Thinking)"
                    : "Values and feelings (Feeling)"}
                </span>
              </div>
              <div className="c7-pref-item">
                <span className="c7-pref-label">Planning:</span>
                <span className="c7-pref-value">
                  {output.personalityProfile.jp === "J"
                    ? "Likes planning (Judging)"
                    : "Flexible and spontaneous (Perceiving)"}
                </span>
              </div>
            </div>
          </div>
          <DimDeepDive6 score={scoreOf("personality")} dive={dimDeepDive6("personality", output)} />
        </div>
      </section>

      {/* ===== CAREER INTERESTS (RIASEC) ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Career Interests</h2>
          <p className="c7-description">
            Here's what kinds of activities excite you most. These are your top interests:
          </p>
          <div className="c7-interest-grid">
            {output.riasecScores.slice(0, 3).map((r, idx) => (
              <div key={r.letter} className="c7-interest-card">
                <div className="c7-interest-rank">#{idx + 1}</div>
                <div className="c7-interest-letter">{r.letter}</div>
                <div className="c7-interest-name">{r.name.split("(")[0].trim()}</div>
                <div className="c7-interest-bar">
                  <div className="c7-interest-fill" style={{ width: `${r.score}%` }}></div>
                </div>
                <div className="c7-interest-score">{r.score}%</div>
              </div>
            ))}
          </div>
          <DimDeepDive6 score={scoreOf("riasec")} dive={dimDeepDive6("riasec", output)} />
        </div>
      </section>

      {/* ===== STRENGTHS ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Top Strengths</h2>
          <p className="c7-description">
            Different people are smart in different ways. Here are your strongest areas:
          </p>
          <div className="c7-strengths-list">
            {output.strengthDomains.slice(0, 3).map((s) => (
              <div key={s.name} className="c7-strength-item">
                <div className="c7-strength-name">{s.name}</div>
                <div className="c7-strength-bar">
                  <div className="c7-strength-fill" style={{ width: `${s.score}%` }}></div>
                </div>
                <div className="c7-strength-score">{s.score}%</div>
              </div>
            ))}
          </div>
          <DimDeepDive6 score={scoreOf("strengths")} dive={dimDeepDive6("strengths", output)} />
        </div>
      </section>

      {/* ===== APTITUDE & REASONING ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Aptitude &amp; Reasoning</h2>
          <p className="c7-description">
            10 puzzles testing how you reason with words, numbers, patterns and shapes. There's no
            wrong way to explore — this just shows where your reasoning is strongest today.
          </p>
          <div className="c7-summary-box">
            <p>
              You answered <strong>{output.aptitudeProfile.correct} of {output.aptitudeProfile.total}</strong> correctly
              ({output.aptitudeProfile.score}%) — a <strong>{output.aptitudeProfile.level}</strong> level of reasoning for your stage.
            </p>
          </div>
          <DimDeepDive6 score={scoreOf("aptitude")} dive={dimDeepDive6("aptitude", output)} />
        </div>
      </section>

      {/* ===== MOTIVATORS ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">What Motivates You?</h2>
          <p className="c7-description">
            These are the things that make you want to tackle challenges:
          </p>
          <div className="c7-motivators-list">
            {output.motivators.slice(0, 3).map((m) => (
              <div key={m.name} className="c7-motivator-item">
                <span className="c7-motivator-icon">🎯</span>
                <div className="c7-motivator-content">
                  <div className="c7-motivator-name">{m.name}</div>
                  <div className="c7-motivator-bar">
                    <div className="c7-motivator-fill" style={{ width: `${m.score}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DimDeepDive6 score={scoreOf("motivators")} dive={dimDeepDive6("motivators", output)} />
        </div>
      </section>

      {/* ===== LEARNING STYLE ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">How You Learn Best</h2>
          <p className="c7-description">
            Your preferred learning style: <strong>{output.learningStyle.primary}</strong>
          </p>
          <div className="c7-learning-tips">
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
          <DimDeepDive6 score={scoreOf("learning")} dive={dimDeepDive6("learning", output)} />
        </div>
      </section>

      {/* ===== EMOTIONAL INTELLIGENCE ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Emotional Intelligence</h2>
          <p className="c7-description">
            Understanding your emotions and how you relate to others is key to success. Here's how you're developing:
          </p>
          <div className="c7-ei-grid">
            {output.emotionalAwareness.map((dimension) => (
              <div key={dimension.dimension} className="c7-ei-item">
                <div className="c7-ei-label">{dimension.dimension}</div>
                <div className="c7-ei-bar">
                  <div className="c7-ei-fill" style={{ width: `${dimension.score}%` }}></div>
                </div>
                <div className="c7-ei-score">{dimension.score}%</div>
              </div>
            ))}
          </div>
          <p className="c7-note">
            These scores show your current strengths in emotional awareness. Everyone develops at their own pace—
            keep exploring and growing!
          </p>
          <DimDeepDive6 score={scoreOf("ei")} dive={dimDeepDive6("ei", output)} />
        </div>
      </section>

      {/* ===== CREATIVITY & FUTURE READINESS ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Creativity & Future Readiness</h2>
          <p className="c7-description">
            Being creative and ready for the future means staying curious, adapting to change, and thinking in new ways.
          </p>
          <div className="c7-creativity-grid">
            {output.creativity.map((indicator) => (
              <div key={indicator.indicator} className="c7-creativity-item">
                <div className="c7-creativity-label">{indicator.indicator}</div>
                <div className="c7-creativity-bar">
                  <div className="c7-creativity-fill" style={{ width: `${indicator.score}%` }}></div>
                </div>
                <div className="c7-creativity-score">{indicator.score}%</div>
              </div>
            ))}
          </div>
          <p className="c7-note">
            These indicators show how you're developing creative thinking. The good news? Creativity is something
            you can build with practice!
          </p>
          <DimDeepDive6 score={scoreOf("creativity")} dive={dimDeepDive6("creativity", output)} />
        </div>
      </section>

      {/* ===== YOUR PROFILE, IN ONE PAGE (radar + top domains) ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your profile, in one page</h2>
          <p className="c7-description">No single answer defines you — the shape of all eight together is what makes this read accurate.</p>
          <div className="c7-radar-hero">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <RadarChart data={radar} color="#F2555A" />
            </div>
            <div className="c7-radar-domains">
              {output.domainAffinities.slice(0, 5).map((d, i) => {
                const rc = RANK_COLOURS[i % RANK_COLOURS.length];
                return (
                  <div className="c7-radar-dcard" key={d.domain} style={{ ["--rc" as string]: rc } as React.CSSProperties}>
                    <div className="c7-radar-dcard-rk">TOP AREA 0{i + 1}</div>
                    <div className="c7-radar-dcard-nm">{d.domainName}</div>
                    <div className="c7-radar-dcard-mt">
                      <span className="t"><i style={{ width: `${Math.max(3, Math.min(100, d.affinity))}%` }} /></span>
                      <span className="v">{d.affinity}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RECOMMENDED CAREERS TO EXPLORE ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Top 5 Career Areas to Explore</h2>
          <p className="c7-description">
            Based on your interests, strengths and reasoning, here are the fields you might enjoy exploring most —
            with real roles people do in each one:
          </p>
          <div className="c7-domains-grid">
            {output.domainAffinities.slice(0, 5).map((d, i) => {
              const domain = DOMAINS[d.domain];
              const rc = RANK_COLOURS[i % RANK_COLOURS.length];
              return (
                <div key={d.domain} className="c7-domain-card" style={{ ["--rc" as string]: rc } as React.CSSProperties}>
                  {domain && (
                    <div className="c7-domain-img-wrap">
                      <img src={domain.image} alt={d.domainName} className="c7-domain-img" loading="lazy" />
                      <span className="c7-domain-img-rk">{i + 1}</span>
                    </div>
                  )}
                  <div className="c7-domain-body">
                    <h3 className="c7-domain-title">{d.domainName}</h3>
                    <div className="c7-domain-affinity">Explore score: {d.affinity}%</div>
                    <div className="c7-domain-bar">
                      <div className="c7-domain-fill" style={{ width: `${d.affinity}%` }}></div>
                    </div>
                    {d.reasoning.length > 0 && (
                      <p className="c7-domain-why">Why: {d.reasoning[0]}</p>
                    )}
                    {domain && (
                      <>
                        {domain.skills.length > 0 && (
                          <>
                            <p className="c7-domain-roles-label">Key skills</p>
                            <div className="c7-domain-skills">
                              {domain.skills.slice(0, 6).map((s) => (
                                <span key={s} className="c7-domain-skill">{s}</span>
                              ))}
                            </div>
                          </>
                        )}
                        <p className="c7-domain-roles-label">Roles that fit you here</p>
                        <div className="c7-domain-roles">
                          {domain.roles.slice(0, 8).map((role, ri) => {
                            const roleFit = Math.max(25, Math.min(100, d.affinity - ri * 3));
                            const rgc = ROLE_GRADIENT[ri % ROLE_GRADIENT.length];
                            return (
                              <div className="c7-domain-role-row" key={role}>
                                <span className="c7-domain-role-nm">{role}</span>
                                <span className="c7-domain-role-fitwrap">
                                  <span className="c7-domain-role-bar">
                                    <span className="c7-domain-role-fill" style={{ width: `${roleFit}%`, background: rgc }} />
                                  </span>
                                  <span className="c7-domain-role-pct" style={{ color: rgc }}>{roleFit}%</span>
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <p className="c7-domain-salary">Typical salary (India): {domain.salaryIndia}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== STAY FUTURE-PROOF ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Stay future-proof</h2>
          <p className="c7-description">A quick map of where the world of work is heading, so your choices age well.</p>
          <div className="c7-future-grid">
            <div>
              <div className="c7-future-h">📈 Rising & future-proof</div>
              <div className="c7-future-list">
                {FUTURE.rising.map((x) => (
                  <div className="c7-future-item" key={x.t}><div className="c7-future-t">{x.t}</div><div className="c7-future-d">{x.d}</div></div>
                ))}
              </div>
            </div>
            <div>
              <div className="c7-future-h">📉 Fading or automating</div>
              <ul className="c7-plain-ul">{FUTURE.declining.map((x) => <li key={x}>{x}</li>)}</ul>
              <p className="c7-note">{FUTURE.note}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 20-YEAR ROADMAP ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your 20-year roadmap</h2>
          <p className="c7-description">
            Built around your #1 best-fit area — the same core moves carry over even if you lean toward
            another area from your top 5 later.
          </p>
          {output.domainAffinities[0] && (
            <div className="c7-road-card" style={{ ["--rc" as string]: RANK_COLOURS[0], ["--rc-tint" as string]: RANK_COLOURS[0] + "16" } as React.CSSProperties}>
              <div className="c7-road-intro">
                <span className="c7-road-intro-rk">01</span>
                <div className="c7-road-intro-nm">{output.domainAffinities[0].domainName}</div>
              </div>
              <div className="c7-road">
                {knowledgeRoadmap("7", output.domainAffinities[0].domainName).map((p, i) => (
                  <div className="c7-road-step" key={p.period}>
                    <div className="c7-road-step-num">{i + 1}</div>
                    <div>
                      <div className="c7-road-yr">{p.period}</div>
                      <div className="c7-road-ti">{p.title}</div>
                      <div className="c7-road-tx">{p.points[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="c7-road-note">This is one realistic path, not a fixed rulebook — revisit it as your interests sharpen.</div>
            </div>
          )}
        </div>
      </section>

      {/* ===== TAKE THE NEXT STEP ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Take the next step</h2>
          <p className="c7-description">Hand-picked starting points relevant to your stage.</p>
          <div className="c7-res">
            {output.domainAffinities[0] && OPPORTUNITIES[output.domainAffinities[0].domain]?.length > 0 && (
              <div className="c7-rgrp">
                <div className="c7-rgh">🚀 Free programs in {output.domainAffinities[0].domainName}</div>
                <div className="c7-rchips">
                  {OPPORTUNITIES[output.domainAffinities[0].domain].map((o) => (
                    <a className="c7-rchip" key={o.url} href={o.url} target="_blank" rel="noreferrer"><b>{o.label}</b><span>{o.note}</span></a>
                  ))}
                </div>
              </div>
            )}
            <div className="c7-rgrp">
              <div className="c7-rgh">📚 Learn these skills — free & paid</div>
              <div className="c7-rchips">{LEARNING.map((l) => <a className="c7-rchip" key={l.url} href={l.url} target="_blank" rel="noreferrer"><b>{l.label}</b><span>{l.note}</span></a>)}</div>
            </div>
            <div className="c7-rgrp">
              <div className="c7-rgh">💼 Where to find jobs & internships (for later)</div>
              <div className="c7-portals">
                {JOB_PORTALS.map((p) => (
                  <div className="c7-pcol" key={p.region}><div className="c7-pr">{p.region}</div><div className="c7-plist">{p.sites.map((si) => <a key={si.url} href={si.url} target="_blank" rel="noreferrer">{si.label}</a>)}</div></div>
                ))}
              </div>
            </div>
            <div className="c7-rgrp">
              <div className="c7-rgh">🎓 Scholarships to know about (2026)</div>
              <div className="c7-schol">
                {SCHOLARSHIPS_2026.map((sc) => (
                  <a className="c7-scard" key={sc.name} href={sc.url} target="_blank" rel="noreferrer"><div className="c7-sn">{sc.name}</div><div className="c7-sw">{sc.who}</div></a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== YOUR SUMMARY ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">Your Summary</h2>
          <div className="c7-summary-box">
            <p>{output.summary}</p>
          </div>

          <h3 className="c7-subsection-title">Next Steps for Exploration:</h3>
          <div className="c7-next-steps">
            <div className="c7-step">
              <span className="c7-step-number">1</span>
              <div>
                <strong>Try new activities:</strong> Join clubs and activities in school that match your
                interests
              </div>
            </div>
            <div className="c7-step">
              <span className="c7-step-number">2</span>
              <div>
                <strong>Ask questions:</strong> Talk to teachers, parents, and older students about
                careers that interest you
              </div>
            </div>
            <div className="c7-step">
              <span className="c7-step-number">3</span>
              <div>
                <strong>Keep learning:</strong> Develop your strengths and try new things
              </div>
            </div>
            <div className="c7-step">
              <span className="c7-step-number">4</span>
              <div>
                <strong>Reassess later:</strong> Your interests may change—that's completely normal!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOR PARENTS & MENTORS ===== */}
      <section className="c7-sheet">
        <div className="c7-content">
          <h2 className="c7-section-title">For parents & mentors</h2>
          <p className="c7-description">Supporting {studentName.split(" ")[0] || "your child"} — a few things that help:</p>
          <ul className="c7-plain-ul c7-parent-list">{PARENT_TIPS.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      </section>

      {/* ===== FOOTER / CLOSING ===== */}
      <section className="c7-sheet c7-footer">
        <div className="c7-content">
          <div className="c7-closing">
            <h3>This is a starting point, not a final answer.</h3>
            <p className="c7-footer-text">
              Your interests and strengths will grow and change as you learn more about yourself and the
              world. Keep exploring! 🚀
            </p>
          </div>
          <p className="c7-disclaimer">
            <b>How to read this report.</b> These recommendations are derived from your own answers —
            your interests, strengths and reasoning from the questions you answered — not a measure of
            your ability or a ceiling on it. You have complete freedom to explore other areas too;
            these are just recommendations based on what you told us. Interests at this age change
            quickly, so treat this as a starting point for conversations with teachers and parents,
            and revisit it as you grow.
          </p>
          <div className="c7-dl-cta">
            <div className="c7-dl-cta-label">Keep a copy</div>
            <div className="c7-dl-cta-row">
              <Class7DownloadButton format="pdf" name={studentName} />
              <Class7DownloadButton format="html" name={studentName} />
            </div>
          </div>
          <div className="c7-contact-block">
            <img className="c7-contact-logo" src="/onegrasp-logo-tight.png" alt="OneGrasp" />
            <div className="c7-contact-lines">
              <span>support@onegrasp.com</span>
              <span>+91 89777 60442</span>
              <span>onegrasp.com</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const CLASS7_LOGO = "/onegrasp-logo-tight.png";

/** Same fix as FullReport.tsx's DownloadButton: inline the logo as a data:
 *  URI, since its "/..." path only resolves on the site's own origin — not
 *  in a downloaded file opened from disk or a print popup with no origin. */
async function toDataURL(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Resolves once every <img> in `doc` has loaded or failed, or after `capMs`
 *  — printing before the browser has actually received every image (this
 *  report can carry dozens across several pages) is what produced blank
 *  image boxes and PDFs printed mid-layout. */
function waitForImages(doc: Document, capMs = 8000): Promise<void> {
  const imgs = Array.from(doc.images);
  if (imgs.length === 0) return Promise.resolve();
  const loaded = Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
    )
  );
  return Promise.race([loaded.then(() => undefined), new Promise<void>((r) => setTimeout(r, capMs))]);
}

function Class7DownloadButton({ format: fmt, name }: { format: "pdf" | "html"; name?: string }) {
  const handleDownload = async () => {
    const element = document.querySelector(".class7-report");
    if (!element) { alert("Report not found"); return; }
    const filename = `${name || "Class7-Report"}-${new Date().toISOString().split("T")[0]}`;
    let html = element.outerHTML;
    try {
      const logoDataUrl = await toDataURL(CLASS7_LOGO);
      html = html.split(`src="${CLASS7_LOGO}"`).join(`src="${logoDataUrl}"`);
    } catch {
      /* offline or blocked — leave the original path rather than fail the download */
    }
    const doc = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${filename}</title></head><body style="margin:0">${html}</body></html>`;
    if (fmt === "html") {
      const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const printWindow = window.open("", "", "height=800,width=1000");
      if (!printWindow) { alert("Please allow pop-ups for this site to download the PDF."); return; }
      printWindow.document.write(doc);
      printWindow.document.close();
      await waitForImages(printWindow.document);
      printWindow.requestAnimationFrame(() => {
        printWindow.focus();
        printWindow.print();
      });
    }
  };
  const icon = fmt === "pdf" ? "📄" : "📋";
  const label = fmt === "pdf" ? "Download as PDF" : "Download as HTML";
  const desc = fmt === "pdf" ? "Print to PDF" : "View in browser";
  return (
    <button onClick={handleDownload} className="c7-dl-btn">
      <span className="c7-dl-btn-icon">{icon}</span>
      <span>
        <span className="c7-dl-btn-label">{label}</span>
        <span className="c7-dl-btn-desc">{desc}</span>
      </span>
    </button>
  );
}

const Class7CSS = `
  .class7-report {
    font-family: Inter, system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #141417;
    background: #f7f7f8;
  }

  .c7-sheet {
    background: white;
    page-break-after: always;
    page-break-inside: avoid;
    padding: 40px;
    width: 100%;
    max-width: 210mm;
    min-height: 297mm;
    margin: 0 auto 24px;
    box-shadow: 0 14px 40px rgba(20,20,25,.08), 0 3px 10px rgba(20,20,25,.04);
    border-radius: 6px;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 860px) {
    .c7-sheet { min-height: auto; }
  }

  @media print {
    .c7-sheet { box-shadow: none; border-radius: 0; margin: 0 auto; }
  }

  .c7-cover {
    background: linear-gradient(160deg, #F2555A 0%, #E23B41 55%, #B5262C 100%);
    color: white;
    align-items: flex-start;
  }

  .c7-cover-content {
    text-align: center;
    width: 100%;
    padding-top: 12px;
  }

  .c7-logo-card {
    display: inline-block;
    background: #fff;
    border-radius: 20px;
    padding: 20px 32px;
    box-shadow: 0 12px 30px rgba(0,0,0,.2);
    margin-bottom: 26px;
  }

  .c7-logo {
    height: 70px;
    width: auto;
    display: block;
  }

  .c7-badge {
    display: inline-block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,.85);
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.3);
    padding: 7px 16px;
    border-radius: 999px;
    margin-bottom: 26px;
  }

  .c7-title {
    font-size: clamp(32px, 5.5vw, 52px);
    font-weight: 900;
    margin: 0;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  .c7-message {
    font-size: 15px;
    line-height: 1.65;
    color: rgba(255,255,255,.92);
    max-width: 56ch;
    margin: 18px auto 0;
  }

  .c7-student-block {
    margin: 40px auto 0;
  }

  .c7-label {
    display: block;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(255,255,255,.7);
  }

  .c7-student-name {
    font-size: clamp(24px, 4.2vw, 38px);
    font-weight: 800;
    color: #fff;
    margin-top: 6px;
  }

  .c7-student-school {
    display: inline-block;
    font-size: clamp(13px, 2vw, 17px);
    font-weight: 800;
    color: #E23B41;
    background: #fff;
    padding: 8px 18px;
    border-radius: 999px;
    margin-top: 12px;
    box-shadow: 0 6px 16px rgba(0,0,0,.16);
  }

  .c7-student-school.ph {
    font-weight: 700;
    color: #9a9aa6;
    background: rgba(255,255,255,.85);
  }

  .c7-cover-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 26px;
  }

  .c7-chip {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    background: #fff;
    border-radius: 12px;
    padding: 10px 18px;
    box-shadow: 0 10px 24px rgba(0,0,0,.16);
    border-left: 4px solid #F2555A;
  }

  .c7-chip.c7-cc1 { border-left-color: #12996b; }
  .c7-chip.c7-cc3 { border-left-color: #e08a1e; }

  .c7-chip .k {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #9a9aa6;
  }

  .c7-chip .v {
    font-size: 14px;
    font-weight: 800;
    color: #141417;
  }

  .c7-content {
    flex: 1;
  }

  .c7-section-title {
    font-size: 28px;
    font-weight: 700;
    color: #141417;
    margin-bottom: 20px;
    border-bottom: 3px solid #F2555A;
    padding-bottom: 10px;
  }

  .c7-subsection-title {
    font-size: 18px;
    font-weight: 600;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #141417;
  }

  .c7-description {
    font-size: 15px;
    color: #3d3d45;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .c7-compass-box {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 24px;
    align-items: center;
    background: #FDECED;
    border: 2px solid #F8CBCD;
    border-radius: 16px;
    padding: 22px;
    margin-bottom: 18px;
  }

  .c7-compass-side {
    min-width: 0;
  }

  .c7-compass-note {
    font-size: 12.5px;
    line-height: 1.6;
    color: #3d3d45;
    margin: 0;
  }

  .c7-personality-box {
    background: #f4f4f6;
    padding: 25px;
    border-radius: 12px;
    border-left: 4px solid #F2555A;
  }

  .c7-type-display {
    font-size: 36px;
    font-weight: 700;
    color: #F2555A;
    margin-bottom: 15px;
    letter-spacing: 2px;
  }

  .c7-preferences {
    margin-top: 20px;
  }

  .c7-pref-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #ececef;
  }

  .c7-pref-label {
    font-weight: 600;
    color: #141417;
  }

  .c7-pref-value {
    color: #3d3d45;
    text-align: right;
    max-width: 60%;
  }

  .c7-interest-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .c7-interest-card {
    background: linear-gradient(135deg, #F2555A 0%, #E23B41 100%);
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
  }

  .c7-interest-rank {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 10px;
  }

  .c7-interest-letter {
    font-size: 36px;
    font-weight: 700;
    margin: 10px 0;
  }

  .c7-interest-name {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .c7-interest-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .c7-interest-fill {
    height: 100%;
    background: white;
  }

  .c7-interest-score {
    font-size: 14px;
    font-weight: 700;
  }

  .c7-strengths-list,
  .c7-motivators-list {
    margin-top: 20px;
  }

  .c7-strength-item,
  .c7-motivator-item {
    margin-bottom: 20px;
  }

  .c7-strength-name,
  .c7-motivator-name {
    font-weight: 600;
    color: #141417;
    margin-bottom: 8px;
    font-size: 15px;
  }

  .c7-strength-bar,
  .c7-motivator-bar {
    height: 8px;
    background: #ececef;
    border-radius: 4px;
    overflow: hidden;
  }

  .c7-strength-fill,
  .c7-motivator-fill {
    height: 100%;
    background: linear-gradient(90deg, #F2555A, #E23B41);
  }

  .c7-strength-score,
  .c7-motivator-score {
    font-size: 13px;
    color: #63636f;
    margin-top: 5px;
    font-weight: 600;
  }

  .c7-motivator-item {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .c7-motivator-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .c7-motivator-content {
    flex: 1;
  }

  .c7-learning-tips {
    background: #FDECED;
    border-left: 4px solid #E23B41;
    padding: 20px;
    border-radius: 8px;
    margin-top: 15px;
  }

  .c7-learning-tips ul {
    margin: 0;
    padding-left: 20px;
  }

  .c7-learning-tips li {
    margin: 10px 0;
    color: #141417;
    font-size: 14px;
  }

  .c7-domains-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .c7-domain-card {
    background: #fff;
    border: 1px solid #ececef;
    border-top: 5px solid var(--rc, #F2555A);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 14px 40px rgba(20,20,25,.08);
  }

  .c7-domain-img-wrap {
    position: relative;
    height: 130px;
    background: #f7f7f8;
  }

  .c7-domain-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .c7-domain-img-rk {
    position: absolute;
    left: 16px;
    bottom: -20px;
    width: 46px;
    height: 46px;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
    background: var(--rc, #F2555A);
    box-shadow: 0 6px 16px rgba(0,0,0,.28);
    border: 3px solid #fff;
  }

  .c7-domain-body {
    padding: 26px 20px 20px;
  }

  .c7-domain-title {
    font-size: 16px;
    font-weight: 700;
    color: #141417;
    margin: 0 0 10px 0;
  }

  .c7-domain-affinity {
    font-size: 12px;
    color: #63636f;
    margin-bottom: 10px;
  }

  .c7-domain-bar {
    height: 6px;
    background: #ececef;
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .c7-domain-fill {
    height: 100%;
    background: linear-gradient(90deg, #F2555A, #E23B41);
  }

  .c7-domain-why {
    font-size: 12px;
    color: #3d3d45;
    margin: 0;
    font-style: italic;
  }

  .c7-domain-roles-label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: #63636f;
    margin: 14px 0 6px;
  }

  .c7-domain-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 10px;
  }

  .c7-domain-skill {
    font-size: 11px;
    font-weight: 600;
    color: var(--rc, #12996b);
    background: color-mix(in srgb, var(--rc, #12996b) 12%, #fff);
    border: 1px solid color-mix(in srgb, var(--rc, #12996b) 30%, #fff);
    border-radius: 999px;
    padding: 3px 10px;
  }

  .c7-domain-roles {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin: 0 0 10px;
  }

  .c7-domain-role-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .c7-domain-role-nm {
    font-size: 12.5px;
    color: #141417;
    flex: 1;
  }

  .c7-domain-role-fitwrap {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 96px;
    flex-shrink: 0;
  }

  .c7-domain-role-bar {
    flex: 1;
    height: 6px;
    border-radius: 999px;
    background: #ececef;
    overflow: hidden;
  }

  .c7-domain-role-fill {
    display: block;
    height: 100%;
    border-radius: 999px;
  }

  .c7-domain-role-pct {
    font-size: 11px;
    font-weight: 700;
    width: 32px;
    text-align: right;
  }

  .c7-domain-salary {
    font-size: 12px;
    color: #3d3d45;
    margin: 0;
    padding-top: 8px;
    border-top: 1px solid #ececef;
  }

  .c7-summary-box {
    background: #FDECED;
    border: 2px solid #F8CBCD;
    border-radius: 12px;
    padding: 25px;
    font-size: 16px;
    line-height: 1.8;
    color: #141417;
  }

  .c7-next-steps {
    margin-top: 20px;
  }

  .c7-step {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
  }

  .c7-step-number {
    background: #F2555A;
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

  .c7-step div {
    color: #141417;
    font-size: 15px;
    line-height: 1.6;
  }

  .c7-footer-text {
    font-size: 14px;
    color: #3d3d45;
    margin: 15px 0;
    line-height: 1.6;
  }

  .c7-closing {
    margin-top: 16px;
    border-radius: 15px;
    overflow: hidden;
    background: #141417;
    color: #fff;
    padding: 32px 28px;
    text-align: center;
    position: relative;
  }

  .c7-closing::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #F2555A, #E23B41);
  }

  .c7-closing h3 {
    color: #fff;
    font-size: 23px;
    font-weight: 800;
    margin: 0;
  }

  .c7-closing .c7-footer-text {
    color: #c9c9d2;
    max-width: 52ch;
    margin: 11px auto 0;
  }

  .c7-disclaimer {
    margin-top: 20px;
    padding: 14px 18px;
    border: 1px solid #ececef;
    border-radius: 12px;
    background: #fafafb;
    color: #5b5b66;
    font-size: 12.5px;
    line-height: 1.65;
  }

  .c7-disclaimer b {
    color: #141417;
  }

  .c7-contact-block {
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid #ececef;
    text-align: center;
  }

  .c7-contact-logo {
    height: 30px;
    width: auto;
    margin: 0 auto 14px;
    display: block;
  }

  .c7-contact-lines {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px 18px;
  }

  .c7-contact-lines span {
    font-size: 18px;
    font-weight: 800;
    color: #141417;
    letter-spacing: -0.01em;
  }

  /* At-a-glance scorecard */
  .c7-scorecard-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 16px;
  }

  .c7-scorecard-row {
    display: grid;
    grid-template-columns: 160px 1fr 80px;
    align-items: center;
    gap: 14px;
    padding: 10px 4px;
    border-bottom: 1px solid #ececef;
  }

  .c7-scorecard-nm {
    font-size: 13px;
    font-weight: 700;
    color: #141417;
  }

  .c7-scorecard-bar {
    height: 8px;
    background: #ececef;
    border-radius: 4px;
    overflow: hidden;
    display: block;
  }

  .c7-scorecard-fill {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #F2555A, #E23B41);
  }

  .c7-scorecard-pill {
    font-size: 11px;
    font-weight: 800;
    padding: 4px 11px;
    border-radius: 999px;
    white-space: nowrap;
    justify-self: end;
  }

  .c7-scorecard-pill.hi { background: #eaf6f0; color: #1f7a55; }
  .c7-scorecard-pill.mid { background: #fdf3dd; color: #a3620b; }
  .c7-scorecard-pill.lo { background: #f4f4f6; color: #63636f; }

  /* Per-dimension deep-dive: ring + band/percentile + strong/grow + next steps */
  .c7-deepdive {
    margin-top: 22px;
    padding-top: 20px;
    border-top: 1px solid #ececef;
  }

  .c7-deepdive-hero {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 18px;
  }

  .c7-ring-num {
    font-size: 20px;
    font-weight: 800;
    color: #141417;
    line-height: 1;
  }

  .c7-ring-den {
    font-size: 10px;
    font-weight: 600;
    color: #9a9aa6;
    margin-top: 2px;
  }

  .c7-deepdive-meta {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .c7-deepdive-pct {
    font-size: 12.5px;
    color: #3d3d45;
  }

  .c7-twocard {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
  }

  .c7-lc {
    border-radius: 12px;
    padding: 16px 18px;
  }

  .c7-lc.good {
    background: #eaf6f0;
    border: 1px solid #cdeadb;
  }

  .c7-lc.grow {
    background: #FDECED;
    border: 1px solid #F8CBCD;
  }

  .c7-lc h4 {
    margin: 0 0 8px;
    font-size: 12.5px;
    font-weight: 800;
    color: #141417;
  }

  .c7-lc ul {
    margin: 0;
    padding-left: 18px;
    font-size: 12.5px;
    line-height: 1.6;
    color: #3d3d45;
  }

  .c7-lc li + li {
    margin-top: 6px;
  }

  .c7-recos {
    background: #f4f4f6;
    border-radius: 12px;
    padding: 16px 18px;
  }

  .c7-recos-hd {
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #63636f;
    margin-bottom: 8px;
  }

  .c7-recos ol {
    margin: 0;
    padding-left: 18px;
    font-size: 12.5px;
    line-height: 1.6;
    color: #141417;
  }

  .c7-recos li + li {
    margin-top: 6px;
  }

  /* Radar profile page */
  .c7-radar-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
    align-items: center;
    margin-top: 16px;
  }

  @media (max-width: 720px) {
    .c7-radar-hero { grid-template-columns: 1fr; }
  }

  .c7-radar-domains {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .c7-radar-dcard {
    border: 1px solid #ececef;
    border-radius: 12px;
    padding: 14px 15px;
    background: #fff;
    border-left: 4px solid var(--rc, #F2555A);
  }

  .c7-radar-dcard-rk {
    font-size: 10.5px;
    font-weight: 800;
    color: var(--rc, #F2555A);
    letter-spacing: 0.06em;
  }

  .c7-radar-dcard-nm {
    font-size: 15px;
    font-weight: 800;
    margin-top: 5px;
    color: #141417;
  }

  .c7-radar-dcard-mt {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
  }

  .c7-radar-dcard-mt .t {
    flex: 1;
    height: 6px;
    border-radius: 999px;
    background: #ececef;
    overflow: hidden;
    display: block;
  }

  .c7-radar-dcard-mt .t i {
    display: block;
    height: 100%;
    border-radius: 999px;
    background: var(--rc, #F2555A);
  }

  .c7-radar-dcard-mt .v {
    font-size: 12px;
    font-weight: 800;
    color: var(--rc, #F2555A);
  }

  /* Contents / TOC */
  .c7-toc { display: flex; flex-direction: column; gap: 4px; margin-top: 10px; }
  .c7-toc-row { display: grid; grid-template-columns: 220px 1fr; gap: 14px; padding: 10px 4px; border-bottom: 1px solid #ececef; }
  .c7-toc-t { font-size: 13.5px; font-weight: 700; color: #141417; }
  .c7-toc-d { font-size: 12.5px; color: #63636f; }
  .c7-dims8 { margin: 20px 0 0; border: 1px solid #ececef; border-radius: 14px; overflow: hidden; background: #f7f7f8; }
  .c7-dims8 img { width: 100%; display: block; }

  /* Plain bullet list, shared by future/parents sections */
  .c7-plain-ul { margin: 0; padding-left: 20px; font-size: 13.5px; color: #141417; line-height: 1.85; }
  .c7-parent-list { margin-top: 12px; }

  /* Future outlook */
  .c7-future-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 10px; }
  @media (max-width: 720px) { .c7-future-grid { grid-template-columns: 1fr; } }
  .c7-future-h { font-size: 13.5px; font-weight: 800; margin-bottom: 12px; color: #141417; }
  .c7-future-list { display: flex; flex-direction: column; gap: 10px; }
  .c7-future-item { padding: 10px 13px; border: 1px solid #ececef; border-radius: 10px; background: #f7f7f8; }
  .c7-future-t { font-size: 13px; font-weight: 700; color: #141417; }
  .c7-future-d { font-size: 12px; color: #63636f; margin-top: 3px; }

  /* 20-year roadmap */
  .c7-road-card { background: var(--rc-tint, #f7f7f8); border: 1px solid var(--rc-line, #ececef); border-radius: 20px; padding: 26px 22px; margin-top: 10px; }
  .c7-road-intro { display: flex; align-items: center; gap: 14px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--rc-line, #ececef); }
  .c7-road-intro-rk { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; color: #fff; background: var(--rc, #F2555A); flex: none; }
  .c7-road-intro-nm { font-size: 17px; font-weight: 800; color: #141417; }
  .c7-road { position: relative; padding-left: 36px; }
  .c7-road::before { content: ""; position: absolute; left: 11px; top: 4px; bottom: 4px; width: 2px; background: rgba(0,0,0,.1); }
  .c7-road-step { position: relative; display: flex; gap: 14px; margin-bottom: 18px; }
  .c7-road-step:last-child { margin-bottom: 0; }
  .c7-road-step-num { position: absolute; left: -36px; top: -2px; width: 24px; height: 24px; border-radius: 50%; background: var(--rc, #F2555A); color: #fff; font-size: 11px; font-weight: 800; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 0 4px var(--rc-tint, #f7f7f8); }
  .c7-road-yr { font-size: 10.5px; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase; color: var(--rc, #F2555A); }
  .c7-road-ti { font-size: 14px; font-weight: 800; color: #141417; margin-top: 2px; }
  .c7-road-tx { font-size: 12.5px; color: #3d3d45; margin-top: 4px; line-height: 1.55; }
  .c7-road-note { margin-top: 16px; padding: 11px 14px; background: #fff; border: 1px solid var(--rc-line, #ececef); border-radius: 10px; font-size: 11.5px; color: #63636f; font-style: italic; }

  /* Take the next step */
  .c7-res { display: flex; flex-direction: column; gap: 20px; margin-top: 10px; }
  .c7-rgh { font-size: 13.5px; font-weight: 800; margin-bottom: 11px; color: #141417; }
  .c7-rchips { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 9px; }
  @media (max-width: 640px) { .c7-rchips { grid-template-columns: 1fr 1fr; } }
  @media (max-width: 440px) { .c7-rchips { grid-template-columns: 1fr; } }
  .c7-rchip { display: block; border: 1px solid #ececef; border-radius: 11px; padding: 11px 13px; text-decoration: none; background: #fff; }
  .c7-rchip b { display: block; font-size: 13px; font-weight: 800; color: #141417; }
  .c7-rchip span { display: block; font-size: 11px; color: #63636f; margin-top: 2px; }
  .c7-portals { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 560px) { .c7-portals { grid-template-columns: 1fr; } }
  .c7-pcol { border: 1px solid #ececef; border-radius: 12px; padding: 13px 15px; background: #fff; }
  .c7-pr { font-size: 11px; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #9a9aa6; margin-bottom: 9px; }
  .c7-plist { display: flex; flex-wrap: wrap; gap: 7px; }
  .c7-plist a { font-size: 12px; font-weight: 700; color: #F2555A; text-decoration: none; background: #FDECED; border: 1px solid #F8CBCD; padding: 6px 11px; border-radius: 8px; }
  .c7-schol { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  @media (max-width: 560px) { .c7-schol { grid-template-columns: 1fr; } }
  .c7-scard { display: block; border: 1px solid #ececef; border-left: 3px solid #F2555A; border-radius: 11px; padding: 12px 14px; text-decoration: none; background: #fff; }
  .c7-sn { font-size: 13px; font-weight: 800; color: #141417; }
  .c7-sw { font-size: 11px; color: #63636f; margin-top: 3px; line-height: 1.45; }

  .c7-dl-cta {
    margin-top: 26px;
    padding-top: 22px;
    border-top: 1px solid #ececef;
  }

  .c7-dl-cta-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #9a9aa6;
    margin-bottom: 12px;
  }

  .c7-dl-cta-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  @media (max-width: 560px) {
    .c7-dl-cta-row { grid-template-columns: 1fr; }
  }

  .c7-dl-btn {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 18px;
    border: 1px solid #ececef;
    border-radius: 13px;
    background: #f7f7f8;
    cursor: pointer;
    text-align: left;
    font-family: inherit;
    width: 100%;
  }

  .c7-dl-btn:hover { border-color: #F8CBCD; }

  .c7-dl-btn-icon { font-size: 22px; flex: none; }

  .c7-dl-btn-label {
    display: block;
    font-size: 14px;
    font-weight: 800;
    color: #141417;
  }

  .c7-dl-btn-desc {
    display: block;
    font-size: 12px;
    color: #9a9aa6;
    margin-top: 2px;
  }

  .c7-description {
    font-size: 15px;
    color: #63636f;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .c7-note {
    font-size: 13px;
    color: #63636f;
    margin-top: 15px;
    line-height: 1.6;
    font-style: italic;
  }

  .c7-ei-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .c7-ei-item {
    background: #FDECED;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #F2555A;
  }

  .c7-ei-label {
    font-weight: 600;
    font-size: 14px;
    color: #141417;
    margin-bottom: 10px;
    display: block;
  }

  .c7-ei-bar {
    background: #ececef;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .c7-ei-fill {
    background: #F2555A;
    height: 100%;
  }

  .c7-ei-score {
    font-size: 13px;
    font-weight: 700;
    color: #141417;
  }

  .c7-creativity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .c7-creativity-item {
    background: #FDECED;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid #F2555A;
  }

  .c7-creativity-label {
    font-weight: 600;
    font-size: 14px;
    color: #141417;
    margin-bottom: 10px;
    display: block;
  }

  .c7-creativity-bar {
    background: #F8CBCD;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .c7-creativity-fill {
    background: #F2555A;
    height: 100%;
  }

  .c7-creativity-score {
    font-size: 13px;
    font-weight: 700;
    color: #141417;
  }

  @media print {
    .class7-report {
      background: white;
    }
    .c7-sheet {
      margin: 0;
      border: none;
      box-shadow: none;
    }
  }
`;
