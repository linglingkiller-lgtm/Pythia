import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutGrid, GripVertical, Plus, Edit3, Target, CheckSquare, Scale, Users, DollarSign, Bell, Newspaper, Flame, Calendar, FileText, Archive, Users2, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

const moduleTypes = [
  { icon: Target, title: 'War Room', category: 'Intelligence' },
  { icon: Scale, title: 'Bills Watchlist', category: 'Intelligence' },
  { icon: Users, title: 'Legislator Watchlist', category: 'Intelligence' },
  { icon: Flame, title: 'Issues Watchlist', category: 'Intelligence' },
  { icon: Calendar, title: 'Committee Calendar', category: 'Intelligence' },
  { icon: Newspaper, title: 'Media Monitor', category: 'Intelligence' },
  { icon: Bell, title: 'Notifications', category: 'Intelligence' },
  { icon: Target, title: 'Door Tracker', category: 'Campaign' },
  { icon: DollarSign, title: 'Budget Snapshot', category: 'Campaign' },
  { icon: CheckSquare, title: 'Tasks', category: 'Productivity' },
  { icon: FileText, title: 'Deliverables', category: 'Productivity' },
  { icon: Users, title: 'Legislator Touchpoints', category: 'Productivity' },
  { icon: Users2, title: 'Client Pulse', category: 'Client' },
  { icon: Users2, title: 'Stakeholder Map', category: 'Client' },
  { icon: Archive, title: 'Records & Compliance', category: 'Compliance' },
];

const benefits = [
  {
    title: 'Role-Specific Views',
    description: 'Executives see enterprise overview, specialists see their domain',
  },
  {
    title: 'Zero Noise',
    description: 'Only see what matters to you, eliminate irrelevant information',
  },
  {
    title: 'Real-Time Intelligence',
    description: 'All modules show live data with timestamps',
  },
  {
    title: 'Fast Decision-Making',
    description: 'Critical alerts and recommended actions at-a-glance',
  },
  {
    title: 'Cross-Department Visibility',
    description: 'Monitor lobbying, campaigns, and public affairs simultaneously',
  },
  {
    title: 'Personalized Workflow',
    description: 'Build your perfect command center, save it forever',
  },
];

