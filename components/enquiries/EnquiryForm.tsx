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
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <b>{doneTitle}</b>{doneText}{id ? <> Your reference is <strong>{id}</strong>.</> : null}
      </div>
    );
  }

  return (
    <form className="enq" onSubmit={(e) => void submit(e)} noValidate>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
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

const CSS = `
.enq{--ink:#1c1917;--ink2:#57534e;--line:#d6d3d1;--acc:#db3433;font-family:Inter,system-ui,sans-serif;color:var(--ink)}
.enq-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px}
.enq label{display:flex;flex-direction:column;gap:6px;font-size:14px;font-weight:600;min-width:0}
.enq label i{color:var(--acc);font-style:normal}
.enq input,.enq select,.enq textarea{font:inherit;font-weight:400;font-size:15px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--ink);width:100%;box-sizing:border-box}
.enq input:focus,.enq select:focus,.enq textarea:focus{outline:2px solid color-mix(in srgb,var(--acc) 40%,transparent);outline-offset:1px;border-color:var(--acc)}
.enq textarea{resize:vertical;min-height:96px}
.enq .enq-wide{grid-column:1/-1}
.enq .enq-trap{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.enq-err{color:#b42318;font-size:14px;margin:12px 0 0}
.enq-foot{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin-top:16px}
.enq-foot small{font-size:12.5px;color:var(--ink2)}
.enq-foot small a{color:inherit}
.enq-btn{font:inherit;font-weight:700;font-size:15.5px;padding:12px 22px;border-radius:10px;border:0;background:var(--acc);color:#fff;cursor:pointer}
.enq-btn:disabled{opacity:.7;cursor:default}
.enq-done{border:1px solid #bbf7d0;background:#f0fdf4;border-radius:12px;padding:18px 20px;font-size:15.5px;line-height:1.6}
.enq-done b{display:block;font-size:17px;margin-bottom:4px}
@media (max-width:640px){.enq-grid{grid-template-columns:1fr}}
`;
