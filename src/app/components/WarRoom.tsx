import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Users, 
  MapPin, 
  Calendar, 
  Search, 
  Filter, 
  ChevronDown, 
  SlidersHorizontal, 
  Sparkles, 
  FileDown, 
  Bell, 
  MessageSquare, 
  User, 
  LayoutGrid, 
  Shield,
  ListChecks,
  DollarSign,
  Database,
  Menu,
  Settings,
  Target,
  Clock,
  Briefcase
} from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { OverviewTab } from './war-room/OverviewTab';
import { ProjectsTab } from './war-room/ProjectsTab';
import { FieldEventsTab } from './war-room/FieldEventsTab';
import { BudgetResourcesTab } from './war-room/BudgetResourcesTab';
import { TemplateLibraryModal } from './war-room/TemplateLibraryModal';
import { NewProjectModal } from './war-room/NewProjectModal';
import { GenerateWeeklyPlanModal } from './war-room/GenerateWeeklyPlanModal';
import { DataPullsHub } from './war-room/data-pulls/DataPullsHub';
import { TabType } from './war-room/types';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';

// Header Functionality Imports
import { useAskPythia } from '../contexts/AskPythiaContext';
import { NotificationDropdown } from './notifications/NotificationDropdown';
import { sampleNotifications } from '../data/sampleNotifications';
import type { Notification } from './notifications/NotificationDropdown';

import { ConstellationMap } from './intelligence/ConstellationMap';
import { ScenarioBuilder } from './war-room/ScenarioBuilder';
import { Footer } from './Footer';

