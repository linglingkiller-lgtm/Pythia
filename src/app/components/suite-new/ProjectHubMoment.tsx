import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FolderKanban, LayoutGrid, Users, FileCheck, Briefcase, CheckCircle, Clock, AlertCircle, Calendar, Target, TrendingUp, Zap, Tag, User, FileText, Link as LinkIcon, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export function ProjectHubMoment() {
  const [activeView, setActiveView] = useState<'my-work' | 'client-work' | 'projects' | 'deliverables'>('my-work');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="projects" className="relative py-32 overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-cyan-50/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-purple-50/30 to-transparent pointer-events-none z-10" />
      
      {/* Flowing background gradients - Cyan/Teal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-cyan-100/70 via-cyan-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-teal-100/60 via-teal-50/40 to-transparent" />
        <div className="absolute top-1/3 right-1/3 w-2/3 h-2/3 bg-gradient-to-bl from-cyan-50/50 via-transparent to-teal-50/50 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-teal-50/20 to-purple-50/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full mb-6">
            <FolderKanban className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-900">PROJECT HUB</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Your Work, Organized.
            <br />
            Finally.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Four views, one system. Personal tasks, client projects, team deliverables, and work management—all synchronized in real-time.
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
            onClick={() => setActiveView('my-work')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'my-work'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50 border border-gray-200'
            }`}
          >
            <LayoutGrid className="w-4 h-4 inline mr-2" />
            My Work
          </button>
          <button
            onClick={() => setActiveView('client-work')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'client-work'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Client Work
          </button>
          <button
            onClick={() => setActiveView('projects')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'projects'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50 border border-gray-200'
            }`}
          >
            <FolderKanban className="w-4 h-4 inline mr-2" />
            Projects
          </button>
          <button
            onClick={() => setActiveView('deliverables')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'deliverables'
                ? 'bg-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-cyan-300 hover:bg-cyan-50 border border-gray-200'
            }`}
          >
            <FileCheck className="w-4 h-4 inline mr-2" />
            Deliverables
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'my-work' && <MyWorkView key="my-work" />}
          {activeView === 'client-work' && <ClientWorkView key="client-work" />}
          {activeView === 'projects' && <ProjectsView key="projects" />}
          {activeView === 'deliverables' && <DeliverablesView key="deliverables" />}
        </AnimatePresence>

        {/* Complete Project Management */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-center text-2xl font-semibold text-gray-900 mb-12">
            Why teams choose Project Hub
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Unified Work View',
                description: 'Personal tasks, client projects, deliverables, and team workflows—all in one centralized hub with smart prioritization.',
              },
              {
                icon: Users,
                title: 'Client-Centric Organization',
                description: 'See all work by client with health scores, deadlines, and team assignments—perfect for status updates and reporting.',
              },
              {
                icon: FolderKanban,
                title: 'Project Tracking',
                description: 'Kanban boards, Gantt charts, and timeline views with automatic progress tracking and milestone notifications.',
              },
              {
                icon: FileCheck,
                title: 'Deliverable Management',
                description: 'Track every client deliverable from draft to approval with version control, review workflows, and automatic archiving.',
              },
              {
                icon: Sparkles,
                title: 'Pythia Workload Intelligence',
                description: 'AI-powered capacity planning, deadline predictions, and smart task assignments based on team availability and expertise.',
              },
              {
                icon: CheckCircle,
                title: 'Integrated Workflows',
                description: 'Connect tasks to bills, legislators, clients, and issues—full context from every angle with synchronized updates.',
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
                  className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm hover:bg-gradient-to-br hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-300 hover:shadow-xl transition-all duration-300"
                >
                  <Icon className="w-6 h-6 mb-3 text-cyan-600" />
                  <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <div className="inline-block p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl border border-cyan-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Work Simplified</div>
                <div className="text-sm text-gray-600">Intelligent project and task management</div>
              </div>
            </div>
            <p className="text-gray-700 max-w-md">
              From personal to-dos to complex client projects, Project Hub keeps your team organized with AI-powered insights and automated workflows.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// My Work View
function MyWorkView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just list your tasks. It prioritizes them for you.
          </h3>
          <p className="text-base text-gray-700">
            Personal dashboard with smart sorting by priority, deadline, and workload—so you always know what's next.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Today's Priority Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Priorities</h3>
            <span className="text-sm text-gray-500">5 tasks</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Review HB 2847 amendments', client: 'TechGrid Alliance', priority: 'high', due: 'Today 2:00 PM', status: 'in-progress' },
              { title: 'Prepare talking points for Senate hearing', client: 'Healthcare Coalition', priority: 'high', due: 'Today 4:00 PM', status: 'not-started' },
              { title: 'Draft position statement on SB 1423', client: 'Education First', priority: 'medium', due: 'Tomorrow 9:00 AM', status: 'in-progress' },
              { title: 'Schedule stakeholder meeting', client: 'Energy Innovators', priority: 'low', due: 'Tomorrow 5:00 PM', status: 'not-started' },
              { title: 'Update client on bill progress', client: 'TechGrid Alliance', priority: 'medium', due: 'Friday 3:00 PM', status: 'not-started' },
            ].map((task, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-4 rounded-xl bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    task.status === 'in-progress' 
                      ? 'border-cyan-600 bg-cyan-50' 
                      : 'border-gray-300 group-hover:border-cyan-400'
                  }`}>
                    {task.status === 'in-progress' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-600" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {task.client}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.due}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        task.priority === 'high' ? 'bg-red-100 text-red-700' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {task.status === 'in-progress' ? (
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        Not Started
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-xs font-bold text-green-700">COMPLETED THIS WEEK</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600">+3 from last week</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="text-xs font-bold text-orange-700">DUE THIS WEEK</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-gray-600">5 high priority</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold text-purple-700">WORKLOAD</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">78%</div>
            <div className="text-sm text-gray-600">Optimal capacity</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Personal work dashboard displays all assigned tasks sorted by priority and deadline with real-time status tracking (Not Started, In Progress, Completed). Smart sorting considers urgency, workload percentage, and dependencies. View tasks by client, project, or deliverable with one-click filtering and weekly completion analytics.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Client Work View
function ClientWorkView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't scatter client work across folders. It organizes by relationship.
          </h3>
          <p className="text-base text-gray-700">
            Client-centric view aggregates all projects, deliverables, and tasks—so you see the full picture, instantly.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Client Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { 
              name: 'TechGrid Alliance',
              status: 'healthy',
              projects: 3,
              active: 8,
              upcoming: 4,
              budget: '$145K',
              health: 92
            },
            {
              name: 'Healthcare Coalition',
              status: 'at-risk',
              projects: 2,
              active: 12,
              upcoming: 2,
              budget: '$89K',
              health: 68
            },
            {
              name: 'Education First',
              status: 'healthy',
              projects: 4,
              active: 6,
              upcoming: 5,
              budget: '$210K',
              health: 88
            },
            {
              name: 'Energy Innovators',
              status: 'healthy',
              projects: 1,
              active: 3,
              upcoming: 1,
              budget: '$52K',
              health: 95
            },
          ].map((client, idx) => (
            <motion.div
              key={idx}
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group p-6 rounded-2xl bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-2">{client.name}</h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      client.status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
                    }`} />
                    <span className="text-sm text-gray-600">{client.health}% Health Score</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-cyan-600">{client.budget}</div>
                  <div className="text-xs text-gray-500">Portfolio Value</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{client.projects}</div>
                  <div className="text-xs text-gray-500">Projects</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{client.active}</div>
                  <div className="text-xs text-gray-500">Active Tasks</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{client.upcoming}</div>
                  <div className="text-xs text-gray-500">Upcoming</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Recent Activity</span>
                  <span className="text-cyan-600 font-semibold group-hover:text-cyan-700">View Details →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Client work view organizes all projects, active tasks, upcoming deliverables, and portfolio value by client relationship. Each client card displays health score, total projects, active workload, and budget allocation. Click any client to drill down into specific projects, team assignments, and deliverable timelines with full context.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Projects View
function ProjectsView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just track project status. It predicts bottlenecks.
          </h3>
          <p className="text-base text-gray-700">
            Kanban-style project management with AI-powered risk detection, workload balancing, and automated deadline tracking.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Project Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { stage: 'Planning', count: 3, color: 'blue' },
            { stage: 'In Progress', count: 8, color: 'cyan' },
            { stage: 'Review', count: 4, color: 'yellow' },
            { stage: 'Complete', count: 12, color: 'green' },
          ].map((column, idx) => (
            <div key={idx} className="flex flex-col">
              <div className={`p-3 rounded-t-xl bg-gradient-to-br ${
                column.color === 'blue' ? 'from-blue-500 to-blue-600' :
                column.color === 'cyan' ? 'from-cyan-500 to-cyan-600' :
                column.color === 'yellow' ? 'from-yellow-500 to-yellow-600' :
                'from-green-500 to-green-600'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white">{column.stage}</h4>
                  <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-semibold">
                    {column.count}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-b-xl p-3 border border-gray-200 border-t-0 min-h-[300px] space-y-2">
                {column.stage === 'In Progress' && (
                  <>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">HB 2847 Amendment Analysis</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">TechGrid Alliance</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Sarah M.</span>
                        </div>
                        <span className="text-xs text-orange-600 font-semibold">Due: 2 days</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">Coalition Building Strategy</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Healthcare Coalition</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Mike R.</span>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">Due: 5 days</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border-2 border-red-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                      <div className="flex items-center gap-1 mb-2">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <h5 className="font-semibold text-sm text-gray-900">Testimony Prep</h5>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Education First</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Lisa K.</span>
                        </div>
                        <span className="text-xs text-red-600 font-semibold">Overdue: 1 day</span>
                      </div>
                    </div>
                  </>
                )}

                {column.stage === 'Planning' && (
                  <>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">Q2 Advocacy Plan</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Energy Innovators</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Tom B.</span>
                        </div>
                        <span className="text-xs text-gray-600 font-semibold">Due: 10 days</span>
                      </div>
                    </div>
                  </>
                )}

                {column.stage === 'Review' && (
                  <>
                    <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-all">
                      <h5 className="font-semibold text-sm text-gray-900 mb-2">Position Brief Draft</h5>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">TechGrid Alliance</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Sarah M.</span>
                        </div>
                        <span className="text-xs text-yellow-600 font-semibold">Awaiting Review</span>
                      </div>
                    </div>
                  </>
                )}

                {column.stage === 'Complete' && (
                  <>
                    <div className="p-3 bg-white rounded-lg border border-green-200 shadow-sm cursor-pointer hover:shadow-md transition-all opacity-75">
                      <div className="flex items-center gap-1 mb-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <h5 className="font-semibold text-sm text-gray-900">Budget Report Q1</h5>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">Healthcare Coalition</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Mike R.</span>
                        </div>
                        <span className="text-xs text-green-600 font-semibold">✓ Completed</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Risk Alert */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h4 className="font-bold text-purple-900 mb-2">Pythia Risk Alert</h4>
              <p className="text-sm text-purple-800 leading-relaxed">
                <strong>3 projects need attention:</strong> "Testimony Prep" is overdue by 1 day and blocking 2 downstream tasks. "HB 2847 Amendment Analysis" has 2-day deadline with team member at 95% capacity. Recommend reassigning or extending timeline. "Coalition Building Strategy" missing 2 key stakeholder confirmations.
              </p>
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
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Kanban project board with four stages (Planning, In Progress, Review, Complete) displays all active projects with real-time status updates. Each project card shows client, assignee, deadline, and priority level. Pythia AI monitors workload, identifies bottlenecks, flags overdue items, and predicts delivery risks based on team capacity and dependencies.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Deliverables View
function DeliverablesView() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? {} : { opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 rounded-[28px] bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-2xl mb-12"
    >
      {/* Header Section with Taglines */}
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just remind you about deadlines. It shows what clients expect.
          </h3>
          <p className="text-base text-gray-700">
            Comprehensive deliverables tracker with version history, approval workflows, and client communication logs—all in one place.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Timeline View */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-200 via-cyan-300 to-cyan-200" />

          {/* Deliverable Items */}
          <div className="space-y-6">
            {[
              {
                title: 'Position Brief: HB 2847 Amendments',
                client: 'TechGrid Alliance',
                type: 'Document',
                status: 'In Review',
                due: 'Tomorrow',
                version: 'v3.2',
                urgent: true
              },
              {
                title: 'Weekly Progress Report',
                client: 'Healthcare Coalition',
                type: 'Report',
                status: 'Draft',
                due: 'Friday',
                version: 'v1.0',
                urgent: false
              },
              {
                title: 'Stakeholder Analysis Deck',
                client: 'Education First',
                type: 'Presentation',
                status: 'Pending Approval',
                due: 'Next Monday',
                version: 'v2.1',
                urgent: false
              },
              {
                title: 'Q2 Strategy Roadmap',
                client: 'Energy Innovators',
                type: 'Document',
                status: 'Not Started',
                due: 'Next Thursday',
                version: 'v1.0',
                urgent: false
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative flex items-start gap-6"
              >
                {/* Timeline Dot */}
                <div className={`relative z-10 w-16 h-16 rounded-full border-4 ${
                  item.urgent 
                    ? 'border-red-500 bg-red-50' 
                    : item.status === 'Pending Approval'
                    ? 'border-yellow-500 bg-yellow-50'
                    : item.status === 'In Review'
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-300 bg-gray-50'
                } flex items-center justify-center flex-shrink-0`}>
                  <FileCheck className={`w-7 h-7 ${
                    item.urgent ? 'text-red-600' :
                    item.status === 'Pending Approval' ? 'text-yellow-600' :
                    item.status === 'In Review' ? 'text-cyan-600' :
                    'text-gray-400'
                  }`} />
                </div>

                {/* Content Card */}
                <div className="flex-1 group p-5 rounded-2xl bg-white border border-gray-200 hover:border-cyan-300 hover:shadow-lg transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {item.urgent && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">
                            URGENT
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded">
                          {item.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.client}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold text-sm ${
                        item.urgent ? 'text-red-600' : 'text-gray-900'
                      }`}>
                        Due: {item.due}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{item.version}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === 'In Review' ? 'bg-cyan-100 text-cyan-700' :
                      item.status === 'Pending Approval' ? 'bg-yellow-100 text-yellow-700' :
                      item.status === 'Draft' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>

                    <div className="flex items-center gap-3">
                      <button className="text-xs text-gray-500 hover:text-cyan-600 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        3 Comments
                      </button>
                      <button className="text-xs text-gray-500 hover:text-cyan-600 flex items-center gap-1">
                        <LinkIcon className="w-3 h-3" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200">
            <div className="text-xs font-bold text-cyan-700 mb-1">THIS WEEK</div>
            <div className="text-3xl font-bold text-gray-900">7</div>
            <div className="text-sm text-gray-600">Due Soon</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="text-xs font-bold text-yellow-700 mb-1">PENDING</div>
            <div className="text-3xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-600">Awaiting Approval</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">COMPLETED</div>
            <div className="text-3xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">ON-TIME RATE</div>
            <div className="text-3xl font-bold text-gray-900">94%</div>
            <div className="text-sm text-gray-600">Last 30 Days</div>
          </div>
        </div>
      </div>

      {/* Description */}
      <motion.div
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto mt-12"
      >
        <p className="text-gray-600 leading-relaxed">
          Timeline-based deliverables tracker displays all client commitments with status (Not Started, Draft, In Review, Pending Approval, Complete), version history, due dates, and approval workflows. Each deliverable links to associated project, shows comment threads, and tracks client communication. Urgent items are flagged automatically based on deadline proximity and client priority level.
        </p>
      </motion.div>
    </motion.div>
  );
}