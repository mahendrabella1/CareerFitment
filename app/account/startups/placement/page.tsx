import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";
import { PlacementClient } from "@/components/startups/PlacementClient";

export default function PlacementPage() {
  return (
    <StartupsCourseLayout track={toPublicTrack(BUILDER_TRACK)}>
      <PlacementClient />
    </StartupsCourseLayout>
  );
}
