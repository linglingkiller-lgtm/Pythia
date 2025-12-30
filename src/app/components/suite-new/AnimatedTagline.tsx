import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

const WORDS = [
  'everywhere',
  'the way',
  'where',
  'when',
  'how',
];

export function AnimatedTagline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % WORDS.length);
      
      // Generate sparkles on word change (spread around text more evenly)
      if (!prefersReducedMotion) {
        const newSparkles = Array.from({ length: 8 }, (_, i) => ({
          id: Date.now() + i,
          x: (Math.random() * 400 - 200) * (i % 2 === 0 ? 1 : -1), // Spread left and right
          y: Math.random() * 120 - 60, // More vertical spread
        }));
        setSparkles(newSparkles);
        
        // Clear sparkles after animation
        setTimeout(() => setSparkles([]), 1000);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div className="relative inline-block">
      <h2 className="text-[2.5rem] md:text-[3.5rem] font-semibold tracking-tight leading-tight hero-text-shadow" style={{ color: 'rgba(20, 20, 20, 0.8)', fontWeight: 600 }}>
        See Everything,{' '}
        <span className="relative inline-block align-middle" style={{ minWidth: '280px', height: '1.2em', verticalAlign: 'middle' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentIndex}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20, rotateX: -90 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotateX: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20, rotateX: 90 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-0 top-0 w-full text-left font-bold"
              style={{ 
                transformOrigin: 'center',
                background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #3b82f6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 1px 2px rgba(255, 255, 255, 0.5))',
              }}
            >
              {WORDS[currentIndex]}
            </motion.span>
          </AnimatePresence>
          
          {/* Flying sparkles */}
          {!prefersReducedMotion && sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1.2, 1, 0],
                x: sparkle.x,
                y: sparkle.y,
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 pointer-events-none"
            >
              <Sparkles 
                className="w-5 h-5" 
                style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 3px rgba(251, 191, 36, 0.8))' }}
                fill="currentColor"
              />
            </motion.div>
          ))}
        </span>
        {' '}you work.
      </h2>
    </div>
  );
}