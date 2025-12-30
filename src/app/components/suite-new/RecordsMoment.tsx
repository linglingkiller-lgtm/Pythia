import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, Users, Shield, Sparkles, Clock, Download, Eye, Lock, CheckCircle, TrendingUp, Building2, Gavel, Hash, Calendar, Tag, Filter, Share2, UserCheck, FileCheck, BarChart3, AlertCircle, Folder, File, Image as ImageIcon, Video, MessageSquare, Phone } from 'lucide-react';
import { Button } from '../ui/Button';

export function RecordsMoment() {
  const [activeView, setActiveView] = useState<'smart-search' | 'collaboration' | 'auto-reports' | 'activity-logs'>('smart-search');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="records" className="relative py-32 overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-50/20 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-100/50 to-transparent pointer-events-none z-10" />
      
      {/* Flowing background gradients - Green/White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-green-100/70 via-emerald-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-green-50/40 via-white to-transparent" />
        <div className="absolute top-1/3 left-1/3 w-2/3 h-2/3 bg-gradient-to-br from-green-50/50 via-transparent to-emerald-50/40 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-100 to-green-100 rounded-full mb-6">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-900">RECORDS & REPORTING</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Every File. Every Action.
            <br />
            Instantly Accessible.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intelligent document vault with instant search, team collaboration, compliance tracking, and auto-generated client reports—so nothing ever gets lost.
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
            onClick={() => setActiveView('smart-search')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'smart-search'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50 border border-gray-200'
            }`}
          >
            <Search className="w-4 h-4 inline mr-2" />
            Smart Search
          </button>
          <button
            onClick={() => setActiveView('collaboration')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'collaboration'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50 border border-gray-200'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Team Collaboration
          </button>
          <button
            onClick={() => setActiveView('auto-reports')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'auto-reports'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Auto Reports
          </button>
          <button
            onClick={() => setActiveView('activity-logs')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'activity-logs'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-teal-300 hover:bg-teal-50 border border-gray-200'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Activity Logs
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'smart-search' && <SmartSearchView key="smart-search" />}
          {activeView === 'collaboration' && <CollaborationView key="collaboration" />}
          {activeView === 'auto-reports' && <AutoReportsView key="auto-reports" />}
          {activeView === 'activity-logs' && <ActivityLogsView key="activity-logs" />}
        </AnimatePresence>

        {/* Complete Records Platform */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-center text-2xl font-semibold text-gray-900 mb-12">
            Why teams choose Records
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: 'Instant File Discovery',
                description: '0.3-second search across 8,000+ documents with AI-powered context understanding and natural language queries.',
              },
              {
                icon: Users,
                title: 'Secure Collaboration',
                description: 'Granular permissions, version control, real-time editing, and comment threads with enterprise-grade security.',
              },
              {
                icon: Sparkles,
                title: 'Auto-Generated Reports',
                description: 'One-click client reports, compliance documents, and activity summaries—formatted and ready in seconds.',
              },
              {
                icon: Clock,
                title: 'Complete Activity Logs',
                description: 'Every action tracked automatically—meetings, calls, emails, documents—with billable hours and audit trails.',
              },
              {
                icon: Shield,
                title: 'Enterprise Compliance',
                description: 'SOC 2 Type II certified, 256-bit encryption, GDPR compliant with full audit logs for legal requirements.',
              },
              {
                icon: FileText,
                title: 'Universal Search',
                description: 'Search by keyword, client, bill, legislator, date, or type across all systems with instant relevance ranking.',
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
                  className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 hover:border-teal-300 hover:shadow-xl transition-all duration-300"
                >
                  <Icon className="w-6 h-6 mb-3 text-teal-600" />
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
          <div className="inline-block p-8 bg-gradient-to-br from-teal-50 to-green-50 rounded-3xl border border-teal-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Everything Documented</div>
                <div className="text-sm text-gray-600">Intelligent records and reporting</div>
              </div>
            </div>
            <p className="text-gray-700 max-w-md">
              From instant search to auto-generated reports, Records ensures nothing gets lost and every client deliverable is professional and complete.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Smart Search View
function SmartSearchView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/30 to-green-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't make you dig through folders. It finds what you need in seconds.
          </h3>
          <p className="text-base text-gray-700">
            AI-powered search across all documents, emails, notes, and files—filtered by client, bill, legislator, date, or keyword with instant results.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Interface */}
        <div className="relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-teal-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by keyword, client, bill, legislator, date, or document type..."
              className="w-full pl-14 pr-4 py-4 text-lg rounded-2xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 transition-all"
              defaultValue="HB 2847 TechGrid Alliance testimony"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold flex items-center gap-1 transition-all">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all">
                Search
              </button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-sm text-gray-500">Active filters:</span>
            {[
              { label: 'Client: TechGrid Alliance', color: 'blue' },
              { label: 'Bill: HB 2847', color: 'red' },
              { label: 'Date: Last 30 days', color: 'purple' },
            ].map((filter, idx) => (
              <span key={idx} className={`px-3 py-1 rounded-full text-xs font-semibold bg-${filter.color}-100 text-${filter.color}-700 flex items-center gap-1`}>
                {filter.label}
                <button className="hover:bg-white/50 rounded-full p-0.5">×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Search Results</h4>
              <p className="text-sm text-gray-500">Found 47 documents in 0.3 seconds</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-all">
                Sort: Recent
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-all">
                View: List
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                name: 'HB 2847 Committee Testimony - Final Draft.pdf',
                type: 'PDF',
                size: '2.4 MB',
                date: '2 days ago',
                client: 'TechGrid Alliance',
                tags: ['HB 2847', 'Testimony', 'Committee Hearing'],
                icon: FileText,
                color: 'red',
                views: 12,
                lastViewed: 'Sarah Mitchell'
              },
              {
                name: 'TechGrid Alliance - Position Brief.docx',
                type: 'Word',
                size: '1.8 MB',
                date: '5 days ago',
                client: 'TechGrid Alliance',
                tags: ['HB 2847', 'Position Paper', 'Strategy'],
                icon: FileText,
                color: 'blue',
                views: 8,
                lastViewed: 'Mike Rodriguez'
              },
              {
                name: 'Committee Meeting Recording - March 15.mp4',
                type: 'Video',
                size: '847 MB',
                date: '1 week ago',
                client: 'TechGrid Alliance',
                tags: ['HB 2847', 'Committee', 'Recording'],
                icon: Video,
                color: 'purple',
                views: 23,
                lastViewed: 'Team'
              },
              {
                name: 'Stakeholder Analysis - HB 2847.xlsx',
                type: 'Excel',
                size: '456 KB',
                date: '2 weeks ago',
                client: 'TechGrid Alliance',
                tags: ['HB 2847', 'Analysis', 'Stakeholders'],
                icon: FileText,
                color: 'green',
                views: 15,
                lastViewed: 'Lisa Kim'
              },
              {
                name: 'Email Thread - TechGrid Alliance Strategy.eml',
                type: 'Email',
                size: '89 KB',
                date: '3 weeks ago',
                client: 'TechGrid Alliance',
                tags: ['HB 2847', 'Email', 'Internal'],
                icon: MessageSquare,
                color: 'orange',
                views: 6,
                lastViewed: 'Tom Bradley'
              },
            ].map((doc, idx) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-4 rounded-xl bg-white border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-${doc.color}-100 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${doc.color}-600`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-gray-900 mb-1 truncate group-hover:text-teal-600 transition-colors">
                        {doc.name}
                      </h5>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <span>{doc.type}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.date}</span>
                        <span>•</span>
                        <span className="font-semibold text-teal-600">{doc.client}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {doc.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {doc.views} views
                        </span>
                        <span>Last viewed by {doc.lastViewed}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 hover:bg-teal-50 rounded-lg transition-all">
                        <Download className="w-5 h-5 text-gray-600 hover:text-teal-600" />
                      </button>
                      <button className="p-2 hover:bg-teal-50 rounded-lg transition-all">
                        <Share2 className="w-5 h-5 text-gray-600 hover:text-teal-600" />
                      </button>
                      <button className="p-2 hover:bg-teal-50 rounded-lg transition-all">
                        <Eye className="w-5 h-5 text-gray-600 hover:text-teal-600" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Search Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
            <div className="text-xs font-bold text-teal-700 mb-1">TOTAL DOCUMENTS</div>
            <div className="text-3xl font-bold text-gray-900">8,347</div>
            <div className="text-sm text-gray-600">Searchable Files</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">SEARCH SPEED</div>
            <div className="text-3xl font-bold text-gray-900">0.3s</div>
            <div className="text-sm text-gray-600">Average Time</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">FILE TYPES</div>
            <div className="text-3xl font-bold text-gray-900">15+</div>
            <div className="text-sm text-gray-600">Supported Formats</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">STORAGE</div>
            <div className="text-3xl font-bold text-gray-900">2.4TB</div>
            <div className="text-sm text-gray-600">Secure Cloud</div>
          </div>
        </div>

        {/* Pythia Search Intelligence */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-500 to-green-600 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2">Pythia Search Intelligence</h4>
              <p className="text-teal-100 leading-relaxed">
                Smart search understands context and relationships. Search "TechGrid testimony" and Pythia finds the testimony document, 
                related emails, meeting notes, bill text, legislator profiles, stakeholder analysis, and committee recordings—automatically 
                grouped by relevance. Natural language processing recognizes synonyms, acronyms, and related terms.
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
          Intelligent document search indexes all files, emails, notes, images, videos, and attachments across the entire platform. Search by keyword, client name, bill number, legislator, date range, document type, tags, or author. Results display in 0.3 seconds with relevance ranking, preview thumbnails, metadata, view counts, and one-click download/share/view actions. Advanced filters narrow results by system source (Bills, Clients, Projects, Issues, Team), file type, date modified, or access permissions.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Collaboration View
function CollaborationView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/30 to-green-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't lock files away. It makes sharing secure and seamless.
          </h3>
          <p className="text-base text-gray-700">
            Granular permissions, version control, comment threads, and real-time collaboration—so teams work together without security risks.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Shared Document Example */}
        <div className="bg-white rounded-2xl border-2 border-teal-200 overflow-hidden shadow-lg">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-teal-600 to-green-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <div>
                  <h4 className="font-bold text-white text-lg">HB 2847 Committee Testimony - Final Draft.pdf</h4>
                  <p className="text-teal-100 text-sm">Last modified 2 hours ago by Sarah Mitchell</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-4 py-2 bg-white hover:bg-gray-100 text-teal-600 rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>

          {/* Collaboration Panel */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team Access */}
              <div>
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Team Access (8 members)
                </h5>
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Mitchell', role: 'Lead Strategist', access: 'Full Access', avatar: 'SM', color: 'blue', status: 'editing' },
                    { name: 'Mike Rodriguez', role: 'Senior Analyst', access: 'Edit', avatar: 'MR', color: 'green', status: 'viewing' },
                    { name: 'Lisa Kim', role: 'Research Director', access: 'Edit', avatar: 'LK', color: 'purple', status: 'offline' },
                    { name: 'Tom Bradley', role: 'Communications', access: 'Comment Only', avatar: 'TB', color: 'orange', status: 'offline' },
                  ].map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className={`relative w-10 h-10 rounded-full bg-${member.color}-100 flex items-center justify-center font-bold text-${member.color}-600`}>
                          {member.avatar}
                          {member.status !== 'offline' && (
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                              member.status === 'editing' ? 'bg-green-500' : 'bg-blue-500'
                            }`} />
                          )}
                        </div>
                        <div>
                          <h6 className="font-semibold text-gray-900 text-sm">{member.name}</h6>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <select className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700">
                          <option>{member.access}</option>
                          <option>Full Access</option>
                          <option>Edit</option>
                          <option>Comment Only</option>
                          <option>View Only</option>
                          <option>Remove</option>
                        </select>
                        {member.status === 'editing' && (
                          <p className="text-xs text-green-600 font-semibold mt-1">Currently editing</p>
                        )}
                        {member.status === 'viewing' && (
                          <p className="text-xs text-blue-600 font-semibold mt-1">Currently viewing</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-3 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg font-semibold transition-all flex items-center justify-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Add Team Member
                </button>
              </div>

              {/* Version History & Comments */}
              <div>
                <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Version History
                </h5>
                <div className="space-y-2 mb-6">
                  {[
                    { version: 'v3.2 (Current)', author: 'Sarah Mitchell', date: '2 hours ago', changes: 'Final revisions for committee', current: true },
                    { version: 'v3.1', author: 'Mike Rodriguez', date: '1 day ago', changes: 'Updated economic impact data', current: false },
                    { version: 'v3.0', author: 'Lisa Kim', date: '3 days ago', changes: 'Major restructure based on feedback', current: false },
                    { version: 'v2.4', author: 'Sarah Mitchell', date: '5 days ago', changes: 'Initial draft for review', current: false },
                  ].map((v, idx) => (
                    <div key={idx} className={`p-3 rounded-lg border ${
                      v.current 
                        ? 'bg-teal-50 border-teal-300' 
                        : 'bg-white border-gray-200 hover:border-teal-200'
                    } transition-all cursor-pointer`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="font-bold text-gray-900 text-sm">{v.version}</h6>
                            {v.current && (
                              <span className="px-2 py-0.5 bg-teal-600 text-white text-xs font-bold rounded">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{v.changes}</p>
                          <p className="text-xs text-gray-500">{v.author} • {v.date}</p>
                        </div>
                        {!v.current && (
                          <button className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold transition-all">
                            Restore
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-teal-600" />
                  Comments (12)
                </h5>
                <div className="space-y-3 max-h-[200px] overflow-y-auto">
                  {[
                    { author: 'Tom Bradley', time: '1 hour ago', text: 'The opening paragraph is perfect. Really sets the tone well.', avatar: 'TB', color: 'orange' },
                    { author: 'Mike Rodriguez', time: '3 hours ago', text: 'Updated the economic numbers per our call. Please review page 4.', avatar: 'MR', color: 'green' },
                    { author: 'Lisa Kim', time: '5 hours ago', text: 'Should we include the small business provisions more prominently?', avatar: 'LK', color: 'purple' },
                  ].map((comment, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-gray-50">
                      <div className={`w-8 h-8 rounded-full bg-${comment.color}-100 flex items-center justify-center font-bold text-${comment.color}-600 text-xs flex-shrink-0`}>
                        {comment.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-700">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collaboration Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
            <div className="text-xs font-bold text-teal-700 mb-1">SHARED DOCUMENTS</div>
            <div className="text-3xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">Active Files</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">TEAM MEMBERS</div>
            <div className="text-3xl font-bold text-gray-900">34</div>
            <div className="text-sm text-gray-600">With Access</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">COMMENTS</div>
            <div className="text-3xl font-bold text-gray-900">892</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">VERSION SAVES</div>
            <div className="text-3xl font-bold text-gray-900">3,456</div>
            <div className="text-sm text-gray-600">Auto-Saved</div>
          </div>
        </div>

        {/* Security & Compliance Notice */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
          <div className="flex items-start gap-4">
            <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                Enterprise-Grade Security & Compliance
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Granular permission controls (Full Access, Edit, Comment Only, View Only, No Access) with role-based access management. 
                All file access tracked in audit logs with timestamps, IP addresses, and actions. SOC 2 Type II certified storage with 
                256-bit encryption at rest and in transit. Automatic compliance reporting for legal and regulatory requirements.
              </p>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  SOC 2 Type II
                </span>
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  256-bit Encryption
                </span>
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  GDPR Compliant
                </span>
                <span className="flex items-center gap-1 text-green-700 font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Full Audit Logs
                </span>
              </div>
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
          Real-time collaboration with granular permission controls for every document. Set access levels (Full Access, Edit, Comment Only, View Only) per user with role-based defaults. Version history auto-saves every change with restore capability. Comment threads attach to specific documents with @mentions and notifications. See who's viewing or editing files in real-time. Share links with expiration dates and password protection. All access tracked in audit logs for compliance and security.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Auto Reports View
function AutoReportsView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/30 to-green-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't wait for you to compile reports. It generates them automatically.
          </h3>
          <p className="text-base text-gray-700">
            One-click client reports, compliance documents, and activity summaries—pulling data from activity logs and generating professional PDFs in seconds.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Report Templates */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Available Report Templates
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                name: 'Client Activity Report',
                description: 'Comprehensive summary of all work performed for a specific client',
                includes: ['Bills tracked', 'Meetings attended', 'Documents created', 'Hours logged', 'Deliverables completed'],
                frequency: 'Weekly, Monthly, Quarterly',
                icon: Building2,
                color: 'blue',
                generated: 127
              },
              {
                name: 'Bill Monitoring Report',
                description: 'Status updates and activity log for all tracked legislation',
                includes: ['Bill status changes', 'Committee actions', 'Stakeholder positions', 'Momentum trends', 'Next steps'],
                frequency: 'Daily, Weekly',
                icon: Gavel,
                color: 'red',
                generated: 89
              },
              {
                name: 'Compliance & Audit Report',
                description: 'Full activity audit trail for regulatory and legal requirements',
                includes: ['User actions', 'File access logs', 'Permission changes', 'Document versions', 'Timestamps'],
                frequency: 'On-demand',
                icon: Shield,
                color: 'green',
                generated: 34
              },
              {
                name: 'Team Performance Report',
                description: 'Productivity metrics and workload analysis across all team members',
                includes: ['Tasks completed', 'Hours by project', 'Client distribution', 'Response times', 'Capacity analysis'],
                frequency: 'Weekly, Monthly',
                icon: Users,
                color: 'purple',
                generated: 56
              },
            ].map((template, idx) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-5 rounded-2xl bg-white border-2 border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-${template.color}-100`}>
                      <Icon className={`w-6 h-6 text-${template.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-lg mb-1">{template.name}</h5>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-xs font-bold text-gray-500 mb-2">INCLUDES:</div>
                    <div className="flex flex-wrap gap-1">
                      {template.includes.map((item, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500">Frequency</div>
                      <div className="text-sm font-semibold text-gray-900">{template.frequency}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Generated</div>
                      <div className="text-sm font-semibold text-teal-600">{template.generated} this month</div>
                    </div>
                  </div>

                  <button className="w-full mt-4 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all">
                    Generate Report
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sample Generated Report */}
        <div className="bg-white rounded-2xl border-2 border-teal-200 overflow-hidden shadow-lg">
          <div className="bg-gradient-to-r from-teal-600 to-green-600 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-teal-200" />
                  <span className="text-xs font-bold text-teal-200">AUTO-GENERATED REPORT</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Client Activity Report: TechGrid Alliance
                </h3>
                <div className="flex items-center gap-4 text-teal-100">
                  <span>Reporting Period: March 1-31, 2025</span>
                  <span>•</span>
                  <span>Generated: 2 minutes ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-white hover:bg-teal-50 text-teal-600 rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
                <button className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Executive Summary */}
            <div className="p-5 rounded-xl bg-teal-50 border border-teal-200">
              <h4 className="font-bold text-teal-900 mb-3">Executive Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-3xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Bills Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">12</div>
                  <div className="text-sm text-gray-600">Meetings</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">23</div>
                  <div className="text-sm text-gray-600">Documents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">94hr</div>
                  <div className="text-sm text-gray-600">Hours Logged</div>
                </div>
              </div>
            </div>

            {/* Activity Breakdown */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3">Activity Breakdown</h4>
              <div className="space-y-3">
                {[
                  { category: 'Legislative Monitoring', activities: 47, hours: 28 },
                  { category: 'Strategy & Analysis', activities: 23, hours: 31 },
                  { category: 'Client Communication', activities: 12, hours: 15 },
                  { category: 'Research & Documentation', activities: 34, hours: 20 },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-gray-900">{item.category}</h5>
                      <div className="text-right">
                        <div className="text-lg font-bold text-teal-600">{item.hours}hr</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-600 rounded-full" style={{ width: `${(item.hours / 94) * 100}%` }} />
                      </div>
                      <span className="text-sm text-gray-600">{item.activities} activities</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Achievements */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200">
              <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Key Achievements This Month
              </h4>
              <ul className="space-y-2">
                {[
                  'HB 2847 passed House committee with bipartisan support (76-24 vote)',
                  'Successfully coordinated coalition testimony with 5 allied organizations',
                  'Delivered comprehensive position brief 3 days ahead of deadline',
                  'Secured 4 new legislator endorsements through targeted outreach',
                ].map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Report Generation Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
            <div className="text-xs font-bold text-teal-700 mb-1">REPORTS GENERATED</div>
            <div className="text-3xl font-bold text-gray-900">306</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">GENERATION TIME</div>
            <div className="text-3xl font-bold text-gray-900">8s</div>
            <div className="text-sm text-gray-600">Average Speed</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">TIME SAVED</div>
            <div className="text-3xl font-bold text-gray-900">127hr</div>
            <div className="text-sm text-gray-600">Per Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">CLIENT SATISFACTION</div>
            <div className="text-3xl font-bold text-gray-900">98%</div>
            <div className="text-sm text-gray-600">Report Quality</div>
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
          Auto-generated reports compile data from activity logs across all systems into professional, client-ready documents in seconds. Choose from templates (Client Activity, Bill Monitoring, Compliance/Audit, Team Performance) or create custom reports. Set frequency (daily, weekly, monthly, quarterly, on-demand) and automatic delivery via email. Reports include executive summaries, activity breakdowns, key achievements, metrics charts, and full audit trails. Export to PDF, Word, or Excel with custom branding and client logos.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Activity Logs View
function ActivityLogsView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-teal-50/30 to-green-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't let work disappear. It logs every action, automatically.
          </h3>
          <p className="text-base text-gray-700">
            Comprehensive activity tracking across all systems—meetings, calls, emails, documents, bills, legislators—so you can prove what you did and when.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Activity Timeline */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              Activity Timeline
            </h4>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-all">
                Filter: All Activity
              </button>
              <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold transition-all">
                Export Logs
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-200 via-teal-300 to-teal-200" />

            {/* Activity Items */}
            <div className="space-y-4">
              {[
                {
                  type: 'meeting',
                  icon: Users,
                  color: 'blue',
                  title: 'Client Meeting: TechGrid Alliance Strategy Session',
                  user: 'Sarah Mitchell',
                  time: '2 hours ago',
                  details: 'Discussed HB 2847 committee hearing preparation. Attendees: Sarah Mitchell, Mike Rodriguez, Client contacts (3)',
                  attachments: ['Meeting Notes.pdf', 'Strategy Deck.pptx'],
                  client: 'TechGrid Alliance',
                  billable: true,
                  duration: '90 min'
                },
                {
                  type: 'document',
                  icon: FileText,
                  color: 'green',
                  title: 'Document Created: Committee Testimony Draft v3.2',
                  user: 'Sarah Mitchell',
                  time: '4 hours ago',
                  details: 'Final revisions completed. Shared with team for review.',
                  attachments: ['HB 2847 Testimony v3.2.pdf'],
                  client: 'TechGrid Alliance',
                  billable: true,
                  duration: '120 min'
                },
                {
                  type: 'email',
                  icon: MessageSquare,
                  color: 'purple',
                  title: 'Email Sent: Committee Member Outreach',
                  user: 'Mike Rodriguez',
                  time: '6 hours ago',
                  details: 'Sent personalized briefings to 5 committee members. Subject: "HB 2847 Economic Impact Analysis"',
                  attachments: ['Economic Analysis Brief.pdf'],
                  client: 'TechGrid Alliance',
                  billable: true,
                  duration: '45 min'
                },
                {
                  type: 'bill-update',
                  icon: Gavel,
                  color: 'red',
                  title: 'Bill Status Update: HB 2847 Advanced to Senate',
                  user: 'System',
                  time: '8 hours ago',
                  details: 'Automated tracking detected bill movement. Committee passed 8-4. Next: Senate Finance Committee.',
                  attachments: [],
                  client: 'TechGrid Alliance',
                  billable: false,
                  duration: null
                },
                {
                  type: 'call',
                  icon: Phone,
                  color: 'orange',
                  title: 'Phone Call: Sen. Michael Torres Office',
                  user: 'Lisa Kim',
                  time: '1 day ago',
                  details: 'Discussed committee hearing timeline and potential amendments. Follow-up scheduled.',
                  attachments: ['Call Notes.txt'],
                  client: 'TechGrid Alliance',
                  billable: true,
                  duration: '35 min'
                },
                {
                  type: 'research',
                  icon: Search,
                  color: 'cyan',
                  title: 'Research Completed: Stakeholder Analysis',
                  user: 'Tom Bradley',
                  time: '2 days ago',
                  details: 'Compiled positions from 23 registered stakeholders. Identified 5 potential allies for coalition building.',
                  attachments: ['Stakeholder Matrix.xlsx', 'Coalition Strategy.pdf'],
                  client: 'TechGrid Alliance',
                  billable: true,
                  duration: '180 min'
                },
              ].map((activity, idx) => {
                const Icon = activity.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -30 }}
                    animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="relative flex items-start gap-6"
                  >
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full border-4 border-${activity.color}-500 bg-${activity.color}-50 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-7 h-7 text-${activity.color}-600`} />
                    </div>

                    {/* Content Card */}
                    <div className="flex-1 group p-5 rounded-2xl bg-white border border-gray-200 hover:border-teal-300 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-bold text-gray-900">{activity.title}</h5>
                            {activity.billable && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                                BILLABLE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                            <span className="font-semibold">{activity.user}</span>
                            <span>•</span>
                            <span>{activity.time}</span>
                            {activity.duration && (
                              <>
                                <span>•</span>
                                <span className="text-teal-600 font-semibold">{activity.duration}</span>
                              </>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 mb-3">{activity.details}</p>

                          {activity.attachments.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              {activity.attachments.map((file, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  {file}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
                              {activity.client}
                            </span>
                            <button className="text-xs text-teal-600 hover:text-teal-700 font-semibold">
                              View Full Details →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div className="text-xs font-bold text-blue-700">MEETINGS</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">47</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <div className="text-xs font-bold text-green-700">DOCUMENTS</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">234</div>
            <div className="text-sm text-gray-600">Created/Edited</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              <div className="text-xs font-bold text-purple-700">COMMUNICATIONS</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">892</div>
            <div className="text-sm text-gray-600">Emails & Calls</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <div className="text-xs font-bold text-teal-700">BILLABLE HOURS</div>
            </div>
            <div className="text-3xl font-bold text-gray-900">347</div>
            <div className="text-sm text-gray-600">Tracked Hours</div>
          </div>
        </div>

        {/* Log Export Options */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-50 to-green-50 border border-teal-200">
          <div className="flex items-start gap-4">
            <Download className="w-8 h-8 text-teal-600 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-bold text-teal-900 mb-2">Export Activity Logs for Client Deliverables</h4>
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                Generate comprehensive activity reports for any time period, filtered by client, team member, project, or activity type. 
                Perfect for monthly client updates, billing reconciliation, compliance audits, or performance reviews. Export as PDF, Excel, or CSV.
              </p>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Custom Report
                </button>
                <button className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg font-semibold transition-all">
                  Schedule Automatic Delivery
                </button>
              </div>
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
          Comprehensive activity logs automatically track every interaction across all Pythia systems—meetings, phone calls, emails, document creation/edits, bill updates, legislator contacts, research activities, and team collaboration. Each log entry includes timestamp, user, client association, duration, billable status, attached files, and full context. Filter logs by date range, client, team member, activity type, or billable status. Export activity reports for client deliverables, compliance audits, billing reconciliation, or performance reviews. All logs are tamper-proof and stored with full audit trails for legal and regulatory compliance.
        </p>
      </motion.div>
    </motion.div>
  );
}
