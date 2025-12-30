import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Brain, Zap, Users, TrendingUp, Shield, Globe, Database, Clock } from 'lucide-react';

export function PlatformOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const capabilities = [
    {
      icon: Brain,
      title: 'Pythia Intelligence',
      description: 'AI-powered insights that identify trends, risks, and opportunities before they become obvious.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Database,
      title: 'Centralized Data',
      description: 'All your legislative tracking, bills, legislators, and client data in one unified platform.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Zap,
      title: 'Real-Time Alerts',
      description: 'Instant notifications when bills move, legislators vote, or priorities shift.',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Seamless coordination across your organization with shared workspaces and assignments.',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: TrendingUp,
      title: 'Strategic Analytics',
      description: 'Advanced reporting and forecasting to demonstrate impact and guide decisions.',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: Globe,
      title: 'Multi-State Coverage',
      description: 'Track legislation across 50+ state legislatures with comprehensive coverage.',
      gradient: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <section id="platform" ref={ref} className="relative py-32 px-6 bg-white overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-emerald-50/30 to-transparent pointer-events-none z-20" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.2, 1],
          opacity: [0.06, 0.1, 0.06],
          x: [-20, 20, -20],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-40 right-1/4 w-[800px] h-[800px] bg-gradient-to-br from-red-500/10 to-blue-500/10 rounded-full blur-[140px]"
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1.15, 1, 1.15],
          opacity: [0.08, 0.12, 0.08],
          x: [20, -20, 20],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-40 left-1/4 w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-[130px]"
      />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-semibold text-red-700">The Complete Platform</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            Everything you need,
            <br />
            <span className="bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              nothing you don't
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Pythia brings together legislative tracking, relationship management, campaign coordination, 
            and strategic intelligence into one powerful platform built specifically for government affairs professionals.
          </p>
        </motion.div>

        {/* Capabilities grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${capability.gradient} shadow-lg`}>
                    <capability.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {capability.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {capability.description}
                </p>

                {/* Hover gradient border */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${capability.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-700"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Join 500+ organizations</div>
                <div className="text-sm text-gray-600">already using Pythia</div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors">
              See it in action
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}