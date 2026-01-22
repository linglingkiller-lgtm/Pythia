import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Activity,
  Radio,
  MessageSquare,
  Lightbulb,
  Search,
  Bookmark,
  FileDown,
  Save,
  X,
  ChevronRight,
  Sparkles,
  Menu,
  ChevronDown,
  Bell,
  Settings,
  Filter,
  RefreshCw,
  Zap,
  Globe
} from 'lucide-react';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

import { GeoHeatMapTab } from './tabs/GeoHeatMapTab';
import { TopicsHubTab } from './tabs/TopicsHubTab';
import { NarrativesTab } from './tabs/NarrativesTab';
import { OpportunitiesTab } from './tabs/OpportunitiesTab';
import { IntelligencePanel } from './panels/IntelligencePanel';
import { SmokeTestDebugPanel } from '../debug/SmokeTestDebugPanel';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

// Header Functionality Imports
import { useAuth } from '../../contexts/AuthContext';
import { useAskPythia } from '../../contexts/AskPythiaContext';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { sampleNotifications } from '../../data/sampleNotifications';
import type { Notification } from '../notifications/NotificationDropdown';

type TimeWindow = '7d' | '30d' | 'session';
type Issue = 'clean-energy' | 'education' | 'healthcare' | 'tech';
type ActiveTab = 'heatmap' | 'topics' | 'narratives' | 'opportunities';
type MentionType = 'news' | 'social' | 'press' | 'committee';
type Sentiment = 'pos' | 'neu' | 'neg';

