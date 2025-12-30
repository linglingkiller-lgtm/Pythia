import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, AlertCircle, Users } from 'lucide-react';

const BILLS = [
  { id: 'HB247', title: 'Clean Energy Transition', stage: 'committee', status: 'Active' },
  { id: 'SB156', title: 'Tech Innovation Funding', stage: 'floor', status: 'Active' },
  { id: 'HB89', title: 'Healthcare Access', stage: 'passed-chamber', status: 'Passed' },
];

const STAGES = [
  { key: 'introduced', label: 'Filed' },
  { key: 'committee', label: 'Committee' },
  { key: 'floor', label: 'Floor' },
  { key: 'passed-chamber', label: 'Passed' },
  { key: 'governor', label: 'Governor' },
];

export function BillsIntelligenceMock() {
  const [selectedBill, setSelectedBill] = useState<number | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const timer1 = setTimeout(() => setSelectedBill(0), 1000);
    const timer2 = setTimeout(() => setShowPanel(true), 1800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bills List */}
        <div className="md:col-span-2 space-y-3">
          {BILLS.map((bill, i) => {
            const currentStageIndex = STAGES.findIndex(s => s.key === bill.stage);
            const isSelected = selectedBill === i;

            return (
              <motion.div
                key={bill.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                onClick={() => setSelectedBill(i)}
                className={`p-5 bg-white/90 backdrop-blur-xl rounded-[20px] border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-purple-300 shadow-xl ring-2 ring-purple-100'
                    : 'border-gray-200 shadow-lg hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-purple-600">{bill.id}</span>
                    <h4 className="font-semibold text-gray-900 mt-1">{bill.title}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    bill.status === 'Active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {bill.status}
                  </span>
                </div>

                {/* Multi-stage progress bar */}
                <div className="flex items-center gap-1">
                  {STAGES.map((stage, index) => {
                    const isCompleted = index < currentStageIndex;
                    const isCurrent = index === currentStageIndex;
                    
                    return (
                      <motion.div
                        key={stage.key}
                        className="flex-1 relative"
                        initial={prefersReducedMotion ? {} : { scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.15 + index * 0.1 }}
                      >
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted || isCurrent
                              ? index < 2
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                                : index < 4
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600'
                                : 'bg-gradient-to-r from-red-500 to-red-600'
                              : 'bg-gray-200'
                          } ${isCurrent ? 'ring-1 ring-purple-300' : ''}`}
                        >
                          {isCompleted && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Check size={8} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* AI Review Panel */}
        <AnimatePresence>
          {showPanel && selectedBill !== null && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/90 backdrop-blur-xl rounded-[20px] border border-gray-200 shadow-xl p-6"
            >
              <h4 className="font-bold text-gray-900 mb-4">Pythia Review</h4>

              {/* Executive Summary */}
              <div className="mb-6">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Executive Summary</h5>
                <ul className="space-y-2 text-sm text-gray-700">
                  {[
                    'Accelerates clean energy transition',
                    'Requires utility reporting',
                    'Bipartisan support in committee',
                    'Client position: Support',
                    'Next action: Committee vote Dec 28',
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      className="flex items-start gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Red Flags */}
              <div className="mb-6">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">Red Flags</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium border border-red-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Preemption
                  </span>
                  <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-medium border border-amber-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Reporting req.
                  </span>
                </div>
              </div>

              {/* Key Members */}
              <div className="mb-6">
                <h5 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  Key Members
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Rep. Martinez</span>
                    <span className="text-gray-500">Sponsor</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Sen. Thompson</span>
                    <span className="text-gray-500">Chair</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Generate brief
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Create workplan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
