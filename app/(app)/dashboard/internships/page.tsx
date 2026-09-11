'use client';

import { useMemo, useState } from 'react';
import { Briefcase, ExternalLink, BookOpen, FlaskConical, Trophy, Wrench, Building2, Search, type LucideIcon } from 'lucide-react';
import ModuleShell, { Card } from '@/components/dashboard/ModuleShell';
import { VIRTUAL_INTERNSHIPS, type ProgramType } from '@/constants/catalog';

const CLASSES = [6, 7, 8, 9, 10, 11, 12];
const TYPES: ProgramType[] = ['Job Simulation', 'Course', 'Research', 'Competition', 'Hands-on', 'Internship'];

const TYPE_ICON: Record<ProgramType, LucideIcon> = {
  'Job Simulation': Briefcase, Course: BookOpen, Research: FlaskConical,
  Competition: Trophy, 'Hands-on': Wrench, Internship: Building2,
};

// One restrained accent per type — a small dot on a neutral badge, not a colour block.
const TYPE_DOT: Record<ProgramType, string> = {
  'Job Simulation': '#E0242E', Course: '#2D7FF0', Research: '#9B51E0',
  Competition: '#B45309', 'Hands-on': '#27AE60', Internship: '#0A5E58',
};

export default function Page() {
  const [cls, setCls] = useState<number | 'all'>('all');
  const [type, setType] = useState<ProgramType | 'all'>('all');
  const [q, setQ] = useState('');

  const rows = useMemo(
    () =>
      VIRTUAL_INTERNSHIPS.filter((p) => {
        if (cls !== 'all' && (cls < p.minGrade || cls > p.maxGrade)) return false;
        if (type !== 'all' && p.type !== type) return false;
        if (q && !(p.title + ' ' + p.provider + ' ' + p.domain).toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [cls, type, q]
  );

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
      active ? 'bg-ink text-white border-ink' : 'bg-white text-ink-2 border-line hover:border-ink-4/40'
    }`;

  return (
    <ModuleShell title="Virtual Internships & Programs" icon={Briefcase} accent="blue"
      description="150+ free virtual internships, job simulations, certifications and research programs for Class 6–12, curated from official sources. Filter by class and type, then apply on the official page.">

      {/* filters */}
      <Card className="p-4 mb-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-ink-4 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search programs, providers or fields…"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink-4" />
          </div>
          <select value={type} onChange={(e) => setType(e.target.value as ProgramType | 'all')}
            className="px-3 py-2 rounded-lg border border-line bg-white text-sm text-ink-2 focus:outline-none focus:ring-2 focus:ring-ink/10">
            <option value="all">All types</option>
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-line-2">
          <span className="text-xs font-semibold text-ink-3 uppercase tracking-wide mr-1">Class</span>
          <button onClick={() => setCls('all')} className={chip(cls === 'all')}>All</button>
          {CLASSES.map((c) => (
            <button key={c} onClick={() => setCls(c)} className={chip(cls === c)}>{c}</button>
          ))}
        </div>
      </Card>

      <p className="text-xs text-ink-4 mb-4">
        {rows.length} program{rows.length === 1 ? '' : 's'}
        {cls !== 'all' ? ` · Class ${cls}` : ''}{type !== 'all' ? ` · ${type}` : ''} · all free
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rows.map((p) => {
          const Icon = TYPE_ICON[p.type];
          return (
            <a key={p.title + p.provider} href={p.url} target="_blank" rel="noreferrer" className="group">
              <Card className="p-5 h-full flex flex-col hover:border-ink-4/40 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg border border-line bg-bg flex items-center justify-center shrink-0">
                    <Icon className="w-[18px] h-[18px] text-ink-2" />
                  </div>
                  <ExternalLink className="w-4 h-4 text-ink-4 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
                <span className="self-start inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-3 border border-line rounded-md px-2 py-0.5 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: TYPE_DOT[p.type] }} />
                  {p.type}
                </span>
                <p className="font-semibold text-ink text-sm leading-snug">{p.title}</p>
                <p className="text-xs text-ink-4 mt-1">{p.provider} · {p.domain}</p>
                <div className="flex-1" />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-line-2">
                  <span className="text-[11px] font-medium text-ink-3">Class {p.minGrade}–{p.maxGrade}</span>
                  <span className="text-[11px] text-ink-4">{p.effort}</span>
                </div>
              </Card>
            </a>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p className="text-sm text-ink-4 py-8 text-center">No programs match these filters — try clearing the search or choosing “All”.</p>
      )}

      <p className="text-[11px] text-ink-4 mt-6 leading-relaxed">
        All links open the official program pages. Programs are free; some (e.g. NASA, ISRO, Smithsonian) are application-based and may have age or region eligibility — always confirm on the official page. Younger students should take guided programs with a parent or teacher.
      </p>
    </ModuleShell>
  );
}
