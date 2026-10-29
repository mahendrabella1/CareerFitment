"use client";
/**
 * Spotlight (/account/spotlight/*): the shell with its tabs, the request form
 * every service page ends with, OneGrasp's contact card and the student's
 * own list of requests. Forms post to /api/boosters/request, which saves the
 * request and emails it to support@onegrasp.com.
 */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { useAuth } from "@/lib/auth/AuthProvider";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { FEATURES } from "@/lib/features/catalog";
import { CoursePlayerShell } from "@/components/course/CoursePlayerShell";
import { FILE_TYPES, FORMS, ONEGRASP, SERVICES, cleanRequest, fileProblem, issnAllowed, type FormId } from "@/lib/boosters/catalog";

export function SpotlightShell({ children }: { children: ReactNode }) {
  const meta = FEATURES.spotlight;
  const pathname = usePathname() ?? "";
  const { issnOk } = useSpotlightUser();
  const tabs = [
    { href: "/account/spotlight", label: "Overview" },
    { href: "/account/spotlight/conferences", label: "Conferences & papers" },
    { href: "/account/spotlight/writing", label: "Research writing" },
    { href: "/account/spotlight/isbn", label: "ISBN" },
    ...(issnOk ? [{ href: "/account/spotlight/issn", label: "ISSN" }] : []),
    { href: "/account/spotlight/magazine", label: "Awardees Magazine" },
  ];
  return (
    <CoursePlayerShell
      accent={meta.accent}
      banner={{ title: meta.title, icon: "sparkle", backHref: "/account", backLabel: "Dashboard" }}
      homeHref="/account/spotlight"
      tabs={tabs.map((t) => ({ ...t, active: pathname === t.href }))}
    >
      <style dangerouslySetInnerHTML={{ __html: SP_CSS }} />
      <div className="fp" style={{ ["--accent" as string]: meta.accent }}>{children}</div>
    </CoursePlayerShell>
  );
}

/** The signed-in person and whether ISSN help is open to them. */
export function useSpotlightUser() {
  const { profile } = useAuth();
  return { profile, issnOk: issnAllowed(profile?.category) };
}

export function PaidTag() {
  return <span className="sp-paid"><Icon name="wallet" size={13} stroke={2} /> Paid service</span>;
}

