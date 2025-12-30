import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'motion/react';
import { Target, Sparkles, LayoutGrid, FolderKanban, Calendar, DollarSign, MapPin, Users, TrendingUp, AlertTriangle, Clock, CheckCircle2, Plus, ChevronRight, Play, Zap, ChevronDown, FileText, Check } from 'lucide-react';
import { Button } from '../ui/Button';

// Number count-up animation component
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => 
    decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toLocaleString()
  );
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

    return controls.stop;
  }, [value, decimals, motionValue]);

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
}

const capabilities = [
  {
    title: 'End-to-End Campaign Ops',
    description: 'Manage proposals, budgets, hiring, field ops, and performance in one place',
  },
  {
    title: 'Revere Weekly Planning',
    description: 'AI analyzes your portfolio and tells you exactly what to prioritize',
  },
  {
    title: 'Real-Time Budget Tracking',
    description: 'See budgeted vs. actual for every expense category, prevent overruns',
  },
  {
    title: 'Event Intelligence',
    description: 'Never miss high-value strategic events with Revere scoring',
  },
  {
    title: 'Multi-Project Visibility',
    description: 'See all campaigns, all states, all clients in one unified view',
  },
  {
    title: 'Template-Driven Speed',
    description: 'Launch new campaigns 10x faster with proven templates',
  },
];

