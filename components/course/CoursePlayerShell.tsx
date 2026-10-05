"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Two columns: a sticky menu and the page. The old third column (three small
// cards) left most of the screen empty as soon as you scrolled, so its
// content now sits at the foot of the page instead (see `aside`).
const SHELL_CSS = `
.course-shell{display:grid;grid-template-columns:272px minmax(0,1fr);gap:28px;max-width:1360px;margin:0 auto;padding:24px 24px 64px;align-items:start}
.course-shell__mobilebar{display:none}
.course-shell__sidebar{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
.course-shell__main{min-width:0}
.course-shell__foot{margin-top:32px;display:grid;gap:14px}
@media (max-width:1023px){
  .course-shell{grid-template-columns:minmax(0,1fr);gap:14px;padding:0 16px 48px}
  .course-shell__mobilebar{display:block;position:sticky;top:0;z-index:30;margin:0 -16px;padding:10px 16px;background:rgba(246,247,251,.94);backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0}
  .course-shell__sidebar{position:static;max-height:none;display:none}
  .course-shell__sidebar.is-open{display:block}
}
.course-shell__toggle{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:13px;font-weight:800;padding:8px 14px;border-radius:10px;border:1px solid var(--accent);background:#fff;color:var(--accent);cursor:pointer}
`;

export function CoursePlayerShell({
  accent,
  sidebar,
  aside,
  headerRight,
  menuLabel,
  children,
}: {
  accent: string;
  sidebar: React.ReactNode;
  /** Shown under the page content (next/previous, notes). */
  aside?: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Label for the phone/tablet menu button. */
  menuLabel?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Close the phone menu once a link in it has been followed.
  useEffect(() => setSidebarOpen(false), [pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", ["--accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      {headerRight && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 24px 0", maxWidth: 1360, margin: "0 auto" }}>
          {headerRight}
        </div>
      )}
      <div className="course-shell">
        <div className="course-shell__mobilebar">
          <button className="course-shell__toggle" onClick={() => setSidebarOpen((v) => !v)} aria-expanded={sidebarOpen}>
            <span aria-hidden="true">{sidebarOpen ? "✕" : "☰"}</span>
            {sidebarOpen ? "Close menu" : menuLabel ?? "Menu"}
          </button>
        </div>
        <div className={`course-shell__sidebar${sidebarOpen ? " is-open" : ""}`}>{sidebar}</div>
        <main className="course-shell__main">
          {children}
          {aside && <div className="course-shell__foot">{aside}</div>}
        </main>
      </div>
    </div>
  );
}
