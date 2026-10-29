"use client";
/** Claiming a certificate from the browser, and the links to share one. */
import { getFirebaseAuth } from "@/lib/firebase/client";
import { pushCourseDone } from "@/lib/progress/progressStore";
import type { CourseProgress } from "@/lib/progress/types";
import { certCourse, certPath, ISSUER, type CertRecord } from "./catalog";

/** Asks the server for the certificate (it checks the course is finished). */
export async function claimCertificate(key: string, lessonCourse?: { total: number; account?: CourseProgress }): Promise<CertRecord> {
  // The server reads the account copy of the ticks - make sure this device's are there.
  if (lessonCourse && certCourse(key)?.kind === "lessons") await pushCourseDone(key, lessonCourse.total, lessonCourse.account).catch(() => undefined);
  const token = await getFirebaseAuth()?.currentUser?.getIdToken();
  if (!token) throw new Error("Please sign in again to get your certificate.");
  const res = await fetch("/api/certificates", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ course: key }),
  });
  const data = (await res.json().catch(() => ({}))) as { certificate?: CertRecord; error?: string };
  if (!res.ok || !data.certificate) throw new Error(data.error || "Couldn't get your certificate just now - please try again.");
  return data.certificate;
}

export const certUrl = (id: string) => `${window.location.origin}${certPath(id)}`;

export function shareText(c: Pick<CertRecord, "courseTitle">, own: boolean): string {
  return own
    ? `I've completed the ${c.courseTitle} course on ${ISSUER.name} and earned my certificate.`
    : `${ISSUER.name} certificate: ${c.courseTitle}.`;
}

/** Where each "Share" button goes. */
export function shareLinks(c: CertRecord, url: string, own: boolean) {
  const text = shareText(c, own);
  const d = new Date(c.issuedAt);
  const q = (o: Record<string, string>) => new URLSearchParams(o).toString();
  return {
    // LinkedIn's "Licenses & certifications" form, filled in.
    linkedinProfile: `https://www.linkedin.com/profile/add?${q({
      startTask: "CERTIFICATION_NAME", name: c.courseTitle, organizationName: ISSUER.name,
      issueYear: String(d.getFullYear()), issueMonth: String(d.getMonth() + 1), certUrl: url, certId: c.id.toUpperCase(),
    })}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?${q({ url })}`,
    whatsapp: `https://wa.me/?${q({ text: `${text} ${url}` })}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?${q({ u: url })}`,
    x: `https://twitter.com/intent/tweet?${q({ text, url })}`,
  };
}
