"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SCHOLARSHIP_TYPE_LABEL, cycleDate, type ScholarshipDef } from "@/data/scholarships/scholarships";
import { evaluate } from "@/lib/scholarships/eligibility";
import { fetchScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";
import { saveApplication } from "@/lib/scholarships/clientApplications";
import { buildIcsCalendar, downloadFile, type IcsEvent } from "@/lib/calendar/ics";
import { StatusChip } from "@/components/scholarships/StatusChip";
import { PageHeader } from "@/components/course/fx";

const ACCENT = "#166534";
const fmt = (d: Date) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });

export function ScholarshipDetailClient({ scholarship }: { scholarship: ScholarshipDef }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredScholarshipProfile | null | undefined>(undefined);
  const [tracking, setTracking] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchScholarshipProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  const result = profile ? evaluate(scholarship.rules, profile) : null;
  const c = scholarship.cycle;
  const dates: { label: string; date: Date | null; note?: string }[] = c
    ? [
        { label: "Applications open", date: cycleDate(c.opensAt) },
        { label: "Last date to apply", date: cycleDate(c.closesAt) },
        { label: "College / school verification by", date: cycleDate(c.verifyBy), note: "Ask your institution to verify your NSP form well before this date." },
        { label: "District / state verification by", date: cycleDate(c.l2VerifyBy) },
      ].filter((d) => d.date)
    : [];

  const addToCalendar = () => {
    const events: IcsEvent[] = [];
    const closes = cycleDate(c?.closesAt);
    const verify = cycleDate(c?.verifyBy);
    if (closes) events.push({ title: `Last date: ${scholarship.name}`, description: `${scholarship.amountText}. Apply via ${scholarship.applyVia}. Check ${scholarship.officialUrl}`, date: closes, url: scholarship.officialUrl, remindDaysBefore: [14, 7, 2] });
    if (verify) events.push({ title: `Verification deadline: ${scholarship.name}`, description: "Your college or school must verify your application on NSP by this date.", date: verify, url: scholarship.officialUrl, remindDaysBefore: [7, 2] });
    if (events.length) downloadFile(`${scholarship.slug}-deadlines.ics`, buildIcsCalendar(events, scholarship.name));
  };

  return (
    <div style={{ maxWidth: 880, padding: "0 0 8px" }}>
      <PageHeader back={{ href: "/account/scholarships/dashboard", label: "Money you can apply for" }} icon="award"
        eyebrow={SCHOLARSHIP_TYPE_LABEL[scholarship.type]} actions={<StatusChip scholarship={scholarship} />}
        title={scholarship.name} subtitle={scholarship.provider} />
      <a href={scholarship.officialUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: ACCENT, fontWeight: 700, textDecoration: "none", display: "inline-block", marginTop: 8 }}>
        Official site: {scholarship.officialUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: 18 }}>
        <div style={box}>
          <div style={boxLabel}>Amount</div>
          <div style={boxValue}>{scholarship.amountText}</div>
        </div>
        <div style={box}>
          <div style={boxLabel}>Apply via</div>
          <div style={boxValue}>{scholarship.applyVia}</div>
          {scholarship.selection && <div style={{ fontSize: 12.5, color: "#475569", marginTop: 6 }}>Selection: {scholarship.selection}</div>}
        </div>
      </div>

      <div style={{ ...box, marginTop: 14 }}>
        <div style={boxLabel}>{c ? `${c.year} cycle` : "When to apply"}</div>
        <p style={{ fontSize: 13.5, color: "#334155", margin: "4px 0 0", lineHeight: 1.6 }}>{scholarship.deadlineNote}</p>
        {dates.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
            {dates.map((d) => (
              <div key={d.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", fontSize: 13.5, borderTop: "1px solid #f1f5f9", paddingTop: 6 }}>
                <span style={{ color: "#475569" }}>{d.label}</span>
                <span style={{ fontWeight: 800, color: "#0f172a", fontVariantNumeric: "tabular-nums" }}>{fmt(d.date as Date)}</span>
              </div>
            ))}
          </div>
        )}
        {c && (
          <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "10px 0 0", lineHeight: 1.5 }}>
            {c.tentative ? "Dates as reported; confirm on the official site before relying on them." : "Dates read from the official portal."}
            {c.note ? ` ${c.note}` : ""}
          </p>
        )}
        {(c?.closesAt || c?.verifyBy) && (
          <button onClick={addToCalendar} style={{ marginTop: 12, fontSize: 13, fontWeight: 800, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 9, padding: "8px 13px", cursor: "pointer" }}>
            Add these dates to my calendar (.ics)
          </button>
        )}
      </div>

      {scholarship.renewal && (
        <div style={{ ...box, marginTop: 14 }}>
          <div style={boxLabel}>To keep it every year</div>
          <p style={{ fontSize: 13.5, color: "#334155", margin: "4px 0 0", lineHeight: 1.6 }}>{scholarship.renewal}</p>
        </div>
      )}

      <div style={{ ...box, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 10 }}>Your eligibility</div>
        {!profile ? (
          <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
            <Link href="/account/scholarships/dashboard" style={{ color: ACCENT, fontWeight: 700 }}>Fill in your profile</Link> to see whether you qualify.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {result!.reasons.map((r, i) => (
              <div key={i} style={{ fontSize: 13, color: "#334155", padding: "8px 10px", borderRadius: 8, background: r.verdict === "ELIGIBLE" ? "#f0fdf4" : r.verdict === "NOT_ELIGIBLE" ? "#fef2f2" : "#f8fafc" }}>{r.reason}</div>
            ))}
          </div>
        )}
        <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, fontStyle: "italic" }}>
          Last checked {new Date(scholarship.checkedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} against{" "}
          <a href={scholarship.sourceUrl} target="_blank" rel="noreferrer" style={{ color: "#64748b" }}>{scholarship.sourceUrl.replace(/^https?:\/\//, "").split("/")[0]}</a>. Always confirm on the official site before applying.
        </p>
      </div>

      {user?.uid && (
        <button
          onClick={() => { saveApplication(user.uid, scholarship.slug, { status: "in_progress" }); setTracking(true); }}
          style={{ marginTop: 16, width: "100%", fontSize: 13.5, fontWeight: 700, padding: "12px 16px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", cursor: "pointer" }}
        >
          {tracking ? "Added to My applications ✓" : "Start tracking this application"}
        </button>
      )}

      <div style={{ marginTop: 14, padding: "12px 14px", borderRadius: 10, border: "1px solid #fecaca", background: "#fef2f2" }}>
        <p style={{ fontSize: 12.5, color: "#991b1b", margin: 0, lineHeight: 1.5 }}>
          Genuine scholarships never ask you to pay to receive money, and never ask for OTPs, PINs or bank passwords. See <Link href="/account/scholarships/safety" style={{ color: "#991b1b", fontWeight: 700 }}>scam warnings</Link> before sharing any documents.
        </p>
      </div>
    </div>
  );
}

const box: CSSProperties = { border: "1px solid #e2e8f0", borderRadius: 14, padding: "14px 16px", background: "#fff" };
const boxLabel: CSSProperties = { fontSize: 10.5, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: ".05em" };
const boxValue: CSSProperties = { fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 4, lineHeight: 1.5 };
