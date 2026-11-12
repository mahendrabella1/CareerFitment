import { MOCKS_PER_TRACK } from "@/lib/aptitude/topics";
import { MockPage } from "@/components/aptitude/AptPages";

export const generateStaticParams = () => [...Array.from({ length: MOCKS_PER_TRACK }, (_, i) => ({ mockId: String(i + 1) })), { mockId: "random" }];

export default async function AptitudeMockPage(props: { params: Promise<{ mockId: string }> }) {
  const params = await props.params;
  return <MockPage mockKey={params.mockId} />;
}
