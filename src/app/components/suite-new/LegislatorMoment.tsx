import React from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';

const RELATIONSHIP_FACTORS = [
  { label: 'Recency', value: 22, max: 30, color: 'bg-red-500' },
  { label: 'Frequency', value: 16, max: 20, color: 'bg-orange-500' },
  { label: 'Responsiveness', value: 12, max: 15, color: 'bg-yellow-500' },
  { label: 'Issue Alignment', value: 11, max: 15, color: 'bg-blue-500' },
  { label: 'Strategic Relevance', value: 18, max: 20, color: 'bg-purple-500' },
];

export function LegislatorMoment() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const totalScore = RELATIONSHIP_FACTORS.reduce((sum, f) => sum + f.value, 0);
  const maxScore = RELATIONSHIP_FACTORS.reduce((sum, f) => sum + f.max, 0);
  const relationshipScore = Math.round((totalScore / maxScore) * 100);
  
  let tier = 'Cold';
  let tierColor = 'text-gray-600';
  let gaugeColor = 'from-gray-400 to-gray-500';
  
  if (relationshipScore >= 70) {
    tier = 'Hot';
    tierColor = 'text-red-600';
    gaugeColor = 'from-red-500 to-orange-500';
  } else if (relationshipScore >= 40) {
    tier = 'Warm';
    tierColor = 'text-yellow-600';
    gaugeColor = 'from-yellow-500 to-orange-500';
  }

  return (
    <section id="legislators" className="py-32 px-6 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-indigo-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50/40 to-transparent pointer-events-none" />
      
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
            Know who matters—
            <br />
            and where you stand.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Profiles, committees, history, and a relationship meter that updates automatically.
          </p>
        </motion.div>

        {/* Legislator Profile Mock */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-12"
        >
          <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Profile info */}
              <div className="lg:col-span-2">
                {/* Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <User className="w-10 h-10 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-1">Rep. Maria Martinez</h3>
                    <div className="text-gray-600 mb-3">District 14 • Energy & Commerce Committee Chair</div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">Democrat</span>
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">3rd Term</span>
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">8</div>
                    <div className="text-sm text-gray-600">Sponsored Bills</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">3</div>
                    <div className="text-sm text-gray-600">Committees</div>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Interactions</div>
                  </div>
                </div>

                {/* Recent activity */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-700">Sponsored HB 247 (Clean Energy Standards)</div>
                      <div className="text-xs text-gray-500 ml-auto">5 days ago</div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div className="text-sm text-gray-700">Met with your team on district priorities</div>
                      <div className="text-xs text-gray-500 ml-auto">12 days ago</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Relationship Meter */}
              <div>
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                  className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-blue-50 border-2 border-gray-200"
                >
                  <h4 className="font-semibold text-gray-900 mb-6">Relationship Meter</h4>
                  
                  {/* Gauge */}
                  <div className="mb-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Progress circle */}
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={`stroke-gradient-${tier.toLowerCase()}`}
                          initial={prefersReducedMotion ? { strokeDashoffset: 251.2 - (251.2 * relationshipScore) / 100 } : { strokeDashoffset: 251.2 }}
                          whileInView={{ strokeDashoffset: 251.2 - (251.2 * relationshipScore) / 100 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
                          style={{
                            strokeDasharray: 251.2,
                            stroke: relationshipScore >= 70 ? '#ef4444' : relationshipScore >= 40 ? '#eab308' : '#6b7280'
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className={`text-3xl font-bold ${tierColor}`}>{relationshipScore}</div>
                          <div className="text-xs text-gray-500">/ 100</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`text-xl font-bold ${tierColor} mb-1`}>{tier}</div>
                      <div className="text-sm text-gray-600">
                        {tier === 'Hot' && 'Strong relationship'}
                        {tier === 'Warm' && 'Developing relationship'}
                        {tier === 'Cold' && 'Limited engagement'}
                      </div>
                    </div>
                  </div>

                  {/* Factor breakdown */}
                  <div className="mb-6">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                      Score Breakdown
                    </div>
                    <div className="space-y-2">
                      {RELATIONSHIP_FACTORS.map((factor, index) => (
                        <motion.div
                          key={factor.label}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                          whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.7 + index * 0.05 }}
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-gray-700">{factor.label}</span>
                            <span className="text-gray-500">{factor.value}/{factor.max}</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={prefersReducedMotion ? { width: `${(factor.value / factor.max) * 100}%` } : { width: 0 }}
                              whileInView={{ width: `${(factor.value / factor.max) * 100}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.8 + index * 0.05 }}
                              className={`h-full ${factor.color} rounded-full`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Next best action */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
                    className="p-4 rounded-xl bg-white border border-gray-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm mb-1">Next Best Action</div>
                        <div className="text-sm text-gray-700">Share district-specific brief on HB 247 impact</div>
                      </div>
                    </div>
                    <Button variant="primary" size="sm" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Draft email
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
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