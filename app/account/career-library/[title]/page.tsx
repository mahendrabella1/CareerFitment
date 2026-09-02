'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, TrendingUp, Users, Target, Zap, BookOpen, Code2, Award } from 'lucide-react';
import { CAREER_LIBRARY_930 } from '@/lib/data/careerLibrary930';

const clusterIcons: Record<string, string> = {
  tech: '💻', engineering: '⚙️', business: '💼', health: '🏥',
  creative: '🎨', social: '📚', science: '🔬', trades: '🔧'
};

const clusterColors: Record<string, { bg: string; text: string; border: string }> = {
  tech: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600', border: 'border-blue-200' },
  engineering: { bg: 'from-orange-500 to-red-500', text: 'text-orange-600', border: 'border-orange-200' },
  business: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600', border: 'border-purple-200' },
  health: { bg: 'from-red-500 to-pink-500', text: 'text-red-600', border: 'border-red-200' },
  creative: { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-600', border: 'border-indigo-200' },
  social: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600', border: 'border-green-200' },
  science: { bg: 'from-violet-500 to-purple-500', text: 'text-violet-600', border: 'border-violet-200' },
  trades: { bg: 'from-amber-500 to-orange-500', text: 'text-amber-600', border: 'border-amber-200' }
};

export default function CareerDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);

  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  const decodedTitle = decodeURIComponent(title);
  const career = CAREER_LIBRARY_930.find(c => c.name.toLowerCase() === decodedTitle.toLowerCase());

  if (!career) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>Career Not Found</h1>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>The career you're looking for doesn't exist.</p>
          <Link href="/account/career-library" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#3b82f6', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back to Library
          </Link>
        </motion.div>
      </div>
    );
  }

  const colors = clusterColors[career.clusterId] || clusterColors.tech;
  const demandColor = career.currentDemand === 'high' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50';
  const inrSalary = career.salaryRange?.find(s => s.currency === 'INR' && s.experience === '0-2 years');
  const usdSalary = career.salaryRange?.find(s => s.currency === 'USD' && s.experience === '0-2 years');

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/account/career-library" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
            <ArrowLeft size={16} /> Career Library
          </Link>
          <div style={{ display: 'flex', gap: '12px' }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSaved(!saved)} style={{ padding: '8px 16px', border: `2px solid ${saved ? '#3b82f6' : '#e2e8f0'}`, borderRadius: '8px', background: saved ? '#eff6ff' : '#fff', color: saved ? '#3b82f6' : '#64748b', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
              {saved ? '❤️ Saved' : '🤍 Save'}
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }} style={{ padding: '8px 16px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
              📤 Share
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '60px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
            {/* Left */}
            <motion.div variants={itemVariants}>
              <div style={{ marginBottom: '24px' }}>
                <span style={{ display: 'inline-block', fontSize: '48px', marginRight: '16px' }}>{clusterIcons[career.clusterId]}</span>
                <span style={{ display: 'inline-block', padding: '8px 16px', background: '#e0e7ff', color: '#4f46e5', borderRadius: '8px', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>
                  {career.clusterId}
                </span>
              </div>
              <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#0f172a', marginBottom: '16px', lineHeight: '1.2' }}>
                {career.name}
              </h1>
              <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>
                {career.overview}
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: career.currentDemand === 'high' ? '#dcfce7' : '#fef3c7', color: career.currentDemand === 'high' ? '#15803d' : '#b45309', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>
                  <Zap size={14} /> {career.currentDemand === 'high' ? 'High Demand' : 'Stable'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px', fontWeight: '600', fontSize: '13px' }}>
                  <TrendingUp size={14} /> {career.emergingDemand === 'high' ? 'Growing Fast' : 'Steady'}
                </span>
              </div>
            </motion.div>

            {/* Right Stats */}
            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* Salary */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>💰</span> Avg Salary (0-2 yrs)
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>
                  {inrSalary ? `₹${(inrSalary.min / 100000).toFixed(1)}L` : 'N/A'}
                </div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  {usdSalary ? `$${usdSalary.min}K (USD)` : ''}
                </div>
              </div>

              {/* Experience */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📈</span> Career Growth
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>Beginner</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>to Expert in 3+ yrs</div>
              </div>

              {/* Skills Count */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🎯</span> Key Skills
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#0f172a' }}>{career.skills?.length || 5}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Required</div>
              </div>

              {/* Outlook */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🚀</span> Future Outlook
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>Excellent</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Next 5 years</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 24px' }}>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

          {/* Left Column */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

            {/* What They Do */}
            <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Briefcase size={24} style={{ color: '#3b82f6' }} />
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>What They Do</h2>
              </div>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: '1.7', margin: 0 }}>
                {career.whatTheyDo}
              </p>
            </div>

            {/* Skills */}
            {career.skills && career.skills.length > 0 && (
              <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <Code2 size={24} style={{ color: '#8b5cf6' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Key Skills Required</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                  {career.skills.map((skill, i) => (
                    <motion.div key={i} whileHover={{ scale: 1.05 }} style={{ padding: '12px 16px', background: '#f0f9ff', color: '#0369a1', borderRadius: '8px', fontWeight: '600', fontSize: '14px', border: '1px solid #bae6fd' }}>
                      ✓ {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {career.education && (
              <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <BookOpen size={24} style={{ color: '#06b6d4' }} />
                  <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Education & Qualifications</h2>
                </div>
                <div style={{ display: 'grid', gap: '16px' }}>
                  {career.education.degrees && career.education.degrees.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Degrees</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {career.education.degrees.map((deg, i) => (
                          <span key={i} style={{ padding: '6px 12px', background: '#f1f5f9', color: '#475569', borderRadius: '6px', fontSize: '13px' }}>{deg}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {career.education.certifications && career.education.certifications.length > 0 && (
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>Certifications</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {career.education.certifications.map((cert, i) => (
                          <span key={i} style={{ padding: '6px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '13px' }}>🏆 {cert}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pathways */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {career.beginner && (
                <motion.div whileHover={{ y: -4 }} style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '28px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px' }}>🌱</span>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#166534' }}>{career.beginner.title}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {career.beginner.steps?.map((step, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>→</span> {step}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#166534', background: '#fff', padding: '6px 12px', borderRadius: '4px', display: 'inline-block' }}>
                    ⏱️ {career.beginner.duration}
                  </div>
                </motion.div>
              )}

              {career.advanced && (
                <motion.div whileHover={{ y: -4 }} style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)', padding: '28px', borderRadius: '12px', border: '1px solid #fcd34d' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px' }}>⭐</span>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#92400e' }}>{career.advanced.title}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                    {career.advanced.steps?.map((step, i) => (
                      <div key={i} style={{ fontSize: '13px', color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>→</span> {step}
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#92400e', background: '#fff', padding: '6px 12px', borderRadius: '4px', display: 'inline-block' }}>
                    ⏱️ {career.advanced.duration}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Right Sidebar */}
          <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* AI Impact */}
            {career.aiImpact && (
              <div style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)', padding: '24px', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#4f46e5', textTransform: 'uppercase', marginBottom: '8px' }}>🤖 AI Impact</div>
                <p style={{ fontSize: '14px', color: '#4f46e5', lineHeight: '1.6', margin: 0 }}>
                  {career.aiImpact}
                </p>
              </div>
            )}

            {/* Future Outlook */}
            {career.futureOutlook && (
              <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', padding: '24px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d', textTransform: 'uppercase', marginBottom: '8px' }}>🚀 Future Outlook</div>
                <p style={{ fontSize: '14px', color: '#15803d', lineHeight: '1.6', margin: 0 }}>
                  {career.futureOutlook}
                </p>
              </div>
            )}

            {/* Salary Ranges */}
            {career.salaryRange && career.salaryRange.length > 0 && (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', marginBottom: '12px' }}>💵 Salary Ranges</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {career.salaryRange.slice(0, 3).map((sal, i) => (
                    <div key={i} style={{ padding: '10px', background: '#f8fafc', borderRadius: '6px', fontSize: '12px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>
                        {sal.experience} ({sal.region})
                      </div>
                      <div style={{ color: '#475569', marginTop: '2px' }}>
                        {sal.currency === 'INR' ? `₹${sal.min.toLocaleString()} - ₹${sal.max.toLocaleString()}` : `$${sal.min}K - $${sal.max}K`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Career fit assessment coming soon!')}
              style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '15px',
                textAlign: 'center'
              }}
            >
              ✨ Check Your Fit Score
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
