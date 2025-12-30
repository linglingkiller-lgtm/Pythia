import React, { useState, useRef, useEffect } from 'react';
import { FileText, Filter, SortDesc, Plus, Download, Search, CheckCircle2, XCircle, Clock, AlertCircle, Eye, TrendingUp, Sparkles, ChevronRight, X, RefreshCw, Pin, CheckSquare } from 'lucide-react';
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

interface BillsPageProps {
  onNavigateToBill: (billId: string) => void;
}

type TabType = 'watchlist' | 'new-relevant' | 'at-risk' | 'moving-fast' | 'all';

export function BillsPage({ onNavigateToBill }: BillsPageProps) {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('watchlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBills, setSelectedBills] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Add Bills Modal
  const [showAddBillsModal, setShowAddBillsModal] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('12/19/25 3:42 PM');
  const [isSyncing, setIsSyncing] = useState(false);
  
  // Filters
  const [jurisdictionFilter, setJurisdictionFilter] = useState<'all' | 'federal' | 'state'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [issueTagFilter, setIssueTagFilter] = useState<string>('all');
  const [stanceFilter, setStanceFilter] = useState<string>('all');
  
  // Scroll state for header compression
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get Bills page theme
  const billsTheme = getPageTheme('Bills');

  // Dynamic title based on active tab
  const getPageTitle = () => {
    switch (activeTab) {
      case 'watchlist':
        return 'Watchlist';
      case 'new-relevant':
        return 'New & Relevant';
      case 'at-risk':
        return 'At Risk';
      case 'moving-fast':
        return 'Moving Fast';
      case 'all':
        return 'All Bills';
      default:
        return 'Bills';
    }
  };

  // Dynamic subtitle based on active tab
  const getSubtitle = () => {
    switch (activeTab) {
      case 'watchlist':
        return 'Priority bills requiring active monitoring';
      case 'new-relevant':
        return 'Recently introduced bills matching your interests';
      case 'at-risk':
        return 'Bills with high-risk flags or opposition stance';
      case 'moving-fast':
        return 'Bills with high momentum scores & fast-track status';
      case 'all':
        return `${filteredBills.length} / ${mockBills.length} bills tracked`;
      default:
        return 'Legislative tracking & intelligence';
    }
  };

  useEffect(() => {
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

  const getFilteredBills = (): Bill[] => {
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

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.billId.toLowerCase().includes(query) ||
        b.title.toLowerCase().includes(query) ||
        b.shortTitle.toLowerCase().includes(query) ||
        b.aiSummaryOneLine.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredBills = getFilteredBills();

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

  return (
    <div className={`
      h-full flex flex-col relative overflow-hidden transition-colors duration-500
      ${isDarkMode 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30'
      }
    `}>
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isDarkMode ? (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] animate-slow-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-blue-500/10 rounded-full blur-[130px] animate-slow-pulse" />
          </>
        ) : (
          <>
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/8 rounded-full blur-[100px]" />
          </>
        )}
      </div>

      {/* Gradient overlay at top */}
      <div className={`
        absolute top-0 left-0 right-0 h-40 pointer-events-none transition-opacity duration-500
        ${isDarkMode 
          ? 'bg-gradient-to-b from-blue-900/20 to-transparent' 
          : 'bg-gradient-to-b from-blue-50/40 to-transparent'
        }
      `} />

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
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="px-8">
          {/* Top Header Row */}
          <div className="flex items-center justify-between mb-4">
            {/* Left: Section Label (Pill) + Divider + Title + Subtitle */}
            <div className="flex items-center gap-3">
              {/* Section Label Pill - "Bills" */}
              <motion.div
                className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300"
                style={{
                  background: isDarkMode
                    ? `linear-gradient(135deg, ${hexToRgba(billsTheme.gradientFrom, 0.12)}, ${hexToRgba(billsTheme.gradientTo, 0.08)})`
                    : `linear-gradient(135deg, ${hexToRgba(billsTheme.gradientFrom, 0.08)}, ${hexToRgba(billsTheme.gradientTo, 0.06)})`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: isDarkMode
                    ? hexToRgba(billsTheme.accent, 0.25)
                    : hexToRgba(billsTheme.accent, 0.2),
                  boxShadow: isDarkMode
                    ? `0 0 18px ${hexToRgba(billsTheme.glow, 0.15)}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
                    : `0 0 12px ${hexToRgba(billsTheme.glow, 0.08)}, inset 0 1px 0 rgba(255, 255, 255, 0.4)`,
                }}
                whileHover={{
                  boxShadow: isDarkMode
                    ? `0 0 24px ${hexToRgba(billsTheme.glow, 0.22)}, inset 0 1px 0 rgba(255, 255, 255, 0.12)`
                    : `0 0 18px ${hexToRgba(billsTheme.glow, 0.12)}, inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                }}
              >
                {/* Icon with subtle pulse */}
                <div className="relative">
                  <FileText
                    className="w-4 h-4"
                    style={{
                      color: isDarkMode ? billsTheme.glow : billsTheme.accent,
                    }}
                  />
                  <div
                    className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{
                      backgroundColor: billsTheme.glow,
                    }}
                  />
                </div>
                <span
                  className="text-sm font-bold tracking-wide"
                  style={{
                    color: isDarkMode ? billsTheme.glow : billsTheme.accent,
                  }}
                >
                  Bills
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
                <motion.div
                  className="flex items-center gap-3"
                  animate={{
                    opacity: isScrolled ? 0 : 1,
                    height: isScrolled ? 0 : 'auto',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                    {getSubtitle()}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDarkMode ? 'bg-green-400' : 'bg-green-500'}`} />
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Synced {lastSynced}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20 disabled:opacity-50'
                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50'
                }`}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                Sync
              </button>
              <button
                onClick={() => setShowAddBillsModal(true)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isDarkMode
                    ? 'bg-blue-600/90 text-white hover:bg-blue-600 border border-blue-500/30'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700/20'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Bills
              </button>
            </div>
          </div>

          {/* Stats Row - Inline */}
          <motion.div
            className="flex items-center gap-2 pb-4"
            animate={{
              opacity: isScrolled ? 0.5 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Watchlist Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-yellow-900/10 border-yellow-500/20 hover:border-yellow-500/40'
                : 'bg-yellow-50 border-yellow-200 hover:border-yellow-300'
            }`}>
              <Pin className={`w-3 h-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                {mockBills.filter(b => b.isPinned).length}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
                Watchlist
              </span>
            </div>

            {/* At Risk Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-red-900/10 border-red-500/20 hover:border-red-500/40'
                : 'bg-red-50 border-red-200 hover:border-red-300'
            }`}>
              <AlertCircle className={`w-3 h-3 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-900'}`}>
                {mockBills.filter(b => b.flags.some(f => f.type === 'high-risk') || b.stance === 'oppose').length}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-red-400/70' : 'text-red-700'}`}>
                At Risk
              </span>
            </div>

            {/* Moving Fast Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-orange-900/10 border-orange-500/20 hover:border-orange-500/40'
                : 'bg-orange-50 border-orange-200 hover:border-orange-300'
            }`}>
              <TrendingUp className={`w-3 h-3 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-orange-300' : 'text-orange-900'}`}>
                {mockBills.filter(b => b.momentumScore > 70).length}
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-orange-400/70' : 'text-orange-700'}`}>
                Moving Fast
              </span>
            </div>

            {/* New & Relevant Stat */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
              isDarkMode
                ? 'bg-blue-900/10 border-blue-500/20 hover:border-blue-500/40'
                : 'bg-blue-50 border-blue-200 hover:border-blue-300'
            }`}>
              <Sparkles className={`w-3 h-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-xs font-semibold ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                2
              </span>
              <span className={`text-[10px] font-medium ${isDarkMode ? 'text-blue-400/70' : 'text-blue-700'}`}>
                New & Relevant
              </span>
            </div>

            {/* Divider */}
            <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`} />

            {/* Search - Compact */}
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
                  placeholder="Search bills..."
                  className={`w-full pl-8 pr-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    isDarkMode
                      ? 'bg-slate-800/40 border-white/10 text-white placeholder-slate-500 focus:bg-slate-800 focus:border-blue-500/30'
                      : 'bg-white/60 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-300'
                  }`}
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                showFilters
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'border border-white/10 text-slate-300 hover:bg-white/5 hover:border-white/20'
                  : 'border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              Filters
            </button>
          </motion.div>

          {/* Tab Pills - Prominent Full-Width Row */}
          <motion.div
            className={`flex items-center justify-start gap-2 pb-4 border-t pt-4 ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}
            animate={{
              opacity: isScrolled ? 0.7 : 1,
            }}
            transition={{ duration: 0.25 }}
          >
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.key
                    ? isDarkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                    : isDarkMode
                    ? 'bg-slate-800/40 text-slate-300 hover:bg-slate-700/50 border border-white/10 hover:border-white/20'
                    : 'bg-white/60 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.key
                    ? tab.key === 'at-risk'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-white/30 text-white'
                    : isDarkMode
                    ? 'bg-slate-700/50 text-slate-400'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden pb-4"
              >
                <div className={`pt-4 border-t grid grid-cols-4 gap-3 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Jurisdiction
                    </label>
                    <select
                      value={jurisdictionFilter}
                      onChange={e => setJurisdictionFilter(e.target.value as any)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="state">State</option>
                      <option value="federal">Federal</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="introduced">Introduced</option>
                      <option value="committee">Committee</option>
                      <option value="floor">Floor</option>
                      <option value="passed-chamber">Passed Chamber</option>
                      <option value="governor">Governor</option>
                      <option value="signed">Signed</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Issue Tag
                    </label>
                    <select
                      value={issueTagFilter}
                      onChange={e => setIssueTagFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      {allIssueTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-[10px] font-bold uppercase tracking-wider mb-1.5 ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                      Stance
                    </label>
                    <select
                      value={stanceFilter}
                      onChange={e => setStanceFilter(e.target.value)}
                      className={`w-full px-3 py-2 text-xs border rounded-lg font-medium transition-all ${
                        isDarkMode
                          ? 'bg-slate-800/50 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="all">All</option>
                      <option value="support">Support</option>
                      <option value="oppose">Oppose</option>
                      <option value="monitor">Monitor</option>
                      <option value="neutral">Neutral</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-8 py-6 relative z-10" ref={scrollRef}>
        {/* Bills List */}
        <div className="space-y-4">
          {/* Select All Header */}
          {filteredBills.length > 0 && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={`
                flex items-center gap-3 px-5 py-3 rounded-xl border backdrop-blur-sm transition-all duration-500
                ${isDarkMode 
                  ? 'bg-slate-900/40 border-white/10' 
                  : 'bg-white/60 border-gray-200'
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedBills.size === filteredBills.length && filteredBills.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className={`
                text-sm font-medium transition-colors duration-500
                ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}
              `}>
                {selectedBills.size > 0 
                  ? `${selectedBills.size} of ${filteredBills.length} selected`
                  : 'Select all'
                }
              </span>
            </motion.div>
          )}

          {/* Bill Rows */}
          <AnimatePresence mode="popLayout">
            {filteredBills.map((bill, index) => (
              <motion.div
                key={bill.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: prefersReducedMotion ? 0 : 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
                layout
              >
                <BillRow
                  bill={bill}
                  isSelected={selectedBills.has(bill.id)}
                  onSelect={handleSelectBill}
                  onNavigate={onNavigateToBill}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty State */}
          {filteredBills.length === 0 && (
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`
                p-16 text-center rounded-2xl backdrop-blur-xl border transition-all duration-500
                ${isDarkMode 
                  ? 'bg-slate-900/40 border-white/10' 
                  : 'bg-white/60 border-gray-200'
                }
              `}
            >
              <div className={`
                mb-4 transition-colors duration-500
                ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}
              `}>
                <CheckSquare size={64} className="mx-auto" />
              </div>
              <h3 className={`
                text-xl font-bold mb-2 transition-colors duration-500
                ${isDarkMode ? 'text-white' : 'text-gray-900'}
              `}>
                No bills found
              </h3>
              <p className={`
                text-sm transition-colors duration-500
                ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {searchQuery || showFilters
                  ? 'Try adjusting your search or filters'
                  : 'No bills match the selected tab criteria'
                }
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Add Bills Modal */}
      <AddBillsModal
        isOpen={showAddBillsModal}
        onClose={() => setShowAddBillsModal(false)}
        onAddBills={handleAddBills}
      />
    </div>
  );
}