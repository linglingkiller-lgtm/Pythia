import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, AlertTriangle, CheckCircle, Brain, TrendingUp, Clock, Award, Target, Calendar, BarChart3, Sparkles, Shield, Zap, Activity, Heart, Battery, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

const TEAM_MEMBERS = [
  { 
    name: 'Sarah Chen', 
    role: 'Lobbyist', 
    workload: 85, 
    tasks: 12, 
    overdue: 2,
    burnoutRisk: 'medium',
    hoursWeek: 48,
    weekendWork: 3,
    responseTime: '2.3h',
    satisfaction: 7.2,
    productivity: 92
  },
  { 
    name: 'Marcus Johnson', 
    role: 'Public Affairs', 
    workload: 92, 
    tasks: 15, 
    overdue: 1,
    burnoutRisk: 'high',
    hoursWeek: 54,
    weekendWork: 5,
    responseTime: '4.1h',
    satisfaction: 6.1,
    productivity: 88
  },
  { 
    name: 'Emma Rodriguez', 
    role: 'Campaign Manager', 
    workload: 78, 
    tasks: 10, 
    overdue: 0,
    burnoutRisk: 'low',
    hoursWeek: 42,
    weekendWork: 1,
    responseTime: '1.8h',
    satisfaction: 8.4,
    productivity: 94
  },
  { 
    name: 'David Park', 
    role: 'Policy Analyst', 
    workload: 65, 
    tasks: 8, 
    overdue: 0,
    burnoutRisk: 'low',
    hoursWeek: 38,
    weekendWork: 0,
    responseTime: '1.5h',
    satisfaction: 8.8,
    productivity: 91
  },
];

const capabilities = [
  {
    title: 'Burnout Risk Detection',
    description: 'AI monitors hours, weekend work, and response patterns to flag team health issues',
  },
  {
    title: 'Intelligent Workload Balancing',
    description: 'Auto-suggests task reassignments based on capacity, skills, and current load',
  },
  {
    title: 'Performance Analytics',
    description: 'Track productivity, satisfaction, and output quality with trend analysis',
  },
  {
    title: 'Skills & Capacity Mapping',
    description: 'Match tasks to team members based on expertise and availability',
  },
  {
    title: 'Manager & Team Views',
    description: 'Role-specific dashboards - executives see strategy, members see their work',
  },
  {
    title: 'Revere Weekly Planning',
    description: 'AI analyzes team capacity and priorities to create optimal weekly plans',
  },
];

