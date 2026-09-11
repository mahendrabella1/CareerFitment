'use client';

import Link from 'next/link';
import { Rocket, Award, ExternalLink, ArrowRight, Briefcase } from 'lucide-react';
import ModuleShell, { Card } from '@/components/dashboard/ModuleShell';
import { LEARN_PATHS, SCHOLARSHIPS } from '@/constants/catalog';

export default function Page() {
  return (
    <ModuleShell title="Career Boosters" icon={Rocket} accent="amber"
      description="Free, step-by-step learning paths, real scholarships and virtual internships to get ahead — every resource below is free and links to its official source.">

      {/* Learn paths */}
      <h3 className="font-semibold text-ink mb-1">Free learning paths</h3>
      <p className="text-sm text-ink-3 mb-4">Pick a track and follow the steps — all resources are free.</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {LEARN_PATHS.map((p) => (
          <Card key={p.title} className="p-5 flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <p className="font-semibold text-ink">{p.title}</p>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md border border-line text-ink-3">{p.tag}</span>
            </div>
            <p className="text-sm text-ink-3 mb-3">{p.blurb}</p>
            <ol className="space-y-1.5 mb-3 flex-1">
              {p.steps.map((s, i) => (
                <li key={s} className="flex gap-2 text-xs text-ink-2">
                  <span className="w-4 h-4 shrink-0 rounded-full bg-line-2 text-ink-2 text-[10px] font-semibold flex items-center justify-center">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-2 pt-3 border-t border-line-2">
              {p.resources.map((r) => (
                <a key={r.url} href={r.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-2 border border-line px-2.5 py-1 rounded-md hover:border-ink-4/50 hover:text-ink transition-colors">
                  {r.label} <ExternalLink className="w-3 h-3" />
                </a>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Virtual internships CTA */}
      <Link href="/dashboard/internships" className="block mb-8">
        <Card className="p-5 flex items-center gap-4 hover:border-ink-4/40 hover:shadow-md transition-all">
          <div className="w-11 h-11 rounded-lg border border-line bg-bg flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-ink-2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-sm">150+ Virtual Internships (Class 6–12)</p>
            <p className="text-xs text-ink-4">Free job simulations & programs from Forage, Google, IBM, NASA, ISRO and more — filter by your class.</p>
          </div>
          <ArrowRight className="w-4 h-4 text-ink-4 shrink-0" />
        </Card>
      </Link>

      {/* Scholarships */}
      <div className="flex items-center gap-2 mb-3"><Award className="w-4 h-4 text-ink-3" /><h3 className="font-semibold text-ink">Scholarships</h3></div>
      <p className="text-xs text-ink-4 mb-3 -mt-2">Real, official scholarships — amounts are indicative; confirm current terms on the official page.</p>
      <Card className="divide-y divide-line-2">
        {SCHOLARSHIPS.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer"
            className="flex items-center justify-between gap-4 p-4 hover:bg-bg transition-colors">
            <div className="min-w-0">
              <p className="font-semibold text-ink text-sm">{s.name}</p>
              <p className="text-xs text-ink-4 mt-0.5">{s.for}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-ink-2">{s.amount}</span>
              <ExternalLink className="w-3.5 h-3.5 text-ink-4" />
            </div>
          </a>
        ))}
      </Card>
    </ModuleShell>
  );
}
