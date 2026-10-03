import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { StartupsHomeClient } from "@/components/startups/StartupsHomeClient";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";

export default function StartupsPage() {
  const track = toPublicTrack(BUILDER_TRACK);
  return (
    <StartupsCourseLayout track={track}>
      <StartupsHomeClient track={track} />
    </StartupsCourseLayout>
  );
}
