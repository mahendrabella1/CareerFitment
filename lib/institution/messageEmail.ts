// A school's message to a student, also sent by email when the sender ticks
// "Also email". Same transporter/best-effort pattern as lib/studentEmail.ts:
// no SMTP configured, or a mail outage, never fails the send - the message is
// already in the student's inbox on their dashboard either way.
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

export interface MessageEmail {
  to: string;
  institutionName: string;
  title: string;
  body: string;
  link?: string;
}

/** Sends each email; returns how many were accepted. Never throws. */
export async function sendMessageEmails(emails: MessageEmail[]): Promise<number> {
  const t = getTransporter();
  if (!t || !emails.length) return 0;
  let sent = 0;
  for (const m of emails) {
    const url = `${SITE_URL}${m.link && m.link.startsWith("/") ? m.link : "/account"}`;
    try {
      await t.transporter.sendMail({
        from: `"${m.institutionName.replace(/"/g, "")} via OneGrasp" <${t.from}>`,
        replyTo: SUPPORT,
        to: m.to,
        subject: m.title,
        text: `${m.body}\n\nOpen OneGrasp: ${url}\n\n- ${m.institutionName}`,
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0f172a">
  <p style="font-size:12px;color:#64748b;margin:0 0 6px">A message from ${esc(m.institutionName)}</p>
  <h2 style="font-size:20px;margin:0 0 12px">${esc(m.title)}</h2>
  <p style="font-size:15px;line-height:1.6;white-space:pre-line">${esc(m.body)}</p>
  <p style="margin:22px 0"><a href="${esc(url)}" style="background:#e11d48;color:#fff;text-decoration:none;font-weight:700;padding:11px 20px;border-radius:9px;display:inline-block">Open OneGrasp</a></p>
  <p style="font-size:12px;color:#94a3b8">Sent by ${esc(m.institutionName)} through OneGrasp Career Fitment.</p>
</div>`,
      });
      sent++;
    } catch {
      // Best effort: the message is in the student's inbox regardless.
    }
  }
  return sent;
}
