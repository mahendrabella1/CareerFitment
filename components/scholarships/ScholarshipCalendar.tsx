"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SCHOLARSHIPS, cycleDate, liveStatus, type ScholarshipDef } from "@/data/scholarships/scholarships";
import { evaluate } from "@/lib/scholarships/eligibility";
import { fetchScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";
import { fetchApplications, type ApplicationStatus, type ScholarshipApplication } from "@/lib/scholarships/clientApplications";
import { buildIcsCalendar, downloadFile, type IcsEvent } from "@/lib/calendar/ics";

const ACCENT = "#166534";
const DAY = 86_400_000;

type EventKind = "opens" | "closes" | "verify" | "l2verify";
const KIND_LABEL: Record<EventKind, string> = {
  opens: "Applications open",
  closes: "Last date to apply",
  verify: "College/school verification deadline",
  l2verify: "District/state verification deadline",
};
const KIND_STYLE: Record<EventKind, { bg: string; fg: string }> = {
  opens: { bg: "#e0e7ff", fg: "#3730a3" },
  closes: { bg: "#fee2e2", fg: "#991b1b" },
  verify: { bg: "#fef3c7", fg: "#92400e" },
  l2verify: { bg: "#f1f5f9", fg: "#475569" },
};
const STATUS_META: Record<ApplicationStatus, { label: string; color: string }> = {
  not_started: { label: "Not started", color: "#64748b" },
  in_progress: { label: "In progress", color: "#2563eb" },
  submitted: { label: "Submitted", color: "#7c3aed" },
  verification_pending: { label: "Verification pending", color: "#b45309" },
  selected: { label: "Selected", color: "#166534" },
  rejected: { label: "Not selected", color: "#991b1b" },
};

interface CalEvent {
  key: string;
  date: Date;
  kind: EventKind;
  scholarship: ScholarshipDef;
}

function buildEvents(list: ScholarshipDef[]): CalEvent[] {
  const out: CalEvent[] = [];
  for (const s of list) {
    const c = s.cycle;
    if (!c) continue;
    const pairs: [EventKind, string | undefined][] = [["opens", c.opensAt], ["closes", c.closesAt], ["verify", c.verifyBy], ["l2verify", c.l2VerifyBy]];
    for (const [kind, iso] of pairs) {
      const d = cycleDate(iso);
      if (d) out.push({ key: `${s.slug}-${kind}`, date: d, kind, scholarship: s });
    }
  }
  return out.sort((a, b) => a.date.getTime() - b.date.getTime() || a.scholarship.name.localeCompare(b.scholarship.name));
}

const fmtDay = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
const monthKey = (d: Date) => d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export function ScholarshipCalendar() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredScholarshipProfile | null>(null);
  const [apps, setApps] = useState<Record<string, ScholarshipApplication>>({});
  const [onlyMine, setOnlyMine] = useState(false);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    fetchScholarshipProfile(user.uid).then((p) => {
      setProfile(p);
      if (p) setOnlyMine(true);
    });
    fetchApplications(user.uid).then(setApps).catch(() => setApps({}));
  }, [user?.uid]);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const list = useMemo(() => {
    if (!onlyMine || !profile) return SCHOLARSHIPS;
    return SCHOLARSHIPS.filter((s) => evaluate(s.rules, profile).verdict !== "NOT_ELIGIBLE" || apps[s.slug]);
  }, [onlyMine, profile, apps]);

  const events = useMemo(() => buildEvents(list), [list]);
  const upcoming = events.filter((e) => e.date >= today);
  const past = events.filter((e) => e.date < today);
  const thisWeek = upcoming.filter((e) => (e.date.getTime() - today.getTime()) / DAY <= 7);
  const thisMonth = upcoming.filter((e) => {
    const days = (e.date.getTime() - today.getTime()) / DAY;
    return days > 7 && days <= 31;
  });
  const later = upcoming.filter((e) => (e.date.getTime() - today.getTime()) / DAY > 31);
  const laterByMonth = later.reduce<Record<string, CalEvent[]>>((acc, e) => {
    (acc[monthKey(e.date)] ||= []).push(e);
    return acc;
  }, {});
  const undated = list.filter((s) => !s.cycle?.closesAt && liveStatus(s) !== "closed");

  const exportAll = () => {
    const ics: IcsEvent[] = upcoming
      .filter((e) => e.kind === "closes" || e.kind === "verify")
      .map((e) => ({
        title: `${e.kind === "closes" ? "Last date" : "Verification deadline"}: ${e.scholarship.name}`,
        description: `${e.scholarship.amountText}. Apply via ${e.scholarship.applyVia}. ${e.scholarship.cycle?.tentative ? "Date as reported; confirm on the official site." : "Date from the official portal."}`,
        date: e.date,
        url: e.scholarship.officialUrl,
        remindDaysBefore: e.kind === "closes" ? [14, 7, 2] : [7, 2],
      }));
    if (ics.length) downloadFile("scholarship-deadlines.ics", buildIcsCalendar(ics, "Scholarship deadlines"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={() => setOnlyMine(false)} style={chip(!onlyMine)}>All scholarships</button>
        <button
          onClick={() => setOnlyMine(true)}
          disabled={!profile}
          title={profile ? "" : "Fill in your scholarship profile first"}
          style={{ ...chip(onlyMine), opacity: profile ? 1 : 0.5, cursor: profile ? "pointer" : "not-allowed" }}
        >
          Only my matches
        </button>
        <button onClick={exportAll} style={{ marginLeft: "auto", fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 9, padding: "9px 14px", cursor: "pointer" }}>
          Add upcoming deadlines to my calendar
        </button>
      </div>
      {!profile && (
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          <Link href="/account/scholarships/dashboard" style={{ color: ACCENT, fontWeight: 800 }}>Fill in your profile</Link> to see only the scholarships you can apply for.
        </p>
      )}
      <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
        Official dates come from each portal. Dates marked <b>reported</b> come from news coverage of the launch, so confirm them on the official site. The calendar file adds reminders 14, 7 and 2 days before each last date.
      </p>

      <Section title="This week" events={thisWeek} apps={apps} today={today} empty="Nothing closes in the next 7 days." />
      <Section title="This month" events={thisMonth} apps={apps} today={today} empty="Nothing else falls in the next month." />
      {Object.entries(laterByMonth).map(([m, evs]) => (
        <Section key={m} title={m} events={evs} apps={apps} today={today} />
      ))}

      {undated.length > 0 && (
        <section style={panel}>
          <h2 style={h2}>Dates to watch (no fixed date yet)</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {undated.map((s) => (
              <Link key={s.slug} href={`/account/scholarships/${s.slug}`} style={{ textDecoration: "none", borderTop: "1px solid #f1f5f9", paddingTop: 8 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{s.name}</div>
                <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5 }}>{s.deadlineNote}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section style={panel}>
          <button onClick={() => setShowPast((v) => !v)} style={{ fontSize: 13, fontWeight: 800, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {showPast ? "Hide" : "Show"} {past.length} past date{past.length === 1 ? "" : "s"} from this cycle
          </button>
          {showPast && (
            <div style={{ marginTop: 10 }}>
              <EventRows events={[...past].reverse()} apps={apps} today={today} />
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function Section({ title, events, apps, today, empty }: { title: string; events: CalEvent[]; apps: Record<string, ScholarshipApplication>; today: Date; empty?: string }) {
  if (!events.length && !empty) return null;
  return (
    <section style={panel}>
      <h2 style={h2}>{title}</h2>
      {events.length ? <EventRows events={events} apps={apps} today={today} /> : <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{empty}</p>}
    </section>
  );
}

function EventRows({ events, apps, today }: { events: CalEvent[]; apps: Record<string, ScholarshipApplication>; today: Date }) {
  // Group by date so one closing day with many NSP schemes reads as one block.
  const byDate = events.reduce<{ date: Date; items: CalEvent[] }[]>((acc, e) => {
    const last = acc[acc.length - 1];
    if (last && last.date.getTime() === e.date.getTime()) last.items.push(e);
    else acc.push({ date: e.date, items: [e] });
    return acc;
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {byDate.map(({ date, items }) => {
        const days = Math.round((date.getTime() - today.getTime()) / DAY);
        return (
          <div key={date.toISOString()}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline", flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: "#0f172a" }}>{fmtDay(date)}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: days < 0 ? "#94a3b8" : days <= 7 ? "#b45309" : "#64748b" }}>
                {days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? "Today" : `in ${days} day${days === 1 ? "" : "s"}`}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {items.map((e) => {
                const app = apps[e.scholarship.slug];
                const st = app ? STATUS_META[app.status] : null;
                return (
                  <Link key={e.key} href={`/account/scholarships/${e.scholarship.slug}`} style={{ textDecoration: "none", display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", border: "1px solid #f1f5f9", borderRadius: 10, padding: "8px 10px" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: KIND_STYLE[e.kind].fg, background: KIND_STYLE[e.kind].bg, borderRadius: 999, padding: "2px 8px", flex: "none" }}>{KIND_LABEL[e.kind]}</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", flex: "1 1 200px", minWidth: 0 }}>{e.scholarship.name}</span>
                    {e.scholarship.cycle?.tentative && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 700 }}>reported</span>}
                    {st && <span style={{ fontSize: 11, fontWeight: 800, color: st.color }}>● {st.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 10px" };
const chip = (active: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: active ? "#fff" : "#334155",
  background: active ? ACCENT : "#fff",
  border: `1px solid ${active ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 13px",
  cursor: "pointer",
});
