/** /account/aptitude - Aptitude Lab (every class). One layout keeps the student's progress across its pages. */
import type { ReactNode } from "react";
import { AptLayout } from "@/components/aptitude/AptParts";

export default function AptitudeLayout({ children }: { children: ReactNode }) {
  return <AptLayout>{children}</AptLayout>;
}
