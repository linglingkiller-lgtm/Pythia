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
  Database
} from 'lucide-react';
import { Button } from './ui/Button';
import { useTheme } from '../contexts/ThemeContext';
import { useAppMode } from '../contexts/AppModeContext';
import { OverviewTab } from './war-room/OverviewTab';
import { ProjectsTab } from './war-room/ProjectsTab';
import { FieldEventsTab } from './war-room/FieldEventsTab';
import { BudgetResourcesTab } from './war-room/BudgetResourcesTab';
import { ApplicantsTab } from './war-room/ApplicantsTab';
import { TemplateLibraryModal } from './war-room/TemplateLibraryModal';
import { NewProjectModal } from './war-room/NewProjectModal';
import { GenerateWeeklyPlanModal } from './war-room/GenerateWeeklyPlanModal';
import { DataPullsHub } from './war-room/data-pulls/DataPullsHub';
import { TabType } from './war-room/types';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';

export const WarRoom: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { appMode } = useAppMode();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showWeeklyPlanModal, setShowWeeklyPlanModal] = useState(false);
  
  // State for Overview Tab specific actions (Bulk Mode)
  const [overviewBulkMode, setOverviewBulkMode] = useState(false);

  // Scroll state for header animation
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        setIsScrolled(scrollContainerRef.current.scrollTop > 10);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [activeTab]);

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
    applicants: 'Applicants',
    'data-pulls': 'Data Pulls'
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'overview':
        return 'Command center dashboard';
      case 'projects':
        return 'Task & milestone tracking';
      case 'field-events':
        return 'Calendar & logistics';
      case 'budget':
        return 'Financial allocation';
      case 'applicants':
        return 'Onboarding & pipeline';
      case 'data-pulls':
        return 'Reporting & analytics';
      default:
        return 'Manage your campaign operations';
    }
  };

  const pageTheme = getPageTheme('War Room');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutGrid },
    { id: 'projects' as TabType, label: 'Projects', icon: ListChecks },
    { id: 'field-events' as TabType, label: 'Field & Events', icon: Calendar },
    { id: 'budget' as TabType, label: 'Budget', icon: DollarSign },
    { id: 'applicants' as TabType, label: 'Applicants', icon: Users },
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

  const FilterSelect = ({ value, onChange, options, icon: Icon }: any) => (
    <div className="relative group">
      <select 
        className={`
          appearance-none pl-9 pr-8 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer font-medium
          ${isDarkMode 
            ? 'bg-slate-800/50 border-slate-700 text-gray-200 hover:bg-slate-800 hover:border-slate-600' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
          }
        `}
        value={value}
        onChange={onChange}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className={`absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {Icon ? <Icon size={14} /> : <Filter size={14} />}
      </div>
      <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <ChevronDown size={14} />
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col w-full ${isDarkMode ? 'bg-slate-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Header - Sticky with Glassmorphism */}
        <motion.div
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isDarkMode
              ? 'bg-slate-900/40 border-b border-white/[0.08]'
              : 'bg-white/40 border-b border-gray-200/50'
          }`}
          style={{
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
          animate={{
            paddingTop: isScrolled ? '12px' : '24px',
            paddingBottom: isScrolled ? '12px' : '16px',
          }}
        >
          {/* Subtle gradient accent line */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: `linear-gradient(to right, transparent, ${hexToRgba(pageTheme.gradientFrom, 0.3)}, ${hexToRgba(pageTheme.gradientTo, 0.25)}, transparent)`,
            }}
          />

          <div className="px-8">
            {/* Top Header Row */}
            <div className="flex items-center justify-between mb-4">
              {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
              <div className="flex items-center gap-3">
                {/* Section Label Pill - "War Room" */}
                <motion.div
                  className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                  style={{
                    background: isDarkMode
                      ? `linear-gradient(135deg, ${hexToRgba(pageTheme.gradientFrom, 0.12)}, ${hexToRgba(pageTheme.gradientTo, 0.08)})`
                      : `linear-gradient(135deg, ${hexToRgba(pageTheme.gradientFrom, 0.08)}, ${hexToRgba(pageTheme.gradientTo, 0.06)})`,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: isDarkMode
                      ? hexToRgba(pageTheme.accent, 0.25)
                      : hexToRgba(pageTheme.accent, 0.2),
                    boxShadow: isDarkMode
                      ? `0 0 18px ${hexToRgba(pageTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                      : `0 0 12px ${hexToRgba(pageTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                  }}
                  whileHover={{
                    boxShadow: isDarkMode
                      ? `0 0 24px ${hexToRgba(pageTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                      : `0 0 18px ${hexToRgba(pageTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                  }}
                >
                  {/* Icon with subtle pulse */}
                  <div className="relative">
                    <Shield
                      className="w-4 h-4"
                      style={{
                        color: isDarkMode ? pageTheme.glow : pageTheme.accent,
                      }}
                    />
                    <div
                      className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{
                        backgroundColor: pageTheme.glow,
                      }}
                    />
                  </div>
                  <span
                    className="text-sm font-bold tracking-wide"
                    style={{
                      color: isDarkMode ? pageTheme.glow : pageTheme.accent,
                    }}
                  >
                    War Room
                  </span>
                </motion.div>

                {/* Subtle breadcrumb-style divider */}
                <span
                  className="text-sm font-medium"
                  style={{
                    color: isDarkMode
                      ? hexToRgba('#FFFFFF', 0.2)
                      : hexToRgba('#000000', 0.15),
                  }}
                >
                  /
                </span>

                {/* Title + Subtitle */}
                <div>
                  <motion.h1
                    className={`font-bold ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}
                    animate={{
                      fontSize: isScrolled ? '20px' : '28px',
                      marginBottom: isScrolled ? '0px' : '4px',
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {tabTitles[activeTab]}
                  </motion.h1>
                  <motion.p
                    className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-600'
                    }`}
                    animate={{
                      opacity: isScrolled ? 0 : 1,
                      height: isScrolled ? 0 : 'auto',
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {getTabSubtitle()}
                  </motion.p>
                </div>
              </div>

              {/* Right: Header Actions - Dynamic based on Tab */}
              <div className="flex items-center gap-3">
                {activeTab === 'overview' && (
                  <>
                    <label className={`flex items-center gap-2 text-sm font-medium mr-4 cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <input 
                        type="checkbox"
                        checked={overviewBulkMode}
                        onChange={(e) => setOverviewBulkMode(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-transparent"
                      />
                      Bulk Mode
                    </label>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => setShowWeeklyPlanModal(true)}
                      className="shadow-lg shadow-blue-500/20 whitespace-nowrap"
                    >
                      <Sparkles size={16} />
                      Generate Action Plan
                    </Button>
                  </>
                )}
                {activeTab === 'projects' && (
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => setShowNewProjectModal(true)}
                    className="shadow-lg shadow-blue-500/20 whitespace-nowrap"
                  >
                    <Plus size={16} />
                    New Project
                  </Button>
                )}
              </div>
            </div>

            {/* Subpage Selector - Horizontal Tabs */}
            <motion.div 
              className="flex items-center overflow-x-auto no-scrollbar"
              animate={{
                marginBottom: isScrolled ? '8px' : '12px',
              }}
              transition={{ duration: 0.25 }}
            >
              <div className={`flex items-center rounded-xl p-1 ${
                isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
              }`}>
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? isDarkMode
                            ? 'text-white shadow-lg'
                            : 'bg-white shadow-md'
                          : isDarkMode
                          ? 'text-gray-400 hover:text-white'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      style={
                        activeTab === tab.id
                          ? {
                              background: `linear-gradient(135deg, ${pageTheme.gradientFrom}, ${pageTheme.gradientTo})`,
                              boxShadow: isDarkMode
                                ? `0 4px 12px ${hexToRgba(pageTheme.glow, 0.3)}`
                                : `0 2px 8px ${hexToRgba(pageTheme.glow, 0.2)}`,
                            }
                          : {}
                      }
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden relative z-10">
          {activeTab === 'overview' ? (
            <OverviewTab 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery}
              filters={filters} 
              setFilters={setFilters}
              bulkMode={overviewBulkMode}
              setBulkMode={setOverviewBulkMode}
            />
          ) : activeTab === 'projects' ? (
            <ProjectsTab 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filters={filters}
              setFilters={setFilters}
              onNewProject={() => setShowNewProjectModal(true)}
            />
          ) : (
             <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="flex-1 p-6">
                  {activeTab === 'field-events' && <FieldEventsTab searchQuery={searchQuery} filters={filters} />}
                  {activeTab === 'budget' && <BudgetResourcesTab searchQuery={searchQuery} filters={filters} />}
                  {activeTab === 'applicants' && <ApplicantsTab searchQuery={searchQuery} filters={filters} />}
                  {activeTab === 'data-pulls' && <DataPullsHub searchQuery={searchQuery} filters={filters} />}
                </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showTemplateModal && (
        <TemplateLibraryModal onClose={() => setShowTemplateModal(false)} onCreate={handleCreateFromTemplate} />
      )}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} onCreate={handleCreateNewProject} />
      )}
      {showWeeklyPlanModal && (
        <GenerateWeeklyPlanModal onClose={() => setShowWeeklyPlanModal(false)} onGenerate={handleGenerateWeeklyPlan} />
      )}
    </div>
  );
};