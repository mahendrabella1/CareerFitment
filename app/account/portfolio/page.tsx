'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit3, Plus, Trash2, Eye, Share2, Copy, Check } from 'lucide-react';
import type { PortfolioProfile, PortfolioExperience, PortfolioEducation, PortfolioCertification, PortfolioSkill } from '@/lib/data/portfolioSchema';

const TABS = ['Overview', 'Experience', 'Education', 'Certifications', 'Skills', 'Settings'];

export default function PortfolioPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Overview');
  const [portfolio, setPortfolio] = useState<PortfolioProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio/my-portfolio');
      if (res.ok) {
        const data = await res.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    if (portfolio) {
      const link = `${window.location.origin}/portfolio/${portfolio.profileSlug}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Build Your Professional Profile</h1>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32, lineHeight: 1.6 }}>
            Create a LinkedIn-like profile to showcase your skills, experience, and achievements. Share it with employers, collaborators, and your network.
          </p>
          <button
            onClick={() => window.location.href = '/api/portfolio/create'}
            style={{
              padding: '12px 32px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Create Portfolio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', margin: 0 }}>Build Your Portfolio</h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Create your professional profile</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={copyPublicLink}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: '#6b7280'
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <Link href={`/portfolio/${portfolio.profileSlug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                background: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Eye size={16} /> View Public
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '16px 20px',
              border: 'none',
              background: activeTab === tab ? '#fff' : 'transparent',
              borderBottom: activeTab === tab ? '2px solid #3b82f6' : 'none',
              color: activeTab === tab ? '#3b82f6' : '#64748b',
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {activeTab === 'Overview' && <OverviewSection portfolio={portfolio} />}
        {activeTab === 'Experience' && <ExperienceSection portfolio={portfolio} onReload={loadPortfolio} />}
        {activeTab === 'Education' && <EducationSection portfolio={portfolio} onReload={loadPortfolio} />}
        {activeTab === 'Certifications' && <CertificationsSection portfolio={portfolio} onReload={loadPortfolio} />}
        {activeTab === 'Skills' && <SkillsSection portfolio={portfolio} onReload={loadPortfolio} />}
        {activeTab === 'Settings' && <SettingsSection portfolio={portfolio} onReload={loadPortfolio} />}
      </div>
    </div>
  );
}

function OverviewSection({ portfolio }: { portfolio: PortfolioProfile }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 32 }}>
      {/* Profile Card */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb', height: 'fit-content' }}>
        <div style={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: '#e5e7eb',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 700,
          color: '#6b7280'
        }}>
          {portfolio.headline.charAt(0)}
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, textAlign: 'center' }}>{portfolio.headline}</h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: '8px 0 0', textAlign: 'center' }}>{portfolio.location}</p>
        {portfolio.careerFit && (
          <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: 12, marginTop: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#0369a1', fontWeight: 600, textTransform: 'uppercase' }}>Top Career</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e', marginTop: 4 }}>{portfolio.careerFit}</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 16 }}>Professional Summary</h3>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: 0 }}>{portfolio.bio}</p>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', margin: 0, marginBottom: 12 }}>Portfolio Statistics</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>{portfolio.experience.length}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Experience</div>
              </div>
              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>{portfolio.skills.length}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Skills</div>
              </div>
              <div style={{ padding: 12, background: '#f8fafc', borderRadius: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>{portfolio.views}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Profile Views</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceSection({ portfolio, onReload }: { portfolio: PortfolioProfile; onReload: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Work Experience</h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>
      {portfolio.experience.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 20px' }}>No experience added yet. Click "Add Experience" to get started.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {portfolio.experience.map(exp => (
            <div key={exp.id} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{exp.title}</h4>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{exp.company}</p>
                  <p style={{ fontSize: 12, color: '#94a3b8', margin: '2px 0 0' }}>
                    {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                  </p>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <Edit3 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EducationSection({ portfolio, onReload }: { portfolio: PortfolioProfile; onReload: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Education</h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <Plus size={16} /> Add Education
        </button>
      </div>
      {portfolio.education.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 20px' }}>No education added yet. Click "Add Education" to get started.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {portfolio.education.map(edu => (
            <div key={edu.id} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{edu.degree} in {edu.field}</h4>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{edu.institution}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CertificationsSection({ portfolio, onReload }: { portfolio: PortfolioProfile; onReload: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Certifications</h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>
      {portfolio.certifications.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 20px' }}>No certifications added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {portfolio.certifications.map(cert => (
            <div key={cert.id} style={{ padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e5e7eb' }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{cert.name}</h4>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{cert.issuer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillsSection({ portfolio, onReload }: { portfolio: PortfolioProfile; onReload: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0 }}>Skills</h3>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 16px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600
          }}
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>
      {portfolio.skills.length === 0 ? (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '40px 20px' }}>No skills added yet.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {portfolio.skills.map(skill => (
            <div key={skill.id}
              style={{
                padding: '8px 12px',
                background: '#e0e7ff',
                border: '1px solid #c7d2fe',
                borderRadius: 20,
                fontSize: 13,
                fontWeight: 600,
                color: '#4f46e5'
              }}
            >
              {skill.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsSection({ portfolio, onReload }: { portfolio: PortfolioProfile; onReload: () => void }) {
  return (
    <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb', maxWidth: 600 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 24 }}>Portfolio Settings</h3>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={portfolio.isPublic}
            style={{ width: 18, height: 18, cursor: 'pointer' }}
          />
          <div>
            <div style={{ fontWeight: 600, color: '#0f172a' }}>Make profile public</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Allow anyone with your profile link to view your portfolio</div>
          </div>
        </label>
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 12 }}>Privacy Options</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={portfolio.showEmail} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#475569' }}>Show email address</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={portfolio.showPhone} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#475569' }}>Show phone number</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
            <input type="checkbox" checked={portfolio.showCareerScore} style={{ width: 16, height: 16, cursor: 'pointer' }} />
            <span style={{ fontSize: 13, color: '#475569' }}>Show career fit score</span>
          </label>
        </div>
      </div>
    </div>
  );
}
