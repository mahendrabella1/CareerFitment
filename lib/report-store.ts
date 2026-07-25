/**
 * Local report cache used by the career-counselling dashboard module. Reads a
 * previously-saved report id / report from the browser's localStorage. Returns
 * null when nothing is stored (the module then shows its "no report" state).
 */
import type { PsychometricProfile } from "@/lib/psychometric";

const LAST_ID_KEY = "og:lastReportId";
const reportKey = (id: string) => `og:report:${id}`;

export function getLastReportId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_ID_KEY);
  } catch {
    return null;
  }
}

export function getLocalReport(id: string): PsychometricProfile | null {
  if (typeof window === "undefined" || !id) return null;
  try {
    const raw = window.localStorage.getItem(reportKey(id));
    return raw ? (JSON.parse(raw) as PsychometricProfile) : null;
  } catch {
    return null;
  }
}

export function saveLocalReport(id: string, report: PsychometricProfile): void {
  if (typeof window === "undefined" || !id) return;
  try {
    window.localStorage.setItem(reportKey(id), JSON.stringify(report));
    window.localStorage.setItem(LAST_ID_KEY, id);
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}
