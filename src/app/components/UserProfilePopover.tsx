import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Phone, Building, MapPin, Calendar, Copy, LogOut, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { copyToClipboard } from '../utils/clipboard';

interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  coverPhotoUrl?: string;
  initials: string;
  email: string;
  phone?: string;
  location?: string;
  timezone?: string;
  status?: 'available' | 'meeting' | 'focus';
  teams?: string[];
}

interface WorkStats {
  openTasksCount: number;
  dueThisWeekCount: number;
  overdueCount: number;
  activeIssuesCount?: number;
}

interface RecentActivity {
  type: 'call' | 'meeting' | 'email' | 'note' | 'brief' | 'task';
  title: string;
  timestamp: string;
  linkedObjectType?: string;
  linkedObjectId?: string;
}

interface UpcomingEvent {
  startTime: string;
  title: string;
  location?: string;
  prepStatus: 'ready' | 'needs-brief';
}

interface UserProfilePopoverProps {
  user: UserProfile;
  workStats: WorkStats;
  recentActivity: RecentActivity[];
  upcomingEvents: UpcomingEvent[];
  currentFocus: string[];
  internalNotes: string;
  position: { x: number; y: number };
  context?: {
    type: 'action-queue' | 'record' | 'bill';
    label?: string;
  };
  onClose: () => void;
  onAssignTask: () => void;
  onViewCalendar: () => void;
  onScheduleMeeting: () => void;
  onEditNotes: () => void;
}

