import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Settings, Sparkles, Menu, ChevronDown, Inbox, Mic, Clock, LogOut, User, X, Radio, Bot, Edit3, Save, LayoutGrid, MessageSquare, CheckCircle2, AlertCircle, Calendar, FileText, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSupabaseAuth } from '../../contexts/SupabaseAuthContext';
import { useAppMode } from '../../contexts/AppModeContext';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { useVoice } from '../../contexts/VoiceContext';
import { useDashboard } from '../../contexts/DashboardContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { NotificationSettings } from '../notifications/NotificationSettings';
import { ProfileCustomizationModal, ProfileUpdates } from '../profile/ProfileCustomizationModal';
import { AssistantSidebar } from './AssistantSidebar';
import { sampleNotifications } from '../../data/sampleNotifications';
import type { Notification } from '../notifications/NotificationDropdown';
import { MeetingRecorderModal } from '../intelligence/MeetingRecorderModal';
import { createPortal } from 'react-dom';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';
import { toast } from "sonner";

interface IntegratedPageHeaderProps {
  isScrolled: boolean;
  title: string;
  subtitle?: string;
  headerIcon?: React.ReactNode;
  backgroundImage?: React.ReactNode; 
  globalActions?: React.ReactNode; 
  pageActions?: React.ReactNode; 
  children?: React.ReactNode; 
  onExpandChange?: (expanded: boolean) => void;
  accentColor?: string; 
  headerContent?: React.ReactNode;
  briefingMode?: 'morning' | 'evening';
  
  // Customization Props
  onCustomize?: () => void;
  isCustomizing?: boolean;
  onSaveCustomization?: () => void;
  onCancelCustomization?: () => void;
  backgroundPosition?: 'left' | 'center' | 'right';
  centerContentClassName?: string;
}

// Dynamic Island Notification Interface
interface DynamicNotification {
  id: string;
  text: string;
  icon: React.ElementType;
  color: string;
}

// Default notifications for different page contexts
const getDefaultNotifications = (pageTitle: string): DynamicNotification[] => {
  // Legislative/Bills context
  if (pageTitle.toLowerCase().includes('bill')) {
    return [
      { id: '1', text: "Ashley commented on HB2345", icon: MessageSquare, color: 'text-blue-500' },
      { id: '2', text: "SB789 passed committee vote", icon: CheckCircle2, color: 'text-green-500' },
      { id: '3', text: "3 bills require urgent review", icon: AlertCircle, color: 'text-red-500' },
      { id: '4', text: "New amendment filed on HB1234", icon: FileText, color: 'text-purple-500' },
      { id: '5', text: "Hearing scheduled for tomorrow", icon: Calendar, color: 'text-orange-500' },
    ];
  }
  
  // Legislators context
  if (pageTitle.toLowerCase().includes('legislator')) {
    return [
      { id: '1', text: "Sen. Johnson changed position", icon: AlertCircle, color: 'text-orange-500' },
      { id: '2', text: "New voting record available", icon: CheckCircle2, color: 'text-green-500' },
      { id: '3', text: "3 legislators added to watch list", icon: MessageSquare, color: 'text-blue-500' },
      { id: '4', text: "Committee assignment updated", icon: FileText, color: 'text-purple-500' },
      { id: '5', text: "Town hall meeting in 2 days", icon: Calendar, color: 'text-red-500' },
    ];
  }
  
  // Issues context
  if (pageTitle.toLowerCase().includes('issue')) {
    return [
      { id: '1', text: "Healthcare issue trending up", icon: AlertCircle, color: 'text-red-500' },
      { id: '2', text: "New stakeholder identified", icon: MessageSquare, color: 'text-blue-500' },
      { id: '3', text: "Coalition meeting tomorrow", icon: Calendar, color: 'text-purple-500' },
      { id: '4', text: "Media coverage spike detected", icon: CheckCircle2, color: 'text-green-500' },
      { id: '5', text: "5 related bills introduced", icon: FileText, color: 'text-orange-500' },
    ];
  }
  
  // Manager/Team context
  if (pageTitle.toLowerCase().includes('manager') || pageTitle.toLowerCase().includes('team')) {
    return [
      { id: '1', text: "Sarah requested PTO for next week", icon: Calendar, color: 'text-purple-500' },
      { id: '2', text: "New hire onboarding 85% complete", icon: CheckCircle2, color: 'text-green-500' },
      { id: '3', text: "Lobbying Team meeting in 15m", icon: Clock, color: 'text-orange-500' },
      { id: '4', text: "3 Monthly Reviews due today", icon: FileText, color: 'text-blue-500' },
      { id: '5', text: "Capacity alert: Policy Team at 95%", icon: AlertCircle, color: 'text-red-500' },
    ];
  }
  
  // Default/Dashboard context
  return [
    { id: '1', text: "5 new updates in your feed", icon: MessageSquare, color: 'text-blue-500' },
    { id: '2', text: "Weekly report is ready", icon: CheckCircle2, color: 'text-green-500' },
    { id: '3', text: "Action required on 3 items", icon: AlertCircle, color: 'text-red-500' },
    { id: '4', text: "Meeting in 30 minutes", icon: Calendar, color: 'text-orange-500' },
    { id: '5', text: "2 documents need approval", icon: FileText, color: 'text-purple-500' },
  ];
};

