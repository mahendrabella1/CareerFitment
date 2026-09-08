# Class 6 LaTeX Report Generator - Implementation Plan

## Overview
Generate a professional 20+ page PDF report for Class 6 students using:
1. **React components** → render to PNG images
2. **LaTeX** → assemble PNG images into PDF
3. **Dynamic data** → Class 6 assessment scores

---

## Design Structure (22 Pages)

| Page | Title | Purpose | Content from Class6ScoreOutput |
|------|-------|---------|------|
| 1 | Cover Page | Student introduction | name, email, age, class, logo |
| 2 | Preface | How to read the report | Fixed template + 5-step journey |
| 3 | Your Profiling | Career planning stage | career clarity level explanation |
| 4 | Career Personality | MBTI personality | 4-dimension sliders (E/I, S/N, T/F, J/P) |
| 5 | Personality Type Description | Explain the type | personalityProfile.type interpretation |
| 6 | Career Interest (RIASEC) | Career interests | RIASEC scores visualization |
| 7 | RIASEC Details | Explain interests | Top 2-3 RIASEC interpretations |
| 8 | Strengths Overview | Strength domains | strengthDomains array |
| 9 | Strengths Details | Detailed explanation | Descriptions for each strength |
| 10 | Career Motivators | Motivators analysis | motivators array with descriptions |
| 11 | Learning Style | Learning preferences | learningStyle.primary + scores |
| 12 | Emotional Intelligence | EI assessment | emotionalAwareness dimensions |
| 13 | Skills & Abilities (Part 1) | Visual skills chart | Circular progress indicators |
| 14 | Skills & Abilities (Part 2) | More skills | Additional skill categories |
| 15 | Recommended Career Domains | Top 5 domains | Career domains matched to scores |
| 16-18 | Domain Details (3 pages) | Deep dive into 3 domains | Domain name, roles, salary, skills, future |
| 19 | Top Careers in Domain | Career roles | Top 5 careers with details |
| 20 | Salary & Companies | Employment info | Salary ranges, hiring companies |
| 21 | 15-Year Roadmap | Career timeline | Education path, milestones, progression |
| 22 | Assessment Summary | Final insights | Summary table + next steps |

---

## Implementation Architecture

### Phase 1: Design Template Framework
Create HTML/CSS components that match the design:
```
lib/report/class6-template/
├── pages/
│   ├── CoverPage.tsx
│   ├── PrefacePage.tsx
│   ├── ProfilingPage.tsx
│   ├── PersonalityPage.tsx
│   ├── CareerInterestPage.tsx
│   ├── StrengthsPage.tsx
│   ├── MotivatorsPage.tsx
│   ├── LearningStylePage.tsx
│   ├── SkillsPage.tsx
│   ├── CareerDomainsPage.tsx
│   ├── DomainDetailsPage.tsx (×3)
│   ├── CareerRolesPage.tsx
│   ├── RoadmapPage.tsx
│   └── SummaryPage.tsx
├── styles/
│   ├── global.css (Professional design, colors: navy, gold, white)
│   └── components.css (Sliders, charts, cards)
└── components/
    ├── Slider.tsx (For personality dimensions)
    ├── CircleChart.tsx (For skills percentages)
    ├── SkillCard.tsx (Colored boxes like A, S, C)
    └── RoadmapTimeline.tsx
```

### Phase 2: PDF Generation Pipeline
```
lib/report/class6LatexPdf.ts (Main orchestrator)
├── renderPagesToPNG() → Use Puppeteer
├── generateLatexTemplate() → Create .tex file
└── compileLaTeX() → Generate PDF

lib/report/class6PageRenderer.ts
├── renderWithPuppeteer(component, page number)
└── savePNGToTemp()

lib/report/latexCompiler.ts
├── createLatexContent(imagePaths, studentName)
└── executePdfLatex(texFile)
```

### Phase 3: Data Mapping
Map `Class6ScoreOutput` fields to report sections:

```typescript
// Data flow
{
  personalityProfile: {
    ei: "E", sn: "S", tf: "F", jp: "P", // → Page 4 sliders
    type: "ESFP" // → Page 5 description
  },
  riasecScores: [...] // → Pages 6-7
  strengthDomains: [...] // → Pages 8-9
  motivators: [...] // → Page 10
  learningStyle: {...} // → Page 11
  emotionalAwareness: [...] // → Page 12
  creativity: [...] // → Page 13
  summary: {
    profileDescription, // → Page 1 intro
    careerDomains: [...] // → Pages 15-20
  }
}
```

---

## Page Structure Details

### Page 1: Cover Page
- OneGrasp logo (top right)
- Geometric design elements (navy blue, gold)
- Student details:
  - Name (large)
  - Age / Class / Email
  - Assessment date
- "Career Report for Class 6"
- Footer: "Powered By: OneGrasp"

### Page 2: Preface
- Title: "PREFACE"
- Welcome message (personalized with name)
- 5-step journey circle graphic:
  1. Your Career Analysis
  2. Find Best Career Option
  3. Your Educational Plan
  4. Execution Plan
  5. Career Counselling

