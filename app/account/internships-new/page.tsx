'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Zap, Award, Clock, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { getAllInternships, getStats } from '@/lib/data/careerLoader';
import { INTERNSHIP_CATEGORIES } from '@/lib/data/internships200Plus';

export default function InternshipsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Get all programs from loader
  const allPrograms = getAllInternships();

  const filteredInternships = useMemo(() => {
    return allPrograms.filter((internship: any) => {
      const matchesSearch =
        internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.overview.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory || (internship.industry && internship.industry.includes(selectedCategory));
      const matchesDifficulty = !selectedDifficulty || internship.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const difficultyStyles = {
    Beginner: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
    Intermediate: { bg: '#dbeafe', text: '#1e40af', border: '#60a5fa' },
    Advanced: { bg: '#f3e8ff', text: '#7e22ce', border: '#d8b4fe' },
  };

  const commitmentIcons = {
    Low: '⚡',
    Medium: '⚡⚡',
    High: '⚡⚡⚡',
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-700"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl font-bold text-white mb-4"
            >
              200+ Free Internships & Learning Programs
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl text-slate-300 max-w-2xl mx-auto"
            >
              Gain real-world experience from industry leaders. Hands-on projects, certifications, and portfolio building. 100% FREE.
            </motion.p>
          </div>

          {/* Alert Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4 mb-8 flex items-start gap-4"
          >
            <AlertCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-amber-100 font-semibold mb-1">100% FREE Programs</p>
              <p className="text-amber-100/80 text-sm">All internships and learning programs on this page are completely free. No hidden costs, no subscription fees.</p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: 'Programs', value: '210+', bgClass: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
              { icon: Zap, label: 'Self-Paced', value: '99%', bgClass: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
              { icon: Award, label: 'Certifications', value: '150+', bgClass: 'bg-gradient-to-br from-green-500 to-emerald-500' },
              { icon: TrendingUp, label: 'Avg Rating', value: '4.75★', bgClass: 'bg-gradient-to-br from-purple-500 to-pink-500' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                className={`${stat.bgClass} rounded-lg p-4 text-white`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <stat.icon size={20} className="opacity-80" />
                  <span className="text-sm opacity-90">{stat.label}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Search & Filter Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700"
      >
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Search programs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 sm:py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">Difficulty Level</label>
              <select
                value={selectedDifficulty || ''}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">Industry/Category</label>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="">All Categories</option>
                {INTERNSHIP_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">View Mode</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-2 sm:px-3 rounded-lg font-medium text-sm transition-all ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-2 sm:px-3 rounded-lg font-medium text-sm transition-all ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-slate-400 text-sm mt-4">
            Showing <span className="font-semibold text-white">{filteredInternships.length}</span> of {allPrograms.length} programs
          </p>
        </div>
      </motion.section>

      {/* Results Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {filteredInternships.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-slate-400 text-lg">No internships found matching your criteria.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
            >
              {filteredInternships.map((internship, idx) => (
                <motion.div
                  key={internship.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.6 }}
                  whileHover={{ y: -4, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <Link href={`/account/internships-new/${internship.id}`}>
                    <div className="h-full bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6 hover:border-blue-500 transition-all cursor-pointer">
                      {/* Header */}
                      <div className="mb-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                            {internship.title}
                          </h3>
                          {internship.rating && (
                            <div className="flex items-center gap-1 text-yellow-400 ml-2 flex-shrink-0">
                              <span className="text-sm font-semibold">{internship.rating}</span>
                              <span>★</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-300">{internship.company}</p>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                        {internship.description}
                      </p>

                      {/* Meta Info */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className="px-2 py-1 text-xs font-semibold rounded border"
                          style={{
                            backgroundColor: difficultyStyles[internship.difficulty as keyof typeof difficultyStyles].bg,
                            color: difficultyStyles[internship.difficulty as keyof typeof difficultyStyles].text,
                            borderColor: difficultyStyles[internship.difficulty as keyof typeof difficultyStyles].border,
                          }}
                        >
                          {internship.difficulty}
                        </span>
                        <span className="px-2 py-1 text-xs font-semibold bg-slate-600 text-slate-200 rounded border border-slate-500 flex items-center gap-1">
                          <Clock size={12} />
                          {internship.duration}
                        </span>
                      </div>

                      {/* Skills */}
                      <div className="mb-4">
                        <p className="text-xs text-slate-400 mb-2">Top Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {internship.skillsGained.slice(0, 3).map((skill) => (
                            <span key={skill} className="px-2 py-1 text-xs bg-blue-500/20 text-blue-300 rounded">
                              {skill}
                            </span>
                          ))}
                          {internship.skillsGained.length > 3 && (
                            <span className="px-2 py-1 text-xs bg-slate-600 text-slate-300 rounded">
                              +{internship.skillsGained.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>


                      {/* CTA */}
                      <div className="pt-4 border-t border-slate-600 flex items-center gap-2 text-blue-400 group-hover:gap-3 transition-all">
                        <span className="text-sm font-semibold">Explore Program</span>
                        <span className="text-lg">→</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="py-10 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700 bg-slate-900/50"
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">Ready to Start Learning?</h2>
          <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
            Pick any program above and start your journey today. All programs are completely free and can be completed at your own pace.
          </p>
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="block sm:inline">200+ verified programs • 150+ certifications available</span>
            <span className="block sm:inline"> • Trusted by millions • Industry-recognized credentials</span>
          </p>
        </div>
      </motion.section>
    </div>
  );
}
