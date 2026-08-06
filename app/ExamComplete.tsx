"use client";

/**
 * ExamComplete — the screen a student lands on the moment they submit the
 * assessment. It does three jobs, in this order:
 *
 *   1. Close the exam properly — thank them, and confirm the responses are in.
 *   2. Tell them exactly how to get back to their report later. Most students
 *      submit, close the tab and return days afterwards, so the login route is
 *      spelled out here rather than assumed: the sign-in page, the email their
 *      account uses, and what to do when the password has gone.
 *   3. Get them to the dashboard now, in one click.
 *
 * On passwords: we show the account's EMAIL because that half of the login is
 * ours to show. The password is not — it is never stored in a readable form
 * anywhere in this system (Firebase keeps only a hash), so no screen can print
 * it back. That is a deliberate protection, not a gap, and the copy below says
 * so plainly and points at the reset link instead of leaving them stuck.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";

export interface ExamCompleteProps {
  /** First name, for the greeting. */
  name?: string;
  /** The signed-in account's email — the username half of their login. */
  email?: string;
  /** Sends them into the dashboard without signing in again. */
  onGoToDashboard: () => void;
  /**
   * Triggers a password-reset email. Omit and the reset row falls back to a
   * link to /signin, where the same option exists.
   */
  onResetPassword?: () => Promise<void>;
}

const STEPS: { title: string; detail: string; icon: string }[] = [
  { icon: "explain", title: "Go to onegrasp.com and click “Sign in”", detail: "Or open the sign-in page directly with the button below — bookmark it for later." },
  { icon: "user", title: "Enter your registered email", detail: "This is the same email you used when you created your OneGrasp account." },
  { icon: "lock", title: "Enter the password you chose at registration", detail: "Forgotten it? Use “Forgot password” to have a reset link emailed to you." },
  { icon: "score", title: "Open your dashboard to read the full report", detail: "Your career matches, all eight dimensions, strengths and next steps are saved there permanently." },
];

