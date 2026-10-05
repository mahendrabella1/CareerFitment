"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CourseSidebar, type SidebarGroup, type SidebarItem } from "@/components/course/CourseSidebar";
import { CourseAsideCard } from "@/components/course/CourseAside";
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
  const next = currentIndex >= 0 ? flat[currentIndex + 1] : flat[0];

  const aside = (
    <>
      <CourseAsideCard title="About this section" accent={course.accent}>
        {course.intro}
      </CourseAsideCard>
      <CourseAsideCard
        title="Up next"
        accent={course.accent}
        href={next?.item.href}
        hrefLabel={next ? "Open" : undefined}
      >
        {next ? (
          <>
            <div style={{ fontWeight: 700, color: "#0f172a" }}>{next.item.label}</div>
            <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>{next.group}</div>
          </>
        ) : (
          "You have seen every item in this section."
        )}
      </CourseAsideCard>
      {course.safety && (
        <CourseAsideCard title="Stay safe" accent={course.accent}>
          {course.safety}
        </CourseAsideCard>
      )}
    </>
  );

  return (
    <CoursePlayerShell
      accent={course.accent}
      sidebar={
        <>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", padding: "0 8px 8px" }}>{course.title}</div>
          <CourseSidebar accent={course.accent} backHref="/account" backLabel="Dashboard" groups={groups} />
        </>
      }
      aside={aside}
    >
      {children}
    </CoursePlayerShell>
  );
}
