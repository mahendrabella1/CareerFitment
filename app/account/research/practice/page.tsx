import { PracticeRecorder } from "@/components/research/PracticeRecorder";
import { PageHeader } from "@/components/course/fx";

export default function ResearchPracticePage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <PageHeader icon="audio" eyebrow="Step 11: practise" title="Practice recorder"
        subtitle="Record your poster pitch or talk, watch it back against the timer, and tick off what went well. Then record it again." />
      <PracticeRecorder />
    </div>
  );
}
