"use client";

/**
 * /register — two-panel account page (form left, warm visual right), matching
 * the reference design. Keeps all fields: name, email, phone, school/college/
 * company, desired career, category (class/stage), current status (clarity),
 * password. Creates a Firebase account + Firestore profile, then starts the
 * assessment (/?begin=1) using the chosen category's journey.
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

const CSS = `
.reg-shell { display: grid; grid-template-columns: 1fr 1fr; }
@media (max-width: 860px) {
  .reg-shell { grid-template-columns: 1fr; }
  .reg-visual { display: none !important; }
}
.reg-input:focus { border-color: #c9a227 !important; background: #fff !important; }
`;

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

  const selStyle = (v: string): React.CSSProperties => ({ ...S.input, color: v ? "#1f2430" : "#9aa1ad" });

  return (
    <div style={S.page}>
      <style>{CSS}</style>
      <div style={S.shell} className="reg-shell">
        {/* ---- Left: form ---- */}
        <div style={S.left}>
          <span className="og-logo" style={S.logoPill}>One<span>Grasp</span></span>

          <div style={S.formHead}>
            <h1 style={S.title}>Create an account</h1>
            <p style={S.subtitle}>Sign up and start your career assessment</p>
          </div>

          {!ready && (
            <div style={S.warn}>
              Sign-up needs the site’s Firebase keys — the form works, but won’t save until configured.
            </div>
          )}
          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate style={S.form}>
            <Field label="Full name">
              <input className="reg-input" style={S.input} value={f.name} onChange={set("name")} placeholder="Amélie Laurent" />
              {touched && !f.name.trim() && <Err>Name is required.</Err>}
            </Field>

            <div style={S.row}>
              <Field label="Email">
                <input className="reg-input" style={S.input} type="email" value={f.email} onChange={set("email")} placeholder="you@example.com" />
                {touched && !emailIsValid(f.email) && <Err>Valid email required.</Err>}
              </Field>
              <Field label="Phone">
                <input className="reg-input" style={S.input} value={f.phone} onChange={set("phone")} placeholder="10-digit mobile" />
                {touched && !phoneIsValid(f.phone) && <Err>Valid phone required.</Err>}
              </Field>
            </div>

            <Field label="School / College / Company">
              <input className="reg-input" style={S.input} value={f.institution} onChange={set("institution")} placeholder="Organisation name" />
            </Field>

            <div style={S.row}>
              <Field label="Desired career">
                <input className="reg-input" style={S.input} value={f.desiredCareer} onChange={set("desiredCareer")} placeholder="e.g. Doctor" />
              </Field>
              <Field label="Category / class">
                <select className="reg-input" style={selStyle(f.category)} value={f.category} onChange={set("category")}>
                  <option value="">Select…</option>
                  {CATEGORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                {touched && !f.category && <Err>Select a category.</Err>}
              </Field>
            </div>

            <Field label="Current status">
              <select className="reg-input" style={selStyle(f.clarity)} value={f.clarity} onChange={set("clarity")}>
                <option value="">Where are you with your career?</option>
                {CLARITY_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <div style={S.row}>
              <Field label="Password">
                <div style={S.pwWrap}>
                  <input
                    className="reg-input"
                    style={{ ...S.input, paddingRight: 52 }}
                    type={showPw ? "text" : "password"}
                    value={f.password}
                    onChange={set("password")}
                    placeholder="••••••••"
                  />
                  <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>
              <Field label="Confirm">
                <input
                  className="reg-input"
                  style={S.input}
                  type={showPw ? "text" : "password"}
                  value={f.confirm}
                  onChange={set("confirm")}
                  placeholder="••••••••"
                />
                {touched && f.confirm !== "" && f.confirm !== f.password && <Err>Doesn’t match.</Err>}
              </Field>
            </div>

            {f.password.length > 0 && (
              <ul style={S.rules}>
                {PASSWORD_RULES.map((r) => {
                  const ok = r.test(f.password);
                  return (
                    <li key={r.label} style={{ ...S.rule, color: ok ? "#15803d" : "#9aa1ad" }}>
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
              {submitting ? "Creating account…" : "Submit"}
            </button>
          </form>

          <div style={S.footer}>
            <span>Have an account? <Link href="/signin" style={S.footLink}>Sign in</Link></span>
            <span style={S.terms}>Terms &amp; Conditions</span>
          </div>
        </div>

        {/* ---- Right: warm visual ---- */}
        <div style={S.visual} className="reg-visual">
          <FloatingCard style={S.card1}>
            <div style={S.cardTag}>Your assessment</div>
            <div style={S.cardTime}>8 dimensions · ~25 min</div>
          </FloatingCard>

          <Scene />

          <div style={S.calendar}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
              <div key={d} style={S.calCol}>
                <div style={S.calDay}>{d}</div>
                <div style={{ ...S.calNum, ...(i === 4 ? S.calNumActive : {}) }}>{22 + i}</div>
              </div>
            ))}
          </div>

          <FloatingCard style={S.card2}>
            <div style={S.cardTag}>Career report</div>
            <div style={S.cardTime}>Personalised to you</div>
            <div style={S.avatars}>
              {["#f2c94c", "#eb5757", "#2d9cdb"].map((c) => (
                <span key={c} style={{ ...S.miniAvatar, background: c }} />
              ))}
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      {children}
    </div>
  );
}
const Err = ({ children }: { children: React.ReactNode }) => <div style={S.fieldErr}>{children}</div>;
const FloatingCard = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ ...S.floatCard, ...style }}>{children}</div>
);

