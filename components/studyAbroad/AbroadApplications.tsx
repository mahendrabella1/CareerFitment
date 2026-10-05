"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { UNIVERSITIES } from "@/data/studyAbroad/universities";
import { STUDY_ABROAD_COUNTRIES } from "@/data/studyAbroad/countries";
import { emi } from "@/lib/studyAbroad/roi";
import {
  DOCUMENTS,
  STATUS_LABEL,
  classify,
  loadPlan,
  mixAdvice,
  newItem,
  savePlan,
  type AbroadPlan,
  type AppStatus,
  type Band,
  type Scores,
  type ShortlistItem,
} from "@/lib/studyAbroad/shortlist";
import { buildIcsCalendar, downloadFile } from "@/lib/calendar/ics";

const ACCENT = "#7c3aed";
const BAND_META: Record<Band, { label: string; bg: string; fg: string }> = {
  reach: { label: "Reach", bg: "#fee2e2", fg: "#991b1b" },
  match: { label: "Match", bg: "#fef3c7", fg: "#92400e" },
  safe: { label: "Safe", bg: "#dcfce7", fg: "#166534" },
  "below-minimum": { label: "Below minimum", bg: "#fecaca", fg: "#7f1d1d" },
  unclassified: { label: "Needs data", bg: "#f1f5f9", fg: "#475569" },
};
type Tab = "shortlist" | "tracker" | "offers";
const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
const num = (s: string) => (s.trim() === "" ? undefined : Number(s));

