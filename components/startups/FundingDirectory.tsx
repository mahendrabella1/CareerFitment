"use client";
/**
 * Startups -> Funding: every grant, loan, subsidy and incubator programme for
 * Indian startups (lib/startups/funding.ts, from CapEasy's directory). Quick
 * filters, a dropdown per facet, sort, and a card per programme that opens
 * its CapEasy page for who runs it, eligibility and how to apply.
 */
import { useMemo, useState } from "react";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import {
  AMOUNT_BANDS, CAPEASY_START, FOR_STUDENTS, KIND_LABEL, NO_FILTERS, RUN_BY_LABEL, STAGES,
  amountBand, amountText, deadlineOf, filterProgrammes, programmeUrl, sortProgrammes, stageLabel, stateName,
  type FundingData, type FundingFilters, type FundingKind, type FundingSort, type Programme, type RunBy,
} from "@/lib/startups/funding";

const PAGE = 24;
const todayKey = () => new Date().toISOString().slice(0, 10);
const fmtDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function FundingDirectory({ data }: { data: FundingData }) {
  const [f, setF] = useState<FundingFilters>(NO_FILTERS);
  const [sort, setSort] = useState<FundingSort>("amount");
  const [limit, setLimit] = useState(PAGE);
  const today = useMemo(todayKey, []);
  const all = data.programmes;
  const open = useMemo(() => all.filter((p) => deadlineOf(p, today).state !== "closed"), [all, today]);
  const list = useMemo(() => sortProgrammes(filterProgrammes(all, f, today), sort), [all, f, today, sort]);
  const set = (patch: Partial<FundingFilters>) => { setF((x) => ({ ...x, ...patch })); setLimit(PAGE); };
  const active = Object.entries(f).filter(([k, v]) => (k === "q" ? !!v : k === "deadline" ? v !== "any" : Array.isArray(v) ? v.length > 0 : !!v)).length;

  // Option counts from the open programmes (facets show only values that exist).
  const facet = (get: (p: Programme) => string[]) => {
    const n = new Map<string, number>();
    for (const p of open) for (const v of new Set(get(p))) n.set(v, (n.get(v) ?? 0) + 1);
    return n;
  };
  const kindN = facet((p) => [p.kind]);
  const stageN = facet((p) => p.stages);
  const runN = facet((p) => [p.run_by_kind]);
  const stateN = facet((p) => (p.states.length ? p.states : ["india"]));
  const sectorN = facet((p) => p.sectors);
  const amountN = facet((p) => [amountBand(p) ?? ""]);
  const totals = data.totals;
  const students = open.filter((p) => FOR_STUDENTS.has(p.slug)).length;

  const one = (key: "kinds" | "stages" | "runBy" | "states" | "sectors" | "amounts") => (v: string) => set({ [key]: v ? [v] : [] } as Partial<FundingFilters>);

  return (
    <div className="fp fd">
      <style dangerouslySetInnerHTML={{ __html: FD_CSS }} />
      <PageHeader
        icon="wallet"
        eyebrow="Funding"
        title="Raise funds for your startup"
        subtitle="Every grant, loan, subsidy and incubator programme for Indian startups, with its amount and deadline. Open one to see who runs it, whether you can apply and how, on CapEasy."
        meta={[
          `${totals?.programmes ?? all.length} programmes`,
          ...(totals ? [`₹${Math.round(totals.crore).toLocaleString("en-IN")} crore on the table`, `${totals.oneClick} one-click applications`] : []),
          `Updated ${fmtDate(data.fetchedAt)}`,
        ]}
      />

      <section className="fd-who" aria-label="Who runs them">
        {(Object.keys(RUN_BY_LABEL) as RunBy[]).map((k) => (
          <button key={k} type="button" className={`fd-stat${f.runBy[0] === k ? " is-on" : ""}`} aria-pressed={f.runBy[0] === k} onClick={() => one("runBy")(f.runBy[0] === k ? "" : k)}>
            <b>{runN.get(k) ?? 0}</b><span>{RUN_BY_LABEL[k]}</span>
          </button>
        ))}
      </section>

      <p className="fd-note">
        <Icon name="info" size={16} stroke={2} />
        <span><b>Still in school or college?</b> Most programmes need a registered company, and company directors in India must be 18 or older. Start with the {students} programmes marked <em>For students</em> - and build your idea in the course so it&apos;s ready when you are.
          {" "}<button type="button" className="fp-link" onClick={() => set({ ...NO_FILTERS, students: true })}>Show them <Icon name="arrowRight" size={13} stroke={2} /></button></span>
      </p>

      <div className="fd-bar">
        <label className="fd-search">
          <Icon name="search" size={16} stroke={2} />
          <span className="fd-sr">Search programmes</span>
          <input type="search" value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by name, sector or state - e.g. seed fund, Kerala" />
        </label>
        <div className="fd-quick">
          <button type="button" className="fp-chip" aria-pressed={f.students} onClick={() => set({ students: !f.students })}>For students</button>
          <button type="button" className="fp-chip" aria-pressed={f.early} onClick={() => set({ early: !f.early })}>Idea or prototype stage</button>
          <button type="button" className="fp-chip" aria-pressed={f.deadline === "soon"} onClick={() => set({ deadline: f.deadline === "soon" ? "any" : "soon" })}>Closing in 30 days</button>
          <button type="button" className="fp-chip" aria-pressed={f.deadline === "open"} onClick={() => set({ deadline: f.deadline === "open" ? "any" : "open" })}>Open now or rolling</button>
          <button type="button" className="fp-chip" aria-pressed={f.oneClick} onClick={() => set({ oneClick: !f.oneClick })}>One-click application</button>
        </div>
        <div className="fd-selects">
          <Select label="Type" value={f.kinds[0] ?? ""} onChange={one("kinds")} options={(Object.keys(KIND_LABEL) as FundingKind[]).filter((k) => kindN.has(k)).map((k) => [k, `${KIND_LABEL[k]} (${kindN.get(k)})`])} />
          <Select label="Stage" value={f.stages[0] ?? ""} onChange={one("stages")} options={STAGES.filter((s) => stageN.has(s.id)).map((s) => [s.id, `${s.label} (${stageN.get(s.id)})`])} />
          <Select label="Who runs it" value={f.runBy[0] ?? ""} onChange={one("runBy")} options={(Object.keys(RUN_BY_LABEL) as RunBy[]).map((k) => [k, `${RUN_BY_LABEL[k]} (${runN.get(k) ?? 0})`])} />
          <Select label="State" value={f.states[0] ?? ""} onChange={one("states")} options={[["india", `Across India (${stateN.get("india") ?? 0})`], ...[...stateN.keys()].filter((s) => s !== "india").sort((a, b) => stateName(a).localeCompare(stateName(b))).map((s): [string, string] => [s, `${stateName(s)} (${stateN.get(s)})`])]} />
          <Select label="Sector" value={f.sectors[0] ?? ""} onChange={one("sectors")} options={[...sectorN.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]): [string, string] => [s, `${s} (${n})`])} />
          <Select label="Amount" value={f.amounts[0] ?? ""} onChange={one("amounts")} options={AMOUNT_BANDS.map((b) => [b.id, `${b.label} (${amountN.get(b.id) ?? 0})`])} />
        </div>
      </div>

      <div className="fd-count">
        <p aria-live="polite">Showing <b>{Math.min(limit, list.length)}</b> of {list.length} programmes{active ? "" : " open now"}
          {active > 0 && <> · <button type="button" className="fp-link" onClick={() => set(NO_FILTERS)}>Clear filters</button></>}</p>
        <label className="fd-sort">Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as FundingSort)}>
            <option value="amount">Amount, highest first</option>
            <option value="closing">Closing soonest</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="fd-grid">
        {list.slice(0, limit).map((p) => <Card key={p.slug} p={p} today={today} />)}
      </div>
      {list.length === 0 && <p className="fp-muted" style={{ padding: "18px 0" }}>No programme matches all of these. Try removing a filter.</p>}
      {list.length > limit && <button type="button" className="fd-more" onClick={() => setLimit(limit + PAGE)}>Show {Math.min(PAGE, list.length - limit)} more</button>}

      <section className="fd-cta">
        <div>
          <b>See which ones you can apply for</b>
          <p>Sign up free on CapEasy and tell them about your startup once - about five minutes. They check it against every programme&apos;s published rules, show what&apos;s missing, and fill the application for {totals?.oneClick ?? 60} programmes in one click.</p>
        </div>
        <a href={CAPEASY_START} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-pri">Check what I qualify for <Icon name="arrowRight" size={15} stroke={2} /></a>
      </section>
      <p className="fp-muted fd-fine">Programmes are run by central and state governments, incubators, funds and banks. Amounts and deadlines change - confirm on the programme&apos;s page before you apply. CapEasy is a private consultancy, not affiliated with any government authority.</p>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <label className={`fd-select${value ? " is-on" : ""}`}>
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        <option value="">Any</option>
        {options.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
      </select>
    </label>
  );
}

