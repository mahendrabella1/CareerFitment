'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Loader2, MessageCircle, Phone, Mail, Sparkles, CheckCircle2,
  Building2, Globe2, Plane, FileText, Library, Rocket, Search,
  Briefcase, GraduationCap, TrendingUp, type LucideIcon, BarChart3, Lightbulb, DollarSign, LogOut,
} from 'lucide-react';
import { getSession } from '@/lib/firebase';
import { getLastReportId, getLocalReport } from '@/lib/report-store';
import type { PsychometricProfile } from '@/lib/psychometric';

type MenuItem = { title: string; icon: LucideIcon; href: string };
type Module = { title: string; desc: string; icon: LucideIcon; href: string; color: string };

const MENU_ITEMS: MenuItem[] = [
  { title: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { title: 'Career Analysis', icon: Search, href: '/dashboard/career-analysis' },
  { title: 'India Colleges', icon: Building2, href: '/dashboard/india-colleges' },
  { title: 'Abroad Colleges', icon: Globe2, href: '/dashboard/abroad-colleges' },
  { title: 'Abroad Applications', icon: Plane, href: '/dashboard/abroad-applications' },
  { title: 'Exams', icon: FileText, href: '/dashboard/exams' },
  { title: 'Career Library', icon: Library, href: '/dashboard/career-library' },
  { title: 'Career Boosters', icon: Rocket, href: '/dashboard/career-boosters' },
  { title: 'Research', icon: BarChart3, href: '/dashboard/research' },
  { title: 'Startups', icon: Lightbulb, href: '/dashboard/startups' },
  { title: 'Financial Literacy', icon: DollarSign, href: '/dashboard/financial-literacy' },
];

const MODULES: Module[] = [
  { title: 'Get Your Website', desc: 'Publish your Personal Website in 15 Min', icon: Globe2, href: '/dashboard', color: '#F59E0B' },
  { title: 'Inner Circle Post', desc: 'Post what\'s in your Mind and Achievements', icon: MessageCircle, href: '/dashboard', color: '#2D7FF0' },
  { title: 'Alumni Connections', desc: 'Connect directly to your Batchmates and Alumni', icon: GraduationCap, href: '/dashboard', color: '#EB5757' },
  { title: 'India Colleges', desc: 'Access to 10000+ Indian colleges, 1.5 Lac + Courses across India. Get your admission Prediction, College information, fees and many more. Start doing shortlisting of colleges through add milestones.', icon: Building2, href: '/dashboard/india-colleges', color: '#27AE60' },
  { title: 'Online India Admissions', desc: 'Your trusted gateway to India\'s top colleges – explore, compare, and secure admissions online with ease, transparency, and confidence.', icon: FileText, href: '/dashboard', color: '#11998E' },
  { title: 'Abroad Colleges', desc: 'Access to 8000+ top International universities and colleges across 22+ countries. Get complete details like fees, Ranking, Benefits, Courses etc.', icon: Globe2, href: '/dashboard/abroad-colleges', color: '#6366F1' },
  { title: 'Abroad Applications Processing', desc: 'Get done your study abroad profiling in 15 Min. Submit your Applications directly to Top most universities across Globe. Get Full application submission, SOP and visa assistance.', icon: Plane, href: '/dashboard/abroad-applications', color: '#2D9CDB' },
  { title: 'Exams', desc: 'Entrance Test information for getting admission into various undergraduate, post graduate and professional degree courses. More then 1400+ entrance test details', icon: FileText, href: '/dashboard/exams', color: '#F59E0B' },
  { title: 'Career Library', desc: 'Get complete career information of more than 3000+ career options at career library. Explore career options, get career guidance and education plan at one place. Highly recommended career encyclopedia in India.', icon: Library, href: '/dashboard/career-library', color: '#9B51E0' },
  { title: 'Career Boosters', desc: 'Career boosters is the largest online store for students and professionals to excel in your education and career path. We have craked the best deals and picked best programs from industry from you. All integrated in your Career Lab.', icon: Rocket, href: '/dashboard/career-boosters', color: '#27AE60' },
  { title: 'Online Courses', desc: 'Unlimited Access To online couses, skills and personal development Anytime. Inhouse developed on demand programs for school students, graduates adn professionals.', icon: Library, href: '/dashboard', color: '#2D7FF0' },
  { title: 'Scholarships', desc: 'Get access to scholarships available for school and college students. Get up to 100% Scholarship for deserving candidates.', icon: Sparkles, href: '/dashboard', color: '#F59E0B' },
];

export default function DashboardPage() {
  const [name, setName] = useState('');
  const [report, setReport] = useState<PsychometricProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    if (session?.name) setName(session.name);
    const lastId = getLastReportId();
    if (lastId) {
      const local = getLocalReport(lastId);
      if (local) setReport(local);
    }
    setLoading(false);
  }, []);

  const firstName = (name || report?.name || 'there').split(' ')[0];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-7 h-7 animate-spin" style={{ color: '#db3433' }} /></div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ---- SIDEBAR ---- */}
      <div className="w-64 border-r border-gray-200 bg-white p-6 fixed h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg" style={{ background: '#db3433' }}></div>
            <span className="font-bold text-lg text-black">OneGrasp</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
            <div className="w-10 h-10 rounded-full" style={{ background: '#db3433' }}></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-black truncate">{firstName}</p>
              <p className="text-xs text-gray-500 truncate">Profile</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2 mb-8">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium group">
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 pt-4">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">
            <LogOut className="w-5 h-5 text-gray-400" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* ---- MAIN CONTENT ---- */}
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* ---- HEADER ---- */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black">Welcome back, {firstName}</h1>
              <p className="text-gray-600 mt-1">Explore your career path and discover opportunities</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full" style={{ background: '#db3433' }}></div>
            </div>
          </div>

          {/* ---- MODULES GRID ---- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MODULES.map((module, i) => {
              const Icon = module.icon;
              return (
                <motion.div key={module.title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 * i }}>
                  <Link href={module.href}
                    className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-lg flex items-center justify-center transition-colors" style={{ background: `${module.color}20` }}>
                        <Icon className="w-6 h-6" style={{ color: module.color }} />
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                    </div>
                    <h3 className="font-bold text-black text-lg mb-2">{module.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-1">{module.desc}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: module.color }}>
                      Start Now
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ---- COUNSELLING SECTION ---- */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="md:col-span-2 rounded-xl border border-gray-200 bg-white p-8">
              <GraduationCap className="w-6 h-6" style={{ color: '#db3433' }} />
              <h3 className="text-2xl font-bold text-black mt-4 mb-2">Have a question about your future?</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-lg">Talk to a OneGrasp counsellor — we'll help you read your report, pick subjects, and plan your next steps.</p>
              <a href="https://wa.me/918977760443" target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-white text-sm font-bold px-6 py-3 rounded-lg transition-all" style={{ background: '#db3433' }}>
                <Sparkles className="w-4 h-4" /> Ask a counsellor
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="rounded-xl border border-gray-200 bg-white p-8 space-y-4">
              <a href="https://wa.me/918977760443" target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <MessageCircle className="w-5 h-5 text-green-500 shrink-0" />
                <div className="text-sm font-semibold text-black">WhatsApp</div>
              </a>
              <a href="tel:8977760443"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <Phone className="w-5 h-5 text-blue-500 shrink-0" />
                <div className="text-sm font-semibold text-black">8977760443</div>
              </a>
              <a href="mailto:support@onegrasp.com"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <div className="text-sm font-semibold text-black">Email support</div>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
