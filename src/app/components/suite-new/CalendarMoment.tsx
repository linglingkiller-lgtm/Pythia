import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalendarDays, Calendar as CalendarIcon, Sparkles, Link2, FileText, Users, Building2, Gavel, Hash, Zap, Clock, MapPin, User, CheckCircle, AlertCircle, TrendingUp, Target, Bell, Video, Phone, MessageSquare, FolderKanban } from 'lucide-react';
import { Button } from '../ui/Button';

export function CalendarMoment() {
  const [activeView, setActiveView] = useState<'calendar' | 'event-finder' | 'auto-agenda' | 'integrations'>('calendar');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section id="calendar" className="relative py-32 overflow-hidden">
      {/* Gradient expansions */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-50/30 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-teal-50/30 to-transparent pointer-events-none z-10" />
      
      {/* Flowing background gradients - Purple/White */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-purple-100/70 via-purple-50/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-tl from-purple-50/40 via-white to-transparent" />
        <div className="absolute top-1/3 left-1/4 w-3/4 h-3/4 bg-gradient-to-br from-purple-50/50 via-transparent to-purple-100/40 blur-3xl" />
      </div>
      
      {/* Transition gradient to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-purple-50/20 to-green-50/30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-6">
            <CalendarDays className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">INTELLIGENT CALENDAR</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-gray-900 mb-6 tracking-tight leading-tight">
            Never Miss Another
            <br />
            Critical Event.
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Smart calendar that syncs with every system, finds relevant events automatically, and generates agendas powered by Pythia—so you're always prepared.
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
            onClick={() => setActiveView('calendar')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'calendar'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            <CalendarIcon className="w-4 h-4 inline mr-2" />
            Calendar View
          </button>
          <button
            onClick={() => setActiveView('event-finder')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'event-finder'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 inline mr-2" />
            Pythia Event Finder
          </button>
          <button
            onClick={() => setActiveView('auto-agenda')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'auto-agenda'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            <FileText className="w-4 h-4 inline mr-2" />
            Auto Agenda
          </button>
          <button
            onClick={() => setActiveView('integrations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeView === 'integrations'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:border-purple-300 hover:bg-purple-50 border border-gray-200'
            }`}
          >
            <Link2 className="w-4 h-4 inline mr-2" />
            System Integrations
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeView === 'calendar' && <CalendarView key="calendar" />}
          {activeView === 'event-finder' && <EventFinderView key="event-finder" />}
          {activeView === 'auto-agenda' && <AutoAgendaView key="auto-agenda" />}
          {activeView === 'integrations' && <IntegrationsView key="integrations" />}
        </AnimatePresence>

        {/* Intelligent Calendar Platform */}
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-20"
        >
          <h3 className="text-center text-2xl font-semibold text-gray-900 mb-12">
            Why teams choose Calendar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Link2,
                title: 'Universal Integration',
                description: 'Bidirectional sync with all Pythia systems—bills, legislators, clients, projects, issues, and team—in real-time.',
              },
              {
                icon: Sparkles,
                title: 'Pythia Event Finder',
                description: 'AI automatically discovers relevant events from 250+ sources, matching against your watchlists with confidence scores.',
              },
              {
                icon: FileText,
                title: 'Auto-Generated Agendas',
                description: 'Comprehensive briefing documents compiled in seconds from all connected systems with strategic recommendations.',
              },
              {
                icon: Clock,
                title: 'Smart Scheduling',
                description: 'Color-coded events by source and priority with conflict detection and automated reminders across all channels.',
              },
              {
                icon: Target,
                title: 'Context-Rich Events',
                description: 'Every event links to related bills, legislators, clients, and documents—full context in one click.',
              },
              {
                icon: Zap,
                title: 'Instant Sync',
                description: 'Sub-second synchronization across all systems. Update once, propagate everywhere automatically.',
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
                  className="p-6 rounded-2xl border bg-white border-gray-200 shadow-sm hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                >
                  <Icon className="w-6 h-6 mb-3 text-purple-600" />
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
          <div className="inline-block p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">Never Miss a Beat</div>
                <div className="text-sm text-gray-600">Intelligent scheduling for government relations</div>
              </div>
            </div>
            <p className="text-gray-700 max-w-md">
              From legislative hearings to client meetings, Calendar syncs everything automatically and generates agendas powered by Pythia—so you're always prepared.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Calendar View
function CalendarView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-indigo-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just show events. It connects them to your work.
          </h3>
          <p className="text-base text-gray-700">
            Unified calendar view auto-syncs hearings, deadlines, meetings, and legislative events—color-coded by source and priority.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-bold text-white">March 2025</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all">
                    ← Prev
                  </button>
                  <button className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition-all">
                    Next →
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-white/90 hover:bg-white rounded-lg text-purple-600 text-sm font-semibold transition-all">
                  Today
                </button>
              </div>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-3 text-center text-xs font-bold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {/* Sample days */}
            {Array.from({ length: 35 }, (_, i) => {
              const dayNum = i - 2; // Start from -2 to show previous month days
              const isCurrentMonth = dayNum >= 1 && dayNum <= 31;
              const isToday = dayNum === 15;
              
              // Sample events for specific days
              const hasEvents = [8, 12, 15, 18, 22, 25, 28].includes(dayNum);
              
              return (
                <div
                  key={i}
                  className={`min-h-[100px] border-b border-r border-gray-200 p-2 ${
                    !isCurrentMonth ? 'bg-gray-50' : 'bg-white hover:bg-purple-50/30'
                  } transition-colors`}
                >
                  <div className={`text-sm font-semibold mb-1 ${
                    isToday 
                      ? 'w-7 h-7 flex items-center justify-center rounded-full bg-purple-600 text-white' 
                      : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {isCurrentMonth ? dayNum : ''}
                  </div>
                  
                  {hasEvents && isCurrentMonth && (
                    <div className="space-y-1">
                      {dayNum === 15 && (
                        <>
                          <div className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-semibold truncate">
                            HB 2847 Hearing
                          </div>
                          <div className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-semibold truncate">
                            Client Meeting
                          </div>
                          <div className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded font-semibold truncate">
                            Brief Due
                          </div>
                        </>
                      )}
                      {dayNum === 18 && (
                        <>
                          <div className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded font-semibold truncate">
                            Committee Vote
                          </div>
                          <div className="text-[10px] px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-semibold truncate">
                            Team Sync
                          </div>
                        </>
                      )}
                      {dayNum === 22 && (
                        <div className="text-[10px] px-1.5 py-0.5 bg-cyan-100 text-cyan-700 rounded font-semibold truncate">
                          Strategy Session
                        </div>
                      )}
                      {dayNum === 25 && (
                        <>
                          <div className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded font-semibold truncate">
                            SB 1423 Hearing
                          </div>
                          <div className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded font-semibold truncate">
                            Deliverable Due
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border border-purple-200 p-6">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Today's Schedule (March 15)
          </h4>
          <div className="space-y-3">
            {[
              { time: '9:00 AM', title: 'HB 2847 Committee Hearing', type: 'hearing', location: 'Capitol Room 301', source: 'Bill Tracker', color: 'red' },
              { time: '11:30 AM', title: 'TechGrid Alliance Check-in', type: 'meeting', location: 'Video Call', source: 'Clients', color: 'blue' },
              { time: '2:00 PM', title: 'Position Brief Due', type: 'deadline', location: 'Deliverables', source: 'Projects', color: 'orange' },
              { time: '4:00 PM', title: 'Team Strategy Session', type: 'meeting', location: 'Conference Room A', source: 'Team', color: 'purple' },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-center min-w-[70px]">
                  <div className="text-sm font-bold text-gray-900">{event.time}</div>
                  <div className="text-xs text-gray-500">{event.time.includes('AM') ? 'AM' : 'PM'}</div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-semibold text-gray-900">{event.title}</h5>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      event.color === 'red' ? 'bg-red-100 text-red-700' :
                      event.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                      event.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {event.source}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {event.location}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {event.type === 'meeting' && <Video className="w-5 h-5 text-purple-600" />}
                  {event.type === 'hearing' && <Gavel className="w-5 h-5 text-red-600" />}
                  {event.type === 'deadline' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Color Legend */}
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Bill Hearings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-gray-600">Client Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm text-gray-600">Deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Legislative Events</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span className="text-sm text-gray-600">Internal</span>
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
          Unified calendar view displays all events from every system—bill hearings, committee votes, client meetings, project deadlines, and deliverables—in one synchronized view. Color-coded by source (Bill Tracker, Clients, Projects, Team) with time, location, and type indicators. Click any event for full context including related bills, legislators, clients, and auto-generated agendas.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Event Finder View
function EventFinderView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-indigo-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't wait for you to search. It finds what matters automatically.
          </h3>
          <p className="text-base text-gray-700">
            AI-powered event discovery scans legislative calendars, committee schedules, and public hearings—surfacing opportunities before your competitors even know they exist.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Pythia Analysis */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold mb-2">Pythia Event Intelligence Active</h4>
              <p className="text-purple-100 leading-relaxed">
                Scanning 127 legislative calendars, 43 committee schedules, and 89 public hearing boards across all tracked jurisdictions. 
                Matching events against your watchlist of <strong>23 bills</strong>, <strong>47 legislators</strong>, <strong>12 clients</strong>, and <strong>8 issues</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Discovered Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Newly Discovered Events (Last 24 Hours)
            </h4>
            <span className="text-sm text-gray-500">8 found</span>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Senate Finance Committee Hearing: Tax Incentive Programs',
                date: 'March 22, 2025',
                time: '10:00 AM',
                location: 'Capitol Building, Room 405',
                relevance: 'High',
                matches: ['HB 2847 (Your Watchlist)', 'Sen. Michael Torres (Following)', 'TechGrid Alliance (Client)'],
                type: 'Committee Hearing',
                status: 'new',
                probability: 94
              },
              {
                title: 'Public Hearing: Healthcare Access Expansion Proposal',
                date: 'March 25, 2025',
                time: '2:00 PM',
                location: 'State Office Building, Auditorium',
                relevance: 'High',
                matches: ['Healthcare Coalition (Client)', 'Issue: Healthcare Reform (Tracking)', 'Sen. Rebecca Chen (Following)'],
                type: 'Public Hearing',
                status: 'new',
                probability: 89
              },
              {
                title: 'House Education Committee Work Session',
                date: 'March 28, 2025',
                time: '9:00 AM',
                location: 'Legislative Building, Room 202',
                relevance: 'Medium',
                matches: ['SB 1423 (Your Watchlist)', 'Education First (Client)', 'Rep. David Kim (Following)'],
                type: 'Work Session',
                status: 'suggested',
                probability: 76
              },
              {
                title: 'Joint Committee on Energy Policy: Renewable Standards Review',
                date: 'April 1, 2025',
                time: '1:30 PM',
                location: 'Capitol Building, Room 301',
                relevance: 'High',
                matches: ['Energy Innovators (Client)', 'Issue: Clean Energy (Tracking)', '3 Watched Bills'],
                type: 'Joint Committee',
                status: 'new',
                probability: 91
              },
            ].map((event, idx) => (
              <motion.div
                key={idx}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-5 rounded-2xl bg-white border-2 border-purple-200 hover:border-purple-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {event.status === 'new' && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded animate-pulse">
                          NEW
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        event.relevance === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {event.relevance} Relevance
                      </span>
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                        {event.type}
                      </span>
                    </div>
                    <h5 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h5>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-3xl font-bold text-purple-600">{event.probability}%</div>
                    <div className="text-xs text-gray-500 font-semibold">Match Score</div>
                  </div>
                </div>

                {/* Match Indicators */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs font-bold text-gray-500 mb-2">PYTHIA MATCHES:</div>
                  <div className="flex flex-wrap gap-2">
                    {event.matches.map((match, i) => (
                      <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg border border-purple-200">
                        {match}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all">
                    Add to Calendar
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all">
                    Generate Agenda
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all">
                    Dismiss
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Discovery Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">THIS WEEK</div>
            <div className="text-3xl font-bold text-gray-900">23</div>
            <div className="text-sm text-gray-600">Events Found</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">ADDED</div>
            <div className="text-3xl font-bold text-gray-900">18</div>
            <div className="text-sm text-gray-600">To Calendar</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">AVG MATCH</div>
            <div className="text-3xl font-bold text-gray-900">87%</div>
            <div className="text-sm text-gray-600">Relevance Score</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="text-xs font-bold text-orange-700 mb-1">SCANNING</div>
            <div className="text-3xl font-bold text-gray-900">259</div>
            <div className="text-sm text-gray-600">Source Calendars</div>
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
          Pythia Event Finder continuously scans legislative calendars, committee schedules, public hearings, and stakeholder events across all jurisdictions—automatically matching against your watchlists (bills, legislators, clients, issues). Each discovered event shows relevance score (0-100%), match indicators, date/time/location, and one-click actions to add to calendar or generate agendas. Set custom alert thresholds to receive notifications only for high-priority matches.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Auto Agenda View
function AutoAgendaView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-indigo-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't just list talking points. It builds complete agendas from context.
          </h3>
          <p className="text-base text-gray-700">
            Auto-generated agendas pull data from every connected system—background research, stakeholder positions, key talking points, and strategic recommendations—all formatted and ready to print.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Sample Auto Agenda */}
        <div className="bg-white rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg">
          {/* Agenda Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-200" />
                  <span className="text-xs font-bold text-purple-200">AUTO-GENERATED BY PYTHIA</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Senate Finance Committee Hearing: HB 2847
                </h3>
                <div className="flex items-center gap-4 text-purple-100">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    March 22, 2025
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    10:00 AM - 12:00 PM
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Capitol Room 405
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-600 rounded-lg font-semibold transition-all flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Agenda Content */}
          <div className="p-8 space-y-6">
            {/* Executive Summary */}
            <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Executive Summary
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Bill:</strong> HB 2847 - Technology Innovation Tax Credit Act<br />
                <strong>Client Position:</strong> TechGrid Alliance (Strong Support)<br />
                <strong>Committee Composition:</strong> 7 Republicans, 5 Democrats (Likely favorable 8-4 vote)<br />
                <strong>Key Objective:</strong> Secure committee passage with bipartisan support. Target swing votes: Sen. Martinez (R) and Sen. Williams (D).
              </p>
            </div>

            {/* Bill Background */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Bill Background
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded ml-2">
                  From Bill Tracker
                </span>
              </h4>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  HB 2847 provides up to $50M in tax credits for technology companies investing in R&D facilities within the state. 
                  Current status: Passed House 76-24, advancing to Senate Finance Committee.
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-900">Sponsor:</span> Rep. Sarah Mitchell (R)
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Momentum:</span> <span className="text-green-600">+18% (Rising)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Last Action:</span> 3 days ago
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Stakeholders:</span> 23 registered
                  </div>
                </div>
              </div>
            </div>

            {/* Key Committee Members */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Key Committee Members
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded ml-2">
                  From Legislator Tracker
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { name: 'Sen. Michael Torres', party: 'R', position: 'Chair', stance: 'Support', influence: 95, priority: 'High' },
                  { name: 'Sen. Rebecca Chen', party: 'D', position: 'Vice Chair', stance: 'Support', influence: 88, priority: 'High' },
                  { name: 'Sen. James Martinez', party: 'R', position: 'Member', stance: 'Undecided', influence: 76, priority: 'Critical' },
                  { name: 'Sen. Lisa Williams', party: 'D', position: 'Member', stance: 'Lean Support', influence: 71, priority: 'High' },
                ].map((member, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-white border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-semibold text-gray-900">{member.name}</h5>
                        <p className="text-xs text-gray-500">{member.position} • {member.party}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        member.priority === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {member.priority}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-semibold ${
                        member.stance === 'Support' ? 'text-green-600' :
                        member.stance === 'Lean Support' ? 'text-blue-600' :
                        'text-gray-600'
                      }`}>
                        {member.stance}
                      </span>
                      <span className="text-gray-500">Influence: {member.influence}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Talking Points */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Key Talking Points
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-0.5 rounded ml-2">
                  Pythia-Generated
                </span>
              </h4>
              <div className="space-y-2">
                {[
                  'Economic Impact: Projects 2,400 new high-wage jobs and $380M in economic activity over 5 years',
                  'Bipartisan Appeal: Similar programs passed in 12 states (8 Republican, 4 Democratic governors)',
                  'Fiscal Responsibility: Self-funding mechanism through increased tax revenue from job growth',
                  'Competitive Advantage: Without this, we risk losing tech investments to neighboring states',
                  'Small Business Support: 40% of credits reserved for companies with <100 employees',
                ].map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
              <h4 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Pythia Strategic Recommendations
              </h4>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>1. Target Sen. Martinez first:</strong> He's undecided but represents a tech-heavy district. Lead with job creation numbers for his county specifically.</p>
                <p><strong>2. Address fiscal concerns proactively:</strong> Sen. Williams expressed budget concerns in previous hearings. Emphasize self-funding mechanism and revenue projections.</p>
                <p><strong>3. Coordinate with allied organizations:</strong> Chamber of Commerce and Small Business Association both registered support. Reference their testimony for credibility.</p>
              </div>
            </div>

            {/* Expected Timeline */}
            <div>
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Expected Timeline
              </h4>
              <div className="space-y-2">
                {[
                  { time: '10:00 AM', event: 'Hearing Opens - Public Testimony Begins' },
                  { time: '10:45 AM', event: 'TechGrid Alliance Testimony (Your Turn)' },
                  { time: '11:15 AM', event: 'Opposition Testimony Expected' },
                  { time: '11:45 AM', event: 'Committee Q&A and Discussion' },
                  { time: '12:00 PM', event: 'Committee Vote (Anticipated)' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <span className="font-semibold text-purple-600 w-20">{item.time}</span>
                    <span className="text-gray-700">{item.event}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Agenda Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">DATA SOURCES</div>
            <div className="text-3xl font-bold text-gray-900">5</div>
            <div className="text-sm text-gray-600">Systems Synced</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">GENERATION TIME</div>
            <div className="text-3xl font-bold text-gray-900">12s</div>
            <div className="text-sm text-gray-600">Fully Compiled</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">AGENDAS CREATED</div>
            <div className="text-3xl font-bold text-gray-900">47</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="text-xs font-bold text-orange-700 mb-1">TIME SAVED</div>
            <div className="text-3xl font-bold text-gray-900">38hr</div>
            <div className="text-sm text-gray-600">Per Month</div>
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
          Auto-generated agendas compile comprehensive briefing documents for any calendar event in seconds. Pythia pulls bill summaries from Bill Tracker, legislator profiles and voting records from Legislator Tracker, client positions from Client Command Center, and strategic recommendations from Issues Intelligence—formatting everything into professional, print-ready agendas with executive summaries, talking points, stakeholder analysis, and timeline expectations. Export to PDF or share with team members instantly.
        </p>
      </motion.div>
    </motion.div>
  );
}

// Integrations View
function IntegrationsView() {
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
      <div className="mb-8 pb-6 border-b border-gray-200 bg-gradient-to-br from-purple-50/30 to-indigo-50/30 -m-8 p-8 rounded-t-[28px]">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h3 className="text-2xl font-bold text-gray-900">
            Pythia doesn't isolate your calendar. It connects everything automatically.
          </h3>
          <p className="text-base text-gray-700">
            Seamless two-way sync with Bill Tracker, Legislator Tracker, Clients, Projects, Issues, and Team—every event stays current across all systems in real-time.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Integration Flow Diagram */}
        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
          <div className="text-center mb-8">
            <h4 className="font-bold text-gray-900 text-xl mb-2">Real-Time System Synchronization</h4>
            <p className="text-sm text-gray-600">Bidirectional data flow across all Pythia modules</p>
          </div>

          {/* Central Calendar Hub */}
          <div className="flex items-center justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full" />
              <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl">
                <CalendarDays className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 border-4 border-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Connected Systems Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { 
                name: 'Bill Tracker',
                icon: Gavel,
                color: 'red',
                syncs: ['Committee hearings', 'Floor votes', 'Bill deadlines', 'Public testimony'],
                count: 23
              },
              {
                name: 'Legislator Tracker',
                icon: Users,
                color: 'blue',
                syncs: ['Town halls', 'Office hours', 'Campaign events', 'Speaking engagements'],
                count: 47
              },
              {
                name: 'Client Command',
                icon: Building2,
                color: 'green',
                syncs: ['Client meetings', 'Check-ins', 'Deliverable deadlines', 'Strategy sessions'],
                count: 34
              },
              {
                name: 'Project Hub',
                icon: FolderKanban,
                color: 'cyan',
                syncs: ['Project deadlines', 'Team meetings', 'Milestone dates', 'Review sessions'],
                count: 18
              },
              {
                name: 'Issues Intelligence',
                icon: Hash,
                color: 'orange',
                syncs: ['Media events', 'Stakeholder meetings', 'Public forums', 'Coalition calls'],
                count: 12
              },
              {
                name: 'Team Management',
                icon: Users,
                color: 'purple',
                syncs: ['Team meetings', '1-on-1s', 'Training sessions', 'All-hands'],
                count: 29
              },
            ].map((system, idx) => {
              const Icon = system.icon;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group p-4 rounded-xl bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg bg-${system.color}-100`}>
                      <Icon className={`w-5 h-5 text-${system.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-bold text-gray-900 text-sm">{system.name}</h5>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-green-600 font-semibold">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-3 space-y-1">
                    {system.syncs.slice(0, 2).map((sync, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <Link2 className="w-3 h-3" />
                        {sync}
                      </div>
                    ))}
                    <div className="text-purple-600 font-semibold">+{system.syncs.length - 2} more...</div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Events synced</span>
                    <span className="text-lg font-bold text-purple-600">{system.count}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sync Examples */}
        <div>
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Integration Examples
          </h4>

          <div className="space-y-3">
            {[
              {
                trigger: 'Bill added to watchlist in Bill Tracker',
                result: 'Committee hearing automatically added to Calendar',
                systems: ['Bill Tracker', 'Calendar'],
                icon: Gavel,
                color: 'red'
              },
              {
                trigger: 'Client meeting scheduled in Client Command',
                result: 'Calendar event created + Auto-agenda generated with client context',
                systems: ['Clients', 'Calendar'],
                icon: Building2,
                color: 'green'
              },
              {
                trigger: 'Project deadline set in Project Hub',
                result: 'Calendar reminder created + Team members notified',
                systems: ['Projects', 'Calendar', 'Team'],
                icon: FolderKanban,
                color: 'cyan'
              },
              {
                trigger: 'Legislator event discovered by Pythia',
                result: 'Event added to Calendar + Legislator profile updated with attendance',
                systems: ['Legislator Tracker', 'Calendar'],
                icon: Users,
                color: 'blue'
              },
            ].map((example, idx) => {
              const Icon = example.icon;
              return (
                <motion.div
                  key={idx}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  animate={prefersReducedMotion ? {} : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl bg-${example.color}-100 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${example.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start gap-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900">{example.trigger}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-px flex-1 bg-gradient-to-r from-purple-300 to-transparent" />
                        <Zap className="w-4 h-4 text-purple-600" />
                        <div className="h-px flex-1 bg-gradient-to-l from-purple-300 to-transparent" />
                      </div>
                      <div className="text-sm text-purple-700 font-medium mb-2">
                        {example.result}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {example.systems.map((sys, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
                            {sys}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Sync Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-xs font-bold text-purple-700 mb-1">TOTAL SYNCS</div>
            <div className="text-3xl font-bold text-gray-900">163</div>
            <div className="text-sm text-gray-600">Active Events</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="text-xs font-bold text-green-700 mb-1">SYSTEMS CONNECTED</div>
            <div className="text-3xl font-bold text-gray-900">6</div>
            <div className="text-sm text-gray-600">100% Uptime</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="text-xs font-bold text-blue-700 mb-1">AUTO-UPDATES</div>
            <div className="text-3xl font-bold text-gray-900">1,247</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
            <div className="text-xs font-bold text-orange-700 mb-1">SYNC SPEED</div>
            <div className="text-3xl font-bold text-gray-900">&lt;1s</div>
            <div className="text-sm text-gray-600">Real-Time</div>
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
          Calendar integrates bidirectionally with all Pythia systems in real-time. Bill hearings from Bill Tracker, legislator events from Legislator Tracker, client meetings from Client Command, project deadlines from Project Hub, stakeholder events from Issues Intelligence, and team meetings from Team Management all sync automatically. Any change in one system updates the Calendar instantly—and vice versa. No manual data entry, no duplicate events, no sync delays.
        </p>
      </motion.div>
    </motion.div>
  );
}