export function DashboardMoment() {
  const [activeView, setActiveView] = useState<'grid' | 'modules' | 'customize'>('grid');
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const [animateNumbers, setAnimateNumbers] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="dashboard" className="py-32 px-6 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-50/30 to-transparent pointer-events-none" />
      
      {/* Animated background elements */}
      {/* Flowing background gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-blue-100/60 via-blue-50/40 to-transparent" />
        <div className="absolute top-1/3 right-1/4 w-3/4 h-3/4 bg-gradient-to-bl from-purple-50/50 via-transparent to-blue-50/50 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-blue-50/20 to-red-50/30 pointer-events-none" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Headline */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-6">
            <LayoutGrid className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Your Command Center</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            The Dashboard.
            <br />
            Fully yours. Fully modular.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A drag-and-drop command center that adapts to your role. Choose from 15 intelligent modules, arrange them however you want, and save your perfect workspace forever.
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
            onClick={() => setActiveView('grid')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'grid'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            Modular Grid
          </button>
          <button
            onClick={() => setActiveView('modules')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'modules'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            15 Module Types
          </button>
          <button
            onClick={() => setActiveView('customize')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'customize'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            Customization
          </button>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeView === 'grid' && (
            <motion.div
              key="grid"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Grid System Visual */}
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't lock you into templates. It gives you a canvas.
                    </h3>
                    <p className="text-base text-gray-700">
                      Drag-and-drop 12-column grid system with instant resizing, visual feedback, and permanent auto-save.
                    </p>
                  </div>
                </div>

                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Drag-and-Drop Grid System</h3>
                    <p className="text-sm text-gray-600">12-column responsive layout with auto-stacking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium">
                      Edit Mode
                    </div>
                  </div>
                </div>

                {/* Mock Grid */}
                <div className="grid grid-cols-12 gap-4">
                  {/* Large Module (Full Width) */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-12 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-blue-50 border border-gray-200 cursor-move group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        <Target className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">War Room (All)</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Large (12 cols)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-white/70 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Active Projects</div>
                        <div className="text-2xl font-bold text-gray-900">12</div>
                      </div>
                      <div className="p-3 bg-white/70 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">At Risk</div>
                        <div className="text-2xl font-bold text-red-600">3</div>
                      </div>
                      <div className="p-3 bg-white/70 rounded-lg">
                        <div className="text-xs text-gray-600 mb-1">Due This Week</div>
                        <div className="text-2xl font-bold text-blue-600">8</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Medium Module */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-6 p-6 rounded-2xl bg-white border border-gray-200 cursor-move group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        <CheckSquare className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">Tasks Due Soon</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Medium (6 cols)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded border-2 border-gray-300" />
                        <span className="text-sm text-gray-700">Review HB 247 amendments</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="w-4 h-4 rounded border-2 border-gray-300" />
                        <span className="text-sm text-gray-700">Schedule Rep. Martinez call</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Medium Module */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-6 p-6 rounded-2xl bg-white border border-gray-200 cursor-move group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        <Scale className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-gray-900">Bills Watchlist</span>
                      </div>
                      <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">Medium (6 cols)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">HB 247</div>
                        <div className="text-xs text-gray-600">Committee vote in 3 days</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <div className="text-sm font-medium text-gray-900">SB 89</div>
                        <div className="text-xs text-gray-600">Advanced to Senate floor</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Small Module Hint */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-dashed border-purple-300 cursor-move flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-xs text-purple-700 font-medium">Small (4 cols)</span>
                    </div>
                  </motion.div>

                  {/* Small Module Hint */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-dashed border-purple-300 cursor-move flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-xs text-purple-700 font-medium">Drag to reorder</span>
                    </div>
                  </motion.div>

                  {/* Small Module Hint */}
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    whileHover={{ scale: 1.02 }}
                    className="col-span-4 p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-white border-2 border-dashed border-purple-300 cursor-move flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Plus className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <span className="text-xs text-purple-700 font-medium">Auto-stacks</span>
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-purple-900 mb-1">Persistent Layouts</div>
                      <div className="text-sm text-purple-700">Your dashboard saves automatically. Every change is remembered across sessions.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid System Description */}
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-center max-w-3xl mx-auto mt-12"
              >
                <p className="text-gray-600 leading-relaxed">
                  Build your perfect command center with a drag-and-drop 12-column grid system. Resize modules to 4, 6, 8, or 12 columns wide, reorder with visual feedback, and save your layout permanently. Every change auto-saves to localStorage so your dashboard loads instantly every time.
                </p>
              </motion.div>
            </motion.div>
          )}

          {activeView === 'modules' && (
            <motion.div
              key="modules"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't show you everything. It shows you what matters.
                    </h3>
                    <p className="text-base text-gray-700">
                      15 purpose-built modules organized by Intelligence, Campaign, Productivity, Client, and Compliance categories.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Choose from 15 Intelligent Modules</h3>
                  <p className="text-sm text-gray-600">Each module is purpose-built for specific workflows and can be filtered by department, client, or time range</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {moduleTypes.map((module, index) => {
                    const Icon = module.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                        animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.03 }}
                        onMouseEnter={() => setHoveredModule(index)}
                        onMouseLeave={() => setHoveredModule(null)}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          hoveredModule === index
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                            hoveredModule === index ? 'bg-purple-600' : 'bg-gray-100'
                          }`}>
                            <Icon className={`w-5 h-5 ${hoveredModule === index ? 'text-white' : 'text-gray-600'}`} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900 text-sm">{module.title}</div>
                            <div className="text-xs text-gray-500">{module.category}</div>
                          </div>
                          {hoveredModule === index && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center"
                            >
                              <Check className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Module Types Description */}
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-center max-w-3xl mx-auto mt-12"
                >
                  <p className="text-gray-600 leading-relaxed">
                    Choose from 15 intelligence modules organized by category (Intelligence, Campaign, Productivity, Client, Compliance). Mix and match freely with custom titles, sizes, and filters. Add multiple instances of the same module type—like separate Bills modules for Healthcare and Energy—all with independent configurations.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeView === 'customize' && (
            <motion.div
              key="customize"
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12">
                {/* Header Section with Taglines */}
                <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
                  <div className="max-w-4xl mx-auto text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      Revere doesn't force one view for everyone. It adapts to each role.
                    </h3>
                    <p className="text-base text-gray-700">
                      Edit mode, smart filtering, role-based presets, and module duplication—all with one-click save.
                    </p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-2">Powerful Customization Controls</h3>
                  <p className="text-sm text-gray-600">Edit mode, smart filtering, role-based presets, and module management</p>
                </div>

                <div className="space-y-6">
                  {/* Edit Mode */}
                  <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Edit3 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Edit Mode</h4>
                        <p className="text-sm text-gray-700 mb-4">One-click toggle enables drag handles, repositioning, and module settings. Save when done, or cancel to revert.</p>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium shadow-sm">
                            Customize
                          </button>
                          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-medium">
                            Save Layout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Module Management */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Plus className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Add & Duplicate</h4>
                      <p className="text-sm text-gray-600">Browse 15 module types, configure custom titles, sizes, and filters. Clone existing modules with one click.</p>
                    </div>

                    <div className="p-6 bg-white border border-gray-200 rounded-2xl">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <Target className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">Smart Filtering</h4>
                      <p className="text-sm text-gray-600">Filter each module by department, client, topic, time range, or "show only mine" for personalized views.</p>
                    </div>
                  </div>

                  {/* Role Presets */}
                  <div className="p-6 bg-gradient-to-br from-red-50 to-blue-50 border border-gray-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <LayoutGrid className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">Role-Based Presets</h4>
                        <p className="text-sm text-gray-700 mb-4">Four pre-configured layouts optimized for different roles and workflows</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-xs font-medium text-gray-900">Executive</div>
                          </div>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-xs font-medium text-gray-900">Lobbying</div>
                          </div>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-xs font-medium text-gray-900">Campaign Services</div>
                          </div>
                          <div className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-center">
                            <div className="text-xs font-medium text-gray-900">Public Affairs</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Benefits Section */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              Built for how you actually work
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every feature designed to eliminate noise, accelerate decisions, and adapt to your unique workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                </div>
                <p className="text-sm text-gray-600 pl-9">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="flex items-center justify-center gap-4 mt-16"
        >
          <Button variant="secondary" size="sm">
            See it in action
          </Button>
          <Button variant="secondary" size="sm">
            Learn more
          </Button>
        </motion.div>
      </div>
    </section>
  );
}