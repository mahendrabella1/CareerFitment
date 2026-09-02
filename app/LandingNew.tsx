"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Check, ChevronDown, Zap, TrendingUp, Users, Award, BookOpen, Lightbulb } from "lucide-react";

const LOGO = "https://onegrasp.com/wp-content/uploads/2026/07/onegrasp-logo.png";

// ============ ANIMATION VARIANTS ============
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const CounterNumber = ({ target }: { target: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => (c < target ? c + Math.ceil(target / 50) : target));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}</>;
};

// ============ SECTION 1: HERO ============
function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white text-gray-900 overflow-hidden pt-24">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40" style={{ transform: "translate(100px, -100px)" }}></div>
        <div className="absolute bottom-1/2 left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-28">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="max-w-4xl">
          <div className="mb-8 inline-block">
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-4 py-2 rounded-full uppercase tracking-wide">2030 is closer than you think</span>
          </div>

          <h1 className="text-6xl lg:text-7xl font-black leading-tight mb-6 text-gray-900">
            The world of work is changing.
          </h1>

          <h2 className="text-4xl lg:text-5xl font-black mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Is your child's career plan ready?
          </h2>

          <p className="text-xl text-gray-700 leading-relaxed mb-12 max-w-3xl font-medium">
            Before choosing a stream, degree or career, understand how your child thinks, learns, decides and works. Give them clarity when they need it most.
          </p>

          {/* WEF Stats with animations */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-3xl">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8">
              <div className="text-5xl font-black text-green-600 mb-1">
                170<span className="text-3xl">M</span>
              </div>
              <div className="text-sm text-gray-700 font-semibold">New jobs by 2030</div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-2xl p-8">
              <div className="text-5xl font-black text-red-600 mb-1">
                92<span className="text-3xl">M</span>
              </div>
              <div className="text-sm text-gray-700 font-semibold">Jobs displaced by 2030</div>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8">
              <div className="text-5xl font-black text-amber-600 mb-1">
                78<span className="text-3xl">M</span>
              </div>
              <div className="text-sm text-gray-700 font-semibold">Net job growth</div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-12 max-w-3xl">
            <p className="text-gray-800 font-semibold">
              <span className="text-blue-700 font-black">Your child's future is changing.</span><br />
              Is their career decision based on evidence or assumption?
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row gap-4 mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStart}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Discover My Child's Career Fit <ArrowRight size={20} />
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              href="#sample"
              className="px-8 py-4 bg-white border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              View Sample Report
            </motion.a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-gray-600 text-sm flex items-center gap-2">
            <span className="text-blue-600">✓</span> Science-backed • <span className="text-blue-600">✓</span> Confidential • <span className="text-blue-600">✓</span> ~25 minutes
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ChevronDown size={24} className="text-blue-600" />
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 2: PROBLEMS ============
function ProblemsSection() {
  const problems = [
    { title: "MARKS", question: "My child scores well in Maths", doubt: "Does that automatically mean Engineering?" },
    { title: "PARENTS", question: "This is a safe career", doubt: "Is it actually right for my child?" },
    { title: "FRIENDS", question: "Everyone is choosing Science", doubt: "Should my child follow the crowd?" },
    { title: "SOCIAL MEDIA", question: "This career pays well", doubt: "Does high salary mean good fit?" },
    { title: "STUDENT", question: "I don't know what I want", doubt: "How do we discover the right direction?" },
  ];

  return (
    <section className="py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 leading-tight mb-6">
            Most career decisions start with incomplete information.
          </h2>
          <p className="text-2xl text-gray-700 font-semibold">Not understanding. Not clarity. Just marks, opinions and trends.</p>
        </motion.div>

        {/* Problem cards - vertical list on mobile, grid on larger */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4 mb-16 lg:space-y-0 lg:grid lg:grid-cols-1">
          {problems.map((p, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ x: 8 }} className="bg-white border-l-4 border-blue-600 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2">{p.title}</div>
                  <p className="text-lg font-bold text-gray-900">{p.question}</p>
                </div>
                <div className="flex-1 lg:text-right">
                  <p className="text-gray-700 font-medium italic">{p.doubt}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Major insight */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-12 lg:p-16 text-center">
          <h3 className="text-4xl lg:text-5xl font-black mb-4">Marks tell you what they scored.</h3>
          <p className="text-2xl font-semibold opacity-95">They don't tell you who they are.</p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 inline-block">
            <p className="text-lg opacity-90">Understanding the child is the first step to better decisions.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 3: DECISION WINDOW & COST ============
function TimelineSection() {
  const stages = [
    { stage: "Class 8–9", action: "Discover", desc: "Strengths & interests" },
    { stage: "Class 9–10", action: "Clarify", desc: "Career clusters" },
    { stage: "Class 10", action: "Decide", desc: "Stream choice" },
    { stage: "Class 11–12", action: "Build", desc: "Relevant skills" },
    { stage: "College", action: "Execute", desc: "Informed entry" },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">
            Some career decisions become expensive to change later.
          </h2>
          <p className="text-2xl text-gray-700 font-semibold">The earlier a student understands their profile, the more time they have to explore, test and develop.</p>
        </motion.div>

        {/* Timeline - horizontal scroll on mobile, grid on desktop */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mb-20">
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400"></div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-2 relative z-10">
              {stages.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-center relative"
                >
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{i + 1}</span>
                  </div>
                  <div className="font-bold text-gray-900 mb-2 mt-2 text-sm">{s.stage}</div>
                  <div className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{s.action}</div>
                  <div className="text-xs text-gray-700">{s.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Cost section */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 border-2 border-orange-300 rounded-2xl p-12 lg:p-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Spending 3–4 years on the wrong path costs:</h3>
            <p className="text-gray-700 font-semibold">Not just money. Time. Opportunity. Direction.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-orange-600 mb-2">₹10–25L</div>
              <div className="text-sm lg:text-base text-gray-700 font-semibold">Tuition & coaching cost</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-red-600 mb-2">1000+</div>
              <div className="text-sm lg:text-base text-gray-700 font-semibold">Hours of wasted prep</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black text-amber-600 mb-2">3–4</div>
              <div className="text-sm lg:text-base text-gray-700 font-semibold">Years of opportunity lost</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl p-8 text-center border-2 border-orange-200">
            <h4 className="text-2xl font-black text-gray-900 mb-3">The expensive mistake isn't taking an assessment.</h4>
            <p className="text-lg text-gray-700 font-semibold">It's spending years preparing for the wrong direction.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 4: 8 DIMENSIONS ============
function DimensionsSection() {
  const dimensions = [
    { icon: "🧠", name: "Personality", desc: "Natural behavioral patterns, decision approaches, and responses" },
    { icon: "❤️", name: "Career Interests", desc: "Activities and career areas that naturally attract the student" },
    { icon: "💡", name: "Multiple Intelligence", desc: "Different ways they process information and solve problems" },
    { icon: "🤝", name: "Emotional Intelligence", desc: "Self-awareness, emotional responses, and interpersonal capabilities" },
    { icon: "📚", name: "Learning Preferences", desc: "Approaches that support the student's learning process" },
    { icon: "🔥", name: "Motivators & Values", desc: "What drives effort, goals, and satisfaction" },
    { icon: "💪", name: "Strengths", desc: "Capabilities that can be deliberately developed" },
    { icon: "📊", name: "Aptitude", desc: "Reasoning and cognitive strengths profile" },
  ];

  const [hoveredDim, setHoveredDim] = useState<number | null>(null);

  return (
    <section className="py-28 bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <motion.h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight">
            <span>One assessment.</span>
            <br />
            <span>Eight dimensions.</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">A clearer picture of your child.</span>
          </motion.h2>
          <p className="text-xl text-gray-700 font-semibold max-w-2xl mx-auto">Not a single score. Not a prediction. A structured multi-dimensional understanding.</p>
        </motion.div>

        {/* Dimensions Grid - Central focal point */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {dimensions.map((d, i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
              onHoverStart={() => setHoveredDim(i)}
              onHoverEnd={() => setHoveredDim(null)}
              className="bg-white border-2 border-gray-200 hover:border-blue-400 rounded-2xl p-8 cursor-pointer transition-all group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{d.icon}</div>
              <h3 className="font-black text-gray-900 mb-3 text-lg">{d.name}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{d.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Central insight */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 border-2 border-blue-300 rounded-2xl p-12 lg:p-16 text-center">
          <h3 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">Career fit is not one score.</h3>
          <p className="text-2xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">It's the intersection of multiple dimensions.</p>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-lg text-gray-800 font-semibold max-w-3xl mx-auto">
            A student's fit for a career emerges from understanding how all eight dimensions interact. This is what makes OneGrasp different.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 5: BEYOND CAREER ============
function BeyondCareerSection() {
  const benefits = [
    { icon: "🎯", title: "Better Career Decisions", desc: "Explore career directions aligned with the student's profile" },
    { icon: "📖", title: "Better Learning", desc: "Understand learning preferences and study approaches that work" },
    { icon: "🚀", title: "Better Skill Development", desc: "Identify strengths and capabilities worth developing" },
    { icon: "🪞", title: "Better Self-Awareness", desc: "Understand personality, motivations, and decision patterns" },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">It's not just about choosing a career.</h2>
          <p className="text-2xl text-gray-700 font-semibold">Understanding your child creates a foundation for better decisions across all areas.</p>
        </motion.div>

        {/* Four benefits */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((b, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-300 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
              <h3 className="font-black text-gray-900 mb-3 text-lg">{b.title}</h3>
              <p className="text-gray-700">{b.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Before/After transformation */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-10">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Before Understanding</h3>
            <ul className="space-y-4">
              {["Why is my child struggling?", "Which stream should they choose?", "What are they actually good at?", "What career should they consider?"].map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-red-600 font-black mt-1">✕</span>
                  <span className="text-gray-800 font-medium">{q}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-10">
            <h3 className="text-2xl font-black text-gray-900 mb-6">After Understanding</h3>
            <ul className="space-y-4">
              {["Here is their profile", "Here are their strengths", "Here are areas worth exploring", "Here are skills to develop"].map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-black mt-1">✓</span>
                  <span className="text-gray-800 font-medium">{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 6: SAMPLE REPORT ============
function SampleReportSection() {
  return (
    <section id="sample" className="py-28 bg-gradient-to-b from-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">What you actually receive</h2>
          <p className="text-2xl text-gray-700 font-semibold">A comprehensive, actionable profile. Not just a score.</p>
        </motion.div>

        {/* Report Preview Images */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="grid md:grid-cols-3 gap-6 mb-16">
          <motion.div whileHover={{ y: -8 }} className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
            <img src="https://onegrasp.com/wp-content/uploads/2026/08/Screenshot-2026-08-29-225423.png" alt="8 Dimensions Profile" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div whileHover={{ y: -8 }} className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
            <img src="https://onegrasp.com/wp-content/uploads/2026/08/Screenshot-2026-08-29-225230.png" alt="Detailed Scores" className="w-full h-full object-cover" />
          </motion.div>
          <motion.div whileHover={{ y: -8 }} className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all">
            <img src="https://onegrasp.com/wp-content/uploads/2026/08/Screenshot-2026-08-29-225309.png" alt="Career Roadmap" className="w-full h-full object-cover" />
          </motion.div>
        </motion.div>

        {/* Report Components */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="bg-white border-2 border-gray-300 rounded-2xl p-12 lg:p-16 mb-16">
          <h3 className="text-3xl font-black text-gray-900 mb-12 text-center">Your report includes:</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "8-dimensional analysis with detailed breakdowns",
              "Personality profile and behavioral insights",
              "Career interests aligned with 36+ career families",
              "Cognitive aptitude profile and reasoning strengths",
              "Learning preferences and study approaches",
              "Core motivators and values assessment",
              "Emotional intelligence analysis",
              "Strength identification and development roadmap",
              "Career clusters ranked by fit",
              "Development areas and growth opportunities",
              "Stream exploration and subject fit guidance",
              "20-year career exploration roadmap",
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="flex items-start gap-3">
                <Check size={24} className="text-blue-600 flex-shrink-0 mt-1" />
                <span className="text-gray-900 font-semibold leading-relaxed">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Landscape */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-2xl p-12 lg:p-16 mb-16">
          <h3 className="text-3xl font-black text-gray-900 mb-6 text-center">The Career Landscape</h3>
          <p className="text-lg text-gray-800 font-semibold mb-10 text-center max-w-3xl mx-auto">
            Your child is preparing for careers that are still evolving. Understanding their profile helps them explore emerging opportunities with confidence.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {["AI & Machine Learning", "Data & Analytics", "Cybersecurity", "Healthcare & Biotech", "Green Technology", "Advanced Engineering", "Digital Business", "Creative Technology"].map((career, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-all">
                <p className="font-bold text-gray-900 text-sm">{career}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Economics */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-12 lg:p-16">
          <h3 className="text-3xl font-black text-gray-900 mb-6 text-center">Career Economics Matter</h3>
          <p className="text-lg text-gray-800 font-semibold mb-4 text-center">
            Different career paths have different earning trajectories. Here are approximate salary ranges by experience level in India:
          </p>
          <p className="text-sm text-gray-700 text-center mb-10 italic">*Salary ranges vary by location, company, and specialization. Based on industry benchmarks.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Software Engineering & AI", range: "₹6–15L (entry) → ₹30–80L+ (experienced)" },
              { title: "Finance & Economics", range: "₹6–12L (entry) → ₹25–70L+ (experienced)" },
              { title: "Healthcare & Medicine", range: "₹5–10L (entry) → ₹20–60L+ (experienced)" },
              { title: "Data Science", range: "₹7–14L (entry) → ₹35–85L+ (experienced)" },
              { title: "Design & UX", range: "₹5–10L (entry) → ₹20–50L+ (experienced)" },
              { title: "Law & Legal", range: "₹4–8L (entry) → ₹15–60L+ (experienced)" },
            ].map((career, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="bg-white border-2 border-amber-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-900 mb-2">{career.title}</h4>
                <p className="text-sm text-gray-700">{career.range}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 bg-white rounded-xl p-8 text-center border-2 border-amber-200">
            <h4 className="text-2xl font-black text-gray-900 mb-3">The goal isn't choosing the highest-paying career.</h4>
            <p className="text-lg text-gray-800 font-semibold">It's finding the intersection of fit + interest + ability + opportunity.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 7: METHODOLOGY & TRUST ============
function MethodologySection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">Built on established psychological frameworks.</h2>
          <p className="text-2xl text-gray-700 font-semibold">Not intuition. Not guesswork. Science-backed assessment.</p>
        </motion.div>

        {/* Frameworks */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { dimension: "Personality", framework: "Big Five (OCEAN) Model" },
            { dimension: "Career Interests", framework: "Holland Code (RIASEC)" },
            { dimension: "Multiple Intelligence", framework: "Gardner's Theory" },
            { dimension: "Emotional Intelligence", framework: "EI Competency Model" },
            { dimension: "Learning Preferences", framework: "Learning Styles Framework" },
            { dimension: "Motivators", framework: "Values Assessment" },
            { dimension: "Aptitude", framework: "Cognitive Reasoning" },
            { dimension: "Strengths", framework: "Strength Identification" },
          ].map((item, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <p className="font-black text-gray-900 text-sm uppercase tracking-wide mb-2">{item.dimension}</p>
              <p className="text-gray-700 font-semibold">{item.framework}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Key claims */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-2xl p-12 lg:p-16 text-center">
          <h3 className="text-3xl font-black text-gray-900 mb-8">What OneGrasp doesn't claim:</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {[
              "This test predicts a single perfect career",
              "Higher scores guarantee higher salaries",
              "One assessment tells the complete story",
              "Career success is guaranteed",
            ].map((claim, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red-600 font-black text-xl">✕</span>
                <p className="text-gray-800 font-semibold">{claim}</p>
              </div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-10 pt-10 border-t-2 border-blue-300">
            <h4 className="text-2xl font-black text-gray-900 mb-6">What OneGrasp does do:</h4>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "Provide structured insight into 8 key dimensions",
                "Support informed decision-making",
                "Identify strengths worth developing",
                "Explore career directions with clarity",
              ].map((claim, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-green-600 font-black text-xl">✓</span>
                  <p className="text-gray-800 font-semibold">{claim}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 8: SCHOOL PROOF & TESTIMONIALS ============
function ProofSection() {
  return (
    <section className="py-28 bg-gradient-to-b from-blue-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* School Logos / Trust */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6">Trusted in real educational settings.</h2>
          <p className="text-2xl text-gray-700 font-semibold mb-12">Schools, counselors, and organizations rely on OneGrasp.</p>

          {/* Stats */}
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div variants={itemVariants} className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-4xl font-black text-blue-600 mb-2">500+</div>
              <p className="text-gray-700 font-semibold">Schools & programs</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-4xl font-black text-indigo-600 mb-2">50K+</div>
              <p className="text-gray-700 font-semibold">Students assessed</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white border-2 border-gray-200 rounded-xl p-8">
              <div className="text-4xl font-black text-purple-600 mb-2">4.8/5</div>
              <p className="text-gray-700 font-semibold">Student satisfaction</p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Testimonials */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h3 className="text-3xl font-black text-gray-900 text-center mb-12">What parents and students say:</h3>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-8">
              <p className="text-gray-800 font-semibold mb-4 italic">"The assessment helped us understand our child beyond just marks. We had a real conversation about their strengths and interests for the first time."</p>
              <p className="font-bold text-gray-900">— Parent, Mumbai</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8">
              <p className="text-gray-800 font-semibold mb-4 italic">"I discovered that I'm good at things I never realized. It gave me confidence to explore careers I didn't think were for me."</p>
              <p className="font-bold text-gray-900">— Student, Class 10</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8">
              <p className="text-gray-800 font-semibold mb-4 italic">"The report is incredibly detailed. We used it to guide our counseling sessions with students. It made a real difference."</p>
              <p className="font-bold text-gray-900">— School Counselor</p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-8">
              <p className="text-gray-800 font-semibold mb-4 italic">"We chose Science based on marks. After the assessment, we realized we should explore Commerce. This changed our child's entire trajectory."</p>
              <p className="font-bold text-gray-900">— Parent, Bangalore</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 9: FAQ ============
function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "Is this just a personality test?",
      a: "No. It combines eight different dimensions—personality, interests, intelligence, emotional intelligence, learning preferences, motivators, strengths, and aptitude. It's a much more comprehensive profile.",
    },
    {
      q: "Can this assessment decide my child's career for them?",
      a: "No. It should support career exploration and decision-making rather than dictate one fixed career. It helps clarify options, not eliminate them.",
    },
    {
      q: "What if my child changes their mind later?",
      a: "That's completely normal and expected. The purpose is to understand the student's profile and support exploration. Interests and goals evolve—the assessment creates clarity at this moment.",
    },
    {
      q: "Is it only for career selection?",
      a: "No. The insights can also support learning, self-awareness, strengths development, and skill building across multiple areas.",
    },
    {
      q: "How long does the assessment take?",
      a: "Approximately 25 minutes. It's designed to be engaging without being overwhelming.",
    },
    {
      q: "Can I see a sample report before purchasing?",
      a: "Yes. Scroll up to the 'What you actually receive' section to see sample report pages and understand exactly what's included.",
    },
    {
      q: "Is the assessment suitable for all age groups?",
      a: "We have specialized versions for different age groups: Class 6-8 (Career Discovery), Class 9-10 (Stream Selection), Class 11-12 (Career Planning), and beyond.",
    },
    {
      q: "Is my child's data confidential?",
      a: "Yes. All data is confidential and securely stored. Parents can access their child's full report, but data is not shared or sold.",
    },
  ];

  return (
    <section className="py-28 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-4">Frequently asked questions</h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div key={i} variants={itemVariants} className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-200/50 transition-colors">
                <span className="text-left font-bold text-gray-900 text-lg">{faq.q}</span>
                <span className={`text-2xl text-blue-600 transition-transform ${openFaq === i ? "rotate-180" : ""}`}>↓</span>
              </button>
              {openFaq === i && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-8 pb-6 border-t-2 border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ============ SECTION 10: FINAL CTA ============
function FinalCTASection({ onStart }: { onStart: () => void }) {
  return (
    <section className="py-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center px-6 lg:px-12">
        <h2 className="text-5xl lg:text-6xl font-black mb-8 leading-tight">
          You don't have to decide your child's entire future today.
        </h2>
        <p className="text-2xl font-semibold mb-12 opacity-95">
          But you can understand your child before making the next important decision.
        </p>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="bg-white/10 border-2 border-white/30 rounded-2xl p-8 backdrop-blur mb-12">
          <h3 className="text-3xl font-black mb-6">ONE ASSESSMENT</h3>
          <div className="grid md:grid-cols-5 gap-4 text-sm font-bold">
            <div>8 DIMENSIONS</div>
            <div>•</div>
            <div>~25 MINUTES</div>
            <div>•</div>
            <div>PERSONALIZED REPORT</div>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-12 py-5 bg-white text-blue-600 font-black text-lg rounded-xl hover:bg-gray-100 transition-colors shadow-2xl mb-12 inline-flex items-center gap-3"
        >
          Start My Child's Assessment <ArrowRight size={24} />
        </motion.button>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-blue-500/20 border-2 border-white/20 rounded-xl p-6">
          <p className="text-lg font-semibold opacity-95">Understand first. Choose better. Build earlier.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <img src={LOGO} alt="OneGrasp" className="h-10 mb-4" />
            <p className="text-gray-400 text-sm">Career Fitment Assessment for students and parents</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#sample" className="hover:text-white transition-colors">Sample Report</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Schools</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Protection</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>© 2026 OneGrasp. All rights reserved.</p>
          <p className="mt-2">
            <span className="text-blue-400">✓</span> Science-backed assessment • <span className="text-blue-400">✓</span> Trusted by 500+ schools • <span className="text-blue-400">✓</span> 50K+ students assessed
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============ MAIN COMPONENT ============
export default function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="overflow-x-hidden bg-white">
      {/* Sticky Navigation */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }} className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <motion.a href="#" className="flex items-center gap-2" whileHover={{ opacity: 0.8 }}>
            <img src={LOGO} alt="OneGrasp" className="h-8" />
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            <motion.a href="#sample" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Sample Report</motion.a>
            <motion.a href="#" className="text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">Methodology</motion.a>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={onStart}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Start Assessment
          </motion.button>
        </div>
      </motion.nav>

      {/* Main content sections */}
      <HeroSection onStart={onStart} />
      <ProblemsSection />
      <TimelineSection />
      <DimensionsSection />
      <BeyondCareerSection />
      <SampleReportSection />
      <MethodologySection />
      <ProofSection />
      <FAQSection />
      <FinalCTASection onStart={onStart} />
      <Footer />
    </div>
  );
}
