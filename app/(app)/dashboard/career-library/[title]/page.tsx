'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Share2, Bookmark, Briefcase, TrendingUp, Clock, Globe } from 'lucide-react';
import { CAREER_LIBRARY } from '@/constants/catalog';

const typeColorMap: Record<string, string> = {
  Technical: '#6366F1',
  Management: '#F59E0B',
  Healthcare: '#EC4899',
  Professional: '#3B82F6',
};

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

export default function CareerDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);

  const title = Array.isArray(params.title) ? params.title[0] : params.title;
  const decodedTitle = decodeURIComponent(title);

  const career = CAREER_LIBRARY.find(c => c.title.toLowerCase() === decodedTitle.toLowerCase());

  if (!career) {
    return (
      <div style={{ padding: '40px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>Career not found</h1>
        <Link href="/dashboard/career-library" style={{ color: '#7c3aed', textDecoration: 'none', marginTop: '16px', display: 'inline-block' }}>
          Back to Career Library
        </Link>
      </div>
    );
  }

  const cType = getCareerType(career.title);
  const outlook = getGrowthOutlook(career.title);
  const color = typeColorMap[cType] || '#6366F1';

  const tabs = ['Overview', 'Roles & Responsibilities', 'Skills Required', 'Education', 'Salary', 'Career Path', 'Related Careers', 'Companies Hiring'];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/dashboard/career-library" style={{ textDecoration: 'none', color: '#7c3aed', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back
          </Link>
          <div style={{ flex: 1, textAlign: 'center', marginLeft: '16px', marginRight: '16px' }}>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
              <Link href="/dashboard/career-library" style={{ textDecoration: 'none', color: '#7c3aed' }}>Career Library</Link>
              {' > '}
              <span style={{ color: '#7c3aed' }}>{career.cluster}</span>
              {' > '}
              <span style={{ color: '#1f2937' }}>{career.title}</span>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => { setSaved(!saved); alert(saved ? 'Removed from saved careers' : 'Career saved to your list'); }} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '6px', background: saved ? '#f3e8ff' : '#fff', color: saved ? '#7c3aed' : '#1f2937', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              <Bookmark style={{ width: '16px', height: '16px', fill: saved ? '#7c3aed' : 'none' }} /> Save
            </button>
            <button onClick={() => { alert('Share link copied to clipboard!'); navigator.clipboard.writeText(window.location.href); }} style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#7c3aed', color: '#fff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px' }}>
              <Share2 style={{ width: '16px', height: '16px' }} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* Left Section - Career Info */}
          <div>
            {/* Icon Card */}
            <div style={{ width: '120px', height: '120px', borderRadius: '12px', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', marginBottom: '24px' }}>
              🧠
            </div>

            {/* Career Title */}
            <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>{career.title}</h1>

            {/* Status Badge */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: '#e0f2fe', color: '#0369a1', borderRadius: '6px', fontSize: '14px', fontWeight: '600' }}>
                <TrendingUp style={{ width: '16px', height: '16px' }} />
                {outlook} Career
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '16px', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>
              {career.description}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              <span style={{ display: 'inline-block', padding: '8px 12px', background: '#f3e8ff', color: '#7c3aed', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                {career.cluster}
              </span>
              <span style={{ display: 'inline-block', padding: '8px 12px', background: `${color}20`, color: color, borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                {cType}
              </span>
              <span style={{ display: 'inline-block', padding: '8px 12px', background: '#dcfce7', color: '#15803d', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                {outlook}
              </span>
              <span style={{ display: 'inline-block', padding: '8px 12px', background: '#fef3c7', color: '#92400e', borderRadius: '6px', fontSize: '13px', fontWeight: '600' }}>
                Future Ready
              </span>
            </div>
          </div>

          {/* Right Section - Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Salary Stat Card */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💰</span> Avg. Salary
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{career.salary}</div>
            </div>

            {/* Experience Level */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: '16px', height: '16px' }} /> Experience Level
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>0 - 8+ Years</div>
            </div>

            {/* Career Outlook */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <TrendingUp style={{ width: '16px', height: '16px' }} /> Career Outlook
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#15803d' }}>{outlook}</div>
            </div>

            {/* Employment Type */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase style={{ width: '16px', height: '16px' }} /> Employment Type
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Full-time</div>
            </div>

            {/* Work Environment */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe style={{ width: '16px', height: '16px' }} /> Work Environment
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>Office / Hybrid / Remote</div>
            </div>

            {/* CTA Button */}
            <button onClick={() => alert('Career fit assessment coming soon! You can check how this career matches your profile.')} style={{ padding: '16px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
              Check Career Fit →
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', marginBottom: '32px', borderRadius: '8px 8px 0 0' }}>
          <div style={{ display: 'flex', overflowX: 'auto', borderBottom: '1px solid #e5e7eb' }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(/\s+/g, '-'))}
                style={{
                  padding: '16px 20px',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: activeTab === tab.toLowerCase().replace(/\s+/g, '-') ? '#7c3aed' : '#9ca3af',
                  borderBottom: activeTab === tab.toLowerCase().replace(/\s+/g, '-') ? '3px solid #7c3aed' : 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '48px' }}>
          {/* Left Content */}
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📋 Overview
            </h2>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', marginBottom: '24px' }}>
              {career.description}
            </p>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', marginTop: '24px' }}>Work Environments</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              {['IT Companies', 'Product Companies', 'Research Labs', 'Startups'].map((env, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '20px' }}>🏢</span>
                  <span style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>{env}</span>
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px', marginTop: '24px' }}>Key Responsibilities</h3>
            <ul style={{ listStylePosition: 'inside', fontSize: '14px', color: '#4b5563', lineHeight: '1.8', margin: 0, padding: 0 }}>
              {[
                'Design, develop, and train machine learning models',
                'Collect, clean, and preprocess large datasets',
                'Build and deploy ML models into production systems',
                'Evaluate model performance and optimize accuracy',
                'Collaborate with cross-functional teams',
                'Stay updated with the latest AI/ML research and tools'
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#7c3aed', marginRight: '8px' }}>✓</span> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Content - Skills & Salary */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Top Skills Required</h2>
              <Link href="#" style={{ fontSize: '12px', color: '#7c3aed', textDecoration: 'none', fontWeight: '500' }}>View all skills →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {['Python', 'Machine Learning', 'Deep Learning', 'SQL', 'TensorFlow', 'Data Analysis', 'NLP', 'Statistics', 'Problem Solving'].map((skill, i) => (
                <div key={i} style={{ padding: '12px', background: '#f9fafb', borderRadius: '8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#4b5563', border: '1px solid #e5e7eb' }}>
                  {skill}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '32px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Salary Range</h2>
              <Link href="#" style={{ fontSize: '12px', color: '#7c3aed', textDecoration: 'none', fontWeight: '500' }}>View salary insights →</Link>
            </div>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '32px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>{career.salary}</div>
              <div style={{ position: 'relative', height: '8px', background: '#e5e7eb', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ position: 'absolute', left: '0%', width: '40%', height: '100%', background: 'linear-gradient(90deg, #7c3aed, #7c3aed)', borderRadius: '4px' }}></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontSize: '12px' }}>
                <div style={{ color: '#6b7280' }}>Entry Level<br /><strong style={{ fontSize: '14px', color: '#1f2937' }}>₹8 LPA</strong></div>
                <div style={{ color: '#6b7280' }}>Mid Level<br /><strong style={{ fontSize: '14px', color: '#1f2937' }}>₹18 LPA</strong></div>
                <div style={{ color: '#6b7280' }}>Senior Level<br /><strong style={{ fontSize: '14px', color: '#1f2937' }}>₹35+ LPA</strong></div>
              </div>
            </div>

            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Is this career right for you?</h2>
            <div style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)', padding: '32px', borderRadius: '12px', textAlign: 'center', border: '1px solid #e9d5ff' }}>
              <div style={{ fontSize: '64px', marginBottom: '12px' }}>👨‍💻</div>
              <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px', margin: 0 }}>Answer a few questions to see how well this career matches your interests and strengths.</p>
              <button onClick={() => alert('Career fit assessment coming soon! Answer a few questions to see how well this career matches you.')} style={{ padding: '12px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '12px' }}>
                Check Career Fit →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
