/* Reusable Design Components for Class 6 Report */

export function DimensionSlider({ label, percentage, leftLabel, rightLabel }: { label: string; percentage: number; leftLabel: string; rightLabel: string }) {
  const colors = ['#3498DB', '#FFD700', '#2DCC71', '#9B59B6'];
  const colorIndex = Math.floor(Math.random() * colors.length);
  const color = colors[colorIndex];

  return (
    <div style={{ marginBottom: '20pt', pageBreakInside: 'avoid' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8pt' }}>
        <span style={{ fontSize: '11pt', fontWeight: 600, color: color }}>{percentage}%</span>
        <span style={{ fontSize: '10pt', color: '#666' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: '8pt', alignItems: 'center' }}>
        <span style={{ fontSize: '9pt', color: '#666' }}>{leftLabel}</span>
        <div style={{
          flex: 1,
          height: '16pt',
          backgroundColor: '#E5E7EB',
          borderRadius: '8pt',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s'
          }} />
          <div style={{
            position: 'absolute',
            left: `${percentage}%`,
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '20pt',
            height: '20pt',
            backgroundColor: color,
            borderRadius: '50%',
            border: '2pt solid white',
            boxShadow: '0 2pt 4pt rgba(0,0,0,0.1)'
          }} />
        </div>
        <span style={{ fontSize: '9pt', color: '#666' }}>{rightLabel}</span>
      </div>
    </div>
  );
}

export function CircleChart({ percentage, label, color = '#2DCC71' }: { percentage: number; label: string; color?: string }) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ textAlign: 'center', marginBottom: '20pt' }}>
      <div style={{ position: 'relative', width: '120pt', height: '120pt', margin: '0 auto 12pt' }}>
        <svg width="120pt" height="120pt" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="60" cy="60" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24pt', fontWeight: 700, color: color }}>{percentage}%</div>
        </div>
      </div>
      <p style={{ fontSize: '11pt', fontWeight: 600, color: '#2C3E50', marginBottom: 0 }}>{label}</p>
    </div>
  );
}

export function SkillCard({ icon, title, percentage, description }: { icon: string; title: string; percentage: number; description: string }) {
  return (
    <div style={{
      backgroundColor: '#F5F7FA',
      padding: '16pt',
      borderRadius: '8pt',
      marginBottom: '12pt',
      pageBreakInside: 'avoid'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8pt' }}>
        <div>
          <h4 style={{ fontSize: '12pt', fontWeight: 600, color: '#1F3A52', margin: 0 }}>{title}</h4>
          <p style={{ fontSize: '10pt', color: '#666', margin: '4pt 0 0 0' }}>{description}</p>
        </div>
        <div style={{
          backgroundColor: '#2DCC71',
          color: 'white',
          width: '48pt',
          height: '48pt',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24pt',
          fontWeight: 700,
          flexShrink: 0
        }}>
          {percentage}%
        </div>
      </div>
    </div>
  );
}

export function CareerDomainCard({ rank, domain, percentage, description }: { rank: number; domain: string; percentage: number; description: string }) {
  const colors = ['#2DCC71', '#3498DB', '#E67E22', '#9B59B6', '#E63946'];

  return (
    <div style={{
      backgroundColor: colors[rank - 1] || '#2DCC71',
      color: 'white',
      padding: '20pt',
      borderRadius: '8pt',
      marginBottom: '16pt',
      pageBreakInside: 'avoid'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12pt' }}>
        <div>
          <p style={{ fontSize: '10pt', margin: 0, opacity: 0.9 }}>#{rank} Best Fit</p>
          <h3 style={{ fontSize: '16pt', fontWeight: 700, color: 'white', margin: '4pt 0' }}>{domain}</h3>
        </div>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.2)',
          padding: '8pt 12pt',
          borderRadius: '6pt',
          fontSize: '12pt',
          fontWeight: 600
        }}>
          {percentage}%
        </div>
      </div>
      <p style={{ fontSize: '11pt', color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, margin: 0 }}>{description}</p>
    </div>
  );
}

export function Timeline({ milestones }: { milestones: { year: string; title: string; description: string }[] }) {
  return (
    <div>
      {milestones.map((milestone, index) => (
        <div key={index} style={{
          display: 'flex',
          gap: '16pt',
          marginBottom: '20pt',
          pageBreakInside: 'avoid'
        }}>
          <div style={{
            minWidth: '60pt',
            paddingTop: '4pt'
          }}>
            <div style={{
              backgroundColor: '#FFD700',
              color: '#1F3A52',
              width: '48pt',
              padding: '8pt',
              borderRadius: '4pt',
              textAlign: 'center',
              fontWeight: 700,
              fontSize: '12pt'
            }}>
              {milestone.year}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '12pt', fontWeight: 700, color: '#1F3A52', margin: 0, marginBottom: '4pt' }}>
              {milestone.title}
            </h4>
            <p style={{ fontSize: '10pt', color: '#666', lineHeight: 1.5, margin: 0 }}>
              {milestone.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ReportHeader({ studentName, email, age }: { studentName: string; email: string; age?: number }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: '12pt',
      borderBottom: '1pt solid #E5E7EB',
      marginBottom: '16pt'
    }}>
      <div>
        <p style={{ fontSize: '12pt', fontWeight: 600, color: '#1F3A52', margin: 0 }}>{studentName}</p>
        {email && <p style={{ fontSize: '9pt', color: '#666', margin: '4pt 0 0 0' }}>{email}</p>}
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '14pt', fontWeight: 700, color: '#E63946', margin: 0 }}>OneGrasp</p>
        {age && <p style={{ fontSize: '10pt', color: '#666', margin: '4pt 0 0 0' }}>Age: {age}</p>}
      </div>
    </div>
  );
}

export function ReportFooter({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '12pt',
      left: '26pt',
      right: '26pt',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '9pt',
      color: '#94a3b8',
      paddingTop: '12pt',
      borderTop: '1pt solid #E5E7EB'
    }}>
      <div>📞 8977760443 | 📧 support@onegrasp.com</div>
      <div>Page {pageNumber} of {totalPages}</div>
    </div>
  );
}
