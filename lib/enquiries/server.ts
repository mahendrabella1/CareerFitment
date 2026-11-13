/**
 * Saving and emailing the public forms (lib/enquiries/forms.ts). Server-only.
 * Records go to schoolEnquiries / privacyRequests (server-only: the rules'
 * catch-all denies them), with an id like SC-7K3Q9X / PR-4M2T8B, then an
 * email to TEAM_NOTIFY_EMAIL with Reply-To the sender. If email isn't set up
 * the record is still saved and shows on /admin/requests.
 */
import { randomBytes } from "node:crypto";
import { getFirestore, isFirestoreConfigured } from "@/lib/firebase/admin";
import { getMailer, sendMail } from "@/lib/mail";
import { FIELDS, type EnquiryKind } from "./forms";

export const COLLECTION: Record<EnquiryKind, string> = { school: "schoolEnquiries", privacy: "privacyRequests" };
const PREFIX: Record<EnquiryKind, string> = { school: "SC", privacy: "PR" };
const TITLE: Record<EnquiryKind, string> = { school: "School partnership enquiry", privacy: "Privacy request" };
const TEAM_INBOX = (process.env.TEAM_NOTIFY_EMAIL || "support@onegrasp.com").trim();

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
export const newId = (kind: EnquiryKind) => `${PREFIX[kind]}-${[...randomBytes(6)].map((b) => ALPHABET[b % ALPHABET.length]).join("")}`;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function saveEnquiry(kind: EnquiryKind, data: Record<string, string>, meta: { ip: string; page: string }): Promise<{ id: string; emailed: boolean }> {
  if (!isFirestoreConfigured()) throw new Error("not configured");
  const db = await getFirestore();
  const id = newId(kind);
  const at = Date.now();
  await db.collection(COLLECTION[kind]).doc(id).create({ id, kind, data, at, status: "new", page: meta.page.slice(0, 200), ip: meta.ip.slice(0, 64), emailed: false });

  const rows = FIELDS[kind].filter((f) => data[f.name]).map((f) => [f.label, data[f.name]] as [string, string]);
  const html = `<div style="font-family:Inter,Arial,sans-serif;color:#111;max-width:680px">
    <h2 style="margin:0 0 4px">${esc(TITLE[kind])} (${id})</h2>
    <p style="color:#555;margin:0 0 14px">Sent from ${esc(meta.page || "the website")}. Reply to this email to answer directly. It's also on /admin/requests.</p>
    <table style="border-collapse:collapse;width:100%">${rows.map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}</table></div>`;
  const who = kind === "school" ? `${data.school} (${data.city})` : `${data.name} - ${data.request}`;
  const m = getMailer();
  const emailed = m ? await sendMail({ from: `OneGrasp Website <${m.from}>`, to: TEAM_INBOX, replyTo: data.email || undefined, subject: `${TITLE[kind]} - ${who} (${id})`, html }, `enquiry:${kind}`) : false;
  if (emailed) await db.collection(COLLECTION[kind]).doc(id).update({ emailed: true }).catch(() => {});
  return { id, emailed };
}
