'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, type LucideIcon } from 'lucide-react';

/** Per-module accent (kept for API compatibility; used only as a subtle icon tint). */
export const ACCENTS = {
  red: ['#E0242E', '#9B1B22'],
  blue: ['#2D7FF0', '#16356B'],
  indigo: ['#6366F1', '#3B2E8F'],
  teal: ['#11998E', '#0A5E58'],
  amber: ['#F59E0B', '#B45309'],
  green: ['#27AE60', '#176B3A'],
  violet: ['#9B51E0', '#5B2E94'],
} as const;
export type AccentKey = keyof typeof ACCENTS;

export default function ModuleShell({
  title, description, icon: Icon, children, action, accent = 'red',
}: {
  title: string; description: string; icon: LucideIcon; children: React.ReactNode;
  action?: React.ReactNode; accent?: AccentKey;
}) {
  const [tint] = ACCENTS[accent];
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-3 hover:text-ink mb-5">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="mb-7 flex flex-col sm:flex-row sm:items-center gap-4 border-b border-line pb-6">
        <div className="w-12 h-12 rounded-xl border border-line bg-white shadow-sm flex items-center justify-center shrink-0"
          style={{ color: tint }}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
          <p className="text-ink-3 text-sm max-w-2xl mt-1 leading-relaxed">{description}</p>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </motion.div>

      {children}
    </div>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-line rounded-xl shadow-sm ${className}`}>{children}</div>;
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <span className="inline-block px-2 py-0.5 rounded-md bg-line-2 text-ink-2 text-xs font-semibold">{children}</span>;
}
