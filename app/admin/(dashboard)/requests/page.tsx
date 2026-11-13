"use client";

/**
 * /admin/requests - everything people have asked the team for:
 *   - Spotlight requests from the dashboard (ISBN, ISSN, publishing, writing, magazine; lib/boosters),
 *   - school partnership enquiries (home page and /features/for-schools),
 *   - privacy requests (see / correct / delete my data, /privacy/request).
 * Newest first, filter by status, set a status and an internal note
 * (app/api/admin/requests). Each was also emailed to the team when it came in.
 */
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/institution/client";
import { STATUSES } from "@/lib/enquiries/forms";

type Kind = "spotlight" | "school" | "privacy";
interface Item {
  id: string; at: number; status?: string; note?: string; emailed?: boolean; page?: string;
  data?: Record<string, string>; title?: string; service?: string; file?: { name: string } | null;
  who?: { name?: string; email?: string; phone?: string; category?: string; institution?: string };
}

const TABS: { kind: Kind; label: string; help: string }[] = [
  { kind: "spotlight", label: "Spotlight", help: "Paid-service requests from students' dashboards. The file they attached came with the email." },
  { kind: "school", label: "School enquiries", help: "Schools and colleges asking to work with OneGrasp, from the home page and the For schools page." },
  { kind: "privacy", label: "Privacy requests", help: "Requests to see, correct or delete data. Before acting, reply from support@onegrasp.com to the email on the account to confirm it's really them (or their parent). The law expects a reply without undue delay." },
];
const STATUS_COLOR: Record<string, string> = { new: "#b42318", contacted: "#9a3412", done: "#166534", closed: "#63636f" };
const human = (k: string) => k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const when = (ms: number) => new Date(ms).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function RequestsPage() {
  const [kind, setKind] = useState<Kind>("school");
  const [items, setItems] = useState<Item[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState("");
  const [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async (k: Kind) => {
    setItems(null); setErr("");
    try {
      const r = await apiFetch<{ items: Item[]; counts: Record<string, number> }>(`/api/admin/requests?kind=${k}`);
      setItems(r.items); setCounts(r.counts);
    } catch (e) { setErr(e instanceof Error ? e.message : "Couldn't load the requests."); }
  }, []);
  useEffect(() => { void load(kind); }, [kind, load]);

  const save = async (it: Item, patch: { status?: string; note?: string }) => {
    try {
      await apiFetch("/api/admin/requests", { method: "PATCH", body: JSON.stringify({ kind, id: it.id, ...patch }) });
      setItems((xs) => xs?.map((x) => (x.id === it.id ? { ...x, ...patch } : x)) ?? null);
      if (patch.status) setCounts((c) => ({ ...c, [kind]: Math.max(0, (c[kind] ?? 0) + (patch.status === "new" ? 1 : it.status === "new" ? -1 : 0)) }));
    } catch (e) { setErr(e instanceof Error ? e.message : "Couldn't save."); }
  };

  const tab = TABS.find((t) => t.kind === kind)!;
  const shown = (items ?? []).filter((x) => !filter || (x.status ?? "new") === filter);

  return (
    <div style={{ maxWidth: 1000 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Requests</h1>
      <p style={{ margin: "4px 0 16px", color: "#63636f", fontSize: 14 }}>What students, schools and parents have asked the team for. Each one was also emailed to the team inbox when it arrived.</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid #e4e4e7", marginBottom: 14 }}>
        {TABS.map((t) => (
          <button key={t.kind} onClick={() => { setKind(t.kind); setFilter(""); setOpen(null); }}
            style={{ border: 0, background: "none", font: "inherit", fontWeight: 600, fontSize: 14.5, padding: "8px 12px", cursor: "pointer", borderBottom: `2px solid ${kind === t.kind ? "#18181b" : "transparent"}`, color: kind === t.kind ? "#18181b" : "#63636f" }}>
            {t.label}{counts[t.kind] ? <span style={{ marginLeft: 6, background: "#b42318", color: "#fff", borderRadius: 999, padding: "1px 7px", fontSize: 12 }}>{counts[t.kind]} new</span> : null}
          </button>
        ))}
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 13.5, color: "#52525b", lineHeight: 1.55 }}>{tab.help}</p>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <label style={{ fontSize: 13.5, color: "#52525b" }}>Show
          <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: 8, font: "inherit", padding: "5px 8px", borderRadius: 8, border: "1px solid #e4e4e7" }}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s} value={s}>{human(s)}</option>)}
          </select>
        </label>
        <button onClick={() => void load(kind)} style={{ marginLeft: "auto", border: "1px solid #e4e4e7", background: "#fff", borderRadius: 8, padding: "6px 12px", font: "inherit", fontWeight: 600, cursor: "pointer" }}>Refresh</button>
      </div>

      {err && <p style={{ color: "#b42318" }}>{err}</p>}
      {!items && !err && <p style={{ color: "#63636f" }}>Loading…</p>}
      {items && shown.length === 0 && <p style={{ color: "#63636f" }}>Nothing here yet.</p>}

      <div style={{ display: "grid", gap: 8 }}>
        {shown.map((it) => {
          const d = it.data ?? {};
          const name = it.who?.name || d.contactName || d.name || "(no name)";
          const email = it.who?.email || d.email || "";
          const phone = it.who?.phone || d.phone || "";
          const headline = kind === "spotlight" ? it.title || it.service : kind === "school" ? `${d.school ?? ""} · ${d.city ?? ""}` : d.request;
          const st = it.status ?? "new";
          const isOpen = open === it.id;
          return (
            <div key={it.id} style={{ background: "#fff", border: "1px solid #e4e4e7", borderRadius: 10 }}>
              <button onClick={() => setOpen(isOpen ? null : it.id)} aria-expanded={isOpen}
                style={{ all: "unset", boxSizing: "border-box", width: "100%", cursor: "pointer", display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 10, padding: "12px 14px" }}>
                <span style={{ minWidth: 0 }}>
                  <b style={{ fontSize: 15 }}>{headline || it.id}</b>
                  <span style={{ display: "block", fontSize: 13, color: "#63636f", marginTop: 2 }}>{name}{email ? ` · ${email}` : ""} · {when(it.at)} · {it.id}{it.emailed === false ? " · email not sent" : ""}</span>
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: STATUS_COLOR[st] ?? "#63636f", alignSelf: "center" }}>● {human(st)}</span>
              </button>
              {isOpen && (
                <div style={{ borderTop: "1px solid #f0f0f2", padding: "12px 14px", display: "grid", gap: 10 }}>
                  <dl style={{ display: "grid", gridTemplateColumns: "minmax(140px,200px) minmax(0,1fr)", gap: "6px 14px", margin: 0, fontSize: 14 }}>
                    {kind === "spotlight" && it.who && Object.entries(it.who).filter(([, v]) => v).map(([k, v]) => <Row key={`w-${k}`} k={human(k)} v={String(v)} />)}
                    {Object.entries(d).map(([k, v]) => <Row key={k} k={human(k)} v={v} />)}
                    {it.file && <Row k="Attachment" v={`${it.file.name} (in the email)`} />}
                    {it.page && <Row k="Sent from" v={it.page} />}
                  </dl>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {email && <a href={`mailto:${email}?subject=${encodeURIComponent(`OneGrasp - ${it.id}`)}`} style={btn}>Reply by email</a>}
                    {phone && <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} style={btn}>Call {phone}</a>}
                  </div>
                  <Manage it={it} onSave={(p) => void save(it, p)} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return <><dt style={{ color: "#63636f" }}>{k}</dt><dd style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{v}</dd></>;
}

function Manage({ it, onSave }: { it: Item; onSave: (p: { status?: string; note?: string }) => void }) {
  const [note, setNote] = useState(it.note ?? "");
  return (
    <div style={{ display: "grid", gap: 8, background: "#fafafa", border: "1px solid #f0f0f2", borderRadius: 8, padding: 10 }}>
      <label style={{ fontSize: 13.5, color: "#52525b" }}>Status
        <select value={it.status ?? "new"} onChange={(e) => onSave({ status: e.target.value })} style={{ marginLeft: 8, font: "inherit", padding: "4px 8px", borderRadius: 8, border: "1px solid #e4e4e7" }}>
          {STATUSES.map((s) => <option key={s} value={s}>{human(s)}</option>)}
        </select>
      </label>
      <label style={{ fontSize: 13.5, color: "#52525b" }}>Internal note (only admins see it)
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={1000} style={{ display: "block", width: "100%", marginTop: 4, font: "inherit", fontSize: 14, padding: 8, borderRadius: 8, border: "1px solid #e4e4e7", boxSizing: "border-box" }} />
      </label>
      <button onClick={() => onSave({ note })} disabled={note === (it.note ?? "")} style={{ ...btn, justifySelf: "start", cursor: "pointer" }}>Save note</button>
    </div>
  );
}

const btn: React.CSSProperties = { border: "1px solid #e4e4e7", background: "#fff", borderRadius: 8, padding: "6px 12px", font: "inherit", fontSize: 13.5, fontWeight: 600, color: "#18181b", textDecoration: "none" };
