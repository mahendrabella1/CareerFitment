# Class 6 LaTeX PDF Generation - Setup & Implementation Guide

## ✅ Files Created

### 1. **Design System**
- `lib/report/class6-template/styles/global.css` - Professional styling
- `lib/report/class6-template/components/DesignComponents.tsx` - Reusable UI components
- `lib/report/class6-template/pages/CoverPage.tsx` - Cover page template

### 2. **PDF Generation Pipeline**
- `lib/report/class6PuppeteerRenderer.ts` - Converts React to PNG via Puppeteer
- `lib/report/latexCompiler.ts` - Compiles PNG images to PDF via LaTeX
- `lib/report/class6LatexPdf.ts` - Main orchestrator coordinating the pipeline
- `app/api/generate-class6-pdf/route.ts` - API endpoint for PDF generation

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies

```bash
npm install puppeteer pdflatex
```

### Step 2: Install LaTeX on Server

**Linux (Ubuntu/Debian):**
```bash
apt-get update
apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended
```

**macOS:**
```bash
brew install --cask mactex
```

**Windows:**
- Download & install MiKTeX or TeX Live from their official websites

### Step 3: Update package.json

Ensure `package.json` includes:
```json
{
  "dependencies": {
    "puppeteer": "^21.0.0",
    "pdflatex": "^1.0.0"
  }
}
```

---

## 📊 How It Works

### **3-Step Pipeline:**

```
Step 1: React Components
├─ CoverPage.tsx
├─ PersonalityPage.tsx (to be built)
├─ CareerInterestPage.tsx (to be built)
└─ ... 19 more pages

     ↓ Puppeteer

Step 2: PNG Rendering
├─ page-01.png (Cover)
├─ page-02.png (Preface)
├─ page-03.png (Profiling)
└─ ... page-22.png (Summary)

     ↓ LaTeX Assembly

Step 3: PDF Generation
└─ Class6_Report.pdf (22 pages, professional quality)
```

---

## 🚀 Usage

### **Option 1: Direct API Call**

```typescript
// POST /api/generate-class6-pdf
const response = await fetch('/api/generate-class6-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    studentAge: 12,
    completedDate: new Date().toISOString(),
    output: class6ScoreOutput  // From assessment scoring
  })
});

const pdfBuffer = await response.arrayBuffer();
// Download or email the PDF
```

### **Option 2: Generate & Save to File**

```typescript
import { generateAndSaveClass6PDF } from '@/lib/report/class6LatexPdf';

const pdfPath = await generateAndSaveClass6PDF(
  {
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    studentAge: 12,
    completedDate: new Date(),
    output: class6ScoreOutput
  },
  '/path/to/reports/john_doe_report.pdf'
);
```

### **Option 3: Get PDF Buffer (for Email)**

```typescript
import { generateClass6PDFBuffer } from '@/lib/report/class6LatexPdf';

const pdfBuffer = await generateClass6PDFBuffer(
  'John Doe',
  'john@example.com',
  12,
  new Date(),
  class6ScoreOutput
);

// Send via email
await sendEmailWithAttachment({
  to: 'john@example.com',
  subject: 'Your Career Report',
  attachment: {
    filename: 'Career_Report.pdf',
    content: pdfBuffer
  }
});
```

---

## 📄 Report Structure (22 Pages)

| Page | Component | Data Source |
|------|-----------|-------------|
| 1 | CoverPage | studentName, email, age |
| 2 | PrefacePage | Fixed template |
| 3 | ProfilingPage | output.summary |
| 4 | PersonalityPage | output.personalityProfile |
| 5 | PersonalityDetails | output.personalityProfile.type |
| 6-7 | CareerInterestPages | output.riasecScores |
| 8-9 | StrengthPages | output.strengthDomains |
| 10 | MotivatorsPage | output.motivators |
| 11 | LearningStylePage | output.learningStyle |
| 12 | EIPage | output.emotionalAwareness |
| 13-14 | SkillsPages | output creativity |
| 15 | DomainsPage | Career domains from knowledge.ts |
| 16-18 | DomainDetailsPages | Domain descriptions & salaries |
| 19 | CareerRolesPage | Top 5 careers per domain |
| 20 | SalaryPage | Salary ranges & companies |
| 21 | RoadmapPage | 15-year career timeline |
| 22 | SummaryPage | Assessment summary |

---

## 🎨 Design Specifications

