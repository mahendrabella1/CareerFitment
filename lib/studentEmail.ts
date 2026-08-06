// Email sent TO THE STUDENT (not the team — that's lib/leadEmail.ts) the moment
// they finish the assessment.
//
// It exists because most students submit, close the tab, and come back days
// later with no idea how to get back in. The on-screen completion card says all
// of this, but a card disappears the moment the tab does; an email does not.
//
// What it deliberately does NOT contain is the password. Firebase stores only a
// hash, so nothing in this system can read one back, and mailing credentials in
// plain text would be the wrong thing to do even if we could. The email carries
// the half we can safely state — the account's email address and where to sign
// in — and points at the reset link for the other half.
//
// Best-effort throughout: no SMTP configured, or a mail outage, must never turn
// into a failed assessment submission.
import nodemailer from "nodemailer";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://careerfitment.onegrasp.com").replace(/\/+$/, "");
const SUPPORT = "support@onegrasp.com";
const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

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

/** Escape anything that came from the student before it goes into HTML. */
const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

export interface CompletionEmailInput {
  /** Where to send. Resolved from the caller's ID token, never from the body. */
  to: string;
  name?: string | null;
  /** Shown as a headline result when scoring produced one. */
  topCareer?: string | null;
}

const STEPS = [
  ["Open the sign-in page", `Go to <a href="${SITE_URL}/signin" style="color:#3b5bdb;font-weight:600">${SITE_URL.replace(/^https?:\/\//, "")}/signin</a> — bookmark it now and you'll never have to hunt for it.`],
  ["Enter your registered email", "This is the address this message arrived at."],
  ["Enter the password you created when you registered", `Forgotten it? Click <b>Forgot password?</b> on that page and we'll email you a reset link straight away.`],
  ["Open your dashboard", "Your career matches, all eight dimensions, strengths and next steps are saved there permanently."],
];

