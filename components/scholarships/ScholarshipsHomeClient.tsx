"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { SCHOLARSHIPS, SCHOLARSHIP_TYPE_LABEL, cycleDate, liveStatus, type ScholarshipDef } from "@/data/scholarships/scholarships";
import { evaluate, SITUATIONS, type Verdict } from "@/lib/scholarships/eligibility";
import { fetchScholarshipProfile, saveScholarshipProfile, type StoredScholarshipProfile } from "@/lib/scholarships/clientProfile";
import { rankMatches, totalApplyForValue } from "@/lib/scholarships/rank";
import { fetchAlertsSentKeys, recordAlertSent } from "@/lib/scholarships/clientApplications";
import { dueScholarshipAlerts } from "@/lib/scholarships/alertLogic";
import { StatusChip } from "@/components/scholarships/StatusChip";

const ACCENT = "#166534";

const LEVEL_OPTIONS = [
  { value: "class8", label: "Class 8" }, { value: "class9", label: "Class 9" }, { value: "class10", label: "Class 10" },
  { value: "class11", label: "Class 11" }, { value: "class12", label: "Class 12" },
  { value: "ug1", label: "UG Year 1" }, { value: "ug2", label: "UG Year 2" }, { value: "ug3", label: "UG Year 3" }, { value: "ug4", label: "UG Year 4" },
  { value: "pg", label: "Postgraduate" }, { value: "working", label: "Graduate, working" },
];

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const VERDICT_META: Record<Verdict, { label: string; bg: string; fg: string }> = {
  ELIGIBLE: { label: "Eligible", bg: "#dcfce7", fg: "#166534" },
  ALMOST: { label: "Almost eligible", bg: "#fef3c7", fg: "#92400e" },
  CHECK: { label: "Check needed", bg: "#dbeafe", fg: "#1e40af" },
  NOT_ELIGIBLE: { label: "Not shown by default", bg: "#fee2e2", fg: "#991b1b" },
};
const VERDICT_ORDER: Verdict[] = ["ELIGIBLE", "ALMOST", "CHECK"];

const DAY = 86_400_000;

