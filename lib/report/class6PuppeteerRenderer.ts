/**
 * Class 6 Report - Puppeteer Page Renderer
 * Converts React components to high-quality PNG images
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { CoverPage } from './class6-template/pages/CoverPage';
import type { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';

// Type for page data
interface PageData {
  studentName: string;
  studentEmail: string;
  studentAge: number;
  completedDate: Date;
  output: Class6ScoreOutput;
}

let browser: Browser | null = null;

/**
 * Initialize Puppeteer browser (reuse across renders)
 */
async function getBrowser(): Promise<Browser> {
  if (browser) return browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    return browser;
  } catch (error) {
    console.error('Failed to launch Puppeteer:', error);
    throw new Error('Puppeteer initialization failed');
  }
}

/**
 * Render a React component to PNG
 */
async function renderPageToPNG(
  htmlContent: string,
  outputPath: string,
  pageNumber: number
): Promise<void> {
  const browserInstance = await getBrowser();
  let page: Page | null = null;

  try {
    page = await browserInstance.newPage();

    // Set A4 size: 210mm × 297mm at 96 DPI
    await page.setViewport({
      width: 794,  // 210mm at 96dpi
      height: 1123 // 297mm at 96dpi
    });

    // Set content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Wait for any animations to finish
    await page.waitForTimeout(500);

    // Save screenshot
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      type: 'png'
    });

    console.log(`✓ Rendered page ${pageNumber} to ${outputPath}`);
  } finally {
    if (page) await page.close();
  }
}

/**
 * Generate HTML wrapper for a component
 */
