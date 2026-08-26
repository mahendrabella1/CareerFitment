/**
 * OneGrasp Design System Tokens
 * Production-grade SaaS color, typography, spacing, and component system
 * Inspired by mature SaaS products (Linear, Stripe, Notion, Vercel)
 */

// ============================================================================
// COLOR PALETTE - Unified, production-grade
// ============================================================================

// Neutral Ink (text and UI elements)
export const colors = {
  // Primary ink for text and UI
  ink: {
    100: "#ffffff", // white
    95: "#f9f9fa",  // almost white
    90: "#f3f3f5",  // very light grey
    80: "#ececef",  // light grey (borders)
    70: "#dcdce0",  // light medium grey
    60: "#c4c4cd",  // medium grey (subtle dividers)
    50: "#9a9aa6",  // medium (secondary text, disabled)
    40: "#63636f",  // darker grey (secondary text)
    30: "#3d3d45",  // dark grey (primary text, lighter variant)
    20: "#1f1f24",  // very dark (strong emphasis)
    10: "#0f0f13",  // near-black (strongest contrast)
  },

  // Accent - OneGrasp brand red (used strategically, not everywhere)
  accent: {
    100: "#fef0f0", // very light tint
    90: "#fde5e5",  // light tint
    80: "#f5d5d5",  // medium light
    60: "#e8a5a5",  // medium
    40: "#db3433",  // primary red (core brand)
    30: "#b82a2b",  // darker red (hover/active)
    20: "#8f1f1f",  // very dark red
  },

  // Semantic colors
  success: "#059669", // emerald
  warning: "#d97706", // amber
  error: "#dc2626",   // red
  info: "#0284c7",    // blue

  // Gradient helpers (for subtle backgrounds, not overused)
  gradients: {
    subtle: "linear-gradient(135deg, rgba(219, 52, 51, 0.04) 0%, rgba(5, 150, 105, 0.04) 100%)",
    hero: "linear-gradient(135deg, rgba(219, 52, 51, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)",
  },
};

// ============================================================================
// TYPOGRAPHY SCALE - Clear hierarchy, not excessive
// ============================================================================

