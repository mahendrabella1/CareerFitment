import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendCredentialsEmail(
  email: string,
  name: string,
  password: string,
  loginUrl: string
): Promise<void> {
  const transporter = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px; }
          .credentials { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; font-family: monospace; }
          .button { background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to OneGrasp Assessment! 🎯</h1>
          </div>

          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>

            <p>Thank you for registering with OneGrasp! We're excited to help you discover your career path and personality insights.</p>

            <p><strong>Your Login Credentials:</strong></p>
            <div class="credentials">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Password:</strong> ${password}</p>
            </div>

            <p><strong>Important:</strong> Please change your password after your first login for security.</p>

            <p>To get started, click the button below to log in and begin your assessment:</p>

            <a href="${loginUrl}" class="button">Login to OneGrasp</a>

            <p style="margin-top: 20px;">If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>

            <p>Best regards,<br><strong>The OneGrasp Team</strong></p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© 2024 OneGrasp. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const options: EmailOptions = {
    to: email,
    subject: `Welcome to OneGrasp - Your Login Credentials`,
    html,
  };

  await transporter.sendMail(options);
}

export async function sendReportEmail(
  email: string,
  name: string,
  reportPdfBuffer: Buffer,
  dashboardUrl: string
): Promise<void> {
  const transporter = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px; }
          .button { background: #22C55E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
          .highlight { background: #f0f9ff; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Assessment Report is Ready! 📊</h1>
          </div>

          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>

            <p>Thank you for completing your OneGrasp assessment! We're thrilled with your participation.</p>

            <div class="highlight">
              <p><strong>Your comprehensive career and personality report has been generated and is attached to this email.</strong></p>
              <p>The report includes insights into your:</p>
              <ul>
                <li>Personality traits and MBTI type</li>
                <li>Career interests and suitable paths</li>
                <li>Strengths and development areas</li>
                <li>Personalized recommendations</li>
              </ul>
            </div>

            <p>You can also view your complete profile and dashboard anytime:</p>

            <a href="${dashboardUrl}" class="button">View Your Dashboard</a>

            <p style="margin-top: 20px;">If you have any questions about your results or would like to explore further, our team is here to help!</p>

            <p>Best regards,<br><strong>The OneGrasp Team</strong></p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© 2024 OneGrasp. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const options: EmailOptions = {
    to: email,
    subject: `Your OneGrasp Assessment Report is Ready`,
    html,
    attachments: [
      {
        filename: `OneGrasp-Report-${Date.now()}.pdf`,
        content: reportPdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(options);
}

export async function sendInstitutionalWelcomeEmail(
  email: string,
  name: string,
  schoolName: string,
  loginUrl: string
): Promise<void> {
  const transporter = getTransporter();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; }
          .content { padding: 20px; border: 1px solid #ddd; border-radius: 5px; margin-top: 20px; }
          .price-box { background: #f0f9ff; padding: 15px; border-radius: 5px; margin: 15px 0; text-align: center; border: 2px solid #667eea; }
          .price { font-size: 32px; font-weight: bold; color: #667eea; }
          .price-label { color: #666; font-size: 14px; }
          .button { background: #22C55E; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; font-weight: bold; }
          .footer { margin-top: 20px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to OneGrasp! 🎯</h1>
            <p>Supported by ${schoolName}</p>
          </div>

          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>

            <p>Welcome! Your school has partnered with OneGrasp to help you discover your career path and understand your personality better.</p>

            <div class="price-box">
              <div class="price">₹5,999</div>
              <div class="price-label">Assessment Value</div>
              <p style="margin: 10px 0 0 0; color: #22C55E; font-weight: bold;">✓ Provided Free by Your Institution</p>
            </div>

            <p><strong>What's Included:</strong></p>
            <ul>
              <li>Comprehensive Career Assessment</li>
              <li>Personality Profile & MBTI Analysis</li>
              <li>Personalized Career Recommendations</li>
              <li>Detailed Growth Insights</li>
              <li>Professional Report (PDF)</li>
            </ul>

            <p>Click below to get started:</p>

            <a href="${loginUrl}" class="button">Start Assessment</a>

            <p style="margin-top: 20px; color: #666; font-size: 14px;"><strong>Note:</strong> Your session will automatically log you out after 24 hours of inactivity for security.</p>

            <p>If you have any questions, please reach out to your school's academic counselor.</p>

            <p>Best regards,<br><strong>The OneGrasp Team</strong></p>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>© 2024 OneGrasp. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const options: EmailOptions = {
    to: email,
    subject: `Welcome to OneGrasp - Free Assessment from ${schoolName}`,
    html,
  };

  await transporter.sendMail(options);
}
