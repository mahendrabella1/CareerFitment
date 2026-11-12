import { TRACKS } from "@/lib/commLab/content";
import { ModulePage } from "@/components/commLab/LabPages";

export const generateStaticParams = () => TRACKS.flatMap((t) => t.modules.map((m) => ({ trackId: t.id, moduleId: m.id })));

export default async function CommLabModulePage(props: { params: Promise<{ trackId: string; moduleId: string }> }) {
  const params = await props.params;
  return <ModulePage trackId={params.trackId} moduleId={params.moduleId} />;
}
