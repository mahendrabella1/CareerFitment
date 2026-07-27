// Internal notification email (to the OneGrasp team, not the student) for a
// captured lead — one shared builder for both lifecycle stages: "unpaid"
// (just registered) and "paid" (fee verified). Best-effort: skips silently
// if SMTP isn't configured, and never throws (a mail outage must never break
// registration or the payment flow).
import nodemailer from "nodemailer";

export interface LeadEmailData {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  institution?: string | null;
  category?: string | null;
  desiredCareer?: string | null;
  city?: string | null;
  age?: string | null;
}

const s = (v: unknown) => (v == null || v === "" ? "—" : String(v));

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

export async function sendLeadNotificationEmail(
  lead: LeadEmailData,
  status: "unpaid" | "paid",
  extra?: { paymentId?: string; amountRupees?: number }
): Promise<void> {
  const t = getTransporter();
  if (!t) return; // SMTP not configured on this deployment — skip silently

  const rows: [string, string][] = [
    ["Name", s(lead.name)],
    ["Email", s(lead.email)],
    ["Phone", s(lead.phone)],
    ["School / College / Company", s(lead.institution)],
    ["Category", s(lead.category)],
    ["Desired career", s(lead.desiredCareer)],
    ["City", s(lead.city)],
    ["Age", s(lead.age)],
  ];
  if (status === "paid") {
    rows.push(["Payment ID", s(extra?.paymentId)]);
    rows.push(["Amount", extra?.amountRupees != null ? `₹${extra.amountRupees.toFixed(2)}` : "—"]);
  }

  const heading = status === "paid" ? "Assessment fee paid ✓" : "New lead — registered, not paid yet";
  const sub = status === "paid"
    ? "A student has paid and started the assessment."
    : "A student has signed up but hasn't completed the assessment fee yet.";

  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#111">
    <h2 style="margin:0 0 6px">${heading}</h2>
    <p style="color:#555;margin:0 0 14px">${sub}</p>
    <table style="border-collapse:collapse">${rows
      .map(([k, v]) => `<tr><td style="padding:5px 16px 5px 0;color:#64748b">${k}</td><td style="font-weight:600">${v}</td></tr>`)
      .join("")}</table></div>`;

  try {
    await t.transporter.sendMail({
      from: `OneGrasp <${t.from}>`,
      to: t.from,
      replyTo: lead.email || undefined,
      subject: `${status === "paid" ? "Assessment fee paid" : "New lead (unpaid)"} — ${s(lead.name) || s(lead.email)}`,
      html,
    });
  } catch (err) {
    console.error("Lead notification email failed:", err instanceof Error ? err.message : err);
  }
}
