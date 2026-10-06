"use client";

/**
 * /admin/institutions - create the logins schools and colleges use for the
 * institution portal (/institution), where they track their own students'
 * progress and time spent, and send them messages and reminders.
 *
 * A student belongs to an institution when the `institution` on their
 * profile equals the institution's name or one of its aliases - the same
 * field the school registration links set and the Users page assigns.
 *
 * Everything goes through /api/admin/institutions (Admin SDK): creating a
 * Firebase Auth login for someone else isn't possible from the browser
 * without signing the admin out.
 *
 * Auth is handled by the parent app/admin/layout.tsx.
 */

import { useEffect, useMemo, useState } from "react";
import { C } from "@/app/account/viz";
import { Icon } from "@/app/Icons";
import { apiFetch } from "@/lib/institution/client";
import { HowItWorks } from "@/components/HowItWorks";
import type { Institution, InstitutionAccount } from "@/lib/institution/types";

type Row = Institution & { students: number; accounts: InstitutionAccount[] };
interface Data { institutions: Row[]; knownSchools: { name: string; students: number }[] }
interface Created { username: string; password: string; institution: string }

function makePassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const pick = (n: number) => Array.from(crypto.getRandomValues(new Uint32Array(n)), (x) => chars[x % chars.length]).join("");
  return `${pick(4)}-${pick(4)}-${pick(4)}`;
}

function suggestUsername(name: string): string {
  const words = name.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(Boolean);
  const base = words.length > 2 ? words.map((w) => w[0]).join("") : words.join(".");
  return (base || "school").slice(0, 24);
}

/** Same comparison as lib/institution/server.ts normName(): spacing and capitals ignored. */
const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

