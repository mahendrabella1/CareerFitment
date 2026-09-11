/**
 * Class 6 LaTeX PDF Generator
 * Main orchestrator: PNG rendering → LaTeX compilation → PDF output
 */

import path from 'path';
import fs from 'fs';
import { renderClass6ReportPages, closeBrowser } from './class6PuppeteerRenderer';
import { generatePDFFromImages } from './latexCompiler';
import type { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';

interface Class6ReportGeneratorOptions {
  studentName: string;
  studentEmail: string;
  studentAge: number;
  completedDate: Date;
  output: Class6ScoreOutput;
  tempDir?: string;
  keepImages?: boolean; // Keep PNG files after PDF generation
}

/**
 * Main function to generate complete Class 6 LaTeX PDF report
 */
export async function generateClass6LatexPDF(
  options: Class6ReportGeneratorOptions
): Promise<Buffer> {
  const {
    studentName,
    studentEmail,
    studentAge,
    completedDate,
    output,
    tempDir = path.join(process.cwd(), 'tmp/class6-reports'),
    keepImages = false
  } = options;

  let tempOutputDir = '';

  try {
    // Step 1: Create temporary directory
    console.log('\n📂 Setting up temporary directory...');
    tempOutputDir = path.join(tempDir, `${studentName.replace(/\s+/g, '_')}_${Date.now()}`);
    if (!fs.existsSync(tempOutputDir)) {
      fs.mkdirSync(tempOutputDir, { recursive: true });
    }
    console.log(`✓ Temp directory: ${tempOutputDir}`);

    // Step 2: Render pages to PNG
    console.log('\n🎨 Rendering report pages to PNG...');
    const imagePaths = await renderClass6ReportPages(
      studentName,
      studentEmail,
      studentAge,
      completedDate,
      output,
      tempOutputDir
    );
    console.log(`✓ Rendered ${imagePaths.length} pages`);

    // Step 3: Generate PDF from images
    console.log('\n📄 Generating PDF from images...');
    const pdfBuffer = await generatePDFFromImages(imagePaths, studentName, tempOutputDir);
    console.log(`✓ PDF generated (${(pdfBuffer.length / 1024 / 1024).toFixed(2)} MB)`);

    // Step 4: Cleanup (optional)
    if (!keepImages) {
      console.log('\n🧹 Cleaning up image files...');
      imagePaths.forEach(imagePath => {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
      console.log('✓ Image files removed');
    }

    console.log('\n✅ Class 6 LaTeX PDF generation complete!\n');
    return pdfBuffer;
  } catch (error) {
    console.error('\n❌ Error generating Class 6 LaTeX PDF:', error);
    throw error;
  } finally {
    // Close browser
    await closeBrowser();

    // Cleanup temp directory if not keeping images
    if (!keepImages && tempOutputDir && fs.existsSync(tempOutputDir)) {
      try {
        fs.rmSync(tempOutputDir, { recursive: true, force: true });
      } catch {
        console.warn('Could not clean up temp directory:', tempOutputDir);
      }
    }
  }
}

/**
 * Generate and save PDF to file
 */
export async function generateAndSaveClass6PDF(
  options: Class6ReportGeneratorOptions,
  outputPath: string
): Promise<string> {
  const pdfBuffer = await generateClass6LatexPDF(options);

  // Ensure directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(outputPath, pdfBuffer);
  console.log(`✅ PDF saved to: ${outputPath}`);

  return outputPath;
}

/**
 * Generate PDF and return as Buffer (for email/download)
 */
export async function generateClass6PDFBuffer(
  studentName: string,
  studentEmail: string,
  studentAge: number,
  completedDate: Date,
  output: Class6ScoreOutput
): Promise<Buffer> {
  return generateClass6LatexPDF({
    studentName,
    studentEmail,
    studentAge,
    completedDate,
    output,
    keepImages: false // Don't keep PNG files
  });
}
