'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, Link as LinkIcon, Share2, FileDown } from 'lucide-react';
import type { PortfolioProfile } from '@/lib/data/portfolioSchema';

export default function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const [portfolio, setPortfolio] = useState<PortfolioProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPortfolio();
  }, [params.slug]);

  const loadPortfolio = async () => {
    try {
      const res = await fetch(`/api/portfolio/public/${params.slug}`);
      if (!res.ok) {
        if (res.status === 404) {
          setError('Portfolio not found');
        } else {
          setError('Unable to load portfolio');
        }
      } else {
        const data = await res.json();
        setPortfolio(data);
        // Increment view count
        await fetch(`/api/portfolio/public/${params.slug}/view`, { method: 'POST' });
      }
    } catch (err) {
      setError('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', fontWeight: 500 }}>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, padding: 40 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Portfolio Not Found</h1>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>{error || 'This portfolio is not available or has been removed.'}</p>
          <Link href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: '#3b82f6',
              color: '#fff',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' }}>
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />

      {/* Cover Section */}
      {portfolio.coverImage && (
        <div style={{ height: 240, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      )}

      {/* Profile Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '40px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
              <div style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 64,
                fontWeight: 700,
                color: '#fff',
                border: '4px solid #fff'
              }}>
                {portfolio.headline.charAt(0)}
              </div>
              <div style={{ paddingTop: 8 }}>
                <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', margin: 0 }}>{portfolio.headline}</h1>
                {portfolio.location && (
                  <p style={{ fontSize: 16, color: '#64748b', margin: '8px 0 0' }}>📍 {portfolio.location}</p>
                )}
                {portfolio.careerFit && (
                  <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0f9ff', borderRadius: 6, display: 'inline-block' }}>
                    <span style={{ fontSize: 12, color: '#0369a1', fontWeight: 600 }}>Top Career: <strong>{portfolio.careerFit}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            {portfolio.showEmail && portfolio.email && (
              <a href={`mailto:${portfolio.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: '#3b82f6',
                  color: '#fff',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <Mail size={16} /> Email
              </a>
            )}
            {portfolio.showPhone && portfolio.phone && (
              <a href={`tel:${portfolio.phone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  color: '#374151',
                  borderRadius: 6,
                  textDecoration: 'none',
                  fontSize: 13,
                  fontWeight: 600
                }}
              >
                <Phone size={16} /> Call
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Bio */}
            {portfolio.bio && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 12 }}>About</h2>
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, margin: 0 }}>{portfolio.bio}</p>
              </div>
            )}

            {/* Experience */}
            {portfolio.experience.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20 }}>Experience</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {portfolio.experience.map((exp, idx) => (
                    <div key={exp.id} style={{ paddingBottom: idx < portfolio.experience.length - 1 ? 20 : 0, borderBottom: idx < portfolio.experience.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{exp.title}</h3>
                      <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{exp.company}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 12px' }}>
                        {exp.startDate} – {exp.currentlyWorking ? 'Present' : exp.endDate}
                      </p>
                      <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {portfolio.education.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20 }}>Education</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {portfolio.education.map((edu, idx) => (
                    <div key={edu.id} style={{ paddingBottom: idx < portfolio.education.length - 1 ? 20 : 0, borderBottom: idx < portfolio.education.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{edu.degree} in {edu.field}</h3>
                      <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>{edu.institution}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>
                        {edu.startDate} – {edu.currentlyStudying ? 'Present' : edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {portfolio.certifications.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e5e7eb' }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 20 }}>Certifications</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {portfolio.certifications.map(cert => (
                    <div key={cert.id} style={{ padding: 12, background: '#f8fafc', borderRadius: 8, borderLeft: '3px solid #3b82f6' }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>{cert.name}</h3>
                      <p style={{ fontSize: 12, color: '#64748b', margin: '2px 0 0' }}>{cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Skills */}
            {portfolio.skills.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 12 }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {portfolio.skills.map(skill => (
                    <span key={skill.id}
                      style={{
                        padding: '6px 10px',
                        background: '#e0e7ff',
                        border: '1px solid #c7d2fe',
                        borderRadius: 16,
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#4f46e5'
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {(portfolio.website || portfolio.linkedin || portfolio.github || portfolio.twitter) && (
              <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 12 }}>Links</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {portfolio.website && (
                    <a href={portfolio.website} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#3b82f6', textDecoration: 'none', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <LinkIcon size={12} /> Website
                    </a>
                  )}
                  {portfolio.linkedin && (
                    <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#0a66c2', textDecoration: 'none', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <LinkIcon size={12} /> LinkedIn
                    </a>
                  )}
                  {portfolio.github && (
                    <a href={portfolio.github} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 12, color: '#333', textDecoration: 'none', display: 'flex', gap: 6, alignItems: 'center' }}>
                      <LinkIcon size={12} /> GitHub
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Stats */}
            <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, marginBottom: 12 }}>Profile</h3>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 8px' }}>👁️ {portfolio.views} views</p>
                <p style={{ margin: 0 }}>Last updated {new Date(portfolio.lastUpdated).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#f8fafc', borderTop: '1px solid #e5e7eb', padding: '24px', textAlign: 'center', color: '#64748b', fontSize: 12 }}>
        <p style={{ margin: 0 }}>Created with OneGrasp Career Assessment</p>
      </div>
    </div>
  );
}