function ProfileForm({ initial, onSave }: { initial: StoredScholarshipProfile | null; onSave: (p: StoredScholarshipProfile) => void }) {
  const [level, setLevel] = useState(initial?.level ?? "class12");
  const [institutionType, setInstitutionType] = useState(initial?.institutionType ?? "");
  const [lastPct, setLastPct] = useState(initial?.lastPct?.toString() ?? "");
  const [class10Pct, setClass10Pct] = useState(initial?.class10Pct?.toString() ?? "");
  const [class12Pct, setClass12Pct] = useState(initial?.class12Pct?.toString() ?? "");
  const [incomeBandInr, setIncomeBandInr] = useState(initial?.incomeBandInr?.toString() ?? "");
  const [gender, setGender] = useState(initial?.gender ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [disabilityPct, setDisabilityPct] = useState(initial?.disabilityPct?.toString() ?? "");
  const [domicileState, setDomicileState] = useState(initial?.domicileState ?? "");
  const [field, setField] = useState(initial?.field ?? "");
  const [situations, setSituations] = useState<string[]>(initial?.situations ?? []);
  const [hasGovtScholarship, setHasGovtScholarship] = useState(initial?.hasGovtScholarship ?? false);

  const stateOptions = domicileState && !STATES.some((s) => s.toLowerCase() === domicileState.trim().toLowerCase()) ? [domicileState, ...STATES] : STATES;

  return (
    <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px 22px", marginBottom: 24, background: "#fff" }}>
      <div style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>Your scholarship profile</div>
      <p style={{ fontSize: 12.5, color: "#64748b", margin: "4px 0 0", lineHeight: 1.6 }}>
        Sensitive fields (income, category, gender, disability, situations) are optional and used only for matching. They are never shown to anyone else.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0 14px" }}>
        <div>
          <label style={labelStyle}>Class / level</label>
          <select style={inputStyle} value={level} onChange={(e) => setLevel(e.target.value)}>
            {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Institution type</label>
          <select style={inputStyle} value={institutionType} onChange={(e) => setInstitutionType(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="government">Government</option>
            <option value="aided">Government-aided</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Most recent exam %</label>
          <input style={inputStyle} type="number" min={0} max={100} value={lastPct} onChange={(e) => setLastPct(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Class 10 %</label>
          <input style={inputStyle} type="number" min={0} max={100} value={class10Pct} onChange={(e) => setClass10Pct(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Class 12 %</label>
          <input style={inputStyle} type="number" min={0} max={100} value={class12Pct} onChange={(e) => setClass12Pct(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Annual family income (₹)</label>
          <input style={inputStyle} type="number" min={0} placeholder="e.g. 400000" value={incomeBandInr} onChange={(e) => setIncomeBandInr(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Gender (optional)</label>
          <select style={inputStyle} value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Category (optional)</label>
          <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Prefer not to say / General</option>
            <option value="OBC">OBC</option>
            <option value="EBC">EBC</option>
            <option value="DNT">DNT (denotified, nomadic or semi-nomadic tribes)</option>
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
        </div>
        <div>
          <label style={labelStyle}>Certified disability % (optional)</label>
          <input style={inputStyle} type="number" min={0} max={100} placeholder="Leave blank if none" value={disabilityPct} onChange={(e) => setDisabilityPct(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>State of domicile</label>
          <select style={inputStyle} value={domicileState} onChange={(e) => setDomicileState(e.target.value)}>
            <option value="">Select your state</option>
            {stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Field of study</label>
          <select style={inputStyle} value={field} onChange={(e) => setField(e.target.value)}>
            <option value="">Prefer not to say</option>
            <option value="engineering">Engineering</option>
            <option value="science">Science</option>
            <option value="medicine">Medicine</option>
            <option value="agriculture">Agriculture and allied</option>
            <option value="commerce">Commerce</option>
            <option value="arts">Arts and humanities</option>
            <option value="law">Law</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div style={{ ...labelStyle, marginTop: 16 }}>Special situations (optional, tick any that apply)</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {SITUATIONS.map((s) => (
          <label key={s.value} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
            <input
              type="checkbox"
              checked={situations.includes(s.value)}
              onChange={(e) => setSituations((cur) => (e.target.checked ? [...cur, s.value] : cur.filter((x) => x !== s.value)))}
              style={{ marginTop: 3, accentColor: ACCENT }}
            />
            {s.label}
          </label>
        ))}
      </div>

      <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={hasGovtScholarship} onChange={(e) => setHasGovtScholarship(e.target.checked)} style={{ accentColor: ACCENT }} />
        I already hold a merit-based government scholarship this year
      </label>

      <button
        style={{ marginTop: 18, width: "100%", padding: "12px 16px", borderRadius: 10, border: "none", background: ACCENT, color: "#fff", fontSize: 14.5, fontWeight: 700, cursor: "pointer" }}
        onClick={() =>
          onSave({
            level,
            institutionType: (institutionType || undefined) as StoredScholarshipProfile["institutionType"],
            lastPct: lastPct ? Number(lastPct) : undefined,
            class10Pct: class10Pct ? Number(class10Pct) : undefined,
            class12Pct: class12Pct ? Number(class12Pct) : undefined,
            incomeBandInr: incomeBandInr ? Number(incomeBandInr) : undefined,
            gender: gender || undefined,
            category: category || undefined,
            disabilityPct: disabilityPct ? Number(disabilityPct) : undefined,
            domicileState: domicileState || undefined,
            field: field || undefined,
            situations,
            hasGovtScholarship,
          })
        }
      >
        Save and find my scholarships
      </button>
    </div>
  );
}

/** Strips undefined values so Firestore accepts the profile. */
function clean(p: StoredScholarshipProfile): StoredScholarshipProfile {
  return Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined)) as unknown as StoredScholarshipProfile;
}

export function ScholarshipsHomeClient() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StoredScholarshipProfile | null | undefined>(undefined);
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    if (!user?.uid) { setProfile(null); return; }
    fetchScholarshipProfile(user.uid).then(setProfile);
  }, [user?.uid]);

  const now = new Date();
  const results = profile ? SCHOLARSHIPS.map((s) => ({ scholarship: s, result: evaluate(s.rules, profile) })) : [];
  const byVerdict: Record<Verdict, { scholarship: ScholarshipDef; result: ReturnType<typeof evaluate> }[]> = { ELIGIBLE: [], ALMOST: [], CHECK: [], NOT_ELIGIBLE: [] };
  for (const r of results) byVerdict[r.result.verdict].push(r);

  const isApplyable = (s: ScholarshipDef) => {
    const st = liveStatus(s, now);
    return st === "open" || st === "renewal-only" || st === "upcoming" || st === "varies" || st === "none";
  };
  const closesAtOf = (s: ScholarshipDef) => {
    const st = liveStatus(s, now);
    return st === "open" ? cycleDate(s.cycle?.closesAt, true) : null;
  };

  const eligibleOpen = byVerdict.ELIGIBLE.filter((r) => isApplyable(r.scholarship));
  const eligibleForCounter = eligibleOpen.map((r) => ({
    slug: r.scholarship.slug,
    amountPerYearInr: r.scholarship.amountPerYearInr,
    years: r.scholarship.years,
    closesAt: closesAtOf(r.scholarship),
    hasEssay: Boolean(r.scholarship.hasTestOrInterview),
  }));
  const applyForValue = totalApplyForValue(eligibleForCounter);
  const ranked = rankMatches(eligibleForCounter, now);
  const rankedOrder = ranked.map((m) => m.slug);
  byVerdict.ELIGIBLE.sort((a, b) => {
    const ia = rankedOrder.indexOf(a.scholarship.slug);
    const ib = rankedOrder.indexOf(b.scholarship.slug);
    return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
  });

  const applyThisWeek = [...byVerdict.ELIGIBLE, ...byVerdict.CHECK]
    .map((r) => ({ s: r.scholarship, closes: closesAtOf(r.scholarship) }))
    .filter((x): x is { s: ScholarshipDef; closes: Date } => Boolean(x.closes) && (x.closes!.getTime() - now.getTime()) / DAY <= 7)
    .sort((a, b) => a.closes.getTime() - b.closes.getTime());

  // NSP from AY 2026-27: one merit-based scheme plus any welfare-based schemes.
  const meritNsp = eligibleOpen.filter((r) => r.scholarship.nspKind === "merit" && r.scholarship.applyVia.startsWith("NSP"));
  const bestMerit = [...meritNsp].sort((a, b) => (b.scholarship.amountPerYearInr ?? 0) * (b.scholarship.years ?? 1) - (a.scholarship.amountPerYearInr ?? 0) * (a.scholarship.years ?? 1))[0];

  // Visit-triggered deadline alerts at 14, 7 and 2 days before a real closing date.
  useEffect(() => {
    if (!user?.uid || !user.email || !profile) return;
    (async () => {
      const alertsSent = await fetchAlertsSentKeys(user.uid);
      const matched = byVerdict.ELIGIBLE.map((r) => ({ scholarship: r.scholarship, closesAt: closesAtOf(r.scholarship) }));
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
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "8px 4px 40px" }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: "0 0 6px" }}>Money you can apply for</h1>
      <p style={{ color: "#475569", margin: "0 0 16px", fontSize: 14, lineHeight: 1.6 }}>
        Fill in your profile once. We show only the scholarships you qualify for, with real amounts, this year&apos;s dates and how to apply.
      </p>
      <div style={{ marginBottom: 20, display: "flex", gap: 14, flexWrap: "wrap" }}>
        <Link href="/account/scholarships/calendar" style={quickLink}>Deadline calendar →</Link>
        <Link href="/account/scholarships/applications" style={quickLink}>My applications →</Link>
        <Link href="/account/scholarships/won" style={quickLink}>Money won and renewals →</Link>
        <Link href="/account/scholarships/essay" style={quickLink}>Essay helper →</Link>
        <Link href="/account/scholarships/vault" style={quickLink}>Document vault →</Link>
        <Link href="/account/scholarships/safety" style={{ ...quickLink, color: "#b91c1c" }}>Scam warnings →</Link>
      </div>

      {!user?.uid && (
        <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "14px 16px", marginBottom: 18, fontSize: 13.5, color: "#334155", background: "#fff" }}>
          Sign in to save your profile and get matches. You can still browse every scholarship in the <Link href="/account/scholarships/calendar" style={{ color: ACCENT, fontWeight: 800 }}>deadline calendar</Link>.
        </div>
      )}

      {user?.uid && (!profile || editingProfile) && (
        <ProfileForm
          initial={profile ?? null}
          onSave={(p) => {
            const tidy = clean(p);
            if (user?.uid) saveScholarshipProfile(user.uid, tidy);
            setProfile(tidy);
            setEditingProfile(false);
          }}
        />
      )}

      {profile && !editingProfile && (
        <>
          <button onClick={() => setEditingProfile(true)} style={{ marginBottom: 16, fontSize: 12.5, fontWeight: 700, color: ACCENT, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Edit my profile
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            <div style={statCard}>
              <div style={statLabel}>Money you can apply for</div>
              <div style={statValue}>{applyForValue > 0 ? `₹${applyForValue.toLocaleString("en-IN")}` : "—"}</div>
              <div style={statNote}>Across {eligibleOpen.length} matched scholarship{eligibleOpen.length === 1 ? "" : "s"} that are open or coming up, where an amount is published.</div>
            </div>
            <div style={statCard}>
              <div style={statLabel}>Closing within 7 days</div>
              <div style={statValue}>{applyThisWeek.length}</div>
              <div style={statNote}>Apply these first. Leave a few days for your college to verify NSP forms.</div>
            </div>
          </div>

          {applyThisWeek.length > 0 && (
            <div style={{ border: "1px solid #fcd34d", background: "#fffbeb", borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 900, color: "#92400e", textTransform: "uppercase", letterSpacing: ".05em" }}>Apply this week</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {applyThisWeek.map(({ s, closes }) => {
                  const days = Math.max(0, Math.ceil((closes.getTime() - now.getTime()) / DAY));
                  return (
                    <Link key={s.slug} href={`/account/scholarships/${s.slug}`} style={{ display: "flex", justifyContent: "space-between", gap: 10, textDecoration: "none", color: "#0f172a", fontSize: 13.5, fontWeight: 700 }}>
                      <span>{s.name}</span>
                      <span style={{ color: "#b45309", flex: "none" }}>{days === 0 ? "Closes today" : `${days} day${days === 1 ? "" : "s"} left`}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {meritNsp.length >= 2 && bestMerit && (
            <div style={{ border: "1px solid #bfdbfe", background: "#eff6ff", borderRadius: 14, padding: "14px 16px", marginBottom: 20, fontSize: 13.5, color: "#1e3a8a", lineHeight: 1.6 }}>
              <b>Choose one merit-based NSP scheme.</b> From 2026-27, NSP lets you apply for one merit-based scheme plus any welfare-based schemes. You match {meritNsp.length} merit-based schemes; the highest value for you is <b>{bestMerit.scholarship.name}</b>. Welfare-based schemes (disability, Swanath, labour welfare) can be added on top.
            </div>
          )}

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
                      <div style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", background: "#fff" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                          <div style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", flex: "1 1 260px", minWidth: 0 }}>{scholarship.name}</div>
                          <StatusChip scholarship={scholarship} now={now} />
                        </div>
                        <div style={{ fontSize: 12.5, color: "#475569", marginTop: 4, lineHeight: 1.5 }}>{scholarship.amountText}</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 4 }}>
                          {SCHOLARSHIP_TYPE_LABEL[scholarship.type]} · {result.reasons.find((r) => r.verdict !== "ELIGIBLE")?.reason ?? result.reasons[0]?.reason ?? ""}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {byVerdict.NOT_ELIGIBLE.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ fontSize: 12.5, fontWeight: 700, color: "#64748b", cursor: "pointer" }}>Show {byVerdict.NOT_ELIGIBLE.length} scholarship{byVerdict.NOT_ELIGIBLE.length === 1 ? "" : "s"} you don&apos;t qualify for, with reasons</summary>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
                {byVerdict.NOT_ELIGIBLE.map(({ scholarship, result }) => (
                  <div key={scholarship.slug} style={{ border: "1px solid #fee2e2", borderRadius: 10, padding: "10px 14px", background: "#fff" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{scholarship.name}</div>
                    <div style={{ fontSize: 11.5, color: "#991b1b", marginTop: 2 }}>{result.reasons.find((r) => r.verdict === "NOT_ELIGIBLE")?.reason ?? result.reasons[0]?.reason}</div>
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

const inputStyle: CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#1e293b", boxSizing: "border-box" };
const labelStyle: CSSProperties = { fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 5, marginTop: 14, display: "block" };
const quickLink: CSSProperties = { fontSize: 13, fontWeight: 700, color: ACCENT, textDecoration: "none" };
const statCard: CSSProperties = { border: `1px solid ${ACCENT}35`, background: `${ACCENT}08`, borderRadius: 14, padding: "16px 18px" };
const statLabel: CSSProperties = { fontSize: 11, fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase", color: ACCENT };
const statValue: CSSProperties = { fontSize: 28, fontWeight: 900, color: "#0f172a", marginTop: 4, fontVariantNumeric: "tabular-nums" };
const statNote: CSSProperties = { fontSize: 12, color: "#64748b", margin: "6px 0 0", lineHeight: 1.5 };