export default function ExamComplete({ name, email, onGoToDashboard, onResetPassword }: ExamCompleteProps) {
  // Brief "saving" beat before the thank-you, so the submit doesn't feel like
  // it vanished — the write has usually already finished by the time it ends.
  const [phase, setPhase] = useState<"saving" | "done">("saving");
  const [resetState, setResetState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 1800);
    return () => clearTimeout(t);
  }, []);

  async function sendReset() {
    if (!onResetPassword || resetState === "sending") return;
    setResetState("sending");
    try {
      await onResetPassword();
      setResetState("sent");
    } catch {
      setResetState("error");
    }
  }

  if (phase === "saving") {
    return (
      <div className="xc-wrap">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="xc-saving">
          <div className="xc-spin" />
          <div className="xc-saving-t">Saving your responses…</div>
          <div className="xc-saving-s">Please don’t close this window</div>
        </div>
      </div>
    );
  }

  return (
    <div className="xc-wrap xc-scroll">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="xc-card xc-pop">
        <div className="xc-logo"><Logo height={30} /></div>

        <div className="xc-check"><Icon name="check" size={40} stroke={2.6} /></div>
        <div className="xc-kick">Assessment submitted</div>
        <h1 className="xc-title">Thank you{name ? `, ${name}` : ""}.</h1>
        <p className="xc-lead">
          Your responses have been recorded successfully and your personalised career
          report is being generated. Thank you for the care you gave each answer — the
          quality of your report rests directly on it.
        </p>

        <div className="xc-note">
          <span className="xc-note-ic"><Icon name="bell" size={17} /></span>
          {/* Careful with this promise: the report is written to the dashboard
              automatically, but the emailed copy goes out from /admin — say
              "our team will email" rather than implying an instant send. */}
          <span>
            Your report is saved to your OneGrasp dashboard permanently, and our team
            will email you a copy at your registered address.
          </span>
        </div>

        {/* --- the login card: what to sign in with --- */}
        <div className="xc-login">
          <div className="xc-login-head">
            <span className="xc-login-ic"><Icon name="lock" size={16} /></span>
            <div>
              <div className="xc-login-t">Your login details</div>
              <div className="xc-login-s">Use these to reach your report at any time</div>
            </div>
          </div>

          <div className="xc-field">
            <span className="xc-field-k">Sign-in page</span>
            <Link href="/signin" className="xc-field-link">onegrasp.com/signin</Link>
          </div>
          <div className="xc-field">
            <span className="xc-field-k">Email</span>
            <span className="xc-field-v">{email || "the email you registered with"}</span>
          </div>
          <div className="xc-field">
            <span className="xc-field-k">Password</span>
            <span className="xc-field-v xc-field-muted">
              The password you created at registration
            </span>
          </div>

          <p className="xc-privacy">
            <b>We never display or email your password.</b> It is stored only in an
            encrypted form that nobody at OneGrasp can read — including us. If you’ve
            forgotten it, reset it below and you’ll be back in within a minute.
          </p>

          {onResetPassword ? (
            <div className="xc-reset">
              <button className="xc-reset-btn" onClick={() => void sendReset()} disabled={resetState === "sending" || resetState === "sent"}>
                {resetState === "sending" ? "Sending…" : resetState === "sent" ? "Reset link sent ✓" : "Email me a password reset link"}
              </button>
              {resetState === "sent" && (
                <div className="xc-reset-ok">Check your inbox{email ? ` (${email})` : ""} — and your spam folder if it isn’t there in a minute.</div>
              )}
              {resetState === "error" && (
                <div className="xc-reset-err">Couldn’t send the reset email just now. You can also do this from the sign-in page.</div>
              )}
            </div>
          ) : (
            <Link href="/signin" className="xc-reset-btn xc-reset-link">Go to sign-in &amp; reset password</Link>
          )}
        </div>

        {/* --- the steps --- */}
        <div className="xc-steps-head">How to log in to your dashboard</div>
        <ol className="xc-steps">
          {STEPS.map((s, i) => (
            <li className="xc-step" key={s.title}>
              <span className="xc-step-n">{i + 1}</span>
              <div className="xc-step-body">
                <div className="xc-step-t"><span className="xc-step-ic"><Icon name={s.icon} size={15} /></span>{s.title}</div>
                <div className="xc-step-d">{s.detail}</div>
              </div>
            </li>
          ))}
        </ol>

        <button className="xc-cta" onClick={onGoToDashboard}>
          Go to my dashboard <Icon name="chevronRight" size={16} />
        </button>
        <div className="xc-help">
          Need a hand? Write to <a href="mailto:support@onegrasp.com">support@onegrasp.com</a> — we usually reply the same day.
        </div>
      </div>
    </div>
  );
}

