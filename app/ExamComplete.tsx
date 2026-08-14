"use client";

/**
 * ExamComplete — the screen a student lands on the moment they submit the
 * assessment. It does two jobs, and deliberately no more:
 *
 *   1. Close the exam properly — thank them, and confirm the responses are in.
 *   2. Get them to the dashboard now, in one click.
 *
 * It used to also print the login details, four sign-in steps and a "email me a
 * password reset link" button. All of that moved into the completion email
 * (lib/studentEmail.ts), which goes out automatically on submit: a student who
 * needs sign-in instructions needs them days later, when this screen is long
 * gone and only the email survives. Standing between a finished exam and the
 * dashboard with a wall of instructions helped nobody who was still looking at
 * it.
 *
 * The report itself is not emailed from here — an admin sends it by hand from
 * /admin, which is why the copy says "our team will email you a copy" rather
 * than promising anything instant.
 */

import { useEffect, useState } from "react";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import ShareAchievement from "@/app/ShareAchievement";

export interface ExamCompleteProps {
  /** First name, for the greeting. */
  name?: string;
  /** Full name, for the shareable achievement card. Falls back to `name`. */
  fullName?: string;
  /** The signed-in account's email — named so they know which inbox to check. */
  email?: string;
  /** Sends them into the dashboard without signing in again. */
  onGoToDashboard: () => void;
}

export default function ExamComplete({ name, fullName, email, onGoToDashboard }: ExamCompleteProps) {
  // Brief "saving" beat before the thank-you, so the submit doesn't feel like
  // it vanished — the write has usually already finished by the time it ends.
  const [phase, setPhase] = useState<"saving" | "done">("saving");

  useEffect(() => {
    const t = setTimeout(() => setPhase("done"), 1800);
    return () => clearTimeout(t);
  }, []);

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

        {/* The sign-in steps live in the completion email now — this only says
            it is on the way, so they know to look for it later. */}
        <div className="xc-mail">
          <span className="xc-mail-ic"><Icon name="explain" size={17} /></span>
          <span>
            We’ve emailed a confirmation to{" "}
            <b>{email || "your registered email address"}</b> with the steps to
            sign back in whenever you want to reread your report.
          </span>
        </div>

        {/* Sits above the dashboard CTA on purpose: this is the one moment a
            student feels like sharing, and it is gone once they navigate away.
            It shares the achievement only — never a result. */}
        <ShareAchievement name={fullName || name} />

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

.xc-mail{display:flex;align-items:flex-start;gap:11px;text-align:left;background:#fbfcff;border:1px solid #e6eaf5;
  border-radius:13px;padding:13px 15px;margin:0 0 24px;font-size:13px;line-height:1.55;color:#4b5563}
.xc-mail-ic{color:#3b5bdb;flex:none;margin-top:1px}
.xc-mail b{color:#0f172a;word-break:break-all}

.xc-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px;
  background:#171624;color:#fff;border:none;border-radius:13px;font-size:15px;font-weight:800;cursor:pointer;
  font-family:inherit;box-shadow:0 12px 26px rgba(23,22,36,.22);transition:background .15s}
.xc-cta:hover{background:#2b2a3f}
.xc-help{font-size:12px;color:#8a919f;margin-top:14px}
.xc-help a{color:#3b5bdb;font-weight:700;text-decoration:none}
`;
