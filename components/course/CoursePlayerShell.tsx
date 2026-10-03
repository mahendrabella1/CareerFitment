"use client";

import { useState } from "react";

const SHELL_CSS = `
.course-shell{display:grid;grid-template-columns:260px minmax(0,1fr) 300px;gap:24px;max-width:1280px;margin:0 auto;padding:24px 20px 60px;align-items:start}
.course-shell__sidebar{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow-y:auto}
.course-shell__aside{position:sticky;top:16px}
.course-shell__toggle{display:none}
@media (max-width:1099px){
  .course-shell{grid-template-columns:minmax(0,1fr)}
  .course-shell__sidebar{position:static;max-height:none}
  .course-shell__sidebar--collapsed{display:none}
  .course-shell__toggle{display:inline-block}
  .course-shell__aside{position:static}
}
@media (max-width:719px){
  .course-shell{padding:16px 14px 48px}
}
`;

export function CoursePlayerShell({
  accent,
  sidebar,
  aside,
  headerRight,
  children,
}: {
  accent: string;
  sidebar: React.ReactNode;
  aside?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS }} />
      {headerRight && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px 0", maxWidth: 1280, margin: "0 auto" }}>
          {headerRight}
        </div>
      )}
      <div className="course-shell" style={{ ["--accent" as string]: accent }}>
        <div className={`course-shell__sidebar${sidebarOpen ? "" : " course-shell__sidebar--collapsed"}`}>
          <button
            className="course-shell__toggle"
            onClick={() => setSidebarOpen((v) => !v)}
            style={{ marginBottom: 10, fontSize: 12.5, fontWeight: 700, padding: "8px 12px", borderRadius: 9, border: `1px solid ${accent}`, background: "#fff", color: accent, cursor: "pointer" }}
          >
            {sidebarOpen ? "Hide menu" : "Show menu"}
          </button>
          {sidebar}
        </div>
        <main style={{ minWidth: 0 }}>{children}</main>
        {aside && <aside className="course-shell__aside" style={{ display: "flex", flexDirection: "column", gap: 14 }}>{aside}</aside>}
      </div>
    </div>
  );
}
