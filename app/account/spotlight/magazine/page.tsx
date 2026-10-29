"use client";
/**
 * /account/spotlight/magazine - Awardees Magazine (magazine.awardees.org):
 * what it publishes, its article and podcast guidelines and special issues,
 * and a submission form that goes to the OneGrasp team.
 */
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { MAGAZINE } from "@/lib/boosters/catalog";
import { ContactCard, RequestForm, RequestSection, SpotlightShell } from "@/components/boosters/SpotlightParts";

export default function MagazinePage() {
  return (
    <SpotlightShell>
      <PageHeader
        icon="star"
        eyebrow="Awardees Magazine"
        title="Get featured in an international magazine"
        subtitle={`${MAGAZINE.name} (${MAGAZINE.reg}), from Awardees in the USA, publishes articles, interviews, podcasts and student stories on education, technology, business, health and research. Send your piece through OneGrasp.`}
        meta={["Paid service", "Articles, blogs, podcasts, special issues", "magazine.awardees.org"]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-sec-h">
          <div><h2>Writing an article</h2><p>The magazine&apos;s own guidelines - every article has these four parts.</p></div>
          <a href={MAGAZINE.guidelines} target="_blank" rel="noopener noreferrer" className="fp-link">Author guidelines <Icon name="arrowRight" size={15} stroke={2} /></a>
        </div>
        <div className="mg-parts">
          {MAGAZINE.article.map((a, i) => <div key={a.part}><i>{i + 1}</i><b>{a.part}</b><small>{a.limit}</small></div>)}
        </div>
        <p className="fp-muted" style={{ marginTop: 10 }}>Sections: {MAGAZINE.sections.join(", ")}.</p>
      </section>

      <section className="fp-sec">
        <div className="sp-two">
          <div className="sp-box">
            <h3>Podcasts and interviews</h3>
            <p>{MAGAZINE.podcast} Send your profile with the form below and choose &quot;A podcast interview&quot;.</p>
          </div>
          <div className="sp-box">
            <h3>Special issues</h3>
            <ul>{MAGAZINE.specialIssues.map((s) => <li key={s.name}><b>{s.name}</b> - {s.for}</li>)}</ul>
            <a href={MAGAZINE.special} target="_blank" rel="noopener noreferrer" className="fp-link" style={{ fontSize: 13, marginTop: 8, display: "inline-flex" }}>Special-issue guidelines <Icon name="arrowRight" size={13} stroke={2} /></a>
          </div>
        </div>
      </section>

      <RequestSection title="Send your piece" text="The OneGrasp team checks it against the guidelines and replies with the next steps.">
        <RequestForm formId="magazine" />
      </RequestSection>

      <section className="fp-sec">
        <div className="sp-offic">
          <span><b>{MAGAZINE.name}</b> - {MAGAZINE.tagline}, {MAGAZINE.reg}<br /><a href={MAGAZINE.url} target="_blank" rel="noopener noreferrer">magazine.awardees.org</a> · <a href={`mailto:${MAGAZINE.email}`}>{MAGAZINE.email}</a></span>
          <span><b>{MAGAZINE.parent.name}</b> - {MAGAZINE.parent.text}<br /><a href={MAGAZINE.parent.url} target="_blank" rel="noopener noreferrer">awardees.org</a> · {MAGAZINE.parent.phone}</span>
          <span>{MAGAZINE.address}</span>
        </div>
      </section>

      <section className="fp-sec"><ContactCard /></section>
      <style dangerouslySetInnerHTML={{ __html: `
.mg-parts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.mg-parts>div{padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px}
.mg-parts i{display:block;font-style:normal;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:18px;color:var(--accent)}
.mg-parts b{display:block;font-size:15px;margin:2px 0}
.mg-parts small{font-size:13px;color:var(--ink2)}
@media (max-width:860px){.mg-parts{grid-template-columns:repeat(2,minmax(0,1fr))}}
` }} />
    </SpotlightShell>
  );
}
