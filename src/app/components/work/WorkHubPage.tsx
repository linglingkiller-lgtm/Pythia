import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  LayoutGrid, Users, FolderKanban, FileCheck, Search, Bell, Settings, User, Sparkles, Menu, ChevronDown, LogOut,
  Target, AlertCircle, CheckCircle2, Clock, Calendar, Briefcase, BarChart3, Mail, TrendingUp
} from 'lucide-react';
import { ModularMyWorkTab } from './ModularMyWorkTab';
import { ClientWorkTab } from './ClientWorkTab';
import { ProjectsTab } from './ProjectsTab';
import { DeliverablesTab } from './DeliverablesTab';
import { mockProjects, mockDeliverables } from '../../data/workHubData';
import { mockClients } from '../../data/clientsData';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { PageLayout } from '../ui/PageLayout';
import { useAskPythia } from '../../contexts/AskPythiaContext';

type WorkHubTab = 'my-work' | 'client-work' | 'projects' | 'deliverables';

interface WorkHubPageProps {
  onNavigateToClient?: (clientId: string) => void;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToChat?: (messageId: string) => void;
}

export function WorkHubPage({ onNavigateToClient, onNavigateToBill, onNavigateToChat }: WorkHubPageProps) {
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  
  // Page State
  const [activeTab, setActiveTab] = React.useState<WorkHubTab>('projects');
  
  // Customization State
  const [myWorkEditMode, setMyWorkEditMode] = useState(false);
  const [projectsEditMode, setProjectsEditMode] = useState(false);

  // Helper to determine active edit mode based on tab
  const isCustomizing = activeTab === 'my-work' ? myWorkEditMode : (activeTab === 'projects' ? projectsEditMode : false);
  
  const handleCustomize = () => {
    if (activeTab === 'my-work') setMyWorkEditMode(true);
    if (activeTab === 'projects') setProjectsEditMode(true);
  };

  const handleSaveCustomization = () => {
    if (activeTab === 'my-work') setMyWorkEditMode(false);
    if (activeTab === 'projects') setProjectsEditMode(false);
  };

  const handleCancelCustomization = () => {
    if (activeTab === 'my-work') setMyWorkEditMode(false);
    if (activeTab === 'projects') setProjectsEditMode(false);
  };

  // Header Logic
  const tabs = [
    { id: 'my-work' as const, label: 'My Work', icon: LayoutGrid },
    { id: 'client-work' as const, label: 'Client Work', icon: Users },
    { id: 'projects' as const, label: 'Projects', icon: FolderKanban },
    { id: 'deliverables' as const, label: 'Deliverables', icon: FileCheck },
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'my-work': return 'My Work';
      case 'client-work': return 'Client Work';
      case 'projects': return 'Projects';
      case 'deliverables': return 'Deliverables';
      default: return 'Project Hub';
    }
  };

  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'my-work': return 'Tasks & Assignments';
      case 'client-work': return 'Client Management';
      case 'projects': return 'Campaign Workflows';
      case 'deliverables': return 'Content Assets';
      default: return 'Manage your work';
    }
  };

  const getThemeKey = () => {
    switch (activeTab) {
      case 'my-work': return 'Dashboard';
      case 'client-work': return 'Clients';
      case 'projects': return 'Projects';
      case 'deliverables': return 'Records';
      default: return 'Settings';
    }
  };

  const currentThemeKey = getThemeKey();
  const currentTheme = getPageTheme(currentThemeKey);
  const ActiveIcon = tabs.find(t => t.id === activeTab)?.icon || LayoutGrid;

  // Calculate project statistics for Header
  const activeProjectsCount = mockProjects.filter(p => ['intake', 'discovery', 'strategy', 'execution', 'review'].includes(p.stage)).length;
  const atRiskProjectsCount = mockProjects.filter(p => p.status === 'at-risk' || p.status === 'overdue').length;
  const completedTasksCount = mockProjects.reduce((sum, p) => sum + p.completedTasks, 0);
  const totalTasksCount = mockProjects.reduce((sum, p) => sum + p.totalTasks, 0);

  // Calculate Client Stats
  const activeClientsCount = mockClients.filter(c => c.healthStatus !== 'red').length;
  const atRiskClientsCount = mockClients.filter(c => c.healthStatus === 'red' || c.healthStatus === 'yellow').length;
  const totalPipelineValue = mockClients.reduce((sum, c) => sum + c.contractValueMonthly, 0);

  // Calculate Deliverable Stats
  const inReviewDeliverables = mockDeliverables.filter(d => d.status === 'internal-review').length;
  const readyDeliverables = mockDeliverables.filter(d => d.status === 'client-ready').length;
  const sentDeliverables = mockDeliverables.filter(d => d.status === 'sent').length;

  // Render tab-specific stats
  const renderTabStats = () => {
    switch (activeTab) {
      case 'my-work':
        return (
          <motion.div 
             layoutId="dynamicIsland"
             className="flex items-center gap-3"
          >
              <button 
                  onClick={() => setActiveTab('my-work')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
              >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">12 Tasks Due</span>
              </button>
              <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
              >
                  <AlertCircle size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">3 High Priority</span>
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                  <Clock size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">4.5 hrs Tracked</span>
              </div>
          </motion.div>
        );

      case 'client-work':
        return (
          <motion.div 
             layoutId="dynamicIsland"
             className="flex items-center gap-3"
          >
              <button 
                  onClick={() => setActiveTab('client-work')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
              >
                  <Users size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{activeClientsCount} Active Clients</span>
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700'}`}>
                  <TrendingUp size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">${(totalPipelineValue / 1000).toFixed(0)}k Monthly</span>
              </div>
              {atRiskClientsCount > 0 && (
                <button 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
                >
                    <AlertCircle size={14} strokeWidth={2.5} />
                    <span className="text-xs font-bold">{atRiskClientsCount} At Risk</span>
                </button>
              )}
          </motion.div>
        );

      case 'deliverables':
        return (
          <motion.div 
             layoutId="dynamicIsland"
             className="flex items-center gap-3"
          >
              <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'}`}
              >
                  <FileCheck size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{inReviewDeliverables} In Review</span>
              </button>
              <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'}`}
              >
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{readyDeliverables} Ready</span>
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-700'}`}>
                  <Mail size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{sentDeliverables} Sent</span>
              </div>
          </motion.div>
        );

      case 'projects':
      default:
        return (
          <motion.div 
             layoutId="dynamicIsland"
             className="flex items-center gap-3"
          >
              <button 
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'}`}
              >
                  <Target size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{activeProjectsCount} Active</span>
              </button>
              <button 
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
              >
                  <AlertCircle size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{atRiskProjectsCount} At Risk</span>
              </button>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                  <CheckCircle2 size={14} strokeWidth={2.5} />
                  <span className="text-xs font-bold">{completedTasksCount}/{totalTasksCount} Tasks</span>
              </div>
          </motion.div>
        );
    }
  };

  const pageActions = (
    <div className="flex items-center gap-8 pb-1.5 pr-12">
        {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        const TabIcon = tab.icon;
        
        return (
            <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative py-2 outline-none group flex items-center gap-2"
            >
            <TabIcon 
                size={16} 
                className={`transition-colors duration-300 ${
                isActive 
                    ? (isDarkMode ? 'text-white' : 'text-gray-900') 
                    : (isDarkMode ? 'text-gray-500 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-600')
                }`}
                strokeWidth={isActive ? 2.5 : 2}
            />
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
  );

  return (
    <PageLayout
      title={getPageTitle()}
      subtitle={getTabSubtitle()}
      accentColor={currentTheme.accent}
      headerIcon={
        <ActiveIcon 
          size={28} 
          color={isDarkMode ? "white" : currentTheme.accent} 
          strokeWidth={2.5}
          className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
        />
      }
      backgroundImage={
        <ActiveIcon 
          size={450} 
          color={isDarkMode ? "white" : currentTheme.accent} 
          strokeWidth={0.5}
        />
      }
      headerContent={renderTabStats()}
      pageActions={pageActions}
      contentClassName="flex-1 overflow-y-auto"

      // Customization Hooks
      onCustomize={(activeTab === 'my-work' || activeTab === 'projects') ? handleCustomize : undefined}
      isCustomizing={isCustomizing}
      onSaveCustomization={handleSaveCustomization}
      onCancelCustomization={handleCancelCustomization}
    >
      <div className="p-8 max-w-[1920px] mx-auto min-h-full">
        <AnimatePresence mode="wait">
          {activeTab === 'my-work' && (
            <ModularMyWorkTab 
              key="my-work"
              onNavigateToClient={onNavigateToClient}
              onNavigateToBill={onNavigateToBill}
              // Pass customization state down
              isEditMode={myWorkEditMode}
              setIsEditMode={setMyWorkEditMode}
            />
          )}
          {activeTab === 'client-work' && (
            <ClientWorkTab 
              key="client-work"
              onNavigateToClient={onNavigateToClient}
            />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab 
              key="projects" 
              // Pass customization state down
              isEditMode={projectsEditMode}
              setIsEditMode={setProjectsEditMode}
            />
          )}
          {activeTab === 'deliverables' && (
            <DeliverablesTab key="deliverables" />
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
