"use client";
/**
 * /account/spotlight/issn - starting a journal with an ISSN: the ISSN
 * centre's own rules, then OneGrasp's paid help and contacts. Open to
 * undergraduates and working professionals only (the request route checks
 * it too); everyone else sees why it's closed.
 */
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { PageHeader } from "@/components/course/fx";
import { CHECKED, ISSN } from "@/lib/boosters/catalog";
import { ContactCard, Facts, RequestForm, RequestSection, SpotlightShell, useSpotlightUser } from "@/components/boosters/SpotlightParts";

export default function IssnPage() {
  return <SpotlightShell><Issn /></SpotlightShell>;
}

function Issn() {
  const { issnOk } = useSpotlightUser();
  return (
    <>
      <PageHeader
        icon="bookmark"
        eyebrow="ISSN"
        title="Start a journal with its own ISSN"
        subtitle="An ISSN identifies a journal, magazine or newsletter that keeps coming out under one title. It's free from the ISSN National Centre at CSIR-NIScPR - OneGrasp's paid service helps you get the journal ready for the centre's checks."
        meta={["ISSN itself: free", "Help from OneGrasp: paid", "Undergraduates and working professionals", `Rules checked ${CHECKED}`]}
      />

      {!issnOk ? (
        <section className="fp-sec" style={{ marginTop: 24 }}>
          <div className="sp-box" style={{ textAlign: "center", padding: "28px 20px" }}>
            <Icon name="lock" size={22} stroke={2} />
            <h3 style={{ margin: "8px 0 6px" }}>ISSN help is for undergraduates and working professionals</h3>
            <p style={{ maxWidth: 560, margin: "0 auto 14px" }}>A journal needs a publisher and an editorial board of senior experts, so this service opens from degree level. Meanwhile, your book can have an ISBN, and your writing can go into a conference or a magazine.</p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/account/spotlight/isbn" className="fp-btn fp-btn-sm">ISBN for a book</Link>
              <Link href="/account/spotlight/magazine" className="fp-btn fp-btn-sm">Awardees Magazine</Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="fp-sec" style={{ marginTop: 24 }}>
            <p className="sp-note"><Icon name="info" size={15} stroke={2} /> {ISSN.what}</p>
          </section>

          <section className="fp-sec">
            <div className="fp-sec-h"><div><h2>When you can apply</h2><p>Print and online journals follow different rules.</p></div></div>
            <div className="sp-two">
              {ISSN.when.map((w) => <div key={w.title} className="sp-box"><h3>{w.title}</h3><p>{w.text}</p></div>)}
            </div>
          </section>

          <section className="fp-sec">
            <div className="fp-sec-h"><div><h2>What the centre checks</h2><p>Have each of these in place before you apply.</p></div></div>
            <ol className="sp-steps">{ISSN.needs.map((n) => <li key={n}>{n}</li>)}</ol>
          </section>

          <section className="fp-sec">
            <div className="fp-sec-h"><div><h2>Good to know</h2><p>From the centre&apos;s guidelines.</p></div></div>
            <Facts items={ISSN.facts} />
            <div className="sp-offic" style={{ marginTop: 12 }}>
              <span><b>{ISSN.centre}</b><br />{ISSN.address}</span>
              <span>Email: <a href={`mailto:${ISSN.email}`}>{ISSN.email}</a></span>
              <span><a href={ISSN.site} target="_blank" rel="noopener noreferrer">ISSN India</a> · <a href={ISSN.guidelines} target="_blank" rel="noopener noreferrer">Official guidelines (PDF)</a> · <a href={ISSN.apply} target="_blank" rel="noopener noreferrer">Apply online</a></span>
            </div>
          </section>

          <RequestSection title="Get help with your ISSN" text="We check the journal against the guidelines, help you get each part ready and stay with you until the application goes in.">
            <RequestForm formId="issn" />
          </RequestSection>
        </>
      )}

      <section className="fp-sec"><ContactCard /></section>
    </>
  );
}
