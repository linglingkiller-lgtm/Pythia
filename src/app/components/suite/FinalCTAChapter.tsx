import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { GlowOrb } from './GlowOrb';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

export function FinalCTAChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="min-h-screen flex items-center justify-center relative py-32">
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Logo with glow */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 relative"
        >
          {/* Pulsing glow behind logo */}
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-40 h-40 bg-gradient-to-br from-red-500/40 to-blue-500/40 rounded-full blur-3xl" />
          </motion.div>

          <div className="relative w-32 h-32 mx-auto mb-6 rounded-[28px] bg-gradient-to-br from-red-600 via-red-50 to-blue-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[24px] flex items-center justify-center p-4">
              <img 
                src={pythiaStarLogo} 
                alt="Pythia" 
                className="w-full h-full object-contain"
                style={{
                  filter: 'brightness(0) saturate(100%) invert(14%) sepia(95%) saturate(6893%) hue-rotate(359deg) brightness(94%) contrast(115%)'
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
        >
          See everything. Do anything.
        </motion.h2>

        {/* Subhead */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Pythia turns legislative monitoring and paid canvassing operations into one operating system.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="primary" size="lg" className="px-10 py-5 text-lg shadow-2xl">
              Request a Demo
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button variant="secondary" size="lg" className="px-10 py-5 text-lg backdrop-blur-sm">
              Explore the Platform
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="text-sm text-gray-500 mt-16"
        >
          Echo Canyon Consulting © 2024
        </motion.p>
      </div>
    </section>
  );
}