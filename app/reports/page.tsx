'use client';

import React, { useState } from 'react';
import Class6Report from '@/app/account/Class6Report';
import Class7Report from '@/app/account/Class7Report';
import Class8Report from '@/app/account/Class8Report';
import { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';
import { Class7ScoreOutput } from '@/lib/newAssessment/class7Scoring';
import { Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';

const SAMPLE_CLASS6: Class6ScoreOutput = {
  personalityProfile: {
    type: 'INFP',
    ei: 'I',
    sn: 'N',
    tf: 'F',
    jp: 'P',
  },
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
  ],
  motivators: [
    { name: 'Creativity', score: 88, level: 'Very High' },
    { name: 'Autonomy', score: 82, level: 'Very High' },
    { name: 'Learning', score: 80, level: 'Very High' },
  ],
  learningStyle: {
    primary: 'Visual',
    secondary: 'Auditory',
  },
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
  ],
  domainAffinities: [
    { domain: '1', domainName: 'Creative Arts & Design', affinity: 87, reasoning: ['Strong artistic interest', 'High creativity scores'] },
    { domain: '2', domainName: 'Social Services & Counseling', affinity: 76, reasoning: ['High interpersonal skills', 'Strong social awareness'] },
    { domain: '3', domainName: 'Writing & Communication', affinity: 83, reasoning: ['Excellent verbal skills', 'Creative expression'] },
    { domain: '4', domainName: 'Education & Teaching', affinity: 74, reasoning: ['Strong people skills', 'Love of learning'] },
  ],
  summary: 'You are a creative, thoughtful individual who thrives in collaborative environments. Your strong interpersonal skills combined with innovative thinking make you well-suited for careers that value human connection and creative expression.',
};

const SAMPLE_CLASS7: Class7ScoreOutput = {
  personalityProfile: {
    type: 'ENTJ',
    ei: 'E',
    sn: 'N',
    tf: 'T',
    jp: 'J',
  },
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
  ],
  motivators: [
    { name: 'Achievement', score: 90, level: 'Very High' },
    { name: 'Power & Influence', score: 85, level: 'Very High' },
    { name: 'Knowledge', score: 78, level: 'High' },
  ],
  learningStyle: {
    primary: 'Reading/Writing',
    secondary: 'Kinesthetic',
  },
  emotionalAwareness: [
    { dimension: 'Self-Awareness', score: 78, level: 'Good' },
    { dimension: 'Self-Management', score: 82, level: 'Excellent' },
    { dimension: 'Social Awareness', score: 74, level: 'Good' },
    { dimension: 'Relationship Management', score: 76, level: 'Good' },
  ],
  creativity: [
    { indicator: 'Divergent Thinking', score: 72, level: 'Good' },
    { indicator: 'Innovation', score: 78, level: 'Good' },
    { indicator: 'Strategic Thinking', score: 85, level: 'High' },
  ],
  domainAffinities: [
    { domain: '1', domainName: 'Business & Management', affinity: 89, reasoning: ['Strong leadership', 'Strategic thinking'] },
    { domain: '2', domainName: 'Engineering & Technology', affinity: 81, reasoning: ['Logical thinking', 'Problem-solving'] },
    { domain: '3', domainName: 'Law & Policy', affinity: 78, reasoning: ['Analytical skills', 'Decision-making'] },
    { domain: '4', domainName: 'Finance & Economics', affinity: 76, reasoning: ['Numerical skills', 'Strategic planning'] },
  ],
  summary: 'You are a natural leader with strong analytical and strategic thinking skills. Your drive for achievement and ability to influence others position you well for executive and decision-making roles in dynamic organizations.',
};

const SAMPLE_CLASS8: Class8ScoreOutput = {
  personalityProfile: {
    typeScores: {
      introversion_extroversion: 65,
      sensing_intuition: 72,
      thinking_feeling: 58,
      judging_perceiving: 68,
    },
    dominantType: 'Strategic Thinker with Analytical Focus',
  },
  riasecScores: [
    { code: 'I', name: 'Investigative', score: 82, description: 'Strong interest in research and analysis' },
    { code: 'E', name: 'Enterprising', score: 76, description: 'Leadership and initiative abilities' },
    { code: 'A', name: 'Artistic', score: 65, description: 'Creative expression interests' },
    { code: 'S', name: 'Social', score: 72, description: 'People-oriented skills' },
    { code: 'C', name: 'Conventional', score: 58, description: 'Organization and structure' },
    { code: 'R', name: 'Realistic', score: 61, description: 'Practical problem-solving' },
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
      'Use diagrams and flowcharts to understand complex concepts',
      'Take detailed notes with visual organization',
      'Create mind maps to connect ideas',
      'Watch demonstrations and tutorials',
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
    { domain: 'STEM Fields', affinity: 85, reasoning: 'Strong analytical and logical skills' },
    { domain: 'Research & Academia', affinity: 82, reasoning: 'Deep investigative interests' },
    { domain: 'Technology & Innovation', affinity: 80, reasoning: 'Creative problem-solving' },
    { domain: 'Business Analysis', affinity: 76, reasoning: 'Strategic thinking abilities' },
  ],
  summary: {
    profileDescription: 'You are an analytical thinker with strong problem-solving abilities and a keen interest in understanding how things work.',
    topStrengths: ['Logical reasoning', 'Analytical thinking', 'Problem-solving', 'Leadership potential'],
    developmentAreas: ['Public speaking', 'Emotional expression', 'Networking skills'],
    careerDirections: ['STEM careers', 'Research', 'Data analysis', 'Technology', 'Engineering'],
    nextSteps: [
      'Explore STEM clubs and competitions',
      'Work on developing leadership skills',
      'Seek mentorship in your areas of interest',
      'Balance analytical work with collaborative projects',
    ],
  },
};

export default function ReportsPage() {
  const [selectedClass, setSelectedClass] = useState<'6' | '7' | '8'>('8');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow">
        <div className="max-w-full px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">📊 Sample Assessment Reports</h1>
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 underline">← Back</a>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedClass('6')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedClass === '6'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Class 6 Report
            </button>
            <button
              onClick={() => setSelectedClass('7')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedClass === '7'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Class 7 Report
            </button>
            <button
              onClick={() => setSelectedClass('8')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedClass === '8'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-900 hover:bg-slate-300'
              }`}
            >
              Class 8 Report (Refactored)
            </button>
          </div>
        </div>
      </div>

      {/* Report Display */}
      <div className="py-8">
        {selectedClass === '6' && (
          <Class6Report
            studentName="Sarah Johnson"
            studentEmail="sarah.johnson@school.edu"
            output={SAMPLE_CLASS6}
          />
        )}

        {selectedClass === '7' && (
          <Class7Report
            studentName="Michael Chen"
            studentEmail="michael.chen@school.edu"
            output={SAMPLE_CLASS7}
          />
        )}

        {selectedClass === '8' && (
          <Class8Report
            studentName="Emma Williams"
            output={SAMPLE_CLASS8}
            assessmentDate="September 8, 2026"
            studentEmail="emma.williams@school.edu"
          />
        )}
      </div>

      {/* Footer Note */}
      <div className="fixed bottom-4 left-4 right-4 bg-white border border-slate-300 rounded-lg p-4 shadow max-w-md mx-auto">
        <p className="text-sm text-slate-600">
          💡 <strong>Tip:</strong> Use Ctrl+P (or Cmd+P on Mac) to print or save as PDF. Try the print button in Class 8 report!
        </p>
      </div>
    </div>
  );
}
