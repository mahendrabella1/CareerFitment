"use client";

/**
 * app/admin/layout.tsx — the ONLY place admin auth is checked. Wraps every
 * /admin/* route, including the sidebar dashboard sections AND the
 * standalone /admin/report/[uid] view (deliberately outside the sidebar's
 * own route group — see app/admin/(dashboard)/layout.tsx's header comment
 * for why). Every page under here can assume it's already an authenticated
 * admin by the time it renders; none of them re-check isAdmin() themselves.
 */

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { isAdmin, ADMIN_LOGIN_EMAIL } from "@/lib/auth/admins";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { Icon } from "@/app/Icons";
import { C } from "@/app/account/viz";
import { ADMIN_CSS, Center, AdminAuthProvider } from "./adminShared";

/**
 * ⚠️ DEV-ONLY admin shortcut. Lets the redesigned /admin be reviewed with a
 * hardcoded credential, WITHOUT a live Firebase admin user. Automatically
 * disabled in production builds (NODE_ENV === "production").
 * REMOVE this block (and the `bypass` logic below) before shipping.
 */
const DEV_ADMIN = { email: "support@onegrasp.com", password: "onegrasp@2026" };
const DEV_BYPASS_ENABLED = process.env.NODE_ENV !== "production";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { ready, loading, user, logout, signIn } = useAuth();
  const [bypass, setBypass] = useState(false); // DEV-ONLY local admin shortcut
  const admin = isAdmin(user?.email) || bypass;

  const [email, setEmail] = useState(ADMIN_LOGIN_EMAIL);
  const [password, setPassword] = useState(DEV_BYPASS_ENABLED ? DEV_ADMIN.password : "");
  const [signingIn, setSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  async function adminSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setSigningIn(true);
    const isDevAdmin = email.trim().toLowerCase() === DEV_ADMIN.email && password === DEV_ADMIN.password;
    try {
      // Real Firebase sign-in — sets request.auth so Firestore rules allow the reads.
      await signIn(email, password);
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      const notFound = code.includes("user-not-found") || code.includes("invalid-credential");
      // DEV-ONLY: bootstrap the admin account so the hardcoded credential becomes
      // a real Firebase admin the first time it's used (rules then pass on data).
      if (DEV_BYPASS_ENABLED && isDevAdmin && notFound) {
        try {
          const auth = getFirebaseAuth();
          if (auth) await createUserWithEmailAndPassword(auth, DEV_ADMIN.email, DEV_ADMIN.password);
          // onAuthStateChanged picks up the new session → dashboard + data load.
          return;
        } catch (e2) {
          const c2 = (e2 as { code?: string })?.code || "";
          if (c2.includes("operation-not-allowed")) {
            setLoginError("Enable Email/Password sign-in in Firebase → Authentication → Sign-in method, then try again.");
          } else if (DEV_BYPASS_ENABLED) {
            // Last resort: show the redesigned shell without live data.
            setBypass(true);
          } else {
            setLoginError(authErrorMessage(e2));
          }
        }
      } else {
        setLoginError(authErrorMessage(err));
      }
    } finally {
      setSigningIn(false);
    }
  }

  if (!ready && !DEV_BYPASS_ENABLED) return <Center>Accounts aren’t configured on this deployment yet.</Center>;
  if (loading && !bypass) return <Center>Loading…</Center>;

  if (!user && !bypass) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, Segoe UI, sans-serif" }}>
        <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
        <form onSubmit={adminSignIn} style={S.loginCard}>
          <div style={S.loginBadge}><Icon name="lock" size={26} /></div>
          <h1 style={S.loginTitle}>Admin sign in</h1>
          <p style={S.loginSub}>Restricted to OneGrasp administrators.</p>
          {loginError && <div style={S.error}>{loginError}</div>}
          <label style={S.loginLabel}>Email</label>
          <input style={S.loginInput} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@onegrasp.com" />
          <label style={{ ...S.loginLabel, marginTop: 12 }}>Password</label>
          <input style={S.loginInput} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button type="submit" style={{ ...S.loginBtn, ...(signingIn ? { opacity: 0.6 } : {}) }} disabled={signingIn}>
            {signingIn ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }
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
    <AdminAuthProvider value={{ email: user?.email || DEV_ADMIN.email, logout: async () => { setBypass(false); await logout(); } }}>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      {children}
    </AdminAuthProvider>
  );
}

const S: Record<string, React.CSSProperties> = {
  error: { display: "flex", alignItems: "center", gap: 8, background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, padding: "10px 14px", borderRadius: 10, fontSize: 13, marginBottom: 12, fontWeight: 600 },
  loginCard: { width: "100%", maxWidth: 400, background: "#fff", borderRadius: 18, padding: "34px 32px", boxShadow: "0 20px 50px rgba(20,20,25,.14)", textAlign: "center", border: `1px solid ${C.line}` },
  loginBadge: { width: 56, height: 56, borderRadius: 16, background: C.redTint, color: C.red, display: "grid", placeItems: "center", margin: "0 auto 14px" },
  loginTitle: { fontSize: 22, fontWeight: 800, margin: "0 0 4px" },
  loginSub: { fontSize: 13.5, color: C.ink3, margin: "0 0 22px" },
  loginLabel: { display: "block", textAlign: "left", fontSize: 12.5, fontWeight: 700, color: C.ink2, marginBottom: 6 },
  loginInput: { width: "100%", padding: "11px 13px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14.5, outline: "none", boxSizing: "border-box", color: C.ink },
  loginBtn: { width: "100%", marginTop: 20, padding: "13px", background: C.red, color: "#fff", border: "none", borderRadius: 11, fontSize: 15, fontWeight: 800, cursor: "pointer" },
  linkBtn: { marginTop: 12, background: "none", border: "none", color: C.red, fontWeight: 700, fontSize: 14, cursor: "pointer" },
};
