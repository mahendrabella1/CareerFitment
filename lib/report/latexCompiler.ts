/**
 * LaTeX Compiler - Assembles PNG images into PDF
 * Uses pdflatex to bind all report pages
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Generate LaTeX template that assembles PNG pages into PDF
 */
export function generateLatexTemplate(imagePaths: string[]): string {
  let imageIncludes = '';

  imagePaths.forEach((imagePath, index) => {
    const isLastPage = index === imagePaths.length - 1;
    imageIncludes += `\\includegraphics[width=\\paperwidth,height=0.995\\paperheight]{${imagePath}}`;
    if (!isLastPage) {
      imageIncludes += '\\newpage\n';
    }
  });

  return `\\documentclass[a4paper]{article}
\\usepackage[margin=0pt]{geometry}
\\usepackage{graphicx}
\\usepackage{pdfpages}
\\usepackage{fancyhdr}
\\pagestyle{empty}
\\setlength{\\parindent}{0pt}

\\begin{document}

${imageIncludes}

\\end{document}`;
}

/**
 * Check if LaTeX is installed
 */
export function checkLatexInstallation(): boolean {
  try {
    execSync('pdflatex --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Compile LaTeX to PDF
 */
export async function compileLaTeXToPDF(
  texFilePath: string,
  outputPDFPath: string
): Promise<Buffer> {
  const texDir = path.dirname(texFilePath);
  const texFileName = path.basename(texFilePath);
  const pdfFileName = path.basename(outputPDFPath);

  try {
    // Check if LaTeX is installed
    if (!checkLatexInstallation()) {
      throw new Error('pdflatex is not installed on this system');
    }

    // Compile LaTeX
    console.log(`Compiling LaTeX: ${texFilePath}`);

    const command = `pdflatex -interaction=nonstopmode -output-directory="${texDir}" "${texFilePath}"`;

    try {
      execSync(command, {
        cwd: texDir,
        stdio: 'pipe',
        maxBuffer: 10 * 1024 * 1024 // 10MB buffer
      });
    } catch (error) {
      // pdflatex might exit with non-zero code even on success, check if PDF was created
      console.warn('LaTeX compilation warning:', error);
    }

    // Check if PDF was created
    const generatedPDFPath = path.join(texDir, pdfFileName.replace('.pdf', '.pdf'));

    if (!fs.existsSync(generatedPDFPath)) {
      // Try alternate naming
      const altPDFPath = path.join(texDir, texFileName.replace('.tex', '.pdf'));
      if (!fs.existsSync(altPDFPath)) {
        throw new Error(`PDF was not generated. Checked: ${generatedPDFPath} and ${altPDFPath}`);
      }
    }

    // Read PDF as buffer
    const pdfBuffer = fs.readFileSync(
      fs.existsSync(generatedPDFPath) ? generatedPDFPath : path.join(texDir, texFileName.replace('.tex', '.pdf'))
    );

    console.log(`✅ PDF compiled successfully: ${outputPDFPath}`);
    return pdfBuffer;
  } catch (error) {
    console.error('LaTeX compilation error:', error);
    throw new Error(`Failed to compile LaTeX: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Complete PDF generation pipeline
 */
export async function generatePDFFromImages(
  imagePaths: string[],
  studentName: string,
  outputDir: string
): Promise<Buffer> {
  try {
    // Step 1: Generate LaTeX template
    console.log('\n📝 Generating LaTeX template...');
    const latexContent = generateLatexTemplate(imagePaths);

    // Step 2: Save LaTeX file
    const texFileName = `${studentName.replace(/\s+/g, '_')}_report.tex`;
    const texFilePath = path.join(outputDir, texFileName);
    fs.writeFileSync(texFilePath, latexContent, 'utf-8');
    console.log(`✓ LaTeX template saved: ${texFilePath}`);

    // Step 3: Compile to PDF
    console.log('\n🔨 Compiling LaTeX to PDF...');
    const pdfFileName = texFileName.replace('.tex', '.pdf');
    const pdfFilePath = path.join(outputDir, pdfFileName);

    const pdfBuffer = await compileLaTeXToPDF(texFilePath, pdfFilePath);

    // Step 4: Cleanup temporary files (optional)
    console.log('\n🧹 Cleaning up temporary files...');
    const auxFiles = ['.aux', '.log', '.out'];
    auxFiles.forEach(ext => {
      const filePath = texFilePath.replace('.tex', ext);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    console.log('\n✅ PDF generation complete!');
    return pdfBuffer;
  } catch (error) {
    console.error('❌ PDF generation failed:', error);
    throw error;
  }
}

/**
 * Alternative: Use online LaTeX service (fallback if pdflatex not available)
 */
export async function generatePDFViaLatexOnline(
  imagePaths: string[],
  studentName: string
): Promise<Buffer> {
  // This would use an API like latexonline.cc
  // Keeping as a fallback option
  console.warn('Using online LaTeX service (slower, requires internet)');
  throw new Error('Online LaTeX service not yet implemented. Please install pdflatex');
}
