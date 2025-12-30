import React from 'react';
import { Search, Plus, Download, Filter, X, LayoutGrid, Users as UsersIcon, UserCheck, Sparkles, TrendingUp, AlertCircle, CheckCircle, Calendar, Target, BarChart3, MessageSquare, GitBranch } from 'lucide-react';
import { LegislatorList } from './LegislatorList';
import { LegislatorProfile } from './LegislatorProfile';
import { QuickActionsCard } from './QuickActionsCard';
import { AIStrategyCard } from './AIStrategyCard';
import { LegislatorAlertsCard } from './LegislatorAlertsCard';
import { LogInteractionModal } from './LogInteractionModal';
import { ChamberControlCards } from './ChamberControlCards';
import { LeadershipSummary } from './LeadershipSummary';
import { OverviewDashboard } from './OverviewDashboard';
import { CommitteesTab } from './CommitteesTab';
import { mockLegislators, Legislator } from './legislatorData';
import { chamberData, leadershipPositions } from './chamberData';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { Chip } from '../ui/Chip';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

type ViewMode = 'overview' | 'members' | 'committees';

interface LegislatorsPageProps {
  initialLegislatorId?: string | null;
  onNavigateToBill?: (billId: string) => void;
  watchedLegislatorIds?: Set<string>;
  onToggleWatch?: (legislatorId: string) => void;
}

