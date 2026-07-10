/**
 * Icons — a small set of professional, stroke-based line icons (24×24,
 * currentColor) used across the app in place of emoji. Keyed by the eight
 * assessment categories plus a few generic report/flow icons.
 */
import type { ReactNode } from "react";

const P: Record<string, ReactNode> = {
  // categories
  personality: <><circle cx="12" cy="12" r="9" /><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5" /></>,
  career_interest: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></>,
  multiple_intelligence: <><circle cx="7" cy="8" r="2.2" /><circle cx="17" cy="7" r="2.2" /><circle cx="12" cy="17" r="2.2" /><path d="M8.8 9.2 10.6 15M15.6 8.4 13 15.4M8.9 7.4 15 7.2" /></>,
  emotional_intelligence: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 1 1 17 0z" />,
  learning_styles: <><path d="M2 4h6a3 3 0 0 1 3 3v13a2.5 2.5 0 0 0-2.5-2.5H2z" /><path d="M22 4h-6a3 3 0 0 0-3 3v13a2.5 2.5 0 0 1 2.5-2.5H22z" /></>,
  motivators: <polygon points="13 2 4 14 11 14 10 22 20 10 13 10 13 2" />,
  strengths: <><circle cx="12" cy="8" r="5.5" /><path d="M8.5 12.5 7 22l5-3 5 3-1.5-9.5" /></>,
  aptitude: <><rect x="3.5" y="3.5" width="7" height="7" rx="1" /><rect x="13.5" y="3.5" width="7" height="7" rx="1" /><rect x="3.5" y="13.5" width="7" height="7" rx="1" /><rect x="13.5" y="13.5" width="7" height="7" rx="1" /></>,
  // flow (how we evaluate)
  answer: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  score: <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="15" /></>,
  combine: <><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></>,
  match: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1" /></>,
  explain: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></>,
  // generic report
  radar: <><path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" opacity="0.5" /><circle cx="12" cy="12" r="9" /></>,
  clusters: <><rect x="3" y="3" width="8" height="8" rx="1.5" /><rect x="13" y="3" width="8" height="8" rx="1.5" /><rect x="3" y="13" width="8" height="8" rx="1.5" /><rect x="13" y="13" width="8" height="8" rx="1.5" /></>,
  check: <><path d="M20 6 9 17l-5-5" /></>,
  audio: <><path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4z" /><path d="M16 8.5a4.5 4.5 0 0 1 0 7" /><path d="M18.5 6a8 8 0 0 1 0 12" /></>,
  info: <><circle cx="12" cy="12" r="9" /><line x1="12" y1="11" x2="12" y2="16.5" /><line x1="12" y1="7.8" x2="12" y2="8" /></>,
  expand: <><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" /></>,
  // reference-matching category icons for the home hero grid
  user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><polygon points="15.5 8.5 13.5 13.5 8.5 15.5 10.5 10.5" /></>,
  bulb: <><path d="M9.5 17.5h5" /><path d="M10.5 21h3" /><path d="M12 3a6 6 0 0 0-3.7 10.7c.6.5.9 1 1 1.8h5.4c.1-.8.4-1.3 1-1.8A6 6 0 0 0 12 3z" /></>,
  heart: <path d="M12 20s-7-4.6-9.3-9A5 5 0 0 1 12 5.5 5 5 0 0 1 21.3 11c-2.3 4.4-9.3 9-9.3 9z" />,
  star: <polygon points="12 3.5 14.7 9 20.5 9.8 16.2 14 17.3 20 12 17.1 6.7 20 7.8 14 3.5 9.8 9.3 9" />,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 2.5v2M15 2.5v2M9 19.5v2M15 19.5v2M2.5 9h2M2.5 15h2M19.5 9h2M19.5 15h2" /></>,
  // exam controls
  flag: <><path d="M5 21V4" /><path d="M5 4h12l-2.5 4L17 12H5" /></>,
  chevronLeft: <polyline points="15 18 9 12 15 6" />,
  chevronRight: <polyline points="9 18 15 12 9 6" />,
  xcircle: <><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></>,
  play: <polygon points="7 4 20 12 7 20 7 4" />,
  power: <><path d="M12 4v8" /><path d="M7 6.3a8 8 0 1 0 10 0" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.2 9.3a2.8 2.8 0 0 1 5.4 1c0 1.8-2.6 2.5-2.6 2.5" /><path d="M12 17.2v.01" /></>,
};

export function Icon({ name, size = 22, stroke = 1.7, style }: { name: string; size?: number; stroke?: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden>
      {P[name] ?? P.match}
    </svg>
  );
}

export const CATEGORY_ABBR: Record<string, string> = {
  personality: "P", career_interest: "CI", multiple_intelligence: "MI",
  emotional_intelligence: "EI", learning_styles: "LS", motivators: "MO",
  strengths: "ST", aptitude: "AP",
};
