import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/app/Icons";

/**
 * The shared look of every feature section (Legal, Scholarships, Exams,
 * Study Abroad, Research, Money, Startups). Injected once by
 * CoursePlayerShell on its root (class "fx"), which also sets --accent for
 * the section, so pages only add class names:
 *
 *   PageHeader      the title block at the top of every page
 *   .fx-card        a white card (thin border, no heavy shadow)
 *   .fx-lift        hover state for anything clickable
 *   .fx-chip        a filter pill (aria-pressed="true" when selected)
 *   .fx-btn / .fx-btn-primary / .fx-btn-ghost
 *   .fx-section     a small uppercase section heading
 *   .fx-narrow      centres a reading-width page (its own maxWidth) in the
 *                   content area, so it never leaves an empty right half
 *
 * Calm on purpose: neutral greys, one accent per section, no gradients.
 */
export const FX_CSS = `
.fx{color:#111827}
.fx h1,.fx h2,.fx h3{letter-spacing:-.01em}
.fx ::selection{background:color-mix(in srgb,var(--accent) 20%,#fff)}
.fx input[type=checkbox],.fx input[type=radio],.fx input[type=range]{accent-color:var(--accent)}
.fx input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),.fx select,.fx textarea{transition:border-color .15s,box-shadow .15s}
.fx input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):focus,.fx select:focus,.fx textarea:focus{outline:none;border-color:var(--accent)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)!important}
.fx button:focus-visible,.fx a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.fx-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px}
.fx-lift{transition:border-color .15s ease,box-shadow .15s ease}
.fx-lift:hover{border-color:#d1d5db;box-shadow:0 4px 14px rgba(17,24,39,.07)}

.fx-chip{font:inherit;font-size:13px;font-weight:500;padding:6px 13px;border-radius:999px;border:1px solid #e5e7eb;background:#fff;color:#374151;cursor:pointer;transition:border-color .15s,color .15s,background .15s}
.fx-chip:hover{border-color:#d1d5db;color:#111827}
.fx-chip[aria-pressed="true"]{background:color-mix(in srgb,var(--accent) 9%,#fff);border-color:color-mix(in srgb,var(--accent) 45%,#fff);color:var(--accent);font-weight:600}

.fx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font:inherit;font-size:13.5px;font-weight:600;padding:9px 15px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;cursor:pointer;text-decoration:none;line-height:1.2;transition:background .15s,border-color .15s,color .15s}
.fx-btn:hover{background:#f9fafb;border-color:#c4c9d2}
.fx-btn-primary{background:var(--accent);border-color:var(--accent);color:#fff}
.fx-btn-primary:hover{background:color-mix(in srgb,var(--accent) 88%,#000);border-color:color-mix(in srgb,var(--accent) 88%,#000);color:#fff}
.fx-btn-ghost{background:transparent;border-color:transparent;color:var(--accent)}
.fx-btn-ghost:hover{background:color-mix(in srgb,var(--accent) 8%,#fff);border-color:transparent}

.fx-section{font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#6b7280;margin:0 0 12px}
.fx-narrow{margin-left:auto;margin-right:auto}

.fx-ph{margin:0 0 24px}
.fx-ph-back{display:inline-flex;align-items:center;gap:6px;font-size:13px;font-weight:500;color:#4b5563;text-decoration:none;margin-bottom:14px}
.fx-ph-back:hover{color:#111827}
.fx-ph-grid{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:20px 28px;align-items:start}
.fx-ph-grid.has-aside{grid-template-columns:minmax(0,1fr) minmax(260px,380px)}
.fx-ph-row{display:flex;align-items:flex-start;gap:16px;min-width:0}
.fx-ph-ic{flex:none;width:52px;height:52px;border-radius:12px;display:grid;place-items:center;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,#fff)}
.fx-ph-text{flex:1;min-width:0}
.fx-ph-eyebrow{font-size:12px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--accent);margin-bottom:4px}
.fx-ph-title{font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-.02em;color:#111827;margin:0;text-wrap:balance}
.fx-ph-sub{font-size:15px;line-height:1.6;color:#4b5563;margin:6px 0 0;max-width:68ch}
.fx-ph-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.fx-ph-meta>span{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:500;color:#374151;background:#fff;border:1px solid #e5e7eb;border-radius:999px;padding:4px 10px}
.fx-ph-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:16px}
.fx-ph-aside{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;font-size:13.5px;color:#374151;line-height:1.55}
.fx-ph-aside-t{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:#111827;margin-bottom:6px}
.fx-ph-aside-t span{color:var(--accent);display:grid}
.fx-ph-aside ul{margin:0;padding-left:18px;display:flex;flex-direction:column;gap:4px}
@media (max-width:900px){.fx-ph-grid,.fx-ph-grid.has-aside{grid-template-columns:minmax(0,1fr)}}
@media (max-width:640px){.fx-ph-title{font-size:23px}.fx-ph-ic{width:42px;height:42px;border-radius:10px}.fx-ph-row{gap:12px}}
`;

/** The title block at the top of a feature page. */
export function PageHeader({
  title,
  subtitle,
  eyebrow,
  icon,
  back,
  meta,
  actions,
  aside,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  /** Icon name from app/Icons.tsx, shown in a tinted tile. */
  icon?: string;
  back?: { href: string; label: string };
  /** Small facts shown as pills under the subtitle. */
  meta?: ReactNode[];
  /** Buttons under the title - put the main call to action first. */
  actions?: ReactNode;
  /** A small card on the right, e.g. "What you'll learn" (see HeaderNote). */
  aside?: ReactNode;
}) {
  return (
    <header className="fx-ph">
      {back && (
        <Link href={back.href} className="fx-ph-back">
          <Icon name="arrowLeft" size={14} stroke={2} />
          {back.label}
        </Link>
      )}
      <div className={`fx-ph-grid${aside ? " has-aside" : ""}`}>
        <div className="fx-ph-row">
          {icon && (
            <span className="fx-ph-ic" aria-hidden="true">
              <Icon name={icon} size={24} stroke={1.8} />
            </span>
          )}
          <div className="fx-ph-text">
            {eyebrow && <div className="fx-ph-eyebrow">{eyebrow}</div>}
            <h1 className="fx-ph-title">{title}</h1>
            {subtitle && <p className="fx-ph-sub">{subtitle}</p>}
            {meta && meta.length > 0 && <div className="fx-ph-meta">{meta.map((m, i) => <span key={i}>{m}</span>)}</div>}
            {actions && <div className="fx-ph-actions">{actions}</div>}
          </div>
        </div>
        {aside}
      </div>
    </header>
  );
}

/** The small card beside a page title ("What you'll learn", "How to use it"). */
export function HeaderNote({ title, icon = "bulb", children }: { title: string; icon?: string; children: ReactNode }) {
  return (
    <aside className="fx-ph-aside">
      <div className="fx-ph-aside-t"><span aria-hidden="true"><Icon name={icon} size={18} stroke={1.9} /></span>{title}</div>
      {children}
    </aside>
  );
}
