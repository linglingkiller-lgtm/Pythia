import React from 'react';
import { Search, Download, FileText, Users, BarChart } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TeamKpiStrip } from '../components/managers/TeamKpiStrip';
import { TeamWorkloadTable } from '../components/managers/TeamWorkloadTable';
import { ManagerActionCenter } from '../components/managers/ManagerActionCenter';
import { EmployeeManagerDrawer } from '../components/managers/EmployeeManagerDrawer';
import { WorkloadRebalanceWizard } from '../components/managers/WorkloadRebalanceWizard';
import { 
  mockTeamMembers, 
  mockManagerActions,
  getTeamKPIs,
  type TeamMember 
} from '../data/teamData';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { getPageTheme, hexToRgba } from '../config/pageThemes';

type ViewMode = 'table' | 'kanban';
type TimeWindow = 'week' | 'month' | 'quarter';

export function ManagerConsolePage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [departmentFilter, setDepartmentFilter] = React.useState<string>('all');
  const [teamFilter, setTeamFilter] = React.useState<string>('all');
  const [timeWindow, setTimeWindow] = React.useState<TimeWindow>('week');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [viewMode, setViewMode] = React.useState<ViewMode>('table');
  const [isScrolled, setIsScrolled] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  const [selectedEmployee, setSelectedEmployee] = React.useState<TeamMember | null>(null);
  const [showRebalanceWizard, setShowRebalanceWizard] = React.useState(false);
  const [showReviewNote, setShowReviewNote] = React.useState(false);

  const { isDarkMode } = useTheme();

  // Get Team page theme
  const teamTheme = getPageTheme('Team');

  // Scroll detection
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 20);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Dynamic subtitle based on filters and stats
  const getSubtitle = () => {
    const total = filteredMembers.length;
    const overloaded = filteredMembers.filter(m => m.status === 'overloaded').length;
    return `${total} team members • ${overloaded} overloaded • ${timeWindow === 'week' ? 'Weekly' : timeWindow === 'month' ? 'Monthly' : 'Quarterly'} view`;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-indigo-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Sticky Header */}
      <motion.div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? isDarkMode
              ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 shadow-lg'
              : 'bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg'
            : isDarkMode
            ? 'bg-slate-900/40 backdrop-blur-sm'
            : 'bg-white/40 backdrop-blur-sm'
        }`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Team" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(teamTheme.gradientFrom, 0.12)}, ${hexToRgba(teamTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(teamTheme.gradientFrom, 0.08)}, ${hexToRgba(teamTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(teamTheme.accent, 0.25)
                    : hexToRgba(teamTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(teamTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(teamTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(teamTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(teamTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <Users
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? teamTheme.glow : teamTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: teamTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? teamTheme.glow : teamTheme.accent,
                  }}
                >
                  Team
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
                  initial={{ fontSize: '2rem', lineHeight: '2.5rem' }}
                  animate={{ 
                    fontSize: isScrolled ? '1.5rem' : '2rem',
                    lineHeight: isScrolled ? '2rem' : '2.5rem'
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className={isDarkMode ? 'text-white' : 'text-gray-900'}
                  style={{ fontFamily: '"Corpline", sans-serif' }}
                >
                  Team Overview
                </motion.h1>
                <motion.p
                  initial={{ opacity: 1, height: 'auto' }}
                  animate={{ 
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto'
                  }}
                  transition={{ duration: 0.2 }}
                  className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} overflow-hidden`}
                >
                  {getSubtitle()}
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportSnapshot}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <Download size={16} />
                Weekly Snapshot
              </button>
              <button
                onClick={handleCreateReviewNote}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 border border-white/10'
                    : 'bg-white/80 text-gray-700 hover:bg-gray-50 border border-gray-200'
                } shadow-sm hover:shadow-md`}
              >
                <FileText size={16} />
                Create Review Note
              </button>
              <button
                onClick={() => setShowRebalanceWizard(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-lg ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                }`}
              >
                <BarChart size={16} />
                Rebalance
              </button>
            </div>
          </div>

          {/* Gradient Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mb-4" />

          {/* Search & Filters */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee, client, project…"
                className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all ${
                  isDarkMode
                    ? 'bg-slate-800/50 border border-white/10 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                    : 'bg-white/80 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                } focus:outline-none`}
              />
            </div>

            {/* Department Filter */}
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-white/10 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white/80 border border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              } focus:outline-none`}
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-white/10 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white/80 border border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              } focus:outline-none`}
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
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-white/10 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white/80 border border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              } focus:outline-none`}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDarkMode
                  ? 'bg-slate-800/50 border border-white/10 text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                  : 'bg-white/80 border border-gray-200 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
              } focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="overloaded">Overloaded</option>
              <option value="on-track">On Track</option>
              <option value="underutilized">Underutilized</option>
            </select>

            {/* View Mode Toggle */}
            <div className={`flex items-center gap-1 p-1 rounded-lg ${
              isDarkMode ? 'bg-slate-800/50' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'table'
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-purple-700 shadow-md'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                  viewMode === 'kanban'
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                      : 'bg-white text-purple-700 shadow-md'
                    : isDarkMode
                    ? 'text-gray-400 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Kanban
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPI Strip */}
      <TeamKpiStrip kpis={kpis} />

      {/* Scrollable Content Area */}
      <div ref={containerRef} className="flex-1 overflow-y-auto">
        {/* Main Body: Split View */}
        <div className="flex gap-6 p-6">
          {/* Left: Team Workload (70%) */}
          <div className="flex-[7] overflow-hidden">
            <TeamWorkloadTable
              members={filteredMembers}
              viewMode={viewMode}
              onSelectEmployee={setSelectedEmployee}
            />
          </div>

          {/* Right: Manager Actions (30%) */}
          <div className="flex-[3] overflow-hidden">
            <ManagerActionCenter
              actions={mockManagerActions}
              onActionClick={(action) => {
                console.log('Action clicked:', action);
              }}
            />
          </div>
        </div>
      </div>

      {/* Employee Manager Drawer */}
      {selectedEmployee && (
        <EmployeeManagerDrawer
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      {/* Workload Rebalance Wizard */}
      {showRebalanceWizard && (
        <WorkloadRebalanceWizard
          members={mockTeamMembers}
          onClose={() => setShowRebalanceWizard(false)}
          onSave={(plan) => {
            console.log('Rebalance plan:', plan);
            setShowRebalanceWizard(false);
          }}
        />
      )}

      {/* Review Note Modal */}
      {showReviewNote && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`rounded-lg shadow-xl max-w-2xl w-full p-6 ${
            isDarkMode ? 'bg-slate-800' : 'bg-white'
          }`}>
            <h3 className={`text-lg mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: '"Corpline", sans-serif' }}>
              Create Review Note
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Employee
                </label>
                <select className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? 'bg-slate-700 border-white/10 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}>
                  {mockTeamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Note
                </label>
                <textarea
                  rows={6}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    isDarkMode
                      ? 'bg-slate-700 border-white/10 text-white placeholder-gray-500'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="Enter review note or observation..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="secondary" onClick={() => setShowReviewNote(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setShowReviewNote(false)}>
                Save Note
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}