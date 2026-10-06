/**
 * The areas of the app that active time is counted under, shared by the
 * tracker that records it (components/ActivityTracker.tsx) and every screen
 * that reports it (the institution portal).
 */

export interface ActivityArea {
  key: string;
  label: string;
  /** Path prefixes that belong to this area. */
  paths: string[];
}

export const ACTIVITY_AREAS: ActivityArea[] = [
  { key: "assessment", label: "Assessment", paths: ["/"] },
  { key: "dashboard", label: "Dashboard & report", paths: ["/account", "/report", "/r"] },
  { key: "careers", label: "Career library", paths: ["/account/career-library", "/account/features/careers", "/careers", "/dashboard/career-library"] },
  { key: "exams", label: "Entrance exams", paths: ["/account/exams", "/account/features/entrance-exams", "/dashboard/exams"] },
  { key: "scholarships", label: "Scholarships", paths: ["/account/scholarships", "/account/features/scholarships"] },
  { key: "study_abroad", label: "Study abroad", paths: ["/account/study-abroad", "/account/features/study-abroad", "/dashboard/abroad-applications", "/dashboard/abroad-colleges"] },
  { key: "money", label: "Money skills", paths: ["/account/money", "/account/features/financial-literacy"] },
  { key: "legal", label: "Legal rights", paths: ["/account/legal", "/account/features/legal-resources"] },
  { key: "research", label: "Research", paths: ["/account/research", "/account/features/research"] },
  { key: "startups", label: "Startups", paths: ["/account/startups", "/account/features/startups"] },
  { key: "internships", label: "Internships", paths: ["/account/internships", "/account/internships-new", "/account/features/internships", "/dashboard/internships"] },
  { key: "portfolio", label: "Portfolio", paths: ["/account/portfolio", "/portfolio"] },
  { key: "passport", label: "Career Passport", paths: ["/account/passport"] },
  { key: "test_drive", label: "Career Test-Drive", paths: ["/account/test-drive"] },
  { key: "decision", label: "Family Decision Room", paths: ["/account/decision-room"] },
  { key: "gps", label: "Career GPS", paths: ["/account/gps"] },
];

export const AREA_LABEL: Record<string, string> = Object.fromEntries([...ACTIVITY_AREAS.map((a) => [a.key, a.label]), ["other", "Other pages"]]);

/** The area a path belongs to - the longest matching prefix wins, so
 *  "/account/legal/guides" is Legal, not the dashboard. */
export function areaForPath(pathname: string): string {
  let best = "other";
  let bestLen = -1;
  for (const a of ACTIVITY_AREAS) {
    for (const p of a.paths) {
      const hit = p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(`${p}/`);
      if (hit && p.length > bestLen) { best = a.key; bestLen = p.length; }
    }
  }
  return best;
}

/** Firestore key for a calendar day: "d20261006" (local date). */
export function dayKey(d: Date = new Date()): string {
  return `d${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

/** Day keys for the last `n` days, oldest first, ending today. */
export function lastDays(n: number, today: Date = new Date()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}

/** "d20261006" -> "6 Oct". */
export function dayLabel(key: string): string {
  const y = Number(key.slice(1, 5)), m = Number(key.slice(5, 7)) - 1, d = Number(key.slice(7, 9));
  return new Date(y, m, d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
