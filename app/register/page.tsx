"use client";

/**
 * /register — a guided, 3-step account wizard (Milestone → Current stage →
 * Details). Fields reveal progressively as earlier ones are completed, with
 * clear validation and "you did it" feedback, so filling the form feels like
 * making steady progress. Creates a Firebase account + Firestore profile, then
 * starts the assessment.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { CLARITY_STAGES, journeyForCategory, PASSWORD_RULES, passwordIsValid, emailIsValid, phoneIsValid } from "@/lib/auth/formOptions";

const NAVY = "#2f3f9e";
const BG = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=70";

const MILESTONES = [
  { value: "class_6_8", label: "Class 6 – 8", icon: "school", color: "#2f6bff", soft: "#e9f0ff" },
  { value: "class_9_10", label: "Class 9 – 10", icon: "route", color: "#16a34a", soft: "#e6f6ec" },
  { value: "class_11_12", label: "Class 11 – 12", icon: "compass", color: "#7c3aed", soft: "#f1e9fd" },
  { value: "graduate", label: "Graduates", icon: "cap", color: "#e08a0a", soft: "#fdf1dd" },
  { value: "experienced_professional", label: "Professionals", icon: "briefcase", color: "#0d9488", soft: "#dff5f2" },
];
const STAGES = [
  { value: CLARITY_STAGES[0], label: "I have no idea about my career", icon: "help", color: "#c0564f" },
  { value: CLARITY_STAGES[1], label: "I’m confused among various career options", icon: "signpost", color: "#e08a0a" },
  { value: CLARITY_STAGES[2], label: "I’m a bit sure but want to explore more", icon: "compass", color: "#2f6bff" },
  { value: CLARITY_STAGES[3], label: "I’m sure but need an execution plan", icon: "route", color: "#16a34a" },
];
const TABS = ["Set your milestone", "Select your current stage", "Start assessment"];

export default function RegisterPage() {
  const router = useRouter();
  const { ready, register } = useAuth();

  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", category: "", clarity: "", email: "", phone: "", city: "", institution: "", age: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const nameOk = f.name.trim() !== "";
  const emailOk = emailIsValid(f.email);
  const phoneOk = phoneIsValid(f.phone);
  const pwOk = passwordIsValid(f.password);
  const step0Ok = nameOk && f.category !== "";
  const step1Ok = f.clarity !== "";
  const step2Ok = emailOk && phoneOk && pwOk;
  const done0 = step0Ok, done1 = step1Ok, done2 = step2Ok;

  const canGoTo = (i: number) => i === 0 || (i === 1 && step0Ok) || (i === 2 && step0Ok && step1Ok);

  async function submit() {
    setTouched(true);
    setError("");
    if (!step2Ok) return;
    if (!ready) { setError("Accounts aren’t configured on this deployment yet (missing Firebase keys)."); return; }
    setSubmitting(true);
    try {
      await register({
        name: f.name, email: f.email, phone: f.phone, institution: f.institution,
        category: f.category, journeyCode: journeyForCategory(f.category), clarity: f.clarity,
        password: f.password, city: f.city, age: f.age,
      });
      setDone(true);
      setTimeout(() => router.push("/?begin=1"), 1100);
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <div style={S.page}>
      <style>{CSS}</style>
      <div style={S.overlay} />
      <Link href="/" style={S.home}>HOME</Link>

      <div style={S.card}>
        {/* tabs */}
        <div style={S.tabs}>
          {TABS.map((t, i) => {
            const isActive = step === i;
            const complete = (i === 0 && done0) || (i === 1 && done1) || (i === 2 && done2);
            return (
              <button key={t} onClick={() => canGoTo(i) && setStep(i)} disabled={!canGoTo(i)}
                style={{ ...S.tab, ...(isActive ? S.tabActive : {}), ...(canGoTo(i) ? {} : S.tabLocked) }}>
                {complete && !isActive && <span style={S.tabTick}>✓</span>}
                {t.toUpperCase()}
              </button>
            );
          })}
        </div>

        <div style={S.body} className="og-reg-body">
          {done ? (
            <div style={S.doneWrap} className="rin">
              <div style={S.doneCheck}>✓</div>
              <h2 style={S.doneTitle}>You’re all set, {f.name.split(" ")[0] || "there"}!</h2>
              <p style={S.doneSub}>Account created — taking you to your assessment…</p>
            </div>
          ) : step === 0 ? (
            /* ---------------- Step 1: Milestone ---------------- */
            <>
              <h2 style={S.h}>Select your milestone.</h2>
              <label style={S.floatLabel}>Your name</label>
              <div style={S.underWrap}>
                <input style={S.underInput} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Type your full name" />
                {nameOk && <span style={S.okTick}>✓</span>}
              </div>
              {touched && !nameOk && <div style={S.err}>Please enter your name.</div>}

              <div style={S.sectionLabel}>I need guidance for <span style={S.muted}>(select any one)</span></div>
              <div style={S.milestones} className="og-ms">
                {MILESTONES.map((m) => {
                  const sel = f.category === m.value;
                  return (
                    <button key={m.value} onClick={() => set("category", m.value)} style={{ ...S.mCard, ...(sel ? { borderColor: m.color, boxShadow: `0 0 0 3px ${m.color}22`, background: "#fff" } : {}) }}>
                      <span style={{ ...S.mIcon, ...(sel ? { background: m.soft, color: m.color } : { background: "#f1f3f7", color: "#9aa3b2" }) }}><Icon name={m.icon} size={21} stroke={1.6} /></span>
                      <span style={{ ...S.mLabel, ...(sel ? { color: m.color } : {}) }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
              {touched && !f.category && <div style={S.err}>Please select one option above.</div>}

              <div style={S.footer}>
                <Link href="/signin" style={S.ghostBtn}>Existing user login</Link>
                <button style={S.next} onClick={() => { if (step0Ok) { setTouched(false); setStep(1); } else setTouched(true); }}>Next →</button>
              </div>
            </>
          ) : step === 1 ? (
            /* ---------------- Step 2: Current stage ---------------- */
            <>
              <h2 style={S.h}>Set your current stage.</h2>
              <div style={S.confirmPill}><Icon name="check" size={14} /> {MILESTONES.find((m) => m.value === f.category)?.label} · career guidance</div>
              <div style={S.sectionLabel}>Where are you right now?</div>
              <div style={S.stages} className="og-st">
                {STAGES.map((c, i) => {
                  const sel = f.clarity === c.value;
                  return (
                    <button key={c.value} onClick={() => set("clarity", c.value)} className="rin" style={{ ...S.sCard, animationDelay: `${i * 70}ms`, ...(sel ? { borderColor: c.color, boxShadow: `0 0 0 3px ${c.color}22` } : {}) }}>
                      <span style={{ ...S.sIcon, color: sel ? c.color : "#9aa3b2", ...(sel ? { borderColor: c.color } : {}) }}><Icon name={c.icon} size={21} stroke={1.6} /></span>
                      <span style={{ ...S.sLabel, ...(sel ? { color: c.color, fontWeight: 700 } : {}) }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
              {touched && !f.clarity && <div style={S.err}>Please choose one option above.</div>}
              <div style={S.footer}>
                <button style={S.ghostBtn} onClick={() => { setTouched(false); setStep(0); }}>← Back</button>
                <button style={S.next} onClick={() => { if (step1Ok) { setTouched(false); setStep(2); } else setTouched(true); }}>Next →</button>
              </div>
            </>
          ) : (
            /* ---------------- Step 3: Details (progressive reveal) ---------------- */
            <>
              <h2 style={S.h}>Let’s start.</h2>
              <p style={S.subhint}>Your email and password are your login — you’ll use them to view your report anytime.</p>
              {error && <div style={S.errorBox}>{error}</div>}

              <div style={S.grid2} className="og-g2">
                <Field label="Email" value={f.email} onChange={(v) => set("email", v)} ok={emailOk} touched={touched} type="email" placeholder="you@email.com" />
              </div>

              {emailOk && (
                <div style={S.grid2} className="rin og-g2">
                  <Field label="Phone number" value={f.phone} onChange={(v) => set("phone", v)} ok={phoneOk} touched={touched} placeholder="10-digit mobile" />
                  <Field label="Location (city)" value={f.city} onChange={(v) => set("city", v)} placeholder="Your city" optional />
                </div>
              )}

              {emailOk && phoneOk && (
                <div className="rin">
                  <div style={S.grid2} className="og-g2">
                    <Field label="School / College / Company" value={f.institution} onChange={(v) => set("institution", v)} placeholder="Where you study / work" optional />
                    <Field label="Age" value={f.age} onChange={(v) => set("age", v.replace(/[^\d]/g, "").slice(0, 2))} placeholder="e.g. 17" optional />
                  </div>
                  <div style={{ position: "relative", marginTop: 4 }}>
                    <label style={S.fLabel}>Create your password {pwOk && <span style={S.okInline}>✓</span>}</label>
                    <input style={S.input} type={showPw ? "text" : "password"} value={f.password} onChange={(e) => set("password", e.target.value)} placeholder="Choose a strong password" />
                    <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
                    {f.password.length > 0 && (
                      <ul style={S.rules} className="og-reg-rules">
                        {PASSWORD_RULES.map((r) => {
                          const good = r.test(f.password);
                          return <li key={r.label} style={{ ...S.rule, color: good ? "#15803d" : "#9aa1ad" }}>{good ? "✓" : "○"} {r.label}</li>;
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div style={S.footer}>
                <button style={S.ghostBtn} onClick={() => { setTouched(false); setStep(1); }}>← Back</button>
                <button style={{ ...S.next, ...(submitting ? S.disabled : {}) }} disabled={submitting} onClick={() => void submit()}>
                  {submitting ? "Creating…" : "Start →"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* progress dots */}
        {!done && (
          <div style={S.progress}>
            {[0, 1, 2].map((i) => <span key={i} style={{ ...S.dot, ...(i === step ? S.dotOn : i < step ? S.dotDone : {}) }} />)}
          </div>
        )}
      </div>

      <div style={S.brand}><span style={S.brandChip}><Logo height={26} /></span></div>
    </div>
  );
}

/* --------------------------- reusable field ---------------------------- */
function Field({ label, value, onChange, ok, touched, type = "text", placeholder, optional, autoFocus }:
  { label: string; value: string; onChange: (v: string) => void; ok?: boolean; touched?: boolean; type?: string; placeholder?: string; optional?: boolean; autoFocus?: boolean }) {
  const invalid = touched && !optional && ok === false;
  return (
    <div style={{ position: "relative" }}>
      <label style={S.fLabel}>{label}{optional && <span style={S.optTag}> (optional)</span>} {ok && <span style={S.okInline}>✓</span>}</label>
      <input style={{ ...S.input, ...(invalid ? S.inputBad : {}) }} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} />
      {invalid && <div style={S.err}>Please enter a valid {label.toLowerCase()}.</div>}
    </div>
  );
}

/* -------------------------------- styles ------------------------------- */
const S: Record<string, React.CSSProperties> = {
  page: { position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", fontFamily: "'Poppins', Inter, system-ui, sans-serif", background: `url(${BG}) center/cover fixed` },
  overlay: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,26,44,.62), rgba(20,26,44,.72))" },
  home: { position: "absolute", top: 20, right: 20, zIndex: 3, background: NAVY, color: "#fff", textDecoration: "none", fontSize: 12.5, fontWeight: 700, letterSpacing: .5, padding: "9px 20px", borderRadius: 8, border: "1px solid rgba(255,255,255,.25)" },
  brand: { position: "absolute", bottom: 16, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 2 },
  brandChip: { background: "#fff", borderRadius: 8, padding: "6px 12px", display: "inline-flex", boxShadow: "0 6px 16px rgba(0,0,0,.2)" },

  card: { position: "relative", zIndex: 2, width: "100%", maxWidth: 840, background: "#fff", borderRadius: 14, boxShadow: "0 26px 70px rgba(0,0,0,.34)", overflow: "hidden" },
  tabs: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#f3f4f7" },
  tab: { position: "relative", padding: "13px 8px", border: "none", background: "transparent", fontSize: 11, fontWeight: 800, letterSpacing: .5, color: "#8a90a0", cursor: "pointer", textTransform: "uppercase" },
  tabActive: { background: NAVY, color: "#fff", boxShadow: "0 8px 22px rgba(47,63,158,.4)" },
  tabLocked: { opacity: .55, cursor: "not-allowed" },
  tabTick: { color: "#16a34a", marginRight: 5, fontWeight: 800 },

  body: { padding: "24px 34px 6px", minHeight: 310 },
  h: { textAlign: "center", fontSize: 20, fontWeight: 700, color: "#1f2740", margin: "2px 0 18px" },
  subhint: { textAlign: "center", fontSize: 12.5, color: "#8a90a0", margin: "-10px 0 16px" },

  floatLabel: { display: "block", fontSize: 12, color: "#9aa1ad", marginBottom: 2 },
  underWrap: { position: "relative", marginBottom: 6, maxWidth: 480 },
  underInput: { width: "100%", border: "none", borderBottom: "1.5px solid #dfe3ea", fontSize: 14.5, padding: "7px 24px 7px 0", outline: "none", background: "transparent" },
  okTick: { position: "absolute", right: 0, top: 9, color: "#16a34a", fontWeight: 800, fontSize: 13 },

  sectionLabel: { fontSize: 13, fontWeight: 700, color: "#1f2740", margin: "20px 0 12px" },
  muted: { color: "#9aa1ad", fontWeight: 500 },

  milestones: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 },
  mCard: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "14px 6px", background: "#fff", border: "1.5px solid #eceef3", borderRadius: 12, cursor: "pointer", transition: "border-color .15s, box-shadow .15s" },
  mIcon: { width: 46, height: 46, borderRadius: "50%", display: "grid", placeItems: "center", transition: "box-shadow .15s" },
  mLabel: { fontSize: 11.5, fontWeight: 700, color: "#334155", textAlign: "center", lineHeight: 1.3 },
  mSel: { position: "absolute", top: 7, right: 7, width: 16, height: 16, borderRadius: "50%", color: "#fff", fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center" },

  confirmPill: { display: "inline-flex", alignItems: "center", gap: 6, background: "#eef2ff", color: NAVY, fontSize: 12, fontWeight: 700, padding: "6px 13px", borderRadius: 999, marginBottom: 2 },
  stages: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  sCard: { position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "18px 10px", background: "#fff", border: "1.5px solid #eceef3", borderRadius: 12, cursor: "pointer", textAlign: "center" },
  sIcon: { width: 46, height: 46, borderRadius: "50%", border: "1.5px solid #e4e7ee", display: "grid", placeItems: "center" },
  sLabel: { fontSize: 12, fontWeight: 600, color: "#334155", lineHeight: 1.4 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 14 },
  fLabel: { display: "block", fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 4 },
  optTag: { color: "#b6bcc7", fontWeight: 500 },
  okInline: { color: "#16a34a", fontWeight: 800 },
  input: { width: "100%", border: "none", borderBottom: "1.5px solid #dfe3ea", fontSize: 14, padding: "7px 52px 7px 0", outline: "none", background: "transparent", boxSizing: "border-box" },
  inputBad: { borderBottomColor: "#dc2626" },
  pwToggle: { position: "absolute", right: 0, top: 26, background: "none", border: "none", color: NAVY, fontWeight: 700, fontSize: 12, cursor: "pointer" },
  rules: { listStyle: "none", padding: "8px 0 0", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px 14px" },
  rule: { fontSize: 10.5, fontWeight: 600 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 4 },
  ghostBtn: { background: "#eef0f4", color: "#475569", border: "none", borderRadius: 8, padding: "12px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", textDecoration: "none", display: "inline-block" },
  next: { background: NAVY, color: "#fff", border: "none", borderRadius: 8, padding: "12px 30px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 22px rgba(47,63,158,.32)" },
  disabled: { opacity: .45, cursor: "not-allowed", boxShadow: "none" },
  err: { color: "#dc2626", fontSize: 11.5, marginTop: 4 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 9, fontSize: 13, marginBottom: 14, fontWeight: 600 },

  progress: { display: "flex", justifyContent: "center", gap: 8, padding: "10px 0 20px" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#d7dbe3" },
  dotOn: { background: NAVY, width: 22, borderRadius: 5 },
  dotDone: { background: "#16a34a" },

  doneWrap: { textAlign: "center", padding: "40px 0 20px" },
  doneCheck: { width: 76, height: 76, borderRadius: "50%", margin: "0 auto 16px", background: "linear-gradient(135deg,#16a34a,#22c55e)", color: "#fff", fontSize: 40, fontWeight: 800, display: "grid", placeItems: "center", boxShadow: "0 14px 30px rgba(22,163,74,.4)" },
  doneTitle: { fontSize: 22, fontWeight: 800, color: "#1f2740", margin: "0 0 6px" },
  doneSub: { fontSize: 14, color: "#64748b" },
};

const CSS = `
@keyframes rinKey{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.rin{animation:rinKey .5s cubic-bezier(.2,.8,.25,1) both}
@media(max-width:760px){
  .og-ms{grid-template-columns:repeat(2,1fr) !important}
  .og-st{grid-template-columns:repeat(2,1fr) !important}
  .og-g2{grid-template-columns:1fr !important}
  .og-reg-body{padding:20px 18px 6px !important}
}
@media(max-width:440px){
  .og-ms{grid-template-columns:1fr 1fr !important}
  .og-reg-rules{grid-template-columns:1fr 1fr !important}
  .og-reg-body{padding:18px 14px 6px !important}
}`;
