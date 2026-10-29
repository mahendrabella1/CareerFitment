import { Suspense } from "react";
import { PracticeFromQuery } from "@/components/commLab/LabPages";

export default function PracticePage() {
  return <Suspense fallback={null}><PracticeFromQuery /></Suspense>;
}
