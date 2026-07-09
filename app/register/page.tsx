"use client";

/**
 * /register — concise two-panel account page. Left: compact form (all fields).
 * Right: a student-writing-the-test illustration + a motivational line.
 * Creates a Firebase account + Firestore profile, then starts the assessment.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import {
  CATEGORY_OPTIONS,
  CLARITY_STAGES,
  journeyForCategory,
  PASSWORD_RULES,
  passwordIsValid,
  emailIsValid,
  phoneIsValid,
} from "@/lib/auth/formOptions";

const CSS = `
.reg-shell { display: grid; grid-template-columns: 1.05fr 0.95fr; }
@media (max-width: 880px) {
  .reg-shell { grid-template-columns: 1fr; }
  .reg-visual { display: none !important; }
}
.reg-input:focus { border-color: #e0242e !important; background: #fff !important; }
`;

export default function RegisterPage() {
  const router = useRouter();
  const { ready, register } = useAuth();

  const [f, setF] = useState({
    name: "", email: "", phone: "", institution: "",
    desiredCareer: "", category: "", clarity: "", password: "", confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  const pwOk = passwordIsValid(f.password);
  const canSubmit = useMemo(
    () =>
      f.name.trim() !== "" && emailIsValid(f.email) && phoneIsValid(f.phone) &&
      f.category !== "" && pwOk && f.password === f.confirm,
    [f, pwOk]
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError("");
    if (!canSubmit) return;
    if (!ready) {
      setError("Accounts aren’t configured on this deployment yet (missing Firebase keys).");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: f.name, email: f.email, phone: f.phone, institution: f.institution,
        desiredCareer: f.desiredCareer, category: f.category,
        journeyCode: journeyForCategory(f.category), clarity: f.clarity, password: f.password,
      });
      router.push("/?begin=1");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const selStyle = (v: string): React.CSSProperties => ({ ...S.input, color: v ? "#1f2430" : "#9aa1ad" });

  return (
    <div style={S.page}>
      <style>{CSS}</style>
      <header style={S.header}>
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={30} /></Link>
        <div style={S.headerRight}>
          <span style={S.haveAcct}>Have an account?</span>
          <Link href="/signin" style={S.signInBtn}>Sign in</Link>
        </div>
      </header>
      <main style={S.wrap}>
      <div style={S.shell} className="reg-shell">
        {/* Left: form */}
        <div style={S.left}>
          <h1 style={S.title}>Create your account</h1>
          <p style={S.subtitle}>Sign up and start your career assessment.</p>

          {!ready && (
            <div style={S.warn}>Sign-up needs the site’s Firebase keys — the form works, but won’t save until configured.</div>
          )}
          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate style={S.form}>
            <div>
              <input className="reg-input" style={S.input} value={f.name} onChange={set("name")} placeholder="Full name *" />
              {touched && !f.name.trim() && <Err>Name is required.</Err>}
            </div>
            <div style={S.row}>
              <div>
                <input className="reg-input" style={S.input} type="email" value={f.email} onChange={set("email")} placeholder="Email *" />
                {touched && !emailIsValid(f.email) && <Err>Valid email required.</Err>}
              </div>
              <div>
                <input className="reg-input" style={S.input} value={f.phone} onChange={set("phone")} placeholder="Phone *" />
                {touched && !phoneIsValid(f.phone) && <Err>Valid phone required.</Err>}
              </div>
            </div>
            <input className="reg-input" style={S.input} value={f.institution} onChange={set("institution")} placeholder="School / College / Company" />
            <div style={S.row}>
              <input className="reg-input" style={S.input} value={f.desiredCareer} onChange={set("desiredCareer")} placeholder="Desired career (e.g. Doctor)" />
              <div>
                <select className="reg-input" style={selStyle(f.category)} value={f.category} onChange={set("category")}>
                  <option value="">Category / class *</option>
                  {CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {touched && !f.category && <Err>Select a category.</Err>}
              </div>
            </div>
            <select className="reg-input" style={selStyle(f.clarity)} value={f.clarity} onChange={set("clarity")}>
              <option value="">Current status — where are you with your career?</option>
              {CLARITY_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={S.row}>
              <div style={S.pwWrap}>
                <input className="reg-input" style={{ ...S.input, paddingRight: 52 }} type={showPw ? "text" : "password"} value={f.password} onChange={set("password")} placeholder="Password *" />
                <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
              </div>
              <div>
                <input className="reg-input" style={S.input} type={showPw ? "text" : "password"} value={f.confirm} onChange={set("confirm")} placeholder="Confirm *" />
                {touched && f.confirm !== "" && f.confirm !== f.password && <Err>Doesn’t match.</Err>}
              </div>
            </div>
            {f.password.length > 0 && (
              <ul style={S.rules}>
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(f.password);
                  return <li key={r.label} style={{ ...S.rule, color: ok ? "#15803d" : "#9aa1ad" }}>{ok ? "✓" : "○"} {r.label}</li>;
                })}
              </ul>
            )}
            <button type="submit" style={{ ...S.submit, ...(canSubmit && !submitting ? {} : S.submitDisabled) }} disabled={!canSubmit || submitting}>
              {submitting ? "Creating account…" : "Create account & start test"}
            </button>
          </form>

          <div style={S.footer}>
            <span>Have an account? <Link href="/signin" style={S.footLink}>Sign in</Link></span>
            <span style={S.terms}>Terms &amp; Conditions</span>
          </div>
        </div>

        {/* Right: student illustration + motivation */}
        <div style={S.visual} className="reg-visual">
          <StudentScene />
          <h2 style={S.motTitle}>You’ve got this! ✨</h2>
          <p style={S.motText}>
            Every great career starts with understanding yourself. Take your time,
            trust your instincts — there are no wrong answers here.
          </p>
        </div>
      </div>
      </main>
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) { return <div style={S.fieldErr}>{children}</div>; }

