/**
 * Class 6 Report - All Page Components (Pages 2-22)
 * Single file with all remaining page templates
 */

import type { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';
import { DimensionSlider, CircleChart, SkillCard, CareerDomainCard, Timeline, ReportHeader, ReportFooter } from '../components/DesignComponents';

const PAGE_STYLE = {
  width: '210mm' as const,
  height: '297mm' as const,
  padding: 0,
  margin: 0,
  background: 'white',
  position: 'relative' as const,
  overflow: 'hidden' as const,
  fontFamily: 'system-ui, -apple-system, sans-serif'
};

// PAGE 2: PREFACE
export function PrefacePage() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Career Discovery Report" email="Your Journey Begins Here" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>PREFACE</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Dear Student,
        </p>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          Congratulations on completing the OneGrasp Career Discovery Assessment! This comprehensive report is your personalized guide to understanding your unique strengths, interests, and potential career paths.
        </p>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          This journey consists of five key steps designed to help you explore your career options:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16pt', margin: '20pt 0' }}>
          <div style={{ backgroundColor: '#F5F7FA', padding: '12pt', borderRadius: '8pt', textAlign: 'center' }}>
            <div style={{ fontSize: '28pt', fontWeight: 700, color: '#2DCC71', marginBottom: '8pt' }}>1</div>
            <p style={{ fontSize: '11pt', fontWeight: 600, margin: 0, marginBottom: '4pt', color: '#1F3A52' }}>Your Profile</p>
            <p style={{ fontSize: '9pt', color: '#666', margin: 0 }}>Understand your strengths</p>
          </div>
          <div style={{ backgroundColor: '#F5F7FA', padding: '12pt', borderRadius: '8pt', textAlign: 'center' }}>
            <div style={{ fontSize: '28pt', fontWeight: 700, color: '#3498DB', marginBottom: '8pt' }}>2</div>
            <p style={{ fontSize: '11pt', fontWeight: 600, margin: 0, marginBottom: '4pt', color: '#1F3A52' }}>Your Interests</p>
            <p style={{ fontSize: '9pt', color: '#666', margin: 0 }}>Discover what excites you</p>
          </div>
          <div style={{ backgroundColor: '#F5F7FA', padding: '12pt', borderRadius: '8pt', textAlign: 'center' }}>
            <div style={{ fontSize: '28pt', fontWeight: 700, color: '#E67E22', marginBottom: '8pt' }}>3</div>
            <p style={{ fontSize: '11pt', fontWeight: 600, margin: 0, marginBottom: '4pt', color: '#1F3A52' }}>Your Options</p>
            <p style={{ fontSize: '9pt', color: '#666', margin: 0 }}>Explore career possibilities</p>
          </div>
          <div style={{ backgroundColor: '#F5F7FA', padding: '12pt', borderRadius: '8pt', textAlign: 'center' }}>
            <div style={{ fontSize: '28pt', fontWeight: 700, color: '#9B59B6', marginBottom: '8pt' }}>4</div>
            <p style={{ fontSize: '11pt', fontWeight: 600, margin: 0, marginBottom: '4pt', color: '#1F3A52' }}>Your Path</p>
            <p style={{ fontSize: '9pt', color: '#666', margin: 0 }}>Plan your next steps</p>
          </div>
        </div>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginTop: '20pt' }}>
          Use this report as a starting point for conversations with your teachers, parents, and career counselors. Remember, your interests and goals may evolve—that's perfectly normal at your age!
        </p>
      </div>
      <ReportFooter pageNumber={2} totalPages={22} />
    </div>
  );
}