export function WarRoomMoment() {
  const [activeView, setActiveView] = useState<'overview' | 'projects' | 'events' | 'budget'>('overview');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="war-room" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-50/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-blue-50/30 to-transparent pointer-events-none" />
      
      {/* Flowing background gradients - Red/White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-red-100/70 via-red-50/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-red-50/40 via-white to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-3/4 h-3/4 bg-gradient-to-br from-red-50/50 via-transparent to-red-100/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-red-50/20 to-blue-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-blue-100 rounded-full mb-6">
            <Target className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Campaign Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            The War Room.
            <br />
            Campaign Operations Command Center.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            End-to-end campaign management with AI-powered weekly planning, real-time budget tracking, project pipelines, field event intelligence, and multi-project visibility across all states and clients.
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
            onClick={() => setActiveView('overview')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'overview'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'projects'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <FolderKanban className="w-4 h-4 inline mr-2" />
            Projects
          </button>
          <button
            onClick={() => setActiveView('events')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'events'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Field & Events
          </button>
          <button
            onClick={() => setActiveView('budget')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'budget'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-red-300 hover:bg-red-50 border border-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget Builder
          </button>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Overview Layout */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-orange-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just run campaigns. It orchestrates victories.
                    </h3>
                    <p className="text-base text-gray-700">
                      Every target, every event, every dollar—mapped in real-time across all your competitive races.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {/* Left 2/3: Competitive Targets */}
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Competitive Targets</h3>
                        <p className="text-sm text-gray-600">Visual map of all active campaign projects</p>
                      </div>
                    </div>

                    {/* Mock target cards in a grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md font-medium">
                            House District 12
                          </div>
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                            On Track
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">NJ-12 Canvassing</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <MapPin className="w-3 h-3" />
                          <span>15,000 doors</span>
                          <span>•</span>
                          <span>68% complete</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }} />
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium">
                            Senate District 8
                          </div>
                          <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md font-medium">
                            At Risk
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">VA-8 Phone Bank</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <Users className="w-3 h-3" />
                          <span>8,500 calls</span>
                          <span>•</span>
                          <span>42% complete</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-red-600 rounded-full" style={{ width: '42%' }} />
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                            House District 45
                          </div>
                          <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md font-medium">
                            Launch
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">PA-45 GOTV</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>March 31 goal</span>
                          <span>•</span>
                          <span>22% complete</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-600 rounded-full" style={{ width: '22%' }} />
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md font-medium">
                            Multi-District
                          </div>
                          <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                            On Track
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-900 mb-2">GA Voter Reg</div>
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                          <Users className="w-3 h-3" />
                          <span>3,200 registrations</span>
                          <span>•</span>
                          <span>81% complete</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-600 rounded-full" style={{ width: '81%' }} />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right 1/3: This Week's Plan */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">This Week's Plan</h3>
                      </div>
                      <p className="text-xs text-gray-600 mb-4">Revere-generated priorities for the week ahead</p>
                      
                      <div className="space-y-3">
                        {/* Win-Now Actions */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-3 h-3 text-red-600" />
                            <span className="text-xs font-semibold text-gray-900">Win-Now Actions</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-700 mb-2">Add 2 canvassers to NJ-12 to maintain pace</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">critical</span>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Add tasks
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Hiring & Recruitment */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-semibold text-gray-900">Hiring & Recruitment</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-700 mb-2">Interview 5 field director candidates this week</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full">high</span>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Add tasks
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Field Schedule */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-900">Field Schedule</span>
                          </div>
                          <div className="bg-white rounded-lg p-3 border border-gray-200">
                            <p className="text-xs text-gray-700 mb-2">Coordinate 3 weekend GOTV events in PA</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">medium</span>
                              <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                Add tasks
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Staffing Coverage */}
                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Staffing Coverage</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700">
                            BB
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">Ben Blaser</div>
                            <div className="text-xs text-gray-600">3 active projects</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-medium text-green-700">
                            JH
                          </div>
                          <div className="flex-1">
                            <div className="text-xs font-medium text-gray-900">Jordan Hayes</div>
                            <div className="text-xs text-gray-600">2 active projects</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  The Overview tab is your weekly command center. See all active campaigns on a visual map, review Revere-generated priorities across Win-Now Actions, Hiring, and Field Schedule, and monitor team workload—all in one view.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'projects' && (
            <motion.div
              key="projects"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Projects Kanban */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-orange-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just manage projects. It moves them forward.
                    </h3>
                    <p className="text-base text-gray-700">
                      7-stage Kanban pipeline from concept to completion. Every campaign gets the clarity it needs.
                    </p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Campaign Project Pipeline</h3>
                    <p className="text-sm text-gray-600">7-stage Kanban: Drafting → Proposal → Build → Launch → Review → Completed → On-Hold</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Board
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors">
                      List
                    </button>
                    <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-colors">
                      Timeline
                    </button>
                  </div>
                </div>

                {/* Kanban Columns */}
                <div className="grid grid-cols-4 gap-4">
                  {/* Proposal Column */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Proposal</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">2</span>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">MI-7 Door Program</h4>
                        <div className="text-xs text-gray-600 mb-3">Michigan Healthcare PAC</div>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                            SC
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-medium">
                            JH
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                          <Clock className="w-3 h-3" />
                          Proposal due Mar 15
                        </div>
                        <div className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md inline-block">
                          Door-to-Door
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Build Column */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Build</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">3</span>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">NJ-12 Canvassing</h4>
                        <div className="text-xs text-gray-600 mb-3">AmMaj • House District 12</div>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-xs font-medium">
                            BB
                          </div>
                        </div>
                        <div className="mb-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs">
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                            <span className="text-gray-500 line-through">Hire state director</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-700">Launch recruiting</span>
                          </div>
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Tasks</span>
                            <span>68%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '68%' }} />
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-white border-2 border-red-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <h4 className="text-sm font-semibold text-gray-900">VA-8 Phone Bank</h4>
                        </div>
                        <div className="text-xs text-gray-600 mb-3">TGA • Senate District 8</div>
                        <div className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-md inline-block mb-3">
                          Timeline Risk
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Budget</span>
                            <span>42%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-red-600 rounded-full" style={{ width: '42%' }} />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Launch Column */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Launch</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">1</span>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-white border border-gray-200 cursor-pointer"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">PA-45 GOTV</h4>
                        <div className="text-xs text-gray-600 mb-3">House District 45</div>
                        <div className="flex items-center gap-1 mb-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-medium">
                            AR
                          </div>
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-xs font-medium">
                            MK
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                          <Calendar className="w-3 h-3" />
                          Launch Mar 31
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Field Goals</span>
                            <span>22%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-600 rounded-full" style={{ width: '22%' }} />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Review Column */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Review</span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">1</span>
                    </div>
                    <div className="space-y-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="p-4 rounded-xl bg-white border border-green-200 cursor-pointer"
                      >
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">GA Voter Reg</h4>
                        <div className="text-xs text-gray-600 mb-3">Multi-District</div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md inline-block mb-3">
                          On Track
                        </div>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Complete</span>
                            <span>81%</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-600 rounded-full" style={{ width: '81%' }} />
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projects Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Manage every campaign from proposal to completion. Track project cards through a 7-stage pipeline with team assignments, deadline tracking, progress bars, risk indicators, and 4 view modes (Board, List, Timeline, Workload).
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'events' && (
            <motion.div
              key="events"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Event Radar */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-orange-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just list events. It ranks opportunities.
                    </h3>
                    <p className="text-base text-gray-700">
                      Strategic event radar scores every opportunity by influence, access, and timing.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-1">Event Radar</h3>
                  <p className="text-sm text-gray-600">Strategic events ranked by Revere relevance and influence</p>
                </div>

                <div className="space-y-4">
                  {/* High-value event */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl bg-white border-2 border-red-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">State Democratic Convention</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Philadelphia Convention Center</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Mar 22, 2:00 PM</span>
                          </div>
                          <span>•</span>
                          <span className="capitalize">Convention</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-4">PA House District 45</div>

                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase">Revere Score</span>
                            <span className="text-2xl font-bold text-red-600">94</span>
                          </div>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs rounded-full border border-red-200 font-medium">
                            High Relevance
                          </span>
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">2,800</span> expected attendance
                          </div>
                        </div>

                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-semibold text-blue-900 mb-1">Revere Recommendation</div>
                              <div className="text-sm text-blue-800">
                                Send 3 canvassers with branded materials. High concentration of target voters. Coordinate with PA-45 field director.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-md font-medium">
                          Materials Ready
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">3</span> staff assigned
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Medium-value event */}
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="p-5 rounded-xl bg-white border border-gray-200 cursor-pointer"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Town Hall on Healthcare</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Cherry Hill Community Center</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>Mar 18, 7:00 PM</span>
                          </div>
                          <span>•</span>
                          <span className="capitalize">Town Hall</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-4">NJ House District 12</div>

                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 uppercase">Revere Score</span>
                            <span className="text-2xl font-bold text-yellow-600">67</span>
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full border border-yellow-200 font-medium">
                            Medium Relevance
                          </span>
                          <div className="text-sm text-gray-600">
                            <span className="font-semibold">450</span> expected attendance
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-md font-medium">
                          Materials Pending
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold">1</span> staff assigned
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Field Schedule Performance */}
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                      <div className="text-sm text-gray-700 mb-1">This Week's Shifts</div>
                      <div className="text-3xl font-bold text-blue-900 mb-1">24</div>
                      <div className="text-xs text-gray-600">18 canvassers active</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                      <div className="text-sm text-gray-700 mb-1">Avg Doors/Hour</div>
                      <div className="text-3xl font-bold text-green-900 mb-1">22</div>
                      <div className="text-xs text-gray-600">+3% vs last week</div>
                    </div>
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                      <div className="text-sm text-gray-700 mb-1">Events Coverage</div>
                      <div className="text-3xl font-bold text-purple-900 mb-1">12/15</div>
                      <div className="text-xs text-gray-600">80% staffed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Events Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Never miss high-value strategic opportunities. Revere scores every event (0-100) based on relevance, expected attendance, and influence potential—then recommends staffing levels and materials prep automatically.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'budget' && (
            <motion.div
              key="budget"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Budget Builder */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-red-50/30 to-orange-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't just track budgets. It optimizes spending in real-time.
                    </h3>
                    <p className="text-base text-gray-700">
                      Interactive budget builder with live calculations, cost-per-metric breakdowns, and variance alerts.
                    </p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Interactive Budget Builder</h3>
                    <p className="text-sm text-gray-600">Real-time calculations with budgeted vs. actual tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                      <option>NJ-12 Canvassing</option>
                      <option>VA-8 Phone Bank</option>
                      <option>PA-45 GOTV</option>
                    </select>
                    <select className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg">
                      <option>Version 1</option>
                      <option>Version 2</option>
                    </select>
                    <div className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg font-medium">
                      In-Flight
                    </div>
                  </div>
                </div>

                {/* Timeline & Assumptions */}
                <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-900">Timeline & Assumptions</h4>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Timeframe</label>
                      <input type="number" defaultValue="3" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <span className="text-xs text-gray-500">months</span>
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Doors Goal</label>
                      <input type="number" defaultValue="65000" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Doors/Hour</label>
                      <input type="number" defaultValue="22" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 mb-1 block">Pay/Hour</label>
                      <input type="number" defaultValue="25" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg" />
                      <span className="text-xs text-gray-500">USD</span>
                    </div>
                  </div>
                </div>

                {/* Budget Categories */}
                <div className="space-y-3">
                  {/* Salaries */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Salaries</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Budgeted:</span>{' '}
                          <span className="font-semibold text-gray-900">$166,500</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Actual:</span>{' '}
                          <span className="font-semibold text-green-700">$111,000</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="flex-1">State Director</div>
                        <div className="w-24 text-right text-gray-600">$8,000/mo</div>
                        <div className="w-16 text-right text-gray-600">× 1</div>
                        <div className="w-24 text-right font-medium">$24,000</div>
                        <div className="w-24 text-right text-green-700">$16,000</div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="flex-1">Project Manager</div>
                        <div className="w-24 text-right text-gray-600">$6,500/mo</div>
                        <div className="w-16 text-right text-gray-600">× 2</div>
                        <div className="w-24 text-right font-medium">$39,000</div>
                        <div className="w-24 text-right text-green-700">$26,000</div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                        <div className="flex-1">Field Director</div>
                        <div className="w-24 text-right text-gray-600">$4,500/mo</div>
                        <div className="w-16 text-right text-gray-600">× 4</div>
                        <div className="w-24 text-right font-medium">$54,000</div>
                        <div className="w-24 text-right text-green-700">$36,000</div>
                      </div>
                    </div>
                  </div>

                  {/* Hourly Labor */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900">Hourly Labor (Canvassers)</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Budgeted:</span>{' '}
                          <span className="font-semibold text-gray-900">$120,000</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Actual:</span>{' '}
                          <span className="font-semibold text-yellow-700">$72,000</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Housing & Travel */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Housing & Travel</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Budgeted:</span>{' '}
                          <span className="font-semibold text-gray-900">$49,200</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Actual:</span>{' '}
                          <span className="font-semibold text-green-700">$32,800</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Recruiting & Retention */}
                  <div className="p-4 rounded-xl bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-900">Recruiting & Retention</h4>
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Budgeted:</span>{' '}
                          <span className="font-semibold text-gray-900">$14,500</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-600">Actual:</span>{' '}
                          <span className="font-semibold text-green-700">$11,500</span>
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <span>Indeed Ads</span>
                        <span className="font-medium">$4,200</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <span>Referral Bonuses</span>
                        <span className="font-medium">$2,400</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <span>Gas Cards</span>
                        <span className="font-medium">$3,100</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs">
                        <span>Background Checks</span>
                        <span className="font-medium">$1,800</span>
                      </div>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-900">Total Project Budget</h4>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Budgeted</div>
                          <div className="text-2xl font-bold text-gray-900">
                            <AnimatedNumber value={350200} prefix="$" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Actual</div>
                          <div className="text-2xl font-bold text-green-700">
                            <AnimatedNumber value={227300} prefix="$" />
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 mb-1">Remaining</div>
                          <div className="text-2xl font-bold text-blue-700">
                            <AnimatedNumber value={122900} prefix="$" />
                          </div>
                        </div>
                        <motion.div
                          initial={{ scale: 1 }}
                          animate={{ 
                            scale: [1, 1.1, 1],
                          }}
                          transition={{ 
                            duration: 0.5,
                            delay: 1.5,
                            ease: [0.34, 1.56, 0.64, 1]
                          }}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold"
                        >
                          65% spent
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto"
              >
                <p className="text-gray-600 leading-relaxed">
                  Build campaign budgets in minutes with real-time calculations. Track 6 expense categories (Salaries, Hourly Labor, Housing, Recruiting, Misc, Pricing), compare budgeted vs. actual for every line item, and prevent overruns before they happen.
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
            Why teams choose War Room
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-blue-500 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-white" />
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