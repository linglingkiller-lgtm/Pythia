import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ChapterIndicatorProps {
  chapter: string;
}

const CHAPTER_NAMES: Record<string, string> = {
  ask: 'Ask',
  structure: 'Structure',
  command: 'Command',
  track: 'Track',
  pace: 'Pace',
};

export function ChapterIndicator({ chapter }: ChapterIndicatorProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="fixed top-6 right-6 z-40 pointer-events-none">
      <AnimatePresence mode="wait">
        {chapter && (
          <motion.div
            key={chapter}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg"
          >
            <span className="text-sm font-semibold text-gray-900">
              {CHAPTER_NAMES[chapter]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