export function TeamMoment() {
  const [activeView, setActiveView] = useState<'workload' | 'burnout' | 'performance' | 'ai-insights'>('workload');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="team" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-amber-50/30 to-transparent pointer-events-none" />
      
      {/* Flowing background gradients - Green/Blue */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-green-100/60 via-emerald-50/40 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-blue-100/60 via-cyan-50/40 to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-3/4 h-3/4 bg-gradient-to-bl from-green-50/40 via-teal-50/30 to-blue-50/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-50/20 to-orange-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6">
            <Users className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Team Management</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Team Intelligence.
            <br />
            From Workload to Wellbeing.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time workload tracking, burnout risk detection, performance analytics, and AI-powered team optimization—all designed to keep your team healthy, aligned, and productive.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="flex items-center justify-center gap-2 mb-12 flex-wrap"
        >
          <button
            onClick={() => setActiveView('workload')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'workload'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 border border-gray-200'
            }`}
          >
            <Target className="w-4 h-4 inline mr-2" />
            Workload Tracking
          </button>
          <button
            onClick={() => setActiveView('burnout')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'burnout'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 border border-gray-200'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Burnout Risk
          </button>
          <button
            onClick={() => setActiveView('performance')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'performance'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 border border-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Performance Analytics
          </button>
          <button
            onClick={() => setActiveView('ai-insights')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'ai-insights'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-green-300 hover:bg-green-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Revere Insights
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'workload' && <WorkloadView key="workload" />}
          {activeView === 'burnout' && <BurnoutView key="burnout" />}
          {activeView === 'performance' && <PerformanceView key="performance" />}
          {activeView === 'ai-insights' && <AIInsightsView key="ai-insights" />}
        </AnimatePresence>

        {/* Capabilities Grid */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Complete Team Management System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <motion.div
                key={capability.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  hoveredCard === index
                    ? 'bg-gradient-to-br from-green-50 to-blue-50 border-green-300 shadow-xl scale-105'
                    : 'bg-white border-gray-200 shadow-sm'
                }`}
              >
                <CheckCircle className={`w-6 h-6 mb-3 transition-colors ${hoveredCard === index ? 'text-green-600' : 'text-gray-400'}`} />
                <h4 className="font-semibold text-gray-900 mb-2">{capability.title}</h4>
                <p className="text-sm text-gray-600">{capability.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-12"
        >
          <Button variant="secondary" size="sm">
            See an example
          </Button>
          <Button variant="secondary" size="sm">
            Learn more
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Workload Tracking View
function WorkloadView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-green-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Revere doesn't just assign tasks. It balances workload intelligently.
            </h3>
            <p className="text-base text-gray-700">
              Real-time capacity tracking shows who's overloaded, who has bandwidth, and who needs support.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Real-Time Workload Distribution</h3>
            <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
              Live
            </div>
          </div>
          
          <div className="space-y-4">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                className="p-4 rounded-xl bg-white border border-gray-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-blue-200 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">{member.tasks} active tasks</div>
                    {member.overdue > 0 && (
                      <div className="text-sm text-red-600 flex items-center gap-1 justify-end">
                        <AlertTriangle className="w-3 h-3" />
                        {member.overdue} overdue
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Workload bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={prefersReducedMotion ? { width: `${member.workload}%` } : { width: 0 }}
                      animate={{ width: `${member.workload}%` }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 + index * 0.1 }}
                      className={`h-full ${
                        member.workload >= 90 ? 'bg-red-500' :
                        member.workload >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>
                  <div className={`text-sm font-semibold min-w-[45px] text-right ${
                    member.workload >= 90 ? 'text-red-600' :
                    member.workload >= 75 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {member.workload}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Auto-rebalancing suggestion */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Smart Workload Rebalancing Available</h4>
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <div>• Reassign 3 overdue tasks from Marcus to David (27h capacity available)</div>
                <div>• Move HB 247 brief prep to Emma (policy expertise + availability)</div>
                <div>• Shift 2 research tasks from Sarah to David (matching skill set)</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                Review & Apply Suggestions
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Workload Tracking Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Real-time workload distribution shows exactly who has capacity and who's overloaded. Track tasks, hours, and deadlines across your entire team with visual progress bars, overdue indicators, and Revere's smart rebalancing suggestions that match skills to assignments automatically.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Burnout Risk View
function BurnoutView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-green-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Revere doesn't wait for burnout. It predicts it.
            </h3>
            <p className="text-base text-gray-700">
              AI monitors hours, weekend work, response patterns, and satisfaction signals to flag risk early.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Burnout Risk Detection</h3>
          <p className="text-sm text-gray-600">Revere analyzes work patterns, hours, and behavior to flag team health concerns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className={`p-5 rounded-2xl border-2 ${
                member.burnoutRisk === 'high' 
                  ? 'bg-red-50 border-red-300' 
                  : member.burnoutRisk === 'medium'
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    member.burnoutRisk === 'high' 
                      ? 'bg-red-200' 
                      : member.burnoutRisk === 'medium'
                      ? 'bg-yellow-200'
                      : 'bg-green-200'
                  }`}>
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1, 1.2, 1],
                      }}
                      transition={{ 
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                    >
                      <Heart className={`w-5 h-5 ${
                        member.burnoutRisk === 'high' 
                          ? 'text-red-700' 
                          : member.burnoutRisk === 'medium'
                          ? 'text-yellow-700'
                          : 'text-green-700'
                      }`} />
                    </motion.div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  member.burnoutRisk === 'high' 
                    ? 'bg-red-200 text-red-800' 
                    : member.burnoutRisk === 'medium'
                    ? 'bg-yellow-200 text-yellow-800'
                    : 'bg-green-200 text-green-800'
                }`}>
                  {member.burnoutRisk.toUpperCase()} RISK
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Weekly Hours
                  </span>
                  <span className={`font-semibold ${member.hoursWeek > 50 ? 'text-red-700' : 'text-gray-900'}`}>
                    {member.hoursWeek}h
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Weekend Work Days
                  </span>
                  <span className={`font-semibold ${member.weekendWork > 2 ? 'text-red-700' : 'text-gray-900'}`}>
                    {member.weekendWork} days
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Avg Response Time
                  </span>
                  <span className="font-semibold text-gray-900">{member.responseTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Battery className="w-4 h-4" />
                    Satisfaction Score
                  </span>
                  <span className={`font-semibold ${member.satisfaction < 7 ? 'text-red-700' : 'text-gray-900'}`}>
                    {member.satisfaction}/10
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Critical alert for Marcus */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ High Burnout Risk: Marcus Johnson</h4>
              <div className="text-sm text-gray-700 mb-4">
                <strong>Revere Detection:</strong> 54 hours/week, 5 weekend days logged in past 2 weeks, declining satisfaction score, and increasing response times. Suggest immediate intervention.
              </div>
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <div><strong>Recommended Actions:</strong></div>
                <div>• Schedule 1:1 check-in within 48 hours</div>
                <div>• Redistribute 30% of current workload to David and Emma</div>
                <div>• Block calendar for mandatory time off this weekend</div>
                <div>• Review project scope with client for deadline extension</div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white border border-red-300 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                Take Action Now
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Burnout Risk Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          AI burnout detection analyzes work patterns, hours logged, weekend activity, satisfaction scores, and response times to flag team health concerns before they become critical. Color-coded risk levels (Low/Medium/High) with specific intervention recommendations help managers act proactively to protect team wellbeing.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Performance Analytics View
function PerformanceView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-green-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Revere doesn't just measure performance. It drives improvement.
            </h3>
            <p className="text-base text-gray-700">
              Track productivity, satisfaction, and output quality with trend analysis and skill-based insights.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Performance Dashboard</h3>
          <p className="text-sm text-gray-600">Track productivity, quality, and output trends over time</p>
        </div>

        {/* Team Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">AVG PRODUCTIVITY</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">91.3%</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +3.2% this month
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-700">ON-TIME DELIVERY</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">94%</div>
            <div className="text-xs text-gray-600 mt-1">
              47 of 50 deliverables
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">AVG SATISFACTION</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">7.6/10</div>
            <div className="text-xs text-gray-600 mt-1">
              Team morale score
            </div>
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-medium text-orange-700">AVG RESPONSE TIME</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">2.4h</div>
            <div className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              12% faster
            </div>
          </motion.div>
        </div>

        {/* Individual Performance Cards */}
        <div className="space-y-4">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.name}
              initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.5 + index * 0.1 }}
              className="p-5 rounded-xl bg-white border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="text-xs text-gray-500">{member.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-600">Productivity</div>
                  <div className="text-2xl font-bold text-gray-900">{member.productivity}%</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Tasks Completed</div>
                  <div className="text-lg font-semibold text-gray-900">{member.tasks + 28}</div>
                  <div className="text-xs text-gray-500">this quarter</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Avg Quality Score</div>
                  <div className="text-lg font-semibold text-gray-900">4.{Math.floor(member.productivity / 10)}/5</div>
                  <div className="text-xs text-gray-500">client ratings</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Response Time</div>
                  <div className="text-lg font-semibold text-gray-900">{member.responseTime}</div>
                  <div className="text-xs text-gray-500">average</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Manager View Toggle */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
          className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200"
        >
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <Eye className="w-4 h-4" />
            <span><strong>Manager View Available:</strong> Toggle to see quarterly reviews, promotion readiness, skill gaps, and performance improvement plans</span>
          </div>
        </motion.div>
      </div>

      {/* Performance Analytics Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Comprehensive performance tracking shows productivity metrics, satisfaction scores, tasks completed, quality ratings, and response times for every team member. Compare individuals, identify top performers, spot trends over time, and access detailed manager views with promotion readiness and skill gap analysis.
        </p>
      </motion.div>
    </motion.div>
  );
}

// AI Insights View
function AIInsightsView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl">
        {/* Header Section with Taglines */}
        <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-green-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <h3 className="text-2xl font-bold text-gray-900">
              Revere doesn't just report on your team. It plans your week.
            </h3>
            <p className="text-base text-gray-700">
              AI-powered recommendations for hiring, workload shifts, skill development, and strategic planning.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Revere Team Intelligence</h3>
          <p className="text-sm text-gray-600">AI-powered insights, predictions, and recommendations for optimal team performance</p>
        </div>

        {/* Weekly Planning Insight */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Revere Weekly Plan Generated</h4>
              <div className="text-sm text-gray-700 mb-4">
                Based on team capacity, client priorities, and upcoming deadlines, Revere has created an optimized weekly plan:
              </div>
              <div className="text-sm text-gray-700 mb-4 space-y-2">
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <strong>Monday-Tuesday:</strong> Focus team on HB 247 analysis (high client priority)
                  <div className="text-xs text-gray-600 mt-1">Assign: Sarah (lead), David (research), Emma (stakeholder mapping)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <strong>Wednesday:</strong> Campaign strategy session for District 12 race
                  <div className="text-xs text-gray-600 mt-1">Emma leads, Marcus supports (public affairs angle)</div>
                </div>
                <div className="p-3 bg-white rounded-lg border border-purple-200">
                  <strong>Thursday-Friday:</strong> Client deliverables sprint + weekly reports
                  <div className="text-xs text-gray-600 mt-1">All hands - staggered schedules to prevent overtime</div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                Apply Weekly Plan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Skills Gap Analysis */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Skills & Capacity Mapping</h4>
              <div className="text-sm text-gray-700 mb-4">
                Revere has identified skill gaps and capacity opportunities based on logged work and project needs:
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span><strong>Healthcare Policy Expertise:</strong> High demand, limited capacity</span>
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded font-medium">GAP</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span><strong>Campaign Field Ops:</strong> Emma is only expert, creates bottleneck</span>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded font-medium">RISK</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span><strong>Legislative Research:</strong> David underutilized, can take 40% more</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-medium">OPPORTUNITY</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-600 bg-white p-3 rounded-lg border border-blue-200">
                <strong>Revere Recommendation:</strong> Consider hiring a healthcare policy specialist or cross-training Sarah. Assign 2-3 field ops tasks to Marcus for skill development.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Predictive Insights */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">Predictive Team Insights</h4>
              <div className="text-sm text-gray-700 mb-4">
                Revere forecasts team performance and identifies potential issues before they happen:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="text-xs text-green-700 font-bold mb-2">CAPACITY FORECAST</div>
                  <div className="text-sm text-gray-700 mb-2">
                    Team will hit 98% capacity by March 15th based on current project pipeline
                  </div>
                  <div className="text-xs text-gray-600">
                    ⚠️ Start hiring process now or defer non-urgent projects
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="text-xs text-green-700 font-bold mb-2">RETENTION RISK</div>
                  <div className="text-sm text-gray-700 mb-2">
                    Marcus shows 68% retention risk based on workload, satisfaction, burnout signals
                  </div>
                  <div className="text-xs text-gray-600">
                    ⚠️ Schedule check-in, offer flexibility, review compensation
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="text-xs text-green-700 font-bold mb-2">DEADLINE RISK</div>
                  <div className="text-sm text-gray-700 mb-2">
                    3 client deliverables at risk of missing deadlines (March 20, 22, 25)
                  </div>
                  <div className="text-xs text-gray-600">
                    ⚠️ Reallocate tasks or negotiate extensions this week
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <div className="text-xs text-green-700 font-bold mb-2">GROWTH OPPORTUNITY</div>
                  <div className="text-sm text-gray-700 mb-2">
                    David ready for senior analyst promotion based on performance trends
                  </div>
                  <div className="text-xs text-gray-600">
                    ✅ Consider for Q2 promotion cycle, assign leadership opportunities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Insights Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Revere's AI engine analyzes your entire team's capacity, projects, and deadlines to generate weekly planning recommendations, identify skill gaps, predict capacity crunches, flag retention risks, and spot promotion opportunities—all automatically based on real work patterns and performance data.
        </p>
      </motion.div>
    </motion.div>
  );
}