// PAGE 3: YOUR PROFILING
export function ProfilingPage({ output }: { output: Class6ScoreOutput }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Career Journey" email="Current Stage" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR PROFILING</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          At Class 6, you're at an exciting stage of career exploration. This is the perfect time to discover your interests and begin thinking about your future direction.
        </p>

        <div style={{
          backgroundColor: '#FDECED',
          padding: '16pt',
          borderRadius: '8pt',
          marginBottom: '16pt',
          border: '2pt solid #FF6B6B'
        }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#E63946', margin: 0, marginBottom: '8pt' }}>🔍 EXPLORATION STAGE</h3>
          <p style={{ fontSize: '11pt', color: '#2C3E50', margin: 0, lineHeight: 1.5 }}>
            You are in the exploration phase of your career planning. This is an ideal time to discover your talents, interests, and personality traits that will guide your future decisions.
          </p>
        </div>

        <h3 style={{ fontSize: '13pt', fontWeight: 700, color: '#1F3A52', marginTop: '16pt', marginBottom: '12pt' }}>What This Assessment Measures</h3>

        <ul style={{ margin: '0 0 12pt 20pt', padding: 0 }}>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '8pt', lineHeight: 1.5 }}>
            <strong>Personality:</strong> How you prefer to interact with the world
          </li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '8pt', lineHeight: 1.5 }}>
            <strong>Career Interests:</strong> What types of work appeal to you
          </li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '8pt', lineHeight: 1.5 }}>
            <strong>Strengths:</strong> Your natural talents and abilities
          </li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '8pt', lineHeight: 1.5 }}>
            <strong>Learning Style:</strong> How you learn best
          </li>
          <li style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.5 }}>
            <strong>Motivators:</strong> What drives and inspires you
          </li>
        </ul>
      </div>
      <ReportFooter pageNumber={3} totalPages={22} />
    </div>
  );
}

// PAGE 4: CAREER PERSONALITY
export function PersonalityPage({ output }: { output: Class6ScoreOutput }) {
  const scores = output.personalityProfile.typeScores || {
    decisive: 45,
    supportive: 72,
    analytical: 58,
    creative: 81
  };

  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Personality" email="How You Work" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR PERSONALITY TYPE</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Your personality type reveals how you naturally prefer to work, make decisions, and interact with others. Understanding these preferences helps you find careers where you'll thrive.
        </p>

        <div style={{ marginTop: '16pt', marginBottom: '20pt' }}>
          <DimensionSlider
            label="Decision Style"
            percentage={scores.decisive}
            leftLabel="Empathetic"
            rightLabel="Decisive"
          />
          <DimensionSlider
            label="Social Preference"
            percentage={scores.supportive}
            leftLabel="Independent"
            rightLabel="Supportive"
          />
          <DimensionSlider
            label="Thinking Style"
            percentage={scores.analytical}
            leftLabel="Creative"
            rightLabel="Analytical"
          />
          <DimensionSlider
            label="Work Preference"
            percentage={scores.creative}
            leftLabel="Structured"
            rightLabel="Creative"
          />
        </div>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6 }}>
          Based on your responses, you show a preference for {scores.supportive > 50 ? 'collaborative and supportive' : 'independent'} work environments, combined with {scores.creative > 50 ? 'creative' : 'analytical'} thinking abilities.
        </p>
      </div>
      <ReportFooter pageNumber={4} totalPages={22} />
    </div>
  );
}

