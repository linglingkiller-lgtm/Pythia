import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { FileText, Sparkles, TrendingUp, GitCompare, Users, Brain, Scale, BookOpen, AlertTriangle, CheckCircle2, Clock, Pin, Eye, ChevronRight, Target, Zap, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

// Number count-up animation component
const AnimatedNumber = React.memo(({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState('0');

  React.useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 1.5,
      ease: [0.34, 1.56, 0.64, 1],
      onUpdate: (latest) => {
        const formatted = decimals > 0 
          ? latest.toFixed(decimals) 
          : Math.round(latest).toLocaleString();
        setDisplayValue(formatted);
      }
    });

    return () => controls.stop();
  }, [value, decimals]);

  return (
    <motion.span
      initial={{ scale: 1 }}
      animate={{ 
        scale: [1, 1.15, 1],
      }}
      transition={{ 
        duration: 0.6,
        delay: 1.3,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
});

AnimatedNumber.displayName = 'AnimatedNumber';

const capabilities = [
  {
    title: 'Real-Time Bill Syncing',
    description: 'Auto-sync with legislature websites every 6 hours, track version changes instantly',
  },
  {
    title: 'Multi-Lens Impact Analysis',
    description: 'See bill impacts through healthcare, energy, education, or business lenses',
  },
  {
    title: 'Momentum Prediction Engine',
    description: 'AI scores every bill 0-100 on passage likelihood with trend forecasting',
  },
  {
    title: 'Stakeholder Intelligence',
    description: 'Member-by-member support predictions with confidence levels and influencing factors',
  },
  {
    title: 'Version Tracking & Redlines',
    description: 'Side-by-side comparisons with AI summaries of substantive changes',
  },
  {
    title: 'Automated Action Plans',
    description: 'Revere converts bill intelligence into prioritized tasks with deadlines',
  },
];

export function BillTrackerMoment() {
  const [activeView, setActiveView] = useState<'watchlist' | 'ai-review' | 'momentum' | 'stakeholders'>('watchlist');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="bill-tracker" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-50/30 to-transparent pointer-events-none" />
      
      {/* Animated background elements */}
      {/* Flowing background gradients - Blue/White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-blue-100/70 via-blue-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-blue-50/40 via-white to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-gradient-to-br from-blue-50/50 via-transparent to-blue-100/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-50/20 to-purple-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Bill Tracker</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Bill Tracker.
            <br />
            Legislative Intelligence at Machine Speed.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Auto-sync with legislature websites, track every version change, predict passage likelihood with AI, and convert intelligence into action plans—all in real-time.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActiveView('watchlist')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'watchlist'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <Pin className="w-4 h-4 inline mr-2" />
            Smart Watchlist
          </button>
          <button
            onClick={() => setActiveView('ai-review')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'ai-review'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Revere Analysis
          </button>
          <button
            onClick={() => setActiveView('momentum')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'momentum'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Momentum Tracking
          </button>
          <button
            onClick={() => setActiveView('stakeholders')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'stakeholders'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-blue-300 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Stakeholder Intel
          </button>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'watchlist' && (
            <motion.div
              key="watchlist"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Smart Watchlist View */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just list bills. It organizes them by urgency.
                    </h3>
                    <p className="text-base text-gray-700">
                      Smart auto-triage routes every bill to the right tab—Watchlist, New & Relevant, At Risk, or Moving Fast.
                    </p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Smart Watchlist with Auto-Triage</h3>
                    <p className="text-sm text-gray-600">5 intelligent tabs: Watchlist, New & Relevant, At Risk, Moving Fast, All Bills</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right mr-3">
                      <div className="text-xs text-gray-500">Last synced:</div>
                      <div className="text-sm font-medium text-gray-900">12/19/25 3:42 PM</div>
                    </div>
                    <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      Sync Now
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Plus className="w-4 h-4 inline mr-1" />
                      Add Bills
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex items-center gap-2 border-b border-gray-200">
                  <button className="pb-3 px-4 text-sm font-medium text-blue-700 border-b-2 border-blue-700">
                    Watchlist <span className="ml-1 px-2 py-0.5 bg-blue-100 rounded-full text-xs">4</span>
                  </button>
                  <button className="pb-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                    New & Relevant <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">2</span>
                  </button>
                  <button className="pb-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                    At Risk <span className="ml-1 px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">3</span>
                  </button>
                  <button className="pb-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                    Moving Fast <span className="ml-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs">5</span>
                  </button>
                  <button className="pb-3 px-4 text-sm font-medium text-gray-600 hover:text-gray-900">
                    All Bills <span className="ml-1 px-2 py-0.5 bg-gray-100 rounded-full text-xs">18</span>
                  </button>
                </div>

                {/* Bill Rows */}
                <div className="space-y-3">
                  {/* Bill 1 - High Priority */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-5 rounded-xl bg-white border-2 border-red-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">HB 2415</span>
                          <Pin className="w-4 h-4 text-red-600 fill-red-600" />
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">Committee</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">Oppose</span>
                          <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-medium flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Fast Track
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">Healthcare Transparency Requirements Act</h4>
                        <p className="text-sm text-gray-600 mb-3">Requires all healthcare providers to publish price transparency data for 300+ procedures; includes $50K/day penalties for non-compliance</p>
                        
                        {/* Progress Timeline - Staged Design */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {['Introduced', 'Committee', 'Floor', 'Passed', 'Other Chamber', 'Governor', 'Law'].map((stage, index) => {
                              const currentStage = 1; // Committee stage (index 1)
                              const isCompleted = index < currentStage;
                              const isCurrent = index === currentStage;
                              
                              const getSegmentGradient = () => {
                                if (!isCompleted && !isCurrent) return 'bg-gray-200';
                                const progress = index / 6;
                                if (progress < 0.33) return 'from-blue-500 to-blue-600';
                                if (progress < 0.66) return 'from-purple-500 to-purple-600';
                                return 'from-red-500 to-red-600';
                              };
                              
                              return (
                                <div key={stage} className="flex-1 relative">
                                  <motion.div
                                    className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                                      isCompleted || isCurrent ? `bg-gradient-to-r ${getSegmentGradient()}` : 'bg-gray-200'
                                    } ${isCurrent ? 'ring-2 ring-red-300 ring-offset-1' : ''}`}
                                    initial={prefersReducedMotion ? { scaleX: isCompleted || isCurrent ? 1 : 0 } : { scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 + (index * 0.1), ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ transformOrigin: 'left' }}
                                  >
                                    {isCurrent && (
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-red-300/60 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }}
                                      />
                                    )}
                                    {isCompleted && (
                                      <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                                        animate={prefersReducedMotion ? {} : { scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.5 + (index * 0.1), type: "spring", stiffness: 300 }}
                                      >
                                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between">
                            {['Intro', 'Cmte', 'Floor', 'Pass', 'Other', 'Gov', 'Law'].map((label, index) => {
                              const currentStage = 1;
                              const isCurrent = index === currentStage;
                              const isCompleted = index < currentStage;
                              return (
                                <div
                                  key={label}
                                  className={`text-xs font-semibold transition-colors duration-300 text-center ${
                                    isCurrent ? 'text-red-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                  }`}
                                  style={{ width: `${100 / 7}%` }}
                                >
                                  {label}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Next Action Alert */}
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-red-600" />
                            <span className="font-medium text-red-900">Committee vote in 3 days</span>
                            <span className="text-red-700">• Health & Human Services Committee</span>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-600">Momentum: 73</span>
                          </div>
                          <div>Sponsor: Rep. Martinez (D-14)</div>
                          <div>Co-sponsors: 8</div>
                          <div>Issue: Healthcare</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            View Full Analysis
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            Generate Brief
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            Create Tasks
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bill 2 - Medium Priority */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-5 rounded-xl bg-white border border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">SB 89</span>
                          <Pin className="w-4 h-4 text-red-600 fill-red-600" />
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Floor</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">Support</span>
                          <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">Amended</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">Clean Energy Tax Credits Extension</h4>
                        <p className="text-sm text-gray-600 mb-3">Extends solar and wind energy tax credits through 2030; includes new incentives for battery storage systems</p>
                        
                        {/* Progress Timeline - Staged Design */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {['Introduced', 'Committee', 'Floor', 'Passed', 'Other Chamber', 'Governor', 'Law'].map((stage, index) => {
                              const currentStage = 2; // Floor stage (index 2)
                              const isCompleted = index < currentStage;
                              const isCurrent = index === currentStage;
                              
                              const getSegmentGradient = () => {
                                if (!isCompleted && !isCurrent) return 'bg-gray-200';
                                const progress = index / 6;
                                if (progress < 0.33) return 'from-blue-500 to-blue-600';
                                if (progress < 0.66) return 'from-purple-500 to-purple-600';
                                return 'from-red-500 to-red-600';
                              };
                              
                              return (
                                <div key={stage} className="flex-1 relative">
                                  <motion.div
                                    className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                                      isCompleted || isCurrent ? `bg-gradient-to-r ${getSegmentGradient()}` : 'bg-gray-200'
                                    } ${isCurrent ? 'ring-2 ring-purple-300 ring-offset-1' : ''}`}
                                    initial={prefersReducedMotion ? { scaleX: isCompleted || isCurrent ? 1 : 0 } : { scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.4 + (index * 0.1), ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ transformOrigin: 'left' }}
                                  >
                                    {isCurrent && (
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-300/60 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.2 }}
                                      />
                                    )}
                                    {isCompleted && (
                                      <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                                        animate={prefersReducedMotion ? {} : { scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.6 + (index * 0.1), type: "spring", stiffness: 300 }}
                                      >
                                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between">
                            {['Intro', 'Cmte', 'Floor', 'Pass', 'Other', 'Gov', 'Law'].map((label, index) => {
                              const currentStage = 2;
                              const isCurrent = index === currentStage;
                              const isCompleted = index < currentStage;
                              return (
                                <div
                                  key={label}
                                  className={`text-xs font-semibold transition-colors duration-300 text-center ${
                                    isCurrent ? 'text-purple-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                  }`}
                                  style={{ width: `${100 / 7}%` }}
                                >
                                  {label}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-600">Momentum: 84</span>
                          </div>
                          <div>Sponsor: Sen. Chen (R-9)</div>
                          <div>Co-sponsors: 14</div>
                          <div>Issue: Energy</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            View Full Analysis
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            Compare Versions
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            See Amendments
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bill 3 - Monitoring */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-5 rounded-xl bg-white border border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-bold text-gray-900">HB 1247</span>
                          <Pin className="w-4 h-4 text-red-600 fill-red-600" />
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">Introduced</span>
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full font-medium">Monitor</span>
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">Education Funding Formula Modernization</h4>
                        <p className="text-sm text-gray-600 mb-3">Reforms K-12 funding formula to include weighted student funding based on poverty levels and special needs</p>
                        
                        {/* Progress Timeline - Staged Design */}
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            {['Introduced', 'Committee', 'Floor', 'Passed', 'Other Chamber', 'Governor', 'Law'].map((stage, index) => {
                              const currentStage = 0; // Introduced stage (index 0)
                              const isCompleted = index < currentStage;
                              const isCurrent = index === currentStage;
                              
                              const getSegmentGradient = () => {
                                if (!isCompleted && !isCurrent) return 'bg-gray-200';
                                const progress = index / 6;
                                if (progress < 0.33) return 'from-blue-500 to-blue-600';
                                if (progress < 0.66) return 'from-purple-500 to-purple-600';
                                return 'from-red-500 to-red-600';
                              };
                              
                              return (
                                <div key={stage} className="flex-1 relative">
                                  <motion.div
                                    className={`h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden ${
                                      isCompleted || isCurrent ? `bg-gradient-to-r ${getSegmentGradient()}` : 'bg-gray-200'
                                    } ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-1' : ''}`}
                                    initial={prefersReducedMotion ? { scaleX: isCompleted || isCurrent ? 1 : 0 } : { scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.5 + (index * 0.1), ease: [0.34, 1.56, 0.64, 1] }}
                                    style={{ transformOrigin: 'left' }}
                                  >
                                    {isCurrent && (
                                      <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300/60 to-transparent"
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1.4 }}
                                      />
                                    )}
                                    {isCompleted && (
                                      <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                                        animate={prefersReducedMotion ? {} : { scale: 1 }}
                                        transition={{ duration: 0.3, delay: 0.7 + (index * 0.1), type: "spring", stiffness: 300 }}
                                      >
                                        <CheckCircle2 size={10} className="text-white" strokeWidth={3} />
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between">
                            {['Intro', 'Cmte', 'Floor', 'Pass', 'Other', 'Gov', 'Law'].map((label, index) => {
                              const currentStage = 0;
                              const isCurrent = index === currentStage;
                              const isCompleted = index < currentStage;
                              return (
                                <div
                                  key={label}
                                  className={`text-xs font-semibold transition-colors duration-300 text-center ${
                                    isCurrent ? 'text-blue-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                                  }`}
                                  style={{ width: `${100 / 7}%` }}
                                >
                                  {label}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-600">Momentum: 42</span>
                          </div>
                          <div>Sponsor: Rep. Johnson (D-22)</div>
                          <div>Co-sponsors: 3</div>
                          <div>Issue: Education</div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            View Full Analysis
                          </button>
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                            Similar Bills
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Batch Actions Footer */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <input type="checkbox" className="mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded" />
                    Select all 4 bills
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      Batch Summarize
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      Auto-Tag
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                      Export CSV
                    </button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Smart auto-triage organizes your entire bill universe. Import bills via URL paste or batch scraping, then let Revere route them to Watchlist, New & Relevant, At Risk, or Moving Fast tabs based on status, momentum, and your stance.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'ai-review' && (
            <motion.div
              key="ai-review"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Revere AI Review */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just summarize bills. It analyzes impact from every angle.
                    </h3>
                    <p className="text-base text-gray-700">
                      Multi-lens AI review delivers executive summaries, risk flags, talking points, and amendment concepts—instantly.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Revere AI Bill Review - HB 2415</h3>
                  <p className="text-sm text-gray-600">Multi-lens impact analysis with talking points, risk flags, and amendment concepts</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column: Summary & Multi-Lens Analysis */}
                  <div className="space-y-6">
                    {/* Executive Summary */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Executive Summary</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Mandates price transparency for 300+ procedures at all healthcare facilities</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Imposes $50,000/day penalties for non-compliance starting Jan 2026</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Creates new enforcement division within Department of Health</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Requires machine-readable format accessible via API</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>Estimated compliance cost: $2-5M per large hospital system</span>
                        </li>
                      </ul>
                    </div>

                    {/* Multi-Lens Impact Analysis */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Multi-Lens Impact Analysis</h4>
                      
                      {/* Healthcare Lens */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                            <Target className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium text-gray-900">Healthcare Provider Lens</span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1 ml-10">
                          <div><strong>Top Impact:</strong> Requires IT infrastructure overhaul</div>
                          <div><strong>Compliance Burden:</strong> 18-24 months implementation timeline</div>
                          <div><strong>Cost:</strong> $2-5M per hospital system</div>
                          <div><strong>Opponents:</strong> State Hospital Association</div>
                        </div>
                      </div>

                      {/* Consumer Lens */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-900">Patient/Consumer Lens</span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1 ml-10">
                          <div><strong>Top Impact:</strong> Price comparison before procedures</div>
                          <div><strong>Beneficiaries:</strong> Uninsured, high-deductible patients</div>
                          <div><strong>Cost Savings:</strong> Est. $500-2000 per procedure</div>
                        </div>
                      </div>

                      {/* Insurance Lens */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Scale className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium text-gray-900">Insurance Industry Lens</span>
                        </div>
                        <div className="text-sm text-gray-700 space-y-1 ml-10">
                          <div><strong>Top Impact:</strong> Negotiating leverage shifts to consumers</div>
                          <div><strong>Opponents:</strong> Major insurance carriers</div>
                        </div>
                      </div>
                    </div>

                    {/* Risk Flags */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Risk Flags</h4>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-red-900 mb-1">High Severity: Retroactive Penalty Clause</div>
                            <div className="text-xs text-red-700 mb-1">Section 4(b) - Penalties apply to non-compliance from bill signing date</div>
                            <div className="text-xs text-gray-600"><strong>Mitigation:</strong> Seek 12-month grace period amendment</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-yellow-900 mb-1">Medium Severity: Undefined "Machine-Readable"</div>
                            <div className="text-xs text-yellow-700 mb-1">Section 3(a) - No technical standard specified</div>
                            <div className="text-xs text-gray-600"><strong>Mitigation:</strong> Push for HL7 FHIR standard in regulations</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Talking Points & Amendment Concepts */}
                  <div className="space-y-6">
                    {/* Talking Points */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Talking Points Generator</h4>
                      
                      {/* Tone Tabs */}
                      <div className="flex items-center gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                        <button className="flex-1 px-3 py-1.5 text-sm font-medium bg-white text-gray-900 rounded shadow-sm">
                          Formal
                        </button>
                        <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                          Casual
                        </button>
                        <button className="flex-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
                          Technical
                        </button>
                      </div>

                      {/* Main Points */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Main Points:</div>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">1.</span>
                            <span>Price transparency empowers patients but requires realistic implementation timeline</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">2.</span>
                            <span>Support concept but seek amendments on penalty structure and grace period</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">3.</span>
                            <span>Technical standards must be defined before enforcement begins</span>
                          </li>
                        </ul>
                      </div>

                      {/* 30-Second Version */}
                      <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                        <div className="text-sm font-medium text-blue-900 mb-1">30-Second Elevator Pitch:</div>
                        <div className="text-sm text-blue-800">
                          "We support transparency but oppose rushed implementation. Give providers 12 months to build compliant systems, define technical standards upfront, and phase penalties to avoid disrupting patient care during transition."
                        </div>
                      </div>

                      {/* Q&A */}
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Anticipated Q&A:</div>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 rounded-lg bg-gray-50">
                            <div className="font-medium text-gray-900 mb-1">Q: Why oppose transparency?</div>
                            <div className="text-gray-700">A: We don't. We oppose unrealistic deadlines that force rushed implementation.</div>
                          </div>
                          <div className="p-2 rounded-lg bg-gray-50">
                            <div className="font-medium text-gray-900 mb-1">Q: How long do you need?</div>
                            <div className="text-gray-700">A: 12 months for system builds, testing, and staff training.</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Amendment Concepts */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Amendment Concepts</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-sm font-medium text-green-900 mb-1">Amendment #1: Grace Period</div>
                          <div className="text-xs text-green-700 mb-1"><strong>Target:</strong> Section 4(b)</div>
                          <div className="text-xs text-gray-700 mb-2">Add 12-month implementation period before penalties begin</div>
                          <div className="text-xs text-gray-600"><strong>Rationale:</strong> Prevents system disruptions, allows proper IT infrastructure buildout</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-sm font-medium text-green-900 mb-1">Amendment #2: Technical Standards</div>
                          <div className="text-xs text-green-700 mb-1"><strong>Target:</strong> Section 3(a)</div>
                          <div className="text-xs text-gray-700 mb-2">Specify HL7 FHIR standard for machine-readable data</div>
                          <div className="text-xs text-gray-600"><strong>Rationale:</strong> Eliminates ambiguity, ensures interoperability</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="text-sm font-medium text-green-900 mb-1">Amendment #3: Phased Penalties</div>
                          <div className="text-xs text-green-700 mb-1"><strong>Target:</strong> Section 4(b)</div>
                          <div className="text-xs text-gray-700 mb-2">Start penalties at $5K/day, escalate to $50K over 6 months</div>
                          <div className="text-xs text-gray-600"><strong>Rationale:</strong> Incentivizes compliance without punitive shock</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Plan Preview */}
                    <div className="p-5 rounded-xl bg-gradient-to-br from-red-50 to-blue-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-5 h-5 text-blue-600" />
                        <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-600"></div>
                            <span className="text-gray-900">Draft amendment language</span>
                          </div>
                          <span className="text-xs text-red-600 font-medium">DUE IN 2 DAYS</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                            <span className="text-gray-900">Meet with bill sponsor</span>
                          </div>
                          <span className="text-xs text-orange-600 font-medium">THIS WEEK</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-600"></div>
                            <span className="text-gray-900">Prepare committee testimony</span>
                          </div>
                          <span className="text-xs text-yellow-600 font-medium">NEXT WEEK</span>
                        </div>
                      </div>
                      <button className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                        Create All Tasks
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Every bill gets a full Revere AI review: executive summary, multi-lens impact analysis (healthcare, energy, education, business), risk flags with mitigation strategies, talking points in multiple tones, and amendment concepts ready for committee markup.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'momentum' && (
            <motion.div
              key="momentum"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Momentum Tracking */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just report status. It predicts what happens next.
                    </h3>
                    <p className="text-base text-gray-700">
                      AI-powered passage prediction scores momentum 0-100, forecasts next steps, and flags stall risks automatically.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Bill Momentum Tracker - HB 2415</h3>
                  <p className="text-sm text-gray-600">AI-powered passage prediction with trend analysis and next-step forecasting</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Left: Momentum Score */}
                  <motion.div 
                    className="p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200"
                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="text-sm text-gray-600 mb-2">Passage Likelihood</div>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-6xl font-bold text-orange-600">
                        <AnimatedNumber value={73} />
                      </span>
                      <span className="text-2xl text-gray-500">/100</span>
                    </div>
                    <motion.div 
                      className="flex items-center gap-2 mb-4"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span className="text-sm font-medium text-orange-700">+<AnimatedNumber value={8} /> vs last week</span>
                    </motion.div>
                    <div className="h-20 flex items-end gap-1">
                      {[45, 52, 58, 61, 65, 68, 73].map((val, i) => (
                        <motion.div 
                          key={i} 
                          className="flex-1 bg-orange-300 rounded-t"
                          initial={prefersReducedMotion ? { height: `${val}%` } : { height: 0 }}
                          animate={{ height: `${val}%` }}
                          transition={{ 
                            duration: 0.8, 
                            delay: 0.6 + (i * 0.08),
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>6w ago</span>
                      <span>Now</span>
                    </div>
                  </motion.div>

                  {/* Middle: Next Step Prediction */}
                  <div className="p-6 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-4">Next Step Prediction</div>
                    <div className="space-y-4">
                      <motion.div 
                        className="p-4 rounded-lg bg-green-50 border-2 border-green-300"
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-green-900">Committee Passage</span>
                          <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full font-medium">High confidence</span>
                        </div>
                        <div className="text-sm text-green-700 mb-2">Est. Dec 28-30, 2024</div>
                        <div className="text-xs text-gray-600">5-2 committee vote likely (3 confirmed yes, 2 yes-lean)</div>
                      </motion.div>

                      <motion.div 
                        className="p-4 rounded-lg bg-yellow-50 border border-yellow-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-yellow-900">Floor Vote</span>
                          <span className="text-xs px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full font-medium">Medium confidence</span>
                        </div>
                        <div className="text-sm text-yellow-700 mb-2">Est. Jan 8-12, 2025</div>
                        <div className="text-xs text-gray-600">32-28 predicted split, 5 swing votes identified</div>
                      </motion.div>

                      <motion.div 
                        className="p-4 rounded-lg bg-gray-50 border border-gray-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Governor Signature</span>
                          <span className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded-full font-medium">Low confidence</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-2">Est. Late Jan 2025</div>
                        <div className="text-xs text-gray-600">No public position yet, awaiting stakeholder input</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right: Stall Risks */}
                  <div className="p-6 rounded-xl bg-white border border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-4">Stall Risks</div>
                    <div className="space-y-3">
                      <motion.div 
                        className="p-3 rounded-lg bg-red-50 border border-red-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm font-medium text-red-900">Hospital Association Opposition</span>
                        </div>
                        <div className="text-xs text-red-700 mb-2">
                          <AnimatedNumber value={67} />% likelihood of stalling
                        </div>
                        <div className="text-xs text-gray-600">Lobbying for killer amendment on IT costs</div>
                      </motion.div>

                      <motion.div 
                        className="p-3 rounded-lg bg-orange-50 border border-orange-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-orange-900">End-of-Session Crunch</span>
                        </div>
                        <div className="text-xs text-orange-700 mb-2">
                          <AnimatedNumber value={42} />% likelihood of delay
                        </div>
                        <div className="text-xs text-gray-600">Introduced late in session, could get pushed to next year</div>
                      </motion.div>

                      <motion.div 
                        className="p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm font-medium text-yellow-900">Swing Vote Uncertainty</span>
                        </div>
                        <div className="text-xs text-yellow-700 mb-2">
                          <AnimatedNumber value={38} />% likelihood of failure
                        </div>
                        <div className="text-xs text-gray-600">5 members undecided, 3 votes needed for passage</div>
                      </motion.div>

                      <motion.div 
                        className="p-3 rounded-lg bg-green-50 border border-green-200"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Strong Sponsor Support</span>
                        </div>
                        <div className="text-xs text-green-700 mb-2">Positive factor</div>
                        <div className="text-xs text-gray-600">Rep. Martinez has <AnimatedNumber value={89} />% committee success rate</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Version Tracking Below */}
                <div className="mt-8 p-6 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Version History & Changes</h4>
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      <GitCompare className="w-4 h-4 inline mr-1" />
                      Compare Versions
                    </button>
                  </div>
                  <div className="space-y-3">
                    {/* Version 1 - Latest */}
                    <motion.div 
                      className="flex items-start gap-4 p-4 rounded-lg bg-blue-50 border-2 border-blue-300"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.9 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">Version 3 - Committee Substitute</span>
                          <motion.span 
                            className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full font-medium"
                            initial={prefersReducedMotion ? {} : { scale: 0 }}
                            animate={prefersReducedMotion ? {} : { scale: 1 }}
                            transition={{ duration: 0.4, delay: 1.1, type: "spring", stiffness: 300 }}
                          >
                            Latest
                          </motion.span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Published Dec 18, 2024</div>
                        <div className="text-sm text-gray-700 mb-2"><strong>AI Change Summary:</strong></div>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>Added 12-month grace period before penalties (addressed stakeholder concern)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>Reduced penalty from $50K to $25K/day for small facilities (&lt;50 beds)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-blue-600">•</span>
                            <span>Clarified "machine-readable" to mean HL7 FHIR standard</span>
                          </li>
                        </ul>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-blue-300 text-sm text-blue-700 rounded-lg hover:bg-blue-50 transition-colors">
                        View Full Text
                      </button>
                    </motion.div>

                    {/* Version 2 */}
                    <motion.div 
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.0 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">Version 2 - House Amendment</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Published Dec 10, 2024</div>
                        <div className="text-sm text-gray-700 mb-2"><strong>AI Change Summary:</strong></div>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Expanded procedure list from 200 to 300 items</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400">•</span>
                            <span>Added API requirement for third-party price comparison tools</span>
                          </li>
                        </ul>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Redline
                      </button>
                    </motion.div>

                    {/* Version 1 - Original */}
                    <motion.div 
                      className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 border border-gray-200"
                      initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 1.1 }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-gray-900">Version 1 - As Introduced</span>
                        </div>
                        <div className="text-xs text-gray-600 mb-2">Published Nov 28, 2024</div>
                        <div className="text-sm text-gray-500">Original bill language</div>
                      </div>
                      <button className="px-3 py-1.5 bg-white border border-gray-200 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        View Full Text
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Revere scores every bill 0-100 on passage likelihood, tracks momentum week-over-week, predicts next steps with confidence levels, identifies stall risks, and auto-detects version changes with AI summaries of what changed and why it matters.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'stakeholders' && (
            <motion.div
              key="stakeholders"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Stakeholder Intelligence */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-blue-50/30 to-purple-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't guess votes. It predicts them.
                    </h3>
                    <p className="text-base text-gray-700">
                      Member-by-member support predictions based on voting history, campaign finance, and district demographics.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Key Actors & Stakeholder Intelligence - HB 2415</h3>
                  <p className="text-sm text-gray-600">Member-by-member support predictions with influencing factors and relationship tracking</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Committee Composition */}
                  <div className="col-span-2">
                    <div className="p-5 rounded-xl bg-white border border-gray-200 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Health & Human Services Committee</h4>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600">5 D</span> • <span className="font-medium text-red-600">2 R</span>
                        </div>
                      </div>

                      {/* Member Cards */}
                      <div className="space-y-3">
                        {/* Member 1 - Chair, High Support */}
                        <motion.div 
                          className="p-4 rounded-lg bg-green-50 border-2 border-green-300"
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg"
                                initial={prefersReducedMotion ? {} : { scale: 0 }}
                                animate={prefersReducedMotion ? {} : { scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                              >
                                SC
                              </motion.div>
                              <div>
                                <div className="font-semibold text-gray-900">Rep. Sarah Chen (D-14)</div>
                                <div className="text-sm text-gray-600">Committee Chair • Phoenix</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                <AnimatedNumber value={89} />%
                              </div>
                              <div className="text-xs text-green-700 font-medium">Support Likely</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mb-2"><strong>Revere Analysis:</strong></div>
                          <ul className="space-y-1 text-sm text-gray-700 mb-3">
                            <li className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>District has 3 major hospital systems (transparency benefits consumers)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>Voted YES on 4/4 similar healthcare transparency bills 2020-2024</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>Public statement on Twitter supporting price transparency (Dec 12)</span>
                            </li>
                          </ul>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                              <strong>Relationship Owner:</strong> Sarah Martinez (our team)
                            </div>
                            <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors font-medium">
                              Schedule Meeting
                            </button>
                          </div>
                        </motion.div>

                        {/* Member 2 - Swing Vote */}
                        <motion.div 
                          className="p-4 rounded-lg bg-yellow-50 border-2 border-yellow-300"
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-lg"
                                initial={prefersReducedMotion ? {} : { scale: 0 }}
                                animate={prefersReducedMotion ? {} : { scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 200 }}
                              >
                                JR
                              </motion.div>
                              <div>
                                <div className="font-semibold text-gray-900">Rep. James Rodriguez (D-22)</div>
                                <div className="text-sm text-gray-600">Member • Tucson</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-yellow-600">
                                <AnimatedNumber value={54} />%
                              </div>
                              <div className="text-xs text-yellow-700 font-medium">Swing Vote</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mb-2"><strong>Revere Analysis:</strong></div>
                          <ul className="space-y-1 text-sm text-gray-700 mb-3">
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-600">•</span>
                              <span>District hospital is major employer (500+ jobs) - economic concerns</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600">•</span>
                              <span>Generally pro-consumer, voted YES on 2/3 similar bills</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-600">•</span>
                              <span>No public position yet, awaiting stakeholder meetings</span>
                            </li>
                          </ul>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                              <strong>Relationship Owner:</strong> None assigned
                            </div>
                            <button className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors font-medium">
                              Assign & Engage
                            </button>
                          </div>
                        </motion.div>

                        {/* Member 3 - Oppose */}
                        <motion.div 
                          className="p-4 rounded-lg bg-red-50 border-2 border-red-300"
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.6 }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <motion.div 
                                className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg"
                                initial={prefersReducedMotion ? {} : { scale: 0 }}
                                animate={prefersReducedMotion ? {} : { scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.7, type: "spring", stiffness: 200 }}
                              >
                                MJ
                              </motion.div>
                              <div>
                                <div className="font-semibold text-gray-900">Rep. Michael Johnson (R-8)</div>
                                <div className="text-sm text-gray-600">Ranking Member • Scottsdale</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-red-600">
                                <AnimatedNumber value={18} />%
                              </div>
                              <div className="text-xs text-red-700 font-medium">Oppose Likely</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 mb-2"><strong>Revere Analysis:</strong></div>
                          <ul className="space-y-1 text-sm text-gray-700 mb-3">
                            <li className="flex items-start gap-2">
                              <span className="text-red-600">•</span>
                              <span>Top campaign contributor: State Hospital Association ($15K in 2024)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600">•</span>
                              <span>Voted NO on all healthcare regulation bills this session (5/5)</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-red-600">•</span>
                              <span>Public statement opposing "burdensome mandates" (Dec 15)</span>
                            </li>
                          </ul>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">
                              <strong>Strategy:</strong> Focus on win-gettable votes instead
                            </div>
                            <button className="px-3 py-1 bg-gray-300 text-gray-600 text-xs rounded-lg cursor-not-allowed" disabled>
                              Hard No
                            </button>
                          </div>
                        </motion.div>

                        {/* Predicted Vote Count */}
                        <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Predicted Committee Vote</div>
                              <div className="text-3xl font-bold text-gray-900">5 - 2</div>
                              <div className="text-sm text-gray-600">Passage likely (need 4 votes)</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-700 mb-1">Vote Breakdown:</div>
                              <div className="text-sm space-y-1">
                                <div className="text-green-700"><strong>3</strong> Confirmed Yes</div>
                                <div className="text-green-600"><strong>2</strong> Likely Yes</div>
                                <div className="text-yellow-600"><strong>1</strong> Undecided</div>
                                <div className="text-red-600"><strong>1</strong> Likely No</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Stakeholder Groups */}
                  <div className="space-y-6">
                    {/* Supporting Organizations */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Supporting Organizations</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="font-medium text-green-900 mb-1">Consumer Health Coalition</div>
                          <div className="text-xs text-gray-600 mb-2">Lead supporter • Testified in favor</div>
                          <div className="text-xs text-gray-700">Contact: Maria Lopez</div>
                          <div className="text-xs text-blue-600">mlopez@chc.org</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="font-medium text-green-900 mb-1">Small Business Association</div>
                          <div className="text-xs text-gray-600 mb-2">Supporting • Letter on file</div>
                          <div className="text-xs text-gray-700">Contact: Tom Wright</div>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <div className="font-medium text-green-900 mb-1">Insurance Reform Network</div>
                          <div className="text-xs text-gray-600">Monitoring • Likely support</div>
                        </div>
                      </div>
                    </div>

                    {/* Opposing Organizations */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Opposing Organizations</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="font-medium text-red-900 mb-1">State Hospital Association</div>
                          <div className="text-xs text-gray-600 mb-2">Lead opponent • Heavy lobbying</div>
                          <div className="text-xs text-gray-700">Contact: Dr. Amanda Foster</div>
                          <div className="text-xs text-red-600">Seeking killer amendment</div>
                        </div>
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                          <div className="font-medium text-red-900 mb-1">Medical Provider Alliance</div>
                          <div className="text-xs text-gray-600 mb-2">Opposing • Cost concerns</div>
                          <div className="text-xs text-gray-700">Contact: Sarah Kim, MD</div>
                        </div>
                      </div>
                    </div>

                    {/* Media Mentions */}
                    <div className="p-5 rounded-xl bg-white border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Recent Media Coverage</h4>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                          <div className="text-xs text-gray-500 mb-1">Arizona Republic • Dec 18</div>
                          <div className="text-sm font-medium text-gray-900 mb-1">"Transparency Bill Advances"</div>
                          <div className="text-xs text-gray-700">Positive coverage, quotes sponsor</div>
                        </div>
                        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                          <div className="text-xs text-gray-500 mb-1">Capitol Times • Dec 16</div>
                          <div className="text-sm font-medium text-gray-900 mb-1">"Hospitals Push Back on Cost Mandates"</div>
                          <div className="text-xs text-gray-700">Neutral, covers both sides</div>
                        </div>
                      </div>
                    </div>

                    {/* Engagement Score */}
                    <motion.div 
                      className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200"
                      initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                      animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                    >
                      <div className="text-sm text-gray-700 mb-2">Engagement Score</div>
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        <AnimatedNumber value={73} />/100
                      </div>
                      <div className="text-xs text-gray-600 mb-3">Active advocacy environment</div>
                      <motion.div 
                        className="space-y-1 text-xs text-gray-700"
                        initial={prefersReducedMotion ? {} : { opacity: 0 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1 }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                      >
                        <div>• <AnimatedNumber value={8} /> stakeholder groups engaged</div>
                        <div>• <AnimatedNumber value={12} /> media mentions (last 7 days)</div>
                        <div>• <AnimatedNumber value={6} /> committee meetings held</div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Know exactly who supports, opposes, or is undecided—before you engage. Revere analyzes voting records, campaign finance, district demographics, and public statements to predict each member's position, then tracks your team's relationships and suggests optimal engagement strategy.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-center text-2xl font-semibold text-gray-900 mb-12">
            Why teams choose Bill Tracker
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{capability.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
