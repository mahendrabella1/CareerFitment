"use client";
/**
 * /account/spotlight/conferences - research publishing: OneGrasp's upcoming
 * international conferences (live from the events site's feed), an abstract
 * form for the one picked, and a "publish a paper" form. Both go to
 * support@onegrasp.com.
 */
import { useEffect, useMemo, useState } from "react";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { ONEGRASP, abstractOpen, todayIST, type Conference } from "@/lib/boosters/catalog";
import { ContactCard, RequestForm, RequestSection, SpotlightShell } from "@/components/boosters/SpotlightParts";

export default function ConferencesPage() {
  return <SpotlightShell><Conferences /></SpotlightShell>;
}

const PAGE = 12;
const fmt = (d: string, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-IN", { ...o, timeZone: "UTC" });

function Conferences() {
  const [all, setAll] = useState<Conference[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [openOnly, setOpenOnly] = useState(true);
  const [limit, setLimit] = useState(PAGE);
  const [picked, setPicked] = useState<Record<string, string> | undefined>();
  const today = useMemo(() => todayIST(), []);

  useEffect(() => {
    let live = true;
    fetch("/api/boosters/conferences")
      .then((r) => r.json())
      .then((d: { conferences?: Conference[] }) => { if (!live) return; setAll((d.conferences ?? []).filter((c) => !c.date || c.date >= today)); setFailed(!d.conferences?.length); })
      .catch(() => { if (live) { setAll([]); setFailed(true); } });
    return () => { live = false; };
  }, [today]);

  const cats = useMemo(() => {
    const n = new Map<string, number>();
    for (const c of all ?? []) n.set(c.category, (n.get(c.category) ?? 0) + 1);
    return [...n.entries()].sort((a, b) => b[1] - a[1]);
  }, [all]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (all ?? []).filter((c) => (!cat || c.category === cat) && (!openOnly || abstractOpen(c, today)) && (!s || `${c.title} ${c.category}`.toLowerCase().includes(s)));
  }, [all, cat, openOnly, q, today]);

  const pick = (c: Conference) => {
    setPicked({ conference: c.title });
    requestAnimationFrame(() => document.getElementById("request")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <>
      <PageHeader
        icon="flask"
        eyebrow="Research publishing"
        title="Present your research, publish your paper"
        subtitle="OneGrasp runs international conferences across subjects, online. Any student, researcher, academician or professional can send an abstract. Presenters get a certificate with a unique ID, and accepted, presented papers can be published in the indexed proceedings with a DOI."
        meta={[all ? `${all.length} upcoming conferences` : "Loading conferences...", "Online", "Paid - fee by country and role"]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-sec-h">
          <div><h2>Upcoming OneGrasp conferences</h2><p>Live from onegrasp.com/events. Pick one to send your abstract.</p></div>
          <a href={ONEGRASP.events} target="_blank" rel="noopener noreferrer" className="fp-link">All events <Icon name="arrowRight" size={15} stroke={2} /></a>
        </div>
        <div className="fp-dir" style={{ marginBottom: 14 }}>
          <div className="fp-dir-h" style={{ gap: 8 }}>
            <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder="Search by subject or title - e.g. nursing, AI, finance" aria-label="Search conferences" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
              <button className="fp-chip" aria-pressed={!cat} onClick={() => { setCat(null); setLimit(PAGE); }}>All subjects</button>
              {cats.map(([c, n]) => <button key={c} className="fp-chip" aria-pressed={cat === c} onClick={() => { setCat(cat === c ? null : c); setLimit(PAGE); }}>{c} <small style={{ color: "var(--mute)" }}>{n}</small></button>)}
              <span style={{ flex: 1 }} />
              <button className="fp-chip" aria-pressed={openOnly} onClick={() => { setOpenOnly(!openOnly); setLimit(PAGE); }}>Still taking abstracts</button>
            </div>
          </div>
        </div>

        {all === null ? <p className="fp-muted">Loading the conference list...</p> : (
          <>
            {list.length > 0 && (
              <div className="cf-list">
                {list.slice(0, limit).map((c) => {
                  const open = abstractOpen(c, today);
                  return (
                    <article key={c.id || c.url} className="cf-row">
                      <div className="cf-date">
                        {c.date ? <><b>{fmt(c.date, { day: "numeric" })}</b><span>{fmt(c.date, { month: "short", year: "numeric" })}</span></> : <span>{c.dateText || "Date soon"}</span>}
                      </div>
                      <div className="cf-b">
                        <b>{c.title}</b>
                        <small>{c.category} · {c.mode}</small>
                        <p className={open ? "" : "is-closed"}>
                          {c.abstractBy ? (open ? <>Abstracts by <b>{fmt(c.abstractBy)}</b></> : <>Abstract deadline passed ({fmt(c.abstractBy)}) - ask us about late entries or attending</>) : "Abstract deadline on the conference page"}
                          {c.registerBy && c.registerBy >= today && <> · Registration by {fmt(c.registerBy)}</>}
                        </p>
                      </div>
                      <div className="cf-a">
                        <button type="button" className="fp-btn fp-btn-pri fp-btn-sm" onClick={() => pick(c)}>{open ? "Submit abstract" : "Ask about it"}</button>
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="fp-link" style={{ fontSize: 13 }}>Conference page <Icon name="arrowRight" size={13} stroke={2} /></a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
            {list.length > limit && <div style={{ textAlign: "center", marginTop: 12 }}><button className="fp-btn fp-btn-sm" onClick={() => setLimit(limit + PAGE * 2)}>Show more ({list.length - limit} left)</button></div>}
            {list.length === 0 && (
              <p className="fp-muted">
                {failed ? <>The list couldn&apos;t load just now - see every conference on <a href={ONEGRASP.events} target="_blank" rel="noopener noreferrer" className="fp-link" style={{ fontSize: 13 }}>onegrasp.com/events</a> and type its name in the form below.</>
                  : <>No conference matches. <button className="fp-link" style={{ fontSize: 13 }} onClick={() => { setQ(""); setCat(null); setOpenOnly(false); }}>Show every upcoming conference</button>.</>}
              </p>
            )}
          </>
        )}
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>From abstract to certificate</h2><p>How a OneGrasp conference works.</p></div></div>
        <ol className="sp-steps">
          <li>Send your abstract (Word file or pasted text) for the conference that fits your subject. Each conference page has its abstract guidelines.</li>
          <li>The team reviews it and gets back to you by email.</li>
          <li>Register as a speaker, poster presenter or listener - the fee depends on your country and role, and is on each conference&apos;s page.</li>
          <li>Present online. Abstracts get Crossref-linked visibility, and every registered presenter gets a digital certificate with a unique ID.</li>
          <li>Accepted and presented papers are eligible for the indexed proceedings with a unique DOI, once you&apos;ve registered and sent the final paper.</li>
        </ol>
      </section>

      <RequestSection title="Send your abstract" text="Pick a conference above, or type its name.">
        <RequestForm formId="conference" preset={picked} id="abstract-form" />
      </RequestSection>

      <section className="fp-sec" id="paper" style={{ scrollMarginTop: 150 }}>
        <div className="fp-sec-h"><div><h2>Publish a paper</h2><p>Proceedings with a DOI, or a journal - the team advises where your paper fits.</p></div></div>
        <p className="sp-note" style={{ marginBottom: 14 }}><Icon name="info" size={15} stroke={2} /> No honest publisher can promise acceptance - peer review decides. Before paying any journal, check its indexing on the index&apos;s own site (Scopus, Web of Science), not just the journal&apos;s word.</p>
        <RequestForm formId="journal" />
      </section>

      <section className="fp-sec"><ContactCard /></section>
      <style dangerouslySetInnerHTML={{ __html: CF_CSS }} />
    </>
  );
}

const CF_CSS = `
.cf-list{background:#fff;border:1px solid var(--line);border-radius:8px}
.cf-row{display:grid;grid-template-columns:64px minmax(0,1fr) 170px;gap:16px;align-items:center;padding:14px 16px;border-top:1px solid #f0ede8}
.cf-row:first-child{border-top:0}
.cf-date{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:58px;border-radius:8px;background:color-mix(in srgb,var(--accent) 8%,#fff);color:var(--accent);text-align:center;line-height:1.15;padding:4px}
.cf-date b{font-family:Poppins,Inter,sans-serif;font-size:22px;font-weight:700}
.cf-date span{font-size:11.5px;font-weight:600}
.cf-b{min-width:0}
.cf-b>b{display:block;font-size:14.5px;font-weight:600;line-height:1.4;color:var(--ink)}
.cf-b>small{display:block;font-size:12.5px;color:var(--mute);margin-top:2px}
.cf-b>p{margin:6px 0 0;font-size:13px;color:var(--ink2)}
.cf-b>p.is-closed{color:var(--mute)}
.cf-a{display:flex;flex-direction:column;align-items:flex-start;gap:8px}
@media (max-width:760px){.cf-row{grid-template-columns:54px minmax(0,1fr)}.cf-a{grid-column:2;flex-direction:row;align-items:center;flex-wrap:wrap}}
`;
