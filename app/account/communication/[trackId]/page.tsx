import { TRACKS } from "@/lib/commLab/content";
import { TrackPage } from "@/components/commLab/LabPages";

export const generateStaticParams = () => TRACKS.map((t) => ({ trackId: t.id }));

export default async function CommLabTrackPage(props: { params: Promise<{ trackId: string }> }) {
  const params = await props.params;
  return <TrackPage trackId={params.trackId} />;
}
