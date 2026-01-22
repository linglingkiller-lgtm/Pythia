import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LayoutGrid, Users, GitBranch, Search, Bell, Settings, User, Sparkles, Menu, ChevronDown, LogOut, Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { NotificationSettings } from '../notifications/NotificationSettings';
import { ProfileCustomizationModal,WZ } from '../profile/ProfileCustomizationModal';
import { sampleNotifications } from '../../data/sampleNotifications';
import type { Notification } from '../notifications/NotificationDropdown';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

type ViewMode = 'overview' | 'members' | 'committees';

interface LegislatorsHeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export function LegislatorsHeader({ viewMode, setViewMode, scrollContainerRef }: LegislatorsHeaderProps) {
  const { isDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const { signOut: supabaseSignOut } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const { openPythia } = useAskPythia();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(avatarImage);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = React.useState(false);

  // Handle scroll detection locally
  React.useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        // Use a requestAnimationFrame or just set state - React 18 batches well, but specific check avoids spam
        const scrolled = scrollContainerRef.current.scrollTop > 20;
        setIsScrolled(prev => prev !== scrolled ? scrolled : prev);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Trigger once on mount
      handleScroll();
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [scrollContainerRef]); // Re-run if ref changes (unlikely)

  // Click Outside Handlers
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  // Notifications Logic
  const badgeCount = notifications.filter(
    n => !n.read && (n.priority === 'Urgent' || n.priority === 'ActionNeeded')
  ).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSnooze = (id: string, duration: string) => { console.log(`Snoozing ${id}`); };
  const handleMute = (id: string, muteType: string) => { console.log(`Muting ${id}`); };
  
  const handleNotificationClick = (notification: Notification) => {
    handleMarkAsRead(notification.id);
    setShowNotifications(false);
  };

