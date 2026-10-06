import { ReviewForm } from "@/components/studyAbroad/ReviewForm";
import { PageHeader } from "@/components/course/fx";

export default function NewAbroadReviewPage() {
  return (
    <div style={{ maxWidth: 840 }}>
      <PageHeader back={{ href: "/account/study-abroad/reviews", label: "Reviews" }} icon="answer" eyebrow="Real voices" title="Write a verified review"
        subtitle={<>One review per programme. Tell the next student what you wish you had known. You can come back and add a &quot;one year later&quot; update.</>} />
      <ReviewForm />
    </div>
  );
}
