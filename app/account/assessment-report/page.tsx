'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Class1112FullReportNew from '@/app/report/Class1112FullReportNew';
import { generateClass1112Report } from '@/lib/report/generateClass1112Report';
import { scoreClass11Assessment } from '@/lib/newAssessment/scoring11_12';
import type { ReportData } from '@/lib/report/generateClass1112Report';

export default function AssessmentReportPage() {
  const searchParams = useSearchParams();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndGenerateReport = async () => {
      try {
        // Get assessment ID from URL params
        const assessmentId = searchParams.get('assessmentId');

        if (!assessmentId) {
          setError('No assessment ID provided');
          setLoading(false);
          return;
        }

        // Fetch assessment responses from database
        const response = await fetch(`/api/assessment/${assessmentId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch assessment data');
        }

        const assessmentData = await response.json();

        // Score the assessment
        const scoreOutput = scoreClass11Assessment(assessmentData.responses);

        // Generate report
        const report = generateClass1112Report(
          assessmentData.studentName,
          assessmentData.grade,
          scoreOutput
        );

        setReportData(report);
        setError(null);
      } catch (err) {
        console.error('Error generating report:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate report');
      } finally {
        setLoading(false);
      }
    };

    fetchAndGenerateReport();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Generating your career assessment report...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-4">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Error Generating Report</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <a
            href="/account/dashboard"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <p className="text-gray-600">No report data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Report Toolbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">Career Assessment Report</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                const element = document.documentElement;
                const opt = {
                  margin: 10,
                  filename: `Career-Assessment-${reportData.studentName}.pdf`,
                  image: { type: 'jpeg', quality: 0.98 },
                  html2canvas: { scale: 2 },
                  jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
                };
                // TODO: Implement html2pdf export
                alert('PDF export coming soon');
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition text-sm font-medium"
            >
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
            >
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <Class1112FullReportNew data={reportData} />

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 text-center text-gray-600 text-sm">
          <p className="mb-2">
            This report is confidential and customized for {reportData.studentName}
          </p>
          <p>
            For guidance on next steps, consult with your school counselor or career mentor.
          </p>
        </div>
      </div>
    </div>
  );
}
