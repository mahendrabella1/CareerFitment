"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthProvider";
import { UNIVERSITIES } from "@/data/studyAbroad/universities";
import { REVIEW_AREAS, submitReview, type ReviewDraft } from "@/lib/studyAbroad/clientReviews";

const ACCENT = "#7c3aed";
const DRAFT_KEY = "onegrasp.abroad.reviewDraft.v1";

const EMPTY: ReviewDraft = {
  universityName: "",
  programme: "",
  role: "student",
  yearStarted: "",
  ratings: {},
  answers: {},
  outcome: { stayedAbroad: "" },
  advice: "",
  displayName: "",
  verification: "university_email",
};

export function ReviewForm() {
  const { user } = useAuth();
  const [draft, setDraft] = useState<ReviewDraft>(EMPTY);
  const [proof, setProof] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) setDraft({ ...EMPTY, ...(JSON.parse(raw) as ReviewDraft) });
    } catch {
      // No saved draft.
    }
  }, []);

  const set = (patch: Partial<ReviewDraft>) => {
    setDraft((d) => {
      const next = { ...d, ...patch };
      try {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
      } catch {
        // Storage blocked: the draft lives only in this tab.
      }
      return next;
    });
  };

  const validate = (): string => {
    if (!draft.universityName.trim() || !draft.programme.trim()) return "Add the university and programme.";
    if (REVIEW_AREAS.some((a) => !draft.ratings[a.key])) return "Rate every area from 1 to 5.";
    if (!/^[A-Za-z][A-Za-z'-]{1,30} [A-Za-z]\.?$/.test(draft.displayName.trim())) return "Use your first name and the initial of your surname, for example 'Priya S'.";
    if (draft.verification === "university_email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.universityEmail ?? "")) return "Enter your university email address.";
    if (draft.verification === "document" && !proof) return "Upload your offer letter, student ID or degree certificate.";
    if (!agree) return "Please confirm the review is your own honest experience.";
    return "";
  };

  const submit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    if (!user?.uid) {
      setError("Sign in to submit a review.");
      return;
    }
    setError("");
    setState("sending");
    const ok = await submitReview(user.uid, draft, proof ?? undefined);
    if (ok) {
      setState("sent");
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // Nothing to clear.
      }
    } else setState("failed");
  };

  if (state === "sent") {
    return (
      <section style={{ ...panel, borderColor: "#86efac", background: "#f0fdf4" }}>
        <h2 style={{ ...h2, color: "#166534" }}>Thank you. Your review is waiting for verification.</h2>
        <p style={pText}>Our team checks your proof, deletes the document, and publishes the review with a verified badge. It does not appear until then. Positive and negative reviews are published alike.</p>
        <Link href="/account/study-abroad/reviews" style={{ color: ACCENT, fontWeight: 800 }}>Back to reviews →</Link>
      </section>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <section style={panel}>
        <h2 style={h2}>Where and what you studied</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          <label style={label}>University
            <input
              list="review-unis"
              value={draft.universityName}
              onChange={(e) => {
                const known = UNIVERSITIES.find((u) => u.name.toLowerCase() === e.target.value.toLowerCase());
                set({ universityName: e.target.value, universitySlug: known?.slug, countryCode: known?.countryCode });
              }}
              style={input}
            />
            <datalist id="review-unis">{UNIVERSITIES.map((u) => <option key={u.slug} value={u.name} />)}</datalist>
          </label>
          <label style={label}>Programme<input value={draft.programme} onChange={(e) => set({ programme: e.target.value })} placeholder="e.g. MS Computer Science" style={input} /></label>
          <label style={label}>You are a
            <select value={draft.role} onChange={(e) => set({ role: e.target.value as ReviewDraft["role"] })} style={input}>
              <option value="student">Current student</option>
              <option value="alumni">Graduate (alumni)</option>
            </select>
          </label>
          <label style={label}>Year you started<input value={draft.yearStarted} onChange={(e) => set({ yearStarted: e.target.value.replace(/[^0-9]/g, "").slice(0, 4) })} placeholder="e.g. 2024" style={input} /></label>
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Rate and explain</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {REVIEW_AREAS.map((a) => (
            <div key={a.key}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>{a.label}</span>
                <div style={{ display: "flex", gap: 4 }} role="radiogroup" aria-label={`${a.label} rating`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => set({ ratings: { ...draft.ratings, [a.key]: n } })} aria-pressed={draft.ratings[a.key] === n} style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${draft.ratings[a.key] === n ? ACCENT : "#cbd5e1"}`, background: draft.ratings[a.key] === n ? ACCENT : "#fff", color: draft.ratings[a.key] === n ? "#fff" : "#334155", fontWeight: 800, cursor: "pointer" }}>{n}</button>
                  ))}
                </div>
              </div>
              <textarea value={draft.answers[a.key] ?? ""} onChange={(e) => set({ answers: { ...draft.answers, [a.key]: e.target.value } })} placeholder={a.question} rows={2} style={{ ...input, marginTop: 6, resize: "vertical", fontFamily: "inherit" }} />
            </div>
          ))}
        </div>
      </section>

      <section style={panel}>
        <h2 style={h2}>Outcome (optional, for graduates)</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <label style={label}>First job title<input value={draft.outcome.jobTitle ?? ""} onChange={(e) => set({ outcome: { ...draft.outcome, jobTitle: e.target.value } })} style={input} /></label>
          <label style={label}>Salary band (local currency, yearly)<input value={draft.outcome.salaryBand ?? ""} onChange={(e) => set({ outcome: { ...draft.outcome, salaryBand: e.target.value } })} placeholder="e.g. 60,000-70,000" style={input} /></label>
          <label style={label}>Months to first job<input value={draft.outcome.monthsToJob ?? ""} onChange={(e) => set({ outcome: { ...draft.outcome, monthsToJob: e.target.value.replace(/[^0-9]/g, "") } })} style={input} /></label>
          <label style={label}>Stayed abroad?
            <select value={draft.outcome.stayedAbroad ?? ""} onChange={(e) => set({ outcome: { ...draft.outcome, stayedAbroad: e.target.value as "yes" | "no" | "" } })} style={input}>
              <option value="">Prefer not to say</option>
              <option value="yes">Yes</option>
              <option value="no">Returned to India</option>
            </select>
          </label>
        </div>
        <label style={{ ...label, marginTop: 10 }}>One thing I wish I knew before going<textarea value={draft.advice} onChange={(e) => set({ advice: e.target.value })} rows={2} style={{ ...input, resize: "vertical", fontFamily: "inherit" }} /></label>
      </section>

      <section style={panel}>
        <h2 style={h2}>Verify that you studied there</h2>
        <p style={pText}>Your real identity is never shown. Staff check your proof, then delete any document, and keep only a &quot;Verified student&quot; or &quot;Verified alumni&quot; badge.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <label style={radio}><input type="radio" checked={draft.verification === "university_email"} onChange={() => set({ verification: "university_email" })} style={{ accentColor: ACCENT }} /> University email address</label>
          <label style={radio}><input type="radio" checked={draft.verification === "document"} onChange={() => set({ verification: "document" })} style={{ accentColor: ACCENT }} /> Upload a document</label>
        </div>
        {draft.verification === "university_email" ? (
          <label style={label}>University email<input type="email" value={draft.universityEmail ?? ""} onChange={(e) => set({ universityEmail: e.target.value.trim() })} style={input} /></label>
        ) : (
          <label style={label}>Offer letter, student ID or degree certificate (PDF or image)
            <input type="file" accept=".pdf,image/*" onChange={(e) => setProof(e.target.files?.[0] ?? null)} style={{ fontSize: 13 }} />
          </label>
        )}
        <label style={{ ...label, marginTop: 10 }}>Name to show (first name and surname initial)<input value={draft.displayName} onChange={(e) => set({ displayName: e.target.value })} placeholder="e.g. Priya S" style={input} /></label>
        <label style={{ ...radio, marginTop: 10 }}>
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} style={{ accentColor: ACCENT }} />
          This is my own honest experience. I have not been paid or rewarded for it, and it contains no one else&apos;s personal details.
        </label>
      </section>

      {error && <p style={{ fontSize: 13.5, color: "#b91c1c", fontWeight: 700, margin: 0 }}>{error}</p>}
      {state === "failed" && (
        <p style={{ fontSize: 13.5, color: "#b45309", fontWeight: 700, margin: 0 }}>We couldn&apos;t send your review right now. Your draft is saved on this device; please try again later.</p>
      )}
      <button onClick={submit} disabled={state === "sending"} style={{ alignSelf: "flex-start", fontSize: 14, fontWeight: 800, color: "#fff", background: ACCENT, border: "none", borderRadius: 10, padding: "11px 18px", cursor: state === "sending" ? "wait" : "pointer" }}>
        {state === "sending" ? "Sending…" : "Submit for verification"}
      </button>
    </div>
  );
}

const panel: CSSProperties = { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "16px 18px" };
const h2: CSSProperties = { fontSize: 16, fontWeight: 900, color: "#0f172a", margin: "0 0 8px" };
const pText: CSSProperties = { fontSize: 13.5, color: "#475569", lineHeight: 1.6, margin: "0 0 6px" };
const label: CSSProperties = { display: "flex", flexDirection: "column", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#475569" };
const radio: CSSProperties = { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 13.5, color: "#1e293b", lineHeight: 1.5 };
const input: CSSProperties = { width: "100%", padding: "9px 11px", fontSize: 13.5, border: "1px solid #cbd5e1", borderRadius: 9, background: "#fff", color: "#0f172a", boxSizing: "border-box" };
