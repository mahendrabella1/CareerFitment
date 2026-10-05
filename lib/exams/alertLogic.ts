/**
 * Pure logic for which followed-exam events deserve an alert right now -
 * shared by the client (no "use client" needed, no Firestore/DOM access).
 * Mirrors the spec's own alert triggers (regOpen today, regClose in 7 or 2
 * days) but evaluated on each visit to /account/exams instead of by a daily
 * cron job, since this app has none.
 */
import type { ExamDef, ExamEvent } from "@/data/exams/exams";

export interface DueAlert {
  examSlug: string;
  examName: string;
  event: ExamEvent;
  eventKind: string; // dedup key suffix, e.g. "regClose7", "regClose2", "regOpen"
  message: string;
}

function daysUntil(dateIso: string, now: Date): number {
  const d = new Date(dateIso);
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function dueAlerts(followedExams: ExamDef[], alertsSent: Set<string>, now: Date = new Date()): DueAlert[] {
  const out: DueAlert[] = [];
  for (const exam of followedExams) {
    for (const event of exam.events) {
      if (event.kind === "regOpen") {
        const days = daysUntil(event.date, now);
        if (days === 0) {
          const key = `${exam.slug}:regOpen`;
          if (!alertsSent.has(key)) out.push({ examSlug: exam.slug, examName: exam.name, event, eventKind: "regOpen", message: `${exam.name} registration is open today.` });
        }
      }
      if (event.kind === "regClose") {
        const days = daysUntil(event.date, now);
        if (days === 7) {
          const key = `${exam.slug}:regClose7`;
          if (!alertsSent.has(key)) out.push({ examSlug: exam.slug, examName: exam.name, event, eventKind: "regClose7", message: `${exam.name} registration closes in 7 days.` });
        }
        if (days === 2) {
          const key = `${exam.slug}:regClose2`;
          if (!alertsSent.has(key)) out.push({ examSlug: exam.slug, examName: exam.name, event, eventKind: "regClose2", message: `${exam.name} registration closes in 2 days.` });
        }
      }
    }
  }
  return out;
}

/** Upcoming (not-yet-passed) events across every followed exam, soonest
 *  first - what the Deadline Radar actually renders. */
export function upcomingEvents(followedExams: ExamDef[], now: Date = new Date()): { exam: ExamDef; event: ExamEvent; daysAway: number }[] {
  const out: { exam: ExamDef; event: ExamEvent; daysAway: number }[] = [];
  for (const exam of followedExams) {
    for (const event of exam.events) {
      const daysAway = daysUntil(event.date, now);
      // A multi-day window (e.g. an exam spread over two weeks) stays on the radar until it ends.
      const daysToEnd = event.endDate ? daysUntil(event.endDate, now) : daysAway;
      if (daysToEnd >= 0) out.push({ exam, event, daysAway: Math.max(0, daysAway) });
    }
  }
  return out.sort((a, b) => a.daysAway - b.daysAway);
}
