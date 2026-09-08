'use client';

import React, { useState } from 'react';

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState<'6' | '7' | '8'>('8');

  const reportData = {
    '6': {
      name: 'Sarah Johnson',
      type: 'INFP',
      personality: 'Creative, thoughtful individual',
      riasec: 'Artistic (85%), Social (72%), Investigative (68%)',
      strengths: 'Linguistic-Verbal (82%), Interpersonal (78%)',
      motivators: 'Creativity (88%), Autonomy (82%), Learning (80%)',
      careers: 'Creative Arts, Writing, Teaching, Social Services',
    },
    '7': {
      name: 'Michael Chen',
      type: 'ENTJ',
      personality: 'Natural leader with analytical thinking',
      riasec: 'Enterprising (88%), Investigative (76%), Social (68%)',
      strengths: 'Leadership (86%), Logical-Mathematical (84%)',
      motivators: 'Achievement (90%), Power & Influence (85%)',
      careers: 'Business, Management, Engineering, Entrepreneurship',
    },
    '8': {
      name: 'Emma Williams',
      type: 'Strategic Thinker',
      personality: 'Analytical with strong problem-solving abilities',
      riasec: 'Investigative (82%), Enterprising (76%), Social (72%)',
      strengths: 'Logical-Mathematical (85%), Linguistic (78%)',
      motivators: 'Mastery & Excellence (88%), Innovation (82%)',
      careers: 'STEM, Research, Data Analysis, Engineering, Technology',
    },
  };

  const data = reportData[selectedClass];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid #d1d5db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000', margin: 0 }}>📊 Assessment Reports</h1>
            <a href="/" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'none' }}>← Back</a>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['6', '7', '8'].map((cls) => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls as any)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  backgroundColor: selectedClass === cls ? '#2563eb' : '#e5e7eb',
                  color: selectedClass === cls ? 'white' : '#000',
                  fontSize: '0.95rem',
                  transition: 'all 0.3s ease',
                }}
              >
                Class {cls}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          {/* Report Content */}
          <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#000', marginTop: 0 }}>Class {selectedClass} Assessment Report</h2>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Student Information</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>
                <strong>Name:</strong> {data.name}<br/>
                <strong>Personality Type:</strong> {data.type}<br/>
                <strong>Assessment Date:</strong> September 8, 2026
              </p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Personality Profile</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>{data.personality}</p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>RIASEC Career Interests</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>{data.riasec}</p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Strengths</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>{data.strengths}</p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Motivators & Values</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>{data.motivators}</p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Recommended Careers</h3>
              <p style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.6' }}>{data.careers}</p>
            </div>

            <div style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>Next Steps</h3>
              <ul style={{ color: '#4b5563', fontSize: '1rem', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
                <li>Explore clubs and activities matching your interests</li>
                <li>Talk to teachers and counselors about career paths</li>
                <li>Develop skills in your areas of strength</li>
                <li>Keep learning and adapting as interests evolve</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        padding: '1rem 1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 50,
        maxWidth: '400px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0 }}>
          💡 <strong>Tip:</strong> Press <code style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.4rem', borderRadius: '0.25rem' }}>Ctrl+P</code> to print/save as PDF
        </p>
      </div>
    </div>
  );
}