const CSS = `
.xc-wrap{position:fixed;inset:0;z-index:1200;background:linear-gradient(160deg,#f3f5fd,#eef1f6);
  display:flex;align-items:center;justify-content:center;padding:24px 16px;
  font-family:Inter,system-ui,Segoe UI,sans-serif;color:#1f2937}
.xc-scroll{align-items:flex-start;overflow-y:auto;padding:32px 16px}
@media(max-width:640px){.xc-scroll{padding:18px 12px}}

.xc-saving{display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}
.xc-spin{width:42px;height:42px;border-radius:50%;border:3px solid #dfe3ef;border-top-color:#3b5bdb;animation:xcSpin .8s linear infinite}
.xc-saving-t{font-size:19px;font-weight:800;color:#1e293b}
.xc-saving-s{font-size:13.5px;color:#64748b}
@keyframes xcSpin{to{transform:rotate(360deg)}}

.xc-card{width:100%;max-width:600px;margin:auto;background:#fff;border:1px solid #e9ecf4;border-radius:22px;
  padding:34px 36px 32px;box-shadow:0 24px 60px rgba(23,22,36,.13);text-align:center}
@media(max-width:640px){.xc-card{padding:26px 20px 26px;border-radius:18px}}
.xc-pop{animation:xcPop .45s cubic-bezier(.2,.9,.28,1.04) both}
@keyframes xcPop{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.xc-pop{animation:none}}

.xc-logo{display:flex;justify-content:center;margin-bottom:18px}
.xc-check{width:78px;height:78px;border-radius:50%;margin:0 auto 16px;background:linear-gradient(135deg,#16a34a,#22c55e);
  color:#fff;display:grid;place-items:center;box-shadow:0 14px 32px rgba(22,163,74,.38)}
.xc-kick{font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#16a34a}
.xc-title{font-family:'Poppins',Inter,sans-serif;font-size:29px;font-weight:800;color:#0f172a;margin:8px 0 0;letter-spacing:-.02em}
.xc-lead{font-size:14.5px;line-height:1.65;color:#4b5563;margin:12px auto 0;max-width:470px}

.xc-note{display:flex;align-items:flex-start;gap:11px;text-align:left;background:#f2f6ff;border:1px solid #dde6fb;
  border-radius:13px;padding:13px 15px;margin:20px 0 24px;font-size:13px;line-height:1.55;color:#334155}
.xc-note-ic{color:#3b5bdb;flex:none;margin-top:1px}

.xc-login{text-align:left;background:#fbfcff;border:1px solid #e6eaf5;border-radius:16px;padding:18px 18px 16px;margin-bottom:26px}
.xc-login-head{display:flex;align-items:center;gap:11px;margin-bottom:14px}
.xc-login-ic{width:32px;height:32px;flex:none;border-radius:9px;background:#eef2ff;color:#3b5bdb;display:grid;place-items:center}
.xc-login-t{font-size:15px;font-weight:800;color:#0f172a}
.xc-login-s{font-size:12px;color:#7b8496;margin-top:1px}
.xc-field{display:flex;align-items:baseline;justify-content:space-between;gap:14px;padding:9px 0;border-top:1px solid #edf0f7;font-size:13.5px}
.xc-field-k{color:#7b8496;font-weight:600;flex:none}
.xc-field-v{font-weight:700;color:#0f172a;text-align:right;word-break:break-all}
.xc-field-muted{font-weight:600;color:#5b6474}
.xc-field-link{font-weight:800;color:#3b5bdb;text-decoration:none;text-align:right;word-break:break-all}
.xc-field-link:hover{text-decoration:underline}
.xc-privacy{font-size:12px;line-height:1.6;color:#6b7280;background:#fff;border:1px dashed #dfe4ef;border-radius:11px;padding:11px 13px;margin:14px 0 13px}
.xc-privacy b{color:#3d4657}
.xc-reset-btn{display:block;width:100%;padding:11px 14px;background:#fff;color:#3b5bdb;border:1.5px solid #c9d4f5;
  border-radius:11px;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;text-align:center;text-decoration:none}
.xc-reset-btn:hover{background:#f3f6ff}
.xc-reset-btn:disabled{opacity:.7;cursor:default}
.xc-reset-link{display:block}
.xc-reset-ok{font-size:12px;font-weight:600;color:#15803d;margin-top:8px}
.xc-reset-err{font-size:12px;font-weight:600;color:#b91c1c;margin-top:8px}

.xc-steps-head{text-align:left;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#8a919f;margin-bottom:12px}
.xc-steps{list-style:none;padding:0;margin:0 0 26px;display:flex;flex-direction:column;gap:2px;text-align:left;counter-reset:none}
.xc-step{display:flex;gap:13px;padding:11px 0;border-bottom:1px solid #f1f3f9}
.xc-step:last-child{border-bottom:none}
.xc-step-n{width:25px;height:25px;flex:none;border-radius:50%;background:#eef2ff;color:#3b5bdb;font-size:12.5px;font-weight:800;display:grid;place-items:center;margin-top:1px}
.xc-step-body{min-width:0}
.xc-step-t{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:#0f172a;line-height:1.4}
.xc-step-ic{color:#9aa3b6;flex:none;display:inline-flex}
.xc-step-d{font-size:12.5px;color:#6b7280;line-height:1.55;margin-top:3px}

.xc-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;
  background:#171624;color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:800;cursor:pointer;
  font-family:inherit;box-shadow:0 12px 26px rgba(23,22,36,.22);transition:background .15s}
.xc-cta:hover{background:#2b2a3f}
.xc-help{font-size:12px;color:#8a919f;margin-top:14px}
.xc-help a{color:#3b5bdb;font-weight:700;text-decoration:none}
`;
