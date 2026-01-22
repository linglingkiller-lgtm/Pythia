import React, { useState } from 'react';
import { Calendar, User, FileText, AlertCircle, CheckCircle, Users, TrendingUp, Mail, Phone, MapPin, Clock, MessageSquare, Edit3, Upload } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'motion/react';
import { TargetData } from './competitive-targets/TargetCard';

interface HistoryTabProps {
  target: TargetData;
}

interface TimelineEvent {
  id: string;
  type: 'milestone' | 'update' | 'alert' | 'activity' | 'note' | 'change';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  metadata?: {
    oldValue?: string;
    newValue?: string;
    metric?: string;
    impact?: string;
  };
}

export function HistoryTab({ target }: HistoryTabProps) {
  const { isDarkMode } = useTheme();
  const [filter, setFilter] = useState<'all' | 'milestones' | 'updates' | 'alerts'>('all');

  // Generate demo timeline events
  const generateTimeline = (): TimelineEvent[] => {
    const now = new Date();
    const events: TimelineEvent[] = [
      {
        id: '1',
        type: 'activity',
        title: 'Daily Door Knocking Report Filed',
        description: '786 doors knocked, 133 surveys completed. Strong performance in northern precincts.',
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        user: 'Sarah Chen'
      },
      {
        id: '2',
        type: 'note',
        title: 'Field Director Added Note',
        description: 'Weekend volunteer turnout exceeded expectations. Planning to maintain expanded Saturday schedule going forward.',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
        user: 'Marcus Rodriguez'
      },
      {
        id: '3',
        type: 'change',
        title: 'Pace Status Updated',
        description: 'Project status changed based on latest performance metrics.',
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
        user: 'System',
        metadata: {
          oldValue: 'Slightly Behind',
          newValue: target.paceStatus === 'on-track' ? 'On Track' : 'Slightly Behind',
          metric: 'Pace Status'
        }
      },
      {
        id: '4',
        type: 'milestone',
        title: '5,000 Doors Milestone Reached',
        description: 'Team surpassed 5,000 total doors knocked. Celebration event scheduled for Friday.',
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        user: 'Campaign Manager'
      },
      {
        id: '5',
        type: 'update',
        title: 'New Volunteer Onboarding',
        description: '8 new volunteers completed training and assigned to evening shift teams.',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        user: 'Volunteer Coordinator'
      },
      {
        id: '6',
        type: 'alert',
        title: 'Weather Alert - Operations Adjusted',
        description: 'Thunderstorm forecast for afternoon. Shifted to phone banking from 2-6pm.',
        timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        user: 'Field Director'
      },
      {
        id: '7',
        type: 'activity',
        title: 'Data Quality Improvement Initiative',
        description: 'Implemented new survey script and training module. Survey completion rate increased from 68% to 82%.',
        timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        user: 'Data Director',
        metadata: {
          metric: 'Survey Completion Rate',
          oldValue: '68%',
          newValue: '82%'
        }
      },
      {
        id: '8',
        type: 'milestone',
        title: 'First Turf Completion',
        description: 'West End neighborhood completed - 100% of registered voters contacted at least once.',
        timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        user: 'Team Lead - West'
      },
      {
        id: '9',
        type: 'update',
        title: 'Route Optimization Implemented',
        description: 'New routing software deployed. Estimated 15% reduction in drive time between doors.',
        timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        user: 'Operations Manager'
      },
      {
        id: '10',
        type: 'change',
        title: 'Staffing Level Adjusted',
        description: 'Added 3 part-time canvassers to address identified gaps in coverage.',
        timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        user: 'HR Coordinator',
        metadata: {
          metric: 'Staff Count',
          oldValue: '15',
          newValue: '18'
        }
      },
      {
        id: '11',
        type: 'activity',
        title: 'Weekend Surge Success',
        description: '1,243 doors knocked on Saturday - highest single-day total to date. 89% volunteer attendance.',
        timestamp: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000), // 9 days ago
        user: 'Weekend Coordinator'
      },
      {
        id: '12',
        type: 'milestone',
        title: 'Project Launch',
        description: `${target.projectName} officially launched. Initial team of 15 canvassers deployed across ${target.geography}.`,
        timestamp: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        user: 'Campaign Manager'
      }
    ];

    return events;
  };

  const timeline = generateTimeline();

  const filteredTimeline = timeline.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'milestones') return event.type === 'milestone';
    if (filter === 'updates') return event.type === 'update' || event.type === 'change';
    if (filter === 'alerts') return event.type === 'alert';
    return true;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <CheckCircle size={18} className="text-green-500" />;
      case 'update': return <TrendingUp size={18} className="text-blue-500" />;
      case 'alert': return <AlertCircle size={18} className="text-amber-500" />;
      case 'activity': return <Users size={18} className="text-purple-500" />;
      case 'note': return <MessageSquare size={18} className="text-cyan-500" />;
      case 'change': return <Edit3 size={18} className="text-indigo-500" />;
      default: return <FileText size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'green';
      case 'update': return 'blue';
      case 'alert': return 'amber';
      case 'activity': return 'purple';
      case 'note': return 'cyan';
      case 'change': return 'indigo';
      default: return 'gray';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg border backdrop-blur-sm p-1 flex items-center gap-1 ${
          isDarkMode
            ? 'bg-slate-800/40 border-white/10'
            : 'bg-white/80 border-gray-200'
        }`}
      >
        {[
          { id: 'all', label: 'All Events', count: timeline.length },
          { id: 'milestones', label: 'Milestones', count: timeline.filter(e => e.type === 'milestone').length },
          { id: 'updates', label: 'Updates', count: timeline.filter(e => e.type === 'update' || e.type === 'change').length },
          { id: 'alerts', label: 'Alerts', count: timeline.filter(e => e.type === 'alert').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`
              flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${filter === tab.id
                ? isDarkMode
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-200'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${
              filter === tab.id
                ? isDarkMode ? 'text-blue-300' : 'text-blue-600'
                : isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Timeline Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Events', value: timeline.length, color: 'blue' },
          { label: 'Milestones Hit', value: timeline.filter(e => e.type === 'milestone').length, color: 'green' },
          { label: 'Active Days', value: '14', color: 'purple' },
          { label: 'Team Members', value: '18', color: 'cyan' }
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`rounded-lg border backdrop-blur-sm p-4 ${
              isDarkMode
                ? 'bg-slate-800/40 border-white/10'
                : 'bg-white/80 border-gray-200'
            }`}
          >
            <div className={`text-xs mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stat.label}
            </div>
            <div className={`text-2xl font-bold text-${stat.color}-500`}>
              {stat.value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline Line */}
        <div className={`absolute left-[21px] top-8 bottom-8 w-0.5 ${
          isDarkMode ? 'bg-gradient-to-b from-blue-500/40 via-purple-500/40 to-transparent' : 'bg-gradient-to-b from-blue-300 via-purple-300 to-transparent'
        }`} />

        <div className="space-y-4">
          {filteredTimeline.map((event, idx) => {
            const color = getEventColor(event.type);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative pl-14"
              >
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-3 w-[42px] h-[42px] rounded-full flex items-center justify-center ${
                  isDarkMode
                    ? `bg-${color}-500/20 border-2 border-${color}-500/40`
                    : `bg-${color}-50 border-2 border-${color}-200`
                }`}>
                  {getEventIcon(event.type)}
                </div>

                {/* Event Card */}
                <div className={`rounded-lg border backdrop-blur-sm p-4 ${
                  isDarkMode
                    ? 'bg-slate-800/40 border-white/10 hover:bg-slate-800/60'
                    : 'bg-white/80 border-gray-200 hover:bg-white'
                } transition-colors`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h5 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {event.title}
                      </h5>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {event.description}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${
                        isDarkMode
                          ? `bg-${color}-500/20 text-${color}-300 border-${color}-500/30`
                          : `bg-${color}-100 text-${color}-700 border-${color}-200`
                      }`}>
                        {event.type}
                      </span>
                    </div>
                  </div>

                  {/* Metadata */}
                  {event.metadata && (
                    <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                      {event.metadata.metric && (
                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <span className="font-medium">{event.metadata.metric}:</span>{' '}
                          {event.metadata.oldValue && (
                            <>
                              <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
                                {event.metadata.oldValue}
                              </span>
                              {' → '}
                            </>
                          )}
                          <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
                            {event.metadata.newValue}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-2">
                      <User size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {event.user || 'Unknown'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatTimeAgo(event.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {filteredTimeline.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-lg border border-dashed backdrop-blur-sm p-12 text-center ${
            isDarkMode
              ? 'bg-slate-800/20 border-slate-700'
              : 'bg-gray-50 border-gray-300'
          }`}
        >
          <FileText className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No {filter !== 'all' ? filter : 'events'} found
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Try selecting a different filter to view other event types
          </p>
        </motion.div>
      )}
    </div>
  );
}