function Card({ p, today }: { p: Programme; today: string }) {
  const dl = deadlineOf(p, today);
  const where = p.states.length ? (p.states.length > 2 ? `${stateName(p.states[0])} +${p.states.length - 1}` : p.states.map(stateName).join(", ")) : "Across India";
  const stages = [...STAGES.map((s) => s.id)].filter((s) => p.stages.includes(s));
  return (
    <article className="fd-card">
      <div className="fd-card-h">
        <b className="fd-amt">{amountText(p)}</b>
        <span className={`fd-dl is-${dl.state}`}>{dl.text}</span>
      </div>
      <h3><a href={programmeUrl(p.slug)} target="_blank" rel="noopener noreferrer">{p.name}</a></h3>
      <div className="fd-tags">
        {FOR_STUDENTS.has(p.slug) && <span className="fd-tag is-student">For students</span>}
        <span className="fd-tag">{KIND_LABEL[p.kind]}</span>
        <span className="fd-tag">{RUN_BY_LABEL[p.run_by_kind]}</span>
        <span className="fd-tag">{where}</span>
        {p.draftable && <span className="fd-tag is-click">One-click application</span>}
      </div>
      <small className="fd-meta">{stages.length ? `Stage: ${stages.map(stageLabel).join(", ")}` : "Any stage"}{p.sectors.length && !(p.sectors.length === 1 && p.sectors[0] === "Sector agnostic") ? ` · ${p.sectors.join(", ")}` : " · Any sector"}</small>
      <a href={programmeUrl(p.slug)} target="_blank" rel="noopener noreferrer" className="fd-go">Details and how to apply <Icon name="arrowRight" size={14} stroke={2} /></a>
    </article>
  );
}

