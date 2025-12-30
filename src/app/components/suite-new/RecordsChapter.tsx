import React from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Filter } from 'lucide-react';
import { Button } from '../ui/Button';

export function RecordsChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="records" className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Every brief. Every update.
            <br />
            Every record—findable in seconds.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A single archive for briefs, reports, budgets, deliverables, and compliance logs.
          </p>
        </motion.div>

        {/* Records Search Mock */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            {/* Search bar */}
            <div className="relative mb-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value="HB90 brief"
                readOnly
                className="w-full pl-16 pr-6 py-5 rounded-2xl border-2 border-gray-300 bg-white text-lg focus:outline-none focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 mb-6">
              <button className="px-4 py-2 rounded-lg bg-red-100 text-red-700 text-sm font-medium flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Bill
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">
                Client
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">
                User
              </button>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50">
                Date
              </button>
            </div>

            {/* Search results */}
            <div className="space-y-3">
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">HB90 Legislative Brief - Clean Energy Standards</h4>
                    <div className="text-sm text-gray-600 mb-2">Generated on March 12, 2024 • Sarah Chen</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">Bill</span>
                      <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Active</span>
                      <span className="px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-medium">Client: TechCorp</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                className="p-5 rounded-xl bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">HB90 Committee Analysis Update</h4>
                    <div className="text-sm text-gray-600 mb-2">Generated on March 8, 2024 • Marcus Johnson</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium">Bill</span>
                      <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 text-xs font-medium">Committee</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Save animation hint */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.7 }}
              className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200"
            >
              <div className="text-sm text-green-900">
                <span className="font-semibold">Auto-saved:</span> All Ask Revere outputs, briefs, and workplans automatically archived here with full metadata.
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}