export const typography = {
  // Font families
  family: {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  // Font scales - measured, not excessive
  scale: {
    // Hero/Display (used sparingly)
    display: {
      fontSize: "32px",
      lineHeight: "1.2",
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    // Page heading
    h1: {
      fontSize: "24px",
      lineHeight: "1.3",
      fontWeight: 700,
      letterSpacing: "-0.005em",
    },
    // Section heading
    h2: {
      fontSize: "20px",
      lineHeight: "1.4",
      fontWeight: 600,
      letterSpacing: "0",
    },
    // Card heading / subsection
    h3: {
      fontSize: "16px",
      lineHeight: "1.5",
      fontWeight: 600,
      letterSpacing: "0",
    },
    // Body text (primary)
    body: {
      fontSize: "14px",
      lineHeight: "1.5",
      fontWeight: 400,
      letterSpacing: "0",
    },
    // Body text (smaller)
    sm: {
      fontSize: "13px",
      lineHeight: "1.5",
      fontWeight: 400,
      letterSpacing: "0",
    },
    // Label / meta text
    label: {
      fontSize: "12px",
      lineHeight: "1.4",
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "uppercase" as const,
    },
    // Tiny text (rarely used)
    xs: {
      fontSize: "11px",
      lineHeight: "1.4",
      fontWeight: 400,
      letterSpacing: "0.01em",
    },
  },
};

// ============================================================================
// SPACING SYSTEM - Consistent, predictable
// ============================================================================

export const spacing = {
  0: "0",
  1: "4px",   // Extra tight
  2: "8px",   // Tight
  3: "12px",  // Compact
  4: "16px",  // Standard
  5: "20px",  // Comfortable
  6: "24px",  // Generous
  8: "32px",  // Large gap
  10: "40px", // Extra large
  12: "48px", // Hero scale
};

// ============================================================================
// BORDER RADIUS - Minimal, professional
// ============================================================================

export const radius = {
  none: "0",
  sm: "4px",    // Small elements (buttons, badges)
  md: "6px",    // Standard (cards, inputs)
  lg: "8px",    // Large containers
  xl: "12px",   // Extra large
  full: "9999px", // Circles/pills
};

// ============================================================================
// SHADOWS - Subtle, not dramatic
// ============================================================================

export const shadows = {
  // Minimal elevation
  none: "none",
  sm: "0 1px 2px rgba(15, 15, 19, 0.05)",
  md: "0 2px 4px rgba(15, 15, 19, 0.08), 0 1px 2px rgba(15, 15, 19, 0.04)",
  lg: "0 4px 8px rgba(15, 15, 19, 0.10), 0 2px 4px rgba(15, 15, 19, 0.06)",
  xl: "0 8px 16px rgba(15, 15, 19, 0.12), 0 4px 8px rgba(15, 15, 19, 0.08)",
  // Hovering state (slight lift)
  hover: "0 2px 8px rgba(219, 52, 51, 0.12)",
};

// ============================================================================
// LAYOUT & CONTAINER SIZES
// ============================================================================

export const layout = {
  maxWidth: "1440px",        // Max content width
  sidebarWidth: "260px",     // Left sidebar (when present)
  rightRailWidth: "280px",   // Right sidebar (when present)
  gapDefault: "24px",        // Between major sections
  gapCard: "16px",           // Between cards in a grid
  paddingHero: "40px",       // Hero section padding
  paddingSection: "24px",    // Section padding
  paddingCard: "20px",       // Card padding
};

// ============================================================================
// Z-INDEX SYSTEM - Clear stacking
// ============================================================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  modal: 300,
  tooltip: 400,
  notification: 500,
};

// ============================================================================
// TRANSITIONS - Purposeful, not flashy
// ============================================================================

export const transitions = {
  fast: "150ms ease-out",
  base: "200ms ease-out",
  slow: "300ms ease-out",
  slowBezier: "cubic-bezier(0.4, 0, 0.2, 1)",
};

// ============================================================================
// BREAKPOINTS - Mobile-first responsive design
// ============================================================================

export const breakpoints = {
  mobile: "0",       // Mobile-first base
  tablet: "768px",   // Tablets and up
  desktop: "1024px", // Desktop and up
  wide: "1440px",    // Wide desktop and up
  ultraWide: "1920px", // Ultra-wide monitors
};

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  // Button sizes and padding
  button: {
    sm: { padding: "6px 12px", fontSize: "12px" },
    md: { padding: "8px 16px", fontSize: "14px" },
    lg: { padding: "12px 20px", fontSize: "14px" },
  },

  // Input heights
  input: {
    sm: { height: "28px", fontSize: "12px" },
    md: { height: "36px", fontSize: "14px" },
    lg: { height: "44px", fontSize: "14px" },
  },

  // Card dimensions
  card: {
    padding: "20px",
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.lg,
    background: colors.ink[100],
  },

  // Stat box (KPI tile)
  stat: {
    padding: "16px",
    border: `1px solid ${colors.ink[80]}`,
    borderRadius: radius.md,
    background: colors.ink[100],
  },

  // Badge/pill
  badge: {
    padding: "4px 8px",
    fontSize: "11px",
    fontWeight: 600,
    borderRadius: radius.full,
  },
};

// ============================================================================
// CSS VARIABLE EXPORT for use in stylesheets
// ============================================================================

export const getCSSVariables = () => `
:root {
  /* Colors */
  --ink-100: ${colors.ink[100]};
  --ink-95: ${colors.ink[95]};
  --ink-90: ${colors.ink[90]};
  --ink-80: ${colors.ink[80]};
  --ink-70: ${colors.ink[70]};
  --ink-60: ${colors.ink[60]};
  --ink-50: ${colors.ink[50]};
  --ink-40: ${colors.ink[40]};
  --ink-30: ${colors.ink[30]};
  --ink-20: ${colors.ink[20]};
  --ink-10: ${colors.ink[10]};

  --accent-100: ${colors.accent[100]};
  --accent-80: ${colors.accent[80]};
  --accent-60: ${colors.accent[60]};
  --accent-40: ${colors.accent[40]};
  --accent-30: ${colors.accent[30]};

  --success: ${colors.success};
  --warning: ${colors.warning};
  --error: ${colors.error};
  --info: ${colors.info};

  /* Spacing */
  --space-1: ${spacing[1]};
  --space-2: ${spacing[2]};
  --space-3: ${spacing[3]};
  --space-4: ${spacing[4]};
  --space-5: ${spacing[5]};
  --space-6: ${spacing[6]};
  --space-8: ${spacing[8]};
  --space-10: ${spacing[10]};
  --space-12: ${spacing[12]};

  /* Typography */
  --font-sans: ${typography.family.sans};
  --font-mono: ${typography.family.mono};

  /* Border Radius */
  --radius-sm: ${radius.sm};
  --radius-md: ${radius.md};
  --radius-lg: ${radius.lg};
  --radius-xl: ${radius.xl};

  /* Shadows */
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
  --shadow-xl: ${shadows.xl};
  --shadow-hover: ${shadows.hover};

  /* Transitions */
  --transition-fast: ${transitions.fast};
  --transition-base: ${transitions.base};
  --transition-slow: ${transitions.slow};
}
`;
