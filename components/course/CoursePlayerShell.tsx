"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/app/Icons";
import { FX_CSS } from "@/components/course/fx";
import { FP_CSS } from "@/components/feature/styles";
import { useAuth } from "@/lib/auth/AuthProvider";

// One layout for every feature section (Money, Legal, Exams, Scholarships,
// Study Abroad, Research, Startups, Career Library, Internships, My Progress):
// a white top bar with breadcrumbs, the section's parts as tabs under it, and
// the page. A section's home page is full width (its hero is a band across
// the page) with the full menu one tap away; inner pages keep the menu docked
// on the left. The accent colour is used sparingly - the current tab, the
// headline's second line and small "you are here" marks.
const SHELL_CSS = `
.cps{--bar:56px;min-height:100vh;background:#fbfaf8;color:#16181d;font-family:Inter,system-ui,"Segoe UI",sans-serif}
.cps.has-tabs{--bar:101px}
.cps-head{position:sticky;top:0;z-index:40;background:#fff;border-bottom:1px solid #e8e5df}
.cps-bar{height:56px;display:flex;align-items:center;gap:16px;padding:0 20px}
.cps-logo{flex:none;display:flex;align-items:center;height:36px;padding-right:16px;border-right:1px solid #e8e5df;text-decoration:none}
.cps-crumbs{display:flex;align-items:center;gap:8px;min-width:0;font-size:13.5px;color:#7b808b;white-space:nowrap}
.cps-crumbs a{color:#7b808b;text-decoration:none;flex:none}
.cps-crumbs a:hover{color:#16181d}
.cps-crumbs .sep{color:#c9c4ba;flex:none}
.cps-crumbs .cur{color:#16181d;font-weight:600;overflow:hidden;text-overflow:ellipsis;min-width:0}
.cps-bar-r{margin-left:auto;display:flex;align-items:center;gap:8px;flex:none}
.cps-dash{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:600;color:#16181d;text-decoration:none;height:34px;padding:0 12px;border:1px solid #d9d5cd;border-radius:6px;background:#fff}
.cps-dash:hover{background:#f7f5f1}
.cps-tabs{display:flex;gap:2px;height:44px;padding:0 14px;overflow-x:auto;scrollbar-width:none;border-top:1px solid #f0ede8}
.cps-tabs::-webkit-scrollbar{display:none}
.cps-tabs a{flex:none;display:flex;align-items:center;padding:0 12px;font-size:13.5px;font-weight:600;color:#7b808b;text-decoration:none;border-bottom:2px solid transparent;margin-bottom:-1px}
.cps-tabs a:hover{color:#16181d}
.cps-tabs a[aria-current="page"]{color:#16181d;border-bottom-color:#16181d}
.cps-menu{display:none}
.cps-body{display:grid;grid-template-columns:272px minmax(0,1fr);align-items:start}
.cps-side{position:sticky;top:var(--bar);height:calc(100vh - var(--bar));overflow-y:auto;overscroll-behavior:contain;background:#fff;border-right:1px solid #e8e5df;padding:14px 12px 28px;scrollbar-width:thin}
.cps-back{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:#4a4f59;text-decoration:none;padding:6px 10px;border-radius:6px}
.cps-back:hover{background:#f7f5f1;color:#16181d}
.cps-sec{display:flex;gap:10px;align-items:flex-start;padding:12px 10px 14px;margin-bottom:6px;border-bottom:1px solid #f0ede8}
.cps-sec-ic{flex:none;width:34px;height:34px;border-radius:6px;display:grid;place-items:center;color:#16181d;background:#f4f0eb}
.cps-sec-t{font-size:15px;font-weight:700;line-height:1.3;color:#16181d}
.cps-sec-s{font-size:12.5px;color:#7b808b;line-height:1.45;margin-top:2px}
.cps-home{position:relative;display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;font-size:13.5px;font-weight:500;color:#374151;text-decoration:none;margin:2px 0 4px}
.cps-home:hover{background:#f7f5f1;color:#16181d}
.cps-home.is-current{background:#f4f0eb;color:#16181d;font-weight:600}
.cps-home.is-current::before{content:"";position:absolute;left:-12px;top:6px;bottom:6px;width:3px;border-radius:0 3px 3px 0;background:var(--accent)}
.cps-main{min-width:0;padding:28px 32px 56px}
.cps-content{max-width:1240px;margin:0 auto}
.cps-foot{margin-top:32px;display:grid;gap:14px}
.cps-scrim{display:none}
.cps-menu-btn{align-items:center;gap:6px;flex:none;font:inherit;font-size:13px;font-weight:600;height:34px;padding:0 10px;border:1px solid #d9d5cd;border-radius:6px;background:#fff;color:#16181d;cursor:pointer}
.cps.is-wide .cps-body{grid-template-columns:minmax(0,1fr)}
.cps.is-wide .cps-main{overflow-x:clip}
.cps.is-wide .cps-menu{display:inline-flex}
.cps.is-wide .cps-side{position:fixed;top:var(--bar);left:0;bottom:0;height:auto;width:min(86vw,320px);z-index:45;transform:translateX(-102%);transition:transform .2s ease;box-shadow:0 10px 30px rgba(17,24,39,.18)}
.cps.is-wide .cps-side.is-open{transform:none}
.cps.is-wide .cps-scrim{display:block;position:fixed;inset:var(--bar) 0 0 0;background:rgba(17,24,39,.35);z-index:44;border:0;padding:0}
@media (max-width:1023px){
  .cps-bar{padding:0 12px;gap:10px}
  .cps-menu{display:inline-flex}
  .cps-logo{display:none}
  .cps-dash span{display:none}
  .cps-dash{padding:0 9px}
  .cps-body{grid-template-columns:minmax(0,1fr)}
  .cps-side{position:fixed;top:var(--bar);left:0;bottom:0;height:auto;width:min(86vw,320px);z-index:45;transform:translateX(-102%);transition:transform .2s ease;box-shadow:0 10px 30px rgba(17,24,39,.18)}
  .cps-side.is-open{transform:none}
  .cps-scrim{display:block;position:fixed;inset:var(--bar) 0 0 0;background:rgba(17,24,39,.35);z-index:44;border:0;padding:0}
  .cps-main{padding:20px 16px 48px}
  .cps-tabs{padding:0 6px}
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

export interface ShellTab { href: string; label: string; active: boolean }

export function CoursePlayerShell({
  accent,
  banner,
  sidebar,
  aside,
  headerRight,
  menuLabel,
  crumb,
  homeHref,
  tabs,
  children,
}: {
  accent: string;
  /** Kept for older callers; the shell no longer draws gradients. */
  accent2?: string;
  banner?: ShellBanner;
  /** The section menu. Pages without one (Career Library, My Progress) are always full width. */
  sidebar?: React.ReactNode;
  /** Shown under the page content (next/previous, notes). */
  aside?: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Label for the menu button. */
  menuLabel?: string;
  /** The current page, shown last in the breadcrumbs. */
  crumb?: string;
  /** The section's home page, pinned as "Overview" at the top of the menu. */
  homeHref?: string;
  /** The section's parts, as tabs under the top bar. */
  tabs?: ShellTab[];
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  // Tools read the signed-in student's own saved data on their first render
  // (lib/progress/userStorage.ts), so they wait until sign-in has resolved.
  const { loading } = useAuth();
  // Close the menu once a link in it has been followed, or on Escape.
  useEffect(() => setSidebarOpen(false), [pathname]);
  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSidebarOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sidebarOpen]);

  const onHome = !!homeHref && pathname === homeHref;
  const sectionHref = homeHref ?? banner?.backHref ?? "/account";
  // A section's home page is full width; its menu opens as a drawer.
  const wide = !sidebar || onHome;

  return (
    <div className={`cps fx${wide ? " is-wide" : ""}${tabs?.length ? " has-tabs" : ""}`} style={{ ["--accent" as string]: accent }}>
      <style dangerouslySetInnerHTML={{ __html: SHELL_CSS + FX_CSS + FP_CSS }} />

      <header className="cps-head">
        <div className="cps-bar">
          {sidebar && (
            <button className="cps-menu cps-menu-btn" onClick={() => setSidebarOpen((v) => !v)} aria-expanded={sidebarOpen} aria-controls="cps-side">
              <Icon name={sidebarOpen ? "close" : "menu"} size={16} stroke={2} />
              {sidebarOpen ? "Close" : "Menu"}
            </button>
          )}
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
            {pathname !== "/account/progress" && (
              <Link href="/account/progress" className="cps-dash"><Icon name="score" size={15} stroke={2} /><span>My progress</span></Link>
            )}
            <Link href="/account" className="cps-dash"><Icon name="home" size={15} stroke={2} /><span>Dashboard</span></Link>
          </div>
        </div>
        {tabs && tabs.length > 0 && (
          <nav className="cps-tabs" aria-label={`${banner?.title ?? "Section"} parts`}>
            {tabs.map((t) => <Link key={t.href + t.label} href={t.href} aria-current={t.active ? "page" : undefined}>{t.label}</Link>)}
          </nav>
        )}
      </header>

      <div className="cps-body">
        {sidebar && (
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
        )}
        {sidebar && sidebarOpen && <button className="cps-scrim" aria-label="Close menu" onClick={() => setSidebarOpen(false)} />}

        <main className="cps-main">
          <div className="cps-content">
            {loading ? (
              <div role="status" style={{ padding: "48px 16px", textAlign: "center", fontSize: 13.5, color: "#7b808b" }}>Loading your progress…</div>
            ) : (
              <>
                {children}
                {aside && !onHome && <div className="cps-foot">{aside}</div>}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
