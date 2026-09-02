'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Bookmark, TrendingUp, ArrowRight } from 'lucide-react';
import { getCareers } from '@/lib/data/careerLoader';

const DOMAIN_CARDS = [
  { id: 'tech', name: 'Technology', icon: '💻', count: 150 },
  { id: 'engineering', name: 'Engineering', icon: '⚙️', count: 140 },
  { id: 'business', name: 'Business & Management', icon: '💼', count: 130 },
  { id: 'health', name: 'Healthcare', icon: '🏥', count: 120 },
  { id: 'creative', name: 'Arts & Creative', icon: '🎨', count: 110 },
  { id: 'social', name: 'Social & Education', icon: '📚', count: 100 },
  { id: 'science', name: 'Science', icon: '🔬', count: 100 },
  { id: 'trades', name: 'Trades & Skills', icon: '🔧', count: 80 },
];

const getCareerType = (title: string) => {
  if (title.toLowerCase().includes('engineer') || title.toLowerCase().includes('developer')) return 'Technical';
  if (title.toLowerCase().includes('manager') || title.toLowerCase().includes('consultant')) return 'Management';
  if (title.toLowerCase().includes('doctor') || title.toLowerCase().includes('nurse')) return 'Healthcare';
  return 'Professional';
};

const getGrowthOutlook = (title: string) => {
  if (['ai', 'machine learning', 'data scientist', 'software'].some(w => title.toLowerCase().includes(w))) return 'High Growth';
  if (['doctor', 'nurse', 'therapist'].some(w => title.toLowerCase().includes(w))) return 'High Demand';
  return 'Stable Career';
};

const typeColorMap: Record<string, string> = {
  Technical: '#6366F1',
  Management: '#F59E0B',
  Healthcare: '#EC4899',
  Professional: '#3B82F6',
};

export default function CareerLibraryPage() {
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [careerType, setCareerType] = useState('All');
  const [educationLevel, setEducationLevel] = useState('All');
  const [sort, setSort] = useState('A to Z');

  const careers = useMemo(() => {
    const { data } = getCareers(0, 1000); // Get all careers
    let filtered = data.filter((c) => {
      const matchSearch = (c.name + ' ' + c.cluster + ' ' + c.overview + ' ' + (c.skills?.join(' ') || '')).toLowerCase().includes(search.toLowerCase());
      const matchDomain = selectedDomain === 'All' || c.cluster === selectedDomain;
      const matchCareerType = careerType === 'All' || getCareerType(c.name) === careerType;
      return matchSearch && matchDomain && matchCareerType;
    });

    if (sort === 'A to Z') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'Salary (High to Low)') {
      filtered.sort((a, b) => (b.salaryUSDMid || 0) - (a.salaryUSDMid || 0));
    }

    return filtered;
  }, [search, selectedDomain, careerType, sort]);

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: 0 }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 600, color: '#1f2937' }}>Career Library</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #e9d5ff 0%, #dbeafe 100%)',
        padding: '48px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
          {/* Left Content */}
          <div>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Career Library</h2>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px', lineHeight: '1.6' }}>
              Explore 900+ careers across diverse domains.<br />
              Discover roles that match your interests, skills, and aspirations.
            </p>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#9ca3af' }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search careers by title, keyword or domain…"
                  style={{
                    width: '100%',
                    padding: '12px 16px 12px 40px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
              <button style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                <Search style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
          </div>

          {/* Right Illustration */}
          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: '80px', opacity: 0.1, position: 'absolute', top: '-20px', right: '-20px' }}>📊</div>
            <div style={{ fontSize: '120px' }}>👩‍💻</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Browse by Domain */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>Browse by Domain</h3>
            <Link href="#all-careers" style={{ fontSize: '14px', fontWeight: '500', color: '#7c3aed', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              View all domains <ArrowRight style={{ width: '16px', height: '16px' }} />
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {DOMAIN_CARDS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                style={{
                  padding: '20px',
                  border: selectedDomain === domain.id ? '2px solid #7c3aed' : '2px solid #e5e7eb',
                  borderRadius: '12px',
                  background: selectedDomain === domain.id ? '#f3e8ff' : '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '28px' }}>{domain.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff', background: '#9ca3af', padding: '4px 8px', borderRadius: '4px' }}>{domain.count}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{domain.name}</h4>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{domain.count}+ Careers</p>
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Sub Domain</label>
            <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
              <option value="All">All</option>
              {DOMAIN_CARDS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Career Type</label>
            <select value={careerType} onChange={(e) => setCareerType(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
              <option value="All">All</option>
              <option value="Technical">Technical</option>
              <option value="Management">Management</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Professional">Professional</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Education Level</label>
            <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
              <option value="All">All</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Sort By</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '14px', background: '#fff' }}>
              <option value="A to Z">A to Z</option>
              <option value="Salary (High to Low)">Salary (High to Low)</option>
            </select>
          </div>
          <button onClick={() => { setSearch(''); setSelectedDomain('All'); setCareerType('All'); }}
            style={{ color: '#7c3aed', background: 'none', border: 'none', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear Filters
          </button>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>All Careers ({careers.length}+)</h3>

          {/* Table */}
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Career</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Domain</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Career Type</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Growth Outlook</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Avg. Salary</th>
                  <th style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#6b7280' }}></th>
                </tr>
              </thead>
              <tbody>
                {careers.slice(0, 20).map((career, idx) => {
                  const cType = getCareerType(career.name);
                  const outlook = getGrowthOutlook(career.name);
                  const color = typeColorMap[cType] || '#6366F1';
                  const clusterNames: Record<string, string> = { tech: 'Technology', engineering: 'Engineering', health: 'Healthcare', business: 'Business', social: 'Social', creative: 'Creative', science: 'Science', trades: 'Trades' };
                  const salaryStr = career.salaryRange?.[0] ? `₹${career.salaryRange[0].min?.toLocaleString()} - ${career.salaryRange[0].max?.toLocaleString()}` : 'N/A';

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f3f4f6', transition: 'background 0.2s', background: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '16px' }}>
                        <Link href={`/account/career-library/${encodeURIComponent(career.name)}`}
                          style={{ textDecoration: 'none', color: '#1f2937', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                            {career.name.charAt(0)}
                          </div>
                          {career.name}
                        </Link>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: '#6b7280' }}>{clusterNames[career.clusterId] || career.clusterId}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 8px', background: `${color}20`, color: color, fontSize: '12px', fontWeight: '600', borderRadius: '4px' }}>
                          {cType}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ display: 'inline-block', padding: '4px 8px', background: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '600', borderRadius: '4px' }}>
                          {career.currentDemand === 'high' ? 'High Growth' : career.currentDemand === 'medium' ? 'Stable Career' : 'Emerging'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{salaryStr}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <Bookmark style={{ width: '18px', height: '18px', color: '#d1d5db', cursor: 'pointer' }} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '32px' }}>
          <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>←</button>
          <button style={{ padding: '8px 12px', border: '1px solid #7c3aed', borderRadius: '6px', background: '#7c3aed', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>1</button>
          <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>2</button>
          <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>3</button>
          <span style={{ color: '#9ca3af' }}>...</span>
          <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>30</button>
          <button style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', background: '#fff', cursor: 'pointer' }}>→</button>
        </div>
      </div>
    </div>
  );
}
