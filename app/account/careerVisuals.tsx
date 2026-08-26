/**
 * Career-specific visuals for reports
 * Uses real images from Unsplash/Pexels with SVG fallback
 */

import { getImageForRole } from './careerRoleImages';

/**
 * Image component with SVG fallback for career visuals
 * Shows real photo, falls back to SVG if image fails to load
 */
export const CareerImageWithSVG = ({
  careerTitle,
  svgComponent
}: {
  careerTitle: string;
  svgComponent: React.ReactNode;
}) => {
  const imageUrl = getImageForRole(careerTitle);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <img
        src={imageUrl}
        alt={careerTitle}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '6px',
          display: 'block',
        }}
        onError={(e) => {
          // Fallback to SVG if image fails
          const parent = (e.target as HTMLElement).parentElement;
          if (parent) {
            parent.style.display = 'none';
            const svgParent = parent.nextElementSibling as HTMLElement;
            if (svgParent) svgParent.style.display = 'flex';
          }
        }}
      />
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {svgComponent}
      </div>
    </div>
  );
};

export const CareerVisuals = {
  // Healthcare & Medicine
  healthcare: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      {/* Stethoscope */}
      <circle cx="100" cy="60" r="15" fill="url(#healthGradient)" />
      <path d="M 85 75 Q 85 95 75 105" stroke="url(#healthGradient)" strokeWidth="8" fill="none" />
      <path d="M 115 75 Q 115 95 125 105" stroke="url(#healthGradient)" strokeWidth="8" fill="none" />
      {/* Medical cross */}
      <rect x="95" y="120" width="10" height="40" fill="url(#healthGradient)" />
      <rect x="80" y="135" width="40" height="10" fill="url(#healthGradient)" />
      {/* Pulse line */}
      <polyline points="50,150 60,150 65,140 70,160 75,150 95,150" stroke="url(#healthGradient)" strokeWidth="2" fill="none" />
    </svg>
  ),

  // Technology & Engineering
  technology: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="techGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2196F3" />
          <stop offset="100%" stopColor="#0D47A1" />
        </linearGradient>
      </defs>
      {/* Laptop */}
      <rect x="50" y="50" width="100" height="70" rx="4" fill="none" stroke="url(#techGradient)" strokeWidth="4" />
      <rect x="55" y="55" width="90" height="60" fill="#E3F2FD" />
      <line x1="50" y1="125" x2="150" y2="125" stroke="url(#techGradient)" strokeWidth="3" />
      <path d="M 75 135 L 125 135" stroke="url(#techGradient)" strokeWidth="2" />
      {/* Code brackets */}
      <path d="M 70 70 L 65 75 L 70 80" stroke="url(#techGradient)" strokeWidth="2" fill="none" />
      <path d="M 130 70 L 135 75 L 130 80" stroke="url(#techGradient)" strokeWidth="2" fill="none" />
    </svg>
  ),

  // Business & Finance
  business: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="businessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9800" />
          <stop offset="100%" stopColor="#E65100" />
        </linearGradient>
      </defs>
      {/* Bar chart */}
      <rect x="50" y="100" width="15" height="50" fill="url(#businessGradient)" />
      <rect x="75" y="80" width="15" height="70" fill="url(#businessGradient)" opacity="0.7" />
      <rect x="100" y="60" width="15" height="90" fill="url(#businessGradient)" opacity="0.5" />
      <rect x="125" y="85" width="15" height="65" fill="url(#businessGradient)" opacity="0.7" />
      {/* Uptrend arrow */}
      <path d="M 60 110 L 130 50" stroke="url(#businessGradient)" strokeWidth="3" fill="none" />
      <path d="M 120 50 L 130 50 L 130 60" stroke="url(#businessGradient)" strokeWidth="3" fill="none" />
    </svg>
  ),

  // Creative & Arts
  creative: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="creativeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E91E63" />
          <stop offset="100%" stopColor="#AD1457" />
        </linearGradient>
      </defs>
      {/* Palette */}
      <circle cx="100" cy="100" r="50" fill="none" stroke="url(#creativeGradient)" strokeWidth="3" />
      {/* Paint dots */}
      <circle cx="75" cy="75" r="6" fill="#FF6B6B" />
      <circle cx="125" cy="75" r="6" fill="#4ECDC4" />
      <circle cx="75" cy="125" r="6" fill="#FFE66D" />
      <circle cx="125" cy="125" r="6" fill="#A8E6CF" />
      <circle cx="100" cy="100" r="5" fill="#DDA0DD" />
      {/* Brush */}
      <rect x="140" y="80" width="8" height="40" rx="4" fill="url(#creativeGradient)" />
      <ellipse cx="144" cy="122" rx="7" ry="5" fill="url(#creativeGradient)" />
    </svg>
  ),

  // Education & Teaching
  education: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="educationGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#673AB7" />
          <stop offset="100%" stopColor="#512DA8" />
        </linearGradient>
      </defs>
      {/* Mortarboard */}
      <path d="M 60 90 L 100 50 L 140 90 Z" fill="url(#educationGradient)" />
      <line x1="100" y1="50" x2="100" y2="120" stroke="url(#educationGradient)" strokeWidth="3" />
      {/* Book */}
      <rect x="65" y="100" width="70" height="50" rx="3" fill="none" stroke="url(#educationGradient)" strokeWidth="2" />
      <line x1="100" y1="100" x2="100" y2="150" stroke="url(#educationGradient)" strokeWidth="2" />
      <line x1="75" y1="115" x2="125" y2="115" stroke="url(#educationGradient)" strokeWidth="1" />
      <line x1="75" y1="130" x2="125" y2="130" stroke="url(#educationGradient)" strokeWidth="1" />
    </svg>
  ),

  // Science & Research
  science: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#009688" />
          <stop offset="100%" stopColor="#00695C" />
        </linearGradient>
      </defs>
      {/* Microscope */}
      <circle cx="100" cy="70" r="15" fill="none" stroke="url(#scienceGradient)" strokeWidth="3" />
      <rect x="95" y="85" width="10" height="30" fill="url(#scienceGradient)" />
      <ellipse cx="100" cy="120" rx="25" ry="8" fill="url(#scienceGradient)" opacity="0.3" />
      <circle cx="100" cy="120" r="25" fill="none" stroke="url(#scienceGradient)" strokeWidth="2" />
      {/* Molecule */}
      <circle cx="145" cy="60" r="4" fill="url(#scienceGradient)" />
      <circle cx="160" cy="70" r="4" fill="url(#scienceGradient)" />
      <circle cx="155" cy="85" r="4" fill="url(#scienceGradient)" />
      <line x1="145" y1="60" x2="160" y2="70" stroke="url(#scienceGradient)" strokeWidth="2" />
      <line x1="160" y1="70" x2="155" y2="85" stroke="url(#scienceGradient)" strokeWidth="2" />
    </svg>
  ),

  // Social Services & Counseling
  social: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="socialGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F44336" />
          <stop offset="100%" stopColor="#C62828" />
        </linearGradient>
      </defs>
      {/* People circle */}
      <circle cx="100" cy="80" r="20" fill="url(#socialGradient)" />
      <circle cx="70" cy="120" r="15" fill="url(#socialGradient)" opacity="0.7" />
      <circle cx="130" cy="120" r="15" fill="url(#socialGradient)" opacity="0.7" />
      {/* Heart */}
      <path d="M 100 155 L 115 145 Q 120 140 120 135 Q 120 128 115 128 Q 110 128 100 135 Q 90 128 85 128 Q 80 128 80 135 Q 80 140 85 145 Z"
            fill="url(#socialGradient)" opacity="0.8" />
    </svg>
  ),

  // Engineering & Construction
  engineering: () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
      <defs>
        <linearGradient id="engineeringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#795548" />
          <stop offset="100%" stopColor="#4E342E" />
        </linearGradient>
      </defs>
      {/* Blueprint grid */}
      <rect x="50" y="50" width="100" height="100" fill="none" stroke="url(#engineeringGradient)" strokeWidth="2" />
      <line x1="75" y1="50" x2="75" y2="150" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="100" y1="50" x2="100" y2="150" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="125" y1="50" x2="125" y2="150" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="75" x2="150" y2="75" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="100" x2="150" y2="100" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
      <line x1="50" y1="125" x2="150" y2="125" stroke="url(#engineeringGradient)" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
};

