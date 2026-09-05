'use client';

import React, { useState } from 'react';
import { Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';

interface Class8ReportProps {
  studentName: string;
  output: Class8ScoreOutput;
  assessmentDate?: string;
}

export default function Class8Report({ studentName, output, assessmentDate = new Date().toLocaleDateString() }: Class8ReportProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    personality: true,
    riasec: true,
    strengths: false,
    aptitude: false,
    motivators: false,
    learning: false,
    emotional: false,
    creativity: false,
    careers: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePrint = () => {
    window.print();
  };


  const getColorForScore = (score: number): string => {
    if (score >= 80) return 'from-emerald-400 to-green-500';
    if (score >= 60) return 'from-cyan-400 to-blue-500';
    if (score >= 40) return 'from-amber-400 to-orange-500';
    return 'from-rose-400 to-red-500';
  };

  const getColorClassForScore = (score: number): string => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-cyan-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
      {/* Report Header - Not printed */}
      <div className="print:hidden sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Class 8 Assessment Report</h1>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition-all"
            >
              🖨️ Print or Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Report Content - Printable */}
      <div id="report-content" className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 print:p-0">
        {/* Title Page / Header Section */}
        <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 print:border-0 print:bg-white print:text-black">
          <div className="text-center mb-6 print:border-b print:border-black print:pb-6">
            <h1 className="text-4xl font-bold text-white print:text-black mb-2">
              OneGrasp Assessment Report
            </h1>
            <p className="text-lg text-slate-300 print:text-gray-600">Class 8 - Career & Personal Development</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 print:text-black print:border-t print:border-black print:pt-6">
            <div>
              <p className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Student Name</p>
              <p className="text-xl font-bold text-white print:text-black">{studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Assessment Date</p>
              <p className="text-xl font-bold text-white print:text-black">{assessmentDate}</p>
            </div>
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg print:bg-yellow-50 print:border print:border-yellow-200">
            <p className="text-slate-200 print:text-gray-700 text-sm leading-relaxed">
              This comprehensive assessment evaluates your personality preferences, career interests, strengths, and
              learning style. The insights provided are designed to help you understand yourself better and make informed
              decisions about your future.
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 print:border-black print:page-break-after-avoid">
          <h2 className="text-2xl font-bold text-white print:text-black mb-4">Your Profile</h2>
          <p className="text-lg text-slate-200 print:text-gray-800 leading-relaxed">
            {output.summary.profileDescription}
          </p>
        </div>

        {/* Personality Preferences */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('personality')}
            className="w-full p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Personality Preferences</h2>
              <span className="text-2xl">{expandedSections.personality ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.personality && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {Object.entries(output.personalityProfile.typeScores).map(([type, score]) => (
                  <div key={type} className="print:page-break-inside-avoid">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white print:text-black capitalize">{type}</span>
                      <span className={`font-bold text-lg ${getColorClassForScore(score)}`}>{score}%</span>
                    </div>
                    <div className="w-full bg-slate-700/30 rounded-full h-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-sm font-semibold text-slate-300 uppercase mb-2">Your Primary Type</p>
                <p className="text-lg font-bold text-cyan-400">{output.personalityProfile.dominantType}</p>
              </div>
            </div>
          )}
        </div>

        {/* RIASEC Career Interests */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('riasec')}
            className="w-full p-6 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Career Interests (RIASEC)</h2>
              <span className="text-2xl">{expandedSections.riasec ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.riasec && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.riasecScores.map((score, idx) => (
                <div key={score.code} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">
                      {score.code} - {score.name}
                    </span>
                    <span className={`font-bold text-lg ${getColorClassForScore(score.score)}`}>{score.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(score.score)}`}
                      style={{ width: `${score.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{score.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aptitude & Reasoning */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('aptitude')}
            className="w-full p-6 bg-gradient-to-r from-orange-900/50 to-red-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Aptitude & Reasoning</h2>
              <span className="text-2xl">{expandedSections.aptitude ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.aptitude && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50">
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div className="p-4 bg-slate-700/30 rounded-lg text-center print:border print:border-black">
                  <p className="text-xs text-slate-400 print:text-gray-600 uppercase">Overall Score</p>
                  <p className={`text-3xl font-bold ${getColorClassForScore(output.aptitudeProfile.overallScore)}`}>
                    {output.aptitudeProfile.overallScore}%
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Numeric Reasoning', key: 'numericReasoning' },
                  { label: 'Logical Deduction', key: 'logicalDeduction' },
                  { label: 'Pattern Recognition', key: 'patternRecognition' },
                  { label: 'Spatial Reasoning', key: 'spatialReasoning' },
                ].map(({ label, key }) => {
                  const category = output.aptitudeProfile[key as keyof typeof output.aptitudeProfile] as any;
                  if (!category || typeof category.score !== 'number') return null;
                  return (
                    <div key={key} className="print:page-break-inside-avoid">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-white print:text-black">{label}</span>
                        <span className={`font-bold ${getColorClassForScore(category.score)}`}>{category.score}%</span>
                      </div>
                      <div className="w-full bg-slate-700/30 rounded-full h-2">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(category.score)}`}
                          style={{ width: `${category.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{category.level}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Strength Domains */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('strengths')}
            className="w-full p-6 bg-gradient-to-r from-green-900/50 to-emerald-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Strength Domains</h2>
              <span className="text-2xl">{expandedSections.strengths ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.strengths && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.strengthDomains.map((domain) => (
                <div key={domain.code} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">{domain.domain}</span>
                    <span className={`font-bold text-lg ${getColorClassForScore(domain.score)}`}>{domain.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(domain.score)}`}
                      style={{ width: `${domain.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Level: {domain.level}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Motivators */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('motivators')}
            className="w-full p-6 bg-gradient-to-r from-pink-900/50 to-rose-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Motivators & Values</h2>
              <span className="text-2xl">{expandedSections.motivators ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.motivators && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.motivators.map((motivator) => (
                <div key={motivator.motivator} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">{motivator.motivator}</span>
                    <span className={`font-bold text-lg ${getColorClassForScore(motivator.score)}`}>{motivator.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(motivator.score)}`}
                      style={{ width: `${motivator.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{motivator.level} Intensity</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Style */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('learning')}
            className="w-full p-6 bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Learning Style</h2>
              <span className="text-2xl">{expandedSections.learning ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.learning && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-700/30 rounded-lg print:border print:border-black">
                  <p className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Primary Style</p>
                  <p className="text-lg font-bold text-white print:text-black">{output.learningStyle.primaryStyle}</p>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg print:border print:border-black">
                  <p className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Secondary Style</p>
                  <p className="text-lg font-bold text-white print:text-black">{output.learningStyle.secondaryStyle}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-white print:text-black mb-3">Recommended Strategies:</p>
                <ul className="space-y-2">
                  {output.learningStyle.recommendations.map((strategy, idx) => (
                    <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                      <span className="text-cyan-400">✓</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Emotional & Social Awareness */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('emotional')}
            className="w-full p-6 bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Emotional Intelligence</h2>
              <span className="text-2xl">{expandedSections.emotional ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.emotional && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.emotionalAwareness.map((component) => (
                <div key={component.component} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">{component.component}</span>
                    <span className={`font-bold text-lg ${getColorClassForScore(component.score)}`}>{component.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(component.score)}`}
                      style={{ width: `${component.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{component.level}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Creativity & Future Readiness */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('creativity')}
            className="w-full p-6 bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Creativity & Future Readiness</h2>
              <span className="text-2xl">{expandedSections.creativity ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.creativity && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.creativity.map((indicator) => (
                <div key={indicator.indicator} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">{indicator.indicator}</span>
                    <span className={`font-bold text-lg ${getColorClassForScore(indicator.score)}`}>{indicator.score}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(indicator.score)}`}
                      style={{ width: `${indicator.score}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Level: {indicator.level}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Career Domain Affinities */}
        <div className="mb-8 print:page-break-inside-avoid">
          <button
            onClick={() => toggleSection('careers')}
            className="w-full p-6 bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white print:text-black">Career Domain Alignment</h2>
              <span className="text-2xl">{expandedSections.careers ? '▼' : '▶'}</span>
            </div>
          </button>

          {expandedSections.careers && (
            <div className="mt-4 p-6 bg-slate-800/20 rounded-lg border border-slate-700/50 space-y-4">
              {output.domainAffinities.map((domain, idx) => (
                <div key={domain.domain} className="print:page-break-inside-avoid">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white print:text-black">
                      {idx + 1}. {domain.domain}
                    </span>
                    <span className={`font-bold text-lg ${getColorClassForScore(domain.affinity)}`}>{domain.affinity}%</span>
                  </div>
                  <div className="w-full bg-slate-700/30 rounded-full h-2 mb-2">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getColorForScore(domain.affinity)}`}
                      style={{ width: `${domain.affinity}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 italic">{domain.reasoning}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="mb-8 p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-slate-700/50 print:page-break-inside-avoid print:border-black">
          <h2 className="text-2xl font-bold text-white print:text-black mb-4">Recommendations for Your Future</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white print:text-black mb-2">Your Top Strengths:</h3>
              <ul className="space-y-1">
                {output.summary.topStrengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-emerald-400">★</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white print:text-black mb-2">Areas for Development:</h3>
              <ul className="space-y-1">
                {output.summary.developmentAreas.map((area, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-amber-400">→</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white print:text-black mb-2">Suggested Career Directions:</h3>
              <ul className="space-y-1">
                {output.summary.careerDirections.map((career, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-cyan-400">✓</span>
                    <span>{career}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white print:text-black mb-2">Next Steps:</h3>
              <ul className="space-y-1">
                {output.summary.nextSteps.map((step, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-purple-400">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-700/50 print:border-black text-center">
          <p className="text-xs text-slate-400 print:text-gray-600">
            OneGrasp Assessment System | Class 8 Career & Personal Development | {assessmentDate}
          </p>
        </div>
      </div>
    </div>
  );
}
