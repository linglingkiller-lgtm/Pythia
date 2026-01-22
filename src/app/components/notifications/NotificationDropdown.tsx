import React, { useState, forwardRef } from 'react';
import { 
  FileCheck, 
  FileText, 
  Users, 
  Database, 
  Brain, 
  CheckSquare, 
  Calendar as CalendarIcon,
  MoreVertical,
  Clock,
  BellOff,
  Check,
  X,
  Filter,
  Vote,
  Briefcase,
  Settings as SettingsIcon,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export type NotificationCategory = 'Compliance' | 'Legislation' | 'Relationship' | 'Records' | 'Intel' | 'Tasks' | 'Calendar' | 'Elections' | 'ClientWork' | 'WarRoom';
export type NotificationPriority = 'Info' | 'ActionNeeded' | 'Urgent';

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  timestamp: Date;
  read: boolean;
  links?: {
    type: 'bill' | 'person' | 'record' | 'task';
    id: string;
  };
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onSnooze: (id: string, duration: string) => void;
  onMute: (id: string, muteType: string) => void;
  onOpenSettings: () => void;
  onNotificationClick: (notification: Notification) => void;
}

const categoryIcons: Record<NotificationCategory, React.ReactNode> = {
  Compliance: <FileCheck size={16} />,
  Legislation: <FileText size={16} />,
  Relationship: <Users size={16} />,
  Records: <Database size={16} />,
  Intel: <Brain size={16} />,
  Tasks: <CheckSquare size={16} />,
  Calendar: <CalendarIcon size={16} />,
  Elections: <Vote size={16} />,
  ClientWork: <Briefcase size={16} />,
  WarRoom: <SettingsIcon size={16} />,
};

