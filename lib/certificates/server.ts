/**
 * Issuing and reading certificates (server only, Admin SDK).
 *
 * The server decides: it reads the student's own saved progress, checks the
 * course is finished (./completion.ts), and writes the certificate to
 * `certificates/{id}` - a server-only collection, so a public certificate page
 * always shows what OneGrasp issued - plus a pointer on the student's profile
 * (`users/{uid}.certificates.<course>`, admin-only in firestore.rules).
 * One certificate per student per course; asking again returns the same one.
 */
import { randomBytes } from "crypto";
import type { Firestore } from "firebase-admin/firestore";
import { categoryLabel } from "@/lib/auth/formOptions";
import type { ProgressMap } from "@/lib/startups/unlock";
import { CERT_ID_ALPHABET, certClass, certCourse, certName, validCertId, type CertRecord, type CertRef } from "./catalog";
import { courseFacts, courseStatus } from "./completion";

export class NotFinished extends Error {
  constructor(public done: number, public total: number) {
    super(`Finish the course first - ${done} of ${total} done.`);
  }
}

function newId(): string {
  const bytes = randomBytes(10);
  return Array.from(bytes, (b) => CERT_ID_ALPHABET[b % CERT_ID_ALPHABET.length]).join("");
}

/** The student's Startups scores, as the browser reads them (lib/startups/clientProgress.ts). */
async function startupsProgress(db: Firestore, uid: string): Promise<ProgressMap> {
  const [lessons, tests] = await Promise.all([
    db.collection("startupsLessonProgress").where("uid", "==", uid).get(),
    db.collection("startupsModuleTestProgress").where("uid", "==", uid).get(),
  ]);
  const lessonBestPercent: Record<string, number> = {};
  lessons.forEach((d) => { const x = d.data(); lessonBestPercent[`${x.moduleSlug}/${x.lessonSlug}`] = Number(x.bestPercent) || 0; });
  const moduleTestBestPercent: Record<string, number> = {};
  tests.forEach((d) => { const x = d.data(); moduleTestBestPercent[String(x.moduleSlug)] = Number(x.bestPercent) || 0; });
  return { lessonBestPercent, moduleTestBestPercent };
}

export async function issueCertificate(db: Firestore, uid: string, key: string): Promise<CertRecord> {
  const course = certCourse(key);
  const facts = courseFacts(key);
  if (!course || !facts) throw new Error("unknown-course");

  const userRef = db.collection("users").doc(uid);
  const user = await userRef.get();
  const ref = user.get(`certificates.${key}`) as CertRef | undefined;
  const existing = ref?.id ? await readCertificate(db, ref.id) : null;
  if (existing) return existing;

  const status = courseStatus(facts, course.kind === "track"
    ? { startups: await startupsProgress(db, uid) }
    : { done: (user.get(`progress.courses.${key}.done`) as string[] | undefined) ?? [] });
  if (!status.complete) throw new NotFinished(status.done, status.total);

  return db.runTransaction(async (tx) => {
    // Two quick clicks: the second one finds the first one's certificate.
    const fresh = await tx.get(userRef);
    const ref = fresh.get(`certificates.${key}`) as CertRef | undefined;
    if (ref?.id) {
      const prior = await tx.get(db.collection("certificates").doc(ref.id));
      if (prior.exists) return { ...(prior.data() as CertRecord), id: ref.id };
    }
    const cert: CertRecord = {
      id: newId(),
      course: key,
      courseTitle: course.title,
      name: certName(String(fresh.get("name") || "")),
      className: fresh.get("category") ? certClass(categoryLabel(String(fresh.get("category")))) : "",
      lessons: facts.lessons,
      minutes: facts.minutes,
      issuedAt: Date.now(),
    };
    tx.set(db.collection("certificates").doc(cert.id), { ...cert, uid });
    tx.update(userRef, { [`certificates.${key}`]: { id: cert.id, issuedAt: cert.issuedAt } satisfies CertRef });
    return cert;
  });
}

/** A certificate for its public page - never the student's uid or contact details. */
export async function readCertificate(db: Firestore, id: string): Promise<CertRecord | null> {
  if (!validCertId(id)) return null;
  const snap = await db.collection("certificates").doc(id).get();
  if (!snap.exists) return null;
  const d = snap.data() as CertRecord & { uid?: string };
  return { id, course: d.course, courseTitle: d.courseTitle, name: d.name, className: d.className, lessons: d.lessons, minutes: d.minutes, issuedAt: d.issuedAt };
}
