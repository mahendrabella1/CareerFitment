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
import { Icon } from "@/app/Icons";
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
        <Link href="/" style={{ textDecoration: "none" }}><Logo height={40} /></Link>
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

          <div style={S.loginNote}>
            <span style={S.loginNoteIcon}><Icon name="lock" size={17} /></span>
            <span>Your <b>email</b> and <b>password</b> are your login — you’ll use them to sign back in and view your report anytime. Please remember them.</span>
          </div>

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

        {/* Right: real photo + motivation */}
        <div style={S.visual} className="reg-visual">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=70" alt="" style={S.visualImg} />
          <div style={S.visualOverlay} />
          <div style={S.visualContent}>
            <h2 style={S.motTitle}>You’ve got this.</h2>
            <p style={S.motText}>
              Every great career starts with understanding yourself. Take your time
              and trust your instincts — there are no wrong answers here.
            </p>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) { return <div style={S.fieldErr}>{children}</div>; }

const RED = "#e0242e";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1f2430", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 26px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  haveAcct: { fontSize: 13, color: "#64748b" },
  signInBtn: { padding: "8px 16px", background: "#e0242e", color: "#fff", borderRadius: 9, fontSize: 13.5, fontWeight: 700, textDecoration: "none" },
  wrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "10px 20px" },
  shell: { width: "100%", maxWidth: 1140, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 28px 70px rgba(31,36,48,.18)" },

  left: { padding: "22px 42px 18px", display: "flex", flexDirection: "column" },
  logo: { alignSelf: "flex-start", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16 },
  title: { fontSize: 22, fontWeight: 800, margin: "0 0 3px" },
  subtitle: { fontSize: 13, color: "#8a8f9a", margin: "0 0 12px" },

  loginNote: { display: "flex", gap: 8, alignItems: "flex-start", background: "#f1f5f9", border: "1px solid #e2e8f0", color: "#475569", padding: "8px 12px", borderRadius: 10, fontSize: 12, lineHeight: 1.45, marginBottom: 11 },
  loginNoteIcon: { fontSize: 15, lineHeight: 1.4, flexShrink: 0, display: "flex" },
  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "9px 12px", borderRadius: 10, fontSize: 12.5, marginBottom: 12 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },

  form: { display: "flex", flexDirection: "column", gap: 9 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 },
  input: { width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid #dfe3ea", fontSize: 13.5, outline: "none", boxSizing: "border-box", background: "#f7f8fa", transition: "border-color .15s, background .15s" },
  fieldErr: { color: "#dc2626", fontSize: 11, marginTop: 3 },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: RED, fontWeight: 700, fontSize: 11.5, cursor: "pointer" },
  rules: { listStyle: "none", padding: "7px 11px", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px 10px", background: "#f7f8fa", border: "1px solid #eef0f4", borderRadius: 10 },
  rule: { fontSize: 10.5, fontWeight: 600 },
  submit: { marginTop: 3, padding: "11px", background: RED, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 22px rgba(224,36,46,.3)" },
  submitDisabled: { background: "#e0e3ea", color: "#9aa1ad", cursor: "not-allowed", boxShadow: "none" },
  footer: { marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8a8f9a" },
  footLink: { color: RED, fontWeight: 700, textDecoration: "none" },
  terms: { textDecoration: "underline", cursor: "default" },

  visual: { position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "30px 34px", overflow: "hidden", minHeight: 0 },
  visualImg: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" },
  visualOverlay: { position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,41,63,.12) 0%, rgba(31,41,63,.78) 100%)" },
  visualContent: { position: "relative", color: "#fff" },
  motTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 10px", color: "#fff" },
  motText: { fontSize: 14.5, color: "rgba(255,255,255,.9)", lineHeight: 1.65, maxWidth: 340, margin: 0 },
};
