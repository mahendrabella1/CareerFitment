import { TOPICS } from "@/lib/aptitude/topics";
import { TopicPage } from "@/components/aptitude/AptPages";

export const generateStaticParams = () => TOPICS.map((t) => ({ topicId: t.id }));

export default function AptitudeTopicPage({ params }: { params: { topicId: string } }) {
  return <TopicPage topicId={params.topicId} />;
}
