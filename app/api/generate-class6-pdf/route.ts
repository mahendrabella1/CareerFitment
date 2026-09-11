/**
 * API Route: Generate Class 6 LaTeX PDF
 * POST /api/generate-class6-pdf
 *
 * Generates a complete 22-page professional PDF report for Class 6 students
 */

import { NextResponse } from 'next/server';
import { generateClass6PDFBuffer } from '@/lib/report/class6LatexPdf';
import type { Class6ScoreOutput } from '@/lib/newAssessment/class6Scoring';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes timeout for PDF generation

interface RequestBody {
  studentName: string;
  studentEmail: string;
  studentAge: number;
  completedDate: string; // ISO date string
  output: Class6ScoreOutput;
}

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    // Validate required fields
    if (!body.studentName || !body.studentEmail || !body.output) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: studentName, studentEmail, output'
        },
        { status: 400 }
      );
    }

    console.log(`\n📊 Generating Class 6 PDF for: ${body.studentName}`);

    // Generate PDF
    const pdfBuffer = await generateClass6PDFBuffer(
      body.studentName,
      body.studentEmail,
      body.studentAge || 12,
      new Date(body.completedDate || new Date()),
      body.output
    );

    // Return PDF as binary
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${body.studentName.replace(/\s+/g, '_')}_Class6_Report.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (error) {
    console.error('❌ PDF generation failed:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);

    // Check if error is due to LaTeX not being installed
    if (errorMessage.includes('pdflatex') || errorMessage.includes('LaTeX')) {
      return NextResponse.json(
        {
          success: false,
          message: 'LaTeX is not installed on the server. Please install pdflatex (texlive-latex-base).',
          error: errorMessage,
          installation_hint: 'Run: apt-get install texlive-latex-base texlive-fonts-recommended'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate PDF',
        error: errorMessage
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for testing
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Class 6 LaTeX PDF Generator API',
    endpoint: 'POST /api/generate-class6-pdf',
    body_example: {
      studentName: 'John Doe',
      studentEmail: 'john@example.com',
      studentAge: 12,
      completedDate: new Date().toISOString(),
      output: 'Class6ScoreOutput object from assessment'
    }
  });
}
