"use client";

/**
 * A public form (lib/enquiries/forms.ts): the school partnership enquiry on
 * the home page and /features/for-schools, and the privacy request on
 * /privacy/request. Checks in the browser with the same rules as the server,
 * posts to /api/enquiries/<kind>, and shows the reference number on success.
 * A hidden "website" field catches bots.
 */
import { useState } from "react";
import { FIELDS, TRAP, cleanEnquiry, type EnquiryKind } from "@/lib/enquiries/forms";
import "./enquiry.css";

/** `doneTitle` / `doneText` are plain text (server pages can't pass functions to this browser component). */
export function EnquiryForm({ kind, submitLabel, doneTitle, doneText }: { kind: EnquiryKind; submitLabel: string; doneTitle: string; doneText: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [trap, setTrap] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [id, setId] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanEnquiry(kind, values);
    if (!clean.ok) { setError(clean.error); return; }
    setError(""); setState("sending");
    try {
      const res = await fetch(`/api/enquiries/${kind}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...clean.data, [TRAP]: trap, page: `${location.pathname}${location.hash}` }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string; message?: string };
      if (!res.ok || !j.ok) throw new Error(j.error || j.message || "We couldn't send that just now - please try again.");
      setId(j.id ?? ""); setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't send that just now - please try again.");
      setState("idle");
    }
  };

  if (state === "sent") {
    return (
      <div className="enq enq-done" role="status">
        <b>{doneTitle}</b>{doneText}{id ? <> Your reference is <strong>{id}</strong>.</> : null}
      </div>
    );
  }

  return (
    <form className="enq" onSubmit={(e) => void submit(e)} noValidate>
      <div className="enq-grid">
        {FIELDS[kind].map((f) => {
          const common = {
            id: `enq-${kind}-${f.name}`, name: f.name, value: values[f.name] ?? "", maxLength: f.max, required: f.required,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setValues((v) => ({ ...v, [f.name]: e.target.value })),
          };
          return (
            <label key={f.name} htmlFor={common.id} className={f.type === "textarea" ? "enq-wide" : ""}>
              <span>{f.label}{f.required ? <i aria-hidden="true"> *</i> : null}</span>
              {f.type === "textarea" ? <textarea {...common} rows={4} placeholder={f.placeholder} />
                : f.type === "select" ? (
                  <select {...common}>
                    <option value="">Choose…</option>
                    {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                )
                : <input {...common} type={f.type ?? "text"} inputMode={f.type === "tel" ? "tel" : undefined} autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : undefined} placeholder={f.placeholder} />}
            </label>
          );
        })}
        {/* People never see this field; bots fill it in. */}
        <label className="enq-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(e) => setTrap(e.target.value)} name={TRAP} /></label>
      </div>
      {error && <p className="enq-err" role="alert">{error}</p>}
      <div className="enq-foot">
        <button type="submit" className="enq-btn" disabled={state === "sending"}>{state === "sending" ? "Sending…" : submitLabel}</button>
        <small>We use these details only to reply to you. See our <a href="/privacy">Privacy Policy</a>.</small>
      </div>
    </form>
  );
}

