import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, Search, Bell, Settings, Sparkles, Menu, ChevronDown, 
  CheckCircle2, AlertCircle, Clock, MapPin, Filter, Plus, RefreshCw, X
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

// Header Functionality Imports
import { useAuth } from '../../contexts/AuthContext';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { PageLayout } from '../ui/PageLayout';

import { CalendarDashboard } from './CalendarDashboard';
import { EventDetailDrawer } from './EventDetailDrawer';
import { GenerateEventBriefModal } from './GenerateEventBriefModal';

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
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  
  // Page State
  const [viewMode, setViewMode] = React.useState<'Month' | 'Week' | 'Agenda'>('Month');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDay, setSelectedDay] = React.useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null);
  const [showGenerateBriefModal, setShowGenerateBriefModal] = React.useState(false);

  // Customization State
  const [isEditMode, setIsEditMode] = useState(false);

  // Mock events
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

  // Event Handlers
  const handleAddEventToCalendar = (opportunityData: any) => {
    const parsedDate = new Date(opportunityData.date);
    const timeString = opportunityData.time.split('-')[0].trim();
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
    setCurrentDate(new Date(parsedDate.getFullYear(), parsedDate.getMonth(), 1));
    alert(`✓ "${opportunityData.name}" added to calendar on ${parsedDate.toLocaleDateString()}`);
  };

  // Stats for Header
  const upcomingEventsCount = events.filter(e => e.date >= new Date()).length;
  const highPriorityCount = events.filter(e => e.priority === 'High' && e.date >= new Date()).length;
  const pendingBriefsCount = events.filter(e => (e.prepStatus === 'Not started' || e.prepStatus === 'Draft brief') && e.date >= new Date()).length;

  const currentThemeKey = 'Calendar';
  const currentTheme = getPageTheme(currentThemeKey);
  
  const headerContent = (
    <div className="flex items-center gap-3">
        <button 
            onClick={() => setViewMode('Agenda')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
        >
            <CalendarIcon size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{upcomingEventsCount} Upcoming</span>
        </button>
        <button 
            onClick={() => setViewMode('Week')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
        >
            <AlertCircle size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{highPriorityCount} High Priority</span>
        </button>
        <button 
            onClick={() => setShowGenerateBriefModal(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}
        >
            <CheckCircle2 size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{pendingBriefsCount} Briefs Needed</span>
        </button>
    </div>
  );

  return (
    <PageLayout
      title="Calendar"
      subtitle="Legislative Timeline"
      accentColor={currentTheme.accent}
      headerIcon={
        <CalendarIcon 
            size={28} 
            color={isDarkMode ? "white" : currentTheme.accent} 
            strokeWidth={2.5}
            className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
        />
      }
      backgroundImage={
        <CalendarIcon 
            size={450} 
            color={isDarkMode ? "white" : currentTheme.accent} 
            strokeWidth={0.5}
        />
      }
      headerContent={headerContent}
      contentClassName="flex-1 overflow-y-auto"

      // Customization Hooks
      onCustomize={() => setIsEditMode(true)}
      isCustomizing={isEditMode}
      onSaveCustomization={() => setIsEditMode(false)}
      onCancelCustomization={() => setIsEditMode(false)}
    >
        <div className="relative">
            {isEditMode && (
                <div className="absolute top-4 right-4 z-50 flex justify-center w-full pointer-events-none">
                    <div className={`
                        pointer-events-auto
                        flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all
                        ${isDarkMode 
                        ? 'bg-[#0a0a0b]/90 border-blue-500/50 hover:bg-blue-500/10 text-gray-400 hover:text-blue-400 backdrop-blur-md' 
                        : 'bg-white/90 border-blue-500 hover:bg-blue-50 text-gray-500 hover:text-blue-600 backdrop-blur-md'
                        }
                    `}>
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                            <Settings size={24} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                        </div>
                        <span className="font-medium">Configure View Settings</span>
                    </div>
                </div>
            )}
            <CalendarDashboard
                currentDate={currentDate}
                events={events}
                viewMode={viewMode}
                selectedDay={selectedDay}
                onDayClick={setSelectedDay}
                onEventClick={setSelectedEvent}
                onAddEvent={handleAddEventToCalendar}
            />
        </div>

      {/* Event Detail Drawer */}
      {selectedEvent && (
        <EventDetailDrawer
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onGenerateBrief={() => setShowGenerateBriefModal(true)}
        />
      )}

      {/* Generate Brief Modal */}
      {showGenerateBriefModal && selectedEvent && (
        <GenerateEventBriefModal
          event={selectedEvent}
          onClose={() => setShowGenerateBriefModal(false)}
        />
      )}
    </PageLayout>
  );
}
