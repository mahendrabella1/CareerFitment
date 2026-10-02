import { BUILDER_TRACK } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { StartupsHomeClient } from "@/components/startups/StartupsHomeClient";

export default function StartupsPage() {
  return <StartupsHomeClient track={toPublicTrack(BUILDER_TRACK)} />;
}
