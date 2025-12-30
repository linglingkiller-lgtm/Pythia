import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, Scale, Users, TrendingUp } from 'lucide-react';

const VISUALS = [
  {
    id: 'war-room',
    title: 'War Room Overview',
    description: 'Live command center with projects, risks, and actions',
    icon: Briefcase,
  },
  {
    id: 'bills',
    title: 'Bills Tracking',
    description: 'Progress bars, status, and AI-powered analysis',
    icon: Scale,
  },
  {
    id: 'legislators',
    title: 'Legislator Profiles',
    description: 'Relationship meters and strategic intelligence',
    icon: Users,
  },
  {
    id: 'unified',
    title: 'Unified Operations',
    description: 'Teams, projects, records, and performance—one view',
    icon: TrendingUp,
  },
];

export function SystemOverviewChapter() {
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
      id="overview"
      ref={sectionRef}
      className="relative min-h-[300vh] py-32"
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-7xl mx-auto">
            {/* Left: Sticky statement */}
            <div>
              <motion.h2
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight"
              >
                It's not a tool.
                <br />
                It's a system.
              </motion.h2>
              
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="text-xl text-gray-600 leading-relaxed mb-12"
              >
                Bills, relationships, records, projects, performance—unified into one operating picture.
              </motion.p>

              {/* Progress dots */}
              <div className="flex gap-3">
                {VISUALS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index === activeIndex
                        ? 'w-12 bg-gradient-to-r from-red-600 to-blue-600'
                        : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Changing visuals */}
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
                    <div className="w-full p-12 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
                      <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-red-600 to-blue-600 flex items-center justify-center mb-6">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-3xl font-semibold text-gray-900 mb-3">
                        {visual.title}
                      </h3>
                      <p className="text-lg text-gray-600">
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
