"use client";

import { useEffect, useRef, type ReactNode } from "react";

const DIALOG_CSS = `
.dlg-back{position:fixed;inset:0;z-index:80;background:rgba(15,23,42,.45);display:flex;align-items:flex-start;justify-content:center;padding:6vh 16px 16px;overflow-y:auto}
.dlg{position:relative;width:100%;max-width:var(--dlg-w,720px);background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(15,23,42,.25);outline:none}
.dlg-x{position:absolute;top:12px;right:12px;width:34px;height:34px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;color:#334155;font-size:18px;line-height:1;cursor:pointer;display:grid;place-items:center}
.dlg-x:hover{background:#f1f5f9}
.dlg-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 18px;border-top:1px solid #e2e8f0}
@media (max-width:640px){.dlg-back{padding:0}.dlg{border-radius:0;min-height:100%}}
`;

/** A focused reading panel over the page: closes on Esc, the backdrop or the
 *  close button, and keeps the page behind from scrolling while open. */
export function Dialog({
  open,
  onClose,
  label,
  width = 720,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** Accessible name for the dialog. */
  label: string;
  width?: number;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="dlg-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <style dangerouslySetInnerHTML={{ __html: DIALOG_CSS }} />
      <div ref={ref} className="dlg" role="dialog" aria-modal="true" aria-label={label} tabIndex={-1} style={{ ["--dlg-w" as string]: `${width}px` }}>
        <button type="button" className="dlg-x" onClick={onClose} aria-label="Close">×</button>
        {children}
        {footer && <div className="dlg-foot">{footer}</div>}
      </div>
    </div>
  );
}
