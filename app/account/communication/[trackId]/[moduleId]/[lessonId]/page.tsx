import { TRACKS } from "@/lib/commLab/content";
import { LessonPage } from "@/components/commLab/LabPages";

export const generateStaticParams = () =>
  TRACKS.flatMap((t) => t.modules.flatMap((m) => m.lessons.map((l) => ({ trackId: t.id, moduleId: m.id, lessonId: l.id }))));

export default function CommLabLessonPage({ params }: { params: { trackId: string; moduleId: string; lessonId: string } }) {
  return <LessonPage lessonId={params.lessonId} />;
}
