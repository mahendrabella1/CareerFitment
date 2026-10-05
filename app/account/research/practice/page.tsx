import { PracticeRecorder } from "@/components/research/PracticeRecorder";

export default function ResearchPracticePage() {
  return (
    <div style={{ maxWidth: 860 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Step 11: practise</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Practice recorder</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        Record your poster pitch or talk, watch it back against the timer, and tick off what went well. Then record it again.
      </p>
      <PracticeRecorder />
    </div>
  );
}
