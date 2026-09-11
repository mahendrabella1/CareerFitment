'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock } from 'lucide-react';
import { getAllInternships } from '@/lib/data/careerLoader';
import { INTERNSHIP_CATEGORIES } from '@/lib/data/internships200Plus';

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const allPrograms = getAllInternships();

  const filteredInternships = useMemo(() => {
    return allPrograms.filter((internship: any) => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.overview.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || (internship.industry && internship.industry.includes(selectedCategory));
      const matchesDifficulty = !selectedDifficulty || internship.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const difficultyStyles: Record<string, any> = {
    Beginner: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    Intermediate: { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' },
    Advanced: { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to right bottom, #0f172a, #1e293b, #0f172a)', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Hero Section */}
      <section style={{ padding: '40px 20px', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#fff', margin: '0 0 16px 0', lineHeight: 1.2 }}>
              200+ Free Internships & Learning Programs
            </h1>
            <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto' }}>
              Gain real-world experience from industry leaders. Hands-on projects, certifications, and portfolio building. 100% FREE.
            </p>
          </div>

          {/* Alert Box */}
          <div style={{ background: 'rgba(217, 119, 6, 0.15)', border: '1px solid rgba(217, 119, 6, 0.3)', borderRadius: '8px', padding: '16px', marginBottom: '30px', display: 'flex', gap: '12px' }}>
            <div style={{ fontSize: '20px' }}>⚠️</div>
            <div>
              <p style={{ color: '#fef3c7', fontWeight: '600', margin: '0 0 4px 0' }}>100% FREE Programs</p>
              <p style={{ color: '#fde68a', fontSize: '14px', margin: 0 }}>All internships and learning programs on this page are completely free. No hidden costs, no subscription fees.</p>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
            {[
              { label: 'Programs', value: '210+', icon: '👥' },
              { label: 'Self-Paced', value: '99%', icon: '⚡' },
              { label: 'Certifications', value: '150+', icon: '🏆' },
              { label: 'Avg Rating', value: '4.75★', icon: '⭐' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', padding: '16px', border: '1px solid #0369a1' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{stat.icon}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section style={{ padding: '30px 20px', borderBottom: '1px solid #334155' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', color: '#64748b', pointerEvents: 'none' }} />
              <input
                type="text"
                placeholder="Search programs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '12px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Filters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            {/* Difficulty Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Difficulty Level</label>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>Industry/Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                style={{
                  width: '100%',
                  padding: '8px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">All Categories</option>
                {INTERNSHIP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>View Mode</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    background: viewMode === 'grid' ? '#2563eb' : '#334155',
                    color: '#fff'
                  }}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    background: viewMode === 'list' ? '#2563eb' : '#334155',
                    color: '#fff'
                  }}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
            Showing <span style={{ fontWeight: '600', color: '#fff' }}>{filteredInternships.length}</span> of {allPrograms.length} programs
          </p>
        </div>
      </section>

      {/* Results Section */}
      <section style={{ padding: '30px 20px', minHeight: '400px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {filteredInternships.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: '40px' }}>
              <p style={{ color: '#64748b', fontSize: '16px' }}>No internships found matching your criteria.</p>
            </div>
          ) : (
            <div style={{
              display: viewMode === 'grid' ? 'grid' : 'block',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {filteredInternships.map((internship: any, idx: number) => (
                <Link key={internship.id} href={`/account/internships-new/${internship.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    padding: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    marginBottom: viewMode === 'list' ? '12px' : '0',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as any).style.borderColor = '#0ea5e9';
                    (e.currentTarget as any).style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as any).style.borderColor = '#334155';
                    (e.currentTarget as any).style.transform = 'translateY(0)';
                  }}
                  >
                    {/* Header */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '6px', gap: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff', margin: 0, flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {internship.title}
                        </h3>
                        {internship.rating && (
                          <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '600', flexShrink: 0 }}>
                            {internship.rating}★
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0 }}>{internship.company}</p>
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 12px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {internship.description || internship.overview}
                    </p>

                    {/* Meta Info */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                      {internship.difficulty && (
                        <span style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          fontWeight: '600',
                          borderRadius: '4px',
                          background: difficultyStyles[internship.difficulty]?.bg || '#334155',
                          color: difficultyStyles[internship.difficulty]?.text || '#94a3b8',
                          border: `1px solid ${difficultyStyles[internship.difficulty]?.border || '#334155'}`
                        }}>
                          {internship.difficulty}
                        </span>
                      )}
                      {internship.duration && (
                        <span style={{ padding: '4px 8px', fontSize: '11px', fontWeight: '600', borderRadius: '4px', background: '#334155', color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {internship.duration}
                        </span>
                      )}
                    </div>

                    {/* Skills */}
                    {internship.skillsGained && (
                      <div style={{ marginBottom: '12px' }}>
                        <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 6px 0' }}>Top Skills:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {internship.skillsGained.slice(0, 3).map((skill: string) => (
                            <span key={skill} style={{ padding: '3px 6px', fontSize: '11px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', borderRadius: '4px' }}>
                              {skill}
                            </span>
                          ))}
                          {internship.skillsGained.length > 3 && (
                            <span style={{ padding: '3px 6px', fontSize: '11px', background: '#334155', color: '#94a3b8', borderRadius: '4px' }}>
                              +{internship.skillsGained.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CTA */}
                    <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>Explore Program</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <section style={{ padding: '30px 20px', borderTop: '1px solid #334155', background: 'rgba(15, 23, 42, 0.5)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 12px 0' }}>Ready to Start Learning?</h2>
          <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto 16px', lineHeight: 1.6 }}>
            Pick any program above and start your journey today. All programs are completely free and can be completed at your own pace.
          </p>
          <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
            200+ verified programs • 150+ certifications available • Trusted by millions of learners • Industry-recognized credentials
          </p>
        </div>
      </section>
    </div>
  );
}
