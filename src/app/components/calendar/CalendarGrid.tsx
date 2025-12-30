import React from 'react';
import { CalendarEvent } from './CalendarPage';
import { Chip } from '../ui/Chip';
import { useTheme } from '../../contexts/ThemeContext';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  viewMode: 'Month' | 'Week' | 'Agenda';
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedDay: Date | null;
}

export function CalendarGrid({
  currentDate,
  events,
  viewMode,
  onDayClick,
  onEventClick,
  selectedDay,
}: CalendarGridProps) {
  if (viewMode === 'Agenda') {
    return <AgendaView events={events} onEventClick={onEventClick} />;
  }

  if (viewMode === 'Week') {
    return <WeekView currentDate={currentDate} events={events} onEventClick={onEventClick} />;
  }

  return <MonthView currentDate={currentDate} events={events} onDayClick={onDayClick} onEventClick={onEventClick} selectedDay={selectedDay} />;
}

function MonthView({
  currentDate,
  events,
  onDayClick,
  onEventClick,
  selectedDay,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (day: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  selectedDay: Date | null;
}) {
  const { isDarkMode } = useTheme();
  
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty cells for days before the month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getEventsForDay = (day: Date | null) => {
    if (!day) return [];
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  const getEventTypeColor = (type: string) => {
    if (isDarkMode) {
      switch (type) {
        case 'Hearing':
          return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'Meeting':
          return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'Deadline':
          return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        case 'Networking':
          return 'bg-green-500/20 text-green-300 border-green-500/30';
        default:
          return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    } else {
      switch (type) {
        case 'Hearing':
          return 'bg-red-100 text-red-700 border-red-200';
        case 'Meeting':
          return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'Deadline':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'Networking':
          return 'bg-green-100 text-green-700 border-green-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  const isToday = (day: Date | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: Date | null) => {
    if (!day || !selectedDay) return false;
    return (
      day.getDate() === selectedDay.getDate() &&
      day.getMonth() === selectedDay.getMonth() &&
      day.getFullYear() === selectedDay.getFullYear()
    );
  };

  const days = getDaysInMonth();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((day) => (
          <div key={day} className={`text-center text-sm font-medium py-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const hasMoreEvents = dayEvents.length > 2;
          const displayEvents = dayEvents.slice(0, 2);

          return (
            <div
              key={index}
              onClick={() => day && onDayClick(day)}
              className={`
                min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all
                ${day 
                  ? isDarkMode
                    ? 'bg-slate-700/30 hover:bg-slate-700/50 border-white/10'
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                  : isDarkMode
                  ? 'bg-slate-800/20 border-white/5'
                  : 'bg-gray-50/50 border-gray-200'
                }
                ${isToday(day) 
                  ? isDarkMode
                    ? 'border-red-500/60 border-2 ring-2 ring-red-500/20'
                    : 'border-red-500 border-2'
                  : ''
                }
                ${isSelected(day) 
                  ? isDarkMode
                    ? 'ring-2 ring-orange-500/50'
                    : 'ring-2 ring-red-500'
                  : ''
                }
              `}
            >
              {day && (
                <>
                  <div className={`text-sm font-medium mb-2 ${
                    isToday(day) 
                      ? isDarkMode ? 'text-red-400' : 'text-red-600'
                      : isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {displayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className={`text-xs p-1 rounded border truncate ${getEventTypeColor(event.type)}`}
                      >
                        {event.time} {event.title}
                      </div>
                    ))}
                    {hasMoreEvents && (
                      <div className={`text-xs font-medium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  currentDate,
  events,
  onEventClick,
}: {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="mb-2">Week view coming soon</p>
      <p className="text-sm">Time-block layout for detailed weekly planning</p>
    </div>
  );
}

function AgendaView({
  events,
  onEventClick,
}: {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}) {
  const sortedEvents = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());

  const groupedEvents: { [key: string]: CalendarEvent[] } = {};
  sortedEvents.forEach((event) => {
    const dateKey = event.date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Hearing':
        return 'bg-red-100 text-red-700';
      case 'Meeting':
        return 'bg-blue-100 text-blue-700';
      case 'Deadline':
        return 'bg-amber-100 text-amber-700';
      case 'Networking':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPrepStatusColor = (status: string) => {
    switch (status) {
      case 'Ready':
        return 'success';
      case 'Draft brief':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([date, dayEvents]) => (
        <div key={date}>
          <h4 className="text-sm font-medium text-gray-900 mb-3">{date}</h4>
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event)}
                className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className={`px-3 py-1 rounded text-xs font-medium ${getEventTypeColor(event.type)}`}>
                  {event.type}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  <div className="text-sm text-gray-500">
                    {event.time} • {event.location}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip variant={getPrepStatusColor(event.prepStatus) as any} size="sm">
                    {event.prepStatus}
                  </Chip>
                  {event.recordStatus === 'Not logged' && (
                    <Chip variant="warning" size="sm">
                      No record
                    </Chip>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}