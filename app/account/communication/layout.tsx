/** /account/communication - Communication Lab (every class). One layout keeps the student's Lab progress across its pages. */
import type { ReactNode } from "react";
import { LabLayout } from "@/components/commLab/LabParts";

export default function CommunicationLayout({ children }: { children: ReactNode }) {
  return <LabLayout>{children}</LabLayout>;
}
