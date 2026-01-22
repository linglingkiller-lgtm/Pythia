import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  FileText, Filter, SortDesc, Plus, Download, Search, CheckCircle2, XCircle, 
  Clock, AlertCircle, Eye, TrendingUp, Sparkles, ChevronRight, X, RefreshCw, 
  Pin, CheckSquare, Menu, ChevronDown, Bell, Settings 
} from 'lucide-react';
import { mockBills, type Bill } from '../../data/billsData';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';
import { getPageTheme, hexToRgba } from '../../config/pageThemes';
import { BillRow } from './BillRow';
import { AddBillsModal } from './AddBillsModal';
import type { BillImportItem } from './AddBillsModal';
import { toast } from 'sonner';
import { PageLayout } from '../ui/PageLayout';
import { useAskPythia } from '../../contexts/AskPythiaContext';

interface BillsPageProps {
  onNavigateToBill: (billId: string) => void;
}

type TabType = 'watchlist' | 'new-relevant' | 'at-risk' | 'moving-fast' | 'all';

export function BillsPage({ onNavigateToBill }: BillsPageProps) {
  const { isDarkMode } = useTheme();
  const { openPythia } = useAskPythia();
  
  // Page State
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Add Bills Modal
  const [showAddBillsModal, setShowAddBillsModal] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('12/19/25 3:42 PM');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Filters
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'all' | 'federal' | 'state'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [issueTagFilter, setIssueTagFilter] = useState<string>('all');
  const [stanceFilter, setStanceFilter] = useState<string>('all');
  
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

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, activeTab, jurisdictionFilter, statusFilter, issueTagFilter, stanceFilter]);
  
  // Get Bills page theme
  const billsTheme = getPageTheme('Bills');

  // Dynamic title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'watchlist': return 'Watchlist';
      case 'new-relevant': return 'New & Relevant';
      case 'at-risk': return 'At Risk';
      case 'moving-fast': return 'Moving Fast';
      case 'all': return 'All Bills';
      default: return 'Bills';
    }
  };

  // Dynamic subtitle based on active tab
  const getSubtitle = () => {
    switch (activeTab) {
      case 'watchlist': return 'Priority bills requiring active monitoring';
      case 'new-relevant': return 'Recently introduced bills matching your interests';
      case 'at-risk': return 'Bills with high-risk flags or opposition stance';
      case 'moving-fast': return 'Bills with high momentum scores & fast-track status';
      case 'all': return `${filteredBills.length} / ${mockBills.length} bills tracked`;
      default: return 'Legislative tracking & intelligence';
    }
  };

  const filteredBills = useMemo(() => {
    let filtered = mockBills;

    // Tab filtering
    switch (activeTab) {
      case 'watchlist':
        filtered = filtered.filter(b => b.isPinned);
        break;
      case 'new-relevant':
        filtered = filtered.filter(b => {
          const billDate = new Date(b.versions[0].date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return billDate > weekAgo;
        });
        break;
      case 'at-risk':
        filtered = filtered.filter(b => b.flags.some(f => f.type === 'high-risk') || b.stance === 'oppose');
        break;
      case 'moving-fast':
        filtered = filtered.filter(b => b.momentumScore > 70 || b.flags.some(f => f.type === 'fast-track'));
        break;
      case 'all':
      default:
        break;
    }

    // Apply other filters
    if (jurisdictionFilter !== 'all') {
      filtered = filtered.filter(b => b.jurisdiction === jurisdictionFilter);
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (issueTagFilter !== 'all') {
      filtered = filtered.filter(b => b.issueTags.includes(issueTagFilter));
    }
    if (stanceFilter !== 'all') {
      filtered = filtered.filter(b => b.stance === stanceFilter);
    }

    // Search filtering (Debounced)
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.billId.toLowerCase().includes(query) ||
        b.title.toLowerCase().includes(query) ||
        b.shortTitle.toLowerCase().includes(query) ||
        b.aiSummaryOneLine.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeTab, jurisdictionFilter, statusFilter, issueTagFilter, stanceFilter, debouncedSearchQuery]);

  const displayedBills = filteredBills.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = displayedBills.length < filteredBills.length;

  const handleSelectBill = (billId: string) => {
    const newSelected = new Set(selectedBills);
    if (newSelected.has(billId)) {
      newSelected.delete(billId);
    } else {
      newSelected.add(billId);
    }
    setSelectedBills(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBills.size === filteredBills.length) {
      setSelectedBills(new Set());
    } else {
      setSelectedBills(new Set(filteredBills.map(b => b.id)));
    }
  };

  const tabs: { key: TabType; label: string; count: number }[] = [
    { key: 'watchlist', label: 'Watchlist', count: mockBills.filter(b => b.isPinned).length },
    { key: 'new-relevant', label: 'New & Relevant', count: 2 },
    { key: 'at-risk', label: 'At Risk', count: mockBills.filter(b => b.flags.some(f => f.type === 'high-risk') || b.stance === 'oppose').length },
    { key: 'moving-fast', label: 'Moving Fast', count: mockBills.filter(b => b.momentumScore > 70).length },
    { key: 'all', label: 'All Bills', count: mockBills.length },
  ];

  const allIssueTags = Array.from(new Set(mockBills.flatMap(b => b.issueTags)));

  const handleAddBills = (items: BillImportItem[]) => {
    toast.success(`Added ${items.length} ${items.length === 1 ? 'bill' : 'bills'} to tracking`);
    
    setLastSynced(new Date().toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: '2-digit',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }));
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    toast.info('Syncing bills from AZLeg.gov...');
    
    setTimeout(() => {
      setIsSyncing(false);
      setLastSynced(new Date().toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }));
      toast.success('Bills synced successfully');
    }, 2000);
  };

  // Header Props for PageLayout
  const headerContent = (
    <div className="flex items-center gap-3">
        <button 
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20' : 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'}`}
        >
            <Pin size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{mockBills.filter(b => b.isPinned).length} Watchlist</span>
        </button>
        <button 
            onClick={() => setActiveTab('at-risk')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20' : 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'}`}
        >
            <AlertCircle size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{mockBills.filter(b => b.flags.some(f => f.type === 'high-risk') || b.stance === 'oppose').length} At Risk</span>
        </button>
        <button 
            onClick={() => setActiveTab('moving-fast')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95 cursor-pointer ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`}
        >
            <TrendingUp size={14} strokeWidth={2.5} />
            <span className="text-xs font-bold">{mockBills.filter(b => b.momentumScore > 70).length} Moving Fast</span>
        </button>
    </div>
  );

  const pageActions = (
    <div className="flex items-center gap-8 pb-1.5 pr-12">
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
                    backgroundColor: isDarkMode ? 'white' : billsTheme.accent,
                    boxShadow: isDarkMode ? '0 0 15px rgba(255,255,255,0.8)' : `0 0 10px ${hexToRgba(billsTheme.accent, 0.4)}`
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
      subtitle={getSubtitle()}
      accentColor={billsTheme.accent}
      headerIcon={
        <FileText 
          size={28} 
          color={isDarkMode ? "white" : billsTheme.accent} 
          strokeWidth={2.5}
          className={isDarkMode ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}
        />
      }
      backgroundImage={
        <FileText 
          size={450} 
          color={isDarkMode ? "white" : billsTheme.accent} 
          strokeWidth={0.5}
        />
      }
      headerContent={headerContent}
      pageActions={pageActions}
    >
      <div className="p-8 pb-32 max-w-[1920px] mx-auto space-y-8">
        {/* Sync Status Bar */}
        <div className={`sticky top-0 z-30 flex items-center justify-between -mx-8 -mt-8 px-8 py-4 border-b backdrop-blur-md transition-colors ${
          isDarkMode ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-gray-200'
        }`}>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {isSyncing ? 'Syncing with AZLeg.gov...' : 'Live Sync Active'}
                </span>
             </div>
             <div className={`h-4 w-[1px] ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
             <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
               Last updated: {lastSynced}
             </span>
          </div>

          <div className="flex items-center gap-3">
             <Button
               variant="outline"
               size="sm"
               onClick={handleSyncNow}
               disabled={isSyncing}
               className={isDarkMode ? 'border-white/10 hover:bg-white/5' : ''}
             >
                <RefreshCw size={14} className={`mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync Now
             </Button>
             <Button
               variant="primary"
               size="sm"
               onClick={() => setShowAddBillsModal(true)}
               className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
             >
                <Plus size={16} className="mr-1" />
                Add Bills
             </Button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <div className={`relative flex-1 max-w-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search bills by ID, title, or keywords..." 
                   className={`w-full pl-10 pr-4 py-2.5 rounded-lg border outline-none transition-all ${
                     isDarkMode 
                       ? 'bg-[#0A0A0A] border-white/10 focus:border-white/20' 
                       : 'bg-white border-gray-200 focus:border-indigo-500'
                   }`}
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
              </div>

              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setShowFilters(!showFilters)}
                   className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors ${
                     showFilters
                       ? (isDarkMode ? 'bg-white/10 border-white/20 text-white' : 'bg-gray-100 border-gray-300 text-gray-900')
                       : (isDarkMode ? 'bg-[#0A0A0A] border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-600 hover:text-gray-900')
                   }`}
                 >
                    <Filter size={16} />
                    <span className="text-sm font-medium">Filters</span>
                    {(jurisdictionFilter !== 'all' || statusFilter !== 'all' || issueTagFilter !== 'all' || stanceFilter !== 'all') && (
                      <span className="w-2 h-2 bg-indigo-500 rounded-full ml-1" />
                    )}
                 </button>

                 <div className={`h-8 w-[1px] mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

                 <div className="flex bg-gray-100/5 p-1 rounded-lg border border-transparent">
                    <button className={`p-2 rounded-md ${isDarkMode ? 'text-white bg-white/10 shadow-sm' : 'text-gray-900 bg-white shadow-sm'}`}>
                       <SortDesc size={16} />
                    </button>
                 </div>
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
                 <div className={`p-4 rounded-xl border grid grid-cols-4 gap-4 ${
                   isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-gray-100'
                 }`}>
                    {/* Jurisdiction */}
                    <div className="space-y-2">
                       <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Jurisdiction</label>
                       <select 
                         value={jurisdictionFilter}
                         onChange={(e) => setJurisdictionFilter(e.target.value as any)}
                         className={`w-full p-2 rounded-lg text-sm outline-none border ${
                           isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                         }`}
                       >
                         <option value="all">All Jurisdictions</option>
                         <option value="federal">Federal (US)</option>
                         <option value="state">State (AZ)</option>
                       </select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                       <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Status</label>
                       <select 
                         value={statusFilter}
                         onChange={(e) => setStatusFilter(e.target.value)}
                         className={`w-full p-2 rounded-lg text-sm outline-none border ${
                           isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                         }`}
                       >
                         <option value="all">All Statuses</option>
                         <option value="introduced">Introduced</option>
                         <option value="in_committee">In Committee</option>
                         <option value="crossed_over">Crossed Over</option>
                         <option value="passed">Passed</option>
                       </select>
                    </div>

                    {/* Issue Area */}
                    <div className="space-y-2">
                       <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Issue Area</label>
                       <select 
                         value={issueTagFilter}
                         onChange={(e) => setIssueTagFilter(e.target.value)}
                         className={`w-full p-2 rounded-lg text-sm outline-none border ${
                           isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                         }`}
                       >
                         <option value="all">All Issues</option>
                         {allIssueTags.map(tag => (
                           <option key={tag} value={tag}>{tag}</option>
                         ))}
                       </select>
                    </div>

                    {/* Stance */}
                    <div className="space-y-2">
                       <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>My Stance</label>
                       <select 
                         value={stanceFilter}
                         onChange={(e) => setStanceFilter(e.target.value)}
                         className={`w-full p-2 rounded-lg text-sm outline-none border ${
                           isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
                         }`}
                       >
                         <option value="all">Any Stance</option>
                         <option value="support">Support</option>
                         <option value="oppose">Oppose</option>
                         <option value="monitor">Monitor</option>
                       </select>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Bulk Actions (if selection) */}
        <AnimatePresence>
          {selectedBills.size > 0 && (
             <motion.div
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className={`flex items-center justify-between p-4 rounded-xl border ${
                 isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-200'
               }`}
             >
                <div className="flex items-center gap-3">
                   <div className="flex items-center justify-center w-6 h-6 rounded bg-indigo-500 text-white text-xs font-bold">
                      {selectedBills.size}
                   </div>
                   <span className={`text-sm font-medium ${isDarkMode ? 'text-indigo-200' : 'text-indigo-900'}`}>
                      bills selected
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <Button size="sm" variant="ghost" className="hover:bg-white/10">Export Summary</Button>
                   <Button size="sm" variant="ghost" className="hover:bg-white/10">Add to Briefing</Button>
                   <Button size="sm" className="bg-indigo-600 text-white border-none hover:bg-indigo-700">Batch Analysis</Button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Bills List */}
        <div className="space-y-4">
          <div className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto_auto] gap-4 px-6 py-2 text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
             <div className="w-8">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-600 bg-transparent"
                  checked={selectedBills.size === filteredBills.length && filteredBills.length > 0}
                  onChange={handleSelectAll}
                />
             </div>
             <div>Bill / Summary</div>
             <div className="w-32">Status</div>
             <div className="w-24">Momentum</div>
             <div className="w-24">Stance</div>
             <div className="w-32">Next Action</div>
             <div className="w-8"></div>
          </div>

          <AnimatePresence mode="popLayout">
            {displayedBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <BillRow 
                  bill={bill} 
                  isSelected={selectedBills.has(bill.id)}
                  onSelect={() => handleSelectBill(bill.id)}
                  onNavigate={() => onNavigateToBill(bill.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {displayedBills.length === 0 && (
             <div className={`flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl ${
                isDarkMode ? 'border-white/10' : 'border-gray-200'
             }`}>
                <FileText size={48} className={`mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                <h3 className={`text-lg font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No bills found</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Try adjusting your search or filters</p>
                <Button 
                   variant="outline" 
                   className="mt-6"
                   onClick={() => {
                      setSearchQuery('');
                      setJurisdictionFilter('all');
                      setStatusFilter('all');
                      setIssueTagFilter('all');
                      setStanceFilter('all');
                   }}
                >
                   Clear Filters
                </Button>
             </div>
          )}

          {hasMore && (
             <div className="flex justify-center pt-8">
                <Button 
                  variant="outline" 
                  onClick={() => setPage(p => p + 1)}
                  className="min-w-[200px]"
                >
                  Load More
                </Button>
             </div>
          )}
        </div>
      </div>

      <AddBillsModal 
        isOpen={showAddBillsModal}
        onClose={() => setShowAddBillsModal(false)}
        onAddBills={handleAddBills}
      />
    </PageLayout>
  );
}
