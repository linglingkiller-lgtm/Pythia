import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, FileText, List, Users } from 'lucide-react';

export function AskPythiaMock() {
  const [step, setStep] = useState(0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const prompt = "What changed this week on HB90 and who should we talk to?";

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* Blurred dashboard background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-[28px] blur-xl opacity-50" />

      {/* Ask Pythia Modal */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white/90 backdrop-blur-xl rounded-[28px] border border-gray-200/50 shadow-2xl p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-red-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Ask Pythia</h3>
        </div>

        {/* Input */}
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <AnimatePresence mode="wait">
            {step >= 1 && (
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-900"
              >
                {prompt.slice(0, Math.min(prompt.length, step * 20))}
                {step < 2 && <span className="animate-pulse">|</span>}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Answer */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Key Takeaways */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Key Takeaways</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                    <span>Amendment 2.1 added reporting requirements for utility providers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                    <span>Committee vote scheduled for Dec 28 (3 days)</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                    <span>Chair Martinez supports; Vice Chair Thompson neutral</span>
                  </li>
                </ul>
              </div>

              {/* Recommended Actions */}
              {step >= 3 && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Recommended Actions</h4>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      Create task bundle
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Generate meeting brief
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                      Save to Records
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Citations */}
              {step >= 4 && (
                <motion.div
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: FileText, text: 'HB90 — Bill Overview' },
                      { icon: List, text: 'Energy Watchlist — Weekly Brief' },
                      { icon: Users, text: 'Client: Desert Solar Coalition — Priorities' },
                    ].map((citation, i) => {
                      const Icon = citation.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: i * 0.1 }}
                          className="relative px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-purple-200/50 flex items-center gap-2 group overflow-hidden"
                        >
                          {/* Glow sweep */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            animate={prefersReducedMotion ? {} : { x: ['-200%', '200%'] }}
                            transition={{ duration: 2, delay: i * 0.2 + 1, ease: 'easeInOut' }}
                          />
                          <Icon className="w-4 h-4 text-purple-600 relative z-10" />
                          <span className="text-xs font-medium text-gray-900 relative z-10">{citation.text}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
