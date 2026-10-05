import { MockIndex } from "@/components/exams/MockIndex";

export default function ExamMocksPage() {
  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#2563eb", textTransform: "uppercase", letterSpacing: ".08em" }}>Practise</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Mock tests and analysis</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 8px", maxWidth: 700 }}>
        Short, original practice sets that use each exam&apos;s real marking scheme. The value is in the analysis afterwards: what to revise, where negative marking cost you, and where time went.
      </p>
      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, margin: "0 0 18px", maxWidth: 700 }}>
        For full-length practice, use the official mock tests and past papers on each exam&apos;s website. Results here are saved on your device and are never a prediction of your real rank.
      </p>
      <MockIndex />
    </div>
  );
}
