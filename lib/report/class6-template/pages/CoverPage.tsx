import type { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';
import { ReportFooter } from '../components/DesignComponents';

interface CoverPageProps {
  studentName: string;
  studentEmail: string;
  studentAge: number;
  completedDate: Date;
}

export function CoverPage({ studentName, studentEmail, studentAge, completedDate }: CoverPageProps) {
  return (
    <div style={{
      width: '210mm',
      height: '297mm',
      padding: 0,
      margin: 0,
      background: 'white',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Geometric Background Elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '80mm',
        height: '140mm',
        background: 'linear-gradient(135deg, #1F3A52 0%, #2C5282 100%)',
        clipPath: 'polygon(0 0, 100% 0, 50% 100%, 0 80%)',
        opacity: 0.95
      }} />

      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '100mm',
        height: '120mm',
        background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 100%)',
        clipPath: 'polygon(100% 100%, 0 100%, 50% 0, 100% 50%)',
        opacity: 0.9
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '40mm 26pt',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top Section */}
        <div style={{ textAlign: 'right', marginBottom: '30mm' }}>
          <div style={{
            fontSize: '32pt',
            fontWeight: 700,
            color: '#E63946',
            letterSpacing: '2pt',
            marginBottom: '8pt'
          }}>
            One<span style={{ color: '#1F3A52' }}>Grasp</span>
          </div>
          <p style={{
            fontSize: '10pt',
            color: '#666',
            margin: 0,
            fontWeight: 500
          }}>
            Career Discovery Platform
          </p>
        </div>

        {/* Middle Section - Student Info */}
        <div style={{ marginBottom: '20mm' }}>
          <p style={{
            fontSize: '10pt',
            color: '#1F3A52',
            fontWeight: 600,
            margin: 0,
            marginBottom: '8pt'
          }}>
            Report Prepared For
          </p>
          <h1 style={{
            fontSize: '40pt',
            fontWeight: 700,
            color: '#1F3A52',
            margin: 0,
            marginBottom: '16pt',
            lineHeight: 1.1
          }}>
            {studentName}
          </h1>

          {/* Details */}
          <div style={{ marginTop: '16pt' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8pt',
              fontSize: '11pt',
              color: '#2C3E50'
            }}>
              <span style={{ marginRight: '12pt', fontSize: '16pt' }}>🎂</span>
              <span>{studentAge} Years Old</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8pt',
              fontSize: '11pt',
              color: '#2C3E50'
            }}>
              <span style={{ marginRight: '12pt', fontSize: '16pt' }}>✉️</span>
              <span>{studentEmail}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '11pt',
              color: '#2C3E50'
            }}>
              <span style={{ marginRight: '12pt', fontSize: '16pt' }}>📅</span>
              <span>{completedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{
          backgroundColor: '#1F3A52',
          color: 'white',
          padding: '16pt',
          borderRadius: '8pt',
          textAlign: 'center',
          marginBottom: '20pt'
        }}>
          <h2 style={{
            fontSize: '16pt',
            fontWeight: 700,
            color: 'white',
            margin: 0,
            marginBottom: '4pt'
          }}>
            Career Discovery Report
          </h2>
          <p style={{
            fontSize: '11pt',
            color: '#E5E7EB',
            margin: 0
          }}>
            Class 6 - Your Career Exploration Journey
          </p>
        </div>

        {/* Footer Text */}
        <div style={{
          fontSize: '9pt',
          color: '#666',
          textAlign: 'center',
          paddingTop: '12pt'
        }}>
          <p style={{ margin: 0, marginBottom: '4pt' }}>🔒 Confidential | Personal Career Assessment</p>
          <p style={{ margin: 0 }}>For educational purposes only</p>
        </div>
      </div>

      <ReportFooter pageNumber={1} totalPages={22} />
    </div>
  );
}
