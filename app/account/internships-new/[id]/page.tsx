'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, BarChart3, Award, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { getAllInternships } from '@/lib/data/careerLoader';
import type { CSSProperties } from 'react';

// Unified internship interface combining fields from multiple sources
interface UnifiedInternship {
  id: string;
  title: string;
  company: string;
  overview?: string;
  description?: string;
  difficulty?: string;
  duration: string;
  skillsGained: string[];
  skills?: string[];
  url?: string;
  applicationLink?: string;
  rating?: number;
  reviews?: number;

  // Optional fields (may not exist on all internship types)
  whatYouWillDo?: string;
  prerequisites?: string[];
  outcomes?: string[];
  companyInfo?: string;
  commitment?: string;
  learningStyle?: string;
  startDate?: Date | string;
  paid?: boolean;
  stipend?: { amount: number; currency: string };
  remote?: string;
  industry?: string[];
  certifications?: string[];
  idealFor?: string[];
}

// Type guard helper
function hasWhatYouWillDo(internship: any): internship is UnifiedInternship & { whatYouWillDo: string } {
  return internship && typeof internship.whatYouWillDo === 'string';
}

function hasPrerequisites(internship: any): internship is UnifiedInternship & { prerequisites: string[] } {
  return internship && Array.isArray(internship.prerequisites) && internship.prerequisites.length > 0;
}

function hasOutcomes(internship: any): internship is UnifiedInternship & { outcomes: string[] } {
  return internship && Array.isArray(internship.outcomes) && internship.outcomes.length > 0;
}

function hasCompanyInfo(internship: any): internship is UnifiedInternship & { companyInfo: string } {
  return internship && typeof internship.companyInfo === 'string';
}

function hasCommitment(internship: any): internship is UnifiedInternship & { commitment: string } {
  return internship && typeof internship.commitment === 'string';
}

function hasLearningStyle(internship: any): internship is UnifiedInternship & { learningStyle: string } {
  return internship && typeof internship.learningStyle === 'string';
}

function hasStartDate(internship: any): internship is UnifiedInternship & { startDate: Date | string } {
  return internship && (internship.startDate instanceof Date || typeof internship.startDate === 'string');
}

function hasCertifications(internship: any): internship is UnifiedInternship & { certifications: string[] } {
  return internship && Array.isArray(internship.certifications) && internship.certifications.length > 0;
}

function hasIdealFor(internship: any): internship is UnifiedInternship & { idealFor: string[] } {
  return internship && Array.isArray(internship.idealFor) && internship.idealFor.length > 0;
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Beginner: { bg: 'rgba(34,197,94,0.2)', text: '#86efac', border: 'rgba(34,197,94,0.3)' },
  Intermediate: { bg: 'rgba(59,130,246,0.2)', text: '#93c5fd', border: 'rgba(59,130,246,0.3)' },
  Advanced: { bg: 'rgba(168,85,247,0.2)', text: '#d8b4fe', border: 'rgba(168,85,247,0.3)' },
};