/** Abstract, photo-free scene evoking teamwork/career. */
function Scene() {
  return (
    <svg viewBox="0 0 320 260" style={S.scene} role="img" aria-label="Career discovery">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6d98a" />
          <stop offset="1" stopColor="#e9b949" />
        </linearGradient>
      </defs>
      <rect x="30" y="70" width="260" height="150" rx="20" fill="url(#g1)" opacity="0.55" />
      <circle cx="120" cy="120" r="34" fill="#fff" opacity="0.85" />
      <circle cx="120" cy="110" r="13" fill="#c9a227" />
      <path d="M96 142 a24 20 0 0 1 48 0 z" fill="#c9a227" />
      <circle cx="205" cy="135" r="26" fill="#fff" opacity="0.8" />
      <circle cx="205" cy="127" r="10" fill="#d98f3a" />
      <path d="M187 152 a18 15 0 0 1 36 0 z" fill="#d98f3a" />
      <path d="M60 200 l34 -38 26 20 40 -46 40 30 30 -22" fill="none" stroke="#8a6d1f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

const GOLD = "#f2c94c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#e7e8ec", padding: "20px", fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1f2430", display: "flex", alignItems: "center", justifyContent: "center" },
  shell: { width: "100%", maxWidth: 1000, background: "#f6f4ef", borderRadius: 26, overflow: "hidden", boxShadow: "0 30px 80px rgba(31,36,48,.18)", minHeight: 620 },

  left: { padding: "34px 46px 30px", display: "flex", flexDirection: "column", background: "linear-gradient(180deg,#faf9f5,#f4efe4)" },
  logoPill: { alignSelf: "flex-start", border: "1px solid #d8d3c6", borderRadius: 999, padding: "6px 16px", fontSize: "1.05rem", fontWeight: 800, background: "#fff" },
  formHead: { textAlign: "center", margin: "26px 0 20px" },
  title: { fontSize: 28, fontWeight: 800, margin: "0 0 6px" },
  subtitle: { fontSize: 13.5, color: "#8a8f9a", margin: 0 },

  warn: { background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e", padding: "9px 12px", borderRadius: 10, fontSize: 12.5, marginBottom: 12 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },

  form: { display: "flex", flexDirection: "column", gap: 12 },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  field: {},
  label: { display: "block", fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 5 },
  input: { width: "100%", padding: "12px 14px", borderRadius: 12, border: "1px solid #e6e1d5", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#f3efe6", transition: "border-color .15s, background .15s" },
  fieldErr: { color: "#dc2626", fontSize: 11, marginTop: 3 },
  pwWrap: { position: "relative" },
  pwToggle: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#b08900", fontWeight: 700, fontSize: 11.5, cursor: "pointer" },
  rules: { listStyle: "none", padding: "8px 12px", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 10px", background: "#f3efe6", border: "1px solid #e6e1d5", borderRadius: 10 },
  rule: { fontSize: 11, fontWeight: 600 },
  submit: { marginTop: 4, padding: "14px", background: GOLD, color: "#3a2f00", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 10px 22px rgba(242,201,76,.4)" },
  submitDisabled: { background: "#e6e1d5", color: "#9aa1ad", cursor: "not-allowed", boxShadow: "none" },
  footer: { marginTop: 22, display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "#8a8f9a" },
  footLink: { color: "#1f2430", fontWeight: 700, textDecoration: "underline" },
  terms: { textDecoration: "underline", cursor: "default" },

  visual: { position: "relative", background: "linear-gradient(160deg,#f6ead0,#f4d98f)", margin: 12, borderRadius: 20, overflow: "hidden", minHeight: 560 },
  scene: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "82%", height: "auto" },
  floatCard: { position: "absolute", background: "rgba(255,255,255,.92)", backdropFilter: "blur(6px)", borderRadius: 14, padding: "12px 16px", boxShadow: "0 12px 30px rgba(31,36,48,.16)" },
  card1: { top: 28, left: 28 },
  card2: { bottom: 30, left: 26 },
  cardTag: { fontSize: 13, fontWeight: 800, color: "#1f2430" },
  cardTime: { fontSize: 11.5, color: "#8a8f9a", marginTop: 3 },
  avatars: { display: "flex", gap: 5, marginTop: 8 },
  miniAvatar: { width: 20, height: 20, borderRadius: "50%", display: "inline-block", border: "2px solid #fff" },
  calendar: { position: "absolute", right: 22, top: "48%", transform: "translateY(-50%)", display: "flex", gap: 8, background: "rgba(255,255,255,.14)", padding: "12px 14px", borderRadius: 14 },
  calCol: { textAlign: "center" },
  calDay: { fontSize: 10.5, color: "#7a6528", fontWeight: 700 },
  calNum: { fontSize: 14, fontWeight: 800, color: "#3a2f00", marginTop: 4 },
  calNumActive: { background: "#fff", borderRadius: 8, padding: "2px 0" },
};
