import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, History, Eye } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: 'Role-based access',
    description: 'Granular permissions for every user',
  },
  {
    icon: History,
    title: 'Audit trails',
    description: 'Complete activity logs and timestamps',
  },
  {
    icon: Lock,
    title: 'Compliance-ready logging',
    description: 'Track what matters for your org',
  },
  {
    icon: Eye,
    title: 'Records retention controls',
    description: 'Configurable retention policies',
  },
];

export function TrustChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight">
            Built for sensitive work.
          </h2>
        </motion.div>

        {/* Trust items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {TRUST_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
