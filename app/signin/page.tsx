"use client";

/** /signin - email + password sign-in, then go to the dashboard. Same look as
 *  the dashboard and feature pages: warm off-white, ink, hairlines. */

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { emailIsValid } from "@/lib/auth/formOptions";

const POINTS = [
  "Your full career report, any time",
  "Careers, exams, scholarships, study abroad and more",
  "Your progress saved to your account",
];

export default function SignInPage() {
  const router = useRouter();
  const { ready, signIn, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [resetting, setResetting] = useState(false);

  // Nobody can look a password up - Firebase stores only a hash - so a student
  // who has forgotten theirs needs this to be one click away, not a support
  // email. The confirmation is deliberately the same whether or not the address
  // has an account: it must not become a way to test which emails are registered.
  async function onForgotPassword() {
    setError("");
    setNotice("");
    if (!emailIsValid(email)) {
      setError("Enter your email address above, then tap “Forgot password?”.");
      return;
    }
    if (!ready) {
      setError("Accounts aren’t configured on this deployment yet.");
      return;
    }
    setResetting(true);
    try {
      await resetPassword(email);
      setNotice(`If an account exists for ${email.trim()}, a reset link is on its way. Check your spam folder too.`);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setNotice(`If an account exists for ${email.trim()}, a reset link is on its way. Check your spam folder too.`);
      } else {
        setError(authErrorMessage(err));
      }
    } finally {
      setResetting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");
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
    <div className="si">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="si-top">
        <Link href="/" aria-label="OneGrasp home"><Logo height={40} /></Link>
        <div className="si-top-r">
          <span className="si-muted si-hide-sm">New here?</span>
          <Link href="/register" className="si-btn">Create account</Link>
        </div>
      </header>

      <main className="si-main">
        <section className="si-side" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/features/progress-640.webp" alt="" />
          <h2>Pick up where you left off.</h2>
          <ul>
            {POINTS.map((p) => <li key={p}><Icon name="check" size={16} stroke={2.4} /> {p}</li>)}
          </ul>
        </section>

        <section className="si-card">
          <h1>Sign in</h1>
          <p className="si-muted" style={{ marginTop: 6 }}>Use the email and password you registered with.</p>

          {!ready && <div className="si-box si-warn">Accounts aren’t configured on this deployment yet.</div>}
          {error && <div className="si-box si-err" role="alert">{error}</div>}
          {notice && <div className="si-box si-ok" role="status">{notice}</div>}

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="si-email">Email</label>
            <input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            <div className="si-pwrow">
              <label htmlFor="si-pw">Password</label>
              <button type="button" className="si-link" onClick={() => void onForgotPassword()} disabled={resetting}>
                {resetting ? "Sending link…" : "Forgot password?"}
              </button>
            </div>
            <div className="si-pw">
              <input id="si-pw" type={showPw ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
              <button type="button" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? "Hide password" : "Show password"}>{showPw ? "Hide" : "Show"}</button>
            </div>
            <button type="submit" className="si-btn si-submit" disabled={submitting}>
              {submitting ? "Signing in…" : <>Sign in <Icon name="arrowRight" size={16} stroke={2} /></>}
            </button>
          </form>

          <p className="si-foot">Haven’t taken the assessment yet? <Link href="/register" className="si-link">Register and start</Link></p>
        </section>
      </main>
    </div>
  );
}

const CSS = `
.si{--ink:#16181d;--ink2:#4a4f59;--mute:#7b808b;--line:#e8e5df;--warm:#f4f0eb;min-height:100vh;display:flex;flex-direction:column;background:#fbfaf8;color:var(--ink);font-family:Inter,system-ui,"Segoe UI",sans-serif}
.si *{box-sizing:border-box}
.si h1,.si h2{font-family:Poppins,Inter,sans-serif;letter-spacing:-.015em;margin:0;color:var(--ink)}
.si-top{display:flex;align-items:center;justify-content:space-between;gap:12px;height:64px;padding:0 24px;background:#fff;border-bottom:1px solid var(--line)}
.si-top-r{display:flex;align-items:center;gap:12px}
.si-muted{font-size:14px;color:var(--mute)}
.si-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;height:38px;padding:0 14px;border-radius:6px;border:1px solid var(--ink);background:var(--ink);color:#fff;font:inherit;font-size:14px;font-weight:600;text-decoration:none;cursor:pointer}
.si-btn:hover{background:#2b2e35}
.si-btn:disabled{opacity:.6;cursor:not-allowed}
.si-main{flex:1;width:100%;max-width:980px;margin:0 auto;padding:56px 20px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,420px);gap:24px;align-items:center}
.si-side{display:flex;flex-direction:column;padding:30px;background:var(--warm);border:1px solid var(--line);border-radius:10px}
.si-side img{width:100%;max-width:300px;height:auto;margin:0 auto 22px}
.si-side h2{font-size:26px;font-weight:600;line-height:1.2}
.si-side ul{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px}
.si-side li{display:flex;gap:10px;align-items:flex-start;font-size:15px;color:var(--ink2)}
.si-side li svg{color:#15803d;margin-top:3px;flex:none}
.si-card{background:#fff;border:1px solid var(--line);border-radius:10px;padding:32px 30px}
.si-card h1{font-size:28px;font-weight:600}
.si-card form{display:flex;flex-direction:column;margin-top:22px}
.si-card label{font-size:13.5px;font-weight:600;color:var(--ink2);margin-bottom:6px}
.si-card input{width:100%;height:46px;padding:0 13px;border:1px solid #d9d5cd;border-radius:6px;font:inherit;font-size:15px;color:var(--ink);background:#fff;outline:none}
.si-card input:focus{border-color:var(--ink);box-shadow:0 0 0 3px rgba(22,24,29,.08)}
.si-card form>input{margin-bottom:16px}
.si-pwrow{display:flex;justify-content:space-between;align-items:baseline}
.si-pw{position:relative}
.si-pw input{padding-right:64px}
.si-pw button{position:absolute;right:6px;top:7px;height:32px;padding:0 10px;border:0;background:none;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}
.si-link{background:none;border:0;padding:0;font:inherit;font-size:13.5px;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.si-link:disabled{color:var(--mute)}
.si-submit{height:48px;margin-top:20px;font-size:15px}
.si-box{margin-top:16px;padding:10px 12px;border-radius:6px;font-size:13.5px;line-height:1.5}
.si-err{background:#fdf2f2;border:1px solid #f3c8c8;color:#9f1d1d}
.si-ok{background:#eef7f0;border:1px solid #bfe0c6;color:#14532d}
.si-warn{background:#fdf7e8;border:1px solid #eedcab;color:#6b4e0b}
.si-foot{margin:22px 0 0;padding-top:18px;border-top:1px solid var(--line);font-size:14px;color:var(--mute)}
@media (max-width:820px){
  .si-main{grid-template-columns:minmax(0,1fr);padding:24px 16px;max-width:460px}
  .si-side{display:none}
  .si-card{padding:26px 20px}
  .si-top{padding:0 16px}
}
@media (max-width:420px){.si-hide-sm{display:none}}
`;
