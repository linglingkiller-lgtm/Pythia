import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, CheckCircle2, Calendar, User } from 'lucide-react';

const RAW_NOTES = `Meeting with Rep. Martinez re: HB90

- Need to follow up with Chair before committee hearing
- Draft amendment language addressing utility concerns
- Send client update Friday summarizing status
- Schedule briefing with Vice Chair Thompson
`;

const TASKS = [
  { text: 'Follow up with Chair before committee hearing', owner: 'Sarah Chen', due: 'Dec 27' },
  { text: 'Draft amendment language', owner: 'Mike Johnson', due: 'Dec 26' },
  { text: 'Send client update Friday', owner: 'Sarah Chen', due: 'Dec 22' },
  { text: 'Schedule briefing with Vice Chair Thompson', owner: 'Alex Rivera', due: 'Dec 28' },
];

export function SmartStructuringMock() {
  const [step, setStep] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const interval = setInterval(() => {
      if (step < 4) {
        setStep((prev) => prev + 1);
        setHighlightedIndex((prev) => prev + 1);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [step]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Raw Notes */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/90 backdrop-blur-xl rounded-[24px] border border-gray-200/50 shadow-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h4 className="font-semibold text-gray-900">Raw Notes</h4>
          </div>
          <div className="relative">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
              {RAW_NOTES.split('\n').map((line, i) => {
                const isAction = line.includes('- ');
                const actionIndex = isAction ? line.split('- ')[0].length : -1;
                const shouldHighlight = isAction && TASKS.findIndex(t => line.includes(t.text.slice(0, 20))) === highlightedIndex;

                return (
                  <div key={i} className="relative">
                    {shouldHighlight && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: '100%', opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0 bg-purple-100 rounded -mx-2 px-2"
                      />
                    )}
                    <span className="relative">{line}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        </motion.div>

        {/* Right: Structured Tasks */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white/90 backdrop-blur-xl rounded-[24px] border border-gray-200/50 shadow-xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-900">Extracted Tasks</h4>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {TASKS.slice(0, highlightedIndex + 1).map((task, i) => (
                <motion.div
                  key={i}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200/50"
                >
                  <p className="text-sm font-medium text-gray-900 mb-3">{task.text}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{task.owner}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{task.due}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Task Bundle Card */}
          <AnimatePresence>
            {step >= 4 && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
                className="mt-6 p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl text-white"
              >
                <h5 className="font-bold mb-2">Create Task Bundle</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="px-2 py-1 bg-white/20 rounded">Outreach (2)</div>
                  <div className="px-2 py-1 bg-white/20 rounded">Drafting (1)</div>
                  <div className="px-2 py-1 bg-white/20 rounded">Research (0)</div>
                  <div className="px-2 py-1 bg-white/20 rounded">Compliance (1)</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
