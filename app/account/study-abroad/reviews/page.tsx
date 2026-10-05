import { ReviewsList } from "@/components/studyAbroad/ReviewsList";

export default function AbroadReviewsPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#7c3aed", textTransform: "uppercase", letterSpacing: ".08em" }}>Real voices</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Verified reviews</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 700 }}>
        Honest experiences from verified students and graduates: teaching, value for money, jobs, visas, living costs and community.
      </p>
      <ReviewsList />
    </div>
  );
}
