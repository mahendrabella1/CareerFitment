"use client";

/** /signin — email + password sign-in, then go to the dashboard. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { emailIsValid } from "@/lib/auth/formOptions";

export default function SignInPage() {
  const router = useRouter();
  const { ready, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!emailIsValid(email) || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!ready) {
      setError("Accounts aren’t configured on this deployment yet.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/account");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={S.page}>
      <header style={S.header}>
        <Link href="/" className="og-logo" style={S.logo}>
          One<span>Grasp</span>
        </Link>
        <div style={S.headerRight}>
          <span style={S.haveAcct}>New here?</span>
          <Link href="/register" style={S.ctaBtn}>Create account</Link>
        </div>
      </header>

      <main style={S.wrap}>
        <div style={S.card}>
          <div style={S.visual}>
            <Illustration />
            <div>
              <div style={S.vTitle}>Welcome back</div>
              <div style={S.vSub}>Sign in to view your report and details.</div>
            </div>
          </div>

          {error && <div style={S.errorBox}>{error}</div>}

          <form onSubmit={onSubmit} noValidate style={S.form}>
            <input style={S.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input style={S.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button type="submit" style={{ ...S.submit, ...(submitting ? S.submitDisabled : {}) }} disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p style={S.foot}>
            Haven’t taken the test? <Link href="/register" style={S.link}>Register &amp; start</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

function Illustration() {
  return (
    <svg viewBox="0 0 96 96" style={S.illus} role="img" aria-label="Sign in">
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
  ctaBtn: { padding: "8px 16px", background: BLUE, color: "#fff", borderRadius: 9, fontSize: 13.5, fontWeight: 700, textDecoration: "none" },

  wrap: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" },
  card: { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 16, padding: "22px 24px 24px", boxShadow: "0 12px 40px rgba(30,41,59,.12)" },
  visual: { display: "flex", alignItems: "center", gap: 14, marginBottom: 18 },
  illus: { width: 54, height: 54, flexShrink: 0 },
  vTitle: { fontSize: 19, fontWeight: 800, lineHeight: 1.2 },
  vSub: { fontSize: 12.5, color: "#64748b", marginTop: 3 },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "9px 12px", borderRadius: 9, fontSize: 13, marginBottom: 12, fontWeight: 600 },
  form: { display: "flex", flexDirection: "column", gap: 11 },
  input: { width: "100%", padding: "11px 13px", borderRadius: 9, border: "1px solid #cbd5e1", fontSize: 14.5, outline: "none", boxSizing: "border-box" },
  submit: { marginTop: 4, padding: "13px", background: BLUE, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  submitDisabled: { opacity: .6, cursor: "not-allowed" },
  foot: { textAlign: "center", fontSize: 13.5, color: "#64748b", marginTop: 18 },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
};
