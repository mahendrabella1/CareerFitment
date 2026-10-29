/**
 * /account/certificates - the student's course certificates, for every class
 * group. Built on the server so only each course's facts (lesson ids, module
 * pass marks, learning time) reach the browser, never lesson text or quizzes.
 */
import { Suspense } from "react";
import { ALL_COURSE_FACTS } from "@/lib/certificates/completion";
import { MyCertificates } from "@/components/certificates/MyCertificates";

export default function CertificatesPage() {
  return (
    <Suspense fallback={null}>
      <MyCertificates facts={ALL_COURSE_FACTS} />
    </Suspense>
  );
}
