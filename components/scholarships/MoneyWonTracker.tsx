"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scholarshipBySlug, type ScholarshipDef } from "@/data/scholarships/scholarships";
import { fetchApplications, saveApplication, type ScholarshipApplication } from "@/lib/scholarships/clientApplications";
import { fetchScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";

const ACCENT = "#166534";

/** Official links shown when an NSP payment has not arrived (all linked from scholarships.gov.in). */
const PFMS_KNOW_YOUR_PAYMENT = "https://pfms.nic.in/SitePages/KnowYourPayment_Dw_NewNew.aspx";
const NSP_GRIEVANCE = "https://nsp.gov.in/grievanceregistration/";
const MY_AADHAAR = "https://myaadhaar.uidai.gov.in/";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

export function MoneyWonTracker() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Record<string, ScholarshipApplication> | null>(null);
  const [profile, setProfile] = useState<StoredScholarshipProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    fetchApplications(user.uid).then(setApps).catch(() => setApps({}));
    fetchScholarshipProfile(user.uid).then(setProfile).catch(() => setProfile(null));
  }, [user?.uid]);

  if (!user?.uid) {
    return <p style={{ fontSize: 14, color: "#475569" }}>Sign in to track the scholarships you have won.</p>;
  }
  if (apps === null) return <p style={{ fontSize: 14, color: "#64748b" }}>Loading your applications…</p>;

  const all = Object.values(apps).map((a) => ({ app: a, s: scholarshipBySlug(a.scholarshipSlug) })).filter((x): x is { app: ScholarshipApplication; s: ScholarshipDef } => Boolean(x.s));
  const selected = all.filter((x) => x.app.status === "selected");
  const pending = all.filter((x) => x.app.status !== "selected" && x.app.status !== "rejected");
  const totalReceived = selected.reduce((sum, x) => sum + (num(x.app.receivedInr) ?? 0), 0);
  const totalAwarded = selected.reduce((sum, x) => sum + (num(x.app.amountWonInr) ?? 0), 0);

  const update = async (slug: string, patch: Partial<ScholarshipApplication>) => {
    await saveApplication(user.uid, slug, patch);
    setApps((cur) => (cur ? { ...cur, [slug]: { ...cur[slug], ...patch } } : cur));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
        <div style={stat}>
          <div style={statLabel}>Money won (received)</div>
          <div style={statValue}>{inr(totalReceived)}</div>
          <div style={statNote}>What has actually reached your bank account, as you have recorded it.</div>
        </div>
        <div style={stat}>
          <div style={statLabel}>Awarded per year</div>
          <div style={statValue}>{inr(totalAwarded)}</div>
          <div style={statNote}>Across {selected.length} scholarship{selected.length === 1 ? "" : "s"} you were selected for.</div>
        </div>
      </div>

      {selected.length === 0 && (
        <section style={panel}>
          <h2 style={h2}>No wins recorded yet</h2>
          <p style={p}>
            When you are selected, open <Link href="/account/scholarships/applications" style={{ color: ACCENT, fontWeight: 800 }}>My applications</Link> and set the status to <b>Selected</b>. It then appears here so you can track payments and renewals.
          </p>
          {pending.length > 0 && <p style={{ ...p, marginBottom: 0 }}>You are tracking {pending.length} application{pending.length === 1 ? "" : "s"} in progress.</p>}
        </section>
      )}

      {selected.map(({ app, s }) => (
        <WonCard key={s.slug} app={app} s={s} profile={profile} onSave={(patch) => update(s.slug, patch)} />
      ))}

      <section style={panel}>
        <h2 style={h2}>Give back</h2>
        <p style={{ ...p, marginBottom: 0 }}>
          Once you have won, help a younger student apply: share the checklist, show them how NSP verification works, and warn them never to pay anyone to &quot;release&quot; a scholarship.
        </p>
      </section>
    </div>
  );
}

