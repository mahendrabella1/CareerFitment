'use client';

import React from 'react';

export default function PreviewPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #d1d5db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '2rem'
      }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          📊 Assessment Reports Available
        </h1>
        <p style={{ fontSize: '1rem', color: '#4b5563' }}>
          Choose a report below or visit the full reports page
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

          {/* Card 1: Class 6 */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              📚 Class 6 Report
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Exploratory format for young learners with 3D visualizations
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>📄 8-9 pages</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>👤 Student: Sarah Johnson (INFP)</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>🎨 Theme: Blue</span>
            </div>
            <a href="/reports" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              View Report
            </a>
          </div>

          {/* Card 2: Class 7 */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              📚 Class 7 Report
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Enhanced exploratory format with leadership focus
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>📄 8-9 pages</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>👤 Student: Michael Chen (ENTJ)</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>🎨 Theme: Blue</span>
            </div>
            <a href="/reports" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              View Report
            </a>
          </div>

          {/* Card 3: Class 8 */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '2px solid #10b981'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              ⭐ Class 8 Report (FAST)
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Modern refactored design with ProgressBar components (33% less code!)
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>📄 6-7 pages</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>👤 Student: Emma Williams</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>🎨 Theme: Dark/Professional</span>
            </div>
            <a href="/reports/simple" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#10b981',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              View Fast Version
            </a>
          </div>

          {/* Card 4: Class 11-12 */}
          <div style={{
            background: 'white',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
              📚 Class 11-12 Report
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Comprehensive assessment with career planning focus
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>📄 8-10 pages</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>👤 Student: Aditya Patel</span>
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>🎨 Theme: Professional</span>
            </div>
            <a href="/reports" style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              borderRadius: '0.375rem',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}>
              View Report
            </a>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 4rem 2rem' }}>
        <div style={{
          background: '#ecfdf5',
          border: '1px solid #d1fae5',
          borderRadius: '0.5rem',
          padding: '1rem'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#047857' }}>
            💡 <strong>Recommendation:</strong> Start with the <strong>Class 8 Fast Version</strong> at <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>/reports/simple</code> for instant loading, or visit the <strong>Full Reports</strong> at <code style={{ background: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>/reports</code> for all 4 reports with 20+ pages of content.
          </p>
        </div>
      </div>
    </div>
  );
}