### **Color Palette**
```css
--navy: #1F3A52        /* Primary color */
--gold: #FFD700        /* Accent color */
--white: #FFFFFF       /* Background */
--light-gray: #F5F7FA  /* Secondary bg */
--text-gray: #475569   /* Body text */
```

### **Typography**
```
Headers (h1): 32pt, bold, navy
Subheaders (h2): 18pt, bold, navy with gold underline
Body text: 11pt, regular, text-gray
```

### **Page Layout**
```
A4 Size: 210mm × 297mm
Padding: 26pt on all sides
Footer Height: ~12pt
Content Area: 267mm (height) × 158mm (width)
```

---

## ⚙️ Customization

### **Add New Pages**

1. **Create React Component:**
```typescript
// lib/report/class6-template/pages/MyPage.tsx
export function MyPage({ data }: { data: Class6ScoreOutput }) {
  return (
    <div style={{width:'210mm', height:'297mm', ...}}>
      {/* Page content */}
    </div>
  );
}
```

2. **Add to Renderer:**
```typescript
// In class6PuppeteerRenderer.ts, add to renderClass6ReportPages()
const myPageHTML = renderMyPageHTML(pageData);
const pageXPath = path.join(outputDir, 'page-XX.png');
await renderPageToPNG(myPageHTML, pageXPath, XX);
imagePaths.push(pageXPath);
```

### **Change Colors**

Update `styles/global.css`:
```css
:root {
  --navy: #YOUR_COLOR;
  --gold: #YOUR_COLOR;
  /* ... other colors */
}
```

---

## 🔍 Troubleshooting

### **Issue: "pdflatex is not installed"**
**Solution:** Install LaTeX
```bash
# Ubuntu
apt-get install texlive-latex-base texlive-fonts-recommended

# macOS
brew install --cask mactex
```

### **Issue: "Puppeteer failed to launch"**
**Solution:** Install chromium dependencies
```bash
apt-get install -y chromium-browser libx11-6
```

### **Issue: "PNG rendering is slow"**
**Solution:** Reduce viewport or cache Puppeteer instance
- Already handled in `class6PuppeteerRenderer.ts` (browser reuse)

### **Issue: "PDF is blank or corrupted"**
**Solution:** Check image paths in LaTeX template
- Ensure absolute paths are used in .tex file
- Verify all PNG files exist before compilation

---

## 📊 Performance & Monitoring

### **Generation Time Estimates**
- **PNG Rendering**: ~2-3 seconds per page (22 pages = 45-65 seconds)
- **LaTeX Compilation**: ~5-10 seconds
- **Total**: ~60-75 seconds per report

### **File Sizes**
- **Per Page (PNG)**: ~300-500 KB
- **Final PDF**: ~8-12 MB
- **Compressed PDF**: ~2-4 MB

### **Memory Usage**
- **Puppeteer Browser**: ~150-200 MB
- **Peak During Compilation**: ~400-500 MB

---

## 🧪 Testing

### **Manual Test:**
```bash
curl -X POST http://localhost:3000/api/generate-class6-pdf \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Test Student",
    "studentEmail": "test@example.com",
    "studentAge": 12,
    "completedDate": "'$(date -Iseconds)'",
    "output": {}
  }' \
  -o test_report.pdf
```

### **Automated Tests** (to be created)
```typescript
// tests/class6-pdf.test.ts
describe('Class 6 PDF Generation', () => {
  it('should generate valid PDF', async () => {
    // Test implementation
  });
});
```

---

## 📈 Next Steps

1. **✅ Core Pipeline** - Already created
2. **⏳ Build Remaining Pages** (2-22)
   - PrefacePage
   - ProfilingPage
   - PersonalityPage
   - etc.
3. **⏳ Integrate with Assessment API**
   - Hook into `/api/new-assessment/score`
4. **⏳ Add Email Distribution**
   - Send PDF to student email
5. **⏳ Dashboard Integration**
   - Show download button
   - Store PDF metadata

---

## 🔗 Related Files

- Assessment Scoring: `lib/newAssessment/class6Scoring.ts`
- Career Knowledge: `lib/report/knowledge.ts`
- API Scoring: `app/api/new-assessment/score/route.ts`

---

## 📞 Support

For issues or questions:
- Check logs in console output
- Verify LaTeX installation: `pdflatex --version`
- Test Puppeteer: Run via command line directly
- Check temp directory permissions

---

**Status**: ✅ Full pipeline ready for page component development
