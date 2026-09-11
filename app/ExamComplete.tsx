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

import { useEffect, useRef, useState } from "react";
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

  // `onGoToDashboard` is an inline arrow in both parents, so it is a new
  // function every render. Held in a ref so the Back guard below can depend on
  // nothing and still call the current one.
  const goRef = useRef(onGoToDashboard);
  goRef.current = onGoToDashboard;

  // BACK-BUTTON GUARD.
  //
  // Submitting the assessment doesn't change the URL — the student is still on
  // the exam route — and it clears the saved exam session. So pressing the
  // browser's Back arrow here used to land straight back on the exam with
  // nothing to resume, which generated a whole new randomly-picked assessment
  // and made it look like their answers had been thrown away.
  //
  // Pushing one throwaway history entry means the first Back press pops that
  // instead, and we send them to the dashboard — the thing they were almost
  // certainly reaching for. NewExam has a second guard for any other route
  // back onto the exam.
  useEffect(() => {
    window.history.pushState({ ogExamDone: true }, "", window.location.href);
    const onPop = () => goRef.current();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
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

        {/* Share and Dashboard in a single row layout */}
        <div className="xc-actions">
          <div className="xc-action-item">
            {/* Sits above the dashboard CTA on purpose: this is the one moment a
                student feels like sharing, and it is gone once they navigate away.
                It shares the achievement only — never a result. */}
            <ShareAchievement name={fullName || name} />
          </div>
          <button className="xc-cta xc-cta-primary" onClick={onGoToDashboard}>
            Go to my dashboard <Icon name="chevronRight" size={16} />
          </button>
        </div>
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

.xc-card{width:100%;max-width:620px;margin:auto;background:#fff;border:1px solid #e9ecf4;border-radius:20px;
  padding:28px 32px 24px;box-shadow:0 20px 50px rgba(23,22,36,.12);text-align:center}
@media(max-width:640px){.xc-card{padding:20px 16px 20px;border-radius:16px}}
.xc-pop{animation:xcPop .45s cubic-bezier(.2,.9,.28,1.04) both}
@keyframes xcPop{from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.xc-pop{animation:none}}

.xc-logo{display:flex;justify-content:center;margin-bottom:12px}
.xc-check{width:64px;height:64px;border-radius:50%;margin:0 auto 12px;background:linear-gradient(135deg,#16a34a,#22c55e);
  color:#fff;display:grid;place-items:center;box-shadow:0 10px 24px rgba(22,163,74,.32)}
.xc-kick{font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#16a34a}
.xc-title{font-family:'Poppins',Inter,sans-serif;font-size:24px;font-weight:800;color:#0f172a;margin:6px 0 0;letter-spacing:-.02em}
.xc-lead{font-size:13.5px;line-height:1.5;color:#4b5563;margin:8px auto 0;max-width:450px}

.xc-note{display:flex;align-items:flex-start;gap:10px;text-align:left;background:#f2f6ff;border:1px solid #dde6fb;
  border-radius:12px;padding:11px 13px;margin:14px 0 16px;font-size:12px;line-height:1.5;color:#334155}
.xc-note-ic{color:#3b5bdb;flex:none;margin-top:1px}

.xc-mail{display:flex;align-items:flex-start;gap:10px;text-align:left;background:#fbfcff;border:1px solid #e6eaf5;
  border-radius:12px;padding:11px 13px;margin:0 0 16px;font-size:12px;line-height:1.5;color:#4b5563}
.xc-mail-ic{color:#3b5bdb;flex:none;margin-top:1px}
.xc-mail b{color:#0f172a;word-break:break-all}

.xc-actions{display:flex;gap:14px;margin:18px 0;align-items:center;justify-content:center;flex-wrap:wrap}
@media(max-width:640px){.xc-actions{flex-direction:column;gap:10px;width:100%}}

.xc-action-item{display:flex;align-items:center;justify-content:center;width:100%;max-width:280px}

.xc-cta{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:11px 22px;
  background:#171624;color:#fff;border:none;border-radius:9px;font-size:13px;font-weight:700;cursor:pointer;
  font-family:inherit;box-shadow:0 6px 14px rgba(23,22,36,.15);transition:background .15s;white-space:nowrap;width:100%}
.xc-cta:hover{background:#2b2a3f}
.xc-cta-primary{margin:0}

.xc-help{font-size:11px;color:#94a3b8;margin-top:10px}
.xc-help a{color:#3b5bdb;font-weight:700;text-decoration:none}
`;
