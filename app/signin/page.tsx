"use client";

/** /signin — email + password sign-in, then go to the account page. */

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
      setError("Accounts aren't configured on this deployment yet.");
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
      <div style={S.card}>
        <div style={S.brandRow}><div style={S.brandDot} /><span style={S.brandText}>OneGrasp</span></div>
        <h1 style={S.title}>Welcome back</h1>
        <p style={S.sub}>Sign in to view your details.</p>

        {error && <div style={S.errorBox}>{error}</div>}

        <form onSubmit={onSubmit} noValidate>
          <label style={S.label}>Email</label>
          <input style={S.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <label style={{ ...S.label, marginTop: 14 }}>Password</label>
          <input style={S.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          <button type="submit" style={{ ...S.submit, ...(submitting ? S.submitDisabled : {}) }} disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p style={S.foot}>
          New here? <Link href="/register" style={S.link}>Create an account</Link>
        </p>
      </div>
    </div>
  );
}

const BLUE = "#3b4a9c";
const S: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#eef1f6", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: "#1e293b" },
  card: { width: "100%", maxWidth: 420, background: "#fff", borderRadius: 18, padding: "34px 32px", boxShadow: "0 16px 50px rgba(30,41,59,.16)" },
  brandRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 18 },
  brandDot: { width: 12, height: 12, borderRadius: 4, background: BLUE },
  brandText: { fontWeight: 800, color: BLUE },
  title: { fontSize: 24, fontWeight: 800, margin: "0 0 6px" },
  sub: { fontSize: 14, color: "#64748b", margin: "0 0 22px" },
  errorBox: { background: "#fee2e2", border: "1px solid #fca5a5", color: "#b91c1c", padding: "10px 14px", borderRadius: 10, fontSize: 13.5, marginBottom: 14, fontWeight: 600 },
  label: { display: "block", fontSize: 12.5, fontWeight: 700, color: "#475569", marginBottom: 6 },
  input: { width: "100%", padding: "11px 13px", borderRadius: 10, border: "1px solid #cbd5e1", fontSize: 14.5, outline: "none", boxSizing: "border-box" },
  submit: { width: "100%", marginTop: 20, padding: "13px", background: BLUE, color: "#fff", border: "none", borderRadius: 12, fontSize: 15.5, fontWeight: 800, cursor: "pointer" },
  submitDisabled: { opacity: .6, cursor: "not-allowed" },
  foot: { textAlign: "center", fontSize: 14, color: "#64748b", marginTop: 20 },
  link: { color: BLUE, fontWeight: 700, textDecoration: "none" },
};
