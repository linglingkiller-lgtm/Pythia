import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Clock, DollarSign, TrendingUp, Target, Users, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

export function BenefitsROI() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const metrics = [
    {
      icon: Clock,
      value: '20+ hours',
      label: 'Saved per week',
      description: 'Automated tracking and alerts eliminate manual monitoring',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: DollarSign,
      value: '$2.5M+',
      label: 'Opportunity value',
      description: 'Early identification of legislative opportunities and risks',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: TrendingUp,
      value: '3x faster',
      label: 'Response time',
      description: 'Real-time alerts and centralized workflows accelerate action',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Target,
      value: '95%',
      label: 'Client satisfaction',
      description: 'Comprehensive tracking and reporting impresses stakeholders',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const benefits = [
    {
      icon: Briefcase,
      title: 'Win More Business',
      description: 'Demonstrate your sophistication with real-time intelligence and comprehensive reporting that sets you apart from competitors.',
    },
    {
      icon: Users,
      title: 'Scale Your Team',
      description: 'Handle more clients and jurisdictions without adding headcount. Pythia multiplies your team\'s effectiveness.',
    },
    {
      icon: CheckCircle2,
      title: 'Never Miss Critical Updates',
      description: 'Automated monitoring across 50+ states ensures you catch every important development before it\'s too late.',
    },
  ];

  return (
    <section id="roi" ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-emerald-50/30 to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-red-50/30 to-transparent pointer-events-none z-20" />
      
      {/* Animated gradient orbs */}
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1, 1.25, 1],
          opacity: [0.08, 0.12, 0.08],
          y: [-30, 30, -30],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-1/3 w-[900px] h-[900px] bg-gradient-to-br from-emerald-500/12 to-green-500/12 rounded-full blur-[150px]"
      />
      <motion.div
        animate={prefersReducedMotion ? {} : {
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.14, 0.1],
          y: [30, -30, 30],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-20 right-1/3 w-[800px] h-[800px] bg-gradient-to-tl from-blue-500/12 to-cyan-500/12 rounded-full blur-[140px]"
      />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 mb-6">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Measurable Impact</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            The ROI is
            <br />
            <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              impossible to ignore
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Government affairs teams using Pythia report dramatic improvements in efficiency, 
            revenue generation, and client satisfaction.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative h-full p-6 rounded-2xl bg-white border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.gradient} mb-4 shadow-lg`}>
                  <metric.icon className="w-5 h-5 text-white" />
                </div>

                {/* Metric */}
                <div className={`text-4xl font-black mb-2 bg-gradient-to-br ${metric.gradient} bg-clip-text text-transparent`}>
                  {metric.value}
                </div>
                <div className="font-semibold text-gray-900 mb-2">
                  {metric.label}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {metric.description}
                </p>

                {/* Hover gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${metric.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="relative p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl"
            >
              <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <benefit.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="rounded-2xl bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 p-[2px]">
            <div className="rounded-2xl bg-gray-900 p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    500+
                  </div>
                  <div className="text-gray-400">
                    Organizations trust Pythia
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    10M+
                  </div>
                  <div className="text-gray-400">
                    Bills tracked annually
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    99.9%
                  </div>
                  <div className="text-gray-400">
                    Platform uptime
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-800">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Ready to transform your workflow?
                  </h3>
                  <p className="text-gray-400">
                    See how Pythia can deliver ROI for your organization.
                  </p>
                </div>
                <button className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  Schedule a Demo
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}