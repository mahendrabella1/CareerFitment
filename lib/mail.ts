/**
 * Server-only: the one SMTP connection every email in the app goes through
 * (code-quality audit Q-03 - it used to be built in eight places). Reads
 * SMTP_HOST, SMTP_PORT (default 465), SMTP_USER and SMTP_PASS; with any of
 * those missing, getMailer() returns null and senders skip quietly, as before.
 *
 * The host is cleaned of anything pasted around it ("https://smtp.x.com:465/"
 * → "smtp.x.com") - env vars often arrive that way and break DNS. The
 * transporter is pooled and reused while the settings stay the same.
 */
import nodemailer, { type SendMailOptions, type Transporter } from "nodemailer";

export interface Mailer {
  transporter: Transporter;
  /** The sending address (SMTP_USER). */
  from: string;
  host: string;
  port: number;
}

export function cleanSmtpHost(raw: string): string {
  return String(raw).replace(/^[a-z]+:\/\//i, "").replace(/[:/].*$/, "").trim();
}

let cached: { key: string; mailer: Mailer } | null = null;

export function getMailer(): Mailer | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const host = cleanSmtpHost(SMTP_HOST);
  const port = Number(SMTP_PORT || 465);
  const key = `${host}:${port}:${SMTP_USER}:${SMTP_PASS.length}`;
  if (cached?.key === key) return cached.mailer;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    pool: true,
    maxConnections: 3,
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 15_000,
  });
  cached = { key, mailer: { transporter, from: SMTP_USER, host, port } };
  return cached.mailer;
}

/** Send one email. Never throws: false when SMTP isn't set up or the send fails (the reason is logged). */
export async function sendMail(options: SendMailOptions, tag = "mail"): Promise<boolean> {
  const m = getMailer();
  if (!m) return false;
  try {
    await m.transporter.sendMail(options);
    return true;
  } catch (err) {
    console.error(`[${tag}] email failed:`, err instanceof Error ? err.message : err);
    return false;
  }
}
