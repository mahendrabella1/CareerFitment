import { notFound } from "next/navigation";
import { getTrack } from "@/data/startups/content";
import { stripQuizSecrets } from "@/lib/startups/scoring";
import { drawModuleTestQuestions } from "@/lib/startups/scoring";
import { toPublicTrack } from "@/lib/startups/publicShape";
import { ModuleTestClient } from "@/components/startups/ModuleTestClient";
import { StartupsCourseLayout } from "@/components/startups/StartupsCourseLayout";

export default function ModuleTestPage({ params }: { params: { trackSlug: string; moduleSlug: string } }) {
  const { trackSlug, moduleSlug } = params;
  const track = getTrack(trackSlug);
  const idx = track?.modules.findIndex((m) => m.slug === moduleSlug) ?? -1;
  const module = idx !== undefined && idx >= 0 ? track!.modules[idx] : undefined;
  if (!track || !module) notFound();

  const drawn = drawModuleTestQuestions(module.moduleTestBank, module.moduleTestDrawCount);
  const nextModuleSlug = idx < track.modules.length - 1 ? track.modules[idx + 1].slug : null;

  return (
    <StartupsCourseLayout track={toPublicTrack(track)}>
      <ModuleTestClient
        trackSlug={trackSlug}
        moduleSlug={moduleSlug}
        moduleTitle={module.title}
        passMark={module.passMark}
        quiz={stripQuizSecrets(drawn)}
        nextModuleSlug={nextModuleSlug}
      />
    </StartupsCourseLayout>
  );
}