### Pages 3-13: Assessment Dimensions
Each dimension page has:
- Title + description text
- Visual element (slider, chart, or colored boxes)
- Interpretation text
- Related career advice

### Pages 14-20: Career Recommendations
**Page 14: Top 5 Career Domains**
- List of 5 domains matched to student profile
- Domain fit percentage
- Brief description

**Pages 15-17: Domain Details (3 domains)**
Per domain:
- Domain title
- What it is (description)
- Typical roles
- Salary ranges (Entry/Mid/Senior)
- Trending future outlook

**Page 18: Top 5 Careers** 
Per domain's top 5 careers:
- Role name
- Companies that hire
- Salary range
- Required skills
- Growth potential

**Page 19: 15-Year Roadmap**
- Timeline from Now → Year 15
- Milestones by year
- Education stages
- Skill development phases
- Career progression

### Page 20: Summary
- Assessment methodology table
- Key findings
- Next action steps
- Contact information

---

## Technology Stack

### NPM Packages Needed
```json
{
  "pdflatex": "^1.0.0",
  "puppeteer": "^21.0.0",
  "html2canvas": "^1.4.1",
  "react": "^18.3.1",
  "date-fns": "^2.30.0"
}
```

### Server Requirements
- LaTeX installation:
  ```bash
  # Linux (production)
  apt-get install texlive-latex-base texlive-fonts-recommended texlive-latex-extra
  
  # macOS
  brew install --cask mactex
  ```

---

## File Generation Flow

```
User completes Class 6 Assessment
  ↓
API: POST /api/new-assessment/score
  ├─ Score assessment → Class6ScoreOutput
  └─ Trigger PDF generation
     ↓
     generateClass6PDF(class6Output, studentData)
     ├─ Create 22 React page components
     ├─ Render each to PNG via Puppeteer
     │  (class6Report_page-01.png → page-22.png)
     ├─ Generate LaTeX template with image paths
     ├─ Execute pdflatex compilation
     └─ PDF generated: student_class6_report.pdf
        ↓
        Email PDF to student
        Store in database
        Show in dashboard
```

---

## Implementation Steps

### Step 1: Install Dependencies
```bash
npm install pdflatex puppeteer html2canvas
```

### Step 2: Create Design Components
- Build React components matching the design
- Match colors: Navy (#1F3A52), Gold (#FFD700), White (#FFFFFF)
- Create utility components (Slider, CircleChart, etc.)

### Step 3: Implement Page Renderer
- `class6PageRenderer.ts`: Convert React components to PNG
- Use Puppeteer viewport: A4 (210mm × 297mm @ 96dpi)

### Step 4: Implement LaTeX Generator
- `class6LatexPdf.ts`: Generate dynamic .tex file
- Template structure: images → PDF assembly

### Step 5: Integrate with API
- Modify `/api/new-assessment/score/route.ts`
- After scoring, call `generateClass6PDF()`
- Email PDF via Firebase/SendGrid
- Store PDF path in assessment record

### Step 6: Dashboard Integration
- Show "Download PDF" button in Class 6 dashboard
- Store generated PDF in `/public/reports/` or cloud storage
- Provide download link

---

## Design Specifications

### Color Palette
- **Primary**: Navy Blue (#1F3A52)
- **Accent**: Gold (#FFD700)
- **Danger**: Light Red (#FF6B6B)
- **Success**: Green (#2DCC71)
- **Text**: Dark Gray (#2C3E50)
- **Background**: White (#FFFFFF), Light Gray (#F5F7FA)

### Typography
- **Headers**: Bold, 24-28px
- **Subheaders**: Bold, 16-18px
- **Body**: Regular, 11-12px
- **Font**: System fonts (Helvetica, Arial)

### Visual Elements
- Geometric shapes (circles, rounded rectangles)
- Progress bars/sliders with colored fills
- Circular pie/donut charts for percentages
- Colorful skill cards (A, S, C style boxes)
- Timeline graphics

---

## Deliverables

✅ Class 6 report design components (React)  
✅ PNG page rendering system (Puppeteer)  
✅ Dynamic LaTeX template generator  
✅ PDF compilation automation  
✅ Assessment API integration  
✅ Dashboard PDF viewer  
✅ Email delivery system  
✅ Database PDF storage  

---

## Next Steps

1. **Design Confirmation**: Review component designs with team
2. **Color/Font Finalization**: Confirm exact colors and fonts
3. **Component Development**: Build React components
4. **Testing**: Generate sample PDFs
5. **Deployment**: Server setup for LaTeX
6. **Launch**: Enable for Class 6 students

---

## Timeline Estimate

- Design components: 2-3 days
- Renderer setup: 1 day
- LaTeX integration: 1 day
- Testing & refinement: 1-2 days
- **Total: 5-7 days**

---

## Notes

- This approach keeps dashboard report interactive (HTML)
- Email PDFs are professional/printable (LaTeX)
- Images are cached; only regenerated if data changes
- Scalable to Class 7, 8, 9-10 reports
- Can reuse design template for other classes with minor adjustments
