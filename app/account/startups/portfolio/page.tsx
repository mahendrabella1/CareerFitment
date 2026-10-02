import { BUILDER_TRACK } from "@/data/startups/content";
import { PortfolioClient } from "@/components/startups/PortfolioClient";

export default function PortfolioPage() {
  const moduleTitles = Object.fromEntries(BUILDER_TRACK.modules.map((m) => [m.slug, m.title]));
  return <PortfolioClient moduleTitles={moduleTitles} />;
}
