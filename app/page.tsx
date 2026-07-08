import Link from "next/link";
import AssessmentExperience from "./assessment-experience";

export default function HomePage() {
  return (
    <>
      {/* Standalone entry point for testing the personality scoring engine */}
      <Link
        href="/testing"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          padding: "8px 16px",
          background: "#4f46e5",
          color: "#fff",
          borderRadius: 999,
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          boxShadow: "0 6px 20px rgba(79,70,229,.4)",
        }}
      >
        🧪 Testing
      </Link>
      <AssessmentExperience />
    </>
  );
}
