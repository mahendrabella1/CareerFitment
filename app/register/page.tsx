"use client";

/**
 * /register — compact account form with the site header + a small visual.
 * Fields: name, email, phone (required), school/college/company, desired
 * career, category (class/stage), current status (clarity), password.
 * Creates a Firebase Auth account + Firestore profile, then sends the user
 * into the assessment (/?begin=1) using the chosen category's journey.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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

export default function RegisterPage() {
  const router = useRouter();
  const { ready, register } = useAuth();

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    institution: "",
    desiredCareer: "",
    category: "",
    clarity: "",
    password: "",
    confirm: "",
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
      f.name.trim() !== "" &&
      emailIsValid(f.email) &&
      phoneIsValid(f.phone) &&
      f.category !== "" &&
      pwOk &&
      f.password === f.confirm,
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
        name: f.name,
        email: f.email,
        phone: f.phone,
        institution: f.institution,
        desiredCareer: f.desiredCareer,
        category: f.category,
        journeyCode: journeyForCategory(f.category),
        clarity: f.clarity,
        password: f.password,
      });
      router.push("/?begin=1");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const selStyle = (v: string): React.CSSProperties => ({ ...S.input, color: v ? "#1e293b" : "#94a3b8" });

  return (
    <div style={S.page}>
      <header style={S.header}>
        <Link href="/" className="og-logo" style={S.logo}>
          One<span>Grasp</span>
        </Link>
        <div style={S.headerRight}>
          <span style={S.haveAcct}>Have an account?</span>
          <Link href="/signin" style={S.signInBtn}>Sign in</Link>
        </div>
      </header>

      <main style={S.wrap}>
        <div style={S.card}>
          <div style={S.visual}>
            <Illustration />
            <div>
              <div style={S.vTitle}>Create your free account</div>
              <div style={S.vSub}>A minute to sign up, then start your career assessment.</div>
            </div>
          </div>

          {!ready && (
            <div style={S.warn}>
              Sign-up needs the site’s Firebase keys — the form works, but won’t save until configured.
            </div>
          )}
          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate style={S.form}>
            <div>
              <input style={S.input} value={f.name} onChange={set("name")} placeholder="Full name *" />
              {touched && !f.name.trim() && <Err>Name is required.</Err>}
            </div>

            <div style={S.row}>
              <div>
                <input style={S.input} type="email" value={f.email} onChange={set("email")} placeholder="Email *" />
                {touched && !emailIsValid(f.email) && <Err>Valid email required.</Err>}
              </div>
              <div>
                <input style={S.input} value={f.phone} onChange={set("phone")} placeholder="Phone *" />
                {touched && !phoneIsValid(f.phone) && <Err>Valid phone required.</Err>}
              </div>
            </div>

            <input style={S.input} value={f.institution} onChange={set("institution")} placeholder="School / College / Company" />

            <div style={S.row}>
              <input style={S.input} value={f.desiredCareer} onChange={set("desiredCareer")} placeholder="Desired career (e.g. Doctor)" />
              <div>
                <select style={selStyle(f.category)} value={f.category} onChange={set("category")}>
                  <option value="">Category / class *</option>
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {touched && !f.category && <Err>Select a category.</Err>}
              </div>
            </div>

            <select style={selStyle(f.clarity)} value={f.clarity} onChange={set("clarity")}>
              <option value="">Current status — where are you with your career?</option>
              {CLARITY_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div style={S.row}>
              <div style={S.pwWrap}>
                <input
                  style={{ ...S.input, paddingRight: 52 }}
                  type={showPw ? "text" : "password"}
                  value={f.password}
                  onChange={set("password")}
                  placeholder="Password *"
                />
                <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
              <div>
                <input
                  style={S.input}
                  type={showPw ? "text" : "password"}
                  value={f.confirm}
                  onChange={set("confirm")}
                  placeholder="Confirm *"
                />
                {touched && f.confirm !== "" && f.confirm !== f.password && <Err>Doesn’t match.</Err>}
              </div>
            </div>

            {f.password.length > 0 && (
              <ul style={S.rules}>
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(f.password);
                  return (
                    <li key={r.label} style={{ ...S.rule, color: ok ? "#15803d" : "#94a3b8" }}>
                      {ok ? "✓" : "○"} {r.label}
                    </li>
                  );
                })}
              </ul>
            )}

            <button
              type="submit"
              style={{ ...S.submit, ...(canSubmit && !submitting ? {} : S.submitDisabled) }}
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Creating account…" : "Create account & start test"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

const Err = ({ children }: { children: React.ReactNode }) => <div style={S.fieldErr}>{children}</div>;

function Illustration() {
  return (
    <svg viewBox="0 0 96 96" style={S.illus} role="img" aria-label="Career discovery">
      <rect x="2" y="2" width="92" height="92" rx="18" fill="#eef2ff" />
      <circle cx="48" cy="40" r="16" fill="#c7d2fe" />
      <circle cx="48" cy="35" r="7" fill="#3b4a9c" />
      <path d="M35 54 a13 11 0 0 1 26 0 z" fill="#3b4a9c" />
      <path d="M26 76 l10 -11 9 7 12 -14 12 9" fill="none" stroke="#3b4a9c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b", display: "flex", flexDirection: "column" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 22px", background: "#fff", borderBottom: "1px solid #e6e9ef" },
  logo: { textDecoration: "none", fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" },
  headerRight: { display: "flex", alignItems: "center", gap: 12 },
  haveAcct: { fontSize: 13, color: "#64748b" },
  signInBtn: { padding: "8px 16px", background: BLUE, color: "#fff", borderRadius: 9, fontSize: 13.5, fontWeight: 700, textDecoration: "none" },

  wrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "22px 16px" },
  card: { width: "100%", maxWidth: 460, background: "#fff", borderRadius: 16, padding: "20px 24px 24px", boxShadow: "0 12px 40px rgba(30,41,59,.12)" },
  visual: { display: "flex", alignItems: "center", gap: 14, marginBottom: 16 },
  illus: { width: 54, height: 54, flexShrink: 0 },
  vTitle: { fontSize: 18, fontWeight: 800, lineHeight: 1.2 },
  vSub: { fontSize: 12.5, color: "#64748b", marginTop: 3 },

  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "9px 12px", borderRadius: 9, fontSize: 12.5, marginBottom: 12 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 9, fontSize: 13, marginBottom: 12, fontWeight: 600 },

  form: { display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  input: { width: "100%", padding: "10px 12px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fff" },
  fieldErr: { color: "#dc2626", fontSize: 11, marginTop: 3 },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: BLUE, fontWeight: 700, fontSize: 11.5, cursor: "pointer" },
  rules: { listStyle: "none", padding: "8px 11px", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", background: "#f8fafc", border: "1px solid #eef2f6", borderRadius: 9 },
  rule: { fontSize: 11, fontWeight: 600 },
  submit: { marginTop: 3, padding: "13px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  submitDisabled: { background: "#cbd5e1", color: "#64748b", cursor: "not-allowed" },
};
