import React from 'react';
import { motion } from 'motion/react';
import { Scale, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

const BILL_STAGES = ['Introduced', 'Committee', 'Floor', 'Governor'];

const BILLS = [
  {
    id: 'HB247',
    title: 'Clean Energy Standards Act',
    status: 'Active',
    stage: 2,
    priority: 'high',
  },
  {
    id: 'SB109',
    title: 'Healthcare Transparency Bill',
    status: 'Active',
    stage: 1,
    priority: 'medium',
  },
  {
    id: 'HB398',
    title: 'Education Funding Reform',
    status: 'Passed',
    stage: 4,
    priority: 'low',
  },
];

export function BillsMoment() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="bills" className="py-32 px-6 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-pink-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-indigo-50/30 to-transparent pointer-events-none" />
      
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
            Bills, decoded.
            <br />
            Changes, tracked. Strategy, suggested.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Progress bars, key actors, and AI reviews that cut research time to minutes.
          </p>
        </motion.div>

        {/* Bills List Mock */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mb-12"
        >
          <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
            <div className="space-y-6">
              {BILLS.map((bill, index) => (
                <motion.div
                  key={bill.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 + index * 0.1 }}
                  className="p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                >
                  {/* Bill header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        bill.priority === 'high' ? 'bg-red-100' :
                        bill.priority === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                      }`}>
                        <Scale className={`w-5 h-5 ${
                          bill.priority === 'high' ? 'text-red-600' :
                          bill.priority === 'medium' ? 'text-yellow-600' : 'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-lg mb-1">{bill.id}</div>
                        <div className="text-gray-700">{bill.title}</div>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      bill.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      bill.status === 'Passed' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {bill.status}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      {BILL_STAGES.map((stage, stageIndex) => (
                        <div key={stage} className="flex-1 text-center">
                          <div className={`text-xs font-medium mb-1 ${
                            stageIndex < bill.stage ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {stage}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={prefersReducedMotion ? { width: `${(bill.stage / BILL_STAGES.length) * 100}%` } : { width: 0 }}
                        whileInView={{ width: `${(bill.stage / BILL_STAGES.length) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.1 }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-600 to-blue-600 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors">
                      Generate brief
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors">
                      Create workplan
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors">
                      Pin bill
                    </button>
                  </div>

                  {/* AI Review panel hint for first bill */}
                  {index === 0 && (
                    <motion.div
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 1.0 }}
                      className="mt-4 p-4 rounded-xl bg-gradient-to-br from-red-50 to-blue-50 border border-gray-200"
                    >
                      <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-gray-900 mb-2">AI Review Available</div>
                          <div className="text-sm text-gray-700 space-y-1">
                            <div>• Executive summary (5 bullets)</div>
                            <div>• Red-flag analysis</div>
                            <div>• Key members: Rep. Martinez (Sponsor), Sen. Chen (Chair)</div>
                          </div>
                          <button className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
                            View full review →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
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