export const WarRoom: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  
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
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showWeeklyPlanModal, setShowWeeklyPlanModal] = useState(false);
  
  // State for Overview Tab specific actions (Bulk Mode)
  const [overviewBulkMode, setOverviewBulkMode] = useState(false);

  // Scroll state for header animation
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const pageTheme = getPageTheme('War Room');
  const badgeCount = notifications.filter(n => !n.read).length;

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        setIsScrolled(scrollRef.current.scrollTop > 20);
      }
    };

    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
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

  // Global Filters State
  const [filters, setFilters] = useState({
    client: 'all',
    district: 'all',
    state: 'all',
    cycle: '2026',
    stage: 'all',
    team: 'all'
  });

  const tabTitles: Record<TabType, string> = {
    overview: 'Overview',
    projects: 'Projects',
    'field-events': 'Field & Events',
    budget: 'Budget & Resources',
    'data-pulls': 'Data Pulls',
    'scenarios': 'War Games',
    'constellation': 'Constellation'
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'overview': return 'Command center dashboard';
      case 'projects': return 'Task & milestone tracking';
      case 'field-events': return 'Calendar & logistics';
      case 'budget': return 'Financial allocation';
      case 'data-pulls': return 'Reporting & analytics';
      case 'scenarios': return 'Scenario planning & simulation';
      case 'constellation': return 'Influence mapping & analysis';
      default: return 'Manage your campaign operations';
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutGrid },
    { id: 'projects' as TabType, label: 'Projects', icon: ListChecks },
    { id: 'field-events' as TabType, label: 'Field & Events', icon: Calendar },
    { id: 'scenarios' as TabType, label: 'War Games', icon: Target },
    { id: 'constellation' as TabType, label: 'Constellation', icon: Briefcase },
    { id: 'budget' as TabType, label: 'Budget', icon: DollarSign },
    { id: 'data-pulls' as TabType, label: 'Data Pulls', icon: Database }
  ];

  const handleCreateFromTemplate = (templateData: any) => {
    console.log('Creating project from template:', templateData);
  };

  const handleCreateNewProject = (projectData: any) => {
    console.log('Creating new project:', projectData);
  };

  const handleGenerateWeeklyPlan = (planData: any) => {
    console.log('Applying weekly plan:', planData);
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

  const getGradient = () => {
    if (isDarkMode) {
      return `linear-gradient(135deg, #FFFFFF 0%, ${pageTheme.accent} 100%)`;
    }
    return `linear-gradient(135deg, ${pageTheme.gradientFrom} 0%, ${pageTheme.accent} 50%, ${pageTheme.gradientTo} 100%)`;
  };
  
  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || Shield;

  return (
    <div className="h-full flex flex-col w-full relative overflow-hidden transition-colors duration-500">
      
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-pink-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div 
              className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-bl from-red-100/40 via-pink-50/20 to-transparent" 
              style={{ mixBlendMode: 'multiply' }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-tr from-orange-100/40 via-red-50/20 to-transparent" 
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
                    placeholder="Search projects, tasks, or resources..."
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
                                onClick={() => openPythia({ type: 'warroom', label: 'War Room Intel' })}
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
             <Shield 
               size={450} 
               color={isDarkMode ? "white" : pageTheme.accent} 
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
                                  color={isDarkMode ? "white" : pageTheme.accent} 
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
                          {tabTitles[activeTab]}
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
                            style={{ backgroundColor: isDarkMode ? 'rgba(255,255,255,0.6)' : pageTheme.accent }}
                        />
                        <p 
                            className="text-sm font-bold uppercase tracking-[0.2em]"
                            style={{ color: isDarkMode ? 'rgba(255,255,255,0.9)' : pageTheme.accent }}
                        >
                          CAMPAIGN OPERATIONS
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
                                  onClick={() => setActiveTab('projects')}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
                              >
                                  <Briefcase size={14} strokeWidth={2.5} />
                                  <span className="text-xs font-bold">12 Active Projects</span>
                              </button>
                              <button 
                                  onClick={() => setActiveTab('tasks')}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
                              >
                                  <Target size={14} strokeWidth={2.5} />
                                  <span className="text-xs font-bold">2 Critical Tasks</span>
                              </button>
                              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                                  <Clock size={14} strokeWidth={2.5} />
                                  <span className="text-xs font-bold">4 Due Today</span>
                              </div>
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
                               backgroundColor: isDarkMode ? 'white' : pageTheme.accent,
                               boxShadow: isDarkMode ? '0 0 15px rgba(255,255,255,0.8)' : `0 0 10px ${hexToRgba(pageTheme.accent, 0.4)}`
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
                      background: `linear-gradient(90deg, transparent, ${pageTheme.accent}, transparent)`,
                      opacity: 0.8
                    }}
                  />
                  <div 
                    className="absolute top-0 left-0 right-0 h-[1px]"
                    style={{
                      boxShadow: `0 0 15px 1px ${pageTheme.accent}`,
                      opacity: isScrolled ? 0.8 : 0.5
                    }}
                  />
               </>
           ) : (
               <div 
                 className="h-[1px] w-full"
                 style={{
                   background: `linear-gradient(90deg, transparent, ${hexToRgba(pageTheme.accent, 0.3)}, transparent)`,
                 }}
               />
           )}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 flex flex-col gap-8">
        
        {/* Sticky Toolbar Controls */}
        <div className={`sticky top-0 z-30 px-8 py-4 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
           <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto w-full">
              
              {/* Left: Search */}
              <div className="flex-1 max-w-md relative">
                 <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                 <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${tabTitles[activeTab]}...`} 
                    className={`
                       w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border transition-all
                       ${isDarkMode 
                           ? 'bg-white/5 border-white/5 focus:border-white/20 text-white placeholder:text-gray-600' 
                           : 'bg-white border-gray-200 focus:border-gray-300 text-gray-900 placeholder:text-gray-400'
                       }
                    `}
                 />
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-3">
                 {activeTab === 'projects' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setShowNewProjectModal(true)}
                      className="shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                      <Plus size={16} className="mr-2" />
                      New Project
                    </Button>
                 )}
                 {activeTab === 'overview' && (
                    <>
                      <label className={`flex items-center gap-2 text-sm font-medium cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input 
                          type="checkbox"
                          checked={overviewBulkMode}
                          onChange={(e) => setOverviewBulkMode(e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-transparent"
                        />
                        Bulk Mode
                      </label>
                      <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => setShowWeeklyPlanModal(true)}
                        className="shadow-lg shadow-blue-500/20 whitespace-nowrap"
                      >
                        <Calendar size={16} className="mr-2" />
                        Generate Weekly Plan
                      </Button>
                    </>
                 )}
                 {activeTab === 'field-events' && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {}}
                      className="shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Event
                    </Button>
                 )}
                 
                 <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => setShowTemplateModal(true)}
                    className="whitespace-nowrap"
                 >
                    <SlidersHorizontal size={16} className="mr-2" />
                    Templates
                 </Button>
              </div>
           </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow flex-shrink-0 basis-auto p-8 max-w-[1600px] mx-auto w-full min-h-0">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <OverviewTab 
                key="overview"
                filters={filters}
                searchQuery={searchQuery}
                bulkMode={overviewBulkMode}
              />
            )}
            
            {activeTab === 'projects' && (
              <ProjectsTab 
                key="projects"
                filters={filters}
                searchQuery={searchQuery}
              />
            )}
            
            {activeTab === 'field-events' && (
              <FieldEventsTab 
                key="field-events"
                filters={filters}
              />
            )}
            
            {activeTab === 'budget' && (
              <BudgetResourcesTab 
                key="budget"
              />
            )}

            {activeTab === 'data-pulls' && (
              <DataPullsHub key="data-pulls" />
            )}

            {activeTab === 'scenarios' && (
              <ScenarioBuilder key="scenarios" />
            )}

            {activeTab === 'constellation' && (
              <ConstellationMap key="constellation" />
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      {showTemplateModal && (
        <TemplateLibraryModal 
          onClose={() => setShowTemplateModal(false)}
          onCreate={handleCreateFromTemplate}
        />
      )}

      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onCreate={handleCreateNewProject}
        />
      )}

      {showWeeklyPlanModal && (
        <GenerateWeeklyPlanModal
          onClose={() => setShowWeeklyPlanModal(false)}
          onGenerate={handleGenerateWeeklyPlan}
        />
      )}

    </div>
  );
}
