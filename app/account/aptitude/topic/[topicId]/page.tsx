import { TOPICS } from "@/lib/aptitude/topics";
import { TopicPage } from "@/components/aptitude/AptPages";

export const generateStaticParams = () => TOPICS.map((t) => ({ topicId: t.id }));

export default async function AptitudeTopicPage(props: { params: Promise<{ topicId: string }> }) {
  const params = await props.params;
  return <TopicPage topicId={params.topicId} />;
}