export function LegislatorsPage({ initialLegislatorId, onNavigateToBill, watchedLegislatorIds, onToggleWatch }: LegislatorsPageProps) {
  const [viewMode, setViewMode] = React.useState<ViewMode>('overview');
  const [selectedLegislator, setSelectedLegislator] = React.useState<Legislator | null>(() => {
    if (initialLegislatorId) {
      const found = mockLegislators.find(leg => leg.id === initialLegislatorId);
      return found || mockLegislators[0];
    }
    return mockLegislators[0];
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [showLogModal, setShowLogModal] = React.useState(false);
  const [filters, setFilters] = React.useState({
    chamber: 'all',
    party: 'all',
    priority: 'all',
    relationship: 'all',
    committee: 'all',
  });
  
  // Scroll state for header compression
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Update selected legislator when initialLegislatorId changes
  React.useEffect(() => {
    if (initialLegislatorId) {
      const found = mockLegislators.find(leg => leg.id === initialLegislatorId);
      if (found) {
        setSelectedLegislator(found);
        setViewMode('members'); // Switch to members view to show the profile
      }
    }
  }, [initialLegislatorId]);

  // Filter legislators based on search and filters
  const filteredLegislators = mockLegislators.filter((leg) => {
    const matchesSearch = searchQuery === '' || 
      leg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leg.committees.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesChamber = filters.chamber === 'all' || leg.chamber === filters.chamber;
    const matchesParty = filters.party === 'all' || leg.party === filters.party;
    const matchesPriority = filters.priority === 'all' || leg.priority === filters.priority;
    const matchesRelationship = filters.relationship === 'all' || leg.relationshipStatus === filters.relationship;

    return matchesSearch && matchesChamber && matchesParty && matchesPriority && matchesRelationship;
  });

  const handleClearFilters = () => {
    setFilters({
      chamber: 'all',
      party: 'all',
      priority: 'all',
      relationship: 'all',
      committee: 'all',
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  const handleSelectLegislatorFromLeadership = (legislatorId: string) => {
    const legislator = mockLegislators.find(l => l.id === legislatorId);
    if (legislator) {
      setSelectedLegislator(legislator);
      setViewMode('members');
    }
  };

  const { isDarkMode } = useTheme();

  // Get Legislators page theme
  const legislatorsTheme = getPageTheme('Legislators');

  // Dynamic title based on view mode
  const getPageTitle = () => {
    switch (viewMode) {
      case 'overview':
        return 'Overview';
      case 'members':
        return 'Members';
      case 'committees':
        return 'Committees';
      default:
        return 'Legislators';
    }
  };

  // Dynamic subtitle based on view mode
  const getSubtitle = () => {
    switch (viewMode) {
      case 'overview':
        return 'Chamber control, leadership & analytics';
      case 'members':
        return `${filteredLegislators.length}/${mockLegislators.length} members • Intelligence & engagement tracking`;
      case 'committees':
        return 'Committee membership & influence mapping';
      default:
        return 'Intelligence & engagement tracking';
    }
  };

  return (
    <div className={`h-full flex flex-col relative overflow-hidden transition-colors duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
        : 'bg-gradient-to-br from-red-50/30 via-white to-gray-50/30'
    }`}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500 ${
        isDarkMode
          ? 'bg-gradient-to-b from-red-900/20 to-transparent'
          : 'bg-gradient-to-b from-red-50/40 to-transparent'
      }`} />

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
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Legislators" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(legislatorsTheme.gradientFrom, 0.12)}, ${hexToRgba(legislatorsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(legislatorsTheme.gradientFrom, 0.08)}, ${hexToRgba(legislatorsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(legislatorsTheme.accent, 0.25)
                    : hexToRgba(legislatorsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(legislatorsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(legislatorsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(legislatorsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(legislatorsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <UserCheck
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? legislatorsTheme.glow : legislatorsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: legislatorsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? legislatorsTheme.glow : legislatorsTheme.accent,
                  }}
                >
                  Legislators
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
                  {getPageTitle()}
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
                  {getSubtitle()}
                </motion.p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                Export
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-red-600/90 text-white hover:bg-red-600 border border-red-500/30'
                    : 'bg-red-600 text-white hover:bg-red-700 border border-red-700/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Legislator
              </button>
            </div>
          </div>

          {/* Stats + Controls Row */}
          <motion.div
            className="flex items-center gap-2 pb-4"
            animate={{
              opacity: isScrolled ? 0.5 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Priority Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-yellow-900/10 border-yellow-500/20 hover:border-yellow-500/40'
                : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
            }`}>
              <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                12
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
                Priority A
              </span>
            </div>

            {/* Follow-ups Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-orange-900/10 border-orange-500/20 hover:border-orange-500/40'
                : 'bg-orange-50 border-orange-200 hover:border-orange-300'
            }`}>
              <UserCheck className={`w-3 h-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                8
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-orange-400/70' : 'text-orange-700'}`}>
                Follow-ups
              </span>
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Search - Only in Members mode */}
            {viewMode === 'members' && (
              <>
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search
                      className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
                        isDarkMode ? 'text-slate-500' : 'text-gray-400'
                      }`}
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search legislators..."
                      className={`w-full pl-8 pr-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/40 border-white/10 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-red-500/30'
                          : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-red-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Filters Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    showFilters
                      ? 'bg-red-600 text-white shadow-sm'
                      : isDarkMode
                      ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {activeFiltersCount > 0 ? `${activeFiltersCount}` : 'Filters'}
                </button>
              </>
            )}
          </motion.div>

          {/* View Mode Tabs - Prominent Full-Width Row */}
          <motion.div
            className={`flex items-center justify-start gap-2 pb-4 border-t pt-4 ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}
            animate={{
              opacity: isScrolled ? 0.7 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={() => setViewMode('overview')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'overview'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Overview
            </button>
            <button
              onClick={() => setViewMode('members')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'members'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <UsersIcon className="w-4 h-4" />
              Members
            </button>
            <button
              onClick={() => setViewMode('committees')}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                viewMode === 'committees'
                  ? isDarkMode
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20'
                  : isDarkMode
                  ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                  : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Committees
            </button>
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {viewMode === 'members' && showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4"
              >
                <div className={`pt-4 border-t grid grid-cols-5 gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Chamber
                    </label>
                    <select
                      value={filters.chamber}
                      onChange={e => setFilters({ ...filters, chamber: e.target.value })}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="House">House</option>
                      <option value="Senate">Senate</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Party
                    </label>
                    <select
                      value={filters.party}
                      onChange={e => setFilters({ ...filters, party: e.target.value })}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="R">Republican</option>
                      <option value="D">Democrat</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={e => setFilters({ ...filters, priority: e.target.value })}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="A">A - High</option>
                      <option value="B">B - Medium</option>
                      <option value="C">C - Low</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Relationship
                    </label>
                    <select
                      value={filters.relationship}
                      onChange={e => setFilters({ ...filters, relationship: e.target.value })}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="warm">Warm</option>
                      <option value="cold">Cold</option>
                      <option value="needs-follow-up">Needs Follow-up</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Committee
                    </label>
                    <select
                      value={filters.committee}
                      onChange={e => setFilters({ ...filters, committee: e.target.value })}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="energy">Energy</option>
                      <option value="education">Education</option>
                      <option value="appropriations">Appropriations</option>
                      <option value="health">Health</option>
                    </select>
                  </div>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={handleClearFilters}
                    className={`mt-3 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      isDarkMode
                        ? 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    Clear Filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Content Area - Conditional based on mode */}
      <div className="flex-1 overflow-y-auto relative z-10" ref={scrollRef}>
        {viewMode === 'overview' ? (
          /* Overview Mode */
          <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-500 ${
            isDarkMode ? 'bg-transparent' : 'bg-gradient-shift-subtle'
          }`}>
            {/* Chamber Control Cards */}
            <ChamberControlCards chambers={chamberData} />
            
            {/* Leadership Summary */}
            <LeadershipSummary
              positions={leadershipPositions}
              onSelectLegislator={handleSelectLegislatorFromLeadership}
            />
            
            {/* Overview Dashboard */}
            <OverviewDashboard
              legislators={mockLegislators}
              watchedLegislatorIds={watchedLegislatorIds}
              onSelectLegislator={handleSelectLegislatorFromLeadership}
            />
          </div>
        ) : viewMode === 'committees' ? (
          /* Committees Mode */
          <CommitteesTab onNavigateToLegislator={handleSelectLegislatorFromLeadership} />
        ) : (
          /* Members Mode - 3-Column Layout */
          <div className={`flex-1 flex overflow-hidden transition-colors duration-500 ${
            isDarkMode ? 'bg-transparent' : 'bg-gradient-shift-subtle'
          }`}>
            {/* Left: Legislator List */}
            <div className={`w-80 overflow-y-auto border-r transition-colors duration-500 ${
              isDarkMode
                ? 'bg-slate-900/40 backdrop-blur-sm border-white/10'
                : 'bg-white border-gray-200'
            }`}>
              <LegislatorList
                legislators={filteredLegislators}
                selectedLegislator={selectedLegislator}
                onSelectLegislator={setSelectedLegislator}
                watchedLegislatorIds={watchedLegislatorIds}
              />
            </div>

            {/* Center: Profile */}
            <div className="flex-1 overflow-y-auto bg-transparent">
              {selectedLegislator ? (
                <LegislatorProfile
                  legislator={selectedLegislator}
                  onLogInteraction={() => setShowLogModal(true)}
                  onNavigateToBill={onNavigateToBill}
                  watchedLegislatorIds={watchedLegislatorIds}
                  onToggleWatch={onToggleWatch}
                />
              ) : (
                <div className={`h-full flex items-center justify-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Select a legislator to view details
                </div>
              )}
            </div>

            {/* Right: Actions + AI + Alerts */}
            <div className={`w-80 overflow-y-auto border-l transition-colors duration-500 ${
              isDarkMode
                ? 'bg-slate-900/40 backdrop-blur-sm border-white/10'
                : 'bg-white border-gray-200'
            }`}>
              {selectedLegislator && (
                <div className="p-4 space-y-4">
                  <QuickActionsCard
                    legislator={selectedLegislator}
                    onLogInteraction={() => setShowLogModal(true)}
                    watchedLegislatorIds={watchedLegislatorIds}
                    onToggleWatch={onToggleWatch}
                  />
                  <AIStrategyCard legislator={selectedLegislator} />
                  <LegislatorAlertsCard legislator={selectedLegislator} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Log Interaction Modal */}
      {showLogModal && selectedLegislator && (
        <LogInteractionModal
          legislator={selectedLegislator}
          onClose={() => setShowLogModal(false)}
        />
      )}
    </div>
  );
}