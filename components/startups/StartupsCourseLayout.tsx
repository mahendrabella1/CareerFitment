"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { PublicTrack } from "@/lib/startups/publicShape";
import { fetchProgress } from "@/lib/startups/clientProgress";
import { lessonStatus, moduleStatus, moduleTestUnlocked, nextUnfinishedLesson, type ProgressMap } from "@/lib/startups/unlock";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CourseSidebar, type SidebarGroup, type ItemStatus } from "@/components/course/CourseSidebar";
import { CourseNextBar } from "@/components/course/CourseAside";

const ACCENT = "#c2410c";

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
  groups.push({
    title: "More",
    items: [
      { href: "/account/startups/placement", label: "Placement quiz", meta: "2 min" },
      { href: "/account/startups/portfolio", label: "Your Startup Portfolio" },
      { href: "/account/startups/videos", label: "Video library" },
      { href: "/account/startups/funding", label: "Funding for startups", meta: "Grants, loans" },
    ].map((i) => ({ ...i, status: (pathname === i.href ? "current" : "todo") as ItemStatus })),
  });

  const next = nextUnfinishedLesson(track, p);
  const nextModule = next ? track.modules.find((m) => m.slug === next.moduleSlug) : null;
  const nextLesson = nextModule?.lessons.find((l) => l.slug === next?.lessonSlug);

  // Previous/next follow the menu order; "Up next" on the home page is the
  // first lesson not finished yet.
  const flat = groups.flatMap((g) => g.items.filter((i) => i.status !== "locked").map((i) => ({ ...i, group: g.title })));
  const here = flat.findIndex((i) => i.status === "current");
  // A module page sits under its own lessons in the menu, so it is named here.
  const moduleHere = track.modules.find((m) => pathname === `/account/startups/${track.slug}/${m.slug}`);
  const crumb = here >= 0 ? flat[here].label : moduleHere?.title;
  const prevItem = here > 0 ? flat[here - 1] : undefined;
  const nextItem = here >= 0 ? flat[here + 1] : undefined;
  const continueHref = next ? `/account/startups/${track.slug}/${next.moduleSlug}/${next.lessonSlug}` : undefined;

  const aside = (
    <CourseNextBar
      accent={ACCENT}
      prev={prevItem && { href: prevItem.href, label: prevItem.label, note: prevItem.group }}
      next={nextItem
        ? { href: nextItem.href, label: nextItem.label, note: nextItem.group }
        : here < 0 && continueHref && nextLesson
        ? { href: continueHref, label: nextLesson.title, note: nextModule ? `Continue · ${nextModule.title}` : "Continue" }
        : undefined}
      doneText={next ? undefined : "You've finished every lesson in this track."}
    />
  );

  const extras = ["/account/startups/placement", "/account/startups/portfolio", "/account/startups/videos", "/account/startups/funding"];
  const tabs = [
    { href: "/account/startups", label: "Course", active: !extras.some((h) => pathname === h) },
    { href: extras[0], label: "Placement quiz", active: pathname === extras[0] },
    { href: extras[1], label: "Your portfolio", active: pathname === extras[1] },
    { href: extras[2], label: "Video library", active: pathname === extras[2] },
    { href: extras[3], label: "Funding", active: pathname === extras[3] },
  ];

  return (
    <CoursePlayerShell
      accent={ACCENT}
      banner={{ title: "Startups", subtitle: "Watch, read, try it on your own idea, take the quiz - and finish with a real startup you've shaped yourself.", icon: "rocket", backHref: "/account", backLabel: "Dashboard" }}
      homeHref="/account/startups"
      crumb={crumb}
      tabs={tabs}
      menuLabel="Startups menu"
      sidebar={
        <CourseSidebar
          accent={ACCENT}
          groups={groups}
          progressLabel={{ done: doneLessons, total: totalLessons }}
          openOnlyCurrent
        />
      }
      aside={aside}
    >
      {children}
    </CoursePlayerShell>
  );
}
