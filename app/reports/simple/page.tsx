'use client';

import React, { useState } from 'react';
import Class8Report from '@/app/account/Class8Report';
import { Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';

// Simplified sample data for faster loading
const SAMPLE_CLASS8: Class8ScoreOutput = {
  personalityProfile: {
    typeScores: {
      introversion_extroversion: 65,
      sensing_intuition: 72,
      thinking_feeling: 58,
      judging_perceiving: 68,
    },
    dominantType: 'Strategic Thinker',
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
  ],
  motivators: [
    { motivator: 'Mastery & Excellence', score: 88, level: 'High' },
    { motivator: 'Innovation', score: 82, level: 'High' },
    { motivator: 'Recognition', score: 72, level: 'Moderate' },
  ],
  learningStyle: {
    primaryStyle: 'Visual',
    secondaryStyle: 'Reading/Writing',
    recommendations: [
      'Use diagrams and flowcharts',
      'Take detailed notes',
      'Create mind maps',
      'Watch tutorials',
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
  ],
  domainAffinities: [
    { domain: 'STEM Fields', affinity: 85, reasoning: 'Strong analytical skills' },
    { domain: 'Research', affinity: 82, reasoning: 'Investigative interests' },
    { domain: 'Technology', affinity: 80, reasoning: 'Problem-solving' },
    { domain: 'Business', affinity: 76, reasoning: 'Strategic thinking' },
  ],
  summary: {
    profileDescription: 'You are an analytical thinker with strong problem-solving abilities.',
    topStrengths: ['Logical reasoning', 'Analytical thinking', 'Problem-solving', 'Leadership'],
    developmentAreas: ['Public speaking', 'Emotional expression', 'Networking'],
    careerDirections: ['STEM careers', 'Research', 'Data analysis', 'Engineering'],
    nextSteps: [
      'Explore STEM clubs',
      'Develop leadership skills',
      'Seek mentorship',
      'Balance work with collaboration',
    ],
  },
};

export default function SimpleReportsPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f3f4f6' }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'white',
        borderBottom: '1px solid #d1d5db',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>
            📊 Class 8 Assessment Report (FAST VERSION)
          </h1>
          <a href="/reports" style={{ fontSize: '0.875rem', color: '#2563eb', textDecoration: 'underline' }}>
            ← Back to Full Reports
          </a>
        </div>
      </div>

      {/* Report */}
      <div style={{ padding: '2rem 0' }}>
        <Class8Report
          studentName="Emma Williams"
          output={SAMPLE_CLASS8}
          assessmentDate="September 8, 2026"
          studentEmail="emma.williams@school.edu"
        />
      </div>

      {/* Footer */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        right: '1rem',
        background: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        padding: '1rem',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '28rem',
        margin: '0 auto',
        zIndex: 40
      }}>
        <p style={{ fontSize: '0.875rem', color: '#4b5563' }}>
          💡 <strong>Tip:</strong> Press Ctrl+P to print or save as PDF
        </p>
      </div>
    </div>
  );
}
