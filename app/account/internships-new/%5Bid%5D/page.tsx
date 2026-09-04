'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Clock, BarChart3, Award, Target, Zap, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { getAllInternships } from '@/lib/data/careerLoader';

export default function InternshipDetailPage({ params }: { params: { id: string } }) {
  const allInternships = getAllInternships();
  const internship = allInternships.find((p: any) => p.id === params.id);

  if (!internship) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Internship Not Found</h1>
          <Link href="/account/internships-new" className="text-blue-400 hover:text-blue-300">
            ← Back to Internships
          </Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Beginner: { bg: 'bg-green-500/20', text: 'text-green-300', border: 'border-green-500/30' },
    Intermediate: { bg: 'bg-blue-500/20', text: 'text-blue-300', border: 'border-blue-500/30' },
    Advanced: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
  };

  const difficultyColor = difficultyColors[internship.difficulty as keyof typeof difficultyColors];
  const commitmentEmojis = { Low: '⚡', Medium: '⚡⚡', High: '⚡⚡⚡' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 z-50"
      >
        <Link href="/account/internships-new" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-700"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {internship.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex flex-wrap gap-4 items-center mb-6"
            >
              <span className="text-xl text-slate-300 font-semibold">{internship.company}</span>
              {internship.rating && (
                <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full border border-yellow-500/30">
                  <span className="text-yellow-300 font-bold">{internship.rating}</span>
                  <span className="text-yellow-300">★</span>
                  <span className="text-xs text-yellow-300">({internship.reviews} reviews)</span>
                </div>
              )}
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              {[
                { icon: Clock, label: 'Duration', value: internship.duration },
                { icon: BarChart3, label: 'Difficulty', value: internship.difficulty },
                { icon: Zap, label: 'Commitment', value: `${commitmentEmojis[internship.commitment as keyof typeof commitmentEmojis]} ${internship.commitment}` },
                { icon: Target, label: 'Format', value: internship.format },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-700/50 border border-slate-600 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon size={16} className="text-slate-400" />
                    <span className="text-xs text-slate-400">{stat.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {/* CTA Button */}
            <motion.a
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              href={internship.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/50 mb-8"
            >
              Start This Program
              <ExternalLink size={20} />
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Overview */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Program Overview</h2>
                <p className="text-slate-300 leading-relaxed">{internship.overview}</p>
              </div>

              {/* What You'll Do */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="text-blue-400" size={24} />
                  What You'll Do
                </h2>
                <div className="space-y-2">
                  {internship.whatYouWillDo.split('|').map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{item.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Gained */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Award className="text-blue-400" size={24} />
                  Skills You'll Gain
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {internship.skillsGained.map((skill) => (
                    <div key={skill} className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-sm font-semibold text-blue-300">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prerequisites */}
              {internship.prerequisites.length > 0 && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Prerequisites</h2>
                  <ul className="space-y-2">
                    {internship.prerequisites.map((prereq) => (
                      <li key={prereq} className="flex items-start gap-3 text-slate-300">
                        <span className="text-blue-400 font-bold flex-shrink-0">•</span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Outcomes */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="text-green-400" size={24} />
                  What You'll Get
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {internship.outcomes.map((outcome) => (
                    <div key={outcome} className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 flex items-center gap-2">
                      <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                      <p className="text-sm text-green-300 font-medium">{outcome}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Company Info */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Users className="text-blue-400" size={24} />
                  About {internship.company}
                </h2>
                <p className="text-slate-300 leading-relaxed">{internship.companyInfo}</p>
              </div>
            </motion.div>

            {/* Right Column - Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="space-y-6"
            >
              {/* Quick Facts */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6 sticky top-20">
                <h3 className="text-lg font-bold text-white mb-4">Quick Facts</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Difficulty Level</p>
                    <div className={`px-3 py-1 rounded font-semibold border text-sm inline-block ${difficultyColor.bg} ${difficultyColor.text} ${difficultyColor.border}`}>
                      {internship.difficulty}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Time Commitment</p>
                    <p className="text-white font-semibold">{internship.commitment}</p>
                    <p className="text-xs text-slate-400">{commitmentEmojis[internship.commitment as keyof typeof commitmentEmojis]}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Learning Style</p>
                    <p className="text-white font-semibold">{internship.learningStyle}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Duration</p>
                    <p className="text-white font-semibold">{internship.duration}</p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 mb-1">Start Date</p>
                    <p className="text-white font-semibold">{internship.startDate || 'Flexible'}</p>
                  </div>

                  {internship.certifications && internship.certifications.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Certification</p>
                      <div className="space-y-1">
                        {internship.certifications.map((cert) => (
                          <p key={cert} className="text-sm text-yellow-300 font-semibold">{cert}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Ideal For */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Ideal For</h3>
                <div className="space-y-2">
                  {internship.idealFor.map((ideal) => (
                    <div key={ideal} className="flex items-center gap-2 text-slate-300">
                      <span className="text-blue-400">→</span>
                      {ideal}
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Badge */}
              <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6 text-center">
                <p className="text-3xl font-bold text-green-400 mb-2">✓</p>
                <p className="text-white font-bold mb-1">100% FREE</p>
                <p className="text-xs text-slate-300">No hidden costs or subscriptions</p>
              </div>

              {/* CTA */}
              <a
                href={internship.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-all hover:shadow-lg hover:shadow-blue-500/50"
              >
                Start Learning
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-700 bg-slate-900/50 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Explore More Programs</h2>
        <p className="text-slate-300 mb-6">Discover 200+ internships and learning programs from industry leaders</p>
        <Link href="/account/internships-new" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold">
          ← Back to All Internships
        </Link>
      </motion.section>
    </div>
  );
}