export function UserProfilePopover({
  user,
  workStats,
  recentActivity,
  upcomingEvents,
  currentFocus,
  internalNotes,
  position,
  context,
  onClose,
  onAssignTask,
  onViewCalendar,
  onScheduleMeeting,
  onEditNotes,
}: UserProfilePopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Smart positioning - adjust if popover would clip off-screen
  useEffect(() => {
    // Use the position passed in directly - ActionQueue now centers it
    setAdjustedPosition(position);
  }, [position]);

  // Handle escape key and click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Add slight delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    document.addEventListener('keydown', handleEscape);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 text-white';
      case 'meeting':
        return 'bg-amber-500 text-white';
      case 'focus':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'meeting':
        return 'In meeting';
      case 'focus':
        return 'Focus time';
      default:
        return 'Offline';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone size={14} className="text-blue-600" />;
      case 'meeting':
        return <Video size={14} className="text-purple-600" />;
      case 'email':
        return <Mail size={14} className="text-gray-600" />;
      case 'note':
        return <FileText size={14} className="text-amber-600" />;
      case 'brief':
        return <Briefcase size={14} className="text-red-600" />;
      case 'task':
        return <CheckCircle2 size={14} className="text-green-600" />;
      default:
        return <FileText size={14} className="text-gray-600" />;
    }
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      className="fixed bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
      style={{
        left: '50%',
        top: '55%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        maxHeight: '500px',
        zIndex: 99999,
      }}
    >
      <div className="overflow-y-auto max-h-[500px]">
        {/* Context Banner (if applicable) */}
        {context && (
          <div className="bg-red-50 border-b border-red-100 px-4 py-2 text-xs text-red-800">
            {context.type === 'action-queue' && (
              <div className="flex items-center justify-between">
                <span>You're viewing: {user.name}'s tasks</span>
                <button className="text-red-600 hover:text-red-700 underline">
                  Show all {user.initials} tasks
                </button>
              </div>
            )}
            {context.type === 'record' && context.label && (
              <div className="flex items-center justify-between">
                <span>Last touched: {context.label}</span>
                <button className="text-red-600 hover:text-red-700 underline">
                  Open record
                </button>
              </div>
            )}
          </div>
        )}

        {/* A) Header Strip */}
        <div className="relative border-b border-gray-200 overflow-hidden">
          {/* Cover Photo */}
          <div 
            className="absolute inset-0 h-full w-full"
            style={{
              backgroundImage: user.coverPhotoUrl ? `url(${user.coverPhotoUrl})` : 'url(https://images.unsplash.com/photo-1698273191530-7e67cc8e282d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcml6b25hJTIwY2FwaXRvbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2NjA1MzE5M3ww&ixlib=rb-4.1.0&q=80&w=1080)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
            }}
          />
          
          {/* Content */}
          <div className="relative p-4 bg-gradient-to-b from-white/90 to-white/95">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center font-semibold flex-shrink-0 border-2 border-white shadow-md">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user.initials
                  )}
                </div>

                {/* Name & Role */}
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.title}</p>
                  {/* Location/Timezone */}
                  {(user.location || user.timezone) && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                      <MapPin size={12} />
                      <span>
                        {user.location}
                        {user.location && user.timezone && ' '}
                        {user.timezone && `(${user.timezone})`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Status & Close */}
              <div className="flex items-center gap-2">
                {user.status && (
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(user.status)}`}>
                    {getStatusLabel(user.status)}
                  </span>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Team Tags */}
            {user.teams && user.teams.length > 0 && (
              <div className="flex flex-wrap gap-1 ml-[60px]">
                {user.teams.map((team) => (
                  <span key={team} className="text-xs px-2 py-0.5 bg-white border border-gray-300 text-gray-700 rounded">
                    {team}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* B) Contact & Quick Actions */}
        <div className="p-4 border-b border-gray-200 bg-white">
          {/* Contact Fields */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            {/* Email */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail size={14} />
                <span className="truncate">{user.email}</span>
              </div>
              <button
                onClick={() => handleCopy(user.email, 'email')}
                className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
                title="Copy email"
              >
                {copiedField === 'email' ? (
                  <CheckCircle2 size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={14} />
                  <span>{user.phone}</span>
                </div>
                <button
                  onClick={() => handleCopy(user.phone!, 'phone')}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-2"
                  title="Copy phone"
                >
                  {copiedField === 'phone' ? (
                    <CheckCircle2 size={14} className="text-green-600" />
                  ) : (
                    <Copy size={14} className="text-gray-600" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onAssignTask}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
              title="Assign Task"
            >
              <UserPlus size={16} />
              <span>Assign Task</span>
            </button>
            <button
              onClick={onViewCalendar}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm"
              title="View Calendar"
            >
              <Calendar size={16} />
              <span>Calendar</span>
            </button>
            <button
              onClick={onScheduleMeeting}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
              title="Schedule Meeting"
            >
              <CalendarPlus size={16} />
              <span>Schedule</span>
            </button>
          </div>

          {copiedField && (
            <div className="mt-2 text-xs text-green-600 text-center">
              ✓ Copied to clipboard
            </div>
          )}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-2 divide-x divide-gray-200">
          {/* Left Column */}
          <div>
            {/* C) Workload Snapshot */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Workload</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="text-lg font-semibold text-gray-900">{workStats.openTasksCount}</div>
                  <div className="text-xs text-gray-600">Open</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center cursor-pointer hover:bg-gray-100 transition-colors">
                  <div className="text-lg font-semibold text-gray-900">{workStats.dueThisWeekCount}</div>
                  <div className="text-xs text-gray-600">Due</div>
                </div>
                <div className={`p-2 rounded text-center cursor-pointer transition-colors ${
                  workStats.overdueCount > 0 ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                }`}>
                  <div className={`text-lg font-semibold ${workStats.overdueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {workStats.overdueCount}
                  </div>
                  <div className={`text-xs ${workStats.overdueCount > 0 ? 'text-red-600' : 'text-gray-600'}`}>
                    Late
                  </div>
                </div>
              </div>
              {workStats.activeIssuesCount !== undefined && (
                <div className="mt-2 bg-blue-50 p-2 rounded text-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <span className="text-lg font-semibold text-blue-600">{workStats.activeIssuesCount}</span>
                  <span className="text-xs text-blue-600 ml-2">Active issues</span>
                </div>
              )}
            </div>

            {/* E) Current Focus / Assignments */}
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Current Focus</h4>
              <div className="flex flex-wrap gap-2">
                {currentFocus.map((item, index) => (
                  <button
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* D) Recent Activity */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Recent Activity</h4>
              <div className="space-y-2">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={index} className="flex items-start justify-between text-sm hover:bg-gray-50 p-2 rounded transition-colors">
                    <div className="flex items-start gap-2 flex-1">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-900 truncate">{activity.title}</div>
                        <div className="text-xs text-gray-500">{activity.timestamp}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* F) Calendar Preview */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase">Upcoming</h4>
                <button
                  onClick={onViewCalendar}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  View all
                </button>
              </div>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 2).map((event, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-600">{event.startTime}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ml-auto ${
                        event.prepStatus === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {event.prepStatus === 'ready' ? 'Ready' : 'Needs brief'}
                      </span>
                    </div>
                    <div className="font-medium text-gray-900 text-xs">{event.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popoverContent, document.body);
}