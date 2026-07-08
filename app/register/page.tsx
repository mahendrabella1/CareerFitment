"use client";

/**
 * /register — short account form + a brief "about the test" panel.
 * Fields: name, email, phone (required), current status, password (validated).
 * Creates a Firebase Auth account + Firestore profile, then sends the user
 * straight into the assessment (/?begin=1).
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import {
  STATUS_OPTIONS,
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
    status: "",
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
        status: f.status,
        password: f.password,
      });
      router.push("/?begin=1");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.shell}>
        <aside style={S.intro}>
          <div style={S.brandRow}><div style={S.brandDot} /><span style={S.brandText}>OneGrasp</span></div>
          <h1 style={S.introTitle}>Discover the career that fits you</h1>
          <p style={S.introText}>
            A guided, science-backed assessment across eight dimensions. Create a
            free account, take the test, and get a personalised report.
          </p>
          <Illustration />
          <ul style={S.pointList}>
            <li style={S.point}>⏱️ ~20–30 minutes, at your own pace</li>
            <li style={S.point}>🧭 Personalised, easy-to-read report</li>
            <li style={S.point}>🔒 Private to your account</li>
          </ul>
        </aside>

        <main style={S.formWrap}>
          <h2 style={S.formTitle}>Create your account</h2>
          <p style={S.formSub}>
            Already registered? <Link href="/signin" style={S.link}>Sign in</Link>
          </p>

          {!ready && (
            <div style={S.warn}>
              Note: sign-up needs the site’s Firebase keys. The form works, but
              submitting won’t save until keys are configured.
            </div>
          )}
          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <Field label="Full name" required>
              <input style={S.input} value={f.name} onChange={set("name")} placeholder="Your name" />
              {touched && !f.name.trim() && <Err>Name is required.</Err>}
            </Field>
            <Field label="Email" required>
              <input style={S.input} type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" />
              {touched && !emailIsValid(f.email) && <Err>Enter a valid email.</Err>}
            </Field>
            <Field label="Phone number" required>
              <input style={S.input} value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
              {touched && !phoneIsValid(f.phone) && <Err>Enter a valid phone number.</Err>}
            </Field>
            <Field label="Current status">
              <select style={S.input} value={f.status} onChange={set("status")}>
                <option value="">Select…</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Password" required>
              <div style={S.pwWrap}>
                <input
                  style={{ ...S.input, paddingRight: 64 }}
                  type={showPw ? "text" : "password"}
                  value={f.password}
                  onChange={set("password")}
                  placeholder="Create a strong password"
                />
                <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
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
            </Field>

            <Field label="Confirm password" required>
              <input
                style={S.input}
                type={showPw ? "text" : "password"}
                value={f.confirm}
                onChange={set("confirm")}
                placeholder="Re-enter password"
              />
              {touched && f.confirm !== "" && f.confirm !== f.password && <Err>Passwords don’t match.</Err>}
            </Field>

            <button
              type="submit"
              style={{ ...S.submit, ...(canSubmit && !submitting ? {} : S.submitDisabled) }}
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Creating account…" : "Create account & start test"}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}{required && <span style={S.req}> *</span>}</label>
      {children}
    </div>
  );
}
const Err = ({ children }: { children: React.ReactNode }) => <div style={S.fieldErr}>{children}</div>;

function Illustration() {
  return (
    <svg viewBox="0 0 320 150" style={S.illus} role="img" aria-label="Career discovery">
      <rect x="0" y="0" width="320" height="150" rx="14" fill="#eef2ff" />
      <circle cx="78" cy="76" r="32" fill="#c7d2fe" />
      <circle cx="78" cy="64" r="12" fill="#4f46e5" />
      <path d="M56 98 a22 18 0 0 1 44 0 z" fill="#4f46e5" />
      <rect x="146" y="42" width="130" height="13" rx="6" fill="#a5b4fc" />
      <rect x="146" y="68" width="104" height="11" rx="5" fill="#c7d2fe" />
      <rect x="146" y="90" width="120" height="11" rx="5" fill="#c7d2fe" />
      <path d="M146 122 l18 -20 16 12 22 -24 20 15" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", padding: "24px 16px", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  shell: { maxWidth: 900, margin: "0 auto", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(30,41,59,.18)", display: "grid", gridTemplateColumns: "minmax(260px, 340px) 1fr" },
  intro: { background: `linear-gradient(160deg, ${BLUE}, #5a6fce)`, color: "#fff", padding: "34px 28px" },
  brandRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20 },
  brandDot: { width: 12, height: 12, borderRadius: 4, background: "#fff" },
  brandText: { fontWeight: 800, letterSpacing: .3 },
  introTitle: { fontSize: 24, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 },
  introText: { fontSize: 14, lineHeight: 1.6, opacity: .92, margin: "0 0 20px" },
  illus: { width: "100%", height: "auto", display: "block", marginBottom: 20, borderRadius: 14 },
  pointList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  point: { fontSize: 13.5, opacity: .95 },
  formWrap: { padding: "34px 32px" },
  formTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  formSub: { fontSize: 14, color: "#64748b", margin: "0 0 20px" },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, marginBottom: 14, fontWeight: 600 },
  field: { marginBottom: 15 },
  label: { display: "block", fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 6 },
  req: { color: "#dc2626" },
  input: { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14.5, outline: "none", boxSizing: "border-box", background: "#fff" },
  fieldErr: { color: "#dc2626", fontSize: 12, marginTop: 5 },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: BLUE, fontWeight: 700, fontSize: 12.5, cursor: "pointer" },
  rules: { listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 },
  rule: { fontSize: 12, fontWeight: 600 },
  submit: { width: "100%", marginTop: 8, padding: "14px", background: BLUE, color: "#fff", border: "none", borderRadius: 12, fontSize: 15.5, fontWeight: 800, cursor: "pointer" },
  submitDisabled: { background: "#cbd5e1", color: "#64748b", cursor: "not-allowed" },
};
