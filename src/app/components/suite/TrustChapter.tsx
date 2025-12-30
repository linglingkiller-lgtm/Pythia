import React from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, History, Eye } from 'lucide-react';
import { FloatingCard } from './FloatingCard';

const FEATURES = [
  {
    icon: Shield,
    title: 'Role-based access',
    description: 'Control who sees what across your organization',
  },
  {
    icon: History,
    title: 'Audit trails for records and deliverables',
    description: 'Track every change and action with timestamped logs',
  },
  {
    icon: Lock,
    title: 'Outputs saved directly to your Records vault',
    description: 'Automatic archival of all generated content',
  },
  {
    icon: Eye,
    title: 'Designed to keep work grounded in internal sources',
    description: 'Citations trace back to your own data and records',
  },
];

export function TrustChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="security" className="py-32 container mx-auto px-6">
      <div className="max-w-7xl mx-auto">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Built for sensitive work.
          </h2>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="p-8 bg-white/80 backdrop-blur-xl rounded-[24px] border border-gray-200/50 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-red-600 via-red-50 to-blue-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}