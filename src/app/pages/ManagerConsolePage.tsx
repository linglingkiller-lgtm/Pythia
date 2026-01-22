import React, { useState, useRef, useEffect } from 'react';
import { Search, Download, FileText, Users, BarChart, Plus, LayoutGrid, List, AlertCircle, Settings, CheckCircle2, Clock, Calendar, TrendingUp, Bell, Sparkles, Menu, ChevronDown, Mail, Target } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TeamKpiStrip } from '../components/managers/TeamKpiStrip';
import { TeamWorkloadTable } from '../components/managers/TeamWorkloadTable';
import { ManagerActionCenter } from '../components/managers/ManagerActionCenter';
import { EmployeeManagerDrawer } from '../components/managers/EmployeeManagerDrawer';
import { WorkloadRebalanceWizard } from '../components/managers/WorkloadRebalanceWizard';
import { NotificationDropdown } from '../components/notifications/NotificationDropdown';
import { TeamDashboardGrid } from '../components/managers/TeamDashboardGrid';
import { TeamRosterTab } from '../components/managers/TeamRosterTab';
import { ApplicantsTab } from '../components/managers/ApplicantsTab';
import { 
  mockTeamMembers, 
  mockManagerActions,
  getTeamKPIs,
  type TeamMember 
} from '../data/teamData';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';
import { useAuth } from '../contexts/AuthContext';
import { useAskPythia } from '../contexts/AskPythiaContext';
import avatarImage from 'figma:asset/c278fa1e6d9bae0e4f1b290e5476030cc0cf1f2f.png';
import { PageLayout } from '../components/ui/PageLayout';

type ViewMode = 'table' | 'kanban' | 'dashboard';
type TimeWindow = 'week' | 'month' | 'quarter';

