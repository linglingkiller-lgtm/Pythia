import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  RefreshCw,
  FileText,
  Filter,
  Calendar as CalendarIcon,
  Sparkles,
} from 'lucide-react';
import { CalendarGrid } from './CalendarGrid';
import { DayAgenda } from './DayAgenda';
import { EventDetailDrawer } from './EventDetailDrawer';
import { AIOpportunities } from './AIOpportunities';
import { DeadlinesCompliance } from './DeadlinesCompliance';
import { QuickActions } from './QuickActions';
import { GenerateEventBriefModal } from './GenerateEventBriefModal';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Hearing' | 'Meeting' | 'Deadline' | 'Networking';
  date: Date;
  time: string;
  location: string;
  linkedObjects: {
    bills?: string[];
    issues?: string[];
    committees?: string[];
    people?: string[];
  };
  prepStatus: 'Not started' | 'Draft brief' | 'Ready';
  recordStatus: 'Not logged' | 'Logged';
  priority?: 'High' | 'Medium' | 'Low';
  description?: string;
  host?: string;
  strategicValue?: number;
}

export function CalendarPage() {
  const [viewMode, setViewMode] = React.useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showGenerateBriefModal, setShowGenerateBriefModal] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Mock events - starting events
  const initialEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'HB90 Committee Hearing',
      type: 'Hearing',
      date: new Date(2024, 11, 20, 9, 0),
      time: '9:00 AM',
      location: 'Room 240B, Senate Building',
      linkedObjects: {
        bills: ['HB90'],
        issues: ['Solar', 'Energy'],
        committees: ['Energy & Environment'],
        people: ['Rep. Jordan Ramirez'],
      },
      prepStatus: 'Ready',
      recordStatus: 'Not logged',
      priority: 'High',
      description: 'Committee hearing on solar interconnection standards bill',
    },
    {
      id: '2',
      title: 'Coalition Strategy Meeting',
      type: 'Meeting',
      date: new Date(2024, 11, 22, 14, 0),
      time: '2:00 PM',
      location: 'Virtual - Zoom',
      linkedObjects: {
        issues: ['Solar', 'Clean Energy'],
      },
      prepStatus: 'Draft brief',
      recordStatus: 'Not logged',
      priority: 'Medium',
    },
    {
      id: '3',
      title: 'Quarterly Report Due',
      type: 'Deadline',
      date: new Date(2024, 11, 31, 17, 0),
      time: '5:00 PM',
      location: 'N/A',
      linkedObjects: {},
      prepStatus: 'Not started',
      recordStatus: 'Not logged',
      priority: 'High',
    },
  ];

  const [events, setEvents] = React.useState<CalendarEvent[]>(initialEvents);

  const handleAddEventToCalendar = (opportunityData: {
    id: string;
    name: string;
    date: string;
    time: string;
    venue: string;
    city: string;
    whyItMatters: string;
    relevance: string[];
    likelyAttendees: string[];
    host?: string;
    relatedBills?: string[];
    strategicValue?: number;
  }) => {
    // Parse the date string (e.g., "Dec 18, 2024")
    const parsedDate = new Date(opportunityData.date);
    
    // Parse the time string to add hours/minutes (handle ranges like "9:00 AM - 5:00 PM")
    const timeString = opportunityData.time.split('-')[0].trim(); // Get first time if range
    const timeMatch = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1]);
      const minutes = parseInt(timeMatch[2]);
      const isPM = timeMatch[3].toUpperCase() === 'PM';
      
      if (isPM && hours !== 12) hours += 12;
      if (!isPM && hours === 12) hours = 0;
      
      parsedDate.setHours(hours, minutes, 0, 0);
    }

    const newEvent: CalendarEvent = {
      id: `added-${Date.now()}`,
      title: opportunityData.name,
      type: 'Networking',
      date: parsedDate,
      time: opportunityData.time,
      location: `${opportunityData.venue} • ${opportunityData.city}`,
      linkedObjects: {
        issues: opportunityData.relevance,
        people: opportunityData.likelyAttendees,
        bills: opportunityData.relatedBills || [],
      },
      prepStatus: 'Not started',
      recordStatus: 'Not logged',
      priority: 'Medium',
      description: opportunityData.whyItMatters,
      host: opportunityData.host,
      strategicValue: opportunityData.strategicValue,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
    
    // Navigate to the month of the new event
    setCurrentDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    
    // Show success feedback
    console.log('Event added:', newEvent);
    alert(`✓ "${opportunityData.name}" added to calendar on ${parsedDate.toLocaleDateString()}`);
  };

  const handleGenerateBrief = () => {
    if (selectedEvent) {
      setShowGenerateBriefModal(true);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseDrawer = () => {
    setSelectedEvent(null);
  };

  const getMonthYearString = () => {
    return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const { isDarkMode } = useTheme();

  // Scroll detection
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Get Calendar page theme
  const calendarTheme = getPageTheme('Calendar');

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Sticky Header */}
      <motion.div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
              : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg'
            : isDarkMode
            ? 'bg-slate-900/40 backdrop-blur-sm'
            : 'bg-white/40 backdrop-blur-sm'
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Calendar" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(calendarTheme.gradientFrom, 0.12)}, ${hexToRgba(calendarTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(calendarTheme.gradientFrom, 0.08)}, ${hexToRgba(calendarTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(calendarTheme.accent, 0.25)
                    : hexToRgba(calendarTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(calendarTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(calendarTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(calendarTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(calendarTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <CalendarIcon
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? calendarTheme.glow : calendarTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: calendarTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? calendarTheme.glow : calendarTheme.accent,
                  }}
                >
                  Calendar
                </span>
              </motion.div>

              {/* Subtle breadcrumb-style divider */}
              <span
                className="text-sm font-medium"
                style={{
                  color: isDarkMode
                    ? hexToRgba('#FFFFFF', 0.2)
                    : hexToRgba('#000000', 0.15),
                }}
              >
                /
              </span>

              {/* Title + Subtitle */}
              <div>
                <motion.h1
                  className={`font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                  animate={{
                    fontSize: isScrolled ? '20px' : '28px',
                    marginBottom: isScrolled ? '0px' : '4px',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  Schedule & Events
                </motion.h1>
                <motion.p
                  className={`text-xs ${
                    isDarkMode ? 'text-slate-400' : 'text-gray-600'
                  }`}
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  {events.filter(e => e.date >= new Date()).length} upcoming events
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToday}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <CalendarIcon size={16} />
                Today
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <RefreshCw size={16} />
                Sync Calendar
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                    : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
                }`}
              >
                <Plus size={16} />
                New Event
              </button>
            </div>
          </div>

          {/* Gradient Accent Line with Calendar theme */}
          <div 
            className="h-[2px] w-full mb-4"
            style={{
              background: `linear-gradient(to right, transparent, ${hexToRgba(calendarTheme.gradientFrom, 0.3)}, ${hexToRgba(calendarTheme.gradientTo, 0.25)}, transparent)`,
            }}
          />

          {/* View Mode Toggle + Search */}
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-xl ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              {(['Month', 'Week', 'Agenda'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    viewMode === mode
                      ? isDarkMode
                        ? 'text-white shadow-lg'
                        : 'bg-white shadow-md'
                      : isDarkMode
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  style={
                    viewMode === mode
                      ? {
                          background: `linear-gradient(135deg, ${calendarTheme.gradientFrom}, ${calendarTheme.gradientTo})`,
                          boxShadow: isDarkMode
                            ? `0 4px 12px ${hexToRgba(calendarTheme.glow, 0.3)}`
                            : `0 2px 8px ${hexToRgba(calendarTheme.glow, 0.2)}`,
                        }
                      : {}
                  }
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search size={18} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search events by bill, person, issue, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                    : 'bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                } focus:outline-none`}
              />
            </div>

            {/* Month Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-800/50 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              <span className={`text-sm font-semibold min-w-[140px] text-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                {getMonthYearString()}
              </span>
              <button
                onClick={handleNextMonth}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-slate-800/50 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showFilters
                  ? isDarkMode
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-orange-50 text-orange-700 border border-orange-200'
                  : isDarkMode
                  ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                  : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Filter Pills */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex items-center gap-3"
            >
              <span className={`text-xs uppercase tracking-wider font-semibold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Active:
              </span>
              <div className="flex flex-wrap gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                  All Jurisdictions
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-purple-50 text-purple-700 border border-purple-200'
                }`}>
                  All Event Types
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-50 text-green-700 border border-green-200'
                }`}>
                  All Issues
                </span>
              </div>
              <button className={`ml-auto text-xs font-semibold ${isDarkMode ? 'text-orange-400 hover:text-orange-300' : 'text-orange-600 hover:text-orange-700'}`}>
                Clear All
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scrollable Content Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Main Layout: 3-column - Glassmorphic Cards */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left: Calendar View (7 columns) */}
            <div className="col-span-7">
              <div className={`rounded-lg border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/40 backdrop-blur-xl border-white/10' 
                  : 'bg-white/80 backdrop-blur-xl border-gray-200'
              } p-6 shadow-lg`}>
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: '"Corpline", sans-serif' }}>
                    {getMonthYearString()}
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToday}
                      className={`px-4 py-2 text-sm font-medium border ${isDarkMode ? 'border-white/10' : 'border-gray-200'} ${isDarkMode ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50' : 'bg-white/80 text-gray-700 hover:bg-gray-50'} backdrop-blur-sm transition-all rounded-lg`}
                    >
                      Today
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePreviousMonth}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} backdrop-blur-sm transition-colors border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-800/50 text-gray-300' : 'hover:bg-gray-100 text-gray-700'} backdrop-blur-sm transition-colors border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Calendar Grid */}
                <CalendarGrid
                  currentDate={currentDate}
                  events={events}
                  viewMode={viewMode}
                  onDayClick={handleDayClick}
                  onEventClick={handleEventClick}
                  selectedDay={selectedDay}
                />
              </div>

              {/* Day Agenda Panel (shows when a day is selected) */}
              {selectedDay && (
                <div className="mt-6">
                  <DayAgenda
                    selectedDay={selectedDay}
                    events={events}
                    onEventClick={handleEventClick}
                  />
                </div>
              )}
            </div>

            {/* Right Rail: AI Opportunities, Deadlines, Quick Actions (5 columns) */}
            <div className="col-span-5 space-y-6">
              <QuickActions />
              <AIOpportunities onAddEvent={handleAddEventToCalendar} />
              <DeadlinesCompliance />
            </div>
          </div>

          {/* Event Detail Drawer */}
          {selectedEvent && (
            <EventDetailDrawer
              event={selectedEvent}
              onClose={handleCloseDrawer}
              onGenerateBrief={handleGenerateBrief}
            />
          )}

          {/* Generate Brief Modal */}
          {showGenerateBriefModal && selectedEvent && (
            <GenerateEventBriefModal
              event={selectedEvent}
              onClose={() => setShowGenerateBriefModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}