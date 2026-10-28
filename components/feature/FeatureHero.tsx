"use client";
/**
 * The top of every feature home page: a warm band with the section's 3D
 * illustration, a two-line headline, one sentence, the search box, quick
 * links, the main buttons, a "Quick tour" button and a strip of numbers -
 * then "Start here": the feature's most useful things to do, as four big
 * cards (lib/features/catalog.ts -> ctas). Opens the starter tour on the
 * student's first visit.
 */
import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { Icon } from "@/app/Icons";
import { featureArt, type FeatureMeta } from "@/lib/features/catalog";
import { FeatureSearch, type SearchItem } from "./FeatureSearch";
import { FeatureTour, tourSeen } from "./FeatureTour";

export interface HeroStat { value: ReactNode; label: string }

export function FeatureHero({ meta, search, placeholder, onQuery, popular, primary, secondary, stats, extra }: {
  meta: FeatureMeta;
  search?: SearchItem[];
  placeholder?: string;
  onQuery?: (q: string) => void;
  popular?: { label: string; href?: string; onClick?: () => void }[];
  primary?: { label: string; href?: string; onClick?: () => void };
  secondary?: { label: string; href: string };
  stats?: HeroStat[];
  /** Anything under the buttons (e.g. a "continue" note). */
  extra?: ReactNode;
}) {
  const [tour, setTour] = useState(false);
  const art = featureArt(meta.key);

  useEffect(() => {
    // Not over a lesson opened from a link (My Progress' "Continue").
    const deepLink = new URLSearchParams(window.location.search).has("lesson");
    if (meta.tour.length && !deepLink && !tourSeen(meta.key)) setTour(true);
  }, [meta.key, meta.tour.length]);

  const tourStats = stats?.slice(0, 2).map((s) => `${typeof s.value === "string" || typeof s.value === "number" ? s.value : ""} ${s.label.toLowerCase()}`.trim()).join(", ");

  return (
    <section className="fp-hero" style={{ ["--accent" as string]: meta.accent }}>
      <div className="fp-hero-in">
        <div>
          <span className="fp-kicker">{meta.title}</span>
          <h1>{meta.headline[0]} <span>{meta.headline[1]}</span></h1>
          <p className="fp-hero-tag">{meta.tagline}</p>
          {(search || onQuery) && (
            <FeatureSearch items={search} onQuery={onQuery} placeholder={placeholder ?? `Search ${meta.title.toLowerCase()}`} />
          )}
          {popular && popular.length > 0 && (
            <div className="fp-popular">
              <span>Popular:</span>
              {popular.map((p) => p.href
                ? <Link key={p.label} href={p.href} className="fp-chip">{p.label}</Link>
                : <button key={p.label} type="button" className="fp-chip" onClick={p.onClick}>{p.label}</button>)}
            </div>
          )}
          <div className="fp-hero-actions">
            {primary && (primary.href
              ? <Link href={primary.href} className="fp-btn fp-btn-pri">{primary.label} <Icon name="arrowRight" size={16} stroke={2} /></Link>
              : <button type="button" className="fp-btn fp-btn-pri" onClick={primary.onClick}>{primary.label} <Icon name="arrowRight" size={16} stroke={2} /></button>)}
            {secondary && <Link href={secondary.href} className="fp-btn">{secondary.label}</Link>}
            {meta.tour.length > 0 && (
              <button type="button" className="fp-tourbtn" onClick={() => setTour(true)}>
                <i><Icon name="play" size={11} stroke={2} /></i><span>Quick tour</span>
              </button>
            )}
          </div>
          {extra}
        </div>
        <div className="fp-hero-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art.src} srcSet={art.srcSet} sizes="(max-width: 820px) 320px, 540px" alt="" />
        </div>
        {stats && stats.length > 0 && (
          <div className="fp-stats">
            {stats.map((s) => <div key={s.label} className="fp-stat"><b>{s.value}</b><span>{s.label}</span></div>)}
          </div>
        )}
      </div>
      {tour && <FeatureTour meta={meta} stats={tourStats} onClose={() => setTour(false)} />}
      {meta.ctas && meta.ctas.length > 0 && (
        <div className="fp-ctas-wrap">
          <div className="fp-ctas-in">
            <span className="fp-kicker">Start here</span>
            <div className="fp-ctas">
              {meta.ctas.map((c) => (
                <Link key={c.href} href={c.href} className="fp-cta">
                  <span className="fp-cta-ic" aria-hidden="true"><Icon name={c.icon} size={20} stroke={1.9} /></span>
                  <span className="fp-cta-b"><b>{c.title}</b><small>{c.text}</small></span>
                  <span className="fp-cta-go" aria-hidden="true"><Icon name="arrowRight" size={16} stroke={2} /></span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
