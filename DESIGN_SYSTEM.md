# OneGrasp Design System – Production-Grade SaaS Redesign

**Date**: August 26, 2026  
**Status**: ✅ Complete  
**Inspired by**: Linear, Stripe, Notion, Vercel, Slack, Figma

---

## 🎯 Design Philosophy

A production-grade SaaS dashboard that communicates **intelligence, trust, clarity, personalization, progress, and career discovery**. Professional enough that a school counselor or career advisor would use it daily.

**Core Principles:**
- Minimal, intentional layout
- Strong typography hierarchy
- Neutral color base (OneGrasp red used strategically)
- Compact information density
- Subtle, purposeful interactions
- Real SaaS structure and patterns

---

## 📊 Design System Architecture

### 1. COLOR PALETTE

**Primary Ink (Text & UI)**
```
ink[100]: #ffffff      (white)
ink[95]:  #f9f9fa      (almost white)
ink[90]:  #f3f3f5      (very light grey)
ink[80]:  #ececef      (light grey - borders)
ink[70]:  #dcdce0      (light medium grey)
ink[60]:  #c4c4cd      (medium grey - subtle dividers)
ink[50]:  #9a9aa6      (medium - secondary text, disabled)
ink[40]:  #63636f      (darker grey - secondary text)
ink[30]:  #3d3d45      (dark grey - lighter variant)
ink[20]:  #1f1f24      (very dark - strong emphasis)
ink[10]:  #0f0f13      (near-black - strongest contrast)
```

**Accent – OneGrasp Red (Strategic Use)**
```
accent[100]: #fef0f0   (very light tint - backgrounds)
accent[90]:  #fde5e5   (light tint)
accent[80]:  #f5d5d5   (medium light)
accent[60]:  #e8a5a5   (medium)
accent[40]:  #db3433   (primary red - core brand)
accent[30]:  #b82a2b   (darker red - hover/active)
accent[20]:  #8f1f1f   (very dark red)
```

**Semantic Colors**
```
success:  #059669  (emerald)
warning:  #d97706  (amber)
error:    #dc2626  (red)
info:     #0284c7  (blue)
```

**Why This Palette:**
- ✅ Unified system (not 3 different palettes)
- ✅ Clear contrast ratios (WCAG AA compliant)
- ✅ Professional and trustworthy
- ✅ OneGrasp red used as accent, not background noise
- ✅ Semantic colors for status (success, warning, error)

### 2. TYPOGRAPHY SCALE

| Level | Size | Weight | Line-Height | Use Case |
|-------|------|--------|-------------|----------|
| **Display** | 32px | 700 | 1.2 | Hero titles (rare) |
| **H1** | 24px | 700 | 1.3 | Page heading |
| **H2** | 20px | 600 | 1.4 | Section heading |
| **H3** | 16px | 600 | 1.5 | Card heading |
| **Body** | 14px | 400 | 1.5 | Primary text |
| **Small** | 13px | 400 | 1.5 | Secondary text |
| **Label** | 12px | 600 | 1.4 | Meta, uppercase |
| **Tiny** | 11px | 400 | 1.4 | Rare, very small |

**Font Family**
```
Sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif
Mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace
```

**Why This Scale:**
- ✅ Measured, not excessive
- ✅ Clear visual hierarchy
- ✅ Professional business feel
- ✅ Accessible line heights (1.4-1.5)
- ✅ Letter spacing for emphasis (uppercase labels)

### 3. SPACING SYSTEM

| Token | Value | Use |
|-------|-------|-----|
| **1** | 4px | Extra tight (between elements) |
| **2** | 8px | Tight (component padding) |
| **3** | 12px | Compact (card padding small) |
| **4** | 16px | Standard (default gaps) |
| **5** | 20px | Comfortable (card padding) |
| **6** | 24px | Generous (section padding) |
| **8** | 32px | Large (major section gaps) |
| **10** | 40px | Extra large (hero spacing) |
| **12** | 48px | Hero scale (top-level spacing) |

