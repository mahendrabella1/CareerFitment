"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CourseSidebar, type SidebarGroup, type SidebarItem } from "@/components/course/CourseSidebar";
import { CourseNextBar } from "@/components/course/CourseAside";
import type { CourseNavItem, FeatureCourse } from "@/lib/course/featureCourses";

export function FeatureCourseLayout({ course, children }: { course: FeatureCourse; children: ReactNode }) {
  const pathname = usePathname() ?? "";

  const matches = (item: CourseNavItem) =>
    !item.planned && (pathname === item.href || (!item.exact && pathname.startsWith(`${item.href}/`)));

  const groups: SidebarGroup[] = course.groups.map((g) => ({
    title: g.title,
    items: g.items.map((item): SidebarItem => ({
      href: item.href,
      label: item.label,
      meta: item.planned ? "Coming soon" : item.meta,
      status: item.planned ? "locked" : matches(item) ? "current" : "todo",
    })),
  }));

  const flat = course.groups.flatMap((g) => g.items.filter((i) => !i.planned).map((i) => ({ item: i, group: g.title })));
  const currentIndex = flat.findIndex((entry) => matches(entry.item));
  // Previous/next only for pages in the menu - a page outside it (e.g. a
  // list reached from a lesson) has no place in the order to step from.
  const prev = currentIndex > 0 ? flat[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? flat[currentIndex + 1] : undefined;

  return (
    <CoursePlayerShell
      accent={course.accent}
      menuLabel={`${course.title} menu`}
      sidebar={
        <CourseSidebar
          accent={course.accent}
          backHref="/account"
          backLabel="Dashboard"
          title={course.title}
          intro={course.intro}
          groups={groups}
          footer={course.safety ? { title: "Stay safe", text: course.safety } : undefined}
        />
      }
      aside={
        <CourseNextBar
          accent={course.accent}
          prev={prev && { href: prev.item.href, label: prev.item.label, note: prev.group }}
          next={next && { href: next.item.href, label: next.item.label, note: next.group }}
          doneText={currentIndex >= 0 ? "You have seen every item in this section." : undefined}
        />
      }
    >
      {children}
    </CoursePlayerShell>
  );
}