const FD_CSS = `
.fd-who{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin:22px 0 14px}
.fd-stat{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:8px;font:inherit;text-align:left;cursor:pointer;color:var(--ink)}
.fd-stat:hover{border-color:#c9c4ba}
.fd-stat.is-on{border-color:var(--accent);box-shadow:0 0 0 1px var(--accent)}
.fd-stat b{font-family:Poppins,Inter,sans-serif;font-size:24px;line-height:1.1}
.fd-stat span{font-size:12.5px;color:var(--mute)}
.fd-note{display:flex;gap:10px;align-items:flex-start;margin:0 0 16px;padding:12px 14px;border-radius:8px;background:color-mix(in srgb,var(--accent) 6%,#fff);border:1px solid color-mix(in srgb,var(--accent) 22%,#fff);font-size:14px;line-height:1.55;color:var(--ink2)}
.fd-note svg{flex:none;color:var(--accent);margin-top:3px}
.fd-note em{font-style:normal;font-weight:600;color:var(--ink)}
.fd-bar{display:grid;gap:10px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:8px}
.fd-search{display:flex;align-items:center;gap:8px;height:44px;padding:0 12px;border:1px solid var(--line2);border-radius:6px;color:var(--mute)}
.fd-search:focus-within{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
.fd-search input{flex:1;min-width:0;border:0;outline:0;font:inherit;font-size:15px;background:transparent;color:var(--ink)}
.fd-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
.fd-quick{display:flex;flex-wrap:wrap;gap:6px}
.fd-selects{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,150px),1fr));gap:8px}
.fd-select{display:flex;flex-direction:column;gap:3px;font-size:11.5px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--mute)}
.fd-select select{height:36px;border:1px solid var(--line2);border-radius:6px;padding:0 8px;font:inherit;font-size:13.5px;font-weight:500;letter-spacing:0;text-transform:none;color:var(--ink);background:#fff;min-width:0}
.fd-select.is-on select{border-color:var(--accent);color:var(--accent);font-weight:600}
.fd-count{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 16px;margin:16px 0 10px}
.fd-count p{margin:0;font-size:14px;color:var(--ink2)}
.fd-sort{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--mute)}
.fd-sort select{height:34px;border:1px solid var(--line2);border-radius:6px;padding:0 8px;font:inherit;font-size:13.5px;color:var(--ink);background:#fff}
.fd-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:12px}
.fd-card{display:flex;flex-direction:column;gap:8px;padding:16px 18px;background:#fff;border:1px solid var(--line);border-radius:8px}
.fd-card:hover{border-color:#c9c4ba}
.fd-card-h{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.fd-amt{font-family:Poppins,Inter,sans-serif;font-size:17px;font-weight:700;color:var(--ink);line-height:1.3}
.fd-dl{flex:none;font-size:12px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--soft);color:var(--ink2);white-space:nowrap}
.fd-dl.is-open{background:#ecfdf3;color:#166534}
.fd-dl.is-soon{background:#fff7ed;color:#9a3412}
.fd-card h3{margin:0;font-size:15px;font-weight:600;line-height:1.4}
.fd-card h3 a{color:var(--ink);text-decoration:none}
.fd-card h3 a:hover{text-decoration:underline}
.fd-tags{display:flex;flex-wrap:wrap;gap:5px}
.fd-tag{font-size:12px;padding:2px 8px;border-radius:999px;border:1px solid var(--line);background:var(--soft);color:var(--ink2)}
.fd-tag.is-student{background:color-mix(in srgb,var(--accent) 10%,#fff);border-color:color-mix(in srgb,var(--accent) 30%,#fff);color:var(--accent);font-weight:600}
.fd-tag.is-click{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8}
.fd-meta{font-size:12.5px;color:var(--mute);line-height:1.45}
.fd-go{margin-top:auto;padding-top:4px;display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;color:var(--accent);text-decoration:none}
.fd-go:hover{text-decoration:underline}
.fd-more{display:block;margin:16px auto 0;height:42px;padding:0 20px;border:1px solid var(--line2);border-radius:6px;background:#fff;font:inherit;font-size:14px;font-weight:600;cursor:pointer;color:var(--ink)}
.fd-cta{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:14px 24px;margin-top:28px;padding:20px 22px;border-radius:8px;background:#16181d;color:#fff}
.fd-cta b{font-family:Poppins,Inter,sans-serif;font-size:18px}
.fd-cta p{margin:6px 0 0;max-width:640px;font-size:14px;line-height:1.55;color:#c9cbd1}
.fd-cta .fp-btn-pri{background:#fff;color:#16181d;border-color:#fff}
.fd-fine{margin-top:12px;font-size:12.5px;line-height:1.5}
@media (max-width:700px){.fd-who{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;
