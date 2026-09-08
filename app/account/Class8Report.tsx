'use client';

import React from 'react';
import { Class8ScoreOutput } from '@/lib/newAssessment/class8Scoring';
import { ProgressBar } from './ProgressBar';

interface Class8ReportProps {
  studentName: string;
  output: Class8ScoreOutput;
  assessmentDate?: string;
  studentEmail?: string;
}

export default function Class8Report({ studentName, output, assessmentDate = new Date().toLocaleDateString(), studentEmail }: Class8ReportProps) {
  const handlePrint = () => {
    window.print();
  };

  // Color scheme by score
  const getColorScheme = (score: number): 'green' | 'blue' | 'amber' | 'red' => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'amber';
    return 'red';
  };

  const printStyles = `
    @media print {
      @page {
        size: A4;
        margin: 0.5in;
      }

      html, body {
        width: 210mm;
        height: 297mm;
        margin: 0;
        padding: 0;
        background: white;
        color: black;
      }

      * {
        background: transparent !important;
        box-shadow: none !important;
      }

      body {
        font-size: 11pt;
        line-height: 1.5;
      }

      body, p, span, li, div {
        color: black !important;
        background: white !important;
      }

      h1, h2, h3 {
        color: black !important;
        page-break-after: avoid;
      }

      .mb-8 { page-break-inside: avoid; }
      .mb-6 { page-break-inside: avoid; }
    }
  `;

  return (
    <div className="min-h-screen print:min-h-0" style={{ background: 'linear-gradient(to bottom, #0f172a, #1e293b)' }}>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

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
      <div id="report-content" className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 print:p-8 print:max-w-none print:bg-white">
        {/* Title Page / Header Section */}
        <div className="mb-8 p-8 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50 print:border print:border-gray-300 print:bg-white print:text-black print:rounded-none">
          <div className="text-center mb-6 print:border-b print:border-black print:pb-6">
            <h1 className="text-4xl font-bold text-white print:text-black mb-2">
              OneGrasp Assessment Report
            </h1>
            <p className="text-lg text-slate-300 print:text-black">Class 8 - Career & Personal Development</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 print:text-black print:border-t print:border-black print:pt-6">
            <div>
              <p className="text-xs text-slate-400 print:text-gray-700 uppercase font-semibold">Student Name</p>
              <p className="text-xl font-bold text-white print:text-black">{studentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 print:text-gray-700 uppercase font-semibold">Assessment Date</p>
              <p className="text-xl font-bold text-white print:text-black">{assessmentDate}</p>
            </div>
            {studentEmail && (
              <div className="col-span-2">
                <p className="text-xs text-slate-400 print:text-gray-700 uppercase font-semibold">Email</p>
                <p className="text-sm font-semibold text-white print:text-black">{studentEmail}</p>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-700/30 rounded-lg print:bg-gray-50 print:border print:border-gray-300">
            <p className="text-slate-200 print:text-gray-800 text-sm leading-relaxed">
              This comprehensive assessment evaluates your personality preferences, career interests, strengths, and
              learning style. The insights provided are designed to help you understand yourself better and make informed
              decisions about your future.
            </p>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="mb-8 p-6 bg-slate-800/30 rounded-xl border border-slate-700/50 print:border print:border-gray-300 print:bg-gray-50 print:page-break-after-avoid">
          <h2 className="text-2xl font-bold text-white print:text-black mb-4">Your Profile</h2>
          <p className="text-lg text-slate-200 print:text-gray-800 leading-relaxed">
            {output.summary.profileDescription}
          </p>
        </div>

        {/* Personality Preferences */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-purple-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Personality Preferences</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              {Object.entries(output.personalityProfile.typeScores).map(([type, score]) => (
                <ProgressBar
                  key={type}
                  label={type.charAt(0).toUpperCase() + type.slice(1)}
                  score={score}
                  colorScheme={getColorScheme(score)}
                  showPercentage
                />
              ))}
            </div>

            <div className="p-4 bg-slate-700/30 rounded-lg print:bg-gray-50 print:border print:border-gray-300">
              <p className="text-sm font-semibold text-slate-300 print:text-gray-700 uppercase mb-2">Your Primary Type</p>
              <p className="text-lg font-bold text-cyan-400 print:text-blue-700">{output.personalityProfile.dominantType}</p>
            </div>
          </div>
        </section>

        {/* RIASEC Career Interests */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-cyan-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Career Interests (RIASEC)</h2>
            <div className="space-y-6">
              {output.riasecScores.map((score) => (
                <div key={score.code}>
                  <ProgressBar
                    label={`${score.code} - ${score.name}`}
                    score={score.score}
                    colorScheme={getColorScheme(score.score)}
                    description={score.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Aptitude & Reasoning */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-orange-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Aptitude & Reasoning</h2>

            <div className="p-4 bg-slate-700/30 rounded-lg text-center mb-6 print:bg-gray-50 print:border print:border-gray-300">
              <p className="text-xs text-slate-400 print:text-gray-700 uppercase mb-2">Overall Score</p>
              <p className="text-3xl font-bold text-orange-400 print:text-orange-700">
                {output.aptitudeProfile.overallScore}%
              </p>
            </div>

            <div className="space-y-6">
              {[
                { label: 'Numeric Reasoning', key: 'numericReasoning' },
                { label: 'Logical Deduction', key: 'logicalDeduction' },
                { label: 'Pattern Recognition', key: 'patternRecognition' },
                { label: 'Spatial Reasoning', key: 'spatialReasoning' },
              ].map(({ label, key }) => {
                const category = output.aptitudeProfile[key as keyof typeof output.aptitudeProfile] as any;
                if (!category || typeof category.score !== 'number') return null;
                return (
                  <ProgressBar
                    key={key}
                    label={label}
                    score={category.score}
                    colorScheme={getColorScheme(category.score)}
                    description={category.level}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* Strength Domains */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-green-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Strength Domains</h2>
            <div className="space-y-6">
              {output.strengthDomains.map((domain) => (
                <ProgressBar
                  key={domain.code}
                  label={domain.domain}
                  score={domain.score}
                  colorScheme={getColorScheme(domain.score)}
                  description={`Level: ${domain.level}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Motivators */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-pink-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Motivators & Values</h2>
            <div className="space-y-6">
              {output.motivators.map((motivator) => (
                <ProgressBar
                  key={motivator.motivator}
                  label={motivator.motivator}
                  score={motivator.score}
                  colorScheme={getColorScheme(motivator.score)}
                  description={`${motivator.level} Intensity`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Learning Style */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-teal-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Learning Style</h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-700/30 rounded-lg print:bg-gray-50 print:border print:border-gray-300">
                <p className="text-xs text-slate-400 print:text-gray-700 uppercase font-semibold mb-2">Primary Style</p>
                <p className="text-lg font-bold text-white print:text-black">{output.learningStyle.primaryStyle}</p>
              </div>
              <div className="p-4 bg-slate-700/30 rounded-lg print:bg-gray-50 print:border print:border-gray-300">
                <p className="text-xs text-slate-400 print:text-gray-700 uppercase font-semibold mb-2">Secondary Style</p>
                <p className="text-lg font-bold text-white print:text-black">{output.learningStyle.secondaryStyle}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-white print:text-black mb-3">Recommended Strategies:</p>
              <ul className="space-y-2">
                {output.learningStyle.recommendations.map((strategy, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-cyan-400 print:text-blue-700">✓</span>
                    <span>{strategy}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Emotional & Social Awareness */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-violet-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Emotional Intelligence</h2>
            <div className="space-y-6">
              {output.emotionalAwareness.map((component) => (
                <ProgressBar
                  key={component.component}
                  label={component.component}
                  score={component.score}
                  colorScheme={getColorScheme(component.score)}
                  description={component.level}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Creativity & Future Readiness */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-indigo-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Creativity & Future Readiness</h2>
            <div className="space-y-6">
              {output.creativity.map((indicator) => (
                <ProgressBar
                  key={indicator.indicator}
                  label={indicator.indicator}
                  score={indicator.score}
                  colorScheme={getColorScheme(indicator.score)}
                  description={`Level: ${indicator.level}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Career Domain Alignment */}
        <section className="mb-8 print:page-break-inside-avoid">
          <div className="p-6 bg-yellow-900/30 rounded-xl border border-slate-700/50 print:bg-gray-100 print:border-gray-300">
            <h2 className="text-2xl font-bold text-white print:text-black mb-6">Career Domain Alignment</h2>
            <div className="space-y-6">
              {output.domainAffinities.map((domain, idx) => (
                <div key={domain.domain}>
                  <ProgressBar
                    label={`${idx + 1}. ${domain.domain}`}
                    score={domain.affinity}
                    colorScheme={getColorScheme(domain.affinity)}
                    description={domain.reasoning}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        <div className="mb-8 p-6 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-slate-700/50 print:bg-gray-50 print:border-gray-300 print:page-break-inside-avoid">
          <h2 className="text-2xl font-bold text-white print:text-black mb-4">Recommendations for Your Future</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-white print:text-black mb-2">Your Top Strengths:</h3>
              <ul className="space-y-1">
                {output.summary.topStrengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-slate-200 print:text-gray-800 flex gap-2">
                    <span className="text-emerald-400 print:text-green-700">★</span>
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
                    <span className="text-amber-400 print:text-orange-700">→</span>
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
                    <span className="text-cyan-400 print:text-blue-700">✓</span>
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
                    <span className="text-purple-400 print:text-purple-700 font-bold">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-700/50 print:border-t print:border-gray-400 text-center">
          <p className="text-xs text-slate-400 print:text-gray-700">
            OneGrasp Assessment System | Class 8 Career & Personal Development | {assessmentDate}
          </p>
        </div>
      </div>
    </div>
  );
}
