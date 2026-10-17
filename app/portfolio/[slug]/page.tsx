'use client';

/**
 * /portfolio/[slug] - a student's public portfolio page (made public from
 * /account/portfolio). Shows only what /api/portfolio/public/[slug] returns.
 */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, Link as LinkIcon } from 'lucide-react';
import type { PortfolioProfile } from '@/lib/data/portfolioSchema';

const CSS = `
.pp{min-height:100vh;background:#f6f7f9;color:#111827;font-family:Inter,system-ui,'Segoe UI',sans-serif}
.pp *{box-sizing:border-box}
.pp-head{background:#fff;border-bottom:1px solid #e5e7eb}
.pp-head-in{max-width:1080px;margin:0 auto;padding:36px 24px 28px;display:flex;gap:24px;align-items:center;flex-wrap:wrap}
.pp-av{flex:none;width:96px;height:96px;border-radius:50%;display:grid;place-items:center;background:#eef2ff;color:#3730a3;font-size:38px;font-weight:700}
.pp-who{flex:1 1 320px;min-width:0}
.pp-who h1{font-size:28px;line-height:1.2;margin:0;letter-spacing:-.02em}
.pp-line{font-size:15px;color:#374151;margin-top:6px;line-height:1.5}
.pp-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pp-meta span{font-size:12.5px;color:#374151;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:999px;padding:4px 10px}
.pp-contact{display:flex;gap:8px;flex-wrap:wrap}
.pp-btn{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;padding:9px 14px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;text-decoration:none}
.pp-btn.primary{background:#2563eb;border-color:#2563eb;color:#fff}
.pp-body{max-width:1080px;margin:0 auto;padding:24px;display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:24px;align-items:start}
.pp-col{display:flex;flex-direction:column;gap:16px;min-width:0}
.pp-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px}
.pp-card h2{font-size:16px;margin:0 0 12px}
.pp-item{padding:12px 0;border-top:1px solid #f0f1f3}
.pp-item:first-of-type{border-top:0;padding-top:0}
.pp-t{font-size:14.5px;font-weight:600}
.pp-s{font-size:13px;color:#4b5563;margin-top:2px}
.pp-d{font-size:12.5px;color:#6b7280;margin-top:2px}
.pp-p{font-size:13.5px;color:#374151;line-height:1.6;margin:6px 0 0;white-space:pre-wrap}
.pp-chips{display:flex;flex-wrap:wrap;gap:6px}
.pp-chip{font-size:12.5px;font-weight:500;padding:5px 11px;border-radius:999px;background:#f3f4f6;border:1px solid #e5e7eb}
.pp-links a{display:flex;align-items:center;gap:8px;font-size:13.5px;color:#2563eb;text-decoration:none;padding:4px 0;overflow-wrap:anywhere}
.pp-foot{text-align:center;font-size:12px;color:#6b7280;padding:24px 16px 32px}
.pp-center{min-height:100vh;display:grid;place-items:center;text-align:center;padding:24px}
@media (max-width:860px){.pp-body{grid-template-columns:minmax(0,1fr);padding:16px}.pp-head-in{padding:24px 16px}.pp-card{padding:16px}.pp-who h1{font-size:24px}}
`;

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmtMonth = (m?: string) => {
  const [y, mo] = (m || '').split('-');
  return y && mo ? `${MONTHS[Number(mo) - 1] ?? ''} ${y}` : '';
};
const span = (start?: string, end?: string, current?: boolean) => {
  const a = fmtMonth(start);
  const b = current ? 'Present' : fmtMonth(end);
  return a || b ? `${a || '…'} – ${b || '…'}` : '';
};

