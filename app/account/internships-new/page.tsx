'use client';

/**
 * Internships home - a programme listing in the job board's style: search
 * first, level and industry filters, then each free programme as a row with
 * its company, level, length and top skills. Same data as before
 * (lib/data/careerLoader.ts), in the shared feature shell with its hero,
 * search and first-visit tour.
 */
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/app/Icons';
import { getAllInternships } from '@/lib/data/careerLoader';
import { FEATURES } from '@/lib/features/catalog';
import { CoursePlayerShell } from '@/components/course/CoursePlayerShell';
import { FeatureHero } from '@/components/feature/FeatureHero';

type Program = ReturnType<typeof getAllInternships>[number];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const PER_PAGE = 24;

const ROW_CSS = `
.in-row{display:grid;grid-template-columns:44px minmax(0,1.6fr) minmax(0,1fr) 120px auto;gap:16px;align-items:center;padding:14px 16px;border-top:1px solid #f0ede8;text-decoration:none;color:var(--ink)}
.in-row:first-child{border-top:0}
.in-row:hover{background:#fcfbf9}
.in-logo{width:44px;height:44px;border-radius:8px;border:1px solid var(--line);background:var(--soft);display:grid;place-items:center;font-family:Poppins,Inter,sans-serif;font-weight:700;font-size:16px;color:var(--ink2)}
.in-row b{display:block;font-size:14.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.in-row small{display:block;font-size:12.5px;color:var(--mute);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.in-skills{font-size:12.5px;color:var(--ink2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.in-meta{font-size:12.5px;color:var(--ink2)}
@media (max-width:820px){.in-row{grid-template-columns:40px minmax(0,1fr) auto}.in-skills,.in-meta{display:none}}
`;

export default function InternshipsPage() {
  const meta = FEATURES.internships;
  const listRef = useRef<HTMLElement>(null);
  const all = useMemo(() => getAllInternships(), []);
  const [q, setQ] = useState('');
  const [level, setLevel] = useState<string | null>(null);
  const [industry, setIndustry] = useState<string | null>(null);
  const [limit, setLimit] = useState(PER_PAGE);

  // Built from the programmes' own industry tags, so every option matches something.
  const industries = useMemo(() => {
    const c = new Map<string, number>();
    for (const p of all) for (const t of (p.industry ?? []) as string[]) c.set(t, (c.get(t) ?? 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k);
  }, [all]);
  const companies = useMemo(() => new Set(all.map((p) => p.company)).size, [all]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return all.filter((p: Program) =>
      (!s || `${p.title} ${p.company} ${p.overview} ${((p.skillsGained ?? []) as string[]).join(' ')}`.toLowerCase().includes(s)) &&
      (!level || p.difficulty === level) &&
      (!industry || ((p.industry ?? []) as string[]).includes(industry)));
  }, [all, q, level, industry]);

  const toList = () => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <CoursePlayerShell accent={meta.accent} banner={{ title: meta.title, icon: 'briefcase', backHref: '/account', backLabel: 'Dashboard' }}>
      <style dangerouslySetInnerHTML={{ __html: ROW_CSS }} />
      <div className="fp" style={{ ['--accent' as string]: meta.accent }}>
        <FeatureHero
          meta={meta}
          onQuery={(v) => { setQ(v); setLimit(PER_PAGE); }}
          placeholder="Search programmes, companies or skills"
          popular={industries.slice(0, 4).map((t) => ({ label: t, onClick: () => { setIndustry(t); toList(); } }))}
          primary={{ label: 'Browse programmes', onClick: toList }}
          secondary={{ label: 'Paid internships and jobs', href: '/account/jobs' }}
          stats={[
            { value: all.length, label: 'free programmes' },
            { value: companies, label: 'companies' },
            { value: all.filter((p) => p.difficulty === 'Beginner').length, label: 'for beginners' },
            { value: '₹0', label: 'to join any of them' },
          ]}
        />

        <section className="fp-sec" ref={listRef} style={{ scrollMarginTop: 120 }}>
          <div className="fp-sec-h">
            <div><h2>{industry ?? 'All programmes'}</h2><p>{list.length} programmes{q ? ` matching "${q}"` : ''}{level ? ` · ${level}` : ''}</p></div>
            {(level || industry || q) && <button className="fp-link" style={{ fontSize: 13 }} onClick={() => { setLevel(null); setIndustry(null); }}>Clear filters</button>}
          </div>
          <div className="fp-dir">
            <div className="fp-dir-h" style={{ gap: 8 }}>
              <button className="fp-chip" aria-pressed={!level} onClick={() => setLevel(null)}>Any level</button>
              {LEVELS.map((l) => <button key={l} className="fp-chip" aria-pressed={level === l} onClick={() => setLevel(level === l ? null : l)}>{l}</button>)}
              <span style={{ flex: 1 }} />
              <select className="fp-chip" value={industry ?? ''} onChange={(e) => setIndustry(e.target.value || null)} aria-label="Industry">
                <option value="">Any industry</option>
                {industries.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {list.slice(0, limit).map((p) => (
              <Link key={p.id} href={`/account/internships-new/${p.id}`} className="in-row">
                <span className="in-logo" aria-hidden="true">{p.company.charAt(0)}</span>
                <span style={{ minWidth: 0 }}><b>{p.title}</b><small>{p.company}{p.rating ? ` · ${p.rating}★` : ''}</small></span>
                <span className="in-skills">{((p.skillsGained ?? []) as string[]).slice(0, 3).join(' · ')}</span>
                <span className="in-meta">{p.difficulty}{p.duration ? <><br /><span style={{ color: 'var(--mute)' }}>{p.duration}</span></> : null}</span>
                <span className="fp-btn fp-btn-sm">View <Icon name="arrowRight" size={14} stroke={2} /></span>
              </Link>
            ))}
            {list.length === 0 && <p className="fp-muted" style={{ padding: 16, margin: 0 }}>No programme matches. Try a shorter word or clear the filters.</p>}
            {list.length > limit && <button className="fp-more" onClick={() => setLimit(limit + PER_PAGE)}>Show {Math.min(PER_PAGE, list.length - limit)} more of {list.length - limit}</button>}
          </div>
          <p className="fp-muted" style={{ marginTop: 10 }}>Every programme here is free. You apply and learn on the provider&apos;s own site - OneGrasp never charges for an internship.</p>
        </section>
      </div>
    </CoursePlayerShell>
  );
}
