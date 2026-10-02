"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SCHOLARSHIPS, SCHOLARSHIP_TYPE_LABEL, type ScholarshipDef } from "@/data/scholarships/scholarships";
import { evaluate, type Verdict } from "@/lib/scholarships/eligibility";
import { fetchScholarshipProfile, saveScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";
import { rankMatches, totalApplyForValue } from "@/lib/scholarships/rank";
import { fetchAlertsSentKeys, recordAlertSent } from "@/lib/scholarships/clientApplications";
import { dueScholarshipAlerts } from "@/lib/scholarships/alertLogic";

const ACCENT = "#166534";

const LEVEL_OPTIONS = [
  { value: "class8", label: "Class 8" }, { value: "class9", label: "Class 9" }, { value: "class10", label: "Class 10" },
  { value: "class11", label: "Class 11" }, { value: "class12", label: "Class 12" },
  { value: "ug1", label: "UG Year 1" }, { value: "ug2", label: "UG Year 2" }, { value: "ug3", label: "UG Year 3" }, { value: "ug4", label: "UG Year 4" },
  { value: "pg", label: "Postgraduate" }, { value: "working", label: "Working" },
];
const VERDICT_META: Record<Verdict, { label: string; bg: string; fg: string }> = {
  ELIGIBLE: { label: "Eligible", bg: "#dcfce7", fg: "#166534" },
  ALMOST: { label: "Almost eligible", bg: "#fef3c7", fg: "#92400e" },
  CHECK: { label: "Check needed", bg: "#dbeafe", fg: "#1e40af" },
  NOT_ELIGIBLE: { label: "Not shown by default", bg: "#fee2e2", fg: "#991b1b" },
};
const VERDICT_ORDER: Verdict[] = ["ELIGIBLE", "ALMOST", "CHECK"];

function ProfileForm({ initial, onSave }: { initial: StoredScholarshipProfile | null; onSave: (p: StoredScholarshipProfile) => void }) {
  const [level, setLevel] = useState(initial?.level ?? "class12");
  const [institutionType, setInstitutionType] = useState(initial?.institutionType ?? "");
  const [lastPct, setLastPct] = useState(initial?.lastPct?.toString() ?? "");
  const [class10Pct, setClass10Pct] = useState(initial?.class10Pct?.toString() ?? "");
  const [class12Pct, setClass12Pct] = useState(initial?.class12Pct?.toString() ?? "");
  const [incomeBandInr, setIncomeBandInr] = useState(initial?.incomeBandInr?.toString() ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [domicileState, setDomicileState] = useState(initial?.domicileState ?? "");
  const [field, setField] = useState(initial?.field ?? "");
  const [hasGovtScholarship, setHasGovtScholarship] = useState(initial?.hasGovtScholarship ?? false);

  const input: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#1e293b" };
  const label: React.CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 5, marginTop: 14, display: "block" };

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 24 }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Your profile</div>
      <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0" }}>Sensitive fields (income, category, gender, disability) are optional and used only for matching - never shown to anyone else.</p>

      <label style={label}>Class / level</label>
      <select style={input} value={level} onChange={(e) => setLevel(e.target.value)}>
        {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>

      <label style={label}>Institution type</label>
      <select style={input} value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}>
        <option value="">Prefer not to say</option>
        <option value="government">Government</option>
        <option value="aided">Government-aided</option>
        <option value="private">Private</option>
      </select>

      <label style={label}>Most recent exam %</label>
      <input style={input} type="number" min={0} max={100} value={lastPct} onChange={(e) => setLastPct(e.target.value)} />
      <label style={label}>Class 10 %</label>
      <input style={input} type="number" min={0} max={100} value={class10Pct} onChange={(e) => setClass10Pct(e.target.value)} />
      <label style={label}>Class 12 %</label>
      <input style={input} type="number" min={0} max={100} value={class12Pct} onChange={(e) => setClass12Pct(e.target.value)} />

      <label style={label}>Annual family income (₹)</label>
      <input style={input} type="number" min={0} placeholder="e.g. 400000" value={incomeBandInr} onChange={(e) => setIncomeBandInr(e.target.value)} />

      <label style={label}>Gender (optional - for girls'/women's scholarships)</label>
      <select style={input} value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Prefer not to say</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
        <option value="other">Other</option>
      </select>

      <label style={label}>Category (optional)</label>
      <select style={input} value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Prefer not to say / General</option>
        <option value="OBC">OBC</option>
        <option value="SC">SC</option>
        <option value="ST">ST</option>
        <option value="EWS">EWS</option>
        <option value="PwBD">PwBD</option>
        <option value="Muslim">Muslim</option>
        <option value="Christian">Christian</option>
        <option value="Sikh">Sikh</option>
        <option value="Buddhist">Buddhist</option>
        <option value="Parsi">Parsi</option>
        <option value="Jain">Jain</option>
      </select>

      <label style={label}>State of domicile</label>
      <input style={input} type="text" placeholder="e.g. Maharashtra" value={domicileState} onChange={(e) => setDomicileState(e.target.value)} />

      <label style={label}>Field of study</label>
      <select style={input} value={field} onChange={(e) => setField(e.target.value)}>
        <option value="">Prefer not to say</option>
        <option value="engineering">Engineering</option>
        <option value="science">Science</option>
        <option value="medicine">Medicine</option>
        <option value="commerce">Commerce</option>
        <option value="arts">Arts</option>
        <option value="law">Law</option>
        <option value="other">Other</option>
      </select>

      <label style={{ ...label, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={hasGovtScholarship} onChange={(e) => setHasGovtScholarship(e.target.checked)} />
        I already hold another government scholarship
      </label>

      <button
        style={{ marginTop: 18, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}
        onClick={() => onSave({
          level, institutionType: (institutionType || undefined) as StoredScholarshipProfile["institutionType"],
          lastPct: lastPct ? Number(lastPct) : undefined, class10Pct: class10Pct ? Number(class10Pct) : undefined, class12Pct: class12Pct ? Number(class12Pct) : undefined,
          incomeBandInr: incomeBandInr ? Number(incomeBandInr) : undefined, gender: gender || undefined, category: category || undefined,
          domicileState: domicileState || undefined, field: field || undefined, hasGovtScholarship,
        })}
      >
        Save and find my scholarships
      </button>
    </div>
  );
}

export function ScholarshipsHomeClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredScholarshipProfile | null | undefined>(undefined);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchScholarshipProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  const results = profile ? SCHOLARSHIPS.map((s) => ({ scholarship: s, result: evaluate(s.rules, profile) })) : [];
  const byVerdict: Record<Verdict, { scholarship: ScholarshipDef; result: ReturnType<typeof evaluate> }[]> = { ELIGIBLE: [], ALMOST: [], CHECK: [], NOT_ELIGIBLE: [] };
  for (const r of results) byVerdict[r.result.verdict].push(r);

  const eligibleForCounter = byVerdict.ELIGIBLE.map((r) => ({ slug: r.scholarship.slug, amountPerYearInr: r.scholarship.amountPerYearInr, years: r.scholarship.years, closesAt: null, hasEssay: true }));
  const applyForValue = totalApplyForValue(eligibleForCounter);
  // "Apply this week" first - value x urgency x effort, per the spec's own ranking.
  const rankedOrder = rankMatches(eligibleForCounter).map((m) => m.slug);
  byVerdict.ELIGIBLE.sort((a, b) => rankedOrder.indexOf(a.scholarship.slug) - rankedOrder.indexOf(b.scholarship.slug));

  // Visit-triggered deadline alerts - no scholarship in this build has a
  // hard closesAt date yet (see lib/scholarships/alertLogic.ts), so this
  // is wired and ready but won't fire until real dates are added.
  useEffect(() => {
    if (!user?.uid || !user.email || !profile) return;
    (async () => {
      const alertsSent = await fetchAlertsSentKeys(user.uid);
      const matched = byVerdict.ELIGIBLE.map((r) => ({ scholarship: r.scholarship, closesAt: null }));
      const due = dueScholarshipAlerts(matched, alertsSent);
      for (const alert of due) {
        const res = await fetch("/api/scholarships/send-alert", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: user.email, scholarshipName: alert.scholarshipName, message: alert.message, officialUrl: SCHOLARSHIPS.find((s) => s.slug === alert.scholarshipSlug)?.officialUrl }),
        }).then((r) => r.json()).catch(() => ({ success: false }));
        if (res.success) await recordAlertSent(user.uid, alert.scholarshipSlug, alert.eventKind);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, user?.email, profile]);

  if (profile === undefined) {
    return <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Loading…</div>;
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ marginBottom: 8, fontSize: 13, color: "#999" }}>
        <Link href="/account" style={{ color: "#999", textDecoration: "none" }}>← Dashboard</Link>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>🎓 Scholarships</h1>
      <p style={{ color: "#666", margin: "0 0 20px", fontSize: 14 }}>
        Fill in your profile once - we'll show only the scholarships you actually qualify for, with the real amounts and how to apply.
      </p>
      <div style={{ marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href="/account/scholarships/vault" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>Document vault →</Link>
        <Link href="/account/scholarships/applications" style={{ fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" }}>My applications →</Link>
        <Link href="/account/scholarships/safety" style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", textDecoration: "none" }}>Scam warnings →</Link>
      </div>

      {(!profile || editingProfile) && (
        <ProfileForm initial={profile ?? null} onSave={(p) => { if (user?.uid) saveScholarshipProfile(user.uid, p); setProfile(p); setEditingProfile(false); }} />
      )}

      {profile && !editingProfile && (
        <>
          <button onClick={() => setEditingProfile(true)} style={{ marginBottom: 20, fontSize: 12.5, fontWeight: 700, color: ACCENT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Edit my profile
          </button>

          <div style={{ border: `1px solid ${ACCENT}35`, background: `${ACCENT}08`, borderRadius: 14, padding: "18px 20px", marginBottom: 24, textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: ACCENT }}>Money you can apply for</div>
            <div style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>{applyForValue > 0 ? `₹${applyForValue.toLocaleString("en-IN")}` : "—"}</div>
            <p style={{ fontSize: 12, color: "#64748b", margin: "6px 0 0" }}>Across {byVerdict.ELIGIBLE.length} matched scholarship{byVerdict.ELIGIBLE.length === 1 ? "" : "s"}, where an amount is published.</p>
          </div>

          {VERDICT_ORDER.map((v) => {
            const group = byVerdict[v];
            if (!group.length) return null;
            const meta = VERDICT_META[v];
            return (
              <div key={v} style={{ marginBottom: 22 }}>
                <div style={{ display: "inline-block", fontSize: 11, fontWeight: 800, padding: "3px 10px", borderRadius: 999, background: meta.bg, color: meta.fg, marginBottom: 10 }}>{meta.label} ({group.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {group.map(({ scholarship, result }) => (
                    <Link key={scholarship.slug} href={`/account/scholarships/${scholarship.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a" }}>{scholarship.name}</div>
                          <span style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", flex: "none" }}>{SCHOLARSHIP_TYPE_LABEL[scholarship.type]}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{scholarship.amountText}</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>{result.reasons[0]?.reason ?? ""}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {byVerdict.NOT_ELIGIBLE.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ fontSize: 12.5, fontWeight: 700, color: "#64748b", cursor: "pointer" }}>Show {byVerdict.NOT_ELIGIBLE.length} not-eligible scholarship{byVerdict.NOT_ELIGIBLE.length === 1 ? "" : "s"}</summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {byVerdict.NOT_ELIGIBLE.map(({ scholarship, result }) => (
                  <div key={scholarship.slug} style={{ border: "1px solid #fee2e2", borderRadius: 10, padding: "10px 14px" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{scholarship.name}</div>
                    <div style={{ fontSize: 11.5, color: "#991b1b", marginTop: 2 }}>{result.reasons[0]?.reason}</div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </>
      )}
    </div>
  );
}
