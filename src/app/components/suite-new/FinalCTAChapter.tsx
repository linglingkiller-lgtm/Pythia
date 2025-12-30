import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

interface FinalCTAChapterProps {
  onOpenBuilder: () => void;
}

export function FinalCTAChapter({ onOpenBuilder }: FinalCTAChapterProps) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <style>{`
        /* Gradient animated logo - Carved/Inset Effect */
        .pythia-gradient-logo-cta {
          /* Inverted shadows for sunken/carved effect + reduced glow */
          filter: brightness(0) invert(1)
                  drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.3)) 
                  drop-shadow(0 1px 2px rgba(255, 255, 255, 0.8))
                  drop-shadow(1px 0 1px rgba(0, 0, 0, 0.15))
                  drop-shadow(0 0 12px rgba(255, 255, 255, 0.54))
                  drop-shadow(0 0 24px rgba(255, 255, 255, 0.27));
        }
        
        .pythia-icon-stat {
          filter: brightness(0) invert(1);
        }
      `}</style>
      
      <section className="relative py-40 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.12]" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
          
          {/* Animated gradient orbs */}
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-red-600/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 right-1/4 w-[700px] h-[700px] bg-blue-600/30 rounded-full blur-[120px]"
          />
          <motion.div
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px]"
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Main content */}
          <div className="text-center mb-16">
            {/* Logo with carved effect */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mb-12"
            >
              <img 
                src={pythiaStarLogo} 
                alt="Revere" 
                className="pythia-gradient-logo-cta w-28 h-28 mx-auto"
              />
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            >
              <h2 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-none">
                Ready to begin?
              </h2>
              <p className="text-2xl md:text-3xl text-gray-400 mb-4">
                The future of government relations intelligence.
              </p>
              <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Join the most advanced teams in the industry who are already using Revere to stay ahead of the curve.
              </p>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            {[
              { label: '20+ hours', sublabel: 'saved per week' },
              { label: '$2.5M+', sublabel: 'opportunity value' },
              { label: '10x faster', sublabel: 'intelligence gathering' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-blue-600/20 rounded-2xl blur-3xl group-hover:blur-[64px] transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <img 
                    src={pythiaStarLogo} 
                    alt="Revere" 
                    className="pythia-icon-stat w-10 h-10 mx-auto mb-3"
                  />
                  <div className="text-3xl font-bold text-white mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-400">{stat.sublabel}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <Button 
                variant="primary" 
                size="lg" 
                className="px-12 py-6 text-lg shadow-2xl shadow-red-600/30 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 group"
              >
                Request a Demo
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
              whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
            >
              <Button 
                variant="secondary" 
                size="lg" 
                onClick={onOpenBuilder}
                className="px-12 py-6 text-lg bg-white/10 backdrop-blur-xl border-white/20 text-white hover:bg-white/20 group"
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Design Your Revere
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-gray-600">
              Revere © 2025
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}