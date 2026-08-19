"use client";

/**
 * /demo-test intake — class, stream, desired career, then details.
 *
 * The order is the client's: a student picks the class they are in, then the
 * exact subject combination they took, and only then a career — because the
 * career list is filtered BY that combination. Asking for the career first
 * would mean offering a commerce student MBBS and taking it away afterwards.
 *
 * Careers are shown in all three states rather than filtered down to what is
 * open. A student who took Commerce and wanted medicine needs to SEE that the
 * door is shut and why, at the moment they are choosing — that is guidance.
 * Silently omitting it just looks like the list is short.
 */

import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/app/Logo";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { PASSWORD_RULES, passwordIsValid, emailIsValid, phoneIsValid } from "@/lib/auth/formOptions";
import { C } from "@/app/account/viz";

const NAVY = "#2f3f9e";

type Verdict = "green" | "yellow" | "red";
type OfferedCareer = {
  id: string; title: string; cluster: string; domain: string;
  verdict: Verdict; conditional: boolean; unlisted: boolean; via: string[];
};
type Family = { family: string; combinations: string[] };

const VERDICT_META: Record<Verdict, { dot: string; label: string; note: string }> = {
  green: { dot: "#2f9e6f", label: "Open to you", note: "Directly eligible from your subject combination." },
  yellow: { dot: "#d98324", label: "Possible, with conditions", note: "Allowed by some institutions, or needs a bridge subject or specific entrance exam. Check the college before you count on it." },
  red: { dot: "#c0564f", label: "Not open from this stream", note: "Your subject combination does not lead here directly. A later switch is sometimes possible after graduation." },
};

export interface IntakeResult {
  klass: string;
  combination: string;
  family: string;
  careerId: string;
  careerTitle: string;
}

