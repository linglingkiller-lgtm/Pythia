import React from 'react';
import { motion } from 'motion/react';

const OUTCOMES = [
  {
    number: '~8–12',
    unit: 'hours saved',
    subtext: 'per week*',
  },
  {
    number: 'Fewer',
    unit: 'missed deadlines',
    subtext: 'across teams',
  },
  {
    number: 'One',
    unit: 'unified picture',
    subtext: 'of all operations',
  },
];

export function OutcomesChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="py-48 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {OUTCOMES.map((outcome, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.15 }}
              className="text-center"
            >
              <div className="text-6xl md:text-7xl font-bold text-gray-900 mb-2">
                {outcome.number}
              </div>
              <div className="text-xl font-medium text-gray-700 mb-1">
                {outcome.unit}
              </div>
              <div className="text-sm text-gray-500">
                {outcome.subtext}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="text-center text-sm text-gray-400 mt-16"
        >
          *Illustrative. Customize to your org's results.
        </motion.p>
      </div>
    </section>
  );
}