export function IssuesHub() {
  const { isDarkMode } = useTheme();
  
  // Header State
  const { openPythia } = useAskPythia();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>(avatarImage);
  const [notifications, setNotifications] = useState<Notification[]>(sampleNotifications);
  
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Page State
  const [activeTab, setActiveTab] = useState<ActiveTab>('heatmap');
  const [selectedIssue, setSelectedIssue] = useState<Issue>('clean-energy');
  const [timeWindow, setTimeWindow] = useState<TimeWindow>('30d');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filters
  const [sourcesFilter, setSourcesFilter] = useState<MentionType[]>([]);
  const [sentimentFilter, setSentimentFilter] = useState<Sentiment[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Geographic selections
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  
  // Live Mode
  const [isLiveMode, setIsLiveMode] = useState(false);
  
  // Scroll state
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get Issues page theme
  const issuesTheme = getPageTheme('Issues');
  const badgeCount = notifications.filter(n => !n.read).length;

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 20);
      }
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Click Outside Handlers for Header
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

  // Helpers
  const getCurrentScope = () => {
    if (selectedDistrict) return { type: 'district', id: selectedDistrict };
    if (selectedCounty) return { type: 'county', id: selectedCounty };
    if (selectedState) return { type: 'state', id: selectedState };
    return { type: 'national', id: null };
  };

  const clearSelection = () => {
    setSelectedState(null);
    setSelectedCounty(null);
    setSelectedDistrict(null);
  };

  const toggleSourceFilter = (source: MentionType) => {
    setSourcesFilter(prev =>
      prev.includes(source) ? prev.filter(s => s !== source) : [...prev, source]
    );
  };

  const toggleSentimentFilter = (sentiment: Sentiment) => {
    setSentimentFilter(prev =>
      prev.includes(sentiment) ? prev.filter(s => s !== sentiment) : [...prev, sentiment]
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: !n.read } : n)));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };
  
  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getPageTitle = () => {
    // Static title for the main header, dynamic content is in the body/tabs
    return 'Issues Hub';
  };

  const getGradient = () => {
    if (isDarkMode) {
      return `linear-gradient(135deg, #FFFFFF 0%, ${issuesTheme.accent} 100%)`;
    }
    return `linear-gradient(135deg, ${issuesTheme.gradientFrom} 0%, ${issuesTheme.accent} 50%, ${issuesTheme.gradientTo} 100%)`;
  };

  // Issue Display Name Map
  const issueNames: Record<Issue, string> = {
    'clean-energy': 'Clean Energy',
    'education': 'Education',
    'healthcare': 'Healthcare',
    'tech': 'Tech Policy'
  };

  const tabs = [
    { id: 'heatmap' as const, label: 'Heat Map', icon: MapPin },
    { id: 'topics' as const, label: 'Topics', icon: Activity },
    { id: 'narratives' as const, label: 'Narratives', icon: MessageSquare },
    { id: 'opportunities' as const, label: 'Opportunities', icon: Lightbulb },
  ];

  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || MapPin;

  return (
    <div className="h-full flex flex-col relative overflow-hidden transition-colors duration-500">
      
       {/* Background Effects */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-red-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div 
              className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-orange-100/40 via-orange-50/20 to-transparent" 
              style={{ mixBlendMode: 'multiply' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-red-100/40 via-red-50/20 to-transparent" 
              style={{ mixBlendMode: 'multiply' }}
            />
          </>
        )}
      </div>

      {/* Header Wrapper */}
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
                    placeholder="Search issues, narratives, or regions..."
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
                    onClick={() => openPythia({ type: 'issue', label: `Issue: ${issueNames[selectedIssue]}` })}
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
                        onSnooze={() => {}}
                        onMute={() => {}}
                        onNotificationClick={(n) => { handleMarkAsRead(n.id); setShowNotifications(false); }}
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
                
                {badgeCount > 0 && !isHeaderExpanded && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-transparent z-20" />
                )}
             </button>
          </div>

          {/* Large Watermark Icon */}
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
               color={isDarkMode ? "white" : issuesTheme.accent} 
               strokeWidth={0.5}
             />
          </motion.div>

          {/* Content Container */}
          <div className={`relative z-30 px-8 md:px-12 h-full flex flex-col w-full transition-all duration-300 ${isScrolled ? 'justify-center' : 'justify-end pb-6'}`}>
            <div className={`flex justify-between gap-8 ${isScrolled ? 'items-center' : 'items-end'}`}>
              
              {/* Title Block */}
              <div className="flex flex-col">
                 <div className="flex items-center">
                    
                    <AnimatePresence>
                      {isScrolled && (
                        <motion.div 
                          className="flex items-center justify-center mr-3"
                          initial={{ opacity: 0, x: -20, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -20, scale: 0.8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                            <ActiveIcon 
                              size={28} 
                              color={isDarkMode ? "white" : issuesTheme.accent} 
                              strokeWidth={2.5}
                              className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
                            />
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
                          style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.6)' : issuesTheme.accent }}
                      />
                      <p 
                          className="text-sm font-bold uppercase tracking-[0.2em]"
                          style={{ color: isDarkMode ? 'rgba(255,255,255,0.9)' : issuesTheme.accent }}
                      >
                        INTELLIGENCE & TRACKING
                      </p>
                    </div>
                 </motion.div>
              </div>

              {/* Dynamic Island Stats */}
              <div className="flex-1 flex justify-center">
                <AnimatePresence>
                  <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="hidden md:flex items-center gap-4"
                  >
                       <motion.div 
                           layoutId="dynamicIsland"
                           className="flex items-center gap-3"
                        >
                            <button 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`}
                            >
                                <Zap size={14} strokeWidth={2.5} />
                                <span className="text-xs font-bold">{issueNames[selectedIssue]}</span>
                            </button>
                            <button 
                                onClick={() => setSelectedState(null)} 
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                            >
                                <Globe size={14} strokeWidth={2.5} />
                                <span className="text-xs font-bold">
                                    {selectedDistrict ? `District ${selectedDistrict}` : selectedCounty ? `County ${selectedCounty}` : selectedState ? selectedState : 'National'}
                                </span>
                            </button>
                            <button 
                                onClick={() => setIsLiveMode(!isLiveMode)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <Radio size={14} strokeWidth={2.5} />
                                <span className="text-xs font-bold">{isLiveMode ? 'Live Mode' : timeWindow}</span>
                            </button>
                        </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-8 pb-1.5 pr-12">
                {tabs.map(tab => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
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
                             backgroundColor: isDarkMode ? 'white' : issuesTheme.accent,
                             boxShadow: isDarkMode ? '0 0 15px rgba(255,255,255,0.8)' : `0 0 10px ${hexToRgba(issuesTheme.accent, 0.4)}`
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
               <>
                  <div 
                    className="h-[1px] w-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${issuesTheme.accent}, transparent)`,
                      opacity: 0.8
                    }}
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      boxShadow: `0 0 15px 1px ${issuesTheme.accent}`,
                      opacity: isScrolled ? 0.8 : 0.5
                    }}
                  />
               </>
           ) : (
               <div 
                 className="h-[1px] w-full"
                 style={{
                   background: `linear-gradient(90deg, transparent, ${hexToRgba(issuesTheme.accent, 0.3)}, transparent)`,
                 }}
               />
           )}
        </div>
      </div>

      {/* Main Content Area with Toolbar */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
         
         {/* Sticky Toolbar Controls */}
         <div className={`sticky top-0 z-30 px-8 py-4 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
            <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto w-full">
               
               {/* Left: Issue & Time */}
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <select
                      value={selectedIssue}
                      onChange={e => setSelectedIssue(e.target.value as Issue)}
                      className={`pl-3 pr-8 py-2 rounded-lg border text-sm font-semibold transition-all appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-orange-500/20 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                          : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <option value="clean-energy">🌱 Clean Energy</option>
                      <option value="education">📚 Education</option>
                      <option value="healthcare">🏥 Healthcare</option>
                      <option value="tech">💻 Tech Policy</option>
                    </select>
                    <ChevronDown
                      className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}
                    />
                  </div>

                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                  <div className={`flex items-center p-1 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    {(['7d', '30d', 'session'] as TimeWindow[]).map(window => (
                      <button
                        key={window}
                        onClick={() => setTimeWindow(window)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                          timeWindow === window
                            ? (isDarkMode ? 'bg-orange-600 text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                            : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900')
                        }`}
                      >
                        {window === '7d' ? '7d' : window === '30d' ? '30d' : 'Session'}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Center: Search */}
               <div className="flex-1 max-w-md relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input 
                     type="text" 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Search intelligence..." 
                     className={`
                        w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border transition-all
                        ${isDarkMode 
                            ? 'bg-white/5 border-white/5 focus:border-white/20 text-white placeholder:text-gray-600' 
                            : 'bg-white border-gray-200 focus:border-gray-300 text-gray-900 placeholder:text-gray-400'
                        }
                     `}
                  />
               </div>

               {/* Right: Filters & Actions */}
               <div className="flex items-center gap-3">
                  
                  {/* Geo Badge (if active) */}
                  {(selectedState || selectedCounty || selectedDistrict) && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                        isDarkMode
                          ? 'bg-orange-600/10 border-orange-500/30 text-orange-400'
                          : 'bg-orange-50 border-orange-200 text-orange-700'
                      }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">
                        {selectedDistrict
                          ? `District ${selectedDistrict}`
                          : selectedCounty
                          ? `County ${selectedCounty}`
                          : selectedState}
                      </span>
                      <button
                        onClick={clearSelection}
                        className="ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <button
                      onClick={() => setShowFilters(!showFilters)}
                      className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all
                          ${showFilters 
                              ? (isDarkMode ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700')
                              : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50')
                          }
                      `}
                  >
                      <Filter size={16} />
                      <span className="hidden sm:inline">Filters</span>
                      {(sourcesFilter.length > 0 || sentimentFilter.length > 0) && (
                          <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-orange-500 text-white rounded-full">
                              {sourcesFilter.length + sentimentFilter.length}
                          </span>
                      )}
                  </button>

                  <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                  <div className="flex items-center gap-2">
                     <button title="Live Mode" onClick={() => setIsLiveMode(!isLiveMode)} className={`p-2 rounded-lg border transition-colors ${isLiveMode ? 'bg-red-500 text-white border-red-600' : (isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50')}`}>
                        <Radio size={18} className={isLiveMode ? 'animate-pulse' : ''} />
                     </button>
                     <button title="Generate Brief" className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <FileDown size={18} />
                     </button>
                     <button title="Save Workspace" className={`p-2 rounded-lg border transition-colors ${isDarkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                        <Save size={18} />
                     </button>
                  </div>
               </div>
            </div>
            
            {/* Expanded Filters Area */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className={`mt-4 pt-4 border-t flex flex-wrap gap-6 items-start ${isDarkMode ? 'border-white/10' : 'border-gray-100'}`}>
                            
                            {/* Source Filters */}
                            <div className="flex flex-col gap-2">
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sources</span>
                                <div className="flex items-center gap-2">
                                    {(['news', 'social', 'press', 'committee'] as MentionType[]).map(source => (
                                        <button
                                            key={source}
                                            onClick={() => toggleSourceFilter(source)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                                ${sourcesFilter.includes(source)
                                                    ? (isDarkMode ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-700')
                                                    : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')
                                                }
                                            `}
                                        >
                                            {source}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Sentiment Filters */}
                            <div className="flex flex-col gap-2">
                                <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sentiment</span>
                                <div className="flex items-center gap-2">
                                    {(['pos', 'neu', 'neg'] as Sentiment[]).map(sentiment => (
                                        <button
                                            key={sentiment}
                                            onClick={() => toggleSentimentFilter(sentiment)}
                                            className={`
                                                px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                                                ${sentimentFilter.includes(sentiment)
                                                    ? (isDarkMode ? 'bg-white/10 border-white/30 text-white' : 'bg-gray-100 border-gray-300 text-gray-900')
                                                    : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')
                                                }
                                            `}
                                        >
                                            {sentiment === 'pos' ? 'Positive 👍' : sentiment === 'neg' ? 'Negative 👎' : 'Neutral 😐'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>

         {/* Content View */}
         <div className="h-full flex">
            {/* Left: Tab Content */}
            <div className="flex-1 p-8 overflow-visible">
              {activeTab === 'heatmap' && (
                <GeoHeatMapTab
                  isDarkMode={isDarkMode}
                  selectedIssue={selectedIssue}
                  timeWindow={timeWindow}
                  selectedState={selectedState}
                  setSelectedState={setSelectedState}
                  selectedCounty={selectedCounty}
                  setSelectedCounty={setSelectedCounty}
                  selectedDistrict={selectedDistrict}
                  setSelectedDistrict={setSelectedDistrict}
                  clearSelection={clearSelection}
                />
              )}
              {activeTab === 'topics' && (
                <TopicsHubTab
                  isDarkMode={isDarkMode}
                  selectedIssue={selectedIssue}
                  currentScope={getCurrentScope()}
                />
              )}
              {activeTab === 'narratives' && (
                <NarrativesTab
                  isDarkMode={isDarkMode}
                  selectedIssue={selectedIssue}
                  currentScope={getCurrentScope()}
                />
              )}
              {activeTab === 'opportunities' && (
                <OpportunitiesTab
                  isDarkMode={isDarkMode}
                  selectedIssue={selectedIssue}
                  currentScope={getCurrentScope()}
                />
              )}
            </div>

            {/* Right: Intelligence Panel */}
            <div className={`w-[400px] border-l ${isDarkMode ? 'border-white/10 bg-slate-900/50' : 'border-gray-200 bg-white/50'}`}>
                <IntelligencePanel
                    isDarkMode={isDarkMode}
                    currentScope={getCurrentScope()}
                    selectedIssue={selectedIssue}
                    timeWindow={timeWindow}
                />
            </div>
         </div>

         {/* Debug Panel - Bottom Left */}
         <SmokeTestDebugPanel />
      </div>

    </div>
  );
}