export default function DemoIntake({ onDone }: { onDone: (r: IntakeResult) => void }) {
  const { ready, register, user } = useAuth();

  const [step, setStep] = useState(0);
  const [klass, setKlass] = useState("");
  const [family, setFamily] = useState("");
  const [combination, setCombination] = useState("");
  const [careerId, setCareerId] = useState("");

  const [families, setFamilies] = useState<Family[]>([]);
  const [groups, setGroups] = useState<{ domain: string; careers: OfferedCareer[] }[]>([]);
  const [counts, setCounts] = useState<{ open: number; conditional: number; closed: number } | null>(null);
  const [loadingCareers, setLoadingCareers] = useState(false);
  const [search, setSearch] = useState("");

  const [f, setF] = useState({ name: "", email: "", phone: "", city: "", institution: "", age: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Stream families are static reference data, so they load once up front.
  useEffect(() => {
    fetch("/api/demo-test/catalogue")
      .then((r) => r.json())
      .then((j) => { if (j.success) setFamilies(j.data.families); })
      .catch(() => setError("Could not load the stream list. Please reload."));
  }, []);

  // Careers depend entirely on the combination, so they reload whenever it
  // changes and the previous choice is cleared - a career picked under one
  // stream may not even exist under another.
  useEffect(() => {
    if (!combination) { setGroups([]); setCounts(null); return; }
    setCareerId("");
    setLoadingCareers(true);
    fetch(`/api/demo-test/catalogue?combination=${encodeURIComponent(combination)}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.success) { setGroups(j.data.groups); setCounts(j.data.counts); }
        else setError(j.message || "Could not load careers for that stream.");
      })
      .catch(() => setError("Could not load careers for that stream."))
      .finally(() => setLoadingCareers(false));
  }, [combination]);

  const selectedCareer = useMemo(() => {
    for (const g of groups) {
      const hit = g.careers.find((c) => c.id === careerId);
      if (hit) return hit;
    }
    return null;
  }, [groups, careerId]);

  const visibleGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({ domain: g.domain, careers: g.careers.filter((c) => c.title.toLowerCase().includes(q)) }))
      .filter((g) => g.careers.length);
  }, [groups, search]);

  const nameOk = f.name.trim() !== "";
  const emailOk = emailIsValid(f.email);
  const phoneOk = phoneIsValid(f.phone);
  const pwOk = passwordIsValid(f.password);
  const detailsOk = nameOk && emailOk && phoneOk && pwOk;

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  async function submit() {
    setTouched(true);
    setError("");
    if (!detailsOk) return;
    if (!ready) { setError("Accounts are not configured on this deployment yet."); return; }
    setSubmitting(true);
    try {
      // Only registers when there is no session. Someone already signed in can
      // sit the demo without being forced to create a second account.
      if (!user) {
        await register({
          name: f.name, email: f.email, phone: f.phone, institution: f.institution,
          // This category is what routes the exam to the demo bank, and it is
          // the ONLY category that does. See stageForCategory in
          // lib/newAssessment/data.ts.
          category: "class_11_12_demo",
          journeyCode: "career_planning",
          clarity: "exploring",
          desiredCareer: selectedCareer?.title ?? "",
          password: f.password, city: f.city, age: f.age,
        });
      }
      // Fire-and-forget: a mail outage must not block a student from sitting a
      // free demo they have already filled a form for.
      void fetch("/api/crm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name, email: f.email, phone: f.phone, institution: f.institution,
          category: "class_11_12_demo", city: f.city, age: f.age,
          source: "demo-test", stream: combination, desiredCareer: selectedCareer?.title,
        }),
      }).catch(() => {});
      onDone({
        klass, combination, family,
        careerId, careerTitle: selectedCareer?.title ?? "",
      });
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  const TABS = ["Your class", "Your stream", "Desired career", "Your details"];
  const canGoTo = (i: number) =>
    i === 0 ||
    (i === 1 && !!klass) ||
    (i === 2 && !!combination) ||
    (i === 3 && !!careerId);

  return (
    <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header style={S.header}>
        <Logo height={34} />
        <span style={S.demoTag}>Demo assessment &middot; Class 11-12</span>
      </header>

      <div style={S.wrap}>
        <div style={S.tabs}>
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => canGoTo(i) && setStep(i)}
              disabled={!canGoTo(i)}
              style={{ ...S.tab, ...(step === i ? S.tabActive : {}), ...(canGoTo(i) ? {} : S.tabLocked) }}
            >
              {i + 1}. {t}
            </button>
          ))}
        </div>

        <div style={S.card}>
          {error && <div style={S.errorBox}>{error}</div>}

          {/* ---------------- Step 1: class ---------------- */}
          {step === 0 && (
            <>
              <h2 style={S.h}>Which class are you in?</h2>
              <p style={S.sub}>This demo covers classes 11 and 12.</p>
              <div style={S.grid2}>
                {["Class 11", "Class 12"].map((k) => (
                  <button
                    key={k}
                    onClick={() => { setKlass(k); setStep(1); }}
                    style={{ ...S.bigChoice, ...(klass === k ? S.bigChoiceOn : {}) }}
                  >
                    <strong style={S.bigChoiceTitle}>{k}</strong>
                    <span style={S.bigChoiceSub}>
                      {k === "Class 11" ? "You have just chosen your subjects" : "You are preparing for entrances now"}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ---------------- Step 2: stream ---------------- */}
          {step === 1 && (
            <>
              <h2 style={S.h}>Which stream and subject combination?</h2>
              <p style={S.sub}>
                Pick the exact combination you are studying. Everything after this &mdash; which careers
                you can reach and which are closed &mdash; follows from this one answer.
              </p>
              {!families.length && <p style={S.muted}>Loading streams&hellip;</p>}
              {families.map((fam) => (
                <div key={fam.family} style={{ marginBottom: 18 }}>
                  <div style={S.groupLabel}>{fam.family}</div>
                  <div style={S.chipWrap}>
                    {fam.combinations.map((combo) => (
                      <button
                        key={combo}
                        onClick={() => { setFamily(fam.family); setCombination(combo); }}
                        style={{ ...S.chip, ...(combination === combo ? S.chipOn : {}) }}
                      >
                        {combo}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div style={S.footer}>
                <button style={S.ghost} onClick={() => setStep(0)}>&larr; Back</button>
                <button
                  style={{ ...S.next, ...(combination ? {} : S.disabled) }}
                  disabled={!combination}
                  onClick={() => setStep(2)}
                >
                  Next &rarr;
                </button>
              </div>
            </>
          )}

          {/* ---------------- Step 3: desired career ---------------- */}
          {step === 2 && (
            <>
              <h2 style={S.h}>Which career do you want?</h2>
              <p style={S.sub}>
                Choose what you want <em>today</em>, honestly &mdash; not what you think the test wants
                to hear. After the assessment we compare this against what your answers actually show,
                and that comparison is the most useful page in your report.
              </p>

              <div style={S.streamPill}>
                <strong>{combination}</strong>
                {counts && (
                  <span style={{ color: C.ink3, fontWeight: 500 }}>
                    &nbsp;&middot;&nbsp;{counts.open} open &middot; {counts.conditional} conditional &middot; {counts.closed} closed
                  </span>
                )}
                <button style={S.changeLink} onClick={() => setStep(1)}>change</button>
              </div>

              <div style={S.legend}>
                {(["green", "yellow", "red"] as Verdict[]).map((v) => (
                  <span key={v} style={S.legendItem}>
                    <span style={{ ...S.dot, background: VERDICT_META[v].dot }} />
                    {VERDICT_META[v].label}
                  </span>
                ))}
              </div>

              <input
                style={S.search}
                placeholder="Search careers, e.g. engineer, doctor, designer"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {loadingCareers && <p style={S.muted}>Working out what your stream opens&hellip;</p>}

              <div style={S.careerScroll} className="og-demo-scroll">
                {visibleGroups.map((g) => (
                  <div key={g.domain} style={{ marginBottom: 14 }}>
                    <div style={S.groupLabel}>{g.domain}</div>
                    {g.careers.map((c) => {
                      const closed = c.verdict === "red";
                      const meta = VERDICT_META[c.verdict];
                      return (
                        <button
                          key={c.id}
                          disabled={closed}
                          onClick={() => !closed && setCareerId(c.id)}
                          title={closed ? meta.note : c.via.length ? `via ${c.via.slice(0, 3).join(", ")}` : ""}
                          style={{
                            ...S.careerRow,
                            ...(careerId === c.id ? S.careerRowOn : {}),
                            ...(closed ? S.careerRowOff : {}),
                          }}
                        >
                          <span style={{ ...S.dot, background: meta.dot }} />
                          <span style={S.careerTitle}>{c.title}</span>
                          {c.verdict === "yellow" && <span style={S.tagWarn}>conditions apply</span>}
                          {closed && (
                            <span style={S.tagOff}>
                              {c.unlisted ? "not offered from this stream" : "not eligible"}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {!loadingCareers && !visibleGroups.length && (
                  <p style={S.muted}>No careers match that search.</p>
                )}
              </div>

              {selectedCareer && (
                <div style={S.selectedBox}>
                  <div>
                    <strong>{selectedCareer.title}</strong>
                    <div style={S.selectedNote}>{VERDICT_META[selectedCareer.verdict].note}</div>
                    {selectedCareer.via.length > 0 && (
                      <div style={S.selectedVia}>
                        Reached through: {selectedCareer.via.slice(0, 4).join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={S.footer}>
                <button style={S.ghost} onClick={() => setStep(1)}>&larr; Back</button>
                <button
                  style={{ ...S.next, ...(careerId ? {} : S.disabled) }}
                  disabled={!careerId}
                  onClick={() => setStep(3)}
                >
                  Next &rarr;
                </button>
              </div>
            </>
          )}

          {/* ---------------- Step 4: details ---------------- */}
          {step === 3 && (
            <>
              <h2 style={S.h}>Almost there &mdash; your details</h2>
              <p style={S.sub}>
                No payment for this demo. Your email and password are your login, so you can come back
                and read your report any time. We email you a copy as well.
              </p>

              <div style={S.summaryStrip}>
                <span><b>{klass}</b></span>
                <span>{combination}</span>
                <span>Wants to be: <b>{selectedCareer?.title}</b></span>
              </div>

              <div style={S.grid2}>
                <Field label="Full name" value={f.name} onChange={(v) => set("name", v)} ok={nameOk} touched={touched} />
                <Field label="Email" type="email" value={f.email} onChange={(v) => set("email", v)} ok={emailOk} touched={touched} />
              </div>
              <div style={S.grid2}>
                <Field label="Phone number" value={f.phone} onChange={(v) => set("phone", v)} ok={phoneOk} touched={touched} placeholder="10-digit mobile" />
                <Field label="City" value={f.city} onChange={(v) => set("city", v)} optional />
              </div>
              <div style={S.grid2}>
                <Field label="School" value={f.institution} onChange={(v) => set("institution", v)} optional />
                <Field label="Age" value={f.age} onChange={(v) => set("age", v.replace(/[^\d]/g, "").slice(0, 2))} optional />
              </div>

              <div style={{ position: "relative", marginTop: 4 }}>
                <label style={S.fLabel}>Create a password {pwOk && <span style={S.ok}>&#10003;</span>}</label>
                <input
                  style={S.input}
                  type={showPw ? "text" : "password"}
                  value={f.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Choose a strong password"
                />
                <button type="button" style={S.pwToggle} onClick={() => setShowPw((x) => !x)}>
                  {showPw ? "Hide" : "Show"}
                </button>
                {f.password.length > 0 && (
                  <ul style={S.rules}>
                    {PASSWORD_RULES.map((r) => {
                      const good = r.test(f.password);
                      return <li key={r.label} style={{ ...S.rule, color: good ? "#15803d" : "#9aa1ad" }}>{good ? "✓" : "○"} {r.label}</li>;
                    })}
                  </ul>
                )}
                {touched && !pwOk && <div style={S.err}>Your password needs to meet every rule above.</div>}
              </div>

              <div style={S.footer}>
                <button style={S.ghost} onClick={() => setStep(2)}>&larr; Back</button>
                <button
                  style={{ ...S.next, ...(submitting ? S.disabled : {}) }}
                  disabled={submitting}
                  onClick={() => void submit()}
                >
                  {submitting ? "Setting up…" : "Start the assessment →"}
                </button>
              </div>
            </>
          )}
        </div>

        <p style={S.footNote}>
          60 questions across 8 dimensions &middot; no time pressure &middot; free demo
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, ok, touched, type = "text", placeholder, optional }: {
  label: string; value: string; onChange: (v: string) => void; ok?: boolean;
  touched?: boolean; type?: string; placeholder?: string; optional?: boolean;
}) {
  const invalid = touched && !optional && ok === false;
  return (
    <div style={{ position: "relative" }}>
      <label style={S.fLabel}>
        {label}{optional && <span style={S.optTag}> (optional)</span>} {ok && <span style={S.ok}>&#10003;</span>}
      </label>
      <input
        style={{ ...S.input, ...(invalid ? { borderBottomColor: "#dc2626" } : {}) }}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {invalid && <div style={S.err}>Please enter a valid {label.toLowerCase()}.</div>}
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: C.bg, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: C.ink },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#fff", borderBottom: `1px solid ${C.line}` },
  demoTag: { fontSize: 12, fontWeight: 700, letterSpacing: .3, color: NAVY, background: "#eef1fb", border: "1px solid #dfe4f7", borderRadius: 999, padding: "5px 12px" },

  wrap: { maxWidth: 780, margin: "0 auto", padding: "26px 18px 60px" },
  tabs: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, marginBottom: 14 },
  tab: { padding: "10px 6px", border: `1px solid ${C.line}`, background: "#fff", borderRadius: 9, fontSize: 11.5, fontWeight: 700, color: C.ink3, cursor: "pointer" },
  tabActive: { background: NAVY, color: "#fff", borderColor: NAVY },
  tabLocked: { opacity: .5, cursor: "not-allowed" },

  card: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: "26px 24px", boxShadow: "0 2px 10px rgba(20,20,25,.04)" },
  h: { fontSize: 20, fontWeight: 800, margin: "0 0 6px" },
  sub: { fontSize: 13.5, color: C.ink3, lineHeight: 1.6, margin: "0 0 18px" },
  muted: { fontSize: 13, color: C.muted },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 },
  bigChoice: { display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start", padding: "20px 18px", background: "#fff", border: `1.5px solid ${C.line}`, borderRadius: 13, cursor: "pointer", textAlign: "left" },
  bigChoiceOn: { borderColor: NAVY, boxShadow: `0 0 0 3px ${NAVY}22` },
  bigChoiceTitle: { fontSize: 16, fontWeight: 800 },
  bigChoiceSub: { fontSize: 12.5, color: C.ink3 },

  groupLabel: { fontSize: 11, fontWeight: 800, letterSpacing: .5, textTransform: "uppercase", color: C.muted, margin: "0 0 8px" },
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "9px 14px", border: `1.5px solid ${C.line}`, background: "#fff", borderRadius: 999, fontSize: 12.5, fontWeight: 600, color: C.ink2, cursor: "pointer" },
  chipOn: { borderColor: NAVY, color: NAVY, background: "#eef1fb", fontWeight: 700 },

  streamPill: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", background: C.line2, borderRadius: 10, padding: "9px 13px", fontSize: 12.5, marginBottom: 12 },
  changeLink: { marginLeft: "auto", background: "none", border: "none", color: NAVY, fontWeight: 700, fontSize: 12, cursor: "pointer", textDecoration: "underline" },

  legend: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12, fontSize: 11.5, color: C.ink3 },
  legendItem: { display: "inline-flex", alignItems: "center", gap: 6 },
  dot: { width: 9, height: 9, borderRadius: "50%", flexShrink: 0 },

  search: { width: "100%", padding: "10px 13px", border: `1px solid ${C.line}`, borderRadius: 9, fontSize: 13.5, marginBottom: 12, boxSizing: "border-box", outline: "none" },
  careerScroll: { maxHeight: 330, overflowY: "auto", border: `1px solid ${C.line}`, borderRadius: 11, padding: "12px 12px 4px" },
  careerRow: { display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "9px 10px", border: "1px solid transparent", background: "none", borderRadius: 8, fontSize: 13.5, color: C.ink, cursor: "pointer", textAlign: "left", marginBottom: 2 },
  careerRowOn: { background: "#eef1fb", borderColor: NAVY, fontWeight: 700 },
  careerRowOff: { opacity: .48, cursor: "not-allowed" },
  careerTitle: { flex: 1 },
  tagWarn: { fontSize: 10, fontWeight: 700, color: "#a4661c", background: "#fdf3e5", borderRadius: 5, padding: "2px 6px" },
  tagOff: { fontSize: 10, fontWeight: 700, color: "#8d4b47", background: "#fbeceb", borderRadius: 5, padding: "2px 6px" },

  selectedBox: { marginTop: 12, background: "#f3f6ff", border: "1px solid #dde3f6", borderRadius: 11, padding: "12px 14px", fontSize: 13 },
  selectedNote: { fontSize: 12, color: C.ink3, marginTop: 3, lineHeight: 1.55 },
  selectedVia: { fontSize: 11.5, color: C.muted, marginTop: 5 },

  summaryStrip: { display: "flex", gap: 14, flexWrap: "wrap", background: C.line2, borderRadius: 10, padding: "10px 13px", fontSize: 12.5, color: C.ink2, marginBottom: 16 },

  fLabel: { display: "block", fontSize: 12, color: C.ink3, fontWeight: 600, marginBottom: 4 },
  optTag: { color: C.faint, fontWeight: 500 },
  ok: { color: "#16a34a", fontWeight: 800 },
  input: { width: "100%", border: "none", borderBottom: `1.5px solid ${C.line}`, fontSize: 14, padding: "7px 52px 7px 0", outline: "none", background: "transparent", boxSizing: "border-box" },
  pwToggle: { position: "absolute", right: 0, top: 24, background: "none", border: "none", color: NAVY, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  rules: { listStyle: "none", padding: "8px 0 0", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px 14px" },
  rule: { fontSize: 10.5, fontWeight: 600 },
  err: { color: "#dc2626", fontSize: 11.5, marginTop: 4 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 9, fontSize: 13, marginBottom: 14, fontWeight: 600 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 },
  ghost: { background: C.line2, color: C.ink2, border: "none", borderRadius: 9, padding: "11px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  next: { background: NAVY, color: "#fff", border: "none", borderRadius: 9, padding: "11px 26px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" },
  disabled: { opacity: .45, cursor: "not-allowed" },

  footNote: { textAlign: "center", fontSize: 12, color: C.muted, marginTop: 16 },
};

const CSS = `
.og-demo-scroll::-webkit-scrollbar{width:8px}
.og-demo-scroll::-webkit-scrollbar-thumb{background:#dcdce3;border-radius:4px}
@media(max-width:640px){
  [style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr !important}
}`;
