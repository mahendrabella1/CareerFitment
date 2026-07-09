import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { isAdmin } from "@/lib/auth/admins";
import type { AssessmentSummary } from "@/lib/auth/AuthProvider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function reportHtml(name: string, a: AssessmentSummary): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#64748b;font-size:13px">${label}</td><td style="padding:6px 0;text-align:right;font-weight:700;color:#0f172a;font-size:13px">${value}</td></tr>`;
  const matches = (a.matches ?? [])
    .slice(0, 5)
    .map(
      (m, i) =>
        `<div style="padding:8px 0;border-top:1px solid #f1f5f9"><b>${i + 1}. ${m.title}</b> <span style="color:#3b4a9c;font-weight:700">${m.fitmentPct}% · ${m.band}</span>${m.blurb ? `<div style="color:#64748b;font-size:12px;margin-top:3px">${m.blurb}</div>` : ""}</div>`
    )
    .join("");
  const strengths = (a.topStrengths ?? [])
    .slice(0, 8)
    .map((s) => `<span style="display:inline-block;background:#eef2ff;color:#312e81;border-radius:999px;padding:4px 11px;font-size:12px;margin:3px 4px 0 0">${s.subTraitName}</span>`)
    .join("");

  return `<div style="font-family:Inter,Arial,sans-serif;max-width:640px;margin:auto;color:#1e293b">
    <div style="background:linear-gradient(135deg,#3b4a9c,#5a6fce);color:#fff;padding:26px;border-radius:14px 14px 0 0">
      <div style="font-size:13px;opacity:.85;text-transform:uppercase;letter-spacing:1px">OneGrasp · Career Report</div>
      <div style="font-size:24px;font-weight:800;margin-top:6px">${name || "Your"} career report</div>
      <div style="opacity:.9;font-size:13px;margin-top:4px">${a.journeyName}</div>
    </div>
    <div style="border:1px solid #e6e9ef;border-top:none;border-radius:0 0 14px 14px;padding:24px;background:#fff">
      ${a.outcomeLabel ? `<h3 style="margin:0 0 6px">${a.outcomeLabel}</h3>` : ""}
      ${a.summary ? `<p style="color:#475569;line-height:1.6;font-size:14px">${a.summary}</p>` : ""}
      <table style="width:100%;border-collapse:collapse;margin:14px 0">
        ${row("Top career", a.topCareer ?? "—")}
        ${row("Overall fit", a.overallFitmentPct != null ? a.overallFitmentPct + "%" : "—")}
        ${a.riasecCode ? row("Interest code", a.riasecCode) : ""}
      </table>
      <h4 style="margin:16px 0 4px">Top career matches</h4>
      ${matches || "<p style='color:#94a3b8'>—</p>"}
      ${strengths ? `<h4 style="margin:18px 0 6px">Top strengths</h4>${strengths}` : ""}
      <p style="margin-top:22px;font-size:12px;color:#94a3b8">This report was generated from your OneGrasp career assessment.</p>
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
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return fail("Email is not configured on this deployment (missing SMTP_* env vars).", 500);
  }

  try {
    const port = Number(SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: `OneGrasp <${SMTP_USER}>`,
      to: body.to,
      subject: "Your OneGrasp career report",
      html: reportHtml(body.name ?? "", body.report),
    });

    return NextResponse.json({ success: true, message: "Report emailed", data: { to: body.to } });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to send email", 500);
  }
}
