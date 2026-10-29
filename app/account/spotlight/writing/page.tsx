"use client";
/**
 * /account/spotlight/writing - research writing: OneGrasp's Academic Writing
 * Programme (its eight stages) and one-to-one writing support on request.
 */
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { WRITING } from "@/lib/boosters/catalog";
import { ContactCard, RequestForm, RequestSection, SpotlightShell } from "@/components/boosters/SpotlightParts";

export default function WritingPage() {
  return (
    <SpotlightShell>
      <PageHeader
        icon="doc"
        eyebrow="Research writing"
        title="Write research that gets accepted"
        subtitle="Help from OneGrasp's academic writing team with a paper, thesis, proposal or abstract - from choosing the question to a publication-ready draft."
        meta={["Paid service", "One-to-one or the live programme", "For undergraduates, scholars, faculty, professionals"]}
      />

      <section className="fp-sec" style={{ marginTop: 24 }}>
        <div className="fp-sec-h"><div><h2>What we help with</h2><p>The eight stages of OneGrasp&apos;s writing programme - ask for help at any one of them.</p></div></div>
        <div className="wr-stages">
          {WRITING.stages.map((s, i) => (
            <div key={s.name} className="wr-stage"><i>{i + 1}</i><b>{s.name}</b><p>{s.text}</p></div>
          ))}
        </div>
        <p className="sp-note" style={{ marginTop: 14 }}><Icon name="shield" size={15} stroke={2} /> {WRITING.integrity}</p>
      </section>

      <section className="fp-sec">
        <div className="sp-box wr-prog">
          <div>
            <span className="fp-kicker" style={{ border: 0, padding: 0 }}>Live programme</span>
            <h3 style={{ marginTop: 4 }}>{WRITING.programme.name}</h3>
            <p>{WRITING.programme.text}</p>
          </div>
          <a href={WRITING.programme.url} target="_blank" rel="noopener noreferrer" className="fp-btn fp-btn-sm">See the programme <Icon name="arrowRight" size={14} stroke={2} /></a>
        </div>
      </section>

      <RequestSection title="Tell us what you're writing" text="A mentor reads what you send and replies with how they'd help, the time it takes and the fee.">
        <RequestForm formId="writing" />
      </RequestSection>

      <section className="fp-sec"><ContactCard /></section>
      <style dangerouslySetInnerHTML={{ __html: `
.wr-stages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.wr-stage{padding:14px 16px;background:#fff;border:1px solid var(--line);border-radius:8px}
.wr-stage i{display:block;font-style:normal;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:18px;color:var(--accent)}
.wr-stage b{display:block;font-size:14.5px;margin:2px 0 4px}
.wr-stage p{margin:0;font-size:13.5px;line-height:1.5;color:var(--ink2)}
.wr-prog{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.wr-prog>div{flex:1 1 380px}
@media (max-width:1000px){.wr-stages{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:520px){.wr-stages{grid-template-columns:minmax(0,1fr)}}
` }} />
    </SpotlightShell>
  );
}
