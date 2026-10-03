"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { fetchProgress } from "@/lib/startups/clientProgress";
import { lessonStatus, moduleStatus, moduleTestUnlocked, nextUnfinishedLesson, type ProgressMap } from "@/lib/startups/unlock";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CourseSidebar, type SidebarGroup, type ItemStatus } from "@/components/course/CourseSidebar";
import { CourseAsideCard } from "@/components/course/CourseAside";

const ACCENT = "#f97316";

export function StartupsCourseLayout({ track, children }: { track: PublicTrack; children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const [progress, setProgress] = useState<ProgressMap | null>(null);

  useEffect(() => {
    if (!user?.uid) { setProgress({ lessonBestPercent: {}, moduleTestBestPercent: {} }); return; }
    fetchProgress(user.uid).then(setProgress);
  }, [user?.uid]);

  const p = progress ?? { lessonBestPercent: {}, moduleTestBestPercent: {} };

  let totalLessons = 0;
  let doneLessons = 0;
  const groups: SidebarGroup[] = track.modules.map((m) => {
    const items: { href: string; label: string; status: ItemStatus; meta?: string }[] = m.lessons.map((l) => {
      totalLessons += 1;
      const href = `/account/startups/${track.slug}/${m.slug}/${l.slug}`;
      const s = lessonStatus(track, m.slug, l.slug, p);
      if (s === "COMPLETED") doneLessons += 1;
      const status: ItemStatus = pathname === href ? "current" : s === "COMPLETED" ? "done" : s === "LOCKED" ? "locked" : "todo";
      return { href, label: l.title, status, meta: `${l.durationMin} min` };
    });
    const testHref = `/account/startups/${track.slug}/${m.slug}/test`;
    const testUnlocked = moduleTestUnlocked(m, p);
    const testDone = moduleStatus(m, p) === "COMPLETED";
    items.push({
      href: testHref,
      label: "Module test",
      status: pathname === testHref ? "current" : testDone ? "done" : testUnlocked ? "todo" : "locked",
    });
    return { title: `${m.order}. ${m.title}`, items };
  });

  const next = nextUnfinishedLesson(track, p);
  const nextModule = next ? track.modules.find((m) => m.slug === next.moduleSlug) : null;
  const nextLesson = nextModule?.lessons.find((l) => l.slug === next?.lessonSlug);

  const aside = (
    <>
      <CourseAsideCard title="Up next" accent={ACCENT}>
        {next && nextLesson ? (
          <>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{nextLesson.title}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{nextModule?.title}</div>
          </>
        ) : (
          <div style={{ fontWeight: 700, color: "#166534" }}>You&apos;ve finished every lesson in this track 🎉</div>
        )}
      </CourseAsideCard>
      {next && nextLesson && (
        <CourseAsideCard title="Continue" accent={ACCENT} href={`/account/startups/${track.slug}/${next.moduleSlug}/${next.lessonSlug}`} hrefLabel="Open this lesson">
          Pick up where you left off.
        </CourseAsideCard>
      )}
      <CourseAsideCard title="Your progress" accent={ACCENT}>
        {doneLessons} of {totalLessons} lessons completed across this track.
      </CourseAsideCard>
    </>
  );

  return (
    <CoursePlayerShell
      accent={ACCENT}
      sidebar={
        <CourseSidebar
          accent={ACCENT}
          backHref="/account"
          backLabel="Dashboard"
          groups={groups}
          progressLabel={{ done: doneLessons, total: totalLessons }}
        />
      }
      aside={aside}
    >
      {children}
    </CoursePlayerShell>
  );
}