/** The service's request form. `preset` fills fields from outside (a conference picked from the list). */
export function RequestForm({ formId, preset, id }: { formId: FormId; preset?: Record<string, string>; id?: string }) {
  const spec = FORMS[formId];
  const { profile, refreshProfile } = useAuth();
  const [values, setValues] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ id: string; emailed: boolean } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => { if (preset) setValues((v) => ({ ...v, ...preset })); }, [preset]);

  const set = (name: string, v: string) => { setValues((x) => ({ ...x, [name]: v })); setError(""); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = cleanRequest(formId, values);
    if (!clean.ok) { setError(clean.error); return; }
    if (file) { const p = fileProblem(file.name, file.size); if (p) { setError(p); return; } }
    setState("sending"); setError("");
    try {
      const token = await getFirebaseAuth()?.currentUser?.getIdToken();
      if (!token) throw new Error("Please sign in again to send this.");
      const body = new FormData();
      body.append("form", formId);
      body.append("data", JSON.stringify(clean.data));
      if (file) body.append("file", file, file.name);
      const res = await fetch("/api/boosters/request", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body });
      const data = (await res.json().catch(() => ({}))) as { id?: string; emailed?: boolean; error?: string };
      if (!res.ok || !data.id) throw new Error(data.error || "It didn't send - please try again, or email us.");
      setResult({ id: data.id, emailed: !!data.emailed });
      setState("sent");
      void refreshProfile().catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "It didn't send - please try again.");
      setState("idle");
    }
  };

  if (state === "sent" && result) {
    const mail = `mailto:${ONEGRASP.email}?subject=${encodeURIComponent(`${spec.title} (${result.id})`)}&body=${encodeURIComponent(`Hello OneGrasp team,\n\nI've sent a request from my dashboard - reference ${result.id}.\n\n`)}`;
    return (
      <div className="sp-form is-sent" id={id}>
        <span className="sp-sent-ic"><Icon name="check" size={22} stroke={2.4} /></span>
        <h3>Request sent</h3>
        <p>Your reference is <b>{result.id}</b>. {result.emailed
          ? <>It&apos;s with the OneGrasp team at {ONEGRASP.email} - they&apos;ll reply to <b>{profile?.email || "your email"}</b> with the fee and the next steps.</>
          : <>It&apos;s saved with the team. To be sure it&apos;s seen quickly, also <a href={mail} className="fp-link">email {ONEGRASP.email}</a> with this reference.</>}</p>
        <button type="button" className="fp-btn fp-btn-sm" onClick={() => { setState("idle"); setResult(null); setValues(preset ?? {}); setFile(null); }}>Send another</button>
      </div>
    );
  }

  return (
    <form className="sp-form" id={id} onSubmit={(e) => void submit(e)} noValidate>
      <div className="sp-form-h">
        <div><h3>{spec.title}</h3><p>{spec.intro}</p></div>
        <PaidTag />
      </div>
      {profile && (
        <p className="sp-from"><Icon name="user" size={14} stroke={2} /> Sent as <b>{profile.name || "you"}</b> · {profile.email}{profile.phone ? ` · ${profile.phone}` : ""}</p>
      )}
      <div className="sp-fields">
        {spec.fields.map((f) => {
          const v = values[f.name] ?? "";
          const fid = `${formId}-${f.name}`;
          const wide = f.kind === "textarea" || f.name === "conference" || f.name === "authors" || f.name === "title";
          return (
            <label key={f.name} htmlFor={fid} className={`sp-field${wide ? " is-wide" : ""}`}>
              <span>{f.label}{f.required ? <i aria-hidden="true"> *</i> : <small> (optional)</small>}</span>
              {f.kind === "textarea" ? (
                <textarea id={fid} value={v} maxLength={f.max} rows={f.name === "abstract" || f.name === "summary" ? 7 : 3} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />
              ) : f.kind === "select" ? (
                <select id={fid} value={v} onChange={(e) => set(f.name, e.target.value)}>
                  <option value="">Choose...</option>
                  {f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input id={fid} type={f.kind === "date" ? "date" : f.kind === "url" ? "url" : "text"} value={v} maxLength={f.max} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />
              )}
              {f.hint && <small className="sp-hint">{f.hint}</small>}
            </label>
          );
        })}
        <div className="sp-field is-wide">
          <span>{spec.file} <small>(optional, up to 4 MB)</small></span>
          <div className="sp-file">
            <input ref={fileInput} type="file" accept={FILE_TYPES.join(",")} onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }} />
            {file && <button type="button" className="fp-link" style={{ fontSize: 13 }} onClick={() => { setFile(null); if (fileInput.current) fileInput.current.value = ""; }}>Remove</button>}
          </div>
        </div>
      </div>
      {error && <p className="sp-err" role="alert"><Icon name="info" size={14} stroke={2} /> {error}</p>}
      <div className="sp-form-f">
        <button type="submit" className="fp-btn fp-btn-pri" disabled={state === "sending"}>{state === "sending" ? "Sending..." : "Send to the OneGrasp team"}</button>
        <small>Sending a request is free. It goes to {ONEGRASP.email}; the team replies with the fee and the next steps.</small>
      </div>
    </form>
  );
}

