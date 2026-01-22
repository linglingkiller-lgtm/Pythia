import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Filter, X, User, LayoutGrid, Users, GitBranch, Bell, Clock, Plus } from 'lucide-react';
import { LegislatorList } from './LegislatorList';
import { LegislatorProfile } from './LegislatorProfile';
import { ChamberControlCards } from './ChamberControlCards';
import { LeadershipSummary } from './LeadershipSummary';
import { OverviewDashboard } from './OverviewDashboard';
import { CommitteesTab } from './CommitteesTab';
import { mockLegislators, Legislator } from './legislatorData';
import { chamberData, leadershipPositions } from './chamberData';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { PageLayout } from '../ui/PageLayout';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';

type ViewMode = 'overview' | 'members' | 'committees';

interface LegislatorsPageProps {
  initialLegislatorId?: string | null;
  onNavigateToBill?: (billId: string) => void;
  onNavigateToElections?: (legislatorId: string) => void;
  watchedLegislatorIds?: Set<string>;
  onToggleWatch?: (legislatorId: string) => void;
  initialFilters?: { party?: string; chamber?: string; relationship?: string; priority?: string };
}

export function LegislatorsPage({ initialLegislatorId, onNavigateToBill, onNavigateToElections, watchedLegislatorIds, onToggleWatch, initialFilters }: LegislatorsPageProps) {
  const { isDarkMode } = useTheme();

  // Page State
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Customization State
  const [isEditMode, setIsEditMode] = useState(false);

  // Legislator State
  const [selectedLegislator, setSelectedLegislator] = useState<Legislator | null>(() => {
    if (initialLegislatorId) {
      const found = mockLegislators.find(leg => leg.id === initialLegislatorId);
      return found || mockLegislators[0];
    }
    return mockLegislators[0];
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination & Performance
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    chamber: initialFilters?.chamber || 'all',
    party: initialFilters?.party || 'all',
    priority: initialFilters?.priority || 'all',
    relationship: initialFilters?.relationship || 'all',
    committee: 'all',
  });

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, filters, viewMode]);

  // Update filters when initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      setFilters(prev => ({
        ...prev,
        ...initialFilters,
        // Reset 'all' if not provided
        chamber: initialFilters.chamber || prev.chamber,
        party: initialFilters.party || prev.party,
        priority: initialFilters.priority || prev.priority,
        relationship: initialFilters.relationship || prev.relationship,
      }));
      if (Object.keys(initialFilters).length > 0) {
          setShowFilters(true);
          setViewMode('members'); // Switch to members view to see the list
      }
    }
  }, [initialFilters]);

  // Update selected legislator when initialLegislatorId changes
  useEffect(() => {
    if (initialLegislatorId) {
      const found = mockLegislators.find(leg => leg.id === initialLegislatorId);
      if (found) {
        setSelectedLegislator(found);
        setViewMode('members');
      }
    }
  }, [initialLegislatorId]);

  // Filter legislators (Memoized)
  const filteredLegislators = useMemo(() => {
    return mockLegislators.filter((leg) => {
      const matchesSearch = debouncedSearchQuery === '' || 
        leg.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        leg.district.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        leg.committees.some(c => c.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));

      const matchesChamber = filters.chamber === 'all' || leg.chamber === filters.chamber;
      const matchesParty = filters.party === 'all' || leg.party === filters.party;
      const matchesPriority = filters.priority === 'all' || leg.priority === filters.priority;
      const matchesRelationship = filters.relationship === 'all' || leg.relationshipStatus === filters.relationship;

      return matchesSearch && matchesChamber && matchesParty && matchesPriority && matchesRelationship;
    });
  }, [debouncedSearchQuery, filters]);

  const displayedLegislators = filteredLegislators.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedLegislators.length < filteredLegislators.length;

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

  const handleSelectLegislator = (legislatorId: string) => {
      const legislator = mockLegislators.find(l => l.id === legislatorId);
      if (legislator) {
        setSelectedLegislator(legislator);
        setViewMode('members');
      }
  };

  // --- Header Config ---
  const currentTheme = getPageTheme('Legislators');
  
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

  const ActiveIcon = tabs.find(t => t.id === viewMode)?.icon || LayoutGrid;

  const headerContent = (
    <div className="flex items-center gap-6">
       {/* Stats */}
       <div className="hidden xl:flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
              <Bell size={14} />
              <span className="text-xs font-bold">3 Critical Alerts</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
              <Clock size={14} />
              <span className="text-xs font-bold">2 Updates Today</span>
          </div>
       </div>

       {/* Divider */}
       <div className={`hidden xl:block h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

       {/* Tabs */}
       <div className="flex items-center gap-6">
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
  );

  return (
    <PageLayout
      title={getPageTitle()}
      subtitle={getTabSubtitle()}
      headerIcon={<ActiveIcon size={28} className={isDarkMode ? 'text-white' : 'text-indigo-600'} />}
      backgroundImage={<ActiveIcon size={450} color={isDarkMode ? 'white' : currentTheme.accent} strokeWidth={0.5} />}
      accentColor={currentTheme.accent}
      headerContent={headerContent}
      contentClassName="flex-1 overflow-y-auto overflow-x-hidden relative z-10 custom-scrollbar flex flex-col"

      // Customization Hooks
      onCustomize={viewMode === 'overview' ? () => setIsEditMode(true) : undefined}
      isCustomizing={isEditMode}
      onSaveCustomization={() => setIsEditMode(false)}
      onCancelCustomization={() => setIsEditMode(false)}
    >
         {/* Sub-header Controls for Members View */}
         {viewMode === 'members' && (
             <div className={`sticky top-0 z-30 px-8 py-4 backdrop-blur-md border-b transition-all ${isDarkMode ? 'bg-[#09090b]/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
                <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between">
                   {/* Search */}
                   <div className="flex-1 max-w-md relative">
                      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <input 
                         type="text" 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         placeholder="Filter members..." 
                         className={`
                            w-full pl-9 pr-4 py-2 text-sm rounded-lg outline-none border transition-all
                            ${isDarkMode 
                               ? 'bg-white/5 border-white/10 text-white focus:border-white/20 placeholder-gray-500' 
                               : 'bg-white border-gray-200 text-gray-900 focus:border-indigo-500 placeholder-gray-400'
                            }
                         `}
                      />
                   </div>

                   {/* Filters */}
                   <div className="flex items-center gap-3">
                      <button 
                         onClick={() => setShowFilters(!showFilters)}
                         className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm border transition-all
                            ${showFilters 
                               ? (isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700')
                               : (isDarkMode ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900')
                            }
                         `}
                      >
                         <Filter size={16} />
                         <span>Filters</span>
                         {activeFiltersCount > 0 && (
                            <span className={`px-1.5 py-0.5 text-[10px] rounded-full ${isDarkMode ? 'bg-indigo-500 text-white' : 'bg-indigo-600 text-white'}`}>
                               {activeFiltersCount}
                            </span>
                         )}
                      </button>
                      
                      {activeFiltersCount > 0 && (
                         <button
                            onClick={handleClearFilters}
                            className={`
                               p-2 rounded-lg transition-colors
                               ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-red-600'}
                            `}
                            title="Clear filters"
                         >
                            <X size={16} />
                         </button>
                      )}
                   </div>
                </div>

                {/* Expanded Filters */}
                <AnimatePresence>
                   {showFilters && (
                      <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: 'auto', opacity: 1 }}
                         exit={{ height: 0, opacity: 0 }}
                         className="overflow-hidden"
                      >
                         <div className="pt-4 grid grid-cols-5 gap-4 max-w-[1600px] mx-auto">
                            {/* Chamber Filter */}
                            <div className="space-y-1">
                               <label className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Chamber</label>
                               <select 
                                  value={filters.chamber}
                                  onChange={(e) => setFilters(prev => ({ ...prev, chamber: e.target.value }))}
                                  className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                               >
                                  <option value="all">All Chambers</option>
                                  <option value="Senate">Senate</option>
                                  <option value="House">House</option>
                               </select>
                            </div>
                            
                            {/* Party Filter */}
                            <div className="space-y-1">
                               <label className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Party</label>
                               <select 
                                  value={filters.party}
                                  onChange={(e) => setFilters(prev => ({ ...prev, party: e.target.value }))}
                                  className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                               >
                                  <option value="all">All Parties</option>
                                  <option value="Republican">Republican</option>
                                  <option value="Democrat">Democrat</option>
                               </select>
                            </div>

                            {/* Relationship Filter */}
                            <div className="space-y-1">
                               <label className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Relationship</label>
                               <select 
                                  value={filters.relationship}
                                  onChange={(e) => setFilters(prev => ({ ...prev, relationship: e.target.value }))}
                                  className={`w-full p-2 rounded-lg text-sm outline-none border ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                               >
                                  <option value="all">All Statuses</option>
                                  <option value="Friendly">Friendly</option>
                                  <option value="Neutral">Neutral</option>
                                  <option value="Hostile">Hostile</option>
                                  <option value="Unknown">Unknown</option>
                               </select>
                            </div>
                         </div>
                      </motion.div>
                   )}
                </AnimatePresence>
             </div>
         )}
         
         <div className={`p-8 pb-24 w-full ${viewMode === 'members' ? 'pt-6' : 'pt-10'}`}>
           <div className="max-w-[1600px] mx-auto">
             <AnimatePresence mode="wait">
               <motion.div
                 key={viewMode}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3, ease: "easeOut" }}
               >
                 {viewMode === 'overview' && (
                    <div className="animate-fadeIn relative">
                        {isEditMode && (
                            <div className="absolute top-0 right-0 z-50 flex justify-center w-full pointer-events-none">
                                <div className={`
                                    pointer-events-auto
                                    flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all
                                    ${isDarkMode 
                                    ? 'bg-[#0a0a0b]/90 border-indigo-500/50 hover:bg-indigo-500/10 text-gray-400 hover:text-indigo-400 backdrop-blur-md' 
                                    : 'bg-white/90 border-indigo-500 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 backdrop-blur-md'
                                    }
                                `}>
                                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                                        <Plus size={24} className={isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} />
                                    </div>
                                    <span className="font-medium">Customize Overview</span>
                                </div>
                            </div>
                        )}
                       <OverviewDashboard 
                         legislators={mockLegislators}
                         watchedLegislatorIds={watchedLegislatorIds}
                         onSelectLegislator={handleSelectLegislator}
                         chamberData={chamberData}
                         leadershipPositions={leadershipPositions}
                       />
                    </div>
                 )}

                 {viewMode === 'members' && (
                    <div className="flex gap-8 animate-fadeIn h-[calc(100vh-280px)]">
                       <div className="w-[400px] flex-shrink-0 flex flex-col min-h-0">
                          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                             <LegislatorList 
                                legislators={displayedLegislators}
                                selectedId={selectedLegislator?.id || null}
                                onSelect={setSelectedLegislator}
                                watchedIds={watchedLegislatorIds}
                                onToggleWatch={onToggleWatch}
                             />
                             {hasMore && (
                               <div className="flex justify-center pt-6 pb-4">
                                 <button
                                   onClick={() => setPage(p => p + 1)}
                                   className={`
                                     px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm
                                     ${isDarkMode 
                                       ? 'bg-white/10 hover:bg-white/20 text-white' 
                                       : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                                     }
                                   `}
                                 >
                                   Load More Members
                                 </button>
                               </div>
                             )}
                          </div>
                       </div>
                       <div className="flex-1 min-w-0 overflow-y-auto custom-scrollbar">
                          {selectedLegislator ? (
                             <LegislatorProfile 
                                legislator={selectedLegislator}
                                onNavigateToBill={onNavigateToBill}
                                onNavigateToElections={onNavigateToElections}
                                isWatched={watchedLegislatorIds?.has(selectedLegislator.id)}
                                onToggleWatch={() => onToggleWatch?.(selectedLegislator.id)}
                             />
                          ) : (
                             <div className={`h-full flex items-center justify-center border-2 border-dashed rounded-xl ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                                <div className="text-center">
                                   <User size={48} className="mx-auto mb-4 opacity-50" />
                                   <p>Select a legislator to view profile</p>
                                </div>
                             </div>
                          )}
                       </div>
                    </div>
                 )}

                 {viewMode === 'committees' && (
                    <div className="animate-fadeIn">
                       <CommitteesTab />
                    </div>
                 )}
               </motion.div>
             </AnimatePresence>
           </div>
         </div>
    </PageLayout>
  );
}
