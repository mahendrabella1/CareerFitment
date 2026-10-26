'use client';

/**
 * Career Library home - laid out like an encyclopedia: search first, browse
 * by field, the degree-roadmaps shelf, then every career as a sortable list.
 * Same data and filters as before (lib/data/careerLibrary930Plus.ts), in the
 * shared feature shell with its hero, search and first-visit tour.
 */
import { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@/app/Icons';
import { CAREER_LIBRARY_930_PLUS } from '@/lib/data/careerLibrary930Plus';
import { FEATURES } from '@/lib/features/catalog';
import { CoursePlayerShell } from '@/components/course/CoursePlayerShell';
import { FeatureHero } from '@/components/feature/FeatureHero';

const FIELDS = [
  { id: 'tech', name: 'Technology', icon: 'cpu' },
  { id: 'engineering', name: 'Engineering', icon: 'aptitude' },
  { id: 'business', name: 'Business & Management', icon: 'briefcase' },
  { id: 'health', name: 'Healthcare', icon: 'heart' },
  { id: 'creative', name: 'Arts & Creative', icon: 'sparkle' },
  { id: 'social', name: 'Social & Education', icon: 'users' },
  { id: 'science', name: 'Science', icon: 'flask' },
  { id: 'trades', name: 'Trades & Skills', icon: 'layers' },
];
const FIELD_NAME: Record<string, string> = Object.fromEntries(FIELDS.map((f) => [f.id, f.name]));
const PER_PAGE = 20;
const SORTS = ['A to Z', 'Salary (high to low)'] as const;

const careerType = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('engineer') || t.includes('developer')) return 'Technical';
  if (t.includes('manager') || t.includes('consultant')) return 'Management';
  if (t.includes('doctor') || t.includes('nurse')) return 'Healthcare';
  return 'Professional';
};
const lakh = (n?: number) => (n ? `₹${(n / 100000).toFixed(n >= 1000000 ? 0 : 1)}L` : '');

