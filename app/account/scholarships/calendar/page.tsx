import { ScholarshipCalendar } from "@/components/scholarships/ScholarshipCalendar";
import { PageHeader } from "@/components/course/fx";

export default function ScholarshipCalendarPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <PageHeader icon="calendar" eyebrow="Never miss a date" title="Deadline calendar"
        subtitle={<>Most Indian scholarship deadlines fall between July and November. Missing one date can cost a whole year&apos;s money, so plan backwards from the last date and leave time for your college to verify NSP forms.</>} />
      <ScholarshipCalendar />
    </div>
  );
}
