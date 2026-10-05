/**
 * Builds .ics calendar files in the browser so learners can add deadlines to
 * their own calendar (Google, Apple, Outlook). Nothing is uploaded; the file
 * is generated and downloaded on the device.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const icsDate = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const icsEscape = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export interface IcsEvent {
  title: string;
  description: string;
  date: Date; // all-day event on this date
  url?: string;
  /** Days before the date to show a reminder (default: 7). */
  remindDaysBefore?: number[];
}

/** One or more all-day events with reminders. */
export function buildIcsCalendar(events: IcsEvent[], name = "OneGrasp deadlines"): string {
  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//OneGrasp//${icsEscape(name)}//EN`, "CALSCALE:GREGORIAN"];
  for (const e of events) {
    const end = new Date(e.date.getFullYear(), e.date.getMonth(), e.date.getDate() + 1);
    const uid = `${icsDate(e.date)}-${Math.random().toString(36).slice(2, 10)}@onegrasp`;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(e.date)}`,
      `DTEND;VALUE=DATE:${icsDate(end)}`,
      `SUMMARY:${icsEscape(e.title)}`,
      `DESCRIPTION:${icsEscape(e.description)}`,
    );
    if (e.url) lines.push(`URL:${e.url}`);
    for (const days of e.remindDaysBefore ?? [7]) {
      lines.push("BEGIN:VALARM", `TRIGGER:-P${days}D`, "ACTION:DISPLAY", `DESCRIPTION:${icsEscape(`${days} day${days === 1 ? "" : "s"} left: ${e.title}`)}`, "END:VALARM");
    }
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR", "");
  return lines.join("\r\n");
}

/** A one-event calendar file with a reminder 7 days before. */
export function buildIcs(title: string, description: string, due: Date): string {
  return buildIcsCalendar([{ title, description, date: due, remindDaysBefore: [7] }]);
}

/** Downloads text as a file. Browser only. */
export function downloadFile(filename: string, text: string, type = "text/calendar") {
  const blob = new Blob([text], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