  const handleUserMenuClick = () => {
    const button = userButtonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom, right: window.innerWidth - rect.right });
    }
    setShowUserMenu(!showUserMenu);
  };

  const handleProfileUpdate = (updates: any) => {
    if (updates.avatarUrl) setUserAvatar(updates.avatarUrl);
  };

  // Config for Tabs/Header
  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutGrid },
    { id: 'members' as const, label: 'Members', icon: Users },
    { id: 'committees' as const, label: 'Committees', icon: GitBranch },
  ];

  const getPageTitle = () => {
    switch (viewMode) {
      case 'overview': return 'Overview';
      case 'members': return 'Members';
      case 'committees': return 'Committees';
      default: return 'Legislators';
    }
  };

  const getTabSubtitle = () => {
    switch (viewMode) {
      case 'overview': return 'Chamber control & leadership';
      case 'members': return 'Intelligence & engagement';
      case 'committees': return 'Influence mapping';
      default: return 'Legislators';
    }
  };

  // Theme Handling
  const currentTheme = getPageTheme('Legislators');
  const ActiveIcon = tabs.find(t => t.id === viewMode)?.icon || LayoutGrid;

  // Calculate gradient based on theme
  const getGradient = () => {
    if (isDarkMode) {
      return `linear-gradient(135deg, #FFFFFF 0%, ${currentTheme.accent} 100%)`;
    }
    return `linear-gradient(135deg, ${currentTheme.gradientFrom} 0%, ${currentTheme.accent} 50%, ${currentTheme.gradientTo} 100%)`;
  };

  // Dynamic Island Stats
  const renderStats = () => {
     return (
        <motion.div 
           layoutId="dynamicIsland"
           className="flex items-center gap-3"
        >
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
                <Bell size={14} />
                <span className="text-xs font-bold">3 Critical Alerts</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                <Clock size={14} />
                <span className="text-xs font-bold">2 Updates Today</span>
            </div>
        </motion.div>
     );
  };

  return (
    <div className="relative z-50 flex-none flex flex-col">
        {/* Collapsible Global Header Content */}
        <AnimatePresence>
            {isHeaderExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`overflow-visible border-b relative z-50 ${
                        isDarkMode ? 'bg-[#050505] border-white/10' : 'bg-white border-gray-200'
                    }`}
                >
                    <div className="px-8 md:px-12 py-4 flex items-center justify-between gap-6">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-xl relative">
                            <Search 
                                className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} 
                                size={18} 
                            />
                            <input
                                type="text"
                                placeholder="Search legislators..."
                                className={`
                                    w-full rounded-xl pl-11 pr-4 py-2 text-sm outline-none transition-all
                                    ${isDarkMode 
                                        ? 'bg-white/5 border border-white/10 text-white focus:border-white/20 focus:bg-white/10 placeholder-gray-600' 
                                        : 'bg-gray-100 border border-transparent text-gray-900 focus:bg-white focus:border-gray-200 placeholder-gray-500'
                                    }
                                `}
                            />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => openPythia({ type: 'global', label: 'Legislative Intelligence' })}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all
                                    ${isDarkMode 
                                        ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' 
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                    }
                                `}
                            >
                                <Sparkles size={14} className={isDarkMode ? 'text-yellow-400' : 'text-purple-600'} />
                                <span>Ask Revere</span>
                            </button>

                            <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                            {/* Notifications */}
                            <div className="relative" ref={notificationRef}>
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`p-2 rounded-full transition-colors relative ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                                >
                                    <Bell size={20} />
                                    {badgeCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black" />
                                    )}
                                </button>
                                {showNotifications && (
                                    <NotificationDropdown
                                        notifications={notifications}
                                        onMarkAsRead={handleMarkAsRead}
                                        onMarkAllAsRead={handleMarkAllAsRead}
                                        onSnooze={handleSnooze}
                                        onMute={handleMute}
                                        onNotificationClick={handleNotificationClick}
                                        onOpenSettings={() => { setShowNotifications(false); setShowSettings(true); }}
                                    />
                                )}
                            </div>
                            
                            {/* Settings */}
                            <button 
                                onClick={() => setShowSettings(true)}
                                className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                            >
                                <Settings size={20} />
                            </button>

                            {/* User Menu */}
                            <div className="relative" ref={userMenuRef}>
                                <button 
                                    ref={userButtonRef}
                                    onClick={handleUserMenuClick}
                                    className="flex items-center gap-3 pl-2"
                                >
                                    <img src={userAvatar} className="w-8 h-8 rounded-full border border-white/10 object-cover" alt="User" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Main Page Header */}
        <motion.div
          className="relative overflow-hidden transition-all z-20 backdrop-blur-xl"
          style={{
             backgroundColor: isDarkMode ? 'rgba(5, 5, 5, 0.6)' : 'rgba(255, 255, 255, 0.6)',
          }}
          initial={false}
          animate={{
            height: isScrolled ? '80px' : '220px',
            boxShadow: isScrolled 
              ? (isDarkMode ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 4px 20px -5px rgba(0,0,0,0.05)') 
              : 'none'
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Toggle Button (Top Right) */}
          <div className="absolute top-6 right-8 md:right-12 z-50">
             <button
                onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
                className={`
                    p-2 rounded-lg transition-all duration-300 flex items-center justify-center relative
                    ${isDarkMode 
                        ? 'hover:bg-white/10 text-white/50 hover:text-white' 
                        : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'
                    }
                `}
             >
                <motion.div
                    animate={{ rotate: isHeaderExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative z-10 ${badgeCount > 0 && !isHeaderExpanded ? 'text-red-500' : ''}`}
                >
                    {isHeaderExpanded ? <ChevronDown size={20} /> : <Menu size={20} />}
                </motion.div>
                
                {/* Small indicator dot */}
                {badgeCount > 0 && !isHeaderExpanded && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-transparent z-20" />
                )}
             </button>
          </div>

          {/* Large Watermark Icon - Always Visible (Fades out when scrolled) */}
          <motion.div 
            className={`absolute pointer-events-none z-0 ${isDarkMode ? 'mix-blend-soft-light' : 'mix-blend-normal'}`}
            initial={false}
            animate={{
              opacity: isScrolled ? 0 : (isDarkMode ? 0.15 : 0.08),
              scale: isScrolled ? 0.8 : 1,
              left: -40,
              bottom: -100,
            }}
            transition={{ duration: 0.4 }}
          >
             <ActiveIcon 
               size={450} 
               color={isDarkMode ? "white" : currentTheme.accent} 
               strokeWidth={0.5}
             />
          </motion.div>

          {/* Content Container */}
          <div className="relative z-30 px-8 md:px-12 h-full flex flex-col justify-end pb-6 w-full">
            <div className="flex items-end justify-between gap-8">
              
              {/* Title Block with Integrated Icon */}
              <div className="flex flex-col">
                 <div className="flex items-center">
                    
                    {/* Small Icon - Box Removed */}
                    <AnimatePresence>
                      {isScrolled && (
                        <motion.div 
                          className="flex items-center justify-center mr-3"
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.8 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25 
                          }}
                        >
                            {/* Icon directly without box */}
                            <ActiveIcon 
                              size={28} 
                              color={isDarkMode ? "white" : currentTheme.accent} 
                              strokeWidth={2.5}
                            />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Styled Page Title */}
                    <motion.h1
                      className={`
                        font-bold tracking-tight relative z-10 leading-none whitespace-nowrap
                        ${isScrolled 
                          ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                          : 'text-transparent bg-clip-text'
                        }
                      `}
                      style={{ 
                        fontFamily: '"DM Sans", sans-serif', // New Font
                        letterSpacing: '-0.03em', 
                        backgroundImage: isScrolled ? 'none' : getGradient(), // Dynamic Gradient when enlarged
                        WebkitBackgroundClip: isScrolled ? 'border-box' : 'text', // Fallback
                      }}
                      animate={{
                        fontSize: isScrolled ? '24px' : '72px', // Larger expanded size for impact
                        marginBottom: isScrolled ? '0px' : '8px',
                        y: isScrolled ? 1 : 0 
                      }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {getPageTitle()}
                    </motion.h1>
                 </div>
                    
                    <motion.div
                      className="overflow-hidden"
                      animate={{
                        height: isScrolled ? 0 : 'auto',
                        opacity: isScrolled ? 0 : 0.9,
                        marginTop: isScrolled ? 0 : '8px'
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                            className="h-[2px] w-8" 
                            style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.6)' : currentTheme.accent }}
                        />
                        <p 
                            className="text-sm font-bold uppercase tracking-[0.2em]"
                            style={{ color: isDarkMode ? 'rgba(255,255,255,0.9)' : currentTheme.accent }}
                        >
                          {getTabSubtitle()}
                        </p>
                      </div>
                    </motion.div>
              </div>

              {/* Stats - Visible on ALL tabs now */}
              <AnimatePresence mode="wait">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, width: 'auto' }}
                    animate={{ opacity: 1, scale: 1, width: 'auto' }}
                    exit={{ opacity: 0, scale: 0.9, width: 'auto' }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`hidden xl:flex items-center mb-1.5 h-10`}
                  >
                      {renderStats()}
                  </motion.div>
              </AnimatePresence>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-8 pb-1.5 pr-12">
                {tabs.map(tab => {
                  const isActive = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id)}
                      className="relative py-2 outline-none group"
                    >
                      <span 
                        className="relative z-10 text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                        style={{
                           color: isActive 
                             ? (isDarkMode ? 'white' : '#000000') 
                             : (isDarkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)')
                        }}
                      >
                        {tab.label}
                      </span>

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className="absolute -bottom-1.5 left-0 right-0 h-[2px]"
                          style={{
                             backgroundColor: isDarkMode ? 'white' : currentTheme.accent,
                             boxShadow: isDarkMode ? '0 0 15px rgba(255,255,255,0.8)' : `0 0 10px ${hexToRgba(currentTheme.accent, 0.4)}`
                          }}
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </motion.div>

        {/* Bottom Separator */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-40" style={{ top: isHeaderExpanded ? 'auto' : undefined }}>
           {isDarkMode ? (
               /* Dark Mode Glow */
               <>
                  <div 
                    className="h-[1px] w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${currentTheme.accent}, transparent)`,
                      opacity: 0.8
                    }}
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      boxShadow: `0 0 15px 1px ${currentTheme.glow}`,
                      opacity: isScrolled ? 0.8 : 0.5
                    }}
                  />
               </>
           ) : (
               /* Light Mode - Clean Line */
               <div 
                 className="h-[1px] w-full"
                 style={{
                   background: `linear-gradient(90deg, transparent, ${hexToRgba(currentTheme.accent, 0.3)}, transparent)`,
                 }}
               />
           )}
        </div>

      {/* Settings & Profile Portals */}
      {showSettings && (
        <NotificationSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      )}

      {showProfileModal && createPortal(
        <ProfileCustomizationModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onProfileUpdate={handleProfileUpdate}
        />,
        document.body
      )}

      {/* User Menu Portal */}
      {showUserMenu && createPortal(
        <div 
          ref={userMenuRef}
          className={`
            fixed w-80 rounded-xl shadow-2xl transition-all duration-300 backdrop-blur-xl
            ${isDarkMode 
              ? 'bg-slate-900/95 border border-white/10' 
              : 'bg-white/95 border border-gray-200'
            }
          `}
          style={{ 
            top: `${menuPosition.top + 8}px`, 
            right: `${menuPosition.right}px`,
            zIndex: 99999
          }}
        >
          {/* User Info Header */}
          <div className={`
            p-5 border-b transition-colors duration-500
            ${isDarkMode ? 'border-white/10' : 'border-gray-200'}
          `}>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-red-500 to-red-700 blur-sm opacity-30`}></div>
                <img 
                  src={userAvatar} 
                  alt="User Avatar" 
                  className={`relative w-14 h-14 rounded-full object-cover border-2 ${
                    isDarkMode ? 'border-white/20' : 'border-gray-200'
                  }`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`
                  font-semibold transition-colors duration-500 truncate
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}
                `}>
                  {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'User'}
                </div>
                <div className={`
                  text-sm transition-colors duration-500 truncate
                  ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {currentUser?.email}
                </div>
              </div>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => {
                setShowProfileModal(true);
                setShowUserMenu(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-white/5 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                <User size={16} />
              </div>
              <div className="flex-1 text-left">
                <div>Profile & Preferences</div>
                <div className={`text-xs font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Customize your experience
                </div>
              </div>
            </button>

            <button
              onClick={() => {
                setShowSettings(true);
                setShowUserMenu(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isDarkMode 
                  ? 'text-gray-300 hover:bg-white/5 hover:text-white' 
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }
              `}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                <Settings size={16} />
              </div>
              <div className="flex-1 text-left">
                <div>Notifications</div>
                <div className={`text-xs font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Manage alerts & updates
                </div>
              </div>
            </button>

            <div className={`
              my-2 mx-2 border-t transition-colors duration-500
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
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                ${isDarkMode 
                  ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300' 
                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                }
              `}
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
              }`}>
                <LogOut size={16} />
              </div>
              <div className="flex-1 text-left">Sign Out</div>
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}