export const NotificationDropdown = forwardRef<HTMLDivElement, NotificationDropdownProps>((({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSnooze,
  onMute,
  onOpenSettings,
  onNotificationClick,
}, ref) => {
  const { isDarkMode } = useTheme();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [filterPriority, setFilterPriority] = useState<NotificationPriority | 'All'>('All');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter notifications
  const filteredNotifications = filterPriority === 'All' 
    ? notifications 
    : notifications.filter(n => n.priority === filterPriority);

  // Group notifications
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groupedNotifications = {
    Urgent: filteredNotifications.filter(n => n.priority === 'Urgent').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    ActionNeeded: filteredNotifications.filter(n => n.priority === 'ActionNeeded').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    Today: filteredNotifications.filter(n => n.priority === 'Info' && n.timestamp >= today).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    ThisWeek: filteredNotifications.filter(n => n.priority === 'Info' && n.timestamp < today && n.timestamp >= weekAgo).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    Older: filteredNotifications.filter(n => n.priority === 'Info' && n.timestamp < weekAgo).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
  };

  const formatTime = (timestamp: Date) => {
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const [showMenu, setShowMenu] = useState(false);

    return (
      <div
        className={`
          relative p-4 border-b transition-all duration-300 cursor-pointer group
          ${isDarkMode 
            ? 'border-white/5 hover:bg-white/[0.02]' 
            : 'border-gray-100 hover:bg-gray-50/50'
          }
          ${!notification.read 
            ? isDarkMode 
              ? 'bg-red-500/5' 
              : 'bg-red-50/30' 
            : ''
          }
        `}
        onClick={() => onNotificationClick(notification)}
      >
        <div className="flex items-start gap-3">
          {/* Icon & Priority Indicator */}
          <div className="flex-shrink-0 flex items-center gap-2.5">
            {/* Category Icon */}
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-300
              ${isDarkMode 
                ? 'bg-slate-800/50 text-gray-400 group-hover:bg-slate-700/50 group-hover:text-gray-300' 
                : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-700'
              }
            `}>
              {categoryIcons[notification.category]}
            </div>
            
            {/* Priority Dot */}
            <div className={`
              w-2 h-2 rounded-full flex-shrink-0
              ${notification.priority === 'Urgent' 
                ? 'bg-red-500 shadow-lg shadow-red-500/50' 
                : notification.priority === 'ActionNeeded' 
                  ? 'bg-amber-500 shadow-lg shadow-amber-500/50' 
                  : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
              }
            `}></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <h4 className={`
                font-semibold text-sm transition-colors duration-300
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                {notification.title}
              </h4>
              <span className={`
                text-xs flex-shrink-0 transition-colors duration-300
                ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}
              `}>
                {formatTime(notification.timestamp)}
              </span>
            </div>
            
            <p className={`
              text-sm line-clamp-2 mb-3 transition-colors duration-300
              ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
            `}>
              {notification.message}
            </p>

            {/* Actions */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {notification.actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className={`
                      text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200
                      ${isDarkMode 
                        ? 'bg-slate-800/50 border border-white/10 text-gray-300 hover:bg-slate-700/60 hover:border-white/20' 
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
                setOpenMenuId(showMenu ? null : notification.id);
              }}
              className={`
                p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
                ${isDarkMode 
                  ? 'hover:bg-white/10 text-gray-500 hover:text-gray-300' 
                  : 'hover:bg-gray-200 text-gray-400 hover:text-gray-700'
                }
              `}
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && openMenuId === notification.id && (
              <div className={`
                absolute right-0 top-full mt-1 w-48 rounded-xl shadow-2xl backdrop-blur-xl z-[150] overflow-hidden border
                ${isDarkMode 
                  ? 'bg-slate-900/95 border-white/10' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                    setShowMenu(false);
                  }}
                  className={`
                    w-full px-3 py-2.5 text-left text-sm flex items-center gap-2 transition-colors duration-200
                    ${isDarkMode 
                      ? 'text-gray-300 hover:bg-white/5' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {notification.read ? <X size={14} /> : <Check size={14} />}
                  {notification.read ? 'Mark as unread' : 'Mark as read'}
                </button>

                <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className={`px-3 py-2 text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Snooze
                  </div>
                  {['1 hour', 'Tomorrow', 'Next week'].map((duration) => (
                    <button
                      key={duration}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(notification.id, duration);
                        setShowMenu(false);
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm flex items-center gap-2 pl-6 transition-colors duration-200
                        ${isDarkMode 
                          ? 'text-gray-400 hover:bg-white/5 hover:text-gray-300' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <Clock size={14} />
                      {duration}
                    </button>
                  ))}
                </div>

                <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className={`px-3 py-2 text-xs font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Mute
                  </div>
                  {getMuteOptions(notification.category).map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMute(notification.id, option);
                        setShowMenu(false);
                      }}
                      className={`
                        w-full px-3 py-2 text-left text-sm flex items-center gap-2 pl-6 transition-colors duration-200
                        ${isDarkMode 
                          ? 'text-gray-400 hover:bg-white/5 hover:text-gray-300' 
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }
                      `}
                    >
                      <BellOff size={14} />
                      {option}
                    </button>
                  ))}
                </div>

                <div className={`border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSettings();
                      setShowMenu(false);
                    }}
                    className={`
                      w-full px-3 py-2.5 text-left text-sm transition-colors duration-200
                      ${isDarkMode 
                        ? 'text-gray-300 hover:bg-white/5' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    Notification settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getMuteOptions = (category: NotificationCategory): string[] => {
    switch (category) {
      case 'Legislation':
        return ['This bill', 'This issue'];
      case 'Relationship':
        return ['This legislator', 'This organization'];
      case 'Compliance':
        return ['This type of deadline'];
      case 'Elections':
        return ['This race', 'This candidate'];
      case 'ClientWork':
        return ['This client', 'This project'];
      case 'WarRoom':
        return ['This campaign', 'This alert type'];
      default:
        return ['This category'];
    }
  };

  const hasNotifications = filteredNotifications.length > 0;

  return (
    <div 
      className={`
        absolute right-0 top-full mt-2 w-[420px] rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col z-[100] border max-h-[600px]
        ${isDarkMode 
          ? 'bg-slate-900/95 border-white/10' 
          : 'bg-white/95 border-gray-200'
        }
      `}
      ref={ref}
    >
      {/* Header */}
      <div className={`
        px-5 py-4 border-b flex items-center justify-between transition-colors duration-300
        ${isDarkMode ? 'border-white/10 bg-slate-800/30' : 'border-gray-200 bg-gray-50/50'}
      `}>
        <h3 className={`
          font-semibold transition-colors duration-300
          ${isDarkMode ? 'text-white' : 'text-gray-900'}
        `}>
          Notifications
        </h3>
        
        <div className="flex items-center gap-2">
          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                ${isDarkMode 
                  ? 'bg-slate-800/50 text-gray-400 hover:bg-slate-700/60 hover:text-gray-300 border border-white/10' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-200'
                }
              `}
            >
              <Filter size={14} />
              {filterPriority === 'All' ? 'All' : filterPriority}
              <ChevronDown size={12} />
            </button>

            {showFilterMenu && (
              <div className={`
                absolute right-0 top-full mt-1 w-40 rounded-xl shadow-2xl backdrop-blur-xl z-[150] overflow-hidden border
                ${isDarkMode 
                  ? 'bg-slate-900/95 border-white/10' 
                  : 'bg-white/95 border-gray-200'
                }
              `}>
                {(['All', 'Urgent', 'ActionNeeded', 'Info'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => {
                      setFilterPriority(priority);
                      setShowFilterMenu(false);
                    }}
                    className={`
                      w-full px-3 py-2 text-left text-sm transition-colors duration-200 flex items-center gap-2
                      ${filterPriority === priority 
                        ? isDarkMode 
                          ? 'bg-red-500/10 text-red-400' 
                          : 'bg-red-50 text-red-700'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-white/5' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    {filterPriority === priority && <Check size={14} />}
                    <span className={filterPriority !== priority ? 'ml-5' : ''}>
                      {priority === 'ActionNeeded' ? 'Action Needed' : priority}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mark All as Read */}
          {hasNotifications && (
            <button
              onClick={onMarkAllAsRead}
              className={`
                text-xs font-medium transition-colors duration-200
                ${isDarkMode 
                  ? 'text-red-400 hover:text-red-300' 
                  : 'text-red-600 hover:text-red-700'
                }
              `}
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className={`
              w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors duration-300
              ${isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'}
            `}>
              <Check size={24} className={isDarkMode ? 'text-gray-600' : 'text-gray-400'} />
            </div>
            <p className={`
              font-medium transition-colors duration-300
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `}>
              {filterPriority === 'All' ? 'No new notifications' : `No ${filterPriority === 'ActionNeeded' ? 'Action Needed' : filterPriority} notifications`}
            </p>
            <p className={`
              text-sm mt-1 transition-colors duration-300
              ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}
            `}>
              You're all caught up!
            </p>
          </div>
        ) : (
          <>
            {groupedNotifications.Urgent.length > 0 && (
              <div>
                <div className={`
                  px-5 py-2.5 border-b transition-colors duration-300
                  ${isDarkMode 
                    ? 'bg-red-500/10 border-red-500/20' 
                    : 'bg-red-50 border-red-100'
                  }
                `}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wide transition-colors duration-300
                    ${isDarkMode ? 'text-red-400' : 'text-red-700'}
                  `}>
                    Urgent
                  </span>
                </div>
                {groupedNotifications.Urgent.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.ActionNeeded.length > 0 && (
              <div>
                <div className={`
                  px-5 py-2.5 border-b transition-colors duration-300
                  ${isDarkMode 
                    ? 'bg-amber-500/10 border-amber-500/20' 
                    : 'bg-amber-50 border-amber-100'
                  }
                `}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wide transition-colors duration-300
                    ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}
                  `}>
                    Action Needed
                  </span>
                </div>
                {groupedNotifications.ActionNeeded.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.Today.length > 0 && (
              <div>
                <div className={`
                  px-5 py-2.5 border-b transition-colors duration-300
                  ${isDarkMode 
                    ? 'bg-slate-800/30 border-white/5' 
                    : 'bg-gray-50 border-gray-100'
                  }
                `}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wide transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Today
                  </span>
                </div>
                {groupedNotifications.Today.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.ThisWeek.length > 0 && (
              <div>
                <div className={`
                  px-5 py-2.5 border-b transition-colors duration-300
                  ${isDarkMode 
                    ? 'bg-slate-800/30 border-white/5' 
                    : 'bg-gray-50 border-gray-100'
                  }
                `}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wide transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    This Week
                  </span>
                </div>
                {groupedNotifications.ThisWeek.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.Older.length > 0 && (
              <div>
                <div className={`
                  px-5 py-2.5 border-b transition-colors duration-300
                  ${isDarkMode 
                    ? 'bg-slate-800/30 border-white/5' 
                    : 'bg-gray-50 border-gray-100'
                  }
                `}>
                  <span className={`
                    text-xs font-semibold uppercase tracking-wide transition-colors duration-300
                    ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    Older
                  </span>
                </div>
                {groupedNotifications.Older.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}) as any);

NotificationDropdown.displayName = 'NotificationDropdown';