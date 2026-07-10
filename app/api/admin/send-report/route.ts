import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdmin } from "@/lib/auth/admins";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";
import { DOMAINS, categoryDeepDive, roadmap, stageLabelOf } from "@/lib/report/knowledge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30; // give the SMTP handshake room on serverless

// Public Firebase web API key (safe to expose) — used to verify the caller's
// ID token via the Firebase Auth REST API (no admin SDK / service account).
const FIREBASE_API_KEY = "AIzaSyA3fUy9CkpoNf-vjrhswJQNwqy0qSr2cL0";

function fail(message: string, status = 400) {
  return NextResponse.json({ success: false, message, data: null }, { status });
}

/** Verify a Firebase ID token and return the email if it belongs to an admin. */
async function verifyAdminEmail(idToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );
    const data = (await res.json()) as { users?: { email?: string }[] };
    const email = data?.users?.[0]?.email ?? null;
    return email && isAdmin(email) ? email : null;
  } catch {
    return null;
  }
}

function esc(s: string): string {
  return String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] || c));
}

function reportHtml(name: string, a: AssessmentSummary): string {
  const domains = (a.themes ?? [])
    .filter((t) => t.score > 0 && DOMAINS[t.letter])
    .slice(0, 3)
    .map((t) => ({ ...DOMAINS[t.letter], fit: Math.round(t.score) }));
  const top = domains[0] || DOMAINS.B;

  const bar = (label: string, score: number, color = "#4f6b9e") =>
    `<tr><td style="padding:5px 8px 5px 0;font-size:12.5px;color:#334155;white-space:nowrap">${esc(label)}</td>
      <td style="padding:5px 0;width:100%"><div style="background:#eef1f5;border-radius:6px;height:9px"><div style="width:${Math.max(4, Math.min(100, Math.round(score)))}%;background:${color};height:9px;border-radius:6px"></div></div></td>
      <td style="padding:5px 0 5px 8px;font-size:12.5px;font-weight:700;color:#0f172a;text-align:right">${Math.round(score)}</td></tr>`;
  const scores = (a.radar ?? []).map((r) => bar(r.label, r.score)).join("");

  const domainBlock = domains.map((d, i) => `
    <div style="border:1px solid #e6e9ef;border-radius:12px;padding:16px;margin-bottom:12px">
      <div style="font-size:12px;color:#64748b;font-weight:700">#${i + 1} best fit${d.fit ? ` · ${d.fit}%` : ""}</div>
      <div style="font-size:17px;font-weight:800;color:#0f172a;margin:2px 0 4px">${esc(d.name)}</div>
      <div style="font-size:13px;color:#475569;line-height:1.55">${esc(d.whatItIs)}</div>
      <table style="width:100%;border-collapse:collapse;margin-top:10px">
        <tr><td style="font-size:12px;color:#64748b;padding:3px 0;width:70px">India</td><td style="font-size:12.5px;color:#0f172a;font-weight:600;padding:3px 0">${esc(d.salaryIndia)}</td></tr>
        <tr><td style="font-size:12px;color:#64748b;padding:3px 0">Abroad</td><td style="font-size:12.5px;color:#0f172a;font-weight:600;padding:3px 0">${esc(d.salaryAbroad)}</td></tr>
      </table>
      <div style="margin-top:8px">${d.links.slice(0, 2).map((l) => `<a href="${l.url}" style="font-size:12px;color:#3f5b8b;text-decoration:none;margin-right:12px">${esc(l.label)} &rarr;</a>`).join("")}</div>
    </div>`).join("");

  const recs = (a.radar ?? []).slice(0, 4).map((r) => {
    const dd = categoryDeepDive(r.key, a);
    return dd.next ? `<li style="margin-bottom:6px;font-size:13px;color:#475569;line-height:1.5"><b>${esc(r.label)}:</b> ${esc(dd.next)}</li>` : "";
  }).join("");

  const phases = roadmap(stageLabelOf(a.journeyCode), top.name)
    .map((p) => `<tr><td style="padding:8px 12px 8px 0;font-size:12px;font-weight:800;color:#4f6b9e;white-space:nowrap;vertical-align:top">${esc(p.period)}</td><td style="padding:8px 0;font-size:13px;color:#334155"><b>${esc(p.title)}</b><br><span style="color:#64748b;font-size:12.5px">${esc(p.points[0])}</span></td></tr>`)
    .join("");

  return `<div style="font-family:Inter,Arial,sans-serif;max-width:660px;margin:auto;color:#1e293b;background:#f6f7f9;padding:16px">
    <div style="background:linear-gradient(135deg,#2f4062,#5a76a6);color:#fff;padding:26px;border-radius:14px 14px 0 0">
      <div style="font-size:12px;opacity:.85;text-transform:uppercase;letter-spacing:1px">OneGrasp · Career Report</div>
      <div style="font-size:22px;font-weight:800;margin-top:8px;line-height:1.25">Hi ${esc(name || "there")}, your best-fit direction is ${esc(top.name)}.</div>
      ${a.overallFitmentPct != null ? `<div style="margin-top:8px;font-size:13px;opacity:.92">${a.overallFitmentPct}% top fit${a.outcomeLabel ? ` · ${esc(a.outcomeLabel)}` : ""}</div>` : ""}
    </div>
    <div style="border:1px solid #e6e9ef;border-top:none;background:#fff;padding:24px">
      ${a.summary ? `<p style="color:#475569;line-height:1.6;font-size:14px;margin:0 0 18px">${esc(a.summary)}</p>` : ""}

      <h3 style="margin:0 0 8px;font-size:15px;color:#0f172a">Your profile at a glance</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px">${scores}</table>

      <h3 style="margin:0 0 10px;font-size:15px;color:#0f172a">Best-fit career domains</h3>
      ${domainBlock || "<p style='color:#94a3b8'>—</p>"}

      ${recs ? `<h3 style="margin:18px 0 8px;font-size:15px;color:#0f172a">Your next steps</h3><ul style="margin:0;padding-left:18px">${recs}</ul>` : ""}

      <h3 style="margin:20px 0 8px;font-size:15px;color:#0f172a">Your next 20 years</h3>
      <table style="width:100%;border-collapse:collapse">${phases}</table>

      <p style="margin-top:22px;font-size:12px;color:#94a3b8;line-height:1.5">Generated from your OneGrasp career assessment. Sign in to your dashboard for the full interactive report with per-dimension detail, how-to-join guides and salary breakdowns. This report is a guide, not a verdict.</p>
    </div>
  </div>`;
}