export const getCareerVisual = (careerTitle: string) => {
  const title = careerTitle?.toLowerCase() || '';

  if (title.includes('doctor') || title.includes('nurse') || title.includes('medical') || title.includes('pharmacist') || title.includes('therapist')) {
    return CareerVisuals.healthcare;
  } else if (title.includes('software') || title.includes('developer') || title.includes('engineer') || title.includes('programmer') || title.includes('analyst')) {
    return CareerVisuals.technology;
  } else if (title.includes('manager') || title.includes('accountant') || title.includes('analyst') || title.includes('business')) {
    return CareerVisuals.business;
  } else if (title.includes('designer') || title.includes('artist') || title.includes('creative')) {
    return CareerVisuals.creative;
  } else if (title.includes('teacher') || title.includes('professor') || title.includes('educator')) {
    return CareerVisuals.education;
  } else if (title.includes('scientist') || title.includes('researcher')) {
    return CareerVisuals.science;
  } else if (title.includes('counselor') || title.includes('social') || title.includes('psychologist')) {
    return CareerVisuals.social;
  } else if (title.includes('civil') || title.includes('mechanical') || title.includes('electrical') || title.includes('architect')) {
    return CareerVisuals.engineering;
  }

  return CareerVisuals.technology; // Default
};

export const CareerCard = ({ title, subtitle, visual }: { title: string; subtitle?: string; visual?: () => JSX.Element }) => {
  const Visual = visual || getCareerVisual(title);

  return (
    <div style={{
      padding: '24px',
      borderRadius: '12px',
      background: '#F5F5F5',
      textAlign: 'center',
      marginBottom: '16px'
    }}>
      <div style={{ height: '120px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Visual />
      </div>
      <h3 style={{ margin: '8px 0 4px', fontSize: '16px', fontWeight: '700', color: '#111827' }}>
        {title}
      </h3>
      {subtitle && <p style={{ margin: '0', fontSize: '12px', color: '#6B7280' }}>{subtitle}</p>}
    </div>
  );
};