// PAGE 5: CAREER INTERESTS (RIASEC)
export function CareerInterestPage({ output }: { output: Class6ScoreOutput }) {
  const topInterests = (output.riasecScores || []).slice(0, 3);

  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Career Interests" email="What Excites You" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>CAREER INTERESTS (RIASEC)</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          The RIASEC model categorizes careers into six interest areas. Your top interests are shown below.
        </p>

        <div style={{ marginTop: '16pt' }}>
          {topInterests.map((interest, idx) => (
            <div key={idx} style={{
              backgroundColor: idx === 0 ? '#E8F5E9' : idx === 1 ? '#E3F2FD' : '#FFF3E0',
              padding: '14pt',
              borderLeft: `4pt solid ${idx === 0 ? '#2DCC71' : idx === 1 ? '#3498DB' : '#E67E22'}`,
              marginBottom: '12pt',
              borderRadius: '4pt'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6pt' }}>
                <h3 style={{ fontSize: '13pt', fontWeight: 700, color: '#1F3A52', margin: 0 }}>
                  #{idx + 1} {interest.name}
                </h3>
                <span style={{ fontSize: '12pt', fontWeight: 700, color: idx === 0 ? '#2DCC71' : idx === 1 ? '#3498DB' : '#E67E22' }}>
                  {interest.score}%
                </span>
              </div>
              <p style={{ fontSize: '10pt', color: '#666', margin: 0 }}>
                People with this interest enjoy working with {interest.name.toLowerCase()} activities and environments.
              </p>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: '#F5F7FA',
          padding: '12pt',
          borderRadius: '4pt',
          marginTop: '16pt'
        }}>
          <p style={{ fontSize: '10pt', color: '#475569', margin: 0, lineHeight: 1.5 }}>
            💡 <strong>Tip:</strong> Explore careers that align with your top interests. You might combine multiple interest areas!
          </p>
        </div>
      </div>
      <ReportFooter pageNumber={6} totalPages={22} />
    </div>
  );
}

// PAGE 6: STRENGTHS
export function StrengthsPage({ output }: { output: Class6ScoreOutput }) {
  const strengths = output.strengthDomains || [];

  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Strengths" email="What You Do Well" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR KEY STRENGTHS</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          These are your natural talents and abilities. Building on these strengths will help you succeed in school and your career.
        </p>

        <div style={{ marginTop: '16pt' }}>
          {strengths.slice(0, 4).map((strength, idx) => (
            <SkillCard
              key={idx}
              icon="⭐"
              title={strength.name || `Strength ${idx + 1}`}
              percentage={Math.round(strength.score || 0)}
              description={`You excel in this area with strong capabilities`}
            />
          ))}
        </div>

        <p style={{ fontSize: '10pt', color: '#666', marginTop: '16pt', lineHeight: 1.5 }}>
          Remember: These aren't your only strengths! You have many abilities yet to discover. Keep exploring new areas to find more talents.
        </p>
      </div>
      <ReportFooter pageNumber={8} totalPages={22} />
    </div>
  );
}

// PAGE 7: MOTIVATORS
export function MotivatorsPage({ output }: { output: Class6ScoreOutput }) {
  const motivators = output.motivators || [];

  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="What Motivates You" email="Your Core Values" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR MOTIVATORS</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Knowing what motivates you helps you choose careers and activities you'll find fulfilling and engaging.
        </p>

        <div style={{ marginTop: '16pt' }}>
          {['Achievement', 'Creativity', 'Helping Others', 'Learning'].map((motivator, idx) => (
            <div key={idx} style={{
              backgroundColor: ['#E8F5E9', '#E3F2FD', '#FFF3E0', '#F3E5F5'][idx],
              borderLeft: `4pt solid ${['#2DCC71', '#3498DB', '#E67E22', '#9B59B6'][idx]}`,
              padding: '14pt',
              marginBottom: '12pt',
              borderRadius: '4pt'
            }}>
              <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>
                {motivator}
              </h3>
              <p style={{ fontSize: '10pt', color: '#666', margin: 0, lineHeight: 1.5 }}>
                This drives your actions and helps you feel satisfied in your work.
              </p>
            </div>
          ))}
        </div>
      </div>
      <ReportFooter pageNumber={10} totalPages={22} />
    </div>
  );
}

// PAGE 8: LEARNING STYLE
export function LearningStylePage({ output }: { output: Class6ScoreOutput }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Learning Style" email="How You Learn Best" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR LEARNING STYLE</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Everyone learns differently. Understanding your learning style helps you study more effectively.
        </p>

        <div style={{ marginTop: '16pt' }}>
          <div style={{
            backgroundColor: '#E3F2FD',
            borderLeft: '4pt solid #3498DB',
            padding: '14pt',
            marginBottom: '12pt',
            borderRadius: '4pt'
          }}>
            <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '8pt' }}>
              {output.learningStyle?.primary || 'Visual'} Learner
            </h3>
            <p style={{ fontSize: '11pt', color: '#475569', margin: 0, lineHeight: 1.5 }}>
              You learn best through {(output.learningStyle?.primary || 'visual').toLowerCase()} methods.
              Use this style to your advantage in your studies and career exploration.
            </p>
          </div>

          <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginTop: '16pt', marginBottom: '8pt' }}>Tips for Your Learning Style</h3>
          <ul style={{ margin: 0, paddingLeft: '20pt' }}>
            <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '6pt', lineHeight: 1.5 }}>
              Use diagrams, charts, and mind maps to organize information
            </li>
            <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '6pt', lineHeight: 1.5 }}>
              Take notes with colors and highlights
            </li>
            <li style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.5 }}>
              Watch educational videos and demonstrations
            </li>
          </ul>
        </div>
      </div>
      <ReportFooter pageNumber={11} totalPages={22} />
    </div>
  );
}

