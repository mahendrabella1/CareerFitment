# Class 6 LaTeX PDF Report - Deployment & Integration Guide

## 🚀 Quick Start (5 minutes)

### 1. **Test the Report Generator**

Open in browser:
```
http://localhost:3000/test-class6-report
```

- Enter student name and email
- Click "Generate 22-Page Report"
- Wait 1-2 minutes for PDF generation
- Download and view the 22-page professional report!

---

## 📋 Installation & Setup

### 1. **Install LaTeX on Production Server**

**Ubuntu/Debian:**
```bash
apt-get update
apt-get install -y texlive-latex-base texlive-latex-extra texlive-fonts-recommended
```

**Verify installation:**
```bash
pdflatex --version
```

### 2. **Install NPM Dependency**

```bash
npm install puppeteer
```

### 3. **Configure Email Service (Optional but Recommended)**

Add to `.env.local`:
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=reports@onegrasp.com
```

**Gmail Setup:**
1. Enable 2-Factor Authentication
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in EMAIL_PASSWORD

---

## 🔌 API Integration

### **Endpoint: POST /api/generate-class6-pdf**

```typescript
// Request
const response = await fetch('/api/generate-class6-pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    studentName: 'John Doe',
    studentEmail: 'john@example.com',
    studentAge: 12,
    completedDate: new Date().toISOString(),
    output: class6ScoreOutput
  })
});

// Response: PDF binary data
const pdfBuffer = await response.arrayBuffer();
```

---

## 📊 Integration Points

### **1. After Assessment Completion**

**File:** `app/api/new-assessment/score/route.ts`

Add this code after assessment is scored:

```typescript
// After scoring the assessment...
if (body.category === 'class_6') {
  // Your existing scoring code...
  
  // NEW: Generate PDF
  try {
    const pdfBuffer = await generateClass6PDFBuffer(
      studentName,
      studentEmail,
      studentAge || 12,
      new Date(),
      classOutput
    );
    
    // Send email with PDF
    if (isEmailConfigured()) {
      await sendClass6ReportEmail(studentEmail, studentName, pdfBuffer);
    }
    
    // Save PDF path to database
    // summary.pdfUrl = 'gs://bucket/reports/...' (optional)
  } catch (error) {
    console.warn('PDF generation failed (non-critical):', error);
    // Continue - PDF generation failure doesn't break the assessment
  }
}
```

### **2. Dashboard Download Button**

**File:** `app/account/Dashboard.tsx`

Add to the report view:

```typescript
<button
  onClick={async () => {
    const response = await fetch('/api/generate-class6-pdf', {
      method: 'POST',
      body: JSON.stringify({
        studentName: name,
        studentEmail: email,
        studentAge: age,
        completedDate: new Date().toISOString(),
        output: assessment.class6Output
      })
    });
    
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_Class6_Report.pdf`;
    a.click();
  }}
  style={{ padding: '12px 24px', background: '#2DCC71', color: 'white', borderRadius: '8px' }}
>
  📥 Download Report PDF
</button>
```

---

## 🧪 Testing

### **Test Page URL**
```
http://localhost:3000/test-class6-report
```

**What happens:**
1. Enter student name and email
2. Generates report with mock assessment data
3. PDF downloads immediately
4. Check email inbox for automated report (if configured)

### **Manual Testing**

```typescript
// In Node.js REPL or test file
import { generateClass6PDFBuffer } from '@/lib/report/class6LatexPdf';
import { scoreClass6Assessment } from '@/lib/newAssessment/class6Scoring';

const mockResponses = {
  0: '2', 1: '3', 2: '4', // ... all questions
};

const output = scoreClass6Assessment({
  studentName: 'Test Student',
  responses: mockResponses
});

const pdfBuffer = await generateClass6PDFBuffer(
  'Test Student',
  'test@example.com',
  12,
  new Date(),
  output
);

// Save to file
fs.writeFileSync('test_report.pdf', pdfBuffer);
```

---

## 🔧 Troubleshooting

### **Error: "pdflatex is not installed"**
```bash
# Install LaTeX
apt-get install texlive-latex-base texlive-fonts-recommended

# Verify
pdflatex --version
```

### **Error: "Puppeteer failed to launch"**
```bash
# Install chromium dependencies
apt-get install -y chromium-browser libx11-6 libxss1

# Or use headless: true in puppeteer config
```

### **Error: "LaTeX compilation failed"**
- Check temp directory permissions
- Verify all image files exist in temp dir
- Check LaTeX log file in temp directory

### **Email not sending**
- Verify EMAIL_USER and EMAIL_PASSWORD in .env.local
- Check Gmail app password (not regular password)
- Verify 2FA is enabled on Gmail account
- Check spam folder for test emails

---

## 📈 Performance Optimization

### **Caching**
```typescript
// Cache rendered PNG images if same student takes exam again
const cacheKey = `class6_${studentName}_${Date.now()}`;
```

### **Async Processing**
```typescript
// Don't block assessment response while generating PDF
// Generate in background job
setTimeout(() => {
  generateAndEmailPDF(studentData);
}, 100);
```

### **Compression**
```bash
# Compress final PDF before emailing
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
  -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH \
  -sOutputFile=compressed.pdf input.pdf
```

---

## 🚀 Production Checklist

- [ ] LaTeX installed on production server
- [ ] Puppeteer installed and tested
- [ ] Email credentials configured (optional)
- [ ] PDF generation endpoint tested
- [ ] Assessment API integrated
- [ ] Dashboard download button added
- [ ] PDF stored/archived (optional)
- [ ] Email templates customized
- [ ] Load testing completed
- [ ] Error logging configured
- [ ] PDF generation monitored
- [ ] Student feedback collected

---

## 📊 Monitoring

### **Log PDF Generation**
```typescript
console.log(`✅ PDF generated for ${studentName} (${pdfBuffer.length / 1024 / 1024}MB)`);
```

### **Track Metrics**
- Generation time per student
- PDF file size
- Email delivery success rate
- Error rate

### **Alerts**
- If generation takes > 2 minutes
- If PDF size < 5MB or > 15MB
- If email fails to send
- If LaTeX compilation errors

---

## 📝 Files & APIs

| Component | File | Purpose |
|-----------|------|---------|
| PDF Generator | `lib/report/class6LatexPdf.ts` | Main orchestrator |
| Puppeteer | `lib/report/class6PuppeteerRenderer.ts` | PNG rendering |
| LaTeX Compiler | `lib/report/latexCompiler.ts` | PDF compilation |
| Email Service | `lib/report/emailService.ts` | Email delivery |
| API Endpoint | `app/api/generate-class6-pdf/route.ts` | REST API |
| Test Page | `app/test-class6-report/page.tsx` | Manual testing |

---

## 💡 Tips

1. **Test with different names** to ensure special characters work
2. **Check PDF quality** by opening in multiple readers
3. **Monitor email delivery** for spam filter issues
4. **Set up log aggregation** for debugging
5. **Create backup PDFs** for compliance/archival

---

## 🎉 Success Criteria

✅ Students receive 22-page report within 2 minutes of completion  
✅ PDF is professional, branded with OneGrasp logo  
✅ All student data is personalized  
✅ Email delivery works reliably  
✅ Download works from dashboard  
✅ Generation handles errors gracefully  

---

## 📞 Support

If issues arise:
1. Check error logs: `/var/log/onegrasp/pdf-generation.log`
2. Test endpoint manually: `/test-class6-report`
3. Verify LaTeX: `pdflatex --version`
4. Check permissions: `ls -la /tmp/class6-reports`

---

**Status: ✅ Ready for Production**