export function ContactCard() {
  return (
    <div className="sp-contact">
      <div>
        <span className="fp-kicker" style={{ border: 0, padding: 0 }}>Talk to OneGrasp</span>
        <p>Questions before you send anything? Write or call - quote your reference if you have one.</p>
      </div>
      <ul>
        <li><Icon name="doc" size={15} stroke={2} /><a href={`mailto:${ONEGRASP.email}`}>{ONEGRASP.email}</a></li>
        <li><Icon name="phone" size={15} stroke={2} /><a href={`tel:${ONEGRASP.tel}`}>{ONEGRASP.phones.join(" / ").replace(/ \/ \+91 89777 604(\d\d)/g, " / $1")}</a></li>
        <li><Icon name="answer" size={15} stroke={2} /><a href={ONEGRASP.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp us</a></li>
        <li><Icon name="globe" size={15} stroke={2} /><a href={ONEGRASP.events} target="_blank" rel="noopener noreferrer">onegrasp.com/events</a></li>
      </ul>
    </div>
  );
}

const fmt = (ms: number) => new Date(ms).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** The requests this student has sent (newest first), written by the server. */
export function MyRequests() {
  const { profile } = useAuth();
  const list = ((profile as unknown as { boosterRequests?: { id: string; form: FormId; title: string; at: number }[] })?.boosterRequests ?? []).filter((r) => FORMS[r.form]);
  if (!list.length) return null;
  return (
    <section className="fp-sec">
      <div className="fp-sec-h"><div><h2>Your requests</h2><p>Replies come by email. Quote the reference when you write or call.</p></div></div>
      <div className="sp-reqs">
        {list.map((r) => {
          const svc = SERVICES.find((s) => s.id === FORMS[r.form].service);
          return (
            <div key={r.id} className="sp-req">
              <Icon name={svc?.icon ?? "doc"} size={16} stroke={2} />
              <span><b>{r.title}</b><small>{svc?.title} · sent {fmt(r.at)}</small></span>
              <code>{r.id}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** "Tell us about it" section heading + form. */
export function RequestSection({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <section className="fp-sec" id="request">
      <div className="fp-sec-h"><div><h2>{title}</h2><p>{text}</p></div></div>
      {children}
    </section>
  );
}

/** A two-column list of official facts (question - answer). */
export function Facts({ items }: { items: { q: string; a: string }[] }) {
  return (
    <dl className="sp-facts">
      {items.map((f) => <div key={f.q}><dt>{f.q}</dt><dd>{f.a}</dd></div>)}
    </dl>
  );
}

export function ServiceLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="fp-link">{children} <Icon name="arrowRight" size={15} stroke={2} /></Link>;
}

export const SP_CSS = `
.sp-paid{display:inline-flex;align-items:center;gap:5px;flex:none;height:24px;padding:0 9px;border-radius:999px;font-size:12px;font-weight:700;color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,#fff);border:1px solid color-mix(in srgb,var(--accent) 26%,#fff);white-space:nowrap}
.sp-form{background:#fff;border:1px solid var(--line);border-radius:8px;padding:20px;scroll-margin-top:150px}
.sp-form-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.sp-form-h h3{margin:0;font-size:17px;font-weight:600}
.sp-form-h p{margin:4px 0 0;font-size:14px;line-height:1.55;color:var(--ink2);max-width:680px}
.sp-from{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:14px 0 0;padding:8px 12px;background:var(--soft);border-radius:6px;font-size:13px;color:var(--ink2)}
.sp-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 16px;margin-top:16px}
.sp-field{display:flex;flex-direction:column;gap:5px;min-width:0}
.sp-field.is-wide{grid-column:1/-1}
.sp-field>span{font-size:13.5px;font-weight:600;color:var(--ink)}
.sp-field>span i{font-style:normal;color:#b91c1c}
.sp-field>span small{font-weight:400;color:var(--mute)}
.sp-field input:not([type=file]),.sp-field select,.sp-field textarea{width:100%;box-sizing:border-box;border:1px solid var(--line2);border-radius:6px;padding:9px 11px;font:inherit;font-size:14px;color:var(--ink);background:#fff}
.sp-field input,.sp-field select{height:40px;padding-top:0;padding-bottom:0}
.sp-field textarea{resize:vertical;line-height:1.5}
.sp-field input:focus,.sp-field select:focus,.sp-field textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.sp-hint{font-size:12.5px;color:var(--mute)}
.sp-file{display:flex;align-items:center;gap:12px;flex-wrap:wrap;font-size:13.5px}
.sp-file input{max-width:100%;font-size:13.5px}
.sp-err{display:flex;gap:6px;align-items:flex-start;margin:14px 0 0;padding:9px 12px;border-radius:6px;background:#fef2f2;color:#991b1b;font-size:13.5px}
.sp-err svg{flex:none;margin-top:2px}
.sp-form-f{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap;margin-top:18px;padding-top:16px;border-top:1px solid #f0ede8}
.sp-form-f small{font-size:12.5px;color:var(--mute);flex:1 1 260px}
.sp-form.is-sent{text-align:center;padding:30px 20px}
.sp-form.is-sent h3{margin:10px 0 6px;font-size:18px}
.sp-form.is-sent p{margin:0 auto 16px;max-width:560px;font-size:14px;line-height:1.6;color:var(--ink2)}
.sp-sent-ic{display:inline-grid;place-items:center;width:44px;height:44px;border-radius:50%;background:#ecfdf3;color:#166534}
.sp-contact{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px 24px;align-items:center;padding:18px 20px;background:#fff;border:1px solid var(--line);border-radius:8px}
.sp-contact p{margin:6px 0 0;font-size:14px;line-height:1.5;color:var(--ink2)}
.sp-contact ul{list-style:none;margin:0;padding:0;display:grid;gap:8px;font-size:14px}
.sp-contact li{display:flex;align-items:center;gap:8px;color:var(--mute)}
.sp-contact a{color:var(--ink);font-weight:600;text-decoration:none}
.sp-contact a:hover{color:var(--accent)}
.sp-reqs{background:#fff;border:1px solid var(--line);border-radius:8px}
.sp-req{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid #f0ede8;color:var(--accent)}
.sp-req:first-child{border-top:0}
.sp-req span{flex:1;min-width:0;color:var(--ink)}
.sp-req b{display:block;font-size:14px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sp-req small{display:block;font-size:12.5px;color:var(--mute)}
.sp-req code{font-size:12.5px;color:var(--ink2);background:var(--soft);padding:3px 7px;border-radius:5px}
.sp-facts{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:10px;margin:0}
.sp-facts>div{padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px}
.sp-facts dt{font-size:14.5px;font-weight:600;color:var(--ink)}
.sp-facts dd{margin:5px 0 0;font-size:13.5px;line-height:1.55;color:var(--ink2)}
.sp-two{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
.sp-box{padding:16px 18px;background:#fff;border:1px solid var(--line);border-radius:8px}
.sp-box h3{margin:0 0 8px;font-size:15.5px;font-weight:600}
.sp-box ul,.sp-box ol{margin:0;padding-left:18px;font-size:14px;line-height:1.6;color:var(--ink2)}
.sp-box li+li{margin-top:4px}
.sp-box p{margin:0;font-size:14px;line-height:1.6;color:var(--ink2)}
.sp-box.is-yes{border-top:3px solid #16a34a}
.sp-box.is-no{border-top:3px solid #a1a1aa}
.sp-note{display:flex;gap:10px;align-items:flex-start;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 6%,#fff);border:1px solid color-mix(in srgb,var(--accent) 22%,#fff);font-size:14px;line-height:1.55;color:var(--ink2)}
.sp-note svg{flex:none;color:var(--accent);margin-top:2px}
.sp-steps{list-style:none;margin:0;padding:0;display:grid;gap:8px;counter-reset:s}
.sp-steps li{counter-increment:s;display:grid;grid-template-columns:30px minmax(0,1fr);gap:10px;align-items:start;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:8px;font-size:14px;line-height:1.55;color:var(--ink2)}
.sp-steps li::before{content:counter(s);display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent);font-weight:700;font-size:13px}
.sp-offic{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:6px 18px;margin:0;padding:14px 16px;background:var(--soft);border-radius:8px;font-size:13.5px;line-height:1.5;color:var(--ink2)}
.sp-offic b{color:var(--ink)}
.sp-offic a{color:var(--ink);font-weight:600}
@media (max-width:760px){.sp-fields,.sp-two{grid-template-columns:minmax(0,1fr)}.sp-contact{grid-template-columns:minmax(0,1fr)}.sp-form-h{flex-direction:column}}
`;
