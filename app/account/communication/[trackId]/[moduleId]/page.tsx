import { TRACKS } from "@/lib/commLab/content";
import { ModulePage } from "@/components/commLab/LabPages";

export const generateStaticParams = () => TRACKS.flatMap((t) => t.modules.map((m) => ({ trackId: t.id, moduleId: m.id })));

export default function CommLabModulePage({ params }: { params: { trackId: string; moduleId: string } }) {
  return <ModulePage trackId={params.trackId} moduleId={params.moduleId} />;
}
