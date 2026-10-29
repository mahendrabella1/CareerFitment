import { TRACKS } from "@/lib/commLab/content";
import { TrackPage } from "@/components/commLab/LabPages";

export const generateStaticParams = () => TRACKS.map((t) => ({ trackId: t.id }));

export default function CommLabTrackPage({ params }: { params: { trackId: string } }) {
  return <TrackPage trackId={params.trackId} />;
}
