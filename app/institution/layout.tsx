"use client";

/**
 * app/institution/layout.tsx - the ONLY place institution-portal access is
 * checked on the page side: sign in with the username and password OneGrasp
 * issued (/admin/institutions), then /api/institution/me confirms the login
 * is an active institution account. Every route under here can assume that;
 * the server routes check it again on every call regardless.
 */
import { useEffect, useState } from "react";
import { authErrorMessage, useAuth } from "@/lib/auth/AuthProvider";
import { apiFetch, institutionLoginEmail, VIEW_KEY } from "@/lib/institution/client";
import { PortalProvider, type PortalMe } from "@/components/institution/portalStore";
import { PORTAL_CSS } from "@/components/institution/ui";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";

export default function InstitutionLayout({ children }: { children: React.ReactNode }) {
  const { ready, loading, user, signIn, logout } = useAuth();
  const [me, setMe] = useState<PortalMe | null>(null);
  const [meError, setMeError] = useState("");

  useEffect(() => {
    setMe(null);
    setMeError("");
    if (!user) return;
    // "Open portal" on /admin/institutions opens /institution?as=<id>: an
    // admin then sees that institution's portal for this browser tab.
    try {
      const as = new URLSearchParams(window.location.search).get("as");
      if (as && /^[A-Za-z0-9_-]{4,64}$/.test(as)) sessionStorage.setItem(VIEW_KEY, as);
    } catch { /* storage blocked */ }
    apiFetch<PortalMe>("/api/institution/me").then(setMe).catch((e) => setMeError(e instanceof Error ? e.message : "Could not open the portal."));
  }, [user]);

  function exitView() {
    try { sessionStorage.removeItem(VIEW_KEY); } catch { /* storage blocked */ }
    window.location.href = "/admin/institutions";
  }

  let body: React.ReactNode;
  if (!ready) body = <Center>Accounts aren&apos;t configured on this deployment yet.</Center>;
  else if (loading) body = <Center>Loading…</Center>;
  else if (!user) body = <Login signIn={signIn} />;
  else if (meError) {
    body = (
      <Center>
        <div className="ip-card" style={{ maxWidth: 440, padding: 24, textAlign: "center" }}>
          <Icon name="lock" size={26} />
          <p style={{ margin: "10px 0 4px", fontWeight: 800 }}>This login can&apos;t open the institution portal</p>
          <p className="ip-muted" style={{ margin: "0 0 16px" }}>{meError}</p>
          <p className="ip-muted" style={{ fontSize: 12.5, margin: "0 0 16px" }}>Signed in as {user.email}</p>
          <button className="ip-btn" onClick={() => void logout()}>Sign out</button>
        </div>
      </Center>
    );
  } else if (!me) body = <Center>Opening your institution…</Center>;
  else body = (
    <>
      {me.viewAs && (
        <div style={{ background: "#141417", color: "#fff", padding: "8px 16px", display: "flex", gap: 12, alignItems: "center", justifyContent: "center", flexWrap: "wrap", fontSize: 13, fontWeight: 600 }}>
          <span>You&apos;re viewing <b>{me.institution.name}</b>&apos;s portal as a OneGrasp admin - you see exactly what the school sees. Your visit doesn&apos;t mark anything as read for them.</span>
          <button className="ip-btn sm" onClick={exitView}>Exit to admin</button>
        </div>
      )}
      <PortalProvider me={me} logout={me.viewAs ? async () => exitView() : logout}>{children}</PortalProvider>
    </>
  );

  return (
    <div className="ip">
      <style dangerouslySetInnerHTML={{ __html: PORTAL_CSS }} />
      {body}
    </div>
  );
}

function Center({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 16, color: "var(--ink3)", fontSize: 14 }}>{children}</div>;
}

function Login({ signIn }: { signIn: (email: string, password: string) => Promise<void> }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(institutionLoginEmail(username), password);
    } catch (err) {
      const code = (err as { code?: string })?.code || "";
      setError(code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")
        ? "That username and password don't match. Check them with whoever shared your login, or ask OneGrasp to reset the password."
        : code.includes("user-disabled") ? "This login has been switched off. Please contact OneGrasp." : authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="ip-login">
      <div className="ip-login-side">
        <Logo height={40} />
        <h1>Institution portal</h1>
        <p>Follow every student&apos;s career journey in one place - assessment results, time spent, course progress - and reach them with reminders and alerts.</p>
        <ul>
          <li><Icon name="users" size={16} /> Individual and whole-school tracking</li>
          <li><Icon name="clock" size={16} /> Time spent, by day and by area</li>
          <li><Icon name="bell" size={16} /> Messages, reminders and alerts</li>
          <li><Icon name="sparkle" size={16} /> Recommendations for every student</li>
        </ul>
      </div>
      <form className="ip-card ip-login-form" onSubmit={submit}>
        <h2>Sign in</h2>
        <p className="ip-muted">Use the username and password OneGrasp gave your institution.</p>
        {error && <div className="ip-alert bad">{error}</div>}
        <label className="ip-label" htmlFor="ip-user">Username</label>
        <input id="ip-user" className="ip-input" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="e.g. svhs.principal" />
        <label className="ip-label" htmlFor="ip-pass" style={{ marginTop: 12 }}>Password</label>
        <input id="ip-pass" className="ip-input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="ip-btn" type="submit" disabled={busy} style={{ width: "100%", marginTop: 18 }}>{busy ? "Signing in…" : "Sign in"}</button>
        <p className="ip-muted" style={{ fontSize: 12, marginTop: 14 }}>Forgot your password? Contact support@onegrasp.com - it can be reset for you.</p>
      </form>
    </div>
  );
}