const cardStyle: CSSProperties = {
  background: 'linear-gradient(135deg, #1e293b, #334155)',
  border: '1px solid #475569',
  borderRadius: '8px',
  padding: '32px',
};

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
  const allInternships = getAllInternships();
  const internship = allInternships.find((p: any) => p.id === params.id) as UnifiedInternship | undefined;

  if (!internship) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' }}>Internship Not Found</h1>
          <Link href="/account/internships-new" style={{ color: '#60a5fa', textDecoration: 'none' }}>
            ← Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColor = DIFFICULTY_COLORS[internship.difficulty as keyof typeof DIFFICULTY_COLORS] ?? DIFFICULTY_COLORS.Beginner;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a, #1e293b, #0f172a)', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ position: 'fixed', top: '16px', left: '16px', zIndex: 50 }}
      >
        <Link href="/account/internships-new" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Back</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ position: 'relative', paddingTop: '80px', paddingBottom: '48px', paddingLeft: '20px', paddingRight: '20px', borderBottom: '1px solid #334155' }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.2 }}
            >
              {internship.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', marginBottom: '24px' }}
            >
              <span style={{ fontSize: '20px', color: '#cbd5e1', fontWeight: 600 }}>{internship.company}</span>
              {internship.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(234,179,8,0.2)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(234,179,8,0.3)' }}>
                  <span style={{ color: '#fde047', fontWeight: 'bold' }}>{internship.rating}</span>
                  <span style={{ color: '#fde047' }}>★</span>
                  <span style={{ fontSize: '12px', color: '#fde047' }}>({internship.reviews} reviews)</span>
                </div>
              )}
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}
            >
              {[
                { icon: Clock, label: 'Duration', value: internship.duration },
                { icon: BarChart3, label: 'Difficulty', value: internship.difficulty },
              ].map((stat, i) => (
                <div key={i} style={{ background: 'rgba(51,65,85,0.5)', border: '1px solid #475569', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <stat.icon size={16} color="#94a3b8" />
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{stat.label}</span>
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: 0 }}>{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              href={internship.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                color: '#fff', fontWeight: 'bold', padding: '12px 32px', borderRadius: '8px',
                textDecoration: 'none', marginBottom: '32px',
              }}
            >
              Start This Program
              <ExternalLink size={20} />
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '32px' }} className="ish-grid">
            {/* Left Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '32px', minWidth: 0 }}
            >
              {/* Overview */}
              <div style={cardStyle}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>Program Overview</h2>
                <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{internship.overview}</p>
              </div>

              {/* What You'll Do - if available */}
              {hasWhatYouWillDo(internship) && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>
                    What You&rsquo;ll Do
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {internship.whatYouWillDo.split('|').map((item: string, i: number) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ color: '#cbd5e1', margin: 0 }}>{item.trim()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Gained */}
              <div style={cardStyle}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award color="#60a5fa" size={24} />
                  Skills You&rsquo;ll Gain
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {internship.skillsGained.map((skill) => (
                    <div key={skill} style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', padding: '12px' }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#93c5fd', margin: 0 }}>{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {hasPrerequisites(internship) && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>Prerequisites</h2>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {internship.prerequisites.map((prereq: string) => (
                      <li key={prereq} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', color: '#cbd5e1' }}>
                        <span style={{ color: '#60a5fa', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes */}
              {hasOutcomes(internship) && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp color="#4ade80" size={24} />
                    What You&rsquo;ll Get
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {internship.outcomes.map((outcome: string) => (
                      <div key={outcome} style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle size={20} color="#4ade80" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: '13px', color: '#86efac', fontWeight: 600, margin: 0 }}>{outcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Info */}
              {hasCompanyInfo(internship) && (
                <div style={cardStyle}>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users color="#60a5fa" size={24} />
                    About {internship.company}
                  </h2>
                  <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>{internship.companyInfo}</p>
                </div>
              )}
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}
            >
              {/* Quick Facts */}
              <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', border: '1px solid #475569', borderRadius: '8px', padding: '24px', position: 'sticky', top: '80px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>Quick Facts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Difficulty Level</p>
                    <div style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '13px',
                      background: difficultyColor.bg, color: difficultyColor.text, border: `1px solid ${difficultyColor.border}`,
                    }}>
                      {internship.difficulty}
                    </div>
                  </div>

                  {hasCommitment(internship) && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Time Commitment</p>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{internship.commitment}</p>
                    </div>
                  )}

                  {hasLearningStyle(internship) && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Learning Style</p>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{internship.learningStyle}</p>
                    </div>
                  )}

                  <div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Duration</p>
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{internship.duration}</p>
                  </div>

                  {hasStartDate(internship) && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Start Date</p>
                      <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{String(internship.startDate)}</p>
                    </div>
                  )}

                  {hasCertifications(internship) && (
                    <div>
                      <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 4px 0' }}>Certification</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {internship.certifications.map((cert: string) => (
                          <p key={cert} style={{ fontSize: '13px', color: '#fde047', fontWeight: 600, margin: 0 }}>{cert}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ideal For */}
              {hasIdealFor(internship) && (
                <div style={{ background: 'linear-gradient(135deg, #1e293b, #334155)', border: '1px solid #475569', borderRadius: '8px', padding: '24px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>Ideal For</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {internship.idealFor.map((ideal: string) => (
                      <div key={ideal} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
                        <span style={{ color: '#60a5fa' }}>→</span>
                        {ideal}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Free Badge */}
              <div style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(5,150,105,0.2))', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#4ade80', margin: '0 0 8px 0' }}>✓</p>
                <p style={{ color: '#fff', fontWeight: 'bold', margin: '0 0 4px 0' }}>100% FREE</p>
                <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>No hidden costs or subscriptions</p>
              </div>

              {/* CTA */}
              <a
                href={internship.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', width: '100%', textAlign: 'center', textDecoration: 'none',
                  background: 'linear-gradient(90deg, #2563eb, #3b82f6)',
                  color: '#fff', fontWeight: 'bold', padding: '12px 16px', borderRadius: '8px',
                }}
              >
                Start Learning
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        style={{ padding: '48px 20px', borderTop: '1px solid #334155', background: 'rgba(15,23,42,0.5)', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0' }}>Explore More Programs</h2>
        <p style={{ color: '#cbd5e1', marginBottom: '24px' }}>Discover 200+ internships and learning programs from industry leaders</p>
        <Link href="/account/internships-new" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}>
          ← Back to All Internships
        </Link>
      </motion.section>

      <style>{`
        @media (max-width: 900px) {
          .ish-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
