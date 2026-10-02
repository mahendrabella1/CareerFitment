/**
 * Which matched scholarships deserve a deadline alert right now - same
 * visit-triggered approach as lib/exams/alertLogic.ts (no cron
 * infrastructure in this app).
 */
import type { ScholarshipDef } from "@/data/scholarships/scholarships";

export interface DueScholarshipAlert {
  scholarshipSlug: string;
  scholarshipName: string;
  eventKind: string;
  message: string;
}

/** Only fires for scholarships with a real, parseable closesAt date -
 *  most Phase 1 entries only have a deadlineNote string ("Check official
 *  site"), which correctly never triggers an alert rather than guessing. */
export function dueScholarshipAlerts(
  matched: { scholarship: ScholarshipDef; closesAt: Date | null }[],
  alertsSent: Set<string>,
  now: Date = new Date()
): DueScholarshipAlert[] {
  const DAY = 86_400_000;
  const out: DueScholarshipAlert[] = [];
  for (const { scholarship, closesAt } of matched) {
    if (!closesAt) continue;
    const days = Math.round((closesAt.getTime() - now.getTime()) / DAY);
    for (const [threshold, kind] of [[14, "close14"], [7, "close7"], [2, "close2"]] as const) {
      if (days === threshold) {
        const key = `${scholarship.slug}:${kind}`;
        if (!alertsSent.has(key)) {
          out.push({ scholarshipSlug: scholarship.slug, scholarshipName: scholarship.name, eventKind: kind, message: `${scholarship.name} closes in ${threshold} days.` });
        }
      }
    }
  }
  return out;
}