function wrapComponentHTML(component: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 210mm;
          height: 297mm;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
          background: white;
          color: #2C3E50;
        }
      </style>
    </head>
    <body>
      ${component}
    </body>
    </html>
  `;
}

/**
 * Render CoverPage to HTML string (SSR style)
 */
function renderCoverPageHTML(data: PageData): string {
  const coverHTML = `
    <div style="width:210mm;height:297mm;padding:0;margin:0;background:white;position:relative;overflow:hidden;font-family:system-ui,-apple-system,sans-serif">
      <!-- Geometric Background -->
      <div style="position:absolute;top:0;left:0;width:80mm;height:140mm;background:linear-gradient(135deg,#1F3A52 0%,#2C5282 100%);clip-path:polygon(0 0,100% 0,50% 100%,0 80%);opacity:0.95"></div>
      <div style="position:absolute;bottom:0;right:0;width:100mm;height:120mm;background:linear-gradient(45deg,#FFD700 0%,#FFA500 100%);clip-path:polygon(100% 100%,0 100%,50% 0,100% 50%);opacity:0.9"></div>

      <!-- Content -->
      <div style="position:relative;z-index:10;padding:40mm 26pt;height:100%;display:flex;flex-direction:column;justify-content:space-between">
        <!-- Top Section -->
        <div style="text-align:right;margin-bottom:30mm">
          <div style="font-size:32pt;font-weight:700;color:#E63946;letter-spacing:2pt;margin-bottom:8pt">
            One<span style="color:#1F3A52">Grasp</span>
          </div>
          <p style="font-size:10pt;color:#666;margin:0;font-weight:500">Career Discovery Platform</p>
        </div>

        <!-- Middle Section -->
        <div style="margin-bottom:20mm">
          <p style="font-size:10pt;color:#1F3A52;font-weight:600;margin:0;margin-bottom:8pt">Report Prepared For</p>
          <h1 style="font-size:40pt;font-weight:700;color:#1F3A52;margin:0;margin-bottom:16pt;line-height:1.1">${data.studentName}</h1>

          <div style="margin-top:16pt">
            <div style="display:flex;align-items:center;margin-bottom:8pt;font-size:11pt;color:#2C3E50">
              <span style="margin-right:12pt;font-size:16pt">🎂</span>
              <span>${data.studentAge} Years Old</span>
            </div>
            <div style="display:flex;align-items:center;margin-bottom:8pt;font-size:11pt;color:#2C3E50">
              <span style="margin-right:12pt;font-size:16pt">✉️</span>
              <span>${data.studentEmail}</span>
            </div>
            <div style="display:flex;align-items:center;font-size:11pt;color:#2C3E50">
              <span style="margin-right:12pt;font-size:16pt">📅</span>
              <span>${data.completedDate.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <!-- Bottom Section -->
        <div style="background-color:#1F3A52;color:white;padding:16pt;border-radius:8pt;text-align:center;margin-bottom:20pt">
          <h2 style="font-size:16pt;font-weight:700;color:white;margin:0;margin-bottom:4pt">Career Discovery Report</h2>
          <p style="font-size:11pt;color:#E5E7EB;margin:0">Class 6 - Your Career Exploration Journey</p>
        </div>

        <!-- Footer Text -->
        <div style="font-size:9pt;color:#666;text-align:center;padding-top:12pt">
          <p style="margin:0;margin-bottom:4pt">🔒 Confidential | Personal Career Assessment</p>
          <p style="margin:0">For educational purposes only</p>
        </div>
      </div>

      <!-- Page Footer -->
      <div style="position:absolute;bottom:12pt;left:26pt;right:26pt;display:flex;justify-content:space-between;align-items:center;font-size:9pt;color:#94a3b8;padding-top:12pt;border-top:1pt solid #E5E7EB">
        <div>📞 8977760443 | 📧 support@onegrasp.com</div>
        <div>Page 1 of 22</div>
      </div>
    </div>
  `;

  return wrapComponentHTML(coverHTML);
}

/**
 * Main function to render all Class 6 report pages
 */
export async function renderClass6ReportPages(
  studentName: string,
  studentEmail: string,
  studentAge: number,
  completedDate: Date,
  output: Class6ScoreOutput,
  outputDir: string
): Promise<string[]> {
  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const pageData: PageData = {
    studentName,
    studentEmail,
    studentAge,
    completedDate,
    output
  };

  const imagePaths: string[] = [];

  try {
    // Page 1: Cover
    console.log('Rendering page 1: Cover...');
    const coverHTML = renderCoverPageHTML(pageData);
    const page1Path = path.join(outputDir, 'page-01.png');
    await renderPageToPNG(coverHTML, page1Path, 1);
    imagePaths.push(page1Path);

    // Pages 2-22: All report pages
    const allPages = [
      // Page 2
      { html: generatePageHTML('Preface'), title: 'Preface' },
      // Page 3
      { html: generatePageHTML('Your Profiling'), title: 'Your Profiling' },
      // Page 4
      { html: generatePageHTML('Career Personality'), title: 'Career Personality' },
      // Page 5
      { html: generatePageHTML('Career Interests (RIASEC)'), title: 'Career Interests' },
      // Page 6
      { html: generatePageHTML('Your Strengths'), title: 'Your Strengths' },
      // Page 7
      { html: generatePageHTML('What Motivates You'), title: 'What Motivates You' },
      // Page 8
      { html: generatePageHTML('Your Learning Style'), title: 'Your Learning Style' },
      // Page 9
      { html: generatePageHTML('Emotional Intelligence'), title: 'Emotional Intelligence' },
      // Page 10
      { html: generatePageHTML('Skills & Abilities (Part 1)'), title: 'Skills & Abilities (Part 1)' },
      // Page 11
      { html: generatePageHTML('Skills & Abilities (Part 2)'), title: 'Skills & Abilities (Part 2)' },
      // Page 12
      { html: generatePageHTML('Your Top Career Domains'), title: 'Career Domains' },
      // Page 13
      { html: generatePageHTML('Technology & Innovation'), title: 'Technology & Innovation' },
      // Page 14
      { html: generatePageHTML('Creative Arts & Design'), title: 'Creative Arts & Design' },
      // Page 15
      { html: generatePageHTML('Science & Research'), title: 'Science & Research' },
      // Page 16
      { html: generatePageHTML('Top Career Roles'), title: 'Top Careers' },
      // Page 17
      { html: generatePageHTML('Your 15-Year Roadmap'), title: '15-Year Roadmap' },
      // Page 18
      { html: generatePageHTML('Summary & Action Plan'), title: 'Summary' },
      // Pages 19-22 (additional content pages)
      { html: generatePageHTML('Career Development'), title: 'Career Development' },
      { html: generatePageHTML('Parent Guide'), title: 'Parent Guide' },
      { html: generatePageHTML('Resources & Support'), title: 'Resources' },
      { html: generatePageHTML('Next Steps'), title: 'Next Steps' }
    ];

    for (let i = 0; i < allPages.length; i++) {
      const pageNum = i + 2;
      console.log(`Rendering page ${pageNum}: ${allPages[i].title}...`);
      const pagePath = path.join(outputDir, `page-${String(pageNum).padStart(2, '0')}.png`);
      await renderPageToPNG(allPages[i].html, pagePath, pageNum);
      imagePaths.push(pagePath);
    }

    console.log(`✅ Successfully rendered all 22 pages to ${outputDir}`);
    return imagePaths;
  } catch (error) {
    console.error('Error rendering pages:', error);
    throw error;
  }
}

/**
 * Generate HTML for a page
 */
function generatePageHTML(title: string): string {
  return `
    <div style="width:210mm;height:297mm;padding:0;margin:0;background:white;font-family:system-ui,-apple-system,sans-serif;position:relative;overflow:hidden">
      <!-- Header -->
      <div style="padding:16pt 26pt;border-bottom:1pt solid #E5E7EB;margin-bottom:16pt">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <p style="font-size:12pt;font-weight:600;color:#1F3A52;margin:0">${title}</p>
          <p style="font-size:14pt;font-weight:700;color:#E63946;margin:0">OneGrasp</p>
        </div>
      </div>

      <!-- Content Area -->
      <div style="padding:0 26pt;height:calc(297mm - 120pt);overflow:hidden">
        <h2 style="font-size:24pt;font-weight:700;color:#1F3A52;margin:0 0 12pt 0;border-bottom:3pt solid #FFD700;padding-bottom:8pt">${title}</h2>
        <p style="font-size:11pt;color:#475569;line-height:1.6;margin:16pt 0">
          This section provides insights into your ${title.toLowerCase()}. Use this information to better understand yourself and explore career opportunities that align with your profile.
        </p>
      </div>

      <!-- Footer -->
      <div style="position:absolute;bottom:12pt;left:26pt;right:26pt;display:flex;justify-content:space-between;align-items:center;font-size:9pt;color:#94a3b8;padding-top:12pt;border-top:1pt solid #E5E7EB">
        <div>📞 8977760443 | 📧 support@onegrasp.com</div>
        <div>OneGrasp Career Report</div>
      </div>
    </div>
  `;
}

/**
 * Get page title by page number
 */
function getPageTitle(pageNum: number): string {
  const titles: Record<number, string> = {
    1: 'Cover Page',
    2: 'Preface',
    3: 'Your Profiling',
    4: 'Career Personality',
    5: 'Personality Type Description',
    6: 'Career Interest (RIASEC)',
    7: 'RIASEC Details',
    8: 'Strengths Overview',
    9: 'Strengths Details',
    10: 'Career Motivators',
    11: 'Learning Style',
    12: 'Emotional Intelligence',
    13: 'Skills & Abilities (Part 1)',
    14: 'Skills & Abilities (Part 2)',
    15: 'Recommended Career Domains',
    16: 'Domain Details #1',
    17: 'Domain Details #2',
    18: 'Domain Details #3',
    19: 'Top Careers in Domains',
    20: 'Salary & Companies',
    21: '15-Year Roadmap',
    22: 'Assessment Summary'
  };
  return titles[pageNum] || `Page ${pageNum}`;
}

/**
 * Close browser when done
 */
export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close();
    browser = null;
  }
}
