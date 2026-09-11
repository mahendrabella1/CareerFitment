'use client';

import { useState } from 'react';
import { scoreClass6Assessment, type Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';

export default function TestClass6ReportPage() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  // Mock assessment responses for testing
  const getMockResponses = () => ({
    0: '2', 1: '3', 2: '4', 3: '2', 4: '3',
    5: '2', 6: '4', 7: '3', 8: '2', 9: '4',
    10: '3', 11: '2', 12: '4', 13: '3', 14: '2',
    15: '4', 16: '3', 17: '2', 18: '3', 19: '4',
    20: '2', 21: '3', 22: '4', 23: '2', 24: '3',
    25: '4', 26: '2', 27: '3', 28: '4', 29: '2'
  });

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setError('Please enter student name');
      return;
    }

    if (!studentEmail.trim()) {
      setError('Please enter email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1: Score the mock assessment
      console.log('📊 Scoring assessment...');
      const mockResponses = getMockResponses();
      const scoreOutput = scoreClass6Assessment({
        studentName,
        responses: mockResponses
      });

      console.log('✅ Assessment scored');

      // Step 2: Generate PDF
      console.log('📄 Generating PDF report...');
      const response = await fetch('/api/generate-class6-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName,
          studentEmail,
          studentAge: 12,
          completedDate: new Date().toISOString(),
          output: scoreOutput
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `PDF generation failed: ${response.statusText}`);
      }

      // Step 3: Get PDF as blob and create download link
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setPdfGenerated(true);

      console.log('✅ PDF generated successfully!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('❌ Error:', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F3A52 0%, #2C5282 100%)',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#1F3A52',
            margin: '0 0 8px 0'
          }}>
            🎓 Class 6 Report Generator
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0
          }}>
            Test the 22-page LaTeX PDF report
          </p>
        </div>

        {!pdfGenerated ? (
          <form onSubmit={handleGenerateReport}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F3A52',
                marginBottom: '8px'
              }}>
                Student Name *
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g., John Doe"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F3A52',
                marginBottom: '8px'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="e.g., john@example.com"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '14px',
                  border: '2px solid #E5E7EB',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {error && (
              <div style={{
                padding: '12px',
                backgroundColor: '#FFEBEE',
                borderLeft: '4px solid #FF6B6B',
                borderRadius: '4px',
                marginBottom: '24px',
                color: '#C33',
                fontSize: '14px'
              }}>
                ❌ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                color: 'white',
                background: loading ? '#999' : '#1F3A52',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {loading ? '⏳ Generating Report (1-2 min)...' : '📄 Generate 22-Page Report'}
            </button>

            <p style={{
              fontSize: '12px',
              color: '#666',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              ℹ️ This will create a complete Class 6 career report with mock assessment data
            </p>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              padding: '20px',
              background: '#E8F5E9',
              borderRadius: '8px',
              marginBottom: '24px',
              borderLeft: '4px solid #2DCC71'
            }}>
              <p style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#1B5E20',
                margin: '0 0 8px 0'
              }}>
                ✅ Report Generated Successfully!
              </p>
              <p style={{
                fontSize: '14px',
                color: '#2E7D32',
                margin: 0
              }}>
                A 22-page professional PDF report for {studentName}
              </p>
            </div>

            <a
              href={pdfUrl}
              download={`${studentName.replace(/\s+/g, '_')}_Class6_Report.pdf`}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                background: '#2DCC71',
                color: 'white',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 600,
                marginBottom: '16px',
                fontSize: '16px'
              }}
            >
              📥 Download PDF Report
            </a>

            <div style={{
              padding: '16px',
              background: '#F5F7FA',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F3A52',
                margin: '0 0 12px 0'
              }}>
                📊 Report Contents:
              </h3>
              <ul style={{
                fontSize: '13px',
                color: '#666',
                margin: 0,
                paddingLeft: '20px',
                lineHeight: 1.8
              }}>
                <li>✓ Personality Profile & Strengths (8 pages)</li>
                <li>✓ Career Interests & Learning Style (4 pages)</li>
                <li>✓ Top 5 Career Domains (5 pages)</li>
                <li>✓ Career Deep-Dives with Salary Info (3 pages)</li>
                <li>✓ 15-Year Career Roadmap (1 page)</li>
                <li>✓ Action Plan & Recommendations (2 pages)</li>
              </ul>
            </div>

            <button
              onClick={() => {
                setPdfGenerated(false);
                setStudentName('');
                setStudentEmail('');
                setPdfUrl('');
              }}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1F3A52',
                background: '#E5E7EB',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Generate Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
