import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Chip } from '../ui/Chip';
import { CalendarEvent } from './CalendarPage';
import { Clock, MapPin, FileText } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DayAgendaProps {
  selectedDay: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function DayAgenda({ selectedDay, events, onEventClick }: DayAgendaProps) {
  const { isDarkMode } = useTheme();

  const dayEvents = events.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getDate() === selectedDay.getDate() &&
      eventDate.getMonth() === selectedDay.getMonth() &&
      eventDate.getFullYear() === selectedDay.getFullYear()
    );
  }).sort((a, b) => a.date.getTime() - b.date.getTime());

  const getEventTypeIcon = (type: string) => {
    const iconMap: { [key: string]: string } = {
      Hearing: '⚖️',
      Meeting: '👥',
      Deadline: '⏰',
      Networking: '🤝',
    };
    return iconMap[type] || '📅';
  };

  const dateString = selectedDay.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className={`p-5 rounded-lg backdrop-blur-xl border transition-all ${
      isDarkMode
        ? 'bg-slate-800/40 border-white/10'
        : 'bg-white/80 border-gray-200'
    } shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`mb-1 font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Day Agenda</h3>
          <p className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>{dateString}</p>
        </div>
        <Chip variant="info" size="sm">
          {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
        </Chip>
      </div>

      {dayEvents.length === 0 ? (
        <div className={`text-center py-8 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>No events scheduled for this day</p>
          <Button variant="link" size="sm" className="mt-2">
            Add Event
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-700/30 border-white/10 hover:border-red-500/50'
                  : 'bg-white border-gray-200 hover:border-red-300'
              }`}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>{event.title}</h4>
                      <div className={`flex items-center gap-3 text-sm mt-1 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={14} />
                          {event.location}
                        </span>
                      </div>
                    </div>
                    <Chip
                      variant={event.priority === 'High' ? 'error' : event.priority === 'Medium' ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {event.priority || 'Low'}
                    </Chip>
                  </div>

                  {/* Linked Objects */}
                  {(event.linkedObjects.bills?.length || event.linkedObjects.issues?.length || event.linkedObjects.people?.length) && (
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {event.linkedObjects.bills?.map((bill) => (
                        <Chip key={bill} variant="info" size="sm">{bill}</Chip>
                      ))}
                      {event.linkedObjects.issues?.map((issue) => (
                        <Chip key={issue} variant="neutral" size="sm">{issue}</Chip>
                      ))}
                      {event.linkedObjects.people?.map((person) => (
                        <Chip key={person} variant="info" size="sm">{person}</Chip>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      Open
                    </Button>
                    {(event.type === 'Hearing' || event.type === 'Meeting') && (
                      <Button variant="accent" size="sm">
                        <FileText size={14} />
                        Generate Brief
                      </Button>
                    )}
                    <div className="ml-auto flex items-center gap-2">
                      <Chip
                        variant={
                          event.prepStatus === 'Ready'
                            ? 'success'
                            : event.prepStatus === 'Draft brief'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {event.prepStatus}
                      </Chip>
                      {event.recordStatus === 'Not logged' && (
                        <Chip variant="warning" size="sm">
                          Not logged
                        </Chip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}