"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FX_CSS } from "@/components/course/fx";
import { useAuth } from "@/lib/auth/AuthProvider";

// A branded banner for the section, then two columns: a sticky menu and the
// page. Previous/next and other notes sit at the foot of the page (`aside`).
const SHELL_CSS = `
.cps{min-height:100vh;background:radial-gradient(1100px 420px at 12% -120px,color-mix(in srgb,var(--accent) 13%,transparent),transparent 70%),radial-gradient(900px 380px at 100% -160px,color-mix(in srgb,var(--accent2) 10%,transparent),transparent 70%),#f5f7fb}
.cps-top{max-width:1360px;margin:0 auto;padding:18px 24px 0}
.cps-banner{position:relative;overflow:hidden;display:flex;align-items:center;gap:16px;padding:20px 24px;border-radius:20px;color:#fff;background:linear-gradient(115deg,var(--accent) 0%,var(--accent2) 100%);box-shadow:0 18px 40px -24px var(--accent)}
.cps-banner::before{content:"";position:absolute;width:340px;height:340px;right:-90px;top:-190px;border-radius:50%;background:rgba(255,255,255,.12)}
.cps-banner::after{content:"";position:absolute;width:240px;height:240px;right:170px;bottom:-170px;border-radius:50%;background:rgba(255,255,255,.08)}
.cps-ic{position:relative;flex:none;width:54px;height:54px;border-radius:16px;display:grid;place-items:center;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.3)}
.cps-btext{position:relative;min-width:0}
.cps-k{font-size:10.5px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;opacity:.82}
.cps-t{font-family:"Plus Jakarta Sans",Inter,sans-serif;font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.2;margin-top:2px}
.cps-s{font-size:13px;line-height:1.5;opacity:.9;margin-top:3px;max-width:700px}
.cps-back{position:relative;margin-left:auto;flex:none;display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:800;color:#fff;text-decoration:none;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.32);transition:background .15s}
.cps-back:hover{background:rgba(255,255,255,.28)}
.course-shell{display:grid;grid-template-columns:272px minmax(0,1fr);gap:28px;max-width:1360px;margin:0 auto;padding:22px 24px 64px;align-items:start}
.course-shell__mobilebar{display:none}
.course-shell__sidebar{position:sticky;top:16px;max-height:calc(100vh - 32px);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
.course-shell__main{min-width:0}
.course-shell__foot{margin-top:32px;display:grid;gap:14px}
@media (max-width:1023px){
  .cps-top{padding:12px 16px 0}
  .cps-banner{padding:14px 16px;border-radius:16px;gap:12px}
  .cps-ic{width:42px;height:42px;border-radius:13px}
  .cps-t{font-size:18px}
  .cps-s{display:none}
  .cps-back span{display:none}
  .course-shell{grid-template-columns:minmax(0,1fr);gap:14px;padding:0 16px 48px}
  .course-shell__mobilebar{display:block;position:sticky;top:0;z-index:30;margin:0 -16px;padding:10px 16px;background:rgba(245,247,251,.94);backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0}
  .course-shell__sidebar{position:static;max-height:none;display:none}
  .course-shell__sidebar.is-open{display:block}
}
.course-shell__toggle{display:inline-flex;align-items:center;gap:8px;font:inherit;font-size:13px;font-weight:800;padding:8px 14px;border-radius:10px;border:1px solid var(--accent);background:#fff;color:var(--accent);cursor:pointer}
`;

export interface ShellBanner {
  title: string;
  subtitle?: string;
  /** Icon name from app/Icons.tsx. */
  icon: string;
  backHref: string;
  backLabel: string;
}

export function CoursePlayerShell({
  accent,
  accent2,
  banner,
  sidebar,
  aside,
  headerRight,
  menuLabel,
  children,
}: {
  accent: string;
  /** Second banner colour; defaults to the accent. */
  accent2?: string;
  banner?: ShellBanner;
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
  // Tools read the signed-in student's own saved data on their first render
  // (lib/progress/userStorage.ts), so they wait until sign-in has resolved.
  const { loading } = useAuth();
  // Close the phone menu once a link in it has been followed.
  useEffect(() => setSidebarOpen(false), [pathname]);

  return (
    <div className="cps fx" style={{ ["--accent" as string]: accent, ["--accent2" as string]: accent2 ?? accent }}>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS + FX_CSS }} />
      {headerRight && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 24px 0", maxWidth: 1360, margin: "0 auto" }}>
          {headerRight}
        </div>
      )}
      {banner && (
        <div className="cps-top">
          <header className="cps-banner">
            <span className="cps-ic" aria-hidden="true"><Icon name={banner.icon} size={27} stroke={1.8} /></span>
            <div className="cps-btext">
              <div className="cps-k">OneGrasp Career Toolkit</div>
              <div className="cps-t">{banner.title}</div>
              {banner.subtitle && <div className="cps-s">{banner.subtitle}</div>}
            </div>
            <Link href={banner.backHref} className="cps-back">
              <Icon name="arrowLeft" size={15} stroke={2} />
              <span>{banner.backLabel}</span>
            </Link>
          </header>
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
          {loading ? (
            <div role="status" style={{ padding: "48px 16px", textAlign: "center", fontSize: 13.5, color: "#64748b" }}>Loading your progress…</div>
          ) : (
            <>
              {children}
              {aside && <div className="course-shell__foot">{aside}</div>}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