function WonCard({ app, s, profile, onSave }: { app: ScholarshipApplication; s: ScholarshipDef; profile: StoredScholarshipProfile | null; onSave: (p: Partial<ScholarshipApplication>) => void }) {
  const [amount, setAmount] = useState(num(app.amountWonInr)?.toString() ?? "");
  const [expected, setExpected] = useState(app.expectedPaymentOn ?? "");
  const [received, setReceived] = useState(num(app.receivedInr)?.toString() ?? "");
  const [receivedOn, setReceivedOn] = useState(app.receivedOn ?? "");
  const [saved, setSaved] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expectedDate = expected ? new Date(`${expected}T00:00:00`) : null;
  const overdue = Boolean(expectedDate && expectedDate < today && !(Number(received) > 0));
  const isNsp = s.applyVia.startsWith("NSP") || s.officialUrl.includes("scholarships.gov.in");

  const lastPct = num(profile?.lastPct);
  const min = s.renewalMinPct;
  const renewalWarning = min !== undefined && lastPct !== undefined ? (lastPct < min ? "below" : lastPct < min + 5 ? "close" : null) : null;

  return (
    <section style={panel}>
      <Link href={`/account/scholarships/${s.slug}`} style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", textDecoration: "none" }}>{s.name}</Link>
      <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>{s.amountText}</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginTop: 12 }}>
        <label style={label}>Amount awarded per year (₹)<input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} style={input} /></label>
        <label style={label}>Next payment expected on<input type="date" value={expected} onChange={(e) => setExpected(e.target.value)} style={input} /></label>
        <label style={label}>Total received so far (₹)<input type="number" min={0} value={received} onChange={(e) => setReceived(e.target.value)} style={input} /></label>
        <label style={label}>Last received on<input type="date" value={receivedOn} onChange={(e) => setReceivedOn(e.target.value)} style={input} /></label>
      </div>
      <button
        onClick={() => {
          onSave({
            amountWonInr: amount ? Number(amount) : undefined,
            expectedPaymentOn: expected || undefined,
            receivedInr: received ? Number(received) : undefined,
            receivedOn: receivedOn || undefined,
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }}
        style={{ marginTop: 12, fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 9, padding: "9px 14px", cursor: "pointer" }}
      >
        {saved ? "Saved ✓" : "Save"}
      </button>

      {overdue && (
        <div style={{ marginTop: 14, border: "1px solid #fcd34d", background: "#fffbeb", borderRadius: 12, padding: "12px 14px" }}>
          <div style={{ fontSize: 13.5, fontWeight: 900, color: "#92400e" }}>Has your money arrived?</div>
          {isNsp ? (
            <ol style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 13, color: "#78350f", lineHeight: 1.7 }}>
              <li>Check the payment status on <a href={PFMS_KNOW_YOUR_PAYMENT} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>PFMS Know Your Payment ↗</a> with your bank account number.</li>
              <li>NSP pays by Direct Benefit Transfer to an Aadhaar-seeded account. Check that your bank account is seeded with your Aadhaar (your bank or <a href={MY_AADHAAR} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>myAadhaar ↗</a> can confirm).</li>
              <li>Make sure your name matches exactly on Aadhaar, your bank account and your marksheets.</li>
              <li>Make sure the account is active, not dormant or closed.</li>
              <li>Still stuck? Raise a grievance on <a href={NSP_GRIEVANCE} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>NSP grievance registration ↗</a> and tell your institute&apos;s scholarship nodal officer.</li>
            </ol>
          ) : (
            <p style={{ fontSize: 13, color: "#78350f", margin: "6px 0 0", lineHeight: 1.6 }}>
              Write to the scholarship&apos;s helpdesk through its <a href={s.officialUrl} target="_blank" rel="noreferrer" style={{ color: "#92400e", fontWeight: 800 }}>official site ↗</a> with your application number and bank details proof. Never pay anyone to release a payment.
            </p>
          )}
        </div>
      )}

      {s.renewal && (
        <div style={{ marginTop: 14, borderTop: "1px solid #f1f5f9", paddingTop: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: "#0f172a", textTransform: "uppercase", letterSpacing: ".04em" }}>Renewal</div>
          <p style={{ fontSize: 13, color: "#334155", margin: "4px 0 0", lineHeight: 1.6 }}>{s.renewal}</p>
          {renewalWarning === "below" && (
            <p style={{ fontSize: 13, color: "#991b1b", fontWeight: 700, margin: "6px 0 0" }}>Your latest marks in your profile ({lastPct}%) are below the renewal minimum of {min}%. Talk to your institution about what can be done before the renewal window.</p>
          )}
          {renewalWarning === "close" && (
            <p style={{ fontSize: 13, color: "#b45309", fontWeight: 700, margin: "6px 0 0" }}>Your latest marks in your profile ({lastPct}%) are close to the renewal minimum of {min}%. Protect this year&apos;s marks and attendance.</p>
          )}
          {s.cycle && <p style={{ fontSize: 12, color: "#64748b", margin: "6px 0 0" }}>Renewals run in each new cycle. The {s.cycle.year} cycle {s.cycle.closesAt ? `closes on ${new Date(`${s.cycle.closesAt}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` : "dates are on the scholarship page"}.</p>}
        </div>
      )}
    </section>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const p: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 8px" };
const stat: CSSProperties = { border: `1px solid ${ACCENT}35`, background: `${ACCENT}08`, borderRadius: 14, padding: "16px 18px" };
const statLabel: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: ACCENT };
const statValue: CSSProperties = { fontSize: 28, fontWeight: 900, color: "#0f172a", marginTop: 4, fontVariantNumeric: "tabular-nums" };
const statNote: CSSProperties = { fontSize: 12, color: "#64748b", margin: "6px 0 0", lineHeight: 1.5 };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
