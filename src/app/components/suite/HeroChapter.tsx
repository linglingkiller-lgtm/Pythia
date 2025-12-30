import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlowOrb } from './GlowOrb';
import { TypewriterText } from './TypewriterText';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

export function HeroChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const y = useTransform(scrollY, [0, 400], [0, -100]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <motion.div
        style={prefersReducedMotion ? {} : { opacity, scale, y }}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Logo with glow */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8, y: 20 }}
          animate={mounted ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          className="mb-8 relative"
        >
          {/* Glow effect behind logo */}
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
            <div className="w-40 h-40 bg-gradient-to-br from-red-500/30 to-blue-500/30 rounded-full blur-2xl" />
          </motion.div>

          <div className="relative w-32 h-32 mx-auto mb-6 rounded-[32px] bg-gradient-to-br from-red-600 via-white to-blue-600 p-1 shadow-2xl">
            <div className="w-full h-full bg-white rounded-[28px] flex items-center justify-center p-4">
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

        {/* Wordmark with shimmer */}
        <motion.h1
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="text-7xl md:text-8xl font-bold text-gray-900 mb-3 uppercase relative"
          style={{ 
            fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
            letterSpacing: '0.08em'
          }}
        >
          <span className="relative inline-block">
            P y t h i a
            <motion.div
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 2,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
              style={{ width: '50%' }}
            />
          </span>
        </motion.h1>

        {/* Company name */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.4 }}
          className="text-xl text-gray-600 mb-8 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-red-500" />
          Echo Canyon Consulting
          <Sparkles className="w-4 h-4 text-blue-500" />
        </motion.p>

        {/* Title */}
        <motion.h2
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          className="text-5xl md:text-6xl font-bold text-gray-900 mb-4"
        >
          Pythia Intelligence Suite
        </motion.h2>

        {/* Tagline with typewriter effect */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.6 }}
          className="text-3xl md:text-4xl font-semibold mb-6"
        >
          <span className="bg-gradient-to-r from-red-600 via-gray-700 to-blue-600 bg-clip-text text-transparent">
            {prefersReducedMotion ? (
              'See Everything, Do Anything.'
            ) : (
              <TypewriterText text="See Everything, Do Anything." delay={800} speed={50} />
            )}
          </span>
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.7 }}
          className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto"
        >
          A command center for lobbying, public affairs, and paid canvassing operations.
        </motion.p>

        {/* CTAs with glow effects */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease, delay: 0.8 }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="primary" 
              size="lg" 
              className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              Request a Demo
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="secondary" 
              size="lg" 
              className="px-8 py-4 text-lg backdrop-blur-sm"
            >
              Explore the Suite
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
        animate={mounted ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-sm text-gray-500">Scroll</span>
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-6 h-6 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}