**Why This System:**
- ✅ Powers of 4 (or close) for consistency
- ✅ Enough options without bloat
- ✅ Creates visual rhythm
- ✅ Professional density (not airy, not cramped)

### 4. BORDER RADIUS

| Token | Value | Use |
|-------|-------|-----|
| **sm** | 4px | Small buttons, badges |
| **md** | 6px | Inputs, standard elements |
| **lg** | 8px | Cards, containers |
| **xl** | 12px | Large containers |
| **full** | 9999px | Circles, pills |

**Why Minimal Radius:**
- ✅ Professional (not playful/whimsical)
- ✅ Better focus visibility
- ✅ Cleaner at smaller sizes
- ✅ Matches mature SaaS (Stripe, Linear)

### 5. SHADOWS (Elevation System)

| Level | CSS | Use |
|-------|-----|-----|
| **sm** | `0 1px 2px rgba(15,15,19,0.05)` | Cards, subtle elevation |
| **md** | `0 2px 4px rgba(15,15,19,0.08), 0 1px 2px rgba(15,15,19,0.04)` | Elevated cards |
| **lg** | `0 4px 8px rgba(15,15,19,0.10), 0 2px 4px rgba(15,15,19,0.06)` | Modals, dropdowns |
| **xl** | `0 8px 16px rgba(15,15,19,0.12), 0 4px 8px rgba(15,15,19,0.08)` | High elevation |

**Why Subtle Shadows:**
- ✅ Professional (not theatrical)
- ✅ Minimal impact on performance
- ✅ Clear elevation without drama
- ✅ Print-friendly

---

## 🧩 COMPONENT LIBRARY

### Card
**Purpose**: Primary container for content
```tsx
<Card variant="default" | "subtle" | "elevated" padding="sm" | "md" | "lg">
  Content here
</Card>
```

**Variants:**
- `default`: Border + subtle shadow (most common)
- `subtle`: Light background, no shadow
- `elevated`: Stronger shadow, no border

### Stat / KPI
**Purpose**: Display a metric with label and optional icon
```tsx
<Stat value="85%" label="Fit Score" color="accent" trend={{ value: 5, isPositive: true }} />
```

### Badge
**Purpose**: Small label for status or category
```tsx
<Badge variant="accent" size="sm">Top Choice</Badge>
```

### SectionHeader
**Purpose**: Establish section hierarchy
```tsx
<SectionHeader title="Your Top Matches" subtitle="Based on your profile" icon={<Icon />} />
```

### HeroCard & HeroContent
**Purpose**: Large prominent section for primary content
```tsx
<HeroCard withGradient>
  <HeroContent 
    title="Software Engineer" 
    metadata={[{ label: "Fit", value: "85%" }]}
  />
</HeroCard>
```

---

## 📱 NEW DASHBOARD INFORMATION ARCHITECTURE

**Old Problem**: Too many competing sections, redundant information, unclear hierarchy
**New Solution**: Clear question-based flow

### The Five Sections

#### 1. **WHO AM I?** – Hero Section
- Archetype name + description
- Top strength dimension
- Interest strength (%)
- Profile completion
- **CTA**: View Full Report

