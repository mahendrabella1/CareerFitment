import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/app/Icons";

/**
 * The shared look of every feature section (Legal, Scholarships, Exams,
 * Study Abroad, Research, Money, Startups). Injected once by
 * CoursePlayerShell on its root (class "fx"), which also sets --accent and
 * --accent2 for the section, so pages only add class names:
 *
 *   PageHeader      the title block at the top of every page
 *   .fx-card        a white card (border, radius, soft shadow)
 *   .fx-lift        hover lift for anything clickable
 *   .fx-chip        a filter pill (aria-pressed="true" when selected)
 *   .fx-btn / .fx-btn-primary / .fx-btn-ghost
 *   .fx-section     a small section heading with an accent bar
 */
export const FX_CSS = `
.fx{color:#0f172a}
.fx h1,.fx h2,.fx h3{font-family:"Plus Jakarta Sans",Inter,system-ui,sans-serif;letter-spacing:-.015em}
.fx ::selection{background:color-mix(in srgb,var(--accent) 22%,#fff)}
.fx input[type=checkbox],.fx input[type=radio],.fx input[type=range]{accent-color:var(--accent)}
.fx input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),.fx select,.fx textarea{transition:border-color .15s,box-shadow .15s}
.fx input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]):focus,.fx select:focus,.fx textarea:focus{outline:none;border-color:var(--accent)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 18%,transparent)!important}
.fx button:focus-visible,.fx a:focus-visible{outline:2px solid var(--accent);outline-offset:2px}

.fx-card{background:#fff;border:1px solid #e7eaf2;border-radius:16px;box-shadow:0 1px 2px rgba(15,23,42,.04)}
.fx-lift{transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;box-shadow:0 1px 2px rgba(15,23,42,.05)}
.fx-lift:hover{transform:translateY(-2px);box-shadow:0 14px 28px -14px rgba(15,23,42,.22),0 2px 6px rgba(15,23,42,.05)}

.fx-chip{font:inherit;font-size:12.5px;font-weight:700;padding:7px 14px;border-radius:999px;border:1px solid #e2e7f0;background:#fff;color:#475569;cursor:pointer;transition:all .15s}
.fx-chip:hover{border-color:color-mix(in srgb,var(--accent) 45%,#fff);color:var(--accent)}
.fx-chip[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:#fff;box-shadow:0 6px 14px -8px var(--accent)}

.fx-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;font:inherit;font-size:13.5px;font-weight:800;padding:10px 16px;border-radius:11px;border:1px solid #e2e7f0;background:#fff;color:#0f172a;cursor:pointer;text-decoration:none;transition:all .15s}
.fx-btn:hover{border-color:color-mix(in srgb,var(--accent) 45%,#fff);color:var(--accent)}
.fx-btn-primary{background:linear-gradient(135deg,var(--accent),var(--accent2,var(--accent)));border-color:transparent;color:#fff;box-shadow:0 10px 20px -12px var(--accent)}
.fx-btn-primary:hover{color:#fff;filter:brightness(1.06);box-shadow:0 14px 26px -12px var(--accent)}
.fx-btn-ghost{background:transparent;border-color:transparent;color:var(--accent)}

.fx-section{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;margin:0 0 12px}
.fx-section::before{content:"";width:14px;height:3px;border-radius:3px;background:var(--accent)}

.fx-ph{margin:2px 0 24px}
.fx-ph-back{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:700;color:#64748b;text-decoration:none;padding:5px 12px 5px 9px;border-radius:999px;background:#fff;border:1px solid #e6e9f2;margin-bottom:14px;transition:all .15s}
.fx-ph-back:hover{color:var(--accent);border-color:color-mix(in srgb,var(--accent) 35%,#fff)}
.fx-ph-row{display:flex;align-items:flex-start;gap:16px;flex-wrap:wrap}
.fx-ph-ic{flex:none;width:54px;height:54px;border-radius:16px;display:grid;place-items:center;color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent2,var(--accent)));box-shadow:0 12px 24px -12px var(--accent)}
.fx-ph-text{flex:1 1 320px;min-width:0}
.fx-ph-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:6px}
.fx-ph-title{font-size:30px;line-height:1.15;font-weight:800;letter-spacing:-.025em;color:#0b1220;margin:0;text-wrap:balance}
.fx-ph-sub{font-size:15px;line-height:1.6;color:#55607a;margin:8px 0 0;max-width:760px}
.fx-ph-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.fx-ph-meta>span{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#334155;background:#fff;border:1px solid #e6e9f2;border-radius:999px;padding:5px 11px}
.fx-ph-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center;align-self:center}
@media (max-width:640px){.fx-ph-title{font-size:24px}.fx-ph-ic{width:44px;height:44px;border-radius:13px}.fx-ph-row{gap:12px}}
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
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: ReactNode;
  /** Icon name from app/Icons.tsx, shown in a gradient tile. */
  icon?: string;
  back?: { href: string; label: string };
  /** Small facts shown as pills under the subtitle. */
  meta?: ReactNode[];
  /** Buttons on the right (they wrap underneath on small screens). */
  actions?: ReactNode;
}) {
  return (
    <header className="fx-ph">
      {back && (
        <Link href={back.href} className="fx-ph-back">
          <Icon name="arrowLeft" size={14} stroke={2} />
          {back.label}
        </Link>
      )}
      <div className="fx-ph-row">
        {icon && (
          <span className="fx-ph-ic" aria-hidden="true">
            <Icon name={icon} size={26} stroke={1.8} />
          </span>
        )}
        <div className="fx-ph-text">
          {eyebrow && <div className="fx-ph-eyebrow">{eyebrow}</div>}
          <h1 className="fx-ph-title">{title}</h1>
          {subtitle && <p className="fx-ph-sub">{subtitle}</p>}
          {meta && meta.length > 0 && <div className="fx-ph-meta">{meta.map((m, i) => <span key={i}>{m}</span>)}</div>}
        </div>
        {actions && <div className="fx-ph-actions">{actions}</div>}
      </div>
    </header>
  );
}