const fmtDate = (t?: number) => (t ? new Date(t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-");

export default function AdminInstitutionsPage() {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);
  const [form, setForm] = useState<null | { institutionId?: string; institutionName?: string }>(null);

  async function load() {
    try {
      setData(await apiFetch<Data>("/api/admin/institutions"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load institutions.");
    }
  }
  useEffect(() => { void load(); }, []);

  async function patch(body: Record<string, unknown>, okMsg?: string) {
    setError("");
    try {
      await apiFetch("/api/admin/institutions", { method: "PATCH", body: JSON.stringify(body) });
      await load();
      if (okMsg) alertOk(okMsg);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That didn't work.");
    }
  }
  const [ok, setOk] = useState("");
  function alertOk(m: string) { setOk(m); setTimeout(() => setOk((x) => (x === m ? "" : x)), 3500); }

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: C.ink, margin: "0 0 6px" }}>Institution logins</h1>
          <p style={{ fontSize: 14, color: C.ink3, margin: 0, lineHeight: 1.55 }}>
            Give a school or college its own login to the institution portal at <b>/institution</b>. They see only their own
            students - assessment status and results, time spent, course progress - and can send them messages, reminders and alerts.
          </p>
        </div>
        {!form && <button style={S.btn} onClick={() => { setForm({}); setCreated(null); }}>+ New institution login</button>}
      </div>
      <HowItWorks id="admin-institutions" accent="#E23B41" steps={[
        "Press '+ New institution login', pick the school's name from the list of names students typed (with how many students each has), and add any other spellings so every student is linked.",
        "Choose a username and password and press Create login - the password is shown once, so share it privately with the school.",
        "The school signs in at /institution with that username. Use Reset password, Switch off or Delete on a login at any time.",
        "'Open portal' shows you that school's portal exactly as they see it, in a new tab - useful when they ask for help. Your visit doesn't mark anything as read for them.",
      ]} sync="Message schools and their students, and answer schools' support questions, from Messages in this sidebar." />

      {error && <div style={S.error}><Icon name="xcircle" size={16} /> {error}</div>}
      {ok && <div style={S.ok}><Icon name="check" size={16} /> {ok}</div>}
      {created && <CreatedCard c={created} onClose={() => setCreated(null)} />}

      {form && data && (
        <CreateForm
          data={data}
          institutionId={form.institutionId}
          institutionName={form.institutionName}
          onCancel={() => setForm(null)}
          onCreated={async (c) => { setForm(null); setCreated(c); await load(); }}
          onError={setError}
        />
      )}

      {data === null && !error ? (
        <div style={S.empty}>Loading…</div>
      ) : data && data.institutions.length === 0 ? (
        <div style={S.empty}>No institution logins yet. Create one for a school whose students are already registered - pick its name from the list.</div>
      ) : (
        data?.institutions.map((inst) => (
          <InstitutionCard
            key={inst.id}
            inst={inst}
            knownSchools={data.knownSchools}
            onAddLogin={() => { setCreated(null); setForm({ institutionId: inst.id, institutionName: inst.name }); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            onPatch={patch}
            onPassword={(uid, username) => {
              const password = makePassword();
              void patch({ action: "password", uid, password }).then(() => setCreated({ username, password, institution: inst.name }));
            }}
          />
        ))
      )}
    </div>
  );
}

function CreatedCard({ c, onClose }: { c: Created; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/institution` : "/institution";
  const text = `OneGrasp institution portal - ${c.institution}\nSign in at: ${url}\nUsername: ${c.username}\nPassword: ${c.password}`;
  return (
    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 14, padding: 18, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <Icon name="check" size={18} style={{ color: C.good }} />
        <b style={{ fontSize: 15, color: C.ink }}>Login ready for {c.institution}</b>
        <span style={{ flex: 1 }} />
        <button onClick={onClose} style={S.linkBtn}>Done</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: "6px 12px", fontSize: 14, color: C.ink2 }}>
        <span style={{ color: C.ink3 }}>Sign in at</span><code>{url}</code>
        <span style={{ color: C.ink3 }}>Username</span><code style={{ fontWeight: 700 }}>{c.username}</code>
        <span style={{ color: C.ink3 }}>Password</span><code style={{ fontWeight: 700 }}>{c.password}</code>
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14, flexWrap: "wrap" }}>
        <button style={S.btn} onClick={() => { navigator.clipboard.writeText(text).then(() => setCopied(true)).catch(() => setCopied(false)); }}>
          {copied ? "Copied ✓" : "Copy login details"}
        </button>
        <span style={{ fontSize: 12.5, color: C.ink3 }}>The password is shown only now - share it with the institution privately. You can reset it any time.</span>
      </div>
    </div>
  );
}

function CreateForm({ data, institutionId, institutionName, onCancel, onCreated, onError }: {
  data: Data; institutionId?: string; institutionName?: string;
  onCancel: () => void; onCreated: (c: Created) => void; onError: (m: string) => void;
}) {
  const existing = !!institutionId;
  const taken = useMemo(() => new Set(data.institutions.flatMap((i) => [i.name, ...(i.aliases ?? [])]).map(norm)), [data]);
  const [f, setF] = useState({ name: "", aliases: "", contactName: "", contactEmail: "", contactPhone: "", displayName: "", username: institutionName ? `${suggestUsername(institutionName)}.2` : "", password: makePassword() });
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const nameStudents = data.knownSchools.find((s) => norm(s.name) === norm(f.name))?.students ?? 0;
  const aliasOptions = data.knownSchools.filter((s) => norm(s.name) !== norm(f.name) && !taken.has(norm(s.name)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    onError("");
    setSaving(true);
    try {
      const res = await apiFetch<{ institution: Institution; account: InstitutionAccount }>("/api/admin/institutions", {
        method: "POST",
        body: JSON.stringify(existing
          ? { institutionId, username: f.username, password: f.password, displayName: f.displayName }
          : { ...f, aliases: f.aliases.split("\n") }),
      });
      onCreated({ username: res.account.username, password: f.password, institution: res.institution.name });
    } catch (err) {
      onError(err instanceof Error ? err.message : "Could not create the login.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} style={S.card}>
      <h2 style={{ fontSize: 16, fontWeight: 800, margin: "0 0 14px", color: C.ink }}>{existing ? `Another login for ${institutionName}` : "New institution login"}</h2>
      {!existing && (
        <>
          <div style={S.grid2} className="og-inst-grid">
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={S.label}>Institution name - exactly as on students&apos; profiles</label>
              <input style={S.input} list="og-known-schools" value={f.name} required
                onChange={(e) => { set("name", e.target.value); if (!f.username || f.username === suggestUsername(f.name)) set("username", suggestUsername(e.target.value)); }}
                placeholder="Start typing - schools already in use are suggested" />
              <datalist id="og-known-schools">
                {data.knownSchools.filter((s) => !taken.has(norm(s.name))).map((s) => <option key={s.name} value={s.name}>{s.students} students</option>)}
              </datalist>
              <div style={S.hint}>{f.name.trim() ? `${nameStudents} registered student${nameStudents === 1 ? " has" : "s have"} this name on their profile (spacing and capitals don't matter).` : "Students are linked by this name - pick it from the list so it matches."}</div>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={S.label}>Other spellings students used (optional, one per line)</label>
              <textarea style={{ ...S.input, minHeight: 64, fontFamily: "inherit" }} value={f.aliases} onChange={(e) => set("aliases", e.target.value)}
                placeholder={"e.g. SVCK\nSri Venkateswara College of Engineering, Kadapa"} />
              {aliasOptions.length > 0 && f.name.trim().length >= 3 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {aliasOptions.filter((s) => similar(s.name, f.name)).slice(0, 8).map((s) => (
                    <button type="button" key={s.name} style={S.chip} onClick={() => set("aliases", [...f.aliases.split("\n").filter(Boolean), s.name].join("\n"))}>
                      + {s.name} <span style={{ color: C.muted }}>({s.students})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div><label style={S.label}>Contact person</label><input style={S.input} value={f.contactName} onChange={(e) => set("contactName", e.target.value)} /></div>
            <div><label style={S.label}>Contact email</label><input style={S.input} type="email" value={f.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} /></div>
            <div><label style={S.label}>Contact phone</label><input style={S.input} value={f.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} /></div>
          </div>
          <div style={{ height: 1, background: C.line, margin: "16px 0" }} />
        </>
      )}
      <div style={S.grid2} className="og-inst-grid">
        <div><label style={S.label}>Login name shown in the portal</label><input style={S.input} value={f.displayName} onChange={(e) => set("displayName", e.target.value)} placeholder="e.g. Principal, Career Counsellor" /></div>
        <div>
          <label style={S.label}>Username</label>
          <input style={S.input} value={f.username} required onChange={(e) => set("username", e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ""))} placeholder="e.g. svhs.principal" />
          <div style={S.hint}>Lowercase letters, numbers, dot, dash, underscore.</div>
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={S.label}>Password</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={{ ...S.input, fontFamily: "monospace" }} value={f.password} required minLength={8} onChange={(e) => set("password", e.target.value)} />
            <button type="button" style={S.ghostBtn} onClick={() => set("password", makePassword())}>Generate</button>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <button type="submit" disabled={saving} style={{ ...S.btn, opacity: saving ? 0.6 : 1 }}>{saving ? "Creating…" : "Create login"}</button>
        <button type="button" onClick={onCancel} style={S.ghostBtn}>Cancel</button>
      </div>
      <style>{`@media (max-width: 640px){.og-inst-grid{grid-template-columns:1fr !important}}`}</style>
    </form>
  );
}

/** Loose match for suggesting aliases: shares a significant word or an acronym. */
function similar(a: string, b: string): boolean {
  const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w.length > 3 && !["school", "college", "high", "public", "institute", "university", "engineering", "technology"].includes(w));
  const wa = new Set(words(a)), wb = words(b);
  const acr = (s: string) => s.split(/\s+/).filter(Boolean).map((w) => w[0]).join("").toLowerCase();
  return wb.some((w) => wa.has(w)) || acr(b) === a.toLowerCase().replace(/[^a-z]/g, "") || acr(a) === b.toLowerCase().replace(/[^a-z]/g, "");
}

function InstitutionCard({ inst, knownSchools, onAddLogin, onPatch, onPassword }: {
  inst: Row; knownSchools: Data["knownSchools"];
  onAddLogin: () => void; onPatch: (b: Record<string, unknown>, ok?: string) => Promise<void>; onPassword: (uid: string, username: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [e, setE] = useState({ name: inst.name, aliases: (inst.aliases ?? []).join("\n"), contactName: inst.contactName ?? "", contactEmail: inst.contactEmail ?? "", contactPhone: inst.contactPhone ?? "" });
  const counts = new Map(knownSchools.map((s) => [norm(s.name), s.students]));
  return (
    <section style={{ ...S.card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <span style={S.instIc}><Icon name="school" size={20} /></span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: C.ink }}>{inst.name}</div>
          <div style={{ fontSize: 12.5, color: C.ink3, marginTop: 3 }}>
            <b style={{ color: C.ink2 }}>{inst.students}</b> linked student{inst.students === 1 ? "" : "s"}
            {[inst.contactName, inst.contactEmail, inst.contactPhone].filter(Boolean).length > 0 && <> · {[inst.contactName, inst.contactEmail, inst.contactPhone].filter(Boolean).join(" · ")}</>}
          </div>
          {(inst.aliases ?? []).length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
              {inst.aliases.map((a) => <span key={a} style={S.aliasChip}>{a} <span style={{ color: C.muted }}>({counts.get(norm(a)) ?? 0})</span></span>)}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a style={{ ...S.ghostSm, textDecoration: "none" }} href={`/institution?as=${inst.id}`} target="_blank" rel="noreferrer" title="See exactly what this institution sees, in a new tab">Open portal ↗</a>
          <button style={S.ghostSm} onClick={() => setEditing((v) => !v)}>{editing ? "Close" : "Edit names"}</button>
          <button style={S.ghostSm} onClick={onAddLogin}>+ Add login</button>
        </div>
      </div>
      {editing && (
        <div style={{ padding: "0 18px 16px" }}>
          <div style={S.grid2} className="og-inst-grid">
            <div style={{ gridColumn: "1 / -1" }}><label style={S.label}>Name</label><input style={S.input} value={e.name} onChange={(ev) => setE({ ...e, name: ev.target.value })} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label style={S.label}>Other spellings (one per line)</label><textarea style={{ ...S.input, minHeight: 64, fontFamily: "inherit" }} value={e.aliases} onChange={(ev) => setE({ ...e, aliases: ev.target.value })} /></div>
            <div><label style={S.label}>Contact person</label><input style={S.input} value={e.contactName} onChange={(ev) => setE({ ...e, contactName: ev.target.value })} /></div>
            <div><label style={S.label}>Contact email</label><input style={S.input} value={e.contactEmail} onChange={(ev) => setE({ ...e, contactEmail: ev.target.value })} /></div>
            <div><label style={S.label}>Contact phone</label><input style={S.input} value={e.contactPhone} onChange={(ev) => setE({ ...e, contactPhone: ev.target.value })} /></div>
          </div>
          <button style={{ ...S.btn, marginTop: 12 }} onClick={() => void onPatch({ action: "institution", id: inst.id, ...e, aliases: e.aliases.split("\n") }, "Saved.").then(() => setEditing(false))}>Save</button>
        </div>
      )}
      <div style={{ borderTop: `1px solid ${C.line}`, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.line2 }}>
              {["Login", "Username", "Status", "Last sign-in", ""].map((h) => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {inst.accounts.map((a) => (
              <tr key={a.uid} style={{ borderTop: `1px solid ${C.line}` }}>
                <td style={S.td}><b>{a.displayName}</b><div style={{ fontSize: 11.5, color: C.muted }}>created {fmtDate(a.createdAt)}</div></td>
                <td style={{ ...S.td, fontFamily: "monospace" }}>{a.username}</td>
                <td style={S.td}><span style={{ ...S.pill, ...(a.active ? { background: C.goodTint, color: C.good } : { background: C.line2, color: C.muted }) }}>{a.active ? "Active" : "Switched off"}</span></td>
                <td style={S.td}>{fmtDate(a.lastLoginAt)}</td>
                <td style={{ ...S.td, textAlign: "right", whiteSpace: "nowrap" }}>
                  <button style={S.linkBtn} onClick={() => onPassword(a.uid, a.username)}>Reset password</button>
                  <button style={{ ...S.linkBtn, color: a.active ? C.redStrong : C.good }} onClick={() => void onPatch({ action: "active", uid: a.uid, active: !a.active }, a.active ? "Login switched off." : "Login switched on.")}>
                    {a.active ? "Switch off" : "Switch on"}
                  </button>
                  <DeleteButton onConfirm={() => void onPatch({ action: "delete", uid: a.uid }, "Login deleted.")} />
                </td>
              </tr>
            ))}
            {inst.accounts.length === 0 && <tr><td colSpan={5} style={{ ...S.td, color: C.muted }}>No logins - add one.</td></tr>}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button style={{ ...S.linkBtn, color: C.muted }} onClick={() => setAsk(true)}>Delete</button>;
  return (
    <span style={{ fontSize: 12.5, color: C.ink2, marginLeft: 8 }}>
      Delete this login?{" "}
      <button style={{ ...S.linkBtn, color: C.redStrong }} onClick={() => { setAsk(false); onConfirm(); }}>Yes, delete</button>
      <button style={S.linkBtn} onClick={() => setAsk(false)}>Keep</button>
    </span>
  );
}

const S: Record<string, React.CSSProperties> = {
  card: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 18 },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  label: { display: "block", fontSize: 12, fontWeight: 700, color: C.ink3, marginBottom: 6 },
  hint: { fontSize: 12, color: C.muted, marginTop: 5 },
  input: { width: "100%", boxSizing: "border-box", border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 12px", fontSize: 14, color: C.ink },
  btn: { background: C.red, color: "#fff", border: "none", borderRadius: 9, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" },
  ghostBtn: { background: "#fff", border: `1px solid ${C.line}`, color: C.ink2, borderRadius: 9, padding: "10px 16px", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  ghostSm: { background: "#fff", border: `1px solid ${C.line}`, color: C.ink2, borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  linkBtn: { background: "none", border: "none", color: C.ink2, fontSize: 12.5, fontWeight: 700, cursor: "pointer", padding: "4px 6px" },
  chip: { background: "#fff", border: `1px dashed ${C.faint}`, borderRadius: 999, padding: "4px 10px", fontSize: 12, color: C.ink2, cursor: "pointer" },
  aliasChip: { background: C.line2, borderRadius: 999, padding: "3px 10px", fontSize: 12, color: C.ink2 },
  instIc: { width: 40, height: 40, borderRadius: 11, background: C.redTint, color: C.red, display: "grid", placeItems: "center", flex: "none" },
  th: { textAlign: "left", padding: "9px 14px", fontSize: 11, fontWeight: 800, color: C.ink3, textTransform: "uppercase", letterSpacing: ".05em" },
  td: { padding: "10px 14px", color: C.ink2, verticalAlign: "middle" },
  pill: { display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 },
  error: { display: "flex", alignItems: "center", gap: 8, background: C.redTint, border: `1px solid ${C.redLine}`, color: C.redStrong, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, fontWeight: 600 },
  ok: { display: "flex", alignItems: "center", gap: 8, background: C.goodTint, border: "1px solid #bbf7d0", color: C.good, borderRadius: 10, padding: "10px 14px", fontSize: 13, marginBottom: 16, fontWeight: 600 },
  empty: { background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 28, textAlign: "center", color: C.muted, fontSize: 14 },
};
