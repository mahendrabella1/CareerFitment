import { MockIndex } from "@/components/exams/MockIndex";
import { PageHeader } from "@/components/course/fx";

export default function ExamMocksPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <PageHeader icon="clock" eyebrow="Practise" title="Mock tests and analysis"
        subtitle={<>Short, original practice sets that use each exam&apos;s real marking scheme. The value is in the analysis afterwards: what to revise, where negative marking cost you, and where time went.</>} />
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 18px", maxWidth: 700 }}>
        For full-length practice, use the official mock tests and past papers on each exam&apos;s website. Results here are saved on your device and are never a prediction of your real rank.
      </p>
      <MockIndex />
    </div>
  );
}
