/**
 * Spotlight requests on the server. One transaction saves the request
 * (boosterRequests/{ref}, server-only), counts it against the day's cap and
 * adds it to the student's own list (users/{uid}.boosterRequests, an
 * admin-only field). Then it's emailed to the team inbox with the student as
 * Reply-To and their file attached. The email is best-effort - the saved copy
 * is the record, and the page tells the student if the email didn't go.
 */
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import type { Firestore } from "firebase-admin/firestore";
import { ApiError } from "@/lib/institution/server";
import { dayKey } from "@/lib/progress/activity";
import { FORMS, SERVICES, issnAllowed, type FormId } from "./catalog";

export const DAILY_LIMIT = 8;
const KEEP = 20;
const TEAM_INBOX = (process.env.TEAM_NOTIFY_EMAIL || "support@onegrasp.com").trim();

export interface BoosterRef { id: string; form: FormId; title: string; at: number }
export interface Attachment { filename: string; content: Buffer; contentType: string }

interface Saved extends BoosterRef {
  data: Record<string, string>;
  who: { name: string; email: string; phone: string; category: string; institution: string };
}

/** "SP-7K3QX9" - short enough to read out on a call. */
function newRef(): string {
  const abc = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `SP-${[...randomBytes(6)].map((b) => abc[b % abc.length]).join("")}`;
}

/** The key detail of a request, for the student's list ("Abstract: <title>"). */
function headline(formId: FormId, data: Record<string, string>): string {
  const main = data.title || data.conference || data.work || "";
  return (main ? `${FORMS[formId].title}: ${main}` : FORMS[formId].title).slice(0, 160);
}

export async function saveRequest(db: Firestore, uid: string, signInEmail: string, formId: FormId, data: Record<string, string>, file: { name: string; size: number } | null): Promise<Saved> {
  const userRef = db.collection("users").doc(uid);
  const usageRef = db.collection("boosterUsage").doc(`${uid}_${dayKey()}`);
  const id = newRef();
  const reqRef = db.collection("boosterRequests").doc(id);
  const at = Date.now();
  return db.runTransaction(async (tx) => {
    const [user, usage] = await Promise.all([tx.get(userRef), tx.get(usageRef)]);
    const p = (user.data() ?? {}) as Record<string, unknown>;
    const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
    const who = { name: str(p.name), email: str(p.email) || signInEmail, phone: str(p.phone), category: str(p.category), institution: str(p.institution) };
    if (FORMS[formId].service === "issn" && !issnAllowed(who.category)) throw new ApiError(403, "ISSN help is for undergraduates and working professionals.");
    const n = Number(usage.get("n") ?? 0);
    if (n >= DAILY_LIMIT) throw new ApiError(429, `That's ${DAILY_LIMIT} requests today - the team will reply to those first. You can also email ${TEAM_INBOX}.`);

    const ref: BoosterRef = { id, form: formId, title: headline(formId, data), at };
    const list = Array.isArray(p.boosterRequests) ? (p.boosterRequests as BoosterRef[]) : [];
    tx.create(reqRef, { uid, ...ref, service: FORMS[formId].service, data, who, file: file ?? null, emailed: false, status: "new" });
    tx.set(usageRef, { uid, n: n + 1, at }, { merge: true });
    tx.set(userRef, { boosterRequests: [ref, ...list].slice(0, KEEP) }, { merge: true });
    return { ...ref, data, who };
  });
}

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const host = String(SMTP_HOST).replace(/^[a-z]+:\/\//i, "").replace(/[:/].*$/, "").trim();
  const port = Number(SMTP_PORT || 465);
  return { mail: nodemailer.createTransport({ host, port, secure: port === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } }), from: SMTP_USER };
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Emails the request to the team. Returns false (never throws) when SMTP isn't set up or the send fails. */
export async function emailRequest(r: Saved, file: Attachment | null): Promise<boolean> {
  const t = transport();
  if (!t) return false;
  const spec = FORMS[r.form];
  const service = SERVICES.find((s) => s.id === spec.service)?.title ?? spec.service;
  const rows: [string, string][] = [
    ["Reference", r.id],
    ["Service", `${service} - ${spec.title}`],
    ["Name", r.who.name || "-"],
    ["Email", r.who.email || "-"],
    ["Phone", r.who.phone || "-"],
    ["Class / stage", r.who.category || "-"],
    ["School / college / company", r.who.institution || "-"],
    ...spec.fields.filter((f) => r.data[f.name]).map((f) => [f.label, r.data[f.name]] as [string, string]),
    ["Attachment", file ? file.filename : "none"],
  ];
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#111;max-width:680px">
    <h2 style="margin:0 0 4px">Spotlight request: ${esc(spec.title)}</h2>
    <p style="color:#555;margin:0 0 14px">Sent from the student dashboard. Reply to this email to answer ${esc(r.who.name || "them")} directly.</p>
    <table style="border-collapse:collapse;width:100%">${rows
      .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`)
      .join("")}</table></div>`;
  try {
    await t.mail.sendMail({
      from: `OneGrasp Spotlight <${t.from}>`,
      to: TEAM_INBOX,
      replyTo: r.who.email || undefined,
      subject: `Spotlight - ${spec.title} - ${r.who.name || r.who.email} (${r.id})`,
      html,
      attachments: file ? [file] : undefined,
    });
    return true;
  } catch (err) {
    console.error("[spotlight] request email failed:", err instanceof Error ? err.message : err);
    return false;
  }
}
