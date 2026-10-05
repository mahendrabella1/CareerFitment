import { ScholarshipCalendar } from "@/components/scholarships/ScholarshipCalendar";

export default function ScholarshipCalendarPage() {
  return (
    <div style={{ maxWidth: 880 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color: "#166534", textTransform: "uppercase", letterSpacing: ".08em" }}>Never miss a date</div>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "6px 0 8px" }}>Deadline calendar</h1>
      <p style={{ fontSize: 14, color: "#475569", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
        Most Indian scholarship deadlines fall between July and November. Missing one date can cost a whole year&apos;s money, so plan backwards from the last date and leave time for your college to verify NSP forms.
      </p>
      <ScholarshipCalendar />
    </div>
  );
}
