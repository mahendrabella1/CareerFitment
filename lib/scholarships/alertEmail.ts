// Deadline-alert email for a followed/matched scholarship - same
// transporter/best-effort pattern as lib/exams/alertEmail.ts.
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

export interface ScholarshipDeadlineEmailInput {
  to: string;
  name?: string | null;
  scholarshipName: string;
  message: string;
  officialUrl: string;
}

export async function sendScholarshipDeadlineEmail(input: ScholarshipDeadlineEmailInput): Promise<boolean> {
  const t = getTransporter();
  if (!t || !input.to) return false;

  const first = String(input.name || "").trim().split(/\s+/)[0];
  const hello = first ? `Hi ${esc(first)},` : "Hi,";

  const html = `
<div style="background:#f3f5fd;padding:26px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#ffffff;border:1px solid #e9ecf4;border-radius:16px;padding:28px 26px">
    <div style="font:700 11px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:#166534">Scholarship deadline reminder</div>
    <h1 style="font:700 21px Arial,sans-serif;color:#0f172a;margin:8px 0 0">${hello}</h1>
    <p style="font:400 14px/1.6 Arial,sans-serif;color:#4b5563;margin:12px 0 0">${esc(input.message)}</p>
    ${input.officialUrl ? `<div style="text-align:center;margin:22px 0 6px"><a href="${esc(input.officialUrl)}" style="display:inline-block;background:#171624;color:#ffffff;font:700 14px Arial,sans-serif;text-decoration:none;padding:12px 24px;border-radius:12px">Open the official site</a></div>` : ""}
    <p style="font:400 12px/1.6 Arial,sans-serif;color:#8a919f;margin:18px 0 0">
      You're getting this because ${esc(input.scholarshipName)} matched your profile on your
      <a href="${SITE_URL}/account/scholarships" style="color:#3b5bdb;font-weight:700;text-decoration:none">OneGrasp Scholarships</a> page.
      Genuine scholarships never ask you to pay to receive money - always confirm on the official site.
    </p>
    <p style="font:400 12px/1.6 Arial,sans-serif;color:#8a919f;margin:10px 0 0">
      Need a hand? Write to <a href="mailto:${SUPPORT}" style="color:#3b5bdb;font-weight:700;text-decoration:none">${SUPPORT}</a>.
    </p>
  </div>
</div>`;

  const text = [hello, "", input.message, input.officialUrl ? `Official site: ${input.officialUrl}` : "", "", `${input.scholarshipName} matched your profile on ${SITE_URL}/account/scholarships.`].join("\n");

  try {
    await t.transporter.sendMail({
      from: `OneGrasp <${t.from}>`,
      to: input.to,
      replyTo: SUPPORT,
      subject: `Reminder: ${input.scholarshipName} - ${input.message}`,
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("Scholarship deadline email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
