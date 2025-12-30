import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Bell, ChevronDown, LogOut, User, Settings, Sparkles } from 'lucide-react';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';
import { NotificationDropdown } from './notifications/NotificationDropdown';
import { NotificationSettings } from './notifications/NotificationSettings';
import { ProfileCustomizationModal, ProfileUpdates } from './profile/ProfileCustomizationModal';
import { sampleNotifications } from '../data/sampleNotifications';
import type { Notification } from './notifications/NotificationDropdown';
import { useAuth } from '../contexts/AuthContext';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';
import { useAppMode } from '../contexts/AppModeContext';
import { useAskPythia } from '../contexts/AskPythiaContext';
import { useTheme } from '../contexts/ThemeContext';

export function TopHeader() {
  const { currentUser, logout } = useAuth();
  const { signOut: supabaseSignOut } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const { openPythia } = useAskPythia();
  const { isDarkMode } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(avatarImage);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showNotifications || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showUserMenu]);

  // Calculate badge count (Urgent + Action Needed only)
  const badgeCount = notifications.filter(
    n => !n.read && (n.priority === 'Urgent' || n.priority === 'ActionNeeded')
  ).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSnooze = (id: string, duration: string) => {
    console.log(`Snoozing notification ${id} for ${duration}`);
    // In a real app, this would hide the notification and re-show it later
  };

  const handleMute = (id: string, muteType: string) => {
    console.log(`Muting ${muteType} for notification ${id}`);
    // In a real app, this would create a mute rule
  };

  const handleNotificationClick = (notification: Notification) => {
    console.log('Opening notification:', notification);
    handleMarkAsRead(notification.id);
    setShowNotifications(false);
    // In a real app, this would navigate to the linked resource
  };

  const handleOpenSettings = () => {
    setShowNotifications(false);
    setShowSettings(true);
  };

  const handleUserMenuClick = () => {
    const button = userButtonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
    }
    setShowUserMenu(!showUserMenu);
  };

  const handleProfileUpdate = (updates: ProfileUpdates) => {
    // Update avatar if changed
    if (updates.avatarUrl) {
      setUserAvatar(updates.avatarUrl);
    }
    // In a real app, this would update the user in the database
    console.log('Profile updated:', updates);
  };

  return (
    <div 
      className={`
        sticky top-0 z-[100] h-16 backdrop-blur-xl border-b px-6 flex items-center justify-between shadow-sm transition-colors duration-300
        ${isDarkMode 
          ? 'bg-slate-900/90 border-white/10' 
          : 'bg-white/80 border-gray-200'
        }
      `}
    >
      {/* Left: Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search 
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search bills, legislators, issues, clients..."
            className={`
              w-full border rounded-xl pl-12 pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/30 transition-all text-sm
              ${isDarkMode 
                ? 'bg-slate-800 border-white/10 text-white focus:border-red-500 focus:bg-slate-800' 
                : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-[#8B1538] focus:bg-white'
              }
            `}
          />
        </div>
      </div>
      
      {/* Right: Controls */}
      <div className="flex items-center gap-3 ml-6">
        {/* Ask Revere Button - Branded gradient */}
        <button
          onClick={() => openPythia()}
          className={`
            flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:scale-105
            ${isDarkMode
              ? 'bg-gradient-to-r from-red-600 via-red-700 to-blue-700 hover:from-red-700 hover:via-red-800 hover:to-blue-800 text-white'
              : 'bg-gradient-to-r from-[#8B1538] via-[#A41B43] to-[#1E3A8A] hover:from-[#6B0F2A] hover:via-[#8B1538] hover:to-[#1E3A8A] text-white'
            }
          `}
          title="Ask Revere (⌘K)"
          style={{ fontFamily: '"Corpline", sans-serif' }}
        >
          <Sparkles size={18} />
          <span className="text-sm">Ask Revere</span>
        </button>

        {/* Jurisdiction Selector */}
        <button 
          className={`
            flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all shadow-sm
            ${isDarkMode 
              ? 'bg-slate-800 border-white/10 text-gray-200 hover:bg-slate-700 hover:border-white/20' 
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }
          `}
        >
          <span className="text-sm font-medium">Arizona</span>
          <ChevronDown size={16} />
        </button>
        
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            ref={notificationButtonRef}
            className={`
              relative p-2.5 border rounded-xl transition-all shadow-sm
              ${isDarkMode 
                ? 'bg-slate-800 border-white/10 text-gray-300 hover:text-white hover:bg-slate-700 hover:border-white/20' 
                : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
              }
            `}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {badgeCount > 0 && (
              <span 
                className={`
                  absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center
                  ${isDarkMode ? 'bg-red-600' : 'bg-[#8B1538]'}
                `}
              >
                {badgeCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onSnooze={handleSnooze}
              onMute={handleMute}
              onNotificationClick={handleNotificationClick}
              onOpenSettings={handleOpenSettings}
            />
          )}
        </div>
        
        {/* User Avatar */}
        <div className="relative" ref={userMenuRef}>
          <button
            ref={userButtonRef}
            onClick={handleUserMenuClick}
            className="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 hover:border-gray-300 transition-all"
          >
            <img src={userAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
            <ChevronDown size={14} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* User Menu Dropdown - rendered as portal */}
      {showUserMenu && createPortal(
        <div 
          ref={userMenuRef}
          className={`
            fixed w-64 rounded-lg shadow-2xl transition-colors duration-500
            ${isDarkMode 
              ? 'bg-slate-800 border border-white/10' 
              : 'bg-white border border-gray-200'
            }
          `}
          style={{ 
            top: `${menuPosition.top + 8}px`, 
            right: `${menuPosition.right}px`,
            zIndex: 99999
          }}
        >
          <div className={`
            p-3 border-b transition-colors duration-500
            ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
          `}>
            <div className={`
              text-sm font-medium transition-colors duration-500
              ${isDarkMode ? 'text-white' : 'text-gray-900'}
            `}>
              {currentUser?.firstName} {currentUser?.lastName}
            </div>
            <div className={`
              text-xs transition-colors duration-500
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}
            `}>{currentUser?.email}</div>
          </div>
          <div className="p-2">
            <button
              onClick={() => {
                setShowProfileModal(true);
                setShowUserMenu(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors duration-500
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-white/5' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <User size={16} />
              Profile & Preferences
            </button>
            <button
              onClick={() => {
                setShowSettings(true);
                setShowUserMenu(false);
              }}
              className={`
                w-full flex items-center gap-2 px-3 py-2 text-sm rounded transition-colors duration-500
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-white/5' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Settings size={16} />
              Notifications
            </button>
            <div className={`
              my-1 border-t transition-colors duration-500
              ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
            `}></div>
            <button
              onClick={async () => {
                if (appMode === 'prod') {
                  await supabaseSignOut();
                } else {
                  logout();
                }
                setShowUserMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Notification Settings */}
      {showSettings && (
        <NotificationSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Profile Customization Modal */}
      {showProfileModal && createPortal(
        <ProfileCustomizationModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdate={handleProfileUpdate}
        />,
        document.body
      )}
    </div>
  );
}