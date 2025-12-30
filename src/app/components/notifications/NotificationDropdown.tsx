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
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

export type NotificationCategory = 'Compliance' | 'Legislation' | 'Relationship' | 'Records' | 'Intel' | 'Tasks' | 'Calendar';
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
};

const priorityColors = {
  Urgent: 'bg-red-500',
  ActionNeeded: 'bg-amber-500',
  Info: 'bg-gray-400',
};

export const NotificationDropdown = forwardRef<HTMLDivElement, NotificationDropdownProps>(({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onSnooze,
  onMute,
  onOpenSettings,
  onNotificationClick,
}, ref) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Group notifications
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groupedNotifications = {
    Urgent: notifications.filter(n => n.priority === 'Urgent').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    ActionNeeded: notifications.filter(n => n.priority === 'ActionNeeded').sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    Today: notifications.filter(n => n.priority === 'Info' && n.timestamp >= today).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    ThisWeek: notifications.filter(n => n.priority === 'Info' && n.timestamp < today && n.timestamp >= weekAgo).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    Older: notifications.filter(n => n.priority === 'Info' && n.timestamp < weekAgo).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
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
        className={`p-3 border-b border-gray-100 hover:bg-gray-50 transition-all cursor-pointer ${
          !notification.read ? 'bg-blue-50/30' : ''
        }`}
        onClick={() => onNotificationClick(notification)}
      >
        <div className="flex items-start gap-3">
          {/* Icon & Priority Dot */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="text-gray-600">
              {categoryIcons[notification.category]}
            </div>
            <div className={`w-2 h-2 rounded-full ${priorityColors[notification.priority]}`}></div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-semibold text-gray-900 text-sm">{notification.title}</h4>
              <span className="text-xs text-gray-500 flex-shrink-0">{formatTime(notification.timestamp)}</span>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1 mb-2">{notification.message}</p>

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
                    className="text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 text-gray-700 transition-all"
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
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700 transition-all"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && openMenuId === notification.id && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  {notification.read ? <X size={14} /> : <Check size={14} />}
                  {notification.read ? 'Mark as unread' : 'Mark as read'}
                </button>

                <div className="border-t border-gray-100">
                  <div className="px-3 py-1.5 text-xs text-gray-500">Snooze</div>
                  {['1 hour', 'Tomorrow', 'Next week'].map((duration) => (
                    <button
                      key={duration}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSnooze(notification.id, duration);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 pl-6"
                    >
                      <Clock size={14} />
                      {duration}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100">
                  <div className="px-3 py-1.5 text-xs text-gray-500">Mute</div>
                  {getMuteOptions(notification.category).map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        onMute(notification.id, option);
                        setShowMenu(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 pl-6"
                    >
                      <BellOff size={14} />
                      {option}
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSettings();
                      setShowMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
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
      default:
        return ['This category'];
    }
  };

  const hasNotifications = notifications.length > 0;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-gray-200 rounded shadow-xl max-h-[600px] overflow-hidden flex flex-col z-[100]" ref={ref}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {hasNotifications && (
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1">
        {!hasNotifications ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Check size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No new notifications</p>
          </div>
        ) : (
          <>
            {groupedNotifications.Urgent.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-red-50 border-b border-red-100">
                  <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Urgent</span>
                </div>
                {groupedNotifications.Urgent.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.ActionNeeded.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-amber-50 border-b border-amber-100">
                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Action Needed</span>
                </div>
                {groupedNotifications.ActionNeeded.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.Today.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Today</span>
                </div>
                {groupedNotifications.Today.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.ThisWeek.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">This Week</span>
                </div>
                {groupedNotifications.ThisWeek.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}

            {groupedNotifications.Older.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Older</span>
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
});

NotificationDropdown.displayName = 'NotificationDropdown';