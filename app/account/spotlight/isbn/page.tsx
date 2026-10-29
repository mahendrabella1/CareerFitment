"use client";
/**
 * /account/spotlight/isbn - getting an ISBN in India: what the number is, who
 * can get one, what qualifies, the rules and the steps (all from the
 * agency's own pages), then OneGrasp's paid help with it.
 */
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { CHECKED, ISBN } from "@/lib/boosters/catalog";
import { ContactCard, Facts, RequestForm, RequestSection, SpotlightShell } from "@/components/boosters/SpotlightParts";

export default function IsbnPage() {
  return (
    <SpotlightShell>
      <PageHeader
        icon="book"
        eyebrow="ISBN"
        title="Your book, with its own ISBN"
        subtitle="An ISBN is the 13-digit number shops, libraries and online stores use to find and order a book. In India it comes free from the government's ISBN agency - OneGrasp's paid service helps you meet the rules and apply."
        meta={["ISBN itself: free", "Help from OneGrasp: paid", `Rules checked ${CHECKED}`]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-sec-h"><div><h2>Reading an ISBN</h2><p>978-93-5300-895-6, part by part.</p></div></div>
        <div className="ib-parts">
          {ISBN.parts.map((p) => <div key={p.name}><code>{p.digits}</code><b>{p.name}</b><small>{p.text}</small></div>)}
        </div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Who can get one</h2><p>The agency&apos;s own eligibility rules.</p></div></div>
        <div className="sp-box"><ul>{ISBN.who.map((w) => <li key={w}>{w}</li>)}</ul></div>
        <p className="sp-note" style={{ marginTop: 12 }}><Icon name="info" size={15} stroke={2} /> {ISBN.platformNote}</p>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>What qualifies</h2><p>An ISBN is for a publication that is finished as it is - not one that keeps coming out.</p></div></div>
        <div className="sp-two">
          <div className="sp-box is-yes"><h3>Gets an ISBN</h3><ul>{ISBN.eligible.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="sp-box is-no"><h3>Doesn&apos;t</h3><ul>{ISBN.notEligible.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>The rules</h2><p>From the agency&apos;s FAQ.</p></div></div>
        <Facts items={ISBN.rules} />
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>How to apply</h2><p>On the agency&apos;s portal, isbn.gov.in.</p></div></div>
        <ol className="sp-steps">{ISBN.steps.map((s) => <li key={s}>{s}</li>)}</ol>
        <div className="sp-offic" style={{ marginTop: 12 }}>
          <span><b>{ISBN.agency}</b><br />{ISBN.under}<br />{ISBN.address}</span>
          <span>General queries: <a href={`mailto:${ISBN.general.email}`}>{ISBN.general.email}</a>, {ISBN.general.phone}<br />Portal and technical help: <a href={`mailto:${ISBN.technical.email}`}>{ISBN.technical.email}</a>, {ISBN.technical.phone}</span>
          <span><a href={ISBN.portal} target="_blank" rel="noopener noreferrer">isbn.gov.in</a> · <a href={ISBN.faq} target="_blank" rel="noopener noreferrer">Official FAQ</a> · <a href={ISBN.search} target="_blank" rel="noopener noreferrer">Search ISBNs</a></span>
        </div>
      </section>

      <RequestSection title="Get help with your ISBN" text="We check your book and who its publisher should be, then help you register and apply. The fee is for our help; the ISBN stays free.">
        <RequestForm formId="isbn" />
      </RequestSection>

      <section className="fp-sec"><ContactCard /></section>
      <style dangerouslySetInnerHTML={{ __html: `
.ib-parts{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
.ib-parts>div{display:flex;flex-direction:column;gap:3px;padding:14px;background:#fff;border:1px solid var(--line);border-radius:8px}
.ib-parts code{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:22px;font-weight:700;color:var(--accent)}
.ib-parts b{font-size:14px}
.ib-parts small{font-size:12.5px;line-height:1.45;color:var(--ink2)}
@media (max-width:860px){.ib-parts{grid-template-columns:repeat(2,minmax(0,1fr))}}
` }} />
    </SpotlightShell>
  );
}
