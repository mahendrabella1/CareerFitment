/**
 * Email Service - Send Class 6 Reports to Students
 */

import nodemailer from 'nodemailer';

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send Class 6 report PDF via email
 */
export async function sendClass6ReportEmail(
  studentEmail: string,
  studentName: string,
  pdfBuffer: Buffer
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('Email credentials not configured. Skipping email send.');
      return {
        success: false,
        error: 'Email service not configured'
      };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'reports@onegrasp.com',
      to: studentEmail,
      subject: `Your OneGrasp Career Report - Class 6`,
      html: `
        <html>
          <head>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #2C3E50; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1F3A52 0%, #2C5282 100%); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
              .content { background: #f5f7fa; padding: 20px; border-radius: 8px; line-height: 1.6; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
              .button { display: inline-block; background: #1F3A52; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">🎉 Your Career Report is Ready!</h1>
              </div>

              <div class="content">
                <h2>Hello ${studentName},</h2>

                <p>Thank you for completing the OneGrasp Career Discovery Assessment! We're excited to share your personalized 22-page career report.</p>

                <h3>📊 What's in Your Report:</h3>
                <ul>
                  <li>✅ Your Career Personality & Strengths</li>
                  <li>✅ Career Interests & Matched Domains</li>
                  <li>✅ Learning Style & Emotional Intelligence</li>
                  <li>✅ Top 5 Career Opportunities</li>
                  <li>✅ 15-Year Career Roadmap</li>
                  <li>✅ Personalized Action Plan</li>
                </ul>

                <p><strong>Your personalized report is attached to this email.</strong> Please download and review it at your convenience.</p>

                <h3>📚 Next Steps:</h3>
                <ol>
                  <li>Read through your complete report</li>
                  <li>Discuss it with your parents or teachers</li>
                  <li>Explore the recommended career domains</li>
                  <li>Start your action plan this month!</li>
                </ol>

                <p style="margin: 20px 0; padding: 15px; background: #E8F5E9; border-left: 4px solid #2DCC71; border-radius: 4px;">
                  <strong>💡 Remember:</strong> This report is a guide, not a verdict. Your interests may change as you grow—that's perfectly normal and valuable for your career journey!
                </p>
              </div>

              <div class="footer">
                <p>Questions? Contact us at <strong>support@onegrasp.com</strong></p>
                <p>📞 8977760443 | 🌐 www.onegrasp.com</p>
                <p style="color: #999; margin-top: 20px;">OneGrasp Career Discovery Platform © 2026</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `${studentName.replace(/\s+/g, '_')}_Class6_Career_Report.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Email sent to ${studentEmail}: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Verify email service is configured
 */
export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);
}