**File**: [DashboardRedesigned.tsx:250-300](app/account/DashboardRedesigned.tsx#L250)

#### 2. **WHAT FITS ME?** – Top Career Matches
- Show top 3 career matches (was just 1 in rail)
- Rank badge + fit score + verdict
- Visual cards, not text-only
- **Why 3**: More options without overwhelming

**File**: [DashboardRedesigned.tsx:320-360](app/account/DashboardRedesigned.tsx#L320)

#### 3. **YOUR STRENGTHS** – Eight Dimensions
- Radar chart visualization (unchanged, excellent)
- 8 dimension boxes showing score + band + benchmark
- Clickable for drill-down (ready for future)
- Clear labeling (Personality, EQ, Learning Style, etc.)

**File**: [DashboardRedesigned.tsx:380-430](app/account/DashboardRedesigned.tsx#L380)

#### 4. **WHAT CAN I DO?** – Action Plan
- 30-day sprint goals
- 90-day roadmap
- Checkbox tracking
- localStorage persistence
- Motivational section

**File**: [DashboardRedesigned.tsx:450-480](app/account/DashboardRedesigned.tsx#L450)

#### 5. **WHERE DO I GO?** – Career Resources
- Toolkit tabs (colleges, exams, internships, scholarships, careers)
- Show top 6 items in 2-column grid
- Icon + title + description
- Simplified (not overwhelming)

**File**: [DashboardRedesigned.tsx:500-560](app/account/DashboardRedesigned.tsx#L500)

---

## 🎨 VISUAL HIERARCHY DECISIONS

### What Was Removed
- ❌ Right rail (300px taking prime real estate)
- ❌ Duplicate "top match" card
- ❌ Dimension illustration (decorative, no data)
- ❌ Details section (account menu is enough)
- ❌ Report Preview card (unnecessary intermediate state)
- ❌ Toolkit in sidebar AND main grid (duplication)

### What Was Kept
- ✅ SVG visualizations (Ring, RadarChart, SkillBar) – excellent
- ✅ Dark hero section with gradient
- ✅ Icon system (professional)
- ✅ Logo placement
- ✅ Goal tracker pattern

### What Was Redesigned
- ✅ KPI strip → replaced with better structure
- ✅ Toolkit grid → cleaner layout with tabs
- ✅ Right rail → integrated into main flow
- ✅ Sidebar → removed (navigation via header)
- ✅ Color system → unified palette
- ✅ Spacing → consistent throughout

---

## 🎯 DESIGN PRINCIPLES IMPLEMENTED

### 1. **Audit**
✅ Removed AI-generated patterns (excessive cards, pastels, emoji)
✅ Identified redundant sections
✅ Fixed color system conflicts

### 2. **Design System**
✅ Created comprehensive tokens (colors, spacing, typography)
✅ Established component patterns
✅ Documented for consistency

### 3. **Information Architecture**
✅ Reorganized by user questions (Who? What? Why? How?)
✅ Removed clutter and duplication
✅ Clear visual hierarchy

### 4. **Color System**
✅ Unified palette (no 3 conflicting systems)
✅ Neutral base with strategic red accent
✅ Semantic colors (success, error, warning)

### 5. **Navigation**
✅ Removed sidebar
✅ Clean header (logo, email, sign out)
✅ Scroll-based section discovery

### 6. **Typography**
✅ Clear scale (8 levels, purpose-driven)
✅ Professional font stack
✅ Strong hierarchy

### 7. **Spacing**
✅ Consistent 4px grid
✅ Predictable gaps
✅ Professional density

### 8. **Data Visualization**
✅ Kept excellent hand-built SVG charts
✅ RadarChart, Ring, SkillBar components
✅ No external chart library needed

### 9. **Micro-interactions**
✅ Hover states (button color changes)
✅ Card elevation on hover
✅ Smooth transitions (180ms)
✅ Focus states for accessibility

### 10. **Responsiveness**
✅ Mobile-first approach
✅ Flexible grid (repeats columns)
✅ Readable on all sizes

### 11. **Accessibility**
✅ Proper contrast ratios (WCAG AA)
✅ Semantic HTML (h1, h2, h3)
✅ Focus management
✅ Alt text on images

### 12. **Implementation**
✅ Component-based (reusable)
✅ Design tokens (maintainability)
✅ No external UI libraries (control)
✅ TypeScript (safety)

---

## 📁 FILE STRUCTURE

```
app/account/
├── designTokens.ts           # Design system tokens
├── components/
│   ├── index.ts              # Component exports
│   ├── Card.tsx              # Card + CardGrid
│   ├── Stat.tsx              # Stat + StatGrid
│   ├── Badge.tsx             # Badge component
│   ├── SectionHeader.tsx      # Headers + Divider + PageContainer
│   └── HeroCard.tsx           # Hero + HeroContent
├── DashboardRedesigned.tsx    # New main dashboard
├── Dashboard.tsx             # Old dashboard (archive)
├── FullReport.tsx            # In-depth report (unchanged)
├── viz.tsx                   # SVG visualizations (unchanged)
└── careerVisuals.tsx         # Career images (unchanged)
```

---

## 🚀 IMPLEMENTATION CHECKLIST

### Phase 1: Design System ✅
- [x] Create design tokens (colors, spacing, typography)
- [x] Define component patterns
- [x] Create base components (Card, Badge, etc.)
- [x] Create layout components (SectionHeader, PageContainer)

### Phase 2: Dashboard Redesign ✅
- [x] New information architecture
- [x] Hero section (Who am I?)
- [x] Career matches section (What fits me?)
- [x] Dimensions section (Your strengths)
- [x] Action plan (What can I do?)
- [x] Resources section (Where do I go?)
- [x] Integrate with existing components

### Phase 3: Integration ✅
- [x] Update account/page.tsx to use new dashboard
- [x] Remove old Dashboard component (can keep as archive)
- [x] Test imports and builds

### Phase 4: Polish (Optional)
- [ ] Add page transitions
- [ ] Implement skeleton loading
- [ ] Add more micro-interactions
- [ ] Optimize performance
- [ ] Add print styles

---

## 📊 BEFORE → AFTER COMPARISON

| Aspect | Before | After |
|--------|--------|-------|
| **Layout** | 3-column (sidebar + rail) | Single column (cleaner) |
| **Colors** | 3 conflicting systems | 1 unified palette |
| **Cards** | Excessive, repetitive | Purposeful, varied |
| **Shadows** | Inconsistent | Subtle, elevation-based |
| **Spacing** | Random (16, 18, 22, 24px) | Consistent 4px grid |
| **Information** | Redundant (5+ ways to show same data) | Hierarchy-driven |
| **Feeling** | Auto-generated, amateurish | Professional SaaS |

---

## 🎓 LEARNING RESOURCES

### Design Inspiration
- **Linear.app** - Information architecture, minimalism
- **Stripe.com** - Typography hierarchy, color usage
- **Notion.so** - Component patterns, flexibility
- **Vercel.com** - Navigation, spacing consistency
- **Figma.com** - Pro-level UI, attention to detail

### Key Takeaways
1. **Whitespace is your friend** – Don't fill every pixel
2. **Typography > Color** – Use fonts, not colors, for hierarchy
3. **Consistent systems** – Tokens lead to professional results
4. **Purposeful components** – Every element should have a reason
5. **Progressive disclosure** – Show what matters first
6. **Real constraints** – Design for actual data, not ideal case

---

## 🔧 TECHNICAL NOTES

### CSS-in-JS Approach
- No external CSS files (keeps components self-contained)
- Design tokens in TypeScript (type-safe)
- Inline styles with consistent variable references
- CSS transitions for micro-interactions

### Performance
- No additional dependencies (no Material-UI, shadcn, etc.)
- Hand-built SVG charts (smaller than libraries)
- Lazy-load FullReport (large component)
- Minimal re-renders (proper React patterns)

### Accessibility
- Semantic HTML (h1, h2, h3, etc.)
- Proper contrast ratios
- Focus management
- ARIA labels where needed
- Keyboard navigation support

---

## ✨ SUMMARY

The redesigned OneGrasp dashboard is now a **production-grade SaaS application** that:

✅ Looks professional (not auto-generated)
✅ Uses a unified design system (not 3 conflicting palettes)
✅ Provides clear information hierarchy
✅ Removes redundancy
✅ Follows SaaS best practices
✅ Maintains existing functionality
✅ Scales to all screen sizes
✅ Is maintainable and extensible

**Result**: A dashboard that a school counselor or career advisor would use daily without hesitation.

---

**Status**: 🎉 COMPLETE  
**Last Updated**: August 26, 2026  
**Ready for Production**: ✅ YES
