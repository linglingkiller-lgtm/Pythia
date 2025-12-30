import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, AlertTriangle, Scale, TrendingUp, FileText, Database } from 'lucide-react';

const MODULES = [
  { icon: Briefcase, title: 'Projects', status: '12 Active', color: 'from-blue-500 to-blue-600' },
  { icon: AlertTriangle, title: 'Alerts', status: '3 Risks', color: 'from-red-500 to-red-600' },
  { icon: Scale, title: 'Bills', status: '24 Watching', color: 'from-purple-500 to-purple-600' },
  { icon: TrendingUp, title: 'Door Pace', status: 'On Track', color: 'from-green-500 to-green-600' },
  { icon: FileText, title: 'Deliverables', status: '5 Due', color: 'from-amber-500 to-amber-600' },
  { icon: Database, title: 'Records', status: '148 Items', color: 'from-gray-500 to-gray-600' },
];

const ACTIONS = [
  'Schedule sponsor touchpoint',
  'Prep committee packet',
  'Rebalance staffing on Project X',
];

export function WarRoomMock() {
  const [step, setStep] = useState(0);
  const [riskStatus, setRiskStatus] = useState<'at-risk' | 'stabilized'>('at-risk');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 800),
      setTimeout(() => {
        setRiskStatus('stabilized');
        setStep(2);
      }, 2400),
      setTimeout(() => setStep(3), 3200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white/90 backdrop-blur-xl rounded-[28px] border border-gray-200/50 shadow-2xl p-8">
        {/* Module Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {MODULES.map((module, i) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-[20px] border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-[16px] bg-gradient-to-br ${module.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{module.title}</h4>
                <p className="text-sm text-gray-600">{module.status}</p>
                
                {/* Risk chip for Alerts module */}
                {module.title === 'Alerts' && step >= 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3"
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={riskStatus}
                        initial={prefersReducedMotion ? {} : { rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        exit={prefersReducedMotion ? {} : { rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          riskStatus === 'at-risk'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {riskStatus === 'at-risk' ? 'At Risk' : 'Stabilized'}
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Recommended Actions */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-[20px] border border-purple-200/50"
            >
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                Recommended Actions
              </h4>
              <div className="space-y-2">
                {ACTIONS.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-purple-600 transition-colors" />
                    <span className="text-sm text-gray-900 group-hover:text-purple-600 transition-colors">
                      {action}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
