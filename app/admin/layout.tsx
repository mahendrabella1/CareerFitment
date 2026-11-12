"use client";

/**
 * app/admin/layout.tsx - the ONLY place admin auth is checked. Wraps every
 * /admin/* route, including the sidebar dashboard sections AND the
 * standalone /admin/report/[uid] view (deliberately outside the sidebar's
 * own route group - see app/admin/(dashboard)/layout.tsx's header comment
 * for why). Every page under here can assume it's already an authenticated
 * admin by the time it renders; none of them re-check isAdmin() themselves.
 */

import { useState } from "react";
import { sendEmailVerification } from "firebase/auth";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { isAdmin, ADMIN_LOGIN_EMAIL } from "@/lib/auth/admins";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { ADMIN_CSS, Center, AdminAuthProvider } from "./adminShared";

// Sign-in is an ordinary Firebase sign-in with the admin's own password; whether
// the account is an admin is decided by lib/auth/admins.ts here and by
// isAdmin() in firestore.rules for every read. There is no built-in password,
// shortcut or account creation on this page (security audit C-01).
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready, loading, user, logout, signIn } = useAuth();
  const admin = isAdmin(user?.email);

  const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
  const [password, setPassword] = useState("");
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function adminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setSigningIn(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setLoginError(authErrorMessage(err));
    } finally {
      setSigningIn(false);
    }
  }

  if (!ready) return <Center>Accounts aren’t configured on this deployment yet.</Center>;
  if (loading) return <Center>Loading…</Center>;

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#fbfaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif", color: INK }}>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
        <form onSubmit={adminSignIn} style={S.loginCard}>
          <div style={S.loginBadge}><Icon name="lock" size={20} /></div>
          <h1 style={S.loginTitle}>OneGrasp admin</h1>
          <p style={S.loginSub}>Restricted to OneGrasp administrators.</p>
          {loginError && <div style={S.error}>{loginError}</div>}
          <label style={S.loginLabel}>Email</label>
          <input style={S.loginInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@onegrasp.com" />
          <label style={{ ...S.loginLabel, marginTop: 12 }}>Password</label>
          <input style={S.loginInput} type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit" style={{ ...S.loginBtn, ...(signingIn ? { opacity: 0.6 } : {}) }} disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }
  // The rules and the admin API accept an admin only with a verified email
  // (security audit M-03), so say so and offer the link instead of failing quietly.
  if (admin && user && !user.emailVerified) return <VerifyAdminEmail user={user} logout={logout} />;
  if (!admin) {
    return (
      <Center>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
        <p style={{ color: C.ink3, fontSize: 14 }}>You’re signed in as <b>{user?.email}</b>, which isn’t an admin account.</p>
        <button style={S.linkBtn} onClick={() => void logout()}>Sign out</button>
      </Center>
    );
  }

  return (
    <AdminAuthProvider value={{ email: user?.email || "", logout }}>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      {children}
    </AdminAuthProvider>
  );
}

function VerifyAdminEmail({ user, logout }: { user: import("firebase/auth").User; logout: () => Promise<void> }) {
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const send = async () => {
    try { await sendEmailVerification(user); setState("sent"); } catch { setState("error"); }
  };
  const recheck = async () => {
    try { await user.reload(); await user.getIdToken(true); } catch { /* reload below */ }
    window.location.reload();
  };
  return (
    <Center>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      <div style={{ maxWidth: 420, textAlign: "left" }}>
        <h1 style={{ ...S.loginTitle, marginBottom: 8 }}>Verify the admin email</h1>
        <p style={{ color: C.ink3, fontSize: 14, lineHeight: 1.6 }}>
          For security, admin access needs a verified email address. Send a link to <b>{user.email}</b>, open it from that inbox, then come back here.
        </p>
        {state === "sent" && <p style={{ fontSize: 14, color: "#1a7f37" }}>Sent - check the inbox (and spam) for a message from Firebase.</p>}
        {state === "error" && <div style={S.error}>The email couldn&apos;t be sent just now - please try again in a minute.</div>}
        <button style={S.loginBtn} onClick={() => void send()}>{state === "sent" ? "Send it again" : "Send verification email"}</button>
        <button style={S.linkBtn} onClick={() => void recheck()}>I&apos;ve verified it - continue</button>
        <button style={{ ...S.linkBtn, marginLeft: 12 }} onClick={() => void logout()}>Sign out</button>
      </div>
    </Center>
  );
}

// Same look as the student pages: warm off-white, ink, hairlines, small corners.
const INK = "#16181d";
const S: Record<string, React.CSSProperties> = {
  error: { display: "flex", alignItems: "center", gap: 8, background: "#fdf2f2", border: "1px solid #f3c8c8", color: "#9f1d1d", padding: "10px 12px", borderRadius: 6, fontSize: 13.5, marginBottom: 14, textAlign: "left" },
  loginCard: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 10, padding: "30px 28px", boxShadow: "0 18px 50px rgba(22,24,29,.08)", textAlign: "left", border: "1px solid #e8e5df" },
  loginBadge: { width: 40, height: 40, borderRadius: 6, background: "#f4f0eb", color: INK, display: "grid", placeItems: "center", margin: "0 0 16px" },
  loginTitle: { fontFamily: "Poppins, Inter, sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: "-.015em", margin: "0 0 4px", color: INK },
  loginSub: { fontSize: 14, color: "#7b808b", margin: "0 0 22px" },
  loginLabel: { display: "block", textAlign: "left", fontSize: 13.5, fontWeight: 600, color: "#4a4f59", marginBottom: 6 },
  loginInput: { width: "100%", height: 46, padding: "0 13px", borderRadius: 6, border: "1px solid #d9d5cd", fontSize: 15, outline: "none", boxSizing: "border-box", color: INK, fontFamily: "inherit" },
  loginBtn: { width: "100%", height: 46, marginTop: 20, background: INK, color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: INK, fontWeight: 600, fontSize: 14, cursor: "pointer", textDecoration: "underline" },
};
