import { notFound } from "next/navigation";
import { getTrack } from "@/data/startups/content";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { ModuleClient } from "@/components/startups/ModuleClient";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";

export default async function ModulePage(props: { params: Promise<{ trackSlug: string; moduleSlug: string }> }) {
  const params = await props.params;
  const { trackSlug, moduleSlug } = params;
  const track = getTrack(trackSlug);
  const module = track?.modules.find((m) => m.slug === moduleSlug);
  if (!track || !module) notFound();
  return (
    <StartupsCourseLayout track={toPublicTrack(track)}>
      <ModuleClient track={toPublicTrack(track)} moduleSlug={moduleSlug} />
    </StartupsCourseLayout>
  );
}
