'use client';

import React, { useState } from 'react';
import { Class6Report } from '@/app/account/Class6Report';
import { Class7Report } from '@/app/account/Class7Report';
import Class8Report from '@/app/account/Class8Report';
import { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';
import { Class7ScoreOutput } from '@/lib/newAssessment/class7Scoring';
import { Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';

// Sample data for all reports
const SAMPLE_CLASS6: Class6ScoreOutput = {
  personalityProfile: { type: 'INFP', ei: 'I', sn: 'N', tf: 'F', jp: 'P' },
  riasecScores: [
    { letter: 'A', name: 'Artistic (Creative)', score: 85, level: 'High' },
    { letter: 'S', name: 'Social (People-oriented)', score: 72, level: 'High' },
    { letter: 'I', name: 'Investigative (Analytical)', score: 68, level: 'High' },
    { letter: 'E', name: 'Enterprising (Leadership)', score: 55, level: 'Moderate' },
    { letter: 'C', name: 'Conventional (Organized)', score: 48, level: 'Moderate' },
    { letter: 'R', name: 'Realistic (Hands-on)', score: 42, level: 'Moderate' },
  ],
  strengthDomains: [
    { name: 'Linguistic-Verbal', code: 'LV', score: 82, level: 'Strong' },
    { name: 'Interpersonal', code: 'IP', score: 78, level: 'Strong' },
    { name: 'Intrapersonal', code: 'IA', score: 75, level: 'Strong' },
    { name: 'Musical', code: 'MU', score: 71, level: 'Good' },
    { name: 'Spatial-Visual', code: 'SV', score: 79, level: 'Strong' },
    { name: 'Bodily-Kinesthetic', code: 'BK', score: 68, level: 'Good' },
    { name: 'Logical-Mathematical', code: 'LM', score: 62, level: 'Moderate' },
    { name: 'Naturalistic', code: 'NA', score: 65, level: 'Moderate' },
  ],
  motivators: [
    { name: 'Creativity', score: 88, level: 'Very High' },
    { name: 'Autonomy', score: 82, level: 'Very High' },
    { name: 'Learning', score: 80, level: 'Very High' },
    { name: 'Achievement', score: 72, level: 'High' },
    { name: 'Collaboration', score: 76, level: 'High' },
    { name: 'Recognition', score: 68, level: 'Good' },
  ],
  learningStyle: { primary: 'Visual', secondary: 'Auditory' },
  emotionalAwareness: [
    { dimension: 'Self-Awareness', score: 76, level: 'Good' },
    { dimension: 'Self-Management', score: 72, level: 'Good' },
    { dimension: 'Social Awareness', score: 80, level: 'Excellent' },
    { dimension: 'Relationship Management', score: 78, level: 'Good' },
  ],
  creativity: [
    { indicator: 'Divergent Thinking', score: 85, level: 'High' },
    { indicator: 'Innovation', score: 79, level: 'Good' },
    { indicator: 'Creative Problem-Solving', score: 81, level: 'High' },
    { indicator: 'Imagination', score: 87, level: 'High' },
    { indicator: 'Artistic Expression', score: 84, level: 'High' },
  ],
  domainAffinities: [
    { domain: '1', domainName: 'Creative Arts & Design', affinity: 87, reasoning: ['Strong artistic interest', 'High creativity scores'] },
    { domain: '2', domainName: 'Social Services & Counseling', affinity: 76, reasoning: ['High interpersonal skills'] },
    { domain: '3', domainName: 'Writing & Communication', affinity: 83, reasoning: ['Excellent verbal skills'] },
    { domain: '4', domainName: 'Education & Teaching', affinity: 74, reasoning: ['Strong people skills'] },
    { domain: '5', domainName: 'Performing Arts', affinity: 79, reasoning: ['Creative talents'] },
  ],
  summary: 'Creative, thoughtful individual with strong interpersonal skills.',
};

const SAMPLE_CLASS7: Class7ScoreOutput = {
  personalityProfile: { type: 'ENTJ', ei: 'E', sn: 'N', tf: 'T', jp: 'J' },
  riasecScores: [
    { letter: 'E', name: 'Enterprising', score: 88, level: 'Very High' },
    { letter: 'I', name: 'Investigative', score: 76, level: 'High' },
    { letter: 'A', name: 'Artistic', score: 62, level: 'Moderate' },
    { letter: 'S', name: 'Social', score: 68, level: 'High' },
    { letter: 'C', name: 'Conventional', score: 58, level: 'Moderate' },
    { letter: 'R', name: 'Realistic', score: 64, level: 'Moderate' },
  ],
  strengthDomains: [
    { name: 'Logical-Mathematical', code: 'LM', score: 84, level: 'Strong' },
    { name: 'Leadership', code: 'LD', score: 86, level: 'Strong' },
    { name: 'Linguistic', code: 'LG', score: 79, level: 'Strong' },
    { name: 'Interpersonal', code: 'IP', score: 82, level: 'Strong' },
    { name: 'Intrapersonal', code: 'IA', score: 80, level: 'Strong' },
    { name: 'Spatial-Visual', code: 'SV', score: 75, level: 'Good' },
    { name: 'Bodily-Kinesthetic', code: 'BK', score: 72, level: 'Good' },
    { name: 'Musical', code: 'MU', score: 65, level: 'Moderate' },
  ],
  motivators: [
    { name: 'Achievement', score: 90, level: 'Very High' },
    { name: 'Power & Influence', score: 85, level: 'Very High' },
    { name: 'Knowledge', score: 78, level: 'High' },
    { name: 'Competition', score: 88, level: 'Very High' },
    { name: 'Status', score: 80, level: 'High' },
    { name: 'Autonomy', score: 82, level: 'High' },
  ],
  learningStyle: { primary: 'Reading/Writing', secondary: 'Kinesthetic' },
  emotionalAwareness: [
    { dimension: 'Self-Awareness', score: 78, level: 'Good' },
    { dimension: 'Self-Management', score: 82, level: 'Excellent' },
    { dimension: 'Social Awareness', score: 74, level: 'Good' },
    { dimension: 'Relationship Management', score: 76, level: 'Good' },
    { dimension: 'Empathy', score: 70, level: 'Moderate' },
  ],
  creativity: [
    { indicator: 'Divergent Thinking', score: 72, level: 'Good' },
    { indicator: 'Innovation', score: 78, level: 'Good' },
    { indicator: 'Strategic Thinking', score: 85, level: 'High' },
    { indicator: 'Visionary Planning', score: 84, level: 'High' },
    { indicator: 'Risk Assessment', score: 81, level: 'High' },
  ],
  domainAffinities: [
    { domain: '1', domainName: 'Business & Management', affinity: 89, reasoning: ['Strong leadership', 'Strategic thinking'] },
    { domain: '2', domainName: 'Engineering & Technology', affinity: 81, reasoning: ['Logical thinking'] },
    { domain: '3', domainName: 'Law & Policy', affinity: 78, reasoning: ['Analytical skills'] },
    { domain: '4', domainName: 'Finance & Economics', affinity: 76, reasoning: ['Numerical skills'] },
    { domain: '5', domainName: 'Entrepreneurship', affinity: 87, reasoning: ['Visionary planning'] },
  ],
  summary: 'Natural leader with strong analytical and strategic thinking skills.',
};

const SAMPLE_CLASS8: Class8ScoreOutput = {
  personalityProfile: {
    typeScores: { introversion_extroversion: 65, sensing_intuition: 72, thinking_feeling: 58, judging_perceiving: 68 },
    dominantType: 'Strategic Thinker with Analytical Focus',
  },
  riasecScores: [
    { code: 'I', name: 'Investigative', score: 82, description: 'Research and analysis' },
    { code: 'E', name: 'Enterprising', score: 76, description: 'Leadership abilities' },
    { code: 'A', name: 'Artistic', score: 65, description: 'Creative interests' },
    { code: 'S', name: 'Social', score: 72, description: 'People skills' },
    { code: 'C', name: 'Conventional', score: 58, description: 'Organization' },
    { code: 'R', name: 'Realistic', score: 61, description: 'Hands-on work' },
  ],
  aptitudeProfile: {
    overallScore: 78,
    numericReasoning: { score: 85, level: 'Excellent' },
    logicalDeduction: { score: 80, level: 'Excellent' },
    patternRecognition: { score: 82, level: 'Excellent' },
    spatialReasoning: { score: 72, level: 'Good' },
  },
  strengthDomains: [
    { code: 'MI1', domain: 'Logical-Mathematical', score: 85, level: 'Strong' },
    { code: 'MI2', domain: 'Linguistic', score: 78, level: 'Strong' },
    { code: 'MI3', domain: 'Interpersonal', score: 74, level: 'Good' },
    { code: 'MI4', domain: 'Intrapersonal', score: 76, level: 'Good' },
    { code: 'MI5', domain: 'Spatial-Visual', score: 80, level: 'Strong' },
    { code: 'MI6', domain: 'Bodily-Kinesthetic', score: 68, level: 'Good' },
    { code: 'MI7', domain: 'Musical', score: 62, level: 'Moderate' },
    { code: 'MI8', domain: 'Naturalistic', score: 70, level: 'Good' },
  ],
  motivators: [
    { motivator: 'Mastery & Excellence', score: 88, level: 'High' },
    { motivator: 'Innovation', score: 82, level: 'High' },
    { motivator: 'Recognition', score: 72, level: 'Moderate' },
    { motivator: 'Achievement', score: 85, level: 'High' },
    { motivator: 'Learning & Growth', score: 86, level: 'High' },
    { motivator: 'Autonomy', score: 78, level: 'High' },
  ],
  learningStyle: {
    primaryStyle: 'Visual',
    secondaryStyle: 'Reading/Writing',
    recommendations: [
      'Use diagrams and flowcharts',
      'Take detailed notes',
      'Create mind maps',
      'Watch tutorials',
      'Use visual models',
      'Engage with infographics',
      'Read reference materials',
      'Whiteboard problem-solving',
    ],
  },
  emotionalAwareness: [
    { component: 'Self-Awareness', score: 76, level: 'Good' },
    { component: 'Self-Regulation', score: 78, level: 'Good' },
    { component: 'Motivation', score: 82, level: 'Excellent' },
    { component: 'Empathy', score: 72, level: 'Good' },
    { component: 'Social Skills', score: 75, level: 'Good' },
  ],
  creativity: [
    { indicator: 'Originality', score: 78, level: 'Good' },
    { indicator: 'Flexibility', score: 81, level: 'Good' },
    { indicator: 'Elaboration', score: 75, level: 'Good' },
    { indicator: 'Fluency', score: 79, level: 'Good' },
    { indicator: 'Innovation Index', score: 80, level: 'High' },
  ],
  domainAffinities: [
    { domain: 'STEM Fields', affinity: 85, reasoning: 'Strong analytical and logical skills' },
    { domain: 'Research & Academia', affinity: 82, reasoning: 'Deep investigative interests' },
    { domain: 'Technology & Innovation', affinity: 80, reasoning: 'Creative problem-solving' },
    { domain: 'Business Analysis', affinity: 76, reasoning: 'Strategic thinking abilities' },
    { domain: 'Engineering', affinity: 79, reasoning: 'Spatial reasoning strengths' },
  ],
  summary: {
    profileDescription: 'Analytical thinker with strong problem-solving abilities.',
    topStrengths: ['Logical reasoning', 'Analytical thinking', 'Problem-solving', 'Leadership', 'Spatial visualization'],
    developmentAreas: ['Public speaking', 'Emotional expression', 'Networking', 'Work-life balance'],
    careerDirections: ['STEM careers', 'Research', 'Data analysis', 'Software engineering', 'Engineering'],
    nextSteps: ['Explore STEM clubs', 'Develop leadership skills', 'Seek mentorship', 'Work on projects'],
  },
};

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState<'6' | '7' | '8'>('8');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Header/Navigation */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'white',
        borderBottom: '1px solid #d1d5db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1.5rem',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>📊 Assessment Reports</h1>
            <a href="/" style={{ fontSize: '0.95rem', color: '#2563eb', textDecoration: 'none' }}>← Back</a>
          </div>

          {/* Navigation Tabs */}
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
                {cls === 'full' ? 'Class 11-12' : `Class ${cls}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Class 6 */}
        {selectedClass === '6' && (
          <div key="class6">
            <Class6Report
              studentName="Sarah Johnson"
              studentEmail="sarah.johnson@school.edu"
              output={SAMPLE_CLASS6}
            />
          </div>
        )}

        {/* Class 7 */}
        {selectedClass === '7' && (
          <div key="class7">
            <Class7Report
              studentName="Michael Chen"
              studentEmail="michael.chen@school.edu"
              output={SAMPLE_CLASS7}
            />
          </div>
        )}

        {/* Class 8 */}
        {selectedClass === '8' && (
          <div key="class8">
            <Class8Report
              studentName="Emma Williams"
              output={SAMPLE_CLASS8}
              assessmentDate="September 8, 2026"
              studentEmail="emma.williams@school.edu"
            />
          </div>
        )}

      </div>

      {/* Footer Tip */}
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
