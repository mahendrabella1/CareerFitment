"use client";

/**
 * /register - a guided, 3-step account wizard (Milestone → Current stage →
 * Details). Fields reveal progressively as earlier ones are completed, with
 * clear validation and "you did it" feedback, so filling the form feels like
 * making steady progress. Creates a Firebase account + Firestore profile, then
 * starts the assessment.
 */

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/app/Logo";
import { Icon } from "@/app/Icons";
import { useAuth, authErrorMessage } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { CLARITY_STAGES, journeyForCategory, PASSWORD_RULES, passwordIsValid, emailIsValid, phoneProblem } from "@/lib/auth/formOptions";
import { trackEvent } from "@/lib/metaPixel";

// One ink colour for every choice and button (the same look as the dashboard
// and feature pages); the per-milestone colours below are no longer drawn.
const NAVY = "#16181d";
const WARM = "#f4f0eb";

// Classes 6, 7, 8, 9–10, 11, 12 and Undergraduates are available; the rest are shown but disabled ("Soon").
const MILESTONES = [
  { value: "class_6", label: "Class 6", icon: "school", color: "#2f6bff", soft: "#e9f0ff", enabled: true },
  { value: "class_7", label: "Class 7", icon: "school", color: "#2f6bff", soft: "#e9f0ff", enabled: true },
  { value: "class_8", label: "Class 8", icon: "school", color: "#2f6bff", soft: "#e9f0ff", enabled: true },
  { value: "class_9_10", label: "Class 9 – 10", icon: "route", color: "#16a34a", soft: "#e6f6ec", enabled: true },
  { value: "class_11", label: "Class 11", icon: "compass", color: "#7c3aed", soft: "#f1e9fd", enabled: true },
  { value: "class_12", label: "Class 12", icon: "compass", color: "#7c3aed", soft: "#f1e9fd", enabled: true },
  // Internal category value stays "graduate" (matches stageForCategory() in
  // lib/newAssessment/data.ts and every graduateOutput/journeyCode check
  // downstream) - only the user-facing label changed, per instruction to
  // call this "Undergraduates" everywhere the student sees it.
  { value: "graduate", label: "Undergraduates", icon: "cap", color: "#e08a0a", soft: "#fdf1dd", enabled: true },
  // Working professionals take the Stress & Resilience Check (lib/stress/*), not
  // a student assessment - step 2 asks their experience band instead.
  { value: "experienced_professional", label: "Working Professionals", icon: "briefcase", color: "#0d9488", soft: "#dff5f2", enabled: true },
];
const PRO = "experienced_professional";
const BAND_OPTIONS = [
  { value: "0-5", label: "0 - 5 years", hint: "Early career", icon: "route" },
  { value: "5-15", label: "5 - 15 years", hint: "Mid career", icon: "briefcase" },
  { value: "15+", label: "15+ years", hint: "Senior career", icon: "flag" },
];
const STAGES = [
  { value: CLARITY_STAGES[0], label: "I have no idea about my career", icon: "help", color: "#c0564f" },
  { value: CLARITY_STAGES[1], label: "I’m confused among various career options", icon: "signpost", color: "#e08a0a" },
  { value: CLARITY_STAGES[2], label: "I’m a bit sure but want to explore more", icon: "compass", color: "#2f6bff" },
  { value: CLARITY_STAGES[3], label: "I’m sure but need an execution plan", icon: "route", color: "#16a34a" },
];
const TABS = ["Set your milestone", "Select your current stage", "Start assessment"];

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, register, refreshProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: "", category: "", clarity: "", experienceBand: "", email: "", phone: "", city: "", institution: "", age: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Institutional link (?ref=CODE) - checked once on mount. An invalid link
  // BLOCKS the whole registration form (see the early return below) instead
  // of just showing a banner above a still-usable one - a deactivated/
  // expired/full link shouldn't let a student fill in a whole form only to
  // find out at the end it was never going to waive their fee. This check is
  // still only advisory in the security sense; the real, race-safe check
  // happens again server-side in /api/institutional/redeem at submit time,
  // for the rare case a link dies in the few seconds after this loads.
  const refCode = (searchParams.get("ref") || "").trim().toUpperCase();
  type InstCheck = { valid: true; schoolName?: string } | { valid: false; reason: string; schoolName?: string };
  const [instCheck, setInstCheck] = useState<InstCheck | "checking" | null>(refCode ? "checking" : null);
  // Set only if a ref code was present but redemption failed at submit time -
  // shown on the "done" screen instead of the usual auto-redirect, since the
  // account is created either way and the student needs a moment to read why
  // they'll still see a payment step.
  const [instFailMsg, setInstFailMsg] = useState("");

  useEffect(() => {
    if (!refCode) return;
    let cancelled = false;
    fetch(`/api/institutional/check?code=${encodeURIComponent(refCode)}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setInstCheck(
          d?.valid
            ? { valid: true, schoolName: d.schoolName || "" }
            : { valid: false, reason: d?.reason || "not_found", schoolName: d?.schoolName || "" }
        );
        if (d?.valid && d.schoolName) setF((p) => ({ ...p, institution: d.schoolName }));
      })
      .catch(() => { if (!cancelled) setInstCheck({ valid: false, reason: "not_found" }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refCode]);

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const nameOk = f.name.trim() !== "";
  const emailOk = emailIsValid(f.email);
  const phoneErr = phoneProblem(f.phone);
  const phoneOk = phoneErr === null;
  // The rest of the form appears only once the number is valid, so say why as
  // soon as a full number has been typed - not only after pressing Start.
  const phoneTyped = f.phone.replace(/\D/g, "").length >= 10;
  const pwOk = passwordIsValid(f.password);
  const step0Ok = nameOk && f.category !== "";
  const isPro = f.category === PRO;
  const step1Ok = isPro ? f.experienceBand !== "" : f.clarity !== "";
  const step2Ok = emailOk && phoneOk && pwOk;
  const done0 = step0Ok, done1 = step1Ok, done2 = step2Ok;

  const canGoTo = (i: number) => i === 0 || (i === 1 && step0Ok) || (i === 2 && step0Ok && step1Ok);

  async function submit() {
    setTouched(true);
    setError("");
    if (!step2Ok) return;
    if (!ready) { setError("Accounts aren’t configured on this deployment yet (missing Firebase keys)."); return; }
    setSubmitting(true);
    try {
      await register({
        name: f.name, email: f.email, phone: f.phone, institution: f.institution,
        category: f.category, journeyCode: journeyForCategory(f.category), clarity: isPro ? "" : f.clarity,
        password: f.password, city: f.city, age: f.age,
        ...(isPro ? { experienceBand: f.experienceBand } : {}),
      });
      setDone(true);
      trackEvent("CompleteRegistration", { content_name: f.category, status: true });
      void fetch("/api/crm-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name, email: f.email, phone: f.phone,
          institution: f.institution, category: f.category, city: f.city, age: f.age,
          utmSource: searchParams.get("utm_source") ?? undefined,
          utmMedium: searchParams.get("utm_medium") ?? undefined,
          utmCampaign: searchParams.get("utm_campaign") ?? undefined,
        }),
      }).catch(() => {});

      // The account exists either way by this point - an institutional-link
      // failure here (link disabled/expired/full in the moment between the
      // banner and this submit) must never lose the signup, only fall
      // through to the normal payment step the student would have hit
      // anyway. Only skip straight to the exam when redemption genuinely
      // succeeded; otherwise pause the auto-redirect and say why.
      if (refCode) {
        try {
          const idToken = await getFirebaseAuth()?.currentUser?.getIdToken();
          const res = await fetch("/api/institutional/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: refCode, idToken }),
          });
          const data = await res.json();
          if (!data?.success) {
            setInstFailMsg(data?.message || "This school link couldn't be applied.");
            return; // no auto-redirect - the "done" screen shows a manual Continue button instead
          }
          // The redeem call marked paid:true on the server (Admin SDK,
          // bypassing Firestore rules entirely) - but register() already set
          // the CLIENT's local profile to the paid:false doc it just wrote,
          // and nothing refetches it automatically. Without this, the exam
          // gate (assessment-experience.tsx's profile.paid check) still sees
          // the stale value and shows PaymentGate anyway.
          await refreshProfile();
        } catch {
          setInstFailMsg("This school link couldn't be applied.");
          return;
        }
      }
      setTimeout(() => router.push(isPro ? "/account/stress" : "/?begin=1"), 1100);
    } catch (err) {
      setError(authErrorMessage(err));
      setSubmitting(false);
    }
  }

  // An invalid ?ref= link blocks the form entirely - a reason-specific
  // message screen instead, with a path to the normal (paid) signup for a
  // student who still wants to register. A valid link falls through to the
  // ordinary wizard with just a confirmation banner (below).
  if (refCode && instCheck !== "checking" && instCheck && !instCheck.valid) {
    return <InstitutionalLinkBlocked reason={instCheck.reason} schoolName={instCheck.schoolName} />;
  }

  return (
    <div style={S.shell}>
      <div style={S.page}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div style={S.overlay} />
      <Link href="/" style={S.home}>← Home</Link>

      <div style={S.card}>
        {!done && refCode && instCheck !== "checking" && instCheck && instCheck.valid && (
          <div style={S.instBanner}>
            ✓ Registering via <b>{instCheck.schoolName || "your school"}</b> - your assessment fee is covered.
          </div>
        )}
        {/* tabs */}
        <div style={S.tabs}>
          {TABS.map((t, i) => {
            const isActive = step === i;
            const complete = (i === 0 && done0) || (i === 1 && done1) || (i === 2 && done2);
            return (
              <button key={t} onClick={() => canGoTo(i) && setStep(i)} disabled={!canGoTo(i)}
                style={{ ...S.tab, ...(isActive ? S.tabActive : {}), ...(canGoTo(i) ? {} : S.tabLocked) }}>
                {complete && !isActive ? <span style={S.tabTick}>✓</span> : <span style={S.tabNum}>{i + 1}</span>}
                {t}
              </button>
            );
          })}
        </div>

        <div style={S.body} className="og-reg-body">
          {done ? (
            <div style={S.doneWrap} className="rin">
              <div style={S.doneCheck}>✓</div>
              <h2 style={S.doneTitle}>You’re all set, {f.name.split(" ")[0] || "there"}!</h2>
              {instFailMsg ? (
                <>
                  <p style={S.doneSub}>Your account was created.</p>
                  <p style={{ ...S.doneSub, color: "#b91c1c", fontWeight: 700, marginTop: 6 }}>{instFailMsg}</p>
                  <button style={{ ...S.next, marginTop: 18 }} onClick={() => router.push(isPro ? "/account/stress" : "/?begin=1")}>Continue →</button>
                </>
              ) : (
                <p style={S.doneSub}>Account created - taking you to your {isPro ? "Stress & Resilience Check" : "assessment"}…</p>
              )}
            </div>
          ) : step === 0 ? (
            /* ---------------- Step 1: Milestone ---------------- */
            <>
              <h2 style={S.h}>Select your milestone.</h2>
              <label style={S.floatLabel}>Your name</label>
              <div style={S.underWrap}>
                <input style={S.underInput} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Type your full name" />
                {nameOk && <span style={S.okTick}>✓</span>}
              </div>
              {touched && !nameOk && <div style={S.err}>Please enter your name.</div>}

              <div style={S.sectionLabel}>I need guidance for <span style={S.muted}>(select any one)</span></div>
              <div style={S.milestones} className="og-ms">
                {MILESTONES.map((m) => {
                  const sel = f.category === m.value;
                  const off = !m.enabled;
                  return (
                    <button key={m.value} disabled={off} onClick={() => { if (!off) set("category", m.value); }}
                      title={off ? "Coming soon" : m.label}
                      style={{ ...S.mCard, ...(off ? { opacity: 0.5, cursor: "not-allowed", background: "#f7f8fb" } : {}), ...(sel ? S.picked : {}) }}>
                      {off && <span style={S.soon}>Soon</span>}
                      <span style={{ ...S.mIcon, ...(sel ? { background: NAVY, color: "#fff" } : { background: WARM, color: "#4a4f59" }) }}><Icon name={m.icon} size={20} stroke={1.6} /></span>
                      <span style={S.mLabel}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
              {touched && !f.category && <div style={S.err}>Please select one option above.</div>}

              <div style={S.footer}>
                <Link href="/signin" style={S.ghostBtn}>Existing user login</Link>
                <button style={S.next} onClick={() => { if (step0Ok) { setTouched(false); setStep(1); } else setTouched(true); }}>Next →</button>
              </div>
            </>
          ) : step === 1 ? (
            /* ---------------- Step 2: Current stage ---------------- */
            <>
              <h2 style={S.h}>Set your current stage.</h2>
              <div style={S.confirmPill}><Icon name="check" size={14} /> {MILESTONES.find((m) => m.value === f.category)?.label} · {isPro ? "stress & resilience" : "career guidance"}</div>
              <div style={S.sectionLabel}>{isPro ? "How long have you been working?" : "Where are you right now?"}</div>
              {isPro ? (
              <div style={S.stages} className="og-st">
                {BAND_OPTIONS.map((c, i) => {
                  const sel = f.experienceBand === c.value;
                  return (
                    <button key={c.value} onClick={() => set("experienceBand", c.value)} className="rin" style={{ ...S.sCard, animationDelay: `${i * 70}ms`, ...(sel ? S.picked : {}) }}>
                      <span style={{ ...S.sIcon, ...(sel ? { background: NAVY, color: "#fff", borderColor: NAVY } : {}) }}><Icon name={c.icon} size={20} stroke={1.6} /></span>
                      <span style={{ ...S.sLabel, ...(sel ? { fontWeight: 600 } : {}) }}>{c.label} <span style={{ fontWeight: 500, color: "#7b808b" }}>· {c.hint}</span></span>
                    </button>
                  );
                })}
              </div>
              ) : (
              <div style={S.stages} className="og-st">
                {STAGES.map((c, i) => {
                  const sel = f.clarity === c.value;
                  return (
                    <button key={c.value} onClick={() => set("clarity", c.value)} className="rin" style={{ ...S.sCard, animationDelay: `${i * 70}ms`, ...(sel ? S.picked : {}) }}>
                      <span style={{ ...S.sIcon, ...(sel ? { background: NAVY, color: "#fff", borderColor: NAVY } : {}) }}><Icon name={c.icon} size={20} stroke={1.6} /></span>
                      <span style={{ ...S.sLabel, ...(sel ? { fontWeight: 600 } : {}) }}>{c.label}</span>
                    </button>
                  );
                })}
              </div>
              )}
              {touched && !step1Ok && <div style={S.err}>Please choose one option above.</div>}
              <div style={S.footer}>
                <button style={S.ghostBtn} onClick={() => { setTouched(false); setStep(0); }}>← Back</button>
                <button style={S.next} onClick={() => { if (step1Ok) { setTouched(false); setStep(2); } else setTouched(true); }}>Next →</button>
              </div>
            </>
          ) : (
            /* ---------------- Step 3: Details (progressive reveal) ---------------- */
            <>
              <h2 style={S.h}>Let’s start.</h2>
              <p style={S.subhint}>Your email and password are your login - you’ll use them to view your report anytime.</p>
              {error && <div style={S.errorBox}>{error}</div>}

              <div style={S.grid2} className="og-g2">
                <Field label="Email" value={f.email} onChange={(v) => set("email", v)} ok={emailOk} touched={touched} type="email" placeholder="you@email.com" />
              </div>

              {emailOk && (
                <div style={S.grid2} className="rin og-g2">
                  <Field label="Phone number" value={f.phone} onChange={(v) => set("phone", v)} ok={phoneOk} touched={touched || phoneTyped} placeholder="10-digit mobile" type="tel" error={phoneErr ?? undefined} />
                  <Field label="Location (city)" value={f.city} onChange={(v) => set("city", v)} placeholder="Your city" optional />
                </div>
              )}

              {emailOk && phoneOk && (
                <div className="rin">
                  <div style={S.grid2} className="og-g2">
                    <Field label={isPro ? "Company" : "School / College / Company"} value={f.institution} onChange={(v) => set("institution", v)} placeholder={isPro ? "Where you work" : "Where you study / work"} optional
                      locked={Boolean(instCheck && instCheck !== "checking" && instCheck.valid)} />
                    <Field label="Age" value={f.age} onChange={(v) => set("age", v.replace(/[^\d]/g, "").slice(0, 2))} placeholder={isPro ? "e.g. 29" : "e.g. 17"} optional />
                  </div>
                  <div style={{ position: "relative", marginTop: 4 }}>
                    <label style={S.fLabel}>Create your password {pwOk && <span style={S.okInline}>✓</span>}</label>
                    <input style={S.input} type={showPw ? "text" : "password"} value={f.password} onChange={(e) => set("password", e.target.value)} placeholder="Choose a strong password" />
                    <button type="button" style={S.pwToggle} onClick={() => setShowPw((s) => !s)}>{showPw ? "Hide" : "Show"}</button>
                    {f.password.length > 0 && (
                      <ul style={S.rules} className="og-reg-rules">
                        {PASSWORD_RULES.map((r) => {
                          const good = r.test(f.password);
                          return <li key={r.label} style={{ ...S.rule, color: good ? "#15803d" : "#9aa1ad" }}>{good ? "✓" : "○"} {r.label}</li>;
                        })}
                      </ul>
                    )}
                    {touched && !pwOk && <div style={S.err}>Your password needs to meet every rule above.</div>}
                  </div>
                </div>
              )}

              <div style={S.footer}>
                <button style={S.ghostBtn} onClick={() => { setTouched(false); setStep(1); }}>← Back</button>
                <button style={{ ...S.next, ...(submitting ? S.disabled : {}) }} disabled={submitting} onClick={() => void submit()}>
                  {submitting ? "Creating…" : "Start →"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* progress dots */}
        {!done && (
          <div style={S.progress}>
            {[0, 1, 2].map((i) => <span key={i} style={{ ...S.dot, ...(i === step ? S.dotOn : i < step ? S.dotDone : {}) }} />)}
          </div>
        )}
      </div>

      <div style={S.brand}><Link href="/" style={S.brandChip} aria-label="OneGrasp home"><Logo height={40} /></Link></div>
      </div>
    </div>
  );
}

/* ------------------- blocked institutional-link screen ------------------ */
const INST_BLOCK_COPY: Record<string, (school: string) => { title: string; body: string }> = {
  inactive: (school) => ({
    title: "This link has been deactivated",
    body: `The registration link${school ? ` for ${school}` : ""} has been switched off by the school. If you think this is a mistake, check with them for an updated link.`,
  }),
  expired: (school) => ({
    title: "This link has expired",
    body: `The registration link${school ? ` for ${school}` : ""} is no longer active. Check with your school for an updated link.`,
  }),
  full: (school) => ({
    title: "This link is full",
    body: `The registration link${school ? ` for ${school}` : ""} has reached its student limit. Check with your school if more spots open up.`,
  }),
  not_found: () => ({
    title: "This link isn't valid",
    body: "Double-check that you copied the whole link your school sent you - it may be incomplete or mistyped.",
  }),
};

function InstitutionalLinkBlocked({ reason, schoolName }: { reason: string; schoolName?: string }) {
  const { title, body } = (INST_BLOCK_COPY[reason] || INST_BLOCK_COPY.not_found)(schoolName || "");
  return (
    <div style={S.shell}>
      <div style={S.page}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={S.overlay} />
        <Link href="/" style={S.home}>HOME</Link>
        <div style={S.card}>
          <div style={S.doneWrap}>
            <div style={{ ...S.doneCheck, background: "#b42318" }}>!</div>
            <h2 style={S.doneTitle}>{title}</h2>
            <p style={{ ...S.doneSub, maxWidth: 380, margin: "0 auto" }}>{body}</p>
            <Link href="/register" style={{ ...S.next, marginTop: 22, display: "inline-block", textDecoration: "none" }}>
              Continue to normal registration →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- reusable field ---------------------------- */
function Field({ label, value, onChange, ok, touched, type = "text", placeholder, optional, autoFocus, locked, error }:
  { label: string; value: string; onChange: (v: string) => void; ok?: boolean; touched?: boolean; type?: string; placeholder?: string; optional?: boolean; autoFocus?: boolean; locked?: boolean; /** Says what's wrong, instead of "Please enter a valid ...". */ error?: string }) {
  const invalid = touched && !optional && ok === false;
  return (
    <div style={{ position: "relative" }}>
      <label style={S.fLabel}>
        {label}{optional && !locked && <span style={S.optTag}> (optional)</span>} {ok && <span style={S.okInline}>✓</span>}
        {locked && <span style={S.optTag}> (set by your registration link)</span>}
      </label>
      <input style={{ ...S.input, ...(invalid ? S.inputBad : {}), ...(locked ? { color: "#6b7280", cursor: "not-allowed" } : {}) }}
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} disabled={locked} readOnly={locked} />
      {invalid && <div style={S.err}>{error || `Please enter a valid ${label.toLowerCase()}.`}</div>}
    </div>
  );
}

/* -------------------------------- styles ------------------------------- */
const S: Record<string, React.CSSProperties> = {
  // The shell stacks the sale ribbon above the form: the form keeps filling the
  // rest of the screen rather than being pushed a banner's height off it.
  shell: { display: "flex", flexDirection: "column", minHeight: "100vh" },
  page: { position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "84px 20px 40px", fontFamily: "Inter, system-ui, sans-serif", background: "#fbfaf8", color: NAVY },
  overlay: { display: "none" },
  home: { position: "absolute", top: 20, right: 20, zIndex: 3, background: "#fff", color: NAVY, textDecoration: "none", fontSize: 13.5, fontWeight: 600, padding: "8px 14px", borderRadius: 6, border: "1px solid #d9d5cd" },
  brand: { position: "absolute", top: 16, left: 20, display: "flex", zIndex: 2 },
  brandChip: { display: "inline-flex" },

  card: { position: "relative", zIndex: 2, width: "100%", maxWidth: 840, background: "#fff", borderRadius: 10, border: "1px solid #e8e5df", boxShadow: "0 18px 50px rgba(22,24,29,.08)", overflow: "hidden" },
  tabs: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", background: "#fff", borderBottom: "1px solid #e8e5df" },
  tab: { position: "relative", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 8px", border: "none", borderBottom: "2px solid transparent", marginBottom: -1, background: "transparent", fontSize: 13, fontWeight: 600, color: "#7b808b", cursor: "pointer", fontFamily: "inherit" },
  tabActive: { color: NAVY, borderBottomColor: NAVY },
  tabLocked: { opacity: .55, cursor: "not-allowed" },
  tabTick: { display: "inline-grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", background: "#15803d", color: "#fff", fontSize: 11, fontWeight: 700 },
  tabNum: { display: "inline-grid", placeItems: "center", width: 20, height: 20, borderRadius: "50%", border: "1px solid #d9d5cd", fontSize: 11, fontWeight: 600 },

  body: { padding: "28px 34px 6px", minHeight: 310 },
  h: { textAlign: "left", fontFamily: "Poppins, Inter, sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: "-.015em", color: NAVY, margin: "0 0 18px" },
  subhint: { textAlign: "left", fontSize: 14, color: "#7b808b", margin: "-10px 0 18px" },

  offer: { display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 10, background: "#fff7f7", border: "1px solid #f7d3d5", borderRadius: 10, padding: "9px 12px", margin: "0 0 16px" },
  instBanner: { textAlign: "center", fontSize: 12.5, fontWeight: 600, color: "#137a45", background: "#eafaf1", borderBottom: "1px solid #bfe8d3", padding: "10px 16px" },
  offerBadge: { background: "#e0242e", color: "#fff", fontSize: 10.5, fontWeight: 800, borderRadius: 6, padding: "3px 7px", letterSpacing: .3 },
  offerWas: { color: "#a2a7b4", fontSize: 13, fontWeight: 600 },
  offerNow: { color: "#1f2740", fontSize: 17, fontWeight: 800 },
  offerTxt: { fontSize: 11.5, fontWeight: 600, color: "#8a5b5e" },

  floatLabel: { display: "block", fontSize: 13.5, fontWeight: 600, color: "#4a4f59", marginBottom: 6 },
  underWrap: { position: "relative", marginBottom: 6, maxWidth: 480 },
  underInput: { width: "100%", height: 46, border: "1px solid #d9d5cd", borderRadius: 6, fontSize: 15, padding: "0 36px 0 13px", outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", color: NAVY },
  okTick: { position: "absolute", right: 13, top: 13, color: "#15803d", fontWeight: 700, fontSize: 14 },

  sectionLabel: { fontSize: 14, fontWeight: 600, color: NAVY, margin: "24px 0 12px" },
  muted: { color: "#7b808b", fontWeight: 400 },

  milestones: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  mCard: { position: "relative", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#fff", border: "1px solid #e8e5df", borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" },
  picked: { borderColor: NAVY, boxShadow: `inset 0 0 0 1px ${NAVY}`, background: "#fff" },
  soon: { position: "absolute", top: 6, right: 6, fontSize: 9, fontWeight: 700, letterSpacing: .4, textTransform: "uppercase", color: "#7b808b", background: "#f4f0eb", borderRadius: 4, padding: "2px 5px" },
  mIcon: { width: 36, height: 36, flex: "none", borderRadius: 6, display: "grid", placeItems: "center", transition: "background .15s, color .15s" },
  mLabel: { fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.3 },
  mSel: { position: "absolute", top: 7, right: 7, width: 16, height: 16, borderRadius: "50%", color: "#fff", fontSize: 10, fontWeight: 800, display: "grid", placeItems: "center" },

  confirmPill: { display: "inline-flex", alignItems: "center", gap: 6, background: WARM, color: NAVY, fontSize: 13, fontWeight: 600, padding: "6px 12px", borderRadius: 6, marginBottom: 2 },
  stages: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  sCard: { position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, padding: "16px 14px", background: "#fff", border: "1px solid #e8e5df", borderRadius: 8, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color .15s, box-shadow .15s" },
  sIcon: { width: 36, height: 36, borderRadius: 6, border: "1px solid #e8e5df", background: WARM, color: "#4a4f59", display: "grid", placeItems: "center", transition: "background .15s, color .15s" },
  sLabel: { fontSize: 14, fontWeight: 500, color: NAVY, lineHeight: 1.45 },

  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  fLabel: { display: "block", fontSize: 13.5, color: "#4a4f59", fontWeight: 600, marginBottom: 6 },
  optTag: { color: "#7b808b", fontWeight: 400 },
  okInline: { color: "#15803d", fontWeight: 700 },
  input: { width: "100%", height: 46, border: "1px solid #d9d5cd", borderRadius: 6, fontSize: 15, padding: "0 64px 0 13px", outline: "none", background: "#fff", boxSizing: "border-box", fontFamily: "inherit", color: NAVY },
  inputBad: { borderColor: "#b42318" },
  pwToggle: { position: "absolute", right: 8, top: 35, background: "none", border: "none", color: "#4a4f59", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  rules: { listStyle: "none", padding: "10px 0 0", margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 14px" },
  rule: { fontSize: 12, fontWeight: 500 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 28, paddingTop: 18, borderTop: "1px solid #f0ede8" },
  ghostBtn: { background: "#fff", color: NAVY, border: "1px solid #d9d5cd", borderRadius: 6, padding: "0 16px", height: 42, display: "inline-flex", alignItems: "center", fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none", fontFamily: "inherit" },
  next: { background: NAVY, color: "#fff", border: "1px solid " + NAVY, borderRadius: 6, padding: "0 22px", height: 42, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  disabled: { opacity: .45, cursor: "not-allowed" },
  err: { color: "#b42318", fontSize: 12.5, marginTop: 6 },
  errorBox: { background: "#fdf2f2", border: "1px solid #f3c8c8", color: "#9f1d1d", padding: "10px 12px", borderRadius: 6, fontSize: 13.5, marginBottom: 16 },

  progress: { display: "flex", justifyContent: "center", gap: 6, padding: "14px 0 20px" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#e1ddd5" },
  dotOn: { background: NAVY, width: 20, borderRadius: 4 },
  dotDone: { background: "#15803d" },

  doneWrap: { textAlign: "center", padding: "40px 0 20px" },
  doneCheck: { width: 64, height: 64, borderRadius: "50%", margin: "0 auto 16px", background: "#15803d", color: "#fff", fontSize: 32, fontWeight: 700, display: "grid", placeItems: "center" },
  doneTitle: { fontFamily: "Poppins, Inter, sans-serif", fontSize: 24, fontWeight: 600, color: NAVY, margin: "0 0 6px" },
  doneSub: { fontSize: 14.5, color: "#4a4f59" },
};

const CSS = `
@keyframes rinKey{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.rin{animation:rinKey .5s cubic-bezier(.2,.8,.25,1) both}
@media(max-width:760px){
  .og-ms{grid-template-columns:repeat(2,1fr) !important}
  .og-st{grid-template-columns:repeat(2,1fr) !important}
  .og-g2{grid-template-columns:1fr !important}
  .og-reg-body{padding:20px 18px 6px !important}
}
@media(max-width:440px){
  .og-ms{grid-template-columns:1fr 1fr !important}
  .og-reg-rules{grid-template-columns:1fr 1fr !important}
  .og-reg-body{padding:18px 14px 6px !important}
}`;
