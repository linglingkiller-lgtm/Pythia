import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { ExampleModal } from './ExampleModal';
import { GlowOrb } from './GlowOrb';

interface FeatureMomentProps {
  id: string;
  headline: string;
  support: string;
  mockComponent: React.ReactNode;
}

export function FeatureMoment({ id, headline, support, mockComponent }: FeatureMomentProps) {
  const [showModal, setShowModal] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <section id={id} className="container mx-auto px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Headline + Support */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 max-w-4xl mx-auto leading-tight">
              {headline}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {support}
            </p>
          </motion.div>

          {/* Mock with enhanced hover effects */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 40, scale: 0.98 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.01, y: -4 }}
            className="mb-8 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <div className="relative">
              {/* Glow on hover */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute -inset-4 bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-[40px] blur-2xl -z-10"
              />
              {mockComponent}
            </div>
          </motion.div>

          {/* CTAs with enhanced animations */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="flex items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowModal(true)}
                className="backdrop-blur-sm"
              >
                See an example
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const element = document.querySelector('#' + id);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="backdrop-blur-sm"
              >
                Learn more
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ExampleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={headline}
        mockComponent={mockComponent}
      />
    </>
  );
}