/** Flat illustration of a student writing a test at a desk. */
function StudentScene() {
  return (
    <svg viewBox="0 0 300 220" style={S.scene} role="img" aria-label="Student writing a test">
      {/* desk */}
      <rect x="40" y="150" width="220" height="16" rx="4" fill="#e6b8b3" />
      <rect x="54" y="166" width="10" height="42" rx="3" fill="#d99a94" />
      <rect x="236" y="166" width="10" height="42" rx="3" fill="#d99a94" />
      {/* paper + answer lines */}
      <rect x="150" y="120" width="86" height="34" rx="4" fill="#fff" stroke="#f1d0cd" />
      <rect x="158" y="128" width="60" height="4" rx="2" fill="#e0242e" opacity="0.5" />
      <rect x="158" y="137" width="70" height="4" rx="2" fill="#cbd5e1" />
      <rect x="158" y="146" width="46" height="4" rx="2" fill="#cbd5e1" />
      {/* books */}
      <rect x="52" y="138" width="70" height="8" rx="2" fill="#2d9cdb" />
      <rect x="58" y="130" width="64" height="8" rx="2" fill="#f2c94c" />
      {/* student body */}
      <path d="M96 150 q4 -46 40 -46 q34 0 40 46 z" fill="#e0242e" />
      {/* head */}
      <circle cx="136" cy="86" r="20" fill="#f4c9a8" />
      <path d="M116 82 q4 -22 20 -22 q18 0 20 22 q-10 -8 -20 -8 q-12 0 -20 8z" fill="#3a2a22" />
      {/* arm + pencil toward paper */}
      <path d="M164 128 l40 -8" stroke="#f4c9a8" strokeWidth="9" strokeLinecap="round" />
      <path d="M204 120 l16 -6" stroke="#f2c94c" strokeWidth="6" strokeLinecap="round" />
      <path d="M220 114 l6 -2" stroke="#5b4636" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

const RED = "#e0242e";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1f2430", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 26px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  haveAcct: { fontSize: 13, color: "#64748b" },
  signInBtn: { padding: "8px 16px", background: "#e0242e", color: "#fff", borderRadius: 9, fontSize: 13.5, fontWeight: 700, textDecoration: "none" },
  wrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 20px" },
  shell: { width: "100%", maxWidth: 960, background: "#fff", borderRadius: 22, overflow: "hidden", boxShadow: "0 28px 70px rgba(31,36,48,.18)", minHeight: 540 },

  left: { padding: "34px 42px 28px", display: "flex", flexDirection: "column" },
  logo: { alignSelf: "flex-start", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16 },
  title: { fontSize: 25, fontWeight: 800, margin: "0 0 4px" },
  subtitle: { fontSize: 13.5, color: "#8a8f9a", margin: "0 0 18px" },

  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "9px 12px", borderRadius: 10, fontSize: 12.5, marginBottom: 12 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },

  form: { display: "flex", flexDirection: "column", gap: 11 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11 },
  input: { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid #dfe3ea", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f7f8fa", transition: "border-color .15s, background .15s" },
  fieldErr: { color: "#dc2626", fontSize: 11, marginTop: 3 },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: RED, fontWeight: 700, fontSize: 11.5, cursor: "pointer" },
  rules: { listStyle: "none", padding: "8px 12px", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", background: "#f7f8fa", border: "1px solid #eef0f4", borderRadius: 10 },
  rule: { fontSize: 11, fontWeight: 600 },
  submit: { marginTop: 4, padding: "13px", background: RED, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 22px rgba(224,36,46,.3)" },
  submitDisabled: { background: "#e0e3ea", color: "#9aa1ad", cursor: "not-allowed", boxShadow: "none" },
  footer: { marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8a8f9a" },
  footLink: { color: RED, fontWeight: 700, textDecoration: "none" },
  terms: { textDecoration: "underline", cursor: "default" },

  visual: { background: "linear-gradient(160deg,#fdecec,#fbe3e0)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 34px", textAlign: "center" },
  scene: { width: "80%", maxWidth: 300, height: "auto", marginBottom: 18 },
  motTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 10px", color: "#1f2430" },
  motText: { fontSize: 14, color: "#6b5b5b", lineHeight: 1.6, maxWidth: 300, margin: 0 },
};
