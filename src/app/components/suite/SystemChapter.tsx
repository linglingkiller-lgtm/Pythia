import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Scale, Users, FileText, TrendingUp } from 'lucide-react';
import { FloatingCard } from './FloatingCard';
import { GlowOrb } from './GlowOrb';

const VISUALS = [
  {
    id: 'bills',
    title: 'Bills Intelligence',
    icon: Scale,
    description: 'Track legislation with AI-powered analysis',
  },
  {
    id: 'war-room',
    title: 'War Room',
    icon: Users,
    description: 'Modular command center for operations',
  },
  {
    id: 'records',
    title: 'Records Vault',
    icon: FileText,
    description: 'Institutional memory with audit trails',
  },
  {
    id: 'pace',
    title: 'Door Pace Analysis',
    icon: TrendingUp,
    description: 'Campaign performance tracking',
  },
];

export function SystemChapter() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const newIndex = Math.floor(scrollProgress * VISUALS.length);
      setActiveIndex(Math.min(newIndex, VISUALS.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] py-32"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Sticky text */}
            <div>
              <motion.h2
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                It's not a tool. It's a system.
              </motion.h2>
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-xl text-gray-600 leading-relaxed"
              >
                Bills, relationships, records, projects, performance—unified into one operating picture.
              </motion.p>

              {/* Progress dots */}
              <div className="flex gap-2 mt-12">
                {VISUALS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === activeIndex
                        ? 'w-12 bg-gradient-to-r from-red-600 via-red-50 to-blue-600'
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Swapping visuals */}
            <div className="relative h-[600px]">
              {VISUALS.map((visual, index) => {
                const Icon = visual.icon;
                const isActive = index === activeIndex;
                
                return (
                  <motion.div
                    key={visual.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      y: prefersReducedMotion ? 0 : isActive ? 0 : 20,
                      scale: prefersReducedMotion ? 1 : isActive ? 1 : 0.98,
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                  >
                    <div className="w-full max-w-lg p-12 rounded-[28px] bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
                      <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-red-600 via-red-50 to-blue-600 flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {visual.title}
                      </h3>
                      <p className="text-gray-600">
                        {visual.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}