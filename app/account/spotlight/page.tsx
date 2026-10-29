"use client";
/**
 * /account/spotlight - Spotlight home (OneGrasp's paid "career boosters"), for
 * every class: the five services, how a request works, the student's own
 * requests and OneGrasp's contacts. ISSN shows only to undergraduates and
 * working professionals.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { FEATURES } from "@/lib/features/catalog";
import { ONEGRASP, SERVICES, servicesFor } from "@/lib/boosters/catalog";
import { FeatureHero } from "@/components/feature/FeatureHero";
import type { SearchItem } from "@/components/feature/FeatureSearch";
import { ContactCard, MyRequests, PaidTag, SpotlightShell, useSpotlightUser } from "@/components/boosters/SpotlightParts";

export default function SpotlightHome() {
  return <SpotlightShell><Home /></SpotlightShell>;
}

function Home() {
  const meta = FEATURES.spotlight;
  const { profile, issnOk } = useSpotlightUser();
  const services = useMemo(() => servicesFor(profile?.category), [profile?.category]);
  const [upcoming, setUpcoming] = useState<number | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/boosters/conferences").then((r) => r.json()).then((d: { conferences?: unknown[] }) => { if (live && d.conferences?.length) setUpcoming(d.conferences.length); }).catch(() => undefined);
    return () => { live = false; };
  }, []);

  const search = useMemo<SearchItem[]>(() => [
    ...services.map((s) => ({ label: s.title, kind: "Service", hint: s.short, href: s.href })),
    { label: "Submit an abstract", kind: "Form", hint: "OneGrasp international conferences", href: "/account/spotlight/conferences#request" },
    { label: "Publish a paper", kind: "Form", hint: "Proceedings with a DOI, or a journal", href: "/account/spotlight/conferences#paper" },
    { label: "Who can get an ISBN?", kind: "Guide", hint: "The official rules, in plain words", href: "/account/spotlight/isbn" },
    { label: "Article guidelines", kind: "Guide", hint: "Awardees Magazine: abstract, main content, conclusion", href: "/account/spotlight/magazine" },
  ], [services]);

  return (
    <>
      <FeatureHero
        meta={meta}
        search={search}
        placeholder="Search conferences, ISBN, ISSN, the magazine..."
        popular={[
          { label: "Submit an abstract", href: "/account/spotlight/conferences" },
          { label: "Get an ISBN", href: "/account/spotlight/isbn" },
          { label: "Awardees Magazine", href: "/account/spotlight/magazine" },
        ]}
        primary={{ label: "Present at a conference", href: "/account/spotlight/conferences" }}
        secondary={{ label: "Research writing help", href: "/account/spotlight/writing" }}
        stats={[
          { value: upcoming ?? "200+", label: "upcoming OneGrasp conferences" },
          { value: "DOI", label: "for accepted, presented papers" },
          { value: "₹0", label: "for the ISBN or ISSN itself" },
          { value: services.length, label: "career boosters" },
        ]}
      />

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>Career boosters</h2><p>Paid services from OneGrasp. Asking is free: send a request and the team replies with the fee and the next steps.</p></div></div>
        <div className="sp-svcs">
          {services.map((s) => (
            <Link key={s.id} href={s.href} className="sp-svc">
              <span className="sp-svc-ic"><Icon name={s.icon} size={20} stroke={2} /></span>
              <b>{s.title}</b>
              <p>{s.short}</p>
              <small>For: {s.forWho}</small>
              <span className="sp-svc-f"><PaidTag /><span className="sp-go">Open <Icon name="arrowRight" size={14} stroke={2} /></span></span>
            </Link>
          ))}
        </div>
        {!issnOk && SERVICES.some((s) => s.id === "issn") && (
          <p className="fp-muted" style={{ marginTop: 10 }}><Icon name="lock" size={13} stroke={2} /> ISSN help - for starting a journal - opens for undergraduates and working professionals.</p>
        )}
      </section>

      <section className="fp-sec">
        <div className="fp-sec-h"><div><h2>How it works</h2><p>Nothing is paid on this site.</p></div></div>
        <ol className="sp-how">
          <li><b>Pick a service and tell us about it</b><span>Each page explains the rules first, then has a short form. Attach your file if you have one.</span></li>
          <li><b>The team writes back</b><span>Your request goes to {ONEGRASP.email} with your name, email and phone, and a reference like SP-7K3QX9. The reply has the fee and what happens next.</span></li>
          <li><b>You decide</b><span>Go ahead only if it suits you. The team then works with you through to submission or publication.</span></li>
        </ol>
      </section>

      <MyRequests />

      <section className="fp-sec"><ContactCard /></section>
      <style dangerouslySetInnerHTML={{ __html: HOME_CSS }} />
    </>
  );
}

const HOME_CSS = `
.sp-svcs{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,300px),1fr));gap:12px}
.sp-svc{display:flex;flex-direction:column;gap:6px;padding:18px;background:#fff;border:1px solid var(--line);border-radius:8px;text-decoration:none;color:var(--ink);transition:border-color .15s}
.sp-svc:hover{border-color:var(--accent)}
.sp-svc-ic{display:grid;place-items:center;width:40px;height:40px;border-radius:8px;background:color-mix(in srgb,var(--accent) 10%,#fff);color:var(--accent);margin-bottom:4px}
.sp-svc b{font-size:16px;font-weight:600}
.sp-svc p{margin:0;font-size:14px;line-height:1.55;color:var(--ink2)}
.sp-svc small{font-size:12.5px;color:var(--mute)}
.sp-svc-f{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:10px}
.sp-go{display:inline-flex;align-items:center;gap:4px;font-size:13.5px;font-weight:600;color:var(--accent)}
.sp-how{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;counter-reset:h}
.sp-how li{counter-increment:h;padding:16px 18px;background:#fff;border:1px solid var(--line);border-radius:8px}
.sp-how li::before{content:counter(h);display:block;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:20px;color:var(--accent)}
.sp-how b{display:block;font-size:15px;margin:4px 0}
.sp-how span{display:block;font-size:13.5px;line-height:1.55;color:var(--ink2)}
@media (max-width:860px){.sp-how{grid-template-columns:minmax(0,1fr)}}
`;
