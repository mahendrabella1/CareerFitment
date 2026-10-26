"use client";

import { createContext, useContext, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { CourseSidebar, type SidebarGroup, type SidebarItem } from "@/components/course/CourseSidebar";
import { CourseNextBar } from "@/components/course/CourseAside";
import type { CourseNavItem, FeatureCourse } from "@/lib/course/featureCourses";

/** The section a page sits in - FeatureLanding reads it for its parts, search and tabs. */
const FeatureCourseContext = createContext<FeatureCourse | null>(null);
export const useFeatureCourse = () => useContext(FeatureCourseContext);

export function FeatureCourseLayout({ course, children }: { course: FeatureCourse; children: ReactNode }) {
  const pathname = usePathname() ?? "";

  const matches = (item: CourseNavItem) =>
    !item.planned && (pathname === item.href || (!item.exact && pathname.startsWith(`${item.href}/`)));

  // The home page is pinned as "Overview" above the menu, so it isn't listed
  // again inside a group.
  const navGroups = course.groups
    .map((g) => ({ ...g, items: g.items.filter((i) => i.href !== course.home) }))
    .filter((g) => g.items.length > 0);

  const groups: SidebarGroup[] = navGroups.map((g) => ({
    title: g.title,
    items: g.items.map((item): SidebarItem => ({
      href: item.href,
      label: item.label,
      meta: item.planned ? "Coming soon" : item.meta,
      status: item.planned ? "locked" : matches(item) ? "current" : "todo",
    })),
  }));

  const flat = [
    { item: { href: course.home, label: "Overview", exact: true } as CourseNavItem, group: course.title },
    ...navGroups.flatMap((g) => g.items.filter((i) => !i.planned).map((i) => ({ item: i, group: g.title }))),
  ];
  const currentIndex = flat.findIndex((entry) => matches(entry.item));
  // Previous/next only for pages in the menu - a page outside it (e.g. a
  // list reached from a lesson) has no place in the order to step from.
  const prev = currentIndex > 0 ? flat[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 ? flat[currentIndex + 1] : undefined;
  // The deepest menu item this page sits under names it in the breadcrumbs.
  const crumb = navGroups.flatMap((g) => g.items).filter(matches).sort((a, b) => b.href.length - a.href.length)[0]?.label;

  // The section's parts as tabs under the top bar; the part this page sits in is marked.
  const allTabs = [
    { href: course.home, label: "Overview", active: pathname === course.home },
    ...navGroups.map((g) => {
      const live = g.items.filter((i) => !i.planned);
      const inGroup = live.some(matches) || (!!g.href && (pathname === g.href || pathname.startsWith(`${g.href}/`)));
      return { href: g.href ?? live[0]?.href ?? course.home, label: g.title, active: pathname !== course.home && inGroup };
    }),
  ];
  // A page listed in two parts marks only the first.
  const firstActive = allTabs.findIndex((t) => t.active);
  const tabs = allTabs.map((t, i) => ({ ...t, active: i === firstActive }));

  return (
    <FeatureCourseContext.Provider value={course}>
      <CoursePlayerShell
        accent={course.accent}
        banner={{ title: course.title, subtitle: course.intro, icon: course.icon, backHref: "/account", backLabel: "Dashboard" }}
        homeHref={course.home}
        crumb={crumb}
        tabs={tabs}
        menuLabel={`${course.title} menu`}
        sidebar={
          <CourseSidebar
            accent={course.accent}
            groups={groups}
            footer={course.safety ? { title: "Stay safe", text: course.safety } : undefined}
          />
        }
        aside={
          <CourseNextBar
            accent={course.accent}
            prev={prev && { href: prev.item.href, label: prev.item.label, note: prev.group }}
            next={next && { href: next.item.href, label: next.item.label, note: next.group }}
            doneText={currentIndex > 0 ? "You have seen every item in this section." : undefined}
          />
        }
      >
        {children}
      </CoursePlayerShell>
    </FeatureCourseContext.Provider>
  );
}
