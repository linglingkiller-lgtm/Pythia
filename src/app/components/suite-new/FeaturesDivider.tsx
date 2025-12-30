import React from 'react';
import { motion } from 'motion/react';
import { Star, TrendingUp } from 'lucide-react';

export function FeaturesDivider() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="relative py-32 px-6 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      
      {/* Animated orbs */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-red-500/30 to-pink-500/30 rounded-full blur-[100px]"
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-bl from-blue-500/30 to-purple-500/30 rounded-full blur-[120px]"
      />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="inline-flex flex-col items-center gap-6"
        >
          {/* Animated icon group */}
          <div className="relative">
            <motion.div
              animate={prefersReducedMotion ? {} : {
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-40"
            />
            <div className="relative inline-flex items-center gap-3 p-6 rounded-2xl bg-white/80 backdrop-blur-xl border-2 border-gray-200 shadow-2xl">
              <Star className="w-10 h-10 text-purple-600 fill-purple-600" />
              <div className="w-px h-8 bg-gray-300" />
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Title */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-6xl md:text-7xl font-black mb-4">
                <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Features
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Explore every capability that makes Pythia the most powerful platform for government affairs professionals
              </p>
            </motion.div>
          </div>

          {/* Decorative scroll indicator */}
          <motion.div
            animate={prefersReducedMotion ? {} : {
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-2 mt-4"
          >
            <div className="flex items-center gap-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-red-600 to-blue-600 animate-pulse" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent via-blue-500 to-transparent" />
            </div>
            <span className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
              Scroll to explore
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}