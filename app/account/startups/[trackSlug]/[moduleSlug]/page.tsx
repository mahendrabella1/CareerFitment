import { notFound } from "next/navigation";
import { getTrack } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { ModuleClient } from "@/components/startups/ModuleClient";

export default function ModulePage({ params }: { params: { trackSlug: string; moduleSlug: string } }) {
  const { trackSlug, moduleSlug } = params;
  const track = getTrack(trackSlug);
  const module = track?.modules.find((m) => m.slug === moduleSlug);
  if (!track || !module) notFound();
  return <ModuleClient track={toPublicTrack(track)} moduleSlug={moduleSlug} />;
}