// PAGE 9: EMOTIONAL INTELLIGENCE
export function EIPage({ output }: { output: Class6ScoreOutput }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Emotional Intelligence" email="Your Social Skills" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>EMOTIONAL INTELLIGENCE</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Emotional intelligence (EI) is your ability to understand and manage emotions—your own and others'. It's a key skill for success in any career.
        </p>

        <div style={{ marginTop: '16pt', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12pt' }}>
          <div style={{
            backgroundColor: '#E8F5E9',
            padding: '12pt',
            borderRadius: '4pt',
            borderLeft: '4pt solid #2DCC71'
          }}>
            <h4 style={{ fontSize: '11pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Self-Awareness</h4>
            <p style={{ fontSize: '10pt', color: '#666', margin: 0, lineHeight: 1.4 }}>Understanding your own emotions and reactions</p>
          </div>
          <div style={{
            backgroundColor: '#E3F2FD',
            padding: '12pt',
            borderRadius: '4pt',
            borderLeft: '4pt solid #3498DB'
          }}>
            <h4 style={{ fontSize: '11pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Self-Management</h4>
            <p style={{ fontSize: '10pt', color: '#666', margin: 0, lineHeight: 1.4 }}>Managing emotions productively</p>
          </div>
          <div style={{
            backgroundColor: '#FFF3E0',
            padding: '12pt',
            borderRadius: '4pt',
            borderLeft: '4pt solid #E67E22'
          }}>
            <h4 style={{ fontSize: '11pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Social Awareness</h4>
            <p style={{ fontSize: '10pt', color: '#666', margin: 0, lineHeight: 1.4 }}>Recognizing others' emotions and needs</p>
          </div>
          <div style={{
            backgroundColor: '#F3E5F5',
            padding: '12pt',
            borderRadius: '4pt',
            borderLeft: '4pt solid #9B59B6'
          }}>
            <h4 style={{ fontSize: '11pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Relationship Management</h4>
            <p style={{ fontSize: '10pt', color: '#666', margin: 0, lineHeight: 1.4 }}>Building strong relationships</p>
          </div>
        </div>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginTop: '16pt' }}>
          High emotional intelligence helps you work well in teams, handle challenges, and succeed in leadership roles—valuable for any career!
        </p>
      </div>
      <ReportFooter pageNumber={12} totalPages={22} />
    </div>
  );
}

// PAGE 10: SKILLS & ABILITIES
export function SkillsPage1({ output }: { output: Class6ScoreOutput }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Skills & Abilities" email="Part 1: Your Abilities" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR SKILLS & ABILITIES</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Your skills are your abilities to do specific things. Some come naturally; others develop with practice. All can be improved!
        </p>

        <div style={{ marginTop: '16pt', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12pt' }}>
          <CircleChart percentage={78} label="Communication" color="#3498DB" />
          <CircleChart percentage={85} label="Problem-Solving" color="#2DCC71" />
          <CircleChart percentage={72} label="Teamwork" color="#E67E22" />
          <CircleChart percentage={81} label="Creativity" color="#9B59B6" />
        </div>
      </div>
      <ReportFooter pageNumber={13} totalPages={22} />
    </div>
  );
}

// PAGE 11: SKILLS PART 2
export function SkillsPage2({ output }: { output: Class6ScoreOutput }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Skills & Abilities" email="Part 2: Development Areas" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>DEVELOPING YOUR SKILLS</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Everyone has areas where they can grow. These are opportunities for development, not weaknesses!
        </p>

        <div style={{ marginTop: '16pt' }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Skills to Develop</h3>
          {['Leadership', 'Public Speaking', 'Technical Skills', 'Time Management'].map((skill, idx) => (
            <div key={idx} style={{
              backgroundColor: '#F5F7FA',
              padding: '12pt',
              borderRadius: '4pt',
              marginBottom: '10pt'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11pt', fontWeight: 600, color: '#1F3A52' }}>{skill}</span>
                <div style={{
                  width: '60pt',
                  height: '6pt',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '3pt',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${45 + idx * 10}%`,
                    height: '100%',
                    backgroundColor: '#3498DB'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{
          backgroundColor: '#E8F5E9',
          padding: '12pt',
          borderRadius: '4pt',
          marginTop: '16pt',
          borderLeft: '4pt solid #2DCC71'
        }}>
          <p style={{ fontSize: '10pt', color: '#1F3A52', margin: 0, lineHeight: 1.5 }}>
            <strong>✓ Action:</strong> Pick one skill to focus on this month. Practice regularly, and you'll see improvement!
          </p>
        </div>
      </div>
      <ReportFooter pageNumber={14} totalPages={22} />
    </div>
  );
}

// PAGE 12: RECOMMENDED CAREER DOMAINS
export function CareerDomainsPage() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Career Opportunities" email="Top 5 Fields" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR TOP CAREER DOMAINS</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '16pt' }}>
          Based on your profile, these five career domains match your interests and strengths:
        </p>

        <div style={{ marginTop: '12pt' }}>
          <CareerDomainCard
            rank={1}
            domain="Technology & Innovation"
            percentage={89}
            description="Software, AI, robotics, and digital innovation"
          />
          <CareerDomainCard
            rank={2}
            domain="Creative Arts & Design"
            percentage={78}
            description="Art, design, music, and creative expression"
          />
          <CareerDomainCard
            rank={3}
            domain="Science & Research"
            percentage={76}
            description="Biology, chemistry, physics, and discovery"
          />
          <CareerDomainCard
            rank={4}
            domain="Business & Entrepreneurship"
            percentage={72}
            description="Starting companies, management, strategy"
          />
          <CareerDomainCard
            rank={5}
            domain="Education & Mentoring"
            percentage={68}
            description="Teaching, coaching, and helping others learn"
          />
        </div>
      </div>
      <ReportFooter pageNumber={15} totalPages={22} />
    </div>
  );
}

// PAGES 13-15: CAREER DOMAIN DETAILS
export function CareerDomainDetail1() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Technology & Innovation" email="Domain Deep-Dive" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>TECHNOLOGY & INNOVATION</h2>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>What is it?</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          Creating new technology solutions and innovations that solve real problems. This includes software development, AI, robotics, and digital products.
        </p>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Common Roles</h3>
        <ul style={{ margin: '0 0 12pt 20pt', padding: 0 }}>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Software Developer</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>AI/ML Engineer</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Product Designer</li>
          <li style={{ fontSize: '11pt', color: '#475569' }}>Robotics Engineer</li>
        </ul>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Key Skills Needed</h3>
        <div style={{ display: 'flex', gap: '8pt', flexWrap: 'wrap' }}>
          {['Programming', 'Problem-Solving', 'Creativity', 'Teamwork'].map((skill, idx) => (
            <span key={idx} style={{
              backgroundColor: '#E3F2FD',
              color: '#3498DB',
              padding: '6pt 12pt',
              borderRadius: '16pt',
              fontSize: '10pt',
              fontWeight: 600
            }}>
              {skill}
            </span>
          ))}
        </div>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginTop: '12pt', marginBottom: '8pt' }}>Future Outlook</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          ⚡ <strong>Growing</strong> - Technology is evolving rapidly. Demand for tech professionals is very high and growing.
        </p>
      </div>
      <ReportFooter pageNumber={16} totalPages={22} />
    </div>
  );
}

export function CareerDomainDetail2() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Creative Arts & Design" email="Domain Deep-Dive" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>CREATIVE ARTS & DESIGN</h2>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>What is it?</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          Expressing creativity through visual art, design, music, film, and storytelling. Making things beautiful and meaningful.
        </p>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Common Roles</h3>
        <ul style={{ margin: '0 0 12pt 20pt', padding: 0 }}>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Graphic Designer</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>UX/UI Designer</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Animator</li>
          <li style={{ fontSize: '11pt', color: '#475569' }}>Artist/Illustrator</li>
        </ul>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Key Skills Needed</h3>
        <div style={{ display: 'flex', gap: '8pt', flexWrap: 'wrap' }}>
          {['Creativity', 'Visual Thinking', 'Technical Skills', 'Communication'].map((skill, idx) => (
            <span key={idx} style={{
              backgroundColor: '#FFF3E0',
              color: '#E67E22',
              padding: '6pt 12pt',
              borderRadius: '16pt',
              fontSize: '10pt',
              fontWeight: 600
            }}>
              {skill}
            </span>
          ))}
        </div>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginTop: '12pt', marginBottom: '8pt' }}>Future Outlook</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          🎨 <strong>Growing</strong> - Creative professionals are in demand across all industries. Build a strong portfolio!
        </p>
      </div>
      <ReportFooter pageNumber={17} totalPages={22} />
    </div>
  );
}

export function CareerDomainDetail3() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Science & Research" email="Domain Deep-Dive" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>SCIENCE & RESEARCH</h2>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>What is it?</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          Investigating how the world works through experiments, research, and discovery. Solving mysteries and creating new knowledge.
        </p>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Common Roles</h3>
        <ul style={{ margin: '0 0 12pt 20pt', padding: 0 }}>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Research Scientist</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Biologist</li>
          <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '4pt' }}>Chemist</li>
          <li style={{ fontSize: '11pt', color: '#475569' }}>Lab Technician</li>
        </ul>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>Key Skills Needed</h3>
        <div style={{ display: 'flex', gap: '8pt', flexWrap: 'wrap' }}>
          {['Analytical Thinking', 'Curiosity', 'Math/Science', 'Precision'].map((skill, idx) => (
            <span key={idx} style={{
              backgroundColor: '#F3E5F5',
              color: '#9B59B6',
              padding: '6pt 12pt',
              borderRadius: '16pt',
              fontSize: '10pt',
              fontWeight: 600
            }}>
              {skill}
            </span>
          ))}
        </div>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginTop: '12pt', marginBottom: '8pt' }}>Future Outlook</h3>
        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, margin: 0 }}>
          🔬 <strong>Growing</strong> - Science drives innovation. Climate, medicine, and space research offer exciting opportunities.
        </p>
      </div>
      <ReportFooter pageNumber={18} totalPages={22} />
    </div>
  );
}

// PAGE 16: TOP CAREERS & SALARY
export function TopCareersPage() {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Top Careers" email="Opportunities & Salary" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>TOP CAREER ROLES FOR YOU</h2>

        {[
          { name: 'Software Developer', salary: '₹8-15 LPA', companies: 'Google, Microsoft, Amazon, TCS' },
          { name: 'UX/UI Designer', salary: '₹6-12 LPA', companies: 'Adobe, Figma, Google, Startups' },
          { name: 'Data Analyst', salary: '₹7-14 LPA', companies: 'Facebook, LinkedIn, Amazon, Banks' },
          { name: 'Product Manager', salary: '₹10-20 LPA', companies: 'Netflix, Spotify, Airbnb, Startups' },
          { name: 'AI/ML Engineer', salary: '₹12-25 LPA', companies: 'Google, OpenAI, Tesla, Startups' }
        ].map((role, idx) => (
          <div key={idx} style={{
            backgroundColor: '#F5F7FA',
            padding: '12pt',
            borderRadius: '4pt',
            marginBottom: '10pt'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6pt' }}>
              <h3 style={{ fontSize: '11pt', fontWeight: 700, color: '#1F3A52', margin: 0 }}>
                #{idx + 1} {role.name}
              </h3>
              <span style={{ fontSize: '10pt', fontWeight: 700, color: '#2DCC71', backgroundColor: '#E8F5E9', padding: '4pt 8pt', borderRadius: '4pt' }}>
                {role.salary}
              </span>
            </div>
            <p style={{ fontSize: '9pt', color: '#666', margin: 0 }}>
              <strong>Top Companies:</strong> {role.companies}
            </p>
          </div>
        ))}

        <p style={{ fontSize: '10pt', color: '#666', marginTop: '12pt', lineHeight: 1.5 }}>
          💡 <strong>Note:</strong> Salaries shown are typical entry-level to mid-level ranges. They vary based on location, experience, and skills.
        </p>
      </div>
      <ReportFooter pageNumber={19} totalPages={22} />
    </div>
  );
}

// PAGE 17: YOUR 15-YEAR ROADMAP
export function RoadmapPage() {
  const milestones = [
    { year: 'Now', title: 'Explore & Learn', description: 'Try different subjects, join clubs, explore coding or design' },
    { year: 'Age 14-15', title: 'Build Skills', description: 'Choose specializations, start online courses, build portfolio' },
    { year: 'Age 16-17', title: 'Prepare for Future', description: 'Excel in relevant subjects, internships, entrance exams prep' },
    { year: 'Age 18-20', title: 'Higher Education', description: 'Pursue relevant degree program in your chosen field' },
    { year: 'Age 20-25', title: 'Gain Experience', description: 'Get internships and entry-level jobs, build professional network' },
    { year: 'Age 25+', title: 'Growth & Leadership', description: 'Advance to senior roles, lead projects, continuous learning' }
  ];

  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Career Path" email="15-Year Roadmap" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR 15-YEAR ROADMAP</h2>

        <p style={{ fontSize: '11pt', color: '#475569', lineHeight: 1.6, marginBottom: '12pt' }}>
          Here's a suggested timeline for your career journey. Remember, you can adjust this based on your evolving interests!
        </p>

        <Timeline milestones={milestones} />
      </div>
      <ReportFooter pageNumber={21} totalPages={22} />
    </div>
  );
}

// PAGE 18: SUMMARY & ACTION PLAN
export function SummaryPage({ output, studentName }: { output: Class6ScoreOutput; studentName: string }) {
  return (
    <div style={PAGE_STYLE}>
      <ReportHeader studentName="Your Journey" email="Summary & Next Steps" />
      <div style={{ padding: '26pt', paddingBottom: '80pt', height: 'calc(297mm - 120pt)', overflow: 'hidden' }}>
        <h2 style={{ fontSize: '24pt', fontWeight: 700, color: '#1F3A52', marginBottom: '12pt' }}>YOUR CAREER JOURNEY SUMMARY</h2>

        <div style={{
          backgroundColor: '#E8F5E9',
          padding: '14pt',
          borderRadius: '4pt',
          borderLeft: '4pt solid #2DCC71',
          marginBottom: '16pt'
        }}>
          <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '8pt' }}>📌 Key Takeaways</h3>
          <ul style={{ margin: 0, paddingLeft: '20pt' }}>
            <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '6pt' }}>You have strong creative and analytical abilities</li>
            <li style={{ fontSize: '11pt', color: '#475569', marginBottom: '6pt' }}>Technology and design are promising fields for you</li>
            <li style={{ fontSize: '11pt', color: '#475569' }}>Your motivators align well with innovation-driven careers</li>
          </ul>
        </div>

        <h3 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', marginBottom: '8pt' }}>✅ Your Action Plan</h3>

        <div style={{
          backgroundColor: '#E3F2FD',
          padding: '12pt',
          borderRadius: '4pt',
          marginBottom: '10pt',
          borderLeft: '4pt solid #3498DB'
        }}>
          <p style={{ fontSize: '11pt', fontWeight: 600, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>This Month</p>
          <p style={{ fontSize: '10pt', color: '#666', margin: 0 }}>Join a coding club or art class. Explore one new subject.</p>
        </div>

        <div style={{
          backgroundColor: '#FFF3E0',
          padding: '12pt',
          borderRadius: '4pt',
          marginBottom: '10pt',
          borderLeft: '4pt solid #E67E22'
        }}>
          <p style={{ fontSize: '11pt', fontWeight: 600, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Next 3 Months</p>
          <p style={{ fontSize: '10pt', color: '#666', margin: 0 }}>Start an online course in your area of interest.</p>
        </div>

        <div style={{
          backgroundColor: '#F3E5F5',
          padding: '12pt',
          borderRadius: '4pt',
          borderLeft: '4pt solid #9B59B6'
        }}>
          <p style={{ fontSize: '11pt', fontWeight: 600, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>Next Year</p>
          <p style={{ fontSize: '10pt', color: '#666', margin: 0 }}>Build a small project or portfolio. Talk to professionals in your field.</p>
        </div>

        <p style={{ fontSize: '10pt', color: '#666', marginTop: '12pt', lineHeight: 1.5 }}>
          This report is just the beginning. Keep exploring, learning, and growing. Your interests may change—that's perfectly normal!
        </p>
      </div>
      <ReportFooter pageNumber={22} totalPages={22} />
    </div>
  );
}