// Twinkling Stars Component for Evening Briefing
const TwinklingStars = () => {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: Math.random() * 2 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export function IntegratedPageHeader({
  isScrolled,
  title,
  subtitle,
  headerIcon,
  backgroundImage,
  globalActions,
  pageActions,
  children,
  onExpandChange,
  accentColor,
  headerContent,
  briefingMode,
  onCustomize,
  isCustomizing,
  onSaveCustomization,
  onCancelCustomization,
  backgroundPosition = 'left',
  centerContentClassName
}: IntegratedPageHeaderProps) {
  const { isDarkMode } = useTheme();
  const { currentUser, logout } = useAuth();
  const { signOut: supabaseSignOut } = useSupabaseAuth();
  const { appMode } = useAppMode();
  const { openPythia } = useAskPythia();
  const { isListening, startListening, stopListening, transcript, lastIntent } = useVoice();
  const { isMorningBriefing, toggleMorningBriefing } = useDashboard();
  
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMeetingRecorder, setShowMeetingRecorder] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(avatarImage);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [assistantIntent, setAssistantIntent] = useState<any>(null);
  
  // Dynamic Island Notifications State
  const [dynamicNotification, setDynamicNotification] = useState<DynamicNotification | null>(null);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const dynamicNotifications = useRef<DynamicNotification[]>(getDefaultNotifications(title));
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Use a ref to track the last intent we processed to prevent auto-opening on mount/remount
  const processedIntentRef = useRef(lastIntent);

  // Check for last visit and prompt user
  useEffect(() => {
    const lastVisit = localStorage.getItem('revere_last_visit');
    const now = Date.now();
    const fiveHours = 18000000;
    
    if (lastVisit && (now - parseInt(lastVisit) > fiveHours)) {
       toast("Welcome back", {
         description: "It's been a while. Would you like to see what you've missed?",
         action: {
           label: "View Briefing",
           onClick: () => {
             setAssistantIntent({ type: 'GET_MORNING_BRIEF' });
             setShowAssistant(true);
           }
         },
         duration: 8000,
       });
    }
    
    localStorage.setItem('revere_last_visit', now.toString());
  }, []);
  
  // Auto-open Assistant on specific voice intents
  useEffect(() => {
    // Only proceed if lastIntent exists and it's different from the one we last processed
    // This prevents the sidebar from opening immediately on page load if context has a stale intent
    if (lastIntent && lastIntent !== processedIntentRef.current) {
      const assistantIntents = [
        'SUMMARIZE_BILL', 'SIMULATE_VOTE', 'COMPARE_BILLS', 
        'GET_STAKEHOLDER_BRIEF', 'FIND_PATH_TO_STAKEHOLDER', 
        'CREATE_TASK', 'PREP_MEETING', 'GET_MORNING_BRIEF',
        'DRAFT_MESSAGE'
      ];
      
      if (assistantIntents.includes(lastIntent.type)) {
        setShowAssistant(true);
      }
    }
    
    // Update ref
    processedIntentRef.current = lastIntent;
  }, [lastIntent]);

  // Dynamic Island Notification Cycling
  useEffect(() => {
    // Update notification list when title changes (different page context)
    dynamicNotifications.current = getDefaultNotifications(title);
  }, [title]);

  useEffect(() => {
    // Start the notification cycling loop
    const interval = setInterval(() => {
      const notif = dynamicNotifications.current[notificationIndex];
      setDynamicNotification(notif);
      
      // Advance index
      setNotificationIndex(prev => (prev + 1) % dynamicNotifications.current.length);

      // Clear notification after 5 seconds to show stats again
      setTimeout(() => {
        setDynamicNotification(null);
      }, 5000);

    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [notificationIndex]);

  useEffect(() => {
    onExpandChange?.(isHeaderExpanded);
  }, [isHeaderExpanded, onExpandChange]);

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

  const handleProfileUpdate = (updates: ProfileUpdates) => {
    if (updates.avatarUrl) setUserAvatar(updates.avatarUrl);
  };

  const getGradient = () => {
    const color = accentColor || (isDarkMode ? '#ffffff' : '#4F46E5');
    if (isDarkMode) {
      return `linear-gradient(135deg, #FFFFFF 0%, ${color} 100%)`;
    }
    return `linear-gradient(135deg, ${color} 0%, ${color} 100%)`;
  };

  const handleMeetingClick = () => {
    // Start listening immediately on click (User Gesture)
    startListening('meeting');
    setShowMeetingRecorder(true);
  };

  return (
    <div className="relative z-50 flex-none flex flex-col">
      
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
              <div className="flex-1 max-w-xl relative">
                <Search 
                  className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} 
                  size={18}
                  style={{ filter: isDarkMode ? 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))' : 'none' }}
                />
                <input
                  type="text"
                  placeholder="Search workspace..."
                  className={`
                    w-full rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none transition-all
                    ${isDarkMode 
                      ? 'bg-white/5 border border-white/10 text-white focus:border-purple-500/30 focus:bg-white/10 placeholder-gray-600' 
                      : 'bg-gray-100 border border-transparent text-gray-900 focus:bg-white focus:border-gray-300 placeholder-gray-500'
                    }
                  `}
                />
              </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                  {/* Voice Command Interface */}
                  <div className="flex items-center mr-2">
                    <AnimatePresence mode="wait">
                      {isListening ? (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: 'auto', opacity: 1 }}
                          exit={{ width: 0, opacity: 0 }}
                          className={`
                            flex items-center gap-3 px-4 py-2 rounded-xl border overflow-hidden whitespace-nowrap
                            ${isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}
                          `}
                        >
                          <div className="relative flex-none">
                             <Mic size={16} className="text-red-500 animate-pulse" />
                             <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20"></span>
                          </div>
                          <div className="flex flex-col min-w-[120px] max-w-[240px]">
                             <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider leading-none mb-0.5">Listening</span>
                             <span className={`text-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                               {transcript || "Say a command..."}
                             </span>
                          </div>
                          <button 
                            onClick={stopListening} 
                            className={`p-1 rounded-full flex-none transition-colors ${isDarkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-500'}`}
                          >
                             <X size={14} />
                          </button>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => startListening('command')}
                          className={`
                            p-2 rounded-full transition-all duration-300 relative overflow-hidden group
                            ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}
                          `}
                          title="Voice Command"
                        >
                          <Mic size={20} />
                        </button>
                      )}
                    </AnimatePresence>
                  </div>

                  <button 
                    onClick={() => setShowAssistant(!showAssistant)}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105
                      bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient
                      text-white border border-white/20
                    `}
                  >
                    <Sparkles size={14} className="text-yellow-300" />
                    <span>Assistant</span>
                  </button>

                  <button 
                    onClick={toggleMorningBriefing}
                    className={`
                      p-2 rounded-full transition-all duration-300 relative overflow-hidden group
                      ${isMorningBriefing
                        ? (isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700')
                        : (isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900')
                      }
                    `}
                    title="Briefing"
                  >
                    <Clock size={20} />
                  </button>

                  {/* Standardized Customization Trigger */}
                  {onCustomize && !isCustomizing && (
                    <button 
                      onClick={onCustomize}
                      className={`
                        p-2 rounded-full transition-all duration-300 relative overflow-hidden group
                        ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}
                      `}
                      title="Customize Layout"
                    >
                      <LayoutGrid size={20} />
                    </button>
                  )}

                  {/* Customization Actions (Save/Cancel) */}
                  {isCustomizing && (
                    <div className="flex items-center gap-2">
                       {onSaveCustomization && (
                         <button 
                           onClick={onSaveCustomization}
                           className={`
                             p-2 rounded-full transition-all duration-300 relative overflow-hidden group bg-green-500/10 text-green-500 hover:bg-green-500/20
                           `}
                           title="Save Layout"
                         >
                           <Save size={20} />
                         </button>
                       )}
                       {onCancelCustomization && (
                         <button 
                           onClick={onCancelCustomization}
                           className={`
                             p-2 rounded-full transition-all duration-300 relative overflow-hidden group bg-red-500/10 text-red-500 hover:bg-red-500/20
                           `}
                           title="Cancel"
                         >
                           <X size={20} />
                         </button>
                       )}
                    </div>
                  )}

                  {globalActions}

                  <div className={`h-6 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                  <div className="relative" ref={notificationRef}>
                    <button 
                      onClick={() => setShowNotifications(!showNotifications)}
                      className={`p-2 rounded-full transition-colors relative ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
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
                  
                  <button 
                    onClick={() => setShowSettings(true)}
                    className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
                  >
                    <Settings size={20} />
                  </button>

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

      <motion.div
        className="glass-header relative overflow-hidden transition-all z-20"
        initial={false}
        animate={{
          height: isScrolled ? '80px' : '220px',
          boxShadow: isScrolled 
            ? (isDarkMode ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 4px 20px -5px rgba(0,0,0,0.05)') 
            : 'none'
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
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
            
            {badgeCount > 0 && !isHeaderExpanded && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-transparent z-20" />
            )}
          </button>
        </div>

        {backgroundImage && (
          <motion.div 
            className={`absolute pointer-events-none z-0 ${isDarkMode ? 'mix-blend-soft-light' : 'mix-blend-normal'}`}
            initial={false}
            animate={{
              opacity: isScrolled ? 0 : (isDarkMode ? 0.15 : 0.08),
              scale: isScrolled ? 0.8 : 1,
              left: backgroundPosition === 'center' ? '50%' : (backgroundPosition === 'right' ? 'auto' : -40),
              right: backgroundPosition === 'right' ? -40 : 'auto',
              x: backgroundPosition === 'center' ? '-50%' : 0,
              bottom: -100,
            }}
            transition={{ duration: 0.4 }}
          >
            {backgroundImage}
          </motion.div>
        )}

        {/* Morning Briefing Gradient Overlay */}
        {briefingMode === 'morning' && !isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1] pointer-events-none"
          >
            <div className={`absolute inset-0 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-orange-500/20 via-red-800/15 to-transparent' 
                : 'bg-gradient-to-b from-orange-400/20 via-amber-300/15 to-transparent'
            }`} />
          </motion.div>
        )}

        {/* Evening Briefing Gradient Overlay + Twinkling Stars */}
        {briefingMode === 'evening' && !isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1] pointer-events-none overflow-hidden"
          >
            {/* Twinkling Stars */}
            <TwinklingStars />
            
            {/* Evening Gradient */}
            <div className={`absolute inset-0 ${
              isDarkMode 
                ? 'bg-gradient-to-b from-indigo-900/30 via-purple-900/20 to-transparent' 
                : 'bg-gradient-to-b from-indigo-500/20 via-purple-400/15 to-transparent'
            }`} />
          </motion.div>
        )}

        <div className={`relative z-30 px-8 md:px-12 h-full flex flex-col w-full transition-all duration-300 ${isScrolled ? 'justify-center' : 'justify-end pb-6'}`}>
          <div className={`flex justify-between gap-8 ${isScrolled ? 'items-center' : 'items-end'}`}>
            
            <div className="flex flex-col">
              <div className="flex items-center">
                
                <AnimatePresence>
                  {isScrolled && headerIcon && (
                    <motion.div 
                      className="flex items-center justify-center mr-3"
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {headerIcon}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.h1
                  className={`
                    font-bold tracking-tight relative z-10 leading-none whitespace-nowrap
                    ${isScrolled 
                      ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                      : 'text-transparent bg-clip-text'
                    }
                  `}
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    letterSpacing: '-0.03em',
                    backgroundImage: isScrolled ? 'none' : getGradient(), 
                    WebkitBackgroundClip: isScrolled ? 'border-box' : 'text',
                  }}
                  animate={{
                    fontSize: isScrolled ? '24px' : '72px',
                    marginBottom: isScrolled ? '0px' : '8px',
                    y: isScrolled ? 1 : 0 
                  }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  {title}
                </motion.h1>
              </div>
              
              {subtitle && (
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
                      style={{ backgroundColor: accentColor || (isDarkMode ? 'rgba(255,255,255,0.6)' : '#4F46E5') }}
                    />
                    <p 
                      className="text-sm font-bold uppercase tracking-[0.2em]"
                      style={{ color: accentColor || (isDarkMode ? 'rgba(255,255,255,0.9)' : '#4F46E5') }}
                    >
                      {subtitle}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            <div className="flex-1 flex justify-center">
              <AnimatePresence mode="wait">
                {!isScrolled && (
                  <motion.div 
                    key={dynamicNotification ? 'notification' : 'content'}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`hidden xl:flex items-center ${centerContentClassName || 'h-10'}`}
                  >
                    {dynamicNotification ? (
                      // Dynamic Island Notification State
                      <motion.div 
                        layoutId="dynamicIsland"
                        className={`
                          flex items-center gap-3 px-4 py-2 rounded-full shadow-lg overflow-hidden relative
                          ${isDarkMode 
                            ? 'bg-white text-black' 
                            : 'bg-black text-white'
                          }
                        `}
                        style={{ minWidth: '320px' }}
                      >
                        {/* Glowing pulse effect behind */}
                        <div className={`absolute inset-0 opacity-20 animate-pulse ${
                          dynamicNotification.color.replace('text-', 'bg-')
                        }`} />

                        {/* Icon Container with Background */}
                        <div className={`p-1.5 rounded-full ${
                          isDarkMode 
                            ? 'bg-white/10' 
                            : 'bg-black/5'
                        }`}>
                          <div className={`p-1 rounded-full ${dynamicNotification.color.replace('text-', 'bg-')}/20`}>
                            <dynamicNotification.icon size={14} className={dynamicNotification.color} strokeWidth={3} />
                          </div>
                        </div>
                        
                        <span className="text-sm font-bold truncate pr-2">
                          {dynamicNotification.text}
                        </span>

                        {/* Close/Action indicator */}
                        <div className={`ml-auto w-1 h-4 rounded-full opacity-20 ${isDarkMode ? 'bg-black' : 'bg-white'}`} />
                      </motion.div>
                    ) : (
                      // Normal Header Content State (stats/actions) - Always show when no notification
                      <motion.div 
                        layoutId="dynamicIsland"
                        className="flex items-center gap-4"
                      >
                        {headerContent || children}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex w-[300px] justify-end">
                {pageActions}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-[1px] z-50">
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 blur-[1px] animate-pulse`} />
          <div className={`absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-30 animate-pulse`} style={{ animationDelay: '1s' }} />
        </div>
      </motion.div>

      {showUserMenu && createPortal(
        <div 
          ref={userMenuRef}
          className={`
            fixed w-80 rounded-xl shadow-2xl transition-all duration-300 glass-modal
          `}
          style={{ 
            top: `${menuPosition.top + 8}px`, 
            right: `${menuPosition.right}px`,
            zIndex: 99999
          }}
        >
          {/* User Menu Content */}
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

      <MeetingRecorderModal 
        isOpen={showMeetingRecorder}
        onClose={() => setShowMeetingRecorder(false)}
      />

      <AssistantSidebar
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        initialIntent={assistantIntent}
        onClearIntent={() => setAssistantIntent(null)}
        onRecordMeeting={() => {
          setShowAssistant(false);
          handleMeetingClick();
        }}
        onOpenPythia={() => {
          setShowAssistant(false);
          openPythia({ type: 'global', label: 'Dashboard Intelligence' });
        }}
      />

    </div>
  );
}