export function AbroadApplications() {
  const [plan, setPlan] = useState<AbroadPlan>({ me: {}, items: [] });
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("shortlist");
  const [newUni, setNewUni] = useState("");

  useEffect(() => {
    setPlan(loadPlan());
    setReady(true);
  }, []);

  const update = (next: AbroadPlan) => {
    setPlan(next);
    savePlan(next);
  };
  const updateItem = (id: string, patch: Partial<ShortlistItem>) => update({ ...plan, items: plan.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });
  const removeItem = (id: string) => update({ ...plan, items: plan.items.filter((i) => i.id !== id) });

  if (!ready) return <p style={{ fontSize: 14, color: "#64748b" }}>Loading your plan…</p>;

  const bands = plan.items.map((i) => ({ item: i, ...classify(plan.me, i) }));
  const counts = bands.reduce<Record<Band, number>>((acc, b) => ({ ...acc, [b.band]: (acc[b.band] ?? 0) + 1 }), { reach: 0, match: 0, safe: 0, "below-minimum": 0, unclassified: 0 });
  const fees = plan.items.reduce((s, i) => s + (i.feeInr ?? 0), 0);

  const exportDeadlines = () => {
    const events = plan.items
      .filter((i) => i.deadline)
      .map((i) => ({ title: `Application deadline: ${i.universityName}${i.programme ? `, ${i.programme}` : ""}`, description: "Check the deadline time zone on the university website.", date: new Date(`${i.deadline}T00:00:00`), remindDaysBefore: [21, 7, 2] }));
    if (events.length) downloadFile("abroad-application-deadlines.ics", buildIcsCalendar(events, "Study abroad deadlines"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <h2 style={h2}>Your scores</h2>
        <p style={pText}>Used only on this device to compare you with each programme. Leave blank what you don&apos;t have yet.</p>
        <ScoreInputs value={plan.me} onChange={(me) => update({ ...plan, me })} />
      </section>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {(["shortlist", "tracker", "offers"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={chip(tab === t)}>
            {t === "shortlist" ? `Shortlist (${plan.items.length})` : t === "tracker" ? "Application tracker" : `Compare offers (${plan.items.filter((i) => i.status === "offer" || i.status === "accepted").length})`}
          </button>
        ))}
      </div>

      {tab === "shortlist" && (
        <>
          <section style={panel}>
            <h2 style={h2}>Add a programme</h2>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input list="abroad-unis" value={newUni} onChange={(e) => setNewUni(e.target.value)} placeholder="University name (pick from the list or type any)" style={{ ...input, flex: 1, minWidth: 220 }} />
              <datalist id="abroad-unis">
                {UNIVERSITIES.map((u) => <option key={u.slug} value={u.name} />)}
              </datalist>
              <button
                onClick={() => {
                  const name = newUni.trim();
                  if (!name) return;
                  const known = UNIVERSITIES.find((u) => u.name.toLowerCase() === name.toLowerCase());
                  update({ ...plan, items: [...plan.items, newItem({ universityName: known?.name ?? name, universitySlug: known?.slug, countryCode: known?.countryCode })] });
                  setNewUni("");
                }}
                style={primaryBtn}
              >
                Add
              </button>
            </div>
            <p style={{ ...pText, marginTop: 8 }}>Or browse the <Link href="/account/study-abroad/universities" style={{ color: ACCENT, fontWeight: 800 }}>university list</Link>.</p>
          </section>

          {plan.items.length > 0 && (
            <section style={{ ...panel, background: "#faf5ff", borderColor: "#ddd6fe" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
                {(Object.keys(BAND_META) as Band[]).filter((b) => counts[b] > 0).map((b) => (
                  <span key={b} style={{ fontSize: 12, fontWeight: 800, color: BAND_META[b].fg, background: BAND_META[b].bg, borderRadius: 999, padding: "3px 10px" }}>{BAND_META[b].label}: {counts[b]}</span>
                ))}
              </div>
              <p style={{ ...pText, margin: 0 }}>{mixAdvice(counts)}{fees > 0 ? ` Application fees so far: ${inr(fees)}.` : ""}</p>
            </section>
          )}

          {bands.map(({ item, band, reason }) => (
            <section key={item.id} style={panel}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>
                <div style={{ minWidth: 0, flex: "1 1 240px" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{item.universityName}</div>
                  <input value={item.programme} onChange={(e) => updateItem(item.id, { programme: e.target.value })} placeholder="Programme, e.g. MS Computer Science" style={{ ...input, marginTop: 6 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 900, color: BAND_META[band].fg, background: BAND_META[band].bg, borderRadius: 999, padding: "4px 10px", flex: "none" }}>{BAND_META[band].label}</span>
              </div>
              <p style={{ ...pText, marginTop: 8 }}>{reason}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
                <div>
                  <div style={miniTitle}>Stated minimum (from the programme page)</div>
                  <ScoreInputs value={item.minimum} onChange={(minimum) => updateItem(item.id, { minimum })} compact />
                </div>
                <div>
                  <div style={miniTitle}>Typical admitted profile (class profile or admit statistics)</div>
                  <ScoreInputs value={item.typical} onChange={(typical) => updateItem(item.id, { typical })} compact />
                </div>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ marginTop: 10, fontSize: 12, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Remove</button>
            </section>
          ))}
          {plan.items.length === 0 && <p style={pText}>No programmes yet. Add the ones you are considering.</p>}
        </>
      )}

      {tab === "tracker" && (
        <>
          {plan.items.some((i) => i.deadline) && (
            <button onClick={exportDeadlines} style={{ ...secondaryBtn, alignSelf: "flex-start" }}>Add all deadlines to my calendar</button>
          )}
          {plan.items.length === 0 && <p style={pText}>Add programmes on the Shortlist tab first.</p>}
          {plan.items.map((item) => {
            const done = DOCUMENTS.filter((d) => item.documents[d.key]).length;
            const country = STUDY_ABROAD_COUNTRIES.find((c) => c.code === item.countryCode);
            return (
              <section key={item.id} style={panel}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>{item.universityName}{item.programme ? ` · ${item.programme}` : ""}</div>
                  <span style={{ fontSize: 12, color: "#64748b" }}>{country ? `${country.flag} ${country.name}` : ""}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10, marginTop: 10 }}>
                  <label style={label}>Status
                    <select value={item.status} onChange={(e) => updateItem(item.id, { status: e.target.value as AppStatus })} style={input}>
                      {(Object.keys(STATUS_LABEL) as AppStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </label>
                  <label style={label}>Deadline<input type="date" value={item.deadline ?? ""} onChange={(e) => updateItem(item.id, { deadline: e.target.value || undefined })} style={input} /></label>
                  <label style={label}>Application fee (₹)<input type="number" min={0} value={item.feeInr ?? ""} onChange={(e) => updateItem(item.id, { feeInr: num(e.target.value) })} style={input} /></label>
                </div>
                <div style={{ ...miniTitle, marginTop: 12 }}>Documents ({done}/{DOCUMENTS.length})</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 4 }}>
                  {DOCUMENTS.map((d) => (
                    <label key={d.key} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13, color: "#334155" }}>
                      <input type="checkbox" checked={Boolean(item.documents[d.key])} onChange={(e) => updateItem(item.id, { documents: { ...item.documents, [d.key]: e.target.checked } })} style={{ marginTop: 3, accentColor: ACCENT }} />
                      {d.label}
                    </label>
                  ))}
                </div>
                <textarea value={item.notes ?? ""} onChange={(e) => updateItem(item.id, { notes: e.target.value })} placeholder="Notes: portal login, interview date, contacts…" rows={2} style={{ ...input, marginTop: 10, resize: "vertical", fontFamily: "inherit" }} />
              </section>
            );
          })}
          <p style={{ fontSize: 12.5, color: "#64748b", margin: 0 }}>Write your own statement of purpose: <Link href="/account/study-abroad/sop" style={{ color: ACCENT, fontWeight: 800 }}>SOP and LOR helper →</Link></p>
        </>
      )}

      {tab === "offers" && <OfferComparison plan={plan} onChange={updateItem} />}

      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Your shortlist and tracker are saved on this device only.</p>
    </div>
  );
}

function ScoreInputs({ value, onChange, compact }: { value: Scores; onChange: (s: Scores) => void; compact?: boolean }) {
  const field = (key: keyof Scores, text: string, step: string, max: number) => (
    <label style={label}>
      {text}
      <input type="number" min={0} max={max} step={step} value={value[key] ?? ""} onChange={(e) => onChange({ ...value, [key]: num(e.target.value) })} style={input} />
    </label>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${compact ? 110 : 150}px, 1fr))`, gap: 8 }}>
      {field("pct", "Marks %", "0.1", 100)}
      {field("ielts", "IELTS band", "0.5", 9)}
      {field("gre", "GRE total", "1", 340)}
      {field("workYears", "Work years", "0.5", 40)}
    </div>
  );
}

function OfferComparison({ plan, onChange }: { plan: AbroadPlan; onChange: (id: string, patch: Partial<ShortlistItem>) => void }) {
  const [rate, setRate] = useState(10.5);
  const [years, setYears] = useState(10);
  const offers = plan.items.filter((i) => i.status === "offer" || i.status === "accepted");
  if (!offers.length) return <p style={pText}>When you mark a programme as Offer or Accepted in the tracker, it appears here so you can compare total cost side by side.</p>;
  return (
    <section style={panel}>
      <h2 style={h2}>Compare offers on total cost</h2>
      <p style={pText}>Enter totals for the whole course in rupees. The EMI assumes you borrow the full net cost; use the <Link href="/account/study-abroad/roi" style={{ color: ACCENT, fontWeight: 800 }}>ROI calculator</Link> for payback time against salary.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
        <label style={label}>Interest rate your lender quotes (% a year)<input type="number" step="0.1" min={0} value={rate} onChange={(e) => setRate(Number(e.target.value) || 0)} style={{ ...input, width: 140 }} /></label>
        <label style={label}>Repayment years<input type="number" min={1} max={20} value={years} onChange={(e) => setYears(Math.max(1, Number(e.target.value) || 1))} style={{ ...input, width: 140 }} /></label>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520, fontSize: 13 }}>
          <thead>
            <tr>
              <th style={th}>Item</th>
              {offers.map((o) => <th key={o.id} style={th}>{o.universityName}{o.programme ? ` · ${o.programme}` : ""}</th>)}
            </tr>
          </thead>
          <tbody>
            {([
              ["tuitionInr", "Tuition, whole course"],
              ["livingInr", "Living costs, whole course"],
              ["otherInr", "Visa, insurance, flights, setup"],
              ["scholarshipInr", "Scholarship (subtract)"],
            ] as const).map(([key, text]) => (
              <tr key={key}>
                <td style={td}>{text}</td>
                {offers.map((o) => (
                  <td key={o.id} style={td}>
                    <input type="number" min={0} value={o.offer?.[key] ?? ""} onChange={(e) => onChange(o.id, { offer: { ...o.offer, [key]: num(e.target.value) } })} style={{ ...input, padding: "6px 8px" }} />
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={{ ...td, fontWeight: 900 }}>Net cost</td>
              {offers.map((o) => {
                const net = (o.offer?.tuitionInr ?? 0) + (o.offer?.livingInr ?? 0) + (o.offer?.otherInr ?? 0) - (o.offer?.scholarshipInr ?? 0);
                return <td key={o.id} style={{ ...td, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>{inr(Math.max(0, net))}</td>;
              })}
            </tr>
            <tr>
              <td style={td}>EMI if fully borrowed</td>
              {offers.map((o) => {
                const net = Math.max(0, (o.offer?.tuitionInr ?? 0) + (o.offer?.livingInr ?? 0) + (o.offer?.otherInr ?? 0) - (o.offer?.scholarshipInr ?? 0));
                return <td key={o.id} style={{ ...td, fontVariantNumeric: "tabular-nums" }}>{net > 0 ? `${inr(emi(net, rate, years * 12))} a month` : "—"}</td>;
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", margin: "10px 0 0" }}>Interest usually builds up during the course and the moratorium, so the real EMI is often higher than this estimate. Ask each lender for a repayment schedule.</p>
    </section>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const miniTitle: CSSProperties = { fontSize: 12, fontWeight: 900, color: "#475569", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 4, fontSize: 12, fontWeight: 700, color: "#475569" };
const input: CSSProperties = { width: "100%", padding: "8px 10px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
const primaryBtn: CSSProperties = { fontSize: 13, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 9, padding: "9px 14px", cursor: "pointer" };
const secondaryBtn: CSSProperties = { fontSize: 12.5, fontWeight: 800, color: ACCENT, background: "#fff", border: `1px solid ${ACCENT}`, borderRadius: 9, padding: "7px 12px", cursor: "pointer" };
const th: CSSProperties = { textAlign: "left", padding: "6px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569", fontWeight: 800 };
const td: CSSProperties = { padding: "6px 8px", borderBottom: "1px solid #f1f5f9", color: "#0f172a", verticalAlign: "middle" };
const chip = (on: boolean): CSSProperties => ({
  fontSize: 12.5,
  fontWeight: 800,
  color: on ? "#fff" : "#334155",
  background: on ? ACCENT : "#fff",
  border: `1px solid ${on ? ACCENT : "#cbd5e1"}`,
  borderRadius: 999,
  padding: "7px 13px",
  cursor: "pointer",
});
