"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FX_CSS } from "@/components/course/fx";
import { useAuth } from "@/lib/auth/AuthProvider";

// One layout for every feature section (Money, Legal, Exams, Scholarships,
// Study Abroad, Research, Startups): a white top bar with breadcrumbs, the
// section menu docked on the left, and the page beside it. The section's
// accent colour is used sparingly - the current menu item, primary buttons
// and the small icon tiles - never as large coloured blocks.
const SHELL_CSS = `
.cps{--bar:56px;min-height:100vh;background:#f6f7f9;color:#111827;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.cps-bar{position:sticky;top:0;z-index:40;height:var(--bar);display:flex;align-items:center;gap:16px;padding:0 20px;background:#fff;border-bottom:1px solid #e5e7eb}
.cps-logo{flex:none;display:flex;align-items:center;height:36px;padding-right:16px;border-right:1px solid #e5e7eb;text-decoration:none}
.cps-crumbs{display:flex;align-items:center;gap:8px;min-width:0;font-size:13.5px;color:#6b7280;white-space:nowrap}
.cps-crumbs a{color:#6b7280;text-decoration:none;flex:none}
.cps-crumbs a:hover{color:#111827}
.cps-crumbs .sep{color:#c4c9d2;flex:none}
.cps-crumbs .cur{color:#111827;font-weight:600;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cps-bar-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex:none}
.cps-dash{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#374151;text-decoration:none;padding:7px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fff}
.cps-dash:hover{background:#f9fafb;color:#111827}
.cps-menu{display:none}
.cps-body{display:grid;grid-template-columns:272px minmax(0,1fr);align-items:start}
.cps-side{position:sticky;top:var(--bar);height:calc(100vh - var(--bar));overflow-y:auto;overscroll-behavior:contain;background:#fff;border-right:1px solid #e5e7eb;padding:14px 12px 28px;scrollbar-width:thin}
.cps-back{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:#4b5563;text-decoration:none;padding:6px 10px;border-radius:6px}
.cps-back:hover{background:#f3f4f6;color:#111827}
.cps-sec{display:flex;gap:10px;align-items:flex-start;padding:12px 10px 14px;margin-bottom:6px;border-bottom:1px solid #f0f1f3}
.cps-sec-ic{flex:none;width:34px;height:34px;border-radius:9px;display:grid;place-items:center;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,#fff)}
.cps-sec-t{font-size:15px;font-weight:700;line-height:1.3;color:#111827}
.cps-sec-s{font-size:12.5px;color:#6b7280;line-height:1.45;margin-top:2px}
.cps-home{position:relative;display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;font-size:13.5px;font-weight:500;color:#374151;text-decoration:none;margin:2px 0 4px}
.cps-home:hover{background:#f3f4f6;color:#111827}
.cps-home.is-current{background:color-mix(in srgb,var(--accent) 9%,#fff);color:var(--accent);font-weight:600}
.cps-home.is-current::before{content:"";position:absolute;left:-12px;top:6px;bottom:6px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
.cps-main{min-width:0;padding:28px 32px 56px}
.cps-content{max-width:1240px;margin:0 auto}
.cps-foot{margin-top:32px;display:grid;gap:14px}
.cps-scrim{display:none}
@media (max-width:1023px){
  .cps-bar{padding:0 12px;gap:10px}
  .cps-menu{display:inline-flex;align-items:center;gap:6px;flex:none;font:inherit;font-size:13px;font-weight:600;padding:7px 10px;border:1px solid #e5e7eb;border-radius:8px;background:#fff;color:#111827;cursor:pointer}
  .cps-logo{display:none}
  .cps-dash span{display:none}
  .cps-dash{padding:7px 9px}
  .cps-body{grid-template-columns:minmax(0,1fr)}
  .cps-side{position:fixed;top:var(--bar);left:0;bottom:0;height:auto;width:min(86vw,320px);z-index:45;transform:translateX(-102%);transition:transform .2s ease;box-shadow:0 10px 30px rgba(17,24,39,.18)}
  .cps-side.is-open{transform:none}
  .cps-scrim{display:block;position:fixed;inset:var(--bar) 0 0 0;background:rgba(17,24,39,.35);z-index:44;border:0;padding:0}
  .cps-main{padding:20px 16px 48px}
}
@media (max-width:640px){.cps-crumbs .c-first{display:none}}
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
  banner,
  sidebar,
  aside,
  headerRight,
  menuLabel,
  crumb,
  homeHref,
  children,
}: {
  accent: string;
  /** Kept for older callers; the shell no longer draws gradients. */
  accent2?: string;
  banner?: ShellBanner;
  sidebar: React.ReactNode;
  /** Shown under the page content (next/previous, notes). */
  aside?: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Label for the phone/tablet menu button. */
  menuLabel?: string;
  /** The current page, shown last in the breadcrumbs. */
  crumb?: string;
  /** The section's home page, pinned as "Overview" at the top of the menu. */
  homeHref?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Tools read the signed-in student's own saved data on their first render
  // (lib/progress/userStorage.ts), so they wait until sign-in has resolved.
  const { loading } = useAuth();
  // Close the phone menu once a link in it has been followed, or on Escape.
  useEffect(() => setSidebarOpen(false), [pathname]);
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const onHome = !!homeHref && pathname === homeHref;
  const sectionHref = homeHref ?? banner?.backHref ?? "/account";

  return (
    <div className="cps fx" style={{ ["--accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS + FX_CSS }} />

      <header className="cps-bar">
        <button className="cps-menu" onClick={() => setSidebarOpen((v) => !v)} aria-expanded={sidebarOpen} aria-controls="cps-side">
          <Icon name={sidebarOpen ? "close" : "menu"} size={16} stroke={2} />
          {sidebarOpen ? "Close" : "Menu"}
        </button>
        <Link href="/account" className="cps-logo" aria-label="OneGrasp dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/onegrasp-logo-tight.png" alt="OneGrasp" style={{ height: 36, width: "auto", display: "block" }} />
        </Link>
        <nav className="cps-crumbs" aria-label="Breadcrumb">
          <Link href="/account" className="c-first">Dashboard</Link>
          {banner && (
            <>
              <span className="sep c-first" aria-hidden="true">›</span>
              {crumb && !onHome
                ? <Link href={sectionHref}>{banner.title}</Link>
                : <span className="cur" aria-current="page">{banner.title}</span>}
            </>
          )}
          {crumb && !onHome && (
            <>
              <span className="sep" aria-hidden="true">›</span>
              <span className="cur" aria-current="page" title={crumb}>{crumb}</span>
            </>
          )}
        </nav>
        <div className="cps-bar-r">
          {headerRight}
          <Link href="/account" className="cps-dash"><Icon name="home" size={15} stroke={2} /><span>Dashboard</span></Link>
        </div>
      </header>

      <div className="cps-body">
        <aside id="cps-side" className={`cps-side course-shell__sidebar${sidebarOpen ? " is-open" : ""}`} aria-label={menuLabel ?? "Section menu"}>
          <Link href={banner?.backHref ?? "/account"} className="cps-back">
            <Icon name="arrowLeft" size={15} stroke={2} />
            Back to {banner?.backLabel ?? "Dashboard"}
          </Link>
          {banner && (
            <div className="cps-sec">
              <span className="cps-sec-ic" aria-hidden="true"><Icon name={banner.icon} size={19} stroke={1.9} /></span>
              <div style={{ minWidth: 0 }}>
                <div className="cps-sec-t">{banner.title}</div>
                {banner.subtitle && <div className="cps-sec-s">{banner.subtitle}</div>}
              </div>
            </div>
          )}
          {homeHref && (
            <Link href={homeHref} className={`cps-home${onHome ? " is-current" : ""}`} aria-current={onHome ? "page" : undefined}>
              <Icon name="home" size={16} stroke={1.9} /> Overview
            </Link>
          )}
          {sidebar}
        </aside>
        {sidebarOpen && <button className="cps-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

        <main className="cps-main">
          <div className="cps-content">
            {loading ? (
              <div role="status" style={{ padding: "48px 16px", textAlign: "center", fontSize: 13.5, color: "#6b7280" }}>Loading your progress…</div>
            ) : (
              <>
                {children}
                {aside && <div className="cps-foot">{aside}</div>}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
