import { notFound } from "next/navigation";
import { getModule } from "@/data/startups/content";
import { stripQuizSecrets } from "@/lib/startups/scoring";
import { LessonClient } from "@/components/startups/LessonClient";

export default function LessonPage({ params }: { params: { trackSlug: string; moduleSlug: string; lessonSlug: string } }) {
  const { trackSlug, moduleSlug, lessonSlug } = params;
  const module = getModule(trackSlug, moduleSlug);
  const lesson = module?.lessons.find((l) => l.slug === lessonSlug);
  if (!module || !lesson) notFound();

  const idx = module.lessons.findIndex((l) => l.slug === lessonSlug);
  const nextLessonSlug = idx >= 0 && idx < module.lessons.length - 1 ? module.lessons[idx + 1].slug : null;

  return (
    <LessonClient
      trackSlug={trackSlug}
      moduleSlug={moduleSlug}
      moduleTitle={module.title}
      lesson={{
        slug: lesson.slug, title: lesson.title, durationMin: lesson.durationMin,
        youtubeId: lesson.youtubeId, videoStartSec: lesson.videoStartSec ?? 0,
        hook: lesson.hook, contentMd: lesson.contentMd, exampleMd: lesson.exampleMd ?? null,
        taskPrompt: lesson.taskPrompt, passMark: lesson.passMark,
      }}
      quiz={stripQuizSecrets(lesson.quiz)}
      nextLessonSlug={nextLessonSlug}
    />
  );
}
