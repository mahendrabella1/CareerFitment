/**
 * Report Integration Helper
 * Quick functions to integrate assessment → report in your components
 */

/**
 * Navigate to report after assessment completion
 * Usage: Call this after saving assessment responses
 */
export function navigateToReport(assessmentId: string, router: any) {
  router.push(`/account/assessment-report?assessmentId=${assessmentId}`);
}

/**
 * Generate report data directly (no API call)
 * Usage: When you have scoring output in memory
 */
export async function generateReportInMemory(
  studentName: string,
  grade: "11" | "12",
  responses: any
) {
  const { scoreClass11Assessment } = await import("@/lib/newAssessment/scoring11_12");
  const { generateClass1112Report } = await import("@/lib/report/generateClass1112Report");

  // Score the assessment
  const scoreOutput = scoreClass11Assessment(responses);

  // Generate report
  const report = generateClass1112Report(studentName, grade, scoreOutput);

  return report;
}

/**
 * Export report as PDF
 * Usage: Call when user clicks "Download PDF"
 */
export async function exportReportAsPDF(
  reportData: any,
  fileName: string = "Assessment-Report.pdf"
) {
  try {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("report-container");
    if (!element) {
      throw new Error("Report container not found");
    }

    const options = {
      margin: 10,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "portrait", unit: "mm", format: "a4" }
    };

    html2pdf().set(options).from(element).save();
  } catch (error) {
    console.error("Error exporting PDF:", error);
    throw error;
  }
}

/**
 * Share report via email
 * Usage: When user clicks "Share" button
 */
export async function shareReportViaEmail(
  studentEmail: string,
  studentName: string,
  reportId: string
) {
  try {
    const response = await fetch("/api/report/share", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        studentEmail,
        studentName,
        reportId,
        reportUrl: `${window.location.origin}/account/assessment-report?assessmentId=${reportId}`
      })
    });

    if (!response.ok) {
      throw new Error("Failed to share report");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sharing report:", error);
    throw error;
  }
}

/**
 * Get report by assessment ID
 * Usage: For re-viewing reports
 */
export async function getReport(assessmentId: string) {
  try {
    const response = await fetch(`/api/assessment/${assessmentId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch assessment");
    }

    const assessmentData = await response.json();
    const { scoreClass11Assessment } = await import("@/lib/newAssessment/scoring11_12");
    const { generateClass1112Report } = await import("@/lib/report/generateClass1112Report");

    // Score and generate report
    const scoreOutput = scoreClass11Assessment(assessmentData.responses);
    const report = generateClass1112Report(
      assessmentData.studentName,
      assessmentData.grade,
      scoreOutput
    );

    return report;
  } catch (error) {
    console.error("Error getting report:", error);
    throw error;
  }
}

/**
 * Track report viewing/interaction
 * Usage: Call when user opens/interacts with report
 */
export async function trackReportInteraction(
  assessmentId: string,
  action: "view" | "download" | "share" | "print"
) {
  try {
    await fetch("/api/report/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId,
        action,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error("Error tracking interaction:", error);
    // Don't throw - this is non-critical logging
  }
}

/**
 * Get similar student profiles
 * Usage: Show "Students like you" section
 */
export async function getSimilarProfiles(studentProfile: any) {
  try {
    const response = await fetch("/api/report/similar-profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentProfile)
    });

    if (!response.ok) {
      throw new Error("Failed to fetch similar profiles");
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting similar profiles:", error);
    return [];
  }
}

/**
 * Submit feedback on report
 * Usage: Feedback form after viewing report
 */
export async function submitReportFeedback(
  assessmentId: string,
  feedback: {
    accuracy: number; // 1-5
    usefulness: number; // 1-5
    comments: string;
    followUpAction?: string;
  }
) {
  try {
    const response = await fetch("/api/report/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assessmentId,
        ...feedback,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error("Failed to submit feedback");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}
