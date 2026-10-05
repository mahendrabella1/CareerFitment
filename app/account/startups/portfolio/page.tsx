import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";
import { PortfolioClient } from "@/components/startups/PortfolioClient";

export default function PortfolioPage() {
  const moduleTitles = Object.fromEntries(BUILDER_TRACK.modules.map((m) => [m.slug, m.title]));
  return (
    <StartupsCourseLayout track={toPublicTrack(BUILDER_TRACK)}>
      <PortfolioClient moduleTitles={moduleTitles} />
    </StartupsCourseLayout>
  );
}
