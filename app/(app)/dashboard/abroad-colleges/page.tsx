'use client';

import { useState } from 'react';
import { Globe2 } from 'lucide-react';
import ModuleShell, { Card } from '@/components/dashboard/ModuleShell';
import { ABROAD_COLLEGES } from '@/constants/catalog';

export default function Page() {
  const [q, setQ] = useState('');
  const rows = ABROAD_COLLEGES.filter((c) =>
    (c.name + ' ' + c.country + ' ' + c.courses).toLowerCase().includes(q.toLowerCase()));

  return (
    <ModuleShell title="Abroad Colleges" icon={Globe2} accent="teal"
      description="Top global universities with QS World Ranking, indicative annual tuition and popular courses. Rankings: QS World University Rankings; fees are approximate — check official sites.">
      <Card className="p-4 sm:p-5">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by university, country or course…"
          className="w-full mb-4 px-4 py-2.5 rounded-lg border border-line bg-white text-sm focus:outline-none focus:ring-2 focus:ring-ink/10 focus:border-ink-4" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-4 border-b border-line">
                <th className="py-2 pr-3 font-semibold">University</th>
                <th className="py-2 pr-3 font-semibold">Country</th>
                <th className="py-2 pr-3 font-semibold">QS Rank</th>
                <th className="py-2 pr-3 font-semibold">Tuition (approx.)</th>
                <th className="py-2 font-semibold">Popular courses</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.name} className="border-b border-line-2 hover:bg-bg">
                  <td className="py-3 pr-3 font-semibold text-ink">{c.name}</td>
                  <td className="py-3 pr-3 text-ink-2">{c.country}</td>
                  <td className="py-3 pr-3 font-semibold text-ink-2">{c.qs}</td>
                  <td className="py-3 pr-3 text-ink-2">{c.tuition}</td>
                  <td className="py-3 text-ink-3">{c.courses}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="text-sm text-ink-4 py-6 text-center">No universities match “{q}”.</p>}
        </div>
      </Card>
    </ModuleShell>
  );
}