export default function CareerLibraryPage() {
  const pathname = usePathname() ?? '';
  const meta = FEATURES.careers;
  const listRef = useRef<HTMLElement>(null);
  const [search, setSearch] = useState('');
  const [field, setField] = useState('All');
  const [type, setType] = useState('All');
  const [sort, setSort] = useState<(typeof SORTS)[number]>('A to Z');
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const x of CAREER_LIBRARY_930_PLUS) c[x.clusterId] = (c[x.clusterId] ?? 0) + 1;
    return c;
  }, []);
  const highDemand = useMemo(() => CAREER_LIBRARY_930_PLUS.filter((c) => c.currentDemand === 'high').length, []);

  const careers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = CAREER_LIBRARY_930_PLUS.filter((c) => {
      const hay = `${c.name} ${c.clusterId} ${c.overview} ${(c.skills ?? []).join(' ')}`.toLowerCase();
      return (!q || hay.includes(q)) && (field === 'All' || c.clusterId === field) && (type === 'All' || careerType(c.name) === type);
    });
    return sort === 'A to Z'
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : [...list].sort((a, b) => (b.salaryRange?.[0]?.max ?? 0) - (a.salaryRange?.[0]?.max ?? 0));
  }, [search, field, type, sort]);

  const pages = Math.max(1, Math.ceil(careers.length / PER_PAGE));
  const shown = careers.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const toList = () => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const pickField = (id: string) => { setField(id); setPage(1); toList(); };

  return (
    <CoursePlayerShell
      accent={meta.accent}
      banner={{ title: meta.title, icon: 'book', backHref: '/account', backLabel: 'Dashboard' }}
      tabs={[
        { href: '/account/career-library', label: 'All careers', active: pathname === '/account/career-library' },
        { href: '/account/career-library/roadmaps', label: 'Degree roadmaps', active: false },
      ]}
    >
      <div className="fp" style={{ ['--accent' as string]: meta.accent }}>
        <FeatureHero
          meta={meta}
          onQuery={(q) => { setSearch(q); setPage(1); }}
          placeholder="Search a career, skill or subject - e.g. doctor, design, coding"
          popular={FIELDS.slice(0, 4).map((f) => ({ label: f.name, onClick: () => pickField(f.id) }))}
          primary={{ label: 'Browse all careers', onClick: toList }}
          secondary={{ label: 'Degree roadmaps', href: '/account/career-library/roadmaps' }}
          stats={[
            { value: CAREER_LIBRARY_930_PLUS.length, label: 'careers explained' },
            { value: FIELDS.length, label: 'fields to browse' },
            { value: highDemand, label: 'in high demand now' },
            { value: '1,500+', label: 'degree roadmaps' },
          ]}
        />

        {search && (
          <p className="fp-muted" style={{ marginTop: 20 }}>{careers.length} careers match &quot;{search}&quot; - <button className="fp-link" style={{ fontSize: 13 }} onClick={toList}>see them</button></p>
        )}

        <section className="fp-sec">
          <div className="fp-sec-h"><div><h2>Browse by field</h2><p>Pick a field to see every career in it.</p></div></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {FIELDS.map((f) => (
              <button key={f.id} className="fp-tool" style={{ font: 'inherit', textAlign: 'left', cursor: 'pointer', outline: field === f.id ? '2px solid var(--ink)' : undefined }} onClick={() => pickField(f.id)}>
                <span className="fp-ic"><Icon name={f.icon} size={19} stroke={1.8} /></span>
                <span><b>{f.name}</b><small>{counts[f.id] ?? 0} careers</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="fp-sec">
          <Link href="/account/career-library/roadmaps" className="fp-card" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1fr) auto', gap: 18, alignItems: 'center', padding: '18px 20px', textDecoration: 'none', color: 'inherit' }}>
            <span className="fp-ic" style={{ width: 48, height: 48 }}><Icon name="route" size={22} stroke={1.8} /></span>
            <span><b className="fp-display" style={{ fontSize: 17, fontWeight: 600, display: 'block' }}>Degree roadmaps for 1,500+ careers</b>
              <span className="fp-muted" style={{ fontSize: 14 }}>A year-by-year plan for your exact degree: skills, internships, certifications, jobs, PG and study abroad.</span></span>
            <span className="fp-btn fp-btn-sm">Browse roadmaps <Icon name="arrowRight" size={14} stroke={2} /></span>
          </Link>
        </section>

        <section className="fp-sec" ref={listRef} style={{ scrollMarginTop: 120 }}>
          <div className="fp-sec-h">
            <div><h2>{field === 'All' ? 'All careers' : FIELD_NAME[field]}</h2><p>{careers.length} careers{search ? ` matching "${search}"` : ''} · page {page} of {pages}</p></div>
          </div>
          <div className="fp-dir">
            <div className="fp-dir-h" style={{ gap: 8 }}>
              <button className="fp-chip" aria-pressed={field === 'All'} onClick={() => { setField('All'); setPage(1); }}>All fields</button>
              {FIELDS.map((f) => <button key={f.id} className="fp-chip" aria-pressed={field === f.id} onClick={() => { setField(f.id); setPage(1); }}>{f.name.split(' ')[0]}</button>)}
              <span style={{ flex: 1 }} />
              <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} aria-label="Career type" className="fp-chip" style={{ paddingRight: 8 }}>
                {['All', 'Technical', 'Management', 'Healthcare', 'Professional'].map((t) => <option key={t} value={t}>{t === 'All' ? 'Any type' : t}</option>)}
              </select>
              <select value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])} aria-label="Sort" className="fp-chip" style={{ paddingRight: 8 }}>
                {SORTS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {shown.map((c) => {
              const inr = c.salaryRange?.find((s) => s.currency === 'INR');
              return (
                <Link key={c.id + c.name} href={`/account/career-library/${encodeURIComponent(c.name)}`} className="fp-row is-wide">
                  <b>{c.name}</b>
                  <span>{FIELD_NAME[c.clusterId] ?? c.clusterId}</span>
                  <span>{c.currentDemand === 'high' ? 'High demand' : 'Steady demand'}</span>
                  <span className="fp-sal">{inr ? `${lakh(inr.min)}-${lakh(inr.max)}` : ''}</span>
                  <Icon name="arrowRight" size={16} stroke={2} />
                </Link>
              );
            })}
            {careers.length === 0 && <p className="fp-muted" style={{ padding: 16, margin: 0 }}>No career matches. Try a shorter word, or clear the filters.</p>}
          </div>
          <p className="fp-muted" style={{ marginTop: 8 }}>Salary: typical yearly pay in India for 0-2 years&apos; experience (₹L = lakh).</p>
          {pages > 1 && (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
              <button className="fp-chip" disabled={page === 1} onClick={() => { setPage(page - 1); toList(); }} aria-label="Previous page">←</button>
              {Array.from({ length: Math.min(5, pages) }, (_, i) => {
                const n = page <= 3 ? i + 1 : page >= pages - 2 ? pages - 4 + i : page - 2 + i;
                return n >= 1 && n <= pages ? <button key={n} className="fp-chip" aria-pressed={n === page} onClick={() => { setPage(n); toList(); }}>{n}</button> : null;
              })}
              <button className="fp-chip" disabled={page === pages} onClick={() => { setPage(page + 1); toList(); }} aria-label="Next page">→</button>
            </div>
          )}
        </section>
      </div>
    </CoursePlayerShell>
  );
}
