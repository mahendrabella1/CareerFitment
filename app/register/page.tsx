"use client";

/**
 * /register — Assessment intro + account creation.
 * Left: short "about the test" panel with an illustration.
 * Right: registration form (name/email/phone mandatory, city, institution,
 * class + status dropdowns, password with live validation) -> Firebase Auth
 * account + Firestore profile -> redirect to /account.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import {
  CLASS_OPTIONS,
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
    city: "",
    institution: "",
    classLevel: "",
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
      setError("Accounts aren't configured on this deployment yet (missing Firebase keys).");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: f.name,
        email: f.email,
        phone: f.phone,
        city: f.city,
        institution: f.institution,
        classLevel: f.classLevel,
        status: f.status,
        password: f.password,
      });
      router.push("/account");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={S.page}>
      <div style={S.shell}>
        {/* ---- Left: about the test ---- */}
        <aside style={S.intro}>
          <div style={S.introInner}>
            <div style={S.brandRow}>
              <div style={S.brandDot} />
              <span style={S.brandText}>OneGrasp</span>
            </div>
            <h1 style={S.introTitle}>Discover the career that fits you</h1>
            <p style={S.introText}>
              A guided, science-backed assessment that maps your personality,
              interests, and strengths across eight dimensions — then shows the
              career paths that suit you best.
            </p>
            <Illustration />
            <ul style={S.pointList}>
              <li style={S.point}>⏱️ ~20–30 minutes, at your own pace</li>
              <li style={S.point}>🧭 Personalised, easy-to-read report</li>
              <li style={S.point}>🔒 Your details are private to your account</li>
            </ul>
          </div>
        </aside>

        {/* ---- Right: form ---- */}
        <main style={S.formWrap}>
          <h2 style={S.formTitle}>Create your account</h2>
          <p style={S.formSub}>
            Already have one? <Link href="/signin" style={S.link}>Sign in</Link>
          </p>

          {!ready && (
            <div style={S.warn}>
              Note: account sign-up needs the site’s Firebase keys to be configured.
              The form works, but submitting won’t save until keys are added.
            </div>
          )}
          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate>
            <Field label="Full name" required>
              <input style={S.input} value={f.name} onChange={set("name")} placeholder="Your name" />
              {touched && !f.name.trim() && <Err>Name is required.</Err>}
            </Field>

            <Row>
              <Field label="Email" required>
                <input style={S.input} type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" />
                {touched && !emailIsValid(f.email) && <Err>Enter a valid email.</Err>}
              </Field>
              <Field label="Phone number" required>
                <input style={S.input} value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
                {touched && !phoneIsValid(f.phone) && <Err>Enter a valid phone number.</Err>}
              </Field>
            </Row>

            <Row>
              <Field label="City">
                <input style={S.input} value={f.city} onChange={set("city")} placeholder="City" />
              </Field>
              <Field label="Institution / School / College / Company">
                <input style={S.input} value={f.institution} onChange={set("institution")} placeholder="Organisation name" />
              </Field>
            </Row>

            <Row>
              <Field label="Class / category">
                <select style={S.input} value={f.classLevel} onChange={set("classLevel")}>
                  <option value="">Select…</option>
                  {CLASS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Current status">
                <select style={S.input} value={f.status} onChange={set("status")}>
                  <option value="">Select…</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </Row>

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
              {submitting ? "Creating account…" : "Create account & continue"}
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
const Row = ({ children }: { children: React.ReactNode }) => <div style={S.row}>{children}</div>;
const Err = ({ children }: { children: React.ReactNode }) => <div style={S.fieldErr}>{children}</div>;

function Illustration() {
  return (
    <svg viewBox="0 0 320 160" style={S.illus} role="img" aria-label="Career discovery illustration">
      <rect x="0" y="0" width="320" height="160" rx="14" fill="#eef2ff" />
      <circle cx="80" cy="80" r="34" fill="#c7d2fe" />
      <circle cx="80" cy="68" r="13" fill="#4f46e5" />
      <path d="M56 104 a24 20 0 0 1 48 0 z" fill="#4f46e5" />
      <rect x="150" y="44" width="130" height="14" rx="7" fill="#a5b4fc" />
      <rect x="150" y="72" width="104" height="12" rx="6" fill="#c7d2fe" />
      <rect x="150" y="96" width="120" height="12" rx="6" fill="#c7d2fe" />
      <path d="M150 128 l18 -20 16 12 22 -26 20 16" fill="none" stroke="#4f46e5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------- Styles --------------------------------- */
const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", padding: "24px 16px", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  shell: { maxWidth: 980, margin: "0 auto", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 20px 60px rgba(30,41,59,.18)", display: "grid", gridTemplateColumns: "minmax(280px, 380px) 1fr" },
  intro: { background: `linear-gradient(160deg, ${BLUE}, #5a6fce)`, color: "#fff", padding: "36px 30px" },
  introInner: { position: "sticky", top: 36 },
  brandRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 22 },
  brandDot: { width: 12, height: 12, borderRadius: 4, background: "#fff" },
  brandText: { fontWeight: 800, letterSpacing: .3 },
  introTitle: { fontSize: 26, fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 },
  introText: { fontSize: 14.5, lineHeight: 1.6, opacity: .92, margin: "0 0 22px" },
  illus: { width: "100%", height: "auto", display: "block", marginBottom: 22, borderRadius: 14 },
  pointList: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 },
  point: { fontSize: 13.5, opacity: .95 },
  formWrap: { padding: "36px 34px" },
  formTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  formSub: { fontSize: 14, color: "#64748b", margin: "0 0 20px" },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 14 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, marginBottom: 14, fontWeight: 600 },
  field: { marginBottom: 16 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
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