export default function PublicPortfolioPage({ params }: { params: { slug: string } }) {
  const [portfolio, setPortfolio] = useState<PortfolioProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/portfolio/public/${encodeURIComponent(params.slug)}`)
      .then(async (res) => {
        if (res.ok) setPortfolio(await res.json());
        else setError(res.status === 404 ? 'This portfolio is private or no longer exists.' : 'This portfolio could not be loaded.');
      })
      .catch(() => setError('This portfolio could not be loaded.'));
  }, [params.slug]);

  if (!portfolio) {
    return (
      <div className="pp">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="pp-center">
          {error ? (
            <div>
              <h1 style={{ fontSize: 24, margin: '0 0 8px' }}>Portfolio not available</h1>
              <p style={{ color: '#6b7280', margin: '0 0 20px' }}>{error}</p>
              <Link href="/" className="pp-btn primary">Go to OneGrasp</Link>
            </div>
          ) : <p style={{ color: '#6b7280' }}>Loading portfolio…</p>}
        </div>
      </div>
    );
  }

  const p = portfolio;
  const name = p.displayName || p.headline;
  const links = [
    { href: p.linkedin, label: 'LinkedIn' },
    { href: p.github, label: 'GitHub' },
    { href: p.website, label: 'Website' },
    { href: p.twitter, label: 'X (Twitter)' },
  ].filter((l) => l.href);
  const updated = new Date(p.lastUpdated);

  return (
    <div className="pp">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="pp-head">
        <div className="pp-head-in">
          <div className="pp-av" aria-hidden="true">{name.charAt(0).toUpperCase()}</div>
          <div className="pp-who">
            <h1>{name}</h1>
            {p.displayName && <div className="pp-line">{p.headline}</div>}
            <div className="pp-meta">
              {p.location && <span>{p.location}</span>}
              {p.careerFit && <span>Aiming for: {p.careerFit}</span>}
            </div>
          </div>
          <div className="pp-contact">
            {p.showEmail && p.email && <a className="pp-btn primary" href={`mailto:${p.email}`}><Mail size={15} /> Email</a>}
            {p.showPhone && p.phone && <a className="pp-btn" href={`tel:${p.phone}`}><Phone size={15} /> Call</a>}
          </div>
        </div>
      </header>

      <div className="pp-body">
        <div className="pp-col">
          {p.bio && <section className="pp-card"><h2>About</h2><p className="pp-p" style={{ marginTop: 0 }}>{p.bio}</p></section>}
          {p.experience.length > 0 && (
            <section className="pp-card">
              <h2>Projects & experience</h2>
              {p.experience.map((x) => (
                <div key={x.id} className="pp-item">
                  <div className="pp-t">{x.title}</div>
                  <div className="pp-s">{x.company}{x.location ? ` · ${x.location}` : ''}</div>
                  {span(x.startDate, x.endDate, x.currentlyWorking) && <div className="pp-d">{span(x.startDate, x.endDate, x.currentlyWorking)}</div>}
                  {x.description && <p className="pp-p">{x.description}</p>}
                </div>
              ))}
            </section>
          )}
          {p.education.length > 0 && (
            <section className="pp-card">
              <h2>Education</h2>
              {p.education.map((x) => (
                <div key={x.id} className="pp-item">
                  <div className="pp-t">{x.institution}</div>
                  {(x.degree || x.field) && <div className="pp-s">{[x.degree, x.field].filter(Boolean).join(' · ')}</div>}
                  {span(x.startDate, x.endDate, x.currentlyStudying) && <div className="pp-d">{span(x.startDate, x.endDate, x.currentlyStudying)}</div>}
                  {x.description && <p className="pp-p">{x.description}</p>}
                </div>
              ))}
            </section>
          )}
          {p.certifications.length > 0 && (
            <section className="pp-card">
              <h2>Certificates & awards</h2>
              {p.certifications.map((x) => (
                <div key={x.id} className="pp-item">
                  <div className="pp-t">{x.name}</div>
                  {(x.issuer || x.issueDate) && <div className="pp-s">{[x.issuer, fmtMonth(x.issueDate)].filter(Boolean).join(' · ')}</div>}
                  {x.credentialUrl && <a className="pp-d" style={{ color: '#2563eb' }} href={x.credentialUrl} target="_blank" rel="noopener noreferrer">View certificate ↗</a>}
                </div>
              ))}
            </section>
          )}
        </div>

        <div className="pp-col">
          {p.skills.length > 0 && (
            <section className="pp-card">
              <h2>Skills</h2>
              <div className="pp-chips">{p.skills.map((s) => <span key={s.id} className="pp-chip">{s.name}</span>)}</div>
            </section>
          )}
          {links.length > 0 && (
            <section className="pp-card pp-links">
              <h2>Links</h2>
              {links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"><LinkIcon size={14} />{l.label}</a>)}
            </section>
          )}
          <section className="pp-card" style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>
            <div>{p.views} {p.views === 1 ? 'view' : 'views'}</div>
            {!Number.isNaN(updated.getTime()) && <div>Updated {updated.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>}
          </section>
        </div>
      </div>
      <footer className="pp-foot">Made with OneGrasp</footer>
    </div>
  );
}
