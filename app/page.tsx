import { Suspense } from "react";
import AssessmentExperience from "./assessment-experience";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <AssessmentExperience />
    </Suspense>
  );
}
