import React from 'react';
import { motion } from 'motion/react';
import { Target, Calendar, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from '../ui/Button';

export function PaceMoment() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doorsCompleted = 10000;
  const doorsGoal = 15000;
  const progressPercent = (doorsCompleted / doorsGoal) * 100;
  const daysRemaining = 18;

  return (
    <section id="pace" className="py-32 px-6 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-50/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-sky-50/30 to-transparent pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Pace to goal,
            <br />
            in one glance.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Doors knocked, days left, staffing coverage, and projected completion—built for paid canvassing.
          </p>
        </motion.div>

        {/* Pace Dashboard Mock */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-12"
        >
          <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Doors Progress */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  className="p-6 rounded-2xl bg-white border border-gray-200"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-gray-900">Doors Progress</h3>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-5xl font-bold text-gray-900">{doorsCompleted.toLocaleString()}</span>
                      <span className="text-2xl text-gray-500">/ {doorsGoal.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-600">{Math.round(progressPercent)}% complete</div>
                  </div>

                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <motion.div
                      initial={prefersReducedMotion ? { width: `${progressPercent}%` } : { width: 0 }}
                      whileInView={{ width: `${progressPercent}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Daily average</div>
                      <div className="text-2xl font-bold text-gray-900">556</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Remaining</div>
                      <div className="text-2xl font-bold text-gray-900">5,000</div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Days Remaining */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="p-6 rounded-2xl bg-white border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">Timeline</h3>
                </div>
                
                <div className="mb-4">
                  <div className="text-5xl font-bold text-gray-900 mb-2">{daysRemaining}</div>
                  <div className="text-sm text-gray-600">days remaining</div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Target date</div>
                  <div className="font-medium text-gray-900">March 31, 2024</div>
                </div>
              </motion.div>
            </div>

            {/* Projection */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 mb-6"
            >
              <div className="flex items-start gap-4">
                <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Projected Completion</h4>
                  <div className="text-sm text-gray-700 mb-3">
                    Based on current pace: <span className="font-semibold text-blue-700">March 29, 2024</span> (2 days ahead of schedule)
                  </div>
                  <div className="text-xs text-gray-600">
                    Assumes 556 doors/day average with 8 active canvassers
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.8 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 mb-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Staffing Recommendation</h4>
                  <div className="text-sm text-gray-700 mb-3 space-y-1">
                    <div>• Add 2 canvassers to District 5 (high-density area)</div>
                    <div>• Shift coverage from District 3 (completed early)</div>
                    <div>• Schedule training for weekend push</div>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                    Review staffing plan
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Budget mini-panel */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div className="text-sm text-gray-600">Budget spent</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">$78,400</div>
                <div className="text-xs text-gray-500">of $120,000</div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <div className="text-sm text-gray-600">Burn rate</div>
                </div>
                <div className="text-2xl font-bold text-gray-900">$4,355</div>
                <div className="text-xs text-gray-500">per day</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex items-center justify-center gap-4"
        >
          <Button variant="secondary" size="sm">
            See an example
          </Button>
          <Button variant="secondary" size="sm">
            Learn more
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
