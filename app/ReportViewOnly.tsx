"use client";

/**
 * ViewOnlyReport — makes a report page read-on-screen only.
 *
 * The career report is delivered as a PDF by email (see
 * /api/admin/send-report, which renders it server-side with
 * @react-pdf/renderer). The on-screen version is for reading, so no surface
 * offers a download and the browser's own print path doesn't produce a usable
 * copy either: printing swaps the whole page for a short note pointing at the
 * emailed PDF.
 *
 * This is a deterrent, not a lock — a determined reader can still screenshot or
 * strip the CSS. It exists so there is one canonical copy of a student's report
 * (the emailed one) rather than stale printouts in circulation.
 *
 * The notice is appended straight to <body> as a plain DOM node rather than a
 * React portal: it has to be a *direct child of body* for the print rule below
 * to leave it standing while everything else is hidden, and doing it this way
 * needs no react-dom types and raises no hydration questions (it only ever
 * exists client-side).
 */

import { useEffect } from "react";

const BODY_CLASS = "og-view-only";
const NOTICE_CLASS = "og-print-notice";

const CSS = `
.${NOTICE_CLASS}{display:none}
@media print{
  body.${BODY_CLASS}{background:#fff !important}
  /* Blank the page, then re-show only the notice. */
  body.${BODY_CLASS} > *{display:none !important}
  body.${BODY_CLASS} > .${NOTICE_CLASS}{
    display:flex !important;align-items:center;justify-content:center;
    min-height:92vh;padding:0 18mm;text-align:center;
    font-family:Inter,system-ui,Segoe UI,sans-serif;color:#141417;
  }
  body.${BODY_CLASS} > .${NOTICE_CLASS} h2{font-size:19pt;font-weight:800;margin:0 0 10pt;letter-spacing:-.01em}
  body.${BODY_CLASS} > .${NOTICE_CLASS} p{font-size:11pt;line-height:1.6;color:#3d3d45;margin:0 auto;max-width:78mm}
  body.${BODY_CLASS} > .${NOTICE_CLASS} .og-pn-mark{font-size:10pt;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#F2555A;margin-bottom:14pt}
  @page{margin:16mm}
}`;

const NOTICE_HTML = `
  <div>
    <div class="og-pn-mark">OneGrasp</div>
    <h2>This report is view-only.</h2>
    <p>
      A PDF copy has been emailed to you — check your inbox (and your spam folder).
      If it hasn't arrived, write to support@onegrasp.com and we'll resend it.
    </p>
  </div>`;

export default function ViewOnlyReport() {
  useEffect(() => {
    document.body.classList.add(BODY_CLASS);

    // Belt and braces: clear any stray notice from a previous mount so two
    // never stack up in the print output.
    document.querySelectorAll(`.${NOTICE_CLASS}`).forEach((n) => n.remove());

    const notice = document.createElement("div");
    notice.className = NOTICE_CLASS;
    notice.setAttribute("role", "note");
    // Static markup defined above — no user or report data flows in here.
    notice.innerHTML = NOTICE_HTML;
    document.body.appendChild(notice);

    return () => {
      document.body.classList.remove(BODY_CLASS);
      notice.remove();
    };
  }, []);

  return <style dangerouslySetInnerHTML={{ __html: CSS }} />;
}
