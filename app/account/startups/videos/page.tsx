import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";
import { VideoLibrary } from "@/components/startups/VideoLibrary";

export default function StartupsVideosPage() {
  const track = toPublicTrack(BUILDER_TRACK);
  return (
    <StartupsCourseLayout track={track}>
      <VideoLibrary />
    </StartupsCourseLayout>
  );
}