export function ManagerConsolePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('all');
  const [teamFilter, setTeamFilter] = React.useState<string>('all');
  const [timeWindow, setTimeWindow] = React.useState<TimeWindow>('week');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  
  // Tab/View State
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const viewMode = activeTab as ViewMode;

  // Customization State
  const [isEditMode, setIsEditMode] = React.useState(false);

  const [selectedEmployee, setSelectedEmployee] = React.useState<TeamMember | null>(null);
  const [showRebalanceWizard, setShowRebalanceWizard] = React.useState(false);
  const [showReviewNote, setShowReviewNote] = React.useState(false);
  
  // Header State
  const { openPythia } = useAskPythia();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]); // Mock notifications

  const { isDarkMode } = useTheme();
  const currentTheme = getPageTheme('Team');

  // Filter team members
  const filteredMembers = React.useMemo(() => {
    let results = [...mockTeamMembers];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(member =>
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.currentTopClients.some(client => client.toLowerCase().includes(query))
      );
    }

    // Department filter
    if (departmentFilter !== 'all') {
      results = results.filter(member =>
        member.departments.includes(departmentFilter as any)
      );
    }

    // Team filter
    if (teamFilter !== 'all') {
      results = results.filter(member => member.team === teamFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      results = results.filter(member => member.status === statusFilter);
    }

    return results;
  }, [searchQuery, departmentFilter, teamFilter, statusFilter]);

  const kpis = getTeamKPIs(filteredMembers);

  const handleExportSnapshot = () => {
    console.log('Export weekly workload snapshot');
    // TODO: Create record in Records system
  };

  const handleCreateReviewNote = () => {
    setShowReviewNote(true);
  };

  // Header Helpers
  const getPageTitle = () => "Team & Operations";
  const getTabSubtitle = () => {
    switch(activeTab) {
      case 'roster': return "Access Control & Invites";
      case 'applicants': return "Pipeline & Recruiting";
      default: return "Workforce & Capacity";
    }
  };
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'table', label: 'List View' },
    { id: 'kanban', label: 'Board View' },
    { id: 'roster', label: 'Roster & Access' },
    { id: 'applicants', label: 'Applicants' }
  ];

  const ActiveIcon = activeTab === 'kanban' ? LayoutGrid : (activeTab === 'dashboard' ? BarChart : (activeTab === 'roster' ? Users : (activeTab === 'applicants' ? Users : List)));

  const renderTabStats = () => (
    <div className="flex items-center gap-6 text-sm font-medium">
      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <Users size={16} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />
        <span>{filteredMembers.length} Members</span>
      </div>
      <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <AlertCircle size={16} className={filteredMembers.some(m => m.status === 'overloaded') ? 'text-red-500' : 'text-gray-400'} />
        <span>{filteredMembers.filter(m => m.status === 'overloaded').length} Overloaded</span>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // Dynamic Island Notification Demo (Team Context)
  // --------------------------------------------------------------------------
  
  interface DemoNotification {
    id: string;
    text: string;
    icon: React.ElementType;
    color: string;
  }

  const demoNotifications: DemoNotification[] = [
    { id: '1', text: "Sarah requested PTO for next week", icon: Calendar, color: 'text-purple-500' },
    { id: '2', text: "New hire onboarding 85% complete", icon: CheckCircle2, color: 'text-green-500' },
    { id: '3', text: "Lobbying Team meeting in 15m", icon: Clock, color: 'text-orange-500' },
    { id: '4', text: "3 Monthly Reviews due today", icon: FileText, color: 'text-blue-500' },
    { id: '5', text: "Capacity alert: Policy Team at 95%", icon: AlertCircle, color: 'text-red-500' },
  ];

  const [dynamicNotification, setDynamicNotification] = useState<DemoNotification | null>(null);
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    // Start the loop
    const interval = setInterval(() => {
      const notif = demoNotifications[demoIndex];
      setDynamicNotification(notif);
      
      // Advance index
      setDemoIndex(prev => (prev + 1) % demoNotifications.length);

      // Clear after 5 seconds
      setTimeout(() => {
        setDynamicNotification(null);
      }, 5000);

    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [demoIndex]);

  return (
    <PageLayout
      title={getPageTitle()}
      subtitle={getTabSubtitle()}
      headerIcon={<ActiveIcon size={28} className={isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} />}
      backgroundImage={<ActiveIcon size={450} color={isDarkMode ? 'white' : currentTheme.accent} strokeWidth={0.5} />}
      accentColor={currentTheme.accent}
      contentClassName="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
      
      // Customization Hooks
      onCustomize={activeTab === 'dashboard' ? () => setIsEditMode(true) : undefined}
      isCustomizing={isEditMode}
      onSaveCustomization={() => setIsEditMode(false)}
      onCancelCustomization={() => setIsEditMode(false)}

      headerContent={
        <div className="flex flex-col items-center gap-4">
            <AnimatePresence mode="wait">
                <motion.div 
                key={dynamicNotification ? 'notification' : activeTab}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`hidden xl:flex items-center h-10`}
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
                        // Default Tab Stats
                        renderTabStats()
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-8">
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
      }
    >
      {/* Filters & Actions Bar */}
      <div className={`px-8 py-3 border-b flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors duration-300 ${
           isDarkMode 
             ? 'bg-[#0a0a0b]/90 backdrop-blur-xl border-white/5' 
             : 'bg-white/90 backdrop-blur-xl border-gray-200'
      }`}>
          {/* Left: Filters */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team..."
                className={`
                   pl-8 pr-3 py-1.5 text-xs rounded-lg outline-none border transition-all w-48
                   ${isDarkMode 
                      ? 'bg-[#121214] border-white/10 focus:border-purple-500/50 text-white placeholder:text-gray-600' 
                      : 'bg-white border-gray-200 focus:border-purple-500/50 text-gray-900 placeholder:text-gray-400'
                   }
                `}
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-[#121214] border-white/10 text-gray-300 focus:border-purple-500/50'
                  : 'bg-white border-gray-200 text-gray-700 focus:border-purple-500/50'
              }`}
            >
              <option value="all">All Departments</option>
              <option value="lobbying">Lobbying</option>
              <option value="public-affairs">Public Affairs</option>
              <option value="campaign-services">Campaign Services</option>
            </select>

            {/* Team Filter */}
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-[#121214] border-white/10 text-gray-300 focus:border-purple-500/50'
                  : 'bg-white border-gray-200 text-gray-700 focus:border-purple-500/50'
              }`}
            >
              <option value="all">All Teams</option>
              <option value="Lobbying Team">Lobbying Team</option>
              <option value="Policy Team">Policy Team</option>
              <option value="Canvassing Operations">Canvassing Operations</option>
              <option value="Communications Team">Communications Team</option>
            </select>
            
            {/* Time Window */}
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e.target.value as TimeWindow)}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium border outline-none cursor-pointer ${
                isDarkMode
                  ? 'bg-[#121214] border-white/10 text-gray-300 focus:border-purple-500/50'
                  : 'bg-white border-gray-200 text-gray-700 focus:border-purple-500/50'
              }`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleExportSnapshot}
              variant="outline" 
              size="sm" 
              className={`
                h-8 text-xs font-medium gap-1.5
                ${isDarkMode ? 'border-white/10 bg-white/5 hover:bg-white/10' : ''}
              `}
            >
              <Download size={14} />
              Export
            </Button>
            <Button 
              onClick={() => setShowRebalanceWizard(true)}
              variant="default" 
              size="sm" 
              className="h-8 text-xs font-medium gap-1.5 bg-yellow-600 hover:bg-yellow-700 text-black border-none"
            >
              <Users size={14} />
              Rebalance Workload
            </Button>
          </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
          
          {/* KPI Strip */}
          <TeamKpiStrip kpis={kpis} />

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
                {isEditMode && (
                    <div className="flex justify-center">
                        <button
                            className={`
                                flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all w-full max-w-2xl
                                ${isDarkMode 
                                ? 'border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/5 text-gray-500 hover:text-yellow-400' 
                                : 'border-gray-300 hover:border-yellow-500 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600'
                                }
                            `}
                        >
                            <div className={`p-4 rounded-full ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                                <Plus size={32} />
                            </div>
                            <span className="font-medium">Add Widget</span>
                        </button>
                    </div>
                )}
                <TeamDashboardGrid 
                    members={filteredMembers} 
                    kpis={kpis}
                    onSelectEmployee={setSelectedEmployee}
                />
            </div>
          )}

          {activeTab === 'table' && (
            <TeamWorkloadTable 
              members={filteredMembers} 
              onSelectEmployee={setSelectedEmployee}
            />
          )}

          {activeTab === 'kanban' && (
            <ManagerActionCenter 
              actions={mockManagerActions}
              onResolve={(id) => console.log('Resolve', id)}
            />
          )}

          {activeTab === 'roster' && (
            <TeamRosterTab 
              members={mockTeamMembers}
              onSelectMember={setSelectedEmployee}
            />
          )}

          {activeTab === 'applicants' && (
            <ApplicantsTab />
          )}
      </div>

      {/* Employee Drawer */}
      {selectedEmployee && (
        <EmployeeManagerDrawer 
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onCreateReview={handleCreateReviewNote}
        />
      )}

      {/* Rebalance Wizard */}
      {showRebalanceWizard && (
        <WorkloadRebalanceWizard
          isOpen={showRebalanceWizard}
          onClose={() => setShowRebalanceWizard(false)}
          overloadedMembers={filteredMembers.filter(m => m.status === 'overloaded')}
          availableMembers={filteredMembers.filter(m => m.status === 'underutilized')}
        />
      )}
    </PageLayout>
  );
}
