import { ReviewsList } from "@/components/studyAbroad/ReviewsList";
import { PageHeader } from "@/components/course/fx";

export default function AbroadReviewsPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <PageHeader icon="users" eyebrow="Real voices" title="Verified reviews"
        subtitle="Honest experiences from verified students and graduates: teaching, value for money, jobs, visas, living costs and community." />
      <ReviewsList />
    </div>
  );
}
