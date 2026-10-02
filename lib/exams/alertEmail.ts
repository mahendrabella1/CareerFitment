// Deadline-alert email for a followed exam - same transporter/best-effort
// pattern as lib/studentEmail.ts (no SMTP configured, or a mail outage,
// must never throw into the caller). Simpler template since this is a
// recurring utility notification, not a one-time completion email.
import nodemailer from "nodemailer";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");
const SUPPORT = "support@onegrasp.com";

function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const host = String(SMTP_HOST).replace(/^[a-z]+:\/\//i, "").replace(/[:/].*$/, "").trim();
  const port = Number(SMTP_PORT || 465);
  return {
    transporter: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } }),
    from: SMTP_USER,
  };
}

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export interface ExamDeadlineEmailInput {
  to: string;
  name?: string | null;
  examName: string;
  message: string;
  officialUrl: string;
}

export async function sendExamDeadlineEmail(input: ExamDeadlineEmailInput): Promise<boolean> {
  const t = getTransporter();
  if (!t || !input.to) return false;

  const first = String(input.name || "").trim().split(/\s+/)[0];
  const hello = first ? `Hi ${esc(first)},` : "Hi,";

  const html = `
<div style="background:#f3f5fd;padding:26px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e9ecf4;border-radius:16px;padding:28px 26px">
    <div style="font:700 11px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:#c05f59">Exam deadline reminder</div>
    <h1 style="font:700 21px Arial,sans-serif;color:#0f172a;margin:8px 0 0">${hello}</h1>
    <p style="font:400 14px/1.6 Arial,sans-serif;color:#4b5563;margin:12px 0 0">${esc(input.message)}</p>
    ${input.officialUrl ? `<div style="text-align:center;margin:22px 0 6px"><a href="${esc(input.officialUrl)}" style="display:inline-block;background:#171624;color:#ffffff;font:700 14px Arial,sans-serif;text-decoration:none;padding:12px 24px;border-radius:12px">Open the official site</a></div>` : ""}
    <p style="font:400 12px/1.6 Arial,sans-serif;color:#8a919f;margin:18px 0 0">
      You're getting this because you're following ${esc(input.examName)} on your
      <a href="${SITE_URL}/account/exams" style="color:#3b5bdb;font-weight:700;text-decoration:none">OneGrasp Entrance Exams</a> page.
      Always confirm the exact date on the official site before acting.
    </p>
    <p style="font:400 12px/1.6 Arial,sans-serif;color:#8a919f;margin:10px 0 0">
      Need a hand? Write to <a href="mailto:${SUPPORT}" style="color:#3b5bdb;font-weight:700;text-decoration:none">${SUPPORT}</a>.
    </p>
  </div>
</div>`;

  const text = [hello, "", input.message, input.officialUrl ? `Official site: ${input.officialUrl}` : "", "", `You're following ${input.examName} on ${SITE_URL}/account/exams.`].join("\n");

  try {
    await t.transporter.sendMail({
      from: `OneGrasp <${t.from}>`,
      to: input.to,
      replyTo: SUPPORT,
      subject: `Reminder: ${input.examName} - ${input.message}`,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("Exam deadline email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
