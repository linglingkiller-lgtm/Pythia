import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Zap, Shield, Calendar, FileText, Users, Radio, Building2, FolderKanban, LayoutDashboard, Library } from 'lucide-react';
import { Button } from '../ui/Button';
import pythiaStarLogo from 'figma:asset/e9e0c1ac0931dcb43912f4570079500e566ef87a.png';

export function NewHeroChapter() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [mounted, setMounted] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);

  const rotatingWords = [
    'command center',
    'war room',
    'intelligence hub',
    'strategic platform',
    'advocacy suite',
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const ease = [0.22, 1, 0.36, 1];

  const features = [
    { icon: LayoutDashboard, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { icon: Radio, label: 'War Room', color: 'from-red-500 to-orange-500' },
    { icon: FileText, label: 'Bill Tracker', color: 'from-purple-500 to-pink-500' },
    { icon: Users, label: 'Team Management', color: 'from-indigo-500 to-purple-500' },
    { icon: Calendar, label: 'Calendar', color: 'from-green-500 to-emerald-500' },
    { icon: FolderKanban, label: 'Project Hub', color: 'from-orange-500 to-yellow-500' },
    { icon: Building2, label: 'Client Command', color: 'from-cyan-500 to-blue-500' },
    { icon: Library, label: 'Records', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .shimmer-text {
          background: linear-gradient(
            90deg,
            #fff 0%,
            #fff 40%,
            rgba(255, 255, 255, 0.8) 50%,
            #fff 60%,
            #fff 100%
          );
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .shimmer-text {
            animation: none !important;
          }
        }
      `}</style>

      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.15]" style={{
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Radial gradients for color */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(220, 38, 38, 0.6) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)' }}
        />
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />

      <motion.div
        style={prefersReducedMotion ? {} : { 
          opacity: heroOpacity, 
          scale: heroScale, 
          y: heroY,
        }}
        className="relative z-10 text-center px-6 max-w-7xl mx-auto w-full"
      >
        {/* Floating feature badges */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0 }}
              animate={mounted ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1, ease }}
              className="absolute glass-card rounded-full px-4 py-2 flex items-center gap-2"
              style={{
                top: `${10 + (i % 4) * 23}%`,
                left: i < 4 ? '5%' : 'auto',
                right: i >= 4 ? '5%' : 'auto',
                animation: !prefersReducedMotion ? `float ${3 + i * 0.3}s ease-in-out infinite ${i * 0.2}s` : 'none',
              }}
            >
              <div className={`bg-gradient-to-r ${feature.color} p-1.5 rounded-full`}>
                <feature.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-white/80 font-medium whitespace-nowrap">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Logo */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="mb-8"
        >
          <div className="inline-block relative">
            {/* Glow effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-red-600 to-blue-600 rounded-full blur-xl opacity-50"
              style={{ animation: !prefersReducedMotion ? 'glow 3s ease-in-out infinite' : 'none' }}
            />
            <img 
              src={pythiaStarLogo} 
              alt="Revere" 
              className="relative w-32 h-32 drop-shadow-2xl"
              style={{
                filter: 'brightness(0) invert(1) drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
              }}
            />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.3 }}
          className="mb-6"
        >
          <h1 
            className="text-[5rem] md:text-[8rem] font-black tracking-tight leading-none mb-4"
            style={{
              fontFamily: '"Anta", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #fecdd3 50%, #dbeafe 75%, #ffffff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 40px rgba(255, 255, 255, 0.3))',
              letterSpacing: '0.05em',
            }}
          >
            REVERE
          </h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <p className="text-lg text-white/60 font-medium tracking-wider uppercase">
              Intelligence Suite
            </p>
            <div className="h-px w-12 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 flex items-center justify-center flex-wrap">
            <span className="text-white/90">Your complete&nbsp;</span>
            <span className="relative inline-block min-w-[280px] md:min-w-[520px] text-left">
              {rotatingWords.map((word, index) => (
                <motion.span
                  key={word}
                  initial={false}
                  animate={{
                    opacity: index === currentWordIndex ? 1 : 0,
                    y: index === currentWordIndex ? 0 : 20,
                  }}
                  transition={{ duration: 0.5, ease }}
                  className="absolute left-0 top-0 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <span className="invisible">{rotatingWords[0]}</span>
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed">
            Strategic intelligence for lobbying, public affairs, and advocacy campaigns
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-12"
        >
          {[
            { value: '50+', label: 'State Legislatures' },
            { value: '24/7', label: 'Bill Monitoring' },
            { value: '10K+', label: 'Legislators Tracked' },
          ].map((stat, i) => (
            <div key={i} className="glass-card rounded-2xl px-8 py-4 min-w-[160px]">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text" style={{
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {stat.value}
              </div>
              <div className="text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={mounted ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            className="group relative px-10 py-4 text-base font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative text-white flex items-center gap-2">
              Request a Demo
              <Zap className="w-4 h-4" />
            </span>
          </button>
          <button
            className="group px-10 py-4 text-base font-semibold rounded-xl glass-card transition-all duration-300 hover:scale-105 border border-white/20 hover:border-white/40"
          >
            <span className="text-white/90 group-hover:text-white transition-colors">
              Explore Features
            </span>
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ duration: 1.0, ease, delay: 1.4 }}
        style={prefersReducedMotion ? {} : { opacity: heroOpacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={prefersReducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/40 uppercase tracking-wider">Scroll to explore</span>
          <ChevronDown className="w-6 h-6 text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}