export async function sendAssessmentCompletionEmail(input: CompletionEmailInput): Promise<boolean> {
  const t = getTransporter();
  if (!t || !input.to) return false;

  const first = String(input.name || "").trim().split(/\s+/)[0];
  const hello = first ? `Thank you, ${esc(first)}.` : "Thank you.";

  const stepsHtml = STEPS.map(
    ([title, detail], i) => `
      <tr>
        <td style="padding:0 12px 14px 0;vertical-align:top">
          <div style="width:26px;height:26px;border-radius:13px;background:#eef2ff;color:#3b5bdb;font:700 13px Arial,sans-serif;text-align:center;line-height:26px">${i + 1}</div>
        </td>
        <td style="padding:0 0 14px 0;vertical-align:top">
          <div style="font:700 14px Arial,sans-serif;color:#0f172a">${title}</div>
          <div style="font:400 13px/1.55 Arial,sans-serif;color:#5b6474;margin-top:2px">${detail}</div>
        </td>
      </tr>`
  ).join("");

  const html = `
<div style="background:#f3f5fd;padding:26px 12px;font-family:Arial,Helvetica,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e9ecf4;border-radius:16px;padding:30px 30px 26px">
    <img src="${LOGO}" alt="OneGrasp" height="34" style="height:34px;display:block;margin:0 auto 20px" />

    <div style="text-align:center">
      <div style="width:62px;height:62px;border-radius:31px;background:#16a34a;color:#ffffff;font:700 30px Arial,sans-serif;line-height:62px;margin:0 auto 14px">&#10003;</div>
      <div style="font:700 11px Arial,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#16a34a">Assessment submitted</div>
      <h1 style="font:700 25px Arial,sans-serif;color:#0f172a;margin:8px 0 0">${hello}</h1>
      <p style="font:400 14px/1.65 Arial,sans-serif;color:#4b5563;margin:12px 0 0">
        Your responses have been recorded successfully and your personalised career
        report is being prepared.${input.topCareer ? ` Your strongest match came out as <b style="color:#0f172a">${esc(input.topCareer)}</b>.` : ""}
      </p>
    </div>

    <div style="background:#f2f6ff;border:1px solid #dde6fb;border-radius:12px;padding:13px 15px;margin:22px 0;font:400 13px/1.55 Arial,sans-serif;color:#334155">
      Your full report is saved to your OneGrasp dashboard permanently, and our team
      will email you a copy shortly.
    </div>

    <div style="background:#fbfcff;border:1px solid #e6eaf5;border-radius:14px;padding:16px 18px">
      <div style="font:700 15px Arial,sans-serif;color:#0f172a;margin-bottom:10px">Your login details</div>
      <table style="width:100%;border-collapse:collapse;font:400 13.5px Arial,sans-serif">
        <tr><td style="padding:7px 0;color:#7b8496;border-top:1px solid #edf0f7">Sign-in page</td>
            <td style="padding:7px 0;text-align:right;border-top:1px solid #edf0f7"><a href="${SITE_URL}/signin" style="color:#3b5bdb;font-weight:700;text-decoration:none">${SITE_URL.replace(/^https?:\/\//, "")}/signin</a></td></tr>
        <tr><td style="padding:7px 0;color:#7b8496;border-top:1px solid #edf0f7">Email</td>
            <td style="padding:7px 0;text-align:right;font-weight:700;color:#0f172a;word-break:break-all">${esc(input.to)}</td></tr>
        <tr><td style="padding:7px 0;color:#7b8496;border-top:1px solid #edf0f7">Password</td>
            <td style="padding:7px 0;text-align:right;color:#5b6474">The one you created at registration</td></tr>
      </table>
      <p style="font:400 12px/1.6 Arial,sans-serif;color:#6b7280;background:#ffffff;border:1px dashed #dfe4ef;border-radius:10px;padding:10px 12px;margin:12px 0 0">
        <b style="color:#3d4657">We never display or email your password.</b> It is stored only in an
        encrypted form that nobody at OneGrasp can read — including us. If you've forgotten it,
        use <b>Forgot password?</b> on the sign-in page and you'll be back in within a minute.
      </p>
    </div>

    <div style="font:700 11px Arial,sans-serif;letter-spacing:1.2px;text-transform:uppercase;color:#8a919f;margin:24px 0 12px">
      How to log in to your dashboard
    </div>
    <table style="width:100%;border-collapse:collapse">${stepsHtml}</table>

    <div style="text-align:center;margin:22px 0 6px">
      <a href="${SITE_URL}/signin" style="display:inline-block;background:#171624;color:#ffffff;font:700 15px Arial,sans-serif;text-decoration:none;padding:14px 30px;border-radius:12px">Go to my dashboard</a>
    </div>

    <p style="font:400 12px/1.6 Arial,sans-serif;color:#8a919f;text-align:center;margin:16px 0 0">
      Need a hand? Write to <a href="mailto:${SUPPORT}" style="color:#3b5bdb;font-weight:700;text-decoration:none">${SUPPORT}</a> — we usually reply the same day.
    </p>
  </div>
  <p style="font:400 11px Arial,sans-serif;color:#9aa1ad;text-align:center;margin:16px 0 0">
    &copy; ${new Date().getFullYear()} OneGrasp &middot; Career fitment, backed by science
  </p>
</div>`;

  const text = [
    hello.replace(/<[^>]+>/g, ""),
    "",
    "Your responses have been recorded successfully and your personalised career report is being prepared.",
    "",
    "YOUR LOGIN DETAILS",
    `Sign-in page: ${SITE_URL}/signin`,
    `Email: ${input.to}`,
    "Password: the one you created at registration.",
    "",
    "We never display or email your password — it is stored only in an encrypted form",
    "that nobody at OneGrasp can read. Forgotten it? Use \"Forgot password?\" on the",
    "sign-in page and we'll email you a reset link.",
    "",
    "HOW TO LOG IN",
    ...STEPS.map(([title, detail], i) => `${i + 1}. ${title} — ${detail.replace(/<[^>]+>/g, "")}`),
    "",
    `Need a hand? Write to ${SUPPORT}.`,
  ].join("\n");

  try {
    await t.transporter.sendMail({
      from: `OneGrasp <${t.from}>`,
      to: input.to,
      replyTo: SUPPORT,
      subject: "Your OneGrasp assessment is complete — here's how to see your report",
      html,
      text,
    });
    return true;
  } catch (err) {
    console.error("Completion email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
