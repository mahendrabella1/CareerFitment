/** /account/startups/funding - Startups -> Funding (every class): CapEasy's startup funding directory. */
import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import FUNDING from "@/data/startups/funding.json";
import type { FundingData } from "@/lib/startups/funding";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";
import { FundingDirectory } from "@/components/startups/FundingDirectory";

export default function StartupsFundingPage() {
  return (
    <StartupsCourseLayout track={toPublicTrack(BUILDER_TRACK)}>
      <FundingDirectory data={FUNDING as FundingData} />
    </StartupsCourseLayout>
  );
}
