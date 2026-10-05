import Link from "next/link";
import { ReviewForm } from "@/components/studyAbroad/ReviewForm";

export default function NewAbroadReviewPage() {
  return (
    <div style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <Link href="/account/study-abroad/reviews" style={{ color: "#64748b", textDecoration: "none" }}>← Reviews</Link>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" }}>Write a verified review</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        One review per programme. Tell the next student what you wish you had known. You can come back and add a &quot;one year later&quot; update.
      </p>
      <ReviewForm />
    </div>
  );
}