export async function POST(req: Request) {
  let body: { idToken?: string; to?: string; name?: string; report?: AssessmentSummary };
  try {
    body = await req.json();
  } catch {
    return fail("Invalid JSON body");
  }

  if (!body.idToken) return fail("Missing auth token", 401);
  const adminEmail = await verifyAdminEmail(body.idToken);
  if (!adminEmail) return fail("Not authorised (admin only)", 403);

  if (!body.to || !body.report) return fail("Missing recipient or report");

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  const missing = [
    !SMTP_HOST && "SMTP_HOST",
    !SMTP_USER && "SMTP_USER",
    !SMTP_PASS && "SMTP_PASS",
  ].filter(Boolean);
  if (missing.length) {
    return fail(
      `Email not configured on this deployment — missing ${missing.join(", ")}. ` +
        `Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in Vercel → Settings → Environment Variables, then REDEPLOY.`,
      500
    );
  }

  // Sanitize the host — env vars sometimes get a protocol/path/port pasted in
  // (e.g. "https://smtp.hostinger.com"), which breaks DNS. Keep the bare host.
  const host = String(SMTP_HOST).replace(/^[a-z]+:\/\//i, "").replace(/[:/].*$/, "").trim();
  const port = Number(SMTP_PORT || 465);
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
  });

  // Verify connection/credentials first so failures return a clear reason.
  try {
    await transporter.verify();
  } catch (e) {
    const err = e as { code?: string; message?: string };
    return fail(
      `Could not connect to ${host}:${port} — ${err.code || ""} ${err.message || "connection failed"}. ` +
        `SMTP_HOST must be just "smtp.hostinger.com" (no https://). Check the password and that port ${port} matches (465 = SSL, 587 = TLS).`,
      502
    );
  }

  try {
    await transporter.sendMail({
      from: `OneGrasp <${SMTP_USER}>`,
      to: body.to,
      subject: "Your OneGrasp career report",
      html: reportHtml(body.name ?? "", body.report),
    });
    return NextResponse.json({ success: true, message: "Report emailed", data: { to: body.to } });
  } catch (e) {
    const err = e as { code?: string; message?: string };
    return fail(`Send failed — ${err.code || ""} ${err.message || "unknown error"}`, 500);
  }
}
